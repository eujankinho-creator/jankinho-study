/**
 * Questões originais FGV Prefeitura de São José dos Campos – Saúde, Edital 04/2023,
 * prova 26/11/2023, Tipo 1 (branca), enunciados/alternativas publicados pela FGV.
 * Reprodução autorizada conforme informação do responsável pelo Córtex.
 * Gabarito oficial DEFINITIVO retificado em 09/01/2024.
 * Cargo Analista em Saúde - Enfermeiro. Prova: https://conhecimento.fgv.br/sites/default/files/concursos/cns001-analista-em-saude-enfermeirocns001-tipo-1.pdf
 * Gabarito: https://conhecimento.fgv.br/sites/default/files/concursos/sjcsaude2023_gabarito_definitivo_20240104.pdf
 * Exclusões: Q35 anulada.
 */
export type QuestaoFGVSJC = {numero:number;disciplina:string;assunto:string;enunciado:string;alternativas:{letra:string;texto:string}[];correta:string};
export const QUESTOES_FGV_SJC_ENFERMEIRO_2023:QuestaoFGVSJC[] = [
  {
    "numero": 31,
    "disciplina": "Legislação do SUS",
    "assunto": "Lei 8.080/1990 - Organização e Competências",
    "enunciado": "Com base nos objetivos e atribuições do Sistema Único de Saúde previstos na Lei 8.080/90, avalie se as afirmativas a seguir são verdadeiras (V) ou falsas (F). ( ) Está incluída no campo de atuação do Sistema Único de Saúde (SUS) a colabor ação na proteção do meio ambiente, nele compreendido o do trabalho. ( ) Um dos objetivos do SUS diz respeito à organização dos serviços públicos de modo a evitar duplicidade de meios para fins idênticos. ( ) A avaliação do impacto que as tecnologias pr ovocam à saúde está no campo de abrangência da Saúde do Trabalhador. As afirmativas são, respectivamente,",
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
        "texto": "V – V – V."
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
    "correta": "A"
  },
  {
    "numero": 32,
    "disciplina": "Legislação do SUS",
    "assunto": "Lei 8.080/1990 - Organização e Competências",
    "enunciado": "Assinale a opção que corresponde a uma das competências da direção municipal do Sistema Único de Saúde – SUS.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Coordenar ações de vigilância epidemiológica."
      },
      {
        "letra": "B",
        "texto": "Controlar e avaliar as redes hierarquizadas do SUS."
      },
      {
        "letra": "C",
        "texto": "Definir e coordenar os sistemas de vigilância sanitária."
      },
      {
        "letra": "D",
        "texto": "Fiscalizar os procedimentos dos serviços privados de saúde."
      },
      {
        "letra": "E",
        "texto": "Formular, avaliar e apoiar políticas de alimentação e nutrição."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 33,
    "disciplina": "Legislação do SUS",
    "assunto": "Controle Social no SUS",
    "enunciado": "Acerca das Conferências e Conselhos de Saúde, avalie se as afirmativas a seguir são verdadeiras (V) ou falsas (F). ( ) O Conselho de Saúde é um órgão colegiado de caráter permanente, deliberativo, que deve ser composto por representantes do governo, prestadores de serviço, profissionais de saúde e usuários. ( ) A Conferência de Saúde, composta por vários segmentos sociais, tem a função de fiscalizar, acompanhar e monitorar as políticas públicas de saúde. ( ) A representação dos usuários nos Conselhos de Saúde e Conferências deve ser paritária em relação ao conjunto dos demais segmentos. As afirmativas são, respectivamente,",
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
        "texto": "F – F – V."
      },
      {
        "letra": "E",
        "texto": "V – V – V."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 34,
    "disciplina": "Legislação do SUS",
    "assunto": "Redes de Atenção à Saúde",
    "enunciado": "Considerando os níveis de assistência à saúde, assinale a opção que corresponde a um serviço de atenção secundária ou de média complexidade.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Consultórios de rua."
      },
      {
        "letra": "B",
        "texto": "Unidades Básicas de Saúde."
      },
      {
        "letra": "C",
        "texto": "Ambulatórios de cardiologia."
      },
      {
        "letra": "D",
        "texto": "Unidades de terapia Intensiva."
      },
      {
        "letra": "E",
        "texto": "Unidades de ensino e pesquisa."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 36,
    "disciplina": "Legislação do SUS",
    "assunto": "Redes de Atenção à Saúde",
    "enunciado": "Com base nas disposições acerca da organização do Sistema Único de Saúde, analise as afirmativas a seguir. I. Para que uma região de saúde seja instituída ela deve conter minimamente serviços de vigilância em saúde ambiental e de vigilância sanitária. II. Em relação às Regiões de Saúde, cabe aos entes federativos definir seus li mites geográficos e a população usuária das ações e serviços. III. Serviços Especiais de Acesso Aberto são serviços de saúde específicos para o atendimento da pessoa que, em razão de agravo ou de situação laboral, necessita de atendimento especial. Está correto o que se afirma em",
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
        "texto": "II e III, apenas."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 37,
    "disciplina": "Enfermagem",
    "assunto": "Segurança do Paciente",
    "enunciado": "Com base nos Requisitos de Boas Práticas de Funcionamento para os Serviços de Saúde, analise as afirmativas a seguir. I. O serviço de saúde deve possuir equipe multiprofissional dimensionada de acordo com seu perfil de demanda. II. Uma das responsabilidades dos serviços de saúde é promover a capacitação de seus profissionais antes do início das atividades e de forma permanent e em conformidade com as atividades desenvolvidas. III. O serviço de saúde deve executar ações de gerenciamento dos riscos de acidentes inerentes às atividades desenvolvidas. Está correto o que se afirma em",
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
    "correta": "E"
  },
  {
    "numero": 38,
    "disciplina": "Enfermagem",
    "assunto": "Segurança do Paciente",
    "enunciado": "De acordo com os Requisitos de Boas Práticas de Funcionamento para os Serviços de Saúde, tais serviços devem estabelecer estratégias e ações voltadas para Segurança do Paciente. Entre essas ações estão mecanismos para",
    "alternativas": [
      {
        "letra": "A",
        "texto": "promover o autocuidado."
      },
      {
        "letra": "B",
        "texto": "prevenir úlceras por pressão."
      },
      {
        "letra": "C",
        "texto": "estimular a proteção especifica."
      },
      {
        "letra": "D",
        "texto": "estimular a promoção da saúde."
      },
      {
        "letra": "E",
        "texto": "orientar a identificação de riscos."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 39,
    "disciplina": "Enfermagem",
    "assunto": "Segurança do Paciente",
    "enunciado": "De acordo com as disposições normativas acerca da segurança do paciente, os eventos adversos que evoluírem para óbito devem ser notificados em até",
    "alternativas": [
      {
        "letra": "A",
        "texto": "24 horas a partir do ocorrido."
      },
      {
        "letra": "B",
        "texto": "36 horas a partir do ocorrido."
      },
      {
        "letra": "C",
        "texto": "48 horas a partir do ocorrido."
      },
      {
        "letra": "D",
        "texto": "72 horas a partir do ocorrido."
      },
      {
        "letra": "E",
        "texto": "96 horas a partir do ocorrido."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 40,
    "disciplina": "Enfermagem",
    "assunto": "Política Nacional de Humanização",
    "enunciado": "Assinale a opção que corresponde a uma das diretrizes da Política Nacional de Humanização do SUS.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Transversalidade."
      },
      {
        "letra": "B",
        "texto": "Valorização do trabalhador."
      },
      {
        "letra": "C",
        "texto": "Autonomia dos sujeitos e coletivos."
      },
      {
        "letra": "D",
        "texto": "Fortalecimento do controle social."
      },
      {
        "letra": "E",
        "texto": "Indissociabilidade entre atenção e gestão."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 41,
    "disciplina": "Enfermagem",
    "assunto": "Epidemiologia e Vigilância em Saúde",
    "enunciado": "Com base nos conceitos relacionados à prevenção de doenças e suas categorias, avalie se as afirmativas a seguir são verdadeiras (V) ou falsas (F). ( ) A manutenção de baixo risco é a realização de testes ou exames diagnósticos em populações ou pessoas assintomáticas, com a finalidade de diagnóstico precoce. ( ) A redução de risco foca nas características que implicam risco de moderado a alto, entre os indivíduos ou segmentos da população, e busca maneiras de controlar ou diminuir a prevalência da doença. ( ) A detecção precoce tem por objetivo assegurar que as pessoas de baixo risco para problemas de saúde permaneçam com essa condição e encontrem meios de evitar doença. As afirmativas são, respectivamente,",
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
    "correta": "B"
  },
  {
    "numero": 42,
    "disciplina": "Enfermagem",
    "assunto": "Epidemiologia e Vigilância em Saúde",
    "enunciado": "As variações cíclicas são definidas como flutuações na incidência de uma doença que",
    "alternativas": [
      {
        "letra": "A",
        "texto": "ocorrem de forma inusitada."
      },
      {
        "letra": "B",
        "texto": "coincidem com as estações do ano."
      },
      {
        "letra": "C",
        "texto": "ocorrem em um período maior que um ano."
      },
      {
        "letra": "D",
        "texto": "ocorrem dentro do período de um ano."
      },
      {
        "letra": "E",
        "texto": "dependem de fatores como temperatura e umidade do ar."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 43,
    "disciplina": "Enfermagem",
    "assunto": "Epidemiologia e Vigilância em Saúde",
    "enunciado": "A OMS divulgou, em agosto de 2023, boletim semanal que apontava para o aumento de 68% na incidência de Covid -19 em relação ao período anterior. Isso significa que, no período avaliado, houve o aumento dos casos",
    "alternativas": [
      {
        "letra": "A",
        "texto": "novos."
      },
      {
        "letra": "B",
        "texto": "tratados."
      },
      {
        "letra": "C",
        "texto": "suspeitos."
      },
      {
        "letra": "D",
        "texto": "notificados."
      },
      {
        "letra": "E",
        "texto": "prevalentes."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 44,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Criança e do Adolescente",
    "enunciado": "O indicador de saúde denominado taxa de mortalidade neonatal tardia diz respeito ao número de óbitos em crianças de",
    "alternativas": [
      {
        "letra": "A",
        "texto": "0 a 6 dias de vida completos."
      },
      {
        "letra": "B",
        "texto": "0 a 15 dias de vida completos"
      },
      {
        "letra": "C",
        "texto": "7 a 27 dias de vida completos."
      },
      {
        "letra": "D",
        "texto": "15 a 30 dias de vida completos."
      },
      {
        "letra": "E",
        "texto": "28 a 364 dias de vida completos."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 45,
    "disciplina": "Enfermagem",
    "assunto": "Epidemiologia e Vigilância em Saúde",
    "enunciado": "O estudo epidemiológico observacional que reúne dois ou mais grupos de pessoas e os acompanha longitudinalmente no tempo, partindo da exposição e indo ao encontro do desfecho, é denominado",
    "alternativas": [
      {
        "letra": "A",
        "texto": "coorte."
      },
      {
        "letra": "B",
        "texto": "seccional."
      },
      {
        "letra": "C",
        "texto": "caso-controle."
      },
      {
        "letra": "D",
        "texto": "meta-análise."
      },
      {
        "letra": "E",
        "texto": "ensaio clínico."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 46,
    "disciplina": "Enfermagem",
    "assunto": "Imunização",
    "enunciado": "Sobre as recomendações acerca das vacinas disponibilizadas pelo Programa Nacional de Imunização, assinale a afirmativa correta.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Pessoas portadoras de HIV que não foram vacinadas com a BCG na infância podem tomar a vacina até os 20 anos."
      },
      {
        "letra": "B",
        "texto": "A primeira dose da vacina contra a Hepatite B deve ser administrada, preferencialmente, nas primeiras 12 horas após o nascimento."
      },
      {
        "letra": "C",
        "texto": "O primeiro reforço da vacina DTP deve ser administrado aos 12 meses de idade e o segundo aos 2 anos de idade."
      },
      {
        "letra": "D",
        "texto": "A vacina inativada contra a poliomielite (VIP) deve ser administrada com intervalo mínimo de 20 dias entre as doses e máximo de 45 dias."
      },
      {
        "letra": "E",
        "texto": "Na gestante, a vacina dupla adulto (dT) deve ser administrada apenas no primeiro trimestre da gestação."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 47,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Idoso",
    "enunciado": "Com base nas disposições da Política Nacional de Saúde da Pessoa Idosa, avalie se as afirmativas a seguir são verdadeiras (V) ou falsas (F). ( ) Uma das diretrizes da Política Nacional da Pessoa Idosa é a promoção do envelhecimento ativo e saudável. ( ) A finalidade primordial da Política Nacional de Saúde da Pessoa Idosa é recuperar, manter e promover a autonomia e a independência dos indivíduos idosos. ( ) Considera-se o idoso com potencial para desenvolver fragilidade aquele que encontra -se com pelo menos uma incapacidade funcional básica ou viva situações de violência doméstica. As afirmativas são, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – V – F."
      },
      {
        "letra": "B",
        "texto": "F – V – V."
      },
      {
        "letra": "C",
        "texto": "V – V – V."
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
    "correta": "A"
  },
  {
    "numero": 48,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Adulto",
    "enunciado": "Um paciente portador de doença cardíaca se sente bem em repouso, porém, mesmo atividades físicas menos intensas que as habituais causam sintomas como dispneia, fadiga e palpitação. De acordo com a classificação funcional, esse paciente é classificado com insuficiência cardíaca",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Classe I."
      },
      {
        "letra": "B",
        "texto": "Classe II."
      },
      {
        "letra": "C",
        "texto": "Classe III."
      },
      {
        "letra": "D",
        "texto": "Classe IV."
      },
      {
        "letra": "E",
        "texto": "Classe V."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 49,
    "disciplina": "Enfermagem",
    "assunto": "Processo de Enfermagem e SAE",
    "enunciado": "Determinar os resultados que se espera alcançar na assistência a um paciente internado na clínica cirúrgica de uma unidade hospitalar, é ação que faz parte da etapa do processo de enfermagem de",
    "alternativas": [
      {
        "letra": "A",
        "texto": "implementação."
      },
      {
        "letra": "B",
        "texto": "coleta de dados."
      },
      {
        "letra": "C",
        "texto": "diagnóstico."
      },
      {
        "letra": "D",
        "texto": "planejamento."
      },
      {
        "letra": "E",
        "texto": "complementação."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 50,
    "disciplina": "Enfermagem",
    "assunto": "Urgência e Emergência",
    "enunciado": "Um critério que caracteriza uma RCP de alta qualidade na assistência a um paciente adulto em parada cardiorrespiratória é",
    "alternativas": [
      {
        "letra": "A",
        "texto": "evitar ventilação excessiva."
      },
      {
        "letra": "B",
        "texto": "realizar até 100 compressões torácicas por minuto."
      },
      {
        "letra": "C",
        "texto": "comprimir o tórax do paciente com força suficiente que não ultrapasse 5cm."
      },
      {
        "letra": "D",
        "texto": "alternar os responsáveis pelas compressões torácicas a cada 4 minutos."
      },
      {
        "letra": "E",
        "texto": "realizar 20 compressões para 5 ventilações, se não houver via aérea avançada."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 51,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Criança e do Adolescente",
    "enunciado": "Acerca da triagem neonatal biológica (teste do pezinho), avalie se as afirmativas a seguir são verdadeiras (V) ou falsas (F). ( ) O período ideal para coleta da primeira amostra é entre o 5º e o 7º dia de vida do bebê. ( ) Entre as doenças que podem ser diagnosticas pelo teste do pezinho estão a fenilcetonúria e a fibrose cística. ( ) As amostras que não forem enviadas ao laboratório logo após a secagem completa devem ser mantidas refrigeradas a uma temperatura inferior a 8°C. As afirmativas são, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – F – V."
      },
      {
        "letra": "B",
        "texto": "F – F – V."
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
    "correta": "D"
  },
  {
    "numero": 52,
    "disciplina": "Enfermagem",
    "assunto": "Hipertensão Arterial",
    "enunciado": "Considerando todos os critérios recomendados para o diagnóstico, um dos valores definidores da hipertensão arterial é",
    "alternativas": [
      {
        "letra": "A",
        "texto": "PAD ≥ 80."
      },
      {
        "letra": "B",
        "texto": "PAD ≥ 85."
      },
      {
        "letra": "C",
        "texto": "PAS ≥ 130mmHg."
      },
      {
        "letra": "D",
        "texto": "PAS ≥ 135mmHg."
      },
      {
        "letra": "E",
        "texto": "PAS ≥ 140mmHg."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 53,
    "disciplina": "Enfermagem",
    "assunto": "Hanseníase",
    "enunciado": "Com base no protocolo de tratamento farmacológico da Hanseníase, avalie se as afirmativas a seguir são verdadeiras (V) ou falsas (F). ( ) A Poliquimioterapia - PQT deverá ser interrompida após a administração de seis doses mensais supervisionadas em intervalo de até nove meses para os casos multibacilares. ( ) A rifampicina é um potente bactericida para M. leprae, sendo o único medicamento bactericida incluído no regime de PQT-U. ( ) A clofazimina é contraindicada para mulheres grávidas devido ao seu potencial teratogênico. As afirmativas são, respectivamente,",
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
    "correta": "A"
  },
  {
    "numero": 54,
    "disciplina": "Enfermagem",
    "assunto": "Tuberculose",
    "enunciado": "Acerca da identificação e avaliação de pessoas que foram expostas a pacientes com tuberculose (contatos), analise as afirmativas a seguir. I. Um dos critérios de priorização para avaliação dos contatos é crianças menores de cinco anos de idade. II. Os cont atos sintomáticos (crianças, adolescentes e adultos) devem realizar o tratamento da Infecção latente pelo M. tuberculosis – ILTB independentemente da prova tuberculínica. III. Um dos casos em que se recomenda a avaliação de contatos é quando o caso índice for TB pulmonar definida por critérios clínicos, ainda que sem confirmação bacteriológica. Está correto o que se afirma em",
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
        "texto": "I e III, apenas."
      },
      {
        "letra": "E",
        "texto": "I, II e III."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 55,
    "disciplina": "Enfermagem",
    "assunto": "Diabetes Mellitus",
    "enunciado": "De acordo com os protocolos do Ministério da Saúde para o tratamento do Diabetes Tipo 1, os análogos de insulina de ação rápida possuem farmacocinética semelhante, com ação que dura em torno de",
    "alternativas": [
      {
        "letra": "A",
        "texto": "1 a 2 horas."
      },
      {
        "letra": "B",
        "texto": "2 a 3 horas."
      },
      {
        "letra": "C",
        "texto": "3 a 4 horas."
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
    "numero": 56,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Adulto",
    "enunciado": "Acerca da Política Nacional de HIV/AIDS, analise as afirmativas a seguir e assinale V para a afirmativa verdadeira e F para a falsa. ( ) É direito do portador do vírus HIV não ser submetido a isolamento, quarentena ou qualquer tipo de discriminação. ( ) O diagnóstico da infecção pelo HIV é feito a partir da coleta de sangue venoso ou digital (ponta do dedo), para realização de testes rápidos ou laboratoriais que detectam os anticorpos contra o HIV. ( ) Além dos testes rápidos e labora toriais, o SUS também disponibiliza de forma gratuita autotestes para que as pessoas possam se testar quando e onde quiserem. As afirmativas são, respectivamente,",
    "alternativas": [
      {
        "letra": "A",
        "texto": "V – F – F."
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
        "texto": "F – V – V."
      },
      {
        "letra": "E",
        "texto": "V – V – V."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 57,
    "disciplina": "Enfermagem",
    "assunto": "Gerenciamento de Resíduos de Serviços de Saúde (GRSS)",
    "enunciado": "Com base nas disposições acerca do gerenciamento dos Resíduos de Serviços de Saúde (RSS), analise as afirmativas a seguir. I. Os sacos contendo RSS infectantes de fácil putrefação devem ser substituídos no máximo a cada 48 horas, independentemente do volume. II. O recipiente de acondicionamento dos materiais perfurocortantes deve conter a identificação de todos os riscos presentes. III. A identificação dos sacos para acondicionamento dos RSS deve estar impressa, sendo vedado o uso de adesivo. Está correto o que se afirma em",
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
    "correta": "D"
  },
  {
    "numero": 58,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Adulto",
    "enunciado": "Na estratégia de diagnóstico precoce do câncer de próstata, é importante que os profissionais de saúde estejam aptos a reconhecer os sinais e sintomas suspeitos desse tipo de câncer. Entre esses sinais e sintomas está(ão)",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a disúria."
      },
      {
        "letra": "B",
        "texto": "a dor abdominal."
      },
      {
        "letra": "C",
        "texto": "a hematúria visível."
      },
      {
        "letra": "D",
        "texto": "a dor na região dos flancos."
      },
      {
        "letra": "E",
        "texto": "as linfonodomegalias inguinais."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 59,
    "disciplina": "Enfermagem",
    "assunto": "Epidemiologia e Vigilância em Saúde",
    "enunciado": "Com base nas disposições acerca da febre maculosa (FMB), avalie se as afirmativas a seguir são verdadeiras (V) ou falsas (F). ( ) O período de incubação da FMB é de 7 dias, em média, podendo variar de 2 a 14 dias. ( ) Clinicamente, a apresentação típica do exantema é de padrão maculopapular, não pruriginoso, com lesões variando entre 1 e 5 mm, acometendo inicialmente as extremidades (punhos e tornozelos, palmas das mãos e planta dos pés). ( ) Todo caso suspeito de febre maculosa requer notificação compulsória imediata por qualquer meio de comunicação. As afirmativas são, respectivamente,",
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
        "texto": "F – F – V."
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
    "correta": "B"
  },
  {
    "numero": 60,
    "disciplina": "Enfermagem",
    "assunto": "Arboviroses (Dengue, Zika, Chikungunya, Febre Amarela, Oropouche e Nilo Ocidental)",
    "enunciado": "No atendimento a um paciente adulto com suspeita de dengue, um sinal de alarme é",
    "alternativas": [
      {
        "letra": "A",
        "texto": "a náusea."
      },
      {
        "letra": "B",
        "texto": "a exantema."
      },
      {
        "letra": "C",
        "texto": "a artralgia."
      },
      {
        "letra": "D",
        "texto": "a prova do laço positiva."
      },
      {
        "letra": "E",
        "texto": "a hipotensão postural."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 61,
    "disciplina": "Enfermagem",
    "assunto": "Epidemiologia e Vigilância em Saúde",
    "enunciado": "Nos casos em que há indicação, recomenda -se que a quimioprofilaxia antiviral para influenza seja iniciada em até",
    "alternativas": [
      {
        "letra": "A",
        "texto": "12 horas após exposição."
      },
      {
        "letra": "B",
        "texto": "24 horas após exposição."
      },
      {
        "letra": "C",
        "texto": "48 horas após exposição."
      },
      {
        "letra": "D",
        "texto": "60 horas após exposição."
      },
      {
        "letra": "E",
        "texto": "72 horas após exposição."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 62,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Criança e do Adolescente",
    "enunciado": "Com base nas recomendações do Ministério da Saúde acerca do clampeamento do cordão umbilical em recém -nascidos que não demandem ressuscitação imediata, é correto afirmar que",
    "alternativas": [
      {
        "letra": "A",
        "texto": "para recém-nascidos prematuros com menos de 34 semanas, o clampeamento do cordão deve ser adiado por pelo menos 60 segundos."
      },
      {
        "letra": "B",
        "texto": "recomenda-se que o clampeamento do cordão seja adiado por 60 segundos ou mais apenas nos recém-nascidos com mais de 34 semanas."
      },
      {
        "letra": "C",
        "texto": "no parto de gravidez gemelar monocoriônica o clampeamento tardio do cordão umbilical não deve exceder 60 segundos."
      },
      {
        "letra": "D",
        "texto": "a principal vantagem do clampeamento tardio do cordão umbilical é o aumento da hemoglobina e diminuição da icterícia neonatal."
      },
      {
        "letra": "E",
        "texto": "o clampeamento tardio do cordão umbilical traz benefícios ao recém-nascido a termo, mas é prejudicial para os prematuros limítrofesa."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 63,
    "disciplina": "Enfermagem",
    "assunto": "Saúde da Mulher",
    "enunciado": "Com base nas disposições do Ministério da Saúde acerca da assistência ao parto normal, avalie se as afirmativas a seguir são verdadeiras (V) ou falsas (F). ( ) No primeiro período do trabalho de parto deve -se registrar a frequência das contrações e a frequência cardíaca materna de 1 em 1 hora. ( ) A fase ativa do segundo período do parto é caracterizada por contrações uterinas dolorosas e regulares, substancial apagamento cervical e dilatação cervical mais rápida, acima de 5cm. ( ) Deve-se solicitar a presença do médico obstetra se, imediatamente após o parto, a mulher apresentar pulso > 120bpm verificado em 2 ocasiões com 30 minutos de intervalo. As afirmativas são, respectivamente,",
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
        "texto": "F – V – V."
      }
    ],
    "correta": "B"
  },
  {
    "numero": 64,
    "disciplina": "Enfermagem",
    "assunto": "Centro de Material e Esterilização (CME)",
    "enunciado": "Acerca dos conceitos e definições relacionados ao processamento de produtos para a saúde, assinale a afirmativa correta.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "As leitoras de indicadores biológicos e as seladoras térmicas devem ser calibradas, no mínimo, a cada 6 meses."
      },
      {
        "letra": "B",
        "texto": "Os produtos que não entram em contato com o paciente ou entram em contato com pele íntegra são classificados como produtos para saúde semicríticos."
      },
      {
        "letra": "C",
        "texto": "Os produtos para saúde classificados como críticos devem ser submetidos no mínimo à desinfecção de alto nível, após a limpeza."
      },
      {
        "letra": "D",
        "texto": "O CME Classe II é aquele que realiza o processamento de produtos para a saúde não -críticos, semicríticos e críticos de conformação não complexa, passíveis de processamento."
      },
      {
        "letra": "E",
        "texto": "No monitoramento do processo de esterilização dos produtos para saúde implantáveis deve ser adicionado um indicador biológico a cada carga."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 65,
    "disciplina": "Enfermagem",
    "assunto": "Imunização",
    "enunciado": "De acordo com as orientações do Mini stério da Saúde, acerca do esquema vacinal primário recomendado para crianças entre seis meses e quatro anos com o imunizante COVID -19 Pfizer, assinale a afirmativa correta.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Deve ser composto por uma dose."
      },
      {
        "letra": "B",
        "texto": "Deve ser composto por duas doses."
      },
      {
        "letra": "C",
        "texto": "Deve ser composto por três doses."
      },
      {
        "letra": "D",
        "texto": "O intervalo recomendado é de oito semanas entre a primeira e a segunda dose."
      },
      {
        "letra": "E",
        "texto": "O intervalo recomendado é de quatro semanas entre a segunda e a terceira dose."
      }
    ],
    "correta": "C"
  },
  {
    "numero": 66,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "Na análise da gasometria, um dos parâmetro s que caracteriza a presença de alcalose respiratória é",
    "alternativas": [
      {
        "letra": "A",
        "texto": "pH < 7,3."
      },
      {
        "letra": "B",
        "texto": "PaCO2 > 35mmHg."
      },
      {
        "letra": "C",
        "texto": "PaCO2 > 45mmHg."
      },
      {
        "letra": "D",
        "texto": "HCO3 < 22mEq/L."
      },
      {
        "letra": "E",
        "texto": "HCO3 > 27mEq/L."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 67,
    "disciplina": "Enfermagem",
    "assunto": "Fundamentos e Semiotécnica",
    "enunciado": "Assinale a opção que corresponde a um sinal semiológico que possui várias funcionalidades, podendo ser avaliado em casos de suspeitas de irritação meníngea, radiculopatias e hemorragias subaracnóideas.",
    "alternativas": [
      {
        "letra": "A",
        "texto": "Kernig."
      },
      {
        "letra": "B",
        "texto": "Murphy."
      },
      {
        "letra": "C",
        "texto": "Romberg."
      },
      {
        "letra": "D",
        "texto": "Blumberg."
      },
      {
        "letra": "E",
        "texto": "Grey-Turner."
      }
    ],
    "correta": "A"
  },
  {
    "numero": 68,
    "disciplina": "Enfermagem",
    "assunto": "Saúde do Idoso",
    "enunciado": "Ao avaliar um paciente idoso, o enfermeiro observou que o paciente andava “ como um bloco enrijecido, sem o movimento automático dos braços e com a cabeça inclinada para frente”. Essas são características da marcha",
    "alternativas": [
      {
        "letra": "A",
        "texto": "atáxica."
      },
      {
        "letra": "B",
        "texto": "anserina."
      },
      {
        "letra": "C",
        "texto": "paraparética."
      },
      {
        "letra": "D",
        "texto": "helicópode."
      },
      {
        "letra": "E",
        "texto": "parkinsoniana."
      }
    ],
    "correta": "E"
  },
  {
    "numero": 69,
    "disciplina": "Enfermagem",
    "assunto": "Ética e Legislação em Enfermagem",
    "enunciado": "De acordo com as disposições do Código de Ética de Enfermagem, é considerada uma infração moderada aquela que",
    "alternativas": [
      {
        "letra": "A",
        "texto": "causar dano moral irremediável."
      },
      {
        "letra": "B",
        "texto": "difamar organizações da categoria."
      },
      {
        "letra": "C",
        "texto": "provocar a debilidade permanente de sentido."
      },
      {
        "letra": "D",
        "texto": "provocar a debilidade temporária de membro."
      },
      {
        "letra": "E",
        "texto": "ofender a integridade física sem causar debilidade."
      }
    ],
    "correta": "D"
  },
  {
    "numero": 70,
    "disciplina": "Enfermagem",
    "assunto": "Ética e Legislação em Enfermagem",
    "enunciado": "Um dos deveres do profissional de enfermagem é prestar assistência livre de danos decorrentes de imperícia, negligência ou imprudência. Nesse caso, um exemplo de ação praticada com imperícia é",
    "alternativas": [
      {
        "letra": "A",
        "texto": "omissão de socorro."
      },
      {
        "letra": "B",
        "texto": "administrar medicamento na hora errada."
      },
      {
        "letra": "C",
        "texto": "esquecer o garrote no braço do paciente."
      },
      {
        "letra": "D",
        "texto": "deixar de usar equipamento de proteção individual."
      },
      {
        "letra": "E",
        "texto": "realizar um procedimento usando técnica inadequada."
      }
    ],
    "correta": "E"
  }
];
