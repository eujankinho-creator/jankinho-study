import { PrismaClient } from "../src/generated/client/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;
const importSecret = process.env.QUESTION_IMPORT_SECRET;
const publicHost = process.env.RAILWAY_PUBLIC_DOMAIN;
const staticUrl = process.env.RAILWAY_STATIC_URL;

if (!databaseUrl || !importSecret) {
  console.error("[smoke-import] missing required runtime configuration");
  process.exit(1);
}

const baseUrl = publicHost
  ? `https://${publicHost}`
  : staticUrl
    ? staticUrl.replace(/\/$/, "")
    : null;

if (!baseUrl) {
  console.error("[smoke-import] public service URL unavailable");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

const runId = `20261002-${Date.now()}`;
const fonte = `romulo-passos-smoke-test-${runId}`;
const disciplina = `Teste Importacao ${runId}`;
const origemIds = Array.from({ length: 5 }, (_, index) => `smoke-${runId}-${index + 1}`);

async function postBatch(usuarioId) {
  const questoes = origemIds.map((origemId, index) => ({
    fonte,
    origemId,
    disciplina,
    assunto: "Smoke test",
    dificuldade: "teste",
    enunciado: `Questão sintética de teste ${index + 1} do importador.`,
    alternativas: [
      { texto: "Alternativa A", correta: index % 4 === 0 },
      { texto: "Alternativa B", correta: index % 4 === 1 },
      { texto: "Alternativa C", correta: index % 4 === 2 },
      { texto: "Alternativa D", correta: index % 4 === 3 },
    ],
  }));

  const response = await fetch(`${baseUrl}/api/internal/questoes/importar`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-import-key": importSecret,
    },
    body: JSON.stringify({ usuarioId, questoes }),
  });

  let body = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }

  return {
    status: response.status,
    importadas: Number(body.importadas ?? 0),
    duplicadas: Number(body.duplicadas ?? 0),
    erros: Array.isArray(body.erros) ? body.erros.length : 0,
  };
}

let first = null;
let second = null;
let remaining = null;
let usuarioId = null;

try {
  const user = await prisma.usuario.findFirst({
    orderBy: { id: "asc" },
    select: { id: true },
  });

  if (!user) {
    throw new Error("no existing user available for smoke test");
  }

  usuarioId = user.id;
  first = await postBatch(usuarioId);
  second = await postBatch(usuarioId);
} finally {
  if (usuarioId) {
    await prisma.questao.deleteMany({
      where: {
        usuarioId,
        fonte,
        origemId: { in: origemIds },
      },
    });

    await prisma.disciplina.deleteMany({
      where: {
        usuarioId,
        nome: disciplina,
        questoes: { none: {} },
      },
    });

    remaining = await prisma.questao.count({
      where: {
        usuarioId,
        fonte,
        origemId: { in: origemIds },
      },
    });
  }

  await prisma.$disconnect();
}

console.log("[smoke-import] deployment_health=running");
console.log(`[smoke-import] first status=${first?.status ?? "n/a"} imported=${first?.importadas ?? "n/a"} duplicates=${first?.duplicadas ?? "n/a"} errors=${first?.erros ?? "n/a"}`);
console.log(`[smoke-import] second status=${second?.status ?? "n/a"} imported=${second?.importadas ?? "n/a"} duplicates=${second?.duplicadas ?? "n/a"} errors=${second?.erros ?? "n/a"}`);
console.log(`[smoke-import] cleanup remaining=${remaining ?? "n/a"}`);
