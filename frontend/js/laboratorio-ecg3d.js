import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

const byId = function (id) {
  return document.getElementById(id);
};

const all = function (selector, root) {
  return Array.from((root || document).querySelectorAll(selector));
};

const clamp = function (value, min, max) {
  return Math.min(Math.max(value, min), max);
};

const TAU = Math.PI * 2;

const COLORS = {
  cyan: "#22d3ee",
  cyan2: "#5eead4",
  red: "#ff5665",
  yellow: "#f8c94f",
  green: "#34d399",
  purple: "#a78bfa",
  pink: "#ec4899",
  blue: "#38bdf8",
  orange: "#fb923c",
  white: "#f8fafc",
  muted: "#94a3b8"
};

const LAB_STATE = {
  section: "simulator",
  fundamentalPart: "paper",
  phaseIndex: 4,
  phasePlaying: false,
  phaseTimer: null,
  qrsStep: 0,
  axisMode: "all",
  posteriorLeads: false,
  rightLeads: false,
  guidedStep: 0,
  patternId: "p-wave",
  paperSpeed: 25,
  paperGain: 10,
  ecgTime: 0,
  ecgLastFrame: performance.now(),
  ecgLastDraw: 0,
  ecgBpmBase: 72,
  ecgHover: null,
  ecgHoverPinned: false,
  lastSoundS1Beat: -1,
  lastSoundS2Beat: -1
};

const PHASES = [
  {
    badge: "Linha de base: repouso elétrico",
    step: "1. Repouso",
    title: "Linha isoelétrica",
    text: "Entre os ciclos, não há um vetor cardíaco dominante. O traçado retorna à linha de base enquanto o miocárdio se prepara para um novo disparo.",
    heartText: "repouso elétrico",
    progress: 0.02
  },
  {
    badge: "Onda P: despolarização atrial",
    step: "2. Onda P",
    title: "Ativação dos átrios",
    text: "O impulso parte do nó sinusal e se espalha pelos átrios. Essa atividade elétrica aparece no papel como a onda P.",
    heartText: "átrios ativados",
    progress: 0.09
  },
  {
    badge: "PR: condução pelo nó AV",
    step: "3. Segmento PR",
    title: "Atraso fisiológico no nó AV",
    text: "O impulso desacelera no nó AV antes de seguir pelo feixe de His. Esse atraso permite que o enchimento ventricular se complete.",
    heartText: "condução AV",
    progress: 0.15
  },
  {
    badge: "QRS: ativação inicial do septo",
    step: "4. Pré-QRS",
    title: "Preparação para o QRS",
    text: "O sistema His–Purkinje distribui rapidamente o impulso aos ventrículos, preparando o início da despolarização ventricular.",
    heartText: "His–Purkinje",
    progress: 0.19
  },
  {
    badge: "QRS: despolarização ventricular",
    step: "5. Vetor 1",
    title: "Início do QRS: septo",
    text: "O primeiro vetor representa o início da despolarização ventricular. Pelo sistema His–Purkinje, o impulso chega ao septo e a ativação inicial segue predominantemente da esquerda para a direita.",
    heartText: "septo",
    progress: 0.225
  },
  {
    badge: "QRS: paredes e ápice",
    step: "6. Vetor 2",
    title: "Meio do QRS: paredes e ápice",
    text: "A maior massa ventricular passa a dominar o vetor. A ativação se dirige para o ápice e para as paredes livres, produzindo a maior parte da amplitude do QRS.",
    heartText: "paredes e ápice",
    progress: 0.27
  },
  {
    badge: "QRS: bases ventriculares",
    step: "7. Vetor 3",
    title: "Fim do QRS: bases",
    text: "As regiões basais são ativadas por último. O vetor líquido diminui progressivamente até o complexo QRS retornar à linha de base.",
    heartText: "bases ventriculares",
    progress: 0.33
  },
  {
    badge: "Segmento ST: ventrículos despolarizados",
    step: "8. Platô",
    title: "Tudo despolarizado",
    text: "Com grande parte dos ventrículos despolarizada ao mesmo tempo, há pouca diferença de potencial entre regiões e o vetor líquido fica próximo de zero.",
    heartText: "platô ventricular",
    progress: 0.40
  },
  {
    badge: "Onda T: repolarização ventricular",
    step: "9. Onda T",
    title: "Recuperação elétrica",
    text: "A repolarização ventricular gera a onda T. O vetor observado depende da sequência de recuperação das células ventriculares.",
    heartText: "repolarização",
    progress: 0.51
  },
  {
    badge: "TP: retorno à linha de base",
    step: "10. Intervalo TP",
    title: "Novo ciclo",
    text: "A atividade elétrica retorna ao repouso até um novo disparo do nó sinusal reiniciar a sequência.",
    heartText: "intervalo TP",
    progress: 0.75
  }
];

const QRS_MOMENTS = [4, 5, 6];

const GUIDED_STEPS = [
  {
    title: "Ritmo",
    subtitle: "Regular ou irregular?",
    question: "Os batimentos seguem um padrão regular ou irregular? Existe uma onda P antes de cada QRS?",
    info: "No ritmo sinusal, há uma onda P de morfologia semelhante antes de cada QRS, com relação P–QRS preservada e ciclos regulares."
  },
  {
    title: "Eixo",
    subtitle: "Qual o eixo elétrico?",
    question: "Qual é a direção média da despolarização ventricular no plano frontal?",
    info: "Observe DI e aVF como ponto de partida. Um QRS positivo em ambas costuma ser compatível com eixo dentro da faixa habitual."
  },
  {
    title: "Frequência",
    subtitle: "Quantos batimentos por minuto?",
    question: "Meça o intervalo R–R e estime a frequência cardíaca usando a velocidade do papel.",
    info: "Em ritmo regular a 25 mm/s, uma regra prática é dividir 300 pelo número de quadrados grandes entre dois picos R."
  },
  {
    title: "Onda P",
    subtitle: "Morfologia e relação com o QRS",
    question: "Há onda P antes de cada QRS? A morfologia e a polaridade são coerentes entre os ciclos?",
    info: "Compare duração, amplitude e forma. Alterações de morfologia devem ser interpretadas junto ao contexto clínico e às demais derivações."
  },
  {
    title: "Intervalo PR",
    subtitle: "Está normal?",
    question: "O intervalo entre o início da onda P e o início do QRS é constante e proporcional?",
    info: "O PR representa a condução atrioventricular. Meça do início da P ao início do QRS em uma derivação com limites bem definidos."
  },
  {
    title: "Complexo QRS",
    subtitle: "Duração e morfologia",
    question: "O QRS é estreito ou alargado? Como é a progressão de R nas precordiais?",
    info: "A duração e a morfologia do QRS ajudam a reconhecer atrasos de condução e padrões de ativação ventricular."
  },
  {
    title: "Segmento ST",
    subtitle: "Elevação ou depressão?",
    question: "O segmento ST está próximo da linha isoelétrica ou há deslocamento significativo em derivações contíguas?",
    info: "Compare o ST com uma linha de base estável e interprete qualquer alteração em conjunto com derivações contíguas e contexto."
  },
  {
    title: "Intervalo QT",
    subtitle: "Está no intervalo esperado?",
    question: "O QT parece proporcional à frequência cardíaca ou está claramente prolongado ou encurtado?",
    info: "O QT inclui despolarização e repolarização ventriculares. A interpretação clínica costuma considerar correção pela frequência."
  },
  {
    title: "Onda T",
    subtitle: "Polaridade e alterações",
    question: "A onda T é concordante com o QRS? Há inversão, apiculamento ou padrão bifásico?",
    info: "A onda T representa repolarização ventricular. Forma e polaridade devem ser avaliadas considerando derivações, eletrólitos e contexto."
  }
];

const PATTERNS = [
  {
    id: "p-wave",
    title: "Onda P",
    subtitle: "Duração e amplitude",
    kind: "p",
    detailTitle: "Onda P: duração e amplitude",
    detailText: "Compare a morfologia normal da onda P com padrões didáticos associados a maior contribuição atrial direita ou esquerda.",
    tags: ["P normal", "P bífida", "P alta"]
  },
  {
    id: "alternans",
    title: "Alternância elétrica",
    subtitle: "Variação batimento a batimento",
    kind: "alternans",
    detailTitle: "Alternância elétrica",
    detailText: "Modelo didático com variação cíclica da amplitude dos complexos. A interpretação real depende do contexto e do conjunto do traçado.",
    tags: ["amplitude variável", "QRS", "comparar ciclos"]
  },
  {
    id: "r-progression",
    title: "V1–V6: R cresce e S diminui",
    subtitle: "Progressão da onda R",
    kind: "r-progression",
    detailTitle: "Progressão da onda R nas precordiais",
    detailText: "A transição de V1 a V6 costuma mostrar aumento relativo da onda R e redução da onda S. O padrão varia com posição e anatomia.",
    tags: ["V1–V6", "transição", "precordiais"]
  },
  {
    id: "pathologic-q",
    title: "Onda Q patológica",
    subtitle: "Critérios e significados",
    kind: "q",
    detailTitle: "Ondas Q: comparação visual",
    detailText: "Observe profundidade, largura e distribuição da onda Q. Um padrão isolado não deve ser interpretado sem as demais derivações.",
    tags: ["onda Q", "largura", "profundidade"]
  },
  {
    id: "bundle",
    title: "Bloqueios de ramo",
    subtitle: "BRD e BRE",
    kind: "bundle",
    detailTitle: "Bloqueios de ramo",
    detailText: "O atraso na condução intraventricular alarga e modifica o QRS. A morfologia difere entre bloqueio direito e esquerdo.",
    tags: ["QRS largo", "BRD", "BRE"]
  },
  {
    id: "delta",
    title: "Pré-excitação e onda delta",
    subtitle: "Wolff–Parkinson–White",
    kind: "delta",
    detailTitle: "Pré-excitação e onda delta",
    detailText: "Modelo didático com início lento do QRS e PR mais curto. A interpretação definitiva exige critérios e contexto apropriados.",
    tags: ["PR", "onda delta", "pré-excitação"]
  },
  {
    id: "low-voltage",
    title: "Baixa voltagem",
    subtitle: "Causas e contexto",
    kind: "low",
    detailTitle: "Baixa voltagem",
    detailText: "Compare a amplitude dos complexos com um traçado de referência. A causa não pode ser inferida apenas pelo desenho esquemático.",
    tags: ["amplitude", "QRS", "contexto"]
  },
  {
    id: "infarction",
    title: "Evolução do ECG no infarto (IAM)",
    subtitle: "Fases e alterações",
    kind: "st",
    detailTitle: "Alterações de ST e T",
    detailText: "Visualização didática de alterações de ST/T ao longo do tempo. Diagnóstico real exige quadro clínico, derivações contíguas e critérios validados.",
    tags: ["ST", "T", "derivações contíguas"]
  },
  {
    id: "potassium",
    title: "Hipocalemia e hipercalemia",
    subtitle: "Alterações no QT, ST e T",
    kind: "potassium",
    detailTitle: "Potássio e repolarização",
    detailText: "Modelos didáticos destacam mudanças na onda T e na duração do complexo conforme alterações eletrolíticas.",
    tags: ["onda T", "eletrólitos", "repolarização"]
  },
  {
    id: "biphasic-t",
    title: "T bifásica: sobe–desce e desce–sobe",
    subtitle: "Reconhecimento e significado",
    kind: "biphasic",
    detailTitle: "Onda T bifásica",
    detailText: "Compare padrões sobe–desce e desce–sobe. A distribuição nas derivações e o contexto determinam o significado clínico.",
    tags: ["T bifásica", "polaridade", "contexto"]
  },
  {
    id: "wellens",
    title: "Padrão de Wellens",
    subtitle: "Padrão de T anterior",
    kind: "wellens",
    detailTitle: "Padrão de Wellens",
    detailText: "Visualização educacional de ondas T anteriores características. Suspeitas clínicas exigem avaliação médica urgente e critérios completos.",
    tags: ["V2–V4", "onda T", "anterior"]
  },
  {
    id: "sinus-nodal",
    title: "Ritmo sinusal × ritmo nodal",
    subtitle: "Diferenças no traçado",
    kind: "nodal",
    detailTitle: "Ritmo sinusal e ritmo nodal",
    detailText: "Compare a relação entre onda P e QRS. Ritmos nodais podem apresentar P ausente, retrógrada ou em posição diferente em relação ao QRS.",
    tags: ["ritmo", "onda P", "QRS"]
  }
];

