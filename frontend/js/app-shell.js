(function () {

  "use strict";


  const $ = function (id) {
    return document.getElementById(id);
  };


  const frame =
    $("cortexAppFrame");


  const state = {

    connected:
      false,

    player:
      null,

    deviceId:
      null,

    playback:
      null,

    playbackUpdatedAt:
      0,

    dragging:
      false,

    volume:
      .55,

  };


  async function api(
    url,
    options
  ) {

    const response =
      await fetch(
        url,
        {
          credentials:
            "same-origin",

          ...options,
        }
      );


    const data =
      await response
        .json()
        .catch(
          function () {
            return {};
          }
        );


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Erro na requisicao."
      );
    }


    return data;
  }


  function formatTime(
    milliseconds
  ) {

    const secondsTotal =
      Math.max(
        0,
        Math.floor(
          Number(
            milliseconds ||
            0
          ) /
          1000
        )
      );


    const minutes =
      Math.floor(
        secondsTotal /
        60
      );


    const seconds =
      String(
        secondsTotal %
        60
      ).padStart(
        2,
        "0"
      );


    return (
      minutes +
      ":" +
      seconds
    );
  }


  function currentPosition() {

    if (!state.playback) {
      return 0;
    }


    let position =
      state.playback.position;


    if (
      !state.playback.paused
    ) {

      position +=
        Date.now() -
        state.playbackUpdatedAt;

    }


    return Math.min(
      position,
      state.playback.duration
    );
  }


  function resetTrack() {

    $("globalTrackName")
      .textContent =
      "Cortex Player";


    $("globalTrackArtist")
      .textContent =
      state.connected
        ? "Escolha uma musica"
        : "Conecte o Spotify";


    $("globalCover")
      .classList.add(
        "hidden"
      );


    $("globalCoverPlaceholder")
      .classList.remove(
        "hidden"
      );


    $("globalProgress").value =
      "0";


    $("globalCurrentTime")
      .textContent =
      "0:00";


    $("globalDuration")
      .textContent =
      "0:00";


    $("globalPlay")
      .innerHTML =
      "&#9654;";
  }


  function renderConnection() {

    const button =
      $("globalSpotifyConnect");


    if (
      state.connected
    ) {

      button.textContent =
        state.deviceId
          ? "Spotify online"
          : "Conectando...";


      button.classList.add(
        "connected"
      );


      showPlayerBubble();

    }
    else {

      button.textContent =
        "Conectar";


      button.classList.remove(
        "connected"
      );


      if (
        !hasActiveTrack()
      ) {

        hidePlayerBubble();

      }

    }
  }


  function renderPlayback() {

    const playback =
      state.playback;


    if (
      !playback ||
      !playback.track
    ) {

      resetTrack();

      return;
    }


    const track =
      playback.track;


    $("globalTrackName")
      .textContent =
      track.name ||
      "Spotify";


    $("globalTrackArtist")
      .textContent =
      Array.isArray(
        track.artists
      )
        ? track.artists
            .map(
              function (artist) {
                return artist.name;
              }
            )
            .join(", ")
        : "";


    const cover =
      track.album &&
      Array.isArray(
        track.album.images
      )
        ? track.album.images[0]
        : null;


    if (
      cover &&
      cover.url
    ) {

      $("globalCover").src =
        cover.url;


      $("globalCover")
        .classList.remove(
          "hidden"
        );


      $("globalCoverPlaceholder")
        .classList.add(
          "hidden"
        );

    }


    $("globalPlay")
      .innerHTML =
      playback.paused
        ? "&#9654;"
        : "&#10074;&#10074;";


    $("globalPlay")
      .setAttribute(
        "aria-label",
        playback.paused
          ? "Play"
          : "Pausar"
      );


    updateProgress();


    if (
      typeof showPlayerBubble ===
      "function" &&
      !document.body.classList.contains(
        "global-player-open"
      )
    ) {

      showPlayerBubble();

    }
  }


  function updateProgress() {

    if (
      !state.playback ||
      state.dragging
    ) {
      return;
    }


    const position =
      currentPosition();


    const duration =
      state.playback.duration ||
      0;


    const value =
      duration > 0
        ? Math.round(
            position /
            duration *
            1000
          )
        : 0;


    $("globalProgress").value =
      String(value);


    $("globalCurrentTime")
      .textContent =
      formatTime(
        position
      );


    $("globalDuration")
      .textContent =
      formatTime(
        duration
      );
  }


  async function getToken() {

    const data =
      await api(
        "/api/spotify/token"
      );


    return data.accessToken;
  }


  function loadSdk() {

    if (
      window.Spotify &&
      window.Spotify.Player
    ) {

      createPlayer();

      return;
    }


    if (
      document.getElementById(
        "spotifyGlobalSdk"
      )
    ) {
      return;
    }


    window.onSpotifyWebPlaybackSDKReady =
      function () {

        createPlayer();

      };


    const script =
      document.createElement(
        "script"
      );


    script.id =
      "spotifyGlobalSdk";


    script.src =
      "https://sdk.scdn.co/spotify-player.js";


    script.async =
      true;


    document.body.appendChild(
      script
    );
  }


  function createPlayer() {

    if (
      state.player ||
      !window.Spotify
    ) {
      return;
    }


    const player =
      new window.Spotify.Player({

        name:
          "Cortex Global Player",

        volume:
          state.volume,

        enableMediaSession:
          true,

        getOAuthToken:
          function (callback) {

            getToken()
              .then(
                function (token) {

                  callback(
                    token
                  );

                }
              )
              .catch(
                function (error) {

                  console.error(
                    error
                  );

                  state.connected =
                    false;

                  renderConnection();

                }
              );
        },

      });


    state.player =
      player;


    player.addListener(
      "ready",
      function (data) {

        state.deviceId =
          data.device_id;


        renderConnection();

      }
    );


    player.addListener(
      "not_ready",
      function () {

        state.deviceId =
          null;


        renderConnection();

      }
    );


    player.addListener(
      "player_state_changed",
      function (spotifyState) {

        if (!spotifyState) {
          return;
        }


        state.playback = {

          position:
            spotifyState.position,

          duration:
            spotifyState.duration,

          paused:
            spotifyState.paused,

          track:
            spotifyState
              .track_window
              .current_track,

        };


        state.playbackUpdatedAt =
          Date.now();


        renderPlayback();


        if (
          typeof showPlayerBubble ===
          "function" &&
          !document.body.classList.contains(
            "global-player-open"
          )
        ) {

          showPlayerBubble();

        }

      }
    );


    player.addListener(
      "authentication_error",
      function (data) {

        console.error(
          data
        );


        state.connected =
          false;


        state.deviceId =
          null;


        renderConnection();

      }
    );


    player.addListener(
      "account_error",
      function (data) {

        console.error(
          data
        );


        alert(
          "O Cortex Player requer Spotify Premium."
        );

      }
    );


    player
      .connect()
      .catch(
        function (error) {

          console.error(
            error
          );

        }
      );
  }


  async function playUris(
    uris,
    offset
  ) {

    if (
      !state.player ||
      !state.deviceId
    ) {

      throw new Error(
        "Cortex Player ainda esta conectando."
      );
    }


    const validUris =
      Array.isArray(
        uris
      )
        ? uris.filter(
            function (uri) {

              return (
                typeof uri ===
                  "string" &&
                uri.startsWith(
                  "spotify:track:"
                )
              );

            }
          )
        : [];


    if (
      validUris.length ===
      0
    ) {

      throw new Error(
        "Musica invalida."
      );
    }


    if (
      typeof state.player
        .activateElement ===
      "function"
    ) {

      await state.player
        .activateElement()
        .catch(
          function () {}
        );
    }


    await api(
      "/api/spotify/play",
      {
        method:
          "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({

            deviceId:
              state.deviceId,

            uris:
              validUris,

            offset:
              Number(
                offset ||
                0
              ),

          }),
      }
    );
  }


  async function playUri(
    uri
  ) {

    return playUris(
      [uri],
      0
    );
  }


  async function togglePlay() {

    if (!state.player) {
      return;
    }


    await state.player
      .togglePlay();
  }


  async function previous() {

    if (!state.player) {
      return;
    }


    await state.player
      .previousTrack();
  }


  async function next() {

    if (!state.player) {
      return;
    }


    await state.player
      .nextTrack();
  }


  async function setVolume(
    value
  ) {

    const normalized =
      Math.max(
        0,
        Math.min(
          1,
          Number(
            value ||
            0
          )
        )
      );


    state.volume =
      normalized;


    if (
      state.player
    ) {

      await state.player
        .setVolume(
          normalized
        );
    }
  }


  async function seek(
    milliseconds
  ) {

    if (!state.player) {
      return;
    }


    await state.player
      .seek(
        milliseconds
      );
  }


  async function disconnect() {

    if (
      state.player
    ) {

      state.player
        .disconnect();

    }


    await api(
      "/api/spotify/disconnect",
      {
        method:
          "POST",
      }
    );


    state.player =
      null;

    state.deviceId =
      null;

    state.playback =
      null;

    state.connected =
      false;


    renderConnection();

    resetTrack();


    document.body.classList.remove(
      "global-player-open"
    );

    showPlayerBubble();
  }


  window.CortexSpotifyShell = {

    playUri,

    playUris,

    togglePlay,

    previous,

    next,

    setVolume,

    seek,

    disconnect,

    isReady:
      function () {

        return Boolean(
          state.deviceId
        );
      },

  };


  async function loadSpotify() {

    try {

      const data =
        await api(
          "/api/spotify/status"
        );


      state.connected =
        Boolean(
          data.conectado
        );


      renderConnection();


      if (
        state.connected
      ) {

        loadSdk();

      }

    }
    catch (error) {

      console.error(
        error
      );

    }
  }


  /* =======================================================
     CORTEX PAGE CINEMATIC INTROS - DESKTOP
  ======================================================= */

  const pageIntros = {

    "/simulado": {
      title: "Simulado",
      kicker: "Modo de prova",
      subtitle: "Concentre. Responda. Evolua.",
      variant: "focus",
      icon:
        '<rect x="5" y="3.5" width="14" height="17" rx="2.5"/>' +
        '<path d="M9 8h6"/>' +
        '<path d="m9 12 1.7 1.7L15 9.5"/>' +
        '<path d="M9 17h6"/>'
    },

    "/questoes": {
      title: "Questões",
      kicker: "Banco de questões",
      subtitle: "Prática que transforma conteúdo em domínio.",
      variant: "sweep",
      icon:
        '<rect x="5" y="4" width="14" height="16" rx="3"/>' +
        '<path d="M9 9h6"/>' +
        '<path d="M9 13h6"/>' +
        '<path d="M9 17h3"/>'
    },

    "/flashcards": {
      title: "Flashcards",
      kicker: "Revisão ativa",
      subtitle: "Memória em movimento.",
      variant: "stack",
      icon:
        '<rect x="4" y="6" width="14" height="12" rx="2"/>' +
        '<path d="m8 6 2-2h10v12l-2 2"/>'
    },

    "/lousa": {
      title: "Lousa",
      kicker: "Espaço de raciocínio",
      subtitle: "Pense visualmente. Conecte as ideias.",
      variant: "draw",
      icon:
        '<rect x="4" y="4" width="16" height="13" rx="2"/>' +
        '<path d="M8 21h8"/>' +
        '<path d="M12 17v4"/>' +
        '<path d="m7 13 3-3 2 2 5-5"/>'
    },

    "/farmacos": {
      title: "Farmacologia",
      kicker: "Precisão clínica",
      subtitle: "Conhecimento seguro, decisão consciente.",
      variant: "capsule",
      icon:
        '<path d="M8.1 4.6a5 5 0 0 1 7.1 0l4.2 4.2a5 5 0 0 1-7.1 7.1l-4.2-4.2a5 5 0 0 1 0-7.1Z"/>' +
        '<path d="m9.2 12.8 6.4-6.4"/>'
    },

    "/sigaa": {
      title: "Acadêmico",
      kicker: "Sua rotina",
      subtitle: "Organização para avançar com clareza.",
      variant: "calendar",
      icon:
        '<rect x="4" y="5" width="16" height="15" rx="2"/>' +
        '<path d="M8 3v4"/>' +
        '<path d="M16 3v4"/>' +
        '<path d="M4 9h16"/>' +
        '<path d="M8 13h3"/>' +
        '<path d="M8 16h6"/>'
    },

    "/casos": {
      title: "Casos Clínicos",
      kicker: "Raciocínio clínico",
      subtitle: "Observe. Relacione. Decida.",
      variant: "clinical",
      icon:
        '<path d="M8 5h8"/>' +
        '<path d="M10 3h4v4h-4z"/>' +
        '<rect x="5" y="6" width="14" height="15" rx="3"/>' +
        '<path d="M12 10v7"/>' +
        '<path d="M8.5 13.5h7"/>'
    },

    "/laboratorio": {
      title: "Laboratório",
      kicker: "Experimentação",
      subtitle: "Teste hipóteses. Entenda o processo.",
      variant: "lab",
      icon:
        '<path d="M9 3h6"/>' +
        '<path d="M10 3v6l-5 8a2.5 2.5 0 0 0 2.2 4h9.6A2.5 2.5 0 0 0 19 17l-5-8V3"/>' +
        '<path d="M7.5 15h9"/>'
    },

    "/evolucao": {
      title: "Evolução",
      kicker: "Seu progresso",
      subtitle: "Cada sessão deixa um registro.",
      variant: "rise",
      icon:
        '<path d="M5 19h14"/>' +
        '<path d="m7 15 3-4 3 2 4-6"/>' +
        '<path d="M15 7h2v2"/>'
    },

    "/desempenho": {
      title: "Desempenho",
      kicker: "Análise",
      subtitle: "Transforme dados em direção.",
      variant: "bars",
      icon:
        '<path d="M5 19V10"/>' +
        '<path d="M10 19V5"/>' +
        '<path d="M15 19v-7"/>' +
        '<path d="M20 19V8"/>'
    },

    "/ranking": {
      title: "Ranking",
      kicker: "Conquista",
      subtitle: "Consistência também merece destaque.",
      variant: "trophy",
      icon:
        '<path d="M8 21h8"/>' +
        '<path d="M12 17v4"/>' +
        '<path d="M7 4h10v4a5 5 0 0 1-10 0z"/>' +
        '<path d="M7 6H4v1a4 4 0 0 0 4 4"/>' +
        '<path d="M17 6h3v1a4 4 0 0 1-4 4"/>'
    },

    "/financas": {
      title: "Finanças",
      kicker: "Controle pessoal",
      subtitle: "Clareza hoje. Liberdade amanhã.",
      variant: "coin",
      icon:
        '<circle cx="12" cy="12" r="8"/>' +
        '<path d="M15 8.5h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9"/>' +
        '<path d="M12 6.5v11"/>'
    },

    "/musica": {
      title: "Música",
      kicker: "Focus mode",
      subtitle: "Seu ritmo também faz parte da sessão.",
      variant: "wave",
      icon:
        '<path d="M9 18V6l10-2v12"/>' +
        '<circle cx="6.5" cy="18" r="2.5"/>' +
        '<circle cx="16.5" cy="16" r="2.5"/>'
    },

    "/configuracoes": {
      title: "Configurações",
      kicker: "Seu Cortex",
      subtitle: "A experiência do seu jeito.",
      variant: "gear",
      icon:
        '<circle cx="12" cy="12" r="3"/>' +
        '<path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>'
    }

  };


  function normalizeIntroRoute(
    path
  ) {

    let route =
      String(
        path ||
        ""
      )
        .split("?")[0]
        .replace(
          /\.html$/,
          ""
        )
        .replace(
          /\/+$/,
          ""
        );


    if (
      !route ||
      route ===
        "/index"
    ) {

      return "/";
    }


    if (
      route ===
        "/caso"
    ) {

      return "/casos";
    }


    return route;

  }


  function maybeShowPageIntro(
    path
  ) {

    if (
      !window.matchMedia(
        "(min-width: 901px)"
      ).matches ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {

      return;
    }


    const route =
      normalizeIntroRoute(
        path
      );


    /*
     * O Dashboard possui uma abertura própria
     * dentro de index.html.
     */
    if (
      route ===
        "/"
    ) {

      return;
    }


    const config =
      pageIntros[
        route
      ];


    if (!config) {
      return;
    }


    const storageKey =
      "cortexPageIntroSeen:" +
      route;


    try {

      if (
        sessionStorage.getItem(
          storageKey
        ) ===
          "1"
      ) {

        return;
      }


      sessionStorage.setItem(
        storageKey,
        "1"
      );

    }
    catch {}


    const previous =
      document.getElementById(
        "cortexRouteIntro"
      );


    if (previous) {
      previous.remove();
    }


    const intro =
      document.createElement(
        "div"
      );


    intro.id =
      "cortexRouteIntro";


    intro.className =
      "cortex-route-intro " +
      "cortex-route-intro--" +
      config.variant;


    intro.setAttribute(
      "aria-hidden",
      "true"
    );


    intro.innerHTML =
      '<div class="cortex-route-intro-vignette"></div>' +
      '<div class="cortex-route-intro-beam"></div>' +
      '<div class="cortex-route-intro-orbit orbit-one"></div>' +
      '<div class="cortex-route-intro-orbit orbit-two"></div>' +
      '<div class="cortex-route-intro-particle particle-one"></div>' +
      '<div class="cortex-route-intro-particle particle-two"></div>' +
      '<div class="cortex-route-intro-particle particle-three"></div>' +

      '<div class="cortex-route-intro-stage">' +

        '<div class="cortex-route-intro-kicker">' +
          config.kicker +
        '</div>' +

        '<div class="cortex-route-intro-symbol">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            config.icon +
          '</svg>' +
        '</div>' +

        '<div class="cortex-route-intro-title">' +
          config.title +
        '</div>' +

        '<div class="cortex-route-intro-subtitle">' +
          config.subtitle +
        '</div>' +

        '<div class="cortex-route-intro-progress">' +
          '<span></span>' +
        '</div>' +

      '</div>';


    document.body.appendChild(
      intro
    );


    requestAnimationFrame(
      function () {

        intro.classList.add(
          "is-active"
        );

      }
    );


    window.setTimeout(
      function () {

        intro.classList.add(
          "is-exiting"
        );

      },
      1800
    );


    window.setTimeout(
      function () {

        intro.remove();

      },
      2500
    );

  }


  function validView(
    value
  ) {

    const text =
      String(
        value ||
        ""
      );


    if (
      !text.startsWith("/") ||
      text.startsWith("//") ||
      text.startsWith(
        "/api/"
      )
    ) {

      return null;

    }


    /*
     * Nunca permitir carregar o proprio shell
     * dentro do iframe.
     */
    const pathOnly =
      text
        .split("?")[0]
        .replace(
          /\/+$/,
          ""
        );


    if (
      pathOnly === "/app" ||
      pathOnly === "/app.html"
    ) {

      return null;

    }


    return text;
  }

  function navigateFrameFast(
    href
  ) {

    const view =
      validView(
        href
      );


    if (!view) {
      return;
    }


    let normalized =
      view;


    if (
      normalized === "/"
    ) {
      normalized =
        "/index.html";
    }


    try {

      const currentPath =
        frame.contentWindow
          ?.location
          ?.pathname;


      const currentSearch =
        frame.contentWindow
          ?.location
          ?.search ||
        "";


      if (
        currentPath &&
        (
          currentPath +
          currentSearch
        ) ===
          normalized
      ) {
        return;
      }

    }
    catch {}


    frame.classList.add(
      "shell-frame-navigating"
    );


    localStorage.setItem(
      "cortex_shell_last_view",
      normalized
    );


    frame.src =
      normalized;

  }


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
          "cortex:navigate"
      ) {
        return;
      }


      navigateFrameFast(
        data.href
      );

    }
  );


  function configureFrame() {

    const params =
      new URLSearchParams(
        location.search
      );


    let view =
      validView(
        params.get(
          "view"
        )
      );


    /*
     * Se a URL nao informou uma pagina,
     * tenta recuperar a ultima pagina valida.
     */
    if (!view) {

      try {

        const saved =
          localStorage.getItem(
            "cortex_shell_last_view"
          );


        view =
          validView(
            saved
          );


        /*
         * Remove estado antigo quebrado,
         * especialmente /app dentro de /app.
         */
        if (
          saved &&
          !view
        ) {

          localStorage.removeItem(
            "cortex_shell_last_view"
          );

        }

      }
      catch {}

    }


    if (
      !view ||
      view === "/"
    ) {

      view =
        "/index.html";

    }


    const spotify =
      params.get(
        "spotify"
      );


    if (
      spotify &&
      (
        view.includes(
          "/musica"
        )
      )
    ) {

      const separator =
        view.includes("?")
          ? "&"
          : "?";


      view +=
        separator +
        "spotify=" +
        encodeURIComponent(
          spotify
        );

    }


    /*
     * Segunda barreira contra shell recursivo.
     */
    if (
      view === "/app" ||
      view === "/app.html"
    ) {

      view =
        "/index.html";

    }


    frame.src =
      view;


    history.replaceState(
      {},
      "",
      "/app"
    );

  }

  frame.addEventListener(
    "load",
    function () {

      frame.classList.remove(
        "shell-frame-navigating"
      );


      try {

        const frameDocument =
          frame.contentDocument;

        if (frameDocument) {

          let typographyStyle =
            frameDocument.getElementById(
              "cortexTypographyStandard"
            );

          if (!typographyStyle) {

            typographyStyle =
              frameDocument.createElement(
                "style"
              );

            typographyStyle.id =
              "cortexTypographyStandard";

            typographyStyle.textContent =
              "html{font-size:16px!important;-webkit-text-size-adjust:100%!important;text-size-adjust:100%!important}" +
              "body{font-size:16px}" +
              "button,input,select,textarea{font-family:inherit;-webkit-text-size-adjust:100%!important;text-size-adjust:100%!important}" +
              "#mobileOverlay,.mobile-overlay,.mobile-menu-button,.analysis-mobile-button,.analysis-mobile-overlay,.clinical-mobile-menu,.clinical-mobile-overlay,.settings-mobile-button,.settings-mobile-overlay,.finance-mobile-button,.finance-mobile-overlay,.flashcards-mobile-button,.flashcards-mobile-overlay,.questions-mobile-menu,.questions-mobile-overlay{display:none!important}";

            frameDocument.head.appendChild(
              typographyStyle
            );

          }


          frameDocument
            .querySelectorAll(
              "#mobileOverlay,.mobile-overlay,.mobile-menu-button,.analysis-mobile-button,.analysis-mobile-overlay,.clinical-mobile-menu,.clinical-mobile-overlay,.settings-mobile-button,.settings-mobile-overlay,.finance-mobile-button,.finance-mobile-overlay,.flashcards-mobile-button,.flashcards-mobile-overlay,.questions-mobile-menu,.questions-mobile-overlay"
            )
            .forEach(
              function (element) {
                element.remove();
              }
            );

        }


        const path =
          frame.contentWindow
            .location
            .pathname;


        const search =
          frame.contentWindow
            .location
            .search;


        /*
         * Se por qualquer motivo /app entrar no iframe,
         * recupera imediatamente o Dashboard.
         */
        if (
          path === "/app" ||
          path === "/app.html"
        ) {

          localStorage.removeItem(
            "cortex_shell_last_view"
          );


          frame.src =
            "/index.html";


          return;

        }


        if (
          path &&
          !path.includes(
            "login"
          ) &&
          !path.includes(
            "cadastro"
          )
        ) {

          localStorage.setItem(
            "cortex_shell_last_view",
            path +
            search
          );


          maybeShowPageIntro(
            path
          );

        }

      }
      catch (
        error
      ) {

        console.error(
          "Cortex frame:",
          error
        );

      }

    }
  );

  $("globalSpotifyConnect")
    .addEventListener(
      "click",
      function () {

        if (
          state.connected
        ) {
          return;
        }


        location.href =
          "/api/spotify/login";

      }
    );


  $("openMusicPage")
    .addEventListener(
      "click",
      function () {

        frame.src =
          "/musica.html";

      }
    );


  $("globalPlay")
    .addEventListener(
      "click",
      function () {

        togglePlay()
          .catch(
            console.error
          );

      }
    );


  $("globalPrevious")
    .addEventListener(
      "click",
      function () {

        previous()
          .catch(
            console.error
          );

      }
    );


  $("globalNext")
    .addEventListener(
      "click",
      function () {

        next()
          .catch(
            console.error
          );

      }
    );


  $("globalProgress")
    .addEventListener(
      "input",
      function () {

        state.dragging =
          true;


        if (
          !state.playback
        ) {
          return;
        }


        const position =
          Number(
            $("globalProgress").value
          ) /
          1000 *
          state.playback.duration;


        $("globalCurrentTime")
          .textContent =
          formatTime(
            position
          );

      }
    );


  $("globalProgress")
    .addEventListener(
      "change",
      async function () {

        if (
          !state.playback
        ) {

          state.dragging =
            false;

          return;
        }


        const position =
          Number(
            $("globalProgress").value
          ) /
          1000 *
          state.playback.duration;


        await seek(
          position
        ).catch(
          console.error
        );


        state.dragging =
          false;

      }
    );


  $("globalVolume")
    .addEventListener(
      "input",
      function () {

        const value =
          Number(
            $("globalVolume").value
          );


        $("globalVolumeValue")
          .textContent =
          value +
          "%";


        setVolume(
          value /
          100
        ).catch(
          console.error
        );

      }
    );




  /* =======================================================
     CORTEX FLOATING PLAYER
  ======================================================= */

  const playerBubble =
    $("globalPlayerBubble");


  const playerClose =
    $("globalPlayerClose");


  function hasActiveTrack() {

    return Boolean(
      state.playback &&
      state.playback.track
    );

  }


  function showPlayerBubble() {

    if (
      !playerBubble
    ) {

      return;

    }


    playerBubble.classList.remove(
      "hidden"
    );


    playerBubble.classList.toggle(
      "paused",
      !hasActiveTrack() ||
      Boolean(
        state.playback &&
        state.playback.paused
      )
    );

  }

  function hidePlayerBubble() {

    if (!playerBubble) {
      return;
    }


    playerBubble.classList.add(
      "hidden"
    );

  }


  function openFloatingPlayer() {

    document.body.classList.add(
      "global-player-open"
    );


    hidePlayerBubble();

  }

  function closeFloatingPlayer() {

    document.body.classList.remove(
      "global-player-open"
    );


    showPlayerBubble();

  }


  if (playerBubble) {

    playerBubble.addEventListener(
      "click",
      openFloatingPlayer
    );

  }


  if (playerClose) {

    playerClose.addEventListener(
      "click",
      closeFloatingPlayer
    );

  }


  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key ===
        "Escape" &&
        document.body.classList.contains(
          "global-player-open"
        )
      ) {

        closeFloatingPlayer();

      }

    }
  );

  window.setInterval(
    updateProgress,
    500
  );


  /* CORTEX PLAYER ALWAYS VISIBLE */
  showPlayerBubble();

  /*
   * Inicializa primeiro o shell.
   */
  configureFrame();


  /*
   * O botao de musica sempre fica disponivel.
   */
  showPlayerBubble();


  /*
   * Depois inicia a conexao Spotify.
   */
  loadSpotify();

})();