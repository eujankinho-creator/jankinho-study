const state = {
  casos: [],
  filtrados: []
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


function normalizar(valor) {

  return String(
    valor ?? ""
  )
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
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


function mostrarErro(mensagem) {

  $("erroTexto")
    .textContent =
    mensagem;

  $("erroBox")
    .classList.add(
      "visible"
    );
}


function limparErro() {

  $("erroBox")
    .classList.remove(
      "visible"
    );
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


async function carregarCasos() {

  try {

    limparErro();


    const dados =
      await api(
        "/api/casos"
      );


    state.casos =
      Array.isArray(
        dados.casos
      )
        ? dados.casos
        : [];


    aplicarFiltros();

  }
  catch (erro) {

    mostrarErro(
      erro.message ||
      "Nao foi possivel carregar os casos."
    );
  }
}


function dificuldadeClasse(
  valor
) {

  const texto =
    normalizar(valor);


  if (
    texto === "facil"
  ) {
    return "easy";
  }


  if (
    texto === "dificil"
  ) {
    return "hard";
  }


  return "medium";
}


function aplicarFiltros() {

  const busca =
    normalizar(
      $("busca")
        .value
        .trim()
    );


  const area =
    normalizar(
      $("filtroArea")
        .value
    );


  const dificuldade =
    normalizar(
      $("filtroDificuldade")
        .value
    );


  state.filtrados =
    state.casos.filter(
      function (caso) {

        const texto =
          normalizar(
            [
              caso.titulo,
              caso.area,
              caso.cenario,
              caso.queixaInicial
            ].join(" ")
          );


        const bateBusca =
          !busca ||
          texto.includes(
            busca
          );


        const bateArea =
          area === "todas" ||
          normalizar(
            caso.area
          ).includes(
            area
          );


        const bateDificuldade =
          dificuldade ===
            "todos" ||
          normalizar(
            caso.dificuldade
          ) ===
            dificuldade;


        return (
          bateBusca &&
          bateArea &&
          bateDificuldade
        );

      }
    );


  renderCasos();
}


function renderCasos() {

  const container =
    $("casosLista");


  if (
    state.filtrados.length === 0
  ) {

    container.innerHTML =
      '<div class="empty full-width">' +
      'Nenhum caso encontrado.' +
      '</div>';

    return;
  }


  container.innerHTML =
    state.filtrados
      .map(
        function (caso) {

          const badges = [];


          badges.push(
            '<span class="case-badge ' +
            dificuldadeClasse(
              caso.dificuldade
            ) +
            '">' +
            escapeHtml(
              caso.dificuldade
            ) +
            '</span>'
          );


          if (
            caso.geradoPorIA
          ) {

            badges.push(
              '<span class="case-badge ai">' +
              'IA' +
              '</span>'
            );
          }


          if (
            caso.publicado
          ) {

            badges.push(
              '<span class="case-badge public">' +
              'Publico' +
              '</span>'
            );
          }


          if (
            caso.concluido
          ) {

            badges.push(
              '<span class="case-badge completed">' +
              '\u2713 Concluido' +
              '</span>'
            );
          }


          return `
            <article class="case-card">

              <div class="case-top">

                <div class="case-badges">
                  ${badges.join("")}
                </div>

                <span class="case-id">
                  #${caso.id}
                </span>

              </div>


              <div class="case-body">

                <div class="case-area">

                  ${escapeHtml(
                    caso.area
                  )}

                  ${
                    caso.especialidade
                      ? " \u2022 " +
                        escapeHtml(
                          caso.especialidade
                        )
                      : ""
                  }

                </div>


                <h2>
                  ${escapeHtml(
                    caso.titulo
                  )}
                </h2>


                <p class="case-description">
                  ${escapeHtml(
                    caso.queixaInicial
                  )}
                </p>


                <div class="case-action">

                  ${
                    caso.concluido
                      ? `
                        <div class="completed-actions">

                          <a
                            href="/casos/${caso.id}"
                            class="view-result"
                          >
                            Ver resultado
                            <span>
                              \u2192
                            </span>
                          </a>


                          <button
                            type="button"
                            class="refazer-caso-lista"
                            data-id="${caso.id}"
                            data-titulo="${escapeHtml(
                              caso.titulo
                            )}"
                          >
                            \u21bb Refazer caso
                          </button>

                        </div>
                      `
                      : `
                        <a
                          href="/casos/${caso.id}"
                        >
                          Investigar caso

                          <span>
                            \u2192
                          </span>
                        </a>
                      `
                  }

                </div>

              </div>

            </article>
          `;

        }
      )
      .join("");


  document
    .querySelectorAll(
      ".refazer-caso-lista"
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


            const titulo =
              botao.dataset.titulo ||
              "este caso";


            refazerCasoDaLista(
              id,
              titulo,
              botao
            );
          }
        );
      }
    );
}


