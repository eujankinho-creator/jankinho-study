import { STRUCTURES, getStructure } from "./radiologia/data.js?v=20261005-stack11";

const $ = (id) => document.getElementById(id);
const PLANES = ["axial", "coronal", "sagittal"];
const REGION_STRUCTURE = {
  head: "brain",
  thorax: "myocardium",
  abdomen: "liver",
  pelvis: "urinary_bladder",
  thigh: "left_femur"
};

const state = {
  manifest: null,
  activePlane: "axial",
  coord: [0,0,0],
  selectedId: null,
  imageCache: new Map(),
  maskCache: new Map(),
  latestPointStructures: [],
  wheelAccumulator: { axial: 0, coronal: 0, sagittal: 0 },
  interactionBusy: false,
  pointerFrame: 0,
  pointerRefreshTimer: 0,
  lastPointerPlane: null,
  pointerNavToken: 0,
  draggingPlane: null,
  dragStartX: 0,
  dragStartY: 0,
  dragMoved: false,
  suppressClick: false,
  colorEnabled: true,
  liveIdentifyToken: 0,
  liveIdentifyFrame: 0,
  liveIdentifyTimer: 0
};

async function api(url, options) {
  const response = await fetch(url, Object.assign({ credentials: "same-origin" }, options || {}));
  if (response.status === 401) {
    location.href = "/login.html";
    throw new Error("Não autenticado.");
  }
  if (!response.ok) throw new Error("Falha ao carregar o laboratório.");
  return response.json();
}

async function loadUser() {
  const data = await api("/api/auth/me");
  const user = data.usuario || {};
  const name = user.nome || "Usuário";
  const initial = name.charAt(0).toUpperCase();
  if ($("nomeSidebar")) $("nomeSidebar").textContent = name;
  if ($("emailSidebar")) $("emailSidebar").textContent = user.email || "";
  if ($("nomeHeader")) $("nomeHeader").textContent = name;
  if ($("avatarSidebar")) $("avatarSidebar").textContent = initial;
  if ($("avatarHeader")) $("avatarHeader").textContent = initial;
}

async function logout() {
  try { await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }); }
  finally { location.href = "/login.html"; }
}

function announce(message) {
  if ($("liveStatus")) $("liveStatus").textContent = message;
}

function fail(message) {
  const el = $("labBootError");
  if (el) {
    el.hidden = false;
    el.textContent = message;
  }
  if ($("loadStatus")) $("loadStatus").textContent = "Falha";
}

function setProgress(percent, stage, detail) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  if ($("loadingPercent")) $("loadingPercent").textContent = p + "%";
  if ($("loadingStage")) $("loadingStage").textContent = stage || "Carregando";
  if ($("loadingDetail")) $("loadingDetail").textContent = detail || "";
  if ($("loadingBar")) $("loadingBar").style.width = p + "%";
  if (p >= 100 && $("atlasLoading")) setTimeout(() => $("atlasLoading").classList.add("done"), 180);
}

function pad(index) {
  return String(index).padStart(4, "0");
}

function planeInfo(plane) {
  return state.manifest.planes[plane];
}

function imageUrl(plane, ordinal) {
  return "/data/radiology-atlas/ct/" + plane + "/" + pad(ordinal) + ".webp";
}

function maskUrl(group, plane, ordinal) {
  const version = state.manifest?.version || 5;
  return "/data/radiology-atlas/mask/" + group + "/" + plane + "/" + pad(ordinal) + ".png?v=" + version;
}

function nearestOrdinal(values, target) {
  let best = 0;
  let dist = Infinity;
  for (let i = 0; i < values.length; i += 1) {
    const d = Math.abs(values[i] - target);
    if (d < dist) {
      best = i;
      dist = d;
    }
  }
  return best;
}

function planeOrdinal(plane) {
  const values = planeInfo(plane).voxels;
  const axis = plane === "axial" ? 2 : plane === "coronal" ? 1 : 0;
  return nearestOrdinal(values, state.coord[axis]);
}

function planeLabel(plane) {
  return plane === "axial" ? "Axial" : plane === "coronal" ? "Coronal" : "Sagital";
}

function getImg(plane) {
  return $("img" + planeLabel(plane).replace("Sagital","Sagittal"));
}

function getOverlay(plane) {
  return $("overlay" + planeLabel(plane).replace("Sagital","Sagittal"));
}

function preloadImage(url) {
  if (state.imageCache.has(url)) return state.imageCache.get(url);
  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
  state.imageCache.set(url, promise);
  return promise;
}

function prefetchAround(plane, ordinal) {
  const total = planeInfo(plane).voxels.length;
  [-6,-5,-4,-3,-2,-1,1,2,3,4,5,6].forEach((delta) => {
    const next = ordinal + delta;
    if (next >= 0 && next < total) preloadImage(imageUrl(plane, next)).catch(() => {});
  });
}

