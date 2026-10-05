export const PLANE_CONFIG = Object.freeze({
  axial: { label: "Axial", fracAxis: 2, top: "Anterior", bottom: "Posterior", left: "Direita", right: "Esquerda" },
  coronal: { label: "Coronal", fracAxis: 1, top: "Superior", bottom: "Inferior", left: "Direita", right: "Esquerda" },
  sagittal: { label: "Sagital", fracAxis: 0, top: "Superior", bottom: "Inferior", left: "Posterior", right: "Anterior" }
});

export const SEGMENTATION_GROUPS = Object.freeze([
  { id: "organs", file: "organs_label.nii.gz", opacity: 0.30 },
  { id: "cardiac", file: "cardiac_label.nii.gz", opacity: 0.34 },
  { id: "muscles", file: "muscles_label.nii.gz", opacity: 0.24 }
]);

const defs = [
  ["left_adrenal", "organs", 1, "Suprarrenal esquerda", "Left adrenal gland", "Abdômen", "organs", "#d6c36f"],
  ["right_adrenal", "organs", 2, "Suprarrenal direita", "Right adrenal gland", "Abdômen", "organs", "#d7b85f"],
  ["colon", "organs", 3, "Cólon", "Colon", "Abdômen e pelve", "organs", "#bd806f"],
  ["duodenum", "organs", 4, "Duodeno", "Duodenum", "Abdômen", "organs", "#d6a681"],
  ["esophagus", "organs", 5, "Esôfago", "Esophagus", "Tórax", "organs", "#c4917b"],
  ["gallbladder", "organs", 6, "Vesícula biliar", "Gallbladder", "Abdômen", "organs", "#78a75d"],
  ["left_kidney", "organs", 7, "Rim esquerdo", "Left kidney", "Abdômen", "organs", "#c27a68"],
  ["right_kidney", "organs", 8, "Rim direito", "Right kidney", "Abdômen", "organs", "#b96f62"],
  ["liver", "organs", 9, "Fígado", "Liver", "Abdômen", "organs", "#a95b4d"],
  ["left_lung_lower", "organs", 10, "Pulmão esquerdo · lobo inferior", "Left lung lower lobe", "Tórax", "organs", "#76a8c7"],
  ["right_lung_lower", "organs", 11, "Pulmão direito · lobo inferior", "Right lung lower lobe", "Tórax", "organs", "#6f9fbd"],
  ["right_lung_middle", "organs", 12, "Pulmão direito · lobo médio", "Right lung middle lobe", "Tórax", "organs", "#79aecb"],
  ["left_lung_upper", "organs", 13, "Pulmão esquerdo · lobo superior", "Left lung upper lobe", "Tórax", "organs", "#7eb7d5"],
  ["right_lung_upper", "organs", 14, "Pulmão direito · lobo superior", "Right lung upper lobe", "Tórax", "organs", "#73aac9"],
  ["pancreas", "organs", 15, "Pâncreas", "Pancreas", "Abdômen", "organs", "#d6ad73"],
  ["small_bowel", "organs", 16, "Intestino delgado", "Small bowel", "Abdômen", "organs", "#cf8b9d"],
  ["spleen", "organs", 17, "Baço", "Spleen", "Abdômen", "organs", "#9b5f81"],
  ["stomach", "organs", 18, "Estômago", "Stomach", "Abdômen", "organs", "#d08a76"],
  ["trachea", "organs", 19, "Traqueia", "Trachea", "Pescoço e tórax", "organs", "#8fc6bf"],
  ["urinary_bladder", "organs", 20, "Bexiga urinária", "Urinary bladder", "Pelve", "organs", "#65a7cf"],

  ["left_autochthon", "muscles", 1, "Paravertebrais esquerdos", "Left autochthon", "Coluna", "muscles", "#b87773"],
  ["right_autochthon", "muscles", 2, "Paravertebrais direitos", "Right autochthon", "Coluna", "muscles", "#b26e6c"],
  ["brain", "muscles", 3, "Encéfalo", "Brain", "Cabeça", "organs", "#d8a0b8"],
  ["left_clavicle", "muscles", 4, "Clavícula esquerda", "Left clavicle", "Tórax", "bones", "#ded5c5"],
  ["right_clavicle", "muscles", 5, "Clavícula direita", "Right clavicle", "Tórax", "bones", "#e4dacb"],
  ["left_femur", "muscles", 6, "Fêmur esquerdo", "Left femur", "Coxa", "bones", "#d8d0bf"],
  ["right_femur", "muscles", 7, "Fêmur direito", "Right femur", "Coxa", "bones", "#ddd5c7"],
  ["left_gluteus_maximus", "muscles", 8, "Glúteo máximo esquerdo", "Left gluteus maximus", "Pelve", "muscles", "#b96f83"],
  ["right_gluteus_maximus", "muscles", 9, "Glúteo máximo direito", "Right gluteus maximus", "Pelve", "muscles", "#b5667c"],
  ["left_gluteus_medius", "muscles", 10, "Glúteo médio esquerdo", "Left gluteus medius", "Pelve", "muscles", "#c47b8c"],
  ["right_gluteus_medius", "muscles", 11, "Glúteo médio direito", "Right gluteus medius", "Pelve", "muscles", "#bd7286"],
  ["left_gluteus_minimus", "muscles", 12, "Glúteo mínimo esquerdo", "Left gluteus minimus", "Pelve", "muscles", "#cc8795"],
  ["right_gluteus_minimus", "muscles", 13, "Glúteo mínimo direito", "Right gluteus minimus", "Pelve", "muscles", "#c47e91"],
  ["left_hip", "muscles", 14, "Osso do quadril esquerdo", "Left hip", "Pelve", "bones", "#d5cbbb"],
  ["right_hip", "muscles", 15, "Osso do quadril direito", "Right hip", "Pelve", "bones", "#ddd3c4"],
  ["left_humerus", "muscles", 16, "Úmero esquerdo", "Left humerus", "Tórax / membro superior", "bones", "#d7cfbf"],
  ["right_humerus", "muscles", 17, "Úmero direito", "Right humerus", "Tórax / membro superior", "bones", "#ded6c8"],
  ["left_iliopsoas", "muscles", 18, "Iliopsoas esquerdo", "Left iliopsoas", "Abdômen e pelve", "muscles", "#b66e64"],
  ["right_iliopsoas", "muscles", 19, "Iliopsoas direito", "Right iliopsoas", "Abdômen e pelve", "muscles", "#ad655e"],
  ["left_scapula", "muscles", 20, "Escápula esquerda", "Left scapula", "Tórax", "bones", "#d5ccbd"],
  ["right_scapula", "muscles", 21, "Escápula direita", "Right scapula", "Tórax", "bones", "#ddd4c6"],

  ["aorta", "cardiac", 1, "Aorta", "Aorta", "Tórax e abdômen", "vessels", "#ef626b"],
  ["left_atrium", "cardiac", 2, "Átrio esquerdo", "Left heart atrium", "Tórax", "organs", "#d96f79"],
  ["right_atrium", "cardiac", 3, "Átrio direito", "Right heart atrium", "Tórax", "organs", "#cf6874"],
  ["myocardium", "cardiac", 4, "Miocárdio", "Myocardium", "Tórax", "organs", "#c8565e"],
  ["left_ventricle", "cardiac", 5, "Ventrículo esquerdo", "Left heart ventricle", "Tórax", "organs", "#d95b65"],
  ["right_ventricle", "cardiac", 6, "Ventrículo direito", "Right heart ventricle", "Tórax", "organs", "#cc515d"],
  ["left_iliac_artery", "cardiac", 7, "Artéria ilíaca esquerda", "Left iliac artery", "Pelve", "vessels", "#e57172"],
  ["right_iliac_artery", "cardiac", 8, "Artéria ilíaca direita", "Right iliac artery", "Pelve", "vessels", "#dc6269"],
  ["left_iliac_vein", "cardiac", 9, "Veia ilíaca esquerda", "Left iliac vena", "Pelve", "vessels", "#5f78c8"],
  ["right_iliac_vein", "cardiac", 10, "Veia ilíaca direita", "Right iliac vena", "Pelve", "vessels", "#546fbf"],
  ["ivc", "cardiac", 11, "Veia cava inferior", "Inferior vena cava", "Tórax e abdômen", "vessels", "#5e86d6"],
  ["portal_splenic_vein", "cardiac", 12, "Veia porta / esplênica", "Portal vein and splenic vein", "Abdômen", "vessels", "#7569ca"],
  ["pulmonary_artery", "cardiac", 13, "Artéria pulmonar", "Pulmonary artery", "Tórax", "vessels", "#de6d72"]
];

