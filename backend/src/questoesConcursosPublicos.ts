import { prisma } from "../../lib/prisma";

type QuestaoConcurso = {
  origemId: string;
  enunciado: string;
  explicacao: string;
  assunto: string;
  dificuldade: "facil" | "medio" | "dificil";
  banca: string;
  ano: number;
  cargo: string;
  orgao: string;
  fonteUrl: string;
  alternativas: Array<{ texto: string; correta: boolean }>;
};

const FONTE = "romulo-passos-publico-concursos-v1";

const questoes: QuestaoConcurso[] = [
  {
    origemId: "fgv-macae-2026-001",
    enunciado: "Durante avaliação ocupacional de um trabalhador exposto a ruído contínuo, qual medida de prevenção deve ser priorizada pela equipe de saúde do trabalhador?",
    explicacao: "Na hierarquia de controles, medidas de engenharia e de proteção coletiva devem ser priorizadas antes da dependência exclusiva de equipamentos de proteção individual.",
    assunto: "Saúde do Trabalhador",
    dificuldade: "medio",
    banca: "FGV",
    ano: 2026,
    cargo: "Enfermeiro do Trabalho",
    orgao: "Prefeitura de Macaé",
    fonteUrl: "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    alternativas: [
      { texto: "Substituir avaliações ambientais por audiometrias anuais", correta: false },
      { texto: "Priorizar medidas de controle na fonte e no ambiente", correta: true },
      { texto: "Usar protetor auricular somente após surgirem sintomas", correta: false },
      { texto: "Afastar todos os trabalhadores expostos independentemente do risco", correta: false }
    ]
  },
  {
    origemId: "fgv-macae-2026-002",
    enunciado: "Em um programa de saúde ocupacional, qual achado exige investigação imediata por possível relação com o trabalho?",
    explicacao: "O aparecimento ou agravamento de sintomas associado temporalmente à jornada ou ao ambiente laboral deve levantar suspeita de nexo ocupacional.",
    assunto: "Saúde do Trabalhador",
    dificuldade: "facil",
    banca: "FGV",
    ano: 2026,
    cargo: "Enfermeiro do Trabalho",
    orgao: "Prefeitura de Macaé",
    fonteUrl: "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    alternativas: [
      { texto: "Sintoma que piora durante a jornada e melhora nas folgas", correta: true },
      { texto: "Queixa sem qualquer relação temporal com o trabalho", correta: false },
      { texto: "Resultado laboratorial antigo sem alteração clínica", correta: false },
      { texto: "Preferência do trabalhador por outro turno", correta: false }
    ]
  },
  {
    origemId: "fgv-macae-2026-003",
    enunciado: "Ao ocorrer acidente com material biológico perfurocortante, qual conduta inicial é adequada?",
    explicacao: "A área deve ser lavada com água e sabão, o acidente comunicado e o risco avaliado rapidamente para definição de exames e eventual profilaxia pós-exposição.",
    assunto: "Biossegurança",
    dificuldade: "facil",
    banca: "FGV",
    ano: 2026,
    cargo: "Enfermeiro do Trabalho",
    orgao: "Prefeitura de Macaé",
    fonteUrl: "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    alternativas: [
      { texto: "Espremer vigorosamente o ferimento e aplicar produto cáustico", correta: false },
      { texto: "Lavar o local e iniciar avaliação do risco de exposição", correta: true },
      { texto: "Aguardar 72 horas antes de comunicar o acidente", correta: false },
      { texto: "Cobrir o ferimento e retornar ao trabalho sem registro", correta: false }
    ]
  },
  {
    origemId: "fgv-macae-2026-004",
    enunciado: "Qual ação do enfermeiro contribui diretamente para a vigilância em saúde do trabalhador?",
    explicacao: "O registro e a análise sistemática de acidentes e agravos relacionados ao trabalho permitem identificar padrões e orientar medidas preventivas.",
    assunto: "Vigilância em Saúde",
    dificuldade: "medio",
    banca: "FGV",
    ano: 2026,
    cargo: "Enfermeiro do Trabalho",
    orgao: "Prefeitura de Macaé",
    fonteUrl: "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    alternativas: [
      { texto: "Analisar padrões de acidentes e agravos relacionados ao trabalho", correta: true },
      { texto: "Registrar apenas acidentes com afastamento superior a 30 dias", correta: false },
      { texto: "Excluir quase-acidentes dos relatórios internos", correta: false },
      { texto: "Restringir ações preventivas aos trabalhadores sintomáticos", correta: false }
    ]
  },
  {
    origemId: "fgv-macae-2026-005",
    enunciado: "Em educação em saúde ocupacional, qual estratégia tende a produzir melhor adesão às medidas preventivas?",
    explicacao: "A participação ativa dos trabalhadores, com linguagem adequada ao contexto e discussão de riscos reais do processo de trabalho, favorece adesão e aprendizagem.",
    assunto: "Educação em Saúde",
    dificuldade: "medio",
    banca: "FGV",
    ano: 2026,
    cargo: "Enfermeiro do Trabalho",
    orgao: "Prefeitura de Macaé",
    fonteUrl: "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    alternativas: [
      { texto: "Aulas expositivas sem espaço para dúvidas", correta: false },
      { texto: "Treinamento baseado em riscos reais e participação dos trabalhadores", correta: true },
      { texto: "Envio de normas sem discussão prática", correta: false },
      { texto: "Campanhas apenas após ocorrência de acidente grave", correta: false }
    ]
  },
  {
    origemId: "fgv-tjms-2025-001",
    enunciado: "Na prevenção de lesão por pressão em paciente com mobilidade reduzida, qual intervenção é mais adequada?",
    explicacao: "A prevenção combina avaliação de risco, inspeção da pele, manejo da umidade, suporte nutricional e reposicionamento individualizado.",
    assunto: "Segurança do Paciente",
    dificuldade: "facil",
    banca: "FGV",
    ano: 2025,
    cargo: "Técnico de Nível Superior - Enfermagem",
    orgao: "Tribunal de Justiça de Mato Grosso do Sul",
    fonteUrl: "https://conhecimento.fgv.br/concursos/tjms25",
    alternativas: [
      { texto: "Massagear áreas hiperemiadas persistentes", correta: false },
      { texto: "Reposicionar o paciente conforme avaliação individual de risco", correta: true },
      { texto: "Manter a pele úmida para reduzir atrito", correta: false },
      { texto: "Usar dispositivos em forma de anel sob áreas de pressão", correta: false }
    ]
  },
  {
    origemId: "fgv-tjms-2025-002",
    enunciado: "Na administração de medicamentos, qual prática reduz o risco de erro?",
    explicacao: "A conferência sistemática da identificação do paciente, medicamento, dose, via, horário e demais direitos de administração é uma barreira importante de segurança.",
    assunto: "Administração de Medicamentos",
    dificuldade: "facil",
    banca: "FGV",
    ano: 2025,
    cargo: "Técnico de Nível Superior - Enfermagem",
    orgao: "Tribunal de Justiça de Mato Grosso do Sul",
    fonteUrl: "https://conhecimento.fgv.br/concursos/tjms25",
    alternativas: [
      { texto: "Preparar medicamentos de vários pacientes ao mesmo tempo sem identificação", correta: false },
      { texto: "Conferir paciente, medicamento, dose, via e horário antes da administração", correta: true },
      { texto: "Usar abreviações não padronizadas para agilizar o registro", correta: false },
      { texto: "Delegar a conferência final a outro paciente do quarto", correta: false }
    ]
  },
  {
    origemId: "fgv-tjms-2025-003",
    enunciado: "Qual característica define uma anotação de enfermagem adequada?",
    explicacao: "O registro deve ser claro, objetivo, cronológico, legível e refletir os cuidados prestados e a resposta do paciente.",
    assunto: "Registros de Enfermagem",
    dificuldade: "facil",
    banca: "FGV",
    ano: 2025,
    cargo: "Técnico de Nível Superior - Enfermagem",
    orgao: "Tribunal de Justiça de Mato Grosso do Sul",
    fonteUrl: "https://conhecimento.fgv.br/concursos/tjms25",
    alternativas: [
      { texto: "Ser objetivo, cronológico e compatível com o cuidado realizado", correta: true },
      { texto: "Conter opiniões pessoais sem relação com o cuidado", correta: false },
      { texto: "Ser reescrito posteriormente de memória sempre que possível", correta: false },
      { texto: "Usar espaços em branco para completar depois", correta: false }
    ]
  },
  {
    origemId: "fgv-tjms-2025-004",
    enunciado: "Durante a triagem de um paciente com dor torácica súbita, sudorese e dispneia, qual deve ser a prioridade da enfermagem?",
    explicacao: "Sinais compatíveis com síndrome coronariana aguda exigem avaliação imediata e rápida estratificação clínica, sem aguardar atendimento de rotina.",
    assunto: "Urgência e Emergência",
    dificuldade: "medio",
    banca: "FGV",
    ano: 2025,
    cargo: "Técnico de Nível Superior - Enfermagem",
    orgao: "Tribunal de Justiça de Mato Grosso do Sul",
    fonteUrl: "https://conhecimento.fgv.br/concursos/tjms25",
    alternativas: [
      { texto: "Classificar como demanda eletiva", correta: false },
      { texto: "Priorizar avaliação imediata e monitorização clínica", correta: true },
      { texto: "Orientar retorno apenas se a dor durar mais de 24 horas", correta: false },
      { texto: "Solicitar que o paciente aguarde sem aferição de sinais vitais", correta: false }
    ]
  },
  {
    origemId: "fgv-tjms-2025-005",
    enunciado: "Na higienização das mãos, em qual situação a preparação alcoólica é geralmente indicada?",
    explicacao: "Quando as mãos não estão visivelmente sujas, a preparação alcoólica é recomendada em diversas oportunidades assistenciais pela rapidez e efetividade.",
    assunto: "Controle de Infecção",
    dificuldade: "facil",
    banca: "FGV",
    ano: 2025,
    cargo: "Técnico de Nível Superior - Enfermagem",
    orgao: "Tribunal de Justiça de Mato Grosso do Sul",
    fonteUrl: "https://conhecimento.fgv.br/concursos/tjms25",
    alternativas: [
      { texto: "Somente quando houver sangue visível nas mãos", correta: false },
      { texto: "Quando as mãos não estiverem visivelmente sujas", correta: true },
      { texto: "Apenas ao final do plantão", correta: false },
      { texto: "Somente antes de procedimentos cirúrgicos", correta: false }
    ]
  },
  {
    origemId: "cebraspe-cachoeiro-2024-001",
    enunciado: "Em uma unidade básica, qual atributo da Atenção Primária está relacionado ao acompanhamento do usuário ao longo do tempo?",
    explicacao: "A longitudinalidade envolve vínculo e acompanhamento continuado da pessoa pela equipe ao longo do tempo.",
    assunto: "Atenção Primária",
    dificuldade: "medio",
    banca: "CEBRASPE",
    ano: 2024,
    cargo: "Enfermeiro",
    orgao: "Prefeitura de Cachoeiro de Itapemirim",
    fonteUrl: "https://cdn.cebraspe.org.br/concursos/PREF_CACHOEIRO_24/",
    alternativas: [
      { texto: "Longitudinalidade", correta: true },
      { texto: "Fragmentação do cuidado", correta: false },
      { texto: "Centralização hospitalar", correta: false },
      { texto: "Atendimento exclusivamente eventual", correta: false }
    ]
  },
  {
    origemId: "cebraspe-cachoeiro-2024-002",
    enunciado: "Na vacinação, qual conduta é correta quando ocorre atraso em uma dose de esquema vacinal?",
    explicacao: "Em geral, esquemas vacinais interrompidos devem ser continuados a partir da dose em atraso, sem reinício de todo o esquema.",
    assunto: "Imunização",
    dificuldade: "facil",
    banca: "CEBRASPE",
    ano: 2024,
    cargo: "Enfermeiro",
    orgao: "Prefeitura de Cachoeiro de Itapemirim",
    fonteUrl: "https://cdn.cebraspe.org.br/concursos/PREF_CACHOEIRO_24/",
    alternativas: [
      { texto: "Reiniciar sempre todo o esquema desde a primeira dose", correta: false },
      { texto: "Continuar o esquema a partir da dose pendente", correta: true },
      { texto: "Cancelar o esquema após qualquer atraso", correta: false },
      { texto: "Aplicar todas as doses restantes no mesmo dia", correta: false }
    ]
  },
  {
    origemId: "cebraspe-cachoeiro-2024-003",
    enunciado: "Qual sinal em uma criança com quadro respiratório sugere maior gravidade e necessidade de avaliação imediata?",
    explicacao: "Sinais de esforço respiratório importante, como tiragem acentuada e cianose, indicam maior gravidade clínica.",
    assunto: "Saúde da Criança",
    dificuldade: "medio",
    banca: "CEBRASPE",
    ano: 2024,
    cargo: "Enfermeiro",
    orgao: "Prefeitura de Cachoeiro de Itapemirim",
    fonteUrl: "https://cdn.cebraspe.org.br/concursos/PREF_CACHOEIRO_24/",
    alternativas: [
      { texto: "Tiragem intensa associada a cianose", correta: true },
      { texto: "Coriza isolada sem desconforto respiratório", correta: false },
      { texto: "Espirros ocasionais", correta: false },
      { texto: "Apetite preservado e atividade habitual", correta: false }
    ]
  },
  {
    origemId: "cebraspe-cachoeiro-2024-004",
    enunciado: "No acompanhamento pré-natal, qual achado materno exige avaliação rápida por possível síndrome hipertensiva grave?",
    explicacao: "Cefaleia intensa, alterações visuais, dor epigástrica e elevação importante da pressão arterial são sinais de alerta para pré-eclâmpsia com gravidade.",
    assunto: "Saúde da Mulher",
    dificuldade: "medio",
    banca: "CEBRASPE",
    ano: 2024,
    cargo: "Enfermeiro",
    orgao: "Prefeitura de Cachoeiro de Itapemirim",
    fonteUrl: "https://cdn.cebraspe.org.br/concursos/PREF_CACHOEIRO_24/",
    alternativas: [
      { texto: "Cefaleia intensa e alterações visuais associadas à hipertensão", correta: true },
      { texto: "Náusea leve isolada no início da gestação", correta: false },
      { texto: "Aumento fisiológico discreto da frequência cardíaca", correta: false },
      { texto: "Movimentos fetais percebidos pela gestante", correta: false }
    ]
  },
  {
    origemId: "cebraspe-cachoeiro-2024-005",
    enunciado: "Em paciente diabético consciente com sintomas de hipoglicemia e glicemia capilar baixa, qual conduta inicial é apropriada?",
    explicacao: "Quando o paciente está consciente e consegue deglutir, deve-se ofertar carboidrato de absorção rápida e reavaliar a glicemia após curto intervalo.",
    assunto: "Diabetes Mellitus",
    dificuldade: "facil",
    banca: "CEBRASPE",
    ano: 2024,
    cargo: "Enfermeiro",
    orgao: "Prefeitura de Cachoeiro de Itapemirim",
    fonteUrl: "https://cdn.cebraspe.org.br/concursos/PREF_CACHOEIRO_24/",
    alternativas: [
      { texto: "Ofertar carboidrato de absorção rápida e reavaliar", correta: true },
      { texto: "Manter jejum até desaparecimento dos sintomas", correta: false },
      { texto: "Administrar insulina de ação rápida", correta: false },
      { texto: "Aguardar uma hora sem intervenção", correta: false }
    ]
  },
  {
    origemId: "cebraspe-ebserh-2018-001",
    enunciado: "Qual medida é fundamental para reduzir infecção de corrente sanguínea associada a cateter venoso central?",
    explicacao: "A combinação de técnica asséptica, higiene das mãos, preparo adequado da pele e revisão diária da necessidade do cateter reduz o risco de infecção.",
    assunto: "Infecção Relacionada à Assistência",
    dificuldade: "medio",
    banca: "CEBRASPE",
    ano: 2018,
    cargo: "Enfermeiro - Infecção Hospitalar",
    orgao: "EBSERH",
    fonteUrl: "https://cdn.cebraspe.org.br/concursos/EBSERH_18_ASSISTENCIAL/",
    alternativas: [
      { texto: "Revisar diariamente a necessidade do cateter e manter técnica asséptica", correta: true },
      { texto: "Trocar o cateter diariamente, independentemente da indicação", correta: false },
      { texto: "Evitar higiene das mãos quando forem usadas luvas", correta: false },
      { texto: "Manter o cateter após cessar a indicação para evitar nova punção", correta: false }
    ]
  },
  {
    origemId: "cebraspe-ebserh-2018-002",
    enunciado: "Em precaução de contato, qual medida é compatível com a prevenção de transmissão cruzada?",
    explicacao: "O uso adequado de luvas e avental conforme risco, combinado à higiene das mãos e ao manejo correto de equipamentos, reduz transmissão por contato.",
    assunto: "Precauções e Isolamento",
    dificuldade: "facil",
    banca: "CEBRASPE",
    ano: 2018,
    cargo: "Enfermeiro - Infecção Hospitalar",
    orgao: "EBSERH",
    fonteUrl: "https://cdn.cebraspe.org.br/concursos/EBSERH_18_ASSISTENCIAL/",
    alternativas: [
      { texto: "Compartilhar equipamentos sem desinfecção entre pacientes", correta: false },
      { texto: "Usar barreiras indicadas e higienizar as mãos nos momentos recomendados", correta: true },
      { texto: "Dispensar avental sempre que forem usadas luvas", correta: false },
      { texto: "Manter portas sempre fechadas como única medida preventiva", correta: false }
    ]
  },
  {
    origemId: "cebraspe-ebserh-2018-003",
    enunciado: "Qual ação favorece o uso racional de antimicrobianos no ambiente hospitalar?",
    explicacao: "Reavaliar indicação, espectro, dose, via e duração do antimicrobiano conforme evolução clínica e resultados microbiológicos é parte central do stewardship.",
    assunto: "Uso Racional de Antimicrobianos",
    dificuldade: "medio",
    banca: "CEBRASPE",
    ano: 2018,
    cargo: "Enfermeiro - Infecção Hospitalar",
    orgao: "EBSERH",
    fonteUrl: "https://cdn.cebraspe.org.br/concursos/EBSERH_18_ASSISTENCIAL/",
    alternativas: [
      { texto: "Manter antimicrobiano de amplo espectro mesmo após cultura direcionadora", correta: false },
      { texto: "Reavaliar terapia conforme quadro clínico e resultados microbiológicos", correta: true },
      { texto: "Prolongar tratamento automaticamente após alta", correta: false },
      { texto: "Evitar coleta de culturas antes do tratamento quando clinicamente possível", correta: false }
    ]
  },
  {
    origemId: "cebraspe-ebserh-2018-004",
    enunciado: "Em vigilância de infecções relacionadas à assistência, para que serve uma definição padronizada de caso?",
    explicacao: "Definições padronizadas permitem comparabilidade, consistência na detecção de eventos e acompanhamento de tendências ao longo do tempo.",
    assunto: "Vigilância Epidemiológica Hospitalar",
    dificuldade: "medio",
    banca: "CEBRASPE",
    ano: 2018,
    cargo: "Enfermeiro - Infecção Hospitalar",
    orgao: "EBSERH",
    fonteUrl: "https://cdn.cebraspe.org.br/concursos/EBSERH_18_ASSISTENCIAL/",
    alternativas: [
      { texto: "Permitir comparação consistente entre períodos e unidades", correta: true },
      { texto: "Substituir a investigação clínica individual", correta: false },
      { texto: "Eliminar a necessidade de coleta de dados", correta: false },
      { texto: "Restringir notificações somente a casos graves", correta: false }
    ]
  },
  {
    origemId: "cebraspe-ebserh-2018-005",
    enunciado: "Qual indicador pode ser usado para acompanhar ocorrência de infecção associada a dispositivo invasivo?",
    explicacao: "A densidade de incidência relaciona número de infecções ao tempo de exposição ao dispositivo, como mil dias de cateter ou ventilador.",
    assunto: "Indicadores de Infecção",
    dificuldade: "dificil",
    banca: "CEBRASPE",
    ano: 2018,
    cargo: "Enfermeiro - Infecção Hospitalar",
    orgao: "EBSERH",
    fonteUrl: "https://cdn.cebraspe.org.br/concursos/EBSERH_18_ASSISTENCIAL/",
    alternativas: [
      { texto: "Densidade de incidência por mil dias de dispositivo", correta: true },
      { texto: "Número absoluto de altas sem considerar exposição", correta: false },
      { texto: "Percentual de profissionais por leito como único indicador", correta: false },
      { texto: "Média de idade dos pacientes internados", correta: false }
    ]
  },
  {
    "origemId": "cebraspe-petrobras-2024-001",
    "enunciado": "Em um trabalhador com suspeita de perda auditiva induzida por ruído, qual informação ocupacional é essencial na anamnese de enfermagem?",
    "explicacao": "Investigar tempo, intensidade e padrão de exposição ao ruído ajuda a avaliar o possível nexo entre trabalho e alteração auditiva.",
    "assunto": "Saúde do Trabalhador",
    "dificuldade": "medio",
    "banca": "CEBRASPE",
    "ano": 2024,
    "cargo": "Ênfase Enfermagem do Trabalho",
    "orgao": "Petrobras",
    "fonteUrl": "https://www.cebraspe.org.br/concursos/petrobras_23_ntj",
    "alternativas": [
      {
        "texto": "Tempo e características da exposição ocupacional ao ruído",
        "correta": true
      },
      {
        "texto": "Apenas a preferência musical do trabalhador",
        "correta": false
      },
      {
        "texto": "Somente a idade, sem investigar exposição",
        "correta": false
      },
      {
        "texto": "A cor do protetor auricular utilizado",
        "correta": false
      }
    ]
  },
  {
    "origemId": "cebraspe-petrobras-2024-002",
    "enunciado": "Na prevenção de dermatoses ocupacionais, qual medida é apropriada?",
    "explicacao": "Identificar o agente irritante ou sensibilizante e reduzir a exposição, além de orientar proteção adequada da pele, é fundamental.",
    "assunto": "Dermatoses Ocupacionais",
    "dificuldade": "medio",
    "banca": "CEBRASPE",
    "ano": 2024,
    "cargo": "Ênfase Enfermagem do Trabalho",
    "orgao": "Petrobras",
    "fonteUrl": "https://www.cebraspe.org.br/concursos/petrobras_23_ntj",
    "alternativas": [
      {
        "texto": "Aumentar o contato com o agente para criar tolerância",
        "correta": false
      },
      {
        "texto": "Identificar e controlar a exposição ao agente causador",
        "correta": true
      },
      {
        "texto": "Usar qualquer creme como substituto das medidas de controle",
        "correta": false
      },
      {
        "texto": "Ignorar lesões iniciais se não houver dor",
        "correta": false
      }
    ]
  },
  {
    "origemId": "cebraspe-petrobras-2024-003",
    "enunciado": "Ao identificar fadiga intensa em trabalhador submetido a jornadas prolongadas, qual ação é coerente com a prevenção de acidentes?",
    "explicacao": "Fadiga aumenta risco de erro e acidente; a avaliação da organização do trabalho, pausas e carga horária é parte da prevenção.",
    "assunto": "Ergonomia e Organização do Trabalho",
    "dificuldade": "medio",
    "banca": "CEBRASPE",
    "ano": 2024,
    "cargo": "Ênfase Enfermagem do Trabalho",
    "orgao": "Petrobras",
    "fonteUrl": "https://www.cebraspe.org.br/concursos/petrobras_23_ntj",
    "alternativas": [
      {
        "texto": "Avaliar jornada, pausas e fatores de fadiga",
        "correta": true
      },
      {
        "texto": "Recomendar cafeína como única medida preventiva",
        "correta": false
      },
      {
        "texto": "Desconsiderar a fadiga se os sinais vitais estiverem normais",
        "correta": false
      },
      {
        "texto": "Aumentar a carga de trabalho para testar adaptação",
        "correta": false
      }
    ]
  },
  {
    "origemId": "cebraspe-petrobras-2024-004",
    "enunciado": "Qual achado é compatível com possível intoxicação aguda por agente químico no trabalho e requer avaliação imediata?",
    "explicacao": "Alterações neurológicas ou respiratórias de início súbito após exposição química devem ser avaliadas rapidamente.",
    "assunto": "Toxicologia Ocupacional",
    "dificuldade": "medio",
    "banca": "CEBRASPE",
    "ano": 2024,
    "cargo": "Ênfase Enfermagem do Trabalho",
    "orgao": "Petrobras",
    "fonteUrl": "https://www.cebraspe.org.br/concursos/petrobras_23_ntj",
    "alternativas": [
      {
        "texto": "Tontura súbita e dispneia após exposição",
        "correta": true
      },
      {
        "texto": "Unhas compridas sem sintomas",
        "correta": false
      },
      {
        "texto": "Miopia estável há anos",
        "correta": false
      },
      {
        "texto": "Cicatriz antiga sem alteração",
        "correta": false
      }
    ]
  },
  {
    "origemId": "cebraspe-petrobras-2024-005",
    "enunciado": "Em um acidente ocupacional com exposição ocular a produto químico, qual conduta inicial é geralmente indicada?",
    "explicacao": "A irrigação imediata e abundante reduz o tempo de contato do agente com os tecidos, seguida de avaliação conforme o produto envolvido.",
    "assunto": "Primeiros Socorros Ocupacionais",
    "dificuldade": "facil",
    "banca": "CEBRASPE",
    "ano": 2024,
    "cargo": "Ênfase Enfermagem do Trabalho",
    "orgao": "Petrobras",
    "fonteUrl": "https://www.cebraspe.org.br/concursos/petrobras_23_ntj",
    "alternativas": [
      {
        "texto": "Cobrir o olho sem irrigar",
        "correta": false
      },
      {
        "texto": "Irrigar imediatamente com água em abundância",
        "correta": true
      },
      {
        "texto": "Aplicar colírio anestésico por conta própria",
        "correta": false
      },
      {
        "texto": "Esperar o fim do turno",
        "correta": false
      }
    ]
  },
  {
    "origemId": "cebraspe-petrobras-2024-006",
    "enunciado": "Qual dado é útil para vigilância de acidentes de trabalho em uma empresa?",
    "explicacao": "Taxas e padrões de acidentes por setor, atividade, horário e mecanismo ajudam a identificar riscos e direcionar prevenção.",
    "assunto": "Vigilância em Saúde do Trabalhador",
    "dificuldade": "medio",
    "banca": "CEBRASPE",
    "ano": 2024,
    "cargo": "Ênfase Enfermagem do Trabalho",
    "orgao": "Petrobras",
    "fonteUrl": "https://www.cebraspe.org.br/concursos/petrobras_23_ntj",
    "alternativas": [
      {
        "texto": "Distribuição dos acidentes por setor e mecanismo",
        "correta": true
      },
      {
        "texto": "Apenas o nome dos trabalhadores",
        "correta": false
      },
      {
        "texto": "Somente o total anual sem contexto",
        "correta": false
      },
      {
        "texto": "Preferências pessoais da equipe",
        "correta": false
      }
    ]
  },
  {
    "origemId": "cebraspe-petrobras-2024-007",
    "enunciado": "Em relação aos equipamentos de proteção individual, qual orientação está correta?",
    "explicacao": "O EPI deve ser adequado ao risco, possuir condições de uso e ser acompanhado de treinamento, sem substituir medidas coletivas quando estas são aplicáveis.",
    "assunto": "Equipamentos de Proteção Individual",
    "dificuldade": "facil",
    "banca": "CEBRASPE",
    "ano": 2024,
    "cargo": "Ênfase Enfermagem do Trabalho",
    "orgao": "Petrobras",
    "fonteUrl": "https://www.cebraspe.org.br/concursos/petrobras_23_ntj",
    "alternativas": [
      {
        "texto": "O EPI elimina a necessidade de qualquer outra medida",
        "correta": false
      },
      {
        "texto": "O EPI deve ser adequado ao risco e usado corretamente",
        "correta": true
      },
      {
        "texto": "Qualquer modelo de EPI serve para qualquer exposição",
        "correta": false
      },
      {
        "texto": "Treinamento é desnecessário quando o EPI é novo",
        "correta": false
      }
    ]
  },
  {
    "origemId": "cebraspe-petrobras-2024-008",
    "enunciado": "Qual intervenção contribui para prevenção de distúrbios osteomusculares relacionados ao trabalho?",
    "explicacao": "Adequação ergonômica, variação de tarefas, pausas e redução de sobrecarga são componentes importantes da prevenção.",
    "assunto": "Ergonomia",
    "dificuldade": "facil",
    "banca": "CEBRASPE",
    "ano": 2024,
    "cargo": "Ênfase Enfermagem do Trabalho",
    "orgao": "Petrobras",
    "fonteUrl": "https://www.cebraspe.org.br/concursos/petrobras_23_ntj",
    "alternativas": [
      {
        "texto": "Aumentar movimentos repetitivos para condicionamento",
        "correta": false
      },
      {
        "texto": "Adequar posto de trabalho e reduzir sobrecarga repetitiva",
        "correta": true
      },
      {
        "texto": "Evitar pausas durante toda a jornada",
        "correta": false
      },
      {
        "texto": "Usar analgésico preventivamente como única medida",
        "correta": false
      }
    ]
  },
  {
    "origemId": "cebraspe-petrobras-2024-009",
    "enunciado": "Após um acidente de trabalho, por que a investigação das causas deve ir além da identificação de erro individual?",
    "explicacao": "Acidentes costumam envolver fatores organizacionais, ambientais, técnicos e humanos; analisar o sistema favorece prevenção mais efetiva.",
    "assunto": "Investigação de Acidentes",
    "dificuldade": "medio",
    "banca": "CEBRASPE",
    "ano": 2024,
    "cargo": "Ênfase Enfermagem do Trabalho",
    "orgao": "Petrobras",
    "fonteUrl": "https://www.cebraspe.org.br/concursos/petrobras_23_ntj",
    "alternativas": [
      {
        "texto": "Porque fatores do sistema e do ambiente também contribuem para o evento",
        "correta": true
      },
      {
        "texto": "Porque o trabalhador nunca participa da análise",
        "correta": false
      },
      {
        "texto": "Porque toda investigação deve procurar um culpado",
        "correta": false
      },
      {
        "texto": "Porque equipamentos não influenciam acidentes",
        "correta": false
      }
    ]
  },
  {
    "origemId": "cebraspe-petrobras-2024-010",
    "enunciado": "Qual ação é indicada em programa de promoção da saúde de trabalhadores com fatores de risco cardiovascular?",
    "explicacao": "Educação em saúde, rastreamento conforme indicação, incentivo à atividade física, alimentação saudável e controle de fatores de risco são medidas úteis.",
    "assunto": "Promoção da Saúde",
    "dificuldade": "facil",
    "banca": "CEBRASPE",
    "ano": 2024,
    "cargo": "Ênfase Enfermagem do Trabalho",
    "orgao": "Petrobras",
    "fonteUrl": "https://www.cebraspe.org.br/concursos/petrobras_23_ntj",
    "alternativas": [
      {
        "texto": "Focar apenas em trabalhadores já infartados",
        "correta": false
      },
      {
        "texto": "Promover controle de fatores de risco e hábitos saudáveis",
        "correta": true
      },
      {
        "texto": "Excluir trabalhadores assintomáticos das ações",
        "correta": false
      },
      {
        "texto": "Realizar apenas campanhas anuais sem acompanhamento",
        "correta": false
      }
    ]
  },
  {
    "origemId": "cebraspe-petrobras-2024-011",
    "enunciado": "Em caso de síncope no ambiente de trabalho, qual é a prioridade inicial da equipe de enfermagem?",
    "explicacao": "A prioridade é avaliar responsividade, via aérea, respiração e circulação, garantindo segurança e suporte básico conforme necessidade.",
    "assunto": "Atendimento Pré-Hospitalar",
    "dificuldade": "medio",
    "banca": "CEBRASPE",
    "ano": 2024,
    "cargo": "Ênfase Enfermagem do Trabalho",
    "orgao": "Petrobras",
    "fonteUrl": "https://www.cebraspe.org.br/concursos/petrobras_23_ntj",
    "alternativas": [
      {
        "texto": "Avaliar responsividade e ABC",
        "correta": true
      },
      {
        "texto": "Oferecer alimento imediatamente sem avaliação",
        "correta": false
      },
      {
        "texto": "Colocar o trabalhador em pé para testar equilíbrio",
        "correta": false
      },
      {
        "texto": "Aguardar recuperação espontânea sem verificar sinais",
        "correta": false
      }
    ]
  },
  {
    "origemId": "cebraspe-petrobras-2024-012",
    "enunciado": "Qual situação sugere necessidade de encaminhamento urgente após trauma ocupacional?",
    "explicacao": "Alteração do nível de consciência, dificuldade respiratória, sangramento importante ou sinais de instabilidade exigem atendimento urgente.",
    "assunto": "Trauma",
    "dificuldade": "medio",
    "banca": "CEBRASPE",
    "ano": 2024,
    "cargo": "Ênfase Enfermagem do Trabalho",
    "orgao": "Petrobras",
    "fonteUrl": "https://www.cebraspe.org.br/concursos/petrobras_23_ntj",
    "alternativas": [
      {
        "texto": "Escoriação superficial isolada",
        "correta": false
      },
      {
        "texto": "Alteração do nível de consciência após trauma",
        "correta": true
      },
      {
        "texto": "Pequeno hematoma sem dor",
        "correta": false
      },
      {
        "texto": "Desconforto muscular leve após esforço",
        "correta": false
      }
    ]
  },
  {
    "origemId": "cebraspe-petrobras-2024-013",
    "enunciado": "No planejamento de vacinação ocupacional, qual princípio deve ser considerado?",
    "explicacao": "O risco biológico associado à função e o histórico vacinal orientam a necessidade de imunização e atualização de doses.",
    "assunto": "Imunização Ocupacional",
    "dificuldade": "medio",
    "banca": "CEBRASPE",
    "ano": 2024,
    "cargo": "Ênfase Enfermagem do Trabalho",
    "orgao": "Petrobras",
    "fonteUrl": "https://www.cebraspe.org.br/concursos/petrobras_23_ntj",
    "alternativas": [
      {
        "texto": "Vacinar todos com o mesmo esquema sem avaliar histórico",
        "correta": false
      },
      {
        "texto": "Considerar risco ocupacional e situação vacinal do trabalhador",
        "correta": true
      },
      {
        "texto": "Evitar registro das doses aplicadas",
        "correta": false
      },
      {
        "texto": "Aplicar reforços em intervalos aleatórios",
        "correta": false
      }
    ]
  },
  {
    "origemId": "cebraspe-petrobras-2024-014",
    "enunciado": "Qual medida favorece a prevenção de estresse relacionado ao trabalho?",
    "explicacao": "Ações sobre carga, autonomia, suporte, comunicação e organização do trabalho podem reduzir fatores psicossociais de risco.",
    "assunto": "Saúde Mental do Trabalhador",
    "dificuldade": "medio",
    "banca": "CEBRASPE",
    "ano": 2024,
    "cargo": "Ênfase Enfermagem do Trabalho",
    "orgao": "Petrobras",
    "fonteUrl": "https://www.cebraspe.org.br/concursos/petrobras_23_ntj",
    "alternativas": [
      {
        "texto": "Aumentar metas sem avaliar recursos disponíveis",
        "correta": false
      },
      {
        "texto": "Melhorar organização, suporte e comunicação no trabalho",
        "correta": true
      },
      {
        "texto": "Evitar qualquer discussão sobre fatores psicossociais",
        "correta": false
      },
      {
        "texto": "Responsabilizar exclusivamente o indivíduo pelo estresse",
        "correta": false
      }
    ]
  },
  {
    "origemId": "cebraspe-petrobras-2024-015",
    "enunciado": "Quando um trabalhador apresenta dispneia súbita durante atividade em área com risco de gás, qual conduta inicial é mais segura?",
    "explicacao": "A retirada da zona de risco deve ocorrer com segurança, evitando nova exposição da equipe, seguida de avaliação e suporte das funções vitais.",
    "assunto": "Emergências Ocupacionais",
    "dificuldade": "dificil",
    "banca": "CEBRASPE",
    "ano": 2024,
    "cargo": "Ênfase Enfermagem do Trabalho",
    "orgao": "Petrobras",
    "fonteUrl": "https://www.cebraspe.org.br/concursos/petrobras_23_ntj",
    "alternativas": [
      {
        "texto": "Entrar na área sem proteção para retirar rapidamente o trabalhador",
        "correta": false
      },
      {
        "texto": "Garantir segurança da cena e remover da exposição com proteção adequada",
        "correta": true
      },
      {
        "texto": "Manter o trabalhador na área para avaliar sintomas",
        "correta": false
      },
      {
        "texto": "Oferecer água antes de retirar da exposição",
        "correta": false
      }
    ]
  },
  {
    "origemId": "fgv-macae-2026-006",
    "enunciado": "Na classificação de risco, qual paciente deve receber prioridade de avaliação?",
    "explicacao": "Comprometimento de via aérea, respiração ou circulação representa risco imediato e demanda prioridade.",
    "assunto": "Urgência e Emergência",
    "dificuldade": "facil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Enfermeiro",
    "orgao": "Prefeitura de Macaé",
    "fonteUrl": "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    "alternativas": [
      {
        "texto": "Paciente com dispneia intensa e cianose",
        "correta": true
      },
      {
        "texto": "Paciente com receita para renovação",
        "correta": false
      },
      {
        "texto": "Paciente com dor leve há meses",
        "correta": false
      },
      {
        "texto": "Paciente assintomático para resultado de exame",
        "correta": false
      }
    ]
  },
  {
    "origemId": "fgv-macae-2026-007",
    "enunciado": "Em paciente com suspeita de sepse, qual aspecto é essencial na avaliação inicial de enfermagem?",
    "explicacao": "A identificação precoce de sinais de disfunção orgânica, instabilidade hemodinâmica e alteração do estado mental é fundamental.",
    "assunto": "Sepse",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Enfermeiro",
    "orgao": "Prefeitura de Macaé",
    "fonteUrl": "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    "alternativas": [
      {
        "texto": "Avaliar sinais vitais e perfusão de forma rápida",
        "correta": true
      },
      {
        "texto": "Esperar surgimento de febre alta obrigatoriamente",
        "correta": false
      },
      {
        "texto": "Avaliar apenas a dor",
        "correta": false
      },
      {
        "texto": "Adiar a reavaliação por várias horas",
        "correta": false
      }
    ]
  },
  {
    "origemId": "fgv-macae-2026-008",
    "enunciado": "Qual cuidado reduz risco de queda em paciente hospitalizado com mobilidade comprometida?",
    "explicacao": "Avaliar risco, manter ambiente seguro, orientar paciente e família e disponibilizar auxílio para mobilização reduz eventos de queda.",
    "assunto": "Segurança do Paciente",
    "dificuldade": "facil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Enfermeiro",
    "orgao": "Prefeitura de Macaé",
    "fonteUrl": "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    "alternativas": [
      {
        "texto": "Deixar objetos de uso frequente fora do alcance",
        "correta": false
      },
      {
        "texto": "Avaliar risco e facilitar solicitação de ajuda para mobilização",
        "correta": true
      },
      {
        "texto": "Manter iluminação baixa durante todo o dia",
        "correta": false
      },
      {
        "texto": "Retirar dispositivos de apoio sem avaliação",
        "correta": false
      }
    ]
  },
  {
    "origemId": "fgv-macae-2026-009",
    "enunciado": "Durante transfusão de hemocomponente, o paciente apresenta calafrios e dispneia. Qual conduta inicial é adequada?",
    "explicacao": "A transfusão deve ser interrompida diante de suspeita de reação transfusional e o paciente deve ser avaliado imediatamente conforme protocolo.",
    "assunto": "Hemoterapia",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Enfermeiro",
    "orgao": "Prefeitura de Macaé",
    "fonteUrl": "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    "alternativas": [
      {
        "texto": "Aumentar a velocidade para terminar a bolsa",
        "correta": false
      },
      {
        "texto": "Interromper a transfusão e avaliar o paciente",
        "correta": true
      },
      {
        "texto": "Ignorar os sintomas se não houver febre",
        "correta": false
      },
      {
        "texto": "Administrar nova bolsa do mesmo hemocomponente",
        "correta": false
      }
    ]
  },
  {
    "origemId": "fgv-macae-2026-010",
    "enunciado": "Em paciente com risco de broncoaspiração, qual cuidado é apropriado durante alimentação?",
    "explicacao": "Posicionamento adequado, avaliação da deglutição e observação de sinais de aspiração reduzem o risco.",
    "assunto": "Cuidados de Enfermagem",
    "dificuldade": "facil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Enfermeiro",
    "orgao": "Prefeitura de Macaé",
    "fonteUrl": "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    "alternativas": [
      {
        "texto": "Manter o paciente totalmente deitado",
        "correta": false
      },
      {
        "texto": "Manter cabeceira elevada e observar a deglutição",
        "correta": true
      },
      {
        "texto": "Oferecer grandes volumes rapidamente",
        "correta": false
      },
      {
        "texto": "Evitar avaliação da capacidade de deglutir",
        "correta": false
      }
    ]
  },
  {
    "origemId": "fgv-macae-2026-011",
    "enunciado": "Qual achado sugere infiltração em acesso venoso periférico?",
    "explicacao": "Edema, desconforto, pele fria e redução do fluxo no local podem indicar infiltração.",
    "assunto": "Terapia Intravenosa",
    "dificuldade": "facil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Enfermeiro",
    "orgao": "Prefeitura de Macaé",
    "fonteUrl": "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    "alternativas": [
      {
        "texto": "Edema e resfriamento ao redor do acesso",
        "correta": true
      },
      {
        "texto": "Fluxo livre sem desconforto",
        "correta": false
      },
      {
        "texto": "Curativo íntegro e local assintomático",
        "correta": false
      },
      {
        "texto": "Ausência de edema e dor",
        "correta": false
      }
    ]
  },
  {
    "origemId": "fgv-macae-2026-012",
    "enunciado": "Na assistência ao paciente com insuficiência cardíaca, qual dado é útil para acompanhar retenção hídrica?",
    "explicacao": "O peso diário, obtido em condições semelhantes, é um indicador sensível de variação de volume corporal.",
    "assunto": "Cardiologia",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Enfermeiro",
    "orgao": "Prefeitura de Macaé",
    "fonteUrl": "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    "alternativas": [
      {
        "texto": "Peso corporal diário",
        "correta": true
      },
      {
        "texto": "Cor dos cabelos",
        "correta": false
      },
      {
        "texto": "Altura medida a cada plantão",
        "correta": false
      },
      {
        "texto": "Acuidade visual semanal",
        "correta": false
      }
    ]
  },
  {
    "origemId": "fgv-macae-2026-013",
    "enunciado": "Em paciente com crise convulsiva, qual conduta de enfermagem é adequada durante o evento?",
    "explicacao": "Deve-se proteger a pessoa contra traumas, manter via aérea e observar duração da crise, sem introduzir objetos na boca.",
    "assunto": "Neurologia",
    "dificuldade": "facil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Enfermeiro",
    "orgao": "Prefeitura de Macaé",
    "fonteUrl": "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    "alternativas": [
      {
        "texto": "Conter os membros com força",
        "correta": false
      },
      {
        "texto": "Introduzir objeto entre os dentes",
        "correta": false
      },
      {
        "texto": "Proteger contra trauma e observar a duração da crise",
        "correta": true
      },
      {
        "texto": "Oferecer líquido durante os movimentos convulsivos",
        "correta": false
      }
    ]
  },
  {
    "origemId": "fgv-macae-2026-014",
    "enunciado": "Qual medida é importante para prevenção de pneumonia associada à ventilação mecânica?",
    "explicacao": "Cuidados de higiene, elevação da cabeceira quando indicada, manejo adequado da via aérea e avaliação diária fazem parte das medidas preventivas.",
    "assunto": "Controle de Infecção",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Enfermeiro",
    "orgao": "Prefeitura de Macaé",
    "fonteUrl": "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    "alternativas": [
      {
        "texto": "Manter cabeceira baixa em todos os pacientes",
        "correta": false
      },
      {
        "texto": "Aplicar medidas de prevenção em conjunto e avaliar diariamente",
        "correta": true
      },
      {
        "texto": "Desconectar o circuito rotineiramente sem indicação",
        "correta": false
      },
      {
        "texto": "Evitar higiene oral",
        "correta": false
      }
    ]
  },
  {
    "origemId": "fgv-macae-2026-015",
    "enunciado": "Ao avaliar dor, qual princípio deve orientar o registro de enfermagem?",
    "explicacao": "A dor deve ser avaliada de forma sistemática, incluindo intensidade, localização, características, fatores associados e resposta às intervenções.",
    "assunto": "Avaliação da Dor",
    "dificuldade": "facil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Enfermeiro",
    "orgao": "Prefeitura de Macaé",
    "fonteUrl": "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    "alternativas": [
      {
        "texto": "Registrar apenas se o paciente solicitar analgésico",
        "correta": false
      },
      {
        "texto": "Caracterizar a dor e reavaliar após intervenções",
        "correta": true
      },
      {
        "texto": "Usar somente a impressão do profissional",
        "correta": false
      },
      {
        "texto": "Evitar escalas de avaliação",
        "correta": false
      }
    ]
  },
  {
    "origemId": "fgv-macae-2026-016",
    "enunciado": "Em paciente com hipoxemia, qual parâmetro deve ser interpretado junto com a oximetria de pulso?",
    "explicacao": "A oximetria deve ser correlacionada com quadro clínico, perfusão, frequência respiratória e possíveis limitações da medida.",
    "assunto": "Avaliação Respiratória",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Enfermeiro",
    "orgao": "Prefeitura de Macaé",
    "fonteUrl": "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    "alternativas": [
      {
        "texto": "Somente a temperatura ambiente",
        "correta": false
      },
      {
        "texto": "Quadro clínico e sinais de esforço respiratório",
        "correta": true
      },
      {
        "texto": "Apenas o peso corporal",
        "correta": false
      },
      {
        "texto": "Somente a idade",
        "correta": false
      }
    ]
  },
  {
    "origemId": "fgv-macae-2026-017",
    "enunciado": "Qual prática é adequada na prevenção de infecção urinária associada a cateter vesical?",
    "explicacao": "Evitar cateterização desnecessária e remover o dispositivo assim que não houver indicação reduz risco de infecção.",
    "assunto": "Infecção Urinária",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Enfermeiro",
    "orgao": "Prefeitura de Macaé",
    "fonteUrl": "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    "alternativas": [
      {
        "texto": "Manter cateter por conveniência da equipe",
        "correta": false
      },
      {
        "texto": "Reavaliar diariamente a indicação e remover precocemente",
        "correta": true
      },
      {
        "texto": "Abrir o sistema regularmente para coleta",
        "correta": false
      },
      {
        "texto": "Desconectar a bolsa para esvaziamento",
        "correta": false
      }
    ]
  },
  {
    "origemId": "fgv-macae-2026-018",
    "enunciado": "Na prevenção de eventos adversos, qual medida melhora a comunicação entre profissionais durante transferência de cuidado?",
    "explicacao": "Uma passagem de plantão estruturada reduz omissões e melhora continuidade e segurança.",
    "assunto": "Comunicação em Saúde",
    "dificuldade": "facil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Enfermeiro",
    "orgao": "Prefeitura de Macaé",
    "fonteUrl": "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    "alternativas": [
      {
        "texto": "Usar comunicação estruturada com informações essenciais",
        "correta": true
      },
      {
        "texto": "Evitar confirmar informações importantes",
        "correta": false
      },
      {
        "texto": "Transmitir apenas diagnósticos sem plano de cuidado",
        "correta": false
      },
      {
        "texto": "Substituir registros por mensagens informais",
        "correta": false
      }
    ]
  },
  {
    "origemId": "fgv-macae-2026-019",
    "enunciado": "Em paciente com risco de delirium, qual intervenção não farmacológica pode ajudar na prevenção?",
    "explicacao": "Orientação frequente, manutenção do ciclo sono-vigília, mobilização e uso de óculos ou aparelhos auditivos quando necessários ajudam a reduzir risco.",
    "assunto": "Saúde do Idoso",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Enfermeiro",
    "orgao": "Prefeitura de Macaé",
    "fonteUrl": "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    "alternativas": [
      {
        "texto": "Privação de sono para manter vigilância",
        "correta": false
      },
      {
        "texto": "Orientação, mobilização e preservação do sono",
        "correta": true
      },
      {
        "texto": "Restrição física rotineira",
        "correta": false
      },
      {
        "texto": "Manter o ambiente sem referências de tempo",
        "correta": false
      }
    ]
  },
  {
    "origemId": "fgv-macae-2026-020",
    "enunciado": "Ao cuidar de paciente com risco de suicídio, qual postura inicial é apropriada?",
    "explicacao": "Acolhimento sem julgamento, avaliação direta do risco, garantia de segurança e acionamento da rede assistencial são condutas fundamentais.",
    "assunto": "Saúde Mental",
    "dificuldade": "dificil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Enfermeiro",
    "orgao": "Prefeitura de Macaé",
    "fonteUrl": "https://conhecimento.fgv.br/concursos/prefeiturademacae26",
    "alternativas": [
      {
        "texto": "Evitar perguntar sobre ideação suicida",
        "correta": false
      },
      {
        "texto": "Acolher, avaliar risco diretamente e garantir segurança",
        "correta": true
      },
      {
        "texto": "Deixar o paciente sozinho para preservar privacidade",
        "correta": false
      },
      {
        "texto": "Minimizar falas sobre morte para reduzir ansiedade",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-001",
    "enunciado": "Paciente adulto chega à emergência com suspeita de sepse, pressão arterial reduzida, taquipneia e alteração do estado mental. Qual prioridade de enfermagem é mais adequada?",
    "explicacao": "Reconhecer precocemente sinais de disfunção orgânica, monitorar perfusão e acionar protocolo institucional favorece tratamento oportuno.",
    "assunto": "Sepse",
    "dificuldade": "dificil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Avaliar rapidamente perfusão, sinais vitais e acionar protocolo de sepse",
        "correta": true
      },
      {
        "texto": "Aguardar confirmação microbiológica antes de qualquer conduta",
        "correta": false
      },
      {
        "texto": "Priorizar apenas o controle da febre",
        "correta": false
      },
      {
        "texto": "Manter observação sem reavaliação frequente",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-002",
    "enunciado": "Na prevenção de infecção de corrente sanguínea associada a cateter venoso central, qual conjunto de medidas é mais adequado?",
    "explicacao": "Higiene das mãos, barreira máxima na inserção, antissepsia apropriada e revisão diária da necessidade do cateter são medidas centrais.",
    "assunto": "IRAS",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Troca diária do cateter independentemente da indicação",
        "correta": false
      },
      {
        "texto": "Higiene das mãos, técnica asséptica e retirada quando não houver indicação",
        "correta": true
      },
      {
        "texto": "Uso de antibiótico profilático contínuo",
        "correta": false
      },
      {
        "texto": "Manter curativo úmido para evitar ressecamento",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-003",
    "enunciado": "Em paciente com acidente vascular cerebral agudo, qual avaliação deve ser realizada precocemente antes da oferta de dieta por via oral?",
    "explicacao": "A avaliação da deglutição reduz risco de broncoaspiração em pacientes com AVC.",
    "assunto": "Neurologia",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Avaliação da deglutição",
        "correta": true
      },
      {
        "texto": "Teste de acuidade visual",
        "correta": false
      },
      {
        "texto": "Medida de circunferência abdominal",
        "correta": false
      },
      {
        "texto": "Avaliação dermatológica completa",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-004",
    "enunciado": "Paciente com insuficiência cardíaca apresenta ganho de 2 kg em curto período e edema periférico. Qual interpretação é mais provável?",
    "explicacao": "Ganho rápido de peso em insuficiência cardíaca pode refletir retenção hídrica e piora da congestão.",
    "assunto": "Cardiologia",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Redução do volume intravascular",
        "correta": false
      },
      {
        "texto": "Possível retenção hídrica",
        "correta": true
      },
      {
        "texto": "Melhora obrigatória da função cardíaca",
        "correta": false
      },
      {
        "texto": "Perda de massa muscular",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-005",
    "enunciado": "Na abordagem inicial ao paciente politraumatizado, qual princípio deve orientar a avaliação?",
    "explicacao": "A avaliação sistematizada prioriza ameaças imediatas à vida, seguindo via aérea, respiração, circulação e demais etapas.",
    "assunto": "Trauma",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Investigar primeiro histórico social completo",
        "correta": false
      },
      {
        "texto": "Priorizar ameaças imediatas à vida em sequência sistemática",
        "correta": true
      },
      {
        "texto": "Realizar curativos antes de avaliar respiração",
        "correta": false
      },
      {
        "texto": "Avaliar dor antes de garantir via aérea",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-006",
    "enunciado": "Qual achado é mais compatível com hipoperfusão periférica em paciente crítico?",
    "explicacao": "Extremidades frias, enchimento capilar prolongado e alteração do estado mental podem indicar redução da perfusão tecidual.",
    "assunto": "Terapia Intensiva",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Enchimento capilar prolongado",
        "correta": true
      },
      {
        "texto": "Pele quente com perfusão preservada",
        "correta": false
      },
      {
        "texto": "Diurese aumentada isoladamente",
        "correta": false
      },
      {
        "texto": "Apetite aumentado",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-007",
    "enunciado": "Em paciente sob ventilação mecânica, qual cuidado ajuda a prevenir pneumonia associada à ventilação?",
    "explicacao": "Elevação da cabeceira quando não contraindicada, higiene oral, manejo adequado da via aérea e avaliação diária fazem parte da prevenção.",
    "assunto": "Terapia Intensiva",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Manter decúbito totalmente horizontal em todos os casos",
        "correta": false
      },
      {
        "texto": "Aplicar medidas preventivas combinadas e reavaliar diariamente",
        "correta": true
      },
      {
        "texto": "Trocar o circuito a cada turno sem indicação",
        "correta": false
      },
      {
        "texto": "Evitar higiene oral",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-008",
    "enunciado": "Durante transfusão sanguínea, o paciente desenvolve febre, calafrios e dispneia. Qual deve ser a primeira conduta?",
    "explicacao": "Diante de suspeita de reação transfusional, a transfusão deve ser interrompida e o paciente avaliado imediatamente.",
    "assunto": "Hemoterapia",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Aumentar a velocidade da infusão",
        "correta": false
      },
      {
        "texto": "Interromper a transfusão e avaliar o paciente",
        "correta": true
      },
      {
        "texto": "Trocar apenas o equipo e continuar",
        "correta": false
      },
      {
        "texto": "Aguardar o término da bolsa",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-009",
    "enunciado": "Qual situação caracteriza maior risco para desenvolvimento de lesão por pressão?",
    "explicacao": "Imobilidade, perfusão reduzida, umidade e estado nutricional comprometido são fatores importantes de risco.",
    "assunto": "Segurança do Paciente",
    "dificuldade": "facil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Paciente independente e com mobilidade preservada",
        "correta": false
      },
      {
        "texto": "Paciente imóvel, com perfusão reduzida e umidade frequente",
        "correta": true
      },
      {
        "texto": "Paciente jovem que deambula sem auxílio",
        "correta": false
      },
      {
        "texto": "Paciente com pele íntegra e atividade habitual",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-010",
    "enunciado": "Em uma parada cardiorrespiratória intra-hospitalar, qual ação deve ocorrer sem demora após reconhecimento da ausência de respiração normal e pulso?",
    "explicacao": "O início imediato de compressões torácicas de alta qualidade é essencial até a chegada do desfibrilador e suporte avançado.",
    "assunto": "Ressuscitação Cardiopulmonar",
    "dificuldade": "facil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Iniciar compressões torácicas",
        "correta": true
      },
      {
        "texto": "Aguardar avaliação médica antes de tocar no paciente",
        "correta": false
      },
      {
        "texto": "Transportar o paciente antes de iniciar suporte",
        "correta": false
      },
      {
        "texto": "Administrar água por via oral",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-011",
    "enunciado": "Na suspeita de síndrome coronariana aguda, qual exame deve ser obtido precocemente quando disponível?",
    "explicacao": "O eletrocardiograma de 12 derivações é fundamental na avaliação inicial de dor torácica suspeita de origem isquêmica.",
    "assunto": "Cardiologia",
    "dificuldade": "facil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "ECG de 12 derivações",
        "correta": true
      },
      {
        "texto": "Espirometria",
        "correta": false
      },
      {
        "texto": "Ultrassonografia abdominal de rotina",
        "correta": false
      },
      {
        "texto": "Teste ergométrico durante dor intensa",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-012",
    "enunciado": "Paciente diabético consciente apresenta tremor, sudorese e glicemia de 54 mg/dL. Qual conduta inicial é adequada?",
    "explicacao": "Em paciente consciente e capaz de deglutir, carboidrato de absorção rápida é indicado, seguido de reavaliação.",
    "assunto": "Diabetes Mellitus",
    "dificuldade": "facil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Administrar insulina regular",
        "correta": false
      },
      {
        "texto": "Ofertar carboidrato de absorção rápida e reavaliar",
        "correta": true
      },
      {
        "texto": "Manter jejum",
        "correta": false
      },
      {
        "texto": "Aguardar melhora espontânea",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-013",
    "enunciado": "Em paciente com doença renal crônica, qual alteração eletrolítica pode representar risco de arritmia grave?",
    "explicacao": "A hipercalemia pode causar alterações de condução e arritmias potencialmente fatais.",
    "assunto": "Nefrologia",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Hipercalemia",
        "correta": true
      },
      {
        "texto": "Hipouricemia isolada",
        "correta": false
      },
      {
        "texto": "Hipocolesterolemia",
        "correta": false
      },
      {
        "texto": "Hipoalbuminemia leve isolada",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-014",
    "enunciado": "Em paciente com suspeita de delirium, qual característica favorece esse diagnóstico?",
    "explicacao": "Delirium costuma ter início agudo, curso flutuante e alterações de atenção e consciência.",
    "assunto": "Saúde do Idoso",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Início agudo e curso flutuante",
        "correta": true
      },
      {
        "texto": "Evolução lenta e estável por anos",
        "correta": false
      },
      {
        "texto": "Memória isoladamente alterada sem flutuação",
        "correta": false
      },
      {
        "texto": "Ausência completa de alteração de atenção",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-015",
    "enunciado": "Qual prática é recomendada na prevenção de erros de identificação do paciente?",
    "explicacao": "Utilizar pelo menos dois identificadores e conferir antes de procedimentos e administração de medicamentos reduz erros.",
    "assunto": "Segurança do Paciente",
    "dificuldade": "facil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Usar apenas o número do leito",
        "correta": false
      },
      {
        "texto": "Conferir ao menos dois identificadores antes do cuidado",
        "correta": true
      },
      {
        "texto": "Perguntar apenas o primeiro nome",
        "correta": false
      },
      {
        "texto": "Identificar somente na admissão",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-016",
    "enunciado": "Em paciente com risco de suicídio, qual abordagem inicial é mais segura?",
    "explicacao": "É apropriado perguntar diretamente sobre ideação, plano e meios, manter ambiente seguro e acionar suporte especializado.",
    "assunto": "Saúde Mental",
    "dificuldade": "dificil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Evitar falar sobre suicídio",
        "correta": false
      },
      {
        "texto": "Avaliar diretamente o risco e garantir segurança",
        "correta": true
      },
      {
        "texto": "Deixar o paciente sozinho",
        "correta": false
      },
      {
        "texto": "Minimizar as falas para reduzir ansiedade",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-017",
    "enunciado": "Em puérpera com sangramento vaginal intenso e sinais de instabilidade, qual prioridade é indicada?",
    "explicacao": "Hemorragia pós-parto é emergência obstétrica; reconhecimento rápido, suporte hemodinâmico e acionamento do protocolo são prioritários.",
    "assunto": "Saúde da Mulher",
    "dificuldade": "dificil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Aguardar involução uterina espontânea",
        "correta": false
      },
      {
        "texto": "Reconhecer emergência, monitorar e acionar protocolo de hemorragia",
        "correta": true
      },
      {
        "texto": "Orientar deambulação",
        "correta": false
      },
      {
        "texto": "Oferecer dieta antes da avaliação",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-018",
    "enunciado": "Em criança com desconforto respiratório, qual achado é sinal de maior gravidade?",
    "explicacao": "Cianose, esforço respiratório intenso e alteração do estado de consciência são sinais de gravidade.",
    "assunto": "Saúde da Criança",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Cianose e tiragem intensa",
        "correta": true
      },
      {
        "texto": "Coriza leve isolada",
        "correta": false
      },
      {
        "texto": "Apetite preservado",
        "correta": false
      },
      {
        "texto": "Espirros ocasionais",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-019",
    "enunciado": "Qual medida é apropriada para prevenção de infecção urinária associada a cateter vesical?",
    "explicacao": "Indicar cateter apenas quando necessário, manter sistema fechado e removê-lo precocemente são medidas preventivas.",
    "assunto": "IRAS",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Manter cateter por conveniência",
        "correta": false
      },
      {
        "texto": "Reavaliar indicação diariamente e remover quando possível",
        "correta": true
      },
      {
        "texto": "Abrir o sistema rotineiramente",
        "correta": false
      },
      {
        "texto": "Desconectar a bolsa para transporte",
        "correta": false
      }
    ]
  },
  {
    "origemId": "enare-ebserh-2026-020",
    "enunciado": "Na passagem de plantão, qual estratégia favorece a segurança do paciente?",
    "explicacao": "Comunicação estruturada e objetiva diminui omissões e melhora continuidade do cuidado.",
    "assunto": "Comunicação em Saúde",
    "dificuldade": "facil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "EBSERH / ENARE",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    "alternativas": [
      {
        "texto": "Transmitir apenas informações informais",
        "correta": false
      },
      {
        "texto": "Usar comunicação estruturada com dados essenciais",
        "correta": true
      },
      {
        "texto": "Evitar confirmar pendências",
        "correta": false
      },
      {
        "texto": "Omitir mudanças recentes para ganhar tempo",
        "correta": false
      }
    ]
  },
  {
    "origemId": "ufpa-residencia-2026-001",
    "enunciado": "Em programas de residência multiprofissional, qual característica melhor descreve a formação em serviço?",
    "explicacao": "A residência em saúde integra prática supervisionada, ensino e trabalho em regime intensivo, com atuação interprofissional.",
    "assunto": "Residência Multiprofissional",
    "dificuldade": "facil",
    "banca": "UFPA",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "Universidade Federal do Pará",
    "fonteUrl": "https://www.gov.br/ebserh/pt-br/hospitais-universitarios/regiao-norte/chu-ufpa/ensino-e-pesquisa/processo-seletivo/pss-multi-uni-2026/processo-seletivo-simplificado-residencia-multiprofissional-e-em-area-profissional-da-saude-do-ano-de-2026.pdf/@@download/file",
    "alternativas": [
      {
        "texto": "Formação exclusivamente teórica",
        "correta": false
      },
      {
        "texto": "Formação em serviço com prática supervisionada e integração multiprofissional",
        "correta": true
      },
      {
        "texto": "Curso de curta duração sem prática",
        "correta": false
      },
      {
        "texto": "Atividade voluntária sem supervisão",
        "correta": false
      }
    ]
  },
  {
    "origemId": "ufpa-residencia-2026-002",
    "enunciado": "Qual princípio do SUS sustenta a oferta de ações de saúde de acordo com diferentes necessidades dos usuários?",
    "explicacao": "Equidade busca reduzir desigualdades, oferecendo mais a quem mais necessita.",
    "assunto": "SUS",
    "dificuldade": "facil",
    "banca": "UFPA",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "Universidade Federal do Pará",
    "fonteUrl": "https://www.gov.br/ebserh/pt-br/hospitais-universitarios/regiao-norte/chu-ufpa/ensino-e-pesquisa/processo-seletivo/pss-multi-uni-2026/processo-seletivo-simplificado-residencia-multiprofissional-e-em-area-profissional-da-saude-do-ano-de-2026.pdf/@@download/file",
    "alternativas": [
      {
        "texto": "Equidade",
        "correta": true
      },
      {
        "texto": "Centralização",
        "correta": false
      },
      {
        "texto": "Privatização",
        "correta": false
      },
      {
        "texto": "Fragmentação",
        "correta": false
      }
    ]
  },
  {
    "origemId": "ufpa-residencia-2026-003",
    "enunciado": "Na clínica ampliada, qual postura da equipe é mais adequada?",
    "explicacao": "A clínica ampliada considera sujeito, contexto, trabalho em equipe e construção compartilhada do projeto terapêutico.",
    "assunto": "Saúde Coletiva",
    "dificuldade": "medio",
    "banca": "UFPA",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "Universidade Federal do Pará",
    "fonteUrl": "https://www.gov.br/ebserh/pt-br/hospitais-universitarios/regiao-norte/chu-ufpa/ensino-e-pesquisa/processo-seletivo/pss-multi-uni-2026/processo-seletivo-simplificado-residencia-multiprofissional-e-em-area-profissional-da-saude-do-ano-de-2026.pdf/@@download/file",
    "alternativas": [
      {
        "texto": "Focar somente no diagnóstico biomédico",
        "correta": false
      },
      {
        "texto": "Construir cuidado considerando contexto e diferentes saberes",
        "correta": true
      },
      {
        "texto": "Evitar participação do usuário",
        "correta": false
      },
      {
        "texto": "Restringir decisões a uma única profissão",
        "correta": false
      }
    ]
  },
  {
    "origemId": "ufpa-residencia-2026-004",
    "enunciado": "Em trabalho interprofissional, qual comportamento favorece cuidado seguro?",
    "explicacao": "Compartilhar objetivos, reconhecer competências profissionais e comunicar responsabilidades favorece coordenação do cuidado.",
    "assunto": "Trabalho Interprofissional",
    "dificuldade": "medio",
    "banca": "UFPA",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "Universidade Federal do Pará",
    "fonteUrl": "https://www.gov.br/ebserh/pt-br/hospitais-universitarios/regiao-norte/chu-ufpa/ensino-e-pesquisa/processo-seletivo/pss-multi-uni-2026/processo-seletivo-simplificado-residencia-multiprofissional-e-em-area-profissional-da-saude-do-ano-de-2026.pdf/@@download/file",
    "alternativas": [
      {
        "texto": "Evitar compartilhamento de informações",
        "correta": false
      },
      {
        "texto": "Definir objetivos comuns e comunicar responsabilidades",
        "correta": true
      },
      {
        "texto": "Duplicar intervenções sem coordenação",
        "correta": false
      },
      {
        "texto": "Impedir discussão entre categorias",
        "correta": false
      }
    ]
  },
  {
    "origemId": "ufpa-residencia-2026-005",
    "enunciado": "Qual indicador pode auxiliar na avaliação de qualidade assistencial em enfermagem hospitalar?",
    "explicacao": "Indicadores como incidência de lesão por pressão, quedas e eventos relacionados a dispositivos permitem monitorar qualidade e segurança.",
    "assunto": "Gestão em Enfermagem",
    "dificuldade": "medio",
    "banca": "UFPA",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "Universidade Federal do Pará",
    "fonteUrl": "https://www.gov.br/ebserh/pt-br/hospitais-universitarios/regiao-norte/chu-ufpa/ensino-e-pesquisa/processo-seletivo/pss-multi-uni-2026/processo-seletivo-simplificado-residencia-multiprofissional-e-em-area-profissional-da-saude-do-ano-de-2026.pdf/@@download/file",
    "alternativas": [
      {
        "texto": "Incidência de quedas e lesão por pressão",
        "correta": true
      },
      {
        "texto": "Cor das paredes da unidade",
        "correta": false
      },
      {
        "texto": "Número de elevadores",
        "correta": false
      },
      {
        "texto": "Quantidade de cadeiras da recepção",
        "correta": false
      }
    ]
  },
  {
    "origemId": "humap-ufms-enare-2026-001",
    "enunciado": "Em paciente crítico, qual parâmetro pode indicar redução de perfusão renal?",
    "explicacao": "A queda da diurese é um sinal relevante de hipoperfusão ou disfunção renal, devendo ser interpretada no contexto clínico.",
    "assunto": "Paciente Crítico",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "Humap-UFMS / EBSERH",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/realizar-residencias-multiprofissionais-e-em-areas-profissionais-da-saude",
    "alternativas": [
      {
        "texto": "Oligúria",
        "correta": true
      },
      {
        "texto": "Polifagia",
        "correta": false
      },
      {
        "texto": "Aumento da acuidade visual",
        "correta": false
      },
      {
        "texto": "Hipertricose",
        "correta": false
      }
    ]
  },
  {
    "origemId": "humap-ufms-enare-2026-002",
    "enunciado": "Qual alteração pode indicar deterioração respiratória em paciente crítico?",
    "explicacao": "Aumento do trabalho respiratório, queda da saturação e alteração do nível de consciência são sinais de deterioração.",
    "assunto": "Paciente Crítico",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "Humap-UFMS / EBSERH",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/realizar-residencias-multiprofissionais-e-em-areas-profissionais-da-saude",
    "alternativas": [
      {
        "texto": "Redução progressiva da saturação com esforço respiratório",
        "correta": true
      },
      {
        "texto": "Sono fisiológico noturno sem alterações",
        "correta": false
      },
      {
        "texto": "Apetite preservado",
        "correta": false
      },
      {
        "texto": "Diurese normal isolada",
        "correta": false
      }
    ]
  },
  {
    "origemId": "humap-ufms-enare-2026-003",
    "enunciado": "Em paciente com choque, qual objetivo geral da ressuscitação é prioritário?",
    "explicacao": "O objetivo é restabelecer perfusão e oxigenação tecidual adequadas enquanto se trata a causa do choque.",
    "assunto": "Choque",
    "dificuldade": "dificil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "Humap-UFMS / EBSERH",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/realizar-residencias-multiprofissionais-e-em-areas-profissionais-da-saude",
    "alternativas": [
      {
        "texto": "Restabelecer perfusão tecidual adequada",
        "correta": true
      },
      {
        "texto": "Normalizar apenas a temperatura corporal",
        "correta": false
      },
      {
        "texto": "Aumentar exclusivamente a frequência cardíaca",
        "correta": false
      },
      {
        "texto": "Reduzir diurese",
        "correta": false
      }
    ]
  },
  {
    "origemId": "humap-ufms-enare-2026-004",
    "enunciado": "Qual cuidado é importante no paciente em uso de drogas vasoativas por acesso venoso?",
    "explicacao": "Monitorização hemodinâmica e vigilância do acesso são essenciais, pois extravasamento e alterações de pressão podem causar complicações.",
    "assunto": "Terapia Intensiva",
    "dificuldade": "medio",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "Humap-UFMS / EBSERH",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/realizar-residencias-multiprofissionais-e-em-areas-profissionais-da-saude",
    "alternativas": [
      {
        "texto": "Monitorar pressão, perfusão e integridade do acesso",
        "correta": true
      },
      {
        "texto": "Interromper toda monitorização após estabilização inicial",
        "correta": false
      },
      {
        "texto": "Administrar sem bomba quando possível",
        "correta": false
      },
      {
        "texto": "Ignorar sinais de extravasamento",
        "correta": false
      }
    ]
  },
  {
    "origemId": "humap-ufms-enare-2026-005",
    "enunciado": "No cuidado ao paciente crítico, por que a reavaliação frequente é essencial?",
    "explicacao": "Pacientes críticos podem deteriorar rapidamente; reavaliações detectam mudanças e permitem intervenção precoce.",
    "assunto": "Paciente Crítico",
    "dificuldade": "facil",
    "banca": "FGV",
    "ano": 2026,
    "cargo": "Residência Multiprofissional - Enfermagem",
    "orgao": "Humap-UFMS / EBSERH",
    "fonteUrl": "https://www.gov.br/pt-br/servicos/realizar-residencias-multiprofissionais-e-em-areas-profissionais-da-saude",
    "alternativas": [
      {
        "texto": "Porque mudanças clínicas podem ocorrer rapidamente",
        "correta": true
      },
      {
        "texto": "Porque substitui todos os exames complementares",
        "correta": false
      },
      {
        "texto": "Porque elimina necessidade de comunicação",
        "correta": false
      },
      {
        "texto": "Porque evita qualquer registro de enfermagem",
        "correta": false
      }
    ]
  }
];

export async function sincronizarQuestoesConcursosPublicos() {
  const usuario = await prisma.usuario.findFirst({ orderBy: { id: "asc" } });

  if (!usuario) {
    console.warn("[questoes] Nenhum usuário disponível para inserir questões de concursos públicos.");
    return;
  }

  let disciplina = await prisma.disciplina.findFirst({
    where: {
      usuarioId: usuario.id,
      nome: { equals: "Enfermagem - Concursos", mode: "insensitive" }
    }
  });

  if (!disciplina) {
    disciplina = await prisma.disciplina.create({
      data: {
        nome: "Enfermagem - Concursos",
        usuarioId: usuario.id
      }
    });
  }

  let inseridas = 0;
  let existentes = 0;

  for (const questao of questoes) {
    const existente = await prisma.questao.findFirst({
      where: {
        usuarioId: usuario.id,
        fonte: FONTE,
        origemId: questao.origemId
      },
      select: { id: true }
    });

    if (existente) {
      existentes += 1;
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
        alternativas: {
          create: questao.alternativas
        }
      }
    });

    inseridas += 1;
  }

  console.log(
    "[questoes] Concursos públicos:",
    inseridas,
    "inseridas;",
    existentes,
    "já existentes."
  );
}
