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

  const cookies =
    (request.headers.cookie || "")
      .split(";")
      .map(
        function (item) {
          return item.trim();
        }
      );


  for (const cookie of cookies) {

    const index =
      cookie.indexOf("=");


    if (index < 0) {
      continue;
    }


    if (
      cookie.slice(0, index) === nome
    ) {

      return decodeURIComponent(
        cookie.slice(index + 1)
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

    const result =
      await jwtVerify(
        token,
        new TextEncoder()
          .encode(secret)
      );


    const usuarioId =
      Number(
        result.payload.usuarioId
      );


    if (
      !Number.isInteger(usuarioId) ||
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


export async function atenderRanking(
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


    const registros =
      await prisma.usuario.findMany({
        select: {
          id: true,
          nome: true,
          fotoPerfil: true,

          respostas: {
            select: {
              correta: true,
            },
          },
        },
      });


    const calculados =
      registros.map(
        function (usuario) {

          const total =
            usuario.respostas.length;


          const acertos =
            usuario.respostas.filter(
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


          return {
            usuarioId:
              usuario.id,

            nome:
              usuario.nome,

            fotoPerfil:
              usuario.fotoPerfil ||
              null,

            total,

            acertos,

            erros,

            percentual,

            elegivel:
              total >= 5,
          };
        }
      );


    const ranking =
      calculados
        .filter(
          function (usuario) {
            return usuario.elegivel;
          }
        )
        .sort(
          function (a, b) {

            if (
              b.percentual !==
              a.percentual
            ) {

              return (
                b.percentual -
                a.percentual
              );
            }


            if (
              b.total !==
              a.total
            ) {

              return (
                b.total -
                a.total
              );
            }


            return (
              b.acertos -
              a.acertos
            );
          }
        )
        .map(
          function (
            usuario,
            index
          ) {

            return {
              ...usuario,

              posicao:
                index + 1,
            };
          }
        );


    const posicoes =
      new Map(
        ranking.map(
          function (item) {

            return [
              item.usuarioId,
              item.posicao,
            ];
          }
        )
      );


    const usuarios =
      calculados
        .map(
          function (usuario) {

            return {
              ...usuario,

              posicao:
                posicoes.get(
                  usuario.usuarioId
                ) || null,
            };
          }
        )
        .sort(
          function (a, b) {

            if (
              a.elegivel &&
              !b.elegivel
            ) {
              return -1;
            }


            if (
              !a.elegivel &&
              b.elegivel
            ) {
              return 1;
            }


            if (
              a.posicao !== null &&
              b.posicao !== null
            ) {

              return (
                a.posicao -
                b.posicao
              );
            }


            return a.nome.localeCompare(
              b.nome,
              "pt-BR"
            );
          }
        );


    json(
      response,
      200,
      {
        ranking,
        usuarios,
        minimoQuestoes: 5,
      }
    );

  }
  catch (error) {

    console.error(
      "Erro ao carregar ranking:",
      error
    );


    json(
      response,
      500,
      {
        error:
          "Nao foi possivel carregar o ranking.",
      }
    );
  }
}