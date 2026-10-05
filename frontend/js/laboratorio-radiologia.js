import { AnatomyViewer } from "./radiologia/anatomy-viewer.js";
import { RadiologyMultiView } from "./radiologia/radiology-multiview.js";
import {
  STRUCTURES,
  SOURCE_REGISTRY,
  RADIOLOGY_STUDY,
  PLANE_CONFIG,
  getStructure
} from "./radiologia/data.js";

const $ = (id) => document.getElementById(id);

const state = {
  selectedId: null,
  plane: "axial",
  frac: [0.5, 0.5, 0.5],
  availableIds: new Set(),
  structureVisibility: new Map(
    STRUCTURES.map((structure) => [structure.id, true])
  ),
  categoryVisibility: new Map([
    ["bones", true],
    ["vessels", true],
    ["organs", true],
    ["body", true]
  ])
};

async function api(url, options) {
  const response = await fetch(url, Object.assign({
    credentials: "same-origin"
  }, options || {}));

  if (response.status === 401) {
    location.href = "/login.html";
    throw new Error("Não autenticado.");
  }

  if (!response.ok) {
    throw new Error("Falha ao carregar o laboratório.");
  }

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
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin"
    });
  }
  finally {
    location.href = "/login.html";
  }
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

function updateStructureListSelection() {
  document.querySelectorAll(".structure-row").forEach((row) => {
    row.classList.toggle(
      "active",
      row.dataset.structureId === state.selectedId
    );
  });
}

function createStructureList(exam3d, radiology) {
  const container = $("structureList");
  if (!container) return;

  container.innerHTML = "";

  STRUCTURES.forEach((structure) => {
    const row = document.createElement("div");
    row.className = "structure-row";
    row.dataset.structureId = structure.id;

    if (!structureAvailable(structure.id)) {
      row.classList.add("is-unavailable");
    }

    const select = document.createElement("button");
    select.type = "button";
    select.className = "structure-select";
    select.innerHTML =
      '<span class="structure-swatch" style="--structure-color:' +
      structure.color +
      '"></span>' +
      '<span class="structure-name"><strong>' +
      structure.name +
      '</strong><small>' +
      structure.englishName +
      " · label " +
      structure.label +
      "</small></span>";

    select.disabled = !structureAvailable(structure.id);
    select.addEventListener("click", () => {
      selectStructure(structure.id, exam3d, radiology, true);
    });

    const visibility = document.createElement("button");
    visibility.type = "button";
    visibility.className = "structure-visibility is-visible";
    visibility.setAttribute("aria-label", "Ocultar " + structure.name);
    visibility.setAttribute("aria-pressed", "true");
    visibility.innerHTML = "<span></span>";
    visibility.disabled = !structureAvailable(structure.id);

    visibility.addEventListener("click", () => {
      const next = !state.structureVisibility.get(structure.id);
      state.structureVisibility.set(structure.id, next);

      exam3d.setStructureVisibility(structure.id, next);
      radiology.setStructureVisibility(structure.label, next);

      visibility.classList.toggle("is-visible", next);
      visibility.setAttribute("aria-pressed", next ? "true" : "false");
      visibility.setAttribute(
        "aria-label",
        (next ? "Ocultar " : "Mostrar ") + structure.name
      );
      row.classList.toggle("is-hidden", !next);
    });

    row.appendChild(select);
    row.appendChild(visibility);
    container.appendChild(row);
  });

  updateStructureListSelection();
}

function updateSelectedStateBadge(radiology) {
  const badge = $("selectedPlaneState");
  if (!badge) return;

  if (!state.selectedId) {
    badge.textContent = "Selecione uma estrutura";
    badge.classList.remove("in-plane", "out-plane");
    return;
  }

  const structure = getStructure(state.selectedId);
  if (!structure || !structureAvailable(structure.id)) {
    badge.textContent = "Estrutura ausente neste exame";
    badge.classList.remove("in-plane");
    badge.classList.add("out-plane");
    return;
  }

  const axis = PLANE_CONFIG[state.plane].fracAxis;
  const present = radiology.labelIntersectsPlane(
    structure.label,
    state.plane,
    state.frac[axis]
  );

  badge.textContent = present
    ? structure.name + " cruza este corte real"
    : structure.name + " fora deste corte";

  badge.classList.toggle("in-plane", present);
  badge.classList.toggle("out-plane", !present);
}

