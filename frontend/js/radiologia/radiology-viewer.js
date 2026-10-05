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
    this.plane = "axial";
    this.crosshairFrac = [0.5, 0.5, 0.5];
    this.windowWidth = 400;
    this.windowLevel = 50;
    this.zoom = 1;
    this.dims = [1, 1, 1];
    this.selectedLabel = 0;
    this.hiddenLabels = new Set();
    this.labelCentroids = new Map();
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
      onLocationChange: (data) => this.handleLocationChange(data)
    });

    this.nv.setSliceMM(true);
    this.nv.setRadiologicalConvention(true);
    await this.nv.attachTo(this.canvas.id);

    this.nv.opts.multiplanarShowRender = niivue.SHOW_RENDER.NEVER;
    this.nv.opts.isColorbar = false;
    this.nv.graph.autoSizeMultiplanar = true;
    this.nv.graph.opacity = 1.0;

    await this.nv.loadVolumes([
      {
        url: this.study.file,
        name: this.study.name,
        colormap: "gray",
        opacity: 1
      },
      {
        url: this.study.segmentationFile,
        name: "TotalSegmentator · segmentação",
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
    this.nv.setSliceType(this.nv.sliceTypeMultiplanar);

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
        entry = { x: 0, y: 0, z: 0, count: 0 };
        sums.set(label, entry);
      }

      entry.x += x;
      entry.y += y;
      entry.z += z;
      entry.count += 1;
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

  setPlane(plane) {
    if (!PLANE_CONFIG[plane]) return;
    this.plane = plane;

    if (typeof this.options.onPlaneChange === "function") {
      this.options.onPlaneChange(plane);
    }

    this.notifyProgrammaticLocation();
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

    this.nv.setSliceType(this.nv.sliceTypeMultiplanar);
    this.nv.drawScene();

    if (typeof this.options.onZoomChange === "function") {
      this.options.onZoomChange(this.zoom);
    }
  }

  setMultiplanar() {
    if (!this.nv) return;
    this.nv.setSliceType(this.nv.sliceTypeMultiplanar);
    this.nv.drawScene();
  }

  setSinglePlane(plane) {
    if (!this.nv || !PLANE_CONFIG[plane]) return;

    this.setPlane(plane);
    if (plane === "axial") this.nv.setSliceType(this.nv.sliceTypeAxial);
    if (plane === "coronal") this.nv.setSliceType(this.nv.sliceTypeCoronal);
    if (plane === "sagittal") this.nv.setSliceType(this.nv.sliceTypeSagittal);
    this.nv.drawScene();
  }

  getAvailableStructureIds() {
    return STRUCTURES
      .filter((structure) => this.labelCentroids.has(structure.label))
      .map((structure) => structure.id);
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
