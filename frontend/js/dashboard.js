const $ = function (id) {
  return document.getElementById(id);
};


function moeda(valor) {

  return Number(valor || 0)
    .toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    );

}


function dataCurta(data) {

  return new Date(data)
    .toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "short"
      }
    );

}


function escapeHtml(texto) {

  const div =
    document.createElement("div");

  div.textContent =
    String(texto ?? "");

  return div.innerHTML;

}


function mesmoDia(a, b) {

  const dataA =
    new Date(a);

  const dataB =
    new Date(b);


  return (
    dataA.getFullYear() ===
      dataB.getFullYear() &&
    dataA.getMonth() ===
      dataB.getMonth() &&
    dataA.getDate() ===
      dataB.getDate()
  );

}


function atualizarData() {

  const elemento =
    $("dashboardDate");


  if (!elemento) {
    return;
  }


  const texto =
    new Intl.DateTimeFormat(
      "pt-BR",
      {
        weekday: "long",
        day: "2-digit",
        month: "long"
      }
    )
      .format(
        new Date()
      );


  elemento.textContent =
    texto.charAt(0).toUpperCase() +
    texto.slice(1);

}


async function carregarUsuario() {

  const resposta =
    await fetch(
      "/api/auth/me",
      {
        credentials:
          "same-origin"
      }
    );


  if (!resposta.ok) {

    location.href =
      "/login.html";

    return null;
  }


  const dados =
    await resposta.json();


  const usuario =
    dados.usuario ||
    dados;


  if (!usuario) {

    location.href =
      "/login.html";

    return null;
  }


  const nome =
    usuario.nome ||
    "Usu\u00e1rio";


  const inicial =
    nome
      .charAt(0)
      .toUpperCase();


  const nomeSidebar =
    $("nomeSidebar");

  const emailSidebar =
    $("emailSidebar");

  const nomeHeader =
    $("nomeHeader");

  const avatarSidebar =
    $("avatarSidebar");

  const avatarHeader =
    $("avatarHeader");


  if (nomeSidebar) {
    nomeSidebar.textContent =
      nome;
  }


  if (emailSidebar) {
    emailSidebar.textContent =
      usuario.email || "";
  }


  if (nomeHeader) {
    nomeHeader.textContent =
      nome;
  }


  if (avatarSidebar) {
    avatarSidebar.textContent =
      inicial;
  }


  if (avatarHeader) {
    avatarHeader.textContent =
      inicial;
  }


  return usuario;

}


function mensagemDashboard(
  respondidas,
  percentual
) {

  if (respondidas === 0) {

    return (
      "Comece sua primeira sess\u00e3o " +
      "de estudos no Cortex."
    );
  }


  if (percentual >= 90) {

    return (
      "Excelente desempenho. " +
      "Continue mantendo o ritmo."
    );
  }


  if (percentual >= 75) {

    return (
      "Bom ritmo. Mais algumas quest\u00f5es " +
      "podem elevar seu desempenho."
    );
  }


  if (percentual >= 50) {

    return (
      "Voc\u00ea est\u00e1 evoluindo. " +
      "Use seus erros para direcionar a pr\u00f3xima sess\u00e3o."
    );
  }


  return (
    "Cada quest\u00e3o respondida ajuda a " +
    "construir consist\u00eancia."
  );

}


