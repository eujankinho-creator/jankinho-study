(function () {

  "use strict";


  const icons = {

    home:
      '<svg viewBox="0 0 24 24">' +
      '<path d="M4 11.5 12 5l8 6.5"></path>' +
      '<path d="M6.5 10.5V19h11v-8.5"></path>' +
      '<path d="M9.5 19v-5h5v5"></path>' +
      '</svg>',

    questions:
      '<svg viewBox="0 0 24 24">' +
      '<rect x="5" y="4" width="14" height="16" rx="3"></rect>' +
      '<path d="M9 9h6"></path>' +
      '<path d="M9 13h6"></path>' +
      '<path d="M9 17h3"></path>' +
      '</svg>',

    flash:
      '<svg viewBox="0 0 24 24">' +
      '<rect x="4" y="6" width="14" height="12" rx="2"></rect>' +
      '<path d="m8 6 2-2h10v12l-2 2"></path>' +
      '</svg>',

    cases:
      '<svg viewBox="0 0 24 24">' +
      '<rect x="5" y="6" width="14" height="15" rx="3"></rect>' +
      '<path d="M9 6V4h6v2"></path>' +
      '<path d="M12 10v7"></path>' +
      '<path d="M8.5 13.5h7"></path>' +
      '</svg>',

    lab:
      '<svg viewBox="0 0 24 24">' +
      '<path d="M9 3h6"></path>' +
      '<path d="M10 3v6l-5 8a2.5 2.5 0 0 0 2.2 4h9.6A2.5 2.5 0 0 0 19 17l-5-8V3"></path>' +
      '<path d="M7.5 15h9"></path>' +
      '</svg>',

    evolution:
      '<svg viewBox="0 0 24 24">' +
      '<path d="M5 19h14"></path>' +
      '<path d="m7 15 3-4 3 2 4-6"></path>' +
      '<path d="M15 7h2v2"></path>' +
      '</svg>',

    performance:
      '<svg viewBox="0 0 24 24">' +
      '<path d="M5 19V10"></path>' +
      '<path d="M10 19V5"></path>' +
      '<path d="M15 19v-7"></path>' +
      '<path d="M20 19V8"></path>' +
      '</svg>',

    ranking:
      '<svg viewBox="0 0 24 24">' +
      '<path d="M8 21h8"></path>' +
      '<path d="M12 17v4"></path>' +
      '<path d="M7 4h10v4a5 5 0 0 1-10 0z"></path>' +
      '<path d="M7 6H4v1a4 4 0 0 0 4 4"></path>' +
      '<path d="M17 6h3v1a4 4 0 0 1-4 4"></path>' +
      '</svg>',

    settings:
      '<svg viewBox="0 0 24 24">' +
      '<circle cx="12" cy="12" r="3"></circle>' +
      '<path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a8 8 0 0 0-1.7-1L14.5 3h-5l-.3 3.1a8 8 0 0 0-1.7 1l-2.4-1-2 3.4L5.1 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 1.7 1l.3 3.1h5l.3-3.1a8 8 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5a7 7 0 0 0 .1-1z"></path>' +
      '</svg>',

    refresh:
      '<svg viewBox="0 0 24 24">' +
      '<path d="M20 7v5h-5"></path>' +
      '<path d="M4 17v-5h5"></path>' +
      '<path d="M6.1 9a7 7 0 0 1 11.4-2L20 9"></path>' +
      '<path d="M17.9 15a7 7 0 0 1-11.4 2L4 15"></path>' +
      '</svg>'

  };


  function replaceSidebarIcons(root) {

    if (!root) {
      return;
    }


    root
      .querySelectorAll(
        ".menu-item"
      )
      .forEach(
        function (link) {

          const span =
            link.querySelector(
              ":scope > span"
            );


          if (!span) {
            return;
          }


          const href =
            link.getAttribute(
              "href"
            );


          let icon = "";


          if (href === "/") {
            icon = icons.home;
          }
          else if (href === "/questoes") {
            icon = icons.questions;
          }
          else if (href === "/flashcards") {
            icon = icons.flash;
          }
          else if (href === "/casos") {
            icon = icons.cases;
          }
          else if (href === "/laboratorio") {
            icon = icons.lab;
          }
          else if (href === "/evolucao") {
            icon = icons.evolution;
          }
          else if (href === "/desempenho") {
            icon = icons.performance;
          }
          else if (href === "/ranking") {
            icon = icons.ranking;
          }
          else if (href === "/configuracoes") {
            icon = icons.settings;
          }
          else if (href === "/financas") {

            span.className =
              "cortex-nav-icon";

            span.textContent =
              "R$";

            return;

          }


          if (!icon) {
            return;
          }


          span.className =
            "cortex-nav-icon";


          span.innerHTML =
            icon;

        }
      );

  }


  function replaceRefreshButtons() {

    [
      "atualizarTopo",
      "atualizarHistorico"
    ]
      .forEach(
        function (id) {

          const button =
            document.getElementById(
              id
            );


          if (!button) {
            return;
          }


          button.innerHTML =
            icons.refresh +
            "<span>Atualizar</span>";

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


    document.addEventListener(
      "pointermove",
      function (event) {

        const target =
          event.target.closest(
            ".summary-card, .panel, .movement-item"
          );


        if (!target) {
          return;
        }


        const rect =
          target.getBoundingClientRect();


        target.style.setProperty(
          "--mx",
          (
            event.clientX -
            rect.left
          ) +
          "px"
        );


        target.style.setProperty(
          "--my",
          (
            event.clientY -
            rect.top
          ) +
          "px"
        );

      }
    );

  }


  


  document.addEventListener(
    "DOMContentLoaded",
    function () {

      replaceSidebarIcons(
        document
      );

      replaceRefreshButtons();

      initPointerGlow();

      /*
       * O menu mobile e controlado exclusivamente pela
       * sidebar global (sidebar-standard.js).
       * Nao criar um segundo drawer nesta pagina.
       */

    }
  );

})();