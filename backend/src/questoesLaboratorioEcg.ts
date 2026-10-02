import { prisma } from "../../lib/prisma";

const TEMA =
  "Laboratório ECG — Leitura Guiada";

type QuestaoBase = {
  enunciado: string;
  explicacao: string;
  dificuldade: "facil" | "medio";
  alternativas: Array<{
    texto: string;
    correta: boolean;
  }>;
};

const questoes: QuestaoBase[] = [
  {
    enunciado:
      "Ao iniciar a leitura de um ECG, qual é uma forma simples de avaliar se o ritmo é regular?",
    explicacao:
      "Compare os intervalos R–R ao longo do traçado. Intervalos semelhantes sugerem regularidade; variações importantes sugerem irregularidade.",
    dificuldade: "facil",
    alternativas: [
      { texto: "Comparar os intervalos R–R", correta: true },
      { texto: "Medir somente a altura da onda T", correta: false },
      { texto: "Observar apenas a derivação aVR", correta: false },
      { texto: "Contar apenas as ondas P", correta: false }
    ]
  },
  {
    enunciado:
      "Qual achado favorece a identificação de ritmo sinusal em um traçado didático?",
    explicacao:
      "No ritmo sinusal, espera-se uma onda P de morfologia semelhante antes de cada QRS, com relação P–QRS preservada.",
    dificuldade: "facil",
    alternativas: [
      { texto: "Onda P antes de cada QRS", correta: true },
      { texto: "Ausência obrigatória de onda P", correta: false },
      { texto: "QRS sempre maior que 200 ms", correta: false },
      { texto: "Onda T sempre invertida", correta: false }
    ]
  },
  {
    enunciado:
      "Em uma tira de ritmo, os intervalos R–R variam bastante de um batimento para outro. Como o ritmo deve ser descrito inicialmente?",
    explicacao:
      "A variação importante entre intervalos R–R caracteriza um ritmo irregular até que o mecanismo seja investigado.",
    dificuldade: "facil",
    alternativas: [
      { texto: "Irregular", correta: true },
      { texto: "Regular", correta: false },
      { texto: "Isoelétrico", correta: false },
      { texto: "Bloqueado", correta: false }
    ]
  },
  {
    enunciado:
      "No método prático de quadrantes para estimar o eixo do QRS, quais derivações são usadas primeiro?",
    explicacao:
      "DI e aVF são uma combinação prática para definir inicialmente o quadrante do eixo elétrico no plano frontal.",
    dificuldade: "facil",
    alternativas: [
      { texto: "DI e aVF", correta: true },
      { texto: "V1 e V6", correta: false },
      { texto: "aVR e V4", correta: false },
      { texto: "DII e V2", correta: false }
    ]
  },
  {
    enunciado:
      "Um QRS predominantemente positivo em DI e positivo em aVF sugere, no método dos quadrantes, um eixo situado em qual região?",
    explicacao:
      "Positividade em DI e aVF coloca o vetor médio do QRS no quadrante inferior esquerdo, frequentemente dentro da faixa habitual.",
    dificuldade: "medio",
    alternativas: [
      { texto: "Quadrante compatível com eixo habitual", correta: true },
      { texto: "Desvio extremo obrigatório", correta: false },
      { texto: "Eixo indeterminado em todos os casos", correta: false },
      { texto: "Desvio direito obrigatório acima de +180°", correta: false }
    ]
  },
  {
    enunciado:
      "Na referência didática usada no Laboratório, qual faixa é apresentada como habitual para o eixo médio do QRS?",
    explicacao:
      "O material usa aproximadamente −30° a +90° como faixa didática de referência para o eixo do QRS.",
    dificuldade: "facil",
    alternativas: [
      { texto: "−30° a +90°", correta: true },
      { texto: "+120° a +180°", correta: false },
      { texto: "−180° a −120°", correta: false },
      { texto: "0° apenas", correta: false }
    ]
  },
  {
    enunciado:
      "Em ritmo regular com papel a 25 mm/s, há 5 quadrados grandes entre dois picos R. Qual é a frequência aproximada pela regra dos 300?",
    explicacao:
      "FC ≈ 300 ÷ 5 = 60 bpm.",
    dificuldade: "facil",
    alternativas: [
      { texto: "60 bpm", correta: true },
      { texto: "30 bpm", correta: false },
      { texto: "100 bpm", correta: false },
      { texto: "150 bpm", correta: false }
    ]
  },
  {
    enunciado:
      "Em ritmo regular a 25 mm/s, há 4 quadrados grandes entre dois picos R. Qual a frequência aproximada?",
    explicacao:
      "Pela regra dos 300: 300 ÷ 4 = 75 bpm.",
    dificuldade: "facil",
    alternativas: [
      { texto: "75 bpm", correta: true },
      { texto: "60 bpm", correta: false },
      { texto: "80 bpm", correta: false },
      { texto: "120 bpm", correta: false }
    ]
  },
  {
    enunciado:
      "Em uma tira de 6 segundos de ritmo irregular foram contados 8 complexos QRS. Qual a frequência média estimada?",
    explicacao:
      "Na regra de 6 segundos, multiplica-se o número de QRS por 10: 8 × 10 = 80 bpm.",
    dificuldade: "facil",
    alternativas: [
      { texto: "80 bpm", correta: true },
      { texto: "48 bpm", correta: false },
      { texto: "60 bpm", correta: false },
      { texto: "120 bpm", correta: false }
    ]
  },
  {
    enunciado:
      "Em uma janela de 6 segundos foram contados 12 complexos QRS. Qual a frequência média estimada?",
    explicacao:
      "12 QRS em 6 segundos × 10 = 120 bpm.",
    dificuldade: "facil",
    alternativas: [
      { texto: "120 bpm", correta: true },
      { texto: "72 bpm", correta: false },
      { texto: "100 bpm", correta: false },
      { texto: "144 bpm", correta: false }
    ]
  },
  {
    enunciado:
      "Qual evento elétrico é representado principalmente pela onda P?",
    explicacao:
      "A onda P representa a despolarização atrial.",
    dificuldade: "facil",
    alternativas: [
      { texto: "Despolarização atrial", correta: true },
      { texto: "Despolarização ventricular", correta: false },
      { texto: "Repolarização ventricular", correta: false },
      { texto: "Contração mecânica dos ventrículos", correta: false }
    ]
  },
  {
    enunciado:
      "Em um ritmo sinusal didático, qual relação entre onda P e QRS é esperada?",
    explicacao:
      "Espera-se uma onda P antes de cada QRS, com relação temporal consistente.",
    dificuldade: "facil",
    alternativas: [
      { texto: "Uma P antes de cada QRS", correta: true },
      { texto: "Uma T antes de cada QRS", correta: false },
      { texto: "Ausência de P em todos os ciclos", correta: false },
      { texto: "Dois QRS para cada P obrigatoriamente", correta: false }
    ]
  },
  {
    enunciado:
      "Qual derivação costuma ser útil para visualizar a onda P durante a avaliação do ritmo?",
    explicacao:
      "DII costuma mostrar bem a onda P e é frequentemente utilizada em tiras de ritmo.",
    dificuldade: "facil",
    alternativas: [
      { texto: "DII", correta: true },
      { texto: "aVR exclusivamente", correta: false },
      { texto: "V6 exclusivamente", correta: false },
      { texto: "Nenhuma derivação mostra onda P", correta: false }
    ]
  },
  {
    enunciado:
      "O intervalo PR é medido entre quais pontos?",
    explicacao:
      "O intervalo PR vai do início da onda P até o início do complexo QRS.",
    dificuldade: "facil",
    alternativas: [
      { texto: "Início da P até o início do QRS", correta: true },
      { texto: "Fim do QRS até o início da T", correta: false },
      { texto: "Pico R até pico R", correta: false },
      { texto: "Início da T até o final da T", correta: false }
    ]
  },
  {
    enunciado:
      "O que o intervalo PR representa principalmente na leitura do ECG?",
    explicacao:
      "Ele reflete o tempo entre o início da despolarização atrial e o início da despolarização ventricular, incluindo a condução atrioventricular.",
    dificuldade: "medio",
    alternativas: [
      { texto: "Condução atrioventricular", correta: true },
      { texto: "Somente repolarização ventricular", correta: false },
      { texto: "Somente duração da onda T", correta: false },
      { texto: "Amplitude do QRS", correta: false }
    ]
  },
  {
    enunciado:
      "Qual faixa é frequentemente usada como referência didática para a duração do intervalo PR em adultos?",
    explicacao:
      "Uma faixa de referência amplamente usada é aproximadamente 120 a 200 ms.",
    dificuldade: "medio",
    alternativas: [
      { texto: "120 a 200 ms", correta: true },
      { texto: "10 a 40 ms", correta: false },
      { texto: "300 a 500 ms", correta: false },
      { texto: "600 a 800 ms", correta: false }
    ]
  },
  {
    enunciado:
      "Qual evento elétrico é representado principalmente pelo complexo QRS?",
    explicacao:
      "O QRS representa a despolarização ventricular.",
    dificuldade: "facil",
    alternativas: [
      { texto: "Despolarização ventricular", correta: true },
      { texto: "Despolarização atrial", correta: false },
      { texto: "Repolarização atrial isolada", correta: false },
      { texto: "Relaxamento mecânico atrial", correta: false }
    ]
  },
  {
    enunciado:
      "Na leitura guiada, qual característica do QRS deve ser avaliada além da amplitude?",
    explicacao:
      "Duração e morfologia do QRS são fundamentais para avaliar o padrão de ativação ventricular.",
    dificuldade: "facil",
    alternativas: [
      { texto: "Duração e morfologia", correta: true },
      { texto: "Somente a cor do traçado", correta: false },
      { texto: "Somente o número de ondas P", correta: false },
      { texto: "A posição do paciente apenas", correta: false }
    ]
  },
  {
    enunciado:
      "Um QRS com duração menor que 120 ms é geralmente descrito, de forma didática, como:",
    explicacao:
      "Um QRS abaixo de 120 ms é geralmente considerado estreito; a interpretação completa depende do contexto e da morfologia.",
    dificuldade: "medio",
    alternativas: [
      { texto: "Estreito", correta: true },
      { texto: "Obrigatoriamente bloqueado", correta: false },
      { texto: "Ausente", correta: false },
      { texto: "Sempre ventricular ectópico", correta: false }
    ]
  },
  {
    enunciado:
      "Nas derivações precordiais, qual tendência é frequentemente observada de V1 em direção a V5/V6?",
    explicacao:
      "Em geral, a onda R cresce progressivamente e a onda S perde predominância ao avançar pelas precordiais.",
    dificuldade: "medio",
    alternativas: [
      { texto: "A onda R tende a aumentar", correta: true },
      { texto: "A onda R desaparece obrigatoriamente", correta: false },
      { texto: "A onda P torna-se o QRS", correta: false },
      { texto: "A onda T deve ser sempre negativa", correta: false }
    ]
  },
  {
    enunciado:
      "O segmento ST é avaliado em relação a quê?",
    explicacao:
      "O ST deve ser comparado com uma linha de base isoelétrica adequada e com derivações contíguas.",
    dificuldade: "facil",
    alternativas: [
      { texto: "Linha de base isoelétrica", correta: true },
      { texto: "Somente o pico da onda R", correta: false },
      { texto: "Somente o início da onda P", correta: false },
      { texto: "A cor da grade do papel", correta: false }
    ]
  },
  {
    enunciado:
      "Ao observar uma alteração do segmento ST, qual conduta de leitura é mais adequada no contexto educacional?",
    explicacao:
      "É importante avaliar a magnitude, comparar derivações contíguas e considerar o contexto; uma derivação isolada não deve ser interpretada sozinha.",
    dificuldade: "medio",
    alternativas: [
      { texto: "Comparar derivações contíguas e contexto", correta: true },
      { texto: "Concluir o diagnóstico por uma derivação isolada", correta: false },
      { texto: "Ignorar a linha de base", correta: false },
      { texto: "Avaliar apenas a onda P", correta: false }
    ]
  },
  {
    enunciado:
      "O intervalo QT é medido entre quais pontos?",
    explicacao:
      "O QT vai do início do complexo QRS até o final da onda T.",
    dificuldade: "facil",
    alternativas: [
      { texto: "Início do QRS até o final da T", correta: true },
      { texto: "Início da P até o início do QRS", correta: false },
      { texto: "Pico R até o pico R seguinte", correta: false },
      { texto: "Fim da P até o início da P seguinte", correta: false }
    ]
  },
  {
    enunciado:
      "Por que a frequência cardíaca deve ser considerada ao interpretar o intervalo QT?",
    explicacao:
      "A duração do QT varia com a frequência cardíaca; por isso, em contexto clínico, costuma-se usar uma correção pela frequência (QTc).",
    dificuldade: "medio",
    alternativas: [
      { texto: "Porque o QT varia com a frequência", correta: true },
      { texto: "Porque o QT mede apenas a frequência", correta: false },
      { texto: "Porque a frequência não altera o QT", correta: false },
      { texto: "Porque o QT é igual ao R–R", correta: false }
    ]
  },
  {
    enunciado:
      "Qual evento elétrico é representado principalmente pela onda T?",
    explicacao:
      "A onda T representa a repolarização ventricular.",
    dificuldade: "facil",
    alternativas: [
      { texto: "Repolarização ventricular", correta: true },
      { texto: "Despolarização atrial", correta: false },
      { texto: "Despolarização ventricular inicial", correta: false },
      { texto: "Atraso do nó AV", correta: false }
    ]
  },
  {
    enunciado:
      "Ao analisar a onda T, quais características são importantes?",
    explicacao:
      "Polaridade, forma, simetria relativa e relação com o QRS e com derivações vizinhas fazem parte da avaliação.",
    dificuldade: "medio",
    alternativas: [
      { texto: "Polaridade e morfologia", correta: true },
      { texto: "Somente sua cor", correta: false },
      { texto: "Somente a distância entre duas ondas P", correta: false },
      { texto: "Somente o tamanho da grade", correta: false }
    ]
  },
  {
    enunciado:
      "Em papel a 25 mm/s, quanto tempo representa um quadradinho pequeno de 1 mm no eixo horizontal?",
    explicacao:
      "A 25 mm/s, cada 1 mm corresponde a 0,04 s (40 ms).",
    dificuldade: "facil",
    alternativas: [
      { texto: "0,04 s", correta: true },
      { texto: "0,20 s", correta: false },
      { texto: "0,40 s", correta: false },
      { texto: "1,00 s", correta: false }
    ]
  },
  {
    enunciado:
      "Em papel a 25 mm/s, quanto tempo representa um quadrado grande de 5 mm no eixo horizontal?",
    explicacao:
      "Cinco quadradinhos de 0,04 s formam um quadrado grande de 0,20 s.",
    dificuldade: "facil",
    alternativas: [
      { texto: "0,20 s", correta: true },
      { texto: "0,04 s", correta: false },
      { texto: "0,50 s", correta: false },
      { texto: "1,00 s", correta: false }
    ]
  },
  {
    enunciado:
      "Com sensibilidade padrão de 10 mm/mV, quanto representa verticalmente 1 mm do papel?",
    explicacao:
      "Se 10 mm correspondem a 1 mV, então 1 mm corresponde a 0,1 mV.",
    dificuldade: "facil",
    alternativas: [
      { texto: "0,1 mV", correta: true },
      { texto: "1 mV", correta: false },
      { texto: "10 mV", correta: false },
      { texto: "0,01 mV", correta: false }
    ]
  },
  {
    enunciado:
      "Qual sequência resume melhor um roteiro organizado de leitura do ECG apresentado no Laboratório?",
    explicacao:
      "Uma leitura sistemática pode seguir ritmo, frequência, eixo, onda P, PR, QRS, ST, QT e onda T, evitando pular etapas.",
    dificuldade: "medio",
    alternativas: [
      { texto: "Ritmo → frequência → eixo → P → PR → QRS → ST → QT → T", correta: true },
      { texto: "T → ST → parar a leitura", correta: false },
      { texto: "QRS → cor do papel → P", correta: false },
      { texto: "Somente frequência cardíaca", correta: false }
    ]
  }
];

