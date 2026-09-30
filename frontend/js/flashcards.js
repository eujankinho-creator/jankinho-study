const state = {
  flashcards: [],
  filtrados: [],
  respostas: {},
  estudoIndex: 0,
  estudoCards: [],
  categoriasSelecionadas: new Set()
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
      "A biblioteca compartilhada est\u00e1 pronta para revis\u00e3o.";

  }
  else {

    $("statusRevisao")
      .textContent =
      "Crie seu primeiro card";


    $("statusRevisaoDescricao")
      .textContent =
      "Crie o primeiro flashcard da biblioteca.";
  }
}


function normalizarBusca(valor) {

  return String(
    valor ?? ""
  )
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


function aplicarBusca() {

  const termo =
    normalizarBusca(
      $("busca")
        .value
        .trim()
    );


  if (!termo) {

    state.filtrados =
      [...state.flashcards];

  }
  else {

    state.filtrados =
      state.flashcards.filter(
        function (card) {

          const frente =
            normalizarBusca(
              card.frente
            );


          const verso =
            normalizarBusca(
              card.verso
            );


          return (
            frente.includes(
              termo
            ) ||
            verso.includes(
              termo
            )
          );

        }
      );

  }


  state.estudoIndex =
    0;


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


/* =========================================================
   CORTEX FLASHCARD CATEGORIES V1
========================================================= */


function categoriaFlashcard(
  card
) {

  const frente =
    String(
      card &&
      card.frente
        ? card.frente
        : ""
    );


  const match =
    frente.match(
      /^\s*\[([^\]|]+)(?:\s*\|\s*[^\]]+)?\]/
    );


  if (
    match &&
    match[1]
  ) {

    return match[1]
      .trim();

  }


  return "Geral";

}


function cardsEmEstudo() {

  return (
    state.estudoCards &&
    state.estudoCards.length
      ? state.estudoCards
      : state.filtrados
  );

}


function garantirModalCategorias() {

  if (
    $("flashcardCategoryModal")
  ) {

    return;

  }


  const modal =
    document.createElement(
      "div"
    );


  modal.id =
    "flashcardCategoryModal";


  modal.className =
    "flash-category-modal hidden";


  modal.innerHTML = `
    <div
      class="flash-category-backdrop"
      data-close-category
    ></div>

    <section class="flash-category-card">

      <div class="flash-category-header">

        <div>

          <span class="badge badge-orange">
            Revisao personalizada
          </span>

          <h2>
            O que voce quer treinar?
          </h2>

          <p>
            Escolha uma ou mais categorias antes de iniciar.
          </p>

        </div>

        <button
          id="closeCategoryModal"
          class="flash-category-close"
          type="button"
        >
          &times;
        </button>

      </div>


      <div class="flash-category-toolbar">

        <button
          id="selectAllFlashCategories"
          type="button"
        >
          Selecionar todas
        </button>

        <button
          id="clearFlashCategories"
          type="button"
        >
          Limpar
        </button>

      </div>


      <div
        id="flashCategoryList"
        class="flash-category-list"
      ></div>


      <div
        id="flashCategoryError"
        class="flash-category-error hidden"
      ></div>


      <div class="flash-category-footer">

        <span id="flashCategoryTotal">
          0 flashcards
        </span>

        <button
          id="confirmFlashCategories"
          class="button-primary"
          type="button"
        >
          Iniciar revisao
        </button>

      </div>

    </section>
  `;


  document.body
    .appendChild(
      modal
    );


  $("closeCategoryModal")
    .addEventListener(
      "click",
      fecharModalCategorias
    );


  modal
    .querySelector(
      "[data-close-category]"
    )
    .addEventListener(
      "click",
      fecharModalCategorias
    );


  $("selectAllFlashCategories")
    .addEventListener(
      "click",
      function () {

        categoriasDisponiveis()
          .forEach(
            function (
              item
            ) {

              state
                .categoriasSelecionadas
                .add(
                  item.nome
                );

            }
          );


        renderCategoriasFlashcards();

      }
    );


  $("clearFlashCategories")
    .addEventListener(
      "click",
      function () {

        state
          .categoriasSelecionadas
          .clear();


        renderCategoriasFlashcards();

      }
    );


  $("confirmFlashCategories")
    .addEventListener(
      "click",
      confirmarCategoriasEstudo
    );

}


function categoriasDisponiveis() {

  const map =
    new Map();


  state.filtrados.forEach(
    function (
      card
    ) {

      const categoria =
        categoriaFlashcard(
          card
        );


      map.set(
        categoria,
        (
          map.get(
            categoria
          ) ||
          0
        ) +
        1
      );

    }
  );


  return Array
    .from(
      map.entries()
    )
    .map(
      function (
        entry
      ) {

        return {
          nome:
            entry[0],

          quantidade:
            entry[1]
        };

      }
    )
    .sort(
      function (
        a,
        b
      ) {

        return a.nome
          .localeCompare(
            b.nome,
            "pt-BR"
          );

      }
    );

}


function abrirSeletorCategorias() {

  if (
    state.filtrados.length ===
    0
  ) {

    mostrarErro(
      "Nao ha flashcards para estudar."
    );


    return;

  }


  garantirModalCategorias();


  state
    .categoriasSelecionadas
    .clear();


  categoriasDisponiveis()
    .forEach(
      function (
        item
      ) {

        state
          .categoriasSelecionadas
          .add(
            item.nome
          );

      }
    );


  renderCategoriasFlashcards();


  $("flashcardCategoryModal")
    .classList
    .remove(
      "hidden"
    );

}


