import OpenAI from "openai";
import { prisma } from "../../lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const FONTE = "cortex-matriz-concursos-30-assunto-v1";
const META_POR_ASSUNTO = 30;

type MatrizDisciplina = {
  disciplina: string;
  assuntos: string[];
};

const MATRIZ: MatrizDisciplina[] = [
  {
    disciplina: "Direito Administrativo",
    assuntos: [
      "Princípios da Administração Pública",
      "Organização Administrativa",
      "Atos Administrativos",
      "Poderes Administrativos",
      "Agentes Públicos",
      "Serviços Públicos",
      "Responsabilidade Civil do Estado",
      "Licitações e Contratos",
      "Controle da Administração Pública",
      "Improbidade Administrativa",
    ],
  },
  {
    disciplina: "Enfermagem",
    assuntos: [
      "Processo de Enfermagem e SAE",
      "Fundamentos e Semiotécnica",
      "Segurança do Paciente",
      "Controle de Infecção e Biossegurança",
      "Administração de Medicamentos e Cálculos",
      "Urgência e Emergência",
      "Saúde do Adulto e do Idoso",
      "Saúde da Mulher",
      "Saúde da Criança e do Adolescente",
      "Saúde Mental",
      "Atenção Primária à Saúde",
      "Epidemiologia, Vigilância e Imunização",
      "Centro Cirúrgico e CME",
      "Gestão em Enfermagem",
      "Ética e Legislação em Enfermagem",
    ],
  },
  {
    disciplina: "Informática",
    assuntos: [
      "Hardware e Periféricos",
      "Software e Sistemas Operacionais",
      "Windows",
      "Microsoft Word",
      "Microsoft Excel",
      "Internet e Navegadores",
      "Correio Eletrônico",
      "Redes de Computadores",
      "Segurança da Informação",
      "Computação em Nuvem e Backup",
    ],
  },
  {
    disciplina: "Legislação do COFEN",
    assuntos: [
      "Lei 7.498/1986",
      "Decreto 94.406/1987",
      "Código de Ética dos Profissionais de Enfermagem",
      "Sistema COFEN/COREN",
      "Processo de Enfermagem",
      "Registros de Enfermagem",
      "Responsabilidade Profissional",
      "Supervisão e Delegação",
      "Processo Ético-Disciplinar",
      "Inscrição, Registro e Especialidades",
    ],
  },
  {
    disciplina: "Legislação do SUS",
    assuntos: [
      "Constituição Federal - Saúde",
      "Lei 8.080/1990 - Princípios e Diretrizes",
      "Lei 8.080/1990 - Organização e Competências",
      "Lei 8.142/1990",
      "Decreto 7.508/2011",
      "Atenção Primária e PNAB",
      "Redes de Atenção à Saúde",
      "Vigilância em Saúde",
      "Financiamento do SUS e LC 141/2012",
      "Controle Social no SUS",
    ],
  },
  {
    disciplina: "Língua Portuguesa",
    assuntos: [
      "Interpretação de Textos",
      "Semântica e Significação",
      "Classes de Palavras",
      "Sintaxe da Oração e do Período",
      "Concordância Verbal e Nominal",
      "Regência Verbal e Nominal",
      "Crase",
      "Pontuação",
      "Ortografia e Acentuação",
      "Coesão e Coerência",
    ],
  },
  {
    disciplina: "Raciocínio Lógico e Matemática",
    assuntos: [
      "Proposições e Conectivos",
      "Tabelas-Verdade",
      "Equivalências e Negações",
      "Argumentação Lógica",
      "Conjuntos",
      "Razão, Proporção e Porcentagem",
      "Regra de Três e Problemas Aritméticos",
      "Sequências e Padrões",
      "Análise Combinatória",
      "Probabilidade",
    ],
  },
  {
    disciplina: "Simulados 2026",
    assuntos: [
      "Simulado ENARE",
      "Simulado EBSERH",
      "Simulado Ministério da Saúde",
      "Revisão Geral de Enfermagem",
      "Revisão Geral do SUS",
      "Revisão COFEN",
      "Conhecimentos Básicos",
      "Simulado Misto Final",
    ],
  },
];

type QuestaoGerada = {
  enunciado: string;
  explicacao: string;
  dificuldade: "facil" | "medio" | "dificil";
  alternativas: Array<{
    texto: string;
    correta: boolean;
  }>;
};