function abrirGerador() {

  $("modalGerador")
    .classList.add(
      "open"
    );
}


function fecharGerador() {

  $("modalGerador")
    .classList.remove(
      "open"
    );
}


function dificuldadeNome(
  valor
) {

  const texto =
    normalizar(valor);


  if (
    texto === "facil"
  ) {
    return "F\u00e1cil";
  }


  if (
    texto === "dificil"
  ) {
    return "Dif\u00edcil";
  }


  return "M\u00e9dio";
}


async function gerarCaso() {

  const area =
    $("area")
      .value
      .trim();


  const especialidade =
    $("especialidade")
      .value
      .trim();


  const dificuldade =
    dificuldadeNome(
      $("dificuldade")
        .value
    );


  const cenario =
    $("cenario")
      .value
      .trim();


  const tipoCaso =
    $("tipoCaso")
      .value
      .trim();


  const caracteristicas =
    $("caracteristicas")
      .value
      .trim();


  if (!area) {

    mostrarErro(
      "Informe a area."
    );

    return;
  }


  if (!cenario) {

    mostrarErro(
      "Informe o cenario."
    );

    return;
  }


  const botao =
    $("gerarCaso");


  try {

    limparErro();


    botao.disabled =
      true;


    botao.textContent =
      "Gerando caso...";


    await api(
      "/api/ia/gerar-caso",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            area,
            especialidade,
            dificuldade,
            cenario,
            tipoCaso,
            caracteristicas
          })
      }
    );


    fecharGerador();

    $("especialidade")
      .value = "";

    $("caracteristicas")
      .value = "";


    await carregarCasos();

  }
  catch (erro) {

    mostrarErro(
      erro.message ||
      "Nao foi possivel gerar o caso."
    );

  }
  finally {

    botao.disabled =
      false;


    botao.textContent =
      "Gerar caso";
  }
}



async function refazerCasoDaLista(
  id,
  titulo,
  botao
) {

  const confirmado =
    window.confirm(
      "Deseja refazer o caso:\n\n" +
      titulo +
      "\n\nSeu progresso, hipotese e avaliacao serao apagados."
    );


  if (!confirmado) {
    return;
  }


  const textoAnterior =
    botao.textContent;


  try {

    limparErro();


    botao.disabled =
      true;


    botao.textContent =
      "Reiniciando...";


    await api(
      "/api/casos/" +
      id +
      "/refazer",
      {
        method:
          "POST"
      }
    );


    await carregarCasos();

  }
  catch (erro) {

    mostrarErro(
      erro.message ||
      "Nao foi possivel refazer o caso."
    );


    botao.disabled =
      false;


    botao.textContent =
      textoAnterior;
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


$("filtroArea")
  .addEventListener(
    "change",
    aplicarFiltros
  );


$("filtroDificuldade")
  .addEventListener(
    "change",
    aplicarFiltros
  );


$("abrirGerador")
  .addEventListener(
    "click",
    abrirGerador
  );


$("fecharGerador")
  .addEventListener(
    "click",
    fecharGerador
  );


$("cancelarGerador")
  .addEventListener(
    "click",
    fecharGerador
  );


$("gerarCaso")
  .addEventListener(
    "click",
    gerarCaso
  );


$("modalGerador")
  .addEventListener(
    "mousedown",
    function (event) {

      if (
        event.target ===
        $("modalGerador")
      ) {

        fecharGerador();
      }
    }
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

  await carregarUsuario();

  await carregarCasos();
}


iniciar();
