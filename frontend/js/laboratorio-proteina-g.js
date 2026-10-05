import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { STRUCTURES, PATHWAYS, STEPS, STUDY_TASKS } from "./gprotein/data.js?v=20261005-gprotein-lab3";

const $ = (id) => document.getElementById(id);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const STATE = {
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  host: null,
  molecularRoot: null,
  cellGroup: null,
  membraneGroup: null,
  educationGroup: null,
  structureObjects: new Map(),
  selectable: [],
  raycaster: new THREE.Raycaster(),
  pointer: new THREE.Vector2(),
  stepIndex: 0,
  mode: "guided",
  representation: "cartoon",
  playing: false,
  playTimer: null,
  speed: 1,
  selectedId: null,
  studyIndex: 0,
  cameraTween: null,
  reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
  pdbManifest: null,
  loaded: false,
  renderClock: new THREE.Clock(),
  baseTransforms: new Map(),
  visualTweens: [],
  materialDefaults: new WeakMap()
};

const CHAIN_MAP = {
  R: { id: "gpcr", color: 0x74a7ff, radius: 0.18 },
  A: { id: "galpha", color: 0xff8d72, radius: 0.22 },
  B: { id: "gbeta", color: 0xb593ff, radius: 0.22 },
  G: { id: "ggamma", color: 0x62d5b1, radius: 0.16 }
};

const ELEMENT_COLORS = {
  C: 0x8b95a7,
  N: 0x4b83ff,
  O: 0xff5f70,
  S: 0xf5cf65,
  P: 0xff9c4a,
  H: 0xf4f7fb
};

const CELL_CENTER = new THREE.Vector3(-3, -2, 0);
const MEMBRANE_ANCHOR = new THREE.Vector3(-3, 7.05, 0);

const CAMERA_PRESETS = {
  cell: { position: [16, 10, 18], target: [-3, -1, 0], fov: 42, label: "Nível celular" },
  membrane: { position: [7.6, 11.3, 10.5], target: [-3, 7.05, 0], fov: 38, label: "Nível subcelular" },
  receptor: { position: [2.2, 10.0, 6.6], target: [-3, 7.0, 0], fov: 34, label: "Nível molecular" },
  complex: { position: [3.8, 8.2, 8.6], target: [-3, 5.8, 0], fov: 36, label: "Nível molecular" },
  gprotein: { position: [4.2, 4.8, 8.7], target: [-3, 4.1, 0], fov: 34, label: "Nível estrutural" },
  nucleotide: { position: [.8, 4.2, 4.5], target: [-2.3, 4.35, 0], fov: 28, label: "Nível molecular detalhado" },
  effector: { position: [6.0, 5.2, 6.8], target: [1.7, 5.4, 0], fov: 34, label: "Nível molecular" },
  messenger: { position: [7.0, 1.7, 11], target: [.8, 1.7, 0], fov: 38, label: "Nível subcelular" },
  response: { position: [9, .2, 13], target: [0, .1, 0], fov: 40, label: "Nível subcelular" }
};

async function api(url, options) {
  const response = await fetch(url, Object.assign({ credentials: "same-origin" }, options || {}));
  if (response.status === 401) {
    location.href = "/login.html";
    throw new Error("Não autenticado.");
  }
  if (!response.ok) throw new Error("Falha ao carregar o laboratório.");
  return response.json();
}

async function loadUser() {
  const data = await api("/api/auth/me");
  const user = data.usuario || {};
  const name = user.nome || "Usuário";
  const initial = name.charAt(0).toUpperCase();
  if ($("nomeSidebar")) $("nomeSidebar").textContent = name;
  if ($("emailSidebar")) $("emailSidebar").textContent = user.email || "";
  if ($("nomeHeader")) $("nomeHeader").textContent = name;
  if ($("avatarSidebar")) $("avatarSidebar").textContent = initial;
  if ($("avatarHeader")) $("avatarHeader").textContent = initial;
}

async function logout() {
  try { await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }); }
  finally { location.href = "/login.html"; }
}

function setLoading(percent, title, detail) {
  if ($("loadingBar")) $("loadingBar").style.width = Math.max(0, Math.min(100, percent)) + "%";
  if (title && $("loadingTitle")) $("loadingTitle").textContent = title;
  if (detail && $("loadingDetail")) $("loadingDetail").textContent = detail;
}

function cssColor(name, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function toThreeColor(value, fallback = "#f97316") {
  try { return new THREE.Color(value || fallback); }
  catch { return new THREE.Color(fallback); }
}

function parsePdb(text) {
  const atoms = [];
  const caByChain = new Map();

  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith("ATOM") && !line.startsWith("HETATM")) continue;

    const atomName = line.slice(12, 16).trim();
    const resName = line.slice(17, 20).trim();
    const chain = line.slice(21, 22).trim() || "_";
    const resSeq = Number(line.slice(22, 26).trim());
    const x = Number(line.slice(30, 38));
    const y = Number(line.slice(38, 46));
    const z = Number(line.slice(46, 54));
    const element = (line.slice(76, 78).trim() || atomName[0] || "C").toUpperCase();

    if (![x, y, z].every(Number.isFinite)) continue;
    const atom = { atomName, resName, chain, resSeq, x, y, z, element };
    atoms.push(atom);

    if (atomName === "CA") {
      if (chain === "R" && Number.isFinite(resSeq) && resSeq >= 1000) continue;
      if (!caByChain.has(chain)) caByChain.set(chain, []);
      caByChain.get(chain).push(atom);
    }
  }

  return { atoms, caByChain };
}

function findReceptorChain(parsed) {
  if (parsed.caByChain.has("R")) return "R";
  const candidates = [...parsed.caByChain.entries()]
    .map(([chain, atoms]) => ({ chain, atoms }))
    .filter((item) => item.atoms.length > 120)
    .sort((a, b) => a.atoms.length - b.atoms.length);
  return candidates[0]?.chain || [...parsed.caByChain.keys()][0];
}

function dominantAxis(points) {
  const box = new THREE.Box3().setFromPoints(points);
  const size = new THREE.Vector3();
  box.getSize(size);
  if (size.x >= size.y && size.x >= size.z) return "x";
  if (size.z >= size.x && size.z >= size.y) return "z";
  return "y";
}

function orientPoint(v, axis) {
  if (axis === "x") return new THREE.Vector3(v.y, v.x, v.z);
  if (axis === "z") return new THREE.Vector3(v.x, v.z, -v.y);
  return v.clone();
}

function createTube(points, color, radius) {
  if (points.length < 4) return null;
  const curve = new THREE.CatmullRomCurve3(points, false, "centripetal", .35);
  const tubularSegments = Math.min(900, Math.max(90, points.length * 3));
  const geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, 8, false);
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: .53,
    metalness: .02,
    transparent: true,
    opacity: .98
  });
  return new THREE.Mesh(geometry, material);
}

