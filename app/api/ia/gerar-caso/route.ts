import OpenAI from "openai";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { obterUsuarioId } from "@/lib/auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ItemInformacao = {
  campo: string;
  valor: string;
};

type ExameGerado = {
  nome: string;
  categoria: string;
  resultado: string;
  interpretacao: string;
};

type DiagnosticoDiferencial = {
  diagnostico: string;
  justificativa: string;
  porqueNaoEPrincipal: string;
};

type PontoChave = {
  achado: string;
  importancia: string;
};

type CasoGerado = {
  titulo: string;
  area: string;
  especialidade: string;
  dificuldade: string;
  cenario: string;
  queixaInicial: string;

  dadosIniciais: ItemInformacao[];
  anamnese: ItemInformacao[];
  exameFisico: ItemInformacao[];
  sinaisVitais: ItemInformacao[];
  evolucao: ItemInformacao[];

  diagnosticoFinal: string;
  explicacaoDiagnostico: string;

  diagnosticosDiferenciais: DiagnosticoDiferencial[];
  pontosChave: PontoChave[];

  exames: ExameGerado[];
};

function transformarEmObjeto(
  itens: ItemInformacao[]
): Record<string, string> {
  const resultado: Record<string, string> = {};

  for (const item of itens) {
    if (!item?.campo) continue;

    resultado[item.campo] = String(item.valor ?? "");
  }

  return resultado;
}