function updateStructureInfo(radiology) {
  const empty = $("structureInfoEmpty");
  const content = $("structureInfoContent");

  if (!state.selectedId) {
    if (empty) empty.hidden = false;
    if (content) content.hidden = true;
    if ($("selectedRadiologyName")) {
      $("selectedRadiologyName").textContent = "Clique em uma estrutura segmentada";
    }
    return;
  }

  const structure = getStructure(state.selectedId);
  if (!structure) return;

  if (empty) empty.hidden = true;
  if (content) content.hidden = false;

  $("structureTitle").textContent = structure.name;
  $("structureEnglish").textContent = structure.englishName;
  $("structureRegion").textContent = structure.region;
  $("structureDescription").textContent = structure.description;

  if ($("structureStudies")) {
    $("structureStudies").textContent = "Mesmo CT · mesma segmentação";
  }

  if ($("structureMeshCount")) {
    const bounds = radiology.labelBounds.get(structure.label);
    $("structureMeshCount").textContent = bounds
      ? bounds.voxelCount.toLocaleString("pt-BR") + " voxels"
      : "label " + structure.label;
  }

  if ($("selectedRadiologyName")) {
    $("selectedRadiologyName").textContent =
      structure.name + " · correspondência exata";
  }
}

function updateSlicePresence(exam3d, radiology) {
  const container = $("sliceStructures");
  if (!container) return;

  const axis = PLANE_CONFIG[state.plane].fracAxis;
  const structures = radiology
    .structuresAtPlane(state.plane, state.frac[axis])
    .filter((structure) => structureAvailable(structure.id));

  if (!structures.length) {
    container.innerHTML =
      '<span class="slice-empty">Nenhuma das estruturas segmentadas cruza este nível.</span>';
    return;
  }

  container.innerHTML = structures
    .map((structure) => {
      const selected = structure.id === state.selectedId ? " active" : "";
      return '<button type="button" class="slice-structure-chip' +
        selected +
        '" data-id="' +
        structure.id +
        '">' +
        structure.name +
        "</button>";
    })
    .join("");

  container.querySelectorAll("[data-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectStructure(button.dataset.id, exam3d, radiology, false);
    });
  });
}

function selectStructure(id, exam3d, radiology, moveToStructure) {
  const structure = id ? getStructure(id) : null;
  if (!structure || !structureAvailable(structure.id)) return;

  state.selectedId = structure.id;
  exam3d.selectStructure(structure.id);
  radiology.selectLabel(structure.label);

  if (moveToStructure) {
    const moved = radiology.focusLabel(structure.label, true);
    if (moved) {
      state.frac = radiology.crosshairFrac.slice();
      exam3d.setCrosshairFraction(state.frac, true);
    }
  }

  updateStructureListSelection();
  updateStructureInfo(radiology);
  updateSelectedStateBadge(radiology);
  updateSlicePresence(exam3d, radiology);
  syncSliceUi(exam3d, radiology);
  announce(structure.name + " selecionado");
}

function updatePlaneButtons() {
  document.querySelectorAll("[data-plane]").forEach((button) => {
    const active = button.dataset.plane === state.plane;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });

  if ($("currentPlaneLabel")) {
    $("currentPlaneLabel").textContent = PLANE_CONFIG[state.plane].label;
  }

  if ($("activePlaneReadout")) {
    $("activePlaneReadout").textContent =
      PLANE_CONFIG[state.plane].label + " · atlas real + TC";
  }
}

function syncSliceUi(exam3d, radiology) {
  const slider = $("sliceSlider");
  if (!slider) return;

  const total = radiology.sliceCount(state.plane);
  const current = radiology.currentSliceIndex(state.plane);

  slider.max = String(Math.max(0, total - 1));
  slider.value = String(current);

  if ($("sliceCurrent")) $("sliceCurrent").textContent = String(current + 1);
  if ($("sliceTotal")) $("sliceTotal").textContent = String(total);

  const axis = PLANE_CONFIG[state.plane].fracAxis;
  if ($("sliceCoordinate")) {
    $("sliceCoordinate").textContent =
      Math.round(state.frac[axis] * 100) + "% do eixo";
  }

  exam3d.setCrosshairFraction(state.frac);
  exam3d.setPlane(
    state.plane,
    state.frac[PLANE_CONFIG[state.plane].fracAxis]
  );
  updateSelectedStateBadge(radiology);
  updateSlicePresence(exam3d, radiology);
}

function setPlane(plane, exam3d, radiology) {
  if (!PLANE_CONFIG[plane]) return;
  state.plane = plane;
  radiology.setPlane(plane, true);
  exam3d.setPlane(
    plane,
    state.frac[PLANE_CONFIG[plane].fracAxis]
  );
  updatePlaneButtons();
  syncSliceUi(exam3d, radiology);
}

