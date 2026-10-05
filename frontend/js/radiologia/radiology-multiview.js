import * as niivue from "/vendor/niivue/index.js";
import { RadiologyViewer } from "./radiology-viewer.js?v=20261005-atlas3";
import {
  RADIOLOGY_STUDY,
  PLANE_CONFIG,
  getStructureByLabel,
  clamp
} from "./data.js?v=20261005-atlas3";

const PLANES = ["axial", "coronal", "sagittal"];

export class RadiologyMultiView {
  constructor(root, canvases, options) {
    this.root = root;
    this.canvases = canvases || {};
    this.options = options || {};
    this.primaryPlane = "axial";
    this.plane = "axial";
    this.crosshairFrac = [0.5, 0.5, 0.5];
    this.syncing = false;
    this.initializing = true;
    this.viewers = {};
    this.tiles = new Map();
    this.segmentationFailures = [];

    PLANES.forEach((plane) => {
      if (!this.canvases[plane]) {
        throw new Error("Canvas ausente para o plano " + plane);
      }
    });

    this.bindTiles();
    this.applyTileLayout();
    this.ready = this.init();
  }

  createViewer(plane, baseVolume) {
    const viewer = new RadiologyViewer(this.canvases[plane], {
      plane,
      baseVolume,
      singlePlane: true,
      qualityRole: plane === "axial" ? "primary" : "secondary",
      onLocationChange: (payload) => this.handleViewerLocation(plane, payload),
      onStructureAtLocation: (structure, payload) => {
        if (typeof this.options.onStructureAtLocation === "function") {
          this.options.onStructureAtLocation(structure, { ...payload, plane });
        }
      },
      onZoomChange: (zoom) => {
        if (
          plane === this.primaryPlane &&
          typeof this.options.onZoomChange === "function"
        ) {
          this.options.onZoomChange(zoom);
        }
      }
    });

    this.viewers[plane] = viewer;
    return viewer;
  }

  async loadBaseVolume() {
    return niivue.NVImage.loadFromUrl({
      url: RADIOLOGY_STUDY.file,
      name: "ct.nii.gz",
      colormap: "gray",
      opacity: 1
    });
  }

