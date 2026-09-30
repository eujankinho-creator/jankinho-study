(function () {

  "use strict";


  const STORAGE_KEY =
    "jankinho_theme_v1";


  const THEMES = [
    "dark-orange",
    "pink-glitter",
    "blue-black",
    "black-white",
  ];


  const listeners =
    new Set();


  function normalize(
    theme
  ) {

    if (
      THEMES.includes(
        theme
      )
    ) {

      return theme;

    }


    return "dark-orange";
  }


  function getTheme() {

    try {

      return normalize(
        localStorage.getItem(
          STORAGE_KEY
        )
      );

    }
    catch {

      return "dark-orange";

    }
  }


  function persistTheme(
    theme
  ) {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        theme
      );

    }
    catch {}

  }


  function notifyListeners(
    theme
  ) {

    listeners.forEach(
      function (listener) {

        try {

          listener(
            theme
          );

        }
        catch (error) {

          console.error(
            error
          );

        }

      }
    );
  }


  function broadcastTheme(
    theme
  ) {

    const message = {

      type:
        "cortex-theme-change",

      theme,

    };


    const origin =
      window.location.origin;


    try {

      if (
        window.parent &&
        window.parent !==
        window
      ) {

        window.parent.postMessage(
          message,
          origin
        );

      }

    }
    catch {}


    try {

      document
        .querySelectorAll(
          "iframe"
        )
        .forEach(
          function (frame) {

            if (
              frame.contentWindow
            ) {

              frame.contentWindow
                .postMessage(
                  message,
                  origin
                );

            }

          }
        );

    }
    catch {}

  }


  function applyTheme(
    theme,
    options
  ) {

    const settings =
      options ||
      {};


    const normalized =
      normalize(
        theme
      );


    document.documentElement
      .setAttribute(
        "data-theme",
        normalized
      );


    if (
      settings.persist !==
      false
    ) {

      persistTheme(
        normalized
      );

    }


    notifyListeners(
      normalized
    );


    if (
      settings.broadcast !==
      false
    ) {

      broadcastTheme(
        normalized
      );

    }


    return normalized;
  }


  window.addEventListener(
    "storage",
    function (event) {

      if (
        event.key !==
        STORAGE_KEY
      ) {
        return;
      }


      applyTheme(
        event.newValue,
        {
          persist:
            false,

          broadcast:
            false,
        }
      );

    }
  );


  window.addEventListener(
    "message",
    function (event) {

      if (
        event.origin !==
        window.location.origin
      ) {
        return;
      }


      const data =
        event.data;


      if (
        !data ||
        data.type !==
        "cortex-theme-change"
      ) {
        return;
      }


      applyTheme(
        data.theme,
        {
          persist:
            true,

          broadcast:
            false,
        }
      );

    }
  );


  const initialTheme =
    getTheme();


  document.documentElement
    .setAttribute(
      "data-theme",
      initialTheme
    );


  window.JankinhoTheme = {

    getTheme,


    setTheme(
      theme
    ) {

      return applyTheme(
        theme
      );

    },


    subscribe(
      callback
    ) {

      if (
        typeof callback !==
        "function"
      ) {

        return function () {};

      }


      listeners.add(
        callback
      );


      return function () {

        listeners.delete(
          callback
        );

      };
    },

  };


  document.addEventListener(
    "DOMContentLoaded",
    function () {

      applyTheme(
        getTheme(),
        {
          persist:
            false,

          broadcast:
            false,
        }
      );

    }
  );

})();