function buildMolecularComplex(parsed) {
  const receptorChain = findReceptorChain(parsed);
  const receptorRaw = (parsed.caByChain.get(receptorChain) || []).map((a) => new THREE.Vector3(a.x, a.y, a.z));
  const receptorCenter = new THREE.Box3().setFromPoints(receptorRaw).getCenter(new THREE.Vector3());
  const axis = dominantAxis(receptorRaw);
  const scale = .13;

  const root = new THREE.Group();
  root.name = "experimental-3SN6";
  STATE.molecularRoot = root;
  STATE.scene.add(root);

  const chainAlias = { [receptorChain]: "R", A: "A", B: "B", G: "G", C: "G" };

  for (const [chain, caAtoms] of parsed.caByChain.entries()) {
    const alias = chainAlias[chain];
    const spec = CHAIN_MAP[alias];
    if (!spec || caAtoms.length < 4) continue;

    const points = caAtoms.map((a) => {
      const raw = new THREE.Vector3(a.x, a.y, a.z).sub(receptorCenter);
      return orientPoint(raw, axis).multiplyScalar(scale);
    });

    const tube = createTube(points, spec.color, spec.radius);
    if (!tube) continue;
    tube.userData.structureId = spec.id;
    tube.userData.kind = "cartoon";

    let group = STATE.structureObjects.get(spec.id);
    if (!group) {
      group = new THREE.Group();
      group.name = spec.id;
      root.add(group);
      STATE.structureObjects.set(spec.id, group);
    }
    group.add(tube);
    STATE.selectable.push(tube);
  }

  buildAtomicRepresentation(parsed, receptorCenter, axis, scale, chainAlias, root);
  buildSurfaceRepresentation(parsed, receptorCenter, axis, scale, chainAlias, root);

  root.position.copy(MEMBRANE_ANCHOR);
  root.rotation.y = -.18;
  return { root, receptorCenter, axis, scale };
}

function buildAtomicRepresentation(parsed, center, axis, scale, chainAlias, root) {
  const byStructure = new Map();
  for (const atom of parsed.atoms) {
    const alias = chainAlias[atom.chain];
    const spec = CHAIN_MAP[alias];
    if (!spec) continue;
    if (spec.id === "gpcr" && Number.isFinite(atom.resSeq) && atom.resSeq >= 1000) continue;
    if (!byStructure.has(spec.id)) byStructure.set(spec.id, []);
    byStructure.get(spec.id).push(atom);
  }

  for (const [id, atoms] of byStructure.entries()) {
    const sampled = atoms.filter((_, i) => i % 2 === 0);
    const geometry = new THREE.SphereGeometry(.08, 7, 6);
    const material = new THREE.MeshStandardMaterial({ roughness: .48, metalness: .02 });
    const mesh = new THREE.InstancedMesh(geometry, material, sampled.length);
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();

    sampled.forEach((atom, i) => {
      const p = orientPoint(new THREE.Vector3(atom.x, atom.y, atom.z).sub(center), axis).multiplyScalar(scale);
      matrix.makeTranslation(p.x, p.y, p.z);
      mesh.setMatrixAt(i, matrix);
      color.setHex(ELEMENT_COLORS[atom.element] || 0x9aa4b4);
      mesh.setColorAt(i, color);
    });

    mesh.userData.structureId = id;
    mesh.userData.kind = "atomic";
    mesh.visible = false;
    const target = STATE.structureObjects.get(id) || root;
    target.add(mesh);
    STATE.selectable.push(mesh);
  }
}

