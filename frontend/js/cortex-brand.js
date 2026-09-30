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

/* CORTEX PINK PET V2 START */

(function () {

  "use strict";


  let audioContext =
    null;


  let interactionTimer =
    null;


  const animations = [
    "pet-hop",
    "pet-wiggle",
    "pet-purr",
    "pet-squish",
    "pet-ears",
  ];


  const cuteMessages = [
    "Miau!",
    "Miau~",
    "Prrrr...",
    "Mrrr~",
    "Prrr prrr...",
    "Oii!",
    "Me faz carinho!",
    "Miau miau!",
  ];


  function isPinkTheme() {

    return (
      document.documentElement
        .getAttribute(
          "data-theme"
        ) ===
      "pink-glitter"
    );
  }


  function getAudioContext() {

    if (!audioContext) {

      const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;


      if (!AudioContextClass) {
        return null;
      }


      audioContext =
        new AudioContextClass();

    }


    if (
      audioContext.state ===
      "suspended"
    ) {

      audioContext.resume()
        .catch(
          function () {}
        );

    }


    return audioContext;
  }


  function createGain(
    context,
    volume
  ) {

    const gain =
      context.createGain();


    gain.gain.setValueAtTime(
      0.0001,
      context.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
      volume,
      context.currentTime +
      .018
    );


    return gain;
  }


  function cuteMeow() {

    const context =
      getAudioContext();


    if (!context) {
      return;
    }


    const now =
      context.currentTime;


    const oscillator =
      context.createOscillator();


    const gain =
      createGain(
        context,
        .027
      );


    oscillator.type =
      "sine";


    oscillator.frequency
      .setValueAtTime(
        560,
        now
      );


    oscillator.frequency
      .exponentialRampToValueAtTime(
        790,
        now + .105
      );


    oscillator.frequency
      .exponentialRampToValueAtTime(
        490,
        now + .31
      );


    gain.gain
      .exponentialRampToValueAtTime(
        .0001,
        now + .34
      );


    oscillator.connect(
      gain
    );


    gain.connect(
      context.destination
    );


    oscillator.start(
      now
    );


    oscillator.stop(
      now + .35
    );
  }


  function tinyChirp() {

    const context =
      getAudioContext();


    if (!context) {
      return;
    }


    const now =
      context.currentTime;


    const oscillator =
      context.createOscillator();


    const gain =
      createGain(
        context,
        .018
      );


    oscillator.type =
      "sine";


    oscillator.frequency
      .setValueAtTime(
        720,
        now
      );


    oscillator.frequency
      .exponentialRampToValueAtTime(
        1040,
        now + .075
      );


    oscillator.frequency
      .exponentialRampToValueAtTime(
        820,
        now + .16
      );


    gain.gain
      .exponentialRampToValueAtTime(
        .0001,
        now + .19
      );


    oscillator.connect(
      gain
    );


    gain.connect(
      context.destination
    );


    oscillator.start(
      now
    );


    oscillator.stop(
      now + .20
    );
  }


  function softPurr() {

    const context =
      getAudioContext();


    if (!context) {
      return;
    }


    const now =
      context.currentTime;


    const carrier =
      context.createOscillator();


    const modulator =
      context.createOscillator();


    const modulationGain =
      context.createGain();


    const output =
      context.createGain();


    carrier.type =
      "sine";


    carrier.frequency
      .setValueAtTime(
        92,
        now
      );


    modulator.type =
      "sine";


    modulator.frequency
      .setValueAtTime(
        23,
        now
      );


    modulationGain.gain
      .setValueAtTime(
        13,
        now
      );


    output.gain
      .setValueAtTime(
        .0001,
        now
      );


    output.gain
      .exponentialRampToValueAtTime(
        .018,
        now + .045
      );


    output.gain
      .exponentialRampToValueAtTime(
        .0001,
        now + .48
      );


    modulator.connect(
      modulationGain
    );


    modulationGain.connect(
      carrier.frequency
    );


    carrier.connect(
      output
    );


    output.connect(
      context.destination
    );


    carrier.start(
      now
    );


    modulator.start(
      now
    );


    carrier.stop(
      now + .5
    );


    modulator.stop(
      now + .5
    );
  }


  function playRandomSound() {

    const sounds = [
      cuteMeow,
      cuteMeow,
      tinyChirp,
      softPurr,
    ];


    const sound =
      sounds[
        Math.floor(
          Math.random() *
          sounds.length
        )
      ];


    sound();
  }


  function removeAnimationClasses(
    widget
  ) {

    animations.forEach(
      function (className) {

        widget.classList.remove(
          className
        );

      }
    );


    widget.classList.remove(
      "pet-happy"
    );


    widget.classList.remove(
      "pet-interacting"
    );
  }


  function createParticle(
    widget,
    type,
    offset
  ) {

    const shell =
      widget.querySelector(
        ".pink-cat-shell"
      ) ||
      widget;


    const particle =
      document.createElement(
        "span"
      );


    particle.className =
      "pink-cat-particle " +
      type;


    particle.textContent =
      type === "heart"
        ? "\u2665"
        : "\u2726";


    particle.style
      .setProperty(
        "--pet-pop-x",
        offset + "px"
      );


    shell.appendChild(
      particle
    );


    window.setTimeout(
      function () {

        particle.remove();

      },
      1200
    );
  }


  function burstParticles(
    widget
  ) {

    createParticle(
      widget,
      "heart",
      -24
    );


    window.setTimeout(
      function () {

        createParticle(
          widget,
          "star",
          7
        );

      },
      75
    );


    window.setTimeout(
      function () {

        createParticle(
          widget,
          "heart",
          28
        );

      },
      135
    );
  }


  function updateBubble(
    widget
  ) {

    const bubble =
      widget.querySelector(
        ".pink-cat-bubble"
      );


    if (!bubble) {
      return;
    }


    const text =
      cuteMessages[
        Math.floor(
          Math.random() *
          cuteMessages.length
        )
      ];


    bubble.textContent =
      text;


    widget.classList.add(
      "is-open"
    );


    window.setTimeout(
      function () {

        widget.classList.remove(
          "is-open"
        );

      },
      2400
    );
  }


  function interact(
    widget
  ) {

    if (!isPinkTheme()) {
      return;
    }


    if (interactionTimer) {

      window.clearTimeout(
        interactionTimer
      );

    }


    removeAnimationClasses(
      widget
    );


    /*
     * Forca reflow para a animacao poder
     * repetir mesmo em cliques seguidos.
     */

    void widget.offsetWidth;


    const animation =
      animations[
        Math.floor(
          Math.random() *
          animations.length
        )
      ];


    widget.classList.add(
      animation
    );


    widget.classList.add(
      "pet-happy"
    );


    widget.classList.add(
      "pet-interacting"
    );


    widget.classList.add(
      "is-awake"
    );


    burstParticles(
      widget
    );


    updateBubble(
      widget
    );


    playRandomSound();


    interactionTimer =
      window.setTimeout(
        function () {

          removeAnimationClasses(
            widget
          );


          widget.classList.remove(
            "is-awake"
          );

        },
        1450
      );
  }


  function initPetEnhancement() {

    const widget =
      document.querySelector(
        ".pink-cat-widget"
      );


    if (!widget) {
      return;
    }


    const button =
      widget.querySelector(
        ".pink-cat-button"
      );


    if (!button) {
      return;
    }


    if (
      button.dataset
        .cortexPetV2 ===
      "true"
    ) {
      return;
    }


    button.dataset
      .cortexPetV2 =
      "true";


    button.addEventListener(
      "click",
      function () {

        interact(
          widget
        );

      }
    );


    /*
     * Hover curto:
     * apenas mexe as orelhas,
     * sem reproduzir som.
     */

    let hoverTimer =
      null;


    button.addEventListener(
      "mouseenter",
      function () {

        if (!isPinkTheme()) {
          return;
        }


        hoverTimer =
          window.setTimeout(
            function () {

              widget.classList.add(
                "pet-ears"
              );


              window.setTimeout(
                function () {

                  widget.classList.remove(
                    "pet-ears"
                  );

                },
                1000
              );

            },
            380
          );

      }
    );


    button.addEventListener(
      "mouseleave",
      function () {

        if (hoverTimer) {

          window.clearTimeout(
            hoverTimer
          );

        }

      }
    );
  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initPetEnhancement
    );

  }
  else {

    initPetEnhancement();

  }

})();

/* CORTEX PINK PET V2 END */
