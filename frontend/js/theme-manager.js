(function () {
  "use strict";

  const STORAGE_KEY = "jankinho_theme_v1";
  const THEMES = ["dark-orange", "pink-glitter"];
  const listeners = [];

  function normalize(theme) {
    if (THEMES.includes(theme)) {
      return theme;
    }

    return "dark-orange";
  }

  function getTheme() {
    try {
      return normalize(localStorage.getItem(STORAGE_KEY));
    }
    catch {
      return "dark-orange";
    }
  }

  function applyTheme(theme) {
    const normalized = normalize(theme);

    document.documentElement.setAttribute(
      "data-theme",
      normalized
    );

    try {
      localStorage.setItem(
        STORAGE_KEY,
        normalized
      );
    }
    catch {}

    for (const listener of listeners) {
      try {
        listener(normalized);
      }
      catch (error) {
        console.error(error);
      }
    }
  }

  const initialTheme = getTheme();
  document.documentElement.setAttribute(
    "data-theme",
    initialTheme
  );

  window.JankinhoTheme = {
    getTheme,
    setTheme(theme) {
      applyTheme(theme);
    },
    subscribe(callback) {
      if (typeof callback === "function") {
        listeners.push(callback);
      }
    },
  };

  document.addEventListener(
    "DOMContentLoaded",
    function () {
      applyTheme(getTheme());
    }
  );
})();