const LEAD_AXES = [
  { id: "DI", short: "DI +", plane: "frontal", angle: 0, color: "#ff375f" },
  { id: "DII", short: "DII +", plane: "frontal", angle: 60, color: "#22d3ee" },
  { id: "DIII", short: "DIII +", plane: "frontal", angle: 120, color: "#eab308" },
  { id: "aVR", short: "aVR +", plane: "frontal", angle: -150, color: "#c084fc" },
  { id: "aVL", short: "aVL +", plane: "frontal", angle: -30, color: "#ec4899" },
  { id: "aVF", short: "aVF +", plane: "frontal", angle: 90, color: "#3b82f6" },
  { id: "V1", short: "V1", plane: "horizontal", angle: 160, color: "#f97316" },
  { id: "V2", short: "V2", plane: "horizontal", angle: 140, color: "#f59e0b" },
  { id: "V3", short: "V3", plane: "horizontal", angle: 116, color: "#22c55e" },
  { id: "V4", short: "V4", plane: "horizontal", angle: 86, color: "#10b981" },
  { id: "V5", short: "V5", plane: "horizontal", angle: 55, color: "#0ea5e9" },
  { id: "V6", short: "V6", plane: "horizontal", angle: 20, color: "#8b5cf6" }
];

const EXTRA_AXES = [
  { id: "V7", short: "V7", plane: "horizontal", angle: -8, color: "#a855f7", group: "posterior" },
  { id: "V8", short: "V8", plane: "horizontal", angle: -28, color: "#c084fc", group: "posterior" },
  { id: "V9", short: "V9", plane: "horizontal", angle: -48, color: "#d8b4fe", group: "posterior" },
  { id: "V3R", short: "V3R", plane: "horizontal", angle: 215, color: "#fb7185", group: "right" },
  { id: "V4R", short: "V4R", plane: "horizontal", angle: 238, color: "#f43f5e", group: "right" }
];

const LEAD_DIRECTIONS = {
  DI: 0,
  DII: 60,
  DIII: 120,
  aVR: -150,
  aVL: -30,
  aVF: 90
};

async function loadCurrentUser() {
  try {
    const response = await fetch("/api/auth/me", { credentials: "same-origin" });
    if (response.status === 401) {
      location.href = "/login.html";
      return;
    }
    if (!response.ok) return;
    const data = await response.json();
    const user = data.usuario || {};
    const name = user.nome || "Usuário";
    const initial = name.charAt(0).toUpperCase();

    if (byId("nomeSidebar")) byId("nomeSidebar").textContent = name;
    if (byId("emailSidebar")) byId("emailSidebar").textContent = user.email || "";
    if (byId("nomeHeader")) byId("nomeHeader").textContent = name;
    if (byId("avatarSidebar")) byId("avatarSidebar").textContent = initial;
    if (byId("avatarHeader")) byId("avatarHeader").textContent = initial;
  } catch (error) {
    console.error("Falha ao carregar usuário:", error);
  }
}

async function logout() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin"
    });
  } finally {
    location.href = "/login.html";
  }
}

function setupSectionTabs() {
  all("[data-lab-section]").forEach(function (button) {
    button.addEventListener("click", function () {
      setLabSection(button.dataset.labSection);
    });
  });

  all("[data-jump-section]").forEach(function (button) {
    button.addEventListener("click", function () {
      setLabSection(button.dataset.jumpSection);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  const support = byId("supportButton");
  if (support) {
    support.addEventListener("click", function () {
      setLabSection("fundamentals");
      setFundamentalPart("signal");
    });
  }
}

function setLabSection(section) {
  LAB_STATE.section = section;
  all("[data-lab-section]").forEach(function (button) {
    button.classList.toggle("active", button.dataset.labSection === section);
  });
  all("[data-section-panel]").forEach(function (panel) {
    const active = panel.dataset.sectionPanel === section;
    panel.hidden = !active;
    panel.classList.toggle("active", active);
  });

  if (section === "simulator") {
    requestAnimationFrame(function () {
      resizeThree();
      drawEcgMatrix();
    });
  }
  if (section === "fundamentals") {
    requestAnimationFrame(drawFundamentals);
  }
  if (section === "guided") {
    requestAnimationFrame(drawGuided);
  }
  if (section === "patterns") {
    requestAnimationFrame(drawPatterns);
  }
}

function setupFundamentalParts() {
  all("[data-fundamental-part]").forEach(function (button) {
    button.addEventListener("click", function () {
      setFundamentalPart(button.dataset.fundamentalPart);
    });
  });
}

function setFundamentalPart(part) {
  LAB_STATE.fundamentalPart = part;
  all("[data-fundamental-part]").forEach(function (button) {
    button.classList.toggle("active", button.dataset.fundamentalPart === part);
  });
  all(".fundamental-part").forEach(function (panel) {
    panel.hidden = panel.id !== "fundamentalPart-" + part;
  });
  requestAnimationFrame(drawFundamentals);
}

/* =========================================================
   3D HEART
========================================================= */

let scene;
let camera;
let renderer;
let labelRenderer;
let controls;
let heartModel;
let heartRoot;
let axisRoot;
let extraAxisRoot;
let conductionRoot;
let vectorArrow;
let signalDot;
let activationGlow;
let modelMaterials = [];
let animationHandle;
let cutawayEnabled = true;
let audioContext = null;
let soundEnabled = false;

const clippingPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.18);

function makeTextLabel(text, className, color) {
  const element = document.createElement("div");
  element.className = className;
  element.textContent = text;
  if (color) element.style.color = color;
  return new CSS2DObject(element);
}

function initHeart3D() {
  const host = byId("heart3dHost");
  if (!host) return;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0.15, 7.4);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.localClippingEnabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  host.prepend(renderer.domElement);

  labelRenderer = new CSS2DRenderer();
  labelRenderer.domElement.className = "heart-css-label-layer";
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.inset = "0";
  labelRenderer.domElement.style.pointerEvents = "none";
  host.appendChild(labelRenderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minDistance = 4.6;
  controls.maxDistance = 10;
  controls.target.set(0, 0, 0);
  controls.autoRotate = false;

  const hemi = new THREE.HemisphereLight(0xffe8df, 0x07101b, 1.35);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffcab7, 3.2);
  key.position.set(4, 5, 6);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x9edbff, 1.25);
  fill.position.set(-5, 2, 3);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xff6272, 1.6);
  rim.position.set(-3, 1, -5);
  scene.add(rim);

  const top = new THREE.PointLight(0xffbfa8, 1.5, 16);
  top.position.set(0, 4, 1);
  scene.add(top);

  heartRoot = new THREE.Group();
  axisRoot = new THREE.Group();
  extraAxisRoot = new THREE.Group();
  conductionRoot = new THREE.Group();

  scene.add(heartRoot);
  scene.add(axisRoot);
  scene.add(extraAxisRoot);
  scene.add(conductionRoot);

  buildAxes();
  buildConductionPath();
  loadHeartModel();
  setupHeartControls();

  resizeThree();
  animateThree();
}

function loadHeartModel() {
  const loader = new GLTFLoader();
  const loading = byId("heartModelLoading");
  const urls = [
    "/models/heart.glb?v=20261002-1758",
    "https://raw.githubusercontent.com/yihalem123/Human-Organ3D/main/models/heart.glb",
    "https://cdn.jsdelivr.net/gh/yihalem123/Human-Organ3D@main/models/heart.glb"
  ];

  function tryUrl(index) {
    if (index >= urls.length) {
      if (loading) {
        loading.classList.add("error");
        loading.innerHTML = "<strong>Não foi possível carregar o modelo anatômico.</strong><small>Tente recarregar a página. O simulador não usa coração geométrico como fallback.</small>";
      }
      return;
    }

    loader.load(
      urls[index],
      function (gltf) {
        heartModel = gltf.scene;

        const box = new THREE.Box3().setFromObject(heartModel);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        heartModel.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 3.25 / maxDim;
        heartModel.scale.setScalar(scale);
        heartModel.userData.baseScale = scale;

        heartModel.rotation.set(-0.10, -0.28, -0.08);

        modelMaterials = [];
        heartModel.traverse(function (object) {
          if (!object.isMesh) return;

          object.castShadow = false;
          object.receiveShadow = false;

          const original = Array.isArray(object.material) ? object.material : [object.material];
          const cloned = original.map(function (material) {
            const next = material.clone();
            next.side = THREE.DoubleSide;
            next.clippingPlanes = cutawayEnabled ? [clippingPlane] : [];
            next.clipIntersection = false;
            next.needsUpdate = true;
            if ("roughness" in next) next.roughness = Math.min(0.78, next.roughness == null ? 0.65 : next.roughness);
            if ("metalness" in next) next.metalness = 0.02;
            modelMaterials.push(next);
            return next;
          });

          object.material = Array.isArray(object.material) ? cloned : cloned[0];
        });

        heartRoot.add(heartModel);
        buildChamberLabels();

        if (gltf.animations && gltf.animations.length) {
          const mixer = new THREE.AnimationMixer(heartModel);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
          heartRoot.userData.mixer = mixer;
        }

        if (loading) loading.classList.add("loaded");
        updateHeartElectricalState();
      },
      function (progressEvent) {
        if (!loading || !progressEvent || !progressEvent.total) return;
        const percent = Math.round(progressEvent.loaded / progressEvent.total * 100);
        const small = loading.querySelector("small");
        if (small) {
          small.textContent = "Modelo anatômico otimizado · " + percent + "%";
        }
      },
      function () {
        tryUrl(index + 1);
      }
    );
  }

  tryUrl(0);
}

