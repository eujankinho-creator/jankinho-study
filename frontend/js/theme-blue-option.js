(function () {

  "use strict";


  const OPTIONS = [
    {
      theme: "blue-black",
      marker: "blue",
      title: "Blue",
      description: "Tema bem escuro com detalhes azuis sutis e confortáveis para os olhos.",
      chip: "Blue"
    },
    {
      theme: "black-white",
      marker: "mono",
      title: "White",
      description: "Tema escuro monocromático com detalhes brancos suaves e visual premium.",
      chip: "White"
    }
  ];


  function createOption(config) {

    const grid =
      document.querySelector(
        ".theme-settings-grid"
      );


    if (!grid) {
      return;
    }


    let button =
      grid.querySelector(
        '[data-theme-choice="' +
        config.theme +
        '"]'
      );


    if (!button) {

      button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "theme-choice";


      button.setAttribute(
        "data-theme-choice",
        config.theme
      );


      grid.appendChild(
        button
      );

    }


    button.setAttribute(
      "data-cortex-extra-theme-option",
      "true"
    );


    button.innerHTML =
      [
        '<div class="theme-choice-preview ' +
          config.marker +
          '">',
        '  <div class="theme-preview-top">',
        '    <div class="theme-preview-fill"></div>',
        '  </div>',
        '  <div class="theme-preview-card"></div>',
        '</div>',
        '',
        '<div class="theme-choice-title">' +
          config.title +
          '</div>',
        '',
        '<div class="theme-choice-description">' +
          config.description +
          '</div>',
        '',
        '<div class="theme-choice-chip">' +
          config.chip +
          '</div>'
      ].join("");

  }


  function createThemeOptions() {

    OPTIONS.forEach(
      createOption
    );

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      createThemeOptions
    );

  }
  else {

    createThemeOptions();

  }

})();