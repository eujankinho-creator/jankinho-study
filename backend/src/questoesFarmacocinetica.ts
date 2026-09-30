import { prisma } from "../../lib/prisma";


const TEMA =
  "Farmacocinética — Fundamentos HAGGI PDF";


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
      "Em um laboratório, a equipe A investiga como um fármaco interage com seu receptor, enquanto a equipe B acompanha sua passagem pelo organismo até a eliminação. Qual associação identifica corretamente as duas áreas?",
    explicacao:
      "O material diferencia farmacodinâmica como o estudo da ação do fármaco sobre o organismo/receptores e farmacocinética como o percurso do fármaco pelo organismo, incluindo ADME.",
    alternativas: [
      { texto: "Equipe A: farmacodinâmica; equipe B: farmacocinética.", correta: true },
      { texto: "Equipe A: farmacocinética; equipe B: farmacodinâmica.", correta: false },
      { texto: "Equipe A: farmacotécnica; equipe B: farmacognosia.", correta: false },
      { texto: "Equipe A: farmacognosia; equipe B: farmacotécnica.", correta: false },
      { texto: "Equipe A: farmacocinética; equipe B: farmacotécnica.", correta: false }
    ]
  },

  {
    enunciado:
      "Um medicamento administrado por via oral atravessa o local de administração, alcança a circulação, chega aos tecidos, sofre modificações químicas e depois é eliminado. Qual sequência representa melhor esses processos?",
    explicacao:
      "No PDF, ADME significa Absorção, Distribuição, Metabolismo e Excreção, nessa ordem conceitual.",
    alternativas: [
      { texto: "Absorção → Distribuição → Metabolismo → Excreção.", correta: true },
      { texto: "Distribuição → Absorção → Excreção → Metabolismo.", correta: false },
      { texto: "Administração → Digestão → Metabolismo → Eliminação.", correta: false },
      { texto: "Absorção → Metabolismo → Farmacodinâmica → Excreção.", correta: false },
      { texto: "Digestão → Distribuição → Absorção → Excreção.", correta: false }
    ]
  },

  {
    enunciado:
      "Após a administração de um fármaco, ele chega mais rapidamente a um tecido A, altamente irrigado, do que a um tecido B com menor irrigação. Considerando o conteúdo do material, qual fator explica melhor essa diferença inicial?",
    explicacao:
      "O exercício relaciona maior fluxo sanguíneo tecidual com chegada mais rápida do fármaco ao tecido durante a distribuição.",
    alternativas: [
      { texto: "Maior fluxo sanguíneo no tecido A.", correta: true },
      { texto: "Menor fluxo sanguíneo no tecido A.", correta: false },
      { texto: "Transformação do tecido A em órgão excretor.", correta: false },
      { texto: "Ausência completa de proteínas plasmáticas no tecido A.", correta: false },
      { texto: "Conversão obrigatória do fármaco em pré-fármaco.", correta: false }
    ]
  },

  {
    enunciado:
      "Um fármaco circula no plasma em duas frações: uma ligada a proteínas plasmáticas e outra livre. Qual fração está diretamente disponível para interagir com alvos nos tecidos, segundo o material?",
    explicacao:
      "O PDF destaca que a fração livre é a farmacologicamente ativa e está disponível para interação com os alvos teciduais.",
    alternativas: [
      { texto: "A fração livre.", correta: true },
      { texto: "Somente a fração ligada.", correta: false },
      { texto: "Apenas a fração já excretada.", correta: false },
      { texto: "Somente a fração transformada em placebo.", correta: false },
      { texto: "Nenhuma das frações plasmáticas.", correta: false }
    ]
  },

  {
    enunciado:
      "Dois fármacos com características físico-químicas semelhantes competem pelo mesmo local de ligação em uma proteína plasmática. Qual consequência é compatível com o conteúdo estudado?",
    explicacao:
      "O material aponta que a competição pela ligação às proteínas plasmáticas pode aumentar a fração livre de um dos fármacos.",
    alternativas: [
      { texto: "Aumento da fração livre de um dos fármacos.", correta: true },
      { texto: "Redução obrigatória da fração livre dos dois fármacos.", correta: false },
      { texto: "Interrupção completa da absorção de ambos.", correta: false },
      { texto: "Conversão automática de um deles em pré-fármaco.", correta: false },
      { texto: "Transformação da proteína plasmática em enzima metabólica.", correta: false }
    ]
  },

  {
    enunciado:
      "Um estudante afirma que um fármaco fortemente ligado às proteínas plasmáticas pode ser filtrado pelos rins da mesma maneira que sua fração livre. À luz do material, qual avaliação é a mais adequada?",
    explicacao:
      "Na atividade de verdadeiro ou falso, o material contrapõe a fração ligada à disponibilidade para filtração renal e destaca a importância da fração livre.",
    alternativas: [
      { texto: "A afirmação é inadequada, pois a fração ligada não está disponível para filtração da mesma forma que a fração livre.", correta: true },
      { texto: "A afirmação é correta, porque somente a fração ligada é filtrada.", correta: false },
      { texto: "A afirmação é correta, porque ligação proteica não interfere na disponibilidade do fármaco.", correta: false },
      { texto: "A afirmação é correta apenas porque todo fármaco ligado é imediatamente excretado.", correta: false },
      { texto: "A afirmação é inadequada porque nenhuma fração de fármaco pode chegar aos rins.", correta: false }
    ]
  },

  {
    enunciado:
      "Após ser administrada, uma molécula é modificada quimicamente por enzimas do organismo, tornando-se mais hidrossolúvel e com eliminação facilitada. Qual etapa farmacocinética está sendo descrita?",
    explicacao:
      "O PDF chama esse processo de biotransformação: modificação química do fármaco por enzimas, que pode favorecer sua eliminação.",
    alternativas: [
      { texto: "Biotransformação.", correta: true },
      { texto: "Absorção.", correta: false },
      { texto: "Distribuição.", correta: false },
      { texto: "Ligação proteica.", correta: false },
      { texto: "Formulação farmacêutica.", correta: false }
    ]
  },

  {
    enunciado:
      "Um metabólito formado após biotransformação continua apresentando atividade farmacológica. Qual conclusão está de acordo com o PDF?",
    explicacao:
      "O material afirma que a biotransformação não necessariamente inativa o fármaco: ela pode inativar, reduzir ou aumentar a atividade ou formar metabólitos com efeitos diferentes.",
    alternativas: [
      { texto: "A situação é possível, pois a biotransformação não implica inativação obrigatória.", correta: true },
      { texto: "A situação é impossível, pois todo metabolismo encerra a atividade farmacológica.", correta: false },
      { texto: "A situação só seria possível se a biotransformação ocorresse exclusivamente nos rins.", correta: false },
      { texto: "A situação demonstra que não ocorreu metabolismo.", correta: false },
      { texto: "A situação só pode ocorrer com placebo.", correta: false }
    ]
  },

  {
    enunciado:
      "Em uma revisão de farmacocinética, um aluno precisa indicar o principal órgão relacionado à biotransformação apresentado no material. Qual deve ser sua resposta?",
    explicacao:
      "Na seção de verdadeiro ou falso, o material identifica o fígado como principal órgão envolvido na biotransformação.",
    alternativas: [
      { texto: "Fígado.", correta: true },
      { texto: "Baço.", correta: false },
      { texto: "Pele.", correta: false },
      { texto: "Tecido adiposo.", correta: false },
      { texto: "Medula óssea.", correta: false }
    ]
  },

  {
    enunciado:
      "Um fármaco administrado fora da circulação sistêmica passa do local de administração para essa circulação. Em qual processo do ADME esse evento se enquadra?",
    explicacao:
      "O material define absorção como a passagem do fármaco do local de administração para a circulação sistêmica.",
    alternativas: [
      { texto: "Absorção.", correta: true },
      { texto: "Distribuição.", correta: false },
      { texto: "Metabolismo.", correta: false },
      { texto: "Excreção.", correta: false },
      { texto: "Farmacodinâmica.", correta: false }
    ]
  },

  {
    enunciado:
      "Durante uma prova, um aluno define distribuição como 'a modificação química do fármaco por enzimas'. Qual correção melhor se ajusta ao conteúdo do PDF?",
    explicacao:
      "A modificação química por enzimas corresponde à biotransformação/metabolismo. Distribuição se refere ao deslocamento do fármaco pela circulação e aos tecidos.",
    alternativas: [
      { texto: "Ele confundiu distribuição com biotransformação.", correta: true },
      { texto: "A definição está correta e corresponde exatamente à distribuição.", correta: false },
      { texto: "Ele confundiu distribuição apenas com farmacotécnica.", correta: false },
      { texto: "A definição corresponde exclusivamente à farmacognosia.", correta: false },
      { texto: "Distribuição e biotransformação são sinônimos no ADME.", correta: false }
    ]
  },

  {
    enunciado:
      "Um fármaco apresenta elevado volume de distribuição, e um estudante conclui que esse número representa exatamente um espaço anatômico real ocupado pelo medicamento. Qual interpretação está correta?",
    explicacao:
      "O material ressalta que volume de distribuição é uma variável aparente e não corresponde necessariamente a um volume físico real do organismo.",
    alternativas: [
      { texto: "A conclusão está incorreta, pois o volume de distribuição é uma variável aparente.", correta: true },
      { texto: "A conclusão está correta, pois todo volume de distribuição é um espaço anatômico mensurável.", correta: false },
      { texto: "A conclusão está correta somente para medicamentos administrados por via oral.", correta: false },
      { texto: "A conclusão está incorreta porque volume de distribuição pertence à farmacodinâmica.", correta: false },
      { texto: "A conclusão está correta sempre que houver ligação a proteínas plasmáticas.", correta: false }
    ]
  },

  {
    enunciado:
      "Enalapril é administrado e posteriormente convertido no organismo em enalaprilato. Dentro dos conceitos apresentados no exercício, como o enalapril é classificado nesse exemplo?",
    explicacao:
      "O próprio exercício usa enalapril convertido em enalaprilato como exemplo de pré-fármaco.",
    alternativas: [
      { texto: "Pré-fármaco.", correta: true },
      { texto: "Placebo.", correta: false },
      { texto: "Excipiente.", correta: false },
      { texto: "Forma farmacêutica.", correta: false },
      { texto: "Proteína plasmática.", correta: false }
    ]
  },

  {
    enunciado:
      "Em um estudo clínico, um grupo recebe uma preparação sem atividade farmacológica específica para a condição tratada. Qual conceito do material corresponde a essa preparação?",
    explicacao:
      "O exercício relaciona uma preparação sem atividade farmacológica específica para a condição tratada ao conceito de placebo.",
    alternativas: [
      { texto: "Placebo.", correta: true },
      { texto: "Pré-fármaco.", correta: false },
      { texto: "Fármaco livre.", correta: false },
      { texto: "Metabólito ativo.", correta: false },
      { texto: "Droga vegetal obrigatoriamente ativa.", correta: false }
    ]
  },

  {
    enunciado:
      "Considere três itens: I) digoxina; II) comprimido contendo digoxina e excipientes; III) Digitalis purpurea usada como fonte para obtenção de digoxina. Qual associação segue os exemplos do PDF?",
    explicacao:
      "Na correlação final do material, digoxina é exemplo de fármaco; o comprimido com digoxina e excipientes é medicamento; e Digitalis purpurea usada como fonte é exemplo de droga.",
    alternativas: [
      { texto: "I = fármaco; II = medicamento; III = droga.", correta: true },
      { texto: "I = medicamento; II = droga; III = placebo.", correta: false },
      { texto: "I = placebo; II = fármaco; III = medicamento.", correta: false },
      { texto: "I = droga; II = pré-fármaco; III = fármaco.", correta: false },
      { texto: "I = pré-fármaco; II = placebo; III = medicamento.", correta: false }
    ]
  },

  {
    enunciado:
      "Uma indústria está decidindo se um princípio será apresentado como comprimido, xarope, pomada ou solução injetável e trabalha na preparação dessas formas. Qual ramo da Farmacologia está diretamente relacionado a essa atividade no exercício?",
    explicacao:
      "O PDF associa formulação, preparação e escolha da forma farmacêutica à Farmacotécnica.",
    alternativas: [
      { texto: "Farmacotécnica.", correta: true },
      { texto: "Farmacocinética.", correta: false },
      { texto: "Farmacodinâmica.", correta: false },
      { texto: "Farmacognosia.", correta: false },
      { texto: "Farmacoquímica.", correta: false }
    ]
  },

  {
    enunciado:
      "Um pesquisador estuda uma substância medicinal em seu estado natural antes de qualquer manipulação ou formulação. Qual ramo citado no PDF corresponde melhor a esse estudo?",
    explicacao:
      "O exercício associa o estudo de substâncias medicinais presentes em fontes naturais à Farmacognosia.",
    alternativas: [
      { texto: "Farmacognosia.", correta: true },
      { texto: "Farmacotécnica.", correta: false },
      { texto: "Farmacocinética.", correta: false },
      { texto: "Farmacodinâmica.", correta: false },
      { texto: "Biotransformação.", correta: false }
    ]
  },

  {
    enunciado:
      "Um estudante escreve: 'farmacocinética descreve o que o fármaco faz no organismo; farmacodinâmica descreve absorção, distribuição, metabolismo e excreção'. Qual é o problema central da afirmação?",
    explicacao:
      "Segundo o material, os conceitos foram invertidos: farmacocinética trata do percurso/ADME, enquanto farmacodinâmica trata da ação e dos efeitos do fármaco.",
    alternativas: [
      { texto: "Os conceitos de farmacocinética e farmacodinâmica foram invertidos.", correta: true },
      { texto: "Somente o conceito de absorção está incorreto.", correta: false },
      { texto: "A afirmação está totalmente correta.", correta: false },
      { texto: "Farmacocinética e farmacodinâmica são sinônimos.", correta: false },
      { texto: "O único erro é citar excreção como parte do ADME.", correta: false }
    ]
  },

  {
    enunciado:
      "Dois fármacos chegam à circulação. O fármaco X permanece majoritariamente ligado a proteínas plasmáticas, enquanto uma fração de Y permanece livre. Qual alternativa integra corretamente os conceitos cobrados no PDF?",
    explicacao:
      "O material relaciona a fração livre à atividade farmacológica e à disponibilidade para interação com alvos, enquanto a ligação proteica reduz a fração imediatamente disponível.",
    alternativas: [
      { texto: "A fração livre de Y está mais diretamente disponível para interagir com alvos teciduais.", correta: true },
      { texto: "Somente a fração ligada de X pode interagir com receptores.", correta: false },
      { texto: "A ligação de X torna todo o fármaco imediatamente disponível para filtração renal.", correta: false },
      { texto: "A presença de proteína plasmática transforma X em placebo.", correta: false },
      { texto: "A fração livre de Y deixa de participar da distribuição.", correta: false }
    ]
  },

  {
    enunciado:
      "Um medicamento oral alcança a circulação sistêmica, distribui-se preferencialmente para um tecido bem irrigado e depois sofre modificação química no fígado. Quais processos estão representados, respectivamente, pela chegada à circulação, chegada ao tecido e modificação química?",
    explicacao:
      "A passagem para a circulação corresponde à absorção; a chegada aos tecidos, à distribuição; e a modificação química, à biotransformação/metabolismo.",
    alternativas: [
      { texto: "Absorção, distribuição e metabolismo.", correta: true },
      { texto: "Distribuição, excreção e absorção.", correta: false },
      { texto: "Metabolismo, absorção e distribuição.", correta: false },
      { texto: "Farmacodinâmica, excreção e farmacotécnica.", correta: false },
      { texto: "Excreção, metabolismo e absorção.", correta: false }
    ]
  }

];