function applyCutaway() {
  modelMaterials.forEach(function (material) {
    material.clippingPlanes = cutawayEnabled ? [clippingPlane] : [];
    material.needsUpdate = true;
  });
}

function buildChamberLabels() {
  const labels = [
    ["AD", -0.55, 0.44, 0.55],
    ["AE", 0.48, 0.56, 0.42],
    ["VD", -0.38, -0.48, 0.70],
    ["VE", 0.48, -0.40, 0.55]
  ];

  labels.forEach(function (entry) {
    const anchor = new THREE.Object3D();
    anchor.position.set(entry[1], entry[2], entry[3]);
    const label = makeTextLabel(entry[0], "heart-label");
    anchor.add(label);
    heartRoot.add(anchor);
  });
}

function circlePoints(radius, plane) {
  const points = [];
  for (let i = 0; i <= 120; i += 1) {
    const angle = TAU * i / 120;
    if (plane === "frontal") {
      points.push(new THREE.Vector3(radius * Math.cos(angle), radius * Math.sin(angle), 0));
    } else {
      points.push(new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle)));
    }
  }
  return points;
}

function buildAxes() {
  axisRoot.clear();
  extraAxisRoot.clear();

  function addCircle(plane, color) {
    const geometry = new THREE.BufferGeometry().setFromPoints(circlePoints(2.18, plane));
    const material = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.28
    });
    axisRoot.add(new THREE.Line(geometry, material));
  }

  addCircle("frontal", 0x63758a);
  addCircle("horizontal", 0x63758a);

  LEAD_AXES.forEach(function (lead) {
    addLeadAxis(axisRoot, lead);
  });

  EXTRA_AXES.forEach(function (lead) {
    const object = addLeadAxis(extraAxisRoot, lead);
    object.visible = false;
    object.userData.group = lead.group;
  });

  updateAxisVisibility();
}

function addLeadAxis(parent, lead) {
  const angle = lead.angle * Math.PI / 180;
  const radius = 2.28;
  let end;

  if (lead.plane === "frontal") {
    end = new THREE.Vector3(radius * Math.cos(angle), -radius * Math.sin(angle), 0);
  } else {
    end = new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    end
  ]);

  const material = new THREE.LineBasicMaterial({
    color: new THREE.Color(lead.color),
    transparent: true,
    opacity: 0.78
  });

  const group = new THREE.Group();
  const line = new THREE.Line(geometry, material);
  group.add(line);

  const labelAnchor = new THREE.Object3D();
  labelAnchor.position.copy(end.clone().multiplyScalar(1.08));
  const label = makeTextLabel(lead.short, "heart-axis-label", lead.color);
  labelAnchor.add(label);
  group.add(labelAnchor);

  group.userData.lead = lead;
  parent.add(group);
  return group;
}

function updateAxisVisibility() {
  if (!axisRoot || !extraAxisRoot) return;

  axisRoot.children.forEach(function (child) {
    if (!child.userData || !child.userData.lead) return;
    const lead = child.userData.lead;
    child.visible =
      LAB_STATE.axisMode === "all" ||
      LAB_STATE.axisMode === lead.plane;
  });

  extraAxisRoot.children.forEach(function (child) {
    if (!child.userData || !child.userData.lead) return;
    const lead = child.userData.lead;
    const groupAllowed =
      (lead.group === "posterior" && LAB_STATE.posteriorLeads) ||
      (lead.group === "right" && LAB_STATE.rightLeads);
    const planeAllowed =
      LAB_STATE.axisMode === "all" ||
      LAB_STATE.axisMode === lead.plane;
    child.visible = groupAllowed && planeAllowed;
  });
}

function buildConductionPath() {
  conductionRoot.clear();

  const points = [
    new THREE.Vector3(-0.44, 0.70, 0.70),
    new THREE.Vector3(-0.28, 0.35, 0.75),
    new THREE.Vector3(-0.10, 0.05, 0.74),
    new THREE.Vector3(0.02, -0.18, 0.73),
    new THREE.Vector3(-0.30, -0.58, 0.72),
    new THREE.Vector3(0.28, -0.72, 0.68)
  ];

  const curve = new THREE.CatmullRomCurve3(points);
  const tube = new THREE.TubeGeometry(curve, 70, 0.016, 6, false);
  const material = new THREE.MeshBasicMaterial({
    color: 0xf8c94f,
    transparent: true,
    opacity: 0.78
  });
  const mesh = new THREE.Mesh(tube, material);
  conductionRoot.add(mesh);

  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffb5 });
  signalDot = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 14), dotMaterial);
  conductionRoot.add(signalDot);

  activationGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 24, 24),
    new THREE.MeshBasicMaterial({
      color: 0xf8c94f,
      transparent: true,
      opacity: 0.24,
      depthWrite: false
    })
  );
  activationGlow.scale.set(1.8, 1.8, 1.8);
  conductionRoot.add(activationGlow);

  conductionRoot.userData.curve = curve;

  const saAnchor = new THREE.Object3D();
  saAnchor.position.copy(points[0]);
  const saLabel = makeTextLabel("SA", "heart-label");
  saAnchor.add(saLabel);
  conductionRoot.add(saAnchor);

  const avAnchor = new THREE.Object3D();
  avAnchor.position.copy(points[1]);
  const avLabel = makeTextLabel("AV", "heart-label");
  avAnchor.add(avLabel);
  conductionRoot.add(avAnchor);

  vectorArrow = new THREE.ArrowHelper(
    new THREE.Vector3(1, -0.2, 0.1).normalize(),
    new THREE.Vector3(0, 0, 0.9),
    0.82,
    0xffffff,
    0.16,
    0.09
  );
  conductionRoot.add(vectorArrow);
}

function vectorForPhase(index) {
  const vectors = [
    new THREE.Vector3(0.1, 0.1, 0.2),
    new THREE.Vector3(0.2, -0.4, 0.1),
    new THREE.Vector3(0.0, -0.55, 0.05),
    new THREE.Vector3(0.2, -0.45, 0.1),
    new THREE.Vector3(0.75, -0.12, 0.15),
    new THREE.Vector3(-0.5, -0.78, 0.10),
    new THREE.Vector3(-0.25, 0.55, -0.08),
    new THREE.Vector3(0.05, 0.0, 0.0),
    new THREE.Vector3(-0.5, -0.55, 0.05),
    new THREE.Vector3(0.05, 0.05, 0.0)
  ];
  return vectors[index] || vectors[0];
}

function updateHeartElectricalState(cycleProgress) {
  if (!conductionRoot) return;

  const phase = PHASES[LAB_STATE.phaseIndex];
  const progress = typeof cycleProgress === "number"
    ? cycleProgress
    : phase.progress;

  const curve = conductionRoot.userData.curve;
  if (curve && signalDot) {
    const electricalWindow = clamp((progress - 0.045) / 0.38, 0, 1);
    const point = curve.getPointAt(electricalWindow);
    signalDot.position.copy(point);

    const activeElectrical =
      progress >= 0.045 &&
      progress <= 0.62;

    signalDot.visible = activeElectrical;

    if (activationGlow) {
      activationGlow.position.copy(point);
      activationGlow.visible = activeElectrical;

      const qrsEnergy = Math.exp(-Math.pow((progress - 0.255) / 0.075, 2));
      const atrialEnergy = Math.exp(-Math.pow((progress - 0.11) / 0.055, 2));
      const energy = Math.max(qrsEnergy, atrialEnergy * 0.55);
      const glowScale = 1.4 + energy * 2.1;

      activationGlow.scale.set(glowScale, glowScale, glowScale);
      activationGlow.material.opacity = 0.13 + energy * 0.34;
    }
  }

  if (vectorArrow) {
    const vector = vectorForPhase(LAB_STATE.phaseIndex);
    if (vector.lengthSq() < 0.02) {
      vectorArrow.visible = false;
    } else {
      vectorArrow.visible = true;
      vectorArrow.setDirection(vector.clone().normalize());
      vectorArrow.setLength(0.82 + vector.length() * 0.22, 0.16, 0.09);
    }
  }

  if (heartModel && heartModel.userData.baseScale) {
    const base = heartModel.userData.baseScale;
    const systolicPulse =
      Math.exp(-Math.pow((progress - 0.31) / 0.11, 2));
    const rebound =
      Math.exp(-Math.pow((progress - 0.58) / 0.10, 2));
    const scaleFactor = 1 - systolicPulse * 0.018 + rebound * 0.006;
    heartModel.scale.setScalar(base * scaleFactor);
  }
}

