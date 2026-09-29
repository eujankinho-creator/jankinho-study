import OpenAI from "openai";

import { prisma } from "../../lib/prisma";


type Resultado = {
  status: number;
  data: unknown;
};


type ItemInformacao = {
  campo: string;
  valor: string;
};


type CasoIA = {
  titulo: string;
  area: string;
  especialidade: string;
  dificuldade: string;
  cenario: string;
  queixaInicial: string;

  dadosIniciais:
    ItemInformacao[];

  anamnese:
    ItemInformacao[];

  exameFisico:
    ItemInformacao[];

  sinaisVitais:
    ItemInformacao[];

  evolucao:
    ItemInformacao[];

  diagnosticoFinal:
    string;

  explicacaoDiagnostico:
    string;

  diagnosticosDiferenciais:
    {
      diagnostico: string;
      justificativa: string;
      porqueNaoEPrincipal: string;
    }[];

  pontosChave:
    {
      achado: string;
      importancia: string;
    }[];

  exames:
    {
      nome: string;
      categoria: string;
      resultado: string;
      interpretacao: string;
    }[];
};


function transformar(
  itens: ItemInformacao[]
) {

  const resultado:
    Record<string, string> =
    {};


  for (
    const item
    of itens || []
  ) {

    if (
      !item ||
      !item.campo
    ) {
      continue;
    }


    resultado[
      item.campo
    ] =
      String(
        item.valor ??
        ""
      );
  }


  return resultado;
}


export async function listarCasos(
  usuarioId: number
): Promise<Resultado> {

  try {

    const casos =
      await prisma
        .casoClinico
        .findMany({
          where: {
            OR: [
              {
                autorId:
                  usuarioId,
              },

              {
                publicado:
                  true,
              },
            ],
          },

          select: {
            id: true,
            titulo: true,
            area: true,
            especialidade: true,
            dificuldade: true,
            cenario: true,
            queixaInicial: true,
            publicado: true,
            geradoPorIA: true,
            createdAt: true,

            investigacoes: {
              where: {
                usuarioId:
                  usuarioId,
              },

              select: {
                finalizado:
                  true,

                status:
                  true,
              },

              take:
                1,
            },
          },

          orderBy: {
            createdAt:
              "desc",
          },
        });


    const casosFormatados =
      casos.map(
        function (caso) {

          const {
            investigacoes,
            ...dadosCaso
          } = caso;


          return {
            ...dadosCaso,

            concluido:
              investigacoes.length > 0 &&
              investigacoes[0]
                .finalizado === true,
          };
        }
      );


    return {
      status: 200,

      data: {
        sucesso: true,

        casos:
          casosFormatados,
      },
    };

  }
  catch (error) {

    console.error(
      "Erro ao listar casos:",
      error
    );


    return {
      status: 500,

      data: {
        error:
          "Nao foi possivel carregar os casos.",
      },
    };
  }
}


