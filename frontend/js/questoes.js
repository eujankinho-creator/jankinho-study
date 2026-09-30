const state = {
  questoes: [],
  disciplinas: [],
  filtradas: [],
  sessao: [],
  indice: 0,
  selecionada: null,
  respondida: false,
  pontuacao: 0,
  corretaAtual: false,
  eliminadas: new Set(),
  alternativasManual: [
    { texto: "", correta: false },
    { texto: "", correta: false },
    { texto: "", correta: false },
    { texto: "", correta: false },
    { texto: "", correta: false }
  ]
};


const $ = function (id) {
  return document.getElementById(id);
};


function t(texto) {
  return String(texto ?? "");
}


function escapeHtml(texto) {

  const div =
    document.createElement("div");

  div.textContent =
    t(texto);

  return div.innerHTML;
}


function mostrarErro(mensagem) {

  $("erroTexto").textContent =
    mensagem;

  $("erroBox").classList.add(
    "visible"
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function limparErro() {

  $("erroTexto").textContent =
    "";

  $("erroBox").classList.remove(
    "visible"
  );
}


function normalizarDificuldade(valor) {

  const v =
    t(valor)
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );

  if (v === "facil") {
    return "facil";
  }

  if (v === "dificil") {
    return "dificil";
  }

  return "medio";
}


function nomeDificuldade(valor) {

  const v =
    normalizarDificuldade(valor);

  if (v === "facil") {
    return "F\u00e1cil";
  }

  if (v === "dificil") {
    return "Dif\u00edcil";
  }

  return "M\u00e9dio";
}


function badgeDificuldade(valor) {

  const v =
    normalizarDificuldade(valor);

  if (v === "facil") {
    return "badge badge-success";
  }

  if (v === "dificil") {
    return "badge badge-danger";
  }

  return "badge badge-orange";
}


async function api(
  url,
  options
) {

  const resposta =
    await fetch(
      url,
      {
        credentials:
          "same-origin",

        ...options
      }
    );


  if (
    resposta.status === 401
  ) {

    location.href =
      "/login.html";

    throw new Error(
      "Nao autenticado."
    );
  }


  const dados =
    await resposta
      .json()
      .catch(
        function () {
          return {};
        }
      );


  if (!resposta.ok) {

    throw new Error(
      dados.error ||
      "Erro na requisicao."
    );
  }


  return dados;
}


async function carregarUsuario() {

  const dados =
    await api(
      "/api/auth/me"
    );


  const usuario =
    dados.usuario;


  const nome =
    usuario.nome ||
    "Usuario";


  const inicial =
    nome
      .charAt(0)
      .toUpperCase();


  $("nomeSidebar").textContent =
    nome;

  $("emailSidebar").textContent =
    usuario.email || "";

  $("nomeHeader").textContent =
    nome;

  $("avatarSidebar").textContent =
    inicial;

  $("avatarHeader").textContent =
    inicial;
}


function popularDisciplinas() {

  const select =
    $("filtroDisciplina");


  select.innerHTML =
    '<option value="">' +
    'Todas as disciplinas' +
    '</option>';


  const datalist =
    $("disciplinasLista");


  datalist.innerHTML =
    "";


  /*
   * O banco de questoes e global.
   *
   * Por isso o filtro precisa considerar
   * as disciplinas encontradas nas questoes,
   * alem das disciplinas do usuario.
   *
   * state.disciplinas continua inalterado
   * para nao interferir na criacao manual.
   */
  const mapa =
    new Map();


  function adicionar(nome) {

    const valor =
      t(nome)
        .trim();


    if (!valor) {
      return;
    }


    const chave =
      valor
        .toLocaleLowerCase(
          "pt-BR"
        );


    if (!mapa.has(chave)) {

      mapa.set(
        chave,
        valor
      );

    }

  }


  state.disciplinas.forEach(
    function (disciplina) {

      adicionar(
        disciplina.nome
      );

    }
  );


  state.questoes.forEach(
    function (questao) {

      if (
        questao.disciplina
      ) {

        adicionar(
          questao.disciplina.nome
        );

      }

    }
  );


  const nomes =
    Array.from(
      mapa.values()
    )
      .sort(
        function (a, b) {

          return a.localeCompare(
            b,
            "pt-BR"
          );

        }
      );


  nomes.forEach(
    function (nome) {

      const option =
        document.createElement(
          "option"
        );


      option.value =
        nome;


      option.textContent =
        nome;


      select.appendChild(
        option
      );


      const dataOption =
        document.createElement(
          "option"
        );


      dataOption.value =
        nome;


      datalist.appendChild(
        dataOption
      );

    }
  );


  $("statDisciplinas")
    .textContent =
    nomes.length;

}


async function carregarDados() {

  try {

    limparErro();


    const resultados =
      await Promise.all([
        api("/api/questoes"),
        api("/api/disciplinas")
      ]);


    state.questoes =
      Array.isArray(
        resultados[0]
      )
        ? resultados[0]
        : [];


    state.disciplinas =
      Array.isArray(
        resultados[1]
      )
        ? resultados[1]
        : [];


    popularDisciplinas();

    aplicarFiltros();

  }
  catch (erro) {

    console.error(erro);

    mostrarErro(
      erro.message ||
      "Nao foi possivel carregar as questoes."
    );
  }
}


function aplicarFiltros() {

  const busca =
    $("busca")
      .value
      .trim()
      .toLowerCase();


  const disciplina =
    $("filtroDisciplina")
      .value;


  const dificuldade =
    $("filtroDificuldade")
      .value;


  state.filtradas =
    state.questoes.filter(
      function (questao) {

        const textoBusca =
          [
            questao.enunciado,
            questao.tema,
            questao.disciplina
              ? questao.disciplina.nome
              : ""
          ]
            .join(" ")
            .toLowerCase();


        const bateBusca =
          !busca ||
          textoBusca.includes(
            busca
          );


        const bateDisciplina =
          !disciplina ||
          (
            questao.disciplina &&
            t(
              questao.disciplina.nome
            )
              .trim()
              .toLocaleLowerCase(
                "pt-BR"
              ) ===
            disciplina
              .trim()
              .toLocaleLowerCase(
                "pt-BR"
              )
          );


        const bateDificuldade =
          !dificuldade ||
          normalizarDificuldade(
            questao.dificuldade
          ) ===
          normalizarDificuldade(
            dificuldade
          );


        return (
          bateBusca &&
          bateDisciplina &&
          bateDificuldade
        );

      }
    );


  $("statQuestoes")
    .textContent =
    state.filtradas.length;


  const total =
    state.filtradas.length;


  $("resultadoContagem")
    .textContent =
    total +
    (
      total === 1
        ? " quest\u00e3o encontrada"
        : " quest\u00f5es encontradas"
    );


  const temFiltro =
    Boolean(
      busca ||
      disciplina ||
      dificuldade
    );


  $("limparFiltros")
    .classList.toggle(
      "visible",
      temFiltro
    );


  renderLista();
}


function renderLista() {

  const container =
    $("questoesLista");


  if (
    state.filtradas.length === 0
  ) {

    container.innerHTML =
      '<div class="empty">' +
      'Nenhuma quest\u00e3o encontrada.' +
      '</div>';

    return;
  }


  container.innerHTML =
    state.filtradas
      .map(
        function (questao) {

          const disciplina =
            questao.disciplina
              ? questao.disciplina.nome
              : "Sem disciplina";


          const explicacao =
            questao.explicacao
              ? "Com explica\u00e7\u00e3o"
              : "Sem explica\u00e7\u00e3o";


          const quantidade =
            Array.isArray(
              questao.alternativas
            )
              ? questao.alternativas.length
              : 0;


          return `
            <article class="question-card">

              <div class="question-badges">

                <span class="badge">
                  ${escapeHtml(disciplina)}
                </span>

                <span
                  class="${badgeDificuldade(
                    questao.dificuldade
                  )}"
                >
                  ${nomeDificuldade(
                    questao.dificuldade
                  )}
                </span>

                ${
                  questao.tema
                    ? `
                      <span class="badge">
                        ${escapeHtml(
                          questao.tema
                        )}
                      </span>
                    `
                    : ""
                }

              </div>


              <h3>
                ${escapeHtml(
                  questao.enunciado
                )}
              </h3>


              <div class="question-bottom">

                <div class="question-meta">

                  <span>
                    ${quantidade} alternativas
                  </span>

                  <span>
                    &bull;
                  </span>

                  <span>
                    ${explicacao}
                  </span>

                </div>


                <button
                  class="answer-question"
                  type="button"
                  data-id="${questao.id}"
                >
                  Responder quest\u00e3o \u2192
                </button>

              </div>

            </article>
          `;

        }
      )
      .join("");


  document
    .querySelectorAll(
      ".answer-question"
    )
    .forEach(
      function (botao) {

        botao.addEventListener(
          "click",
          function () {

            const id =
              Number(
                botao.dataset.id
              );


            const questao =
              state.questoes.find(
                function (item) {
                  return (
                    item.id === id
                  );
                }
              );


            if (questao) {

              iniciarComQuestoes([
                questao
              ]);

            }
          }
        );
      }
    );
}


function embaralhar(array) {

  const copia =
    [...array];


  for (
    let i =
      copia.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );


    const temp =
      copia[i];

    copia[i] =
      copia[j];

    copia[j] =
      temp;
  }


  return copia;
}


