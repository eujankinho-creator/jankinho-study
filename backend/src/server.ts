import {
  createServer,
  IncomingMessage,
  ServerResponse,
} from "node:http";

import {
  readFile,
  stat,
} from "node:fs/promises";

import path from "node:path";

import bcrypt from "bcryptjs";

import {
  SignJWT,
  jwtVerify,
} from "jose";

import { prisma } from "../../lib/prisma";
import { buscarCasoDetalhe, investigarCasoClinico, avaliarHipoteseCaso, refazerCasoClinico } from "./casosDetalhe";
import { listarCasos, gerarCasoClinico } from "./casos";
import { listarFlashcards, criarFlashcard } from "./flashcards";
import { gerarQuestoesIA } from "./iaQuestoes";


const PORT =
  Number(process.env.PORT || 3001);

const COOKIE_NAME =
  "jankinho_session";

const FRONTEND_DIR =
  path.resolve(
    process.cwd(),
    "frontend"
  );


/* =========================================================
   RESPOSTAS HTTP
========================================================= */

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


function redirect(
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


/* =========================================================
   JSON BODY
========================================================= */

async function lerJson(
  request: IncomingMessage
) {
  return new Promise<any>(
    function (resolve, reject) {
      let corpo = "";

      request.on(
        "data",
        function (chunk) {
          corpo += chunk;

          if (
            corpo.length >
            1_000_000
          ) {
            reject(
              new Error(
                "Requisição muito grande."
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
                "JSON inválido."
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


/* =========================================================
   AUTENTICA��O
========================================================= */

function chaveJwt() {
  const segredo =
    process.env.AUTH_SECRET;

  if (!segredo) {
    throw new Error(
      "AUTH_SECRET não configurado."
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
  const cookies:
    Record<string, string> = {};

  const header =
    request.headers.cookie;

  if (!header) {
    return cookies;
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

    cookies[chave] =
      decodeURIComponent(valor);
  }

  return cookies;
}


async function usuarioIdDaRequisicao(
  request: IncomingMessage
) {
  try {
    const cookies =
      cookiesDaRequisicao(
        request
      );

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
      resultado.payload.usuarioId;

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


function cookieSessao(
  token: string
) {
  const seguro =
    process.env.NODE_ENV ===
    "production"
      ? "; Secure"
      : "";

  return (
    `${COOKIE_NAME}=` +
    `${encodeURIComponent(token)}; ` +
    `Path=/; ` +
    `HttpOnly; ` +
    `SameSite=Lax; ` +
    `Max-Age=604800` +
    seguro
  );
}


function cookieLogout() {
  const seguro =
    process.env.NODE_ENV ===
    "production"
      ? "; Secure"
      : "";

  return (
    `${COOKIE_NAME}=; ` +
    `Path=/; ` +
    `HttpOnly; ` +
    `SameSite=Lax; ` +
    `Max-Age=0` +
    seguro
  );
}


async function exigirUsuario(
  request: IncomingMessage,
  response: ServerResponse
) {
  const usuarioId =
    await usuarioIdDaRequisicao(
      request
    );

  if (!usuarioId) {
    json(
      response,
      401,
      {
        error:
          "Não autenticado.",
      }
    );

    return null;
  }

  return usuarioId;
}


/* =========================================================
   AUTH - LOGIN
========================================================= */

async function login(
  request: IncomingMessage,
  response: ServerResponse
) {
  try {
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
            "E-mail e senha são obrigatórios.",
        }
      );

      return;
    }

    const usuario =
      await prisma.usuario.findUnique({
        where: {
          email,
        },
      });

    if (
      !usuario ||
      !usuario.senhaHash
    ) {
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

    const token =
      await criarToken(
        usuario.id
      );

    response.setHeader(
      "Set-Cookie",
      cookieSessao(token)
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
      "Erro no login:",
      error
    );

    json(
      response,
      500,
      {
        error:
          "Não foi possível entrar.",
      }
    );
  }
}


/* =========================================================
   AUTH - CADASTRO
========================================================= */

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
            "Nome, e-mail e senha são obrigatórios.",
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
      await prisma.usuario.findUnique({
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
            "Este e-mail já está cadastrado.",
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
      await prisma.usuario.create({
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
      "Erro no cadastro:",
      error
    );

    json(
      response,
      500,
      {
        error:
          "Não foi possível criar o usuário.",
      }
    );
  }
}


/* =========================================================
   AUTH - ME
========================================================= */

async function me(
  request: IncomingMessage,
  response: ServerResponse
) {
  const usuarioId =
    await exigirUsuario(
      request,
      response
    );

  if (!usuarioId) {
    return;
  }

  try {
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
  catch (error) {
    console.error(
      "Erro ao buscar usuário:",
      error
    );

    json(
      response,
      500,
      {
        error:
          "Não foi possível verificar a sessão.",
      }
    );
  }
}


/* =========================================================
   DISCIPLINAS
========================================================= */

async function listarDisciplinas(
  request: IncomingMessage,
  response: ServerResponse
) {
  const usuarioId =
    await exigirUsuario(
      request,
      response
    );

  if (!usuarioId) {
    return;
  }

  try {
    const disciplinas =
      await prisma.disciplina.findMany({
        where: {
          usuarioId,
        },

        orderBy: {
          nome: "asc",
        },
      });

    json(
      response,
      200,
      disciplinas
    );
  }
  catch (error) {
    console.error(
      "Erro ao buscar disciplinas:",
      error
    );

    json(
      response,
      500,
      {
        error:
          "Não foi possível carregar as disciplinas.",
      }
    );
  }
}


async function criarDisciplina(
  request: IncomingMessage,
  response: ServerResponse
) {
  const usuarioId =
    await exigirUsuario(
      request,
      response
    );

  if (!usuarioId) {
    return;
  }

  try {
    const body =
      await lerJson(request);

    const nome =
      String(
        body.nome || ""
      ).trim();

    if (!nome) {
      json(
        response,
        400,
        {
          error:
            "O nome da disciplina é obrigatório.",
        }
      );

      return;
    }

    const existente =
      await prisma.disciplina.findFirst({
        where: {
          usuarioId,

          nome: {
            equals: nome,
            mode: "insensitive",
          },
        },
      });

    if (existente) {
      json(
        response,
        200,
        existente
      );

      return;
    }

    const disciplina =
      await prisma.disciplina.create({
        data: {
          nome,
          usuarioId,
        },
      });

    json(
      response,
      201,
      disciplina
    );
  }
  catch (error) {
    console.error(
      "Erro ao criar disciplina:",
      error
    );

    json(
      response,
      500,
      {
        error:
          "Não foi possível criar a disciplina.",
      }
    );
  }
}


/* =========================================================
   QUESTÕES
========================================================= */

async function listarQuestoes(
  request: IncomingMessage,
  response: ServerResponse
) {
  const usuarioId =
    await exigirUsuario(
      request,
      response
    );

  if (!usuarioId) {
    return;
  }

  try {
    const questoes =
      await prisma.questao.findMany({
        where: {
          usuarioId,
        },

        include: {
          disciplina: true,
          alternativas: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    json(
      response,
      200,
      questoes
    );
  }
  catch (error) {
    console.error(
      "Erro ao buscar questões:",
      error
    );

    json(
      response,
      500,
      {
        error:
          "Não foi possível buscar as questões.",
      }
    );
  }
}


async function criarQuestao(
  request: IncomingMessage,
  response: ServerResponse
) {
  const usuarioId =
    await exigirUsuario(
      request,
      response
    );

  if (!usuarioId) {
    return;
  }

  try {
    const body =
      await lerJson(request);

    const enunciado =
      String(
        body.enunciado || ""
      ).trim();

    const explicacao =
      body.explicacao
        ? String(
            body.explicacao
          ).trim()
        : null;

    const disciplinaId =
      Number(
        body.disciplinaId
      );

    const dificuldade =
      body.dificuldade
        ? String(
            body.dificuldade
          ).trim()
        : null;

    const tema =
      body.tema
        ? String(
            body.tema
          ).trim()
        : null;

    const alternativas =
      Array.isArray(
        body.alternativas
      )
        ? body.alternativas
        : [];

    if (!enunciado) {
      json(
        response,
        400,
        {
          error:
            "O enunciado é obrigatório.",
        }
      );

      return;
    }

    if (!disciplinaId) {
      json(
        response,
        400,
        {
          error:
            "A disciplina é obrigatória.",
        }
      );

      return;
    }

    if (
      alternativas.length < 2
    ) {
      json(
        response,
        400,
        {
          error:
            "A questão precisa ter pelo menos duas alternativas.",
        }
      );

      return;
    }

    const disciplina =
      await prisma.disciplina.findFirst({
        where: {
          id: disciplinaId,
          usuarioId,
        },
      });

    if (!disciplina) {
      json(
        response,
        404,
        {
          error:
            "Disciplina não encontrada.",
        }
      );

      return;
    }

    const questao =
      await prisma.questao.create({
        data: {
          enunciado,
          explicacao,
          dificuldade,
          tema,
          usuarioId,
          disciplinaId,

          alternativas: {
            create:
              alternativas.map(
                function (
                  alternativa: any
                ) {
                  return {
                    texto:
                      String(
                        alternativa.texto ||
                        ""
                      ).trim(),

                    correta:
                      Boolean(
                        alternativa.correta
                      ),
                  };
                }
              ),
          },
        },

        include: {
          disciplina: true,
          alternativas: true,
        },
      });

    json(
      response,
      201,
      questao
    );
  }
  catch (error) {
    console.error(
      "Erro ao criar questão:",
      error
    );

    json(
      response,
      500,
      {
        error:
          "Não foi possível criar a questão.",
      }
    );
  }
}


/* =========================================================
   RESPOSTAS
========================================================= */

async function listarRespostas(
  request: IncomingMessage,
  response: ServerResponse
) {
  const usuarioId =
    await exigirUsuario(
      request,
      response
    );

  if (!usuarioId) {
    return;
  }

  try {
    const respostas =
      await prisma.resposta.findMany({
        where: {
          usuarioId,
        },

        include: {
          questao: {
            include: {
              disciplina: true,
            },
          },
        },

        orderBy: {
          respondidaAt:
            "desc",
        },
      });

    json(
      response,
      200,
      respostas
    );
  }
  catch (error) {
    console.error(
      "Erro ao buscar respostas:",
      error
    );

    json(
      response,
      500,
      {
        error:
          "Não foi possível buscar as respostas.",
      }
    );
  }
}


async function criarResposta(
  request: IncomingMessage,
  response: ServerResponse
) {
  const usuarioId =
    await exigirUsuario(
      request,
      response
    );

  if (!usuarioId) {
    return;
  }

  try {
    const body =
      await lerJson(request);

    const questaoId =
      Number(
        body.questaoId
      );

    const correta =
      Boolean(
        body.correta
      );

    if (!questaoId) {
      json(
        response,
        400,
        {
          error:
            "A questão é obrigatória.",
        }
      );

      return;
    }

    const questao =
      await prisma.questao.findFirst({
        where: {
          id: questaoId,
          usuarioId,
        },
      });

    if (!questao) {
      json(
        response,
        404,
        {
          error:
            "Questão não encontrada.",
        }
      );

      return;
    }

    const respostaCriada =
      await prisma.resposta.create({
        data: {
          correta,
          usuarioId,
          questaoId,
        },
      });

    json(
      response,
      201,
      respostaCriada
    );
  }
  catch (error) {
    console.error(
      "Erro ao salvar resposta:",
      error
    );

    json(
      response,
      500,
      {
        error:
          "Não foi possível salvar a resposta.",
      }
    );
  }
}


/* =========================================================
   FINANCEIRO
========================================================= */

async function listarFinanceiro(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL
) {
  const usuarioId =
    await exigirUsuario(
      request,
      response
    );

  if (!usuarioId) {
    return;
  }

  try {
    const inicio =
      url.searchParams.get(
        "inicio"
      );

    const fim =
      url.searchParams.get(
        "fim"
      );

    const dataInicio =
      inicio
        ? new Date(
            inicio +
            "T00:00:00"
          )
        : undefined;

    const dataFim =
      fim
        ? new Date(
            fim +
            "T23:59:59"
          )
        : undefined;

    const movimentacoes =
      await prisma.movimentacao.findMany({
        where: {
          usuarioId,

          ...(dataInicio ||
          dataFim
            ? {
                data: {
                  ...(dataInicio
                    ? {
                        gte:
                          dataInicio,
                      }
                    : {}),

                  ...(dataFim
                    ? {
                        lte:
                          dataFim,
                      }
                    : {}),
                },
              }
            : {}),
        },

        orderBy: {
          data: "desc",
        },
      });

    let receitas = 0;
    let despesas = 0;

    for (
      const movimentacao
      of movimentacoes
    ) {
      const valor =
        Number(
          movimentacao.valor
        );

      if (
        movimentacao.tipo ===
        "RECEITA"
      ) {
        receitas += valor;
      }

      if (
        movimentacao.tipo ===
        "DESPESA"
      ) {
        despesas += valor;
      }
    }

    json(
      response,
      200,
      {
        movimentacoes:
          movimentacoes.map(
            function (
              movimentacao
            ) {
              return {
                id:
                  movimentacao.id,

                descricao:
                  movimentacao.descricao,

                valor:
                  Number(
                    movimentacao.valor
                  ),

                tipo:
                  movimentacao.tipo,

                data:
                  movimentacao.data,

                createdAt:
                  movimentacao.createdAt,
              };
            }
          ),

        resumo: {
          receitas,
          despesas,
          saldo:
            receitas -
            despesas,
        },
      }
    );
  }
  catch (error) {
    console.error(
      "Erro no financeiro:",
      error
    );

    json(
      response,
      500,
      {
        error:
          "Não foi possível carregar as movimentações.",
      }
    );
  }
}


async function criarMovimentacao(
  request: IncomingMessage,
  response: ServerResponse
) {
  const usuarioId =
    await exigirUsuario(
      request,
      response
    );

  if (!usuarioId) {
    return;
  }

  try {
    const body =
      await lerJson(request);

    const descricao =
      String(
        body.descricao || ""
      ).trim();

    const valor =
      Number(
        body.valor
      );

    const tipo =
      String(
        body.tipo || ""
      );

    const data =
      body.data
        ? new Date(
            body.data +
            "T12:00:00"
          )
        : new Date();

    if (!descricao) {
      json(
        response,
        400,
        {
          error:
            "A descrição é obrigatória.",
        }
      );

      return;
    }

    if (
      !Number.isFinite(valor) ||
      valor <= 0
    ) {
      json(
        response,
        400,
        {
          error:
            "Informe um valor válido.",
        }
      );

      return;
    }

    if (
      tipo !== "RECEITA" &&
      tipo !== "DESPESA"
    ) {
      json(
        response,
        400,
        {
          error:
            "Tipo de movimentação inválido.",
        }
      );

      return;
    }

    const movimentacao =
      await prisma.movimentacao.create({
        data: {
          descricao,
          valor,
          tipo: tipo as any,
          data,
          usuarioId,
        },
      });

    json(
      response,
      201,
      {
        sucesso: true,

        movimentacao: {
          id:
            movimentacao.id,

          descricao:
            movimentacao.descricao,

          valor:
            Number(
              movimentacao.valor
            ),

          tipo:
            movimentacao.tipo,

          data:
            movimentacao.data,

          createdAt:
            movimentacao.createdAt,
        },
      }
    );
  }
  catch (error) {
    console.error(
      "Erro ao criar movimentação:",
      error
    );

    json(
      response,
      500,
      {
        error:
          "Não foi possível criar a movimentação.",
      }
    );
  }
}


async function editarMovimentacao(
  request: IncomingMessage,
  response: ServerResponse
) {
  const usuarioId =
    await exigirUsuario(
      request,
      response
    );

  if (!usuarioId) {
    return;
  }

  try {
    const body =
      await lerJson(request);

    const id =
      Number(body.id);

    const descricao =
      String(
        body.descricao || ""
      ).trim();

    const valor =
      Number(
        body.valor
      );

    const tipo =
      String(
        body.tipo || ""
      );

    const data =
      body.data
        ? new Date(
            body.data +
            "T12:00:00"
          )
        : new Date();

    if (
      !Number.isInteger(id)
    ) {
      json(
        response,
        400,
        {
          error:
            "Movimentação inválida.",
        }
      );

      return;
    }

    const existente =
      await prisma.movimentacao.findFirst({
        where: {
          id,
          usuarioId,
        },
      });

    if (!existente) {
      json(
        response,
        404,
        {
          error:
            "Movimentação não encontrada.",
        }
      );

      return;
    }

    const movimentacao =
      await prisma.movimentacao.update({
        where: {
          id,
        },

        data: {
          descricao,
          valor,
          tipo: tipo as any,
          data,
        },
      });

    json(
      response,
      200,
      {
        sucesso: true,
        movimentacao,
      }
    );
  }
  catch (error) {
    console.error(
      "Erro ao editar movimentação:",
      error
    );

    json(
      response,
      500,
      {
        error:
          "Não foi possível editar a movimentação.",
      }
    );
  }
}


async function excluirMovimentacao(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL
) {
  const usuarioId =
    await exigirUsuario(
      request,
      response
    );

  if (!usuarioId) {
    return;
  }

  try {
    const id =
      Number(
        url.searchParams.get(
          "id"
        )
      );

    if (
      !Number.isInteger(id)
    ) {
      json(
        response,
        400,
        {
          error:
            "Movimentação inválida.",
        }
      );

      return;
    }

    const existente =
      await prisma.movimentacao.findFirst({
        where: {
          id,
          usuarioId,
        },
      });

    if (!existente) {
      json(
        response,
        404,
        {
          error:
            "Movimentação não encontrada.",
        }
      );

      return;
    }

    await prisma.movimentacao.delete({
      where: {
        id,
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
      "Erro ao excluir movimentação:",
      error
    );

    json(
      response,
      500,
      {
        error:
          "Não foi possível excluir a movimentação.",
      }
    );
  }
}


/* =========================================================
   ARQUIVOS DO FRONTEND
========================================================= */

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

      ".svg":
        "image/svg+xml",

      ".png":
        "image/png",

      ".jpg":
        "image/jpeg",

      ".jpeg":
        "image/jpeg",

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
  caminho: string
) {
  let caminhoRelativo =
    caminho;

  if (
    caminhoRelativo === "/"
  ) {
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
        error:
          "Acesso negado.",
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
      await readFile(
        arquivo
      );

    response.writeHead(
      200,
      {
        "Content-Type":
          contentType(
            arquivo
          ),

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
          "Página não encontrada.",
      }
    );
  }
}


/* =========================================================
   SERVER
========================================================= */

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


        /* HEALTH */

        if (
          caminho === "/health"
        ) {
          json(
            response,
            200,
            {
              status: "ok",
              backend:
                "typescript",
            }
          );

          return;
        }


        /* AUTH */

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
          response.setHeader(
            "Set-Cookie",
            cookieLogout()
          );

          json(
            response,
            200,
            {
              sucesso: true,
            }
          );

          return;
        }


        /* IA QUESTOES */

        if (
          caminho ===
            "/api/ia/gerar-questoes" &&
          metodo === "POST"
        ) {

          const usuarioId =
            await exigirUsuario(
              request,
              response
            );

          if (!usuarioId) {
            return;
          }

          const body =
            await lerJson(
              request
            );

          const resultado =
            await gerarQuestoesIA(
              usuarioId,
              body
            );

          json(
            response,
            resultado.status,
            resultado.data
          );

          return;
        }



        /* FLASHCARDS */

        if (
          caminho ===
          "/api/flashcards"
        ) {

          const usuarioId =
            await exigirUsuario(
              request,
              response
            );

          if (!usuarioId) {
            return;
          }


          if (
            metodo === "GET"
          ) {

            const resultado =
              await listarFlashcards(
                usuarioId
              );


            json(
              response,
              resultado.status,
              resultado.data
            );

            return;
          }


          if (
            metodo === "POST"
          ) {

            const body =
              await lerJson(
                request
              );


            const resultado =
              await criarFlashcard(
                usuarioId,
                body
              );


            json(
              response,
              resultado.status,
              resultado.data
            );

            return;
          }
        }


        /* CASOS */

        if (
          caminho ===
            "/api/casos" &&
          metodo === "GET"
        ) {

          const usuarioId =
            await exigirUsuario(
              request,
              response
            );

          if (!usuarioId) {
            return;
          }


          const resultado =
            await listarCasos(
              usuarioId
            );


          json(
            response,
            resultado.status,
            resultado.data
          );

          return;
        }


        if (
          caminho ===
            "/api/ia/gerar-caso" &&
          metodo === "POST"
        ) {

          const usuarioId =
            await exigirUsuario(
              request,
              response
            );

          if (!usuarioId) {
            return;
          }


          const body =
            await lerJson(
              request
            );


          const resultado =
            await gerarCasoClinico(
              usuarioId,
              body
            );


          json(
            response,
            resultado.status,
            resultado.data
          );

          return;
        }


        /* CASO CLINICO INDIVIDUAL */

        const matchCasoDetalhe =
          caminho.match(
            /^\/api\/casos\/(\d+)$/
          );


        if (
          matchCasoDetalhe &&
          metodo === "GET"
        ) {

          const usuarioId =
            await exigirUsuario(
              request,
              response
            );

          if (!usuarioId) {
            return;
          }


          const resultado =
            await buscarCasoDetalhe(
              usuarioId,
              Number(
                matchCasoDetalhe[1]
              )
            );


          json(
            response,
            resultado.status,
            resultado.data
          );

          return;
        }


        const matchInvestigar =
          caminho.match(
            /^\/api\/casos\/(\d+)\/investigar$/
          );


        if (
          matchInvestigar &&
          metodo === "POST"
        ) {

          const usuarioId =
            await exigirUsuario(
              request,
              response
            );

          if (!usuarioId) {
            return;
          }


          const body =
            await lerJson(
              request
            );


          const resultado =
            await investigarCasoClinico(
              usuarioId,
              Number(
                matchInvestigar[1]
              ),
              body
            );


          json(
            response,
            resultado.status,
            resultado.data
          );

          return;
        }


        const matchHipotese =
          caminho.match(
            /^\/api\/casos\/(\d+)\/hipotese$/
          );


        if (
          matchHipotese &&
          metodo === "POST"
        ) {

          const usuarioId =
            await exigirUsuario(
              request,
              response
            );

          if (!usuarioId) {
            return;
          }


          const body =
            await lerJson(
              request
            );


          const resultado =
            await avaliarHipoteseCaso(
              usuarioId,
              Number(
                matchHipotese[1]
              ),
              body
            );


          json(
            response,
            resultado.status,
            resultado.data
          );

          return;
        }


        const matchRefazer =
          caminho.match(
            /^\/api\/casos\/(\d+)\/refazer$/
          );


        if (
          matchRefazer &&
          metodo === "POST"
        ) {

          const usuarioId =
            await exigirUsuario(
              request,
              response
            );

          if (!usuarioId) {
            return;
          }


          const resultado =
            await refazerCasoClinico(
              usuarioId,
              Number(
                matchRefazer[1]
              )
            );


          json(
            response,
            resultado.status,
            resultado.data
          );

          return;
        }

        /* DISCIPLINAS */

        if (
          caminho ===
          "/api/disciplinas"
        ) {
          if (
            metodo === "GET"
          ) {
            await listarDisciplinas(
              request,
              response
            );

            return;
          }

          if (
            metodo === "POST"
          ) {
            await criarDisciplina(
              request,
              response
            );

            return;
          }
        }


        /* QUESTÕES */

        if (
          caminho ===
          "/api/questoes"
        ) {
          if (
            metodo === "GET"
          ) {
            await listarQuestoes(
              request,
              response
            );

            return;
          }

          if (
            metodo === "POST"
          ) {
            await criarQuestao(
              request,
              response
            );

            return;
          }
        }


        /* RESPOSTAS */

        if (
          caminho ===
          "/api/respostas"
        ) {
          if (
            metodo === "GET"
          ) {
            await listarRespostas(
              request,
              response
            );

            return;
          }

          if (
            metodo === "POST"
          ) {
            await criarResposta(
              request,
              response
            );

            return;
          }
        }


        /* FINANCEIRO */

        if (
          caminho ===
          "/api/financeiro"
        ) {
          if (
            metodo === "GET"
          ) {
            await listarFinanceiro(
              request,
              response,
              url
            );

            return;
          }

          if (
            metodo === "POST"
          ) {
            await criarMovimentacao(
              request,
              response
            );

            return;
          }

          if (
            metodo === "PUT"
          ) {
            await editarMovimentacao(
              request,
              response
            );

            return;
          }

          if (
            metodo === "DELETE"
          ) {
            await excluirMovimentacao(
              request,
              response,
              url
            );

            return;
          }
        }


        /* ALIASES */

        if (
          caminho === "/login"
        ) {
          redirect(
            response,
            "/login.html"
          );

          return;
        }


        if (
          caminho === "/cadastro"
        ) {
          redirect(
            response,
            "/cadastro.html"
          );

          return;
        }


        /* PROTE��O DA HOME */

        if (
          caminho === "/"
        ) {
          const usuarioId =
            await usuarioIdDaRequisicao(
              request
            );

          if (!usuarioId) {
            redirect(
              response,
              "/login.html"
            );

            return;
          }
        }


        /* FRONTEND */

        if (
          caminho ===
          "/questoes"
        ) {

          redirect(
            response,
            "/questoes.html"
          );

          return;
        }



        if (
          caminho ===
          "/flashcards"
        ) {

          redirect(
            response,
            "/flashcards.html"
          );

          return;
        }


        if (
          caminho ===
          "/financas"
        ) {

          redirect(
            response,
            "/financas.html"
          );

          return;
        }


        if (
          caminho ===
          "/casos"
        ) {

          redirect(
            response,
            "/casos.html"
          );

          return;
        }


        const matchCasoPagina =
          caminho.match(
            /^\/casos\/(\d+)$/
          );


        if (
          matchCasoPagina &&
          metodo === "GET"
        ) {

          redirect(
            response,
            "/caso.html?id=" +
            matchCasoPagina[1]
          );

          return;
        }


        if (
          caminho ===
            "/laboratorio" &&
          metodo === "GET"
        ) {

          redirect(
            response,
            "/laboratorio.html"
          );

          return;
        }


        if (
          caminho === "/evolucao" &&
          metodo === "GET"
        ) {

          redirect(
            response,
            "/evolucao.html"
          );

          return;
        }

        await servirArquivo(
          response,
          caminho
        );
      }
      catch (error) {
        console.error(
          "Erro interno:",
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


server.on(
  "error",
  function (error: any) {
    if (
      error.code ===
      "EADDRINUSE"
    ) {
      console.error(
        ""
      );

      console.error(
        `A porta ${PORT} já está em uso.`
      );

      console.error(
        "Feche o servidor anterior e tente novamente."
      );

      console.error(
        ""
      );

      return;
    }

    console.error(
      error
    );
  }
);


server.listen(
  PORT,
  function () {
    console.log("");
    console.log(
      "======================================"
    );
    console.log(
      " JANKINHO STUDY"
    );
    console.log(
      " Backend TypeScript"
    );
    console.log(
      "======================================"
    );
    console.log("");
    console.log(
      `http://localhost:${PORT}`
    );
    console.log("");
    console.log(
      "APIs ativas:"
    );
    console.log(
      "  /api/auth/*"
    );
    console.log(
      "  /api/disciplinas"
    );
    console.log(
      "  /api/questoes"
    );
    console.log(
      "  /api/respostas"
    );
    console.log(
      "  /api/financeiro"
    );
    console.log("");
  }
);
