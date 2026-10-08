import OpenAI from "openai";
import { prisma } from "../../lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MINIMO_POR_ASSUNTO = 15;
const ORIGEM = "cortex-questoes-ia-v1";

type CardGerado = {
  frente: string;
  verso: string;
  dificuldade: "facil" | "medio" | "dificil";
  subassunto: string | null;
  conhecimentoChave: string;
  referencias: number[];
};

function normalizar(value: string) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function validarCard(value: any, questaoIds: Set<number>): CardGerado | null {
  if (!value || typeof value !== "object") return null;

  const frente = String(value.frente || "").trim();
  const verso = String(value.verso || "").trim();
  const dificuldadeRaw = String(value.dificuldade || "medio").trim().toLowerCase();
  const subassunto = value.subassunto ? String(value.subassunto).trim() : null;
  const conhecimentoChave = String(value.conhecimentoChave || "").trim();

  const dificuldade: CardGerado["dificuldade"] =
    dificuldadeRaw === "facil" || dificuldadeRaw === "dificil"
      ? dificuldadeRaw
      : "medio";

  const referencias: number[] = Array.isArray(value.referencias)
    ? Array.from(
        new Set<number>(
          value.referencias
            .map((id: any) => Number(id))
            .filter((id: number) => Number.isInteger(id) && questaoIds.has(id))
        )
      ).slice(0, 8)
    : [];

  if (!frente || !verso || !conhecimentoChave) return null;
  if (frente.length > 240 || verso.length > 1000) return null;

  return {
    frente,
    verso,
    dificuldade,
    subassunto,
    conhecimentoChave,
    referencias,
  };
}

async function gerarCards(
  disciplina: string,
  assunto: string,
  quantidade: number,
  questoes: Array<{
    id: number;
    enunciado: string;
    explicacao: string | null;
    dificuldade: string | null;
    alternativas: Array<{ texto: string; correta: boolean }>;
  }>,
  existentes: Array<{ frente: string; conhecimentoChave: string | null }>
): Promise<CardGerado[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY não configurada.");
  }

  const questaoIds = new Set(questoes.map((q) => q.id));

  const fonte = questoes
    .map((q) => {
      const correta = q.alternativas.find((a) => a.correta);
      return [
        "Q" + q.id,
        q.enunciado,
        correta ? "Gabarito: " + correta.texto : "",
        q.explicacao ? "Explicação: " + q.explicacao : "",
      ].filter(Boolean).join("\n");
    })
    .join("\n\n---\n\n")
    .slice(0, 24000);

  const jaExistentes = existentes
    .slice(0, 30)
    .map((c) => c.conhecimentoChave || c.frente)
    .join(" | ")
    .slice(0, 5000);

  const response = await openai.responses.create({
    model: process.env.FLASHCARD_SEED_MODEL || process.env.QUESTION_SEED_MODEL || "gpt-5.4-mini",
    reasoning: { effort: "low" },
    input: [
      {
        role: "system",
        content: [
          "Você cria flashcards de alta qualidade para revisão ativa no Cortex.",
          "Use prioritariamente e estritamente os conhecimentos sustentados pelas questões fornecidas.",
          "NÃO copie nem converta mecanicamente enunciados em flashcards.",
          "Extraia conceitos, mecanismos, funções, causas, consequências, diagnóstico, tratamento, farmacologia, efeitos adversos, contraindicações, sinais e sintomas, fisiopatologia, raciocínio clínico, comparações e pegadinhas quando fizer sentido.",
          "Cada frente deve testar UM conhecimento principal, ser curta, inequívoca e exigir recuperação ativa.",
          "O verso deve ser objetivo, correto e suficiente para compreender o conceito.",
          "Evite perguntas triviais, repetitivas, ambíguas ou que admitam várias respostas.",
          "Não invente informação que não seja sustentada pelo material fornecido.",
          "Distribua os cards entre tipos diferentes de conhecimento conforme o assunto permitir.",
          "Quando houver conceitos parecidos, prefira alguns cards comparativos.",
          "Quando houver contexto clínico suficiente, inclua alguns cards de raciocínio clínico.",
          "conhecimentoChave deve ser uma frase curta e canônica que represente o conceito testado.",
          "referencias deve conter somente IDs Q fornecidos que sustentem diretamente o card.",
          "Retorne exatamente a quantidade pedida."
        ].join(" "),
      },
      {
        role: "user",
        content:
          "Disciplina: " + disciplina +
          "\nAssunto: " + assunto +
          "\nQuantidade: " + quantidade +
          "\nConhecimentos/cards já existentes a evitar: " + (jaExistentes || "nenhum") +
          "\n\nQUESTÕES-FONTE:\n" + fonte,
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "flashcards_cortex",
        strict: true,
        schema: {
          type: "object",
          properties: {
            flashcards: {
              type: "array",
              minItems: quantidade,
              maxItems: quantidade,
              items: {
                type: "object",
                properties: {
                  frente: { type: "string" },
                  verso: { type: "string" },
                  dificuldade: {
                    type: "string",
                    enum: ["facil", "medio", "dificil"],
                  },
                  subassunto: {
                    anyOf: [
                      { type: "string" },
                      { type: "null" },
                    ],
                  },
                  conhecimentoChave: { type: "string" },
                  referencias: {
                    type: "array",
                    items: { type: "integer" },
                    maxItems: 8,
                  },
                },
                required: [
                  "frente",
                  "verso",
                  "dificuldade",
                  "subassunto",
                  "conhecimentoChave",
                  "referencias",
                ],
                additionalProperties: false,
              },
            },
          },
          required: ["flashcards"],
          additionalProperties: false,
        },
      },
    },
  });

  const parsed = JSON.parse(response.output_text || "{}");
  const raw = Array.isArray(parsed.flashcards) ? parsed.flashcards : [];

  const seen = new Set(
    existentes.flatMap((card) => [
      normalizar(card.frente),
      normalizar(card.conhecimentoChave || ""),
    ])
  );

  const validos: CardGerado[] = [];

  for (const item of raw) {
    const card = validarCard(item, questaoIds);
    if (!card) continue;

    const frenteKey = normalizar(card.frente);
    const knowledgeKey = normalizar(card.conhecimentoChave);

    if (!frenteKey || !knowledgeKey) continue;
    if (seen.has(frenteKey) || seen.has(knowledgeKey)) continue;

    seen.add(frenteKey);
    seen.add(knowledgeKey);
    validos.push(card);

    if (validos.length >= quantidade) break;
  }

  return validos;
}

