$ErrorActionPreference = "Stop"

$utf8 = New-Object System.Text.UTF8Encoding($false)

Write-Host ""
Write-Host "============================================"
Write-Host " FLUIDEZ + CRONOMETRO DE ESTUDOS"
Write-Host "============================================"
Write-Host ""


# ============================================================
# 1. CSS GLOBAL
# ============================================================

$css = @'
/* =========================================================
   JANKINHO STUDY - UI GLOBAL
========================================================= */

html {
  scroll-behavior: smooth;
}


body {
  opacity: 0;

  transition:
    opacity .18s ease;
}


body.ui-ready {
  opacity: 1;
}


/* =========================================================
   BARRA DE CARREGAMENTO
========================================================= */

.ui-loading-line {
  position: fixed;

  top: 0;
  left: 0;

  z-index: 99999;

  width: 0;
  height: 2px;

  opacity: 0;

  pointer-events: none;

  background:
    linear-gradient(
      90deg,
      #f97316,
      #fb923c
    );

  box-shadow:
    0 0 12px
    rgba(249,115,22,.45);

  transition:
    width .22s ease,
    opacity .18s ease;
}


.ui-loading-line.active {
  opacity: 1;
}


/* =========================================================
   LOADING MAIS SUAVE
========================================================= */

.loading-card,
.loading-state,
.skeleton {
  position: relative;

  overflow: hidden;
}


.loading-card::after,
.loading-state::after,
.skeleton::after {
  content: "";

  position: absolute;

  top: 0;
  bottom: 0;

  left: -60%;

  width: 45%;

  pointer-events: none;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.035),
      transparent
    );

  animation:
    uiShimmer 1.35s
    ease-in-out infinite;
}


@keyframes uiShimmer {

  0% {
    left: -60%;
  }

  100% {
    left: 120%;
  }

}


.ui-reveal {
  animation:
    uiReveal .22s
    ease both;
}


@keyframes uiReveal {

  from {
    opacity: 0;
    transform:
      translateY(5px);
  }

  to {
    opacity: 1;
    transform:
      translateY(0);
  }

}


/* =========================================================
   CRONOMETRO
========================================================= */

.study-timer {
  position: relative;

  display: flex;
  align-items: center;

  margin-left: auto;
  margin-right: 16px;

  z-index: 100;
}


.study-timer-button {
  height: 38px;

  display: flex;
  align-items: center;
  gap: 8px;

  border:
    1px solid
    rgba(255,255,255,.08);

  border-radius: 12px;

  background:
    rgba(255,255,255,.025);

  padding:
    0 12px;

  color:
    #a3a3a3;

  font: inherit;

  font-size: 11px;

  font-weight: 700;

  cursor: pointer;

  transition:
    background .18s ease,
    border-color .18s ease,
    color .18s ease,
    transform .18s ease;
}


.study-timer-button:hover {
  border-color:
    rgba(249,115,22,.25);

  background:
    rgba(249,115,22,.06);

  color:
    #fff;
}


.study-timer-button.running {
  border-color:
    rgba(249,115,22,.28);

  background:
    rgba(249,115,22,.08);

  color:
    #fb923c;
}


.study-timer-button:active {
  transform:
    scale(.98);
}


.study-timer-icon {
  font-size: 14px;
}


.study-timer-time {
  min-width: 58px;

  font-variant-numeric:
    tabular-nums;

  letter-spacing:
    .02em;
}


.study-timer-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background:
    #525252;
}


.study-timer-button.running
.study-timer-dot {
  background:
    #f97316;

  box-shadow:
    0 0 9px
    rgba(249,115,22,.7);

  animation:
    timerPulse 1.4s
    ease-in-out infinite;
}


@keyframes timerPulse {

  0%,
  100% {
    opacity: .45;
  }

  50% {
    opacity: 1;
  }

}


