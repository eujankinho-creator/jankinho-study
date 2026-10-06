(function () {

  "use strict";


  const ALLOWED_USERS = [];


  let currentUser =
    null;


  let audioContext =
    null;


  const state = {

    happiness:
      72,

    joy:
      70,

    food:
      74,

    energy:
      78

  };


  const foods = {

    snack: {
      food:
        8,

      joy:
        3,

      happiness:
        2
    },

    fish: {
      food:
        15,

      joy:
        6,

      happiness:
        4
    },

    chicken: {
      food:
        18,

      joy:
        5,

      happiness:
        4
    },

    meat: {
      food:
        20,

      joy:
        4,

      happiness:
        3
    }

  };


  /* =======================================================
     UTIL
  ======================================================= */

  function normalizeName(
    value
  ) {

    return String(
      value ||
      ""
    )
      .trim()
      .toLowerCase()
      .normalize(
        "NFD"
      )
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );

  }


  function userAllowed(
    user
  ) {

    return Boolean(
      user &&
      user.id
    );

  }


  function clamp(
    value
  ) {

    return Math.max(
      0,
      Math.min(
        100,
        Number(
          value ||
          0
        )
      )
    );

  }


  function storageKey() {

    return (
      "cortex_pink_pet_v8_" +
      (
        currentUser &&
        currentUser.id
          ? currentUser.id
          : "user"
      )
    );

  }


  function legacyStorageKey() {

    return (
      "cortex_pink_pet_v7_" +
      (
        currentUser &&
        currentUser.id
          ? currentUser.id
          : "user"
      )
    );

  }


  function loadState() {

    try {

      let saved =
        JSON.parse(
          localStorage.getItem(
            storageKey()
          ) ||
          "null"
        );


      /*
       * Migra parte do estado anterior,
       * caso seja a primeira execucao V8.
       */

      if (
        !saved
      ) {

        const old =
          JSON.parse(
            localStorage.getItem(
              legacyStorageKey()
            ) ||
            "null"
          );


        if (
          old
        ) {

          saved = {

            happiness:
              old.affection ??
              72,

            joy:
              old.affection ??
              70,

            food:
              old.food ??
              74,

            energy:
              old.energy ??
              78

          };

        }

      }


      if (
        !saved
      ) {

        return;

      }


      state.happiness =
        clamp(
          saved.happiness ??
          state.happiness
        );


      state.joy =
        clamp(
          saved.joy ??
          state.joy
        );


      state.food =
        clamp(
          saved.food ??
          state.food
        );


      state.energy =
        clamp(
          saved.energy ??
          state.energy
        );

    }
    catch (
      error
    ) {}

  }


  function saveState() {

    try {

      localStorage.setItem(
        storageKey(),
        JSON.stringify(
          state
        )
      );

    }
    catch (
      error
    ) {}

  }


  /* =======================================================
     VISIBILIDADE / PREFERENCIA DO PET
  ======================================================= */

  function petModeKey() {

    return (
      "cortex_pet_mode_v1_" +
      (
        currentUser &&
        currentUser.id
          ? currentUser.id
          : "local"
      )
    );

  }


  function getPetMode() {

    try {

      const saved =
        localStorage.getItem(
          petModeKey()
        );


      if (
        saved === "visible" ||
        saved === "hidden" ||
        saved === "removed"
      ) {

        return saved;

      }

    }
    catch (
      error
    ) {}


    return "hidden";

  }


  function savePetMode(
    mode
  ) {

    try {

      localStorage.setItem(
        petModeKey(),
        mode
      );

    }
    catch (
      error
    ) {}

  }


  function applyPetMode(
    requestedMode,
    persist
  ) {

    const mode =
      requestedMode === "visible" ||
      requestedMode === "hidden" ||
      requestedMode === "removed"
        ? requestedMode
        : "hidden";


    if (
      persist !== false
    ) {

      savePetMode(
        mode
      );

    }


    let pet =
      document.getElementById(
        "cortexPinkPet"
      );


    if (
      mode === "removed"
    ) {

      if (
        pet
      ) {

        pet.remove();

      }


      return mode;

    }


    if (
      !pet
    ) {

      createPet();


      pet =
        document.getElementById(
          "cortexPinkPet"
        );

    }


    if (
      pet
    ) {

      pet.hidden =
        mode !== "visible";


      pet.dataset.petMode =
        mode;

    }


    return mode;

  }


  function updateVisibility() {

    if (
      !userAllowed(
        currentUser
      )
    ) {

      const pet =
        document.getElementById(
          "cortexPinkPet"
        );


      if (
        pet
      ) {

        pet.remove();

      }


      return;

    }


    applyPetMode(
      getPetMode(),
      false
    );

  }


  function watchPetPreference() {

    window.addEventListener(
      "storage",
      function (
        event
      ) {

        if (
          event.key ===
          petModeKey()
        ) {

          updateVisibility();

        }

      }
    );


    window.addEventListener(
      "message",
      function (
        event
      ) {

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
            "cortex:pet-mode"
        ) {

          return;

        }


        if (
          data.userId &&
          currentUser &&
          Number(data.userId) !==
            Number(currentUser.id)
        ) {

          return;

        }


        applyPetMode(
          data.mode,
          true
        );

      }
    );


    window.CortexPetControl = {

      getMode:
        getPetMode,


      setMode:
        function (
          mode
        ) {

          return applyPetMode(
            mode,
            true
          );

        }

    };

  }


  /* =======================================================
     REMOVE SOMENTE O PET ANTIGO
  ======================================================= */

  function removeOldPetFrom(
    doc
  ) {

    if (
      !doc ||
      !doc.querySelectorAll
    ) {

      return;

    }


    [
      ".pink-cat-widget",
      ".pink-cat-speech",
      ".pink-cat-message",
      ".pink-cat-bubble",
      "#pinkCatWidget",
      "#pinkCat"
    ]
      .forEach(
        function (
          selector
        ) {

          doc
            .querySelectorAll(
              selector
            )
            .forEach(
              function (
                element
              ) {

                element.remove();

              }
            );

        }
      );

  }


  function cleanOldPets() {

    removeOldPetFrom(
      document
    );


    const frame =
      document.getElementById(
        "cortexAppFrame"
      );


    if (
      !frame
    ) {

      return;

    }


    try {

      removeOldPetFrom(
        frame.contentDocument
      );

    }
    catch (
      error
    ) {}

  }


  function watchIframe() {

    const frame =
      document.getElementById(
        "cortexAppFrame"
      );


    if (
      !frame
    ) {

      return;

    }


    frame.addEventListener(
      "load",
      function () {

        try {

          removeOldPetFrom(
            frame.contentDocument
          );

        }
        catch (
          error
        ) {}

      }
    );

  }


  /* =======================================================
     AUDIO
  ======================================================= */

  function getAudio() {

    if (
      audioContext
    ) {

      return audioContext;

    }


    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;


    if (
      !AudioContext
    ) {

      return null;

    }


    audioContext =
      new AudioContext();


    return audioContext;

  }


  function resumeAudio(
    context
  ) {

    if (
      context &&
      context.state ===
        "suspended"
    ) {

      context.resume()
        .catch(
          function () {}
        );

    }

  }


  function tone(
    start,
    end,
    duration,
    volume,
    type
  ) {

    const context =
      getAudio();


    if (
      !context
    ) {

      return;

    }


    resumeAudio(
      context
    );


    const oscillator =
      context.createOscillator();


    const gain =
      context.createGain();


    const now =
      context.currentTime;


    oscillator.type =
      type ||
      "sine";


    oscillator.frequency
      .setValueAtTime(
        start,
        now
      );


    oscillator.frequency
      .exponentialRampToValueAtTime(
        Math.max(
          20,
          end
        ),
        now +
        duration
      );


    gain.gain
      .setValueAtTime(
        .0001,
        now
      );


    gain.gain
      .exponentialRampToValueAtTime(
        volume,
        now +
        .01
      );


    gain.gain
      .exponentialRampToValueAtTime(
        .0001,
        now +
        duration
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
      now +
      duration +
      .02
    );

  }


  function crunch(
    delay
  ) {

    window.setTimeout(
      function () {

        tone(
          170 +
          Math.random() *
          40,
          75,
          .065,
          .014,
          "triangle"
        );


        tone(
          950 +
          Math.random() *
          250,
          400,
          .035,
          .004,
          "square"
        );

      },
      delay
    );

  }


  function chewingSound() {

    crunch(
      0
    );

    crunch(
      125
    );

    crunch(
      255
    );

    crunch(
      395
    );

  }


  function purrSound() {

    const context =
      getAudio();


    if (
      !context
    ) {

      return;

    }


    resumeAudio(
      context
    );


    const carrier =
      context.createOscillator();


    const modulation =
      context.createOscillator();


    const modulationGain =
      context.createGain();


    const gain =
      context.createGain();


    const now =
      context.currentTime;


    carrier.type =
      "sine";


    carrier.frequency.value =
      68;


    modulation.type =
      "sine";


    modulation.frequency.value =
      23;


    modulationGain.gain.value =
      .007;


    gain.gain
      .setValueAtTime(
        .0001,
        now
      );


    gain.gain
      .linearRampToValueAtTime(
        .014,
        now +
        .12
      );


    gain.gain
      .linearRampToValueAtTime(
        .0001,
        now +
        1.05
      );


    modulation.connect(
      modulationGain
    );


    modulationGain.connect(
      gain.gain
    );


    carrier.connect(
      gain
    );


    gain.connect(
      context.destination
    );


    carrier.start(
      now
    );


    modulation.start(
      now
    );


    carrier.stop(
      now +
      1.08
    );


    modulation.stop(
      now +
      1.08
    );

  }


  function playSound() {

    tone(
      520,
      760,
      .10,
      .014,
      "sine"
    );


    window.setTimeout(
      function () {

        tone(
          680,
          1050,
          .11,
          .016,
          "sine"
        );

      },
      100
    );


    window.setTimeout(
      function () {

        tone(
          850,
          1250,
          .08,
          .012,
          "sine"
        );

      },
      220
    );

  }


  function sleepSound() {

    tone(
      85,
      67,
      .55,
      .007,
      "sine"
    );


    window.setTimeout(
      function () {

        tone(
          78,
          63,
          .5,
          .006,
          "sine"
        );

      },
      260
    );

  }


  /* =======================================================
     CRIAR PET - UMA UNICA INSTANCIA
  ======================================================= */

  function createPet() {

    const existing =
      document.getElementById(
        "cortexPinkPet"
      );


    if (
      existing
    ) {

      existing.remove();

    }


    const pet =
      document.createElement(
        "div"
      );


    pet.id =
      "cortexPinkPet";


    pet.className =
      "cortex-pet-widget";


    pet.hidden =
      true;


    pet.innerHTML = `

      <section
        id="cortexPetPanel"
        class="cortex-pet-panel"
        aria-hidden="true"
      >

        <div class="cortex-pet-panel-head">

          <div>

            <span class="pet-panel-kicker">
              CORTEX PET
            </span>

            <strong>
              Seu companheiro
            </strong>

          </div>


          <button
            id="cortexPetClose"
            class="cortex-pet-close"
            type="button"
            aria-label="Fechar"
          >
            &times;
          </button>

        </div>


        <div class="cortex-pet-stats">

          <div class="cortex-pet-stat">

            <div>
              <span>Felicidade</span>
              <strong id="petHappinessText">0%</strong>
            </div>

            <div class="cortex-pet-bar">
              <span id="petHappinessBar"></span>
            </div>

          </div>


          <div class="cortex-pet-stat">

            <div>
              <span>Alegria</span>
              <strong id="petJoyText">0%</strong>
            </div>

            <div class="cortex-pet-bar">
              <span id="petJoyBar"></span>
            </div>

          </div>


          <div class="cortex-pet-stat">

            <div>
              <span>Saciedade</span>
              <strong id="petFoodText">0%</strong>
            </div>

            <div class="cortex-pet-bar">
              <span id="petFoodBar"></span>
            </div>

          </div>


          <div class="cortex-pet-stat">

            <div>
              <span>Energia</span>
              <strong id="petEnergyText">0%</strong>
            </div>

            <div class="cortex-pet-bar">
              <span id="petEnergyBar"></span>
            </div>

          </div>

        </div>


        <div class="cortex-pet-divider"></div>


        <div class="cortex-food-section">

          <div class="cortex-food-head">

            <strong>
              Comidinhas
            </strong>

            <span>
              Arraste at&eacute; o pet
            </span>

          </div>


          <div class="cortex-food-tray">

            <button
              class="cortex-food-item"
              data-food="snack"
              type="button"
              title="Arraste o petisco ate o pet"
            >
              <span>&#127850;</span>
              <small>Petisco</small>
            </button>


            <button
              class="cortex-food-item"
              data-food="fish"
              type="button"
              title="Arraste o peixe ate o pet"
            >
              <span>&#128031;</span>
              <small>Peixe</small>
            </button>


            <button
              class="cortex-food-item"
              data-food="chicken"
              type="button"
              title="Arraste o frango ate o pet"
            >
              <span>&#127831;</span>
              <small>Frango</small>
            </button>


            <button
              class="cortex-food-item"
              data-food="meat"
              type="button"
              title="Arraste a carne ate o pet"
            >
              <span>&#129385;</span>
              <small>Carne</small>
            </button>

          </div>

        </div>


        <div class="cortex-pet-divider"></div>


        <div class="cortex-pet-actions">

          <button
            type="button"
            data-pet-action="pet"
          >

            <span class="pet-action-icon">
              &#9825;
            </span>

            <div>
              <strong>Acariciar</strong>
              <small>fa&ccedil;a carinho</small>
            </div>

          </button>


          <button
            type="button"
            data-pet-action="play"
          >

            <span class="pet-action-icon">
              &#9679;
            </span>

            <div>
              <strong>Brincar</strong>
              <small>gaste energia</small>
            </div>

          </button>


          <button
            type="button"
            data-pet-action="sleep"
          >

            <span class="pet-action-icon">
              Zz
            </span>

            <div>
              <strong>Cochilo</strong>
              <small>recupere energia</small>
            </div>

          </button>

        </div>

      </section>


      <button
        id="cortexPetAvatar"
        class="cortex-pet-avatar"
        type="button"
        aria-label="Abrir Cortex Pet"
        aria-expanded="false"
      >

        <span class="cortex-pet-shadow"></span>

        <span class="cortex-pet-tail"></span>

        <span class="cortex-pet-body"></span>


        <span class="cortex-pet-head">

          <span
            class="cortex-pet-ear pet-ear-left"
          ></span>

          <span
            class="cortex-pet-ear pet-ear-right"
          ></span>


          <span
            class="cortex-pet-eye pet-eye-left"
          ></span>

          <span
            class="cortex-pet-eye pet-eye-right"
          ></span>


          <span class="cortex-pet-nose"></span>

          <span class="cortex-pet-mouth-left"></span>

          <span class="cortex-pet-mouth-right"></span>

        </span>


        <span
          id="cortexPetParticles"
          class="cortex-pet-particles"
        ></span>

      </button>

    `;


    document.body
      .appendChild(
        pet
      );


    bindPet();

    renderState();

  }


  /* =======================================================
     STATUS
  ======================================================= */

  function renderState() {

    const values = [

      [
        "petHappinessText",
        "petHappinessBar",
        state.happiness
      ],

      [
        "petJoyText",
        "petJoyBar",
        state.joy
      ],

      [
        "petFoodText",
        "petFoodBar",
        state.food
      ],

      [
        "petEnergyText",
        "petEnergyBar",
        state.energy
      ]

    ];


    values.forEach(
      function (
        entry
      ) {

        const text =
          document.getElementById(
            entry[0]
          );


        const bar =
          document.getElementById(
            entry[1]
          );


        if (
          text
        ) {

          text.textContent =
            Math.round(
              entry[2]
            ) +
            "%";

        }


        if (
          bar
        ) {

          bar.style.width =
            entry[2] +
            "%";

        }

      }
    );


    updatePetMood();

  }


  function updatePetMood() {

    const avatar =
      document.getElementById(
        "cortexPetAvatar"
      );


    if (
      !avatar
    ) {

      return;

    }


    const average =
      (
        state.happiness +
        state.joy +
        state.food +
        state.energy
      ) /
      4;


    avatar.classList.toggle(
      "pet-super-happy",
      average >=
        85
    );


    avatar.classList.toggle(
      "pet-tired",
      state.energy <
        30
    );

  }


  /* =======================================================
     PAINEL
  ======================================================= */

  function togglePanel(
    force
  ) {

    const panel =
      document.getElementById(
        "cortexPetPanel"
      );


    const avatar =
      document.getElementById(
        "cortexPetAvatar"
      );


    if (
      !panel ||
      !avatar
    ) {

      return;

    }


    const open =
      typeof force ===
      "boolean"
        ? force
        : !panel.classList
            .contains(
              "open"
            );


    panel.classList.toggle(
      "open",
      open
    );


    panel.setAttribute(
      "aria-hidden",
      open
        ? "false"
        : "true"
    );


    avatar.setAttribute(
      "aria-expanded",
      open
        ? "true"
        : "false"
    );


    /*
     * Sem fala e sem som ao apenas abrir.
     */

  }


  /* =======================================================
     PARTICULAS
  ======================================================= */

  function particles(
    symbol,
    amount,
    type
  ) {

    const container =
      document.getElementById(
        "cortexPetParticles"
      );


    if (
      !container
    ) {

      return;

    }


    for (
      let index =
        0;

      index <
        amount;

      index++
    ) {

      const particle =
        document.createElement(
          "span"
        );


      particle.className =
        "cortex-pet-particle " +
        type;


      particle.innerHTML =
        symbol;


      particle.style.setProperty(
        "--pet-x",
        (
          -30 +
          Math.random() *
          60
        ) +
        "px"
      );


      particle.style.setProperty(
        "--pet-delay",
        (
          Math.random() *
          .12
        ) +
        "s"
      );


      container.appendChild(
        particle
      );


      window.setTimeout(
        function () {

          particle.remove();

        },
        1050
      );

    }

  }


  /* =======================================================
     ANIMACOES
  ======================================================= */

  function animate(
    className,
    duration
  ) {

    const avatar =
      document.getElementById(
        "cortexPetAvatar"
      );


    if (
      !avatar
    ) {

      return;

    }


    [
      "pet-petting",
      "pet-eating",
      "pet-playing",
      "pet-sleeping"
    ]
      .forEach(
        function (
          item
        ) {

          avatar.classList.remove(
            item
          );

        }
      );


    void avatar.offsetWidth;


    avatar.classList.add(
      className
    );


    window.setTimeout(
      function () {

        avatar.classList.remove(
          className
        );

      },
      duration
    );

  }


  /* =======================================================
     COMER
  ======================================================= */

  function feedPet(
    foodName
  ) {

    const food =
      foods[
        foodName
      ];


    if (
      !food
    ) {

      return;

    }


    state.food =
      clamp(
        state.food +
        food.food
      );


    state.joy =
      clamp(
        state.joy +
        food.joy
      );


    state.happiness =
      clamp(
        state.happiness +
        food.happiness
      );


    state.energy =
      clamp(
        state.energy +
        1
      );


    chewingSound();


    animate(
      "pet-eating",
      850
    );


    particles(
      "&#10022;",
      5,
      "crumb"
    );


    saveState();

    renderState();

  }


  /* =======================================================
     ACOES
  ======================================================= */

  function performAction(
    action
  ) {

    if (
      action ===
      "pet"
    ) {

      state.happiness =
        clamp(
          state.happiness +
          8
        );


      state.joy =
        clamp(
          state.joy +
          5
        );


      purrSound();


      animate(
        "pet-petting",
        900
      );


      particles(
        "&#9829;",
        6,
        "heart"
      );

    }


    if (
      action ===
      "play"
    ) {

      state.happiness =
        clamp(
          state.happiness +
          7
        );


      state.joy =
        clamp(
          state.joy +
          12
        );


      state.energy =
        clamp(
          state.energy -
          7
        );


      state.food =
        clamp(
          state.food -
          2
        );


      playSound();


      animate(
        "pet-playing",
        800
      );


      particles(
        "&#10022;",
        7,
        "star"
      );

    }


    if (
      action ===
      "sleep"
    ) {

      state.energy =
        clamp(
          state.energy +
          18
        );


      state.happiness =
        clamp(
          state.happiness +
          2
        );


      sleepSound();


      animate(
        "pet-sleeping",
        1800
      );


      particles(
        "&#10022;",
        3,
        "sleep"
      );

    }


    saveState();

    renderState();

  }


  /* =======================================================
     ARRASTAR COMIDA - MOUSE + TOUCH
  ======================================================= */

  function bindFoodDrag(
    item
  ) {

    item.addEventListener(
      "pointerdown",
      function (
        event
      ) {

        if (
          event.button !==
            undefined &&
          event.button !==
            0
        ) {

          return;

        }


        event.preventDefault();


        const foodName =
          item.dataset.food;


        const emoji =
          item.querySelector(
            "span"
          );


        let moved =
          false;


        const startX =
          event.clientX;


        const startY =
          event.clientY;


        const ghost =
          document.createElement(
            "div"
          );


        ghost.className =
          "cortex-food-ghost";


        ghost.innerHTML =
          emoji
            ? emoji.innerHTML
            : "&#9679;";


        document.body
          .appendChild(
            ghost
          );


        function moveGhost(
          x,
          y
        ) {

          ghost.style.left =
            x +
            "px";


          ghost.style.top =
            y +
            "px";

        }


        moveGhost(
          event.clientX,
          event.clientY
        );


        const avatar =
          document.getElementById(
            "cortexPetAvatar"
          );


        if (
          avatar
        ) {

          avatar.classList.add(
            "pet-food-target"
          );

        }


        function pointerMove(
          moveEvent
        ) {

          const distance =
            Math.hypot(
              moveEvent.clientX -
              startX,
              moveEvent.clientY -
              startY
            );


          if (
            distance >
            4
          ) {

            moved =
              true;

          }


          moveGhost(
            moveEvent.clientX,
            moveEvent.clientY
          );


          if (
            avatar
          ) {

            const rect =
              avatar
                .getBoundingClientRect();


            const over =
              moveEvent.clientX >=
                rect.left &&
              moveEvent.clientX <=
                rect.right &&
              moveEvent.clientY >=
                rect.top &&
              moveEvent.clientY <=
                rect.bottom;


            avatar.classList.toggle(
              "pet-food-hover",
              over
            );

          }

        }


        function pointerUp(
          upEvent
        ) {

          document.removeEventListener(
            "pointermove",
            pointerMove
          );


          document.removeEventListener(
            "pointerup",
            pointerUp
          );


          document.removeEventListener(
            "pointercancel",
            pointerUp
          );


          ghost.remove();


          if (
            !avatar
          ) {

            return;

          }


          const rect =
            avatar
              .getBoundingClientRect();


          const dropped =
            upEvent.clientX >=
              rect.left &&
            upEvent.clientX <=
              rect.right &&
            upEvent.clientY >=
              rect.top &&
            upEvent.clientY <=
              rect.bottom;


          avatar.classList.remove(
            "pet-food-target",
            "pet-food-hover"
          );


          /*
           * Drop em cima do gato.
           */

          if (
            dropped
          ) {

            feedPet(
              foodName
            );

            return;

          }


          /*
           * No celular, um toque curto tambem
           * alimenta para manter acessibilidade.
           */

          if (
            !moved &&
            event.pointerType ===
              "touch"
          ) {

            feedPet(
              foodName
            );

          }

        }


        document.addEventListener(
          "pointermove",
          pointerMove
        );


        document.addEventListener(
          "pointerup",
          pointerUp
        );


        document.addEventListener(
          "pointercancel",
          pointerUp
        );

      }
    );

  }


  /* =======================================================
     EVENTS
  ======================================================= */

  function bindPet() {

    const avatar =
      document.getElementById(
        "cortexPetAvatar"
      );


    const close =
      document.getElementById(
        "cortexPetClose"
      );


    if (
      avatar
    ) {

      avatar.addEventListener(
        "click",
        function () {

          togglePanel();

        }
      );

    }


    if (
      close
    ) {

      close.addEventListener(
        "click",
        function (
          event
        ) {

          event.stopPropagation();


          togglePanel(
            false
          );

        }
      );

    }


    document
      .querySelectorAll(
        "[data-pet-action]"
      )
      .forEach(
        function (
          button
        ) {

          button.addEventListener(
            "click",
            function (
              event
            ) {

              event.stopPropagation();


              performAction(
                button.dataset
                  .petAction
              );

            }
          );

        }
      );


    document
      .querySelectorAll(
        ".cortex-food-item"
      )
      .forEach(
        bindFoodDrag
      );

  }


  /* =======================================================
     INIT
  ======================================================= */

  async function init() {

    cleanOldPets();


    try {

      const response =
        await fetch(
          "/api/auth/me",
          {
            credentials: "include",

            cache:
              "no-store"
          }
        );


      if (
        !response.ok
      ) {

        return;

      }


      const data =
        await response.json();


      currentUser =
        data.usuario ||
        null;


      if (
        !userAllowed(
          currentUser
        )
      ) {

        return;

      }


      loadState();

      watchPetPreference();

      watchIframe();

      applyPetMode(
        getPetMode(),
        false
      );


      /*
       * Apenas limpa o legado.
       * Nunca toca no #cortexPinkPet.
       */

      window.setTimeout(
        cleanOldPets,
        400
      );


      window.setTimeout(
        cleanOldPets,
        1300
      );

    }
    catch (
      error
    ) {

      console.error(
        "Cortex Pet:",
        error
      );

    }

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:
          true
      }
    );

  }
  else {

    init();

  }

})();


