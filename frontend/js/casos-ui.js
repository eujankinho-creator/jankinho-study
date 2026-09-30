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

    search:
      '<svg viewBox="0 0 24 24">' +
      '<circle cx="11" cy="11" r="6"></circle>' +
      '<path d="m16 16 4 4"></path>' +
      '</svg>',

    sparkle:
      '<svg viewBox="0 0 24 24">' +
      '<path d="m12 3 1.3 4.2L17.5 8.5l-4.2 1.3L12 14l-1.3-4.2-4.2-1.3 4.2-1.3z"></path>' +
      '<path d="m18 14 .7 2.3L21 17l-2.3.7L18 20l-.7-2.3L15 17l2.3-.7z"></path>' +
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

            span.classList.add(
              "cortex-nav-icon"
            );

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


  function replaceCaseListIcons() {

    const hero =
      document.querySelector(
        ".cases-view .hero-icon"
      );


    if (hero) {
      hero.innerHTML =
        icons.cases;
    }


    const search =
      document.querySelector(
        ".cases-view .search-wrapper span"
      );


    if (search) {
      search.innerHTML =
        icons.search;
    }


    const generate =
      document.getElementById(
        "abrirGerador"
      );


    if (generate) {

      generate.innerHTML =
        icons.sparkle +
        "<span>Criar caso com IA</span>";

    }

  }


  function createCaseStats() {

    const hero =
      document.querySelector(
        ".cases-view .cases-hero"
      );


    const button =
      document.getElementById(
        "abrirGerador"
      );


    if (
      !hero ||
      !button ||
      hero.querySelector(
        ".cases-hero-side"
      )
    ) {
      return;
    }


    const side =
      document.createElement(
        "div"
      );


    side.className =
      "cases-hero-side";


    hero.insertBefore(
      side,
      button
    );


    side.appendChild(
      button
    );


    const stats =
      document.createElement(
        "div"
      );


    stats.className =
      "cases-hero-stats";


    stats.innerHTML =
      [
        '<div class="cases-hero-stat">',
        '  <strong id="clinicalVisible">0</strong>',
        '  <span>Exibidos</span>',
        '</div>',
        '<div class="cases-hero-stat">',
        '  <strong id="clinicalCompleted">0</strong>',
        '  <span>Concluidos</span>',
        '</div>',
        '<div class="cases-hero-stat">',
        '  <strong id="clinicalAi">0</strong>',
        '  <span>Por IA</span>',
        '</div>'
      ].join("");


    side.appendChild(
      stats
    );


    const list =
      document.getElementById(
        "casosLista"
      );


    if (!list) {
      return;
    }


    function update() {

      const cards =
        list.querySelectorAll(
          ".case-card"
        );


      const completed =
        list.querySelectorAll(
          ".case-badge.completed"
        );


      const ai =
        list.querySelectorAll(
          ".case-badge.ai"
        );


      const visibleEl =
        document.getElementById(
          "clinicalVisible"
        );


      const completedEl =
        document.getElementById(
          "clinicalCompleted"
        );


      const aiEl =
        document.getElementById(
          "clinicalAi"
        );


      if (visibleEl) {
        visibleEl.textContent =
          String(cards.length);
      }


      if (completedEl) {
        completedEl.textContent =
          String(completed.length);
      }


      if (aiEl) {
        aiEl.textContent =
          String(ai.length);
      }

    }


    update();


    const observer =
      new MutationObserver(
        update
      );


    observer.observe(
      list,
      {
        childList:
          true
      }
    );

  }


  function replaceInvestigationIcons() {

    const map = {

      ANAMNESE:
        '<svg viewBox="0 0 24 24">' +
        '<path d="M7 4h10v16H7z"></path>' +
        '<path d="M9 8h6"></path>' +
        '<path d="M9 12h6"></path>' +
        '<path d="M9 16h4"></path>' +
        '</svg>',

      EXAME_FISICO:
        '<svg viewBox="0 0 24 24">' +
        '<circle cx="12" cy="8" r="3"></circle>' +
        '<path d="M6 20c.5-4 2.5-6 6-6s5.5 2 6 6"></path>' +
        '</svg>',

      SINAIS_VITAIS:
        '<svg viewBox="0 0 24 24">' +
        '<path d="M3 12h4l2-5 4 10 2-5h6"></path>' +
        '</svg>',

      EVOLUCAO:
        '<svg viewBox="0 0 24 24">' +
        '<path d="M5 18 10 13l3 2 6-8"></path>' +
        '<path d="M16 7h3v3"></path>' +
        '</svg>'

    };


    document
      .querySelectorAll(
        "[data-investigar]"
      )
      .forEach(
        function (button) {

          const span =
            button.querySelector(
              ":scope > span"
            );


          const type =
            button.dataset
              .investigar;


          if (
            span &&
            map[type]
          ) {

            span.innerHTML =
              map[type];

          }

        }
      );

  }


  function createClinicalFlow() {

    const page =
      document.querySelector(
        ".case-detail-view .case-page"
      );


    const back =
      document.querySelector(
        ".case-detail-view .back-link"
      );


    if (
      !page ||
      !back ||
      page.querySelector(
        ".case-flow"
      )
    ) {
      return;
    }


    const flow =
      document.createElement(
        "div"
      );


    flow.className =
      "case-flow";


    flow.innerHTML =
      [
        '<div class="case-flow-item active"><span>1</span>Dados iniciais</div>',
        '<div class="case-flow-item active"><span>2</span>Investigar</div>',
        '<div class="case-flow-item active"><span>3</span>Exames</div>',
        '<div class="case-flow-item active"><span>4</span>Hipotese</div>',
        '<div class="case-flow-item"><span>5</span>Resultado</div>'
      ].join("");


    back.insertAdjacentElement(
      "afterend",
      flow
    );


    const result =
      document.getElementById(
        "resultadoPanel"
      );


    if (!result) {
      return;
    }


    function update() {

      const items =
        flow.querySelectorAll(
          ".case-flow-item"
        );


      if (
        !result.classList.contains(
          "hidden"
        )
      ) {

        items.forEach(
          function (item) {

            item.classList.add(
              "active"
            );

          }
        );

      }

    }


    update();


    const observer =
      new MutationObserver(
        update
      );


    observer.observe(
      result,
      {
        attributes:
          true,

        attributeFilter:
          ["class"]
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
            ".case-card, .panel, .exam-card, .investigation-button"
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
          ) + "px"
        );


        target.style.setProperty(
          "--my",
          (
            event.clientY -
            rect.top
          ) + "px"
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


      replaceCaseListIcons();

      createCaseStats();

      replaceInvestigationIcons();

      createClinicalFlow();

      initPointerGlow();
}
  );

})();