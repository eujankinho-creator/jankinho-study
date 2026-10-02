(function () {

  "use strict";


  function removeLegacyPinkPet() {

    /*
     * Pet antigo do Cortex.
     *
     * IMPORTANTE:
     * Nao toca no novo #cortexPinkPet.
     */

    document
      .querySelectorAll(
        [
          "#pinkCatWidget",
          ".pink-cat-widget",
          ".pink-cat-bubble",
          ".pink-cat-particle"
        ].join(",")
      )
      .forEach(
        function (
          element
        ) {

          element.remove();

        }
      );

  }


  function ensureCortexLogo() {

    const logos =
      document.querySelectorAll(
        ".logo-box"
      );


    logos.forEach(
      function (
        logo
      ) {

        if (
          logo.classList
            .contains(
              "cortex-logo"
            )
        ) {

          return;

        }


        logo.classList.add(
          "cortex-logo"
        );


        logo.innerHTML =
          '<svg ' +
            'class="cortex-brain-logo" ' +
            'viewBox="0 0 24 24" ' +
            'aria-hidden="true">' +

            '<path d="M9.5 4.5A2.5 2.5 0 0 0 7 7v.2A2.8 2.8 0 0 0 5 12c-.6.5-1 1.3-1 2.2A2.8 2.8 0 0 0 7 17a2.5 2.5 0 0 0 5 0V7a2.5 2.5 0 0 0-2.5-2.5Z"/>' +

            '<path d="M14.5 4.5A2.5 2.5 0 0 1 17 7v.2a2.8 2.8 0 0 1 2 4.8c.6.5 1 1.3 1 2.2A2.8 2.8 0 0 1 17 17a2.5 2.5 0 0 1-5 0V7a2.5 2.5 0 0 1 2.5-2.5Z"/>' +

            '<path d="M8.5 9.3c1 .1 1.7.6 2 1.4M15.5 9.3c-1 .1-1.7.6-2 1.4M8.5 14c1-.1 1.7-.6 2-1.4M15.5 14c-1-.1-1.7-.6-2-1.4"/>' +

          '</svg>';

      }
    );

  }


  function init() {

    removeLegacyPinkPet();

    ensureCortexLogo();


    /*
     * Se alguma pagina antiga tentar recolocar
     * #pinkCatWidget depois do carregamento,
     * remove novamente.
     */

    const observer =
      new MutationObserver(
        function (
          mutations
        ) {

          let foundLegacy =
            false;


          mutations.forEach(
            function (
              mutation
            ) {

              mutation.addedNodes
                .forEach(
                  function (
                    node
                  ) {

                    if (
                      node.nodeType !==
                      1
                    ) {

                      return;

                    }


                    if (
                      (
                        node.id ===
                        "pinkCatWidget"
                      ) ||
                      (
                        node.classList &&
                        node.classList
                          .contains(
                            "pink-cat-widget"
                          )
                      ) ||
                      (
                        node.querySelector &&
                        node.querySelector(
                          "#pinkCatWidget, .pink-cat-widget"
                        )
                      )
                    ) {

                      foundLegacy =
                        true;

                    }

                  }
                );

            }
          );


          if (
            foundLegacy
          ) {

            removeLegacyPinkPet();

          }

        }
      );


    observer.observe(
      document.body,
      {
        childList:
          true,

        subtree:
          true
      }
    );


    window.setTimeout(
      function () {

        observer.disconnect();

      },
      2200
    );

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:
          true
      }
    );

  }
  else {

    init();

  }

})();