function updateStudyUi(radiology) {
  if ($("studyName")) $("studyName").textContent = RADIOLOGY_STUDY.name;
  if ($("studyModality")) $("studyModality").textContent = "TC + SEG";
  if ($("studySource")) $("studySource").textContent = RADIOLOGY_STUDY.source;
  if ($("studyLicense")) $("studyLicense").textContent = RADIOLOGY_STUDY.license;

  if ($("studySlices")) {
    const dims = radiology.dims || [1, 1, 1];
    $("studySlices").textContent =
      dims[0] + "×" + dims[1] + "×" + dims[2] + " voxels";
  }

  if ($("ctDatasetLabel")) {
    $("ctDatasetLabel").textContent =
      "CT + TotalSegmentator · mesmo volume";
  }
}

function renderSources() {
  const container = $("sourceRegistry");
  if (!container) return;

  container.innerHTML = SOURCE_REGISTRY.map((source) => {
    const sourceLink = source.sourceUrl
      ? '<a href="' + source.sourceUrl +
        '" target="_blank" rel="noopener">Fonte</a>'
      : "";

    const licenseLink = source.licenseUrl
      ? '<a href="' + source.licenseUrl +
        '" target="_blank" rel="noopener">Licença</a>'
      : "";

    return '<article class="source-item">' +
      '<div><strong>' + source.label + '</strong><span>' +
      source.role + '</span></div>' +
      '<p>' + source.license + '</p>' +
      '<small>' + source.attribution + '</small>' +
      '<div class="source-links">' + sourceLink + licenseLink + "</div>" +
      "</article>";
  }).join("");
}

function bindCategoryControls(exam3d, radiology) {
  document.querySelectorAll("[data-anatomy-category]").forEach((button) => {
    const category = button.dataset.anatomyCategory;

    if (!state.categoryVisibility.has(category)) {
      button.hidden = true;
      return;
    }

    button.addEventListener("click", () => {
      const next = !state.categoryVisibility.get(category);
      state.categoryVisibility.set(category, next);

      exam3d.setCategoryVisibility(category, next);

      STRUCTURES
        .filter((structure) => structure.category === category)
        .forEach((structure) => {
          radiology.setStructureVisibility(structure.label, next);
        });

      button.classList.toggle("active", next);
      button.setAttribute("aria-pressed", next ? "true" : "false");
    });
  });
}

function bindWindowPresets(radiology) {
  document.querySelectorAll("[data-window-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const width = Number(button.dataset.width);
      const level = Number(button.dataset.level);

      $("windowWidth").value = String(width);
      $("windowLevel").value = String(level);
      $("windowWidthValue").textContent = String(width);
      $("windowLevelValue").textContent = String(level);

      radiology.setWindow(width, level);

      document.querySelectorAll("[data-window-preset]").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
    });
  });
}

function bindControls(exam3d, radiology) {
  document.querySelectorAll("[data-plane]").forEach((button) => {
    button.addEventListener("click", () => {
      setPlane(button.dataset.plane, exam3d, radiology);
    });
  });

  $("sliceSlider")?.addEventListener("input", function () {
    radiology.setSlice(Number(this.value), true);
    state.frac = radiology.crosshairFrac.slice();
    exam3d.setCrosshairFraction(state.frac, true);
    syncSliceUi(exam3d, radiology);
  });

  $("slicePrev")?.addEventListener("click", () => {
    radiology.setSlice(radiology.currentSliceIndex() - 1, true);
    state.frac = radiology.crosshairFrac.slice();
    exam3d.setCrosshairFraction(state.frac, true);
    syncSliceUi(exam3d, radiology);
  });

  $("sliceNext")?.addEventListener("click", () => {
    radiology.setSlice(radiology.currentSliceIndex() + 1, true);
    state.frac = radiology.crosshairFrac.slice();
    exam3d.setCrosshairFraction(state.frac, true);
    syncSliceUi(exam3d, radiology);
  });

  $("windowWidth")?.addEventListener("input", function () {
    radiology.setWindow(
      Number(this.value),
      Number($("windowLevel").value)
    );
    $("windowWidthValue").textContent = this.value;
  });

  $("windowLevel")?.addEventListener("input", function () {
    radiology.setWindow(
      Number($("windowWidth").value),
      Number(this.value)
    );
    $("windowLevelValue").textContent = this.value;
  });

  $("radZoomIn")?.addEventListener("click", () => radiology.zoomBy(0.16));
  $("radZoomOut")?.addEventListener("click", () => radiology.zoomBy(-0.16));
  $("radReset")?.addEventListener("click", () => radiology.resetView());
  $("mprView")?.addEventListener("click", () => setPlane("axial", exam3d, radiology));

  $("resetAnatomy")?.addEventListener("click", () => exam3d.reset());
  $("focusAnatomy")?.addEventListener("click", () => exam3d.focusSelected());

  $("transparencyToggle")?.addEventListener("click", function () {
    const active = this.classList.toggle("active");
    this.setAttribute("aria-pressed", active ? "true" : "false");
    exam3d.setTransparent(active);
  });

  $("planeToggle")?.addEventListener("click", function () {
    const active = this.classList.toggle("active");
    this.setAttribute("aria-pressed", active ? "true" : "false");
    exam3d.setPlaneVisible(active);
  });

  $("clipToggle")?.addEventListener("click", function () {
    const active = this.classList.toggle("active");
    this.setAttribute("aria-pressed", active ? "true" : "false");
    exam3d.setClippingEnabled(active);
  });

  $("segmentationToggle")?.addEventListener("click", function () {
    const active = this.classList.toggle("active");
    this.setAttribute("aria-pressed", active ? "true" : "false");
    radiology.setSegmentationVisible(active);
  });

  bindCategoryControls(exam3d, radiology);
  bindWindowPresets(radiology);
}