/* CORTEX PET CUSTOMIZER V13 */

(function () {

  "use strict";


  const OUTFITS = {

    none: {
      name:
        "Normal",

      accessory:
        ""
    },


    bow: {
      name:
        "Gravata",

      accessory:
        '<span class="pet-outfit-bow">' +
          '<i></i>' +
          '<i></i>' +
          '<b></b>' +
        '</span>'
    },


    hoodie: {
      name:
        "Moletom",

      accessory:
        '<span class="pet-outfit-hoodie-ring"></span>'
    },


    scarf: {
      name:
        "Cachecol",

      accessory:
        '<span class="pet-outfit-scarf">' +
          '<i></i>' +
        '</span>'
    },


    glasses: {
      name:
        "Oculos",

      accessory:
        '<span class="pet-outfit-glasses">' +
          '<i class="left"></i>' +
          '<i class="right"></i>' +
          '<b></b>' +
        '</span>'
    },


    crown: {
      name:
        "Coroa",

      accessory:
        '<span class="pet-outfit-crown">' +
          '<i></i>' +
          '<i></i>' +
          '<i></i>' +
        '</span>'
    }

  };


  let installing =
    false;


  function cleanName(
    value
  ) {

    return String(
      value ||
      ""
    )
      .replace(
        /[<>]/g,
        ""
      )
      .trim()
      .slice(
        0,
        16
      );

  }


  async function getStorageKey() {

    try {

      const response =
        await fetch(
          "/api/auth/me",
          {
            credentials:
              "include",

            cache:
              "no-store"
          }
        );


      if (
        response.ok
      ) {

        const data =
          await response.json();


        if (
          data.usuario &&
          data.usuario.id
        ) {

          return (
            "cortex_pet_profile_v1_" +
            data.usuario.id
          );

        }

      }

    }
    catch (
      error
    ) {}


    return (
      "cortex_pet_profile_v1_local"
    );

  }


  function loadProfile(
    key
  ) {

    const fallback = {
      name:
        "",

      outfit:
        "none",

      color:
        "theme"
    };


    try {

      const saved =
        JSON.parse(
          localStorage.getItem(
            key
          ) ||
          "null"
        );


      if (
        !saved
      ) {

        return fallback;

      }


      return {
        name:
          cleanName(
            saved.name
          ),

        outfit:
          OUTFITS[
            saved.outfit
          ]
            ? saved.outfit
            : "none",

        color:
          [
            "theme",
            "orange",
            "pink",
            "green",
            "purple",
            "black",
            "white"
          ].includes(
            saved.color
          )
            ? saved.color
            : "theme"
      };

    }
    catch (
      error
    ) {

      return fallback;

    }

  }


  function saveProfile(
    key,
    profile
  ) {

    try {

      localStorage.setItem(
        key,
        JSON.stringify(
          profile
        )
      );

    }
    catch (
      error
    ) {}

  }


  function ensureAccessory(
    avatar
  ) {

    let accessory =
      avatar.querySelector(
        "#cortexPetOutfit"
      );


    if (
      accessory
    ) {

      return accessory;

    }


    accessory =
      document.createElement(
        "span"
      );


    accessory.id =
      "cortexPetOutfit";


    accessory.className =
      "cortex-pet-outfit";


    avatar.appendChild(
      accessory
    );


    return accessory;

  }


  function applyOutfit(
    avatar,
    outfit
  ) {

    const selected =
      OUTFITS[
        outfit
      ]
        ? outfit
        : "none";


    /*
     * Remove classes antigas de roupa do avatar.
     * O avatar nao pode mais mudar sua geometria
     * quando uma roupa e selecionada.
     */

    Object.keys(
      OUTFITS
    )
      .forEach(
        function (
          key
        ) {

          avatar.classList.remove(
            "pet-outfit-" +
            key
          );

        }
      );


    /*
     * Apenas um atributo identifica a roupa atual.
     * Isso evita colisao com estilos antigos.
     */

    avatar.dataset.petOutfit =
      selected;


    const accessory =
      ensureAccessory(
        avatar
      );


    /*
     * A roupa vive somente nesta camada.
     */

    accessory.className =
      "cortex-pet-outfit";


    accessory.dataset.outfit =
      selected;


    accessory.innerHTML =
      OUTFITS[
        selected
      ].accessory;


    function syncColorButtons() {

      document
        .querySelectorAll("[data-pet-custom-color]")
        .forEach(function (button) {

          const active =
            button.dataset.petCustomColor ===
            (profile.color || "theme");


          button.classList.toggle(
            "selected",
            active
          );


          button.setAttribute(
            "aria-pressed",
            active ? "true" : "false"
          );

        });

    }


    document
      .querySelectorAll("[data-pet-custom-color]")
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function (event) {

            event.stopPropagation();


            const color =
              button.dataset.petCustomColor;


            if (
              ![
                "theme",
                "orange",
                "pink",
                "green",
                "purple",
                "black",
                "white"
              ].includes(color)
            ) {

              return;

            }


            profile.color =
              color;


            saveProfile(
              key,
              profile
            );


            syncColorButtons();


            window.postMessage(
              {
                type: "cortex:pet-profile",
                profile: profile
              },
              window.location.origin
            );

          }
        );

      });


    syncColorButtons();


    document
      .querySelectorAll(
        ".cortex-pet-outfit-option"
      )
      .forEach(
        function (
          button
        ) {

          const active =
            button.dataset.outfit ===
            selected;


          button.classList.toggle(
            "selected",
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


    /*
     * Remove qualquer posicao inline residual.
     * Nao mexe nas animacoes normais do pet.
     */

    avatar.style.removeProperty(
      "left"
    );

    avatar.style.removeProperty(
      "top"
    );

    avatar.style.removeProperty(
      "right"
    );

    avatar.style.removeProperty(
      "bottom"
    );

    avatar.style.removeProperty(
      "margin"
    );

  }


  async function installCustomizer() {

    if (
      installing
    ) {

      return;

    }


    const panel =
      document.getElementById(
        "cortexPetPanel"
      );


    const avatar =
      document.getElementById(
        "cortexPetAvatar"
      );


    if (
      !panel ||
      !avatar
    ) {

      return;

    }


    if (
      panel.dataset
        .customizerReady ===
        "true"
    ) {

      return;

    }


    installing =
      true;


    const key =
      await getStorageKey();


    const profile =
      loadProfile(
        key
      );


    const panelHead =
      panel.querySelector(
        ".cortex-pet-panel-head"
      );


    const headerName =
      panelHead
        ? panelHead.querySelector(
            "strong"
          )
        : null;


    const stats =
      panel.querySelector(
        ".cortex-pet-stats"
      );


    if (
      !stats
    ) {

      installing =
        false;

      return;

    }


    const customizer =
      document.createElement(
        "section"
      );


    customizer.className =
      "cortex-pet-customizer";


    customizer.innerHTML = `

      <div class="pet-customizer-block">

        <div class="pet-customizer-title">

          <div>
            <strong>
              Nome do pet
            </strong>

            <span>
              D&ecirc; uma identidade para ele
            </span>
          </div>

        </div>


        <div class="cortex-pet-name-editor">

          <input
            id="cortexPetNameInput"
            type="text"
            maxlength="16"
            autocomplete="off"
            placeholder="Ex.: Luna"
          >

          <button
            id="cortexPetNameSave"
            type="button"
          >
            Salvar
          </button>

        </div>

      </div>


      <div class="pet-customizer-divider"></div>


      <div class="pet-customizer-block pet-color-customizer">

        <div class="pet-customizer-title">

          <div>
            <strong>
              Cor
            </strong>

            <span>
              Siga o tema ou escolha uma cor
            </span>
          </div>

        </div>

        <div class="cortex-pet-color-grid">
          <button type="button" data-pet-custom-color="theme"><i></i><small>Tema</small></button>
          <button type="button" data-pet-custom-color="orange"><i></i><small>Laranja</small></button>
          <button type="button" data-pet-custom-color="pink"><i></i><small>Rosa</small></button>
          <button type="button" data-pet-custom-color="green"><i></i><small>Verde</small></button>
          <button type="button" data-pet-custom-color="purple"><i></i><small>Roxo</small></button>
          <button type="button" data-pet-custom-color="black"><i></i><small>Preto</small></button>
          <button type="button" data-pet-custom-color="white"><i></i><small>Branco</small></button>
        </div>

      </div>


      <div class="pet-customizer-divider"></div>


      <div class="pet-customizer-block">

        <div class="pet-customizer-title">

          <div>
            <strong>
              Estilo
            </strong>

            <span>
              Escolha o visual do pet
            </span>
          </div>

        </div>


        <div class="cortex-pet-outfit-grid">

          <button
            class="cortex-pet-outfit-option"
            data-outfit="none"
            type="button"
          >
            <span class="outfit-option-preview">
              &bull;
            </span>

            <small>
              Normal
            </small>
          </button>


          <button
            class="cortex-pet-outfit-option"
            data-outfit="bow"
            type="button"
          >
            <span class="outfit-option-preview bow-preview">
              &#9829;
            </span>

            <small>
              Gravata
            </small>
          </button>


          <button
            class="cortex-pet-outfit-option"
            data-outfit="hoodie"
            type="button"
          >
            <span class="outfit-option-preview hoodie-preview">
              H
            </span>

            <small>
              Moletom
            </small>
          </button>


          <button
            class="cortex-pet-outfit-option"
            data-outfit="scarf"
            type="button"
          >
            <span class="outfit-option-preview scarf-preview">
              S
            </span>

            <small>
              Cachecol
            </small>
          </button>


          <button
            class="cortex-pet-outfit-option"
            data-outfit="glasses"
            type="button"
          >
            <span class="outfit-option-preview glasses-preview">
              OO
            </span>

            <small>
              Oculos
            </small>
          </button>


          <button
            class="cortex-pet-outfit-option"
            data-outfit="crown"
            type="button"
          >
            <span class="outfit-option-preview crown-preview">
              &#9819;
            </span>

            <small>
              Coroa
            </small>
          </button>

        </div>

      </div>

    `;


    panel.insertBefore(
      customizer,
      stats
    );


    const input =
      document.getElementById(
        "cortexPetNameInput"
      );


    const saveButton =
      document.getElementById(
        "cortexPetNameSave"
      );


    function applyName() {

      const name =
        cleanName(
          profile.name
        );


      if (
        headerName
      ) {

        headerName.textContent =
          name ||
          "Seu companheiro";

      }


      if (
        input
      ) {

        input.value =
          name;

      }

    }


    function saveName() {

      const name =
        cleanName(
          input
            ? input.value
            : ""
        );


      profile.name =
        name;


      saveProfile(
        key,
        profile
      );


      applyName();


      if (
        saveButton
      ) {

        saveButton.classList.add(
          "saved"
        );


        saveButton.textContent =
          "Salvo";


        window.setTimeout(
          function () {

            saveButton.classList.remove(
              "saved"
            );


            saveButton.textContent =
              "Salvar";

          },
          900
        );

      }

    }


    if (
      saveButton
    ) {

      saveButton.addEventListener(
        "click",
        function (
          event
        ) {

          event.stopPropagation();

          saveName();

        }
      );

    }


    if (
      input
    ) {

      input.addEventListener(
        "keydown",
        function (
          event
        ) {

          if (
            event.key ===
            "Enter"
          ) {

            event.preventDefault();

            saveName();

            input.blur();

          }

        }
      );


      input.addEventListener(
        "click",
        function (
          event
        ) {

          event.stopPropagation();

        }
      );

    }


    document
      .querySelectorAll(
        ".cortex-pet-outfit-option"
      )
      .forEach(
        function (
          button
        ) {

          button.addEventListener(
            "click",
            function (
              event
            ) {

              event.stopPropagation();


              const outfit =
                button.dataset
                  .outfit;


              if (
                !OUTFITS[
                  outfit
                ]
              ) {

                return;

              }


              profile.outfit =
                outfit;


              saveProfile(
                key,
                profile
              );


              applyOutfit(
                avatar,
                outfit
              );

            }
          );

        }
      );


    applyName();


    applyOutfit(
      avatar,
      profile.outfit
    );


    panel.dataset
      .customizerReady =
      "true";


    installing =
      false;

  }


  function boot() {

    installCustomizer();


    const observer =
      new MutationObserver(
        function () {

          const panel =
            document.getElementById(
              "cortexPetPanel"
            );


          if (
            panel &&
            panel.dataset
              .customizerReady !==
              "true"
          ) {

            installCustomizer();

          }

        }
      );


    observer.observe(
      document.body,
      {
        childList:
          true,

        subtree:
          true
      }
    );

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      boot,
      {
        once:
          true
      }
    );

  }
  else {

    boot();

  }

})();



