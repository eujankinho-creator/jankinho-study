import { RadiologyViewer } from "./radiology-viewer.js";
import { PLANE_CONFIG, getStructureByLabel, clamp } from "./data.js";

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
    this.viewers = {};
    this.tiles = new Map();

    PLANES.forEach((plane) => {
      const canvas = this.canvases[plane];
      if (!canvas) {
        throw new Error("Canvas ausente para o plano " + plane);
      }

      this.viewers[plane] = new RadiologyViewer(canvas, {
        plane,
        singlePlane: true,
        onLocationChange: (payload) => {
          this.handleViewerLocation(plane, payload);
        },
        onStructureAtLocation: (structure, payload) => {
          if (typeof this.options.onStructureAtLocation === "function") {
            this.options.onStructureAtLocation(structure, {
              ...payload,
              plane
            });
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
    });

    this.bindTiles();
    this.applyTileLayout();
    this.ready = this.init();
  }

  async init() {
    await Promise.all(
      PLANES.map((plane) => this.viewers[plane].ready)
    );

    const source = this.viewers.axial;
    this.crosshairFrac = source.crosshairFrac.slice();

    this.broadcastCrosshair(this.crosshairFrac, null);

    if (typeof this.options.onReady === "function") {
      this.options.onReady({
        study: source.study,
        dims: source.dims.slice(),
        availableLabels: Array.from(source.labelCentroids.keys())
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
    const secondary = PLANES.filter((plane) => plane !== this.primaryPlane);

    PLANES.forEach((plane) => {
      const tile = this.tiles.get(plane);
      if (!tile) return;

      const primary = plane === this.primaryPlane;
      tile.classList.toggle("is-primary", primary);
      tile.classList.toggle("is-secondary", !primary);
      tile.classList.toggle("secondary-top", plane === secondary[0]);
      tile.classList.toggle("secondary-bottom", plane === secondary[1]);
      tile.setAttribute("aria-current", primary ? "true" : "false");
      tile.setAttribute("tabindex", primary ? "-1" : "0");

      const expand = tile.querySelector("[data-expand-label]");
      if (expand) {
        expand.textContent = primary ? "ampliado" : "clique para ampliar";
      }
    });

    if (this.root) {
      this.root.dataset.primaryPlane = this.primaryPlane;
    }
  }

  setPrimaryPlane(plane, silent) {
    if (!PLANE_CONFIG[plane]) return;

    this.primaryPlane = plane;
    this.plane = plane;
    this.applyTileLayout();

    const active = this.activeViewer();
    active?.nv?.drawScene();

    if (!silent && typeof this.options.onPlaneChange === "function") {
      this.options.onPlaneChange(plane);
    }

    if (!silent) {
      this.emitLocation(null);
    }
  }

  setPlane(plane, silent) {
    this.setPrimaryPlane(plane, silent);
  }

  activeViewer() {
    return this.viewers[this.primaryPlane] || this.viewers.axial;
  }

  handleViewerLocation(plane, payload) {
    if (this.syncing || !payload?.frac) return;

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
      this.viewers[plane].setCrosshairFraction(frac, true);
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
      this.viewers[plane].setCrosshairFraction(this.crosshairFrac, true);
    });

    if (!silent) {
      this.emitLocation(null);
    }
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
    const numeric = Math.max(0, Math.round(Number(label) || 0));
    const frac = reference.labelCentroids.get(numeric);
    if (!frac) return false;

    this.setCrosshairFraction(frac, true);

    if (!silent) {
      this.emitLocation(null);
    }

    return true;
  }

  selectLabel(label) {
    PLANES.forEach((plane) => {
      this.viewers[plane].selectLabel(label);
    });
  }

  setStructureVisibility(label, visible) {
    PLANES.forEach((plane) => {
      this.viewers[plane].setStructureVisibility(label, visible);
    });
  }

  setSegmentationVisible(visible) {
    PLANES.forEach((plane) => {
      this.viewers[plane].setSegmentationVisible(visible);
    });
  }

  setSlice(index, silent) {
    const active = this.activeViewer();
    active.setSlice(index, true);
    this.crosshairFrac = active.crosshairFrac.slice();
    this.broadcastCrosshair(this.crosshairFrac, this.primaryPlane);

    if (!silent) {
      this.emitLocation(null);
    }
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
    PLANES.forEach((plane) => {
      this.viewers[plane].setWindow(width, level);
    });
  }

  zoomBy(delta) {
    this.activeViewer()?.zoomBy(delta);
  }

  resetView() {
    this.activeViewer()?.resetView();
  }

  setMultiplanar() {
    this.setPrimaryPlane("axial");
  }

  labelIntersectsPlane(label, plane, fraction) {
    return this.viewers.axial.labelIntersectsPlane(label, plane, fraction);
  }

  structuresAtPlane(plane, fraction) {
    return this.viewers.axial.structuresAtPlane(plane, fraction);
  }

  getAvailableStructureIds() {
    return this.viewers.axial.getAvailableStructureIds();
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
