import { mkdir, rm, mkdtemp, open, readFile, writeFile } from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { createGunzip } from "node:zlib";
import sharp from "sharp";

const root = process.cwd();
const frontend = path.join(root, "frontend");
const dataTarget = path.join(frontend, "data", "radiology-atlas");
const meshTarget = path.join(dataTarget, "mesh");
const oldRadiologyTarget = path.join(frontend, "data", "radiology");
const oldModelTarget = path.join(frontend, "models", "radiology");
const oldVendorTarget = path.join(frontend, "vendor", "niivue");
const work = await mkdtemp(path.join(tmpdir(), "cortex-ct-atlas-"));

const HF = "https://huggingface.co/datasets/MedOtter/totalsegmentator-vertebrae/resolve/main/s0024/";
const X_STEP = 2;
const Y_STEP = 2;
const Z_STEP = 3;
const GROUPS = [
  { id: "organs", file: "organs_label.nii.gz" },
  { id: "cardiac", file: "cardiac_label.nii.gz" },
  { id: "muscles", file: "muscles_label.nii.gz" },
  { id: "ribs", file: "ribs_label.nii.gz" },
  { id: "vertebrae", file: "vertebrae_label.nii.gz" }
];

await rm(dataTarget, { recursive: true, force: true });
await rm(oldRadiologyTarget, { recursive: true, force: true });
await rm(oldModelTarget, { recursive: true, force: true });
await rm(oldVendorTarget, { recursive: true, force: true });
await mkdir(dataTarget, { recursive: true });
await mkdir(meshTarget, { recursive: true });

function pad(value) {
  return String(value).padStart(4, "0");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function axisIndices(size, step) {
  const values = [];
  for (let i = 0; i < size; i += step) values.push(i);
  if (values[values.length - 1] !== size - 1) values.push(size - 1);
  return values;
}

async function downloadToFile(url, destination, label) {
  console.log("[radiology-atlas] baixando", label);
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": "Cortex-Radiology-Atlas/4.0" },
    signal: AbortSignal.timeout(360000)
  });
  if (!response.ok || !response.body) throw new Error(label + ": HTTP " + response.status);
  await pipeline(response.body, createWriteStream(destination));
}

async function inflateGzip(source, destination) {
  await pipeline(createReadStream(source), createGunzip(), createWriteStream(destination));
}

async function readHeader(filePath) {
  const fd = await open(filePath, "r");
  const header = Buffer.alloc(352);
  await fd.read(header, 0, header.length, 0);
  await fd.close();

  let little = true;
  let sizeof = header.readInt32LE(0);
  if (sizeof !== 348) {
    little = false;
    sizeof = header.readInt32BE(0);
  }
  if (sizeof !== 348) throw new Error("NIfTI-1 inválido: " + filePath);

  const i16 = (offset) => little ? header.readInt16LE(offset) : header.readInt16BE(offset);
  const f32 = (offset) => little ? header.readFloatLE(offset) : header.readFloatBE(offset);
  const dims = [i16(42), i16(44), i16(46)];
  const dim4 = i16(48) || 1;
  const datatype = i16(70);
  const bitpix = i16(72);
  const voxOffset = Math.max(352, Math.floor(f32(108) || 352));
  const slope = f32(112) || 1;
  const inter = f32(116) || 0;
  const bytesPerVoxel = bitpix / 8;

  if (!dims.every((v) => v > 0) || ![1,2,4].includes(bytesPerVoxel)) {
    throw new Error("Formato NIfTI não suportado");
  }

  return { dims, dim4, datatype, bitpix, bytesPerVoxel, voxOffset, slope, inter, little };
}

function readNumeric(buffer, offset, header) {
  const le = header.little;
  switch (header.datatype) {
    case 2: return buffer.readUInt8(offset);
    case 4: return le ? buffer.readInt16LE(offset) : buffer.readInt16BE(offset);
    case 8: return le ? buffer.readInt32LE(offset) : buffer.readInt32BE(offset);
    case 16: return le ? buffer.readFloatLE(offset) : buffer.readFloatBE(offset);
    case 512: return le ? buffer.readUInt16LE(offset) : buffer.readUInt16BE(offset);
    default: throw new Error("datatype NIfTI não suportado: " + header.datatype);
  }
}

