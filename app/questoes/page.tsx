"use client";

import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";

type Disciplina = {
  id: number;
  nome: string;
};

type Alternativa = {
  id?: number;
  texto: string;
  correta: boolean;
};

type Questao = {
  id: number;
  enunciado: string;
  explicacao?: string | null;
  tema?: string | null;
  dificuldade?: string | null;
  disciplina: Disciplina;
  alternativas: Alternativa[];
};

type Sessao = {
  questoes: Questao[];
};

const dificuldades = ["Fácil", "Médio", "Difícil"];

function embaralhar<T>(array: T[]): T[] {
  const copia = [...array];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const temporario = copia[i];
    copia[i] = copia[j];
    copia[j] = temporario;
  }

  return copia;
}

function obterCorDificuldade(dificuldade?: string | null) {
  const valor = (dificuldade || "").toLowerCase();

  if (valor === "fácil" || valor === "facil") {
    return "badge badge-success";
  }

  if (valor === "difícil" || valor === "dificil") {
    return "badge badge-danger";
  }

  return "badge badge-orange";
}

export default function QuestoesPage() {
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState("");
  const [filtroDificuldade, setFiltroDificuldade] = useState("");

  const [mostrarCriadorIA, setMostrarCriadorIA] = useState(false);
  const [mostrarCriadorManual, setMostrarCriadorManual] = useState(false);
  const [mostrarDisciplina, setMostrarDisciplina] = useState(false);

  const [curso, setCurso] = useState("Enfermagem");
  const [disciplinaIA, setDisciplinaIA] = useState("");
  const [temaIA, setTemaIA] = useState("");
  const [dificuldadeIA, setDificuldadeIA] = useState("Médio");
  const [quantidadeIA, setQuantidadeIA] = useState("5");
  const [gerandoIA, setGerandoIA] = useState(false);

  const [novaDisciplina, setNovaDisciplina] = useState("");
  const [criandoDisciplina, setCriandoDisciplina] = useState(false);

  const [enunciado, setEnunciado] = useState("");
  const [tema, setTema] = useState("");
  const [dificuldade, setDificuldade] = useState("Médio");
  const [explicacao, setExplicacao] = useState("");
  const [disciplinaManual, setDisciplinaManual] = useState("");
  const [alternativas, setAlternativas] = useState<Alternativa[]>([
    {
      texto: "",
      correta: false,
    },
    {
      texto: "",
      correta: false,
    },
    {
      texto: "",
      correta: false,
    },
    {
      texto: "",
      correta: false,
    },
    {
      texto: "",
      correta: false,
    },
  ]);
  const [salvandoManual, setSalvandoManual] = useState(false);

  const [modoResponder, setModoResponder] = useState(false);
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [alternativaSelecionada, setAlternativaSelecionada] = useState<
    number | null
  >(null);
  const [respostaEnviada, setRespostaEnviada] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [finalizada, setFinalizada] = useState(false);
  const [salvandoResposta, setSalvandoResposta] = useState(false);

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro("");

      const respostas = await Promise.all([
        fetch("/api/questoes"),
        fetch("/api/disciplinas"),
      ]);

      const questoesResponse = respostas[0];
      const disciplinasResponse = respostas[1];

      if (!questoesResponse.ok) {
        throw new Error("Erro ao buscar questões.");
      }

      if (!disciplinasResponse.ok) {
        throw new Error("Erro ao buscar disciplinas.");
      }

      const questoesData = await questoesResponse.json();
      const disciplinasData = await disciplinasResponse.json();

      setQuestoes(Array.isArray(questoesData) ? questoesData : []);
      setDisciplinas(Array.isArray(disciplinasData) ? disciplinasData : []);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar as questões.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(function () {
    carregarDados();
  }, []);

  async function criarDisciplina() {
    const nome = novaDisciplina.trim();

    if (!nome) {
      return;
    }

    try {
      setCriandoDisciplina(true);

      const resposta = await fetch("/api/disciplinas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error || "Não foi possível criar a disciplina.");
      }

      setNovaDisciplina("");
      setMostrarDisciplina(false);

      await carregarDados();

      setDisciplinaIA(dados.nome || nome);
      setDisciplinaManual(dados.nome || nome);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível criar a disciplina.");
      }
    } finally {
      setCriandoDisciplina(false);
    }
  }

  async function gerarQuestoesIA() {
    if (!curso.trim()) {
      setErro("Informe o curso.");
      return;
    }

    if (!disciplinaIA.trim()) {
      setErro("Informe a disciplina.");
      return;
    }

    if (!temaIA.trim()) {
      setErro("Informe o tema.");
      return;
    }

    try {
      setGerandoIA(true);
      setErro("");

      const resposta = await fetch("/api/ia/gerar-questoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          curso: curso.trim(),
          disciplina: disciplinaIA.trim(),
          tema: temaIA.trim(),
          dificuldade: dificuldadeIA,
          quantidade: Number(quantidadeIA),
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.error || "Não foi possível gerar as questões."
        );
      }

      await carregarDados();

      setMostrarCriadorIA(false);
      setTemaIA("");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível gerar as questões.");
      }
    } finally {
      setGerandoIA(false);
    }
  }

  function atualizarAlternativa(index: number, texto: string) {
    setAlternativas(function (atual) {
      return atual.map(function (alternativa, indice) {
        if (indice !== index) {
          return alternativa;
        }

        return {
          ...alternativa,
          texto: texto,
        };
      });
    });
  }

  function marcarCorreta(index: number) {
    setAlternativas(function (atual) {
      return atual.map(function (alternativa, indice) {
        return {
          ...alternativa,
          correta: indice === index,
        };
      });
    });
  }

  async function criarQuestaoManual() {
    const textoEnunciado = enunciado.trim();

    const alternativasValidas = alternativas.filter(function (alternativa) {
      return alternativa.texto.trim().length > 0;
    });

    const possuiCorreta = alternativasValidas.some(function (alternativa) {
      return alternativa.correta;
    });

    if (!textoEnunciado) {
      setErro("Digite o enunciado da questão.");
      return;
    }

    if (!disciplinaManual.trim()) {
      setErro("Informe a disciplina.");
      return;
    }

    if (alternativasValidas.length < 2) {
      setErro("Informe pelo menos duas alternativas.");
      return;
    }

    if (!possuiCorreta) {
      setErro("Marque uma alternativa como correta.");
      return;
    }

    try {
      setSalvandoManual(true);
      setErro("");

      const disciplinaEncontrada = disciplinas.find(function (disciplina) {
        return (
          disciplina.nome.toLowerCase() === disciplinaManual.trim().toLowerCase()
        );
      });

      let disciplinaId = disciplinaEncontrada?.id;

      if (!disciplinaId) {
        const respostaDisciplina = await fetch("/api/disciplinas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: disciplinaManual.trim(),
          }),
        });

        const dadosDisciplina = await respostaDisciplina.json();

        if (!respostaDisciplina.ok) {
          throw new Error(
            dadosDisciplina.error || "Não foi possível criar a disciplina."
          );
        }

        disciplinaId = dadosDisciplina.id;
      }

      const resposta = await fetch("/api/questoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enunciado: textoEnunciado,
          explicacao: explicacao.trim() || null,
          tema: tema.trim() || null,
          dificuldade: dificuldade,
          disciplinaId: disciplinaId,
          alternativas: alternativasValidas.map(function (alternativa) {
            return {
              texto: alternativa.texto.trim(),
              correta: alternativa.correta,
            };
          }),
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.error || "Não foi possível criar a questão."
        );
      }

      setEnunciado("");
      setTema("");
      setDificuldade("Médio");
      setExplicacao("");
      setDisciplinaManual("");

      setAlternativas([
        {
          texto: "",
          correta: false,
        },
        {
          texto: "",
          correta: false,
        },
        {
          texto: "",
          correta: false,
        },
        {
          texto: "",
          correta: false,
        },
        {
          texto: "",
          correta: false,
        },
      ]);

      setMostrarCriadorManual(false);

      await carregarDados();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível criar a questão.");
      }
    } finally {
      setSalvandoManual(false);
    }
  }

  const questoesFiltradas = useMemo(function () {
    const termo = busca.trim().toLowerCase();

    return questoes.filter(function (questao) {
      const correspondeBusca =
        !termo ||
        questao.enunciado.toLowerCase().includes(termo) ||
        (questao.tema || "").toLowerCase().includes(termo) ||
        questao.disciplina.nome.toLowerCase().includes(termo);

      const correspondeDisciplina =
        !filtroDisciplina ||
        questao.disciplina.id.toString() === filtroDisciplina;

      const correspondeDificuldade =
        !filtroDificuldade ||
        (questao.dificuldade || "").toLowerCase() ===
          filtroDificuldade.toLowerCase();

      return (
        correspondeBusca &&
        correspondeDisciplina &&
        correspondeDificuldade
      );
    });
  }, [questoes, busca, filtroDisciplina, filtroDificuldade]);

  function iniciarSessao() {
    if (questoesFiltradas.length === 0) {
      setErro("Não há questões disponíveis para iniciar uma sessão.");
      return;
    }

    const quantidade = Math.min(10, questoesFiltradas.length);

    const questoesSelecionadas = embaralhar(questoesFiltradas)
      .slice(0, quantidade)
      .map(function (questao) {
        return {
          ...questao,
          alternativas: embaralhar(questao.alternativas),
        };
      });

    setSessao({
      questoes: questoesSelecionadas,
    });

    setIndiceAtual(0);
    setAlternativaSelecionada(null);
    setRespostaEnviada(false);
    setPontuacao(0);
    setFinalizada(false);
    setModoResponder(true);
    setErro("");
  }

  async function responderQuestao() {
    if (!sessao) {
      return;
    }

    if (alternativaSelecionada === null) {
      return;
    }

    const questaoAtual = sessao.questoes[indiceAtual];

    if (!questaoAtual) {
      return;
    }

    const alternativa = questaoAtual.alternativas[alternativaSelecionada];

    if (!alternativa) {
      return;
    }

    try {
      setSalvandoResposta(true);

      const correta = alternativa.correta;

      if (correta) {
        setPontuacao(function (valor) {
          return valor + 1;
        });
      }

      const resposta = await fetch("/api/respostas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questaoId: questaoAtual.id,
          correta: correta,
        }),
      });

      if (!resposta.ok) {
        const dados = await resposta.json().catch(function () {
          return {};
        });

        throw new Error(
          dados.error || "Não foi possível salvar a resposta."
        );
      }

      setRespostaEnviada(true);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível salvar a resposta.");
      }
    } finally {
      setSalvandoResposta(false);
    }
  }

  function proximaQuestao() {
    if (!sessao) {
      return;
    }

    if (indiceAtual >= sessao.questoes.length - 1) {
      setFinalizada(true);
      return;
    }

    setIndiceAtual(function (valor) {
      return valor + 1;
    });

    setAlternativaSelecionada(null);
    setRespostaEnviada(false);
  }

  function encerrarSessao() {
    setModoResponder(false);
    setSessao(null);
    setIndiceAtual(0);
    setAlternativaSelecionada(null);
    setRespostaEnviada(false);
    setPontuacao(0);
    setFinalizada(false);
    setSalvandoResposta(false);
  }

  function fecharModais() {
    if (gerandoIA || salvandoManual || criandoDisciplina) {
      return;
    }

    setMostrarCriadorIA(false);
    setMostrarCriadorManual(false);
    setMostrarDisciplina(false);
  }

  if (modoResponder && sessao) {
    const questaoAtual = sessao.questoes[indiceAtual];

    if (finalizada) {
      const percentual =
        sessao.questoes.length > 0
          ? Math.round((pontuacao / sessao.questoes.length) * 100)
          : 0;

      return (
        <AppLayout>
          <main className="mx-auto max-w-5xl animate-fade-in px-4 py-8 sm:px-6 lg:px-8">
            <div className="premium-card overflow-hidden">
              <div className="border-b border-white/5 p-8 text-center sm:p-12">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10 text-3xl">
                  {percentual >= 70 ? "✓" : "!"}
                </div>

                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-orange-400">
                  Sessão concluída
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Seu resultado
                </h1>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-400">
                  Você respondeu {sessao.questoes.length} questões nesta
                  sessão.
                </p>
              </div>

              <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
                <div className="surface-soft rounded-2xl p-5 text-center">
                  <p className="text-sm text-neutral-500">Acertos</p>
                  <p className="mt-2 text-3xl font-bold text-emerald-400">
                    {pontuacao}
                  </p>
                </div>

                <div className="surface-soft rounded-2xl p-5 text-center">
                  <p className="text-sm text-neutral-500">Erros</p>
                  <p className="mt-2 text-3xl font-bold text-rose-400">
                    {sessao.questoes.length - pontuacao}
                  </p>
                </div>

                <div className="surface-soft rounded-2xl p-5 text-center">
                  <p className="text-sm text-neutral-500">Aproveitamento</p>
                  <p className="mt-2 text-3xl font-bold text-orange-400">
                    {percentual}%
                  </p>
                </div>
              </div>

              <div className="px-6 pb-8 sm:px-8">
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: percentual + "%",
                    }}
                  />
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={iniciarSessao}
                    className="btn-primary"
                  >
                    Fazer outra sessão
                  </button>

                  <button
                    type="button"
                    onClick={encerrarSessao}
                    className="btn-secondary"
                  >
                    Voltar ao banco
                  </button>
                </div>
              </div>
            </div>
          </main>
        </AppLayout>
      );
    }

    if (!questaoAtual) {
      return null;
    }

    const alternativaCorreta = questaoAtual.alternativas.findIndex(
      function (alternativa) {
        return alternativa.correta;
      }
    );

    return (
      <AppLayout>
        <main className="mx-auto max-w-4xl animate-fade-in px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={encerrarSessao}
              className="btn-secondary"
            >
              ← Sair da sessão
            </button>

            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Questão
              </p>
              <p className="text-sm font-semibold text-white">
                {indiceAtual + 1} de {sessao.questoes.length}
              </p>
            </div>
          </div>

          <div className="mb-6 progress-track">
            <div
              className="progress-fill"
              style={{
                width:
                  ((indiceAtual + 1) / sessao.questoes.length) * 100 + "%",
              }}
            />
          </div>

          <section className="premium-card animate-slide-up">
            <div className="border-b border-white/5 p-6 sm:p-8">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="badge badge-orange">
                  {questaoAtual.disciplina.nome}
                </span>

                {questaoAtual.dificuldade && (
                  <span
                    className={obterCorDificuldade(
                      questaoAtual.dificuldade
                    )}
                  >
                    {questaoAtual.dificuldade}
                  </span>
                )}

                {questaoAtual.tema && (
                  <span className="badge">
                    {questaoAtual.tema}
                  </span>
                )}
              </div>

              <h1 className="text-xl font-semibold leading-8 text-white sm:text-2xl">
                {questaoAtual.enunciado}
              </h1>
            </div>

            <div className="space-y-3 p-6 sm:p-8">
              {questaoAtual.alternativas.map(function (alternativa, index) {
                const selecionada = alternativaSelecionada === index;
                const correta = alternativa.correta;

                let classes =
                  "w-full rounded-2xl border p-4 text-left transition-all duration-200";

                if (!respostaEnviada) {
                  if (selecionada) {
                    classes +=
                      " border-orange-500/50 bg-orange-500/10 shadow-[0_0_30px_rgba(249,115,22,0.08)]";
                  } else {
                    classes +=
                      " border-white/5 bg-white/[0.02] hover:border-orange-500/30 hover:bg-white/[0.04]";
                  }
                } else if (correta) {
                  classes +=
                    " border-emerald-500/30 bg-emerald-500/10";
                } else if (selecionada) {
                  classes +=
                    " border-rose-500/30 bg-rose-500/10";
                } else {
                  classes +=
                    " border-white/5 bg-white/[0.02] opacity-60";
                }

                return (
                  <button
                    key={
                      alternativa.id !== undefined
                        ? alternativa.id
                        : index
                    }
                    type="button"
                    disabled={respostaEnviada || salvandoResposta}
                    onClick={function () {
                      setAlternativaSelecionada(index);
                    }}
                    className={classes}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold " +
                          (selecionada
                            ? "border-orange-500/50 bg-orange-500/10 text-orange-400"
                            : "border-white/10 bg-white/[0.03] text-neutral-400")
                        }
                      >
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span className="pt-1 text-sm leading-6 text-neutral-200">
                        {alternativa.texto}
                      </span>

                      {respostaEnviada && correta && (
                        <span className="ml-auto pt-1 text-emerald-400">
                          ✓
                        </span>
                      )}

                      {respostaEnviada &&
                        selecionada &&
                        !correta && (
                          <span className="ml-auto pt-1 text-rose-400">
                            ×
                          </span>
                        )}
                    </div>
                  </button>
                );
              })}

              {respostaEnviada && questaoAtual.explicacao && (
                <div className="mt-6 rounded-2xl border border-orange-500/10 bg-orange-500/[0.04] p-5">
                  <p className="mb-2 text-sm font-semibold text-orange-400">
                    Explicação
                  </p>

                  <p className="text-sm leading-6 text-neutral-300">
                    {questaoAtual.explicacao}
                  </p>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                {!respostaEnviada ? (
                  <button
                    type="button"
                    onClick={responderQuestao}
                    disabled={
                      alternativaSelecionada === null ||
                      salvandoResposta
                    }
                    className="btn-primary w-full sm:w-auto"
                  >
                    {salvandoResposta
                      ? "Salvando..."
                      : "Confirmar resposta"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={proximaQuestao}
                    className="btn-primary w-full sm:w-auto"
                  >
                    {indiceAtual >= sessao.questoes.length - 1
                      ? "Ver resultado"
                      : "Próxima questão →"}
                  </button>
                )}
              </div>
            </div>
          </section>

          {respostaEnviada && (
            <div className="mt-4 text-center text-xs text-neutral-600">
              {alternativaSelecionada === alternativaCorreta
                ? "Resposta correta."
                : "Resposta incorreta."}
            </div>
          )}
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
                  Banco pessoal
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Banco de questões
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
                Organize suas questões, pratique em sessões e use IA para
                ampliar seu banco de estudos.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="surface-soft rounded-2xl px-4 py-3 text-center">
                <p className="text-xl font-bold text-white">
                  {questoesFiltradas.length}
                </p>
                <p className="mt-1 text-[11px] text-neutral-500">
                  Questões
                </p>
              </div>

              <div className="surface-soft rounded-2xl px-4 py-3 text-center">
                <p className="text-xl font-bold text-white">
                  {disciplinas.length}
                </p>
                <p className="mt-1 text-[11px] text-neutral-500">
                  Disciplinas
                </p>
              </div>

              <div className="surface-soft rounded-2xl px-4 py-3 text-center">
                <p className="text-xl font-bold text-orange-400">
                  10
                </p>
                <p className="mt-1 text-[11px] text-neutral-500">
                  por sessão
                </p>
              </div>
            </div>
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
            onClick={iniciarSessao}
            className="premium-card group text-left transition-all duration-200 hover:-translate-y-1 hover:border-orange-500/20"
          >
            <div className="flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-xl text-orange-400">
                ▶
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Iniciar sessão
                </h2>

                <p className="mt-1 text-sm leading-5 text-neutral-500">
                  Resolva até 10 questões aleatórias do banco.
                </p>

                <span className="mt-4 inline-block text-xs font-semibold text-orange-400">
                  Começar agora →
                </span>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={function () {
              setMostrarCriadorIA(true);
            }}
            className="premium-card group text-left transition-all duration-200 hover:-translate-y-1 hover:border-orange-500/20"
          >
            <div className="flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.05] text-xl text-orange-400">
                ✦
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Gerar com IA
                </h2>

                <p className="mt-1 text-sm leading-5 text-neutral-500">
                  Crie questões personalizadas por curso, tema e dificuldade.
                </p>

                <span className="mt-4 inline-block text-xs font-semibold text-orange-400">
                  Abrir gerador →
                </span>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={function () {
              setMostrarCriadorManual(true);
            }}
            className="premium-card group text-left transition-all duration-200 hover:-translate-y-1 hover:border-orange-500/20"
          >
            <div className="flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.05] text-xl text-neutral-300">
                +
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Criar questão
                </h2>

                <p className="mt-1 text-sm leading-5 text-neutral-500">
                  Adicione uma questão manualmente ao seu banco.
                </p>

                <span className="mt-4 inline-block text-xs font-semibold text-orange-400">
                  Criar agora →
                </span>
              </div>
            </div>
          </button>
        </section>

        <section className="mb-6 premium-card">
          <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600">
                ⌕
              </span>

              <input
                type="text"
                value={busca}
                onChange={function (event) {
                  setBusca(event.target.value);
                }}
                placeholder="Buscar por questão, tema ou disciplina..."
                className="input-premium w-full pl-10"
              />
            </div>

            <select
              value={filtroDisciplina}
              onChange={function (event) {
                setFiltroDisciplina(event.target.value);
              }}
              className="input-premium w-full lg:w-52"
            >
              <option value="">Todas as disciplinas</option>

              {disciplinas.map(function (disciplina) {
                return (
                  <option
                    key={disciplina.id}
                    value={disciplina.id}
                  >
                    {disciplina.nome}
                  </option>
                );
              })}
            </select>

            <select
              value={filtroDificuldade}
              onChange={function (event) {
                setFiltroDificuldade(event.target.value);
              }}
              className="input-premium w-full lg:w-40"
            >
              <option value="">Dificuldade</option>

              {dificuldades.map(function (item) {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>

            <button
              type="button"
              onClick={function () {
                setMostrarDisciplina(true);
              }}
              className="btn-secondary whitespace-nowrap"
            >
              + Disciplina
            </button>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Suas questões
              </h2>

              <p className="mt-1 text-xs text-neutral-500">
                {questoesFiltradas.length} questão
                {questoesFiltradas.length === 1 ? "" : "ões"} encontrada
                {questoesFiltradas.length === 1 ? "" : "s"}
              </p>
            </div>

            {(busca || filtroDisciplina || filtroDificuldade) && (
              <button
                type="button"
                onClick={function () {
                  setBusca("");
                  setFiltroDisciplina("");
                  setFiltroDificuldade("");
                }}
                className="text-xs font-medium text-orange-400 hover:text-orange-300"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {carregando ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(function (item) {
                return (
                  <div
                    key={item}
                    className="premium-card p-6"
                  >
                    <div className="skeleton mb-4 h-4 w-32 rounded" />
                    <div className="skeleton mb-2 h-5 w-full rounded" />
                    <div className="skeleton h-5 w-3/4 rounded" />
                  </div>
                );
              })}
            </div>
          ) : questoesFiltradas.length === 0 ? (
            <div className="premium-card py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] text-2xl text-neutral-500">
                ?
              </div>

              <h3 className="mt-5 font-semibold text-white">
                Nenhuma questão encontrada
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
                Crie uma questão manualmente ou use a inteligência artificial
                para começar a construir seu banco.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={function () {
                    setMostrarCriadorIA(true);
                  }}
                  className="btn-primary"
                >
                  Gerar com IA
                </button>

                <button
                  type="button"
                  onClick={function () {
                    setMostrarCriadorManual(true);
                  }}
                  className="btn-secondary"
                >
                  Criar manualmente
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {questoesFiltradas.map(function (questao, index) {
                return (
                  <article
                    key={questao.id}
                    className="premium-card animate-slide-up p-5 transition-all duration-200 hover:border-white/10 sm:p-6"
                    style={{
                      animationDelay: index < 8 ? index * 30 + "ms" : "0ms",
                    }}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="badge badge-orange">
                          {questao.disciplina.nome}
                        </span>

                        {questao.dificuldade && (
                          <span
                            className={obterCorDificuldade(
                              questao.dificuldade
                            )}
                          >
                            {questao.dificuldade}
                          </span>
                        )}

                        {questao.tema && (
                          <span className="badge">
                            {questao.tema}
                          </span>
                        )}
                      </div>

                      <h3 className="max-w-5xl text-sm font-medium leading-6 text-neutral-200 sm:text-base">
                        {questao.enunciado}
                      </h3>

                      <div className="flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 text-xs text-neutral-600">
                          <span>
                            {questao.alternativas.length} alternativas
                          </span>

                          <span>•</span>

                          <span>
                            {questao.explicacao
                              ? "Com explicação"
                              : "Sem explicação"}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={function () {
                            const sessaoUnica: Sessao = {
                              questoes: [
                                {
                                  ...questao,
                                  alternativas: embaralhar(
                                    questao.alternativas
                                  ),
                                },
                              ],
                            };

                            setSessao(sessaoUnica);
                            setIndiceAtual(0);
                            setAlternativaSelecionada(null);
                            setRespostaEnviada(false);
                            setPontuacao(0);
                            setFinalizada(false);
                            setModoResponder(true);
                          }}
                          className="text-left text-xs font-semibold text-orange-400 transition-colors hover:text-orange-300 sm:text-right"
                        >
                          Responder questão →
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {mostrarCriadorIA && (
  <div
className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/85 p-4 pt-20 backdrop-blur-md"
    onMouseDown={function (event) {
      if (event.target === event.currentTarget && !gerandoIA) {
        fecharModais();
      }
    }}
  >
    <div
      className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-[0_25px_80px_rgba(0,0,0,0.75)]"
      onMouseDown={function (event) {
        event.stopPropagation();
      }}
    >
      {/* CABEÇALHO */}
      <div className="flex items-start justify-between border-b border-white/10 bg-[#0d0d0d] px-6 py-5">
        <div>
          <span className="badge badge-orange">
            Inteligência artificial
          </span>

          <h2 className="mt-3 text-xl font-bold tracking-tight text-white">
            Gerar questões com IA
          </h2>

          <p className="mt-1 text-sm text-neutral-400">
            Defina o conteúdo e deixe a IA montar seu banco.
          </p>
        </div>

        <button
          type="button"
          onClick={fecharModais}
          disabled={gerandoIA}
          className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] text-xl text-neutral-500 transition hover:border-white/10 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          ×
        </button>
      </div>

      {/* CONTEÚDO */}
      <div className="space-y-5 bg-[#0b0b0b] p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-medium text-neutral-400">
              Curso
            </label>

            <input
              value={curso}
              onChange={function (event) {
                setCurso(event.target.value);
              }}
              className="input-premium w-full"
              placeholder="Ex.: Enfermagem"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-neutral-400">
              Disciplina
            </label>

            <input
              list="disciplinas-lista"
              value={disciplinaIA}
              onChange={function (event) {
                setDisciplinaIA(event.target.value);
              }}
              className="input-premium w-full"
              placeholder="Ex.: Fisiologia"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-neutral-400">
            Tema
          </label>

          <input
            value={temaIA}
            onChange={function (event) {
              setTemaIA(event.target.value);
            }}
            className="input-premium w-full"
            placeholder="Ex.: Sistema cardiovascular"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-medium text-neutral-400">
              Dificuldade
            </label>

            <select
              value={dificuldadeIA}
              onChange={function (event) {
                setDificuldadeIA(event.target.value);
              }}
              className="input-premium w-full"
            >
              {dificuldades.map(function (item) {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-neutral-400">
              Quantidade
            </label>

            <select
              value={quantidadeIA}
              onChange={function (event) {
                setQuantidadeIA(event.target.value);
              }}
              className="input-premium w-full"
            >
              {["1", "2", "3", "5", "10"].map(function (item) {
                return (
                  <option key={item} value={item}>
                    {item} questão
                    {item === "1" ? "" : "ões"}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* AVISO */}
        <div className="rounded-2xl border border-orange-500/15 bg-orange-500/[0.06] p-4">
          <div className="flex gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-sm text-orange-400">
              ✦
            </div>

            <p className="text-xs leading-5 text-neutral-400">
              A IA criará questões com cinco alternativas, uma resposta
              correta e explicação, quando disponível.
            </p>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={fecharModais}
            className="btn-secondary"
            disabled={gerandoIA}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={gerarQuestoesIA}
            disabled={gerandoIA}
            className="btn-primary min-w-[160px]"
          >
            {gerandoIA ? "Gerando questões..." : "Gerar questões"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{mostrarCriadorManual && (
  <div
    className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/85 p-4 pt-20 backdrop-blur-md"
    onMouseDown={function (event) {
      if (event.target === event.currentTarget && !salvandoManual) {
        fecharModais();
      }
    }}
  >
    <div
      className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] shadow-[0_25px_80px_rgba(0,0,0,0.75)]"
      onMouseDown={function (event) {
        event.stopPropagation();
      }}
    >
      {/* CABEÇALHO */}
      <div className="flex items-start justify-between border-b border-white/10 bg-[#0d0d0d] px-6 py-5">
        <div>
          <span className="badge badge-orange">
            Criação manual
          </span>

          <h2 className="mt-3 text-xl font-bold tracking-tight text-white">
            Criar questão
          </h2>

          <p className="mt-1 text-sm text-neutral-400">
            Monte sua própria questão e adicione ao seu banco.
          </p>
        </div>

        <button
          type="button"
          onClick={fecharModais}
          disabled={salvandoManual}
          className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] text-xl text-neutral-500 transition hover:border-white/10 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          ×
        </button>
      </div>

      {/* CONTEÚDO */}
      <div className="space-y-5 bg-[#0b0b0b] p-6">

        {/* DISCIPLINA + DIFICULDADE */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-medium text-neutral-400">
              Disciplina
            </label>

            <input
              list="disciplinas-lista"
              value={disciplinaManual}
              onChange={function (event) {
                setDisciplinaManual(event.target.value);
              }}
              className="input-premium w-full"
              placeholder="Ex.: Fisiologia"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-neutral-400">
              Dificuldade
            </label>

            <select
              value={dificuldade}
              onChange={function (event) {
                setDificuldade(event.target.value);
              }}
              className="input-premium w-full"
            >
              {dificuldades.map(function (item) {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* TEMA */}
        <div>
          <label className="mb-2 block text-xs font-medium text-neutral-400">
            Tema
          </label>

          <input
            value={tema}
            onChange={function (event) {
              setTema(event.target.value);
            }}
            className="input-premium w-full"
            placeholder="Ex.: Sistema cardiovascular"
          />
        </div>

        {/* ENUNCIADO */}
        <div>
          <label className="mb-2 block text-xs font-medium text-neutral-400">
            Enunciado
          </label>

          <textarea
            value={enunciado}
            onChange={function (event) {
              setEnunciado(event.target.value);
            }}
            className="input-premium min-h-[130px] w-full resize-y"
            placeholder="Digite o enunciado da questão..."
          />
        </div>

        {/* ALTERNATIVAS */}
        <div>
          <label className="mb-3 block text-xs font-medium text-neutral-400">
            Alternativas
          </label>

          <div className="space-y-3">
            {alternativas.map(function (alternativa, index) {
              return (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  <button
                    type="button"
                    onClick={function () {
                      marcarCorreta(index);
                    }}
                    disabled={salvandoManual}
                    className={
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold transition " +
                      (alternativa.correta
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                        : "border-white/10 bg-white/[0.03] text-neutral-400 hover:border-orange-500/30 hover:text-orange-400")
                    }
                    title="Marcar como correta"
                  >
                    {String.fromCharCode(65 + index)}
                  </button>

                  <input
                    value={alternativa.texto}
                    onChange={function (event) {
                      atualizarAlternativa(
                        index,
                        event.target.value
                      );
                    }}
                    className="input-premium w-full"
                    placeholder={
                      "Alternativa " +
                      String.fromCharCode(65 + index)
                    }
                  />
                </div>
              );
            })}
          </div>

          <p className="mt-3 text-xs text-neutral-600">
            Clique na letra da alternativa correta para marcá-la.
          </p>
        </div>

        {/* EXPLICAÇÃO */}
        <div>
          <label className="mb-2 block text-xs font-medium text-neutral-400">
            Explicação
          </label>

          <textarea
            value={explicacao}
            onChange={function (event) {
              setExplicacao(event.target.value);
            }}
            className="input-premium min-h-[100px] w-full resize-y"
            placeholder="Explique por que essa é a resposta correta..."
          />
        </div>

        {/* BOTÕES */}
        <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={fecharModais}
            disabled={salvandoManual}
            className="btn-secondary"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={criarQuestaoManual}
            disabled={salvandoManual}
            className="btn-primary min-w-[150px]"
          >
            {salvandoManual
              ? "Salvando..."
              : "Criar questão"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {mostrarDisciplina && (
        <div className="overlay fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="premium-card w-full max-w-md animate-fade-in-scale">
            <div className="flex items-start justify-between border-b border-white/5 p-6">
              <div>
                <span className="badge badge-orange">
                  Organização
                </span>

                <h2 className="mt-3 text-xl font-bold text-white">
                  Nova disciplina
                </h2>

                <p className="mt-1 text-sm leading-5 text-neutral-500">
                  Adicione uma disciplina ao seu banco.
                </p>
              </div>

              <button
                type="button"
                onClick={fecharModais}
                className="text-2xl text-neutral-600 transition hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <label className="mb-2 block text-xs font-medium text-neutral-400">
                Nome da disciplina
              </label>

              <input
                autoFocus
                value={novaDisciplina}
                onChange={function (event) {
                  setNovaDisciplina(event.target.value);
                }}
                onKeyDown={function (event) {
                  if (event.key === "Enter") {
                    criarDisciplina();
                  }
                }}
                className="input-premium w-full"
                placeholder="Ex.: Farmacologia"
              />

              <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={fecharModais}
                  className="btn-secondary"
                  disabled={criandoDisciplina}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={criarDisciplina}
                  disabled={criandoDisciplina}
                  className="btn-primary"
                >
                  {criandoDisciplina
                    ? "Criando..."
                    : "Criar disciplina"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <datalist id="disciplinas-lista">
        {disciplinas.map(function (disciplina) {
          return (
            <option
              key={disciplina.id}
              value={disciplina.nome}
            />
          );
        })}
      </datalist>
    </AppLayout>
  );
}