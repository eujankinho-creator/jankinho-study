import OpenAI from "openai";

type Resultado = {
  status: number;
  data: unknown;
};

type HistoryItem = {
  role: "user" | "assistant";
  content: string;
};

function cleanText(value: unknown, max = 1200) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function normalizeHistory(value: unknown): HistoryItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .slice(-8)
    .map(function (item: any) {
      const role =
        item && item.role === "assistant"
          ? "assistant"
          : "user";

      return {
        role,
        content: cleanText(item && item.content, 800),
      };
    })
    .filter(function (item) {
      return Boolean(item.content);
    });
}

export async function responderAssistenteVoz(
  usuarioId: number,
  body: any
): Promise<Resultado> {
  try {
    const key = process.env.OPENAI_API_KEY;

    if (!key) {
      return {
        status: 500,
        data: {
          error:
            "Assistente indisponível: OPENAI_API_KEY não configurada.",
        },
      };
    }

    const mensagem =
      cleanText(body && body.mensagem, 1400);

    if (!mensagem) {
      return {
        status: 400,
        data: {
          error:
            "Envie uma mensagem para o assistente.",
        },
      };
    }

    const history =
      normalizeHistory(body && body.history);

    const openai =
      new OpenAI({
        apiKey: key,
      });

    const input: any[] = [
      {
        role: "system",
        content:
          [
            "Você é o Cortex Voice, assistente de estudos integrado ao Dashboard do Cortex.",
            "Responda sempre em português do Brasil.",
            "Seja natural, direto e útil para conversa por voz.",
            "Priorize explicações curtas, claras e didáticas.",
            "Quando o usuário pedir ajuda em estudos, explique como tutor.",
            "Não invente dados pessoais nem ações que você não executou.",
            "Evite respostas longas: em geral use de 2 a 6 frases, salvo se o usuário pedir mais detalhes.",
            "O usuário já está autenticado na plataforma.",
            "ID interno do usuário: " + usuarioId + ".",
          ].join(" "),
      },
    ];

    history.forEach(function (item) {
      input.push({
        role: item.role,
        content: item.content,
      });
    });

    input.push({
      role: "user",
      content: mensagem,
    });

    const response =
      await openai.responses.create({
        model:
          process.env.OPENAI_VOICE_ASSISTANT_MODEL ||
          "gpt-5.4-mini",

        reasoning: {
          effort: "low",
        },

        input,
      });

    const resposta =
      cleanText(
        response.output_text ||
        "Não consegui formular uma resposta agora.",
        2200
      );

    return {
      status: 200,
      data: {
        sucesso: true,
        resposta,
      },
    };
  }
  catch (error) {
    console.error(
      "[voice-assistant] erro:",
      error
    );

    return {
      status: 500,
      data: {
        error:
          "Não foi possível responder agora.",
      },
    };
  }
}