function normalizar(
  valor:
    unknown
) {

  return String(
    valor || ""
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


function ehQuestaoFarmacocineticaAntiga(
  questao:
    any
) {

  if (
    questao.tema ===
      TEMA
  ) {
    return false;
  }


  const disciplina =
    normalizar(
      questao.disciplina
        ?.nome
    );


  const tema =
    normalizar(
      questao.tema
    );


  const enunciado =
    normalizar(
      questao.enunciado
    );


  const explicacao =
    normalizar(
      questao.explicacao
    );


  const texto =
    [
      tema,
      enunciado,
      explicacao,
    ].join(
      " "
    );


  if (
    texto.includes(
      "farmacocinet"
    )
  ) {
    return true;
  }


  if (
    !disciplina.includes(
      "farmac"
    )
  ) {
    return false;
  }


  return [
    " adme",
    "absorcao",
    "volume de distribuicao",
    "proteina plasmat",
    "fracao livre",
    "ligacao prote",
    "biotransform",
  ]
    .some(
      function (
        termo
      ) {

        return texto
          .includes(
            termo
          );

      }
    );

}


export async function
sincronizarQuestoesFarmacocineticaHaggi() {

  const todas =
    await prisma
      .questao
      .findMany({
        include: {
          disciplina:
            true,
        },
      });


  const atuais =
    todas.filter(
      function (
        questao
      ) {

        return (
          questao.tema ===
          TEMA
        );

      }
    );


  const antigas =
    todas.filter(
      ehQuestaoFarmacocineticaAntiga
    );


  if (
    atuais.length ===
      questoes.length
  ) {

    if (
      antigas.length
    ) {

      await prisma
        .questao
        .deleteMany({
          where: {
            id: {
              in:
                antigas.map(
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


    console.log(
      "[questoes] Farmacocinetica HAGGI atualizada:",
      atuais.length,
      "questoes."
    );

    return;

  }


  const referencia =
    antigas[0] ||
    atuais[0];


  let disciplina:
    {
      id: number;
      nome: string;
      createdAt: Date;
      usuarioId: number;
    } |
    null |
    undefined =
      referencia
        ?.disciplina;


  let usuarioId:
    number |
    null |
    undefined =
      referencia
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
      "[questoes] Nao foi encontrada disciplina de Farmacologia para inserir o banco HAGGI."
    );

    return;

  }


  const removerIds =
    [
      ...antigas,
      ...atuais,
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
    "[questoes] Substituidas",
    antigas.length,
    "questoes antigas por",
    questoes.length,
    "questoes medias baseadas no PDF HAGGI."
  );

}
