"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";

type Questao = {
  id: number;
  disciplinaId: number;
  disciplina?: {
    id: number;
    nome: string;
  };
};

type Resposta = {
  id: number;
  correta: boolean;
  respondidaAt: string;
  questao?: {
    id: number;
    enunciado: string;
    disciplina?: {
      id: number;
      nome: string;
    };
  };
};

type Disciplina = {
  id: number;
  nome: string;
};

type Financeiro = {
  receitas: number;
  despesas: number;
  saldo: number;
};

type DadosFinanceiros = {
  movimentacoes: unknown[];
  resumo: Financeiro;
};

export default function Dashboard() {
  const [questoes, setQuestoes] =
    useState<Questao[]>([]);

  const [respostas, setRespostas] =
    useState<Resposta[]>([]);

  const [disciplinas, setDisciplinas] =
    useState<Disciplina[]>([]);

  const [financeiro, setFinanceiro] =
    useState<Financeiro>({
      receitas: 0,
      despesas: 0,
      saldo: 0,
    });

  const [carregando, setCarregando] =
    useState(true);

  useEffect(function () {
    async function carregarDados() {
      try {
        const [
          respostaQuestoes,
          respostaRespostas,
          respostaDisciplinas,
          respostaFinanceiro,
        ] = await Promise.all([
          fetch("/api/questoes"),
          fetch("/api/respostas"),
          fetch("/api/disciplinas"),
          fetch("/api/financeiro"),
        ]);

        if (respostaQuestoes.ok) {
          const dados =
            await respostaQuestoes.json();

          setQuestoes(
            Array.isArray(dados)
              ? dados
              : []
          );
        }

        if (respostaRespostas.ok) {
          const dados =
            await respostaRespostas.json();

          setRespostas(
            Array.isArray(dados)
              ? dados
              : []
          );
        }

        if (respostaDisciplinas.ok) {
          const dados =
            await respostaDisciplinas.json();

          setDisciplinas(
            Array.isArray(dados)
              ? dados
              : []
          );
        }

        if (respostaFinanceiro.ok) {
          const dados: DadosFinanceiros =
            await respostaFinanceiro.json();

          if (dados.resumo) {
            setFinanceiro(
              dados.resumo
            );
          }
        }
      } catch (error) {
        console.error(
          "Erro ao carregar dashboard:",
          error
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const totalQuestoes =
    questoes.length;

  const totalRespondidas =
    respostas.length;

  const totalAcertos =
    respostas.filter(function (
      resposta
    ) {
      return resposta.correta;
    }).length;

  const percentual =
    totalRespondidas > 0
      ? Math.round(
          (totalAcertos /
            totalRespondidas) *
            100
        )
      : 0;

  const desempenhoDisciplinas =
    useMemo(function () {
      return disciplinas
        .map(function (disciplina) {
          const respostasDaDisciplina =
            respostas.filter(
              function (resposta) {
                return (
                  resposta.questao
                    ?.disciplina?.id ===
                  disciplina.id
                );
              }
            );

          const total =
            respostasDaDisciplina.length;

          const acertos =
            respostasDaDisciplina.filter(
              function (resposta) {
                return resposta.correta;
              }
            ).length;

          const percentual =
            total > 0
              ? Math.round(
                  (acertos / total) *
                    100
                )
              : 0;

          return {
            id: disciplina.id,
            nome: disciplina.nome,
            total: total,
            acertos: acertos,
            percentual: percentual,
          };
        })
        .filter(function (item) {
          return item.total > 0;
        })
        .sort(function (a, b) {
          return (
            b.total - a.total
          );
        })
        .slice(0, 5);
    }, [disciplinas, respostas]);

  const atividadeRecente =
    respostas.slice(0, 5);

  const percentualQuestoesRespondidas =
    totalQuestoes > 0
      ? Math.min(
          100,
          Math.round(
            (totalRespondidas /
              totalQuestoes) *
              100
          )
        )
      : 0;

  function formatarData(
    data: string
  ) {
    return new Date(
      data
    ).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "short",
      }
    );
  }

  function formatarMoeda(
    valor: number
  ) {
    return valor.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
  }

  function obterMensagem() {
    if (totalRespondidas === 0) {
      return "Comece sua primeira sessão de estudos.";
    }

    if (percentual >= 90) {
      return "Excelente desempenho. Continue mantendo o ritmo.";
    }

    if (percentual >= 75) {
      return "Bom ritmo. Mais algumas questões podem elevar seu desempenho.";
    }

    if (percentual >= 50) {
      return "Você está evoluindo. Foque nas questões que errou.";
    }

    return "Vamos começar. Cada questão respondida melhora seu domínio.";
  }

  return (
    <AppLayout
      titulo="Dashboard"
      subtitulo="Seu centro de estudos"
      paginaAtiva="dashboard"
    >
      {/* HERO */}

      <section className="animate-fade-in mb-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0b0b0b] px-5 py-6 md:px-7 md:py-7">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-orange-500/[0.045] blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.7)]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
                  Jankinho Study
                </span>
              </div>

              <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Seu espaço para
                estudar melhor.
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
                {obterMensagem()}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/questoes"
                className="btn-primary"
              >
                Resolver questões
                <span>→</span>
              </Link>

              <Link
                href="/flashcards"
                className="btn-secondary"
              >
                Flashcards
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MÉTRICAS */}

      <section className="mb-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="premium-card animate-fade-in p-4 animation-delay-75">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-600">
                  Questões
                </p>

                <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                  {carregando ? (
                    <span className="skeleton inline-block h-7 w-14" />
                  ) : (
                    totalQuestoes
                  )}
                </p>

                <p className="mt-1 text-[11px] text-neutral-600">
                  disponíveis
                </p>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035] text-xs text-neutral-500">
                ✓
              </div>
            </div>
          </div>

          <div className="premium-card animate-fade-in p-4 animation-delay-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-600">
                  Respondidas
                </p>

                <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                  {carregando ? (
                    <span className="skeleton inline-block h-7 w-14" />
                  ) : (
                    totalRespondidas
                  )}
                </p>

                <p className="mt-1 text-[11px] text-neutral-600">
                  por você
                </p>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035] text-xs text-neutral-500">
                ◒
              </div>
            </div>
          </div>

          <div className="premium-card animate-fade-in p-4 animation-delay-150">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-600">
                  Acertos
                </p>

                <p className="mt-3 text-2xl font-semibold tracking-tight text-emerald-400">
                  {carregando ? (
                    <span className="skeleton inline-block h-7 w-14" />
                  ) : (
                    totalAcertos
                  )}
                </p>

                <p className="mt-1 text-[11px] text-neutral-600">
                  respostas corretas
                </p>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/[0.07] text-xs text-emerald-400">
                ↑
              </div>
            </div>
          </div>

          <div className="premium-card animate-fade-in p-4 animation-delay-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-600">
                  Aproveitamento
                </p>

                <p className="mt-3 text-2xl font-semibold tracking-tight text-orange-400">
                  {carregando ? (
                    <span className="skeleton inline-block h-7 w-14" />
                  ) : (
                    percentual + "%"
                  )}
                </p>

                <p className="mt-1 text-[11px] text-neutral-600">
                  desempenho geral
                </p>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/[0.07] text-xs text-orange-400">
                %
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        {/* DESEMPENHO */}

        <div className="premium-card animate-slide-up p-5 md:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">
                Desempenho por disciplina
              </p>

              <p className="mt-1 text-[11px] text-neutral-600">
                Onde você está concentrando seus estudos
              </p>
            </div>

            <Link
              href="/desempenho"
              className="text-[11px] font-semibold text-neutral-600 transition hover:text-orange-400"
            >
              Ver detalhes →
            </Link>
          </div>

          {carregando ? (
            <div className="space-y-5">
              {[1, 2, 3].map(
                function (item) {
                  return (
                    <div
                      key={item}
                      className="space-y-2"
                    >
                      <div className="skeleton h-3 w-32" />
                      <div className="skeleton h-1.5 w-full" />
                    </div>
                  );
                }
              )}
            </div>
          ) : desempenhoDisciplinas.length ===
            0 ? (
            <div className="flex min-h-[190px] flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/[0.07] text-orange-400">
                +
              </div>

              <p className="text-sm font-medium text-neutral-300">
                Ainda não há dados
              </p>

              <p className="mt-1 max-w-xs text-[11px] leading-5 text-neutral-600">
                Resolva algumas questões para acompanhar seu desempenho por disciplina.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {desempenhoDisciplinas.map(
                function (item) {
                  return (
                    <div
                      key={item.id}
                      className="group"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="truncate text-xs font-medium text-neutral-300">
                          {item.nome}
                        </p>

                        <div className="flex shrink-0 items-center gap-2">
                          <span className="text-[10px] text-neutral-600">
                            {item.total}{" "}
                            questões
                          </span>

                          <span
                            className={
                              "text-xs font-semibold " +
                              (item.percentual >=
                              80
                                ? "text-emerald-400"
                                : item.percentual >=
                                  60
                                ? "text-orange-400"
                                : "text-rose-400")
                            }
                          >
                            {
                              item.percentual
                            }
                            %
                          </span>
                        </div>
                      </div>

                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{
                            width:
                              item.percentual +
                              "%",
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* PROGRESSO */}

        <div className="premium-card animate-slide-up animation-delay-100 p-5 md:p-6">
          <div className="mb-6">
            <p className="text-sm font-semibold text-white">
              Seu progresso
            </p>

            <p className="mt-1 text-[11px] text-neutral-600">
              Questões já exploradas
            </p>
          </div>

          <div className="flex items-center justify-center py-2">
            <div className="relative flex h-40 w-40 items-center justify-center">
              <svg
                className="absolute inset-0 h-full w-full -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="7"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray="263.9"
                  strokeDashoffset={
                    263.9 -
                    (263.9 *
                      percentualQuestoesRespondidas) /
                      100
                  }
                  className="transition-all duration-1000"
                />
              </svg>

              <div className="relative text-center">
                <p className="text-3xl font-semibold text-white">
                  {
                    percentualQuestoesRespondidas
                  }
                  %
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-neutral-600">
                  explorado
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/[0.05] pt-4">
            <div>
              <p className="text-[10px] text-neutral-600">
                Respondidas
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                {totalRespondidas}
              </p>
            </div>

            <div className="h-8 w-px bg-white/[0.06]" />

            <div className="text-right">
              <p className="text-[10px] text-neutral-600">
                Disponíveis
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                {totalQuestoes}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PARTE INFERIOR */}

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        {/* ATIVIDADE */}

        <div className="premium-card animate-slide-up animation-delay-200 p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Atividade recente
              </p>

              <p className="mt-1 text-[11px] text-neutral-600">
                Suas últimas respostas
              </p>
            </div>

            <Link
              href="/desempenho"
              className="text-[11px] font-semibold text-neutral-600 transition hover:text-orange-400"
            >
              Ver tudo →
            </Link>
          </div>

          {atividadeRecente.length ===
          0 ? (
            <div className="flex min-h-[145px] items-center justify-center text-center">
              <div>
                <p className="text-sm text-neutral-400">
                  Nenhuma atividade ainda
                </p>

                <Link
                  href="/questoes"
                  className="mt-2 inline-block text-[11px] font-semibold text-orange-400 hover:text-orange-300"
                >
                  Começar agora →
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.045]">
              {atividadeRecente.map(
                function (resposta) {
                  return (
                    <div
                      key={resposta.id}
                      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div
                        className={
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs " +
                          (resposta.correta
                            ? "bg-emerald-500/[0.08] text-emerald-400"
                            : "bg-rose-500/[0.08] text-rose-400")
                        }
                      >
                        {resposta.correta
                          ? "✓"
                          : "×"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-neutral-300">
                          {resposta.questao
                            ?.enunciado ||
                            "Questão respondida"}
                        </p>

                        <p className="mt-0.5 text-[10px] text-neutral-600">
                          {resposta
                            .questao
                            ?.disciplina
                            ?.nome ||
                            "Sem disciplina"}{" "}
                          ·{" "}
                          {formatarData(
                            resposta.respondidaAt
                          )}
                        </p>
                      </div>

                      <span
                        className={
                          "shrink-0 text-[10px] font-semibold " +
                          (resposta.correta
                            ? "text-emerald-400"
                            : "text-rose-400")
                        }
                      >
                        {resposta.correta
                          ? "Acerto"
                          : "Erro"}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* FINANÇAS + AÇÕES */}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="premium-card animate-slide-up animation-delay-300 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Finanças
                </p>

                <p className="mt-1 text-[11px] text-neutral-600">
                  Visão geral
                </p>
              </div>

              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/[0.07] text-[11px] text-orange-400">
                R$
              </span>
            </div>

            <p className="mt-6 text-xl font-semibold text-white">
              {formatarMoeda(
                financeiro.saldo
              )}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-neutral-600">
                  Receitas
                </p>

                <p className="mt-1 text-xs font-medium text-emerald-400">
                  {formatarMoeda(
                    financeiro.receitas
                  )}
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-wider text-neutral-600">
                  Despesas
                </p>

                <p className="mt-1 text-xs font-medium text-rose-400">
                  {formatarMoeda(
                    financeiro.despesas
                  )}
                </p>
              </div>
            </div>

            <Link
              href="/financas"
              className="mt-5 block text-[11px] font-semibold text-neutral-600 transition hover:text-orange-400"
            >
              Abrir finanças →
            </Link>
          </div>

          <div className="premium-card animate-slide-up animation-delay-400 p-5">
            <p className="text-sm font-semibold text-white">
              Acesso rápido
            </p>

            <p className="mt-1 text-[11px] text-neutral-600">
              Continue de onde parou
            </p>

            <div className="mt-5 space-y-2">
              <Link
                href="/questoes"
                className="group flex items-center gap-3 rounded-xl border border-white/[0.045] bg-white/[0.018] p-3 transition hover:border-orange-500/15 hover:bg-orange-500/[0.035]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/[0.08] text-xs text-orange-400">
                  ✓
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-neutral-300">
                    Resolver questões
                  </p>

                  <p className="text-[9px] text-neutral-600">
                    Praticar agora
                  </p>
                </div>

                <span className="text-xs text-neutral-700 transition group-hover:translate-x-0.5 group-hover:text-orange-400">
                  →
                </span>
              </Link>

              <Link
                href="/flashcards"
                className="group flex items-center gap-3 rounded-xl border border-white/[0.045] bg-white/[0.018] p-3 transition hover:border-orange-500/15 hover:bg-orange-500/[0.035]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-xs text-neutral-500">
                  ▣
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-neutral-300">
                    Revisar flashcards
                  </p>

                  <p className="text-[9px] text-neutral-600">
                    Reforçar conteúdo
                  </p>
                </div>

                <span className="text-xs text-neutral-700 transition group-hover:translate-x-0.5 group-hover:text-orange-400">
                  →
                </span>
              </Link>

              <Link
                href="/desempenho"
                className="group flex items-center gap-3 rounded-xl border border-white/[0.045] bg-white/[0.018] p-3 transition hover:border-orange-500/15 hover:bg-orange-500/[0.035]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-xs text-neutral-500">
                  ◒
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-neutral-300">
                    Ver desempenho
                  </p>

                  <p className="text-[9px] text-neutral-600">
                    Acompanhar evolução
                  </p>
                </div>

                <span className="text-xs text-neutral-700 transition group-hover:translate-x-0.5 group-hover:text-orange-400">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}