function containRect(img) {
  const box = img.getBoundingClientRect();
  const nw = img.naturalWidth || 1;
  const nh = img.naturalHeight || 1;
  const scale = Math.min(box.width / nw, box.height / nh);
  const width = nw * scale;
  const height = nh * scale;
  return {
    left: (box.width - width) / 2,
    top: (box.height - height) / 2,
    width,
    height
  };
}

function uvForPlane(plane) {
  const [nx, ny, nz] = state.manifest.originalDims;
  const [x,y,z] = state.coord;
  if (plane === "axial") return [x / Math.max(1,nx-1), 1 - y / Math.max(1,ny-1)];
  if (plane === "coronal") return [x / Math.max(1,nx-1), 1 - z / Math.max(1,nz-1)];
  return [y / Math.max(1,ny-1), 1 - z / Math.max(1,nz-1)];
}

function updateCrosshair(plane) {
  const stage = document.querySelector('[data-stage="' + plane + '"]');
  const img = getImg(plane);
  if (!stage || !img || !img.naturalWidth) return;
  const rect = containRect(img);
  const [u,v] = uvForPlane(plane);
  const vertical = stage.querySelector(".crosshair-v");
  const horizontal = stage.querySelector(".crosshair-h");

  vertical.style.left = (rect.left + u * rect.width) + "px";
  vertical.style.top = rect.top + "px";
  vertical.style.height = rect.height + "px";
  vertical.style.bottom = "auto";

  horizontal.style.top = (rect.top + v * rect.height) + "px";
  horizontal.style.left = rect.left + "px";
  horizontal.style.width = rect.width + "px";
  horizontal.style.right = "auto";
}

function updateAllCrosshairs() {
  PLANES.forEach(updateCrosshair);
}

function pointerUv(plane, event) {
  const img = getImg(plane);
  const stage = document.querySelector('[data-stage="' + plane + '"]');
  if (!img || !stage || !img.naturalWidth) return null;

  const stageRect = stage.getBoundingClientRect();
  const contain = containRect(img);
  const px = event.clientX - stageRect.left;
  const py = event.clientY - stageRect.top;

  if (px < contain.left || px > contain.left + contain.width || py < contain.top || py > contain.top + contain.height) {
    return null;
  }

  return {
    u: Math.max(0, Math.min(1, (px - contain.left) / contain.width)),
    v: Math.max(0, Math.min(1, (py - contain.top) / contain.height)),
    contain
  };
}

function showCursorCrosshair(plane, event) {
  const stage = document.querySelector('[data-stage="' + plane + '"]');
  const point = pointerUv(plane, event);
  if (!stage || !point) return false;

  const vertical = stage.querySelector(".crosshair-v");
  const horizontal = stage.querySelector(".crosshair-h");
  const rect = point.contain;

  vertical.style.left = (rect.left + point.u * rect.width) + "px";
  vertical.style.top = rect.top + "px";
  vertical.style.height = rect.height + "px";
  vertical.style.bottom = "auto";

  horizontal.style.top = (rect.top + point.v * rect.height) + "px";
  horizontal.style.left = rect.left + "px";
  horizontal.style.width = rect.width + "px";
  horizontal.style.right = "auto";
  return true;
}

function setCoordFromPointer(plane, event) {
  const point = pointerUv(plane, event);
  if (!point) return null;
  const { u, v } = point;
  const [nx,ny,nz] = state.manifest.originalDims;

  if (plane === "axial") {
    state.coord[0] = Math.round(u * (nx - 1));
    state.coord[1] = Math.round((1 - v) * (ny - 1));
  } else if (plane === "coronal") {
    state.coord[0] = Math.round(u * (nx - 1));
    state.coord[2] = Math.round((1 - v) * (nz - 1));
  } else {
    state.coord[1] = Math.round(u * (ny - 1));
    state.coord[2] = Math.round((1 - v) * (nz - 1));
  }

  return { u, v };
}

function setActivePlane(plane) {
  state.activePlane = plane;
  document.querySelectorAll("[data-plane-tile]").forEach((tile) => {
    tile.classList.toggle("active", tile.dataset.planeTile === plane);
  });
  if ($("activePlaneLabel")) $("activePlaneLabel").textContent = plane.toUpperCase() + " · CORTE";
  syncSlider();
}

function syncSlider() {
  const info = planeInfo(state.activePlane);
  const ordinal = planeOrdinal(state.activePlane);
  if ($("sliceSlider")) {
    $("sliceSlider").max = String(Math.max(0, info.voxels.length - 1));
    $("sliceSlider").value = String(ordinal);
  }
  if ($("sliceReadout")) $("sliceReadout").textContent = (ordinal + 1) + " / " + info.voxels.length;
  if ($("slicePlaneName")) $("slicePlaneName").textContent = planeLabel(state.activePlane);
}

function structureStat(structure) {
  return state.manifest?.structures?.[structure.group]?.[String(structure.localLabel)] || null;
}

function availableStructures() {
  return STRUCTURES.filter((structure) => structureStat(structure));
}

