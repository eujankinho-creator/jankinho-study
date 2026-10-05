export const ANATOMY_ASSET_BASE = "/models/radiology";

/*
 * O HRA continua empacotado como fonte anatômica complementar, mas o modo
 * principal do laboratório passa a usar um CT e a sua própria segmentação.
 * Portanto, o 3D e os cortes compartilham exatamente o mesmo espaço voxel.
 */
export const SYSTEMS = Object.freeze([
  {
    id: "integumentary",
    file: "integumentary_female.glb",
    label: "Contorno corporal",
    category: "body",
    defaultVisible: true,
    opacity: 0.10
  },
  {
    id: "skeletal",
    file: "skeletal_female.glb",
    label: "Ossos e cartilagens",
    category: "bones",
    defaultVisible: true,
    opacity: 0.62
  },
  {
    id: "cardiovascular",
    file: "cardiovascular_female.glb",
    label: "Vasos",
    category: "vessels",
    defaultVisible: true,
    opacity: 0.88
  },
  {
    id: "digestive",
    file: "digestive_female.glb",
    label: "Digestório",
    category: "organs",
    defaultVisible: true,
    opacity: 0.82
  },
  {
    id: "renal",
    file: "renal_female.glb",
    label: "Urinário",
    category: "organs",
    defaultVisible: true,
    opacity: 0.88
  },
  {
    id: "lymphatic",
    file: "lymphatic_female.glb",
    label: "Linfático",
    category: "organs",
    defaultVisible: true,
    opacity: 0.58
  },
  {
    id: "reproductive",
    file: "reproductive_female.glb",
    label: "Pelve",
    category: "organs",
    defaultVisible: true,
    opacity: 0.76
  }
]);

export const TOTAL_SEGMENTATOR_CLASS_NAMES = Object.freeze({
  1: "spleen",
  2: "kidney_right",
  3: "kidney_left",
  4: "gallbladder",
  5: "liver",
  6: "stomach",
  7: "pancreas",
  8: "adrenal_gland_right",
  9: "adrenal_gland_left",
  10: "lung_upper_lobe_left",
  11: "lung_lower_lobe_left",
  12: "lung_upper_lobe_right",
  13: "lung_middle_lobe_right",
  14: "lung_lower_lobe_right",
  15: "esophagus",
  16: "trachea",
  17: "thyroid_gland",
  18: "small_bowel",
  19: "duodenum",
  20: "colon",
  21: "urinary_bladder",
  22: "prostate",
  23: "kidney_cyst_left",
  24: "kidney_cyst_right",
  25: "sacrum",
  26: "vertebrae_S1",
  27: "vertebrae_L5",
  28: "vertebrae_L4",
  29: "vertebrae_L3",
  30: "vertebrae_L2",
  31: "vertebrae_L1",
  32: "vertebrae_T12",
  33: "vertebrae_T11",
  34: "vertebrae_T10",
  35: "vertebrae_T9",
  36: "vertebrae_T8",
  37: "vertebrae_T7",
  38: "vertebrae_T6",
  39: "vertebrae_T5",
  40: "vertebrae_T4",
  41: "vertebrae_T3",
  42: "vertebrae_T2",
  43: "vertebrae_T1",
  44: "vertebrae_C7",
  45: "vertebrae_C6",
  46: "vertebrae_C5",
  47: "vertebrae_C4",
  48: "vertebrae_C3",
  49: "vertebrae_C2",
  50: "vertebrae_C1",
  51: "heart",
  52: "aorta",
  53: "pulmonary_vein",
  54: "brachiocephalic_trunk",
  55: "subclavian_artery_right",
  56: "subclavian_artery_left",
  57: "common_carotid_artery_right",
  58: "common_carotid_artery_left",
  59: "brachiocephalic_vein_left",
  60: "brachiocephalic_vein_right",
  61: "atrial_appendage_left",
  62: "superior_vena_cava",
  63: "inferior_vena_cava",
  64: "portal_vein_and_splenic_vein",
  65: "iliac_artery_left",
  66: "iliac_artery_right",
  67: "iliac_vena_left",
  68: "iliac_vena_right",
  69: "humerus_left",
  70: "humerus_right",
  71: "scapula_left",
  72: "scapula_right",
  73: "clavicula_left",
  74: "clavicula_right",
  75: "femur_left",
  76: "femur_right",
  77: "hip_left",
  78: "hip_right",
  79: "spinal_cord",
  80: "gluteus_maximus_left",
  81: "gluteus_maximus_right",
  82: "gluteus_medius_left",
  83: "gluteus_medius_right",
  84: "gluteus_minimus_left",
  85: "gluteus_minimus_right",
  86: "autochthon_left",
  87: "autochthon_right",
  88: "iliopsoas_left",
  89: "iliopsoas_right",
  90: "brain",
  91: "skull",
  92: "rib_left_1",
  93: "rib_left_2",
  94: "rib_left_3",
  95: "rib_left_4",
  96: "rib_left_5",
  97: "rib_left_6",
  98: "rib_left_7",
  99: "rib_left_8",
  100: "rib_left_9",
  101: "rib_left_10",
  102: "rib_left_11",
  103: "rib_left_12",
  104: "rib_right_1",
  105: "rib_right_2",
  106: "rib_right_3",
  107: "rib_right_4",
  108: "rib_right_5",
  109: "rib_right_6",
  110: "rib_right_7",
  111: "rib_right_8",
  112: "rib_right_9",
  113: "rib_right_10",
  114: "rib_right_11",
  115: "rib_right_12",
  116: "sternum",
  117: "costal_cartilages"
});

