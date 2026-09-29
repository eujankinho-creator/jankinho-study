import OpenAI from "openai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterUsuarioId } from "@/lib/auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type AvaliacaoIA = {
  nota: number;
  classificacao: string;
  hipoteseCorreta: boolean;
  diagnosticoFinal: string;
  avaliacaoGeral: string;
  pontosFortes: string[];
  pontosFracos: string[];
  achadosImportantes: {
    achado: string;
    importancia: string;
  }[];
  informacoesNaoInvestigadas: string[];
  diagnosticosDiferenciais: {
    diagnostico: string;
    justificativa: string;
  }[];
  raciocinioEsperado: string;
  feedbackEducacional: string;
};

function textoSeguro(valor: unknown): string {
  if (valor === null || valor === undefined) {
    return "";
  }

  if (typeof valor === "string") {
    return valor;
  }

  if (
    typeof valor === "number" ||
    typeof valor === "boolean"
  ) {
    return String(valor);
  }

  try {
    return JSON.stringify(valor, null, 2);
  } catch {
    return String(valor);
  }
}

export async function POST(request: Request) {
  try {
    // =========================================================
    // AUTENTICAÇÃO
    // =========================================================

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

    // =========================================================
    // OBTÉM ID DO CASO
    // =========================================================

    const url = new URL(request.url);

    const partes = url.pathname
      .split("/")
      .filter(Boolean);

    const indiceCasos = partes.findIndex(
      (parte) => parte === "casos"
    );

    if (
      indiceCasos === -1 ||
      !partes[indiceCasos + 1]
    ) {
      return NextResponse.json(
        {
          error: "ID do caso não informado.",
        },
        {
          status: 400,
        }
      );
    }

    const casoId = Number(
      partes[indiceCasos + 1]
    );

    if (
      !Number.isInteger(casoId) ||
      casoId <= 0
    ) {
      return NextResponse.json(
        {
          error: "ID do caso inválido.",
        },
        {
          status: 400,
        }
      );
    }

    // =========================================================
    // DADOS ENVIADOS PELO FRONTEND
    // =========================================================

    const body = await request.json();

    const hipotese = String(
      body?.hipotese || ""
    ).trim();

    const justificativa = String(
      body?.justificativa || ""
    ).trim();

    if (!hipotese) {
      return NextResponse.json(
        {
          error:
            "Informe sua hipótese diagnóstica.",
        },
        {
          status: 400,
        }
      );
    }

    if (!justificativa) {
      return NextResponse.json(
        {
          error:
            "Explique seu raciocínio clínico antes de finalizar.",
        },
        {
          status: 400,
        }
      );
    }

    // =========================================================
    // BUSCA O CASO
    // =========================================================

    const caso =
      await prisma.casoClinico.findFirst({
        where: {
          id: casoId,
          OR: [
            {
              autorId: usuarioId,
            },
            {
              publicado: true,
            },
          ],
        },
      });

    if (!caso) {
      return NextResponse.json(
        {
          error:
            "Caso clínico não encontrado.",
        },
        {
          status: 404,
        }
      );
    }

    // =========================================================
    // BUSCA INVESTIGAÇÃO EXISTENTE
    // =========================================================

    let investigacao =
      await prisma.investigacaoCaso.findUnique({
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

    // =========================================================
    // SE NÃO EXISTIR, CRIA
    // =========================================================

    if (!investigacao) {
      investigacao =
        await prisma.investigacaoCaso.create({
          data: {
            casoId,
            usuarioId,
            status: "EM_ANDAMENTO",
            informacoesColetadas: {},
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

    // =========================================================
    // CASO JÁ TENHA SIDO FINALIZADO
    // =========================================================
    //
    // Se já existe avaliação salva, simplesmente devolvemos
    // o resultado. Isso evita o erro "já foi finalizada".
    //
    // Se está finalizada mas NÃO possui avaliação, significa
    // que provavelmente ocorreu uma falha durante a primeira
    // tentativa. Nesse caso permitimos gerar a avaliação.
    // =========================================================

    if (
      investigacao.finalizado &&
      investigacao.avaliacao
    ) {
      return NextResponse.json(
        {
          sucesso: true,
          jaFinalizada: true,
          investigacao,
          avaliacao:
            investigacao.avaliacao,
        },
        {
          status: 200,
        }
      );
    }

    // =========================================================
    // RECUPERA INVESTIGAÇÃO INCONSISTENTE
    // =========================================================

    if (
      investigacao.finalizado &&
      !investigacao.avaliacao
    ) {
      await prisma.investigacaoCaso.update({
        where: {
          id: investigacao.id,
        },

        data: {
          finalizado: false,
          status: "EM_ANDAMENTO",
        },
      });

      investigacao = {
        ...investigacao,
        finalizado: false,
        status: "EM_ANDAMENTO",
      };
    }

    // =========================================================
    // INFORMAÇÕES REALMENTE INVESTIGADAS
    // =========================================================

    const informacoesDescobertas =
      investigacao.registros.map(
        (registro) => ({
          tipo: registro.tipo,
          titulo: registro.titulo,
          pergunta: registro.pergunta,
          resposta: registro.resposta,
          ordem: registro.ordem,
        })
      );

    // =========================================================
    // CHAMADA PARA A IA
    // =========================================================

    const response =
      await openai.responses.create({
        model: "gpt-5-mini",

        input: [
          {
            role: "system",

            content: `
Você é um professor universitário experiente em raciocínio clínico para estudantes de Enfermagem e Medicina.

Sua função é avaliar uma hipótese diagnóstica apresentada por um estudante diante de um caso clínico.

Seja tecnicamente rigoroso, mas didático.

REGRAS IMPORTANTES:

1. Compare a hipótese do aluno com o diagnóstico final do caso.

2. Avalie a justificativa apresentada pelo aluno.

3. Considere somente as informações que o aluno realmente investigou.

4. Não considere como investigada uma informação que o aluno não solicitou.

5. Não penalize excessivamente a ausência de informações que não eram necessárias para chegar à hipótese.

6. Identifique os achados que sustentam o diagnóstico.

7. Identifique achados importantes que poderiam ter sido melhor valorizados.

8. Se a hipótese estiver errada, explique quais elementos apontam para outro diagnóstico.

9. Diferencie uma hipótese totalmente errada de uma hipótese plausível, porém incompleta.

10. Avalie o raciocínio clínico e não apenas a coincidência do nome da doença.

11. Não invente informações que não existem no caso.

12. A nota deve refletir exclusivamente a qualidade do raciocínio clínico apresentado.

13. A nota deve ser de 0 a 10.

14. O diagnóstico final deve ser revelado porque o estudante está encerrando a investigação.

15. Explique os mecanismos fisiopatológicos relevantes quando forem úteis para aprendizagem.

16. Não faça julgamentos pessoais sobre o estudante.

17. Seja específico e didático.

CLASSIFICAÇÃO DA HIPÓTESE:

- Se corresponder claramente ao diagnóstico final, considere a hipótese correta.
- Se representar um diagnóstico muito próximo ou uma manifestação diretamente relacionada, explique a relação.
- Se for plausível, mas não for o diagnóstico final, classifique como hipótese plausível/incompleta quando apropriado.
- Se não houver sustentação pelos dados, classifique como hipótese não compatível.

A avaliação deve considerar tanto o diagnóstico proposto quanto a qualidade do raciocínio utilizado para chegar nele.

Não penalize o estudante simplesmente por não ter solicitado uma informação que não era necessária para sua hipótese.

Não invente dados.

Retorne somente o JSON no formato solicitado.
`,
          },

          {
            role: "user",

            content: `
CASO CLÍNICO

Título:
${caso.titulo}

Área:
${caso.area}

Especialidade:
${caso.especialidade || "Não especificada"}

Dificuldade:
${caso.dificuldade}

Cenário:
${caso.cenario}

Queixa inicial:
${caso.queixaInicial}

Dados iniciais:
${textoSeguro(caso.dadosIniciais)}

Anamnese:
${textoSeguro(caso.anamnese)}

Exame físico:
${textoSeguro(caso.exameFisico)}

Sinais vitais:
${textoSeguro(caso.sinaisVitais)}

Exames:
${textoSeguro(caso.exames)}

Evolução:
${textoSeguro(caso.evolucao)}

DIAGNÓSTICO FINAL DO CASO:
${caso.diagnosticoFinal}

EXPLICAÇÃO DO DIAGNÓSTICO:
${caso.explicacaoDiagnostico}

DIAGNÓSTICOS DIFERENCIAIS DO CASO:
${textoSeguro(
  caso.diagnosticosDiferenciais
)}

PONTOS-CHAVE DO CASO:
${textoSeguro(caso.pontosChave)}


==================================================
INFORMAÇÕES REALMENTE INVESTIGADAS PELO ALUNO
==================================================

${textoSeguro(
  informacoesDescobertas
)}


==================================================
HIPÓTESE DO ALUNO
==================================================

${hipotese}


==================================================
JUSTIFICATIVA DO ALUNO
==================================================

${justificativa}


Agora avalie o raciocínio clínico do aluno.
`,
          },
        ],

        text: {
          format: {
            type: "json_schema",

            name: "avaliacao_caso_clinico",

            strict: true,

            schema: {
              type: "object",

              properties: {
                nota: {
                  type: "number",
                },

                classificacao: {
                  type: "string",
                },

                hipoteseCorreta: {
                  type: "boolean",
                },

                diagnosticoFinal: {
                  type: "string",
                },

                avaliacaoGeral: {
                  type: "string",
                },

                pontosFortes: {
                  type: "array",

                  items: {
                    type: "string",
                  },
                },

                pontosFracos: {
                  type: "array",

                  items: {
                    type: "string",
                  },
                },

                achadosImportantes: {
                  type: "array",

                  items: {
                    type: "object",

                    properties: {
                      achado: {
                        type: "string",
                      },

                      importancia: {
                        type: "string",
                      },
                    },

                    required: [
                      "achado",
                      "importancia",
                    ],

                    additionalProperties: false,
                  },
                },

                informacoesNaoInvestigadas: {
                  type: "array",

                  items: {
                    type: "string",
                  },
                },

                diagnosticosDiferenciais: {
                  type: "array",

                  items: {
                    type: "object",

                    properties: {
                      diagnostico: {
                        type: "string",
                      },

                      justificativa: {
                        type: "string",
                      },
                    },

                    required: [
                      "diagnostico",
                      "justificativa",
                    ],

                    additionalProperties: false,
                  },
                },

                raciocinioEsperado: {
                  type: "string",
                },

                feedbackEducacional: {
                  type: "string",
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
                "feedbackEducacional",
              ],

              additionalProperties: false,
            },
          },
        },
      });

    // =========================================================
    // VERIFICA RESPOSTA DA IA
    // =========================================================

    if (!response.output_text) {
      return NextResponse.json(
        {
          error:
            "A IA não retornou uma avaliação.",
        },
        {
          status: 500,
        }
      );
    }

    // =========================================================
    // CONVERTE JSON
    // =========================================================

    let avaliacao: AvaliacaoIA;

    try {
      avaliacao = JSON.parse(
        response.output_text
      ) as AvaliacaoIA;
    } catch (error) {
      console.error(
        "ERRO AO INTERPRETAR RESPOSTA DA IA:",
        error
      );

      console.error(
        "RESPOSTA DA IA:",
        response.output_text
      );

      return NextResponse.json(
        {
          error:
            "A IA retornou uma avaliação em formato inválido.",
        },
        {
          status: 500,
        }
      );
    }

    // =========================================================
    // NORMALIZA NOTA
    // =========================================================

    const notaNumero = Number(
      avaliacao.nota
    );

    const nota = Math.max(
      0,
      Math.min(
        10,
        Number.isFinite(notaNumero)
          ? notaNumero
          : 0
      )
    );

    const avaliacaoFinal = {
      ...avaliacao,
      nota,
      avaliadoEm:
        new Date().toISOString(),
    };

    // =========================================================
    // SALVA INVESTIGAÇÃO
    // =========================================================

    const investigacaoAtualizada =
      await prisma.investigacaoCaso.update({
        where: {
          id: investigacao.id,
        },

        data: {
          hipotese,
          justificativa,
          avaliacao:
            avaliacaoFinal,
          status: "FINALIZADA",
          finalizado: true,
        },

        include: {
          registros: {
            orderBy: {
              ordem: "asc",
            },
          },
        },
      });

    // =========================================================
    // CRIA REGISTRO DA HIPÓTESE
    // =========================================================

    const maiorOrdem =
      investigacaoAtualizada.registros.reduce(
        (maior, registro) => {
          return Math.max(
            maior,
            registro.ordem || 0
          );
        },
        0
      );

    await prisma.registroInvestigacao.create({
      data: {
        investigacaoId:
          investigacaoAtualizada.id,

        tipo: "HIPOTESE",

        titulo:
          "Hipótese diagnóstica final",

        pergunta:
          "Qual é sua hipótese diagnóstica?",

        resposta:
          `Hipótese: ${hipotese}

Justificativa: ${justificativa}`,

        ordem: maiorOrdem + 1,
      },
    });

    // =========================================================
    // BUSCA INVESTIGAÇÃO FINAL
    // =========================================================

    const investigacaoFinal =
      await prisma.investigacaoCaso.findUnique({
        where: {
          id: investigacaoAtualizada.id,
        },

        include: {
          registros: {
            orderBy: {
              ordem: "asc",
            },
          },
        },
      });

    // =========================================================
    // RETORNO
    // =========================================================

    return NextResponse.json(
      {
        sucesso: true,

        jaFinalizada: false,

        investigacao:
          investigacaoFinal,

        avaliacao:
          avaliacaoFinal,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "ERRO AO AVALIAR HIPÓTESE:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Não foi possível avaliar a hipótese diagnóstica.",
      },
      {
        status: 500,
      }
    );
  }
}