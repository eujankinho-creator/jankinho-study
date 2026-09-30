(function () {

  "use strict";


  function createBlueThemeOption() {

    const grid =
      document.querySelector(
        ".theme-settings-grid"
      );


    if (!grid) {
      return;
    }


    const old =
      grid.querySelector(
        '[data-cortex-blue-theme-option="true"]'
      );


    if (old) {
      old.remove();
    }


    const existing =
      grid.querySelector(
        '[data-theme-choice="blue-black"]'
      );


    if (existing) {

      existing
        .setAttribute(
          "data-cortex-blue-theme-option",
          "true"
        );


      const preview =
        existing.querySelector(
          ".theme-choice-preview"
        );


      if (preview) {

        preview.classList.remove(
          "dark",
          "pink"
        );


        preview.classList.add(
          "blue"
        );

      }


      return;
    }


    const button =
      document.createElement(
        "button"
      );


    button.type =
      "button";


    button.className =
      "theme-choice cortex-blue-theme-option";


    button.setAttribute(
      "data-theme-choice",
      "blue-black"
    );


    button.setAttribute(
      "data-cortex-blue-theme-option",
      "true"
    );


    button.innerHTML =
      [
        '<div class="theme-choice-preview blue">',
        '  <div class="theme-preview-top">',
        '    <div class="theme-preview-fill"></div>',
        '  </div>',
        '  <div class="theme-preview-card"></div>',
        '</div>',
        '',
        '<div class="theme-choice-title">',
        '  Blue Black',
        '</div>',
        '',
        '<div class="theme-choice-description">',
        '  Preto profundo com azul eletrico e glow frio.',
        '</div>',
        '',
        '<div class="theme-choice-chip">',
        '  Blue',
        '</div>'
      ].join("");


    grid.appendChild(
      button
    );
  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      createBlueThemeOption
    );

  }
  else {

    createBlueThemeOption();

  }

})();