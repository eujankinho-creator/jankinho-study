const cases = [

  {
    id: 1,

    title:
      "Paciente com quadro respiratorio",

    level:
      "Basico",

    levelLabel:
      "B\u00e1sico",

    sector:
      "Clinica Medica",

    sectorLabel:
      "Cl\u00ednica M\u00e9dica",

    type:
      "Acompanhamento",

    patient:
      "Paciente masculino, 67 anos",

    caseText:
      "Paciente: homem, 67 anos.\nMotivo da internacao: pneumonia.\nEstado geral: alerta, interage adequadamente e responde aos questionamentos.\nQueixas atuais: falta de ar aos esforcos e tosse com secrecao.\nSinais vitais: FR 24 irpm | SpO\u2082 92% em ar ambiente | FC 98 bpm | PA 128/76 mmHg.\nDispositivo: acesso venoso periferico em membro superior direito, sem alteracoes locais aparentes.\nPosicionamento atual: cabeceira elevada.",

    criteria: [

      {
        id:
          "estado",

        name:
          "Estado geral e nivel de consciencia",

        words: [
          "consciente",
          "orientado",
          "comunicativo"
        ],

        points:
          15
      },

      {
        id:
          "respiratorio",

        name:
          "Avaliacao respiratoria",

        words: [
          "dispneia",
          "tosse",
          "respirat",
          "fr"
        ],

        points:
          20
      },

      {
        id:
          "sinais",

        name:
          "Sinais vitais",

        words: [
          "spo2",
          "saturacao",
          "fc",
          "pa",
          "pressao",
          "irpm"
        ],

        points:
          20
      },

      {
        id:
          "acesso",

        name:
          "Avaliacao do acesso venoso",

        words: [
          "acesso venoso",
          "avp",
          "pervio",
          "flogistico"
        ],

        points:
          15
      },

      {
        id:
          "conduta",

        name:
          "Cuidados e condutas",

        words: [
          "monitorizacao",
          "monitorar",
          "manter",
          "cuidados",
          "oxigen",
          "elevar"
        ],

        points:
          15
      },

      {
        id:
          "objetividade",

        name:
          "Registro objetivo",

        words: [
          "paciente",
          "apresenta",
          "refere"
        ],

        points:
          15
      }

    ],

    reference:
      "28/09/2026 \u2013 12h. Paciente masculino, 67 anos, consciente, orientado e comunicativo, em dec\u00fabito elevado. Apresenta dispneia aos esfor\u00e7os, FR 24 irpm, SpO\u2082 92% em ar ambiente, FC 98 bpm e PA 128/76 mmHg. Refere tosse produtiva. AVP em membro superior direito, p\u00e9rvio, sem sinais flog\u00edsticos. Mantida monitoriza\u00e7\u00e3o dos sinais vitais e cuidados de enfermagem conforme prescri\u00e7\u00e3o."
  },


  {
    id: 2,

    title:
      "Pos-operatorio imediato",

    level:
      "Intermediario",

    levelLabel:
      "Intermedi\u00e1rio",

    sector:
      "Clinica Medica",

    sectorLabel:
      "Cl\u00ednica M\u00e9dica",

    type:
      "Pos-procedimento",

    patient:
      "Paciente feminina, 45 anos",

    caseText:
      "Paciente: mulher, 45 anos.\nSituacao: pos-operatorio imediato de colecistectomia.\nEstado geral: sonolenta, desperta e responde aos comandos.\nDor: abdominal, intensidade 5/10.\nSinais vitais: PA 118/72 mmHg | FC 88 bpm | FR 18 irpm | SpO\u2082 96% em ar ambiente.\nCurativo: abdominal, limpo e seco, sem sangramento visivel.\nDispositivo: acesso venoso periferico em membro superior esquerdo.",

    criteria: [

      {
        id:
          "consciencia",

        name:
          "Consciencia e estado geral",

        words: [
          "consciente",
          "orientada",
          "sonolenta",
          "responsiva"
        ],

        points:
          15
      },

      {
        id:
          "sinais",

        name:
          "Sinais vitais",

        words: [
          "pa",
          "fc",
          "fr",
          "spo2",
          "saturacao"
        ],

        points:
          20
      },

      {
        id:
          "dor",

        name:
          "Avaliacao da dor",

        words: [
          "dor",
          "5/10",
          "escala",
          "intensidade"
        ],

        points:
          15
      },

      {
        id:
          "curativo",

        name:
          "Avaliacao do curativo",

        words: [
          "curativo",
          "limpo",
          "seco",
          "sangramento"
        ],

        points:
          20
      },

      {
        id:
          "acesso",

        name:
          "Avaliacao do acesso venoso",

        words: [
          "acesso venoso",
          "avp"
        ],

        points:
          10
      },

      {
        id:
          "conduta",

        name:
          "Condutas e cuidados",

        words: [
          "monitorizacao",
          "monitorar",
          "cuidados",
          "mantido"
        ],

        points:
          20
      }

    ],

    reference:
      "28/09/2026 \u2013 12h. Paciente feminina, 45 anos, em p\u00f3s-operat\u00f3rio imediato de colecistectomia, consciente, orientada, sonolenta e responsiva aos comandos. PA 118/72 mmHg, FC 88 bpm, FR 18 irpm e SpO\u2082 96% em ar ambiente. Refere dor abdominal 5/10. Curativo abdominal limpo e seco, sem sangramento aparente. AVP em membro superior esquerdo. Mantida monitoriza\u00e7\u00e3o e cuidados de enfermagem."
  },


  {
    id: 3,

    title:
      "Paciente critico em UTI",

    level:
      "Avancado",

    levelLabel:
      "Avan\u00e7ado",

    sector:
      "UTI",

    sectorLabel:
      "UTI",

    type:
      "Acompanhamento",

    patient:
      "Paciente masculino, 72 anos",

    caseText:
      "Paciente: homem, 72 anos.\nSetor: UTI.\nMotivo da internacao: insuficiencia respiratoria.\nEstado atual: sedado.\nSuporte respiratorio: ventilacao mecanica invasiva por tubo orotraqueal.\nMonitorizacao: continua.\nSinais vitais: FC 104 bpm | PA 102/64 mmHg | SpO\u2082 95% | FR controlada pelo ventilador.\nDispositivo vascular: acesso venoso central em jugular direita, sem hiperemia ou secrecao visivel.\nEliminacao urinaria: diurese presente por cateter vesical de demora.",

    criteria: [

      {
        id:
          "neurologico",

        name:
          "Estado neurologico",

        words: [
          "sedado",
          "consciencia",
          "neurologico"
        ],

        points:
          15
      },

      {
        id:
          "ventilacao",

        name:
          "Ventilacao mecanica",

        words: [
          "ventilacao mecanica",
          "ventilador",
          "tubo",
          "tot"
        ],

        points:
          20
      },

      {
        id:
          "sinais",

        name:
          "Monitorizacao e sinais vitais",

        words: [
          "fc",
          "pa",
          "spo2",
          "monitorizacao"
        ],

        points:
          15
      },

      {
        id:
          "cateter",

        name:
          "Acesso venoso central",

        words: [
          "acesso venoso central",
          "cvc",
          "jugular",
          "hiperemia"
        ],

        points:
          15
      },

      {
        id:
          "diurese",

        name:
          "Controle urinario",

        words: [
          "diurese",
          "cateter vesical",
          "sonda vesical"
        ],

        points:
          15
      },

      {
        id:
          "conduta",

        name:
          "Cuidados de enfermagem",

        words: [
          "monitorizacao",
          "cuidados",
          "manter",
          "avaliar"
        ],

        points:
          20
      }

    ],

    reference:
      "28/09/2026 \u2013 12h. Paciente masculino, 72 anos, internado em UTI por insufici\u00eancia respirat\u00f3ria, sedado, em ventila\u00e7\u00e3o mec\u00e2nica invasiva por tubo orotraqueal. Em monitoriza\u00e7\u00e3o cont\u00ednua, FC 104 bpm, PA 102/64 mmHg e SpO\u2082 95%. CVC em jugular direita, sem hiperemia ou secre\u00e7\u00e3o no s\u00edtio de inser\u00e7\u00e3o. Diurese presente por cateter vesical de demora. Mantidos cuidados de enfermagem, monitoriza\u00e7\u00e3o cont\u00ednua e avalia\u00e7\u00e3o dos dispositivos."
  },


  {
    id: 4,

    title:
      "Intercorrencia: hipotensao",

    level:
      "Avancado",

    levelLabel:
      "Avan\u00e7ado",

    sector:
      "Emergencia",

    sectorLabel:
      "Emerg\u00eancia",

    type:
      "Intercorrencia",

    patient:
      "Paciente feminina, 59 anos",

    caseText:
      "Paciente: mulher, 59 anos.\nLocal: observacao da emergencia.\nQueixas atuais: tontura e fraqueza de inicio subito.\nEstado geral: alerta, responde adequadamente.\nSinais vitais: PA 86/54 mmHg | FC 112 bpm | FR 20 irpm | SpO\u2082 97% em ar ambiente.\nPele: fria e palida.\nDispositivo: acesso venoso periferico em membro superior direito, funcionante.\nInformacao adicional: equipe medica ja foi avisada sobre a alteracao dos sinais vitais.",

    criteria: [

      {
        id:
          "queixa",

        name:
          "Queixa principal",

        words: [
          "tontura",
          "fraqueza"
        ],

        points:
          15
      },

      {
        id:
          "sinais",

        name:
          "Sinais vitais alterados",

        words: [
          "pa",
          "86/54",
          "fc",
          "112",
          "fr",
          "spo2"
        ],

        points:
          20
      },

      {
        id:
          "avaliacao",

        name:
          "Avaliacao clinica",

        words: [
          "consciente",
          "orientada",
          "palida",
          "fria"
        ],

        points:
          15
      },

      {
        id:
          "acesso",

        name:
          "Acesso venoso",

        words: [
          "acesso venoso",
          "pervio",
          "avp"
        ],

        points:
          10
      },

      {
        id:
          "conduta",

        name:
          "Conduta diante da intercorrencia",

        words: [
          "comunicada",
          "comunicado",
          "equipe",
          "medica",
          "monitorizacao"
        ],

        points:
          25
      },

      {
        id:
          "registro",

        name:
          "Registro objetivo da intercorrencia",

        words: [
          "alteracao",
          "sinais vitais",
          "intercorrencia"
        ],

        points:
          15
      }

    ],

    reference:
      "28/09/2026 \u2013 12h. Paciente feminina, 59 anos, consciente e orientada, apresenta tontura e fraqueza s\u00fabitas. PA 86/54 mmHg, FC 112 bpm, FR 20 irpm e SpO\u2082 97% em ar ambiente. Pele fria e p\u00e1lida. AVP em membro superior direito, p\u00e9rvio. Equipe m\u00e9dica comunicada acerca da altera\u00e7\u00e3o dos sinais vitais. Mantida monitoriza\u00e7\u00e3o e assist\u00eancia de enfermagem."
  }

];