export const STRUCTURES = Object.freeze([
  {
    id: "spleen",
    label: 1,
    name: "Baço",
    englishName: "Spleen",
    region: "Hipocôndrio esquerdo",
    category: "organs",
    color: "#9b5f81",
    description: "Órgão linfóide do quadrante superior esquerdo, segmentado diretamente neste exame."
  },
  {
    id: "right_kidney",
    label: 2,
    name: "Rim direito",
    englishName: "Right kidney",
    region: "Retroperitônio direito",
    category: "organs",
    color: "#b96f62",
    description: "Rim direito segmentado voxel a voxel no mesmo volume de TC."
  },
  {
    id: "left_kidney",
    label: 3,
    name: "Rim esquerdo",
    englishName: "Left kidney",
    region: "Retroperitônio esquerdo",
    category: "organs",
    color: "#c27a68",
    description: "Rim esquerdo segmentado voxel a voxel no mesmo volume de TC."
  },
  {
    id: "gallbladder",
    label: 4,
    name: "Vesícula biliar",
    englishName: "Gallbladder",
    region: "Hipocôndrio direito",
    category: "organs",
    color: "#78a75d",
    description: "Vesícula biliar segmentada no exame, inferior à superfície visceral do fígado."
  },
  {
    id: "liver",
    label: 5,
    name: "Fígado",
    englishName: "Liver",
    region: "Hipocôndrio direito e epigástrio",
    category: "organs",
    color: "#a95b4d",
    description: "Maior víscera sólida abdominal, segmentada diretamente neste paciente de referência."
  },
  {
    id: "stomach",
    label: 6,
    name: "Estômago",
    englishName: "Stomach",
    region: "Epigástrio e hipocôndrio esquerdo",
    category: "organs",
    color: "#d08a76",
    description: "Estômago segmentado no mesmo espaço do exame; sua forma varia conforme distensão e conteúdo."
  },
  {
    id: "pancreas",
    label: 7,
    name: "Pâncreas",
    englishName: "Pancreas",
    region: "Abdome superior / retroperitônio",
    category: "organs",
    color: "#d6ad73",
    description: "Pâncreas segmentado no volume real, permitindo localizar cabeça, corpo e cauda nos cortes."
  },
  {
    id: "right_adrenal",
    label: 8,
    name: "Suprarrenal direita",
    englishName: "Right adrenal gland",
    region: "Retroperitônio direito",
    category: "organs",
    color: "#d5c06f",
    description: "Glândula suprarrenal direita segmentada diretamente no exame."
  },
  {
    id: "left_adrenal",
    label: 9,
    name: "Suprarrenal esquerda",
    englishName: "Left adrenal gland",
    region: "Retroperitônio esquerdo",
    category: "organs",
    color: "#e0cc7b",
    description: "Glândula suprarrenal esquerda segmentada diretamente no exame."
  },
  {
    id: "small_bowel",
    label: 18,
    name: "Intestino delgado",
    englishName: "Small bowel",
    region: "Abdome central e inferior",
    category: "organs",
    color: "#cf8b9d",
    description: "Alças de intestino delgado segmentadas no volume de referência."
  },
  {
    id: "duodenum",
    label: 19,
    name: "Duodeno",
    englishName: "Duodenum",
    region: "Abdome superior",
    category: "organs",
    color: "#d6a681",
    description: "Duodeno segmentado no mesmo exame, em relação íntima com pâncreas e vasos mesentéricos."
  },
  {
    id: "colon",
    label: 20,
    name: "Cólon",
    englishName: "Colon",
    region: "Abdome e pelve",
    category: "organs",
    color: "#bd806f",
    description: "Cólon segmentado no exame, incluindo seus principais trajetos abdominais."
  },
  {
    id: "urinary_bladder",
    label: 21,
    name: "Bexiga urinária",
    englishName: "Urinary bladder",
    region: "Pelve",
    category: "organs",
    color: "#65a7cf",
    description: "Bexiga urinária segmentada no mesmo estudo."
  },
  {
    id: "aorta",
    label: 52,
    name: "Aorta",
    englishName: "Aorta",
    region: "Tórax e retroperitônio",
    category: "vessels",
    color: "#ee626b",
    description: "Aorta segmentada no próprio exame, permitindo acompanhar seu trajeto diretamente em 3D e nos cortes."
  },
  {
    id: "ivc",
    label: 63,
    name: "Veia cava inferior",
    englishName: "Inferior vena cava",
    region: "Retroperitônio",
    category: "vessels",
    color: "#5e86d6",
    description: "Veia cava inferior segmentada no mesmo volume."
  },
  {
    id: "portal_vein",
    label: 64,
    name: "Veia porta / esplênica",
    englishName: "Portal and splenic vein",
    region: "Hilo hepático e abdome superior",
    category: "vessels",
    color: "#7569ca",
    description: "Sistema porta principal segmentado no exame de referência."
  },
  {
    id: "iliac_artery_left",
    label: 65,
    name: "Artéria ilíaca esquerda",
    englishName: "Left iliac artery",
    region: "Pelve",
    category: "vessels",
    color: "#e57172",
    description: "Artéria ilíaca esquerda segmentada no mesmo exame."
  },
  {
    id: "iliac_artery_right",
    label: 66,
    name: "Artéria ilíaca direita",
    englishName: "Right iliac artery",
    region: "Pelve",
    category: "vessels",
    color: "#dc6269",
    description: "Artéria ilíaca direita segmentada no mesmo exame."
  },
  {
    id: "iliac_vein_left",
    label: 67,
    name: "Veia ilíaca esquerda",
    englishName: "Left iliac vein",
    region: "Pelve",
    category: "vessels",
    color: "#5f78c8",
    description: "Veia ilíaca esquerda segmentada no mesmo exame."
  },
  {
    id: "iliac_vein_right",
    label: 68,
    name: "Veia ilíaca direita",
    englishName: "Right iliac vein",
    region: "Pelve",
    category: "vessels",
    color: "#546fbf",
    description: "Veia ilíaca direita segmentada no mesmo exame."
  }
]);

