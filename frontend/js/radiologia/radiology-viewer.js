import * as niivue from "/vendor/niivue/index.js";
import {
  RADIOLOGY_STUDY,
  PLANE_CONFIG,
  STRUCTURES,
  SEGMENTATION_GROUPS,
  createGroupSegmentationColormap,
  getStructureByLabel,
  getStructureByGroupLabel,
  clamp
} from "./data.js?v=20261005-atlas3";

export class RadiologyViewer {
  constructor(canvas, options) {
    this.canvas = canvas;
    this.options = options || {};
    this.study = RADIOLOGY_STUDY;
    this.plane = PLANE_CONFIG[this.options.plane] ? this.options.plane : "axial";
    this.singlePlane = Boolean(this.options.singlePlane);
    this.qualityRole = this.options.qualityRole === "primary" ? "primary" : "secondary";
    this.renderScale = Number(this.options.renderScale) || (this.qualityRole === "primary" ? 1.14 : 0.72);
    this.maxBackingPixels = this.qualityRole === "primary" ? 2050000 : 760000;
    this.resizeObserver = null;
    this.resizeRaf = 0;
    this.crosshairFrac = [0.5, 0.5, 0.5];
    this.windowWidth = 400;
    this.windowLevel = 40;
    this.defaultZoom = clamp(Number(this.options.defaultZoom) || 0.68, 0.48, 1.2);
    this.zoom = this.defaultZoom;
    this.dims = [1, 1, 1];
    this.selectedLabel = 0;
    this.hiddenLabels = new Set();
    this.labelCentroids = new Map();
    this.labelBounds = new Map();
    this.groupVolumeIndexes = new Map();
    this.segmentationVisible = true;
    this.ready = this.init();
  }

