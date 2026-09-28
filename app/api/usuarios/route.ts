import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const usuarios = await prisma.usuario.findMany({
    orderBy: {
      nome: "asc",
    },
  });

  return NextResponse.json(usuarios);
}

export async function POST(request: Request) {
  const body = await request.json();

  const usuario = await prisma.usuario.create({
    data: {
      nome: body.nome,
      email: body.email,
    },
  });

  return NextResponse.json(usuario, { status: 201 });
}