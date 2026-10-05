import { RadiologyMultiView } from "./radiologia/radiology-multiview.js?v=20261005-atlas4";
import {
  STRUCTURES,
  SOURCE_REGISTRY,
  RADIOLOGY_STUDY,
  PLANE_CONFIG,
  REGION_TARGETS,
  getStructure
} from "./radiologia/data.js?v=20261005-atlas4";

const $ = (id) => document.getElementById(id);
const state = {
  selectedId: null,
  plane: "axial",
  frac: [0.5, 0.5, 0.5],
  availableIds: new Set(),
  visibility: new Map(STRUCTURES.map((s) => [s.id, true]))
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

function showBootError(message) {
  const element = $("labBootError");
  if (!element) return;
  element.hidden = false;
  element.textContent = message;
}

function structureAvailable(id) {
  return state.availableIds.has(id);
}

function updatePlaneButtons() {
  document.querySelectorAll("[data-plane]").forEach((button) => {
    const active = button.dataset.plane === state.plane;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  document.querySelectorAll("[data-rad-view-plane]").forEach((tile) => {
    tile.classList.toggle("is-active-plane", tile.dataset.radViewPlane === state.plane);
  });
  if ($("selectedPlaneState")) {
    $("selectedPlaneState").textContent = PLANE_CONFIG[state.plane].label + " · cruz sincronizada";
  }
}

function updateStructureListSelection() {
  document.querySelectorAll(".structure-row").forEach((row) => {
    row.classList.toggle("active", row.dataset.structureId === state.selectedId);
  });
}

function updateStructureInfo(radiology) {
  const structure = state.selectedId ? getStructure(state.selectedId) : null;
  const empty = $("structureInfoEmpty");
  const content = $("structureInfoContent");

  if (!structure) {
    if (empty) empty.hidden = false;
    if (content) content.hidden = true;
    return;
  }

  if (empty) empty.hidden = true;
  if (content) content.hidden = false;
  if ($("structureTitle")) $("structureTitle").textContent = structure.name;
  if ($("structureEnglish")) $("structureEnglish").textContent = structure.englishName;
  if ($("structureRegion")) $("structureRegion").textContent = structure.region;
  if ($("structureDescription")) $("structureDescription").textContent = structure.description;

  const bounds = radiology.labelBounds?.get(structure.label);
  if ($("structureStudies")) $("structureStudies").textContent = "Mesmo CT · máscara co-registrada";
  if ($("structureMeshCount")) {
    $("structureMeshCount").textContent = bounds?.voxelCount
      ? bounds.voxelCount.toLocaleString("pt-BR") + " voxels"
      : "estrutura segmentada";
  }
}

function updateSlicePresence(radiology) {
  const container = $("sliceStructures");
  if (!container) return;
  const axis = PLANE_CONFIG[state.plane].fracAxis;
  const structures = radiology
    .structuresAtPlane(state.plane, state.frac[axis])
    .filter((s) => structureAvailable(s.id))
    .slice(0, 18);

  if (!structures.length) {
    container.innerHTML = '<span class="slice-empty">Mova a cruz para explorar as estruturas deste nível.</span>';
    return;
  }

  container.innerHTML = structures.map((s) =>
    '<button type="button" class="slice-structure-chip' +
    (s.id === state.selectedId ? " active" : "") +
    '" data-slice-structure="' + s.id + '">' + s.name + "</button>"
  ).join("");

  container.querySelectorAll("[data-slice-structure]").forEach((button) => {
    button.addEventListener("click", () => selectStructure(button.dataset.sliceStructure, radiology, false));
  });
}

function syncSliceUi(radiology) {
  const slider = $("sliceSlider");
  const total = radiology.sliceCount(state.plane);
  const current = radiology.currentSliceIndex(state.plane);

  if (slider) {
    slider.max = String(Math.max(0, total - 1));
    slider.value = String(current);
  }
  if ($("sliceCurrent")) $("sliceCurrent").textContent = String(current + 1);
  if ($("sliceTotal")) $("sliceTotal").textContent = String(total);

  const axis = PLANE_CONFIG[state.plane].fracAxis;
  if ($("sliceCoordinate")) {
    $("sliceCoordinate").textContent = Math.round(state.frac[axis] * 100) + "% do eixo";
  }
  updateSlicePresence(radiology);
}

function selectStructure(id, radiology, moveToStructure) {
  const structure = getStructure(id);
  if (!structure || !structureAvailable(id)) return;

  state.selectedId = id;
  radiology.selectLabel(structure.label);

  if (moveToStructure && radiology.focusLabel(structure.label, true)) {
    state.frac = radiology.crosshairFrac.slice();
  }

  updateStructureListSelection();
  updateStructureInfo(radiology);
  syncSliceUi(radiology);

  if ($("selectedRadiologyName")) {
    $("selectedRadiologyName").textContent = structure.name + " · marcada nos três planos";
  }
  announce(structure.name + " selecionada");
}

function createStructureList(radiology) {
  const container = $("structureList");
  if (!container) return;
  container.innerHTML = "";

  const search = document.createElement("input");
  search.type = "search";
  search.className = "structure-search";
  search.placeholder = "Buscar estrutura: fígado, encéfalo, fêmur, aorta…";
  search.setAttribute("aria-label", "Buscar estrutura anatômica");
  container.before(search);

  const rows = [];
  STRUCTURES.forEach((structure) => {
    if (!structureAvailable(structure.id)) return;

    const row = document.createElement("div");
    row.className = "structure-row";
    row.dataset.structureId = structure.id;
    row.dataset.search = (structure.name + " " + structure.englishName + " " + structure.region).toLowerCase();

    const select = document.createElement("button");
    select.type = "button";
    select.className = "structure-select";
    select.innerHTML =
      '<span class="structure-swatch" style="--structure-color:' + structure.color + '"></span>' +
      '<span class="structure-name"><strong>' + structure.name + '</strong><small>' +
      structure.region + " · " + structure.englishName + "</small></span>";
    select.addEventListener("click", () => selectStructure(structure.id, radiology, true));

    const visibility = document.createElement("button");
    visibility.type = "button";
    visibility.className = "structure-visibility is-visible";
    visibility.setAttribute("aria-label", "Mostrar ou ocultar " + structure.name);
    visibility.innerHTML = "<span></span>";
    visibility.addEventListener("click", () => {
      const next = !state.visibility.get(structure.id);
      state.visibility.set(structure.id, next);
      radiology.setStructureVisibility(structure.label, next);
      visibility.classList.toggle("is-visible", next);
      visibility.setAttribute("aria-pressed", next ? "true" : "false");
    });

    row.append(select, visibility);
    container.appendChild(row);
    rows.push(row);
  });

  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    rows.forEach((row) => { row.hidden = q && !row.dataset.search.includes(q); });
  });
}

function updateStudyUi(radiology) {
  if ($("studyName")) $("studyName").textContent = RADIOLOGY_STUDY.name;
  if ($("studyModality")) $("studyModality").textContent = "TC + 3 mapas";
  if ($("studySource")) $("studySource").textContent = RADIOLOGY_STUDY.source;
  if ($("studyLicense")) $("studyLicense").textContent = RADIOLOGY_STUDY.license;
  if ($("studySlices")) {
    const dims = radiology.dims || [1,1,1];
    $("studySlices").textContent = dims[0] + "×" + dims[1] + "×" + dims[2] + " voxels";
  }
  if ($("ctDatasetLabel")) $("ctDatasetLabel").textContent = "CT corporal · estruturas co-registradas";
}

function renderSources() {
  const container = $("sourceRegistry");
  if (!container) return;
  container.innerHTML = SOURCE_REGISTRY.map((source) =>
    '<article class="source-item"><div><strong>' + source.label + '</strong><span>' + source.role +
    '</span></div><p>' + source.license + '</p><small>' + source.attribution +
    '</small><div class="source-links"><a href="' + source.sourceUrl +
    '" target="_blank" rel="noopener">Fonte</a><a href="' + source.licenseUrl +
    '" target="_blank" rel="noopener">Licença</a></div></article>'
  ).join("");
}

function setPlane(plane, radiology) {
  if (!PLANE_CONFIG[plane]) return;
  state.plane = plane;
  radiology.setPlane(plane, true);
  updatePlaneButtons();
  syncSliceUi(radiology);
}

function bindWindowPresets(radiology) {
  document.querySelectorAll("[data-window-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const width = Number(button.dataset.width);
      const level = Number(button.dataset.level);
      if ($("windowWidth")) $("windowWidth").value = String(width);
      if ($("windowLevel")) $("windowLevel").value = String(level);
      if ($("windowWidthValue")) $("windowWidthValue").textContent = String(width);
      if ($("windowLevelValue")) $("windowLevelValue").textContent = String(level);
      radiology.setWindow(width, level);
      document.querySelectorAll("[data-window-preset]").forEach((item) => item.classList.toggle("active", item === button));
    });
  });
}