function iniciarComQuestoes(
  questoes
) {

  state.sessao =
    questoes.map(
      function (questao) {

        return {
          ...questao,

          alternativas:
            embaralhar(
              Array.isArray(
                questao.alternativas
              )
                ? questao.alternativas
                : []
            )
        };

      }
    );


  state.indice = 0;
  state.selecionada = null;
  state.respondida = false;
  state.pontuacao = 0;
  state.eliminadas =
    new Set();


  $("bancoView")
    .classList.add(
      "hidden"
    );


  $("sessaoView")
    .classList.remove(
      "hidden"
    );


  renderSessao();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function iniciarSessao() {

  if (
    state.filtradas.length === 0
  ) {

    mostrarErro(
      "Nao ha questoes disponiveis para iniciar uma sessao."
    );

    return;
  }


  const quantidade =
    Math.min(
      10,
      state.filtradas.length
    );


  iniciarComQuestoes(
    embaralhar(
      state.filtradas
    ).slice(
      0,
      quantidade
    )
  );
}


function sairSessao() {

  state.sessao = [];
  state.indice = 0;
  state.selecionada = null;
  state.respondida = false;
  state.pontuacao = 0;
  state.eliminadas =
    new Set();


  $("sessaoView")
    .classList.add(
      "hidden"
    );


  $("bancoView")
    .classList.remove(
      "hidden"
    );


  carregarDados();
}


function renderSessao() {

  if (
    state.indice >=
    state.sessao.length
  ) {

    renderResultado();

    return;
  }


  const questao =
    state.sessao[
      state.indice
    ];


  const total =
    state.sessao.length;


  const progresso =
    Math.round(
      (
        (
          state.indice + 1
        ) /
        total
      ) *
      100
    );


  const alternativas =
    questao.alternativas || [];


  const indiceCorreta =
    alternativas.findIndex(
      function (alt) {
        return alt.correta;
      }
    );


  let opcoes = "";


  alternativas.forEach(
    function (
      alternativa,
      indice
    ) {

      let classe =
        "session-option";


      const eliminada =
        !state.respondida &&
        state.eliminadas.has(
          indice
        );


      if (
        eliminada
      ) {
        classe +=
          " eliminated";
      }


      if (
        state.selecionada ===
        indice
      ) {
        classe +=
          " selected";
      }


      if (
        state.respondida
      ) {

        if (
          indice ===
          indiceCorreta
        ) {
          classe +=
            " correct";
        }
        else if (
          indice ===
          state.selecionada
        ) {
          classe +=
            " wrong";
        }
      }


      let estadoResposta =
        "";


      if (
        state.respondida
      ) {

        if (
          indice ===
          indiceCorreta
        ) {

          estadoResposta =
            '<span class="cortex-answer-state cortex-answer-state-correct">✓ CORRETA</span>';

        }
        else if (
          indice ===
          state.selecionada
        ) {

          estadoResposta =
            '<span class="cortex-answer-state cortex-answer-state-wrong">✕ ERRADA</span>';

        }

      }


      opcoes += `
        <div
          class="session-option-row ${
            eliminada
              ? "is-eliminated"
              : ""
          }"
        >

          <button
            type="button"
            class="${classe}"
            data-option="${indice}"
            ${
              state.respondida
                ? "disabled"
                : ""
            }
          >

            <span class="option-letter">
              ${String.fromCharCode(
                65 + indice
              )}
            </span>

            <span class="option-text">
              ${escapeHtml(
                alternativa.texto
              )}
            </span>

            ${estadoResposta}

          </button>

          ${
            state.respondida
              ? ""
              : `
                <button
                  type="button"
                  class="eliminate-option ${
                    eliminada
                      ? "active"
                      : ""
                  }"
                  data-cut-option="${indice}"
                  aria-pressed="${
                    eliminada
                      ? "true"
                      : "false"
                  }"
                  title="${
                    eliminada
                      ? "Desfazer eliminação"
                      : "Eliminar alternativa"
                  }"
                >
                  <span aria-hidden="true">
                    ✂
                  </span>
                  <span>
                    ${
                      eliminada
                        ? "Desfazer"
                        : "Cortar"
                    }
                  </span>
                </button>
              `
          }

        </div>
      `;

    }
  );


  const explicacao =
    state.respondida &&
    questao.explicacao
      ? `
        <div class="session-explanation">

          <strong>
            Explica\u00e7\u00e3o
          </strong>

          <p>
            ${escapeHtml(
              questao.explicacao
            )}
          </p>

        </div>
      `
      : "";


  $("sessaoQuestao")
    .innerHTML =
    `
      <div class="session-top">

        <button
          id="sairSessao"
          class="button-secondary"
          type="button"
        >
          \u2190 Sair da sess\u00e3o
        </button>


        <div class="session-count">

          <span>
            Quest\u00e3o
          </span>

          <strong>
            ${state.indice + 1}
            de
            ${total}
          </strong>

        </div>

      </div>


      <div class="session-progress">

        <div
          style="width:${progresso}%"
        ></div>

      </div>


      <section class="session-card">

        <div class="session-question">

          <div class="question-badges">

            <span class="badge">
              ${escapeHtml(
                questao.disciplina
                  ? questao.disciplina.nome
                  : "Sem disciplina"
              )}
            </span>

            <span
              class="${badgeDificuldade(
                questao.dificuldade
              )}"
            >
              ${nomeDificuldade(
                questao.dificuldade
              )}
            </span>

            ${
              questao.tema
                ? `
                  <span class="badge">
                    ${escapeHtml(
                      questao.tema
                    )}
                  </span>
                `
                : ""
            }

          </div>


          <h2>
            ${escapeHtml(
              questao.enunciado
            )}
          </h2>

        </div>


        <div class="session-alternatives">
          ${opcoes}
        </div>


        ${explicacao}


        <div class="session-actions">

          ${
            !state.respondida
              ? `
                <button
                  id="confirmarResposta"
                  class="button-primary"
                  type="button"
                  ${
                    state.selecionada ===
                    null
                      ? "disabled"
                      : ""
                  }
                >
                  Confirmar resposta
                </button>
              `
              : `
                <button
                  id="proximaQuestao"
                  class="button-primary"
                  type="button"
                >
                  ${
                    state.indice >=
                    total - 1
                      ? "Ver resultado"
                      : "Pr\u00f3xima quest\u00e3o \u2192"
                  }
                </button>
              `
          }

        </div>

      </section>
    `;


  $("sairSessao")
    .addEventListener(
      "click",
      sairSessao
    );


  document
    .querySelectorAll(
      ".session-option"
    )
    .forEach(
      function (botao) {

        botao.addEventListener(
          "click",
          function () {

            if (
              state.respondida
            ) {
              return;
            }


            const indice =
              Number(
                botao.dataset.option
              );


            if (
              state.eliminadas.has(
                indice
              )
            ) {
              return;
            }


            state.selecionada =
              indice;


            renderSessao();
          }
        );
      }
    );


  document
    .querySelectorAll(
      "[data-cut-option]"
    )
    .forEach(
      function (
        botao
      ) {

        botao.addEventListener(
          "click",
          function (
            event
          ) {

            event.preventDefault();
            event.stopPropagation();


            if (
              state.respondida
            ) {
              return;
            }


            const indice =
              Number(
                botao.dataset.cutOption
              );


            if (
              state.eliminadas.has(
                indice
              )
            ) {

              state.eliminadas.delete(
                indice
              );

            }
            else {

              state.eliminadas.add(
                indice
              );


              if (
                state.selecionada ===
                indice
              ) {

                state.selecionada =
                  null;

              }

            }


            renderSessao();

          }
        );

      }
    );


  const confirmar =
    $("confirmarResposta");


  if (confirmar) {

    confirmar.addEventListener(
      "click",
      confirmarResposta
    );
  }


  const proxima =
    $("proximaQuestao");


  if (proxima) {

    proxima.addEventListener(
      "click",
      function () {

        state.indice++;
        state.selecionada =
          null;
        state.respondida =
          false;

        state.eliminadas =
          new Set();

        renderSessao();
      }
    );
  }
}


