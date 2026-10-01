
(function () {

  "use strict";


  const HISTORY_KEY =
    "cortex_simulado_history_v1";


  const state = {

    questions:
      [],

    selectedAreas:
      new Set(),

    mode:
      "guided",

    session:
      [],

    answers:
      [],

    index:
      0,

    marked:
      new Set(),

    startedAt:
      null,

    secondsRemaining:
      0,

    initialSeconds:
      0,

    timerId:
      null,

    lastSession:
      [],

    performanceSaved:
      false,

    performanceSavePromise:
      null,

    finishing:
      false

  };


  function $(
    id
  ) {

    return document
      .getElementById(
        id
      );

  }


  function escapeHtml(
    value
  ) {

    const div =
      document.createElement(
        "div"
      );


    div.textContent =
      String(
        value ??
        ""
      );


    return div.innerHTML;

  }


  function normalize(
    value
  ) {

    return String(
      value ??
      ""
    )
      .trim()
      .toLocaleLowerCase(
        "pt-BR"
      )
      .normalize(
        "NFD"
      )
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );

  }


  function difficulty(
    value
  ) {

    const normalized =
      normalize(
        value
      );


    if (
      normalized ===
      "facil"
    ) {

      return "facil";

    }


    if (
      normalized ===
      "dificil"
    ) {

      return "dificil";

    }


    return "medio";

  }


  function difficultyName(
    value
  ) {

    const type =
      difficulty(
        value
      );


    if (
      type ===
      "facil"
    ) {

      return "F\u00e1cil";

    }


    if (
      type ===
      "dificil"
    ) {

      return "Dif\u00edcil";

    }


    return "M\u00e9dio";

  }


  function questionArea(
    question
  ) {

    return (
      question &&
      question.disciplina &&
      question.disciplina.nome
        ? String(
            question.disciplina.nome
          ).trim()
        : "Geral"
    );

  }


  function shuffle(
    items
  ) {

    const result =
      [
        ...items
      ];


    for (
      let index =
        result.length -
        1;

      index >
        0;

      index--
    ) {

      const random =
        Math.floor(
          Math.random() *
          (
            index +
            1
          )
        );


      [
        result[index],
        result[random]
      ] =
      [
        result[random],
        result[index]
      ];

    }


    return result;

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

          ...options
        }
      );


    if (
      response.status ===
      401
    ) {

      location.href =
        "/login.html";


      throw new Error(
        "Nao autenticado."
      );

    }


    const data =
      await response
        .json()
        .catch(
          function () {
            return {};
          }
        );


    if (
      !response.ok
    ) {

      throw new Error(
        data.error ||
        "Erro na requisicao."
      );

    }


    return data;

  }


  async function loadUser() {

    const data =
      await api(
        "/api/auth/me"
      );


    const user =
      data.usuario ||
      {};


    const name =
      user.nome ||
      "Usuario";


    $("nomeSidebar")
      .textContent =
      name;


    $("emailSidebar")
      .textContent =
      user.email ||
      "";


    $("avatarSidebar")
      .textContent =
      name
        .charAt(
          0
        )
        .toUpperCase();

  }


  function areaMap() {

    const map =
      new Map();


    state.questions.forEach(
      function (
        question
      ) {

        const area =
          questionArea(
            question
          );


        map.set(
          area,
          (
            map.get(
              area
            ) ||
            0
          ) +
          1
        );

      }
    );


    return map;

  }


  function renderAreas() {

    const map =
      areaMap();


    const areas =
      Array
        .from(
          map.keys()
        )
        .sort(
          function (
            a,
            b
          ) {

            return a.localeCompare(
              b,
              "pt-BR"
            );

          }
        );


    if (
      state.selectedAreas.size ===
      0
    ) {

      areas.forEach(
        function (
          area
        ) {

          state.selectedAreas
            .add(
              area
            );

        }
      );

    }


    $("areasGrid")
      .innerHTML =
      areas
        .map(
          function (
            area
          ) {

            const selected =
              state.selectedAreas
                .has(
                  area
                );


            return `
              <label
                class="area-option ${
                  selected
                    ? "active"
                    : ""
                }"
              >

                <input
                  type="checkbox"
                  data-area="${escapeHtml(
                    area
                  )}"
                  ${
                    selected
                      ? "checked"
                      : ""
                  }
                >

                <strong>
                  ${escapeHtml(
                    area
                  )}
                </strong>

                <span>
                  ${map.get(
                    area
                  )} quest.
                </span>

              </label>
            `;

          }
        )
        .join("");


    document
      .querySelectorAll(
        "[data-area]"
      )
      .forEach(
        function (
          input
        ) {

          input.addEventListener(
            "change",
            function () {

              const area =
                input.dataset.area;


              if (
                input.checked
              ) {

                state.selectedAreas
                  .add(
                    area
                  );

              }
              else {

                state.selectedAreas
                  .delete(
                    area
                  );

              }


              input
                .closest(
                  ".area-option"
                )
                .classList
                .toggle(
                  "active",
                  input.checked
                );


              updateAvailable();

            }
          );

        }
      );


    $("simTotalAreas")
      .textContent =
      areas.length;


    updateAvailable();

  }


  function selectedDifficulties() {

    return Array
      .from(
        document
          .querySelectorAll(
            "[data-difficulty]:checked"
          )
      )
      .map(
        function (
          input
        ) {

          return input.value;

        }
      );

  }


  function availableQuestions() {

    const difficulties =
      selectedDifficulties();


    return state.questions
      .filter(
        function (
          question
        ) {

          return (
            state.selectedAreas.has(
              questionArea(
                question
              )
            ) &&
            difficulties.includes(
              difficulty(
                question.dificuldade
              )
            ) &&
            Array.isArray(
              question.alternativas
            ) &&
            question.alternativas.length >
              1
          );

        }
      );

  }


  function updateAvailable() {

    const count =
      availableQuestions()
        .length;


    $("availableCount")
      .textContent =
      count +
      " dispon\u00edveis";

  }


  async function loadQuestions() {

    const data =
      await api(
        "/api/questoes"
      );


    state.questions =
      Array.isArray(
        data
      )
        ? data
        : [];


    $("simTotalQuestions")
      .textContent =
      state.questions.length;


    renderAreas();

  }


  function getHistory() {

    try {

      const data =
        JSON.parse(
          localStorage.getItem(
            HISTORY_KEY
          ) ||
          "[]"
        );


      return Array.isArray(
        data
      )
        ? data
        : [];

    }
    catch {

      return [];

    }

  }


  function saveHistory(
    entry
  ) {

    const history =
      getHistory();


    history.unshift(
      entry
    );


    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(
        history.slice(
          0,
          12
        )
      )
    );


    renderHistory();

  }


  function renderHistory() {

    const history =
      getHistory();


    const best =
      history.reduce(
        function (
          current,
          item
        ) {

          return Math.max(
            current,
            Number(
              item.percent ||
              0
            )
          );

        },
        0
      );


    $("simBestScore")
      .textContent =
      history.length
        ? best + "%"
        : "--";


    if (
      history.length ===
      0
    ) {

      $("simulationHistory")
        .innerHTML =
        '<div class="sim-history-item">' +
        '<span>Nenhum simulado realizado ainda.</span>' +
        '</div>';


      return;

    }


    $("simulationHistory")
      .innerHTML =
      history
        .slice(
          0,
          5
        )
        .map(
          function (
            item
          ) {

            return `
              <div class="sim-history-item">

                <div>

                  <strong>
                    ${item.percent}%
                  </strong>

                  <span>
                    ${item.correct}/${item.total}
                    acertos
                  </span>

                </div>

                <span>
                  ${new Date(
                    item.date
                  ).toLocaleDateString(
                    "pt-BR"
                  )}
                </span>

              </div>
            `;

          }
        )
        .join("");

  }


  function safeQuestionImageUrl(
    value
  ) {

    const url =
      String(
        value ||
        ""
      )
        .trim();


    if (
      url.startsWith(
        "/assets/"
      ) ||
      url.startsWith(
        "data:image/"
      ) ||
      url.startsWith(
        "https://"
      )
    ) {

      return url;

    }


    return "";

  }


  function renderQuestionMedia(
    question
  ) {

    const meta =
      $("simulationQuestionMeta");


    const visual =
      $("simulationQuestionVisual");


    const fonte =
      String(
        question.fonte ||
        ""
      )
        .trim();


    const fonteUrl =
      String(
        question.fonteUrl ||
        ""
      )
        .trim();


    if (
      fonte
    ) {

      if (
        /^https:\/\//i.test(
          fonteUrl
        )
      ) {

        meta.innerHTML =
          '<a class="sim-question-source" ' +
          'href="' +
          escapeHtml(
            fonteUrl
          ) +
          '" target="_blank" rel="noopener noreferrer">' +
          'Fonte: ' +
          escapeHtml(
            fonte
          ) +
          '</a>';

      }
      else {

        meta.innerHTML =
          '<span class="sim-question-source">' +
          'Fonte: ' +
          escapeHtml(
            fonte
          ) +
          '</span>';

      }

    }
    else {

      meta.innerHTML =
        "";

    }


    const src =
      safeQuestionImageUrl(
        question.imagemUrl
      );


    if (
      src
    ) {

      visual.classList
        .remove(
          "hidden"
        );


      visual.innerHTML =
        '<img src="' +
        escapeHtml(
          src
        ) +
        '" alt="' +
        escapeHtml(
          question.imagemAlt ||
          "Imagem de apoio da questão"
        ) +
        '" loading="lazy" decoding="async">';

    }
    else {

      visual.classList
        .add(
          "hidden"
        );


      visual.innerHTML =
        "";

    }

  }


  function showError(
    message
  ) {

    $("simError")
      .textContent =
      message;


    $("simError")
      .classList
      .remove(
        "hidden"
      );

  }


  function hideError() {

    $("simError")
      .classList
      .add(
        "hidden"
      );

  }


  function setMode(
    mode
  ) {

    state.mode =
      mode;


    document
      .querySelectorAll(
        "[data-mode]"
      )
      .forEach(
        function (
          button
        ) {

          button.classList
            .toggle(
              "active",
              button.dataset.mode ===
              mode
            );

        }
      );

  }


  function applyPreset(
    preset
  ) {

    if (
      preset ===
      "review"
    ) {

      setMode(
        "guided"
      );


      $("simQuantity")
        .value =
        "10";


      $("simTimer")
        .value =
        "0";

    }


    if (
      preset ===
      "exam"
    ) {

      setMode(
        "exam"
      );


      $("simQuantity")
        .value =
        "20";


      $("simTimer")
        .value =
        "40";

    }


    if (
      preset ===
      "challenge"
    ) {

      setMode(
        "exam"
      );


      $("simQuantity")
        .value =
        "30";


      $("simTimer")
        .value =
        "60";

    }


    document
      .querySelectorAll(
        "[data-preset]"
      )
      .forEach(
        function (
          button
        ) {

          button.classList
            .toggle(
              "featured",
              button.dataset.preset ===
              preset
            );

        }
      );

  }


  function startWithQuestions(
    questions
  ) {

    if (
      !questions ||
      questions.length ===
      0
    ) {

      showError(
        "Nenhuma questao disponivel para essa configuracao."
      );


      return;

    }


    hideError();


    state.session =
      questions;


    state.lastSession =
      [
        ...questions
      ];


    state.answers =
      questions.map(
        function () {
          return null;
        }
      );


    state.index =
      0;


    state.marked =
      new Set();


    state.startedAt =
      Date.now();


    state.performanceSaved =
      false;


    state.performanceSavePromise =
      null;


    state.finishing =
      false;


    const minutes =
      Number(
        $("simTimer")
          .value
      );


    state.initialSeconds =
      minutes *
      60;


    state.secondsRemaining =
      state.initialSeconds;


    $("configView")
      .classList
      .add(
        "hidden"
      );


    $("resultView")
      .classList
      .add(
        "hidden"
      );


    $("simulationView")
      .classList
      .remove(
        "hidden"
      );


    startTimer();

    renderQuestion();


    window.scrollTo({
      top:
        0,

      behavior:
        "smooth"
    });

  }


  function startSimulation() {

    const available =
      availableQuestions();


    if (
      state.selectedAreas.size ===
      0
    ) {

      showError(
        "Selecione pelo menos uma area."
      );


      return;

    }


    if (
      selectedDifficulties()
        .length ===
      0
    ) {

      showError(
        "Selecione pelo menos uma dificuldade."
      );


      return;

    }


    const wanted =
      Number(
        $("simQuantity")
          .value
      );


    const session =
      shuffle(
        available
      )
        .slice(
          0,
          Math.min(
            wanted,
            available.length
          )
        );


    startWithQuestions(
      session
    );

  }


  function currentQuestion() {

    return state.session[
      state.index
    ];

  }


  function correctIndex(
    question
  ) {

    return (
      question.alternativas ||
      []
    )
      .findIndex(
        function (
          option
        ) {

          return Boolean(
            option.correta
          );

        }
      );

  }


  function renderQuestion() {

    const question =
      currentQuestion();


    if (
      !question
    ) {

      finishSimulation();

      return;

    }


    const answer =
      state.answers[
        state.index
      ];


    const correct =
      correctIndex(
        question
      );


    const percent =
      Math.round(
        (
          (
            state.index +
            1
          ) /
          state.session.length
        ) *
        100
      );


    $("questionCounter")
      .textContent =
      "Quest\u00e3o " +
      (
        state.index +
        1
      ) +
      " de " +
      state.session.length;


    $("simulationProgressFill")
      .style.width =
      percent +
      "%";


    $("simulationQuestion")
      .textContent =
      question.enunciado;


    renderQuestionMedia(
      question
    );


    $("questionBadges")
      .innerHTML =
      '<span class="sim-badge accent">' +
      escapeHtml(
        questionArea(
          question
        )
      ) +
      '</span>' +
      '<span class="sim-badge">' +
      escapeHtml(
        difficultyName(
          question.dificuldade
        )
      ) +
      '</span>' +
      (
        question.tema
          ? '<span class="sim-badge">' +
            escapeHtml(
              question.tema
            ) +
            '</span>'
          : ""
      );


    const marked =
      state.marked.has(
        question.id
      );


    $("markReview")
      .classList
      .toggle(
        "active",
        marked
      );


    $("markReview")
      .innerHTML =
      marked
        ? "&#9733; Marcada"
        : "&#9734; Revisar";


    $("simulationOptions")
      .innerHTML =
      (
        question.alternativas ||
        []
      )
        .map(
          function (
            option,
            index
          ) {

            let classes =
              "sim-option";


            if (
              answer &&
              answer.selected ===
              index
            ) {

              classes +=
                " selected";

            }


            if (
              state.mode ===
                "guided" &&
              answer
            ) {

              if (
                index ===
                correct
              ) {

                classes +=
                  " correct";

              }
              else if (
                index ===
                answer.selected
              ) {

                classes +=
                  " wrong";

              }

            }


            let estadoResposta =
              "";


            if (
              state.mode ===
                "guided" &&
              answer
            ) {

              if (
                index ===
                correct
              ) {

                estadoResposta =
                  '<span class="cortex-answer-state cortex-answer-state-correct">✓ CORRETA</span>';

              }
              else if (
                index ===
                answer.selected
              ) {

                estadoResposta =
                  '<span class="cortex-answer-state cortex-answer-state-wrong">✕ ERRADA</span>';

              }

            }


            return `
              <button
                class="${classes}"
                data-answer="${index}"
                type="button"
                ${
                  state.mode ===
                    "guided" &&
                  answer
                    ? "disabled"
                    : ""
                }
              >

                <span class="option-letter">
                  ${String.fromCharCode(
                    65 +
                    index
                  )}
                </span>

                <span class="option-text">
                  ${escapeHtml(
                    option.texto
                  )}
                </span>

                ${estadoResposta}

              </button>
            `;

          }
        )
        .join("");


    document
      .querySelectorAll(
        "[data-answer]"
      )
      .forEach(
        function (
          button
        ) {

          button.addEventListener(
            "click",
            function () {

              chooseAnswer(
                Number(
                  button.dataset.answer
                )
              );

            }
          );

        }
      );


    renderFeedback();


    $("previousSimulation")
      .disabled =
      state.index ===
      0;


    $("nextSimulation")
      .textContent =
      state.index ===
        state.session.length -
        1
        ? "Finalizar"
        : "Pr\u00f3xima \u2192";

  }


  function chooseAnswer(
    selected
  ) {

    const question =
      currentQuestion();


    if (!question) {
      return;
    }


    const correct =
      correctIndex(
        question
      );


    if (
      state.mode ===
        "guided" &&
      state.answers[
        state.index
      ]
    ) {

      return;

    }


    state.answers[
      state.index
    ] = {

      selected,

      correct:
        selected ===
        correct

    };


    renderQuestion();

  }


  function renderFeedback() {

    const feedback =
      $("guidedFeedback");


    const answer =
      state.answers[
        state.index
      ];


    const question =
      currentQuestion();


    if (
      state.mode !==
        "guided" ||
      !answer ||
      !question
    ) {

      feedback
        .className =
        "guided-feedback hidden";


      feedback
        .innerHTML =
        "";


      return;

    }


    feedback.className =
      "guided-feedback " +
      (
        answer.correct
          ? "correct"
          : "wrong"
      );


    feedback.innerHTML =
      '<strong>' +
      (
        answer.correct
          ? "Resposta correta"
          : "Resposta incorreta"
      ) +
      '</strong>' +
      (
        question.explicacao
          ? '<p>' +
            escapeHtml(
              question.explicacao
            ) +
            '</p>'
          : '<p>Continue a revisao e confira o tema no seu material.</p>'
      );

  }


  function nextQuestion() {

    if (
      !state.answers[
        state.index
      ]
    ) {

      window.alert(
        "Selecione uma alternativa antes de continuar."
      );


      return;

    }


    if (
      state.index >=
      state.session.length -
      1
    ) {

      finishSimulation();

      return;

    }


    state.index++;

    renderQuestion();

  }


  function previousQuestion() {

    if (
      state.index >
      0
    ) {

      state.index--;

      renderQuestion();

    }

  }


  function toggleReview() {

    const question =
      currentQuestion();


    if (!question) {
      return;
    }


    if (
      state.marked.has(
        question.id
      )
    ) {

      state.marked.delete(
        question.id
      );

    }
    else {

      state.marked.add(
        question.id
      );

    }


    renderQuestion();

  }


  function startTimer() {

    stopTimer();


    if (
      state.initialSeconds <=
      0
    ) {

      $("simulationTimer")
        .textContent =
        "--:--";


      return;

    }


    updateTimer();


    state.timerId =
      window.setInterval(
        function () {

          state.secondsRemaining--;


          updateTimer();


          if (
            state.secondsRemaining <=
            0
          ) {

            stopTimer();

            finishSimulation();

          }

        },
        1000
      );

  }


  function stopTimer() {

    if (
      state.timerId
    ) {

      clearInterval(
        state.timerId
      );


      state.timerId =
        null;

    }

  }


  function updateTimer() {

    const seconds =
      Math.max(
        0,
        state.secondsRemaining
      );


    const minutes =
      Math.floor(
        seconds /
        60
      );


    const rest =
      seconds %
      60;


    $("simulationTimer")
      .textContent =
      String(
        minutes
      ).padStart(
        2,
        "0"
      ) +
      ":" +
      String(
        rest
      ).padStart(
        2,
        "0"
      );


    const ratio =
      state.initialSeconds >
        0
        ? seconds /
          state.initialSeconds
        : 1;


    $("timerBox")
      .classList
      .toggle(
        "warning",
        ratio <=
          .25
      );


    $("timerBox")
      .classList
      .toggle(
        "danger",
        ratio <=
          .10
      );

  }


  function elapsedSeconds() {

    if (
      !state.startedAt
    ) {

      return 0;

    }


    return Math.max(
      0,
      Math.round(
        (
          Date.now() -
          state.startedAt
        ) /
        1000
      )
    );

  }


  function formatDuration(
    seconds
  ) {

    const minutes =
      Math.floor(
        seconds /
        60
      );


    const rest =
      seconds %
      60;


    return (
      minutes +
      "m " +
      rest +
      "s"
    );

  }


  async function saveSimulationPerformance() {

    if (
      state.performanceSaved
    ) {
      return;
    }


    if (
      state.performanceSavePromise
    ) {

      return state
        .performanceSavePromise;

    }


    const respostas =
      state.answers
        .map(
          function (
            answer,
            index
          ) {

            if (
              !answer ||
              !state.session[
                index
              ]
            ) {

              return null;

            }


            return {
              questaoId:
                state.session[
                  index
                ].id,

              correta:
                Boolean(
                  answer.correct
                ),
            };

          }
        )
        .filter(
          Boolean
        );


    if (
      respostas.length ===
        0
    ) {

      state.performanceSaved =
        true;

      return;

    }


    state.performanceSavePromise =
      api(
        "/api/respostas/lote",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              respostas,
            }),
        }
      )
        .then(
          function () {

            state.performanceSaved =
              true;

          }
        )
        .finally(
          function () {

            state.performanceSavePromise =
              null;

          }
        );


    return state
      .performanceSavePromise;

  }


  async function finishSimulation() {

    if (
      state.finishing
    ) {
      return;
    }


    state.finishing =
      true;


    stopTimer();


    try {

      await saveSimulationPerformance();

    }
    catch (
      error
    ) {

      console.error(
        "Desempenho do simulado:",
        error
      );

    }


    const total =
      state.session.length;


    const correct =
      state.answers.filter(
        function (
          answer
        ) {

          return (
            answer &&
            answer.correct
          );

        }
      ).length;


    const wrong =
      total -
      correct;


    const percent =
      total
        ? Math.round(
            correct /
            total *
            100
          )
        : 0;


    $("simulationView")
      .classList
      .add(
        "hidden"
      );


    $("resultView")
      .classList
      .remove(
        "hidden"
      );


    $("resultPercent")
      .textContent =
      percent +
      "%";


    $("scoreCircle")
      .style
      .setProperty(
        "--score",
        percent
      );


    $("resultCorrect")
      .textContent =
      correct;


    $("resultWrong")
      .textContent =
      wrong;


    $("resultMarked")
      .textContent =
      state.marked.size;


    const elapsed =
      elapsedSeconds();


    $("resultTime")
      .textContent =
      formatDuration(
        elapsed
      );


    if (
      percent >=
      80
    ) {

      $("resultTitle")
        .textContent =
        "Excelente sess\u00e3o";


      $("resultSummary")
        .textContent =
        "Seu desempenho foi consistente. Use o resultado por area para manter os pontos fortes.";

    }
    else if (
      percent >=
      60
    ) {

      $("resultTitle")
        .textContent =
        "Bom progresso";


      $("resultSummary")
        .textContent =
        "Voce ja tem uma boa base. Revise as areas com menor percentual para consolidar o conteudo.";

    }
    else {

      $("resultTitle")
        .textContent =
        "Hora de revisar";


      $("resultSummary")
        .textContent =
        "O resultado mostra onde concentrar a proxima revisao antes de tentar novamente.";

    }


    renderAreaResults();

    renderWrongQuestions();


    saveHistory({

      date:
        new Date()
          .toISOString(),

      percent,

      correct,

      total,

      seconds:
        elapsed

    });


    window.scrollTo({
      top:
        0,

      behavior:
        "smooth"
    });

  }


  function renderAreaResults() {

    const map =
      new Map();


    state.session.forEach(
      function (
        question,
        index
      ) {

        const area =
          questionArea(
            question
          );


        if (
          !map.has(
            area
          )
        ) {

          map.set(
            area,
            {
              total:
                0,

              correct:
                0
            }
          );

        }


        const item =
          map.get(
            area
          );


        item.total++;


        if (
          state.answers[
            index
          ] &&
          state.answers[
            index
          ].correct
        ) {

          item.correct++;

        }

      }
    );


    $("areaResults")
      .innerHTML =
      Array
        .from(
          map.entries()
        )
        .map(
          function (
            entry
          ) {

            const area =
              entry[0];


            const data =
              entry[1];


            const percent =
              Math.round(
                data.correct /
                data.total *
                100
              );


            return `
              <div class="area-result">

                <div class="area-result-top">

                  <strong>
                    ${escapeHtml(
                      area
                    )}
                  </strong>

                  <span>
                    ${data.correct}/${data.total}
                    - ${percent}%
                  </span>

                </div>

                <div class="area-result-track">
                  <div
                    style="width:${percent}%"
                  ></div>
                </div>

              </div>
            `;

          }
        )
        .join("");

  }


  function renderWrongQuestions() {

    const items =
      [];


    state.session.forEach(
      function (
        question,
        index
      ) {

        const answer =
          state.answers[
            index
          ];


        if (
          !answer ||
          !answer.correct ||
          state.marked.has(
            question.id
          )
        ) {

          const correct =
            correctIndex(
              question
            );


          const correctText =
            question.alternativas[
              correct
            ]
              ? question.alternativas[
                  correct
                ].texto
              : "Nao informada";


          items.push(
            `
              <div class="wrong-item">

                <strong>
                  ${escapeHtml(
                    question.enunciado
                  )}
                </strong>

                <span>
                  ${escapeHtml(
                    questionArea(
                      question
                    )
                  )}
                </span>

                <p>
                  Correta:
                  ${escapeHtml(
                    correctText
                  )}
                </p>

                ${
                  question.explicacao
                    ? '<p>' +
                      escapeHtml(
                        question.explicacao
                      ) +
                      '</p>'
                    : ""
                }

              </div>
            `
          );

        }

      }
    );


    $("wrongQuestions")
      .innerHTML =
      items.length
        ? items.join("")
        : '<div class="sim-history-item"><span>Nenhuma questao para revisar.</span></div>';

  }


  function retryWrong() {

    const wrong =
      state.session.filter(
        function (
          question,
          index
        ) {

          const answer =
            state.answers[
              index
            ];


          return (
            !answer ||
            !answer.correct ||
            state.marked.has(
              question.id
            )
          );

        }
      );


    if (
      wrong.length ===
      0
    ) {

      window.alert(
        "Nao existem erros ou questoes marcadas para refazer."
      );


      return;

    }


    state.mode =
      "guided";


    startWithQuestions(
      shuffle(
        wrong
      )
    );

  }


  function repeatSimulation() {

    if (
      state.lastSession.length ===
      0
    ) {

      return;

    }


    startWithQuestions(
      shuffle(
        state.lastSession
      )
    );

  }


  function backToSetup() {

    stopTimer();


    $("simulationView")
      .classList
      .add(
        "hidden"
      );


    $("resultView")
      .classList
      .add(
        "hidden"
      );


    $("configView")
      .classList
      .remove(
        "hidden"
      );

  }


  function exitSimulation() {

    if (
      window.confirm(
        "Encerrar este simulado?"
      )
    ) {

      backToSetup();

    }

  }


  async function logout() {

    try {

      await fetch(
        "/api/auth/logout",
        {
          method:
            "POST",

          credentials:
            "same-origin"
        }
      );

    }
    finally {

      location.href =
        "/login.html";

    }

  }


  function bindEvents() {

    document
      .querySelectorAll(
        "[data-mode]"
      )
      .forEach(
        function (
          button
        ) {

          button.addEventListener(
            "click",
            function () {

              setMode(
                button.dataset.mode
              );

            }
          );

        }
      );


    document
      .querySelectorAll(
        "[data-preset]"
      )
      .forEach(
        function (
          button
        ) {

          button.addEventListener(
            "click",
            function () {

              applyPreset(
                button.dataset.preset
              );

            }
          );

        }
      );


    document
      .querySelectorAll(
        "[data-difficulty]"
      )
      .forEach(
        function (
          input
        ) {

          input.addEventListener(
            "change",
            function () {

              input
                .closest(
                  ".check-chip"
                )
                .classList
                .toggle(
                  "active",
                  input.checked
                );


              updateAvailable();

            }
          );

        }
      );


    $("selectAllAreas")
      .addEventListener(
        "click",
        function () {

          areaMap()
            .forEach(
              function (
                count,
                area
              ) {

                state.selectedAreas
                  .add(
                    area
                  );

              }
            );


          renderAreas();

        }
      );


    $("clearAreas")
      .addEventListener(
        "click",
        function () {

          state.selectedAreas
            .clear();


          document
            .querySelectorAll(
              "[data-area]"
            )
            .forEach(
              function (
                input
              ) {

                input.checked =
                  false;


                input
                  .closest(
                    ".area-option"
                  )
                  .classList
                  .remove(
                    "active"
                  );

              }
            );


          updateAvailable();

        }
      );


    $("startSimulation")
      .addEventListener(
        "click",
        startSimulation
      );


    $("nextSimulation")
      .addEventListener(
        "click",
        nextQuestion
      );


    $("previousSimulation")
      .addEventListener(
        "click",
        previousQuestion
      );


    $("markReview")
      .addEventListener(
        "click",
        toggleReview
      );


    $("exitSimulation")
      .addEventListener(
        "click",
        exitSimulation
      );


    $("backToSimulationSetup")
      .addEventListener(
        "click",
        backToSetup
      );


    $("retryWrong")
      .addEventListener(
        "click",
        retryWrong
      );


    $("repeatSimulation")
      .addEventListener(
        "click",
        repeatSimulation
      );


    $("clearSimHistory")
      .addEventListener(
        "click",
        function () {

          localStorage.removeItem(
            HISTORY_KEY
          );


          renderHistory();

        }
      );


    $("logoutSidebar")
      .addEventListener(
        "click",
        logout
      );

  }


  async function init() {

    bindEvents();

    renderHistory();


    try {

      await Promise.all([
        loadUser(),
        loadQuestions()
      ]);

    }
    catch (
      error
    ) {

      console.error(
        error
      );


      showError(
        error.message ||
        "Nao foi possivel carregar o simulado."
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
