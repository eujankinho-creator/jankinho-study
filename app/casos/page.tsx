"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";

type Caso = {
  id: number;
  titulo: string;
  area: string;
  especialidade?: string | null;
  dificuldade: string;
  cenario: string;
  queixaInicial: string;
  publicado: boolean;
  geradoPorIA?: boolean;
  createdAt?: string;
};

const dificuldades = [
  "Todos",
  "Fácil",
  "Médio",
  "Difícil",
];

const areas = [
  "Todas",
  "Enfermagem",
  "Medicina",
  "Cardiologia",
  "Pneumologia",
  "Neurologia",
  "Emergência",
  "UTI",
  "Saúde da Mulher",
  "Pediatria",
  "Infectologia",
];

export default function CasosPage() {
  const [casos, setCasos] = useState<Caso[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [mostrarGerador, setMostrarGerador] =
    useState(false);

  const [area, setArea] =
    useState("Enfermagem");

  const [especialidade, setEspecialidade] =
    useState("");

  const [dificuldade, setDificuldade] =
    useState("Médio");

  const [cenario, setCenario] =
    useState("Pronto atendimento");

  const [tipoCaso, setTipoCaso] =
    useState("Investigação clínica");

  const [caracteristicas, setCaracteristicas] =
    useState("");

  const [gerando, setGerando] =
    useState(false);

  const [busca, setBusca] =
    useState("");

  const [filtroArea, setFiltroArea] =
    useState("Todas");

  const [filtroDificuldade, setFiltroDificuldade] =
    useState("Todos");

  async function carregarCasos() {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch(
        "/api/casos"
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.error ||
            "Não foi possível carregar os casos."
        );
      }

      setCasos(
        Array.isArray(dados.casos)
          ? dados.casos
          : []
      );
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro(
          "Não foi possível carregar os casos."
        );
      }
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarCasos();
  }, []);

  async function gerarCaso() {
    if (!area.trim()) {
      setErro(
        "Informe a área do caso."
      );
      return;
    }

    if (!cenario.trim()) {
      setErro(
        "Informe o cenário clínico."
      );
      return;
    }

    try {
      setGerando(true);
      setErro("");

      const resposta = await fetch(
        "/api/ia/gerar-caso",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            area,
            especialidade:
              especialidade.trim(),
            dificuldade,
            cenario,
            tipoCaso,
            caracteristicas:
              caracteristicas.trim(),
          }),
        }
      );

      const dados =
        await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.error ||
            "Não foi possível gerar o caso."
        );
      }

      setMostrarGerador(false);

      setEspecialidade("");
      setCaracteristicas("");

      await carregarCasos();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro(
          "Não foi possível gerar o caso."
        );
      }
    } finally {
      setGerando(false);
    }
  }

  const casosFiltrados =
    useMemo(() => {
      const termo =
        busca
          .trim()
          .toLowerCase();

      return casos.filter(
        (caso) => {
          const correspondeBusca =
            !termo ||
            caso.titulo
              .toLowerCase()
              .includes(termo) ||
            caso.area
              .toLowerCase()
              .includes(termo) ||
            caso.cenario
              .toLowerCase()
              .includes(termo) ||
            caso.queixaInicial
              .toLowerCase()
              .includes(termo);

          const correspondeArea =
            filtroArea ===
              "Todas" ||
            caso.area
              .toLowerCase()
              .includes(
                filtroArea.toLowerCase()
              );

          const correspondeDificuldade =
            filtroDificuldade ===
              "Todos" ||
            caso.dificuldade
              .toLowerCase() ===
              filtroDificuldade.toLowerCase();

          return (
            correspondeBusca &&
            correspondeArea &&
            correspondeDificuldade
          );
        }
      );
    }, [
      casos,
      busca,
      filtroArea,
      filtroDificuldade,
    ]);

  function classeDificuldade(
    valor: string
  ) {
    const texto =
      valor.toLowerCase();

    if (
      texto === "fácil" ||
      texto === "facil"
    ) {
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    }

    if (
      texto === "difícil" ||
      texto === "dificil"
    ) {
      return "border-red-400/20 bg-red-400/10 text-red-300";
    }

    return "border-orange-400/20 bg-orange-400/10 text-orange-300";
  }

  return (
    <AppLayout>
      <div className="min-h-full bg-[#050505]">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/10 text-xl">
                  ⚕
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
                    Laboratório clínico
                  </p>

                  <h1 className="text-3xl font-bold tracking-tight text-white">
                    Casos Clínicos
                  </h1>
                </div>
              </div>

              <p className="max-w-2xl text-sm leading-6 text-white/50">
                Investigue casos clínicos progressivamente,
                solicite informações, interprete exames
                e formule sua hipótese diagnóstica.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setMostrarGerador(true)
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-400 active:scale-[0.98]"
            >
              <span className="text-lg">
                ✦
              </span>

              Criar caso com IA
            </button>
          </div>

          {erro && (
            <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {erro}
            </div>
          )}

          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_180px_180px]">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                ⌕
              </span>

              <input
                value={busca}
                onChange={(event) =>
                  setBusca(
                    event.target.value
                  )
                }
                placeholder="Buscar casos..."
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-orange-400/40 focus:bg-white/[0.05]"
              />
            </div>

            <select
              value={filtroArea}
              onChange={(event) =>
                setFiltroArea(
                  event.target.value
                )
              }
              className="h-12 rounded-2xl border border-white/10 bg-[#0c0c0c] px-4 text-sm text-white outline-none focus:border-orange-400/40"
            >
              {areas.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>

            <select
              value={
                filtroDificuldade
              }
              onChange={(event) =>
                setFiltroDificuldade(
                  event.target.value
                )
              }
              className="h-12 rounded-2xl border border-white/10 bg-[#0c0c0c] px-4 text-sm text-white outline-none focus:border-orange-400/40"
            >
              {dificuldades.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </div>

          {carregando ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/[0.025]"
                  />
                )
              )}
            </div>
          ) : casosFiltrados.length ===
            0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-400/10 text-3xl">
                🩺
              </div>

              <h2 className="text-lg font-bold text-white">
                Nenhum caso encontrado
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
                Crie um caso clínico com IA
                ou ajuste os filtros para
                encontrar outros casos.
              </p>

              <button
                type="button"
                onClick={() =>
                  setMostrarGerador(true)
                }
                className="mt-6 rounded-2xl border border-orange-400/20 bg-orange-400/10 px-4 py-2.5 text-sm font-semibold text-orange-300 transition hover:bg-orange-400/15"
              >
                Criar meu primeiro caso
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {casosFiltrados.map(
                (caso) => (
                  <div
                    key={caso.id}
                    className="group flex min-h-[280px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] transition duration-200 hover:-translate-y-0.5 hover:border-orange-400/20 hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center justify-between px-5 pt-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${classeDificuldade(
                            caso.dificuldade
                          )}`}
                        >
                          {caso.dificuldade}
                        </span>

                        {caso.geradoPorIA && (
                          <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-2.5 py-1 text-[11px] font-semibold text-purple-300">
                            IA
                          </span>
                        )}

                        {caso.publicado && (
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                            Público
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-white/25">
                        #{caso.id}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col px-5 py-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-400/70">
                        {caso.area}
                        {caso.especialidade
                          ? ` • ${caso.especialidade}`
                          : ""}
                      </p>

                      <h2 className="line-clamp-2 text-lg font-bold text-white">
                        {caso.titulo}
                      </h2>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/45">
                        {caso.queixaInicial}
                      </p>

                      <div className="mt-auto pt-5">
                        <Link
                          href={`/casos/${caso.id}`}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:border-orange-400/30 hover:bg-orange-400/10 hover:text-orange-300"
                        >
                          Investigar caso
                          <span>
                            →
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {mostrarGerador && (
          <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/85 p-4 pt-10 backdrop-blur-md sm:pt-16">
            <div className="relative my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-[0_25px_100px_rgba(0,0,0,0.8)]">
              
              <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-400">
                    Inteligência artificial
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white">
                    Criar caso clínico
                  </h2>

                  <p className="mt-1 text-sm text-white/40">
                    A IA criará um caso investigável
                    e salvará sua estrutura no banco.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={gerando}
                  onClick={() =>
                    setMostrarGerador(false)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-lg text-white/40 transition hover:bg-white/5 hover:text-white disabled:opacity-30"
                >
                  ×
                </button>
              </div>

              <div className="space-y-5 px-6 py-6">
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-white/60">
                      Área
                    </label>

                    <select
                      value={area}
                      onChange={(event) =>
                        setArea(
                          event.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus:border-orange-400/40"
                    >
                      {areas
                        .filter(
                          (item) =>
                            item !== "Todas"
                        )
                        .map(
                          (item) => (
                            <option
                              key={item}
                              value={item}
                            >
                              {item}
                            </option>
                          )
                        )}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-white/60">
                      Especialidade
                    </label>

                    <input
                      value={especialidade}
                      onChange={(event) =>
                        setEspecialidade(
                          event.target.value
                        )
                      }
                      placeholder="Ex.: Cardiologia"
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-orange-400/40"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-white/60">
                      Dificuldade
                    </label>

                    <select
                      value={dificuldade}
                      onChange={(event) =>
                        setDificuldade(
                          event.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus:border-orange-400/40"
                    >
                      <option>
                        Fácil
                      </option>
                      <option>
                        Médio
                      </option>
                      <option>
                        Difícil
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-white/60">
                      Tipo de caso
                    </label>

                    <select
                      value={tipoCaso}
                      onChange={(event) =>
                        setTipoCaso(
                          event.target.value
                        )
                      }
                      className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus:border-orange-400/40"
                    >
                      <option>
                        Investigação clínica
                      </option>
                      <option>
                        Emergência
                      </option>
                      <option>
                        Caso hospitalar
                      </option>
                      <option>
                        Caso ambulatorial
                      </option>
                      <option>
                        UTI
                      </option>
                      <option>
                        Saúde da Mulher
                      </option>
                      <option>
                        Pediatria
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/60">
                    Cenário clínico
                  </label>

                  <input
                    value={cenario}
                    onChange={(event) =>
                      setCenario(
                        event.target.value
                      )
                    }
                    placeholder="Ex.: Pronto atendimento"
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-orange-400/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/60">
                    Características adicionais
                    <span className="ml-1 font-normal text-white/25">
                      (opcional)
                    </span>
                  </label>

                  <textarea
                    value={caracteristicas}
                    onChange={(event) =>
                      setCaracteristicas(
                        event.target.value
                      )
                    }
                    rows={4}
                    placeholder="Ex.: Quero um caso com gasometria, alteração ácido-base, sinais de choque e necessidade de diagnóstico diferencial."
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-orange-400/40"
                  />
                </div>

                <div className="rounded-2xl border border-orange-400/10 bg-orange-400/[0.04] px-4 py-3">
                  <div className="flex gap-3">
                    <span className="mt-0.5">
                      ✦
                    </span>

                    <p className="text-xs leading-5 text-white/45">
                      O diagnóstico final e os
                      resultados dos exames ficam
                      protegidos no servidor e serão
                      liberados progressivamente
                      durante a investigação.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 px-6 py-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={gerando}
                  onClick={() =>
                    setMostrarGerador(false)
                  }
                  className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={gerando}
                  onClick={gerarCaso}
                  className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {gerando
                    ? "Gerando caso..."
                    : "Gerar caso com IA"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}