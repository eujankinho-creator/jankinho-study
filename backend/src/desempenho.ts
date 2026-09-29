import type {
  IncomingMessage,
  ServerResponse,
} from "node:http";

import {
  jwtVerify,
} from "jose";

import {
  prisma,
} from "../../lib/prisma";


function json(
  response: ServerResponse,
  status: number,
  data: unknown
) {

  response.writeHead(
    status,
    {
      "Content-Type":
        "application/json; charset=utf-8",

      "Cache-Control":
        "no-store",
    }
  );

  response.end(
    JSON.stringify(data)
  );
}


function obterCookie(
  request: IncomingMessage,
  nome: string
) {

  const header =
    request.headers.cookie || "";


  const cookies =
    header
      .split(";")
      .map(
        function (item) {
          return item.trim();
        }
      );


  for (
    const cookie
    of cookies
  ) {

    const index =
      cookie.indexOf("=");


    if (index < 0) {
      continue;
    }


    const chave =
      cookie.slice(
        0,
        index
      );


    const valor =
      cookie.slice(
        index + 1
      );


    if (chave === nome) {

      return decodeURIComponent(
        valor
      );
    }
  }


  return null;
}


async function obterUsuarioId(
  request: IncomingMessage
) {

  const token =
    obterCookie(
      request,
      "jankinho_session"
    );


  if (!token) {
    return null;
  }


  const secret =
    process.env.AUTH_SECRET;


  if (!secret) {

    throw new Error(
      "AUTH_SECRET nao configurado."
    );
  }


  try {

    const resultado =
      await jwtVerify(
        token,
        new TextEncoder()
          .encode(secret)
      );


    const usuarioId =
      Number(
        resultado.payload
          .usuarioId
      );


    if (
      !Number.isInteger(
        usuarioId
      ) ||
      usuarioId <= 0
    ) {

      return null;
    }


    return usuarioId;

  }
  catch {

    return null;
  }
}


export async function atenderDesempenho(
  request: IncomingMessage,
  response: ServerResponse
) {

  try {

    const usuarioId =
      await obterUsuarioId(
        request
      );


    if (!usuarioId) {

      json(
        response,
        401,
        {
          error:
            "Nao autenticado.",
        }
      );

      return;
    }


    const respostas =
      await prisma.resposta.findMany({
        where: {
          usuarioId,
        },

        include: {
          questao: {
            include: {
              disciplina:
                true,
            },
          },
        },

        orderBy: {
          respondidaAt:
            "desc",
        },
      });


    const total =
      respostas.length;


    const acertos =
      respostas.filter(
        function (resposta) {

          return resposta.correta;
        }
      ).length;


    const erros =
      total -
      acertos;


    const percentual =
      total > 0
        ? Math.round(
            (
              acertos /
              total
            ) * 100
          )
        : 0;


    const porDisciplina:
      Record<
        string,
        {
          disciplina:
            string;

          total:
            number;

          acertos:
            number;

          erros:
            number;

          percentual:
            number;
        }
      > = {};


    const porTema:
      Record<
        string,
        {
          tema:
            string;

          total:
            number;

          acertos:
            number;

          erros:
            number;

          percentual:
            number;
        }
      > = {};


    for (
      const resposta
      of respostas
    ) {

      const disciplina =
        resposta.questao
          .disciplina.nome;


      const tema =
        resposta.questao.tema ||
        "Sem tema";


      if (
        !porDisciplina[
          disciplina
        ]
      ) {

        porDisciplina[
          disciplina
        ] = {
          disciplina,
          total: 0,
          acertos: 0,
          erros: 0,
          percentual: 0,
        };
      }


      const itemDisciplina =
        porDisciplina[
          disciplina
        ];


      itemDisciplina.total++;


      if (
        resposta.correta
      ) {

        itemDisciplina
          .acertos++;

      }
      else {

        itemDisciplina
          .erros++;
      }


      if (
        !porTema[
          tema
        ]
      ) {

        porTema[
          tema
        ] = {
          tema,
          total: 0,
          acertos: 0,
          erros: 0,
          percentual: 0,
        };
      }


      const itemTema =
        porTema[
          tema
        ];


      itemTema.total++;


      if (
        resposta.correta
      ) {

        itemTema
          .acertos++;

      }
      else {

        itemTema
          .erros++;
      }
    }


    const disciplinas =
      Object.values(
        porDisciplina
      );


    for (
      const item
      of disciplinas
    ) {

      item.percentual =
        item.total > 0
          ? Math.round(
              (
                item.acertos /
                item.total
              ) * 100
            )
          : 0;
    }


    disciplinas.sort(
      function (a, b) {

        return (
          b.total -
          a.total
        );
      }
    );


    const temas =
      Object.values(
        porTema
      );


    for (
      const item
      of temas
    ) {

      item.percentual =
        item.total > 0
          ? Math.round(
              (
                item.acertos /
                item.total
              ) * 100
            )
          : 0;
    }


    temas.sort(
      function (a, b) {

        return (
          b.total -
          a.total
        );
      }
    );


    const ultimasRespostas =
      respostas
        .slice(
          0,
          10
        )
        .map(
          function (resposta) {

            return {
              id:
                resposta.id,

              correta:
                resposta.correta,

              respondidaAt:
                resposta.respondidaAt,

              questao:
                resposta.questao
                  .enunciado,

              disciplina:
                resposta.questao
                  .disciplina.nome,

              tema:
                resposta.questao
                  .tema ||
                "Sem tema",
            };
          }
        );


    json(
      response,
      200,
      {
        resumo: {
          total,
          acertos,
          erros,
          percentual,
        },

        disciplinas,

        temas,

        ultimasRespostas,
      }
    );

  }
  catch (error) {

    console.error(
      "Erro ao carregar desempenho:",
      error
    );


    json(
      response,
      500,
      {
        error:
          "Nao foi possivel carregar o desempenho.",
      }
    );
  }
}