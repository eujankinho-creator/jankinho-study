(function () {

  "use strict";


  const $ = function (id) {
    return document.getElementById(id);
  };


  let frame =
    $("cortexAppFrame");


  let standbyFrame =
    $("cortexAppFrameNext");


  /* =======================================================
     CORTEX GLOBAL PROFILE PHOTO
  ======================================================= */

  let cortexProfilePhoto =
    null;


  const profilePhotoObservers =
    new WeakMap();


  function applyProfilePhotoToDocument(
    targetDocument
  ) {

    if (!targetDocument) {
      return;
    }


    targetDocument
      .querySelectorAll(
        ".avatar, #avatarSidebar, #avatarHeader, #settingsHeroAvatar, .settings-account-avatar, [data-profile-avatar=\"current\"]"
      )
      .forEach(
        function (
          avatar
        ) {

          if (
            cortexProfilePhoto
          ) {

            avatar.style.backgroundImage =
              'url("' +
              cortexProfilePhoto +
              '")';

            avatar.style.backgroundSize =
              "cover";

            avatar.style.backgroundPosition =
              "center";

            avatar.style.backgroundRepeat =
              "no-repeat";

            avatar.style.color =
              "transparent";

            avatar.style.overflow =
              "hidden";

            avatar.style.borderRadius =
              "50%";

            avatar.classList.add(
              "has-profile-photo"
            );

          }
          else {

            avatar.style.backgroundImage =
              "";

            avatar.style.backgroundSize =
              "";

            avatar.style.backgroundPosition =
              "";

            avatar.style.backgroundRepeat =
              "";

            avatar.style.color =
              "";

            avatar.classList.remove(
              "has-profile-photo"
            );

          }

        }
      );

  }


  function ensureProfilePhotoObserver(
    targetFrame
  ) {

    if (!targetFrame) {
      return;
    }


    try {

      const targetDocument =
        targetFrame.contentDocument;


      if (
        !targetDocument ||
        !targetDocument.body ||
        profilePhotoObservers.has(
          targetDocument
        )
      ) {

        return;
      }


      let queued =
        false;


      const observer =
        new MutationObserver(
          function () {

            if (queued) {
              return;
            }


            queued =
              true;


            queueMicrotask(
              function () {

                queued =
                  false;


                applyProfilePhotoToDocument(
                  targetDocument
                );

              }
            );

          }
        );


      observer.observe(
        targetDocument.body,
        {
          childList:
            true,

          subtree:
            true,
        }
      );


      profilePhotoObservers.set(
        targetDocument,
        observer
      );


      applyProfilePhotoToDocument(
        targetDocument
      );

    }
    catch {}

  }


  function applyProfilePhotoToFrame(
    targetFrame
  ) {

    if (!targetFrame) {
      return;
    }


    try {

      applyProfilePhotoToDocument(
        targetFrame.contentDocument
      );


      ensureProfilePhotoObserver(
        targetFrame
      );

    }
    catch {}

  }


  function refreshProfilePhotoFrames() {

    applyProfilePhotoToFrame(
      frame
    );


    applyProfilePhotoToFrame(
      standbyFrame
    );

  }


  function scheduleProfilePhotoApply(
    targetFrame
  ) {

    applyProfilePhotoToFrame(
      targetFrame
    );


    window.setTimeout(
      function () {

        applyProfilePhotoToFrame(
          targetFrame
        );

      },
      160
    );


    window.setTimeout(
      function () {

        applyProfilePhotoToFrame(
          targetFrame
        );

      },
      650
    );

  }


  async function loadGlobalProfilePhoto() {

    try {

      const response =
        await fetch(
          "/api/auth/me",
          {
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


      cortexProfilePhoto =
        data &&
        data.usuario &&
        data.usuario.fotoPerfil
          ? data.usuario.fotoPerfil
          : null;


      refreshProfilePhotoFrames();

    }
    catch {}

  }


  let pendingTarget =
    null;


  let pendingFallbackTimer =
    0;


  let navigationRevision =
    0;


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

  const directHtmlRoutes =
    new Set([
      "/simulado",
      "/questoes",
      "/aulas",
      "/cronograma",
      "/curso-pmpe",
      "/flashcards",
      "/lousa",
      "/farmacos",
      "/sigaa",
      "/casos",
      "/laboratorio",
      "/evolucao",
      "/desempenho",
      "/ranking",
      "/financas",
      "/musica",
      "/configuracoes",
    ]);


  function directFramePath(
    value
  ) {

    const text =
      String(
        value ||
        ""
      );


    if (
      text === "/"
    ) {

      return "/index.html";
    }


    const hashIndex =
      text.indexOf("#");


    const withoutHash =
      hashIndex >= 0
        ? text.slice(
            0,
            hashIndex
          )
        : text;


    const hash =
      hashIndex >= 0
        ? text.slice(
            hashIndex
          )
        : "";


    const queryIndex =
      withoutHash.indexOf("?");


    const pathname =
      queryIndex >= 0
        ? withoutHash.slice(
            0,
            queryIndex
          )
        : withoutHash;


    const search =
      queryIndex >= 0
        ? withoutHash.slice(
            queryIndex
          )
        : "";


    if (
      directHtmlRoutes.has(
        pathname
      )
    ) {

      return (
        pathname +
        ".html" +
        search +
        hash
      );
    }


    return text;
  }


  function frameLocation(
    targetFrame
  ) {

    try {

      const location =
        targetFrame
          .contentWindow
          ?.location;


      if (!location) {
        return "";
      }


      return (
        location.pathname +
        location.search +
        location.hash
      );

    }
    catch {

      return "";

    }

  }


  function normalizedTarget(
    value
  ) {

    try {

      const url =
        new URL(
          value,
          window.location.origin
        );


      return (
        url.pathname +
        url.search +
        url.hash
      );

    }
    catch {

      return String(
        value ||
        ""
      );

    }

  }


  function sameFrameTarget(
    targetFrame,
    value
  ) {

    return (
      frameLocation(
        targetFrame
      ) ===
      normalizedTarget(
        value
      )
    );

  }


  function enhanceLoadedFrame(
    loadedFrame
  ) {

    try {

      const frameDocument =
        loadedFrame.contentDocument;


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

      }

    }
    catch (
      error
    ) {

      console.error(
        "Cortex frame enhancement:",
        error
      );

    }

  }


  function saveLoadedFrameLocation(
    loadedFrame
  ) {

    try {

      const path =
        loadedFrame
          .contentWindow
          .location
          .pathname;


      const search =
        loadedFrame
          .contentWindow
          .location
          .search;


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

      }

    }
    catch {}

  }


  function swapFrames(
    loadedFrame
  ) {

    const previousFrame =
      frame;


    loadedFrame.classList.remove(
      "shell-frame-standby"
    );


    loadedFrame.classList.add(
      "shell-frame-active"
    );


    loadedFrame.removeAttribute(
      "aria-hidden"
    );


    loadedFrame.removeAttribute(
      "tabindex"
    );


    previousFrame.classList.remove(
      "shell-frame-active"
    );


    previousFrame.classList.add(
      "shell-frame-standby"
    );


    previousFrame.setAttribute(
      "aria-hidden",
      "true"
    );


    previousFrame.setAttribute(
      "tabindex",
      "-1"
    );


    frame =
      loadedFrame;


    standbyFrame =
      previousFrame;


    pendingTarget =
      null;


    navigationRevision +=
      1;


    window.clearTimeout(
      pendingFallbackTimer
    );


    pendingFallbackTimer =
      0;


    saveLoadedFrameLocation(
      frame
    );

  }


  window.CortexShellNavigationReady =
    function (
      sourceWindow,
      href
    ) {

      if (
        !pendingTarget ||
        sourceWindow !==
          standbyFrame.contentWindow
      ) {
        return false;
      }


      const ready =
        normalizedTarget(
          href ||
          ""
        );


      const expected =
        normalizedTarget(
          pendingTarget
        );


      if (
        ready !==
          expected &&
        !sameFrameTarget(
          standbyFrame,
          pendingTarget
        )
      ) {
        return false;
      }


      enhanceLoadedFrame(
        standbyFrame
      );


      swapFrames(
        standbyFrame
      );


      return true;

    };


  function waitForStandbyFirstPaint(
    target,
    revision
  ) {

    const startedAt =
      performance.now();


    function inspect() {

      if (
        revision !==
          navigationRevision ||
        !pendingTarget ||
        standbyFrame.dataset
          .cortexTarget !==
          target
      ) {

        return;
      }


      try {

        const documentReady =
          standbyFrame
            .contentDocument;


        const hasVisualLayout =
          Boolean(
            documentReady &&
            documentReady.body &&
            (
              documentReady.querySelector(
                ".main-area"
              ) ||
              documentReady.querySelector(
                ".academic-main"
              ) ||
              documentReady.querySelector(
                ".finance-main"
              ) ||
              documentReady.querySelector(
                ".content"
              ) ||
              documentReady.querySelector(
                "main"
              )
            )
          );


        const stylesheetLinks =
          documentReady
            ? documentReady.querySelectorAll(
                'link[rel="stylesheet"]'
              ).length
            : 0;


        const stylesReady =
          Boolean(
            documentReady &&
            (
              stylesheetLinks === 0 ||
              documentReady.styleSheets
                .length >=
                Math.min(
                  stylesheetLinks,
                  2
                )
            )
          );


        if (
          sameFrameTarget(
            standbyFrame,
            target
          ) &&
          hasVisualLayout &&
          stylesReady
        ) {

          /*
           * Dois frames de pintura garantem que o navegador
           * tenha montado o layout antes da troca. Nao esperamos
           * APIs, imagens ou dados secundarios terminarem.
           */
          window.requestAnimationFrame(
            function () {

              if (
                revision !==
                  navigationRevision ||
                !pendingTarget ||
                standbyFrame.dataset
                  .cortexTarget !==
                  target ||
                !sameFrameTarget(
                  standbyFrame,
                  target
                )
              ) {

                return;
              }


              enhanceLoadedFrame(
                standbyFrame
              );


              swapFrames(
                standbyFrame
              );

            }
          );


          return;
        }

      }
      catch {}


      if (
        performance.now() -
          startedAt <
        1800
      ) {

        window.requestAnimationFrame(
          inspect
        );

      }

    }


    window.requestAnimationFrame(
      inspect
    );

  }


  function handleFrameLoad(
    loadedFrame
  ) {

    enhanceLoadedFrame(
      loadedFrame
    );


    let path =
      "";


    try {

      path =
        loadedFrame
          .contentWindow
          .location
          .pathname;

    }
    catch {}


    if (
      path === "/app" ||
      path === "/app.html"
    ) {

      localStorage.removeItem(
        "cortex_shell_last_view"
      );


      if (
        loadedFrame ===
          standbyFrame
      ) {

        pendingTarget =
          "/index.html";


        loadedFrame.dataset
          .cortexTarget =
          "/index.html";

      }


      loadedFrame.src =
        "/index.html";


      return;

    }


    if (
      loadedFrame ===
        standbyFrame &&
      pendingTarget
    ) {

      if (
        !sameFrameTarget(
          loadedFrame,
          pendingTarget
        )
      ) {

        return;

      }


      /*
       * Fallback do primeiro-paint: se por algum motivo o watcher
       * nao conseguir detectar o estado interactive, o evento load
       * faz a troca imediatamente. Nao esperamos mais as APIs.
       */
      window.clearTimeout(
        pendingFallbackTimer
      );


      pendingFallbackTimer =
        window.setTimeout(
          function () {

            if (
              loadedFrame ===
                standbyFrame &&
              pendingTarget &&
              sameFrameTarget(
                loadedFrame,
                pendingTarget
              )
            ) {

              swapFrames(
                loadedFrame
              );

            }

          },
          0
        );


      return;

    }


    if (
      loadedFrame ===
        frame
    ) {

      saveLoadedFrameLocation(
        loadedFrame
      );

    }

  }


  frame.addEventListener(
    "load",
    function (
      event
    ) {

      handleFrameLoad(
        event.currentTarget
      );

      scheduleProfilePhotoApply(
        event.currentTarget
      );

    }
  );


  standbyFrame.addEventListener(
    "load",
    function (
      event
    ) {

      handleFrameLoad(
        event.currentTarget
      );

      scheduleProfilePhotoApply(
        event.currentTarget
      );

    }
  );


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


    const normalized =
      directFramePath(
        view
      );


    if (
      sameFrameTarget(
        frame,
        normalized
      )
    ) {

      return;

    }


    if (
      pendingTarget &&
      normalizedTarget(
        pendingTarget
      ) ===
        normalizedTarget(
          normalized
        )
    ) {

      return;

    }


    if (
      sameFrameTarget(
        standbyFrame,
        normalized
      )
    ) {

      enhanceLoadedFrame(
        standbyFrame
      );


      swapFrames(
        standbyFrame
      );


      return;
    }


    window.clearTimeout(
      pendingFallbackTimer
    );


    pendingFallbackTimer =
      0;


    pendingTarget =
      normalized;


    navigationRevision +=
      1;


    const revision =
      navigationRevision;


    standbyFrame.dataset
      .cortexTarget =
      normalized;


    /*
     * Mantem a pagina atual apenas ate o DOM da nova secao
     * estar apto a ser pintado. Dados de API podem completar
     * depois, ja com a nova pagina visivel.
     */
    standbyFrame.src =
      normalized;


    waitForStandbyFirstPaint(
      normalized,
      revision
    );

  }


  window.CortexShellNavigate =
    navigateFrameFast;



  /* =======================================================
     CORTEX AULAS · PLAYER GLOBAL PERSISTENTE
  ======================================================= */

  const lessonState = {
    player: null,
    ready: false,
    pending: null,
    video: null,
    playing: false,
    dragging: false,
    lastPosition: 0,
    lastDuration: 0,
    lastWatchTick: 0,
    unsyncedWatched: 0,
    syncBusy: false,
    chromeTimer: 0,
    resizeActive: false,
    resizeStartX: 0,
    resizeStartY: 0,
    resizeStartWidth: 0,
    resizeStartHeight: 0,
    resizeEdge: "",
    resizeStartLeft: 0,
    resizeStartTop: 0,
    moveActive: false,
    moveStartX: 0,
    moveStartY: 0,
    moveStartLeft: 0,
    moveStartTop: 0,
    desiredQuality: "default",
    desiredRate: 1,
  };


  try {
    const prefs =
      JSON.parse(
        localStorage.getItem(
          "cortex_lesson_playback_prefs_v1"
        ) ||
        "null"
      );

    if (
      prefs &&
      typeof prefs ===
        "object"
    ) {
      const quality =
        String(
          prefs.quality ||
          "default"
        );

      const rate =
        Number(
          prefs.rate ||
          1
        );

      lessonState.desiredQuality =
        quality ||
        "default";

      lessonState.desiredRate =
        Number.isFinite(
          rate
        )
          ? rate
          : 1;
    }
  }
  catch {}


  function lessonSavePlaybackPrefs() {
    try {
      localStorage.setItem(
        "cortex_lesson_playback_prefs_v1",
        JSON.stringify({
          quality:
            lessonState.desiredQuality,
          rate:
            lessonState.desiredRate,
        })
      );
    }
    catch {}
  }


  function lessonApplyPlaybackPreferences(
    player =
      lessonState.player
  ) {
    if (!player) {
      return;
    }

    try {
      const rates =
        player.getAvailablePlaybackRates?.() ||
        [];

      if (
        !rates.length ||
        rates.includes(
          Number(
            lessonState.desiredRate
          )
        )
      ) {
        player.setPlaybackRate?.(
          Number(
            lessonState.desiredRate
          )
        );
      }
    }
    catch {}

    try {
      const quality =
        lessonState.desiredQuality ||
        "default";

      player.setPlaybackQualityRange?.(
        quality
      );

      player.setPlaybackQuality?.(
        quality
      );
    }
    catch {}

    const qualitySelect =
      $("globalLessonQuality");

    const rateSelect =
      $("globalLessonRate");

    if (qualitySelect) {
      qualitySelect.value =
        lessonState.desiredQuality ||
        "default";
    }

    if (rateSelect) {
      rateSelect.value =
        String(
          lessonState.desiredRate ||
          1
        );
    }
  }

  function lessonFormatTime(seconds) {
    const total = Math.max(0,Math.floor(Number(seconds || 0)));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = String(total % 60).padStart(2,"0");
    return hours > 0
      ? hours + ":" + String(minutes).padStart(2,"0") + ":" + secs
      : minutes + ":" + secs;
  }

  function lessonSafeMeta(video) {
    return {
      youtubeVideoId:String(video?.youtubeVideoId || "").trim(),
      title:String(video?.title || "Videoaula").slice(0,300),
      channel:String(video?.channel || "").slice(0,200),
      thumbnail:String(video?.thumbnail || "").slice(0,1000),
      description:String(video?.description || "").slice(0,5000),
      durationSeconds:Number(video?.durationSeconds || 0),
      category:String(video?.category || "").slice(0,120),
      subjects:Array.isArray(video?.subjects)?video.subjects.slice(0,12):[],
      startAt:Number(video?.startAt || 0),
    };
  }

  function saveLessonLocal() {
    if (!lessonState.video) return;
    try {
      const position = lessonState.ready && lessonState.player
        ? Number(lessonState.player.getCurrentTime?.() || lessonState.lastPosition || 0)
        : lessonState.lastPosition;
      const duration = lessonState.ready && lessonState.player
        ? Number(lessonState.player.getDuration?.() || lessonState.lastDuration || lessonState.video.durationSeconds || 0)
        : lessonState.lastDuration;
      localStorage.setItem("cortex_lesson_player_v1",JSON.stringify({
        video:lessonState.video,
        position,
        duration,
        mini:!$("globalLessonPlayer")?.classList.contains("expanded"),
        savedAt:Date.now(),
      }));
    } catch {}
  }

  async function syncLessonProgress(forceCompleted) {
    if (!lessonState.video || lessonState.syncBusy) return;
    const player=lessonState.player;
    const position=Number(player?.getCurrentTime?.() || lessonState.lastPosition || 0);
    const duration=Number(player?.getDuration?.() || lessonState.lastDuration || lessonState.video.durationSeconds || 0);
    const delta=Math.max(0,Math.min(60,Math.round(lessonState.unsyncedWatched)));
    if (!delta && !forceCompleted && Math.abs(position-lessonState.lastPosition)<2) return;

    lessonState.syncBusy=true;
    lessonState.unsyncedWatched=0;
    lessonState.lastPosition=position;
    lessonState.lastDuration=duration;
    try {
      await fetch("/api/aulas/state",{
        method:"POST",
        credentials:"same-origin",
        headers:{"Content-Type":"application/json"},
        keepalive:true,
        body:JSON.stringify({
          ...lessonState.video,
          durationSeconds:duration || lessonState.video.durationSeconds || 0,
          progressSeconds:position,
          watchedDeltaSeconds:delta,
          completed:Boolean(forceCompleted || (duration>0 && position/duration>=.92)),
        }),
      });
      try {
        frame?.contentWindow?.postMessage({type:"cortex:lesson-progress-updated"},location.origin);
      } catch {}
    } catch {
      lessonState.unsyncedWatched += delta;
    } finally {
      lessonState.syncBusy=false;
      saveLessonLocal();
    }
  }

  function lessonRenderMeta() {
    const video=lessonState.video;
    if (!video) return;
    $("globalLessonTitle").textContent=video.title || "Videoaula";
    $("globalLessonChannel").textContent=video.channel || "YouTube";
  }

  function lessonShowChrome() {
    const host=$("globalLessonPlayer");
    if(!host) return;
    host.classList.remove("lesson-clean");
    window.clearTimeout(lessonState.chromeTimer);
    if(lessonState.playing){
      lessonState.chromeTimer=window.setTimeout(()=>{
        if(
          !lessonState.resizeActive &&
          !$("globalLessonPlayer")?.classList.contains("expanded") &&
          !host.classList.contains("lesson-settings-open")
        ){
          host.classList.add("lesson-clean");
        }
      },1800);
    }
  }

  function lessonPersistMiniSize() {
    const host=$("globalLessonPlayer");
    if(!host || host.classList.contains("expanded")) return;
    try{
      localStorage.setItem("cortex_lesson_player_size_v1",JSON.stringify({
        width:Math.round(host.getBoundingClientRect().width)
      }));
    }catch{}
  }

  function lessonPersistMiniPosition() {
    const host=$("globalLessonPlayer");
    if(!host || host.classList.contains("expanded") || matchMedia("(max-width: 760px)").matches) return;
    const rect=host.getBoundingClientRect();
    try{
      localStorage.setItem("cortex_lesson_player_position_v1",JSON.stringify({
        left:Math.round(rect.left),
        top:Math.round(rect.top)
      }));
    }catch{}
  }

  function lessonClampMiniPosition(left,top,width,height) {
    const margin=8;
    return {
      left:Math.max(margin,Math.min(window.innerWidth-width-margin,left)),
      top:Math.max(margin,Math.min(window.innerHeight-height-margin,top))
    };
  }

  function lessonRestoreMiniSize() {
    const host=$("globalLessonPlayer");
    if(!host || matchMedia("(max-width: 760px)").matches) return;
    try{
      const saved=JSON.parse(localStorage.getItem("cortex_lesson_player_size_v1")||"null");
      if(!saved) return;
      const width=Math.max(320,Math.min(window.innerWidth-24,Number(saved.width)||0));
      if(width) host.style.width=width+"px";
      host.style.height="";
    }catch{}
  }

  function lessonRestoreMiniPosition() {
    const host=$("globalLessonPlayer");
    if(!host || matchMedia("(max-width: 760px)").matches) return;
    try{
      const saved=JSON.parse(localStorage.getItem("cortex_lesson_player_position_v1")||"null");
      if(!saved) return;
      const rect=host.getBoundingClientRect();
      const pos=lessonClampMiniPosition(
        Number(saved.left)||rect.left,
        Number(saved.top)||rect.top,
        rect.width,
        rect.height
      );
      host.style.left=pos.left+"px";
      host.style.top=pos.top+"px";
      host.style.right="auto";
      host.style.bottom="auto";
      host.style.transform="none";
    }catch{}
  }

  function lessonRestoreMiniGeometry() {
    lessonRestoreMiniSize();
    requestAnimationFrame(()=>lessonRestoreMiniPosition());
  }

  function lessonSetExpanded(expanded) {
    const host=$("globalLessonPlayer");
    if(!host) return;
    host.classList.remove("hidden");
    host.classList.toggle("expanded",Boolean(expanded));
    host.classList.toggle("lesson-minimized",!expanded);
    document.body.classList.toggle("lesson-player-expanded",Boolean(expanded));
    if(expanded){
      host.style.width="";
      host.style.height="";
      host.style.left="";
      host.style.top="";
      host.style.right="";
      host.style.bottom="";
      host.style.transform="";
      host.classList.remove("lesson-clean");
    }else{
      lessonRestoreMiniGeometry();
      lessonShowChrome();
    }
    saveLessonLocal();
  }

  function lessonHide() {
    closeLessonSettings?.();
    $("globalLessonPlayer")?.classList.add("hidden");
    $("globalLessonPlayer")?.classList.remove("expanded","lesson-minimized");
    document.body.classList.remove("lesson-player-expanded");
  }

  function ensureYouTubeApi() {
    if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
    if (window.__cortexYoutubeApiPromise) return window.__cortexYoutubeApiPromise;

    window.__cortexYoutubeApiPromise=new Promise((resolve,reject)=>{
      const previous=window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady=function(){
        if(typeof previous==="function"){
          try{previous();}catch{}
        }
        resolve(window.YT);
      };
      const script=document.createElement("script");
      script.src="https://www.youtube.com/iframe_api";
      script.async=true;
      script.onerror=()=>reject(new Error("YouTube indisponível."));
      document.head.appendChild(script);
      window.setTimeout(()=>{
        if(window.YT?.Player) resolve(window.YT);
      },3500);
    });

    return window.__cortexYoutubeApiPromise;
  }

  function createLessonPlayer(startAt=0,autoplay=true) {
    if (!lessonState.video) return Promise.resolve();
    return ensureYouTubeApi().then(()=>new Promise((resolve)=>{
      if (lessonState.player && lessonState.ready) {
        lessonState.player.loadVideoById({
          videoId:lessonState.video.youtubeVideoId,
          startSeconds:Math.max(0,startAt),
        });
        if(!autoplay) lessonState.player.pauseVideo();

        window.setTimeout(
          function () {
            lessonApplyPlaybackPreferences(
              lessonState.player
            );
          },
          120
        );

        resolve();
        return;
      }

      lessonState.player=new window.YT.Player("globalLessonYoutube",{
        videoId:lessonState.video.youtubeVideoId,
        width:"100%",
        height:"100%",
        playerVars:{
          autoplay:autoplay?1:0,
          controls:0,
          rel:0,
          modestbranding:1,
          playsinline:1,
          iv_load_policy:3,
          cc_load_policy:0,
          fs:0,
          disablekb:1,
          start:Math.floor(Math.max(0,startAt)),
          origin:location.origin,
        },
        events:{
          onReady:function(event){
            lessonState.ready=true;
            event.target.setVolume(
              Number(
                $("globalLessonVolume")?.value ||
                70
              )
            );

            lessonApplyPlaybackPreferences(
              event.target
            );

            if(startAt>0) event.target.seekTo(startAt,true);
            if(autoplay) event.target.playVideo();
            lessonRenderMeta();
            resolve();
          },
          onStateChange:function(event){
            lessonState.playing=event.data===window.YT.PlayerState.PLAYING;
            $("globalLessonPlay").textContent=lessonState.playing?"❚❚":"▶";
            if(lessonState.playing){
              lessonState.lastWatchTick=performance.now();
              lessonShowChrome();
            }else{
              $("globalLessonPlayer")?.classList.remove("lesson-clean");
              lessonState.lastWatchTick=0;
              void syncLessonProgress(event.data===window.YT.PlayerState.ENDED);
            }
            if(event.data===window.YT.PlayerState.ENDED){
              void syncLessonProgress(true);
            }
            saveLessonLocal();
          },
          onPlaybackRateChange:function(event){
            const value=
              Number(
                event.data ||
                1
              );

            if(
              Number.isFinite(
                value
              )
            ){
              lessonState.desiredRate=
                value;

              const select=
                $("globalLessonRate");

              if(select){
                select.value=
                  String(
                    value
                  );
              }
            }
          },
          onPlaybackQualityChange:function(event){
            const quality=
              String(
                event.data ||
                ""
              );

            const host=
              $("globalLessonPlayer");

            if(host){
              host.dataset.quality=
                quality;
            }
          },
          onError:function(){
            $("globalLessonTitle").textContent="Esta aula não está mais disponível.";
          }
        }
      });
    }));
  }

  async function playLesson(video) {
    const meta=lessonSafeMeta(video);
    if(!/^[A-Za-z0-9_-]{11}$/.test(meta.youtubeVideoId)) return;

    const same=lessonState.video?.youtubeVideoId===meta.youtubeVideoId;
    lessonState.video=meta;
    lessonRenderMeta();
    $("globalLessonPlayer")?.classList.remove("hidden");

    const startAt=Number(video?.startAt || (same ? lessonState.player?.getCurrentTime?.() : 0) || 0);
    await createLessonPlayer(startAt,true).catch(console.error);
    lessonSetExpanded(video?.expanded !== false);
    saveLessonLocal();
  }

  function restoreLessonState() {
    let saved=null;
    try {
      saved=JSON.parse(localStorage.getItem("cortex_lesson_player_v1") || "null");
    } catch {}
    if(!saved?.video?.youtubeVideoId) return;
    lessonState.video=lessonSafeMeta(saved.video);
    lessonState.lastPosition=Number(saved.position || 0);
    lessonState.lastDuration=Number(saved.duration || lessonState.video.durationSeconds || 0);
    lessonRenderMeta();
    $("globalLessonPlayer")?.classList.remove("hidden");
    lessonSetExpanded(false);
    lessonRestoreMiniGeometry();
    createLessonPlayer(lessonState.lastPosition,false).catch(console.error);
  }

  $("globalLessonMinimize")?.addEventListener("click",()=>lessonSetExpanded(false));
  $("globalLessonExpand")?.addEventListener("click",()=>lessonSetExpanded(true));
  $("globalLessonClose")?.addEventListener("click",()=>{
    void syncLessonProgress(false);
    try{lessonState.player?.stopVideo?.();}catch{}
    lessonState.video=null;
    lessonState.playing=false;
    lessonHide();
    try{localStorage.removeItem("cortex_lesson_player_v1");}catch{}
  });
  $("globalLessonPlay")?.addEventListener("click",()=>{
    if(!lessonState.player) return;
    if(lessonState.playing) lessonState.player.pauseVideo();
    else lessonState.player.playVideo();
  });
  $("globalLessonBack")?.addEventListener("click",()=>{
    const p=Number(lessonState.player?.getCurrentTime?.() || 0);
    lessonState.player?.seekTo?.(Math.max(0,p-10),true);
  });
  $("globalLessonForward")?.addEventListener("click",()=>{
    const p=Number(lessonState.player?.getCurrentTime?.() || 0);
    const d=Number(lessonState.player?.getDuration?.() || 0);
    lessonState.player?.seekTo?.(d?Math.min(d,p+10):p+10,true);
  });
  $("globalLessonVolume")?.addEventListener("input",function(){
    lessonState.player?.setVolume?.(Number(this.value || 0));
  });


  const lessonSettingsButton=
    $("globalLessonSettingsButton");

  const lessonSettingsMenu=
    $("globalLessonSettingsMenu");


  function closeLessonSettings() {
    if(!lessonSettingsMenu) return;

    lessonSettingsMenu.hidden=
      true;

    lessonSettingsButton?.setAttribute(
      "aria-expanded",
      "false"
    );

    $("globalLessonPlayer")?.classList.remove(
      "lesson-settings-open"
    );
  }


  lessonSettingsButton?.addEventListener(
    "click",
    function(event){
      event.stopPropagation();

      const opening=
        Boolean(
          lessonSettingsMenu?.hidden
        );

      if(lessonSettingsMenu){
        lessonSettingsMenu.hidden=
          !opening;
      }

      this.setAttribute(
        "aria-expanded",
        opening
          ? "true"
          : "false"
      );

      $("globalLessonPlayer")?.classList.toggle(
        "lesson-settings-open",
        opening
      );

      lessonShowChrome();
    }
  );


  $("globalLessonQuality")?.addEventListener(
    "change",
    function(){
      lessonState.desiredQuality=
        String(
          this.value ||
          "default"
        );

      lessonSavePlaybackPrefs();
      lessonApplyPlaybackPreferences();
      lessonShowChrome();
    }
  );


  $("globalLessonRate")?.addEventListener(
    "change",
    function(){
      const value=
        Number(
          this.value ||
          1
        );

      lessonState.desiredRate=
        Number.isFinite(
          value
        )
          ? value
          : 1;

      lessonSavePlaybackPrefs();
      lessonApplyPlaybackPreferences();
      lessonShowChrome();
    }
  );


  document.addEventListener(
    "click",
    function(event){
      if(
        !lessonSettingsMenu ||
        lessonSettingsMenu.hidden
      ){
        return;
      }

      if(
        event.target.closest(
          ".global-lesson-settings"
        )
      ){
        return;
      }

      closeLessonSettings();
    }
  );


  document.addEventListener(
    "keydown",
    function(event){
      if(
        event.key ===
        "Escape"
      ){
        closeLessonSettings();
      }
    }
  );

  const lessonHost=$("globalLessonPlayer");
  lessonHost?.addEventListener("pointermove",lessonShowChrome,{passive:true});
  lessonHost?.addEventListener("pointerenter",lessonShowChrome,{passive:true});
  lessonHost?.addEventListener("touchstart",lessonShowChrome,{passive:true});

  const lessonHeader=$("globalLessonPlayer")?.querySelector(".global-lesson-head");

  lessonHeader?.addEventListener("pointerdown",(event)=>{
    if(
      event.button!==0 ||
      matchMedia("(max-width: 760px)").matches ||
      event.target.closest("button,input,a") ||
      $("globalLessonPlayer")?.classList.contains("expanded")
    ) return;

    const host=$("globalLessonPlayer");
    if(!host) return;
    const rect=host.getBoundingClientRect();

    lessonState.moveActive=true;
    lessonState.moveStartX=event.clientX;
    lessonState.moveStartY=event.clientY;
    lessonState.moveStartLeft=rect.left;
    lessonState.moveStartTop=rect.top;

    host.style.left=rect.left+"px";
    host.style.top=rect.top+"px";
    host.style.right="auto";
    host.style.bottom="auto";
    host.style.transform="none";
    host.classList.add("lesson-moving");
    host.classList.remove("lesson-clean");

    lessonHeader.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });

  lessonHeader?.addEventListener("pointermove",(event)=>{
    if(!lessonState.moveActive) return;
    const host=$("globalLessonPlayer");
    if(!host) return;
    const rect=host.getBoundingClientRect();
    const pos=lessonClampMiniPosition(
      lessonState.moveStartLeft+(event.clientX-lessonState.moveStartX),
      lessonState.moveStartTop+(event.clientY-lessonState.moveStartY),
      rect.width,
      rect.height
    );
    host.style.left=pos.left+"px";
    host.style.top=pos.top+"px";
    event.preventDefault();
  });

  const finishLessonMove=(event)=>{
    if(!lessonState.moveActive) return;
    lessonState.moveActive=false;
    const host=$("globalLessonPlayer");
    host?.classList.remove("lesson-moving");
    try{lessonHeader?.releasePointerCapture?.(event.pointerId);}catch{}
    lessonPersistMiniPosition();
    lessonShowChrome();
  };
  lessonHeader?.addEventListener("pointerup",finishLessonMove);
  lessonHeader?.addEventListener("pointercancel",finishLessonMove);

  const lessonResizeZones=Array.from(document.querySelectorAll("[data-lesson-resize]"));

  lessonResizeZones.forEach((zone)=>{
    zone.addEventListener("pointerdown",(event)=>{
      if(
        event.button!==0 ||
        matchMedia("(max-width: 760px)").matches ||
        $("globalLessonPlayer")?.classList.contains("expanded")
      ) return;

      const host=$("globalLessonPlayer");
      if(!host) return;
      const rect=host.getBoundingClientRect();

      lessonState.resizeActive=true;
      lessonState.resizeEdge=zone.dataset.lessonResize||"se";
      lessonState.resizeStartX=event.clientX;
      lessonState.resizeStartY=event.clientY;
      lessonState.resizeStartWidth=rect.width;
      lessonState.resizeStartHeight=rect.height;
      lessonState.resizeStartLeft=rect.left;
      lessonState.resizeStartTop=rect.top;

      host.style.left=rect.left+"px";
      host.style.top=rect.top+"px";
      host.style.right="auto";
      host.style.bottom="auto";
      host.style.transform="none";
      host.style.height="";
      host.classList.add("lesson-resizing");
      host.classList.remove("lesson-clean");

      zone.setPointerCapture?.(event.pointerId);
      event.preventDefault();
      event.stopPropagation();
    });

    zone.addEventListener("pointermove",(event)=>{
      if(!lessonState.resizeActive) return;
      const host=$("globalLessonPlayer");
      if(!host) return;

      const edge=lessonState.resizeEdge;
      const dx=event.clientX-lessonState.resizeStartX;
      const dy=event.clientY-lessonState.resizeStartY;
      const horizontal=edge.includes("e") ? dx : edge.includes("w") ? -dx : 0;
      const vertical=edge.includes("s") ? dy : edge.includes("n") ? -dy : 0;
      const verticalAsWidth=vertical*1.55;
      const delta=Math.abs(horizontal)>=Math.abs(verticalAsWidth) ? horizontal : verticalAsWidth;

      const maxWidth=Math.max(320,Math.min(920,window.innerWidth-16));
      const nextWidth=Math.max(320,Math.min(maxWidth,lessonState.resizeStartWidth+delta));
      host.style.width=nextWidth+"px";
      host.style.height="";

      requestAnimationFrame(()=>{
        const nextRect=host.getBoundingClientRect();
        let left=lessonState.resizeStartLeft;
        let top=lessonState.resizeStartTop;

        if(edge.includes("w")){
          left=lessonState.resizeStartLeft+(lessonState.resizeStartWidth-nextRect.width);
        }
        if(edge.includes("n")){
          top=lessonState.resizeStartTop+(lessonState.resizeStartHeight-nextRect.height);
        }

        const pos=lessonClampMiniPosition(left,top,nextRect.width,nextRect.height);
        host.style.left=pos.left+"px";
        host.style.top=pos.top+"px";
      });

      event.preventDefault();
      event.stopPropagation();
    });

    const finish=(event)=>{
      if(!lessonState.resizeActive) return;
      lessonState.resizeActive=false;
      lessonState.resizeEdge="";
      const host=$("globalLessonPlayer");
      host?.classList.remove("lesson-resizing");
      try{zone.releasePointerCapture?.(event.pointerId);}catch{}
      lessonPersistMiniSize();
      lessonPersistMiniPosition();
      lessonShowChrome();
    };

    zone.addEventListener("pointerup",finish);
    zone.addEventListener("pointercancel",finish);
  });

  window.addEventListener("resize",()=>{
    const host=$("globalLessonPlayer");
    if(!host || host.classList.contains("expanded") || matchMedia("(max-width: 760px)").matches) return;
    requestAnimationFrame(()=>{
      const rect=host.getBoundingClientRect();
      const pos=lessonClampMiniPosition(rect.left,rect.top,rect.width,rect.height);
      host.style.left=pos.left+"px";
      host.style.top=pos.top+"px";
      lessonPersistMiniPosition();
    });
  });

  $("globalLessonProgress")?.addEventListener("input",function(){
    lessonState.dragging=true;
    const duration=Number(lessonState.player?.getDuration?.() || lessonState.lastDuration || 0);
    const position=duration*(Number(this.value || 0)/1000);
    $("globalLessonCurrent").textContent=lessonFormatTime(position);
  });
  $("globalLessonProgress")?.addEventListener("change",function(){
    const duration=Number(lessonState.player?.getDuration?.() || lessonState.lastDuration || 0);
    const position=duration*(Number(this.value || 0)/1000);
    lessonState.player?.seekTo?.(position,true);
    lessonState.dragging=false;
  });

  window.setInterval(function(){
    if(!lessonState.video||!lessonState.ready||!lessonState.player) return;
    const now=performance.now();
    const position=Number(lessonState.player.getCurrentTime?.() || 0);
    const duration=Number(lessonState.player.getDuration?.() || 0);
    lessonState.lastPosition=position;
    lessonState.lastDuration=duration;

    if(lessonState.playing){
      if(lessonState.lastWatchTick){
        const delta=(now-lessonState.lastWatchTick)/1000;
        if(delta>0 && delta<3) lessonState.unsyncedWatched+=delta;
      }
      lessonState.lastWatchTick=now;
    }

    if(!lessonState.dragging){
      $("globalLessonCurrent").textContent=lessonFormatTime(position);
      $("globalLessonDuration").textContent=lessonFormatTime(duration);
      $("globalLessonProgress").value=duration>0?String(Math.round(position/duration*1000)):"0";
    }

    saveLessonLocal();
    if(lessonState.unsyncedWatched>=14) void syncLessonProgress(false);
  },1000);

  window.addEventListener("beforeunload",()=>{
    saveLessonLocal();
    void syncLessonProgress(false);
  });

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


      if (!data) {
        return;
      }


      if (
        data.type ===
          "cortex:profile-photo-updated"
      ) {

        cortexProfilePhoto =
          data.fotoPerfil ||
          null;


        refreshProfilePhotoFrames();


        return;
      }


      if (
        data.type ===
          "cortex:first-paint-ready"
      ) {

        window.CortexShellNavigationReady(
          event.source,
          data.href
        );


        return;
      }


      if (
        data.type ===
          "cortex:lesson-play"
      ) {
        void playLesson(
          data.video || {}
        );
        return;
      }

      if (
        data.type ===
          "cortex:lesson-minimize"
      ) {
        lessonSetExpanded(false);
        return;
      }

      if (
        data.type ===
          "cortex:lesson-expand"
      ) {
        lessonSetExpanded(true);
        return;
      }

      if (
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
      view.includes(
        "/musica"
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


    if (
      view === "/app" ||
      view === "/app.html"
    ) {

      view =
        "/index.html";

    }


    view =
      directFramePath(
        view
      );


    /*
     * O HTML do shell nao possui mais src inicial.
     * Assim o Dashboard e carregado exatamente uma vez,
     * evitando consumir a flag da intro em uma carga fantasma.
     */
    frame.dataset
      .cortexTarget =
      view;


    frame.src =
      view;


    history.replaceState(
      {},
      "",
      "/app"
    );

  }


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

        navigateFrameFast(
          "/musica"
        );

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
     CORTEX VOICE · GEMINI LIVE / WEBSOCKET
  ======================================================= */

  const cortexVoiceState = {
    ws: null,
    stream: null,
    inputContext: null,
    inputSource: null,
    inputProcessor: null,
    inputGain: null,
    outputContext: null,
    outputNextTime: 0,
    outputSources: new Set(),
    active: false,
    connecting: false,
    muted: false,
    ready: false,
    assistantTranscript: "",
  };


  const cortexVoiceRoutes = {
    dashboard: "/index.html",
    questoes: "/questoes",
    simulado: "/simulado",
    flashcards: "/flashcards",
    cronograma: "/cronograma",
    aulas: "/aulas",
    academico: "/sigaa",
    desempenho: "/desempenho",
    ranking: "/ranking",
    configuracoes: "/configuracoes",
  };


  function cortexVoiceSetStatus(
    status,
    caption,
    mode
  ) {
    const panel =
      $("cortexVoicePanel");

    if (!panel) {
      return;
    }

    $("cortexVoiceStatus").textContent =
      status ||
      "Cortex Voice";

    if (
      typeof caption ===
      "string"
    ) {
      $("cortexVoiceCaption").textContent =
        caption;
    }

    panel.dataset.state =
      mode ||
      "idle";

    $("cortexVoiceButton")?.classList.toggle(
      "active",
      mode === "listening" ||
      mode === "thinking" ||
      mode === "speaking"
    );
  }


  function cortexVoiceOpenPanel() {
    $("cortexVoicePanel")?.classList.remove(
      "hidden"
    );
  }


  function cortexVoiceSend(
    payload
  ) {
    const ws =
      cortexVoiceState.ws;

    if (
      !ws ||
      ws.readyState !==
        WebSocket.OPEN
    ) {
      return false;
    }

    ws.send(
      JSON.stringify(
        payload
      )
    );

    return true;
  }


  function cortexVoiceToBase64(
    arrayBuffer
  ) {
    const bytes =
      new Uint8Array(
        arrayBuffer
      );

    let binary =
      "";

    const chunk =
      0x8000;

    for (
      let i = 0;
      i < bytes.length;
      i += chunk
    ) {
      binary +=
        String.fromCharCode(
          ...bytes.subarray(
            i,
            Math.min(
              i + chunk,
              bytes.length
            )
          )
        );
    }

    return btoa(
      binary
    );
  }


  function cortexVoiceFromBase64(
    value
  ) {
    const binary =
      atob(
        String(
          value ||
          ""
        )
      );

    const bytes =
      new Uint8Array(
        binary.length
      );

    for (
      let i = 0;
      i < binary.length;
      i += 1
    ) {
      bytes[i] =
        binary.charCodeAt(
          i
        );
    }

    return bytes.buffer;
  }


  function cortexVoiceFloatToPcm16(
    input,
    inputRate,
    outputRate =
      16000
  ) {
    const ratio =
      inputRate /
      outputRate;

    const outputLength =
      Math.max(
        1,
        Math.round(
          input.length /
          ratio
        )
      );

    const buffer =
      new ArrayBuffer(
        outputLength *
        2
      );

    const view =
      new DataView(
        buffer
      );

    for (
      let i = 0;
      i < outputLength;
      i += 1
    ) {
      const start =
        Math.floor(
          i *
          ratio
        );

      const end =
        Math.min(
          input.length,
          Math.floor(
            (
              i +
              1
            ) *
            ratio
          )
        );

      let sum =
        0;

      let count =
        0;

      for (
        let j = start;
        j < end;
        j += 1
      ) {
        sum +=
          input[j];

        count +=
          1;
      }

      const sample =
        Math.max(
          -1,
          Math.min(
            1,
            count
              ? sum /
                count
              : input[
                  start
                ] ||
                0
          )
        );

      view.setInt16(
        i *
          2,
        sample <
          0
          ? sample *
            0x8000
          : sample *
            0x7fff,
        true
      );
    }

    return buffer;
  }


  async function cortexVoiceEnsureOutputContext() {
    if (
      !cortexVoiceState.outputContext
    ) {
      cortexVoiceState.outputContext =
        new (
          window.AudioContext ||
          window.webkitAudioContext
        )();
    }

    if (
      cortexVoiceState.outputContext.state ===
      "suspended"
    ) {
      await cortexVoiceState.outputContext
        .resume()
        .catch(
          function () {}
        );
    }

    return cortexVoiceState.outputContext;
  }


  function cortexVoiceClearOutput() {
    cortexVoiceState.outputSources
      .forEach(
        function (
          source
        ) {
          try {
            source.stop();
          }
          catch {}
        }
      );

    cortexVoiceState.outputSources
      .clear();

    cortexVoiceState.outputNextTime =
      0;
  }


  async function cortexVoicePlayPcm(
    base64,
    sampleRate =
      24000
  ) {
    if (!base64) {
      return;
    }

    const context =
      await cortexVoiceEnsureOutputContext();

    const raw =
      cortexVoiceFromBase64(
        base64
      );

    const view =
      new DataView(
        raw
      );

    const length =
      Math.floor(
        raw.byteLength /
        2
      );

    const audioBuffer =
      context.createBuffer(
        1,
        length,
        sampleRate
      );

    const channel =
      audioBuffer.getChannelData(
        0
      );

    for (
      let i = 0;
      i < length;
      i += 1
    ) {
      channel[i] =
        view.getInt16(
          i *
            2,
          true
        ) /
        32768;
    }

    const source =
      context.createBufferSource();

    source.buffer =
      audioBuffer;

    source.connect(
      context.destination
    );

    const startAt =
      Math.max(
        context.currentTime +
          0.015,
        cortexVoiceState.outputNextTime ||
          0
      );

    source.start(
      startAt
    );

    cortexVoiceState.outputNextTime =
      startAt +
      audioBuffer.duration;

    cortexVoiceState.outputSources
      .add(
        source
      );

    source.onended =
      function () {
        cortexVoiceState.outputSources
          .delete(
            source
          );
      };
  }


  async function cortexVoiceExecuteTool(
    name,
    args
  ) {
    const safeArgs =
      args &&
      typeof args ===
        "object"
        ? args
        : {};

    if (
      name ===
      "navigate_cortex"
    ) {
      const destination =
        String(
          safeArgs.destination ||
          ""
        );

      const href =
        cortexVoiceRoutes[
          destination
        ];

      if (!href) {
        return {
          ok: false,
          error:
            "Área não reconhecida.",
        };
      }

      navigateFrameFast(
        href
      );

      return {
        ok: true,
        destination,
      };
    }


    if (
      name ===
      "start_questions"
    ) {
      const theme =
        String(
          safeArgs.theme ||
          ""
        )
          .trim();

      const quantity =
        Math.max(
          1,
          Math.min(
            50,
            Number(
              safeArgs.quantity
            ) ||
            10
          )
        );

      const params =
        new URLSearchParams({
          quantidade:
            String(
              quantity
            ),
          auto:
            "1",
          voice:
            "1",
        });

      if (theme) {
        params.set(
          "tema",
          theme
        );
      }

      navigateFrameFast(
        "/questoes?" +
        params.toString()
      );

      return {
        ok: true,
        quantity,
        theme:
          theme ||
          null,
      };
    }


    if (
      name ===
      "start_flashcards"
    ) {
      const theme =
        String(
          safeArgs.theme ||
          ""
        )
          .trim();

      const quantity =
        Math.max(
          1,
          Math.min(
            24,
            Number(
              safeArgs.quantity
            ) ||
            10
          )
        );

      const params =
        new URLSearchParams({
          quantidade:
            String(
              quantity
            ),
          auto:
            "1",
          voice:
            "1",
        });

      if (theme) {
        params.set(
          "tema",
          theme
        );
      }

      navigateFrameFast(
        "/flashcards?" +
        params.toString()
      );

      return {
        ok: true,
        quantity,
        theme:
          theme ||
          null,
      };
    }


    return {
      ok: false,
      error:
        "Ferramenta não implementada.",
    };
  }


  async function cortexVoiceHandleToolCall(
    toolCall
  ) {
    const calls =
      Array.isArray(
        toolCall?.functionCalls
      )
        ? toolCall.functionCalls
        : [];

    const responses =
      [];

    for (
      const call
      of calls
    ) {
      const result =
        await cortexVoiceExecuteTool(
          call.name,
          call.args ||
            {}
        );

      responses.push({
        id:
          call.id,
        name:
          call.name,
        response: {
          result,
        },
      });
    }

    if (
      responses.length
    ) {
      cortexVoiceSend({
        toolResponse: {
          functionResponses:
            responses,
        },
      });
    }
  }


  function cortexVoiceHandleMessage(
    event
  ) {
    let message;

    try {
      message =
        JSON.parse(
          event.data
        );
    }
    catch {
      return;
    }


    if (
      message.setupComplete
    ) {
      cortexVoiceState.ready =
        true;

      cortexVoiceState.active =
        true;

      cortexVoiceState.connecting =
        false;

      $("cortexVoiceButton")
        ?.classList.add(
          "connected"
        );

      cortexVoiceSetStatus(
        "Pode falar",
        "Gemini Live conectado. Estou ouvindo.",
        "ready"
      );

      cortexVoiceStartInput();

      return;
    }


    if (
      message.toolCall
    ) {
      void cortexVoiceHandleToolCall(
        message.toolCall
      );

      return;
    }


    const content =
      message.serverContent;

    if (!content) {
      return;
    }


    if (
      content.interrupted
    ) {
      cortexVoiceClearOutput();

      cortexVoiceSetStatus(
        "Estou ouvindo",
        "Pode continuar.",
        "listening"
      );
    }


    const interim =
      String(
        content.interimInputTranscription?.text ||
        ""
      )
        .trim();

    if (interim) {
      cortexVoiceSetStatus(
        "Estou ouvindo",
        interim.slice(
          -220
        ),
        "listening"
      );
    }


    const inputText =
      String(
        content.inputTranscription?.text ||
        ""
      )
        .trim();

    if (inputText) {
      cortexVoiceSetStatus(
        "Pensando",
        inputText.slice(
          -220
        ),
        "thinking"
      );
    }


    const outputText =
      String(
        content.outputTranscription?.text ||
        ""
      );

    if (outputText) {
      cortexVoiceState.assistantTranscript +=
        outputText;

      $("cortexVoiceCaption").textContent =
        cortexVoiceState.assistantTranscript
          .slice(
            -220
          );

      cortexVoiceSetStatus(
        "Cortex está falando",
        $("cortexVoiceCaption").textContent,
        "speaking"
      );
    }


    const parts =
      Array.isArray(
        content.modelTurn?.parts
      )
        ? content.modelTurn.parts
        : [];

    parts.forEach(
      function (
        part
      ) {
        const inline =
          part.inlineData;

        if (
          !inline?.data
        ) {
          return;
        }

        const mime =
          String(
            inline.mimeType ||
            ""
          );

        if (
          mime.startsWith(
            "audio/pcm"
          )
        ) {
          const rateMatch =
            mime.match(
              /rate=(\d+)/
            );

          const rate =
            rateMatch
              ? Number(
                  rateMatch[1]
                )
              : 24000;

          void cortexVoicePlayPcm(
            inline.data,
            rate
          );

          cortexVoiceSetStatus(
            "Cortex está falando",
            $("cortexVoiceCaption")
              ?.textContent ||
              "Respondendo...",
            "speaking"
          );
        }
      }
    );


    if (
      content.turnComplete
    ) {
      cortexVoiceState.assistantTranscript =
        "";

      if (
        cortexVoiceState.active
      ) {
        cortexVoiceSetStatus(
          cortexVoiceState.muted
            ? "Microfone desativado"
            : "Pode falar",
          $("cortexVoiceCaption")
            ?.textContent ||
            "Conversa ativa.",
          cortexVoiceState.muted
            ? "muted"
            : "ready"
        );
      }
    }
  }


  async function cortexVoiceStartInput() {
    const stream =
      cortexVoiceState.stream;

    if (
      !stream ||
      cortexVoiceState.inputContext
    ) {
      return;
    }

    const AudioContextCtor =
      window.AudioContext ||
      window.webkitAudioContext;

    const context =
      new AudioContextCtor();

    const source =
      context.createMediaStreamSource(
        stream
      );

    const processor =
      context.createScriptProcessor(
        2048,
        1,
        1
      );

    const gain =
      context.createGain();

    gain.gain.value =
      0;

    source.connect(
      processor
    );

    processor.connect(
      gain
    );

    gain.connect(
      context.destination
    );

    processor.onaudioprocess =
      function (
        audioEvent
      ) {
        if (
          !cortexVoiceState.ready ||
          cortexVoiceState.muted
        ) {
          return;
        }

        const input =
          audioEvent.inputBuffer
            .getChannelData(
              0
            );

        const pcm =
          cortexVoiceFloatToPcm16(
            input,
            context.sampleRate,
            16000
          );

        cortexVoiceSend({
          realtimeInput: {
            audio: {
              data:
                cortexVoiceToBase64(
                  pcm
                ),
              mimeType:
                "audio/pcm;rate=16000",
            },
          },
        });
      };

    cortexVoiceState.inputContext =
      context;

    cortexVoiceState.inputSource =
      source;

    cortexVoiceState.inputProcessor =
      processor;

    cortexVoiceState.inputGain =
      gain;

    await context
      .resume()
      .catch(
        function () {}
      );
  }


  function cortexVoiceSetupPayload(
    model
  ) {
    const instructions =
      [
        "Você é o Cortex Voice, assistente de voz da plataforma educacional Cortex.",
        "Fale sempre em português brasileiro, de forma humana, natural, calorosa e objetiva.",
        "Evite tom robótico, listas longas e frases artificiais.",
        "Você pode ser interrompido enquanto fala e deve continuar naturalmente.",
        "Quando o usuário pedir para abrir uma área ou iniciar questões ou flashcards, use as ferramentas disponíveis.",
        "Nunca afirme que executou uma ação antes do resultado da ferramenta.",
        "Em dúvidas de estudo, responda como tutor didático e rigoroso.",
        "A plataforma possui Dashboard, Questões, Simulado, Flashcards, Cronograma, Aulas, Acadêmico/SIGAA, Desempenho, Ranking e Configurações.",
      ].join(
        " "
      );

    return {
      setup: {
        model:
          "models/" +
          String(
            model ||
            "gemini-3.8-live"
          )
            .replace(
              /^models\//,
              ""
            ),
        generationConfig: {
          responseModalities: [
            "AUDIO",
          ],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName:
                  "Aoede",
              },
            },
          },
        },
        systemInstruction: {
          parts: [
            {
              text:
                instructions,
            },
          ],
        },
        realtimeInputConfig: {
          automaticActivityDetection: {
            disabled:
              false,
            prefixPaddingMs:
              120,
            silenceDurationMs:
              650,
          },
          activityHandling:
            "START_OF_ACTIVITY_INTERRUPTS",
        },
        inputAudioTranscription: {
          mode:
            "SMART",
        },
        outputAudioTranscription: {},
        tools: [
          {
            functionDeclarations: [
              {
                name:
                  "navigate_cortex",
                description:
                  "Abre uma área principal do Cortex.",
                parameters: {
                  type:
                    "OBJECT",
                  properties: {
                    destination: {
                      type:
                        "STRING",
                      enum: [
                        "dashboard",
                        "questoes",
                        "simulado",
                        "flashcards",
                        "cronograma",
                        "aulas",
                        "academico",
                        "desempenho",
                        "ranking",
                        "configuracoes",
                      ],
                    },
                  },
                  required: [
                    "destination",
                  ],
                },
              },
              {
                name:
                  "start_questions",
                description:
                  "Inicia uma sessão de questões, opcionalmente filtrada por tema.",
                parameters: {
                  type:
                    "OBJECT",
                  properties: {
                    theme: {
                      type:
                        "STRING",
                    },
                    quantity: {
                      type:
                        "INTEGER",
                    },
                  },
                  required: [
                    "quantity",
                  ],
                },
              },
              {
                name:
                  "start_flashcards",
                description:
                  "Inicia uma revisão de flashcards, opcionalmente filtrada por tema.",
                parameters: {
                  type:
                    "OBJECT",
                  properties: {
                    theme: {
                      type:
                        "STRING",
                    },
                    quantity: {
                      type:
                        "INTEGER",
                    },
                  },
                  required: [
                    "quantity",
                  ],
                },
              },
            ],
          },
        ],
      },
    };
  }


  function cortexVoiceDisconnect(
    hidePanel =
      true
  ) {
    cortexVoiceState.active =
      false;

    cortexVoiceState.connecting =
      false;

    cortexVoiceState.ready =
      false;

    cortexVoiceState.assistantTranscript =
      "";

    cortexVoiceClearOutput();

    try {
      cortexVoiceState.inputProcessor
        ?.disconnect();
    }
    catch {}

    try {
      cortexVoiceState.inputSource
        ?.disconnect();
    }
    catch {}

    try {
      cortexVoiceState.inputGain
        ?.disconnect();
    }
    catch {}

    try {
      cortexVoiceState.inputContext
        ?.close();
    }
    catch {}

    try {
      cortexVoiceState.outputContext
        ?.close();
    }
    catch {}

    try {
      cortexVoiceState.ws
        ?.close();
    }
    catch {}

    if (
      cortexVoiceState.stream
    ) {
      cortexVoiceState.stream
        .getTracks()
        .forEach(
          function (
            track
          ) {
            try {
              track.stop();
            }
            catch {}
          }
        );
    }

    cortexVoiceState.ws =
      null;

    cortexVoiceState.stream =
      null;

    cortexVoiceState.inputContext =
      null;

    cortexVoiceState.inputSource =
      null;

    cortexVoiceState.inputProcessor =
      null;

    cortexVoiceState.inputGain =
      null;

    cortexVoiceState.outputContext =
      null;

    cortexVoiceState.outputNextTime =
      0;

    cortexVoiceState.muted =
      false;

    $("cortexVoiceMute")
      ?.setAttribute(
        "aria-pressed",
        "false"
      );

    $("cortexVoiceMute")
      ?.classList.remove(
        "muted"
      );

    $("cortexVoiceButton")
      ?.classList.remove(
        "active",
        "connected"
      );

    if (hidePanel) {
      $("cortexVoicePanel")
        ?.classList.add(
          "hidden"
        );
    }
  }


  async function cortexVoiceConnect() {
    if (
      cortexVoiceState.connecting
    ) {
      return;
    }

    if (
      cortexVoiceState.active
    ) {
      cortexVoiceOpenPanel();

      return;
    }

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia ||
      !window.WebSocket ||
      !(
        window.AudioContext ||
        window.webkitAudioContext
      )
    ) {
      cortexVoiceOpenPanel();

      cortexVoiceSetStatus(
        "Navegador incompatível",
        "Use um navegador moderno com suporte a microfone, áudio e WebSocket.",
        "error"
      );

      return;
    }

    cortexVoiceState.connecting =
      true;

    cortexVoiceOpenPanel();

    cortexVoiceSetStatus(
      "Conectando",
      "Preparando o Gemini Live...",
      "connecting"
    );

    try {
      const stream =
        await navigator.mediaDevices
          .getUserMedia({
            audio: {
              channelCount:
                1,
              echoCancellation:
                true,
              noiseSuppression:
                true,
              autoGainControl:
                true,
            },
          });

      cortexVoiceState.stream =
        stream;

      const tokenResponse =
        await fetch(
          "/api/voice/token",
          {
            method:
              "POST",
            credentials:
              "same-origin",
            cache:
              "no-store",
          }
        );

      const tokenData =
        await tokenResponse
          .json()
          .catch(
            function () {
              return {};
            }
          );

      if (
        !tokenResponse.ok ||
        !tokenData.value
      ) {
        const error =
          new Error(
            tokenData.error ||
            "Não foi possível iniciar o Cortex Voice."
          );

        error.code =
          tokenData.code ||
          "VOICE_SESSION_ERROR";

        throw error;
      }

      const endpoint =
        "wss://generativelanguage.googleapis.com/ws/" +
        "google.ai.generativelanguage.v1beta.GenerativeService." +
        "BidiGenerateContentConstrained?access_token=" +
        encodeURIComponent(
          tokenData.value
        );

      const ws =
        new WebSocket(
          endpoint
        );

      cortexVoiceState.ws =
        ws;

      ws.addEventListener(
        "open",
        function () {
          cortexVoiceSend(
            cortexVoiceSetupPayload(
              tokenData.model
            )
          );

          cortexVoiceSetStatus(
            "Inicializando",
            "Configurando voz e detecção de fala...",
            "connecting"
          );
        }
      );

      ws.addEventListener(
        "message",
        cortexVoiceHandleMessage
      );

      ws.addEventListener(
        "error",
        function (
          error
        ) {
          console.error(
            "Cortex Voice Gemini websocket:",
            error
          );
        }
      );

      ws.addEventListener(
        "close",
        function (
          event
        ) {
          const reason =
            String(
              event.reason ||
              ""
            );

          const quota =
            /quota|resource exhausted|rate limit/i
              .test(
                reason
              );

          if (
            cortexVoiceState.active ||
            cortexVoiceState.connecting
          ) {
            cortexVoiceDisconnect(
              false
            );

            cortexVoiceOpenPanel();

            cortexVoiceSetStatus(
              quota
                ? "Limite gratuito atingido"
                : "Conversa encerrada",
              quota
                ? "O Gemini Live atingiu o limite gratuito. Tente novamente mais tarde."
                : "Clique no botão para iniciar novamente.",
              quota
                ? "error"
                : "idle"
            );
          }
        }
      );

    }
    catch (
      error
    ) {
      console.error(
        "Cortex Voice Gemini connect:",
        error
      );

      cortexVoiceDisconnect(
        false
      );

      cortexVoiceOpenPanel();

      const denied =
        error &&
        (
          error.name ===
            "NotAllowedError" ||
          error.name ===
            "PermissionDeniedError"
        );

      const missingKey =
        error?.code ===
          "VOICE_GEMINI_KEY_MISSING";

      const freeLimit =
        error?.code ===
          "VOICE_FREE_LIMIT_REACHED";

      cortexVoiceSetStatus(
        denied
          ? "Microfone bloqueado"
          : (
              missingKey
                ? "Gemini ainda não configurado"
                : (
                    freeLimit
                      ? "Limite gratuito atingido"
                      : "Não foi possível conectar"
                  )
            ),
        denied
          ? "Permita o uso do microfone no navegador e tente novamente."
          : (
              missingKey
                ? "Adicione a variável GEMINI_API_KEY no Railway para ativar o Free Tier."
                : (
                    freeLimit
                      ? "Aguarde a renovação do limite gratuito do Gemini Live."
                      : (
                          error?.message ||
                          "Tente novamente em alguns segundos."
                        )
                  )
            ),
        "error"
      );
    }
    finally {
      cortexVoiceState.connecting =
        false;
    }
  }


  $("cortexVoiceButton")
    ?.addEventListener(
      "click",
      function () {
        void cortexVoiceConnect();
      }
    );


  $("cortexVoiceEnd")
    ?.addEventListener(
      "click",
      function () {
        cortexVoiceDisconnect(
          true
        );
      }
    );


  $("cortexVoiceStop")
    ?.addEventListener(
      "click",
      function () {
        cortexVoiceDisconnect(
          true
        );
      }
    );


  $("cortexVoiceMute")
    ?.addEventListener(
      "click",
      function () {
        cortexVoiceState.muted =
          !cortexVoiceState.muted;

        cortexVoiceState.stream
          ?.getAudioTracks()
          .forEach(
            function (
              track
            ) {
              track.enabled =
                !cortexVoiceState.muted;
            }
          );

        if (
          cortexVoiceState.muted &&
          cortexVoiceState.ready
        ) {
          cortexVoiceSend({
            realtimeInput: {
              audioStreamEnd:
                true,
            },
          });
        }

        this.classList.toggle(
          "muted",
          cortexVoiceState.muted
        );

        this.setAttribute(
          "aria-pressed",
          cortexVoiceState.muted
            ? "true"
            : "false"
        );

        cortexVoiceSetStatus(
          cortexVoiceState.muted
            ? "Microfone desativado"
            : "Pode falar",
          cortexVoiceState.muted
            ? "A conversa continua conectada."
            : "Gemini Live está ouvindo.",
          cortexVoiceState.muted
            ? "muted"
            : "ready"
        );
      }
    );


  window.addEventListener(
    "beforeunload",
    function () {
      cortexVoiceDisconnect(
        false
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
   * Carrega os dados visuais da conta antes de iniciar a navegacao.
   */
  loadGlobalProfilePhoto();


  configureFrame();
  restoreLessonState();


  /*
   * O botao de musica sempre fica disponivel.
   */
  showPlayerBubble();


  /*
   * Depois inicia a conexao Spotify.
   */
  loadSpotify();

})();