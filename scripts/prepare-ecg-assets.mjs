import { mkdir, cp, copyFile, writeFile, rename, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { NodeIO } from "@gltf-transform/core";
import { dedup, prune, weld, simplify } from "@gltf-transform/functions";
import { MeshoptSimplifier } from "meshoptimizer";

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
const optimizedPath = path.join(modelsTarget, "heart-optimized.glb");

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
      "[ecg-assets] heart.glb original:",
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
else {
  try {
    await MeshoptSimplifier.ready;

    const io = new NodeIO();
    const document = await io.read(modelPath);

    await document.transform(
      dedup(),
      weld(),
      simplify({
        simplifier: MeshoptSimplifier,
        ratio: 0.48,
        error: 0.0025
      }),
      prune()
    );

    await io.write(optimizedPath, document);

    const original = await stat(modelPath);
    const optimized = await stat(optimizedPath);

    if (
      optimized.size > 150000 &&
      optimized.size < original.size
    ) {
      await rename(optimizedPath, modelPath);
      console.log(
        "[ecg-assets] heart.glb otimizado:",
        Math.round(optimized.size / 1024),
        "KB",
        "(" + Math.round((1 - optimized.size / original.size) * 100) + "% menor)"
      );
    }
    else {
      console.warn(
        "[ecg-assets] otimização não reduziu o arquivo; mantendo original."
      );
    }
  }
  catch (error) {
    console.warn(
      "[ecg-assets] otimização da malha falhou; mantendo GLB original:",
      error instanceof Error ? error.message : error
    );
  }
}

console.log("[ecg-assets] Three.js local preparado.");
