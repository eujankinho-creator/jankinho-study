import * as niivue from "/vendor/niivue/index.js";
import {
  RADIOLOGY_STUDY,
  createSegmentationColormap,
  getStructureByLabel,
  clamp
} from "./data.js";

export class Exam3DViewer {
  constructor(canvas, options) {
    this.canvas = canvas;
    this.options = options || {};
    this.study = RADIOLOGY_STUDY;
    this.crosshairFrac = [0.5, 0.5, 0.5];
    this.selectedLabel = 0;
    this.hiddenLabels = new Set();
    this.showAllTargetStructures = true;
    this.showContext = true;
    this.segmentationOpacity = 0.82;
    this.ctOpacity = 0.72;
    this.ready = this.init();
  }

  async init() {
    this.nv = new niivue.Niivue({
      backColor: [0.025, 0.035, 0.048, 1],
      show3Dcrosshair: true,
      dragAndDropEnabled: false,
      isColorbar: false,
      onLocationChange: (data) => this.handleLocationChange(data)
    });

    this.nv.setSliceMM(true);
    this.nv.setRadiologicalConvention(true);
    await this.nv.attachTo(this.canvas.id);

    await this.nv.loadVolumes([
      {
        url: this.study.file,
        name: this.study.name,
        colormap: "gray",
        opacity: this.ctOpacity
      },
      {
        url: this.study.segmentationFile,
        name: "TotalSegmentator · segmentação",
        opacity: this.segmentationOpacity
      }
    ]);

    if (this.nv.volumes.length < 2) {
      throw new Error("CT ou segmentação co-registrada não foram carregados.");
    }

    this.applySegmentationColormap();
    this.nv.setOpacity(0, this.ctOpacity);
    this.nv.setOpacity(1, this.segmentationOpacity);
    this.nv.setInterpolation(true);
    this.nv.setAtlasOutline(0.015);
    this.nv.setVolumeRenderIllumination(0.58);
    this.nv.setSliceType(this.nv.sliceTypeRender);
    this.nv.setRenderAzimuthElevation(160, 18);
    this.nv.scene.crosshairPos = this.crosshairFrac.slice();
    this.nv.drawScene();

    if (typeof this.options.onReady === "function") {
      this.options.onReady({
        study: this.study,
        volumes: this.nv.volumes
      });
    }

    return this;
  }

  handleLocationChange(data) {
    if (!this.nv) return;

    const frac = Array.from(this.nv.scene.crosshairPos || this.crosshairFrac)
      .slice(0, 3)
      .map((value) => clamp(Number(value) || 0, 0, 1));

    if (frac.length === 3) {
      this.crosshairFrac = frac;
    }

    const label = Math.round(Number(data?.values?.[1]?.value || 0));
    const structure = getStructureByLabel(label);

    if (structure && typeof this.options.onStructureAtLocation === "function") {
      this.options.onStructureAtLocation(structure, {
        data,
        frac: this.crosshairFrac.slice(),
        label
      });
    }

    if (typeof this.options.onLocationChange === "function") {
      this.options.onLocationChange({
        data,
        frac: this.crosshairFrac.slice(),
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
      showContext: this.showContext,
      showAllTargetStructures: this.showAllTargetStructures
    });

    this.nv.volumes[1].setColormapLabel(cmap);
    this.nv.opts.atlasActiveIndex = this.selectedLabel > 0
      ? this.selectedLabel
      : -1;
    this.nv.updateGLVolume();
    this.nv.drawScene();
  }

  setCrosshairFraction(frac, silent) {
    if (!Array.isArray(frac) || frac.length < 3 || !this.nv) return;

    this.crosshairFrac = [
      clamp(Number(frac[0]) || 0, 0, 1),
      clamp(Number(frac[1]) || 0, 0, 1),
      clamp(Number(frac[2]) || 0, 0, 1)
    ];

    this.nv.scene.crosshairPos = this.crosshairFrac.slice();
    this.nv.drawScene();

    if (!silent && typeof this.options.onLocationChange === "function") {
      this.options.onLocationChange({
        data: null,
        frac: this.crosshairFrac.slice(),
        label: this.selectedLabel,
        structure: getStructureByLabel(this.selectedLabel)
      });
    }
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

  setCategoryVisibility(category, visible, structures) {
    (structures || []).forEach((structure) => {
      if (structure.category !== category) return;
      if (visible) this.hiddenLabels.delete(structure.label);
      else this.hiddenLabels.add(structure.label);
    });

    this.applySegmentationColormap();
  }

  setTransparent(enabled) {
    this.ctOpacity = enabled ? 0.22 : 0.72;
    if (!this.nv) return;
    this.nv.setOpacity(0, this.ctOpacity);
    this.nv.drawScene();
  }

  setContextVisible(visible) {
    this.showContext = Boolean(visible);
    this.applySegmentationColormap();
  }

  setAllTargetStructuresVisible(visible) {
    this.showAllTargetStructures = Boolean(visible);
    this.applySegmentationColormap();
  }

  setClipPlane(enabled) {
    if (!this.nv) return;

    if (enabled) {
      this.nv.setClipPlane([0, 180, 40]);
    }
    else {
      this.nv.setClipPlane([0, 0, 0]);
    }

    this.nv.drawScene();
  }

  reset() {
    if (!this.nv) return;
    this.nv.setSliceType(this.nv.sliceTypeRender);
    this.nv.setRenderAzimuthElevation(160, 18);
    this.nv.scene.pan2Dxyzmm = [0, 0, 0, 1];
    this.nv.drawScene();
  }

  focusSelected() {
    if (!this.nv || this.selectedLabel <= 0) return;
    this.nv.opts.atlasActiveIndex = this.selectedLabel;
    this.nv.drawScene();
  }

  getState() {
    return {
      frac: this.crosshairFrac.slice(),
      selectedLabel: this.selectedLabel
    };
  }
}
