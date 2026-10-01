import { prisma } from "../../lib/prisma";


const TEMA =
  "Semiologia II — Cálculo de Medicamentos e Gotejamento";


type QuestaoBase = {
  enunciado: string;
  explicacao: string;
  fonte: string;
  fonteUrl?: string | null;
  imagemUrl?: string | null;
  imagemAlt?: string | null;
  alternativas: Array<{
    texto: string;
    correta: boolean;
  }>;
};


const questoes:
  QuestaoBase[] = [

  {
    enunciado:
      "Você trabalha no setor de clínica cirúrgica e deve administrar 30 mg de dipirona. Como o acesso venoso foi perdido, a via foi alterada para VO. Está disponível apenas frasco em gotas com concentração de 15 mg/mL. Considerando equipo/conta-gotas padrão de 20 gotas por mL, quantas gotas serão necessárias?",
    explicacao:
      "30 mg ÷ 15 mg/mL = 2 mL. Considerando 20 gotas por mL: 2 × 20 = 40 gotas.",
    fonte:
      "MS CONCURSOS – 2021, conforme Exercícios 2026 — UFPB",
    alternativas: [
      { texto: "120 gotas", correta: false },
      { texto: "100 gotas", correta: false },
      { texto: "60 gotas", correta: false },
      { texto: "40 gotas", correta: true },
      { texto: "20 gotas", correta: false }
    ]
  },

  {
    enunciado:
      "Ao preparar SG 15% 500 mL + SG 50% 40 mL + KCl 10% 10 mL, na vazão de 40 gotas/min, quanto tempo será necessário para finalizar a infusão? Considere equipo macrogotas de 20 gotas/mL.",
    explicacao:
      "Volume total = 500 + 40 + 10 = 550 mL. Tempo em minutos = (550 × 20) ÷ 40 = 275 minutos = 4 horas e 35 minutos.",
    fonte:
      "MS CONCURSO – 2021, conforme Exercícios 2026 — UFPB",
    alternativas: [
      { texto: "5 horas e 30 minutos", correta: false },
      { texto: "5 horas e 15 minutos", correta: false },
      { texto: "4 horas e 35 minutos", correta: true },
      { texto: "4 horas e 5 minutos", correta: false },
      { texto: "6 horas e 20 minutos", correta: false }
    ]
  },

  {
    enunciado:
      "Consta na prescrição administrar 30 UI de insulina NPH. Na unidade há seringa graduada em mL e a insulina disponível é U-100 (100 UI/mL). Quantos mL devem ser aspirados?",
    explicacao:
      "Em insulina U-100, 100 UI correspondem a 1 mL. Logo, 30 UI correspondem a 30/100 = 0,3 mL.",
    fonte:
      "FUNDATEC – 2020, conforme Exercícios 2026 — UFPB",
    alternativas: [
      { texto: "0,3 mL", correta: true },
      { texto: "0,33 mL", correta: false },
      { texto: "1 mL", correta: false },
      { texto: "1,5 mL", correta: false },
      { texto: "3 mL", correta: false }
    ]
  },

  {
    enunciado:
      "O médico prescreveu 0,05 g de fenobarbital. Cada comprimido contém 100 mg. Quantos comprimidos deverão ser administrados?",
    explicacao:
      "0,05 g = 50 mg. Se cada comprimido contém 100 mg, então 50/100 = 0,5 comprimido.",
    fonte:
      "Exercícios 2026 — UFPB",
    alternativas: [
      { texto: "½ comprimido", correta: true },
      { texto: "1 comprimido", correta: false },
      { texto: "1 e ½ comprimido", correta: false },
      { texto: "2 comprimidos", correta: false },
      { texto: "2 e ½ comprimidos", correta: false }
    ]
  },

  {
    enunciado:
      "Homem, 77 anos, com DPOC exacerbada, tem prescrição de terbutalina 0,25 mg por via subcutânea. A apresentação disponível é 0,5 mg/1 mL. Ao preparar o medicamento em seringa de 100 unidades, quantas unidades devem ser aspiradas?",
    explicacao:
      "0,25 mg é metade de 0,5 mg, portanto o volume é 0,5 mL. Em uma seringa de 100 unidades correspondente a 1 mL, 0,5 mL correspondem a 50 unidades.",
    fonte:
      "HU-UFGD/EBSERH/AOCP/2014, conforme Exercícios 2026 — UFPB",
    alternativas: [
      { texto: "0,5 unidade", correta: false },
      { texto: "1 unidade", correta: false },
      { texto: "5 unidades", correta: false },
      { texto: "10 unidades", correta: false },
      { texto: "50 unidades", correta: true }
    ]
  },

  {
    enunciado:
      "Paciente chegou ao pronto atendimento com dor muscular intensa. Foi prescrito 8 mg de dexametasona por via intramuscular. Há ampolas com 4 mg/mL. Quantos mL devem ser aspirados?",
    explicacao:
      "Volume = dose prescrita ÷ concentração disponível = 8 mg ÷ 4 mg/mL = 2 mL.",
    fonte:
      "Exercícios 2026 — UFPB",
    alternativas: [
      { texto: "0,5 mL", correta: false },
      { texto: "1 mL", correta: false },
      { texto: "1,5 mL", correta: false },
      { texto: "2 mL", correta: true },
      { texto: "4 mL", correta: false }
    ]
  },

  {
    enunciado:
      "Você realizou glicemia capilar em três pacientes. Usando a tabela de correção mostrada na imagem e considerando insulina regular U-100, quais volumes devem ser aspirados para o Paciente 1 (163 mg/dL), Paciente 2 (277 mg/dL) e Paciente 3 (194 mg/dL), respectivamente?",
    explicacao:
      "163 mg/dL está na faixa 141–180: 20 UI = 0,2 mL. 277 mg/dL está na faixa 241–280: 60 UI = 0,6 mL. 194 mg/dL está na faixa 181–240: 40 UI = 0,4 mL. Portanto: 0,2 mL; 0,6 mL; 0,4 mL.",
    fonte:
      "Exercícios 2026 — UFPB",
    imagemUrl:
      "/assets/questoes/semiologia2-calculo-q7.svg",
    imagemAlt:
      "Tabela de correção da glicemia capilar com doses de insulina regular e três seringas para os pacientes 1, 2 e 3.",
    alternativas: [
      { texto: "0,2 mL; 0,6 mL; 0,4 mL", correta: true },
      { texto: "0,2 mL; 0,4 mL; 0,6 mL", correta: false },
      { texto: "0,4 mL; 0,6 mL; 0,2 mL", correta: false },
      { texto: "0,6 mL; 0,2 mL; 0,4 mL", correta: false },
      { texto: "0,4 mL; 0,2 mL; 0,6 mL", correta: false }
    ]
  },

  {
    enunciado:
      "Prescrição: administrar 5,4 g de NaCl 20%. Há ampolas de NaCl 20%. Quantos mL devem ser administrados?",
    explicacao:
      "NaCl 20% significa 20 g em 100 mL, ou 0,2 g/mL. Volume = 5,4 g ÷ 0,2 g/mL = 27 mL.",
    fonte:
      "Exercícios 2026 — UFPB",
    alternativas: [
      { texto: "2,7 mL", correta: false },
      { texto: "10 mL", correta: false },
      { texto: "20 mL", correta: false },
      { texto: "27 mL", correta: true },
      { texto: "54 mL", correta: false }
    ]
  },

  {
    enunciado:
      "Paciente com diagnóstico de sífilis congênita tem prescrição de 2.000.000 UI de penicilina cristalina EV de 4/4 h. O frasco-ampola disponível contém 5.000.000 UI e deve ser reconstituído para volume final de 10 mL. Quantos mL devem ser administrados por dose?",
    explicacao:
      "Após reconstituição para 10 mL, a concentração é 5.000.000 UI/10 mL = 500.000 UI/mL. Para 2.000.000 UI: 2.000.000 ÷ 500.000 = 4 mL.",
    fonte:
      "Exercícios 2026 — UFPB; questão equivalente à FEPESE/UFFS 2012",
    fonteUrl:
      "https://arquivos.qconcursos.com/prova/arquivo_prova/34352/fepese-2012-uffs-enfermeiro-prova.pdf",
    alternativas: [
      { texto: "2 mL", correta: false },
      { texto: "2,5 mL", correta: false },
      { texto: "4 mL", correta: true },
      { texto: "8 mL", correta: false },
      { texto: "10 mL", correta: false }
    ]
  },

  {
    enunciado:
      "Temos uma solução fisiológica de NaCl 0,9% em 120 mL para diluir um antibiótico. Interpretando 0,9% como concentração massa/volume, qual quantidade de NaCl existe nesses 120 mL?",
    explicacao:
      "Uma solução 0,9% m/v contém 0,9 g de NaCl em 100 mL. Em 120 mL: (0,9 × 120) ÷ 100 = 1,08 g de NaCl.",
    fonte:
      "Exercícios 2026 — UFPB",
    alternativas: [
      { texto: "0,108 g de NaCl", correta: false },
      { texto: "0,9 g de NaCl", correta: false },
      { texto: "1,08 g de NaCl", correta: true },
      { texto: "9 g de NaCl", correta: false },
      { texto: "10,8 g de NaCl", correta: false }
    ]
  }

];


