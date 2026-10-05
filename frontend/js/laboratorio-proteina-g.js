import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { STRUCTURES, PATHWAYS, STEPS, PATHWAY_STEPS, STUDY_TASKS } from "./gprotein/data.js?v=20261005-gprotein-lab6";

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
  materialDefaults: new WeakMap(),
  pathway: "gs",
  pathwayRoots: new Map(),
  pathwayStructureMaps: new Map(),
  pathwayContexts: new Map(),
  pathwayLoading: new Map()
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
  const structureMap = new Map();
  ["gpcr","galpha","gbeta","ggamma"].forEach((id) => {
    const object = STATE.structureObjects.get(id);
    if (object) structureMap.set(id,object);
  });
  STATE.pathwayRoots.set("gs",root);
  STATE.pathwayStructureMaps.set("gs",structureMap);
  STATE.pathwayContexts.set("gs",{root,receptorCenter,axis,scale,pdbId:"3SN6"});
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

function buildExperimentalPathwayComplex(parsed, config) {
  const chainEntries = Object.entries(config.chainMap || {});
  const referenceChains = config.referenceChains?.length ? config.referenceChains : chainEntries.map(([chain]) => chain);
  const referencePoints = referenceChains.flatMap((chain) =>
    (parsed.caByChain.get(chain) || []).map((a) => new THREE.Vector3(a.x, a.y, a.z))
  );
  if (!referencePoints.length) throw new Error("Sem coordenadas de referência para " + config.pdbId);

  const center = new THREE.Box3().setFromPoints(referencePoints).getCenter(new THREE.Vector3());
  const axis = dominantAxis(referencePoints);
  const scale = config.scale || .105;
  const root = new THREE.Group();
  root.name = "experimental-" + config.pdbId;
  root.position.copy(MEMBRANE_ANCHOR).add(new THREE.Vector3(...(config.offset || [0,0,0])));
  root.rotation.set(...(config.rotation || [0,-.18,0]));
  root.visible = false;
  STATE.scene.add(root);

  const structureMap = new Map();

  for (const [chain, spec] of chainEntries) {
    const caAtoms = parsed.caByChain.get(chain) || [];
    if (caAtoms.length < 4) continue;

    const group = new THREE.Group();
    group.name = config.pathway + "-" + spec.id + "-" + chain;
    group.userData.structureId = spec.id;
    root.add(group);
    if (!structureMap.has(spec.id)) structureMap.set(spec.id, group);

    const points = caAtoms.map((a) =>
      orientPoint(new THREE.Vector3(a.x,a.y,a.z).sub(center), axis).multiplyScalar(scale)
    );
    const cartoon = createTube(points, spec.color, spec.radius || .19);
    if (cartoon) {
      cartoon.userData.structureId = spec.id;
      cartoon.userData.kind = "cartoon";
      group.add(cartoon);
      STATE.selectable.push(cartoon);
    }

    const chainAtoms = parsed.atoms.filter((atom) => atom.chain === chain);
    const atomicAtoms = chainAtoms.filter((_, index) => index % 3 === 0);
    if (atomicAtoms.length) {
      const geom = new THREE.SphereGeometry(.075,6,5);
      const mat = new THREE.MeshStandardMaterial({ roughness:.5, metalness:.015 });
      const inst = new THREE.InstancedMesh(geom,mat,atomicAtoms.length);
      const matrix = new THREE.Matrix4();
      const color = new THREE.Color();
      atomicAtoms.forEach((atom,index) => {
        const p = orientPoint(new THREE.Vector3(atom.x,atom.y,atom.z).sub(center),axis).multiplyScalar(scale);
        matrix.makeTranslation(p.x,p.y,p.z);
        inst.setMatrixAt(index,matrix);
        color.setHex(ELEMENT_COLORS[atom.element] || spec.color || 0x9aa4b4);
        inst.setColorAt(index,color);
      });
      inst.userData.structureId = spec.id;
      inst.userData.kind = "atomic";
      inst.visible = false;
      group.add(inst);
      STATE.selectable.push(inst);
    }

    const positions = [];
    for (let index = 0; index < chainAtoms.length; index += 3) {
      const atom = chainAtoms[index];
      const p = orientPoint(new THREE.Vector3(atom.x,atom.y,atom.z).sub(center),axis).multiplyScalar(scale);
      positions.push(p.x,p.y,p.z);
    }
    if (positions.length) {
      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));
      const pointsObj = new THREE.Points(
        geom,
        new THREE.PointsMaterial({
          color: spec.color || 0xffffff,
          size:.19,
          transparent:true,
          opacity:.48,
          depthWrite:false
        })
      );
      pointsObj.userData.structureId = spec.id;
      pointsObj.userData.kind = "surface";
      pointsObj.visible = false;
      group.add(pointsObj);
      STATE.selectable.push(pointsObj);
    }
  }

  STATE.pathwayRoots.set(config.pathway,root);
  STATE.pathwayStructureMaps.set(config.pathway,structureMap);
  STATE.pathwayContexts.set(config.pathway,{ root,center,axis,scale,pdbId:config.pdbId });
  return { root,structureMap,center,axis,scale };
}

