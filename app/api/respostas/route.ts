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

    const respostas =
      await prisma.resposta.findMany({
        where: {
          usuarioId: usuarioId,
        },
        include: {
          questao: {
            include: {
              disciplina: true,
            },
          },
        },
        orderBy: {
          respondidaAt: "desc",
        },
      });

    return NextResponse.json(respostas);
  } catch (error) {
    console.error(
      "Erro ao buscar respostas:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Não foi possível buscar as respostas.",
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

    const questaoId = Number(body.questaoId);
    const correta = Boolean(body.correta);

    if (!questaoId) {
      return NextResponse.json(
        {
          error: "A questão é obrigatória.",
        },
        {
          status: 400,
        }
      );
    }

    const questao =
      await prisma.questao.findUnique({
        where: {
          id: questaoId,
        },
      });

    if (!questao) {
      return NextResponse.json(
        {
          error: "Questão não encontrada.",
        },
        {
          status: 404,
        }
      );
    }

    const resposta =
      await prisma.resposta.create({
        data: {
          correta: correta,
          usuarioId: usuarioId,
          questaoId: questaoId,
        },
      });

    return NextResponse.json(
      resposta,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Erro ao salvar resposta:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Não foi possível salvar a resposta.",
      },
      {
        status: 500,
      }
    );
  }
}