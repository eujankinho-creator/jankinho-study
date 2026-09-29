import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { criarSessao } from "@/lib/auth";

export async function POST(request: Request) {
  let etapa = "início";

  try {
    etapa = "ler requisição";
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

    etapa = "consultar usuário no banco";

    const usuario = await prisma.usuario.findUnique({
      where: {
        email,
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
          error: "Este usuário ainda não possui uma senha configurada.",
        },
        {
          status: 401,
        }
      );
    }

    etapa = "comparar senha";

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

    etapa = "criar sessão";

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

    const mensagem =
      error instanceof Error
        ? error.message
        : String(error);

    return NextResponse.json(
      {
        error: mensagem,
        etapa,
        authSecretConfigurado: !!process.env.AUTH_SECRET,
        databaseConfigurado: !!process.env.DATABASE_URL,
      },
      {
        status: 500,
      }
    );
  }
}