function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validarQuestao(value: any): QuestaoGerada | null {
  if (!value || typeof value !== "object") return null;

  const enunciado = String(value.enunciado || "").trim();
  const explicacao = String(value.explicacao || "").trim();
  const dificuldadeRaw = String(value.dificuldade || "medio").trim().toLowerCase();
  const alternativas = Array.isArray(value.alternativas)
    ? value.alternativas
        .map((item: any) => ({
          texto: String(item && item.texto || "").trim(),
          correta: Boolean(item && item.correta),
        }))
        .filter((item: any) => item.texto)
    : [];

  const dificuldade: QuestaoGerada["dificuldade"] =
    dificuldadeRaw === "facil" || dificuldadeRaw === "dificil"
      ? dificuldadeRaw
      : "medio";

  if (!enunciado || !explicacao || alternativas.length !== 5) return null;
  if (alternativas.filter((item: any) => item.correta).length !== 1) return null;

  return {
    enunciado,
    explicacao,
    dificuldade,
    alternativas,
  };
}

async function gerarLote(
  disciplina: string,
  assunto: string,
  quantidade: number,
  contextoExistente: string[]
): Promise<QuestaoGerada[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY não configurada.");
  }

  const response = await openai.responses.create({
    model: process.env.QUESTION_SEED_MODEL || "gpt-5.4-mini",
    reasoning: { effort: "low" },
    input: [
      {
        role: "system",
        content: [
          "Você cria questões AUTORAIS para o banco de questões do Cortex.",
          "Não copie, transcreva, reconstrua nem parafraseie de perto questões proprietárias de cursos, apostilas ou plataformas pagas.",
          "Use apenas o nome da disciplina e do assunto como referência curricular.",
          "O estilo deve ser de concursos públicos, ENARE e EBSERH quando pertinente.",
          "As questões precisam ser tecnicamente corretas, claras e úteis para estudo.",
          "Cada questão deve ter exatamente 5 alternativas e somente uma correta.",
          "Misture dificuldade fácil, média e difícil.",
          "Evite repetir a mesma ideia, enunciado ou gabarito com pequenas trocas de palavras.",
          "Forneça uma explicação objetiva para o gabarito.",
          "Para legislação, respeite o texto normativo vigente e não invente artigos.",
          "Para saúde, não invente protocolos ou doses.",
          "Não mencione Rômulo Passos no enunciado, explicação ou alternativas.",
        ].join(" "),
      },
      {
        role: "user",
        content:
          "Disciplina: " +
          disciplina +
          ". Assunto: " +
          assunto +
          ". Gere " +
          quantidade +
          " questões inéditas. " +
          (contextoExistente.length
            ? "Evite repetir estas ideias já existentes no banco: " +
              contextoExistente.join(" | ").slice(0, 6000)
            : ""),
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "lote_questoes_cortex",
        strict: true,
        schema: {
          type: "object",
          properties: {
            questoes: {
              type: "array",
              minItems: quantidade,
              maxItems: quantidade,
              items: {
                type: "object",
                properties: {
                  enunciado: { type: "string" },
                  explicacao: { type: "string" },
                  dificuldade: {
                    type: "string",
                    enum: ["facil", "medio", "dificil"],
                  },
                  alternativas: {
                    type: "array",
                    minItems: 5,
                    maxItems: 5,
                    items: {
                      type: "object",
                      properties: {
                        texto: { type: "string" },
                        correta: { type: "boolean" },
                      },
                      required: ["texto", "correta"],
                      additionalProperties: false,
                    },
                  },
                },
                required: [
                  "enunciado",
                  "explicacao",
                  "dificuldade",
                  "alternativas",
                ],
                additionalProperties: false,
              },
            },
          },
          required: ["questoes"],
          additionalProperties: false,
        },
      },
    },
  });

  const parsed = JSON.parse(response.output_text || "{}");
  const questoes = Array.isArray(parsed.questoes)
    ? parsed.questoes.map(validarQuestao).filter(Boolean) as QuestaoGerada[]
    : [];

  return questoes.slice(0, quantidade);
}

async function obterDisciplinaBase(
  usuarioId: number,
  nome: string
) {
  const existente = await prisma.disciplina.findFirst({
    where: {
      usuarioId,
      nome: {
        equals: nome,
        mode: "insensitive",
      },
    },
  });

  if (existente) return existente;

  return prisma.disciplina.create({
    data: {
      usuarioId,
      nome,
    },
  });
}