function buildSurfaceRepresentation(parsed, center, axis, scale, chainAlias, root) {
  const byStructure = new Map();
  for (const atom of parsed.atoms) {
    const alias = chainAlias[atom.chain];
    const spec = CHAIN_MAP[alias];
    if (!spec) continue;
    if (spec.id === "gpcr" && Number.isFinite(atom.resSeq) && atom.resSeq >= 1000) continue;
    if (!byStructure.has(spec.id)) byStructure.set(spec.id, []);
    byStructure.get(spec.id).push(atom);
  }

  for (const [id, atoms] of byStructure.entries()) {
    const positions = [];
    for (let i = 0; i < atoms.length; i += 2) {
      const atom = atoms[i];
      const p = orientPoint(new THREE.Vector3(atom.x, atom.y, atom.z).sub(center), axis).multiplyScalar(scale);
      positions.push(p.x, p.y, p.z);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const structure = STRUCTURES[id];
    const spec = Object.values(CHAIN_MAP).find((v) => v.id === id);
    const material = new THREE.PointsMaterial({
      color: spec?.color || 0xffffff,
      size: .22,
      transparent: true,
      opacity: .42,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(geometry, material);
    points.userData.structureId = structure?.id || id;
    points.userData.kind = "surface";
    points.visible = false;
    const target = STATE.structureObjects.get(id) || root;
    target.add(points);
    STATE.selectable.push(points);
  }
}

function createCellContext() {
  const group = new THREE.Group();
  group.name = "cell-interior";
  STATE.cellGroup = group;
  STATE.scene.add(group);

  const registerStructure = (id, object, selectableObjects = []) => {
    object.userData.structureId = id;
    STATE.structureObjects.set(id, object);
    selectableObjects.forEach((item) => {
      item.userData.structureId = id;
      STATE.selectable.push(item);
    });
  };

  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(14, 64, 40, 0, Math.PI * 1.55, .32, Math.PI * .74),
    new THREE.MeshPhysicalMaterial({
      color: 0x1d3443,
      roughness: .72,
      transmission: .14,
      transparent: true,
      opacity: .075,
      side: THREE.DoubleSide,
      depthWrite: false
    })
  );
  shell.scale.set(1.2, .82, 1);
  shell.position.copy(CELL_CENTER);
  group.add(shell);
  registerStructure("cell", shell, [shell]);

  const cytosol = new THREE.Mesh(
    new THREE.SphereGeometry(12.9, 44, 30, 0, Math.PI * 1.55, .34, Math.PI * .71),
    new THREE.MeshPhysicalMaterial({
      color: 0x355263,
      roughness: .88,
      transparent: true,
      opacity: .035,
      side: THREE.DoubleSide,
      depthWrite: false
    })
  );
  cytosol.scale.set(1.2, .82, 1);
  cytosol.position.copy(CELL_CENTER);
  group.add(cytosol);

  const nucleusGroup = new THREE.Group();
  nucleusGroup.position.set(-6.7, -4.2, -3.6);

  const nuclearEnvelope = new THREE.Mesh(
    new THREE.SphereGeometry(3.45, 42, 30),
    new THREE.MeshPhysicalMaterial({
      color: 0x8773e9,
      roughness: .62,
      transparent: true,
      opacity: .26,
      transmission: .05,
      depthWrite: false
    })
  );
  nuclearEnvelope.scale.set(1.12, .78, .96);
  nucleusGroup.add(nuclearEnvelope);

  const chromatin = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial({
      color: 0xb6a6ff,
      size: .085,
      transparent: true,
      opacity: .42,
      depthWrite: false
    })
  );
  const chromatinPositions = [];
  for (let i = 0; i < 260; i += 1) {
    const a = i * 2.399963;
    const r = 2.35 * Math.cbrt((i + .5) / 260);
    const y = ((i % 37) / 36 - .5) * 3.3;
    chromatinPositions.push(
      Math.cos(a) * r,
      y * .66,
      Math.sin(a) * r * .88
    );
  }
  chromatin.geometry.setAttribute("position", new THREE.Float32BufferAttribute(chromatinPositions, 3));
  nucleusGroup.add(chromatin);

  const nucleolus = new THREE.Mesh(
    new THREE.SphereGeometry(.72, 24, 18),
    new THREE.MeshStandardMaterial({
      color: 0xd98cff,
      roughness: .54,
      transparent: true,
      opacity: .62
    })
  );
  nucleolus.position.set(.55, -.28, .35);
  nucleusGroup.add(nucleolus);

  group.add(nucleusGroup);
  registerStructure("nucleus", nucleusGroup, [nuclearEnvelope, nucleolus, chromatin]);

  const mitochondriaGroup = new THREE.Group();
  const mitoPositions = [
    [-4.7,-4.0,4.1,.55,.15,.55],
    [-7.2,-.9,3.0,-.5,.25,.82],
    [-2.8,-6.1,-4.1,.36,-.18,1.1],
    [4.6,-5.1,-4.6,-.7,.42,.28],
    [4.0,-2.7,4.5,.18,-.5,.95],
    [0.2,-5.8,4.7,.82,.12,.25]
  ];
  mitoPositions.forEach((entry) => {
    const [x,y,z,rz,rx,ry] = entry;
    const mito = new THREE.Group();
    mito.position.set(x,y,z);
    mito.rotation.set(rx,ry,rz);

    const outer = new THREE.Mesh(
      new THREE.CapsuleGeometry(.58, 2.35, 7, 14),
      new THREE.MeshPhysicalMaterial({
        color: 0xe3666e,
        roughness: .55,
        transparent: true,
        opacity: .6,
        clearcoat: .15
      })
    );
    mito.add(outer);

    const cristaMaterial = new THREE.MeshStandardMaterial({
      color: 0xffa0a5,
      roughness: .58,
      transparent: true,
      opacity: .6
    });
    for (let c = -3; c <= 3; c += 1) {
      const crista = new THREE.Mesh(
        new THREE.TorusGeometry(.32, .035, 5, 22, Math.PI * 1.35),
        cristaMaterial
      );
      crista.position.y = c * .31;
      crista.rotation.x = Math.PI / 2;
      crista.rotation.z = c * .33;
      mito.add(crista);
    }

    mitochondriaGroup.add(mito);
    mito.traverse((obj) => {
      if (obj.isMesh) {
        obj.userData.structureId = "mitochondria";
        STATE.selectable.push(obj);
      }
    });
  });
  group.add(mitochondriaGroup);
  registerStructure("mitochondria", mitochondriaGroup);

  const erGroup = new THREE.Group();
  erGroup.position.set(-5.2,-3.4,-2.4);
  const erMaterial = new THREE.MeshStandardMaterial({
    color: 0x6099d9,
    roughness: .72,
    transparent: true,
    opacity: .23,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  for (let i = 0; i < 8; i += 1) {
    const curvePoints = [];
    for (let p = 0; p < 18; p += 1) {
      const t = p / 17;
      curvePoints.push(new THREE.Vector3(
        -1.2 + t * 7.2,
        Math.sin(t * Math.PI * 3 + i * .52) * (.65 + i * .035),
        (i - 3.5) * .42 + Math.cos(t * Math.PI * 2 + i) * .25
      ));
    }
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 42, .065, 6, false),
      erMaterial
    );
    erGroup.add(mesh);
  }
  group.add(erGroup);
  erGroup.traverse((obj) => {
    if (obj.isMesh) {
      obj.userData.structureId = "er";
      STATE.selectable.push(obj);
    }
  });
  registerStructure("er", erGroup);

  const golgiGroup = new THREE.Group();
  golgiGroup.position.set(2.5,-4.1,-2.2);
  golgiGroup.rotation.z = -.22;
  const golgiMaterial = new THREE.MeshStandardMaterial({
    color: 0xe9b067,
    roughness: .62,
    transparent: true,
    opacity: .5
  });
  for (let i = 0; i < 6; i += 1) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.7, i * .28, -.45),
      new THREE.Vector3(-.8, i * .31, .08),
      new THREE.Vector3(.2, i * .28, .32),
      new THREE.Vector3(1.35, i * .25, -.16)
    ]);
    const cisterna = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 32, .115, 7, false),
      golgiMaterial
    );
    golgiGroup.add(cisterna);
  }
  group.add(golgiGroup);
  golgiGroup.traverse((obj) => {
    if (obj.isMesh) {
      obj.userData.structureId = "golgi";
      STATE.selectable.push(obj);
    }
  });
  registerStructure("golgi", golgiGroup);

  const vesiclesGroup = new THREE.Group();
  const vesicleMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x9ecff2,
    roughness: .5,
    transparent: true,
    opacity: .32,
    transmission: .08,
    depthWrite: false
  });
  [
    [3.9,-3.1,-1.5,.24],[4.5,-3.8,-2.3,.18],[3.4,-4.6,-.9,.2],
    [-1.8,-2.2,3.3,.18],[-.7,-4.5,3.0,.15],[5.3,-2.7,1.5,.22],
    [2.2,-5.7,1.8,.17],[1.2,-3.2,-4.8,.2]
  ].forEach(([x,y,z,r]) => {
    const vesicle = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), vesicleMaterial);
    vesicle.position.set(x,y,z);
    vesiclesGroup.add(vesicle);
    vesicle.userData.structureId = "vesicles";
    STATE.selectable.push(vesicle);
  });
  group.add(vesiclesGroup);
  registerStructure("vesicles", vesiclesGroup);

  const ribosomeGroup = new THREE.Group();
  const ribosomeGeometry = new THREE.SphereGeometry(.055, 6, 5);
  const ribosomeMaterial = new THREE.MeshStandardMaterial({
    color: 0xd8e5f0,
    roughness: .7,
    transparent: true,
    opacity: .72
  });
  const ribosomes = new THREE.InstancedMesh(ribosomeGeometry, ribosomeMaterial, 150);
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < 150; i += 1) {
    const a = i * 2.399963;
    const radial = 2.2 + (i % 11) * .38;
    const x = -4.2 + Math.cos(a) * radial;
    const y = -3.2 + ((i % 17) - 8) * .28;
    const z = -1.6 + Math.sin(a) * radial * .62;
    matrix.makeTranslation(x,y,z);
    ribosomes.setMatrixAt(i,matrix);
  }
  ribosomes.instanceMatrix.needsUpdate = true;
  ribosomes.userData.structureId = "ribosomes";
  ribosomeGroup.add(ribosomes);
  group.add(ribosomeGroup);
  STATE.selectable.push(ribosomes);
  registerStructure("ribosomes", ribosomeGroup);

  const cytoskeletonGroup = new THREE.Group();
  const filamentMaterial = new THREE.MeshBasicMaterial({
    color: 0x63c6bd,
    transparent: true,
    opacity: .1,
    depthWrite: false
  });
  for (let i = 0; i < 12; i += 1) {
    const start = new THREE.Vector3(-7 + (i % 4) * 3.8, -7 + (i % 3) * 2.1, -5 + (i % 5) * 2.1);
    const end = new THREE.Vector3(7 - (i % 5) * 2.4, -1 + (i % 4) * -1.4, 5 - (i % 3) * 2.7);
    const mid = start.clone().lerp(end,.5);
    mid.y += Math.sin(i * 1.3) * 2.1;
    const curve = new THREE.CatmullRomCurve3([start,mid,end]);
    const filament = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 28, .028, 5, false),
      filamentMaterial
    );
    filament.userData.structureId = "cytoskeleton";
    cytoskeletonGroup.add(filament);
    STATE.selectable.push(filament);
  }
  group.add(cytoskeletonGroup);
  registerStructure("cytoskeleton", cytoskeletonGroup);

  const cytosolParticles = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial({
      color: 0x9bc8d7,
      size: .055,
      transparent: true,
      opacity: .16,
      depthWrite: false
    })
  );
  const particlePositions = [];
  for (let i = 0; i < 420; i += 1) {
    const a = i * 2.399963;
    const r = 3.5 + (i % 19) * .34;
    particlePositions.push(
      -2.8 + Math.cos(a) * r,
      -2.3 + ((i % 29) - 14) * .28,
      Math.sin(a) * r * .72
    );
  }
  cytosolParticles.geometry.setAttribute("position", new THREE.Float32BufferAttribute(particlePositions,3));
  group.add(cytosolParticles);
}
function createMembrane() {
  const group = new THREE.Group();
  group.name = "plasma-membrane-patch";
  group.position.copy(MEMBRANE_ANCHOR);
  STATE.membraneGroup = group;
  STATE.scene.add(group);

  const grid = 15;
  const spacing = .9;
  const count = grid * grid * 2;
  const headGeom = new THREE.SphereGeometry(.16, 8, 6);
  const tailGeom = new THREE.CylinderGeometry(.045,.045,.52,6);
  const headMat = new THREE.MeshStandardMaterial({ color:0x72b7d9, roughness:.5, transparent:true, opacity:.88 });
  const tailMat = new THREE.MeshStandardMaterial({ color:0xd1a76f, roughness:.72, transparent:true, opacity:.58 });
  const heads = new THREE.InstancedMesh(headGeom, headMat, count);
  const tails = new THREE.InstancedMesh(tailGeom, tailMat, count * 2);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,0));
  const s = new THREE.Vector3(1,1,1);
  let hi = 0, ti = 0;

  for (let layer = 0; layer < 2; layer++) {
    const y = layer === 0 ? .58 : -.58;
    const direction = layer === 0 ? -1 : 1;

    for (let ix = 0; ix < grid; ix++) {
      for (let iz = 0; iz < grid; iz++) {
        const x = (ix - (grid - 1)/2) * spacing;
        const z = (iz - (grid - 1)/2) * spacing;
        if (Math.hypot(x,z) < 1.45) continue;

        m.compose(new THREE.Vector3(x,y,z), q, s);
        heads.setMatrixAt(hi++, m);

        for (let t = 0; t < 2; t++) {
          const tx = x + (t ? .055 : -.055);
          const ty = y + direction * .32;
          m.compose(new THREE.Vector3(tx,ty,z), q, s);
          tails.setMatrixAt(ti++, m);
        }
      }
    }
  }
  heads.count = hi;
  tails.count = ti;
  group.add(heads, tails);
  heads.userData.structureId = "membrane";
  STATE.selectable.push(heads);
  STATE.structureObjects.set("membrane", group);
}

