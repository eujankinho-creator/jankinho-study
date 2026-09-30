import fs from "node:fs";
import path from "node:path";

const ROOTS = ["backend", "lib", "scripts"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs"]);
const SELF = path.normalize("scripts/check-sql-safety.mjs");

const blockedTokens = [
  "$queryRawUnsafe",
  "$executeRawUnsafe",
  "$queryRaw",
  "$executeRaw",
  "Prisma.raw",
];

const blockedImports = [
  /from\s+["']pg["']/,
  /require\s*\(\s*["']pg["']\s*\)/,
];

function walk(directory) {
  if (!fs.existsSync(directory)) return [];

  const files = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "generated") continue;

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

const violations = [];

for (const root of ROOTS) {
  for (const file of walk(root)) {
    if (path.normalize(file) === SELF) continue;

    const source = fs.readFileSync(file, "utf8");
    const lines = source.split(/\r?\n/);

    lines.forEach((line, index) => {
      for (const token of blockedTokens) {
        if (line.includes(token)) {
          violations.push({
            file,
            line: index + 1,
            reason: `raw SQL bloqueado: ${token}`,
          });
        }
      }

      for (const pattern of blockedImports) {
        if (pattern.test(line)) {
          violations.push({
            file,
            line: index + 1,
            reason: "acesso SQL direto via pg bloqueado",
          });
        }
      }
    });
  }
}

if (violations.length > 0) {
  console.error("\n[SECURITY] Verificacao contra SQL injection falhou.\n");

  for (const violation of violations) {
    console.error(
      `- ${violation.file}:${violation.line} - ${violation.reason}`
    );
  }

  console.error(
    "\nUse os metodos tipados do Prisma ORM. " +
    "Qualquer necessidade de SQL raw deve passar por revisao de seguranca antes de remover esta trava.\n"
  );

  process.exit(1);
}

console.log(
  "[SECURITY] SQL injection check OK: somente acesso tipado via Prisma ORM detectado."
);
