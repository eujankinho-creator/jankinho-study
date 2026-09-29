const state = {
  movimentacoes: [],
  resumo: {
    receitas: 0,
    despesas: 0,
    saldo: 0
  },
  tipo: "RECEITA",
  editandoId: null
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


function moeda(valor) {

  return Number(
    valor || 0
  ).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  );
}


function formatarData(valor) {

  const data =
    new Date(valor);


  return data.toLocaleDateString(
    "pt-BR"
  );
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


async function carregarMovimentacoes() {

  try {

    limparErro();


    const parametros =
      new URLSearchParams();


    const inicio =
      $("inicio").value;


    const fim =
      $("fim").value;


    if (inicio) {

      parametros.set(
        "inicio",
        inicio
      );
    }


    if (fim) {

      parametros.set(
        "fim",
        fim
      );
    }


    const url =
      "/api/financeiro" +
      (
        parametros.toString()
          ? "?" +
            parametros.toString()
          : ""
      );


    const dados =
      await api(url);


    state.movimentacoes =
      Array.isArray(
        dados.movimentacoes
      )
        ? dados.movimentacoes
        : [];


    state.resumo =
      dados.resumo || {
        receitas: 0,
        despesas: 0,
        saldo: 0
      };


    renderTudo();

  }
  catch (erro) {

    console.error(erro);


    mostrarErro(
      erro.message ||
      "Nao foi possivel carregar os dados financeiros."
    );
  }
}


function renderResumo() {

  const receitas =
    Number(
      state.resumo.receitas ||
      0
    );


  const despesas =
    Number(
      state.resumo.despesas ||
      0
    );


  const saldo =
    Number(
      state.resumo.saldo ||
      0
    );


  const quantidadeReceitas =
    state.movimentacoes.filter(
      function (item) {

        return (
          item.tipo ===
          "RECEITA"
        );

      }
    ).length;


  const quantidadeDespesas =
    state.movimentacoes.filter(
      function (item) {

        return (
          item.tipo ===
          "DESPESA"
        );

      }
    ).length;


  $("receitasTotal")
    .textContent =
    moeda(receitas);


  $("despesasTotal")
    .textContent =
    moeda(despesas);


  $("saldoTotal")
    .textContent =
    moeda(saldo);


  $("quantidadeReceitas")
    .textContent =
    quantidadeReceitas +
    (
      quantidadeReceitas === 1
        ? " lancamento"
        : " lancamentos"
    );


  $("quantidadeDespesas")
    .textContent =
    quantidadeDespesas +
    (
      quantidadeDespesas === 1
        ? " lancamento"
        : " lancamentos"
    );


  $("totalLancamentos")
    .textContent =
    state.movimentacoes.length +
    (
      state.movimentacoes.length === 1
        ? " lancamento"
        : " lancamentos"
    );


  const saldoTotal =
    $("saldoTotal");


  const saldoLabel =
    $("saldoLabel");


  const saldoIcon =
    $("saldoIcon");


  const saldoCard =
    $("saldoCard");


  if (saldo >= 0) {

    saldoTotal.className =
      "summary-value orange";

    saldoLabel.className =
      "orange";

    saldoIcon.className =
      "summary-icon balance-icon";

    saldoCard.className =
      "summary-card balance-card";

  }
  else {

    saldoTotal.className =
      "summary-value expense";

    saldoLabel.className =
      "expense";

    saldoIcon.className =
      "summary-icon expense-icon";

    saldoCard.className =
      "summary-card expense-card";
  }


  $("barReceitasValor")
    .textContent =
    moeda(receitas);


  $("barDespesasValor")
    .textContent =
    moeda(despesas);


  const maior =
    Math.max(
      receitas,
      despesas,
      1
    );


  const percentualReceitas =
    Math.min(
      100,
      receitas /
      maior *
      100
    );


  const percentualDespesas =
    Math.min(
      100,
      despesas /
      maior *
      100
    );


  $("barReceitas")
    .style.width =
    percentualReceitas +
    "%";


  $("barDespesas")
    .style.width =
    percentualDespesas +
    "%";
}


function renderFiltro() {

  const inicio =
    $("inicio").value;


  const fim =
    $("fim").value;


  if (
    inicio ||
    fim
  ) {

    $("filtroAtivo")
      .classList.remove(
        "hidden"
      );


    $("filtroTexto")
      .textContent =
      (
        inicio ||
        "Inicio"
      ) +
      " \u2192 " +
      (
        fim ||
        "Atual"
      );

  }
  else {

    $("filtroAtivo")
      .classList.add(
        "hidden"
      );
  }
}


function renderMovimentacoes() {

  const container =
    $("movimentacoesLista");


  if (
    state.movimentacoes.length === 0
  ) {

    container.innerHTML =
      '<div class="empty">' +
      'Nenhuma movimentacao registrada.' +
      '</div>';

    return;
  }


  container.innerHTML =
    state.movimentacoes
      .map(
        function (item) {

          const receita =
            item.tipo ===
            "RECEITA";


          return `
            <div class="movement-item">

              <div
                class="movement-icon ${
                  receita
                    ? "income-bg"
                    : "expense-bg"
                }"
              >
                ${
                  receita
                    ? "\u2191"
                    : "\u2193"
                }
              </div>


              <div class="movement-info">

                <strong>
                  ${escapeHtml(
                    item.descricao
                  )}
                </strong>

                <div class="movement-meta">

                  <span>
                    ${formatarData(
                      item.data
                    )}
                  </span>

                  <span>
                    &bull;
                  </span>

                  <span
                    class="${
                      receita
                        ? "income"
                        : "expense"
                    }"
                  >
                    ${
                      receita
                        ? "Receita"
                        : "Despesa"
                    }
                  </span>

                </div>

              </div>


              <div
                class="movement-value ${
                  receita
                    ? "income"
                    : "expense"
                }"
              >
                ${
                  receita
                    ? "+"
                    : "-"
                }
                ${moeda(
                  item.valor
                )}
              </div>


              <div class="movement-actions">

                <button
                  class="edit-button"
                  data-edit="${item.id}"
                  type="button"
                >
                  Editar
                </button>

                <button
                  class="delete-button"
                  data-delete="${item.id}"
                  type="button"
                >
                  Excluir
                </button>

              </div>

            </div>
          `;

        }
      )
      .join("");


  document
    .querySelectorAll(
      "[data-edit]"
    )
    .forEach(
      function (botao) {

        botao.addEventListener(
          "click",
          function () {

            iniciarEdicao(
              Number(
                botao.dataset.edit
              )
            );
          }
        );
      }
    );


  document
    .querySelectorAll(
      "[data-delete]"
    )
    .forEach(
      function (botao) {

        botao.addEventListener(
          "click",
          function () {

            excluirMovimentacao(
              Number(
                botao.dataset.delete
              )
            );
          }
        );
      }
    );
}


function renderTudo() {

  renderResumo();
  renderFiltro();
  renderMovimentacoes();
}


function selecionarTipo(
  tipo
) {

  state.tipo =
    tipo;


  $("tipoReceita")
    .classList.toggle(
      "income-selected",
      tipo === "RECEITA"
    );


  $("tipoReceita")
    .classList.remove(
      "expense-selected"
    );


  $("tipoDespesa")
    .classList.toggle(
      "expense-selected",
      tipo === "DESPESA"
    );


  $("tipoDespesa")
    .classList.remove(
      "income-selected"
    );
}


function limparFormulario() {

  state.editandoId =
    null;


  $("descricao").value =
    "";


  $("valor").value =
    "";


  $("data").value =
    "";


  selecionarTipo(
    "RECEITA"
  );


  $("formBadge")
    .textContent =
    "Novo lancamento";


  $("formTitulo")
    .textContent =
    "Adicionar movimentacao";


  $("salvarMovimentacao")
    .textContent =
    "Adicionar movimentacao";


  $("cancelarEdicao")
    .classList.add(
      "hidden"
    );
}


function iniciarEdicao(id) {

  const item =
    state.movimentacoes.find(
      function (movimentacao) {

        return (
          movimentacao.id === id
        );

      }
    );


  if (!item) {
    return;
  }


  state.editandoId =
    item.id;


  $("descricao").value =
    item.descricao;


  $("valor").value =
    String(
      item.valor
    );


  $("data").value =
    String(
      item.data
    ).slice(
      0,
      10
    );


  selecionarTipo(
    item.tipo
  );


  $("formBadge")
    .textContent =
    "Edicao";


  $("formTitulo")
    .textContent =
    "Atualizar movimentacao";


  $("salvarMovimentacao")
    .textContent =
    "Salvar alteracoes";


  $("cancelarEdicao")
    .classList.remove(
      "hidden"
    );


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


async function salvarMovimentacao() {

  const descricao =
    $("descricao")
      .value
      .trim();


  const valorTexto =
    $("valor")
      .value
      .trim()
      .replace(
        ",",
        "."
      );


  const valor =
    Number(
      valorTexto
    );


  const data =
    $("data").value;


  if (
    !descricao ||
    !valorTexto
  ) {

    mostrarErro(
      "Preencha a descricao e o valor."
    );

    return;
  }


  if (
    !Number.isFinite(valor) ||
    valor <= 0
  ) {

    mostrarErro(
      "Informe um valor financeiro valido."
    );

    return;
  }


  const botao =
    $("salvarMovimentacao");


  try {

    limparErro();


    botao.disabled = true;

    botao.textContent =
      "Salvando...";


    await api(
      "/api/financeiro",
      {
        method:
          state.editandoId
            ? "PUT"
            : "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            id:
              state.editandoId,

            descricao,

            valor,

            tipo:
              state.tipo,

            data:
              data ||
              undefined
          })
      }
    );


    limparFormulario();

    await carregarMovimentacoes();

  }
  catch (erro) {

    mostrarErro(
      erro.message ||
      "Nao foi possivel salvar a movimentacao."
    );
  }
  finally {

    botao.disabled = false;


    botao.textContent =
      state.editandoId
        ? "Salvar alteracoes"
        : "Adicionar movimentacao";
  }
}


