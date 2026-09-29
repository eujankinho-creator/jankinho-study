"use client";

import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

type LayerKey =
  | "muscles"
  | "skeleton"
  | "organs"
  | "vesselsNerves";

type LayerVisibility = Record<LayerKey, boolean>;

type Props = {
  onSelect: (structure: {
    id: string;
    name: string;
    system: string;
    conceptId?: string;
  }) => void;
  layers?: LayerVisibility;
  isolatedId?: string | null;
  hiddenIds?: string[];
};

type AtlasPart = {
  id: string;
  name: string;
  conceptId?: string;
  system: string;
  chunk: number;
  positions: number;
  normals: number;
  indices: number;
  vertexCount: number;
  indexCount: number;
  bounds?: [number[], number[]];
};

type Atlas = {
  version: string;
  parts: AtlasPart[];
};

/* ============================================================
   LOADER BINÁRIO
   ============================================================ */

class ArrayBufferLoader extends THREE.Loader {
  load(
    url: string,
    onLoad: (data: ArrayBuffer) => void,
    onProgress?: (event: ProgressEvent<EventTarget>) => void,
    onError?: (error: unknown) => void
  ) {
    const loader = new THREE.FileLoader(this.manager);

    loader.setPath(this.path);
    loader.setResponseType("arraybuffer");
    loader.setRequestHeader(this.requestHeader);
    loader.setWithCredentials(this.withCredentials);

    loader.load(
      url,
      (data) => {
        onLoad(data as ArrayBuffer);
      },
      onProgress,
      onError
    );
  }
}

/* ============================================================
   CLASSIFICAÇÃO
   ============================================================ */

