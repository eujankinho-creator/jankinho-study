import { AnatomyViewer } from "./radiologia/anatomy-viewer.js";
import { RadiologyViewer } from "./radiologia/radiology-viewer.js";
import {
  STRUCTURES,
  SOURCE_REGISTRY,
  RADIOLOGY_STUDY,
  PLANE_CONFIG,
  getStructure
} from "./radiologia/data.js";

const $ = function (id) {
  return document.getElementById(id);
};

const state = {
  selectedId: "aorta",
  plane: "axial",
  frac: [0.5, 0.5, 0.55],
  coverage: new Map(),
  structureVisibility: new Map(
    STRUCTURES.map(function (structure) {
      return [structure.id, true];
    })
  ),
  categoryVisibility: new Map([
    ["body", true],
    ["bones", true],
    ["vessels", true],
    ["organs", true]
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
  const status = $("liveStatus");
  if (status) status.textContent = message;
}

function showBootError(message) {
  const element = $("labBootError");
  if (!element) return;
  element.hidden = false;
  element.textContent = message;
}

function setTooltip(element, structure, event) {
  if (!element) return;

  if (!structure || !event) {
    element.hidden = true;
    return;
  }

  element.hidden = false;
  element.innerHTML =
    "<strong>" + structure.name + "</strong>" +
    "<span>" + structure.englishName + "</span>";

  const margin = 16;
  const width = element.offsetWidth || 150;
  const height = element.offsetHeight || 52;
  let left = event.clientX + 18;
  let top = event.clientY + 18;

  if (left + width + margin > window.innerWidth) {
    left = event.clientX - width - 18;
  }
  if (top + height + margin > window.innerHeight) {
    top = event.clientY - height - 18;
  }

  element.style.left = Math.max(margin, left) + "px";
  element.style.top = Math.max(margin, top) + "px";
}

function coverageCount(id) {
  return state.coverage.get(id) || 0;
}

function createStructureList(anatomy, radiology) {
  const container = $("structureList");
  if (!container) return;

  container.innerHTML = "";

  STRUCTURES.forEach(function (structure) {
    const row = document.createElement("div");
    row.className = "structure-row";
    row.dataset.structureId = structure.id;

    if (coverageCount(structure.id) === 0) {
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
      "</small></span>";

    select.disabled = coverageCount(structure.id) === 0;
    select.addEventListener("click", function () {
      selectStructure(structure.id, anatomy, radiology, true);
    });

    const visibility = document.createElement("button");
    visibility.type = "button";
    visibility.className = "structure-visibility is-visible";
    visibility.setAttribute("aria-label", "Ocultar " + structure.name);
    visibility.setAttribute("aria-pressed", "true");
    visibility.innerHTML = "<span></span>";
    visibility.disabled = coverageCount(structure.id) === 0;

    visibility.addEventListener("click", function () {
      const next = !state.structureVisibility.get(structure.id);
      state.structureVisibility.set(structure.id, next);
      anatomy.setStructureVisibility(structure.id, next);
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

function updateStructureListSelection() {
  document.querySelectorAll(".structure-row").forEach(function (row) {
    row.classList.toggle(
      "active",
      row.dataset.structureId === state.selectedId
    );
  });
}

function structureTargetFrac(structure, anatomy) {
  const fallback = structure.focusFrac || state.frac;
  const bounds = anatomy.fractionBoundsForStructure(structure.id);

  if (!bounds) return fallback.slice();

  const center = bounds.min.map(function (value, index) {
    return (value + bounds.max[index]) / 2;
  });

  /*
   * O atlas HRA e a TC são sujeitos/fontes diferentes.
   * Mantemos o eixo corporal real do HRA no 3D e usamos um ponto radiológico
   * didático curado para a TC quando disponível, sem fingir registro DICOM.
   */
  return [
    fallback[0] ?? center[0],
    fallback[1] ?? center[1],
    fallback[2] ?? center[2]
  ];
}

function selectStructure(id, anatomy, radiology, moveScan) {
  const structure = id ? getStructure(id) : null;

  if (id && (!structure || coverageCount(id) === 0)) {
    return;
  }

  state.selectedId = id || null;
  anatomy.selectStructure(state.selectedId);
  updateStructureListSelection();
  updateStructureInfo();
  updateSelectedStateBadge(anatomy);
  updateSlicePresence(anatomy, radiology);

  if (!structure) return;

  if (moveScan) {
    const target = structureTargetFrac(structure, anatomy);
    state.frac = target.slice();
    radiology.setCrosshairFraction(target, true);
    anatomy.setCrosshairFraction(target);
    syncSliceUi(anatomy, radiology);
  }

  anatomy.focusStructure(structure.id);
  announce(structure.name + " selecionado");
}

function updateStructureInfo() {
  const empty = $("structureInfoEmpty");
  const content = $("structureInfoContent");

  if (!state.selectedId) {
    if (empty) empty.hidden = false;
    if (content) content.hidden = true;
    return;
  }

  const structure = getStructure(state.selectedId);
  if (!structure) return;

  if (empty) empty.hidden = true;
  if (content) content.hidden = false;

  $("structureTitle").textContent = structure.name;
  $("structureEnglish").textContent = structure.englishName;
  if ($("selectedRadiologyName")) {
    $("selectedRadiologyName").textContent =
      structure.name + " · referência HRA → TC";
  }
  $("structureRegion").textContent = structure.region;
  $("structureDescription").textContent = structure.description;

  if ($("structureStudies")) {
    $("structureStudies").textContent = "HRA 3D · TC real";
  }

  if ($("structureMeshCount")) {
    $("structureMeshCount").textContent =
      coverageCount(structure.id) + " malhas HRA";
  }
}

function updateSelectedStateBadge(anatomy) {
  const badge = $("selectedPlaneState");
  if (!badge) return;

  if (!state.selectedId) {
    badge.textContent = "Selecione uma estrutura";
    badge.classList.remove("in-plane", "out-plane");
    return;
  }

  const structure = getStructure(state.selectedId);
  const bounds = anatomy.fractionBoundsForStructure(state.selectedId);

  if (!structure || !bounds) {
    badge.textContent = "Estrutura sem malha carregada";
    badge.classList.remove("in-plane");
    badge.classList.add("out-plane");
    return;
  }

  const axis = PLANE_CONFIG[state.plane].fracAxis;
  const fraction = state.frac[axis];
  const present =
    fraction >= bounds.min[axis] - 0.008 &&
    fraction <= bounds.max[axis] + 0.008;

  badge.textContent = present
    ? structure.name + " cruza o plano 3D atual"
    : structure.name + " fora do plano 3D atual";

  badge.classList.toggle("in-plane", present);
  badge.classList.toggle("out-plane", !present);
}

function updateSlicePresence(anatomy, radiology) {
  const container = $("sliceStructures");
  if (!container) return;

  const axis = PLANE_CONFIG[state.plane].fracAxis;
  const structures = anatomy.structuresAtFraction(
    state.plane,
    state.frac[axis]
  );

  if (!structures.length) {
    container.innerHTML =
      '<span class="slice-empty">Nenhuma estrutura-alvo do HRA cruza este nível 3D.</span>';
    return;
  }

  container.innerHTML = structures
    .map(function (structure) {
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
}

function bindSlicePresence(anatomy, radiology) {
  const container = $("sliceStructures");
  if (!container) return;

  container.addEventListener("click", function (event) {
    const button = event.target.closest("[data-id]");
    if (!button) return;
    selectStructure(button.dataset.id, anatomy, radiology, false);
  });
}

function updatePlaneButtons() {
  document.querySelectorAll("[data-plane]").forEach(function (button) {
    const active = button.dataset.plane === state.plane;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });

  if ($("currentPlaneLabel")) {
    $("currentPlaneLabel").textContent =
      PLANE_CONFIG[state.plane].label;
  }
}

function updateOrientationLabels() {
  const config = PLANE_CONFIG[state.plane];
  if ($("activePlaneReadout")) {
    $("activePlaneReadout").textContent =
      config.label + " ativo para o corte 3D";
  }
}

function updateStudyUi(radiology) {
  if ($("studyName")) $("studyName").textContent = RADIOLOGY_STUDY.name;
  if ($("studyModality")) $("studyModality").textContent = "TC";
  if ($("studySource")) $("studySource").textContent = RADIOLOGY_STUDY.source;
  if ($("studyLicense")) {
    $("studyLicense").textContent =
      "Proveniência pública documentada · Steve Pieper / Slicer3D";
  }

  if ($("studySlices")) {
    const dims = radiology.dims || [1, 1, 1];
    $("studySlices").textContent =
      dims[0] + "×" + dims[1] + "×" + dims[2] + " voxels";
  }

  if ($("ctDatasetLabel")) {
    $("ctDatasetLabel").textContent = "CT_Abdo · volume NIfTI real";
  }
}

function syncSliceUi(anatomy, radiology) {
  const slider = $("sliceSlider");
  if (!slider) return;

  const total = radiology.sliceCount(state.plane);
  const current = radiology.currentSliceIndex(state.plane);

  slider.max = String(Math.max(0, total - 1));
  slider.value = String(current);

  if ($("sliceCurrent")) $("sliceCurrent").textContent = String(current + 1);
  if ($("sliceTotal")) $("sliceTotal").textContent = String(total);

  const axis = PLANE_CONFIG[state.plane].fracAxis;
  const fraction = state.frac[axis];

  if ($("sliceCoordinate")) {
    $("sliceCoordinate").textContent =
      Math.round(fraction * 100) + "% do eixo";
  }

  anatomy.setPlane(state.plane, fraction);
  anatomy.setCrosshairFraction(state.frac);
  updateSlicePresence(anatomy, radiology);
  updateSelectedStateBadge(anatomy);
}

function setPlane(plane, anatomy, radiology) {
  if (!PLANE_CONFIG[plane]) return;

  state.plane = plane;
  radiology.setPlane(plane);
  anatomy.setPlane(
    plane,
    state.frac[PLANE_CONFIG[plane].fracAxis]
  );

  updatePlaneButtons();
  updateOrientationLabels();
  syncSliceUi(anatomy, radiology);
}

function renderSources() {
  const container = $("sourceRegistry");
  if (!container) return;

  container.innerHTML = SOURCE_REGISTRY.map(function (source) {
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
      '<div class="source-links">' +
      sourceLink + licenseLink +
      "</div>" +
      "</article>";
  }).join("");
}

function bindCategoryControls(anatomy) {
  document.querySelectorAll("[data-anatomy-category]").forEach(function (button) {
    button.addEventListener("click", function () {
      const category = button.dataset.anatomyCategory;
      const next = !state.categoryVisibility.get(category);
      state.categoryVisibility.set(category, next);
      anatomy.setCategoryVisibility(category, next);
      button.classList.toggle("active", next);
      button.setAttribute("aria-pressed", next ? "true" : "false");
    });
  });
}

function bindWindowPresets(radiology) {
  document.querySelectorAll("[data-window-preset]").forEach(function (button) {
    button.addEventListener("click", function () {
      const width = Number(button.dataset.width);
      const level = Number(button.dataset.level);

      $("windowWidth").value = String(width);
      $("windowLevel").value = String(level);
      $("windowWidthValue").textContent = String(width);
      $("windowLevelValue").textContent = String(level);

      radiology.setWindow(width, level);

      document.querySelectorAll("[data-window-preset]").forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
    });
  });
}

function bindControls(anatomy, radiology) {
  document.querySelectorAll("[data-plane]").forEach(function (button) {
    button.addEventListener("click", function () {
      setPlane(button.dataset.plane, anatomy, radiology);
    });
  });

  $("sliceSlider")?.addEventListener("input", function () {
    radiology.setSlice(Number(this.value), true);
    state.frac = radiology.crosshairFrac.slice();
    syncSliceUi(anatomy, radiology);
  });

  $("slicePrev")?.addEventListener("click", function () {
    radiology.setSlice(radiology.currentSliceIndex() - 1, true);
    state.frac = radiology.crosshairFrac.slice();
    syncSliceUi(anatomy, radiology);
  });

  $("sliceNext")?.addEventListener("click", function () {
    radiology.setSlice(radiology.currentSliceIndex() + 1, true);
    state.frac = radiology.crosshairFrac.slice();
    syncSliceUi(anatomy, radiology);
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

  $("radZoomIn")?.addEventListener("click", function () {
    radiology.zoomBy(0.16);
  });

  $("radZoomOut")?.addEventListener("click", function () {
    radiology.zoomBy(-0.16);
  });

  $("radReset")?.addEventListener("click", function () {
    radiology.resetView();
  });

  $("mprView")?.addEventListener("click", function () {
    radiology.setMultiplanar();
  });

  $("resetAnatomy")?.addEventListener("click", function () {
    anatomy.reset();
  });

  $("focusAnatomy")?.addEventListener("click", function () {
    if (state.selectedId) anatomy.focusStructure(state.selectedId);
  });

  $("transparencyToggle")?.addEventListener("click", function () {
    const active = this.classList.toggle("active");
    this.setAttribute("aria-pressed", active ? "true" : "false");
    anatomy.setTransparent(active);
  });

  $("planeToggle")?.addEventListener("click", function () {
    const active = this.classList.toggle("active");
    this.setAttribute("aria-pressed", active ? "true" : "false");
    anatomy.setPlaneVisible(active);
  });

  $("clipToggle")?.addEventListener("click", function () {
    const active = this.classList.toggle("active");
    this.setAttribute("aria-pressed", active ? "true" : "false");
    anatomy.setClippingEnabled(active);
  });

  bindCategoryControls(anatomy);
  bindWindowPresets(radiology);
}

async function boot() {
  const anatomyTooltip = $("anatomyTooltip");

  let radiology = null;

  const anatomy = new AnatomyViewer($("anatomyCanvas"), {
    onHover: function (structure, event) {
      setTooltip(anatomyTooltip, structure, event);
    },
    onSelect: function (id) {
      if (radiology) {
        selectStructure(id, anatomy, radiology, true);
      }
    },
    onReady: function (report) {
      report.structures.forEach(function (item) {
        state.coverage.set(item.id, item.meshCount);
      });

      if (report.failures.length) {
        showBootError(
          "Alguns sistemas anatômicos reais não carregaram: " +
          report.failures.map(function (item) {
            return item.system;
          }).join(", ")
        );
      }
    }
  });

  radiology = new RadiologyViewer($("radiologyCanvas"), {
    onLocationChange: function (payload) {
      if (!payload || !payload.frac) return;

      state.frac = payload.frac.slice();
      anatomy.setCrosshairFraction(state.frac);
      anatomy.setPlane(
        state.plane,
        state.frac[PLANE_CONFIG[state.plane].fracAxis]
      );
      syncSliceUi(anatomy, radiology);

      if (payload.intensityText && $("voxelReadout")) {
        $("voxelReadout").textContent = payload.intensityText;
      }
    },
    onReady: function () {
      updateStudyUi(radiology);
    },
    onZoomChange: function (zoom) {
      if ($("radZoomValue")) {
        $("radZoomValue").textContent =
          Math.round(zoom * 100) + "%";
      }
    }
  });

  const results = await Promise.allSettled([
    anatomy.ready,
    radiology.ready
  ]);

  if (results[0].status === "rejected") {
    console.error(results[0].reason);
    showBootError(
      "Não foi possível carregar as malhas anatômicas HRA. Recarregue a página."
    );
  }

  if (results[1].status === "rejected") {
    console.error(results[1].reason);
    showBootError(
      "Não foi possível carregar o volume TC real. Recarregue a página."
    );
  }

  createStructureList(anatomy, radiology);
  bindSlicePresence(anatomy, radiology);
  bindControls(anatomy, radiology);
  renderSources();

  updatePlaneButtons();
  updateOrientationLabels();
  updateStudyUi(radiology);

  state.frac = radiology.crosshairFrac.slice();
  syncSliceUi(anatomy, radiology);
  updateStructureInfo();

  const firstAvailable =
    STRUCTURES.find(function (structure) {
      return coverageCount(structure.id) > 0 && structure.id === "aorta";
    }) ||
    STRUCTURES.find(function (structure) {
      return coverageCount(structure.id) > 0;
    });

  if (firstAvailable) {
    selectStructure(
      firstAvailable.id,
      anatomy,
      radiology,
      true
    );
  }

  window.addEventListener("beforeunload", function () {
    anatomy.dispose();
  });
}

loadUser().catch(function (error) {
  console.error(error);
});

if ($("logoutSidebar")) {
  $("logoutSidebar").addEventListener("click", logout);
}

boot().catch(function (error) {
  console.error("Falha ao iniciar Radiologia 3D real:", error);
  showBootError(
    "Não foi possível iniciar o laboratório de Radiologia 3D. Verifique os assets reais e recarregue a página."
  );
});
