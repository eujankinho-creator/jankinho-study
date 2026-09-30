(function () {

  "use strict";


  function prettyName(
    theme
  ) {

    if (
      theme ===
      "pink-glitter"
    ) {

      return "Pink Glitter";

    }


    if (
      theme ===
      "blue-black"
    ) {

      return "Blue Black";

    }


    return "Dark Orange";
  }


  function render(
    activeTheme
  ) {

    document
      .querySelectorAll(
        "[data-theme-choice]"
      )
      .forEach(
        function (button) {

          const theme =
            button.getAttribute(
              "data-theme-choice"
            );


          const active =
            theme ===
            activeTheme;


          button.classList.toggle(
            "active",
            active
          );


          button.setAttribute(
            "aria-pressed",
            active
              ? "true"
              : "false"
          );

        }
      );


    const currentName =
      document.getElementById(
        "themeCurrentName"
      );


    if (currentName) {

      currentName.textContent =
        prettyName(
          activeTheme
        );

    }
  }


  function init() {

    const api =
      window.JankinhoTheme;


    if (!api) {
      return;
    }


    render(
      api.getTheme()
    );


    document.addEventListener(
      "click",
      function (event) {

        const button =
          event.target.closest(
            "[data-theme-choice]"
          );


        if (!button) {
          return;
        }


        const theme =
          button.getAttribute(
            "data-theme-choice"
          );


        if (!theme) {
          return;
        }


        api.setTheme(
          theme
        );


        render(
          theme
        );

      }
    );


    api.subscribe(
      function (theme) {

        render(
          theme
        );

      }
    );
  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  }
  else {

    init();

  }

})();