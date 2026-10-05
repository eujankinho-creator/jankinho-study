export const ANATOMY_ASSET_BASE = "/models/radiology";

export const SYSTEMS = Object.freeze([
  {
    id: "integumentary",
    file: "integumentary_female.glb",
    label: "Contorno corporal",
    category: "body",
    defaultVisible: true,
    opacity: 0.12
  },
  {
    id: "skeletal",
    file: "skeletal_female.glb",
    label: "Ossos e cartilagens",
    category: "bones",
    defaultVisible: true,
    opacity: 0.38
  },
  {
    id: "cardiovascular",
    file: "cardiovascular_female.glb",
    label: "Vasos",
    category: "vessels",
    defaultVisible: true,
    opacity: 0.86
  },
  {
    id: "digestive",
    file: "digestive_female.glb",
    label: "Digestório",
    category: "organs",
    defaultVisible: true,
    opacity: 0.88
  },
  {
    id: "renal",
    file: "renal_female.glb",
    label: "Urinário",
    category: "organs",
    defaultVisible: true,
    opacity: 0.90
  },
  {
    id: "lymphatic",
    file: "lymphatic_female.glb",
    label: "Linfático",
    category: "organs",
    defaultVisible: true,
    opacity: 0.86
  },
  {
    id: "reproductive",
    file: "reproductive_female.glb",
    label: "Pelve",
    category: "organs",
    defaultVisible: false,
    opacity: 0.78
  }
]);

export const STRUCTURES = Object.freeze([
  {
    id: "aorta",
    name: "Aorta",
    englishName: "Aorta",
    region: "Tórax e retroperitônio",
    description:
      "Maior artéria do corpo. No modelo HRA, o segmento descendente atravessa o tórax e continua no abdome, onde origina ramos viscerais e ilíacos.",
    category: "vessels",
    systems: ["cardiovascular"],
    match: [/descending_aorta/i, /\baorta\b/i],
    color: "#ef6d72",
    focusFrac: [0.50, 0.50, 0.51]
  },
  {
    id: "ivc",
    name: "Veia cava inferior",
    englishName: "Inferior vena cava",
    region: "Retroperitônio",
    description:
      "Grande veia sistêmica que retorna ao átrio direito o sangue proveniente dos membros inferiores, pelve e abdome.",
    category: "vessels",
    systems: ["cardiovascular"],
    match: [/inferior_vena_cava/i],
    color: "#6396ff",
    focusFrac: [0.47, 0.50, 0.52]
  },
  {
    id: "liver",
    name: "Fígado",
    englishName: "Liver",
    region: "Hipocôndrio direito e epigástrio",
    description:
      "Maior víscera sólida abdominal. O atlas HRA preserva superfícies, lobos, impressões, ligamentos, cápsula e porta hepatis como malhas anatômicas separadas.",
    category: "organs",
    systems: ["digestive"],
    match: [
      /liver/i,
      /hepatis/i,
      /hepatic/i,
      /caudate_lobe/i,
      /quadrate_lobe/i,
      /porta_hepatis/i
    ],
    color: "#a85c4d",
    focusFrac: [0.39, 0.55, 0.63]
  },
  {
    id: "pancreas",
    name: "Pâncreas",
    englishName: "Pancreas",
    region: "Abdome superior / retroperitônio",
    description:
      "Glândula alongada no abdome superior. Cabeça, colo, corpo, cauda, processo uncinado e ductos são representados por malhas do HRA.",
    category: "organs",
    systems: ["digestive"],
    match: [/pancrea/i, /ucinate_process/i],
    color: "#d7ad74",
    focusFrac: [0.51, 0.52, 0.58]
  },
  {
    id: "left_kidney",
    name: "Rim esquerdo",
    englishName: "Left kidney",
    region: "Retroperitônio esquerdo",
    description:
      "Rim esquerdo do atlas HRA, com cápsula, córtex, pirâmides, papilas, hilo e componentes do sistema coletor.",
    category: "organs",
    systems: ["renal"],
    match: [
      /kidney.*_L\b/i,
      /renal_.*_L\b/i,
      /_kidney_L\b/i,
      /_renal_.*_L\b/i
    ],
    color: "#b56b60",
    focusFrac: [0.62, 0.48, 0.48]
  },
  {
    id: "right_kidney",
    name: "Rim direito",
    englishName: "Right kidney",
    region: "Retroperitônio direito",
    description:
      "Rim direito do atlas HRA, incluindo estruturas externas e internas modeladas em malhas anatômicas reais de referência.",
    category: "organs",
    systems: ["renal"],
    match: [
      /kidney.*_R\b/i,
      /renal_.*_R\b/i,
      /_kidney_R\b/i,
      /_renal_.*_R\b/i
    ],
    color: "#b56b60",
    focusFrac: [0.38, 0.48, 0.47]
  },
  {
    id: "spleen",
    name: "Baço",
    englishName: "Spleen",
    region: "Hipocôndrio esquerdo",
    description:
      "Órgão linfóide do quadrante superior esquerdo. O modelo inclui superfícies de impressão e hilo esplênico.",
    category: "organs",
    systems: ["lymphatic"],
    match: [/spleen/i, /splen/i],
    color: "#86506d",
    focusFrac: [0.68, 0.56, 0.63]
  }
]);