function createNucleotide(label, color) {
  const group = new THREE.Group();
  const atomGeom = new THREE.SphereGeometry(.11,8,6);
  const bondGeom = new THREE.CylinderGeometry(.028,.028,.34,6);
  const atomMat = new THREE.MeshStandardMaterial({ color, roughness:.45 });
  const bondMat = new THREE.MeshStandardMaterial({ color:0xaab2bf, roughness:.55 });

  const points = [
    new THREE.Vector3(-.3,0,0),
    new THREE.Vector3(0,0.18,.08),
    new THREE.Vector3(.3,0,0),
    new THREE.Vector3(.55,.18,.04),
    new THREE.Vector3(.8,0,0)
  ];
  points.forEach((p) => {
    const atom = new THREE.Mesh(atomGeom, atomMat);
    atom.position.copy(p);
    group.add(atom);
  });
  for (let i=0;i<points.length-1;i++) {
    const a=points[i], b=points[i+1];
    const mid=a.clone().add(b).multiplyScalar(.5);
    const dir=b.clone().sub(a);
    const bond=new THREE.Mesh(bondGeom,bondMat);
    bond.position.copy(mid);
    bond.scale.y=dir.length()/.34;
    bond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize());
    group.add(bond);
  }
  group.userData.label = label;
  return group;
}

