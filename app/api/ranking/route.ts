import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        respostas: {
          select: {
            correta: true,
          },
        },
      },
    });

    const ranking = usuarios
      .map(function (usuario) {
        const total = usuario.respostas.length;

        const acertos = usuario.respostas.filter(
          function (resposta) {
            return resposta.correta;
          }
        ).length;

        const erros = total - acertos;

        const percentual =
          total > 0
            ? Math.round((acertos / total) * 100)
            : 0;

        return {
          usuarioId: usuario.id,
          nome: usuario.nome,
          total: total,
          acertos: acertos,
          erros: erros,
          percentual: percentual,
          elegivel: total >= 5,
        };
      })
      .filter(function (usuario) {
        return usuario.elegivel;
      })
      .sort(function (a, b) {
        if (b.percentual !== a.percentual) {
          return b.percentual - a.percentual;
        }

        if (b.total !== a.total) {
          return b.total - a.total;
        }

        return b.acertos - a.acertos;
      })
      .map(function (usuario, index) {
        return {
          posicao: index + 1,
          usuarioId: usuario.usuarioId,
          nome: usuario.nome,
          total: usuario.total,
          acertos: usuario.acertos,
          erros: usuario.erros,
          percentual: usuario.percentual,
        };
      });

    return NextResponse.json({
      ranking: ranking,
      minimoQuestoes: 5,
    });
  } catch (error) {
    console.error(
      "Erro ao buscar ranking:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Não foi possível carregar o ranking.",
      },
      {
        status: 500,
      }
    );
  }
}