import { prisma } from "../../lib/prisma";
import { filtroFlashcardsMetodologia } from "./flashcardsMetodologia";


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
            OR: [
              {
                disciplina: {
                  contains:
                    "Metodologia",

                  mode:
                    "insensitive",
                },
              },
              {
                tema: {
                  contains:
                    "Metodologia",

                  mode:
                    "insensitive",
                },
              },
              {
                frente: {
                  contains:
                    "[Metodologia",

                  mode:
                    "insensitive",
                },
              },
            ],
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

            origem:
              "manual",

            disciplina:
              "Metodologia",

            tema:
              "Metodologia",
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



function normalizar(
  valor:
    unknown
) {

  return String(
    valor ||
    ""
  )
    .normalize(
      "NFD"
    )
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLocaleLowerCase(
      "pt-BR"
    );

}


function ehMetodologia(
  card:
    {
      frente:
        string;

      tema:
        string |
        null;

      disciplina:
        string |
        null;
    }
) {

  return [
    card.frente,
    card.tema,
    card.disciplina,
  ]
    .some(
      function (
        valor
      ) {

        return normalizar(
          valor
        )
          .includes(
            "metodologia"
          );

      }
    );

}


export async function
limparFlashcardsParaMetodologia() {

  const atuais =
    await prisma
      .flashcard
      .findMany({
        select: {
          id:
            true,

          frente:
            true,

          tema:
            true,

          disciplina:
            true,

          origem:
            true,
        },
      });


  const preservar =
    atuais.filter(
      ehMetodologia
    );


  const remover =
    atuais.filter(
      function (
        card
      ) {

        return !ehMetodologia(
          card
        );

      }
    );


  if (
    remover.length
  ) {

    await prisma
      .flashcard
      .deleteMany({
        where: {
          id: {
            in:
              remover.map(
                function (
                  card
                ) {

                  return card.id;

                }
              ),
          },
        },
      });

  }


  if (
    preservar.length
  ) {

    await prisma
      .flashcard
      .updateMany({
        where: {
          id: {
            in:
              preservar.map(
                function (
                  card
                ) {

                  return card.id;

                }
              ),
          },
        },

        data: {
          disciplina:
            "Metodologia",
        },
      });

  }


  console.log(
    "[flashcards] Limpeza Metodologia:",
    preservar.length,
    "preservados;",
    remover.length,
    "removidos."
  );

}
