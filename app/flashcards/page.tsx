"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";

type Flashcard = {
  id: number;
  frente: string;
  verso: string;
  createdAt: string;
};

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [frente, setFrente] = useState("");
  const [verso, setVerso] = useState("");
  const [busca, setBusca] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarRespostas, setMostrarRespostas] = useState<
    Record<number, boolean>
  >({});
  const [modoEstudo, setModoEstudo] = useState(false);
  const [cardAtual, setCardAtual] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(function () {
    carregarFlashcards();
  }, []);

  async function carregarFlashcards() {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch("/api/flashcards");

      if (!resposta.ok) {
        throw new Error("Erro ao carregar flashcards.");
      }

      const dados = await resposta.json();

      setFlashcards(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error(error);

      setErro("Não foi possível carregar os flashcards.");
    } finally {
      setCarregando(false);
    }
  }

  async function criarFlashcard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!frente.trim() || !verso.trim()) {
      setErro("Preencha a frente e o verso do flashcard.");
      return;
    }

    try {
      setSalvando(true);
      setErro("");

      const resposta = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          frente: frente.trim(),
          verso: verso.trim(),
        }),
      });

      if (!resposta.ok) {
        const dados = await resposta.json().catch(function () {
          return {};
        });

        throw new Error(
          dados.error || "Erro ao criar flashcard."
        );
      }

      const novoFlashcard = await resposta.json();

      setFlashcards(function (anteriores) {
        return [novoFlashcard, ...anteriores];
      });

      setFrente("");
      setVerso("");
      setMostrarFormulario(false);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível criar o flashcard.");
      }
    } finally {
      setSalvando(false);
    }
  }

  function alternarResposta(id: number) {
    setMostrarRespostas(function (anteriores) {
      return {
        ...anteriores,
        [id]: !anteriores[id],
      };
    });
  }

  const flashcardsFiltrados = useMemo(
    function () {
      const termo = busca.toLowerCase().trim();

      if (!termo) {
        return flashcards;
      }

      return flashcards.filter(function (card) {
        const frenteSegura = String(card?.frente || "").toLowerCase();
        const versoSeguro = String(card?.verso || "").toLowerCase();

        return (
          frenteSegura.includes(termo) ||
          versoSeguro.includes(termo)
        );
      });
    },
    [flashcards, busca]
  );

  const cardEstudo = flashcardsFiltrados[cardAtual];

  function iniciarEstudo() {
    if (flashcardsFiltrados.length === 0) {
      setErro("Não há flashcards para estudar.");
      return;
    }

    setCardAtual(0);
    setModoEstudo(true);
  }

  function proximoCard() {
    if (flashcardsFiltrados.length === 0) {
      return;
    }

    setCardAtual(function (atual) {
      if (atual >= flashcardsFiltrados.length - 1) {
        return 0;
      }

      return atual + 1;
    });
  }

  function cardAnterior() {
    if (flashcardsFiltrados.length === 0) {
      return;
    }

    setCardAtual(function (atual) {
      if (atual <= 0) {
        return flashcardsFiltrados.length - 1;
      }

      return atual - 1;
    });
  }

  function sairModoEstudo() {
    setModoEstudo(false);
    setCardAtual(0);
  }

  if (modoEstudo && cardEstudo) {
    const respostaVisivel =
      mostrarRespostas[cardEstudo.id] === true;

    const progresso =
      ((cardAtual + 1) / flashcardsFiltrados.length) * 100;

    return (
      <AppLayout>
        <main className="mx-auto max-w-4xl animate-fade-in px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="badge badge-orange">
                  Revisão
                </span>

                <span className="text-xs text-neutral-600">
                  Modo de estudo
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white">
                Flashcard {cardAtual + 1} de{" "}
                {flashcardsFiltrados.length}
              </h1>
            </div>

            <button
              type="button"
              onClick={sairModoEstudo}
              className="btn-secondary"
            >
              Sair
            </button>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <div className="progress-track flex-1">
              <div
                className="progress-fill"
                style={{
                  width: progresso + "%",
                }}
              />
            </div>

            <span className="text-xs font-medium text-neutral-500">
              {Math.round(progresso)}%
            </span>
          </div>

          <section className="premium-card animate-slide-up overflow-hidden">
            <div className="border-b border-white/5 p-6 sm:p-10">
              <div className="mb-5 flex items-center justify-between">
                <span className="badge badge-orange">
                  Frente
                </span>

                <span className="text-xs text-neutral-600">
                  Pergunta
                </span>
              </div>

              <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-orange-500/10 bg-orange-500/[0.035] p-8 text-center sm:p-12">
                <p className="max-w-2xl text-2xl font-semibold leading-10 text-white sm:text-3xl">
                  {cardEstudo.frente}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-10">
              <div className="mb-5 flex items-center justify-between">
                <span className="badge">
                  Verso
                </span>

                {respostaVisivel && (
                  <button
                    type="button"
                    onClick={function () {
                      alternarResposta(cardEstudo.id);
                    }}
                    className="text-xs font-medium text-neutral-500 transition hover:text-white"
                  >
                    Ocultar resposta
                  </button>
                )}
              </div>

              <div
                className={
                  "flex min-h-[230px] items-center justify-center rounded-3xl border p-8 text-center transition-all duration-300 sm:p-10 " +
                  (respostaVisivel
                    ? "border-emerald-500/10 bg-emerald-500/[0.035]"
                    : "border-white/5 bg-white/[0.02]")
                }
              >
                {respostaVisivel ? (
                  <p className="max-w-2xl text-lg leading-8 text-neutral-200">
                    {cardEstudo.verso}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={function () {
                      alternarResposta(cardEstudo.id);
                    }}
                    className="btn-primary"
                  >
                    Mostrar resposta
                  </button>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={cardAnterior}
                  className="btn-secondary min-w-36"
                >
                  ← Anterior
                </button>

                <button
                  type="button"
                  onClick={proximoCard}
                  className="btn-primary min-w-36"
                >
                  Próximo →
                </button>
              </div>
            </div>
          </section>

          <div className="mt-5 text-center text-xs text-neutral-600">
            Use a revisão para testar sua memória antes de revelar a resposta.
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
                  Estudo
                </span>

                <span className="text-xs text-neutral-600">
                  Revisão ativa
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Flashcards
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
                Transforme conteúdos importantes em revisões rápidas e
                objetivas.
              </p>
            </div>

            <button
              type="button"
              onClick={iniciarEstudo}
              className="btn-primary"
            >
              ▶ Iniciar estudo
            </button>
          </div>
        </section>

        {erro && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] p-4 text-sm text-rose-300">
            <span>{erro}</span>

            <button
              type="button"
              onClick={function () {
                setErro("");
              }}
              className="text-rose-400 hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <button
            type="button"
            onClick={iniciarEstudo}
            className="premium-card group text-left transition-all duration-200 hover:-translate-y-1 hover:border-orange-500/20"
          >
            <div className="flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-lg text-orange-400">
                ▶
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Modo de estudo
                </h2>

                <p className="mt-1 text-sm leading-5 text-neutral-500">
                  Revise seus cards um por um.
                </p>

                <span className="mt-4 inline-block text-xs font-semibold text-orange-400">
                  Começar revisão →
                </span>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={function () {
              setMostrarFormulario(!mostrarFormulario);
            }}
            className="premium-card group text-left transition-all duration-200 hover:-translate-y-1 hover:border-orange-500/20"
          >
            <div className="flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.05] text-xl text-orange-400">
                +
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Novo flashcard
                </h2>

                <p className="mt-1 text-sm leading-5 text-neutral-500">
                  Crie uma nova pergunta e resposta.
                </p>

                <span className="mt-4 inline-block text-xs font-semibold text-orange-400">
                  Criar agora →
                </span>
              </div>
            </div>
          </button>

          <div className="premium-card">
            <div className="flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.05] text-lg text-neutral-300">
                ▣
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Sua biblioteca
                </h2>

                <p className="mt-1 text-sm leading-5 text-neutral-500">
                  {flashcards.length} flashcard
                  {flashcards.length === 1 ? "" : "s"} cadastrado
                  {flashcards.length === 1 ? "" : "s"}.
                </p>

                <span className="mt-4 inline-block text-xs text-neutral-600">
                  Biblioteca pessoal
                </span>
              </div>
            </div>
          </div>
        </section>

        {mostrarFormulario && (
          <section className="premium-card mb-8 animate-slide-up overflow-hidden">
            <div className="border-b border-white/5 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="badge badge-orange">
                    Novo conteúdo
                  </span>

                  <h2 className="mt-3 text-xl font-bold text-white">
                    Criar flashcard
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    Coloque a pergunta na frente e a resposta no verso.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={function () {
                    setMostrarFormulario(false);
                  }}
                  className="text-2xl text-neutral-600 transition hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>

            <form
              onSubmit={criarFlashcard}
              className="space-y-5 p-6 sm:p-8"
            >
              <div className="grid gap-5 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-neutral-400">
                    Frente
                  </label>

                  <textarea
                    value={frente}
                    onChange={function (event) {
                      setFrente(event.target.value);
                    }}
                    placeholder="Ex.: O que é débito cardíaco?"
                    rows={6}
                    className="input-premium w-full resize-none"
                  />

                  <p className="mt-2 text-[11px] text-neutral-600">
                    Pergunta, conceito ou situação que você quer lembrar.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-neutral-400">
                    Verso
                  </label>

                  <textarea
                    value={verso}
                    onChange={function (event) {
                      setVerso(event.target.value);
                    }}
                    placeholder="Ex.: É o volume de sangue bombeado pelo coração por minuto."
                    rows={6}
                    className="input-premium w-full resize-none"
                  />

                  <p className="mt-2 text-[11px] text-neutral-600">
                    Resposta ou explicação que aparecerá durante a revisão.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/5 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={function () {
                    setMostrarFormulario(false);
                  }}
                  className="btn-secondary"
                  disabled={salvando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={salvando}
                  className="btn-primary"
                >
                  {salvando
                    ? "Salvando..."
                    : "Salvar flashcard"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="premium-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-600">
              Total
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {flashcards.length}
            </p>

            <p className="mt-1 text-sm text-neutral-500">
              flashcards cadastrados
            </p>
          </div>

          <div className="premium-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-600">
              Encontrados
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {flashcardsFiltrados.length}
            </p>

            <p className="mt-1 text-sm text-neutral-500">
              após a busca atual
            </p>
          </div>

          <div className="premium-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-400">
              Revisão
            </p>

            <p className="mt-2 text-lg font-bold text-white">
              {flashcards.length > 0
                ? "Pronto para estudar"
                : "Crie seu primeiro card"}
            </p>

            <p className="mt-1 text-sm text-neutral-500">
              {flashcards.length > 0
                ? "Sua biblioteca está disponível."
                : "Comece sua biblioteca de revisão."}
            </p>
          </div>
        </section>

        <section className="mb-6">
          <div className="premium-card p-3">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600">
                ⌕
              </span>

              <input
                type="text"
                value={busca}
                onChange={function (event) {
                  setBusca(event.target.value);
                  setCardAtual(0);
                }}
                placeholder="Buscar flashcards..."
                className="input-premium w-full pl-11"
              />
            </div>
          </div>
        </section>

        {carregando ? (
          <section className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map(function (item) {
              return (
                <div
                  key={item}
                  className="premium-card p-6"
                >
                  <div className="skeleton mb-5 h-5 w-24 rounded" />
                  <div className="skeleton mb-3 h-5 w-full rounded" />
                  <div className="skeleton mb-8 h-5 w-3/4 rounded" />
                  <div className="skeleton h-10 w-32 rounded-xl" />
                </div>
              );
            })}
          </section>
        ) : erro && flashcards.length === 0 ? (
          <section className="premium-card p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-xl text-rose-400">
              !
            </div>

            <p className="mt-4 text-sm text-rose-300">
              {erro}
            </p>

            <button
              type="button"
              onClick={carregarFlashcards}
              className="btn-secondary mt-5"
            >
              Tentar novamente
            </button>
          </section>
        ) : flashcardsFiltrados.length === 0 ? (
          <section className="premium-card py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-2xl text-orange-400">
              ◉
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              {flashcards.length === 0
                ? "Nenhum flashcard ainda"
                : "Nenhum flashcard encontrado"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
              {flashcards.length === 0
                ? "Crie seu primeiro flashcard para começar sua biblioteca de revisão."
                : "Tente alterar os termos da busca para encontrar outro conteúdo."}
            </p>

            {flashcards.length === 0 && (
              <button
                type="button"
                onClick={function () {
                  setMostrarFormulario(true);
                }}
                className="btn-primary mt-6"
              >
                Criar primeiro flashcard
              </button>
            )}
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2">
            {flashcardsFiltrados.map(function (card, index) {
              const respostaVisivel =
                mostrarRespostas[card.id] === true;

              return (
                <article
                  key={card.id}
                  className="premium-card animate-slide-up p-6 transition-all duration-200 hover:-translate-y-1 hover:border-white/10"
                  style={{
                    animationDelay:
                      index < 8 ? index * 30 + "ms" : "0ms",
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="badge badge-orange">
                      Flashcard
                    </span>

                    <span className="text-xs text-neutral-700">
                      #{card.id}
                    </span>
                  </div>

                  <div className="mt-6">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
                      Frente
                    </p>

                    <p className="text-lg font-semibold leading-8 text-neutral-100">
                      {card.frente}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-white/5 pt-5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                        Verso
                      </p>

                      {respostaVisivel && (
                        <span className="text-[10px] uppercase tracking-wider text-neutral-600">
                          Revelado
                        </span>
                      )}
                    </div>

                    {respostaVisivel ? (
                      <div className="animate-fade-in">
                        <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.035] p-4">
                          <p className="leading-7 text-neutral-300">
                            {card.verso}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={function () {
                            alternarResposta(card.id);
                          }}
                          className="mt-4 text-xs font-medium text-neutral-500 transition hover:text-white"
                        >
                          Ocultar resposta
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={function () {
                          alternarResposta(card.id);
                        }}
                        className="btn-secondary"
                      >
                        Mostrar resposta
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </AppLayout>
  );
}