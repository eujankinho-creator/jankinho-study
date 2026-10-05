import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "frontend", "data", "gprotein");
const PDB_URL = "https://files.rcsb.org/download/3SN6.pdb";
const PDB_PATH = path.join(OUT, "3SN6.pdb");
const MANIFEST_PATH = path.join(OUT, "manifest.json");

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "Cortex-Study-Platform/1.0 educational visualization" }
  });
  if (!response.ok) throw new Error("Falha ao baixar " + url + " (" + response.status + ")");
  return response.text();
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  console.log("[gprotein-assets] baixando estrutura experimental 3SN6 do RCSB PDB");
  const pdb = await fetchText(PDB_URL);
  if (!pdb.includes("HEADER") || !pdb.includes("ATOM")) {
    throw new Error("Arquivo 3SN6 recebido não parece ser um PDB válido.");
  }
  await fs.writeFile(PDB_PATH, pdb, "utf8");

  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    structure: {
      pdbId: "3SN6",
      title: "Crystal structure of the beta2 adrenergic receptor-Gs protein complex",
      method: "X-RAY DIFFRACTION",
      resolutionAngstrom: 3.2,
      source: "RCSB Protein Data Bank",
      sourceUrl: "https://www.rcsb.org/structure/3SN6",
      dataUrl: PDB_URL,
      license: "CC0 1.0 (PDB archive data)",
      attribution: "Rasmussen et al.; RCSB PDB / wwPDB",
      note: "A estrutura experimental é usada como base espacial para GPCR, Gαs, Gβ e Gγ. Elementos celulares, ligante, membrana, efetor e nucleotídeos são representações educacionais."
    }
  };
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  console.log("[gprotein-assets] pronto:", PDB_PATH);
}

main().catch((error) => {
  console.error("[gprotein-assets]", error);
  process.exit(1);
});
