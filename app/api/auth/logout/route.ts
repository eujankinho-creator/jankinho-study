import { NextResponse } from "next/server";
import { encerrarSessao } from "@/lib/auth";

export async function POST() {
  try {
    await encerrarSessao();

    return NextResponse.json({
      sucesso: true,
    });
  } catch (error) {
    console.error(
      "Erro ao encerrar sessão:",
      error
    );

    return NextResponse.json(
      {
        error: "Não foi possível encerrar a sessão.",
      },
      {
        status: 500,
      }
    );
  }
}