function currentSteps() {
  return PATHWAY_STEPS[STATE.pathway] || STEPS;
}

function rememberCurrentMolecularTransforms() {
  const ids = ["gpcr","galpha","gbeta","ggamma","plc"];
  ids.forEach((id) => {
    const obj = STATE.structureObjects.get(id);
    if (!obj?.position) return;
    STATE.baseTransforms.set(id,{
      position:obj.position.clone(),
      rotation:obj.rotation.clone(),
      scale:obj.scale.clone()
    });
  });
}

async function ensurePathwayStructure(pathway) {
  if (pathway === "gs") return STATE.pathwayContexts.get("gs");
  if (STATE.pathwayContexts.has(pathway)) return STATE.pathwayContexts.get(pathway);
  if (STATE.pathwayLoading.has(pathway)) return STATE.pathwayLoading.get(pathway);

  const config = pathway === "gi"
    ? {
        pathway:"gi", pdbId:"6DDE", referenceChains:["R"],
        chainMap:{
          R:{id:"gpcr",color:0x5f93ff,radius:.18},
          A:{id:"galpha",color:0x70d5aa,radius:.22},
          B:{id:"gbeta",color:0xb494ff,radius:.22},
          C:{id:"ggamma",color:0x67d8ba,radius:.16}
        },
        scale:.11, offset:[0,0,0]
      }
    : {
        pathway:"gq", pdbId:"8UQO", referenceChains:["A","Q"],
        chainMap:{
          A:{id:"galpha",color:0xf1b35f,radius:.22},
          B:{id:"gbeta",color:0xb494ff,radius:.22},
          D:{id:"ggamma",color:0x67d8ba,radius:.16},
          Q:{id:"plc",color:0xf07aa8,radius:.2}
        },
        scale:.08, offset:[3.1,-1.3,0], rotation:[0,-.28,0]
      };

  const promise = (async () => {
    const response = await fetch("/data/gprotein/" + config.pdbId + ".pdb?v=2",{cache:"force-cache"});
    if (!response.ok) throw new Error("Estrutura " + config.pdbId + " indisponível.");
    const parsed = parsePdb(await response.text());
    return buildExperimentalPathwayComplex(parsed,config);
  })();

  STATE.pathwayLoading.set(pathway,promise);
  try {
    return await promise;
  } finally {
    STATE.pathwayLoading.delete(pathway);
  }
}

function applyMolecularPathwayVisibility(pathway) {
  const gsRoot = STATE.pathwayRoots.get("gs");
  const giRoot = STATE.pathwayRoots.get("gi");
  const gqRoot = STATE.pathwayRoots.get("gq");
  if (gsRoot) gsRoot.visible = pathway === "gs" || pathway === "gq";
  if (giRoot) giRoot.visible = pathway === "gi";
  if (gqRoot) gqRoot.visible = pathway === "gq";

  const gsMap = STATE.pathwayStructureMaps.get("gs");
  if (gsMap && pathway === "gq") {
    ["galpha","gbeta","ggamma"].forEach((id) => {
      const group = gsMap.get(id);
      if (group) group.visible = false;
    });
    const receptor = gsMap.get("gpcr");
    if (receptor) receptor.visible = true;
  } else if (gsMap) {
    ["gpcr","galpha","gbeta","ggamma"].forEach((id) => {
      const group = gsMap.get(id);
      if (group) group.visible = true;
    });
  }

  const activeMap = STATE.pathwayStructureMaps.get(pathway);
  const fallbackGs = STATE.pathwayStructureMaps.get("gs");
  ["gpcr","galpha","gbeta","ggamma","plc"].forEach((id) => {
    const object = activeMap?.get(id) || (pathway === "gq" ? fallbackGs?.get(id) : null);
    if (object) STATE.structureObjects.set(id,object);
  });
  rememberCurrentMolecularTransforms();
  setRepresentation(STATE.representation);
}

