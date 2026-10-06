import { IncomingMessage, ServerResponse } from "node:http";
import { prisma } from "../../lib/prisma";

type ApiResult = { status: number; data: unknown };

type ResearchItem = {
  title: string;
  url: string;
  snippet: string;
  domain: string;
  official: boolean;
  pdf: boolean;
  score: number;
};

const researchCache = new Map<string, { at: number; items: ResearchItem[] }>();

const OFFICIAL_SEEDS: ResearchItem[] = [
  {
    title: "ENARE — página oficial do exame",
    url: "https://www.gov.br/hubrasil/pt-br/ensino-e-pesquisa/exame-nacional-de-residencia-enare",
    snippet: "Portal oficial do ENARE com editais, edições e documentos da residência multiprofissional e uniprofissional.",
    domain: "gov.br",
    official: true,
    pdf: false,
    score: 100,
  },
  {
    title: "ENARE — conteúdo programático de Enfermagem",
    url: "https://www.gov.br/hubrasil/pt-br/ensino-e-pesquisa/exame-nacional-de-residencia-enare/edicoes-anteriores/2024-2025/anexos-residencia-multi-e-uniprofissional/anexo-iii-cha_enare_24_25_res_mult_uni_v-sgpos-09-07-2024.pdf",
    snippet: "Anexo oficial com conteúdos de Enfermagem: ética e bioética, processo de enfermagem/SAE, semiologia, fundamentos, biossegurança, CME, controle de infecção, administração e medicamentos.",
    domain: "gov.br",
    official: true,
    pdf: true,
    score: 99,
  },
  {
    title: "EBSERH / HU Brasil — Área Assistencial",
    url: "https://www.gov.br/hubrasil/pt-br/acesso-a-informacao/agentes-publicos/concursos-e-selecoes/concursos/2024/editais/editais-area-assistencial",
    snippet: "Página oficial dos editais da área assistencial do concurso nacional da EBSERH/HU Brasil.",
    domain: "gov.br",
    official: true,
    pdf: false,
    score: 98,
  },
  {
    title: "EBSERH / HU Brasil — Editais 2026",
    url: "https://www.gov.br/hubrasil/pt-br/acesso-a-informacao/agentes-publicos/concursos-e-selecoes/concursos/2026/editais",
    snippet: "Página oficial com editais e atualizações do concurso nacional da rede HU Brasil/EBSERH.",
    domain: "gov.br",
    official: true,
    pdf: false,
    score: 97,
  },
  {
    title: "Ministério da Saúde — Concursos e Seleções",
    url: "https://www.gov.br/saude/pt-br/acesso-a-informacao/concursos-e-selecoes",
    snippet: "Portal oficial do Ministério da Saúde para concursos, seleções, editais, cronogramas e resultados.",
    domain: "gov.br",
    official: true,
    pdf: false,
    score: 98,
  },
  {
    title: "Ministério da Saúde — CPNU 2025",
    url: "https://www.gov.br/saude/pt-br/acesso-a-informacao/concursos-e-selecoes/concursos/edital-cpnu-2025",
    snippet: "Página oficial do concurso unificado com vagas e especialidades relacionadas à saúde e enfermagem.",
    domain: "gov.br",
    official: true,
    pdf: false,
    score: 96,
  },
];

const STRUCTURE_REFERENCE_SEEDS: ResearchItem[] = [
  {
    title: "EBSERH Enfermagem — ciclo de revisão e simulados",
    url: "https://www.estrategiaconcursos.com.br/curso/ebserh-enfermagem-passo-estrategico-de-conhecimentos-especificos/",
    snippet: "Referência de estrutura de estudo com blocos de SUS, legislação, enfermagem, revisões e simulados intercalados.",
    domain: "estrategiaconcursos.com.br",
    official: false,
    pdf: false,
    score: 58,
  },
  {
    title: "ENARE / Residências — sequência de conteúdos de Enfermagem",
    url: "https://www.estrategiaconcursos.com.br/curso/ebserh-enare-residencias-multiprofissionais-enfermagem-pacote-202512231114/",
    snippet: "Referência de sequência pedagógica com legislação, procedimentos, doenças transmissíveis, urgência, saúde do idoso, saúde mental, imunização, epidemiologia, farmacologia, gestão e SAE.",
    domain: "estrategiaconcursos.com.br",
    official: false,
    pdf: false,
    score: 56,
  },
];

const OFFICIAL_DOMAINS = [
  "gov.br",
  "ebserh.gov.br",
  "hubrasil.gov.br",
  "fgv.br",
  "cebraspe.org.br",
  "ibfc.org.br",
  "institutoaocp.org.br",
  "edu.br",
];

function sendJson(response: ServerResponse, status: number, data: unknown) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(data));
}

function text(value: unknown, max = 5000) {
  return String(value ?? "").trim().slice(0, max);
}

function clamp(value: unknown, min: number, max: number) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

async function readJson(request: IncomingMessage) {
  return new Promise<any>((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_500_000) {
        reject(new Error("Requisição muito grande."));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("JSON inválido."));
      }
    });
    request.on("error", reject);
  });
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function unwrapDuckDuckGoUrl(raw: string) {
  try {
    const url = new URL(raw, "https://duckduckgo.com");
    const uddg = url.searchParams.get("uddg");
    return uddg ? decodeURIComponent(uddg) : url.href;
  } catch {
    return raw;
  }
}

function trustedDomain(hostname: string) {
  const host = hostname.toLowerCase().replace(/^www\./, "");
  return OFFICIAL_DOMAINS.some((domain) => host === domain || host.endsWith("." + domain));
}

function sourceScore(item: Omit<ResearchItem, "score">) {
  let score = item.official ? 50 : 0;
  const haystack = (item.title + " " + item.snippet + " " + item.url).toLowerCase();
  if (/edital|conte[uú]do program[aá]tico|anexo|prova|resid[eê]ncia|concurso/.test(haystack)) score += 22;
  if (/enfermagem|enare|ebserh/.test(haystack)) score += 18;
  if (/\.pdf($|\?)/i.test(item.url)) score += 8;
  return score;
}