  async init() {
    this.nv = new niivue.Niivue({
      backColor: [0, 0, 0, 1],
      crosshairColor: [0.25, 0.78, 1, 0.94],
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

    if (this.options.baseVolume) {
      this.nv.addVolume(this.options.baseVolume);
    } else {
      await this.nv.loadVolumes([
        { url: this.study.file, name: "ct.nii.gz", colormap: "gray", opacity: 1 }
      ]);
    }

    if (!this.nv.volumes.length) {
      throw new Error("O CT corporal não foi carregado.");
    }
    this.nv.setInterpolation(true);
    this.nv.setAtlasOutline(0.012);

    if (this.singlePlane) this.applySinglePlaneSliceType();
    else this.nv.setSliceType(this.nv.sliceTypeMultiplanar);

    const dims = this.nv.volumes[0].dims || [];
    this.dims = [
      Math.max(1, Number(dims[1]) || 1),
      Math.max(1, Number(dims[2]) || 1),
      Math.max(1, Number(dims[3]) || 1)
    ];

    this.setWindow(this.windowWidth, this.windowLevel);
    this.setCrosshairFraction(this.crosshairFrac, true);
    this.resetView();
    this.syncCanvasResolution();

    if (typeof this.options.onReady === "function") {
      this.options.onReady({
        study: this.study,
        dims: this.dims.slice(),
        volume: this.nv.volumes[0],
        availableLabels: Array.from(this.labelCentroids.keys())
      });
    }
    return this;
  }

  addSharedSegmentations(segmentationVolumes, computeAnatomy = false) {
    if (!Array.isArray(segmentationVolumes) || !segmentationVolumes.length) return;

    this.groupVolumeIndexes.clear();

    segmentationVolumes.forEach((entry) => {
      if (!entry?.volume || !entry?.id) return;
      this.nv.addVolume(entry.volume);
      this.groupVolumeIndexes.set(entry.id, this.nv.volumes.length - 1);
    });

    this.applySegmentationColormaps();
    this.applySegmentationOpacity();

    if (computeAnatomy) {
      this.computeLabelCentroids();
    }

    this.nv.drawScene();
  }

  computeLabelCentroids() {
    this.labelCentroids.clear();
    this.labelBounds.clear();

    SEGMENTATION_GROUPS.forEach((group) => {
      const volumeIndex = this.groupVolumeIndexes.get(group.id);
      const segmentation = this.nv?.volumes?.[volumeIndex];
      const image = segmentation?.img;
      if (!image?.length) return;

      const dims = segmentation.dims || [];
      const nx = Math.max(1, Number(dims[1]) || 1);
      const ny = Math.max(1, Number(dims[2]) || 1);
      const nz = Math.max(1, Number(dims[3]) || 1);
      const structures = STRUCTURES.filter((s) => s.group === group.id);
      const byLocal = new Map(structures.map((s) => [s.localLabel, s]));
      const sums = new Map();
      const plane = nx * ny;

      // Em volumes corporais completos, varrer cada voxel congela o navegador.
      // Mantemos no máximo ~1,2M amostras por máscara, distribuídas em 3D.
      const totalVoxels = nx * ny * nz;
      const step = Math.max(
        1,
        Math.ceil(Math.cbrt(totalVoxels / 1200000))
      );

      for (let z = 0; z < nz; z += step) {
        const zBase = z * plane;
        for (let y = 0; y < ny; y += step) {
          const rowBase = zBase + y * nx;
          for (let x = 0; x < nx; x += step) {
            const index = rowBase + x;
            const localLabel = Math.round(Number(image[index]) || 0);
            const structure = byLocal.get(localLabel);
            if (!structure) continue;

            let entry = sums.get(structure.label);
            if (!entry) {
              entry = {
                x: 0, y: 0, z: 0, count: 0,
                minX: x, maxX: x,
                minY: y, maxY: y,
                minZ: z, maxZ: z
              };
              sums.set(structure.label, entry);
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
        }
      }

      sums.forEach((entry, syntheticLabel) => {
        if (!entry.count) return;

        const frac = this.nv.vox2frac([
          entry.x / entry.count,
          entry.y / entry.count,
          entry.z / entry.count
        ]);

        this.labelCentroids.set(syntheticLabel, [
          clamp(Number(frac[0]) || 0, 0, 1),
          clamp(Number(frac[1]) || 0, 0, 1),
          clamp(Number(frac[2]) || 0, 0, 1)
        ]);

        this.labelBounds.set(syntheticLabel, {
          min: [
            nx <= 1 ? 0 : Math.max(0, entry.minX - step) / (nx - 1),
            ny <= 1 ? 0 : Math.max(0, entry.minY - step) / (ny - 1),
            nz <= 1 ? 0 : Math.max(0, entry.minZ - step) / (nz - 1)
          ],
          max: [
            nx <= 1 ? 1 : Math.min(nx - 1, entry.maxX + step) / (nx - 1),
            ny <= 1 ? 1 : Math.min(ny - 1, entry.maxY + step) / (ny - 1),
            nz <= 1 ? 1 : Math.min(nz - 1, entry.maxZ + step) / (nz - 1)
          ],
          voxelCount: entry.count * step * step * step,
          sampled: step > 1
        });
      });
    });
  }

  structureAtLocation(data) {
    for (const group of SEGMENTATION_GROUPS) {
      const volumeIndex = this.groupVolumeIndexes.get(group.id);
      const localLabel = Math.round(Number(data?.values?.[volumeIndex]?.value || 0));
      if (!localLabel) continue;
      const structure = getStructureByGroupLabel(group.id, localLabel);
      if (structure) return structure;
    }
    return null;
  }

  handleLocationChange(data) {
    if (!this.nv) return;
    const next = Array.from(this.nv.scene.crosshairPos || this.crosshairFrac)
      .slice(0, 3)
      .map((value) => clamp(Number(value) || 0, 0, 1));
    if (next.length === 3) this.crosshairFrac = next;

    const structure = this.structureAtLocation(data);
    const label = structure?.label || 0;

    if (structure && typeof this.options.onStructureAtLocation === "function") {
      this.options.onStructureAtLocation(structure, {
        label, frac: this.crosshairFrac.slice(), data
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

  applySegmentationColormaps() {
    SEGMENTATION_GROUPS.forEach((group) => {
      const volumeIndex = this.groupVolumeIndexes.get(group.id);
      const volume = this.nv?.volumes?.[volumeIndex];
      if (!volume) return;
      volume.setColormapLabel(createGroupSegmentationColormap(group.id, {
        selectedLabel: this.selectedLabel,
        hiddenLabels: this.hiddenLabels
      }));
    });
    this.nv.updateGLVolume();
    this.nv.drawScene();
  }

  applySegmentationOpacity() {
    this.study.segmentations.forEach((seg) => {
      const volumeIndex = this.groupVolumeIndexes.get(seg.id);
      if (!volumeIndex) return;
      this.nv.setOpacity(volumeIndex, this.segmentationVisible ? seg.opacity : 0);
    });
    this.nv.drawScene();
  }

  installResizeObserver() {
    if (typeof ResizeObserver === "undefined") return;
    const target = this.canvas.parentElement || this.canvas;
    this.resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(this.resizeRaf);
      this.resizeRaf = requestAnimationFrame(() => this.syncCanvasResolution());
    });
    this.resizeObserver.observe(target);
  }

  setQualityRole(role) {
    const next = role === "primary" ? "primary" : "secondary";
    this.qualityRole = next;
    this.renderScale = next === "primary" ? 1.14 : 0.72;
    this.maxBackingPixels = next === "primary" ? 2050000 : 760000;
    this.syncCanvasResolution();
  }

  syncCanvasResolution() {
    if (!this.canvas || !this.nv) return;
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const minRatio = this.qualityRole === "primary" ? 0.92 : 0.62;
    const maxRatio = this.qualityRole === "primary" ? 1.70 : 1.10;
    let ratio = clamp(dpr * this.renderScale, minRatio, maxRatio);
    let width = Math.max(2, Math.round(rect.width * ratio));
    let height = Math.max(2, Math.round(rect.height * ratio));
    const pixels = width * height;
    if (pixels > this.maxBackingPixels) {
      const reduce = Math.sqrt(this.maxBackingPixels / pixels);
      width = Math.max(2, Math.round(width * reduce));
      height = Math.max(2, Math.round(height * reduce));
    }
    if (this.canvas.width === width && this.canvas.height === height) return;
    this.canvas.width = width; this.canvas.height = height;
    this.nv.resizeListener(); this.nv.drawScene();
  }

  getRenderQuality() {
    const rect = this.canvas?.getBoundingClientRect?.();
    if (!rect) return null;
    return {
      role:this.qualityRole, cssWidth:Math.round(rect.width), cssHeight:Math.round(rect.height),
      backingWidth:this.canvas.width, backingHeight:this.canvas.height
    };
  }

  setPlane(plane, silent) {
    if (!PLANE_CONFIG[plane]) return;
    this.plane = plane;
    if (this.singlePlane && this.nv) this.applySinglePlaneSliceType();
    if (!silent && typeof this.options.onPlaneChange === "function") this.options.onPlaneChange(plane);
    if (!silent) this.notifyProgrammaticLocation();
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
    if (!silent) this.notifyProgrammaticLocation();
  }

  focusLabel(label, silent) {
    const numeric = Math.max(0, Math.round(Number(label) || 0));
    const frac = this.labelCentroids.get(numeric);
    if (!frac) return false;
    this.setCrosshairFraction(frac, true);
    if (!silent) this.notifyProgrammaticLocation();
    return true;
  }

  selectLabel(label) {
    this.selectedLabel = Math.max(0, Math.round(Number(label) || 0));
    this.applySegmentationColormaps();
  }

  setStructureVisibility(label, visible) {
    const numeric = Math.max(0, Math.round(Number(label) || 0));
    if (!numeric) return;
    if (visible) this.hiddenLabels.delete(numeric); else this.hiddenLabels.add(numeric);
    this.applySegmentationColormaps();
  }

  setSegmentationVisible(visible) {
    this.segmentationVisible = Boolean(visible);
    if (this.nv) this.applySegmentationOpacity();
  }

  setSlice(index, silent) {
    const count = this.sliceCount();
    const safe = clamp(Math.round(Number(index) || 0), 0, count - 1);
    const axis = PLANE_CONFIG[this.plane].fracAxis;
    const frac = count <= 1 ? 0.5 : safe / (count - 1);
    const next = this.crosshairFrac.slice();
    next[axis] = frac;
    this.setCrosshairFraction(next, true);
    if (!silent) this.notifyProgrammaticLocation();
  }

  notifyProgrammaticLocation() {
    if (typeof this.options.onLocationChange !== "function") return;
    this.options.onLocationChange({
      data:null, frac:this.crosshairFrac.slice(), plane:this.plane,
      index:this.currentSliceIndex(), total:this.sliceCount(), intensityText:"",
      label:this.selectedLabel, structure:getStructureByLabel(this.selectedLabel)
    });
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
    this.windowWidth = clamp(Number(width) || 400, 40, 3000);
    this.windowLevel = clamp(Number(level) || 40, -1200, 1200);
    if (!this.nv?.volumes?.length) return;
    const volume = this.nv.volumes[0];
    volume.cal_min = this.windowLevel - this.windowWidth / 2;
    volume.cal_max = this.windowLevel + this.windowWidth / 2;
    this.nv.updateGLVolume(); this.nv.drawScene();
  }

  setZoom(value) {
    this.zoom = clamp(Number(value) || this.defaultZoom, 0.42, 4.0);
    if (!this.nv) return;
    const current = Array.from(this.nv.scene.pan2Dxyzmm || [0,0,0,1]);
    while (current.length < 4) current.push(0);
    current[3] = this.zoom;
    if (typeof this.nv.setPan2Dxyzmm === "function") this.nv.setPan2Dxyzmm(current);
    else this.nv.scene.pan2Dxyzmm = current;
    this.nv.drawScene();
    if (typeof this.options.onZoomChange === "function") this.options.onZoomChange(this.zoom);
  }

  zoomBy(delta) { this.setZoom(this.zoom + delta); }

  resetView() {
    if (!this.nv) return;
    this.zoom = this.defaultZoom;
    const resetPan = [0,0,0,this.defaultZoom];
    if (typeof this.nv.setPan2Dxyzmm === "function") this.nv.setPan2Dxyzmm(resetPan);
    else this.nv.scene.pan2Dxyzmm = resetPan;
    if (this.singlePlane) this.applySinglePlaneSliceType();
    else this.nv.setSliceType(this.nv.sliceTypeMultiplanar);
    this.nv.drawScene();
    if (typeof this.options.onZoomChange === "function") this.options.onZoomChange(this.zoom);
  }

  applySinglePlaneSliceType() {
    if (!this.nv || !PLANE_CONFIG[this.plane]) return;
    if (this.plane === "axial") this.nv.setSliceType(this.nv.sliceTypeAxial);
    else if (this.plane === "coronal") this.nv.setSliceType(this.nv.sliceTypeCoronal);
    else this.nv.setSliceType(this.nv.sliceTypeSagittal);
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
    if (!silent) this.notifyProgrammaticLocation();
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
    return STRUCTURES.filter((structure) => this.labelIntersectsPlane(structure.label, plane, fraction));
  }

  getAvailableStructureIds() {
    return STRUCTURES.filter((structure) => this.labelCentroids.has(structure.label)).map((structure) => structure.id);
  }

  dispose() { cancelAnimationFrame(this.resizeRaf); this.resizeObserver?.disconnect(); }

  getState() {
    return {
      study:this.study, plane:this.plane, frac:this.crosshairFrac.slice(),
      sliceIndex:this.currentSliceIndex(), slices:this.sliceCount(), dims:this.dims.slice(),
      zoom:this.zoom, selectedLabel:this.selectedLabel
    };
  }
}
