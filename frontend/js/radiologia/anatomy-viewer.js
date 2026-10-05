import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import {
  ANATOMY_ASSET_BASE,
  SYSTEMS,
  STRUCTURES,
  PLANE_CONFIG,
  getStructure,
  structureMatchesObject,
  clamp
} from "./data.js";

const DEFAULT_BG = 0x070b10;

function cloneMaterial(material) {
  const cloned = material.clone();
  cloned.transparent = true;
  cloned.depthWrite = material.depthWrite !== false;
  cloned.side = THREE.DoubleSide;
  return cloned;
}

function objectPath(object) {
  const names = [];
  let current = object;
  while (current) {
    if (current.name) names.push(current.name);
    current = current.parent;
  }
  return names.join(" ");
}

function hexColor(value) {
  return new THREE.Color(value);
}

export class AnatomyViewer {
  constructor(canvas, options) {
    this.canvas = canvas;
    this.options = options || {};
    this.loader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath("/vendor/three/addons/libs/draco/gltf/");
    this.loader.setDRACOLoader(this.dracoLoader);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(DEFAULT_BG);
    this.scene.fog = new THREE.Fog(DEFAULT_BG, 2.4, 8.8);

    this.camera = new THREE.PerspectiveCamera(32, 1, 0.001, 1000);
    this.camera.position.set(1.8, 1.1, 3.2);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.localClippingEnabled = true;
    const deviceRatio = window.devicePixelRatio || 1;
    const hardwareThreads = Number(navigator.hardwareConcurrency || 8);
    const maxPixelRatio = hardwareThreads <= 4 ? 1.12 : 1.35;
    this.renderer.setPixelRatio(Math.min(deviceRatio, maxPixelRatio));

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance = 0.12;
    this.controls.maxDistance = 12;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.systemGroups = new Map();
    this.structureMeshes = new Map();
    this.pickables = [];
    this.materialState = new WeakMap();
    this.systemState = new Map();

    this.selectedId = null;
    this.hoveredId = null;
    this.transparentMode = false;
    this.clippingEnabled = false;
    this.planeVisible = true;
    this.plane = "axial";
    this.crosshairFrac = [0.5, 0.5, 0.5];
    this.bodyBounds = new THREE.Box3();
    this.bodyBoundsValid = false;
    this.pointerDown = null;
    this.hoverRaf = 0;
    this.pendingPointer = null;
    this.animationFrame = 0;
    this.lastRenderAt = 0;
    this.targetFrameMs = 1000 / 45;
    this.isViewportVisible = true;

    this.addLights();
    this.addReferenceFloor();
    this.createCutPlane();
    this.createSelectionMarker();

    this.resizeObserver = new ResizeObserver(this.resize.bind(this));
    this.resizeObserver.observe(this.canvas.parentElement || this.canvas);

    if (typeof IntersectionObserver !== "undefined") {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        this.isViewportVisible = entries.some((entry) => entry.isIntersecting);
      }, { threshold: 0.01 });
      this.intersectionObserver.observe(this.canvas);
    }

    this.canvas.addEventListener("pointermove", this.onPointerMove.bind(this));
    this.canvas.addEventListener("pointerleave", this.onPointerLeave.bind(this));
    this.canvas.addEventListener("pointerdown", this.onPointerDown.bind(this));
    this.canvas.addEventListener("pointerup", this.onPointerUp.bind(this));
    this.canvas.addEventListener("dblclick", this.reset.bind(this));

    this.resize();
    this.animate();

    this.ready = this.loadAssets();
  }

  addLights() {
    const hemisphere = new THREE.HemisphereLight(0xe7f5ff, 0x11151b, 2.25);
    this.scene.add(hemisphere);

    const key = new THREE.DirectionalLight(0xffffff, 3.1);
    key.position.set(3.2, 5.4, 4.2);
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0x86bdff, 1.4);
    fill.position.set(-4.0, 1.3, -2.8);
    this.scene.add(fill);

    const warm = new THREE.DirectionalLight(0xffb79d, 0.72);
    warm.position.set(1.2, -2.0, 3.5);
    this.scene.add(warm);
  }

  addReferenceFloor() {
    this.floor = new THREE.GridHelper(2.2, 22, 0x2b455c, 0x142433);
    this.floor.material.transparent = true;
    this.floor.material.opacity = 0.18;
    this.floor.visible = false;
    this.scene.add(this.floor);
  }

  createCutPlane() {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x70cfff,
      transparent: true,
      opacity: 0.085,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    this.cutPlaneMesh = new THREE.Mesh(geometry, material);
    this.cutPlaneMesh.renderOrder = 30;

    const border = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      new THREE.LineBasicMaterial({
        color: 0x9ce0ff,
        transparent: true,
        opacity: 0.70
      })
    );
    border.renderOrder = 31;
    this.cutPlaneMesh.add(border);
    this.scene.add(this.cutPlaneMesh);

    this.clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
  }

  createSelectionMarker() {
    const markerCanvas = document.createElement("canvas");
    markerCanvas.width = 96;
    markerCanvas.height = 96;
    const context = markerCanvas.getContext("2d");

    if (context) {
      const gradient = context.createRadialGradient(48, 48, 4, 48, 48, 46);
      gradient.addColorStop(0, "rgba(255,255,255,.95)");
      gradient.addColorStop(.12, "rgba(114,210,255,.92)");
      gradient.addColorStop(.28, "rgba(114,210,255,.18)");
      gradient.addColorStop(.64, "rgba(114,210,255,.05)");
      gradient.addColorStop(1, "rgba(114,210,255,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 96, 96);

      context.strokeStyle = "rgba(226,247,255,.95)";
      context.lineWidth = 3;
      context.beginPath();
      context.arc(48, 48, 18, 0, Math.PI * 2);
      context.stroke();

      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(48, 18);
      context.lineTo(48, 34);
      context.moveTo(48, 62);
      context.lineTo(48, 78);
      context.moveTo(18, 48);
      context.lineTo(34, 48);
      context.moveTo(62, 48);
      context.lineTo(78, 48);
      context.stroke();
    }

    const texture = new THREE.CanvasTexture(markerCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.SpriteMaterial({
      map: texture,
      color: 0xffffff,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      opacity: 0.96
    });

    this.selectionMarker = new THREE.Sprite(material);
    this.selectionMarker.visible = false;
    this.selectionMarker.renderOrder = 80;
    this.scene.add(this.selectionMarker);
  }

  setSelectionMarkerFraction(frac, color) {
    if (!this.selectionMarker || !this.bodyBoundsValid) return;
    if (!Array.isArray(frac) || frac.length < 3) {
      this.selectionMarker.visible = false;
      return;
    }

    const size = this.bodyBounds.getSize(new THREE.Vector3());
    const markerSize = Math.max(size.x, size.y, size.z) * 0.055;

    this.selectionMarker.position.set(
      this.axisCoordinate("x", clamp(Number(frac[0]) || 0, 0, 1)),
      this.axisCoordinate("y", clamp(Number(frac[2]) || 0, 0, 1)),
      this.axisCoordinate("z", clamp(Number(frac[1]) || 0, 0, 1))
    );
    this.selectionMarker.scale.setScalar(markerSize);

    if (color) {
      this.selectionMarker.material.color.set(color);
    }
    else {
      this.selectionMarker.material.color.set("#72d2ff");
    }

    this.selectionMarker.visible = true;
  }

  hideSelectionMarker() {
    if (this.selectionMarker) {
      this.selectionMarker.visible = false;
    }
  }

  async loadAssets() {
    const settled = await Promise.allSettled(
      SYSTEMS.map((system) => this.loadSystem(system))
    );

    const failures = [];
    settled.forEach(function (result, index) {
      if (result.status === "rejected") {
        failures.push({
          system: SYSTEMS[index].id,
          error: String(result.reason && result.reason.message || result.reason)
        });
      }
    });

    this.rebuildBounds();
    this.rebuildStructureIndex();
    this.applySystemStyles();
    this.frameBody();
    this.updateCutPlane();
    this.refreshHighlights();

    const report = {
      systemsLoaded: Array.from(this.systemGroups.keys()),
      failures,
      structures: STRUCTURES.map((structure) => ({
        id: structure.id,
        meshCount: (this.structureMeshes.get(structure.id) || []).length
      }))
    };

    if (typeof this.options.onReady === "function") {
      this.options.onReady(report);
    }

    return report;
  }

  loadSystem(system) {
    return new Promise((resolve, reject) => {
      const url = ANATOMY_ASSET_BASE + "/" + system.file;
      this.loader.load(
        url,
        (gltf) => {
          const group = gltf.scene || gltf.scenes[0];
          if (!group) {
            reject(new Error("GLB sem cena: " + system.file));
            return;
          }

          group.name = "hra-system-" + system.id;
          group.userData.systemId = system.id;

          group.traverse((object) => {
            if (!object.isMesh) return;

            object.frustumCulled = true;
            object.castShadow = false;
            object.receiveShadow = false;
            object.userData.systemId = system.id;
            object.userData.objectPath = objectPath(object);

            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];

            const cloned = materials.map((material) => {
              const next = cloneMaterial(material);
              this.materialState.set(next, {
                color: next.color ? next.color.clone() : null,
                emissive: next.emissive ? next.emissive.clone() : null,
                emissiveIntensity:
                  typeof next.emissiveIntensity === "number"
                    ? next.emissiveIntensity
                    : 0,
                opacity: next.opacity,
                depthWrite: next.depthWrite,
                roughness:
                  typeof next.roughness === "number"
                    ? next.roughness
                    : null
              });
              return next;
            });

            object.material = Array.isArray(object.material) ? cloned : cloned[0];
            this.pickables.push(object);
          });

          this.systemGroups.set(system.id, group);
          this.systemState.set(system.id, {
            visible: system.defaultVisible,
            opacity: system.opacity
          });
          group.visible = system.defaultVisible;
          this.scene.add(group);
          resolve(group);
        },
        undefined,
        (error) => reject(error || new Error("Falha ao carregar " + system.file))
      );
    });
  }

  rebuildBounds() {
    this.bodyBounds.makeEmpty();

    const preferred = this.systemGroups.get("integumentary");
    if (preferred) {
      this.bodyBounds.setFromObject(preferred);
    }

    if (this.bodyBounds.isEmpty()) {
      this.systemGroups.forEach((group) => {
        const box = new THREE.Box3().setFromObject(group);
        if (!box.isEmpty()) this.bodyBounds.union(box);
      });
    }

    this.bodyBoundsValid = !this.bodyBounds.isEmpty();
  }

  rebuildStructureIndex() {
    this.structureMeshes.clear();
    STRUCTURES.forEach((structure) => {
      this.structureMeshes.set(structure.id, []);
    });

    this.pickables.forEach((mesh) => {
      const systemId = mesh.userData.systemId;
      const path = mesh.userData.objectPath || objectPath(mesh);
      let assigned = null;

      for (const structure of STRUCTURES) {
        if (structureMatchesObject(structure, systemId, path)) {
          assigned = structure;
          break;
        }
      }

      if (assigned) {
        mesh.userData.structureId = assigned.id;
        this.structureMeshes.get(assigned.id).push(mesh);
      }
    });
  }

  materialsForMesh(mesh) {
    return Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  }

  restoreMaterial(material) {
    const saved = this.materialState.get(material);
    if (!saved) return;

    if (saved.color && material.color) material.color.copy(saved.color);
    if (saved.emissive && material.emissive) {
      material.emissive.copy(saved.emissive);
    }
    if (typeof material.emissiveIntensity === "number") {
      material.emissiveIntensity = saved.emissiveIntensity;
    }
    material.opacity = saved.opacity;
    material.depthWrite = saved.depthWrite;
    if (saved.roughness !== null && typeof material.roughness === "number") {
      material.roughness = saved.roughness;
    }
  }

  applySystemStyles() {
    SYSTEMS.forEach((system) => {
      const group = this.systemGroups.get(system.id);
      if (!group) return;

      group.visible = this.systemState.get(system.id)?.visible !== false;

      group.traverse((object) => {
        if (!object.isMesh) return;

        this.materialsForMesh(object).forEach((material) => {
          const saved = this.materialState.get(material);
          if (!saved) return;

          let opacity = system.opacity;
          if (system.id === "integumentary") {
            opacity = 0.075;
            material.depthWrite = false;
          }
          else if (system.id === "skeletal") {
            opacity = Math.max(Number(system.opacity) || 0.58, 0.58);
            if (material.color) {
              material.color.lerp(new THREE.Color(0xe7ddc5), 0.56);
            }
          }
          else if (system.id === "cardiovascular") {
            opacity = 0.82;
          }

          material.transparent = opacity < 0.999;
          material.opacity = opacity;
          material.needsUpdate = true;
        });
      });
    });
  }

  resize() {
    const parent = this.canvas.parentElement || this.canvas;
    const width = Math.max(1, parent.clientWidth);
    const height = Math.max(1, parent.clientHeight);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  animate(now = 0) {
    this.animationFrame = requestAnimationFrame(this.animate.bind(this));

    if (document.hidden || !this.isViewportVisible) return;
    if (now - this.lastRenderAt < this.targetFrameMs) return;

    this.lastRenderAt = now;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  pointerToNdc(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  hitTest(event) {
    this.pointerToNdc(event);
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const hits = this.raycaster.intersectObjects(this.pickables, false);
    for (const hit of hits) {
      const mesh = hit.object;
      if (!mesh.visible) continue;

      const system = this.systemGroups.get(mesh.userData.systemId);
      if (!system || !system.visible) continue;

      const id = mesh.userData.structureId || null;
      if (id) return { id, point: hit.point, mesh };
    }

    return null;
  }

  onPointerMove(event) {
    this.pendingPointer = {
      clientX: event.clientX,
      clientY: event.clientY
    };

    if (this.hoverRaf) return;

    this.hoverRaf = requestAnimationFrame(() => {
      this.hoverRaf = 0;
      const pointerEvent = this.pendingPointer;
      this.pendingPointer = null;
      if (!pointerEvent) return;

      const hit = this.hitTest(pointerEvent);
      const next = hit ? hit.id : null;

      if (next !== this.hoveredId) {
        this.hoveredId = next;
        this.refreshHighlights();
      }

      this.canvas.style.cursor = next ? "pointer" : "grab";

      if (typeof this.options.onHover === "function") {
        this.options.onHover(
          next ? getStructure(next) : null,
          pointerEvent
        );
      }
    });
  }

  onPointerLeave() {
    this.hoveredId = null;
    this.refreshHighlights();
    this.canvas.style.cursor = "grab";

    if (typeof this.options.onHover === "function") {
      this.options.onHover(null, null);
    }
  }

  onPointerDown(event) {
    this.pointerDown = {
      x: event.clientX,
      y: event.clientY,
      button: event.button
    };
  }

  onPointerUp(event) {
    if (!this.pointerDown || this.pointerDown.button !== 0) return;

    const distance = Math.hypot(
      event.clientX - this.pointerDown.x,
      event.clientY - this.pointerDown.y
    );
    this.pointerDown = null;

    if (distance > 6) return;

    const hit = this.hitTest(event);
    if (!hit) return;

    this.selectStructure(hit.id);
    if (typeof this.options.onSelect === "function") {
      this.options.onSelect(hit.id);
    }
  }

  selectStructure(id) {
    this.selectedId = id || null;
    this.refreshHighlights();
  }

  refreshHighlights() {
    const selected = this.selectedId;
    const hovered = this.hoveredId;

    SYSTEMS.forEach((system) => {
      const group = this.systemGroups.get(system.id);
      if (!group) return;

      group.traverse((object) => {
        if (!object.isMesh) return;

        const structureId = object.userData.structureId || null;
        const isSelected = structureId && structureId === selected;
        const isHovered = structureId && structureId === hovered;
        const structure = structureId ? getStructure(structureId) : null;

        this.materialsForMesh(object).forEach((material) => {
          this.restoreMaterial(material);

          let baseOpacity = system.opacity;
          if (system.id === "integumentary") baseOpacity = 0.075;
          if (system.id === "skeletal") baseOpacity = Math.max(Number(system.opacity) || 0.58, 0.58);

          /*
           * Os GLBs femininos preservam a geometria HRA real, mas o pacote
           * web remove os materiais de origem. A cor aqui é apenas uma camada
           * didática de leitura — nunca substitui nem inventa a geometria.
           */
          if (material.color) {
            const path = object.userData.objectPath || "";

            if (structure) {
              material.color.lerp(hexColor(structure.color), 0.66);
            }
            else if (system.id === "skeletal") {
              material.color.lerp(new THREE.Color(0xe4d6b8), 0.78);
            }
            else if (system.id === "integumentary") {
              material.color.lerp(new THREE.Color(0xc99d86), 0.46);
            }
            else if (system.id === "cardiovascular") {
              if (/vein|vena|cava|portal/i.test(path)) {
                material.color.lerp(new THREE.Color(0x557bc4), 0.72);
              }
              else if (/arter|aorta|trunk/i.test(path)) {
                material.color.lerp(new THREE.Color(0xd45d66), 0.72);
              }
              else {
                material.color.lerp(new THREE.Color(0xc96b75), 0.48);
              }
            }
            else if (system.id === "digestive") {
              material.color.lerp(new THREE.Color(0xb77a62), 0.36);
            }
            else if (system.id === "renal") {
              material.color.lerp(new THREE.Color(0xaa665d), 0.44);
            }
            else if (system.id === "lymphatic") {
              material.color.lerp(new THREE.Color(0x86506d), 0.48);
            }
            else if (system.id === "reproductive") {
              material.color.lerp(new THREE.Color(0xb87893), 0.40);
            }
          }

          if (this.transparentMode && !isSelected) {
            baseOpacity *= system.id === "integumentary" ? 0.38 : 0.28;
          }
          else if (selected && structureId && !isSelected) {
            baseOpacity *= 0.48;
          }

          if (isHovered) baseOpacity = Math.max(baseOpacity, 0.76);
          if (isSelected) baseOpacity = 0.96;

          if (isSelected || isHovered) {
            const accent = hexColor(structure?.color || "#72d2ff");
            if (material.color) {
              material.color.lerp(accent, isSelected ? 0.62 : 0.36);
            }
            if (material.emissive) {
              material.emissive.copy(accent);
              material.emissiveIntensity = isSelected ? 0.56 : 0.22;
            }
            if (typeof material.roughness === "number") {
              material.roughness = Math.min(material.roughness, 0.55);
            }
          }

          material.opacity = clamp(baseOpacity, 0.015, 1);
          material.transparent = material.opacity < 0.999;
          material.depthWrite =
            system.id !== "integumentary" && material.opacity > 0.22;

          material.clippingPlanes = this.clippingEnabled
            ? [this.clippingPlane]
            : [];
          material.clipShadows = false;
          material.needsUpdate = true;
        });
      });
    });
  }

  setTransparent(enabled) {
    this.transparentMode = Boolean(enabled);
    this.refreshHighlights();
  }

  selectLabel(label) {
    const structure = STRUCTURES.find(function (item) {
      return item.label === Math.round(Number(label) || 0);
    });
    this.selectStructure(structure ? structure.id : null);
  }

  focusSelected() {
    if (this.selectedId) {
      this.focusStructure(this.selectedId);
      return;
    }
    this.frameBody();
  }

  setCrosshairVisible(visible) {
    this.setPlaneVisible(visible);
  }

  setClipPlane(enabled) {
    this.setClippingEnabled(enabled);
  }

  setSystemVisibility(systemId, visible) {
    const group = this.systemGroups.get(systemId);
    if (!group) return;
    group.visible = Boolean(visible);

    const state = this.systemState.get(systemId) || {};
    state.visible = Boolean(visible);
    this.systemState.set(systemId, state);
  }

  setCategoryVisibility(category, visible) {
    SYSTEMS.filter(function (system) {
      return system.category === category;
    }).forEach((system) => {
      this.setSystemVisibility(system.id, visible);
    });
  }

  setStructureVisibility(id, visible) {
    const meshes = this.structureMeshes.get(id) || [];
    meshes.forEach(function (mesh) {
      mesh.visible = Boolean(visible);
    });

    if (!visible && this.selectedId === id) {
      this.selectStructure(null);
      if (typeof this.options.onSelect === "function") {
        this.options.onSelect(null);
      }
    }
  }

  structureBox(id) {
    const meshes = this.structureMeshes.get(id) || [];
    const box = new THREE.Box3();
    box.makeEmpty();

    meshes.forEach(function (mesh) {
      mesh.updateWorldMatrix(true, false);
      const meshBox = new THREE.Box3().setFromObject(mesh);
      if (!meshBox.isEmpty()) box.union(meshBox);
    });

    return box;
  }

  focusStructure(id) {
    const box = this.structureBox(id);
    if (box.isEmpty()) return;

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const diagonal = Math.max(size.length(), 0.04);
    const direction = new THREE.Vector3(1.0, 0.55, 1.2).normalize();

    this.controls.target.copy(center);
    this.camera.position.copy(
      center.clone().add(direction.multiplyScalar(diagonal * 2.55))
    );
    this.camera.near = Math.max(0.001, diagonal / 300);
    this.camera.far = Math.max(10, diagonal * 30);
    this.camera.updateProjectionMatrix();
    this.controls.update();
  }

  frameBody() {
    if (!this.bodyBoundsValid) return;

    const center = this.bodyBounds.getCenter(new THREE.Vector3());
    const size = this.bodyBounds.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = THREE.MathUtils.degToRad(this.camera.fov);
    const distance = maxDim / (2 * Math.tan(fov / 2)) * 1.28;

    this.controls.target.copy(center);
    this.camera.position.set(
      center.x + maxDim * 0.20,
      center.y + maxDim * 0.025,
      center.z + distance
    );
    this.camera.near = Math.max(maxDim / 10000, 0.001);
    this.camera.far = Math.max(distance * 12, maxDim * 20);
    this.camera.updateProjectionMatrix();
    this.controls.minDistance = Math.max(maxDim * 0.22, 0.02);
    this.controls.maxDistance = Math.max(maxDim * 4.8, 4);
    this.controls.update();

    this.floor.position.set(
      center.x,
      this.bodyBounds.min.y - size.y * 0.025,
      center.z
    );
    this.floor.scale.setScalar(Math.max(1, maxDim / 2));
  }

  reset() {
    this.frameBody();
  }

  axisCoordinate(axis, frac) {
    if (!this.bodyBoundsValid) return 0;

    const min = this.bodyBounds.min[axis];
    const max = this.bodyBounds.max[axis];
    return THREE.MathUtils.lerp(min, max, clamp(frac, 0, 1));
  }

  setCrosshairFraction(frac) {
    if (!Array.isArray(frac) || frac.length < 3) return;

    this.crosshairFrac = [
      clamp(Number(frac[0]) || 0, 0, 1),
      clamp(Number(frac[1]) || 0, 0, 1),
      clamp(Number(frac[2]) || 0, 0, 1)
    ];

    this.updateCutPlane();
  }

  setPlane(plane, fraction) {
    if (!PLANE_CONFIG[plane]) return;
    this.plane = plane;

    if (typeof fraction === "number") {
      const axis = PLANE_CONFIG[plane].fracAxis;
      const next = this.crosshairFrac.slice();
      next[axis] = clamp(fraction, 0, 1);
      this.crosshairFrac = next;
    }

    this.updateCutPlane();
  }

  updateCutPlane() {
    if (!this.bodyBoundsValid || !this.cutPlaneMesh) return;

    const size = this.bodyBounds.getSize(new THREE.Vector3());
    const center = this.bodyBounds.getCenter(new THREE.Vector3());
    const config = PLANE_CONFIG[this.plane];
    const frac = this.crosshairFrac[config.fracAxis];

    this.cutPlaneMesh.rotation.set(0, 0, 0);
    this.cutPlaneMesh.position.copy(center);

    if (this.plane === "axial") {
      const y = this.axisCoordinate("y", frac);
      this.cutPlaneMesh.rotation.x = Math.PI / 2;
      this.cutPlaneMesh.position.y = y;
      this.cutPlaneMesh.scale.set(size.x * 1.06, size.z * 1.06, 1);
      this.clippingPlane.set(new THREE.Vector3(0, -1, 0), y);
    }
    else if (this.plane === "coronal") {
      const z = this.axisCoordinate("z", frac);
      this.cutPlaneMesh.position.z = z;
      this.cutPlaneMesh.scale.set(size.x * 1.06, size.y * 1.06, 1);
      this.clippingPlane.set(new THREE.Vector3(0, 0, -1), z);
    }
    else {
      const x = this.axisCoordinate("x", frac);
      this.cutPlaneMesh.rotation.y = Math.PI / 2;
      this.cutPlaneMesh.position.x = x;
      this.cutPlaneMesh.scale.set(size.z * 1.06, size.y * 1.06, 1);
      this.clippingPlane.set(new THREE.Vector3(-1, 0, 0), x);
    }

    this.cutPlaneMesh.visible = this.planeVisible;
    this.refreshHighlights();
  }

  setPlaneVisible(visible) {
    this.planeVisible = Boolean(visible);
    this.cutPlaneMesh.visible = this.planeVisible;
  }

  setClippingEnabled(enabled) {
    this.clippingEnabled = Boolean(enabled);
    this.refreshHighlights();
  }

  fractionBoundsForStructure(id) {
    if (!this.bodyBoundsValid) return null;

    const box = this.structureBox(id);
    if (box.isEmpty()) return null;

    const size = this.bodyBounds.getSize(new THREE.Vector3());
    const toFrac = (value, min, span) => {
      if (span <= 0) return 0.5;
      return clamp((value - min) / span, 0, 1);
    };

    return {
      min: [
        toFrac(box.min.x, this.bodyBounds.min.x, size.x),
        toFrac(box.min.y, this.bodyBounds.min.y, size.y),
        toFrac(box.min.z, this.bodyBounds.min.z, size.z)
      ],
      max: [
        toFrac(box.max.x, this.bodyBounds.min.x, size.x),
        toFrac(box.max.y, this.bodyBounds.min.y, size.y),
        toFrac(box.max.z, this.bodyBounds.min.z, size.z)
      ]
    };
  }

  structuresAtFraction(plane, fraction) {
    const config = PLANE_CONFIG[plane];
    const axis = config.fracAxis;
    const f = clamp(fraction, 0, 1);

    return STRUCTURES.filter((structure) => {
      const bounds = this.fractionBoundsForStructure(structure.id);
      if (!bounds) return false;
      return f >= bounds.min[axis] - 0.008 && f <= bounds.max[axis] + 0.008;
    });
  }

  getCoverage() {
    return STRUCTURES.map((structure) => ({
      id: structure.id,
      name: structure.name,
      meshCount: (this.structureMeshes.get(structure.id) || []).length
    }));
  }

  dispose() {
    cancelAnimationFrame(this.animationFrame);
    cancelAnimationFrame(this.hoverRaf);
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.controls.dispose();
    this.renderer.dispose();

    this.scene.traverse(function (object) {
      if (object.geometry) object.geometry.dispose();
      const materials = object.material
        ? (Array.isArray(object.material) ? object.material : [object.material])
        : [];
      materials.forEach(function (material) {
        material.dispose?.();
      });
    });
  }
}