/* CORTEX PET THEME BRIDGE V1 */
(function () {
  "use strict";

  const COLORS = {
    orange: {
      accent: "#ff6500",
      accent2: "#ff9a3c",
      dark: "#b84400",
      rgb: "255,101,0",
    },
    pink: {
      accent: "#ff3d8d",
      accent2: "#ff78b4",
      dark: "#b51f61",
      rgb: "255,61,141",
    },
    green: {
      accent: "#22d36b",
      accent2: "#68e69b",
      dark: "#128a43",
      rgb: "34,211,107",
    },
    purple: {
      accent: "#9b5cff",
      accent2: "#c092ff",
      dark: "#6130b7",
      rgb: "155,92,255",
    },
    black: {
      accent: "#282828",
      accent2: "#4a4a4a",
      dark: "#111111",
      rgb: "40,40,40",
    },
    white: {
      accent: "#ececec",
      accent2: "#ffffff",
      dark: "#bdbdbd",
      rgb: "236,236,236",
    },
  };

  const OUTFITS = {
    none: "",
    bow:
      '<span class="pet-outfit-bow">' +
        '<i></i><i></i><b></b>' +
      '</span>',
    hoodie:
      '<span class="pet-outfit-hoodie-ring"></span>',
    scarf:
      '<span class="pet-outfit-scarf"><i></i></span>',
    glasses:
      '<span class="pet-outfit-glasses">' +
        '<i class="left"></i><i class="right"></i><b></b>' +
      '</span>',
    crown:
      '<span class="pet-outfit-crown"><i></i><i></i><i></i></span>',
  };

  let userId = null;
  let profileKey = "cortex_pet_profile_v1_local";

  function normalizeProfile(value) {
    const input = value && typeof value === "object" ? value : {};
    const color = input.color === "theme" || COLORS[input.color]
      ? input.color
      : "theme";
    const outfit = Object.prototype.hasOwnProperty.call(OUTFITS, input.outfit)
      ? input.outfit
      : "none";

    return {
      name: String(input.name || "")
        .replace(/[<>]/g, "")
        .trim()
        .slice(0, 16),
      color,
      outfit,
    };
  }

  function loadProfile() {
    try {
      return normalizeProfile(
        JSON.parse(localStorage.getItem(profileKey) || "null")
      );
    } catch {
      return normalizeProfile(null);
    }
  }

  function saveProfile(profile) {
    const normalized = normalizeProfile(profile);
    try {
      localStorage.setItem(profileKey, JSON.stringify(normalized));
    } catch {}
    return normalized;
  }

  function ensureAccessory(avatar) {
    let accessory = avatar.querySelector("#cortexPetOutfit");

    if (!accessory) {
      accessory = document.createElement("span");
      accessory.id = "cortexPetOutfit";
      accessory.className = "cortex-pet-outfit";
      avatar.appendChild(accessory);
    }

    return accessory;
  }

  function applyOutfit(avatar, outfit) {
    const selected = Object.prototype.hasOwnProperty.call(OUTFITS, outfit)
      ? outfit
      : "none";

    avatar.dataset.petOutfit = selected;

    const accessory = ensureAccessory(avatar);
    accessory.dataset.outfit = selected;
    accessory.innerHTML = OUTFITS[selected];

    document
      .querySelectorAll(".cortex-pet-outfit-option")
      .forEach(function (button) {
        const active = button.dataset.outfit === selected;
        button.classList.toggle("selected", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
  }

  function applyColor(root, color) {
    if (color === "theme") {
      root.style.removeProperty("--pet-accent");
      root.style.removeProperty("--pet-accent-2");
      root.style.removeProperty("--pet-accent-dark");
      root.style.removeProperty("--pet-accent-rgb");
      root.dataset.petColor = "theme";
      return;
    }

    const palette = COLORS[color] || COLORS.orange;

    root.style.setProperty("--pet-accent", palette.accent);
    root.style.setProperty("--pet-accent-2", palette.accent2);
    root.style.setProperty("--pet-accent-dark", palette.dark);
    root.style.setProperty("--pet-accent-rgb", palette.rgb);
    root.dataset.petColor = color;
  }

  function applyProfile(profileInput) {
    const root = document.getElementById("cortexPinkPet");
    const avatar = document.getElementById("cortexPetAvatar");
    const panel = document.getElementById("cortexPetPanel");

    if (!root || !avatar) {
      return false;
    }

    const profile = normalizeProfile(profileInput || loadProfile());

    applyColor(root, profile.color);
    applyOutfit(avatar, profile.outfit);

    if (panel) {
      const title = panel.querySelector(".cortex-pet-panel-head strong");
      if (title) {
        title.textContent = profile.name || "Seu companheiro";
      }

      const nameInput = panel.querySelector("#cortexPetNameInput");
      if (nameInput && document.activeElement !== nameInput) {
        nameInput.value = profile.name || "";
      }
    }

    return true;
  }

  function applySoon() {
    let tries = 0;
    const timer = window.setInterval(function () {
      tries += 1;

      if (applyProfile() || tries >= 16) {
        window.clearInterval(timer);
      }
    }, 180);
  }

  async function resolveUser() {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      userId = data && data.usuario ? data.usuario.id : null;
      profileKey = "cortex_pet_profile_v1_" + (userId || "local");
    } catch {}
  }

  window.addEventListener("message", function (event) {
    if (event.origin !== window.location.origin) {
      return;
    }

    const data = event.data;

    if (!data) {
      return;
    }

    if (data.type === "cortex:pet-profile") {
      if (
        data.userId &&
        userId &&
        Number(data.userId) !== Number(userId)
      ) {
        return;
      }

      if (
        data.userId &&
        !userId
      ) {
        userId = Number(data.userId);
        profileKey = "cortex_pet_profile_v1_" + userId;
      }

      const profile = saveProfile(data.profile);
      applyProfile(profile);
      return;
    }

    if (data.type === "cortex:pet-mode" && data.mode === "visible") {
      window.setTimeout(function () {
        applyProfile();
      }, 80);
    }
  });

  window.addEventListener("storage", function (event) {
    if (event.key === profileKey) {
      applyProfile();
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    void resolveUser().then(function () {
      applySoon();
    });
  }, { once: true });

  if (document.readyState !== "loading") {
    void resolveUser().then(function () {
      applySoon();
    });
  }

  if (
    window.JankinhoTheme &&
    typeof window.JankinhoTheme.subscribe === "function"
  ) {
    window.JankinhoTheme.subscribe(function () {
      const profile = loadProfile();
      if (profile.color === "theme") {
        applyProfile(profile);
      }
    });
  }
})();
/* CORTEX PET THEME BRIDGE V1 END */