function setupHeartControls() {
  const cutaway = byId("heartCutawayToggle");
  if (cutaway) {
    cutaway.addEventListener("click", function () {
      cutawayEnabled = !cutawayEnabled;
      cutaway.setAttribute("aria-pressed", cutawayEnabled ? "true" : "false");
      cutaway.textContent = cutawayEnabled ? "Corte: ativo" : "Corte: inteiro";
      applyCutaway();
    });
  }

  const fullscreen = byId("heartFullscreen");
  if (fullscreen) {
    fullscreen.addEventListener("click", async function () {
      const host = byId("heart3dHost");
      if (!host) return;
      try {
        if (!document.fullscreenElement) {
          await host.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch (error) {
        console.warn(error);
      }
    });

    fullscreen.addEventListener("contextmenu", function (event) {
      event.preventDefault();
      cutawayEnabled = !cutawayEnabled;
      applyCutaway();
    });
  }

  all("[data-axis-mode]").forEach(function (button) {
    button.addEventListener("click", function () {
      LAB_STATE.axisMode = button.dataset.axisMode;
      all("[data-axis-mode]").forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
      updateAxisVisibility();
      drawEcgMatrix();
    });
  });

  const posterior = byId("posteriorLeads");
  if (posterior) {
    posterior.addEventListener("change", function () {
      LAB_STATE.posteriorLeads = posterior.checked;
      updateAxisVisibility();
      drawEcgMatrix();
    });
  }

  const right = byId("rightLeads");
  if (right) {
    right.addEventListener("change", function () {
      LAB_STATE.rightLeads = right.checked;
      updateAxisVisibility();
      drawEcgMatrix();
    });
  }
}

function resizeThree() {
  const host = byId("heart3dHost");
  if (!host || !renderer || !camera || !labelRenderer) return;
  const width = Math.max(1, host.clientWidth);
  const height = Math.max(1, host.clientHeight);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  labelRenderer.setSize(width, height);
}

let threeClock = new THREE.Clock();

function animateThree() {
  animationHandle = requestAnimationFrame(animateThree);
  if (!renderer || !scene || !camera) return;

  const delta = threeClock.getDelta();
  if (heartRoot && heartRoot.userData.mixer && LAB_STATE.phasePlaying) {
    heartRoot.userData.mixer.update(delta * 0.45);
  }

  if (controls) controls.update();
  renderer.render(scene, camera);
  if (labelRenderer) labelRenderer.render(scene, camera);
}

/* =========================================================
   SIMULATOR / ECG MATRIX
========================================================= */

function setupSimulatorControls() {
  const previous = byId("phasePrevious");
  const next = byId("phaseNext");
  const play = byId("phasePlay");
  const slider = byId("phaseSlider");
  const speed = byId("phaseSpeed");

  if (previous) previous.addEventListener("click", function () {
    setPhase(LAB_STATE.phaseIndex - 1);
  });

  if (next) next.addEventListener("click", function () {
    setPhase(LAB_STATE.phaseIndex + 1);
  });

  if (play) play.addEventListener("click", async function () {
    LAB_STATE.phasePlaying = !LAB_STATE.phasePlaying;
    play.textContent = LAB_STATE.phasePlaying ? "Ⅱ Pausar" : "▶ Contínuo";

    if (LAB_STATE.phasePlaying) {
      await ensureAudioContext();
      startPhaseLoop();
    }
    else {
      stopPhaseLoop();
    }
  });

  if (slider) slider.addEventListener("input", function () {
    setPhase(Number(slider.value));
  });

  if (speed) speed.addEventListener("change", function () {
    /*
     * Mantém a fase relativa ao trocar a frequência, evitando salto visual.
     */
    const oldProgress = currentCycleProgress();
    const period = getBeatPeriod();
    LAB_STATE.ecgTime = Math.floor(LAB_STATE.ecgTime / period) * period + oldProgress * period;
    LAB_STATE.ecgLastFrame = performance.now();
    drawEcgMatrix();
  });

  all("[data-qrs-step]").forEach(function (button) {
    button.addEventListener("click", function () {
      const qrs = Number(button.dataset.qrsStep);
      LAB_STATE.qrsStep = qrs;
      all("[data-qrs-step]").forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
      setPhase(QRS_MOMENTS[qrs]);
    });
  });

  const sound = byId("heartSoundToggle");
  if (sound) {
    sound.addEventListener("click", async function () {
      soundEnabled = !soundEnabled;
      sound.setAttribute("aria-pressed", soundEnabled ? "true" : "false");
      sound.textContent = soundEnabled ? "♪ Som ativo" : "♪ Som";
      if (soundEnabled) {
        await ensureAudioContext();
      }
    });
  }

  const paperSpeed = byId("paperSpeedSimulator");
  const paperGain = byId("paperGainSimulator");

  if (paperSpeed) paperSpeed.addEventListener("change", drawEcgMatrix);
  if (paperGain) paperGain.addEventListener("change", drawEcgMatrix);
}

async function ensureAudioContext() {
  if (!audioContext) {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return null;
    audioContext = new AudioContextCtor();
  }
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }
  return audioContext;
}

function createHeartNoise(context, when, duration, frequency, amount) {
  const sampleRate = context.sampleRate;
  const length = Math.max(1, Math.floor(sampleRate * duration));
  const buffer = context.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i += 1) {
    const envelope = Math.exp(-i / (length * 0.22));
    data[i] = (Math.random() * 2 - 1) * envelope;
  }

  const source = context.createBufferSource();
  source.buffer = buffer;

  const filter = context.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(frequency, when);
  filter.Q.setValueAtTime(0.9, when);

  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(amount, when + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  source.start(when);
  source.stop(when + duration);
}

async function playHeartSound(kind) {
  if (!soundEnabled) return;
  const context = await ensureAudioContext();
  if (!context) return;

  const now = context.currentTime;
  const isS2 = kind === "s2";
  const duration = isS2 ? 0.105 : 0.145;
  const frequencies = isS2 ? [72, 104] : [48, 72];
  const amplitudes = isS2 ? [0.060, 0.035] : [0.082, 0.046];

  frequencies.forEach(function (frequency, index) {
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * (isS2 ? 0.72 : 0.62),
      now + duration
    );

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(isS2 ? 170 : 135, now);
    filter.Q.setValueAtTime(0.75, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(amplitudes[index], now + 0.008 + index * 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now + index * 0.004);
    oscillator.stop(now + duration);
  });

  createHeartNoise(
    context,
    now,
    duration,
    isS2 ? 115 : 82,
    isS2 ? 0.020 : 0.027
  );
}

function getSimulationBpm() {
  const speed = Number((byId("phaseSpeed") || {}).value || 1);
  return LAB_STATE.ecgBpmBase * speed;
}

function getBeatPeriod() {
  return 60 / getSimulationBpm();
}

function phaseIndexForCycle(progress) {
  if (progress < 0.06) return 0;
  if (progress < 0.135) return 1;
  if (progress < 0.18) return 2;
  if (progress < 0.215) return 3;
  if (progress < 0.245) return 4;
  if (progress < 0.29) return 5;
  if (progress < 0.34) return 6;
  if (progress < 0.44) return 7;
  if (progress < 0.62) return 8;
  return 9;
}

function currentCycleProgress() {
  const period = getBeatPeriod();
  return ((LAB_STATE.ecgTime % period) + period) % period / period;
}

function syncPhaseUi(index, redraw) {
  LAB_STATE.phaseIndex = (index + PHASES.length) % PHASES.length;
  const phase = PHASES[LAB_STATE.phaseIndex];

  if (byId("phaseCounter")) byId("phaseCounter").textContent = (LAB_STATE.phaseIndex + 1) + "/10";
  if (byId("phaseSlider")) byId("phaseSlider").value = String(LAB_STATE.phaseIndex);
  if (byId("heartPhaseBadge")) byId("heartPhaseBadge").textContent = phase.badge;
  if (byId("simExplanationStep")) byId("simExplanationStep").textContent = phase.step;
  if (byId("simExplanationTitle")) byId("simExplanationTitle").textContent = phase.title;
  if (byId("simExplanationText")) byId("simExplanationText").textContent = phase.text;

  if (LAB_STATE.phaseIndex >= 4 && LAB_STATE.phaseIndex <= 6) {
    LAB_STATE.qrsStep = LAB_STATE.phaseIndex - 4;
    all("[data-qrs-step]").forEach(function (button) {
      button.classList.toggle("active", Number(button.dataset.qrsStep) === LAB_STATE.qrsStep);
    });
  }

  if (redraw !== false) {
    updateHeartElectricalState(currentCycleProgress());
    drawEcgMatrix();
  }
}

function setPhase(index) {
  LAB_STATE.phasePlaying = false;
  stopPhaseLoop();

  const play = byId("phasePlay");
  if (play) play.textContent = "▶ Contínuo";

  const normalized = (index + PHASES.length) % PHASES.length;
  const period = getBeatPeriod();
  const beatStart = Math.floor(LAB_STATE.ecgTime / period) * period;
  LAB_STATE.ecgTime = beatStart + PHASES[normalized].progress * period;

  syncPhaseUi(normalized, true);
}

function startPhaseLoop() {
  LAB_STATE.ecgLastFrame = performance.now();
}

function stopPhaseLoop() {
  LAB_STATE.ecgLastFrame = performance.now();
}

function triggerSynchronizedHeartSounds(previousTime, currentTime, period) {
  if (!soundEnabled) return;

  const currentBeat = Math.floor(currentTime / period);
  const currentPhase = ((currentTime % period) + period) % period / period;
  const previousBeat = Math.floor(previousTime / period);
  const previousPhase = ((previousTime % period) + period) % period / period;

  const crossed = function (threshold) {
    if (currentBeat > previousBeat) {
      return currentPhase >= threshold || previousPhase < threshold;
    }
    return previousPhase < threshold && currentPhase >= threshold;
  };

  /*
   * S1 ocorre logo após o início da despolarização ventricular (QRS).
   * S2 acompanha o fim da sístole, próximo ao final da repolarização ventricular.
   * O ECG não "gera" o som; aqui os eventos mecânicos são sincronizados didaticamente.
   */
  if (
    crossed(0.255) &&
    LAB_STATE.lastSoundS1Beat !== currentBeat
  ) {
    LAB_STATE.lastSoundS1Beat = currentBeat;
    playHeartSound("s1");
  }

  if (
    crossed(0.60) &&
    LAB_STATE.lastSoundS2Beat !== currentBeat
  ) {
    LAB_STATE.lastSoundS2Beat = currentBeat;
    playHeartSound("s2");
  }
}

function simulationFrame(now) {
  requestAnimationFrame(simulationFrame);

  const delta = clamp((now - LAB_STATE.ecgLastFrame) / 1000, 0, 0.06);
  LAB_STATE.ecgLastFrame = now;

  if (
    LAB_STATE.section !== "simulator" ||
    !LAB_STATE.phasePlaying
  ) {
    return;
  }

  const period = getBeatPeriod();
  const previousTime = LAB_STATE.ecgTime;
  LAB_STATE.ecgTime += delta;

  const progress = currentCycleProgress();
  const index = phaseIndexForCycle(progress);

  if (index !== LAB_STATE.phaseIndex) {
    syncPhaseUi(index, false);
  }

  updateHeartElectricalState(progress);
  triggerSynchronizedHeartSounds(previousTime, LAB_STATE.ecgTime, period);

  if (now - LAB_STATE.ecgLastDraw >= 20) {
    LAB_STATE.ecgLastDraw = now;
    drawEcgMatrix();
  }
}

function fitCanvas(canvas, cssHeight) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, canvas.clientWidth);
  const height = Math.max(1, cssHeight || canvas.clientHeight || 300);
  const pixelWidth = Math.round(width * dpr);
  const pixelHeight = Math.round(height * dpr);

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  return {
    ctx: canvas.getContext("2d"),
    dpr: dpr,
    width: width,
    height: height,
    pixelWidth: pixelWidth,
    pixelHeight: pixelHeight
  };
}

