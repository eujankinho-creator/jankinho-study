import {
  IncomingMessage,
  ServerResponse,
} from "node:http";

import {
  randomBytes,
} from "node:crypto";


const ACCESS_COOKIE =
  "cortex_spotify_access";

const REFRESH_COOKIE =
  "cortex_spotify_refresh";

const STATE_COOKIE =
  "cortex_spotify_state";


const SPOTIFY_SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-read-currently-playing",
  "user-modify-playback-state",
].join(" ");


type TokenData = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  error?: string;
  error_description?: string;
};


function jsonSpotify(
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


function redirectSpotify(
  response: ServerResponse,
  location: string
) {

  response.writeHead(
    302,
    {
      Location: location,
      "Cache-Control": "no-store",
    }
  );

  response.end();
}


function cookiesDaRequisicao(
  request: IncomingMessage
) {

  const output:
    Record<string, string> = {};

  const header =
    request.headers.cookie;

  if (!header) {
    return output;
  }

  for (
    const parte
    of header.split(";")
  ) {

    const indice =
      parte.indexOf("=");

    if (indice < 0) {
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

    try {

      output[chave] =
        decodeURIComponent(valor);

    }
    catch {

      output[chave] =
        valor;

    }
  }

  return output;
}


function cookieSpotify(
  nome: string,
  valor: string,
  maxAge: number
) {

  const secure =
    process.env.NODE_ENV ===
    "production"
      ? "; Secure"
      : "";

  return (
    `${nome}=` +
    `${encodeURIComponent(valor)}; ` +
    `Path=/api/spotify; ` +
    `HttpOnly; ` +
    `SameSite=Lax; ` +
    `Max-Age=${maxAge}` +
    secure
  );
}


function limparCookieSpotify(
  nome: string
) {

  const secure =
    process.env.NODE_ENV ===
    "production"
      ? "; Secure"
      : "";

  return (
    `${nome}=; ` +
    `Path=/api/spotify; ` +
    `HttpOnly; ` +
    `SameSite=Lax; ` +
    `Max-Age=0` +
    secure
  );
}


function configuracaoSpotify() {

  const clientId =
    process.env.SPOTIFY_CLIENT_ID;

  const clientSecret =
    process.env.SPOTIFY_CLIENT_SECRET;

  const redirectUri =
    process.env.SPOTIFY_REDIRECT_URI;

  if (
    !clientId ||
    !clientSecret ||
    !redirectUri
  ) {

    throw new Error(
      "Configuracao Spotify incompleta."
    );
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
  };
}


function authorizationHeader() {

  const {
    clientId,
    clientSecret,
  } =
    configuracaoSpotify();

  return (
    "Basic " +
    Buffer
      .from(
        `${clientId}:${clientSecret}`
      )
      .toString("base64")
  );
}


async function solicitarToken(
  params: URLSearchParams
) {

  const response =
    await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method:
          "POST",

        headers: {
          Authorization:
            authorizationHeader(),

          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body:
          params.toString(),
      }
    );

  const data =
    await response
      .json()
      .catch(
        function () {
          return {};
        }
      ) as TokenData;

  return {
    ok:
      response.ok,

    status:
      response.status,

    data,
  };
}


function salvarTokens(
  response: ServerResponse,
  data: TokenData,
  refreshAnterior?: string
) {

  if (!data.access_token) {
    return;
  }

  const expiresIn =
    Number(
      data.expires_in ||
      3600
    );

  const accessMaxAge =
    Math.max(
      60,
      expiresIn - 90
    );

  const cookies = [
    cookieSpotify(
      ACCESS_COOKIE,
      data.access_token,
      accessMaxAge
    ),
  ];

  const refresh =
    data.refresh_token ||
    refreshAnterior;

  if (refresh) {

    cookies.push(
      cookieSpotify(
        REFRESH_COOKIE,
        refresh,
        60 * 60 * 24 * 180
      )
    );
  }

  response.setHeader(
    "Set-Cookie",
    cookies
  );
}


function limparTokens(
  response: ServerResponse
) {

  response.setHeader(
    "Set-Cookie",
    [
      limparCookieSpotify(
        ACCESS_COOKIE
      ),

      limparCookieSpotify(
        REFRESH_COOKIE
      ),

      limparCookieSpotify(
        STATE_COOKIE
      ),
    ]
  );
}


async function obterTokenSpotify(
  request: IncomingMessage,
  response: ServerResponse
) {

  const cookies =
    cookiesDaRequisicao(
      request
    );

  const access =
    cookies[
      ACCESS_COOKIE
    ];

  if (access) {
    return access;
  }

  const refresh =
    cookies[
      REFRESH_COOKIE
    ];

  if (!refresh) {
    return null;
  }

  const params =
    new URLSearchParams();

  params.set(
    "grant_type",
    "refresh_token"
  );

  params.set(
    "refresh_token",
    refresh
  );

  const result =
    await solicitarToken(
      params
    );

  if (
    !result.ok ||
    !result.data.access_token
  ) {

    if (
      result.data.error ===
      "invalid_grant"
    ) {

      limparTokens(
        response
      );
    }

    return null;
  }

  salvarTokens(
    response,
    result.data,
    refresh
  );

  return (
    result.data.access_token
  );
}


export async function iniciarSpotifyAuth(
  response: ServerResponse
) {

  try {

    const {
      clientId,
      redirectUri,
    } =
      configuracaoSpotify();

    const state =
      randomBytes(24)
        .toString("hex");

    const params =
      new URLSearchParams();

    params.set(
      "response_type",
      "code"
    );

    params.set(
      "client_id",
      clientId
    );

    params.set(
      "scope",
      SPOTIFY_SCOPES
    );

    params.set(
      "redirect_uri",
      redirectUri
    );

    params.set(
      "state",
      state
    );

    response.setHeader(
      "Set-Cookie",
      cookieSpotify(
        STATE_COOKIE,
        state,
        600
      )
    );

    redirectSpotify(
      response,
      "https://accounts.spotify.com/authorize?" +
      params.toString()
    );

  }
  catch (error) {

    console.error(
      "Spotify auth:",
      error
    );

    jsonSpotify(
      response,
      500,
      {
        error:
          "Spotify nao configurado.",
      }
    );
  }
}


export async function concluirSpotifyAuth(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL
) {

  try {

    const erro =
      url.searchParams.get(
        "error"
      );

    if (erro) {

      response.setHeader(
        "Set-Cookie",
        limparCookieSpotify(
          STATE_COOKIE
        )
      );

      redirectSpotify(
        response,
        "/app?view=%2Fmusica&spotify=denied"
      );

      return;
    }

    const code =
      url.searchParams.get(
        "code"
      );

    const state =
      url.searchParams.get(
        "state"
      );

    const cookies =
      cookiesDaRequisicao(
        request
      );

    const expectedState =
      cookies[
        STATE_COOKIE
      ];

    if (
      !code ||
      !state ||
      !expectedState ||
      state !== expectedState
    ) {

      jsonSpotify(
        response,
        400,
        {
          error:
            "Estado OAuth Spotify invalido.",
        }
      );

      return;
    }

    const {
      redirectUri,
    } =
      configuracaoSpotify();

    const params =
      new URLSearchParams();

    params.set(
      "grant_type",
      "authorization_code"
    );

    params.set(
      "code",
      code
    );

    params.set(
      "redirect_uri",
      redirectUri
    );

    const result =
      await solicitarToken(
        params
      );

    if (
      !result.ok ||
      !result.data.access_token
    ) {

      console.error(
        "Spotify token:",
        result.data
      );

      redirectSpotify(
        response,
        "/app?view=%2Fmusica&spotify=error"
      );

      return;
    }

    salvarTokens(
      response,
      result.data
    );

    const atuais =
      response.getHeader(
        "Set-Cookie"
      );

    const lista =
      Array.isArray(atuais)
        ? atuais.map(String)
        : atuais
          ? [String(atuais)]
          : [];

    lista.push(
      limparCookieSpotify(
        STATE_COOKIE
      )
    );

    response.setHeader(
      "Set-Cookie",
      lista
    );

    redirectSpotify(
      response,
      "/app?view=%2Fmusica&spotify=connected"
    );

  }
  catch (error) {

    console.error(
      "Spotify callback:",
      error
    );

    redirectSpotify(
      response,
      "/app?view=%2Fmusica&spotify=error"
    );
  }
}


export async function statusSpotify(
  request: IncomingMessage,
  response: ServerResponse
) {

  const cookies =
    cookiesDaRequisicao(
      request
    );

  jsonSpotify(
    response,
    200,
    {
      conectado:
        Boolean(
          cookies[
            ACCESS_COOKIE
          ] ||
          cookies[
            REFRESH_COOKIE
          ]
        ),
    }
  );
}


export async function tokenSpotify(
  request: IncomingMessage,
  response: ServerResponse
) {

  try {

    const accessToken =
      await obterTokenSpotify(
        request,
        response
      );

    if (!accessToken) {

      jsonSpotify(
        response,
        401,
        {
          conectado:
            false,

          error:
            "Spotify nao conectado.",
        }
      );

      return;
    }

    jsonSpotify(
      response,
      200,
      {
        conectado:
          true,

        accessToken,
      }
    );

  }
  catch (error) {

    console.error(
      "Spotify refresh:",
      error
    );

    jsonSpotify(
      response,
      502,
      {
        error:
          "Nao foi possivel renovar o Spotify.",
      }
    );
  }
}


export async function buscarSpotify(
  request: IncomingMessage,
  response: ServerResponse,
  url: URL
) {

  try {

    const q =
      String(
        url.searchParams.get(
          "q"
        ) || ""
      ).trim();

    if (
      q.length < 2
    ) {

      jsonSpotify(
        response,
        400,
        {
          error:
            "Digite pelo menos 2 caracteres.",
        }
      );

      return;
    }

    const token =
      await obterTokenSpotify(
        request,
        response
      );

    if (!token) {

      jsonSpotify(
        response,
        401,
        {
          error:
            "Conecte sua conta Spotify.",
        }
      );

      return;
    }

    const params =
      new URLSearchParams();

    params.set(
      "q",
      q
    );

    params.set(
      "type",
      "track"
    );

    params.set(
      "limit",
      "10"
    );

    const spotifyResponse =
      await fetch(
        "https://api.spotify.com/v1/search?" +
        params.toString(),
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const data =
      await spotifyResponse
        .json()
        .catch(
          function () {
            return {};
          }
        ) as any;

    if (!spotifyResponse.ok) {

      const mensagem =
        data &&
        data.error &&
        data.error.message
          ? String(
              data.error.message
            )
          : "Erro na busca do Spotify.";

      jsonSpotify(
        response,
        spotifyResponse.status,
        {
          error:
            mensagem,
        }
      );

      return;
    }

    const items =
      Array.isArray(
        data?.tracks?.items
      )
        ? data.tracks.items
        : [];

    const resultados =
      items.map(
        function (track: any) {

          return {
            id:
              track.id,

            uri:
              track.uri,

            nome:
              track.name,

            duracaoMs:
              Number(
                track.duration_ms ||
                0
              ),

            explicita:
              Boolean(
                track.explicit
              ),

            tocavel:
              track.is_playable !==
              false,

            artistas:
              Array.isArray(
                track.artists
              )
                ? track.artists
                    .map(
                      function (
                        artist: any
                      ) {
                        return artist.name;
                      }
                    )
                    .filter(Boolean)
                : [],

            album:
              track.album?.name ||
              "",

            imagem:
              Array.isArray(
                track.album?.images
              ) &&
              track.album.images[0]
                ? track.album.images[0].url
                : "",

            spotifyUrl:
              track.external_urls?.spotify ||
              "",
          };
        }
      );

    jsonSpotify(
      response,
      200,
      {
        resultados,
      }
    );

  }
  catch (error) {

    console.error(
      "Spotify search:",
      error
    );

    jsonSpotify(
      response,
      502,
      {
        error:
          "Nao foi possivel pesquisar no Spotify.",
      }
    );
  }
}


export async function tocarSpotify(
  request: IncomingMessage,
  response: ServerResponse,
  body: any
) {

  try {

    const deviceId =
      String(
        body.deviceId ||
        ""
      ).trim();

    const uri =
      String(
        body.uri ||
        ""
      ).trim();


    const requestedUris =
      Array.isArray(
        body.uris
      )
        ? body.uris
            .map(
              function (value: unknown) {

                return String(
                  value || ""
                ).trim();

              }
            )
            .filter(
              function (value: string) {

                return value.startsWith(
                  "spotify:track:"
                );

              }
            )
            .slice(
              0,
              50
            )
        : [];


    const uris =
      requestedUris.length > 0
        ? requestedUris
        : uri.startsWith(
            "spotify:track:"
          )
          ? [uri]
          : [];


    const offset =
      Math.max(
        0,
        Math.min(
          Number(
            body.offset ||
            0
          ),
          Math.max(
            0,
            uris.length - 1
          )
        )
      );


    if (
      !deviceId ||
      uris.length === 0
    ) {

      jsonSpotify(
        response,
        400,
        {
          error:
            "Musica ou dispositivo invalido.",
        }
      );

      return;
    }

    const token =
      await obterTokenSpotify(
        request,
        response
      );

    if (!token) {

      jsonSpotify(
        response,
        401,
        {
          error:
            "Conecte sua conta Spotify.",
        }
      );

      return;
    }

    const endpoint =
      "https://api.spotify.com/v1/me/player/play" +
      "?device_id=" +
      encodeURIComponent(
        deviceId
      );

    const spotifyResponse =
      await fetch(
        endpoint,
        {
          method:
            "PUT",

          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              uris,

              offset: {
                position:
                  offset,
              },
            }),
        }
      );

    if (!spotifyResponse.ok) {

      const data =
        await spotifyResponse
          .json()
          .catch(
            function () {
              return {};
            }
          ) as any;

      const mensagem =
        data &&
        data.error &&
        data.error.message
          ? String(
              data.error.message
            )
          : "Spotify recusou a reproducao.";

      jsonSpotify(
        response,
        spotifyResponse.status,
        {
          error:
            mensagem,
        }
      );

      return;
    }

    jsonSpotify(
      response,
      200,
      {
        sucesso:
          true,
      }
    );

  }
  catch (error) {

    console.error(
      "Spotify play:",
      error
    );

    jsonSpotify(
      response,
      502,
      {
        error:
          "Nao foi possivel iniciar a musica.",
      }
    );
  }
}


export async function desconectarSpotify(
  response: ServerResponse
) {

  limparTokens(
    response
  );

  jsonSpotify(
    response,
    200,
    {
      sucesso:
        true,
    }
  );
}