.study-timer-panel {
  position: absolute;

  top: calc(100% + 10px);
  right: 0;

  width: 300px;

  visibility: hidden;
  opacity: 0;

  transform:
    translateY(-5px);

  border:
    1px solid
    rgba(255,255,255,.08);

  border-radius: 17px;

  background:
    #0a0a0a;

  padding: 17px;

  box-shadow:
    0 20px 55px
    rgba(0,0,0,.45);

  pointer-events: none;

  transition:
    opacity .16s ease,
    transform .16s ease,
    visibility .16s ease;
}


.study-timer.open
.study-timer-panel {
  visibility: visible;
  opacity: 1;

  transform:
    translateY(0);

  pointer-events: auto;
}


.study-timer-panel-title {
  color:
    #fff;

  font-size: 13px;

  font-weight: 800;
}


.study-timer-panel-subtitle {
  margin-top: 3px;

  color:
    #525252;

  font-size: 9px;
}


.study-timer-display {
  margin-top: 16px;

  border:
    1px solid
    rgba(249,115,22,.12);

  border-radius: 14px;

  background:
    rgba(249,115,22,.035);

  padding: 16px;

  text-align: center;
}


.study-timer-display strong {
  display: block;

  color:
    #fb923c;

  font-size: 28px;

  font-weight: 800;

  font-variant-numeric:
    tabular-nums;

  letter-spacing:
    .03em;
}


.study-timer-display span {
  display: block;

  margin-top: 4px;

  color:
    #525252;

  font-size: 9px;

  text-transform: uppercase;

  letter-spacing: .08em;
}


.study-timer-today {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 11px;

  border:
    1px solid
    rgba(255,255,255,.05);

  border-radius: 11px;

  background:
    rgba(255,255,255,.015);

  padding:
    10px 11px;
}


.study-timer-today span {
  color:
    #525252;

  font-size: 9px;
}


.study-timer-today strong {
  color:
    #d4d4d4;

  font-size: 11px;

  font-variant-numeric:
    tabular-nums;
}


.study-timer-actions {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 8px;

  margin-top: 12px;
}


.study-timer-actions button {
  height: 36px;

  border-radius: 10px;

  font: inherit;

  font-size: 10px;

  font-weight: 800;

  cursor: pointer;
}


.study-timer-start {
  border: 0;

  background:
    #f97316;

  color:
    #050505;
}


.study-timer-reset {
  border:
    1px solid
    rgba(255,255,255,.07);

  background:
    rgba(255,255,255,.025);

  color:
    #737373;
}


.study-timer-reset:hover {
  color:
    #fff;
}


