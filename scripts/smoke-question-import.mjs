import pg from "pg";

const { Pool } = pg;

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

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("railway.internal")
    ? undefined
    : { rejectUnauthorized: false },
});

const runId = `20261002-${Date.now()}`;
const fonte = `romulo-passos-smoke-test-${runId}`;
const origemIds = Array.from({ length: 5 }, (_, index) => `smoke-${runId}-${index + 1}`);

async function postBatch(usuarioId) {
  const questoes = origemIds.map((origemId, index) => ({
    fonte,
    origemId,
    disciplina: "Teste Importacao",
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

try {
  const userResult = await pool.query('SELECT id FROM "Usuario" ORDER BY id ASC LIMIT 1');

  if (userResult.rowCount === 0) {
    throw new Error("no existing user available for smoke test");
  }

  const usuarioId = userResult.rows[0].id;

  first = await postBatch(usuarioId);
  second = await postBatch(usuarioId);
} finally {
  try {
    await pool.query(
      'DELETE FROM "Questao" WHERE "fonte" = $1 AND "origemId" = ANY($2::text[])',
      [fonte, origemIds],
    );

    const check = await pool.query(
      'SELECT COUNT(*)::int AS count FROM "Questao" WHERE "fonte" = $1 AND "origemId" = ANY($2::text[])',
      [fonte, origemIds],
    );

    remaining = check.rows[0]?.count ?? null;
  } finally {
    await pool.end();
  }
}

console.log("[smoke-import] deployment_health=running");
console.log(`[smoke-import] first status=${first?.status ?? "n/a"} imported=${first?.importadas ?? "n/a"} duplicates=${first?.duplicadas ?? "n/a"} errors=${first?.erros ?? "n/a"}`);
console.log(`[smoke-import] second status=${second?.status ?? "n/a"} imported=${second?.importadas ?? "n/a"} duplicates=${second?.duplicadas ?? "n/a"} errors=${second?.erros ?? "n/a"}`);
console.log(`[smoke-import] cleanup remaining=${remaining ?? "n/a"}`);
