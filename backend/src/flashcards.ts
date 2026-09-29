import { prisma } from "../../lib/prisma";


type Resultado = {
  status: number;
  data: unknown;
};


export async function listarFlashcards(
  usuarioId: number
): Promise<Resultado> {

  try {

    const flashcards =
      await prisma
        .flashcard
        .findMany({
          where: {
            usuarioId,
          },

          orderBy: {
            createdAt:
              "desc",
          },
        });


    return {
      status: 200,
      data: flashcards,
    };

  }
  catch (error) {

    console.error(
      "Erro ao buscar flashcards:",
      error
    );


    return {
      status: 500,

      data: {
        error:
          "Nao foi possivel buscar os flashcards.",
      },
    };
  }
}


export async function criarFlashcard(
  usuarioId: number,
  body: any
): Promise<Resultado> {

  try {

    const frente =
      String(
        body.frente || ""
      ).trim();


    const verso =
      String(
        body.verso || ""
      ).trim();


    if (
      !frente ||
      !verso
    ) {

      return {
        status: 400,

        data: {
          error:
            "Frente e verso sao obrigatorios.",
        },
      };
    }


    const flashcard =
      await prisma
        .flashcard
        .create({
          data: {
            frente,
            verso,
            usuarioId,
          },
        });


    return {
      status: 201,
      data: flashcard,
    };

  }
  catch (error) {

    console.error(
      "Erro ao criar flashcard:",
      error
    );


    return {
      status: 500,

      data: {
        error:
          "Nao foi possivel criar o flashcard.",
      },
    };
  }
}