.study-timer-status {
  margin-top: 10px;

  color:
    #404040;

  font-size: 8px;

  text-align: center;
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {

  .study-timer {
    margin-right: 8px;
  }


  .study-timer-button {
    padding:
      0 9px;
  }


  .study-timer-icon {
    display: none;
  }


  .study-timer-panel {
    position: fixed;

    top: 78px;
    right: 12px;
    left: 12px;

    width: auto;
  }

}


@media (
  prefers-reduced-motion:
  reduce
) {

  *,
  *::before,
  *::after {
    animation-duration:
      .01ms !important;

    animation-iteration-count:
      1 !important;

    transition-duration:
      .01ms !important;
  }

}
'@

[System.IO.File]::WriteAllText(
    "frontend\css\ui-enhancements.css",
    $css,
    $utf8
)


# ============================================================
# 2. JAVASCRIPT GLOBAL
# ============================================================

$js = @'
(function () {

  "use strict";


  const nativeFetch =
    window.fetch.bind(window);


  let pendingRequests = 0;
  let progress = null;
  let progressValue = 0;
  let finishTimer = null;


  /* =========================================================
     FETCH / LOADING
  ========================================================= */

  function ensureProgress() {

    if (progress) {
      return progress;
    }


    progress =
      document.createElement(
        "div"
      );


    progress.className =
      "ui-loading-line";


    document.body.appendChild(
      progress
    );


    return progress;
  }


  function startProgress() {

    if (!document.body) {
      return;
    }


    const bar =
      ensureProgress();


    pendingRequests++;


    window.clearTimeout(
      finishTimer
    );


    if (
      progressValue <= 0 ||
      progressValue >= 100
    ) {

      progressValue = 12;
    }


    bar.classList.add(
      "active"
    );


    bar.style.width =
      progressValue + "%";


    window.setTimeout(
      function () {

        if (
          pendingRequests > 0 &&
          progressValue < 72
        ) {

          progressValue =
            Math.min(
              72,
              progressValue + 25
            );


          bar.style.width =
            progressValue + "%";
        }
      },
      120
    );
  }


  function finishProgress() {

    pendingRequests =
      Math.max(
        0,
        pendingRequests - 1
      );


    if (
      pendingRequests !== 0 ||
      !progress
    ) {
      return;
    }


    progressValue = 100;

    progress.style.width =
      "100%";


    finishTimer =
      window.setTimeout(
        function () {

          if (!progress) {
            return;
          }


          progress.classList.remove(
            "active"
          );


          window.setTimeout(
            function () {

              if (!progress) {
                return;
              }


              progress.style.width =
                "0%";


              progressValue = 0;

            },
            190
          );

        },
        140
      );
  }


  window.fetch =
    async function () {

      const args =
        Array.prototype.slice.call(
          arguments
        );


      const first =
        args[0];


      const url =
        typeof first === "string"
          ? first
          : first &&
            typeof first.url === "string"
              ? first.url
              : "";


      const track =
        url.includes("/api/");


      if (track) {
        startProgress();
      }


      try {

        return await nativeFetch.apply(
          window,
          args
        );

      }
      finally {

        if (track) {
          finishProgress();
        }
      }
    };


  /* =========================================================
     HELPERS DO CRONOMETRO
  ========================================================= */

  function pad(value) {

    return String(value)
      .padStart(2, "0");
  }


  function formatTime(ms) {

    const totalSeconds =
      Math.max(
        0,
        Math.floor(ms / 1000)
      );


    const hours =
      Math.floor(
        totalSeconds / 3600
      );


    const minutes =
      Math.floor(
        (
          totalSeconds % 3600
        ) / 60
      );


    const seconds =
      totalSeconds % 60;


    return (
      pad(hours) +
      ":" +
      pad(minutes) +
      ":" +
      pad(seconds)
    );
  }


  function dayKey(timestamp) {

    const date =
      new Date(timestamp);


    return (
      date.getFullYear() +
      "-" +
      pad(
        date.getMonth() + 1
      ) +
      "-" +
      pad(
        date.getDate()
      )
    );
  }


  function nextMidnight(
    timestamp
  ) {

    const date =
      new Date(timestamp);


    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
      0,
      0,
      0,
      0
    ).getTime();
  }


  function createDefaultState() {

    return {
      running: false,
      sessionMs: 0,
      lastTickAt: null,
      daily: {},
    };
  }


  function normalizeState(value) {

    const fallback =
      createDefaultState();


    if (
      !value ||
      typeof value !== "object"
    ) {

      return fallback;
    }


    return {
      running:
        Boolean(value.running),

      sessionMs:
        Number(value.sessionMs) || 0,

      lastTickAt:
        Number(value.lastTickAt) || null,

      daily:
        value.daily &&
        typeof value.daily === "object"
          ? value.daily
          : {},
    };
  }


  async function getTimerKey() {

    try {

      const response =
        await nativeFetch(
          "/api/auth/me",
          {
            method: "GET",
            credentials:
              "same-origin",
          }
        );


      if (response.ok) {

        const data =
          await response.json();


        const user =
          data.usuario ||
          data;


        if (user && user.id) {

          return (
            "jankinho_study_timer_v1_" +
            user.id
          );
        }
      }

    }
    catch (error) {

      console.debug(
        "Timer user:",
        error
      );
    }


    return (
      "jankinho_study_timer_v1_local"
    );
  }


  /* =========================================================
     TIMER
  ========================================================= */

  async function initTimer() {

    const header =
      document.querySelector(
        ".header"
      );


    if (!header) {
      return;
    }


    const key =
      await getTimerKey();


    let state;


    try {

      state =
        normalizeState(
          JSON.parse(
            localStorage.getItem(
              key
            ) ||
            "null"
          )
        );

    }
    catch {

      state =
        createDefaultState();
    }


    function save() {

      localStorage.setItem(
        key,
        JSON.stringify(state)
      );
    }


    function applyElapsed(now) {

      if (
        !state.running
      ) {
        return;
      }


      let start =
        Number(
          state.lastTickAt
        ) || now;


      if (start > now) {
        start = now;
      }


      while (
        start < now
      ) {

        const end =
          Math.min(
            nextMidnight(start),
            now
          );


        const elapsed =
          Math.max(
            0,
            end - start
          );


        const keyDay =
          dayKey(start);


        state.daily[keyDay] =
          (
            Number(
              state.daily[keyDay]
            ) || 0
          ) +
          elapsed;


        state.sessionMs +=
          elapsed;


        start = end;
      }


      state.lastTickAt =
        now;
    }


    if (
      state.running
    ) {

      applyElapsed(
        Date.now()
      );


      save();
    }


    const root =
      document.createElement(
        "div"
      );


    root.className =
      "study-timer";


    root.innerHTML =
      [
        '<button type="button" class="study-timer-button" aria-label="Cronometro de estudos">',
        '<span class="study-timer-dot"></span>',
        '<span class="study-timer-icon">\u23f1</span>',
        '<span class="study-timer-time">00:00:00</span>',
        '</button>',

        '<div class="study-timer-panel">',

        '<div class="study-timer-panel-title">',
        'Cron\u00f4metro de estudos',
        '</div>',

        '<div class="study-timer-panel-subtitle">',
        'Seu tempo continua mesmo trocando de p\u00e1gina.',
        '</div>',

        '<div class="study-timer-display">',
        '<strong class="study-session-time">00:00:00</strong>',
        '<span>Sess\u00e3o atual</span>',
        '</div>',

        '<div class="study-timer-today">',
        '<span>Tempo estudado hoje</span>',
        '<strong class="study-today-time">00:00:00</strong>',
        '</div>',

        '<div class="study-timer-actions">',
        '<button type="button" class="study-timer-start">Iniciar</button>',
        '<button type="button" class="study-timer-reset">Zerar sess\u00e3o</button>',
        '</div>',

        '<div class="study-timer-status">',
        'Cron\u00f4metro parado',
        '</div>',

        '</div>'
      ].join("");


    const headerUser =
      header.querySelector(
        ".header-user"
      );


    if (headerUser) {

      header.insertBefore(
        root,
        headerUser
      );

    }
    else {

      header.appendChild(
        root
      );
    }


    const mainButton =
      root.querySelector(
        ".study-timer-button"
      );


    const topTime =
      root.querySelector(
        ".study-timer-time"
      );


    const sessionTime =
      root.querySelector(
        ".study-session-time"
      );


    const todayTime =
      root.querySelector(
        ".study-today-time"
      );


    const startButton =
      root.querySelector(
        ".study-timer-start"
      );


    const resetButton =
      root.querySelector(
        ".study-timer-reset"
      );


    const status =
      root.querySelector(
        ".study-timer-status"
      );


    function render() {

      const session =
        state.sessionMs;


      const today =
        Number(
          state.daily[
            dayKey(
              Date.now()
            )
          ]
        ) || 0;


      const formatted =
        formatTime(session);


      topTime.textContent =
        formatted;


      sessionTime.textContent =
        formatted;


      todayTime.textContent =
        formatTime(today);


      mainButton.classList.toggle(
        "running",
        state.running
      );


      startButton.textContent =
        state.running
          ? "Pausar"
          : "Iniciar";


      status.textContent =
        state.running
          ? "Contabilizando seu tempo de estudo"
          : "Cron\u00f4metro parado";
    }


    function tick() {

      if (
        state.running
      ) {

        applyElapsed(
          Date.now()
        );


        save();
      }


      render();
    }


    mainButton.addEventListener(
      "click",
      function (event) {

        event.stopPropagation();


        root.classList.toggle(
          "open"
        );
      }
    );


    startButton.addEventListener(
      "click",
      function () {

        if (
          state.running
        ) {

          applyElapsed(
            Date.now()
          );


          state.running =
            false;


          state.lastTickAt =
            null;

        }
        else {

          state.running =
            true;


          state.lastTickAt =
            Date.now();
        }


        save();
        render();
      }
    );


    resetButton.addEventListener(
      "click",
      function () {

        /*
         * Zera somente a sessao.
         * O total de hoje continua salvo.
         */
        state.sessionMs = 0;


        if (
          state.running
        ) {

          state.lastTickAt =
            Date.now();
        }


        save();
        render();
      }
    );


    document.addEventListener(
      "click",
      function (event) {

        if (
          !root.contains(
            event.target
          )
        ) {

          root.classList.remove(
            "open"
          );
        }
      }
    );


    window.addEventListener(
      "beforeunload",
      function () {

        if (
          state.running
        ) {

          applyElapsed(
            Date.now()
          );


          save();
        }
      }
    );


    render();


    window.setInterval(
      tick,
      1000
    );
  }


  /* =========================================================
     REVEAL AUTOMATICO
  ========================================================= */

  function initRevealObserver() {

    const observer =
      new MutationObserver(
        function (mutations) {

          for (
            const mutation
            of mutations
          ) {

            if (
              mutation.type !==
              "attributes"
            ) {
              continue;
            }


            const element =
              mutation.target;


            if (
              !(element instanceof HTMLElement)
            ) {
              continue;
            }


            const oldValue =
              mutation.oldValue ||
              "";


            if (
              oldValue.includes(
                "hidden"
              ) &&
              !element.classList.contains(
                "hidden"
              )
            ) {

              element.classList.remove(
                "ui-reveal"
              );


              void element.offsetWidth;


              element.classList.add(
                "ui-reveal"
              );
            }
          }
        }
      );


    observer.observe(
      document.body,
      {
        subtree: true,
        attributes: true,
        attributeFilter: [
          "class"
        ],
        attributeOldValue: true,
      }
    );
  }


  /* =========================================================
     START
  ========================================================= */

  document.addEventListener(
    "DOMContentLoaded",
    function () {

      ensureProgress();


      document.body.classList.add(
        "ui-ready"
      );


      initRevealObserver();


      initTimer();
    }
  );

})();
'@

