import type {
  IncomingMessage,
  ServerResponse,
} from "node:http";

import bcrypt from "bcryptjs";

import {
  jwtVerify,
} from "jose";

import {
  prisma,
} from "../../lib/prisma";


const TEMAS_PERMITIDOS =
  new Set([
    "dark-orange",
    "dark-pink",
    "dark-green",
    "dark-purple",
    "dark-black",
  ]);


function normalizarTema(
  value: unknown
) {

  const tema =
    String(
      value ||
      ""
    )
      .trim();


  if (
    TEMAS_PERMITIDOS.has(
      tema
    )
  ) {

    return tema;
  }


  return "dark-orange";
}

function normalizarPetMode(
  value: unknown
) {
  const mode =
    String(
      value ||
      ""
    )
      .trim();

  return (
    mode === "visible" ||
    mode === "hidden" ||
    mode === "removed"
  )
    ? mode
    : "removed";
}


function normalizarPetProfile(
  value: unknown
) {
  const fallback = {
    name: "",
    color: "theme",
    outfit: "none",
  };

  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return fallback;
  }

  const input =
    value as Record<string, unknown>;

  const cores =
    new Set([
      "theme",
      "orange",
      "pink",
      "green",
      "purple",
      "black",
      "white",
    ]);

  const roupas =
    new Set([
      "none",
      "bow",
      "hoodie",
      "scarf",
      "glasses",
      "crown",
    ]);

  const color =
    String(
      input.color ||
      "theme"
    );

  const outfit =
    String(
      input.outfit ||
      "none"
    );

  return {
    name:
      String(
        input.name ||
        ""
      )
        .replace(
          /[<>]/g,
          ""
        )
        .trim()
        .slice(
          0,
          16
        ),

    color:
      cores.has(color)
        ? color
        : "theme",

    outfit:
      roupas.has(outfit)
        ? outfit
        : "none",
  };
}


function normalizarFotoPerfil(
  value: unknown
) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }


  const foto =
    String(value)
      .trim();


  if (
    foto.length >
      280 * 1024
  ) {

    throw new Error(
      "A foto de perfil ficou muito grande."
    );
  }


  if (
    !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/
      .test(foto)
  ) {

    throw new Error(
      "Formato de foto de perfil invalido."
    );
  }


  return foto;
}



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


    const chave =
      cookie.slice(
        0,
        index
      );


    if (chave !== nome) {
      continue;
    }


    return decodeURIComponent(
      cookie.slice(
        index + 1
      )
    );
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


async function lerJson(
  request: IncomingMessage
) {

  return await new Promise<
    Record<string, unknown>
  >(
    function (
      resolve,
      reject
    ) {

      let body = "";


      request.on(
        "data",
        function (chunk) {

          body +=
            String(chunk);


          if (
            body.length >
            512 * 1024
          ) {

            reject(
              new Error(
                "Requisicao muito grande."
              )
            );


            request.destroy();
          }
        }
      );


      request.on(
        "end",
        function () {

          if (!body.trim()) {

            resolve({});

            return;
          }


          try {

            const data =
              JSON.parse(body);


            if (
              typeof data !== "object" ||
              data === null ||
              Array.isArray(data)
            ) {

              resolve({});

              return;
            }


            resolve(data);

          }
          catch {

            reject(
              new Error(
                "JSON invalido."
              )
            );
          }
        }
      );


      request.on(
        "error",
        reject
      );
    }
  );
}


export async function obterConfiguracoes(
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


    const usuario =
      await prisma.usuario.findUnique({
        where: {
          id: usuarioId,
        },

        select: {
          id: true,
          nome: true,
          email: true,
          createdAt: true,
          senhaHash: true,
          tema: true,
          fotoPerfil: true,
          petMode: true,
          petProfile: true,
        },
      });


    if (!usuario) {

      json(
        response,
        401,
        {
          error:
            "Usuario nao encontrado.",
        }
      );

      return;
    }


    json(
      response,
      200,
      {
        usuario: {
          id:
            usuario.id,

          nome:
            usuario.nome,

          email:
            usuario.email,

          createdAt:
            usuario.createdAt,

          temSenha:
            Boolean(
              usuario.senhaHash
            ),

          tema:
            normalizarTema(
              usuario.tema
            ),

          fotoPerfil:
            usuario.fotoPerfil ||
            null,

          petMode:
            normalizarPetMode(
              usuario.petMode
            ),

          petProfile:
            normalizarPetProfile(
              usuario.petProfile
            ),
        },
      }
    );

  }
  catch (error) {

    console.error(
      "Erro ao carregar configuracoes:",
      error
    );


    json(
      response,
      500,
      {
        error:
          "Nao foi possivel carregar as configuracoes.",
      }
    );
  }
}