if (
  Array.isArray(
    window.EVOLUCAO_CASES_EXTRA
  )
) {

  cases.push(
    ...window.EVOLUCAO_CASES_EXTRA
  );
}


cases.forEach(
  function (item) {

    if (!item.category) {
      item.category = "Geral";
    }
  }
);


const state = {
  caseId: null,
  corrected: false
};


const $ = function (id) {
  return document.getElementById(id);
};


function normalize(text) {

  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );
}


function currentCase() {

  if (state.caseId === null) {
    return null;
  }


  return (
    cases.find(
      function (item) {
        return item.id === state.caseId;
      }
    ) || null
  );
}


function randomItem(list) {

  if (!list.length) {
    return null;
  }


  return list[
    Math.floor(
      Math.random() *
      list.length
    )
  ];
}


function escapeHtml(value) {

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


async function api(url, options) {

  const response =
    await fetch(
      url,
      {
        credentials: "same-origin",
        ...options
      }
    );


  if (response.status === 401) {

    location.href =
      "/login.html";

    throw new Error(
      "Nao autenticado."
    );
  }


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
      "Erro na requisicao."
    );
  }


  return data;
}


async function loadUser() {

  const data =
    await api(
      "/api/auth/me"
    );


  const user =
    data.usuario ||
    data;


  const name =
    user.nome ||
    "Usuario";


  const initial =
    name
      .charAt(0)
      .toUpperCase();


  $("nomeSidebar").textContent =
    name;


  $("emailSidebar").textContent =
    user.email || "";


  $("nomeHeader").textContent =
    name;


  $("avatarSidebar").textContent =
    initial;


  $("avatarHeader").textContent =
    initial;
}


