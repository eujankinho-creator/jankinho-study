export const ANATOMY_BOUNDS = Object.freeze({
  x: [-2.6, 2.6],
  y: [-2.8, 2.8],
  z: [-1.9, 1.9]
});

export const STRUCTURES = Object.freeze([
  {
    id: "liver",
    name: "Fígado",
    englishName: "Liver",
    region: "Abdome superior direito",
    description: "Maior víscera sólida do abdome. Ocupa predominantemente o hipocôndrio direito e parte do epigástrio, mantendo relação íntima com o diafragma, a vesícula biliar, a veia cava inferior e o sistema porta.",
    kind: "organ",
    shape: "liver",
    center: [-0.62, 0.78, 0.12],
    size: [1.48, 0.88, 0.76],
    rotation: [0.02, -0.12, -0.08],
    color: 0xb65d57,
    hu: 62,
    mrSignal: 0.58,
    studies: ["abdomen_ct_atlas_001", "abdomen_mri_atlas_001"]
  },
  {
    id: "spleen",
    name: "Baço",
    englishName: "Spleen",
    region: "Hipocôndrio esquerdo",
    description: "Órgão linfóide intraperitoneal situado no quadrante superior esquerdo, posteriormente ao estômago e em contato com o diafragma, o rim esquerdo e a cauda do pâncreas.",
    kind: "organ",
    shape: "ellipsoid",
    center: [1.42, 0.72, -0.02],
    size: [0.48, 0.78, 0.38],
    rotation: [0.05, 0.18, -0.22],
    color: 0x8d4f6c,
    hu: 52,
    mrSignal: 0.63,
    studies: ["abdomen_ct_atlas_001", "abdomen_mri_atlas_001"]
  },
  {
    id: "right_kidney",
    name: "Rim direito",
    englishName: "Right kidney",
    region: "Retroperitônio direito",
    description: "Órgão retroperitoneal localizado posteriormente no abdome. Costuma ficar discretamente mais inferior que o rim esquerdo devido à presença do fígado.",
    kind: "organ",
    shape: "kidney-right",
    center: [-1.00, -0.12, -0.48],
    size: [0.48, 0.74, 0.40],
    rotation: [0.06, -0.08, -0.06],
    color: 0x9a5f57,
    hu: 42,
    mrSignal: 0.66,
    studies: ["abdomen_ct_atlas_001", "abdomen_mri_atlas_001"]
  },
  {
    id: "left_kidney",
    name: "Rim esquerdo",
    englishName: "Left kidney",
    region: "Retroperitônio esquerdo",
    description: "Órgão retroperitoneal posterior, geralmente um pouco mais superior que o rim direito. O hilo renal orienta-se medialmente para vasos, linfáticos e ureter.",
    kind: "organ",
    shape: "kidney-left",
    center: [1.00, -0.02, -0.47],
    size: [0.48, 0.74, 0.40],
    rotation: [-0.04, 0.08, 0.07],
    color: 0x9a5f57,
    hu: 42,
    mrSignal: 0.66,
    studies: ["abdomen_ct_atlas_001", "abdomen_mri_atlas_001"]
  },
  {
    id: "stomach",
    name: "Estômago",
    englishName: "Stomach",
    region: "Epigástrio e hipocôndrio esquerdo",
    description: "Órgão intraperitoneal do trato gastrointestinal superior, situado entre esôfago e duodeno. Sua forma e posição variam com conteúdo, postura e biotipo.",
    kind: "organ",
    shape: "stomach",
    center: [0.58, 0.44, 0.48],
    size: [0.68, 0.86, 0.50],
    rotation: [0.10, 0.08, 0.32],
    color: 0xc97a69,
    hu: 30,
    mrSignal: 0.44,
    studies: ["abdomen_ct_atlas_001", "abdomen_mri_atlas_001"]
  },
  {
    id: "pancreas",
    name: "Pâncreas",
    englishName: "Pancreas",
    region: "Retroperitônio central",
    description: "Glândula alongada transversalmente no abdome superior. A cabeça relaciona-se com o duodeno, o corpo cruza a linha média e a cauda dirige-se ao hilo esplênico.",
    kind: "organ",
    shape: "pancreas",
    center: [0.18, 0.14, 0.02],
    size: [1.06, 0.27, 0.26],
    rotation: [0.02, -0.04, 0.03],
    color: 0xd7a66f,
    hu: 46,
    mrSignal: 0.55,
    studies: ["abdomen_ct_atlas_001", "abdomen_mri_atlas_001"]
  },
  {
    id: "aorta",
    name: "Aorta abdominal",
    englishName: "Abdominal aorta",
    region: "Retroperitônio",
    description: "Principal artéria abdominal, posicionada anteriormente à coluna e discretamente à esquerda da linha média. Origina ramos viscerais e parietais ao longo do abdome.",
    kind: "vessel",
    shape: "aorta",
    center: [0.20, -0.03, -0.68],
    size: [0.17, 1.95, 0.17],
    rotation: [0, 0, 0],
    color: 0xd94545,
    hu: 210,
    mrSignal: 0.24,
    studies: ["abdomen_ct_atlas_001", "abdomen_mri_atlas_001"]
  },
  {
    id: "ivc",
    name: "Veia cava inferior",
    englishName: "Inferior vena cava",
    region: "Retroperitônio",
    description: "Grande veia que retorna ao coração o sangue proveniente dos membros inferiores, pelve e abdome. Situa-se à direita da aorta na maior parte do trajeto abdominal.",
    kind: "vessel",
    shape: "ivc",
    center: [-0.24, 0.02, -0.60],
    size: [0.19, 1.92, 0.19],
    rotation: [0, 0, 0],
    color: 0x486fbd,
    hu: 145,
    mrSignal: 0.32,
    studies: ["abdomen_ct_atlas_001", "abdomen_mri_atlas_001"]
  },
  {
    id: "portal_vein",
    name: "Veia porta hepática",
    englishName: "Hepatic portal vein",
    region: "Hilo hepático",
    description: "Vaso de grande calibre que conduz ao fígado sangue proveniente do tubo digestório, baço e pâncreas. É um marco importante na avaliação do hilo hepático.",
    kind: "vessel",
    shape: "portal",
    center: [-0.18, 0.48, -0.05],
    size: [0.13, 0.78, 0.13],
    rotation: [0, 0, 0],
    color: 0x6c6bd0,
    hu: 165,
    mrSignal: 0.34,
    studies: ["abdomen_ct_atlas_001", "abdomen_mri_atlas_001"]
  }
]);

