import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const files = [
  "frontend/js/laboratorio-proteina-g.js",
  "frontend/js/gprotein/data.js"
];

for (const sourcePath of files) {
  const source = await fs.readFile(sourcePath, "utf8");
  const tempPath = path.join(os.tmpdir(), path.basename(sourcePath).replace(/\.js$/, ".mjs"));
  await fs.writeFile(tempPath, source, "utf8");
  const result = spawnSync(process.execPath, ["--check", tempPath], { encoding: "utf8" });
  await fs.rm(tempPath, { force: true });
  if (result.status !== 0) {
    console.error("[gprotein-syntax] falha em", sourcePath);
    console.error(result.stderr || result.stdout);
    process.exit(result.status || 1);
  }
  console.log("[gprotein-syntax] OK", sourcePath);
}