function renderDisciplinas(
  disciplinas,
  respostas
) {

  const container =
    $("disciplinasContainer");


  if (!container) {
    return;
  }


  /*
   * Une disciplinas da API com disciplinas
   * encontradas nas respostas.
   *
   * Isso permite exibir desempenho de
   * conteudos globais tambem.
   */
  const mapa =
    new Map();


  disciplinas.forEach(
    function (disciplina) {

      if (
        disciplina &&
        disciplina.id
      ) {

        mapa.set(
          disciplina.id,
          {
            id:
              disciplina.id,

            nome:
              disciplina.nome ||
              "Disciplina"
          }
        );
      }

    }
  );


  respostas.forEach(
    function (resposta) {

      const disciplina =
        resposta.questao &&
        resposta.questao.disciplina;


      if (
        disciplina &&
        disciplina.id &&
        !mapa.has(
          disciplina.id
        )
      ) {

        mapa.set(
          disciplina.id,
          {
            id:
              disciplina.id,

            nome:
              disciplina.nome ||
              "Disciplina"
          }
        );
      }

    }
  );


  const desempenho =
    Array.from(
      mapa.values()
    )
      .map(
        function (disciplina) {

          const lista =
            respostas.filter(
              function (resposta) {

                return (
                  resposta.questao &&
                  resposta.questao.disciplina &&
                  resposta.questao.disciplina.id ===
                    disciplina.id
                );

              }
            );


          const total =
            lista.length;


          const acertos =
            lista.filter(
              function (resposta) {

                return Boolean(
                  resposta.correta
                );

              }
            ).length;


          const percentual =
            total > 0
              ? Math.round(
                  (
                    acertos /
                    total
                  ) *
                  100
                )
              : 0;


          return {
            id:
              disciplina.id,

            nome:
              disciplina.nome,

            total,

            percentual
          };

        }
      )
      .filter(
        function (item) {

          return (
            item.total >
            0
          );

        }
      )
      .sort(
        function (a, b) {

          return (
            b.total -
            a.total
          );

        }
      )
      .slice(
        0,
        5
      );


  if (
    desempenho.length ===
    0
  ) {

    container.innerHTML =
      [
        '<div class="empty">',
        'Ainda n\u00e3o h\u00e1 dados.<br>',
        'Resolva algumas quest\u00f5es para ',
        'acompanhar seu desempenho.',
        '</div>'
      ].join("");

    return;
  }


  container.innerHTML =
    desempenho
      .map(
        function (item) {

          let classe =
            "red";


          if (
            item.percentual >=
            80
          ) {

            classe =
              "green";

          }
          else if (
            item.percentual >=
            60
          ) {

            classe =
              "orange";

          }


          return `
            <div class="disciplina-row">

              <div class="disciplina-header">

                <strong>
                  ${escapeHtml(item.nome)}
                </strong>

                <div class="disciplina-info">

                  <span>
                    ${item.total}
                    quest\u00f5es
                  </span>

                  <b class="${classe}">
                    ${item.percentual}%
                  </b>

                </div>

              </div>

              <div class="progress-bar">

                <div
                  style="width:${item.percentual}%"
                ></div>

              </div>

            </div>
          `;

        }
      )
      .join("");

}


function renderAtividade(
  respostas
) {

  const container =
    $("atividadeContainer");


  if (!container) {
    return;
  }


  const recentes =
    respostas
      .slice(
        0,
        5
      );


  if (
    recentes.length ===
    0
  ) {

    container.innerHTML =
      [
        '<div class="empty">',
        'Nenhuma atividade ainda.',
        '</div>'
      ].join("");

    return;
  }


  container.innerHTML =
    recentes
      .map(
        function (resposta) {

          const correta =
            Boolean(
              resposta.correta
            );


          const enunciado =
            resposta.questao
              ? resposta.questao.enunciado
              : "Quest\u00e3o respondida";


          const disciplina =
            resposta.questao &&
            resposta.questao.disciplina
              ? resposta.questao.disciplina.nome
              : "Sem disciplina";


          return `
            <div class="activity-item">

              <div
                class="activity-result ${
                  correta
                    ? "correct"
                    : "wrong"
                }"
              >
                ${
                  correta
                    ? "\u2713"
                    : "\u00d7"
                }
              </div>

              <div class="activity-content">

                <strong>
                  ${escapeHtml(enunciado)}
                </strong>

                <span>
                  ${escapeHtml(disciplina)}
                  &middot;
                  ${dataCurta(
                    resposta.respondidaAt
                  )}
                </span>

              </div>

              <span
                class="activity-status ${
                  correta
                    ? "green"
                    : "red"
                }"
              >
                ${
                  correta
                    ? "Acerto"
                    : "Erro"
                }
              </span>

            </div>
          `;

        }
      )
      .join("");

}


function renderHoje(
  respostas
) {

  const hoje =
    new Date();


  const respostasHoje =
    respostas.filter(
      function (resposta) {

        return (
          resposta.respondidaAt &&
          mesmoDia(
            resposta.respondidaAt,
            hoje
          )
        );

      }
    );


  const acertosHoje =
    respostasHoje.filter(
      function (resposta) {

        return Boolean(
          resposta.correta
        );

      }
    ).length;


  const percentualHoje =
    respostasHoje.length > 0
      ? Math.round(
          (
            acertosHoje /
            respostasHoje.length
          ) *
          100
        )
      : 0;


  const hojeRespondidas =
    $("hojeRespondidas");

  const hojeAcertos =
    $("hojeAcertos");

  const hojePercentual =
    $("hojePercentual");


  if (hojeRespondidas) {

    hojeRespondidas.textContent =
      String(
        respostasHoje.length
      );
  }


  if (hojeAcertos) {

    hojeAcertos.textContent =
      String(
        acertosHoje
      );
  }


  if (hojePercentual) {

    hojePercentual.textContent =
      percentualHoje +
      "%";
  }

}