export async function sincronizarFlashcardsInteligentes() {
  if (process.env.SEED_FLASHCARDS_INTELIGENTES === "0") {
    console.log("[flashcards-ai] sincronização desativada por ambiente.");
    return;
  }

  const usuario = await prisma.usuario.findFirst({
    orderBy: { id: "asc" },
    select: { id: true },
  });

  if (!usuario) {
    console.warn("[flashcards-ai] Nenhum usuário encontrado para vincular a biblioteca global.");
    return;
  }

  const usuarioId = usuario.id;

  const grupos = await prisma.questao.groupBy({
    by: ["disciplinaId", "tema"],
    where: {
      tema: { not: null },
    },
    _count: { _all: true },
  });

  const disciplinas = await prisma.disciplina.findMany({
    select: { id: true, nome: true },
  });

  const nomes = new Map(disciplinas.map((d) => [d.id, d.nome]));
  const tarefas = grupos
    .filter((g) => String(g.tema || "").trim())
    .map((g) => ({
      disciplinaId: g.disciplinaId,
      disciplina: nomes.get(g.disciplinaId) || "Geral",
      assunto: String(g.tema),
      quantidadeQuestoes: g._count._all,
    }));

  console.log(
    "[flashcards-ai] iniciando:",
    tarefas.length,
    "assuntos; mínimo",
    MINIMO_POR_ASSUNTO,
    "cards por assunto."
  );

  let proxima = 0;
  let inseridosTotal = 0;
  let completos = 0;

  async function processar(tarefa: typeof tarefas[number]) {
    const existentes = await prisma.flashcard.findMany({
      where: {
        disciplina: { equals: tarefa.disciplina, mode: "insensitive" },
        tema: { equals: tarefa.assunto, mode: "insensitive" },
        status: "ATIVO",
      },
      select: {
        id: true,
        frente: true,
        conhecimentoChave: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (existentes.length >= MINIMO_POR_ASSUNTO) {
      completos += 1;
      return;
    }

    const faltam = MINIMO_POR_ASSUNTO - existentes.length;

    const questoes = await prisma.questao.findMany({
      where: {
        disciplinaId: tarefa.disciplinaId,
        tema: { equals: tarefa.assunto, mode: "insensitive" },
      },
      select: {
        id: true,
        enunciado: true,
        explicacao: true,
        dificuldade: true,
        alternativas: {
          select: {
            texto: true,
            correta: true,
          },
        },
      },
      orderBy: { id: "desc" },
      take: 40,
    });

    if (!questoes.length) return;

    console.log(
      "[flashcards-ai] gerando",
      faltam,
      "para",
      tarefa.disciplina,
      "/",
      tarefa.assunto,
      "a partir de",
      questoes.length,
      "questões."
    );

    let pendentes = faltam;
    let tentativas = 0;
    let contextoExistentes = existentes.map((c) => ({
      frente: c.frente,
      conhecimentoChave: c.conhecimentoChave,
    }));

    while (pendentes > 0 && tentativas < 3) {
      tentativas += 1;
      const cards = await gerarCards(
        tarefa.disciplina,
        tarefa.assunto,
        pendentes,
        questoes,
        contextoExistentes
      );

      if (!cards.length) continue;

      for (const card of cards) {
        const duplicado = await prisma.flashcard.findFirst({
          where: {
            OR: [
              {
                frente: {
                  equals: card.frente,
                  mode: "insensitive",
                },
              },
              {
                conhecimentoChave: {
                  equals: card.conhecimentoChave,
                  mode: "insensitive",
                },
                disciplina: {
                  equals: tarefa.disciplina,
                  mode: "insensitive",
                },
                tema: {
                  equals: tarefa.assunto,
                  mode: "insensitive",
                },
              },
            ],
          },
          select: { id: true },
        });

        if (duplicado) continue;

        const referenciaPrincipal = card.referencias[0] || questoes[0].id;

        await prisma.flashcard.create({
          data: {
            frente: card.frente,
            verso: card.verso,
            usuarioId,
            questaoId: referenciaPrincipal,
            origem: ORIGEM,
            tema: tarefa.assunto,
            subassunto: card.subassunto,
            disciplina: tarefa.disciplina,
            dificuldade: card.dificuldade,
            status: "ATIVO",
            referenciasQuestoes: card.referencias,
            conhecimentoChave: card.conhecimentoChave,
          },
        });

        contextoExistentes.push({
          frente: card.frente,
          conhecimentoChave: card.conhecimentoChave,
        });

        pendentes -= 1;
        inseridosTotal += 1;

        if (pendentes <= 0) break;
      }
    }

    if (pendentes <= 0) {
      completos += 1;
      console.log(
        "[flashcards-ai] completo:",
        tarefa.disciplina,
        "/",
        tarefa.assunto,
        "=",
        MINIMO_POR_ASSUNTO
      );
    } else {
      console.warn(
        "[flashcards-ai] incompleto:",
        tarefa.disciplina,
        "/",
        tarefa.assunto,
        "faltam",
        pendentes
      );
    }
  }

  async function worker(id: number) {
    while (true) {
      const indice = proxima++;
      if (indice >= tarefas.length) return;

      try {
        await processar(tarefas[indice]);
      } catch (error) {
        console.error(
          "[flashcards-ai] falha worker",
          id,
          tarefas[indice].disciplina,
          "/",
          tarefas[indice].assunto,
          ":",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  }

  const concorrencia = Math.max(
    1,
    Math.min(
      Number(process.env.FLASHCARD_SEED_CONCURRENCY || 2) || 2,
      3
    )
  );

  await Promise.all(
    Array.from({ length: concorrencia }, (_, i) => worker(i + 1))
  );

  console.log(
    "[flashcards-ai] concluído:",
    completos,
    "assuntos completos;",
    inseridosTotal,
    "novos flashcards."
  );
}