async function confirmarResposta() {

  if (
    state.selecionada ===
    null
  ) {
    return;
  }


  const questao =
    state.sessao[
      state.indice
    ];


  const alternativa =
    questao.alternativas[
      state.selecionada
    ];


  if (!alternativa) {
    return;
  }


  const correta =
    Boolean(
      alternativa.correta
    );


  try {

    await api(
      "/api/respostas",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            questaoId:
              questao.id,

            correta
          })
      }
    );


    if (correta) {
      state.pontuacao++;
    }


    state.respondida =
      true;


    renderSessao();

  }
  catch (erro) {

    mostrarErro(
      erro.message ||
      "Nao foi possivel salvar a resposta."
    );
  }
}


function renderResultado() {

  const total =
    state.sessao.length;


  const erros =
    total -
    state.pontuacao;


  const percentual =
    total > 0
      ? Math.round(
          (
            state.pontuacao /
            total
          ) *
          100
        )
      : 0;


  $("sessaoQuestao")
    .innerHTML =
    `
      <div class="result-card">

        <div class="result-icon">
          ${
            percentual >= 70
              ? "\u2713"
              : "!"
          }
        </div>

        <span class="badge badge-orange">
          Sess\u00e3o conclu\u00edda
        </span>

        <h1>
          Seu resultado
        </h1>

        <p>
          Voc\u00ea respondeu
          ${total}
          quest\u00f5es nesta sess\u00e3o.
        </p>


        <div class="result-stats">

          <div>

            <span>
              Acertos
            </span>

            <strong class="green">
              ${state.pontuacao}
            </strong>

          </div>

          <div>

            <span>
              Erros
            </span>

            <strong class="red">
              ${erros}
            </strong>

          </div>

          <div>

            <span>
              Aproveitamento
            </span>

            <strong class="orange">
              ${percentual}%
            </strong>

          </div>

        </div>


        <div class="result-actions">

          <button
            id="outraSessao"
            class="button-primary"
            type="button"
          >
            Fazer outra sess\u00e3o
          </button>

          <button
            id="voltarBanco"
            class="button-secondary"
            type="button"
          >
            Voltar ao banco
          </button>

        </div>

      </div>
    `;


  $("outraSessao")
    .addEventListener(
      "click",
      function () {

        sairSessao();

        setTimeout(
          iniciarSessao,
          100
        );
      }
    );


  $("voltarBanco")
    .addEventListener(
      "click",
      sairSessao
    );
}


