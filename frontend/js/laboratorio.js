const initialState = {
  fc: 72,
  fr: 16,

  volumeCorrente:
    500,

  metabolismo:
    100,

  pao2:
    95,

  paco2:
    40,

  hco3:
    24,

  fio2:
    21,

  sodio:
    140,

  cloro:
    104,

  potassio:
    4.2,

  calcio:
    2.4,

  creatinina:
    0.9,

  adh:
    50,

  hidratacao:
    100,

  vasoconstricao:
    50,

  vasodilatacao:
    50
};


const state = {
  values: {
    ...initialState
  },

  category:
    "gasometria",

  breathing:
    true,

  apneaTime:
    0,

  apneaTimer:
    null,

  ecgPhase:
    0,

  spoPhase:
    0,

  previousAnimation:
    performance.now()
};


const $ = function (id) {
  return document.getElementById(id);
};


function clamp(
  value,
  min,
  max
) {

  return Math.min(
    Math.max(
      value,
      min
    ),
    max
  );
}


function effectiveState() {

  if (
    state.breathing
  ) {

    return {
      ...state.values
    };
  }


  return {
    ...state.values,

    fr:
      0,

    volumeCorrente:
      0,

    pao2:
      clamp(
        state.values.pao2 -
        state.apneaTime * 1.25,
        20,
        500
      ),

    paco2:
      clamp(
        state.values.paco2 +
        state.apneaTime * 1.35,
        10,
        150
      )
  };
}


function calculate(
  values
) {

  const ventilacaoMinuto =
    (
      values.fr *
      values.volumeCorrente
    ) /
    1000;


  const ventilacaoAlveolar =
    (
      values.fr *
      Math.max(
        values.volumeCorrente -
        150,
        0
      )
    ) /
    1000;


  const ph =
    6.1 +
    Math.log10(
      values.hco3 /
      (
        0.03 *
        Math.max(
          values.paco2,
          1
        )
      )
    );


  const anionGap =
    values.sodio -
    values.cloro -
    values.hco3;


  const winter =
    1.5 *
    values.hco3 +
    8;


  const winterMin =
    winter - 2;


  const winterMax =
    winter + 2;


  const pao2Esperada =
    95 +
    (
      values.fio2 -
      21
    ) *
    4.5;


  const pao2Final =
    values.pao2 *
    .55 +
    pao2Esperada *
    .45;


  const spo2 =
    clamp(
      90 +
      (
        pao2Final -
        60
      ) *
      .12,
      60,
      100
    );


  const pas =
    clamp(
      110 +
      (
        values.fc -
        70
      ) *
      .2 +
      values.vasoconstricao *
      .25 -
      values.vasodilatacao *
      .2,
      60,
      220
    );


  const pad =
    clamp(
      70 +
      values.vasoconstricao *
      .15 -
      values.vasodilatacao *
      .12,
      35,
      140
    );


  const pam =
    (
      pas +
      2 *
      pad
    ) /
    3;


  const rr =
    60000 /
    Math.max(
      values.fc,
      1
    );


  const qtc =
    380 *
    Math.sqrt(
      60 /
      Math.max(
        values.fc,
        1
      )
    );


  let disturbo =
    "Equilibrio acido-base";


  if (
    ph < 7.35
  ) {

    if (
      values.hco3 < 22 &&
      values.paco2 > 45
    ) {

      disturbo =
        "Acidose mista";

    }
    else if (
      values.hco3 < 22
    ) {

      disturbo =
        "Acidose metabolica";

    }
    else if (
      values.paco2 > 45
    ) {

      disturbo =
        "Acidose respiratoria";

    }
    else {

      disturbo =
        "Acidemia";
    }
  }


  if (
    ph > 7.45
  ) {

    if (
      values.hco3 > 26 &&
      values.paco2 < 35
    ) {

      disturbo =
        "Alcalose mista";

    }
    else if (
      values.hco3 > 26
    ) {

      disturbo =
        "Alcalose metabolica";

    }
    else if (
      values.paco2 < 35
    ) {

      disturbo =
        "Alcalose respiratoria";

    }
    else {

      disturbo =
        "Alcalemia";
    }
  }


  return {
    ventilacaoMinuto,
    ventilacaoAlveolar,

    ph,

    anionGap,

    winter,
    winterMin,
    winterMax,

    pao2Final,
    spo2,

    pas,
    pad,
    pam,

    rr,
    qtc,

    disturbo
  };
}


