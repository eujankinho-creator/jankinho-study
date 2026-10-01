import { prisma } from "../../lib/prisma";


const TEMA =
  "Semiotécnica — Nomenclatura Clínica";


type QuestaoBase = {
  enunciado: string;
  explicacao: string;
  alternativas: Array<{
    texto: string;
    correta: boolean;
  }>;
};


const questoes:
  QuestaoBase[] = [

  {
    enunciado:
      "Na avaliação dos sinais vitais de um adulto em repouso, a frequência cardíaca é de 48 bpm. Qual termo registra corretamente esse achado?",
    explicacao:
      "Frequência cardíaca abaixo da faixa usual de repouso em adultos é denominada bradicardia. O objetivo é reconhecer a nomenclatura clínica do achado, sem inferir a causa.",
    alternativas: [
      { texto: "Bradicardia", correta: true },
      { texto: "Taquicardia", correta: false },
      { texto: "Bradipneia", correta: false },
      { texto: "Taquipneia", correta: false },
      { texto: "Hipertensão", correta: false }
    ]
  },

  {
    enunciado:
      "Um paciente apresenta frequência cardíaca de 126 bpm em repouso. Qual nomenclatura descreve esse sinal vital?",
    explicacao:
      "Uma frequência cardíaca acima da faixa usual de repouso em adultos é descrita como taquicardia.",
    alternativas: [
      { texto: "Taquicardia", correta: true },
      { texto: "Bradicardia", correta: false },
      { texto: "Apneia", correta: false },
      { texto: "Hipotermia", correta: false },
      { texto: "Bradipneia", correta: false }
    ]
  },

  {
    enunciado:
      "Durante a contagem respiratória, são observados 8 movimentos respiratórios por minuto em um adulto. Como esse achado deve ser denominado?",
    explicacao:
      "Redução da frequência respiratória é denominada bradipneia.",
    alternativas: [
      { texto: "Bradipneia", correta: true },
      { texto: "Taquipneia", correta: false },
      { texto: "Dispneia", correta: false },
      { texto: "Apneia", correta: false },
      { texto: "Ortopneia", correta: false }
    ]
  },

  {
    enunciado:
      "Um adulto apresenta 30 incursões respiratórias por minuto. Qual termo técnico descreve melhor esse achado?",
    explicacao:
      "Aumento da frequência respiratória é denominado taquipneia.",
    alternativas: [
      { texto: "Taquipneia", correta: true },
      { texto: "Bradipneia", correta: false },
      { texto: "Eupneia", correta: false },
      { texto: "Apneia", correta: false },
      { texto: "Ortopneia", correta: false }
    ]
  },

  {
    enunciado:
      "No exame, ocorre interrupção completa dos movimentos respiratórios por determinado período. Qual é o termo correto?",
    explicacao:
      "Ausência de respiração é denominada apneia.",
    alternativas: [
      { texto: "Apneia", correta: true },
      { texto: "Dispneia", correta: false },
      { texto: "Taquipneia", correta: false },
      { texto: "Bradipneia", correta: false },
      { texto: "Eupneia", correta: false }
    ]
  },

  {
    enunciado:
      "O paciente relata sensação subjetiva de falta de ar e dificuldade para respirar. Qual termo deve ser usado para esse sintoma?",
    explicacao:
      "A sensação de respiração difícil ou desconfortável é descrita como dispneia.",
    alternativas: [
      { texto: "Dispneia", correta: true },
      { texto: "Apneia", correta: false },
      { texto: "Eupneia", correta: false },
      { texto: "Disfagia", correta: false },
      { texto: "Disartria", correta: false }
    ]
  },

  {
    enunciado:
      "A falta de ar piora quando o paciente se deita e melhora quando ele se senta ou eleva o tronco. Como esse achado é denominado?",
    explicacao:
      "Dispneia que surge ou piora em decúbito e melhora ao sentar-se ou elevar o tronco é chamada ortopneia.",
    alternativas: [
      { texto: "Ortopneia", correta: true },
      { texto: "Apneia", correta: false },
      { texto: "Bradipneia", correta: false },
      { texto: "Disfagia", correta: false },
      { texto: "Claudicação", correta: false }
    ]
  },

  {
    enunciado:
      "A temperatura corporal medida é de 35,0 °C. Qual nomenclatura descreve esse achado?",
    explicacao:
      "Temperatura corporal anormalmente baixa é denominada hipotermia.",
    alternativas: [
      { texto: "Hipotermia", correta: true },
      { texto: "Hipertermia", correta: false },
      { texto: "Taquicardia", correta: false },
      { texto: "Hipertensão", correta: false },
      { texto: "Eutermia", correta: false }
    ]
  },

  {
    enunciado:
      "Um paciente apresenta temperatura de 39,2 °C associada a quadro infeccioso. Qual termo clínico é o mais apropriado para registrar o sinal?",
    explicacao:
      "Temperatura elevada em contexto clínico compatível é registrada como febre. A questão treina a nomenclatura do sinal observado.",
    alternativas: [
      { texto: "Febre", correta: true },
      { texto: "Hipotermia", correta: false },
      { texto: "Bradicardia", correta: false },
      { texto: "Hipotensão", correta: false },
      { texto: "Eupneia", correta: false }
    ]
  },

  {
    enunciado:
      "A pressão arterial é de 84/52 mmHg e o paciente apresenta tontura ao levantar. Qual termo descreve a pressão arterial observada?",
    explicacao:
      "Pressão arterial abaixo da faixa esperada é descrita como hipotensão.",
    alternativas: [
      { texto: "Hipotensão", correta: true },
      { texto: "Hipertensão", correta: false },
      { texto: "Taquicardia", correta: false },
      { texto: "Hipoxemia", correta: false },
      { texto: "Hipervolemia", correta: false }
    ]
  },

  {
    enunciado:
      "Uma medida de pressão arterial de 178/108 mmHg está persistentemente elevada. Qual nomenclatura descreve esse achado?",
    explicacao:
      "Elevação persistente da pressão arterial é descrita como hipertensão. A classificação diagnóstica final depende de contexto e confirmação clínica.",
    alternativas: [
      { texto: "Hipertensão", correta: true },
      { texto: "Hipotensão", correta: false },
      { texto: "Bradicardia", correta: false },
      { texto: "Bradipneia", correta: false },
      { texto: "Hipotermia", correta: false }
    ]
  },

  {
    enunciado:
      "Na inspeção, pele e mucosas apresentam coloração azul-arroxeada, especialmente em lábios e leitos ungueais. Qual é o nome desse achado?",
    explicacao:
      "Coloração azulada de pele ou mucosas é denominada cianose.",
    alternativas: [
      { texto: "Cianose", correta: true },
      { texto: "Icterícia", correta: false },
      { texto: "Eritema", correta: false },
      { texto: "Palidez", correta: false },
      { texto: "Equimose", correta: false }
    ]
  },

  {
    enunciado:
      "A pele e as escleras apresentam coloração amarelada. Qual termo de exame físico corresponde a esse achado?",
    explicacao:
      "Coloração amarelada da pele e, especialmente, das escleras é descrita como icterícia.",
    alternativas: [
      { texto: "Icterícia", correta: true },
      { texto: "Cianose", correta: false },
      { texto: "Palidez", correta: false },
      { texto: "Eritema", correta: false },
      { texto: "Petéquia", correta: false }
    ]
  },

  {
    enunciado:
      "Na inspeção de pele e mucosas, observa-se redução evidente da coloração habitual, com aspecto esbranquiçado. Qual termo deve ser utilizado?",
    explicacao:
      "Redução da coloração habitual de pele ou mucosas é descrita como palidez.",
    alternativas: [
      { texto: "Palidez", correta: true },
      { texto: "Cianose", correta: false },
      { texto: "Icterícia", correta: false },
      { texto: "Eritema", correta: false },
      { texto: "Equimose", correta: false }
    ]
  },

  {
    enunciado:
      "Uma área da pele apresenta vermelhidão decorrente de maior fluxo sanguíneo local. Qual termo descreve esse achado?",
    explicacao:
      "Vermelhidão cutânea por aumento do fluxo sanguíneo superficial é denominada eritema.",
    alternativas: [
      { texto: "Eritema", correta: true },
      { texto: "Cianose", correta: false },
      { texto: "Icterícia", correta: false },
      { texto: "Petéquia", correta: false },
      { texto: "Palidez", correta: false }
    ]
  },

  {
    enunciado:
      "O paciente apresenta suor excessivo, visível mesmo sem esforço físico. Qual nomenclatura é utilizada para esse achado?",
    explicacao:
      "Sudorese excessiva é denominada diaforese.",
    alternativas: [
      { texto: "Diaforese", correta: true },
      { texto: "Disfagia", correta: false },
      { texto: "Disúria", correta: false },
      { texto: "Disartria", correta: false },
      { texto: "Anasarca", correta: false }
    ]
  },

  {
    enunciado:
      "Na palpação da perna edemaciada, a pressão do dedo deixa uma depressão que permanece por alguns instantes. Como esse sinal é denominado?",
    explicacao:
      "A depressão persistente após pressão digital caracteriza edema com cacifo, também conhecido como sinal de Godet.",
    alternativas: [
      { texto: "Sinal de Godet (edema com cacifo)", correta: true },
      { texto: "Sinal de Murphy", correta: false },
      { texto: "Sinal de Blumberg", correta: false },
      { texto: "Sinal de Babinski", correta: false },
      { texto: "Sinal de Lasègue", correta: false }
    ]
  },

  {
    enunciado:
      "O paciente apresenta edema intenso e generalizado envolvendo grande parte do corpo. Qual termo descreve esse quadro?",
    explicacao:
      "Edema generalizado importante é denominado anasarca.",
    alternativas: [
      { texto: "Anasarca", correta: true },
      { texto: "Ascite", correta: false },
      { texto: "Cianose", correta: false },
      { texto: "Equimose", correta: false },
      { texto: "Eritema", correta: false }
    ]
  },

  {
    enunciado:
      "São observados pequenos pontos hemorrágicos puntiformes, avermelhados ou arroxeados, na pele. Qual é o termo correto?",
    explicacao:
      "Pequenas hemorragias puntiformes na pele são denominadas petéquias.",
    alternativas: [
      { texto: "Petéquias", correta: true },
      { texto: "Equimoses", correta: false },
      { texto: "Eritemas", correta: false },
      { texto: "Edemas", correta: false },
      { texto: "Cianoses", correta: false }
    ]
  },

  {
    enunciado:
      "Uma mancha arroxeada extensa surge após extravasamento de sangue para o tecido subcutâneo, sem formar coleção palpável. Qual termo é adequado?",
    explicacao:
      "Uma área de sangramento subcutâneo maior e plana é denominada equimose.",
    alternativas: [
      { texto: "Equimose", correta: true },
      { texto: "Petéquia", correta: false },
      { texto: "Eritema", correta: false },
      { texto: "Cianose", correta: false },
      { texto: "Icterícia", correta: false }
    ]
  },

  {
    enunciado:
      "Na ausculta pulmonar, ouve-se som musical agudo, semelhante a um assobio, mais evidente durante a expiração. Qual é a nomenclatura desse ruído?",
    explicacao:
      "Sibilos são sons respiratórios musicais, geralmente agudos, relacionados ao estreitamento das vias aéreas.",
    alternativas: [
      { texto: "Sibilos", correta: true },
      { texto: "Crepitações", correta: false },
      { texto: "Atrito pleural", correta: false },
      { texto: "Sopro cardíaco", correta: false },
      { texto: "Macicez", correta: false }
    ]
  },

  {
    enunciado:
      "Na ausculta pulmonar, são percebidos sons descontínuos, breves, semelhantes a pequenos estalos, principalmente na inspiração. Qual termo corresponde ao achado?",
    explicacao:
      "Sons respiratórios adventícios descontínuos e breves são denominados crepitações ou estertores crepitantes.",
    alternativas: [
      { texto: "Crepitações (estertores crepitantes)", correta: true },
      { texto: "Sibilos", correta: false },
      { texto: "Estridor", correta: false },
      { texto: "Sopro sistólico", correta: false },
      { texto: "Fremito tóraco-vocal", correta: false }
    ]
  },

  {
    enunciado:
      "Na ausculta, identifica-se um som respiratório grave e contínuo, frequentemente relacionado a secreções ou obstrução em vias aéreas de maior calibre. Como esse ruído é chamado na prática clínica?",
    explicacao:
      "Esse achado é tradicionalmente denominado ronco. A nomenclatura pode variar entre referências; no contexto de semiotécnica, o termo é usado para som contínuo e grave.",
    alternativas: [
      { texto: "Ronco", correta: true },
      { texto: "Sibilo", correta: false },
      { texto: "Crepitação", correta: false },
      { texto: "Atrito pericárdico", correta: false },
      { texto: "Egofonia", correta: false }
    ]
  },

  {
    enunciado:
      "Na inspiração, há ruído agudo e intenso predominante sobre a região cervical, sugerindo obstrução de via aérea superior. Qual termo descreve esse som?",
    explicacao:
      "Ruído agudo associado à obstrução de via aérea superior é denominado estridor.",
    alternativas: [
      { texto: "Estridor", correta: true },
      { texto: "Sibilo", correta: false },
      { texto: "Crepitação", correta: false },
      { texto: "Ronco", correta: false },
      { texto: "Murmúrio vesicular", correta: false }
    ]
  },

  {
    enunciado:
      "Ao percutir uma região pulmonar com aumento de densidade, o examinador encontra um som menos ressonante, descrito como 'abafado'. Qual termo semiológico corresponde a esse achado?",
    explicacao:
      "Redução da ressonância à percussão é descrita como macicez ou submacicez, conforme a intensidade.",
    alternativas: [
      { texto: "Macicez", correta: true },
      { texto: "Hipersonoridade", correta: false },
      { texto: "Timpanismo", correta: false },
      { texto: "Sibilância", correta: false },
      { texto: "Crepitação", correta: false }
    ]
  },

  {
    enunciado:
      "Na avaliação pupilar, uma pupila está nitidamente maior do que a outra. Qual termo descreve essa diferença?",
    explicacao:
      "Diferença de diâmetro entre as pupilas é denominada anisocoria.",
    alternativas: [
      { texto: "Anisocoria", correta: true },
      { texto: "Miose", correta: false },
      { texto: "Midríase", correta: false },
      { texto: "Nistagmo", correta: false },
      { texto: "Ptose", correta: false }
    ]
  },

  {
    enunciado:
      "As duas pupilas estão acentuadamente contraídas. Qual termo deve ser registrado?",
    explicacao:
      "Contração pupilar é denominada miose.",
    alternativas: [
      { texto: "Miose", correta: true },
      { texto: "Midríase", correta: false },
      { texto: "Anisocoria", correta: false },
      { texto: "Nistagmo", correta: false },
      { texto: "Diplopia", correta: false }
    ]
  },

  {
    enunciado:
      "As pupilas encontram-se dilatadas bilateralmente. Qual é a nomenclatura correta?",
    explicacao:
      "Dilatação pupilar é denominada midríase.",
    alternativas: [
      { texto: "Midríase", correta: true },
      { texto: "Miose", correta: false },
      { texto: "Anisocoria", correta: false },
      { texto: "Ptose", correta: false },
      { texto: "Diplopia", correta: false }
    ]
  },

  {
    enunciado:
      "Ao inspecionar as extremidades dos dedos, observa-se aumento da convexidade das unhas e alargamento das falanges distais. Qual termo descreve esse achado?",
    explicacao:
      "Aumento bulboso das falanges distais associado à alteração do ângulo ungueal é denominado hipocratismo digital.",
    alternativas: [
      { texto: "Hipocratismo digital", correta: true },
      { texto: "Cianose periférica", correta: false },
      { texto: "Petéquia", correta: false },
      { texto: "Anasarca", correta: false },
      { texto: "Eritema", correta: false }
    ]
  },

  {
    enunciado:
      "A palpação cervical identifica linfonodos aumentados de volume. Qual termo registra esse achado de forma objetiva?",
    explicacao:
      "Aumento de linfonodos é denominado linfadenomegalia; o termo linfadenopatia também é utilizado em contexto clínico mais amplo.",
    alternativas: [
      { texto: "Linfadenomegalia", correta: true },
      { texto: "Hepatomegalia", correta: false },
      { texto: "Esplenomegalia", correta: false },
      { texto: "Cardiomegalia", correta: false },
      { texto: "Anasarca", correta: false }
    ]
  },

  {
    enunciado:
      "Após compressão do leito ungueal, a cor demora mais que o esperado para retornar. Qual expressão descreve esse achado no exame físico?",
    explicacao:
      "Retorno lento da coloração após compressão é registrado como tempo de enchimento capilar prolongado, sugerindo perfusão periférica reduzida no contexto apropriado.",
    alternativas: [
      { texto: "Tempo de enchimento capilar prolongado", correta: true },
      { texto: "Miose", correta: false },
      { texto: "Hipersonoridade", correta: false },
      { texto: "Eupneia", correta: false },
      { texto: "Normocardia", correta: false }
    ]
  }

];


