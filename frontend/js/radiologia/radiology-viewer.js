import {
  STRUCTURES,
  STUDIES,
  PLANE_CONFIG,
  coordinateForSlice,
  structuresAtCoordinate,
  normalRadius,
  structurePlaneCoordinate,
  clamp
} from "./data.js";

function createNoiseTexture(size) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d", { alpha: false });
  const image = context.createImageData(size, size);

  let seed = 918273;
  function random() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  for (let i = 0; i < image.data.length; i += 4) {
    const value = Math.round(110 + (random() - 0.5) * 70);
    image.data[i] = value;
    image.data[i + 1] = value;
    image.data[i + 2] = value;
    image.data[i + 3] = 255;
  }

  context.putImageData(image, 0, 0);
  return canvas;
}

function roundedRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

export class RadiologyViewer {
  constructor(canvas, options) {
    this.canvas = canvas;
    this.options = options || {};
    this.context = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true
    }) || canvas.getContext("2d");
    this.interactive = this.options.interactive !== false;
    this.compact = Boolean(this.options.compact);
    this.fitScale = clamp(Number(this.options.fitScale) || 0.34, 0.26, 0.42);
    this.initialZoom = clamp(Number(this.options.initialZoom) || 0.88, 0.62, 2);
    this.minZoom = clamp(Number(this.options.minZoom) || 0.62, 0.5, 2);
    this.maxZoom = clamp(Number(this.options.maxZoom) || 3.6, 1, 5);
    this.pixelRatioCap = clamp(
      Number(this.options.pixelRatioCap) || (this.compact ? 1.1 : 1.5),
      1,
      2
    );
    this.noiseTexture = createNoiseTexture(this.compact ? 144 : 220);
    this.study = STUDIES[0];
    this.plane = "axial";
    this.sliceIndex = 60;
    this.selectedId = null;
    this.windowWidth = 400;
    this.windowLevel = 50;
    this.zoom = this.initialZoom;
    this.panX = 0;
    this.panY = 0;
    this.drag = null;
    this.hoveredId = null;
    this.projected = [];

    this.resizeObserver = new ResizeObserver(this.resize.bind(this));
    this.resizeObserver.observe(this.canvas.parentElement || this.canvas);

    if (this.interactive) {
      this.canvas.addEventListener("wheel", this.onWheel.bind(this), { passive: false });
      this.canvas.addEventListener("pointerdown", this.onPointerDown.bind(this));
      window.addEventListener("pointermove", this.onPointerMove.bind(this));
      window.addEventListener("pointerup", this.onPointerUp.bind(this));
    }

    this.resize();
  }

  setStudy(id) {
    const study = STUDIES.find(function (item) {
      return item.id === id;
    });

    if (!study) return;
    this.study = study;
    this.sliceIndex = clamp(this.sliceIndex, 0, study.slices - 1);
    this.draw();
  }

  setPlane(plane) {
    if (!PLANE_CONFIG[plane]) return;
    this.plane = plane;
    this.panX = 0;
    this.panY = 0;
    this.zoom = this.initialZoom;
    this.draw();
  }

  setSlice(index, silent) {
    const next = clamp(Math.round(Number(index) || 0), 0, this.study.slices - 1);
    if (next === this.sliceIndex && silent) return;
    this.sliceIndex = next;
    this.draw();

    if (!silent && typeof this.options.onSliceChange === "function") {
      this.options.onSliceChange(this.sliceIndex);
    }
  }

  setSelected(id) {
    const next = id || null;
    if (next === this.selectedId) return;
    this.selectedId = next;
    this.draw();
  }

  setWindow(width, level) {
    this.windowWidth = clamp(Number(width) || 400, 80, 1600);
    this.windowLevel = clamp(Number(level) || 50, -250, 500);
    this.draw();
  }

  setZoom(value) {
    this.zoom = clamp(Number(value) || this.initialZoom, this.minZoom, this.maxZoom);
    this.draw();
  }

  zoomBy(delta) {
    this.setZoom(this.zoom + delta);
  }

  resetView() {
    this.zoom = this.initialZoom;
    this.panX = 0;
    this.panY = 0;
    this.draw();
  }

  coordinate() {
    return coordinateForSlice(this.plane, this.sliceIndex, this.study.slices);
  }

  structuresOnSlice() {
    return structuresAtCoordinate(this.plane, this.coordinate());
  }

  resize() {
    const parent = this.canvas.parentElement || this.canvas;
    const width = Math.max(1, parent.clientWidth);
    const height = Math.max(1, parent.clientHeight);
    const ratio = Math.min(window.devicePixelRatio || 1, this.pixelRatioCap);

    this.canvas.width = Math.round(width * ratio);
    this.canvas.height = Math.round(height * ratio);
    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.context.imageSmoothingEnabled = true;
    if ("imageSmoothingQuality" in this.context) {
      this.context.imageSmoothingQuality = "high";
    }
    this.cssWidth = width;
    this.cssHeight = height;
    this.pixelRatio = ratio;
    this.draw();
  }

  huToGray(hu) {
    const low = this.windowLevel - this.windowWidth / 2;
    const high = this.windowLevel + this.windowWidth / 2;
    const normalized = clamp((hu - low) / Math.max(1, high - low), 0, 1);
    return Math.round(normalized * 255);
  }

  signalToGray(signal) {
    const contrast = clamp(500 / this.windowWidth, 0.4, 3);
    const brightness = clamp((this.windowLevel + 100) / 300, 0.1, 2);
    const normalized = clamp((signal - 0.5) * contrast + 0.5, 0, 1);
    return Math.round(clamp(normalized * brightness, 0, 1) * 255);
  }

  grayscale(value) {
    return "rgb(" + value + "," + value + "," + value + ")";
  }

  bodyDimensions(coordinate) {
    if (this.plane === "axial") {
      const taper = 1 - Math.min(0.34, Math.abs(coordinate) * 0.045);
      return [2.48 * taper, 1.48 * taper];
    }
    if (this.plane === "coronal") {
      const taper = 1 - Math.min(0.18, Math.abs(coordinate) * 0.055);
      return [2.48 * taper, 2.78];
    }
    const taper = 1 - Math.min(0.22, Math.abs(coordinate) * 0.05);
    return [1.47 * taper, 2.78];
  }

  planePoint(structure, factor) {
    if (this.plane === "axial") {
      return {
        x: structure.center[0],
        y: -structure.center[2],
        rx: structure.size[0] * factor,
        ry: structure.size[2] * factor
      };
    }

    if (this.plane === "coronal") {
      return {
        x: structure.center[0],
        y: -structure.center[1],
        rx: structure.size[0] * factor,
        ry: structure.size[1] * factor
      };
    }

    return {
      x: structure.center[2],
      y: -structure.center[1],
      rx: structure.size[2] * factor,
      ry: structure.size[1] * factor
    };
  }

  toCanvas(point, bodyWidth, bodyHeight, width, height) {
    const fit = Math.min(
      (width * this.fitScale) / Math.max(0.1, bodyWidth),
      (height * this.fitScale) / Math.max(0.1, bodyHeight)
    );

    return {
      x: width / 2 + point.x * fit,
      y: height / 2 + point.y * fit,
      rx: Math.max(2.2, point.rx * fit),
      ry: Math.max(2.2, point.ry * fit),
      fit: fit
    };
  }

  drawBone(context, width, height, bodyWidth, bodyHeight) {
    const coordinate = this.coordinate();
    const bone = this.study.modality === "CT"
      ? this.huToGray(760)
      : this.signalToGray(0.28);

    context.fillStyle = this.grayscale(bone);

    if (this.plane === "axial") {
      const point = this.toCanvas({
        x: 0.04,
        y: 1.02,
        rx: 0.30,
        ry: 0.23
      }, bodyWidth, bodyHeight, width, height);

      context.save();
      context.translate(point.x, point.y);
      context.scale(point.rx, point.ry);
      context.beginPath();
      context.arc(0, 0, 1, 0, Math.PI * 2);
      context.fill();
      context.restore();

      context.fillStyle = "rgba(16,18,20,.72)";
      context.beginPath();
      context.arc(point.x, point.y, Math.min(point.rx, point.ry) * 0.34, 0, Math.PI * 2);
      context.fill();

      if (Math.abs(coordinate) < 1.4) {
        context.strokeStyle = this.grayscale(Math.max(60, bone - 35));
        context.lineWidth = 3;
        [-1, 1].forEach(function (side) {
          context.beginPath();
          context.arc(
            width / 2 + side * point.fit * 1.72,
            height / 2 - point.fit * 0.05,
            point.fit * 0.68,
            side < 0 ? Math.PI * 0.82 : Math.PI * 0.18,
            side < 0 ? Math.PI * 1.18 : -Math.PI * 0.18,
            side > 0
          );
          context.stroke();
        });
      }
    } else if (this.plane === "coronal") {
      const point = this.toCanvas({
        x: 0.04,
        y: 0,
        rx: 0.20,
        ry: 2.08
      }, bodyWidth, bodyHeight, width, height);
      roundedRect(context, point.x - point.rx, point.y - point.ry, point.rx * 2, point.ry * 2, point.rx);
      context.fill();
    } else {
      const point = this.toCanvas({
        x: 1.02,
        y: 0,
        rx: 0.20,
        ry: 2.10
      }, bodyWidth, bodyHeight, width, height);
      roundedRect(context, point.x - point.rx, point.y - point.ry, point.rx * 2, point.ry * 2, point.rx);
      context.fill();
    }
  }

  drawStructure(context, structure, coordinate, width, height, bodyWidth, bodyHeight) {
    const radius = normalRadius(structure, this.plane);
    const center = structurePlaneCoordinate(structure, this.plane);
    const distance = Math.abs(coordinate - center);

    if (distance > radius * 1.07) return;

    const normalized = clamp(distance / Math.max(radius, 0.001), 0, 0.999);
    const factor = Math.max(0.12, Math.sqrt(1 - normalized * normalized));
    const projected = this.toCanvas(
      this.planePoint(structure, factor),
      bodyWidth,
      bodyHeight,
      width,
      height
    );

    let value;
    if (this.study.modality === "CT") {
      value = this.huToGray(structure.hu);
    } else {
      value = this.signalToGray(structure.mrSignal);
    }

    if (structure.id === "stomach") {
      value = this.study.modality === "CT"
        ? this.huToGray(18)
        : this.signalToGray(0.34);
    }

    context.save();
    context.translate(projected.x, projected.y);

    const rotation = structure.id === "stomach" ? -0.26 :
      (structure.id === "spleen" ? 0.20 : 0);

    context.rotate(rotation);

    const gradient = context.createRadialGradient(
      -projected.rx * 0.18,
      -projected.ry * 0.22,
      Math.min(projected.rx, projected.ry) * 0.08,
      0,
      0,
      Math.max(projected.rx, projected.ry)
    );

    const highlight = clamp(value + 18, 0, 255);
    const shadow = clamp(value - 18, 0, 255);
    gradient.addColorStop(0, this.grayscale(highlight));
    gradient.addColorStop(0.72, this.grayscale(value));
    gradient.addColorStop(1, this.grayscale(shadow));

    context.fillStyle = gradient;
    context.beginPath();
    context.ellipse(0, 0, projected.rx, projected.ry, 0, 0, Math.PI * 2);
    context.fill();

    context.lineWidth = 1;
    context.strokeStyle = "rgba(255,255,255,.055)";
    context.stroke();

    if (structure.id === "stomach") {
      context.fillStyle = this.study.modality === "CT"
        ? this.grayscale(this.huToGray(-820))
        : this.grayscale(this.signalToGray(0.08));
      context.beginPath();
      context.ellipse(
        projected.rx * 0.10,
        -projected.ry * 0.05,
        projected.rx * 0.48,
        projected.ry * 0.50,
        0,
        0,
        Math.PI * 2
      );
      context.fill();
    }

    context.restore();

    const item = {
      id: structure.id,
      x: projected.x,
      y: projected.y,
      rx: projected.rx,
      ry: projected.ry
    };
    this.projected.push(item);

    if (structure.id === this.selectedId) {
      context.save();
      context.strokeStyle = "rgba(111,211,255,.96)";
      context.lineWidth = 2.2;
      context.setLineDash([8, 5]);
      context.beginPath();
      context.ellipse(
        projected.x,
        projected.y,
        projected.rx + 4,
        projected.ry + 4,
        rotation,
        0,
        Math.PI * 2
      );
      context.stroke();
      context.setLineDash([]);

      const label = structure.name.toUpperCase();
      context.font = "700 10px Inter, system-ui, sans-serif";
      const textWidth = context.measureText(label).width;
      const labelX = clamp(projected.x - textWidth / 2 - 8, 10, width - textWidth - 26);
      const labelY = clamp(projected.y - projected.ry - 30, 14, height - 34);

      context.fillStyle = "rgba(4,12,18,.90)";
      context.strokeStyle = "rgba(111,211,255,.38)";
      context.lineWidth = 1;
      roundedRect(context, labelX, labelY, textWidth + 16, 22, 7);
      context.fill();
      context.stroke();

      context.fillStyle = "#bfeaff";
      context.fillText(label, labelX + 8, labelY + 15);
      context.restore();
    }
  }

  draw() {
    if (!this.context || !this.cssWidth || !this.cssHeight) return;

    const context = this.context;
    const width = this.cssWidth;
    const height = this.cssHeight;
    const coordinate = this.coordinate();
    const body = this.bodyDimensions(coordinate);
    const bodyWidth = body[0];
    const bodyHeight = body[1];

    context.save();
    context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#030507";
    context.fillRect(0, 0, width, height);

    context.translate(width / 2 + this.panX, height / 2 + this.panY);
    context.scale(this.zoom, this.zoom);
    context.translate(-width / 2, -height / 2);

    const bodyValue = this.study.modality === "CT"
      ? this.huToGray(28)
      : this.signalToGray(0.44);

    const bodyProjected = this.toCanvas(
      { x: 0, y: 0, rx: bodyWidth, ry: bodyHeight },
      bodyWidth,
      bodyHeight,
      width,
      height
    );

    const bodyGradient = context.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(bodyProjected.rx, bodyProjected.ry) * 0.08,
      width / 2,
      height / 2,
      Math.max(bodyProjected.rx, bodyProjected.ry)
    );

    bodyGradient.addColorStop(0, this.grayscale(clamp(bodyValue + 12, 0, 255)));
    bodyGradient.addColorStop(0.82, this.grayscale(bodyValue));
    bodyGradient.addColorStop(1, this.grayscale(clamp(bodyValue - 18, 0, 255)));

    context.fillStyle = bodyGradient;
    context.beginPath();
    context.ellipse(
      width / 2,
      height / 2,
      bodyProjected.rx,
      bodyProjected.ry,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    context.strokeStyle = "rgba(255,255,255,.12)";
    context.lineWidth = 1.2;
    context.stroke();

    if (!this.compact) {
      context.save();
      context.globalAlpha = this.study.modality === "CT" ? 0.065 : 0.05;
      context.globalCompositeOperation = "soft-light";
      context.drawImage(
        this.noiseTexture,
        width / 2 - bodyProjected.rx,
        height / 2 - bodyProjected.ry,
        bodyProjected.rx * 2,
        bodyProjected.ry * 2
      );
      context.restore();
    }

    this.drawBone(context, width, height, bodyWidth, bodyHeight);

    this.projected = [];
    STRUCTURES
      .slice()
      .sort(function (a, b) {
        if (a.kind === b.kind) return 0;
        return a.kind === "vessel" ? 1 : -1;
      })
      .forEach((structure) => {
        this.drawStructure(
          context,
          structure,
          coordinate,
          width,
          height,
          bodyWidth,
          bodyHeight
        );
      });

    context.restore();

    context.save();
    context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    this.drawCrosshair(context, width, height);
    context.restore();
  }

  drawCrosshair(context, width, height) {
    const cx = width / 2 + this.panX;
    const cy = height / 2 + this.panY;

    context.strokeStyle = "rgba(125,190,220,.12)";
    context.lineWidth = 1;
    context.setLineDash([3, 7]);

    context.beginPath();
    context.moveTo(cx, 10);
    context.lineTo(cx, height - 10);
    context.moveTo(10, cy);
    context.lineTo(width - 10, cy);
    context.stroke();
    context.setLineDash([]);

    if (!this.compact) {
      context.fillStyle = "rgba(187,219,234,.58)";
      context.font = "600 9px Inter, system-ui, sans-serif";
      context.fillText(
        this.study.modality + " · " + PLANE_CONFIG[this.plane].label.toUpperCase(),
        16,
        height - 17
      );
    }
  }

  pointInProjected(item, x, y) {
    const dx = (x - item.x) / Math.max(1, item.rx);
    const dy = (y - item.y) / Math.max(1, item.ry);
    return dx * dx + dy * dy <= 1;
  }

  canvasPoint(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - this.panX - rect.width / 2) / this.zoom + rect.width / 2;
    const y = (event.clientY - rect.top - this.panY - rect.height / 2) / this.zoom + rect.height / 2;
    return { x: x, y: y };
  }

  hitTest(event) {
    const point = this.canvasPoint(event);
    for (let i = this.projected.length - 1; i >= 0; i -= 1) {
      if (this.pointInProjected(this.projected[i], point.x, point.y)) {
        return this.projected[i].id;
      }
    }
    return null;
  }

  onWheel(event) {
    event.preventDefault();

    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      this.zoomBy(event.deltaY < 0 ? 0.18 : -0.18);
      if (typeof this.options.onZoomChange === "function") {
        this.options.onZoomChange(this.zoom);
      }
      return;
    }

    const step = event.deltaY > 0 ? 1 : -1;
    this.setSlice(this.sliceIndex + step);
  }

  onPointerDown(event) {
    if (event.button !== 0 && event.button !== 1) return;

    this.drag = {
      startX: event.clientX,
      startY: event.clientY,
      panX: this.panX,
      panY: this.panY,
      moved: false
    };

    this.canvas.setPointerCapture && this.canvas.setPointerCapture(event.pointerId);
  }

  onPointerMove(event) {
    if (this.drag) {
      const dx = event.clientX - this.drag.startX;
      const dy = event.clientY - this.drag.startY;
      if (Math.hypot(dx, dy) > 3) this.drag.moved = true;
      this.panX = this.drag.panX + dx;
      this.panY = this.drag.panY + dy;
      this.draw();
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right &&
      event.clientY >= rect.top && event.clientY <= rect.bottom;

    if (!inside) return;

    const id = this.hitTest(event);
    this.hoveredId = id;
    this.canvas.style.cursor = id ? "pointer" : "crosshair";

    if (typeof this.options.onHover === "function") {
      this.options.onHover(id, event);
    }
  }

  onPointerUp(event) {
    if (!this.drag) return;
    const moved = this.drag.moved;
    this.drag = null;

    if (!moved) {
      const id = this.hitTest(event);
      if (id && typeof this.options.onStructurePick === "function") {
        this.options.onStructurePick(id);
      }
    }
  }

  getState() {
    return {
      study: this.study,
      plane: this.plane,
      sliceIndex: this.sliceIndex,
      coordinate: this.coordinate(),
      structures: this.structuresOnSlice(),
      zoom: this.zoom
    };
  }
}
