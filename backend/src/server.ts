import {
  obterConfiguracoes,
  atualizarPerfil,
  atualizarSenha,
  atualizarTema,
} from "./configuracoes";
import { atenderRanking } from "./ranking";
import { atenderDesempenho } from "./desempenho";
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

import {
  brotliCompressSync,
  constants as zlibConstants,
} from "node:zlib";

import bcrypt from "bcryptjs";

import {
  SignJWT,
  jwtVerify,
} from "jose";

import { prisma } from "../../lib/prisma";
import { buscarCasoDetalhe, investigarCasoClinico, avaliarHipoteseCaso, refazerCasoClinico } from "./casosDetalhe";
import { listarCasos, gerarCasoClinico } from "./casos";
import { sincronizarCasosFaculdade } from "./casosFaculdade";
import { listarFlashcards, criarFlashcard } from "./flashcards";
import { limparFlashcardsParaMetodologia } from "./flashcardsMetodologia";
import { gerarQuestoesIA } from "./iaQuestoes";
import { sincronizarQuestoesFarmacocineticaHaggi } from "./questoesFarmacocinetica";
import { sincronizarQuestoesDiego } from "./questoesDiego";
import { sincronizarQuestoesSemiotecnica } from "./questoesSemiotecnica";
import { sincronizarQuestoesCalculoMedicamentos } from "./questoesCalculoMedicamentos";
import { sincronizarQuestoesLaboratorioEcg } from "./questoesLaboratorioEcg";
import { sincronizarQuestoesConcursosPublicos } from "./questoesConcursosPublicos";
import { sincronizarQuestoesResidenciasFederais } from "./questoesResidenciasFederais";
import { sincronizarQuestoesEnareEbserh500 } from "./questoesEnareEbserh500";
import { sincronizarQuestoesSusLegislacao200 } from "./questoesSusLegislacao200";
import { resetAllPerformanceIfRequested } from "./resetPerformance";
import {
  iniciarSpotifyAuth,
  concluirSpotifyAuth,
  statusSpotify,
  tokenSpotify,
  buscarSpotify,
  tocarSpotify,
  desconectarSpotify,
} from "./spotify";

import {
  connectSigaa,
  sigaaStatus,
  sigaaOverview,
  sigaaCourseDetail,
  downloadSigaaCourseFile,
  disconnectSigaa,
} from "./sigaa";


