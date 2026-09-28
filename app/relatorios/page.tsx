"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";

type Resumo = {
  total: number;
  acertos: number;
  erros: number;
  percentual: number;
};

type Disciplina = {
  disciplina: string;
  total: number;
  acertos: number;
  erros: number;
  percentual: number;
};

type Tema = {
  tema: string;
  total: number;
  acertos: number;
  erros: number;
  percentual: number;
};

type DadosDesempenho = {
  resumo: Resumo;
  disciplinas: Disciplina[];
  temas: Tema[];
};

export default function RelatoriosPage() {
  const [dados, setDados] =
    useState<DadosDesempenho | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch("/api/desempenho");

      if (!resposta.ok) {
        throw new Error("Erro ao carregar os dados.");
      }

      const resultado = await resposta.json();

      setDados(resultado);
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível carregar os relatórios."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(function () {
    carregarDados();
  }, []);

  function larguraBarra(percentual: number) {
    const valor = Number(percentual);

    if (valor <= 0) {
      return "0%";
    }

    if (valor >= 100) {
      return "100%";
    }

    return valor + "%";
  }

  function obterCorPercentual(percentual: number) {
    if (percentual >= 80) {
      return "text-emerald-400";
    }

    if (percentual >= 60) {
      return "text-orange-400";
    }

    return "text-rose-400";
  }

  function obterBarraPercentual(percentual: number) {
    if (percentual >= 80) {
      return "bg-emerald-500";
    }

    if (percentual >= 60) {
      return "bg-orange-500";
    }

    return "bg-rose-500";
  }

  function obterDescricaoPercentual(percentual: number) {
    if (percentual >= 80) {
      return "Excelente aproveitamento";
    }

    if (percentual >= 60) {
      return "Bom aproveitamento";
    }

    if (percentual > 0) {
      return "Precisa de mais revisão";
    }

    return "Sem dados suficientes";
  }

  const disciplinasOrdenadas = dados
    ? [...dados.disciplinas].sort(function (a, b) {
        return b.percentual - a.percentual;
      })
    : [];

  const temasOrdenados = dados
    ? [...dados.temas].sort(function (a, b) {
        return b.percentual - a.percentual;
      })
    : [];

  const melhorDisciplina = disciplinasOrdenadas[0];

  const piorDisciplina =
    disciplinasOrdenadas.length > 0
      ? disciplinasOrdenadas[
          disciplinasOrdenadas.length - 1
        ]
      : null;

  return (
    <AppLayout>
      <main className="mx-auto max-w-7xl animate-fade-in px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="badge badge-orange">
                  Análise
                </span>

                <span className="text-xs text-neutral-600">
                  Relatório acadêmico
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Relatórios
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
                Uma visão organizada da sua evolução,
                desempenho por disciplina e domínio dos conteúdos.
              </p>
            </div>

            <button
              type="button"
              onClick={carregarDados}
              className="btn-secondary"
            >
              ↻ Atualizar
            </button>
          </div>
        </section>

        {carregando && (
          <div className="animate-fade-in">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map(function (item) {
                return (
                  <div
                    key={item}
                    className="premium-card p-5"
                  >
                    <div className="skeleton h-4 w-24 rounded" />
                    <div className="skeleton mt-4 h-9 w-20 rounded" />
                    <div className="skeleton mt-2 h-4 w-32 rounded" />
                  </div>
                );
              })}
            </section>

            <section className="premium-card mt-6 p-7">
              <div className="skeleton h-5 w-40 rounded" />
              <div className="skeleton mt-3 h-8 w-64 rounded" />
              <div className="skeleton mt-3 h-4 w-96 max-w-full rounded" />
              <div className="skeleton mt-8 h-3 w-full rounded-full" />
            </section>

            <section className="premium-card mt-6 p-7">
              <div className="skeleton h-6 w-52 rounded" />

              <div className="mt-6 space-y-4">
                {[1, 2, 3].map(function (item) {
                  return (
                    <div
                      key={item}
                      className="skeleton h-24 rounded-2xl"
                    />
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {!carregando && erro && (
          <section className="premium-card flex min-h-[420px] items-center justify-center p-10 text-center">
            <div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-2xl text-rose-400">
                !
              </div>

              <h2 className="mt-5 text-xl font-bold text-white">
                Não foi possível gerar o relatório
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                {erro}
              </p>

              <button
                type="button"
                onClick={carregarDados}
                className="btn-primary mt-6"
              >
                Tentar novamente
              </button>
            </div>
          </section>
        )}

        {!carregando && !erro && dados && (
          <div className="space-y-6">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="premium-card p-5 transition hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-600">
                    Questões
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-sm text-neutral-400">
                    ◈
                  </div>
                </div>

                <p className="mt-5 text-3xl font-bold text-white">
                  {dados.resumo.total}
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  total respondido
                </p>
              </div>

              <div className="premium-card p-5 transition hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-600">
                    Acertos
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    ✓
                  </div>
                </div>

                <p className="mt-5 text-3xl font-bold text-emerald-400">
                  {dados.resumo.acertos}
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  respostas corretas
                </p>
              </div>

              <div className="premium-card p-5 transition hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-600">
                    Erros
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                    ×
                  </div>
                </div>

                <p className="mt-5 text-3xl font-bold text-rose-400">
                  {dados.resumo.erros}
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  respostas incorretas
                </p>
              </div>

              <div className="premium-card border-orange-500/10 bg-orange-500/[0.025] p-5 transition hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-400">
                    Aproveitamento
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                    ↗
                  </div>
                </div>

                <p className="mt-5 text-3xl font-bold text-orange-400">
                  {Number(
                    dados.resumo.percentual
                  ).toFixed(1)}
                  %
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  desempenho geral
                </p>
              </div>
            </section>

            <section className="premium-card animate-slide-up p-6 sm:p-7">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="badge badge-orange">
                    Visão geral
                  </span>

                  <h2 className="mt-3 text-2xl font-bold text-white">
                    Seu desempenho
                  </h2>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-neutral-500">
                    Aproveitamento geral considerando todas
                    as questões respondidas.
                  </p>
                </div>

                <div className="md:text-right">
                  <p
                    className={
                      "text-4xl font-black " +
                      obterCorPercentual(
                        dados.resumo.percentual
                      )
                    }
                  >
                    {Number(
                      dados.resumo.percentual
                    ).toFixed(1)}
                    %
                  </p>

                  <p className="mt-1 text-xs text-neutral-600">
                    {obterDescricaoPercentual(
                      dados.resumo.percentual
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <div className="progress-track h-3">
                  <div
                    className={
                      "h-full rounded-full transition-all duration-700 " +
                      obterBarraPercentual(
                        dados.resumo.percentual
                      )
                    }
                    style={{
                      width: larguraBarra(
                        dados.resumo.percentual
                      ),
                    }}
                  />
                </div>

                <div className="mt-3 flex justify-between text-[11px] text-neutral-600">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4">
                  <p className="text-xs text-neutral-600">
                    Respondidas
                  </p>

                  <p className="mt-2 text-xl font-bold text-white">
                    {dados.resumo.total}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.025] p-4">
                  <p className="text-xs text-neutral-600">
                    Acertos
                  </p>

                  <p className="mt-2 text-xl font-bold text-emerald-400">
                    {dados.resumo.acertos}
                  </p>
                </div>

                <div className="rounded-2xl border border-rose-500/10 bg-rose-500/[0.025] p-4">
                  <p className="text-xs text-neutral-600">
                    Erros
                  </p>

                  <p className="mt-2 text-xl font-bold text-rose-400">
                    {dados.resumo.erros}
                  </p>
                </div>
              </div>
            </section>

            {(melhorDisciplina || piorDisciplina) && (
              <section className="grid gap-4 md:grid-cols-2">
                {melhorDisciplina && (
                  <div className="premium-card border-emerald-500/10 bg-emerald-500/[0.025] p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                        ↑
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-400">
                          Melhor desempenho
                        </p>

                        <h3 className="mt-2 truncate text-lg font-bold text-white">
                          {melhorDisciplina.disciplina}
                        </h3>

                        <p className="mt-1 text-sm text-neutral-500">
                          {melhorDisciplina.acertos} acertos
                          em {melhorDisciplina.total} questões.
                        </p>

                        <p className="mt-4 text-2xl font-black text-emerald-400">
                          {Number(
                            melhorDisciplina.percentual
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {piorDisciplina && (
                  <div className="premium-card border-orange-500/10 bg-orange-500/[0.025] p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                        ↘
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-400">
                          Foco para revisão
                        </p>

                        <h3 className="mt-2 truncate text-lg font-bold text-white">
                          {piorDisciplina.disciplina}
                        </h3>

                        <p className="mt-1 text-sm text-neutral-500">
                          {piorDisciplina.acertos} acertos
                          em {piorDisciplina.total} questões.
                        </p>

                        <p className="mt-4 text-2xl font-black text-orange-400">
                          {Number(
                            piorDisciplina.percentual
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            <section className="premium-card animate-slide-up p-6 sm:p-7">
              <div className="mb-7">
                <span className="badge badge-orange">
                  Disciplinas
                </span>

                <h2 className="mt-3 text-xl font-bold text-white">
                  Desempenho por disciplina
                </h2>

                <p className="mt-1 text-sm leading-6 text-neutral-500">
                  Veja onde você está tendo melhor aproveitamento.
                </p>
              </div>

              {disciplinasOrdenadas.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] p-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-neutral-500">
                    ◈
                  </div>

                  <p className="mt-4 text-sm text-neutral-500">
                    Ainda não existem respostas suficientes
                    para gerar este relatório.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {disciplinasOrdenadas.map(function (
                    item,
                    index
                  ) {
                    return (
                      <div
                        key={item.disciplina}
                        className="rounded-2xl border border-white/[0.05] bg-white/[0.012] p-5 transition hover:border-white/[0.09]"
                        style={{
                          animationDelay:
                            index < 10
                              ? index * 40 + "ms"
                              : "0ms",
                        }}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <h3 className="truncate font-semibold text-white">
                              {item.disciplina}
                            </h3>

                            <p className="mt-1 text-xs text-neutral-600">
                              {item.total} questão
                              {item.total === 1 ? "" : "ões"}{" "}
                              respondida
                              {item.total === 1
                                ? ""
                                : "s"}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-6 sm:justify-end">
                            <div className="text-xs text-neutral-500">
                              <span className="text-emerald-400">
                                {item.acertos} acertos
                              </span>

                              {" · "}

                              <span className="text-rose-400">
                                {item.erros} erros
                              </span>
                            </div>

                            <div
                              className={
                                "text-lg font-bold " +
                                obterCorPercentual(
                                  item.percentual
                                )
                              }
                            >
                              {Number(
                                item.percentual
                              ).toFixed(1)}
                              %
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 progress-track h-2">
                          <div
                            className={
                              "h-full rounded-full transition-all duration-500 " +
                              obterBarraPercentual(
                                item.percentual
                              )
                            }
                            style={{
                              width: larguraBarra(
                                item.percentual
                              ),
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="premium-card animate-slide-up p-6 sm:p-7">
              <div className="mb-7">
                <span className="badge">
                  Conteúdo
                </span>

                <h2 className="mt-3 text-xl font-bold text-white">
                  Desempenho por tema
                </h2>

                <p className="mt-1 text-sm leading-6 text-neutral-500">
                  Identifique os assuntos em que você precisa
                  reforçar os estudos.
                </p>
              </div>

              {temasOrdenados.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] p-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-neutral-500">
                    ◌
                  </div>

                  <p className="mt-4 text-sm text-neutral-500">
                    Ainda não existem dados suficientes
                    para gerar este relatório.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {temasOrdenados.map(function (
                    item,
                    index
                  ) {
                    return (
                      <div
                        key={item.tema}
                        className="rounded-2xl border border-white/[0.05] bg-white/[0.012] p-5 transition hover:-translate-y-0.5 hover:border-white/[0.09]"
                        style={{
                          animationDelay:
                            index < 10
                              ? index * 35 + "ms"
                              : "0ms",
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="truncate font-semibold text-white">
                              {item.tema}
                            </h3>

                            <p className="mt-1 text-xs text-neutral-600">
                              {item.total} questão
                              {item.total === 1 ? "" : "ões"}
                            </p>
                          </div>

                          <span
                            className={
                              "shrink-0 text-sm font-bold " +
                              obterCorPercentual(
                                item.percentual
                              )
                            }
                          >
                            {Number(
                              item.percentual
                            ).toFixed(1)}
                            %
                          </span>
                        </div>

                        <div className="mt-5 progress-track h-2">
                          <div
                            className={
                              "h-full rounded-full transition-all duration-500 " +
                              obterBarraPercentual(
                                item.percentual
                              )
                            }
                            style={{
                              width: larguraBarra(
                                item.percentual
                              ),
                            }}
                          />
                        </div>

                        <div className="mt-4 flex items-center justify-between text-xs">
                          <span className="text-emerald-400">
                            {item.acertos} acertos
                          </span>

                          <span className="text-rose-400">
                            {item.erros} erros
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="premium-card border-orange-500/10 bg-orange-500/[0.025] p-6 sm:p-7">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="badge badge-orange">
                    Análise detalhada
                  </span>

                  <h2 className="mt-3 text-xl font-bold text-white">
                    Quer acompanhar cada resposta?
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                    A página de desempenho mostra suas respostas
                    recentes e uma análise mais detalhada dos
                    seus estudos.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={function () {
                    window.location.href = "/desempenho";
                  }}
                  className="btn-primary shrink-0"
                >
                  Ver desempenho →
                </button>
              </div>
            </section>

            <div className="flex justify-center pb-8 pt-2">
              <button
                type="button"
                onClick={carregarDados}
                className="btn-secondary"
              >
                ↻ Atualizar relatório
              </button>
            </div>
          </div>
        )}
      </main>
    </AppLayout>
  );
}