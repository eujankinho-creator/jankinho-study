import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const frontend = path.join(root, "frontend");
const vendorTarget = path.join(frontend, "vendor", "niivue");
const dataTarget = path.join(frontend, "data", "radiology");
const oldModelTarget = path.join(frontend, "models", "radiology");

await mkdir(vendorTarget, { recursive: true });
await mkdir(dataTarget, { recursive: true });

// O atlas atual não usa mais o modelo 3D HRA. Removemos os assets antigos do build
// para reduzir tamanho e tempo de deploy.
await rm(oldModelTarget, { recursive: true, force: true });

async function download(url, destination, options = {}) {
  const label = options.label || path.basename(destination);
  const minBytes = options.minBytes || 1024;
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": "Cortex-Radiology-Lab/3.0" },
    signal: AbortSignal.timeout(options.timeoutMs || 240000)
  });

  if (!response.ok) throw new Error(label + ": HTTP " + response.status);

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.byteLength < minBytes) {
    throw new Error(label + ": arquivo inesperadamente pequeno (" + bytes.byteLength + " bytes)");
  }

  await writeFile(destination, bytes);
  console.log("[radiology-assets]", label + ":", (bytes.byteLength / 1024 / 1024).toFixed(2), "MB");
  return bytes.byteLength;
}

await download(
  "https://cdn.jsdelivr.net/npm/@niivue/niivue@0.69.0/dist/index.js",
  path.join(vendorTarget, "index.js"),
  { label: "NiiVue 0.69.0 browser bundle", minBytes: 500000, timeoutMs: 180000 }
);

const HF =
  "https://huggingface.co/datasets/MedOtter/totalsegmentator-cardiac/resolve/main/s0024/";

const files = [
  ["ct.nii.gz", "CT corporal s0024", 40_000_000],
  ["organs_label.nii.gz", "Órgãos s0024", 1_000_000],
  ["cardiac_label.nii.gz", "Cardiovascular s0024", 500_000],
  ["muscles_label.nii.gz", "Musculoesquelético + encéfalo s0024", 1_000_000]
];

const prepared = [];
for (const [filename, label, minBytes] of files) {
  const bytes = await download(
    HF + filename + "?download=true",
    path.join(dataTarget, filename),
    { label, minBytes, timeoutMs: 360000 }
  );
  prepared.push({ file: filename, bytes });
}

const manifest = {
  generatedAt: new Date().toISOString(),
  radiology: {
    defaultExam: {
      patient: "s0024",
      ct: "ct.nii.gz",
      segmentations: [
        "organs_label.nii.gz",
        "cardiac_label.nii.gz",
        "muscles_label.nii.gz"
      ],
      source: "TotalSegmentator dataset mirror by MedOtter / Hugging Face",
      registration: "same patient, same voxel space",
      files: prepared
    }
  },
  viewer: {
    name: "NiiVue",
    license: "BSD-2-Clause",
    sourceUrl: "https://github.com/niivue/niivue"
  }
};

await writeFile(
  path.join(dataTarget, "sources.json"),
  JSON.stringify(manifest, null, 2) + "\n",
  "utf8"
);

console.log("[radiology-assets] CT corporal e 3 mapas co-registrados preparados localmente.");