const categories = [

  {
    id:
      "gasometria",

    label:
      "Gasometria",

    sliders: [

      {
        field:
          "paco2",

        label:
          "PaCO\u2082",

        min:
          20,

        max:
          100,

        step:
          1,

        unit:
          "mmHg"
      },

      {
        field:
          "hco3",

        label:
          "HCO\u2083\u207b",

        min:
          10,

        max:
          40,

        step:
          1,

        unit:
          "mEq/L"
      },

      {
        field:
          "pao2",

        label:
          "PaO\u2082",

        min:
          30,

        max:
          300,

        step:
          1,

        unit:
          "mmHg"
      },

      {
        field:
          "fio2",

        label:
          "FiO\u2082",

        min:
          21,

        max:
          100,

        step:
          1,

        unit:
          "%"
      }

    ]
  },


  {
    id:
      "respiratorio",

    label:
      "Respiratorio",

    sliders: [

      {
        field:
          "fr",

        label:
          "Frequencia respiratoria",

        min:
          4,

        max:
          40,

        step:
          1,

        unit:
          "irpm"
      },

      {
        field:
          "volumeCorrente",

        label:
          "Volume corrente",

        min:
          200,

        max:
          1200,

        step:
          10,

        unit:
          "mL"
      },

      {
        field:
          "metabolismo",

        label:
          "Metabolismo",

        min:
          50,

        max:
          200,

        step:
          5,

        unit:
          "%"
      }

    ]
  },


  {
    id:
      "cardio",

    label:
      "Cardiovascular",

    sliders: [

      {
        field:
          "fc",

        label:
          "Frequencia cardiaca",

        min:
          30,

        max:
          180,

        step:
          1,

        unit:
          "bpm"
      },

      {
        field:
          "vasoconstricao",

        label:
          "Vasoconstricao",

        min:
          0,

        max:
          100,

        step:
          1,

        unit:
          "%"
      },

      {
        field:
          "vasodilatacao",

        label:
          "Vasodilatacao",

        min:
          0,

        max:
          100,

        step:
          1,

        unit:
          "%"
      }

    ]
  },


  {
    id:
      "renal",

    label:
      "Renal",

    sliders: [

      {
        field:
          "hidratacao",

        label:
          "Hidratacao",

        min:
          0,

        max:
          150,

        step:
          1,

        unit:
          "%"
      },

      {
        field:
          "adh",

        label:
          "ADH",

        min:
          0,

        max:
          100,

        step:
          1,

        unit:
          "%"
      },

      {
        field:
          "creatinina",

        label:
          "Creatinina",

        min:
          .3,

        max:
          5,

        step:
          .1,

        unit:
          "mg/dL"
      }

    ]
  },


  {
    id:
      "eletrolitos",

    label:
      "Eletrolitos",

    sliders: [

      {
        field:
          "sodio",

        label:
          "Sodio",

        min:
          110,

        max:
          170,

        step:
          1,

        unit:
          "mEq/L"
      },

      {
        field:
          "potassio",

        label:
          "Potassio",

        min:
          2,

        max:
          8,

        step:
          .1,

        unit:
          "mEq/L"
      },

      {
        field:
          "calcio",

        label:
          "Calcio",

        min:
          1.5,

        max:
          3.5,

        step:
          .1,

        unit:
          "mmol/L"
      },

      {
        field:
          "cloro",

        label:
          "Cloro",

        min:
          80,

        max:
          130,

        step:
          1,

        unit:
          "mEq/L"
      }

    ]
  }

];


