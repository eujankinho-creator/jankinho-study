import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterUsuarioId } from "@/lib/auth";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const usuarioId = await obterUsuarioId();

    if (!usuarioId) {
      return NextResponse.json(
        {
          error: "Não autenticado.",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const casoId = Number(id);

    if (!Number.isInteger(casoId) || casoId <= 0) {
      return NextResponse.json(
        {
          error: "ID do caso inválido.",
        },
        { status: 400 }
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
      select: {
        id: true,
      },
    });

    if (!caso) {
      return NextResponse.json(
        {
          error: "Caso clínico não encontrado.",
        },
        { status: 404 }
      );
    }

    const investigacao =
      await prisma.investigacaoCaso.findUnique({
        where: {
          casoId_usuarioId: {
            casoId,
            usuarioId,
          },
        },
      });

    if (!investigacao) {
      const novaInvestigacao =
        await prisma.investigacaoCaso.create({
          data: {
            casoId,
            usuarioId,
            status: "EM_ANDAMENTO",
            informacoesColetadas: {},
            finalizado: false,
          },
          include: {
            registros: {
              orderBy: {
                ordem: "asc",
              },
            },
          },
        });

      return NextResponse.json({
        sucesso: true,
        mensagem: "Caso preparado para uma nova tentativa.",
        investigacao: novaInvestigacao,
      });
    }

    const resultado =
      await prisma.$transaction(async (tx) => {
        await tx.registroInvestigacao.deleteMany({
          where: {
            investigacaoId: investigacao.id,
          },
        });

        const atualizada =
          await tx.investigacaoCaso.update({
            where: {
              id: investigacao.id,
            },
            data: {
              status: "EM_ANDAMENTO",
              informacoesColetadas: {},
              hipotese: null,
              justificativa: null,
              avaliacao: null,
              finalizado: false,
            },
            include: {
              registros: {
                orderBy: {
                  ordem: "asc",
                },
              },
            },
          });

        return atualizada;
      });

    return NextResponse.json({
      sucesso: true,
      mensagem: "Caso reiniciado com sucesso.",
      investigacao: resultado,
    });
  } catch (error) {
    console.error(
      "ERRO AO REFAZER CASO:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Não foi possível refazer o caso.",
      },
      { status: 500 }
    );
  }
}