import * as niivue from "/vendor/niivue/index.js";
import {
  RADIOLOGY_STUDY,
  PLANE_CONFIG,
  clamp
} from "./data.js";

export class RadiologyViewer {
  constructor(canvas, options) {
    this.canvas = canvas;
    this.options = options || {};
    this.study = RADIOLOGY_STUDY;
    this.plane = "axial";
    this.crosshairFrac = [0.5, 0.5, 0.55];
    this.windowWidth = 400;
    this.windowLevel = 50;
    this.zoom = 1;
    this.dims = [1, 1, 1];
    this.ready = this.init();
  }

  async init() {
    this.nv = new niivue.Niivue({
      backColor: [0, 0, 0, 1],
      crosshairColor: [0.42, 0.78, 1, 0.78],
      show3Dcrosshair: true,
      isColorbar: false,
      dragAndDropEnabled: false,
      onLocationChange: (data) => {
        this.handleLocationChange(data);
      }
    });

    await this.nv.attachTo(this.canvas.id);
    this.nv.setRadiologicalConvention(true);
    this.nv.setSliceMM(true);
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
      }
    ]);

    if (!this.nv.volumes.length) {
      throw new Error("O volume CT_Abdo não foi carregado pelo NiiVue.");
    }

    this.nv.volumes[0].colorbarVisible = false;
    this.nv.setInterpolation(true);
    this.nv.setSliceType(this.nv.sliceTypeMultiplanar);

    const dims = this.nv.volumes[0].dims || [];
    this.dims = [
      Math.max(1, Number(dims[1]) || 1),
      Math.max(1, Number(dims[2]) || 1),
      Math.max(1, Number(dims[3]) || 1)
    ];

    this.setWindow(this.windowWidth, this.windowLevel);
    this.setCrosshairFraction(this.crosshairFrac, true);
    this.resetView();

    if (typeof this.options.onReady === "function") {
      this.options.onReady({
        study: this.study,
        dims: this.dims.slice(),
        volume: this.nv.volumes[0]
      });
    }

    return this;
  }

  handleLocationChange(data) {
    if (!this.nv) return;

    const next = Array.from(this.nv.scene.crosshairPos || this.crosshairFrac)
      .slice(0, 3)
      .map(function (value) {
        return clamp(Number(value) || 0, 0, 1);
      });

    if (next.length === 3) {
      this.crosshairFrac = next;
    }

    if (typeof this.options.onLocationChange === "function") {
      this.options.onLocationChange({
        data,
        frac: this.crosshairFrac.slice(),
        plane: this.plane,
        index: this.currentSliceIndex(),
        total: this.sliceCount(),
        intensityText: data?.string || ""
      });
    }
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
        intensityText: ""
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

  getState() {
    return {
      study: this.study,
      plane: this.plane,
      frac: this.crosshairFrac.slice(),
      sliceIndex: this.currentSliceIndex(),
      slices: this.sliceCount(),
      dims: this.dims.slice(),
      zoom: this.zoom
    };
  }
}