async function switchPathway(pathway) {
  if (!PATHWAYS[pathway] || pathway === "g12") return;
  stopPlayback();
  restoreSelectionMaterials();
  STATE.selectedId = null;
  if ($("selectionBadge")) $("selectionBadge").hidden = true;
  STATE.pathway = pathway;
  STATE.stepIndex = 0;

  $(".gp-path-option").forEach((item) => item.classList.toggle("is-active",item.dataset.pathway === pathway));

  if (pathway !== "gs") {
    if ($("loadingTitle")) $("loadingTitle").textContent = "Carregando estrutura " + (PATHWAYS[pathway].pdbId || "");
    $("gpViewerLoading")?.classList.remove("done");
    try {
      await ensurePathwayStructure(pathway);
    } finally {
      $("gpViewerLoading")?.classList.add("done");
    }
  }

  applyMolecularPathwayVisibility(pathway);
  buildStepStrip();
  const steps = currentSteps();
  if ($("timelineSlider")) {
    $("timelineSlider").max = String(Math.max(0,steps.length - 1));
    $("timelineSlider").value = "0";
  }
  applyStep(0,{camera:true});
  updatePathwayScienceUi();
}

function updatePathwayScienceUi() {
  const meta = PATHWAYS[STATE.pathway] || PATHWAYS.gs;
  const source = STATE.pdbManifest?.structures?.find((item) => item.pathway === STATE.pathway);
  if ($("viewerSourceBadge")) $("viewerSourceBadge").textContent = source ? source.pdbId + " · estrutura experimental" : "representação educacional";
  if ($("sourcePdbId")) $("sourcePdbId").textContent = source?.pdbId || "—";
  if ($("sourceMethod")) $("sourceMethod").textContent = source ? source.method + " · " + source.resolutionAngstrom.toFixed(2).replace(".",",") + " Å" : "Representação educacional";
  if ($("sourceTitle")) $("sourceTitle").textContent = source?.title || meta.name;
  if ($("sourceLink")) {
    $("sourceLink").href = source?.sourceUrl || "#";
    $("sourceLink").hidden = !source;
  }
  if ($("heroStructure")) $("heroStructure").textContent = source?.pdbId || "Educacional";
  if ($("heroStructureMeta")) $("heroStructureMeta").textContent = source ? source.resolutionAngstrom.toFixed(2).replace(".",",") + " Å · " + (source.method.includes("ELECTRON") ? "cryo-EM" : "X-ray") : meta.name;
  if ($("pathwaySummary")) $("pathwaySummary").textContent = STATE.pathway === "gs"
    ? "GPCR → Gαs → adenilato ciclase → cAMP → PKA"
    : STATE.pathway === "gi"
      ? "GPCR → Gαi → modulação da adenilato ciclase → cAMP ↓"
      : "Gαq → PLCβ3 → PIP₂ → IP₃ + DAG → Ca²⁺ / PKC";
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

  // A célula passa a ser um agrupador lógico: sem casca esférica.
  registerStructure("cell", group);

  const nucleusGroup = new THREE.Group();
  nucleusGroup.position.set(-6.5, -3.9, -3.5);

  const nucleusOuter = new THREE.Mesh(
    new THREE.SphereGeometry(3.55, 48, 34),
    new THREE.MeshPhysicalMaterial({
      color: 0x8f78ff,
      roughness: .42,
      transmission: .08,
      transparent: true,
      opacity: .42,
      clearcoat: .25,
      depthWrite: false
    })
  );
  nucleusOuter.scale.set(1.16, .82, .98);
  nucleusGroup.add(nucleusOuter);

  const nucleusInner = new THREE.Mesh(
    new THREE.SphereGeometry(3.05, 42, 28),
    new THREE.MeshPhysicalMaterial({
      color: 0xc0a9ff,
      roughness: .56,
      transparent: true,
      opacity: .12,
      depthWrite: false
    })
  );
  nucleusInner.scale.set(1.1, .78, .96);
  nucleusGroup.add(nucleusInner);

  const chromatinGeometry = new THREE.BufferGeometry();
  const chromatinPositions = [];
  for (let i = 0; i < 420; i += 1) {
    const a = i * 2.399963;
    const r = 2.45 * Math.cbrt((i + 1) / 420);
    const y = ((i % 41) / 40 - .5) * 3.2;
    chromatinPositions.push(Math.cos(a) * r, y * .7, Math.sin(a) * r * .9);
  }
  chromatinGeometry.setAttribute("position", new THREE.Float32BufferAttribute(chromatinPositions, 3));
  const chromatin = new THREE.Points(
    chromatinGeometry,
    new THREE.PointsMaterial({
      color: 0xd7c6ff,
      size: .09,
      transparent: true,
      opacity: .54,
      depthWrite: false
    })
  );
  nucleusGroup.add(chromatin);

  const nucleolus = new THREE.Mesh(
    new THREE.SphereGeometry(.78, 26, 18),
    new THREE.MeshStandardMaterial({
      color: 0xf08bff,
      roughness: .42,
      transparent: true,
      opacity: .82
    })
  );
  nucleolus.position.set(.65, -.22, .28);
  nucleusGroup.add(nucleolus);

  group.add(nucleusGroup);
  registerStructure("nucleus", nucleusGroup, [nucleusOuter, nucleusInner, chromatin, nucleolus]);

  const mitochondriaGroup = new THREE.Group();
  const mitoPositions = [
    [-4.8,-4.0,4.0,.55,.18,.55],
    [-7.3,-1.0,3.1,-.5,.22,.82],
    [-2.8,-6.1,-4.2,.36,-.16,1.08],
    [4.8,-5.1,-4.7,-.72,.42,.28],
    [4.1,-2.8,4.6,.18,-.5,.95],
    [.3,-5.9,4.8,.82,.14,.25]
  ];

  mitoPositions.forEach(([x,y,z,rz,rx,ry]) => {
    const mito = new THREE.Group();
    mito.position.set(x,y,z);
    mito.rotation.set(rx,ry,rz);

    const outer = new THREE.Mesh(
      new THREE.CapsuleGeometry(.62,2.55,8,16),
      new THREE.MeshPhysicalMaterial({
        color: 0xf26d72,
        roughness: .44,
        clearcoat: .18,
        transparent: true,
        opacity: .78
      })
    );
    mito.add(outer);

    const inner = new THREE.Mesh(
      new THREE.CapsuleGeometry(.48,2.1,8,16),
      new THREE.MeshPhysicalMaterial({
        color: 0xffb1b4,
        roughness: .5,
        transparent: true,
        opacity: .18,
        depthWrite: false
      })
    );
    mito.add(inner);

    const cristaMaterial = new THREE.MeshStandardMaterial({
      color: 0xffc0c4,
      roughness: .45,
      transparent: true,
      opacity: .76
    });
    for (let c = -3; c <= 3; c += 1) {
      const crista = new THREE.Mesh(
        new THREE.TorusGeometry(.34,.04,6,30,Math.PI * 1.45),
        cristaMaterial
      );
      crista.position.y = c * .33;
      crista.rotation.x = Math.PI / 2;
      crista.rotation.z = c * .34;
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
  erGroup.position.set(-4.9,-3.2,-2.1);
  const erMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x6db4ff,
    roughness: .54,
    transparent: true,
    opacity: .32,
    clearcoat: .12,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  for (let i = 0; i < 10; i += 1) {
    const pts = [];
    for (let p = 0; p < 24; p += 1) {
      const t = p / 23;
      pts.push(new THREE.Vector3(
        -1.4 + t * 8.2,
        Math.sin(t * Math.PI * 3 + i * .55) * (.7 + i * .03),
        (i - 4.5) * .34 + Math.cos(t * Math.PI * 2 + i) * .24
      ));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    erGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve,64,.085,8,false), erMaterial));
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
  golgiGroup.position.set(2.7,-4.1,-2.1);
  golgiGroup.rotation.z = -.22;
  const golgiMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf0ba72,
    roughness: .5,
    transparent: true,
    opacity: .72,
    clearcoat: .12
  });
  for (let i = 0; i < 7; i += 1) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.9,i*.28,-.52),
      new THREE.Vector3(-.9,i*.32,.08),
      new THREE.Vector3(.25,i*.28,.36),
      new THREE.Vector3(1.55,i*.25,-.18)
    ]);
    golgiGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve,42,.14,10,false), golgiMaterial));
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
    color: 0xa8ddff,
    roughness: .34,
    transmission: .12,
    transparent: true,
    opacity: .42,
    clearcoat: .15,
    depthWrite: false
  });
  [
    [3.9,-3.1,-1.5,.26],[4.5,-3.8,-2.3,.2],[3.4,-4.6,-.9,.22],
    [-1.8,-2.2,3.3,.2],[-.7,-4.5,3.0,.17],[5.3,-2.7,1.5,.24],
    [2.2,-5.7,1.8,.18],[1.2,-3.2,-4.8,.2],[.8,-1.6,2.5,.16]
  ].forEach(([x,y,z,r]) => {
    const vesicle = new THREE.Mesh(new THREE.SphereGeometry(r,18,14), vesicleMaterial);
    vesicle.position.set(x,y,z);
    vesicle.userData.structureId = "vesicles";
    vesiclesGroup.add(vesicle);
    STATE.selectable.push(vesicle);
  });
  group.add(vesiclesGroup);
  registerStructure("vesicles", vesiclesGroup);

  const ribosomeGroup = new THREE.Group();
  const riboGeometry = new THREE.SphereGeometry(.06,7,6);
  const riboMaterial = new THREE.MeshStandardMaterial({
    color: 0xe9f1f7,
    roughness: .58,
    transparent: true,
    opacity: .9
  });
  const ribosomes = new THREE.InstancedMesh(riboGeometry,riboMaterial,220);
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < 220; i += 1) {
    const a = i * 2.399963;
    const radial = 2.4 + (i % 13) * .34;
    matrix.makeTranslation(
      -4.1 + Math.cos(a) * radial,
      -3.1 + ((i % 21) - 10) * .24,
      -1.5 + Math.sin(a) * radial * .68
    );
    ribosomes.setMatrixAt(i,matrix);
  }
  ribosomes.instanceMatrix.needsUpdate = true;
  ribosomes.userData.structureId = "ribosomes";
  ribosomeGroup.add(ribosomes);
  group.add(ribosomeGroup);
  STATE.selectable.push(ribosomes);
  registerStructure("ribosomes", ribosomeGroup);

  const cytoskeletonGroup = new THREE.Group();
  const filamentMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x5fd6c8,
    roughness: .35,
    transparent: true,
    opacity: .24,
    depthWrite: false
  });
  for (let i = 0; i < 18; i += 1) {
    const start = new THREE.Vector3(-7 + (i % 5) * 3.1,-7 + (i % 4) * 1.9,-5 + (i % 6) * 1.8);
    const end = new THREE.Vector3(7 - (i % 6) * 2.0,-1 + (i % 5) * -1.2,5 - (i % 4) * 2.3);
    const mid = start.clone().lerp(end,.5);
    mid.y += Math.sin(i * 1.25) * 2.3;
    const filament = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3([start,mid,end]),40,.034,6,false),
      filamentMaterial
    );
    filament.userData.structureId = "cytoskeleton";
    cytoskeletonGroup.add(filament);
    STATE.selectable.push(filament);
  }
  group.add(cytoskeletonGroup);
  registerStructure("cytoskeleton", cytoskeletonGroup);

  const cytosolGeometry = new THREE.BufferGeometry();
  const cytosolPositions = [];
  for (let i = 0; i < 620; i += 1) {
    const a = i * 2.399963;
    const r = 3.8 + (i % 23) * .32;
    cytosolPositions.push(
      -2.7 + Math.cos(a) * r,
      -2.1 + ((i % 31) - 15) * .24,
      Math.sin(a) * r * .72
    );
  }
  cytosolGeometry.setAttribute("position", new THREE.Float32BufferAttribute(cytosolPositions,3));
  group.add(new THREE.Points(
    cytosolGeometry,
    new THREE.PointsMaterial({
      color: 0xa8d8e8,
      size: .06,
      transparent: true,
      opacity: .22,
      depthWrite: false
    })
  ));
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

  const atp=createNucleotide("ATP",0xffcf66);
  atp.position.set(4.4,-2.2,.9);
  atp.scale.setScalar(.9);
  atp.visible=false;
  atp.userData.structureId="atp";
  atp.traverse(o=>{if(o.isMesh){o.userData.structureId="atp";STATE.selectable.push(o);}});
  group.add(atp); STATE.structureObjects.set("atp",atp);

  const pip2=new THREE.Group();
  const pipHeadMat=new THREE.MeshStandardMaterial({color:0xf3cf6b,roughness:.42});
  const pipTailMat=new THREE.MeshStandardMaterial({color:0xdba75f,roughness:.6});
  const pipPhosphateMat=new THREE.MeshStandardMaterial({color:0xff7f8c,roughness:.4});
  for(let i=0;i<6;i++){
    const lipid=new THREE.Group();
    lipid.position.set(1.6+(i%3)*.45,.15,((i/3)|0)*.52-.26);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.11,8,6),pipHeadMat);
    const pA=new THREE.Mesh(new THREE.SphereGeometry(.075,8,6),pipPhosphateMat);
    const pB=new THREE.Mesh(new THREE.SphereGeometry(.075,8,6),pipPhosphateMat);
    pA.position.set(-.11,.16,0); pB.position.set(.12,.18,.03);
    const tail1=new THREE.Mesh(new THREE.CylinderGeometry(.026,.026,.48,5),pipTailMat);
    const tail2=tail1.clone();
    tail1.position.set(-.045,-.3,0); tail2.position.set(.055,-.3,.04);
    [head,pA,pB,tail1,tail2].forEach(o=>{o.userData.structureId="pip2";STATE.selectable.push(o);lipid.add(o);});
    pip2.add(lipid);
  }
  pip2.userData.structureId="pip2";
  pip2.visible=false;
  group.add(pip2); STATE.structureObjects.set("pip2",pip2);

  const ip3=createNucleotide("IP3",0x7ed3ff);
  ip3.position.set(2.1,-1.1,.15);
  ip3.scale.setScalar(.72);
  ip3.userData.structureId="ip3";
  ip3.visible=false;
  ip3.traverse(o=>{if(o.isMesh){o.userData.structureId="ip3";STATE.selectable.push(o);}});
  group.add(ip3); STATE.structureObjects.set("ip3",ip3);

  const dag=new THREE.Group();
  const dagHead=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),new THREE.MeshStandardMaterial({color:0xffba6b,roughness:.45}));
  const dagTailMat=new THREE.MeshStandardMaterial({color:0xd78b50,roughness:.65});
  const dagTail1=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.62,6),dagTailMat);
  const dagTail2=dagTail1.clone();
  dagTail1.position.set(-.05,-.34,0); dagTail2.position.set(.07,-.34,.05);
  [dagHead,dagTail1,dagTail2].forEach(o=>{o.userData.structureId="dag";STATE.selectable.push(o);dag.add(o);});
  dag.position.set(2.2,.28,-.35);
  dag.userData.structureId="dag";
  dag.visible=false;
  group.add(dag); STATE.structureObjects.set("dag",dag);

  const ip3r=new THREE.Group();
  const ip3rMat=new THREE.MeshStandardMaterial({color:0x72b0e9,roughness:.48,transparent:true,opacity:.9});
  for(let i=0;i<4;i++){
    const sub=new THREE.Mesh(new THREE.CapsuleGeometry(.12,1.05,5,10),ip3rMat);
    sub.position.set((i%2-.5)*.34,0,(Math.floor(i/2)-.5)*.34);
    sub.userData.structureId="ip3r";
    ip3r.add(sub); STATE.selectable.push(sub);
  }
  ip3r.position.set(-1.8,-8.2,-2.0);
  ip3r.rotation.z=Math.PI/2;
  ip3r.userData.structureId="ip3r";
  ip3r.visible=false;
  group.add(ip3r); STATE.structureObjects.set("ip3r",ip3r);

  const calcium=new THREE.Group();
  const calciumGeom=new THREE.SphereGeometry(.075,8,6);
  const calciumMat=new THREE.MeshStandardMaterial({color:0x89d8ff,roughness:.35,emissive:0x102536,emissiveIntensity:.4});
  for(let i=0;i<70;i++){
    const ion=new THREE.Mesh(calciumGeom,calciumMat);
    const a=i*2.399963;
    const r=.4+(i%9)*.16;
    ion.position.set(Math.cos(a)*r,(i%11-.5*10)*.1,Math.sin(a)*r*.7);
    ion.userData.structureId="calcium";
    calcium.add(ion); STATE.selectable.push(ion);
  }
  calcium.position.set(-1.8,-8.7,-2.0);
  calcium.userData.structureId="calcium";
  calcium.visible=false;
  group.add(calcium); STATE.structureObjects.set("calcium",calcium);

  const pkc=new THREE.Group();
  const pkcMat=new THREE.MeshStandardMaterial({color:0xe99170,roughness:.48});
  const pkcCore=new THREE.Mesh(new THREE.SphereGeometry(.46,20,14),pkcMat);
  const pkcReg=new THREE.Mesh(new THREE.SphereGeometry(.28,18,12),new THREE.MeshStandardMaterial({color:0xf6c778,roughness:.5}));
  pkcCore.position.x=.22; pkcReg.position.x=-.38;
  [pkcCore,pkcReg].forEach(o=>{o.userData.structureId="pkc";STATE.selectable.push(o);pkc.add(o);});
  pkc.position.set(1.9,-5.4,.8);
  pkc.userData.structureId="pkc";
  pkc.visible=false;
  group.add(pkc); STATE.structureObjects.set("pkc",pkc);

  const rgs=new THREE.Group();
  const rgsMesh=new THREE.Mesh(new THREE.TorusKnotGeometry(.28,.085,48,8),new THREE.MeshStandardMaterial({color:0x9bcf9d,roughness:.54}));
  rgsMesh.userData.structureId="rgs";
  rgs.add(rgsMesh); STATE.selectable.push(rgsMesh);
  rgs.position.set(2.6,-3.3,-.8);
  rgs.userData.structureId="rgs";
  rgs.visible=false;
  group.add(rgs); STATE.structureObjects.set("rgs",rgs);
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
  for (const root of STATE.pathwayRoots.values()) {
    root.traverse((obj)=>{
      if (!obj.userData.kind) return;
      obj.visible = obj.userData.kind === mode;
    });
  }
  if ($("representationSelect")) $("representationSelect").value=mode;
}

