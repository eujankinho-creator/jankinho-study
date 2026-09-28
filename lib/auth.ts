import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

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

export async function criarSessao(usuarioId: number) {
  const chave = obterChave();

  const token = await new SignJWT({
    usuarioId: usuarioId,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(chave);

  const cookieStore = await cookies();

  cookieStore.set(nomeCookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function obterUsuarioId() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get(nomeCookie)?.value;

    if (!token) {
      return null;
    }

    const chave = obterChave();

    const resultado = await jwtVerify(token, chave);

    const usuarioId = resultado.payload.usuarioId;

    if (typeof usuarioId !== "number") {
      return null;
    }

    return usuarioId;
  } catch {
    return null;
  }
}

export async function encerrarSessao() {
  const cookieStore = await cookies();

  cookieStore.delete(nomeCookie);
}