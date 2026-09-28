import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const disciplinas = await prisma.disciplina.findMany({
      orderBy: {
        nome: "asc",
      },
    });

    return NextResponse.json(disciplinas);
  } catch (error) {
    console.error("Erro ao buscar disciplinas:", error);

    return NextResponse.json(
      {
        error: "Não foi possível carregar as disciplinas.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const nome = String(body.nome || "").trim();

    if (!nome) {
      return NextResponse.json(
        {
          error: "O nome da disciplina é obrigatório.",
        },
        {
          status: 400,
        }
      );
    }

    const disciplinaExistente =
      await prisma.disciplina.findFirst({
        where: {
          nome: {
            equals: nome,
            mode: "insensitive",
          },
        },
      });

    if (disciplinaExistente) {
      return NextResponse.json(disciplinaExistente);
    }

    const disciplina = await prisma.disciplina.create({
      data: {
        nome: nome,
      },
    });

    return NextResponse.json(
      disciplina,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Erro ao criar disciplina:", error);

    return NextResponse.json(
      {
        error: "Não foi possível criar a disciplina.",
      },
      {
        status: 500,
      }
    );
  }
}