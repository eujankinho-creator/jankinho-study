import OpenAI from "openai";

import {
  Prisma,
} from "../../src/generated/client";

import {
  prisma,
} from "../../lib/prisma";


type Resultado = {
  status: number;
  data: any;
};


function textoSeguro(
  valor: unknown
): string {

  if (
    valor === null ||
    valor === undefined
  ) {
    return "";
  }


  if (
    typeof valor === "string"
  ) {
    return valor;
  }


  if (
    typeof valor === "number" ||
    typeof valor === "boolean"
  ) {
    return String(valor);
  }


  if (
    Array.isArray(valor)
  ) {

    return valor
      .map(
        function (item) {
          return textoSeguro(item);
        }
      )
      .filter(Boolean)
      .join(", ");
  }


  if (
    typeof valor === "object"
  ) {

    return Object
      .entries(
        valor as Record<
          string,
          unknown
        >
      )
      .map(
        function (
          [chave, item]
        ) {

          const texto =
            textoSeguro(item);

          if (!texto) {
            return "";
          }

          return (
            chave +
            ": " +
            texto
          );
        }
      )
      .filter(Boolean)
      .join("\n");
  }


  return String(valor);
}


function normalizarExames(
  valor: unknown
): any[] {

  if (!valor) {
    return [];
  }


  if (
    Array.isArray(valor)
  ) {

    return valor.map(
      function (item) {

        if (
          typeof item ===
          "string"
        ) {

          return {
            nome: item,
          };
        }


        if (
          item &&
          typeof item ===
          "object"
        ) {

          return item;
        }


        return {
          nome:
            String(item),
        };
      }
    );
  }


  if (
    typeof valor === "object"
  ) {

    return Object
      .entries(
        valor as Record<
          string,
          unknown
        >
      )
      .map(
        function (
          [nome, resultado]
        ) {

          return {
            nome,
            resultado:
              textoSeguro(
                resultado
              ),
          };
        }
      );
  }


  return [];
}


