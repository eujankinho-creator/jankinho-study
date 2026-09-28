import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterUsuarioId } from "@/lib/auth";

type TipoInvestigacao =
  | "ANAMNESE"
  | "EXAME_FISICO"
  | "SINAIS_VITAIS"
  | "EVOLUCAO"
  | "EXAME";

function formatarTitulo(valor: string) {
  return valor
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (letra) => letra.toUpperCase());
}

function normalizarExames(valor: unknown): any[] {
  if (!valor) {
    return [];
  }

  if (Array.isArray(valor)) {
    return valor;
  }

  if (typeof valor === "object") {
    return Object.entries(valor as Record<string, unknown>).map(
      ([nome, resultado]) => ({
        nome: formatarTitulo(nome),
        resultado,
      })
    );
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

  if (Array.isArray(valor)) {
    return valor
      .map((item) => textoSeguro(item))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof valor === "object") {
    return Object.entries(valor as Record<string, unknown>)
      .map(([chave, valorItem]) => {
        const texto = textoSeguro(valorItem);

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

    const url = new URL(request.url);

    const partes = url.pathname.split("/").filter(Boolean);

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

    const casoId = Number(partes[indiceCasos + 1]);

    if (!Number.isInteger(casoId) || casoId <= 0) {
      return NextResponse.json(
        {
          error: "ID do caso inválido.",
        },
        {
          status: 400,
        }
      );
    }

    const corpo = await request.json();

    const tipo = corpo?.tipo as TipoInvestigacao;

    const exameSolicitado = corpo?.exame;

    const tiposValidos: TipoInvestigacao[] = [
      "ANAMNESE",
      "EXAME_FISICO",
      "SINAIS_VITAIS",
      "EVOLUCAO",
      "EXAME",
    ];

    if (!tiposValidos.includes(tipo)) {
      return NextResponse.json(
        {
          error: "Tipo de investigação inválido.",
        },
        {
          status: 400,
        }
      );
    }

    const caso = await prisma.casoClinico.findFirst({
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
          error: "Caso clínico não encontrado.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ============================================================
     * INVESTIGAÇÃO DE EXAME
     * ============================================================
     */

    if (tipo === "EXAME") {
      const exames = normalizarExames(caso.exames);

      if (exames.length === 0) {
        return NextResponse.json(
          {
            error:
              "Este caso não possui exames disponíveis.",
          },
          {
            status: 404,
          }
        );
      }

      const indice =
        exameSolicitado?.index !== undefined
          ? Number(exameSolicitado.index)
          : -1;

      let exameEncontrado: any = null;

      /*
       * Primeiro tentamos pelo índice.
       */
      if (
        Number.isInteger(indice) &&
        indice >= 0 &&
        indice < exames.length
      ) {
        exameEncontrado = exames[indice];
      }

      /*
       * Caso o índice não encontre, tentamos pelo nome.
       */
      if (!exameEncontrado && exameSolicitado) {
        const nomeSolicitado = String(
          exameSolicitado.nome ||
            exameSolicitado.exame ||
            ""
        )
          .trim()
          .toLowerCase();

        exameEncontrado = exames.find((exame) => {
          const nomeExame = String(
            exame?.nome ||
              exame?.exame ||
              ""
          )
            .trim()
            .toLowerCase();

          return (
            nomeExame !== "" &&
            nomeExame === nomeSolicitado
          );
        });
      }

      if (!exameEncontrado) {
        return NextResponse.json(
          {
            error:
              "Esse exame não está disponível neste caso.",
          },
          {
            status: 400,
          }
        );
      }

      const resultadoExame = textoSeguro(
        exameEncontrado.resultado ??
          exameEncontrado.valor ??
          exameEncontrado.result ??
          exameEncontrado
      );

      const nomeExame =
        exameEncontrado.nome ||
        exameEncontrado.exame ||
        `Exame ${indice + 1}`;

      const interpretacao = exameEncontrado.interpretacao
        ? textoSeguro(exameEncontrado.interpretacao)
        : "";

      const respostaExame = interpretacao
        ? `${resultadoExame}\n\nInterpretação: ${interpretacao}`
        : resultadoExame;

      /*
       * Busca ou cria a investigação atual.
       */
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

      const registroExistente =
        investigacao.registros.find(
          (registro) =>
            registro.tipo === "EXAME" &&
            registro.titulo === nomeExame
        );

      /*
       * Se já solicitou o exame, simplesmente devolvemos
       * o registro existente.
       */
      if (registroExistente) {
        return NextResponse.json(
          {
            sucesso: true,
            investigacao,
            registro: registroExistente,
          },
          {
            status: 200,
          }
        );
      }

      const proximaOrdem =
        investigacao.registros.length + 1;

      const registro =
        await prisma.registroInvestigacao.create({
          data: {
            investigacaoId: investigacao.id,
            tipo: "EXAME",
            titulo: nomeExame,
            pergunta: `Resultado de ${nomeExame}`,
            resposta: respostaExame || "Sem resultado informado.",
            ordem: proximaOrdem,
          },
        });

      const informacoesAtuais =
        investigacao.informacoesColetadas &&
        typeof investigacao.informacoesColetadas ===
          "object" &&
        !Array.isArray(
          investigacao.informacoesColetadas
        )
          ? (investigacao.informacoesColetadas as Record<
              string,
              unknown
            >)
          : {};

      const examesColetados = Array.isArray(
        informacoesAtuais.exames
      )
        ? [
            ...(informacoesAtuais.exames as unknown[]),
            {
              nome: nomeExame,
              resultado: respostaExame,
            },
          ]
        : [
            {
              nome: nomeExame,
              resultado: respostaExame,
            },
          ];

      const informacoesAtualizadas = {
        ...informacoesAtuais,
        exames: examesColetados,
      };

      await prisma.investigacaoCaso.update({
        where: {
          id: investigacao.id,
        },
        data: {
          informacoesColetadas:
            informacoesAtualizadas,
        },
      });

      const investigacaoAtualizada =
        await prisma.investigacaoCaso.findUnique({
          where: {
            id: investigacao.id,
          },
          include: {
            registros: {
              orderBy: {
                ordem: "asc",
              },
            },
          },
        });

      return NextResponse.json(
        {
          sucesso: true,
          investigacao: investigacaoAtualizada,
          registro,
        },
        {
          status: 200,
        }
      );
    }

    /*
     * ============================================================
     * OUTRAS INVESTIGAÇÕES
     * ============================================================
     */

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

    let titulo = "";
    let resposta = "";

    if (tipo === "ANAMNESE") {
      titulo = "Anamnese";
      resposta = textoSeguro(caso.anamnese);
    }

    if (tipo === "EXAME_FISICO") {
      titulo = "Exame físico";
      resposta = textoSeguro(caso.exameFisico);
    }

    if (tipo === "SINAIS_VITAIS") {
      titulo = "Sinais vitais";
      resposta = textoSeguro(caso.sinaisVitais);
    }

    if (tipo === "EVOLUCAO") {
      titulo = "Evolução clínica";
      resposta = textoSeguro(caso.evolucao);
    }

    if (!resposta) {
      resposta =
        "Não há informações adicionais disponíveis para esta investigação.";
    }

    const registroExistente =
      investigacao.registros.find(
        (registro) => registro.tipo === tipo
      );

    if (registroExistente) {
      return NextResponse.json(
        {
          sucesso: true,
          investigacao,
          registro: registroExistente,
        },
        {
          status: 200,
        }
      );
    }

    const registro =
      await prisma.registroInvestigacao.create({
        data: {
          investigacaoId: investigacao.id,
          tipo,
          titulo,
          resposta,
          ordem: investigacao.registros.length + 1,
        },
      });

    const informacoesAtuais =
      investigacao.informacoesColetadas &&
      typeof investigacao.informacoesColetadas ===
        "object" &&
      !Array.isArray(
        investigacao.informacoesColetadas
      )
        ? (investigacao.informacoesColetadas as Record<
            string,
            unknown
          >)
        : {};

    const informacoesAtualizadas = {
      ...informacoesAtuais,
      [tipo]: resposta,
    };

    await prisma.investigacaoCaso.update({
      where: {
        id: investigacao.id,
      },
      data: {
        informacoesColetadas:
          informacoesAtualizadas,
      },
    });

    const investigacaoAtualizada =
      await prisma.investigacaoCaso.findUnique({
        where: {
          id: investigacao.id,
        },
        include: {
          registros: {
            orderBy: {
              ordem: "asc",
            },
          },
        },
      });

    return NextResponse.json(
      {
        sucesso: true,
        investigacao: investigacaoAtualizada,
        registro,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "ERRO AO INVESTIGAR CASO CLÍNICO:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao investigar o caso clínico.",
      },
      {
        status: 500,
      }
    );
  }
}