function normalizeSearch(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const SEARCH_ALIASES = Object.freeze({
  liver: ["figado", "hepatico", "hepatica", "orgao direito abdomen"],
  spleen: ["baco", "esplenico", "esplenica"],
  pancreas: ["pancreas", "pancreatico", "pancreatica"],
  stomach: ["estomago", "gastrico", "gastrica"],
  gallbladder: ["vesicula", "vesicula biliar"],
  urinary_bladder: ["bexiga", "bexiga urinaria"],
  left_kidney: ["rim esquerdo", "rim esq", "rim e"],
  right_kidney: ["rim direito", "rim dir", "rim d"],
  aorta: ["aorta", "arteria principal", "grande vaso", "vaso grande", "vaso do peito"],
  ivc: ["veia cava", "veia cava inferior", "cava inferior"],
  pulmonary_artery: ["arteria pulmonar", "vaso pulmonar"],
  portal_splenic_vein: ["veia porta", "porta hepatica", "veia esplenica"],
  brain: ["cerebro", "encefalo", "cabeca", "sistema nervoso"],
  myocardium: ["miocardio", "musculo do coracao", "parede do coracao"],
  left_ventricle: ["ventriculo esquerdo", "camara esquerda coracao"],
  right_ventricle: ["ventriculo direito", "camara direita coracao"],
  left_atrium: ["atrio esquerdo"],
  right_atrium: ["atrio direito"],
  left_femur: ["femur esquerdo", "osso da coxa esquerda", "osso coxa esquerda"],
  right_femur: ["femur direito", "osso da coxa direita", "osso coxa direita"],
  left_humerus: ["umero esquerdo", "osso do braco esquerdo"],
  right_humerus: ["umero direito", "osso do braco direito"],
  left_clavicle: ["clavicula esquerda"],
  right_clavicle: ["clavicula direita"],
  left_scapula: ["escapula esquerda", "omoplata esquerda"],
  right_scapula: ["escapula direita", "omoplata direita"],
  left_hip: ["quadril esquerdo", "osso do quadril esquerdo", "pelve esquerda"],
  right_hip: ["quadril direito", "osso do quadril direito", "pelve direita"],
  left_iliopsoas: ["iliopsoas esquerdo", "psoas esquerdo"],
  right_iliopsoas: ["iliopsoas direito", "psoas direito"],
  left_gluteus_maximus: ["gluteo maximo esquerdo", "gluteo esquerdo"],
  right_gluteus_maximus: ["gluteo maximo direito", "gluteo direito"],
  trachea: ["traqueia", "via aerea"],
  esophagus: ["esofago", "tubo digestivo torax"],
  colon: ["colon", "intestino grosso"],
  small_bowel: ["intestino delgado", "alcas intestinais"],
  duodenum: ["duodeno"],
  left_adrenal: ["suprarrenal esquerda", "adrenal esquerda"],
  right_adrenal: ["suprarrenal direita", "adrenal direita"]
});

function genericAliases(structure) {
  const aliases = [];
  if (structure.category === "bones") aliases.push("osso", "ossos", "esqueleto");
  if (structure.category === "muscles") aliases.push("musculo", "musculos");
  if (structure.category === "vessels") aliases.push("vaso", "vasos", "arteria", "veia");
  if (structure.category === "organs") aliases.push("orgao", "orgaos");
  if (/vertebra/i.test(structure.id)) aliases.push("vertebra", "coluna", "espinha");
  if (/rib/i.test(structure.id)) aliases.push("costela", "costelas", "torax");
  return aliases;
}

function searchTextForStructure(structure) {
  return normalizeSearch([
    structure.name,
    structure.englishName,
    structure.region,
    structure.category,
    ...(SEARCH_ALIASES[structure.id] || []),
    ...genericAliases(structure)
  ].join(" "));
}

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  const curr = new Array(b.length + 1);

  for (let i = 1; i <= a.length; i += 1) {
    curr[0] = i;
    for (let k = 1; k <= b.length; k += 1) {
      curr[k] = Math.min(
        curr[k - 1] + 1,
        prev[k] + 1,
        prev[k - 1] + (a[i - 1] === b[k - 1] ? 0 : 1)
      );
    }
    for (let k = 0; k <= b.length; k += 1) prev[k] = curr[k];
  }
  return prev[b.length];
}

function tokenSimilarity(queryToken, candidateToken) {
  if (!queryToken || !candidateToken) return 0;
  if (candidateToken === queryToken) return 1;
  if (candidateToken.startsWith(queryToken) || queryToken.startsWith(candidateToken)) return 0.92;
  const maxLen = Math.max(queryToken.length, candidateToken.length);
  if (maxLen <= 2) return 0;
  const distance = levenshtein(queryToken, candidateToken);
  const similarity = 1 - distance / maxLen;
  const tolerance = maxLen <= 4 ? 0.72 : maxLen <= 7 ? 0.66 : 0.60;
  return similarity >= tolerance ? similarity : 0;
}

