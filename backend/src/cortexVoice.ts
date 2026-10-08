import { createHash } from "node:crypto";

type CortexVoiceResult = {
  status: number;
  data: any;
};

function safetyIdentifier(
  usuarioId: number
) {
  return createHash("sha256")
    .update(
      "cortex-voice-user:" +
      String(usuarioId)
    )
    .digest("hex");
}

export async function criarCortexVoiceClientSecret(
  usuarioId: number
): Promise<CortexVoiceResult> {
  const apiKey =
    process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      status: 503,
      data: {
        error:
          "Cortex Voice indisponível: OPENAI_API_KEY não configurada.",
      },
    };
  }

  const session = {
    type: "realtime",
    model:
      process.env.CORTEX_VOICE_MODEL ||
      "gpt-realtime",
    output_modalities: [
      "audio",
    ],
    instructions: [
      "Você é o Cortex Voice, assistente de voz nativo da plataforma educacional Cortex.",
      "Fale sempre em português brasileiro, com voz natural, humana, calma e objetiva.",
      "Evite frases robóticas, listas longas e linguagem excessivamente formal.",
      "Responda de forma conversacional e curta por padrão.",
      "O usuário pode interromper você a qualquer momento; adapte-se sem reclamar.",
      "Quando o usuário pedir para abrir uma área, navegar, iniciar questões ou flashcards, use a ferramenta apropriada em vez de apenas explicar.",
      "Nunca diga que uma ação foi executada antes de receber o resultado da ferramenta.",
      "Se o usuário fizer uma pergunta educacional, explique com clareza e rigor, como um tutor.",
      "Não leia URLs, JSON, markdown ou detalhes técnicos em voz alta sem necessidade.",
      "A plataforma possui Dashboard, Questões, Simulado, Flashcards, Cronograma, Aulas, Acadêmico/SIGAA, Desempenho, Ranking e Configurações.",
    ].join(" "),
    max_output_tokens: 700,
    truncation: "auto",
    tool_choice: "auto",
    audio: {
      input: {
        turn_detection: {
          type: "semantic_vad",
          eagerness: "medium",
          create_response: true,
          interrupt_response: true,
        },
      },
      output: {
        voice:
          process.env.CORTEX_VOICE_VOICE ||
          "marin",
        speed: 1.02,
      },
    },
    tools: [
      {
        type: "function",
        name: "navigate_cortex",
        description:
          "Abre uma área principal do Cortex.",
        parameters: {
          type: "object",
          additionalProperties: false,
          properties: {
            destination: {
              type: "string",
              enum: [
                "dashboard",
                "questoes",
                "simulado",
                "flashcards",
                "cronograma",
                "aulas",
                "academico",
                "desempenho",
                "ranking",
                "configuracoes",
              ],
            },
          },
          required: [
            "destination",
          ],
        },
      },
      {
        type: "function",
        name: "start_questions",
        description:
          "Abre e inicia uma sessão de questões no Cortex, opcionalmente filtrada por tema.",
        parameters: {
          type: "object",
          additionalProperties: false,
          properties: {
            theme: {
              type: "string",
              description:
                "Tema ou assunto das questões. Pode ficar vazio para usar o banco geral.",
            },
            quantity: {
              type: "integer",
              minimum: 1,
              maximum: 50,
            },
          },
          required: [
            "quantity",
          ],
        },
      },
      {
        type: "function",
        name: "start_flashcards",
        description:
          "Abre e inicia uma revisão de flashcards no Cortex, opcionalmente filtrada por tema.",
        parameters: {
          type: "object",
          additionalProperties: false,
          properties: {
            theme: {
              type: "string",
              description:
                "Tema ou assunto dos flashcards. Pode ficar vazio para usar a biblioteca geral.",
            },
            quantity: {
              type: "integer",
              minimum: 1,
              maximum: 24,
            },
          },
          required: [
            "quantity",
          ],
        },
      },
    ],
  };

  try {
    const response =
      await fetch(
        "https://api.openai.com/v1/realtime/client_secrets",
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${apiKey}`,
            "Content-Type":
              "application/json",
            "OpenAI-Safety-Identifier":
              safetyIdentifier(
                usuarioId
              ),
          },
          body:
            JSON.stringify({
              expires_after: {
                anchor:
                  "created_at",
                seconds:
                  300,
              },
              session,
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
      console.error(
        "Cortex Voice client secret:",
        response.status,
        data
      );

      const rawMessage =
        String(
          data?.error?.message ||
          ""
        );

      const noCredits =
        /no credits remaining|credit_balance_exhausted|insufficient_quota/i
          .test(
            rawMessage
          );

      return {
        status:
          noCredits
            ? 402
            : (
                response.status >= 500
                  ? 502
                  : 400
              ),
        data: {
          error:
            noCredits
              ? "Os créditos da API da OpenAI acabaram. O ChatGPT Plus não inclui saldo da API."
              : (
                  rawMessage ||
                  "Não foi possível iniciar o Cortex Voice."
                ),
          code:
            noCredits
              ? "VOICE_CREDITS_EXHAUSTED"
              : "VOICE_SESSION_ERROR",
        },
      };
    }

    return {
      status: 200,
      data: {
        value:
          data.value,
        expiresAt:
          data.expires_at,
        model:
          data.session?.model ||
          session.model,
        voice:
          data.session?.audio?.output?.voice ||
          session.audio.output.voice,
      },
    };
  }
  catch (error) {
    console.error(
      "Cortex Voice:",
      error
    );

    return {
      status: 502,
      data: {
        error:
          "Não foi possível conectar o Cortex Voice à OpenAI.",
      },
    };
  }
}