function abrirModal(id) {

  $(id)
    .classList.add(
      "open"
    );
}


function fecharModal(id) {

  $(id)
    .classList.remove(
      "open"
    );
}


async function criarDisciplina() {

  const input =
    $("novaDisciplina");


  const nome =
    input.value.trim();


  if (!nome) {
    return;
  }


  const botao =
    $("criarDisciplina");


  try {

    botao.disabled = true;
    botao.textContent =
      "Criando...";


    const dados =
      await api(
        "/api/disciplinas",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({
              nome
            })
        }
      );


    input.value = "";

    fecharModal(
      "modalDisciplina"
    );


    await carregarDados();


    $("disciplinaIA")
      .value =
      dados.nome || nome;


    $("disciplinaManual")
      .value =
      dados.nome || nome;

  }
  catch (erro) {

    mostrarErro(
      erro.message ||
      "Nao foi possivel criar a disciplina."
    );
  }
  finally {

    botao.disabled = false;
    botao.textContent =
      "Criar disciplina";
  }
}


function renderAlternativasEditor() {

  const container =
    $("alternativasManual");


  container.innerHTML =
    state.alternativasManual
      .map(
        function (
          alternativa,
          indice
        ) {

          return `
            <div class="alternative-editor">

              <button
                type="button"
                class="correct-selector ${
                  alternativa.correta
                    ? "active"
                    : ""
                }"
                data-correct="${indice}"
              >
                ${String.fromCharCode(
                  65 + indice
                )}
              </button>

              <input
                type="text"
                data-alt="${indice}"
                value="${escapeHtml(
                  alternativa.texto
                )}"
                placeholder="Alternativa ${
                  String.fromCharCode(
                    65 + indice
                  )
                }"
              >

            </div>
          `;

        }
      )
      .join("");


  document
    .querySelectorAll(
      "[data-correct]"
    )
    .forEach(
      function (botao) {

        botao.addEventListener(
          "click",
          function () {

            const indice =
              Number(
                botao.dataset.correct
              );


            state.alternativasManual
              .forEach(
                function (
                  item,
                  index
                ) {

                  item.correta =
                    index === indice;
                }
              );


            renderAlternativasEditor();
          }
        );
      }
    );


  document
    .querySelectorAll(
      "[data-alt]"
    )
    .forEach(
      function (input) {

        input.addEventListener(
          "input",
          function () {

            const indice =
              Number(
                input.dataset.alt
              );


            state
              .alternativasManual[
                indice
              ]
              .texto =
              input.value;
          }
        );
      }
    );
}


