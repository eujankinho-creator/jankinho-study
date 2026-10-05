import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { STRUCTURES, ANATOMY_BOUNDS, getStructure } from "./data.js";

const DEFAULT_CAMERA = Object.freeze({
  position: [8.4, 6.1, 9.8],
  target: [0, 0.05, 0]
});

function makeMaterial(structure) {
  return new THREE.MeshStandardMaterial({
    color: structure.color,
    roughness: structure.kind === "vessel" ? 0.42 : 0.68,
    metalness: 0.02,
    transparent: true,
    opacity: 0.92,
    emissive: new THREE.Color(structure.color).multiplyScalar(0.08),
    emissiveIntensity: 0.18,
    side: THREE.DoubleSide
  });
}

function organicGeometry(shape) {
  const geometry = new THREE.SphereGeometry(1, 32, 22);
  const position = geometry.attributes.position;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < position.count; i += 1) {
    vertex.fromBufferAttribute(position, i);
    let x = vertex.x;
    let y = vertex.y;
    let z = vertex.z;

    if (shape === "liver") {
      const top = Math.max(0, y);
      x *= 1 + 0.13 * top - 0.06 * z;
      z *= 0.92 + 0.08 * (1 - Math.abs(x));
      y = y > -0.52 ? y : -0.52 + (y + 0.52) * 0.35;
      x += 0.08 * (1 - y) * z;
    }

    if (shape === "stomach") {
      x += 0.22 * (0.35 - y) * (1 - Math.abs(z));
      z += 0.11 * Math.sin((y + 1) * Math.PI * 0.8);
      if (y > 0.45) x -= 0.12 * y;
    }

    if (shape === "kidney-right" || shape === "kidney-left") {
      const medialSign = shape === "kidney-right" ? 1 : -1;
      const medial = Math.max(0, x * medialSign);
      const waist = Math.exp(-Math.pow(y * 1.9, 2)) * Math.exp(-Math.pow(z * 1.7, 2));
      x -= medialSign * medial * waist * 0.36;
      z *= 0.92 + 0.08 * Math.abs(y);
    }

    if (shape === "pancreas") {
      y *= 0.86 + 0.10 * Math.cos(x * Math.PI);
      z *= 0.84 + 0.13 * Math.sin((x + 1) * Math.PI * 0.5);
      y += 0.07 * Math.sin(x * Math.PI);
      z += 0.06 * Math.sin(x * Math.PI * 1.3);
    }

    position.setXYZ(i, x, y, z);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function makeTube(points, radius, material, segments) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(function (point) {
      return new THREE.Vector3(point[0], point[1], point[2]);
    })
  );

  return new THREE.Mesh(
    new THREE.TubeGeometry(curve, segments || 28, radius, 9, false),
    material
  );
}

function makeVesselGroup(structure, material) {
  const group = new THREE.Group();

  if (structure.shape === "aorta") {
    const main = makeTube([
      [0.20, 1.95, -0.68],
      [0.20, 1.15, -0.67],
      [0.21, 0.35, -0.66],
      [0.20, -0.45, -0.68],
      [0.16, -1.50, -0.66]
    ], 0.17, material, 48);

    const leftIliac = makeTube([
      [0.16, -1.48, -0.66],
      [0.45, -1.80, -0.62],
      [0.72, -2.10, -0.55]
    ], 0.105, material, 20);

    const rightIliac = makeTube([
      [0.16, -1.48, -0.66],
      [-0.18, -1.80, -0.62],
      [-0.48, -2.10, -0.55]
    ], 0.105, material, 20);

    group.add(main, leftIliac, rightIliac);
  }

  if (structure.shape === "ivc") {
    const main = makeTube([
      [-0.24, 1.98, -0.59],
      [-0.24, 1.15, -0.60],
      [-0.25, 0.34, -0.60],
      [-0.22, -0.50, -0.59],
      [-0.18, -1.52, -0.57]
    ], 0.19, material, 48);

    const left = makeTube([
      [-0.18, -1.50, -0.57],
      [0.14, -1.80, -0.52],
      [0.42, -2.06, -0.48]
    ], 0.115, material, 20);

    const right = makeTube([
      [-0.18, -1.50, -0.57],
      [-0.52, -1.82, -0.53],
      [-0.76, -2.08, -0.47]
    ], 0.115, material, 20);

    group.add(main, left, right);
  }

  if (structure.shape === "portal") {
    const trunk = makeTube([
      [0.12, 0.14, -0.18],
      [-0.02, 0.30, -0.12],
      [-0.18, 0.48, -0.05],
      [-0.40, 0.61, 0.00]
    ], 0.13, material, 28);

    const rightBranch = makeTube([
      [-0.39, 0.61, 0.00],
      [-0.72, 0.72, 0.02],
      [-1.02, 0.78, 0.08]
    ], 0.085, material, 20);

    const leftBranch = makeTube([
      [-0.39, 0.61, 0.00],
      [-0.10, 0.73, 0.08],
      [0.16, 0.82, 0.12]
    ], 0.078, material, 20);

    group.add(trunk, rightBranch, leftBranch);
  }

  group.traverse(function (child) {
    if (child.isMesh) {
      child.userData.structureId = structure.id;
    }
  });

  return group;
}