function scoreStructureSearch(structure, rawQuery) {
  const query = normalizeSearch(rawQuery);
  if (!query) return 1;

  const haystack = searchTextForStructure(structure);
  if (haystack === query) return 100;
  if (haystack.includes(query)) return 92;

  const queryTokens = query.split(" ").filter(Boolean);
  const candidateTokens = haystack.split(" ").filter(Boolean);
  let total = 0;
  let matched = 0;

  for (const q of queryTokens) {
    let best = 0;
    for (const c of candidateTokens) best = Math.max(best, tokenSimilarity(q, c));
    if (best > 0) {
      matched += 1;
      total += best;
    }
  }

  if (!matched) return 0;
  const coverage = matched / queryTokens.length;
  if (coverage < 0.5) return 0;

  let score = 55 * coverage + 35 * (total / queryTokens.length);

  const name = normalizeSearch(structure.name);
  const english = normalizeSearch(structure.englishName);
  if (name.startsWith(query) || english.startsWith(query)) score += 10;

  return score;
}

function createStructureList() {
  const container = $("structureList");
  if (!container) return;
  const structures = availableStructures();

  const render = (rawQuery) => {
    const query = normalizeSearch(rawQuery);
    const ranked = structures
      .map((structure) => ({ structure, score: scoreStructureSearch(structure, query) }))
      .filter((item) => !query || item.score >= 45)
      .sort((a, b) => b.score - a.score || a.structure.name.localeCompare(b.structure.name, "pt-BR"));

    container.innerHTML = ranked.length
      ? ranked.map(({ structure: s }) =>
          '<button type="button" class="structure-row" data-structure="' + s.id + '">' +
          '<span class="structure-swatch" style="--swatch:' + s.color + '"></span>' +
          '<span class="structure-copy"><strong>' + s.name + '</strong><small>' + s.region + '</small></span></button>'
        ).join("")
      : '<div class="structure-search-empty"><strong>Nenhuma estrutura encontrada</strong><small>Tente outro nome, sinônimo ou uma escrita aproximada.</small></div>';

    container.querySelectorAll("[data-structure]").forEach((button) => {
      button.addEventListener("click", async () => {
        await selectStructure(button.dataset.structure, true);
        closeStructureSearchPanel();
      });
    });

    if ($("structureCount")) {
      $("structureCount").textContent = query
        ? ranked.length + " resultado" + (ranked.length === 1 ? "" : "s")
        : structures.length + " estruturas disponíveis";
    }
  };

  render("");

  $("structureSearch")?.addEventListener("input", function () {
    render(this.value);
  });
}

function openStructureSearchPanel() {
  const panel = $("structureSearchPanel");
  const trigger = $("openStructureSearch");
  if (!panel) return;
  panel.hidden = false;
  requestAnimationFrame(() => panel.classList.add("open"));
  trigger?.setAttribute("aria-expanded", "true");
  setTimeout(() => $("structureSearch")?.focus(), 60);
}

function closeStructureSearchPanel() {
  const panel = $("structureSearchPanel");
  const trigger = $("openStructureSearch");
  if (!panel || panel.hidden) return;
  panel.classList.remove("open");
  trigger?.setAttribute("aria-expanded", "false");
  setTimeout(() => {
    if (!panel.classList.contains("open")) panel.hidden = true;
  }, 150);
}

function bindStructureSearchPanel() {
  $("openStructureSearch")?.addEventListener("click", openStructureSearchPanel);
  $("closeStructureSearch")?.addEventListener("click", closeStructureSearchPanel);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeStructureSearchPanel();
  });

  document.addEventListener("pointerdown", (event) => {
    const panel = $("structureSearchPanel");
    const trigger = $("openStructureSearch");
    if (!panel || panel.hidden) return;
    if (panel.contains(event.target) || trigger?.contains(event.target)) return;
    closeStructureSearchPanel();
  });
}

function updateStructureUi(structure) {
  document.querySelectorAll("[data-structure]").forEach((row) => row.classList.toggle("active", row.dataset.structure === structure?.id));
  document.querySelectorAll("[data-plane-structure]").forEach((el) => {
    el.textContent = "";
    el.hidden = true;
  });

  document.querySelectorAll("[data-selected-structure-badge]").forEach((el) => {
    if (!structure) {
      el.textContent = "";
      el.hidden = true;
      el.style.removeProperty("--structure-color");
      return;
    }
    el.textContent = structure.name;
    el.style.setProperty("--structure-color", structure.color || "#ff8f9b");
    el.hidden = false;
  });
  if (!structure) {
    if ($("selectedStructureName")) $("selectedStructureName").textContent = "Explore o atlas";
    if ($("selectedStructureMeta")) $("selectedStructureMeta").textContent = "Clique no exame ou escolha uma estrutura.";
    if ($("infoTitle")) $("infoTitle").textContent = "Nenhuma estrutura selecionada";
    if ($("infoDescription")) $("infoDescription").textContent = "Selecione uma estrutura na lista ou clique diretamente sobre um corte.";
    return;
  }

  if ($("selectedStructureName")) $("selectedStructureName").textContent = structure.name;
  if ($("selectedStructureMeta")) $("selectedStructureMeta").textContent = structure.region + " · " + structure.englishName;
  if ($("infoTitle")) $("infoTitle").textContent = structure.name;
  if ($("infoDescription")) {
    const stat = structureStat(structure);
    $("infoDescription").textContent = structure.description + (stat?.count ? " Aproximadamente " + Number(stat.count).toLocaleString("pt-BR") + " voxels amostrados." : "");
  }
}

