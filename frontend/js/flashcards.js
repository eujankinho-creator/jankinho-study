const state = {
  flashcards: [],
  respostas: {},
  estudoCards: [],
  estudoIndex: 0,
  estudoQuantidade: 10,
  cronogramaTaskId: null,
  cronogramaAuto: false,
  cronogramaConcluido: false,
  total: 0,
  pagina: 1,
  paginas: 1,
  filtrosMeta: {
    disciplinas: [],
    assuntos: [],
    subassuntos: [],
    dificuldades: []
  },
  filtros: {
    busca: "",
    disciplina: "",
    assunto: "",
    subassunto: "",
    dificuldade: "",
    estado: ""
  },
  resumo: {
    revisoes: 0,
    acertos: 0,
    erros: 0,
    percentualAcerto: 0
  }
};

const $ = (id) => document.getElementById(id);

function escapeHtml(texto) {
  const div = document.createElement("div");
  div.textContent = String(texto ?? "");
  return div.innerHTML;
}

function mostrarErro(mensagem) {
  $("erroTexto").textContent = mensagem;
  $("erroBox").classList.add("visible");
}

function limparErro() {
  $("erroTexto").textContent = "";
  $("erroBox").classList.remove("visible");
}

async function api(url, options) {
  const resposta = await fetch(url, {
    credentials: "same-origin",
    ...options
  });

  if (resposta.status === 401) {
    location.href = "/login.html";
    throw new Error("Nao autenticado.");
  }

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(dados.error || "Erro na requisicao.");
  }

  return dados;
}

async function carregarUsuario() {
  const dados = await api("/api/auth/me");
  const usuario = dados.usuario;
  const nome = usuario.nome || "Usuario";
  const inicial = nome.charAt(0).toUpperCase();

  $("nomeSidebar").textContent = nome;
  $("emailSidebar").textContent = usuario.email || "";
  $("nomeHeader").textContent = nome;
  $("avatarSidebar").textContent = inicial;
  $("avatarHeader").textContent = inicial;
}

function garantirFiltrosPremium() {
  if ($("flashcardFiltros")) return;

  const searchCard = document.querySelector(".search-card");
  if (!searchCard) return;

  const painel = document.createElement("div");
  painel.id = "flashcardFiltros";
  painel.className = "flashcard-smart-filters";
  painel.innerHTML = `
    <select id="filtroDisciplinaFlash">
      <option value="">Todas as disciplinas</option>
    </select>
    <select id="filtroAssuntoFlash">
      <option value="">Todos os assuntos</option>
    </select>
    <select id="filtroSubassuntoFlash">
      <option value="">Todos os subassuntos</option>
    </select>
    <select id="filtroDificuldadeFlash">
      <option value="">Dificuldade</option>
    </select>
    <select id="filtroEstadoFlash">
      <option value="">Todos</option>
      <option value="favoritos">Favoritos</option>
      <option value="nao-revisados">Não revisados</option>
      <option value="revisados">Revisados</option>
      <option value="errados">Mais errados</option>
      <option value="acertos">Com acertos</option>
      <option value="dificeis">Mais difíceis</option>
    </select>
  `;

  searchCard.appendChild(painel);

  [
    ["filtroDisciplinaFlash", "disciplina"],
    ["filtroAssuntoFlash", "assunto"],
    ["filtroSubassuntoFlash", "subassunto"],
    ["filtroDificuldadeFlash", "dificuldade"],
    ["filtroEstadoFlash", "estado"]
  ].forEach(([id, chave]) => {
    $(id).addEventListener("change", async function () {
      state.filtros[chave] = this.value;

      if (chave === "disciplina") {
        state.filtros.assunto = "";
        state.filtros.subassunto = "";
      }

      if (chave === "assunto") {
        state.filtros.subassunto = "";
      }

      state.pagina = 1;
      await carregarFlashcards();
    });
  });
}

function preencherSelect(id, itens, placeholder, atual) {
  const select = $(id);
  if (!select) return;

  select.innerHTML =
    '<option value="">' + escapeHtml(placeholder) + "</option>" +
    (itens || []).map((item) =>
      '<option value="' + escapeHtml(item) + '">' + escapeHtml(item) + "</option>"
    ).join("");

  select.value = atual || "";
}