async function salvarManual() {

  const enunciado =
    $("enunciadoManual")
      .value
      .trim();


  const disciplinaNome =
    $("disciplinaManual")
      .value
      .trim();


  const tema =
    $("temaManual")
      .value
      .trim();


  const explicacao =
    $("explicacaoManual")
      .value
      .trim();


  const dificuldade =
    $("dificuldadeManual")
      .value;


  const alternativas =
    state
      .alternativasManual
      .filter(
        function (item) {

          return (
            item.texto
              .trim()
              .length > 0
          );

        }
      )
      .map(
        function (item) {

          return {
            texto:
              item.texto.trim(),

            correta:
              item.correta
          };

        }
      );


  if (!enunciado) {

    mostrarErro(
      "Digite o enunciado da questao."
    );

    return;
  }


  if (!disciplinaNome) {

    mostrarErro(
      "Informe a disciplina."
    );

    return;
  }


  if (
    alternativas.length < 2
  ) {

    mostrarErro(
      "Informe pelo menos duas alternativas."
    );

    return;
  }


  if (
    !alternativas.some(
      function (item) {
        return item.correta;
      }
    )
  ) {

    mostrarErro(
      "Marque uma alternativa como correta."
    );

    return;
  }


  const botao =
    $("salvarManual");


  try {

    botao.disabled = true;
    botao.textContent =
      "Salvando...";


    let disciplina =
      state.disciplinas.find(
        function (item) {

          return (
            item.nome
              .toLowerCase() ===
            disciplinaNome
              .toLowerCase()
          );

        }
      );


    if (!disciplina) {

      disciplina =
        await api(
          "/api/disciplinas",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({
                nome:
                  disciplinaNome
              })
          }
        );
    }


    await api(
      "/api/questoes",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            enunciado,
            explicacao:
              explicacao || null,
            tema:
              tema || null,
            dificuldade:
              nomeDificuldade(
                dificuldade
              ),
            disciplinaId:
              disciplina.id,
            alternativas
          })
      }
    );


    $("enunciadoManual")
      .value = "";

    $("disciplinaManual")
      .value = "";

    $("temaManual")
      .value = "";

    $("explicacaoManual")
      .value = "";


    state.alternativasManual =
      [
        {
          texto: "",
          correta: false
        },
        {
          texto: "",
          correta: false
        },
        {
          texto: "",
          correta: false
        },
        {
          texto: "",
          correta: false
        },
        {
          texto: "",
          correta: false
        }
      ];


    renderAlternativasEditor();

    fecharModal(
      "modalManual"
    );

    await carregarDados();

  }
  catch (erro) {

    mostrarErro(
      erro.message ||
      "Nao foi possivel criar a questao."
    );
  }
  finally {

    botao.disabled = false;
    botao.textContent =
      "Criar quest\u00e3o";
  }
}