const PORT =
  Number(process.env.PORT || 3002);

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
          tema:
            usuario.tema ||
            "dark-orange",
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
          tema: true,
          fotoPerfil: true,
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
    const fonte =
      String(
        url.searchParams.get("fonte") ||
        ""
      ).trim();

    const banca =
      String(
        url.searchParams.get("banca") ||
        ""
      ).trim();

    const anoRaw =
      String(
        url.searchParams.get("ano") ||
        ""
      ).trim();

    const orgao =
      String(
        url.searchParams.get("orgao") ||
        ""
      ).trim();

    const cargo =
      String(
        url.searchParams.get("cargo") ||
        ""
      ).trim();

    const disciplina =
      String(
        url.searchParams.get("disciplina") ||
        ""
      ).trim();

    const assunto =
      String(
        url.searchParams.get("assunto") ||
        ""
      ).trim();

    const ano =
      Number(anoRaw);

    const where:
      any = {};

    if (fonte) {
      where.fonte = {
        startsWith:
          fonte,
        mode:
          "insensitive",
      };
    }

    if (banca) {
      where.banca = {
        equals:
          banca,
        mode:
          "insensitive",
      };
    }

    if (
      anoRaw &&
      Number.isFinite(ano)
    ) {
      where.ano =
        ano;
    }

    if (orgao) {
      where.orgao = {
        equals:
          orgao,
        mode:
          "insensitive",
      };
    }

    if (cargo) {
      where.cargo = {
        equals:
          cargo,
        mode:
          "insensitive",
      };
    }

    if (assunto) {
      where.tema = {
        equals:
          assunto,
        mode:
          "insensitive",
      };
    }

    if (disciplina) {
      where.disciplina = {
        nome: {
          equals:
            disciplina,
          mode:
            "insensitive",
        },
      };
    }

    const questoes =
      await prisma.questao.findMany({
        where,

        include: {
          disciplina: true,
          alternativas: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    const publicas =
      questoes.map(
        function (
          questao
        ) {

          return {
            ...questao,

            imagemUrl:
              questao.imagemUrl &&
              questao.imagemUrl
                .startsWith(
                  "data:image/"
                )
                ? (
                    "/api/questoes/" +
                    questao.id +
                    "/imagem"
                  )
                : questao.imagemUrl,
          };

        }
      );


    json(
      response,
      200,
      publicas
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


async function servirImagemQuestao(
  request: IncomingMessage,
  response: ServerResponse,
  questaoId: number
) {

  const usuarioId =
    await exigirUsuario(
      request,
      response
    );


  if (!usuarioId) {
    return;
  }


  const questao =
    await prisma
      .questao
      .findUnique({
        where: {
          id:
            questaoId,
        },

        select: {
          imagemUrl:
            true,

          imagemAlt:
            true,
        },
      });


  if (
    !questao ||
    !questao.imagemUrl ||
    !questao.imagemUrl
      .startsWith(
        "data:image/"
      )
  ) {

    json(
      response,
      404,
      {
        error:
          "Imagem da questão não encontrada.",
      }
    );

    return;

  }


  const match =
    questao.imagemUrl
      .match(
        /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
      );


  if (!match) {

    json(
      response,
      415,
      {
        error:
          "Formato de imagem inválido.",
      }
    );

    return;

  }


  const buffer =
    Buffer.from(
      match[2],
      "base64"
    );


  response.writeHead(
    200,
    {
      "Content-Type":
        match[1],

      "Content-Length":
        String(
          buffer.length
        ),

      "Cache-Control":
        "private, max-age=86400",

      "Content-Disposition":
        "inline",
    }
  );


  response.end(
    buffer
  );

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


    const fonte =
      body.fonte
        ? String(
            body.fonte
          ).trim()
        : null;


    const fonteUrl =
      body.fonteUrl
        ? String(
            body.fonteUrl
          ).trim()
        : null;


    const imagemUrl =
      body.imagemUrl
        ? String(
            body.imagemUrl
          ).trim()
        : null;


    const imagemAlt =
      body.imagemAlt
        ? String(
            body.imagemAlt
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
          fonte,
          fonteUrl,
          imagemUrl,
          imagemAlt,
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


async function importarQuestoesInternas(
  request: IncomingMessage,
  response: ServerResponse
) {
  const chaveEsperada =
    process.env.QUESTION_IMPORT_SECRET;

  const chaveRecebida =
    request.headers["x-import-key"];

  if (
    !chaveEsperada ||
    typeof chaveRecebida !== "string" ||
    chaveRecebida !== chaveEsperada
  ) {
    json(
      response,
      401,
      {
        error:
          "Importação não autorizada.",
      }
    );

    return;
  }

  try {
    const body =
      await lerJson(request);

    const usuarioId =
      Number(body.usuarioId);

    const itens =
      Array.isArray(body.questoes)
        ? body.questoes
        : [];

    if (
      !usuarioId ||
      itens.length === 0
    ) {
      json(
        response,
        400,
        {
          error:
            "usuarioId e questoes são obrigatórios.",
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
        },
      });

    if (!usuario) {
      json(
        response,
        404,
        {
          error:
            "Usuário de importação não encontrado.",
        }
      );

      return;
    }

    let importadas = 0;
    let duplicadas = 0;

    const erros: Array<{
      origemId: string | null;
      erro: string;
    }> = [];

    for (const item of itens) {
      const fonte =
        String(
          item.fonte ||
          "romulo-passos"
        ).trim();

      const origemId =
        String(
          item.origemId || ""
        ).trim();

      const enunciado =
        String(
          item.enunciado || ""
        ).trim();

      const disciplinaNome =
        String(
          item.disciplina || ""
        ).trim();

      const alternativas =
        Array.isArray(
          item.alternativas
        )
          ? item.alternativas
          : [];

      if (
        !origemId ||
        !enunciado ||
        !disciplinaNome ||
        alternativas.length < 2
      ) {
        erros.push({
          origemId:
            origemId || null,
          erro:
            "Questão incompleta.",
        });

        continue;
      }

      const existente =
        await prisma.questao.findFirst({
          where: {
            usuarioId,
            fonte,
            origemId,
          },
          select: {
            id: true,
          },
        });

      if (existente) {
        duplicadas += 1;
        continue;
      }

      let disciplina =
        await prisma.disciplina.findFirst({
          where: {
            usuarioId,
            nome: {
              equals:
                disciplinaNome,
              mode:
                "insensitive",
            },
          },
        });

      if (!disciplina) {
        disciplina =
          await prisma.disciplina.create({
            data: {
              nome:
                disciplinaNome,
              usuarioId,
            },
          });
      }

      try {
        await prisma.questao.create({
          data: {
            enunciado,
            explicacao:
              item.explicacao
                ? String(
                    item.explicacao
                  ).trim()
                : null,
            dificuldade:
              item.dificuldade
                ? String(
                    item.dificuldade
                  ).trim()
                : null,
            tema:
              item.assunto
                ? String(
                    item.assunto
                  ).trim()
                : null,
            fonte,
            origemId,
            banca:
              item.banca
                ? String(
                    item.banca
                  ).trim()
                : null,
            ano:
              Number.isFinite(
                Number(item.ano)
              )
                ? Number(item.ano)
                : null,
            cargo:
              item.cargo
                ? String(
                    item.cargo
                  ).trim()
                : null,
            orgao:
              item.orgao
                ? String(
                    item.orgao
                  ).trim()
                : null,
            fonteUrl:
              item.fonteUrl
                ? String(
                    item.fonteUrl
                  ).trim()
                : null,
            imagemUrl:
              item.imagemUrl
                ? String(
                    item.imagemUrl
                  ).trim()
                : null,
            imagemAlt:
              item.imagemAlt
                ? String(
                    item.imagemAlt
                  ).trim()
                : null,
            usuarioId,
            disciplinaId:
              disciplina.id,

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
        });

        importadas += 1;
      }
      catch (error: any) {
        if (
          String(
            error?.code || ""
          ) === "P2002"
        ) {
          duplicadas += 1;
          continue;
        }

        erros.push({
          origemId,
          erro:
            "Falha ao salvar a questão.",
        });
      }
    }

    json(
      response,
      200,
      {
        sucesso: true,
        totalRecebidas:
          itens.length,
        importadas,
        duplicadas,
        erros,
      }
    );
  }
  catch (error) {
    console.error(
      "Erro na importação de questões:",
      error
    );

    json(
      response,
      500,
      {
        error:
          "Não foi possível importar as questões.",
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


async function criarRespostasEmLote(
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
      await lerJson(
        request
      );


    const recebidas =
      Array.isArray(
        body.respostas
      )
        ? body.respostas
        : [];


    if (
      recebidas.length ===
        0
    ) {

      json(
        response,
        400,
        {
          error:
            "Nenhuma resposta foi enviada.",
        }
      );

      return;

    }


    if (
      recebidas.length >
        200
    ) {

      json(
        response,
        400,
        {
          error:
            "Limite de 200 respostas por envio.",
        }
      );

      return;

    }


    type RespostaLote = {
      questaoId: number;
      correta: boolean;
    };


    const respostas:
      RespostaLote[] =
      (
        recebidas as any[]
      )
        .map(
          function (
            item:
              any
          ) {

            return {
              questaoId:
                Number(
                  item?.questaoId
                ),

              correta:
                Boolean(
                  item?.correta
                ),
            };

          }
        )
        .filter(
          function (
            item:
              RespostaLote
          ) {

            return (
              Number.isInteger(
                item.questaoId
              ) &&
              item.questaoId >
                0
            );

          }
        );


    if (
      respostas.length !==
        recebidas.length
    ) {

      json(
        response,
        400,
        {
          error:
            "Ha respostas com questao invalida.",
        }
      );

      return;

    }


    const ids:
      number[] =
      Array.from(
        new Set<number>(
          respostas.map(
            function (
              item:
                RespostaLote
            ) {

              return item
                .questaoId;

            }
          )
        )
      );


    const questoes =
      await prisma
        .questao
        .findMany({
          where: {
            id: {
              in:
                ids,
            },
          },

          select: {
            id:
              true,
          },
        });


    if (
      questoes.length !==
        ids.length
    ) {

      json(
        response,
        404,
        {
          error:
            "Uma ou mais questoes do simulado nao existem mais.",
        }
      );

      return;

    }


    const resultado =
      await prisma
        .resposta
        .createMany({
          data:
            respostas.map(
              function (
                item:
                  RespostaLote
              ) {

                return {
                  usuarioId,

                  questaoId:
                    item.questaoId,

                  correta:
                    item.correta,
                };

              }
            ),
        });


    json(
      response,
      201,
      {
        registradas:
          resultado.count,
      }
    );

  }
  catch (
    error
  ) {

    console.error(
      "Erro ao salvar respostas do simulado:",
      error
    );


    json(
      response,
      500,
      {
        error:
          "Nao foi possivel registrar o desempenho do simulado.",
      }
    );

  }

}


/* =========================================================
   FINANCEIRO
========================================================= */

async function obterUsuarioIdsFinanceiros(
  usuarioId: number
) {
  const usuario =
    await prisma.usuario.findUnique({
      where: {
        id: usuarioId
      },
      select: {
        id: true,
        nome: true
      }
    });

  if (!usuario) {
    return [usuarioId];
  }

  const nome =
    usuario.nome
      .trim()
      .toLocaleLowerCase("pt-BR");

  const ehPedroOuBeatriz =
    nome === "pedro" ||
    nome.startsWith("pedro ") ||
    nome === "beatriz" ||
    nome.startsWith("beatriz ");

  if (!ehPedroOuBeatriz) {
    return [usuarioId];
  }

  const casal =
    await prisma.usuario.findMany({
      where: {
        OR: [
          { nome: { equals: "Pedro", mode: "insensitive" } },
          { nome: { startsWith: "Pedro ", mode: "insensitive" } },
          { nome: { equals: "Beatriz", mode: "insensitive" } },
          { nome: { startsWith: "Beatriz ", mode: "insensitive" } }
        ]
      },
      select: {
        id: true
      }
    });

  const ids =
    casal.map(
      function (item) {
        return item.id;
      }
    );

  return ids.includes(usuarioId)
    ? ids
    : [usuarioId];
}

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

          usuarioId: {
            in: await obterUsuarioIdsFinanceiros(usuarioId)
          },

          ...(dataInicio ||
          dataFim
            ? {

                data: {

                  ...(dataInicio
                    ? {
                        gte:
                          dataInicio
                      }
                    : {}),

                  ...(dataFim
                    ? {
                        lte:
                          dataFim
                      }
                    : {})

                }

              }
            : {})

        },

        orderBy: [
          {
            data:
              "desc"
          },
          {
            createdAt:
              "desc"
          },
          {
            id:
              "desc"
          }
        ]

      });


    let receitas =
      0;

    let despesas =
      0;

    let dividas =
      0;


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

        receitas +=
          valor;

      }


      if (
        movimentacao.tipo ===
        "DESPESA"
      ) {

        despesas +=
          valor;

      }


      if (
        movimentacao.tipo ===
        "DIVIDA"
      ) {

        if (
          movimentacao.quitada
        ) {

          /*
           * A divida quitada deixa de ser
           * compromisso pendente e passa
           * a representar dinheiro gasto.
           */
          despesas +=
            valor;

        }
        else {

          dividas +=
            valor;

        }

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

                quitada:
                  movimentacao.quitada,

                quitadaEm:
                  movimentacao.quitadaEm,

                createdAt:
                  movimentacao.createdAt

              };

            }
          ),

        resumo: {

          receitas,

          despesas,

          dividas,

          saldo:
            receitas -
            despesas

        }

      }
    );

  }
  catch (
    error
  ) {

    console.error(
      "Erro no financeiro:",
      error
    );


    json(
      response,
      500,
      {
        error:
          "Nao foi possivel carregar as movimentacoes."
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
      await lerJson(
        request
      );


    const descricao =
      String(
        body.descricao ||
        ""
      ).trim();


    const valor =
      Number(
        body.valor
      );


    const tipo =
      String(
        body.tipo ||
        ""
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
            "A descricao e obrigatoria."
        }
      );

      return;

    }


    if (
      !Number.isFinite(
        valor
      ) ||
      valor <=
      0
    ) {

      json(
        response,
        400,
        {
          error:
            "Informe um valor valido."
        }
      );

      return;

    }


    if (
      tipo !==
        "RECEITA" &&
      tipo !==
        "DESPESA" &&
      tipo !==
        "DIVIDA"
    ) {

      json(
        response,
        400,
        {
          error:
            "Tipo de movimentacao invalido."
        }
      );

      return;

    }


    const movimentacao =
      await prisma
        .movimentacao
        .create({

          data: {

            descricao,

            valor,

            tipo:
              tipo as any,

            data,

            quitada:
              false,

            quitadaEm:
              null,

            usuarioId

          }

        });


    json(
      response,
      201,
      {

        sucesso:
          true,

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

          quitada:
            movimentacao.quitada,

          quitadaEm:
            movimentacao.quitadaEm

        }

      }
    );

  }
  catch (
    error
  ) {

    console.error(
      "Erro ao criar movimentacao:",
      error
    );


    json(
      response,
      500,
      {
        error:
          "Nao foi possivel criar a movimentacao."
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
      await lerJson(
        request
      );


    const id =
      Number(
        body.id
      );


    const descricao =
      String(
        body.descricao ||
        ""
      ).trim();


    const valor =
      Number(
        body.valor
      );


    const tipo =
      String(
        body.tipo ||
        ""
      );


    const data =
      body.data
        ? new Date(
            body.data +
            "T12:00:00"
          )
        : new Date();


    if (
      !Number.isInteger(
        id
      )
    ) {

      json(
        response,
        400,
        {
          error:
            "Movimentacao invalida."
        }
      );

      return;

    }


    if (
      !descricao ||
      !Number.isFinite(
        valor
      ) ||
      valor <=
      0
    ) {

      json(
        response,
        400,
        {
          error:
            "Dados financeiros invalidos."
        }
      );

      return;

    }


    if (
      tipo !==
        "RECEITA" &&
      tipo !==
        "DESPESA" &&
      tipo !==
        "DIVIDA"
    ) {

      json(
        response,
        400,
        {
          error:
            "Tipo de movimentacao invalido."
        }
      );

      return;

    }


    const existente =
      await prisma
        .movimentacao
        .findFirst({

          where: {
            id,
            usuarioId: {
              in: await obterUsuarioIdsFinanceiros(usuarioId)
            }
          }

        });


    if (!existente) {

      json(
        response,
        404,
        {
          error:
            "Movimentacao nao encontrada."
        }
      );

      return;

    }


    const continuaDivida =
      tipo ===
      "DIVIDA";


    const movimentacao =
      await prisma
        .movimentacao
        .update({

          where: {
            id
          },

          data: {

            descricao,

            valor,

            tipo:
              tipo as any,

            data,

            quitada:
              continuaDivida
                ? existente.quitada
                : false,

            quitadaEm:
              continuaDivida
                ? existente.quitadaEm
                : null

          }

        });


    json(
      response,
      200,
      {
        sucesso:
          true,

        movimentacao
      }
    );

  }
  catch (
    error
  ) {

    console.error(
      "Erro ao editar movimentacao:",
      error
    );


    json(
      response,
      500,
      {
        error:
          "Nao foi possivel editar a movimentacao."
      }
    );

  }

}

async function quitarDivida(
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
      await lerJson(
        request
      );


    const id =
      Number(
        body.id
      );


    if (
      !Number.isInteger(
        id
      )
    ) {

      json(
        response,
        400,
        {
          error:
            "Divida invalida."
        }
      );

      return;

    }


    const existente =
      await prisma
        .movimentacao
        .findFirst({

          where: {
            id,
            usuarioId: {
              in: await obterUsuarioIdsFinanceiros(usuarioId)
            },
            tipo:
              "DIVIDA"
          }

        });


    if (!existente) {

      json(
        response,
        404,
        {
          error:
            "Divida nao encontrada."
        }
      );

      return;

    }


    if (
      existente.quitada
    ) {

      json(
        response,
        200,
        {
          sucesso:
            true
        }
      );

      return;

    }


    const movimentacao =
      await prisma
        .movimentacao
        .update({

          where: {
            id
          },

          data: {

            quitada:
              true,

            quitadaEm:
              new Date()

          }

        });


    json(
      response,
      200,
      {

        sucesso:
          true,

        movimentacao: {

          id:
            movimentacao.id,

          quitada:
            movimentacao.quitada,

          quitadaEm:
            movimentacao.quitadaEm

        }

      }
    );

  }
  catch (
    error
  ) {

    console.error(
      "Erro ao quitar divida:",
      error
    );


    json(
      response,
      500,
      {
        error:
          "Nao foi possivel quitar a divida."
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
          usuarioId: {
            in: await obterUsuarioIdsFinanceiros(usuarioId)
          },
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

type StaticFileCacheEntry = {
  content: Buffer;
  brotli: Buffer | null;
  etag: string;
  extensao: string;
  contentType: string;
};


const staticFileCache =
  new Map<
    string,
    StaticFileCacheEntry
  >();


function compressibleExtension(
  extensao: string
) {

  return [
    ".html",
    ".css",
    ".js",
    ".json",
    ".svg",
  ].includes(
    extensao
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

      ".glb":
        "model/gltf-binary",

      ".gltf":
        "model/gltf+json",

      ".wasm":
        "application/wasm",
    };

  return (
    tipos[extensao] ||
    "application/octet-stream"
  );
}


async function servirArquivo(
  request: IncomingMessage,
  response: ServerResponse,
  caminho: string,
  versionado: boolean
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
    let cached =
      staticFileCache.get(
        arquivo
      );


    if (!cached) {

      const info =
        await stat(
          arquivo
        );


      if (!info.isFile()) {
        throw new Error();
      }


      const extensao =
        path.extname(
          arquivo
        ).toLowerCase();


      const content =
        await readFile(
          arquivo
        );


      const etag =
        'W/"' +
        String(
          info.size
        ) +
        "-" +
        String(
          Math.trunc(
            info.mtimeMs
          )
        ) +
        '"';


      let brotli:
        Buffer | null =
        null;


      if (
        content.length >
          1024 &&
        compressibleExtension(
          extensao
        )
      ) {

        try {

          brotli =
            brotliCompressSync(
              content,
              {
                params: {
                  [zlibConstants
                    .BROTLI_PARAM_QUALITY]:
                    4,
                },
              }
            );

        }
        catch {

          brotli =
            null;

        }

      }


      cached = {
        content,
        brotli,
        etag,
        extensao,
        contentType:
          contentType(
            arquivo
          ),
      };


      staticFileCache.set(
        arquivo,
        cached
      );

    }


    const cacheControl =
      cached.extensao ===
        ".html"
        ? "private, max-age=30, stale-while-revalidate=120"
        : versionado
          ? "public, max-age=31536000, immutable"
          : "private, max-age=60, must-revalidate";


    if (
      request.headers[
        "if-none-match"
      ] ===
        cached.etag
    ) {

      response.writeHead(
        304,
        {
          "ETag":
            cached.etag,

          "Cache-Control":
            cacheControl,

          "Vary":
            "Accept-Encoding",
        }
      );


      response.end();

      return;
    }


    const acceptEncoding =
      String(
        request.headers[
          "accept-encoding"
        ] ||
        ""
      );


    const useBrotli =
      Boolean(
        cached.brotli &&
        /(^|[,\s])br([,\s]|$)/
          .test(
            acceptEncoding
          )
      );


    const payload =
      useBrotli &&
      cached.brotli
        ? cached.brotli
        : cached.content;


    const headers:
      Record<
        string,
        string | number
      > = {

      "Content-Type":
        cached.contentType,

      "Content-Length":
        payload.length,

      "ETag":
        cached.etag,

      "Cache-Control":
        cacheControl,

      "Vary":
        "Accept-Encoding",
    };


    if (useBrotli) {

      headers[
        "Content-Encoding"
      ] =
        "br";

    }


    response.writeHead(
      200,
      headers
    );


    response.end(
      payload
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



        /* SPOTIFY */

        if (
          caminho ===
            "/api/spotify/login" &&
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

          await iniciarSpotifyAuth(
            response
          );

          return;
        }


        if (
          caminho ===
            "/api/spotify/callback" &&
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

          await concluirSpotifyAuth(
            request,
            response,
            url
          );

          return;
        }


        if (
          caminho ===
            "/api/spotify/status" &&
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

          await statusSpotify(
            request,
            response
          );

          return;
        }


        if (
          caminho ===
            "/api/spotify/token" &&
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

          await tokenSpotify(
            request,
            response
          );

          return;
        }


        if (
          caminho ===
            "/api/spotify/search" &&
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

          await buscarSpotify(
            request,
            response,
            url
          );

          return;
        }


        if (
          caminho ===
            "/api/spotify/play" &&
          metodo === "PUT"
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

          await tocarSpotify(
            request,
            response,
            body
          );

          return;
        }


        if (
          caminho ===
            "/api/spotify/disconnect" &&
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

          await desconectarSpotify(
            response
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

        const matchQuestaoImagem =
          caminho.match(
            /^\/api\/questoes\/(\d+)\/imagem$/
          );


        if (
          matchQuestaoImagem &&
          metodo ===
            "GET"
        ) {

          await servirImagemQuestao(
            request,
            response,
            Number(
              matchQuestaoImagem[1]
            )
          );

          return;

        }




        if (
          caminho ===
            "/api/internal/questoes/importar" &&
          metodo ===
            "POST"
        ) {
          await importarQuestoesInternas(
            request,
            response
          );

          return;
        }


        if (
          caminho ===
          "/api/questoes"
        ) {
          if (
            metodo === "GET"
          ) {
            await listarQuestoes(
              request,
              response,
              url
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
            "/api/respostas/lote" &&
          metodo ===
            "POST"
        ) {

          await criarRespostasEmLote(
            request,
            response
          );

          return;

        }


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
            "/api/financeiro/quitar" &&
          metodo ===
            "POST"
        ) {

          await quitarDivida(
            request,
            response
          );

          return;

        }


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


        /* =========================================================
           SIGAA UFPB
        ========================================================= */

        if (
          caminho ===
            "/api/sigaa/connect" &&
          metodo ===
            "POST"
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
            await connectSigaa(
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


        if (
          caminho ===
            "/api/sigaa/status" &&
          metodo ===
            "GET"
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
            sigaaStatus(
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
            "/api/sigaa/overview" &&
          metodo ===
            "GET"
        ) {

          const usuarioId =
            await exigirUsuario(
              request,
              response
            );

          if (!usuarioId) {
            return;
          }


          const force =
            url.searchParams.get(
              "force"
            ) ===
            "1";


          const resultado =
            await sigaaOverview(
              usuarioId,
              force
            );


          json(
            response,
            resultado.status,
            resultado.data
          );

          return;
        }




        const matchSigaaCourseFile =
          caminho.match(
            /^\/api\/sigaa\/courses\/([^/]+)\/files\/([^/]+)\/download$/
          );


        if (
          matchSigaaCourseFile &&
          metodo ===
            "GET"
        ) {

          const usuarioId =
            await exigirUsuario(
              request,
              response
            );


          if (!usuarioId) {
            return;
          }


          const sourceParam =
            url.searchParams.get(
              "source"
            );


          const source =
            sourceParam ===
              "lesson" ||
            sourceParam ===
              "course"
              ? sourceParam
              : null;


          const lessonId =
            url.searchParams.get(
              "lessonId"
            );


          const expectedTitle =
            url.searchParams.get(
              "title"
            );


          const result =
            await downloadSigaaCourseFile(
              usuarioId,
              decodeURIComponent(
                matchSigaaCourseFile[1]
              ),
              decodeURIComponent(
                matchSigaaCourseFile[2]
              ),
              {
                source,
                lessonId,
                expectedTitle,
              }
            );


          if (
            result.status !==
              200 ||
            !result.buffer
          ) {

            json(
              response,
              result.status,
              {
                error:
                  result.error ||
                  "Nao foi possivel baixar o arquivo.",
              }
            );

            return;
          }


          const originalFilename =
            String(
              result.filename ||
              "arquivo"
            )
              .replace(
                /[\u0000-\u001F\u007F]/g,
                "_"
              )
              .trim() ||
            "arquivo";


          const fallbackFilename =
            originalFilename
              .normalize(
                "NFKD"
              )
              .replace(
                /[\u0300-\u036f]/g,
                ""
              )
              .replace(
                /[^\x20-\x7E]/g,
                "_"
              )
              .replace(
                /["\\]/g,
                "_"
              )
              .slice(
                0,
                180
              ) ||
            "arquivo";


          const encodedFilename =
            encodeURIComponent(
              originalFilename
            )
              .replace(
                /['()*]/g,
                function (
                  character
                ) {

                  return (
                    "%" +
                    character
                      .charCodeAt(
                        0
                      )
                      .toString(
                        16
                      )
                      .toUpperCase()
                  );

                }
              );


          response.writeHead(
            200,
            {
              "Content-Type":
                result.contentType ||
                "application/octet-stream",

              "Content-Length":
                String(
                  result.buffer.length
                ),

              "Content-Disposition":
                "attachment; filename=\"" +
                fallbackFilename +
                "\"; filename*=UTF-8''" +
                encodedFilename,

              "Cache-Control":
                "private, no-store",
            }
          );


          response.end(
            result.buffer
          );

          return;
        }


        const matchSigaaCourseDetail =
          caminho.match(
            /^\/api\/sigaa\/courses\/([^/]+)$/
          );


        if (
          matchSigaaCourseDetail &&
          metodo ===
            "GET"
        ) {

          const usuarioId =
            await exigirUsuario(
              request,
              response
            );


          if (!usuarioId) {
            return;
          }


          const force =
            url.searchParams.get(
              "force"
            ) ===
            "1";


          const resultado =
            await sigaaCourseDetail(
              usuarioId,
              decodeURIComponent(
                matchSigaaCourseDetail[1]
              ),
              force
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
            "/api/sigaa/disconnect" &&
          metodo ===
            "POST"
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
            await disconnectSigaa(
              usuarioId
            );


          json(
            response,
            resultado.status,
            resultado.data
          );

          return;
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


        /* =========================================================
           PROTECAO CENTRAL DO FRONTEND
        ========================================================= */

        const paginasPublicasFrontend =
          new Set([
            "/login",
            "/login.html",
            "/cadastro",
            "/cadastro.html",
            "/radiology-atlas-smoke.html",
          ]);


        const aliasesProtegidosFrontend =
          new Set([
            "/questoes",
            "/simulado",
            "/flashcards",
            "/lousa",
            "/farmacos",
            "/financas",
            "/musica",
            "/sigaa",
            "/app",
            "/casos",
            "/laboratorio",
            "/evolucao",
            "/desempenho",
            "/ranking",
            "/configuracoes",
          ]);


        const ehPaginaCasoFrontend =
          /^\/casos\/\d+$/.test(
            caminho
          );


        const ehHtmlProtegidoFrontend =
          caminho.endsWith(".html") &&
          !paginasPublicasFrontend.has(
            caminho
          );


        const ehPaginaProtegidaFrontend =
          caminho === "/" ||
          aliasesProtegidosFrontend.has(
            caminho
          ) ||
          ehPaginaCasoFrontend ||
          ehHtmlProtegidoFrontend;


        if (
          metodo === "GET" &&
          (
            paginasPublicasFrontend.has(
              caminho
            ) ||
            ehPaginaProtegidaFrontend
          )
        ) {

          const usuarioIdFrontend =
            await usuarioIdDaRequisicao(
              request
            );


          /*
           * Usuario autenticado nao precisa
           * voltar para login/cadastro.
           */
          if (
            paginasPublicasFrontend.has(
              caminho
            ) &&
            usuarioIdFrontend
          ) {

            redirect(
              response,
              "/"
            );

            return;
          }


          /*
           * Todas as paginas internas precisam
           * de uma sessao JWT valida.
           */
          if (
            ehPaginaProtegidaFrontend &&
            !usuarioIdFrontend
          ) {

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
          "/simulado"
        ) {

          redirect(
            response,
            "/simulado.html"
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
          "/farmacos"
        ) {

          redirect(
            response,
            "/farmacos.html"
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


        if (
          caminho === "/api/desempenho" &&
          metodo === "GET"
        ) {

          await atenderDesempenho(
            request,
            response
          );

          return;
        }


        if (
          caminho === "/desempenho" &&
          metodo === "GET"
        ) {

          redirect(
            response,
            "/desempenho.html"
          );

          return;
        }


        if (
          caminho === "/api/ranking" &&
          metodo === "GET"
        ) {

          await atenderRanking(
            request,
            response
          );

          return;
        }


        if (
          caminho === "/ranking" &&
          metodo === "GET"
        ) {

          redirect(
            response,
            "/ranking.html"
          );

          return;
        }


        if (
          caminho === "/api/configuracoes" &&
          metodo === "GET"
        ) {

          await obterConfiguracoes(
            request,
            response
          );

          return;
        }


        if (
          caminho === "/api/configuracoes/tema" &&
          metodo === "PATCH"
        ) {

          await atualizarTema(
            request,
            response
          );

          return;
        }


        if (
          caminho === "/api/configuracoes/perfil" &&
          metodo === "PATCH"
        ) {

          await atualizarPerfil(
            request,
            response
          );

          return;
        }


        if (
          caminho === "/api/configuracoes/senha" &&
          metodo === "PATCH"
        ) {

          await atualizarSenha(
            request,
            response
          );

          return;
        }


        if (
          caminho === "/configuracoes" &&
          metodo === "GET"
        ) {

          redirect(
            response,
            "/configuracoes.html"
          );

          return;
        }

        if (
          caminho === "/musica" &&
          metodo === "GET"
        ) {

          redirect(
            response,
            "/musica.html"
          );

          return;
        }

        if (
          caminho === "/sigaa" &&
          metodo === "GET"
        ) {

          redirect(
            response,
            "/sigaa.html"
          );

          return;
        }


        if (
          caminho === "/app" &&
          metodo === "GET"
        ) {

          redirect(
            response,
            "/app.html"
          );

          return;
        }


        if (
          caminho === "/lousa" &&
          metodo === "GET"
        ) {

          redirect(
            response,
            "/lousa.html"
          );

          return;
        }

        await servirArquivo(
          request,
          response,
          caminho,
          url.searchParams.has(
            "v"
          )
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

    void resetAllPerformanceIfRequested()
      .catch(
        function (error) {

          console.error(
            "[performance-reset] Falha:",
            error
          );

        }
      );


    void (
      async function () {

        await sincronizarCasosFaculdade();

        await sincronizarQuestoesSemiotecnica();

        await sincronizarQuestoesDiego();

        await sincronizarQuestoesFarmacocineticaHaggi();

        await sincronizarQuestoesCalculoMedicamentos();

        await sincronizarQuestoesLaboratorioEcg();

        await sincronizarQuestoesConcursosPublicos();

        await sincronizarQuestoesResidenciasFederais();

        await sincronizarQuestoesEnareEbserh500();

        await sincronizarQuestoesSusLegislacao200();

        await limparFlashcardsParaMetodologia();

      }
    )()
      .catch(
        function (error) {

          console.error(
            "[conteudo] Falha ao sincronizar questoes/limpeza de flashcards:",
            error
          );

        }
      );


    console.log("");
    console.log(
      "======================================"
    );
    console.log(
      " CORTEX"
    );
    console.log(
      " Backend TypeScript"
    );
    console.log(
      "======================================"
    );
    console.log("");
    console.log(
      `http://127.0.0.1:${PORT}/app`
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
    console.log(
      "  /api/spotify/*"
    );
    console.log("");
  }
);