function atualizarFiltrosMeta() {
  preencherSelect(
    "filtroDisciplinaFlash",
    state.filtrosMeta.disciplinas,
    "Todas as disciplinas",
    state.filtros.disciplina
  );
  preencherSelect(
    "filtroAssuntoFlash",
    state.filtrosMeta.assuntos,
    "Todos os assuntos",
    state.filtros.assunto
  );
  preencherSelect(
    "filtroSubassuntoFlash",
    state.filtrosMeta.subassuntos,
    "Todos os subassuntos",
    state.filtros.subassunto
  );
  preencherSelect(
    "filtroDificuldadeFlash",
    state.filtrosMeta.dificuldades,
    "Dificuldade",
    state.filtros.dificuldade
  );

  if ($("filtroEstadoFlash")) {
    $("filtroEstadoFlash").value = state.filtros.estado || "";
  }
}

function queryFlashcards() {
  const params = new URLSearchParams();
  params.set("pagina", String(state.pagina));
  params.set("limite", "24");

  Object.entries(state.filtros).forEach(([chave, valor]) => {
    if (!valor) return;
    const apiKey = chave === "tema" ? "assunto" : chave;
    params.set(apiKey, valor);
  });

  return params.toString();
}

async function carregarFlashcards() {
  try {
    limparErro();

    const dados = await api("/api/flashcards?" + queryFlashcards());

    state.flashcards = Array.isArray(dados.itens) ? dados.itens : [];
    state.total = Number(dados.total || 0);
    state.pagina = Number(dados.pagina || 1);
    state.paginas = Number(dados.paginas || 1);
    state.filtrosMeta = dados.filtros || state.filtrosMeta;
    state.resumo = dados.resumo || state.resumo;

    atualizarFiltrosMeta();
    atualizarResumo();
    renderLista();
    renderPaginacao();
  } catch (erro) {
    console.error(erro);
    mostrarErro(erro.message || "Nao foi possivel carregar os flashcards.");
  }
}

function atualizarResumo() {
  $("totalCards").textContent = String(state.total);
  $("cardsEncontrados").textContent = String(state.flashcards.length);
  $("bibliotecaResumo").textContent =
    state.total + (state.total === 1 ? " flashcard disponível." : " flashcards disponíveis.");

  if (state.total > 0) {
    $("statusRevisao").textContent =
      state.resumo.percentualAcerto + "% de acerto";
    $("statusRevisaoDescricao").textContent =
      (state.resumo.revisoes || 0) + " revisões registradas · " +
      (state.resumo.erros || 0) + " erros.";
  } else {
    $("statusRevisao").textContent = "Biblioteca em preparação";
    $("statusRevisaoDescricao").textContent =
      "Os flashcards inteligentes serão adicionados automaticamente.";
  }
}

function frenteVisivelFlashcard(card) {
  return String(card?.frente || "")
    .replace(/^\s*\[[^\]]+\]\s*/, "")
    .trim();
}

function dificuldadeNome(valor) {
  const v = String(valor || "medio").toLowerCase();
  if (v === "facil") return "Fácil";
  if (v === "dificil") return "Difícil";
  return "Médio";
}

function garantirPaginacao() {
  let pager = $("flashcardPager");
  if (pager) return pager;

  const lista = $("flashcardsLista");
  pager = document.createElement("div");
  pager.id = "flashcardPager";
  pager.className = "flashcard-pager";
  lista.insertAdjacentElement("afterend", pager);
  return pager;
}

function renderPaginacao() {
  const pager = garantirPaginacao();

  if (state.paginas <= 1) {
    pager.innerHTML = "";
    pager.classList.add("hidden");
    return;
  }

  pager.classList.remove("hidden");
  pager.innerHTML = `
    <button id="flashPrevPage" class="button-secondary" type="button" ${state.pagina <= 1 ? "disabled" : ""}>
      ← Anterior
    </button>
    <span>Página ${state.pagina} de ${state.paginas} · ${state.total} cards</span>
    <button id="flashNextPage" class="button-secondary" type="button" ${state.pagina >= state.paginas ? "disabled" : ""}>
      Próxima →
    </button>
  `;

  $("flashPrevPage").addEventListener("click", async () => {
    if (state.pagina <= 1) return;
    state.pagina -= 1;
    await carregarFlashcards();
    window.scrollTo({ top: $("flashcardsLista").offsetTop - 100, behavior: "smooth" });
  });

  $("flashNextPage").addEventListener("click", async () => {
    if (state.pagina >= state.paginas) return;
    state.pagina += 1;
    await carregarFlashcards();
    window.scrollTo({ top: $("flashcardsLista").offsetTop - 100, behavior: "smooth" });
  });
}


