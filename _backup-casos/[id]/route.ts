import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterUsuarioId } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const usuarioId = await obterUsuarioId();

    if (!usuarioId) {
      return NextResponse.json(
        { error: "Não autenticado." },
        { status: 401 }
      );
    }

    const url = new URL(request.url);

    const partes = url.pathname.split("/").filter(Boolean);

    const indiceCasos = partes.findIndex((parte) => parte === "casos");

    if (indiceCasos === -1 || !partes[indiceCasos + 1]) {
      return NextResponse.json(
        { error: "ID do caso não informado." },
        { status: 400 }
      );
    }

    const idTexto = partes[indiceCasos + 1];

    const casoId = Number(idTexto);

    if (!Number.isInteger(casoId) || casoId <= 0) {
      return NextResponse.json(
        { error: "ID do caso inválido." },
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
        titulo: true,
        area: true,
        especialidade: true,
        dificuldade: true,
        cenario: true,
        queixaInicial: true,
        dadosIniciais: true,
        anamnese: true,
        exameFisico: true,
        sinaisVitais: true,
        exames: true,
        evolucao: true,
        publicado: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!caso) {
      return NextResponse.json(
        { error: "Caso clínico não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        sucesso: true,
        caso,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ERRO AO BUSCAR CASO CLÍNICO:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao carregar o caso clínico.",
      },
      { status: 500 }
    );
  }
}