"use client";

import { useState } from "react";

import AppLayout from "@/components/AppLayout";
import AnatomyViewer from "@/components/anatomy/AnatomyViewer";

type SelectedStructure = {
  id: string;
  name: string;
  system: string;
  conceptId?: string;
};

type LayerKey =
  | "muscles"
  | "skeleton"
  | "organs"
  | "vesselsNerves";

type Layers = Record<
  LayerKey,
  boolean
>;

const layerLabels: {
  key: LayerKey;
  label: string;
  icon: string;
}[] = [
  {
    key: "muscles",
    label: "Músculos",
    icon: "💪",
  },
  {
    key: "skeleton",
    label: "Esqueleto",
    icon: "🦴",
  },
  {
    key: "organs",
    label: "Órgãos",
    icon: "🫀",
  },
  {
    key: "vesselsNerves",
    label: "Vasos e nervos",
    icon: "🧠",
  },
];

const initialLayers: Layers = {
  muscles: true,
  skeleton: true,
  organs: true,
  vesselsNerves: true,
};

export default function AnatomiaPage() {
  const [selected, setSelected] =
    useState<SelectedStructure | null>(
      null
    );

  const [layers, setLayers] =
    useState<Layers>(
      initialLayers
    );

  const [isolatedId, setIsolatedId] =
    useState<string | null>(null);

  const [hiddenIds, setHiddenIds] =
    useState<string[]>([]);

  function toggleLayer(
    layer: LayerKey
  ) {
    setLayers((current) => ({
      ...current,
      [layer]: !current[layer],
    }));

    /*
     * Quando mudamos de camada,
     * cancelamos o isolamento.
     */
    setIsolatedId(null);
  }

  function showAll() {
    setLayers({
      muscles: true,
      skeleton: true,
      organs: true,
      vesselsNerves: true,
    });

    setIsolatedId(null);
    setHiddenIds([]);
  }

  function hideAll() {
    setLayers({
      muscles: false,
      skeleton: false,
      organs: false,
      vesselsNerves: false,
    });

    setIsolatedId(null);
  }

  function isolateSelected() {
    if (!selected) {
      return;
    }

    setIsolatedId(selected.id);

    setHiddenIds([]);
  }

  function hideSelected() {
    if (!selected) {
      return;
    }

    setHiddenIds((current) => {
      if (current.includes(selected.id)) {
        return current;
      }

      return [
        ...current,
        selected.id,
      ];
    });

    setIsolatedId(null);
  }

  function restoreSelected() {
    if (!selected) {
      return;
    }

    setHiddenIds((current) =>
      current.filter(
        (id) => id !== selected.id
      )
    );
  }

  function clearIsolation() {
    setIsolatedId(null);
  }

  return (
    <AppLayout>
      <main className="min-h-screen bg-[#070707] px-4 py-6 text-white md:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
              Laboratório de Anatomia
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Anatomia 3D
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Explore o corpo humano,
              controle os principais
              grupos anatômicos e
              selecione estruturas
              individualmente.
            </p>
          </div>

          <section className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
            {/* =================================================
                CAMADAS
            ================================================= */}

            <aside className="rounded-2xl border border-zinc-800 bg-[#101010] p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Camadas
                </p>

                <button
                  onClick={showAll}
                  className="text-xs text-orange-400 transition hover:text-orange-300"
                >
                  Mostrar tudo
                </button>
              </div>

              <button
                onClick={hideAll}
                className="mt-2 text-xs text-zinc-600 transition hover:text-zinc-400"
              >
                Ocultar tudo
              </button>

              <div className="mt-5 space-y-2">
                {layerLabels.map(
                  (layer) => (
                    <button
                      key={layer.key}
                      onClick={() =>
                        toggleLayer(
                          layer.key
                        )
                      }
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 transition ${
                        layers[
                          layer.key
                        ]
                          ? "border-orange-500/30 bg-orange-500/10"
                          : "border-zinc-800 bg-zinc-950"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-base">
                          {layer.icon}
                        </span>

                        <span
                          className={`text-sm ${
                            layers[
                              layer.key
                            ]
                              ? "text-zinc-200"
                              : "text-zinc-600"
                          }`}
                        >
                          {layer.label}
                        </span>
                      </span>

                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          layers[
                            layer.key
                          ]
                            ? "bg-orange-400"
                            : "bg-zinc-700"
                        }`}
                      />
                    </button>
                  )
                )}
              </div>

              {isolatedId && (
                <button
                  onClick={
                    clearIsolation
                  }
                  className="mt-5 w-full rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-3 text-xs font-semibold text-orange-400 transition hover:bg-orange-500/20"
                >
                  Sair do isolamento
                </button>
              )}
            </aside>

            {/* =================================================
                MODELO
            ================================================= */}

            <section className="min-w-0">
              <AnatomyViewer
                onSelect={
                  setSelected
                }
                layers={layers}
                isolatedId={
                  isolatedId
                }
                hiddenIds={
                  hiddenIds
                }
              />
            </section>

            {/* =================================================
                ESTRUTURA
            ================================================= */}

            <aside className="rounded-2xl border border-zinc-800 bg-[#101010] p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Estrutura
              </p>

              {!selected ? (
                <div className="mt-10 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-3xl">
                    🧍
                  </div>

                  <h2 className="mt-5 text-lg font-semibold">
                    Nenhuma estrutura
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Clique em uma
                    estrutura no
                    modelo para
                    selecioná-la.
                  </p>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4">
                    <p className="text-xs uppercase tracking-wider text-orange-400">
                      Selecionada
                    </p>

                    <h2 className="mt-2 text-xl font-bold">
                      {selected.name}
                    </h2>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      Sistema
                    </p>

                    <p className="mt-1 text-sm text-zinc-300">
                      {selected.system}
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      ID
                    </p>

                    <p className="mt-1 break-all font-mono text-xs text-zinc-500">
                      {selected.id}
                    </p>
                  </div>

                  <div className="mt-7 space-y-2">
                    <button
                      onClick={
                        isolateSelected
                      }
                      className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-orange-400"
                    >
                      Isolar estrutura
                    </button>

                    <button
                      onClick={
                        hideSelected
                      }
                      className="w-full rounded-xl border border-zinc-700 px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-900"
                    >
                      Ocultar estrutura
                    </button>

                    {hiddenIds.includes(
                      selected.id
                    ) && (
                      <button
                        onClick={
                          restoreSelected
                        }
                        className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 transition hover:bg-emerald-500/20"
                      >
                        Mostrar estrutura
                      </button>
                    )}

                    {isolatedId ===
                      selected.id && (
                      <button
                        onClick={
                          clearIsolation
                        }
                        className="w-full rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-400 transition hover:bg-orange-500/20"
                      >
                        Sair do isolamento
                      </button>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </section>
        </div>
      </main>
    </AppLayout>
  );
}