function createEducationObjects(parsed, molecularContext) {
  const group = new THREE.Group();
  group.name = "membrane-signaling-context";
  group.position.copy(MEMBRANE_ANCHOR);
  STATE.educationGroup = group;
  STATE.scene.add(group);

  const ligand = new THREE.Group();
  const experimentalLigand = (parsed?.atoms || []).filter((atom) => atom.resName === "P0G");
  if (experimentalLigand.length) {
    const atomGeometry = new THREE.SphereGeometry(.105, 10, 8);
    experimentalLigand.forEach((atom) => {
      const raw = new THREE.Vector3(atom.x, atom.y, atom.z).sub(molecularContext.receptorCenter);
      const p = orientPoint(raw, molecularContext.axis).multiplyScalar(molecularContext.scale);
      const atomMesh = new THREE.Mesh(
        atomGeometry,
        new THREE.MeshStandardMaterial({
          color: ELEMENT_COLORS[atom.element] || 0xd9dce3,
          roughness: .38,
          metalness: .01
        })
      );
      atomMesh.position.copy(p);
      atomMesh.userData.structureId = "ligand";
      ligand.add(atomMesh);
      STATE.selectable.push(atomMesh);
    });
    ligand.position.y = 0;
    ligand.rotation.y = -.18;
    ligand.userData.experimental = true;
  } else {
    const ligandMat = new THREE.MeshStandardMaterial({ color:0xf2c967, roughness:.42, metalness:.02 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.36,.09,10,28), ligandMat);
    ring.rotation.x = Math.PI/2;
    ligand.add(ring);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(.14,12,8), new THREE.MeshStandardMaterial({color:0xff8d72}));
    tip.position.x=.48;
    ligand.add(tip);
    ring.userData.structureId="ligand";
    tip.userData.structureId="ligand";
    STATE.selectable.push(ring,tip);
  }
  ligand.userData.structureId="ligand";
  group.add(ligand);
  STATE.structureObjects.set("ligand",ligand);

  const gdp=createNucleotide("GDP",0x5fb4ff);
  gdp.position.set(.65,-2.7,.1);
  gdp.userData.structureId="gdp";
  gdp.traverse(o=>{if(o.isMesh){o.userData.structureId="gdp";STATE.selectable.push(o);}});
  group.add(gdp); STATE.structureObjects.set("gdp",gdp);

  const gtp=createNucleotide("GTP",0x66df9c);
  gtp.position.set(2.2,-2.4,.2);
  gtp.visible=false;
  gtp.userData.structureId="gtp";
  gtp.traverse(o=>{if(o.isMesh){o.userData.structureId="gtp";STATE.selectable.push(o);}});
  group.add(gtp); STATE.structureObjects.set("gtp",gtp);

  const effector=new THREE.Group();
  const effMat=new THREE.MeshStandardMaterial({color:0xf38db2,roughness:.5,transparent:true,opacity:.92});
  for(let i=0;i<8;i++){
    const helix=new THREE.Mesh(new THREE.CapsuleGeometry(.13,2.5,5,10),effMat);
    helix.position.set((i-3.5)*.32,0,Math.sin(i*.8)*.25);
    helix.rotation.z=(i%2? .16:-.12);
    effector.add(helix);
    helix.userData.structureId="effector";
    STATE.selectable.push(helix);
  }
  effector.position.set(5.1,-.3,0);
  effector.userData.structureId="effector";
  group.add(effector); STATE.structureObjects.set("effector",effector);

  const campGroup=new THREE.Group();
  const campGeom=new THREE.SphereGeometry(.12,8,6);
  const campMat=new THREE.MeshStandardMaterial({color:0xf1d361,roughness:.4});
  for(let i=0;i<28;i++){
    const p=new THREE.Mesh(campGeom,campMat);
    const a=i*2.399;
    const r=1.4+(i%5)*.28;
    p.position.set(4.5+Math.cos(a)*r,-4.1-(i%4)*.28,Math.sin(a)*r);
    p.userData.structureId="camp";
    campGroup.add(p); STATE.selectable.push(p);
  }
  campGroup.visible=false;
  group.add(campGroup); STATE.structureObjects.set("camp",campGroup);

  const pka=new THREE.Group();
  const pkaMat=new THREE.MeshStandardMaterial({color:0xc594ff,roughness:.5});
  const p1=new THREE.Mesh(new THREE.SphereGeometry(.6,22,16),pkaMat);
  const p2=new THREE.Mesh(new THREE.SphereGeometry(.46,20,14),pkaMat);
  p1.position.x=-.42;p2.position.x=.48;
  p1.userData.structureId=p2.userData.structureId="pka";
  pka.add(p1,p2); pka.position.set(3,-6.5,-1.5); pka.visible=false;
  group.add(pka); STATE.structureObjects.set("pka",pka); STATE.selectable.push(p1,p2);
}

function rememberBaseTransforms() {
  for (const [id,obj] of STATE.structureObjects) {
    if (!obj?.position) continue;
    STATE.baseTransforms.set(id, {
      position: obj.position.clone(),
      rotation: obj.rotation.clone(),
      scale: obj.scale.clone()
    });
  }
}

function resetObjectTransforms() {
  for (const [id,base] of STATE.baseTransforms) {
    const obj=STATE.structureObjects.get(id);
    if(!obj) continue;
    obj.position.copy(base.position);
    obj.rotation.copy(base.rotation);
    obj.scale.copy(base.scale);
  }
}

function getStructureId(object) {
  let current = object;
  while (current) {
    if (current.userData?.structureId) return current.userData.structureId;
    current = current.parent;
  }
  return null;
}

function rememberMaterial(material) {
  if (!material || STATE.materialDefaults.has(material)) return;
  STATE.materialDefaults.set(material, {
    opacity: "opacity" in material ? material.opacity : 1,
    transparent: Boolean(material.transparent),
    depthWrite: "depthWrite" in material ? material.depthWrite : true,
    color: material.color?.clone?.() || null,
    emissive: material.emissive?.clone?.() || null,
    emissiveIntensity: material.emissiveIntensity ?? 0
  });
}

function forEachSceneMaterial(callback) {
  STATE.scene?.traverse((object) => {
    const id = getStructureId(object);
    if (!id || !object.material) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      rememberMaterial(material);
      callback(material, id, object);
    });
  });
}

function restoreSelectionMaterials() {
  forEachSceneMaterial((material) => {
    const base = STATE.materialDefaults.get(material);
    if (!base) return;
    if ("opacity" in material) material.opacity = base.opacity;
    material.transparent = base.transparent;
    if ("depthWrite" in material) material.depthWrite = base.depthWrite;
    if (base.color && material.color) material.color.copy(base.color);
    if (base.emissive && material.emissive) material.emissive.copy(base.emissive);
    if ("emissiveIntensity" in material) material.emissiveIntensity = base.emissiveIntensity;
  });
}

function applySelectionFocus(selectedId) {
  forEachSceneMaterial((material, id) => {
    const base = STATE.materialDefaults.get(material);
    if (!base) return;
    const selected = id === selectedId;

    if ("opacity" in material) {
      material.transparent = selected ? base.transparent : true;
      material.opacity = selected ? Math.max(base.opacity, .96) : Math.min(base.opacity, .12);
    }
    if ("depthWrite" in material) material.depthWrite = selected ? base.depthWrite : false;

    if (material.color && base.color) {
      if (selected) {
        material.color.copy(base.color);
      } else {
        material.color.copy(base.color).lerp(new THREE.Color(0x7a818c), .72);
      }
    }

    if (material.emissive && base.emissive) {
      if (selected) {
        material.emissive.copy(base.color || base.emissive).multiplyScalar(.28);
        material.emissiveIntensity = 1.15;
      } else {
        material.emissive.copy(base.emissive);
        material.emissiveIntensity = 0;
      }
    }
  });
}

function captureVisualState() {
  const result = new Map();
  for (const [id, object] of STATE.structureObjects) {
    if (!object?.position) continue;
    result.set(id, {
      object,
      position: object.position.clone(),
      rotation: object.rotation.clone(),
      scale: object.scale.clone(),
      visible: object.visible
    });
  }
  return result;
}

function restoreVisualState(snapshot) {
  for (const state of snapshot.values()) {
    state.object.position.copy(state.position);
    state.object.rotation.copy(state.rotation);
    state.object.scale.copy(state.scale);
    state.object.visible = state.visible;
  }
}

