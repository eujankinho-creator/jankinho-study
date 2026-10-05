import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const frontend = path.join(root, "frontend");
const vendorTarget = path.join(frontend, "vendor", "niivue");
const modelTarget = path.join(frontend, "models", "radiology");
const dataTarget = path.join(frontend, "data", "radiology");

await mkdir(vendorTarget, { recursive: true });
await mkdir(modelTarget, { recursive: true });
await mkdir(dataTarget, { recursive: true });

async function download(url, destination, options = {}) {
  const label = options.label || path.basename(destination);
  const minBytes = options.minBytes || 1024;
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent": "Cortex-Radiology-Lab/2.0"
    },
    signal: AbortSignal.timeout(options.timeoutMs || 120000)
  });

  if (!response.ok) {
    throw new Error(label + ": HTTP " + response.status);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.byteLength < minBytes) {
    throw new Error(label + ": arquivo inesperadamente pequeno (" + bytes.byteLength + " bytes)");
  }

  if (options.magic && bytes.subarray(0, options.magic.length).toString("ascii") !== options.magic) {
    throw new Error(label + ": assinatura de arquivo invalida");
  }

  await writeFile(destination, bytes);
  console.log(
    "[radiology-assets]",
    label + ":",
    (bytes.byteLength / 1024 / 1024).toFixed(2),
    "MB"
  );

  return bytes.byteLength;
}

await download(
  "https://cdn.jsdelivr.net/npm/@niivue/niivue@0.69.0/dist/index.js",
  path.join(vendorTarget, "index.js"),
  {
    label: "NiiVue 0.69.0 browser bundle",
    minBytes: 500000,
    timeoutMs: 180000
  }
);

const ANATRIA_BASE =
  "https://raw.githubusercontent.com/Nurkan1/Anatria-3D/main/public/anatomy";

const systems = [
  "cardiovascular_female.glb",
  "digestive_female.glb",
  "integumentary_female.glb",
  "lymphatic_female.glb",
  "renal_female.glb",
  "reproductive_female.glb",
  "skeletal_female.glb"
];

const manifest = {
  generatedAt: new Date().toISOString(),
  anatomy: {
    source: "Human Reference Atlas 3D Reference Organ Library",
    publisher: "HuBMAP Consortium / NIH",
    derivativePackaging: "Anatria-3D system GLBs",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    attribution:
      "Human Reference Atlas (HRA) 3D Reference Organ Library, HuBMAP Consortium / NIH, derived from Visible Human Female (U.S. National Library of Medicine).",
    files: []
  },
  radiology: {
    file: "CT_Abdo.nii.gz",
    source: "NiiVue demo images / Slicer3D example dataset",
    credit: "Steve Pieper",
    originalDataset: "CTA-cardio.nrrd",
    note:
      "Public demonstration CT distributed by the NiiVue sample-image repository. It is not the same subject as the HRA 3D anatomy."
  },
  viewer: {
    name: "NiiVue",
    license: "BSD-2-Clause",
    sourceUrl: "https://github.com/niivue/niivue"
  }
};

for (const filename of systems) {
  const bytes = await download(
    ANATRIA_BASE + "/" + filename,
    path.join(modelTarget, filename),
    {
      label: filename,
      minBytes: 20000,
      magic: "glTF"
    }
  );

  manifest.anatomy.files.push({
    file: filename,
    bytes
  });
}

await download(
  ANATRIA_BASE + "/manifest_female.json",
  path.join(modelTarget, "manifest_female.json"),
  {
    label: "HRA manifest feminino",
    minBytes: 10000
  }
);

await download(
  ANATRIA_BASE + "/NOTICE",
  path.join(modelTarget, "NOTICE.txt"),
  {
    label: "HRA/Anatria NOTICE",
    minBytes: 1000
  }
);

await download(
  ANATRIA_BASE + "/LICENSE",
  path.join(modelTarget, "LICENSE.txt"),
  {
    label: "HRA/Anatria LICENSE",
    minBytes: 500
  }
);

await download(
  "https://raw.githubusercontent.com/niivue/niivue-demo-images/main/CT_Abdo.nii.gz",
  path.join(dataTarget, "CT_Abdo.nii.gz"),
  {
    label: "CT_Abdo.nii.gz",
    minBytes: 1000000,
    timeoutMs: 180000
  }
);

await writeFile(
  path.join(dataTarget, "sources.json"),
  JSON.stringify(manifest, null, 2) + "\n",
  "utf8"
);

console.log("[radiology-assets] Anatomia HRA real + CT real + NiiVue preparados.");
