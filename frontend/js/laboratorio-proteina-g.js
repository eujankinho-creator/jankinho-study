import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { STRUCTURES, PATHWAYS, STEPS, STUDY_TASKS } from "./gprotein/data.js?v=20261005-gprotein-lab2";

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
  baseTransforms: new Map()
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

const CAMERA_PRESETS = {
  cell: { position: [16, 10, 18], target: [0, 0, 0], fov: 42, label: "Nível celular" },
  membrane: { position: [8, 5.2, 10], target: [0, 0, 0], fov: 38, label: "Nível subcelular" },
  receptor: { position: [4.8, 2.7, 6.3], target: [0, .2, 0], fov: 34, label: "Nível molecular" },
  complex: { position: [6.8, 1.5, 8.2], target: [0, -1.2, 0], fov: 36, label: "Nível molecular" },
  gprotein: { position: [7.2, -2.1, 8.4], target: [0, -2.8, 0], fov: 34, label: "Nível estrutural" },
  nucleotide: { position: [3.6, -2.8, 4.2], target: [0.7, -2.7, 0], fov: 28, label: "Nível molecular detalhado" },
  effector: { position: [9, -1.8, 6.5], target: [4.7, -1.6, 0], fov: 34, label: "Nível molecular" },
  messenger: { position: [10, -4.5, 11], target: [3.8, -4.2, 0], fov: 38, label: "Nível subcelular" },
  response: { position: [12, -5.8, 13], target: [3, -5.1, 0], fov: 40, label: "Nível subcelular" }
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
    const x = Number(line.slice(30, 38));
    const y = Number(line.slice(38, 46));
    const z = Number(line.slice(46, 54));
    const element = (line.slice(76, 78).trim() || atomName[0] || "C").toUpperCase();

    if (![x, y, z].every(Number.isFinite)) continue;
    const atom = { atomName, resName, chain, x, y, z, element };
    atoms.push(atom);

    if (atomName === "CA") {
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

  root.position.y = -.2;
  root.rotation.y = -.18;
  return { root, receptorCenter, axis, scale };
}

function buildAtomicRepresentation(parsed, center, axis, scale, chainAlias, root) {
  const byStructure = new Map();
  for (const atom of parsed.atoms) {
    const alias = chainAlias[atom.chain];
    const spec = CHAIN_MAP[alias];
    if (!spec) continue;
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
  STATE.cellGroup = group;
  STATE.scene.add(group);

  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(14, 64, 40, 0, Math.PI * 1.55, .32, Math.PI * .74),
    new THREE.MeshPhysicalMaterial({
      color: 0x1c3140,
      roughness: .78,
      transmission: .1,
      transparent: true,
      opacity: .11,
      side: THREE.DoubleSide,
      depthWrite: false
    })
  );
  shell.scale.set(1.2, .82, 1);
  shell.position.set(-3, -2, 0);
  shell.userData.structureId = "cell";
  group.add(shell);
  STATE.selectable.push(shell);
  STATE.structureObjects.set("cell", shell);

  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(3.5, 48, 32),
    new THREE.MeshPhysicalMaterial({ color: 0x8b6cff, roughness: .72, transparent: true, opacity: .18, depthWrite: false })
  );
  nucleus.scale.set(1.1, .78, 1);
  nucleus.position.set(-7.2, -4, -3.8);
  group.add(nucleus);

  const mitoMaterial = new THREE.MeshStandardMaterial({ color: 0xd75e68, roughness: .66, transparent: true, opacity: .36 });
  [[-5,-4,4],[-7,-1,3],[-3,-6,-4],[5,-5,-5]].forEach((pos, index) => {
    const mito = new THREE.Mesh(new THREE.CapsuleGeometry(.55,2.4,6,12), mitoMaterial);
    mito.position.set(...pos);
    mito.rotation.z = .6 + index * .43;
    mito.rotation.x = .2 * index;
    group.add(mito);
  });

  const erMaterial = new THREE.MeshStandardMaterial({ color: 0x5f8fd3, roughness: .75, transparent: true, opacity: .15, side: THREE.DoubleSide });
  for (let i = 0; i < 5; i++) {
    const torus = new THREE.Mesh(new THREE.TorusGeometry(4.2 + i * .28, .08, 6, 80, Math.PI * 1.25), erMaterial);
    torus.position.set(-5.8, -3.6 + i * .18, -2.7 + i * .3);
    torus.rotation.x = 1.1;
    torus.rotation.z = -.5;
    group.add(torus);
  }
}

function createMembrane() {
  const group = new THREE.Group();
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
    ligand.position.y = -.2;
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

  if(STATE.cellGroup){
    STATE.cellGroup.traverse((o)=>{
      if(o.material && "opacity" in o.material) o.material.opacity = stepIndex===0 || stepIndex===12 ? .18 : .055;
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
  applyStepVisual(index);
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

  for(const obj of STATE.selectable){
    if(!obj.material) continue;
    const selected=obj.userData.structureId===id;
    if(Array.isArray(obj.material)) continue;
    if("emissive" in obj.material){
      obj.material.emissive.set(selected?0x223344:0x000000);
      obj.material.emissiveIntensity=selected?.85:0;
    }
  }

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
  $("resetButton")?.addEventListener("click",()=>{stopPlayback();STATE.selectedId=null;applyStep(0);$("selectionBadge").hidden=true;});
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
  STATE.controls?.update();

  if(STATE.loaded){
    const t=STATE.renderClock.getElapsedTime();
    const camp=STATE.structureObjects.get("camp");
    if(camp?.visible){
      camp.children.forEach((child,i)=>{child.position.y+=Math.sin(t*1.8+i)*.0007;});
    }
    const ligand=STATE.structureObjects.get("ligand");
    if(ligand?.visible && STATE.stepIndex===1) ligand.rotation.y=t*.5;
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