[System.IO.File]::WriteAllText(
    "frontend\js\ui-enhancements.js",
    $js,
    $utf8
)


# ============================================================
# 3. INJETA EM TODAS AS PAGINAS INTERNAS
# ============================================================

Write-Host "[1/4] Adicionando UI global nas paginas..."


$ignore = @(
    "login.html",
    "cadastro.html"
)


$htmlFiles =
    Get-ChildItem `
        -Path "frontend" `
        -Filter "*.html" `
        -File


foreach ($file in $htmlFiles) {

    if (
        $ignore -contains
        $file.Name
    ) {
        continue
    }


    $content =
        [System.IO.File]::ReadAllText(
            $file.FullName,
            [System.Text.Encoding]::UTF8
        )


    $changed = $false


    if (
        -not $content.Contains(
            "/css/ui-enhancements.css"
        )
    ) {

        $content =
            $content.Replace(
                "</head>",
                @'
  <link rel="stylesheet" href="/css/ui-enhancements.css">
  <script src="/js/ui-enhancements.js"></script>
</head>
'@
            )


        $changed = $true
    }


    if ($changed) {

        [System.IO.File]::WriteAllText(
            $file.FullName,
            $content,
            $utf8
        )


        Write-Host "  atualizado: $($file.Name)"
    }
}


# ============================================================
# 4. PARALELIZA LOADS QUE JA CONHECEMOS
# ============================================================

Write-Host "[2/4] Otimizando requisicoes paralelas..."


$desempenhoPath =
    "frontend\js\desempenho.js"


if (
    Test-Path $desempenhoPath
) {

    $content =
        [System.IO.File]::ReadAllText(
            $desempenhoPath,
            [System.Text.Encoding]::UTF8
        )


    $pattern =
        'await\s+loadUser\(\);\s*await\s+loadPerformance\(\);'


    if (
        [regex]::IsMatch(
            $content,
            $pattern
        )
    ) {

        $content =
            [regex]::Replace(
                $content,
                $pattern,
                @'
await Promise.all([
    loadUser(),
    loadPerformance()
  ]);
'@
            )


        [System.IO.File]::WriteAllText(
            $desempenhoPath,
            $content,
            $utf8
        )


        Write-Host "  desempenho.js otimizado"
    }
}


$rankingPath =
    "frontend\js\ranking.js"


if (
    Test-Path $rankingPath
) {

    $content =
        [System.IO.File]::ReadAllText(
            $rankingPath,
            [System.Text.Encoding]::UTF8
        )


    $pattern =
        'await\s+loadUser\(\);\s*await\s+loadRanking\(\);'


    if (
        [regex]::IsMatch(
            $content,
            $pattern
        )
    ) {

        $content =
            [regex]::Replace(
                $content,
                $pattern,
                @'
await Promise.all([
    loadUser(),
    loadRanking()
  ]);
'@
            )


        [System.IO.File]::WriteAllText(
            $rankingPath,
            $content,
            $utf8
        )


        Write-Host "  ranking.js otimizado"
    }
}


# ============================================================
# 5. CACHE DOS ASSETS EM PRODUCAO
# ============================================================

Write-Host "[3/4] Otimizando cache de CSS/JS..."


$serverPath =
    "backend\src\server.ts"


if (
    Test-Path $serverPath
) {

    $server =
        [System.IO.File]::ReadAllText(
            $serverPath,
            [System.Text.Encoding]::UTF8
        )


    if (
        -not $server.Contains(
            "public, max-age=86400"
        )
    ) {

        $serveIndex =
            $server.IndexOf(
                "async function servirArquivo"
            )


        if (
            $serveIndex -ge 0
        ) {

            $head =
                $server.Substring(
                    0,
                    $serveIndex
                )


            $tail =
                $server.Substring(
                    $serveIndex
                )


            $oldPattern =
                '"Cache-Control":\s*"no-cache"'


            $newValue = @'
"Cache-Control":
          process.env.NODE_ENV === "production" &&
          path.extname(arquivo).toLowerCase() !== ".html"
            ? "public, max-age=86400"
            : "no-cache"
'@


            $tail =
                [regex]::Replace(
                    $tail,
                    $oldPattern,
                    $newValue,
                    1
                )


            $server =
                $head +
                $tail


            [System.IO.File]::WriteAllText(
                $serverPath,
                $server,
                $utf8
            )


            Write-Host "  cache do servidor otimizado"
        }
    }
}


# ============================================================
# 6. VALIDACAO
# ============================================================

Write-Host "[4/4] Validando TypeScript..."
Write-Host ""


npm run build


if (
    $LASTEXITCODE -ne 0
) {

    throw "Build falhou. Nao faca commit."
}


Write-Host ""
Write-Host "============================================"
Write-Host " MELHORIAS CONCLUIDAS"
Write-Host "============================================"
Write-Host ""
Write-Host "Adicionado:"
Write-Host " - cronometro global"
Write-Host " - tempo da sessao"
Write-Host " - total estudado hoje"
Write-Host " - persistencia ao trocar de pagina"
Write-Host " - persistencia ao atualizar"
Write-Host " - separacao por usuario"
Write-Host " - barra de carregamento de APIs"
Write-Host " - transicoes de conteudo"
Write-Host " - shimmer nos loadings"
Write-Host " - requisicoes paralelas em desempenho/ranking"
Write-Host " - cache de assets em producao"
Write-Host ""
Write-Host "Agora rode:"
Write-Host ""
Write-Host "npm start"
Write-Host ""