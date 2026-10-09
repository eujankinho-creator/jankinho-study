import { prisma } from "../../lib/prisma";

const DISCIPLINA = "Saúde Coletiva I";
const FONTE = "cortex-saude-coletiva-i-avaliacao1-v1";
const QUESTOES_POR_TEMA = 20;

type Conceito = {
  foco: string;
  correta: string;
  distratores: [string, string, string, string];
  explicacao: string;
};

type Grupo = {
  nome: string;
  conceitos: Conceito[];
};

const GRUPOS: Record<string, Grupo> = {
  dss: {
    nome: "Processo saúde-doença, DSS e iniquidades",
    conceitos: [
      {
        foco: "o processo saúde-doença",
        correta: "O processo saúde-doença resulta da interação de condições biológicas, sociais, econômicas, culturais e ambientais.",
        distratores: [
          "É explicado somente pela genética individual.",
          "Depende exclusivamente de escolhas pessoais de estilo de vida.",
          "É determinado apenas pela presença ou ausência de agentes infecciosos.",
          "É um fenômeno estático e igual em diferentes períodos históricos."
        ],
        explicacao: "Na perspectiva da Saúde Coletiva, o processo saúde-doença é dinâmico, histórico e multicausal."
      },
      {
        foco: "os Determinantes Sociais da Saúde",
        correta: "Os DSS incluem fatores sociais, econômicos, culturais, étnico-raciais, psicológicos e comportamentais que influenciam saúde e riscos.",
        distratores: [
          "Os DSS correspondem apenas a fatores genéticos.",
          "Os DSS são somente condições ambientais naturais.",
          "Os DSS se restringem ao acesso a hospitais.",
          "Os DSS são sinônimo de hábitos individuais."
        ],
        explicacao: "A formulação cobrada na Avaliação I apresenta os DSS como um conjunto amplo de fatores sociais e relacionados."
      },
      {
        foco: "iniquidades em saúde",
        correta: "Iniquidades em saúde são desigualdades consideradas injustas, evitáveis e socialmente produzidas.",
        distratores: [
          "Toda diferença em saúde é automaticamente uma iniquidade.",
          "Iniquidade significa diversidade biológica entre indivíduos.",
          "Iniquidade é sinônimo de diferença etária natural.",
          "O conceito se refere apenas a erros médicos."
        ],
        explicacao: "A Avaliação I diferencia diferença, diversidade, desigualdade e iniquidade, relacionando iniquidade à justiça."
      },
      {
        foco: "determinação social",
        correta: "A determinação social analisa processos e relações sociais que produzem diferentes condições de saúde, e não apenas fatores isolados.",
        distratores: [
          "Determinação social é apenas outro nome para genética.",
          "A determinação social rejeita qualquer análise histórica.",
          "Refere-se somente a comportamentos individuais.",
          "Aplica-se apenas a doenças infecciosas."
        ],
        explicacao: "A determinação social amplia a análise para processos históricos, econômicos, políticos e territoriais."
      },
      {
        foco: "mudanças históricas na saúde",
        correta: "As formas de adoecer e cuidar mudam conforme o contexto histórico, científico e social.",
        distratores: [
          "As formas de adoecer permanecem idênticas em todas as sociedades.",
          "Somente tecnologias médicas alteram o perfil de adoecimento.",
          "Mudanças sociais não interferem nos padrões de saúde.",
          "A história não influencia a compreensão atual de doença."
        ],
        explicacao: "O processo saúde-doença e seus modelos explicativos se modificam ao longo da história."
      }
    ]
  },

  aps: {
    nome: "Atenção Primária à Saúde",
    conceitos: [
      {
        foco: "a definição de Atenção Primária à Saúde",
        correta: "A APS reúne ações integrais voltadas a indivíduos, famílias e comunidade em território definido, com responsabilidade sanitária.",
        distratores: [
          "A APS é apenas atendimento de baixa complexidade para doenças simples.",
          "A APS se limita a encaminhar usuários para especialistas.",
          "A APS atua somente com vacinação.",
          "A APS não trabalha com promoção nem prevenção."
        ],
        explicacao: "A Avaliação I cobra a APS como conjunto de ações integrais, multiprofissionais e territorializadas."
      },
      {
        foco: "o atributo primeiro contato",
        correta: "A APS deve funcionar como porta de entrada preferencial e ponto de primeiro contato para necessidades comuns de saúde.",
        distratores: [
          "Primeiro contato significa que todo usuário deve ir primeiro ao hospital.",
          "A APS só atende usuários encaminhados por especialistas.",
          "Primeiro contato é sinônimo de consulta única.",
          "Urgências nunca podem ser acolhidas na APS."
        ],
        explicacao: "Primeiro contato é atributo essencial da APS e se relaciona ao acesso."
      },
      {
        foco: "a longitudinalidade",
        correta: "Longitudinalidade é o acompanhamento continuado da pessoa ao longo do tempo por uma fonte regular de cuidado.",
        distratores: [
          "Longitudinalidade significa internação prolongada.",
          "É o encaminhamento imediato para qualquer especialista.",
          "É atendimento apenas de doenças crônicas.",
          "É a repetição de consultas sem vínculo."
        ],
        explicacao: "Longitudinalidade envolve vínculo e continuidade do cuidado."
      },
      {
        foco: "a integralidade",
        correta: "Integralidade implica reconhecer e responder a necessidades de promoção, prevenção, tratamento e reabilitação.",
        distratores: [
          "Integralidade significa realizar todos os procedimentos dentro da UBS.",
          "É atender apenas a queixa principal.",
          "É separar prevenção de tratamento.",
          "É excluir necessidades sociais do cuidado."
        ],
        explicacao: "A integralidade amplia o olhar sobre as necessidades do usuário e da população."
      },
      {
        foco: "a coordenação do cuidado",
        correta: "A coordenação organiza informações, encaminhamentos e continuidade entre diferentes pontos da rede.",
        distratores: [
          "Coordenação significa impedir acesso a outros serviços.",
          "É função exclusiva do hospital.",
          "É apenas marcar consultas.",
          "Não envolve troca de informações entre serviços."
        ],
        explicacao: "Na Avaliação I, coordenação aparece como organização do percurso do usuário na rede."
      }
    ]
  },

  pnh: {
    nome: "Política Nacional de Humanização",
    conceitos: [
      {
        foco: "humanização no SUS",
        correta: "A humanização valoriza usuários, trabalhadores e gestores como sujeitos na produção de saúde.",
        distratores: [
          "Humanização significa apenas melhorar a decoração dos serviços.",
          "A humanização se limita à cordialidade no atendimento.",
          "Somente o usuário participa da humanização.",
          "Humanização exclui organização do trabalho."
        ],
        explicacao: "A PNH trata humanização como modo de produzir cuidado e gestão."
      },
      {
        foco: "acolhimento",
        correta: "Acolhimento envolve escuta qualificada, responsabilização e resposta às necessidades apresentadas.",
        distratores: [
          "Acolhimento é apenas uma sala de recepção.",
          "Acolhimento serve para selecionar quem merece atendimento.",
          "Acolhimento é sinônimo de triagem burocrática.",
          "Acolhimento ocorre apenas na chegada do usuário."
        ],
        explicacao: "Acolhimento é uma postura e tecnologia relacional no cuidado."
      },
      {
        foco: "cogestão",
        correta: "Cogestão amplia a participação de diferentes sujeitos nas decisões e na organização do trabalho.",
        distratores: [
          "Cogestão concentra decisões exclusivamente na direção.",
          "Cogestão significa ausência de liderança.",
          "Usuários nunca participam de espaços de gestão.",
          "Cogestão elimina responsabilidades profissionais."
        ],
        explicacao: "A PNH incentiva participação, corresponsabilização e gestão compartilhada."
      },
      {
        foco: "ambiência",
        correta: "Ambiência envolve condições físicas, sociais e relacionais que favorecem cuidado, conforto e encontros.",
        distratores: [
          "Ambiência se restringe à pintura das paredes.",
          "Ambiência não interfere no trabalho em saúde.",
          "É apenas climatização do serviço.",
          "Ambiência é responsabilidade exclusiva da manutenção."
        ],
        explicacao: "Na PNH, ambiência considera espaço físico e relações produzidas nele."
      },
      {
        foco: "clínica ampliada",
        correta: "Clínica ampliada integra diferentes saberes e considera singularidade, contexto e autonomia do usuário.",
        distratores: [
          "Clínica ampliada reduz o cuidado ao diagnóstico biomédico.",
          "Exclui trabalho interdisciplinar.",
          "Dispensa evidências clínicas.",
          "Substitui toda terapêutica por conversa."
        ],
        explicacao: "A clínica ampliada articula dimensões biológicas, subjetivas e sociais."
      }
    ]
  },

  pacs: {
    nome: "PACS",
    conceitos: [
      {
        foco: "o papel histórico do PACS",
        correta: "O PACS ampliou ações de acompanhamento comunitário e aproximou serviços de saúde e território.",
        distratores: [
          "O PACS foi criado como programa hospitalar.",
          "O PACS atua exclusivamente em laboratórios.",
          "O PACS exclui visitas domiciliares.",
          "O PACS não utiliza território."
        ],
        explicacao: "O PACS fortaleceu a presença comunitária e o acompanhamento das famílias."
      },
      {
        foco: "a atuação do agente comunitário",
        correta: "O ACS atua como elo entre equipe e comunidade, desenvolvendo cadastro, acompanhamento, educação e identificação de necessidades.",
        distratores: [
          "O ACS substitui todos os profissionais da equipe.",
          "O ACS realiza apenas tarefas administrativas internas.",
          "O ACS não pode conhecer o território.",
          "O ACS atua somente quando há epidemias."
        ],
        explicacao: "A atuação territorial e comunitária é característica central do ACS."
      },
      {
        foco: "a visita domiciliar no PACS",
        correta: "A visita domiciliar permite acompanhar condições de vida, orientar e identificar necessidades no contexto familiar.",
        distratores: [
          "A visita domiciliar serve apenas para fiscalização.",
          "Só pode ocorrer após internação hospitalar.",
          "Não deve considerar condições sociais.",
          "É incompatível com promoção da saúde."
        ],
        explicacao: "A visita aproxima o cuidado da realidade das famílias."
      },
      {
        foco: "a relação entre PACS e ESF",
        correta: "A experiência do PACS contribuiu para a consolidação de estratégias mais amplas de atenção à família e ao território.",
        distratores: [
          "O PACS surgiu depois da ESF e não teve relação com ela.",
          "O PACS foi substituído por atenção exclusivamente hospitalar.",
          "A ESF eliminou a atuação comunitária.",
          "PACS e ESF têm objetivos opostos."
        ],
        explicacao: "A trajetória do PACS integra a história da reorganização da atenção básica."
      },
      {
        foco: "o foco comunitário",
        correta: "O PACS enfatiza ações preventivas, promocionais e de acompanhamento vinculadas à comunidade.",
        distratores: [
          "O foco principal do PACS é cirurgia ambulatorial.",
          "Seu objetivo é centralizar o cuidado em hospitais.",
          "O programa não realiza educação em saúde.",
          "O foco comunitário exclui vigilância."
        ],
        explicacao: "A atuação comunitária combina acompanhamento, promoção e identificação precoce de riscos."
      }
    ]
  },

  esf: {
    nome: "Estratégia Saúde da Família e PSF",
    conceitos: [
      {
        foco: "a ESF como estratégia de APS",
        correta: "A Estratégia Saúde da Família organiza a APS a partir de equipes responsáveis por território e população adscrita.",
        distratores: [
          "A ESF é serviço de atenção especializada.",
          "A ESF existe apenas para vacinação.",
          "A ESF substitui toda a rede de atenção.",
          "A ESF não trabalha com famílias."
        ],
        explicacao: "A ESF é estratégia de organização da APS no SUS."
      },
      {
        foco: "família e território",
        correta: "A ESF considera indivíduo, família e contexto territorial no planejamento e no cuidado.",
        distratores: [
          "A ESF analisa apenas diagnósticos individuais.",
          "Família não é unidade de atenção.",
          "Território é irrelevante para o planejamento.",
          "A equipe atua sem população definida."
        ],
        explicacao: "Família e território orientam o acompanhamento longitudinal."
      },
      {
        foco: "o trabalho da equipe de saúde da família",
        correta: "A equipe desenvolve ações clínicas, de promoção, prevenção, vigilância e acompanhamento no território.",
        distratores: [
          "A equipe atua somente dentro da unidade.",
          "Promoção não faz parte da ESF.",
          "Vigilância é responsabilidade exclusiva de outro setor.",
          "A equipe não acompanha condições crônicas."
        ],
        explicacao: "A ESF integra diferentes ações no cotidiano do território."
      },
      {
        foco: "adscrição e vínculo",
        correta: "A adscrição favorece conhecimento da população e construção de vínculo longitudinal.",
        distratores: [
          "Adscrição significa impedir atendimento fora do território em qualquer situação.",
          "Vínculo é desnecessário para coordenação.",
          "A equipe não precisa conhecer as famílias acompanhadas.",
          "Adscrição é apenas um dado cadastral sem uso assistencial."
        ],
        explicacao: "Conhecer a população apoia planejamento, vínculo e continuidade."
      },
      {
        foco: "coordenação na rede",
        correta: "A ESF deve acompanhar o usuário mesmo quando ele utiliza outros pontos de atenção, articulando informações e continuidade.",
        distratores: [
          "Ao encaminhar, a ESF encerra sua responsabilidade.",
          "Coordenação é função exclusiva do especialista.",
          "A equipe não deve receber contrarreferência.",
          "A rede substitui o acompanhamento territorial."
        ],
        explicacao: "A APS permanece como coordenadora do cuidado ao longo da rede."
      }
    ]
  },

  intersetorialidade: {
    nome: "Intersetorialidade",
    conceitos: [
      {
        foco: "o conceito de intersetorialidade",
        correta: "Intersetorialidade é a articulação entre diferentes setores para enfrentar problemas complexos que ultrapassam a capacidade isolada da saúde.",
        distratores: [
          "Intersetorialidade é encaminhar casos e encerrar o acompanhamento.",
          "Significa unir apenas profissionais da saúde.",
          "Exclui participação comunitária.",
          "É necessária somente em epidemias."
        ],
        explicacao: "Problemas sociais e de saúde frequentemente exigem ação coordenada entre setores."
      },
      {
        foco: "a atuação territorial da ESF",
        correta: "A ESF pode articular saúde, educação, assistência social e outras políticas a partir das necessidades do território.",
        distratores: [
          "A ESF deve evitar contato com outros setores.",
          "Territorialização impede parcerias.",
          "A escola não pode participar de ações de saúde.",
          "Assistência social e saúde não compartilham problemas comuns."
        ],
        explicacao: "O território evidencia problemas que pedem respostas intersetoriais."
      },
      {
        foco: "planejamento compartilhado",
        correta: "Ações intersetoriais são mais consistentes quando objetivos, responsabilidades e acompanhamento são pactuados.",
        distratores: [
          "Basta realizar reuniões sem definição de responsabilidades.",
          "Cada setor deve agir isoladamente.",
          "Planejamento conjunto reduz efetividade.",
          "Intersetorialidade dispensa avaliação."
        ],
        explicacao: "Pactuação e acompanhamento sustentam a ação intersetorial."
      },
      {
        foco: "fragmentação institucional",
        correta: "A fragmentação de políticas, fluxos e responsabilidades é um desafio importante à intersetorialidade.",
        distratores: [
          "A fragmentação sempre facilita a coordenação.",
          "Setores diferentes possuem automaticamente os mesmos objetivos.",
          "Fluxos independentes dispensam comunicação.",
          "Responsabilidades difusas melhoram a execução."
        ],
        explicacao: "Fragmentação pode gerar duplicidades, lacunas e dificuldade de coordenação."
      },
      {
        foco: "avaliação conjunta",
        correta: "Indicadores e avaliação compartilhada ajudam a verificar se a articulação produz resultados no território.",
        distratores: [
          "Cada setor deve ignorar resultados comuns.",
          "Indicadores dificultam cooperação.",
          "Avaliação só pode ocorrer depois de muitos anos.",
          "Resultados territoriais não podem ser monitorados."
        ],
        explicacao: "Avaliação compartilhada permite ajustar estratégias intersetoriais."
      }
    ]
  },

  redes: {
    nome: "Redes sociais e Redes de Atenção à Saúde",
    conceitos: [
      {
        foco: "redes sociais no cuidado",
        correta: "Redes sociais incluem vínculos entre pessoas, famílias, grupos e instituições que podem oferecer apoio, informação e recursos.",
        distratores: [
          "Rede social em saúde significa apenas internet.",
          "Rede social é sinônimo de rede hospitalar.",
          "Somente profissionais formam redes sociais.",
          "Vínculos comunitários não interferem no cuidado."
        ],
        explicacao: "Analisar redes sociais ajuda a compreender apoio e circulação de recursos no território."
      },
      {
        foco: "apoio social",
        correta: "Apoio emocional, material, informacional e instrumental pode influenciar capacidade de cuidado e enfrentamento.",
        distratores: [
          "Apoio social é apenas ajuda financeira.",
          "Apoio emocional não tem relação com saúde.",
          "Informação nunca circula por redes familiares.",
          "Apoio instrumental é sinônimo de prescrição médica."
        ],
        explicacao: "Diferentes tipos de apoio podem ser mobilizados no cuidado."
      },
      {
        foco: "o conceito de Redes de Atenção à Saúde",
        correta: "As RAS articulam serviços de diferentes densidades tecnológicas para garantir cuidado contínuo e integral.",
        distratores: [
          "RAS é apenas uma lista de hospitais.",
          "Cada serviço deve funcionar isoladamente.",
          "RAS substitui a APS.",
          "A rede é definida somente por proximidade geográfica."
        ],
        explicacao: "As RAS organizam relações entre pontos de atenção para continuidade do cuidado."
      },
      {
        foco: "o papel da APS nas RAS",
        correta: "A APS exerce papel de coordenação do cuidado e ordenação dos fluxos na rede.",
        distratores: [
          "A APS não participa de redes de atenção.",
          "Coordenação é responsabilidade exclusiva do hospital.",
          "A APS apenas encaminha e encerra acompanhamento.",
          "Atenção especializada substitui o vínculo da APS."
        ],
        explicacao: "A APS acompanha o usuário ao longo dos diferentes pontos da rede."
      },
      {
        foco: "referência e contrarreferência",
        correta: "Fluxos de referência e retorno de informações favorecem continuidade entre serviços.",
        distratores: [
          "Encaminhamento dispensa retorno de informações.",
          "Contrarreferência é desnecessária quando há prontuário.",
          "Serviços não devem compartilhar planos de cuidado.",
          "Referência significa transferência definitiva de responsabilidade."
        ],
        explicacao: "Comunicação entre pontos é essencial para coordenação."
      }
    ]
  },

  visita: {
    nome: "Visita domiciliar e autocuidado",
    conceitos: [
      {
        foco: "a visita domiciliar",
        correta: "A visita domiciliar permite compreender condições reais de vida, barreiras e recursos que influenciam o autocuidado.",
        distratores: [
          "A visita domiciliar serve apenas para fiscalizar adesão.",
          "O domicílio não fornece informação relevante.",
          "Visitas devem ocorrer sem planejamento.",
          "Somente pessoas acamadas podem receber visita."
        ],
        explicacao: "A visita pode revelar contexto, rotinas, apoio e barreiras ao cuidado."
      },
      {
        foco: "empoderamento no autocuidado",
        correta: "Empoderamento envolve ampliar conhecimento, capacidade de decisão e participação da pessoa no manejo da condição.",
        distratores: [
          "Empoderamento significa transferir toda responsabilidade ao usuário.",
          "É fazer o paciente obedecer sem questionar.",
          "Exclui apoio profissional.",
          "É sinônimo de entregar material educativo."
        ],
        explicacao: "Empoderamento busca fortalecer autonomia com suporte da equipe."
      },
      {
        foco: "educação dialógica",
        correta: "Educação em saúde efetiva considera saberes, dúvidas, objetivos e possibilidades da pessoa e da família.",
        distratores: [
          "Educação deve ser apenas transmissão vertical de ordens.",
          "As experiências do usuário não devem ser consideradas.",
          "Uma mesma orientação serve igualmente para todos.",
          "Perguntas do usuário atrapalham o cuidado."
        ],
        explicacao: "A abordagem dialógica favorece construção compartilhada do autocuidado."
      },
      {
        foco: "metas de autocuidado",
        correta: "Metas devem ser negociadas e compatíveis com rotina, recursos e prioridades da pessoa.",
        distratores: [
          "Metas devem ser definidas apenas pelo profissional.",
          "Quanto mais metas simultâneas, melhor.",
          "Recursos financeiros não precisam ser considerados.",
          "Planos ideais devem ser mantidos mesmo quando inviáveis."
        ],
        explicacao: "Metas factíveis aumentam possibilidade de adesão e autonomia."
      },
      {
        foco: "rede de apoio",
        correta: "Família e rede de apoio podem colaborar com autocuidado quando respeitam autonomia e preferências da pessoa.",
        distratores: [
          "A família deve controlar todas as escolhas do usuário.",
          "Rede de apoio sempre substitui o profissional.",
          "Apoio familiar é irrelevante em condições crônicas.",
          "Autonomia significa excluir familiares de qualquer participação."
        ],
        explicacao: "Apoio pode facilitar rotinas quando é acordado e não coercitivo."
      }
    ]
  },

  familia: {
    nome: "Família(s) no campo da saúde",
    conceitos: [
      {
        foco: "a pluralidade de famílias",
        correta: "O cuidado em saúde deve reconhecer diferentes configurações familiares sem restringir família a um único modelo.",
        distratores: [
          "Família válida é somente a nuclear heterossexual.",
          "Configurações familiares diferentes não devem ser consideradas.",
          "Família é definida exclusivamente por parentesco biológico.",
          "Somente pessoas que moram juntas podem formar família."
        ],
        explicacao: "A noção de família no cuidado precisa contemplar diversidade de vínculos e arranjos."
      },
      {
        foco: "família como contexto de cuidado",
        correta: "Relações familiares podem influenciar proteção, adoecimento, decisões e suporte ao cuidado.",
        distratores: [
          "Família nunca interfere no processo saúde-doença.",
          "O cuidado deve ignorar relações domésticas.",
          "Família importa apenas em pediatria.",
          "Conflitos familiares não têm efeito sobre saúde."
        ],
        explicacao: "Família pode ser fonte de apoio, tensão e organização do cuidado."
      },
      {
        foco: "vínculos significativos",
        correta: "Vínculos afetivos e funções desempenhadas podem ser tão relevantes quanto parentesco formal.",
        distratores: [
          "Somente documentos legais definem quem participa do cuidado.",
          "Vínculo afetivo não tem valor em saúde.",
          "Amigos próximos nunca podem ser rede significativa.",
          "Funções de cuidado independem das relações reais."
        ],
        explicacao: "Compreender quem é significativo para a pessoa melhora a abordagem familiar."
      },
      {
        foco: "abordagem não normativa",
        correta: "Profissionais devem evitar julgamentos morais sobre arranjos familiares e buscar compreender dinâmica e necessidades.",
        distratores: [
          "O profissional deve corrigir configurações familiares consideradas inadequadas.",
          "Uma família deve seguir um modelo ideal para receber cuidado.",
          "Julgamentos facilitam vínculo terapêutico.",
          "Diversidade familiar impede planejamento."
        ],
        explicacao: "Abordagem respeitosa e não normativa favorece vínculo."
      },
      {
        foco: "família e território na APS",
        correta: "Conhecer famílias e suas redes ajuda a compreender necessidades, recursos e vulnerabilidades do território.",
        distratores: [
          "Cadastro familiar substitui acompanhamento.",
          "Família deve ser analisada sem considerar território.",
          "Território não influencia organização familiar.",
          "Somente indivíduos devem ser acompanhados na ESF."
        ],
        explicacao: "A perspectiva familiar e territorial é central na Estratégia Saúde da Família."
      }
    ]
  }
};

