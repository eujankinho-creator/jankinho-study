import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterUsuarioId } from "@/lib/auth";

export async function GET(request: Request) {
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

    const url = new URL(request.url);

    const inicio = url.searchParams.get("inicio");
    const fim = url.searchParams.get("fim");

    const dataInicio = inicio
      ? new Date(inicio + "T00:00:00")
      : undefined;

    const dataFim = fim
      ? new Date(fim + "T23:59:59")
      : undefined;

    const movimentacoes =
      await prisma.movimentacao.findMany({
        where: {
          usuarioId: usuarioId,
          ...(dataInicio || dataFim
            ? {
                data: {
                  ...(dataInicio
                    ? {
                        gte: dataInicio,
                      }
                    : {}),
                  ...(dataFim
                    ? {
                        lte: dataFim,
                      }
                    : {}),
                },
              }
            : {}),
        },
        orderBy: {
          data: "desc",
        },
      });

    let receitas = 0;
    let despesas = 0;

    for (const movimentacao of movimentacoes) {
      const valor = Number(movimentacao.valor);

      if (movimentacao.tipo === "RECEITA") {
        receitas += valor;
      }

      if (movimentacao.tipo === "DESPESA") {
        despesas += valor;
      }
    }

    const saldo = receitas - despesas;

    return NextResponse.json({
      movimentacoes: movimentacoes.map(
        function (movimentacao) {
          return {
            id: movimentacao.id,
            descricao: movimentacao.descricao,
            valor: Number(movimentacao.valor),
            tipo: movimentacao.tipo,
            data: movimentacao.data,
            createdAt: movimentacao.createdAt,
          };
        }
      ),

      resumo: {
        receitas: receitas,
        despesas: despesas,
        saldo: saldo,
      },
    });
  } catch (error) {
    console.error(
      "Erro ao buscar movimentações:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Não foi possível carregar as movimentações.",
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

    const descricao = String(
      body.descricao || ""
    ).trim();

    const valor = Number(body.valor);

    const tipo = String(body.tipo || "");

    const data = body.data
      ? new Date(body.data + "T12:00:00")
      : new Date();

    if (!descricao) {
      return NextResponse.json(
        {
          error: "A descrição é obrigatória.",
        },
        {
          status: 400,
        }
      );
    }

    if (!Number.isFinite(valor) || valor <= 0) {
      return NextResponse.json(
        {
          error: "Informe um valor válido.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      tipo !== "RECEITA" &&
      tipo !== "DESPESA"
    ) {
      return NextResponse.json(
        {
          error: "Tipo de movimentação inválido.",
        },
        {
          status: 400,
        }
      );
    }

    const movimentacao =
      await prisma.movimentacao.create({
        data: {
          descricao: descricao,
          valor: valor,
          tipo: tipo,
          data: data,
          usuarioId: usuarioId,
        },
      });

    return NextResponse.json(
      {
        sucesso: true,
        movimentacao: {
          id: movimentacao.id,
          descricao: movimentacao.descricao,
          valor: Number(movimentacao.valor),
          tipo: movimentacao.tipo,
          data: movimentacao.data,
          createdAt: movimentacao.createdAt,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Erro ao criar movimentação:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Não foi possível criar a movimentação.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request: Request) {
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

    const id = Number(body.id);

    const descricao = String(
      body.descricao || ""
    ).trim();

    const valor = Number(body.valor);

    const tipo = String(body.tipo || "");

    const data = body.data
      ? new Date(body.data + "T12:00:00")
      : new Date();

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        {
          error: "Movimentação inválida.",
        },
        {
          status: 400,
        }
      );
    }

    if (!descricao) {
      return NextResponse.json(
        {
          error: "A descrição é obrigatória.",
        },
        {
          status: 400,
        }
      );
    }

    if (!Number.isFinite(valor) || valor <= 0) {
      return NextResponse.json(
        {
          error: "Informe um valor válido.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      tipo !== "RECEITA" &&
      tipo !== "DESPESA"
    ) {
      return NextResponse.json(
        {
          error: "Tipo de movimentação inválido.",
        },
        {
          status: 400,
        }
      );
    }

    const movimentacaoExistente =
      await prisma.movimentacao.findFirst({
        where: {
          id: id,
          usuarioId: usuarioId,
        },
      });

    if (!movimentacaoExistente) {
      return NextResponse.json(
        {
          error: "Movimentação não encontrada.",
        },
        {
          status: 404,
        }
      );
    }

    const movimentacao =
      await prisma.movimentacao.update({
        where: {
          id: id,
        },
        data: {
          descricao: descricao,
          valor: valor,
          tipo: tipo,
          data: data,
        },
      });

    return NextResponse.json({
      sucesso: true,
      movimentacao: {
        id: movimentacao.id,
        descricao: movimentacao.descricao,
        valor: Number(movimentacao.valor),
        tipo: movimentacao.tipo,
        data: movimentacao.data,
        createdAt: movimentacao.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Erro ao editar movimentação:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Não foi possível editar a movimentação.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request: Request) {
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

    const url = new URL(request.url);

    const id = Number(
      url.searchParams.get("id")
    );

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        {
          error: "Movimentação inválida.",
        },
        {
          status: 400,
        }
      );
    }

    const movimentacaoExistente =
      await prisma.movimentacao.findFirst({
        where: {
          id: id,
          usuarioId: usuarioId,
        },
      });

    if (!movimentacaoExistente) {
      return NextResponse.json(
        {
          error: "Movimentação não encontrada.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.movimentacao.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      sucesso: true,
    });
  } catch (error) {
    console.error(
      "Erro ao excluir movimentação:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Não foi possível excluir a movimentação.",
      },
      {
        status: 500,
      }
    );
  }
}