async function gerarIA() {

  const curso =
    $("cursoIA")
      .value
      .trim();


  const disciplina =
    $("disciplinaIA")
      .value
      .trim();


  const tema =
    $("temaIA")
      .value
      .trim();


  const dificuldade =
    nomeDificuldade(
      $("dificuldadeIA")
        .value
    );


  const quantidade =
    Number(
      $("quantidadeIA")
        .value
    );


  if (!curso) {

    mostrarErro(
      "Informe o curso."
    );

    return;
  }


  if (!disciplina) {

    mostrarErro(
      "Informe a disciplina."
    );

    return;
  }


  if (!tema) {

    mostrarErro(
      "Informe o tema."
    );

    return;
  }


  const botao =
    $("gerarIA");


  try {

    botao.disabled = true;

    botao.textContent =
      "Gerando quest\u00f5es...";


    await api(
      "/api/ia/gerar-questoes",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            curso,
            disciplina,
            tema,
            dificuldade,
            quantidade
          })
      }
    );


    $("temaIA")
      .value = "";


    fecharModal(
      "modalIA"
    );


    await carregarDados();

  }
  catch (erro) {

    mostrarErro(
      erro.message ||
      "Nao foi possivel gerar as questoes."
    );
  }
  finally {

    botao.disabled = false;

    botao.textContent =
      "Gerar quest\u00f5es";
  }
}