function bindRegionControls(radiology) {
  document.querySelectorAll("[data-region-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const region = button.dataset.regionTarget;
      document.querySelectorAll("[data-region-target]").forEach((item) => item.classList.toggle("active", item === button));

      if (region === "overview") {
        radiology.setCrosshairFraction([0.5,0.5,0.5], true);
        radiology.viewers.axial.setZoom(0.68);
        state.frac = radiology.crosshairFrac.slice();
        setPlane("axial", radiology);
        return;
      }

      const id = REGION_TARGETS[region];
      if (id && structureAvailable(id)) selectStructure(id, radiology, true);
    });
  });
}

function bindControls(radiology) {
  document.querySelectorAll("[data-plane]").forEach((button) => {
    button.addEventListener("click", () => setPlane(button.dataset.plane, radiology));
  });

  $("sliceSlider")?.addEventListener("input", function () {
    radiology.setSlice(Number(this.value), true);
    state.frac = radiology.crosshairFrac.slice();
    syncSliceUi(radiology);
  });
  $("slicePrev")?.addEventListener("click", () => {
    radiology.setSlice(radiology.currentSliceIndex() - 1, true);
    state.frac = radiology.crosshairFrac.slice();
    syncSliceUi(radiology);
  });
  $("sliceNext")?.addEventListener("click", () => {
    radiology.setSlice(radiology.currentSliceIndex() + 1, true);
    state.frac = radiology.crosshairFrac.slice();
    syncSliceUi(radiology);
  });

  $("windowWidth")?.addEventListener("input", function () {
    radiology.setWindow(Number(this.value), Number($("windowLevel").value));
    $("windowWidthValue").textContent = this.value;
  });
  $("windowLevel")?.addEventListener("input", function () {
    radiology.setWindow(Number($("windowWidth").value), Number(this.value));
    $("windowLevelValue").textContent = this.value;
  });

  $("radZoomIn")?.addEventListener("click", () => radiology.zoomBy(0.12));
  $("radZoomOut")?.addEventListener("click", () => radiology.zoomBy(-0.12));
  $("radReset")?.addEventListener("click", () => radiology.resetView());
  $("mprView")?.addEventListener("click", () => setPlane("axial", radiology));
  $("segmentationToggle")?.addEventListener("click", function () {
    const active = this.classList.toggle("active");
    this.setAttribute("aria-pressed", active ? "true" : "false");
    radiology.setSegmentationVisible(active);
  });

  bindWindowPresets(radiology);
  bindRegionControls(radiology);
}

