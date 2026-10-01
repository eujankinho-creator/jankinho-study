import OpenAI from "openai";

import { prisma } from "../../lib/prisma";


const openai =
  new OpenAI({
    apiKey:
      process.env.OPENAI_API_KEY,
  });


type ResultadoIA = {
  status: number;
  data: unknown;
};


function urlSegura(
  value:
    unknown
) {

  const text =
    String(
      value ||
      ""
    )
      .trim();


  if (!text) {
    return null;
  }


  try {

    const url =
      new URL(
        text
      );


    if (
      url.protocol !==
        "https:" &&
      url.protocol !==
        "http:"
    ) {
      return null;
    }


    return url.toString();

  }
  catch {

    return null;

  }

}


async function gerarImagemQuestao(
  prompt:
    string
) {

  const texto =
    String(
      prompt ||
      ""
    )
      .trim();


  if (!texto) {
    return null;
  }


  try {

    const resultado =
      await openai
        .images
        .generate({
          model:
            "gpt-image-2.5-flare",

          prompt:
            "Crie uma imagem educacional limpa para uma questão de nível superior em Enfermagem/Medicina. " +
            "Não revele nem destaque a resposta correta. Evite texto desnecessário. " +
            "A figura deve ser clinicamente coerente, legível em celular e útil para interpretação visual. " +
            texto,
        });


    const base64 =
      resultado.data?.[0]
        ?.b64_json;


    if (!base64) {
      return null;
    }


    return (
      "data:image/png;base64," +
      base64
    );

  }
  catch (
    error
  ) {

    console.warn(
      "[questoes-ia] Imagem não gerada:",
      error instanceof Error
        ? error.message
        : String(
            error
          )
    );


    return null;

  }

}


