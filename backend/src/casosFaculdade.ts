import { prisma } from "../../lib/prisma";


const CHAVE_CARGA =
  "casos_faculdade_patologia_imunologia_v1";


type CasoFaculdade = {
  titulo: string;
  area: string;
  especialidade: string;
  dificuldade: string;
  cenario: string;
  queixaInicial: string;
  dadosIniciais: Record<string, string>;
  anamnese: Record<string, string>;
  exameFisico: Record<string, string>;
  sinaisVitais: Record<string, string>;
  evolucao: Record<string, string>;
  diagnosticoFinal: string;
  explicacaoDiagnostico: string;
  diagnosticosDiferenciais: Array<{
    diagnostico: string;
    justificativa: string;
    porqueNaoEPrincipal: string;
  }>;
  pontosChave: Array<{
    achado: string;
    importancia: string;
  }>;
  exames: Array<{
    nome: string;
    categoria: string;
    resultado: string;
    interpretacao: string;
  }>;
};


const casos:
  CasoFaculdade[] =
[
  {
    "titulo": "A pele que escureceu aos poucos",
    "area": "Patologia — Pigmentos",
    "especialidade": "Patologia Geral",
    "dificuldade": "Medio",
    "cenario": "Ambulatório de clínica médica",
    "queixaInicial": "Homem de 52 anos procura atendimento por cansaço progressivo, dor nas articulações das mãos e escurecimento da pele.",
    "dadosIniciais": {
      "idade": "52 anos",
      "sexo": "Masculino",
      "tempoDeSintomas": "Cerca de 2 anos",
      "contexto": "Diabetes diagnosticado recentemente, sem obesidade importante"
    },
    "anamnese": {
      "sintomas": "Fadiga, redução da libido e artralgia em 2º e 3º metacarpofalângicos",
      "familia": "Irmão com doença hepática sem causa definida",
      "habitos": "Ingesta alcoólica ocasional",
      "medicacoes": "Metformina"
    },
    "exameFisico": {
      "pele": "Hiperpigmentação difusa, mais evidente em áreas expostas",
      "abdome": "Fígado palpável 2 cm abaixo do rebordo costal",
      "articulacoes": "Dor à mobilização das mãos, sem sinovite intensa",
      "cardiovascular": "Sem sinais de congestão"
    },
    "sinaisVitais": {
      "PA": "132/82 mmHg",
      "FC": "76 bpm",
      "FR": "16 irpm",
      "temperatura": "36,5 °C",
      "SpO2": "98%"
    },
    "evolucao": {
      "semIntervencao": "Mantém fadiga e alterações metabólicas, com elevação progressiva de enzimas hepáticas",
      "pista": "A associação entre pigmentação cutânea, diabetes e depósito de ferro deve ser integrada"
    },
    "diagnosticoFinal": "Hemocromatose hereditária com sobrecarga sistêmica de ferro",
    "explicacaoDiagnostico": "O excesso de absorção intestinal de ferro leva ao acúmulo de hemossiderina em fígado, pâncreas, pele, articulações e outros órgãos. A hiperpigmentação, diabetes, artralgia e saturação de transferrina elevada formam um conjunto clássico.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Doença de Addison",
        "justificativa": "Pode causar hiperpigmentação e astenia.",
        "porqueNaoEPrincipal": "Não explica sobrecarga de ferro, ferritina elevada e saturação de transferrina muito aumentada."
      },
      {
        "diagnostico": "Hepatopatia alcoólica crônica",
        "justificativa": "Pode causar alterações hepáticas e fadiga.",
        "porqueNaoEPrincipal": "O consumo é pequeno e a combinação de diabetes, artralgia e ferro elevado favorece hemocromatose."
      }
    ],
    "pontosChave": [
      {
        "achado": "Saturação de transferrina muito elevada",
        "importancia": "Sugere aumento real da carga de ferro, não apenas ferritina de fase aguda."
      },
      {
        "achado": "Hiperpigmentação + diabetes",
        "importancia": "Reflete depósito crônico de ferro em pele e pâncreas."
      },
      {
        "achado": "Artralgia metacarpofalângica",
        "importancia": "Achado associado à sobrecarga crônica de ferro."
      }
    ],
    "exames": [
      {
        "nome": "Ferritina e saturação de transferrina",
        "categoria": "Laboratório",
        "resultado": "Ferritina 1.180 ng/mL; saturação de transferrina 78%.",
        "interpretacao": "Sobrecarga de ferro importante."
      },
      {
        "nome": "Função hepática",
        "categoria": "Laboratório",
        "resultado": "AST 72 U/L, ALT 81 U/L, GGT 96 U/L.",
        "interpretacao": "Lesão hepatocelular leve associada a depósito crônico."
      },
      {
        "nome": "Genética HFE",
        "categoria": "Genética",
        "resultado": "Homozigose para variante C282Y.",
        "interpretacao": "Confirma forte predisposição genética para hemocromatose hereditária."
      }
    ]
  },
  {
    "titulo": "Olhos amarelados e urina escura",
    "area": "Patologia — Pigmentos",
    "especialidade": "Hepatobiliar",
    "dificuldade": "Facil",
    "cenario": "Pronto atendimento",
    "queixaInicial": "Mulher de 46 anos apresenta dor no quadrante superior direito, olhos amarelados e urina escura há três dias.",
    "dadosIniciais": {
      "idade": "46 anos",
      "sexo": "Feminino",
      "inicio": "Há 3 dias",
      "antecedente": "Episódios prévios de cólica após refeições gordurosas"
    },
    "anamnese": {
      "dor": "Intermitente, intensa, pós-prandial, irradiando para dorso",
      "fezes": "Mais claras que o habitual",
      "urina": "Escura",
      "prurido": "Leve"
    },
    "exameFisico": {
      "pele": "Icterícia visível",
      "abdome": "Dor em hipocôndrio direito sem rigidez difusa",
      "peleMucosas": "Sem palidez acentuada",
      "neurologico": "Normal"
    },
    "sinaisVitais": {
      "PA": "126/78 mmHg",
      "FC": "88 bpm",
      "FR": "17 irpm",
      "temperatura": "37,2 °C",
      "SpO2": "99%"
    },
    "evolucao": {
      "observacao": "A icterícia aumenta nas horas seguintes",
      "pista": "Predomínio de bilirrubina conjugada com colestase e dilatação de via biliar"
    },
    "diagnosticoFinal": "Icterícia obstrutiva por coledocolitíase",
    "explicacaoDiagnostico": "A obstrução do colédoco impede a excreção da bilirrubina conjugada. Isso produz icterícia, colúria, hipocolia fecal e elevação de fosfatase alcalina/GGT, ilustrando acúmulo patológico do pigmento bilirrubina.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Hepatite aguda",
        "justificativa": "Pode causar icterícia e elevação de transaminases.",
        "porqueNaoEPrincipal": "O padrão laboratorial é predominantemente colestático e há dilatação de via biliar."
      },
      {
        "diagnostico": "Anemia hemolítica",
        "justificativa": "Pode gerar icterícia.",
        "porqueNaoEPrincipal": "Esperaria predomínio de bilirrubina indireta, anemia e ausência de colúria por bilirrubina conjugada."
      }
    ],
    "pontosChave": [
      {
        "achado": "Bilirrubina direta elevada",
        "importancia": "Aponta para pigmento conjugado retido por obstrução."
      },
      {
        "achado": "Fezes claras + urina escura",
        "importancia": "Indicam redução de pigmento no intestino e aumento da excreção urinária de bilirrubina conjugada."
      },
      {
        "achado": "Via biliar dilatada",
        "importancia": "Demonstra obstáculo mecânico ao fluxo biliar."
      }
    ],
    "exames": [
      {
        "nome": "Perfil hepático",
        "categoria": "Laboratório",
        "resultado": "Bilirrubina total 6,4 mg/dL, direta 5,3 mg/dL, FA 510 U/L, GGT 440 U/L.",
        "interpretacao": "Padrão colestático com hiperbilirrubinemia conjugada."
      },
      {
        "nome": "Ultrassonografia de abdome",
        "categoria": "Imagem",
        "resultado": "Colelitíase e colédoco dilatado.",
        "interpretacao": "Sugere obstrução extra-hepática."
      },
      {
        "nome": "Colangiorressonância",
        "categoria": "Imagem",
        "resultado": "Cálculo de 7 mm no colédoco distal.",
        "interpretacao": "Localiza a causa da obstrução."
      }
    ]
  },
  {
    "titulo": "Perna vermelha, quente e dolorosa",
    "area": "Patologia — Inflamação",
    "especialidade": "Inflamação Aguda",
    "dificuldade": "Facil",
    "cenario": "Unidade de pronto atendimento",
    "queixaInicial": "Homem de 38 anos apresenta vermelhidão, calor, dor e inchaço na perna direita após pequena escoriação.",
    "dadosIniciais": {
      "idade": "38 anos",
      "sexo": "Masculino",
      "inicio": "48 horas",
      "portaDeEntrada": "Escoriação após trabalho em jardim"
    },
    "anamnese": {
      "progressao": "Área avermelhada aumentou rapidamente",
      "sintomasGerais": "Calafrios e mal-estar",
      "comorbidades": "Sem diabetes",
      "alergias": "Negadas"
    },
    "exameFisico": {
      "pele": "Placa eritematosa quente, dolorosa, de bordas pouco definidas",
      "edema": "Discreto edema local",
      "linfonodos": "Inguinais dolorosos",
      "ferida": "Pequena solução de continuidade"
    },
    "sinaisVitais": {
      "PA": "118/74 mmHg",
      "FC": "104 bpm",
      "FR": "19 irpm",
      "temperatura": "38,4 °C",
      "SpO2": "98%"
    },
    "evolucao": {
      "primeirasHoras": "Aumento do eritema sem tratamento",
      "pista": "Resposta vascular e neutrofílica típica de inflamação aguda bacteriana"
    },
    "diagnosticoFinal": "Celulite bacteriana aguda",
    "explicacaoDiagnostico": "A infecção do tecido cutâneo/subcutâneo desencadeia inflamação aguda com vasodilatação, aumento de permeabilidade, edema, calor, rubor, dor e recrutamento predominante de neutrófilos.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Trombose venosa profunda",
        "justificativa": "Pode causar dor e edema unilateral.",
        "porqueNaoEPrincipal": "Eritema quente associado a porta de entrada cutânea, febre e neutrofilia favorecem infecção."
      },
      {
        "diagnostico": "Dermatite de contato",
        "justificativa": "Pode gerar eritema e edema.",
        "porqueNaoEPrincipal": "Febre, dor intensa, progressão rápida e leucocitose neutrofílica não são típicos."
      }
    ],
    "pontosChave": [
      {
        "achado": "Rubor, calor, tumor e dor",
        "importancia": "Sinais clássicos da inflamação aguda."
      },
      {
        "achado": "Neutrofilia",
        "importancia": "Neutrófilos predominam em muitas respostas bacterianas agudas."
      },
      {
        "achado": "Edema local",
        "importancia": "Decorre do aumento da permeabilidade vascular."
      }
    ],
    "exames": [
      {
        "nome": "Hemograma",
        "categoria": "Laboratório",
        "resultado": "Leucócitos 16.200/mm³, neutrófilos 86%.",
        "interpretacao": "Leucocitose neutrofílica compatível com resposta bacteriana aguda."
      },
      {
        "nome": "Proteína C reativa",
        "categoria": "Laboratório",
        "resultado": "PCR 11,8 mg/dL.",
        "interpretacao": "Marcador de fase aguda elevado."
      },
      {
        "nome": "Ultrassom de partes moles",
        "categoria": "Imagem",
        "resultado": "Espessamento subcutâneo sem coleção organizada.",
        "interpretacao": "Favorece celulite sem abscesso drenável."
      }
    ]
  },
  {
    "titulo": "Tosse que não vai embora",
    "area": "Patologia — Inflamação",
    "especialidade": "Inflamação Crônica",
    "dificuldade": "Medio",
    "cenario": "Ambulatório de pneumologia",
    "queixaInicial": "Homem de 41 anos relata tosse persistente, perda de peso e sudorese noturna há dois meses.",
    "dadosIniciais": {
      "idade": "41 anos",
      "sexo": "Masculino",
      "duracao": "8 semanas",
      "contexto": "Mora com familiar que tratou doença pulmonar infecciosa no ano anterior"
    },
    "anamnese": {
      "tosse": "Produtiva, ocasionalmente com estrias de sangue",
      "peso": "Perda de 7 kg",
      "febre": "Baixa no fim da tarde",
      "tabagismo": "Negado"
    },
    "exameFisico": {
      "estadoGeral": "Emagrecido, lúcido",
      "pulmoes": "Estertores finos em ápice direito",
      "linfonodos": "Cervicais discretamente aumentados",
      "pele": "Sem lesões"
    },
    "sinaisVitais": {
      "PA": "112/70 mmHg",
      "FC": "92 bpm",
      "FR": "20 irpm",
      "temperatura": "37,8 °C",
      "SpO2": "95%"
    },
    "evolucao": {
      "curso": "Sintomas persistentes e progressivos",
      "pista": "Processo prolongado com ativação de macrófagos e formação de granulomas"
    },
    "diagnosticoFinal": "Tuberculose pulmonar com inflamação granulomatosa crônica",
    "explicacaoDiagnostico": "A persistência do Mycobacterium tuberculosis induz resposta celular crônica mediada por linfócitos T e macrófagos, com granulomas e necrose caseosa. O curso arrastado, sintomas constitucionais e lesão apical cavitária são típicos.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Pneumonia bacteriana aguda",
        "justificativa": "Pode causar tosse, febre e infiltrado pulmonar.",
        "porqueNaoEPrincipal": "O curso de 8 semanas, perda ponderal e cavitação apical favorecem tuberculose."
      },
      {
        "diagnostico": "Neoplasia pulmonar",
        "justificativa": "Pode gerar emagrecimento, tosse e hemoptise.",
        "porqueNaoEPrincipal": "A positividade microbiológica e padrão granulomatoso sustentam tuberculose."
      }
    ],
    "pontosChave": [
      {
        "achado": "Curso prolongado",
        "importancia": "É característica de inflamação crônica."
      },
      {
        "achado": "Granulomas",
        "importancia": "Representam tentativa organizada de conter agente persistente."
      },
      {
        "achado": "Linfócitos T e macrófagos",
        "importancia": "São células centrais na resposta granulomatosa."
      }
    ],
    "exames": [
      {
        "nome": "Radiografia de tórax",
        "categoria": "Imagem",
        "resultado": "Infiltrado cavitário em lobo superior direito.",
        "interpretacao": "Padrão compatível com tuberculose pulmonar pós-primária."
      },
      {
        "nome": "Baciloscopia de escarro",
        "categoria": "Microbiologia",
        "resultado": "BAAR positivo em duas amostras.",
        "interpretacao": "Demonstra micobactérias álcool-ácido resistentes."
      },
      {
        "nome": "Teste molecular para M. tuberculosis",
        "categoria": "Microbiologia",
        "resultado": "DNA de M. tuberculosis detectado.",
        "interpretacao": "Confirma etiologia tuberculosa."
      }
    ]
  },
  {
    "titulo": "Infecções respiratórias desde a infância",
    "area": "Imunologia — Sistema Complemento",
    "especialidade": "Deficiência de C3",
    "dificuldade": "Dificil",
    "cenario": "Ambulatório de imunologia",
    "queixaInicial": "Jovem de 19 anos com histórico de pneumonias e sinusites bacterianas recorrentes desde a infância.",
    "dadosIniciais": {
      "idade": "19 anos",
      "sexo": "Feminino",
      "historico": "Múltiplas internações por infecção por bactérias encapsuladas",
      "vacinas": "Esquema vacinal completo"
    },
    "anamnese": {
      "episodios": "Pneumonias, otites e sinusites de repetição",
      "familia": "Primo com quadro semelhante",
      "autoimunidade": "Nega sintomas prévios",
      "medicacoes": "Sem imunossupressores"
    },
    "exameFisico": {
      "estadoAtual": "Sem febre, entre episódios",
      "orofaringe": "Sem alterações",
      "pulmoes": "Sem ruídos adventícios no momento",
      "linfonodos": "Sem aumento significativo"
    },
    "sinaisVitais": {
      "PA": "110/68 mmHg",
      "FC": "72 bpm",
      "FR": "16 irpm",
      "temperatura": "36,4 °C",
      "SpO2": "99%"
    },
    "evolucao": {
      "padrao": "Infecções piogênicas recorrentes persistem apesar de vacinação adequada",
      "pista": "Falha importante de opsonização e ativação central da cascata do complemento"
    },
    "diagnosticoFinal": "Deficiência de C3 do sistema complemento",
    "explicacaoDiagnostico": "C3 é central às vias clássica, alternativa e das lectinas. Sua deficiência compromete opsonização por C3b e resposta contra bactérias encapsuladas, gerando infecções piogênicas recorrentes.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Deficiência de anticorpos",
        "justificativa": "Também causa infecções sinopulmonares recorrentes.",
        "porqueNaoEPrincipal": "Imunoglobulinas estão preservadas e o perfil funcional do complemento aponta para C3."
      },
      {
        "diagnostico": "Deficiência terminal de complemento",
        "justificativa": "Também predispõe a infecções.",
        "porqueNaoEPrincipal": "Deficiências C5-C9 se associam especialmente a Neisseria, enquanto aqui predominam infecções por encapsulados variados."
      }
    ],
    "pontosChave": [
      {
        "achado": "C3 muito baixo",
        "importancia": "É componente central para opsonização e amplificação do complemento."
      },
      {
        "achado": "Infecções por encapsulados",
        "importancia": "Opsonização deficiente reduz fagocitose eficiente."
      },
      {
        "achado": "CH50 e AH50 reduzidos",
        "importancia": "C3 participa das três grandes vias, afetando testes funcionais amplamente."
      }
    ],
    "exames": [
      {
        "nome": "Dosagem de complemento",
        "categoria": "Imunologia",
        "resultado": "C3 12 mg/dL (muito baixo), C4 normal.",
        "interpretacao": "Sugere deficiência seletiva de C3."
      },
      {
        "nome": "CH50",
        "categoria": "Imunologia",
        "resultado": "Atividade hemolítica global muito reduzida.",
        "interpretacao": "Comprometimento da via clássica funcional por falta de componente comum."
      },
      {
        "nome": "Imunoglobulinas séricas",
        "categoria": "Imunologia",
        "resultado": "IgG, IgA e IgM em faixas adequadas.",
        "interpretacao": "Torna deficiência humoral primária menos provável."
      }
    ]
  },
  {
    "titulo": "Meningite de repetição em adulto jovem",
    "area": "Imunologia — Sistema Complemento",
    "especialidade": "Complemento Terminal",
    "dificuldade": "Dificil",
    "cenario": "Enfermaria de infectologia",
    "queixaInicial": "Homem de 23 anos é internado pela segunda vez em quatro anos com meningite meningocócica.",
    "dadosIniciais": {
      "idade": "23 anos",
      "sexo": "Masculino",
      "episodiosPrevios": "Meningococcemia aos 19 anos",
      "vacinas": "Vacinado conforme calendário"
    },
    "anamnese": {
      "infeccoes": "Poucas infecções fora dos episódios por Neisseria",
      "familia": "Tio materno com meningite na juventude",
      "autoimunidade": "Negada",
      "usoDeDrogas": "Negado"
    },
    "exameFisico": {
      "faseAguda": "Rigidez de nuca e petéquias discretas no episódio atual",
      "entreEpisodios": "Exame físico normal",
      "baço": "Não palpável"
    },
    "sinaisVitais": {
      "PA": "102/64 mmHg",
      "FC": "108 bpm",
      "FR": "22 irpm",
      "temperatura": "39,1 °C",
      "SpO2": "97%"
    },
    "evolucao": {
      "tratamento": "Boa resposta ao antibiótico",
      "pista": "Recorrência seletiva de Neisseria sugere falha no complexo de ataque à membrana"
    },
    "diagnosticoFinal": "Deficiência de componente terminal do complemento (C5-C9), compatível com deficiência de C8",
    "explicacaoDiagnostico": "Os componentes C5b-C9 formam o complexo de ataque à membrana. Deficiências terminais aumentam marcadamente o risco de infecções invasivas recorrentes por Neisseria.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Asplenia funcional",
        "justificativa": "Predispõe a infecções graves por encapsulados.",
        "porqueNaoEPrincipal": "O padrão é fortemente seletivo para Neisseria e o baço está preservado."
      },
      {
        "diagnostico": "Deficiência de C3",
        "justificativa": "Pode causar infecções bacterianas recorrentes.",
        "porqueNaoEPrincipal": "C3 sérico está normal e a recorrência meningocócica é mais típica de C5-C9."
      }
    ],
    "pontosChave": [
      {
        "achado": "Neisseria recorrente",
        "importancia": "É pista clássica de deficiência do complemento terminal."
      },
      {
        "achado": "C3 e C4 normais",
        "importancia": "Afasta deficiência central dos componentes medidos."
      },
      {
        "achado": "C8 muito baixo",
        "importancia": "Interrompe a formação eficiente do MAC."
      }
    ],
    "exames": [
      {
        "nome": "C3 e C4",
        "categoria": "Imunologia",
        "resultado": "C3 e C4 dentro da faixa de referência.",
        "interpretacao": "Componentes proximais preservados."
      },
      {
        "nome": "CH50 e AH50",
        "categoria": "Imunologia",
        "resultado": "Ambos praticamente ausentes.",
        "interpretacao": "Defeito em componente terminal compartilhado pelas vias."
      },
      {
        "nome": "Dosagem de C8",
        "categoria": "Imunologia",
        "resultado": "C8 indetectável.",
        "interpretacao": "Identifica deficiência do complemento terminal."
      }
    ]
  },
  {
    "titulo": "Panturrilha inchada após cirurgia",
    "area": "Patologia — Distúrbios Hemodinâmicos",
    "especialidade": "Trombose",
    "dificuldade": "Facil",
    "cenario": "Enfermaria pós-operatória",
    "queixaInicial": "Mulher de 61 anos, no quarto dia após artroplastia de quadril, apresenta dor e aumento de volume da panturrilha esquerda.",
    "dadosIniciais": {
      "idade": "61 anos",
      "sexo": "Feminino",
      "posOperatorio": "4º dia",
      "mobilidade": "Permaneceu grande parte do tempo no leito"
    },
    "anamnese": {
      "dor": "Peso e dor na panturrilha ao caminhar",
      "dispneia": "Negada no momento",
      "historico": "Sem trombose prévia",
      "tabagismo": "Ex-tabagista"
    },
    "exameFisico": {
      "membroEsquerdo": "Edema unilateral, aumento de 3 cm da circunferência da panturrilha",
      "pele": "Discretamente quente",
      "pulsos": "Presentes e simétricos",
      "pulmoes": "Sem alterações"
    },
    "sinaisVitais": {
      "PA": "128/76 mmHg",
      "FC": "90 bpm",
      "FR": "17 irpm",
      "temperatura": "36,9 °C",
      "SpO2": "98%"
    },
    "evolucao": {
      "risco": "Imobilidade e trauma cirúrgico aumentaram estase e estado pró-trombótico",
      "pista": "Quadro ilustra elementos da tríade de Virchow"
    },
    "diagnosticoFinal": "Trombose venosa profunda de membro inferior",
    "explicacaoDiagnostico": "Cirurgia e imobilização promovem estase venosa e hipercoagulabilidade, favorecendo trombose. Edema e dor unilateral associados ao duplex confirmam TVP.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Celulite",
        "justificativa": "Pode causar dor, calor e edema.",
        "porqueNaoEPrincipal": "Ausência de febre e eritema importante, associada a trombo no duplex, favorece TVP."
      },
      {
        "diagnostico": "Ruptura de cisto de Baker",
        "justificativa": "Pode simular edema doloroso da panturrilha.",
        "porqueNaoEPrincipal": "Ultrassom demonstra trombose venosa proximal."
      }
    ],
    "pontosChave": [
      {
        "achado": "Imobilização",
        "importancia": "Promove estase, componente da tríade de Virchow."
      },
      {
        "achado": "Cirurgia",
        "importancia": "Associa lesão endotelial e hipercoagulabilidade."
      },
      {
        "achado": "Edema unilateral",
        "importancia": "É manifestação frequente de obstrução do retorno venoso."
      }
    ],
    "exames": [
      {
        "nome": "D-dímero",
        "categoria": "Laboratório",
        "resultado": "Elevado.",
        "interpretacao": "Indica formação/degradação de fibrina, mas não é específico."
      },
      {
        "nome": "Ultrassom Doppler venoso",
        "categoria": "Imagem",
        "resultado": "Veia poplítea não compressível com trombo intraluminal.",
        "interpretacao": "Confirma trombose venosa profunda."
      },
      {
        "nome": "Hemograma",
        "categoria": "Laboratório",
        "resultado": "Sem leucocitose significativa.",
        "interpretacao": "Torna processo infeccioso sistêmico menos provável."
      }
    ]
  },
  {
    "titulo": "Inchaço no corpo e urina espumosa",
    "area": "Patologia — Distúrbios Hemodinâmicos",
    "especialidade": "Edema",
    "dificuldade": "Medio",
    "cenario": "Ambulatório de nefrologia",
    "queixaInicial": "Homem de 34 anos apresenta edema em pernas e pálpebras e percebe urina muito espumosa.",
    "dadosIniciais": {
      "idade": "34 anos",
      "sexo": "Masculino",
      "duracao": "3 semanas",
      "ganhoDePeso": "5 kg no período"
    },
    "anamnese": {
      "urina": "Espumosa, sem dor",
      "dispneia": "Leve ao esforço",
      "doencaHepatica": "Negada",
      "cardiopatia": "Negada"
    },
    "exameFisico": {
      "edema": "Edema depressível 3+/4+ em membros inferiores",
      "face": "Edema periorbitário matinal",
      "abdome": "Sem ascite volumosa",
      "jugulares": "Sem turgência"
    },
    "sinaisVitais": {
      "PA": "138/86 mmHg",
      "FC": "78 bpm",
      "FR": "17 irpm",
      "temperatura": "36,5 °C",
      "SpO2": "98%"
    },
    "evolucao": {
      "curso": "Edema progride lentamente",
      "pista": "Perda urinária maciça de proteínas reduz pressão oncótica plasmática"
    },
    "diagnosticoFinal": "Síndrome nefrótica com edema por hipoalbuminemia",
    "explicacaoDiagnostico": "Proteinúria importante causa hipoalbuminemia e redução da pressão oncótica plasmática, favorecendo saída de líquido para o interstício. Retenção renal secundária de sódio agrava o edema.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Insuficiência cardíaca",
        "justificativa": "Pode gerar edema periférico.",
        "porqueNaoEPrincipal": "Sem congestão jugular ou cardiopatia e com proteinúria maciça/hipoalbuminemia."
      },
      {
        "diagnostico": "Cirrose",
        "justificativa": "Pode causar hipoalbuminemia e edema.",
        "porqueNaoEPrincipal": "Não há sinais clínicos ou laboratoriais de hepatopatia crônica."
      }
    ],
    "pontosChave": [
      {
        "achado": "Proteinúria maciça",
        "importancia": "É responsável pela perda de albumina."
      },
      {
        "achado": "Albumina sérica baixa",
        "importancia": "Reduz a pressão oncótica intravascular."
      },
      {
        "achado": "Edema depressível generalizado",
        "importancia": "Reflete deslocamento de líquido para o interstício."
      }
    ],
    "exames": [
      {
        "nome": "Proteinúria de 24 horas",
        "categoria": "Laboratório",
        "resultado": "6,2 g/24h.",
        "interpretacao": "Proteinúria em faixa nefrótica."
      },
      {
        "nome": "Albumina sérica",
        "categoria": "Laboratório",
        "resultado": "2,0 g/dL.",
        "interpretacao": "Hipoalbuminemia importante, mecanismo central do edema."
      },
      {
        "nome": "Perfil lipídico",
        "categoria": "Laboratório",
        "resultado": "Colesterol total 318 mg/dL, triglicerídeos 260 mg/dL.",
        "interpretacao": "Hiperlipidemia frequente na síndrome nefrótica."
      }
    ]
  },
  {
    "titulo": "Dor no peito durante o café da manhã",
    "area": "Cardiovascular",
    "especialidade": "Isquemia Miocárdica",
    "dificuldade": "Facil",
    "cenario": "Sala de emergência",
    "queixaInicial": "Homem de 58 anos apresenta dor torácica intensa em aperto há 45 minutos, com sudorese e náusea.",
    "dadosIniciais": {
      "idade": "58 anos",
      "sexo": "Masculino",
      "fatoresDeRisco": "Hipertensão, tabagismo e dislipidemia",
      "inicio": "Repentino em repouso"
    },
    "anamnese": {
      "dor": "Retroesternal, 9/10, irradiando para braço esquerdo",
      "dispneia": "Presente",
      "episodiosPrevios": "Dor aos esforços nas últimas semanas",
      "medicacoes": "Uso irregular de anti-hipertensivo"
    },
    "exameFisico": {
      "estadoGeral": "Pálido e sudorético",
      "cardiovascular": "Bulhas rítmicas, sem sopro novo",
      "pulmoes": "Crepitações discretas em bases",
      "perfusao": "Extremidades frias"
    },
    "sinaisVitais": {
      "PA": "148/92 mmHg",
      "FC": "102 bpm",
      "FR": "22 irpm",
      "temperatura": "36,4 °C",
      "SpO2": "94%"
    },
    "evolucao": {
      "primeiraHora": "Dor persiste e marcadores de necrose aumentam",
      "pista": "Isquemia prolongada causa necrose coagulativa de cardiomiócitos"
    },
    "diagnosticoFinal": "Infarto agudo do miocárdio com supradesnivelamento de ST",
    "explicacaoDiagnostico": "A oclusão coronariana aguda provoca isquemia prolongada e necrose miocárdica. Dor típica, supradesnivelamento de ST e elevação dinâmica de troponina confirmam o evento.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Dissecção aguda de aorta",
        "justificativa": "Pode causar dor torácica súbita grave.",
        "porqueNaoEPrincipal": "Dor não é descrita como transfixante e ECG/troponina demonstram padrão de isquemia coronariana."
      },
      {
        "diagnostico": "Pericardite aguda",
        "justificativa": "Pode cursar com dor e alterações de ST.",
        "porqueNaoEPrincipal": "ST está localizado em território coronariano e há padrão típico de infarto."
      }
    ],
    "pontosChave": [
      {
        "achado": "Dor típica prolongada",
        "importancia": "Sugere síndrome coronariana aguda."
      },
      {
        "achado": "ST elevado regionalmente",
        "importancia": "Indica lesão transmural aguda em território coronariano."
      },
      {
        "achado": "Troponina em ascensão",
        "importancia": "Marca necrose de cardiomiócitos."
      }
    ],
    "exames": [
      {
        "nome": "Eletrocardiograma",
        "categoria": "Cardiologia",
        "resultado": "Supradesnivelamento de ST em DII, DIII e aVF.",
        "interpretacao": "Infarto inferior agudo."
      },
      {
        "nome": "Troponina ultrassensível",
        "categoria": "Laboratório",
        "resultado": "Valor inicial 180 ng/L, aumentando para 1.950 ng/L.",
        "interpretacao": "Curva compatível com necrose miocárdica aguda."
      },
      {
        "nome": "Ecocardiograma",
        "categoria": "Imagem",
        "resultado": "Hipocinesia da parede inferior, FEVE 48%.",
        "interpretacao": "Alteração segmentar correspondente ao território isquêmico."
      }
    ]
  },
  {
    "titulo": "Dormindo sentado para conseguir respirar",
    "area": "Cardiovascular",
    "especialidade": "Doença Crônica",
    "dificuldade": "Medio",
    "cenario": "Ambulatório de cardiologia",
    "queixaInicial": "Mulher de 67 anos relata falta de ar progressiva, necessidade de três travesseiros para dormir e inchaço nas pernas.",
    "dadosIniciais": {
      "idade": "67 anos",
      "sexo": "Feminino",
      "duracao": "8 meses, com piora nas últimas semanas",
      "antecedente": "Infarto do miocárdio há 5 anos"
    },
    "anamnese": {
      "dispneia": "Aos pequenos esforços",
      "ortopneia": "Presente",
      "dispneiaParoxisticaNoturna": "Presente",
      "peso": "Aumento de 4 kg no último mês"
    },
    "exameFisico": {
      "jugulares": "Turgência jugular a 45°",
      "pulmoes": "Estertores bibasais",
      "membrosInferiores": "Edema 2+/4+ bilateral",
      "cardiovascular": "Terceira bulha presente"
    },
    "sinaisVitais": {
      "PA": "108/70 mmHg",
      "FC": "96 bpm",
      "FR": "22 irpm",
      "temperatura": "36,5 °C",
      "SpO2": "93%"
    },
    "evolucao": {
      "curso": "Doença crônica com períodos de compensação e congestão",
      "pista": "Aumento da pressão hidrostática venosa contribui para edema pulmonar e periférico"
    },
    "diagnosticoFinal": "Insuficiência cardíaca crônica com fração de ejeção reduzida, em congestão",
    "explicacaoDiagnostico": "A disfunção sistólica reduz o débito e eleva pressões de enchimento. A pressão hidrostática aumentada promove transudação de líquido para pulmões e membros inferiores, produzindo ortopneia e edema.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Síndrome nefrótica",
        "justificativa": "Pode causar edema generalizado.",
        "porqueNaoEPrincipal": "Há turgência jugular, estertores, BNP elevado e disfunção ventricular."
      },
      {
        "diagnostico": "Doença pulmonar obstrutiva crônica",
        "justificativa": "Pode causar dispneia crônica.",
        "porqueNaoEPrincipal": "Não explica edema congestivo, terceira bulha e fração de ejeção reduzida."
      }
    ],
    "pontosChave": [
      {
        "achado": "Ortopneia e DPN",
        "importancia": "Sugerem congestão pulmonar por aumento de pressões de enchimento."
      },
      {
        "achado": "Edema bilateral",
        "importancia": "Relaciona-se ao aumento da pressão hidrostática venosa sistêmica."
      },
      {
        "achado": "FEVE 30%",
        "importancia": "Demonstra disfunção sistólica crônica."
      }
    ],
    "exames": [
      {
        "nome": "BNP",
        "categoria": "Laboratório",
        "resultado": "BNP 980 pg/mL.",
        "interpretacao": "Fortemente compatível com sobrecarga cardíaca e congestão."
      },
      {
        "nome": "Ecocardiograma",
        "categoria": "Imagem",
        "resultado": "VE dilatado, FEVE 30%, hipocinesia difusa.",
        "interpretacao": "Insuficiência cardíaca com fração de ejeção reduzida."
      },
      {
        "nome": "Radiografia de tórax",
        "categoria": "Imagem",
        "resultado": "Cardiomegalia, redistribuição vascular e pequeno derrame pleural bilateral.",
        "interpretacao": "Sinais de congestão cardiopulmonar."
      }
    ]
  },
  {
    "titulo": "Fígado brilhante no ultrassom",
    "area": "Patologia — Degenerações",
    "especialidade": "Degeneração Gordurosa",
    "dificuldade": "Facil",
    "cenario": "Ambulatório de clínica médica",
    "queixaInicial": "Homem de 45 anos é avaliado por elevação discreta de enzimas hepáticas em exame de rotina.",
    "dadosIniciais": {
      "idade": "45 anos",
      "sexo": "Masculino",
      "IMC": "33 kg/m²",
      "comorbidades": "Diabetes tipo 2 e hipertrigliceridemia"
    },
    "anamnese": {
      "sintomas": "Assintomático, refere apenas cansaço inespecífico",
      "alcool": "Consumo baixo",
      "dieta": "Rica em ultraprocessados",
      "atividadeFisica": "Sedentário"
    },
    "exameFisico": {
      "abdome": "Sem dor, fígado discretamente palpável",
      "pele": "Sem icterícia",
      "estigmasHepaticos": "Ausentes",
      "pressao": "Levemente elevada"
    },
    "sinaisVitais": {
      "PA": "142/88 mmHg",
      "FC": "80 bpm",
      "FR": "16 irpm",
      "temperatura": "36,4 °C",
      "SpO2": "98%"
    },
    "evolucao": {
      "curso": "Alterações laboratoriais persistem por meses",
      "pista": "Acúmulo intracelular de triglicerídeos em hepatócitos é exemplo de degeneração gordurosa"
    },
    "diagnosticoFinal": "Esteatose hepática associada à disfunção metabólica",
    "explicacaoDiagnostico": "Resistência à insulina, obesidade e hipertrigliceridemia favorecem acúmulo de triglicerídeos dentro dos hepatócitos. A esteatose é uma alteração celular potencialmente reversível, podendo progredir se houver inflamação e fibrose.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Hepatite viral crônica",
        "justificativa": "Pode elevar transaminases.",
        "porqueNaoEPrincipal": "Sorologias são negativas e o contexto metabólico com esteatose difusa é predominante."
      },
      {
        "diagnostico": "Doença hepática alcoólica",
        "justificativa": "Também produz esteatose.",
        "porqueNaoEPrincipal": "O consumo relatado é baixo e há forte síndrome metabólica."
      }
    ],
    "pontosChave": [
      {
        "achado": "Obesidade + diabetes",
        "importancia": "São fatores centrais para esteatose metabólica."
      },
      {
        "achado": "Ecogenicidade hepática aumentada",
        "importancia": "É achado de imagem frequente na infiltração gordurosa."
      },
      {
        "achado": "Alteração reversível",
        "importancia": "A degeneração gordurosa pode regredir com correção do insulto metabólico."
      }
    ],
    "exames": [
      {
        "nome": "Enzimas hepáticas",
        "categoria": "Laboratório",
        "resultado": "ALT 72 U/L, AST 48 U/L.",
        "interpretacao": "Elevação leve, comum em doença hepática metabólica."
      },
      {
        "nome": "Ultrassonografia hepática",
        "categoria": "Imagem",
        "resultado": "Aumento difuso da ecogenicidade hepática, sem nódulos.",
        "interpretacao": "Compatível com esteatose."
      },
      {
        "nome": "Sorologias para hepatites B e C",
        "categoria": "Laboratório",
        "resultado": "Negativas.",
        "interpretacao": "Reduz a probabilidade de hepatite viral como explicação."
      }
    ]
  },
  {
    "titulo": "Ferida que não fecha",
    "area": "Patologia — Reparo",
    "especialidade": "Cicatrização",
    "dificuldade": "Medio",
    "cenario": "Ambulatório de feridas",
    "queixaInicial": "Mulher de 59 anos com diabetes apresenta pequena úlcera no pé há seis semanas, com granulação pobre e cicatrização lenta.",
    "dadosIniciais": {
      "idade": "59 anos",
      "sexo": "Feminino",
      "diabetes": "Há 14 anos",
      "tempoDaFerida": "6 semanas"
    },
    "anamnese": {
      "controleGlicemico": "Irregular",
      "dor": "Pouca dor local",
      "febre": "Negada",
      "tabagismo": "Negado"
    },
    "exameFisico": {
      "ferida": "Úlcera plantar de 1,8 cm, bordas espessadas, pouco tecido de granulação",
      "perfusao": "Pulsos pediosos palpáveis",
      "sensibilidade": "Reduzida nos pés",
      "secrecao": "Pequena, sem odor forte"
    },
    "sinaisVitais": {
      "PA": "136/82 mmHg",
      "FC": "78 bpm",
      "FR": "16 irpm",
      "temperatura": "36,6 °C",
      "SpO2": "99%"
    },
    "evolucao": {
      "curso": "Pouca redução da área apesar de curativos adequados",
      "pista": "Hiperglicemia prejudica função leucocitária, angiogênese, fibroblastos e síntese de matriz"
    },
    "diagnosticoFinal": "Reparo tecidual prejudicado por diabetes mellitus mal controlado",
    "explicacaoDiagnostico": "A hiperglicemia crônica altera microcirculação, resposta imune, proliferação de fibroblastos, angiogênese e deposição/remodelamento de colágeno, retardando a cicatrização.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Isquemia arterial crítica",
        "justificativa": "Pode causar úlcera de difícil cicatrização.",
        "porqueNaoEPrincipal": "Pulsos estão presentes e índice tornozelo-braquial não indica isquemia crítica."
      },
      {
        "diagnostico": "Osteomielite",
        "justificativa": "Feridas crônicas podem atingir osso.",
        "porqueNaoEPrincipal": "Imagem não mostra comprometimento ósseo e não há sinais sistêmicos."
      }
    ],
    "pontosChave": [
      {
        "achado": "HbA1c elevada",
        "importancia": "Demonstra controle glicêmico inadequado, fator que retarda reparo."
      },
      {
        "achado": "Granulação pobre",
        "importancia": "Sugere angiogênese e deposição de matriz deficientes."
      },
      {
        "achado": "Perfusão macroscópica preservada",
        "importancia": "Ajuda a separar atraso metabólico de isquemia crítica."
      }
    ],
    "exames": [
      {
        "nome": "Hemoglobina glicada",
        "categoria": "Laboratório",
        "resultado": "HbA1c 10,4%.",
        "interpretacao": "Controle glicêmico muito inadequado."
      },
      {
        "nome": "Índice tornozelo-braquial",
        "categoria": "Vascular",
        "resultado": "0,96.",
        "interpretacao": "Sem evidência de isquemia arterial importante."
      },
      {
        "nome": "Radiografia do pé",
        "categoria": "Imagem",
        "resultado": "Sem erosão cortical ou sinais de osteomielite.",
        "interpretacao": "Complicação óssea não demonstrada."
      }
    ]
  },
  {
    "titulo": "Reação minutos após comer amendoim",
    "area": "Imunologia — Hipersensibilidade",
    "especialidade": "Tipo I",
    "dificuldade": "Facil",
    "cenario": "Emergência",
    "queixaInicial": "Jovem de 21 anos desenvolve urticária, chiado e tontura poucos minutos após ingerir alimento com amendoim.",
    "dadosIniciais": {
      "idade": "21 anos",
      "sexo": "Feminino",
      "inicio": "Cerca de 8 minutos após ingestão",
      "historico": "Rinite alérgica desde a infância"
    },
    "anamnese": {
      "sintomas": "Prurido, placas urticariformes, aperto na garganta e dispneia",
      "exposicao": "Sobremesa continha pasta de amendoim",
      "episodioPrevio": "Reação cutânea leve no passado",
      "medicacoes": "Nenhuma nova"
    },
    "exameFisico": {
      "pele": "Urticária disseminada",
      "respiratorio": "Sibilos difusos",
      "orofaringe": "Edema de lábios",
      "perfusao": "Extremidades frias"
    },
    "sinaisVitais": {
      "PA": "82/48 mmHg",
      "FC": "126 bpm",
      "FR": "28 irpm",
      "temperatura": "36,5 °C",
      "SpO2": "90%"
    },
    "evolucao": {
      "inicio": "Quadro sistêmico de instalação muito rápida",
      "pista": "Mastócitos sensibilizados por IgE liberam mediadores imediatamente após reexposição"
    },
    "diagnosticoFinal": "Anafilaxia mediada por hipersensibilidade tipo I",
    "explicacaoDiagnostico": "Na hipersensibilidade imediata, IgE ligada a mastócitos é entrecruzada pelo alérgeno, levando à degranulação e liberação de histamina e outros mediadores. Urticária, broncoespasmo e hipotensão em minutos são típicos.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Crise de asma isolada",
        "justificativa": "Pode causar sibilância e dispneia.",
        "porqueNaoEPrincipal": "Não explica urticária disseminada, edema labial e hipotensão súbita após alimento."
      },
      {
        "diagnostico": "Reação vasovagal",
        "justificativa": "Pode causar hipotensão e tontura.",
        "porqueNaoEPrincipal": "Não causa urticária, broncoespasmo ou elevação de triptase."
      }
    ],
    "pontosChave": [
      {
        "achado": "Início em minutos",
        "importancia": "Caracteriza resposta imediata."
      },
      {
        "achado": "Urticária + broncoespasmo + hipotensão",
        "importancia": "Mostra comprometimento multissistêmico compatível com anafilaxia."
      },
      {
        "achado": "Triptase elevada",
        "importancia": "Apoia ativação/degranulação mastocitária."
      }
    ],
    "exames": [
      {
        "nome": "Triptase sérica",
        "categoria": "Imunologia",
        "resultado": "Elevada na amostra coletada após o evento.",
        "interpretacao": "Evidência de ativação mastocitária sistêmica."
      },
      {
        "nome": "IgE específica para amendoim",
        "categoria": "Imunologia",
        "resultado": "Positiva em título elevado.",
        "interpretacao": "Demonstra sensibilização IgE ao alérgeno."
      },
      {
        "nome": "Gasometria arterial",
        "categoria": "Laboratório",
        "resultado": "Hipoxemia leve durante broncoespasmo.",
        "interpretacao": "Reflete comprometimento respiratório agudo."
      }
    ]
  },
  {
    "titulo": "Sangue na urina e falta de ar",
    "area": "Imunologia — Hipersensibilidade",
    "especialidade": "Tipo II",
    "dificuldade": "Dificil",
    "cenario": "Enfermaria de nefrologia",
    "queixaInicial": "Homem de 27 anos apresenta hemoptise, dispneia e urina escura, com aumento rápido da creatinina.",
    "dadosIniciais": {
      "idade": "27 anos",
      "sexo": "Masculino",
      "inicio": "10 dias",
      "contexto": "Sem doença renal prévia conhecida"
    },
    "anamnese": {
      "respiratorio": "Tosse com sangue em pequenas quantidades",
      "urinario": "Urina avermelhada e redução do volume",
      "articular": "Sem artrite importante",
      "medicacoes": "Sem anticoagulantes"
    },
    "exameFisico": {
      "estadoGeral": "Pálido, dispneico",
      "pulmoes": "Estertores difusos",
      "edema": "Discreto em tornozelos",
      "pele": "Sem púrpura"
    },
    "sinaisVitais": {
      "PA": "154/94 mmHg",
      "FC": "98 bpm",
      "FR": "24 irpm",
      "temperatura": "36,8 °C",
      "SpO2": "91%"
    },
    "evolucao": {
      "curso": "Creatinina sobe rapidamente",
      "pista": "Anticorpos dirigidos contra antígeno fixo em membrana basal geram lesão tecidual"
    },
    "diagnosticoFinal": "Doença anti-membrana basal glomerular (síndrome de Goodpasture), hipersensibilidade tipo II",
    "explicacaoDiagnostico": "Autoanticorpos IgG contra a membrana basal de glomérulos e alvéolos ativam inflamação e complemento sobre antígeno fixo. O padrão linear de IgG é característico de mecanismo tipo II.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Granulomatose com poliangiíte",
        "justificativa": "Pode causar síndrome pulmão-rim.",
        "porqueNaoEPrincipal": "ANCA é negativo e há anti-MBG positivo com imunofluorescência linear."
      },
      {
        "diagnostico": "Nefrite lúpica",
        "justificativa": "Pode gerar glomerulonefrite e manifestação pulmonar.",
        "porqueNaoEPrincipal": "ANA/anti-dsDNA não sustentam lúpus e o padrão de depósito não é granular."
      }
    ],
    "pontosChave": [
      {
        "achado": "Anti-MBG positivo",
        "importancia": "Identifica autoanticorpo contra antígeno estrutural fixo."
      },
      {
        "achado": "IgG linear",
        "importancia": "Padrão clássico de depósito ao longo da membrana basal."
      },
      {
        "achado": "Pulmão + rim",
        "importancia": "Expressão clínica típica da doença anti-MBG."
      }
    ],
    "exames": [
      {
        "nome": "Anticorpo anti-MBG",
        "categoria": "Imunologia",
        "resultado": "Fortemente positivo.",
        "interpretacao": "Sustenta doença anti-membrana basal."
      },
      {
        "nome": "Imunofluorescência renal",
        "categoria": "Patologia",
        "resultado": "Depósito linear de IgG ao longo da membrana basal glomerular.",
        "interpretacao": "Padrão típico de mecanismo por anticorpo contra antígeno fixo."
      },
      {
        "nome": "Urina tipo I",
        "categoria": "Laboratório",
        "resultado": "Hematúria, proteinúria e cilindros hemáticos.",
        "interpretacao": "Glomerulonefrite ativa."
      }
    ]
  },
  {
    "titulo": "Rash, dor nas juntas e rim inflamado",
    "area": "Imunologia — Hipersensibilidade",
    "especialidade": "Tipo III",
    "dificuldade": "Dificil",
    "cenario": "Ambulatório de reumatologia",
    "queixaInicial": "Mulher de 24 anos apresenta fadiga, artralgia, erupção facial após sol e edema nas pernas.",
    "dadosIniciais": {
      "idade": "24 anos",
      "sexo": "Feminino",
      "duracao": "4 meses",
      "familia": "Mãe com doença autoimune"
    },
    "anamnese": {
      "pele": "Rash após exposição solar",
      "articulacoes": "Dor e rigidez em mãos",
      "urinario": "Urina mais espumosa",
      "febre": "Baixa ocasional"
    },
    "exameFisico": {
      "pele": "Eritema malar poupando sulco nasolabial",
      "articulacoes": "Dolorosas sem destruição",
      "edema": "1+/4+ em pernas",
      "mucosa": "Pequena úlcera oral indolor"
    },
    "sinaisVitais": {
      "PA": "146/92 mmHg",
      "FC": "86 bpm",
      "FR": "17 irpm",
      "temperatura": "37,3 °C",
      "SpO2": "99%"
    },
    "evolucao": {
      "curso": "Sintomas flutuam em surtos",
      "pista": "Complexos antígeno-anticorpo depositados ativam complemento e inflamação"
    },
    "diagnosticoFinal": "Nefrite lúpica por deposição de imunocomplexos, mecanismo de hipersensibilidade tipo III",
    "explicacaoDiagnostico": "No lúpus, autoantígenos e autoanticorpos formam imunocomplexos que se depositam em tecidos, especialmente glomérulos, ativando complemento. Hipocomplementemia e padrão granular são compatíveis com hipersensibilidade tipo III.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Doença anti-MBG",
        "justificativa": "Pode causar glomerulonefrite.",
        "porqueNaoEPrincipal": "A imunofluorescência é granular e há manifestações sistêmicas/autoanticorpos típicos de lúpus."
      },
      {
        "diagnostico": "Artrite reumatoide",
        "justificativa": "Pode causar artralgia inflamatória.",
        "porqueNaoEPrincipal": "Não explica nefrite por imunocomplexos, rash fotossensível e anti-dsDNA elevado."
      }
    ],
    "pontosChave": [
      {
        "achado": "C3 e C4 baixos",
        "importancia": "Indicam consumo do complemento por imunocomplexos."
      },
      {
        "achado": "Anti-dsDNA elevado",
        "importancia": "Associa-se à atividade de nefrite lúpica."
      },
      {
        "achado": "Depósito granular",
        "importancia": "Caracteriza distribuição de imunocomplexos."
      }
    ],
    "exames": [
      {
        "nome": "ANA e anti-dsDNA",
        "categoria": "Imunologia",
        "resultado": "ANA 1:640; anti-dsDNA fortemente positivo.",
        "interpretacao": "Perfil autoimune compatível com lúpus."
      },
      {
        "nome": "C3 e C4",
        "categoria": "Imunologia",
        "resultado": "Ambos reduzidos.",
        "interpretacao": "Consumo de complemento em doença por imunocomplexos."
      },
      {
        "nome": "Imunofluorescência renal",
        "categoria": "Patologia",
        "resultado": "Depósitos granulares de imunoglobulinas e complemento.",
        "interpretacao": "Padrão de imunocomplexos."
      }
    ]
  },
  {
    "titulo": "Coceira exatamente onde encosta o metal",
    "area": "Imunologia — Hipersensibilidade",
    "especialidade": "Tipo IV",
    "dificuldade": "Facil",
    "cenario": "Ambulatório de dermatologia",
    "queixaInicial": "Mulher de 29 anos apresenta lesões pruriginosas no pescoço e no lóbulo das orelhas dois dias após usar bijuterias.",
    "dadosIniciais": {
      "idade": "29 anos",
      "sexo": "Feminino",
      "inicio": "36 a 48 horas após uso de novo colar e brincos",
      "historico": "Episódios semelhantes com cintos metálicos"
    },
    "anamnese": {
      "prurido": "Intenso",
      "dor": "Leve ardor",
      "medicacoes": "Nenhuma nova",
      "atopia": "Dermatite na infância"
    },
    "exameFisico": {
      "pele": "Placas eritematosas e vesiculares restritas às áreas de contato",
      "distribuicao": "Pescoço e lóbulos",
      "sinaisSistemicos": "Ausentes",
      "mucosas": "Normais"
    },
    "sinaisVitais": {
      "PA": "116/72 mmHg",
      "FC": "70 bpm",
      "FR": "15 irpm",
      "temperatura": "36,4 °C",
      "SpO2": "99%"
    },
    "evolucao": {
      "aposRemocao": "Melhora gradual após afastar o metal",
      "pista": "Resposta tardia mediada por linfócitos T, sem papel central de IgE"
    },
    "diagnosticoFinal": "Dermatite alérgica de contato por níquel, hipersensibilidade tipo IV",
    "explicacaoDiagnostico": "Níquel atua como hapteno e desencadeia resposta celular tardia mediada por linfócitos T sensibilizados. O intervalo de 24-72 horas e a distribuição no local de contato são típicos de tipo IV.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Urticária de contato",
        "justificativa": "Pode ocorrer após exposição cutânea.",
        "porqueNaoEPrincipal": "Urticária surge em minutos e forma habões transitórios, não eczema vesicular tardio."
      },
      {
        "diagnostico": "Dermatite irritativa",
        "justificativa": "Também ocorre em área de contato.",
        "porqueNaoEPrincipal": "Teste de contato específico positivo e histórico de reexposição favorecem alergia celular."
      }
    ],
    "pontosChave": [
      {
        "achado": "Início após 36-48 horas",
        "importancia": "Atraso temporal é típico de hipersensibilidade tipo IV."
      },
      {
        "achado": "Lesão limitada ao contato",
        "importancia": "Relaciona diretamente o antígeno à resposta cutânea."
      },
      {
        "achado": "Patch test positivo",
        "importancia": "Demonstra sensibilização celular ao níquel."
      }
    ],
    "exames": [
      {
        "nome": "Teste de contato (patch test)",
        "categoria": "Alergologia",
        "resultado": "Reação eczematosa positiva para sulfato de níquel em 48-72 horas.",
        "interpretacao": "Confirma hipersensibilidade tardia ao níquel."
      },
      {
        "nome": "IgE total",
        "categoria": "Imunologia",
        "resultado": "Sem elevação relevante.",
        "interpretacao": "Não apoia mecanismo imediato mediado por IgE."
      },
      {
        "nome": "Hemograma",
        "categoria": "Laboratório",
        "resultado": "Sem eosinofilia significativa.",
        "interpretacao": "Não há padrão sistêmico típico de reação alérgica imediata."
      }
    ]
  },
  {
    "titulo": "Barriga aumentada e baço grande após anos no interior",
    "area": "Parasitologia",
    "especialidade": "Esquistossomose",
    "dificuldade": "Medio",
    "cenario": "Ambulatório de infectologia",
    "queixaInicial": "Homem de 48 anos, criado em área rural, apresenta aumento do abdome, cansaço e episódios de sangue nas fezes.",
    "dadosIniciais": {
      "idade": "48 anos",
      "sexo": "Masculino",
      "origem": "Zona rural com contato frequente com água doce na infância",
      "duracao": "Sintomas progressivos há anos"
    },
    "anamnese": {
      "contato": "Banhos frequentes em açudes e rios",
      "digestivo": "Desconforto abdominal e episódios antigos de diarreia com sangue",
      "alcool": "Baixo consumo",
      "hepatite": "Sem história conhecida"
    },
    "exameFisico": {
      "abdome": "Esplenomegalia importante e fígado de consistência aumentada",
      "ascite": "Discreta",
      "pele": "Sem icterícia intensa",
      "circulacaoColateral": "Leve"
    },
    "sinaisVitais": {
      "PA": "114/70 mmHg",
      "FC": "82 bpm",
      "FR": "17 irpm",
      "temperatura": "36,6 °C",
      "SpO2": "98%"
    },
    "evolucao": {
      "curso": "Hipertensão portal progressiva com função hepatocelular relativamente preservada",
      "pista": "Ovos retidos induzem inflamação granulomatosa e fibrose periportal"
    },
    "diagnosticoFinal": "Esquistossomose mansônica hepatoesplênica com fibrose periportal e hipertensão portal",
    "explicacaoDiagnostico": "Ovos de Schistosoma mansoni depositados no sistema portal provocam reação granulomatosa crônica e fibrose periportal. A resistência ao fluxo portal gera esplenomegalia, varizes e ascite.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Cirrose alcoólica",
        "justificativa": "Pode causar hipertensão portal e ascite.",
        "porqueNaoEPrincipal": "Consumo alcoólico é baixo, função hepatocelular é relativamente preservada e há exposição/ovos compatíveis com esquistossomose."
      },
      {
        "diagnostico": "Hepatite viral crônica",
        "justificativa": "Também pode evoluir com fibrose e hipertensão portal.",
        "porqueNaoEPrincipal": "Sorologias negativas e padrão ultrassonográfico periportal característico."
      }
    ],
    "pontosChave": [
      {
        "achado": "Contato antigo com água doce",
        "importancia": "É via epidemiológica clássica de exposição ao S. mansoni."
      },
      {
        "achado": "Fibrose periportal",
        "importancia": "Resulta da resposta crônica aos ovos no sistema portal."
      },
      {
        "achado": "Esplenomegalia",
        "importancia": "Expressa hipertensão portal crônica."
      }
    ],
    "exames": [
      {
        "nome": "Exame parasitológico de fezes",
        "categoria": "Parasitologia",
        "resultado": "Ovos compatíveis com Schistosoma mansoni.",
        "interpretacao": "Demonstra infecção pelo parasito."
      },
      {
        "nome": "Ultrassonografia abdominal",
        "categoria": "Imagem",
        "resultado": "Fibrose periportal, esplenomegalia e sinais de hipertensão portal.",
        "interpretacao": "Padrão da forma hepatoesplênica."
      },
      {
        "nome": "Hemograma",
        "categoria": "Laboratório",
        "resultado": "Plaquetopenia e eosinofilia discreta.",
        "interpretacao": "Plaquetopenia pode refletir hiperesplenismo; eosinofilia apoia parasitose."
      }
    ]
  },
  {
    "titulo": "Desmaios e coração dilatado anos depois",
    "area": "Parasitologia",
    "especialidade": "Doença de Chagas Crônica",
    "dificuldade": "Dificil",
    "cenario": "Ambulatório de cardiologia",
    "queixaInicial": "Homem de 56 anos, nascido em área rural, apresenta palpitações, episódios de desmaio e falta de ar progressiva.",
    "dadosIniciais": {
      "idade": "56 anos",
      "sexo": "Masculino",
      "origem": "Casa de taipa na infância em área endêmica",
      "duracao": "Sintomas cardíacos há 3 anos"
    },
    "anamnese": {
      "palpitacoes": "Frequentes e irregulares",
      "sincope": "Dois episódios no último mês",
      "dispneia": "Aos esforços",
      "digestivo": "Constipação crônica leve"
    },
    "exameFisico": {
      "cardiovascular": "Ritmo irregular, bulhas hipofonéticas",
      "pulmoes": "Estertores discretos em bases",
      "membros": "Edema 1+/4+",
      "perfusao": "Preservada em repouso"
    },
    "sinaisVitais": {
      "PA": "106/68 mmHg",
      "FC": "58 bpm, irregular",
      "FR": "20 irpm",
      "temperatura": "36,5 °C",
      "SpO2": "95%"
    },
    "evolucao": {
      "curso": "Cardiomiopatia crônica com distúrbios de condução e arritmias",
      "pista": "Lesão inflamatória/fibrótica do miocárdio e sistema de condução pode persistir décadas após infecção"
    },
    "diagnosticoFinal": "Cardiomiopatia chagásica crônica por Trypanosoma cruzi",
    "explicacaoDiagnostico": "A doença de Chagas crônica pode causar miocardite persistente, fibrose, dilatação ventricular, bloqueios de condução e arritmias. Epidemiologia, sorologia e padrão eletrocardiográfico sustentam o diagnóstico.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Cardiomiopatia dilatada idiopática",
        "justificativa": "Pode causar insuficiência cardíaca e arritmias.",
        "porqueNaoEPrincipal": "Exposição epidemiológica, sorologia positiva e distúrbios de condução típicos apontam para Chagas."
      },
      {
        "diagnostico": "Doença isquêmica crônica",
        "justificativa": "Pode causar disfunção ventricular.",
        "porqueNaoEPrincipal": "Coronárias sem obstruções significativas e sorologia para T. cruzi positiva."
      }
    ],
    "pontosChave": [
      {
        "achado": "Bloqueio de ramo direito + hemibloqueio anterior",
        "importancia": "Combinação clássica na cardiopatia chagásica."
      },
      {
        "achado": "Sorologia positiva em dois métodos",
        "importancia": "Confirma infecção crônica por T. cruzi."
      },
      {
        "achado": "Aneurisma apical",
        "importancia": "Alteração estrutural característica da forma cardíaca crônica."
      }
    ],
    "exames": [
      {
        "nome": "Eletrocardiograma",
        "categoria": "Cardiologia",
        "resultado": "Bloqueio de ramo direito, hemibloqueio anterior esquerdo e extrassístoles ventriculares.",
        "interpretacao": "Distúrbios de condução compatíveis com cardiopatia chagásica."
      },
      {
        "nome": "Sorologia para T. cruzi",
        "categoria": "Parasitologia",
        "resultado": "Dois testes sorológicos de princípios distintos positivos.",
        "interpretacao": "Confirma infecção crônica."
      },
      {
        "nome": "Ecocardiograma",
        "categoria": "Imagem",
        "resultado": "VE dilatado, FEVE 35% e pequeno aneurisma apical.",
        "interpretacao": "Cardiomiopatia dilatada com alteração sugestiva de Chagas."
      }
    ]
  },
  {
    "titulo": "Nódulo móvel na mama de uma jovem",
    "area": "Oncologia — Tumores",
    "especialidade": "Tumor Benigno",
    "dificuldade": "Facil",
    "cenario": "Ambulatório de mastologia",
    "queixaInicial": "Mulher de 22 anos percebe nódulo indolor na mama direita durante autoexame.",
    "dadosIniciais": {
      "idade": "22 anos",
      "sexo": "Feminino",
      "duracao": "4 meses",
      "crescimento": "Discreto, sem crescimento acelerado"
    },
    "anamnese": {
      "dor": "Ausente",
      "secrecaoPapilar": "Negada",
      "familia": "Sem câncer de mama em parentes de primeiro grau",
      "ciclo": "Nódulo fica discretamente mais sensível no período pré-menstrual"
    },
    "exameFisico": {
      "mamaDireita": "Nódulo de 2 cm, bem delimitado, móvel e fibroelástico",
      "pele": "Sem retração",
      "mamilo": "Sem secreção",
      "axila": "Sem linfonodos suspeitos"
    },
    "sinaisVitais": {
      "PA": "110/70 mmHg",
      "FC": "72 bpm",
      "FR": "15 irpm",
      "temperatura": "36,4 °C",
      "SpO2": "99%"
    },
    "evolucao": {
      "curso": "Permanece estável",
      "pista": "Tumores benignos tendem a ser bem delimitados, expansivos e semelhantes ao tecido de origem"
    },
    "diagnosticoFinal": "Fibroadenoma mamário benigno",
    "explicacaoDiagnostico": "Fibroadenoma é neoplasia benigna bifásica comum em mulheres jovens. Mobilidade, limites nítidos, ausência de invasão e histologia sem atipia sustentam comportamento benigno.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Carcinoma mamário",
        "justificativa": "Pode se apresentar como nódulo mamário.",
        "porqueNaoEPrincipal": "Idade jovem, mobilidade, contornos regulares e biópsia sem atipia/invasão favorecem benignidade."
      },
      {
        "diagnostico": "Cisto mamário",
        "justificativa": "Também pode formar nódulo bem delimitado.",
        "porqueNaoEPrincipal": "Ultrassom mostra lesão sólida homogênea e não conteúdo líquido."
      }
    ],
    "pontosChave": [
      {
        "achado": "Bem delimitado e móvel",
        "importancia": "Sugere crescimento expansivo sem invasão."
      },
      {
        "achado": "Sem atipia",
        "importancia": "Diferencia de neoplasia maligna epitelial."
      },
      {
        "achado": "Jovem adulta",
        "importancia": "Faixa etária típica de fibroadenoma."
      }
    ],
    "exames": [
      {
        "nome": "Ultrassonografia mamária",
        "categoria": "Imagem",
        "resultado": "Nódulo sólido oval, paralelo à pele, margens circunscritas, 2,1 cm.",
        "interpretacao": "Morfologia provavelmente benigna."
      },
      {
        "nome": "Biópsia por agulha grossa",
        "categoria": "Patologia",
        "resultado": "Proliferação estromal e glandular sem atipia ou invasão.",
        "interpretacao": "Compatível com fibroadenoma."
      },
      {
        "nome": "Avaliação axilar",
        "categoria": "Imagem",
        "resultado": "Sem linfonodos suspeitos.",
        "interpretacao": "Ausência de sinais de disseminação."
      }
    ]
  },
  {
    "titulo": "Anemia que não melhora e hábito intestinal mudou",
    "area": "Oncologia — Tumores",
    "especialidade": "Tumor Maligno",
    "dificuldade": "Medio",
    "cenario": "Ambulatório de gastroenterologia",
    "queixaInicial": "Homem de 63 anos apresenta cansaço, perda de 7 kg e mudança recente do hábito intestinal.",
    "dadosIniciais": {
      "idade": "63 anos",
      "sexo": "Masculino",
      "duracao": "5 meses",
      "achadoPrevio": "Anemia ferropriva em exames recentes"
    },
    "anamnese": {
      "intestinal": "Alternância entre constipação e evacuações mais frequentes",
      "sangramento": "Sangue oculto percebido apenas em teste",
      "apetite": "Reduzido",
      "familia": "Pai teve câncer colorretal aos 70 anos"
    },
    "exameFisico": {
      "estadoGeral": "Pálido e emagrecido",
      "abdome": "Leve desconforto em quadrante inferior esquerdo",
      "linfonodos": "Sem adenomegalias periféricas importantes",
      "toqueRetal": "Sem massa palpável baixa"
    },
    "sinaisVitais": {
      "PA": "122/76 mmHg",
      "FC": "88 bpm",
      "FR": "17 irpm",
      "temperatura": "36,5 °C",
      "SpO2": "98%"
    },
    "evolucao": {
      "curso": "Anemia e perda ponderal progridem",
      "pista": "Neoplasias malignas apresentam atipia, invasão tecidual e potencial metastático"
    },
    "diagnosticoFinal": "Adenocarcinoma colorretal",
    "explicacaoDiagnostico": "Lesão colônica irregular associada a anemia ferropriva, perda de peso e alteração do hábito intestinal, com biópsia mostrando glândulas malignas infiltrando estroma, define adenocarcinoma.",
    "diagnosticosDiferenciais": [
      {
        "diagnostico": "Doença diverticular",
        "justificativa": "Pode causar alteração intestinal e sangramento.",
        "porqueNaoEPrincipal": "Não explica massa infiltrativa com biópsia maligna."
      },
      {
        "diagnostico": "Doença inflamatória intestinal",
        "justificativa": "Pode cursar com sangramento e perda de peso.",
        "porqueNaoEPrincipal": "Colonoscopia demonstra lesão focal vegetoinfiltrativa e histologia neoplásica."
      }
    ],
    "pontosChave": [
      {
        "achado": "Invasão da submucosa",
        "importancia": "Invasão é característica fundamental de malignidade."
      },
      {
        "achado": "Atipia glandular",
        "importancia": "Reflete transformação neoplásica epitelial."
      },
      {
        "achado": "Anemia ferropriva",
        "importancia": "Pode resultar de sangramento gastrointestinal crônico oculto."
      }
    ],
    "exames": [
      {
        "nome": "Hemograma e ferritina",
        "categoria": "Laboratório",
        "resultado": "Hb 9,6 g/dL, VCM 72 fL, ferritina 8 ng/mL.",
        "interpretacao": "Anemia ferropriva por perda crônica."
      },
      {
        "nome": "Colonoscopia",
        "categoria": "Endoscopia",
        "resultado": "Lesão vegetoinfiltrativa de 4 cm no cólon descendente, friável ao toque.",
        "interpretacao": "Lesão suspeita para neoplasia maligna."
      },
      {
        "nome": "Biópsia da lesão",
        "categoria": "Patologia",
        "resultado": "Glândulas atípicas infiltrando estroma com desmoplasia.",
        "interpretacao": "Adenocarcinoma invasivo."
      }
    ]
  }
];


