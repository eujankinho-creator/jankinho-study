import * as niivue from "/vendor/niivue/index.js";
import {
  RADIOLOGY_STUDY,
  PLANE_CONFIG,
  STRUCTURES,
  createSegmentationColormap,
  getStructureByLabel,
  clamp
} from "./data.js";

export class RadiologyViewer {
  constructor(canvas, options) {
    this.canvas = canvas;
    this.options = options || {};
    this.study = RADIOLOGY_STUDY;
    this.plane = PLANE_CONFIG[this.options.plane]
      ? this.options.plane
      : "axial";
    this.singlePlane = Boolean(this.options.singlePlane);
    this.qualityRole = this.options.qualityRole === "primary"
      ? "primary"
      : "secondary";
    this.renderScale = Number(this.options.renderScale) ||
      (this.qualityRole === "primary" ? 1.42 : 0.78);
    this.maxBackingPixels = this.qualityRole === "primary"
      ? 2600000
      : 620000;
    this.resizeObserver = null;
    this.resizeRaf = 0;
    this.crosshairFrac = [0.5, 0.5, 0.5];
    this.windowWidth = 400;
    this.windowLevel = 50;
    this.zoom = 1;
    this.dims = [1, 1, 1];
    this.selectedLabel = 0;
    this.hiddenLabels = new Set();
    this.labelCentroids = new Map();
    this.labelBounds = new Map();
    this.segmentationOpacity = 0.34;
    this.ready = this.init();
  }

  async init() {
    this.nv = new niivue.Niivue({
      backColor: [0, 0, 0, 1],
      crosshairColor: [0.42, 0.78, 1, 0.86],
      show3Dcrosshair: true,
      isColorbar: false,
      dragAndDropEnabled: false,
      isResizeCanvas: false,
      onLocationChange: (data) => this.handleLocationChange(data)
    });

    this.nv.setSliceMM(true);
    this.nv.setRadiologicalConvention(true);
    await this.nv.attachTo(this.canvas.id);
    this.installResizeObserver();
    this.syncCanvasResolution();

    this.nv.opts.multiplanarShowRender = niivue.SHOW_RENDER.NEVER;
    this.nv.opts.isColorbar = false;
    this.nv.graph.autoSizeMultiplanar = true;
    this.nv.graph.opacity = 1.0;

    await this.nv.loadVolumes([
      {
        url: this.study.file,
        name: "totalseg_example_ct.nii.gz",
        colormap: "gray",
        opacity: 1
      },
      {
        url: this.study.segmentationFile,
        name: "totalseg_example_seg.nii.gz",
        opacity: this.segmentationOpacity
      }
    ]);

    if (this.nv.volumes.length < 2) {
      throw new Error("CT e segmentação do mesmo exame não foram carregados.");
    }

    this.applySegmentationColormap();
    this.nv.setOpacity(1, this.segmentationOpacity);
    this.nv.setInterpolation(true);
    this.nv.setAtlasOutline(0.012);
    if (this.singlePlane) {
      this.applySinglePlaneSliceType();
    }
    else {
      this.nv.setSliceType(this.nv.sliceTypeMultiplanar);
    }

    const dims = this.nv.volumes[0].dims || [];
    this.dims = [
      Math.max(1, Number(dims[1]) || 1),
      Math.max(1, Number(dims[2]) || 1),
      Math.max(1, Number(dims[3]) || 1)
    ];

    this.computeLabelCentroids();
    this.setWindow(this.windowWidth, this.windowLevel);
    this.setCrosshairFraction(this.crosshairFrac, true);
    this.resetView();
    this.syncCanvasResolution();

    if (typeof this.options.onReady === "function") {
      this.options.onReady({
        study: this.study,
        dims: this.dims.slice(),
        volume: this.nv.volumes[0],
        segmentation: this.nv.volumes[1],
        availableLabels: Array.from(this.labelCentroids.keys())
      });
    }

    return this;
  }

