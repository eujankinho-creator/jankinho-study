import { STRUCTURES, getStructure } from "./radiologia/data.js?v=20261005-stack1";

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
  pointerNavToken: 0
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
  return "/data/radiology-atlas/mask/" + group + "/" + plane + "/" + pad(ordinal) + ".png";
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

function createStructureList() {
  const container = $("structureList");
  if (!container) return;
  const structures = availableStructures();
  container.innerHTML = structures.map((s) =>
    '<button type="button" class="structure-row" data-structure="' + s.id + '" data-search="' +
    (s.name + " " + s.englishName + " " + s.region).toLowerCase() + '">' +
    '<span class="structure-swatch" style="--swatch:' + s.color + '"></span>' +
    '<span class="structure-copy"><strong>' + s.name + '</strong><small>' + s.region + '</small></span></button>'
  ).join("");

  container.querySelectorAll("[data-structure]").forEach((button) => {
    button.addEventListener("click", () => selectStructure(button.dataset.structure, true));
  });

  $("structureSearch")?.addEventListener("input", function () {
    const q = this.value.trim().toLowerCase();
    container.querySelectorAll(".structure-row").forEach((row) => {
      row.hidden = Boolean(q && !row.dataset.search.includes(q));
    });
  });
}

function updateStructureUi(structure) {
  document.querySelectorAll("[data-structure]").forEach((row) => row.classList.toggle("active", row.dataset.structure === structure?.id));
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
      resolve({ img, canvas, ctx });
    };
    img.onerror = reject;
    img.src = url;
  });

  state.maskCache.set(url, promise);
  return promise;
}

async function labelsAtPoint(plane, u, v) {
  const ordinal = planeOrdinal(plane);
  const groups = state.manifest.groups || [];
  const found = [];

  for (const group of groups) {
    try {
      const mask = await loadMask(group, plane, ordinal);
      const x = Math.max(0, Math.min(mask.canvas.width - 1, Math.floor(u * mask.canvas.width)));
      const y = Math.max(0, Math.min(mask.canvas.height - 1, Math.floor(v * mask.canvas.height)));
      const label = mask.ctx.getImageData(x, y, 1, 1).data[0];
      if (!label) continue;
      const structure = STRUCTURES.find((s) => s.group === group && s.localLabel === label);
      if (structure && !found.some((item) => item.id === structure.id)) found.push(structure);
    } catch (error) {}
  }
  return found;
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
  if (!structure) {
    canvas.width = 1;
    canvas.height = 1;
    canvas.getContext("2d").clearRect(0,0,1,1);
    return;
  }

  try {
    const mask = await loadMask(structure.group, plane, planeOrdinal(plane));
    canvas.width = mask.canvas.width;
    canvas.height = mask.canvas.height;
    const src = mask.ctx.getImageData(0,0,mask.canvas.width,mask.canvas.height);
    const out = canvas.getContext("2d").createImageData(mask.canvas.width, mask.canvas.height);
    const hex = structure.color.replace("#","");
    const r = parseInt(hex.slice(0,2),16);
    const g = parseInt(hex.slice(2,4),16);
    const b = parseInt(hex.slice(4,6),16);

    for (let i = 0; i < src.data.length; i += 4) {
      if (src.data[i] === structure.localLabel) {
        out.data[i] = r;
        out.data[i+1] = g;
        out.data[i+2] = b;
        out.data[i+3] = 145;
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

    stage?.addEventListener("pointerenter", () => {
      setActivePlane(plane);
    });

    stage?.addEventListener("pointermove", (event) => {
      setActivePlane(plane);
      const uv = setCoordFromPointer(plane, event);
      if (!uv) return;
      schedulePointerNavigation(plane);
    });

    stage?.addEventListener("pointerleave", () => {
      clearTimeout(state.pointerRefreshTimer);
      state.lastPointerPlane = null;
      state.pointerNavToken += 1;
      updateAllCrosshairs();
    });

    stage?.addEventListener("click", async (event) => {
      setActivePlane(plane);
      const uv = setCoordFromPointer(plane, event);
      if (!uv) return;
      await updateViews();

      if ($("selectedStructureMeta")) $("selectedStructureMeta").textContent = "Identificando estruturas neste ponto...";
      const items = await labelsAtPoint(plane, uv.u, uv.v);
      renderPointStructures(items);

      if (items[0]) {
        state.selectedId = items[0].id;
        updateStructureUi(items[0]);
        await Promise.all(PLANES.map(renderOverlayForPlane));
      } else if ($("selectedStructureMeta")) {
        $("selectedStructureMeta").textContent = "Nenhuma estrutura segmentada encontrada neste ponto.";
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
  bindViewerClicks();
  bindSliceControls();
  bindRegions();
  setActivePlane("axial");

  await updateViews();
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