function getLayer(
  system: string,
  name: string
): LayerKey | null {
  const systemValue = system.toLowerCase().trim();
  const nameValue = name.toLowerCase().trim();

  // Estruturas que não serão exibidas
  if (
    systemValue === "integumentary" ||
    systemValue === "connective"
  ) {
    return null;
  }

  if (
    nameValue.includes("retinaculum") ||
    nameValue.includes("ligament") ||
    nameValue.includes("tendon") ||
    nameValue.includes("tendinous") ||
    nameValue.includes("interosseous membrane") ||
    nameValue.includes("raphe") ||
    nameValue.includes("linea alba") ||
    nameValue.includes("iliotibial tract") ||
    nameValue.includes("tendinous ring") ||
    nameValue.includes("suspensory ligament") ||
    nameValue.includes("gingiva")
  ) {
    return null;
  }

  /* ============================================================
     MÚSCULOS FORA DO SISTEMA MUSCULAR
     ============================================================ */

  if (
    nameValue.includes("fibularis") ||
    nameValue.includes("tibialis") ||
    nameValue.includes("subscapularis") ||
    nameValue.includes("levator scapulae")
  ) {
    return "muscles";
  }

  if (
    nameValue.includes("pharyngeal constrictor") ||
    nameValue.includes("palatopharyngeus") ||
    nameValue.includes("salpingopharyngeus") ||
    nameValue.includes("stylopharyngeus")
  ) {
    return "muscles";
  }

  /* ============================================================
     ESQUELETO
     ============================================================ */

  if (systemValue === "skeletal") {
    return "skeleton";
  }

  if (nameValue.includes("lacrimal bone")) {
    return "skeleton";
  }

  if (
    nameValue.includes("nasal cartilage") ||
    nameValue.includes("cricoid cartilage") ||
    nameValue.includes("thyroid cartilage") ||
    nameValue.includes("arytenoid cartilage") ||
    nameValue.includes("corniculate cartilage") ||
    nameValue.includes("cuneiform cartilage") ||
    nameValue.includes("alar cartilage") ||
    nameValue.includes("costal cartilage") ||
    nameValue.includes("epiglottis")
  ) {
    return "skeleton";
  }

  /* ============================================================
     MÚSCULOS
     ============================================================ */

  if (systemValue === "muscular") {
    if (nameValue.includes("papillary muscle")) {
      return "organs";
    }

    return "muscles";
  }

  /* ============================================================
     VASOS E NERVOS
     ============================================================ */

  if (
    systemValue === "arterial" ||
    systemValue === "venous" ||
    systemValue === "nervous"
  ) {
    return "vesselsNerves";
  }

  if (nameValue.includes("choroid plexus")) {
    return "vesselsNerves";
  }

  if (
    nameValue.includes("cerebral") ||
    nameValue.includes("cerebell") ||
    nameValue.includes("brain") ||
    nameValue.includes("medulla") ||
    nameValue.includes("midbrain") ||
    nameValue.includes("pons") ||
    nameValue.includes("thalam") ||
    nameValue.includes("hypothalam") ||
    nameValue.includes("hippocamp") ||
    nameValue.includes("amygdala") ||
    nameValue.includes("gyrus") ||
    nameValue.includes("cortex") ||
    nameValue.includes("colliculus") ||
    nameValue.includes("optic tract") ||
    nameValue.includes("optic chiasm") ||
    nameValue.includes("corpus callosum") ||
    nameValue.includes("internal capsule") ||
    nameValue.includes("fornix") ||
    nameValue.includes("putamen") ||
    nameValue.includes("caudate nucleus") ||
    nameValue.includes("globus pallidus") ||
    nameValue.includes("cerebral aqueduct") ||
    nameValue.includes("central canal") ||
    nameValue.includes("septum of telencephalon") ||
    nameValue.includes("tentorium cerebelli")
  ) {
    return "vesselsNerves";
  }

  /* ============================================================
     CARDÍACO
     ============================================================ */

  if (systemValue === "cardiac") {
    if (
      nameValue.includes("third ventricle") ||
      nameValue.includes("fourth ventricle") ||
      nameValue.includes("lateral ventricle") ||
      nameValue.includes("interventricular foramen")
    ) {
      return "vesselsNerves";
    }

    return "organs";
  }

  /* ============================================================
     SENSORIAL
     ============================================================ */

  if (systemValue === "sensory") {
    if (nameValue.includes("choroid plexus")) {
      return "vesselsNerves";
    }

    if (
      nameValue.includes("retinaculum") ||
      nameValue.includes("tendinous ring") ||
      nameValue.includes("suspensory ligament")
    ) {
      return null;
    }

    if (
      nameValue.includes("eyeball") ||
      nameValue.includes("choroid") ||
      nameValue.includes("cornea") ||
      nameValue.includes("iris") ||
      nameValue.includes("lens") ||
      nameValue.includes("retina") ||
      nameValue.includes("sclera") ||
      nameValue.includes("vitreous body") ||
      nameValue.includes("anterior chamber") ||
      nameValue.includes("corona ciliaris") ||
      nameValue.includes("lacrimal gland") ||
      nameValue.includes("lacrimal canaliculus") ||
      nameValue.includes("lacrimal lake") ||
      nameValue.includes("lacrimal sac") ||
      nameValue.includes("nasolacrimal duct") ||
      nameValue.includes("tarsal plate") ||
      nameValue.includes("external ear")
    ) {
      return "organs";
    }

    return null;
  }

  /* ============================================================
     LINFÁTICO
     ============================================================ */

  if (systemValue === "lymphatic") {
    if (
      nameValue.includes("spleen") ||
      nameValue.includes("thymus")
    ) {
      return "organs";
    }

    return "vesselsNerves";
  }

  /* ============================================================
     ÓRGÃOS
     ============================================================ */

  if (
    systemValue === "digestive" ||
    systemValue === "endocrine" ||
    systemValue === "reproductive" ||
    systemValue === "urinary" ||
    systemValue === "respiratory"
  ) {
    return "organs";
  }

  /* ============================================================
     ESTRUTURAS CARDÍACAS
     ============================================================ */

  if (
    nameValue.includes("mitral valve") ||
    nameValue.includes("tricuspid valve") ||
    nameValue.includes("pulmonary valve") ||
    nameValue.includes("aortic valve") ||
    nameValue.includes("wall of ventricle") ||
    nameValue.includes("wall of left atrium") ||
    nameValue.includes("wall of right atrium") ||
    nameValue.includes("cavity of left ventricle") ||
    nameValue.includes("cavity of right ventricle") ||
    nameValue.includes("cavity of left atrium") ||
    nameValue.includes("cavity of right atrium")
  ) {
    return "organs";
  }

  /* ============================================================
     VASOS/NERVOS POR NOME
     ============================================================ */

  if (
    nameValue.includes("artery") ||
    nameValue.includes("arterial") ||
    nameValue.includes("vein") ||
    nameValue.includes("venous") ||
    nameValue.includes("nerve") ||
    nameValue.includes("ganglion")
  ) {
    return "vesselsNerves";
  }

  return null;
}

/* ============================================================
   CORES
   ============================================================ */

