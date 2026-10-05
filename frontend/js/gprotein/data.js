export const STRUCTURES = Object.freeze({
  cell: {
    id: "cell",
    name: "Célula",
    kind: "educational",
    function: "Contexto celular onde a sinalização GPCR ocorre.",
    role: "Primeiro nível de escala do laboratório."
  },
  membrane: {
    id: "membrane",
    name: "Membrana plasmática",
    kind: "educational",
    function: "Bicamada lipídica que separa os meios extracelular e intracelular.",
    role: "Hospeda o GPCR e organiza proteínas de sinalização."
  },
  nucleus: {
    id: "nucleus",
    name: "Núcleo",
    kind: "educational",
    function: "Compartimento que abriga o material genético e organiza processos de expressão gênica.",
    role: "Serve como referência espacial do interior celular nesta visualização."
  },
  mitochondria: {
    id: "mitochondria",
    name: "Mitocôndrias",
    kind: "educational",
    function: "Organelas associadas à produção de ATP e ao metabolismo energético.",
    role: "Representam a organização energética do citoplasma."
  },
  er: {
    id: "er",
    name: "Retículo endoplasmático",
    kind: "educational",
    function: "Rede membranosa envolvida em síntese, processamento e transporte intracelular.",
    role: "Ajuda a visualizar a continuidade e a compartimentalização do citoplasma."
  },
  golgi: {
    id: "golgi",
    name: "Complexo de Golgi",
    kind: "educational",
    function: "Conjunto de cisternas que modifica e direciona proteínas e lipídios.",
    role: "Mostra a via secretora no interior celular."
  },
  ribosomes: {
    id: "ribosomes",
    name: "Ribossomos",
    kind: "educational",
    function: "Complexos responsáveis pela síntese proteica.",
    role: "Representados como partículas distribuídas no citosol e próximas ao retículo."
  },
  vesicles: {
    id: "vesicles",
    name: "Vesículas",
    kind: "educational",
    function: "Pequenos compartimentos membranosos de transporte intracelular.",
    role: "Conectam visualmente retículo, Golgi e membrana."
  },
  cytoskeleton: {
    id: "cytoskeleton",
    name: "Citoesqueleto",
    kind: "educational",
    function: "Rede estrutural de filamentos que organiza forma, tráfego e posicionamento celular.",
    role: "Fornece profundidade e orientação ao interior da célula."
  },
  gpcr: {
    id: "gpcr",
    name: "GPCR β2-adrenérgico",
    kind: "experimental",
    pdbChain: "R",
    function: "Receptor de sete hélices transmembrana que transmite o sinal do agonista para Gs.",
    role: "Catalisa a liberação de GDP de Gαs quando ativado.",
    source: "PDB 3SN6"
  },
  ligand: {
    id: "ligand",
    name: "Agonista",
    kind: "educational",
    function: "Molécula extracelular que estabiliza o estado ativo do receptor.",
    role: "Inicia a sequência de ativação."
  },
  galpha: {
    id: "galpha",
    name: "Gαs",
    kind: "experimental",
    pdbChain: "A",
    function: "Subunidade GTPase da proteína G heterotrimérica.",
    role: "Troca GDP por GTP e ativa a adenilato ciclase.",
    source: "PDB 3SN6"
  },
  gbeta: {
    id: "gbeta",
    name: "Gβ",
    kind: "experimental",
    pdbChain: "B",
    function: "Forma um dímero estável com Gγ.",
    role: "Organiza o heterotrímero e participa de sinalização própria.",
    source: "PDB 3SN6"
  },
  ggamma: {
    id: "ggamma",
    name: "Gγ",
    kind: "experimental",
    pdbChain: "G",
    function: "Subunidade pequena associada a Gβ e ancorada à membrana.",
    role: "Compõe o dímero Gβγ.",
    source: "PDB 3SN6"
  },
  gdp: {
    id: "gdp",
    name: "GDP",
    kind: "educational",
    function: "Nucleotídeo ligado a Gα no estado inativo.",
    role: "Sua liberação é a etapa limitante da ativação clássica."
  },
  gtp: {
    id: "gtp",
    name: "GTP",
    kind: "educational",
    function: "Nucleotídeo que ocupa Gα no estado ativo.",
    role: "Estabiliza a conformação funcional que interage com efetores."
  },
  effector: {
    id: "effector",
    name: "Adenilato ciclase",
    kind: "educational",
    function: "Enzima efetora de membrana ativada por Gαs-GTP.",
    role: "Converte ATP em cAMP."
  },
  camp: {
    id: "camp",
    name: "cAMP",
    kind: "educational",
    function: "Segundo mensageiro produzido pela adenilato ciclase.",
    role: "Propaga o sinal para alvos intracelulares como PKA."
  },
  pka: {
    id: "pka",
    name: "PKA",
    kind: "educational",
    function: "Proteína quinase dependente de cAMP.",
    role: "Executa parte da resposta celular por fosforilação."
  }
});