function makeOrganGroup(structure, material) {
  const group = new THREE.Group();
  const mesh = new THREE.Mesh(organicGeometry(structure.shape), material);

  mesh.scale.set(structure.size[0], structure.size[1], structure.size[2]);
  mesh.rotation.set(
    structure.rotation[0],
    structure.rotation[1],
    structure.rotation[2]
  );
  mesh.position.set(
    structure.center[0],
    structure.center[1],
    structure.center[2]
  );
  mesh.userData.structureId = structure.id;
  group.add(mesh);

  if (structure.id === "stomach") {
    const lumen = new THREE.Mesh(
      new THREE.SphereGeometry(0.82, 24, 16),
      new THREE.MeshBasicMaterial({
        color: 0x2a2022,
        transparent: true,
        opacity: 0.34,
        side: THREE.BackSide
      })
    );
    lumen.scale.set(0.56, 0.74, 0.41);
    lumen.position.copy(mesh.position);
    lumen.rotation.copy(mesh.rotation);
    lumen.userData.structureId = structure.id;
    group.add(lumen);
  }

  return group;
}

function makeCutPlane() {
  const group = new THREE.Group();
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5.25, 5.25),
    new THREE.MeshBasicMaterial({
      color: 0x79cfff,
      transparent: true,
      opacity: 0.075,
      depthWrite: false,
      side: THREE.DoubleSide
    })
  );

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(plane.geometry),
    new THREE.LineBasicMaterial({
      color: 0x9cddff,
      transparent: true,
      opacity: 0.74
    })
  );

  group.add(plane, edges);
  group.renderOrder = 8;
  return group;
}

export class AnatomyViewer {
  constructor(canvas, options) {
    this.canvas = canvas;
    this.options = options || {};
    this.structureGroups = new Map();
    this.materials = new Map();
    this.pickables = [];
    this.selectedId = null;
    this.hoveredId = null;
    this.transparentMode = false;
    this.plane = "axial";
    this.sliceCoordinate = 0;
    this.pointerDown = null;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070b10);
    this.scene.fog = new THREE.Fog(0x070b10, 12, 26);

    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    this.camera.position.set.apply(this.camera.position, DEFAULT_CAMERA.position);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.enablePan = true;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance = 5.6;
    this.controls.maxDistance = 22;
    this.controls.target.set.apply(this.controls.target, DEFAULT_CAMERA.target);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.addLights();
    this.addContextGeometry();
    this.addStructures();

    this.cutPlane = makeCutPlane();
    this.scene.add(this.cutPlane);
    this.setPlane("axial", 0);

    this.resizeObserver = new ResizeObserver(this.resize.bind(this));
    this.resizeObserver.observe(this.canvas.parentElement || this.canvas);

    this.canvas.addEventListener("pointermove", this.onPointerMove.bind(this));
    this.canvas.addEventListener("pointerleave", this.onPointerLeave.bind(this));
    this.canvas.addEventListener("pointerdown", this.onPointerDown.bind(this));
    this.canvas.addEventListener("pointerup", this.onPointerUp.bind(this));

