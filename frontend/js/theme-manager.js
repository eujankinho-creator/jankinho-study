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


  let changeVersion =
    0;


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
      function (
        listener
      ) {

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
          function (
            frame
          ) {

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


    if (
      settings.bumpVersion !==
      false
    ) {

      changeVersion +=
        1;

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


  async function persistAccountTheme(
    theme
  ) {

    try {

      const response =
        await fetch(
          "/api/configuracoes/tema",
          {
            method:
              "PATCH",

            credentials:
              "same-origin",

            keepalive:
              true,

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                tema:
                  normalize(
                    theme
                  ),
              }),
          }
        );


      /*
       * Na tela de login nao existe sessao autenticada.
       * Nesse caso o cache local continua funcionando
       * e nenhuma mensagem de erro deve aparecer.
       */
      if (
        response.status ===
          401 ||
        response.status ===
          403
      ) {

        return;
      }


      if (!response.ok) {

        console.warn(
          "Cortex: nao foi possivel sincronizar o tema da conta."
        );

      }

    }
    catch (
      error
    ) {

      console.warn(
        "Cortex: tema salvo localmente; sincronizacao indisponivel.",
        error
      );

    }

  }


  async function syncFromAccount() {

    const versionAtStart =
      changeVersion;


    try {

      const response =
        await fetch(
          "/api/auth/me",
          {
            method:
              "GET",

            credentials:
              "same-origin",

            cache:
              "no-store",
          }
        );


      if (!response.ok) {
        return;
      }


      const data =
        await response.json();


      try {

        sessionStorage.setItem(
          "cortex_auth_me_v1",
          JSON.stringify({
            savedAt:
              Date.now(),

            data:
              data,
          })
        );

      }
      catch {}


      const accountTheme =
        data &&
        data.usuario
          ? data.usuario.tema
          : null;


      if (
        !accountTheme ||
        versionAtStart !==
          changeVersion
      ) {

        return;
      }


      applyTheme(
        accountTheme,
        {
          persist:
            true,

          broadcast:
            true,

          bumpVersion:
            true,
        }
      );

    }
    catch {
      /*
       * Sem conexao, usa o ultimo tema local.
       */
    }

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

          bumpVersion:
            true,
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

          bumpVersion:
            true,
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

      const normalized =
        applyTheme(
          theme,
          {
            persist:
              true,

            broadcast:
              true,

            bumpVersion:
              true,
          }
        );


      void persistAccountTheme(
        normalized
      );


      return normalized;
    },


    syncFromAccount,


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

          bumpVersion:
            false,
        }
      );


      if (
        window.parent ===
          window
      ) {

        void syncFromAccount();

      }

    }
  );

})();