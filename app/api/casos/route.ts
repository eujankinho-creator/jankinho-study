import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { obterUsuarioId } from "@/lib/auth";

export async function GET() {
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

    const casos = await prisma.casoClinico.findMany({
      where: {
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
        titulo: true,
        area: true,
        especialidade: true,
        dificuldade: true,
        cenario: true,
        queixaInicial: true,
        publicado: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        sucesso: true,
        casos,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "ERRO AO LISTAR CASOS CLÍNICOS:",
      error
    );

    let mensagem =
      "Não foi possível carregar os casos clínicos.";

    if (error instanceof Error) {
      mensagem = error.message;
    }

    return NextResponse.json(
      {
        error: mensagem,
      },
      {
        status: 500,
      }
    );
  }
}