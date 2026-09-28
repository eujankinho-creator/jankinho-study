"use client";

import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";

type Movimentacao = {
  id: number;
  descricao: string;
  valor: number | string;
  tipo: "RECEITA" | "DESPESA";
  data: string;
};

type Resumo = {
  receitas: number;
  despesas: number;
  saldo: number;
};

export default function FinancasPage() {
  const [movimentacoes, setMovimentacoes] = useState<
    Movimentacao[]
  >([]);

  const [resumo, setResumo] = useState<Resumo>({
    receitas: 0,
    despesas: 0,
    saldo: 0,
  });

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] =
    useState<"RECEITA" | "DESPESA">("RECEITA");
  const [data, setData] = useState("");

  const [editandoId, setEditandoId] = useState<number | null>(
    null
  );

  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");

  async function carregarMovimentacoes() {
    try {
      setCarregando(true);
      setErro("");

      const parametros = new URLSearchParams();

      if (inicio) {
        parametros.set("inicio", inicio);
      }

      if (fim) {
        parametros.set("fim", fim);
      }

      const url =
        "/api/financeiro" +
        (parametros.toString()
          ? "?" + parametros.toString()
          : "");

      const resposta = await fetch(url);

      if (!resposta.ok) {
        throw new Error("Erro ao carregar finanças.");
      }

      const dados = await resposta.json();

      setMovimentacoes(dados.movimentacoes || []);

      setResumo(
        dados.resumo || {
          receitas: 0,
          despesas: 0,
          saldo: 0,
        }
      );
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível carregar os dados financeiros."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(function () {
    carregarMovimentacoes();
  }, [inicio, fim]);

  function limparFormulario() {
    setDescricao("");
    setValor("");
    setTipo("RECEITA");
    setData("");
    setEditandoId(null);
  }

  function iniciarEdicao(item: Movimentacao) {
    setEditandoId(item.id);
    setDescricao(item.descricao);
    setValor(String(item.valor));
    setTipo(item.tipo);
    setData(item.data.slice(0, 10));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function salvarMovimentacao() {
    if (!descricao.trim() || !valor) {
      setErro("Preencha a descrição e o valor.");
      return;
    }

    const valorNumerico = Number(
      valor.replace(",", ".")
    );

    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      setErro("Informe um valor financeiro válido.");
      return;
    }

    try {
      setSalvando(true);
      setErro("");

      const resposta = await fetch("/api/financeiro", {
        method: editandoId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editandoId,
          descricao: descricao.trim(),
          valor: valorNumerico,
          tipo: tipo,
          data: data || undefined,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.error || "Não foi possível salvar."
        );
      }

      limparFormulario();

      await carregarMovimentacoes();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro(
          "Não foi possível salvar a movimentação."
        );
      }
    } finally {
      setSalvando(false);
    }
  }

  async function excluirMovimentacao(id: number) {
    const confirmar = window.confirm(
      "Deseja realmente excluir esta movimentação?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setErro("");

      const resposta = await fetch(
        "/api/financeiro?id=" + id,
        {
          method: "DELETE",
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.error || "Não foi possível excluir."
        );
      }

      if (editandoId === id) {
        limparFormulario();
      }

      await carregarMovimentacoes();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro(
          "Não foi possível excluir a movimentação."
        );
      }
    }
  }

  function formatarMoeda(valorAtual: number | string) {
    return Number(valorAtual).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarData(dataAtual: string) {
    return new Date(dataAtual).toLocaleDateString(
      "pt-BR"
    );
  }

  const maiorValor = useMemo(function () {
    if (movimentacoes.length === 0) {
      return 1;
    }

    return Math.max.apply(
      null,
      movimentacoes.map(function (item) {
        return Number(item.valor);
      })
    );
  }, [movimentacoes]);

  const percentualReceitas =
    resumo.receitas > 0
      ? Math.min(
          (resumo.receitas / maiorValor) * 100,
          100
        )
      : 0;

  const percentualDespesas =
    resumo.despesas > 0
      ? Math.min(
          (resumo.despesas / maiorValor) * 100,
          100
        )
      : 0;

  const quantidadeReceitas = movimentacoes.filter(
    function (item) {
      return item.tipo === "RECEITA";
    }
  ).length;

  const quantidadeDespesas = movimentacoes.filter(
    function (item) {
      return item.tipo === "DESPESA";
    }
  ).length;

  return (
    <AppLayout>
      <main className="mx-auto max-w-7xl animate-fade-in px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="badge badge-orange">
                  Pessoal
                </span>

                <span className="text-xs text-neutral-600">
                  Controle financeiro
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Finanças
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
                Organize suas receitas, despesas e acompanhe
                seu saldo em um só lugar.
              </p>
            </div>

            <button
              type="button"
              onClick={carregarMovimentacoes}
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

        <section className="grid gap-4 md:grid-cols-3">
          <div className="premium-card border-emerald-500/10 bg-emerald-500/[0.025] p-6 transition duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
                  Receitas
                </p>

                <p className="mt-1 text-xs text-neutral-600">
                  Total recebido
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-lg text-emerald-400">
                ↑
              </div>
            </div>

            <p className="mt-6 text-3xl font-black text-emerald-400">
              {formatarMoeda(resumo.receitas)}
            </p>

            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-neutral-600">
                {quantidadeReceitas} lançamento
                {quantidadeReceitas === 1 ? "" : "s"}
              </span>

              <span className="text-emerald-400">
                Entrada
              </span>
            </div>
          </div>

          <div className="premium-card border-rose-500/10 bg-rose-500/[0.025] p-6 transition duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-400">
                  Despesas
                </p>

                <p className="mt-1 text-xs text-neutral-600">
                  Total gasto
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/10 text-lg text-rose-400">
                ↓
              </div>
            </div>

            <p className="mt-6 text-3xl font-black text-rose-400">
              {formatarMoeda(resumo.despesas)}
            </p>

            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-neutral-600">
                {quantidadeDespesas} lançamento
                {quantidadeDespesas === 1 ? "" : "s"}
              </span>

              <span className="text-rose-400">
                Saída
              </span>
            </div>
          </div>

          <div
            className={
              "premium-card p-6 transition duration-300 hover:-translate-y-1 " +
              (resumo.saldo >= 0
                ? "border-orange-500/15 bg-orange-500/[0.035]"
                : "border-rose-500/15 bg-rose-500/[0.035]")
            }
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={
                    "text-xs font-semibold uppercase tracking-[0.16em] " +
                    (resumo.saldo >= 0
                      ? "text-orange-400"
                      : "text-rose-400")
                  }
                >
                  Saldo
                </p>

                <p className="mt-1 text-xs text-neutral-600">
                  Resultado do período
                </p>
              </div>

              <div
                className={
                  "flex h-11 w-11 items-center justify-center rounded-2xl text-lg " +
                  (resumo.saldo >= 0
                    ? "bg-orange-500/10 text-orange-400"
                    : "bg-rose-500/10 text-rose-400")
                }
              >
                =
              </div>
            </div>

            <p
              className={
                "mt-6 text-3xl font-black " +
                (resumo.saldo >= 0
                  ? "text-orange-400"
                  : "text-rose-400")
              }
            >
              {formatarMoeda(resumo.saldo)}
            </p>

            <div className="mt-4 text-xs text-neutral-600">
              Receitas menos despesas
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="premium-card animate-slide-up p-6 sm:p-7">
            <div className="mb-7">
              <span className="badge badge-orange">
                {editandoId
                  ? "Edição"
                  : "Novo lançamento"}
              </span>

              <h2 className="mt-3 text-xl font-bold text-white">
                {editandoId
                  ? "Atualizar movimentação"
                  : "Adicionar movimentação"}
              </h2>

              <p className="mt-1 text-sm leading-6 text-neutral-500">
                Registre uma entrada ou saída para manter seu
                controle financeiro atualizado.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600">
                  Descrição
                </label>

                <input
                  value={descricao}
                  onChange={function (event) {
                    setDescricao(event.target.value);
                  }}
                  placeholder="Ex.: Bolsa, aluguel, alimentação..."
                  className="input-premium"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600">
                    Valor
                  </label>

                  <input
                    value={valor}
                    onChange={function (event) {
                      setValor(event.target.value);
                    }}
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    className="input-premium"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600">
                    Data
                  </label>

                  <input
                    value={data}
                    onChange={function (event) {
                      setData(event.target.value);
                    }}
                    type="date"
                    className="input-premium"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600">
                  Tipo
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={function () {
                      setTipo("RECEITA");
                    }}
                    className={
                      tipo === "RECEITA"
                        ? "rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400"
                        : "rounded-xl border border-white/[0.07] bg-white/[0.015] px-4 py-3 text-sm text-neutral-500 transition hover:bg-white/[0.04] hover:text-white"
                    }
                  >
                    ↑ Receita
                  </button>

                  <button
                    type="button"
                    onClick={function () {
                      setTipo("DESPESA");
                    }}
                    className={
                      tipo === "DESPESA"
                        ? "rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-400"
                        : "rounded-xl border border-white/[0.07] bg-white/[0.015] px-4 py-3 text-sm text-neutral-500 transition hover:bg-white/[0.04] hover:text-white"
                    }
                  >
                    ↓ Despesa
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={salvarMovimentacao}
                  disabled={salvando}
                  className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {salvando
                    ? "Salvando..."
                    : editandoId
                    ? "Salvar alterações"
                    : "Adicionar movimentação"}
                </button>

                {editandoId && (
                  <button
                    type="button"
                    onClick={limparFormulario}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="premium-card animate-slide-up p-6 sm:p-7">
            <div className="mb-7">
              <span className="badge">
                Filtro
              </span>

              <h2 className="mt-3 text-xl font-bold text-white">
                Período financeiro
              </h2>

              <p className="mt-1 text-sm leading-6 text-neutral-500">
                Analise somente o intervalo desejado.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600">
                  Data inicial
                </label>

                <input
                  value={inicio}
                  onChange={function (event) {
                    setInicio(event.target.value);
                  }}
                  type="date"
                  className="input-premium"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600">
                  Data final
                </label>

                <input
                  value={fim}
                  onChange={function (event) {
                    setFim(event.target.value);
                  }}
                  type="date"
                  className="input-premium"
                />
              </div>

              <button
                type="button"
                onClick={function () {
                  setInicio("");
                  setFim("");
                }}
                className="btn-secondary w-full"
              >
                Limpar período
              </button>
            </div>

            {(inicio || fim) && (
              <div className="mt-5 rounded-xl border border-orange-500/10 bg-orange-500/[0.035] p-4">
                <p className="text-xs text-neutral-600">
                  Filtro ativo
                </p>

                <p className="mt-1 text-sm font-medium text-orange-400">
                  {inicio || "Início"} →{" "}
                  {fim || "Atual"}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="premium-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="badge badge-success">
                  Receitas
                </span>

                <p className="mt-2 text-sm text-neutral-500">
                  Comparativo visual
                </p>
              </div>

              <p className="font-bold text-emerald-400">
                {formatarMoeda(resumo.receitas)}
              </p>
            </div>

            <div className="mt-6 progress-track h-3">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                style={{
                  width: percentualReceitas + "%",
                }}
              />
            </div>
          </div>

          <div className="premium-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="badge badge-danger">
                  Despesas
                </span>

                <p className="mt-2 text-sm text-neutral-500">
                  Comparativo visual
                </p>
              </div>

              <p className="font-bold text-rose-400">
                {formatarMoeda(resumo.despesas)}
              </p>
            </div>

            <div className="mt-6 progress-track h-3">
              <div
                className="h-full rounded-full bg-rose-500 transition-all duration-700"
                style={{
                  width: percentualDespesas + "%",
                }}
              />
            </div>
          </div>
        </section>

        <section className="premium-card mt-6 animate-slide-up p-6 sm:p-7">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="badge badge-orange">
                Histórico
              </span>

              <h2 className="mt-3 text-xl font-bold text-white">
                Movimentações
              </h2>

              <p className="mt-1 text-sm leading-6 text-neutral-500">
                Todas as receitas e despesas registradas.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-neutral-600">
                {movimentacoes.length} lançamento
                {movimentacoes.length === 1 ? "" : "s"}
              </span>

              <button
                type="button"
                onClick={carregarMovimentacoes}
                className="btn-secondary"
              >
                ↻ Atualizar
              </button>
            </div>
          </div>

          {carregando ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(function (item) {
                return (
                  <div
                    key={item}
                    className="skeleton h-20 rounded-2xl"
                  />
                );
              })}
            </div>
          ) : movimentacoes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.012] p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-2xl text-orange-400">
                $
              </div>

              <h3 className="mt-5 font-semibold text-white">
                Nenhuma movimentação
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
                Adicione sua primeira receita ou despesa
                usando o formulário acima.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {movimentacoes.map(function (item, index) {
                const receita =
                  item.tipo === "RECEITA";

                return (
                  <div
                    key={item.id}
                    className="group rounded-2xl border border-white/[0.05] bg-white/[0.012] p-4 transition duration-200 hover:border-white/[0.1] hover:bg-white/[0.025]"
                    style={{
                      animationDelay:
                        index < 12
                          ? index * 30 + "ms"
                          : "0ms",
                    }}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      <div
                        className={
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg " +
                          (receita
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400")
                        }
                      >
                        {receita ? "↑" : "↓"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-white">
                          {item.descricao}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-600">
                          <span>
                            {formatarData(item.data)}
                          </span>

                          <span>•</span>

                          <span
                            className={
                              receita
                                ? "text-emerald-400"
                                : "text-rose-400"
                            }
                          >
                            {receita
                              ? "Receita"
                              : "Despesa"}
                          </span>
                        </div>
                      </div>

                      <div
                        className={
                          "text-lg font-bold lg:min-w-[140px] lg:text-right " +
                          (receita
                            ? "text-emerald-400"
                            : "text-rose-400")
                        }
                      >
                        {receita ? "+" : "-"}{" "}
                        {formatarMoeda(item.valor)}
                      </div>

                      <div className="flex gap-2 lg:pl-2">
                        <button
                          type="button"
                          onClick={function () {
                            iniciarEdicao(item);
                          }}
                          className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs text-neutral-400 transition hover:bg-white/[0.08] hover:text-white"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={function () {
                            excluirMovimentacao(item.id);
                          }}
                          className="rounded-lg border border-rose-500/10 bg-rose-500/[0.03] px-3 py-2 text-xs text-rose-400 transition hover:bg-rose-500/10"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="pb-8 pt-2 text-center text-xs text-neutral-700">
          Controle financeiro do Jankinho Study
        </div>
      </main>
    </AppLayout>
  );
}