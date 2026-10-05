import { AnatomyViewer } from "./radiologia/anatomy-viewer.js";
import { RadiologyViewer } from "./radiologia/radiology-viewer.js";
import {
  STRUCTURES,
  STUDIES,
  SOURCE_REGISTRY,
  PLANE_CONFIG,
  getStructure,
  sliceForCoordinate,
  structurePlaneCoordinate,
  normalRadius
} from "./radiologia/data.js";

const $ = function (id) {
  return document.getElementById(id);
};

const state = {
  selectedId: null,
  plane: "axial",
  studyId: "abdomen_ct_atlas_001",
  structureVisibility: new Map(
    STRUCTURES.map(function (structure) {
      return [structure.id, true];
    })
  )
};

const MPR_PLANES = ["axial", "coronal", "sagittal"];
let mprPreviews = [];

function syncMprPreviews(radiology) {
  const mainLabel = $("mprMainPlaneLabel");
  if (mainLabel) {
    mainLabel.textContent = PLANE_CONFIG[state.plane].label;
  }

  if (!mprPreviews.length) return;

  const secondaryPlanes = MPR_PLANES.filter(function (plane) {
    return plane !== state.plane;
  });

  mprPreviews.forEach(function (preview, index) {
    const plane = secondaryPlanes[index] || "coronal";
    const label = PLANE_CONFIG[plane].label;

    preview.button.dataset.previewPlane = plane;
    preview.button.setAttribute("aria-label", "Ampliar vista " + label);
    preview.label.textContent = label;

    if (preview.viewer.study.id !== radiology.study.id) {
      preview.viewer.setStudy(radiology.study.id);
    }

    if (preview.viewer.plane !== plane) {
      preview.viewer.setPlane(plane);
    }

    preview.viewer.setSelected(state.selectedId);

    if (state.selectedId) {
      const structure = getStructure(state.selectedId);
      if (structure) {
        const coordinate = structurePlaneCoordinate(structure, plane);
        preview.viewer.setSlice(
          sliceForCoordinate(plane, coordinate, preview.viewer.study.slices),
          true
        );
      }
    } else {
      preview.viewer.setSlice(
        Math.round((preview.viewer.study.slices - 1) / 2),
        true
      );
    }
  });
}

function bindMprPreviews(anatomy, radiology) {
  mprPreviews.forEach(function (preview) {
    preview.button.addEventListener("click", function () {
      const plane = this.dataset.previewPlane;
      if (!plane || plane === state.plane) return;
      setPlane(plane, anatomy, radiology);
      announce(PLANE_CONFIG[plane].label + " ampliado na vista principal");
    });
  });
}

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
  } finally {
    location.href = "/login.html";
  }
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

