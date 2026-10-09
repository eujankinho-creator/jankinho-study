import { prisma } from "../../lib/prisma";

const DISCIPLINA = "Saúde Coletiva I";
const FONTE_PREFIXO = "cortex-saude-coletiva-i-";
const FONTE = "cortex-saude-coletiva-i-fontes-reais-v3-semantic-dedup";

type TemaFonte = {
  tema: string;
  fonteTitulo: string;
  fonteUrl: string;
  verdades: string[];
  falsas: string[];
  explicacaoBase: string;
};

const TEMAS: TemaFonte[] = [
  {
    tema: "Estudo dirigido sobre DSS e Processo Saúde-Doença",
    fonteTitulo: "Avaliação I + A saúde e seus determinantes sociais",
    fonteUrl: "https://bvsms.saude.gov.br/determinantes-sociais-da-saude/",
    verdades: [
      "O processo saúde-doença é dinâmico e resulta de múltiplas dimensões, não apenas de fatores biológicos.",
      "Condições de vida, trabalho, renda, educação e ambiente podem influenciar padrões de saúde e adoecimento.",
      "Os modelos explicativos do processo saúde-doença mudam ao longo da história.",
      "A análise do processo saúde-doença pode considerar fatores individuais e coletivos simultaneamente.",
      "Determinantes sociais ajudam a explicar diferenças de saúde entre grupos populacionais.",
      "Intervenções sobre condições sociais podem produzir efeitos sobre a saúde da população."
    ],
    falsas: [
      "O processo saúde-doença é determinado exclusivamente por escolhas individuais.",
      "As condições sociais não interferem na ocorrência de doenças.",
      "O processo saúde-doença permanece igual em todos os períodos históricos.",
      "Apenas fatores genéticos explicam diferenças de saúde entre populações.",
      "Determinantes sociais dizem respeito somente ao acesso a hospitais.",
      "A análise coletiva é incompatível com a compreensão do processo saúde-doença."
    ],
    explicacaoBase: "A prova enviada enfatiza a compreensão multicausal, histórica e social do processo saúde-doença e dos DSS."
  },
  {
    tema: "DSS — Texto Paulo Buss",
    fonteTitulo: "Buss e Pellegrini Filho — A saúde e seus determinantes sociais",
    fonteUrl: "https://bvsms.saude.gov.br/determinantes-sociais-da-saude/",
    verdades: [
      "Os DSS abrangem condições sociais, econômicas, culturais, étnico-raciais, psicológicas e comportamentais relacionadas à saúde.",
      "O texto discute diferentes níveis de determinantes sociais e sua relação com a situação de saúde.",
      "O enfrentamento das iniquidades exige ações que ultrapassem o setor saúde.",
      "A CNDSS foi criada para promover estudos, recomendar políticas e mobilizar a sociedade em torno dos DSS.",
      "Os DSS ajudam a compreender por que grupos sociais apresentam diferentes riscos de adoecer e morrer.",
      "A abordagem dos DSS permite discutir intervenções sobre condições de vida e desigualdades."
    ],
    falsas: [
      "Para Buss e Pellegrini Filho, DSS significam apenas fatores genéticos.",
      "O texto limita os DSS ao comportamento individual.",
      "A CNDSS foi criada exclusivamente para organizar hospitais.",
      "O enfrentamento das iniquidades depende apenas de atendimento médico.",
      "Os DSS não possuem relação com diferenças entre grupos sociais.",
      "Condições econômicas e culturais são excluídas da análise dos DSS."
    ],
    explicacaoBase: "O texto de Buss e Pellegrini Filho apresenta os DSS, seus níveis explicativos e o enfrentamento das iniquidades."
  },
  {
    tema: "História do processo saúde-doença",
    fonteTitulo: "História do conceito de saúde + evolução dos modelos explicativos",
    fonteUrl: "https://www.scielo.br/j/physis/a/WNtwLvWQRFbscbzCywV9wGq/?format=html&lang=pt",
    verdades: [
      "Concepções de saúde e doença variam conforme contexto histórico, cultural, social e científico.",
      "Explicações mágico-religiosas fizeram parte de períodos históricos da compreensão da doença.",
      "O desenvolvimento da teoria microbiana modificou fortemente a explicação de muitas doenças infecciosas.",
      "A medicina social contribuiu para relacionar condições de vida e adoecimento.",
      "Modelos multicausais ampliaram explicações centradas em uma única causa.",
      "O conceito de saúde passou por transformações e não permaneceu restrito à ausência de doença."
    ],
    falsas: [
      "A compreensão de saúde e doença sempre foi idêntica ao longo da história.",
      "A teoria microbiana eliminou definitivamente a importância de fatores sociais.",
      "A medicina social considera irrelevantes as condições de vida.",
      "Modelos multicausais defendem uma única causa para cada doença.",
      "Concepções culturais nunca influenciaram ideias sobre doença.",
      "O conceito moderno de saúde é apenas ausência de enfermidade."
    ],
    explicacaoBase: "A evolução histórica mostra mudanças de paradigmas, da explicação única para abordagens mais amplas e contextualizadas."
  },
  {
    tema: "Complexidade do Processo Saúde-Doença",
    fonteTitulo: "Processo saúde-doença e complexidade",
    fonteUrl: "https://bvsms.saude.gov.br/determinantes-sociais-da-saude/",
    verdades: [
      "A complexidade do processo saúde-doença envolve interação entre fatores biológicos, sociais, ambientais e subjetivos.",
      "Uma mesma exposição pode produzir efeitos diferentes conforme contexto e vulnerabilidade.",
      "Causalidade em saúde coletiva pode envolver cadeias e redes de determinação.",
      "Condições de vida podem modificar riscos mesmo diante de fatores biológicos semelhantes.",
      "A compreensão de problemas complexos exige integração de diferentes níveis de análise.",
      "O processo saúde-doença pode ser entendido como resultado de relações e não apenas de fatores isolados."
    ],
    falsas: [
      "Complexidade significa que não existem relações causais em saúde.",
      "Fatores sociais e biológicos devem ser analisados separadamente e nunca interagem.",
      "Uma exposição produz exatamente o mesmo efeito em todas as pessoas.",
      "Problemas complexos podem ser explicados sempre por uma única variável.",
      "Vulnerabilidade não modifica risco de adoecimento.",
      "A análise de relações entre fatores é desnecessária em Saúde Coletiva."
    ],
    explicacaoBase: "A noção de complexidade amplia a compreensão para interações, contextos e diferentes níveis de determinação."
  },
  {
    tema: "Determinação Social da Saúde",
    fonteTitulo: "Determinação ou Determinantes? Uma discussão com base na Teoria da Produção Social da Saúde",
    fonteUrl: "https://www.scielo.br/j/reeusp/a/4Ndw5mtQzq4DG67WgZmFxRj/abstract/?lang=pt",
    verdades: [
      "Determinação social da saúde e determinantes sociais não são necessariamente conceitos equivalentes.",
      "A determinação social enfatiza processos históricos e relações sociais na produção da saúde e da doença.",
      "O debate possui raízes importantes na medicina social latino-americana.",
      "A análise da determinação social procura evitar a simples soma de fatores isolados.",
      "Estruturas sociais e relações de produção podem fazer parte da explicação das condições de saúde.",
      "O debate entre determinação e determinantes possui implicações teóricas e para ações em saúde."
    ],
    falsas: [
      "Determinação social é apenas uma lista de fatores de risco independentes.",
      "O conceito surgiu sem relação com a medicina social latino-americana.",
      "A determinação social exclui a historicidade dos processos.",
      "Determinantes e determinação são obrigatoriamente sinônimos em qualquer abordagem.",
      "Relações sociais não têm papel na produção de condições de saúde.",
      "O debate é puramente terminológico e não possui implicações para ações em saúde."
    ],
    explicacaoBase: "O artigo discute diferenças entre modelos de determinantes e a perspectiva de determinação social, com ênfase histórica e relacional."
  },
  {
    tema: "História do Conceito de Saúde",
    fonteTitulo: "Moacyr Scliar — História do conceito de saúde",
    fonteUrl: "https://www.scielo.br/j/physis/a/WNtwLvWQRFbscbzCywV9wGq/?format=html&lang=pt",
    verdades: [
      "O conceito de saúde possui relação com contextos culturais, sociais, políticos e econômicos.",
      "A definição de saúde mudou ao longo do tempo.",
      "A formulação da OMS ampliou a ideia de saúde para além da ausência de doença.",
      "Diferentes sociedades construíram diferentes explicações para saúde e enfermidade.",
      "Mudanças científicas influenciaram a maneira de definir e enfrentar doenças.",
      "O conceito de saúde pode refletir valores e condições históricas de cada sociedade."
    ],
    falsas: [
      "O conceito de saúde é universal e imutável desde a Antiguidade.",
      "Contextos culturais não interferem na definição de saúde.",
      "A OMS definiu saúde exclusivamente como ausência de doença.",
      "Mudanças científicas não alteraram a compreensão de saúde.",
      "Condições políticas e econômicas são irrelevantes para conceitos de saúde.",
      "Todas as sociedades explicaram a doença da mesma forma."
    ],
    explicacaoBase: "Scliar analisa historicamente saúde e doença e mostra sua relação com contextos sociais e culturais."
  },
  {
    tema: "Iniquidade e Saúde — Rita Barata",
    fonteTitulo: "Rita Barradas Barata — Iniquidade e saúde: a determinação social do processo saúde-doença",
    fonteUrl: "https://revistas.usp.br/revusp/article/view/35108",
    verdades: [
      "Desigualdades sociais em saúde podem refletir condições de vida e inserção social distintas.",
      "Iniquidade envolve uma dimensão de injustiça nas desigualdades em saúde.",
      "Estudos históricos já relacionavam pobreza, trabalho e diferentes riscos de adoecimento e morte.",
      "A posição social pode influenciar exposição a riscos e acesso a recursos protetores.",
      "Diferenças de saúde entre grupos podem ser socialmente produzidas.",
      "A epidemiologia social investiga padrões desiguais de adoecimento entre grupos sociais."
    ],
    falsas: [
      "Toda diferença biológica entre indivíduos é necessariamente uma iniquidade.",
      "A posição social não tem relação com exposição a riscos.",
      "Desigualdades em saúde surgem exclusivamente de diferenças genéticas.",
      "Pesquisas históricas nunca relacionaram pobreza e adoecimento.",
      "Iniquidade é sinônimo de qualquer diversidade observada.",
      "Condições de trabalho são irrelevantes para desigualdades em saúde."
    ],
    explicacaoBase: "Rita Barata discute desigualdade, iniquidade e a determinação social do processo saúde-doença."
  },
  {
    tema: "APS 1 — Estudo dirigido",
    fonteTitulo: "Avaliação I + atributos da Atenção Primária à Saúde",
    fonteUrl: "https://bvsms.saude.gov.br/bvs/publicacoes/instrumento_avaliacao_atencao_primaria_saude.pdf",
    verdades: [
      "Primeiro contato, longitudinalidade, integralidade e coordenação são atributos essenciais da APS.",
      "A APS deve acompanhar pessoas ao longo do tempo e não apenas episódios isolados.",
      "Coordenação envolve integrar informações e cuidados recebidos em diferentes serviços.",
      "Integralidade requer reconhecer diferentes necessidades de saúde e oferecer ou articular respostas.",
      "A APS atua sobre indivíduos, famílias e comunidade em território definido.",
      "A responsabilidade sanitária sobre uma população é compatível com a organização territorial da APS."
    ],
    falsas: [
      "A APS existe apenas para encaminhar usuários a especialistas.",
      "Longitudinalidade significa internação prolongada.",
      "Coordenação encerra quando o usuário é encaminhado.",
      "Integralidade significa atender apenas a queixa principal.",
      "A APS não realiza promoção e prevenção.",
      "Território e população adscrita são irrelevantes para a APS."
    ],
    explicacaoBase: "A Avaliação I cobra diretamente definição de APS e atributos essenciais, especialmente coordenação."
  },
  {
    tema: "Atenção Primária à Saúde",
    fonteTitulo: "Ministério da Saúde — Instrumento de Avaliação da APS / Starfield",
    fonteUrl: "https://bvsms.saude.gov.br/bvs/publicacoes/instrumento_avaliacao_atencao_primaria_saude.pdf",
    verdades: [
      "A APS pode ser entendida como nível de entrada para novas necessidades e problemas de saúde.",
      "A atenção na APS é orientada para a pessoa ao longo do tempo e não apenas para doenças específicas.",
      "A APS coordena ou integra cuidados recebidos em outros pontos do sistema.",
      "O acesso de primeiro contato é um dos atributos essenciais da APS.",
      "Longitudinalidade pressupõe relação continuada entre população e fonte regular de cuidado.",
      "Integralidade e coordenação são atributos fundamentais para a qualidade da APS."
    ],
    falsas: [
      "A APS deve atender somente doenças de baixa gravidade e nunca condições crônicas.",
      "Primeiro contato significa obrigatoriedade de consulta hospitalar inicial.",
      "Longitudinalidade é incompatível com vínculo profissional.",
      "A APS não deve coordenar cuidados especializados.",
      "Integralidade se limita a prescrever medicamentos.",
      "A orientação para a pessoa é incompatível com a APS."
    ],
    explicacaoBase: "O referencial de Starfield destaca primeiro contato, longitudinalidade, integralidade e coordenação."
  },
  {
    tema: "Política Nacional de Humanização (PNH)",
    fonteTitulo: "Ministério da Saúde — HumanizaSUS",
    fonteUrl: "https://bvsms.saude.gov.br/bvs/humanizacao/pub_destaques.php",
    verdades: [
      "A PNH propõe humanização tanto na atenção quanto na gestão do SUS.",
      "Acolhimento envolve escuta, responsabilização e resposta às necessidades apresentadas.",
      "Cogestão amplia participação de trabalhadores e usuários em processos de decisão.",
      "Ambiência considera espaço físico, relações e condições que favorecem cuidado.",
      "Clínica ampliada procura integrar diferentes saberes e dimensões do sujeito.",
      "A participação de usuários e trabalhadores na gestão é coerente com diretrizes da PNH."
    ],
    falsas: [
      "Humanização se resume a cordialidade e decoração do serviço.",
      "A PNH trata apenas da relação médico-paciente.",
      "Cogestão significa concentrar decisões exclusivamente na direção.",
      "Acolhimento é apenas uma sala de recepção.",
      "Ambiência se restringe à cor das paredes.",
      "A PNH separa completamente atenção e gestão."
    ],
    explicacaoBase: "A PNH articula acolhimento, cogestão, ambiência, clínica ampliada e participação na produção do cuidado."
  },
  {
    tema: "Origem e evolução do PACS",
    fonteTitulo: "Ministério da Saúde — trajetória do PACS",
    fonteUrl: "https://bvsms.saude.gov.br/bvs/publicacoes/educacao_profissional_docencia_saude_v5.pdf",
    verdades: [
      "Experiências com agentes comunitários antecederam a institucionalização nacional do PACS.",
      "O Programa Nacional de Agentes Comunitários de Saúde foi criado em 1991.",
      "Em 1992, a denominação PACS passou a ser utilizada.",
      "O PACS inicialmente teve forte foco materno-infantil e em populações de maior risco.",
      "A experiência do PACS contribuiu para a formulação do Programa Saúde da Família.",
      "A atuação comunitária ajudou a aproximar serviços de saúde e território."
    ],
    falsas: [
      "O PACS surgiu originalmente como programa hospitalar.",
      "O PACS foi criado depois do Programa Saúde da Família.",
      "A atuação dos agentes sempre se limitou ao trabalho administrativo interno.",
      "O PACS não possuía relação com saúde materno-infantil.",
      "Experiências comunitárias anteriores não tiveram influência sobre o programa.",
      "O PACS foi concebido sem vínculo com território ou famílias."
    ],
    explicacaoBase: "A trajetória do PACS inclui experiências precursoras, institucionalização em 1991/1992 e influência sobre o PSF."
  },
  {
    tema: "APS e Estratégia Saúde da Família",
    fonteTitulo: "Programa Saúde da Família no Brasil — pressupostos, operacionalização e vantagens",
    fonteUrl: "https://www.scielo.br/j/sausoc/a/TtG3vHtK7wSZcbZVHjHsGQH/?format=html&lang=pt",
    verdades: [
      "A Saúde da Família utiliza a família e o território como referências importantes para o cuidado.",
      "O trabalho multiprofissional é característica da Estratégia Saúde da Família.",
      "A vigilância à saúde pode integrar a organização do trabalho das equipes.",
      "A ESF busca reorganizar a atenção básica e ampliar vínculo com a população.",
      "A atuação da equipe combina ações clínicas, preventivas e de promoção da saúde.",
      "O conhecimento da população adscrita apoia planejamento e acompanhamento."
    ],
    falsas: [
      "A ESF foi criada para substituir toda a rede hospitalar.",
      "A Estratégia Saúde da Família não trabalha com território.",
      "A equipe de saúde da família deve atuar exclusivamente dentro da unidade.",
      "Promoção e prevenção são incompatíveis com a ESF.",
      "O trabalho multiprofissional é dispensável na Saúde da Família.",
      "A família não possui papel na organização do cuidado da ESF."
    ],
    explicacaoBase: "A Saúde da Família articula território, família, equipe multiprofissional, vigilância e reorganização da atenção básica."
  },
  {
    tema: "História do PSF",
    fonteTitulo: "Programa Saúde da Família no Brasil — retrospectiva histórica",
    fonteUrl: "https://www.scielo.br/j/sausoc/a/TtG3vHtK7wSZcbZVHjHsGQH/?format=html&lang=pt",
    verdades: [
      "O PSF foi implantado na década de 1990 como estratégia de reorganização da atenção básica.",
      "A experiência do PACS contribuiu para o desenvolvimento do PSF.",
      "O foco na família ampliou abordagens anteriormente centradas apenas no indivíduo.",
      "A proposta do PSF incorporou atuação territorial e equipe multiprofissional.",
      "A expansão do PSF acompanhou o fortalecimento da atenção básica no SUS.",
      "Com o tempo, a denominação Estratégia Saúde da Família reforçou seu caráter estruturante."
    ],
    falsas: [
      "O PSF foi criado antes do SUS.",
      "O PSF não teve relação histórica com o PACS.",
      "A proposta original do PSF era exclusivamente hospitalar.",
      "O PSF rejeitava equipes multiprofissionais.",
      "O programa foi concebido sem referência a famílias.",
      "A Saúde da Família perdeu completamente relação com a atenção básica."
    ],
    explicacaoBase: "A história do PSF está ligada à expansão da atenção básica, ao PACS e à organização territorial do cuidado."
  },
  {
    tema: "Intersetorialidade e Estratégia Saúde da Família",
    fonteTitulo: "Intersetorialidade aplicada ao território e à Saúde da Família",
    fonteUrl: "https://www.scielo.br/j/physis/a/wcqNQQKzjKH7jM4hyRDCYVc/?lang=pt",
    verdades: [
      "Problemas complexos do território podem exigir articulação entre saúde, educação, assistência social e outros setores.",
      "A ESF pode atuar como participante de redes intersetoriais construídas no território.",
      "Planejamento compartilhado pode reduzir fragmentação de respostas a necessidades sociais.",
      "A intersetorialidade não significa que um setor substitua responsabilidades de outro.",
      "Participação comunitária pode contribuir para definição de prioridades territoriais.",
      "A articulação entre setores requer comunicação, pactuação e acompanhamento."
    ],
    falsas: [
      "Intersetorialidade significa transferir todos os problemas para outro setor.",
      "A ESF deve evitar contato com escolas e assistência social.",
      "Planejamento conjunto é incompatível com autonomia institucional.",
      "Intersetorialidade elimina a necessidade de responsabilidades definidas.",
      "Problemas sociais complexos devem ser tratados por um único setor.",
      "Participação comunitária prejudica necessariamente ações intersetoriais."
    ],
    explicacaoBase: "A intersetorialidade busca articular respostas a necessidades multifacetadas sem apagar responsabilidades específicas."
  },
  {
    tema: "Desafios da intersetorialidade nas políticas públicas",
    fonteTitulo: "Carmo e Guizardi — Desafios da intersetorialidade nas políticas públicas de saúde e assistência social",
    fonteUrl: "https://www.scielo.br/j/physis/a/wcqNQQKzjKH7jM4hyRDCYVc/?lang=pt",
    verdades: [
      "Polissemia do conceito de intersetorialidade é apontada como um desafio.",
      "Burocracia e trajetórias institucionais podem dificultar articulação entre políticas.",
      "Participação social aparece como dimensão relevante no debate intersetorial.",
      "A intersetorialidade pode reduzir efeitos da fragmentação setorial.",
      "A intersetorialidade não é apresentada como solução automática para todo problema de gestão.",
      "Equidade é uma dimensão relacionada ao debate sobre articulação entre saúde e assistência social."
    ],
    falsas: [
      "O artigo conclui que intersetorialidade resolve qualquer problema público automaticamente.",
      "A burocracia não interfere na articulação entre setores.",
      "Participação social é considerada incompatível com intersetorialidade.",
      "A fragmentação setorial sempre melhora respostas sociais.",
      "Polissemia não aparece entre os desafios discutidos.",
      "Equidade é tratada como tema sem relação com intersetorialidade."
    ],
    explicacaoBase: "O artigo destaca polissemia, burocracia, ciclo de políticas, participação social e equidade como dimensões importantes."
  },
  {
    tema: "Redes sociais na Atenção Primária à Saúde",
    fonteTitulo: "Análise de redes sociais na atenção primária em saúde: revisão integrativa",
    fonteUrl: "https://www.scielo.br/j/ape/a/rjMqh9Lz3NCpMxSKy58LQSx/",
    verdades: [
      "Redes sociais podem ser entendidas como relações que conectam pessoas, grupos ou instituições.",
      "A análise de redes sociais pode investigar relações entre profissionais e entre usuários.",
      "Redes primárias e organizações de apoio podem influenciar trajetórias de cuidado.",
      "A APS pode ser analisada a partir de fluxos e relações entre diferentes atores.",
      "A análise de redes pode evidenciar centralidade, intermediação e estrutura relacional.",
      "O enfermeiro pode exercer papel mediador relevante em redes de atenção e apoio."
    ],
    falsas: [
      "Rede social em saúde significa apenas redes sociais digitais.",
      "Análise de redes sociais estuda somente indivíduos isolados.",
      "Relações entre profissionais não podem ser analisadas como redes.",
      "Organizações de apoio não influenciam acesso a serviços.",
      "Centralidade não é um conceito utilizado em análise de redes.",
      "A APS não possui relações interinstitucionais relevantes."
    ],
    explicacaoBase: "A revisão mostra aplicações da análise de redes sociais na APS envolvendo profissionais, usuários e organizações de apoio."
  },
  {
    tema: "Redes de Atenção à Saúde no SUS",
    fonteTitulo: "Configuração das Redes de Atenção à Saúde no SUS",
    fonteUrl: "https://www.scielo.br/j/csc/a/kVHyS985TPQQtskzd34FS9K/abstract/?lang=pt",
    verdades: [
      "Redes de Atenção à Saúde articulam diferentes pontos e níveis de atenção.",
      "Cobertura, qualidade e resolubilidade podem ser analisadas para avaliar configurações de redes.",
      "A atenção básica possui papel relevante na organização e coordenação da rede.",
      "Diferenças regionais podem produzir configurações distintas de redes de atenção.",
      "A existência de cobertura elevada não garante, por si só, alta qualidade da atenção.",
      "Governança e articulação interfederativa são relevantes para organização das redes."
    ],
    falsas: [
      "Rede de atenção significa apenas reunir hospitais de uma região.",
      "Cobertura elevada garante automaticamente alta qualidade.",
      "A atenção básica não participa da organização das redes.",
      "Todas as regiões apresentam exatamente a mesma configuração de serviços.",
      "Resolubilidade e qualidade são conceitos idênticos.",
      "Governança não influencia a organização de redes."
    ],
    explicacaoBase: "O estudo analisa redes considerando cobertura, qualidade, resolubilidade e diferenças entre macrorregiões."
  },
  {
    tema: "Visita domiciliar e autocuidado em diabetes",
    fonteTitulo: "Avaliação da visita domiciliar para o empoderamento do autocuidado em diabetes",
    fonteUrl: "https://www.scielo.br/j/ape/a/t3zhVsXRxyQKChPpDCBYMRj/?lang=pt",
    verdades: [
      "O estudo avaliou a visita domiciliar como estratégia para adesão e empoderamento no autocuidado do diabetes tipo 2.",
      "A pesquisa utilizou desenho de ensaio clínico randomizado por clusters.",
      "Participaram 145 usuários com diabetes mellitus tipo 2.",
      "O grupo intervenção apresentou aumento significativo na adesão às práticas de autocuidado.",
      "Também houve aumento significativo nos escores de empoderamento no grupo intervenção.",
      "A visita domiciliar permite aproximação com a realidade de vida e apoio a decisões informadas."
    ],
    falsas: [
      "O estudo avaliou exclusivamente pessoas com diabetes tipo 1.",
      "A pesquisa foi apenas uma revisão de literatura sem participantes.",
      "O estudo concluiu que a visita domiciliar reduziu o empoderamento.",
      "Nenhuma mudança de autocuidado foi observada no grupo intervenção.",
      "A visita domiciliar foi tratada apenas como fiscalização.",
      "O estudo excluiu qualquer abordagem educativa."
    ],
    explicacaoBase: "O estudo encontrou melhora de adesão ao autocuidado e empoderamento após intervenção por visita domiciliar."
  },
  {
    tema: "Família(s) no campo da saúde brasileira",
    fonteTitulo: "Noção de família(s) no campo da saúde brasileira: ensaio teórico-reflexivo",
    fonteUrl: "https://www.scielo.br/j/ean/a/7vTPNwPvQzbHxczhX6js35s/?format=html&lang=pt",
    verdades: [
      "O conceito de família é histórico, polissêmico e sofreu transformações no Brasil.",
      "O artigo problematiza definições cristalizadas de família no campo da saúde.",
      "Arranjos familiares não hegemônicos também precisam ser reconhecidos nas práticas de saúde.",
      "Concepções rígidas de família podem produzir preconceitos e negligências no cuidado.",
      "A discussão relaciona família, atenção básica e Política Nacional de Atenção Básica.",
      "Compreender vínculos e funções familiares pode ser mais útil do que impor um único modelo ideal."
    ],
    falsas: [
      "O artigo defende que existe apenas um modelo legítimo de família.",
      "Família é um conceito imutável e sem relação com transformações históricas.",
      "Configurações não hegemônicas devem ser excluídas do cuidado.",
      "Definições cristalizadas de família não produzem qualquer efeito na prática profissional.",
      "A atenção básica não utiliza a família como referência de cuidado.",
      "O artigo reduz família exclusivamente ao parentesco biológico."
    ],
    explicacaoBase: "O ensaio propõe problematizar definições rígidas e reconhecer transformações e pluralidade das famílias."
  }
];

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
  const d = ((deslocamento % n) + n) % n;
  return itens.slice(d).concat(itens.slice(0, d));
}

