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
            "gpt-5-mini",

          input: [
            {
              role:
                "system",

              content:
                "Voce e um professor universitario especializado em Enfermagem e Medicina. Crie questoes de nivel superior, tecnicamente corretas, clinicamente coerentes e adequadas para estudantes da area da saude. Evite questoes obvias. Quando apropriado, utilize casos clinicos. Cada questao deve ter exatamente 5 alternativas e apenas uma alternativa correta.",
            },

            {
              role:
                "user",

              content:
                "Gere " +
                quantidade +
                " questoes de multipla escolha para estudantes de " +
                curso +
                ". Disciplina: " +
                disciplina +
                ". Tema: " +
                tema +
                ". Dificuldade: " +
                dificuldade +
                ". Para cada questao, forneca o enunciado, exatamente 5 alternativas, indique qual e a correta e forneca uma explicacao objetiva e didatica.",
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

                        alternativas: {
                          type:
                            "array",

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


      const salva =
        await prisma
          .questao
          .create({
            data: {
              enunciado:
                questao.enunciado,

              explicacao:
                questao.explicacao,

              tema,

              dificuldade,

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
                            ),

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