async function selectStructure(id, move) {
  const structure = getStructure(id);
  const stat = structure && structureStat(structure);
  if (!structure || !stat) return;

  state.selectedId = id;
  if (move && Array.isArray(stat.centroid)) {
    state.coord = stat.centroid.slice();
  }
  updateStructureUi(structure);
  await updateViews();
  announce(structure.name + " selecionada");
}

async function loadMask(group, plane, ordinal) {
  const url = maskUrl(group, plane, ordinal);
  if (state.maskCache.has(url)) return state.maskCache.get(url);

  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve({
        img,
        canvas,
        ctx,
        data: imageData.data,
        width: canvas.width,
        height: canvas.height
      });
    };
    img.onerror = reject;
    img.src = url;
  });

  state.maskCache.set(url, promise);
  return promise;
}

function nearestMaskLabel(mask, x, y, maxRadius) {
  const width = mask.width || mask.canvas.width;
  const height = mask.height || mask.canvas.height;
  const data = mask.data || mask.ctx.getImageData(0, 0, width, height).data;

  const read = (px, py) => {
    if (px < 0 || py < 0 || px >= width || py >= height) return 0;
    return data[(px + py * width) * 4];
  };

  const exact = read(x, y);
  if (exact) return { label: exact, distance: 0 };

  for (let radius = 1; radius <= maxRadius; radius += 1) {
    let best = null;
    let bestDistance = Infinity;

    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;

        const label = read(x + dx, y + dy);
        if (!label) continue;

        const distance = Math.hypot(dx, dy);
        if (distance < bestDistance) {
          best = label;
          bestDistance = distance;
        }
      }
    }

    if (best) return { label: best, distance: bestDistance };
  }

  return null;
}

async function labelsAtPoint(plane, u, v) {
  const ordinal = planeOrdinal(plane);
  const groups = state.manifest.groups || [];
  const maxRadius = plane === "axial" ? 8 : 5;

  const candidates = (await Promise.all(groups.map(async (group) => {
    try {
      const mask = await loadMask(group, plane, ordinal);
      const width = mask.width || mask.canvas.width;
      const height = mask.height || mask.canvas.height;
      const x = Math.max(0, Math.min(width - 1, Math.floor(u * width)));
      const y = Math.max(0, Math.min(height - 1, Math.floor(v * height)));
      const hit = nearestMaskLabel(mask, x, y, maxRadius);
      if (!hit) return null;

      const structure = STRUCTURES.find((s) => s.group === group && s.localLabel === hit.label);
      return structure ? { structure, distance: hit.distance } : null;
    } catch (error) {
      return null;
    }
  }))).filter(Boolean);

  candidates.sort((a, b) => a.distance - b.distance);
  if (!candidates.length) return [];

  const bestDistance = candidates[0].distance;
  return candidates
    .filter((item, index) => index === 0 || item.distance <= bestDistance + 1.5)
    .map((item) => item.structure)
    .filter((item, index, array) => array.findIndex((candidate) => candidate.id === item.id) === index);
}

function prefetchPlaneMasks(plane, ordinal = planeOrdinal(plane)) {
  const groups = state.manifest?.groups || [];
  groups.forEach((group) => {
    loadMask(group, plane, ordinal).catch(() => {});
  });
}

function setLiveSelectedStructure(structure, plane) {
  const nextId = structure?.id || null;
  if (state.selectedId === nextId) return;

  state.selectedId = nextId;
  updateStructureUi(structure || null);

  if (structure) {
    renderPointStructures([structure]);
    announce("Estrutura identificada: " + structure.name);
  } else {
    renderPointStructures([]);
  }

  void renderOverlayForPlane(plane);
  clearTimeout(state.liveIdentifyTimer);
  state.liveIdentifyTimer = setTimeout(() => {
    if (state.draggingPlane === plane) {
      void Promise.all(PLANES.filter((item) => item !== plane).map(renderOverlayForPlane));
    }
  }, 48);
}

function scheduleLiveIdentification(plane, u, v) {
  const token = ++state.liveIdentifyToken;
  if (state.liveIdentifyFrame) cancelAnimationFrame(state.liveIdentifyFrame);

  state.liveIdentifyFrame = requestAnimationFrame(() => {
    state.liveIdentifyFrame = 0;
    void labelsAtPoint(plane, u, v).then((items) => {
      if (token !== state.liveIdentifyToken || state.draggingPlane !== plane) return;
      setLiveSelectedStructure(items[0] || null, plane);
    });
  });
}