export async function
sincronizarQuestoesCalculoMedicamentos() {

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


  const completas =
    atuais.length ===
      questoes.length &&
    atuais.every(
      function (
        questao
      ) {

        const esperada =
          questoes.find(
            function (
              item
            ) {

              return (
                item.enunciado ===
                questao.enunciado
              );

            }
          );


        return Boolean(
          esperada &&
          (
            esperada.imagemUrl ||
            null
          ) ===
            (
              questao.imagemUrl ||
              null
            )
        );

      }
    );


  if (
    completas
  ) {

    console.log(
      "[questoes] Cálculo de medicamentos:",
      atuais.length,
      "questões atualizadas."
    );

    return;

  }


  let disciplina =
    atuais[0]
      ?.disciplina ||
    null;


  let usuarioId =
    atuais[0]
      ?.usuarioId ||
    null;


  if (
    !disciplina
  ) {

    const candidatas =
      await prisma
        .disciplina
        .findMany({
          where: {
            OR: [
              {
                nome: {
                  contains:
                    "Semiologia",

                  mode:
                    "insensitive",
                },
              },
              {
                nome: {
                  contains:
                    "Semiotécnica",

                  mode:
                    "insensitive",
                },
              },
            ],
          },

          orderBy: {
            id:
              "asc",
          },
        });


    disciplina =
      candidatas.find(
        function (
          item
        ) {

          return (
            /\bII\b|\b2\b/i
              .test(
                item.nome
              )
          );

        }
      ) ||
      candidatas[0] ||
      null;


    usuarioId =
      disciplina
        ?.usuarioId ||
      null;

  }


  if (
    !disciplina ||
    !usuarioId
  ) {

    const usuario =
      await prisma
        .usuario
        .findFirst({
          orderBy: {
            id:
              "asc",
          },
        });


    if (!usuario) {

      console.warn(
        "[questoes] Nenhum usuário disponível para inserir Cálculo de Medicamentos."
      );

      return;

    }


    usuarioId =
      usuario.id;


    disciplina =
      await prisma
        .disciplina
        .create({
          data: {
            nome:
              "Semiologia e Semiotécnica da Enfermagem II",

            usuarioId:
              usuario.id,
          },
        });

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

          fonte:
            questao.fonte,

          fonteUrl:
            questao.fonteUrl ||
            null,

          imagemUrl:
            questao.imagemUrl ||
            null,

          imagemAlt:
            questao.imagemAlt ||
            null,

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
    "questões de Cálculo de Medicamentos e Gotejamento."
  );

}
