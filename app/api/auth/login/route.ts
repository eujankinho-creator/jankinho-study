import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { criarSessao } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const senha = String(body.senha || "");

    if (!email || !senha) {
      return NextResponse.json(
        {
          error: "E-mail e senha são obrigatórios.",
        },
        {
          status: 400,
        }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        email: email,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        {
          error: "E-mail ou senha incorretos.",
        },
        {
          status: 401,
        }
      );
    }

    if (!usuario.senhaHash) {
      return NextResponse.json(
        {
          error:
            "Este usuário ainda não possui uma senha configurada.",
        },
        {
          status: 401,
        }
      );
    }

    const senhaCorreta = await bcrypt.compare(
      senha,
      usuario.senhaHash
    );

    if (!senhaCorreta) {
      return NextResponse.json(
        {
          error: "E-mail ou senha incorretos.",
        },
        {
          status: 401,
        }
      );
    }

    await criarSessao(usuario.id);

    return NextResponse.json({
      sucesso: true,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Erro ao realizar login:", error);

    return NextResponse.json(
      {
        error: "Não foi possível realizar o login.",
      },
      {
        status: 500,
      }
    );
  }
}