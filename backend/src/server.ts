import {
  createServer,
  IncomingMessage,
  ServerResponse,
} from "node:http";

import {
  readFile,
  stat,
} from "node:fs/promises";

import {
  existsSync,
  readFileSync,
} from "node:fs";

import path from "node:path";

import bcrypt from "bcryptjs";

import {
  SignJWT,
  jwtVerify,
} from "jose";

import { prisma } from "../../lib/prisma";


const PORT =
  Number(process.env.PORT || 3001);

const COOKIE_NAME =
  "jankinho_session";

const FRONTEND_DIR =
  path.resolve(
    process.cwd(),
    "frontend"
  );


function carregarEnv() {

  const arquivo =
    path.resolve(
      process.cwd(),
      ".env"
    );

  if (!existsSync(arquivo)) {
    return;
  }

  const linhas =
    readFileSync(
      arquivo,
      "utf8"
    ).split(/\r?\n/);

  for (const linha of linhas) {

    const limpa =
      linha.trim();

    if (
      !limpa ||
      limpa.startsWith("#")
    ) {
      continue;
    }

    const indice =
      limpa.indexOf("=");

    if (indice === -1) {
      continue;
    }

    const chave =
      limpa
        .slice(0, indice)
        .trim();

    let valor =
      limpa
        .slice(indice + 1)
        .trim();

    if (
      (valor.startsWith('"') &&
       valor.endsWith('"')) ||
      (valor.startsWith("'") &&
       valor.endsWith("'"))
    ) {
      valor =
        valor.slice(1, -1);
    }

    if (
      !process.env[chave]
    ) {
      process.env[chave] =
        valor;
    }
  }
}


carregarEnv();


function chaveJwt() {

  const segredo =
    process.env.AUTH_SECRET;

  if (!segredo) {

    throw new Error(
      "AUTH_SECRET nÃ£o configurado no .env"
    );

  }

  return new TextEncoder()
    .encode(segredo);
}