function windowGray(value, width, level) {
  const min = level - width / 2;
  const normalized = (value - min) / width;
  return Math.round(clamp(normalized, 0, 1) * 255);
}

async function encodeGray(raw, width, height, destination, type) {
  await mkdir(path.dirname(destination), { recursive: true });
  let image = sharp(raw, { raw: { width, height, channels: 1 } });
  if (type === "mask") {
    await image.png({ compressionLevel: 9, palette: false }).toFile(destination);
  } else {
    await image.webp({ quality: 76, effort: 4 }).toFile(destination);
  }
}

function accumulateStat(stats, label, x, y, z) {
  if (!label) return;
  let item = stats[label];
  if (!item) {
    item = stats[label] = {
      count: 0, sumX: 0, sumY: 0, sumZ: 0,
      min: [x,y,z], max: [x,y,z]
    };
  }
  item.count += 1;
  item.sumX += x;
  item.sumY += y;
  item.sumZ += z;
  item.min[0] = Math.min(item.min[0], x);
  item.min[1] = Math.min(item.min[1], y);
  item.min[2] = Math.min(item.min[2], z);
  item.max[0] = Math.max(item.max[0], x);
  item.max[1] = Math.max(item.max[1], y);
  item.max[2] = Math.max(item.max[2], z);
}

const CUBE_CORNERS = Object.freeze([
  [0,0,0],[1,0,0],[1,1,0],[0,1,0],
  [0,0,1],[1,0,1],[1,1,1],[0,1,1]
]);

const CUBE_TETS = Object.freeze([
  [0,5,1,6],
  [0,1,2,6],
  [0,2,3,6],
  [0,3,7,6],
  [0,7,4,6],
  [0,4,5,6]
]);

function sampledCoord(values, coordinate) {
  const base = clamp(Math.floor(coordinate), 0, values.length - 1);
  const next = clamp(base + 1, 0, values.length - 1);
  const frac = clamp(coordinate - base, 0, 1);
  return values[base] * (1 - frac) + values[next] * frac;
}

