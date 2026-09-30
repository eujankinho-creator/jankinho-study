const state = {
  id: null,
  caso: null,
  investigacao: null,
  processando: false,
  tipoProcessando: null,
  informacoesAbertas: true
};


const $ = function (id) {
  return document.getElementById(id);
};


function escapeHtml(texto) {

  const div =
    document.createElement("div");

  div.textContent =
    String(texto ?? "");

  return div.innerHTML;
}


function formatarTitulo(valor) {

  return String(
    valor ?? ""
  )
    .replace(
      /([A-Z])/g,
      " $1"
    )
    .replace(
      /[_-]/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim()
    .replace(
      /^./,
      function (letra) {
        return letra.toUpperCase();
      }
    );
}


function formatarValor(valor) {

  if (
    valor === null ||
    valor === undefined
  ) {
    return "";
  }


  if (
    typeof valor === "string" ||
    typeof valor === "number" ||
    typeof valor === "boolean"
  ) {
    return String(valor);
  }


  if (
    Array.isArray(valor)
  ) {

    return valor
      .map(
        function (item) {
          return formatarValor(item);
        }
      )
      .filter(Boolean)
      .join(", ");
  }


  if (
    typeof valor === "object"
  ) {

    return Object
      .entries(valor)
      .map(
        function (
          [chave, item]
        ) {

          const texto =
            formatarValor(item);


          if (!texto) {
            return "";
          }


          return (
            formatarTitulo(
              chave
            ) +
            ": " +
            texto
          );
        }
      )
      .filter(Boolean)
      .join("\n");
  }


  return String(valor);
}


function mostrarErro(mensagem) {

  $("erroTexto")
    .textContent =
    mensagem;


  $("erroBox")
    .classList.add(
      "visible"
    );


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function limparErro() {

  $("erroBox")
    .classList.remove(
      "visible"
    );
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


  const texto =
    await resposta.text();


  let dados = {};


  if (
    texto.trim()
  ) {

    try {

      dados =
        JSON.parse(
          texto
        );

    }
    catch {

      throw new Error(
        "A API retornou uma resposta invalida."
      );
    }
  }


  if (!resposta.ok) {

    throw new Error(
      dados.error ||
      "Erro na requisicao."
    );
  }


  return dados;
}


function obterIdCaso() {

  const params =
    new URLSearchParams(
      location.search
    );


  const queryId =
    Number(
      params.get("id")
    );


  if (
    Number.isInteger(
      queryId
    ) &&
    queryId > 0
  ) {

    return queryId;
  }


  const match =
    location.pathname.match(
      /^\/casos\/(\d+)$/
    );


  if (match) {
    return Number(match[1]);
  }


  return null;
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


  $("nomeSidebar")
    .textContent =
    nome;


  $("emailSidebar")
    .textContent =
    usuario.email || "";


  $("nomeHeader")
    .textContent =
    nome;


  $("avatarSidebar")
    .textContent =
    inicial;


  $("avatarHeader")
    .textContent =
    inicial;
}


async function carregarCaso() {

  try {

    limparErro();


    const dados =
      await api(
        "/api/casos/" +
        state.id
      );


    state.caso =
      dados.caso;


    state.investigacao =
      dados.investigacao ||
      null;


    $("loadingView")
      .classList.add(
        "hidden"
      );


    $("casoView")
      .classList.remove(
        "hidden"
      );


    renderTudo();

  }
  catch (erro) {

    $("loadingView")
      .textContent =
      "Nao foi possivel carregar o caso.";


    mostrarErro(
      erro.message ||
      "Nao foi possivel carregar o caso clinico."
    );
  }
}


function normalizar(
  valor
) {

  return String(
    valor || ""
  )
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );
}


function dificuldadeClasse(
  valor
) {

  const texto =
    normalizar(valor);


  if (
    texto === "facil"
  ) {
    return "green";
  }


  if (
    texto === "dificil"
  ) {
    return "red";
  }


  return "orange";
}


function renderCabecalho() {

  const caso =
    state.caso;


  if (!caso) {
    return;
  }


  const finalizado =
    Boolean(
      state.investigacao &&
      state.investigacao
        .finalizado
    );


  $("caseBadges")
    .innerHTML =
    `
      <span class="case-badge orange">

        ${escapeHtml(
          caso.area
        )}

      </span>


      <span
        class="case-badge ${
          dificuldadeClasse(
            caso.dificuldade
          )
        }"
      >

        ${escapeHtml(
          caso.dificuldade
        )}

      </span>


      <span class="case-badge">

        ${escapeHtml(
          caso.cenario
        )}

      </span>


      ${
        finalizado
          ? `
            <span class="case-badge green">
              \u2713 Concluido
            </span>
          `
          : ""
      }
    `;


  $("casoTitulo")
    .textContent =
    caso.titulo;


  $("casoEspecialidade")
    .textContent =
    caso.especialidade ||
    "";


  $("queixaInicial")
    .textContent =
    caso.queixaInicial;


  $("dadosIniciais")
    .textContent =
    formatarValor(
      caso.dadosIniciais
    ) ||
    "Nenhuma informacao disponivel.";


  $("sinaisVitais")
    .textContent =
    formatarValor(
      caso.sinaisVitais
    ) ||
    "Nenhuma informacao disponivel.";
}


function obterRegistros() {

  if (
    state.investigacao &&
    Array.isArray(
      state.investigacao
        .registros
    )
  ) {

    return state
      .investigacao
      .registros;
  }


  return [];
}



function renderBotoesInvestigacao() {

  const registros =
    obterRegistros();


  const finalizado =
    Boolean(
      state.investigacao &&
      state.investigacao.finalizado
    );


  const titulos = {
    ANAMNESE:
      "Anamnese",

    EXAME_FISICO:
      "Exame fisico",

    SINAIS_VITAIS:
      "Sinais vitais",

    EVOLUCAO:
      "Evolucao"
  };


  const descricoes = {
    ANAMNESE:
      "Historia e informacoes do paciente",

    EXAME_FISICO:
      "Achados do exame fisico",

    SINAIS_VITAIS:
      "Verificar parametros vitais",

    EVOLUCAO:
      "Acompanhar evolucao clinica"
  };


  document
    .querySelectorAll(
      "[data-investigar]"
    )
    .forEach(
      function (botao) {

        const tipo =
          botao.dataset
            .investigar;


        const coletado =
          registros.some(
            function (
              registro
            ) {

              return (
                registro.tipo ===
                tipo
              );

            }
          );


        const carregando =
          state.processando &&
          state.tipoProcessando ===
          tipo;


        botao.classList.toggle(
          "collected",
          coletado
        );


        botao.classList.toggle(
          "requesting",
          carregando
        );


        botao.disabled =
          state.processando ||
          finalizado ||
          coletado;


        const strong =
          botao.querySelector(
            "strong"
          );


        const small =
          botao.querySelector(
            "small"
          );


        if (strong) {

          if (coletado) {

            strong.textContent =
              titulos[tipo] +
              " \u2713";

          }
          else if (carregando) {

            strong.textContent =
              "Carregando...";

          }
          else {

            strong.textContent =
              titulos[tipo];
          }
        }


        if (small) {

          if (coletado) {

            small.textContent =
              "Informacao coletada";

          }
          else if (carregando) {

            small.textContent =
              "Buscando informacoes...";

          }
          else {

            small.textContent =
              descricoes[tipo];
          }
        }

      }
    );
}

function renderExames() {

  const exames =
    state.caso &&
    Array.isArray(
      state.caso.exames
    )
      ? state.caso.exames
      : [];


  const container =
    $("examesLista");


  if (
    exames.length === 0
  ) {

    container.innerHTML =
      '<div class="empty-state">' +
      'Este caso nao possui exames cadastrados.' +
      '</div>';

    return;
  }


  const registros =
    obterRegistros();


  const finalizado =
    Boolean(
      state.investigacao &&
      state.investigacao
        .finalizado
    );


  container.innerHTML =
    exames
      .map(
        function (
          exame,
          index
        ) {

          const solicitado =
            registros.find(
              function (
                registro
              ) {

                return (
                  registro.tipo ===
                    "EXAME" &&
                  registro.titulo ===
                    exame.nome
                );
              }
            );


          return `
            <article
              class="exam-card ${
                solicitado
                  ? "collected"
                  : ""
              }"
            >

              <h3>

                ${escapeHtml(
                  exame.nome ||
                  (
                    "Exame " +
                    (index + 1)
                  )
                )}

              </h3>


              ${
                exame.categoria
                  ? `
                    <div class="exam-category">

                      ${escapeHtml(
                        exame.categoria
                      )}

                    </div>
                  `
                  : ""
              }


              ${
                solicitado
                  ? `
                    <div class="exam-collected-badge">
                      \u2713 Exame solicitado
                    </div>
                  `
                  : ""
              }


              <div
                class="exam-result ${
                  solicitado
                    ? "revealed"
                    : ""
                }"
              >

                ${
                  solicitado
                    ? escapeHtml(
                        solicitado.resposta
                      )
                    : "Resultado disponivel mediante solicitacao."
                }

              </div>


              ${
                !solicitado &&
                !finalizado
                  ? `
                    <button
                      class="button-secondary solicitar-exame"
                      data-index="${index}"
                      type="button"
                    >
                      Solicitar exame
                    </button>
                  `
                  : ""
              }

            </article>
          `;

        }
      )
      .join("");


  document
    .querySelectorAll(
      ".solicitar-exame"
    )
    .forEach(
      function (botao) {

        botao.addEventListener(
          "click",
          function () {

            const card =
              botao.closest(
                ".exam-card"
              );


            botao.disabled =
              true;


            botao.textContent =
              "Solicitando...";


            if (card) {

              card.classList.add(
                "requesting"
              );
            }


            investigar(
              "EXAME",
              {
                index:
                  Number(
                    botao.dataset.index
                  )
              }
            );
          }
        );
      }
    );
}


function renderRegistros() {

  const registros =
    obterRegistros();


  $("registrosCount")
    .textContent =
    registros.length +
    (
      registros.length === 1
        ? " registro"
        : " registros"
    );


  const container =
    $("registrosLista");


  if (
    registros.length === 0
  ) {

    container.innerHTML =
      '<div class="empty-state">' +
      'Voce ainda nao coletou informacoes adicionais.' +
      '</div>';

    return;
  }


  container.innerHTML =
    registros
      .map(
        function (
          registro
        ) {

          return `
            <article class="record-card">

              <div class="record-heading">

                <span class="record-type">

                  ${escapeHtml(
                    formatarTitulo(
                      registro.tipo
                    )
                  )}

                </span>


                <span class="record-title">

                  ${escapeHtml(
                    registro.titulo
                  )}

                </span>

              </div>


              ${
                registro.pergunta
                  ? `
                    <p class="record-question">

                      ${escapeHtml(
                        registro.pergunta
                      )}

                    </p>
                  `
                  : ""
              }


              <p class="record-answer">

                ${escapeHtml(
                  registro.resposta
                )}

              </p>

            </article>
          `;

        }
      )
      .join("");
}


function criarListaResultado(
  titulo,
  itens,
  classe
) {

  if (
    !Array.isArray(itens) ||
    itens.length === 0
  ) {

    return "";
  }


  return `
    <div class="result-block">

      <h3 class="${classe || ""}">
        ${escapeHtml(titulo)}
      </h3>


      <div class="result-list">

        ${itens
          .map(
            function (item) {

              let texto = "";


              if (
                typeof item ===
                "string"
              ) {

                texto =
                  item;

              }
              else {

                texto =
                  formatarValor(
                    item
                  );
              }


              return `
                <div>

                  ${escapeHtml(
                    texto
                  )}

                </div>
              `;
            }
          )
          .join("")}

      </div>

    </div>
  `;
}


function renderResultado() {

  const investigacao =
    state.investigacao;


  const finalizado =
    Boolean(
      investigacao &&
      investigacao.finalizado
    );


  const avaliacao =
    investigacao &&
    investigacao.avaliacao;


  $("investigacaoPanel")
    .classList.toggle(
      "hidden",
      finalizado
    );


  $("hipotesePanel")
    .classList.toggle(
      "hidden",
      finalizado
    );


  $("resultadoPanel")
    .classList.toggle(
      "hidden",
      !finalizado ||
      !avaliacao
    );


  if (
    !finalizado ||
    !avaliacao
  ) {
    return;
  }


  const nota =
    Number(
      avaliacao.nota
    );


  const correta =
    Boolean(
      avaliacao.hipoteseCorreta
    );


  $("resultadoConteudo")
    .innerHTML =
    `
      <div class="result-stats">


        <div class="result-stat">

          <span>
            Nota
          </span>

          <strong class="orange">

            ${
              Number.isFinite(
                nota
              )
                ? nota.toFixed(1)
                : "-"
            }

          </strong>

        </div>


        <div class="result-stat">

          <span>
            Classificacao
          </span>

          <strong>

            ${escapeHtml(
              avaliacao.classificacao ||
              "Avaliado"
            )}

          </strong>

        </div>


        <div class="result-stat">

          <span>
            Sua hipotese
          </span>

          <strong
            class="${
              correta
                ? "good"
                : "bad"
            }"
          >

            ${
              correta
                ? "\u2713 Correta"
                : "\u2715 Nao compativel"
            }

          </strong>

        </div>


      </div>


      <div class="result-block final-diagnosis">

        <h3>
          Diagnostico final
        </h3>

        <p>

          ${escapeHtml(
            avaliacao.diagnosticoFinal ||
            "Nao informado"
          )}

        </p>

      </div>


      <div class="result-block">

        <h3>
          Sua hipotese
        </h3>

        <p>

          ${escapeHtml(
            investigacao.hipotese ||
            ""
          )}

        </p>


        ${
          investigacao.justificativa
            ? `
              <br>

              <h3>
                Sua justificativa
              </h3>

              <p>

                ${escapeHtml(
                  investigacao.justificativa
                )}

              </p>
            `
            : ""
        }

      </div>


      ${
        avaliacao.avaliacaoGeral
          ? `
            <div class="result-block">

              <h3>
                Avaliacao geral
              </h3>

              <p>

                ${escapeHtml(
                  avaliacao.avaliacaoGeral
                )}

              </p>

            </div>
          `
          : ""
      }


      ${criarListaResultado(
        "Pontos fortes",
        avaliacao.pontosFortes,
        "good"
      )}


      ${criarListaResultado(
        "Pontos a melhorar",
        avaliacao.pontosFracos,
        "bad"
      )}


      ${criarListaResultado(
        "Achados importantes",
        avaliacao.achadosImportantes
      )}


      ${criarListaResultado(
        "Informacoes que poderiam ter sido investigadas",
        avaliacao.informacoesNaoInvestigadas
      )}


      ${criarListaResultado(
        "Diagnosticos diferenciais",
        avaliacao.diagnosticosDiferenciais
      )}


      ${
        avaliacao.raciocinioEsperado
          ? `
            <div class="result-block">

              <h3>
                Raciocinio esperado
              </h3>

              <p>

                ${escapeHtml(
                  avaliacao.raciocinioEsperado
                )}

              </p>

            </div>
          `
          : ""
      }


      ${
        avaliacao.feedbackEducacional
          ? `
            <div class="result-block">

              <h3 class="orange">
                Feedback educacional
              </h3>

              <p>

                ${escapeHtml(
                  avaliacao.feedbackEducacional
                )}

              </p>

            </div>
          `
          : ""
      }
    `;
}


function renderTudo() {

  renderCabecalho();

  renderBotoesInvestigacao();

  renderExames();

  renderRegistros();

  renderResultado();


  if (
    state.investigacao
  ) {

    $("hipotese")
      .value =
      state.investigacao
        .hipotese ||
      "";


    $("justificativa")
      .value =
      state.investigacao
        .justificativa ||
      "";
  }
}


function setProcessando(
  valor
) {

  state.processando =
    valor;


  renderBotoesInvestigacao();


  $("finalizarCaso")
    .disabled =
    valor;


  $("refazerCaso")
    .disabled =
    valor;
}


async function investigar(
  tipo,
  exame
) {

  if (
    state.processando
  ) {
    return;
  }


  try {

    limparErro();


    state.tipoProcessando =
      tipo;


    setProcessando(
      true
    );


    const dados =
      await api(
        "/api/casos/" +
        state.id +
        "/investigar",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({
              tipo,
              exame
            })
        }
      );


    if (
      dados.investigacao
    ) {

      state.investigacao =
        dados.investigacao;
    }


    renderTudo();

  }
  catch (erro) {

    mostrarErro(
      erro.message ||
      "Nao foi possivel realizar a investigacao."
    );

  }
  finally {

    state.tipoProcessando =
      null;


    setProcessando(
      false
    );


    renderTudo();
  }
}