async function criarToken(
  usuarioId: number
) {

  return new SignJWT({
    usuarioId,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(chaveJwt());

}


function cookiesDaRequisicao(
  request: IncomingMessage
) {

  const resultado:
    Record<string, string> = {};

  const header =
    request.headers.cookie;

  if (!header) {
    return resultado;
  }

  const partes =
    header.split(";");

  for (const parte of partes) {

    const indice =
      parte.indexOf("=");

    if (indice === -1) {
      continue;
    }

    const chave =
      parte
        .slice(0, indice)
        .trim();

    const valor =
      parte
        .slice(indice + 1)
        .trim();

    resultado[chave] =
      decodeURIComponent(valor);

  }

  return resultado;
}


async function usuarioIdDaRequisicao(
  request: IncomingMessage
) {

  try {

    const cookies =
      cookiesDaRequisicao(request);

    const token =
      cookies[COOKIE_NAME];

    if (!token) {
      return null;
    }

    const resultado =
      await jwtVerify(
        token,
        chaveJwt()
      );

    const usuarioId =
      resultado
        .payload
        .usuarioId;

    if (
      typeof usuarioId !==
      "number"
    ) {
      return null;
    }

    return usuarioId;

  }
  catch {

    return null;

  }
}


function json(
  response: ServerResponse,
  status: number,
  dados: unknown
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
    JSON.stringify(dados)
  );
}


function redirecionar(
  response: ServerResponse,
  destino: string
) {

  response.writeHead(
    302,
    {
      Location: destino,
    }
  );

  response.end();
}


async function lerJson(
  request: IncomingMessage
) {

  return new Promise<any>(
    (resolve, reject) => {

      let corpo = "";

      request.on(
        "data",
        function (parte) {

          corpo += parte;

          if (
            corpo.length >
            1_000_000
          ) {

            reject(
              new Error(
                "RequisiÃ§Ã£o muito grande."
              )
            );

            request.destroy();
          }
        }
      );


      request.on(
        "end",
        function () {

          try {

            resolve(
              corpo
                ? JSON.parse(corpo)
                : {}
            );

          }
          catch {

            reject(
              new Error(
                "JSON invÃ¡lido."
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


function contentType(
  arquivo: string
) {

  const extensao =
    path.extname(
      arquivo
    ).toLowerCase();

  const tipos:
    Record<string, string> = {

      ".html":
        "text/html; charset=utf-8",

      ".css":
        "text/css; charset=utf-8",

      ".js":
        "text/javascript; charset=utf-8",

      ".json":
        "application/json; charset=utf-8",

      ".png":
        "image/png",

      ".jpg":
        "image/jpeg",

      ".jpeg":
        "image/jpeg",

      ".svg":
        "image/svg+xml",

      ".ico":
        "image/x-icon",
    };

  return (
    tipos[extensao] ||
    "application/octet-stream"
  );
}


async function servirArquivo(
  response: ServerResponse,
  caminhoUrl: string
) {

  let caminhoRelativo =
    caminhoUrl;

  if (caminhoRelativo === "/") {
    caminhoRelativo =
      "/index.html";
  }

  const arquivo =
    path.resolve(
      FRONTEND_DIR,
      "." + caminhoRelativo
    );


  if (
    !arquivo.startsWith(
      FRONTEND_DIR
    )
  ) {

    json(
      response,
      403,
      {
        error: "Acesso negado.",
      }
    );

    return;
  }


  try {

    const info =
      await stat(arquivo);

    if (!info.isFile()) {
      throw new Error();
    }

    const conteudo =
      await readFile(arquivo);

    response.writeHead(
      200,
      {
        "Content-Type":
          contentType(arquivo),

        "Cache-Control":
          "no-cache",
      }
    );

    response.end(
      conteudo
    );

  }
  catch {

    json(
      response,
      404,
      {
        error:
          "Arquivo nÃ£o encontrado.",
      }
    );

  }
}


async function login(
  request: IncomingMessage,
  response: ServerResponse
) {

  let etapa =
    "inÃ­cio";

  try {

    etapa =
      "ler requisiÃ§Ã£o";

    const body =
      await lerJson(request);


    const email =
      String(
        body.email || ""
      )
        .trim()
        .toLowerCase();


    const senha =
      String(
        body.senha || ""
      );


    if (
      !email ||
      !senha
    ) {

      json(
        response,
        400,
        {
          error:
            "E-mail e senha sÃ£o obrigatÃ³rios.",
        }
      );

      return;
    }


    etapa =
      "consultar usuÃ¡rio no banco";


    const usuario =
      await prisma
        .usuario
        .findUnique({
          where: {
            email,
          },
        });


    if (!usuario) {

      json(
        response,
        401,
        {
          error:
            "E-mail ou senha incorretos.",
        }
      );

      return;
    }


    if (!usuario.senhaHash) {

      json(
        response,
        401,
        {
          error:
            "Este usuÃ¡rio ainda nÃ£o possui uma senha configurada.",
        }
      );

      return;
    }


    etapa =
      "comparar senha";


    const senhaCorreta =
      await bcrypt.compare(
        senha,
        usuario.senhaHash
      );


    if (!senhaCorreta) {

      json(
        response,
        401,
        {
          error:
            "E-mail ou senha incorretos.",
        }
      );

      return;
    }


    etapa =
      "criar sessÃ£o";


    const token =
      await criarToken(
        usuario.id
      );


    const seguro =
      process.env.NODE_ENV ===
      "production"
        ? "; Secure"
        : "";


    response.setHeader(
      "Set-Cookie",
      `${COOKIE_NAME}=${encodeURIComponent(
        token
      )}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${seguro}`
    );


    json(
      response,
      200,
      {
        sucesso: true,

        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
        },
      }
    );

  }
  catch (error) {

    console.error(
      "Erro ao realizar login:",
      error
    );


    json(
      response,
      500,
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),

        etapa,

        authSecretConfigurado:
          !!process.env.AUTH_SECRET,

        databaseConfigurado:
          !!process.env.DATABASE_URL,
      }
    );

  }
}


async function cadastro(
  request: IncomingMessage,
  response: ServerResponse
) {

  try {

    const body =
      await lerJson(request);


    const nome =
      String(
        body.nome || ""
      ).trim();


    const email =
      String(
        body.email || ""
      )
        .trim()
        .toLowerCase();


    const senha =
      String(
        body.senha || ""
      );


    if (
      !nome ||
      !email ||
      !senha
    ) {

      json(
        response,
        400,
        {
          error:
            "Nome, e-mail e senha sÃ£o obrigatÃ³rios.",
        }
      );

      return;
    }


    if (
      senha.length < 6
    ) {

      json(
        response,
        400,
        {
          error:
            "A senha deve ter pelo menos 6 caracteres.",
        }
      );

      return;
    }


    const existente =
      await prisma
        .usuario
        .findUnique({
          where: {
            email,
          },
        });


    if (existente) {

      json(
        response,
        409,
        {
          error:
            "Este e-mail jÃ¡ estÃ¡ cadastrado.",
        }
      );

      return;
    }


    const senhaHash =
      await bcrypt.hash(
        senha,
        12
      );


    const usuario =
      await prisma
        .usuario
        .create({
          data: {
            nome,
            email,
            senhaHash,
          },

          select: {
            id: true,
            nome: true,
            email: true,
            createdAt: true,
          },
        });


    json(
      response,
      201,
      {
        sucesso: true,
        usuario,
      }
    );

  }
  catch (error) {

    console.error(
      "Erro ao cadastrar usuÃ¡rio:",
      error
    );


    json(
      response,
      500,
      {
        error:
          "NÃ£o foi possÃ­vel criar o usuÃ¡rio.",
      }
    );

  }
}


async function me(
  request: IncomingMessage,
  response: ServerResponse
) {

  try {

    const usuarioId =
      await usuarioIdDaRequisicao(
        request
      );


    if (!usuarioId) {

      json(
        response,
        401,
        {
          autenticado: false,
          usuario: null,
        }
      );

      return;
    }


    const usuario =
      await prisma
        .usuario
        .findUnique({
          where: {
            id: usuarioId,
          },

          select: {
            id: true,
            nome: true,
            email: true,
            createdAt: true,
          },
        });


    if (!usuario) {

      json(
        response,
        401,
        {
          autenticado: false,
          usuario: null,
        }
      );

      return;
    }


    json(
      response,
      200,
      {
        autenticado: true,
        usuario,
      }
    );

  }
  catch {

    json(
      response,
      500,
      {
        error:
          "NÃ£o foi possÃ­vel verificar a sessÃ£o.",
      }
    );

  }
}


function logout(
  response: ServerResponse
) {

  const seguro =
    process.env.NODE_ENV ===
    "production"
      ? "; Secure"
      : "";


  response.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${seguro}`
  );


  json(
    response,
    200,
    {
      sucesso: true,
    }
  );
}


const server =
  createServer(
    async function (
      request,
      response
    ) {

      try {

        const metodo =
          request.method ||
          "GET";


        const url =
          new URL(
            request.url || "/",
            `http://${
              request.headers.host ||
              "localhost"
            }`
          );


        const caminho =
          url.pathname;


        if (
          caminho ===
          "/health"
        ) {

          json(
            response,
            200,
            {
              status: "ok",
              backend: "typescript",
            }
          );

          return;
        }


        if (
          caminho ===
            "/api/auth/login" &&
          metodo === "POST"
        ) {

          await login(
            request,
            response
          );

          return;
        }


        if (
          caminho ===
            "/api/auth/cadastro" &&
          metodo === "POST"
        ) {

          await cadastro(
            request,
            response
          );

          return;
        }


        if (
          caminho ===
            "/api/auth/me" &&
          metodo === "GET"
        ) {

          await me(
            request,
            response
          );

          return;
        }


        if (
          caminho ===
            "/api/auth/logout" &&
          metodo === "POST"
        ) {

          logout(
            response
          );

          return;
        }


        if (
          caminho === "/login"
        ) {

          redirecionar(
            response,
            "/login.html"
          );

          return;
        }


        if (
          caminho === "/cadastro"
        ) {

          redirecionar(
            response,
            "/cadastro.html"
          );

          return;
        }


        if (
          caminho === "/"
        ) {

          const usuarioId =
            await usuarioIdDaRequisicao(
              request
            );


          if (!usuarioId) {

            redirecionar(
              response,
              "/login.html"
            );

            return;
          }

        }


        await servirArquivo(
          response,
          caminho
        );

      }
      catch (error) {

        console.error(
          error
        );


        json(
          response,
          500,
          {
            error:
              "Erro interno do servidor.",
          }
        );

      }

    }
  );


server.listen(
  PORT,
  function () {

    console.log(
      ""
    );

    console.log(
      "Jankinho Study - migraÃ§Ã£o"
    );

    console.log(
      "Backend TypeScript ativo:"
    );

    console.log(
      `http://localhost:${PORT}`
    );

    console.log(
      ""
    );

  }
);
