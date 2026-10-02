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


  /*
   * O botao de musica sempre fica disponivel.
   */
  showPlayerBubble();


  /*
   * Depois inicia a conexao Spotify.
   */
  loadSpotify();

})();