async function finalizarCaso() {

  if (
    state.processando
  ) {
    return;
  }


  const hipotese =
    $("hipotese")
      .value
      .trim();


  const justificativa =
    $("justificativa")
      .value
      .trim();


  if (!hipotese) {

    mostrarErro(
      "Informe sua hipotese diagnostica."
    );

    return;
  }


  if (!justificativa) {

    mostrarErro(
      "Explique seu raciocinio clinico."
    );

    return;
  }


  try {

    limparErro();

    setProcessando(
      true
    );


    $("finalizarCaso")
      .textContent =
      "Avaliando...";


    const dados =
      await api(
        "/api/casos/" +
        state.id +
        "/hipotese",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({
              hipotese,
              justificativa
            })
        }
      );


    if (
      dados.investigacao
    ) {

      state.investigacao =
        dados.investigacao;
    }


    renderTudo();


    setTimeout(
      function () {

        $("resultadoPanel")
          .scrollIntoView({
            behavior:
              "smooth",

            block:
              "start"
          });

      },
      100
    );

  }
  catch (erro) {

    mostrarErro(
      erro.message ||
      "Nao foi possivel avaliar a hipotese."
    );

  }
  finally {

    $("finalizarCaso")
      .textContent =
      "Finalizar caso \u2192";


    setProcessando(
      false
    );
  }
}


