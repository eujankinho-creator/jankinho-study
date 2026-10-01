(function () {

  "use strict";


  const drugs =
    Array.isArray(
      window.CortexFarmacos
    )
      ? window.CortexFarmacos
      : [];


  const receptors =
    window.CortexReceptores ||
    {};


  const STORAGE_FAVORITES =
    "cortex_pharma_favorites_v1";

  const STORAGE_REVIEWED =
    "cortex_pharma_reviewed_v1";


  const state = {

    search: "",

    group: "Todos",

    action: "Todas",

    receptor: null,

    favoritesOnly: false,

    studyMode: false,

    compare: new Set(),

    favorites:
      loadSet(
        STORAGE_FAVORITES
      ),

    reviewed:
      loadSet(
        STORAGE_REVIEWED
      ),

    quiz: null,

  };


  function $(
    id
  ) {

    return document
      .getElementById(
        id
      );
  }


  function loadSet(
    key
  ) {

    try {

      const data =
        JSON.parse(
          localStorage
            .getItem(
              key
            ) ||
          "[]"
        );

      return new Set(
        Array.isArray(data)
          ? data
          : []
      );

    }
    catch {

      return new Set();

    }
  }


  function saveSet(
    key,
    value
  ) {

    localStorage.setItem(
      key,
      JSON.stringify(
        Array.from(
          value
        )
      )
    );
  }


  function escapeHtml(
    value
  ) {

    return String(
      value == null
        ? ""
        : value
    )
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );
  }


  function normalize(
    value
  ) {

    return String(
      value || ""
    )
      .normalize(
        "NFD"
      )
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLowerCase();
  }


  function unique(
    values
  ) {

    return Array.from(
      new Set(
        values
      )
    );
  }


  function drugText(
    drug
  ) {

    return normalize(
      [
        drug.nome,
        drug.principioAtivo,
        drug.fonte,
        drug.grupo,
        drug.classe,
        drug.acao,
        drug.mecanismo,
        drug.dica,
        ...(drug.receptores || []),
        ...(drug.efeitos || []),
        ...(drug.usos || []),
        ...(drug.adversos || []),
        ...(drug.alertas || []),
      ].join(
        " "
      )
    );
  }


  function filteredDrugs() {

    const query =
      normalize(
        state.search
      );


    return drugs.filter(
      function (
        drug
      ) {

        if (
          state.group !==
            "Todos" &&
          drug.grupo !==
            state.group
        ) {

          return false;

        }


        if (
          state.action !==
            "Todas" &&
          drug.acao !==
            state.action
        ) {

          return false;

        }


        if (
          state.receptor &&
          !drug.receptores.includes(
            state.receptor
          )
        ) {

          return false;

        }


        if (
          state.favoritesOnly &&
          !state.favorites.has(
            drug.id
          )
        ) {

          return false;

        }


        if (
          query &&
          !drugText(
            drug
          ).includes(
            query
          )
        ) {

          return false;

        }


        return true;

      }
    );
  }


  function renderFilters() {

    const groups = [
      "Todos",
      ...unique(
        drugs.map(
          function (
            drug
          ) {

            return drug.grupo;

          }
        )
      ),
    ];


    $("groupFilters")
      .innerHTML =
      groups.map(
        function (
          group
        ) {

          const active =
            state.group ===
            group;

          return `
            <button
              type="button"
              class="filter-chip ${active ? "active" : ""}"
              data-group="${escapeHtml(group)}"
            >
              ${escapeHtml(group)}
            </button>
          `;

        }
      ).join("");


    const actions = [
      "Todas",
      ...unique(
        drugs.map(
          function (
            drug
          ) {

            return drug.acao;

          }
        )
      ),
    ];


    $("actionFilters")
      .innerHTML =
      actions.map(
        function (
          action
        ) {

          const active =
            state.action ===
            action;

          return `
            <button
              type="button"
              class="filter-chip ${active ? "active" : ""}"
              data-action="${escapeHtml(action)}"
            >
              ${escapeHtml(action)}
            </button>
          `;

        }
      ).join("");

  }


  function renderReceptors() {

    const preferredOrder = [
      "M1",
      "M2",
      "M3",
      "M4",
      "M5",
      "Nn",
      "Nm",
      "AChE",
      "BChE",
      "alpha1",
      "alpha2",
      "beta1",
      "beta2",
      "beta3",
      "D1",
      "D2",
      "D4",
      "GABA-A",
      "SERT",
      "NET",
      "DAT",
      "MAO-A",
      "MAO-B",
      "5-HT2A",
      "5-HT6",
      "NMDA",
      "μ (MOR)",
      "K2P",
      "Muscarinicos",
      "Nicotinicos",
    ];


    const usedReceptors =
      unique(
        drugs.flatMap(
          function (
            drug
          ) {

            return Array.isArray(
              drug.receptores
            )
              ? drug.receptores
              : [];

          }
        )
      );


    const order =
      unique(
        [
          ...preferredOrder,
          ...Object.keys(
            receptors
          ),
          ...usedReceptors,
        ]
      ).filter(
        function (
          name
        ) {

          return (
            usedReceptors.includes(
              name
            ) ||
            Boolean(
              receptors[name]
            )
          );

        }
      );


    $("receptorMap")
      .innerHTML =
      order.map(
        function (
          name
        ) {

          const info =
            receptors[name] ||
            {};


          const count =
            drugs.filter(
              function (
                drug
              ) {

                return drug
                  .receptores
                  .includes(
                    name
                  );

              }
            ).length;


          const active =
            state.receptor ===
            name;


          return `
            <button
              type="button"
              class="receptor-card ${active ? "active" : ""}"
              data-receptor="${escapeHtml(name)}"
            >
              <div class="receptor-name">
                ${formatReceptor(name)}
              </div>

              <div class="receptor-family">
                ${escapeHtml(info.familia || "")}
                ${info.via ? " · " + escapeHtml(info.via) : ""}
              </div>

              <p>
                ${escapeHtml(info.resumo || "")}
              </p>

              <span>
                ${count} fármaco${count === 1 ? "" : "s"}
              </span>
            </button>
          `;

        }
      ).join("");


    $("activeReceptorLabel")
      .textContent =
      state.receptor
        ? "Filtro: " +
          formatReceptor(
            state.receptor
          )
        : "Todos os receptores / alvos";

  }


  function formatReceptor(
    receptor
  ) {

    return receptor
      .replace(
        "alpha",
        "\u03b1"
      )
      .replace(
        "beta",
        "\u03b2"
      );
  }


  function receptorTags(
    drug
  ) {

    return drug
      .receptores
      .map(
        function (
          receptor
        ) {

          return `
            <span class="receptor-tag">
              ${escapeHtml(
                formatReceptor(
                  receptor
                )
              )}
            </span>
          `;

        }
      ).join("");

  }


  function renderCards() {

    const list =
      filteredDrugs();


    $("resultCount")
      .textContent =
      list.length +
      (
        list.length === 1
          ? " resultado"
          : " resultados"
      );


    $("emptyState")
      .classList.toggle(
        "hidden",
        list.length !== 0
      );


    $("drugGrid")
      .innerHTML =
      list.map(
        function (
          drug
        ) {

          const favorite =
            state.favorites.has(
              drug.id
            );

          const reviewed =
            state.reviewed.has(
              drug.id
            );

          const selected =
            state.compare.has(
              drug.id
            );


          return `
            <article
              class="drug-card"
              data-drug="${escapeHtml(drug.id)}"
              tabindex="0"
            >

              <div class="drug-card-top">

                <div>

                  <span class="drug-group">
                    ${escapeHtml(drug.grupo)}
                  </span>

                  <h3>
                    ${escapeHtml(drug.nome)}
                  </h3>

                  <p class="drug-class">
                    ${escapeHtml(drug.classe)}
                  </p>

                  <p class="drug-active">
                    <strong>Princípio ativo:</strong>
                    ${escapeHtml(drug.principioAtivo || drug.nome)}
                  </p>

                </div>

                <button
                  type="button"
                  class="favorite-button ${favorite ? "active" : ""}"
                  data-favorite="${escapeHtml(drug.id)}"
                  title="Favoritar"
                >
                  ${favorite ? "★" : "☆"}
                </button>

              </div>


              <div class="drug-action">
                ${escapeHtml(drug.acao)}
              </div>


              <div class="receptor-tags">
                ${receptorTags(drug)}
              </div>


              ${
                state.studyMode
                  ? `
                    <div class="memory-mask">
                      <span>
                        Tente lembrar o mecanismo antes de abrir.
                      </span>
                    </div>
                  `
                  : `
                    <p class="drug-mechanism">
                      ${escapeHtml(drug.mecanismo)}
                    </p>
                  `
              }


              <div class="drug-card-footer">

                <span class="review-status ${reviewed ? "done" : ""}">
                  ${
                    reviewed
                      ? "✓ Revisado"
                      : "Não revisado"
                  }
                </span>

                <button
                  type="button"
                  class="compare-toggle ${selected ? "active" : ""}"
                  data-compare="${escapeHtml(drug.id)}"
                >
                  ${
                    selected
                      ? "Remover"
                      : "Comparar"
                  }
                </button>

              </div>

            </article>
          `;

        }
      ).join("");


    renderStats();

  }


  function renderStats() {

    $("drugTotal")
      .textContent =
      drugs.length;

    $("reviewedTotal")
      .textContent =
      state.reviewed.size;

    $("favoriteTotal")
      .textContent =
      state.favorites.size;


    $("studyModeButton")
      .classList.toggle(
        "active",
        state.studyMode
      );


    $("favoritesButton")
      .classList.toggle(
        "active",
        state.favoritesOnly
      );

  }


  function findDrug(
    id
  ) {

    return drugs.find(
      function (
        drug
      ) {

        return drug.id ===
          id;

      }
    );
  }


  function renderList(
    title,
    items
  ) {

    return `
      <section class="modal-info-section">

        <h3>
          ${escapeHtml(title)}
        </h3>

        <ul>
          ${(items || [])
            .map(
              function (
                item
              ) {

                return `
                  <li>
                    ${escapeHtml(item)}
                  </li>
                `;

              }
            )
            .join("")}
        </ul>

      </section>
    `;

  }


  function openDrug(
    id
  ) {

    const drug =
      findDrug(
        id
      );


    if (!drug) {
      return;
    }


    const reviewed =
      state.reviewed.has(
        id
      );

    const favorite =
      state.favorites.has(
        id
      );


    $("drugModalContent")
      .innerHTML = `

        <div class="modal-drug-header">

          <div>

            <span class="drug-group">
              ${escapeHtml(drug.grupo)}
            </span>

            <h2>
              ${escapeHtml(drug.nome)}
            </h2>

            <p>
              ${escapeHtml(drug.classe)}
              ·
              ${escapeHtml(drug.acao)}
            </p>

          </div>

          <div class="modal-header-actions">

            <button
              type="button"
              data-modal-favorite="${escapeHtml(id)}"
              class="${favorite ? "active" : ""}"
            >
              ${favorite ? "★ Favorito" : "☆ Favoritar"}
            </button>

            <button
              type="button"
              data-modal-reviewed="${escapeHtml(id)}"
              class="${reviewed ? "active" : ""}"
            >
              ${reviewed ? "✓ Revisado" : "Marcar revisado"}
            </button>

          </div>

        </div>


        <section class="modal-info-section active-principle-section">

          <h3>
            Princípio ativo
          </h3>

          <p>
            ${escapeHtml(drug.principioAtivo || drug.nome)}
          </p>

          ${drug.fonte ? `
            <small class="drug-source">
              Fonte de estudo: ${escapeHtml(drug.fonte)}
            </small>
          ` : ""}

        </section>


        <section class="modal-info-section">

          <h3>
            Receptores / alvos
          </h3>

          <div class="receptor-tags large">
            ${receptorTags(drug)}
          </div>

        </section>


        <section class="modal-info-section mechanism-section">

          <h3>
            Mecanismo de ação
          </h3>

          ${
            state.studyMode
              ? `
                <div
                  class="study-reveal"
                  id="studyReveal"
                >

                  <p>
                    Antes de revelar: qual receptor ou alvo farmacológico está relacionado a este fármaco?
                  </p>

                  <button
                    type="button"
                    id="revealMechanism"
                  >
                    Revelar mecanismo
                  </button>

                </div>

                <p
                  id="hiddenMechanism"
                  class="hidden"
                >
                  ${escapeHtml(drug.mecanismo)}
                </p>
              `
              : `
                <p>
                  ${escapeHtml(drug.mecanismo)}
                </p>
              `
          }

        </section>


        ${renderList(
          "Efeitos fisiológicos",
          drug.efeitos
        )}

        ${renderList(
          "Usos importantes",
          drug.usos
        )}

        ${renderList(
          "Efeitos adversos",
          drug.adversos
        )}

        ${renderList(
          "Contraindicações / alertas-chave",
          drug.alertas
        )}


        <section class="exam-tip">

          <span>
            Para lembrar
          </span>

          <strong>
            ${escapeHtml(drug.dica)}
          </strong>

        </section>

      `;


    $("drugModal")
      .classList.remove(
        "hidden"
      );


    document.body
      .classList.add(
        "modal-open"
      );

  }


  function closeDrug() {

    $("drugModal")
      .classList.add(
        "hidden"
      );

    document.body
      .classList.remove(
        "modal-open"
      );

  }


  function toggleFavorite(
    id
  ) {

    if (
      state.favorites.has(
        id
      )
    ) {

      state.favorites.delete(
        id
      );

    }
    else {

      state.favorites.add(
        id
      );

    }


    saveSet(
      STORAGE_FAVORITES,
      state.favorites
    );


    renderCards();


    if (
      !$("drugModal")
        .classList
        .contains(
          "hidden"
        )
    ) {

      openDrug(
        id
      );

    }

  }


  function toggleReviewed(
    id
  ) {

    if (
      state.reviewed.has(
        id
      )
    ) {

      state.reviewed.delete(
        id
      );

    }
    else {

      state.reviewed.add(
        id
      );

    }


    saveSet(
      STORAGE_REVIEWED,
      state.reviewed
    );


    renderCards();

    openDrug(
      id
    );

  }


  function toggleCompare(
    id
  ) {

    if (
      state.compare.has(
        id
      )
    ) {

      state.compare.delete(
        id
      );

    }
    else {

      if (
        state.compare.size >=
        3
      ) {

        alert(
          "Escolha no máximo 3 fármacos para comparar."
        );

        return;

      }

      state.compare.add(
        id
      );

    }


    renderCompareDock();

    renderCards();

  }


  function renderCompareDock() {

    const ids =
      Array.from(
        state.compare
      );


    $("compareDock")
      .classList.toggle(
        "hidden",
        ids.length === 0
      );


    $("compareCount")
      .textContent =
      ids.length +
      " / 3";


    $("compareNames")
      .innerHTML =
      ids.map(
        function (
          id
        ) {

          const drug =
            findDrug(
              id
            );


          return drug
            ? `
              <span>
                ${escapeHtml(drug.nome)}
              </span>
            `
            : "";

        }
      ).join("");


    $("openCompare")
      .disabled =
      ids.length <
      2;

  }


  function comparisonCell(
    drug,
    field
  ) {

    if (!drug) {
      return "";
    }


    if (
      Array.isArray(
        drug[field]
      )
    ) {

      return drug[field]
        .map(
          escapeHtml
        )
        .join(
          "<br>"
        );

    }


    return escapeHtml(
      drug[field]
    );

  }


  function openCompare() {

    const selected =
      Array.from(
        state.compare
      )
        .map(
          findDrug
        )
        .filter(Boolean);


    if (
      selected.length <
      2
    ) {

      return;

    }


    const fields = [

      [
        "Classe",
        "classe"
      ],

      [
        "Ação",
        "acao"
      ],

      [
        "Princípio ativo",
        "principioAtivo"
      ],

      [
        "Receptores / alvos",
        "receptores"
      ],

      [
        "Mecanismo",
        "mecanismo"
      ],

      [
        "Efeitos fisiológicos",
        "efeitos"
      ],

      [
        "Usos",
        "usos"
      ],

      [
        "Efeitos adversos",
        "adversos"
      ],

      [
        "Contraindicações / alertas",
        "alertas"
      ],

    ];


    $("compareModalContent")
      .innerHTML = `

        <div class="compare-header">

          <span>
            Cortex Compare
          </span>

          <h2>
            Comparação farmacológica
          </h2>

          <p>
            Compare princípio ativo, receptor/alvo, mecanismo e efeitos lado a lado.
          </p>

        </div>


        <div class="compare-table-wrap">

          <table class="compare-table">

            <thead>

              <tr>

                <th>
                  Característica
                </th>

                ${selected
                  .map(
                    function (
                      drug
                    ) {

                      return `
                        <th>
                          ${escapeHtml(drug.nome)}
                        </th>
                      `;

                    }
                  )
                  .join("")}

              </tr>

            </thead>

            <tbody>

              ${fields
                .map(
                  function (
                    field
                  ) {

                    return `
                      <tr>

                        <th>
                          ${field[0]}
                        </th>

                        ${selected
                          .map(
                            function (
                              drug
                            ) {

                              return `
                                <td>
                                  ${comparisonCell(
                                    drug,
                                    field[1]
                                  )}
                                </td>
                              `;

                            }
                          )
                          .join("")}

                      </tr>
                    `;

                  }
                )
                .join("")}

            </tbody>

          </table>

        </div>

      `;


    $("compareModal")
      .classList.remove(
        "hidden"
      );

    document.body
      .classList.add(
        "modal-open"
      );

  }


  function closeCompare() {

    $("compareModal")
      .classList.add(
        "hidden"
      );

    document.body
      .classList.remove(
        "modal-open"
      );

  }


  function shuffle(
    values
  ) {

    return values
      .slice()
      .sort(
        function () {

          return (
            Math.random() -
            .5
          );

        }
      );
  }


  function generateQuestion() {

    const drug =
      drugs[
        Math.floor(
          Math.random() *
          drugs.length
        )
      ];


    const types = [
      "acao",
      "receptor",
      "classe",
    ];


    const type =
      types[
        Math.floor(
          Math.random() *
          types.length
        )
      ];


    if (
      type ===
      "acao"
    ) {

      const answer =
        drug.acao;

      const options =
        shuffle(
          unique(
            drugs.map(
              function (
                item
              ) {

                return item.acao;

              }
            )
          )
            .filter(
              function (
                item
              ) {

                return item !==
                  answer;

              }
            )
            .slice(
              0,
              3
            )
            .concat(
              answer
            )
        );


      return {
        drug,
        question:
          "Como " +
          drug.nome +
          " é classificado quanto ao tipo de ação?",
        answer,
        options,
      };

    }


    if (
      type ===
      "classe"
    ) {

      const answer =
        drug.classe;

      const alternatives =
        shuffle(
          unique(
            drugs.map(
              function (
                item
              ) {

                return item.classe;

              }
            )
          )
            .filter(
              function (
                item
              ) {

                return item !==
                  answer;

              }
            )
        )
          .slice(
            0,
            3
          );


      return {
        drug,
        question:
          "Qual é a classe farmacológica de " +
          drug.nome +
          "?",
        answer,
        options:
          shuffle(
            alternatives.concat(
              answer
            )
          ),
      };

    }


    const answer =
      drug.receptores[
        Math.floor(
          Math.random() *
          drug.receptores.length
        )
      ];


    const alternatives =
      shuffle(
        Object.keys(
          receptors
        )
          .filter(
            function (
              item
            ) {

              return !drug
                .receptores
                .includes(
                  item
                );

            }
          )
      )
        .slice(
          0,
          3
        );


    return {
      drug,
      question:
        "Qual destes receptores ou alvos está relacionado à ação de " +
        drug.nome +
        "?",
      answer,
      options:
        shuffle(
          alternatives.concat(
            answer
          )
        ),
      receptorQuestion:
        true,
    };

  }


  function openQuiz() {

    state.quiz = {
      score: 0,
      total: 0,
      answered: false,
      question:
        generateQuestion(),
    };


    renderQuiz();


    $("quizModal")
      .classList.remove(
        "hidden"
      );


    document.body
      .classList.add(
        "modal-open"
      );

  }


  function renderQuiz() {

    const quiz =
      state.quiz;


    if (!quiz) {
      return;
    }


    const question =
      quiz.question;


    $("quizContent")
      .innerHTML = `

        <div class="quiz-header">

          <span>
            Quiz farmacológico
          </span>

          <strong>
            ${quiz.score} / ${quiz.total}
          </strong>

        </div>


        <div class="quiz-drug">
          ${escapeHtml(
            question.drug.grupo
          )}
        </div>


        <h2>
          ${escapeHtml(
            question.question
          )}
        </h2>


        <div class="quiz-options">

          ${question
            .options
            .map(
              function (
                option
              ) {

                const label =
                  question
                    .receptorQuestion
                    ? formatReceptor(
                        option
                      )
                    : option;


                return `
                  <button
                    type="button"
                    data-quiz-answer="${escapeHtml(option)}"
                  >
                    ${escapeHtml(label)}
                  </button>
                `;

              }
            )
            .join("")}

        </div>


        <div
          id="quizFeedback"
          class="quiz-feedback hidden"
        ></div>


        <button
          id="nextQuestion"
          class="next-question hidden"
          type="button"
        >
          Próxima pergunta
        </button>

      `;

  }


  function answerQuiz(
    answer
  ) {

    const quiz =
      state.quiz;


    if (
      !quiz ||
      quiz.answered
    ) {

      return;

    }


    quiz.answered =
      true;

    quiz.total++;


    const correct =
      answer ===
      quiz.question.answer;


    if (correct) {

      quiz.score++;

    }


    const buttons =
      $("quizContent")
        .querySelectorAll(
          "[data-quiz-answer]"
        );


    buttons.forEach(
      function (
        button
      ) {

        const value =
          button.getAttribute(
            "data-quiz-answer"
          );


        button.disabled =
          true;


        if (
          value ===
          quiz.question.answer
        ) {

          button.classList.add(
            "correct"
          );

        }
        else if (
          value ===
          answer
        ) {

          button.classList.add(
            "wrong"
          );

        }

      }
    );


    const feedback =
      $("quizFeedback");


    feedback.classList
      .remove(
        "hidden"
      );


    feedback.innerHTML =
      correct
        ? `
          <strong>Correto.</strong>
          ${escapeHtml(
            quiz.question.drug.dica
          )}
        `
        : `
          <strong>Resposta incorreta.</strong>
          ${escapeHtml(
            quiz.question.drug.dica
          )}
        `;


    $("nextQuestion")
      .classList.remove(
        "hidden"
      );

  }


  function nextQuestion() {

    if (!state.quiz) {
      return;
    }


    state.quiz.question =
      generateQuestion();

    state.quiz.answered =
      false;


    renderQuiz();

  }


  function closeQuiz() {

    $("quizModal")
      .classList.add(
        "hidden"
      );

    document.body
      .classList.remove(
        "modal-open"
      );

  }


  function clearFilters() {

    state.search = "";
    state.group = "Todos";
    state.action = "Todas";
    state.receptor = null;
    state.favoritesOnly = false;

    $("drugSearch").value =
      "";

    render();

  }


  function render() {

    renderFilters();
    renderReceptors();
    renderCards();
    renderCompareDock();

  }


  async function loadUser() {

    try {

      const response =
        await fetch(
          "/api/auth/me",
          {
            credentials:
              "same-origin",
          }
        );


      if (!response.ok) {
        return;
      }


      const data =
        await response.json();


      const user =
        data.usuario ||
        data.user ||
        data;


      const name =
        user.nome ||
        user.name ||
        "Usuário";


      const email =
        user.email ||
        "";


      const initial =
        String(name)
          .trim()
          .charAt(0)
          .toUpperCase() ||
        "U";


      if ($("nomeSidebar")) {
        $("nomeSidebar")
          .textContent =
          name;
      }


      if ($("nomeHeader")) {
        $("nomeHeader")
          .textContent =
          name;
      }


      if ($("emailSidebar")) {
        $("emailSidebar")
          .textContent =
          email;
      }


      if ($("avatarSidebar")) {
        $("avatarSidebar")
          .textContent =
          initial;
      }


      if ($("avatarHeader")) {
        $("avatarHeader")
          .textContent =
          initial;
      }

    }
    catch (
      error
    ) {

      console.error(
        error
      );

    }

  }


  async function logout() {

    await fetch(
      "/api/auth/logout",
      {
        method:
          "POST",

        credentials:
          "same-origin",
      }
    )
      .catch(
        function () {}
      );


    if (
      window.top &&
      window.top !==
      window
    ) {

      window.top.location.href =
        "/login.html";

    }
    else {

      window.location.href =
        "/login.html";

    }

  }


  $("drugSearch")
    .addEventListener(
      "input",
      function (
        event
      ) {

        state.search =
          event.target.value;

        renderCards();

      }
    );


  $("groupFilters")
    .addEventListener(
      "click",
      function (
        event
      ) {

        const button =
          event.target.closest(
            "[data-group]"
          );


        if (!button) {
          return;
        }


        state.group =
          button.getAttribute(
            "data-group"
          );


        render();

      }
    );


  $("actionFilters")
    .addEventListener(
      "click",
      function (
        event
      ) {

        const button =
          event.target.closest(
            "[data-action]"
          );


        if (!button) {
          return;
        }


        state.action =
          button.getAttribute(
            "data-action"
          );


        render();

      }
    );


  $("receptorMap")
    .addEventListener(
      "click",
      function (
        event
      ) {

        const button =
          event.target.closest(
            "[data-receptor]"
          );


        if (!button) {
          return;
        }


        const receptor =
          button.getAttribute(
            "data-receptor"
          );


        state.receptor =
          state.receptor ===
            receptor
            ? null
            : receptor;


        render();

      }
    );


  $("drugGrid")
    .addEventListener(
      "click",
      function (
        event
      ) {

        const favorite =
          event.target.closest(
            "[data-favorite]"
          );


        if (favorite) {

          event.stopPropagation();

          toggleFavorite(
            favorite.getAttribute(
              "data-favorite"
            )
          );

          return;

        }


        const compare =
          event.target.closest(
            "[data-compare]"
          );


        if (compare) {

          event.stopPropagation();

          toggleCompare(
            compare.getAttribute(
              "data-compare"
            )
          );

          return;

        }


        const card =
          event.target.closest(
            "[data-drug]"
          );


        if (card) {

          openDrug(
            card.getAttribute(
              "data-drug"
            )
          );

        }

      }
    );


  $("drugGrid")
    .addEventListener(
      "keydown",
      function (
        event
      ) {

        if (
          event.key !==
            "Enter" &&
          event.key !==
            " "
        ) {

          return;

        }


        const card =
          event.target.closest(
            "[data-drug]"
          );


        if (!card) {
          return;
        }


        event.preventDefault();


        openDrug(
          card.getAttribute(
            "data-drug"
          )
        );

      }
    );


  $("drugModal")
    .addEventListener(
      "click",
      function (
        event
      ) {

        const close =
          event.target.closest(
            "[data-close-modal]"
          );


        if (close) {

          closeDrug();

          return;

        }


        const favorite =
          event.target.closest(
            "[data-modal-favorite]"
          );


        if (favorite) {

          toggleFavorite(
            favorite.getAttribute(
              "data-modal-favorite"
            )
          );

          return;

        }


        const reviewed =
          event.target.closest(
            "[data-modal-reviewed]"
          );


        if (reviewed) {

          toggleReviewed(
            reviewed.getAttribute(
              "data-modal-reviewed"
            )
          );

          return;

        }


        if (
          event.target.id ===
          "revealMechanism"
        ) {

          $("studyReveal")
            .classList.add(
              "hidden"
            );

          $("hiddenMechanism")
            .classList.remove(
              "hidden"
            );

        }

      }
    );


  $("compareModal")
    .addEventListener(
      "click",
      function (
        event
      ) {

        if (
          event.target.closest(
            "[data-close-compare]"
          )
        ) {

          closeCompare();

        }

      }
    );


  $("quizModal")
    .addEventListener(
      "click",
      function (
        event
      ) {

        if (
          event.target.closest(
            "[data-close-quiz]"
          )
        ) {

          closeQuiz();

          return;

        }


        const answer =
          event.target.closest(
            "[data-quiz-answer]"
          );


        if (answer) {

          answerQuiz(
            answer.getAttribute(
              "data-quiz-answer"
            )
          );

          return;

        }


        if (
          event.target.id ===
          "nextQuestion"
        ) {

          nextQuestion();

        }

      }
    );


  $("studyModeButton")
    .addEventListener(
      "click",
      function () {

        state.studyMode =
          !state.studyMode;

        render();

      }
    );


  $("favoritesButton")
    .addEventListener(
      "click",
      function () {

        state.favoritesOnly =
          !state.favoritesOnly;

        render();

      }
    );


  $("quizButton")
    .addEventListener(
      "click",
      openQuiz
    );


  $("clearFilters")
    .addEventListener(
      "click",
      clearFilters
    );


  $("openCompare")
    .addEventListener(
      "click",
      openCompare
    );


  $("logoutSidebar")
    .addEventListener(
      "click",
      logout
    );


  document
    .addEventListener(
      "keydown",
      function (
        event
      ) {

        if (
          event.key !==
          "Escape"
        ) {

          return;

        }


        closeDrug();
        closeCompare();
        closeQuiz();

      }
    );


  render();

  loadUser();


  /* CORTEX PHARMA NAVIGATION V3 */


  function scrollToCatalog(
    options
  ) {

    const settings =
      options ||
      {};


    const target =
      document.getElementById(
        "catalogAnchor"
      ) ||
      document.getElementById(
        "catalogSearchBar"
      ) ||
      document.getElementById(
        "drugGrid"
      );


    if (!target) {
      return;
    }


    const reduceMotion =
      window.matchMedia &&
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;


    const delay =
      Number(
        settings.delay ||
        0
      );


    window.setTimeout(
      function () {

        const rect =
          target.getBoundingClientRect();


        const current =
          window.scrollY ||
          document.documentElement.scrollTop ||
          0;


        const offset =
          88;


        const destination =
          Math.max(
            0,
            current +
            rect.top -
            offset
          );


        window.scrollTo({
          top:
            destination,

          behavior:
            reduceMotion
              ? "auto"
              : "smooth",
        });

      },
      delay
    );

  }


  function updateCatalogSummary() {

    const output =
      document.getElementById(
        "catalogFilterSummary"
      );


    if (!output) {
      return;
    }


    const parts = [];


    if (
      state.group &&
      state.group !==
      "Todos"
    ) {

      parts.push(
        state.group
      );

    }


    if (
      state.action &&
      state.action !==
      "Todas"
    ) {

      parts.push(
        state.action
      );

    }


    if (
      state.receptor
    ) {

      parts.push(
        formatReceptor(
          state.receptor
        )
      );

    }


    if (
      state.favoritesOnly
    ) {

      parts.push(
        "Favoritos"
      );

    }


    if (
      state.search &&
      state.search.trim()
    ) {

      parts.push(
        'Busca: "' +
        state.search.trim() +
        '"'
      );

    }


    output.textContent =
      parts.length
        ? parts.join(" · ")
        : "Todos os fármacos";

  }


  function updateSearchControls() {

    const input =
      document.getElementById(
        "drugSearch"
      );


    const clear =
      document.getElementById(
        "clearSearchButton"
      );


    if (
      input &&
      input.value !==
      state.search
    ) {

      input.value =
        state.search;

    }


    if (clear) {

      clear.classList.toggle(
        "hidden",
        !state.search
      );

    }


    updateCatalogSummary();

  }


  /*
   * Observa mudancas produzidas pelos filtros que
   * ja existem no modulo.
   *
   * A captura acontece antes dos listeners originais,
   * e a rolagem e executada depois que os cards forem
   * redesenhados.
   */

  document.addEventListener(
    "click",
    function (event) {

      const filter =
        event.target.closest(
          [
            "[data-group]",
            "[data-action]",
            "[data-receptor]",
            "#favoritesButton",
            "#studyModeButton",
          ].join(",")
        );


      if (!filter) {
        return;
      }


      window.setTimeout(
        function () {

          updateSearchControls();


          scrollToCatalog({
            delay:
              20,
          });

        },
        30
      );

    },
    true
  );


  const catalogInput =
    document.getElementById(
      "drugSearch"
    );


  if (catalogInput) {

    catalogInput.addEventListener(
      "input",
      function () {

        window.setTimeout(
          updateSearchControls,
          0
        );

      }
    );

  }


  const clearSearch =
    document.getElementById(
      "clearSearchButton"
    );


  if (clearSearch) {

    clearSearch.addEventListener(
      "click",
      function () {

        state.search =
          "";


        const input =
          document.getElementById(
            "drugSearch"
          );


        if (input) {

          input.value =
            "";

          input.focus();

        }


        renderCards();

        updateSearchControls();

      }
    );

  }


  const clearAll =
    document.getElementById(
      "clearFilters"
    );


  if (clearAll) {

    clearAll.addEventListener(
      "click",
      function () {

        window.setTimeout(
          function () {

            updateSearchControls();

            scrollToCatalog();

          },
          30
        );

      },
      true
    );

  }


  updateSearchControls();

})();