const TEMAS = [
  { tema: "Estudo dirigido sobre DSS e Processo Saúde-Doença", grupo: "dss" },
  { tema: "DSS — Texto Paulo Buss", grupo: "dss" },
  { tema: "História do processo saúde-doença", grupo: "dss" },
  { tema: "Complexidade do Processo Saúde-Doença", grupo: "dss" },
  { tema: "Determinação Social da Saúde", grupo: "dss" },
  { tema: "História do Conceito de Saúde", grupo: "dss" },
  { tema: "Iniquidade e Saúde — Rita Barata", grupo: "dss" },

  { tema: "APS 1 — Estudo dirigido", grupo: "aps" },
  { tema: "Atenção Primária à Saúde", grupo: "aps" },

  { tema: "Política Nacional de Humanização (PNH)", grupo: "pnh" },

  { tema: "Origem e evolução do PACS", grupo: "pacs" },

  { tema: "APS e Estratégia Saúde da Família", grupo: "esf" },
  { tema: "História do PSF", grupo: "esf" },

  { tema: "Intersetorialidade e Estratégia Saúde da Família", grupo: "intersetorialidade" },
  { tema: "Desafios da intersetorialidade nas políticas públicas", grupo: "intersetorialidade" },

  { tema: "Redes sociais na Atenção Primária à Saúde", grupo: "redes" },
  { tema: "Redes de Atenção à Saúde no SUS", grupo: "redes" },

  { tema: "Visita domiciliar e autocuidado em diabetes", grupo: "visita" },
  { tema: "Família(s) no campo da saúde brasileira", grupo: "familia" }
] as const;