async function refazerCaso() {

  if (
    state.processando
  ) {
    return;
  }


  const confirmado =
    window.confirm(
      "Deseja refazer este caso?\n\nSeu progresso, hipotese e avaliacao atual serao apagados."
    );


  if (!confirmado) {
    return;
  }


  try {

    limparErro();


    setProcessando(
      true
    );


    const dados =
      await api(
        "/api/casos/" +
        state.id +
        "/refazer",
        {
          method:
            "POST"
        }
      );


    state.investigacao =
      dados.investigacao ||
      null;


    $("hipotese")
      .value = "";


    $("justificativa")
      .value = "";


    renderTudo();


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
  catch (erro) {

    mostrarErro(
      erro.message ||
      "Nao foi possivel refazer o caso."
    );

  }
  finally {

    setProcessando(
      false
    );
  }
}


async function sair() {

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


$("toggleInformacoes")
  .addEventListener(
    "click",
    function () {

      state.informacoesAbertas =
        !state
          .informacoesAbertas;


      $("informacoesBody")
        .classList.toggle(
          "hidden",
          !state
            .informacoesAbertas
        );


      $("toggleIcon")
        .textContent =
        state
          .informacoesAbertas
            ? "-"
            : "+";
    }
  );


document
  .querySelectorAll(
    "[data-investigar]"
  )
  .forEach(
    function (botao) {

      botao.addEventListener(
        "click",
        function () {

          investigar(
            botao.dataset
              .investigar
          );
        }
      );
    }
  );


$("limparHipotese")
  .addEventListener(
    "click",
    function () {

      $("hipotese")
        .value = "";


      $("justificativa")
        .value = "";
    }
  );


$("finalizarCaso")
  .addEventListener(
    "click",
    finalizarCaso
  );


$("refazerCaso")
  .addEventListener(
    "click",
    refazerCaso
  );


$("fecharErro")
  .addEventListener(
    "click",
    limparErro
  );


$("logoutSidebar")
  .addEventListener(
    "click",
    sair
  );


async function iniciar() {

  state.id =
    obterIdCaso();


  if (!state.id) {

    $("loadingView")
      .textContent =
      "ID do caso nao informado.";

    return;
  }


  try {

    await Promise.all([
      carregarUsuario(),
      carregarCaso()
    ]);

  }
  catch (erro) {

    console.error(
      erro
    );

  }
}


iniciar();
