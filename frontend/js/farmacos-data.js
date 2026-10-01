(function () {

  "use strict";


  window.CortexReceptores = {

    "M1": {
      familia: "Muscarinico",
      via: "Gq",
      resumo: "Predomina em SNC, ganglios autonomicos e secrecao gastrica."
    },

    "M2": {
      familia: "Muscarinico",
      via: "Gi",
      resumo: "Importante no coracao. Reduz frequencia e conducao cardiaca quando ativado."
    },

    "M3": {
      familia: "Muscarinico",
      via: "Gq",
      resumo: "Glandulas e musculo liso. Aumenta secrecoes e contracao; no endotélio favorece vasodilatacao mediada por NO."
    },

    "Nn": {
      familia: "Nicotinico",
      via: "Canal ionico",
      resumo: "Ganglios autonomicos e medula adrenal."
    },

    "Nm": {
      familia: "Nicotinico",
      via: "Canal ionico",
      resumo: "Placa motora da juncao neuromuscular."
    },

    "alpha1": {
      familia: "Adrenergico",
      via: "Gq",
      resumo: "Contracao de musculo liso, especialmente vasoconstricao."
    },

    "alpha2": {
      familia: "Adrenergico",
      via: "Gi",
      resumo: "Reduz liberacao de noradrenalina e atividade simpatica quando ativado centralmente."
    },

    "beta1": {
      familia: "Adrenergico",
      via: "Gs",
      resumo: "Coracao e aparelho justaglomerular: aumenta atividade cardiaca e liberacao de renina."
    },

    "beta2": {
      familia: "Adrenergico",
      via: "Gs",
      resumo: "Relaxamento de musculo liso, incluindo broncodilatacao."
    },

    "beta3": {
      familia: "Adrenergico",
      via: "Gs",
      resumo: "Participa do relaxamento do detrusor e de efeitos metabolicos."
    },

    "D1": {
      familia: "Dopaminergico",
      via: "Gs",
      resumo: "Receptor dopaminergico D1. Sua ativacao aumenta AMPc e participa de respostas dopaminergicas em diferentes tecidos."
    },

    "Muscarinicos": {
      familia: "Colinergico",
      via: "Receptores M",
      resumo: "Alvo muscarinico nao especificado por subtipo no material. Inclui receptores M1 a M5 conforme o tecido."
    },

    "Nicotinicos": {
      familia: "Colinergico",
      via: "Canal ionico",
      resumo: "Alvo nicotinico nao especificado por subtipo no material. Inclui receptores neuronais e da juncao neuromuscular."
    },

    "GABA-A": {
      familia: "GABAergico",
      via: "Canal de Cl-",
      resumo: "Receptor ionotropico GABA-A. Benzodiazepinicos e barbituricos modulam sua atividade em sitios distintos."
    }

  };


  window.CortexFarmacos = [

    {
      id: "betanecol",
      nome: "Betanecol",
      grupo: "Colinergicos",
      classe: "Agonista muscarinico",
      acao: "Agonista direto",
      receptores: ["M2", "M3"],
      mecanismo:
        "Agonista colinergico de acao direta que estimula receptores muscarinicos, favorecendo atividade parassimpatica.",
      efeitos: [
        "Aumenta contracao do detrusor",
        "Aumenta motilidade gastrointestinal",
        "Pode aumentar secrecoes"
      ],
      usos: [
        "Retencao urinaria nao obstrutiva em contextos selecionados"
      ],
      adversos: [
        "Sudorese",
        "Salivacao",
        "Diarreia",
        "Broncoespasmo",
        "Bradicardia"
      ],
      alertas: [
        "Obstrucao mecanica gastrointestinal ou urinaria",
        "Asma ou broncoespasmo importante",
        "Bradicardia e hipotensao requerem cautela"
      ],
      dica:
        "Betanecol = bexiga e intestino mais ativos."
    },

    {
      id: "pilocarpina",
      nome: "Pilocarpina",
      grupo: "Colinergicos",
      classe: "Agonista muscarinico",
      acao: "Agonista direto",
      receptores: ["M1", "M2", "M3"],
      mecanismo:
        "Ativa receptores muscarinicos. Seus efeitos glandulares e oculares sao especialmente importantes.",
      efeitos: [
        "Aumenta salivacao",
        "Aumenta lacrimejamento",
        "Produz miose",
        "Favorece drenagem do humor aquoso"
      ],
      usos: [
        "Xerostomia em situacoes selecionadas",
        "Uso oftalmologico em indicacoes especificas"
      ],
      adversos: [
        "Sudorese",
        "Salivacao excessiva",
        "Broncoespasmo",
        "Alteracoes visuais"
      ],
      alertas: [
        "Doenca respiratoria com broncoespasmo exige cautela",
        "Situacoes oculares em que miose seja indesejada"
      ],
      dica:
        "Pilocarpina lembra secrecao e miose."
    },

    {
      id: "neostigmina",
      nome: "Neostigmina",
      grupo: "Colinergicos",
      classe: "Inibidor de acetilcolinesterase",
      acao: "Agonista indireto",
      receptores: ["M2", "M3", "Nm"],
      mecanismo:
        "Inibe reversivelmente a acetilcolinesterase, elevando acetilcolina na sinapse e intensificando efeitos muscarinicos e nicotinicos.",
      efeitos: [
        "Aumenta transmissao neuromuscular",
        "Aumenta motilidade gastrointestinal",
        "Pode produzir bradicardia e secrecoes"
      ],
      usos: [
        "Reversao de bloqueio neuromuscular nao despolarizante em contextos apropriados",
        "Outras indicacoes colinergicas selecionadas"
      ],
      adversos: [
        "Bradicardia",
        "Broncoespasmo",
        "Diarreia",
        "Salivacao",
        "Colicas"
      ],
      alertas: [
        "Obstrucao mecanica gastrointestinal ou urinaria",
        "Bradicardia",
        "Doenca respiratoria reativa exige cautela"
      ],
      dica:
        "Nao ativa o receptor diretamente: impede a degradacao da ACh."
    },

    {
      id: "piridostigmina",
      nome: "Piridostigmina",
      grupo: "Colinergicos",
      classe: "Inibidor de acetilcolinesterase",
      acao: "Agonista indireto",
      receptores: ["M2", "M3", "Nm"],
      mecanismo:
        "Inibe reversivelmente a acetilcolinesterase e aumenta acetilcolina, com efeito relevante na juncao neuromuscular.",
      efeitos: [
        "Melhora transmissao na placa motora",
        "Aumenta atividade parassimpatica"
      ],
      usos: [
        "Tratamento sintomatico da miastenia gravis"
      ],
      adversos: [
        "Diarreia",
        "Colicas",
        "Salivacao",
        "Bradicardia",
        "Fraqueza em excesso colinergico"
      ],
      alertas: [
        "Obstrucao gastrointestinal ou urinaria",
        "Doencas respiratorias exigem cautela"
      ],
      dica:
        "Piridostigmina = lembrar miastenia gravis."
    },

    {
      id: "atropina",
      nome: "Atropina",
      grupo: "Anticolinergicos",
      classe: "Antimuscarinico",
      acao: "Antagonista direto",
      receptores: ["M1", "M2", "M3"],
      mecanismo:
        "Antagonista competitivo de receptores muscarinicos, reduzindo respostas parassimpaticas mediadas por acetilcolina.",
      efeitos: [
        "Aumenta frequencia cardiaca",
        "Reduz secrecoes",
        "Produz midriase e cicloplegia",
        "Reduz motilidade gastrointestinal"
      ],
      usos: [
        "Bradicardia sintomatica em contextos apropriados",
        "Intoxicacoes colinergicas especificas",
        "Reducao de secrecoes em situacoes selecionadas"
      ],
      adversos: [
        "Boca seca",
        "Taquicardia",
        "Retencao urinaria",
        "Visao borrada",
        "Confusao em pacientes suscetiveis"
      ],
      alertas: [
        "Glaucoma de angulo fechado e retencao urinaria exigem especial cautela",
        "Pode agravar hipertermia por reducao de sudorese"
      ],
      dica:
        "Atropina bloqueia muscarinicos; nao bloqueia Nm."
    },

    {
      id: "escopolamina",
      nome: "Escopolamina",
      grupo: "Anticolinergicos",
      classe: "Antimuscarinico",
      acao: "Antagonista direto",
      receptores: ["M1", "M2", "M3"],
      mecanismo:
        "Bloqueia receptores muscarinicos e apresenta efeitos centrais relevantes sobre vias vestibulares.",
      efeitos: [
        "Reduz atividade vestibular associada a nausea",
        "Reduz secrecoes",
        "Pode causar sedacao"
      ],
      usos: [
        "Prevencao de cinetose",
        "Nausea em situacoes selecionadas"
      ],
      adversos: [
        "Boca seca",
        "Sonolencia",
        "Visao borrada",
        "Retencao urinaria",
        "Confusao"
      ],
      alertas: [
        "Glaucoma de angulo fechado",
        "Retencao urinaria",
        "Maior risco de efeitos centrais em idosos"
      ],
      dica:
        "Escopolamina = antimuscarinico lembrado por cinetose."
    },

    {
      id: "ipratropio",
      nome: "Ipratropio",
      grupo: "Anticolinergicos",
      classe: "Antimuscarinico inalatorio",
      acao: "Antagonista direto",
      receptores: ["M2", "M3"],
      mecanismo:
        "Bloqueia receptores muscarinicos nas vias aereas, reduzindo broncoconstricao vagal.",
      efeitos: [
        "Broncodilatacao",
        "Reducao de secrecao nas vias aereas"
      ],
      usos: [
        "DPOC",
        "Uso complementar em broncoespasmo em contextos selecionados"
      ],
      adversos: [
        "Boca seca",
        "Irritacao de vias aereas",
        "Efeitos anticolinergicos geralmente limitados pela via inalatoria"
      ],
      alertas: [
        "Evitar contato ocular da nebulizacao",
        "Cautela em predisposicao a glaucoma e retencao urinaria"
      ],
      dica:
        "Ipratropio bloqueia principalmente o efeito muscarinico no pulmao."
    },

    {
      id: "oxibutinina",
      nome: "Oxibutinina",
      grupo: "Anticolinergicos",
      classe: "Antimuscarinico urinario",
      acao: "Antagonista direto",
      receptores: ["M3"],
      mecanismo:
        "Reduz ativacao muscarinica do detrusor, diminuindo contracoes involuntarias da bexiga.",
      efeitos: [
        "Relaxa funcionalmente o detrusor",
        "Aumenta capacidade vesical"
      ],
      usos: [
        "Bexiga hiperativa",
        "Urgencia urinaria em indicacoes apropriadas"
      ],
      adversos: [
        "Boca seca",
        "Constipacao",
        "Visao borrada",
        "Retencao urinaria",
        "Efeitos cognitivos podem ocorrer"
      ],
      alertas: [
        "Retencao urinaria",
        "Retencao gastrica",
        "Glaucoma de angulo fechado nao controlado"
      ],
      dica:
        "Oxibutinina: menos contracao involuntaria da bexiga."
    },

    {
      id: "adrenalina",
      nome: "Adrenalina",
      grupo: "Adrenergicos",
      classe: "Agonista adrenergico nao seletivo",
      acao: "Agonista direto",
      receptores: ["alpha1", "alpha2", "beta1", "beta2"],
      mecanismo:
        "Ativa receptores alfa e beta adrenergicos. O efeito final varia com tecido, concentracao e contexto clinico.",
      efeitos: [
        "Vasoconstricao por alpha1",
        "Aumento de atividade cardiaca por beta1",
        "Broncodilatacao por beta2"
      ],
      usos: [
        "Anafilaxia",
        "Parada cardiaca em protocolos apropriados",
        "Outras situacoes emergenciais especificas"
      ],
      adversos: [
        "Taquicardia",
        "Tremor",
        "Arritmias",
        "Hipertensao",
        "Ansiedade"
      ],
      alertas: [
        "Risco de arritmias e isquemia em pacientes suscetiveis",
        "Na anafilaxia nao ha contraindicao absoluta que supere a emergencia"
      ],
      dica:
        "Adrenalina lembra alpha1 + beta1 + beta2."
    },

    {
      id: "noradrenalina",
      nome: "Noradrenalina",
      grupo: "Adrenergicos",
      classe: "Agonista adrenergico",
      acao: "Agonista direto",
      receptores: ["alpha1", "alpha2", "beta1"],
      mecanismo:
        "Estimula fortemente receptores alfa e tambem beta1, elevando resistencia vascular e pressao arterial.",
      efeitos: [
        "Vasoconstricao intensa",
        "Aumento da pressao arterial",
        "Pode ocorrer bradicardia reflexa"
      ],
      usos: [
        "Vasopressor em formas de choque distributivo conforme contexto clinico"
      ],
      adversos: [
        "Isquemia periferica",
        "Arritmias",
        "Hipertensao",
        "Lesao por extravasamento"
      ],
      alertas: [
        "Hipovolemia deve ser reconhecida e corrigida conforme contexto",
        "Necessita monitorizacao hemodinamica"
      ],
      dica:
        "Noradrenalina = alfa muito forte, beta1 presente, beta2 pequeno."
    },

    {
      id: "fenilefrina",
      nome: "Fenilefrina",
      grupo: "Adrenergicos",
      classe: "Agonista alpha1",
      acao: "Agonista direto",
      receptores: ["alpha1"],
      mecanismo:
        "Estimula receptores alpha1, promovendo contracao de musculo liso vascular.",
      efeitos: [
        "Vasoconstricao",
        "Aumento da resistencia vascular",
        "Midriase",
        "Pode causar bradicardia reflexa"
      ],
      usos: [
        "Vasopressor em situacoes selecionadas",
        "Descongestionante em algumas apresentacoes",
        "Aplicacoes oftalmologicas"
      ],
      adversos: [
        "Hipertensao",
        "Bradicardia reflexa",
        "Isquemia em excesso de vasoconstricao"
      ],
      alertas: [
        "Hipertensao importante",
        "Doenca vascular e cardiaca exigem cautela"
      ],
      dica:
        "Fenilefrina = alpha1 praticamente puro."
    },

    {
      id: "dobutamina",
      nome: "Dobutamina",
      grupo: "Adrenergicos",
      classe: "Agonista beta1 predominante",
      acao: "Agonista direto",
      receptores: ["beta1", "beta2", "alpha1"],
      mecanismo:
        "Estimula predominantemente beta1, aumentando contratilidade cardiaca.",
      efeitos: [
        "Aumenta inotropismo",
        "Pode aumentar debito cardiaco",
        "Efeito cronotropico variavel"
      ],
      usos: [
        "Suporte inotropico em cenarios selecionados de baixo debito cardiaco"
      ],
      adversos: [
        "Taquicardia",
        "Arritmias",
        "Alteracoes da pressao arterial",
        "Aumento do consumo de oxigenio pelo miocardio"
      ],
      alertas: [
        "Arritmias",
        "Isquemia miocardica",
        "Necessita monitorizacao"
      ],
      dica:
        "Dobutamina = beta1 = forca de contracao."
    },

    {
      id: "clonidina",
      nome: "Clonidina",
      grupo: "Adrenergicos",
      classe: "Agonista alpha2 central",
      acao: "Agonista direto",
      receptores: ["alpha2"],
      mecanismo:
        "Ativa receptores alpha2 centrais e reduz efluxo simpatico e liberacao de noradrenalina.",
      efeitos: [
        "Reduz atividade simpatica",
        "Reduz pressao arterial",
        "Pode reduzir frequencia cardiaca"
      ],
      usos: [
        "Hipertensao em contextos selecionados",
        "Outras indicacoes neurologicas e autonomicas especificas"
      ],
      adversos: [
        "Sedacao",
        "Boca seca",
        "Bradicardia",
        "Hipotensao"
      ],
      alertas: [
        "Suspensao abrupta pode provocar hipertensao rebote",
        "Cautela em bradicardia"
      ],
      dica:
        "Alpha2 central = freio da descarga simpatica."
    },

    {
      id: "salbutamol",
      nome: "Salbutamol",
      grupo: "Adrenergicos",
      classe: "Agonista beta2",
      acao: "Agonista direto",
      receptores: ["beta2"],
      mecanismo:
        "Ativa beta2 em musculo liso das vias aereas, elevando cAMP e favorecendo broncodilatacao.",
      efeitos: [
        "Broncodilatacao",
        "Relaxamento de musculo liso",
        "Pode deslocar potassio para o meio intracelular"
      ],
      usos: [
        "Alivio de broncoespasmo em indicacoes apropriadas"
      ],
      adversos: [
        "Tremor",
        "Taquicardia",
        "Palpitacoes",
        "Hipocalemia"
      ],
      alertas: [
        "Arritmias e cardiopatias exigem cautela",
        "Uso excessivo pode indicar controle inadequado da doenca respiratoria"
      ],
      dica:
        "Beta2 = broncodilatacao."
    },

    {
      id: "mirabegrona",
      nome: "Mirabegrona",
      grupo: "Adrenergicos",
      classe: "Agonista beta3",
      acao: "Agonista direto",
      receptores: ["beta3"],
      mecanismo:
        "Ativa receptores beta3 no detrusor durante a fase de armazenamento, favorecendo relaxamento vesical.",
      efeitos: [
        "Relaxa detrusor",
        "Aumenta capacidade de armazenamento da bexiga"
      ],
      usos: [
        "Bexiga hiperativa"
      ],
      adversos: [
        "Hipertensao",
        "Taquicardia",
        "Cefaleia"
      ],
      alertas: [
        "Pressao arterial deve ser considerada",
        "Hipertensao grave nao controlada e um alerta importante"
      ],
      dica:
        "Beta3 = bexiga relaxada durante armazenamento."
    },

    {
      id: "efedrina",
      nome: "Efedrina",
      grupo: "Adrenergicos",
      classe: "Simpatomimetico misto",
      acao: "Acao mista",
      receptores: ["alpha1", "beta1", "beta2"],
      mecanismo:
        "Produz efeito simpatomimetico por acao direta em receptores adrenergicos e por aumento da disponibilidade de noradrenalina.",
      efeitos: [
        "Vasoconstricao",
        "Aumento de atividade cardiaca",
        "Broncodilatacao variavel"
      ],
      usos: [
        "Hipotensao em contextos anestesicos selecionados"
      ],
      adversos: [
        "Taquicardia",
        "Hipertensao",
        "Tremor",
        "Ansiedade"
      ],
      alertas: [
        "Arritmias",
        "Hipertensao",
        "Pode apresentar taquifilaxia"
      ],
      dica:
        "Efedrina = direta + indireta."
    },

    {
      id: "prazosina",
      nome: "Prazosina",
      grupo: "Antiadrenergicos",
      classe: "Bloqueador alpha1",
      acao: "Antagonista direto",
      receptores: ["alpha1"],
      mecanismo:
        "Bloqueia competitivamente receptores alpha1 e reduz vasoconstricao mediada por catecolaminas.",
      efeitos: [
        "Vasodilatacao",
        "Reducao da resistencia vascular"
      ],
      usos: [
        "Hipertensao em situacoes selecionadas",
        "Outras indicacoes especificas conforme contexto"
      ],
      adversos: [
        "Hipotensao postural",
        "Tontura",
        "Sincope de primeira dose"
      ],
      alertas: [
        "Risco de hipotensao ortostatica",
        "Cautela com outros agentes anti-hipertensivos"
      ],
      dica:
        "Prazosina bloqueia alpha1: vaso tende a relaxar."
    },

    {
      id: "tansulosina",
      nome: "Tansulosina",
      grupo: "Antiadrenergicos",
      classe: "Bloqueador alpha1A",
      acao: "Antagonista direto",
      receptores: ["alpha1"],
      mecanismo:
        "Bloqueia preferencialmente receptores alpha1A no trato urinario inferior, reduzindo tono do musculo liso prostatico.",
      efeitos: [
        "Relaxamento de prostata e colo vesical",
        "Melhora fluxo urinario em pacientes selecionados"
      ],
      usos: [
        "Sintomas do trato urinario inferior associados a hiperplasia prostatica benigna"
      ],
      adversos: [
        "Tontura",
        "Hipotensao postural",
        "Alteracoes ejaculatorias"
      ],
      alertas: [
        "Risco de hipotensao",
        "Importante informar uso antes de cirurgia de catarata"
      ],
      dica:
        "Tansulosina = alpha1A = trato urinario/prostata."
    },

    {
      id: "propranolol",
      nome: "Propranolol",
      grupo: "Antiadrenergicos",
      classe: "Betabloqueador nao seletivo",
      acao: "Antagonista direto",
      receptores: ["beta1", "beta2"],
      mecanismo:
        "Bloqueia receptores beta1 e beta2, reduzindo efeitos das catecolaminas no coracao e em outros tecidos.",
      efeitos: [
        "Reduz frequencia cardiaca",
        "Reduz contratilidade",
        "Reduz liberacao de renina",
        "Pode causar broncoconstricao"
      ],
      usos: [
        "Diversas indicacoes cardiovasculares",
        "Tremor e outras indicacoes especificas"
      ],
      adversos: [
        "Bradicardia",
        "Hipotensao",
        "Fadiga",
        "Broncoespasmo"
      ],
      alertas: [
        "Asma ou broncoespasmo sao preocupacoes importantes",
        "Bradicardia e bloqueios de conducao",
        "Suspensao abrupta pode ser prejudicial"
      ],
      dica:
        "Propranolol nao escolhe: bloqueia beta1 e beta2."
    },

    {
      id: "metoprolol",
      nome: "Metoprolol",
      grupo: "Antiadrenergicos",
      classe: "Betabloqueador beta1 seletivo",
      acao: "Antagonista direto",
      receptores: ["beta1"],
      mecanismo:
        "Bloqueia preferencialmente beta1 em doses usuais, reduzindo efeitos adrenergicos cardiacos.",
      efeitos: [
        "Reduz frequencia cardiaca",
        "Reduz contratilidade",
        "Reduz liberacao de renina"
      ],
      usos: [
        "Hipertensao",
        "Doenca coronariana",
        "Insuficiencia cardiaca em formulacoes e contextos apropriados"
      ],
      adversos: [
        "Bradicardia",
        "Hipotensao",
        "Fadiga"
      ],
      alertas: [
        "Bloqueios de conducao e bradicardia",
        "Seletividade beta1 diminui em doses maiores",
        "Evitar interrupcao abrupta"
      ],
      dica:
        "Metoprolol = beta1 preferencial = coracao."
    },

    {
      id: "carvedilol",
      nome: "Carvedilol",
      grupo: "Antiadrenergicos",
      classe: "Bloqueador beta + alpha1",
      acao: "Antagonista direto",
      receptores: ["alpha1", "beta1", "beta2"],
      mecanismo:
        "Bloqueia beta1, beta2 e alpha1, combinando reducao de atividade cardiaca com vasodilatacao.",
      efeitos: [
        "Reduz frequencia e contratilidade",
        "Promove vasodilatacao",
        "Reduz pressao arterial"
      ],
      usos: [
        "Insuficiencia cardiaca em pacientes selecionados",
        "Hipertensao"
      ],
      adversos: [
        "Bradicardia",
        "Hipotensao",
        "Tontura",
        "Broncoespasmo em suscetiveis"
      ],
      alertas: [
        "Asma e broncoespasmo",
        "Bradicardia",
        "Bloqueios de conducao"
      ],
      dica:
        "Carvedilol = beta + alpha1."
    },

    {
      id: "succinilcolina",
      nome: "Succinilcolina",
      grupo: "Neuromusculares",
      classe: "Bloqueador neuromuscular despolarizante",
      acao: "Agonista despolarizante",
      receptores: ["Nm"],
      mecanismo:
        "Ativa receptores nicotinicos Nm na placa motora e causa despolarizacao persistente, impedindo repolarizacao normal e levando a paralisia.",
      efeitos: [
        "Fasciculacoes iniciais",
        "Paralisia flacida subsequente"
      ],
      usos: [
        "Bloqueio neuromuscular para procedimentos e manejo de via aerea em contextos apropriados"
      ],
      adversos: [
        "Hipercalemia",
        "Bradicardia",
        "Mialgia",
        "Hipertermia maligna em individuos suscetiveis"
      ],
      alertas: [
        "Risco de hipercalemia em diversas condicoes de denervacao, queimaduras e lesao muscular",
        "Susceptibilidade a hipertermia maligna",
        "Deficiencia de butirilcolinesterase pode prolongar bloqueio"
      ],
      dica:
        "Succinilcolina e agonista Nm que paralisa por despolarizacao persistente."
    },

    {
      id: "rocuronio",
      nome: "Rocuronio",
      grupo: "Neuromusculares",
      classe: "Bloqueador neuromuscular nao despolarizante",
      acao: "Antagonista competitivo",
      receptores: ["Nm"],
      mecanismo:
        "Compete com acetilcolina pelos receptores nicotinicos Nm da placa motora sem ativa-los, impedindo despolarizacao.",
      efeitos: [
        "Bloqueio da transmissao neuromuscular",
        "Paralisia de musculatura esqueletica"
      ],
      usos: [
        "Facilitacao de intubacao e relaxamento muscular em anestesia e cuidados criticos"
      ],
      adversos: [
        "Paralisia prolongada",
        "Reacoes de hipersensibilidade",
        "Complicacoes respiratorias relacionadas ao bloqueio residual"
      ],
      alertas: [
        "Requer sedacao/anestesia apropriada e suporte ventilatorio",
        "Doencas neuromusculares e interacoes medicamentosas podem alterar resposta"
      ],
      dica:
        "Rocuronio = antagonista Nm nao despolarizante."
    },

    {
      "id": "dopamina",
      "nome": "Dopamina",
      "grupo": "Adrenergicos",
      "classe": "Agonista adrenergico dose-dependente",
      "acao": "Agonista direto",
      "receptores": [
        "D1",
        "beta1",
        "alpha1"
      ],
      "mecanismo": "Receptor/alvo indicado no material: D1, beta1, alpha1. Principal efeito descrito: Aumento do debito cardiaco, vasodilatacao renal em baixas doses e vasoconstricao em altas doses.",
      "efeitos": [
        "Aumento do debito cardiaco, vasodilatacao renal em baixas doses e vasoconstricao em altas doses."
      ],
      "usos": [
        "Choque e insuficiencia cardiaca aguda."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Choque e insuficiencia cardiaca aguda."
    },

    {
      "id": "isoproterenol",
      "nome": "Isoproterenol",
      "grupo": "Adrenergicos",
      "classe": "Agonista beta adrenergico",
      "acao": "Agonista direto",
      "receptores": [
        "beta1",
        "beta2"
      ],
      "mecanismo": "Receptor/alvo indicado no material: beta1, beta2. Principal efeito descrito: Aumento da frequencia cardiaca e broncodilatacao.",
      "efeitos": [
        "Aumento da frequencia cardiaca e broncodilatacao."
      ],
      "usos": [
        "Bradicardia, atualmente com uso raro."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Bradicardia, atualmente com uso raro."
    },

    {
      "id": "metildopa",
      "nome": "Metildopa",
      "grupo": "Adrenergicos",
      "classe": "Agonista alpha2 apos conversao em alpha-metilnoradrenalina",
      "acao": "Agonista direto",
      "receptores": [
        "alpha2"
      ],
      "mecanismo": "Receptor/alvo indicado no material: alpha2. Principal efeito descrito: Reducao da atividade simpatica.",
      "efeitos": [
        "Reducao da atividade simpatica."
      ],
      "usos": [
        "Hipertensao arterial, especialmente na gestacao."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Hipertensao arterial, especialmente na gestacao."
    },

    {
      "id": "fenoterol",
      "nome": "Fenoterol",
      "grupo": "Adrenergicos",
      "classe": "Agonista beta2",
      "acao": "Agonista direto",
      "receptores": [
        "beta2"
      ],
      "mecanismo": "Receptor/alvo indicado no material: beta2. Principal efeito descrito: Broncodilatacao e relaxamento da musculatura lisa bronquica.",
      "efeitos": [
        "Broncodilatacao e relaxamento da musculatura lisa bronquica."
      ],
      "usos": [
        "Asma e DPOC."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Asma e DPOC."
    },

    {
      "id": "doxazosina",
      "nome": "Doxazosina",
      "grupo": "Antiadrenergicos",
      "classe": "Antagonista alpha1",
      "acao": "Antagonista direto",
      "receptores": [
        "alpha1"
      ],
      "mecanismo": "Receptor/alvo indicado no material: alpha1. Principal efeito descrito: Vasodilatacao e relaxamento da musculatura lisa da prostata e colo da bexiga.",
      "efeitos": [
        "Vasodilatacao e relaxamento da musculatura lisa da prostata e colo da bexiga."
      ],
      "usos": [
        "Hipertensao arterial e hiperplasia prostatica benigna."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Hipertensao arterial e hiperplasia prostatica benigna."
    },

    {
      "id": "terazosina",
      "nome": "Terazosina",
      "grupo": "Antiadrenergicos",
      "classe": "Antagonista alpha1",
      "acao": "Antagonista direto",
      "receptores": [
        "alpha1"
      ],
      "mecanismo": "Receptor/alvo indicado no material: alpha1. Principal efeito descrito: Vasodilatacao e relaxamento da prostata.",
      "efeitos": [
        "Vasodilatacao e relaxamento da prostata."
      ],
      "usos": [
        "Hipertensao arterial e hiperplasia prostatica benigna."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Hipertensao arterial e hiperplasia prostatica benigna."
    },

    {
      "id": "alfuzosina",
      "nome": "Alfuzosina",
      "grupo": "Antiadrenergicos",
      "classe": "Antagonista alpha1",
      "acao": "Antagonista direto",
      "receptores": [
        "alpha1"
      ],
      "mecanismo": "Receptor/alvo indicado no material: alpha1. Principal efeito descrito: Relaxamento da musculatura lisa prostatica.",
      "efeitos": [
        "Relaxamento da musculatura lisa prostatica."
      ],
      "usos": [
        "Hiperplasia prostatica benigna."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Hiperplasia prostatica benigna."
    },

    {
      "id": "fentolamina",
      "nome": "Fentolamina",
      "grupo": "Antiadrenergicos",
      "classe": "Antagonista alpha1 e alpha2",
      "acao": "Antagonista direto",
      "receptores": [
        "alpha1",
        "alpha2"
      ],
      "mecanismo": "Receptor/alvo indicado no material: alpha1, alpha2. Principal efeito descrito: Vasodilatacao intensa e aumento reflexo da frequencia cardiaca.",
      "efeitos": [
        "Vasodilatacao intensa e aumento reflexo da frequencia cardiaca."
      ],
      "usos": [
        "Feocromocitoma, extravasamento de catecolaminas e crise hipertensiva."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Feocromocitoma, extravasamento de catecolaminas e crise hipertensiva."
    },

    {
      "id": "fenoxibenzamina",
      "nome": "Fenoxibenzamina",
      "grupo": "Antiadrenergicos",
      "classe": "Antagonista alpha1 e alpha2 irreversivel",
      "acao": "Antagonista direto",
      "receptores": [
        "alpha1",
        "alpha2"
      ],
      "mecanismo": "Receptor/alvo indicado no material: alpha1, alpha2. Principal efeito descrito: Vasodilatacao prolongada.",
      "efeitos": [
        "Vasodilatacao prolongada."
      ],
      "usos": [
        "Feocromocitoma no pre-operatorio e tratamento cronico."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Feocromocitoma no pre-operatorio e tratamento cronico."
    },

    {
      "id": "atenolol",
      "nome": "Atenolol",
      "grupo": "Antiadrenergicos",
      "classe": "Betabloqueador beta1 seletivo",
      "acao": "Antagonista direto",
      "receptores": [
        "beta1"
      ],
      "mecanismo": "Receptor/alvo indicado no material: beta1. Principal efeito descrito: Reducao da frequencia cardiaca e da contratilidade.",
      "efeitos": [
        "Reducao da frequencia cardiaca e da contratilidade."
      ],
      "usos": [
        "Hipertensao arterial, angina e infarto do miocardio."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Hipertensao arterial, angina e infarto do miocardio."
    },

    {
      "id": "esmolol",
      "nome": "Esmolol",
      "grupo": "Antiadrenergicos",
      "classe": "Betabloqueador beta1 seletivo",
      "acao": "Antagonista direto",
      "receptores": [
        "beta1"
      ],
      "mecanismo": "Receptor/alvo indicado no material: beta1. Principal efeito descrito: Reducao rapida da frequencia cardiaca.",
      "efeitos": [
        "Reducao rapida da frequencia cardiaca."
      ],
      "usos": [
        "Taquiarritmias e controle da frequencia cardiaca no perioperatorio."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Taquiarritmias e controle da frequencia cardiaca no perioperatorio."
    },

    {
      "id": "timolol",
      "nome": "Timolol",
      "grupo": "Antiadrenergicos",
      "classe": "Betabloqueador nao seletivo",
      "acao": "Antagonista direto",
      "receptores": [
        "beta1",
        "beta2"
      ],
      "mecanismo": "Receptor/alvo indicado no material: beta1, beta2. Principal efeito descrito: Reducao da producao de humor aquoso e da frequencia cardiaca.",
      "efeitos": [
        "Reducao da producao de humor aquoso e da frequencia cardiaca."
      ],
      "usos": [
        "Glaucoma e hipertensao ocular."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Glaucoma e hipertensao ocular."
    },

    {
      "id": "nadolol",
      "nome": "Nadolol",
      "grupo": "Antiadrenergicos",
      "classe": "Betabloqueador nao seletivo",
      "acao": "Antagonista direto",
      "receptores": [
        "beta1",
        "beta2"
      ],
      "mecanismo": "Receptor/alvo indicado no material: beta1, beta2. Principal efeito descrito: Reducao da frequencia cardiaca e da pressao arterial.",
      "efeitos": [
        "Reducao da frequencia cardiaca e da pressao arterial."
      ],
      "usos": [
        "Hipertensao arterial e angina."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Hipertensao arterial e angina."
    },

    {
      "id": "pindolol",
      "nome": "Pindolol",
      "grupo": "Antiadrenergicos",
      "classe": "Betabloqueador com agonismo parcial",
      "acao": "Antagonista direto",
      "receptores": [
        "beta1",
        "beta2"
      ],
      "mecanismo": "Receptor/alvo indicado no material: beta1, beta2. Principal efeito descrito: Betabloqueio com menor reducao da frequencia cardiaca em repouso.",
      "efeitos": [
        "Betabloqueio com menor reducao da frequencia cardiaca em repouso."
      ],
      "usos": [
        "Hipertensao arterial."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Hipertensao arterial."
    },

    {
      "id": "acebutolol",
      "nome": "Acebutolol",
      "grupo": "Antiadrenergicos",
      "classe": "Betabloqueador beta1 com agonismo parcial",
      "acao": "Antagonista direto",
      "receptores": [
        "beta1"
      ],
      "mecanismo": "Receptor/alvo indicado no material: beta1. Principal efeito descrito: Reducao da frequencia cardiaca com menor bradicardia em repouso.",
      "efeitos": [
        "Reducao da frequencia cardiaca com menor bradicardia em repouso."
      ],
      "usos": [
        "Hipertensao arterial e arritmias."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Hipertensao arterial e arritmias."
    },

    {
      "id": "labetalol",
      "nome": "Labetalol",
      "grupo": "Antiadrenergicos",
      "classe": "Bloqueador beta e alpha1",
      "acao": "Antagonista direto",
      "receptores": [
        "beta1",
        "beta2",
        "alpha1"
      ],
      "mecanismo": "Receptor/alvo indicado no material: beta1, beta2, alpha1. Principal efeito descrito: Reducao da frequencia cardiaca e vasodilatacao.",
      "efeitos": [
        "Reducao da frequencia cardiaca e vasodilatacao."
      ],
      "usos": [
        "Crises hipertensivas e hipertensao na gestacao."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Crises hipertensivas e hipertensao na gestacao."
    },

    {
      "id": "acetilcolina",
      "nome": "Acetilcolina",
      "grupo": "Colinergicos",
      "classe": "Agonista parassimpatico direto",
      "acao": "Agonista direto",
      "receptores": [
        "M1",
        "M2",
        "M3",
        "Nn",
        "Nm"
      ],
      "mecanismo": "Receptor/alvo indicado no material: M1, M2, M3, Nn, Nm. Principal efeito descrito: Bradicardia, miose, aumento das secrecoes, broncoconstricao, aumento do peristaltismo e contracao da bexiga.",
      "efeitos": [
        "Bradicardia, miose, aumento das secrecoes, broncoconstricao, aumento do peristaltismo e contracao da bexiga."
      ],
      "usos": [],
      "adversos": [],
      "alertas": [],
      "dica": "Receptor/alvo no material: M1, M2, M3, Nn, Nm."
    },

    {
      "id": "carbacol",
      "nome": "Carbacol",
      "grupo": "Colinergicos",
      "classe": "Agonista parassimpatico direto",
      "acao": "Agonista direto",
      "receptores": [
        "Muscarinicos",
        "Nicotinicos"
      ],
      "mecanismo": "Receptor/alvo indicado no material: Muscarinicos, Nicotinicos. Principal efeito descrito: Promove miose intensa e reduz a pressao intraocular.",
      "efeitos": [
        "Promove miose intensa e reduz a pressao intraocular."
      ],
      "usos": [
        "Glaucoma."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Glaucoma."
    },

    {
      "id": "metacolina",
      "nome": "Metacolina",
      "grupo": "Colinergicos",
      "classe": "Agonista parassimpatico direto",
      "acao": "Agonista direto",
      "receptores": [
        "M3"
      ],
      "mecanismo": "Receptor/alvo indicado no material: M3. Principal efeito descrito: Provoca broncoconstricao.",
      "efeitos": [
        "Provoca broncoconstricao."
      ],
      "usos": [
        "Teste de provocacao para diagnostico de hiper-reatividade bronquica."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Teste de provocacao para diagnostico de hiper-reatividade bronquica."
    },

    {
      "id": "edrofonio",
      "nome": "Edrofonio",
      "grupo": "Colinergicos",
      "classe": "Agonista parassimpatico indireto",
      "acao": "Agonista indireto",
      "receptores": [
        "Muscarinicos",
        "Nicotinicos"
      ],
      "mecanismo": "Receptor/alvo indicado no material: Muscarinicos, Nicotinicos. Principal efeito descrito: Aumento da forca muscular, bradicardia, miose, aumento das secrecoes, motilidade gastrointestinal e contracao da bexiga.",
      "efeitos": [
        "Aumento da forca muscular, bradicardia, miose, aumento das secrecoes, motilidade gastrointestinal e contracao da bexiga."
      ],
      "usos": [],
      "adversos": [],
      "alertas": [],
      "dica": "Receptor/alvo no material: Muscarinicos, Nicotinicos."
    },

    {
      "id": "donepezila",
      "nome": "Donepezila",
      "grupo": "Colinergicos",
      "classe": "Agonista parassimpatico indireto",
      "acao": "Agonista indireto",
      "receptores": [
        "Muscarinicos",
        "Nicotinicos"
      ],
      "mecanismo": "Receptor/alvo indicado no material: Muscarinicos, Nicotinicos. Principal efeito descrito: Melhora da memoria e da cognicao; pode causar nauseas, vomitos, diarreia e bradicardia.",
      "efeitos": [
        "Melhora da memoria e da cognicao; pode causar nauseas, vomitos, diarreia e bradicardia."
      ],
      "usos": [
        "Doenca de Alzheimer."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Doenca de Alzheimer."
    },

    {
      "id": "galantamina",
      "nome": "Galantamina",
      "grupo": "Colinergicos",
      "classe": "Agonista parassimpatico indireto",
      "acao": "Agonista indireto",
      "receptores": [
        "Muscarinicos",
        "Nicotinicos"
      ],
      "mecanismo": "Receptor/alvo indicado no material: Muscarinicos, Nicotinicos. Principal efeito descrito: Melhora da funcao cognitiva; pode ocorrer nausea, vomito, perda de apetite e bradicardia.",
      "efeitos": [
        "Melhora da funcao cognitiva; pode ocorrer nausea, vomito, perda de apetite e bradicardia."
      ],
      "usos": [],
      "adversos": [],
      "alertas": [],
      "dica": "Receptor/alvo no material: Muscarinicos, Nicotinicos."
    },

    {
      "id": "rivastigmina",
      "nome": "Rivastigmina",
      "grupo": "Colinergicos",
      "classe": "Agonista parassimpatico indireto",
      "acao": "Agonista indireto",
      "receptores": [
        "Muscarinicos",
        "Nicotinicos"
      ],
      "mecanismo": "Receptor/alvo indicado no material: Muscarinicos, Nicotinicos. Principal efeito descrito: Melhora da cognicao; pode causar nauseas, vomitos e bradicardia.",
      "efeitos": [
        "Melhora da cognicao; pode causar nauseas, vomitos e bradicardia."
      ],
      "usos": [
        "Alzheimer e demencia associada a doenca de Parkinson."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Alzheimer e demencia associada a doenca de Parkinson."
    },

    {
      "id": "fisostigmina",
      "nome": "Fisostigmina",
      "grupo": "Colinergicos",
      "classe": "Agonista parassimpatico indireto",
      "acao": "Agonista indireto",
      "receptores": [
        "Muscarinicos",
        "Nicotinicos"
      ],
      "mecanismo": "Receptor/alvo indicado no material: Muscarinicos, Nicotinicos. Principal efeito descrito: Reversao da intoxicacao por antimuscarinicos, miose, bradicardia e aumento da motilidade gastrointestinal; em excesso pode causar convulsoes e crise colinergica.",
      "efeitos": [
        "Reversao da intoxicacao por antimuscarinicos, miose, bradicardia e aumento da motilidade gastrointestinal; em excesso pode causar convulsoes e crise colinergica."
      ],
      "usos": [],
      "adversos": [],
      "alertas": [],
      "dica": "Receptor/alvo no material: Muscarinicos, Nicotinicos."
    },

    {
      "id": "tiotropio",
      "nome": "Tiotropio",
      "grupo": "Anticolinergicos",
      "classe": "Antagonista muscarinico",
      "acao": "Antagonista direto",
      "receptores": [
        "M3"
      ],
      "mecanismo": "Receptor/alvo indicado no material: M3. Principal efeito descrito: Broncodilatacao prolongada.",
      "efeitos": [
        "Broncodilatacao prolongada."
      ],
      "usos": [
        "DPOC e asma."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: DPOC e asma."
    },

    {
      "id": "glicopirrolato",
      "nome": "Glicopirrolato",
      "grupo": "Anticolinergicos",
      "classe": "Antagonista muscarinico",
      "acao": "Antagonista direto",
      "receptores": [
        "M3"
      ],
      "mecanismo": "Receptor/alvo indicado no material: M3. Principal efeito descrito: Reducao das secrecoes.",
      "efeitos": [
        "Reducao das secrecoes."
      ],
      "usos": [
        "Pre-anestesia e excesso de secrecoes."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Pre-anestesia e excesso de secrecoes."
    },

    {
      "id": "diciclomina",
      "nome": "Diciclomina",
      "grupo": "Anticolinergicos",
      "classe": "Antagonista muscarinico",
      "acao": "Antagonista direto",
      "receptores": [
        "M3"
      ],
      "mecanismo": "Receptor/alvo indicado no material: M3. Principal efeito descrito: Relaxamento da musculatura lisa intestinal.",
      "efeitos": [
        "Relaxamento da musculatura lisa intestinal."
      ],
      "usos": [
        "Colica intestinal e sindrome do intestino irritavel."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Colica intestinal e sindrome do intestino irritavel."
    },

    {
      "id": "pirenzepina",
      "nome": "Pirenzepina",
      "grupo": "Anticolinergicos",
      "classe": "Antagonista muscarinico",
      "acao": "Antagonista direto",
      "receptores": [
        "M1"
      ],
      "mecanismo": "Receptor/alvo indicado no material: M1. Principal efeito descrito: Reducao da secrecao gastrica.",
      "efeitos": [
        "Reducao da secrecao gastrica."
      ],
      "usos": [
        "Ulcera peptica, atualmente com uso raro."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Ulcera peptica, atualmente com uso raro."
    },

    {
      "id": "tropicamida",
      "nome": "Tropicamida",
      "grupo": "Anticolinergicos",
      "classe": "Antagonista muscarinico",
      "acao": "Antagonista direto",
      "receptores": [
        "M3"
      ],
      "mecanismo": "Receptor/alvo indicado no material: M3. Principal efeito descrito: Midriase de curta duracao.",
      "efeitos": [
        "Midriase de curta duracao."
      ],
      "usos": [
        "Exame de fundo de olho."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Exame de fundo de olho."
    },

    {
      "id": "mecamilamina",
      "nome": "Mecamilamina",
      "grupo": "Ganglionares",
      "classe": "Bloqueador ganglionar",
      "acao": "Bloqueador ganglionar",
      "receptores": [
        "Nn"
      ],
      "mecanismo": "Receptor/alvo indicado no material: Nn. Principal efeito descrito: Bloqueio da transmissao ganglionar, reduzindo tonos simpatico e parassimpatico; pode provocar hipotensao, taquicardia, boca seca, constipacao e retencao urinaria.",
      "efeitos": [
        "Bloqueio da transmissao ganglionar, reduzindo tonos simpatico e parassimpatico; pode provocar hipotensao, taquicardia, boca seca, constipacao e retencao urinaria."
      ],
      "usos": [],
      "adversos": [],
      "alertas": [],
      "dica": "Receptor/alvo no material: Nn."
    },

    {
      "id": "trimetafano",
      "nome": "Trimetafano",
      "grupo": "Ganglionares",
      "classe": "Bloqueador ganglionar",
      "acao": "Bloqueador ganglionar",
      "receptores": [
        "Nn"
      ],
      "mecanismo": "Receptor/alvo indicado no material: Nn. Principal efeito descrito: Bloqueio ganglionar de acao curta com reducao rapida da pressao arterial; pode causar hipotensao, taquicardia reflexa, midriase e retencao urinaria.",
      "efeitos": [
        "Bloqueio ganglionar de acao curta com reducao rapida da pressao arterial; pode causar hipotensao, taquicardia reflexa, midriase e retencao urinaria."
      ],
      "usos": [],
      "adversos": [],
      "alertas": [],
      "dica": "Receptor/alvo no material: Nn."
    },

    {
      "id": "hexametonio",
      "nome": "Hexametonio",
      "grupo": "Ganglionares",
      "classe": "Bloqueador ganglionar",
      "acao": "Bloqueador ganglionar",
      "receptores": [
        "Nn"
      ],
      "mecanismo": "Receptor/alvo indicado no material: Nn. Principal efeito descrito: Bloqueio da transmissao ganglionar, levando a hipotensao, taquicardia, boca seca, constipacao, retencao urinaria e midriase.",
      "efeitos": [
        "Bloqueio da transmissao ganglionar, levando a hipotensao, taquicardia, boca seca, constipacao, retencao urinaria e midriase."
      ],
      "usos": [],
      "adversos": [],
      "alertas": [],
      "dica": "Receptor/alvo no material: Nn."
    },

    {
      "id": "mivacurio",
      "nome": "Mivacurio",
      "grupo": "Neuromusculares",
      "classe": "Bloqueador neuromuscular nao despolarizante",
      "acao": "Bloqueador neuromuscular",
      "receptores": [
        "Nm"
      ],
      "mecanismo": "Receptor/alvo indicado no material: Nm. Principal efeito descrito: Bloqueio neuromuscular competitivo, promovendo relaxamento da musculatura esqueletica para procedimentos cirurgicos e intubacao.",
      "efeitos": [
        "Bloqueio neuromuscular competitivo, promovendo relaxamento da musculatura esqueletica para procedimentos cirurgicos e intubacao."
      ],
      "usos": [],
      "adversos": [],
      "alertas": [],
      "dica": "Receptor/alvo no material: Nm."
    },

    {
      "id": "atracurio",
      "nome": "Atracurio",
      "grupo": "Neuromusculares",
      "classe": "Bloqueador neuromuscular nao despolarizante",
      "acao": "Bloqueador neuromuscular",
      "receptores": [
        "Nm"
      ],
      "mecanismo": "Receptor/alvo indicado no material: Nm. Principal efeito descrito: Relaxamento da musculatura esqueletica durante cirurgias e ventilacao mecanica.",
      "efeitos": [
        "Relaxamento da musculatura esqueletica durante cirurgias e ventilacao mecanica."
      ],
      "usos": [],
      "adversos": [],
      "alertas": [],
      "dica": "Receptor/alvo no material: Nm."
    },

    {
      "id": "cisatracurio",
      "nome": "Cisatracurio",
      "grupo": "Neuromusculares",
      "classe": "Bloqueador neuromuscular nao despolarizante",
      "acao": "Bloqueador neuromuscular",
      "receptores": [
        "Nm"
      ],
      "mecanismo": "Receptor/alvo indicado no material: Nm. Principal efeito descrito: Relaxamento da musculatura esqueletica com menor liberacao de histamina, utilizado em cirurgias e terapia intensiva.",
      "efeitos": [
        "Relaxamento da musculatura esqueletica com menor liberacao de histamina, utilizado em cirurgias e terapia intensiva."
      ],
      "usos": [],
      "adversos": [],
      "alertas": [],
      "dica": "Receptor/alvo no material: Nm."
    },

    {
      "id": "pancuronio",
      "nome": "Pancuronio",
      "grupo": "Neuromusculares",
      "classe": "Bloqueador neuromuscular nao despolarizante",
      "acao": "Bloqueador neuromuscular",
      "receptores": [
        "Nm"
      ],
      "mecanismo": "Receptor/alvo indicado no material: Nm. Principal efeito descrito: Bloqueio neuromuscular prolongado, produzindo relaxamento muscular durante procedimentos cirurgicos e ventilacao mecanica.",
      "efeitos": [
        "Bloqueio neuromuscular prolongado, produzindo relaxamento muscular durante procedimentos cirurgicos e ventilacao mecanica."
      ],
      "usos": [],
      "adversos": [],
      "alertas": [],
      "dica": "Receptor/alvo no material: Nm."
    },

    {
      "id": "vecuronio",
      "nome": "Vecuronio",
      "grupo": "Neuromusculares",
      "classe": "Bloqueador neuromuscular nao despolarizante",
      "acao": "Bloqueador neuromuscular",
      "receptores": [
        "Nm"
      ],
      "mecanismo": "Receptor/alvo indicado no material: Nm. Principal efeito descrito: Relaxamento da musculatura esqueletica durante anestesia geral, com minimos efeitos cardiovasculares.",
      "efeitos": [
        "Relaxamento da musculatura esqueletica durante anestesia geral, com minimos efeitos cardiovasculares."
      ],
      "usos": [],
      "adversos": [],
      "alertas": [],
      "dica": "Receptor/alvo no material: Nm."
    },

    {
      "id": "d-tubocurarina",
      "nome": "d-Tubocurarina",
      "grupo": "Neuromusculares",
      "classe": "Bloqueador neuromuscular nao despolarizante",
      "acao": "Bloqueador neuromuscular",
      "receptores": [
        "Nm"
      ],
      "mecanismo": "Receptor/alvo indicado no material: Nm. Principal efeito descrito: Bloqueio neuromuscular competitivo e relaxamento da musculatura esqueletica; pode causar hipotensao e broncoconstricao por liberacao de histamina.",
      "efeitos": [
        "Bloqueio neuromuscular competitivo e relaxamento da musculatura esqueletica; pode causar hipotensao e broncoconstricao por liberacao de histamina."
      ],
      "usos": [],
      "adversos": [],
      "alertas": [],
      "dica": "Receptor/alvo no material: Nm."
    },

    {
      "id": "decametonio",
      "nome": "Decametonio",
      "grupo": "Neuromusculares",
      "classe": "Bloqueador neuromuscular despolarizante",
      "acao": "Bloqueador neuromuscular",
      "receptores": [
        "Nm"
      ],
      "mecanismo": "Receptor/alvo indicado no material: Nm. Principal efeito descrito: Bloqueio neuromuscular despolarizante, causando fasciculacoes iniciais seguidas de relaxamento e paralisia da musculatura esqueletica.",
      "efeitos": [
        "Bloqueio neuromuscular despolarizante, causando fasciculacoes iniciais seguidas de relaxamento e paralisia da musculatura esqueletica."
      ],
      "usos": [],
      "adversos": [],
      "alertas": [],
      "dica": "Receptor/alvo no material: Nm."
    },

    {
      "id": "diazepam",
      "nome": "Diazepam",
      "grupo": "Benzodiazepinicos",
      "classe": "Benzodiazepinico de longa acao",
      "acao": "Benzodiazepinico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Ansiedade, espasmos musculares, estado de mal epileptico, abstinencia alcoolica e sedacao."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Ansiedade, espasmos musculares, estado de mal epileptico, abstinencia alcoolica e sedacao."
    },

    {
      "id": "clonazepam",
      "nome": "Clonazepam",
      "grupo": "Benzodiazepinicos",
      "classe": "Benzodiazepinico de longa acao",
      "acao": "Benzodiazepinico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Epilepsia, transtorno do panico e ansiedade."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Epilepsia, transtorno do panico e ansiedade."
    },

    {
      "id": "lorazepam",
      "nome": "Lorazepam",
      "grupo": "Benzodiazepinicos",
      "classe": "Benzodiazepinico de acao intermediaria",
      "acao": "Benzodiazepinico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Ansiedade, convulsoes e sedacao."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Ansiedade, convulsoes e sedacao."
    },

    {
      "id": "alprazolam",
      "nome": "Alprazolam",
      "grupo": "Benzodiazepinicos",
      "classe": "Benzodiazepinico de acao intermediaria",
      "acao": "Benzodiazepinico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Transtorno do panico e ansiedade."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Transtorno do panico e ansiedade."
    },

    {
      "id": "midazolam",
      "nome": "Midazolam",
      "grupo": "Benzodiazepinicos",
      "classe": "Benzodiazepinico de curta acao",
      "acao": "Benzodiazepinico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Sedacao, procedimentos e inducao anestesica."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Sedacao, procedimentos e inducao anestesica."
    },

    {
      "id": "temazepam",
      "nome": "Temazepam",
      "grupo": "Benzodiazepinicos",
      "classe": "Benzodiazepinico",
      "acao": "Benzodiazepinico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Insonia."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Insonia."
    },

    {
      "id": "triazolam",
      "nome": "Triazolam",
      "grupo": "Benzodiazepinicos",
      "classe": "Benzodiazepinico de curta acao",
      "acao": "Benzodiazepinico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Insonia de curta duracao."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Insonia de curta duracao."
    },

    {
      "id": "oxazepam",
      "nome": "Oxazepam",
      "grupo": "Benzodiazepinicos",
      "classe": "Benzodiazepinico",
      "acao": "Benzodiazepinico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Ansiedade e abstinencia alcoolica."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Ansiedade e abstinencia alcoolica."
    },

    {
      "id": "nitrazepam",
      "nome": "Nitrazepam",
      "grupo": "Benzodiazepinicos",
      "classe": "Benzodiazepinico",
      "acao": "Benzodiazepinico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Insonia e algumas epilepsias."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Insonia e algumas epilepsias."
    },

    {
      "id": "flurazepam",
      "nome": "Flurazepam",
      "grupo": "Benzodiazepinicos",
      "classe": "Benzodiazepinico de longa acao",
      "acao": "Benzodiazepinico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Insonia."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Insonia."
    },

    {
      "id": "bromazepam",
      "nome": "Bromazepam",
      "grupo": "Benzodiazepinicos",
      "classe": "Benzodiazepinico",
      "acao": "Benzodiazepinico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Ansiedade."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Ansiedade."
    },

    {
      "id": "clordiazepoxido",
      "nome": "Clordiazepoxido",
      "grupo": "Benzodiazepinicos",
      "classe": "Benzodiazepinico de longa acao",
      "acao": "Benzodiazepinico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Ansiedade e abstinencia alcoolica."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Ansiedade e abstinencia alcoolica."
    },

    {
      "id": "fenobarbital",
      "nome": "Fenobarbital",
      "grupo": "Barbituricos",
      "classe": "Barbiturico de longa acao",
      "acao": "Barbiturico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Epilepsia, convulsoes e sedacao."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Epilepsia, convulsoes e sedacao."
    },

    {
      "id": "tiopental",
      "nome": "Tiopental",
      "grupo": "Barbituricos",
      "classe": "Barbiturico de ultracurta acao",
      "acao": "Barbiturico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Inducao anestesica."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Inducao anestesica."
    },

    {
      "id": "pentobarbital",
      "nome": "Pentobarbital",
      "grupo": "Barbituricos",
      "classe": "Barbiturico de curta acao",
      "acao": "Barbiturico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Sedacao, anestesia e controle de convulsoes."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Sedacao, anestesia e controle de convulsoes."
    },

    {
      "id": "secobarbital",
      "nome": "Secobarbital",
      "grupo": "Barbituricos",
      "classe": "Barbiturico de curta acao",
      "acao": "Barbiturico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Sedacao e hipnose, atualmente com uso raro."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Sedacao e hipnose, atualmente com uso raro."
    },

    {
      "id": "amobarbital",
      "nome": "Amobarbital",
      "grupo": "Barbituricos",
      "classe": "Barbiturico de acao intermediaria",
      "acao": "Barbiturico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Sedacao e hipnose, atualmente com uso raro."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Sedacao e hipnose, atualmente com uso raro."
    },

    {
      "id": "butabarbital",
      "nome": "Butabarbital",
      "grupo": "Barbituricos",
      "classe": "Barbiturico de acao intermediaria",
      "acao": "Barbiturico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Sedacao e tratamento de curto prazo da insonia."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Sedacao e tratamento de curto prazo da insonia."
    },

    {
      "id": "mefobarbital",
      "nome": "Mefobarbital",
      "grupo": "Barbituricos",
      "classe": "Barbiturico de longa acao",
      "acao": "Barbiturico",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A.",
      "efeitos": [],
      "usos": [
        "Epilepsia e sedacao."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Epilepsia e sedacao."
    },

    {
      "id": "primidona",
      "nome": "Primidona",
      "grupo": "Barbituricos",
      "classe": "Anticonvulsivante derivado dos barbituricos",
      "acao": "Anticonvulsivante",
      "receptores": [
        "GABA-A"
      ],
      "mecanismo": "Receptor/alvo indicado no material: GABA-A. Principal efeito descrito: No material, e descrita como metabolizada em fenobarbital.",
      "efeitos": [
        "No material, e descrita como metabolizada em fenobarbital."
      ],
      "usos": [
        "Epilepsia e tremor essencial."
      ],
      "adversos": [],
      "alertas": [],
      "dica": "Indicacao no material: Epilepsia e tremor essencial."
    }

  ];

})();

/*
 * Unidade 3 — Farmacologia By Haggi
 * Fonte: PDF "3 stag.pdf" enviado pelo usuario.
 *
 * Esta camada preserva a terminologia do material de estudo.
 * Quando o PDF informa apenas um alvo/via (e nao um receptor
 * molecular especifico), o Cortex registra esse alvo como tal.
 */
(function () {
  "use strict";

  const SOURCE = "3ª Unidade — Farmacologia By Haggi";

  function slug(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function make(names, shared, overrides) {
    const map = overrides || {};

    return names.map(function (name) {
      return Object.assign(
        {
          id: slug(name),
          nome: name,
          principioAtivo: name,
          fonte: SOURCE
        },
        shared,
        map[name] || {}
      );
    });
  }

  Object.assign(
    window.CortexReceptores,
    {
      "COX-1": {
        familia: "Cicloxigenase",
        via: "COX-1",
        resumo: "Predominantemente constitutiva; no material, relaciona-se à proteção da mucosa gástrica, função renal e agregação plaquetária."
      },
      "COX-2": {
        familia: "Cicloxigenase",
        via: "COX-2",
        resumo: "Mais associada à resposta inflamatória e alvo preferencial dos AINEs seletivos descritos no material."
      },
      "Receptor intracelular": {
        familia: "Corticoides",
        via: "Núcleo / transcrição gênica",
        resumo: "Corticoide liga-se a receptor intracelular, segue ao núcleo e altera a transcrição gênica, aumentando anexina 1/lipocortina e reduzindo fosfolipase A2."
      },
      "Parede celular": {
        familia: "Antimicrobianos",
        via: "Parede bacteriana",
        resumo: "Alvo de classes que bloqueiam a síntese da parede/peptidoglicano no material."
      },
      "Membrana bacteriana": {
        familia: "Antimicrobianos",
        via: "Membrana",
        resumo: "Polimixinas formam poros e desestabilizam a membrana bacteriana."
      },
      "DNA girase/topoisomerases": {
        familia: "Antimicrobianos",
        via: "DNA",
        resumo: "Alvo descrito para quinolonas."
      },
      "50S": {
        familia: "Ribossomo bacteriano",
        via: "Síntese proteica",
        resumo: "Alvo de macrolídeos e cloranfenicol no material."
      },
      "30S": {
        familia: "Ribossomo bacteriano",
        via: "Síntese proteica",
        resumo: "Alvo de tetraciclinas e aminoglicosídeos no material."
      },
      "Ácido fólico": {
        familia: "Antimicrobianos",
        via: "Via do folato",
        resumo: "Alvo metabólico de sulfonamidas, trimetoprim e da associação sulfametoxazol + trimetoprim."
      },
      "H1": {
        familia: "Histamínico",
        via: "Gq",
        resumo: "No material: broncoconstrição, vasodilatação, edema e prurido."
      },
      "H2": {
        familia: "Histamínico",
        via: "Gs",
        resumo: "No material: aumento de HCl gástrico e efeitos cardíacos."
      },
      "H3": {
        familia: "Histamínico",
        via: "Gi",
        resumo: "Descrito como autorreceptor no SNC."
      },
      "H4": {
        familia: "Histamínico",
        via: "Gi",
        resumo: "Relacionado à quimiotaxia de leucócitos no material."
      },
      "Mastócitos/basófilos": {
        familia: "Antialérgicos",
        via: "Liberação de histamina",
        resumo: "Cromolim e nedocromil são descritos como redutores da liberação de histamina por mastócitos/basófilos."
      },
      "Via dos leucotrienos": {
        familia: "Eicosanoides",
        via: "Leucotrienos",
        resumo: "O material relaciona leucotrienos à broncoconstrição/exsudato e montelucaste ao controle da asma crônica."
      },
      "PGE": {
        familia: "Eicosanoides",
        via: "Prostaglandinas",
        resumo: "Alvo/via indicada no material para misoprostol, análogo de PGE."
      },
      "PGE1": {
        familia: "Eicosanoides",
        via: "Prostaglandinas",
        resumo: "Alvo/via indicada no material para alprostadil."
      },
      "Nav": {
        familia: "Canal de sódio",
        via: "Canal de Na+ voltagem-dependente",
        resumo: "Anestésicos locais bloqueiam canais Nav, reduzem influxo de Na+ e impedem despolarização e propagação do potencial de ação."
      },
      "Ação central": {
        familia: "Analgésicos",
        via: "SNC",
        resumo: "O material descreve o paracetamol com ação predominantemente central e pouca ação anti-inflamatória periférica clinicamente relevante."
      }
    }
  );

  const unit3 = [];

  unit3.push.apply(
    unit3,
    make(
      ["AAS", "Salicilato de metila"],
      {
        grupo: "AINEs",
        classe: "Salicilatos",
        acao: "Inibição de COX",
        receptores: ["COX-1", "COX-2"],
        mecanismo: "Inibição da cicloxigenase, reduzindo a formação de prostanoides.",
        efeitos: ["Redução de dor", "Redução de febre", "Redução de inflamação"],
        usos: ["Dor, febre e inflamação"],
        adversos: ["Sangramento", "Salicismo"],
        alertas: [],
        dica: "Salicilatos → COX; no AAS, lembre também de plaquetas."
      },
      {
        "AAS": {
          principioAtivo: "Ácido acetilsalicílico (AAS)",
          mecanismo: "Inibe COX; o material destaca inibição irreversível da COX plaquetária.",
          efeitos: ["Redução de dor, febre e inflamação", "Antiagregação plaquetária em baixa dose"],
          usos: ["Dor, febre e inflamação", "AAS em baixa dose como antiagregante"],
          alertas: ["Criança + doença viral + salicilato → Síndrome de Reye"],
          dica: "AAS + plaqueta = inibição irreversível / antiagregação."
        }
      }
    )
  );

  unit3.push(
    {
      id: "paracetamol",
      nome: "Paracetamol",
      principioAtivo: "Paracetamol",
      grupo: "Analgésicos e antipiréticos",
      classe: "Paracetamol",
      acao: "Ação predominantemente central",
      receptores: ["Ação central"],
      mecanismo: "O material descreve ação predominantemente central, com pouca ação anti-inflamatória periférica clinicamente relevante.",
      efeitos: ["Analgesia", "Antipirese"],
      usos: ["Dor leve/moderada", "Febre"],
      adversos: ["Hepatotoxicidade por superdosagem"],
      alertas: ["Não classificar como AINE anti-inflamatório no contexto do material"],
      dica: "Paracetamol + overdose = fígado.",
      fonte: SOURCE
    }
  );

  unit3.push.apply(
    unit3,
    make(
      ["Ácido mefenâmico", "Ácido tolfenâmico"],
      {
        grupo: "AINEs",
        classe: "Fenamatos",
        acao: "Inibição não seletiva de COX",
        receptores: ["COX-1", "COX-2"],
        mecanismo: "Inibição não seletiva de COX-1/COX-2.",
        efeitos: ["Redução de inflamação", "Analgesia"],
        usos: ["Inflamações", "Dismenorreia"],
        adversos: ["Agressão gástrica", "Alterações hematológicas"],
        alertas: [],
        dica: "Fenamatos = COX-1/COX-2 + inflamação/dismenorreia."
      }
    )
  );

  unit3.push.apply(
    unit3,
    make(
      ["Diclofenaco"],
      {
        grupo: "AINEs",
        classe: "Acetatos",
        acao: "Inibição de COX",
        receptores: ["COX-1", "COX-2"],
        mecanismo: "Inibe COX-1/COX-2.",
        efeitos: ["Analgesia", "Ação anti-inflamatória"],
        usos: ["Dores e inflamações articulares"],
        adversos: ["Agressão gástrica", "Hepatotoxicidade", "Alterações hematológicas"],
        alertas: [],
        dica: "Diclofenaco + articulação = tropismo pelo líquido sinovial."
      }
    )
  );

  unit3.push.apply(
    unit3,
    make(
      ["Ibuprofeno", "Naproxeno", "Cetoprofeno"],
      {
        grupo: "AINEs",
        classe: "Propionatos",
        acao: "Inibição não seletiva de COX",
        receptores: ["COX-1", "COX-2"],
        mecanismo: "Inibição não seletiva de COX-1/COX-2.",
        efeitos: ["Analgesia", "Antipirese", "Ação anti-inflamatória"],
        usos: ["Dor", "Inflamação", "Processos musculoesqueléticos"],
        adversos: ["Toxicidade gástrica", "Toxicidade renal"],
        alertas: ["AINE + rim → redução de prostaglandinas renais e risco de lesão renal"],
        dica: "Propionatos = dor, inflamação e processos musculoesqueléticos."
      }
    )
  );

  unit3.push.apply(
    unit3,
    make(
      ["Piroxicam", "Tenoxicam", "Meloxicam", "Metoxicam"],
      {
        grupo: "AINEs",
        classe: "Oxicans",
        acao: "Inibição de COX",
        receptores: ["COX-1", "COX-2"],
        mecanismo: "Inibição de COX-1/COX-2; o material destaca leve preferência do meloxicam por COX-2.",
        efeitos: ["Analgesia", "Ação anti-inflamatória"],
        usos: ["Artrite reumatoide", "Osteoartrite", "Inflamação crônica"],
        adversos: ["Tontura", "Sonolência", "Agressão gástrica"],
        alertas: ["Meia-vida longa"],
        dica: "Piroxicam/meloxicam = oxicans + meia-vida longa."
      }
    )
  );

  unit3.push(
    {
      id: "dipirona",
      nome: "Dipirona",
      principioAtivo: "Dipirona / metamizol",
      grupo: "Analgésicos e antipiréticos",
      classe: "Dipirona / metamizol",
      acao: "Redução da síntese de prostaglandinas",
      receptores: ["COX-1", "COX-2"],
      mecanismo: "Redução da síntese de prostaglandinas.",
      efeitos: ["Analgesia", "Antipirese"],
      usos: ["Analgesia", "Antipirese"],
      adversos: ["Agranulocitose", "Aplasia medular", "Anemia", "Hipotensão IV"],
      alertas: ["Alterações hematológicas são destaque no material"],
      dica: "Dipirona + alteração hematológica = agranulocitose.",
      fonte: SOURCE
    }
  );

  unit3.push.apply(
    unit3,
    make(
      ["Nimesulida", "Nimesutona"],
      {
        grupo: "AINEs",
        classe: "Seletivos / preferenciais COX-2",
        acao: "Inibição preferencial de COX-2",
        receptores: ["COX-2"],
        mecanismo: "Inibição preferencial de COX-2.",
        efeitos: ["Analgesia", "Ação anti-inflamatória"],
        usos: ["Processos musculares/articulares", "Dismenorreia"],
        adversos: ["Risco renal"],
        alertas: ["Menor agressão gastrointestinal que os não seletivos, segundo o material"],
        dica: "COX-2 preferencial = menor agressão gástrica, mas o risco renal permanece."
      }
    )
  );

  unit3.push.apply(
    unit3,
    make(
      ["Celecoxibe", "Rofecoxibe", "Valdecoxibe"],
      {
        grupo: "AINEs",
        classe: "Coxibes",
        acao: "Inibição altamente seletiva de COX-2",
        receptores: ["COX-2"],
        mecanismo: "Inibição altamente seletiva de COX-2.",
        efeitos: ["Analgesia", "Ação anti-inflamatória"],
        usos: ["Inflamação", "Dor"],
        adversos: ["Risco cardiovascular"],
        alertas: ["Menor toxicidade gástrica no material", "Coxibe + cardiopatia → atenção ao risco cardiovascular"],
        dica: "Coxibe = COX-2 seletiva + risco cardiovascular."
      }
    )
  );

  const corticoidShared = {
    grupo: "Corticoides",
    classe: "Anti-inflamatório esteroidal",
    acao: "Modulação gênica via receptor intracelular",
    receptores: ["Receptor intracelular"],
    mecanismo: "Corticoide → receptor intracelular → núcleo → alteração da transcrição gênica → aumento de anexina 1/lipocortina → redução de fosfolipase A2 → redução de ácido araquidônico e de prostaglandinas, tromboxanos e leucotrienos.",
    efeitos: ["Ação anti-inflamatória", "Imunossupressão"],
    usos: ["Terapias anti-inflamatórias"],
    adversos: ["Hiperglicemia/diabetes", "Fraqueza/atrofia muscular", "Osteoporose", "Redistribuição de gordura", "Infecções", "Hipertensão", "Glaucoma", "Catarata", "Redução da cicatrização", "Supressão do eixo HPA"],
    alertas: ["Uso crônico não deve ser interrompido abruptamente", "Retirada brusca após uso prolongado pode provocar insuficiência/crise adrenal"],
    dica: "Corticoide = receptor intracelular → núcleo → anexina 1 → ↓ fosfolipase A2."
  };

  unit3.push.apply(
    unit3,
    make(
      ["Hidrocortisona", "Dexametasona", "Betametasona", "Prednisona", "Prednisolona"],
      corticoidShared,
      {
        "Hidrocortisona": {
          usos: ["Referência de corticoide esteroidal"],
          dica: "Hidrocortisona = relacionada ao cortisol fisiológico; menor potência anti-inflamatória que corticoides mais potentes."
        },
        "Dexametasona": {
          usos: ["Controle de inflamação intensa"],
          dica: "Dexametasona = potente ação anti-inflamatória/imunossupressora."
        },
        "Betametasona": {
          usos: ["Tratamentos anti-inflamatórios"],
          dica: "Betametasona = potente anti-inflamatório."
        },
        "Prednisona": {
          usos: ["Terapias inflamatórias"],
          dica: "Prednisona: não retirar abruptamente após uso prolongado."
        },
        "Prednisolona": {
          usos: ["Terapias inflamatórias"],
          dica: "Prednisolona: não retirar abruptamente após uso prolongado."
        }
      }
    )
  );

  unit3.push.apply(
    unit3,
    make(
      ["Penicilina G", "Penicilina V", "Amoxicilina", "Ampicilina"],
      {
        grupo: "Antimicrobianos",
        classe: "Penicilinas",
        acao: "Bactericida",
        receptores: ["Parede celular"],
        mecanismo: "Bloqueiam a síntese do peptidoglicano da parede celular.",
        efeitos: ["Morte bacteriana"],
        usos: ["Antimicrobiano com alvo em parede celular"],
        adversos: [],
        alertas: [],
        dica: "Penicilinas = parede celular + bactericidas."
      }
    )
  );

  unit3.push.apply(
    unit3,
    make(
      ["Cefalexina", "Cefuroxima", "Ceftriaxona", "Cefepima"],
      {
        grupo: "Antimicrobianos",
        classe: "Cefalosporinas",
        acao: "Bloqueio da parede celular",
        receptores: ["Parede celular"],
        mecanismo: "Bloqueiam a parede celular bacteriana.",
        efeitos: ["Ação antimicrobiana por bloqueio de parede"],
        usos: ["Antimicrobiano beta-lactâmico"],
        adversos: [],
        alertas: [],
        dica: "Cefalosporinas: o material destaca 4 gerações e progressão geral para maior ação Gram−."
      }
    )
  );

  unit3.push.apply(
    unit3,
    make(
      ["Imipeném"],
      {
        grupo: "Antimicrobianos",
        classe: "Carbapenemos",
        acao: "Bloqueio da parede celular",
        receptores: ["Parede celular"],
        mecanismo: "Bloqueia a parede celular bacteriana.",
        efeitos: ["Ação antimicrobiana por bloqueio de parede"],
        usos: ["Infecções graves/resistentes"],
        adversos: [],
        alertas: [],
        dica: "Carbapenemo no material = parede celular + infecções graves/resistentes."
      }
    )
  );

  unit3.push.apply(
    unit3,
    make(
      ["Aztreonam"],
      {
        grupo: "Antimicrobianos",
        classe: "Monobactâmicos",
        acao: "Bloqueio da parede celular",
        receptores: ["Parede celular"],
        mecanismo: "Bloqueia a parede celular bacteriana.",
        efeitos: ["Ação antimicrobiana por bloqueio de parede"],
        usos: ["Infecções específicas", "Espectro estreito"],
        adversos: [],
        alertas: [],
        dica: "Aztreonam = monobactâmico + parede celular + espectro estreito."
      }
    )
  );

  unit3.push.apply(
    unit3,
    make(
      ["Vancomicina"],
      {
        grupo: "Antimicrobianos",
        classe: "Glicopeptídeos",
        acao: "Bactericida",
        receptores: ["Parede celular"],
        mecanismo: "Bloqueia a síntese de peptidoglicano.",
        efeitos: ["Morte bacteriana"],
        usos: ["Antimicrobiano com alvo em parede celular"],
        adversos: [],
        alertas: [],
        dica: "Vancomicina = glicopeptídeo + parede celular + bactericida."
      }
    )
  );

  unit3.push.apply(
    unit3,
    make(
      ["Polimixina B", "Colistina"],
      {
        grupo: "Antimicrobianos",
        classe: "Polimixinas",
        acao: "Desestabilização de membrana",
        receptores: ["Membrana bacteriana"],
        mecanismo: "Formam poros e desestabilizam a membrana bacteriana.",
        efeitos: ["Dano de membrana bacteriana"],
        usos: ["Gram− multirresistentes"],
        adversos: [],
        alertas: [],
        dica: "Polimixinas = membrana + Gram− multirresistentes."
      }
    )
  );

  const quinoloneShared = {
    grupo: "Antimicrobianos",
    classe: "Quinolonas",
    acao: "Inibição de DNA girase/topoisomerases",
    receptores: ["DNA girase/topoisomerases"],
    mecanismo: "Inibem DNA girase/topoisomerases.",
    efeitos: ["Interferência na replicação do DNA bacteriano"],
    usos: ["Antimicrobiano da classe das quinolonas"],
    adversos: ["Tendinite", "Ruptura de tendão"],
    alertas: ["O material destaca toxicidade envolvendo especialmente o tendão de Aquiles"],
    dica: "Quinolona + tendão = tendinite/ruptura."
  };

  unit3.push.apply(
    unit3,
    make(
      ["Ácido nalidíxico", "Norfloxacino", "Ciprofloxacino", "Levofloxacino", "Moxifloxacino", "Gatifloxacino"],
      quinoloneShared,
      {
        "Ácido nalidíxico": { usos: ["1ª geração: Gram− urinárias"] },
        "Norfloxacino": { usos: ["2ª geração: Gram− ampliado"] },
        "Ciprofloxacino": { usos: ["2ª geração: Gram− ampliado"] },
        "Levofloxacino": { usos: ["3ª geração: Gram+ e Gram−"] },
        "Moxifloxacino": { usos: ["4ª geração: amplo espectro + anaeróbios"] },
        "Gatifloxacino": { usos: ["4ª geração: amplo espectro + anaeróbios"] }
      }
    )
  );

  unit3.push.apply(
    unit3,
    make(
      ["Eritromicina", "Azitromicina", "Claritromicina"],
      {
        grupo: "Antimicrobianos",
        classe: "Macrolídeos",
        acao: "Bacteriostático",
        receptores: ["50S"],
        mecanismo: "Bloqueiam a translocação no ribossomo 50S.",
        efeitos: ["Inibição da síntese proteica bacteriana"],
        usos: ["Antimicrobiano inibidor de ribossomo"],
        adversos: [],
        alertas: [],
        dica: "Macrolídeo = 50S + bacteriostático."
      }
    )
  );

  unit3.push(
    {
      id: "cloranfenicol",
      nome: "Cloranfenicol",
      principioAtivo: "Cloranfenicol",
      grupo: "Antimicrobianos",
      classe: "Cloranfenicol",
      acao: "Bacteriostático",
      receptores: ["50S"],
      mecanismo: "Inibe a peptidiltransferase no ribossomo 50S.",
      efeitos: ["Inibição da síntese proteica bacteriana"],
      usos: ["Antimicrobiano inibidor de ribossomo"],
      adversos: ["Mielotoxicidade"],
      alertas: [],
      dica: "Cloranfenicol = 50S + mielotoxicidade.",
      fonte: SOURCE
    }
  );

  unit3.push.apply(
    unit3,
    make(
      ["Tetraciclina", "Doxiciclina", "Minociclina"],
      {
        grupo: "Antimicrobianos",
        classe: "Tetraciclinas",
        acao: "Bacteriostático",
        receptores: ["30S"],
        mecanismo: "Impedem a ligação do aminoacil-tRNA ao ribossomo 30S.",
        efeitos: ["Inibição da síntese proteica bacteriana"],
        usos: ["Antimicrobiano inibidor de ribossomo"],
        adversos: [],
        alertas: ["Evitar em gestantes e menores de 8 anos, conforme o material"],
        dica: "Tetraciclina = 30S + evitar em gestantes/<8 anos."
      }
    )
  );

  unit3.push.apply(
    unit3,
    make(
      ["Gentamicina", "Amicacina", "Tobramicina", "Estreptomicina"],
      {
        grupo: "Antimicrobianos",
        classe: "Aminoglicosídeos",
        acao: "Bactericida",
        receptores: ["30S"],
        mecanismo: "Provocam leitura errada do mRNA no ribossomo 30S.",
        efeitos: ["Inibição da síntese proteica bacteriana", "Ação bactericida"],
        usos: ["Antimicrobiano inibidor de ribossomo"],
        adversos: ["Nefrotoxicidade", "Ototoxicidade"],
        alertas: ["O material destaca que são o grupo bactericida entre os inibidores de ribossomo apresentados"],
        dica: "Aminoglicosídeo = 30S + CIDA + nefro/ototoxicidade."
      }
    )
  );

  unit3.push(
    {
      id: "sulfametoxazol",
      nome: "Sulfametoxazol",
      principioAtivo: "Sulfametoxazol",
      grupo: "Antimicrobianos",
      classe: "Sulfonamidas",
      acao: "Bacteriostático",
      receptores: ["Ácido fólico"],
      mecanismo: "Compete com PABA na via do ácido fólico.",
      efeitos: ["Interferência na síntese de folato bacteriano"],
      usos: ["Antimicrobiano da via do folato"],
      adversos: [],
      alertas: [],
      dica: "Sulfonamida = ácido fólico + compete com PABA.",
      fonte: SOURCE
    },
    {
      id: "trimetoprim",
      nome: "Trimetoprim",
      principioAtivo: "Trimetoprim",
      grupo: "Antimicrobianos",
      classe: "Inibidor da via do folato",
      acao: "Inibição de di-hidrofolato redutase",
      receptores: ["Ácido fólico"],
      mecanismo: "Inibe a di-hidrofolato redutase.",
      efeitos: ["Interferência na síntese de folato bacteriano"],
      usos: ["Associado ao sulfametoxazol"],
      adversos: [],
      alertas: [],
      dica: "Trimetoprim = di-hidrofolato redutase; lembrar associação com sulfametoxazol.",
      fonte: SOURCE
    },
    {
      id: "bactrim",
      nome: "Bactrim",
      principioAtivo: "Sulfametoxazol + trimetoprim",
      grupo: "Antimicrobianos",
      classe: "Associação na via do folato",
      acao: "Bloqueio sequencial da via do folato",
      receptores: ["Ácido fólico"],
      mecanismo: "Bloqueio sequencial da via do folato pela associação sulfametoxazol + trimetoprim.",
      efeitos: ["Sinergismo"],
      usos: ["Associação antimicrobiana"],
      adversos: [],
      alertas: [],
      dica: "Bactrim = sulfametoxazol + trimetoprim = bloqueio sequencial + sinergismo.",
      fonte: SOURCE
    }
  );

  const h1First = {
    grupo: "Anti-histamínicos",
    classe: "Anti-H1 de 1ª geração",
    acao: "Antagonismo competitivo de H1",
    receptores: ["H1"],
    mecanismo: "Antagonismo competitivo de H1; o material destaca maior penetração no SNC.",
    efeitos: ["Sedação/sonolência"],
    usos: ["Processos alérgicos"],
    adversos: ["Sedação"],
    alertas: ["1ª geração = H1 + SNC = sono"],
    dica: "Anti-H1 de 1ª geração = maior sedação."
  };

  unit3.push.apply(
    unit3,
    make(
      ["Prometazina", "Dimenidrinato", "Difenidramina", "Clorfeniramina", "Meclizina"],
      h1First,
      {
        "Prometazina": { usos: ["Alergias", "Sedação", "Antiemético"], efeitos: ["Sedação intensa"] },
        "Dimenidrinato": { usos: ["Cinetose/enjoo"], efeitos: ["Sedação", "Efeito antiemético"] },
        "Difenidramina": { usos: ["Alergia", "Insônia", "Antiemético"], efeitos: ["Sedação"] },
        "Clorfeniramina": { usos: ["Rinite", "Urticária"], efeitos: ["Sedação moderada"] },
        "Meclizina": { usos: ["Vertigem", "Cinetose"], efeitos: ["Sedação leve"] }
      }
    )
  );

  unit3.push.apply(
    unit3,
    make(
      ["Loratadina", "Desloratadina", "Fexofenadina", "Cetirizina", "Bilastina"],
      {
        grupo: "Anti-histamínicos",
        classe: "Anti-H1 de 2ª geração",
        acao: "Antagonismo competitivo de H1",
        receptores: ["H1"],
        mecanismo: "Antagonismo competitivo de H1; o material destaca menor penetração no SNC.",
        efeitos: ["Menor sedação", "Ação mais periférica"],
        usos: ["Processos alérgicos"],
        adversos: ["Menor sedação em comparação à 1ª geração"],
        alertas: [],
        dica: "H1 2ª geração = menos sedação."
      }
    )
  );

  const h2Shared = {
    grupo: "Anti-histamínicos",
    classe: "Anti-H2",
    acao: "Bloqueio de H2",
    receptores: ["H2"],
    mecanismo: "Bloqueiam H2 da célula parietal gástrica, reduzindo AMPc e a atividade da bomba H+/K+-ATPase, diminuindo a secreção de HCl.",
    efeitos: ["Redução da secreção de HCl"],
    usos: ["Condições relacionadas à secreção ácida gástrica"],
    adversos: [],
    alertas: [],
    dica: "Anti-H2 = H2 → ↓ HCl."
  };

  unit3.push.apply(
    unit3,
    make(
      ["Cimetidina", "Ranitidina", "Famotidina", "Nizatidina"],
      h2Shared,
      {
        "Cimetidina": {
          usos: ["Gastrite", "Úlcera", "Refluxo"],
          alertas: ["Inibe CYP450 → muitas interações medicamentosas"],
          dica: "Cimetidina = H2 + inibe CYP450."
        },
        "Ranitidina": { usos: ["Úlcera", "Refluxo"], dica: "Ranitidina = bloqueador H2 no material." },
        "Famotidina": { usos: ["Gastrite", "Úlcera"], dica: "Famotidina = menos interações que cimetidina, segundo o material." },
        "Nizatidina": { usos: ["Úlcera", "Refluxo"], dica: "Nizatidina = bloqueador H2 no material." }
      }
    )
  );

  unit3.push.apply(
    unit3,
    make(
      ["Cromolim", "Nedocromil"],
      {
        grupo: "Antialérgicos",
        classe: "Estabilizadores relacionados a mastócitos/basófilos",
        acao: "Redução da liberação de histamina",
        receptores: ["Mastócitos/basófilos"],
        mecanismo: "Não bloqueiam H1; o material descreve redução da liberação de histamina por mastócitos/basófilos.",
        efeitos: ["Redução profilática de mediadores alérgicos"],
        usos: ["Profilaxia em processos alérgicos respiratórios"],
        adversos: [],
        alertas: ["Não confundir com anti-histamínicos H1 clássicos"],
        dica: "Cromolim/nedocromil: não são anti-H1; reduzem liberação de histamina."
      }
    )
  );

  unit3.push(
    {
      id: "montelucaste",
      nome: "Montelucaste",
      principioAtivo: "Montelucaste",
      grupo: "Eicosanoides",
      classe: "Fármaco da via dos leucotrienos",
      acao: "Atuação na via dos leucotrienos",
      receptores: ["Via dos leucotrienos"],
      mecanismo: "O material informa atuação sobre a via dos leucotrienos.",
      efeitos: ["Controle da resposta relacionada a leucotrienos"],
      usos: ["Controle da asma crônica"],
      adversos: [],
      alertas: [],
      dica: "Leucotrienos = broncoconstrição/asma; montelucaste = controle da asma crônica.",
      fonte: SOURCE
    },
    {
      id: "misoprostol",
      nome: "Misoprostol",
      principioAtivo: "Misoprostol",
      grupo: "Eicosanoides",
      classe: "Análogo de PGE",
      acao: "Análogo de prostaglandina",
      receptores: ["PGE"],
      mecanismo: "Análogo de PGE conforme o material.",
      efeitos: ["Proteção gástrica", "Ação uterotônica"],
      usos: ["Proteção gástrica"],
      adversos: [],
      alertas: ["O material destaca também ação uterotônica"],
      dica: "Misoprostol = análogo de PGE + proteção gástrica.",
      fonte: SOURCE
    },
    {
      id: "alprostadil",
      nome: "Alprostadil",
      principioAtivo: "Alprostadil",
      grupo: "Eicosanoides",
      classe: "PGE1",
      acao: "Análogo/ação relacionada a PGE1",
      receptores: ["PGE1"],
      mecanismo: "O material relaciona alprostadil a PGE1.",
      efeitos: ["Vasodilatação"],
      usos: ["Uso intracavernoso para disfunção erétil"],
      adversos: [],
      alertas: [],
      dica: "Alprostadil = PGE1 + vasodilatação.",
      fonte: SOURCE
    }
  );

  const localBase = {
    grupo: "Anestésicos locais",
    acao: "Bloqueio de canais de Na+ voltagem-dependentes",
    receptores: ["Nav"],
    mecanismo: "Bloqueia canais de Na+ voltagem-dependentes (Nav) → reduz influxo de Na+ → impede despolarização, potencial de ação e propagação do estímulo.",
    efeitos: ["Bloqueio regional e reversível da sensibilidade"],
    usos: ["Anestesia local"],
    adversos: [],
    alertas: ["Em tecido inflamado, o pH mais ácido aumenta a fração ionizada fora da célula, reduz a passagem pela membrana e diminui a eficácia", "Vasoconstritor associado pode aumentar duração e reduzir absorção sistêmica; o material alerta para cuidado em hipertensos/cardiopatas"],
    dica: "Anestésico local = bloqueia Nav."
  };

  unit3.push.apply(
    unit3,
    make(
      ["Cocaína", "Procaína", "Tetracaína", "Benzocaína"],
      Object.assign({}, localBase, {
        classe: "Anestésico local — Éster",
        alertas: localBase.alertas.concat(["Éster → metabolismo no plasma → PABA → maior alergia/anafilaxia"])
      }),
      {
        "Cocaína": { efeitos: ["Anestesia local"], adversos: ["Cardiotoxicidade", "Dependência"], dica: "Cocaína = éster; protótipo; cardiotoxicidade/dependência; duração moderada." },
        "Procaína": { adversos: ["Alta alergenicidade"], dica: "Procaína = éster + alta alergenicidade + duração curta." },
        "Tetracaína": { usos: ["Uso tópico", "Raquidiana"], dica: "Tetracaína = éster de longa duração; tópica e raquidiana." },
        "Benzocaína": { adversos: ["Metemoglobinemia"], dica: "Benzocaína = éster + metemoglobinemia + duração curta." }
      }
    )
  );

  unit3.push.apply(
    unit3,
    make(
      ["Lidocaína", "Bupivacaína", "Levobupivacaína", "Ropivacaína", "Mepivacaína", "Prilocaína"],
      Object.assign({}, localBase, {
        classe: "Anestésico local — Amida",
        alertas: localBase.alertas.concat(["Amida → metabolismo no fígado; hepatopatia é cuidado especial no material"])
      }),
      {
        "Lidocaína": { usos: ["Anestesia local", "Antiarrítmico classe IB IV"], dica: "Lidocaína = amida muito utilizada + antiarrítmico classe IB IV; duração moderada." },
        "Bupivacaína": { adversos: ["Maior cardiotoxicidade"], dica: "Bupivacaína = amida de longa duração + maior cardiotoxicidade." },
        "Levobupivacaína": { adversos: ["Menor cardiotoxicidade que bupivacaína"], dica: "Levobupivacaína = longa duração + menor cardiotoxicidade que bupivacaína." },
        "Ropivacaína": { usos: ["Anestesia local", "Peridural"], dica: "Ropivacaína = longa duração + perfil cardíaco mais seguro; peridural." },
        "Mepivacaína": { usos: ["Odontologia"], dica: "Mepivacaína = amida de duração moderada + odontologia." },
        "Prilocaína": { adversos: ["Metemoglobinemia em doses altas"], dica: "Prilocaína = amida + metemoglobinemia em doses altas." }
      }
    )
  );

  window.CortexFarmacos.forEach(function (drug) {
    if (!drug.principioAtivo) {
      drug.principioAtivo = drug.nome;
    }
  });

  unit3.forEach(function (incoming) {
    const existing = window.CortexFarmacos.find(function (drug) {
      return drug.id === incoming.id;
    });

    if (existing) {
      Object.assign(existing, incoming);
    } else {
      window.CortexFarmacos.push(incoming);
    }
  });

})();


/*
 * Normalizacao colinergica — remove categorias genericas duplicadas.
 * Receptores muscarinicos ficam em M1-M5; nicotinicos em Nn/Nm.
 * Inibidores indiretos sao ligados ao alvo enzimatico AChE/BChE,
 * em vez de serem apresentados como ligantes diretos de receptores.
 */
(function () {
  "use strict";

  delete window.CortexReceptores.Muscarinicos;
  delete window.CortexReceptores.Nicotinicos;

  Object.assign(window.CortexReceptores, {
    "M4": {
      familia: "Muscarinico",
      via: "Gi/o",
      resumo: "Predomina no SNC, especialmente em circuitos do cortex e ganglios da base. Reduz adenilato ciclase e AMPc quando ativado."
    },
    "M5": {
      familia: "Muscarinico",
      via: "Gq/11",
      resumo: "Receptor muscarinico predominantemente central, encontrado entre outras regioes em substantia nigra e area tegmental ventral; ativa a via PLC/IP3-DAG."
    },
    "AChE": {
      familia: "Enzima colinergica",
      via: "Degradacao da acetilcolina",
      resumo: "Acetilcolinesterase. Sua inibicao aumenta a disponibilidade de acetilcolina nas sinapses e na juncao neuromuscular."
    },
    "BChE": {
      familia: "Enzima colinergica",
      via: "Hidrolise de colina-esteres",
      resumo: "Butirilcolinesterase. Alvo adicional relevante de alguns inibidores de colinesterase, especialmente rivastigmina."
    }
  });

  function updateDrug(id, changes) {
    const drug = window.CortexFarmacos.find(function (item) {
      return item.id === id;
    });

    if (drug) {
      Object.assign(drug, changes);
    }
  }

  // Agonistas diretos nao seletivos / amplos.
  updateDrug("acetilcolina", {
    receptores: ["M1", "M2", "M3", "M4", "M5", "Nn", "Nm"],
    mecanismo: "Agonista colinergico endogeno: ativa receptores muscarinicos M1-M5 e nicotinicos Nn/Nm."
  });

  updateDrug("carbacol", {
    receptores: ["M1", "M2", "M3", "M4", "M5", "Nn", "Nm"],
    mecanismo: "Agonista colinergico direto com atividade muscarinica e nicotinica; ativa receptores M1-M5 e Nn/Nm.",
    dica: "Carbacol = agonista direto muscarinico + nicotinico; no olho promove miose e reduz a pressao intraocular."
  });

  updateDrug("betanecol", {
    receptores: ["M1", "M2", "M3", "M4", "M5"],
    mecanismo: "Agonista colinergico direto seletivo para a familia muscarinica, com atividade em M1-M5 e efeito clinico especialmente importante em M3 no detrusor e musculo liso."
  });

  updateDrug("pilocarpina", {
    receptores: ["M1", "M2", "M3", "M4", "M5"],
    mecanismo: "Agonista muscarinico direto com atividade nos subtipos M1-M5; seus efeitos glandulares e oculares sao especialmente importantes."
  });

  updateDrug("metacolina", {
    receptores: ["M1", "M2", "M3", "M4", "M5"],
    mecanismo: "Agonista colinergico direto predominantemente muscarinico; a broncoconstricao usada no teste de provocacao ocorre principalmente por receptores muscarinicos das vias aereas."
  });

  // Antimuscarinicos nao seletivos que possuem afinidade por M1-M5.
  updateDrug("atropina", {
    receptores: ["M1", "M2", "M3", "M4", "M5"],
    mecanismo: "Antagonista competitivo nao seletivo dos receptores muscarinicos M1-M5."
  });

  updateDrug("escopolamina", {
    receptores: ["M1", "M2", "M3", "M4", "M5"],
    mecanismo: "Antagonista muscarinico nao seletivo com atividade nos subtipos M1-M5 e importante penetracao no SNC."
  });

  updateDrug("ipratropio", {
    receptores: ["M1", "M2", "M3", "M4", "M5"],
    mecanismo: "Antagonista muscarinico competitivo com afinidade pelos subtipos M1-M5; a broncodilatacao decorre principalmente do bloqueio de M3 nas vias aereas."
  });

  updateDrug("tiotropio", {
    receptores: ["M1", "M2", "M3", "M4", "M5"],
    mecanismo: "Antagonista muscarinico de longa acao com afinidade por M1-M5 e dissociacao mais lenta de M1/M3 que de M2; o efeito broncodilatador e principalmente M3."
  });

  updateDrug("oxibutinina", {
    receptores: ["M1", "M2", "M3", "M4", "M5"],
    mecanismo: "Antagonista muscarinico com afinidade pelos subtipos M1-M5; o efeito terapeutico na bexiga e predominantemente relacionado ao bloqueio de M3."
  });

  // Inibidores de colinesterase: alvo direto = enzima, nao receptor M/N.
  updateDrug("neostigmina", {
    receptores: ["AChE"],
    mecanismo: "Inibe reversivelmente a acetilcolinesterase (AChE), elevando acetilcolina na sinapse. Os efeitos muscarinicos e nicotinicos sao indiretos.",
    dica: "Neostigmina = inibe AChE; aumenta ACh e melhora transmissao neuromuscular."
  });

  updateDrug("piridostigmina", {
    receptores: ["AChE"],
    mecanismo: "Inibe reversivelmente a acetilcolinesterase (AChE), aumentando acetilcolina; os efeitos em receptores muscarinicos e nicotinicos sao indiretos.",
    dica: "Piridostigmina = AChE; efeito colinergico indireto."
  });

  updateDrug("edrofonio", {
    receptores: ["AChE"],
    mecanismo: "Inibidor reversivel e de curta duracao da acetilcolinesterase (AChE); aumenta acetilcolina nos locais de transmissao colinergica.",
    dica: "Edrofonio = AChE, acao curta e efeito colinergico indireto."
  });

  updateDrug("donepezila", {
    receptores: ["AChE"],
    mecanismo: "Inibe reversivelmente a acetilcolinesterase (AChE), aumentando a disponibilidade sinaptica de acetilcolina no SNC.",
    dica: "Donepezila = AChE; Alzheimer."
  });

  updateDrug("galantamina", {
    receptores: ["AChE", "Nn"],
    mecanismo: "Inibe reversivelmente a acetilcolinesterase (AChE) e apresenta modulacao alosterica positiva de receptores nicotinicos neuronais.",
    dica: "Galantamina = AChE + modulacao nicotinica neuronal; Alzheimer."
  });

  updateDrug("rivastigmina", {
    receptores: ["AChE", "BChE"],
    mecanismo: "Inibe acetilcolinesterase (AChE) e butirilcolinesterase (BChE), aumentando a disponibilidade de acetilcolina no SNC.",
    dica: "Rivastigmina = AChE + BChE; Alzheimer e demencia associada a Parkinson."
  });

  updateDrug("fisostigmina", {
    receptores: ["AChE", "BChE"],
    mecanismo: "Inibidor de colinesterases com acao central; aumenta acetilcolina e pode reverter intoxicacao por antimuscarinicos.",
    dica: "Fisostigmina = inibidor de colinesterase com acesso ao SNC; antidoto em intoxicacao antimuscarinica."
  });
})();


/*
 * CORTEX ANESTESICOS GERAIS HAGGI V1
 *
 * Base da unidade: PDF "AnestesicosGerais" (HAGGI).
 * Efeitos, caracteristicas e indicacoes preservam o material.
 * Receptores/alvos e mecanismos ausentes no PDF recebem
 * complemento farmacodinamico para manter o padrao do Cortex.
 */
(function () {
  "use strict";

  const SOURCE =
    "Anestésicos Gerais — HAGGI; alvos/mecanismos complementados por farmacologia de referência";


  Object.assign(
    window.CortexReceptores,
    {
      "NMDA": {
        familia:
          "Glutamatérgico",
        via:
          "Canal catiônico",
        resumo:
          "Receptor ionotrópico de glutamato. Seu bloqueio reduz transmissão excitatória; é alvo central da cetamina e participa da ação anestésica do óxido nitroso."
      },

      "μ (MOR)": {
        familia:
          "Opioide",
        via:
          "Gi/o",
        resumo:
          "Receptor opioide μ. Sua ativação reduz adenilato ciclase, diminui entrada de Ca2+ pré-sináptica e favorece saída de K+, reduzindo transmissão nociceptiva."
      },

      "K2P": {
        familia:
          "Canal de K+",
        via:
          "Corrente de vazamento de K+",
        resumo:
          "Família de canais de potássio de dois poros. Anestésicos voláteis podem aumentar correntes de K+ e reduzir excitabilidade neuronal; o efeito anestésico é multifatorial."
      }
    }
  );


  const anestesicos =
    [
      {
        id:
          "oxido-nitroso",

        nome:
          "Óxido Nitroso",

        principioAtivo:
          "Óxido nitroso (N₂O)",

        grupo:
          "Anestésicos gerais",

        classe:
          "Anestésico inalatório gasoso",

        acao:
          "Antagonismo NMDA / modulação central",

        receptores:
          [
            "NMDA",
            "GABA-A"
          ],

        mecanismo:
          "O material descreve analgesia e anestesia de baixa potência. Como complemento farmacodinâmico, o efeito anestésico envolve principalmente inibição não competitiva de receptores NMDA; ações ansiolíticas também envolvem GABA-A.",

        efeitos:
          [
            "Analgesia",
            "Anestesia de baixa potência",
            "Euforia",
            "Pouca depressão respiratória"
          ],

        usos:
          [
            "Anestesia, geralmente associado a outros agentes"
          ],

        adversos:
          [
            "Mielotoxicidade em uso prolongado"
          ],

        alertas:
          [
            "Baixa potência anestésica quando usado isoladamente"
          ],

        dica:
          "Óxido nitroso = baixa potência + analgesia + NMDA.",

        fonte:
          SOURCE
      },

      {
        id:
          "eter",

        nome:
          "Éter",

        principioAtivo:
          "Éter dietílico",

        grupo:
          "Anestésicos gerais",

        classe:
          "Anestésico inalatório volátil",

        acao:
          "Depressão multifatorial do SNC",

        receptores:
          [
            "GABA-A",
            "K2P"
          ],

        mecanismo:
          "Anestésico volátil com ação multifatorial no SNC. Como complemento farmacodinâmico, anestésicos voláteis potencializam vias inibitórias como GABA-A e modulam canais de K+; o material o descreve como anestésico inalatório potente.",

        efeitos:
          [
            "Anestesia inalatória potente"
          ],

        usos:
          [
            "Obsoleto"
          ],

        adversos:
          [
            "Irritação das vias respiratórias",
            "Sobrecarga cardíaca",
            "Muito explosivo"
          ],

        alertas:
          [
            "Agente obsoleto no material"
          ],

        dica:
          "Éter = potente, irritante e explosivo; lembrar que é obsoleto.",

        fonte:
          SOURCE
      },

      {
        id:
          "halotano",

        nome:
          "Halotano",

        principioAtivo:
          "Halotano",

        grupo:
          "Anestésicos gerais",

        classe:
          "Anestésico inalatório halogenado",

        acao:
          "Depressão multifatorial do SNC",

        receptores:
          [
            "GABA-A",
            "K2P"
          ],

        mecanismo:
          "Anestésico volátil halogenado. Como complemento farmacodinâmico, sua ação anestésica é multifatorial, com facilitação de transmissão inibitória e modulação de canais iônicos como GABA-A e K2P.",

        efeitos:
          [
            "Anestesia inalatória potente"
          ],

        usos:
          [
            "Anestesia cirúrgica"
          ],

        adversos:
          [
            "Hepatotoxicidade",
            "Hipotensão",
            "Depressão respiratória",
            "Extrassístoles"
          ],

        alertas:
          [
            "Hepatotoxicidade é destaque no material"
          ],

        dica:
          "Halotano = anestesia potente + fígado + hipotensão + arritmia.",

        fonte:
          SOURCE
      },

      {
        id:
          "sevoflurano",

        nome:
          "Sevoflurano",

        principioAtivo:
          "Sevoflurano",

        grupo:
          "Anestésicos gerais",

        classe:
          "Anestésico inalatório halogenado",

        acao:
          "Depressão multifatorial do SNC",

        receptores:
          [
            "GABA-A",
            "K2P"
          ],

        mecanismo:
          "Anestésico volátil halogenado de ação multifatorial. Como complemento farmacodinâmico, potencializa transmissão inibitória e modula canais iônicos; o material destaca indução e recuperação rápidas.",

        efeitos:
          [
            "Indução rápida",
            "Recuperação rápida",
            "Pouca irritação das vias respiratórias"
          ],

        usos:
          [
            "Anestesia cirúrgica"
          ],

        adversos:
          [],

        alertas:
          [
            "No material, o principal destaque é a baixa irritação das vias respiratórias"
          ],

        dica:
          "Sevoflurano = entra rápido, sai rápido e irrita pouco a via aérea.",

        fonte:
          SOURCE
      },

      {
        id:
          "isoflurano",

        nome:
          "Isoflurano",

        principioAtivo:
          "Isoflurano",

        grupo:
          "Anestésicos gerais",

        classe:
          "Anestésico inalatório halogenado",

        acao:
          "Depressão multifatorial do SNC",

        receptores:
          [
            "GABA-A",
            "K2P"
          ],

        mecanismo:
          "Anestésico volátil com ação multifatorial em receptores e canais iônicos do SNC. O material destaca redução do tônus arterial e venoso.",

        efeitos:
          [
            "Redução do tônus arterial",
            "Redução do tônus venoso"
          ],

        usos:
          [
            "Anestesia cirúrgica"
          ],

        adversos:
          [
            "Hipotensão",
            "Depressão respiratória",
            "Pode causar isquemia miocárdica"
          ],

        alertas:
          [
            "Atenção à hipotensão e à possível isquemia miocárdica destacadas no material"
          ],

        dica:
          "Isoflurano = reduz tônus vascular → hipotensão.",

        fonte:
          SOURCE
      },

      {
        id:
          "enflurano",

        nome:
          "Enflurano",

        principioAtivo:
          "Enflurano",

        grupo:
          "Anestésicos gerais",

        classe:
          "Anestésico inalatório halogenado",

        acao:
          "Depressão multifatorial do SNC",

        receptores:
          [
            "GABA-A",
            "K2P"
          ],

        mecanismo:
          "Anestésico volátil halogenado com ação multifatorial sobre transmissão inibitória e canais iônicos. O material destaca redução do limiar convulsivo.",

        efeitos:
          [
            "Anestesia geral por via inalatória"
          ],

        usos:
          [
            "Anestesia cirúrgica"
          ],

        adversos:
          [
            "Diminui o limiar convulsivo",
            "Depressão respiratória"
          ],

        alertas:
          [
            "Limiar convulsivo reduzido é o ponto-chave do material"
          ],

        dica:
          "Enflurano = lembre convulsão: diminui o limiar convulsivo.",

        fonte:
          SOURCE
      },

      {
        id:
          "tiopental",

        nome:
          "Tiopental",

        principioAtivo:
          "Tiopental",

        grupo:
          "Anestésicos gerais",

        classe:
          "Barbitúrico intravenoso",

        acao:
          "Modulador positivo de GABA-A",

        receptores:
          [
            "GABA-A"
          ],

        mecanismo:
          "Barbitúrico que potencializa a neurotransmissão inibitória mediada por GABA-A, aumentando a atividade do canal de Cl−. O material destaca indução muito rápida de inconsciência.",

        efeitos:
          [
            "Indução muito rápida de inconsciência",
            "Alta lipossolubilidade"
          ],

        usos:
          [
            "Indução da anestesia"
          ],

        adversos:
          [
            "Eliminação lenta",
            "Janela terapêutica estreita"
          ],

        alertas:
          [
            "Janela terapêutica estreita"
          ],

        dica:
          "Tiopental = barbitúrico GABA-A + indução muito rápida.",

        fonte:
          SOURCE
      },

      {
        id:
          "midazolam",

        nome:
          "Midazolam",

        principioAtivo:
          "Midazolam",

        grupo:
          "Anestésicos gerais",

        classe:
          "Benzodiazepínico",

        acao:
          "Modulador alostérico positivo de GABA-A",

        receptores:
          [
            "GABA-A"
          ],

        mecanismo:
          "Potencializa GABA, como indicado no material. Liga-se ao sítio benzodiazepínico do receptor GABA-A e aumenta a frequência de abertura do canal de Cl− em resposta ao GABA.",

        efeitos:
          [
            "Sedação",
            "Amnésia",
            "Ansiólise"
          ],

        usos:
          [
            "Adjuvante na anestesia equilibrada"
          ],

        adversos:
          [],

        alertas:
          [],

        dica:
          "Midazolam = benzodiazepínico → GABA-A → sedação + amnésia + ansiólise.",

        fonte:
          SOURCE
      },

      {
        id:
          "etomidato",

        nome:
          "Etomidato",

        principioAtivo:
          "Etomidato",

        grupo:
          "Anestésicos gerais",

        classe:
          "Anestésico intravenoso imidazólico",

        acao:
          "Modulador positivo de GABA-A",

        receptores:
          [
            "GABA-A"
          ],

        mecanismo:
          "Anestésico intravenoso que modula positivamente receptores GABA-A, aumentando a ação inibitória do GABA. O material destaca metabolização rápida e ausência de descarga adrenérgica.",

        efeitos:
          [
            "Anestesia intravenosa",
            "Rápida metabolização",
            "Boa janela terapêutica"
          ],

        usos:
          [
            "Anestesia geral"
          ],

        adversos:
          [],

        alertas:
          [
            "O material destaca que não provoca descarga adrenérgica"
          ],

        dica:
          "Etomidato = GABA-A + rápida metabolização + boa janela terapêutica.",

        fonte:
          SOURCE
      },

      {
        id:
          "morfina",

        nome:
          "Morfina",

        principioAtivo:
          "Morfina",

        grupo:
          "Anestésicos gerais",

        classe:
          "Opioide analgésico — adjuvante",

        acao:
          "Agonista opioide",

        receptores:
          [
            "μ (MOR)"
          ],

        mecanismo:
          "O material relaciona a analgesia aos receptores μ. Como complemento farmacodinâmico, a ativação de MOR acoplado a Gi/o reduz adenilato ciclase e transmissão nociceptiva.",

        efeitos:
          [
            "Analgesia"
          ],

        usos:
          [
            "Adjuvante"
          ],

        adversos:
          [],

        alertas:
          [],

        dica:
          "Morfina = receptor μ (MOR) → analgesia.",

        fonte:
          SOURCE
      },

      {
        id:
          "fentanil",

        nome:
          "Fentanil",

        principioAtivo:
          "Fentanil",

        grupo:
          "Anestésicos gerais",

        classe:
          "Opioide sintético — adjuvante",

        acao:
          "Agonista opioide μ",

        receptores:
          [
            "μ (MOR)"
          ],

        mecanismo:
          "O material descreve analgesia potente por receptores μ. Como complemento farmacodinâmico, é agonista predominantemente μ-opioide e reduz transmissão nociceptiva por sinalização Gi/o.",

        efeitos:
          [
            "Analgesia potente",
            "Cerca de 100× mais potente que a morfina, segundo o material"
          ],

        usos:
          [
            "Analgesia em procedimentos curtos"
          ],

        adversos:
          [],

        alertas:
          [],

        dica:
          "Fentanil = μ (MOR) + analgesia muito potente; material: ~100× morfina.",

        fonte:
          SOURCE
      },

      {
        id:
          "propofol",

        nome:
          "Propofol",

        principioAtivo:
          "Propofol",

        grupo:
          "Anestésicos gerais",

        classe:
          "Anestésico intravenoso",

        acao:
          "Potencialização de GABA-A",

        receptores:
          [
            "GABA-A"
          ],

        mecanismo:
          "Anestésico intravenoso cuja ação está fortemente relacionada à potencialização da neurotransmissão GABAérgica por GABA-A. O material destaca indução/manutenção e recuperação rápida.",

        efeitos:
          [
            "Indução rápida",
            "Manutenção da anestesia",
            "Recuperação rápida",
            "Efeito antiemético"
          ],

        usos:
          [
            "Indução e manutenção por infusão"
          ],

        adversos:
          [],

        alertas:
          [],

        dica:
          "Propofol = GABA-A + recuperação rápida + antiemético.",

        fonte:
          SOURCE
      },

      {
        id:
          "cetamina",

        nome:
          "Cetamina",

        principioAtivo:
          "Cetamina",

        grupo:
          "Anestésicos gerais",

        classe:
          "Anestésico dissociativo",

        acao:
          "Antagonista não competitivo de NMDA",

        receptores:
          [
            "NMDA"
          ],

        mecanismo:
          "Bloqueia receptores NMDA de forma não competitiva, produzindo anestesia dissociativa, como indicado no material.",

        efeitos:
          [
            "Anestesia dissociativa",
            "Aumenta descarga simpática",
            "Mantém pressão arterial",
            "Alucinações",
            "Euforia",
            "Dissociação"
          ],

        usos:
          [
            "Anestesia dissociativa"
          ],

        adversos:
          [
            "Alucinações"
          ],

        alertas:
          [
            "O material destaca aumento da descarga simpática e manutenção da pressão arterial"
          ],

        dica:
          "Cetamina = NMDA bloqueado + dissociação + descarga simpática.",

        fonte:
          SOURCE
      }
    ];


  anestesicos.forEach(
    function (
      incoming
    ) {

      const index =
        window.CortexFarmacos
          .findIndex(
            function (
              item
            ) {

              return (
                item.id ===
                incoming.id
              );

            }
          );


      if (
        index >= 0
      ) {

        window.CortexFarmacos[
          index
        ] =
          Object.assign(
            {},
            window.CortexFarmacos[
              index
            ],
            incoming
          );

      }
      else {

        window.CortexFarmacos
          .push(
            incoming
          );

      }

    }
  );

})();
/* CORTEX ANESTESICOS GERAIS HAGGI V1 END */