export async function POST(request: Request) {
  try {
    /*
     * =====================================================
     * AUTENTICAÇÃO
     * =====================================================
     */

    const usuarioId = await obterUsuarioId();

    if (!usuarioId) {
      return NextResponse.json(
        {
          error: "Não autenticado.",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * =====================================================
     * OPENAI
     * =====================================================
     */

    if (!process.env.OPENAI_API_KEY) {
      console.error(
        "OPENAI_API_KEY não encontrada nas variáveis de ambiente."
      );

      return NextResponse.json(
        {
          error:
            "A chave da OpenAI não está configurada no servidor.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * =====================================================
     * DADOS RECEBIDOS
     * =====================================================
     */

    const body = await request.json();

    const area = String(body.area || "").trim();

    const especialidade = String(
      body.especialidade || ""
    ).trim();

    const dificuldade = String(
      body.dificuldade || ""
    ).trim();

    const cenario = String(
      body.cenario || ""
    ).trim();

    const tipoCaso = String(
      body.tipoCaso || ""
    ).trim();

    const caracteristicas = String(
      body.caracteristicas || ""
    ).trim();

    if (!area || !dificuldade || !cenario) {
      return NextResponse.json(
        {
          error:
            "Área, dificuldade e cenário são obrigatórios.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =====================================================
     * PROMPT
     * =====================================================
     */

    const promptSistema = `
Você é um professor universitário especialista em raciocínio clínico,
semiologia, fisiopatologia, medicina baseada em evidências e ensino
para estudantes de Enfermagem e Medicina.

Sua função é criar casos clínicos educacionais originais, realistas
e clinicamente coerentes.

O caso será utilizado em uma plataforma de investigação clínica
progressiva.

O estudante NÃO deve receber inicialmente o diagnóstico final,
a anamnese completa, o exame físico completo ou os resultados dos
exames complementares.

O servidor liberará essas informações progressivamente conforme
o estudante solicitar.

REGRAS IMPORTANTES:

1. O caso deve ser clinicamente coerente.

2. Os sinais, sintomas, antecedentes, exame físico, sinais vitais
   e exames devem ser compatíveis entre si.

3. O diagnóstico final deve ser sustentado pelos dados do caso.

4. Deve existir pelo menos um diagnóstico diferencial plausível.

5. Não crie informações contraditórias.

6. Não revele o diagnóstico final nos dados iniciais.

7. A anamnese deve conter informações úteis que possam ser
   descobertas posteriormente.

8. O exame físico deve conter achados que possam ser solicitados
   posteriormente.

9. Os exames complementares devem ser individualizados de acordo
   com a hipótese clínica.

10. Cada exame deve possuir resultado e interpretação.

11. Os resultados laboratoriais e de imagem devem ser
    fisiologicamente plausíveis.

12. O caso deve exigir raciocínio clínico e não apenas
    reconhecimento de uma doença.

13. Não copie literalmente prontuários, artigos ou casos reais.

14. Não utilize nomes reais de pacientes.

15. Utilize unidades clínicas apropriadas quando necessário.

16. Evite valores absurdos ou incompatíveis com a fisiologia.

17. O diagnóstico final deve aparecer somente no campo
    diagnosticoFinal.

18. Os pontos-chave devem explicar posteriormente quais achados
    sustentaram o diagnóstico.

19. Gere apenas exames realmente pertinentes ao caso.

20. A dificuldade solicitada deve modificar a complexidade
    do raciocínio.

21. Considere especialmente a perspectiva da Enfermagem:
    avaliação clínica, sinais de gravidade, segurança do paciente,
    prioridades e interpretação dos achados.

22. O caso deve permitir que o estudante formule uma hipótese
    antes de conhecer o diagnóstico final.

23. As informações devem ser suficientemente completas para que,
    depois de investigadas, seja possível chegar ao diagnóstico.

24. Nunca coloque o diagnóstico final dentro de dadosIniciais,
    anamnese, exameFisico, sinaisVitais ou evolucao.

FORMATO DAS INFORMAÇÕES:

Os campos dadosIniciais, anamnese, exameFisico,
sinaisVitais e evolucao devem ser ARRAYS de objetos.

Cada objeto deve possuir:

campo
valor

Exemplo:

[
  {
    "campo": "idade",
    "valor": "58 anos"
  },
  {
    "campo": "sexo",
    "valor": "Masculino"
  }
]

Isso permite que o servidor armazene e libere as informações
progressivamente.
`;

    const promptUsuario = `
Crie um caso clínico educacional com as seguintes características:

Área:
${area}

Especialidade:
${especialidade || "Não especificada"}

Dificuldade:
${dificuldade}

Cenário:
${cenario}

Tipo de caso:
${tipoCaso || "Investigação clínica"}

Características adicionais:
${caracteristicas || "Nenhuma"}

O caso deve ser adequado para estudantes de Enfermagem
e Medicina.

Crie um caso completo, coerente e investigável.

Dê atenção especial à fisiopatologia e à relação entre
queixa, sinais vitais, exame físico e exames complementares.

Não revele o diagnóstico final fora do campo diagnosticoFinal.
`;

    /*
     * =====================================================
     * GERAÇÃO DO CASO
     * =====================================================
     */

    const response = await openai.responses.create({
      model: "gpt-5-mini",

      input: [
        {
          role: "system",
          content: promptSistema,
        },
        {
          role: "user",
          content: promptUsuario,
        },
      ],

      text: {
        format: {
          type: "json_schema",
          name: "caso_clinico",
          strict: true,

          schema: {
            type: "object",

            properties: {
              titulo: {
                type: "string",
              },

              area: {
                type: "string",
              },

              especialidade: {
                type: "string",
              },

              dificuldade: {
                type: "string",
              },

              cenario: {
                type: "string",
              },

              queixaInicial: {
                type: "string",
              },

              dadosIniciais: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    campo: {
                      type: "string",
                    },
                    valor: {
                      type: "string",
                    },
                  },
                  required: ["campo", "valor"],
                  additionalProperties: false,
                },
              },

              anamnese: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    campo: {
                      type: "string",
                    },
                    valor: {
                      type: "string",
                    },
                  },
                  required: ["campo", "valor"],
                  additionalProperties: false,
                },
              },

              exameFisico: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    campo: {
                      type: "string",
                    },
                    valor: {
                      type: "string",
                    },
                  },
                  required: ["campo", "valor"],
                  additionalProperties: false,
                },
              },

              sinaisVitais: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    campo: {
                      type: "string",
                    },
                    valor: {
                      type: "string",
                    },
                  },
                  required: ["campo", "valor"],
                  additionalProperties: false,
                },
              },

              evolucao: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    campo: {
                      type: "string",
                    },
                    valor: {
                      type: "string",
                    },
                  },
                  required: ["campo", "valor"],
                  additionalProperties: false,
                },
              },

              diagnosticoFinal: {
                type: "string",
              },

              explicacaoDiagnostico: {
                type: "string",
              },

              diagnosticosDiferenciais: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    diagnostico: {
                      type: "string",
                    },
                    justificativa: {
                      type: "string",
                    },
                    porqueNaoEPrincipal: {
                      type: "string",
                    },
                  },
                  required: [
                    "diagnostico",
                    "justificativa",
                    "porqueNaoEPrincipal",
                  ],
                  additionalProperties: false,
                },
              },

              pontosChave: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    achado: {
                      type: "string",
                    },
                    importancia: {
                      type: "string",
                    },
                  },
                  required: [
                    "achado",
                    "importancia",
                  ],
                  additionalProperties: false,
                },
              },

              exames: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    nome: {
                      type: "string",
                    },
                    categoria: {
                      type: "string",
                    },
                    resultado: {
                      type: "string",
                    },
                    interpretacao: {
                      type: "string",
                    },
                  },
                  required: [
                    "nome",
                    "categoria",
                    "resultado",
                    "interpretacao",
                  ],
                  additionalProperties: false,
                },
              },
            },

            required: [
              "titulo",
              "area",
              "especialidade",
              "dificuldade",
              "cenario",
              "queixaInicial",
              "dadosIniciais",
              "anamnese",
              "exameFisico",
              "sinaisVitais",
              "evolucao",
              "diagnosticoFinal",
              "explicacaoDiagnostico",
              "diagnosticosDiferenciais",
              "pontosChave",
              "exames",
            ],

            additionalProperties: false,
          },
        },
      },
    });

    /*
     * =====================================================
     * VALIDAR RESPOSTA DA IA
     * =====================================================
     */

    if (!response.output_text) {
      console.error(
        "OpenAI não retornou output_text.",
        response
      );

      return NextResponse.json(
        {
          error:
            "A IA não retornou um caso clínico.",
        },
        {
          status: 500,
        }
      );
    }

    let caso: CasoGerado;

    try {
      caso = JSON.parse(
        response.output_text
      ) as CasoGerado;
    } catch (error) {
      console.error(
        "Erro ao interpretar JSON da OpenAI:",
        error
      );

      console.error(
        "Resposta recebida:",
        response.output_text
      );

      return NextResponse.json(
        {
          error:
            "A IA retornou uma resposta inválida.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * =====================================================
     * VALIDAÇÕES
     * =====================================================
     */

    if (
      !caso.titulo ||
      !caso.area ||
      !caso.dificuldade ||
      !caso.cenario ||
      !caso.queixaInicial ||
      !caso.diagnosticoFinal
    ) {
      return NextResponse.json(
        {
          error:
            "A IA retornou um caso incompleto.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      !Array.isArray(caso.exames) ||
      caso.exames.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "A IA não gerou exames suficientes para a investigação.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * =====================================================
     * CONVERTER ARRAYS PARA JSON OBJECT
     * =====================================================
     */

    const dadosIniciaisJson =
      transformarEmObjeto(
        caso.dadosIniciais
      );

    const anamneseJson =
      transformarEmObjeto(
        caso.anamnese
      );

    const exameFisicoJson =
      transformarEmObjeto(
        caso.exameFisico
      );

    const sinaisVitaisJson =
      transformarEmObjeto(
        caso.sinaisVitais
      );

    const evolucaoJson =
      transformarEmObjeto(
        caso.evolucao
      );

    /*
     * =====================================================
     * SALVAR NO BANCO
     *
     * IMPORTANTE:
     * Este código utiliza SOMENTE os campos que existem
     * no schema.prisma que você me enviou.
     * =====================================================
     */

    const casoSalvo =
      await prisma.casoClinico.create({
        data: {
          titulo: caso.titulo,

          area: caso.area,

          especialidade:
            caso.especialidade || null,

          dificuldade:
            caso.dificuldade,

          cenario:
            caso.cenario,

          queixaInicial:
            caso.queixaInicial,

          dadosIniciais:
            dadosIniciaisJson,

          anamnese:
            anamneseJson,

          exameFisico:
            exameFisicoJson,

          sinaisVitais:
            sinaisVitaisJson,

          exames:
            caso.exames,

          evolucao:
            evolucaoJson,

          diagnosticoFinal:
            caso.diagnosticoFinal,

          explicacaoDiagnostico:
            caso.explicacaoDiagnostico,

          diagnosticosDiferenciais:
            caso.diagnosticosDiferenciais,

          pontosChave:
            caso.pontosChave,

          publicado: false,

          autorId: usuarioId,
        },
      });

    /*
     * =====================================================
     * RESPOSTA SEGURA
     *
     * O diagnóstico final NÃO é enviado para o frontend.
     * =====================================================
     */

    return NextResponse.json({
      sucesso: true,

      caso: {
        id: casoSalvo.id,

        titulo:
          casoSalvo.titulo,

        area:
          casoSalvo.area,

        especialidade:
          casoSalvo.especialidade,

        dificuldade:
          casoSalvo.dificuldade,

        cenario:
          casoSalvo.cenario,

        queixaInicial:
          casoSalvo.queixaInicial,

        dadosIniciais:
          casoSalvo.dadosIniciais,

        sinaisVitais:
          casoSalvo.sinaisVitais,

        examesDisponiveis:
          caso.exames.map(
            (exame, index) => ({
              id: index + 1,
              nome: exame.nome,
              categoria:
                exame.categoria,
              ordem: index,
            })
          ),
      },
    });
  } catch (error) {
    /*
     * =====================================================
     * ERRO DETALHADO NO SERVIDOR
     * =====================================================
     */

    console.error(
      "========================================"
    );

    console.error(
      "ERRO AO GERAR CASO CLÍNICO"
    );

    console.error(error);

    console.error(
      "========================================"
    );

    const mensagem =
      error instanceof Error
        ? error.message
        : "Erro desconhecido.";

    return NextResponse.json(
      {
        error:
          "Não foi possível gerar o caso clínico.",

        details:
          process.env.NODE_ENV ===
          "development"
            ? mensagem
            : undefined,
      },
      {
        status: 500,
      }
    );
  }
}