async function api(
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


  if (
    response.status ===
    401
  ) {

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
    data.usuario;


  const name =
    user.nome ||
    "Usuario";


  const initial =
    name
      .charAt(0)
      .toUpperCase();


  $("nomeSidebar")
    .textContent =
    name;


  $("emailSidebar")
    .textContent =
    user.email || "";


  $("nomeHeader")
    .textContent =
    name;


  $("avatarSidebar")
    .textContent =
    initial;


  $("avatarHeader")
    .textContent =
    initial;
}


function metric(
  label,
  value,
  unit,
  accent
) {

  return `
    <article
      class="metric-card ${
        accent
          ? "accent"
          : ""
      }"
    >

      <span>
        ${label}
      </span>

      <div class="metric-value">

        <strong>
          ${value}
        </strong>

        ${
          unit
            ? `
              <small>
                ${unit}
              </small>
            `
            : ""
        }

      </div>

    </article>
  `;
}


function resultRow(
  label,
  value,
  unit
) {

  return `
    <div class="result-row">

      <span>
        ${label}
      </span>

      <strong>

        ${value}

        ${
          unit
            ? `
              <small>
                ${unit}
              </small>
            `
            : ""
        }

      </strong>

    </div>
  `;
}


function renderTabs() {

  $("tabs")
    .innerHTML =
    categories
      .map(
        function (
          category
        ) {

          return `
            <button
              type="button"
              class="control-tab ${
                state.category ===
                category.id
                  ? "active"
                  : ""
              }"
              data-category="${category.id}"
            >
              ${category.label}
            </button>
          `;

        }
      )
      .join("");


  document
    .querySelectorAll(
      "[data-category]"
    )
    .forEach(
      function (button) {

        button.addEventListener(
          "click",
          function () {

            state.category =
              button.dataset
                .category;


            renderTabs();

            renderControls();
          }
        );
      }
    );
}


function renderControls() {

  const category =
    categories.find(
      function (item) {

        return (
          item.id ===
          state.category
        );

      }
    );


  if (!category) {
    return;
  }


  $("controls")
    .innerHTML =
    category.sliders
      .map(
        function (
          slider
        ) {

          const value =
            state.values[
              slider.field
            ];


          return `
            <div class="slider-control">

              <div class="slider-heading">

                <span>
                  ${slider.label}
                </span>

                <span class="slider-number">

                  ${value}

                  <small>
                    ${slider.unit}
                  </small>

                </span>

              </div>


              <input
                type="range"

                min="${slider.min}"
                max="${slider.max}"
                step="${slider.step}"

                value="${value}"

                data-slider="${slider.field}"
              >


              <div class="slider-limits">

                <span>
                  ${slider.min}
                </span>

                <span>
                  ${slider.max}
                </span>

              </div>

            </div>
          `;

        }
      )
      .join("");


  document
    .querySelectorAll(
      "[data-slider]"
    )
    .forEach(
      function (input) {

        input.addEventListener(
          "input",
          function () {

            const field =
              input.dataset
                .slider;


            state.values[
              field
            ] =
              Number(
                input.value
              );


            renderControls();

            renderData();
          }
        );
      }
    );
}


function renderTopMetrics(
  values,
  results
) {

  $("topMetrics")
    .innerHTML =
    [
      metric(
        "pH",
        results.ph.toFixed(2),
        "",
        true
      ),

      metric(
        "PaCO\u2082",
        values.paco2.toFixed(0),
        "mmHg"
      ),

      metric(
        "HCO\u2083\u207b",
        values.hco3.toFixed(0),
        "mEq/L"
      ),

      metric(
        "PaO\u2082",
        Math.round(
          results.pao2Final
        ),
        "mmHg"
      ),

      metric(
        "SpO\u2082",
        Math.round(
          results.spo2
        ),
        "%"
      ),

      metric(
        "FC",
        state.values.fc,
        "bpm"
      ),

      metric(
        "PA",
        Math.round(
          results.pas
        ) +
        "/" +
        Math.round(
          results.pad
        ),
        "mmHg"
      ),

      metric(
        "PAM",
        Math.round(
          results.pam
        ),
        "mmHg"
      )
    ]
      .join("");
}


function renderGasometry(
  values,
  results
) {

  $("gasometry")
    .innerHTML =
    `
      <article class="gas-card">

        <span>
          pH
        </span>

        <strong class="orange">
          ${results.ph.toFixed(2)}
        </strong>

        <small>
          referencia 7,35-7,45
        </small>

      </article>


      <article class="gas-card">

        <span>
          PaCO\u2082
        </span>

        <strong>
          ${values.paco2.toFixed(0)}
        </strong>

        <small>
          mmHg
        </small>

      </article>


      <article class="gas-card">

        <span>
          HCO\u2083\u207b
        </span>

        <strong>
          ${values.hco3.toFixed(0)}
        </strong>

        <small>
          mEq/L
        </small>

      </article>


      <article class="gas-card">

        <span>
          PaO\u2082
        </span>

        <strong class="blue">

          ${Math.round(
            results.pao2Final
          )}

        </strong>

        <small>
          mmHg
        </small>

      </article>
    `;


  $("gasometryFooter")
    .innerHTML =
    `
      <div class="simple-stat">

        <span>
          FiO\u2082
        </span>

        <strong>
          ${state.values.fio2}%
        </strong>

      </div>


      <div class="simple-stat">

        <span>
          Anion gap
        </span>

        <strong>

          ${results.anionGap.toFixed(1)}

          <small>
            mEq/L
          </small>

        </strong>

      </div>


      <div class="simple-stat">

        <span>
          Disturbio
        </span>

        <strong class="orange">
          ${results.disturbo}
        </strong>

      </div>
    `;
}


function renderMechanics(
  values,
  results
) {

  const cards = [

    [
      "FR",
      values.fr,
      "irpm"
    ],

    [
      "VC",
      values.volumeCorrente,
      "mL"
    ],

    [
      "VE",
      results
        .ventilacaoMinuto
        .toFixed(1),
      "L/min"
    ],

    [
      "VA",
      results
        .ventilacaoAlveolar
        .toFixed(1),
      "L/min"
    ]

  ];


  $("respiratoryMechanics")
    .innerHTML =
    cards
      .map(
        function (item) {

          return `
            <article class="mechanics-card">

              <span>
                ${item[0]}
              </span>

              <strong>
                ${item[1]}
              </strong>

              <small>
                ${item[2]}
              </small>

            </article>
          `;

        }
      )
      .join("");
}


function renderInterpretation(
  values,
  results
) {

  $("interpretation")
    .innerHTML =
    `
      <div class="interpretation-highlight">

        <span>
          Acido-base
        </span>

        <strong>
          ${results.disturbo}
        </strong>

      </div>

      ${resultRow(
        "pH",
        results.ph.toFixed(2)
      )}

      ${resultRow(
        "PaCO\u2082",
        values.paco2.toFixed(0),
        "mmHg"
      )}

      ${resultRow(
        "HCO\u2083\u207b",
        values.hco3.toFixed(0),
        "mEq/L"
      )}

      ${resultRow(
        "Anion gap",
        results.anionGap.toFixed(1)
      )}

      ${resultRow(
        "Winter",
        results.winterMin.toFixed(1) +
        "-" +
        results.winterMax.toFixed(1)
      )}
    `;
}


function renderHemodynamics(
  results
) {

  $("hemodynamics")
    .innerHTML =
    `
      ${resultRow(
        "Pressao sistolica",
        Math.round(
          results.pas
        ),
        "mmHg"
      )}

      ${resultRow(
        "Pressao diastolica",
        Math.round(
          results.pad
        ),
        "mmHg"
      )}

      ${resultRow(
        "PAM",
        Math.round(
          results.pam
        ),
        "mmHg"
      )}

      ${resultRow(
        "FC",
        state.values.fc,
        "bpm"
      )}

      ${resultRow(
        "R-R",
        Math.round(
          results.rr
        ),
        "ms"
      )}
    `;
}


function renderElectrolytes() {

  $("electrolytes")
    .innerHTML =
    `
      ${resultRow(
        "Na\u207a",
        state.values.sodio,
        "mEq/L"
      )}

      ${resultRow(
        "K\u207a",
        state.values
          .potassio
          .toFixed(1),
        "mEq/L"
      )}

      ${resultRow(
        "Ca\u00b2\u207a",
        state.values
          .calcio
          .toFixed(1),
        "mmol/L"
      )}

      ${resultRow(
        "Cl\u207b",
        state.values.cloro,
        "mEq/L"
      )}
    `;
}


function renderRespirationState() {

  $("respirationState")
    .innerHTML =
    `
      <div
        class="breathing-card ${
          state.breathing
            ? "normal"
            : "apnea"
        }"
      >

        <span>
          Estado
        </span>

        <strong>

          ${
            state.breathing
              ? "RESPIRANDO"
              : "APNEIA"
          }

        </strong>

        ${
          state.breathing
            ? ""
            : `
              <small>
                Tempo:
                ${state.apneaTime}s
              </small>
            `
        }

      </div>
    `;
}


function renderECGStatus(
  results
) {

  const potassium =
    state.values.potassio;


  const sodium =
    state.values.sodio;


  const calcium =
    state.values.calcio;


  const qrs =
    potassium >= 6
      ? "QRS ALARGANDO"
      : sodium < 125
      ? "CONDUCAO MODULADA"
      : "QRS PRESERVADO";


  const qt =
    calcium < 2.1
      ? "QT PROLONGADO"
      : calcium > 2.7
      ? "QT ENCURTADO"
      : "QT PRESERVADO";


  const t =
    potassium > 5.5
      ? "T APICULADA"
      : potassium < 3.2
      ? "T ACHATADA + U"
      : "REPOLARIZACAO";


  const sodiumStatus =
    sodium < 125
      ? "Na+ BAIXO"
      : sodium > 155
      ? "Na+ ALTO"
      : "Na+ NORMAL";


  $("ecgResults")
    .innerHTML =
    `
      <div class="monitor-result">
        <span>QRS</span>
        <strong>${qrs}</strong>
      </div>

      <div class="monitor-result">
        <span>QTc</span>
        <strong>
          ${Math.round(
            results.qtc
          )} ms
        </strong>
      </div>

      <div class="monitor-result">
        <span>Ca</span>
        <strong>${qt}</strong>
      </div>

      <div class="monitor-result">
        <span>K</span>
        <strong>${t}</strong>
      </div>

      <div class="monitor-result">
        <span>Na</span>
        <strong>${sodiumStatus}</strong>
      </div>
    `;
}


function renderSPOStatus(
  results
) {

  const status =
    results.spo2 >= 95
      ? "NORMAL"
      : results.spo2 >= 90
      ? "ATENCAO"
      : "BAIXA";


  const cssClass =
    results.spo2 >= 95
      ? "normal"
      : results.spo2 >= 90
      ? "warning"
      : "danger";


  $("spoResults")
    .innerHTML =
    `
      <div class="monitor-result">

        <span>
          Status
        </span>

        <strong class="${cssClass}">
          ${status}
        </strong>

      </div>


      <div class="monitor-result">

        <span>
          PaO\u2082
        </span>

        <strong>

          ${Math.round(
            results.pao2Final
          )} mmHg

        </strong>

      </div>


      <div class="monitor-result">

        <span>
          FC
        </span>

        <strong>
          ${state.values.fc} bpm
        </strong>

      </div>
    `;
}


function renderRespirationButton() {

  $("statusDot")
    .className =
    "status-dot " +
    (
      state.breathing
        ? "breathing"
        : "apnea"
    );


  $("respirationButton")
    .textContent =
    state.breathing
      ? "Pausar respiracao"
      : "Retomar respiracao";


  $("respirationButton")
    .className =
    state.breathing
      ? "lab-button"
      : "lab-button danger";


  $("apneaBadge")
    .classList.toggle(
      "hidden",
      state.breathing
    );


  $("apneaSeconds")
    .textContent =
    state.apneaTime;
}


function renderData() {

  const values =
    effectiveState();


  const results =
    calculate(
      values
    );


  renderTopMetrics(
    values,
    results
  );


  renderGasometry(
    values,
    results
  );


  renderMechanics(
    values,
    results
  );


  renderInterpretation(
    values,
    results
  );


  renderHemodynamics(
    results
  );


  renderElectrolytes();


  renderRespirationState();


  renderECGStatus(
    results
  );


  renderSPOStatus(
    results
  );


  renderRespirationButton();


  $("ecgFC")
    .textContent =
    state.values.fc;


  $("pulseFC")
    .textContent =
    state.values.fc +
    " bpm";


  $("spo2Number")
    .textContent =
    Math.round(
      results.spo2
    );
}


function resizeCanvas(
  canvas
) {

  const dpr =
    window.devicePixelRatio ||
    1;


  const rect =
    canvas
      .getBoundingClientRect();


  const width =
    Math.max(
      1,
      Math.round(
        rect.width *
        dpr
      )
    );


  const height =
    Math.max(
      1,
      Math.round(
        rect.height *
        dpr
      )
    );


  if (
    canvas.width !== width ||
    canvas.height !== height
  ) {

    canvas.width =
      width;


    canvas.height =
      height;
  }


  return {
    width,
    height,
    dpr
  };
}


function drawGrid(
  context,
  width,
  height,
  color
) {

  context.strokeStyle =
    color;


  context.lineWidth =
    1;


  const gap =
    Math.max(
      20,
      width / 35
    );


  context.beginPath();


  for (
    let x = 0;
    x < width;
    x += gap
  ) {

    context.moveTo(
      x,
      0
    );


    context.lineTo(
      x,
      height
    );
  }


  for (
    let y = 0;
    y < height;
    y += gap
  ) {

    context.moveTo(
      0,
      y
    );


    context.lineTo(
      width,
      y
    );
  }


  context.stroke();
}


function ecgValue(
  cycle
) {

  const potassium =
    state.values.potassio;


  const calcium =
    state.values.calcio;


  const sodium =
    state.values.sodio;


  const kFactor =
    clamp(
      (
        potassium -
        4.2
      ) /
      2,
      -1,
      1
    );


  const calciumFactor =
    clamp(
      (
        calcium -
        2.4
      ) /
      1.1,
      -1,
      1
    );


  const sodiumFactor =
    clamp(
      (
        sodium -
        140
      ) /
      20,
      -1,
      1
    );


  const tAmplitude =
    clamp(
      13 +
      kFactor *
      15,
      5,
      29
    );


  const sodiumQrsEffect =
    Math.abs(
      sodiumFactor
    ) *
    .008;


  const qrsWidth =
    .035 +
    Math.max(
      kFactor,
      0
    ) *
    .025 +
    (
      sodiumFactor < 0
        ? sodiumQrsEffect
        : sodiumQrsEffect *
          .35
    );


  const qrsAmplitude =
    clamp(
      50 +
      sodiumFactor *
      8,
      38,
      58
    );


  const pAmplitude =
    clamp(
      10 +
      sodiumFactor *
      1.8,
      7,
      12
    );


  const qtWidth =
    clamp(
      .22 -
      calciumFactor *
      .07,
      .13,
      .34
    );


  const uAmplitude =
    potassium < 3.2
      ? 7
      : 0;


  let y = 0;


  if (
    cycle >= .04 &&
    cycle < .12
  ) {

    const t =
      (
        cycle -
        .04
      ) /
      .08;


    y =
      Math.sin(
        t *
        Math.PI
      ) *
      pAmplitude;
  }


  if (
    cycle >= .17 &&
    cycle < .185
  ) {

    const t =
      (
        cycle -
        .17
      ) /
      .015;


    y =
      -12 *
      Math.sin(
        t *
        Math.PI
      );
  }


  if (
    cycle >= .185 &&
    cycle < .205
  ) {

    const t =
      (
        cycle -
        .185
      ) /
      .02;


    y =
      qrsAmplitude *
      Math.sin(
        t *
        Math.PI
      );
  }


  if (
    cycle >= .205 &&
    cycle <
      .205 +
      qrsWidth
  ) {

    const t =
      (
        cycle -
        .205
      ) /
      qrsWidth;


    y =
      -22 *
      Math.sin(
        t *
        Math.PI
      );
  }


  if (
    cycle >= .29 &&
    cycle <
      .29 +
      qtWidth
  ) {

    const t =
      (
        cycle -
        .29
      ) /
      qtWidth;


    y =
      tAmplitude *
      Math.sin(
        t *
        Math.PI
      );
  }


  if (
    uAmplitude > 0 &&
    cycle >= .43 &&
    cycle < .52
  ) {

    const t =
      (
        cycle -
        .43
      ) /
      .09;


    y +=
      uAmplitude *
      Math.sin(
        t *
        Math.PI
      );
  }


  return y;
}


function drawECG() {

  const canvas =
    $("ecgCanvas");


  const size =
    resizeCanvas(
      canvas
    );


  const context =
    canvas.getContext(
      "2d"
    );


  context.clearRect(
    0,
    0,
    size.width,
    size.height
  );


  drawGrid(
    context,
    size.width,
    size.height,
    "rgba(40,120,70,.15)"
  );


  context.beginPath();


  const points =
    Math.max(
      400,
      Math.floor(
        size.width /
        2
      )
    );


  for (
    let i = 0;
    i < points;
    i++
  ) {

    const normalized =
      i /
      (
        points -
        1
      );


    const cycle =
      (
        normalized +
        state.ecgPhase
      ) %
      1;


    const value =
      ecgValue(
        cycle
      );


    const x =
      normalized *
      size.width;


    const y =
      size.height /
      2 -
      value *
      size.dpr *
      1.35;


    if (
      i === 0
    ) {

      context.moveTo(
        x,
        y
      );

    }
    else {

      context.lineTo(
        x,
        y
      );
    }
  }


  context.strokeStyle =
    "#48e879";


  context.lineWidth =
    2 *
    size.dpr;


  context.shadowColor =
    "rgba(72,232,121,.35)";


  context.shadowBlur =
    5 *
    size.dpr;


  context.stroke();


  context.shadowBlur =
    0;
}


function plethValue(
  cycle,
  spo2
) {

  let y = 0;


  if (
    cycle < .12
  ) {

    const t =
      cycle /
      .12;


    y =
      10 +
      42 *
      t;

  }
  else if (
    cycle < .22
  ) {

    const t =
      (
        cycle -
        .12
      ) /
      .1;


    y =
      52 -
      15 *
      t;

  }
  else if (
    cycle < .28
  ) {

    const t =
      (
        cycle -
        .22
      ) /
      .06;


    y =
      37 -
      28 *
      t;

  }
  else {

    const t =
      (
        cycle -
        .28
      ) /
      .72;


    y =
      9 -
      5 *
      t;
  }


  return (
    y *
    clamp(
      spo2 /
      100,
      .55,
      1
    )
  );
}


function drawSPO() {

  const canvas =
    $("spoCanvas");


  const size =
    resizeCanvas(
      canvas
    );


  const context =
    canvas.getContext(
      "2d"
    );


  const values =
    effectiveState();


  const results =
    calculate(
      values
    );


  context.clearRect(
    0,
    0,
    size.width,
    size.height
  );


  drawGrid(
    context,
    size.width,
    size.height,
    "rgba(30,100,180,.16)"
  );


  context.beginPath();


  const points =
    Math.max(
      400,
      Math.floor(
        size.width /
        2
      )
    );


  for (
    let i = 0;
    i < points;
    i++
  ) {

    const normalized =
      i /
      (
        points -
        1
      );


    const cycle =
      (
        normalized +
        state.spoPhase
      ) %
      1;


    const value =
      plethValue(
        cycle,
        results.spo2
      );


    const x =
      normalized *
      size.width;


    const y =
      size.height /
      2 -
      value *
      size.dpr *
      .9;


    if (
      i === 0
    ) {

      context.moveTo(
        x,
        y
      );

    }
    else {

      context.lineTo(
        x,
        y
      );
    }
  }


  context.strokeStyle =
    "#38a8ff";


  context.lineWidth =
    2 *
    size.dpr;


  context.shadowColor =
    "rgba(56,168,255,.3)";


  context.shadowBlur =
    5 *
    size.dpr;


  context.stroke();


  context.shadowBlur =
    0;
}


function animationLoop(
  now
) {

  const delta =
    now -
    state.previousAnimation;


  state.previousAnimation =
    now;


  state.ecgPhase +=
    delta *
    (
      state.values.fc /
      60000
    );


  state.spoPhase +=
    delta *
    (
      state.values.fc /
      60000
    );


  state.ecgPhase %=
    1;


  state.spoPhase %=
    1;


  drawECG();

  drawSPO();


  requestAnimationFrame(
    animationLoop
  );
}


function toggleRespiration() {

  state.breathing =
    !state.breathing;


  state.apneaTime =
    0;


  if (
    state.apneaTimer
  ) {

    clearInterval(
      state.apneaTimer
    );


    state.apneaTimer =
      null;
  }


  if (
    !state.breathing
  ) {

    state.apneaTimer =
      setInterval(
        function () {

          state.apneaTime =
            Math.min(
              state.apneaTime +
              1,
              120
            );


          renderData();

        },
        1000
      );
  }


  renderData();
}


function resetLaboratory() {

  state.values = {
    ...initialState
  };


  state.category =
    "gasometria";


  state.breathing =
    true;


  state.apneaTime =
    0;


  if (
    state.apneaTimer
  ) {

    clearInterval(
      state.apneaTimer
    );


    state.apneaTimer =
      null;
  }


  renderTabs();

  renderControls();

  renderData();
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


$("respirationButton")
  .addEventListener(
    "click",
    toggleRespiration
  );


$("resetButton")
  .addEventListener(
    "click",
    resetLaboratory
  );


$("logoutSidebar")
  .addEventListener(
    "click",
    logout
  );


async function start() {

  try {

    await loadUser();


    renderTabs();

    renderControls();

    renderData();


    requestAnimationFrame(
      animationLoop
    );

  }
  catch (error) {

    console.error(
      error
    );
  }
}


start();