async function buscarCasoAcessivel(
  usuarioId: number,
  casoId: number
) {

  return prisma
    .casoClinico
    .findFirst({
      where: {
        id:
          casoId,

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
    });
}


async function obterInvestigacao(
  usuarioId: number,
  casoId: number
) {

  return prisma
    .investigacaoCaso
    .findUnique({
      where: {
        casoId_usuarioId: {
          casoId,
          usuarioId,
        },
      },

      include: {
        registros: {
          orderBy: {
            ordem: "asc",
          },
        },
      },
    });
}


async function obterOuCriarInvestigacao(
  usuarioId: number,
  casoId: number
) {

  const existente =
    await obterInvestigacao(
      usuarioId,
      casoId
    );


  if (existente) {
    return existente;
  }


  return prisma
    .investigacaoCaso
    .create({
      data: {
        casoId,
        usuarioId,

        status:
          "EM_ANDAMENTO",

        informacoesColetadas:
          {},
      },

      include: {
        registros: {
          orderBy: {
            ordem:
              "asc",
          },
        },
      },
    });
}


export async function buscarCasoDetalhe(
  usuarioId: number,
  casoId: number
): Promise<Resultado> {

  if (
    !Number.isInteger(casoId) ||
    casoId <= 0
  ) {

    return {
      status: 400,

      data: {
        error:
          "ID do caso invalido.",
      },
    };
  }


  try {

    const caso =
      await buscarCasoAcessivel(
        usuarioId,
        casoId
      );


    if (!caso) {

      return {
        status: 404,

        data: {
          error:
            "Caso clinico nao encontrado.",
        },
      };
    }


    const investigacao =
      await obterInvestigacao(
        usuarioId,
        casoId
      );


    /*
     * Importante:
     * resultados dos exames NAO sao enviados
     * antes de serem solicitados.
     */

    const exames =
      normalizarExames(
        caso.exames
      )
      .map(
        function (
          exame,
          index
        ) {

          return {
            index,

            nome:
              exame.nome ||
              exame.exame ||
              (
                "Exame " +
                (index + 1)
              ),

            categoria:
              exame.categoria ||
              null,
          };
        }
      );


    return {
      status: 200,

      data: {
        sucesso:
          true,

        caso: {
          id:
            caso.id,

          titulo:
            caso.titulo,

          area:
            caso.area,

          especialidade:
            caso.especialidade,

          dificuldade:
            caso.dificuldade,

          cenario:
            caso.cenario,

          queixaInicial:
            caso.queixaInicial,

          dadosIniciais:
            caso.dadosIniciais,

          sinaisVitais:
            caso.sinaisVitais,

          exames,

          publicado:
            caso.publicado,

          geradoPorIA:
            caso.geradoPorIA,

          createdAt:
            caso.createdAt,
        },

        investigacao,
      },
    };

  }
  catch (error) {

    console.error(
      "Erro ao carregar caso:",
      error
    );


    return {
      status: 500,

      data: {
        error:
          "Nao foi possivel carregar o caso clinico.",
      },
    };
  }
}


export async function investigarCasoClinico(
  usuarioId: number,
  casoId: number,
  body: any
): Promise<Resultado> {

  try {

    const caso =
      await buscarCasoAcessivel(
        usuarioId,
        casoId
      );


    if (!caso) {

      return {
        status: 404,

        data: {
          error:
            "Caso clinico nao encontrado.",
        },
      };
    }


    const tipo =
      String(
        body.tipo || ""
      );


    const tiposValidos = [
      "ANAMNESE",
      "EXAME_FISICO",
      "SINAIS_VITAIS",
      "EVOLUCAO",
      "EXAME",
    ];


    if (
      !tiposValidos.includes(
        tipo
      )
    ) {

      return {
        status: 400,

        data: {
          error:
            "Tipo de investigacao invalido.",
        },
      };
    }


    let investigacao =
      await obterOuCriarInvestigacao(
        usuarioId,
        casoId
      );


    if (
      investigacao.finalizado
    ) {

      return {
        status: 400,

        data: {
          error:
            "Este caso ja foi finalizado. Use Refazer caso para iniciar novamente.",
        },
      };
    }


    /*
     * EXAME INDIVIDUAL
     */

    if (
      tipo === "EXAME"
    ) {

      const exames =
        normalizarExames(
          caso.exames
        );


      const solicitado =
        body.exame || {};


      const indice =
        Number(
          solicitado.index
        );


      if (
        !Number.isInteger(
          indice
        ) ||
        indice < 0 ||
        indice >=
          exames.length
      ) {

        return {
          status: 400,

          data: {
            error:
              "Exame invalido.",
          },
        };
      }


      const exame =
        exames[indice];


      const nome =
        String(
          exame.nome ||
          exame.exame ||
          (
            "Exame " +
            (indice + 1)
          )
        );


      const existente =
        investigacao
          .registros
          .find(
            function (registro) {

              return (
                registro.tipo ===
                  "EXAME" &&
                registro.titulo ===
                  nome
              );
            }
          );


      if (existente) {

        return {
          status: 200,

          data: {
            sucesso:
              true,

            investigacao,

            registro:
              existente,
          },
        };
      }


      const resultado =
        textoSeguro(
          exame.resultado ??
          exame.valor ??
          exame.result ??
          ""
        );


      const interpretacao =
        textoSeguro(
          exame.interpretacao
        );


      const resposta =
        interpretacao
          ? (
              resultado +
              "\n\nInterpretacao: " +
              interpretacao
            )
          : resultado;


      const registro =
        await prisma
          .registroInvestigacao
          .create({
            data: {
              investigacaoId:
                investigacao.id,

              tipo:
                "EXAME",

              titulo:
                nome,

              pergunta:
                "Resultado de " +
                nome,

              resposta:
                resposta ||
                "Sem resultado informado.",

              ordem:
                investigacao
                  .registros
                  .length + 1,
            },
          });


      const atuais =
        (
          investigacao
            .informacoesColetadas &&
          typeof investigacao
            .informacoesColetadas ===
            "object" &&
          !Array.isArray(
            investigacao
              .informacoesColetadas
          )
        )
          ? (
              investigacao
                .informacoesColetadas as
                Record<
                  string,
                  any
                >
            )
          : {};


      const examesColetados =
        Array.isArray(
          atuais.exames
        )
          ? [
              ...atuais.exames,

              {
                nome,
                resultado:
                  resposta,
              },
            ]
          : [
              {
                nome,
                resultado:
                  resposta,
              },
            ];


      await prisma
        .investigacaoCaso
        .update({
          where: {
            id:
              investigacao.id,
          },

          data: {
            informacoesColetadas:
              {
                ...atuais,

                exames:
                  examesColetados,
              } as any,
          },
        });


      investigacao =
        (
          await obterInvestigacao(
            usuarioId,
            casoId
          )
        )!;


      return {
        status: 200,

        data: {
          sucesso:
            true,

          investigacao,

          registro,
        },
      };
    }


    /*
     * OUTRAS INVESTIGACOES
     */

    let titulo = "";
    let resposta = "";


    if (
      tipo === "ANAMNESE"
    ) {

      titulo =
        "Anamnese";

      resposta =
        textoSeguro(
          caso.anamnese
        );
    }


    if (
      tipo ===
      "EXAME_FISICO"
    ) {

      titulo =
        "Exame fisico";

      resposta =
        textoSeguro(
          caso.exameFisico
        );
    }


    if (
      tipo ===
      "SINAIS_VITAIS"
    ) {

      titulo =
        "Sinais vitais";

      resposta =
        textoSeguro(
          caso.sinaisVitais
        );
    }


    if (
      tipo === "EVOLUCAO"
    ) {

      titulo =
        "Evolucao clinica";

      resposta =
        textoSeguro(
          caso.evolucao
        );
    }


    if (!resposta) {

      resposta =
        "Nao ha informacoes adicionais disponiveis.";
    }


    const existente =
      investigacao
        .registros
        .find(
          function (registro) {

            return (
              registro.tipo ===
              tipo
            );
          }
        );


    if (existente) {

      return {
        status: 200,

        data: {
          sucesso:
            true,

          investigacao,

          registro:
            existente,
        },
      };
    }


    const registro =
      await prisma
        .registroInvestigacao
        .create({
          data: {
            investigacaoId:
              investigacao.id,

            tipo,

            titulo,

            resposta,

            ordem:
              investigacao
                .registros
                .length + 1,
          },
        });


    const atuais =
      (
        investigacao
          .informacoesColetadas &&
        typeof investigacao
          .informacoesColetadas ===
          "object" &&
        !Array.isArray(
          investigacao
            .informacoesColetadas
        )
      )
        ? (
            investigacao
              .informacoesColetadas as
              Record<
                string,
                any
              >
          )
        : {};


    await prisma
      .investigacaoCaso
      .update({
        where: {
          id:
            investigacao.id,
        },

        data: {
          informacoesColetadas:
            {
              ...atuais,

              [tipo]:
                resposta,
            } as any,
        },
      });


    investigacao =
      (
        await obterInvestigacao(
          usuarioId,
          casoId
        )
      )!;


    return {
      status: 200,

      data: {
        sucesso:
          true,

        investigacao,

        registro,
      },
    };

  }
  catch (error) {

    console.error(
      "Erro na investigacao:",
      error
    );


    return {
      status: 500,

      data: {
        error:
          "Nao foi possivel realizar a investigacao.",
      },
    };
  }
}


export async function refazerCasoClinico(
  usuarioId: number,
  casoId: number
): Promise<Resultado> {

  try {

    const caso =
      await buscarCasoAcessivel(
        usuarioId,
        casoId
      );


    if (!caso) {

      return {
        status: 404,

        data: {
          error:
            "Caso clinico nao encontrado.",
        },
      };
    }


    const investigacao =
      await obterInvestigacao(
        usuarioId,
        casoId
      );


    if (!investigacao) {

      const nova =
        await obterOuCriarInvestigacao(
          usuarioId,
          casoId
        );


      return {
        status: 200,

        data: {
          sucesso:
            true,

          investigacao:
            nova,
        },
      };
    }


    await prisma
      .$transaction(
        async function (tx) {

          await tx
            .registroInvestigacao
            .deleteMany({
              where: {
                investigacaoId:
                  investigacao.id,
              },
            });


          await tx
            .investigacaoCaso
            .update({
              where: {
                id:
                  investigacao.id,
              },

              data: {
                status:
                  "EM_ANDAMENTO",

                informacoesColetadas:
                  {},

                hipotese:
                  null,

                justificativa:
                  null,

                avaliacao:
                  Prisma.DbNull,

                finalizado:
                  false,
              },
            });
        }
      );


    const atualizada =
      await obterInvestigacao(
        usuarioId,
        casoId
      );


    return {
      status: 200,

      data: {
        sucesso:
          true,

        investigacao:
          atualizada,
      },
    };

  }
  catch (error) {

    console.error(
      "Erro ao refazer caso:",
      error
    );


    return {
      status: 500,

      data: {
        error:
          "Nao foi possivel refazer o caso.",
      },
    };
  }
}


export async function avaliarHipoteseCaso(
  usuarioId: number,
  casoId: number,
  body: any
): Promise<Resultado> {

  try {

    const hipotese =
      String(
        body.hipotese || ""
      ).trim();


    const justificativa =
      String(
        body.justificativa || ""
      ).trim();


    if (!hipotese) {

      return {
        status: 400,

        data: {
          error:
            "Informe sua hipotese diagnostica.",
        },
      };
    }


    if (!justificativa) {

      return {
        status: 400,

        data: {
          error:
            "Explique seu raciocinio clinico.",
        },
      };
    }


    const caso =
      await buscarCasoAcessivel(
        usuarioId,
        casoId
      );


    if (!caso) {

      return {
        status: 404,

        data: {
          error:
            "Caso clinico nao encontrado.",
        },
      };
    }


    let investigacao =
      await obterOuCriarInvestigacao(
        usuarioId,
        casoId
      );


    if (
      investigacao.finalizado &&
      investigacao.avaliacao
    ) {

      return {
        status: 200,

        data: {
          sucesso:
            true,

          jaFinalizada:
            true,

          investigacao,

          avaliacao:
            investigacao.avaliacao,
        },
      };
    }


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


    const informacoes =
      investigacao
        .registros
        .map(
          function (registro) {

            return {
              tipo:
                registro.tipo,

              titulo:
                registro.titulo,

              pergunta:
                registro.pergunta,

              resposta:
                registro.resposta,
            };
          }
        );


    const openai =
      new OpenAI({
        apiKey:
          chave,
      });


    const response =
      await openai
        .responses
        .create({
          model:
            process.env.OPENAI_CASE_MODEL ||
            "gpt-5.6-luna",

          reasoning: {
            effort:
              "none",
          },

          max_output_tokens:
            2500,

          input: [
            {
              role:
                "system",

              content: `
Voce e um professor universitario experiente em raciocinio clinico
para estudantes de Enfermagem e Medicina.

Avalie a hipotese diagnostica do estudante.

Regras:

1. Compare a hipotese com o diagnostico final.
2. Avalie tambem a justificativa.
3. Considere somente as informacoes que o estudante investigou.
4. Nao invente dados.
5. Diferencie uma hipotese incorreta de uma hipotese plausivel.
6. A nota deve ser de 0 a 10.
7. Seja rigoroso, didatico e objetivo.
8. Agora o diagnostico final pode ser revelado.
9. Seja conciso para reduzir o tempo de resposta.
10. Avaliacao geral: no maximo 4 frases.
11. Pontos fortes: no maximo 3 itens.
12. Pontos fracos: no maximo 3 itens.
13. Achados importantes: no maximo 4 itens.
14. Informacoes nao investigadas: no maximo 4 itens.
15. Diagnosticos diferenciais: no maximo 3 itens.
16. Raciocinio esperado: no maximo 5 frases.
17. Feedback educacional: no maximo 4 frases.
`,
            },

            {
              role:
                "user",

              content: `
CASO

Titulo:
${caso.titulo}

Area:
${caso.area}

Especialidade:
${caso.especialidade || "Nao especificada"}

Dificuldade:
${caso.dificuldade}

Cenario:
${caso.cenario}

Queixa inicial:
${caso.queixaInicial}

Diagnostico final:
${caso.diagnosticoFinal}

Explicacao:
${caso.explicacaoDiagnostico}

INFORMACOES REALMENTE INVESTIGADAS:

${textoSeguro(
  informacoes
)}

HIPOTESE DO ESTUDANTE:

${hipotese}

JUSTIFICATIVA:

${justificativa}

Avalie o raciocinio clinico.
`,
            },
          ],

          text: {
            format: {
              type:
                "json_schema",

              name:
                "avaliacao_caso",

              strict:
                true,

              schema: {
                type:
                  "object",

                properties: {
                  nota: {
                    type:
                      "number",
                  },

                  classificacao: {
                    type:
                      "string",
                  },

                  hipoteseCorreta: {
                    type:
                      "boolean",
                  },

                  diagnosticoFinal: {
                    type:
                      "string",
                  },

                  avaliacaoGeral: {
                    type:
                      "string",
                  },

                  pontosFortes: {
                    type:
                      "array",

                    items: {
                      type:
                        "string",
                    },
                  },

                  pontosFracos: {
                    type:
                      "array",

                    items: {
                      type:
                        "string",
                    },
                  },

                  achadosImportantes: {
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

                  informacoesNaoInvestigadas: {
                    type:
                      "array",

                    items: {
                      type:
                        "string",
                    },
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
                      },

                      required: [
                        "diagnostico",
                        "justificativa"
                      ],

                      additionalProperties:
                        false,
                    },
                  },

                  raciocinioEsperado: {
                    type:
                      "string",
                  },

                  feedbackEducacional: {
                    type:
                      "string",
                  },
                },

                required: [
                  "nota",
                  "classificacao",
                  "hipoteseCorreta",
                  "diagnosticoFinal",
                  "avaliacaoGeral",
                  "pontosFortes",
                  "pontosFracos",
                  "achadosImportantes",
                  "informacoesNaoInvestigadas",
                  "diagnosticosDiferenciais",
                  "raciocinioEsperado",
                  "feedbackEducacional"
                ],

                additionalProperties:
                  false,
              },
            },
          },
        });


    if (
      !response.output_text
    ) {

      return {
        status: 500,

        data: {
          error:
            "A IA nao retornou uma avaliacao.",
        },
      };
    }


    const avaliacao =
      JSON.parse(
        response.output_text
      );


    const nota =
      Math.min(
        10,

        Math.max(
          0,

          Number(
            avaliacao.nota ||
            0
          )
        )
      );


    const avaliacaoFinal = {
      ...avaliacao,

      nota,

      avaliadoEm:
        new Date()
          .toISOString(),
    };


    await prisma
      .investigacaoCaso
      .update({
        where: {
          id:
            investigacao.id,
        },

        data: {
          hipotese,
          justificativa,

          avaliacao:
            avaliacaoFinal as any,

          status:
            "FINALIZADA",

          finalizado:
            true,
        },
      });


    const maiorOrdem =
      investigacao
        .registros
        .reduce(
          function (
            maior,
            registro
          ) {

            return Math.max(
              maior,
              registro.ordem ||
              0
            );
          },

          0
        );


    await prisma
      .registroInvestigacao
      .create({
        data: {
          investigacaoId:
            investigacao.id,

          tipo:
            "HIPOTESE",

          titulo:
            "Hipotese diagnostica final",

          pergunta:
            "Qual e sua hipotese diagnostica?",

          resposta:
            "Hipotese: " +
            hipotese +
            "\n\nJustificativa: " +
            justificativa,

          ordem:
            maiorOrdem + 1,
        },
      });


    investigacao =
      (
        await obterInvestigacao(
          usuarioId,
          casoId
        )
      )!;


    return {
      status: 200,

      data: {
        sucesso:
          true,

        jaFinalizada:
          false,

        investigacao,

        avaliacao:
          avaliacaoFinal,
      },
    };

  }
  catch (error) {

    console.error(
      "Erro ao avaliar hipotese:",
      error
    );


    return {
      status: 500,

      data: {
        error:
          "Nao foi possivel avaliar a hipotese diagnostica.",
      },
    };
  }
}
