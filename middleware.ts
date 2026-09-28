import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const nomeCookie = "jankinho_session";

function obterChave() {
  const segredo = process.env.AUTH_SECRET;

  if (!segredo) {
    throw new Error(
      "AUTH_SECRET não configurado no arquivo .env"
    );
  }

  return new TextEncoder().encode(segredo);
}

async function usuarioEstaAutenticado(
  request: NextRequest
) {
  const token = request.cookies.get(nomeCookie)?.value;

  if (!token) {
    return false;
  }

  try {
    const resultado = await jwtVerify(
      token,
      obterChave()
    );

    const usuarioId = resultado.payload.usuarioId;

    return typeof usuarioId === "number";
  } catch {
    return false;
  }
}

export async function middleware(
  request: NextRequest
) {
  const caminho = request.nextUrl.pathname;

  const paginasPublicas = [
    "/login",
    "/cadastro",
  ];

  const ehPaginaPublica = paginasPublicas.some(
    function (pagina) {
      return (
        caminho === pagina ||
        caminho.startsWith(pagina + "/")
      );
    }
  );

  const autenticado =
    await usuarioEstaAutenticado(request);

  if (!autenticado && !ehPaginaPublica) {
    const url = request.nextUrl.clone();

    url.pathname = "/login";
    url.search = "";

    return NextResponse.redirect(url);
  }

  if (
    autenticado &&
    (caminho === "/login" ||
      caminho === "/cadastro")
  ) {
    const url = request.nextUrl.clone();

    url.pathname = "/";
    url.search = "";

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};