async function excluirMovimentacao(
  id
) {

  const confirmar =
    window.confirm(
      "Deseja realmente excluir esta movimentacao?"
    );


  if (!confirmar) {
    return;
  }


  try {

    limparErro();


    await api(
      "/api/financeiro?id=" +
      encodeURIComponent(id),
      {
        method: "DELETE"
      }
    );


    if (
      state.editandoId === id
    ) {

      limparFormulario();
    }


    await carregarMovimentacoes();

  }
  catch (erro) {

    mostrarErro(
      erro.message ||
      "Nao foi possivel excluir a movimentacao."
    );
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


$("tipoReceita")
  .addEventListener(
    "click",
    function () {

      selecionarTipo(
        "RECEITA"
      );
    }
  );


$("tipoDespesa")
  .addEventListener(
    "click",
    function () {

      selecionarTipo(
        "DESPESA"
      );
    }
  );


$("salvarMovimentacao")
  .addEventListener(
    "click",
    salvarMovimentacao
  );


$("cancelarEdicao")
  .addEventListener(
    "click",
    limparFormulario
  );


$("inicio")
  .addEventListener(
    "change",
    carregarMovimentacoes
  );


$("fim")
  .addEventListener(
    "change",
    carregarMovimentacoes
  );


$("limparPeriodo")
  .addEventListener(
    "click",
    function () {

      $("inicio").value =
        "";

      $("fim").value =
        "";

      carregarMovimentacoes();
    }
  );


$("atualizarTopo")
  .addEventListener(
    "click",
    carregarMovimentacoes
  );


$("atualizarHistorico")
  .addEventListener(
    "click",
    carregarMovimentacoes
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

    selecionarTipo(
      "RECEITA"
    );

    await carregarMovimentacoes();

  }
  catch (erro) {

    console.error(erro);
  }
}


iniciar();
