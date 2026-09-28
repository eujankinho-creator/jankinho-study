import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterUsuarioId } from "@/lib/auth";

export async function GET() {
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

    const respostas = await prisma.resposta.findMany({
      where: {
        usuarioId: usuarioId,
      },
      include: {
        questao: {
          include: {
            disciplina: true,
          },
        },
      },
      orderBy: {
        respondidaAt: "desc",
      },
    });

    const total = respostas.length;

    const acertos = respostas.filter(
      (resposta) => resposta.correta
    ).length;

    const erros = total - acertos;

    const percentual =
      total > 0
        ? Math.round((acertos / total) * 100)
        : 0;

    const desempenhoPorDisciplina: Record<
      string,
      {
        disciplina: string;
        total: number;
        acertos: number;
        erros: number;
        percentual: number;
      }
    > = {};

    const desempenhoPorTema: Record<
      string,
      {
        tema: string;
        total: number;
        acertos: number;
        erros: number;
        percentual: number;
      }
    > = {};

    respostas.forEach((resposta) => {
      const disciplina =
        resposta.questao.disciplina.nome;

      const tema =
        resposta.questao.tema || "Sem tema";

      if (!desempenhoPorDisciplina[disciplina]) {
        desempenhoPorDisciplina[disciplina] = {
          disciplina: disciplina,
          total: 0,
          acertos: 0,
          erros: 0,
          percentual: 0,
        };
      }

      desempenhoPorDisciplina[disciplina].total++;

      if (resposta.correta) {
        desempenhoPorDisciplina[disciplina].acertos++;
      } else {
        desempenhoPorDisciplina[disciplina].erros++;
      }

      if (!desempenhoPorTema[tema]) {
        desempenhoPorTema[tema] = {
          tema: tema,
          total: 0,
          acertos: 0,
          erros: 0,
          percentual: 0,
        };
      }

      desempenhoPorTema[tema].total++;

      if (resposta.correta) {
        desempenhoPorTema[tema].acertos++;
      } else {
        desempenhoPorTema[tema].erros++;
      }
    });

    Object.values(
      desempenhoPorDisciplina
    ).forEach((item) => {
      item.percentual =
        item.total > 0
          ? Math.round(
              (item.acertos / item.total) * 100
            )
          : 0;
    });

    Object.values(desempenhoPorTema).forEach(
      (item) => {
        item.percentual =
          item.total > 0
            ? Math.round(
                (item.acertos / item.total) * 100
              )
            : 0;
      }
    );

    const disciplinas = Object.values(
      desempenhoPorDisciplina
    ).sort(
      (a, b) => b.total - a.total
    );

    const temas = Object.values(
      desempenhoPorTema
    ).sort(
      (a, b) => b.total - a.total
    );

    const ultimasRespostas = respostas
      .slice(0, 10)
      .map((resposta) => ({
        id: resposta.id,
        correta: resposta.correta,
        respondidaAt: resposta.respondidaAt,
        questao: resposta.questao.enunciado,
        disciplina:
          resposta.questao.disciplina.nome,
        tema: resposta.questao.tema,
      }));

    return NextResponse.json({
      resumo: {
        total: total,
        acertos: acertos,
        erros: erros,
        percentual: percentual,
      },
      disciplinas: disciplinas,
      temas: temas,
      ultimasRespostas: ultimasRespostas,
    });
  } catch (error) {
    console.error(
      "Erro ao buscar desempenho:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Não foi possível carregar o desempenho.",
      },
      {
        status: 500,
      }
    );
  }
}