function drawPaperGrid(ctx, width, height, dpr, dark) {
  const small = 8 * dpr;
  ctx.save();

  if (dark) {
    ctx.fillStyle = "#0b1621";
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.fillStyle = "#fffaf7";
    ctx.fillRect(0, 0, width, height);
  }

  for (let x = 0; x <= width; x += small) {
    const major = Math.round(x / small) % 5 === 0;
    ctx.strokeStyle = dark
      ? (major ? "rgba(93, 123, 151, .32)" : "rgba(93, 123, 151, .12)")
      : (major ? "rgba(239, 68, 68, .34)" : "rgba(239, 68, 68, .13)");
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += small) {
    const major = Math.round(y / small) % 5 === 0;
    ctx.strokeStyle = dark
      ? (major ? "rgba(93, 123, 151, .32)" : "rgba(93, 123, 151, .12)")
      : (major ? "rgba(239, 68, 68, .34)" : "rgba(239, 68, 68, .13)");
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}

function gaussian(x, center, width, amplitude) {
  const d = (x - center) / width;
  return amplitude * Math.exp(-d * d);
}

function leadWave(phase, lead) {
  let polarity = 1;
  let scale = 1;

  const config = {
    DI: [1, .88],
    DII: [1, 1.0],
    DIII: [1, .62],
    aVR: [-1, .86],
    aVL: [1, .35],
    aVF: [1, .78],
    V1: [-1, .72],
    V2: [-1, .48],
    V3: [1, .38],
    V4: [1, .86],
    V5: [1, 1.02],
    V6: [1, .82],
    V7: [1, .68],
    V8: [1, .60],
    V9: [1, .52],
    V3R: [-1, .42],
    V4R: [-1, .30]
  }[lead] || [1, 1];

  polarity = config[0];
  scale = config[1];

  let value = 0;
  value += gaussian(phase, .12, .026, .13 * polarity * scale);
  value += gaussian(phase, .235, .012, -.18 * polarity * scale);
  value += gaussian(phase, .255, .014, 1.12 * polarity * scale);
  value += gaussian(phase, .278, .016, -.34 * polarity * scale);
  value += gaussian(phase, .52, .065, .30 * polarity * scale);
  return value;
}

const TRACE_HEAD_RATIO = 0.94;

function getDisplayedLeadLayout() {
  let leads;
  let title;
  let subtitle;

  if (LAB_STATE.axisMode === "frontal") {
    leads = ["DI", "aVR", "DII", "aVL", "DIII", "aVF"];
    title = "Derivações periféricas · plano frontal";
    subtitle = "Bipolares: DI, DII, DIII · Unipolares aumentadas: aVR, aVL, aVF";
  }
  else if (LAB_STATE.axisMode === "horizontal") {
    leads = ["V1", "V2", "V3", "V4", "V5", "V6"];
    title = "Derivações precordiais · plano horizontal";
    subtitle = "Progressão precordial de V1 a V6";
  }
  else {
    leads = ["DI", "DII", "DIII", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"];
    title = "ECG de 12 derivações";
    subtitle = "6 periféricas no plano frontal + 6 precordiais no plano horizontal";
  }

  if (LAB_STATE.posteriorLeads) leads = leads.concat(["V7", "V8", "V9"]);
  if (LAB_STATE.rightLeads) leads = leads.concat(["V3R", "V4R"]);

  const cols = leads.length > 8 ? 4 : 2;
  const rows = Math.ceil(leads.length / cols);

  return { leads, title, subtitle, cols, rows };
}

function waveNameFromPhase(phase) {
  if (phase >= 0.075 && phase < 0.15) return "Onda P";
  if (phase >= 0.15 && phase < 0.205) return "Intervalo PR";
  if (phase >= 0.205 && phase < 0.238) return "Onda Q";
  if (phase >= 0.238 && phase < 0.268) return "Onda R";
  if (phase >= 0.268 && phase < 0.315) return "Onda S";
  if (phase >= 0.315 && phase < 0.44) return "Segmento ST";
  if (phase >= 0.44 && phase < 0.62) return "Onda T";
  return "Linha de base / TP";
}

function drawLeadTrace(ctx, rect, lead, endTime, period, activeColor, dpr) {
  const baseline = rect.y + rect.h * .52;
  const amplitude = rect.h * .30;
  const windowDuration = period * 2;
  const headX = rect.x + rect.w * TRACE_HEAD_RATIO;

  ctx.save();

  ctx.fillStyle = "#3f3f46";
  ctx.font = (8 * dpr) + "px system-ui, sans-serif";
  ctx.textBaseline = "top";
  ctx.fillText(lead, rect.x + 7 * dpr, rect.y + 6 * dpr);

  if (lead === "DII") {
    ctx.fillStyle = "rgba(34, 211, 238, .09)";
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  }

  const points = Math.max(260, Math.floor(rect.w / (1.6 * dpr)));
  const gradient = ctx.createLinearGradient(rect.x, 0, headX, 0);

  if (activeColor === "#191919") {
    gradient.addColorStop(0, "rgba(25,25,25,.27)");
    gradient.addColorStop(.72, "rgba(25,25,25,.72)");
    gradient.addColorStop(1, "rgba(10,10,10,.98)");
  }
  else {
    gradient.addColorStop(0, "rgba(0,168,200,.28)");
    gradient.addColorStop(.72, "rgba(0,168,200,.72)");
    gradient.addColorStop(1, "rgba(0,153,184,1)");
  }

  ctx.beginPath();

  for (let i = 0; i < points; i += 1) {
    const n = i / (points - 1);
    const sampleTime = endTime - windowDuration + n * windowDuration;
    const phase = ((sampleTime % period) + period) % period / period;
    const value = leadWave(phase, lead);
    const x = rect.x + n * rect.w * TRACE_HEAD_RATIO;
    const y = baseline - value * amplitude;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1.5 * dpr;
  ctx.stroke();

  const currentPhase = ((endTime % period) + period) % period / period;
  const currentValue = leadWave(currentPhase, lead);
  const currentY = baseline - currentValue * amplitude;

  ctx.strokeStyle = "rgba(239, 68, 68, .24)";
  ctx.lineWidth = 1 * dpr;
  ctx.beginPath();
  ctx.moveTo(headX, rect.y);
  ctx.lineTo(headX, rect.y + rect.h);
  ctx.stroke();

  ctx.fillStyle = activeColor === "#191919" ? "#ef4444" : "#0891b2";
  ctx.beginPath();
  ctx.arc(headX, currentY, 2.8 * dpr, 0, TAU);
  ctx.fill();

  ctx.restore();
}

function drawEcgHover(ctx, layout, size, period) {
  const hover = LAB_STATE.ecgHover;
  if (!hover) return;

  const px = hover.nx * size.pixelWidth;
  const py = hover.ny * size.pixelHeight;
  const cellW = size.pixelWidth / layout.cols;
  const cellH = size.pixelHeight / layout.rows;
  const col = clamp(Math.floor(px / cellW), 0, layout.cols - 1);
  const row = clamp(Math.floor(py / cellH), 0, layout.rows - 1);
  const index = row * layout.cols + col;

  if (index >= layout.leads.length) return;

  const lead = layout.leads[index];
  const rect = {
    x: col * cellW,
    y: row * cellH,
    w: cellW,
    h: cellH
  };

  const localX = clamp((px - rect.x) / (rect.w * TRACE_HEAD_RATIO), 0, 1);
  const windowDuration = period * 2;
  const sampleTime =
    LAB_STATE.ecgTime -
    windowDuration +
    localX * windowDuration;

  const phase =
    ((sampleTime % period) + period) % period / period;

  const value = leadWave(phase, lead);
  const baseline = rect.y + rect.h * .52;
  const amplitude = rect.h * .30;
  const waveY = baseline - value * amplitude;
  const pointX = rect.x + localX * rect.w * TRACE_HEAD_RATIO;

  ctx.save();
  ctx.strokeStyle = "rgba(8,145,178,.72)";
  ctx.lineWidth = 1 * size.dpr;
  ctx.setLineDash([3 * size.dpr, 3 * size.dpr]);

  ctx.beginPath();
  ctx.moveTo(pointX, rect.y);
  ctx.lineTo(pointX, rect.y + rect.h);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(rect.x, waveY);
  ctx.lineTo(rect.x + rect.w, waveY);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.fillStyle = "#0891b2";
  ctx.beginPath();
  ctx.arc(pointX, waveY, 4 * size.dpr, 0, TAU);
  ctx.fill();
  ctx.restore();

  hover.lead = lead;
  hover.phase = phase;
  hover.value = value;
  hover.wave = waveNameFromPhase(phase);
  hover.timeMs = phase * period * 1000;

  updateEcgHoverTooltip();
}

function updateEcgHoverTooltip() {
  const tooltip = byId("ecgHoverTooltip");
  const hover = LAB_STATE.ecgHover;
  const canvas = byId("ecgMatrixCanvas");

  if (!tooltip || !canvas || !hover) {
    if (tooltip) tooltip.hidden = true;
    return;
  }

  tooltip.hidden = false;
  tooltip.innerHTML =
    "<strong>" + hover.lead + " · " + hover.wave + "</strong>" +
    "<span>" + (hover.value >= 0 ? "+" : "") +
    hover.value.toFixed(2).replace(".", ",") +
    " mV · " +
    Math.round(hover.timeMs) +
    " ms no ciclo</span>";

  const wrap = canvas.parentElement;
  const maxLeft = Math.max(8, (wrap ? wrap.clientWidth : canvas.clientWidth) - 220);
  const maxTop = Math.max(8, (wrap ? wrap.clientHeight : canvas.clientHeight) - 62);

  tooltip.style.left = clamp(hover.cssX + 12, 8, maxLeft) + "px";
  tooltip.style.top = clamp(hover.cssY + 12, 8, maxTop) + "px";
}

function setupEcgInteraction() {
  const canvas = byId("ecgMatrixCanvas");
  const tooltip = byId("ecgHoverTooltip");
  if (!canvas) return;

  canvas.style.cursor = "crosshair";

  canvas.addEventListener("pointermove", function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = clamp(event.clientX - rect.left, 0, rect.width);
    const y = clamp(event.clientY - rect.top, 0, rect.height);

    LAB_STATE.ecgHover = {
      nx: rect.width ? x / rect.width : 0,
      ny: rect.height ? y / rect.height : 0,
      cssX: x,
      cssY: y
    };

    if (!LAB_STATE.phasePlaying) {
      drawEcgMatrix();
    }
  });

  canvas.addEventListener("pointerleave", function () {
    if (LAB_STATE.ecgHoverPinned) return;
    LAB_STATE.ecgHover = null;
    if (tooltip) tooltip.hidden = true;
    if (!LAB_STATE.phasePlaying) drawEcgMatrix();
  });

  canvas.addEventListener("click", function () {
    LAB_STATE.ecgHoverPinned = !LAB_STATE.ecgHoverPinned;
    if (tooltip) {
      tooltip.classList.toggle("pinned", LAB_STATE.ecgHoverPinned);
    }
  });
}

function drawEcgMatrix() {
  const canvas = byId("ecgMatrixCanvas");
  if (!canvas || LAB_STATE.section !== "simulator") return;

  const layout = getDisplayedLeadLayout();
  const bpm = getSimulationBpm();
  const period = 60 / bpm;

  const heading = document.querySelector(".matrix-head h2");
  const copy = document.querySelector(".matrix-head p");
  if (heading) heading.textContent = layout.title;
  if (copy) {
    copy.textContent =
      layout.subtitle +
      " · ritmo sinusal " +
      Math.round(bpm) +
      " bpm · janela de 2 batimentos";
  }

  const hostHeight = canvas.parentElement ? canvas.parentElement.clientHeight : 650;
  const size = fitCanvas(canvas, Math.max(540, hostHeight));
  const ctx = size.ctx;
  const dpr = size.dpr;

  ctx.clearRect(0, 0, size.pixelWidth, size.pixelHeight);
  drawPaperGrid(ctx, size.pixelWidth, size.pixelHeight, dpr, false);

  const cellW = size.pixelWidth / layout.cols;
  const cellH = size.pixelHeight / layout.rows;

  ctx.save();
  ctx.strokeStyle = "rgba(183, 68, 68, .48)";
  ctx.lineWidth = 1.05 * dpr;

  for (let col = 1; col < layout.cols; col += 1) {
    ctx.beginPath();
    ctx.moveTo(col * cellW, 0);
    ctx.lineTo(col * cellW, size.pixelHeight);
    ctx.stroke();
  }

  for (let row = 1; row < layout.rows; row += 1) {
    ctx.beginPath();
    ctx.moveTo(0, row * cellH);
    ctx.lineTo(size.pixelWidth, row * cellH);
    ctx.stroke();
  }
  ctx.restore();

  layout.leads.forEach(function (lead, index) {
    const row = Math.floor(index / layout.cols);
    const col = index % layout.cols;
    const rect = {
      x: col * cellW,
      y: row * cellH,
      w: cellW,
      h: cellH
    };

    drawLeadTrace(
      ctx,
      rect,
      lead,
      LAB_STATE.ecgTime,
      period,
      lead === "DII" ? "#00a8c8" : "#191919",
      dpr
    );
  });

  drawEcgHover(ctx, layout, size, period);
}

/* =========================================================
   FUNDAMENTALS
========================================================= */

const ELECTRODE_POINTS = {
  limb: [
    { id: "RA", label: "BD", x: 78, y: 136, title: "Braço direito", text: "Eletrodo do braço direito. Participa das derivações periféricas." },
    { id: "LA", label: "BE", x: 382, y: 136, title: "Braço esquerdo", text: "Eletrodo do braço esquerdo. Atua como polo positivo em DI e aVL." },
    { id: "RL", label: "PD", x: 214, y: 304, title: "Perna direita", text: "Eletrodo de referência/terra no ECG padrão." },
    { id: "LL", label: "PE", x: 246, y: 304, title: "Perna esquerda", text: "Eletrodo da perna esquerda. Participa de DII, DIII e aVF." }
  ],
  chest: [
    { id: "V1", label: "V1", x: 220, y: 154, title: "V1", text: "4º espaço intercostal direito junto ao esterno." },
    { id: "V2", label: "V2", x: 240, y: 154, title: "V2", text: "4º espaço intercostal esquerdo junto ao esterno." },
    { id: "V3", label: "V3", x: 259, y: 174, title: "V3", text: "Posicionado entre V2 e V4." },
    { id: "V4", label: "V4", x: 278, y: 195, title: "V4", text: "5º espaço intercostal, linha hemiclavicular esquerda." },
    { id: "V5", label: "V5", x: 311, y: 188, title: "V5", text: "Mesmo nível de V4, linha axilar anterior." },
    { id: "V6", label: "V6", x: 342, y: 181, title: "V6", text: "Mesmo nível de V4/V5, linha axilar média." }
  ],
  posterior: [
    { id: "V7", label: "V7", x: 363, y: 191, title: "V7", text: "Extensão posterior no mesmo plano horizontal de V6." },
    { id: "V8", label: "V8", x: 373, y: 211, title: "V8", text: "Derivação posterior mais medial." },
    { id: "V9", label: "V9", x: 377, y: 231, title: "V9", text: "Extensão posterior adicional para avaliação da parede posterior." }
  ],
  right: [
    { id: "V3R", label: "V3R", x: 199, y: 174, title: "V3R", text: "Posição direita espelhada de V3." },
    { id: "V4R", label: "V4R", x: 182, y: 195, title: "V4R", text: "Derivação precordial direita usada para observar o ventrículo direito." },
    { id: "VD", label: "VD", x: 166, y: 188, title: "VD", text: "Referência didática ao território precordial direito." }
  ]
};

const ELECTRODE_LEADS = {
  limb: [
    ["DI", "Derivação I"],
    ["DII", "Derivação II"],
    ["DIII", "Derivação III"],
    ["aVR", "braço direito"],
    ["aVL", "braço esquerdo"],
    ["aVF", "pé esquerdo"]
  ],
  chest: [["V1", "septal"], ["V2", "septal"], ["V3", "transição"], ["V4", "anterior"], ["V5", "lateral"], ["V6", "lateral"]],
  posterior: [["V7", "posterior"], ["V8", "posterior"], ["V9", "posterior"]],
  right: [["V3R", "direita"], ["V4R", "direita"], ["VD", "território direito"]]
};

function setupElectrodeLearning() {
  all("[data-electrode-group]").forEach(function (button) {
    button.addEventListener("click", function () {
      all("[data-electrode-group]").forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
      renderElectrodeGroup(button.dataset.electrodeGroup);
    });
  });
  renderElectrodeGroup("limb");
}

function renderElectrodeGroup(group) {
  const holder = byId("electrodeDots");
  const leadButtons = byId("electrodeLeadButtons");
  if (!holder || !leadButtons) return;

  holder.innerHTML = "";
  (ELECTRODE_POINTS[group] || []).forEach(function (point) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "electrode-dot-svg");
    g.setAttribute("data-electrode-id", point.id);
    g.setAttribute("transform", "translate(" + point.x + " " + point.y + ")");

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", point.label.length > 2 ? "14" : "11");
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.textContent = point.label;

    g.appendChild(circle);
    g.appendChild(text);
    holder.appendChild(g);

    g.addEventListener("click", function () {
      focusElectrode(group, point.id);
    });
  });

  leadButtons.innerHTML = "";
  (ELECTRODE_LEADS[group] || []).forEach(function (lead, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = "<strong>" + lead[0] + "</strong><br><small>" + lead[1] + "</small>";
    if (index === 0) button.classList.add("active");
    button.addEventListener("click", function () {
      all("#electrodeLeadButtons button").forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
      const point = (ELECTRODE_POINTS[group] || [])[Math.min(index, (ELECTRODE_POINTS[group] || []).length - 1)];
      if (point) updateElectrodeFocus(lead[0], point);
    });
    leadButtons.appendChild(button);
  });

  const first = (ELECTRODE_POINTS[group] || [])[0];
  if (first) {
    focusElectrode(group, first.id);
  }
}

