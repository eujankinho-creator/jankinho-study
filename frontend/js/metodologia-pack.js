(function () {

  "use strict";


  const cards = [

    {
      frente:
        "[Metodologia | Natureza] O que a natureza da pesquisa define?",

      verso:
        "Define a finalidade central do estudo, como pesquisa b\u00e1sica ou aplicada."
    },

    {
      frente:
        "[Metodologia | Natureza] O que \u00e9 pesquisa aplicada?",

      verso:
        "Gera conhecimento pr\u00e1tico para solucionar problemas espec\u00edficos de uma realidade concreta."
    },

    {
      frente:
        "[Metodologia | Natureza] O que \u00e9 pesquisa b\u00e1sica ou pura?",

      verso:
        "Gera novos conhecimentos e teorias sem exigir aplica\u00e7\u00e3o pr\u00e1tica imediata."
    },

    {
      frente:
        "[Metodologia | Natureza] Qual a diferen\u00e7a entre pesquisa b\u00e1sica e aplicada?",

      verso:
        "A b\u00e1sica amplia o conhecimento; a aplicada busca resolver problemas concretos."
    },

    {
      frente:
        "[Metodologia | Natureza] Resolver um problema real de uma empresa representa qual natureza?",

      verso:
        "Pesquisa aplicada."
    },

    {
      frente:
        "[Metodologia | Natureza] Criar uma teoria sem aplica\u00e7\u00e3o imediata representa qual natureza?",

      verso:
        "Pesquisa b\u00e1sica ou pura."
    },

    {
      frente:
        "[Metodologia | Objetivos] O que os objetivos da pesquisa determinam?",

      verso:
        "O grau de profundidade com que o fen\u00f4meno ser\u00e1 investigado."
    },

    {
      frente:
        "[Metodologia | Objetivos] O que \u00e9 pesquisa explorat\u00f3ria?",

      verso:
        "Aproxima o pesquisador de um tema pouco conhecido e ajuda a formular ideias e hip\u00f3teses."
    },

    {
      frente:
        "[Metodologia | Objetivos] Quando usar pesquisa explorat\u00f3ria?",

      verso:
        "Quando o tema ainda \u00e9 pouco conhecido e precisa ser melhor compreendido."
    },

    {
      frente:
        "[Metodologia | Objetivos] O que \u00e9 pesquisa descritiva?",

      verso:
        "Descreve caracter\u00edsticas, opini\u00f5es ou comportamentos de uma popula\u00e7\u00e3o ou fen\u00f4meno."
    },

    {
      frente:
        "[Metodologia | Objetivos] A pesquisa descritiva manipula os dados?",

      verso:
        "N\u00e3o. Ela observa e descreve as caracter\u00edsticas do fen\u00f4meno."
    },

    {
      frente:
        "[Metodologia | Objetivos] O que \u00e9 pesquisa explicativa?",

      verso:
        "Busca identificar fatores e causas que explicam determinado fen\u00f4meno."
    },

    {
      frente:
        "[Metodologia | Objetivos] Qual pesquisa busca responder principalmente ao por qu\u00ea?",

      verso:
        "Pesquisa explicativa."
    },

    {
      frente:
        "[Metodologia | Objetivos] Quero conhecer melhor um tema pouco estudado. Qual objetivo?",

      verso:
        "Explorat\u00f3rio."
    },

    {
      frente:
        "[Metodologia | Objetivos] Quero descrever o perfil de uma popula\u00e7\u00e3o. Qual objetivo?",

      verso:
        "Descritivo."
    },

    {
      frente:
        "[Metodologia | Objetivos] Quero descobrir as causas de um fen\u00f4meno. Qual objetivo?",

      verso:
        "Explicativo."
    },

    {
      frente:
        "[Metodologia | Abordagem] O que a abordagem da pesquisa determina?",

      verso:
        "Direciona o tratamento e a an\u00e1lise dos dados coletados."
    },

    {
      frente:
        "[Metodologia | Abordagem] O que \u00e9 abordagem quantitativa?",

      verso:
        "Utiliza n\u00fameros, estat\u00edsticas e m\u00e9tricas para mensurar vari\u00e1veis objetivamente."
    },

    {
      frente:
        "[Metodologia | Abordagem] Que tipo de dado predomina na pesquisa quantitativa?",

      verso:
        "Dados num\u00e9ricos e mensur\u00e1veis."
    },

    {
      frente:
        "[Metodologia | Abordagem] Como dados quantitativos costumam ser analisados?",

      verso:
        "Com medidas, frequ\u00eancias, porcentagens, compara\u00e7\u00f5es e estat\u00edstica."
    },

    {
      frente:
        "[Metodologia | Abordagem] O que \u00e9 abordagem qualitativa?",

      verso:
        "Interpreta significados, subjetividades, experi\u00eancias e rela\u00e7\u00f5es sociais."
    },

    {
      frente:
        "[Metodologia | Abordagem] Que tipo de dado predomina na pesquisa qualitativa?",

      verso:
        "Relatos, discursos, percep\u00e7\u00f5es, experi\u00eancias e significados."
    },

    {
      frente:
        "[Metodologia | Abordagem] Qual o foco da an\u00e1lise qualitativa?",

      verso:
        "Compreender profundamente os significados e contextos presentes nos dados."
    },

    {
      frente:
        "[Metodologia | Abordagem] O que \u00e9 abordagem mista?",

      verso:
        "Combina dados quantitativos e qualitativos em uma mesma pesquisa."
    },

    {
      frente:
        "[Metodologia | Abordagem] Qual a vantagem da abordagem mista?",

      verso:
        "Combina mensura\u00e7\u00e3o num\u00e9rica com interpreta\u00e7\u00e3o aprofundada."
    },

    {
      frente:
        "[Metodologia | Abordagem] Analisar porcentagens de 500 respostas indica qual abordagem?",

      verso:
        "Quantitativa."
    },

    {
      frente:
        "[Metodologia | Abordagem] Interpretar entrevistas indica qual abordagem?",

      verso:
        "Qualitativa."
    },

    {
      frente:
        "[Metodologia | Abordagem] Usar estat\u00edsticas e entrevistas juntas indica qual abordagem?",

      verso:
        "Mista ou quali-quanti."
    },

    {
      frente:
        "[Metodologia | Procedimentos] O que os procedimentos t\u00e9cnicos indicam?",

      verso:
        "As fontes e o delineamento pr\u00e1tico usado para obter os dados."
    },

    {
      frente:
        "[Metodologia | Procedimentos] O que \u00e9 estudo de caso?",

      verso:
        "An\u00e1lise aprofundada de um ou poucos objetos reais."
    },

    {
      frente:
        "[Metodologia | Procedimentos] O que \u00e9 pesquisa bibliogr\u00e1fica?",

      verso:
        "Pesquisa baseada em livros, artigos e outros materiais j\u00e1 publicados."
    },

    {
      frente:
        "[Metodologia | Procedimentos] O que \u00e9 pesquisa documental?",

      verso:
        "Investiga documentos ou arquivos que ainda n\u00e3o receberam tratamento anal\u00edtico."
    },

    {
      frente:
        "[Metodologia | Procedimentos] Qual a diferen\u00e7a entre bibliogr\u00e1fica e documental?",

      verso:
        "A bibliogr\u00e1fica usa publica\u00e7\u00f5es; a documental usa documentos ainda n\u00e3o tratados analiticamente."
    },

    {
      frente:
        "[Metodologia | Procedimentos] O que \u00e9 levantamento ou survey?",

      verso:
        "Coleta dados de uma amostra de pessoas, geralmente por question\u00e1rios."
    },

    {
      frente:
        "[Metodologia | Procedimentos] Question\u00e1rio aplicado a centenas de alunos \u00e9 qual procedimento?",

      verso:
        "Levantamento ou survey."
    },

    {
      frente:
        "[Metodologia | Procedimentos] Analisar profundamente uma \u00fanica empresa \u00e9 exemplo de qu\u00ea?",

      verso:
        "Estudo de caso."
    },

    {
      frente:
        "[Metodologia | Revis\u00e3o] Quais quatro pilares classificam uma pesquisa?",

      verso:
        "Natureza, objetivos, abordagem do problema e procedimentos t\u00e9cnicos."
    },

    {
      frente:
        "[Metodologia | Revis\u00e3o] B\u00e1sica e aplicada pertencem a qual classifica\u00e7\u00e3o?",

      verso:
        "Natureza da pesquisa."
    },

    {
      frente:
        "[Metodologia | Revis\u00e3o] Explorat\u00f3ria, descritiva e explicativa pertencem a qual classifica\u00e7\u00e3o?",

      verso:
        "Objetivos da pesquisa."
    },

    {
      frente:
        "[Metodologia | Revis\u00e3o] Quantitativa, qualitativa e mista pertencem a qual classifica\u00e7\u00e3o?",

      verso:
        "Abordagem do problema."
    },

    {
      frente:
        "[Metodologia | Revis\u00e3o] Caso, bibliogr\u00e1fica, documental e survey pertencem a qual classifica\u00e7\u00e3o?",

      verso:
        "Procedimentos t\u00e9cnicos."
    }

  ];


  function normalize(
    value
  ) {

    return String(
      value || ""
    )
      .trim()
      .toLocaleLowerCase(
        "pt-BR"
      )
      .normalize(
        "NFD"
      )
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );

  }


  async function request(
    url,
    options
  ) {

    const response =
      await fetch(
        url,
        {
          credentials:
            "same-origin",

          ...options
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

      throw new Error(
        data.error ||
        "Erro ao acessar os flashcards."
      );

    }


    return data;

  }


  async function addPack() {

    const button =
      document.getElementById(
        "adicionarPacoteMetodologia"
      );


    const status =
      document.getElementById(
        "pacoteMetodologiaStatus"
      );


    if (!button) {
      return;
    }


    button.disabled =
      true;


    if (status) {

      status.textContent =
        "Adicionando...";

    }


    try {

      const current =
        await request(
          "/api/flashcards"
        );


      const existing =
        new Set(
          (
            Array.isArray(current)
              ? current
              : []
          ).map(
            function (card) {

              return normalize(
                card.frente
              );

            }
          )
        );


      let created =
        0;


      let skipped =
        0;


      for (
        const card
        of cards
      ) {

        const key =
          normalize(
            card.frente
          );


        if (
          existing.has(
            key
          )
        ) {

          skipped++;

          continue;

        }


        await request(
          "/api/flashcards",
          {

            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(
                card
              )

          }
        );


        existing.add(
          key
        );


        created++;

      }


      if (status) {

        status.textContent =
          "Pacote adicionado";

      }


      window.alert(
        "Pacote de Metodologia concluido!\n\n" +
        "Criados: " +
        created +
        "\nJa existentes: " +
        skipped
      );


      window.location.reload();

    }
    catch (
      error
    ) {

      console.error(
        error
      );


      if (status) {

        status.textContent =
          "Tentar novamente";

      }


      window.alert(
        error.message ||
        "Nao foi possivel adicionar o pacote."
      );

    }
    finally {

      button.disabled =
        false;

    }

  }


  function init() {

    const button =
      document.getElementById(
        "adicionarPacoteMetodologia"
      );


    if (!button) {
      return;
    }


    if (
      button.dataset
        .methodologyReady ===
      "true"
    ) {
      return;
    }


    button.dataset
      .methodologyReady =
      "true";


    button.addEventListener(
      "click",
      addPack
    );

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  }
  else {

    init();

  }

})();