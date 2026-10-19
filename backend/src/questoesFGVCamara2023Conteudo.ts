/**
 * Itens da prova FGV Câmara dos Deputados 2023, Enfermeiro Tipo 1 TARDE.
 * Fonte: https://conhecimento.fgv.br/sites/default/files/concursos/cns202-analista-legislativo-enfermeirocns202-tipo-1-tarde.pdf
 * Gabarito definitivo: https://conhecimento.fgv.br/sites/default/files/concursos/camara-dos-deputados-gabaritos-definitivo-para-publicacao-edital-2-tarde.pdf
 * Autorização de reprodução informada pelo responsável do Córtex.
 * Excluídas Q28 (traçado de ECG não reproduzível com fidelidade textual)
 * e Q69 (anulada no gabarito definitivo). Texto de apoio das Q12–Q13 e
 * Q32–Q33 incluído integralmente nos enunciados pertinentes.
 */
export type QuestaoFGVCamara2023={numero:number;disciplina:string;assunto:string;enunciado:string;alternativas:{letra:string;texto:string}[];correta:string};
export const QUESTOES_FGV_CAMARA_2023: QuestaoFGVCamara2023[]=[
  {
    "numero": 1,
    "disciplina": "Legislação do SUS",
    "assunto": "Lei 8.080/1990 - Organização e Competências",
    "enunciado": "Com base nas disposições acerca do Sistema Único de Saúde - SUS, previstas na Lei nº 8.080/90, analise as afirmativas a seguir e assinale V para a verdadeira e F para a falsa. ( ) O dever do Estado de garantir a saúde consiste, entre outras coisas, na formulação e execução de políticas econômicas e sociais que visem à redução de riscos de doenças e de outros agravos. ( ) Estão incluídos no campo de atuação do SUS a participação na formulação da política e na execução de ações de saneamento básico. ( ) Um dos objetivos das Comissões Intergestores é decidir sobre os aspectos operacionais, financeiros e administrativos da gestão compartilhada do SUS. As afirmativas são, na ordem apresentada, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – F – F."
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
    "correta": "D"
  },
  {
    "numero": 2,
    "disciplina": "Legislação do SUS",
    "assunto": "Controle Social no SUS",
    "enunciado": "Tanto a Constituição Federal como a Lei Orgânica da Saúde, dispõem acerca da participação da comunidade na gestão do Sistema Único de Saúde (SUS). A esse respeito, analise as afirmativas a seguir. I. A participação da sociedade no SUS foi institucionalizada pela Lei nº 8.142/1990 que estabeleceu os Conselhos e as Conferências de Saúde como espaços para representação da comunidade. II. O Conselho de Saúde é um órgão colegiado e deliberativo que tem a função de avaliar a situação de saúde e propor as diretrizes para a formulação da política de saúde nos níveis correspondentes. III. A Conferência de Saúde é um órgão com a representação dos vários segmentos sociais, que atua na formulação de estratégias e no controle da execução da política de saúde. Está correto o que se afirma em",
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
        "texto": "I e II, apenas."
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
    "correta": "A"
  },
  {
    "numero": 3,
    "disciplina": "Legislação do SUS",
    "assunto": "Redes de Atenção à Saúde",
    "enunciado": "A organização dos níveis de atenção à saúde de acordo com a complexidade tecnológica dos serviços, de modo a garantir o estabelecimento de uma rede que articula as unidades mais simples às mais complexas por meio de um sistema de referência e contra referência, diz respeito à operacionalização do seguinte princípio organizativo do SUS:",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Integralidade."
      },
      {
        "letra": "B",
        "texto": "Universalidade."
      },
      {
        "letra": "C",
        "texto": "Descentralização."
      },
      {
        "letra": "D",
        "texto": "Regionalização."
      },
      {
        "letra": "E",
        "texto": "Hierarquização."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 4,
    "disciplina": "Saúde Coletiva I",
    "assunto": "Determinação Social da Saúde",
    "enunciado": "Um dos objetivos do Sistema Único de Saúde é a identificação e divulgação dos fatores condicionantes e determinantes da saúde. Acerca desses fatores, analise as afirmativas a seguir e assinale V para a verdadeira e F para a falsa. ( ) O modelo de Dahlgren e Whi tehead dispõe os Determinantes Sociais da Saúde (DSS) em diferentes camadas, segundo seu nível de abrangência, desde uma camada mais próxima aos determinantes individuais até uma camada distal onde se situam os macro determinantes. ( ) A saúde tem como f atores determinantes e condicionantes, entre outros, a alimentação, a moradia, o saneamento básico, o trabalho, a educação, o lazer e o acesso aos bens e serviços essenciais. ( ) Entre os determinantes sociais, que podem influenciar a equidade em saúde d e maneira positiva e negativa os mais relevantes são o acesso a serviços de saúde, a renda e a proteção social. As afirmativas são, na ordem apresentada, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – F – V."
      },
      {
        "letra": "B",
        "texto": "F – V – F."
      },
      {
        "letra": "C",
        "texto": "V – V – F."
      },
      {
        "letra": "D",
        "texto": "F – V – V."
      },
      {
        "letra": "E",
        "texto": "V – V – V."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 5,
    "disciplina": "Legislação do SUS",
    "assunto": "Lei 8.080/1990 - Organização e Competências",
    "enunciado": "As ações e serviços de saúde, executados pelo Sistema Único de Saúde, devem ser organizados em níveis de complexidade crescente, de acordo com a responsabilidade de cada ente. Nesse sentido, cada esfera de gestão, em seu âmbito administra tivo, exerce competências específicas. Assinale a opção que apresenta as competências da Direção Nacional do SUS.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Acompanhar, controlar e avaliar as redes hierarquizadas do Sistema Único de Saúde."
      },
      {
        "letra": "B",
        "texto": "Controlar e fiscalizar procedimentos, produtos e s ubstâncias de interesse para a saúde."
      },
      {
        "letra": "C",
        "texto": "Formar consórcios administrativos intermunicipais e gerir laboratórios públicos de saúde e hemocentros."
      },
      {
        "letra": "D",
        "texto": "Executar serviços de saneamento básico e vigilância epidemiológica."
      },
      {
        "letra": "E",
        "texto": "Controlar e fiscalizar os procedimentos dos serviços privados de saúde."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 6,
    "disciplina": "Legislação do SUS",
    "assunto": "Princípios e Diretrizes do SUS",
    "enunciado": "O princípio da descentralização pressupõe a concepção de direção única em cada esfera de governo. Isso significa que",
    "alternativas": [
      {
        "letra": "A",
        "texto": "o comando e as decisões devem observar a hierarquia entre as três esferas de governo."
      },
      {
        "letra": "B",
        "texto": "as decisões devem ser tomadas de forma descendente, do nível central para o nível local."
      },
      {
        "letra": "C",
        "texto": "cada esfera de governo é autônoma e soberana em suas decisões e atividades."
      },
      {
        "letra": "D",
        "texto": "a direção nacional do SUS é responsável por organizar as ações em todos os níveis de assistência."
      },
      {
        "letra": "E",
        "texto": "as esferas locais devem subordinar suas decisões às esferas centrais."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 7,
    "disciplina": "Enfermagem",
    "assunto": "Política Nacional de Humanização",
    "enunciado": "Na Política Nacional de Humanização, foram desenvolvidos vários dispositivos que são acionados nas práticas de produção de saúde, envolvendo coletivos e visando à promoção de mudanças nos modelos de atenção e de gestão. Assinale a opção que indica esses dispositivos.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Projetos Cogeridos de Ambiência."
      },
      {
        "letra": "B",
        "texto": "Ferramentas de Análise Organizacional."
      },
      {
        "letra": "C",
        "texto": "Programas de Segurança do Paciente."
      },
      {
        "letra": "D",
        "texto": "Metas de Desempenho Assistencial."
      },
      {
        "letra": "E",
        "texto": "Indicadores de Processo e Resultados."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 8,
    "disciplina": "Enfermagem",
    "assunto": "Segurança do Paciente",
    "enunciado": "Segundo o Programa Nacional de Segurança do Paciente, quando uma instituição de saúde produz, sistematiza e difunde conhecimentos sobre segurança do paciente, ela está colocando em prática o aspecto",
    "alternativas": [
      {
        "letra": "A",
        "texto": "valores."
      },
      {
        "letra": "B",
        "texto": "princípios."
      },
      {
        "letra": "C",
        "texto": "estratégias."
      },
      {
        "letra": "D",
        "texto": "objetivos."
      },
      {
        "letra": "E",
        "texto": "diretrizes."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 9,
    "disciplina": "Enfermagem",
    "assunto": "Gestão em Enfermagem",
    "enunciado": "O planejamento de enfermagem direcionado para o curto prazo e que envolve tarefas e atividades do dia a dia, como a reorganização das escalas ou redistribuição de responsabilidades, é denominado",
    "alternativas": [
      {
        "letra": "A",
        "texto": "tático."
      },
      {
        "letra": "B",
        "texto": "estratégico."
      },
      {
        "letra": "C",
        "texto": "operacional."
      },
      {
        "letra": "D",
        "texto": "conservador."
      },
      {
        "letra": "E",
        "texto": "otimizante."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 10,
    "disciplina": "Enfermagem",
    "assunto": "Gestão em Enfermagem",
    "enunciado": "Na gestão de enfermagem muitas vezes o enfermeiro precisa lidar com situações nas quais é necessário administrar conflitos. Com base nos estilos de negociação e abordagem de conflitos, analise as afirmativas a seguir e assinale (V) para a verdadeira e (F) para a falsa. ( ) O estilo de acomodação não é confrontador, reflet e um alto grau de cooperação e funciona melhor quando as pessoas sabem o que é errado. ( ) O estilo de evitação reflete uma postura não assertiva e nem cooperativa; ele é apropriado quando um assunto é trivial ou quando o benefício de não enfrentar um co nflito prevalece sobre o seu enfrentamento naquele momento. ( ) O estilo de compromisso reflete a assertividade para impor seu próprio interesse e é utilizado quando as situações exigem ações decisivas e rápidas. As afirmativas são, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – V – F."
      },
      {
        "letra": "B",
        "texto": "F – V – F."
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
        "texto": "V – F – V."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 11,
    "disciplina": "Enfermagem",
    "assunto": "Prática Baseada em Evidências",
    "enunciado": "As práticas clínicas baseadas em evidências (PBE) começam pelo reconhecimento da questão clínica, ou pela dúvida sobre o procedimento mais adequado para solucionar um determinado problema. Nesse sentido, a abordagem PBE deve seguir algumas estratégias, cuja primeira etapa consiste em",
    "alternativas": [
      {
        "letra": "A",
        "texto": "identificar o problema do paciente e convertê-lo em pergunta clínica."
      },
      {
        "letra": "B",
        "texto": "buscar evidências em base de dados de informação de modo eficiente."
      },
      {
        "letra": "C",
        "texto": "avaliar criticamente a situação e identificar as evidências existentes."
      },
      {
        "letra": "D",
        "texto": "pesquisar sobre os possíveis cenários e aplicar os achados das evidências na prática clínica."
      },
      {
        "letra": "E",
        "texto": "avaliar os efeitos da implementação das evidências na prática clínica."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 12,
    "disciplina": "Enfermagem",
    "assunto": "Gestão em Enfermagem",
    "enunciado": "Atenção: o enunciado a seguir refere -se às duas próximas questões. Com base nas disposições normativas do COFEN acerca do dimensionamento do pessoal de enfermagem e os referenciais mínimos recomendados para cada caso, considere uma instituição de saúde com as seguintes unidades:  Unidade de cuidados intermediários com 12 pacientes;  Unidade de cuidados semi-intensivos com 10 pacientes; e  Centro Cirúrgico exclusivo para cirurgias eletivas com 6 salas de cirurgia.\n\nNo cuidado intermediário e no cuidado semi -intensivo a quantidade mínima de profissionais de enfermagem para atender ao quantitativo de pacientes, nos diferentes turnos de trabalho, deve ser, respectivamente, de",
    "alternativas": [
      {
        "letra": "A",
        "texto": "2 e 3."
      },
      {
        "letra": "B",
        "texto": "3 e 4."
      },
      {
        "letra": "C",
        "texto": "4 e 8."
      },
      {
        "letra": "D",
        "texto": "2 e 4."
      },
      {
        "letra": "E",
        "texto": "3 e 5."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 13,
    "disciplina": "Enfermagem",
    "assunto": "Gestão em Enfermagem",
    "enunciado": "Atenção: o enunciado a seguir refere -se às duas próximas questões. Com base nas disposições normativas do COFEN acerca do dimensionamento do pessoal de enfermagem e os referenciais mínimos recomendados para cada caso, considere uma instituição de saúde com as seguintes unidades:  Unidade de cuidados intermediários com 12 pacientes;  Unidade de cuidados semi-intensivos com 10 pacientes; e  Centro Cirúrgico exclusivo para cirurgias eletivas com 6 salas de cirurgia.\n\nAssinale a opção que indica a quantidade mínima de enfermeiros para a assistência no centro cirúrgico, considerando a proporção recomendada por salas de cirurgias eletivas nas 24 horas.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "2 enfermeiros."
      },
      {
        "letra": "B",
        "texto": "3 enfermeiros."
      },
      {
        "letra": "C",
        "texto": "4 enfermeiros."
      },
      {
        "letra": "D",
        "texto": "5 enfermeiros."
      },
      {
        "letra": "E",
        "texto": "6 enfermeiros."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 14,
    "disciplina": "Saúde Coletiva I",
    "assunto": "Promoção da Saúde",
    "enunciado": "Acerca dos níveis de prevenção, de acordo com os conceitos adotados pelo Ministério da Saúde, a prevenção terciária é a ação que",
    "alternativas": [
      {
        "letra": "A",
        "texto": "procura estimular a conscientização dos sinais precoces de problemas de saúde tanto entre usuários leigos como em profissionais, e rastrear as pessoas sob risco."
      },
      {
        "letra": "B",
        "texto": "tem por objetivo assegurar que as pessoas de baixo risco para problemas de saúde permaneçam com essa condição e encontrem meios de evitar doenças."
      },
      {
        "letra": "C",
        "texto": "é implementada para reduzir em um indivíduo ou população os prejuízos funcionais consequentes de um problema agudo ou crônico, incluindo a reabilitação."
      },
      {
        "letra": "D",
        "texto": "detecta indivíduos em risco de intervenções diagnósticas e/ou terapêuticas excessivas, para protegê -los de novas intervenções médicas inapropriadas e sugerir -lhes alternativas eticamente aceitáveis."
      },
      {
        "letra": "E",
        "texto": "é realizada para detectar um problema de saúde em estágio inicial, muitas vezes em estágio subclínico, no indivíduo ou na população, facilitando o diagnóstico definitivo."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 15,
    "disciplina": "Enfermagem",
    "assunto": "Processo de Enfermagem e SAE",
    "enunciado": "Acerca das taxonomias NIC, NOC, CIPE e NANDA, utilizadas no processo de enfermagem e sistematização da assistência, assinale a afirmativa correta.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Para compor intervenções de enfermagem com base na CIPE, recomenda-se, minimamente, a inclusão de um termo do eixo ação e um termo do eixo julgamento."
      },
      {
        "letra": "B",
        "texto": "Na taxonomia de NANDA, o diagnóstico com foco no problema é um julgamento clínico a respeito da motivação e do desejo de aumentar o bem -estar e alcançar o potencial humano de saúde."
      },
      {
        "letra": "C",
        "texto": "Na NIC, o domínio 2 – fisiológico complexo diz respeito aos cuidados que dão suporte à regulação homeostática e ao funcionamento físico do organismo."
      },
      {
        "letra": "D",
        "texto": "A NOC propõe uma série de resultados e para cada um deles há diversos indicadores e uma escala de Likert para que os enfermeiros possam avaliar continuamente a r esposta ao cuidado prestado."
      },
      {
        "letra": "E",
        "texto": "Tanto na CIPE quanto na NANDA a construção do diagnóstico de enfermagem deve ter como base obrigatória os eixos foco e localização, além de termos de outros eixos, caso necessário."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 16,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Adulto",
    "enunciado": "Na assistência a um paciente no pós -operatório de cirurgia ortopédica, o enfermeiro identificou risco de tromboembolismo venoso. O fator de risco relacionado a esse diagnóstico é a(o)",
    "alternativas": [
      {
        "letra": "A",
        "texto": "trombofilia."
      },
      {
        "letra": "B",
        "texto": "obesidade."
      },
      {
        "letra": "C",
        "texto": "trauma abaixo da cintura."
      },
      {
        "letra": "D",
        "texto": "presença de veias varicosas."
      },
      {
        "letra": "E",
        "texto": "uso de terapia de reposição hormonal."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 17,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Adulto",
    "enunciado": "Ao realizar o balanço hídrico de uma paciente adulta com Insuficiência Renal Aguda (Injúria Renal Aguda) – IRA, o enfermeiro verificou, com base no volume de diurese, que ela apresentava IRA estágio 2. Nesse caso, o volume de urina apresentado pelo paciente deve corresponder ao seguinte parâmetro:",
    "alternativas": [
      {
        "letra": "A",
        "texto": "anúria por 12 horas."
      },
      {
        "letra": "B",
        "texto": "< 0,5mL/Kg/h por 6 horas."
      },
      {
        "letra": "C",
        "texto": "< 0,5mL/Kg/h por mais de 12 horas."
      },
      {
        "letra": "D",
        "texto": "< 0,3mL/Kg/h por 24 horas."
      },
      {
        "letra": "E",
        "texto": "< 0,3mL/Kg/h por mais de 24 horas."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 18,
    "disciplina": "Enfermagem",
    "assunto": "Epidemiologia e Vigilância em Saúde",
    "enunciado": "Assinale a opção que indica a condição e/ou fator de risco para complicações em pacientes com síndrome gripal.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Crianças menores de 10 anos."
      },
      {
        "letra": "B",
        "texto": "Indivíduos maiores de 50 anos."
      },
      {
        "letra": "C",
        "texto": "Adultos que façam uso de ácido acetilsalicílico."
      },
      {
        "letra": "D",
        "texto": "Gestantes em qualquer idade gestacional."
      },
      {
        "letra": "E",
        "texto": "Puérperas até quatro semanas após o parto."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 19,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "Um paciente com suspeita de overdose por morfina deu entrada na unidade de saúde apresentando taquicardia, confusão mental, déficit na função pulmonar com respirações superficiais, dispneia e hipoventilação. A gasometria arterial mostrou diminuição do PH (7,2) e aumento do PaCO2 (47mmHg). Assinale a opção que indica o desequilíbrio ácido básico compatível com o quadro apresentado.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Alcalose mista."
      },
      {
        "letra": "B",
        "texto": "Alcalose metabólica."
      },
      {
        "letra": "C",
        "texto": "Acidose respiratória."
      },
      {
        "letra": "D",
        "texto": "Alcalose respiratória."
      },
      {
        "letra": "E",
        "texto": "Acidose metabólica."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 20,
    "disciplina": "Enfermagem",
    "assunto": "Tuberculose",
    "enunciado": "A baciloscopia do escarro, desde que executada corretamente em todas as suas fases, permite detectar de 60% a 80% dos casos de tuberculose (TB) pulmonar em adultos. Acerca desse exame, analise as afirmativas a seguir. I. Uma das situações que indica a realização desse exame é em caso de suspeita clínica e/ou radiológica de TB pulmonar, independentemente do tempo de tosse. II. A baciloscopia de escarro deve ser realizada em duas amostras: uma por ocasião do primeiro contato com a pessoa que tosse e outra, no dia seguinte, independentemente do resultado da primeira. III. A baciloscopia positiva e o quadro c línico compatível com tuberculose são suficientes para fechar o diagnóstico e permitir o início de tratamento. Está correto o que se afirma em",
    "alternativas": [
      {
        "letra": "A",
        "texto": "I, apenas."
      },
      {
        "letra": "B",
        "texto": "I e II, apenas."
      },
      {
        "letra": "C",
        "texto": "I e III, apenas."
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
    "correta": "E"
  },
  {
    "numero": 21,
    "disciplina": "Enfermagem",
    "assunto": "Arboviroses (Dengue, Zika, Chikungunya, Febre Amarela, Oropouche e Nilo Ocidental)",
    "enunciado": "Um paciente deu entrada na unidade de saúde com um quadro suspeito de dengue e recebeu a classificação vermelha (grupo D – emergência), devido à presença de sinais de gravidade. De acordo com as orientações e manejo clínico do Ministério da Saúde, assinale a opção que apresenta os sinais que corroboram essa classificação.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Vômito persistente e lipotimia."
      },
      {
        "letra": "B",
        "texto": "Sangramento de mucosa e letargia."
      },
      {
        "letra": "C",
        "texto": "Hipotensão postural e irritabilidade."
      },
      {
        "letra": "D",
        "texto": "Pressão arterial convergente e taquicardia."
      },
      {
        "letra": "E",
        "texto": "Dor abdominal intensa e febre remitente."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 22,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "No atendimento a um paciente com quadro infeccioso, os profissionais de saúde devem estar atentos aos sinais clínicos de Síndrome da Resposta Inflamatória Sistêmica - SIRS ou de Sepse. No caso da SIRS, para caracterização do quadro clínico, devem estar presentes dois ou mais dos sinais e sintomas específicos. Assinale a opção que indica um desses sinais/sintomas.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Oligúria."
      },
      {
        "letra": "B",
        "texto": "PAS < 90mmHg."
      },
      {
        "letra": "C",
        "texto": "PAM < 65mmHg."
      },
      {
        "letra": "D",
        "texto": "Confusão mental."
      },
      {
        "letra": "E",
        "texto": "Frequência cardíaca > 90bpm."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 23,
    "disciplina": "Enfermagem",
    "assunto": "Arboviroses (Dengue, Zika, Chikungunya, Febre Amarela, Oropouche e Nilo Ocidental)",
    "enunciado": "De acordo com as orientações do Ministério da Saúde, considera - se caso suspeito de doença aguda pelo vírus Zika, o paciente que apresente exantema maculopapular pruriginoso, acompanhado de 2 ou mais sintomas específicos. Assinale a opção que os indica.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Artrite intensa e febre alta."
      },
      {
        "letra": "B",
        "texto": "Edema periarticular e poliartralgia."
      },
      {
        "letra": "C",
        "texto": "Prova do laço positiva e vômito."
      },
      {
        "letra": "D",
        "texto": "Cefaleia intensa e dor retro orbital."
      },
      {
        "letra": "E",
        "texto": "Febre de início súbito e exantema."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 24,
    "disciplina": "Enfermagem",
    "assunto": "Diabetes Mellitus",
    "enunciado": "Conforme as Diretrizes da Sociedade Brasileira de Diabetes, recomenda-se que uma gestante com Diabetes Mellitus ou Diabetes Mellitus Gestacional tenha como meta, valores de glicemia pré-prandiais entre",
    "alternativas": [
      {
        "letra": "A",
        "texto": "65 e 95mg/dL."
      },
      {
        "letra": "B",
        "texto": "70 e 96mg/dL."
      },
      {
        "letra": "C",
        "texto": "75 e 97mg/dL."
      },
      {
        "letra": "D",
        "texto": "80 e 98mg/dL."
      },
      {
        "letra": "E",
        "texto": "85 e 99mg/dL."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 25,
    "disciplina": "Enfermagem",
    "assunto": "Hipertensão Arterial",
    "enunciado": "Com base nas diretrizes de hipertensão arterial, analise as afirmativas a seguir e assinale (V) para a verdadeira e (F) para a falsa. ( ) As urgências hipertensivas são situações clínicas sintomáticas em que há elevação acentuada da pressão arterial, definida arbitrariamente como PAS ≥ 160 e/ou PAD ≥ 100mmHg. ( ) Nos hipertensos de risco cardiovascular baixo ou moderado, a meta de tratamento é alcançar valores de PA inferiores a 140/90mmHg. ( ) Toda criança ≥ 3 anos de idade e adolescente, com excesso de peso, doença renal, coarctação de aorta e diabetes, deve ter sua PA verificada em qualquer avaliação clínica. As afirmativas são, na ordem apresentada, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – V – V."
      },
      {
        "letra": "B",
        "texto": "F – F – F."
      },
      {
        "letra": "C",
        "texto": "F – V – V."
      },
      {
        "letra": "D",
        "texto": "F – V – F."
      },
      {
        "letra": "E",
        "texto": "V – F – V."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 26,
    "disciplina": "Enfermagem",
    "assunto": "Diabetes Mellitus",
    "enunciado": "O rastreamento para o Diabetes Mellitus tipo 2 (DM2) deve ser realizado em adultos assintomáticos com idade a partir dos 45 anos, sobrepeso ou obesidade e que apresente um ou mais fatores de risco. Entre esses fatores estão",
    "alternativas": [
      {
        "letra": "A",
        "texto": "histórico de IAM e nefropatia."
      },
      {
        "letra": "B",
        "texto": "sexo masculino e hipertensão arterial."
      },
      {
        "letra": "C",
        "texto": "histórico familiar de DM2 e AVC prévio."
      },
      {
        "letra": "D",
        "texto": "HDL menor que 35mg/dL e sedentarismo."
      },
      {
        "letra": "E",
        "texto": "triglicérides menor que 250mg/dL e tabagismo."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 27,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "O ECG de 12 derivações é a primeira ferramenta diagnóstica no manejo de pacientes com Síndrome Coronariana Aguda suspeita. Recomenda-se, nesses casos, que esse exame seja realizado e interpretado em até",
    "alternativas": [
      {
        "letra": "A",
        "texto": "10 minutos após a admissão hospitalar."
      },
      {
        "letra": "B",
        "texto": "15 minutos após a admissão hospitalar."
      },
      {
        "letra": "C",
        "texto": "20 minutos após a admissão hospitalar."
      },
      {
        "letra": "D",
        "texto": "25 minutos após a admissão hospitalar."
      },
      {
        "letra": "E",
        "texto": "30 minutos após a admissão hospitalar."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 29,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "Acerca da ausculta pulmonar , analise as afirmativas a seguir e assinale (V) para a verdadeira e (F) para a falsa ( ) O murmúrio vesicular é um som suave e grave auscultado em toda a extensão do tórax, com maior intensidade nas bases pulmonares. É mais forte e prolongado na fase inspiratória e mais audível na região anteroposterior do tórax. ( ) Os estertores finos são sons agudos de curta duração audíveis no início da inspira ção e ao longo da expiração, que se modificam com a tosse e não são influenciados pela mudança de posição. Podem ser audíveis na DPOC e em bronquiectasias. ( ) A sibilância é dita monofônica quando não pode ser distinguida nem isolada de outras sibilânci as em um mesmo ponto de escuta. As afirmativas são, na ordem apresentada, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – V – V."
      },
      {
        "letra": "B",
        "texto": "F – F – F."
      },
      {
        "letra": "C",
        "texto": "V – F – V."
      },
      {
        "letra": "D",
        "texto": "F – V – V."
      },
      {
        "letra": "E",
        "texto": "V – F – F."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 30,
    "disciplina": "Enfermagem",
    "assunto": "Hanseníase",
    "enunciado": "As reações hansênicas são fenômenos inflamatórios agudos que cursam com exacerbação dos sinais e sintomas da doença, podendo ocorrer antes, durante ou após o final do tratamento com a poliquimioterapia. Acometem um percentual elevado de casos e são divididas em reação hansênica tipo 1 e tipo 2. Acerca das reações tipo 2, assinale a afirmativa correta.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Acometem exclusivamente pacientes paucibacilares."
      },
      {
        "letra": "B",
        "texto": "A manifestação clássica dessas reações é o eritema nodoso hansênico."
      },
      {
        "letra": "C",
        "texto": "As lesões de pele antigas ficam mais eritematosas e/ou edematosas nessas reações."
      },
      {
        "letra": "D",
        "texto": "O princip al sintoma neural é dor espontânea ou à palpação de nervo periférico."
      },
      {
        "letra": "E",
        "texto": "Podem gerar o surgimento abrupto de novas lesões de pele até 5 anos após a alta medicamentosa."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 31,
    "disciplina": "Enfermagem",
    "assunto": "Ética e Legislação em Enfermagem",
    "enunciado": "A Bioética tem como objetivo facilitar o enfrentamento de questões éticas que surgirão na vida profissional, por meio da observância e aplicabilidade dos seus princípios. Com base nesses princípios, analise as afirmativas a seguir. I. Autonomia é a capacidade de autodeterminação de uma pessoa, ou seja, o quanto ela pode gerenciar sua própria vontade e tomar decisões livre da influência de outras pessoas. II. Beneficência é a ação feita em benefício de outros; com base nesse princípio a assistência deve ser realizada visando sempre o bem do paciente. III. A não maleficência pode ser entendida como \"a obrigação de evitar o mal”; consiste na proibição, por princípio, de prejudicar ou causar qualquer dano intencional ao paciente. Está correto o que se afirma em",
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
        "texto": "I e II, apenas."
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
    "correta": "E"
  },
  {
    "numero": 32,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "Atenção: Com base nos protocolos de classificação e manejo do Ministério da Saúde e da Sociedade Brasileira de Queimaduras e no caso apresentado a seguir, responda às duas próximas questões. Um paciente deu entrada na unidade de saúde, com queimadura por corrente elétrica no membro superior direito, atingindo todas as camadas da pele, alcançando o tecido subcutâneo. A pele apresentava aspecto variável, principalmente em sua coloração, com partes pálidas e ou tras escuras, ressecada, endurecida ao toque e indolor.\n\nDe acordo com as características descritas e com a classificação baseada na profundidade das camadas acometidas, o paciente apresenta queimadura de",
    "alternativas": [
      {
        "letra": "A",
        "texto": "primeiro grau."
      },
      {
        "letra": "B",
        "texto": "segundo grau."
      },
      {
        "letra": "C",
        "texto": "terceiro grau."
      },
      {
        "letra": "D",
        "texto": "quarto grau."
      },
      {
        "letra": "E",
        "texto": "sem classificação."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 33,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "Atenção: Com base nos protocolos de classificação e manejo do Ministério da Saúde e da Sociedade Brasileira de Queimaduras e no caso apresentado a seguir, responda às duas próximas questões. Um paciente deu entrada na unidade de saúde, com queimadura por corrente elétrica no membro superior direito, atingindo todas as camadas da pele, alcançando o tecido subcutâneo. A pele apresentava aspecto variável, principalmente em sua coloração, com partes pálidas e ou tras escuras, ressecada, endurecida ao toque e indolor.\n\nDe acordo com a extensão da superfície corporal queimada (SCQ), com base na regra dos nove, assinale a opção que indica o percentual e a classificação desse paciente.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "5% - pequeno queimado."
      },
      {
        "letra": "B",
        "texto": "9% - pequeno queimado."
      },
      {
        "letra": "C",
        "texto": "9% - médio queimado."
      },
      {
        "letra": "D",
        "texto": "18% - médio queimado."
      },
      {
        "letra": "E",
        "texto": "18% - grande queimado."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 34,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "No tratamento do Acidente Vascular Cerebral Isquêmico agudo com rtPA (trombolítico) endovenoso, a equipe assistencial deve seguir o protocolo e realizar algumas condutas específicas durante e após a administração. Assinale a opção que indica uma dessas condutas.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Manter o paciente em jejum por 24 horas pelo risco de hemorragia e necessidade de intervenção cirúrgica de urgência."
      },
      {
        "letra": "B",
        "texto": "Passar sonda vesical de demora, para possibilitar o monitoramento preciso do débito urinário no pós - tratamento."
      },
      {
        "letra": "C",
        "texto": "Manter hidratação, durante e após o tratamento, intercalando soro fisiológico 0,9% e soro glicosado 5%, para evitar hipoglicemia."
      },
      {
        "letra": "D",
        "texto": "Monitorar a pressão arterial a cada 30min nas duas primeiras horas e, depois, a cada 60min até 24 a 36 horas do início do tratamento."
      },
      {
        "letra": "E",
        "texto": "Passar sonda naso -entérica, de preferência nas primeiras 24 horas após o tratamento, para preven ir vômitos e risco de bronco-aspiração."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 35,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "Com base nas diretrizes de cuidados pós -parada cardiorrespiratória para adultos, analise as afirmativas a seguir e assinale (V) para a verdadeira e (F) para a falsa. ( ) O controle dos parâmetr os respiratórios deve ser iniciado com 8 ventilações por minuto, aumentando gradativamente se necessário. ( ) Deve-se considerar intervenção cardíaca de urgência quando houver a presença de infarto agudo do miocárdio com supra de ST e angina estável ou instável. ( ) O controle dos parâmetros hemodinâmicos deve ser realizado visando uma Pressão Arterial Sistólica > 90 mmHg e Pressão Arterial Média > 65 mmHg. As afirmativas são, na ordem apresentada, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "F – V – V."
      },
      {
        "letra": "B",
        "texto": "V – V – F."
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
        "texto": "F – F – V."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 36,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "Acerca do atendimento a gestantes em Parada Cardiorrespiratória, assinale a afirmativa correta.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "A desfibrilação é indicada somente a partir da 30ª semana de gestação."
      },
      {
        "letra": "B",
        "texto": "O deslocamento uterino lateral contínuo é contraindicado para gestantes hipertensas e com histórico de cardiopatia."
      },
      {
        "letra": "C",
        "texto": "A cadeia de sobrevivência em gestantes deve ser iniciada com a ressuscitação avançada."
      },
      {
        "letra": "D",
        "texto": "Deve-se administrar oxigênio a 100% e evitar ventilação excessiva."
      },
      {
        "letra": "E",
        "texto": "O monitoramento do feto deve ser priorizado em gestantes a partir da 28ª semana de gestação."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 37,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Idoso",
    "enunciado": "Durante a assistência a um paciente idoso, com dano neurológico, o enfermeiro realizou a avaliação da força muscular de acordo com a classificação do Medical Research Counicil (MRC), na qual o paciente obteve grau 2. Essa graduação corresponde ao seguinte resultado:",
    "alternativas": [
      {
        "letra": "A",
        "texto": "nenhuma contração muscular visível ou palpável."
      },
      {
        "letra": "B",
        "texto": "contração visível sem movimento do seguimento avaliado."
      },
      {
        "letra": "C",
        "texto": "capacidade de mover o membro, sem conseguir um movimento gravitacional."
      },
      {
        "letra": "D",
        "texto": "movimento ativo contra a gravidade, porém não contra a resistência."
      },
      {
        "letra": "E",
        "texto": "movimento ativo contra a gravidade e contra a resistência."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 38,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Criança e do Adolescente",
    "enunciado": "De acordo com as diretrizes de r eanimação do recém -nascido (RN), os valores alvo de SatO 2 pré-ductal para um RN de 38 semanas entre o 5º e o 10º minuto após o nascimento, é de",
    "alternativas": [
      {
        "letra": "A",
        "texto": "50 a 60%."
      },
      {
        "letra": "B",
        "texto": "60 a 65%."
      },
      {
        "letra": "C",
        "texto": "70 a 80%."
      },
      {
        "letra": "D",
        "texto": "80 a 90%."
      },
      {
        "letra": "E",
        "texto": "85 a 95%."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 39,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Criança e do Adolescente",
    "enunciado": "No atendimento a uma criança de 3 anos de idade, com dificuldade respiratória, foi verificado a presença de tiragem subcostal. Acerca dessa manif estação clínica, analise as afirmativas a seguir e assinale (V) para a verdadeira e (F) para a falsa. ( ) Na respiração normal, toda a parede torácica (superior e inferior) e o abdome se movem para fora quando a criança inspira. Quando há tiragem subcostal, a parede torácica inferior se move para dentro durante a inspiração. ( ) Quando apenas a musculatura intercostal se move para dentro quando a criança respira, não caracteriza presença de tiragem subcostal. ( ) Para que haja tiragem subcostal , esta deve ser claramente visível e estar presente todo o tempo. Caso só possa ser vista quando a criança está chorando ou alimentando-se, esse sinal não deve ser considerado. As afirmativas são, na ordem apresentada, respectivamente,",
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
    "correta": "B"
  },
  {
    "numero": 40,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "A cicatrização de uma ferida ocorre por meio de um processo dinâmico, interdependente, contínuo e complexo, cuja finalidade é restaurar os tecidos lesados. Este processo é composto por três fases: inflamatória, proliferativa e de maturação. Sobre a fase proliferativa, assinale a afirmativa correta.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Nessa fase ocorre o aumento da permeabilidade capilar e os vários fatores quimiotáticos facilitam a diapedese dos neutrófilos para o sítio inflamatório."
      },
      {
        "letra": "B",
        "texto": "Nessa fase ocorre a contração por movimento centrípeto em toda espessura ao redor da ferida, reduzindo a quantidade de cicatriz, diminuindo os fibroblastos e fazendo com que a densa rede de capilares regrida."
      },
      {
        "letra": "C",
        "texto": "Essa fase represen ta uma tentativa para limitar o dano, parando o sangramento, selando a superfície da ferida e removendo qualquer tecido necrótico, fragmentos estranhos ou bactérias presentes."
      },
      {
        "letra": "D",
        "texto": "É caracterizada pelo aumento da permeabilidade vascular, migração de células para a ferida por quimiotaxia, secreção de citocinas, fatores de crescimento e ativação da migração de células."
      },
      {
        "letra": "E",
        "texto": "Nessa fase inicia -se o reparo da ferida por meio da angiogênese, fibroplastia e epitalização; é caracterizada pela formação de tecido granu loso constituído por vasos capilares sanguíneos neoformados, tecido conjuntivo e leucócitos."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 41,
    "disciplina": "Enfermagem",
    "assunto": "Imunização",
    "enunciado": "Uma adolescente de 15 anos, vítima de violência sexual foi atendida em uma unidade de saúde. Entre os cuidados dispensados, foi iniciado o esq uema com a Vacina Papilomavírus Humano – HPV, pois a paciente não havia tomado nenhuma dose da vacina. Nesse caso, recomenda-se o esquema de",
    "alternativas": [
      {
        "letra": "A",
        "texto": "dose única, com reforço a cada 2 anos."
      },
      {
        "letra": "B",
        "texto": "duas doses, com intervalo de 4 meses entre a primeira e a segunda dose."
      },
      {
        "letra": "C",
        "texto": "três doses, com intervalo de 2 meses entre a primeira e segunda dose e 4 meses entre a primeira e a terceira dose."
      },
      {
        "letra": "D",
        "texto": "duas doses, com intervalo de 6 meses entre a primeira e a segunda dose."
      },
      {
        "letra": "E",
        "texto": "três doses, com intervalo de 2 meses entre a primei ra e segunda e de 6 meses entre a primeira e a terceira dose."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 42,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Mulher",
    "enunciado": "Uma puérpera, na terceira semana de pós -parto, procurou a unidade de saúde relatando sinais e sintomas característicos de baby blues materno. Assinale a opção que apresenta características deste transtorno emocional.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Provoca alterações mentais, corporais e de humor que podem durar de semanas a anos, interferindo de forma significativa na vida pessoal, social e profissional da mulher."
      },
      {
        "letra": "B",
        "texto": "Caracteriza-se pela perda de conta to com a realidade, alucinações, falsas convicções, pensamento e comportamento atípico e redução de demonstração de emoções."
      },
      {
        "letra": "C",
        "texto": "Gera transtornos do humor de longa duração, episódico, potencialmente grave e que algumas vezes pode cursar com sintomas psicóticos."
      },
      {
        "letra": "D",
        "texto": "Alterna momentos de alegria seguidos de tristeza e certa melancolia pela sensação de não ser capaz de cuidar do bebê e pode ser considerado um período de risco para a saúde mental da mulher."
      },
      {
        "letra": "E",
        "texto": "Provoca um quadro moderado a grave de tristeza, que pode envolver rejeição ao bebê, ideação suicida ou homicida e ocasionar doenças psicossomáticas."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 43,
    "disciplina": "Enfermagem",
    "assunto": "Gestão em Enfermagem",
    "enunciado": "Acerca da atuação do enfermeiro auditor, analise as afirmativas a seguir. I. Compete ao enfermeiro auditor atuar na elaboração de protocolos e indicadores assistenciais, acompanhar a execução e avaliação da assistência, considerando as implementações e os seus desfechos. II. O enfermeiro pode acessar os contratos e adendos pertinentes à Instituição a ser auditada bem como o prontuário do pa ciente e toda documentação que se fizer necessária no desempenho de suas atribuições. III. É permitido ao enfermeiro acompanhar, presencialmente, exames e procedimentos prestados ao paciente no sentido de dirimir quaisquer dúvidas que possam interferir no seu relatório, independente de autorização prévia. Está correto o que se afirma em",
    "alternativas": [
      {
        "letra": "A",
        "texto": "I, somente."
      },
      {
        "letra": "B",
        "texto": "II, somente."
      },
      {
        "letra": "C",
        "texto": "I e II, somente."
      },
      {
        "letra": "D",
        "texto": "II e III, somente."
      },
      {
        "letra": "E",
        "texto": "I, II e III."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 44,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Mulher",
    "enunciado": "O Near Miss Materno (NMM) é definido como uma mulher que quase morreu, mas que sobreviveu a uma complicação grave durante o período gestacional até 42 dias após o término da gestação, em pelo menos um dos critérios clínicos, laboratoriais ou de manejo. Assinale a opção que indica um desses critérios.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "PaO2 / FiO2 < 300."
      },
      {
        "letra": "B",
        "texto": "Perda de consciência durante 6 horas ou mais."
      },
      {
        "letra": "C",
        "texto": "Saturação de oxigênio < 95% por mais de 60 minutos."
      },
      {
        "letra": "D",
        "texto": "Frequência respiratória > 30 ipm ou < 15 ipm."
      },
      {
        "letra": "E",
        "texto": "Intubação e ventilação por tempo > 60 minutos, não relacionadas com anestesia."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 45,
    "disciplina": "Enfermagem",
    "assunto": "Administração de Medicamentos e Cálculos",
    "enunciado": "Considerando as disposições acerca dos cuidados na administração de Nutrição Parenteral, analise as afirmativas a seguir e assinale (V) para a verdadeira e (F) para a falsa ( ) A ANVISA orienta que o equipo para administração de nutrição parenteral total deve ser isento de dietilexilftalato (DEHP) e a via de administração deve ser exclusiva. ( ) Nutrição parenteral com mais de 10% de dextrose ou outros aditivos que resultem em osmolaridade final acima de 900 mOsm/L, devem ser adminis tradas por cateter venoso central. ( ) O enfermeiro deve garantir o registro claro e preciso de informações relacionadas à administração e à evolução do paciente, quanto aos dados antropométricos, peso, sinais vitais, balanço hídrico, glicemia e tolerânc ia digestiva, entre outros. As afirmativas são, na ordem apresentada, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – V – F."
      },
      {
        "letra": "B",
        "texto": "F – F – F."
      },
      {
        "letra": "C",
        "texto": "V – F – V."
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
    "correta": "E"
  },
  {
    "numero": 46,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Criança e do Adolescente",
    "enunciado": "Uma criança de 4 anos de idade, cuja mãe teve sífilis durante a gestação, apresentou alguns sinais e sintomas característicos de sífilis congênita tardia. Assinale a opção que indica um desses sinais/sintomas.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Anemia e trombocitopenia."
      },
      {
        "letra": "B",
        "texto": "Pênfigo sifilítico e icterícia."
      },
      {
        "letra": "C",
        "texto": "Febre e exantema macopapular."
      },
      {
        "letra": "D",
        "texto": "Hepatomegalia e osteocondrite metafisária."
      },
      {
        "letra": "E",
        "texto": "Ceratite intersticial e dentes de Hutchinston."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 47,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Mulher",
    "enunciado": "Durante a assistência a uma gestante, no primeiro período do parto normal, o pulso materno e a frequência das contrações uterinas devem ser verificados a intervalos de",
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
        "texto": "60 minutos."
      },
      {
        "letra": "D",
        "texto": "Duas horas."
      },
      {
        "letra": "E",
        "texto": "Quatro horas."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 48,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Mulher",
    "enunciado": "Com base nas normas e protocolos acerca da atuação do enfermeiro no Planejamento Familiar e Reprodutivo, analise as afirmativas a seguir e assinale (V) para a verdadeira e (F) para a falsa. ( ) Compete ao enfermeiro realizar a consulta de Enfermagem, pautados nos protocolos institucionais, acerca da promoção, proteção e apoio à utilização dos métodos de concepção e contracepção, sendo vedada a solicitação de exames. ( ) Desde que devidamente capacitado, o enfermeiro pode realizar a inserção, revisão e retirada de Dispositivo Intrauterino (DIU). ( ) Uma das competênci as do enfermeiro é participar na elaboração de protocolos assistenciais, normas e rotinas, Procedimentos Operacionais Padrão -POP, de acordo com as melhores práticas baseadas em evidências científicas. As afirmativas são, na ordem apresentada, respectivamente,",
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
        "texto": "F – V – F."
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
    "correta": "A"
  },
  {
    "numero": 49,
    "disciplina": "Enfermagem",
    "assunto": "Segurança do Paciente",
    "enunciado": "Um incidente ocorrido durante a administração de medicamentos pode gerar danos ao paciente que são classificados de acordo com o grau de comprometimento ao estado de saúde. Nesse sentido, um dano moderado é aquele em que o paciente",
    "alternativas": [
      {
        "letra": "A",
        "texto": "apresentou sintomas leves."
      },
      {
        "letra": "B",
        "texto": "apresentou danos mínimos ou intermediários de curta duração sem necessidade de intervenção."
      },
      {
        "letra": "C",
        "texto": "necessitou de intervenção, prolongamento da internação ou teve perda de função."
      },
      {
        "letra": "D",
        "texto": "necessitou de grande intervenção médico -cirúrgica para salvar a vida."
      },
      {
        "letra": "E",
        "texto": "sofreu danos de longo prazo ou permanentes."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 50,
    "disciplina": "Enfermagem",
    "assunto": "Administração de Medicamentos e Cálculos",
    "enunciado": "Acerca da administração de medicamentos, analise as afirmativas a seguir e a assinale (V) para a verdadeira e (F) para a falsa. ( ) A dopamina é uma droga vesicante, fotossensível, incompatível com bicarbonato ou qualquer outra solução alcalina e deve ser administrada exclusivamente através de infusão intravenosa com a solução diluída antes da administração. ( ) Na interação medicamentosa entre o ácido acetilsalicílico (AAS) e o captopril , o AAS potencializa significativamente a ação anti-hipertensiva do captopril. ( ) Algumas interações medicamentosas são benéficas e utilizadas como ferramentas da terapêutica, como o sulfametoxazol associado com trimetroprima, que produzem uma reação sinérgica para aumento do espectro antibacteriano. As afirmativas são, na ordem apresentada, respectivamente.",
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
        "texto": "F – V – F."
      },
      {
        "letra": "D",
        "texto": "V – F – V."
      },
      {
        "letra": "E",
        "texto": "F – F – F."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 51,
    "disciplina": "Enfermagem",
    "assunto": "Controle de Infecção e Biossegurança",
    "enunciado": "Para fins epidemiológicos, considera -se como Infecções Relacionadas à Assistência à Saúde (IRAS) neonatal tardia de provável origem hospitalar, a infecção diagnosticada enquanto o neonato estiver internado em unidade de assistência neonatal ou após alta hospitalar, de acordo com o início da manifestação clínica. Com base nas disposições da ANVISA assinale a opção que corresponde ao período correto de incubação a ser considerado nas IRAS neonatais tardias, conforme tipo ou sítio da infecção.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Sepse – até 2 dias."
      },
      {
        "letra": "B",
        "texto": "Conjuntivite – até 3 dias."
      },
      {
        "letra": "C",
        "texto": "Gastroenterite – até 5 dias."
      },
      {
        "letra": "D",
        "texto": "Infecção do trato urinário – até 7 dias."
      },
      {
        "letra": "E",
        "texto": "Infecções do trato respiratório – até 10 dias."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 52,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Mulher",
    "enunciado": "Como uma das formas de diminuir o risco de infecção associada ao parto, a OMS recomenda que os toques vaginais para o acompanhamento da primeira fase ativa do trabalho de parto, em mulheres de baixo risco, tenham um intervalo mínimo de",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Uma hora."
      },
      {
        "letra": "B",
        "texto": "Duas horas."
      },
      {
        "letra": "C",
        "texto": "Três horas."
      },
      {
        "letra": "D",
        "texto": "Quatro horas."
      },
      {
        "letra": "E",
        "texto": "Cinco horas."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 53,
    "disciplina": "Enfermagem",
    "assunto": "Controle de Infecção e Biossegurança",
    "enunciado": "De acordo com a classificação de risco dos agentes biológicos, analise as afirmativas a seguir. I. A Classe de Risco 1 inclui os agentes biológicos que provocam infecções no homem ou nos animais, cujo potencial de propagação na comunidade e de disseminação no meio ambiente é limitado, e para os quais existem medidas terapêuticas e profiláticas eficazes. II. A Classe de Risco 2 inclui agentes biológicos que representam grande ameaça para o ser humano e para os animais, implicando grande risco a quem os manipula, com grande poder de transmissibilidade de um indivíduo a outro. III. A Classe de Risco 3 inclui os agentes biológicos que possuem capacidade de transmissão por via respiratória e que causam patologias humanas ou animais, potencialmente letais. Está correto o que se afirma em",
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
        "texto": "III, apenas"
      },
      {
        "letra": "D",
        "texto": "I e II, apenas."
      },
      {
        "letra": "E",
        "texto": "II e III, apenas."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 54,
    "disciplina": "Enfermagem",
    "assunto": "Gerenciamento de Resíduos de Serviços de Saúde (GRSS)",
    "enunciado": "Considerando as disposições normativas acerca do Gerenciamento dos Resíduos de Serviços de Saúde, analise as afirmativas a seguir e assinale (V) para a verdadeira e (F) para a falsa. ( ) O Gerenciamento dos Resíduos de Saúde deve abranger todas as etapas de planejamento dos recursos físicos, dos recursos materiais e da capacitação dos recursos humanos envolvidos. ( ) A unidade de saúde deve descrever as ações a serem adotadas em situações de emergência e acidentes decorrentes do gerenciamento dos resíduos de saúde. ( ) O serviço gerador de resíduos deve manter cópia do Plano de Gerenciamento de Resíduos de Serviços de Saúde - PGRSS disponível para consulta dos órgãos de vigilância sanitária ou ambientais, dos funcionários, dos pacientes ou do público em geral. As afirmativas são, na ordem apresentada, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – V – F."
      },
      {
        "letra": "B",
        "texto": "F – V – F."
      },
      {
        "letra": "C",
        "texto": "V – F – V."
      },
      {
        "letra": "D",
        "texto": "F – F – F."
      },
      {
        "letra": "E",
        "texto": "V – V – V."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 55,
    "disciplina": "Enfermagem",
    "assunto": "Epidemiologia e Vigilância em Saúde",
    "enunciado": "Uma das metas e indicadores do Plano de Ações Estratégicas para o Enfrentamento das Doenças Crônicas e Agravos não Transmissíveis no Brasil (2021 – 2030) é reduzir em 10% a mortalidade prematura por câncer de mama até 2030. Tendo como base a taxa de mortalidade de 20,3 (2015), a meta a ser alcançada, em 2030, é uma taxa de, aproximadamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "10,3."
      },
      {
        "letra": "B",
        "texto": "15,0."
      },
      {
        "letra": "C",
        "texto": "18,3."
      },
      {
        "letra": "D",
        "texto": "19,0."
      },
      {
        "letra": "E",
        "texto": "20,0."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 56,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Trabalhador",
    "enunciado": "A doença inflamatória relacionada ao trabalho que se caracteriza pelo processo inflamatório dos tendões, com espessamento e fibrose, provocando dor e impotência funcional, primordialmente na face flexora do 1º, 2º e 3º dedos e na borda interna do 4º dedo, é denominada",
    "alternativas": [
      {
        "letra": "A",
        "texto": "lesão do nervo cubital."
      },
      {
        "letra": "B",
        "texto": "síndrome do túnel do carpo."
      },
      {
        "letra": "C",
        "texto": "síndrome do canal de Guyon."
      },
      {
        "letra": "D",
        "texto": "síndrome do pronador redondo."
      },
      {
        "letra": "E",
        "texto": "compressão do nervo supra-escapular."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 57,
    "disciplina": "Enfermagem",
    "assunto": "Controle de Infecção e Biossegurança",
    "enunciado": "Com base nas disposições acerca dos procedimentos pós - exposição a material biológico, analise as afirmativas a seguir e assinale (V) para a verdadeira e (F) para a falsa. ( ) Recomenda-se como primeira conduta, após a ex posição a material biológico, os cuidados imediatos com a área atingida que incluem a lavagem exaustiva do local exposto com água e sabão nos casos de exposições percutâneas ou cutâneas. ( ) A Profilaxia pós -exposição - PEP deve ser iniciada o mais precocemente possível, idealmente nas primeiras 6 horas após a exposição, tendo como limite as 96 horas subsequentes à exposição. ( ) É direito de o indivíduo recusar a Profilaxia pós -exposição - PEP ou outros procedimentos indicados após a exposição, como a coleta de exames sorológicos e laboratoriais. As afirmativas são, na ordem apresentada, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "F – V – F."
      },
      {
        "letra": "B",
        "texto": "V – F – V."
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
    "numero": 58,
    "disciplina": "Enfermagem",
    "assunto": "Gestão em Enfermagem",
    "enunciado": "Acerca da digitalização e utilização de sistemas informatizados para a guarda, o armazenamento e o manuseio do prontuário do paciente, analise as afirmativas a seguir. I. Desde que sejam observados os requisitos legais, os documentos originais poderão ser destruídos após a sua digitalização. II. Os meios de armazenamento de documentos digitais deverão protegê-los do acesso, do uso, da alteração, da reprodução e da destruição não autorizados. III. Decorrido o prazo mínimo de 20 anos, a partir do último registro, os prontuários em suporte de papel e os digitalizados poderão ser eliminados. Está correto o que se afirma em",
    "alternativas": [
      {
        "letra": "A",
        "texto": "I, apenas."
      },
      {
        "letra": "B",
        "texto": "I e II, apenas."
      },
      {
        "letra": "C",
        "texto": "I e III, apenas."
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
    "correta": "E"
  },
  {
    "numero": 59,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "Durante a avaliação de um paciente, o enfermeiro identificou afasia de condução. Esse tipo de afasia é caracterizado pela(o)",
    "alternativas": [
      {
        "letra": "A",
        "texto": "repetição de vocábulos (parafasia), acompanhada de dificuldade na escrita."
      },
      {
        "letra": "B",
        "texto": "dificuldade leve ou extrema de compreensão da l inguagem e conhecida como afasia de Wernicke."
      },
      {
        "letra": "C",
        "texto": "incapacidade de nomear objetos, ainda que o conhecimento de sua utilidade seja preservado."
      },
      {
        "letra": "D",
        "texto": "dificuldade de se expressar pela fala ou pela escrita e classicamente conhecida como afasia de broca."
      },
      {
        "letra": "E",
        "texto": "comprometimento da compreensão e expressão da linguagem."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 60,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Adulto",
    "enunciado": "Um paciente adulto, 72 anos, diabético, apresenta angina em repouso ≤ 20min, com alívio após uso de nitrato. De acordo com estratificação de risco em pacientes com síndrome isquêmica aguda sem supradesnível do segmento ST, o risco de morte ou infarto apresentado por esse paciente é classificado como",
    "alternativas": [
      {
        "letra": "A",
        "texto": "leve."
      },
      {
        "letra": "B",
        "texto": "baixo"
      },
      {
        "letra": "C",
        "texto": "alto."
      },
      {
        "letra": "D",
        "texto": "moderado."
      },
      {
        "letra": "E",
        "texto": "muito alto."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 61,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "Durante a ausculta cardíaca de um paciente, o enferm eiro ouviu o som correspondente à primeira bulha cardíaca. Assinale a opção que apresenta as especificidades desse som.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "É mais audível no foco tricúspide com o paciente em decúbito lateral esquerdo e pode ser representada por “TU”."
      },
      {
        "letra": "B",
        "texto": "É um ruído protodiastólico de baixa frequência que se origina da vibração da parede ventricular distendida pela corrente sanguínea que penetra na cavidade durante o enchimento ventricular rápido."
      },
      {
        "letra": "C",
        "texto": "É um ruído débil que ocorre no fim da diástole ou pré -sístole e pode ser ouvida mais raramente em crianças e adultos jovens normais."
      },
      {
        "letra": "D",
        "texto": "É constituído por 4 grupos de vibrações, porém só são audíveis as originadas pelo fechamento das valvas aórtica e pulmonar."
      },
      {
        "letra": "E",
        "texto": "É um som mais grave, audível no ápice do coração, correspondendo ao fechamento das valvas mitral e tricúspide e marca o início da sístole."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 62,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "Acredita-se que o choque progride ao longo um processo continuo de estágios, através dos quais o paciente se empenha em sobreviver. Para melhor compreensão das respostas fisiológicas e dos sinais e sintomas clínicos, esse processo é dividido em estágios separados (compensatório, progressivo e irreversível). Nesse sentido, assinale a opção que apresenta as manifestações clínicas correspondentes ao estágio progressivo do choque.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Anúria e confusão mental."
      },
      {
        "letra": "B",
        "texto": "Pele fria e pegajosa e PA normal."
      },
      {
        "letra": "C",
        "texto": "Alcalose respiratória e FC > de 100 bpm."
      },
      {
        "letra": "D",
        "texto": "PAS < 90 mmHg e acidose metabólica."
      },
      {
        "letra": "E",
        "texto": "FR > 20 mrm e débito urinário diminuído."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 63,
    "disciplina": "Enfermagem",
    "assunto": "Gestão em Enfermagem",
    "enunciado": "A diária hospitalar é a permanência de um cliente por um período de até 24 horas em uma instituição hospitalar e inclui algumas despesas especificas. Um dos itens já incluídos na diária hospitalar e que não deve ser cobrado de forma separada na conta, são as despesas com",
    "alternativas": [
      {
        "letra": "A",
        "texto": "medicamentos."
      },
      {
        "letra": "B",
        "texto": "oxigenoterapia."
      },
      {
        "letra": "C",
        "texto": "honorários médicos."
      },
      {
        "letra": "D",
        "texto": "limpeza e desinfecção do ambiente."
      },
      {
        "letra": "E",
        "texto": "exames diagnósticos de imagem."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 64,
    "disciplina": "Enfermagem",
    "assunto": "Gestão em Enfermagem",
    "enunciado": "Acerca da auditoria dos serviços de saúde, analise as afirmativas a seguir e assinale (V) para a verdadeira e (F) para falsa. ( ) A auditoria operacional ou concorrente envolve a obtenção e avaliação de evidências a respeito da eficiência e eficácia das atividades de uma instituição, em comparação com os objetivos estabelecidos. ( ) A auditoria de conformidade examina a legalidade dos atos de gestão dos responsáveis sujeitos à sua jurisdição, quanto ao aspecto assistencial, contábil, financeiro, orçamentário e patrimonial ( ) A auditoria prospectiva avalia os procedimentos antes de sua realização, tem caráter preventivo, procurando detectar situações de alarme para evitar problemas. As afirmativas são, na ordem apresentada, respectivamente.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – F – V."
      },
      {
        "letra": "B",
        "texto": "F – V – F."
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
    "correta": "C"
  },
  {
    "numero": 65,
    "disciplina": "Enfermagem",
    "assunto": "Epidemiologia e Vigilância em Saúde",
    "enunciado": "Com base nos conceitos relacionados à bioestatística, analise as afirmativas a seguir e assinale (V) para a verdadeira e (F) para a falsa. ( ) A mediana é muito sensível à presença de valores extremos, enquanto a média aritmética não sofre essa interferência e é recomendada quando a distribuição de valores é fortemente assimétrica. ( ) Quando o espaço amostral contém um número finito, ou infinito, porém contável, de pontos, é chamado espaço amostral contínuo. ( ) As medidas de dispersão são estatísticas d escritivas que visam fornecer o grau de variabilidade das observações em relação a um valor central. As afirmativas são, na ordem apresentada, respectivamente,",
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
        "texto": "F – F – F."
      },
      {
        "letra": "D",
        "texto": "V – V – V."
      },
      {
        "letra": "E",
        "texto": "F – V – F."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 66,
    "disciplina": "Enfermagem",
    "assunto": "Prática Baseada em Evidências",
    "enunciado": "A Prática Baseada em Evidências envolve a definição de um problema, a averiguação e a avaliação crítica das evidências disponíveis, a implementação destas na prática e a apreciação dos resultados, por meio da integração de três elementos. Assinale a opção que os apresenta.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Levantamento dos riscos, análise clínica e avaliação do desempenho."
      },
      {
        "letra": "B",
        "texto": "Melhor evidência, habilidades clínicas e preferência do paciente."
      },
      {
        "letra": "C",
        "texto": "Diagnóstico adequado, prática clínica e avaliação de desempenho."
      },
      {
        "letra": "D",
        "texto": "Análise situacional, id entificação da evidência e resolução do problema."
      },
      {
        "letra": "E",
        "texto": "Planejamento, implementação da ação e acompanhamento do resultado."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 67,
    "disciplina": "Enfermagem",
    "assunto": "Epidemiologia e Vigilância em Saúde",
    "enunciado": "Um estudo sobre doenças cardiovasculares apresentou as seguintes variáveis: sexo, grau de instrução, número de cigarros por dia e pressão arterial. Associe as variáveis apresentadas no estudo à sua respectiva categorização. 1. Sexo 2. Grau de instrução 3. Número de cigarros por dia 4. Valor de pressão arterial ( ) Qualitativa ordinal ( ) Quantitativa contínua ( ) Qualitativa nominal ( ) Quantitativa discreta Assinale a opção que indica a relação correta, segundo a ordem apresentada.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "1 – 3 – 2 – 4."
      },
      {
        "letra": "B",
        "texto": "4 – 1 – 3 – 2."
      },
      {
        "letra": "C",
        "texto": "3 – 4 – 2 – 1."
      },
      {
        "letra": "D",
        "texto": "1 – 3 – 4 – 2."
      },
      {
        "letra": "E",
        "texto": "2 – 4 – 1 – 3."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 68,
    "disciplina": "Direito Administrativo",
    "assunto": "Licitações e Contratos",
    "enunciado": "O planejamento e elaboração de projetos para aquisição de materiais e insumos em saúde devem seguir as regras que regem a administração pública. Essas regras são estabelecidas pelas normas gerais de licitação e contratação, previstas em lei. Acerca dessas normas, analise as afirmativas a seguir e assinale V para a verdadeira e F para a falsa ( ) O planejamento de compras deverá considerar a expectativa de consumo anual, além de observar outros aspectos como condições de guarda e armazenamento que não permi tam a deterioração do material. ( ) A fase preparatória do processo licitatório consiste na etapa de planejamento e deve ser iniciada pela descrição da necessidade da contratação, fundamentada em estudo técnico preliminar que caracterize o interesse públ ico envolvido ( ) A licitação é obrigatória para a aquisição de medicamentos destinados ao tratamento de doenças raras, assim definidas pelo Ministério da Saúde. As afirmativas são, na ordem apresentada, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – V – F."
      },
      {
        "letra": "B",
        "texto": "F – V – F."
      },
      {
        "letra": "C",
        "texto": "V – V – V."
      },
      {
        "letra": "D",
        "texto": "F – F – V."
      },
      {
        "letra": "E",
        "texto": "V – F – F."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 70,
    "disciplina": "Enfermagem",
    "assunto": "Ética e Legislação em Enfermagem",
    "enunciado": "O profissional de Enfermagem que delega atribuições de outros profissionais de enfermagem, previstas na legislação, para acompanhantes e/ou responsáveis pelo paciente, comete uma infração que pode ser punida com multa. Nesse caso, esse profissional pode ser obrigado a pagar",
    "alternativas": [
      {
        "letra": "A",
        "texto": "de 01 a 5 vezes o valor da anuidade da categoria profissional à qual pertence o infrator, em vigor no ato da infração."
      },
      {
        "letra": "B",
        "texto": "de 01 a 10 vezes o valor da anuidade da categoria profissional à qual pertence o infrator, em vigor no ato do pagamento."
      },
      {
        "letra": "C",
        "texto": "de 01 a 15 vezes o valor da anuidade da categoria profissional à qual pertence o infrator, em vigor no ato da infração."
      },
      {
        "letra": "D",
        "texto": "de 01 a 20 vezes o valor da anuidade da categoria profissional à qual pertence o infrator, em vigor no ato do pagamento."
      },
      {
        "letra": "E",
        "texto": "de 01 a 30 vezes o valor da anuidade da categoria profissional à qual pertence o infrator, em vigor no ato da infração."
      }
    ],
    "correta": "B"
  }
];