async function boot() {
  let syncing = false;
  const radiology = new RadiologyMultiView(
    $("radiologyMultiView"),
    {
      axial: $("radiologyAxialCanvas"),
      coronal: $("radiologyCoronalCanvas"),
      sagittal: $("radiologySagittalCanvas")
    },
    {
      onFirstImageReady: ({ dims }) => {
        if ($("voxelReadout")) $("voxelReadout").textContent = "CT carregado · preparando outras vistas…";
        if ($("studySlices")) $("studySlices").textContent = dims.join("×") + " voxels";
      },
      onBaseViewsReady: () => {
        if ($("voxelReadout")) $("voxelReadout").textContent = "3 vistas prontas · carregando mapas anatômicos…";
      },
      onLocationChange: (payload) => {
        if (!payload?.frac || syncing) return;
        syncing = true;
        state.frac = payload.frac.slice();
        state.plane = payload.plane || state.plane;
        if (payload.intensityText && $("voxelReadout")) $("voxelReadout").textContent = payload.intensityText;
        updatePlaneButtons();
        syncSliceUi(radiology);
        syncing = false;
      },
      onPlaneChange: (plane) => {
        state.plane = plane;
        updatePlaneButtons();
        syncSliceUi(radiology);
      },
      onStructureAtLocation: (structure) => {
        if (structure && structureAvailable(structure.id)) selectStructure(structure.id, radiology, false);
      },
      onReady: () => updateStudyUi(radiology),
      onZoomChange: (zoom) => {
        if ($("radZoomValue")) $("radZoomValue").textContent = Math.round(zoom * 100) + "%";
      }
    }
  );

  try {
    await radiology.ready;
  } catch (error) {
    console.error(error);
    showBootError("Não foi possível carregar o atlas de tomografia. Recarregue a página.");
    throw error;
  }

  state.availableIds = new Set(radiology.getAvailableStructureIds());
  state.frac = radiology.crosshairFrac.slice();
  state.plane = radiology.primaryPlane || "axial";

  createStructureList(radiology);
  bindControls(radiology);
  renderSources();
  updatePlaneButtons();
  updateStudyUi(radiology);
  updateStructureInfo(radiology);
  syncSliceUi(radiology);

  const initial = ["liver", "myocardium", "brain", "left_femur"].find((id) => structureAvailable(id));
  if (initial) selectStructure(initial, radiology, true);
}

loadUser().catch(console.error);
$("logoutSidebar")?.addEventListener("click", logout);

boot().catch((error) => {
  console.error("Falha ao iniciar atlas de tomografia:", error);
});