function createStructureList(anatomy, radiology) {
  const container = $("structureList");
  if (!container) return;

  container.innerHTML = "";

  STRUCTURES.forEach(function (structure) {
    const row = document.createElement("div");
    row.className = "structure-row";
    row.dataset.structureId = structure.id;

    const select = document.createElement("button");
    select.type = "button";
    select.className = "structure-select";
    select.innerHTML =
      '<span class="structure-swatch" style="--structure-color:#' +
      structure.color.toString(16).padStart(6, "0") +
      '"></span>' +
      '<span class="structure-name"><strong>' + structure.name +
      '</strong><small>' + structure.englishName + "</small></span>";

    select.addEventListener("click", function () {
      selectStructure(structure.id, anatomy, radiology, true);
    });

    const visibility = document.createElement("button");
    visibility.type = "button";
    visibility.className = "structure-visibility is-visible";
    visibility.setAttribute("aria-label", "Ocultar " + structure.name);
    visibility.setAttribute("aria-pressed", "true");
    visibility.innerHTML = "<span></span>";

    visibility.addEventListener("click", function () {
      const next = !state.structureVisibility.get(structure.id);
      state.structureVisibility.set(structure.id, next);
      anatomy.setVisibility(structure.id, next);
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
}

function updateStructureListSelection() {
  document.querySelectorAll(".structure-row").forEach(function (row) {
    row.classList.toggle(
      "active",
      row.dataset.structureId === state.selectedId
    );
  });
}

function selectStructure(id, anatomy, radiology, recenter) {
  state.selectedId = id || null;
  anatomy.selectStructure(state.selectedId);
  radiology.setSelected(state.selectedId);
  updateStructureListSelection();
  updateStructureInfo();
  updateSelectedStateBadge(radiology);
  syncMprPreviews(radiology);

  if (!state.selectedId) return;

  const structure = getStructure(state.selectedId);
  if (!structure) return;

  if (recenter) {
    const coordinate = structurePlaneCoordinate(structure, state.plane);
    const slice = sliceForCoordinate(
      state.plane,
      coordinate,
      radiology.study.slices
    );

    radiology.setSlice(slice, true);
    syncSliceUi(anatomy, radiology);
  }

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
  $("structureRegion").textContent = structure.region;
  $("structureDescription").textContent = structure.description;

  const studyNames = structure.studies
    .map(function (id) {
      const study = STUDIES.find(function (item) {
        return item.id === id;
      });
      return study ? study.modality : "";
    })
    .filter(Boolean);

  $("structureStudies").textContent =
    Array.from(new Set(studyNames)).join(" · ") || "Sem estudo associado";
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
  const coordinate = radiology.coordinate();
  const center = structurePlaneCoordinate(structure, state.plane);
  const radius = normalRadius(structure, state.plane);
  const visible = Math.abs(coordinate - center) <= radius * 1.08;

  badge.textContent = visible
    ? structure.name + " presente neste corte"
    : structure.name + " fora deste corte";

  badge.classList.toggle("in-plane", visible);
  badge.classList.toggle("out-plane", !visible);
}

function updateSlicePresence(radiology) {
  const container = $("sliceStructures");
  if (!container) return;

  const structures = radiology.structuresOnSlice();

  if (!structures.length) {
    container.innerHTML =
      '<span class="slice-empty">Nenhuma estrutura-alvo cruza este plano.</span>';
    return;
  }

  container.innerHTML = structures
    .map(function (structure) {
      const selected = structure.id === state.selectedId ? " active" : "";
      return '<button type="button" class="slice-structure-chip' + selected +
        '" data-id="' + structure.id + '">' +
        structure.name + "</button>";
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

function updateOrientationLabels() {
  const config = PLANE_CONFIG[state.plane];
  $("orientTop").textContent = config.top;
  $("orientBottom").textContent = config.bottom;
  $("orientLeft").textContent = config.left;
  $("orientRight").textContent = config.right;
}

function updatePlaneButtons() {
  document.querySelectorAll("[data-plane]").forEach(function (button) {
    const active = button.dataset.plane === state.plane;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });

  $("currentPlaneLabel").textContent = PLANE_CONFIG[state.plane].label;
}

function updateStudyUi(radiology) {
  document.querySelectorAll("[data-modality]").forEach(function (button) {
    const active = button.dataset.modality === radiology.study.modality;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });

  $("studyName").textContent = radiology.study.name;
  $("studyModality").textContent = radiology.study.modality;
  $("studySlices").textContent = radiology.study.slices + " cortes";
  $("studySource").textContent = radiology.study.source;
  $("studyLicense").textContent = radiology.study.license;
  $("windowControls").classList.toggle(
    "is-mri",
    radiology.study.modality === "MRI"
  );
  $("windowLabel").textContent =
    radiology.study.modality === "CT" ? "Janela" : "Contraste";
  $("levelLabel").textContent =
    radiology.study.modality === "CT" ? "Nível" : "Brilho";
}

function syncSliceUi(anatomy, radiology) {
  const slider = $("sliceSlider");
  slider.max = String(radiology.study.slices - 1);
  slider.value = String(radiology.sliceIndex);

  $("sliceCurrent").textContent = String(radiology.sliceIndex + 1);
  $("sliceTotal").textContent = String(radiology.study.slices);

  const coordinate = radiology.coordinate();
  anatomy.setPlane(state.plane, coordinate);
  $("sliceCoordinate").textContent =
    coordinate.toFixed(2) + " u anat.";

  updateSlicePresence(radiology);
  updateSelectedStateBadge(radiology);
  syncMprPreviews(radiology);
}

function setPlane(plane, anatomy, radiology) {
  state.plane = plane;
  radiology.setPlane(plane);

  if (state.selectedId) {
    const structure = getStructure(state.selectedId);
    const coordinate = structurePlaneCoordinate(structure, plane);
    const slice = sliceForCoordinate(
      plane,
      coordinate,
      radiology.study.slices
    );
    radiology.setSlice(slice, true);
  } else {
    radiology.setSlice(
      Math.round((radiology.study.slices - 1) / 2),
      true
    );
  }

  updatePlaneButtons();
  updateOrientationLabels();
  syncSliceUi(anatomy, radiology);
}

function renderSources() {
  const container = $("sourceRegistry");
  if (!container) return;

  container.innerHTML = SOURCE_REGISTRY.map(function (source) {
    const sourceLink = source.sourceUrl
      ? '<a href="' + source.sourceUrl + '" target="_blank" rel="noopener">Fonte</a>'
      : "";
    const licenseLink = source.licenseUrl
      ? '<a href="' + source.licenseUrl + '" target="_blank" rel="noopener">Licença</a>'
      : "";

    return '<article class="source-item">' +
      '<div><strong>' + source.label + '</strong><span>' +
      source.role + '</span></div>' +
      '<p>' + source.license + '</p>' +
      '<div class="source-links">' + sourceLink + licenseLink + "</div>" +
      "</article>";
  }).join("");
}

function announce(message) {
  const status = $("liveStatus");
  if (!status) return;
  status.textContent = message;
}

function bindControls(anatomy, radiology) {
  document.querySelectorAll("[data-plane]").forEach(function (button) {
    button.addEventListener("click", function () {
      setPlane(button.dataset.plane, anatomy, radiology);
    });
  });

  document.querySelectorAll("[data-modality]").forEach(function (button) {
    button.addEventListener("click", function () {
      const modality = button.dataset.modality;
      const study = STUDIES.find(function (item) {
        return item.modality === modality;
      });

      if (!study) return;
      state.studyId = study.id;
      radiology.setStudy(study.id);

      if (state.selectedId) {
        const structure = getStructure(state.selectedId);
        const coordinate = structurePlaneCoordinate(structure, state.plane);
        radiology.setSlice(
          sliceForCoordinate(
            state.plane,
            coordinate,
            radiology.study.slices
          ),
          true
        );
      }

      updateStudyUi(radiology);
      syncSliceUi(anatomy, radiology);
      announce(study.name + " carregado");
    });
  });

  $("sliceSlider").addEventListener("input", function () {
    radiology.setSlice(Number(this.value), true);
    syncSliceUi(anatomy, radiology);
  });

  $("slicePrev").addEventListener("click", function () {
    radiology.setSlice(radiology.sliceIndex - 1, true);
    syncSliceUi(anatomy, radiology);
  });

  $("sliceNext").addEventListener("click", function () {
    radiology.setSlice(radiology.sliceIndex + 1, true);
    syncSliceUi(anatomy, radiology);
  });

  $("windowWidth").addEventListener("input", function () {
    radiology.setWindow(
      Number(this.value),
      Number($("windowLevel").value)
    );
    $("windowWidthValue").textContent = this.value;
  });

  $("windowLevel").addEventListener("input", function () {
    radiology.setWindow(
      Number($("windowWidth").value),
      Number(this.value)
    );
    $("windowLevelValue").textContent = this.value;
  });

  $("radZoomIn").addEventListener("click", function () {
    radiology.zoomBy(0.2);
    $("radZoomValue").textContent =
      Math.round(radiology.zoom * 100) + "%";
  });

  $("radZoomOut").addEventListener("click", function () {
    radiology.zoomBy(-0.2);
    $("radZoomValue").textContent =
      Math.round(radiology.zoom * 100) + "%";
  });

  $("radReset").addEventListener("click", function () {
    radiology.resetView();
    $("radZoomValue").textContent =
      Math.round(radiology.zoom * 100) + "%";
  });

  $("resetAnatomy").addEventListener("click", function () {
    anatomy.reset();
  });

  $("focusAnatomy").addEventListener("click", function () {
    if (state.selectedId) anatomy.focusStructure(state.selectedId);
  });

  $("transparencyToggle").addEventListener("click", function () {
    const active = this.classList.toggle("active");
    this.setAttribute("aria-pressed", active ? "true" : "false");
    anatomy.setTransparent(active);
  });

  $("planeToggle").addEventListener("click", function () {
    const active = this.classList.toggle("active");
    this.setAttribute("aria-pressed", active ? "true" : "false");
    anatomy.setPlaneVisible(active);
  });
}

function boot() {
  const anatomyTooltip = $("anatomyTooltip");
  const radiologyTooltip = $("radiologyTooltip");

  const anatomy = new AnatomyViewer($("anatomyCanvas"), {
    onHover: function (structure, event) {
      setTooltip(anatomyTooltip, structure, event);
    },
    onSelect: function (id) {
      selectStructure(id, anatomy, radiology, true);
    }
  });

  const radiology = new RadiologyViewer($("radiologyCanvas"), {
    fitScale: 0.33,
    initialZoom: 0.86,
    minZoom: 0.62,
    maxZoom: 3.4,
    pixelRatioCap: 1.5,
    onSliceChange: function () {
      syncSliceUi(anatomy, radiology);
    },
    onStructurePick: function (id) {
      selectStructure(id, anatomy, radiology, false);
      anatomy.focusStructure(id);
    },
    onHover: function (id, event) {
      setTooltip(
        radiologyTooltip,
        id ? getStructure(id) : null,
        id ? event : null
      );
    },
    onZoomChange: function (zoom) {
      $("radZoomValue").textContent =
        Math.round(zoom * 100) + "%";
    }
  });

  mprPreviews = [
    {
      button: document.querySelector('[data-mpr-preview="0"]'),
      label: $("mprPreviewLabelA"),
      viewer: new RadiologyViewer($("radiologyPreviewA"), {
        interactive: false,
        compact: true,
        fitScale: 0.36,
        initialZoom: 0.82,
        pixelRatioCap: 1.1
      })
    },
    {
      button: document.querySelector('[data-mpr-preview="1"]'),
      label: $("mprPreviewLabelB"),
      viewer: new RadiologyViewer($("radiologyPreviewB"), {
        interactive: false,
        compact: true,
        fitScale: 0.36,
        initialZoom: 0.82,
        pixelRatioCap: 1.1
      })
    }
  ].filter(function (preview) {
    return preview.button && preview.label && preview.viewer;
  });

  bindMprPreviews(anatomy, radiology);

  createStructureList(anatomy, radiology);
  bindSlicePresence(anatomy, radiology);
  bindControls(anatomy, radiology);
  renderSources();
  updatePlaneButtons();
  updateOrientationLabels();
  updateStudyUi(radiology);
  $("radZoomValue").textContent = Math.round(radiology.zoom * 100) + "%";
  syncSliceUi(anatomy, radiology);
  updateStructureInfo();

  selectStructure("liver", anatomy, radiology, true);
  anatomy.focusStructure("liver");

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

try {
  boot();
} catch (error) {
  console.error("Falha ao iniciar Radiologia 3D:", error);
  const fallback = $("labBootError");
  if (fallback) {
    fallback.hidden = false;
    fallback.textContent =
      "Não foi possível iniciar o motor 3D. Recarregue a página ou verifique a conexão com os módulos gráficos.";
  }
}
