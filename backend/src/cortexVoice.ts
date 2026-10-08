type CortexVoiceResult = {
  status: number;
  data: any;
};

function isoAfter(
  milliseconds: number
) {
  return new Date(
    Date.now() +
      milliseconds
  ).toISOString();
}

export async function criarCortexVoiceClientSecret(
  usuarioId: number
): Promise<CortexVoiceResult> {
  void usuarioId;

  const apiKey =
    process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      status: 503,
      data: {
        error:
          "Cortex Voice ainda precisa da GEMINI_API_KEY no Railway.",
        code:
          "VOICE_GEMINI_KEY_MISSING",
      },
    };
  }

  const model =
    process.env.CORTEX_VOICE_MODEL ||
    "gemini-3.8-live";

  try {
    const response =
      await fetch(
        "https://generativelanguage.googleapis.com/v1beta/auth_tokens",
        {
          method: "POST",
          headers: {
            "x-goog-api-key":
              apiKey,
            "Content-Type":
              "application/json",
          },
          body:
            JSON.stringify({
              uses: 1,
              expireTime:
                isoAfter(
                  30 * 60 * 1000
                ),
              newSessionExpireTime:
                isoAfter(
                  60 * 1000
                ),
            }),
        }
      );

    const data =
      await response
        .json()
        .catch(
          function () {
            return {};
          }
        );

    if (!response.ok) {
      const rawMessage =
        String(
          data?.error?.message ||
          ""
        );

      const quota =
        /quota|resource exhausted|rate limit/i
          .test(
            rawMessage
          );

      console.error(
        "Cortex Voice Gemini token:",
        response.status,
        rawMessage
      );

      return {
        status:
          quota
            ? 429
            : (
                response.status >=
                  500
                  ? 502
                  : 400
              ),
        data: {
          error:
            quota
              ? "O limite gratuito do Gemini Live foi atingido. Tente novamente mais tarde."
              : (
                  rawMessage ||
                  "Não foi possível iniciar o Cortex Voice com Gemini Live."
                ),
          code:
            quota
              ? "VOICE_FREE_LIMIT_REACHED"
              : "VOICE_SESSION_ERROR",
        },
      };
    }

    const token =
      String(
        data?.name ||
        ""
      );

    if (!token) {
      return {
        status: 502,
        data: {
          error:
            "O Gemini não retornou um token temporário válido.",
          code:
            "VOICE_SESSION_ERROR",
        },
      };
    }

    return {
      status: 200,
      data: {
        value:
          token,
        expiresAt:
          data?.expireTime ||
          null,
        model,
        provider:
          "gemini",
      },
    };
  }
  catch (error) {
    console.error(
      "Cortex Voice Gemini:",
      error
    );

    return {
      status: 502,
      data: {
        error:
          "Não foi possível conectar o Cortex Voice ao Gemini Live.",
        code:
          "VOICE_SESSION_ERROR",
      },
    };
  }
}