  computeLabelCentroids() {
    const segmentation = this.nv?.volumes?.[1];
    const image = segmentation?.img;
    if (!image || !image.length) return;

    const dims = segmentation.dims || [];
    const nx = Math.max(1, Number(dims[1]) || 1);
    const ny = Math.max(1, Number(dims[2]) || 1);
    const nz = Math.max(1, Number(dims[3]) || 1);
    const targetLabels = new Set(STRUCTURES.map((structure) => structure.label));
    const sums = new Map();

    const plane = nx * ny;
    for (let index = 0; index < image.length; index += 1) {
      const label = Math.round(Number(image[index]) || 0);
      if (!targetLabels.has(label)) continue;

      const z = Math.floor(index / plane);
      const remainder = index - z * plane;
      const y = Math.floor(remainder / nx);
      const x = remainder - y * nx;

      let entry = sums.get(label);
      if (!entry) {
        entry = {
          x: 0,
          y: 0,
          z: 0,
          count: 0,
          minX: x,
          maxX: x,
          minY: y,
          maxY: y,
          minZ: z,
          maxZ: z
        };
        sums.set(label, entry);
      }

      entry.x += x;
      entry.y += y;
      entry.z += z;
      entry.count += 1;
      entry.minX = Math.min(entry.minX, x);
      entry.maxX = Math.max(entry.maxX, x);
      entry.minY = Math.min(entry.minY, y);
      entry.maxY = Math.max(entry.maxY, y);
      entry.minZ = Math.min(entry.minZ, z);
      entry.maxZ = Math.max(entry.maxZ, z);
    }

    sums.forEach((entry, label) => {
      if (!entry.count) return;
      const vox = [
        entry.x / entry.count,
        entry.y / entry.count,
        entry.z / entry.count
      ];
      const frac = this.nv.vox2frac(vox);
      this.labelCentroids.set(label, [
        clamp(Number(frac[0]) || 0, 0, 1),
        clamp(Number(frac[1]) || 0, 0, 1),
        clamp(Number(frac[2]) || 0, 0, 1)
      ]);

      this.labelBounds.set(label, {
        min: [
          nx <= 1 ? 0 : entry.minX / (nx - 1),
          ny <= 1 ? 0 : entry.minY / (ny - 1),
          nz <= 1 ? 0 : entry.minZ / (nz - 1)
        ],
        max: [
          nx <= 1 ? 1 : entry.maxX / (nx - 1),
          ny <= 1 ? 1 : entry.maxY / (ny - 1),
          nz <= 1 ? 1 : entry.maxZ / (nz - 1)
        ],
        voxelCount: entry.count
      });
    });
  }

  handleLocationChange(data) {
    if (!this.nv) return;

    const next = Array.from(this.nv.scene.crosshairPos || this.crosshairFrac)
      .slice(0, 3)
      .map((value) => clamp(Number(value) || 0, 0, 1));

    if (next.length === 3) {
      this.crosshairFrac = next;
    }

    const label = Math.round(Number(data?.values?.[1]?.value || 0));
    const structure = getStructureByLabel(label);

    if (structure && typeof this.options.onStructureAtLocation === "function") {
      this.options.onStructureAtLocation(structure, {
        label,
        frac: this.crosshairFrac.slice(),
        data
      });
    }

    if (typeof this.options.onLocationChange === "function") {
      this.options.onLocationChange({
        data,
        frac: this.crosshairFrac.slice(),
        plane: this.plane,
        index: this.currentSliceIndex(),
        total: this.sliceCount(),
        intensityText: data?.string || "",
        label,
        structure
      });
    }
  }

  applySegmentationColormap() {
    if (!this.nv?.volumes?.[1]) return;

    const cmap = createSegmentationColormap({
      selectedLabel: this.selectedLabel,
      hiddenLabels: this.hiddenLabels,
      showContext: false,
      showAllTargetStructures: true
    });

    this.nv.volumes[1].setColormapLabel(cmap);
    this.nv.opts.atlasActiveIndex = this.selectedLabel > 0
      ? this.selectedLabel
      : -1;
    this.nv.updateGLVolume();
    this.nv.drawScene();
  }

