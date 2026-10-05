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
  },
  plc: {
    id: "plc",
    name: "PLCβ3",
    kind: "experimental",
    function: "Fosfolipase C beta que hidrolisa PIP₂ quando ativada no contexto de Gq.",
    role: "Gera os segundos mensageiros IP₃ e DAG.",
    source: "PDB 8UQO"
  },
  pip2: {
    id: "pip2",
    name: "PIP₂",
    kind: "educational",
    function: "Fosfolipídio de membrana utilizado como substrato por PLCβ.",
    role: "Sua hidrólise produz IP₃ e DAG."
  },
  ip3: {
    id: "ip3",
    name: "IP₃",
    kind: "educational",
    function: "Segundo mensageiro solúvel derivado de PIP₂.",
    role: "Difunde-se pelo citosol e ativa receptores de IP₃ no retículo endoplasmático."
  },
  dag: {
    id: "dag",
    name: "DAG",
    kind: "educational",
    function: "Segundo mensageiro lipídico produzido pela hidrólise de PIP₂.",
    role: "Permanece associado à membrana e coopera com Ca²⁺ na ativação de PKC."
  },
  ip3r: {
    id: "ip3r",
    name: "Receptor de IP₃",
    kind: "educational",
    function: "Canal de Ca²⁺ localizado no retículo endoplasmático.",
    role: "Abre após ligação de IP₃ e libera Ca²⁺ armazenado no RE."
  },
  calcium: {
    id: "calcium",
    name: "Ca²⁺",
    kind: "educational",
    function: "Segundo mensageiro iônico com amplo papel regulatório.",
    role: "É liberado do RE na via Gq/11 e participa da ativação de PKC."
  },
  pkc: {
    id: "pkc",
    name: "PKC",
    kind: "educational",
    function: "Família de quinases ativadas em contextos dependentes de DAG e Ca²⁺.",
    role: "Executa respostas celulares por fosforilação de alvos."
  },
  atp: {
    id: "atp",
    name: "ATP",
    kind: "educational",
    function: "Nucleotídeo usado pela adenilato ciclase como substrato.",
    role: "É convertido em cAMP na via Gs."
  },
  rgs: {
    id: "rgs",
    name: "RGS",
    kind: "educational",
    function: "Proteínas reguladoras que podem acelerar a atividade GTPase de Gα.",
    role: "Participam da terminação de sinal em contextos apropriados."
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
    status: "active",
    receptor: "Receptor μ-opioide",
    gProtein: "Gαi1β1γ2",
    effector: "Adenilato ciclase",
    messenger: "cAMP ↓",
    response: "Redução da sinalização dependente de cAMP",
    pdbId: "6DDE",
    color: "#74d4b0"
  },
  gq: {
    id: "gq",
    name: "Gq/11",
    status: "active",
    gProtein: "Gαqβγ",
    effector: "PLCβ3",
    messenger: "IP₃ + DAG",
    response: "Ca²⁺ / PKC",
    pdbId: "8UQO",
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


export const GI_STEPS = Object.freeze([
  { id:"GI_RESTING", title:"Gi/o em repouso", short:"Repouso", scale:"cell", structures:["cell","membrane","gpcr","galpha","gbeta","ggamma","gdp"], camera:"cell", duration:2200, text:"O receptor e o heterotrímero Gi/o estão em estado basal, com GDP ligado a Gαi.", why:"Estabelece a configuração inativa antes do estímulo.", next:"O agonista ocupa o receptor." },
  { id:"GI_LIGAND", title:"Agonista se liga", short:"Ligante", scale:"membrane", structures:["ligand","gpcr"], camera:"membrane", duration:1900, text:"O agonista estabiliza uma conformação ativa do receptor.", why:"O receptor passa a favorecer o acoplamento de Gi.", next:"Gi aproxima-se do GPCR." },
  { id:"GI_RECRUITMENT", title:"Gi é recrutada", short:"Acoplamento", scale:"molecular", structures:["gpcr","galpha","gbeta","ggamma","gdp"], camera:"complex", duration:2200, text:"O heterotrímero Gi interage com a face citoplasmática do GPCR.", why:"O receptor atua como catalisador da troca de nucleotídeo.", next:"GDP deixa Gαi." },
  { id:"GI_GDP_RELEASE", title:"GDP é liberado", short:"GDP sai", scale:"detailed", structures:["galpha","gdp"], camera:"nucleotide", duration:1700, text:"A afinidade de Gαi pelo GDP diminui e o nucleotídeo deixa o sítio.", why:"A saída de GDP permite a ligação de GTP.", next:"GTP ocupa o sítio." },
  { id:"GI_GTP_BINDING", title:"GTP se liga", short:"GTP entra", scale:"detailed", structures:["galpha","gtp"], camera:"nucleotide", duration:1700, text:"GTP liga-se a Gαi e estabiliza o estado ativo.", why:"A troca de nucleotídeo transforma o estado funcional de Gαi.", next:"Gαi-GTP e Gβγ sinalizam." },
  { id:"GI_ACTIVE", title:"Gi/o ativa", short:"Gαi-GTP", scale:"molecular", structures:["galpha","gbeta","ggamma","gtp"], camera:"gprotein", duration:1900, text:"Gαi-GTP e Gβγ tornam-se superfícies funcionais para efetores.", why:"Gi/o não deve ser interpretada apenas como Gs invertida; Gβγ também pode sinalizar.", next:"Gαi modula a adenilato ciclase." },
  { id:"GI_AC_INHIBITION", title:"Adenilato ciclase modulada", short:"AC ↓", scale:"molecular", structures:["galpha","effector"], camera:"effector", duration:2100, text:"Gαi reduz a atividade de determinadas isoformas de adenilato ciclase.", why:"Isso reduz a produção de cAMP em contextos celulares apropriados.", next:"A disponibilidade de cAMP diminui." },
  { id:"GI_CAMP_DOWN", title:"cAMP reduzido", short:"cAMP ↓", scale:"subcellular", structures:["camp"], camera:"messenger", duration:2200, text:"A produção de cAMP diminui em relação ao estado estimulado por Gs.", why:"A resposta depende do receptor, da isoforma de AC e do contexto celular.", next:"O sinal é encerrado." },
  { id:"GI_TERMINATION", title:"Hidrólise de GTP", short:"Término", scale:"detailed", structures:["galpha","gtp","gdp","rgs"], camera:"gprotein", duration:1900, text:"Gαi hidrolisa GTP para GDP; proteínas RGS podem acelerar esse processo.", why:"A hidrólise limita a duração do estado ativo.", next:"O heterotrímero se recompõe." },
  { id:"GI_RESET", title:"Retorno ao basal", short:"Reset", scale:"cell", structures:["cell","membrane","gpcr","galpha","gbeta","ggamma","gdp"], camera:"cell", duration:1800, text:"Gαi-GDP volta a associar-se a Gβγ e o sistema retorna ao basal.", why:"O circuito fica pronto para novo estímulo.", next:"Pronto para outro ciclo." }
]);

export const GQ_STEPS = Object.freeze([
  { id:"GQ_RESTING", title:"Gq/11 em repouso", short:"Repouso", scale:"cell", structures:["cell","membrane","gpcr","galpha","gbeta","ggamma","gdp","er"], camera:"cell", duration:2000, text:"O GPCR e Gq estão em estado basal. Ca²⁺ permanece armazenado no retículo endoplasmático.", why:"Define o estado inicial da via.", next:"O ligante aproxima-se do receptor." },
  { id:"GQ_LIGAND_APPROACH", title:"Ligante se aproxima", short:"Ligante", scale:"membrane", structures:["ligand","gpcr"], camera:"membrane", duration:1600, text:"O agonista aproxima-se do GPCR.", why:"A via começa com reconhecimento extracelular.", next:"O ligante ocupa o receptor." },
  { id:"GQ_LIGAND_BINDING", title:"Ligante se liga", short:"Ligação", scale:"molecular", structures:["ligand","gpcr"], camera:"receptor", duration:1600, text:"O ligante estabiliza o receptor em estado ativo.", why:"A mudança conformacional abre a interface citoplasmática.", next:"Gq aproxima-se." },
  { id:"GQ_RECRUITMENT", title:"Gq é recrutada", short:"Gq chega", scale:"molecular", structures:["gpcr","galpha","gbeta","ggamma","gdp"], camera:"complex", duration:1800, text:"O heterotrímero Gq interage com o GPCR ativado.", why:"O receptor promove troca de nucleotídeo em Gαq.", next:"GDP é liberado." },
  { id:"GQ_GDP_RELEASE", title:"GDP é liberado", short:"GDP sai", scale:"detailed", structures:["galpha","gdp"], camera:"nucleotide", duration:1500, text:"GDP deixa o sítio de Gαq.", why:"A saída de GDP permite a ligação de GTP.", next:"GTP entra." },
  { id:"GQ_GTP_BINDING", title:"GTP se liga", short:"GTP entra", scale:"detailed", structures:["galpha","gtp"], camera:"nucleotide", duration:1500, text:"GTP ocupa o sítio de Gαq.", why:"Gαq passa ao estado ativo.", next:"Gαq-GTP interage com PLCβ." },
  { id:"GQ_ACTIVE", title:"Gαq-GTP ativa", short:"Gαq-GTP", scale:"molecular", structures:["galpha","gtp","gbeta","ggamma"], camera:"gprotein", duration:1700, text:"Gαq-GTP assume conformação funcional ativa.", why:"A proteína G passa a reconhecer o efetor.", next:"PLCβ é recrutada." },
  { id:"GQ_PLC_RECRUIT", title:"PLCβ3 na membrana", short:"PLCβ", scale:"molecular", structures:["galpha","plc","membrane"], camera:"effector", duration:1900, text:"Gαq-GTP interage com PLCβ3 em contexto de membrana.", why:"A estrutura 8UQO serve como referência para esta interação.", next:"PLCβ encontra PIP₂." },
  { id:"GQ_PIP2", title:"PIP₂ reconhecido", short:"PIP₂", scale:"detailed", structures:["plc","pip2","membrane"], camera:"effector", duration:1700, text:"PLCβ posiciona-se para hidrolisar PIP₂ na membrana.", why:"PIP₂ é o substrato que origina os dois ramos do sinal.", next:"PIP₂ é hidrolisado." },
  { id:"GQ_CLEAVAGE", title:"PIP₂ → IP₃ + DAG", short:"Clivagem", scale:"detailed", structures:["plc","pip2","ip3","dag"], camera:"effector", duration:1900, text:"PLCβ hidrolisa PIP₂ e produz IP₃ e DAG.", why:"Os produtos seguem destinos espaciais diferentes.", next:"IP₃ deixa a membrana." },
  { id:"GQ_IP3_DIFFUSION", title:"IP₃ difunde-se", short:"IP₃", scale:"subcellular", structures:["ip3","er"], camera:"messenger", duration:2200, text:"IP₃ se afasta da membrana e difunde-se pelo citosol.", why:"IP₃ é solúvel e conecta a membrana ao retículo endoplasmático.", next:"IP₃ alcança seu receptor." },
  { id:"GQ_IP3R", title:"IP₃ encontra o receptor", short:"IP₃R", scale:"subcellular", structures:["ip3","ip3r","er"], camera:"response", duration:1900, text:"IP₃ liga-se ao receptor de IP₃ no retículo endoplasmático.", why:"A ligação controla um canal de liberação de Ca²⁺.", next:"O canal se abre." },
  { id:"GQ_CA_RELEASE", title:"Ca²⁺ é liberado", short:"Ca²⁺", scale:"subcellular", structures:["ip3r","calcium","er"], camera:"response", duration:2200, text:"O canal abre e Ca²⁺ armazenado no RE é liberado para o citosol.", why:"O aumento local de Ca²⁺ atua como segundo mensageiro.", next:"DAG permanece na membrana." },
  { id:"GQ_DAG", title:"DAG permanece na membrana", short:"DAG", scale:"membrane", structures:["dag","membrane"], camera:"membrane", duration:1700, text:"DAG continua inserido na membrana enquanto IP₃ se dispersa no citosol.", why:"Essa diferença espacial é essencial para entender a via.", next:"DAG e Ca²⁺ convergem sobre PKC." },
  { id:"GQ_PKC", title:"PKC é recrutada", short:"PKC", scale:"subcellular", structures:["dag","calcium","pkc"], camera:"response", duration:2100, text:"DAG e Ca²⁺ favorecem o recrutamento e ativação de isoformas de PKC apropriadas.", why:"A sinalização converge em uma quinase efetora.", next:"PKC modifica alvos celulares." },
  { id:"GQ_RESPONSE", title:"Resposta celular", short:"Resposta", scale:"subcellular", structures:["pkc","calcium"], camera:"response", duration:2200, text:"PKC e Ca²⁺ modulam proteínas-alvo e respostas celulares.", why:"A resposta final depende do tipo celular e do receptor.", next:"Gαq encerra o sinal." },
  { id:"GQ_TERMINATION", title:"GTP é hidrolisado", short:"Término", scale:"detailed", structures:["galpha","gtp","gdp","rgs"], camera:"gprotein", duration:1800, text:"Gαq hidrolisa GTP para GDP; RGS pode acelerar a reação.", why:"O mecanismo limita a duração do sinal.", next:"O heterotrímero é recomposto." },
  { id:"GQ_REASSEMBLY", title:"Reassociação", short:"Reassociação", scale:"molecular", structures:["galpha","gbeta","ggamma","gdp"], camera:"complex", duration:1700, text:"Gαq-GDP volta a associar-se a Gβγ.", why:"A proteína G retorna ao estado basal.", next:"O sistema é resetado." },
  { id:"GQ_RESET", title:"Retorno ao basal", short:"Reset", scale:"cell", structures:["cell","membrane","gpcr","galpha","gbeta","ggamma","gdp","er"], camera:"cell", duration:1700, text:"A cena retorna ao estado inicial e o Ca²⁺ é novamente representado no compartimento do RE.", why:"O ciclo de sinalização pode reiniciar.", next:"Pronto para novo estímulo." }
]);

export const PATHWAY_STEPS = Object.freeze({
  gs: STEPS,
  gi: GI_STEPS,
  gq: GQ_STEPS
});