export async function gerarCasoClinico(
  usuarioId: number,
  body: any
): Promise<Resultado> {

  try {

    const chave =
      process.env
        .OPENAI_API_KEY;


    if (!chave) {

      return {
        status: 500,

        data: {
          error:
            "OPENAI_API_KEY nao configurada.",
        },
      };
    }


    const area =
      String(
        body.area || ""
      ).trim();


    const especialidade =
      String(
        body.especialidade || ""
      ).trim();


    const dificuldade =
      String(
        body.dificuldade || ""
      ).trim();


    const cenario =
      String(
        body.cenario || ""
      ).trim();


    const tipoCaso =
      String(
        body.tipoCaso || ""
      ).trim();


    const caracteristicas =
      String(
        body.caracteristicas || ""
      ).trim();


    if (
      !area ||
      !dificuldade ||
      !cenario
    ) {

      return {
        status: 400,

        data: {
          error:
            "Area, dificuldade e cenario sao obrigatorios.",
        },
      };
    }


    const openai =
      new OpenAI({
        apiKey:
          chave,
      });


    const promptSistema = `
Voce e um professor universitario especialista em raciocinio clinico,
semiologia, fisiopatologia e ensino para estudantes de Enfermagem
e Medicina.

Crie um caso clinico educacional original, realista e investigavel.

Regras:

1. O caso deve ser clinicamente coerente.
2. O diagnostico final deve ser sustentado pelos dados.
3. Deve existir diagnostico diferencial plausivel.
4. O diagnostico final nao pode aparecer nos dados iniciais.
5. A anamnese deve conter informacoes uteis.
6. O exame fisico deve conter achados coerentes.
7. Os sinais vitais devem ser plausiveis.
8. Cada exame deve possuir resultado e interpretacao.
9. O caso deve exigir raciocinio clinico.
10. Considere especialmente a perspectiva da Enfermagem.
11. O diagnostico final deve aparecer somente em diagnosticoFinal.
12. dadosIniciais, anamnese, exameFisico, sinaisVitais e evolucao
devem ser arrays contendo objetos com campo e valor.
`;


    const promptUsuario = `
Area:
${area}

Especialidade:
${especialidade || "Nao especificada"}

Dificuldade:
${dificuldade}

Cenario:
${cenario}

Tipo:
${tipoCaso || "Investigacao clinica"}

Caracteristicas adicionais:
${caracteristicas || "Nenhuma"}

Crie um caso completo, coerente e investigavel.
Nao revele o diagnostico final fora do campo diagnosticoFinal.
`;


    const itemSchema = {
      type: "object",

      properties: {
        campo: {
          type: "string",
        },

        valor: {
          type: "string",
        },
      },

      required: [
        "campo",
        "valor"
      ],

      additionalProperties:
        false,

    } as const;


    const resposta =
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
                promptSistema,
            },

            {
              role:
                "user",

              content:
                promptUsuario,
            },
          ],

          text: {
            format: {
              type:
                "json_schema",

              name:
                "caso_clinico",

              strict:
                true,

              schema: {
                type:
                  "object",

                properties: {
                  titulo: {
                    type:
                      "string",
                  },

                  area: {
                    type:
                      "string",
                  },

                  especialidade: {
                    type:
                      "string",
                  },

                  dificuldade: {
                    type:
                      "string",
                  },

                  cenario: {
                    type:
                      "string",
                  },

                  queixaInicial: {
                    type:
                      "string",
                  },

                  dadosIniciais: {
                    type:
                      "array",

                    items:
                      itemSchema,
                  },

                  anamnese: {
                    type:
                      "array",

                    items:
                      itemSchema,
                  },

                  exameFisico: {
                    type:
                      "array",

                    items:
                      itemSchema,
                  },

                  sinaisVitais: {
                    type:
                      "array",

                    items:
                      itemSchema,
                  },

                  evolucao: {
                    type:
                      "array",

                    items:
                      itemSchema,
                  },

                  diagnosticoFinal: {
                    type:
                      "string",
                  },

                  explicacaoDiagnostico: {
                    type:
                      "string",
                  },

                  diagnosticosDiferenciais: {
                    type:
                      "array",

                    items: {
                      type:
                        "object",

                      properties: {
                        diagnostico: {
                          type:
                            "string",
                        },

                        justificativa: {
                          type:
                            "string",
                        },

                        porqueNaoEPrincipal: {
                          type:
                            "string",
                        },
                      },

                      required: [
                        "diagnostico",
                        "justificativa",
                        "porqueNaoEPrincipal"
                      ],

                      additionalProperties:
                        false,
                    },
                  },

                  pontosChave: {
                    type:
                      "array",

                    items: {
                      type:
                        "object",

                      properties: {
                        achado: {
                          type:
                            "string",
                        },

                        importancia: {
                          type:
                            "string",
                        },
                      },

                      required: [
                        "achado",
                        "importancia"
                      ],

                      additionalProperties:
                        false,
                    },
                  },

                  exames: {
                    type:
                      "array",

                    items: {
                      type:
                        "object",

                      properties: {
                        nome: {
                          type:
                            "string",
                        },

                        categoria: {
                          type:
                            "string",
                        },

                        resultado: {
                          type:
                            "string",
                        },

                        interpretacao: {
                          type:
                            "string",
                        },
                      },

                      required: [
                        "nome",
                        "categoria",
                        "resultado",
                        "interpretacao"
                      ],

                      additionalProperties:
                        false,
                    },
                  },
                },

                required: [
                  "titulo",
                  "area",
                  "especialidade",
                  "dificuldade",
                  "cenario",
                  "queixaInicial",
                  "dadosIniciais",
                  "anamnese",
                  "exameFisico",
                  "sinaisVitais",
                  "evolucao",
                  "diagnosticoFinal",
                  "explicacaoDiagnostico",
                  "diagnosticosDiferenciais",
                  "pontosChave",
                  "exames"
                ],

                additionalProperties:
                  false,
              },
            },
          },
        });


    if (
      !resposta.output_text
    ) {

      return {
        status: 500,

        data: {
          error:
            "A IA nao retornou um caso.",
        },
      };
    }


    let caso:
      CasoIA;


    try {

      caso =
        JSON.parse(
          resposta.output_text
        ) as CasoIA;

    }
    catch {

      return {
        status: 500,

        data: {
          error:
            "Resposta invalida da IA.",
        },
      };
    }


    if (
      !caso.titulo ||
      !caso.queixaInicial ||
      !caso.diagnosticoFinal
    ) {

      return {
        status: 500,

        data: {
          error:
            "Caso incompleto retornado pela IA.",
        },
      };
    }


    const salvo =
      await prisma
        .casoClinico
        .create({
          data: {
            titulo:
              caso.titulo,

            area:
              caso.area,

            especialidade:
              caso.especialidade ||
              null,

            dificuldade:
              caso.dificuldade,

            cenario:
              caso.cenario,

            queixaInicial:
              caso.queixaInicial,

            dadosIniciais:
              transformar(
                caso.dadosIniciais
              ),

            anamnese:
              transformar(
                caso.anamnese
              ),

            exameFisico:
              transformar(
                caso.exameFisico
              ),

            sinaisVitais:
              transformar(
                caso.sinaisVitais
              ),

            exames:
              caso.exames,

            evolucao:
              transformar(
                caso.evolucao
              ),

            diagnosticoFinal:
              caso.diagnosticoFinal,

            explicacaoDiagnostico:
              caso.explicacaoDiagnostico,

            diagnosticosDiferenciais:
              caso.diagnosticosDiferenciais,

            pontosChave:
              caso.pontosChave,

            publicado:
              false,

            geradoPorIA:
              true,

            autorId:
              usuarioId,
          },
        });


    return {
      status: 200,

      data: {
        sucesso: true,

        caso: {
          id:
            salvo.id,

          titulo:
            salvo.titulo,
        },
      },
    };

  }
  catch (error) {

    console.error(
      "Erro ao gerar caso:",
      error
    );


    return {
      status: 500,

      data: {
        error:
          "Nao foi possivel gerar o caso clinico.",
      },
    };
  }
}
