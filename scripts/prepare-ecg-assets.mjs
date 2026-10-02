import { mkdir, cp, copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const frontend = path.join(root, "frontend");
const vendorRoot = path.join(frontend, "vendor", "three");
const addonsTarget = path.join(vendorRoot, "addons");
const modelsTarget = path.join(frontend, "models");

await mkdir(vendorRoot, { recursive: true });
await mkdir(modelsTarget, { recursive: true });

await copyFile(
  path.join(root, "node_modules", "three", "build", "three.module.js"),
  path.join(vendorRoot, "three.module.js")
);

await cp(
  path.join(root, "node_modules", "three", "examples", "jsm"),
  addonsTarget,
  { recursive: true, force: true }
);

const modelPath = path.join(modelsTarget, "heart.glb");

const modelUrls = [
  "https://raw.githubusercontent.com/yihalem123/Human-Organ3D/main/models/heart.glb",
  "https://cdn.jsdelivr.net/gh/yihalem123/Human-Organ3D@main/models/heart.glb"
];

let downloaded = false;
let lastError = null;

for (const url of modelUrls) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Cortex-ECG-Lab/1.0"
      }
    });

    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    const bytes = new Uint8Array(await response.arrayBuffer());

    if (bytes.byteLength < 100000) {
      throw new Error("arquivo GLB inesperadamente pequeno");
    }

    await writeFile(modelPath, bytes);
    console.log(
      "[ecg-assets] heart.glb salvo localmente:",
      Math.round(bytes.byteLength / 1024),
      "KB"
    );
    downloaded = true;
    break;
  }
  catch (error) {
    lastError = error;
    console.warn(
      "[ecg-assets] falha ao baixar modelo de",
      url,
      error instanceof Error ? error.message : error
    );
  }
}

if (!downloaded) {
  console.warn(
    "[ecg-assets] modelo do coração não foi baixado durante o build.",
    lastError instanceof Error ? lastError.message : lastError
  );
}

console.log("[ecg-assets] Three.js local preparado.");