function createLabelMesh(volume, dims, label, stat, sampling, options = {}) {
  const [dx,dy,dz] = dims;
  const stride = Math.max(1, options.stride || 1);
  const padCells = 2;
  const minXi = clamp(Math.floor(stat.min[0] / X_STEP) - padCells, 0, dx - 2);
  const maxXi = clamp(Math.ceil(stat.max[0] / X_STEP) + padCells, 1, dx - 1);
  const minYi = clamp(Math.floor(stat.min[1] / Y_STEP) - padCells, 0, dy - 2);
  const maxYi = clamp(Math.ceil(stat.max[1] / Y_STEP) + padCells, 1, dy - 1);
  const minZi = clamp(Math.floor(stat.min[2] / Z_STEP) - padCells, 0, dz - 2);
  const maxZi = clamp(Math.ceil(stat.max[2] / Z_STEP) + padCells, 1, dz - 1);

  const vertices = [];
  const indices = [];
  const vertexMap = new Map();

  const valueAt = (x,y,z) => {
    const xi=clamp(x,0,dx-1), yi=clamp(y,0,dy-1), zi=clamp(z,0,dz-1);
    return volume[xi + yi*dx + zi*dx*dy] === label ? 1 : 0;
  };

  const addVertex = (a,b) => {
    const gx=(a[0]+b[0])*.5;
    const gy=(a[1]+b[1])*.5;
    const gz=(a[2]+b[2])*.5;
    const key=(Math.round(gx*2))+","+(Math.round(gy*2))+","+(Math.round(gz*2));
    let index=vertexMap.get(key);
    if(index!==undefined) return index;

    const ox=sampledCoord(sampling.xVals,gx);
    const oy=sampledCoord(sampling.yVals,gy);
    const oz=sampledCoord(sampling.zVals,gz);
    index=vertices.length/3;
    vertices.push(
      Math.round(ox*1000)/1000,
      Math.round(oy*1000)/1000,
      Math.round(oz*1000)/1000
    );
    vertexMap.set(key,index);
    return index;
  };

  const emitTet = (points,values,tet) => {
    const inside=tet.filter((idx)=>values[idx]===1);
    if(inside.length===0||inside.length===4) return;
    const outside=tet.filter((idx)=>values[idx]===0);

    if(inside.length===1){
      const i=inside[0];
      const a=addVertex(points[i],points[outside[0]]);
      const b=addVertex(points[i],points[outside[1]]);
      const c=addVertex(points[i],points[outside[2]]);
      indices.push(a,b,c);
      return;
    }

    if(inside.length===3){
      const o=outside[0];
      const a=addVertex(points[o],points[inside[0]]);
      const b=addVertex(points[o],points[inside[1]]);
      const c=addVertex(points[o],points[inside[2]]);
      indices.push(a,c,b);
      return;
    }

    const [i0,i1]=inside;
    const [o0,o1]=outside;
    const a=addVertex(points[i0],points[o0]);
    const b=addVertex(points[i0],points[o1]);
    const c=addVertex(points[i1],points[o0]);
    const d=addVertex(points[i1],points[o1]);
    indices.push(a,c,b,b,c,d);
  };

  for(let z=minZi;z<maxZi;z+=stride){
    const z1=Math.min(z+stride,maxZi);
    for(let y=minYi;y<maxYi;y+=stride){
      const y1=Math.min(y+stride,maxYi);
      for(let x=minXi;x<maxXi;x+=stride){
        const x1=Math.min(x+stride,maxXi);
        const points=[
          [x,y,z],[x1,y,z],[x1,y1,z],[x,y1,z],
          [x,y,z1],[x1,y,z1],[x1,y1,z1],[x,y1,z1]
        ];
        const values=[
          valueAt(x,y,z),valueAt(x1,y,z),valueAt(x1,y1,z),valueAt(x,y1,z),
          valueAt(x,y,z1),valueAt(x1,y,z1),valueAt(x1,y1,z1),valueAt(x,y1,z1)
        ];
        const sum=values.reduce((acc,v)=>acc+v,0);
        if(sum===0||sum===8) continue;
        for(const tet of CUBE_TETS) emitTet(points,values,tet);
      }
    }
  }

  if(indices.length<12||vertices.length<12) return null;
  return { vertices, indices };
}

function smoothIndexedMesh(mesh, iterations = 1, factor = .18) {
  if(!mesh||iterations<=0) return mesh;
  const count=mesh.vertices.length/3;
  const neighbors=Array.from({length:count},()=>new Set());
  for(let i=0;i<mesh.indices.length;i+=3){
    const a=mesh.indices[i],b=mesh.indices[i+1],c=mesh.indices[i+2];
    neighbors[a].add(b);neighbors[a].add(c);
    neighbors[b].add(a);neighbors[b].add(c);
    neighbors[c].add(a);neighbors[c].add(b);
  }

  let current=Float64Array.from(mesh.vertices);
  for(let iteration=0;iteration<iterations;iteration++){
    const next=Float64Array.from(current);
    for(let i=0;i<count;i++){
      const list=neighbors[i];
      if(list.size<3) continue;
      let ax=0,ay=0,az=0;
      for(const n of list){
        ax+=current[n*3];ay+=current[n*3+1];az+=current[n*3+2];
      }
      const inv=1/list.size;
      ax*=inv;ay*=inv;az*=inv;
      next[i*3]=current[i*3]*(1-factor)+ax*factor;
      next[i*3+1]=current[i*3+1]*(1-factor)+ay*factor;
      next[i*3+2]=current[i*3+2]*(1-factor)+az*factor;
    }
    current=next;
  }
  mesh.vertices=Array.from(current,(value)=>Math.round(value*1000)/1000);
  return mesh;
}