  installResizeObserver() {
    if (typeof ResizeObserver === "undefined") return;

    const target = this.canvas.parentElement || this.canvas;
    this.resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(this.resizeRaf);
      this.resizeRaf = requestAnimationFrame(() => {
        this.syncCanvasResolution();
      });
    });
    this.resizeObserver.observe(target);
  }

  setQualityRole(role) {
    const next = role === "primary" ? "primary" : "secondary";
    if (this.qualityRole === next) {
      this.syncCanvasResolution();
      return;
    }

    this.qualityRole = next;
    this.renderScale = next === "primary" ? 1.42 : 0.78;
    this.maxBackingPixels = next === "primary" ? 2600000 : 620000;
    this.syncCanvasResolution();
  }

  syncCanvasResolution() {
    if (!this.canvas || !this.nv) return;

    const rect = this.canvas.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const minRatio = this.qualityRole === "primary" ? 1.0 : 0.68;
    const maxRatio = this.qualityRole === "primary" ? 2.05 : 1.12;
    let ratio = clamp(dpr * this.renderScale, minRatio, maxRatio);

    let width = Math.max(2, Math.round(rect.width * ratio));
    let height = Math.max(2, Math.round(rect.height * ratio));
    const pixels = width * height;

    if (pixels > this.maxBackingPixels) {
      const reduce = Math.sqrt(this.maxBackingPixels / pixels);
      ratio *= reduce;
      width = Math.max(2, Math.round(rect.width * ratio));
      height = Math.max(2, Math.round(rect.height * ratio));
    }

    if (this.canvas.width === width && this.canvas.height === height) {
      this.nv.drawScene();
      return;
    }

    this.canvas.width = width;
    this.canvas.height = height;
    this.nv.resizeListener();
    this.nv.drawScene();
  }

  getRenderQuality() {
    const rect = this.canvas?.getBoundingClientRect?.();
    if (!rect) return null;

    return {
      role: this.qualityRole,
      cssWidth: Math.round(rect.width),
      cssHeight: Math.round(rect.height),
      backingWidth: this.canvas.width,
      backingHeight: this.canvas.height
    };
  }

  setPlane(plane, silent) {
    if (!PLANE_CONFIG[plane]) return;
    this.plane = plane;

    if (this.singlePlane && this.nv) {
      this.applySinglePlaneSliceType();
    }

    if (!silent && typeof this.options.onPlaneChange === "function") {
      this.options.onPlaneChange(plane);
    }

    if (!silent) {
      this.notifyProgrammaticLocation();
    }
  }

  setCrosshairFraction(frac, silent) {
    if (!Array.isArray(frac) || frac.length < 3) return;

    this.crosshairFrac = [
      clamp(Number(frac[0]) || 0, 0, 1),
      clamp(Number(frac[1]) || 0, 0, 1),
      clamp(Number(frac[2]) || 0, 0, 1)
    ];

    if (this.nv) {
      this.nv.scene.crosshairPos = this.crosshairFrac.slice();
      this.nv.drawScene();
    }

    if (!silent) {
      this.notifyProgrammaticLocation();
    }
  }

  focusLabel(label, silent) {
    const numeric = Math.max(0, Math.round(Number(label) || 0));
    const frac = this.labelCentroids.get(numeric);
    if (!frac) return false;

    this.setCrosshairFraction(frac, true);

    if (!silent) {
      this.notifyProgrammaticLocation();
    }

    return true;
  }

  selectLabel(label) {
    this.selectedLabel = Math.max(0, Math.round(Number(label) || 0));
    this.applySegmentationColormap();
  }

  setStructureVisibility(label, visible) {
    const numeric = Math.max(0, Math.round(Number(label) || 0));
    if (!numeric) return;

    if (visible) this.hiddenLabels.delete(numeric);
    else this.hiddenLabels.add(numeric);

    this.applySegmentationColormap();
  }

  setSegmentationVisible(visible) {
    this.segmentationOpacity = visible ? 0.34 : 0;
    if (!this.nv) return;
    this.nv.setOpacity(1, this.segmentationOpacity);
    this.nv.drawScene();
  }

  setSlice(index, silent) {
    const count = this.sliceCount();
    const safe = clamp(Math.round(Number(index) || 0), 0, count - 1);
    const axis = PLANE_CONFIG[this.plane].fracAxis;
    const frac = count <= 1 ? 0.5 : safe / (count - 1);
    const next = this.crosshairFrac.slice();
    next[axis] = frac;

    this.setCrosshairFraction(next, true);

    if (!silent) {
      this.notifyProgrammaticLocation();
    }
  }

  notifyProgrammaticLocation() {
    if (typeof this.options.onLocationChange === "function") {
      this.options.onLocationChange({
        data: null,
        frac: this.crosshairFrac.slice(),
        plane: this.plane,
        index: this.currentSliceIndex(),
        total: this.sliceCount(),
        intensityText: "",
        label: this.selectedLabel,
        structure: getStructureByLabel(this.selectedLabel)
      });
    }
  }

  sliceCount(plane) {
    const p = plane || this.plane;
    const axis = PLANE_CONFIG[p].fracAxis;
    return Math.max(1, this.dims[axis]);
  }

  currentSliceIndex(plane) {
    const p = plane || this.plane;
    const axis = PLANE_CONFIG[p].fracAxis;
    const count = this.sliceCount(p);
    return Math.round(this.crosshairFrac[axis] * Math.max(0, count - 1));
  }

  setWindow(width, level) {
    this.windowWidth = clamp(Number(width) || 400, 40, 2200);
    this.windowLevel = clamp(Number(level) || 50, -1000, 1000);

    if (!this.nv || !this.nv.volumes.length) return;

    const volume = this.nv.volumes[0];
    volume.cal_min = this.windowLevel - this.windowWidth / 2;
    volume.cal_max = this.windowLevel + this.windowWidth / 2;
    this.nv.updateGLVolume();
    this.nv.drawScene();
  }

  setZoom(value) {
    this.zoom = clamp(Number(value) || 1, 0.65, 4.5);
    if (!this.nv) return;

    const current = Array.from(this.nv.scene.pan2Dxyzmm || [0, 0, 0, 1]);
    while (current.length < 4) current.push(0);
    current[3] = this.zoom;

    if (typeof this.nv.setPan2Dxyzmm === "function") {
      this.nv.setPan2Dxyzmm(current);
    }
    else {
      this.nv.scene.pan2Dxyzmm = current;
    }

    this.nv.drawScene();

    if (typeof this.options.onZoomChange === "function") {
      this.options.onZoomChange(this.zoom);
    }
  }

  zoomBy(delta) {
    this.setZoom(this.zoom + delta);
  }

  resetView() {
    if (!this.nv) return;

    this.zoom = 1;
    const resetPan = [0, 0, 0, 1];

    if (typeof this.nv.setPan2Dxyzmm === "function") {
      this.nv.setPan2Dxyzmm(resetPan);
    }
    else {
      this.nv.scene.pan2Dxyzmm = resetPan;
    }

    if (this.singlePlane) {
      this.applySinglePlaneSliceType();
    }
    else {
      this.nv.setSliceType(this.nv.sliceTypeMultiplanar);
    }
    this.nv.drawScene();

    if (typeof this.options.onZoomChange === "function") {
      this.options.onZoomChange(this.zoom);
    }
  }

  applySinglePlaneSliceType() {
    if (!this.nv || !PLANE_CONFIG[this.plane]) return;

    if (this.plane === "axial") {
      this.nv.setSliceType(this.nv.sliceTypeAxial);
    }
    else if (this.plane === "coronal") {
      this.nv.setSliceType(this.nv.sliceTypeCoronal);
    }
    else {
      this.nv.setSliceType(this.nv.sliceTypeSagittal);
    }
  }

  setMultiplanar() {
    if (!this.nv) return;
    this.singlePlane = false;
    this.nv.setSliceType(this.nv.sliceTypeMultiplanar);
    this.nv.drawScene();
  }

  setSinglePlane(plane, silent) {
    if (!this.nv || !PLANE_CONFIG[plane]) return;

    this.singlePlane = true;
    this.setPlane(plane, true);
    this.applySinglePlaneSliceType();
    this.nv.drawScene();

    if (!silent) {
      this.notifyProgrammaticLocation();
    }
  }

  labelIntersectsPlane(label, plane, fraction) {
    const bounds = this.labelBounds.get(Math.round(Number(label) || 0));
    const config = PLANE_CONFIG[plane];
    if (!bounds || !config) return false;
    const axis = config.fracAxis;
    const value = clamp(Number(fraction) || 0, 0, 1);
    return value >= bounds.min[axis] && value <= bounds.max[axis];
  }

  structuresAtPlane(plane, fraction) {
    return STRUCTURES.filter((structure) => {
      return this.labelIntersectsPlane(structure.label, plane, fraction);
    });
  }

  getAvailableStructureIds() {
    return STRUCTURES
      .filter((structure) => this.labelCentroids.has(structure.label))
      .map((structure) => structure.id);
  }

  dispose() {
    cancelAnimationFrame(this.resizeRaf);
    this.resizeObserver?.disconnect();
  }

  getState() {
    return {
      study: this.study,
      plane: this.plane,
      frac: this.crosshairFrac.slice(),
      sliceIndex: this.currentSliceIndex(),
      slices: this.sliceCount(),
      dims: this.dims.slice(),
      zoom: this.zoom,
      selectedLabel: this.selectedLabel
    };
  }
}