  async loadSegmentations() {
    const results = await Promise.allSettled(
      RADIOLOGY_STUDY.segmentations.map(async (seg) => {
        const volume = await niivue.NVImage.loadFromUrl({
          url: seg.url,
          name: seg.id + "_label.nii.gz",
          opacity: seg.opacity
        });
        return { id: seg.id, volume };
      })
    );

    const loaded = [];
    this.segmentationFailures = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        loaded.push(result.value);
      } else {
        this.segmentationFailures.push({
          id: RADIOLOGY_STUDY.segmentations[index]?.id || "unknown",
          error: result.reason
        });
      }
    });

    return loaded;
  }

  async init() {
    // 1) Baixa/descompacta o CT uma única vez.
    const baseVolume = await this.loadBaseVolume();

    // 2) Axial aparece primeiro, sem esperar qualquer máscara.
    const axial = this.createViewer("axial", baseVolume);
    await axial.ready;
    this.crosshairFrac = axial.crosshairFrac.slice();

    if (typeof this.options.onFirstImageReady === "function") {
      this.options.onFirstImageReady({
        plane: "axial",
        study: axial.study,
        dims: axial.dims.slice()
      });
    }

    // 3) Reutiliza o mesmo NVImage para as vistas secundárias.
    const coronal = this.createViewer("coronal", baseVolume);
    const sagittal = this.createViewer("sagittal", baseVolume);
    await Promise.all([coronal.ready, sagittal.ready]);

    this.broadcastCrosshair(this.crosshairFrac, null);
    this.applyQualityRoles();

    if (typeof this.options.onBaseViewsReady === "function") {
      this.options.onBaseViewsReady({
        study: axial.study,
        dims: axial.dims.slice()
      });
    }

    // 4) Só depois baixa as máscaras. Falha de overlay não bloqueia o CT.
    const segmentationVolumes = await this.loadSegmentations();

    if (segmentationVolumes.length) {
      PLANES.forEach((plane) => {
        this.viewers[plane]?.addSharedSegmentations(
          segmentationVolumes,
          plane === "axial"
        );
      });
    }

    this.initializing = false;

    if (typeof this.options.onReady === "function") {
      this.options.onReady({
        study: axial.study,
        dims: axial.dims.slice(),
        availableLabels: Array.from(axial.labelCentroids.keys()),
        segmentationFailures: this.segmentationFailures.slice()
      });
    }

    this.emitLocation(null);
    return this;
  }

  bindTiles() {
    if (!this.root) return;

    this.root.querySelectorAll("[data-rad-view-plane]").forEach((tile) => {
      const plane = tile.dataset.radViewPlane;
      if (!PLANE_CONFIG[plane]) return;
      this.tiles.set(plane, tile);

      tile.addEventListener("click", (event) => {
        if (plane === this.primaryPlane) return;
        event.preventDefault();
        event.stopPropagation();
        this.setPrimaryPlane(plane);
      });

      tile.addEventListener("keydown", (event) => {
        if (
          plane !== this.primaryPlane &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          this.setPrimaryPlane(plane);
        }
      });
    });
  }

  applyTileLayout() {
    PLANES.forEach((plane) => {
      const tile = this.tiles.get(plane);
      if (!tile) return;

      const axial = plane === "axial";
      const active = plane === this.primaryPlane;

      tile.classList.toggle("is-primary", axial);
      tile.classList.toggle("is-secondary", !axial);
      tile.classList.toggle("secondary-top", plane === "coronal");
      tile.classList.toggle("secondary-bottom", plane === "sagittal");
      tile.classList.toggle("is-active-plane", active);
      tile.setAttribute("aria-current", active ? "true" : "false");
      tile.setAttribute("tabindex", axial ? "-1" : "0");

      const expand = tile.querySelector("[data-expand-label]");
      if (expand) {
        expand.textContent = axial
          ? (active ? "principal · ativo" : "principal")
          : (active ? "eixo ativo" : "clique para ativar");
      }
    });

    if (this.root) this.root.dataset.primaryPlane = this.primaryPlane;

    requestAnimationFrame(() => {
      this.applyQualityRoles();
      PLANES.forEach((plane) => {
        const viewer = this.viewers[plane];
        viewer?.syncCanvasResolution();
        viewer?.nv?.drawScene();
      });
    });
  }

  applyQualityRoles() {
    PLANES.forEach((plane) => {
      this.viewers[plane]?.setQualityRole(plane === "axial" ? "primary" : "secondary");
    });
  }

  getQualityReport() {
    return PLANES.reduce((report, plane) => {
      report[plane] = this.viewers[plane]?.getRenderQuality() || null;
      return report;
    }, {});
  }

  setPrimaryPlane(plane, silent) {
    if (!PLANE_CONFIG[plane] || !this.viewers[plane]) return;

    this.primaryPlane = plane;
    this.plane = plane;
    this.applyTileLayout();

    this.activeViewer()?.nv?.drawScene();

    if (!silent && typeof this.options.onPlaneChange === "function") {
      this.options.onPlaneChange(plane);
    }

    if (!silent) this.emitLocation(null);
  }

  setPlane(plane, silent) {
    this.setPrimaryPlane(plane, silent);
  }

  activeViewer() {
    return this.viewers[this.primaryPlane] || this.viewers.axial || null;
  }

  handleViewerLocation(plane, payload) {
    if (this.initializing || this.syncing || !payload?.frac) return;

    this.syncing = true;
    this.crosshairFrac = payload.frac.slice();
    this.broadcastCrosshair(this.crosshairFrac, plane);

    if (plane !== this.primaryPlane) {
      this.primaryPlane = plane;
      this.plane = plane;
      this.applyTileLayout();

      if (typeof this.options.onPlaneChange === "function") {
        this.options.onPlaneChange(plane);
      }
    }

    if (typeof this.options.onLocationChange === "function") {
      this.options.onLocationChange({
        ...payload,
        plane: this.primaryPlane,
        index: this.currentSliceIndex(),
        total: this.sliceCount()
      });
    }

    this.syncing = false;
  }

  broadcastCrosshair(frac, sourcePlane) {
    PLANES.forEach((plane) => {
      if (plane === sourcePlane) return;
      this.viewers[plane]?.setCrosshairFraction(frac, true);
    });
  }

  setCrosshairFraction(frac, silent) {
    if (!Array.isArray(frac) || frac.length < 3) return;

    this.crosshairFrac = [
      clamp(Number(frac[0]) || 0, 0, 1),
      clamp(Number(frac[1]) || 0, 0, 1),
      clamp(Number(frac[2]) || 0, 0, 1)
    ];

    PLANES.forEach((plane) => {
      this.viewers[plane]?.setCrosshairFraction(this.crosshairFrac, true);
    });

    if (!silent) this.emitLocation(null);
  }

  emitLocation(data) {
    if (typeof this.options.onLocationChange !== "function") return;

    const active = this.activeViewer();
    this.options.onLocationChange({
      data,
      frac: this.crosshairFrac.slice(),
      plane: this.primaryPlane,
      index: this.currentSliceIndex(),
      total: this.sliceCount(),
      intensityText: "",
      label: active?.selectedLabel || 0,
      structure: getStructureByLabel(active?.selectedLabel || 0)
    });
  }

  focusLabel(label, silent) {
    const reference = this.viewers.axial;
    if (!reference) return false;

    const numeric = Math.max(0, Math.round(Number(label) || 0));
    const frac = reference.labelCentroids.get(numeric);
    if (!frac) return false;

    this.setCrosshairFraction(frac, true);
    if (!silent) this.emitLocation(null);
    return true;
  }

  selectLabel(label) {
    PLANES.forEach((plane) => this.viewers[plane]?.selectLabel(label));
  }

  setStructureVisibility(label, visible) {
    PLANES.forEach((plane) => {
      this.viewers[plane]?.setStructureVisibility(label, visible);
    });
  }

  setSegmentationVisible(visible) {
    PLANES.forEach((plane) => {
      this.viewers[plane]?.setSegmentationVisible(visible);
    });
  }

  setSlice(index, silent) {
    const active = this.activeViewer();
    if (!active) return;

    active.setSlice(index, true);
    this.crosshairFrac = active.crosshairFrac.slice();
    this.broadcastCrosshair(this.crosshairFrac, this.primaryPlane);

    if (!silent) this.emitLocation(null);
  }

  sliceCount(plane) {
    const target = PLANE_CONFIG[plane] ? plane : this.primaryPlane;
    return this.viewers[target]?.sliceCount(target) || 1;
  }

  currentSliceIndex(plane) {
    const target = PLANE_CONFIG[plane] ? plane : this.primaryPlane;
    return this.viewers[target]?.currentSliceIndex(target) || 0;
  }

  setWindow(width, level) {
    PLANES.forEach((plane) => this.viewers[plane]?.setWindow(width, level));
  }

  zoomBy(delta) {
    this.activeViewer()?.zoomBy(delta);
  }

  resetView() {
    this.activeViewer()?.resetView();
    this.activeViewer()?.syncCanvasResolution();
  }

  setMultiplanar() {
    this.setPrimaryPlane("axial");
  }

  labelIntersectsPlane(label, plane, fraction) {
    return this.viewers.axial?.labelIntersectsPlane(label, plane, fraction) || false;
  }

  structuresAtPlane(plane, fraction) {
    return this.viewers.axial?.structuresAtPlane(plane, fraction) || [];
  }

  getAvailableStructureIds() {
    return this.viewers.axial?.getAvailableStructureIds() || [];
  }

  get dims() {
    return this.viewers.axial?.dims || [1, 1, 1];
  }

  get labelBounds() {
    return this.viewers.axial?.labelBounds || new Map();
  }

  get selectedLabel() {
    return this.activeViewer()?.selectedLabel || 0;
  }

  getState() {
    return {
      primaryPlane: this.primaryPlane,
      frac: this.crosshairFrac.slice(),
      dims: this.dims.slice(),
      sliceIndex: this.currentSliceIndex(),
      slices: this.sliceCount()
    };
  }
}