    this.lastFrame = 0;
    this.frameInterval = 1000 / 45;
    this._animate = this.animate.bind(this);

    this.resize();
    this.animate();
  }

  addLights() {
    const hemi = new THREE.HemisphereLight(0xc7e4ff, 0x181419, 1.9);
    this.scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(4, 7, 6);
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0x73b7ff, 1.5);
    rim.position.set(-5, 2, -5);
    this.scene.add(rim);

    const fill = new THREE.PointLight(0xff9d82, 0.7, 12);
    fill.position.set(-3, 0, 4);
    this.scene.add(fill);
  }

  addContextGeometry() {
    const torso = new THREE.Mesh(
      new THREE.SphereGeometry(1, 34, 24),
      new THREE.MeshPhysicalMaterial({
        color: 0x7d94a7,
        roughness: 0.36,
        transparent: true,
        opacity: 0.045,
        depthWrite: false,
        side: THREE.DoubleSide
      })
    );
    torso.scale.set(2.55, 2.92, 1.55);
    torso.position.y = 0.04;
    torso.renderOrder = -2;
    this.scene.add(torso);

    const bodyEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.SphereGeometry(1, 22, 16), 24),
      new THREE.LineBasicMaterial({
        color: 0x5d7183,
        transparent: true,
        opacity: 0.09
      })
    );
    bodyEdges.scale.copy(torso.scale);
    bodyEdges.position.copy(torso.position);
    this.scene.add(bodyEdges);

    const spineMaterial = new THREE.MeshStandardMaterial({
      color: 0xd9d3c3,
      roughness: 0.9,
      transparent: true,
      opacity: 0.32
    });

    for (let i = 0; i < 10; i += 1) {
      const vertebra = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22 - i * 0.004, 0.23 - i * 0.004, 0.22, 12),
        spineMaterial
      );
      vertebra.rotation.x = Math.PI / 2;
      vertebra.position.set(0.05, 1.25 - i * 0.32, -1.05 + Math.sin(i * 0.34) * 0.035);
      this.scene.add(vertebra);
    }

    const axis = new THREE.AxesHelper(0.78);
    axis.position.set(-2.15, -2.25, -1.20);
    axis.material.transparent = true;
    axis.material.opacity = 0.7;
    this.scene.add(axis);

    const floor = new THREE.GridHelper(7, 28, 0x23364a, 0x152230);
    floor.position.y = -2.83;
    floor.material.transparent = true;
    floor.material.opacity = 0.22;
    this.scene.add(floor);
  }

  addStructures() {
    STRUCTURES.forEach((structure) => {
      const material = makeMaterial(structure);
      const group = structure.kind === "vessel"
        ? makeVesselGroup(structure, material)
        : makeOrganGroup(structure, material);

      group.userData.structureId = structure.id;
      this.structureGroups.set(structure.id, group);
      this.materials.set(structure.id, material);
      group.traverse((child) => {
        if (child.isMesh) this.pickables.push(child);
      });
      this.scene.add(group);
    });
  }

  resize() {
    const parent = this.canvas.parentElement || this.canvas;
    const width = Math.max(1, parent.clientWidth);
    const height = Math.max(1, parent.clientHeight);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

    if (
      this.canvas.width !== Math.round(width * pixelRatio) ||
      this.canvas.height !== Math.round(height * pixelRatio)
    ) {
      this.renderer.setPixelRatio(pixelRatio);
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  animate(timestamp) {
    this.animationFrame = requestAnimationFrame(this._animate);

    if (document.hidden) return;

    const now = Number(timestamp) || performance.now();
    if (now - this.lastFrame < this.frameInterval) return;
    this.lastFrame = now;

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
    const intersections = this.raycaster.intersectObjects(this.pickables, false);

    for (let i = 0; i < intersections.length; i += 1) {
      const id = intersections[i].object.userData.structureId;
      const group = this.structureGroups.get(id);
      if (id && group && group.visible) {
        return { id: id, point: intersections[i].point };
      }
    }

    return null;
  }

  onPointerMove(event) {
    const hit = this.hitTest(event);
    const id = hit ? hit.id : null;

    if (this.hoveredId !== id) {
      this.hoveredId = id;
      this.refreshHighlights();
    }

    this.canvas.style.cursor = id ? "pointer" : "grab";

    if (typeof this.options.onHover === "function") {
      this.options.onHover(id ? getStructure(id) : null, event);
    }
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
    STRUCTURES.forEach((structure) => {
      const material = this.materials.get(structure.id);
      if (!material) return;

      const isSelected = structure.id === this.selectedId;
      const isHovered = structure.id === this.hoveredId;
      const baseOpacity = this.transparentMode ? 0.24 : 0.92;

      material.opacity = isSelected ? 0.96 : (isHovered ? Math.max(baseOpacity, 0.64) : baseOpacity);
      material.emissive.set(structure.color);
      material.emissiveIntensity = isSelected ? 0.72 : (isHovered ? 0.38 : 0.16);
      material.roughness = isSelected ? 0.48 : (structure.kind === "vessel" ? 0.42 : 0.68);
      material.needsUpdate = true;
    });
  }

  setTransparent(enabled) {
    this.transparentMode = Boolean(enabled);
    this.refreshHighlights();
  }

  setVisibility(id, visible) {
    const group = this.structureGroups.get(id);
    if (!group) return;
    group.visible = Boolean(visible);

    if (!visible && this.hoveredId === id) this.hoveredId = null;
    if (!visible && this.selectedId === id) {
      this.selectedId = null;
      if (typeof this.options.onSelect === "function") {
        this.options.onSelect(null);
      }
    }

    this.refreshHighlights();
  }

  focusStructure(id) {
    const group = this.structureGroups.get(id);
    if (!group) return;

    const box = new THREE.Box3().setFromObject(group);
    if (box.isEmpty()) return;

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const radius = Math.max(size.x, size.y, size.z, 0.9);
    const direction = new THREE.Vector3(1.15, 0.8, 1.3).normalize();

    this.controls.target.copy(center);
    this.camera.position.copy(center.clone().add(direction.multiplyScalar(radius * 5.0)));
    this.controls.update();
  }

  reset() {
    this.camera.position.set.apply(this.camera.position, DEFAULT_CAMERA.position);
    this.controls.target.set.apply(this.controls.target, DEFAULT_CAMERA.target);
    this.controls.reset();
    this.camera.position.set.apply(this.camera.position, DEFAULT_CAMERA.position);
    this.controls.target.set.apply(this.controls.target, DEFAULT_CAMERA.target);
    this.controls.update();
  }

  setPlane(plane, coordinate) {
    this.plane = plane;
    this.sliceCoordinate = Number(coordinate) || 0;

    const planeGroup = this.cutPlane;
    planeGroup.rotation.set(0, 0, 0);
    planeGroup.position.set(0, 0, 0);
    planeGroup.scale.set(1, 1, 1);

    if (plane === "axial") {
      planeGroup.rotation.x = Math.PI / 2;
      planeGroup.position.y = this.sliceCoordinate;
      planeGroup.scale.set(1.0, 0.72, 1);
    } else if (plane === "sagittal") {
      planeGroup.rotation.y = Math.PI / 2;
      planeGroup.position.x = this.sliceCoordinate;
      planeGroup.scale.set(1.0, 1.1, 1);
    } else {
      planeGroup.position.z = this.sliceCoordinate;
      planeGroup.scale.set(1.0, 1.1, 1);
    }
  }

  setPlaneVisible(visible) {
    this.cutPlane.visible = Boolean(visible);
  }

  getSelectedStructure() {
    return this.selectedId ? getStructure(this.selectedId) : null;
  }

  dispose() {
    cancelAnimationFrame(this.animationFrame);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    this.controls.dispose();
    this.renderer.dispose();

    this.scene.traverse(function (object) {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach(function (material) {
          if (material && material.dispose) material.dispose();
        });
      }
    });
  }
}
