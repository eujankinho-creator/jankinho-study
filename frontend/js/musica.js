(function () {

  "use strict";

  const EMBEDDED =
    window.parent !==
    window;


  function shellPlayer() {

    try {

      if (
        EMBEDDED &&
        window.parent &&
        window.parent
          .CortexSpotifyShell
      ) {

        return window.parent
          .CortexSpotifyShell;

      }

    }
    catch {}


    return null;
  }


  if (EMBEDDED) {

    document.body.classList.add(
      "embedded-music"
    );

  }


  const $ = function (id) {
    return document.getElementById(id);
  };


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
  };


  function escapeHtml(value) {

    const div =
      document.createElement(
        "div"
      );

    div.textContent =
      String(
        value ?? ""
      );

    return div.innerHTML;
  }


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

      if (
        response.status ===
          401 &&
        !url.startsWith(
          "/api/spotify/"
        )
      ) {

        location.href =
          "/login.html";

      }


      throw new Error(
        data.error ||
        "Erro na requisicao."
      );
    }


    return data;
  }


  function showMessage(
    text,
    type
  ) {

    const box =
      $("musicMessage");

    box.textContent =
      text;

    box.className =
      "music-message" +
      (
        type === "error"
          ? " error"
          : ""
      );

    box.classList.remove(
      "hidden"
    );


    window.clearTimeout(
      showMessage.timer
    );


    showMessage.timer =
      window.setTimeout(
        function () {

          box.classList.add(
            "hidden"
          );

        },
        4500
      );
  }


  async function loadUser() {

    const data =
      await api(
        "/api/auth/me"
      );

    const user =
      data.usuario;

    const name =
      user.nome ||
      "Usuario";

    const initial =
      name
        .charAt(0)
        .toUpperCase();


    $("nomeSidebar").textContent =
      name;

    $("emailSidebar").textContent =
      user.email ||
      "";

    $("nomeHeader").textContent =
      name;

    $("avatarSidebar").textContent =
      initial;

    $("avatarHeader").textContent =
      initial;
  }


  async function logout() {

    try {

      await fetch(
        "/api/auth/logout",
        {
          method:
            "POST",

          credentials:
            "same-origin",
        }
      );

    }
    finally {

      location.href =
        "/login.html";

    }
  }


  function setConnectionUI(
    connected
  ) {

    state.connected =
      connected;


    $("spotifyConnectionText")
      .textContent =
      connected
        ? "Conectado"
        : "Nao conectado";


    $("spotifyStatusDot")
      .classList.toggle(
        "online",
        connected
      );


    $("spotifyConnect")
      .classList.toggle(
        "hidden",
        connected
      );


    $("spotifyDisconnect")
      .classList.toggle(
        "hidden",
        !connected
      );
  }


  async function getSpotifyToken() {

    const data =
      await api(
        "/api/spotify/token"
      );

    return data.accessToken;
  }


  async function loadSpotifyStatus() {

    const data =
      await api(
        "/api/spotify/status"
      );

    setConnectionUI(
      Boolean(
        data.conectado
      )
    );


    if (
      data.conectado
    ) {

      if (
        !shellPlayer()
      ) {

        loadSpotifySdk();

      }

    }
  }


  function loadSpotifySdk() {

    if (
      window.Spotify &&
      window.Spotify.Player
    ) {

      createSpotifyPlayer();

      return;
    }


    if (
      document.getElementById(
        "spotifyPlaybackSdk"
      )
    ) {
      return;
    }


    window.onSpotifyWebPlaybackSDKReady =
      function () {

        createSpotifyPlayer();

      };


    const script =
      document.createElement(
        "script"
      );

    script.id =
      "spotifyPlaybackSdk";

    script.src =
      "https://sdk.scdn.co/spotify-player.js";

    script.async =
      true;


    document.body.appendChild(
      script
    );
  }


  function createSpotifyPlayer() {

    if (
      state.player ||
      !window.Spotify
    ) {
      return;
    }


    const player =
      new window.Spotify.Player({
        name:
          "Cortex Player",

        volume:
          .55,

        enableMediaSession:
          true,

        getOAuthToken:
          function (callback) {

            getSpotifyToken()
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

                  setConnectionUI(
                    false
                  );

                  showMessage(
                    "Sua conexao com o Spotify expirou. Conecte novamente.",
                    "error"
                  );

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


        const status =
          $("deviceStatus");

        status.textContent =
          "Cortex Player online";

        status.classList.add(
          "online"
        );

      }
    );


    player.addListener(
      "not_ready",
      function () {

        state.deviceId =
          null;


        const status =
          $("deviceStatus");

        status.textContent =
          "Cortex Player offline";

        status.classList.remove(
          "online"
        );

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

      }
    );


    player.addListener(
      "initialization_error",
      function (data) {

        showMessage(
          data.message ||
          "Erro ao iniciar o player Spotify.",
          "error"
        );

      }
    );


    player.addListener(
      "authentication_error",
      function () {

        setConnectionUI(
          false
        );

        showMessage(
          "O Spotify precisa ser conectado novamente.",
          "error"
        );

      }
    );


    player.addListener(
      "account_error",
      function () {

        showMessage(
          "O Web Playback SDK requer uma conta Spotify Premium autorizada neste aplicativo.",
          "error"
        );

      }
    );


    player.addListener(
      "playback_error",
      function (data) {

        showMessage(
          data.message ||
          "Erro durante a reproducao.",
          "error"
        );

      }
    );


    player
      .connect()
      .then(
        function (connected) {

          if (!connected) {

            showMessage(
              "Nao foi possivel conectar o Cortex Player.",
              "error"
            );

          }

        }
      )
      .catch(
        function (error) {

          console.error(
            error
          );

          showMessage(
            "Falha ao conectar o player Spotify.",
            "error"
          );

        }
      );
  }


  function formatTime(
    milliseconds
  ) {

    const total =
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
        total /
        60
      );


    const seconds =
      String(
        total %
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

    if (
      !state.playback
    ) {
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


  function renderPlayback() {

    const playback =
      state.playback;


    if (!playback) {
      return;
    }


    const track =
      playback.track;


    if (!track) {
      return;
    }


    $("nowPlayingName")
      .textContent =
      track.name ||
      "Spotify";


    $("nowPlayingArtist")
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

      $("nowPlayingCover")
        .src =
        cover.url;


      $("nowPlayingCover")
        .classList.remove(
          "hidden"
        );


      $("coverPlaceholder")
        .classList.add(
          "hidden"
        );

    }


    const external =
      $("openSpotifyTrack");


    if (track.id) {

      external.href =
        "https://open.spotify.com/track/" +
        encodeURIComponent(
          track.id
        );


      external.classList.remove(
        "hidden"
      );

    }


    $("togglePlayback")
      .innerHTML =
      playback.paused
        ? "&#9654;"
        : "&#10074;&#10074;";


    $("togglePlayback")
      .setAttribute(
        "aria-label",
        playback.paused
          ? "Play"
          : "Pausar"
      );


    updateProgress();
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


    $("trackProgress").value =
      String(value);


    $("currentTime").textContent =
      formatTime(
        position
      );


    $("durationTime").textContent =
      formatTime(
        duration
      );
  }


  function renderResults(
    resultados
  ) {

    state.searchResults =
      Array.isArray(
        resultados
      )
        ? resultados
        : [];

    const container =
      $("musicResults");


    if (
      !Array.isArray(
        resultados
      ) ||
      resultados.length ===
      0
    ) {

      container.innerHTML =
        '<div class="music-empty">' +
        'Nenhuma musica encontrada.' +
        '</div>';

      return;
    }


    container.innerHTML =
      resultados
        .map(
          function (track) {

            const artists =
              Array.isArray(
                track.artistas
              )
                ? track.artistas.join(", ")
                : "";


            const image =
              track.imagem
                ? (
                    '<img ' +
                    'class="music-result-cover" ' +
                    'src="' +
                    escapeHtml(
                      track.imagem
                    ) +
                    '" ' +
                    'alt="Capa do album">'
                  )
                : (
                    '<div class="music-result-cover"></div>'
                  );


            const spotifyLink =
              track.spotifyUrl
                ? (
                    '<a ' +
                    'class="spotify-source-link" ' +
                    'href="' +
                    escapeHtml(
                      track.spotifyUrl
                    ) +
                    '" ' +
                    'target="_blank" ' +
                    'rel="noopener noreferrer">' +
                    'Spotify' +
                    '</a>'
                  )
                : "";


            return (
              '<article class="music-result">' +

                image +

                '<div class="music-result-info">' +

                  '<strong>' +
                    escapeHtml(
                      track.nome
                    ) +
                  '</strong>' +

                  '<span>' +
                    escapeHtml(
                      artists
                    ) +
                  '</span>' +

                  '<small>' +
                    escapeHtml(
                      track.album ||
                      ""
                    ) +
                    ' &bull; ' +
                    formatTime(
                      track.duracaoMs
                    ) +
                  '</small>' +

                '</div>' +

                '<div class="music-result-actions">' +

                  spotifyLink +

                  '<button ' +
                    'class="music-result-play" ' +
                    'type="button" ' +
                    'data-play-uri="' +
                    escapeHtml(
                      track.uri
                    ) +
                    '" ' +
                    'aria-label="Tocar">' +
                    '&#9654;' +
                  '</button>' +

                '</div>' +

              '</article>'
            );

          }
        )
        .join("");


    container
      .querySelectorAll(
        "[data-play-uri]"
      )
      .forEach(
        function (button) {

          button.addEventListener(
            "click",
            function () {

              playTrack(
                button.getAttribute(
                  "data-play-uri"
                )
              );

            }
          );

        }
      );
  }


  async function searchMusic(
    query
  ) {

    if (
      !state.connected
    ) {

      showMessage(
        "Conecte sua conta Spotify primeiro.",
        "error"
      );

      return;
    }


    const q =
      String(
        query ||
        ""
      ).trim();


    if (
      q.length < 2
    ) {
      return;
    }


    const button =
      $("musicSearchButton");


    button.disabled =
      true;

    button.textContent =
      "Buscando...";


    $("musicResults").innerHTML =
      '<div class="music-empty">' +
      'Pesquisando no Spotify...' +
      '</div>';


    try {

      const data =
        await api(
          "/api/spotify/search?q=" +
          encodeURIComponent(q)
        );


      renderResults(
        data.resultados
      );

    }
    catch (error) {

      $("musicResults").innerHTML =
        '<div class="music-empty">' +
        escapeHtml(
          error.message
        ) +
        '</div>';


      showMessage(
        error.message,
        "error"
      );

    }
    finally {

      button.disabled =
        false;

      button.textContent =
        "Buscar";

    }
  }


  async function playTrack(
    uri
  ) {

    const shell =
      shellPlayer();


    if (shell) {

      try {

        const results =
          Array.isArray(
            state.searchResults
          )
            ? state.searchResults
            : [];


        const uris =
          results
            .map(
              function (item) {

                return item.uri;

              }
            )
            .filter(Boolean);


        const index =
          Math.max(
            0,
            uris.indexOf(
              uri
            )
          );


        if (
          uris.length > 0
        ) {

          await shell.playUris(
            uris,
            index
          );

        }
        else {

          await shell.playUri(
            uri
          );

        }


        return;

      }
      catch (error) {

        showMessage(
          error.message ||
          "Nao foi possivel tocar a musica.",
          "error"
        );


        return;
      }

    }

    if (
      !state.player ||
      !state.deviceId
    ) {

      showMessage(
        "Aguarde o Cortex Player ficar online.",
        "error"
      );

      return;
    }


    try {

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

              uri,
            }),
        }
      );

    }
    catch (error) {

      showMessage(
        error.message,
        "error"
      );

    }
  }


  $("musicSearchForm")
    .addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        searchMusic(
          $("musicSearch").value
        );

      }
    );


  $("spotifyConnect")
    .addEventListener(
      "click",
      function () {

        if (EMBEDDED) {

          window.top.location.href =
            "/api/spotify/login";

        }
        else {

          location.href =
            "/api/spotify/login";

        }

      }
    );


  $("spotifyDisconnect")
    .addEventListener(
      "click",
      async function () {

        try {

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


          setConnectionUI(
            false
          );


          $("deviceStatus")
            .textContent =
            "Cortex Player offline";


          $("deviceStatus")
            .classList.remove(
              "online"
            );


          $("musicResults")
            .innerHTML =
            '<div class="music-empty">' +
            'Conecte o Spotify para pesquisar.' +
            '</div>';

        }
        catch (error) {

          showMessage(
            error.message,
            "error"
          );

        }

      }
    );


  $("togglePlayback")
    .addEventListener(
      "click",
      async function () {

        try {

          const shell =
            shellPlayer();


          if (shell) {

            await shell
              .togglePlay();

            return;

          }


          if (!state.player) {
            return;
          }


          await state.player
            .togglePlay();

        }
        catch (error) {

          showMessage(
            "Nao foi possivel alterar a reproducao.",
            "error"
          );

        }

      }
    );


  $("previousTrack")
    .addEventListener(
      "click",
      async function () {

        const shell =
          shellPlayer();


        if (shell) {

          await shell
            .previous()
            .catch(
              function () {}
            );

          return;

        }


        if (!state.player) {
          return;
        }


        await state.player
          .previousTrack()
          .catch(
            function () {}
          );

      }
    );


  $("nextTrack")
    .addEventListener(
      "click",
      async function () {

        const shell =
          shellPlayer();


        if (shell) {

          await shell
            .next()
            .catch(
              function () {}
            );

          return;

        }


        if (!state.player) {
          return;
        }


        await state.player
          .nextTrack()
          .catch(
            function () {}
          );

      }
    );


  $("trackProgress")
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
            $("trackProgress").value
          ) /
          1000 *
          state.playback.duration;


        $("currentTime")
          .textContent =
          formatTime(
            position
          );

      }
    );


  $("trackProgress")
    .addEventListener(
      "change",
      async function () {

        if (
          !state.player ||
          !state.playback
        ) {

          state.dragging =
            false;

          return;
        }


        const position =
          Number(
            $("trackProgress").value
          ) /
          1000 *
          state.playback.duration;


        const shell =
          shellPlayer();


        if (shell) {

          await shell
            .seek(
              position
            )
            .catch(
              function () {}
            );

        }
        else if (
          state.player
        ) {

          await state.player
            .seek(
              position
            )
            .catch(
              function () {}
            );

        }


        state.dragging =
          false;

      }
    );


  $("playerVolume")
    .addEventListener(
      "input",
      function () {

        const value =
          Number(
            $("playerVolume").value
          );


        $("volumeValue")
          .textContent =
          value +
          "%";


        const shell =
          shellPlayer();


        if (shell) {

          shell
            .setVolume(
              value /
              100
            )
            .catch(
              function () {}
            );

        }
        else if (
          state.player
        ) {

          state.player
            .setVolume(
              value /
              100
            )
            .catch(
              function () {}
            );

        }

      }
    );


  $("logoutSidebar")
    .addEventListener(
      "click",
      logout
    );


  function readSpotifyReturn() {

    const params =
      new URLSearchParams(
        location.search
      );


    const spotify =
      params.get(
        "spotify"
      );


    if (
      spotify ===
      "connected"
    ) {

      showMessage(
        "Spotify conectado ao Cortex Player."
      );

    }
    else if (
      spotify ===
      "denied"
    ) {

      showMessage(
        "A autorizacao do Spotify foi cancelada.",
        "error"
      );

    }
    else if (
      spotify ===
      "error"
    ) {

      showMessage(
        "Nao foi possivel concluir a conexao com o Spotify.",
        "error"
      );

    }


    if (spotify) {

      history.replaceState(
        {},
        "",
        "/musica"
      );

    }
  }


  async function start() {

    try {

      readSpotifyReturn();


      await Promise.all([
        loadUser(),
        loadSpotifyStatus(),
      ]);

    }
    catch (error) {

      console.error(
        error
      );


      showMessage(
        error.message ||
        "Nao foi possivel iniciar o Cortex Player.",
        "error"
      );

    }
  }


  window.setInterval(
    updateProgress,
    500
  );


  start();

})();