function renderLista() {
  const container = $("flashcardsLista");

  if (!state.flashcards.length) {
    container.innerHTML =
      '<div class="empty full-width">Nenhum flashcard encontrado para estes filtros.</div>';
    return;
  }

  container.innerHTML = state.flashcards.map((card) => {
    const visivel = state.respostas[card.id] === true;
    const progresso = card.progresso || {};
    const referencias = Array.isArray(card.referenciasQuestoes)
      ? card.referenciasQuestoes
      : [];

    return `
      <article class="flashcard-item smart-flashcard-card">
        <div class="flashcard-top">
          <div class="smart-card-badges">
            <span class="badge badge-orange">${escapeHtml(card.disciplina || "Geral")}</span>
            <span class="badge">${escapeHtml(card.tema || "Geral")}</span>
            <span class="badge">${escapeHtml(dificuldadeNome(card.dificuldade))}</span>
          </div>

          <button
            class="flash-favorite-btn ${progresso.favorito ? "active" : ""}"
            data-favorite-id="${card.id}"
            type="button"
            aria-label="Favoritar flashcard"
            title="Favoritar"
          >★</button>
        </div>

        ${card.subassunto ? '<div class="smart-subtopic">' + escapeHtml(card.subassunto) + "</div>" : ""}

        <div class="flashcard-front">
          <span class="flashcard-label">Pergunta</span>
          <p>${escapeHtml(frenteVisivelFlashcard(card))}</p>
        </div>

        <div class="flashcard-back">
          <span class="flashcard-label">Resposta</span>

          ${visivel
            ? `
              <div class="answer-box">${escapeHtml(card.verso)}</div>
              <button class="text-button toggle-answer" data-id="${card.id}" type="button">
                Ocultar resposta
              </button>
            `
            : `
              <button class="button-secondary toggle-answer" data-id="${card.id}" type="button">
                Mostrar resposta
              </button>
            `
          }

          <div class="smart-card-meta">
            <span>${Number(progresso.revisoes || 0)} revisões</span>
            <span>·</span>
            <span>${Number(progresso.acertos || 0)} acertos</span>
            <span>·</span>
            <span>${Number(progresso.erros || 0)} erros</span>
            ${referencias.length
              ? '<span>· ' + referencias.length + ' questões relacionadas</span>'
              : ""
            }
          </div>
        </div>
      </article>
    `;
  }).join("");

  container.querySelectorAll(".toggle-answer").forEach((botao) => {
    botao.addEventListener("click", function () {
      const id = Number(botao.dataset.id);
      state.respostas[id] = !state.respostas[id];
      renderLista();
    });
  });

  container.querySelectorAll("[data-favorite-id]").forEach((botao) => {
    botao.addEventListener("click", async function () {
      const id = Number(botao.dataset.favoriteId);
      const card = state.flashcards.find((x) => x.id === id);
      if (!card) return;

      const novoValor = !(card.progresso && card.progresso.favorito);

      try {
        await api("/api/flashcards/" + id + "/favorito", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ favorito: novoValor })
        });

        card.progresso = {
          ...(card.progresso || {}),
          favorito: novoValor
        };

        renderLista();
      } catch (erro) {
        mostrarErro(erro.message || "Nao foi possivel favoritar.");
      }
    });
  });
}

function abrirFormulario() {
  $("formularioNovo").classList.remove("hidden");
  $("frente").focus();
}

function fecharFormulario() {
  $("formularioNovo").classList.add("hidden");
}

async function criarFlashcard(event) {
  event.preventDefault();

  const frente = $("frente").value.trim();
  const verso = $("verso").value.trim();

  if (!frente || !verso) {
    mostrarErro("Preencha a frente e o verso do flashcard.");
    return;
  }

  const botao = $("salvarFlashcard");

  try {
    botao.disabled = true;
    botao.textContent = "Salvando...";

    await api("/api/flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        frente,
        verso,
        disciplina: state.filtros.disciplina || "Geral",
        tema: state.filtros.assunto || "Geral",
        subassunto: state.filtros.subassunto || null,
        dificuldade: state.filtros.dificuldade || "medio"
      })
    });

    $("frente").value = "";
    $("verso").value = "";
    fecharFormulario();
    await carregarFlashcards();
  } catch (erro) {
    mostrarErro(erro.message || "Nao foi possivel criar o flashcard.");
  } finally {
    botao.disabled = false;
    botao.textContent = "Salvar flashcard";
  }
}