export const RADIOLOGY_STUDY = Object.freeze({
  id: "ct_abdomen_real_001",
  name: "TC Abdome · dataset real de demonstração",
  modality: "CT",
  file: "/data/radiology/CT_Abdo.nii.gz",
  source: "NiiVue demo images / Slicer3D example dataset",
  credit: "Steve Pieper",
  originalDataset: "CTA-cardio.nrrd",
  spatialMode: "independent-reference",
  note:
    "A TC e o atlas HRA são materiais reais de referência, porém pertencem a sujeitos/fontes diferentes. A sincronização entre eles é didática por posição relativa, não um registro DICOM do mesmo paciente."
});

export const SOURCE_REGISTRY = Object.freeze([
  {
    id: "hra",
    label: "Human Reference Atlas · Anatomia 3D",
    role: "Malhas anatômicas reais de referência",
    source: "HuBMAP Human Reference Atlas / NIH",
    author: "HuBMAP Consortium / U.S. National Library of Medicine",
    license: "CC BY 4.0",
    sourceUrl: "https://humanatlas.io/",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    attribution:
      "HRA 3D Reference Organ Library, derived from Visible Human Female. Arquivos por sistema preservam os nomes e coordenadas do atlas."
  },
  {
    id: "anatria",
    label: "Anatria-3D · empacotamento HRA",
    role: "GLBs por sistema anatômico usados no Cortex",
    source: "Anatria-3D",
    author: "Nurkan1 / contributors",
    license: "Mantém atribuição HRA CC BY 4.0",
    sourceUrl: "https://github.com/Nurkan1/Anatria-3D",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    attribution:
      "Arquivos derivados do HRA foram separados por sistema para carregamento web e mantêm NOTICE/Licença no deploy."
  },
  {
    id: "ct_abdo",
    label: "CT_Abdo · TC real",
    role: "Volume radiológico NIfTI",
    source: "NiiVue demo images / Slicer3D example dataset",
    author: "Steve Pieper",
    license:
      "Proveniência pública de demonstração conforme README do repositório NiiVue; não reclassificado pelo Cortex",
    sourceUrl: "https://github.com/niivue/niivue-demo-images",
    licenseUrl: "https://github.com/niivue/niivue-demo-images/blob/main/README.md",
    attribution:
      "CT_Abdo foi fornecido por Steve Pieper e deriva de um exemplo do Slicer3D."
  },
  {
    id: "niivue",
    label: "NiiVue",
    role: "Visualizador WebGL de imagens médicas",
    source: "NiiVue",
    author: "NiiVue authors",
    license: "BSD-2-Clause",
    sourceUrl: "https://github.com/niivue/niivue",
    licenseUrl: "https://github.com/niivue/niivue/blob/main/LICENSE",
    attribution:
      "Renderização multiplanar e navegação do volume NIfTI no navegador."
  },
  {
    id: "threejs",
    label: "Three.js",
    role: "Motor gráfico da anatomia 3D",
    source: "three.js",
    author: "three.js authors",
    license: "MIT",
    sourceUrl: "https://threejs.org/",
    licenseUrl: "https://github.com/mrdoob/three.js/blob/dev/LICENSE",
    attribution: "Usado para carregar, selecionar e cortar as malhas GLB."
  }
]);

export const PLANE_CONFIG = Object.freeze({
  axial: {
    label: "Axial",
    fracAxis: 2,
    threeAxis: "y",
    top: "Anterior",
    bottom: "Posterior",
    left: "Direita",
    right: "Esquerda"
  },
  coronal: {
    label: "Coronal",
    fracAxis: 1,
    threeAxis: "z",
    top: "Superior",
    bottom: "Inferior",
    left: "Direita",
    right: "Esquerda"
  },
  sagittal: {
    label: "Sagital",
    fracAxis: 0,
    threeAxis: "x",
    top: "Superior",
    bottom: "Inferior",
    left: "Posterior",
    right: "Anterior"
  }
});

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function getStructure(id) {
  return STRUCTURES.find(function (structure) {
    return structure.id === id;
  }) || null;
}

export function getSystem(id) {
  return SYSTEMS.find(function (system) {
    return system.id === id;
  }) || null;
}

export function structureMatchesObject(structure, systemId, objectName) {
  if (!structure || !objectName) return false;
  if (structure.systems && !structure.systems.includes(systemId)) return false;
  return structure.match.some(function (matcher) {
    return matcher.test(objectName);
  });
}
