const state = {
  flashcards: [],
  filtrados: [],
  respostas: {},
  estudoIndex: 0
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


function mostrarErro(mensagem) {

  $("erroTexto").textContent =
    mensagem;

  $("erroBox").classList.add(
    "visible"
  );
}


function limparErro() {

  $("erroTexto").textContent =
    "";

  $("erroBox").classList.remove(
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


async function carregarFlashcards() {

  try {

    limparErro();


    const dados =
      await api(
        "/api/flashcards"
      );


    state.flashcards =
      Array.isArray(dados)
        ? dados
        : [];


    aplicarBusca();

  }
  catch (erro) {

    console.error(erro);

    mostrarErro(
      erro.message ||
      "Nao foi possivel carregar os flashcards."
    );
  }
}


function atualizarResumo() {

  const total =
    state.flashcards.length;


  const encontrados =
    state.filtrados.length;


  $("totalCards")
    .textContent =
    total;


  $("cardsEncontrados")
    .textContent =
    encontrados;


  $("bibliotecaResumo")
    .textContent =
    total +
    (
      total === 1
        ? " flashcard cadastrado."
        : " flashcards cadastrados."
    );


  if (total > 0) {

    $("statusRevisao")
      .textContent =
      "Pronto para estudar";


    $("statusRevisaoDescricao")
      .textContent =
      "Sua biblioteca est\u00e1 dispon\u00edvel.";

  }
  else {

    $("statusRevisao")
      .textContent =
      "Crie seu primeiro card";


    $("statusRevisaoDescricao")
      .textContent =
      "Comece sua biblioteca de revis\u00e3o.";
  }
}


function aplicarBusca() {

  const termo =
    $("busca")
      .value
      .trim()
      .toLowerCase();


  if (!termo) {

    state.filtrados =
      [...state.flashcards];

  }
  else {

    state.filtrados =
      state.flashcards.filter(
        function (card) {

          return (
            String(
              card.frente || ""
            )
              .toLowerCase()
              .includes(termo)
            ||
            String(
              card.verso || ""
            )
              .toLowerCase()
              .includes(termo)
          );

        }
      );
  }


  state.estudoIndex = 0;

  atualizarResumo();

  renderLista();
}


function renderLista() {

  const container =
    $("flashcardsLista");


  if (
    state.filtrados.length === 0
  ) {

    const mensagem =
      state.flashcards.length === 0
        ? "Nenhum flashcard ainda."
        : "Nenhum flashcard encontrado.";


    container.innerHTML =
      '<div class="empty full-width">' +
      mensagem +
      '</div>';

    return;
  }


  container.innerHTML =
    state.filtrados
      .map(
        function (card) {

          const visivel =
            state.respostas[
              card.id
            ] === true;


          return `
            <article class="flashcard-item">

              <div class="flashcard-top">

                <span class="badge badge-orange">
                  Flashcard
                </span>

                <span class="flashcard-id">
                  #${card.id}
                </span>

              </div>


              <div class="flashcard-front">

                <span class="flashcard-label">
                  Frente
                </span>

                <p>
                  ${escapeHtml(
                    card.frente
                  )}
                </p>

              </div>


              <div class="flashcard-back">

                <span class="flashcard-label">
                  Verso
                </span>

                ${
                  visivel
                    ? `
                      <div class="answer-box">
                        ${escapeHtml(
                          card.verso
                        )}
                      </div>

                      <button
                        class="text-button toggle-answer"
                        data-id="${card.id}"
                        type="button"
                      >
                        Ocultar resposta
                      </button>
                    `
                    : `
                      <div style="margin-top:12px">

                        <button
                          class="button-secondary toggle-answer"
                          data-id="${card.id}"
                          type="button"
                        >
                          Mostrar resposta
                        </button>

                      </div>
                    `
                }

              </div>

            </article>
          `;

        }
      )
      .join("");


  document
    .querySelectorAll(
      ".toggle-answer"
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


            state.respostas[id] =
              !state.respostas[id];


            renderLista();
          }
        );
      }
    );
}


function abrirFormulario() {

  $("formularioNovo")
    .classList.remove(
      "hidden"
    );


  $("frente").focus();
}


function fecharFormulario() {

  $("formularioNovo")
    .classList.add(
      "hidden"
    );
}


async function criarFlashcard(
  event
) {

  event.preventDefault();


  const frente =
    $("frente")
      .value
      .trim();


  const verso =
    $("verso")
      .value
      .trim();


  if (
    !frente ||
    !verso
  ) {

    mostrarErro(
      "Preencha a frente e o verso do flashcard."
    );

    return;
  }


  const botao =
    $("salvarFlashcard");


  try {

    limparErro();

    botao.disabled = true;

    botao.textContent =
      "Salvando...";


    const novo =
      await api(
        "/api/flashcards",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({
              frente,
              verso
            })
        }
      );


    state.flashcards.unshift(
      novo
    );


    $("frente").value = "";
    $("verso").value = "";


    fecharFormulario();

    aplicarBusca();

  }
  catch (erro) {

    mostrarErro(
      erro.message ||
      "Nao foi possivel criar o flashcard."
    );
  }
  finally {

    botao.disabled = false;

    botao.textContent =
      "Salvar flashcard";
  }
}