export const STRUCTURES = Object.freeze(defs.map((item, index) => Object.freeze({
  id: item[0],
  group: item[1],
  localLabel: item[2],
  label: index + 1,
  name: item[3],
  englishName: item[4],
  region: item[5],
  category: item[6],
  color: item[7],
  description: item[3] + " segmentado no mesmo volume de TC usado nas vistas axial, coronal e sagital."
})));

const LOCAL_BASE = "/data/radiology/";

export const RADIOLOGY_STUDY = Object.freeze({
  id: "totalsegmentator_s0024_multiregion",
  name: "Atlas TC corporal · MPR sincronizado",
  modality: "CT",
  file: LOCAL_BASE + "ct.nii.gz",
  segmentations: SEGMENTATION_GROUPS.map((group) => ({
    id: group.id,
    url: LOCAL_BASE + group.file,
    opacity: group.opacity
  })),
  source: "TotalSegmentator · caso s0024 · cópia otimizada servida pelo Cortex",
  credit: "TotalSegmentator contributors / MedOtter dataset mirror",
  license: "CC BY 4.0 (dataset mirror)",
  spatialMode: "same-subject-coregistered",
  note: "CT e mapas anatômicos pertencem ao mesmo caso e compartilham o mesmo espaço voxel."
});

export const REGION_TARGETS = Object.freeze({
  head: "brain",
  thorax: "myocardium",
  abdomen: "liver",
  pelvis: "urinary_bladder",
  thigh: "left_femur"
});

