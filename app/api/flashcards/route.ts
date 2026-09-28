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

    const flashcards =
      await prisma.flashcard.findMany({
        where: {
          usuarioId: usuarioId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error(
      "Erro ao buscar flashcards:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Não foi possível buscar os flashcards.",
      },
      {
        status: 500,
      }
    );
  }
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

    const body = await request.json();

    const frente = String(
      body.frente || ""
    ).trim();

    const verso = String(
      body.verso || ""
    ).trim();

    if (!frente || !verso) {
      return NextResponse.json(
        {
          error:
            "Frente e verso são obrigatórios.",
        },
        {
          status: 400,
        }
      );
    }

    const flashcard =
      await prisma.flashcard.create({
        data: {
          frente: frente,
          verso: verso,
          usuarioId: usuarioId,
        },
      });

    return NextResponse.json(
      flashcard,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Erro ao criar flashcard:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Não foi possível criar o flashcard.",
      },
      {
        status: 500,
      }
    );
  }
}