function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function rotacionar<T>(
  itens: T[],
  deslocamento: number
) {
  const n = itens.length;
  const d =
    ((deslocamento % n) + n) % n;

  return itens
    .slice(d)
    .concat(
      itens.slice(0, d)
    );
}

function enunciadoVariante(
  tema: string,
  foco: string,
  variante: number
) {
  const moldes = [
    `Sobre ${tema}, assinale a alternativa correta a respeito de ${foco}.`,
    `Em uma questão no estilo da Avaliação I de Saúde Coletiva I, qual alternativa expressa corretamente ${foco}?`,
    `Considere o conteúdo de ${tema}. Qual afirmação melhor representa ${foco}?`,
    `Ao revisar ${tema} para a primeira avaliação, qual opção está correta sobre ${foco}?`
  ];

  return moldes[
    variante %
    moldes.length
  ];
}

function gerarQuestoes(
  tema: string,
  grupoId: string
) {
  const grupo =
    GRUPOS[grupoId];

  if (!grupo) {
    throw new Error(
      "Grupo de conteúdo inexistente: " +
      grupoId
    );
  }

  return grupo.conceitos.flatMap(
    (
      conceito,
      indiceConceito
    ) =>
      [0, 1, 2, 3].map(
        function (
          variante
        ) {
          const alternativas =
            [
              {
                texto:
                  conceito.correta,
                correta:
                  true
              },
              ...conceito.distratores.map(
                function (
                  texto
                ) {
                  return {
                    texto,
                    correta:
                      false
                  };
                }
              )
            ];

          return {
            enunciado:
              enunciadoVariante(
                tema,
                conceito.foco,
                variante
              ),

            explicacao:
              conceito.explicacao,

            dificuldade:
              variante === 0
                ? "facil"
                : (
                    variante === 3
                      ? "dificil"
                      : "medio"
                  ),

            alternativas:
              rotacionar(
                alternativas,
                (
                  indiceConceito +
                  variante *
                    2
                ) %
                  5
              )
          };
        }
      )
  );
}