function normalizarSemantica(
  value: string
) {
  const stopwords =
    new Set([
      "a","o","as","os","de","da","do","das","dos",
      "e","em","para","por","com","um","uma","que",
      "se","na","no","nas","nos","ao","aos","à","às"
    ]);

  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter(function(token) {
      return (
        token.length > 2 &&
        !stopwords.has(token)
      );
    });
}


function similaridadeSemantica(
  a: string,
  b: string
) {
  const setA =
    new Set(
      normalizarSemantica(a)
    );

  const setB =
    new Set(
      normalizarSemantica(b)
    );

  if (
    !setA.size ||
    !setB.size
  ) {
    return 0;
  }

  let intersecao = 0;

  for (const token of setA) {
    if (setB.has(token)) {
      intersecao += 1;
    }
  }

  const uniao =
    new Set([
      ...setA,
      ...setB
    ]).size;

  return uniao
    ? intersecao / uniao
    : 0;
}


function escolherDistratores(
  tema: TemaFonte,
  alvo: string,
  corretas: string[],
  modo:
    "correta" |
    "incorreta",
  quantidade = 4
) {
  const candidatas =
    (
      modo === "correta"
        ? tema.falsas
        : tema.verdades
    )
      .filter(function(texto) {
        return (
          texto !== alvo &&
          !corretas.includes(texto)
        );
      });

  const unicas: string[] = [];

  for (const texto of candidatas) {
    if (
      unicas.some(function(existente) {
        return (
          similaridadeSemantica(
            existente,
            texto
          ) >= 0.72
        );
      })
    ) {
      continue;
    }

    unicas.push(texto);

    if (
      unicas.length >=
      quantidade
    ) {
      break;
    }
  }

  return unicas;
}