function renderPointStructures(items) {
  state.latestPointStructures = items;
  const container = $("pointStructures");
  if (!container) return;
  if (!items.length) {
    container.innerHTML = "<small>Nenhuma estrutura segmentada neste ponto.</small>";
    return;
  }
  container.innerHTML = items.map((s) => '<button type="button" data-point-structure="' + s.id + '">' + s.name + "</button>").join("");
  container.querySelectorAll("[data-point-structure]").forEach((button) => {
    button.addEventListener("click", () => selectStructure(button.dataset.pointStructure, false));
  });
}

function categoryLabel(category) {
  const labels = {
    organs: "Órgão",
    vessels: "Vaso sanguíneo",
    bones: "Osso",
    muscles: "Músculo"
  };
  return labels[category] || "Estrutura anatômica";
}

function showAnatomyTooltip(plane, event, structure) {
  const stage = document.querySelector('[data-stage="' + plane + '"]');
  if (!stage) return;

  let tooltip = stage.querySelector(".anatomy-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "anatomy-tooltip";
    stage.appendChild(tooltip);
  }

  const rect = stage.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (structure) {
    tooltip.innerHTML =
      '<span>Estrutura identificada</span>' +
      '<strong>' + structure.name + '</strong>' +
      '<small>' + categoryLabel(structure.category) + ' · ' + structure.region + '</small>';
    tooltip.classList.remove("is-empty");
  } else {
    tooltip.innerHTML =
      '<span>Ponto selecionado</span>' +
      '<strong>Sem identificação</strong>' +
      '<small>Nenhuma estrutura segmentada neste ponto.</small>';
    tooltip.classList.add("is-empty");
  }

  tooltip.style.left = Math.max(10, Math.min(rect.width - 200, x + 14)) + "px";
  tooltip.style.top = Math.max(10, Math.min(rect.height - 86, y + 14)) + "px";
  tooltip.classList.add("show");

  clearTimeout(tooltip._hideTimer);
  tooltip._hideTimer = setTimeout(() => tooltip.classList.remove("show"), structure ? 2600 : 1700);
}

async function renderOverlayForPlane(plane) {
  const canvas = getOverlay(plane);
  const img = getImg(plane);
  const stage = document.querySelector('[data-stage="' + plane + '"]');
  if (!canvas || !img || !stage || !img.naturalWidth) return;

  const rect = containRect(img);
  canvas.style.left = rect.left + "px";
  canvas.style.top = rect.top + "px";
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";

  const structure = state.selectedId ? getStructure(state.selectedId) : null;
  if (!structure || !state.colorEnabled) {
    canvas.width = 1;
    canvas.height = 1;
    canvas.getContext("2d").clearRect(0,0,1,1);
    return;
  }

  try {
    const mask = await loadMask(structure.group, plane, planeOrdinal(plane));
    canvas.width = mask.canvas.width;
    canvas.height = mask.canvas.height;
    const srcData = mask.data || mask.ctx.getImageData(0,0,mask.canvas.width,mask.canvas.height).data;
    const out = canvas.getContext("2d").createImageData(mask.canvas.width, mask.canvas.height);
    const hex = structure.color.replace("#","");
    const r = parseInt(hex.slice(0,2),16);
    const g = parseInt(hex.slice(2,4),16);
    const b = parseInt(hex.slice(4,6),16);

    const width = mask.canvas.width;
    const height = mask.canvas.height;
    const label = structure.localLabel;

    const isSelected = (x, y) => {
      if (x < 0 || y < 0 || x >= width || y >= height) return false;
      return srcData[(x + y * width) * 4] === label;
    };

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const pixel = x + y * width;
        const i = pixel * 4;
        if (srcData[i] !== label) continue;

        const edge =
          !isSelected(x - 1, y) ||
          !isSelected(x + 1, y) ||
          !isSelected(x, y - 1) ||
          !isSelected(x, y + 1);

        out.data[i] = r;
        out.data[i+1] = g;
        out.data[i+2] = b;
        out.data[i+3] = edge ? 245 : 128;
      }
    }

    canvas.getContext("2d").putImageData(out,0,0);
  } catch (error) {
    canvas.width = 1;
    canvas.height = 1;
  }
}

async function setPlaneImage(plane) {
  const ordinal = planeOrdinal(plane);
  const img = getImg(plane);
  const url = imageUrl(plane, ordinal);
  const preloaded = await preloadImage(url);
  if (img.src !== preloaded.src) img.src = preloaded.src;
  await img.decode?.().catch(() => {});
  prefetchAround(plane, ordinal);
  const count = document.querySelector('[data-plane-count="' + plane + '"]');
  if (count) count.textContent = (ordinal + 1) + " / " + planeInfo(plane).voxels.length;
}

async function updateViews() {
  await Promise.all(PLANES.map(setPlaneImage));
  updateAllCrosshairs();
  syncSlider();
  await Promise.all(PLANES.map(renderOverlayForPlane));
}

async function updateScrolledPlane(plane) {
  await setPlaneImage(plane);
  prefetchPlaneMasks(plane);
  updateAllCrosshairs();
  syncSlider();
  await renderOverlayForPlane(plane);
}