/* ==========================================================
   FILTROS
   ========================================================== */

function uniqueValues(field) {

  return [
    ...new Set(
      cases
        .map(
          function (item) {
            return item[field];
          }
        )
        .filter(Boolean)
    )
  ];
}


function optionHtml(
  value,
  label
) {

  return (
    '<option value="' +
    escapeHtml(value) +
    '">' +
    escapeHtml(label) +
    '</option>'
  );
}


function levelLabel(value) {

  const found =
    cases.find(
      function (item) {
        return item.level === value;
      }
    );


  return found
    ? found.levelLabel
    : value;
}


function sectorLabel(value) {

  const found =
    cases.find(
      function (item) {
        return item.sector === value;
      }
    );


  return found
    ? found.sectorLabel
    : value;
}


function createModelFilter() {

  if ($("modelo")) {
    return;
  }


  const filterGrid =
    document.querySelector(
      ".filter-grid"
    );


  if (!filterGrid) {
    return;
  }


  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.className =
    "field";


  wrapper.innerHTML =
    `
      <label for="modelo">
        Modelo
      </label>

      <select id="modelo">
        <option value="Todos">
          Qualquer modelo compativel
        </option>
      </select>
    `;


  filterGrid.appendChild(
    wrapper
  );
}


function populateFilters() {

  $("categoria").innerHTML =
    optionHtml(
      "Todos",
      "Todas as categorias"
    ) +
    uniqueValues("category")
      .sort()
      .map(
        function (value) {
          return optionHtml(
            value,
            value
          );
        }
      )
      .join("");


  $("nivel").innerHTML =
    optionHtml(
      "Todos",
      "Todos os niveis"
    ) +
    uniqueValues("level")
      .map(
        function (value) {
          return optionHtml(
            value,
            levelLabel(value)
          );
        }
      )
      .join("");


  $("setor").innerHTML =
    optionHtml(
      "Todos",
      "Todos os setores"
    ) +
    uniqueValues("sector")
      .map(
        function (value) {
          return optionHtml(
            value,
            sectorLabel(value)
          );
        }
      )
      .join("");


  $("tipo").innerHTML =
    optionHtml(
      "Todos",
      "Todos os tipos"
    ) +
    uniqueValues("type")
      .map(
        function (value) {

          const labels = {
            "Admissao":
              "Admiss\u00e3o",

            "Acompanhamento":
              "Acompanhamento",

            "Pos-procedimento":
              "P\u00f3s-procedimento",

            "Intercorrencia":
              "Intercorr\u00eancia"
          };


          return optionHtml(
            value,
            labels[value] ||
            value
          );
        }
      )
      .join("");


  updateModelOptions();
}