export const SKELETAL_CONTEXT_LABELS = Object.freeze([
  25, 26, 27, 28, 29, 30, 31, 32, 77, 78
]);

export const RADIOLOGY_STUDY = Object.freeze({
  id: "totalsegmentator_coreg_reference",
  name: "TC segmentada · mesmo exame 3D/MPR",
  modality: "CT",
  file: "/data/radiology/totalseg_example_ct.nii.gz",
  segmentationFile: "/data/radiology/totalseg_example_seg.nii.gz",
  source: "TotalSegmentator · arquivos de referência do repositório",
  credit: "University Hospital Basel / TotalSegmentator contributors",
  license: "Apache-2.0 (repositório TotalSegmentator)",
  spatialMode: "same-subject-coregistered",
  note:
    "O 3D e os cortes usam o mesmo CT e a mesma segmentação NIfTI. A posição entre estrutura e corte é derivada diretamente dos voxels, sem aproximação entre sujeitos."
});

export const SOURCE_REGISTRY = Object.freeze([
  {
    id: "totalsegmentator",
    label: "TotalSegmentator · CT + segmentação",
    role: "Exame real de referência e máscara anatômica co-registrada",
    source: "TotalSegmentator repository reference files",
    author: "University Hospital Basel / TotalSegmentator contributors",
    license: "Apache-2.0 conforme o repositório",
    sourceUrl: "https://github.com/wasserth/TotalSegmentator",
    licenseUrl: "https://github.com/wasserth/TotalSegmentator/blob/master/LICENSE",
    attribution:
      "O Cortex usa example_ct.nii.gz e example_seg.nii.gz do conjunto de testes do TotalSegmentator para manter CT e segmentação no mesmo espaço."
  },
  {
    id: "hra",
    label: "Human Reference Atlas · referência complementar",
    role: "Malhas anatômicas reais de referência disponíveis para evolução do atlas",
    source: "HuBMAP Human Reference Atlas / NIH",
    author: "HuBMAP Consortium / U.S. National Library of Medicine",
    license: "CC BY 4.0",
    sourceUrl: "https://humanatlas.io/",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    attribution:
      "HRA 3D Reference Organ Library, derived from Visible Human Female."
  },
  {
    id: "niivue",
    label: "NiiVue",
    role: "Renderização WebGL do CT, segmentação, MPR e 3D",
    source: "NiiVue",
    author: "NiiVue authors",
    license: "BSD-2-Clause",
    sourceUrl: "https://github.com/niivue/niivue",
    licenseUrl: "https://github.com/niivue/niivue/blob/main/LICENSE",
    attribution:
      "Renderização do NIfTI, volume 3D e planos multiplanares no navegador."
  }
]);