function garantirModalEstudo() {
  let modal = $("flashStudySetup");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "flashStudySetup";
  modal.className = "flash-study-modal";
  modal.innerHTML = `
    <div class="flash-study-dialog" role="dialog" aria-modal="true" aria-labelledby="flashStudyTitle">
      <div class="flash-study-dialog-header">
        <div>
          <span>CONFIGURAR REVISÃO</span>
          <h2 id="flashStudyTitle">Escolha o que revisar</h2>
          <p>Defina disciplina, assunto, dificuldade e quantidade de flashcards.</p>
        </div>
        <button id="fecharFlashStudySetup" type="button" aria-label="Fechar">&times;</button>
      </div>

      <div class="flash-study-config-grid">
        <label>
          <span>Área / disciplina</span>
          <select id="flashSetupDisciplina"></select>
        </label>

        <label>
          <span>Assunto / tópico</span>
          <select id="flashSetupAssunto"></select>
        </label>

        <label>
          <span>Dificuldade</span>
          <select id="flashSetupDificuldade">
            <option value="">Todas</option>
            <option value="facil">Fácil</option>
            <option value="medio">Médio</option>
            <option value="dificil">Difícil</option>
          </select>
        </label>

        <label>
          <span>Quantidade</span>
          <select id="flashSetupQuantidade">
            <option value="10">10 flashcards</option>
            <option value="15">15 flashcards</option>
            <option value="20">20 flashcards</option>
            <option value="24">24 flashcards</option>
          </select>
        </label>
      </div>

      <div class="flash-study-dialog-footer">
        <span id="flashSetupDisponiveis"></span>
        <button id="confirmarFlashStudySetup" class="button-primary" type="button">
          Iniciar revisão
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  $("fecharFlashStudySetup").addEventListener("click", fecharModalEstudo);
  modal.addEventListener("mousedown", function(event) {
    if (event.target === modal) fecharModalEstudo();
  });

  $("flashSetupDisciplina").addEventListener("change", function() {
    atualizarAssuntosModalEstudo();
  });

  $("confirmarFlashStudySetup").addEventListener("click", iniciarEstudoConfigurado);

  return modal;
}

function preencherSelectEstudo(id, itens, placeholder, atual) {
  const select = $(id);
  if (!select) return;

  select.innerHTML =
    '<option value="">' + escapeHtml(placeholder) + '</option>' +
    (itens || []).map((item) =>
      '<option value="' + escapeHtml(item) + '">' + escapeHtml(item) + '</option>'
    ).join("");

  if (atual && Array.from(select.options).some((option) => option.value === atual)) {
    select.value = atual;
  }
}

function atualizarAssuntosModalEstudo() {
  const disciplina = $("flashSetupDisciplina")?.value || "";
  const assuntos = new Set();

  if (!disciplina) {
    (state.filtrosMeta.assuntos || []).forEach((item) => assuntos.add(item));
  } else {
    state.flashcards.forEach((card) => {
      if (String(card.disciplina || "") === disciplina && card.tema) {
        assuntos.add(card.tema);
      }
    });

    if (!assuntos.size) {
      (state.filtrosMeta.assuntos || []).forEach((item) => assuntos.add(item));
    }
  }

  preencherSelectEstudo(
    "flashSetupAssunto",
    Array.from(assuntos).sort((a,b) => a.localeCompare(b,"pt-BR")),
    "Todos os assuntos",
    state.filtros.assunto
  );
}

function atualizarModalEstudo() {
  garantirModalEstudo();

  preencherSelectEstudo(
    "flashSetupDisciplina",
    state.filtrosMeta.disciplinas,
    "Todas as disciplinas",
    state.filtros.disciplina
  );

  atualizarAssuntosModalEstudo();

  $("flashSetupDificuldade").value = state.filtros.dificuldade || "";
  $("flashSetupQuantidade").value = String(state.estudoQuantidade || 10);
  $("flashSetupDisponiveis").textContent =
    state.total + (state.total === 1 ? " flashcard disponível" : " flashcards disponíveis");
}

function abrirModalEstudo() {
  atualizarModalEstudo();
  $("flashStudySetup").classList.add("open");
  document.body.classList.add("flash-study-modal-open");
}

function fecharModalEstudo() {
  const modal = $("flashStudySetup");
  if (modal) modal.classList.remove("open");
  document.body.classList.remove("flash-study-modal-open");
}

async function iniciarEstudoConfigurado() {
  state.filtros.disciplina = $("flashSetupDisciplina")?.value || "";
  state.filtros.assunto = $("flashSetupAssunto")?.value || "";
  state.filtros.subassunto = "";
  state.filtros.dificuldade = $("flashSetupDificuldade")?.value || "";
  state.filtros.busca = "";
  state.pagina = 1;
  state.estudoQuantidade = Math.max(1, Math.min(24, Number($("flashSetupQuantidade")?.value) || 10));

  await carregarFlashcards();

  fecharModalEstudo();
  iniciarEstudo(state.estudoQuantidade);
}

async function concluirTarefaCronogramaFlashcards() {
  if (
    !state.cronogramaAuto ||
    !state.cronogramaTaskId ||
    state.cronogramaConcluido ||
    state.estudoCards.length < 10
  ) {
    return;
  }

  await api("/api/cronograma/task", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      taskId: state.cronogramaTaskId,
      completed: true,
      progress: 100
    })
  });

  state.cronogramaConcluido = true;
}

function cardsEmEstudo() {
  return state.estudoCards;
}

function iniciarEstudo(quantidade = state.estudoQuantidade || 10) {
  if (!state.flashcards.length) {
    mostrarErro("Nao ha flashcards para estudar com os filtros atuais.");
    return;
  }

  const nuncaRevisados = state.flashcards.filter((c) => !(c.progresso?.revisoes));
  const errados = state.flashcards.filter((c) => Number(c.progresso?.erros || 0) > 0);
  const outros = state.flashcards.filter((c) =>
    !nuncaRevisados.includes(c) && !errados.includes(c)
  );

  state.estudoCards = [
    ...nuncaRevisados,
    ...errados.sort((a, b) =>
      Number(b.progresso?.erros || 0) - Number(a.progresso?.erros || 0)
    ),
    ...outros
  ].slice(0, Math.max(1, Math.min(Number(quantidade) || 10, state.flashcards.length)));

  state.estudoIndex = 0;
  $("bibliotecaView").classList.add("hidden");
  $("estudoView").classList.remove("hidden");
  renderEstudo();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function sairEstudo() {
  $("estudoView").classList.add("hidden");
  $("bibliotecaView").classList.remove("hidden");
  state.estudoIndex = 0;
  state.estudoCards = [];
}

function renderEstudo() {
  const cards = cardsEmEstudo();
  const card = cards[state.estudoIndex];

  if (!card) {
    sairEstudo();
    return;
  }

  const total = cards.length;
  const progresso = Math.round(((state.estudoIndex + 1) / total) * 100);

  $("estudoTitulo").textContent =
    (card.disciplina || "Geral") + " · " +
    (card.tema || "Geral") + " · " +
    "Card " + (state.estudoIndex + 1) + " de " + total;

  $("studyProgress").style.width = progresso + "%";
  $("studyProgressText").textContent = progresso + "%";
  $("studyFrente").textContent = frenteVisivelFlashcard(card);

  state.respostas[card.id] = false;
  renderVersoEstudo();
}

function renderVersoEstudo() {
  const card = cardsEmEstudo()[state.estudoIndex];
  if (!card) return;

  const visivel = state.respostas[card.id] === true;
  const container = $("versoContainer");

  if (visivel) {
    container.classList.add("revealed");
    container.innerHTML = `
      <p>${escapeHtml(card.verso)}</p>
      <div class="smart-study-actions">
        <button id="marcarErrei" class="button-secondary smart-wrong" type="button">Errei</button>
        <button id="marcarAcertei" class="button-primary smart-correct" type="button">Acertei</button>
      </div>
    `;

    $("ocultarResposta").classList.remove("hidden");
    $("marcarErrei").addEventListener("click", () => registrarResultado(false));
    $("marcarAcertei").addEventListener("click", () => registrarResultado(true));
  } else {
    container.classList.remove("revealed");
    container.innerHTML =
      '<button id="mostrarRespostaInterno" class="button-primary" type="button">Mostrar resposta</button>';

    $("ocultarResposta").classList.add("hidden");
    $("mostrarRespostaInterno").addEventListener("click", mostrarRespostaEstudo);
  }
}

function mostrarRespostaEstudo() {
  const card = cardsEmEstudo()[state.estudoIndex];
  if (!card) return;

  state.respostas[card.id] = true;
  renderVersoEstudo();
}

function ocultarRespostaEstudo() {
  const card = cardsEmEstudo()[state.estudoIndex];
  if (!card) return;

  state.respostas[card.id] = false;
  renderVersoEstudo();
}

async function registrarResultado(correta) {
  const card = cardsEmEstudo()[state.estudoIndex];
  if (!card) return;

  try {
    const resultado = await api("/api/flashcards/" + card.id + "/revisao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correta })
    });

    if (resultado.progresso) {
      card.progresso = {
        ...(card.progresso || {}),
        revisoes: resultado.progresso.revisoes,
        acertos: resultado.progresso.acertos,
        erros: resultado.progresso.erros,
        favorito: resultado.progresso.favorito,
        ultimaRevisaoAt: resultado.progresso.ultimaRevisaoAt,
        ultimaRespostaCorreta: resultado.progresso.ultimaRespostaCorreta,
        proximaRevisaoAt: resultado.progresso.proximaRevisaoAt
      };
    }

    proximoCard();
  } catch (erro) {
    mostrarErro(erro.message || "Nao foi possivel registrar a revisao.");
  }
}

async function proximoCard() {
  const cards = cardsEmEstudo();
  if (!cards.length) return;

  if (state.estudoIndex >= cards.length - 1) {
    try {
      await concluirTarefaCronogramaFlashcards();
    } catch (erro) {
      console.error("Falha ao concluir revisão no cronograma:", erro);
    }

    sairEstudo();
    await carregarFlashcards();
    return;
  }

  state.estudoIndex += 1;
  renderEstudo();
}

function cardAnterior() {
  const cards = cardsEmEstudo();
  if (!cards.length) return;

  state.estudoIndex = Math.max(0, state.estudoIndex - 1);
  renderEstudo();
}

async function sair() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin"
    });
  } finally {
    location.href = "/login.html";
  }
}

let buscaTimer = null;

$("busca").addEventListener("input", function () {
  clearTimeout(buscaTimer);

  buscaTimer = setTimeout(async () => {
    state.filtros.busca = $("busca").value.trim();
    state.pagina = 1;
    await carregarFlashcards();
  }, 280);
});

$("abrirFormulario").addEventListener("click", abrirFormulario);
$("fecharFormulario").addEventListener("click", fecharFormulario);
$("cancelarFormulario").addEventListener("click", fecharFormulario);
$("flashcardForm").addEventListener("submit", criarFlashcard);
$("iniciarEstudoTopo").addEventListener("click", abrirModalEstudo);
$("iniciarEstudoCard").addEventListener("click", abrirModalEstudo);
$("sairEstudo").addEventListener("click", sairEstudo);
$("proximoCard").addEventListener("click", proximoCard);
$("cardAnterior").addEventListener("click", cardAnterior);
$("ocultarResposta").addEventListener("click", ocultarRespostaEstudo);
$("fecharErro").addEventListener("click", limparErro);
$("logoutSidebar").addEventListener("click", sair);

async function iniciar() {
  try {
    garantirFiltrosPremium();
    garantirModalEstudo();

    await Promise.all([
      carregarUsuario(),
      carregarFlashcards()
    ]);

    const params = new URLSearchParams(window.location.search);
    const temaCronograma = String(params.get("tema") || "").trim();
    const taskId = Number(params.get("cronogramaTaskId"));
    const quantidade = Math.max(1, Math.min(24, Number(params.get("quantidade")) || 10));
    const auto = params.get("auto") === "1";

    if (Number.isInteger(taskId) && taskId > 0) {
      state.cronogramaTaskId = taskId;
    }

    if (temaCronograma) {
      try {
        const resolvido = await api(
          "/api/questoes/resolver-tema?tema=" + encodeURIComponent(temaCronograma)
        );

        if (resolvido && resolvido.assunto) {
          state.filtros.disciplina = resolvido.disciplina || "";
          state.filtros.assunto = resolvido.assunto || "";
        } else {
          state.filtros.assunto = temaCronograma;
        }
      } catch (erroResolver) {
        console.warn("Falha ao resolver tema para flashcards:", erroResolver);
        state.filtros.assunto = temaCronograma;
      }

      state.filtros.busca = "";
      state.filtros.subassunto = "";
      state.filtros.dificuldade = "";
      state.pagina = 1;
      state.estudoQuantidade = quantidade;

      await carregarFlashcards();

      if (auto && state.cronogramaTaskId) {
        if (state.flashcards.length < quantidade) {
          mostrarErro(
            "Ainda nao ha " + quantidade +
            " flashcards disponiveis para concluir esta revisao do cronograma."
          );
          return;
        }

        state.cronogramaAuto = true;
        state.cronogramaConcluido = false;
        iniciarEstudo(quantidade);
        return;
      }
    }

    atualizarModalEstudo();
  } catch (erro) {
    console.error(erro);
  }
}

iniciar();