function focusElectrode(group, id) {
  all(".electrode-dot-svg").forEach(function (item) {
    item.classList.toggle("active", item.getAttribute("data-electrode-id") === id);
  });
  const point = (ELECTRODE_POINTS[group] || []).find(function (item) {
    return item.id === id;
  });
  if (point) updateElectrodeFocus(id, point);
}

function updateElectrodeFocus(id, point) {
  const box = byId("electrodeFocusCard");
  if (!box) return;
  const title = box.querySelector("h4");
  const paragraph = box.querySelector("p");
  if (title) title.textContent = id + " · " + point.title;
  if (paragraph) paragraph.textContent = point.text;
}

function setupAxisLearning() {
  const holder = byId("axisLeadButtons");
  if (!holder) return;

  ["DI", "DII", "DIII", "aVR", "aVL", "aVF"].forEach(function (lead, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = lead;
    if (index === 0) button.classList.add("active");
    button.addEventListener("click", function () {
      all("#axisLeadButtons button").forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
      updateAxisLead(lead);
    });
    holder.appendChild(button);
  });

  const slider = byId("axisSlider");
  if (slider) {
    slider.addEventListener("input", function () {
      updateAxisValue();
      const active = holder.querySelector("button.active");
      if (active) updateAxisLead(active.textContent);
    });
  }

  updateAxisValue();
  updateAxisLead("DI");
}

function updateAxisValue() {
  const slider = byId("axisSlider");
  const output = byId("axisValue");
  if (!slider || !output) return;
  const value = Number(slider.value);
  const status = value >= -30 && value <= 90 ? "normal" : "desviado";
  output.innerHTML = (value >= 0 ? "+" : "") + value + "° <small>" + status + "</small>";
}

function updateAxisLead(lead) {
  const slider = byId("axisSlider");
  const voltage = byId("axisLeadVoltage");
  const explanation = byId("axisLeadExplanation");
  if (!slider || !voltage || !explanation) return;

  const axis = Number(slider.value) * Math.PI / 180;
  const leadAngle = (LEAD_DIRECTIONS[lead] || 0) * Math.PI / 180;
  const projected = Math.cos(axis - leadAngle);
  voltage.textContent = (projected >= 0 ? "+" : "") + projected.toFixed(2).replace(".", ",") + " mV";
  explanation.textContent = "Eixo de " + lead + ": " + (LEAD_DIRECTIONS[lead] || 0) + "°. A projeção é proporcional ao cosseno da diferença angular; quanto mais paralelo, maior a deflexão.";
}

function setupPaperLearning() {
  const speed = byId("paperSpeedSlider");
  const gain = byId("paperGainSlider");

  function update() {
    LAB_STATE.paperSpeed = Number(speed ? speed.value : 25);
    LAB_STATE.paperGain = Number(gain ? gain.value : 10);

    if (byId("paperSpeedValue")) byId("paperSpeedValue").textContent = String(LAB_STATE.paperSpeed).replace(".5", ",5") + " mm/s";
    if (byId("paperGainValue")) byId("paperGainValue").textContent = LAB_STATE.paperGain + " mm/mV";

    const smallTime = 1 / LAB_STATE.paperSpeed;
    const bigTime = 5 / LAB_STATE.paperSpeed;
    const smallMv = 1 / LAB_STATE.paperGain;
    const bigMv = 5 / LAB_STATE.paperGain;

    if (byId("smallSquareTime")) byId("smallSquareTime").textContent = smallTime.toFixed(3).replace("0.040", "0,04").replace(".", ",") + " s";
    if (byId("bigSquareTime")) byId("bigSquareTime").textContent = bigTime.toFixed(2).replace(".", ",") + " s · quadrado grande";
    if (byId("smallSquareMv")) byId("smallSquareMv").textContent = smallMv.toFixed(2).replace("0.10", "0,1").replace(".", ",") + " mV";
    if (byId("bigSquareMv")) byId("bigSquareMv").textContent = bigMv.toFixed(2).replace("0.50", "0,5").replace(".", ",") + " mV · quadrado grande";

    drawCalibration();
    drawRegularFrequency();
    drawIrregularFrequency();
  }

  if (speed) speed.addEventListener("input", update);
  if (gain) gain.addEventListener("input", update);
  update();
}