export const STUDIES = Object.freeze([
  {
    id: "abdomen_ct_atlas_001",
    name: "TC Abdome · Atlas sintético",
    modality: "CT",
    bodyRegion: "abdomen",
    slices: 120,
    planes: ["axial", "coronal", "sagittal"],
    source: "Cortex Synthetic Radiology Atlas",
    author: "Cortex",
    license: "Conteúdo didático original do projeto",
    sourceUrl: "",
    licenseUrl: "",
    attribution: "Renderização sintética. Não utiliza imagem ou dado identificável de paciente.",
    spatialMode: "synthetic",
    dicomMetadataAvailable: false
  },
  {
    id: "abdomen_mri_atlas_001",
    name: "RM Abdome · Atlas sintético",
    modality: "MRI",
    bodyRegion: "abdomen",
    slices: 120,
    planes: ["axial", "coronal", "sagittal"],
    source: "Cortex Synthetic Radiology Atlas",
    author: "Cortex",
    license: "Conteúdo didático original do projeto",
    sourceUrl: "",
    licenseUrl: "",
    attribution: "Renderização sintética. Não utiliza imagem ou dado identificável de paciente.",
    spatialMode: "synthetic",
    dicomMetadataAvailable: false
  }
]);

export const MAPPINGS = Object.freeze(
  STRUCTURES.reduce(function (acc, structure) {
    acc[structure.id] = structure.studies.slice();
    return acc;
  }, {})
);

