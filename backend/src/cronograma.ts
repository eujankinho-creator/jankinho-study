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
    title: "Exame Nacional de Residência (Enare) — HU Brasil",
    url: "https://www.gov.br/hubrasil/pt-br/ensino-e-pesquisa/exame-nacional-de-residencia-enare",
    snippet: "Página oficial do Enare com edições, editais e informações para residência multiprofissional e uniprofissional.",
    domain: "gov.br",
    official: true,
    pdf: false,
    score: 96,
  },
  {
    title: "Inscrever-se no Exame Nacional de Residência — gov.br",
    url: "https://www.gov.br/pt-br/servicos/inscrever-se-no-exame-nacional-de-residencia-enare-candidato",
    snippet: "Serviço oficial com acesso aos editais e etapas do Enare.",
    domain: "gov.br",
    official: true,
    pdf: false,
    score: 94,
  },
  {
    title: "Concursos EBSERH / HU Brasil — Editais",
    url: "https://www.gov.br/hubrasil/pt-br/acesso-a-informacao/agentes-publicos/concursos-e-selecoes/concursos/2026/editais",
    snippet: "Página oficial de editais nacionais da rede de hospitais universitários.",
    domain: "gov.br",
    official: true,
    pdf: false,
    score: 92,
  },
  {
    title: "Residência em Área Profissional da Saúde — Ministério da Saúde",
    url: "https://www.gov.br/saude/pt-br/composicao/sgtes/residencias-em-saude/residencia-em-area-profissional-da-saude",
    snippet: "Referência oficial do Ministério da Saúde sobre residências multiprofissionais e uniprofissionais.",
    domain: "gov.br",
    official: true,
    pdf: false,
    score: 90,
  }
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
  for (const seed of OFFICIAL_SEEDS) {
    const relevant =
      normalizedQuery.includes("enare")
        ? /enare|residência/i.test(seed.title + " " + seed.snippet)
        : normalizedQuery.includes("ebserh")
          ? /ebserh|concurso/i.test(seed.title + " " + seed.snippet)
          : /resid|enfermagem/i.test(normalizedQuery)
            ? /residência|enare|ministério da saúde/i.test(seed.title + " " + seed.snippet)
            : false;
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
    .filter((item) => item.official)
    .sort((a, b) => b.score - a.score)
    .slice(0, 18);

  researchCache.set(key, { at: Date.now(), items });
  return items;
}

const TEMPLATES: Record<string, Array<{ tema: string; peso: number; tipo?: string }>> = {
  ENARE: [
    { tema: "SUS e políticas públicas de saúde", peso: 10 },
    { tema: "Saúde coletiva e epidemiologia", peso: 9 },
    { tema: "Fundamentos e processo de enfermagem", peso: 9 },
    { tema: "Saúde do adulto e do idoso", peso: 9 },
    { tema: "Urgência e emergência", peso: 8 },
    { tema: "Saúde da mulher", peso: 8 },
    { tema: "Saúde da criança e do adolescente", peso: 8 },
    { tema: "Ética, legislação e segurança do paciente", peso: 7 },
    { tema: "Farmacologia e cálculo de medicamentos", peso: 7 },
    { tema: "Controle de infecções e biossegurança", peso: 7 },
  ],
  EBSERH: [
    { tema: "Conhecimentos específicos de enfermagem", peso: 10 },
    { tema: "SUS e legislação em saúde", peso: 9 },
    { tema: "Legislação e regimento EBSERH", peso: 9 },
    { tema: "Segurança do paciente", peso: 8 },
    { tema: "Urgência e emergência", peso: 8 },
    { tema: "Português e interpretação de texto", peso: 6 },
    { tema: "Ética e legislação profissional", peso: 7 },
    { tema: "Controle de infecções", peso: 7 },
  ],
  RESIDENCIA: [
    { tema: "SUS e saúde coletiva", peso: 9 },
    { tema: "Processo de enfermagem e SAE", peso: 9 },
    { tema: "Semiologia e semiotécnica", peso: 9 },
    { tema: "Saúde do adulto", peso: 8 },
    { tema: "Urgência e emergência", peso: 8 },
    { tema: "Saúde da mulher", peso: 7 },
    { tema: "Saúde da criança", peso: 7 },
    { tema: "Ética e legislação", peso: 6 },
  ],
  CONCURSO: [
    { tema: "Conhecimentos específicos de enfermagem", peso: 10 },
    { tema: "SUS e políticas de saúde", peso: 9 },
    { tema: "Português", peso: 6 },
    { tema: "Ética e legislação profissional", peso: 7 },
    { tema: "Saúde coletiva", peso: 8 },
    { tema: "Urgência e emergência", peso: 8 },
    { tema: "Segurança do paciente e controle de infecção", peso: 7 },
  ],
};

