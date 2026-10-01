import { prisma } from "../../lib/prisma";


function metodologiaWhere() {

  return {
    OR: [
      {
        frente: {
          startsWith:
            "[Metodologia",
          mode:
            "insensitive" as const,
        },
      },
      {
        tema: {
          contains:
            "Metodologia",
          mode:
            "insensitive" as const,
        },
      },
      {
        disciplina: {
          contains:
            "Metodologia",
          mode:
            "insensitive" as const,
        },
      },
    ],
  };

}


export async function
limparFlashcardsParaMetodologia() {

  const preservados =
    await prisma
      .flashcard
      .findMany({
        where:
          metodologiaWhere(),

        select: {
          id:
            true,
        },
      });


  const ids =
    preservados.map(
      function (
        item
      ) {

        return item.id;

      }
    );


  const removidos =
    await prisma
      .flashcard
      .deleteMany({
        where:
          ids.length
            ? {
                id: {
                  notIn:
                    ids,
                },
              }
            : {
                id: {
                  gt:
                    0,
                },
              },
      });


  if (
    ids.length
  ) {

    await prisma
      .flashcard
      .updateMany({
        where: {
          id: {
            in:
              ids,
          },
        },

        data: {
          origem:
            "manual",

          tema:
            "Metodologia",

          disciplina:
            "Metodologia",

          questaoId:
            null,
        },
      });

  }


  console.log(
    "[flashcards] Metodologia:",
    ids.length,
    "preservados;",
    removidos.count,
    "outros flashcards removidos."
  );

}


export function
filtroFlashcardsMetodologia() {

  return metodologiaWhere();

}
