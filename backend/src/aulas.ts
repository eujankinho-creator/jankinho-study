import { IncomingMessage, ServerResponse } from "node:http";
import { prisma } from "../../lib/prisma";

type ApiResult = {
  status: number;
  data: unknown;
};

function sendJson(response: ServerResponse, status: number, data: unknown) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(data));
}

async function readJson(request: IncomingMessage) {
  return new Promise<any>((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
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

function clampNumber(value: unknown, min: number, max: number) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function parseIsoDuration(value: string | undefined) {
  const match = String(value || "").match(
    /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/
  );
  if (!match) return null;
  return (
    Number(match[1] || 0) * 3600 +
    Number(match[2] || 0) * 60 +
    Number(match[3] || 0)
  );
}

function safeVideoId(value: unknown) {
  const id = String(value || "").trim();
  return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : "";
}

function text(value: unknown, max = 1000) {
  return String(value || "").trim().slice(0, max);
}

function normalizeSubjects(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => text(item, 80))
    .filter(Boolean)
    .slice(0, 12);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function startOfWeek() {
  const today = startOfToday();
  const day = today.getDay();
  const diff = day === 0 ? 6 : day - 1;
  today.setDate(today.getDate() - diff);
  return today;
}

function daysAgo(days: number) {
  const date = startOfToday();
  date.setDate(date.getDate() - days);
  return date;
}

async function youtubeSearch(url: URL): Promise<ApiResult> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return {
      status: 503,
      data: {
        error: "A busca de aulas ainda precisa da chave oficial do YouTube.",
        code: "YOUTUBE_API_KEY_MISSING",
      },
    };
  }

  const query = text(url.searchParams.get("q"), 180);
  if (!query) {
    return { status: 400, data: { error: "Digite um assunto para pesquisar." } };
  }

  const durationRaw = text(url.searchParams.get("duration"), 20);
  const durationMap: Record<string, string> = {
    short: "short",
    medium: "medium",
    long: "long",
  };

  const orderRaw = text(url.searchParams.get("order"), 20);
  const orderMap: Record<string, string> = {
    relevance: "relevance",
    recent: "date",
    views: "viewCount",
  };

  const typeRaw = text(url.searchParams.get("type"), 40);
  const typeSuffix: Record<string, string> = {
    revision: " revisão",
    summary: " resumo",
    questions: " questões",
    practice: " prática",
    conference: " conferência",
    course: " curso",
  };

  const params = new URLSearchParams({
    key: apiKey,
    part: "snippet",
    type: "video",
    maxResults: "18",
    q: query + (typeSuffix[typeRaw] || ""),
    order: orderMap[orderRaw] || "relevance",
    safeSearch: "moderate",
    regionCode: "BR",
    relevanceLanguage: "pt",
    videoEmbeddable: "true",
  });

  if (durationMap[durationRaw]) {
    params.set("videoDuration", durationMap[durationRaw]);
  }

  const searchResponse = await fetch(
    "https://www.googleapis.com/youtube/v3/search?" + params.toString(),
    { signal: AbortSignal.timeout(12000) }
  );

  if (!searchResponse.ok) {
    const detail = await searchResponse.text().catch(() => "");
    console.error("[aulas] YouTube search", searchResponse.status, detail.slice(0, 500));
    return {
      status: 502,
      data: { error: "Não conseguimos carregar as aulas agora." },
    };
  }

  const searchData: any = await searchResponse.json();
  const ids = (searchData.items || [])
    .map((item: any) => item?.id?.videoId)
    .filter(Boolean);

  if (!ids.length) {
    return { status: 200, data: { items: [], query } };
  }

  const detailsParams = new URLSearchParams({
    key: apiKey,
    part: "snippet,contentDetails,statistics,status",
    id: ids.join(","),
  });

  const detailsResponse = await fetch(
    "https://www.googleapis.com/youtube/v3/videos?" + detailsParams.toString(),
    { signal: AbortSignal.timeout(12000) }
  );

  if (!detailsResponse.ok) {
    return {
      status: 502,
      data: { error: "Não conseguimos carregar os detalhes das aulas agora." },
    };
  }

  const detailsData: any = await detailsResponse.json();
  const itemMap = new Map<string, any>(
    (detailsData.items || []).map((item: any) => [item.id, item])
  );

  const items = ids
    .map((id: string) => itemMap.get(id))
    .filter(Boolean)
    .filter((item: any) => item.status?.embeddable !== false)
    .map((item: any) => {
      const snippet = item.snippet || {};
      const thumbs = snippet.thumbnails || {};
      return {
        youtubeVideoId: item.id,
        title: snippet.title || "",
        channel: snippet.channelTitle || "",
        thumbnail:
          thumbs.maxres?.url ||
          thumbs.standard?.url ||
          thumbs.high?.url ||
          thumbs.medium?.url ||
          thumbs.default?.url ||
          "",
        description: snippet.description || "",
        durationSeconds: parseIsoDuration(item.contentDetails?.duration),
        views: item.statistics?.viewCount ? Number(item.statistics.viewCount) : null,
        publishedAt: snippet.publishedAt || null,
        youtubeCategoryId: snippet.categoryId || null,
        query,
      };
    });

  return { status: 200, data: { items, query } };
}

async function dashboard(usuarioId: number): Promise<ApiResult> {
  const [states, goal, daily, lists, notesCount, bookmarksCount] = await Promise.all([
    prisma.aulaEstado.findMany({
      where: { usuarioId },
      orderBy: { lastWatchedAt: "desc" },
      take: 80,
    }),
    prisma.aulaMeta.findUnique({ where: { usuarioId } }),
    prisma.aulaEstudoDiario.findMany({
      where: {
        usuarioId,
        data: { gte: daysAgo(34) },
      },
      orderBy: { data: "asc" },
    }),
    prisma.aulaLista.findMany({
      where: { usuarioId },
      include: {
        _count: { select: { itens: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.aulaNota.count({ where: { usuarioId } }),
    prisma.aulaMarcador.count({ where: { usuarioId } }),
  ]);

  const todayKey = startOfToday().toISOString().slice(0, 10);
  const weekStart = startOfWeek();
  const today = daily.find(
    (item) => item.data.toISOString().slice(0, 10) === todayKey
  );
  const weekSeconds = daily
    .filter((item) => item.data >= weekStart)
    .reduce((sum, item) => sum + item.seconds, 0);

  const completed = states.filter((item) => item.completed).length;
  const saved = states.filter((item) => item.saved);
  const continueWatching = states
    .filter((item) => !item.completed && item.progressSeconds > 0)
    .slice(0, 12);
  const history = states.filter((item) => item.progressSeconds > 0).slice(0, 24);

  let streak = 0;
  const studiedDays = new Set(
    daily
      .filter((item) => item.seconds >= 300)
      .map((item) => item.data.toISOString().slice(0, 10))
  );
  for (let offset = 0; offset < 365; offset += 1) {
    const key = daysAgo(offset).toISOString().slice(0, 10);
    if (!studiedDays.has(key)) break;
    streak += 1;
  }

  const subjectMap = new Map<string, { watched: number; completed: number }>();
  for (const item of states) {
    const category = item.category || "Outros";
    const current = subjectMap.get(category) || { watched: 0, completed: 0 };
    current.watched += 1;
    if (item.completed) current.completed += 1;
    subjectMap.set(category, current);
  }

  const subjectProgress = Array.from(subjectMap.entries())
    .map(([subject, value]) => ({
      subject,
      watched: value.watched,
      completed: value.completed,
      percent: value.watched
        ? Math.round((value.completed / value.watched) * 100)
        : 0,
    }))
    .sort((a, b) => b.watched - a.watched)
    .slice(0, 8);

  const goalType = goal?.tipo || "TIME";
  const goalValue = goal?.valor || 30;
  const goalCurrent =
    goalType === "LESSONS"
      ? today?.lessonsCompleted || 0
      : Math.floor((today?.seconds || 0) / 60);
  const goalPercent = Math.min(
    100,
    Math.round((goalCurrent / Math.max(1, goalValue)) * 100)
  );

  return {
    status: 200,
    data: {
      todaySeconds: today?.seconds || 0,
      weekSeconds,
      watchedCount: states.filter((item) => item.progressSeconds > 0).length,
      completedCount: completed,
      savedCount: saved.length,
      streak,
      notesCount,
      bookmarksCount,
      goal: {
        type: goalType,
        value: goalValue,
        current: goalCurrent,
        percent: goalPercent,
        complete: goalPercent >= 100,
      },
      continueWatching,
      saved,
      history,
      lists,
      subjectProgress,
      daily: daily.slice(-14),
    },
  };
}

async function saveState(usuarioId: number, body: any): Promise<ApiResult> {
  const youtubeVideoId = safeVideoId(body.youtubeVideoId);
  if (!youtubeVideoId) {
    return { status: 400, data: { error: "Vídeo inválido." } };
  }

  const durationSeconds = Math.round(clampNumber(body.durationSeconds, 0, 24 * 3600));
  const progressSeconds = Math.round(clampNumber(body.progressSeconds, 0, 24 * 3600));
  const watchedDeltaSeconds = Math.round(clampNumber(body.watchedDeltaSeconds, 0, 60));
  const saved =
    typeof body.saved === "boolean" ? body.saved : undefined;
  const completed =
    typeof body.completed === "boolean"
      ? body.completed
      : durationSeconds > 0 && progressSeconds / durationSeconds >= 0.92;

  const metadata = {
    title: text(body.title, 300) || "Videoaula",
    channel: text(body.channel, 200) || null,
    thumbnail: text(body.thumbnail, 1000) || null,
    description: text(body.description, 5000) || null,
    durationSeconds: durationSeconds || null,
    category: text(body.category, 120) || null,
    subjects: normalizeSubjects(body.subjects),
  };

  const existing = await prisma.aulaEstado.findUnique({
    where: {
      usuarioId_youtubeVideoId: { usuarioId, youtubeVideoId },
    },
  });

  const state = await prisma.aulaEstado.upsert({
    where: {
      usuarioId_youtubeVideoId: { usuarioId, youtubeVideoId },
    },
    create: {
      usuarioId,
      youtubeVideoId,
      ...metadata,
      progressSeconds,
      watchedSeconds: watchedDeltaSeconds,
      saved: saved ?? false,
      completed,
      lastWatchedAt: new Date(),
    },
    update: {
      ...metadata,
      progressSeconds,
      watchedSeconds: { increment: watchedDeltaSeconds },
      ...(saved === undefined ? {} : { saved }),
      completed,
      lastWatchedAt: new Date(),
    },
  });

  if (watchedDeltaSeconds > 0) {
    const data = startOfToday();
    const wasCompletedBefore = Boolean(existing?.completed);
    const newlyCompleted = completed && !wasCompletedBefore ? 1 : 0;

    await prisma.aulaEstudoDiario.upsert({
      where: {
        usuarioId_data: { usuarioId, data },
      },
      create: {
        usuarioId,
        data,
        seconds: watchedDeltaSeconds,
        lessonsCompleted: newlyCompleted,
      },
      update: {
        seconds: { increment: watchedDeltaSeconds },
        lessonsCompleted: newlyCompleted
          ? { increment: 1 }
          : undefined,
      },
    });
  }

  return { status: 200, data: state };
}

async function setGoal(usuarioId: number, body: any): Promise<ApiResult> {
  const tipo = String(body.type || "").toUpperCase() === "LESSONS" ? "LESSONS" : "TIME";
  const max = tipo === "LESSONS" ? 20 : 720;
  const valor = Math.round(clampNumber(body.value, 1, max));
  const goal = await prisma.aulaMeta.upsert({
    where: { usuarioId },
    create: { usuarioId, tipo, valor },
    update: { tipo, valor },
  });
  return { status: 200, data: goal };
}

async function lists(usuarioId: number, request: IncomingMessage): Promise<ApiResult> {
  if (request.method === "GET") {
    const data = await prisma.aulaLista.findMany({
      where: { usuarioId },
      include: { itens: { orderBy: { createdAt: "desc" } } },
      orderBy: { updatedAt: "desc" },
    });
    return { status: 200, data };
  }

  const body = await readJson(request);
  if (request.method === "POST") {
    const nome = text(body.name, 120);
    if (!nome) return { status: 400, data: { error: "Dê um nome para a lista." } };
    const list = await prisma.aulaLista.create({
      data: { usuarioId, nome },
    });
    return { status: 201, data: list };
  }

  return { status: 405, data: { error: "Método não permitido." } };
}

async function listItem(usuarioId: number, request: IncomingMessage): Promise<ApiResult> {
  const body = await readJson(request);
  const listaId = Number(body.listId);
  const youtubeVideoId = safeVideoId(body.youtubeVideoId);
  if (!listaId || !youtubeVideoId) {
    return { status: 400, data: { error: "Lista ou vídeo inválido." } };
  }

  const list = await prisma.aulaLista.findFirst({
    where: { id: listaId, usuarioId },
  });
  if (!list) return { status: 404, data: { error: "Lista não encontrada." } };

  const item = await prisma.aulaListaItem.upsert({
    where: {
      listaId_youtubeVideoId: { listaId, youtubeVideoId },
    },
    create: {
      listaId,
      youtubeVideoId,
      title: text(body.title, 300) || "Videoaula",
      channel: text(body.channel, 200) || null,
      thumbnail: text(body.thumbnail, 1000) || null,
      durationSeconds: Math.round(clampNumber(body.durationSeconds, 0, 86400)) || null,
      category: text(body.category, 120) || null,
    },
    update: {
      title: text(body.title, 300) || "Videoaula",
      channel: text(body.channel, 200) || null,
      thumbnail: text(body.thumbnail, 1000) || null,
    },
  });

  return { status: 200, data: item };
}

async function createNote(usuarioId: number, request: IncomingMessage): Promise<ApiResult> {
  const body = await readJson(request);
  const youtubeVideoId = safeVideoId(body.youtubeVideoId);
  const conteudo = text(body.content, 5000);
  if (!youtubeVideoId || !conteudo) {
    return { status: 400, data: { error: "Vídeo e anotação são obrigatórios." } };
  }
  const note = await prisma.aulaNota.create({
    data: {
      usuarioId,
      youtubeVideoId,
      timestampSeconds: Math.round(clampNumber(body.timestampSeconds, 0, 86400)),
      conteudo,
    },
  });
  return { status: 201, data: note };
}

async function createBookmark(usuarioId: number, request: IncomingMessage): Promise<ApiResult> {
  const body = await readJson(request);
  const youtubeVideoId = safeVideoId(body.youtubeVideoId);
  if (!youtubeVideoId) return { status: 400, data: { error: "Vídeo inválido." } };
  const bookmark = await prisma.aulaMarcador.create({
    data: {
      usuarioId,
      youtubeVideoId,
      timestampSeconds: Math.round(clampNumber(body.timestampSeconds, 0, 86400)),
      titulo: text(body.title, 240) || "Ponto importante",
    },
  });
  return { status: 201, data: bookmark };
}

export async function atenderAulas(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL,
  usuarioId: number
) {
  try {
    const path = url.pathname;
    let result: ApiResult;

    if (path === "/api/aulas/search" && request.method === "GET") {
      result = await youtubeSearch(url);
    } else if (path === "/api/aulas/dashboard" && request.method === "GET") {
      result = await dashboard(usuarioId);
    } else if (path === "/api/aulas/state" && request.method === "POST") {
      result = await saveState(usuarioId, await readJson(request));
    } else if (path === "/api/aulas/goal" && request.method === "POST") {
      result = await setGoal(usuarioId, await readJson(request));
    } else if (path === "/api/aulas/lists") {
      result = await lists(usuarioId, request);
    } else if (path === "/api/aulas/lists/item" && request.method === "POST") {
      result = await listItem(usuarioId, request);
    } else if (path === "/api/aulas/notes" && request.method === "POST") {
      result = await createNote(usuarioId, request);
    } else if (path === "/api/aulas/bookmarks" && request.method === "POST") {
      result = await createBookmark(usuarioId, request);
    } else {
      result = { status: 404, data: { error: "Rota de aulas não encontrada." } };
    }

    sendJson(response, result.status, result.data);
  } catch (error) {
    console.error("[aulas]", error);
    sendJson(response, 500, { error: "Não foi possível concluir esta ação agora." });
  }
}
