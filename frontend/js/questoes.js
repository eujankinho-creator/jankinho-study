const state = {
  questoes: [],
  disciplinas: [],
  matriz: [],
  respondidasIds: new Set(),
  filtradas: [],
  sessao: [],
  indice: 0,
  selecionada: null,
  respondida: false,
  pontuacao: 0,
  corretaAtual: false,
  temaCronograma: "",
  pagina: 1,
  paginas: 1,
  totalQuestoes: 0,
  limitePagina: 50,
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


function renderQuestionVisual(
  questao,
  compact
) {

  const src =
    safeQuestionImageUrl(
      questao &&
      questao.imagemUrl
    );


  if (!src) {
    return "";
  }


  return `
    <figure class="question-visual ${
      compact
        ? "compact"
        : ""
    }">

      <img
        src="${escapeHtml(src)}"
        alt="${escapeHtml(
          questao.imagemAlt ||
          "Imagem de apoio da questão"
        )}"
        loading="lazy"
        decoding="async"
      >

    </figure>
  `;

}


function renderQuestionSource(
  questao
) {

  const fonte =
    String(
      questao &&
      questao.fonte
        ? questao.fonte
        : ""
    )
      .trim();


  if (!fonte) {
    return "";
  }


  const url =
    String(
      questao.fonteUrl ||
      ""
    )
      .trim();


  if (
    /^https:\/\//i.test(
      url
    )
  ) {

    return `
      <a
        class="question-source"
        href="${escapeHtml(url)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Fonte: ${escapeHtml(fonte)}
      </a>
    `;

  }


  return `
    <span class="question-source">
      Fonte: ${escapeHtml(fonte)}
    </span>
  `;

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


  state.matriz.forEach(
    function (item) {
      adicionar(item && item.disciplina);
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



function popularAssuntos() {
  const select = $("filtroAssunto");
  if (!select) return;

  const disciplinaSelecionada =
    t($("filtroDisciplina") && $("filtroDisciplina").value)
      .trim()
      .toLocaleLowerCase("pt-BR");

  const mapa = new Map();

  function adicionar(nome) {
    const valor = t(nome).trim();
    if (!valor) return;
    const chave = valor.toLocaleLowerCase("pt-BR");
    if (!mapa.has(chave)) mapa.set(chave, valor);
  }

  state.matriz.forEach(function (item) {
    const nomeDisciplina = t(item && item.disciplina).trim();
    const bate =
      !disciplinaSelecionada ||
      nomeDisciplina.toLocaleLowerCase("pt-BR") === disciplinaSelecionada;

    if (bate && Array.isArray(item && item.assuntos)) {
      item.assuntos.forEach(adicionar);
    }
  });

  state.questoes.forEach(function (questao) {
    const nomeDisciplina =
      t(questao && questao.disciplina && questao.disciplina.nome).trim();
    const bate =
      !disciplinaSelecionada ||
      nomeDisciplina.toLocaleLowerCase("pt-BR") === disciplinaSelecionada;

    if (bate) adicionar(questao && questao.tema);
  });

  const atual = select.value;
  select.innerHTML = '<option value="">Todos os assuntos</option>';

  Array.from(mapa.values())
    .sort(function (a, b) { return a.localeCompare(b, "pt-BR"); })
    .forEach(function (nome) {
      const option = document.createElement("option");
      option.value = nome;
      option.textContent = nome;
      select.appendChild(option);
    });

  if (Array.from(select.options).some(function (o) { return o.value === atual; })) {
    select.value = atual;
  }
}


function urlQuestoesPaginada() {
  const params = new URLSearchParams();

  params.set("pagina", String(state.pagina));
  params.set("limite", String(state.limitePagina));

  const busca = $("busca") ? $("busca").value.trim() : "";
  const disciplina = $("filtroDisciplina") ? $("filtroDisciplina").value : "";
  const assunto = $("filtroAssunto") ? $("filtroAssunto").value : "";
  const dificuldade = $("filtroDificuldade") ? $("filtroDificuldade").value : "";

  if (busca) params.set("busca", busca);
  if (disciplina) params.set("disciplina", disciplina);
  if (assunto) params.set("assunto", assunto);
  if (dificuldade) params.set("dificuldade", nomeDificuldade(dificuldade));

  return "/api/questoes?" + params.toString();
}

function aplicarResultadoPaginado(dados) {
  state.questoes =
    dados && Array.isArray(dados.itens)
      ? dados.itens
      : [];

  state.filtradas = [...state.questoes];

  state.totalQuestoes =
    Number(dados && dados.total || 0);

  state.pagina =
    Number(dados && dados.pagina || 1);

  state.paginas =
    Number(dados && dados.paginas || 1);

  $("statQuestoes").textContent =
    state.totalQuestoes;

  $("resultadoContagem").textContent =
    state.totalQuestoes +
    (state.totalQuestoes === 1
      ? " questão encontrada"
      : " questões encontradas");

  const temFiltro =
    Boolean(
      ($("busca") && $("busca").value.trim()) ||
      ($("filtroDisciplina") && $("filtroDisciplina").value) ||
      ($("filtroAssunto") && $("filtroAssunto").value) ||
      ($("filtroDificuldade") && $("filtroDificuldade").value)
    );

  $("limparFiltros").classList.toggle(
    "visible",
    temFiltro
  );

  renderLista();
  renderPaginacaoQuestoes();
}

function garantirPaginacaoQuestoes() {
  let pager = $("questoesPager");

  if (pager) {
    return pager;
  }

  const lista = $("questoesLista");

  pager = document.createElement("div");
  pager.id = "questoesPager";
  pager.className = "questions-pager";

  lista.insertAdjacentElement(
    "afterend",
    pager
  );

  return pager;
}

function renderPaginacaoQuestoes() {
  const pager = garantirPaginacaoQuestoes();

  if (state.paginas <= 1) {
    pager.classList.add("hidden");
    pager.innerHTML = "";
    return;
  }

  pager.classList.remove("hidden");

  pager.innerHTML = `
    <button
      id="questoesPaginaAnterior"
      class="button-secondary"
      type="button"
      ${state.pagina <= 1 ? "disabled" : ""}
    >
      ← Anterior
    </button>

    <span class="questions-page-indicator">
      ${state.pagina}/${state.paginas}
    </span>

    <button
      id="questoesProximaPagina"
      class="button-secondary"
      type="button"
      ${state.pagina >= state.paginas ? "disabled" : ""}
    >
      Próxima →
    </button>
  `;

  $("questoesPaginaAnterior")
    .addEventListener(
      "click",
      async function () {
        if (state.pagina <= 1) return;
        state.pagina -= 1;
        await carregarPaginaQuestoes();
      }
    );

  $("questoesProximaPagina")
    .addEventListener(
      "click",
      async function () {
        if (state.pagina >= state.paginas) return;
        state.pagina += 1;
        await carregarPaginaQuestoes();
      }
    );
}

async function carregarPaginaQuestoes() {
  try {
    limparErro();

    const dados =
      await api(
        urlQuestoesPaginada()
      );

    aplicarResultadoPaginado(
      dados
    );

    const lista =
      $("questoesLista");

    if (lista) {
      window.scrollTo({
        top:
          Math.max(
            0,
            lista.getBoundingClientRect().top +
            window.scrollY -
            120
          ),
        behavior:
          "smooth"
      });
    }
  }
  catch (erro) {
    console.error(erro);
    mostrarErro(
      erro.message ||
      "Nao foi possivel carregar as questoes."
    );
  }
}

async function carregarDados() {

  try {

    limparErro();


    const resultados =
      await Promise.all([
        api("/api/questoes?pagina=1&limite=50"),
        api("/api/disciplinas"),
        api("/api/respostas"),
        api("/api/questoes/matriz")
      ]);


    state.questoes =
      resultados[0] &&
      Array.isArray(
        resultados[0].itens
      )
        ? resultados[0].itens
        : [];

    state.totalQuestoes =
      Number(
        resultados[0] &&
        resultados[0].total ||
        0
      );

    state.pagina =
      Number(
        resultados[0] &&
        resultados[0].pagina ||
        1
      );

    state.paginas =
      Number(
        resultados[0] &&
        resultados[0].paginas ||
        1
      );


    state.disciplinas =
      Array.isArray(
        resultados[1]
      )
        ? resultados[1]
        : [];


    state.matriz =
      Array.isArray(resultados[3])
        ? resultados[3]
        : [];

    state.respondidasIds =
      new Set(
        (
          Array.isArray(resultados[2])
            ? resultados[2]
            : []
        )
          .map(function (resposta) {
            return Number(resposta.questaoId);
          })
          .filter(Number.isInteger)
      );


    popularDisciplinas();
    popularAssuntos();

    state.filtradas =
      [...state.questoes];

    $("statQuestoes").textContent =
      state.totalQuestoes;

    $("resultadoContagem").textContent =
      state.totalQuestoes +
      (
        state.totalQuestoes === 1
          ? " questão encontrada"
          : " questões encontradas"
      );

    renderLista();
    renderPaginacaoQuestoes();

  }
  catch (erro) {

    console.error(erro);

    mostrarErro(
      erro.message ||
      "Nao foi possivel carregar as questoes."
    );
  }
}


function normalizarTextoBusca(valor) {
  return t(valor)
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}


function bateTemaCronograma(texto, tema) {
  const haystack = normalizarTextoBusca(texto);
  const query = normalizarTextoBusca(tema);

  if (!query) return true;
  if (haystack.includes(query)) return true;

  const ignorar = new Set(["de","da","do","das","dos","e","em","a","o","para","com","no","na","nos","nas"]);
  const tokens = query
    .split(" ")
    .filter((token) => token.length >= 3 && !ignorar.has(token));

  if (!tokens.length) return false;

  const matches = tokens.filter((token) => haystack.includes(token)).length;
  const minimo = tokens.length <= 2 ? 1 : Math.max(2, Math.ceil(tokens.length * .45));
  return matches >= minimo;
}


async function aplicarFiltros(
  resetarPagina = true
) {
  if (resetarPagina) {
    state.pagina = 1;
  }

  await carregarPaginaQuestoes();
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


          const jaFeita =
            state.respondidasIds.has(
              Number(questao.id)
            );


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

                ${
                  jaFeita
                    ? `<span class="badge question-done-badge">✓ Feita</span>`
                    : ""
                }

              </div>


              <h3>
                ${escapeHtml(
                  questao.enunciado
                )}
              </h3>


              ${renderQuestionVisual(
                questao,
                true
              )}


              ${renderQuestionSource(
                questao
              )}


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


          ${renderQuestionSource(
            questao
          )}


          ${renderQuestionVisual(
            questao,
            false
          )}

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


            state.selecionada =
              Number(
                botao.dataset.option
              );


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


let buscaQuestoesTimer = null;

$("busca")
  .addEventListener(
    "input",
    function () {
      clearTimeout(
        buscaQuestoesTimer
      );

      buscaQuestoesTimer =
        setTimeout(
          function () {
            aplicarFiltros(
              true
            );
          },
          280
        );
    }
  );


$("filtroDificuldade")
  .addEventListener(
    "change",
    function () {
      aplicarFiltros(
        true
      );
    }
  );


$("limparFiltros")
  .addEventListener(
    "click",
    function () {

      $("busca").value = "";
      state.temaCronograma = "";

      $("filtroDisciplina")
        .value = "";

      $("filtroDificuldade")
        .value = "";

      if ($("filtroAssunto")) {
        $("filtroAssunto")
          .value = "";
      }

      popularAssuntos();

      aplicarFiltros(
        true
      );
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

    const params =
      new URLSearchParams(
        window.location.search
      );

    const temaCronograma =
      t(
        params.get("tema")
      )
        .trim();

    if (temaCronograma) {

      state.temaCronograma =
        temaCronograma;

      $("busca").value =
        temaCronograma;

      await aplicarFiltros(
        true
      );

      const filtros =
        document.querySelector(
          ".filters-card"
        );

      if (filtros) {
        filtros.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

    }

  }
  catch (erro) {

    console.error(
      erro
    );

  }

}


iniciar();


/* Matriz global: disciplina -> assunto */
(function () {
  function bindMatrizFiltros() {
    const disciplina = $("filtroDisciplina");
    const assunto = $("filtroAssunto");

    if (disciplina && !disciplina.dataset.matrizBound) {
      disciplina.dataset.matrizBound = "1";
      disciplina.addEventListener("change", function () {
        if (assunto) assunto.value = "";
        popularAssuntos();
        aplicarFiltros(
          true
        );
      });
    }

    if (assunto && !assunto.dataset.matrizBound) {
      assunto.dataset.matrizBound = "1";
      assunto.addEventListener("change", function () {
        aplicarFiltros(
          true
        );
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindMatrizFiltros);
  } else {
    bindMatrizFiltros();
  }
})();
