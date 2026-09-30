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