async function boot() {
  let exam3d = null;
  let radiology = null;
  let syncing = false;

  exam3d = new AnatomyViewer($("anatomyCanvas"), {
    onSelect: (id) => {
      if (!radiology || !id || !structureAvailable(id)) return;
      selectStructure(id, exam3d, radiology, true);
    },
    onReady: (report) => {
      if (report?.failures?.length) {
        console.warn("Sistemas HRA com falha parcial:", report.failures);
      }
    }
  });

  radiology = new RadiologyMultiView(
    $("radiologyMultiView"),
    {
      axial: $("radiologyAxialCanvas"),
      coronal: $("radiologyCoronalCanvas"),
      sagittal: $("radiologySagittalCanvas")
    },
    {
      onLocationChange: (payload) => {
        if (!payload?.frac || syncing || !exam3d) return;

        syncing = true;
        state.frac = payload.frac.slice();
        state.plane = payload.plane || radiology.primaryPlane || state.plane;

        exam3d.setCrosshairFraction(state.frac);
        exam3d.setPlane(
          state.plane,
          state.frac[PLANE_CONFIG[state.plane].fracAxis]
        );

        if (payload.intensityText && $("voxelReadout")) {
          $("voxelReadout").textContent = payload.intensityText;
        }

        updatePlaneButtons();
        syncSliceUi(exam3d, radiology);
        syncing = false;
      },
      onPlaneChange: (plane) => {
        state.plane = plane;
        exam3d.setPlane(
          plane,
          state.frac[PLANE_CONFIG[plane].fracAxis]
        );
        updatePlaneButtons();
        syncSliceUi(exam3d, radiology);
      },
      onStructureAtLocation: (structure) => {
        if (!exam3d || !structureAvailable(structure.id)) return;
        selectStructure(structure.id, exam3d, radiology, false);
      },
      onReady: () => updateStudyUi(radiology),
      onZoomChange: (zoom) => {
        if ($("radZoomValue")) {
          $("radZoomValue").textContent = Math.round(zoom * 100) + "%";
        }
      }
    }
  );

  const results = await Promise.allSettled([
    exam3d.ready,
    radiology.ready
  ]);

  if (results[0].status === "rejected") {
    console.error(results[0].reason);
    showBootError(
      "Não foi possível carregar o atlas anatômico 3D. Recarregue a página."
    );
  }

  if (results[1].status === "rejected") {
    console.error(results[1].reason);
    showBootError(
      "Não foi possível carregar as vistas axial, coronal e sagital."
    );
  }

  state.availableIds = new Set(radiology.getAvailableStructureIds());

  createStructureList(exam3d, radiology);
  bindControls(exam3d, radiology);
  renderSources();
  updatePlaneButtons();
  updateStudyUi(radiology);

  state.frac = radiology.crosshairFrac.slice();
  state.plane = radiology.primaryPlane || "axial";
  exam3d.setCrosshairFraction(state.frac);
  exam3d.setPlane(
    state.plane,
    state.frac[PLANE_CONFIG[state.plane].fracAxis]
  );
  syncSliceUi(exam3d, radiology);
  updateStructureInfo(radiology);

  const preferred = STRUCTURES.find((structure) =>
    structure.id === "liver" && structureAvailable(structure.id)
  ) || STRUCTURES.find((structure) => structureAvailable(structure.id));

  if (preferred) {
    selectStructure(preferred.id, exam3d, radiology, true);
  }
}

loadUser().catch(console.error);

if ($("logoutSidebar")) {
  $("logoutSidebar").addEventListener("click", logout);
}

boot().catch((error) => {
  console.error("Falha ao iniciar Radiologia 3D co-registrada:", error);
  showBootError(
    "Não foi possível iniciar o laboratório de Radiologia 3D. Recarregue a página."
  );
});