function drawCalibration() {
  const canvas = byId("calibrationCanvas");
  if (!canvas || LAB_STATE.section !== "fundamentals" || LAB_STATE.fundamentalPart !== "paper") return;

  const size = fitCanvas(canvas, 250);
  const ctx = size.ctx;
  const dpr = size.dpr;

  drawPaperGrid(ctx, size.pixelWidth, size.pixelHeight, dpr, true);

  const baseline = size.pixelHeight * .55;
  ctx.save();
  ctx.beginPath();

  const beats = 3;
  const points = 700;
  for (let i = 0; i < points; i += 1) {
    const n = i / (points - 1);
    const cycle = (n * beats) % 1;
    const value = leadWave(cycle, "DII");
    const x = n * size.pixelWidth;
    const y = baseline - value * size.pixelHeight * .20;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.strokeStyle = "#dbeafe";
  ctx.lineWidth = 1.5 * dpr;
  ctx.stroke();

  const xMeasure = size.pixelWidth * .19;
  const yTop = baseline - size.pixelHeight * .20;
  ctx.strokeStyle = "#67e8f9";
  ctx.lineWidth = 1.3 * dpr;
  ctx.setLineDash([4 * dpr, 3 * dpr]);
  ctx.beginPath();
  ctx.moveTo(xMeasure, baseline);
  ctx.lineTo(xMeasure, yTop);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#a5f3fc";
  ctx.font = "700 " + (11 * dpr) + "px system-ui";
  ctx.fillText("1 mV", xMeasure + 8 * dpr, yTop + 18 * dpr);

  const x1 = size.pixelWidth * .18;
  const x2 = size.pixelWidth * .36;
  const y = baseline + 40 * dpr;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.moveTo(x1, y - 6 * dpr);
  ctx.lineTo(x1, y + 6 * dpr);
  ctx.moveTo(x2, y - 6 * dpr);
  ctx.lineTo(x2, y + 6 * dpr);
  ctx.stroke();

  ctx.fillText((5 / LAB_STATE.paperSpeed).toFixed(2).replace(".", ",") + " s", x1 + 24 * dpr, y + 19 * dpr);
  ctx.restore();
}

function drawRegularFrequency() {
  const canvas = byId("regularFrequencyCanvas");
  if (!canvas || LAB_STATE.section !== "fundamentals" || LAB_STATE.fundamentalPart !== "paper") return;
  const size = fitCanvas(canvas, 180);
  const ctx = size.ctx;
  const dpr = size.dpr;
  drawPaperGrid(ctx, size.pixelWidth, size.pixelHeight, dpr, true);

  const baseline = size.pixelHeight * .60;
  const rrSquares = 5;
  const bpm = Math.round(300 / rrSquares);
  if (byId("regularBpm")) byId("regularBpm").textContent = bpm + " bpm";

  const beatPositions = [0.13, 0.38, 0.63, 0.88];
  ctx.save();
  ctx.strokeStyle = "#dbeafe";
  ctx.lineWidth = 1.4 * dpr;
  ctx.beginPath();
  ctx.moveTo(0, baseline);

  const points = 600;
  for (let i = 0; i < points; i += 1) {
    const n = i / (points - 1);
    let value = 0;
    beatPositions.forEach(function (pos) {
      const local = n - pos;
      value += gaussian(local, -0.045, .015, .10);
      value += gaussian(local, 0, .008, .90);
      value += gaussian(local, .055, .030, .16);
    });
    const x = n * size.pixelWidth;
    const y = baseline - value * size.pixelHeight * .33;
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  const x1 = beatPositions[1] * size.pixelWidth;
  const x2 = beatPositions[2] * size.pixelWidth;
  ctx.strokeStyle = "#5eead4";
  ctx.lineWidth = 1.2 * dpr;
  ctx.beginPath();
  ctx.moveTo(x1, 22 * dpr);
  ctx.lineTo(x2, 22 * dpr);
  ctx.moveTo(x1, 18 * dpr);
  ctx.lineTo(x1, 27 * dpr);
  ctx.moveTo(x2, 18 * dpr);
  ctx.lineTo(x2, 27 * dpr);
  ctx.stroke();
  ctx.fillStyle = "#99f6e4";
  ctx.font = "700 " + (8 * dpr) + "px system-ui";
  ctx.fillText("5 quadrados grandes", x1 + 6 * dpr, 14 * dpr);
  ctx.restore();
}

function drawIrregularFrequency() {
  const canvas = byId("irregularFrequencyCanvas");
  if (!canvas || LAB_STATE.section !== "fundamentals" || LAB_STATE.fundamentalPart !== "paper") return;
  const size = fitCanvas(canvas, 180);
  const ctx = size.ctx;
  const dpr = size.dpr;
  drawPaperGrid(ctx, size.pixelWidth, size.pixelHeight, dpr, true);

  const baseline = size.pixelHeight * .60;
  const beats = [0.08, 0.19, 0.35, 0.47, 0.63, 0.75, 0.86, 0.97];

  ctx.save();
  ctx.strokeStyle = "#dbeafe";
  ctx.lineWidth = 1.4 * dpr;
  ctx.beginPath();

  const points = 650;
  for (let i = 0; i < points; i += 1) {
    const n = i / (points - 1);
    let value = 0;
    beats.forEach(function (pos) {
      const local = n - pos;
      value += gaussian(local, -0.027, .010, .07);
      value += gaussian(local, 0, .006, .68);
      value += gaussian(local, .036, .023, .12);
    });

    const x = n * size.pixelWidth;
    const y = baseline - value * size.pixelHeight * .32;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.fillStyle = "#5eead4";
  beats.forEach(function (pos) {
    ctx.beginPath();
    ctx.arc(pos * size.pixelWidth, 22 * dpr, 3 * dpr, 0, TAU);
    ctx.fill();
  });

  ctx.font = "700 " + (8 * dpr) + "px system-ui";
  ctx.fillText("6 segundos · conte 8 QRS", size.pixelWidth * .35, 16 * dpr);
  ctx.restore();
}

function drawFundamentals() {
  if (LAB_STATE.fundamentalPart === "paper") {
    drawCalibration();
    drawRegularFrequency();
    drawIrregularFrequency();
  }
}

/* =========================================================
   GUIDED READING
========================================================= */

function setupGuidedReading() {
  renderGuidedStepList();

  const previous = byId("guidedPrevious");
  const next = byId("guidedNext");
  if (previous) previous.addEventListener("click", function () {
    setGuidedStep(LAB_STATE.guidedStep - 1);
  });
  if (next) next.addEventListener("click", function () {
    setGuidedStep(LAB_STATE.guidedStep + 1);
  });

  renderGuidedDots();
  setGuidedStep(0);
}

function renderGuidedStepList() {
  const holder = byId("guidedStepList");
  if (!holder) return;
  holder.innerHTML = "";

  GUIDED_STEPS.forEach(function (step, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "guided-step-button";
    button.innerHTML =
      "<span>" + (index + 1) + "</span>" +
      "<div><strong>" + step.title + "</strong><small>" + step.subtitle + "</small></div>";
    button.addEventListener("click", function () {
      setGuidedStep(index);
    });
    holder.appendChild(button);
  });
}

function renderGuidedDots() {
  const holder = byId("guidedDots");
  if (!holder) return;
  holder.innerHTML = "";
  GUIDED_STEPS.forEach(function (_, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", "Ir para etapa " + (index + 1));
    button.addEventListener("click", function () {
      setGuidedStep(index);
    });
    holder.appendChild(button);
  });
}

function setGuidedStep(index) {
  LAB_STATE.guidedStep = clamp(index, 0, GUIDED_STEPS.length - 1);
  const step = GUIDED_STEPS[LAB_STATE.guidedStep];

  if (byId("guidedProgress")) byId("guidedProgress").textContent = (LAB_STATE.guidedStep + 1) + " / 9";
  if (byId("guidedStageLabel")) byId("guidedStageLabel").textContent = "ETAPA " + (LAB_STATE.guidedStep + 1) + " DE 9";
  if (byId("guidedTitle")) byId("guidedTitle").textContent = step.title;
  if (byId("guidedQuestion")) byId("guidedQuestion").textContent = step.question;
  if (byId("guidedInfoText")) byId("guidedInfoText").textContent = step.info;

  all(".guided-step-button").forEach(function (button, idx) {
    button.classList.toggle("active", idx === LAB_STATE.guidedStep);
  });
  all("#guidedDots button").forEach(function (button, idx) {
    button.classList.toggle("active", idx === LAB_STATE.guidedStep);
  });

  if (byId("guidedPrevious")) byId("guidedPrevious").disabled = LAB_STATE.guidedStep === 0;
  if (byId("guidedNext")) byId("guidedNext").disabled = LAB_STATE.guidedStep === GUIDED_STEPS.length - 1;

  drawGuided();
}

function drawGuided() {
  const canvas = byId("guidedEcgCanvas");
  if (!canvas || LAB_STATE.section !== "guided") return;
  const size = fitCanvas(canvas, 310);
  const ctx = size.ctx;
  const dpr = size.dpr;

  drawPaperGrid(ctx, size.pixelWidth, size.pixelHeight, dpr, true);

  const baseline = size.pixelHeight * .54;
  const beatPositions = [0.13, 0.32, 0.51, 0.70, 0.89];

  ctx.save();
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "700 " + (12 * dpr) + "px system-ui";
  ctx.fillText("DII", 16 * dpr, 22 * dpr);

  ctx.beginPath();
  const points = 1000;

  for (let i = 0; i < points; i += 1) {
    const n = i / (points - 1);
    let value = 0;
    beatPositions.forEach(function (pos) {
      const local = n - pos;
      value += gaussian(local, -0.045, .013, .10);
      value += gaussian(local, 0, .007, .96);
      value += gaussian(local, .045, .026, .16);
    });
    const x = n * size.pixelWidth;
    const y = baseline - value * size.pixelHeight * .32;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.strokeStyle = "#e5eef7";
  ctx.lineWidth = 1.6 * dpr;
  ctx.stroke();

  if (LAB_STATE.guidedStep === 0 || LAB_STATE.guidedStep === 3) {
    beatPositions.forEach(function (pos) {
      const px = (pos - .045) * size.pixelWidth;
      const rx = pos * size.pixelWidth;

      ctx.fillStyle = "#5eead4";
      ctx.font = "700 " + (10 * dpr) + "px system-ui";
      ctx.fillText("P", px - 4 * dpr, baseline - 34 * dpr);
      ctx.fillText("R", rx - 4 * dpr, baseline - size.pixelHeight * .30);

      ctx.setLineDash([3 * dpr, 3 * dpr]);
      ctx.strokeStyle = "rgba(34,211,238,.65)";
      ctx.beginPath();
      ctx.moveTo(px, baseline - 28 * dpr);
      ctx.lineTo(px, baseline + 22 * dpr);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    const x1 = (beatPositions[0] - .045) * size.pixelWidth;
    const x2 = (beatPositions[4] - .045) * size.pixelWidth;
    const bracketY = baseline + 72 * dpr;
    ctx.strokeStyle = "#5eead4";
    ctx.lineWidth = 1.3 * dpr;
    ctx.beginPath();
    ctx.moveTo(x1, bracketY - 10 * dpr);
    ctx.lineTo(x1, bracketY);
    ctx.lineTo(x2, bracketY);
    ctx.lineTo(x2, bracketY - 10 * dpr);
    ctx.stroke();
    ctx.fillStyle = "#67e8f9";
    ctx.font = "700 " + (10 * dpr) + "px system-ui";
    ctx.fillText("Mesma relação entre P e QRS a cada ciclo", size.pixelWidth * .34, bracketY + 20 * dpr);
  }

  if (LAB_STATE.guidedStep === 2) {
    const x1 = beatPositions[1] * size.pixelWidth;
    const x2 = beatPositions[2] * size.pixelWidth;
    ctx.strokeStyle = "#f8c94f";
    ctx.beginPath();
    ctx.moveTo(x1, 38 * dpr);
    ctx.lineTo(x2, 38 * dpr);
    ctx.stroke();
    ctx.fillStyle = "#fde68a";
    ctx.fillText("R–R", (x1 + x2) / 2 - 12 * dpr, 28 * dpr);
  }

  if (LAB_STATE.guidedStep === 6) {
    ctx.strokeStyle = "#ff7a84";
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    ctx.moveTo(size.pixelWidth * .08, baseline);
    ctx.lineTo(size.pixelWidth * .94, baseline);
    ctx.stroke();
    ctx.fillStyle = "#ff9da5";
    ctx.fillText("linha isoelétrica", size.pixelWidth * .72, baseline - 8 * dpr);
  }

  ctx.restore();
}

/* =========================================================
   PATTERNS
========================================================= */

function setupPatterns() {
  renderPatternTopics();
  setPattern("p-wave");
}

function renderPatternTopics() {
  const holder = byId("patternTopicGrid");
  if (!holder) return;
  holder.innerHTML = "";

  PATTERNS.forEach(function (pattern) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pattern-topic";
    button.dataset.patternId = pattern.id;
    button.innerHTML =
      '<span class="pattern-topic-icon">' +
      '<svg viewBox="0 0 50 30"><path d="M1 18 L8 18 L12 14 L16 19 L21 18 L25 5 L30 26 L34 18 L42 18 L49 18"></path></svg>' +
      "</span>" +
      "<span><strong>" + pattern.title + "</strong><small>" + pattern.subtitle + "</small></span>" +
      "<b>›</b>";
    button.addEventListener("click", function () {
      setPattern(pattern.id);
    });
    holder.appendChild(button);
  });
}

function setPattern(id) {
  LAB_STATE.patternId = id;
  const pattern = PATTERNS.find(function (item) {
    return item.id === id;
  }) || PATTERNS[0];

  all(".pattern-topic").forEach(function (button) {
    button.classList.toggle("active", button.dataset.patternId === id);
  });

  if (byId("patternDetailTitle")) byId("patternDetailTitle").textContent = pattern.detailTitle;
  if (byId("patternDetailText")) byId("patternDetailText").textContent = pattern.detailText;

  const pComparison = byId("pWaveComparison");
  const generic = byId("genericPatternComparison");
  if (pComparison) pComparison.hidden = pattern.kind !== "p";
  if (generic) generic.hidden = pattern.kind === "p";

  if (pattern.kind === "p") {
    drawPWaveComparisons();
  } else {
    if (byId("genericPatternTitle")) byId("genericPatternTitle").textContent = pattern.title;
    if (byId("genericPatternText")) byId("genericPatternText").textContent = pattern.detailText;
    if (byId("genericPatternTags")) {
      byId("genericPatternTags").innerHTML = pattern.tags.map(function (tag) {
        return "<span>" + tag + "</span>";
      }).join("");
    }
    drawGenericPattern(pattern.kind);
  }
}

function drawPatternCanvas(canvas, mode) {
  if (!canvas) return;
  const size = fitCanvas(canvas, 220);
  const ctx = size.ctx;
  const dpr = size.dpr;
  drawPaperGrid(ctx, size.pixelWidth, size.pixelHeight, dpr, true);

  const baseline = size.pixelHeight * .62;
  ctx.save();

  function atrialComponent(n, left) {
    const center = left ? .37 : .31;
    const width = left ? .07 : .055;
    const amp = left ? .26 : .34;
    return gaussian(n, center, width, amp);
  }

  ctx.lineWidth = 1.4 * dpr;

  ctx.beginPath();
  for (let i = 0; i < 500; i += 1) {
    const n = i / 499;
    let value = 0;
    if (mode === "normal") value = atrialComponent(n, false) * .72 + atrialComponent(n, true) * .62;
    if (mode === "left") value = atrialComponent(n, false) * .52 + gaussian(n, .43, .09, .36);
    if (mode === "right") value = gaussian(n, .31, .045, .62) + atrialComponent(n, true) * .28;
    value += gaussian(n, .72, .010, 1.05) - gaussian(n, .69, .012, .17) - gaussian(n, .75, .014, .28);
    const x = n * size.pixelWidth;
    const y = baseline - value * size.pixelHeight * .42;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = "#e8eef6";
  ctx.stroke();

  const components = [
    { color: "#38bdf8", left: false },
    { color: "#f59e0b", left: true }
  ];

  components.forEach(function (part) {
    ctx.beginPath();
    for (let i = 0; i < 260; i += 1) {
      const n = i / 259 * .55;
      let value;
      if (mode === "normal") value = atrialComponent(n, part.left) * (part.left ? .62 : .72);
      else if (mode === "left") value = part.left ? gaussian(n, .43, .09, .36) : atrialComponent(n, false) * .52;
      else value = part.left ? atrialComponent(n, true) * .28 : gaussian(n, .31, .045, .62);
      const x = n * size.pixelWidth;
      const y = baseline - value * size.pixelHeight * .42;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = part.color;
    ctx.lineWidth = 1.25 * dpr;
    ctx.stroke();
  });

  ctx.strokeStyle = "#67e8f9";
  ctx.lineWidth = 1 * dpr;
  ctx.beginPath();
  ctx.moveTo(size.pixelWidth * .22, size.pixelHeight * .25);
  ctx.lineTo(size.pixelWidth * .22, size.pixelHeight * .20);
  ctx.lineTo(size.pixelWidth * .47, size.pixelHeight * .20);
  ctx.lineTo(size.pixelWidth * .47, size.pixelHeight * .25);
  ctx.stroke();

  ctx.fillStyle = "#d9faff";
  ctx.font = "700 " + (9 * dpr) + "px system-ui";
  ctx.fillText("P", size.pixelWidth * .34, size.pixelHeight * .17);
  ctx.restore();
}

function drawPWaveComparisons() {
  if (LAB_STATE.section !== "patterns") return;
  drawPatternCanvas(byId("patternCanvasNormal"), "normal");
  drawPatternCanvas(byId("patternCanvasLeftAtrium"), "left");
  drawPatternCanvas(byId("patternCanvasRightAtrium"), "right");
}

function genericWaveValue(n, kind, variant) {
  let value = leadWave(n, "DII");

  if (kind === "alternans") {
    value *= variant % 2 === 0 ? .55 : 1;
  } else if (kind === "r-progression") {
    value *= 0.45 + Math.min(variant, 4) * 0.18;
  } else if (kind === "q") {
    value -= gaussian(n, .22, .018, .55);
  } else if (kind === "bundle") {
    value = gaussian(n, .12, .026, .12) - gaussian(n, .225, .018, .18) + gaussian(n, .27, .035, .75) - gaussian(n, .32, .030, .28) + gaussian(n, .55, .07, .25);
  } else if (kind === "delta") {
    value += gaussian(n, .205, .040, .35);
  } else if (kind === "low") {
    value *= .38;
  } else if (kind === "st") {
    value += gaussian(n, .39, .080, .20);
  } else if (kind === "potassium") {
    value += gaussian(n, .51, .035, .48);
  } else if (kind === "biphasic") {
    value += gaussian(n, .50, .040, .28) - gaussian(n, .57, .050, .25);
  } else if (kind === "wellens") {
    value -= gaussian(n, .53, .050, .45);
  } else if (kind === "nodal") {
    value -= gaussian(n, .32, .018, .12);
  }

  return value;
}

function drawGenericPattern(kind) {
  const canvas = byId("genericPatternCanvas");
  if (!canvas || LAB_STATE.section !== "patterns") return;
  const size = fitCanvas(canvas, 330);
  const ctx = size.ctx;
  const dpr = size.dpr;
  drawPaperGrid(ctx, size.pixelWidth, size.pixelHeight, dpr, true);

  const baseline1 = size.pixelHeight * .36;
  const baseline2 = size.pixelHeight * .72;
  const rows = [
    { y: baseline1, label: "Referência", color: "#cbd5e1", kind: "normal" },
    { y: baseline2, label: "Padrão selecionado", color: "#5eead4", kind: kind }
  ];

  rows.forEach(function (row, rowIndex) {
    ctx.save();
    ctx.fillStyle = row.color;
    ctx.font = "700 " + (8 * dpr) + "px system-ui";
    ctx.fillText(row.label, 12 * dpr, row.y - 55 * dpr);

    ctx.beginPath();
    const points = 950;
    const beats = kind === "alternans" ? 4 : 3;

    for (let i = 0; i < points; i += 1) {
      const n = i / (points - 1);
      const cyclePosition = n * beats;
      const cycle = cyclePosition % 1;
      const variant = Math.floor(cyclePosition);
      const value = row.kind === "normal"
        ? leadWave(cycle, "DII")
        : genericWaveValue(cycle, kind, variant);
      const x = n * size.pixelWidth;
      const y = row.y - value * size.pixelHeight * .16;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = row.color;
    ctx.lineWidth = 1.5 * dpr;
    ctx.stroke();
    ctx.restore();
  });
}

function drawPatterns() {
  const pattern = PATTERNS.find(function (item) {
    return item.id === LAB_STATE.patternId;
  }) || PATTERNS[0];

  if (pattern.kind === "p") drawPWaveComparisons();
  else drawGenericPattern(pattern.kind);
}

/* =========================================================
   INITIALIZATION
========================================================= */

function setupResize() {
  let timer = null;
  window.addEventListener("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      resizeThree();
      drawEcgMatrix();
      drawFundamentals();
      drawGuided();
      drawPatterns();
    }, 80);
  });

  document.addEventListener("fullscreenchange", function () {
    setTimeout(resizeThree, 70);
  });
}

function showHeartFatalError(error) {
  console.error("Falha ao inicializar o coração 3D:", error);
  const loading = byId("heartModelLoading");
  if (!loading) return;

  loading.classList.add("error");
  loading.innerHTML =
    "<strong>O visualizador 3D não iniciou.</strong>" +
    "<small>O restante do laboratório continua funcionando. Recarregue a página para tentar novamente.</small>";
}

function init() {
  loadCurrentUser();
  if (byId("logoutSidebar")) byId("logoutSidebar").addEventListener("click", logout);

  setupSectionTabs();
  setupFundamentalParts();
  setupSimulatorControls();
  setupEcgInteraction();
  setupElectrodeLearning();
  setupAxisLearning();
  setupPaperLearning();
  setupGuidedReading();
  setupPatterns();
  setupResize();

  /*
   * O 3D é isolado do restante do laboratório.
   * Mesmo se WebGL/modelo falhar, ECG, fundamentos e demais canvases continuam.
   */
  try {
    initHeart3D();
  } catch (error) {
    showHeartFatalError(error);
  }

  LAB_STATE.ecgTime = PHASES[4].progress * getBeatPeriod();
  syncPhaseUi(4, false);
  setLabSection("simulator");
  LAB_STATE.ecgLastFrame = performance.now();
  requestAnimationFrame(simulationFrame);

  requestAnimationFrame(function () {
    drawEcgMatrix();
    drawFundamentals();
    drawGuided();
    drawPatterns();
  });
}

window.addEventListener("error", function (event) {
  if (
    event &&
    event.message &&
    /webgl|three|gltf|module/i.test(event.message)
  ) {
    showHeartFatalError(event.error || new Error(event.message));
  }
});

init();
