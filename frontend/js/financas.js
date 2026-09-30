const state = {
  movimentacoes: [],
  resumo: {
    receitas: 0,
    despesas: 0,
    dividas: 0,
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
        dividas: 0,
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


  const dividas =
    Number(
      state.resumo.dividas ||
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


  const quantidadeDividas =
    state.movimentacoes.filter(
      function (item) {

        return (
          item.tipo ===
          "DIVIDA"
        );

      }
    ).length;


  $("receitasTotal")
    .textContent =
    moeda(receitas);


  $("despesasTotal")
    .textContent =
    moeda(despesas);


  $("dividasTotal")
    .textContent =
    moeda(dividas);


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


  $("quantidadeDividas")
    .textContent =
    quantidadeDividas +
    (
      quantidadeDividas === 1
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


  if (
    saldo >= 0
  ) {

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
    moeda(
      despesas
    );


  const totalSaidas =
    despesas;


  const maior =
    Math.max(
      receitas,
      totalSaidas,
      1
    );


  $("barReceitas")
    .style.width =
    Math.min(
      100,
      receitas /
      maior *
      100
    ) +
    "%";


  $("barDespesas")
    .style.width =
    Math.min(
      100,
      totalSaidas /
      maior *
      100
    ) +
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
    state.movimentacoes.length ===
    0
  ) {

    container.innerHTML =
      '<div class="empty">' +
      'Nenhuma movimentacao registrada.' +
      '</div>';

    return;

  }


  function tipoVisual(
    tipo
  ) {

    if (
      tipo ===
      "RECEITA"
    ) {

      return {
        classe:
          "income",

        fundo:
          "income-bg",

        simbolo:
          "\u2191",

        nome:
          "Receita",

        sinal:
          "+"
      };

    }


    if (
      tipo ===
      "DIVIDA"
    ) {

      return {
        classe:
          "debt",

        fundo:
          "debt-bg",

        simbolo:
          "!",

        nome:
          "Divida",

        sinal:
          "-"
      };

    }


    return {
      classe:
        "expense",

      fundo:
        "expense-bg",

      simbolo:
        "\u2193",

      nome:
        "Despesa",

      sinal:
        "-"
    };

  }


  container.innerHTML =
    state.movimentacoes
      .map(
        function (item) {

          const visual =
            tipoVisual(
              item.tipo
            );


          if (
            item.tipo ===
              "DIVIDA" &&
            item.quitada
          ) {

            visual.nome =
              "Divida quitada";

            visual.classe =
              "debt-paid";

            visual.fundo =
              "debt-paid-bg";

            visual.simbolo =
              "\u2713";

          }


          return `
            <div class="movement-item">

              <div
                class="movement-icon ${visual.fundo}"
              >
                ${visual.simbolo}
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
                    class="${visual.classe}"
                  >
                    ${visual.nome}
                  </span>

                </div>

              </div>


              <div
                class="movement-value ${visual.classe}"
              >
                ${visual.sinal}
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

function moedaCompacta(valor) {

  const numero =
    Number(
      valor || 0
    );


  try {

    return new Intl.NumberFormat(
      "pt-BR",
      {
        style:
          "currency",

        currency:
          "BRL",

        notation:
          "compact",

        maximumFractionDigits:
          1
      }
    ).format(numero);

  }
  catch {

    return moeda(numero);

  }

}


function dataFinanceiraLocal(valor) {

  const texto =
    String(
      valor || ""
    );


  const match =
    texto.match(
      /^(\d{4})-(\d{2})-(\d{2})/
    );


  if (match) {

    return new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3])
    );

  }


  const data =
    new Date(valor);


  if (
    Number.isNaN(
      data.getTime()
    )
  ) {

    return null;

  }


  return data;

}


function chaveMesFinanceiro(data) {

  return (
    data.getFullYear() +
    "-" +
    String(
      data.getMonth() + 1
    ).padStart(
      2,
      "0"
    )
  );

}


function labelMesFinanceiro(chave) {

  const partes =
    chave.split("-");


  const data =
    new Date(
      Number(partes[0]),
      Number(partes[1]) - 1,
      1
    );


  return data
    .toLocaleDateString(
      "pt-BR",
      {
        month:
          "short",

        year:
          "2-digit"
      }
    )
    .replace(
      ".",
      ""
    );

}


function labelDataFinanceira(data) {

  return data.toLocaleDateString(
    "pt-BR",
    {
      day:
        "2-digit",

      month:
        "2-digit"
    }
  );

}


function renderFluxoMensal() {

  const container =
    $("fluxoMensalChart");


  const resumo =
    $("fluxoMensalResumo");


  if (!container) {
    return;
  }


  const mapa =
    new Map();


  state.movimentacoes.forEach(
    function (item) {

      const data =
        dataFinanceiraLocal(
          item.data
        );


      if (!data) {
        return;
      }


      const chave =
        chaveMesFinanceiro(
          data
        );


      if (!mapa.has(chave)) {

        mapa.set(
          chave,
          {
            receitas: 0,
            despesas: 0
          }
        );

      }


      const registro =
        mapa.get(chave);


      const valor =
        Number(
          item.valor || 0
        );


      if (
        item.tipo ===
        "RECEITA"
      ) {

        registro.receitas +=
          valor;

      }
      else if (
        item.tipo ===
          "DESPESA" ||
        (
          item.tipo ===
            "DIVIDA" &&
          item.quitada
        )
      ) {

        registro.despesas +=
          valor;

      }

    }
  );


  const meses =
    Array.from(
      mapa.entries()
    )
      .sort(
        function (a, b) {

          return a[0]
            .localeCompare(
              b[0]
            );

        }
      );


  if (
    meses.length ===
    0
  ) {

    container.innerHTML =
      '<div class="chart-empty">' +
      'Adicione movimentacoes para visualizar o fluxo mensal.' +
      '</div>';


    if (resumo) {
      resumo.textContent =
        "Sem dados";
    }


    return;

  }


  const maior =
    Math.max(
      1,
      ...meses.map(
        function (entry) {

          return Math.max(
            entry[1].receitas,
            entry[1].despesas
          );

        }
      )
    );


  const width =
    Math.max(
      640,
      meses.length * 92
    );


  const height =
    290;


  const left =
    70;


  const right =
    22;


  const top =
    20;


  const bottom =
    48;


  const plotWidth =
    width -
    left -
    right;


  const plotHeight =
    height -
    top -
    bottom;


  const slot =
    plotWidth /
    meses.length;


  const barWidth =
    Math.min(
      22,
      slot * .27
    );


  let svg =
    '<div class="chart-scroll">' +
    '<svg ' +
    'class="finance-chart-svg" ' +
    'width="' + width + '" ' +
    'height="' + height + '" ' +
    'viewBox="0 0 ' +
    width + ' ' + height + '" ' +
    'role="img" ' +
    'aria-label="Grafico mensal de receitas e despesas">' ;


  for (
    let i = 0;
    i <= 4;
    i += 1
  ) {

    const y =
      top +
      (
        plotHeight /
        4
      ) *
      i;


    const valor =
      maior *
      (
        1 -
        i / 4
      );


    svg +=
      '<line ' +
      'class="chart-grid" ' +
      'x1="' + left + '" ' +
      'x2="' + (width - right) + '" ' +
      'y1="' + y + '" ' +
      'y2="' + y + '">' +
      '</line>';


    svg +=
      '<text ' +
      'x="' + (left - 10) + '" ' +
      'y="' + (y + 3) + '" ' +
      'text-anchor="end">' +
      escapeHtml(
        moedaCompacta(
          valor
        )
      ) +
      '</text>';

  }


  meses.forEach(
    function (
      entry,
      index
    ) {

      const chave =
        entry[0];


      const dados =
        entry[1];


      const centro =
        left +
        slot *
        index +
        slot /
        2;


      const receitaHeight =
        dados.receitas /
        maior *
        plotHeight;


      const despesaHeight =
        dados.despesas /
        maior *
        plotHeight;


      const receitaX =
        centro -
        barWidth -
        3;


      const despesaX =
        centro +
        3;


      const receitaY =
        top +
        plotHeight -
        receitaHeight;


      const despesaY =
        top +
        plotHeight -
        despesaHeight;


      svg +=
        '<rect ' +
        'class="chart-income-bar" ' +
        'x="' + receitaX + '" ' +
        'y="' + receitaY + '" ' +
        'width="' + barWidth + '" ' +
        'height="' +
        Math.max(
          receitaHeight,
          1
        ) +
        '" rx="4">' +
        '<title>Receitas: ' +
        escapeHtml(
          moeda(
            dados.receitas
          )
        ) +
        '</title>' +
        '</rect>';


      svg +=
        '<rect ' +
        'class="chart-expense-bar" ' +
        'x="' + despesaX + '" ' +
        'y="' + despesaY + '" ' +
        'width="' + barWidth + '" ' +
        'height="' +
        Math.max(
          despesaHeight,
          1
        ) +
        '" rx="4">' +
        '<title>Despesas: ' +
        escapeHtml(
          moeda(
            dados.despesas
          )
        ) +
        '</title>' +
        '</rect>';


      svg +=
        '<text ' +
        'x="' + centro + '" ' +
        'y="' + (height - 18) + '" ' +
        'text-anchor="middle">' +
        escapeHtml(
          labelMesFinanceiro(
            chave
          )
        ) +
        '</text>';

    }
  );


  svg +=
    '</svg>' +
    '</div>';


  container.innerHTML =
    svg;


  if (resumo) {

    resumo.textContent =
      meses.length +
      (
        meses.length === 1
          ? " mes"
          : " meses"
      );

  }

}


function renderSaldoEvolucao() {

  const container =
    $("saldoEvolucaoChart");


  const resumo =
    $("saldoTendenciaResumo");


  if (!container) {
    return;
  }


  const mapa =
    new Map();


  state.movimentacoes.forEach(
    function (item) {

      const data =
        dataFinanceiraLocal(
          item.data
        );


      if (!data) {
        return;
      }


      const chave =
        (
          data.getFullYear() +
          "-" +
          String(
            data.getMonth() + 1
          ).padStart(
            2,
            "0"
          ) +
          "-" +
          String(
            data.getDate()
          ).padStart(
            2,
            "0"
          )
        );


      if (!mapa.has(chave)) {

        mapa.set(
          chave,
          {
            data,
            valor: 0
          }
        );

      }


      const registro =
        mapa.get(chave);


      const valor =
        Number(
          item.valor || 0
        );


      if (
        item.tipo ===
        "RECEITA"
      ) {

        registro.valor +=
          valor;

      }
      else if (
        item.tipo ===
          "DESPESA" ||
        (
          item.tipo ===
            "DIVIDA" &&
          item.quitada
        )
      ) {

        registro.valor -=
          valor;

      }

    }
  );


  const dias =
    Array.from(
      mapa.values()
    )
      .sort(
        function (a, b) {

          return (
            a.data.getTime() -
            b.data.getTime()
          );

        }
      );


  if (
    dias.length ===
    0
  ) {

    container.innerHTML =
      '<div class="chart-empty">' +
      'Adicione movimentacoes para visualizar a evolucao do saldo.' +
      '</div>';


    if (resumo) {
      resumo.textContent =
        "Sem dados";
    }


    return;

  }


  let acumulado =
    0;


  const pontos =
    dias.map(
      function (dia) {

        acumulado +=
          dia.valor;


        return {
          data:
            dia.data,

          saldo:
            acumulado
        };

      }
    );


  const valores =
    pontos.map(
      function (ponto) {

        return ponto.saldo;

      }
    );


  let minimo =
    Math.min(
      0,
      ...valores
    );


  let maximo =
    Math.max(
      0,
      ...valores
    );


  if (
    minimo === maximo
  ) {

    maximo =
      minimo + 1;

  }


  const width =
    Math.max(
      640,
      pontos.length * 54
    );


  const height =
    290;


  const left =
    70;


  const right =
    22;


  const top =
    20;


  const bottom =
    48;


  const plotWidth =
    width -
    left -
    right;


  const plotHeight =
    height -
    top -
    bottom;


  function x(index) {

    if (
      pontos.length ===
      1
    ) {

      return (
        left +
        plotWidth /
        2
      );

    }


    return (
      left +
      (
        index /
        (
          pontos.length -
          1
        )
      ) *
      plotWidth
    );

  }


  function y(valor) {

    return (
      top +
      (
        maximo -
        valor
      ) /
      (
        maximo -
        minimo
      ) *
      plotHeight
    );

  }


  const zeroY =
    y(0);


  let path =
    "";


  pontos.forEach(
    function (
      ponto,
      index
    ) {

      path +=
        (
          index === 0
            ? "M "
            : " L "
        ) +
        x(index) +
        " " +
        y(
          ponto.saldo
        );

    }
  );


  const areaPath =
    "M " +
    x(0) +
    " " +
    zeroY +
    " " +
    path.replace(
      /^M /,
      "L "
    ) +
    " L " +
    x(
      pontos.length - 1
    ) +
    " " +
    zeroY +
    " Z";


  let svg =
    '<div class="chart-scroll">' +
    '<svg ' +
    'class="finance-chart-svg" ' +
    'width="' + width + '" ' +
    'height="' + height + '" ' +
    'viewBox="0 0 ' +
    width + ' ' + height + '" ' +
    'role="img" ' +
    'aria-label="Grafico de evolucao do saldo acumulado">' ;


  for (
    let i = 0;
    i <= 4;
    i += 1
  ) {

    const valor =
      maximo -
      (
        maximo -
        minimo
      ) *
      (
        i / 4
      );


    const gridY =
      y(valor);


    svg +=
      '<line ' +
      'class="chart-grid" ' +
      'x1="' + left + '" ' +
      'x2="' + (width - right) + '" ' +
      'y1="' + gridY + '" ' +
      'y2="' + gridY + '">' +
      '</line>';


    svg +=
      '<text ' +
      'x="' + (left - 10) + '" ' +
      'y="' + (gridY + 3) + '" ' +
      'text-anchor="end">' +
      escapeHtml(
        moedaCompacta(
          valor
        )
      ) +
      '</text>';

  }


  if (
    minimo < 0 &&
    maximo > 0
  ) {

    svg +=
      '<line ' +
      'class="chart-zero" ' +
      'x1="' + left + '" ' +
      'x2="' + (width - right) + '" ' +
      'y1="' + zeroY + '" ' +
      'y2="' + zeroY + '">' +
      '</line>';

  }


  svg +=
    '<path ' +
    'class="chart-balance-area" ' +
    'd="' + areaPath + '">' +
    '</path>';


  svg +=
    '<path ' +
    'class="chart-balance-line" ' +
    'd="' + path + '">' +
    '</path>';


  const labelStep =
    Math.max(
      1,
      Math.ceil(
        pontos.length /
        6
      )
    );


  pontos.forEach(
    function (
      ponto,
      index
    ) {

      if (
        pontos.length <= 32 ||
        index ===
        pontos.length - 1
      ) {

        svg +=
          '<circle ' +
          'class="chart-balance-point" ' +
          'cx="' + x(index) + '" ' +
          'cy="' +
          y(
            ponto.saldo
          ) +
          '" r="3.5">' +
          '<title>' +
          escapeHtml(
            labelDataFinanceira(
              ponto.data
            )
          ) +
          ': ' +
          escapeHtml(
            moeda(
              ponto.saldo
            )
          ) +
          '</title>' +
          '</circle>';

      }


      if (
        index %
        labelStep ===
        0 ||
        index ===
        pontos.length - 1
      ) {

        svg +=
          '<text ' +
          'x="' + x(index) + '" ' +
          'y="' + (height - 18) + '" ' +
          'text-anchor="middle">' +
          escapeHtml(
            labelDataFinanceira(
              ponto.data
            )
          ) +
          '</text>';

      }

    }
  );


  svg +=
    '</svg>' +
    '</div>';


  container.innerHTML =
    svg;


  if (resumo) {

    const saldoFinal =
      pontos[
        pontos.length - 1
      ].saldo;


    resumo.textContent =
      moeda(
        saldoFinal
      );

  }

}


function atualizarHeroFinanceiro() {

  const heroSaldo =
    $("heroSaldo");


  const heroPeriodo =
    $("heroPeriodo");


  const saldo =
    Number(
      state.resumo.saldo || 0
    );


  if (heroSaldo) {

    heroSaldo.textContent =
      moeda(saldo);


    heroSaldo.classList.toggle(
      "negative",
      saldo < 0
    );

  }


  if (heroPeriodo) {

    const inicio =
      $("inicio").value;


    const fim =
      $("fim").value;


    if (
      inicio ||
      fim
    ) {

      heroPeriodo.textContent =
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

      heroPeriodo.textContent =
        "Todas as movimentacoes";

    }

  }

}


function renderGraficosFinanceiros() {

  atualizarHeroFinanceiro();

  renderFluxoMensal();

  renderSaldoEvolucao();

}

function renderDividasPendentes() {

  const container =
    $("dividasPendentesLista");


  const resumo =
    $("dividasPendentesResumo");


  if (!container) {
    return;
  }


  const dividas =
    state.movimentacoes.filter(
      function (
        item
      ) {

        return (
          item.tipo ===
            "DIVIDA" &&
          !item.quitada
        );

      }
    );


  const total =
    dividas.reduce(
      function (
        soma,
        item
      ) {

        return (
          soma +
          Number(
            item.valor ||
            0
          )
        );

      },
      0
    );


  if (
    resumo
  ) {

    resumo.textContent =
      dividas.length ===
      0
        ? "Nenhuma pendente"
        : dividas.length +
          (
            dividas.length ===
            1
              ? " pendente - "
              : " pendentes - "
          ) +
          moeda(
            total
          );

  }


  if (
    dividas.length ===
    0
  ) {

    container.innerHTML =
      '<div class="debt-empty">' +
      '<strong>Tudo em dia</strong>' +
      '<span>Nao ha dividas pendentes.</span>' +
      '</div>';


    return;

  }


  container.innerHTML =
    dividas
      .map(
        function (
          item
        ) {

          return `
            <article class="debt-item">

              <div class="debt-item-main">

                <div class="debt-item-icon">
                  !
                </div>

                <div>

                  <strong>
                    ${escapeHtml(
                      item.descricao
                    )}
                  </strong>

                  <span>
                    ${formatarData(
                      item.data
                    )}
                  </span>

                </div>

              </div>


              <strong class="debt-item-value">
                ${moeda(
                  item.valor
                )}
              </strong>


              <button
                class="pay-debt-button"
                data-pay-debt="${item.id}"
                type="button"
              >
                Quitar
              </button>

            </article>
          `;

        }
      )
      .join("");


  container
    .querySelectorAll(
      "[data-pay-debt]"
    )
    .forEach(
      function (
        button
      ) {

        button.addEventListener(
          "click",
          function () {

            quitarDivida(
              Number(
                button.dataset
                  .payDebt
              )
            );

          }
        );

      }
    );

}


async function quitarDivida(
  id
) {

  const divida =
    state.movimentacoes.find(
      function (
        item
      ) {

        return (
          item.id ===
            id &&
          item.tipo ===
            "DIVIDA"
        );

      }
    );


  if (!divida) {
    return;
  }


  const confirmar =
    window.confirm(
      "Confirmar quitacao de " +
      divida.descricao +
      " no valor de " +
      moeda(
        divida.valor
      ) +
      "?"
    );


  if (!confirmar) {
    return;
  }


  try {

    limparErro();


    await api(
      "/api/financeiro/quitar",
      {

        method:
          "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            id
          })

      }
    );


    await carregarMovimentacoes();

  }
  catch (
    erro
  ) {

    mostrarErro(
      erro.message ||
      "Nao foi possivel quitar a divida."
    );

  }

}


function renderTudo() {

  renderResumo();

  renderFiltro();

  renderMovimentacoes();

  renderDividasPendentes();

  renderGraficosFinanceiros();

}


function selecionarTipo(
  tipo
) {

  state.tipo =
    tipo;


  const receita =
    $("tipoReceita");


  const despesa =
    $("tipoDespesa");


  const divida =
    $("tipoDivida");


  receita
    .classList
    .toggle(
      "income-selected",
      tipo ===
      "RECEITA"
    );


  despesa
    .classList
    .toggle(
      "expense-selected",
      tipo ===
      "DESPESA"
    );


  if (
    divida
  ) {

    divida
      .classList
      .toggle(
        "debt-selected",
        tipo ===
        "DIVIDA"
      );

  }

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


$("tipoDivida")
  .addEventListener(
    "click",
    function () {

      selecionarTipo(
        "DIVIDA"
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

    selecionarTipo(
      "RECEITA"
    );


    await Promise.all([
      carregarUsuario(),
      carregarMovimentacoes()
    ]);

  }
  catch (erro) {

    console.error(
      erro
    );

  }

}


iniciar();