function gerarQuestoes(
  tema: TemaFonte
) {
  const questoes: Array<{
    enunciado: string;
    explicacao: string;
    dificuldade: string;
    alvoSemantico: string;
    alternativas: Array<{
      texto: string;
      correta: boolean;
    }>;
  }> = [];

  const alvosUsados: string[] = [];

  function adicionar(
    alvo: string,
    modo:
      "correta" |
      "incorreta"
  ) {
    if (
      alvosUsados.some(function(existente) {
        return (
          similaridadeSemantica(
            existente,
            alvo
          ) >= 0.68
        );
      })
    ) {
      return;
    }

    const distratores =
      escolherDistratores(
        tema,
        alvo,
        [
          alvo,
          ...alvosUsados
        ],
        modo,
        4
      );

    if (
      distratores.length <
      4
    ) {
      return;
    }

    const alternativas =
      rotacionar(
        [
          {
            texto:
              alvo,
            correta:
              true
          },
          ...distratores.map(
            function(texto) {
              return {
                texto,
                correta:
                  false
              };
            }
          )
        ],
        questoes.length %
          5
      );

    questoes.push({
      enunciado:
        modo === "correta"
          ? (
              "Sobre " +
              tema.tema +
              ", assinale a alternativa CORRETA."
            )
          : (
              "Em relação a " +
              tema.tema +
              ", marque a alternativa INCORRETA."
            ),

      explicacao:
        modo === "correta"
          ? tema.explicacaoBase
          : (
              "A alternativa marcada é a afirmação incorreta. " +
              tema.explicacaoBase
            ),

      dificuldade:
        questoes.length <
          4
          ? "facil"
          : (
              questoes.length <
                9
                ? "medio"
                : "dificil"
            ),

      alvoSemantico:
        alvo,

      alternativas
    });

    alvosUsados.push(
      alvo
    );
  }

  for (
    const verdade
    of tema.verdades
  ) {
    adicionar(
      verdade,
      "correta"
    );
  }

  for (
    const falsa
    of tema.falsas
  ) {
    adicionar(
      falsa,
      "incorreta"
    );
  }

  return questoes;
}