export async function sincronizarMatrizQuestoes30PorAssunto() {
  if (process.env.SEED_QUESTOES_30_ASSUNTO === "0") {
    console.log("[questoes-30] sincronização desativada por ambiente.");
    return;
  }

  const usuario = await prisma.usuario.findFirst({
    orderBy: { id: "asc" },
    select: { id: true },
  });

  if (!usuario) {
    console.warn("[questoes-30] Nenhum usuário encontrado para vincular o banco global.");
    return;
  }

  let totalInseridas = 0;
  let assuntosCompletos = 0;

  for (const item of MATRIZ) {
    const disciplina = await obterDisciplinaBase(
      usuario.id,
      item.disciplina
    );

    for (const assunto of item.assuntos) {
      const existentes = await prisma.questao.findMany({
        where: {
          disciplina: {
            nome: {
              equals: item.disciplina,
              mode: "insensitive",
            },
          },
          tema: {
            equals: assunto,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          enunciado: true,
          origemId: true,
        },
        orderBy: { id: "desc" },
      });

      if (existentes.length >= META_POR_ASSUNTO) {
        assuntosCompletos += 1;
        console.log(
          "[questoes-30]",
          item.disciplina,
          "/",
          assunto,
          "já possui",
          existentes.length,
          "questões."
        );
        continue;
      }

      let faltam = META_POR_ASSUNTO - existentes.length;
      const contexto = existentes
        .slice(0, 18)
        .map((questao) => questao.enunciado.slice(0, 180));

      console.log(
        "[questoes-30] gerando",
        faltam,
        "para",
        item.disciplina,
        "/",
        assunto
      );

      let indiceLote = 0;

      while (faltam > 0) {
        const quantidade = Math.min(faltam, 15);
        const geradas = await gerarLote(
          item.disciplina,
          assunto,
          quantidade,
          contexto
        );

        if (!geradas.length) {
          throw new Error(
            "Nenhuma questão válida gerada para " +
            item.disciplina +
            " / " +
            assunto
          );
        }

        for (const questao of geradas) {
          const duplicada = await prisma.questao.findFirst({
            where: {
              disciplinaId: disciplina.id,
              tema: {
                equals: assunto,
                mode: "insensitive",
              },
              enunciado: {
                equals: questao.enunciado,
                mode: "insensitive",
              },
            },
            select: { id: true },
          });

          if (duplicada) continue;

          indiceLote += 1;

          await prisma.questao.create({
            data: {
              enunciado: questao.enunciado,
              explicacao: questao.explicacao,
              dificuldade: questao.dificuldade,
              tema: assunto,
              fonte: FONTE,
              origemId:
                FONTE +
                "-" +
                slug(item.disciplina) +
                "-" +
                slug(assunto) +
                "-" +
                Date.now().toString(36) +
                "-" +
                indiceLote.toString(36),
              banca: "Cortex - estilo concursos/ENARE/EBSERH",
              ano: 2026,
              cargo:
                item.disciplina === "Enfermagem" ||
                item.disciplina === "Legislação do COFEN" ||
                item.disciplina === "Legislação do SUS"
                  ? "Enfermagem / Área da Saúde"
                  : "Conhecimentos Gerais",
              orgao: "Banco autoral Cortex",
              usuarioId: usuario.id,
              disciplinaId: disciplina.id,
              alternativas: {
                create: questao.alternativas,
              },
            },
          });

          contexto.push(questao.enunciado.slice(0, 180));
          faltam -= 1;
          totalInseridas += 1;

          if (faltam <= 0) break;
        }

        if (geradas.length < quantidade && faltam > 0) {
          console.warn(
            "[questoes-30] lote retornou menos itens válidos; tentando novamente:",
            item.disciplina,
            assunto,
            faltam,
            "restantes."
          );
        }
      }

      assuntosCompletos += 1;

      console.log(
        "[questoes-30] completo:",
        item.disciplina,
        "/",
        assunto,
        "=",
        META_POR_ASSUNTO
      );
    }
  }

  console.log(
    "[questoes-30] matriz concluída:",
    assuntosCompletos,
    "assuntos;",
    totalInseridas,
    "novas questões."
  );
}

export function obterMatrizQuestoes30PorAssunto() {
  return MATRIZ.map((item) => ({
    disciplina: item.disciplina,
    assuntos: [...item.assuntos],
    metaPorAssunto: META_POR_ASSUNTO,
  }));
}
