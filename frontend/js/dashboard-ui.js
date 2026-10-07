(function () {

  "use strict";


  function initReveal() {

    const elements =
      document.querySelectorAll(
        "[data-reveal]"
      );


    if (
      !("IntersectionObserver" in window)
    ) {

      elements.forEach(
        function (element) {

          element.classList.add(
            "is-visible"
          );

        }
      );

      return;
    }


    const observer =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(
            function (entry) {

              if (!entry.isIntersecting) {
                return;
              }


              entry.target.classList.add(
                "is-visible"
              );


              observer.unobserve(
                entry.target
              );

            }
          );

        },
        {
          threshold: .08
        }
      );


    elements.forEach(
      function (element) {

        observer.observe(
          element
        );

      }
    );

  }


  function initPointerGlow() {

    if (
      !window.matchMedia(
        "(pointer: fine)"
      ).matches
    ) {
      return;
    }


    const elements =
      document.querySelectorAll(
        ".metric-card, .panel, .hero-insight"
      );


    elements.forEach(
      function (element) {

        element.addEventListener(
          "pointermove",
          function (event) {

            const rect =
              element.getBoundingClientRect();


            const x =
              event.clientX -
              rect.left;


            const y =
              event.clientY -
              rect.top;


            element.style.setProperty(
              "--mx",
              x + "px"
            );


            element.style.setProperty(
              "--my",
              y + "px"
            );

          }
        );

      }
    );

  }


  function initMetricAnimation() {

    const ids = [
      "totalQuestoes",
      "totalRespondidas",
      "totalAcertos",
      "percentual",
      "progressoPercentual",
      "hojeRespondidas",
      "hojeAcertos",
      "hojePercentual"
    ];


    ids.forEach(
      function (id) {

        const element =
          document.getElementById(id);


        if (!element) {
          return;
        }


        const observer =
          new MutationObserver(
            function () {

              element.classList.remove(
                "metric-value-pulse"
              );


              void element.offsetWidth;


              element.classList.add(
                "metric-value-pulse"
              );

            }
          );


        observer.observe(
          element,
          {
            childList: true,
            characterData: true,
            subtree: true
          }
        );

      }
    );

  }


  function initDesktopIntro() {

    const intro =
      document.getElementById(
        "cortexDesktopIntro"
      );


    const body =
      document.body;


    if (
      !intro ||
      !body
    ) {
      return;
    }


    const isDesktop =
      window.matchMedia(
        "(min-width: 901px)"
      ).matches;


    const reduceMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;


    let alreadySeen =
      false;


    let freshLogin =
      false;


    try {

      alreadySeen =
        sessionStorage.getItem(
          "cortexDesktopIntroSeen"
        ) ===
        "1";


      freshLogin =
        sessionStorage.getItem(
          "cortexDashboardFreshLogin"
        ) ===
        "1";

    }
    catch (erro) {

      alreadySeen =
        false;

      freshLogin =
        false;

    }


    if (
      !isDesktop ||
      reduceMotion ||
      alreadySeen ||
      !freshLogin
    ) {

      intro.remove();

      body.classList.remove(
        "cortex-desktop-intro-pending"
      );


      document.documentElement
        .classList
        .remove(
          "cortex-dashboard-intro-boot",
          "cortex-dashboard-content-hidden"
        );

      return;
    }


    body.classList.add(
      "cortex-desktop-intro-pending"
    );


    let hasStarted =
      false;


    function markIntroStarted() {

      if (hasStarted) {
        return;
      }


      hasStarted =
        true;


      try {

        sessionStorage.removeItem(
          "cortexDashboardFreshLogin"
        );


        sessionStorage.setItem(
          "cortexDesktopIntroSeen",
          "1"
        );

      }
      catch (erro) {
        /* sessionStorage pode estar bloqueado */
      }

    }


    function pageHasFocus() {

      /*
       * O Dashboard roda dentro do iframe do /app.
       * O documento interno pode nao receber foco direto
       * mesmo com a aba do Cortex ativa. Por isso a fonte
       * de verdade e a janela principal.
       */
      try {

        if (
          window.top &&
          window.top !==
            window &&
          window.top.document
        ) {

          return window.top.document
            .hasFocus();
        }


        return document.hasFocus();

      }
      catch {

        return document.hasFocus();

      }

    }


    const focusWindow =
      (
        function () {

          try {

            return (
              window.top &&
              window.top !==
                window
            )
              ? window.top
              : window;

          }
          catch {

            return window;

          }

        }
      )();


    let remaining =
      2550;


    let runningSince =
      0;


    let finishTimer =
      0;


    let focusTimer =
      0;
    let finished =
      false;


    const cleanupFocusEvents =
      function () {

        focusWindow.removeEventListener(
          "focus",
          scheduleResume
        );


        focusWindow.removeEventListener(
          "blur",
          pauseIntro
        );


        document.removeEventListener(
          "visibilitychange",
          handleVisibility
        );

      };


    const finish =
      function () {

        if (finished) {
          return;
        }


        finished =
          true;


        window.clearTimeout(
          finishTimer
        );


        window.clearTimeout(
          focusTimer
        );
cleanupFocusEvents();


        intro.classList.add(
          "is-running",
          "is-exiting"
        );


        body.classList.remove(
          "cortex-desktop-intro-pending"
        );


        body.classList.add(
          "cortex-intro-complete"
        );


        document.documentElement
          .classList
          .remove(
            "cortex-dashboard-content-hidden"
          );


        window.setTimeout(
          function () {

            intro.remove();


            document.documentElement
              .classList
              .remove(
                "cortex-dashboard-intro-boot"
              );

          },
          820
        );

      };


    function pauseIntro() {

      if (finished) {
        return;
      }


      window.clearTimeout(
        focusTimer
      );


      window.clearTimeout(
        finishTimer
      );
if (runningSince) {

        remaining =
          Math.max(
            0,
            remaining -
            (
              performance.now() -
              runningSince
            )
          );


        runningSince =
          0;

      }


      intro.classList.remove(
        "is-running"
      );

    }


    function resumeIntro() {

      if (
        finished ||
        document.hidden ||
        !pageHasFocus()
      ) {
        return;
      }


      if (
        remaining <=
        0
      ) {

        finish();

        return;
      }


      markIntroStarted();


      intro.classList.add(
        "is-running"
      );


      runningSince =
        performance.now();


      finishTimer =
        window.setTimeout(
          finish,
          remaining
        );

    }


    function scheduleResume() {

      if (finished) {
        return;
      }


      window.clearTimeout(
        focusTimer
      );


      if (
        document.hidden ||
        !pageHasFocus()
      ) {
        return;
      }


      /*
       * Pequena janela de estabilidade para avisos nativos
       * do navegador (ex.: Password Manager) tomarem foco
       * antes da animacao realmente comecar.
       */
      focusTimer =
        window.setTimeout(
          resumeIntro,
          500
        );

    }


    function handleVisibility() {

      if (document.hidden) {

        pauseIntro();

      }
      else {

        scheduleResume();

      }

    }


    focusWindow.addEventListener(
      "focus",
      scheduleResume
    );


    focusWindow.addEventListener(
      "blur",
      pauseIntro
    );


    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );


    scheduleResume();

  }

  document.addEventListener(
    "DOMContentLoaded",
    function () {

      initDesktopIntro();

      initReveal();

      initPointerGlow();

      initMetricAnimation();

    }
  );

})();