export async function atualizarPerfil(
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


    const body =
      await lerJson(
        request
      );


    const nome =
      String(
        body.nome || ""
      )
        .trim();


    if (!nome) {

      json(
        response,
        400,
        {
          error:
            "Informe seu nome.",
        }
      );

      return;
    }


    if (
      nome.length < 2
    ) {

      json(
        response,
        400,
        {
          error:
            "O nome precisa ter pelo menos 2 caracteres.",
        }
      );

      return;
    }


    if (
      nome.length > 80
    ) {

      json(
        response,
        400,
        {
          error:
            "O nome e muito longo.",
        }
      );

      return;
    }


    const possuiFotoPerfil =
      Object.prototype
        .hasOwnProperty
        .call(
          body,
          "fotoPerfil"
        );


    let fotoPerfil:
      string |
      null |
      undefined =
      undefined;


    if (possuiFotoPerfil) {

      try {

        fotoPerfil =
          normalizarFotoPerfil(
            body.fotoPerfil
          );

      }
      catch (error) {

        json(
          response,
          400,
          {
            error:
              error instanceof Error
                ? error.message
                : "Foto de perfil invalida.",
          }
        );


        return;
      }
    }


    const dadosPerfil: {
      nome: string;
      fotoPerfil?: string | null;
    } = {
      nome,
    };


    if (possuiFotoPerfil) {

      dadosPerfil.fotoPerfil =
        fotoPerfil ??
        null;

    }


    const usuario =
      await prisma.usuario.update({
        where: {
          id: usuarioId,
        },

        data:
          dadosPerfil,

        select: {
          id: true,
          nome: true,
          email: true,
          createdAt: true,
          fotoPerfil: true,
        },
      });


    json(
      response,
      200,
      {
        sucesso: true,
        usuario,
      }
    );

  }
  catch (error) {

    console.error(
      "Erro ao atualizar perfil:",
      error
    );


    json(
      response,
      500,
      {
        error:
          "Nao foi possivel atualizar o perfil.",
      }
    );
  }
}


export async function atualizarTema(
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


    const body =
      await lerJson(
        request
      );


    const tema =
      normalizarTema(
        body.tema
      );


    if (
      !TEMAS_PERMITIDOS.has(
        String(
          body.tema ||
          ""
        )
          .trim()
      )
    ) {

      json(
        response,
        400,
        {
          error:
            "Tema invalido.",
        }
      );

      return;
    }


    const usuario =
      await prisma.usuario.update({
        where: {
          id: usuarioId,
        },

        data: {
          tema,
        },

        select: {
          id: true,
          tema: true,
        },
      });


    json(
      response,
      200,
      {
        sucesso: true,

        tema:
          normalizarTema(
            usuario.tema
          ),
      }
    );

  }
  catch (error) {

    console.error(
      "Erro ao atualizar tema:",
      error
    );


    json(
      response,
      500,
      {
        error:
          "Nao foi possivel salvar o tema.",
      }
    );
  }
}


export async function atualizarPet(
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

    const body =
      await lerJson(
        request
      );

    const possuiMode =
      Object.prototype
        .hasOwnProperty
        .call(
          body,
          "mode"
        );

    const possuiProfile =
      Object.prototype
        .hasOwnProperty
        .call(
          body,
          "profile"
        );

    if (
      !possuiMode &&
      !possuiProfile
    ) {
      json(
        response,
        400,
        {
          error:
            "Nenhuma configuracao do pet foi informada.",
        }
      );

      return;
    }

    const data: {
      petMode?: string;
      petProfile?: {
        name: string;
        color: string;
        outfit: string;
      };
    } = {};

    if (possuiMode) {
      data.petMode =
        normalizarPetMode(
          body.mode
        );
    }

    if (possuiProfile) {
      data.petProfile =
        normalizarPetProfile(
          body.profile
        );
    }

    const usuario =
      await prisma.usuario.update({
        where: {
          id: usuarioId,
        },

        data,

        select: {
          id: true,
          petMode: true,
          petProfile: true,
        },
      });

    json(
      response,
      200,
      {
        sucesso: true,

        petMode:
          normalizarPetMode(
            usuario.petMode
          ),

        petProfile:
          normalizarPetProfile(
            usuario.petProfile
          ),
      }
    );
  }
  catch (error) {
    console.error(
      "Erro ao atualizar pet:",
      error
    );

    json(
      response,
      500,
      {
        error:
          "Nao foi possivel salvar o pet.",
      }
    );
  }
}


export async function atualizarSenha(
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


    const body =
      await lerJson(
        request
      );


    const senhaAtual =
      String(
        body.senhaAtual ||
        ""
      );


    const novaSenha =
      String(
        body.novaSenha ||
        ""
      );


    if (
      novaSenha.length < 6
    ) {

      json(
        response,
        400,
        {
          error:
            "A nova senha deve ter pelo menos 6 caracteres.",
        }
      );

      return;
    }


    const usuario =
      await prisma.usuario.findUnique({
        where: {
          id: usuarioId,
        },

        select: {
          senhaHash: true,
        },
      });


    if (!usuario) {

      json(
        response,
        404,
        {
          error:
            "Usuario nao encontrado.",
        }
      );

      return;
    }


    if (
      usuario.senhaHash
    ) {

      if (!senhaAtual) {

        json(
          response,
          400,
          {
            error:
              "Informe sua senha atual.",
          }
        );

        return;
      }


      const correta =
        await bcrypt.compare(
          senhaAtual,
          usuario.senhaHash
        );


      if (!correta) {

        json(
          response,
          401,
          {
            error:
              "Senha atual incorreta.",
          }
        );

        return;
      }
    }


    const senhaHash =
      await bcrypt.hash(
        novaSenha,
        12
      );


    await prisma.usuario.update({
      where: {
        id: usuarioId,
      },

      data: {
        senhaHash,
      },
    });


    json(
      response,
      200,
      {
        sucesso: true,
      }
    );

  }
  catch (error) {

    console.error(
      "Erro ao atualizar senha:",
      error
    );


    json(
      response,
      500,
      {
        error:
          "Nao foi possivel alterar a senha.",
      }
    );
  }
}