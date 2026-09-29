window.EVOLUCAO_CASES_EXTRA = [

  {
    id: 101,
    category: "Higiene e conforto",
    title: "Banho no leito",
    level: "Basico",
    levelLabel: "Básico",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Acompanhamento",

    patient: "Paciente masculino, 78 anos",

    caseText:
      "Dependente para higiene corporal.\n" +
      "Estado geral: consciente, orientado e colaborativo.\n" +
      "Mobilidade: restrito ao leito.\n" +
      "Pele: íntegra, sem lesões aparentes.\n" +
      "Eliminação: diurese presente em fralda.\n" +
      "Procedimentos realizados: banho no leito, higiene íntima, troca de fralda e roupa de cama.\n" +
      "Após os cuidados: paciente confortável no leito.",

    criteria: [
      {
        id: "banho",
        name: "Registro do banho no leito",
        words: ["banho no leito", "higiene corporal"],
        points: 20
      },
      {
        id: "higiene",
        name: "Higiene intima",
        words: ["higiene intima", "higiene íntima"],
        points: 15
      },
      {
        id: "pele",
        name: "Avaliacao da pele",
        words: ["pele integra", "pele íntegra", "lesao", "lesão"],
        points: 20
      },
      {
        id: "fralda",
        name: "Troca de fralda",
        words: ["fralda"],
        points: 15
      },
      {
        id: "cama",
        name: "Troca de roupa de cama",
        words: ["roupa de cama", "leito"],
        points: 15
      },
      {
        id: "conforto",
        name: "Conforto e posicionamento",
        words: ["confortavel", "confortável", "posicionado"],
        points: 15
      }
    ],

    reference:
      "Realizado banho no leito, higiene corporal e íntima, troca de fralda e roupa de cama. Paciente consciente, orientado e colaborativo durante os cuidados. Pele íntegra, sem lesões aparentes. Diurese presente em fralda. Posicionado confortavelmente no leito."
  },


  {
    id: 102,
    category: "Higiene e conforto",
    title: "Higiene intima e troca de fralda",
    level: "Basico",
    levelLabel: "Básico",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Acompanhamento",

    patient: "Paciente feminina, 81 anos",

    caseText:
      "Paciente acamada.\n" +
      "Eliminação: diurese e evacuação presentes em fralda.\n" +
      "Fezes: pastosas, coloração castanha.\n" +
      "Pele perineal: íntegra, sem hiperemia aparente.\n" +
      "Procedimento: higiene íntima e troca de fralda.\n" +
      "Após cuidados: paciente seca, limpa e confortável.",

    criteria: [
      {
        id: "higiene",
        name: "Higiene intima",
        words: ["higiene intima", "higiene íntima"],
        points: 20
      },
      {
        id: "fralda",
        name: "Troca de fralda",
        words: ["fralda"],
        points: 15
      },
      {
        id: "diurese",
        name: "Registro de diurese",
        words: ["diurese", "urina"],
        points: 15
      },
      {
        id: "evacuacao",
        name: "Registro de evacuacao",
        words: ["evacuacao", "evacuação", "fezes"],
        points: 20
      },
      {
        id: "pele",
        name: "Pele perineal",
        words: ["pele", "perineal", "hiperemia"],
        points: 15
      },
      {
        id: "conforto",
        name: "Conforto",
        words: ["confortavel", "confortável", "posicionada"],
        points: 15
      }
    ],

    reference:
      "Realizada higiene íntima e troca de fralda após diurese e evacuação. Fezes de aspecto pastoso e coloração castanha. Pele perineal íntegra, sem hiperemia aparente. Paciente mantida limpa, seca e confortável."
  },


  {
    id: 103,
    category: "Higiene e conforto",
    title: "Mudanca de decubito",
    level: "Basico",
    levelLabel: "Básico",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Acompanhamento",

    patient: "Paciente masculino, 74 anos",

    caseText:
      "Paciente acamado e dependente para mobilização.\n" +
      "Posição inicial: decúbito dorsal.\n" +
      "Pele sacral: íntegra, sem hiperemia aparente.\n" +
      "Procedimento: mudança para decúbito lateral direito.\n" +
      "Utilizados coxins para posicionamento e alívio de pressão.",

    criteria: [
      {
        id: "mudanca",
        name: "Mudanca de decubito",
        words: ["mudanca de decubito", "mudança de decúbito", "lateral direito"],
        points: 25
      },
      {
        id: "pele",
        name: "Avaliacao da pele",
        words: ["pele", "sacral", "hiperemia"],
        points: 20
      },
      {
        id: "pressao",
        name: "Prevencao de pressao",
        words: ["pressao", "pressão", "coxins", "proeminencias"],
        points: 20
      },
      {
        id: "conforto",
        name: "Conforto",
        words: ["confortavel", "confortável"],
        points: 15
      },
      {
        id: "seguranca",
        name: "Seguranca",
        words: ["grade", "seguranca", "segurança"],
        points: 20
      }
    ],

    reference:
      "Realizada mudança de decúbito de dorsal para lateral direito. Pele sacral avaliada, íntegra e sem hiperemia aparente. Utilizados coxins para posicionamento e alívio de pressão. Paciente mantido confortável e em segurança."
  },


  {
    id: 110,
    category: "Feridas e curativos",
    title: "Troca de curativo cirurgico",
    level: "Intermediario",
    levelLabel: "Intermediário",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Pos-procedimento",

    patient: "Paciente feminina, 53 anos",

    caseText:
      "Ferida: incisão cirúrgica abdominal.\n" +
      "Curativo anterior: pequena quantidade de exsudato seroso.\n" +
      "Bordas: aproximadas.\n" +
      "Sangramento: ausente.\n" +
      "Odor: ausente.\n" +
      "Pele ao redor: sem hiperemia aparente.\n" +
      "Procedimento: retirada do curativo anterior, limpeza e aplicação de nova cobertura conforme rotina.",

    criteria: [
      {
        id: "local",
        name: "Local da ferida",
        words: ["abdominal", "incisao", "incisão"],
        points: 15
      },
      {
        id: "exsudato",
        name: "Exsudato",
        words: ["seroso", "exsudato", "secrecao", "secreção"],
        points: 20
      },
      {
        id: "bordas",
        name: "Bordas",
        words: ["bordas", "aproximadas"],
        points: 15
      },
      {
        id: "pele",
        name: "Pele perilesional",
        words: ["hiperemia", "pele"],
        points: 15
      },
      {
        id: "limpeza",
        name: "Limpeza da ferida",
        words: ["limpeza", "higienizacao", "higienização"],
        points: 15
      },
      {
        id: "curativo",
        name: "Nova cobertura",
        words: ["curativo", "cobertura"],
        points: 20
      }
    ],

    reference:
      "Realizada troca de curativo em incisão cirúrgica abdominal. Curativo anterior apresentava pequena quantidade de exsudato seroso. Ferida com bordas aproximadas, sem sangramento ativo ou odor aparente e pele perilesional sem hiperemia. Realizada limpeza e aplicada nova cobertura conforme protocolo."
  },


  {
    id: 111,
    category: "Feridas e curativos",
    title: "Avaliacao de lesao por pressao",
    level: "Intermediario",
    levelLabel: "Intermediário",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Acompanhamento",

    patient: "Paciente masculino, 69 anos",

    caseText:
      "Localização: região sacral.\n" +
      "Medidas aproximadas: 3 cm x 2 cm.\n" +
      "Leito: avermelhado.\n" +
      "Exsudato: seroso em pequena quantidade.\n" +
      "Bordas: regulares.\n" +
      "Pele perilesional: discreta hiperemia.\n" +
      "Odor: ausente.\n" +
      "Dor referida: 3/10.",

    criteria: [
      {
        id: "local",
        name: "Localizacao",
        words: ["sacral"],
        points: 10
      },
      {
        id: "medida",
        name: "Medidas",
        words: ["3", "2 cm", "3x2", "3 x 2"],
        points: 15
      },
      {
        id: "leito",
        name: "Leito da ferida",
        words: ["avermelhado", "leito"],
        points: 15
      },
      {
        id: "exsudato",
        name: "Exsudato",
        words: ["seroso", "exsudato"],
        points: 15
      },
      {
        id: "bordas",
        name: "Bordas",
        words: ["bordas", "regulares"],
        points: 15
      },
      {
        id: "pele",
        name: "Pele perilesional",
        words: ["hiperemia", "perilesional"],
        points: 15
      },
      {
        id: "dor",
        name: "Dor",
        words: ["dor", "3/10"],
        points: 15
      }
    ],

    reference:
      "Avaliada lesão em região sacral, medindo aproximadamente 3 x 2 cm, com leito avermelhado, pequena quantidade de exsudato seroso, bordas regulares e discreta hiperemia perilesional. Ausência de odor aparente. Paciente refere dor 3/10."
  },


  {
    id: 112,
    category: "Feridas e curativos",
    title: "Ferida em calcaneo",
    level: "Avancado",
    levelLabel: "Avançado",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Acompanhamento",

    patient: "Paciente feminina, 76 anos",

    caseText:
      "Ferida: calcâneo direito.\n" +
      "Tamanho: 2,5 cm x 2 cm.\n" +
      "Leito: 70% tecido de granulação e 30% fibrina.\n" +
      "Exsudato: seroso, pequena quantidade.\n" +
      "Odor: ausente.\n" +
      "Pele ao redor: discreta hiperemia.\n" +
      "Dor: 3/10.\n" +
      "Procedimento: limpeza e cobertura prescrita.",

    criteria: [
      {
        id: "local",
        name: "Localizacao",
        words: ["calcaneo", "calcâneo", "direito"],
        points: 10
      },
      {
        id: "medidas",
        name: "Medidas",
        words: ["2,5", "2.5", "2 cm"],
        points: 10
      },
      {
        id: "granulacao",
        name: "Tecido de granulacao",
        words: ["granulacao", "granulação"],
        points: 15
      },
      {
        id: "fibrina",
        name: "Fibrina",
        words: ["fibrina"],
        points: 15
      },
      {
        id: "exsudato",
        name: "Exsudato",
        words: ["seroso", "exsudato"],
        points: 15
      },
      {
        id: "pele",
        name: "Pele perilesional",
        words: ["hiperemia", "pele"],
        points: 10
      },
      {
        id: "dor",
        name: "Dor",
        words: ["dor", "3/10"],
        points: 10
      },
      {
        id: "curativo",
        name: "Curativo",
        words: ["limpeza", "cobertura", "curativo"],
        points: 15
      }
    ],

    reference:
      "Avaliada ferida em calcâneo direito, medindo aproximadamente 2,5 x 2 cm, apresentando 70% de tecido de granulação e 30% de fibrina. Pequena quantidade de exsudato seroso, sem odor, com discreta hiperemia perilesional. Paciente refere dor 3/10. Realizada limpeza e cobertura conforme prescrição."
  },


  {
    id: 120,
    category: "Dispositivos",
    title: "Avaliacao de acesso venoso periferico",
    level: "Basico",
    levelLabel: "Básico",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Acompanhamento",

    patient: "Paciente masculino, 44 anos",

    caseText:
      "Dispositivo: acesso venoso periférico em membro superior esquerdo.\n" +
      "Permeabilidade: pérvio.\n" +
      "Fixação: íntegra.\n" +
      "Local: sem edema, hiperemia, dor ou secreção.",

    criteria: [
      {
        id: "avp",
        name: "Identificacao do AVP",
        words: ["avp", "acesso venoso", "periferico", "periférico"],
        points: 20
      },
      {
        id: "local",
        name: "Localizacao",
        words: ["membro superior esquerdo", "mse"],
        points: 15
      },
      {
        id: "pervio",
        name: "Permeabilidade",
        words: ["pervio", "pérvio"],
        points: 20
      },
      {
        id: "fixacao",
        name: "Fixacao",
        words: ["fixacao", "fixação", "integra", "íntegra"],
        points: 15
      },
      {
        id: "sinais",
        name: "Sinais flogisticos",
        words: ["hiperemia", "edema", "dor", "secrecao", "secreção"],
        points: 30
      }
    ],

    reference:
      "AVP em membro superior esquerdo, pérvio, com fixação íntegra e sem edema, hiperemia, dor ou secreção no sítio de inserção."
  },


  {
    id: 121,
    category: "Dispositivos",
    title: "Sinais de flebite em AVP",
    level: "Intermediario",
    levelLabel: "Intermediário",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Intercorrencia",

    patient: "Paciente feminina, 61 anos",

    caseText:
      "Dispositivo: AVP em membro superior direito.\n" +
      "Queixa: dor no local.\n" +
      "Achados: hiperemia e edema próximos ao sítio de inserção.\n" +
      "Infusão: interrompida.\n" +
      "Conduta: acesso retirado conforme protocolo e equipe comunicada.",

    criteria: [
      {
        id: "avp",
        name: "Identificacao do acesso",
        words: ["avp", "acesso venoso"],
        points: 15
      },
      {
        id: "dor",
        name: "Dor",
        words: ["dor"],
        points: 15
      },
      {
        id: "hiperemia",
        name: "Hiperemia",
        words: ["hiperemia"],
        points: 15
      },
      {
        id: "edema",
        name: "Edema",
        words: ["edema"],
        points: 15
      },
      {
        id: "interrompida",
        name: "Interrupcao da infusao",
        words: ["infusao interrompida", "infusão interrompida", "interrompida"],
        points: 20
      },
      {
        id: "retirada",
        name: "Retirada do acesso",
        words: ["retirado", "retirada"],
        points: 20
      }
    ],

    reference:
      "AVP em membro superior direito apresentando dor, hiperemia e edema no sítio de inserção. Infusão interrompida e acesso retirado conforme protocolo. Equipe responsável comunicada."
  },


  {
    id: 122,
    category: "Dispositivos",
    title: "Cateter venoso central",
    level: "Intermediario",
    levelLabel: "Intermediário",
    sector: "UTI",
    sectorLabel: "UTI",
    type: "Acompanhamento",

    patient: "Paciente masculino, 65 anos",

    caseText:
      "Dispositivo: CVC em jugular direita.\n" +
      "Curativo: limpo, seco e bem fixado.\n" +
      "Sítio de inserção: sem hiperemia, secreção ou sangramento aparente.",

    criteria: [
      {
        id: "cvc",
        name: "Identificacao do CVC",
        words: ["cvc", "cateter venoso central", "acesso venoso central"],
        points: 25
      },
      {
        id: "local",
        name: "Localizacao",
        words: ["jugular direita"],
        points: 15
      },
      {
        id: "curativo",
        name: "Curativo",
        words: ["curativo", "limpo", "seco"],
        points: 20
      },
      {
        id: "hiperemia",
        name: "Avaliacao do sitio",
        words: ["hiperemia", "secrecao", "secreção", "sangramento"],
        points: 25
      },
      {
        id: "fixacao",
        name: "Fixacao",
        words: ["fixado", "fixacao", "fixação"],
        points: 15
      }
    ],

    reference:
      "CVC em jugular direita, com curativo limpo, seco e bem fixado. Sítio de inserção sem hiperemia, secreção ou sangramento aparente."
  },


  {
    id: 123,
    category: "Dispositivos",
    title: "Cateter vesical de demora",
    level: "Basico",
    levelLabel: "Básico",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Acompanhamento",

    patient: "Paciente feminina, 70 anos",

    caseText:
      "Dispositivo: cateter vesical de demora.\n" +
      "Sistema: fechado.\n" +
      "Fixação: adequada.\n" +
      "Diurese: presente, coloração amarela.\n" +
      "Volume no período: 450 mL.\n" +
      "Bolsa coletora: posicionada abaixo do nível da bexiga.",

    criteria: [
      {
        id: "svd",
        name: "Identificacao do cateter",
        words: ["cateter vesical", "sonda vesical", "svd"],
        points: 20
      },
      {
        id: "sistema",
        name: "Sistema fechado",
        words: ["sistema fechado"],
        points: 15
      },
      {
        id: "diurese",
        name: "Diurese",
        words: ["diurese", "urina"],
        points: 20
      },
      {
        id: "cor",
        name: "Coloracao da urina",
        words: ["amarela"],
        points: 15
      },
      {
        id: "volume",
        name: "Volume urinario",
        words: ["450", "ml"],
        points: 15
      },
      {
        id: "bolsa",
        name: "Posicao da bolsa",
        words: ["abaixo", "bexiga", "bolsa"],
        points: 15
      }
    ],

    reference:
      "Paciente com cateter vesical de demora em sistema fechado e fixação adequada. Diurese presente, coloração amarela, com débito de 450 mL no período. Bolsa coletora mantida abaixo do nível da bexiga."
  },


  {
    id: 130,
    category: "Respiratorio",
    title: "Oxigenoterapia por cateter nasal",
    level: "Basico",
    levelLabel: "Básico",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Acompanhamento",

    patient: "Paciente masculino, 58 anos",

    caseText:
      "Suporte: oxigenoterapia por cateter nasal conforme prescrição.\n" +
      "SpO₂: 95%.\n" +
      "FR: 20 irpm.\n" +
      "Paciente: consciente, sem sinais aparentes de esforço respiratório.\n" +
      "Dispositivo: bem posicionado.",

    criteria: [
      {
        id: "o2",
        name: "Oxigenoterapia",
        words: ["oxigenoterapia", "oxigenio", "oxigênio"],
        points: 20
      },
      {
        id: "cateter",
        name: "Cateter nasal",
        words: ["cateter nasal"],
        points: 15
      },
      {
        id: "spo2",
        name: "Saturacao",
        words: ["spo2", "95"],
        points: 20
      },
      {
        id: "fr",
        name: "Frequencia respiratoria",
        words: ["fr", "20", "irpm"],
        points: 15
      },
      {
        id: "esforco",
        name: "Padrao respiratorio",
        words: ["sem sinais", "esforco", "esforço", "dispneia"],
        points: 15
      },
      {
        id: "dispositivo",
        name: "Posicionamento do dispositivo",
        words: ["posicionado", "posicionamento"],
        points: 15
      }
    ],

    reference:
      "Paciente em oxigenoterapia por cateter nasal conforme prescrição, SpO₂ 95% e FR 20 irpm, sem sinais aparentes de esforço respiratório. Dispositivo mantido adequadamente posicionado."
  },


  {
    id: 131,
    category: "Respiratorio",
    title: "Desconforto respiratorio",
    level: "Avancado",
    levelLabel: "Avançado",
    sector: "Emergencia",
    sectorLabel: "Emergência",
    type: "Intercorrencia",

    patient: "Paciente feminina, 66 anos",

    caseText:
      "Queixa: falta de ar de início recente.\n" +
      "FR: 28 irpm.\n" +
      "SpO₂: 89%.\n" +
      "Estado: consciente e ansiosa.\n" +
      "Posicionamento: cabeceira elevada.\n" +
      "Conduta inicial: monitorização e equipe responsável comunicada.",

    criteria: [
      {
        id: "dispneia",
        name: "Dispneia",
        words: ["dispneia", "falta de ar"],
        points: 20
      },
      {
        id: "fr",
        name: "FR alterada",
        words: ["fr", "28"],
        points: 15
      },
      {
        id: "spo2",
        name: "SpO2 reduzida",
        words: ["spo2", "89"],
        points: 20
      },
      {
        id: "posicao",
        name: "Posicionamento",
        words: ["cabeceira", "elevada"],
        points: 15
      },
      {
        id: "monitorizacao",
        name: "Monitorizacao",
        words: ["monitorizacao", "monitorização", "monitorada"],
        points: 15
      },
      {
        id: "comunicacao",
        name: "Equipe comunicada",
        words: ["equipe", "comunicada", "comunicado"],
        points: 15
      }
    ],

    reference:
      "Paciente apresenta dispneia, FR 28 irpm e SpO₂ 89%, mantendo-se consciente e ansiosa. Mantida com cabeceira elevada e sob monitorização. Equipe responsável comunicada sobre alteração do padrão respiratório."
  },


  {
    id: 132,
    category: "Respiratorio",
    title: "Aspiracao de vias aereas",
    level: "Avancado",
    levelLabel: "Avançado",
    sector: "UTI",
    sectorLabel: "UTI",
    type: "Acompanhamento",

    patient: "Paciente masculino, 63 anos",

    caseText:
      "Paciente em ventilação mecânica invasiva.\n" +
      "Presença de secreção em via aérea.\n" +
      "Secreção aspirada: amarelada, moderada quantidade.\n" +
      "SpO₂ antes do procedimento: 93%.\n" +
      "SpO₂ após procedimento: 96%.\n" +
      "Procedimento tolerado sem intercorrências aparentes.",

    criteria: [
      {
        id: "aspiracao",
        name: "Aspiracao de vias aereas",
        words: ["aspiracao", "aspiração"],
        points: 20
      },
      {
        id: "secrecao",
        name: "Caracteristicas da secrecao",
        words: ["amarelada", "moderada", "secrecao", "secreção"],
        points: 20
      },
      {
        id: "antes",
        name: "SpO2 antes",
        words: ["93"],
        points: 15
      },
      {
        id: "depois",
        name: "SpO2 apos",
        words: ["96"],
        points: 15
      },
      {
        id: "vm",
        name: "Ventilacao mecanica",
        words: ["ventilacao mecanica", "ventilação mecânica"],
        points: 15
      },
      {
        id: "tolerancia",
        name: "Resposta ao procedimento",
        words: ["sem intercorrencias", "sem intercorrências", "tolerou", "tolerado"],
        points: 15
      }
    ],

    reference:
      "Realizada aspiração de vias aéreas em paciente sob ventilação mecânica, com retirada de secreção amarelada em moderada quantidade. SpO₂ de 93% antes e 96% após o procedimento. Procedimento tolerado sem intercorrências aparentes."
  },


  {
    id: 140,
    category: "Sinais vitais e dor",
    title: "Verificacao de sinais vitais",
    level: "Basico",
    levelLabel: "Básico",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Acompanhamento",

    patient: "Paciente feminina, 38 anos",

    caseText:
      "PA: 118/72 mmHg.\n" +
      "FC: 82 bpm.\n" +
      "FR: 18 irpm.\n" +
      "SpO₂: 97% em ar ambiente.\n" +
      "Temperatura: 36,5 °C.\n" +
      "Paciente sem queixas no momento.",

    criteria: [
      {
        id: "pa",
        name: "Pressao arterial",
        words: ["118/72", "pa"],
        points: 20
      },
      {
        id: "fc",
        name: "Frequencia cardiaca",
        words: ["82", "fc"],
        points: 20
      },
      {
        id: "fr",
        name: "Frequencia respiratoria",
        words: ["18", "fr"],
        points: 20
      },
      {
        id: "spo2",
        name: "SpO2",
        words: ["97", "spo2"],
        points: 20
      },
      {
        id: "temperatura",
        name: "Temperatura",
        words: ["36,5", "36.5", "temperatura"],
        points: 20
      }
    ],

    reference:
      "Verificados sinais vitais: PA 118/72 mmHg, FC 82 bpm, FR 18 irpm, SpO₂ 97% em ar ambiente e temperatura 36,5 °C. Paciente sem queixas no momento."
  },


  {
    id: 141,
    category: "Sinais vitais e dor",
    title: "Avaliacao de dor",
    level: "Basico",
    levelLabel: "Básico",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Acompanhamento",

    patient: "Paciente masculino, 56 anos",

    caseText:
      "Queixa: dor abdominal.\n" +
      "Intensidade: 6/10 na escala numérica.\n" +
      "Características: contínua.\n" +
      "Paciente consciente e orientado.\n" +
      "Após intervenção prescrita: dor referida como 2/10.",

    criteria: [
      {
        id: "local",
        name: "Localizacao da dor",
        words: ["abdominal"],
        points: 20
      },
      {
        id: "intensidade",
        name: "Intensidade inicial",
        words: ["6/10", "6"],
        points: 20
      },
      {
        id: "caracteristica",
        name: "Caracteristica",
        words: ["continua", "contínua"],
        points: 15
      },
      {
        id: "conduta",
        name: "Intervencao",
        words: ["intervencao", "intervenção", "medicacao", "medicação", "prescricao", "prescrição"],
        points: 20
      },
      {
        id: "reavaliacao",
        name: "Reavaliacao",
        words: ["2/10", "reavaliada", "reavaliado"],
        points: 25
      }
    ],

    reference:
      "Paciente refere dor abdominal contínua, intensidade 6/10 em escala numérica. Realizada intervenção conforme prescrição. Em reavaliação, refere redução da dor para 2/10."
  },


  {
    id: 150,
    category: "Eliminacoes",
    title: "Controle de diurese",
    level: "Basico",
    levelLabel: "Básico",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Acompanhamento",

    patient: "Paciente masculino, 71 anos",

    caseText:
      "Diurese espontânea.\n" +
      "Volume no período: 600 mL.\n" +
      "Aspecto: amarelo claro.\n" +
      "Sem sedimentos aparentes.\n" +
      "Paciente não refere dor ao urinar.",

    criteria: [
      {
        id: "diurese",
        name: "Diurese",
        words: ["diurese", "urina"],
        points: 25
      },
      {
        id: "volume",
        name: "Volume",
        words: ["600", "ml"],
        points: 20
      },
      {
        id: "cor",
        name: "Coloracao",
        words: ["amarelo", "amarela"],
        points: 20
      },
      {
        id: "sedimento",
        name: "Sedimentos",
        words: ["sedimento", "sem sedimentos"],
        points: 15
      },
      {
        id: "dor",
        name: "Sintomas urinarios",
        words: ["dor", "disuria", "disúria", "sem queixas"],
        points: 20
      }
    ],

    reference:
      "Paciente apresentou diurese espontânea de 600 mL no período, aspecto amarelo claro, sem sedimentos aparentes. Nega dor ao urinar."
  },


  {
    id: 151,
    category: "Eliminacoes",
    title: "Evacuacao",
    level: "Basico",
    levelLabel: "Básico",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Acompanhamento",

    patient: "Paciente feminina, 67 anos",

    caseText:
      "Evacuação espontânea.\n" +
      "Quantidade: moderada.\n" +
      "Consistência: pastosa.\n" +
      "Coloração: castanha.\n" +
      "Sem sangue aparente.",

    criteria: [
      {
        id: "evacuacao",
        name: "Evacuacao",
        words: ["evacuacao", "evacuação", "fezes"],
        points: 25
      },
      {
        id: "quantidade",
        name: "Quantidade",
        words: ["moderada"],
        points: 20
      },
      {
        id: "consistencia",
        name: "Consistencia",
        words: ["pastosa"],
        points: 20
      },
      {
        id: "cor",
        name: "Coloracao",
        words: ["castanha"],
        points: 20
      },
      {
        id: "sangue",
        name: "Presenca de sangue",
        words: ["sem sangue", "sangue"],
        points: 15
      }
    ],

    reference:
      "Paciente apresentou evacuação espontânea, em quantidade moderada, fezes de consistência pastosa e coloração castanha, sem sangue aparente."
  },


  {
    id: 152,
    category: "Eliminacoes",
    title: "Nausea e vomito",
    level: "Intermediario",
    levelLabel: "Intermediário",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Intercorrencia",

    patient: "Paciente feminina, 49 anos",

    caseText:
      "Queixa inicial: náusea.\n" +
      "Episódio: um vômito.\n" +
      "Volume aproximado: 200 mL.\n" +
      "Aspecto: conteúdo alimentar.\n" +
      "Procedimentos: higiene e posicionamento seguro.\n" +
      "Equipe responsável comunicada.",

    criteria: [
      {
        id: "nausea",
        name: "Nausea",
        words: ["nausea", "náusea"],
        points: 15
      },
      {
        id: "vomito",
        name: "Vomito",
        words: ["vomito", "vômito", "emese"],
        points: 20
      },
      {
        id: "volume",
        name: "Volume",
        words: ["200", "ml"],
        points: 15
      },
      {
        id: "aspecto",
        name: "Aspecto",
        words: ["alimentar", "conteudo", "conteúdo"],
        points: 15
      },
      {
        id: "higiene",
        name: "Higiene e seguranca",
        words: ["higiene", "posicionamento", "seguro", "segura"],
        points: 15
      },
      {
        id: "comunicacao",
        name: "Equipe comunicada",
        words: ["equipe", "comunicada", "comunicado"],
        points: 20
      }
    ],

    reference:
      "Paciente refere náusea e apresentou episódio de vômito, aproximadamente 200 mL, de aspecto alimentar. Realizada higiene e mantida em posicionamento seguro. Equipe responsável comunicada e paciente mantida em observação."
  },


  {
    id: 160,
    category: "Nutricional",
    title: "Aceitacao de dieta oral",
    level: "Basico",
    levelLabel: "Básico",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Acompanhamento",

    patient: "Paciente masculino, 62 anos",

    caseText:
      "Dieta: via oral.\n" +
      "Aceitação: aproximadamente 80% da refeição.\n" +
      "Deglutição: sem dificuldade observada.\n" +
      "Náusea: ausente.\n" +
      "Vômito: ausente.",

    criteria: [
      {
        id: "via",
        name: "Via oral",
        words: ["via oral", "oral"],
        points: 20
      },
      {
        id: "aceitacao",
        name: "Aceitacao",
        words: ["80", "aceitacao", "aceitação"],
        points: 25
      },
      {
        id: "degluticao",
        name: "Degluticao",
        words: ["degluticao", "deglutição", "engolir"],
        points: 20
      },
      {
        id: "nausea",
        name: "Nausea",
        words: ["nausea", "náusea"],
        points: 15
      },
      {
        id: "vomito",
        name: "Vomito",
        words: ["vomito", "vômito"],
        points: 20
      }
    ],

    reference:
      "Paciente recebeu dieta por via oral, com aceitação aproximada de 80%, sem dificuldade aparente para deglutição, náuseas ou vômitos durante o período observado."
  },


  {
    id: 161,
    category: "Nutricional",
    title: "Dieta enteral",
    level: "Intermediario",
    levelLabel: "Intermediário",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Acompanhamento",

    patient: "Paciente feminina, 73 anos",

    caseText:
      "Dispositivo: sonda enteral fixada.\n" +
      "Dieta: enteral conforme prescrição.\n" +
      "Cabeceira: elevada durante infusão.\n" +
      "Tolerância: sem náusea ou vômito durante o período observado.",

    criteria: [
      {
        id: "sonda",
        name: "Sonda enteral",
        words: ["sonda", "enteral"],
        points: 20
      },
      {
        id: "dieta",
        name: "Dieta enteral",
        words: ["dieta enteral"],
        points: 25
      },
      {
        id: "prescricao",
        name: "Conforme prescricao",
        words: ["prescricao", "prescrição"],
        points: 15
      },
      {
        id: "cabeceira",
        name: "Cabeceira elevada",
        words: ["cabeceira", "elevada"],
        points: 20
      },
      {
        id: "tolerancia",
        name: "Tolerancia",
        words: ["nausea", "náusea", "vomito", "vômito", "tolerou"],
        points: 20
      }
    ],

    reference:
      "Paciente com sonda enteral fixada, recebendo dieta enteral conforme prescrição, mantida com cabeceira elevada durante a infusão. Sem náuseas ou vômitos no período observado."
  },


  {
    id: 170,
    category: "Pre e pos-operatorio",
    title: "Pre-operatorio",
    level: "Intermediario",
    levelLabel: "Intermediário",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Admissao",

    patient: "Paciente feminina, 47 anos",

    caseText:
      "Procedimento programado: cirurgia abdominal.\n" +
      "Estado: consciente, orientada e comunicativa.\n" +
      "Jejum: confirmado conforme orientação.\n" +
      "Identificação: pulseira presente e conferida.\n" +
      "Documentação: disponível.\n" +
      "Paciente encaminhada ao setor cirúrgico em condições estáveis.",

    criteria: [
      {
        id: "estado",
        name: "Estado geral",
        words: ["consciente", "orientada", "comunicativa"],
        points: 15
      },
      {
        id: "jejum",
        name: "Jejum",
        words: ["jejum"],
        points: 20
      },
      {
        id: "identificacao",
        name: "Identificacao",
        words: ["pulseira", "identificacao", "identificação"],
        points: 20
      },
      {
        id: "documentos",
        name: "Documentacao",
        words: ["documentacao", "documentação"],
        points: 15
      },
      {
        id: "encaminhamento",
        name: "Encaminhamento",
        words: ["encaminhada", "centro cirurgico", "cirúrgico"],
        points: 20
      },
      {
        id: "condicao",
        name: "Condicao no transporte",
        words: ["estavel", "estável"],
        points: 10
      }
    ],

    reference:
      "Paciente em preparo pré-operatório, consciente, orientada e comunicativa. Jejum confirmado conforme orientação, identificação conferida e documentação disponível. Encaminhada ao setor cirúrgico em condições clínicas estáveis."
  },


  {
    id: 171,
    category: "Pre e pos-operatorio",
    title: "Retorno do centro cirurgico",
    level: "Intermediario",
    levelLabel: "Intermediário",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Pos-procedimento",

    patient: "Paciente masculino, 55 anos",

    caseText:
      "Retorno após colecistectomia.\n" +
      "Estado: sonolento, desperta ao chamado e responde adequadamente.\n" +
      "PA: 116/70 mmHg.\n" +
      "FC: 86 bpm.\n" +
      "FR: 18 irpm.\n" +
      "SpO₂: 96%.\n" +
      "Curativo abdominal: limpo e seco.\n" +
      "Dor: 4/10.\n" +
      "AVP presente e pérvio.",

    criteria: [
      {
        id: "cirurgia",
        name: "Procedimento",
        words: ["colecistectomia", "pos-operatorio", "pós-operatório"],
        points: 10
      },
      {
        id: "estado",
        name: "Estado de consciencia",
        words: ["sonolento", "responde", "desperta"],
        points: 15
      },
      {
        id: "sinais",
        name: "Sinais vitais",
        words: ["116/70", "86", "18", "96"],
        points: 20
      },
      {
        id: "curativo",
        name: "Curativo",
        words: ["curativo", "limpo", "seco"],
        points: 20
      },
      {
        id: "dor",
        name: "Dor",
        words: ["dor", "4/10"],
        points: 15
      },
      {
        id: "avp",
        name: "Acesso venoso",
        words: ["avp", "acesso venoso", "pervio", "pérvio"],
        points: 20
      }
    ],

    reference:
      "Paciente retorna do centro cirúrgico após colecistectomia, sonolento, desperta ao chamado e responde adequadamente. PA 116/70 mmHg, FC 86 bpm, FR 18 irpm e SpO₂ 96%. Curativo abdominal limpo e seco, dor 4/10 e AVP pérvio."
  },


  {
    id: 180,
    category: "Urgencias e intercorrencias",
    title: "Hipotensao",
    level: "Avancado",
    levelLabel: "Avançado",
    sector: "Emergencia",
    sectorLabel: "Emergência",
    type: "Intercorrencia",

    patient: "Paciente feminina, 59 anos",

    caseText:
      "Queixas: tontura e fraqueza.\n" +
      "PA: 84/52 mmHg.\n" +
      "FC: 110 bpm.\n" +
      "Estado: consciente e orientada.\n" +
      "Paciente mantida em segurança e sob monitorização.\n" +
      "Equipe responsável comunicada.",

    criteria: [
      {
        id: "queixa",
        name: "Sintomas",
        words: ["tontura", "fraqueza"],
        points: 20
      },
      {
        id: "pa",
        name: "Hipotensao",
        words: ["84/52", "pa"],
        points: 20
      },
      {
        id: "fc",
        name: "Frequencia cardiaca",
        words: ["110", "fc"],
        points: 15
      },
      {
        id: "consciencia",
        name: "Estado neurologico",
        words: ["consciente", "orientada"],
        points: 15
      },
      {
        id: "monitorizacao",
        name: "Monitorizacao",
        words: ["monitorizacao", "monitorização"],
        points: 15
      },
      {
        id: "equipe",
        name: "Comunicacao",
        words: ["equipe", "comunicada", "comunicado"],
        points: 15
      }
    ],

    reference:
      "Paciente refere tontura e fraqueza, consciente e orientada. PA 84/52 mmHg e FC 110 bpm. Mantida em segurança e sob monitorização. Equipe responsável comunicada sobre alteração dos sinais vitais."
  },


  {
    id: 181,
    category: "Urgencias e intercorrencias",
    title: "Hipoglicemia",
    level: "Avancado",
    levelLabel: "Avançado",
    sector: "Emergencia",
    sectorLabel: "Emergência",
    type: "Intercorrencia",

    patient: "Paciente masculino, 64 anos",

    caseText:
      "Sintomas: sudorese, tremores e fraqueza.\n" +
      "Glicemia capilar inicial: 52 mg/dL.\n" +
      "Paciente consciente.\n" +
      "Intervenção realizada conforme protocolo/prescrição.\n" +
      "Glicemia de controle: 98 mg/dL.\n" +
      "Equipe responsável comunicada.",

    criteria: [
      {
        id: "sintomas",
        name: "Sintomas",
        words: ["sudorese", "tremores", "fraqueza"],
        points: 20
      },
      {
        id: "glicemia",
        name: "Glicemia inicial",
        words: ["52", "glicemia"],
        points: 20
      },
      {
        id: "estado",
        name: "Estado de consciencia",
        words: ["consciente"],
        points: 10
      },
      {
        id: "conduta",
        name: "Intervencao",
        words: ["protocolo", "prescricao", "prescrição", "intervencao", "intervenção"],
        points: 20
      },
      {
        id: "controle",
        name: "Glicemia de controle",
        words: ["98", "reavaliada", "controle"],
        points: 15
      },
      {
        id: "equipe",
        name: "Equipe comunicada",
        words: ["equipe", "comunicada", "comunicado"],
        points: 15
      }
    ],

    reference:
      "Paciente apresentou sudorese, tremores e fraqueza, com glicemia capilar de 52 mg/dL, mantendo-se consciente. Realizada intervenção conforme protocolo/prescrição. Glicemia de controle 98 mg/dL. Equipe responsável comunicada."
  },


  {
    id: 182,
    category: "Urgencias e intercorrencias",
    title: "Queda",
    level: "Avancado",
    levelLabel: "Avançado",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Intercorrencia",

    patient: "Paciente masculino, 79 anos",

    caseText:
      "Paciente encontrado no chão ao lado do leito.\n" +
      "Estado: consciente e orientado.\n" +
      "Queixa: dor leve em quadril direito.\n" +
      "Sem sangramento aparente.\n" +
      "Sinais vitais verificados.\n" +
      "Equipe responsável comunicada imediatamente.\n" +
      "Paciente avaliado conforme protocolo institucional.",

    criteria: [
      {
        id: "evento",
        name: "Registro da queda",
        words: ["queda", "chao", "chão", "encontrado"],
        points: 20
      },
      {
        id: "consciencia",
        name: "Estado de consciencia",
        words: ["consciente", "orientado"],
        points: 15
      },
      {
        id: "dor",
        name: "Dor",
        words: ["dor", "quadril"],
        points: 15
      },
      {
        id: "lesoes",
        name: "Avaliacao de lesoes",
        words: ["sangramento", "lesao", "lesão"],
        points: 15
      },
      {
        id: "sinais",
        name: "Sinais vitais",
        words: ["sinais vitais", "sv"],
        points: 15
      },
      {
        id: "equipe",
        name: "Equipe comunicada",
        words: ["equipe", "comunicada", "comunicado"],
        points: 20
      }
    ],

    reference:
      "Paciente encontrado no chão ao lado do leito, consciente e orientado, referindo dor leve em quadril direito, sem sangramento aparente. Sinais vitais verificados e equipe responsável comunicada imediatamente. Mantido sob avaliação conforme protocolo institucional."
  },


  {
    id: 183,
    category: "Urgencias e intercorrencias",
    title: "Febre",
    level: "Intermediario",
    levelLabel: "Intermediário",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Intercorrencia",

    patient: "Paciente feminina, 42 anos",

    caseText:
      "Temperatura: 38,5 °C.\n" +
      "Queixa: mal-estar e calafrios.\n" +
      "Paciente consciente e orientada.\n" +
      "Demais sinais vitais verificados.\n" +
      "Medidas realizadas conforme prescrição.\n" +
      "Mantida monitorização da temperatura.",

    criteria: [
      {
        id: "temperatura",
        name: "Temperatura",
        words: ["38,5", "38.5", "temperatura"],
        points: 20
      },
      {
        id: "sintomas",
        name: "Sintomas",
        words: ["mal-estar", "calafrios"],
        points: 20
      },
      {
        id: "estado",
        name: "Estado geral",
        words: ["consciente", "orientada"],
        points: 15
      },
      {
        id: "sinais",
        name: "Sinais vitais",
        words: ["sinais vitais"],
        points: 15
      },
      {
        id: "conduta",
        name: "Conduta",
        words: ["prescricao", "prescrição", "medidas"],
        points: 15
      },
      {
        id: "monitorar",
        name: "Reavaliacao",
        words: ["temperatura", "monitorizacao", "monitorização"],
        points: 15
      }
    ],

    reference:
      "Paciente apresenta temperatura de 38,5 °C, refere mal-estar e calafrios, consciente e orientada. Demais sinais vitais verificados. Realizadas medidas conforme prescrição e mantida monitorização da temperatura."
  },


  {
    id: 190,
    category: "Admissao alta e transferencia",
    title: "Admissao na unidade",
    level: "Intermediario",
    levelLabel: "Intermediário",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Admissao",

    patient: "Paciente masculino, 60 anos",

    caseText:
      "Origem: pronto atendimento.\n" +
      "Motivo da internação: pneumonia.\n" +
      "Estado: consciente, orientado e comunicativo.\n" +
      "PA: 126/78 mmHg.\n" +
      "FC: 92 bpm.\n" +
      "FR: 22 irpm.\n" +
      "SpO₂: 94% em ar ambiente.\n" +
      "AVP em membro superior direito.\n" +
      "Paciente orientado sobre rotina da unidade.",

    criteria: [
      {
        id: "origem",
        name: "Origem",
        words: ["pronto atendimento", "proveniente"],
        points: 10
      },
      {
        id: "motivo",
        name: "Motivo da internacao",
        words: ["pneumonia"],
        points: 15
      },
      {
        id: "estado",
        name: "Estado geral",
        words: ["consciente", "orientado", "comunicativo"],
        points: 15
      },
      {
        id: "sinais",
        name: "Sinais vitais",
        words: ["126/78", "92", "22", "94"],
        points: 20
      },
      {
        id: "avp",
        name: "Dispositivos",
        words: ["avp", "acesso venoso"],
        points: 20
      },
      {
        id: "orientacoes",
        name: "Orientacoes",
        words: ["orientado", "rotina", "unidade"],
        points: 20
      }
    ],

    reference:
      "Paciente admitido na unidade proveniente do pronto atendimento por pneumonia, consciente, orientado e comunicativo. PA 126/78 mmHg, FC 92 bpm, FR 22 irpm e SpO₂ 94% em ar ambiente. AVP em membro superior direito. Realizadas orientações sobre rotina e segurança da unidade."
  },


  {
    id: 191,
    category: "Admissao alta e transferencia",
    title: "Transferencia de setor",
    level: "Intermediario",
    levelLabel: "Intermediário",
    sector: "UTI",
    sectorLabel: "UTI",
    type: "Acompanhamento",

    patient: "Paciente feminina, 68 anos",

    caseText:
      "Transferência: clínica médica para UTI.\n" +
      "Estado: consciente e orientada.\n" +
      "Motivo: piora respiratória.\n" +
      "Oxigenoterapia presente.\n" +
      "AVP em membro superior esquerdo.\n" +
      "Documentação acompanhando paciente.\n" +
      "Informações assistenciais repassadas à equipe receptora.",

    criteria: [
      {
        id: "destino",
        name: "Setor de destino",
        words: ["uti"],
        points: 15
      },
      {
        id: "motivo",
        name: "Motivo",
        words: ["piora respiratoria", "piora respiratória"],
        points: 15
      },
      {
        id: "estado",
        name: "Estado geral",
        words: ["consciente", "orientada"],
        points: 15
      },
      {
        id: "oxigenio",
        name: "Oxigenoterapia",
        words: ["oxigenoterapia", "oxigenio", "oxigênio"],
        points: 15
      },
      {
        id: "avp",
        name: "Acesso venoso",
        words: ["avp", "acesso venoso"],
        points: 15
      },
      {
        id: "documentacao",
        name: "Documentacao e passagem",
        words: ["documentacao", "documentação", "repassadas", "equipe receptora"],
        points: 25
      }
    ],

    reference:
      "Paciente transferida da clínica médica para UTI devido à piora respiratória, consciente e orientada, em oxigenoterapia e com AVP em membro superior esquerdo. Encaminhada com documentação pertinente e informações assistenciais repassadas à equipe receptora."
  },


  {
    id: 192,
    category: "Admissao alta e transferencia",
    title: "Alta hospitalar",
    level: "Basico",
    levelLabel: "Básico",
    sector: "Clinica Medica",
    sectorLabel: "Clínica Médica",
    type: "Acompanhamento",

    patient: "Paciente masculino, 51 anos",

    caseText:
      "Alta hospitalar autorizada pela equipe responsável.\n" +
      "Paciente consciente, orientado e acompanhado por familiar.\n" +
      "Orientações fornecidas sobre cuidados domiciliares, medicações, retorno e sinais de alerta.\n" +
      "Documentação entregue conforme rotina.",

    criteria: [
      {
        id: "alta",
        name: "Alta hospitalar",
        words: ["alta"],
        points: 20
      },
      {
        id: "estado",
        name: "Estado geral",
        words: ["consciente", "orientado"],
        points: 15
      },
      {
        id: "acompanhante",
        name: "Acompanhante",
        words: ["familiar", "acompanhado"],
        points: 10
      },
      {
        id: "cuidados",
        name: "Orientacoes domiciliares",
        words: ["cuidados", "domiciliares"],
        points: 15
      },
      {
        id: "medicacoes",
        name: "Medicacoes",
        words: ["medicacoes", "medicações"],
        points: 15
      },
      {
        id: "retorno",
        name: "Retorno e sinais de alerta",
        words: ["retorno", "sinais de alerta"],
        points: 15
      },
      {
        id: "documentacao",
        name: "Documentacao",
        words: ["documentacao", "documentação"],
        points: 10
      }
    ],

    reference:
      "Paciente recebe alta hospitalar conforme decisão da equipe responsável, consciente, orientado e acompanhado por familiar. Realizadas orientações sobre cuidados domiciliares, medicações, retorno e sinais de alerta. Documentação entregue conforme rotina."
  },


  {
    id: 200,
    category: "UTI",
    title: "Paciente em ventilacao mecanica",
    level: "Avancado",
    levelLabel: "Avançado",
    sector: "UTI",
    sectorLabel: "UTI",
    type: "Acompanhamento",

    patient: "Paciente masculino, 72 anos",

    caseText:
      "Paciente sedado.\n" +
      "Via aérea: tubo orotraqueal.\n" +
      "Suporte: ventilação mecânica invasiva.\n" +
      "SpO₂: 95%.\n" +
      "FC: 102 bpm.\n" +
      "PA: 108/66 mmHg.\n" +
      "CVC em jugular direita.\n" +
      "SVD com diurese presente.\n" +
      "Monitorização contínua.",

    criteria: [
      {
        id: "sedacao",
        name: "Sedacao",
        words: ["sedado", "sedacao", "sedação"],
        points: 15
      },
      {
        id: "tot",
        name: "Tubo orotraqueal",
        words: ["tubo orotraqueal", "tot"],
        points: 15
      },
      {
        id: "vm",
        name: "Ventilacao mecanica",
        words: ["ventilacao mecanica", "ventilação mecânica"],
        points: 15
      },
      {
        id: "sinais",
        name: "Monitorizacao",
        words: ["95", "102", "108/66", "monitorizacao", "monitorização"],
        points: 20
      },
      {
        id: "cvc",
        name: "CVC",
        words: ["cvc", "jugular"],
        points: 15
      },
      {
        id: "svd",
        name: "SVD e diurese",
        words: ["svd", "cateter vesical", "diurese"],
        points: 20
      }
    ],

    reference:
      "Paciente sedado, em ventilação mecânica invasiva por tubo orotraqueal. SpO₂ 95%, FC 102 bpm e PA 108/66 mmHg, mantido sob monitorização contínua. CVC em jugular direita e cateter vesical de demora com diurese presente."
  },


  {
    id: 201,
    category: "UTI",
    title: "Paciente critico com multiplos dispositivos",
    level: "Avancado",
    levelLabel: "Avançado",
    sector: "UTI",
    sectorLabel: "UTI",
    type: "Acompanhamento",

    patient: "Paciente feminina, 70 anos",

    caseText:
      "Estado: sedada.\n" +
      "TOT conectado à ventilação mecânica.\n" +
      "CVC em subclávia direita, curativo limpo e seco.\n" +
      "SVD com débito urinário de 350 mL no período.\n" +
      "Sonda enteral fixada.\n" +
      "Dreno abdominal com 60 mL de conteúdo serossanguinolento.\n" +
      "Monitorização contínua.",

    criteria: [
      {
        id: "sedacao",
        name: "Estado neurologico",
        words: ["sedada"],
        points: 10
      },
      {
        id: "vm",
        name: "Ventilacao mecanica",
        words: ["tot", "ventilacao mecanica", "ventilação mecânica"],
        points: 15
      },
      {
        id: "cvc",
        name: "CVC",
        words: ["cvc", "subclavia", "subclávia", "curativo"],
        points: 15
      },
      {
        id: "svd",
        name: "Controle urinario",
        words: ["svd", "350", "diurese"],
        points: 15
      },
      {
        id: "sonda",
        name: "Sonda enteral",
        words: ["sonda enteral"],
        points: 15
      },
      {
        id: "dreno",
        name: "Dreno abdominal",
        words: ["dreno", "60", "serossanguinolento"],
        points: 20
      },
      {
        id: "monitorizacao",
        name: "Monitorizacao continua",
        words: ["monitorizacao", "monitorização"],
        points: 10
      }
    ],

    reference:
      "Paciente sedada, em ventilação mecânica invasiva por TOT, sob monitorização contínua. CVC em subclávia direita com curativo limpo e seco. SVD com débito de 350 mL no período, sonda enteral fixada e dreno abdominal com 60 mL de conteúdo serossanguinolento."
  }

];