function getFilters() {

  return {
    category:
      $("categoria")
        ? $("categoria").value
        : "Todos",

    level:
      $("nivel").value,

    sector:
      $("setor").value,

    type:
      $("tipo").value,

    model:
      $("modelo")
        ? $("modelo").value
        : "Todos"
  };
}


function filteredCases(
  ignoreModel
) {

  const filters =
    getFilters();


  return cases.filter(
    function (item) {

      if (
        filters.category !== "Todos" &&
        item.category !== filters.category
      ) {
        return false;
      }


      if (
        filters.level !== "Todos" &&
        item.level !== filters.level
      ) {
        return false;
      }


      if (
        filters.sector !== "Todos" &&
        item.sector !== filters.sector
      ) {
        return false;
      }


      if (
        filters.type !== "Todos" &&
        item.type !== filters.type
      ) {
        return false;
      }


      if (
        !ignoreModel &&
        filters.model !== "Todos" &&
        String(item.id) !== filters.model
      ) {
        return false;
      }


      return true;
    }
  );
}


function updateModelOptions() {

  if (!$("modelo")) {
    return;
  }


  const previous =
    $("modelo").value;


  const compatible =
    filteredCases(true);


  $("modelo").innerHTML =
    optionHtml(
      "Todos",
      compatible.length
        ? "Qualquer modelo compativel (" +
          compatible.length +
          ")"
        : "Nenhum modelo compativel"
    ) +
    compatible
      .slice()
      .sort(
        function (a, b) {

          return a.title.localeCompare(
            b.title,
            "pt-BR"
          );
        }
      )
      .map(
        function (item) {

          return optionHtml(
            String(item.id),
            item.title
          );
        }
      )
      .join("");


  const stillExists =
    Array.from(
      $("modelo").options
    )
      .some(
        function (option) {
          return (
            option.value ===
            previous
          );
        }
      );


  $("modelo").value =
    stillExists
      ? previous
      : "Todos";


  showFilterCount(
    compatible.length
  );
}


function showFilterCount(
  count
) {

  let message =
    $("filterResultMessage");


  if (!message) {

    message =
      document.createElement(
        "div"
      );


    message.id =
      "filterResultMessage";


    message.className =
      "filter-result-message";


    const actions =
      document.querySelector(
        ".config-actions"
      );


    if (actions) {

      actions.parentNode.insertBefore(
        message,
        actions
      );
    }
  }


  if (count === 0) {

    message.className =
      "filter-result-message error";


    message.textContent =
      "Nenhum caso corresponde a essa combinacao.";

  }
  else {

    message.className =
      "filter-result-message";


    message.textContent =
      count === 1
        ? "1 modelo corresponde aos filtros."
        : count +
          " modelos correspondem aos filtros.";
  }
}


function selectFiltersFromCase(
  item
) {

  if (!item) {
    return;
  }


  $("categoria").value =
    item.category ||
    "Todos";


  $("nivel").value =
    item.level;


  $("setor").value =
    item.sector;


  $("tipo").value =
    item.type;


  updateModelOptions();


  if ($("modelo")) {

    $("modelo").value =
      String(item.id);
  }
}


/* ==========================================================
   CASO
   ========================================================== */

function showPractice() {

  const grid =
    document.querySelector(
      ".practice-grid"
    );


  if (grid) {

    grid.classList.remove(
      "case-not-selected"
    );
  }
}


function hidePractice() {

  const grid =
    document.querySelector(
      ".practice-grid"
    );


  if (grid) {

    grid.classList.add(
      "case-not-selected"
    );
  }


  $("resultado")
    .classList.add(
      "hidden"
    );
}


function renderCase() {

  const item =
    currentCase();


  if (!item) {

    hidePractice();

    return;
  }


  showPractice();


  $("casoTitulo").textContent =
    item.title;


  $("casoPaciente").textContent =
    item.patient;


  $("casoTexto").textContent =
    item.caseText;


  $("caseBadges").innerHTML =
    `
      <span class="case-badge">
        ${escapeHtml(
          item.category ||
          "Geral"
        )}
      </span>

      <span class="case-badge">
        ${escapeHtml(
          item.levelLabel ||
          item.level
        )}
      </span>

      <span class="case-badge">
        ${escapeHtml(
          item.sectorLabel ||
          item.sector
        )}
      </span>

      <span class="case-badge">
        ${escapeHtml(
          item.type
        )}
      </span>
    `;
}


function resetAnswer() {

  $("resposta").value =
    "";


  state.corrected =
    false;


  $("resultado")
    .classList.add(
      "hidden"
    );


  updateAnswerInfo();
}


function chooseCase(
  item,
  updateFilters
) {

  if (!item) {
    return;
  }


  state.caseId =
    item.id;


  resetAnswer();


  if (updateFilters) {

    selectFiltersFromCase(
      item
    );
  }


  renderCase();
}


