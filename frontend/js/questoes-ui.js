(function () {

  "use strict";


  function replaceVisualIcons() {

    const search =
      document.querySelector(
        ".search-wrapper > span"
      );


    if (search) {

      search.innerHTML =
        [
          '<svg viewBox="0 0 24 24" aria-hidden="true">',
          '<circle cx="11" cy="11" r="6"></circle>',
          '<path d="m16 16 4 4"></path>',
          '</svg>'
        ].join("");

    }


    const actions = [
      {
        id: "iniciarSessao",
        svg:
          '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="m9 7 8 5-8 5z"></path>' +
          '</svg>'
      },
      {
        id: "abrirIA",
        svg:
          '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="m12 3 1.3 4.2L17.5 8.5l-4.2 1.3L12 14l-1.3-4.2-4.2-1.3 4.2-1.3z"></path>' +
          '<path d="m18 14 .7 2.3L21 17l-2.3.7L18 20l-.7-2.3L15 17l2.3-.7z"></path>' +
          '</svg>'
      },
      {
        id: "abrirManual",
        svg:
          '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M12 5v14"></path>' +
          '<path d="M5 12h14"></path>' +
          '</svg>'
      }
    ];


    actions.forEach(
      function (item) {

        const button =
          document.getElementById(
            item.id
          );


        if (!button) {
          return;
        }


        const icon =
          button.querySelector(
            ".action-icon"
          );


        if (icon) {
          icon.innerHTML =
            item.svg;
        }

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


    document
      .querySelectorAll(
        ".action-card"
      )
      .forEach(
        function (card) {

          card.addEventListener(
            "pointermove",
            function (event) {

              const rect =
                card.getBoundingClientRect();


              card.style.setProperty(
                "--mx",
                (
                  event.clientX -
                  rect.left
                ) + "px"
              );


              card.style.setProperty(
                "--my",
                (
                  event.clientY -
                  rect.top
                ) + "px"
              );

            }
          );

        }
      );

  }


  function animateQuestions() {

    const container =
      document.getElementById(
        "questoesLista"
      );


    if (!container) {
      return;
    }


    function apply() {

      const cards =
        container.querySelectorAll(
          ".question-card"
        );


      cards.forEach(
        function (
          card,
          index
        ) {

          card.style.animationDelay =
            Math.min(
              index * 35,
              280
            ) +
            "ms";

        }
      );

    }


    apply();


    const observer =
      new MutationObserver(
        apply
      );


    observer.observe(
      container,
      {
        childList:
          true
      }
    );

  }


  function initCountPulse() {

    [
      "statQuestoes",
      "statDisciplinas"
    ]
      .forEach(
        function (id) {

          const element =
            document.getElementById(
              id
            );


          if (!element) {
            return;
          }


          const observer =
            new MutationObserver(
              function () {

                element.animate(
                  [
                    {
                      opacity: .45,
                      transform:
                        "scale(.94)"
                    },
                    {
                      opacity: 1,
                      transform:
                        "scale(1)"
                    }
                  ],
                  {
                    duration: 260,
                    easing: "ease-out"
                  }
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


  function closeOpenModal() {

    const modal =
      document.querySelector(
        ".modal-overlay.open"
      );


    if (!modal) {
      return false;
    }


    modal.classList.remove(
      "open"
    );


    return true;

  }


  


  document.addEventListener(
    "DOMContentLoaded",
    function () {

      replaceVisualIcons();

      initPointerGlow();

      animateQuestions();

      initCountPulse();
}
  );

})();