async function carregarDashboard() {

  try {

    atualizarData();


    /*
     * Usuario e dados comecam a carregar
     * ao mesmo tempo para reduzir espera.
     */
    const usuarioPromise =
      carregarUsuario();


    const [
      usuario,
      questoesResponse,
      respostasResponse,
      disciplinasResponse,
      financeiroResponse
    ] =
      await Promise.all([
        usuarioPromise,

        fetch(
          "/api/questoes",
          {
            credentials:
              "same-origin"
          }
        ),

        fetch(
          "/api/respostas",
          {
            credentials:
              "same-origin"
          }
        ),

        fetch(
          "/api/disciplinas",
          {
            credentials:
              "same-origin"
          }
        ),

        fetch(
          "/api/financeiro",
          {
            credentials:
              "same-origin"
          }
        )
      ]);


    if (!usuario) {
      return;
    }


    const respostasApi =
      [
        questoesResponse,
        respostasResponse,
        disciplinasResponse,
        financeiroResponse
      ];


    if (
      respostasApi.some(
        function (response) {

          return (
            response.status ===
            401
          );

        }
      )
    ) {

      location.href =
        "/login.html";

      return;
    }


    const [
      questoes,
      respostas,
      disciplinas,
      financeiro
    ] =
      await Promise.all([
        questoesResponse.ok
          ? questoesResponse.json()
          : Promise.resolve([]),

        respostasResponse.ok
          ? respostasResponse.json()
          : Promise.resolve([]),

        disciplinasResponse.ok
          ? disciplinasResponse.json()
          : Promise.resolve([]),

        financeiroResponse.ok
          ? financeiroResponse.json()
          : Promise.resolve({
              resumo: {
                receitas: 0,
                despesas: 0,
                saldo: 0
              }
            })
      ]);


    const listaQuestoes =
      Array.isArray(questoes)
        ? questoes
        : [];


    const listaRespostas =
      Array.isArray(respostas)
        ? respostas
        : [];


    const listaDisciplinas =
      Array.isArray(disciplinas)
        ? disciplinas
        : [];


    const totalQuestoes =
      listaQuestoes.length;


    const totalRespondidas =
      listaRespostas.length;


    const totalAcertos =
      listaRespostas.filter(
        function (resposta) {

          return Boolean(
            resposta.correta
          );

        }
      ).length;


    const percentual =
      totalRespondidas > 0
        ? Math.round(
            (
              totalAcertos /
              totalRespondidas
            ) *
            100
          )
        : 0;


    const progresso =
      totalQuestoes > 0
        ? Math.min(
            100,
            Math.round(
              (
                totalRespondidas /
                totalQuestoes
              ) *
              100
            )
          )
        : 0;


    $("totalQuestoes")
      .textContent =
      totalQuestoes;


    $("totalRespondidas")
      .textContent =
      totalRespondidas;


    $("totalAcertos")
      .textContent =
      totalAcertos;


    $("percentual")
      .textContent =
      percentual +
      "%";


    $("mensagemHero")
      .textContent =
      mensagemDashboard(
        totalRespondidas,
        percentual
      );


    $("progressoPercentual")
      .textContent =
      progresso +
      "%";


    $("progressoRespondidas")
      .textContent =
      totalRespondidas;


    $("progressoDisponiveis")
      .textContent =
      totalQuestoes;


    const circunferencia =
      263.9;


    const offset =
      circunferencia -
      (
        circunferencia *
        progresso /
        100
      );


    $("progressCircle")
      .style
      .strokeDashoffset =
      String(offset);


    renderDisciplinas(
      listaDisciplinas,
      listaRespostas
    );


    renderAtividade(
      listaRespostas
    );


    renderHoje(
      listaRespostas
    );


    const resumo =
      financeiro &&
      financeiro.resumo
        ? financeiro.resumo
        : {
            receitas: 0,
            despesas: 0,
            saldo: 0
          };


    $("saldo")
      .textContent =
      moeda(
        resumo.saldo
      );


    $("receitas")
      .textContent =
      moeda(
        resumo.receitas
      );


    $("despesas")
      .textContent =
      moeda(
        resumo.despesas
      );


    document.body.classList.add(
      "dashboard-loaded"
    );

  }
  catch (erro) {

    console.error(
      "Erro ao carregar dashboard:",
      erro
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


const logoutSidebar =
  $("logoutSidebar");


if (logoutSidebar) {

  logoutSidebar.addEventListener(
    "click",
    sair
  );

}


const overlay =
  $("mobileOverlay");


const abrirMenu =
  $("abrirMenu");


const fecharMenuBtn =
  $("fecharMenu");


const fecharOverlay =
  $("fecharOverlay");


function fecharMenu() {

  if (!overlay) {
    return;
  }


  overlay.classList.remove(
    "open"
  );

}


if (
  abrirMenu &&
  overlay
) {

  abrirMenu.addEventListener(
    "click",
    function () {

      overlay.classList.add(
        "open"
      );

    }
  );

}


if (fecharMenuBtn) {

  fecharMenuBtn.addEventListener(
    "click",
    fecharMenu
  );

}


if (fecharOverlay) {

  fecharOverlay.addEventListener(
    "click",
    fecharMenu
  );

}


document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key ===
      "Escape"
    ) {

      fecharMenu();

    }

  }
);


carregarDashboard();