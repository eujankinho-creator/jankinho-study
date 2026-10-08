import { prisma } from "../../lib/prisma";

type Resultado = {
  status: number;
  data: unknown;
};

function texto(value: unknown) {
  return String(value || "").trim();
}

function inteiro(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

export async function listarFlashcards(
  usuarioId: number,
  url?: URL
): Promise<Resultado> {
  try {
    const disciplina = texto(url?.searchParams.get("disciplina"));
    const tema = texto(url?.searchParams.get("assunto"));
    const subassunto = texto(url?.searchParams.get("subassunto"));
    const dificuldade = texto(url?.searchParams.get("dificuldade"));
    const busca = texto(url?.searchParams.get("busca"));
    const estado = texto(url?.searchParams.get("estado"));
    const pagina = Math.max(1, inteiro(url?.searchParams.get("pagina"), 1));
    const limite = Math.max(10, Math.min(60, inteiro(url?.searchParams.get("limite"), 24)));

    const where: any = {
      status: "ATIVO",
    };

    if (disciplina) {
      where.disciplina = { equals: disciplina, mode: "insensitive" };
    }

    if (tema) {
      where.tema = { equals: tema, mode: "insensitive" };
    }

    if (subassunto) {
      where.subassunto = { equals: subassunto, mode: "insensitive" };
    }

    if (dificuldade) {
      where.dificuldade = { equals: dificuldade, mode: "insensitive" };
    }

    if (busca) {
      where.OR = [
        { frente: { contains: busca, mode: "insensitive" } },
        { verso: { contains: busca, mode: "insensitive" } },
        { tema: { contains: busca, mode: "insensitive" } },
        { subassunto: { contains: busca, mode: "insensitive" } },
        { disciplina: { contains: busca, mode: "insensitive" } },
      ];
    }

    if (estado === "favoritos") {
      where.progressos = {
        some: {
          usuarioId,
          favorito: true,
        },
      };
    } else if (estado === "revisados") {
      where.progressos = {
        some: {
          usuarioId,
          revisoes: { gt: 0 },
        },
      };
    } else if (estado === "nao-revisados") {
      where.progressos = {
        none: {
          usuarioId,
          revisoes: { gt: 0 },
        },
      };
    } else if (estado === "errados") {
      where.progressos = {
        some: {
          usuarioId,
          erros: { gt: 0 },
        },
      };
    } else if (estado === "acertos") {
      where.progressos = {
        some: {
          usuarioId,
          acertos: { gt: 0 },
        },
      };
    } else if (estado === "dificeis") {
      where.progressos = {
        some: {
          usuarioId,
          erros: { gt: 1 },
        },
      };
    }

    const [total, cards, metaAgrupada, progressoResumo] = await Promise.all([
      prisma.flashcard.count({ where }),
      prisma.flashcard.findMany({
        where,
        include: {
          progressos: {
            where: { usuarioId },
            take: 1,
          },
        },
        orderBy: [
          { disciplina: "asc" },
          { tema: "asc" },
          { createdAt: "desc" },
        ],
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      prisma.flashcard.findMany({
        where: { status: "ATIVO" },
        select: {
          disciplina: true,
          tema: true,
          subassunto: true,
          dificuldade: true,
        },
        distinct: ["disciplina", "tema", "subassunto", "dificuldade"],
      }),
      prisma.flashcardProgresso.aggregate({
        where: { usuarioId },
        _sum: {
          revisoes: true,
          acertos: true,
          erros: true,
        },
        _count: {
          id: true,
        },
      }),
    ]);

    const itens = cards.map((card) => {
      const progresso = card.progressos[0] || null;
      const { progressos, ...base } = card;

      return {
        ...base,
        progresso: progresso
          ? {
              revisoes: progresso.revisoes,
              acertos: progresso.acertos,
              erros: progresso.erros,
              favorito: progresso.favorito,
              ultimaRevisaoAt: progresso.ultimaRevisaoAt,
              ultimaRespostaCorreta: progresso.ultimaRespostaCorreta,
              proximaRevisaoAt: progresso.proximaRevisaoAt,
            }
          : {
              revisoes: 0,
              acertos: 0,
              erros: 0,
              favorito: false,
              ultimaRevisaoAt: null,
              ultimaRespostaCorreta: null,
              proximaRevisaoAt: null,
            },
      };
    });

    const revisoes = progressoResumo._sum.revisoes || 0;
    const acertos = progressoResumo._sum.acertos || 0;
    const erros = progressoResumo._sum.erros || 0;

    return {
      status: 200,
      data: {
        itens,
        total,
        pagina,
        limite,
        paginas: Math.max(1, Math.ceil(total / limite)),
        filtros: {
          disciplinas: [...new Set(metaAgrupada.map((x) => x.disciplina).filter(Boolean))].sort(),
          assuntos: [...new Set(metaAgrupada
            .filter((x) => !disciplina || (x.disciplina || "").toLocaleLowerCase("pt-BR") === disciplina.toLocaleLowerCase("pt-BR"))
            .map((x) => x.tema)
            .filter(Boolean))].sort(),
          subassuntos: [...new Set(metaAgrupada
            .filter((x) => !tema || (x.tema || "").toLocaleLowerCase("pt-BR") === tema.toLocaleLowerCase("pt-BR"))
            .map((x) => x.subassunto)
            .filter(Boolean))].sort(),
          dificuldades: [...new Set(metaAgrupada.map((x) => x.dificuldade).filter(Boolean))].sort(),
        },
        resumo: {
          revisoes,
          acertos,
          erros,
          percentualAcerto: revisoes > 0 ? Math.round((acertos / revisoes) * 100) : 0,
          cardsComProgresso: progressoResumo._count.id,
        },
      },
    };
  } catch (error) {
    console.error("Erro ao buscar flashcards:", error);

    return {
      status: 500,
      data: {
        error: "Nao foi possivel buscar os flashcards.",
      },
    };
  }
}

export async function criarFlashcard(
  usuarioId: number,
  body: any
): Promise<Resultado> {
  try {
    const frente = texto(body.frente);
    const verso = texto(body.verso);

    if (!frente || !verso) {
      return {
        status: 400,
        data: { error: "Frente e verso sao obrigatorios." },
      };
    }

    const card = await prisma.flashcard.create({
      data: {
        frente,
        verso,
        usuarioId,
        origem: "manual",
        disciplina: texto(body.disciplina) || "Geral",
        tema: texto(body.tema) || "Geral",
        subassunto: texto(body.subassunto) || null,
        dificuldade: texto(body.dificuldade) || "medio",
        status: "ATIVO",
        conhecimentoChave: texto(body.conhecimentoChave) || null,
      },
    });

    return { status: 201, data: card };
  } catch (error) {
    console.error("Erro ao criar flashcard:", error);
    return {
      status: 500,
      data: { error: "Nao foi possivel criar o flashcard." },
    };
  }
}

export async function registrarRevisaoFlashcard(
  usuarioId: number,
  flashcardId: number,
  correta: boolean
): Promise<Resultado> {
  try {
    const card = await prisma.flashcard.findUnique({
      where: { id: flashcardId },
      select: { id: true },
    });

    if (!card) {
      return { status: 404, data: { error: "Flashcard nao encontrado." } };
    }

    const atual = await prisma.flashcardProgresso.findUnique({
      where: {
        usuarioId_flashcardId: {
          usuarioId,
          flashcardId,
        },
      },
    });

    const revisoes = (atual?.revisoes || 0) + 1;
    const acertos = (atual?.acertos || 0) + (correta ? 1 : 0);
    const erros = (atual?.erros || 0) + (correta ? 0 : 1);

    let intervaloDias = atual?.intervaloDias || 0;
    let facilidade = atual?.facilidade || 2.5;

    if (correta) {
      if (intervaloDias <= 0) intervaloDias = 1;
      else if (intervaloDias === 1) intervaloDias = 3;
      else intervaloDias = Math.max(4, Math.round(intervaloDias * facilidade));

      facilidade = Math.min(3.0, facilidade + 0.05);
    } else {
      intervaloDias = 0;
      facilidade = Math.max(1.3, facilidade - 0.2);
    }

    const agora = new Date();
    const proximaRevisaoAt = new Date(
      agora.getTime() + intervaloDias * 24 * 60 * 60 * 1000
    );

    const progresso = await prisma.flashcardProgresso.upsert({
      where: {
        usuarioId_flashcardId: {
          usuarioId,
          flashcardId,
        },
      },
      create: {
        usuarioId,
        flashcardId,
        revisoes,
        acertos,
        erros,
        ultimaRevisaoAt: agora,
        ultimaRespostaCorreta: correta,
        intervaloDias,
        facilidade,
        proximaRevisaoAt,
      },
      update: {
        revisoes,
        acertos,
        erros,
        ultimaRevisaoAt: agora,
        ultimaRespostaCorreta: correta,
        intervaloDias,
        facilidade,
        proximaRevisaoAt,
      },
    });

    return {
      status: 200,
      data: {
        sucesso: true,
        progresso,
      },
    };
  } catch (error) {
    console.error("Erro ao registrar revisao de flashcard:", error);
    return {
      status: 500,
      data: { error: "Nao foi possivel registrar a revisao." },
    };
  }
}

export async function alternarFavoritoFlashcard(
  usuarioId: number,
  flashcardId: number,
  favorito: boolean
): Promise<Resultado> {
  try {
    const card = await prisma.flashcard.findUnique({
      where: { id: flashcardId },
      select: { id: true },
    });

    if (!card) {
      return { status: 404, data: { error: "Flashcard nao encontrado." } };
    }

    const progresso = await prisma.flashcardProgresso.upsert({
      where: {
        usuarioId_flashcardId: {
          usuarioId,
          flashcardId,
        },
      },
      create: {
        usuarioId,
        flashcardId,
        favorito,
      },
      update: {
        favorito,
      },
    });

    return {
      status: 200,
      data: {
        sucesso: true,
        favorito: progresso.favorito,
      },
    };
  } catch (error) {
    console.error("Erro ao favoritar flashcard:", error);
    return {
      status: 500,
      data: { error: "Nao foi possivel atualizar o favorito." },
    };
  }
}

export async function estatisticasFlashcards(
  usuarioId: number
): Promise<Resultado> {
  try {
    const [total, porAssunto, progresso] = await Promise.all([
      prisma.flashcard.count({
        where: { status: "ATIVO" },
      }),
      prisma.flashcard.groupBy({
        by: ["disciplina", "tema"],
        where: { status: "ATIVO" },
        _count: { _all: true },
        orderBy: [
          { disciplina: "asc" },
          { tema: "asc" },
        ],
      }),
      prisma.flashcardProgresso.findMany({
        where: { usuarioId },
        select: {
          flashcardId: true,
          revisoes: true,
          acertos: true,
          erros: true,
          favorito: true,
          ultimaRevisaoAt: true,
          proximaRevisaoAt: true,
        },
      }),
    ]);

    return {
      status: 200,
      data: {
        total,
        assuntos: porAssunto.map((item) => ({
          disciplina: item.disciplina || "Geral",
          assunto: item.tema || "Geral",
          quantidade: item._count._all,
        })),
        progresso,
      },
    };
  } catch (error) {
    console.error("Erro ao calcular estatisticas de flashcards:", error);
    return {
      status: 500,
      data: { error: "Nao foi possivel calcular as estatisticas." },
    };
  }
}