function animateStepVisual(stepIndex) {
  if (STATE.reducedMotion) {
    applyStepVisual(stepIndex);
    if (STATE.selectedId) applySelectionFocus(STATE.selectedId);
    return;
  }

  const from = captureVisualState();
  applyStepVisual(stepIndex);
  const to = captureVisualState();
  restoreVisualState(from);

  STATE.visualTweens.length = 0;
  const now = performance.now();
  const duration = Math.max(520, 920 / Math.max(.65, STATE.speed));

  for (const [id, target] of to) {
    const start = from.get(id);
    if (!start) continue;
    const object = target.object;

    let startScale = start.scale.clone();
    let endScale = target.scale.clone();
    let hideAfter = false;

    if (!start.visible && target.visible) {
      object.visible = true;
      startScale = target.scale.clone().multiplyScalar(.06);
      object.scale.copy(startScale);
    } else if (start.visible && !target.visible) {
      object.visible = true;
      endScale = start.scale.clone().multiplyScalar(.06);
      hideAfter = true;
    } else {
      object.visible = target.visible;
    }

    STATE.visualTweens.push({
      id,
      object,
      start: now,
      duration,
      fromPosition: object.position.clone(),
      toPosition: target.position.clone(),
      fromRotation: object.rotation.clone(),
      toRotation: target.rotation.clone(),
      fromScale: object.scale.clone(),
      toScale: endScale,
      targetScale: target.scale.clone(),
      targetVisible: target.visible,
      hideAfter
    });
  }
}

function updateVisualTweens(now) {
  if (!STATE.visualTweens.length) return;
  const remaining = [];

  for (const tween of STATE.visualTweens) {
    const p = Math.min(1, (now - tween.start) / tween.duration);
    const eased = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

    tween.object.position.lerpVectors(tween.fromPosition, tween.toPosition, eased);
    tween.object.scale.lerpVectors(tween.fromScale, tween.toScale, eased);

    const qa = new THREE.Quaternion().setFromEuler(tween.fromRotation);
    const qb = new THREE.Quaternion().setFromEuler(tween.toRotation);
    const q = qa.slerp(qb, eased);
    tween.object.rotation.setFromQuaternion(q);

    if (p >= 1) {
      tween.object.position.copy(tween.toPosition);
      tween.object.scale.copy(tween.targetScale);
      tween.object.rotation.copy(tween.toRotation);
      tween.object.visible = tween.targetVisible;
    } else {
      remaining.push(tween);
    }
  }

  STATE.visualTweens = remaining;
  if (!remaining.length && STATE.selectedId) applySelectionFocus(STATE.selectedId);
}

function setRepresentation(mode) {
  STATE.representation=mode;
  if (!STATE.molecularRoot) return;
  STATE.molecularRoot.traverse((obj)=>{
    if (!obj.userData.kind) return;
    obj.visible = obj.userData.kind === mode;
  });
  if ($("representationSelect")) $("representationSelect").value=mode;
}

function setStructureVisibility(id, visible) {
  const obj=STATE.structureObjects.get(id);
  if(obj) obj.visible=visible;
}

function applyStepVisual(stepIndex) {
  const step=STEPS[stepIndex];
  resetObjectTransforms();

  const ligand=STATE.structureObjects.get("ligand");
  const galpha=STATE.structureObjects.get("galpha");
  const gbeta=STATE.structureObjects.get("gbeta");
  const ggamma=STATE.structureObjects.get("ggamma");
  const gdp=STATE.structureObjects.get("gdp");
  const gtp=STATE.structureObjects.get("gtp");
  const effector=STATE.structureObjects.get("effector");
  const camp=STATE.structureObjects.get("camp");
  const pka=STATE.structureObjects.get("pka");

  setStructureVisibility("cell", stepIndex <= 1 || stepIndex >= 12);
  if(STATE.cellGroup) STATE.cellGroup.visible = stepIndex <= 1 || stepIndex >= 12;
  if(STATE.membraneGroup) STATE.membraneGroup.visible = true;
  if(STATE.molecularRoot) STATE.molecularRoot.visible = true;

  if(ligand){
    ligand.visible=stepIndex>=1 && stepIndex<=3;
    const baseLigand = STATE.baseTransforms.get("ligand");
    if (ligand.userData.experimental && baseLigand) {
      ligand.position.copy(baseLigand.position);
      if(stepIndex===1) ligand.position.y += 2.3;
    } else {
      if(stepIndex===1) ligand.position.set(0,3.5,0);
      if(stepIndex>=2) ligand.position.set(.1,1.55,0);
    }
  }
  if(gdp){
    gdp.visible=stepIndex<=4 || stepIndex>=10;
    if(stepIndex===4) gdp.position.set(1.7,-2.5,.8);
  }
  if(gtp){
    gtp.visible=stepIndex>=5 && stepIndex<=10;
    if(stepIndex===5) gtp.position.set(.8,-2.6,.1);
  }
  if(galpha && stepIndex>=6 && stepIndex<=10) galpha.position.x += 2.8;
  if(gbeta && stepIndex>=6 && stepIndex<=10) gbeta.position.x -= .55;
  if(ggamma && stepIndex>=6 && stepIndex<=10) ggamma.position.x -= .55;
  if(effector) effector.visible=stepIndex>=7 && stepIndex<=9;
  if(camp) camp.visible=stepIndex>=8 && stepIndex<=9;
  if(pka) pka.visible=stepIndex===9;

  if(stepIndex>=7 && galpha) galpha.position.x += 1.2;

  if (STATE.cellGroup) {
    const cellShell = STATE.structureObjects.get("cell");
    if (cellShell?.material && "opacity" in cellShell.material) {
      cellShell.material.opacity = stepIndex === 0 || stepIndex === 12 ? .075 : .028;
    }

    ["nucleus","mitochondria","er","golgi","ribosomes","vesicles","cytoskeleton"].forEach((id) => {
      const object = STATE.structureObjects.get(id);
      if (object) object.visible = stepIndex === 0 || stepIndex === 12;
    });
  }
}

function animateCamera(presetName, immediate=false) {
  const preset=CAMERA_PRESETS[presetName] || CAMERA_PRESETS.cell;
  const camera=STATE.camera;
  const controls=STATE.controls;
  if(!camera||!controls) return;

  $$(".gp-scale-rail button").forEach((btn)=>btn.classList.toggle("is-active",btn.dataset.cameraPreset===presetName));
  if($("heroScale")) $("heroScale").textContent=preset.label;

  const toPos=new THREE.Vector3(...preset.position);
  const toTarget=new THREE.Vector3(...preset.target);

  if(immediate || STATE.reducedMotion){
    camera.position.copy(toPos);
    controls.target.copy(toTarget);
    camera.fov=preset.fov;
    camera.updateProjectionMatrix();
    controls.update();
    return;
  }

  STATE.cameraTween={
    start:performance.now(),
    duration:900,
    fromPos:camera.position.clone(),
    toPos,
    fromTarget:controls.target.clone(),
    toTarget,
    fromFov:camera.fov,
    toFov:preset.fov
  };
}