async function writeGroupMeshes(group, volume, dims, stats, sampling) {
  const groupDir=path.join(meshTarget,group.id);
  await mkdir(groupDir,{recursive:true});
  const labels=Object.keys(stats).map(Number).filter((label)=>label>0).sort((a,b)=>a-b);
  const thinGroup=group.id==="ribs"||group.id==="vertebrae"||group.id==="cardiac";

  console.log("[radiology-atlas] gerando malhas low-poly reais",group.id,"labels",labels.length);
  for(const label of labels){
    const stat=stats[label];
    const stride=thinGroup?1:(stat.count>130000?2:1);
    let mesh=createLabelMesh(volume,dims,label,stat,sampling,{stride});
    if(!mesh) continue;
    mesh=smoothIndexedMesh(mesh,thinGroup?1:2,thinGroup?.12:.2);
    const payload={
      version:1,
      coordinateSpace:"original-voxel",
      label,
      vertices:mesh.vertices,
      indices:mesh.indices
    };
    await writeFile(path.join(groupDir,String(label)+".json"),JSON.stringify(payload),"utf8");
  }
}

async function buildCt(ctPath, header, planeDirs) {
  const [nx, ny, nz] = header.dims;
  const xVals = axisIndices(nx, X_STEP);
  const yVals = axisIndices(ny, Y_STEP);
  const zVals = axisIndices(nz, Z_STEP);
  const dx = xVals.length, dy = yVals.length, dz = zVals.length;
  const down = new Int16Array(dx * dy * dz);
  const fd = await open(ctPath, "r");
  const sliceBytes = nx * ny * header.bytesPerVoxel;
  const slice = Buffer.alloc(sliceBytes);

  console.log("[radiology-atlas] gerando axial + volume reduzido", nx + "x" + ny + "x" + nz, "->", dx + "x" + dy + "x" + dz);

  for (let zi = 0; zi < zVals.length; zi += 1) {
    const z = zVals[zi];
    await fd.read(slice, 0, sliceBytes, header.voxOffset + z * sliceBytes);

    const axial = Buffer.alloc(nx * ny);
    for (let y = 0; y < ny; y += 1) {
      const outY = ny - 1 - y;
      for (let x = 0; x < nx; x += 1) {
        const off = (x + y * nx) * header.bytesPerVoxel;
        const hu = readNumeric(slice, off, header) * header.slope + header.inter;
        axial[x + outY * nx] = windowGray(hu, 430, 45);
      }
    }
    await encodeGray(axial, nx, ny, path.join(planeDirs.axial, pad(zi) + ".webp"), "ct");

    for (let yi = 0; yi < dy; yi += 1) {
      const y = yVals[yi];
      for (let xi = 0; xi < dx; xi += 1) {
        const x = xVals[xi];
        const off = (x + y * nx) * header.bytesPerVoxel;
        const hu = readNumeric(slice, off, header) * header.slope + header.inter;
        down[xi + yi * dx + zi * dx * dy] = Math.round(clamp(hu, -32768, 32767));
      }
    }
    if (zi % 50 === 0) console.log("[radiology-atlas] axial", zi + 1, "/", zVals.length);
  }
  await fd.close();

  for (let yi = 0; yi < dy; yi += 1) {
    const raw = Buffer.alloc(dx * dz);
    for (let zi = 0; zi < dz; zi += 1) {
      const outZ = dz - 1 - zi;
      for (let xi = 0; xi < dx; xi += 1) {
        const hu = down[xi + yi * dx + zi * dx * dy];
        raw[xi + outZ * dx] = windowGray(hu, 430, 45);
      }
    }
    await encodeGray(raw, dx, dz, path.join(planeDirs.coronal, pad(yi) + ".webp"), "ct");
  }

  for (let xi = 0; xi < dx; xi += 1) {
    const raw = Buffer.alloc(dy * dz);
    for (let zi = 0; zi < dz; zi += 1) {
      const outZ = dz - 1 - zi;
      for (let yi = 0; yi < dy; yi += 1) {
        const hu = down[xi + yi * dx + zi * dx * dy];
        raw[yi + outZ * dy] = windowGray(hu, 430, 45);
      }
    }
    await encodeGray(raw, dy, dz, path.join(planeDirs.sagittal, pad(xi) + ".webp"), "ct");
  }

  return {
    xVals, yVals, zVals,
    rendered: {
      axial: { width: nx, height: ny },
      coronal: { width: dx, height: dz },
      sagittal: { width: dy, height: dz }
    }
  };
}

