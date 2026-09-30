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


  document.addEventListener(
    "DOMContentLoaded",
    function () {

      initReveal();

      initPointerGlow();

      initMetricAnimation();

    }
  );

})();