function updateCameraTween(now){
  const t=STATE.cameraTween;
  if(!t) return;
  const p=Math.min(1,(now-t.start)/t.duration);
  const eased=1-Math.pow(1-p,3);
  STATE.camera.position.lerpVectors(t.fromPos,t.toPos,eased);
  STATE.controls.target.lerpVectors(t.fromTarget,t.toTarget,eased);
  STATE.camera.fov=THREE.MathUtils.lerp(t.fromFov,t.toFov,eased);
  STATE.camera.updateProjectionMatrix();
  STATE.controls.update();
  if(p>=1) STATE.cameraTween=null;
}

function updateEducationalUi(index){
  const step=STEPS[index];
  $("stepEyebrow").textContent="ETAPA "+(index+1)+" · "+step.scale.toUpperCase();
  $("stepTitle").textContent=step.title;
  $("timelineLabel").textContent=(index+1)+" / "+STEPS.length;
  $("timelineState").textContent=step.id;
  $("timelineSlider").value=String(index);
  $("educationStep").textContent="ETAPA "+(index+1)+" · "+step.short.toUpperCase();
  $("educationTitle").textContent=step.title;
  $("educationText").textContent=step.text;
  $("educationWhy").textContent=step.why;
  $("educationNext").textContent=step.next;

  const list=$("stepStructures");
  list.innerHTML=step.structures.map((id)=>{
    const s=STRUCTURES[id];
    return '<button class="gp-structure-chip'+(STATE.selectedId===id?' is-active':'')+'" data-structure-id="'+id+'" type="button">'+(s?.name||id)+'</button>';
  }).join("");
  $$("[data-structure-id]",list).forEach((btn)=>btn.addEventListener("click",()=>selectStructure(btn.dataset.structureId,true)));

  $$(".gp-step-button").forEach((btn)=>btn.classList.toggle("is-active",Number(btn.dataset.stepIndex)===index));
}

function applyStep(index,{camera=true,fromPlayback=false}={}){
  index=Math.max(0,Math.min(STEPS.length-1,index));
  STATE.stepIndex=index;
  const step=STEPS[index];
  if (fromPlayback) animateStepVisual(index);
  else {
    STATE.visualTweens.length = 0;
    applyStepVisual(index);
    if (STATE.selectedId) applySelectionFocus(STATE.selectedId);
  }
  updateEducationalUi(index);
  if(camera && STATE.mode!=="free") animateCamera(step.camera);
  if(!fromPlayback && STATE.playing) scheduleNext();
}

function stopPlayback(){
  STATE.playing=false;
  clearTimeout(STATE.playTimer);
  STATE.playTimer=null;
  const btn=$("playPauseButton");
  if(btn) btn.innerHTML="▶ <span>Reproduzir</span>";
}

function scheduleNext(){
  clearTimeout(STATE.playTimer);
  if(!STATE.playing) return;
  const step=STEPS[STATE.stepIndex];
  const delay=Math.max(650,step.duration/STATE.speed);
  STATE.playTimer=setTimeout(()=>{
    if(STATE.stepIndex>=STEPS.length-1){
      stopPlayback();
      return;
    }
    applyStep(STATE.stepIndex+1,{camera:true,fromPlayback:true});
    scheduleNext();
  },delay);
}

function togglePlayback(){
  STATE.playing=!STATE.playing;
  const btn=$("playPauseButton");
  if(STATE.playing){
    btn.innerHTML="Ⅱ <span>Pausar</span>";
    scheduleNext();
  }else{
    stopPlayback();
  }
}

function setMode(mode){
  STATE.mode=mode;
  $$("[data-mode]").forEach((btn)=>btn.classList.toggle("is-active",btn.dataset.mode===mode));
  if($("heroMode")) $("heroMode").textContent=mode==="guided"?"Guiado":mode==="free"?"Exploração livre":"Estudo";
  if($("studyPrompt")) $("studyPrompt").hidden=mode!=="study";
  STATE.controls.enableRotate=true;
  STATE.controls.enableZoom=true;
  if(mode==="study"){
    stopPlayback();
    STATE.studyIndex=0;
    showStudyTask();
  }
}

function showStudyTask(feedback="Selecione a estrutura diretamente na cena."){
  const task=STUDY_TASKS[STATE.studyIndex%STUDY_TASKS.length];
  $("studyPromptText").textContent=task.prompt;
  $("studyFeedback").textContent=feedback;
}

function selectStructure(id,focus=false){
  const structure=STRUCTURES[id];
  if(!structure) return;
  STATE.selectedId=id;

  $("selectionBadge").hidden=false;
  $("selectionKind").textContent=structure.kind==="experimental"?"ESTRUTURA EXPERIMENTAL":"REPRESENTAÇÃO EDUCACIONAL";
  $("selectionName").textContent=structure.name;
  $("selectionSource").textContent=structure.source||"Cortex · modelo didático";
  $("detailName").textContent=structure.name;
  $("detailFunction").textContent=structure.function+" "+structure.role;
  $("detailKind").textContent=structure.kind==="experimental"?"Experimental":"Educacional";
  $("detailSource").textContent=structure.source||"Cortex";
  $$(".gp-structure-chip").forEach((btn)=>btn.classList.toggle("is-active",btn.dataset.structureId===id));

  restoreSelectionMaterials();
  applySelectionFocus(id);

  if(focus){
    const preset = id==="gpcr"?"receptor":id==="galpha"||id==="gbeta"||id==="ggamma"?"gprotein":id==="gdp"||id==="gtp"?"nucleotide":id==="effector"?"effector":"complex";
    animateCamera(preset);
  }

  if(STATE.mode==="study"){
    const task=STUDY_TASKS[STATE.studyIndex%STUDY_TASKS.length];
    if(id===task.target){
      showStudyTask("Correto. "+structure.name+" identificada.");
      setTimeout(()=>{
        STATE.studyIndex=(STATE.studyIndex+1)%STUDY_TASKS.length;
        showStudyTask();
      },1000);
    }else{
      showStudyTask("Ainda não. "+task.hint);
    }
  }
}

function buildStepStrip(){
  $("stepStrip").innerHTML=STEPS.map((step,index)=>
    '<button type="button" class="gp-step-button'+(index===0?' is-active':'')+'" data-step-index="'+index+'"><span>'+String(index+1).padStart(2,"0")+'</span><strong>'+step.short+'</strong></button>'
  ).join("");
  $$(".gp-step-button").forEach((btn)=>btn.addEventListener("click",()=>{
    stopPlayback();
    applyStep(Number(btn.dataset.stepIndex));
  }));
}

function handleScenePointer(event){
  const rect=STATE.renderer.domElement.getBoundingClientRect();
  STATE.pointer.x=((event.clientX-rect.left)/rect.width)*2-1;
  STATE.pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;
  STATE.raycaster.setFromCamera(STATE.pointer,STATE.camera);
  const hits=STATE.raycaster.intersectObjects(STATE.selectable,true);
  const hit=hits.find((h)=>h.object.userData.structureId);
  if(hit) selectStructure(hit.object.userData.structureId,false);
}