function applyConfiguration() {

  const compatible =
    filteredCases(false);


  if (!compatible.length) {

    showFilterCount(0);

    state.caseId =
      null;


    hidePractice();

    return;
  }


  /*
   * Se um modelo especifico foi escolhido,
   * existe apenas um resultado.
   *
   * Se "Qualquer modelo" estiver selecionado,
   * sorteamos SOMENTE entre os casos que
   * respeitam todos os filtros escolhidos.
   */

  const selected =
    compatible.length === 1
      ? compatible[0]
      : randomItem(
          compatible
        );


  chooseCase(
    selected,
    false
  );


  showFilterCount(
    compatible.length
  );


  document
    .querySelector(
      ".practice-grid"
    )
    ?.scrollIntoView({
      behavior:
        "smooth",

      block:
        "start"
    });
}


function generateRandomCase() {

  if (!cases.length) {
    return;
  }


  let candidates =
    cases;


  if (
    state.caseId !== null &&
    cases.length > 1
  ) {

    candidates =
      cases.filter(
        function (item) {

          return (
            item.id !==
            state.caseId
          );
        }
      );
  }


  const selected =
    randomItem(
      candidates
    );


  chooseCase(
    selected,
    true
  );


  document
    .querySelector(
      ".practice-grid"
    )
    ?.scrollIntoView({
      behavior:
        "smooth",

      block:
        "start"
    });
}


/* ==========================================================
   RESPOSTA
   ========================================================== */

function updateAnswerInfo() {

  const text =
    $("resposta").value;


  $("contadorCaracteres").textContent =
    text.length +
    (
      text.length === 1
        ? " caractere"
        : " caracteres"
    );


  const filled =
    Boolean(
      text.trim()
    );


  $("statusResposta").textContent =
    filled
      ? "Resposta preenchida"
      : "Comece a escrever";


  $("corrigirResposta").disabled =
    !filled ||
    state.caseId === null;
}


function semanticTokens(value) {

  return normalize(value)
    .replace(
      /[^a-z0-9\\s]/g,
      " "
    )
    .split(
      /\\s+/
    )
    .map(
      function (token) {

        return token
          .replace(
            /(mente|coes|cao|icos|icas|ico|ica|ados|adas|ado|ada|idos|idas|ido|ida|oes|ais|al|es|s)$/g,
            ""
          );
      }
    )
    .filter(
      function (token) {

        return (
          token.length >= 3
        );
      }
    );
}


function phraseIsNegated(
  text,
  phrase
) {

  const normalizedText =
    normalize(text);

  const normalizedPhrase =
    normalize(phrase);

  const phraseTokens =
    semanticTokens(
      normalizedPhrase
    );


  if (!phraseTokens.length) {
    return false;
  }


  const negations = [
    "nao ",
    "nega ",
    "negou ",
    "sem ",
    "ausencia de ",
    "ausente ",
    "descarta ",
    "descartado "
  ];


  for (
    const token
    of phraseTokens.slice(0, 3)
  ) {

    const index =
      normalizedText.indexOf(
        token
      );


    if (index < 0) {
      continue;
    }


    const before =
      normalizedText.slice(
        Math.max(
          0,
          index - 34
        ),
        index
      );


    if (
      negations.some(
        function (item) {
          return before.includes(item);
        }
      )
    ) {
      return true;
    }
  }


  return false;
}


function semanticPhraseScore(
  text,
  phrase
) {

  const normalizedText =
    normalize(text);

  const normalizedPhrase =
    normalize(phrase);


  if (
    !normalizedPhrase
  ) {
    return 0;
  }


  if (
    normalizedText.includes(
      normalizedPhrase
    )
  ) {

    return phraseIsNegated(
      normalizedText,
      normalizedPhrase
    )
      ? 0
      : 1;
  }


  const phraseTokens =
    semanticTokens(
      normalizedPhrase
    );

  const textTokens =
    new Set(
      semanticTokens(
        normalizedText
      )
    );


  if (
    !phraseTokens.length ||
    !textTokens.size
  ) {
    return 0;
  }


  let matches = 0;


  phraseTokens
    .forEach(
      function (token) {

        if (
          textTokens.has(
            token
          )
        ) {
          matches += 1;
        }
      }
    );


  const coverage =
    matches /
    phraseTokens.length;


  if (
    phraseTokens.length === 1
  ) {

    return coverage === 1 &&
      !phraseIsNegated(
        normalizedText,
        normalizedPhrase
      )
        ? 0.86
        : 0;
  }


  return (
    coverage >= 0.75 &&
    !phraseIsNegated(
      normalizedText,
      normalizedPhrase
    )
  )
    ? coverage
    : 0;
}



