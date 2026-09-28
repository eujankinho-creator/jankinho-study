"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";

type RankingItem = {
  posicao: number | null;
  usuarioId: number;
  nome: string;
  total: number;
  acertos: number;
  erros: number;
  percentual: number;
  elegivel: boolean;
};

type UsuarioAtual = {
  id: number;
  nome: string;
  email: string;
};

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [usuarios, setUsuarios] = useState<RankingItem[]>([]);
  const [usuarioAtual, setUsuarioAtual] =
    useState<UsuarioAtual | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarRanking() {
    try {
      setCarregando(true);
      setErro("");

      const [respostaRanking, respostaUsuario] =
        await Promise.all([
          fetch("/api/ranking"),
          fetch("/api/auth/me"),
        ]);

      if (!respostaRanking.ok) {
        throw new Error(
          "Não foi possível carregar o ranking."
        );
      }

      const dadosRanking = await respostaRanking.json();
      const dadosUsuario = await respostaUsuario.json();

      setRanking(dadosRanking.ranking || []);
      setUsuarios(dadosRanking.usuarios || []);

      if (dadosUsuario.autenticado) {
        setUsuarioAtual(dadosUsuario.usuario);
      }
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível carregar o ranking.");
      }
    } finally {
      setCarregando(false);
    }
  }

  useEffect(function () {
    carregarRanking();
  }, []);

  function obterIniciais(nome: string) {
    const partes = nome
      .trim()
      .split(" ")
      .filter(Boolean);

    if (partes.length === 0) {
      return "?";
    }

    if (partes.length === 1) {
      return partes[0].slice(0, 2).toUpperCase();
    }

    return (
      partes[0][0] +
      partes[partes.length - 1][0]
    ).toUpperCase();
  }

  function medalha(posicao: number | null) {
    if (posicao === 1) {
      return "🥇";
    }

    if (posicao === 2) {
      return "🥈";
    }

    if (posicao === 3) {
      return "🥉";
    }

    if (posicao) {
      return "#" + posicao;
    }

    return "—";
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

  function obterEstiloPodio(posicao: number) {
    if (posicao === 1) {
      return "border-orange-500/25 bg-orange-500/[0.055] shadow-[0_20px_60px_rgba(249,115,22,0.08)]";
    }

    if (posicao === 2) {
      return "border-white/[0.09] bg-white/[0.025]";
    }

    return "border-orange-500/10 bg-orange-500/[0.025]";
  }

  const primeiro = ranking[0];
  const segundo = ranking[1];
  const terceiro = ranking[2];

  const podio = [
    {
      item: segundo,
      ordem: 2,
    },
    {
      item: primeiro,
      ordem: 1,
    },
    {
      item: terceiro,
      ordem: 3,
    },
  ];

  const usuariosSemClassificacao =
    usuarios.filter(function (usuario) {
      return !usuario.elegivel;
    });

  if (carregando) {
    return (
      <AppLayout>
        <main className="mx-auto max-w-7xl animate-fade-in px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton mt-3 h-9 w-64 rounded" />
            <div className="skeleton mt-3 h-5 w-80 rounded" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map(function (item) {
              return (
                <div
                  key={item}
                  className="premium-card p-7"
                >
                  <div className="flex justify-center">
                    <div className="skeleton h-10 w-10 rounded-full" />
                  </div>

                  <div className="mx-auto mt-5 skeleton h-16 w-16 rounded-full" />
                  <div className="mx-auto mt-4 skeleton h-5 w-32 rounded" />
                  <div className="mx-auto mt-3 skeleton h-9 w-20 rounded" />

                  <div className="mt-6 grid grid-cols-3 gap-2">
                    <div className="skeleton h-16 rounded-xl" />
                    <div className="skeleton h-16 rounded-xl" />
                    <div className="skeleton h-16 rounded-xl" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="premium-card mt-6 p-6">
            <div className="skeleton h-6 w-48 rounded" />

            <div className="mt-6 space-y-3">
              {[1, 2, 3, 4].map(function (item) {
                return (
                  <div
                    key={item}
                    className="skeleton h-20 rounded-2xl"
                  />
                );
              })}
            </div>
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="mx-auto max-w-7xl animate-fade-in px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="badge badge-orange">
                  Competição
                </span>

                <span className="text-xs text-neutral-600">
                  Desempenho acadêmico
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ranking
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
                Acompanhe o desempenho dos estudantes com base
                nas questões respondidas.
              </p>
            </div>

            <button
              type="button"
              onClick={carregarRanking}
              className="btn-secondary"
            >
              ↻ Atualizar
            </button>
          </div>
        </section>

        {erro && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] px-5 py-4">
            <p className="text-sm text-rose-300">
              {erro}
            </p>

            <button
              type="button"
              onClick={function () {
                setErro("");
              }}
              className="text-xs text-rose-400 transition hover:text-white"
            >
              Fechar
            </button>
          </div>
        )}

        {ranking.length === 0 ? (
          <section className="premium-card flex min-h-[420px] items-center justify-center p-10 text-center">
            <div>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10 text-3xl">
                🏆
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white">
                Ainda não há classificados
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500">
                Os usuários precisam responder pelo menos
                5 questões para entrar na classificação.
              </p>

              <button
                type="button"
                onClick={carregarRanking}
                className="btn-primary mt-6"
              >
                Atualizar ranking
              </button>
            </div>
          </section>
        ) : (
          <>
            <section className="mb-6">
              <div className="mb-5">
                <span className="badge">
                  Destaques
                </span>

                <h2 className="mt-3 text-xl font-bold text-white">
                  Melhores desempenhos
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Os três primeiros classificados aparecem
                  em destaque.
                </p>
              </div>

              <div className="grid items-end gap-4 md:grid-cols-3 md:gap-5">
                {podio.map(function (podioItem) {
                  const item = podioItem.item;

                  if (!item) {
                    return (
                      <div
                        key={podioItem.ordem}
                        className="hidden min-h-[360px] md:block"
                      />
                    );
                  }

                  const ehUsuarioAtual =
                    usuarioAtual?.id === item.usuarioId;

                  return (
                    <div
                      key={item.usuarioId}
                      className={
                        "premium-card relative p-6 text-center transition-all duration-300 hover:-translate-y-1 " +
                        obterEstiloPodio(
                          item.posicao || podioItem.ordem
                        ) +
                        (item.posicao === 1
                          ? " md:-translate-y-5"
                          : "")
                      }
                    >
                      {ehUsuarioAtual && (
                        <div className="absolute right-4 top-4 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-400">
                          Você
                        </div>
                      )}

                      <div className="text-4xl">
                        {medalha(item.posicao)}
                      </div>

                      <div className="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035] text-lg font-bold text-white">
                        {obterIniciais(item.nome)}
                      </div>

                      <h3 className="mt-4 truncate text-lg font-bold text-white">
                        {item.nome}
                      </h3>

                      <p
                        className={
                          "mt-2 text-4xl font-black " +
                          obterCorPercentual(item.percentual)
                        }
                      >
                        {item.percentual}%
                      </p>

                      <p className="mt-1 text-xs text-neutral-600">
                        aproveitamento
                      </p>

                      <div className="mt-5 progress-track h-2">
                        <div
                          className={
                            "h-full rounded-full transition-all duration-700 " +
                            obterBarraPercentual(
                              item.percentual
                            )
                          }
                          style={{
                            width:
                              item.percentual + "%",
                          }}
                        />
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-2">
                        <div className="rounded-xl border border-white/[0.05] bg-black/20 p-3">
                          <p className="font-bold text-emerald-400">
                            {item.acertos}
                          </p>

                          <p className="mt-1 text-[10px] uppercase tracking-wide text-neutral-600">
                            Acertos
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/[0.05] bg-black/20 p-3">
                          <p className="font-bold text-rose-400">
                            {item.erros}
                          </p>

                          <p className="mt-1 text-[10px] uppercase tracking-wide text-neutral-600">
                            Erros
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/[0.05] bg-black/20 p-3">
                          <p className="font-bold text-white">
                            {item.total}
                          </p>

                          <p className="mt-1 text-[10px] uppercase tracking-wide text-neutral-600">
                            Questões
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="premium-card animate-slide-up p-6 sm:p-7">
              <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="badge badge-orange">
                    Classificação
                  </span>

                  <h2 className="mt-3 text-xl font-bold text-white">
                    Todos os usuários
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    Usuários com pelo menos 5 questões
                    aparecem classificados.
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] px-4 py-3">
                  <p className="text-xs text-neutral-600">
                    Classificados
                  </p>

                  <p className="mt-1 text-lg font-bold text-white">
                    {ranking.length}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {usuarios.map(function (item, index) {
                  const ehUsuarioAtual =
                    usuarioAtual?.id === item.usuarioId;

                  return (
                    <div
                      key={item.usuarioId}
                      className={
                        "animate-slide-up rounded-2xl border p-4 transition-all duration-200 " +
                        (ehUsuarioAtual
                          ? "border-orange-500/20 bg-orange-500/[0.045] shadow-[0_10px_30px_rgba(249,115,22,0.05)]"
                          : "border-white/[0.05] bg-white/[0.012] hover:border-white/[0.09] hover:bg-white/[0.02]")
                      }
                      style={{
                        animationDelay:
                          index < 12
                            ? index * 30 + "ms"
                            : "0ms",
                      }}
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="flex min-w-0 items-center gap-4 lg:w-[340px]">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-sm font-bold text-neutral-300">
                            {medalha(item.posicao)}
                          </div>

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-xs font-bold text-orange-400">
                            {obterIniciais(item.nome)}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate font-semibold text-white">
                                {item.nome}
                              </p>

                              {ehUsuarioAtual && (
                                <span className="badge badge-orange">
                                  Você
                                </span>
                              )}
                            </div>

                            {!item.elegivel && (
                              <p className="mt-1 text-xs text-neutral-600">
                                Ainda não classificado
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
                          <div className="rounded-xl border border-white/[0.04] bg-black/20 p-3 text-center">
                            <p
                              className={
                                "text-sm font-bold " +
                                (item.elegivel
                                  ? obterCorPercentual(
                                      item.percentual
                                    )
                                  : "text-neutral-600")
                              }
                            >
                              {item.elegivel
                                ? item.percentual + "%"
                                : "—"}
                            </p>

                            <p className="mt-1 text-[10px] uppercase tracking-wide text-neutral-600">
                              Aproveitamento
                            </p>
                          </div>

                          <div className="rounded-xl border border-white/[0.04] bg-black/20 p-3 text-center">
                            <p className="text-sm font-bold text-emerald-400">
                              {item.acertos}
                            </p>

                            <p className="mt-1 text-[10px] uppercase tracking-wide text-neutral-600">
                              Acertos
                            </p>
                          </div>

                          <div className="rounded-xl border border-white/[0.04] bg-black/20 p-3 text-center">
                            <p className="text-sm font-bold text-rose-400">
                              {item.erros}
                            </p>

                            <p className="mt-1 text-[10px] uppercase tracking-wide text-neutral-600">
                              Erros
                            </p>
                          </div>

                          <div className="rounded-xl border border-white/[0.04] bg-black/20 p-3 text-center">
                            <p className="text-sm font-bold text-white">
                              {item.total}
                            </p>

                            <p className="mt-1 text-[10px] uppercase tracking-wide text-neutral-600">
                              Questões
                            </p>
                          </div>
                        </div>
                      </div>

                      {item.elegivel && (
                        <div className="mt-4 pl-0 lg:pl-[88px]">
                          <div className="progress-track h-1.5">
                            <div
                              className={
                                "h-full rounded-full transition-all duration-500 " +
                                obterBarraPercentual(
                                  item.percentual
                                )
                              }
                              style={{
                                width:
                                  item.percentual + "%",
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {usuariosSemClassificacao.length > 0 && (
              <div className="mt-4 rounded-2xl border border-white/[0.05] bg-white/[0.015] px-5 py-4 text-center text-xs leading-5 text-neutral-600">
                A classificação considera apenas usuários
                com 5 ou mais questões respondidas.
              </div>
            )}
          </>
        )}

        <div className="flex justify-center pb-8 pt-2">
          <button
            type="button"
            onClick={carregarRanking}
            className="btn-secondary"
          >
            ↻ Atualizar ranking
          </button>
        </div>
      </main>
    </AppLayout>
  );
}