export const PATHWAYS = Object.freeze({
  gs: {
    id: "gs",
    name: "Gs",
    status: "active",
    receptor: "GPCR β2-adrenérgico",
    gProtein: "Gαsβγ",
    effector: "Adenilato ciclase",
    messenger: "cAMP",
    response: "Ativação de PKA",
    color: "#7ea2ff"
  },
  gi: {
    id: "gi",
    name: "Gi/o",
    status: "prepared",
    effector: "Adenilato ciclase",
    messenger: "cAMP ↓",
    response: "Redução de sinalização dependente de cAMP",
    color: "#74d4b0"
  },
  gq: {
    id: "gq",
    name: "Gq/11",
    status: "prepared",
    effector: "PLCβ",
    messenger: "IP₃ + DAG",
    response: "Ca²⁺ / PKC",
    color: "#f0c56d"
  },
  g12: {
    id: "g12",
    name: "G12/13",
    status: "prepared",
    effector: "RhoGEF",
    messenger: "RhoA",
    response: "ROCK / citoesqueleto",
    color: "#c996ff"
  }
});

export const STEPS = Object.freeze([
  {
    id: "INACTIVE",
    title: "Célula em repouso",
    short: "Repouso",
    scale: "cell",
    structures: ["cell", "nucleus", "mitochondria", "er", "golgi", "membrane", "gpcr", "galpha", "gbeta", "ggamma", "gdp"],
    camera: "cell",
    duration: 2600,
    text: "O receptor está livre. Gαs contém GDP e permanece associada ao dímero Gβγ.",
    why: "Este é o estado basal antes da chegada do agonista.",
    next: "O agonista se aproxima da membrana."
  },
  {
    id: "LIGAND_BINDING",
    title: "Ligante se aproxima",
    short: "Ligante",
    scale: "membrane",
    structures: ["ligand", "gpcr", "membrane"],
    camera: "membrane",
    duration: 2200,
    text: "Um agonista extracelular se aproxima do sítio de ligação do GPCR.",
    why: "A especificidade do receptor começa no reconhecimento do ligante.",
    next: "O agonista estabiliza o receptor ativo."
  },
  {
    id: "GPCR_ACTIVATED",
    title: "GPCR ativado",
    short: "GPCR",
    scale: "molecular",
    structures: ["ligand", "gpcr"],
    camera: "receptor",
    duration: 2300,
    text: "A ligação do agonista favorece uma conformação ativa do GPCR.",
    why: "A face intracelular do receptor torna-se competente para ativar a proteína G.",
    next: "O heterotrímero Gs se acopla ao receptor."
  },
  {
    id: "G_PROTEIN_RECRUITED",
    title: "Proteína G recrutada",
    short: "Acoplamento",
    scale: "molecular",
    structures: ["gpcr", "galpha", "gbeta", "ggamma", "gdp"],
    camera: "complex",
    duration: 2500,
    text: "Gαsβγ entra em contato com a face citoplasmática do receptor ativado.",
    why: "O GPCR atua como fator de troca de nucleotídeo para Gα.",
    next: "O GDP deixa o bolso de Gα."
  },
  {
    id: "GDP_RELEASE",
    title: "Liberação de GDP",
    short: "GDP sai",
    scale: "detailed",
    structures: ["galpha", "gdp", "gpcr"],
    camera: "nucleotide",
    duration: 1800,
    text: "A interação com o GPCR reduz a afinidade de Gαs pelo GDP.",
    why: "A saída do GDP é a etapa crítica que permite a entrada de GTP.",
    next: "GTP ocupa o sítio de nucleotídeo."
  },
  {
    id: "GTP_BINDING",
    title: "GTP se liga",
    short: "GTP entra",
    scale: "detailed",
    structures: ["galpha", "gtp"],
    camera: "nucleotide",
    duration: 1800,
    text: "GTP citosólico entra no sítio de ligação de Gαs.",
    why: "A alta razão celular GTP/GDP favorece a ocupação por GTP após a saída do GDP.",
    next: "Gαs assume o estado ativo."
  },
  {
    id: "G_PROTEIN_ACTIVE",
    title: "Proteína G ativa",
    short: "Gαs-GTP",
    scale: "molecular",
    structures: ["galpha", "gbeta", "ggamma", "gtp"],
    camera: "gprotein",
    duration: 2100,
    text: "Gαs-GTP muda de estado funcional e se separa do arranjo basal com Gβγ.",
    why: "As superfícies de interação ficam disponíveis para efetores.",
    next: "Gαs-GTP encontra a adenilato ciclase."
  },
  {
    id: "EFFECTOR_ACTIVATION",
    title: "Efetor ativado",
    short: "Efetor",
    scale: "molecular",
    structures: ["galpha", "gtp", "effector"],
    camera: "effector",
    duration: 2200,
    text: "Gαs-GTP interage com a adenilato ciclase na membrana.",
    why: "A enzima passa a favorecer a produção de cAMP.",
    next: "A concentração de cAMP aumenta."
  },
  {
    id: "SECOND_MESSENGER",
    title: "Segundo mensageiro",
    short: "cAMP",
    scale: "subcellular",
    structures: ["effector", "camp"],
    camera: "messenger",
    duration: 2300,
    text: "A adenilato ciclase converte ATP em cAMP, espalhando o sinal pelo citoplasma.",
    why: "Segundos mensageiros amplificam e distribuem a informação.",
    next: "cAMP ativa alvos como PKA."
  },
  {
    id: "CELLULAR_RESPONSE",
    title: "Resposta celular",
    short: "Resposta",
    scale: "subcellular",
    structures: ["camp", "pka"],
    camera: "response",
    duration: 2400,
    text: "O aumento de cAMP favorece a ativação de PKA e a fosforilação de alvos.",
    why: "É aqui que a informação do receptor se converte em resposta fisiológica.",
    next: "O sistema inicia o desligamento."
  },
  {
    id: "SIGNAL_TERMINATION",
    title: "Hidrólise de GTP",
    short: "Término",
    scale: "detailed",
    structures: ["galpha", "gtp", "gdp"],
    camera: "gprotein",
    duration: 2200,
    text: "A atividade GTPase intrínseca de Gα hidrolisa GTP para GDP + Pi.",
    why: "A hidrólise limita a duração do sinal.",
    next: "Gα-GDP volta a associar-se a Gβγ."
  },
  {
    id: "REASSEMBLY",
    title: "Reassociação",
    short: "Reassociação",
    scale: "molecular",
    structures: ["galpha", "gbeta", "ggamma", "gdp"],
    camera: "complex",
    duration: 2000,
    text: "Gα-GDP volta a formar o heterotrímero com Gβγ.",
    why: "O sistema recupera a configuração pronta para novo ciclo.",
    next: "O receptor e a proteína G retornam ao basal."
  },
  {
    id: "RESET",
    title: "Retorno ao basal",
    short: "Reset",
    scale: "cell",
    structures: ["cell", "nucleus", "mitochondria", "er", "golgi", "membrane", "gpcr", "galpha", "gbeta", "ggamma", "gdp"],
    camera: "cell",
    duration: 1800,
    text: "A visualização retorna ao estado inicial.",
    why: "O ciclo pode começar novamente.",
    next: "Pronto para outro estímulo."
  }
]);

export const STUDY_TASKS = Object.freeze([
  { prompt: "Clique no GPCR.", target: "gpcr", hint: "Procure a proteína de sete hélices inserida na membrana." },
  { prompt: "Identifique Gαs.", target: "galpha", hint: "É a maior subunidade da proteína G e contém o sítio de GDP/GTP." },
  { prompt: "Clique no dímero Gβ.", target: "gbeta", hint: "Gβ forma o núcleo do dímero Gβγ." },
  { prompt: "Identifique Gγ.", target: "ggamma", hint: "É a pequena subunidade associada a Gβ." }
]);
