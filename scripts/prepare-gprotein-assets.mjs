import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "frontend", "data", "gprotein");
const MANIFEST_PATH = path.join(OUT, "manifest.json");

const STRUCTURES = [
  {
    pdbId: "3SN6",
    file: "3SN6.pdb",
    title: "Crystal structure of the beta2 adrenergic receptor-Gs protein complex",
    pathway: "gs",
    method: "X-RAY DIFFRACTION",
    resolutionAngstrom: 3.2,
    organism: "Bos taurus / Rattus norvegicus / Homo sapiens (construct components)",
    sourceUrl: "https://www.rcsb.org/structure/3SN6",
    dataUrl: "https://files.rcsb.org/download/3SN6.pdb",
    publicationDoi: "10.1038/nature10361",
    note: "Base experimental para β2AR–Gs. A porção de T4-lisozima de cristalização é removida da representação didática do receptor."
  },
  {
    pdbId: "6DDE",
    file: "6DDE.pdb",
    title: "Mu Opioid Receptor-Gi Protein Complex",
    pathway: "gi",
    method: "ELECTRON MICROSCOPY",
    resolutionAngstrom: 3.5,
    organism: "Homo sapiens / Mus musculus",
    sourceUrl: "https://www.rcsb.org/structure/6DDE",
    dataUrl: "https://files.rcsb.org/download/6DDE.pdb",
    publicationDoi: "10.1038/s41586-018-0219-7",
    note: "Base experimental para receptor μ-opioide–Gi. Cadeias A/B/C/R correspondem a Gαi1/Gβ1/Gγ2/receptor."
  },
  {
    pdbId: "8UQO",
    file: "8UQO.pdb",
    title: "PLCb3-Gbg-Gaq complex on membranes",
    pathway: "gq",
    method: "ELECTRON MICROSCOPY",
    resolutionAngstrom: 3.37,
    organism: "Homo sapiens",
    sourceUrl: "https://www.rcsb.org/structure/8UQO",
    dataUrl: "https://files.rcsb.org/download/8UQO.pdb",
    publicationDoi: "10.1073/pnas.2315011120",
    note: "Base experimental para a relação entre Gαq, Gβγ e PLCβ3 em contexto de membrana. Cadeias A/Q e B,C/D,G correspondem a Gαq/PLCβ3 e cópias de Gβ/Gγ."
  }
];

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "Cortex-Study-Platform/1.0 educational visualization" }
  });
  if (!response.ok) throw new Error("Falha ao baixar " + url + " (" + response.status + ")");
  return response.text();
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });

  for (const structure of STRUCTURES) {
    console.log("[gprotein-assets] baixando estrutura experimental", structure.pdbId, "do RCSB PDB");
    const pdb = await fetchText(structure.dataUrl);
    if (!pdb.includes("HEADER") || !pdb.includes("ATOM")) {
      throw new Error("Arquivo " + structure.pdbId + " recebido não parece ser um PDB válido.");
    }
    await fs.writeFile(path.join(OUT, structure.file), pdb, "utf8");
    console.log("[gprotein-assets] pronto:", path.join(OUT, structure.file));
  }

  const manifest = {
    version: 2,
    generatedAt: new Date().toISOString(),
    source: "RCSB Protein Data Bank / wwPDB",
    license: "CC0 1.0 Universal (PDB archive data)",
    attribution: "RCSB PDB / wwPDB; cite as publicações originais de cada entrada",
    structures: STRUCTURES
  };

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
}

main().catch((error) => {
  console.error("[gprotein-assets]", error);
  process.exit(1);
});
