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

    profile:
      '<svg viewBox="0 0 24 24">' +
      '<circle cx="12" cy="8" r="3"></circle>' +
      '<path d="M6 20c.5-4 2.5-6 6-6s5.5 2 6 6"></path>' +
      '</svg>',

    palette:
      '<svg viewBox="0 0 24 24">' +
      '<path d="M12 4a8 8 0 1 0 0 16h1.5a1.7 1.7 0 0 0 0-3.4H12a2 2 0 0 1 0-4h4a4 4 0 0 0 0-8z"></path>' +
      '<circle cx="8" cy="9" r=".8"></circle>' +
      '<circle cx="11" cy="7" r=".8"></circle>' +
      '<circle cx="8" cy="13" r=".8"></circle>' +
      '</svg>',

    lock:
      '<svg viewBox="0 0 24 24">' +
      '<rect x="5" y="10" width="14" height="11" rx="3"></rect>' +
      '<path d="M8 10V7a4 4 0 0 1 8 0v3"></path>' +
      '<path d="M12 14v3"></path>' +
      '</svg>',

    logout:
      '<svg viewBox="0 0 24 24">' +
      '<path d="M10 5H5v14h5"></path>' +
      '<path d="m14 8 4 4-4 4"></path>' +
      '<path d="M8 12h10"></path>' +
      '</svg>',

    eye:
      '<svg viewBox="0 0 24 24">' +
      '<path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"></path>' +
      '<circle cx="12" cy="12" r="2.5"></circle>' +
      '</svg>',

    eyeOff:
      '<svg viewBox="0 0 24 24">' +
      '<path d="m4 4 16 16"></path>' +
      '<path d="M10.5 6.2A9.4 9.4 0 0 1 12 6c5.5 0 9 6 9 6a15 15 0 0 1-2.1 2.8"></path>' +
      '<path d="M6.1 7.2C4.1 9 3 12 3 12s3.5 6 9 6a8 8 0 0 0 3-.6"></path>' +
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


  function replaceSettingsIcons() {

    const cards =
      document.querySelectorAll(
        ".settings-card"
      );


    cards.forEach(
      function (card) {

        const icon =
          card.querySelector(
            ".settings-icon"
          );


        if (!icon) {
          return;
        }


        if (
          card.id ===
          "themeSettingsCard"
        ) {

          icon.innerHTML =
            icons.palette;

          return;
        }


        if (
          card.classList.contains(
            "danger-card"
          )
        ) {

          icon.innerHTML =
            icons.logout;

          return;
        }


        if (
          card.querySelector(
            "#profileForm"
          )
        ) {

          icon.innerHTML =
            icons.profile;

          return;
        }


        if (
          card.querySelector(
            "#passwordForm"
          )
        ) {

          icon.innerHTML =
            icons.lock;

        }

      }
    );

  }


  function createAccountSummary() {

    const heading =
      document.querySelector(
        ".settings-heading"
      );


    if (
      !heading ||
      heading.querySelector(
        ".settings-account-summary"
      )
    ) {
      return;
    }


    const summary =
      document.createElement(
        "div"
      );


    summary.className =
      "settings-account-summary";


    summary.innerHTML =
      [
        '<div class="settings-account-top">',
        '  <div id="settingsHeroAvatar" class="settings-account-avatar">U</div>',
        '  <div class="settings-account-copy">',
        '    <strong id="settingsHeroName">Carregando...</strong>',
        '    <span id="settingsHeroEmail">Conta Cortex</span>',
        '  </div>',
        '</div>',
        '<div class="settings-account-footer">',
        '  <span>Conta Cortex</span>',
        '  <span class="settings-status">Ativa</span>',
        '</div>'
      ].join("");


    heading.appendChild(
      summary
    );


    const name =
      document.getElementById(
        "nomeSidebar"
      );


    const email =
      document.getElementById(
        "emailSidebar"
      );


    const avatar =
      document.getElementById(
        "avatarSidebar"
      );


    function update() {

      const heroName =
        document.getElementById(
          "settingsHeroName"
        );


      const heroEmail =
        document.getElementById(
          "settingsHeroEmail"
        );


      const heroAvatar =
        document.getElementById(
          "settingsHeroAvatar"
        );


      if (
        heroName &&
        name
      ) {

        heroName.textContent =
          name.textContent ||
          "Usuario";

      }


      if (
        heroEmail &&
        email
      ) {

        heroEmail.textContent =
          email.textContent ||
          "Conta Cortex";

      }


      if (
        heroAvatar &&
        avatar
      ) {

        heroAvatar.textContent =
          avatar.textContent ||
          "U";

      }

    }


    update();


    [
      name,
      email,
      avatar
    ]
      .filter(Boolean)
      .forEach(
        function (element) {

          new MutationObserver(
            update
          ).observe(
            element,
            {
              childList:
                true,

              characterData:
                true,

              subtree:
                true
            }
          );

        }
      );

  }


  function createPasswordToggle(id) {

    const input =
      document.getElementById(
        id
      );


    if (
      !input ||
      input.parentElement
        .classList
        .contains(
          "settings-password-wrap"
        )
    ) {
      return;
    }


    const parent =
      input.parentElement;


    const wrapper =
      document.createElement(
        "div"
      );


    wrapper.className =
      "settings-password-wrap";


    parent.insertBefore(
      wrapper,
      input
    );


    wrapper.appendChild(
      input
    );


    const button =
      document.createElement(
        "button"
      );


    button.type =
      "button";


    button.className =
      "settings-password-toggle";


    button.setAttribute(
      "aria-label",
      "Mostrar senha"
    );


    button.innerHTML =
      icons.eye;


    button.addEventListener(
      "click",
      function () {

        const showing =
          input.type ===
          "text";


        input.type =
          showing
            ? "password"
            : "text";


        button.innerHTML =
          showing
            ? icons.eye
            : icons.eyeOff;


        button.setAttribute(
          "aria-label",
          showing
            ? "Mostrar senha"
            : "Ocultar senha"
        );

      }
    );


    wrapper.appendChild(
      button
    );

  }


  function createPasswordStrength() {

    const input =
      document.getElementById(
        "novaSenha"
      );


    if (
      !input ||
      document.getElementById(
        "passwordStrength"
      )
    ) {
      return;
    }


    const field =
      input.closest(
        ".field"
      );


    if (!field) {
      return;
    }


    const meter =
      document.createElement(
        "div"
      );


    meter.id =
      "passwordStrength";


    meter.className =
      "password-strength";


    meter.dataset.score =
      "0";


    meter.innerHTML =
      [
        '<div class="password-strength-top">',
        '  <span>Forca estimada</span>',
        '  <span id="passwordStrengthLabel">Digite uma nova senha</span>',
        '</div>',
        '<div class="password-strength-bars">',
        '  <span></span>',
        '  <span></span>',
        '  <span></span>',
        '  <span></span>',
        '</div>'
      ].join("");


    field.insertAdjacentElement(
      "afterend",
      meter
    );


    function calculate(value) {

      if (!value) {
        return 0;
      }


      let score = 0;


      if (
        value.length >= 6
      ) {
        score += 1;
      }


      if (
        value.length >= 10
      ) {
        score += 1;
      }


      if (
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value)
      ) {
        score += 1;
      }


      if (
        /\d/.test(value) &&
        /[^A-Za-z0-9]/.test(value)
      ) {
        score += 1;
      }


      return Math.min(
        score,
        4
      );

    }


    function update() {

      const score =
        calculate(
          input.value
        );


      meter.dataset.score =
        String(score);


      const label =
        document.getElementById(
          "passwordStrengthLabel"
        );


      if (!label) {
        return;
      }


      const labels = [
        "Digite uma nova senha",
        "Basica",
        "Razoavel",
        "Boa",
        "Forte"
      ];


      label.textContent =
        labels[score];

    }


    input.addEventListener(
      "input",
      update
    );


    update();

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

        const card =
          event.target.closest(
            ".settings-card"
          );


        if (!card) {
          return;
        }


        const rect =
          card.getBoundingClientRect();


        card.style.setProperty(
          "--mx",
          (
            event.clientX -
            rect.left
          ) +
          "px"
        );


        card.style.setProperty(
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


  function createMobileMenu() {

    const header =
      document.querySelector(
        ".header"
      );


    const menu =
      document.querySelector(
        ".sidebar .sidebar-menu"
      );


    if (
      !header ||
      !menu
    ) {
      return;
    }


    const button =
      document.createElement(
        "button"
      );


    button.type =
      "button";


    button.className =
      "settings-mobile-button";


    button.setAttribute(
      "aria-label",
      "Abrir menu"
    );


    button.innerHTML =
      '<svg viewBox="0 0 24 24">' +
      '<path d="M5 7h14"></path>' +
      '<path d="M5 12h14"></path>' +
      '<path d="M5 17h14"></path>' +
      '</svg>';


    header.insertBefore(
      button,
      header.firstChild
    );


    const overlay =
      document.createElement(
        "div"
      );


    overlay.className =
      "settings-mobile-overlay";


    const drawer =
      document.createElement(
        "aside"
      );


    drawer.className =
      "settings-mobile-drawer";


    const head =
      document.createElement(
        "div"
      );


    head.className =
      "settings-mobile-head";


    head.innerHTML =
      [
        '<a href="/" class="settings-mobile-brand">',
        '  <div class="logo-box"></div>',
        '  <span>Cortex</span>',
        '</a>',
        '<button type="button" class="settings-mobile-close" aria-label="Fechar menu">&times;</button>'
      ].join("");


    const clone =
      menu.cloneNode(
        true
      );


    drawer.appendChild(
      head
    );


    drawer.appendChild(
      clone
    );


    overlay.appendChild(
      drawer
    );


    document.body.appendChild(
      overlay
    );


    replaceSidebarIcons(
      clone
    );


    function open() {

      overlay.classList.add(
        "open"
      );


      document.body.style.overflow =
        "hidden";

    }


    function close() {

      overlay.classList.remove(
        "open"
      );


      document.body.style.overflow =
        "";

    }


    button.addEventListener(
      "click",
      open
    );


    head
      .querySelector(
        ".settings-mobile-close"
      )
      .addEventListener(
        "click",
        close
      );


    overlay.addEventListener(
      "click",
      function (event) {

        if (
          event.target ===
          overlay
        ) {
          close();
        }

      }
    );


    clone
      .querySelectorAll(
        "a"
      )
      .forEach(
        function (link) {

          link.addEventListener(
            "click",
            close
          );

        }
      );


    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key ===
          "Escape"
        ) {
          close();
        }

      }
    );

  }


  document.addEventListener(
    "DOMContentLoaded",
    function () {

      replaceSidebarIcons(
        document
      );


      replaceSettingsIcons();

      createAccountSummary();


      createPasswordToggle(
        "senhaAtual"
      );


      createPasswordToggle(
        "novaSenha"
      );


      createPasswordToggle(
        "confirmarSenha"
      );


      createPasswordStrength();

      initPointerGlow();

      createMobileMenu();

    }
  );

})();