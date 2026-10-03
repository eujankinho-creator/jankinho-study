import { prisma } from "../../lib/prisma";

type Conceito = {
  id: string;
  assunto: string;
  dificuldade: "facil" | "medio" | "dificil";
  pergunta: string;
  explicacao: string;
  correta: string;
  distratores: [string, string, string];
  fonteUrl: string;
};

const FONTE = "cortex-sus-legislacao-200-v1";
const DISCIPLINA = "SUS e Legislação";

const CENARIOS = [
  "Em uma questão de legislação do SUS no padrão ENARE/EBSERH,",
  "Durante uma seleção para residência multiprofissional em enfermagem,",
  "Na gestão de um serviço público de saúde,",
  "Considerando a organização legal do Sistema Único de Saúde,"
];

const conceitos: Conceito[] = [
  {
    "id": "cf-direito",
    "assunto": "Constituição Federal",
    "dificuldade": "facil",
    "pergunta": "segundo o art. 196 da Constituição, como a saúde é definida?",
    "explicacao": "O art. 196 estabelece a saúde como direito de todos e dever do Estado.",
    "correta": "Direito de todos e dever do Estado",
    "distratores": [
      "Benefício restrito a contribuintes",
      "Serviço exclusivo da iniciativa privada",
      "Direito apenas de trabalhadores formais"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm"
  },
  {
    "id": "cf-politicas",
    "assunto": "Constituição Federal",
    "dificuldade": "medio",
    "pergunta": "por quais meios o Estado deve garantir o direito à saúde, conforme o art. 196?",
    "explicacao": "A Constituição vincula o direito à saúde a políticas sociais e econômicas, redução de riscos e acesso universal e igualitário.",
    "correta": "Por políticas sociais e econômicas que reduzam riscos e garantam acesso universal e igualitário",
    "distratores": [
      "Somente por hospitais de alta complexidade",
      "Apenas por seguros privados subsidiados",
      "Exclusivamente por ações curativas"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm"
  },
  {
    "id": "cf-acesso",
    "assunto": "Constituição Federal",
    "dificuldade": "facil",
    "pergunta": "qual expressão constitucional caracteriza o acesso às ações e serviços de saúde?",
    "explicacao": "O art. 196 prevê acesso universal e igualitário às ações e serviços para promoção, proteção e recuperação.",
    "correta": "Universal e igualitário",
    "distratores": [
      "Seletivo e contributivo",
      "Regional e exclusivamente privado",
      "Condicionado à contribuição previdenciária"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm"
  },
  {
    "id": "cf-relevancia",
    "assunto": "Constituição Federal",
    "dificuldade": "medio",
    "pergunta": "como o art. 197 qualifica as ações e serviços de saúde?",
    "explicacao": "As ações e serviços de saúde são de relevância pública e estão sujeitos à regulamentação, fiscalização e controle do Poder Público.",
    "correta": "De relevância pública",
    "distratores": [
      "De interesse exclusivamente privado",
      "Como atividade econômica sem regulação pública",
      "Como matéria exclusiva dos municípios"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm"
  },
  {
    "id": "cf-execucao",
    "assunto": "Constituição Federal",
    "dificuldade": "medio",
    "pergunta": "quem pode executar ações e serviços de saúde segundo o art. 197?",
    "explicacao": "A Constituição admite execução direta ou por terceiros, inclusive iniciativa privada, sob regulação pública.",
    "correta": "O Poder Público diretamente ou por terceiros, inclusive pessoas físicas ou jurídicas de direito privado",
    "distratores": [
      "Somente a União",
      "Somente hospitais públicos",
      "Apenas entidades filantrópicas"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm"
  },
  {
    "id": "cf-rede",
    "assunto": "Organização do SUS",
    "dificuldade": "facil",
    "pergunta": "como a Constituição organiza as ações e serviços públicos de saúde?",
    "explicacao": "O art. 198 prevê rede regionalizada e hierarquizada constituindo um sistema único.",
    "correta": "Em rede regionalizada e hierarquizada que constitui um sistema único",
    "distratores": [
      "Em serviços independentes sem articulação",
      "Em rede apenas municipal",
      "Em sistema contributivo por categoria profissional"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm"
  },
  {
    "id": "cf-descentralizacao",
    "assunto": "Organização do SUS",
    "dificuldade": "facil",
    "pergunta": "qual diretriz constitucional do SUS trata da distribuição de responsabilidades entre esferas de governo?",
    "explicacao": "A descentralização com direção única em cada esfera é diretriz expressa no art. 198.",
    "correta": "Descentralização, com direção única em cada esfera",
    "distratores": [
      "Centralização absoluta na União",
      "Gestão exclusiva dos estados",
      "Autonomia sem coordenação interfederativa"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm"
  },
  {
    "id": "cf-integral",
    "assunto": "Organização do SUS",
    "dificuldade": "medio",
    "pergunta": "qual diretriz constitucional combina atendimento integral e prioridade preventiva?",
    "explicacao": "A Constituição prioriza prevenção sem excluir os serviços assistenciais.",
    "correta": "Atendimento integral, com prioridade para atividades preventivas sem prejuízo das assistenciais",
    "distratores": [
      "Atendimento exclusivamente preventivo",
      "Atendimento apenas hospitalar",
      "Atendimento apenas curativo"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm"
  },
  {
    "id": "cf-participacao",
    "assunto": "Controle Social",
    "dificuldade": "facil",
    "pergunta": "qual diretriz do art. 198 garante presença social na organização do SUS?",
    "explicacao": "A participação da comunidade é uma das diretrizes constitucionais do SUS.",
    "correta": "Participação da comunidade",
    "distratores": [
      "Gestão privada obrigatória",
      "Voto censitário em saúde",
      "Participação apenas de profissionais"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm"
  },
  {
    "id": "cf-financiamento",
    "assunto": "Financiamento do SUS",
    "dificuldade": "medio",
    "pergunta": "de onde provém o financiamento do SUS segundo a Constituição?",
    "explicacao": "O art. 198 prevê financiamento interfederativo e admite outras fontes.",
    "correta": "Dos orçamentos da seguridade social da União, Estados, Distrito Federal e Municípios, além de outras fontes",
    "distratores": [
      "Somente de contribuições dos usuários",
      "Apenas do orçamento federal",
      "Exclusivamente de planos privados"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm"
  },
  {
    "id": "cf-privada",
    "assunto": "Participação Complementar",
    "dificuldade": "facil",
    "pergunta": "o que a Constituição afirma sobre a assistência à saúde pela iniciativa privada?",
    "explicacao": "O art. 199 estabelece que a assistência à saúde é livre à iniciativa privada.",
    "correta": "É livre à iniciativa privada",
    "distratores": [
      "É proibida no Brasil",
      "É permitida apenas a entidades religiosas",
      "Depende de autorização do Conselho Nacional de Saúde para cada atendimento"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm"
  },
  {
    "id": "cf-complementar",
    "assunto": "Participação Complementar",
    "dificuldade": "medio",
    "pergunta": "como instituições privadas podem participar do SUS?",
    "explicacao": "A participação privada no SUS é complementar e deve obedecer às diretrizes do sistema.",
    "correta": "De forma complementar, segundo diretrizes do SUS, mediante contrato de direito público ou convênio",
    "distratores": [
      "Substituindo obrigatoriamente a rede pública",
      "Sem vínculo contratual",
      "Somente por cobrança direta ao usuário"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm"
  },
  {
    "id": "cf-preferencia",
    "assunto": "Participação Complementar",
    "dificuldade": "medio",
    "pergunta": "quais instituições têm preferência na participação complementar do SUS?",
    "explicacao": "O art. 199 dá preferência às entidades filantrópicas e às sem fins lucrativos.",
    "correta": "Entidades filantrópicas e sem fins lucrativos",
    "distratores": [
      "Empresas estrangeiras com fins lucrativos",
      "Seguradoras privadas",
      "Qualquer empresa escolhida sem critérios"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm"
  },
  {
    "id": "cf-subsidio",
    "assunto": "Participação Complementar",
    "dificuldade": "medio",
    "pergunta": "o art. 199 permite destinar recursos públicos como auxílio ou subvenção a instituições privadas com fins lucrativos?",
    "explicacao": "A Constituição veda auxílios e subvenções públicos a instituições privadas com fins lucrativos.",
    "correta": "Não, essa destinação é vedada",
    "distratores": [
      "Sim, sem restrições",
      "Sim, desde que aprovada pelo município",
      "Sim, apenas para hospitais de grande porte"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm"
  },
  {
    "id": "cf-sus-competencia",
    "assunto": "Competências do SUS",
    "dificuldade": "medio",
    "pergunta": "qual atividade é competência constitucional do SUS?",
    "explicacao": "O art. 200 inclui vigilância sanitária, epidemiológica e saúde do trabalhador entre as competências do SUS.",
    "correta": "Executar ações de vigilância sanitária, epidemiológica e de saúde do trabalhador",
    "distratores": [
      "Organizar eleições nacionais",
      "Administrar o sistema bancário",
      "Definir política monetária"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm"
  },
  {
    "id": "8080-universalidade",
    "assunto": "Lei 8.080/1990",
    "dificuldade": "facil",
    "pergunta": "qual princípio da Lei 8.080 garante acesso aos serviços de saúde em todos os níveis de assistência?",
    "explicacao": "A universalidade é princípio expresso no art. 7º da Lei 8.080.",
    "correta": "Universalidade de acesso",
    "distratores": [
      "Seletividade contributiva",
      "Segmentação por renda",
      "Exclusividade hospitalar"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm"
  },
  {
    "id": "8080-integralidade",
    "assunto": "Lei 8.080/1990",
    "dificuldade": "medio",
    "pergunta": "como a Lei 8.080 define integralidade da assistência?",
    "explicacao": "Integralidade articula ações preventivas e curativas, individuais e coletivas, em diferentes níveis de complexidade.",
    "correta": "Conjunto articulado e contínuo de ações preventivas e curativas, individuais e coletivas, exigidas em todos os níveis de complexidade",
    "distratores": [
      "Somente ações preventivas",
      "Somente ações hospitalares",
      "Atendimento restrito à doença principal"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm"
  },
  {
    "id": "8080-autonomia",
    "assunto": "Lei 8.080/1990",
    "dificuldade": "medio",
    "pergunta": "qual princípio protege a capacidade da pessoa de decidir sobre sua integridade física e moral?",
    "explicacao": "A preservação da autonomia integra os princípios do SUS definidos pela Lei 8.080.",
    "correta": "Preservação da autonomia das pessoas",
    "distratores": [
      "Centralização administrativa",
      "Hierarquização financeira",
      "Subordinação ao prestador"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm"
  },
  {
    "id": "8080-igualdade",
    "assunto": "Lei 8.080/1990",
    "dificuldade": "facil",
    "pergunta": "qual princípio determina assistência sem preconceitos ou privilégios?",
    "explicacao": "A Lei 8.080 prevê igualdade da assistência sem preconceitos ou privilégios de qualquer espécie.",
    "correta": "Igualdade da assistência à saúde",
    "distratores": [
      "Seletividade socioeconômica",
      "Prioridade por vínculo empregatício",
      "Cobertura por contribuição"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm"
  },
  {
    "id": "8080-informacao",
    "assunto": "Lei 8.080/1990",
    "dificuldade": "facil",
    "pergunta": "qual direito do usuário aparece entre os princípios da Lei 8.080?",
    "explicacao": "A Lei 8.080 reconhece o direito à informação das pessoas assistidas sobre sua saúde.",
    "correta": "Direito à informação sobre sua saúde",
    "distratores": [
      "Direito a ocultação obrigatória do diagnóstico",
      "Direito a impedir todo registro clínico",
      "Direito a escolher qualquer recurso público sem critérios"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm"
  },
  {
    "id": "8080-objetivo-fatores",
    "assunto": "Lei 8.080/1990",
    "dificuldade": "medio",
    "pergunta": "qual objetivo do SUS envolve conhecer fatores que influenciam a saúde?",
    "explicacao": "A Lei 8.080 inclui a identificação e divulgação dos condicionantes e determinantes da saúde entre os objetivos do SUS.",
    "correta": "Identificar e divulgar fatores condicionantes e determinantes da saúde",
    "distratores": [
      "Restringir análise a doenças infecciosas",
      "Monitorar apenas custos hospitalares",
      "Excluir fatores sociais das políticas de saúde"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm"
  },
  {
    "id": "8080-politica",
    "assunto": "Lei 8.080/1990",
    "dificuldade": "medio",
    "pergunta": "qual objetivo do SUS se relaciona à formulação de políticas públicas?",
    "explicacao": "A Lei 8.080 vincula a política de saúde a determinantes econômicos e sociais.",
    "correta": "Formular política de saúde destinada a promover os campos econômico e social relacionados à saúde",
    "distratores": [
      "Formular apenas política hospitalar",
      "Criar apenas normas de planos privados",
      "Definir política cambial"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm"
  },
  {
    "id": "8080-assistencia",
    "assunto": "Lei 8.080/1990",
    "dificuldade": "facil",
    "pergunta": "como o SUS deve prestar assistência às pessoas segundo seus objetivos legais?",
    "explicacao": "A assistência pelo SUS deve articular promoção, proteção e recuperação.",
    "correta": "Por ações integradas de promoção, proteção e recuperação da saúde",
    "distratores": [
      "Somente por tratamento curativo",
      "Somente por prevenção",
      "Exclusivamente por internação"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm"
  },
  {
    "id": "8080-vigilancia",
    "assunto": "Lei 8.080/1990",
    "dificuldade": "medio",
    "pergunta": "qual conjunto integra o campo de atuação do SUS?",
    "explicacao": "A Lei 8.080 inclui vigilância sanitária, epidemiológica e saúde do trabalhador no campo de atuação do SUS.",
    "correta": "Vigilância sanitária, vigilância epidemiológica e saúde do trabalhador",
    "distratores": [
      "Polícia judiciária, tributação e defesa nacional",
      "Somente previdência social",
      "Apenas fiscalização profissional"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm"
  },
  {
    "id": "8080-farmaceutica",
    "assunto": "Lei 8.080/1990",
    "dificuldade": "medio",
    "pergunta": "a assistência terapêutica integral no SUS inclui qual componente?",
    "explicacao": "A Lei 8.080 inclui assistência terapêutica integral, inclusive farmacêutica, no campo de atuação do SUS.",
    "correta": "Assistência farmacêutica",
    "distratores": [
      "Somente internação",
      "Apenas transporte sanitário",
      "Somente perícia previdenciária"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm"
  },
  {
    "id": "8080-direcao-uniao",
    "assunto": "Gestão do SUS",
    "dificuldade": "facil",
    "pergunta": "quem exerce a direção do SUS no âmbito da União?",
    "explicacao": "A Lei 8.080 atribui a direção nacional do SUS ao Ministério da Saúde.",
    "correta": "Ministério da Saúde",
    "distratores": [
      "Conselho Federal de Medicina",
      "Congresso Nacional",
      "Agência Nacional de Saúde Suplementar"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm"
  },
  {
    "id": "8080-direcao-estado",
    "assunto": "Gestão do SUS",
    "dificuldade": "facil",
    "pergunta": "quem exerce a direção do SUS no âmbito estadual?",
    "explicacao": "A direção estadual cabe à respectiva Secretaria de Saúde ou órgão equivalente.",
    "correta": "Secretaria de Saúde ou órgão equivalente",
    "distratores": [
      "Ministério da Saúde diretamente",
      "Conselho Estadual de Saúde sozinho",
      "Tribunal de Contas"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm"
  },
  {
    "id": "8080-direcao-municipio",
    "assunto": "Gestão do SUS",
    "dificuldade": "facil",
    "pergunta": "quem exerce a direção do SUS no âmbito municipal?",
    "explicacao": "A direção municipal cabe à Secretaria Municipal de Saúde ou órgão equivalente.",
    "correta": "Secretaria Municipal de Saúde ou órgão equivalente",
    "distratores": [
      "Secretaria Estadual obrigatoriamente",
      "Ministério Público",
      "Câmara Municipal"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm"
  },
  {
    "id": "8080-estado-apoio",
    "assunto": "Gestão do SUS",
    "dificuldade": "medio",
    "pergunta": "qual atribuição é típica da direção estadual do SUS?",
    "explicacao": "A direção estadual apoia municípios e pode executar ações de forma supletiva, além de coordenar redes regionalizadas.",
    "correta": "Prestar apoio técnico e financeiro aos municípios e executar supletivamente ações e serviços",
    "distratores": [
      "Gerir diretamente todos os serviços municipais",
      "Excluir municípios do planejamento regional",
      "Definir sozinha a política nacional de medicamentos"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm"
  },
  {
    "id": "8080-municipio-servicos",
    "assunto": "Gestão do SUS",
    "dificuldade": "medio",
    "pergunta": "qual atribuição é típica da direção municipal do SUS?",
    "explicacao": "A direção municipal gere e executa serviços públicos de saúde e participa da organização regionalizada.",
    "correta": "Planejar, organizar, controlar, avaliar e executar serviços públicos de saúde no âmbito local",
    "distratores": [
      "Formular sozinha a política nacional de saúde",
      "Coordenar fronteiras internacionais",
      "Substituir a direção estadual em todo o território"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm"
  },
  {
    "id": "8142-instancias",
    "assunto": "Lei 8.142/1990",
    "dificuldade": "facil",
    "pergunta": "quais são as instâncias colegiadas previstas em cada esfera de governo pela Lei 8.142?",
    "explicacao": "A Lei 8.142 estabelece Conferência de Saúde e Conselho de Saúde como instâncias colegiadas do SUS.",
    "correta": "Conferência de Saúde e Conselho de Saúde",
    "distratores": [
      "Câmara Técnica e Tribunal Sanitário",
      "Ouvidoria e Defensoria",
      "Conselho Profissional e Sindicato"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8142.htm"
  },
  {
    "id": "8142-conferencia-periodo",
    "assunto": "Controle Social",
    "dificuldade": "facil",
    "pergunta": "com que periodicidade ordinária a Conferência de Saúde deve reunir-se?",
    "explicacao": "A Lei 8.142 prevê reunião da Conferência de Saúde a cada quatro anos.",
    "correta": "A cada quatro anos",
    "distratores": [
      "Todo mês",
      "A cada dois anos obrigatoriamente",
      "Somente quando houver epidemia"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8142.htm"
  },
  {
    "id": "8142-conferencia-finalidade",
    "assunto": "Controle Social",
    "dificuldade": "medio",
    "pergunta": "qual é a finalidade da Conferência de Saúde?",
    "explicacao": "A Conferência avalia a situação de saúde e propõe diretrizes para a política de saúde.",
    "correta": "Avaliar a situação de saúde e propor diretrizes para a formulação da política de saúde",
    "distratores": [
      "Executar diretamente serviços hospitalares",
      "Julgar processos profissionais",
      "Aprovar individualmente cada prescrição"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8142.htm"
  },
  {
    "id": "8142-conselho",
    "assunto": "Controle Social",
    "dificuldade": "medio",
    "pergunta": "como a Lei 8.142 caracteriza o Conselho de Saúde?",
    "explicacao": "O Conselho de Saúde é permanente e deliberativo e exerce controle da política, inclusive aspectos econômicos e financeiros.",
    "correta": "Órgão permanente e deliberativo que atua na formulação de estratégias e no controle da execução da política de saúde",
    "distratores": [
      "Evento temporário realizado a cada quatro anos",
      "Órgão judicial do SUS",
      "Instância exclusivamente técnica sem participação social"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8142.htm"
  },
  {
    "id": "8142-repasse",
    "assunto": "Financiamento do SUS",
    "dificuldade": "medio",
    "pergunta": "como a Lei 8.142 prevê o repasse de determinados recursos intergovernamentais da saúde?",
    "explicacao": "A Lei 8.142 prevê transferências regulares e automáticas segundo critérios legais.",
    "correta": "De forma regular e automática para Municípios, Estados e Distrito Federal, observados os critérios legais",
    "distratores": [
      "Somente por convênios eventuais",
      "Exclusivamente para capitais",
      "Somente após cobrança dos usuários"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8142.htm"
  },
  {
    "id": "8142-requisitos",
    "assunto": "Financiamento do SUS",
    "dificuldade": "dificil",
    "pergunta": "qual conjunto contém requisitos legais para recebimento dos recursos tratados no art. 3º da Lei 8.142?",
    "explicacao": "O art. 4º exige estruturas de gestão e controle, incluindo Fundo, Conselho, plano, relatórios e contrapartida orçamentária.",
    "correta": "Fundo de Saúde, Conselho de Saúde, plano de saúde, relatórios de gestão e demais requisitos legais",
    "distratores": [
      "Somente hospital próprio",
      "Apenas arrecadação tributária elevada",
      "Somente existência de universidade pública"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8142.htm"
  },
  {
    "id": "8142-paridade",
    "assunto": "Controle Social",
    "dificuldade": "medio",
    "pergunta": "qual característica de composição do Conselho de Saúde é exigida pela Lei 8.142 para os requisitos de transferência?",
    "explicacao": "A Lei 8.142 exige Conselho de Saúde com composição paritária para os requisitos de recebimento dos recursos.",
    "correta": "Composição paritária nos termos legais",
    "distratores": [
      "Composição apenas por gestores",
      "Composição apenas por profissionais de saúde",
      "Composição exclusivamente por usuários"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/l8142.htm"
  },
  {
    "id": "7508-regiao",
    "assunto": "Decreto 7.508/2011",
    "dificuldade": "medio",
    "pergunta": "o que é uma Região de Saúde?",
    "explicacao": "O Decreto 7.508 define Região de Saúde como espaço contínuo de municípios limítrofes articulado por identidades e redes compartilhadas.",
    "correta": "Espaço geográfico contínuo de municípios limítrofes organizado para integrar planejamento e execução de ações e serviços",
    "distratores": [
      "Qualquer conjunto de hospitais privados",
      "Divisão apenas administrativa do Ministério da Saúde",
      "Área definida exclusivamente por população mínima nacional"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/decreto/d7508.htm"
  },
  {
    "id": "7508-minimo",
    "assunto": "Decreto 7.508/2011",
    "dificuldade": "dificil",
    "pergunta": "qual conjunto de ações e serviços é requisito mínimo para instituir uma Região de Saúde?",
    "explicacao": "O art. 5º do Decreto 7.508 define cinco grupos mínimos de ações e serviços para a Região de Saúde.",
    "correta": "Atenção primária, urgência e emergência, atenção psicossocial, atenção especializada/hospitalar e vigilância em saúde",
    "distratores": [
      "Somente atenção primária e farmácia",
      "Apenas hospitais e laboratórios",
      "Somente serviços de alta complexidade"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/decreto/d7508.htm"
  },
  {
    "id": "7508-portas",
    "assunto": "Decreto 7.508/2011",
    "dificuldade": "medio",
    "pergunta": "qual serviço é reconhecido como Porta de Entrada do SUS pelo Decreto 7.508?",
    "explicacao": "Atenção primária, urgência/emergência, atenção psicossocial e serviços especiais de acesso aberto são Portas de Entrada.",
    "correta": "Atenção primária",
    "distratores": [
      "Somente internação eletiva",
      "Apenas auditoria",
      "Exclusivamente regulação administrativa"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/decreto/d7508.htm"
  },
  {
    "id": "7508-acesso",
    "assunto": "Decreto 7.508/2011",
    "dificuldade": "medio",
    "pergunta": "como se inicia o acesso universal, igualitário e ordenado às ações e serviços do SUS?",
    "explicacao": "O Decreto 7.508 organiza o acesso a partir das Portas de Entrada e continuidade na rede conforme a complexidade.",
    "correta": "Pelas Portas de Entrada e se completa na rede regionalizada e hierarquizada",
    "distratores": [
      "Diretamente pela alta complexidade em todos os casos",
      "Somente por autorização estadual",
      "Apenas por hospitais universitários"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/decreto/d7508.htm"
  },
  {
    "id": "7508-renases",
    "assunto": "Decreto 7.508/2011",
    "dificuldade": "facil",
    "pergunta": "o que a RENASES reúne?",
    "explicacao": "A RENASES corresponde à relação nacional de ações e serviços de saúde do SUS.",
    "correta": "As ações e serviços que o SUS oferece ao usuário para atendimento da integralidade",
    "distratores": [
      "Somente medicamentos essenciais",
      "Apenas serviços privados contratados",
      "Exclusivamente procedimentos hospitalares"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/decreto/d7508.htm"
  },
  {
    "id": "7508-rename",
    "assunto": "Decreto 7.508/2011",
    "dificuldade": "facil",
    "pergunta": "o que a RENAME representa?",
    "explicacao": "A RENAME é a Relação Nacional de Medicamentos Essenciais.",
    "correta": "Seleção e padronização de medicamentos indicados para doenças ou agravos no SUS",
    "distratores": [
      "Lista de hospitais universitários",
      "Cadastro de profissionais do SUS",
      "Relação de procedimentos cirúrgicos privados"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/decreto/d7508.htm"
  },
  {
    "id": "7508-cit-cib-cir",
    "assunto": "Decreto 7.508/2011",
    "dificuldade": "dificil",
    "pergunta": "qual associação entre Comissão Intergestores e âmbito está correta?",
    "explicacao": "O Decreto 7.508 organiza CIT, CIB e CIR como instâncias de pactuação nos âmbitos nacional, estadual e regional.",
    "correta": "CIT na União, CIB no Estado e CIR no âmbito regional",
    "distratores": [
      "CIT no município, CIB na União e CIR no Estado",
      "Todas atuam apenas nacionalmente",
      "CIR substitui os Conselhos de Saúde"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/decreto/d7508.htm"
  },
  {
    "id": "7508-coap",
    "assunto": "Decreto 7.508/2011",
    "dificuldade": "dificil",
    "pergunta": "qual é a finalidade do Contrato Organizativo da Ação Pública da Saúde?",
    "explicacao": "O COAP é instrumento de colaboração interfederativa para organizar a rede e explicitar responsabilidades, metas e recursos.",
    "correta": "Organizar e integrar ações e serviços entre entes federativos em uma Região de Saúde, definindo responsabilidades e metas",
    "distratores": [
      "Privatizar toda a rede regional",
      "Substituir os planos de saúde privados",
      "Regular exclusivamente relações trabalhistas"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/decreto/d7508.htm"
  },
  {
    "id": "141-estados",
    "assunto": "Lei Complementar 141/2012",
    "dificuldade": "medio",
    "pergunta": "qual percentual mínimo os Estados devem aplicar anualmente em ações e serviços públicos de saúde, conforme a LC 141?",
    "explicacao": "A LC 141 estabelece mínimo de 12% para Estados sobre a base de cálculo prevista legalmente.",
    "correta": "12% da base constitucional definida em lei",
    "distratores": [
      "5% de toda receita bruta",
      "20% obrigatoriamente da receita corrente líquida",
      "30% das transferências federais"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp141.htm"
  },
  {
    "id": "141-municipios",
    "assunto": "Lei Complementar 141/2012",
    "dificuldade": "medio",
    "pergunta": "qual percentual mínimo os Municípios devem aplicar anualmente em ações e serviços públicos de saúde, conforme a LC 141?",
    "explicacao": "A LC 141 estabelece mínimo de 15% para Municípios sobre a base de cálculo legal.",
    "correta": "15% da base constitucional definida em lei",
    "distratores": [
      "5% do orçamento total",
      "10% da folha de pagamento",
      "25% de toda receita sem distinção"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp141.htm"
  },
  {
    "id": "141-superior",
    "assunto": "Lei Complementar 141/2012",
    "dificuldade": "medio",
    "pergunta": "se Constituição Estadual ou Lei Orgânica fixar percentual de saúde superior ao mínimo da LC 141, qual deve ser observado?",
    "explicacao": "A LC 141 determina observância dos percentuais locais quando forem superiores aos mínimos federais.",
    "correta": "O percentual superior previsto localmente",
    "distratores": [
      "Sempre o menor percentual",
      "Apenas o percentual federal",
      "Nenhum percentual mínimo"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp141.htm"
  },
  {
    "id": "141-controle",
    "assunto": "Lei Complementar 141/2012",
    "dificuldade": "medio",
    "pergunta": "além dos mínimos de aplicação, o que a LC 141 disciplina?",
    "explicacao": "A LC 141 trata também de transferências e mecanismos de transparência, fiscalização, avaliação e controle.",
    "correta": "Critérios de rateio, fiscalização, avaliação e controle das despesas com saúde",
    "distratores": [
      "Somente contratação de profissionais",
      "Apenas construção de hospitais federais",
      "Exclusivamente vigilância sanitária"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp141.htm"
  },
  {
    "id": "141-finalidade",
    "assunto": "Lei Complementar 141/2012",
    "dificuldade": "facil",
    "pergunta": "qual é o foco central da LC 141 em relação ao art. 198 da Constituição?",
    "explicacao": "A LC 141 regulamenta o financiamento mínimo e regras de aplicação e controle dos recursos públicos de saúde.",
    "correta": "Regulamentar valores mínimos e regras de aplicação em ações e serviços públicos de saúde",
    "distratores": [
      "Criar o SUS",
      "Extinguir transferências intergovernamentais",
      "Regular somente planos de saúde privados"
    ],
    "fonteUrl": "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp141.htm"
  }
] as Conceito[];

function montarQuestoes() {
  return conceitos.flatMap((conceito, conceitoIndex) =>
    CENARIOS.map((cenario, varianteIndex) => {
      const opcoes = [conceito.correta, ...conceito.distratores];
      const deslocamento = (conceitoIndex + varianteIndex) % opcoes.length;
      const alternativas = opcoes
        .map((texto, indice) => ({ texto, correta: indice === 0 }))
        .sort((a, b) => {
          const ia = (opcoes.indexOf(a.texto) + deslocamento) % opcoes.length;
          const ib = (opcoes.indexOf(b.texto) + deslocamento) % opcoes.length;
          return ia - ib;
        });

      return {
        origemId: "sus-leg-" + conceito.id + "-" + String(varianteIndex + 1).padStart(2, "0"),
        enunciado: cenario + " " + conceito.pergunta,
        explicacao: conceito.explicacao,
        assunto: conceito.assunto,
        dificuldade: conceito.dificuldade,
        banca: "ENARE / EBSERH (SUS e Legislação)",
        ano: 2026,
        cargo: "Residência Multiprofissional - Enfermagem",
        orgao: "SUS / Legislação Sanitária",
        fonteUrl: conceito.fonteUrl,
        alternativas
      };
    })
  );
}

export async function sincronizarQuestoesSusLegislacao200() {
  const questoes = montarQuestoes();

  const usuario = await prisma.usuario.findFirst({ orderBy: { id: "asc" } });
  if (!usuario) {
    console.warn("[questoes] Nenhum usuário disponível para inserir SUS e Legislação.");
    return;
  }

  let disciplina = await prisma.disciplina.findFirst({
    where: {
      usuarioId: usuario.id,
      nome: { equals: DISCIPLINA, mode: "insensitive" }
    }
  });

  if (!disciplina) {
    disciplina = await prisma.disciplina.create({
      data: { nome: DISCIPLINA, usuarioId: usuario.id }
    });
  }

  const existentes = await prisma.questao.findMany({
    where: { usuarioId: usuario.id, fonte: FONTE },
    select: { origemId: true }
  });
  const idsExistentes = new Set(existentes.map((item) => item.origemId).filter(Boolean));

  let inseridas = 0;
  let jaExistentes = 0;

  for (const questao of questoes) {
    if (idsExistentes.has(questao.origemId)) {
      jaExistentes += 1;
      continue;
    }

    await prisma.questao.create({
      data: {
        enunciado: questao.enunciado,
        explicacao: questao.explicacao,
        dificuldade: questao.dificuldade,
        tema: questao.assunto,
        fonte: FONTE,
        origemId: questao.origemId,
        banca: questao.banca,
        ano: questao.ano,
        cargo: questao.cargo,
        orgao: questao.orgao,
        fonteUrl: questao.fonteUrl,
        usuarioId: usuario.id,
        disciplinaId: disciplina.id,
        alternativas: { create: questao.alternativas }
      }
    });

    idsExistentes.add(questao.origemId);
    inseridas += 1;
  }

  console.log(
    "[questoes] SUS e Legislação:",
    inseridas,
    "inseridas;",
    jaExistentes,
    "já existentes;",
    questoes.length,
    "no lote."
  );
}