function parseDuckDuckGo(html: string) {
  const items: ResearchItem[] = [];
  const resultRegex = /<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(?:<a[^>]+class="[^"]*result__snippet[^"]*"[^>]*>|<div[^>]+class="[^"]*result__snippet[^"]*"[^>]*>)([\s\S]*?)(?:<\/a>|<\/div>)/gi;
  let match: RegExpExecArray | null;
  while ((match = resultRegex.exec(html)) && items.length < 20) {
    const url = unwrapDuckDuckGoUrl(decodeHtml(match[1]));
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      continue;
    }
    if (!/^https?:$/.test(parsed.protocol)) continue;
    const title = decodeHtml(match[2]);
    const snippet = decodeHtml(match[3]);
    if (!title) continue;
    const itemBase = {
      title,
      url: parsed.href,
      snippet,
      domain: parsed.hostname.replace(/^www\./, ""),
      official: trustedDomain(parsed.hostname),
      pdf: /\.pdf($|\?)/i.test(parsed.href),
    };
    items.push({ ...itemBase, score: sourceScore(itemBase) });
  }
  return items;
}

async function searchWeb(query: string) {
  const key = query.toLowerCase();
  const cached = researchCache.get(key);
  if (cached && Date.now() - cached.at < 30 * 60 * 1000) return cached.items;

  const variants = [
    query + " enfermagem edital conteúdo programático",
    query + " enfermagem prova edital site:gov.br",
    query + " enfermagem residência edital site:edu.br",
  ];

  const responses = await Promise.allSettled(
    variants.map(async (variant) => {
      const url = "https://html.duckduckgo.com/html/?q=" + encodeURIComponent(variant);
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 CortexStudy/1.0",
          "Accept-Language": "pt-BR,pt;q=0.9",
        },
        signal: AbortSignal.timeout(9000),
      });
      if (!response.ok) return [];
      return parseDuckDuckGo(await response.text());
    })
  );

  const merged = new Map<string, ResearchItem>();

  const normalizedQuery = query.toLowerCase();
  for (const seed of [...OFFICIAL_SEEDS, ...STRUCTURE_REFERENCE_SEEDS]) {
    const relevant =
      normalizedQuery.includes("enare")
        ? /enare|residência/i.test(seed.title + " " + seed.snippet)
        : normalizedQuery.includes("ebserh")
          ? /ebserh|hu brasil/i.test(seed.title + " " + seed.snippet)
          : /minist|cpnu/i.test(normalizedQuery)
            ? /ministério da saúde|cpnu|sus/i.test(seed.title + " " + seed.snippet)
            : /enfermagem|saúde/i.test(seed.title + " " + seed.snippet);
    if (relevant) merged.set(seed.url, seed);
  }

  for (const result of responses) {
    if (result.status !== "fulfilled") continue;
    for (const item of result.value) {
      const previous = merged.get(item.url);
      if (!previous || item.score > previous.score) merged.set(item.url, item);
    }
  }

  const items = Array.from(merged.values())
    .filter((item) => item.official || item.domain === "estrategiaconcursos.com.br")
    .sort((a, b) => Number(b.official) - Number(a.official) || b.score - a.score)
    .slice(0, 18);

  researchCache.set(key, { at: Date.now(), items });
  return items;
}

type TopicTemplate = {
  tema: string;
  peso: number;
  grupo: string;
};