async function buildMask(group, niiPath, header, ctDims, sampling, targetRoot) {
  const [cx, cy, cz] = ctDims;
  const channelFirst = header.dim4 > 1 && header.dims[0] <= 64;
  const channels = channelFirst ? header.dims[0] : 1;
  const [mx, my, mz] = channelFirst
    ? [header.dims[1], header.dims[2], header.dim4]
    : header.dims;
  const { xVals, yVals, zVals } = sampling;
  const dx = xVals.length, dy = yVals.length, dz = zVals.length;
  const down = new Uint8Array(dx * dy * dz);
  const stats = {};
  const fd = await open(niiPath, "r");
  const sliceBytes = channels * mx * my * header.bytesPerVoxel;
  const slice = Buffer.alloc(sliceBytes);

  const readMaskLabel = (x, y) => {
    if (!channelFirst) {
      const off = (x + y * mx) * header.bytesPerVoxel;
      return Math.round(readNumeric(slice, off, header));
    }

    const base = (x * channels) + (y * mx * channels);
    for (let ch = 0; ch < channels; ch += 1) {
      const off = (base + ch) * header.bytesPerVoxel;
      if (readNumeric(slice, off, header) > 0) return ch + 1;
    }
    return 0;
  };

  const mapCoord = (value, fromSize, toSize) => {
    if (fromSize <= 1 || toSize <= 1) return 0;
    return clamp(Math.round((value / (fromSize - 1)) * (toSize - 1)), 0, toSize - 1);
  };

  console.log(
    "[radiology-atlas] máscara",
    group.id,
    channelFirst ? ("4D canais=" + channels + " espaço") : "dims",
    mx + "x" + my + "x" + mz,
    "-> grade CT",
    cx + "x" + cy + "x" + cz
  );

  for (let zi = 0; zi < zVals.length; zi += 1) {
    const czIndex = zVals[zi];
    const mzIndex = mapCoord(czIndex, cz, mz);
    await fd.read(slice, 0, sliceBytes, header.voxOffset + mzIndex * sliceBytes);

    const axial = Buffer.alloc(cx * cy);
    for (let y = 0; y < cy; y += 1) {
      const myIndex = mapCoord(y, cy, my);
      const outY = cy - 1 - y;
      for (let x = 0; x < cx; x += 1) {
        const mxIndex = mapCoord(x, cx, mx);
        const label = readMaskLabel(mxIndex, myIndex);
        axial[x + outY * cx] = label;
      }
    }
    await encodeGray(axial, cx, cy, path.join(targetRoot, group.id, "axial", pad(zi) + ".png"), "mask");

    for (let yi = 0; yi < dy; yi += 1) {
      const y = yVals[yi];
      const myIndex = mapCoord(y, cy, my);
      for (let xi = 0; xi < dx; xi += 1) {
        const x = xVals[xi];
        const mxIndex = mapCoord(x, cx, mx);
        const label = readMaskLabel(mxIndex, myIndex);
        down[xi + yi * dx + zi * dx * dy] = label;
        accumulateStat(stats, label, x, y, czIndex);
      }
    }
  }
  await fd.close();

  for (let yi = 0; yi < dy; yi += 1) {
    const raw = Buffer.alloc(dx * dz);
    for (let zi = 0; zi < dz; zi += 1) {
      const outZ = dz - 1 - zi;
      for (let xi = 0; xi < dx; xi += 1) {
        raw[xi + outZ * dx] = down[xi + yi * dx + zi * dx * dy];
      }
    }
    await encodeGray(raw, dx, dz, path.join(targetRoot, group.id, "coronal", pad(yi) + ".png"), "mask");
  }

  for (let xi = 0; xi < dx; xi += 1) {
    const raw = Buffer.alloc(dy * dz);
    for (let zi = 0; zi < dz; zi += 1) {
      const outZ = dz - 1 - zi;
      for (let yi = 0; yi < dy; yi += 1) {
        raw[yi + outZ * dy] = down[xi + yi * dx + zi * dx * dy];
      }
    }
    await encodeGray(raw, dy, dz, path.join(targetRoot, group.id, "sagittal", pad(xi) + ".png"), "mask");
  }

  await writeGroupMeshes(group,down,[dx,dy,dz],stats,sampling);

  const normalized = {};
  for (const [label, item] of Object.entries(stats)) {
    normalized[label] = {
      count: item.count,
      centroid: [
        Math.round(item.sumX / item.count),
        Math.round(item.sumY / item.count),
        Math.round(item.sumZ / item.count)
      ],
      min: item.min,
      max: item.max
    };
  }
  return normalized;
}

