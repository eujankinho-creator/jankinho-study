import { prisma } from "../../lib/prisma";


const TEMA =
  "Questões Diego";


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
      "Qual dos seguintes agentes é um antidepressivo que inibe seletivamente a recaptação de serotonina (5-HT), com efeitos mínimos sobre a recaptação de norepinefrina?",
    explicacao:
      "A fluoxetina é um ISRS. Seu principal mecanismo é bloquear o transportador de serotonina (SERT), aumentando a disponibilidade sináptica de 5-HT, com efeito mínimo sobre a recaptação de norepinefrina.",
    alternativas: [
      { texto: "Protriptilina", correta: false },
      { texto: "Maprotilina", correta: false },
      { texto: "Fluoxetina", correta: true },
      { texto: "Desipramina", correta: false },
      { texto: "Amoxapina", correta: false }
    ]
  },

  {
    enunciado:
      "O efeito adverso mais comum associado aos antidepressivos tricíclicos é:",
    explicacao:
      "Os antidepressivos tricíclicos apresentam antagonismo muscarínico importante. Por isso, efeitos anticolinérgicos como boca seca, constipação, retenção urinária e visão borrada são muito característicos.",
    alternativas: [
      { texto: "Efeitos anticolinérgicos", correta: true },
      { texto: "Convulsões", correta: false },
      { texto: "Arritmias", correta: false },
      { texto: "Hepatotoxicidade", correta: false },
      { texto: "Nefrotoxicidade", correta: false }
    ]
  },

  {
    enunciado:
      "Um paciente apresenta depressão reativa após a morte de um parente próximo e inicia tratamento com antidepressivo tricíclico. Qual dos efeitos adversos NÃO é típico desse grupo?",
    explicacao:
      "Sedação, boca seca, hipotensão ortostática e alterações do sono podem ocorrer com tricíclicos. Discinesia tardia é mais classicamente associada ao bloqueio dopaminérgico crônico por antipsicóticos e não é um efeito típico da classe dos tricíclicos.",
    alternativas: [
      { texto: "Distúrbios no sono de movimento rápido dos olhos (REM)", correta: false },
      { texto: "Sedação", correta: false },
      { texto: "Boca seca", correta: false },
      { texto: "Hipotensão ortostática", correta: false },
      { texto: "Discinesia tardia", correta: true }
    ]
  },

  {
    enunciado:
      "Uma estudante se automedica com antidepressivo e, após consumir queijo, embutidos e vinho tinto, apresenta cefaleia, náuseas, palpitações e pico pressórico de 200/110 mmHg. Qual antidepressivo é o mais compatível com essa interação?",
    explicacao:
      "Fenelzina é um IMAO irreversível e não seletivo. A inibição de MAO reduz o metabolismo de tiramina; alimentos ricos em tiramina podem então provocar grande liberação de catecolaminas e crise hipertensiva.",
    alternativas: [
      { texto: "Sertralina", correta: false },
      { texto: "Fenelzina", correta: true },
      { texto: "Nortriptilina", correta: false },
      { texto: "Trazodona", correta: false },
      { texto: "Fluoxetina", correta: false }
    ]
  },

  {
    enunciado:
      "Uma paciente em tratamento antidepressivo há três semanas apresenta sonolência, palpitações, boca seca e sensação de desmaio ao levantar. Qual antidepressivo provavelmente está usando?",
    explicacao:
      "Amitriptilina é um tricíclico com antagonismo H1, muscarínico e α1-adrenérgico. Isso explica, respectivamente, sedação, boca seca/palpitações e hipotensão ortostática.",
    alternativas: [
      { texto: "Amitriptilina", correta: true },
      { texto: "Trazodona", correta: false },
      { texto: "Fluoxetina", correta: false },
      { texto: "Venlafaxina", correta: false },
      { texto: "Bupropiona", correta: false }
    ]
  },

  {
    enunciado:
      "Uma paciente usava fluoxetina e iniciou fenelzina apenas dois dias após suspender o ISRS. Evoluiu com instabilidade autonômica, rigidez muscular, mioclonia e hipertermia. O que melhor explica essas manifestações?",
    explicacao:
      "A associação ou troca sem washout adequado entre um ISRS de meia-vida longa, como a fluoxetina, e um IMAO, como a fenelzina, pode causar síndrome serotoninérgica por excesso de serotonina sináptica. Para fluoxetina, recomenda-se intervalo particularmente prolongado antes de iniciar um IMAO.",
    alternativas: [
      { texto: "Aumento da noradrenalina nas sinapses", correta: false },
      { texto: "Aumento da serotonina nas sinapses", correta: true },
      { texto: "Aumento da acetilcolina nas sinapses", correta: false },
      { texto: "Aumento da dopamina nas sinapses", correta: false }
    ]
  },

  {
    enunciado:
      "Qual efeito adverso proeminente pode ser observado com antidepressivos que afetam terminais nervosos adrenérgicos?",
    explicacao:
      "Vários antidepressivos com ação noradrenérgica, especialmente tricíclicos, também bloqueiam receptores α1-adrenérgicos periféricos. Esse bloqueio favorece vasodilatação e hipotensão ortostática.",
    alternativas: [
      { texto: "Insônia", correta: false },
      { texto: "Sedação", correta: false },
      { texto: "Boca seca", correta: false },
      { texto: "Hipotensão ortostática", correta: true }
    ]
  },

  {
    enunciado:
      "O que melhor justifica o limitado potencial abusivo dos fármacos antidepressivos?",
    explicacao:
      "Antidepressivos não produzem, em geral, elevação rápida e euforizante do humor em pessoas não deprimidas. Além disso, efeitos adversos podem surgir antes do benefício antidepressivo, reduzindo o potencial de reforço e abuso.",
    alternativas: [
      { texto: "A capacidade de melhorar o humor em pacientes não deprimidos e a prevalência de efeitos adversos", correta: false },
      { texto: "A incapacidade de melhorar o humor de pacientes não deprimidos e manifestações retardadas de efeitos adversos", correta: false },
      { texto: "A incapacidade de melhorar o humor de pacientes não deprimidos e manifestações imediatas de efeitos adversos", correta: true },
      { texto: "N.D.R.", correta: false }
    ]
  },

  {
    enunciado:
      "O consumo de álcool por um paciente usuário crônico de antidepressivo tricíclico pode acarretar:",
    explicacao:
      "Álcool e tricíclicos podem somar efeitos depressores sobre o sistema nervoso central. Essa interação pode aumentar sedação e prejuízo psicomotor/visual, sendo compatível com depressão do SNC e diplopia.",
    alternativas: [
      { texto: "Excitação do SNC e convulsões", correta: false },
      { texto: "Excitação do SNC com arritmias", correta: false },
      { texto: "Depressão do SNC com diplopia", correta: true },
      { texto: "Depressão do SNC sem ataxia", correta: false }
    ]
  },

  {
    enunciado:
      "Os antidepressivos tricíclicos são contraindicados ou exigem cautela importante em pacientes com convulsões porque:",
    explicacao:
      "Antidepressivos tricíclicos podem reduzir o limiar convulsivo e aumentar o risco de crises, especialmente em pessoas predispostas ou em intoxicação.",
    alternativas: [
      { texto: "Aumentam o limiar convulsivo", correta: false },
      { texto: "Diminuem o limiar convulsivo", correta: true },
      { texto: "Não interferem no limiar convulsivo", correta: false },
      { texto: "Causam excitação no SNC sem alterar o limiar", correta: false }
    ]
  }

];


