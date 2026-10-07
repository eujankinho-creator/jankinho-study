(function () {
  "use strict";

  const STORAGE_KEY = "jankinho_theme_v1";
  const DEFAULT_THEME = "dark-purple";
  const THEMES = new Set([
    "dark-orange",
    "dark-pink",
    "dark-green",
    "dark-purple",
    "dark-black",
  ]);
  const listeners = new Set();

  function normalizeTheme(value) {
    const raw = String(value || "").trim();

    const legacyMap = {
      "orange-black": "dark-orange",
      "pink-glitter": "dark-pink",
      "black-white": "dark-black",
      "blue-black": "dark-black",
    };

    const theme = legacyMap[raw] || raw;

    return THEMES.has(theme)
      ? theme
      : DEFAULT_THEME;
  }

  function readLocalTheme() {
    try {
      return normalizeTheme(localStorage.getItem(STORAGE_KEY));
    } catch {
      return DEFAULT_THEME;
    }
  }

  function persistLocal(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, normalizeTheme(theme));
    } catch {}
  }

  function notify(theme) {
    listeners.forEach(function (listener) {
      try {
        listener(theme);
      } catch (error) {
        console.error(error);
      }
    });
  }

  function broadcast(theme) {
    const normalized = normalizeTheme(theme);
    const message = {
      type: "cortex-theme-change",
      theme: normalized,
    };
    const origin = window.location.origin;

    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(message, origin);
      }
    } catch {}

    try {
      document.querySelectorAll("iframe").forEach(function (frame) {
        if (frame.contentWindow) {
          frame.contentWindow.postMessage(message, origin);
        }
      });
    } catch {}
  }

  function applyTheme(theme, options) {
    const normalized = normalizeTheme(theme);
    const settings = options || {};

    document.documentElement.setAttribute("data-theme", normalized);
    persistLocal(normalized);

    if (settings.notify !== false) {
      notify(normalized);
    }

    if (settings.broadcast !== false) {
      broadcast(normalized);
    }

    return normalized;
  }

  async function persistAccountTheme(theme) {
    const normalized = normalizeTheme(theme);

    try {
      const response = await fetch("/api/configuracoes/tema", {
        method: "PATCH",
        credentials: "same-origin",
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tema: normalized,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        return normalized;
      }

      return normalized;
    } catch {
      return normalized;
    }
  }

  async function syncFromAccount() {
    let theme = readLocalTheme();

    try {
      const response = await fetch("/api/configuracoes", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json().catch(function () {
          return {};
        });

        theme = normalizeTheme(
          data &&
          data.usuario &&
          data.usuario.tema
        );
      }
    } catch {}

    return applyTheme(theme, {
      broadcast: true,
      notify: true,
    });
  }

  window.addEventListener("storage", function (event) {
    if (event.key !== STORAGE_KEY) {
      return;
    }

    applyTheme(event.newValue, {
      broadcast: false,
      notify: true,
    });
  });

  window.addEventListener("message", function (event) {
    if (event.origin !== window.location.origin) {
      return;
    }

    const data = event.data;

    if (!data || data.type !== "cortex-theme-change") {
      return;
    }

    applyTheme(data.theme, {
      broadcast: false,
      notify: true,
    });
  });

  window.JankinhoTheme = {
    themes: Array.from(THEMES),

    getTheme: function () {
      return normalizeTheme(
        document.documentElement.getAttribute("data-theme") ||
        readLocalTheme()
      );
    },

    setTheme: function (theme) {
      const normalized = applyTheme(theme, {
        broadcast: true,
        notify: true,
      });

      void persistAccountTheme(normalized);

      return normalized;
    },

    syncFromAccount,

    subscribe: function (callback) {
      if (typeof callback !== "function") {
        return function () {};
      }

      listeners.add(callback);

      return function () {
        listeners.delete(callback);
      };
    },
  };

  applyTheme(readLocalTheme(), {
    broadcast: false,
    notify: false,
  });

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(readLocalTheme(), {
      broadcast: false,
      notify: true,
    });

    if (window.parent === window) {
      void syncFromAccount();
    }
  });
})();