const EXAM_BLUEPRINTS: Record<string, { label: string; foco: string; sourceLabel: string; topics: TopicTemplate[] }> = {
  ENARE: {
    label: "ENARE — Enfermagem",
    foco: "Plano baseado na organização do pré-edital ENARE 2025 de Rômulo Passos, combinando SUS, conhecimentos específicos, revisão geral, bancos de questões e simulados por temas.",
    sourceLabel: "Rômulo Passos — Plano de Estudo ENARE 2025 Pré-edital",
    topics: [
      { tema: "Evolução Histórica das Políticas de Saúde", peso: 8, grupo: "Legislação do SUS" },
      { tema: "O SUS na Constituição Federal", peso: 9, grupo: "Legislação do SUS" },
      { tema: "Lei nº 8.080/90 e modificações", peso: 10, grupo: "Legislação do SUS" },
      { tema: "Controle social e Lei nº 8.142/90", peso: 9, grupo: "Legislação do SUS" },
      { tema: "Resolução nº 453/12 do CNS", peso: 7, grupo: "Legislação do SUS" },
      { tema: "Decreto nº 7.508/2011", peso: 9, grupo: "Legislação do SUS" },
      { tema: "Redes de Atenção à Saúde", peso: 9, grupo: "Legislação do SUS" },
      { tema: "Vigilância em Saúde", peso: 9, grupo: "Legislação do SUS" },
      { tema: "Doenças, agravos e eventos de notificação compulsória", peso: 9, grupo: "Legislação do SUS" },
      { tema: "Epidemiologia e indicadores epidemiológicos", peso: 9, grupo: "Legislação do SUS" },
      { tema: "Normas Operacionais do SUS", peso: 7, grupo: "Legislação do SUS" },
      { tema: "Pacto pela Saúde e financiamento do SUS", peso: 7, grupo: "Legislação do SUS" },
      { tema: "Lei Complementar nº 141/2012", peso: 7, grupo: "Legislação do SUS" },
      { tema: "Direitos dos usuários do SUS", peso: 7, grupo: "Legislação do SUS" },
      { tema: "Determinantes Sociais da Saúde", peso: 8, grupo: "Legislação do SUS" },
      { tema: "Sistemas de Informação em Saúde", peso: 8, grupo: "Legislação do SUS" },
      { tema: "Educação em Saúde", peso: 7, grupo: "Legislação do SUS" },
      { tema: "Trabalho em equipe no contexto da Saúde Pública", peso: 6, grupo: "Legislação do SUS" },
      { tema: "Política Nacional de Humanização", peso: 8, grupo: "Políticas do SUS" },
      { tema: "Política Nacional de Atenção Básica", peso: 9, grupo: "Políticas do SUS" },
      { tema: "Política Nacional de Promoção da Saúde", peso: 7, grupo: "Políticas do SUS" },
      { tema: "Política Nacional de Atenção Integral à Saúde da Criança", peso: 8, grupo: "Políticas do SUS" },
      { tema: "Saúde dos Povos Indígenas", peso: 6, grupo: "Políticas do SUS" },
      { tema: "Política Nacional de Saúde Mental", peso: 8, grupo: "Políticas do SUS" },
      { tema: "Política Nacional de Atenção às Urgências", peso: 9, grupo: "Políticas do SUS" },
      { tema: "Gestão Estratégica e Participativa do SUS", peso: 6, grupo: "Políticas do SUS" },
      { tema: "Saúde integral da população LGBT+", peso: 6, grupo: "Políticas do SUS" },
      { tema: "Saúde Integral da Mulher", peso: 8, grupo: "Políticas do SUS" },
      { tema: "Saúde da População Negra", peso: 6, grupo: "Políticas do SUS" },
      { tema: "Saúde da Pessoa Idosa", peso: 8, grupo: "Políticas do SUS" },
      { tema: "Atenção Domiciliar no SUS", peso: 7, grupo: "Políticas do SUS" },
      { tema: "Estudos Epidemiológicos", peso: 8, grupo: "Legislação do SUS" },
      { tema: "Segurança do Paciente - RDC nº 36/2013 e RDC nº 63/2011", peso: 9, grupo: "SUS e Qualidade" },
      { tema: "Planejamento, Avaliação e Monitoramento em Saúde", peso: 7, grupo: "SUS e Gestão" },
      { tema: "Temas de Atenção Básica à Saúde", peso: 8, grupo: "SUS e Atenção Básica" },
      { tema: "Bioética", peso: 7, grupo: "SUS e Ética" },
      { tema: "Práticas Baseadas em Evidências e Processo de Trabalho em Saúde", peso: 7, grupo: "SUS e Gestão" },

      { tema: "Saúde da Criança e do Adolescente", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "Imunização", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "Saúde da Mulher", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "Hipertensão Arterial", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Diabetes Mellitus", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Saúde do Idoso", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Fundamentos de Enfermagem", peso: 10, grupo: "Conhecimentos Específicos" },
      { tema: "Administração e Cálculo de Medicamentos", peso: 10, grupo: "Conhecimentos Específicos" },
      { tema: "Farmacologia", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "Enfermagem Cirúrgica", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Doenças Renais", peso: 7, grupo: "Conhecimentos Específicos" },
      { tema: "Doenças Respiratórias", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Doenças Cardiovasculares", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "Suporte Básico e Avançado de Vida", peso: 10, grupo: "Conhecimentos Específicos" },
      { tema: "Urgências Clínicas", peso: 10, grupo: "Conhecimentos Específicos" },
      { tema: "Urgências Traumáticas e Outros Temas", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "Acidentes com Animais Peçonhentos", peso: 6, grupo: "Conhecimentos Específicos" },
      { tema: "Unidade de Tratamento Intensivo (UTI)", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "Feridas e Curativos", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Saúde Mental", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Legislação de Enfermagem", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "CEPE e Bioética", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "SAE e Processo de Enfermagem", peso: 10, grupo: "Conhecimentos Específicos" },
      { tema: "Administração em Enfermagem", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Segurança do Paciente", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "Biossegurança e IRAS", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "CME e Resíduos Sólidos em Saúde", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Clínica Médica e Saúde do Adulto", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Enfermagem do Trabalho", peso: 6, grupo: "Conhecimentos Específicos" },
      { tema: "Saúde do Homem", peso: 6, grupo: "Conhecimentos Específicos" },
      { tema: "Anatomia, Fisiologia, Histologia, Parasitologia e Microbiologia", peso: 6, grupo: "Conhecimentos Específicos" },
      { tema: "Metodologia de Pesquisa em Saúde", peso: 6, grupo: "Conhecimentos Específicos" },
      { tema: "Violência Intrafamiliar e Vulnerabilidades", peso: 7, grupo: "Conhecimentos Específicos" },
      { tema: "Ensino ao Paciente e Autocuidado", peso: 6, grupo: "Conhecimentos Específicos" },
      { tema: "Exames Complementares dos Sistemas Orgânicos", peso: 6, grupo: "Conhecimentos Específicos" },
    ],
  },

  EBSERH: {
    label: "EBSERH — Enfermeiro",
    foco: "Plano baseado no pré-edital EBSERH 2026 de Rômulo Passos, com conhecimentos específicos, SUS, Português, Raciocínio Lógico/Matemático e Legislação da EBSERH.",
    sourceLabel: "Rômulo Passos — Plano de Estudo Enfermeiro EBSERH 2026 Pré-edital",
    topics: [
      { tema: "Saúde da Criança e do Adolescente", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "Imunização", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "Saúde da Mulher", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "Hipertensão Arterial", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Diabetes Mellitus", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Saúde do Idoso", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Lista de Doenças de Notificação Compulsória", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Dengue, Zika, Chikungunya e Febre do Oropouche", peso: 7, grupo: "Conhecimentos Específicos" },
      { tema: "Tuberculose", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Hanseníase", peso: 7, grupo: "Conhecimentos Específicos" },
      { tema: "Raiva Humana", peso: 6, grupo: "Conhecimentos Específicos" },
      { tema: "ISTs", peso: 7, grupo: "Conhecimentos Específicos" },
      { tema: "Doenças Infecciosas e Transmissíveis", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Fundamentos de Enfermagem", peso: 10, grupo: "Conhecimentos Específicos" },
      { tema: "Administração e Cálculo de Medicamentos", peso: 10, grupo: "Conhecimentos Específicos" },
      { tema: "Farmacologia", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "Enfermagem Cirúrgica", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Doenças Renais", peso: 7, grupo: "Conhecimentos Específicos" },
      { tema: "Doenças Respiratórias", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Doenças Cardiovasculares", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "Oncologia", peso: 7, grupo: "Conhecimentos Específicos" },
      { tema: "Suporte Básico e Avançado de Vida", peso: 10, grupo: "Conhecimentos Específicos" },
      { tema: "Urgências Clínicas", peso: 10, grupo: "Conhecimentos Específicos" },
      { tema: "Urgências Traumáticas e Outros Temas", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "Acidentes com Animais Peçonhentos", peso: 6, grupo: "Conhecimentos Específicos" },
      { tema: "Unidade de Tratamento Intensivo (UTI)", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "Transplantes de Órgãos", peso: 6, grupo: "Conhecimentos Específicos" },
      { tema: "Feridas e Curativos", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Saúde Mental", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Legislação de Enfermagem", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "CEPE e Bioética", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Teorias de Enfermagem", peso: 7, grupo: "Conhecimentos Específicos" },
      { tema: "SAE e Processo de Enfermagem", peso: 10, grupo: "Conhecimentos Específicos" },
      { tema: "Administração em Enfermagem", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Segurança do Paciente", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "Biossegurança e IRAS", peso: 9, grupo: "Conhecimentos Específicos" },
      { tema: "CME e Resíduos Sólidos em Saúde", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Clínica Médica e Saúde do Adulto", peso: 8, grupo: "Conhecimentos Específicos" },
      { tema: "Enfermagem do Trabalho", peso: 6, grupo: "Conhecimentos Específicos" },
      { tema: "Anatomia, Fisiologia, Histologia, Parasitologia e Microbiologia", peso: 6, grupo: "Conhecimentos Específicos" },
      { tema: "Metodologia de Pesquisa em Saúde", peso: 6, grupo: "Conhecimentos Específicos" },
      { tema: "Violência Intrafamiliar e Vulnerabilidades", peso: 7, grupo: "Conhecimentos Específicos" },
      { tema: "Ensino ao Paciente e Autocuidado", peso: 6, grupo: "Conhecimentos Específicos" },
      { tema: "Exames Complementares dos Sistemas Orgânicos", peso: 6, grupo: "Conhecimentos Específicos" },

      { tema: "Evolução Histórica das Políticas de Saúde", peso: 7, grupo: "Legislação do SUS" },
      { tema: "O SUS na Constituição Federal", peso: 9, grupo: "Legislação do SUS" },
      { tema: "Lei nº 8.080/90 e modificações", peso: 10, grupo: "Legislação do SUS" },
      { tema: "Controle social e Lei nº 8.142/90", peso: 9, grupo: "Legislação do SUS" },
      { tema: "Resolução nº 453/12 do CNS", peso: 7, grupo: "Legislação do SUS" },
      { tema: "Decreto nº 7.508/2011", peso: 9, grupo: "Legislação do SUS" },
      { tema: "Redes de Atenção à Saúde", peso: 8, grupo: "Legislação do SUS" },
      { tema: "Vigilância em Saúde", peso: 8, grupo: "Legislação do SUS" },
      { tema: "Notificação Compulsória", peso: 8, grupo: "Legislação do SUS" },
      { tema: "Epidemiologia e Indicadores Epidemiológicos", peso: 8, grupo: "Legislação do SUS" },
      { tema: "Normas Operacionais do SUS", peso: 6, grupo: "Legislação do SUS" },
      { tema: "Pacto pela Saúde e Financiamento do SUS", peso: 6, grupo: "Legislação do SUS" },
      { tema: "Lei Complementar nº 141/2012", peso: 6, grupo: "Legislação do SUS" },
      { tema: "Direitos dos Usuários do SUS", peso: 6, grupo: "Legislação do SUS" },
      { tema: "Determinantes Sociais da Saúde", peso: 7, grupo: "Legislação do SUS" },
      { tema: "Sistemas de Informação em Saúde", peso: 7, grupo: "Legislação do SUS" },
      { tema: "Educação em Saúde", peso: 6, grupo: "Legislação do SUS" },
      { tema: "Trabalho em Equipe na Saúde Pública", peso: 6, grupo: "Legislação do SUS" },
      { tema: "Política Nacional de Humanização", peso: 7, grupo: "Políticas do SUS" },
      { tema: "Política Nacional de Atenção Básica", peso: 8, grupo: "Políticas do SUS" },
      { tema: "Política Nacional de Promoção da Saúde", peso: 6, grupo: "Políticas do SUS" },
      { tema: "Saúde Integral da Criança", peso: 7, grupo: "Políticas do SUS" },
      { tema: "Saúde dos Povos Indígenas", peso: 5, grupo: "Políticas do SUS" },
      { tema: "Política Nacional de Saúde Mental", peso: 7, grupo: "Políticas do SUS" },
      { tema: "Política Nacional de Atenção às Urgências", peso: 8, grupo: "Políticas do SUS" },
      { tema: "Gestão Estratégica e Participativa do SUS", peso: 6, grupo: "Políticas do SUS" },
      { tema: "Saúde integral da população LGBT+", peso: 5, grupo: "Políticas do SUS" },
      { tema: "Política Nacional de Atenção Hospitalar - PNHOSP", peso: 7, grupo: "Políticas do SUS" },
      { tema: "Saúde Integral da Mulher", peso: 7, grupo: "Políticas do SUS" },
      { tema: "Política Nacional de Regulação do SUS", peso: 7, grupo: "Políticas do SUS" },
      { tema: "PNPIC", peso: 5, grupo: "Políticas do SUS" },
      { tema: "Saúde da População Negra", peso: 5, grupo: "Políticas do SUS" },
      { tema: "Redução da Morbimortalidade por Acidentes e Violências", peso: 5, grupo: "Políticas do SUS" },
      { tema: "Política de Redução de Danos", peso: 5, grupo: "Políticas do SUS" },
      { tema: "Saúde da Pessoa Idosa", peso: 7, grupo: "Políticas do SUS" },
      { tema: "Atenção Domiciliar no SUS", peso: 6, grupo: "Políticas do SUS" },
      { tema: "Estudos Epidemiológicos", peso: 7, grupo: "Legislação do SUS" },
      { tema: "Segurança do Paciente - RDC nº 36/2013 e RDC nº 63/2011", peso: 8, grupo: "SUS e Qualidade" },
      { tema: "Ciclo de Transmissão de Doenças", peso: 6, grupo: "SUS e Epidemiologia" },
      { tema: "Planejamento, Avaliação e Monitoramento em Saúde", peso: 6, grupo: "SUS e Gestão" },
      { tema: "Lei nº 8.689/93 - Extinção do INAMPS", peso: 5, grupo: "Legislação do SUS" },
      { tema: "Classificação Internacional de Doenças", peso: 5, grupo: "SUS e Epidemiologia" },
      { tema: "Temas de Atenção Básica à Saúde", peso: 7, grupo: "SUS e Atenção Básica" },
      { tema: "Bioética", peso: 6, grupo: "SUS e Ética" },
      { tema: "Hotelaria Hospitalar - Portaria SEI nº 142/2019", peso: 5, grupo: "EBSERH" },
      { tema: "Práticas Baseadas em Evidências e Processo de Trabalho em Saúde", peso: 6, grupo: "SUS e Gestão" },
      { tema: "Legislações Estaduais", peso: 4, grupo: "Legislação do SUS" },

      { tema: "Acentuação Gráfica", peso: 5, grupo: "Língua Portuguesa" },
      { tema: "Ortografia Oficial", peso: 5, grupo: "Língua Portuguesa" },
      { tema: "Semântica", peso: 5, grupo: "Língua Portuguesa" },
      { tema: "Classes Gramaticais", peso: 5, grupo: "Língua Portuguesa" },
      { tema: "Análise Sintática", peso: 6, grupo: "Língua Portuguesa" },
      { tema: "Sintaxe da Oração e do Período", peso: 6, grupo: "Língua Portuguesa" },
      { tema: "Pontuação", peso: 6, grupo: "Língua Portuguesa" },
      { tema: "Concordância Verbal", peso: 6, grupo: "Língua Portuguesa" },
      { tema: "Concordância Nominal", peso: 5, grupo: "Língua Portuguesa" },
      { tema: "Regência Verbo-Nominal", peso: 6, grupo: "Língua Portuguesa" },
      { tema: "Crase", peso: 6, grupo: "Língua Portuguesa" },
      { tema: "Colocação Pronominal", peso: 5, grupo: "Língua Portuguesa" },
      { tema: "Tipologia Textual", peso: 5, grupo: "Língua Portuguesa" },
      { tema: "Compreensão e Interpretação de Texto", peso: 8, grupo: "Língua Portuguesa" },
      { tema: "Coesão e Coerência Textuais", peso: 6, grupo: "Língua Portuguesa" },

      { tema: "Lógica Proposicional", peso: 6, grupo: "Raciocínio Lógico e Matemático" },
      { tema: "Lógica de Argumentação", peso: 5, grupo: "Raciocínio Lógico e Matemático" },
      { tema: "Raciocínio Analítico", peso: 5, grupo: "Raciocínio Lógico e Matemático" },
      { tema: "Raciocínio Sequencial", peso: 5, grupo: "Raciocínio Lógico e Matemático" },
      { tema: "Conjuntos", peso: 5, grupo: "Raciocínio Lógico e Matemático" },
      { tema: "Análise Combinatória", peso: 5, grupo: "Raciocínio Lógico e Matemático" },
      { tema: "Probabilidade", peso: 5, grupo: "Raciocínio Lógico e Matemático" },
      { tema: "Raciocínio Matemático", peso: 5, grupo: "Raciocínio Lógico e Matemático" },
      { tema: "Nivelamento Matemático", peso: 4, grupo: "Raciocínio Lógico e Matemático" },
      { tema: "Conjuntos Numéricos", peso: 4, grupo: "Raciocínio Lógico e Matemático" },
      { tema: "Fração", peso: 4, grupo: "Raciocínio Lógico e Matemático" },
      { tema: "Porcentagem", peso: 6, grupo: "Raciocínio Lógico e Matemático" },
      { tema: "Progressão Aritmética", peso: 4, grupo: "Raciocínio Lógico e Matemático" },
      { tema: "Progressão Geométrica", peso: 4, grupo: "Raciocínio Lógico e Matemático" },
      { tema: "Geometria Plana", peso: 4, grupo: "Raciocínio Lógico e Matemático" },
      { tema: "Legislação da EBSERH", peso: 9, grupo: "EBSERH" },
    ],
  },

  MINISTERIO_SAUDE: {
    label: "Ministério da Saúde — Enfermagem/Saúde",
    foco: "Concursos e seleções do Ministério da Saúde, usando o núcleo do plano Rômulo Passos para SUS e Enfermagem e complementação pelo edital oficial vigente.",
    sourceLabel: "Base Rômulo Passos (SUS + Enfermagem) complementada por edital oficial do Ministério da Saúde",
    topics: [
      { tema: "Lei nº 8.080/90 e modificações", peso: 10, grupo: "SUS" },
      { tema: "Lei nº 8.142/90 e controle social", peso: 9, grupo: "SUS" },
      { tema: "Constituição Federal e SUS", peso: 9, grupo: "SUS" },
      { tema: "Decreto nº 7.508/2011", peso: 9, grupo: "SUS" },
      { tema: "Política Nacional de Atenção Básica", peso: 9, grupo: "SUS" },
      { tema: "Redes de Atenção à Saúde", peso: 9, grupo: "SUS" },
      { tema: "Vigilância em Saúde", peso: 9, grupo: "SUS" },
      { tema: "Epidemiologia e Indicadores Epidemiológicos", peso: 9, grupo: "SUS" },
      { tema: "Sistemas de Informação em Saúde", peso: 8, grupo: "SUS" },
      { tema: "Planejamento, Avaliação e Monitoramento em Saúde", peso: 8, grupo: "SUS" },
      { tema: "Segurança do Paciente", peso: 8, grupo: "SUS" },
      { tema: "Práticas Baseadas em Evidências", peso: 7, grupo: "SUS" },
      { tema: "Fundamentos de Enfermagem", peso: 9, grupo: "Enfermagem" },
      { tema: "SAE e Processo de Enfermagem", peso: 10, grupo: "Enfermagem" },
      { tema: "Administração e Cálculo de Medicamentos", peso: 9, grupo: "Enfermagem" },
      { tema: "Farmacologia", peso: 8, grupo: "Enfermagem" },
      { tema: "Urgências Clínicas e Traumáticas", peso: 9, grupo: "Enfermagem" },
      { tema: "Suporte Básico e Avançado de Vida", peso: 9, grupo: "Enfermagem" },
      { tema: "Saúde da Mulher", peso: 8, grupo: "Enfermagem" },
      { tema: "Saúde da Criança e Adolescente", peso: 8, grupo: "Enfermagem" },
      { tema: "Saúde do Idoso", peso: 8, grupo: "Enfermagem" },
      { tema: "Saúde Mental", peso: 8, grupo: "Enfermagem" },
      { tema: "Legislação e Ética em Enfermagem", peso: 8, grupo: "Enfermagem" },
      { tema: "Biossegurança e IRAS", peso: 8, grupo: "Enfermagem" },
      { tema: "Administração em Enfermagem", peso: 7, grupo: "Enfermagem" },
    ],
  },
};

function inferKind(prova: string, explicit?: unknown) {
  const requested = text(explicit, 40).toUpperCase();
  if (requested === "ENARE" || requested === "EBSERH" || requested === "MINISTERIO_SAUDE") {
    return requested;
  }
  const normalized = prova.toUpperCase();
  if (normalized.includes("ENARE")) return "ENARE";
  if (normalized.includes("EBSERH") || normalized.includes("HU BRASIL")) return "EBSERH";
  if (normalized.includes("MINIST") || normalized.includes("CPNU")) return "MINISTERIO_SAUDE";
  return "ENARE";
}

function extractSourceTerms(items: ResearchItem[]) {
  const counts = new Map<string, number>();
  const dictionary = [
    "SUS",
    "saúde coletiva",
    "epidemiologia",
    "segurança do paciente",
    "urgência e emergência",
    "saúde da mulher",
    "saúde da criança",
    "saúde do adulto",
    "ética",
    "legislação",
    "farmacologia",
    "cálculo de medicamentos",
    "controle de infecção",
    "português",
    "EBSERH",
    "processo de enfermagem",
    "SAE",
    "semiologia",
    "biossegurança",
    "CME",
    "vigilância",
    "imunização",
    "atenção primária",
    "PNAB",
    "redes de atenção",
    "saúde mental",
  ];
  for (const item of items) {
    const haystack = (item.title + " " + item.snippet).toLowerCase();
    for (const term of dictionary) {
      if (haystack.includes(term.toLowerCase())) {
        counts.set(term, (counts.get(term) || 0) + 1);
      }
    }
  }
  return counts;
}

async function userWeakness(usuarioId: number) {
  const answers = await prisma.resposta.findMany({
    where: { usuarioId },
    orderBy: { respondidaAt: "desc" },
    take: 900,
    select: {
      correta: true,
      questao: {
        select: {
          tema: true,
          disciplina: { select: { nome: true } },
        },
      },
    },
  });

  const map = new Map<string, { total: number; wrong: number }>();
  for (const answer of answers) {
    const key = text(answer.questao.tema || answer.questao.disciplina?.nome || "", 120);
    if (!key) continue;
    const item = map.get(key) || { total: 0, wrong: 0 };
    item.total += 1;
    if (!answer.correta) item.wrong += 1;
    map.set(key, item);
  }

  return Array.from(map.entries())
    .filter(([, value]) => value.total >= 3)
    .map(([tema, value]) => ({
      tema,
      erro: value.wrong / value.total,
      total: value.total,
    }))
    .sort((a, b) => b.erro - a.erro)
    .slice(0, 12);
}

function similarity(a: string, b: string) {
  const A = a.toLowerCase();
  const B = b.toLowerCase();
  if (A.includes(B) || B.includes(A)) return 1;
  const words = A.split(/\W+/).filter((word) => word.length >= 4);
  return words.some((word) => B.includes(word)) ? 0.65 : 0;
}

function planTopics(
  prova: string,
  sources: ResearchItem[],
  dificuldades: string[],
  prioridades: string[],
  weakness: Awaited<ReturnType<typeof userWeakness>>,
  explicitKind?: unknown
) {
  const kind = inferKind(prova, explicitKind);
  const sourceTerms = extractSourceTerms(sources);
  const blueprint = EXAM_BLUEPRINTS[kind] || EXAM_BLUEPRINTS.ENARE;
  const base = blueprint.topics.map((item) => ({ ...item }));

  for (const [term, count] of sourceTerms) {
    const found = base.find((item) => similarity(item.tema, term) > 0);
    if (found) found.peso += Math.min(3, count);
  }

  return base
    .map((item) => {
      let score = item.peso;
      if (prioridades.some((term) => similarity(item.tema, term) > 0)) score += 5;
      if (dificuldades.some((term) => similarity(item.tema, term) > 0)) score += 4;
      const weak = weakness.find((row) => similarity(item.tema, row.tema) > 0);
      if (weak) score += Math.round(weak.erro * 7);
      return { tema: item.tema, score, grupo: item.grupo };
    })
    .sort((a, b) => b.score - a.score);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function isoDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

function generateTasks(
  input: any,
  topics: Array<{ tema: string; score: number; grupo?: string }>
) {
  const hoursPerDay = clamp(input.horasPorDia, 0.5, 12);
  const daysPerWeek = Math.round(clamp(input.diasPorSemana, 1, 7));
  const examDateRaw = text(input.dataProva, 30);
  const now = new Date();
  const defaultEnd = new Date(now);
  defaultEnd.setDate(defaultEnd.getDate() + 84);
  const examDate = examDateRaw ? new Date(examDateRaw + "T12:00:00") : defaultEnd;
  const totalDays = Math.max(
    14,
    Math.min(240, Math.ceil((examDate.getTime() - now.getTime()) / 86400000))
  );

  const studyWeekdays = new Set<number>();
  for (let i = 0; i < daysPerWeek; i += 1) studyWeekdays.add((1 + i) % 7);

  const tasks: Array<any> = [];
  const minutesPerDay = Math.round(hoursPerDay * 60);
  const slotsPerDay = Math.max(2, Math.min(5, Math.round(minutesPerDay / 45)));
  const finalWindow = Math.min(28, Math.max(14, Math.round(totalDays * 0.2)));
  const consolidationStart = Math.round(totalDays * 0.5);
  const recentTopics: string[] = [];
  let topicCursor = 0;
  let studyIndex = 0;

  const pickTopic = (offset = 0) =>
    topics[(topicCursor + offset) % Math.max(1, topics.length)] ||
    { tema: "SUS e conhecimentos de Enfermagem", score: 1, grupo: "geral" };

  for (let dayOffset = 0; dayOffset <= totalDays; dayOffset += 1) {
    const date = new Date(now);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + dayOffset);

    if (!studyWeekdays.has(date.getDay())) {
      if (dayOffset > 0 && dayOffset % 7 === 0) {
        tasks.push({
          data: isoDay(date),
          tipo: "DESCANSO",
          titulo: "Descanso programado",
          tema: null,
          duracaoMinutos: 0,
          metaValor: 0,
          ordem: 1,
        });
      }
      continue;
    }

    studyIndex += 1;
    const daysLeft = Math.max(0, totalDays - dayOffset);
    const phase =
      daysLeft <= finalWindow ? "RETA_FINAL" :
      dayOffset >= consolidationStart ? "CONSOLIDACAO" :
      "BASE";

    const dailyMinutes = Math.max(30, minutesPerDay);
    const slotDuration = Math.max(20, Math.floor(dailyMinutes / slotsPerDay));
    const isWeeklySimulation = studyIndex % Math.max(5, daysPerWeek) === 0;
    const isFullSimulation =
      phase === "RETA_FINAL" && studyIndex % Math.max(3, Math.ceil(daysPerWeek / 2)) === 0;

    const dayTasks: Array<any> = [];

    for (let slot = 0; slot < slotsPerDay; slot += 1) {
      let tipo = "TEORIA";
      let titulo = "Estudo teórico orientado";
      let topic = pickTopic(slot);

      if (phase === "BASE") {
        if (slot === 1) {
          tipo = "QUESTOES";
          titulo = "Questões do assunto estudado";
        } else if (slot >= 2) {
          tipo = "REVISAO";
          titulo = "Revisão 24h / 7 dias";
          const reviewTopic = recentTopics[Math.max(0, recentTopics.length - 2 - slot)] || topic.tema;
          topic = { ...topic, tema: reviewTopic };
        }
      } else if (phase === "CONSOLIDACAO") {
        if (slot === 0) {
          tipo = "QUESTOES";
          titulo = "Bloco dirigido de questões";
        } else if (slot === 1) {
          tipo = "REVISAO";
          titulo = "Revisão por erros e pontos fracos";
        } else if (slot === slotsPerDay - 1 && isWeeklySimulation) {
          tipo = "SIMULADO";
          titulo = "Mini simulado temático";
        } else {
          tipo = slot % 2 === 0 ? "TEORIA" : "QUESTOES";
          titulo = tipo === "TEORIA" ? "Teoria de reforço" : "Questões de consolidação";
        }
      } else {
        if (isFullSimulation && slot === 0) {
          tipo = "SIMULADO";
          titulo = "Simulado de reta final";
        } else if (slot === 0) {
          tipo = "QUESTOES";
          titulo = "Questões de alta incidência";
        } else {
          tipo = "REVISAO";
          titulo = slot === 1 ? "Caderno de erros" : "Revisão rápida de alta prioridade";
        }
      }

      const duration =
        tipo === "SIMULADO"
          ? Math.max(60, slotDuration)
          : slotDuration;

      dayTasks.push({
        data: isoDay(date),
        tipo,
        titulo,
        tema: topic.tema,
        duracaoMinutos: duration,
        metaValor:
          tipo === "QUESTOES"
            ? Math.max(12, Math.round(duration / 2))
            : tipo === "SIMULADO"
              ? (phase === "RETA_FINAL" ? 50 : 25)
              : duration,
        ordem: slot + 1,
        fase: phase,
      });
    }

    tasks.push(...dayTasks);

    const primaryTopic = pickTopic(0).tema;
    recentTopics.push(primaryTopic);
    if (recentTopics.length > 24) recentTopics.shift();

    topicCursor += phase === "BASE" ? Math.max(1, slotsPerDay - 1) : 1;
  }

  return tasks.slice(0, 760);
}

async function research(url: URL): Promise<ApiResult> {
  const query = text(url.searchParams.get("q"), 180);
  if (!query) return { status: 400, data: { error: "Informe a prova ou seleção." } };
  const items = await searchWeb(query);
  return {
    status: 200,
    data: {
      query,
      items,
      policy: "Editais e portais oficiais definem o conteúdo; referências especializadas servem apenas para organizar ciclos, revisões e simulados.",
    },
  };
}

async function syncTodayTaskProgress(
  usuarioId: number,
  tasks: Array<{
    id: number;
    tipo: string;
    tema: string | null;
    metaValor: number;
    concluida: boolean;
    data: Date;
  }>
) {
  const todayStart = startOfToday();
  const tomorrow = new Date(todayStart);
  tomorrow.setDate(tomorrow.getDate() + 1);

  for (const task of tasks) {
    if (task.concluida || !task.tema) continue;

    if (task.tipo === "QUESTOES") {
      const count = await prisma.resposta.count({
        where: {
          usuarioId,
          respondidaAt: { gte: todayStart, lt: tomorrow },
          questao: {
            OR: [
              { tema: { contains: task.tema, mode: "insensitive" } },
              { disciplina: { nome: { contains: task.tema, mode: "insensitive" } } },
            ],
          },
        },
      });

      const target = Math.max(1, task.metaValor || 10);
      const progress = Math.min(100, Math.round((count / target) * 100));
      if (progress > 0) {
        await prisma.cronogramaTarefa.update({
          where: { id: task.id },
          data: {
            progresso: progress,
            concluida: progress >= 100,
            concluidaAt: progress >= 100 ? new Date() : null,
          },
        });
      }
    }

    if (task.tipo === "TEORIA") {
      const watched = await prisma.aulaEstado.findFirst({
        where: {
          usuarioId,
          lastWatchedAt: { gte: todayStart, lt: tomorrow },
          category: { contains: task.tema, mode: "insensitive" },
          watchedSeconds: { gt: 0 },
        },
        orderBy: { lastWatchedAt: "desc" },
      });

      if (watched) {
        const targetSeconds = Math.max(10, task.metaValor || 30) * 60;
        const progress = Math.min(
          100,
          Math.round((watched.watchedSeconds / targetSeconds) * 100)
        );
        await prisma.cronogramaTarefa.update({
          where: { id: task.id },
          data: {
            progresso: progress,
            concluida: progress >= 80 || watched.completed,
            concluidaAt: progress >= 80 || watched.completed ? new Date() : null,
          },
        });
      }
    }
  }
}

async function dashboard(usuarioId: number): Promise<ApiResult> {
  const schedule = await prisma.cronogramaEstudo.findFirst({
    where: { usuarioId, ativo: true },
    orderBy: { updatedAt: "desc" },
    include: {
      tarefas: { orderBy: [{ data: "asc" }, { ordem: "asc" }] },
      fontes: { orderBy: { score: "desc" } },
    },
  });

  if (!schedule) return { status: 200, data: { schedule: null } };

  const now = new Date();
  const today = isoDay(now);

  const tasksForToday = schedule.tarefas.filter(
    (task) => isoDay(task.data) === today
  );
  await syncTodayTaskProgress(usuarioId, tasksForToday);

  const refreshedTasks = tasksForToday.length
    ? await prisma.cronogramaTarefa.findMany({
        where: { cronogramaId: schedule.id },
        orderBy: [{ data: "asc" }, { ordem: "asc" }],
      })
    : schedule.tarefas;

  const tasks = refreshedTasks;
  const completed = tasks.filter((task) => task.concluida).length;
  const studyTasks = tasks.filter((task) => task.tipo !== "DESCANSO");

  const upcoming = tasks.filter((task) => isoDay(task.data) >= today).slice(0, 45);
  const todayTasks = tasks.filter((task) => isoDay(task.data) === today);

  return {
    status: 200,
    data: {
      schedule: {
        ...schedule,
        tarefas: undefined,
        fontes: schedule.fontes,
      },
      stats: {
        total: studyTasks.length,
        completed,
        percent: studyTasks.length ? Math.round((completed / studyTasks.length) * 100) : 0,
        todayCompleted: todayTasks.filter((task) => task.concluida).length,
        todayTotal: todayTasks.length,
      },
      todayTasks,
      upcoming,
    },
  };
}

async function generate(usuarioId: number, body: any): Promise<ApiResult> {
  const prova = text(body.prova, 180);
  if (!prova) return { status: 400, data: { error: "Informe a prova desejada." } };

  const sourceItems: ResearchItem[] = Array.isArray(body.sources)
    ? body.sources.slice(0, 20).map((item: any) => ({
        title: text(item.title, 500),
        url: text(item.url, 1200),
        snippet: text(item.snippet, 2000),
        domain: text(item.domain, 220),
        official: Boolean(item.official),
        pdf: Boolean(item.pdf),
        score: Number(item.score || 0),
      }))
    : await searchWeb(prova);

  const dificuldades = Array.isArray(body.dificuldades) ? body.dificuldades.map((x: unknown) => text(x, 120)).filter(Boolean) : [];
  const prioridades = Array.isArray(body.prioridades) ? body.prioridades.map((x: unknown) => text(x, 120)).filter(Boolean) : [];
  const weakness = await userWeakness(usuarioId);
  const kind = inferKind(prova, body.tipoProva);
  const blueprint = EXAM_BLUEPRINTS[kind] || EXAM_BLUEPRINTS.ENARE;
  const topics = planTopics(prova, sourceItems, dificuldades, prioridades, weakness, kind);
  const tasks = generateTasks(body, topics);

  await prisma.cronogramaEstudo.updateMany({
    where: { usuarioId, ativo: true },
    data: { ativo: false },
  });

  const schedule = await prisma.cronogramaEstudo.create({
    data: {
      usuarioId,
      prova,
      tipoProva: kind,
      dataProva: body.dataProva ? new Date(String(body.dataProva) + "T12:00:00") : null,
      horasPorDia: clamp(body.horasPorDia, 0.5, 12),
      diasPorSemana: Math.round(clamp(body.diasPorSemana, 1, 7)),
      nivel: text(body.nivel, 40) || "INTERMEDIARIO",
      dificuldades,
      prioridades,
      estrategia: {
        algoritmo: "matriz da prova + fontes oficiais + incidência + dificuldade + histórico + proximidade",
        provaBase: blueprint.label,
        foco: blueprint.foco,
        referenciaEstrutural: blueprint.sourceLabel,
        fases: ["BASE", "CONSOLIDACAO", "RETA_FINAL"],
        revisoes: ["estudo inicial", "revisão", "simulados por temas", "banco de questões"],
        bancos:
          kind === "EBSERH"
            ? ["Geral Enfermagem", "Legislação do SUS", "FGV", "VUNESP", "EBSERH", "IBFC", "AOCP", "CEBRASPE"]
            : kind === "ENARE"
              ? ["Geral Enfermagem", "Legislação do SUS", "Residências", "FGV"]
              : ["Geral Enfermagem", "Legislação do SUS"],
        temas: topics.slice(0, 40),
        fraquezasDetectadas: weakness,
      },
      fontes: {
        create: sourceItems.slice(0, 14).map((item) => ({
          titulo: item.title,
          url: item.url,
          dominio: item.domain,
          resumo: item.snippet || null,
          oficial: item.official,
          pdf: item.pdf,
          score: item.score,
        })),
      },
      tarefas: {
        create: tasks.map((task) => ({
          data: new Date(task.data + "T12:00:00"),
          tipo: task.tipo,
          titulo: task.titulo,
          tema: task.tema,
          duracaoMinutos: task.duracaoMinutos,
          metaValor: task.metaValor,
          ordem: task.ordem,
        })),
      },
    },
    include: { fontes: true },
  });

  return {
    status: 201,
    data: {
      scheduleId: schedule.id,
      tipoProva: kind,
      blueprint: { label: blueprint.label, foco: blueprint.foco },
      topics: topics.slice(0, 16),
      sources: schedule.fontes,
    },
  };
}

async function updateTask(usuarioId: number, request: IncomingMessage): Promise<ApiResult> {
  const body = await readJson(request);
  const taskId = Number(body.taskId);
  if (!taskId) return { status: 400, data: { error: "Tarefa inválida." } };

  const task = await prisma.cronogramaTarefa.findFirst({
    where: { id: taskId, cronograma: { usuarioId } },
  });
  if (!task) return { status: 404, data: { error: "Tarefa não encontrada." } };

  const updated = await prisma.cronogramaTarefa.update({
    where: { id: taskId },
    data: {
      concluida: typeof body.completed === "boolean" ? body.completed : task.concluida,
      progresso: body.progress === undefined ? task.progresso : Math.round(clamp(body.progress, 0, 100)),
      concluidaAt: body.completed === true ? new Date() : body.completed === false ? null : task.concluidaAt,
    },
  });

  return { status: 200, data: updated };
}

export async function atenderCronograma(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL,
  usuarioId: number
) {
  try {
    const path = url.pathname;
    let result: ApiResult;

    if (path === "/api/cronograma/research" && request.method === "GET") {
      result = await research(url);
    } else if (path === "/api/cronograma/dashboard" && request.method === "GET") {
      result = await dashboard(usuarioId);
    } else if (path === "/api/cronograma/generate" && request.method === "POST") {
      result = await generate(usuarioId, await readJson(request));
    } else if (path === "/api/cronograma/task" && request.method === "PATCH") {
      result = await updateTask(usuarioId, request);
    } else {
      result = { status: 404, data: { error: "Rota de cronograma não encontrada." } };
    }

    sendJson(response, result.status, result.data);
  } catch (error) {
    console.error("[cronograma]", error);
    sendJson(response, 500, { error: "Não foi possível concluir esta ação do cronograma." });
  }
}