function iniciarEstudo() {

  if (
    state.filtrados.length === 0
  ) {

    mostrarErro(
      "Nao ha flashcards para estudar."
    );

    return;
  }


  state.estudoIndex = 0;


  $("bibliotecaView")
    .classList.add(
      "hidden"
    );


  $("estudoView")
    .classList.remove(
      "hidden"
    );


  renderEstudo();


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function sairEstudo() {

  $("estudoView")
    .classList.add(
      "hidden"
    );


  $("bibliotecaView")
    .classList.remove(
      "hidden"
    );


  state.estudoIndex = 0;
}


function renderEstudo() {

  const card =
    state.filtrados[
      state.estudoIndex
    ];


  if (!card) {

    sairEstudo();

    return;
  }


  const total =
    state.filtrados.length;


  const progresso =
    Math.round(
      (
        (
          state.estudoIndex + 1
        ) /
        total
      ) *
      100
    );


  $("estudoTitulo")
    .textContent =
    "Flashcard " +
    (
      state.estudoIndex + 1
    ) +
    " de " +
    total;


  $("studyProgress")
    .style.width =
    progresso + "%";


  $("studyProgressText")
    .textContent =
    progresso + "%";


  $("studyFrente")
    .textContent =
    card.frente;


  renderVersoEstudo();
}


function renderVersoEstudo() {

  const card =
    state.filtrados[
      state.estudoIndex
    ];


  if (!card) {
    return;
  }


  const visivel =
    state.respostas[
      card.id
    ] === true;


  const container =
    $("versoContainer");


  if (visivel) {

    container.classList.add(
      "revealed"
    );


    container.innerHTML =
      "<p>" +
      escapeHtml(
        card.verso
      ) +
      "</p>";


    $("ocultarResposta")
      .classList.remove(
        "hidden"
      );
  }
  else {

    container.classList.remove(
      "revealed"
    );


    container.innerHTML =
      '<button ' +
      'id="mostrarRespostaInterno" ' +
      'class="button-primary" ' +
      'type="button">' +
      'Mostrar resposta' +
      '</button>';


    $("ocultarResposta")
      .classList.add(
        "hidden"
      );


    $("mostrarRespostaInterno")
      .addEventListener(
        "click",
        mostrarRespostaEstudo
      );
  }
}


function mostrarRespostaEstudo() {

  const card =
    state.filtrados[
      state.estudoIndex
    ];


  if (!card) {
    return;
  }


  state.respostas[
    card.id
  ] = true;


  renderVersoEstudo();
}


function ocultarRespostaEstudo() {

  const card =
    state.filtrados[
      state.estudoIndex
    ];


  if (!card) {
    return;
  }


  state.respostas[
    card.id
  ] = false;


  renderVersoEstudo();
}


function proximoCard() {

  if (
    state.filtrados.length === 0
  ) {
    return;
  }


  if (
    state.estudoIndex >=
    state.filtrados.length - 1
  ) {

    state.estudoIndex = 0;

  }
  else {

    state.estudoIndex++;
  }


  renderEstudo();
}


function cardAnterior() {

  if (
    state.filtrados.length === 0
  ) {
    return;
  }


  if (
    state.estudoIndex <= 0
  ) {

    state.estudoIndex =
      state.filtrados.length - 1;

  }
  else {

    state.estudoIndex--;
  }


  renderEstudo();
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
    aplicarBusca
  );


$("abrirFormulario")
  .addEventListener(
    "click",
    abrirFormulario
  );


$("fecharFormulario")
  .addEventListener(
    "click",
    fecharFormulario
  );


$("cancelarFormulario")
  .addEventListener(
    "click",
    fecharFormulario
  );


$("flashcardForm")
  .addEventListener(
    "submit",
    criarFlashcard
  );


$("iniciarEstudoTopo")
  .addEventListener(
    "click",
    iniciarEstudo
  );


$("iniciarEstudoCard")
  .addEventListener(
    "click",
    iniciarEstudo
  );


$("sairEstudo")
  .addEventListener(
    "click",
    sairEstudo
  );


$("proximoCard")
  .addEventListener(
    "click",
    proximoCard
  );


$("cardAnterior")
  .addEventListener(
    "click",
    cardAnterior
  );


$("ocultarResposta")
  .addEventListener(
    "click",
    ocultarRespostaEstudo
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

  try {

    await carregarUsuario();

    await carregarFlashcards();

  }
  catch (erro) {

    console.error(erro);
  }
}


iniciar();
