"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";

type Exame = {
  nome?: string;
  exame?: string;
  categoria?: string;
  resultado?: string;
  interpretacao?: string;
  [key: string]: unknown;
};

type Registro = {
  id?: number;
  tipo: string;
  titulo: string;
  pergunta?: string | null;
  resposta: string;
  ordem?: number;
  createdAt?: string;
};

type AchadoImportante = {
  achado: string;
  importancia: string;
};

type DiagnosticoDiferencial = {
  diagnostico: string;
  justificativa: string;
};

type Avaliacao = {
  nota?: number;
  classificacao?: string;
  hipoteseCorreta?: boolean;
  diagnosticoFinal?: string;
  avaliacaoGeral?: string;
  pontosFortes?: string[];
  pontosFracos?: string[];
  achadosImportantes?: AchadoImportante[];
  informacoesNaoInvestigadas?: string[];
  diagnosticosDiferenciais?: DiagnosticoDiferencial[];
  raciocinioEsperado?: string;
  feedbackEducacional?: string;
  avaliadoEm?: string;
};

type Investigacao = {
  id: number;
  status: string;
  informacoesColetadas?: unknown;
  hipotese?: string | null;
  justificativa?: string | null;
  avaliacao?: Avaliacao | null;
  finalizado?: boolean;
  registros?: Registro[];
};

type Caso = {
  id: number;
  titulo: string;
  area: string;
  especialidade?: string | null;
  dificuldade: string;
  cenario: string;
  queixaInicial: string;
  dadosIniciais?: unknown;
  anamnese?: unknown;
  exameFisico?: unknown;
  sinaisVitais?: unknown;
  exames?: unknown;
  evolucao?: unknown;
  publicado?: boolean;
  createdAt?: string;
};

type RespostaApi = {
  sucesso?: boolean;
  caso?: Caso;
  investigacao?: Investigacao;
  registro?: Registro;
  avaliacao?: Avaliacao;
  error?: string;
  mensagem?: string;
};

