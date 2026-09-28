import OpenAI from "openai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterUsuarioId } from "@/lib/auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const usuarioId = await obterUsuarioId();

    if (!usuarioId) {
      return NextResponse.json(
        {
          error: "Não autenticado.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const curso = String(body.curso || "").trim();
    const disciplina = String(
      body.disciplina || ""
    ).trim();
    const tema = String(body.tema || "").trim();
    const dificuldade = String(
      body.dificuldade || ""
    ).trim();
    const quantidade = Number(body.quantidade);

    if (
      !curso ||
      !disciplina ||
      !tema ||
      !dificuldade ||
      !quantidade
    ) {
      return NextResponse.json(
        {
          error:
            "Todos os campos são obrigatórios.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isInteger(quantidade) ||
      quantidade < 1 ||
      quantidade > 20
    ) {
      return NextResponse.json(
        {
          error:
            "A quantidade deve ser um número inteiro entre 1 e 20.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Procura a disciplina globalmente.
     *
     * Não usamos usuarioId aqui porque
     * as disciplinas são compartilhadas.
     */
    let disciplinaBanco =
      await prisma.disciplina.findFirst({
        where: {
          nome: {
            equals: disciplina,
            mode: "insensitive",
          },
        },
      });

    /*
     * Se não existir, cria a disciplina.
     *
     * O usuarioId é mantido apenas porque
     * o schema atual ainda exige esse campo.
     */
    if (!disciplinaBanco) {
      disciplinaBanco =
        await prisma.disciplina.create({
          data: {
            nome: disciplina,
            usuarioId: usuarioId,
          },
        });
    }

    /*
     * Gera as questões com a IA.
     */
    const response =
      await openai.responses.create({
        model: "gpt-5-mini",
        input: [
          {
            role: "system",
            content:
              "Você é um professor universitário especializado em Enfermagem e Medicina. Crie questões de nível superior, tecnicamente corretas, clinicamente coerentes e adequadas para estudantes da área da saúde. Evite questões óbvias. Quando apropriado, utilize casos clínicos. Cada questão deve ter exatamente 5 alternativas e apenas uma alternativa correta.",
          },
          {
            role: "user",
            content:
              "Gere " +
              quantidade +
              " questões de múltipla escolha para estudantes de " +
              curso +
              ". Disciplina: " +
              disciplina +
              ". Tema: " +
              tema +
              ". Dificuldade: " +
              dificuldade +
              ". Para cada questão, forneça o enunciado, exatamente 5 alternativas, indique qual é a correta e forneça uma explicação objetiva e didática.",
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "banco_de_questoes",
            strict: true,
            schema: {
              type: "object",
              properties: {
                questoes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      enunciado: {
                        type: "string",
                      },
                      explicacao: {
                        type: "string",
                      },
                      alternativas: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            texto: {
                              type: "string",
                            },
                            correta: {
                              type: "boolean",
                            },
                          },
                          required: [
                            "texto",
                            "correta",
                          ],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: [
                      "enunciado",
                      "explicacao",
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

    const resultado = JSON.parse(
      response.output_text
    );

    const questoesSalvas = [];

    for (const questao of resultado.questoes) {
      const quantidadeAlternativas =
        Array.isArray(questao.alternativas)
          ? questao.alternativas.length
          : 0;

      const quantidadeCorretas =
        Array.isArray(questao.alternativas)
          ? questao.alternativas.filter(
              function (alternativa: {
                texto: string;
                correta: boolean;
              }) {
                return alternativa.correta;
              }
            ).length
          : 0;

      /*
       * Validação de segurança para garantir
       * que a IA realmente devolveu 5 alternativas
       * e apenas uma correta.
       */
      if (
        quantidadeAlternativas !== 5 ||
        quantidadeCorretas !== 1
      ) {
        continue;
      }

      const questaoSalva =
        await prisma.questao.create({
          data: {
            enunciado: questao.enunciado,
            explicacao: questao.explicacao,
            tema: tema,
            dificuldade: dificuldade,

            /*
             * Usuário que gerou a questão.
             * A questão continua sendo global.
             */
            usuarioId: usuarioId,

            disciplinaId:
              disciplinaBanco.id,

            alternativas: {
              create:
                questao.alternativas.map(
                  function (
                    alternativa: {
                      texto: string;
                      correta: boolean;
                    }
                  ) {
                    return {
                      texto:
                        alternativa.texto,
                      correta:
                        alternativa.correta,
                    };
                  }
                ),
            },
          },

          include: {
            alternativas: true,
            disciplina: true,
          },
        });

      questoesSalvas.push(questaoSalva);
    }

    return NextResponse.json({
      sucesso: true,
      quantidadeSalva:
        questoesSalvas.length,
      questoes: questoesSalvas,
    });
  } catch (error) {
    console.error(
      "Erro ao gerar e salvar questões:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Não foi possível gerar e salvar questões.",
      },
      {
        status: 500,
      }
    );
  }
}