const PDF_EVOLUCAO_BASE = {
  geral: [
    {
      id: "pdf_estado",
      name: "Estado geral, exame e condicoes atuais",
      words: [
        "consciente",
        "orientado",
        "orientada",
        "sonolento",
        "sonolenta",
        "sedado",
        "sedada",
        "estado geral",
        "exame fisico",
        "condicoes fisicas",
        "condicoes emocionais"
      ],
      points: 12
    },
    {
      id: "pdf_sinais",
      name: "Sinais vitais e dados objetivos",
      words: [
        "pa",
        "pressao",
        "fc",
        "fr",
        "temperatura",
        "tax",
        "spo2",
        "saturacao",
        "glicemia"
      ],
      points: 12
    },
    {
      id: "pdf_problemas",
      name: "Problemas, queixas ou alteracoes identificadas",
      words: [
        "refere",
        "queixa",
        "dor",
        "dispneia",
        "alteracao",
        "problema",
        "intercorrencia",
        "apresenta"
      ],
      points: 12
    },
    {
      id: "pdf_cuidados",
      name: "Cuidados, condutas e resposta do paciente",
      words: [
        "cuidados",
        "conduta",
        "monitorar",
        "monitorizacao",
        "mantido",
        "mantida",
        "orientado",
        "orientada",
        "administrado",
        "realizado",
        "realizada"
      ],
      points: 12
    }
  ],

  dispositivos: {
    words: [
      "avp",
      "acesso venoso",
      "cvc",
      "cateter",
      "sonda",
      "dreno",
      "tot",
      "tubo orotraqueal",
      "ventilacao mecanica",
      "oxigen"
    ],
    criterion: {
      id: "pdf_dispositivos",
      name: "Dispositivos, acessos, sondas ou drenos",
      words: [
        "avp",
        "acesso venoso",
        "cvc",
        "cateter",
        "sonda",
        "dreno",
        "tot",
        "tubo",
        "ventilacao mecanica",
        "oxigen"
      ],
      points: 12
    }
  },

  eliminacoes: {
    words: [
      "diurese",
      "urina",
      "evacuacao",
      "eliminacoes",
      "sonda vesical",
      "svd",
      "dieta",
      "alimentacao"
    ],
    criterion: {
      id: "pdf_eliminacoes",
      name: "Alimentacao, hidratacao e eliminacoes",
      words: [
        "dieta",
        "alimentacao",
        "hidratacao",
        "diurese",
        "urina",
        "evacuacao",
        "eliminacoes"
      ],
      points: 10
    }
  },

  posOperatorio: [
    {
      id: "pdf_posop_sintomas",
      name: "Pos-operatorio: sinais, sintomas e dor",
      words: [
        "dor",
        "nausea",
        "vomito",
        "palidez",
        "cianose",
        "hipotensao",
        "tremor"
      ],
      points: 12
    },
    {
      id: "pdf_posop_curativo",
      name: "Pos-operatorio: curativo e ferida cirurgica",
      words: [
        "curativo",
        "ferida",
        "incisao",
        "limpo",
        "seca",
        "seco",
        "sangramento"
      ],
      points: 12
    }
  ],

  uti: [
    {
      id: "pdf_uti_consciencia",
      name: "UTI: nivel de consciencia e suporte",
      words: [
        "sedado",
        "rass",
        "glasgow",
        "nivel de consciencia",
        "consciente"
      ],
      points: 12
    },
    {
      id: "pdf_uti_ventilacao",
      name: "UTI: assistencia ventilatoria",
      words: [
        "ventilacao mecanica",
        "ventilador",
        "fio2",
        "peep",
        "tot",
        "tubo",
        "oxigen"
      ],
      points: 12
    }
  ],

  emergencia: [
    {
      id: "pdf_emergencia_causa",
      name: "Emergencia: causa do atendimento e condicao clinica",
      words: [
        "causa",
        "queixa",
        "hipotese",
        "tontura",
        "fraqueza",
        "dor",
        "dispneia"
      ],
      points: 12
    },
    {
      id: "pdf_emergencia_conduta",
      name: "Emergencia: problemas detectados e condutas",
      words: [
        "comunicado",
        "comunicada",
        "equipe",
        "medico",
        "medica",
        "conduta",
        "monitorizacao"
      ],
      points: 12
    }
  ]
};


function textHasAny(text, words) {

  const normalized = normalize(text);

  return words.some(
    function (word) {
      return normalized.includes(
        normalize(word)
      );
    }
  );
}