export const SOURCE_REGISTRY = Object.freeze([
  {
    id: "threejs",
    label: "Three.js",
    role: "Motor gráfico 3D",
    source: "three.js",
    author: "three.js authors",
    license: "MIT",
    sourceUrl: "https://threejs.org/",
    licenseUrl: "https://github.com/mrdoob/three.js/blob/dev/LICENSE",
    attribution: "Three.js é utilizado via módulo ESM versionado."
  },
  {
    id: "bodyparts3d",
    label: "BodyParts3D / Anatomography",
    role: "Fonte aberta compatível para futura substituição dos modelos procedurais por malhas anatômicas",
    source: "BodyParts3D",
    author: "Life Science Integrated Database Center",
    license: "CC BY-SA 2.1 Japan",
    sourceUrl: "https://lifesciencedb.jp/bp3d/",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en",
    attribution: "BodyParts3D, Copyright © 2008 Life Science Integrated Database Center."
  },
  {
    id: "anatomy_reference",
    label: "Referência anatômica",
    role: "Revisão de terminologia, planos e relações anatômicas",
    source: "OpenStax Anatomy & Physiology",
    author: "OpenStax / Rice University",
    license: "Referência externa; textos do Cortex são autorais e não reproduzem conteúdo da obra",
    sourceUrl: "https://openstax.org/details/books/anatomy-and-physiology",
    licenseUrl: "https://openstax.org/",
    attribution: "Link de referência acadêmica para aprofundamento."
  }
]);

export const PLANE_CONFIG = Object.freeze({
  axial: {
    label: "Axial",
    axis: "y",
    min: ANATOMY_BOUNDS.y[0],
    max: ANATOMY_BOUNDS.y[1],
    top: "Anterior",
    bottom: "Posterior",
    left: "Direita",
    right: "Esquerda"
  },
  coronal: {
    label: "Coronal",
    axis: "z",
    min: ANATOMY_BOUNDS.z[0],
    max: ANATOMY_BOUNDS.z[1],
    top: "Superior",
    bottom: "Inferior",
    left: "Direita",
    right: "Esquerda"
  },
  sagittal: {
    label: "Sagital",
    axis: "x",
    min: ANATOMY_BOUNDS.x[0],
    max: ANATOMY_BOUNDS.x[1],
    top: "Superior",
    bottom: "Inferior",
    left: "Posterior",
    right: "Anterior"
  }
});

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function invLerp(a, b, value) {
  if (a === b) return 0;
  return (value - a) / (b - a);
}

export function getStructure(id) {
  return STRUCTURES.find(function (structure) {
    return structure.id === id;
  }) || null;
}

export function getStudy(id) {
  return STUDIES.find(function (study) {
    return study.id === id;
  }) || null;
}

export function coordinateForSlice(plane, sliceIndex, sliceCount) {
  const config = PLANE_CONFIG[plane];
  const denominator = Math.max(1, sliceCount - 1);
  const t = clamp(sliceIndex / denominator, 0, 1);
  return lerp(config.min, config.max, t);
}

export function sliceForCoordinate(plane, coordinate, sliceCount) {
  const config = PLANE_CONFIG[plane];
  const t = clamp(invLerp(config.min, config.max, coordinate), 0, 1);
  return Math.round(t * Math.max(1, sliceCount - 1));
}

export function normalRadius(structure, plane) {
  if (plane === "sagittal") return structure.size[0];
  if (plane === "axial") return structure.size[1];
  return structure.size[2];
}

export function structurePlaneCoordinate(structure, plane) {
  if (plane === "sagittal") return structure.center[0];
  if (plane === "axial") return structure.center[1];
  return structure.center[2];
}

export function structuresAtCoordinate(plane, coordinate) {
  return STRUCTURES.filter(function (structure) {
    const radius = normalRadius(structure, plane);
    const center = structurePlaneCoordinate(structure, plane);
    return Math.abs(coordinate - center) <= radius * 1.08;
  });
}
