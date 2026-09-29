const $ = function (id) {
  return document.getElementById(id);
};


function escapeHtml(value) {

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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


  if (!response.ok) {

    throw new Error(
      data.error ||
      "Erro ao carregar dados."
    );
  }


  return data;
}


function percentClass(
  value
) {

  if (value >= 80) {
    return "good";
  }


  if (value < 60) {
    return "low";
  }


  return "";
}


function width(
  value
) {

  return (
    Math.max(
      0,
      Math.min(
        100,
        Number(value) || 0
      )
    ) +
    "%"
  );
}


function formatDate(
  value
) {

  try {

    return new Date(
      value
    )
      .toLocaleString(
        "pt-BR",
        {
          dateStyle:
            "short",

          timeStyle:
            "short",
        }
      );

  }
  catch {

    return "";
  }
}


async function loadUser() {

  const data =
    await api(
      "/api/auth/me"
    );


  const user =
    data.usuario ||
    data;


  const name =
    user.nome ||
    "Usuario";


  const initial =
    name
      .charAt(0)
      .toUpperCase();


  $("nomeSidebar")
    .textContent =
    name;


  $("emailSidebar")
    .textContent =
    user.email || "";


  $("nomeHeader")
    .textContent =
    name;


  $("avatarSidebar")
    .textContent =
    initial;


  $("avatarHeader")
    .textContent =
    initial;
}


function renderSummary(
  data
) {

  $("summaryCards")
    .innerHTML =
    `
      <div class="summary-card">

        <span class="summary-label">
          Questoes
        </span>

        <strong class="summary-value">
          ${data.total}
        </strong>

        <span class="summary-subtitle">
          respondidas
        </span>

      </div>


      <div class="summary-card">

        <span class="summary-label">
          Acertos
        </span>

        <strong class="summary-value success">
          ${data.acertos}
        </strong>

        <span class="summary-subtitle">
          respostas corretas
        </span>

      </div>


      <div class="summary-card">

        <span class="summary-label">
          Erros
        </span>

        <strong class="summary-value error">
          ${data.erros}
        </strong>

        <span class="summary-subtitle">
          respostas incorretas
        </span>

      </div>


      <div class="summary-card">

        <span class="summary-label">
          Aproveitamento
        </span>

        <strong class="summary-value orange">
          ${data.percentual}%
        </strong>

        <span class="summary-subtitle">
          taxa geral de acerto
        </span>

      </div>
    `;


  $("percentualGeral")
    .textContent =
    data.percentual +
    "%";


  $("percentualGeral")
    .className =
    percentClass(
      data.percentual
    );


  $("barraGeral")
    .style.width =
    width(
      data.percentual
    );


  $("barraGeral")
    .className =
    "progress-value " +
    percentClass(
      data.percentual
    );
}


function renderDisciplines(
  items
) {

  if (!items.length) {

    $("disciplinas")
      .innerHTML =
      `
        <div class="empty-state">
          Voce ainda nao respondeu questoes.
        </div>
      `;

    return;
  }


  $("disciplinas")
    .innerHTML =
    items
      .map(
        function (item) {

          return `
            <div class="discipline-item">

              <div class="item-heading">

                <div>

                  <strong>
                    ${escapeHtml(
                      item.disciplina
                    )}
                  </strong>

                  <small>
                    ${item.acertos} acertos
                    &middot;
                    ${item.erros} erros
                    &middot;
                    ${item.total} questoes
                  </small>

                </div>


                <span class="percent ${percentClass(
                  item.percentual
                )}">
                  ${item.percentual}%
                </span>

              </div>


              <div class="progress">

                <div
                  class="progress-value ${percentClass(
                    item.percentual
                  )}"
                  style="width:${width(
                    item.percentual
                  )}"
                ></div>

              </div>

            </div>
          `;
        }
      )
      .join("");
}


function renderThemes(
  items
) {

  if (!items.length) {

    $("temas")
      .innerHTML =
      `
        <div class="empty-state">
          Voce ainda nao respondeu questoes.
        </div>
      `;

    return;
  }


  $("temas")
    .innerHTML =
    items
      .map(
        function (item) {

          return `
            <div class="theme-item">

              <div class="item-heading">

                <div>

                  <strong>
                    ${escapeHtml(
                      item.tema
                    )}
                  </strong>

                  <small>
                    ${item.total} questoes
                    &middot;
                    ${item.acertos} acertos
                    &middot;
                    ${item.erros} erros
                  </small>

                </div>


                <span class="percent ${percentClass(
                  item.percentual
                )}">
                  ${item.percentual}%
                </span>

              </div>


              <div class="progress">

                <div
                  class="progress-value ${percentClass(
                    item.percentual
                  )}"
                  style="width:${width(
                    item.percentual
                  )}"
                ></div>

              </div>

            </div>
          `;
        }
      )
      .join("");
}


function renderHistory(
  items
) {

  if (!items.length) {

    $("historico")
      .innerHTML =
      `
        <div class="empty-state">
          Nenhuma resposta registrada ainda.
        </div>
      `;

    return;
  }


  $("historico")
    .innerHTML =
    items
      .map(
        function (item) {

          return `
            <div class="history-item">

              <div class="result-icon ${
                item.correta
                  ? "correct"
                  : "wrong"
              }">

                ${
                  item.correta
                    ? "\u2713"
                    : "\u00d7"
                }

              </div>


              <div class="history-content">

                <p class="history-question">
                  ${escapeHtml(
                    item.questao
                  )}
                </p>


                <div class="history-meta">

                  <span class="meta-badge">
                    ${escapeHtml(
                      item.disciplina
                    )}
                  </span>

                  <span class="meta-badge">
                    ${escapeHtml(
                      item.tema
                    )}
                  </span>

                  <span class="meta-badge">
                    ${
                      item.correta
                        ? "Acertou"
                        : "Errou"
                    }
                  </span>

                </div>


                <span class="history-date">
                  ${escapeHtml(
                    formatDate(
                      item.respondidaAt
                    )
                  )}
                </span>

              </div>

            </div>
          `;
        }
      )
      .join("");
}


async function loadPerformance() {

  $("loading")
    .classList.remove(
      "hidden"
    );


  $("erro")
    .classList.add(
      "hidden"
    );


  $("conteudo")
    .classList.add(
      "hidden"
    );


  try {

    const data =
      await api(
        "/api/desempenho"
      );


    renderSummary(
      data.resumo
    );


    renderDisciplines(
      data.disciplinas ||
      []
    );


    renderThemes(
      data.temas ||
      []
    );


    renderHistory(
      data.ultimasRespostas ||
      []
    );


    $("loading")
      .classList.add(
        "hidden"
      );


    $("conteudo")
      .classList.remove(
        "hidden"
      );

  }
  catch (error) {

    console.error(
      error
    );


    $("loading")
      .classList.add(
        "hidden"
      );


    $("erro")
      .classList.remove(
        "hidden"
      );


    $("erroTexto")
      .textContent =
      error.message ||
      "Nao foi possivel carregar os dados.";
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


$("atualizarTopo")
  .addEventListener(
    "click",
    loadPerformance
  );


$("atualizarRodape")
  .addEventListener(
    "click",
    loadPerformance
  );


$("tentarNovamente")
  .addEventListener(
    "click",
    loadPerformance
  );


$("logoutSidebar")
  .addEventListener(
    "click",
    logout
  );


async function start() {

  try {

    await loadUser();

    await loadPerformance();

  }
  catch (error) {

    console.error(
      error
    );
  }
}


start();