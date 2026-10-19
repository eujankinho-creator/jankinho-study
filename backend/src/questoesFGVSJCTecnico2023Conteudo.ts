/**
 * Questões originais FGV Prefeitura de São José dos Campos – Saúde, Edital 04/2023,
 * prova 26/11/2023, Tipo 1 (branca), enunciados/alternativas publicados pela FGV.
 * Reprodução autorizada conforme informação do responsável pelo Córtex.
 * Gabarito oficial DEFINITIVO retificado em 09/01/2024.
 * Cargo Assistente Técnico em Saúde - Técnico em Enfermagem. Prova: https://conhecimento.fgv.br/sites/default/files/concursos/cnm001-assistente-tecnico-em-saude-tecnico-em-enfermagemcnm001-tipo-1.pdf
 * Gabarito: https://conhecimento.fgv.br/sites/default/files/concursos/sjcsaude2023_gabarito_definitivo_20240104.pdf
 * Exclusões: Q39 dependente de gráfico não reproduzível.
 */
export type QuestaoFGVSJC = {numero:number;disciplina:string;assunto:string;enunciado:string;alternativas:{letra:string;texto:string}[];correta:string};
export const QUESTOES_FGV_SJC_TECNICO_2023:QuestaoFGVSJC[] = [
  {
    "numero": 31,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "O órgão responsável por sintetizar os hormônios insulina e glucagon é o",
    "alternativas": [
      {
        "letra": "A",
        "texto": "rim."
      },
      {
        "letra": "B",
        "texto": "fígado."
      },
      {
        "letra": "C",
        "texto": "pâncreas."
      },
      {
        "letra": "D",
        "texto": "estômago."
      },
      {
        "letra": "E",
        "texto": "intestino delgado."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 32,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "Ao se abrir, a valva mitral tem a função de permitir a saída do sangue do(a)",
    "alternativas": [
      {
        "letra": "A",
        "texto": "átrio direito para o ventrículo direito."
      },
      {
        "letra": "B",
        "texto": "ventrículo esquerdo para a artéria aorta."
      },
      {
        "letra": "C",
        "texto": "átrio esquerdo para o ventrículo esquerdo."
      },
      {
        "letra": "D",
        "texto": "artéria aorta para o ventrículo esquerdo."
      },
      {
        "letra": "E",
        "texto": "ventrículo direito para a artéria do tronco pulmonar."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 33,
    "disciplina": "Enfermagem",
    "assunto": "Centro Cirúrgico",
    "enunciado": "No centro cirúrgico, a limpeza realizada ao término de um procedimento e antes do início do próximo é denominada",
    "alternativas": [
      {
        "letra": "A",
        "texto": "terminal."
      },
      {
        "letra": "B",
        "texto": "contínua."
      },
      {
        "letra": "C",
        "texto": "recorrente."
      },
      {
        "letra": "D",
        "texto": "concorrente."
      },
      {
        "letra": "E",
        "texto": "programada."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 34,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "A posição em que o paciente permanece em decúbito dorsal, com o tronco elevado a um ângulo de 45° graus, é denominada",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Sims."
      },
      {
        "letra": "B",
        "texto": "Prona."
      },
      {
        "letra": "C",
        "texto": "Fowler."
      },
      {
        "letra": "D",
        "texto": "Litotomia."
      },
      {
        "letra": "E",
        "texto": "Trendelenburg."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 35,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Adulto",
    "enunciado": "Ao realizar o balanço hídrico de um paciente adulto, o técnico de enfermagem verificou que, nas últimas 24 horas, o paciente eliminou cerca 95mL de urina. Nesse caso, o paciente apresenta",
    "alternativas": [
      {
        "letra": "A",
        "texto": "anúria."
      },
      {
        "letra": "B",
        "texto": "oligúria."
      },
      {
        "letra": "C",
        "texto": "disúria."
      },
      {
        "letra": "D",
        "texto": "poliúria."
      },
      {
        "letra": "E",
        "texto": "enurese."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 36,
    "disciplina": "Enfermagem",
    "assunto": "Controle de Infecção e Biossegurança",
    "enunciado": "“É constituída de mecanismos de defesa bioquímicos e celulares que já estão presentes no organismo antes mesmo de se iniciar o processo infeccioso, respondendo prontamente à infecção.” O texto se refere à imunidade",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ativa."
      },
      {
        "letra": "B",
        "texto": "passiva."
      },
      {
        "letra": "C",
        "texto": "especifica."
      },
      {
        "letra": "D",
        "texto": "inespecífica."
      },
      {
        "letra": "E",
        "texto": "ativa natural."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 37,
    "disciplina": "Enfermagem",
    "assunto": "Controle de Infecção e Biossegurança",
    "enunciado": "De acordo com as recomendações do Ministério da Saúde, a precaução específica para a varicela deve ser mantida",
    "alternativas": [
      {
        "letra": "A",
        "texto": "durante todo período de internação."
      },
      {
        "letra": "B",
        "texto": "durante 7 dias após o surgimento das lesões"
      },
      {
        "letra": "C",
        "texto": "até o 5º dia de terapia medicamentosa."
      },
      {
        "letra": "D",
        "texto": "até completar o tratamento medicamentoso."
      },
      {
        "letra": "E",
        "texto": "até que todas as lesões se tornem crostas."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 38,
    "disciplina": "Enfermagem",
    "assunto": "Centro Cirúrgico",
    "enunciado": "De acordo com as diretrizes para uma cirurgia segura, uma verificação a ser efetuada antes da indução anestésica (sign in) diz respeito a",
    "alternativas": [
      {
        "letra": "A",
        "texto": "esterilização dos materiais."
      },
      {
        "letra": "B",
        "texto": "presença ou não de alergias."
      },
      {
        "letra": "C",
        "texto": "contagem das compressas."
      },
      {
        "letra": "D",
        "texto": "antecipação de eventos críticos."
      },
      {
        "letra": "E",
        "texto": "administração de profilaxia antibiótica."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 40,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "Acerca das orientações relacionadas à aspiração das vias aéreas de um paciente internado, avalie se as afirmativas a seguir são verdadeiras (V) ou falsas (F). ( ) A aspiração orotraqueal é contrain dicada em pacientes com traumatismo cranioencefálico. ( ) Em pacientes entubados que serão aspirados com a mesma sonda deve-se aspirar primeiro o tubo endotraqueal, depois, a cavidade nasal, e, por último, a cavidade oral. ( ) A Cânula de Guedel facili ta a aspiração orotraqueal de paciente inconsciente, tornando mais fácil o acesso da sonda à traqueia. As afirmativas são, respectivamente,",
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
        "texto": "F – V – V."
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
    "correta": "C"
  },
  {
    "numero": 41,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "Uma lesão por pressão em que há perda da pele em sua espessura total e perda tissular na qual a extensão do dano não pode ser confirmada porque está encoberta por esfacelo ou por escara é classificada como lesão por pressão",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Estágio 2."
      },
      {
        "letra": "B",
        "texto": "Estágio 3."
      },
      {
        "letra": "C",
        "texto": "Estágio 4."
      },
      {
        "letra": "D",
        "texto": "Não Classificável."
      },
      {
        "letra": "E",
        "texto": "Tissular Profunda."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 42,
    "disciplina": "Enfermagem",
    "assunto": "Epidemiologia e Vigilância em Saúde",
    "enunciado": "Acerca das hepatites virais, analise as afirmativas a seguir. I O vírus da Hepatite C pode ser transmitido de mãe para filho e também por meio de relações sexuais. II As pessoas vacinadas contra a Hep atite B também adquirem proteção contra as Hepatites D e A. III A Hepatite A pode ser transmitida pela via fecal -oral e pelo contato com sangue contaminado. Está correto o que se afirma em",
    "alternativas": [
      {
        "letra": "A",
        "texto": "I, apenas."
      },
      {
        "letra": "B",
        "texto": "II, apenas."
      },
      {
        "letra": "C",
        "texto": "III, apenas."
      },
      {
        "letra": "D",
        "texto": "I e II, apenas."
      },
      {
        "letra": "E",
        "texto": "I, II e III."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 43,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Mulher",
    "enunciado": "De acordo com as recomendações do Ministério da Saúde, no primeiro período do trabalho de parto, a frequência cardíaca (materna) de parturiente de risco habitual deve ser verificada a cada",
    "alternativas": [
      {
        "letra": "A",
        "texto": "15 minutos."
      },
      {
        "letra": "B",
        "texto": "30 minutos."
      },
      {
        "letra": "C",
        "texto": "uma hora."
      },
      {
        "letra": "D",
        "texto": "duas horas."
      },
      {
        "letra": "E",
        "texto": "quatro horas."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 44,
    "disciplina": "Enfermagem",
    "assunto": "Eletrocardiograma (ECG)",
    "enunciado": "São derivações periféricas de um eletrocardiograma de 12 derivações:",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V1, D3 e aVF."
      },
      {
        "letra": "B",
        "texto": "D1, D2 e aVL."
      },
      {
        "letra": "C",
        "texto": "V2, V3 e V4."
      },
      {
        "letra": "D",
        "texto": "aVR, V5 e V6."
      },
      {
        "letra": "E",
        "texto": "aVF, D4 e V2."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 45,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "O uso da cobertura de carvão ativado e prata está indicado em casos de",
    "alternativas": [
      {
        "letra": "A",
        "texto": "queimaduras."
      },
      {
        "letra": "B",
        "texto": "feridas infectadas."
      },
      {
        "letra": "C",
        "texto": "feridas limpas."
      },
      {
        "letra": "D",
        "texto": "feridas hipergranuladas."
      },
      {
        "letra": "E",
        "texto": "lesões com exposição óssea."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 46,
    "disciplina": "Enfermagem",
    "assunto": "Controle de Infecção e Biossegurança",
    "enunciado": "Com base nas recomendações da ANVISA relacionadas à prevenção de infecções, avalie se as afirmativas a seguir são verdadeiras (V) ou falsas (F). ( ) Os equipos de infusão contínua devem ser trocados a cada 72 horas. ( ) A limpeza e a desinfecção da superfície e do painel das bombas de infusão devem ser realizadas a cada 24 horas. ( ) Deve-se desinfetar o diafragma (borracha) do frasco -ampola com álcool 70% antes da inserção da agulha. As afirmativas são, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "F – V – F."
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
    "numero": 47,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "O seguinte dispositivo de oxigenação é capaz de fornecer uma fração inspirada de oxigênio de até 100% e é indicado para pacientes com dispneia moderada ou grave:",
    "alternativas": [
      {
        "letra": "A",
        "texto": "cateter nasal."
      },
      {
        "letra": "B",
        "texto": "máscara simples."
      },
      {
        "letra": "C",
        "texto": "máscara com reservatório."
      },
      {
        "letra": "D",
        "texto": "máscara não reinalante."
      },
      {
        "letra": "E",
        "texto": "máscara de reinalação parcial."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 48,
    "disciplina": "Enfermagem",
    "assunto": "Imunização",
    "enunciado": "Conforme calendário vacinal do Ministério da Saúde, a primeira dose da Vacina Rotavírus Humano G1P – VRH deve ser administrada em crianças na seguinte idade e na seguinte via:",
    "alternativas": [
      {
        "letra": "A",
        "texto": "2 meses – oral."
      },
      {
        "letra": "B",
        "texto": "4 meses – oral."
      },
      {
        "letra": "C",
        "texto": "2 meses – subcutânea."
      },
      {
        "letra": "D",
        "texto": "4 meses – subcutânea."
      },
      {
        "letra": "E",
        "texto": "6 meses – intramuscular."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 49,
    "disciplina": "Enfermagem",
    "assunto": "Gerenciamento de Resíduos de Serviços de Saúde (GRSS)",
    "enunciado": "Acerca dos resíduos do grupo A (infectantes) e seus subgrupos, assinale a afirmativa correta.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Os resíduos do subgrupo A3 não necessitam de tratamento antes da disposição final."
      },
      {
        "letra": "B",
        "texto": "Os resíduos do subgrupo A4 devem ser tratados antes da disposição final ambientalmente adequada."
      },
      {
        "letra": "C",
        "texto": "Os resíduos do subgrupo A1 não necessitam de tratamento antes da disposição final."
      },
      {
        "letra": "D",
        "texto": "Os resíduos do subgrupo A2 devem ser destinados para sepultamento ou cremação."
      },
      {
        "letra": "E",
        "texto": "Os resíduos do subgrupo A5 devem ser encaminhados para tratamento por incineração."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 50,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Criança e do Adolescente",
    "enunciado": "No recém -nascido a termo, a bradicardia é definida como a frequência cardíaca menor do que",
    "alternativas": [
      {
        "letra": "A",
        "texto": "80 bpm."
      },
      {
        "letra": "B",
        "texto": "90 bpm."
      },
      {
        "letra": "C",
        "texto": "100 bpm."
      },
      {
        "letra": "D",
        "texto": "120 bpm."
      },
      {
        "letra": "E",
        "texto": "130 bpm."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 51,
    "disciplina": "Enfermagem",
    "assunto": "Centro Cirúrgico",
    "enunciado": "Uma cirurgia classificada em Porte II é aquela com duração de",
    "alternativas": [
      {
        "letra": "A",
        "texto": "até 1 hora."
      },
      {
        "letra": "B",
        "texto": "até 2 horas."
      },
      {
        "letra": "C",
        "texto": "2 a 4 horas."
      },
      {
        "letra": "D",
        "texto": "4 a 6 horas."
      },
      {
        "letra": "E",
        "texto": "6 a 8 horas."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 52,
    "disciplina": "Enfermagem",
    "assunto": "Centro de Material e Esterilização (CME)",
    "enunciado": "Com base nas normas e protocolos relacionados ao processamento de materiais para a saúde, avalie se as afirmativas a seguir são verdadeiras (V) ou falsas (F). ( ) O ciclo de esterilização a vapor para uso imediato (ciclo fl ash) só pode ocorrer em caso de urgência e emergência. ( ) A esterilização por radiação ionizante é indicada para materiais termossensíveis, que não suportam altas temperaturas. ( ) O indicador químico Classe 2 é um indicador de controle de exposição usado para diferenciar o produto que foi processado daquele que não foi processado. As afirmativas são, respectivamente,",
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
        "texto": "F – F – F."
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
    "numero": 53,
    "disciplina": "Enfermagem",
    "assunto": "Centro de Material e Esterilização (CME)",
    "enunciado": "Considerando as definições relacionadas ao processamento de produtos para a saúde, um produto considerado semicrítico é o",
    "alternativas": [
      {
        "letra": "A",
        "texto": "termômetro."
      },
      {
        "letra": "B",
        "texto": "macronebulizador."
      },
      {
        "letra": "C",
        "texto": "laparoscópio."
      },
      {
        "letra": "D",
        "texto": "esfignomanômetro."
      },
      {
        "letra": "E",
        "texto": "instrumental cirúrgico."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 54,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "Considerando as normas e diretrizes relacionadas ao atendimento a uma gestante com parada cardiorrespiratória, assinale a conduta correta.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Priorizar a oxigenação e o manejo das vias aéreas da gestante."
      },
      {
        "letra": "B",
        "texto": "Manter a avaliação constante dos batimentos cardíacos fetais."
      },
      {
        "letra": "C",
        "texto": "Lateralizar a gestante, e não s omente o útero, para aliviar compressão aortocaval."
      },
      {
        "letra": "D",
        "texto": "Administrar uma ventilação a cada 3 segundos quando houver via aérea avançada."
      },
      {
        "letra": "E",
        "texto": "Evitar a desfibrilação da gestante para não comprometer a vida do feto."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 55,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "Considerando as cadeias de sobrevivência para PCR em ambiente intra-hospitalar e extra -hospitalar, no atendimento a pacientes adultos, analise as afirmativas seguir. I No ambiente intra -hospitalar a cadeia de sobrevivência se inicia com o reconhecimento e a prevenção precoce e, no ambiente extra -hospitalar, se inicia com a RCP de alta qualidade. II A ressuscitação avançada é uma etapa que está presente somente na cadeia de sobrevivência para ambiente extra - hospitalar. III Os cuidados pós -PCR, incluindo o controle dos parâmetros respiratórios, é um etapa comum para as duas cadeias de sobrevivência. Está correto o que se afirma em",
    "alternativas": [
      {
        "letra": "A",
        "texto": "I, apenas."
      },
      {
        "letra": "B",
        "texto": "II, apenas."
      },
      {
        "letra": "C",
        "texto": "III, apenas."
      },
      {
        "letra": "D",
        "texto": "II e III, apenas."
      },
      {
        "letra": "E",
        "texto": "I, II e III."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 56,
    "disciplina": "Enfermagem",
    "assunto": "Imunização",
    "enunciado": "De acordo com as recomendações do Ministério da Saúde, a dose de reforço da vacina Pneumocócica 23 -valente para idosos deve ser realizada",
    "alternativas": [
      {
        "letra": "A",
        "texto": "1 ano após a primeira dose."
      },
      {
        "letra": "B",
        "texto": "2 anos após a primeira dose."
      },
      {
        "letra": "C",
        "texto": "4 anos após a primeira dose."
      },
      {
        "letra": "D",
        "texto": "5 anos após a primeira dose."
      },
      {
        "letra": "E",
        "texto": "10 anos após a primeira dose."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 57,
    "disciplina": "Enfermagem",
    "assunto": "Administração de Medicamentos e Cálculos",
    "enunciado": "Acerca da administração de medicamentos, avalie se as afirmativas a seguir são verdadeiras (V) ou falsas (F). ( ) A infusão contínua é a administração de medicamento realizada ininterruptamente em um tempo maior do que 30 minutos. ( ) Entre os medicamentos considerados de Alta Vigilância estão o Cloreto de Potássio 19,1% e a insulina subcutânea e endovenosa. ( ) Quando administrados juntos, o ácido acetilsalicílico pode diminuir a ação anti-hipertensiva do captopril. As afirmativas são, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "F – F – V."
      },
      {
        "letra": "B",
        "texto": "V – F – V."
      },
      {
        "letra": "C",
        "texto": "F – V – F."
      },
      {
        "letra": "D",
        "texto": "V – V – V."
      },
      {
        "letra": "E",
        "texto": "F – V – V."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 58,
    "disciplina": "Enfermagem",
    "assunto": "Administração de Medicamentos e Cálculos",
    "enunciado": "Assinale a opção que corresponde a uma das funções da noradrenalina.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Vasodilatação."
      },
      {
        "letra": "B",
        "texto": "Controle de trombose."
      },
      {
        "letra": "C",
        "texto": "Diminuição da frequência cardíaca."
      },
      {
        "letra": "D",
        "texto": "Diminuição da pressão arterial."
      },
      {
        "letra": "E",
        "texto": "Aumento da pressão arterial."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 59,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Trabalhador",
    "enunciado": "Com base na classificação dos riscos ambientais nos serviços de saúde, relacione os grupos de risco apresentados com seus respectivos agentes. 1. Grupo I – verde 2. Grupo II – vermelho 3. Grupo III – marrom 4. Grupo IV – amarelo ( ) vírus e bactérias. ( ) gases e vapores. ( ) radiações ionizantes e ruídos. ( ) esforço físico intenso e postura inadequada. Assinale a opção que apresenta a relação correta, na ordem apresentada.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "1 – 4 – 2 – 3."
      },
      {
        "letra": "B",
        "texto": "3 – 2 – 1 – 4."
      },
      {
        "letra": "C",
        "texto": "2 – 4 – 3 – 1."
      },
      {
        "letra": "D",
        "texto": "4 – 3 – 1 – 2."
      },
      {
        "letra": "E",
        "texto": "2 – 1 – 4 – 3."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 60,
    "disciplina": "Enfermagem",
    "assunto": "Administração de Medicamentos e Cálculos",
    "enunciado": "Ao diluir um frasco-ampola de 2g de uma determinada medicação em 10mL de soro fisiológico, cada 2mL da solução terá",
    "alternativas": [
      {
        "letra": "A",
        "texto": "50mg dessa medicação."
      },
      {
        "letra": "B",
        "texto": "100mg dessa medicação."
      },
      {
        "letra": "C",
        "texto": "200mg dessa medicação."
      },
      {
        "letra": "D",
        "texto": "250mg dessa medicação."
      },
      {
        "letra": "E",
        "texto": "400mg dessa medicação."
      }
    ],
    "correta": "E"
  }
];