function setStructureVisibility(id, visible) {
  const obj=STATE.structureObjects.get(id);
  if(obj) obj.visible=visible;
}

function applyStepVisual(stepIndex) {
  const steps = currentSteps();
  const step = steps[stepIndex];
  if (!step) return;

  resetObjectTransforms();
  applyMolecularPathwayVisibility(STATE.pathway);

  const id = step.id;
  const ligand=STATE.structureObjects.get("ligand");
  const galpha=STATE.structureObjects.get("galpha");
  const gbeta=STATE.structureObjects.get("gbeta");
  const ggamma=STATE.structureObjects.get("ggamma");
  const gdp=STATE.structureObjects.get("gdp");
  const gtp=STATE.structureObjects.get("gtp");
  const effector=STATE.structureObjects.get("effector");
  const camp=STATE.structureObjects.get("camp");
  const pka=STATE.structureObjects.get("pka");
  const atp=STATE.structureObjects.get("atp");
  const plc=STATE.structureObjects.get("plc");
  const pip2=STATE.structureObjects.get("pip2");
  const ip3=STATE.structureObjects.get("ip3");
  const dag=STATE.structureObjects.get("dag");
  const ip3r=STATE.structureObjects.get("ip3r");
  const calcium=STATE.structureObjects.get("calcium");
  const pkc=STATE.structureObjects.get("pkc");
  const rgs=STATE.structureObjects.get("rgs");

  const isResting = /RESTING|INACTIVE|RESET$/.test(id);
  const isLigand = /LIGAND/.test(id);
  const isGdpRelease = /GDP_RELEASE/.test(id);
  const isGtpBinding = /GTP_BINDING/.test(id);
  const isActiveG = /ACTIVE|ACTIVATION|AC_INHIBITION|PLC_RECRUIT|PIP2|CLEAVAGE|IP3|CA_RELEASE|DAG|PKC|RESPONSE/.test(id);
  const isTermination = /TERMINATION/.test(id);
  const isReassembly = /REASSEMBLY/.test(id);

  if (STATE.membraneGroup) STATE.membraneGroup.visible = true;

  const organelleIds=["nucleus","mitochondria","er","golgi","ribosomes","vesicles","cytoskeleton"];
  const showWholeCell = step.scale === "cell" || isResting;
  if (STATE.cellGroup) STATE.cellGroup.visible = showWholeCell || STATE.pathway === "gq";

  organelleIds.forEach((structureId) => {
    const object=STATE.structureObjects.get(structureId);
    if (!object) return;
    if (STATE.pathway === "gq" && structureId === "er") {
      object.visible = showWholeCell || /IP3|CA_RELEASE|RESPONSE/.test(id);
    } else {
      object.visible = showWholeCell;
    }
  });

  if (ligand) {
    ligand.visible = isLigand || /RECRUITMENT|GPCR_ACTIVATED/.test(id);
    const base = STATE.baseTransforms.get("ligand");
    if (base) ligand.position.copy(base.position);
    if (/APPROACH/.test(id) || id === "LIGAND_BINDING") ligand.position.y += 2.2;
    if (/BINDING$|GPCR_ACTIVATED/.test(id)) ligand.position.y += .25;
  }

  if (gdp) {
    gdp.visible = isResting || isGdpRelease || isTermination || isReassembly;
    const base=STATE.baseTransforms.get("gdp");
    if(base) gdp.position.copy(base.position);
    if (isGdpRelease) gdp.position.add(new THREE.Vector3(1.8,.3,.8));
  }

  if (gtp) {
    gtp.visible = isGtpBinding || isActiveG || isTermination;
    const base=STATE.baseTransforms.get("gtp");
    if(base) gtp.position.copy(base.position);
    if (isGtpBinding) gtp.position.set(.8,-2.6,.1);
  }

  if (galpha) {
    const base=STATE.baseTransforms.get("galpha");
    if(base) galpha.position.copy(base.position);
    if (isActiveG || isTermination) galpha.position.x += STATE.pathway === "gq" ? 1.2 : 2.2;
  }
  if (gbeta) {
    const base=STATE.baseTransforms.get("gbeta");
    if(base) gbeta.position.copy(base.position);
    if (isActiveG || isTermination) gbeta.position.x -= .45;
  }
  if (ggamma) {
    const base=STATE.baseTransforms.get("ggamma");
    if(base) ggamma.position.copy(base.position);
    if (isActiveG || isTermination) ggamma.position.x -= .45;
  }

  if (effector) {
    effector.visible = STATE.pathway !== "gq" && (
      /EFFECTOR|AC_INHIBITION|SECOND_MESSENGER|CAMP_DOWN|CELLULAR_RESPONSE/.test(id)
    );
  }

  if (atp) atp.visible = STATE.pathway === "gs" && /EFFECTOR|SECOND_MESSENGER/.test(id);
  if (camp) {
    camp.visible = STATE.pathway === "gs"
      ? /SECOND_MESSENGER|CELLULAR_RESPONSE/.test(id)
      : STATE.pathway === "gi" && /CAMP_DOWN/.test(id);
    camp.scale.setScalar(STATE.pathway === "gi" ? .48 : 1);
  }
  if (pka) pka.visible = STATE.pathway === "gs" && /CELLULAR_RESPONSE/.test(id);

  if (plc) {
    plc.visible = STATE.pathway === "gq" && /PLC_RECRUIT|PIP2|CLEAVAGE|IP3|CA_RELEASE|DAG|PKC|RESPONSE/.test(id);
  }
  if (pip2) pip2.visible = STATE.pathway === "gq" && /PIP2|CLEAVAGE/.test(id);
  if (dag) dag.visible = STATE.pathway === "gq" && /CLEAVAGE|DAG|PKC|RESPONSE/.test(id);
  if (ip3) {
    ip3.visible = STATE.pathway === "gq" && /CLEAVAGE|IP3/.test(id);
    const base=STATE.baseTransforms.get("ip3");
    if(base) ip3.position.copy(base.position);
    if (/IP3_DIFFUSION/.test(id)) ip3.position.set(.2,-5.1,-.8);
    if (/IP3R/.test(id)) ip3.position.set(-1.6,-8.0,-1.9);
  }
  if (ip3r) ip3r.visible = STATE.pathway === "gq" && /IP3R|CA_RELEASE/.test(id);
  if (calcium) {
    calcium.visible = STATE.pathway === "gq" && /CA_RELEASE|PKC|RESPONSE/.test(id);
    const base=STATE.baseTransforms.get("calcium");
    if(base) calcium.position.copy(base.position);
    if (/CA_RELEASE/.test(id)) calcium.position.set(-1.1,-6.9,-1.5);
    if (/PKC|RESPONSE/.test(id)) calcium.position.set(.6,-4.6,-.2);
  }
  if (pkc) {
    pkc.visible = STATE.pathway === "gq" && /PKC|RESPONSE/.test(id);
    const base=STATE.baseTransforms.get("pkc");
    if(base) pkc.position.copy(base.position);
    if (/PKC/.test(id)) pkc.position.set(1.9,-1.4,.45);
  }
  if (rgs) rgs.visible = isTermination;

  if (STATE.pathway === "gi" && camp?.visible) {
    camp.children.forEach((child,index)=>{ child.visible = index < 9; });
  } else if (camp) {
    camp.children.forEach((child)=>{ child.visible = true; });
  }

  setRepresentation(STATE.representation);
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
  const steps=currentSteps();
  const step=steps[index];
  if(!step) return;
  $("stepEyebrow").textContent="ETAPA "+(index+1)+" · "+step.scale.toUpperCase();
  $("stepTitle").textContent=step.title;
  $("timelineLabel").textContent=(index+1)+" / "+steps.length;
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
  const steps=currentSteps();
  index=Math.max(0,Math.min(steps.length-1,index));
  STATE.stepIndex=index;
  const step=steps[index];
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
  const steps=currentSteps();
  const step=steps[STATE.stepIndex];
  if(!step) return;
  const delay=Math.max(650,step.duration/STATE.speed);
  STATE.playTimer=setTimeout(()=>{
    if(STATE.stepIndex>=steps.length-1){
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
  const steps=currentSteps();
  $("stepStrip").innerHTML=steps.map((step,index)=>
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
  setLoading(10,"Preparando visualização científica","lendo metadados estruturais de Gs, Gi e Gq");
  const manifestResponse=await fetch("/data/gprotein/manifest.json?v=2",{cache:"no-cache"});
  if(!manifestResponse.ok) throw new Error("Manifesto 3SN6 indisponível.");
  STATE.pdbManifest=await manifestResponse.json();

  setLoading(28,"Estrutura experimental","baixando coordenadas atômicas 3SN6");
  const pdbResponse=await fetch("/data/gprotein/3SN6.pdb?v=2",{cache:"force-cache"});
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
  applyMolecularPathwayVisibility("gs");
  buildStepStrip();
  if ($("timelineSlider")) $("timelineSlider").max=String(currentSteps().length-1);
  updatePathwayScienceUi();
  applyStep(0,{camera:false});
  setLoading(100,"Laboratório pronto","estruturas experimentais e cena educacional carregadas");
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
  $("[data-pathway]").forEach((btn)=>btn.addEventListener("click",()=>switchPathway(btn.dataset.pathway)));
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
      const nucleus = STATE.structureObjects.get("nucleus");
      const mitochondria = STATE.structureObjects.get("mitochondria");
      const vesicles = STATE.structureObjects.get("vesicles");
      const golgi = STATE.structureObjects.get("golgi");
      const ribosomes = STATE.structureObjects.get("ribosomes");
      const cytoskeleton = STATE.structureObjects.get("cytoskeleton");

      if (nucleus) nucleus.rotation.y = Math.sin(t * .12) * .03;
      if (mitochondria) mitochondria.rotation.y = Math.sin(t * .22) * .04;
      if (vesicles) vesicles.rotation.y = t * .05;
      if (golgi) golgi.rotation.y = Math.sin(t * .18) * .025;
      if (ribosomes) ribosomes.rotation.y = Math.sin(t * .15) * .02;
      if (cytoskeleton) cytoskeleton.rotation.z = Math.sin(t * .08) * .01;
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
