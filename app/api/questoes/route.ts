import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterUsuarioId } from "@/lib/auth";

export async function GET() {
  try {
    const questoes = await prisma.questao.findMany({
      include: {
        disciplina: true,
        alternativas: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(questoes);
  } catch (error) {
    console.error("Erro ao buscar questões:", error);

    return NextResponse.json(
      {
        error: "Não foi possível buscar as questões.",
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

    const enunciado = String(
      body.enunciado || ""
    ).trim();

    const explicacao =
      body.explicacao
        ? String(body.explicacao).trim()
        : null;

    const disciplinaId = Number(
      body.disciplinaId
    );

    const alternativas = Array.isArray(
      body.alternativas
    )
      ? body.alternativas
      : [];

    if (!enunciado) {
      return NextResponse.json(
        {
          error: "O enunciado é obrigatório.",
        },
        {
          status: 400,
        }
      );
    }

    if (!disciplinaId) {
      return NextResponse.json(
        {
          error: "A disciplina é obrigatória.",
        },
        {
          status: 400,
        }
      );
    }

    if (alternativas.length < 2) {
      return NextResponse.json(
        {
          error:
            "A questão precisa ter pelo menos duas alternativas.",
        },
        {
          status: 400,
        }
      );
    }

    const disciplina =
      await prisma.disciplina.findUnique({
        where: {
          id: disciplinaId,
        },
      });

    if (!disciplina) {
      return NextResponse.json(
        {
          error: "Disciplina não encontrada.",
        },
        {
          status: 404,
        }
      );
    }

    const questao =
      await prisma.questao.create({
        data: {
          enunciado: enunciado,
          explicacao: explicacao,
          usuarioId: usuarioId,
          disciplinaId: disciplinaId,
          alternativas: {
            create: alternativas.map(
              (
                alternativa: {
                  texto: string;
                  correta: boolean;
                }
              ) => ({
                texto: String(
                  alternativa.texto || ""
                ).trim(),
                correta:
                  Boolean(alternativa.correta),
              })
            ),
          },
        },
        include: {
          disciplina: true,
          alternativas: true,
        },
      });

    return NextResponse.json(
      questao,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Erro ao criar questão:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Não foi possível criar a questão.",
      },
      {
        status: 500,
      }
    );
  }
}