export async function
sincronizarCasosFaculdade() {

  const jaAplicado =
    await prisma
      .appConfig
      .findUnique({
        where: {
          chave:
            CHAVE_CARGA,
        },
      });


  if (jaAplicado) {

    console.log(
      "[casos] Carga da faculdade ja aplicada."
    );

    return;
  }


  const autor =
    await prisma
      .usuario
      .findFirst({
        orderBy: {
          id:
            "asc",
        },

        select: {
          id:
            true,
        },
      });


  if (!autor) {

    console.warn(
      "[casos] Nenhum usuario encontrado; carga de casos adiada."
    );

    return;
  }


  await prisma
    .$transaction(
      async function (
        tx
      ) {

        /*
         * Pedido da nova grade: os casos antigos deixam de existir.
         * As relacoes de investigacao e registros sao removidas
         * por cascade a partir de CasoClinico.
         */
        await tx
          .casoClinico
          .deleteMany({});


        for (
          const caso
          of casos
        ) {

          await tx
            .casoClinico
            .create({
              data: {
                titulo:
                  caso.titulo,

                area:
                  caso.area,

                especialidade:
                  caso.especialidade,

                dificuldade:
                  caso.dificuldade,

                cenario:
                  caso.cenario,

                queixaInicial:
                  caso.queixaInicial,

                dadosIniciais:
                  caso.dadosIniciais,

                anamnese:
                  caso.anamnese,

                exameFisico:
                  caso.exameFisico,

                sinaisVitais:
                  caso.sinaisVitais,

                exames:
                  caso.exames,

                evolucao:
                  caso.evolucao,

                diagnosticoFinal:
                  caso.diagnosticoFinal,

                explicacaoDiagnostico:
                  caso.explicacaoDiagnostico,

                diagnosticosDiferenciais:
                  caso
                    .diagnosticosDiferenciais,

                pontosChave:
                  caso.pontosChave,

                publicado:
                  true,

                geradoPorIA:
                  false,

                autorId:
                  autor.id,
              },
            });

        }


        await tx
          .appConfig
          .create({
            data: {
              chave:
                CHAVE_CARGA,

              valor: {
                versao:
                  1,

                quantidade:
                  casos.length,

                descricao:
                  "20 casos de Patologia, Imunologia, Parasitologia, Cardiovascular e Oncologia.",
              },
            },
          });

      }
    );


  console.log(
    "[casos] Removidos casos antigos e inseridos",
    casos.length,
    "casos da grade da faculdade."
  );

}