export async function gerarQuestoesIA(
  usuarioId: number,
  body: any
): Promise<ResultadoIA> {

  try {

    const curso =
      String(
        body.curso || ""
      ).trim();


    const disciplina =
      String(
        body.disciplina || ""
      ).trim();


    const tema =
      String(
        body.tema || ""
      ).trim();


    const dificuldade =
      String(
        body.dificuldade || ""
      ).trim();


    const quantidade =
      Number(
        body.quantidade
      );


    if (
      !curso ||
      !disciplina ||
      !tema ||
      !dificuldade ||
      !quantidade
    ) {

      return {
        status: 400,

        data: {
          error:
            "Todos os campos sao obrigatorios.",
        },
      };

    }


    if (
      !Number.isInteger(
        quantidade
      ) ||
      quantidade < 1 ||
      quantidade > 20
    ) {

      return {
        status: 400,

        data: {
          error:
            "Quantidade invalida.",
        },
      };

    }


    let disciplinaBanco =
      await prisma
        .disciplina
        .findFirst({
          where: {
            usuarioId,

            nome: {
              equals:
                disciplina,

              mode:
                "insensitive",
            },
          },
        });


    if (!disciplinaBanco) {

      disciplinaBanco =
        await prisma
          .disciplina
          .create({
            data: {
              nome:
                disciplina,

              usuarioId,
            },
          });

    }


    const response =
      await openai
        .responses
        .create({
          model:
            "gpt-5.4-mini",

          reasoning: {
            effort:
              "low",
          },

          tools: [
            {
              type:
                "web_search",
            },
          ],

          tool_choice:
            "auto",

          input: [
            {
              role:
                "system",

              content:
                [
                  "Você é um professor universitário especializado em Enfermagem e Medicina.",
                  "Crie questões de nível superior, tecnicamente corretas, clinicamente coerentes e adequadas para estudantes da área da saúde.",
                  "Antes de criar questões, use a pesquisa na web quando isso puder localizar questões de concursos, provas de residência, EBSERH, prefeituras, hospitais universitários ou bancas relacionadas ao tema.",
                  "REGRA DE FONTE: se encontrar uma questão real identificável, NÃO copie o enunciado e as alternativas integralmente. Crie uma versão adaptada/parafraseada que avalie o mesmo conhecimento e informe banca/ano ou prova no campo fonte, além do link realmente consultado no campo fonteUrl.",
                  "Se não houver uma questão verificável, crie uma questão autoral no estilo de concurso e use fonte='Questão autoral no estilo de concurso' e fonteUrl=null.",
                  "Nunca invente banca, ano, órgão ou URL.",
                  "Cada questão deve ter exatamente 5 alternativas e apenas uma correta.",
                  "Evite questões óbvias. Quando apropriado, utilize casos clínicos, cálculos e tomada de decisão.",
                  "Você pode propor questão com imagem apenas quando a interpretação visual realmente agregar valor (por exemplo ECG, ferida, escala, gráfico, anatomia, tabela, equipamento, exame ou esquema).",
                  "No máximo duas questões do lote devem solicitar imagem. A imagem não pode conter o gabarito nem destacar a resposta.",
                  "Para questão visual, forneça um imagemPrompt curto e objetivo e um imagemAlt acessível.",
                ].join(" "),
            },

            {
              role:
                "user",

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
                ". Tente primeiro encontrar padrões ou questões públicas de concursos relacionadas ao conteúdo. " +
                "Para cada questão, forneça enunciado, exatamente 5 alternativas, uma correta, explicação objetiva, fonte, fonteUrl quando verificável, e indique se uma imagem educacional é necessária.",
            },
          ],

          text: {
            format: {
              type:
                "json_schema",

              name:
                "banco_de_questoes",

              strict:
                true,

              schema: {
                type:
                  "object",

                properties: {
                  questoes: {
                    type:
                      "array",

                    items: {
                      type:
                        "object",

                      properties: {
                        enunciado: {
                          type:
                            "string",
                        },

                        explicacao: {
                          type:
                            "string",
                        },

                        fonte: {
                          type:
                            "string",
                        },

                        fonteUrl: {
                          type: [
                            "string",
                            "null"
                          ],
                        },

                        precisaImagem: {
                          type:
                            "boolean",
                        },

                        imagemPrompt: {
                          type: [
                            "string",
                            "null"
                          ],
                        },

                        imagemAlt: {
                          type: [
                            "string",
                            "null"
                          ],
                        },

                        alternativas: {
                          type:
                            "array",

                          minItems:
                            5,

                          maxItems:
                            5,

                          items: {
                            type:
                              "object",

                            properties: {
                              texto: {
                                type:
                                  "string",
                              },

                              correta: {
                                type:
                                  "boolean",
                              },
                            },

                            required: [
                              "texto",
                              "correta"
                            ],

                            additionalProperties:
                              false,
                          },
                        },
                      },

                      required: [
                        "enunciado",
                        "explicacao",
                        "fonte",
                        "fonteUrl",
                        "precisaImagem",
                        "imagemPrompt",
                        "imagemAlt",
                        "alternativas"
                      ],

                      additionalProperties:
                        false,
                    },
                  },
                },

                required: [
                  "questoes"
                ],

                additionalProperties:
                  false,
              },
            },
          },
        });


    const resultado =
      JSON.parse(
        response.output_text
      );


    const questoesSalvas:
      unknown[] = [];


    let imagensGeradas =
      0;


    for (
      const questao
      of resultado.questoes
    ) {

      if (
        !Array.isArray(
          questao.alternativas
        )
      ) {
        continue;
      }


      if (
        questao
          .alternativas
          .length !== 5
      ) {
        continue;
      }


      const corretas =
        questao
          .alternativas
          .filter(
            function (
              alternativa: any
            ) {

              return (
                alternativa.correta
              );

            }
          )
          .length;


      if (corretas !== 1) {
        continue;
      }


      let imagemUrl:
        string |
        null =
        null;


      if (
        questao.precisaImagem &&
        questao.imagemPrompt &&
        imagensGeradas <
          2
      ) {

        imagemUrl =
          await gerarImagemQuestao(
            questao.imagemPrompt
          );


        if (
          imagemUrl
        ) {

          imagensGeradas++;

        }

      }


      const salva =
        await prisma
          .questao
          .create({
            data: {
              enunciado:
                String(
                  questao.enunciado
                )
                  .trim(),

              explicacao:
                String(
                  questao.explicacao
                )
                  .trim(),

              tema,

              dificuldade,

              fonte:
                String(
                  questao.fonte ||
                  "Questão autoral no estilo de concurso"
                )
                  .trim(),

              fonteUrl:
                urlSegura(
                  questao.fonteUrl
                ),

              imagemUrl,

              imagemAlt:
                imagemUrl
                  ? String(
                      questao.imagemAlt ||
                      "Imagem de apoio para interpretação da questão."
                    )
                      .trim()
                  : null,

              usuarioId,

              disciplinaId:
                disciplinaBanco.id,

              alternativas: {
                create:
                  questao
                    .alternativas
                    .map(
                      function (
                        alternativa: any
                      ) {

                        return {
                          texto:
                            String(
                              alternativa.texto
                            )
                              .trim(),

                          correta:
                            Boolean(
                              alternativa.correta
                            ),
                        };

                      }
                    ),
              },
            },

            include: {
              alternativas:
                true,

              disciplina:
                true,
            },
          });


      questoesSalvas.push(
        salva
      );
    }


    return {
      status: 200,

      data: {
        sucesso: true,

        quantidadeSalva:
          questoesSalvas.length,

        imagensGeradas,

        questoes:
          questoesSalvas,
      },
    };

  }
  catch (error) {

    console.error(
      "Erro ao gerar questoes:",
      error
    );


    return {
      status: 500,

      data: {
        error:
          "Nao foi possivel gerar e salvar as questoes.",
      },
    };

  }
}