function pdfCriteriaForCase(item) {

  const criteria =
    PDF_EVOLUCAO_BASE
      .geral
      .map(
        function (criterion) {
          return {
            ...criterion,
            source:
              "Manual Evolucao e Anotacao de Enfermagem"
          };
        }
      );


  const sourceText =
    [
      item.caseText,
      item.title,
      item.type,
      item.sector
    ]
      .filter(Boolean)
      .join(" ");


  if (
    textHasAny(
      sourceText,
      PDF_EVOLUCAO_BASE
        .dispositivos
        .words
    )
  ) {
    criteria.push({
      ...PDF_EVOLUCAO_BASE
        .dispositivos
        .criterion,

      source:
        "Manual Evolucao e Anotacao de Enfermagem"
    });
  }


  if (
    textHasAny(
      sourceText,
      PDF_EVOLUCAO_BASE
        .eliminacoes
        .words
    )
  ) {
    criteria.push({
      ...PDF_EVOLUCAO_BASE
        .eliminacoes
        .criterion,

      source:
        "Manual Evolucao e Anotacao de Enfermagem"
    });
  }


  if (
    normalize(item.type)
      .includes("pos") ||
    normalize(item.title)
      .includes("pos")
  ) {
    criteria.push(
      ...PDF_EVOLUCAO_BASE
        .posOperatorio
        .map(
          function (criterion) {
            return {
              ...criterion,
              source:
                "Manual Evolucao e Anotacao de Enfermagem"
            };
          }
        )
    );
  }


  if (
    normalize(item.sector) ===
    "uti"
  ) {
    criteria.push(
      ...PDF_EVOLUCAO_BASE
        .uti
        .map(
          function (criterion) {
            return {
              ...criterion,
              source:
                "Manual Evolucao e Anotacao de Enfermagem"
            };
          }
        )
    );
  }


  if (
    normalize(item.sector)
      .includes("emergencia") ||
    normalize(item.type)
      .includes("intercorrencia")
  ) {
    criteria.push(
      ...PDF_EVOLUCAO_BASE
        .emergencia
        .map(
          function (criterion) {
            return {
              ...criterion,
              source:
                "Manual Evolucao e Anotacao de Enfermagem"
            };
          }
        )
    );
  }


  const unique = new Map();

  criteria.forEach(
    function (criterion) {
      if (!unique.has(criterion.id)) {
        unique.set(
          criterion.id,
          criterion
        );
      }
    }
  );


  return [
    ...unique.values()
  ];
}


function combinedCriteria(item) {

  return [
    ...item.criteria,
    ...pdfCriteriaForCase(item)
  ];
}


function analyzeAnswer() {

  const item =
    currentCase();


  if (!item) {
    return [];
  }


  const rawText =
    $("resposta").value;


  return combinedCriteria(
    item
  ).map(
    function (criterion) {

      let bestScore = 0;

      let matchedWord = "";


      criterion.words
        .forEach(
          function (word) {

            const score =
              semanticPhraseScore(
                rawText,
                word
              );


            if (
              score >
              bestScore
            ) {

              bestScore =
                score;

              matchedWord =
                word;
            }
          }
        );


      const found =
        bestScore >= 0.75;


      return {
        ...criterion,
        found,
        confidence:
          bestScore,
        matchedWord
      };
    }
  );
}

function renderResult() {

  const item =
    currentCase();


  if (!item) {
    return;
  }


  const criteria =
    analyzeAnswer();


  const found =
    criteria.filter(
      function (criterion) {
        return criterion.found;
      }
    );


  const missing =
    criteria.filter(
      function (criterion) {
        return !criterion.found;
      }
    );


  const earnedPoints =
    criteria.reduce(
      function (
        total,
        criterion
      ) {

        return (
          total +
          (
            criterion.found
              ? criterion.points
              : 0
          )
        );
      },
      0
    );


  const possiblePoints =
    criteria.reduce(
      function (
        total,
        criterion
      ) {

        return (
          total +
          criterion.points
        );
      },
      0
    );


  const score =
    possiblePoints
      ? Math.round(
          (
            earnedPoints /
            possiblePoints
          ) *
          100
        )
      : 0;


  const criteriaHtml =
    criteria
      .map(
        function (criterion) {

          return `
            <div class="criterion ${
              criterion.found
                ? "found"
                : "missing"
            }">

              <div class="criterion-left">

                <div class="criterion-icon">
                  ${
                    criterion.found
                      ? "\u2713"
                      : "!"
                  }
                </div>

                <div class="criterion-name">
                  ${escapeHtml(
                    criterion.name
                  )}
                </div>

              </div>

              <div class="criterion-points">

                ${
                  criterion.found
                    ? "+" +
                      criterion.points
                    : "0"
                }
                pts

              </div>

            </div>
          `;
        }
      )
      .join("");


  const missingHtml =
    missing.length
      ? `
        <div class="missing-box">

          <h3>
            O que voce pode melhorar
          </h3>

          <ul class="missing-list">

            ${missing
              .map(
                function (
                  criterion
                ) {

                  return `
                    <li>
                      <b>\u2022</b>

                      <span>
                        ${escapeHtml(
                          criterion.name
                        )}
                      </span>
                    </li>
                  `;
                }
              )
              .join("")}

          </ul>

        </div>
      `
      : "";


  $("resultado").innerHTML =
    `
      <div class="result-heading">

        <div>

          <span class="section-label">
            Resultado
          </span>

          <h2>
            Avaliacao da sua evolucao
          </h2>

          <p>
            A correcao e feita localmente com os criterios do caso e com a
            base tecnica do manual de Evolucao e Anotacao de Enfermagem,
            considerando termos equivalentes, contexto e negacoes.
          </p>

        </div>


        <div class="score-card">

          <strong>
            ${score}
          </strong>

          <span>
            / 100
          </span>

        </div>

      </div>


      <div class="result-stats">

        <div class="result-stat green">

          <span>
            Criterios encontrados
          </span>

          <strong>
            ${found.length}
          </strong>

        </div>


        <div class="result-stat yellow">

          <span>
            Criterios faltantes
          </span>

          <strong>
            ${missing.length}
          </strong>

        </div>


        <div class="result-stat">

          <span>
            Total analisado
          </span>

          <strong>
            ${criteria.length}
          </strong>

        </div>

      </div>


      <div class="criteria-section">

        <h3>
          Analise por criterio
        </h3>

        <div class="criteria-list">
          ${criteriaHtml}
        </div>

      </div>


      ${missingHtml}


      <div class="reference-box">

        <div class="reference-header">

          <h3>
            Modelo de referencia
          </h3>

          <p>
            Compare somente depois de montar
            sua propria anotacao.
          </p>

        </div>


        <div class="reference-text">
          ${escapeHtml(
            item.reference
          )}
        </div>

      </div>


      <div class="result-actions">

        <button
          id="refazerResposta"
          class="secondary-button"
          type="button"
        >
          Refazer este caso
        </button>


        <button
          id="proximoCaso"
          class="primary-button"
          type="button"
        >
          Gerar caso aleatorio
        </button>

      </div>
    `;


  $("resultado")
    .classList.remove(
      "hidden"
    );


  $("refazerResposta")
    .addEventListener(
      "click",
      function () {

        resetAnswer();

        $("resposta").focus();
      }
    );


  $("proximoCaso")
    .addEventListener(
      "click",
      generateRandomCase
    );


  setTimeout(
    function () {

      $("resultado")
        .scrollIntoView({
          behavior:
            "smooth",

          block:
            "start"
        });
    },
    50
  );
}


