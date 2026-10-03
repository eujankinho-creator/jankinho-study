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