function getStructureColor(
  part: AtlasPart,
  layer: LayerKey
): THREE.Color {
  const name = part.name.toLowerCase();
  const system = part.system.toLowerCase();

  if (
    system === "arterial" ||
    name.includes("artery") ||
    name.includes("arterial")
  ) {
    return new THREE.Color("#c62828");
  }

  if (
    system === "venous" ||
    name.includes("vein") ||
    name.includes("venous")
  ) {
    return new THREE.Color("#2854a6");
  }

  if (
    system === "nervous" ||
    name.includes("nerve") ||
    name.includes("ganglion") ||
    name.includes("brain") ||
    name.includes("cerebell") ||
    name.includes("cerebral") ||
    name.includes("gyrus") ||
    name.includes("cortex") ||
    name.includes("thalam") ||
    name.includes("hypothalam")
  ) {
    return new THREE.Color("#d8a52b");
  }

  if (layer === "skeleton") {
    if (
      name.includes("tooth") ||
      name.includes("molar") ||
      name.includes("premolar") ||
      name.includes("incisor")
    ) {
      return new THREE.Color("#eee2c4");
    }

    if (name.includes("cartilage")) {
      return new THREE.Color("#d5d0b8");
    }

    return new THREE.Color("#ded5bc");
  }

  if (layer === "muscles") {
    return new THREE.Color("#a83232");
  }

  if (layer === "organs") {
    if (name.includes("liver")) {
      return new THREE.Color("#7f3028");
    }

    if (name.includes("spleen")) {
      return new THREE.Color("#71334c");
    }

    if (
      name.includes("lung") ||
      name.includes("bronch") ||
      name.includes("bronchial")
    ) {
      return new THREE.Color("#b95c65");
    }

    if (
      system === "cardiac" ||
      name.includes("heart") ||
      name.includes("ventricle") ||
      name.includes("atrium") ||
      name.includes("valve")
    ) {
      return new THREE.Color("#a62f38");
    }

    if (
      name.includes("kidney") ||
      name.includes("renal")
    ) {
      return new THREE.Color("#9b4c45");
    }

    if (name.includes("pancreas")) {
      return new THREE.Color("#d29a73");
    }

    if (
      name.includes("stomach") ||
      name.includes("gastric")
    ) {
      return new THREE.Color("#c56a72");
    }

    if (
      name.includes("intestine") ||
      name.includes("colon") ||
      name.includes("ileum") ||
      name.includes("jejunum") ||
      name.includes("duodenum") ||
      name.includes("appendix")
    ) {
      return new THREE.Color("#c98286");
    }

    if (
      name.includes("gallbladder") ||
      name.includes("bile") ||
      name.includes("biliary")
    ) {
      return new THREE.Color("#708c3d");
    }

    if (
      name.includes("gland") ||
      name.includes("pituitary") ||
      name.includes("pineal") ||
      name.includes("adrenal")
    ) {
      return new THREE.Color("#d48b65");
    }

    if (
      name.includes("eye") ||
      name.includes("cornea") ||
      name.includes("iris") ||
      name.includes("retina") ||
      name.includes("sclera") ||
      name.includes("lens")
    ) {
      return new THREE.Color("#7aa5c7");
    }

    if (
      system === "reproductive" ||
      name.includes("testis") ||
      name.includes("testes") ||
      name.includes("prostate") ||
      name.includes("penis") ||
      name.includes("seminal")
    ) {
      return new THREE.Color("#b45e68");
    }

    return new THREE.Color("#b76567");
  }

  return new THREE.Color("#b76567");
}

/* ============================================================
   MESH DA ESTRUTURA
   ============================================================ */

function StructureMesh({
  part,
  chunkBuffer,
  onSelect,
  visible,
  layer,
  selected,
  isolated,
}: {
  part: AtlasPart;
  chunkBuffer: ArrayBuffer;
  onSelect: Props["onSelect"];
  visible: boolean;
  layer: LayerKey;
  selected: boolean;
  isolated: boolean;
}) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(
      chunkBuffer,
      part.positions,
      part.vertexCount * 3
    );

    const indices = new Uint32Array(
      chunkBuffer,
      part.indices,
      part.indexCount
    );

    const geo = new THREE.BufferGeometry();

    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    geo.setIndex(
      new THREE.BufferAttribute(indices, 1)
    );

    geo.computeVertexNormals();
    geo.computeBoundingSphere();

    return geo;
  }, [
    chunkBuffer,
    part.positions,
    part.indices,
    part.vertexCount,
    part.indexCount,
  ]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  /*
   * Quando está selecionada:
   * amarelo + brilho.
   *
   * Quando estamos isolando outra estrutura:
   * fica transparente.
   */
  const material = useMemo(() => {
    const baseColor = getStructureColor(
      part,
      layer
    );

    const finalColor = selected
      ? new THREE.Color("#ffd92f")
      : baseColor;

    const opacity = isolated ? 0.13 : 1;

    return new THREE.MeshStandardMaterial({
      color: finalColor,

      roughness: selected
        ? 0.38
        : 0.68,

      metalness: 0,

      side: THREE.DoubleSide,

      transparent: isolated,
      opacity,

      depthWrite: !isolated,

      emissive: selected
        ? new THREE.Color("#ffb300")
        : new THREE.Color("#000000"),

      emissiveIntensity: selected
        ? 0.55
        : 0,
    });
  }, [
    part,
    layer,
    selected,
    isolated,
  ]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  /*
   * Estruturas invisíveis não podem receber clique.
   *
   * Durante isolamento, somente a estrutura
   * selecionada continua recebendo clique.
   */
  const canRaycast =
    visible && (!isolated || selected);

  const raycast = useMemo(() => {
    if (!canRaycast) {
      return () => {};
    }

    return THREE.Mesh.prototype.raycast;
  }, [canRaycast]);

  return (
    <mesh
      geometry={geometry}
      material={material}
      visible={visible}
      raycast={raycast}
      onClick={
        canRaycast
          ? (event) => {
              event.stopPropagation();

              onSelect({
                id: part.id,
                name: part.name,
                system: part.system,
                conceptId: part.conceptId,
              });
            }
          : undefined
      }
    />
  );
}