export async function sincronizarQuestoesLaboratorioEcg() {
  const atuais =
    await prisma.questao.findMany({
      where: {
        tema: TEMA,
      },
      include: {
        disciplina: true,
      },
    });

  const completas =
    atuais.length === questoes.length &&
    atuais.every(function (questao) {
      return questoes.some(function (esperada) {
        return esperada.enunciado === questao.enunciado;
      });
    });

  if (completas) {
    console.log(
      "[questoes] Laboratório ECG:",
      atuais.length,
      "questões sincronizadas."
    );
    return;
  }

  let disciplina =
    atuais[0]?.disciplina ||
    await prisma.disciplina.findFirst({
      where: {
        OR: [
          {
            nome: {
              contains: "ECG",
              mode: "insensitive",
            },
          },
          {
            nome: {
              contains: "Cardio",
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        id: "asc",
      },
    });

  let usuarioId =
    atuais[0]?.usuarioId ||
    disciplina?.usuarioId ||
    null;

  if (!disciplina || !usuarioId) {
    const usuario =
      await prisma.usuario.findFirst({
        orderBy: {
          id: "asc",
        },
      });

    if (!usuario) {
      console.warn(
        "[questoes] Nenhum usuário disponível para inserir Laboratório ECG."
      );
      return;
    }

    usuarioId = usuario.id;

    disciplina =
      await prisma.disciplina.findFirst({
        where: {
          usuarioId: usuario.id,
          nome: {
            equals: "Laboratório de ECG",
            mode: "insensitive",
          },
        },
      }) ||
      await prisma.disciplina.create({
        data: {
          nome: "Laboratório de ECG",
          usuarioId: usuario.id,
        },
      });
  }

  if (atuais.length) {
    await prisma.resposta.deleteMany({
      where: {
        questaoId: {
          in: atuais.map(function (questao) {
            return questao.id;
          }),
        },
      },
    });

    await prisma.questao.deleteMany({
      where: {
        id: {
          in: atuais.map(function (questao) {
            return questao.id;
          }),
        },
      },
    });
  }

  for (const questao of questoes) {
    await prisma.questao.create({
      data: {
        enunciado: questao.enunciado,
        explicacao: questao.explicacao,
        dificuldade: questao.dificuldade,
        tema: TEMA,
        fonte: "Cortex — Laboratório de ECG",
        usuarioId,
        disciplinaId: disciplina.id,
        alternativas: {
          create: questao.alternativas,
        },
      },
    });
  }

  console.log(
    "[questoes] Inseridas",
    questoes.length,
    "questões do Laboratório de ECG."
  );
}
