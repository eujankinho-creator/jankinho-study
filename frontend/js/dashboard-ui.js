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


    try {

      alreadySeen =
        sessionStorage.getItem(
          "cortexDesktopIntroSeen"
        ) ===
        "1";

    }
    catch (erro) {

      alreadySeen =
        false;

    }


    if (
      !isDesktop ||
      reduceMotion ||
      alreadySeen
    ) {

      intro.remove();

      body.classList.remove(
        "cortex-desktop-intro-pending"
      );

      return;
    }


    try {

      sessionStorage.setItem(
        "cortexDesktopIntroSeen",
        "1"
      );

    }
    catch (erro) {
      /* sessionStorage pode estar bloqueado */
    }


    const finish =
      function () {

        body.classList.remove(
          "cortex-desktop-intro-pending"
        );


        body.classList.add(
          "cortex-intro-complete"
        );


        window.setTimeout(
          function () {

            intro.remove();

          },
          820
        );

      };


    window.setTimeout(
      function () {

        intro.classList.add(
          "is-exiting"
        );


        finish();

      },
      2550
    );

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