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






  /* =========================================================
     MICROINTERACOES PROFISSIONAIS
  ========================================================= */

  const motionSelector =
    [
      ".hero",
      ".academic-hero",
      ".question-card",
      ".metric-card",
      ".panel",
      ".course-card",
      ".case-card",
      ".drug-card",
      ".flashcard",
      ".notice-card",
      ".activity-card",
      ".resource-card",
      ".overview-feature",
      ".lesson-card",
      ".finance-card",
      ".result-card",
      ".theme-choice",
      ".session-card",
    ].join(",");


  function markMotion(
    root
  ) {

    if (
      !(root instanceof Element)
    ) {
      return;
    }


    const candidates =
      [];


    if (
      root.matches(
        motionSelector
      )
    ) {

      candidates.push(
        root
      );

    }


    root
      .querySelectorAll(
        motionSelector
      )
      .forEach(
        function (
          element
        ) {

          candidates.push(
            element
          );

        }
      );


    candidates
      .slice(
        0,
        40
      )
      .forEach(
        function (
          element,
          index
        ) {

          if (
            element.classList
              .contains(
                "ui-motion-item"
              )
          ) {
            return;
          }


          element.style
            .animationDelay =
            Math.min(
              index * 18,
              126
            ) +
            "ms";


          element.classList
            .add(
              "ui-motion-item"
            );

        }
      );

  }


  function initProfessionalMotion() {

    markMotion(
      document.body
    );


    const observer =
      new MutationObserver(
        function (
          mutations
        ) {

          for (
            const mutation
            of mutations
          ) {

            if (
              mutation.type !==
                "childList"
            ) {
              continue;
            }


            mutation.addedNodes
              .forEach(
                function (
                  node
                ) {

                  if (
                    node instanceof
                      Element
                  ) {

                    window
                      .requestAnimationFrame(
                        function () {

                          markMotion(
                            node
                          );

                        }
                      );

                  }

                }
              );

          }

        }
      );


    observer.observe(
      document.body,
      {
        childList:
          true,

        subtree:
          true,
      }
    );

  }


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
      initProfessionalMotion();
      initTimer();
    }
  );

})();