function formatarTitulo(valor: string): string {
  return valor
    .replace(/([A-Z])/g, " $1")
    .replace(/[\_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (letra) => letra.toUpperCase());
}

function formatarValor(valor: unknown): string {
  if (valor === null || valor === undefined) {
    return "";
  }

  if (typeof valor === "string") {
    return valor;
  }

  if (typeof valor === "number" || typeof valor === "boolean") {
    return String(valor);
  }

  if (Array.isArray(valor)) {
    return valor
      .map((item) => formatarValor(item))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof valor === "object") {
    return Object.entries(valor as Record<string, unknown>)
      .map(([chave, valorItem]) => {
        const texto = formatarValor(valorItem);

        if (!texto) {
          return "";
        }

        return `${formatarTitulo(chave)}: ${texto}`;
      })
      .filter(Boolean)
      .join("\n");
  }

  return String(valor);
}

function normalizarExames(valor: unknown): Exame[] {
  if (!valor) {
    return [];
  }

  if (Array.isArray(valor)) {
    return valor.map((item) => {
      if (typeof item === "string") {
        return {
          nome: item,
        };
      }

      if (item && typeof item === "object") {
        return item as Exame;
      }

      return {
        nome: String(item),
      };
    });
  }

  if (typeof valor === "object") {
    const objeto = valor as Record<string, unknown>;

    return Object.entries(objeto).map(([nome, resultado]) => ({
      nome: formatarTitulo(nome),
      resultado: formatarValor(resultado),
    }));
  }

  if (typeof valor === "string") {
    return [
      {
        nome: "Exame",
        resultado: valor,
      },
    ];
  }

  return [];
}

function dificuldadeClasse(dificuldade: string) {
  const valor = dificuldade.toLowerCase();

  if (valor.includes("fácil") || valor.includes("facil")) {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
  }

  if (valor.includes("difícil") || valor.includes("dificil")) {
    return "border-red-500/20 bg-red-500/10 text-red-400";
  }

  return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
}

async function lerResposta(resposta: Response): Promise<RespostaApi> {
  const texto = await resposta.text();

  if (!texto.trim()) {
    throw new Error(
      `A API retornou uma resposta vazia. Status: ${resposta.status}.`
    );
  }

  try {
    return JSON.parse(texto) as RespostaApi;
  } catch {
    console.error("RESPOSTA BRUTA DA API:", texto);

    throw new Error(
      `A API retornou uma resposta inválida. Status: ${resposta.status}.`
    );
  }
}

export default function CasoClinicoPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const [caso, setCaso] = useState<Caso | null>(null);

  const [investigacao, setInvestigacao] =
    useState<Investigacao | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);

  const [erro, setErro] = useState("");

  const [hipotese, setHipotese] = useState("");
  const [justificativa, setJustificativa] = useState("");

  const [secaoAberta, setSecaoAberta] =
    useState<string | null>("informacoes");

  const exames = useMemo(() => {
    return normalizarExames(caso?.exames);
  }, [caso?.exames]);

  async function carregarCaso() {
    if (!id) {
      setErro("ID do caso não informado.");
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch(`/api/casos/${id}`, {
        method: "GET",
        cache: "no-store",
      });

      const dados = await lerResposta(resposta);

      if (!resposta.ok) {
        throw new Error(
          dados.error ||
            "Não foi possível carregar o caso clínico."
        );
      }

      if (!dados.caso) {
        throw new Error(
          "A API não retornou o caso clínico."
        );
      }

      setCaso(dados.caso);

      if (dados.investigacao) {
        setInvestigacao(dados.investigacao);

        setHipotese(
          dados.investigacao.hipotese || ""
        );

        setJustificativa(
          dados.investigacao.justificativa || ""
        );
      } else {
        setInvestigacao(null);
        setHipotese("");
        setJustificativa("");
      }
    } catch (error) {
      console.error(
        "ERRO AO CARREGAR CASO:",
        error
      );

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar o caso clínico."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarCaso();
  }, [id]);

  async function investigar(
    tipo:
      | "ANAMNESE"
      | "EXAME_FISICO"
      | "SINAIS_VITAIS"
      | "EVOLUCAO"
      | "EXAME",
    exame?: Exame,
    index?: number
  ) {
    if (!id || processando) {
      return;
    }

    if (investigacao?.finalizado === true) {
      setErro(
        "Este caso já foi finalizado. Para investigá-lo novamente, use a opção Refazer caso."
      );
      return;
    }

    try {
      setProcessando(true);
      setErro("");

      const resposta = await fetch(
        `/api/casos/${id}/investigar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tipo,
            exame: exame
              ? {
                  ...exame,
                  index,
                }
              : undefined,
          }),
        }
      );

      const dados = await lerResposta(resposta);

      if (!resposta.ok) {
        throw new Error(
          dados.error ||
            "Não foi possível realizar a investigação."
        );
      }

      if (dados.investigacao) {
        setInvestigacao(dados.investigacao);
      } else if (dados.registro) {
        setInvestigacao((anterior) => {
          if (!anterior) {
            return anterior;
          }

          return {
            ...anterior,
            registros: [
              ...(anterior.registros || []),
              dados.registro as Registro,
            ],
          };
        });
      }
    } catch (error) {
      console.error(
        "ERRO AO INVESTIGAR:",
        error
      );

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível realizar a investigação."
      );
    } finally {
      setProcessando(false);
    }
  }

  async function enviarHipotese() {
    if (!id) {
      return;
    }

    if (investigacao?.finalizado === true) {
      setErro(
        "Este caso já foi finalizado. Para fazer uma nova tentativa, use Refazer caso."
      );
      return;
    }

    if (!hipotese.trim()) {
      setErro(
        "Informe sua hipótese diagnóstica antes de finalizar."
      );
      return;
    }

    if (!justificativa.trim()) {
      setErro(
        "Explique o raciocínio que levou você à hipótese."
      );
      return;
    }

    try {
      setProcessando(true);
      setErro("");

      const resposta = await fetch(
        `/api/casos/${id}/hipotese`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hipotese: hipotese.trim(),
            justificativa: justificativa.trim(),
          }),
        }
      );

      const dados = await lerResposta(resposta);

      if (!resposta.ok) {
        throw new Error(
          dados.error ||
            "Não foi possível avaliar sua hipótese."
        );
      }

      if (dados.investigacao) {
        setInvestigacao(dados.investigacao);
      } else if (dados.avaliacao) {
        setInvestigacao((anterior) => ({
          ...(anterior || {
            id: 0,
            status: "FINALIZADA",
          }),
          status: "FINALIZADA",
          finalizado: true,
          hipotese: hipotese.trim(),
          justificativa: justificativa.trim(),
          avaliacao: dados.avaliacao,
        }));
      }

      await carregarCaso();

      setTimeout(() => {
        const elemento =
          document.getElementById(
            "resultado-caso"
          );

        elemento?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    } catch (error) {
      console.error(
        "ERRO AO ENVIAR HIPÓTESE:",
        error
      );

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível avaliar sua hipótese."
      );
    } finally {
      setProcessando(false);
    }
  }

  async function refazerCaso() {
    if (!id || processando) {
      return;
    }

    const confirmado = window.confirm(
      "Deseja refazer este caso?\n\nSeu progresso, hipótese e avaliação atual serão apagados."
    );

    if (!confirmado) {
      return;
    }

    try {
      setProcessando(true);
      setErro("");

      const resposta = await fetch(
        `/api/casos/${id}/refazer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const dados = await lerResposta(resposta);

      if (!resposta.ok) {
        throw new Error(
          dados.error ||
            "Não foi possível refazer o caso."
        );
      }

      setInvestigacao(
        dados.investigacao || null
      );

      setHipotese("");
      setJustificativa("");

      setSecaoAberta("informacoes");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "ERRO AO REFAZER CASO:",
        error
      );

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível refazer o caso."
      );
    } finally {
      setProcessando(false);
    }
  }

  function renderBlocoDados(
    titulo: string,
    dados: unknown,
    vazio = "Nenhuma informação disponível."
  ) {
    const texto = formatarValor(dados);

    return (
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
        <h3 className="mb-3 text-sm font-bold text-white">
          {titulo}
        </h3>

        {texto ? (
          <div className="whitespace-pre-line text-sm leading-7 text-zinc-400">
            {texto}
          </div>
        ) : (
          <p className="text-sm text-white/30">
            {vazio}
          </p>
        )}
      </div>
    );
  }

  if (carregando) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#050505] px-4 py-8 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="animate-pulse space-y-5">
              <div className="h-8 w-64 rounded-lg bg-white/5" />
              <div className="h-24 rounded-2xl bg-white/5" />
              <div className="h-40 rounded-2xl bg-white/5" />
              <div className="h-56 rounded-2xl bg-white/5" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!caso) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#050505] px-4 py-12 text-white sm:px-6">
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-[#0b0b0b] p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-2xl text-red-400">
              ⚠
            </div>

            <h1 className="text-2xl font-bold">
              Caso não encontrado
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              {erro ||
                "Não foi possível carregar este caso clínico."}
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/casos")
              }
              className="mt-6 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-400"
            >
              Voltar para casos
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const registros =
    investigacao?.registros || [];

  /*
   * IMPORTANTE:
   * O caso só é considerado finalizado quando
   * finalizado === true.
   *
   * Ter uma avaliação salva não é suficiente.
   * Isso evita que solicitar um exame faça
   * a interface mostrar o resultado final.
   */
  const finalizado =
    investigacao?.finalizado === true;

  const avaliacao =
    investigacao?.avaliacao;

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#050505] text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() =>
              router.push("/casos")
            }
            className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
          >
            ← Voltar para casos
          </button>

          <div className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b]">
            <div className="h-1 bg-gradient-to-r from-orange-600 via-orange-400 to-transparent" />

            <div className="p-6 sm:p-8">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-400">
                  {caso.area}
                </span>

                <span
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${dificuldadeClasse(
                    caso.dificuldade
                  )}`}
                >
                  {caso.dificuldade}
                </span>

                <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400">
                  {caso.cenario}
                </span>

                {finalizado && (
                  <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                    ✓ Concluído
                  </span>
                )}
              </div>

              <h1 className="max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl">
                {caso.titulo}
              </h1>

              {caso.especialidade && (
                <p className="mt-2 text-sm text-zinc-500">
                  {caso.especialidade}
                </p>
              )}
            </div>
          </div>

          {erro && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="flex items-start gap-3">
                <span className="text-red-400">
                  ⚠
                </span>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-300">
                    Atenção
                  </p>

                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-red-200/70">
                    {erro}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setErro("")
                  }
                  className="text-zinc-500 hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <section className="mb-5 rounded-2xl border border-orange-500/10 bg-orange-500/[0.035] p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-orange-400">
                ▸
              </span>

              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                Queixa inicial
              </h2>
            </div>

            <p className="text-lg leading-8 text-zinc-200">
              {caso.queixaInicial}
            </p>
          </section>

          <section className="mb-5 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0b]">
            <button
              type="button"
              onClick={() =>
                setSecaoAberta(
                  secaoAberta ===
                    "informacoes"
                    ? null
                    : "informacoes"
                )
              }
              className="flex w-full items-center justify-between p-5 text-left"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-400">
                  Informações iniciais
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  Dados disponíveis
                </h2>
              </div>

              <span className="text-zinc-500">
                {secaoAberta ===
                "informacoes"
                  ? "−"
                  : "+"}
              </span>
            </button>

            {secaoAberta ===
              "informacoes" && (
              <div className="border-t border-white/[0.06] p-5">
                {renderBlocoDados(
                  "Dados iniciais",
                  caso.dadosIniciais
                )}

                <div className="mt-4">
                  {renderBlocoDados(
                    "Sinais vitais iniciais",
                    caso.sinaisVitais
                  )}
                </div>
              </div>
            )}
          </section>

          {!finalizado && (
            <section className="mb-5 rounded-2xl border border-white/[0.07] bg-[#0b0b0b] p-5 sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-400">
                  Investigação
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  O que você quer investigar?
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Solicite informações progressivamente. Use os dados para construir seu raciocínio clínico.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    tipo: "ANAMNESE" as const,
                    simbolo: "▤",
                    titulo: "Anamnese",
                    descricao:
                      "História e informações do paciente",
                  },
                  {
                    tipo: "EXAME_FISICO" as const,
                    simbolo: "♧",
                    titulo: "Exame físico",
                    descricao:
                      "Achados do exame físico",
                  },
                  {
                    tipo: "SINAIS_VITAIS" as const,
                    simbolo: "♥",
                    titulo: "Sinais vitais",
                    descricao:
                      "Verificar parâmetros vitais",
                  },
                  {
                    tipo: "EVOLUCAO" as const,
                    simbolo: "↗",
                    titulo: "Evolução",
                    descricao:
                      "Acompanhar evolução clínica",
                  },
                ].map((item) => (
                  <button
                    key={item.tipo}
                    type="button"
                    disabled={processando}
                    onClick={() =>
                      investigar(
                        item.tipo
                      )
                    }
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 text-left transition hover:border-orange-500/30 hover:bg-orange-500/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="mb-3 text-xl">
                      {item.simbolo}
                    </div>

                    <div className="font-semibold">
                      {item.titulo}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-zinc-600">
                      {item.descricao}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="mb-5 rounded-2xl border border-white/[0.07] bg-[#0b0b0b] p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-400">
                Exames
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Exames diagnósticos disponíveis
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Solicite um exame para receber seu resultado durante a investigação.
              </p>
            </div>

            {exames.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-sm text-white/35">
                Este caso não possui exames cadastrados.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {exames.map(
                  (exame, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4"
                    >
                      <div className="mb-1 text-sm font-semibold text-white">
                        {exame.nome ||
                          exame.exame ||
                          `Exame ${index + 1}`}
                      </div>

                      {exame.categoria && (
                        <div className="mb-3 text-xs text-orange-400">
                          {exame.categoria}
                        </div>
                      )}

                      <div className="mb-4 min-h-10 whitespace-pre-line text-sm leading-6 text-zinc-500">
                        {exame.resultado ||
                          "Resultado disponível mediante solicitação."}
                      </div>

                      {exame.interpretacao && (
                        <div className="mb-4 rounded-xl border border-white/[0.05] bg-black/20 p-3">
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                            Interpretação
                          </p>

                          <p className="whitespace-pre-line text-xs leading-5 text-zinc-500">
                            {exame.interpretacao}
                          </p>
                        </div>
                      )}

                      {!finalizado && (
                        <button
                          type="button"
                          disabled={processando}
                          onClick={() =>
                            investigar(
                              "EXAME",
                              exame,
                              index
                            )
                          }
                          className="w-full rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-2.5 text-xs font-bold text-orange-400 transition hover:bg-orange-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {processando
                            ? "Solicitando..."
                            : "Solicitar exame"}
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </section>

          <section className="mb-5 rounded-2xl border border-white/[0.07] bg-[#0b0b0b] p-5 sm:p-6">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-400">
                  Investigação
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Informações coletadas
                </h2>
              </div>

              <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-500">
                {registros.length}{" "}
                {registros.length === 1
                  ? "registro"
                  : "registros"}
              </span>
            </div>

            {registros.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
                <div className="mb-3 text-2xl text-zinc-700">
                  ⌕
                </div>

                <p className="text-sm text-zinc-500">
                  Você ainda não coletou informações adicionais.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {registros.map(
                  (registro, index) => (
                    <div
                      key={
                        registro.id ??
                        index
                      }
                      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-orange-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-400">
                          {formatarTitulo(
                            registro.tipo
                          )}
                        </span>

                        <span className="text-sm font-semibold text-white">
                          {registro.titulo}
                        </span>
                      </div>

                      {registro.pergunta && (
                        <p className="mb-2 text-xs text-zinc-600">
                          {registro.pergunta}
                        </p>
                      )}

                      <p className="whitespace-pre-line text-sm leading-6 text-zinc-400">
                        {registro.resposta}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </section>

          {!finalizado && (
            <section className="mb-5 rounded-3xl border border-orange-500/15 bg-[#0b0b0b] p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-400">
                  Raciocínio clínico
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Qual é sua hipótese?
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                  Quando considerar que possui informações suficientes, registre sua hipótese diagnóstica e explique o raciocínio utilizado.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Hipótese diagnóstica
                  </label>

                  <input
                    type="text"
                    value={hipotese}
                    onChange={(e) =>
                      setHipotese(
                        e.target.value
                      )
                    }
                    placeholder="Ex.: Tromboembolismo pulmonar"
                    disabled={processando}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-orange-500/50 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Justificativa
                  </label>

                  <textarea
                    value={justificativa}
                    onChange={(e) =>
                      setJustificativa(
                        e.target.value
                      )
                    }
                    placeholder="Explique quais achados sustentam sua hipótese e como você chegou a essa conclusão..."
                    disabled={processando}
                    rows={6}
                    className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-700 focus:border-orange-500/50 disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setHipotese("");
                      setJustificativa("");
                    }}
                    disabled={processando}
                    className="h-11 rounded-xl border border-white/10 px-5 text-sm font-semibold text-zinc-500 transition hover:border-white/20 hover:text-white disabled:opacity-40"
                  >
                    Limpar
                  </button>

                  <button
                    type="button"
                    onClick={
                      enviarHipotese
                    }
                    disabled={processando}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-bold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processando ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                        Avaliando...
                      </>
                    ) : (
                      "Finalizar caso →"
                    )}
                  </button>
                </div>
              </div>
            </section>
          )}

          {finalizado && avaliacao && (
            <section
              id="resultado-caso"
              className="mb-8 overflow-hidden rounded-3xl border border-orange-500/20 bg-[#0b0b0b]"
            >
              <div className="border-b border-white/[0.07] bg-orange-500/[0.04] p-6 sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                      Caso finalizado
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      Resultado da investigação
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">
                      Abaixo está a avaliação do seu raciocínio clínico.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      refazerCaso
                    }
                    disabled={processando}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-5 text-sm font-bold text-orange-400 transition hover:bg-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processando
                      ? "Reiniciando..."
                      : "↻ Refazer caso"}
                  </button>
                </div>
              </div>

              <div className="border-b border-white/[0.07] bg-white/[0.015] px-6 py-4 sm:px-7">
                <p className="text-xs leading-5 text-zinc-600">
                  Ao refazer, sua investigação e avaliação atual serão apagadas para que você possa resolver o caso novamente.
                </p>
              </div>

              <div className="space-y-6 p-6 sm:p-7">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      Nota
                    </p>

                    <p className="mt-2 text-4xl font-bold text-orange-400">
                      {typeof avaliacao.nota ===
                      "number"
                        ? avaliacao.nota.toFixed(
                            1
                          )
                        : "—"}
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      de 10,0
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      Classificação
                    </p>

                    <p className="mt-3 text-lg font-bold text-white">
                      {avaliacao.classificacao ||
                        "Avaliado"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      Sua hipótese
                    </p>

                    <p
                      className={`mt-3 text-lg font-bold ${
                        avaliacao.hipoteseCorreta
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {avaliacao.hipoteseCorreta
                        ? "✓ Correta"
                        : "✕ Não compatível"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.05] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-400">
                    Diagnóstico final
                  </p>

                  <p className="mt-2 text-xl font-bold text-white">
                    {avaliacao.diagnosticoFinal ||
                      "Diagnóstico não informado"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Sua hipótese
                  </p>

                  <p className="mt-2 text-lg font-semibold text-white">
                    {investigacao.hipotese}
                  </p>

                  {investigacao.justificativa && (
                    <div className="mt-4 border-t border-white/[0.06] pt-4">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-600">
                        Sua justificativa
                      </p>

                      <p className="whitespace-pre-line text-sm leading-7 text-zinc-400">
                        {
                          investigacao.justificativa
                        }
                      </p>
                    </div>
                  )}
                </div>

                {avaliacao.avaliacaoGeral && (
                  <div>
                    <h3 className="mb-2 text-sm font-bold text-white">
                      Avaliação geral
                    </h3>

                    <p className="whitespace-pre-line text-sm leading-7 text-zinc-400">
                      {
                        avaliacao.avaliacaoGeral
                      }
                    </p>
                  </div>
                )}

                {avaliacao.pontosFortes &&
                  avaliacao.pontosFortes.length >
                    0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-bold text-emerald-400">
                        Pontos fortes
                      </h3>

                      <div className="space-y-2">
                        {avaliacao.pontosFortes.map(
                          (
                            item,
                            index
                          ) => (
                            <div
                              key={index}
                              className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] p-3 text-sm leading-6 text-zinc-400"
                            >
                              {item}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {avaliacao.pontosFracos &&
                  avaliacao.pontosFracos.length >
                    0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-bold text-red-400">
                        Pontos a melhorar
                      </h3>

                      <div className="space-y-2">
                        {avaliacao.pontosFracos.map(
                          (
                            item,
                            index
                          ) => (
                            <div
                              key={index}
                              className="rounded-xl border border-red-500/10 bg-red-500/[0.03] p-3 text-sm leading-6 text-zinc-400"
                            >
                              {item}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {avaliacao.achadosImportantes &&
                  avaliacao.achadosImportantes.length >
                    0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-bold text-white">
                        Achados importantes
                      </h3>

                      <div className="space-y-3">
                        {avaliacao.achadosImportantes.map(
                          (
                            item,
                            index
                          ) => (
                            <div
                              key={index}
                              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                            >
                              <p className="text-sm font-semibold text-white">
                                {
                                  item.achado
                                }
                              </p>

                              <p className="mt-1 text-sm leading-6 text-zinc-500">
                                {
                                  item.importancia
                                }
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {avaliacao.informacoesNaoInvestigadas &&
                  avaliacao.informacoesNaoInvestigadas.length >
                    0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-bold text-yellow-400">
                        Informações que poderiam ter sido investigadas
                      </h3>

                      <div className="space-y-2">
                        {avaliacao.informacoesNaoInvestigadas.map(
                          (
                            item,
                            index
                          ) => (
                            <div
                              key={index}
                              className="rounded-xl border border-yellow-500/10 bg-yellow-500/[0.03] p-3 text-sm leading-6 text-zinc-400"
                            >
                              {item}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {avaliacao.diagnosticosDiferenciais &&
                  avaliacao.diagnosticosDiferenciais.length >
                    0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-bold text-white">
                        Diagnósticos diferenciais
                      </h3>

                      <div className="space-y-3">
                        {avaliacao.diagnosticosDiferenciais.map(
                          (
                            item,
                            index
                          ) => (
                            <div
                              key={index}
                              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                            >
                              <p className="text-sm font-semibold text-white">
                                {
                                  item.diagnostico
                                }
                              </p>

                              <p className="mt-1 text-sm leading-6 text-zinc-500">
                                {
                                  item.justificativa
                                }
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {avaliacao.raciocinioEsperado && (
                  <div>
                    <h3 className="mb-2 text-sm font-bold text-white">
                      Raciocínio esperado
                    </h3>

                    <p className="whitespace-pre-line text-sm leading-7 text-zinc-400">
                      {
                        avaliacao.raciocinioEsperado
                      }
                    </p>
                  </div>
                )}

                {avaliacao.feedbackEducacional && (
                  <div className="rounded-2xl border border-orange-500/10 bg-orange-500/[0.03] p-5">
                    <h3 className="mb-2 text-sm font-bold text-orange-400">
                      Feedback educacional
                    </h3>

                    <p className="whitespace-pre-line text-sm leading-7 text-zinc-400">
                      {
                        avaliacao.feedbackEducacional
                      }
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          <div className="pb-10 text-center">
            <button
              type="button"
              onClick={() =>
                router.push("/casos")
              }
              className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-zinc-400 transition hover:border-white/20 hover:text-white"
            >
              ← Voltar para todos os casos
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}