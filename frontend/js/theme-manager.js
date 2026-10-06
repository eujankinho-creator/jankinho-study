(function () {
  "use strict";

  const STORAGE_KEY = "jankinho_theme_v1";
  const ONLY_THEME = "dark-orange";
  const listeners = new Set();

  function persistLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, ONLY_THEME);
    } catch {}
  }

  function notify() {
    listeners.forEach(function (listener) {
      try {
        listener(ONLY_THEME);
      } catch (error) {
        console.error(error);
      }
    });
  }

  function broadcast() {
    const message = { type: "cortex-theme-change", theme: ONLY_THEME };
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

  function applyTheme(options) {
    const settings = options || {};
    document.documentElement.setAttribute("data-theme", ONLY_THEME);
    persistLocal();

    if (settings.notify !== false) notify();
    if (settings.broadcast !== false) broadcast();

    return ONLY_THEME;
  }

  async function persistAccountTheme() {
    try {
      const response = await fetch("/api/configuracoes/tema", {
        method: "PATCH",
        credentials: "same-origin",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema: ONLY_THEME }),
      });

      if (response.status === 401 || response.status === 403) return;
    } catch {}
  }

  async function syncFromAccount() {
    applyTheme({ broadcast: true, notify: true });
    await persistAccountTheme();
  }

  window.addEventListener("storage", function (event) {
    if (event.key !== STORAGE_KEY) return;
    applyTheme({ broadcast: false, notify: true });
  });

  window.addEventListener("message", function (event) {
    if (event.origin !== window.location.origin) return;
    const data = event.data;
    if (!data || data.type !== "cortex-theme-change") return;
    applyTheme({ broadcast: false, notify: true });
  });

  window.JankinhoTheme = {
    getTheme: function () {
      return ONLY_THEME;
    },

    setTheme: function () {
      const theme = applyTheme({ broadcast: true, notify: true });
      void persistAccountTheme();
      return theme;
    },

    syncFromAccount,

    subscribe: function (callback) {
      if (typeof callback !== "function") return function () {};
      listeners.add(callback);
      return function () {
        listeners.delete(callback);
      };
    },
  };

  applyTheme({ broadcast: false, notify: false });

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme({ broadcast: false, notify: true });
    if (window.parent === window) {
      void syncFromAccount();
    }
  });
})();