export const PLANE_CONFIG = Object.freeze({
  axial: {
    label: "Axial",
    fracAxis: 2,
    top: "Anterior",
    bottom: "Posterior",
    left: "Direita",
    right: "Esquerda"
  },
  coronal: {
    label: "Coronal",
    fracAxis: 1,
    top: "Superior",
    bottom: "Inferior",
    left: "Direita",
    right: "Esquerda"
  },
  sagittal: {
    label: "Sagital",
    fracAxis: 0,
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

export function getStructureByLabel(label) {
  const numeric = Math.round(Number(label));
  return STRUCTURES.find(function (structure) {
    return structure.label === numeric;
  }) || null;
}

export function getSystem(id) {
  return SYSTEMS.find(function (system) {
    return system.id === id;
  }) || null;
}

const HRA_STRUCTURE_MATCHERS = Object.freeze({
  spleen: {
    systems: ["lymphatic", "digestive"],
    match: [/spleen/i]
  },
  right_kidney: {
    systems: ["renal"],
    match: [
      /kidney.*right/i,
      /right.*kidney/i,
      /kidney.*_R\b/i,
      /renal.*_R\b/i,
      /\(right\)/i
    ]
  },
  left_kidney: {
    systems: ["renal"],
    match: [
      /kidney.*left/i,
      /left.*kidney/i,
      /kidney.*_L\b/i,
      /renal.*_L\b/i,
      /\(left\)/i
    ]
  },
  gallbladder: {
    systems: ["digestive"],
    match: [/gall.?bladder/i]
  },
  liver: {
    systems: ["digestive"],
    match: [/liver/i]
  },
  stomach: {
    systems: ["digestive"],
    match: [/stomach/i]
  },
  pancreas: {
    systems: ["digestive"],
    match: [/pancreas/i]
  },
  right_adrenal: {
    systems: ["renal"],
    match: [/adrenal.*right/i, /right.*adrenal/i]
  },
  left_adrenal: {
    systems: ["renal"],
    match: [/adrenal.*left/i, /left.*adrenal/i]
  },
  small_bowel: {
    systems: ["digestive"],
    match: [/small.?intest/i, /jejun/i, /jejenum/i, /ileum/i]
  },
  duodenum: {
    systems: ["digestive"],
    match: [/duoden/i]
  },
  colon: {
    systems: ["digestive"],
    match: [/colon/i, /large.?intest/i]
  },
  urinary_bladder: {
    systems: ["renal", "reproductive"],
    match: [/urinary.?bladder/i, /bladder/i]
  },
  aorta: {
    systems: ["cardiovascular"],
    match: [/aorta/i]
  },
  ivc: {
    systems: ["cardiovascular"],
    match: [/inferior.?vena.?cava/i, /vena.?cava.*inferior/i]
  },
  portal_vein: {
    systems: ["cardiovascular", "digestive"],
    match: [/portal.?vein/i, /splenic.?vein/i]
  },
  iliac_artery_left: {
    systems: ["cardiovascular"],
    match: [/iliac.*arter.*left/i, /left.*iliac.*arter/i]
  },
  iliac_artery_right: {
    systems: ["cardiovascular"],
    match: [/iliac.*arter.*right/i, /right.*iliac.*arter/i]
  },
  iliac_vein_left: {
    systems: ["cardiovascular"],
    match: [/iliac.*vein.*left/i, /left.*iliac.*vein/i]
  },
  iliac_vein_right: {
    systems: ["cardiovascular"],
    match: [/iliac.*vein.*right/i, /right.*iliac.*vein/i]
  }
});

export function structureMatchesObject(structure, systemId, objectName) {
  if (!structure || !objectName) return false;

  const fallback = HRA_STRUCTURE_MATCHERS[structure.id] || null;
  const matchers = Array.isArray(structure.match)
    ? structure.match
    : (fallback ? fallback.match : []);
  const systems = Array.isArray(structure.systems)
    ? structure.systems
    : (fallback ? fallback.systems : null);

  if (!matchers.length) return false;
  if (systems && !systems.includes(systemId)) return false;

  return matchers.some(function (matcher) {
    return matcher.test(objectName);
  });
}

export function hexToRgb(hex) {
  const value = String(hex || "#7ec8ff").replace("#", "");
  const full = value.length === 3
    ? value.split("").map(function (part) { return part + part; }).join("")
    : value;
  const numeric = Number.parseInt(full, 16);
  return [
    (numeric >> 16) & 255,
    (numeric >> 8) & 255,
    numeric & 255
  ];
}

export function createSegmentationColormap(options) {
  const config = options || {};
  const selectedLabel = Number(config.selectedLabel || 0);
  const hiddenLabels = config.hiddenLabels instanceof Set
    ? config.hiddenLabels
    : new Set();
  const showContext = config.showContext !== false;
  const showAllTargetStructures = config.showAllTargetStructures !== false;

  const maxLabel = 117;
  const R = [];
  const G = [];
  const B = [];
  const A = [];
  const I = [];
  const labels = [];

  for (let label = 0; label <= maxLabel; label += 1) {
    const structure = getStructureByLabel(label);
    const className = TOTAL_SEGMENTATOR_CLASS_NAMES[label] || ("classe_" + label);
    const context = SKELETAL_CONTEXT_LABELS.includes(label);

    let rgb = [125, 140, 153];
    let alpha = 0;

    if (label === 0) {
      rgb = [0, 0, 0];
      alpha = 0;
    }
    else if (structure) {
      rgb = hexToRgb(structure.color);
      if (!hiddenLabels.has(label)) {
        alpha = selectedLabel === label
          ? 255
          : (showAllTargetStructures ? 122 : 0);
      }
    }
    else if (context && showContext) {
      rgb = [220, 212, 192];
      alpha = 42;
    }

    R.push(rgb[0]);
    G.push(rgb[1]);
    B.push(rgb[2]);
    A.push(alpha);
    I.push(label);
    labels.push(structure ? structure.name : className);
  }

  return { R, G, B, A, I, labels };
}