/* ==========================================================
   MODAL INICIAL
   ========================================================== */

function closeWelcomeModal() {

  const modal =
    $("evolutionWelcome");


  if (modal) {

    modal.remove();
  }
}


function createWelcomeModal() {

  if ($("evolutionWelcome")) {
    return;
  }


  const modal =
    document.createElement(
      "div"
    );


  modal.id =
    "evolutionWelcome";


  modal.className =
    "evolution-welcome";


  modal.innerHTML =
    `
      <div class="evolution-welcome-card">

        <div class="welcome-icon">
          \u270e
        </div>

        <span class="section-label">
          Treinamento de enfermagem
        </span>

        <h2>
          Como deseja iniciar?
        </h2>

        <p>
          Gere um contexto aleatorio para treinar
          ou escolha exatamente o tipo de anotacao
          usando os filtros.
        </p>


        <button
          id="welcomeRandom"
          class="primary-button welcome-main-button"
          type="button"
        >
          Gerar caso aleatorio
        </button>


        <button
          id="welcomeManual"
          class="secondary-button welcome-main-button"
          type="button"
        >
          Escolher categoria e modelo
        </button>

      </div>
    `;


  document.body.appendChild(
    modal
  );


  $("welcomeRandom")
    .addEventListener(
      "click",
      function () {

        closeWelcomeModal();

        generateRandomCase();
      }
    );


  $("welcomeManual")
    .addEventListener(
      "click",
      function () {

        closeWelcomeModal();


        document
          .querySelector(
            ".config-panel"
          )
          ?.scrollIntoView({
            behavior:
              "smooth",

            block:
              "start"
          });
      }
    );
}


/* ==========================================================
   EVENTOS
   ========================================================== */

function setupFilterEvents() {

  [
    "categoria",
    "nivel",
    "setor",
    "tipo"
  ]
    .forEach(
      function (id) {

        $(id)
          .addEventListener(
            "change",
            function () {

              updateModelOptions();
            }
          );
      }
    );
}


async function logout() {

  try {

    await fetch(
      "/api/auth/logout",
      {
        method:
          "POST",

        credentials:
          "same-origin"
      }
    );

  }
  finally {

    location.href =
      "/login.html";
  }
}


$("resposta")
  .addEventListener(
    "input",
    function () {

      state.corrected =
        false;


      $("resultado")
        .classList.add(
          "hidden"
        );


      updateAnswerInfo();
    }
  );


$("corrigirResposta")
  .addEventListener(
    "click",
    function () {

      if (
        state.caseId === null ||
        !$("resposta")
          .value
          .trim()
      ) {
        return;
      }


      state.corrected =
        true;


      renderResult();
    }
  );


$("aplicarConfiguracao")
  .addEventListener(
    "click",
    applyConfiguration
  );


$("novoCaso")
  .addEventListener(
    "click",
    generateRandomCase
  );


$("logoutSidebar")
  .addEventListener(
    "click",
    logout
  );


async function start() {

  try {

    await loadUser();


    createModelFilter();

    populateFilters();

    setupFilterEvents();


    $("aplicarConfiguracao")
      .textContent =
      "Aplicar configuracao";


    $("novoCaso")
      .textContent =
      "Gerar caso aleatorio";


    state.caseId =
      null;


    hidePractice();

    updateAnswerInfo();

    createWelcomeModal();

  }
  catch (error) {

    console.error(
      error
    );
  }
}


start();