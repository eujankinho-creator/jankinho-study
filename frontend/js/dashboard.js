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
    dados.usuario;


  if (!usuario) {

    location.href =
      "/login.html";

    return null;

  }


  const nome =
    usuario.nome ||
    "Usuário";

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


  return usuario;

}


function mensagemDashboard(
  respondidas,
  percentual
) {

  if (respondidas === 0) {

    return "Comece sua primeira sessão de estudos.";

  }


  if (percentual >= 90) {

    return "Excelente desempenho. Continue mantendo o ritmo.";

  }


  if (percentual >= 75) {

    return "Bom ritmo. Mais algumas questões podem elevar seu desempenho.";

  }


  if (percentual >= 50) {

    return "Você está evoluindo. Foque nas questões que errou.";

  }


  return "Vamos começar. Cada questão respondida melhora seu domínio.";

}


function renderDisciplinas(
  disciplinas,
  respostas
) {

  const container =
    $("disciplinasContainer");


  const desempenho =
    disciplinas
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

                return resposta.correta;

              }
            ).length;


          const percentual =
            total > 0
              ? Math.round(
                  (acertos / total) *
                  100
                )
              : 0;


          return {
            id: disciplina.id,
            nome: disciplina.nome,
            total,
            percentual
          };

        }
      )
      .filter(
        function (item) {

          return item.total > 0;

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
      .slice(0, 5);


  if (
    desempenho.length === 0
  ) {

    container.innerHTML =
      '<div class="empty">' +
      'Ainda não há dados.<br>' +
      'Resolva algumas questões para acompanhar seu desempenho.' +
      '</div>';

    return;

  }


  container.innerHTML =
    desempenho
      .map(
        function (item) {

          let classe =
            "red";

          if (
            item.percentual >= 80
          ) {

            classe =
              "green";

          }
          else if (
            item.percentual >= 60
          ) {

            classe =
              "orange";

          }


          return `
            <div>

              <div class="disciplina-header">

                <strong>
                  ${escapeHtml(item.nome)}
                </strong>

                <div class="disciplina-info">

                  <span>
                    ${item.total}
                    questões
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


  const recentes =
    respostas.slice(0, 5);


  if (
    recentes.length === 0
  ) {

    container.innerHTML =
      '<div class="empty">' +
      'Nenhuma atividade ainda.' +
      '</div>';

    return;

  }


  container.innerHTML =
    recentes
      .map(
        function (resposta) {

          const correta =
            resposta.correta;


          const enunciado =
            resposta.questao
              ? resposta.questao.enunciado
              : "Questão respondida";


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
                    ? "✓"
                    : "×"
                }
              </div>

              <div class="activity-content">

                <strong>
                  ${escapeHtml(enunciado)}
                </strong>

                <span>
                  ${escapeHtml(disciplina)}
                  ·
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


async function carregarDashboard() {

  try {

    await carregarUsuario();


    const [
      questoesResponse,
      respostasResponse,
      disciplinasResponse,
      financeiroResponse
    ] =
      await Promise.all([
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


    if (
      questoesResponse.status === 401
    ) {

      location.href =
        "/login.html";

      return;

    }


    const questoes =
      questoesResponse.ok
        ? await questoesResponse.json()
        : [];


    const respostas =
      respostasResponse.ok
        ? await respostasResponse.json()
        : [];


    const disciplinas =
      disciplinasResponse.ok
        ? await disciplinasResponse.json()
        : [];


    const financeiro =
      financeiroResponse.ok
        ? await financeiroResponse.json()
        : {
            resumo: {
              receitas: 0,
              despesas: 0,
              saldo: 0
            }
          };


    const totalQuestoes =
      Array.isArray(questoes)
        ? questoes.length
        : 0;


    const totalRespondidas =
      Array.isArray(respostas)
        ? respostas.length
        : 0;


    const totalAcertos =
      Array.isArray(respostas)
        ? respostas.filter(
            function (resposta) {

              return resposta.correta;

            }
          ).length
        : 0;


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
      percentual + "%";


    $("mensagemHero")
      .textContent =
      mensagemDashboard(
        totalRespondidas,
        percentual
      );


    $("progressoPercentual")
      .textContent =
      progresso + "%";


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
      Array.isArray(disciplinas)
        ? disciplinas
        : [],
      Array.isArray(respostas)
        ? respostas
        : []
    );


    renderAtividade(
      Array.isArray(respostas)
        ? respostas
        : []
    );


    const resumo =
      financeiro.resumo || {
        receitas: 0,
        despesas: 0,
        saldo: 0
      };


    $("saldo")
      .textContent =
      moeda(resumo.saldo);


    $("receitas")
      .textContent =
      moeda(resumo.receitas);


    $("despesas")
      .textContent =
      moeda(resumo.despesas);

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


$("logoutSidebar")
  .addEventListener(
    "click",
    sair
  );


const overlay =
  $("mobileOverlay");


$("abrirMenu")
  .addEventListener(
    "click",
    function () {

      overlay.classList.add(
        "open"
      );

    }
  );


function fecharMenu() {

  overlay.classList.remove(
    "open"
  );

}


$("fecharMenu")
  .addEventListener(
    "click",
    fecharMenu
  );


$("fecharOverlay")
  .addEventListener(
    "click",
    fecharMenu
  );


carregarDashboard();
