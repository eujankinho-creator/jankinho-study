(function () {
  "use strict";

  function prettyName(theme) {
    if (theme === "pink-glitter") {
      return "Pink Glitter";
    }

    return "Dark Orange";
  }

  function render(activeTheme) {
    const buttons =
      document.querySelectorAll(
        "[data-theme-choice]"
      );

    buttons.forEach(function (button) {
      const theme =
        button.getAttribute(
          "data-theme-choice"
        );

      button.classList.toggle(
        "active",
        theme === activeTheme
      );
    });

    const currentName =
      document.getElementById(
        "themeCurrentName"
      );

    if (currentName) {
      currentName.textContent =
        prettyName(activeTheme);
    }
  }

  function init() {
    const api =
      window.JankinhoTheme;

    if (!api) {
      return;
    }

    const current =
      api.getTheme();

    render(current);

    const buttons =
      document.querySelectorAll(
        "[data-theme-choice]"
      );

    buttons.forEach(function (button) {
      button.addEventListener(
        "click",
        function () {
          const theme =
            button.getAttribute(
              "data-theme-choice"
            );

          api.setTheme(theme);
          render(theme);
        }
      );
    });

    api.subscribe(function (theme) {
      render(theme);
    });
  }

  document.addEventListener(
    "DOMContentLoaded",
    init
  );
})();