function inferKind(prova: string) {
  const normalized = prova.toUpperCase();
  if (normalized.includes("ENARE") || normalized.includes("ENAMED")) return "ENARE";
  if (normalized.includes("EBSERH")) return "EBSERH";
  if (normalized.includes("RESID")) return "RESIDENCIA";
  return "CONCURSO";
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
  weakness: Awaited<ReturnType<typeof userWeakness>>
) {
  const kind = inferKind(prova);
  const sourceTerms = extractSourceTerms(sources);
  const base = (TEMPLATES[kind] || TEMPLATES.CONCURSO).map((item) => ({ ...item }));

  for (const [term, count] of sourceTerms) {
    const found = base.find((item) => similarity(item.tema, term) > 0);
    if (found) found.peso += Math.min(4, count);
    else base.push({ tema: term, peso: 6 + Math.min(3, count) });
  }

  return base
    .map((item) => {
      let score = item.peso;
      if (prioridades.some((term) => similarity(item.tema, term) > 0)) score += 5;
      if (dificuldades.some((term) => similarity(item.tema, term) > 0)) score += 4;
      const weak = weakness.find((row) => similarity(item.tema, row.tema) > 0);
      if (weak) score += Math.round(weak.erro * 6);
      return { tema: item.tema, score };
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

function generateTasks(input: any, topics: Array<{ tema: string; score: number }>) {
  const hoursPerDay = clamp(input.horasPorDia, 0.5, 12);
  const daysPerWeek = Math.round(clamp(input.diasPorSemana, 1, 7));
  const examDateRaw = text(input.dataProva, 30);
  const now = new Date();
  const defaultEnd = new Date(now);
  defaultEnd.setDate(defaultEnd.getDate() + 56);
  const examDate = examDateRaw ? new Date(examDateRaw + "T12:00:00") : defaultEnd;
  const maxDays = 180;
  const totalDays = Math.max(7, Math.min(maxDays, Math.ceil((examDate.getTime() - now.getTime()) / 86400000)));

  const studyWeekdays = new Set<number>();
  for (let i = 0; i < daysPerWeek; i += 1) studyWeekdays.add((1 + i) % 7);

  const tasks: Array<any> = [];
  const minutesPerDay = Math.round(hoursPerDay * 60);
  const slotsPerDay = Math.max(2, Math.min(5, Math.round(minutesPerDay / 45)));
  let topicCursor = 0;
  let studyIndex = 0;

  for (let dayOffset = 0; dayOffset <= totalDays; dayOffset += 1) {
    const date = new Date(now);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + dayOffset);

    if (!studyWeekdays.has(date.getDay())) {
      if (dayOffset > 0 && dayOffset % 7 === 0) {
        tasks.push({
          data: isoDay(date),
          tipo: "DESCANSO",
          titulo: "Descanso e recuperação",
          tema: null,
          duracaoMinutos: 0,
          metaValor: 0,
          ordem: 1,
        });
      }
      continue;
    }

    studyIndex += 1;
    const isReviewDay = studyIndex % 4 === 0;
    const isSimulationDay = studyIndex % 10 === 0;

    for (let slot = 0; slot < slotsPerDay; slot += 1) {
      const topic = topics[topicCursor % Math.max(1, topics.length)] || { tema: "Conhecimentos específicos de enfermagem", score: 1 };
      topicCursor += slot === slotsPerDay - 1 ? 0 : 1;

      let tipo = slot === 0 ? "TEORIA" : slot === 1 ? "QUESTOES" : "REVISAO";
      if (isReviewDay && slot === 0) tipo = "REVISAO";
      if (isSimulationDay && slot === slotsPerDay - 1) tipo = "SIMULADO";

      const duration = Math.max(20, Math.floor(minutesPerDay / slotsPerDay));
      tasks.push({
        data: isoDay(date),
        tipo,
        titulo:
          tipo === "QUESTOES" ? "Praticar questões" :
          tipo === "REVISAO" ? "Revisão espaçada" :
          tipo === "SIMULADO" ? "Bloco de simulado" :
          "Estudo teórico",
        tema: topic.tema,
        duracaoMinutos: tipo === "SIMULADO" ? Math.max(45, duration) : duration,
        metaValor: tipo === "QUESTOES" ? Math.max(10, Math.round(duration / 2)) : tipo === "SIMULADO" ? 20 : duration,
        ordem: slot + 1,
      });
    }

    topicCursor += 1;
  }

  return tasks.slice(0, 620);
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
      policy: "Fontes oficiais e institucionais priorizadas automaticamente.",
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
  const topics = planTopics(prova, sourceItems, dificuldades, prioridades, weakness);
  const tasks = generateTasks(body, topics);

  await prisma.cronogramaEstudo.updateMany({
    where: { usuarioId, ativo: true },
    data: { ativo: false },
  });

  const schedule = await prisma.cronogramaEstudo.create({
    data: {
      usuarioId,
      prova,
      tipoProva: inferKind(prova),
      dataProva: body.dataProva ? new Date(String(body.dataProva) + "T12:00:00") : null,
      horasPorDia: clamp(body.horasPorDia, 0.5, 12),
      diasPorSemana: Math.round(clamp(body.diasPorSemana, 1, 7)),
      nivel: text(body.nivel, 40) || "INTERMEDIARIO",
      dificuldades,
      prioridades,
      estrategia: {
        algoritmo: "peso + incidência + dificuldade + histórico + proximidade",
        temas: topics.slice(0, 20),
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

  return { status: 201, data: { scheduleId: schedule.id, topics: topics.slice(0, 16), sources: schedule.fontes } };
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
