(function () {
  "use strict";

  function ensureCortexLogo() {
    const logos =
      document.querySelectorAll(".logo-box");

    logos.forEach(function (logo) {
      if (logo.classList.contains("cortex-logo")) {
        return;
      }

      logo.classList.add("cortex-logo");

      logo.innerHTML = '<svg class="cortex-brain-logo" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 4.5A2.5 2.5 0 0 0 7 7v.2A2.8 2.8 0 0 0 5 12c-.6.5-1 1.3-1 2.2A2.8 2.8 0 0 0 7 17a2.5 2.5 0 0 0 5 0V7a2.5 2.5 0 0 0-2.5-2.5Z"/><path d="M14.5 4.5A2.5 2.5 0 0 1 17 7v.2a2.8 2.8 0 0 1 2 4.8c.6.5 1 1.3 1 2.2A2.8 2.8 0 0 1 17 17a2.5 2.5 0 0 1-5 0V7a2.5 2.5 0 0 1 2.5-2.5Z"/><path d="M8.5 9.3c1 .1 1.7.6 2 1.4M15.5 9.3c-1 .1-1.7.6-2 1.4M8.5 14c1-.1 1.7-.6 2-1.4M15.5 14c-1-.1-1.7-.6-2-1.4"/></svg>';
    });
  }

  function ensurePinkCatWidget() {
    if (document.getElementById("pinkCatWidget")) {
      return;
    }

    const widget =
      document.createElement("div");

    widget.id = "pinkCatWidget";
    widget.className = "pink-cat-widget";

    widget.innerHTML = [
      '<div class="pink-cat-shell">',
      '  <div class="pink-cat-bubble" id="pinkCatBubble">Miau!</div>',
      '  <button type="button" class="pink-cat-button" aria-label="Interagir com o gatinho">',
      '    <span class="pink-cat-sparkle" aria-hidden="true"></span>',
      '    <span class="pink-cat-face">',
      '      <span class="pink-cat-head">',
      '        <span class="pink-cat-ear left"></span>',
      '        <span class="pink-cat-ear right"></span>',
      '        <span class="pink-cat-eye left"></span>',
      '        <span class="pink-cat-eye right"></span>',
      '        <span class="pink-cat-blush left"></span>',
      '        <span class="pink-cat-blush right"></span>',
      '        <span class="pink-cat-nose"></span>',
      '        <span class="pink-cat-mouth"></span>',
      '      </span>',
      '      <span class="pink-cat-paw"></span>',
      '    </span>',
      '  </button>',
      '</div>'
    ].join("");

    document.body.appendChild(widget);

    const button =
      widget.querySelector(".pink-cat-button");

    const bubble =
      widget.querySelector(".pink-cat-bubble");

    const frases = [
      "Miau!",
      "Miau~",
      "Prrrr...",
      "Prrrrrrrr...",
      "Mrrr...",
      "Purrr..."
    ];

    let closeTimer = null;

    function abrirWidget() {
      const frase =
        frases[
          Math.floor(Math.random() * frases.length)
        ];

      bubble.textContent = frase;

      widget.classList.add("is-open");
      widget.classList.remove("is-awake");

      void widget.offsetWidth;

      widget.classList.add("is-awake");

      window.clearTimeout(closeTimer);

      closeTimer =
        window.setTimeout(function () {
          widget.classList.remove("is-awake");
          widget.classList.remove("is-open");
        }, 3200);
    }

    button.addEventListener("click", function (event) {
      event.stopPropagation();
      abrirWidget();
    });

    document.addEventListener("click", function (event) {
      if (!widget.contains(event.target)) {
        widget.classList.remove("is-open");
      }
    });
  }

  function init() {
    ensureCortexLogo();
    ensurePinkCatWidget();
  }

  document.addEventListener(
    "DOMContentLoaded",
    init
  );
})();