/* ============================================================
   MODELO COMPLETO
   ============================================================ */

function AnatomyModel({
  atlas,
  chunks,
  onSelect,
  layers,
  isolatedId,
  hiddenIds,
  selectedId,
}: {
  atlas: Atlas;
  chunks: Record<number, ArrayBuffer>;
  onSelect: Props["onSelect"];
  layers: LayerVisibility;
  isolatedId: string | null;
  hiddenIds: string[];
  selectedId: string | null;
}) {
  return (
    <group>
      {atlas.parts.map((part) => {
        const layer = getLayer(
          part.system,
          part.name
        );

        if (layer === null) {
          return null;
        }

        const chunkBuffer =
          chunks[part.chunk];

        if (!chunkBuffer) {
          return null;
        }

        const hidden =
          hiddenIds.includes(part.id);

        /*
         * A estrutura está dentro da camada
         * atualmente ativa.
         */
        const layerVisible =
          layers[layer];

        /*
         * Se estiver isolando:
         *
         * - selecionada = normal
         * - demais = transparentes
         */
        const isIsolatedOther =
          isolatedId !== null &&
          isolatedId !== part.id;

        const visible =
          layerVisible &&
          !hidden;

        const selected =
          selectedId === part.id;

        return (
          <StructureMesh
            key={part.id}
            part={part}
            chunkBuffer={chunkBuffer}
            onSelect={onSelect}
            visible={visible}
            layer={layer}
            selected={selected}
            isolated={
              visible &&
              isIsolatedOther
            }
          />
        );
      })}
    </group>
  );
}

/* ============================================================
   CENA
   ============================================================ */

function Scene({
  atlas,
  chunks,
  onSelect,
  layers,
  isolatedId,
  hiddenIds,
  selectedId,
}: {
  atlas: Atlas;
  chunks: Record<number, ArrayBuffer>;
  onSelect: Props["onSelect"];
  layers: LayerVisibility;
  isolatedId: string | null;
  hiddenIds: string[];
  selectedId: string | null;
}) {
  return (
    <>
      <ambientLight intensity={1.15} />

      <directionalLight
        position={[5, 8, 6]}
        intensity={2.2}
      />

      <directionalLight
        position={[-5, 4, -4]}
        intensity={1.1}
      />

      <directionalLight
        position={[0, -3, 4]}
        intensity={0.7}
      />

      <AnatomyModel
        atlas={atlas}
        chunks={chunks}
        onSelect={onSelect}
        layers={layers}
        isolatedId={isolatedId}
        hiddenIds={hiddenIds}
        selectedId={selectedId}
      />

      <OrbitControls
        enableDamping
        dampingFactor={0.08}

        /*
         * ZOOM MAIS FORTE
         */
        minDistance={0.35}
        maxDistance={14}

        zoomSpeed={2.2}

        rotateSpeed={0.65}

        panSpeed={0.8}
      />
    </>
  );
}

/* ============================================================
   VIEWER
   ============================================================ */

