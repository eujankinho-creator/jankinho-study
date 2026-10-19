/**
 * FGV Prefeitura de Caraguatatuba, Edital 03/2023, prova de Enfermeiro
 * aplicada em 28/01/2024, Tipo 1. Conteúdo sob autorização informada
 * pelo responsável do Córtex. Origem: https://conhecimento.fgv.br/sites/default/files/concursos/cns310e3-enfermeirocns310e3-tipo-1.pdf
 * Gabarito definitivo: https://conhecimento.fgv.br/sites/default/files/concursos/caraguatatuba2024e0302_gabarito_definitivo_20240226.pdf
 * Inclui Q31–60, exceto Q37 (figura ECG não reproduzível)
 * e Q38 (anulada). Todas as opções A–E originais.
 */
export type QuestaoFGVCaragua2024={numero:number;disciplina:string;assunto:string;enunciado:string;alternativas:{letra:string;texto:string}[];correta:string};
export const QUESTOES_FGV_CARAGUA_2024: QuestaoFGVCaragua2024[]=[
  {
    "numero": 31,
    "disciplina": "Legislação do SUS",
    "assunto": "Princípios e Diretrizes do SUS",
    "enunciado": "Entre os princípios organizativos do Sistema Único de Saúde, aquele que tem por objetivo a redistribuição do poder e das responsabilidades entre os três níveis de governo com a concepção constitucional do mando único, onde cada esfera é autônoma e soberana nas suas decisões e atividades é o princípio da",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Equidade."
      },
      {
        "letra": "B",
        "texto": "Universalidade."
      },
      {
        "letra": "C",
        "texto": "Integralidade."
      },
      {
        "letra": "D",
        "texto": "Hierarquização."
      },
      {
        "letra": "E",
        "texto": "Descentralização."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 32,
    "disciplina": "Saúde Coletiva I",
    "assunto": "Promoção da Saúde",
    "enunciado": "Na Politica Nacional de Promoção da Saúde - PNPS, os temas transversais são referências para a formulação de agendas de promoção da saúde e para a adoçã o de estratégias e temas prioritários. Um dos temas prioritários da PNPS diz respeito a",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Promoção da cultura da paz em comunidades, territórios e municípios."
      },
      {
        "letra": "B",
        "texto": "Estímulo à cooperação e à articulação intrassetorial e intersetorial."
      },
      {
        "letra": "C",
        "texto": "Determinantes Sociais da Saúde (DSS), equidade e respeito à diversidade."
      },
      {
        "letra": "D",
        "texto": "O incentivo à gestão democrática, participativa e transparente."
      },
      {
        "letra": "E",
        "texto": "A ampliação da governança no desenvolvimento de ações de promoção da saúde."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 33,
    "disciplina": "Enfermagem",
    "assunto": "Teorias de Enfermagem",
    "enunciado": "A teoria de enfermagem que destaca as interferências e condições do ambiente que afetam a vida e o funcionamento do organismo, e que podem auxiliar na prevenção da doença ou contribuir para a morte foi desenvolvida por:",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Callista Roy."
      },
      {
        "letra": "B",
        "texto": "Wanda Horta."
      },
      {
        "letra": "C",
        "texto": "Dorothea Orem."
      },
      {
        "letra": "D",
        "texto": "Florence Nightingale."
      },
      {
        "letra": "E",
        "texto": "Hildegard Peplau."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 34,
    "disciplina": "Enfermagem",
    "assunto": "Gestão em Enfermagem",
    "enunciado": "Com base nas disposições acerca do dimensionamento dos profissionais de enfermagem, analise as afirmativas a seguir e assinale V para a verdadeira e F para a falsa ( ) Para berçário e unid ade de internação em pediatria todo recém-nascido e criança menor de 6 anos deve ser classificado como cuidado de alta dependência, independente da presença do acompanhante. ( ) O Serviço de Diagnóstico por Imagem deverá garantir a presença de no mínimo um enfermeiro durante todo período em que ocorra assistência de enfermagem. ( ) A proporção recomendada profissional/paciente no cuidado intensivo é de 1 profissional de enfermagem para 3 pacientes. As afirmativas são respectivamente",
    "alternativas": [
      {
        "letra": "A",
        "texto": "F – F – V."
      },
      {
        "letra": "B",
        "texto": "V – V – V."
      },
      {
        "letra": "C",
        "texto": "F – F – F."
      },
      {
        "letra": "D",
        "texto": "V – F – V."
      },
      {
        "letra": "E",
        "texto": "F – V – F."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 35,
    "disciplina": "Enfermagem",
    "assunto": "Processo de Enfermagem e SAE",
    "enunciado": "Na taxonomia de NANDA o julgamento clínico a respeito da motivação e do desejo de aumentar o bem -estar e alcançar o potencial humano de saúde corresponde ao conceito de",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Fatores relacionados."
      },
      {
        "letra": "B",
        "texto": "Diagnostico de risco."
      },
      {
        "letra": "C",
        "texto": "Características definidoras."
      },
      {
        "letra": "D",
        "texto": "Diagnóstico de promoção da saúde."
      },
      {
        "letra": "E",
        "texto": "Diagnóstico com foco no problema."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 36,
    "disciplina": "Enfermagem",
    "assunto": "Arboviroses (Dengue, Zika, Chikungunya, Febre Amarela, Oropouche e Nilo Ocidental)",
    "enunciado": "Com base nas orientações do Ministério da Saúde acerca da realização do teste rápido para casos suspeitos de Dengue, Febre de Chikungunya e Doença aguda pelo vírus Zika, analise as afirmativas a seguir e assinale V para verdadeira e F para a falsa ( ) Recomenda-se que o teste rápido para Febre de Chikungunya seja realizado entre o 6º e 30º dias da data de início de sintomas. ( ) Entre os critérios para a realização do teste rápido para dengue está toda criança proveniente de (ou residente em) área com transmissão de dengue, com quadro febril agudo e sem foco de infecção aparente. ( ) Considera-se caso suspeito de Doença aguda pelo vírus Zika, pacientes que apresentem exantema maculopapular pruriginoso, acompanhado de 2 ou mais sinais e sintomas específicos como Febre baixa, hiperemia conjuntival, oliartralgia e edema periarticular. As afirmativas são respectivamente",
    "alternativas": [
      {
        "letra": "A",
        "texto": "F – V – V."
      },
      {
        "letra": "B",
        "texto": "V – F – V."
      },
      {
        "letra": "C",
        "texto": "V – V – V."
      },
      {
        "letra": "D",
        "texto": "F – F – F."
      },
      {
        "letra": "E",
        "texto": "V – V – F."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 39,
    "disciplina": "Enfermagem",
    "assunto": "Segurança do Paciente",
    "enunciado": "Um paciente do sexo masculino, 65 anos, com câncer de pul mão em estágio avançado, encontra -se acamado, roupas de cama constantemente molhadas, percepção sensorial muito limitada, mobilidade bastante limitada, nutrição provavelmente inadequada e potencial para fricção e cisalhamento. De acordo com a escala de Bra den, esse paciente apresenta o seguinte risco para desenvolver lesão por pressão:",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Leve."
      },
      {
        "letra": "B",
        "texto": "Baixo."
      },
      {
        "letra": "C",
        "texto": "Alto."
      },
      {
        "letra": "D",
        "texto": "Muito alto."
      },
      {
        "letra": "E",
        "texto": "Moderado."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 40,
    "disciplina": "Enfermagem",
    "assunto": "Centro de Material e Esterilização (CME)",
    "enunciado": "De acordo com os requisitos de boas práticas para o processamento de produtos para saúde, o monitoramento do processo de esterilização realizado em cada carga com pacote teste desafio deve ser feito com",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Indicadores físicos."
      },
      {
        "letra": "B",
        "texto": "Indicadores biológicos."
      },
      {
        "letra": "C",
        "texto": "integradores químicos classe 2."
      },
      {
        "letra": "D",
        "texto": "integradores químicos classe 3 ou 4."
      },
      {
        "letra": "E",
        "texto": "integradores químicos classe 5 ou 6."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 41,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Mulher",
    "enunciado": "De acordo com as recomendações do Ministério da Saúde, marque a alternativa que corresponde a uma contraindicação relativa para a terapia de reposição hormonal",
    "alternativas": [
      {
        "letra": "A",
        "texto": "câncer de mama."
      },
      {
        "letra": "B",
        "texto": "miomatose uterina."
      },
      {
        "letra": "C",
        "texto": "doença hepática grave."
      },
      {
        "letra": "D",
        "texto": "câncer de endométrio."
      },
      {
        "letra": "E",
        "texto": "tromboembolismo recorrente."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 42,
    "disciplina": "Enfermagem",
    "assunto": "Gerenciamento de Resíduos de Serviços de Saúde (GRSS)",
    "enunciado": "O Resíduos de Serviços de Saúde - RSS do Grupo B são definidos como",
    "alternativas": [
      {
        "letra": "A",
        "texto": "qualquer material que contenha radionuclídeo em quantidade superior aos níveis de dispensa especificados em norma da CNEN."
      },
      {
        "letra": "B",
        "texto": "resíduos com a possível presença de agentes biológicos que, por suas características, podem apresentar risco de infecção."
      },
      {
        "letra": "C",
        "texto": "materiais perfurocortantes ou escarificantes, tais como lâminas de barbear, agulhas, escalpes, ampolas de vidro, brocas, lâminas de bisturi e lancetas."
      },
      {
        "letra": "D",
        "texto": "resíduos que não apresentam risco biológico, químico ou radiológico à saúde ou ao meio ambient e, podendo ser equiparados aos resíduos domiciliares"
      },
      {
        "letra": "E",
        "texto": "resíduos que contêm produtos químicos que podem apresentar risco à saúde pública ou ao meio ambiente, dependendo de suas características."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 43,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "O choque é um estado agudo de disfunção circulatória que leva à insuficiência na perfusão tecidual, utilização de oxigênio e produção de energia celular, podendo evoluir para o óbito do paciente. Com base nos mecanismos e fisiopatologia do choque, analise as afirmativas a seguir e assinale V par a a verdadeira e F para a falsa ( ) Um dos mecanismos compensatórios do choque é o aumento da secreção de epinefrina e norepinefrina pela medula adrenal, que contrai as artérias e veias periféricas e eleva a frequência cardíaca ( ) No choque distributi vo, a má perfusão é resultado de uma vasodilatação periférica global que ocasiona drástica redução da pressão de enchimento capilar - PEC comprometendo o fornecimento de oxigênio pelos capilares e a captura de oxigênio pelos tecidos. ( ) No choque hipovo lêmico, uma das respostas fisiológicas do organismo para recuperar a perfusão tecidual é contração das veias, que aumenta o retorno venoso e, consequentemente a pré-carga. As afirmativas são respectivamente",
    "alternativas": [
      {
        "letra": "A",
        "texto": "F – V – F."
      },
      {
        "letra": "B",
        "texto": "V – V – F."
      },
      {
        "letra": "C",
        "texto": "F – V – V."
      },
      {
        "letra": "D",
        "texto": "V – V – V."
      },
      {
        "letra": "E",
        "texto": "F – F – V."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 44,
    "disciplina": "Enfermagem",
    "assunto": "Arboviroses (Dengue, Zika, Chikungunya, Febre Amarela, Oropouche e Nilo Ocidental)",
    "enunciado": "No atendimento a um paciente adulto com suspeita de dengue, a prova do laço é considerada positiva, quando, após a realização do procedimento recomendado, verifica-se a presença de",
    "alternativas": [
      {
        "letra": "A",
        "texto": "5 ou mais petéquais."
      },
      {
        "letra": "B",
        "texto": "7 ou mais petéquias."
      },
      {
        "letra": "C",
        "texto": "10 ou mais petéquais."
      },
      {
        "letra": "D",
        "texto": "15 ou mais petéquais."
      },
      {
        "letra": "E",
        "texto": "20 ou mais petéquais."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 45,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "Um paciente adulto, vítima de AVC isquêmico, não pôde realizar a terapia trombolítica por apresentar uma contraindicação relativa para o tratamento. Entre essas contraindicações está",
    "alternativas": [
      {
        "letra": "A",
        "texto": "suspeita de hemorragia subaracnóide."
      },
      {
        "letra": "B",
        "texto": "histórico de hemorragia intracraniana."
      },
      {
        "letra": "C",
        "texto": "cirurgia de grande porte nos últimos 14 dias."
      },
      {
        "letra": "D",
        "texto": "infarto agudo do miocárdio nos últimos 3 meses."
      },
      {
        "letra": "E",
        "texto": "hemorragia gastrointestinal nos últimos 21 dias."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 46,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Idoso",
    "enunciado": "Durante o atendimento a um paciente idoso com suspeita de pseudo- hipertensão, o enfermeiro realizou a manobra de Osler. Essa manobra é considerada positiva quando, após insuflar o manguito da forma recomendada a",
    "alternativas": [
      {
        "letra": "A",
        "texto": "artéria braquial ou radial permaneça palpável."
      },
      {
        "letra": "B",
        "texto": "pressão sistólica e diastólica sejam convergentes."
      },
      {
        "letra": "C",
        "texto": "artéria braquial ou radial não seja mais palpável."
      },
      {
        "letra": "D",
        "texto": "diferença da PAS entre os braços seja > 15 mmHg."
      },
      {
        "letra": "E",
        "texto": "pressão diastólica aumente ≥ 10 mmHg em duas medições."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 47,
    "disciplina": "Enfermagem",
    "assunto": "Diabetes Mellitus",
    "enunciado": "Na assistência de uma criança com diabetes, uma das metas é manter a glicemia pré-prandial entre",
    "alternativas": [
      {
        "letra": "A",
        "texto": "50 e 80 mg/dL."
      },
      {
        "letra": "B",
        "texto": "60 e 90 mg/dL."
      },
      {
        "letra": "C",
        "texto": "65 e 110 mg/dL."
      },
      {
        "letra": "D",
        "texto": "70 e 130 mg/dL."
      },
      {
        "letra": "E",
        "texto": "80 e140 mg/dL."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 48,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "Durante o atendimento a um paciente verificou -se que ele apresentava dupla onda em cada pulsação, uma mais intensa e nítida e a outra mais fraca. Esse pulso é denominado",
    "alternativas": [
      {
        "letra": "A",
        "texto": "alternante."
      },
      {
        "letra": "B",
        "texto": "dicrótico."
      },
      {
        "letra": "C",
        "texto": "bigeminado."
      },
      {
        "letra": "D",
        "texto": "paradoxal."
      },
      {
        "letra": "E",
        "texto": "irregular."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 49,
    "disciplina": "Enfermagem",
    "assunto": "Saúde Mental",
    "enunciado": "Na Rede de Atenção Psicossocial, as Unidades de Acolhimento (UAs) são definidas como",
    "alternativas": [
      {
        "letra": "A",
        "texto": "unidades que prestam serviços de saúde de caráter aberto e comunitário, constituído por equipe multiprofissional que atua sobre a ótica interdisciplinar."
      },
      {
        "letra": "B",
        "texto": "estratégia de desinstitucionalização e política de inclusão social destinada às pessoas com problemas de saúde mental egressas de internação de longa permanência em hospitais psiquiátricos e de custódia."
      },
      {
        "letra": "C",
        "texto": "moradias inseridas na com unidade, destinadas a acolher pessoas em sofrimento psíquico graves e persistentes, egressas de internações psiquiátricas de longa permanência em hospitais psiquiátricos."
      },
      {
        "letra": "D",
        "texto": "serviços do componente de Atenção Hospitalar da RAPS, que oferecem tratamento hos pitalar para casos graves relacionados à problemas de saúde mental e ao uso prejudicial de álcool, outras drogas."
      },
      {
        "letra": "E",
        "texto": "residências temporárias para pessoas com necessidades decorrentes do uso de álcool e outras drogas, acompanhadas nos CAPS, em situação de vulnerabilidade social e/ou familiar e que demandem acolhimento terapêutico e protetivo."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 50,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "Acerca dos distúrbios hidroeletrolíticos e equilíbrio ácidobásico, analise as afirmativas a seguir e assinale V para a verdadeira e F para a falsa ( ) Os pacientes com hipermagnesemia moderada podem exibir sinais e sintomas, incluindo náuseas, vômitos, reflexos tendinosos profundos abolidos, hipotensão, bradicardia e alterações do ECG. ( ) Hipernatremia é a concentração sérica de sódio > 145 mmol/L e desenvolve -se a partir de um ganho de sódio ou pela perda de água livre, ou pela combinação desses fatores. ( ) A alcalose respiratória ocorre pela elevação do pH plasmático em função de uma concentração anormalmente alta de bicarbonato e/ou perda excessiva de prótons pelo organismo. As afirmativas são, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "F – V – V."
      },
      {
        "letra": "B",
        "texto": "V – V – V."
      },
      {
        "letra": "C",
        "texto": "F – F – F."
      },
      {
        "letra": "D",
        "texto": "F – V – F."
      },
      {
        "letra": "E",
        "texto": "V – V – F."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 51,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "Um paciente vítima de acidente automobilístico apresenta dor ocasionada pelas escoriações e fraturas no MID. Esse tipo de dor é denominado",
    "alternativas": [
      {
        "letra": "A",
        "texto": "dor reflexa."
      },
      {
        "letra": "B",
        "texto": "dor nociceptiva."
      },
      {
        "letra": "C",
        "texto": "dor neuropática."
      },
      {
        "letra": "D",
        "texto": "dor nociplástica."
      },
      {
        "letra": "E",
        "texto": "dor simpaticomimética."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 52,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Adulto",
    "enunciado": "No tratamento de um paciente oncológico, a quimioterapia neoadjuvante é aquela indicada",
    "alternativas": [
      {
        "letra": "A",
        "texto": "com objetivo de se conseguir o controle completo do tumor."
      },
      {
        "letra": "B",
        "texto": "após cirurgia curativa, com o objetivo de esterilizar células residuais locais ou circulantes, diminuindo a incidência de metástases"
      },
      {
        "letra": "C",
        "texto": "para se obter a redução parcial do tumor, visando permitir uma complementação terapêutica com a cirurgia e/ou radioterapia."
      },
      {
        "letra": "D",
        "texto": "com a finalidade de melhorar a qualidade da sobrevida do paciente."
      },
      {
        "letra": "E",
        "texto": "para a paliação de sinais e sintomas que comprometem a capacidade funcional do paciente."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 53,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Criança e do Adolescente",
    "enunciado": "Acerca da assistência ao recém -nascido acima de 34 semanas, analise as afirmativas a seguir e assinale V apara a verdadeira e F para a falsa. ( ) Um RN ≥34 semanas apresenta boa vitalidade se, ao nascer ele está respirando ou chorando e o tônus muscular está em flexão, independentemente do aspecto do líquido amniótico. ( ) A aspiração de boca e narinas deve ser realizada de rotina em todos os RNs, independente do resultado do apgar no 1º minuto, para evitar broncoaspiração. ( ) Considera-se bradicardia em recém nascido a frequência cardíaca <100 bpm. As afirmativas são respectivamente",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – F – V."
      },
      {
        "letra": "B",
        "texto": "F – F – F."
      },
      {
        "letra": "C",
        "texto": "V – V – F."
      },
      {
        "letra": "D",
        "texto": "F – V – F."
      },
      {
        "letra": "E",
        "texto": "V – V – V."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 54,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "No atendimento emergencial a pacientes com choque séptico recomenda-se administrar fluidos em alíquotas de",
    "alternativas": [
      {
        "letra": "A",
        "texto": "5mL/kg ou 10mL/kg."
      },
      {
        "letra": "B",
        "texto": "10mL/kg ou 20mL/kg."
      },
      {
        "letra": "C",
        "texto": "20mL/kg ou 30mL/kg."
      },
      {
        "letra": "D",
        "texto": "30mL/kg ou 40mL/kg."
      },
      {
        "letra": "E",
        "texto": "40mL/kg ou 50mL/kg."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 55,
    "disciplina": "Enfermagem",
    "assunto": "Tuberculose",
    "enunciado": "O esquema básico para o tratamento da tuberculose em adolescentes contempla os seguintes fármacos:",
    "alternativas": [
      {
        "letra": "A",
        "texto": "R – Rifampicina; H- Isoniazida; Z – Pirazinamina;"
      },
      {
        "letra": "B",
        "texto": "R – Rifampicina; H- Isoniazida; E – Etambutol.;"
      },
      {
        "letra": "C",
        "texto": "R – Rifampicina; H - Isoniazida; Z – Pirazinamina; E – Etambutol."
      },
      {
        "letra": "D",
        "texto": "R – Rifampicina; H - T - Terizidona – Pirazinamina; E – Etambutol"
      },
      {
        "letra": "E",
        "texto": "L - Linezolida; H- Isoniazida; Z – Pirazinamina; E – Etambutol"
      }
    ],
    "correta": "C"
  },
  {
    "numero": 56,
    "disciplina": "Enfermagem",
    "assunto": "Epidemiologia e Vigilância em Saúde",
    "enunciado": "O surto é uma ocorrência epidêmica, onde todos os casos estão relacionados entre si, atingindo uma área geográfica pequena e delimitada. No caso do surto de Síndrome Gripal em ambiente hospitalar, considera-se a ocorrência de pelo menos",
    "alternativas": [
      {
        "letra": "A",
        "texto": "dois casos de SG ocorridos no mesmo setor vinculados epidemiologicamente e que ocorreram, no mínimo, 48 horas após a data de admissão."
      },
      {
        "letra": "B",
        "texto": "três casos de SG ocorridos no mesmo setor vinculados epidemiologicamente e que ocorreram, no mínimo, 72 horas após a data de admissão."
      },
      {
        "letra": "C",
        "texto": "quatro casos de SG ocorridos no mesmo setor vinculados epidemiologicamente e que ocorreram, no mínimo, 36 horas após a data de admissão."
      },
      {
        "letra": "D",
        "texto": "cinco casos de SG ocorridos no mesmo setor vinculados epidemiologicamente e que ocorreram, no mínimo, 48 horas após a data de admissão."
      },
      {
        "letra": "E",
        "texto": "seis casos de SG ocorridos no mesmo setor vinculados epidemiologicamente e que ocorreram, no mínimo, 72 horas após a data de admissão."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 57,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "Um paciente faz acompanhamento em uma unidade ambulatorial para tratamento de úlcera crônica, localizada na porção distal da perna esquerda, que apresenta formato irregular, edema, dermatite ocre, pulsos distais presentes, com dor de intensidade variável que, em geral, piora no fim do dia com a posição ortostática e melhora com a elevação do membro. Essas características correspondem a úlceras de perna de etiologia",
    "alternativas": [
      {
        "letra": "A",
        "texto": "mista."
      },
      {
        "letra": "B",
        "texto": "arterial."
      },
      {
        "letra": "C",
        "texto": "venosa."
      },
      {
        "letra": "D",
        "texto": "neuropática."
      },
      {
        "letra": "E",
        "texto": "hipertensiva."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 58,
    "disciplina": "Enfermagem",
    "assunto": "Imunização",
    "enunciado": "Com base nas orientações do Ministério da Saúde acerca do Calendário Nacional de Vacinação analise as afirmativas a seguir e assinale V para a verdadeira e F para a falsa ( ) Contatos prolongados de portadores de Hanseníase, menores de 1 ano e sem cicatriz vacinal devem receber 2 doses da vacina BCG com intervalo de 4 meses entre as doses. ( ) A vacina tríplice viral é contraindicada para gestantes e crianças abaixo dos 6 (seis) meses de id ade, mesmo em situações de surto de sarampo, caxumba ou rubéola. ( ) Em criança a partir de 7 anos de idade ou adolescente não vacinado ou sem comprovação vacinal para difteria e tétano, deve-se administrar 3doses com intervalo de 60 dias entre elas, sendo o mínimo de 30 dias. As afirmativas são, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – V – F."
      },
      {
        "letra": "B",
        "texto": "V – V – V."
      },
      {
        "letra": "C",
        "texto": "F – F – F."
      },
      {
        "letra": "D",
        "texto": "V – F – V."
      },
      {
        "letra": "E",
        "texto": "F – V – V."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 59,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "As apraxias constituem distúrbios neurológicos relacionados à incapacidade de atividade gestual e movimentos conscientes. Nesse sentido, a perda da capacidade de gestos organizados, como desenhar, é denominada apraxia",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ideatória."
      },
      {
        "letra": "B",
        "texto": "reflexiva."
      },
      {
        "letra": "C",
        "texto": "conceitual."
      },
      {
        "letra": "D",
        "texto": "construtiva."
      },
      {
        "letra": "E",
        "texto": "ideomotora."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 60,
    "disciplina": "Enfermagem",
    "assunto": "Ética e Legislação em Enfermagem",
    "enunciado": "Considerando disposições do Código d e Ética de Enfermagem acerca das infrações e penalidades, analise as afirmativas a seguir e assinale V para a verdadeira e F para a falsa ( ) Considera-se infração ética e disciplinar a ação, omissão ou conivência que implique em desobediência e/ou inobservância às disposições do Código de Ética dos Profissionais de Enfermagem, bem como a inobservância das normas do Sistema Cofen/Conselhos Regionais de Enfermagem. ( ) Nas penalidades de censura e suspensão, o profissional terá sua carteira retida no ato da notificação, em todas as categorias em que for inscrito, sendo devolvida após o cumprimento da pena. ( ) As penalidades referentes à advertência verbal e multa são de responsabilidade do Conselho Federal de Enfermagem, a pena de cassação do direito a o exercício profissional é de responsabilidade da Assembleia de Presidentes dos Conselhos de Enfermagem. As afirmativas são, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "F – F – F."
      },
      {
        "letra": "B",
        "texto": "V – V – V."
      },
      {
        "letra": "C",
        "texto": "F – V – V."
      },
      {
        "letra": "D",
        "texto": "V – F – F."
      },
      {
        "letra": "E",
        "texto": "F – V – F."
      }
    ],
    "correta": "D"
  }
];