function createScene(){
  const host=$("gpViewerHost");
  STATE.host=host;

  const canvas=document.createElement("canvas");
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:"high-performance"});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
  renderer.setSize(host.clientWidth,host.clientHeight,false);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.05;
  host.prepend(renderer.domElement);
  STATE.renderer=renderer;

  const scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(0x030507,.018);
  STATE.scene=scene;

  const camera=new THREE.PerspectiveCamera(42,host.clientWidth/host.clientHeight,.05,100);
  STATE.camera=camera;

  const controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;
  controls.dampingFactor=.065;
  controls.minDistance=2;
  controls.maxDistance=32;
  controls.rotateSpeed=.6;
  controls.zoomSpeed=.75;
  STATE.controls=controls;

  scene.add(new THREE.HemisphereLight(0xbcd8ff,0x191014,1.25));
  const key=new THREE.DirectionalLight(0xffffff,2.1);
  key.position.set(8,12,10);scene.add(key);
  const rim=new THREE.DirectionalLight(toThreeColor(cssColor("--theme-accent-2","#fb923c")),1.2);
  rim.position.set(-10,3,-8);scene.add(rim);
  const fill=new THREE.PointLight(0x6aa8ff,18,20,2);
  fill.position.set(2,-2,6);scene.add(fill);

  animateCamera("cell",true);
  renderer.domElement.addEventListener("click",handleScenePointer);

  const resize=()=>{
    const w=host.clientWidth,h=host.clientHeight;
    renderer.setSize(w,h,false);
    camera.aspect=w/Math.max(1,h);
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(host);
}

async function loadScientificAssets(){
  setLoading(10,"Preparando visualização científica","lendo metadados do PDB 3SN6");
  const manifestResponse=await fetch("/data/gprotein/manifest.json?v=1",{cache:"no-cache"});
  if(!manifestResponse.ok) throw new Error("Manifesto 3SN6 indisponível.");
  STATE.pdbManifest=await manifestResponse.json();

  setLoading(28,"Estrutura experimental","baixando coordenadas atômicas 3SN6");
  const pdbResponse=await fetch("/data/gprotein/3SN6.pdb?v=1",{cache:"force-cache"});
  if(!pdbResponse.ok) throw new Error("Estrutura PDB 3SN6 indisponível.");
  const pdbText=await pdbResponse.text();

  setLoading(50,"Reconstruindo complexo","gerando representação estrutural a partir do backbone experimental");
  const parsed=parsePdb(pdbText);
  const molecularContext = buildMolecularComplex(parsed);

  setLoading(68,"Construindo contexto celular","criando bicamada lipídica e ambiente didático");
  createCellContext();
  createMembrane();
  createEducationObjects(parsed, molecularContext);
  rememberBaseTransforms();

  setLoading(86,"Finalizando interação","preparando câmera, seleção e estados da via");
  setRepresentation("cartoon");
  applyStep(0,{camera:false});
  setLoading(100,"Laboratório pronto","estrutura experimental e cena educacional carregadas");
  STATE.loaded=true;
  setTimeout(()=>$("gpViewerLoading")?.classList.add("done"),180);
}

function bindUi(){
  $("logoutSidebar")?.addEventListener("click",logout);
  $("playPauseButton")?.addEventListener("click",togglePlayback);
  $("prevStepButton")?.addEventListener("click",()=>{stopPlayback();applyStep(STATE.stepIndex-1);});
  $("nextStepButton")?.addEventListener("click",()=>{stopPlayback();applyStep(STATE.stepIndex+1);});
  $("resetButton")?.addEventListener("click",()=>{stopPlayback();STATE.selectedId=null;restoreSelectionMaterials();applyStep(0);$("selectionBadge").hidden=true;});
  $("timelineSlider")?.addEventListener("input",function(){stopPlayback();applyStep(Number(this.value));});
  $("speedSelect")?.addEventListener("change",function(){STATE.speed=Number(this.value)||1;if(STATE.playing)scheduleNext();});
  $("representationSelect")?.addEventListener("change",function(){setRepresentation(this.value);});
  $("fullscreenButton")?.addEventListener("click",async()=>{if(!document.fullscreenElement) await $("gpViewerHost").requestFullscreen?.(); else await document.exitFullscreen?.();});

  $$("[data-mode]").forEach((btn)=>btn.addEventListener("click",()=>setMode(btn.dataset.mode)));
  $$("[data-camera-preset]").forEach((btn)=>btn.addEventListener("click",()=>animateCamera(btn.dataset.cameraPreset)));
  $$("[data-pathway]").forEach((btn)=>btn.addEventListener("click",()=>{
    const id=btn.dataset.pathway;
    $$("[data-pathway]").forEach((item)=>item.classList.toggle("is-active",item===btn));
    if(id!=="gs"){
      $("educationTitle").textContent=PATHWAYS[id].name+" preparada para expansão";
      $("educationText").textContent="A arquitetura já separa receptor, proteína G, efetor, mensageiro, animação e conteúdo. A cena estrutural ativa nesta versão permanece focada em Gs/β2AR para preservar fidelidade visual.";
    }else{
      applyStep(STATE.stepIndex,{camera:false});
    }
  }));
}

function renderLoop(now){
  requestAnimationFrame(renderLoop);
  updateCameraTween(now);
  updateVisualTweens(now);
  STATE.controls?.update();

  if(STATE.loaded){
    const t=STATE.renderClock.getElapsedTime();
    const camp=STATE.structureObjects.get("camp");
    if(camp?.visible){
      camp.children.forEach((child,i)=>{child.position.y+=Math.sin(t*1.8+i)*.0007;});
    }
    const ligand=STATE.structureObjects.get("ligand");
    if(ligand?.visible && STATE.stepIndex===1) ligand.rotation.y=t*.5;

    if (STATE.stepIndex === 0 || STATE.stepIndex === 12) {
      const mitochondria = STATE.structureObjects.get("mitochondria");
      const vesicles = STATE.structureObjects.get("vesicles");
      const ribosomes = STATE.structureObjects.get("ribosomes");
      if (mitochondria) mitochondria.rotation.y = Math.sin(t * .22) * .035;
      if (vesicles) vesicles.rotation.y = t * .025;
      if (ribosomes) ribosomes.rotation.y = Math.sin(t * .16) * .025;
    }
  }
  STATE.renderer?.render(STATE.scene,STATE.camera);
}

async function boot(){
  loadUser().catch(console.error);
  bindUi();
  buildStepStrip();

  try{
    createScene();
  }catch(error){
    console.error(error);
    $("webglFallback").hidden=false;
    $("gpViewerLoading").classList.add("done");
    return;
  }

  requestAnimationFrame(renderLoop);

  try{
    await loadScientificAssets();
  }catch(error){
    console.error("Falha ao iniciar Proteína G 3D:",error);
    $("loadingTitle").textContent="Não foi possível carregar a estrutura 3D";
    $("loadingDetail").textContent="O conteúdo educacional permanece disponível. Tente novamente após o deploy terminar.";
    $("webglFallback").hidden=false;
  }
}

boot();