async function sair() {

  try {

    await fetch(
      "/api/auth/logout",
      {
        method: "POST",
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


$("busca")
  .addEventListener(
    "input",
    aplicarFiltros
  );


$("filtroDisciplina")
  .addEventListener(
    "change",
    aplicarFiltros
  );


$("filtroDificuldade")
  .addEventListener(
    "change",
    aplicarFiltros
  );


$("limparFiltros")
  .addEventListener(
    "click",
    function () {

      $("busca").value = "";

      $("filtroDisciplina")
        .value = "";

      $("filtroDificuldade")
        .value = "";

      aplicarFiltros();
    }
  );


$("fecharErro")
  .addEventListener(
    "click",
    limparErro
  );


$("iniciarSessao")
  .addEventListener(
    "click",
    iniciarSessao
  );


$("abrirIA")
  .addEventListener(
    "click",
    function () {

      abrirModal(
        "modalIA"
      );
    }
  );


$("abrirManual")
  .addEventListener(
    "click",
    function () {

      abrirModal(
        "modalManual"
      );
    }
  );


$("abrirDisciplina")
  .addEventListener(
    "click",
    function () {

      abrirModal(
        "modalDisciplina"
      );

      setTimeout(
        function () {
          $("novaDisciplina")
            .focus();
        },
        50
      );
    }
  );


document
  .querySelectorAll(
    "[data-close]"
  )
  .forEach(
    function (botao) {

      botao.addEventListener(
        "click",
        function () {

          fecharModal(
            botao.dataset.close
          );
        }
      );
    }
  );


$("modalIA")
  .addEventListener(
    "mousedown",
    function (event) {

      if (
        event.target ===
        $("modalIA")
      ) {
        fecharModal(
          "modalIA"
        );
      }
    }
  );


$("modalManual")
  .addEventListener(
    "mousedown",
    function (event) {

      if (
        event.target ===
        $("modalManual")
      ) {
        fecharModal(
          "modalManual"
        );
      }
    }
  );


$("modalDisciplina")
  .addEventListener(
    "mousedown",
    function (event) {

      if (
        event.target ===
        $("modalDisciplina")
      ) {
        fecharModal(
          "modalDisciplina"
        );
      }
    }
  );


$("criarDisciplina")
  .addEventListener(
    "click",
    criarDisciplina
  );


$("novaDisciplina")
  .addEventListener(
    "keydown",
    function (event) {

      if (
        event.key ===
        "Enter"
      ) {
        criarDisciplina();
      }
    }
  );


$("salvarManual")
  .addEventListener(
    "click",
    salvarManual
  );


$("gerarIA")
  .addEventListener(
    "click",
    gerarIA
  );


$("logoutSidebar")
  .addEventListener(
    "click",
    sair
  );


async function iniciar() {

  renderAlternativasEditor();

  try {

    await Promise.all([
      carregarUsuario(),
      carregarDados()
    ]);

  }
  catch (erro) {

    console.error(
      erro
    );

  }

}


iniciar();
