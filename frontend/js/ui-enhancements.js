(function () {

  "use strict";


  const nativeFetch =
    window.fetch.bind(window);


  let pendingRequests = 0;
  let progress = null;
  let progressValue = 0;
  let finishTimer = null;


  /* =========================================================
     FETCH / LOADING
  ========================================================= */

  function ensureProgress() {

    if (progress) {
      return progress;
    }


    progress =
      document.createElement(
        "div"
      );


    progress.className =
      "ui-loading-line";


    document.body.appendChild(
      progress
    );


    return progress;
  }


  function startProgress() {

    if (!document.body) {
      return;
    }


    const bar =
      ensureProgress();


    pendingRequests++;


    window.clearTimeout(
      finishTimer
    );


    if (
      progressValue <= 0 ||
      progressValue >= 100
    ) {

      progressValue = 12;
    }


    bar.classList.add(
      "active"
    );


    bar.style.width =
      progressValue + "%";


    window.setTimeout(
      function () {

        if (
          pendingRequests > 0 &&
          progressValue < 72
        ) {

          progressValue =
            Math.min(
              72,
              progressValue + 25
            );


          bar.style.width =
            progressValue + "%";
        }
      },
      120
    );
  }


  function finishProgress() {

    pendingRequests =
      Math.max(
        0,
        pendingRequests - 1
      );


    if (
      pendingRequests !== 0 ||
      !progress
    ) {
      return;
    }


    progressValue = 100;

    progress.style.width =
      "100%";


    finishTimer =
      window.setTimeout(
        function () {

          if (!progress) {
            return;
          }


          progress.classList.remove(
            "active"
          );


          window.setTimeout(
            function () {

              if (!progress) {
                return;
              }


              progress.style.width =
                "0%";


              progressValue = 0;

            },
            190
          );

        },
        140
      );
  }


  window.fetch =
    async function () {

      const args =
        Array.prototype.slice.call(
          arguments
        );


      const first =
        args[0];


      const url =
        typeof first === "string"
          ? first
          : first &&
            typeof first.url === "string"
              ? first.url
              : "";


      const track =
        url.includes("/api/");


      if (track) {
        startProgress();
      }


      try {

        return await nativeFetch.apply(
          window,
          args
        );

      }
      finally {

        if (track) {
          finishProgress();
        }
      }
    };


  /* =========================================================
     HELPERS DO CRONOMETRO
  ========================================================= */

  function pad(value) {

    return String(value)
      .padStart(2, "0");
  }


  function formatTime(ms) {

    const totalSeconds =
      Math.max(
        0,
        Math.floor(ms / 1000)
      );


    const hours =
      Math.floor(
        totalSeconds / 3600
      );


    const minutes =
      Math.floor(
        (
          totalSeconds % 3600
        ) / 60
      );


    const seconds =
      totalSeconds % 60;


    return (
      pad(hours) +
      ":" +
      pad(minutes) +
      ":" +
      pad(seconds)
    );
  }


  function dayKey(timestamp) {

    const date =
      new Date(timestamp);


    return (
      date.getFullYear() +
      "-" +
      pad(
        date.getMonth() + 1
      ) +
      "-" +
      pad(
        date.getDate()
      )
    );
  }


  function nextMidnight(
    timestamp
  ) {

    const date =
      new Date(timestamp);


    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
      0,
      0,
      0,
      0
    ).getTime();
  }


  function createDefaultState() {

    return {
      running: false,
      sessionMs: 0,
      lastTickAt: null,
      daily: {},
    };
  }


  function normalizeState(value) {

    const fallback =
      createDefaultState();


    if (
      !value ||
      typeof value !== "object"
    ) {

      return fallback;
    }


    return {
      running:
        Boolean(value.running),

      sessionMs:
        Number(value.sessionMs) || 0,

      lastTickAt:
        Number(value.lastTickAt) || null,

      daily:
        value.daily &&
        typeof value.daily === "object"
          ? value.daily
          : {},
    };
  }


  async function getTimerKey() {

    try {

      const response =
        await nativeFetch(
          "/api/auth/me",
          {
            method: "GET",
            credentials:
              "same-origin",
          }
        );


      if (response.ok) {

        const data =
          await response.json();


        const user =
          data.usuario ||
          data;


        if (user && user.id) {

          return (
            "jankinho_study_timer_v2_" +
            user.id
          );
        }
      }

    }
    catch (error) {

      console.debug(
        "Timer user:",
        error
      );
    }


    return (
      "jankinho_study_timer_v2_local"
    );
  }


  /* =========================================================
     TIMER
  ========================================================= */

  async function initTimer() {

    const header =
      document.querySelector(
        ".header"
      );


    if (!header) {
      return;
    }


    const key =
      await getTimerKey();


    let state;


    try {

      state =
        normalizeState(
          JSON.parse(
            localStorage.getItem(
              key
            ) ||
            "null"
          )
        );

    }
    catch {

      state =
        createDefaultState();
    }


    function save() {

      localStorage.setItem(
        key,
        JSON.stringify(state)
      );
    }


    function applyElapsed(now) {

      if (
        !state.running
      ) {
        return;
      }


      let start =
        Number(
          state.lastTickAt
        ) || now;


      if (start > now) {
        start = now;
      }


      while (
        start < now
      ) {

        const end =
          Math.min(
            nextMidnight(start),
            now
          );


        const elapsed =
          Math.max(
            0,
            end - start
          );


        const keyDay =
          dayKey(start);


        state.daily[keyDay] =
          (
            Number(
              state.daily[keyDay]
            ) || 0
          ) +
          elapsed;


        state.sessionMs +=
          elapsed;


        start = end;
      }


      state.lastTickAt =
        now;
    }


    if (
      state.running
    ) {

      applyElapsed(
        Date.now()
      );


      save();
    }


    const root =
      document.createElement(
        "div"
      );


    root.className =
      "study-timer";


    root.innerHTML =
      [
        '<button type="button" class="study-timer-button" aria-label="Cronometro de estudos">',
        '<span class="study-timer-dot"></span>',
        '<span class="study-timer-icon">\u23f1</span>',
        '<span class="study-timer-time">00:00:00</span>',
        '</button>',

        '<div class="study-timer-panel">',

        '<div class="study-timer-panel-title">',
        'Cron\u00f4metro de estudos',
        '</div>',

        '<div class="study-timer-panel-subtitle">',
        'Seu tempo continua mesmo trocando de p\u00e1gina.',
        '</div>',

        '<div class="study-timer-display">',
        '<strong class="study-session-time">00:00:00</strong>',
        '<span>Sess\u00e3o atual</span>',
        '</div>',

        '<div class="study-timer-today">',
        '<span>Tempo estudado hoje</span>',
        '<strong class="study-today-time">00:00:00</strong>',
        '</div>',

        '<div class="study-timer-actions">',
        '<button type="button" class="study-timer-start">Iniciar</button>',
        '<button type="button" class="study-timer-reset">Zerar sess\u00e3o</button>',
        '</div>',

        '<div class="study-timer-status">',
        'Cron\u00f4metro parado',
        '</div>',

        '</div>'
      ].join("");


    const headerUser =
      header.querySelector(
        ".header-user"
      );


    if (headerUser) {

      header.insertBefore(
        root,
        headerUser
      );

    }
    else {

      header.appendChild(
        root
      );
    }


    const mainButton =
      root.querySelector(
        ".study-timer-button"
      );


    const topTime =
      root.querySelector(
        ".study-timer-time"
      );


    const sessionTime =
      root.querySelector(
        ".study-session-time"
      );


    const todayTime =
      root.querySelector(
        ".study-today-time"
      );


    const startButton =
      root.querySelector(
        ".study-timer-start"
      );


    const resetButton =
      root.querySelector(
        ".study-timer-reset"
      );


    const status =
      root.querySelector(
        ".study-timer-status"
      );


    function render() {

      const session =
        state.sessionMs;


      const today =
        Number(
          state.daily[
            dayKey(
              Date.now()
            )
          ]
        ) || 0;


      const formatted =
        formatTime(session);


      topTime.textContent =
        formatted;


      sessionTime.textContent =
        formatted;


      todayTime.textContent =
        formatTime(today);


      mainButton.classList.toggle(
        "running",
        state.running
      );


      startButton.textContent =
        state.running
          ? "Pausar"
          : "Iniciar";


      status.textContent =
        state.running
          ? "Contabilizando seu tempo de estudo"
          : "Cron\u00f4metro parado";
    }


    function tick() {

      if (
        state.running
      ) {

        applyElapsed(
          Date.now()
        );


        save();
      }


      render();
    }


    mainButton.addEventListener(
      "click",
      function (event) {

        event.stopPropagation();


        root.classList.toggle(
          "open"
        );
      }
    );


    startButton.addEventListener(
      "click",
      function () {

        if (
          state.running
        ) {

          applyElapsed(
            Date.now()
          );


          state.running =
            false;


          state.lastTickAt =
            null;

        }
        else {

          state.running =
            true;


          state.lastTickAt =
            Date.now();
        }


        save();
        render();
      }
    );


    resetButton.addEventListener(
      "click",
      function () {

        /*
         * Zera somente a sessao.
         * O total de hoje continua salvo.
         */
        state.sessionMs = 0;


        if (
          state.running
        ) {

          state.lastTickAt =
            Date.now();
        }


        save();
        render();
      }
    );


    document.addEventListener(
      "click",
      function (event) {

        if (
          !root.contains(
            event.target
          )
        ) {

          root.classList.remove(
            "open"
          );
        }
      }
    );


    window.addEventListener(
      "beforeunload",
      function () {

        if (
          state.running
        ) {

          applyElapsed(
            Date.now()
          );


          save();
        }
      }
    );


    render();


    window.setInterval(
      tick,
      1000
    );
  }


  /* =========================================================
     REVEAL AUTOMATICO
  ========================================================= */

  function initRevealObserver() {

    const observer =
      new MutationObserver(
        function (mutations) {

          for (
            const mutation
            of mutations
          ) {

            if (
              mutation.type !==
              "attributes"
            ) {
              continue;
            }


            const element =
              mutation.target;


            if (
              !(element instanceof HTMLElement)
            ) {
              continue;
            }


            const oldValue =
              mutation.oldValue ||
              "";


            if (
              oldValue.includes(
                "hidden"
              ) &&
              !element.classList.contains(
                "hidden"
              )
            ) {

              element.classList.remove(
                "ui-reveal"
              );


              void element.offsetWidth;


              element.classList.add(
                "ui-reveal"
              );
            }
          }
        }
      );


    observer.observe(
      document.body,
      {
        subtree: true,
        attributes: true,
        attributeFilter: [
          "class"
        ],
        attributeOldValue: true,
      }
    );
  }



  /* CORTEX GLOBAL INTERACTION CONTRAST V2 */
  function initGlobalInteractionContrast() {

    if (
      document.getElementById(
        "cortex-global-interaction-contrast"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "cortex-global-interaction-contrast";

    style.textContent =
      "\n:root{--cortex-ok:#00e676;--cortex-ok-rgb:0,230,118;--cortex-bad:#ff2d55;--cortex-bad-rgb:255,45,85}\n\n/* Estados neutros mais legiveis */\nhtml[data-theme] body :is(\n  .session-option,.sim-option,.filter-chip,.receptor-card,.flash-category-option,\n  .mode-button,.check-chip,.area-option,.control-tab,.tool-button,.theme-choice,\n  .course-tabs button,.correct-selector,.question-option,.alternative,.alternative-card\n):not(.active):not(.selected):not(.correct):not(.wrong):not(:disabled){\n  border-color:rgba(255,255,255,.24)!important;\n  background:rgba(255,255,255,.045)!important;\n  color:var(--theme-text-soft,#e5e5e5)!important;\n  box-shadow:inset 0 0 0 1px rgba(255,255,255,.03)!important;\n  opacity:1!important\n}\n\n/* Selecionado/ativo */\nhtml[data-theme] body :is(\n  .session-option.selected,.sim-option.selected,.filter-chip.active,.receptor-card.active,\n  .flash-category-option.active,.mode-button.active,.check-chip.active,.area-option.active,\n  .review-button.active,.control-tab.active,.tool-button.active,.color-chip.active,\n  .theme-choice.active,.course-tabs button.active,.correct-selector.active,.toolbar-button.active,\n  .favorite-button.active,.compare-toggle.active,.modal-header-actions button.active,\n  [aria-selected=\"true\"],[aria-pressed=\"true\"]\n){\n  border-color:var(--theme-accent,#ff7a18)!important;\n  background:linear-gradient(135deg,rgba(var(--theme-accent-rgb,249,115,22),.36),rgba(var(--theme-accent-rgb,249,115,22),.18))!important;\n  color:var(--theme-text,#fff)!important;\n  box-shadow:0 0 0 2px rgba(var(--theme-accent-rgb,249,115,22),.28),0 0 26px rgba(var(--theme-accent-rgb,249,115,22),.22),inset 0 0 0 1px rgba(255,255,255,.08)!important;\n  opacity:1!important\n}\n\n/* Correta - sempre verde */\nhtml[data-theme] body :is(\n  .session-option.correct,.sim-option.correct,.quiz-options button.correct,\n  .question-option.correct,.alternative.correct,.alternative-card.correct,.answer-option.correct\n){\n  border:2px solid var(--cortex-ok)!important;\n  background:linear-gradient(135deg,rgba(var(--cortex-ok-rgb),.42),rgba(var(--cortex-ok-rgb),.20))!important;\n  color:#f3fff8!important;\n  box-shadow:0 0 0 2px rgba(var(--cortex-ok-rgb),.22),0 0 30px rgba(var(--cortex-ok-rgb),.30),inset 5px 0 0 var(--cortex-ok)!important;\n  opacity:1!important\n}\n\n/* Errada - sempre vermelho */\nhtml[data-theme] body :is(\n  .session-option.wrong,.sim-option.wrong,.quiz-options button.wrong,\n  .question-option.wrong,.alternative.wrong,.alternative-card.wrong,.answer-option.wrong\n){\n  border:2px solid var(--cortex-bad)!important;\n  background:linear-gradient(135deg,rgba(var(--cortex-bad-rgb),.44),rgba(var(--cortex-bad-rgb),.20))!important;\n  color:#fff5f7!important;\n  box-shadow:0 0 0 2px rgba(var(--cortex-bad-rgb),.22),0 0 30px rgba(var(--cortex-bad-rgb),.30),inset 5px 0 0 var(--cortex-bad)!important;\n  opacity:1!important\n}\n\nhtml[data-theme] body :is(.session-option.correct,.sim-option.correct) .option-letter{\n  border-color:var(--cortex-ok)!important;background:var(--cortex-ok)!important;color:#02170b!important;\n  box-shadow:0 0 18px rgba(var(--cortex-ok-rgb),.46)!important\n}\nhtml[data-theme] body :is(.session-option.wrong,.sim-option.wrong) .option-letter{\n  border-color:var(--cortex-bad)!important;background:var(--cortex-bad)!important;color:#fff!important;\n  box-shadow:0 0 18px rgba(var(--cortex-bad-rgb),.46)!important\n}\n\n/* Texto explicito para nao depender so da cor */\nhtml[data-theme] body .session-option.correct::after,\nhtml[data-theme] body .sim-option.correct::after{\n  content:\"✓ CORRETA\"!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;\n  flex:0 0 auto!important;margin-left:auto!important;border-radius:999px!important;background:var(--cortex-ok)!important;\n  padding:5px 9px!important;color:#02170b!important;font-size:10px!important;font-weight:900!important;\n  letter-spacing:.045em!important;line-height:1!important;white-space:nowrap!important;\n  box-shadow:0 0 14px rgba(var(--cortex-ok-rgb),.34)!important\n}\nhtml[data-theme] body .session-option.wrong::after,\nhtml[data-theme] body .sim-option.wrong::after{\n  content:\"✕ ERRADA\"!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;\n  flex:0 0 auto!important;margin-left:auto!important;border-radius:999px!important;background:var(--cortex-bad)!important;\n  padding:5px 9px!important;color:#fff!important;font-size:10px!important;font-weight:900!important;\n  letter-spacing:.045em!important;line-height:1!important;white-space:nowrap!important;\n  box-shadow:0 0 14px rgba(var(--cortex-bad-rgb),.34)!important\n}\n\n/* Outros feedbacks */\nhtml[data-theme] body :is(.activity-result.correct,.guided-feedback.correct,.result-icon.correct){\n  border-color:var(--cortex-ok)!important;background:rgba(var(--cortex-ok-rgb),.22)!important;color:#c8ffdf!important\n}\nhtml[data-theme] body :is(.activity-result.wrong,.guided-feedback.wrong,.result-icon.wrong,.wrong-item){\n  border-color:var(--cortex-bad)!important;background:rgba(var(--cortex-bad-rgb),.20)!important;color:#ffd6df!important\n}\n\n/* Checkbox/radio */\nhtml[data-theme] body input[type=\"checkbox\"],\nhtml[data-theme] body input[type=\"radio\"]{accent-color:var(--theme-accent,#ff7a18)!important}\nhtml[data-theme] body input[type=\"checkbox\"]:not(:checked):not(:disabled),\nhtml[data-theme] body input[type=\"radio\"]:not(:checked):not(:disabled){\n  outline:1px solid rgba(255,255,255,.38)!important;outline-offset:2px!important\n}\nhtml[data-theme] body input[type=\"checkbox\"]:checked:not(:disabled),\nhtml[data-theme] body input[type=\"radio\"]:checked:not(:disabled){\n  outline:2px solid var(--theme-accent,#ff7a18)!important;outline-offset:2px!important;\n  filter:drop-shadow(0 0 6px rgba(var(--theme-accent-rgb,249,115,22),.65))!important\n}\nhtml[data-theme] body label:has(input[type=\"checkbox\"]:checked),\nhtml[data-theme] body label:has(input[type=\"radio\"]:checked){\n  border-color:var(--theme-accent,#ff7a18)!important;\n  box-shadow:0 0 0 2px rgba(var(--theme-accent-rgb,249,115,22),.22)!important\n}\n\n/* Foco de teclado */\nhtml[data-theme] body :is(button,[role=\"button\"],[role=\"tab\"],input,select,textarea):focus-visible{\n  outline:3px solid var(--theme-accent,#ff7a18)!important;outline-offset:3px!important;\n  box-shadow:0 0 0 5px rgba(var(--theme-accent-rgb,249,115,22),.20)!important\n}\n\n@media(max-width:640px){\n  html[data-theme] body .session-option.correct::after,\n  html[data-theme] body .session-option.wrong::after,\n  html[data-theme] body .sim-option.correct::after,\n  html[data-theme] body .sim-option.wrong::after{padding:4px 6px!important;font-size:9px!important}\n}\n";

    document.head.appendChild(
      style
    );


    /* CORTEX EXPLICIT ANSWER LABELS V1 */
    const answerLabelStyle =
      document.createElement(
        "style"
      );

    answerLabelStyle.id =
      "cortex-explicit-answer-labels";

    answerLabelStyle.textContent =
      "\nhtml[data-theme] body .cortex-answer-state{\n  display:inline-flex!important;\n  align-items:center!important;\n  justify-content:center!important;\n  flex:0 0 auto!important;\n  margin-left:auto!important;\n  border-radius:999px!important;\n  padding:6px 10px!important;\n  font-size:10px!important;\n  font-weight:950!important;\n  letter-spacing:.05em!important;\n  line-height:1!important;\n  white-space:nowrap!important\n}\nhtml[data-theme] body .cortex-answer-state-correct{\n  border:1px solid #5dff9f!important;\n  background:#00e676!important;\n  color:#02170b!important;\n  box-shadow:0 0 16px rgba(0,230,118,.42)!important\n}\nhtml[data-theme] body .cortex-answer-state-wrong{\n  border:1px solid #ff718e!important;\n  background:#ff2d55!important;\n  color:#fff!important;\n  box-shadow:0 0 16px rgba(255,45,85,.42)!important\n}\nhtml[data-theme] body .session-option:has(.cortex-answer-state)::after,\nhtml[data-theme] body .sim-option:has(.cortex-answer-state)::after{\n  content:none!important;\n  display:none!important\n}\n@media(max-width:640px){\n  html[data-theme] body .cortex-answer-state{\n    padding:5px 7px!important;\n    font-size:9px!important\n  }\n}\n";

    document.head.appendChild(
      answerLabelStyle
    );
    /* CORTEX EXPLICIT ANSWER LABELS V1 END */


    /* CORTEX ELIMINATION MODE V1 */
    const eliminationStyle =
      document.createElement(
        "style"
      );

    eliminationStyle.id =
      "cortex-elimination-mode";

    eliminationStyle.textContent =
      "\n:root{--cortex-cut:#facc15;--cortex-cut-rgb:250,204,21}\n\nhtml[data-theme] body .session-option-row,\nhtml[data-theme] body .sim-option-row{\n  display:grid!important;\n  grid-template-columns:minmax(0,1fr) auto!important;\n  align-items:stretch!important;\n  gap:9px!important;\n  width:100%!important\n}\n\nhtml[data-theme] body .session-option,\nhtml[data-theme] body .sim-option{\n  width:100%!important;\n  min-width:0!important\n}\n\nhtml[data-theme] body .eliminate-option,\nhtml[data-theme] body .sim-eliminate-option{\n  min-width:92px!important;\n  display:inline-flex!important;\n  align-items:center!important;\n  justify-content:center!important;\n  gap:6px!important;\n  border:1px solid rgba(var(--cortex-cut-rgb),.48)!important;\n  border-radius:12px!important;\n  background:rgba(var(--cortex-cut-rgb),.07)!important;\n  padding:8px 10px!important;\n  color:#ffe96a!important;\n  font-size:10px!important;\n  font-weight:850!important;\n  line-height:1!important;\n  cursor:pointer!important;\n  transition:transform .15s ease,border-color .15s ease,background .15s ease,box-shadow .15s ease!important\n}\n\nhtml[data-theme] body .eliminate-option:hover,\nhtml[data-theme] body .sim-eliminate-option:hover{\n  transform:translateY(-1px)!important;\n  border-color:var(--cortex-cut)!important;\n  background:rgba(var(--cortex-cut-rgb),.14)!important;\n  box-shadow:0 0 16px rgba(var(--cortex-cut-rgb),.16)!important\n}\n\nhtml[data-theme] body .eliminate-option.active,\nhtml[data-theme] body .sim-eliminate-option.active{\n  border-color:var(--cortex-cut)!important;\n  background:var(--cortex-cut)!important;\n  color:#211900!important;\n  box-shadow:0 0 0 2px rgba(var(--cortex-cut-rgb),.18),0 0 20px rgba(var(--cortex-cut-rgb),.24)!important\n}\n\nhtml[data-theme] body :is(.session-option,.sim-option).eliminated{\n  position:relative!important;\n  border:1px dashed rgba(var(--cortex-cut-rgb),.72)!important;\n  background:rgba(var(--cortex-cut-rgb),.045)!important;\n  color:rgba(255,255,255,.50)!important;\n  box-shadow:inset 0 0 0 1px rgba(var(--cortex-cut-rgb),.05)!important;\n  opacity:.62!important;\n  cursor:not-allowed!important\n}\n\nhtml[data-theme] body :is(.session-option,.sim-option).eliminated .option-text{\n  color:rgba(255,255,255,.48)!important;\n  text-decoration-line:line-through!important;\n  text-decoration-color:var(--cortex-cut)!important;\n  text-decoration-thickness:2px!important;\n  text-decoration-skip-ink:none!important\n}\n\nhtml[data-theme] body :is(.session-option,.sim-option).eliminated .option-letter{\n  border-color:rgba(var(--cortex-cut-rgb),.62)!important;\n  background:rgba(var(--cortex-cut-rgb),.12)!important;\n  color:#ffe66a!important\n}\n\nhtml[data-theme] body :is(.session-option-row,.sim-option-row).is-eliminated{\n  filter:saturate(.82)!important\n}\n\n@media(max-width:640px){\n  html[data-theme] body .session-option-row,\n  html[data-theme] body .sim-option-row{\n    grid-template-columns:minmax(0,1fr)!important\n  }\n\n  html[data-theme] body .eliminate-option,\n  html[data-theme] body .sim-eliminate-option{\n    width:100%!important;\n    min-height:34px!important\n  }\n}\n";

    document.head.appendChild(
      eliminationStyle
    );
    /* CORTEX ELIMINATION MODE V1 END */


  }
  /* CORTEX GLOBAL INTERACTION CONTRAST V2 END */


  /* =========================================================
     START
  ========================================================= */

  document.addEventListener(
    "DOMContentLoaded",
    function () {

      ensureProgress();


      document.body.classList.add(
        "ui-ready"
      );


      initRevealObserver();


      initGlobalInteractionContrast();


      initTimer();
    }
  );

})();