function normalizar(
  valor:
    unknown
) {

  return String(
    valor ||
    ""
  )
    .normalize(
      "NFD"
    )
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase();

}


function ehQuestaoLegadaDeTermos(
  questao:
    {
      tema:
        string |
        null;

      enunciado:
        string;
    }
) {

  if (
    questao.tema ===
      TEMA
  ) {
    return false;
  }


  const tema =
    normalizar(
      questao.tema
    );


  const enunciado =
    normalizar(
      questao.enunciado
    );


  if (
    tema.includes(
      "termo"
    ) ||
    tema.includes(
      "nomenclatura"
    )
  ) {
    return true;
  }


  return [
    "termo tecnico",
    "qual o termo",
    "qual termo",
    "como se denomina",
    "como e denominado",
    "como e chamada",
    "nome tecnico",
    "denominacao correta",
  ]
    .some(
      function (
        trecho
      ) {

        return enunciado
          .includes(
            trecho
          );

      }
    );

}


export async function
sincronizarQuestoesSemiotecnica() {

  const disciplinas =
    await prisma
      .disciplina
      .findMany({
        where: {
          nome: {
            contains:
              "Semio",

            mode:
              "insensitive",
          },
        },

        orderBy: {
          id:
            "asc",
        },
      });


  if (
    disciplinas.length ===
      0
  ) {

    console.warn(
      "[questoes] Nenhuma disciplina de Semiotécnica encontrada."
    );

    return;

  }


  let totalRemovidas =
    0;


  let totalInseridas =
    0;


  for (
    const disciplina
    of disciplinas
  ) {

    const existentes =
      await prisma
        .questao
        .findMany({
          where: {
            disciplinaId:
              disciplina.id,
          },
        });


    const novasAtuais =
      existentes.filter(
        function (
          questao
        ) {

          return (
            questao.tema ===
            TEMA
          );

        }
      );


    const legadas =
      existentes.filter(
        ehQuestaoLegadaDeTermos
      );


    const removerIds =
      [
        ...legadas,
        ...(
          novasAtuais.length ===
            questoes.length
            ? []
            : novasAtuais
        ),
      ]
        .map(
          function (
            questao
          ) {

            return questao.id;

          }
        );


    if (
      removerIds.length
    ) {

      const result =
        await prisma
          .questao
          .deleteMany({
            where: {
              id: {
                in:
                  removerIds,
              },
            },
          });


      totalRemovidas +=
        result.count;

    }


    if (
      novasAtuais.length ===
        questoes.length
    ) {

      continue;

    }


    for (
      const questao
      of questoes
    ) {

      await prisma
        .questao
        .create({
          data: {
            enunciado:
              questao.enunciado,

            explicacao:
              questao.explicacao,

            dificuldade:
              "medio",

            tema:
              TEMA,

            usuarioId:
              disciplina.usuarioId,

            disciplinaId:
              disciplina.id,

            alternativas: {
              create:
                questao
                  .alternativas,
            },
          },
        });


      totalInseridas++;

    }

  }


  console.log(
    "[questoes] Semiotécnica:",
    totalRemovidas,
    "questões antigas de termos removidas;",
    totalInseridas,
    "questões novas de nomenclatura clínica inseridas."
  );

}