function setPlaneImageFast(plane, token) {
  const ordinal = planeOrdinal(plane);
  const img = getImg(plane);
  if (!img) return;

  const url = imageUrl(plane, ordinal);
  if (img.dataset.requestedUrl !== url) {
    img.dataset.requestedUrl = url;
    img.src = url;
  }

  prefetchAround(plane, ordinal);

  const count = document.querySelector('[data-plane-count="' + plane + '"]');
  if (count) count.textContent = (ordinal + 1) + " / " + planeInfo(plane).voxels.length;

  img.onload = () => {
    if (token !== state.pointerNavToken) return;
    updateCrosshair(plane);
  };
}

function updatePointerNavigationFast(plane) {
  const token = ++state.pointerNavToken;
  const orthogonal = PLANES.filter((item) => item !== plane);
  orthogonal.forEach((item) => setPlaneImageFast(item, token));
  updateAllCrosshairs();
  syncSlider();

  clearTimeout(state.pointerRefreshTimer);
  state.pointerRefreshTimer = setTimeout(() => {
    if (token !== state.pointerNavToken) return;
    void Promise.all(orthogonal.map(renderOverlayForPlane));
  }, 120);
}

function schedulePointerNavigation(plane) {
  state.lastPointerPlane = plane;
  if (state.pointerFrame) return;

  state.pointerFrame = requestAnimationFrame(() => {
    state.pointerFrame = 0;
    if (!state.lastPointerPlane) return;
    updatePointerNavigationFast(state.lastPointerPlane);
  });
}

function bindViewerClicks() {
  PLANES.forEach((plane) => {
    const stage = document.querySelector('[data-stage="' + plane + '"]');

    stage?.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      setActivePlane(plane);
      state.draggingPlane = plane;
      state.dragStartX = event.clientX;
      state.dragStartY = event.clientY;
      state.dragMoved = false;
      state.suppressClick = false;
      stage.setPointerCapture?.(event.pointerId);

      const uv = setCoordFromPointer(plane, event);
      if (!uv) return;
      prefetchPlaneMasks(plane);
      schedulePointerNavigation(plane);
      scheduleLiveIdentification(plane, uv.u, uv.v);
    });

    stage?.addEventListener("pointermove", (event) => {
      if (state.draggingPlane !== plane || (event.buttons & 1) !== 1) return;
      event.preventDefault();

      if (Math.hypot(event.clientX - state.dragStartX, event.clientY - state.dragStartY) > 4) {
        state.dragMoved = true;
      }

      const uv = setCoordFromPointer(plane, event);
      if (!uv) {
        setLiveSelectedStructure(null, plane);
        return;
      }
      schedulePointerNavigation(plane);
      scheduleLiveIdentification(plane, uv.u, uv.v);
    });

    const finishDrag = (event) => {
      if (state.draggingPlane !== plane) return;
      state.draggingPlane = null;
      if (state.dragMoved) state.liveIdentifyToken += 1;
      state.suppressClick = state.dragMoved;
      clearTimeout(state.pointerRefreshTimer);
      state.lastPointerPlane = null;
      state.pointerNavToken += 1;
      try { stage.releasePointerCapture?.(event.pointerId); } catch {}
      updateAllCrosshairs();
    };

    stage?.addEventListener("pointerup", finishDrag);
    stage?.addEventListener("pointercancel", finishDrag);
    stage?.addEventListener("lostpointercapture", () => {
      if (state.draggingPlane === plane) {
        state.draggingPlane = null;
        state.liveIdentifyToken += 1;
        clearTimeout(state.pointerRefreshTimer);
        state.lastPointerPlane = null;
        state.pointerNavToken += 1;
        updateAllCrosshairs();
      }
    });

    stage?.addEventListener("click", async (event) => {
      if (state.suppressClick) {
        state.suppressClick = false;
        return;
      }

      setActivePlane(plane);
      const uv = setCoordFromPointer(plane, event);
      if (!uv) return;

      prefetchPlaneMasks(plane);
      const items = await labelsAtPoint(plane, uv.u, uv.v);
      renderPointStructures(items);

      if (items[0]) {
        const structure = items[0];
        state.selectedId = structure.id;
        updateStructureUi(structure);
        if ($("selectedStructureMeta")) {
          $("selectedStructureMeta").textContent =
            "Você clicou em: " + structure.name + " · " + categoryLabel(structure.category);
        }
        
        await Promise.all(PLANES.map(renderOverlayForPlane));
        announce("Estrutura identificada: " + structure.name);
      } else {
        if ($("selectedStructureMeta")) {
          $("selectedStructureMeta").textContent = "Nenhuma estrutura identificada neste ponto.";
        }
        
      }
    });

    document.querySelector('[data-plane-tile="' + plane + '"]')?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") setActivePlane(plane);
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        void moveSliceForPlane(plane, -1, true);
      }
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        void moveSliceForPlane(plane, 1, true);
      }
    });
  });

  document.addEventListener("wheel", async (event) => {
    const stage = event.target instanceof Element ? event.target.closest("[data-stage]") : null;
    if (!stage) return;

    event.preventDefault();
    event.stopPropagation();

    const plane = stage.dataset.stage;
    if (!PLANES.includes(plane)) return;
    setActivePlane(plane);

    state.wheelAccumulator[plane] += event.deltaY;
    if (Math.abs(state.wheelAccumulator[plane]) < 18 || state.interactionBusy) return;

    const direction = state.wheelAccumulator[plane] > 0 ? 1 : -1;
    state.wheelAccumulator[plane] = 0;
    state.interactionBusy = true;
    try {
      await moveSliceForPlane(plane, direction, true);
    } finally {
      state.interactionBusy = false;
    }
  }, { passive: false, capture: true });
}