export async function
sincronizarQuestoesSaudeColetivaI() {

  const usuario =
    await prisma.usuario.findFirst({
      orderBy: {
        id:
          "asc"
      },

      select: {
        id:
          true
      }
    });

  if (!usuario) {
    console.warn(
      "[saude-coletiva-i] Nenhum usuário encontrado para vincular o banco global."
    );
    return;
  }

  let disciplina =
    await prisma.disciplina.findFirst({
      where: {
        usuarioId:
          usuario.id,

        nome: {
          equals:
            DISCIPLINA,

          mode:
            "insensitive"
        }
      }
    });

  if (!disciplina) {
    disciplina =
      await prisma.disciplina.create({
        data: {
          usuarioId:
            usuario.id,

          nome:
            DISCIPLINA
        }
      });
  }

  const totalEsperado =
    TEMAS.length *
    QUESTOES_POR_TEMA;

  const existentes =
    await prisma.questao.findMany({
      where: {
        disciplinaId:
          disciplina.id,

        fonte:
          FONTE
      },

      select: {
        id:
          true,

        tema:
          true
      }
    });

  const contagem =
    new Map<string, number>();

  for (
    const questao
    of existentes
  ) {
    const tema =
      String(
        questao.tema ||
        ""
      );

    contagem.set(
      tema,
      (
        contagem.get(
          tema
        ) ||
        0
      ) +
        1
    );
  }

  const completo =
    existentes.length ===
      totalEsperado &&
    TEMAS.every(
      function (
        item
      ) {
        return (
          contagem.get(
            item.tema
          ) ===
          QUESTOES_POR_TEMA
        );
      }
    );

  if (completo) {
    console.log(
      "[saude-coletiva-i] " +
      totalEsperado +
      " questões já sincronizadas em " +
      TEMAS.length +
      " temas."
    );

    return;
  }

  if (existentes.length) {
    await prisma.questao.deleteMany({
      where: {
        disciplinaId:
          disciplina.id,

        fonte:
          FONTE
      }
    });
  }

  let inseridas =
    0;

  for (
    const item
    of TEMAS
  ) {
    const questoes =
      gerarQuestoes(
        item.tema,
        item.grupo
      );

    if (
      questoes.length !==
        QUESTOES_POR_TEMA
    ) {
      throw new Error(
        "Tema " +
        item.tema +
        " gerou " +
        questoes.length +
        " questões; esperado " +
        QUESTOES_POR_TEMA +
        "."
      );
    }

    for (
      let i = 0;
      i < questoes.length;
      i += 1
    ) {
      const questao =
        questoes[i];

      await prisma.questao.create({
        data: {
          enunciado:
            questao.enunciado,

          explicacao:
            questao.explicacao,

          dificuldade:
            questao.dificuldade,

          tema:
            item.tema,

          fonte:
            FONTE,

          origemId:
            FONTE +
            "-" +
            slug(
              item.tema
            ) +
            "-" +
            String(
              i +
              1
            ).padStart(
              2,
              "0"
            ),

          banca:
            "Córtex — estilo Avaliação I",

          ano:
            2026,

          orgao:
            "Saúde Coletiva I",

          usuarioId:
            usuario.id,

          disciplinaId:
            disciplina.id,

          alternativas: {
            create:
              questao.alternativas
          }
        }
      });

      inseridas +=
        1;
    }
  }

  console.log(
    "[saude-coletiva-i] " +
    inseridas +
    " questões inseridas: " +
    QUESTOES_POR_TEMA +
    " por tema em " +
    TEMAS.length +
    " temas."
  );
}

export function
obterMatrizSaudeColetivaI() {
  return {
    disciplina:
      DISCIPLINA,

    fonte:
      FONTE,

    questoesPorTema:
      QUESTOES_POR_TEMA,

    totalTemas:
      TEMAS.length,

    totalQuestoes:
      TEMAS.length *
      QUESTOES_POR_TEMA,

    temas:
      TEMAS.map(
        function (
          item
        ) {
          return item.tema;
        }
      )
  };
}