function quantidadeEsperadaTema(
  tema: TemaFonte
) {
  return gerarQuestoes(
    tema
  ).length;
}


function totalEsperadoBanco() {
  return TEMAS.reduce(
    function(
      total,
      tema
    ) {
      return (
        total +
        quantidadeEsperadaTema(
          tema
        )
      );
    },
    0
  );
}


export async function
sincronizarQuestoesSaudeColetivaI() {
  const usuario =
    await prisma.usuario.findFirst({
      orderBy: {
        id: "asc"
      },
      select: {
        id: true
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
    totalEsperadoBanco();

  const existentes =
    await prisma.questao.findMany({
      where: {
        disciplinaId:
          disciplina.id,
        fonte: {
          startsWith:
            FONTE_PREFIXO
        }
      },
      select: {
        id: true,
        fonte: true,
        tema: true
      }
    });

  const atuais =
    existentes.filter(function(item) {
      return item.fonte === FONTE;
    });

  const contagem =
    new Map<string, number>();

  for (const questao of atuais) {
    const tema =
      String(
        questao.tema ||
        ""
      );

    contagem.set(
      tema,
      (
        contagem.get(tema) ||
        0
      ) + 1
    );
  }

  const completo =
    atuais.length ===
      totalEsperado &&
    TEMAS.every(function(item) {
      return (
        contagem.get(item.tema) ===
        quantidadeEsperadaTema(
          item
        )
      );
    }) &&
    existentes.length === atuais.length;

  if (completo) {
    console.log(
      "[saude-coletiva-i] " +
      totalEsperado +
      " questões com fontes reais já sincronizadas."
    );
    return;
  }

  if (existentes.length) {
    await prisma.questao.deleteMany({
      where: {
        disciplinaId:
          disciplina.id,
        fonte: {
          startsWith:
            FONTE_PREFIXO
        }
      }
    });
  }

  let inseridas = 0;

  for (const tema of TEMAS) {
    const questoes =
      gerarQuestoes(
        tema
      );

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
            tema.tema,
          fonte:
            FONTE,
          origemId:
            FONTE +
            "-" +
            slug(
              tema.tema
            ) +
            "-" +
            String(
              i + 1
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
          fonteUrl:
            tema.fonteUrl,
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

      inseridas += 1;
    }
  }

  console.log(
    "[saude-coletiva-i] " +
    inseridas +
    " questões únicas inseridas após deduplicação semântica em " +
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
      null,
    totalTemas:
      TEMAS.length,
    totalQuestoes:
      totalEsperadoBanco(),
    temas:
      TEMAS.map(function(item) {
        return {
          tema:
            item.tema,
          fonteTitulo:
            item.fonteTitulo,
          fonteUrl:
            item.fonteUrl
        };
      })
  };
}