export async function
sincronizarQuestoesDiego() {

  const atuais =
    await prisma
      .questao
      .findMany({
        where: {
          tema:
            TEMA,
        },

        include: {
          disciplina:
            true,
        },
      });


  if (
    atuais.length ===
    questoes.length
  ) {

    console.log(
      "[questoes] Questões Diego atualizadas:",
      atuais.length,
      "questões."
    );

    return;

  }


  let disciplina:
    {
      id: number;
      nome: string;
      createdAt: Date;
      usuarioId: number;
    }
    | null
    | undefined =
      atuais[0]
        ?.disciplina;


  let usuarioId:
    number
    | null
    | undefined =
      atuais[0]
        ?.usuarioId;


  if (
    !disciplina ||
    !usuarioId
  ) {

    disciplina =
      await prisma
        .disciplina
        .findFirst({
          where: {
            nome: {
              contains:
                "Farmacologia",

              mode:
                "insensitive",
            },
          },

          orderBy: {
            id:
              "asc",
          },
        });


    usuarioId =
      disciplina
        ?.usuarioId;

  }


  if (
    !disciplina ||
    !usuarioId
  ) {

    console.warn(
      "[questoes] Não foi encontrada disciplina de Farmacologia para inserir Questões Diego."
    );

    return;

  }


  if (
    atuais.length
  ) {

    await prisma
      .questao
      .deleteMany({
        where: {
          id: {
            in:
              atuais.map(
                function (
                  questao
                ) {

                  return questao.id;

                }
              ),
          },
        },
      });

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

          usuarioId,

          disciplinaId:
            disciplina.id,

          alternativas: {
            create:
              questao
                .alternativas,
          },
        },
      });

  }


  console.log(
    "[questoes] Inseridas",
    questoes.length,
    "Questões Diego."
  );

}
