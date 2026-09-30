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
    }

  ];

})();