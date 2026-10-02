(function () {

  "use strict";


  const nativeFetch =
    window.fetch.bind(window);


  const AUTH_CACHE_KEY =
    "cortex_auth_me_v1";


  const AUTH_CACHE_TTL =
    60000;


  function readAuthCache() {

    try {

      const raw =
        sessionStorage.getItem(
          AUTH_CACHE_KEY
        );


      if (!raw) {
        return null;
      }


      const cached =
        JSON.parse(
          raw
        );


      if (
        !cached ||
        !cached.data ||
        !cached.savedAt ||
        Date.now() -
          Number(
            cached.savedAt
          ) >
          AUTH_CACHE_TTL
      ) {

        sessionStorage.removeItem(
          AUTH_CACHE_KEY
        );


        return null;
      }


      return cached.data;

    }
    catch {

      return null;

    }

  }


  function writeAuthCache(
    data
  ) {

    try {

      sessionStorage.setItem(
        AUTH_CACHE_KEY,
        JSON.stringify({
          savedAt:
            Date.now(),

          data:
            data,
        })
      );

    }
    catch {}

  }


  function authCacheResponse(
    data
  ) {

    return new Response(
      JSON.stringify(
        data
      ),
      {
        status:
          200,

        headers: {
          "Content-Type":
            "application/json; charset=utf-8",

          "X-Cortex-Cache":
            "session",
        },
      }
    );

  }


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
      pendingRequests !== 0
    ) {
      return;
    }


    if (!progress) {
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


      const method =
        String(
          (
            args[1] &&
            args[1].method
          ) ||
          (
            first &&
            typeof first !==
              "string" &&
            first.method
          ) ||
          "GET"
        )
          .toUpperCase();


      const authMe =
        method ===
          "GET" &&
        (
          url ===
            "/api/auth/me" ||
          url.startsWith(
            "/api/auth/me?"
          )
        );


      if (authMe) {

        const cached =
          readAuthCache();


        if (cached) {

          return authCacheResponse(
            cached
          );

        }

      }


      const track =
        url.includes("/api/") &&
        !authMe;


      if (track) {
        startProgress();
      }


      try {

        const response =
          await nativeFetch.apply(
            window,
            args
          );


        if (
          authMe &&
          response.ok
        ) {

          response
            .clone()
            .json()
            .then(
              writeAuthCache
            )
            .catch(
              function () {}
            );

        }


        return response;

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

      const cached =
        sessionStorage.getItem(
          "cortex_timer_key_v1"
        );


      if (cached) {
        return cached;
      }

    }
    catch {}


    const authCached =
      readAuthCache();


    const cachedUser =
      authCached &&
      (
        authCached.usuario ||
        authCached
      );


    if (
      cachedUser &&
      cachedUser.id
    ) {

      const key =
        "jankinho_study_timer_v2_" +
        cachedUser.id;


      try {

        sessionStorage.setItem(
          "cortex_timer_key_v1",
          key
        );

      }
      catch {}


      return key;

    }


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

          const key =
            "jankinho_study_timer_v2_" +
            user.id;


          try {

            sessionStorage.setItem(
              "cortex_timer_key_v1",
              key
            );

          }
          catch {}


          return key;
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
     RESPOSTA IMEDIATA A CLIQUES / TOQUES
  ========================================================= */

  function interactiveTarget(
    target
  ) {

    if (
      !(target instanceof Element)
    ) {
      return null;
    }


    return target.closest(
      [
        "button",
        "a[href]",
        "[role='button']",
        "[role='tab']",
        ".menu-item",
        ".session-option",
        ".sim-option",
        ".action-card",
        ".course-card",
        ".drug-card",
        ".flashcard-item",
        ".theme-choice",
        ".filter-chip",
        ".area-option",
        ".receptor-card",
      ].join(",")
    );

  }


  function releasePressed(
    element
  ) {

    if (!element) {
      return;
    }


    element.classList
      .remove(
        "ui-pressing"
      );

  }


  function initGlobalInteractionFeedback() {

    document.addEventListener(
      "pointerdown",
      function (
        event
      ) {

        const element =
          interactiveTarget(
            event.target
          );


        if (
          !element ||
          element.matches(
            ":disabled"
          )
        ) {
          return;
        }


        element.classList
          .add(
            "ui-feedback-ready",
            "ui-pressing"
          );

      },
      {
        passive:
          true,
      }
    );


    [
      "pointerup",
      "pointercancel",
      "pointerleave",
    ]
      .forEach(
        function (
          eventName
        ) {

          document.addEventListener(
            eventName,
            function (
              event
            ) {

              releasePressed(
                interactiveTarget(
                  event.target
                )
              );

            },
            {
              passive:
                true,
            }
          );

        }
      );


    document.addEventListener(
      "click",
      function (
        event
      ) {

        const element =
          interactiveTarget(
            event.target
          );


        if (!element) {
          return;
        }


        element.classList
          .add(
            "ui-feedback-ready",
            "ui-activated"
          );


        window.setTimeout(
          function () {

            element.classList
              .remove(
                "ui-activated",
                "ui-pressing"
              );

          },
          180
        );

      },
      {
        passive:
          true,
      }
    );


    document.addEventListener(
      "keydown",
      function (
        event
      ) {

        if (
          event.key !==
            "Enter" &&
          event.key !==
            " "
        ) {
          return;
        }


        const element =
          interactiveTarget(
            event.target
          );


        if (!element) {
          return;
        }


        element.classList
          .add(
            "ui-feedback-ready",
            "ui-pressing"
          );

      }
    );


    document.addEventListener(
      "keyup",
      function (
        event
      ) {

        releasePressed(
          interactiveTarget(
            event.target
          )
        );

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


      initGlobalInteractionFeedback();

      initTimer();

    }
  );

})();