import { prisma } from "../../lib/prisma";


function limparTexto(
  valor:
    unknown
) {

  return String(
    valor ||
    ""
  )
    .replace(
      /\s+/g,
      " "
    )
    .trim();

}


function limitar(
  valor:
    string,
  maximo:
    number
) {

  if (
    valor.length <=
      maximo
  ) {
    return valor;
  }


  return (
    valor
      .slice(
        0,
        Math.max(
          1,
          maximo - 1
        )
      )
      .trimEnd() +
    "…"
  );

}


function perguntaCurta(
  enunciado:
    string,
  tema:
    string,
  disciplina:
    string
) {

  const texto =
    limparTexto(
      enunciado
    );


  const expressoes =
    [
      /(?:Qual|Quais|Como|O que|Por que|Que termo|Que receptor|Que fármaco|Que farmaco|Que medicamento|Em qual|Aponte|Indique)[^?]{1,180}\?/gi,
    ];


  for (
    const expressao
    of expressoes
  ) {

    const encontrados =
      Array.from(
        texto.matchAll(
          expressao
        )
      );


    if (
      encontrados.length
    ) {

      const candidato =
        limparTexto(
          encontrados[
            encontrados.length -
            1
          ][0]
        );


      if (
        candidato.length >=
          12
      ) {

        return limitar(
          candidato,
          170
        );

      }

    }

  }


  const partes =
    texto
      .split(
        /(?<=[.!?])\s+/
      )
      .map(
        limparTexto
      )
      .filter(
        Boolean
      );


  const ultimaPergunta =
    [...partes]
      .reverse()
      .find(
        function (
          parte
        ) {

          return (
            parte.includes(
              "?"
            ) &&
            parte.length <=
              180
          );

        }
      );


  if (
    ultimaPergunta
  ) {

    return limitar(
      ultimaPergunta,
      170
    );

  }


  const contexto =
    tema ||
    disciplina ||
    "Revisão";


  return limitar(
    "Qual é o ponto-chave desta questão sobre " +
      contexto +
      "?",
    170
  );

}


export async function
sincronizarFlashcardDaQuestao(
  questaoId:
    number
) {

  const questao =
    await prisma
      .questao
      .findUnique({
        where: {
          id:
            questaoId,
        },

        include: {
          disciplina:
            true,

          alternativas:
            true,
        },
      });


  if (!questao) {
    return null;
  }


  const correta =
    questao.alternativas
      .find(
        function (
          alternativa
        ) {

          return alternativa
            .correta;

        }
      );


  if (!correta) {
    return null;
  }


  const disciplina =
    limparTexto(
      questao.disciplina
        .nome
    ) ||
    "Geral";


  const tema =
    limparTexto(
      questao.tema
    ) ||
    "Geral";


  const frente =
    limitar(
      "[" +
      disciplina +
      " | " +
      tema +
      "] " +
      perguntaCurta(
        questao.enunciado,
        tema,
        disciplina
      ),
      240
    );


  const verso =
    limitar(
      limparTexto(
        correta.texto
      ),
      220
    );


  const existente =
    await prisma
      .flashcard
      .findFirst({
        where: {
          questaoId:
            questao.id,

          origem:
            "questao",
        },
      });


  if (
    existente
  ) {

    return prisma
      .flashcard
      .update({
        where: {
          id:
            existente.id,
        },

        data: {
          frente,
          verso,

          origem:
            "questao",

          tema,

          disciplina,

          usuarioId:
            questao.usuarioId,
        },
      });

  }


  return prisma
    .flashcard
    .create({
      data: {
        frente,
        verso,

        origem:
          "questao",

        tema,

        disciplina,

        usuarioId:
          questao.usuarioId,

        questaoId:
          questao.id,
      },
    });

}


export async function
sincronizarFlashcardsDasQuestoes() {

  const questoes =
    await prisma
      .questao
      .findMany({
        include: {
          disciplina:
            true,

          alternativas:
            true,
        },

        orderBy: {
          id:
            "asc",
        },
      });


  const automaticos =
    await prisma
      .flashcard
      .findMany({
        where: {
          origem:
            "questao",
        },
      });


  const porQuestao =
    new Map(
      automaticos
        .filter(
          function (
            card
          ) {

            return Boolean(
              card.questaoId
            );

          }
        )
        .map(
          function (
            card
          ) {

            return [
              card.questaoId as number,
              card,
            ] as const;

          }
        )
    );


  let criados =
    0;


  let atualizados =
    0;


  for (
    const questao
    of questoes
  ) {

    const correta =
      questao.alternativas
        .find(
          function (
            alternativa
          ) {

            return alternativa
              .correta;

          }
        );


    if (
      !correta
    ) {
      continue;
    }


    const disciplina =
      limparTexto(
        questao.disciplina
          .nome
      ) ||
      "Geral";


    const tema =
      limparTexto(
        questao.tema
      ) ||
      "Geral";


    const frente =
      limitar(
        "[" +
        disciplina +
        " | " +
        tema +
        "] " +
        perguntaCurta(
          questao.enunciado,
          tema,
          disciplina
        ),
        240
      );


    const verso =
      limitar(
        limparTexto(
          correta.texto
        ),
        220
      );


    const existente =
      porQuestao.get(
        questao.id
      );


    if (
      !existente
    ) {

      await prisma
        .flashcard
        .create({
          data: {
            frente,
            verso,

            origem:
              "questao",

            tema,

            disciplina,

            usuarioId:
              questao.usuarioId,

            questaoId:
              questao.id,
          },
        });


      criados++;

      continue;

    }


    if (
      existente.frente !==
        frente ||
      existente.verso !==
        verso ||
      existente.tema !==
        tema ||
      existente.disciplina !==
        disciplina ||
      existente.usuarioId !==
        questao.usuarioId
    ) {

      await prisma
        .flashcard
        .update({
          where: {
            id:
              existente.id,
          },

          data: {
            frente,
            verso,
            tema,
            disciplina,

            usuarioId:
              questao.usuarioId,
          },
        });


      atualizados++;

    }

  }


  console.log(
    "[flashcards] Questões:",
    questoes.length,
    "questões;",
    criados,
    "flashcards criados;",
    atualizados,
    "atualizados."
  );

}
