"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";

type Resumo = {
  total: number;
  acertos: number;
  erros: number;
  percentual: number;
};

type DesempenhoDisciplina = {
  disciplina: string;
  total: number;
  acertos: number;
  erros: number;
  percentual: number;
};

type DesempenhoTema = {
  tema: string;
  total: number;
  acertos: number;
  erros: number;
  percentual: number;
};

type UltimaResposta = {
  id: number;
  correta: boolean;
  respondidaAt: string;
  questao: string;
  disciplina: string;
  tema: string;
};

type Desempenho = {
  resumo: Resumo;
  disciplinas: DesempenhoDisciplina[];
  temas: DesempenhoTema[];
  ultimasRespostas: UltimaResposta[];
};

export default function DesempenhoPage() {
  const [dados, setDados] = useState<Desempenho | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(function () {
    carregarDesempenho();
  }, []);

  async function carregarDesempenho() {
    try {
      setCarregando(true);
      setErro("");

      const response = await fetch("/api/desempenho");

      if (!response.ok) {
        throw new Error("Erro ao carregar desempenho.");
      }

      const data = await response.json();

      setDados(data);
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível carregar seus dados de desempenho."
      );
    } finally {
      setCarregando(false);
    }
  }

  function formatarData(data: string) {
    return new Date(data).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  function larguraBarra(valor: number) {
    const numero = Number(valor);

    if (numero < 0) {
      return "0%";
    }

    if (numero > 100) {
      return "100%";
    }

    return numero + "%";
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

  if (carregando) {
    return (
      <AppLayout>
        <main className="mx-auto max-w-7xl animate-fade-in px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton mt-3 h-9 w-64 rounded" />
            <div className="skeleton mt-3 h-5 w-80 rounded" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(function (item) {
              return (
                <div
                  key={item}
                  className="premium-card p-5"
                >
                  <div className="skeleton h-4 w-24 rounded" />
                  <div className="skeleton mt-4 h-9 w-20 rounded" />
                  <div className="skeleton mt-2 h-4 w-28 rounded" />
                </div>
              );
            })}
          </div>

          <div className="premium-card mt-6 p-6">
            <div className="skeleton h-6 w-52 rounded" />
            <div className="skeleton mt-3 h-4 w-80 rounded" />
            <div className="skeleton mt-8 h-4 w-full rounded-full" />
          </div>
        </main>
      </AppLayout>
    );
  }

  if (erro) {
    return (
      <AppLayout>
        <main className="mx-auto max-w-7xl animate-fade-in px-4 py-8 sm:px-6 lg:px-8">
          <section className="premium-card flex min-h-[420px] items-center justify-center p-10 text-center">
            <div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-2xl text-rose-400">
                !
              </div>

              <h1 className="mt-5 text-xl font-bold text-white">
                Não foi possível carregar o desempenho
              </h1>

              <p className="mt-2 text-sm text-neutral-500">
                {erro}
              </p>

              <button
                type="button"
                onClick={carregarDesempenho}
                className="btn-primary mt-6"
              >
                Tentar novamente
              </button>
            </div>
          </section>
        </main>
      </AppLayout>
    );
  }

  if (!dados) {
    return null;
  }

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
                  Seu desempenho
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Desempenho
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
                Acompanhe seus resultados, identifique pontos fortes
                e descubra quais conteúdos merecem mais revisão.
              </p>
            </div>

            <button
              type="button"
              onClick={carregarDesempenho}
              className="btn-secondary"
            >
              ↻ Atualizar
            </button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              respondidas
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
              {dados.resumo.percentual}%
            </p>

            <p className="mt-1 text-sm text-neutral-500">
              taxa geral de acerto
            </p>
          </div>
        </section>

        <section className="premium-card mt-6 animate-slide-up p-6 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="badge badge-orange">
                Visão geral
              </span>

              <h2 className="mt-3 text-xl font-bold text-white">
                Aproveitamento geral
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-neutral-500">
                Seu percentual de acertos considerando todas as
                questões que você respondeu.
              </p>
            </div>

            <div className="sm:text-right">
              <p
                className={
                  "text-4xl font-bold " +
                  obterCorPercentual(dados.resumo.percentual)
                }
              >
                {dados.resumo.percentual}%
              </p>

              <p className="mt-1 text-xs text-neutral-600">
                aproveitamento
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="progress-track h-3">
              <div
                className={
                  "h-full rounded-full transition-all duration-700 " +
                  obterBarraPercentual(dados.resumo.percentual)
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
        </section>

        <section className="premium-card mt-6 animate-slide-up p-6 sm:p-7">
          <div className="mb-7">
            <span className="badge">
              Análise
            </span>

            <h2 className="mt-3 text-xl font-bold text-white">
              Desempenho por disciplina
            </h2>

            <p className="mt-1 text-sm leading-6 text-neutral-500">
              Compare seu aproveitamento em cada disciplina.
            </p>
          </div>

          {dados.disciplinas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-neutral-500">
                ◈
              </div>

              <p className="mt-4 text-sm text-neutral-500">
                Você ainda não respondeu questões.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {dados.disciplinas.map(function (item, index) {
                return (
                  <div
                    key={item.disciplina}
                    className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5 transition hover:border-white/[0.09]"
                    style={{
                      animationDelay:
                        index < 10 ? index * 40 + "ms" : "0ms",
                    }}
                  >
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {item.disciplina}
                        </p>

                        <p className="mt-1 text-xs text-neutral-600">
                          {item.acertos} acertos
                          {" · "}
                          {item.erros} erros
                          {" · "}
                          {item.total} questões
                        </p>
                      </div>

                      <span
                        className={
                          "shrink-0 text-lg font-bold " +
                          obterCorPercentual(item.percentual)
                        }
                      >
                        {item.percentual}%
                      </span>
                    </div>

                    <div className="progress-track h-2">
                      <div
                        className={
                          "h-full rounded-full transition-all duration-500 " +
                          obterBarraPercentual(item.percentual)
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

        <section className="premium-card mt-6 animate-slide-up p-6 sm:p-7">
          <div className="mb-7">
            <span className="badge">
              Conteúdo
            </span>

            <h2 className="mt-3 text-xl font-bold text-white">
              Desempenho por tema
            </h2>

            <p className="mt-1 text-sm leading-6 text-neutral-500">
              Identifique os conteúdos que precisam de mais revisão.
            </p>
          </div>

          {dados.temas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-neutral-500">
                ◌
              </div>

              <p className="mt-4 text-sm text-neutral-500">
                Você ainda não respondeu questões.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {dados.temas.map(function (item, index) {
                return (
                  <div
                    key={item.tema}
                    className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5 transition hover:-translate-y-0.5 hover:border-white/[0.09]"
                    style={{
                      animationDelay:
                        index < 10 ? index * 40 + "ms" : "0ms",
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-white">
                          {item.tema}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-neutral-600">
                          {item.total} questões
                          {" · "}
                          {item.acertos} acertos
                          {" · "}
                          {item.erros} erros
                        </p>
                      </div>

                      <span
                        className={
                          "shrink-0 font-bold " +
                          obterCorPercentual(item.percentual)
                        }
                      >
                        {item.percentual}%
                      </span>
                    </div>

                    <div className="progress-track mt-5 h-2">
                      <div
                        className={
                          "h-full rounded-full transition-all duration-500 " +
                          obterBarraPercentual(item.percentual)
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

        <section className="premium-card mt-6 animate-slide-up p-6 sm:p-7">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <span className="badge">
                Histórico
              </span>

              <h2 className="mt-3 text-xl font-bold text-white">
                Últimas respostas
              </h2>

              <p className="mt-1 text-sm leading-6 text-neutral-500">
                Suas 10 respostas mais recentes.
              </p>
            </div>

            <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-neutral-500 sm:flex">
              ◷
            </div>
          </div>

          {dados.ultimasRespostas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] p-10 text-center">
              <p className="text-sm text-neutral-500">
                Nenhuma resposta registrada ainda.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {dados.ultimasRespostas.map(function (resposta) {
                return (
                  <div
                    key={resposta.id}
                    className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4 transition hover:border-white/[0.09]"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={
                          resposta.correta
                            ? "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400"
                            : "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400"
                        }
                      >
                        {resposta.correta ? "✓" : "×"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <p className="line-clamp-2 text-sm font-medium leading-6 text-neutral-200">
                            {resposta.questao}
                          </p>

                          <span
                            className={
                              resposta.correta
                                ? "shrink-0 text-xs font-semibold text-emerald-400"
                                : "shrink-0 text-xs font-semibold text-rose-400"
                            }
                          >
                            {resposta.correta
                              ? "Acertou"
                              : "Errou"}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="badge badge-orange">
                            {resposta.disciplina}
                          </span>

                          <span className="badge">
                            {resposta.tema}
                          </span>
                        </div>

                        <p className="mt-3 text-xs text-neutral-700">
                          {formatarData(
                            resposta.respondidaAt
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="flex justify-center pb-8 pt-6">
          <button
            type="button"
            onClick={carregarDesempenho}
            className="btn-secondary"
          >
            ↻ Atualizar desempenho
          </button>
        </div>
      </main>
    </AppLayout>
  );
}