export const SOURCE_REGISTRY = Object.freeze([
  {
    id: "totalsegmentator-medotter",
    label: "TotalSegmentator · CT corporal e máscaras",
    role: "Exame de referência e segmentações co-registradas",
    license: "CC BY 4.0",
    sourceUrl: "https://huggingface.co/datasets/MedOtter/totalsegmentator-cardiac",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    attribution: "Caso s0024, com CT e mapas de órgãos, sistema cardiovascular e estruturas musculoesqueléticas."
  },
  {
    id: "niivue",
    label: "NiiVue",
    role: "Renderização WebGL, MPR, cruz, zoom e janela HU",
    license: "BSD-2-Clause",
    sourceUrl: "https://github.com/niivue/niivue",
    licenseUrl: "https://github.com/niivue/niivue/blob/main/LICENSE",
    attribution: "Visualização NIfTI multiplanar no navegador."
  }
]);

export const SYSTEMS = Object.freeze([]);

export function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
export function getStructure(id) { return STRUCTURES.find((structure) => structure.id === id) || null; }
export function getStructureByLabel(label) {
  const numeric = Math.round(Number(label));
  return STRUCTURES.find((structure) => structure.label === numeric) || null;
}
export function getStructureByGroupLabel(group, localLabel) {
  const numeric = Math.round(Number(localLabel));
  return STRUCTURES.find((structure) => structure.group === group && structure.localLabel === numeric) || null;
}
export function getSystem() { return null; }
export function structureMatchesObject() { return false; }

export function hexToRgb(hex) {
  const value = String(hex || "#7ec8ff").replace("#", "");
  const full = value.length === 3 ? value.split("").map((part) => part + part).join("") : value;
  const numeric = Number.parseInt(full, 16);
  return [(numeric >> 16) & 255, (numeric >> 8) & 255, numeric & 255];
}

export function createGroupSegmentationColormap(groupId, options) {
  const config = options || {};
  const selectedLabel = Math.round(Number(config.selectedLabel) || 0);
  const hiddenLabels = config.hiddenLabels instanceof Set ? config.hiddenLabels : new Set();
  const groupStructures = STRUCTURES.filter((s) => s.group === groupId);
  const maxLocal = Math.max(1, ...groupStructures.map((s) => s.localLabel));
  const R=[], G=[], B=[], A=[], I=[], labels=[];
  for (let local=0; local<=maxLocal; local+=1) {
    const structure = getStructureByGroupLabel(groupId, local);
    let rgb=[0,0,0], alpha=0, name="";
    if (structure) {
      rgb=hexToRgb(structure.color);
      name=structure.name;
      if (!hiddenLabels.has(structure.label)) {
        alpha = selectedLabel === structure.label ? 255 : 105;
      }
    }
    R.push(rgb[0]); G.push(rgb[1]); B.push(rgb[2]); A.push(alpha); I.push(local); labels.push(name);
  }
  return {R,G,B,A,I,labels};
}

// Compatibilidade com código legado que ainda possa importar este nome.
export function createSegmentationColormap(options) {
  return createGroupSegmentationColormap("organs", options);
}
