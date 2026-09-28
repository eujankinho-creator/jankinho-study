import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const nome = String(body.nome || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const senha = String(body.senha || "");

    if (!nome || !email || !senha) {
      return NextResponse.json(
        {
          error: "Nome, e-mail e senha são obrigatórios.",
        },
        {
          status: 400,
        }
      );
    }

    if (senha.length < 6) {
      return NextResponse.json(
        {
          error: "A senha deve ter pelo menos 6 caracteres.",
        },
        {
          status: 400,
        }
      );
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: {
        email: email,
      },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        {
          error: "Este e-mail já está cadastrado.",
        },
        {
          status: 409,
        }
      );
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    const usuario = await prisma.usuario.create({
      data: {
        nome: nome,
        email: email,
        senhaHash: senhaHash,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        sucesso: true,
        usuario: usuario,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);

    return NextResponse.json(
      {
        error: "Não foi possível criar o usuário.",
      },
      {
        status: 500,
      }
    );
  }
}