function bindColorToggle() {
  const button = $("colorToggle");
  if (!button) return;

  const sync = () => {
    button.classList.toggle("active", state.colorEnabled);
    button.setAttribute("aria-pressed", String(state.colorEnabled));
    const label = button.querySelector("span");
    if (label) label.textContent = state.colorEnabled ? "Cor Ligada" : "Cor Desligada";
  };

  sync();
  button.addEventListener("click", async () => {
    state.colorEnabled = !state.colorEnabled;
    sync();
    await Promise.all(PLANES.map(renderOverlayForPlane));
  });
}

function bindSliceControls() {
  $("sliceSlider")?.addEventListener("input", async function () {
    const values = planeInfo(state.activePlane).voxels;
    const ordinal = Math.max(0, Math.min(values.length - 1, Number(this.value)));
    const axis = state.activePlane === "axial" ? 2 : state.activePlane === "coronal" ? 1 : 0;
    state.coord[axis] = values[ordinal];
    await updateViews();
  });

  $("slicePrev")?.addEventListener("click", () => moveSlice(-1));
  $("sliceNext")?.addEventListener("click", () => moveSlice(1));
}

async function moveSliceForPlane(plane, delta, lightweight) {
  const values = planeInfo(plane).voxels;
  let ordinal = planeOrdinal(plane) + delta;
  ordinal = Math.max(0, Math.min(values.length - 1, ordinal));
  const axis = plane === "axial" ? 2 : plane === "coronal" ? 1 : 0;
  state.coord[axis] = values[ordinal];
  if (lightweight) await updateScrolledPlane(plane);
  else await updateViews();
}

async function moveSlice(delta) {
  await moveSliceForPlane(state.activePlane, delta, false);
}

function bindRegions() {
  document.querySelectorAll("[data-region]").forEach((button) => {
    button.addEventListener("click", async () => {
      document.querySelectorAll("[data-region]").forEach((item) => item.classList.toggle("active", item === button));
      const region = button.dataset.region;
      if (region === "overview") {
        const [nx,ny,nz] = state.manifest.originalDims;
        state.coord = [Math.floor(nx/2),Math.floor(ny/2),Math.floor(nz/2)];
        state.selectedId = null;
        updateStructureUi(null);
        await updateViews();
        return;
      }
      const id = REGION_STRUCTURE[region];
      if (id) await selectStructure(id, true);
    });
  });
}

async function boot() {
  setProgress(8, "Abrindo atlas", "carregando manifesto leve");
  const response = await fetch("/data/radiology-atlas/manifest.json?v=20261005-stack1", { cache: "no-cache" });
  if (!response.ok) throw new Error("Manifesto do atlas indisponível");
  state.manifest = await response.json();

  const [nx,ny,nz] = state.manifest.originalDims;
  state.coord = [Math.floor(nx/2),Math.floor(ny/2),Math.floor(nz/2)];

  if ($("datasetStatus")) {
    $("datasetStatus").textContent = state.manifest.architecture === "progressive-webp-slices"
      ? "sem download do volume inteiro"
      : "atlas pronto";
  }

  PLANES.forEach((plane) => {
    const el = document.querySelector('[data-plane-count="' + plane + '"]');
    if (el) el.textContent = planeInfo(plane).voxels.length + " cortes";
  });

  setProgress(32, "Preparando visualizador", "baixando 3 imagens iniciais");
  createStructureList();
  bindStructureSearchPanel();
  bindViewerClicks();
  bindColorToggle();
  bindSliceControls();
  bindRegions();
  setActivePlane("axial");

  await updateViews();
  PLANES.forEach((plane) => prefetchPlaneMasks(plane));
  setProgress(86, "Quase pronto", "pré-carregando cortes vizinhos");
  PLANES.forEach((plane) => prefetchAround(plane, planeOrdinal(plane)));
  await new Promise((resolve) => setTimeout(resolve, 80));
  setProgress(100, "Atlas pronto", "os próximos cortes carregam sob demanda");
  if ($("loadStatus")) $("loadStatus").textContent = "Pronto";
  updateStructureUi(null);
}

loadUser().catch(console.error);
$("logoutSidebar")?.addEventListener("click", logout);

boot().catch((error) => {
  console.error("Falha ao iniciar atlas:", error);
  fail("Não foi possível carregar o atlas de tomografia. O deploy pode ainda estar preparando os cortes.");
  setProgress(0, "Falha ao carregar", "tente novamente após o deploy terminar");
});