export default function AnatomyViewer({
  onSelect,
  layers = {
    muscles: true,
    skeleton: true,
    organs: true,
    vesselsNerves: true,
  },
  isolatedId = null,
  hiddenIds = [],
}: Props) {
  const [atlas, setAtlas] =
    useState<Atlas | null>(null);

  const [chunks, setChunks] =
    useState<Record<number, ArrayBuffer>>({});

  const [error, setError] =
    useState<string | null>(null);

  /*
   * Estrutura atualmente selecionada.
   *
   * Fica dentro do Viewer para o destaque amarelo
   * não depender de outra renderização.
   */
  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  /*
   * Quando o isolamento muda, mantemos a estrutura
   * selecionada sincronizada.
   */
  useEffect(() => {
    if (isolatedId) {
      setSelectedId(isolatedId);
    }
  }, [isolatedId]);

  /*
   * Carrega atlas + chunks.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadAtlas() {
      try {
        setError(null);

        const response = await fetch(
          "/models/atlas.json"
        );

        if (!response.ok) {
          throw new Error(
            `Não foi possível carregar atlas.json (${response.status})`
          );
        }

        const atlasData =
          (await response.json()) as Atlas;

        if (cancelled) return;

        console.log(
          "Atlas carregado:",
          atlasData.parts.length,
          "estruturas"
        );

        setAtlas(atlasData);

        const chunkIds = Array.from(
          new Set(
            atlasData.parts.map(
              (part) => part.chunk
            )
          )
        );

        const loader =
          new ArrayBufferLoader();

        const loadedChunks: Record<
          number,
          ArrayBuffer
        > = {};

        await Promise.all(
          chunkIds.map(
            (chunkId) =>
              new Promise<void>(
                (resolve, reject) => {
                  loader.load(
                    `/models/body-${chunkId}.bin`,
                    (buffer) => {
                      loadedChunks[
                        chunkId
                      ] = buffer;

                      resolve();
                    },
                    undefined,
                    (loadError) => {
                      reject(loadError);
                    }
                  );
                }
              )
          )
        );

        if (cancelled) return;

        setChunks(loadedChunks);
      } catch (loadError) {
        console.error(
          "Erro ao carregar anatomia:",
          loadError
        );

        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Erro desconhecido ao carregar o modelo."
          );
        }
      }
    }

    loadAtlas();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Se a estrutura selecionada foi ocultada pela camada,
   * removemos a seleção visual.
   */
  useEffect(() => {
    if (!selectedId) return;

    const selectedPart =
      atlas?.parts.find(
        (part) => part.id === selectedId
      );

    if (!selectedPart) return;

    const selectedLayer = getLayer(
      selectedPart.system,
      selectedPart.name
    );

    if (
      selectedLayer &&
      !layers[selectedLayer]
    ) {
      setSelectedId(null);
    }
  }, [
    layers,
    selectedId,
    atlas,
  ]);

  /*
   * Intercepta seleção para manter o amarelo
   * dentro do próprio viewer.
   */
  const handleSelect = (
    structure: Parameters<
      Props["onSelect"]
    >[0]
  ) => {
    setSelectedId(structure.id);
    onSelect(structure);
  };

  if (error) {
    return (
      <div className="flex min-h-[650px] items-center justify-center rounded-2xl border border-red-500/20 bg-[#0d0d0d] p-8 text-center">
        <div>
          <p className="text-sm font-semibold text-red-400">
            Erro ao carregar o modelo
          </p>

          <p className="mt-2 max-w-md text-xs leading-5 text-zinc-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!atlas) {
    return (
      <div className="flex min-h-[650px] items-center justify-center rounded-2xl border border-zinc-800 bg-[#0d0d0d]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-orange-400" />

          <p className="mt-4 text-sm text-zinc-500">
            Carregando anatomia 3D...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[650px] overflow-hidden rounded-2xl border border-zinc-800 bg-[#0d0d0d]">
      <Canvas
        camera={{
          position: [0, 0, 3.5],
          fov: 45,
          near: 0.01,
          far: 100,
        }}
        dpr={[1, 2]}
      >
        <Scene
          atlas={atlas}
          chunks={chunks}
          onSelect={handleSelect}
          layers={layers}
          isolatedId={isolatedId}
          hiddenIds={hiddenIds}
          selectedId={selectedId}
        />
      </Canvas>

      {/* Indicador visual da seleção */}
      {selectedId && (
        <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-yellow-400/30 bg-black/60 px-3 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_10px_rgba(253,224,71,0.8)]" />

            <span className="text-[11px] font-semibold uppercase tracking-wider text-yellow-300">
              Estrutura selecionada
            </span>
          </div>
        </div>
      )}

      {/* Ajuda discreta */}
      <div className="pointer-events-none absolute bottom-4 left-4 rounded-lg border border-zinc-800/80 bg-black/50 px-3 py-2 backdrop-blur-sm">
        <p className="text-[10px] text-zinc-500">
          Arraste para rotacionar · Scroll para zoom
        </p>
      </div>
    </div>
  );
}