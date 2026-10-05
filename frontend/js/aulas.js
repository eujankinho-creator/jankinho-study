const $ = (id) => document.getElementById(id);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const state = {
  dashboard: null,
  results: [],
  lastQuery: "",
  goalType: "TIME",
  lists: [],
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function formatDuration(seconds) {
  const total = Number(seconds || 0);
  if (!Number.isFinite(total) || total <= 0) return "";
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  return h > 0
    ? h + ":" + String(m).padStart(2,"0") + ":" + String(s).padStart(2,"0")
    : m + ":" + String(s).padStart(2,"0");
}

function compactNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("pt-BR",{notation:"compact",maximumFractionDigits:1}).format(n);
}

function minutesLabel(seconds) {
  const minutes = Math.floor(Number(seconds || 0) / 60);
  if (minutes < 60) return minutes + " min";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours + "h" + (rest ? " " + rest + "min" : "");
}

async function api(url, options = {}) {
  const response = await fetch(url,{
    credentials:"same-origin",
    ...options,
    headers:{
      ...(options.body ? {"Content-Type":"application/json"} : {}),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(()=>({}));
  if (!response.ok) {
    const error = new Error(data.error || "Não foi possível concluir esta ação.");
    error.code = data.code;
    throw error;
  }
  return data;
}

function videoPayload(video) {
  return {
    youtubeVideoId: video.youtubeVideoId,
    title: video.title || "Videoaula",
    channel: video.channel || "",
    thumbnail: video.thumbnail || "",
    description: video.description || "",
    durationSeconds: Number(video.durationSeconds || 0),
    category: state.lastQuery || video.category || "",
    subjects: state.lastQuery ? [state.lastQuery] : [],
  };
}

function postToShell(type, payload = {}) {
  if (window.parent !== window) {
    window.parent.postMessage({type,...payload},window.location.origin);
    return true;
  }
  return false;
}

function openLesson(video, startAt = 0) {
  const payload = videoPayload(video);
  payload.startAt = Number(startAt || video.progressSeconds || 0);
  payload.expanded = true;

  if (postToShell("cortex:lesson-play",{video:payload})) {
    return;
  }

  const params = new URLSearchParams({
    view:"/aulas",
    lesson:payload.youtubeVideoId,
    start:String(payload.startAt || 0),
  });
  location.href = "/app?" + params.toString();
}

function getProgress(video) {
  const duration = Number(video.durationSeconds || 0);
  const position = Number(video.progressSeconds || 0);
  return duration > 0 ? Math.max(0,Math.min(100,Math.round(position / duration * 100))) : 0;
}

function lessonCard(video, compact = false) {
  const progress = getProgress(video);
  const duration = formatDuration(video.durationSeconds);
  const views = video.views ? compactNumber(video.views) + " visualizações" : "";
  const published = video.publishedAt
    ? new Date(video.publishedAt).toLocaleDateString("pt-BR",{year:"numeric",month:"short"})
    : "";
  const saved = Boolean(video.saved);
  const resume = Number(video.progressSeconds || 0) > 0;
  const id = escapeHtml(video.youtubeVideoId);

  return `
    <article class="lesson-card" data-video-id="${id}">
      <div class="lesson-thumb" data-action="watch">
        <img loading="lazy" src="${escapeHtml(video.thumbnail)}" alt="">
        <span class="lesson-play" aria-hidden="true">▶</span>
        ${duration ? `<span class="lesson-duration">${duration}</span>` : ""}
        ${progress ? `<span class="lesson-progress-line"><i style="width:${progress}%"></i></span>` : ""}
      </div>
      <div class="lesson-card-body">
        <h3>${escapeHtml(video.title)}</h3>
        <span class="lesson-channel">${escapeHtml(video.channel || "YouTube")}</span>
        <div class="lesson-meta">
          ${views ? `<span>${escapeHtml(views)}</span>` : ""}
          ${published ? `<span>${escapeHtml(published)}</span>` : ""}
          ${progress ? `<span>${progress}% assistido</span>` : ""}
        </div>
        <div class="lesson-actions">
          <button type="button" class="watch" data-action="watch">${resume ? "Continuar" : "Assistir"}</button>
          <button type="button" data-action="list">＋ Adicionar</button>
          <button type="button" class="${saved ? "active" : ""}" data-action="save">${saved ? "♥ Salva" : "♡ Salvar"}</button>
        </div>
      </div>
    </article>
  `;
}

function attachCardEvents(container, videos) {
  if (!container) return;
  const map = new Map(videos.map((video) => [String(video.youtubeVideoId),video]));
  container.querySelectorAll(".lesson-card").forEach((card) => {
    const video = map.get(card.dataset.videoId);
    if (!video) return;

    card.querySelectorAll('[data-action="watch"]').forEach((button) => {
      button.addEventListener("click",()=>openLesson(video,video.progressSeconds || 0));
    });

    card.querySelector('[data-action="save"]')?.addEventListener("click",async (event)=>{
      const target = event.currentTarget;
      const next = !Boolean(video.saved);
      target.disabled = true;
      try {
        await api("/api/aulas/state",{
          method:"POST",
          body:JSON.stringify({...videoPayload(video),progressSeconds:video.progressSeconds || 0,saved:next}),
        });
        video.saved = next;
        target.classList.toggle("active",next);
        target.textContent = next ? "♥ Salva" : "♡ Salvar";
        await loadDashboard();
      } catch (error) {
        target.textContent = "Erro";
      } finally {
        target.disabled = false;
      }
    });

    card.querySelector('[data-action="list"]')?.addEventListener("click",()=>{
      openListDialog(video);
    });
  });
}

function renderContinue(items) {
  const section = $("continueSection");
  const grid = $("continueGrid");
  if (!items?.length) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  grid.innerHTML = items.map((item)=>lessonCard(item,true)).join("");
  attachCardEvents(grid,items);
}

function renderSaved(items) {
  const section = $("savedSection");
  const grid = $("savedGrid");
  if (!items?.length) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  grid.innerHTML = items.slice(0,12).map((item)=>lessonCard(item,true)).join("");
  attachCardEvents(grid,items);
}

function renderSubjectProgress(items) {
  const host = $("subjectProgress");
  if (!items?.length) {
    host.innerHTML = '<div class="empty-inline">Comece a assistir aulas para acompanhar seus temas.</div>';
    return;
  }
  host.innerHTML = items.map((item)=>`
    <div class="subject-row">
      <span>${escapeHtml(item.subject)}</span>
      <div class="subject-bar"><i style="width:${item.percent}%"></i></div>
      <b>${item.percent}%</b>
    </div>
  `).join("");
}

function renderDashboard(data) {
  state.dashboard = data;
  $("statToday").textContent = minutesLabel(data.todaySeconds);
  $("statWeek").textContent = minutesLabel(data.weekSeconds);
  $("statCompleted").textContent = String(data.completedCount || 0);
  $("statStreak").textContent = (data.streak || 0) + ((data.streak || 0) === 1 ? " dia" : " dias");

  const goal = data.goal || {type:"TIME",value:30,current:0,percent:0};
  state.goalType = goal.type;
  $("goalLabel").textContent = goal.type === "LESSONS"
    ? goal.value + (goal.value === 1 ? " aula" : " aulas")
    : goal.value + " min";
  $("goalProgressBar").style.width = Math.min(100,goal.percent || 0) + "%";
  $("goalProgressText").textContent = goal.current + " / " + goal.value + (goal.type === "LESSONS" ? " aulas" : " min");
  const remaining = Math.max(0,goal.value-goal.current);
  $("goalRemainingText").textContent = goal.complete
    ? "Meta concluída ✓"
    : remaining + (goal.type === "LESSONS" ? (remaining === 1 ? " aula restante" : " aulas restantes") : " min restantes");

  renderContinue(data.continueWatching || []);
  renderSaved(data.saved || []);
  renderSubjectProgress(data.subjectProgress || []);
}

async function loadDashboard() {
  try {
    renderDashboard(await api("/api/aulas/dashboard"));
  } catch (error) {
    console.error(error);
  }
}

function searchParams() {
  const params = new URLSearchParams();
  params.set("q",state.lastQuery);
  const duration = $("filterDuration").value;
  const order = $("filterOrder").value;
  const type = $("filterType").value;
  if (duration) params.set("duration",duration);
  if (order) params.set("order",order);
  if (type) params.set("type",type);
  return params;
}

async function runSearch(query) {
  state.lastQuery = String(query || "").trim();
  if (!state.lastQuery) return;

  $("lessonSearchInput").value = state.lastQuery;
  $("searchSection").hidden = false;
  $("searchTitle").textContent = "Resultados para “" + state.lastQuery + "”";
  $("lessonResults").innerHTML = "";
  $("searchCount").textContent = "";
  const status = $("lessonSearchState");
  status.hidden = false;
  status.textContent = "Buscando videoaulas relevantes…";

  try {
    const result = await api("/api/aulas/search?" + searchParams().toString());
    state.results = result.items || [];
    if (!state.results.length) {
      status.textContent = "Nenhuma aula encontrada.";
      return;
    }
    status.hidden = true;
    $("searchCount").textContent = state.results.length + " resultados";
    $("lessonResults").innerHTML = state.results.map((video)=>lessonCard(video)).join("");
    attachCardEvents($("lessonResults"),state.results);
  } catch (error) {
    status.hidden = false;
    status.innerHTML = error.code === "YOUTUBE_API_KEY_MISSING"
      ? "A busca oficial do YouTube ainda não foi ativada no servidor."
      : "Não conseguimos carregar as aulas agora.";
  }
}

async function loadLists() {
  try {
    state.lists = await api("/api/aulas/lists");
    $("listsContainer").innerHTML = state.lists.length
      ? state.lists.map((list)=>`<div class="list-item"><span>${escapeHtml(list.nome)}</span><small>${list.itens?.length || 0} aulas</small></div>`).join("")
      : '<div class="empty-inline">Nenhuma lista criada ainda.</div>';
  } catch {
    $("listsContainer").innerHTML = '<div class="empty-inline">Não foi possível carregar suas listas.</div>';
  }
}

async function openListDialog(video = null) {
  await loadLists();
  const dialog = $("listDialog");
  dialog.dataset.videoId = video?.youtubeVideoId || "";
  dialog._video = video || null;
  dialog.showModal();
}

function initGoalDialog() {
  $("editGoalButton").addEventListener("click",()=>{
    const goal = state.dashboard?.goal || {type:"TIME",value:30};
    state.goalType = goal.type;
    $("goalValueInput").value = goal.value;
    syncGoalTabs();
    $("goalDialog").showModal();
  });

  $$("[data-goal-type]").forEach((button)=>{
    button.addEventListener("click",()=>{
      state.goalType = button.dataset.goalType;
      syncGoalTabs();
    });
  });

  $("goalForm").addEventListener("submit",async (event)=>{
    event.preventDefault();
    try {
      await api("/api/aulas/goal",{
        method:"POST",
        body:JSON.stringify({type:state.goalType,value:Number($("goalValueInput").value || 1)}),
      });
      $("goalDialog").close();
      await loadDashboard();
    } catch {}
  });
}

function syncGoalTabs() {
  $$("[data-goal-type]").forEach((button)=>button.classList.toggle("active",button.dataset.goalType===state.goalType));
  $("goalValueLabel").textContent = state.goalType === "LESSONS" ? "Aulas por dia" : "Minutos por dia";
  $("goalValueInput").max = state.goalType === "LESSONS" ? "20" : "720";
}

function initLists() {
  $("listsButton")?.addEventListener("click",()=>openListDialog());
  $("createListButton").addEventListener("click",async ()=>{
    const name = $("newListName").value.trim();
    if (!name) return;
    try {
      const list = await api("/api/aulas/lists",{method:"POST",body:JSON.stringify({name})});
      $("newListName").value = "";
      await loadLists();

      const video = $("listDialog")._video;
      if (video) {
        await api("/api/aulas/lists/item",{
          method:"POST",
          body:JSON.stringify({listId:list.id,...videoPayload(video)}),
        });
        await loadLists();
      }
    } catch {}
  });

  $("listsContainer").addEventListener("click",async (event)=>{
    const video = $("listDialog")._video;
    if (!video) return;
    const rows = Array.from($("listsContainer").children);
    const row = event.target.closest(".list-item");
    if (!row) return;
    const index = rows.indexOf(row);
    const list = state.lists[index];
    if (!list) return;
    await api("/api/aulas/lists/item",{
      method:"POST",
      body:JSON.stringify({listId:list.id,...videoPayload(video)}),
    }).catch(()=>{});
    $("listDialog").close();
  });
}

function initSearch() {
  $("lessonSearchForm").addEventListener("submit",(event)=>{
    event.preventDefault();
    runSearch($("lessonSearchInput").value);
  });

  $$("[data-query]").forEach((button)=>{
    button.addEventListener("click",()=>runSearch(button.dataset.query));
  });

  ["filterDuration","filterOrder","filterType"].forEach((id)=>{
    $(id).addEventListener("change",()=>{
      if (state.lastQuery) runSearch(state.lastQuery);
    });
  });
}

function initShellMessages() {
  window.addEventListener("message",(event)=>{
    if (event.origin !== location.origin) return;
    const data = event.data || {};
    if (data.type === "cortex:lesson-progress-updated") {
      loadDashboard();
    }
  });
}

function maybePlayFromUrl() {
  const params = new URLSearchParams(location.search);
  const id = params.get("lesson");
  if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return;
  const all = [
    ...(state.dashboard?.history || []),
    ...(state.results || []),
  ];
  const video = all.find((item)=>item.youtubeVideoId===id);
  if (video) openLesson(video,Number(params.get("start") || 0));
}

async function boot() {
  initSearch();
  initGoalDialog();
  initLists();
  initShellMessages();
  $("historyButton")?.addEventListener("click",()=>{
    const history = state.dashboard?.history || [];
    $("searchSection").hidden = false;
    $("searchTitle").textContent = "Histórico";
    $("searchCount").textContent = history.length + " aulas";
    $("lessonSearchState").hidden = true;
    $("lessonResults").innerHTML = history.map((item)=>lessonCard(item)).join("");
    attachCardEvents($("lessonResults"),history);
    $("searchSection").scrollIntoView({behavior:"smooth",block:"start"});
  });

  await loadDashboard();
  maybePlayFromUrl();

  try {
    if (!localStorage.getItem("cortex_aulas_intro_v1")) {
      localStorage.setItem("cortex_aulas_intro_v1","1");
    }
  } catch {}
}

boot().catch(console.error);