try {
  const ctGz = path.join(work, "ct.nii.gz");
  const ctNii = path.join(work, "ct.nii");
  await downloadToFile(HF + "ct.nii.gz?download=true", ctGz, "CT corporal s0024");
  await inflateGzip(ctGz, ctNii);
  const ctHeader = await readHeader(ctNii);

  const ctRoot = path.join(dataTarget, "ct");
  const maskRoot = path.join(dataTarget, "mask");
  const planeDirs = {
    axial: path.join(ctRoot, "axial"),
    coronal: path.join(ctRoot, "coronal"),
    sagittal: path.join(ctRoot, "sagittal")
  };
  await Promise.all(Object.values(planeDirs).map((dir) => mkdir(dir, { recursive: true })));
  await mkdir(maskRoot, { recursive: true });

  const sampling = await buildCt(ctNii, ctHeader, planeDirs);
  const structures = {};

  for (const group of GROUPS) {
    const gz = path.join(work, group.file);
    const nii = path.join(work, group.id + ".nii");
    await downloadToFile(HF + group.file + "?download=true", gz, group.id);
    await inflateGzip(gz, nii);
    const header = await readHeader(nii);
    structures[group.id] = await buildMask(group, nii, header, ctHeader.dims, sampling, maskRoot);
    await rm(gz, { force: true });
    await rm(nii, { force: true });
  }

  const manifest = {
    version: 7,
    generatedAt: new Date().toISOString(),
    source: {
      name: "TotalSegmentator / MedOtter · caso s0024 · órgãos, músculos, costelas e vértebras",
      license: "CC BY 4.0",
      sourceUrl: "https://huggingface.co/datasets/MedOtter/totalsegmentator-vertebrae"
    },
    architecture: "progressive-webp-slices+precomputed-lowpoly-meshes",
    meshBase: "/data/radiology-atlas/mesh",
    originalDims: ctHeader.dims,
    sampling: { xStep: X_STEP, yStep: Y_STEP, zStep: Z_STEP },
    planes: {
      axial: { voxels: sampling.zVals, ...sampling.rendered.axial },
      coronal: { voxels: sampling.yVals, ...sampling.rendered.coronal },
      sagittal: { voxels: sampling.xVals, ...sampling.rendered.sagittal }
    },
    groups: GROUPS.map((g) => g.id),
    structures
  };

  await writeFile(path.join(dataTarget, "manifest.json"), JSON.stringify(manifest), "utf8");
  console.log("[radiology-atlas] atlas progressivo pronto; NIfTI não é enviado ao navegador.");
} finally {
  await rm(work, { recursive: true, force: true });
}
