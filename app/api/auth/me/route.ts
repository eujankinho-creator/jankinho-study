import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterUsuarioId } from "@/lib/auth";

export async function GET() {
  try {
    const usuarioId = await obterUsuarioId();

    if (!usuarioId) {
      return NextResponse.json(
        {
          autenticado: false,
          usuario: null,
        },
        {
          status: 401,
        }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        {
          autenticado: false,
          usuario: null,
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json({
      autenticado: true,
      usuario: usuario,
    });
  } catch (error) {
    console.error(
      "Erro ao verificar sessão:",
      error
    );

    return NextResponse.json(
      {
        error: "Não foi possível verificar a sessão.",
      },
      {
        status: 500,
      }
    );
  }
}