function fecharModalCategorias() {

  const modal =
    $("flashcardCategoryModal");


  if (
    modal
  ) {

    modal
      .classList
      .add(
        "hidden"
      );

  }

}


function renderCategoriasFlashcards() {

  const categorias =
    categoriasDisponiveis();


  $("flashCategoryList")
    .innerHTML =
    categorias
      .map(
        function (
          item
        ) {

          const ativo =
            state
              .categoriasSelecionadas
              .has(
                item.nome
              );


          return `
            <label
              class="flash-category-option ${
                ativo
                  ? "active"
                  : ""
              }"
            >

              <input
                type="checkbox"
                data-flash-category="${escapeHtml(
                  item.nome
                )}"
                ${
                  ativo
                    ? "checked"
                    : ""
                }
              >

              <span class="flash-category-name">
                [${escapeHtml(
                  item.nome
                )}]
              </span>

              <strong>
                ${item.quantidade}
              </strong>

            </label>
          `;

        }
      )
      .join("");


  document
    .querySelectorAll(
      "[data-flash-category]"
    )
    .forEach(
      function (
        input
      ) {

        input.addEventListener(
          "change",
          function () {

            const categoria =
              input.dataset
                .flashCategory;


            if (
              input.checked
            ) {

              state
                .categoriasSelecionadas
                .add(
                  categoria
                );

            }
            else {

              state
                .categoriasSelecionadas
                .delete(
                  categoria
                );

            }


            renderCategoriasFlashcards();

          }
        );

      }
    );


  const total =
    state.filtrados
      .filter(
        function (
          card
        ) {

          return state
            .categoriasSelecionadas
            .has(
              categoriaFlashcard(
                card
              )
            );

        }
      )
      .length;


  $("flashCategoryTotal")
    .textContent =
    total +
    (
      total === 1
        ? " flashcard selecionado"
        : " flashcards selecionados"
    );


  $("flashCategoryError")
    .classList
    .add(
      "hidden"
    );

}


function confirmarCategoriasEstudo() {

  const cards =
    state.filtrados
      .filter(
        function (
          card
        ) {

          return state
            .categoriasSelecionadas
            .has(
              categoriaFlashcard(
                card
              )
            );

        }
      );


  if (
    cards.length ===
    0
  ) {

    $("flashCategoryError")
      .textContent =
      "Selecione pelo menos uma categoria.";


    $("flashCategoryError")
      .classList
      .remove(
        "hidden"
      );


    return;

  }


  fecharModalCategorias();


  iniciarEstudoDireto(
    cards
  );

}


function iniciarEstudo() {

  abrirSeletorCategorias();

}


function iniciarEstudoDireto(cardsSelecionados) {

  state.estudoCards = Array.isArray(cardsSelecionados)
    ? [...cardsSelecionados]
    : [...state.filtrados];


  if (
    state.estudoCards.length === 0
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

  state.estudoCards =
    [];
}


function renderEstudo() {

  const cards =
    cardsEmEstudo();


  const card =
    cards[
      state.estudoIndex
    ];


  if (!card) {

    sairEstudo();

    return;

  }


  const total =
    cards.length;


  const progresso =
    Math.round(
      (
        (
          state.estudoIndex +
          1
        ) /
        total
      ) *
      100
    );


  $("estudoTitulo")
    .textContent =
    "Flashcard " +
    (
      state.estudoIndex +
      1
    ) +
    " de " +
    total;


  $("studyProgress")
    .style.width =
    progresso +
    "%";


  $("studyProgressText")
    .textContent =
    progresso +
    "%";


  $("studyFrente")
    .textContent =
    card.frente;


  renderVersoEstudo();

}

function renderVersoEstudo() {

  const cards =
    cardsEmEstudo();


  const card =
    cards[
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


  if (
    visivel
  ) {

    container
      .classList
      .add(
        "revealed"
      );


    container.innerHTML =
      "<p>" +
      escapeHtml(
        card.verso
      ) +
      "</p>";


    $("ocultarResposta")
      .classList
      .remove(
        "hidden"
      );

  }
  else {

    container
      .classList
      .remove(
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
      .classList
      .add(
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
    cardsEmEstudo()[
      state.estudoIndex
    ];


  if (!card) {
    return;
  }


  state.respostas[
    card.id
  ] =
    true;


  renderVersoEstudo();

}

function ocultarRespostaEstudo() {

  const card =
    cardsEmEstudo()[
      state.estudoIndex
    ];


  if (!card) {
    return;
  }


  state.respostas[
    card.id
  ] =
    false;


  renderVersoEstudo();

}

function proximoCard() {

  const cards =
    cardsEmEstudo();


  if (
    cards.length ===
    0
  ) {

    return;

  }


  if (
    state.estudoIndex >=
    cards.length -
    1
  ) {

    state.estudoIndex =
      0;

  }
  else {

    state.estudoIndex++;

  }


  renderEstudo();

}

function cardAnterior() {

  const cards =
    cardsEmEstudo();


  if (
    cards.length ===
    0
  ) {

    return;

  }


  if (
    state.estudoIndex <=
    0
  ) {

    state.estudoIndex =
      cards.length -
      1;

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

    await Promise.all([
      carregarUsuario(),
      carregarFlashcards()
    ]);

  }
  catch (erro) {

    console.error(
      erro
    );

  }

}


iniciar();
