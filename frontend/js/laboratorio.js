"use strict";

/*
 * Cortex Physiology Lab V2
 * --------------------------------------------
 * Educational physiological simulator.
 *
 * Core relationships:
 * - Henderson-Hasselbalch for pH.
 * - Winter formula for metabolic acidosis.
 * - Alveolar gas equation (simplified) for auto oxygenation.
 * - Severinghaus-style O2 dissociation approximation, with pH shift.
 * - MAP ≈ CO × SVR (plus CVP), with CO = HR × SV.
 * - Potassium/calcium-driven ECG morphology based on recognized patterns.
 * - Renal bicarbonate compensation accelerated for teaching.
 *
 * This is not a clinical monitor or patient-specific model.
 */

const initialState = {
  fc: 72,
  fr: 16,

  volumeCorrente: 500,
  metabolismo: 100,

  pao2: 95,
  paco2: 40,
  hco3: 24,
  fio2: 21,
  vq: 100,
  hemoglobina: 15,

  sodio: 140,
  cloro: 104,
  potassio: 4.2,
  calcio: 2.4,
  magnesio: 0.85,

  creatinina: 0.9,
  adh: 50,
  hidratacao: 100,

  contratilidade: 100,
  vasoconstricao: 50,
  vasodilatacao: 50
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

  autoRenal:
    true,

  autoBaroreflex:
    true,

  autoOxygen:
    true,

  simulatedRenalHours:
    0,

  ecgClock:
    0,

  plethClock:
    0,

  previousAnimation:
    performance.now(),

  lastRender:
    0,

  renderQueued:
    false
};


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
          "PaCO₂",

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
          "HCO₃⁻",

        min:
          8,

        max:
          45,

        step:
          .1,

        unit:
          "mEq/L",

        derivedWhen:
          "autoRenal"
      },

      {
        field:
          "pao2",

        label:
          "PaO₂ manual",

        min:
          20,

        max:
          600,

        step:
          1,

        unit:
          "mmHg",

        derivedWhen:
          "autoOxygen"
      },

      {
        field:
          "fio2",

        label:
          "FiO₂",

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
      "Respiratório",

    sliders: [

      {
        field:
          "fr",

        label:
          "Frequência respiratória",

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
      },

      {
        field:
          "vq",

        label:
          "Eficiência V/Q",

        min:
          35,

        max:
          100,

        step:
          1,

        unit:
          "%"
      },

      {
        field:
          "hemoglobina",

        label:
          "Hemoglobina",

        min:
          6,

        max:
          20,

        step:
          .1,

        unit:
          "g/dL"
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
          "FC intrínseca",

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
          "contratilidade",

        label:
          "Contratilidade",

        min:
          45,

        max:
          155,

        step:
          1,

        unit:
          "%"
      },

      {
        field:
          "vasoconstricao",

        label:
          "Vasoconstrição",

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
          "Vasodilatação",

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
          "Volume / hidratação",

        min:
          55,

        max:
          145,

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
          .4,

        max:
          7,

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
      "Eletrólitos",

    sliders: [

      {
        field:
          "sodio",

        label:
          "Sódio",

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
          "Potássio",

        min:
          2,

        max:
          9,

        step:
          .1,

        unit:
          "mEq/L"
      },

      {
        field:
          "calcio",

        label:
          "Cálcio total",

        min:
          1.5,

        max:
          3.5,

        step:
          .05,

        unit:
          "mmol/L"
      },

      {
        field:
          "magnesio",

        label:
          "Magnésio",

        min:
          .4,

        max:
          1.6,

        step:
          .05,

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


const presets = [

  {
    id:
      "normal",

    label:
      "Sinusal normal",

    patch: {
      fc: 72,
      potassio: 4.2,
      calcio: 2.4,
      pao2: 95,
      paco2: 40,
      hco3: 24,
      vasoconstricao: 50,
      vasodilatacao: 50
    }
  },

  {
    id:
      "tachy",

    label:
      "Taquicardia sinusal",

    patch: {
      fc: 125
    }
  },

  {
    id:
      "brady",

    label:
      "Bradicardia sinusal",

    patch: {
      fc: 45
    }
  },

  {
    id:
      "hypok",

    label:
      "Hipocalemia",

    patch: {
      potassio: 2.6
    }
  },

  {
    id:
      "hyperk",

    label:
      "Hipercalemia",

    patch: {
      potassio: 6.3
    }
  },

  {
    id:
      "hyperkSevere",

    label:
      "K⁺ grave",

    patch: {
      potassio: 7.7
    }
  },

  {
    id:
      "hypoca",

    label:
      "Hipocalcemia",

    patch: {
      calcio: 1.75
    }
  },

  {
    id:
      "hyperca",

    label:
      "Hipercalcemia",

    patch: {
      calcio: 3.15
    }
  },

  {
    id:
      "hypox",

    label:
      "Hipoxemia",

    patch: {
      vq: 72,
      fio2: 21
    }
  }

];


const $ =
  function (
    id
  ) {

    return document.getElementById(
      id
    );

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


function lerp(
  a,
  b,
  t
) {

  return (
    a +
    (
      b -
      a
    ) *
    t
  );

}


function gaussian(
  x,
  center,
  width,
  amplitude
) {

  const safeWidth =
    Math.max(
      width,
      .001
    );


  const z =
    (
      x -
      center
    ) /
    safeWidth;


  return (
    amplitude *
    Math.exp(
      -.5 *
      z *
      z
    )
  );

}


function modulo(
  value,
  divisor
) {

  return (
    (
      value %
      divisor
    ) +
    divisor
  ) %
  divisor;

}


function formatNumber(
  value,
  decimals
) {

  return Number(
    value
  )
    .toFixed(
      decimals
    )
    .replace(
      ".",
      ","
    );

}


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
      "Não autenticado."
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
      "Erro na requisição."
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
    "Usuário";


  const initial =
    name
      .charAt(
        0
      )
      .toUpperCase();


  if ($("nomeSidebar")) {

    $("nomeSidebar")
      .textContent =
      name;

  }


  if ($("emailSidebar")) {

    $("emailSidebar")
      .textContent =
      user.email ||
      "";

  }


  if ($("nomeHeader")) {

    $("nomeHeader")
      .textContent =
      name;

  }


  if ($("avatarSidebar")) {

    $("avatarSidebar")
      .textContent =
      initial;

  }


  if ($("avatarHeader")) {

    $("avatarHeader")
      .textContent =
      initial;

  }

}


function physiologicalValues() {

  const values = {
    ...state.values
  };


  if (
    !state.breathing
  ) {

    values.fr =
      0;


    values.volumeCorrente =
      0;


    /*
     * Educational apnea approximation:
     * CO2 rises progressively and oxygen falls.
     * Exact rates vary with FRC, metabolism and disease.
     */
    values.paco2 =
      clamp(
        values.paco2 +
        state.apneaTime *
        .055 *
        (
          values.metabolismo /
          100
        ),
        10,
        150
      );


    if (
      !state.autoOxygen
    ) {

      values.pao2 =
        clamp(
          values.pao2 -
          state.apneaTime *
          .42 *
          (
            values.metabolismo /
            100
          ),
          18,
          650
        );

    }

  }


  return values;

}


function renalReserve(
  creatinine
) {

  /*
   * Creatinine is used only as an educational proxy for
   * relative renal reserve. This is NOT an eGFR calculation.
   */
  return clamp(
    1 -
    (
      creatinine -
      .8
    ) /
    6.2,
    .10,
    1
  );

}


function chronicRenalBicarbonateTarget(
  values
) {

  const deltaCO2 =
    values.paco2 -
    40;


  let rawTarget =
    24;


  if (
    deltaCO2 >
    0
  ) {

    /*
     * Chronic respiratory acidosis:
     * approximately +3 to +4 mEq/L HCO3 per +10 mmHg PaCO2.
     */
    rawTarget =
      24 +
      (
        deltaCO2 /
        10
      ) *
      3.5;

  }
  else if (
    deltaCO2 <
    0
  ) {

    /*
     * Chronic respiratory alkalosis:
     * approximately -4 to -5 mEq/L HCO3 per -10 mmHg PaCO2.
     */
    rawTarget =
      24 +
      (
        deltaCO2 /
        10
      ) *
      4.5;

  }


  const reserve =
    renalReserve(
      values.creatinina
    );


  return clamp(
    24 +
    (
      rawTarget -
      24
    ) *
    reserve,
    8,
    45
  );

}


function updateHomeostasis(
  deltaSeconds
) {

  if (
    !state.autoRenal
  ) {
    return;
  }


  /*
   * Time is accelerated for teaching:
   * 1 real second ~= 2 physiological hours.
   * Renal compensation that usually takes days becomes visible.
   */
  const physiologicalHours =
    clamp(
      deltaSeconds,
      0,
      .12
    ) *
    2;


  state.simulatedRenalHours +=
    physiologicalHours;


  const target =
    chronicRenalBicarbonateTarget(
      state.values
    );


  const reserve =
    renalReserve(
      state.values.creatinina
    );


  const tauHours =
    42 /
    Math.max(
      reserve,
      .12
    );


  const alpha =
    1 -
    Math.exp(
      -
      physiologicalHours /
      tauHours
    );


  state.values.hco3 =
    clamp(
      state.values.hco3 +
      (
        target -
        state.values.hco3
      ) *
      alpha,
      8,
      45
    );

}


function alveolarOxygen(
  values
) {

  const fio2 =
    values.fio2 /
    100;


  /*
   * Simplified alveolar gas equation at sea level:
   * PAO2 = FiO2 * (760 - 47) - PaCO2 / R
   * R assumed 0.8.
   */
  return clamp(
    fio2 *
    (
      760 -
      47
    ) -
    values.paco2 /
    .8,
    10,
    680
  );

}


function arterialOxygen(
  values
) {

  if (
    !state.autoOxygen
  ) {

    return clamp(
      values.pao2,
      10,
      650
    );

  }


  const pao2Alveolar =
    alveolarOxygen(
      values
    );


  /*
   * Educational V/Q impairment term.
   * At V/Q efficiency 100%, the A-a gradient is ~5 mmHg.
   * Lower V/Q efficiency progressively raises the gradient.
   */
  const gradientAa =
    5 +
    Math.pow(
      (
        100 -
        values.vq
      ) /
      65,
      1.35
    ) *
    120;


  const apneaPenalty =
    state.breathing
      ? 0
      : state.apneaTime *
        .55 *
        (
          values.metabolismo /
          100
        );


  return clamp(
    pao2Alveolar -
    gradientAa -
    apneaPenalty,
    18,
    650
  );

}


function oxygenSaturation(
  pao2,
  ph
) {

  /*
   * Standard Severinghaus approximation:
   * S = 1 / (1 + 23400/(PO2^3 + 150*PO2)).
   *
   * pH effect is introduced by adjusting equivalent PO2
   * using the classic ~0.48 log P50 Bohr coefficient.
   * Temperature is held at 37 °C.
   */
  const p50 =
    26.6 *
    Math.pow(
      10,
      .48 *
      (
        7.4 -
        ph
      )
    );


  const equivalentPO2 =
    clamp(
      pao2 *
      26.6 /
      p50,
      1,
      700
    );


  const denominator =
    Math.pow(
      equivalentPO2,
      3
    ) +
    150 *
    equivalentPO2;


  const saturation =
    100 /
    (
      1 +
      23400 /
      Math.max(
        denominator,
        1
      )
    );


  return {
    saturation:
      clamp(
        saturation,
        1,
        100
      ),

    p50
  };

}


function classifyAcidBase(
  ph,
  hco3,
  paco2
) {

  if (
    ph >=
      7.35 &&
    ph <=
      7.45
  ) {

    if (
      hco3 <
        22 &&
      paco2 <
        35
    ) {

      return "Compensação / distúrbio misto possível";

    }


    if (
      hco3 >
        26 &&
      paco2 >
        45
    ) {

      return "Compensação / distúrbio misto possível";

    }


    return "Equilíbrio ácido-base";

  }


  if (
    ph <
    7.35
  ) {

    if (
      hco3 <
        22 &&
      paco2 >
        45
    ) {

      return "Acidose mista";

    }


    if (
      hco3 <
      22
    ) {

      return "Acidose metabólica";

    }


    if (
      paco2 >
      45
    ) {

      return "Acidose respiratória";

    }


    return "Acidemia";

  }


  if (
    hco3 >
      26 &&
    paco2 <
      35
  ) {

    return "Alcalose mista";

  }


  if (
    hco3 >
    26
  ) {

    return "Alcalose metabólica";

  }


  if (
    paco2 <
    35
  ) {

    return "Alcalose respiratória";

  }


  return "Alcalemia";

}


function computeHemodynamics(
  values,
  spo2
) {

  const netTone =
    (
      values.vasoconstricao -
      values.vasodilatacao
    ) /
    100;


  /*
   * Baseline adult SVR around 1000 dyn·s·cm⁻5.
   * Exponential mapping keeps resistance positive and
   * makes diameter/tone changes physiologically meaningful.
   */
  const svr =
    clamp(
      1250 *
      Math.exp(
        netTone *
        .86
      ),
      450,
      2800
    );


  const volumeFactor =
    clamp(
      values.hidratacao /
      100,
      .55,
      1.45
    );


  const contractilityFactor =
    clamp(
      values.contratilidade /
      100,
      .45,
      1.55
    );


  const afterloadFactor =
    Math.pow(
      1250 /
      svr,
      .14
    );


  let strokeVolume =
    clamp(
      78 *
      Math.pow(
        volumeFactor,
        .48
      ) *
      contractilityFactor *
      afterloadFactor,
      28,
      135
    );


  let effectiveHR =
    values.fc;


  const cvp =
    clamp(
      4 +
      (
        values.hidratacao -
        100
      ) *
      .07,
      1,
      12
    );


  let cardiacOutput =
    effectiveHR *
    strokeVolume /
    1000;


  let map =
    cvp +
    cardiacOutput *
    svr /
    80;


  if (
    state.autoBaroreflex
  ) {

    const pressureDrive =
      clamp(
        (
          90 -
          map
        ) *
        .42,
        -24,
        34
      );


    const hypoxiaDrive =
      spo2 <
        92
        ? clamp(
            (
              92 -
              spo2
            ) *
            1.15,
            0,
            18
          )
        : 0;


    effectiveHR =
      clamp(
        values.fc +
        pressureDrive +
        hypoxiaDrive,
        28,
        190
      );


    cardiacOutput =
      effectiveHR *
      strokeVolume /
      1000;


    map =
      cvp +
      cardiacOutput *
      svr /
      80;

  }


  map =
    clamp(
      map,
      35,
      220
    );


  const arterialCompliance =
    clamp(
      1.02 -
      Math.max(
        netTone,
        0
      ) *
      .16 +
      Math.max(
        -netTone,
        0
      ) *
      .08,
      .70,
      1.18
    );


  const pulsePressure =
    clamp(
      40 *
      (
        strokeVolume /
        78
      ) /
      arterialCompliance,
      18,
      105
    );


  const diastolic =
    clamp(
      map -
      pulsePressure /
      3,
      25,
      170
    );


  const systolic =
    clamp(
      diastolic +
      pulsePressure,
      55,
      260
    );


  return {
    svr,
    strokeVolume,
    effectiveHR,
    cardiacOutput,
    map,
    systolic,
    diastolic,
    pulsePressure,
    cvp
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
        .03 *
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
    winter -
    2;


  const winterMax =
    winter +
    2;


  const pao2Final =
    arterialOxygen(
      values
    );


  const oxygen =
    oxygenSaturation(
      pao2Final,
      ph
    );


  const hemodynamics =
    computeHemodynamics(
      values,
      oxygen.saturation
    );


  const arterialOxygenContent =
    1.34 *
    values.hemoglobina *
    (
      oxygen.saturation /
      100
    ) +
    .003 *
    pao2Final;


  /*
   * CO [L/min] × CaO2 [mL/dL] × 10 dL/L
   */
  const oxygenDelivery =
    hemodynamics
      .cardiacOutput *
    arterialOxygenContent *
    10;


  const renalTarget =
    chronicRenalBicarbonateTarget(
      values
    );


  const disturbo =
    classifyAcidBase(
      ph,
      values.hco3,
      values.paco2
    );


  return {
    ventilacaoMinuto,
    ventilacaoAlveolar,

    ph,

    anionGap,

    winter,
    winterMin,
    winterMax,

    pao2Final,
    spo2:
      oxygen.saturation,
    p50:
      oxygen.p50,

    arterialOxygenContent,
    oxygenDelivery,

    renalTarget,
    renalReserve:
      renalReserve(
        values.creatinina
      ),

    ...hemodynamics,

    rr:
      60000 /
      Math.max(
        hemodynamics.effectiveHR,
        1
      ),

    disturbo
  };

}


function ecgMorphology(
  values,
  results
) {

  const potassium =
    values.potassio;


  const calcium =
    values.calcio;


  const magnesium =
    values.magnesio;


  let pAmplitude =
    .15;


  let prMs =
    160;


  let qrsMs =
    90;


  let tAmplitude =
    .34;


  let tWidth =
    .07;


  let stLevel =
    0;


  let uAmplitude =
    0;


  let qtcMs =
    410;


  let pattern =
    "Ritmo sinusal";


  let risk =
    "baixo";


  if (
    potassium >
    5.5
  ) {

    const severity =
      clamp(
        (
          potassium -
          5.5
        ) /
        2.5,
        0,
        1
      );


    tAmplitude =
      lerp(
        .38,
        1.05,
        severity
      );


    tWidth =
      lerp(
        .065,
        .035,
        severity
      );


    prMs =
      lerp(
        165,
        245,
        clamp(
          (
            potassium -
            6.0
          ) /
          1.8,
          0,
          1
        )
      );


    pAmplitude =
      lerp(
        .15,
        .015,
        clamp(
          (
            potassium -
            6.1
          ) /
          1.5,
          0,
          1
        )
      );


    qrsMs =
      lerp(
        92,
        220,
        clamp(
          (
            potassium -
            6.5
          ) /
          1.7,
          0,
          1
        )
      );


    qtcMs -=
      clamp(
        (
          potassium -
          5.5
        ) *
        20,
        0,
        45
      );


    pattern =
      potassium >=
        7.5
        ? "Hipercalemia grave · condução lenta"
        : "Hipercalemia · T apiculada";


    risk =
      potassium >=
        7
        ? "alto"
        : "moderado";

  }


  if (
    potassium <
    3.5
  ) {

    const severity =
      clamp(
        (
          3.5 -
          potassium
        ) /
        1.5,
        0,
        1
      );


    tAmplitude =
      lerp(
        .30,
        .07,
        severity
      );


    tWidth =
      lerp(
        .075,
        .09,
        severity
      );


    stLevel =
      lerp(
        0,
        -.16,
        severity
      );


    uAmplitude =
      lerp(
        0,
        .28,
        severity
      );


    qtcMs +=
      35 *
      severity;


    pattern =
      "Hipocalemia · T achatada / U proeminente";


    risk =
      potassium <
        2.6
        ? "alto"
        : "moderado";

  }


  if (
    calcium <
    2.15
  ) {

    qtcMs +=
      clamp(
        (
          2.15 -
          calcium
        ) *
        160,
        0,
        120
      );


    pattern =
      pattern ===
        "Ritmo sinusal"
        ? "Hipocalcemia · QT prolongado"
        : pattern +
          " + QT prolongado";

  }
  else if (
    calcium >
    2.65
  ) {

    qtcMs -=
      clamp(
        (
          calcium -
          2.65
        ) *
        140,
        0,
        110
      );


    pattern =
      pattern ===
        "Ritmo sinusal"
        ? "Hipercalcemia · QT encurtado"
        : pattern +
          " + QT encurtado";

  }


  if (
    magnesium <
    .55
  ) {

    qtcMs +=
      clamp(
        (
          .55 -
          magnesium
        ) *
        100,
        0,
        45
      );


    risk =
      "moderado";

  }


  qtcMs =
    clamp(
      qtcMs,
      285,
      590
    );


  const rrSeconds =
    60 /
    Math.max(
      results.effectiveHR,
      1
    );


  const qtMs =
    clamp(
      qtcMs *
      Math.sqrt(
        rrSeconds
      ),
      230,
      Math.max(
        240,
        rrSeconds *
        1000 -
        50
      )
    );


  const sineWave =
    potassium >=
    8.1;


  if (
    sineWave
  ) {

    pattern =
      "Padrão senoidal didático · hipercalemia extrema";


    risk =
      "muito alto";

  }
  else if (
    results.effectiveHR >
      100 &&
    pattern ===
      "Ritmo sinusal"
  ) {

    pattern =
      "Taquicardia sinusal";

  }
  else if (
    results.effectiveHR <
      60 &&
    pattern ===
      "Ritmo sinusal"
  ) {

    pattern =
      "Bradicardia sinusal";

  }


  return {
    pAmplitude,
    prMs,
    qrsMs,
    tAmplitude,
    tWidth,
    stLevel,
    uAmplitude,
    qtMs,
    qtcMs,
    sineWave,
    pattern,
    risk
  };

}


function ecgValueAtTime(
  absoluteTime,
  values,
  results,
  morphology
) {

  const rr =
    60 /
    Math.max(
      results.effectiveHR,
      1
    );


  const phase =
    modulo(
      absoluteTime,
      rr
    );


  if (
    morphology.sineWave
  ) {

    return (
      .82 *
      Math.sin(
        (
          phase /
          rr
        ) *
        Math.PI *
        2
      )
    );

  }


  const speedFactor =
    clamp(
      rr /
      .83,
      .68,
      1.15
    );


  const pCenter =
    .075 *
    speedFactor;


  const qrsCenter =
    clamp(
      morphology.prMs /
      1000,
      .125,
      rr *
      .42
    );


  const qrsWidth =
    morphology.qrsMs /
    1000;


  const qCenter =
    qrsCenter -
    qrsWidth *
    .20;


  const rCenter =
    qrsCenter;


  const sCenter =
    qrsCenter +
    qrsWidth *
    .23;


  const qrsEnd =
    qrsCenter +
    qrsWidth *
    .46;


  const qtEnd =
    clamp(
      morphology.qtMs /
      1000,
      qrsEnd +
      .13,
      rr -
      .045
    );


  const tCenter =
    qrsEnd +
    (
      qtEnd -
      qrsEnd
    ) *
    .66;


  const uCenter =
    Math.min(
      rr -
      .035,
      tCenter +
      .145 *
      speedFactor
    );


  let value =
    0;


  value +=
    gaussian(
      phase,
      pCenter,
      .022 *
      speedFactor,
      morphology.pAmplitude
    );


  value +=
    gaussian(
      phase,
      qCenter,
      Math.max(
        .008,
        qrsWidth *
        .10
      ),
      -.16
    );


  value +=
    gaussian(
      phase,
      rCenter,
      Math.max(
        .009,
        qrsWidth *
        .11
      ),
      1.05
    );


  value +=
    gaussian(
      phase,
      sCenter,
      Math.max(
        .010,
        qrsWidth *
        .12
      ),
      -.31
    );


  if (
    morphology.stLevel !==
    0 &&
    phase >
      qrsEnd &&
    phase <
      tCenter -
      .05
  ) {

    value +=
      morphology.stLevel;

  }


  value +=
    gaussian(
      phase,
      tCenter,
      morphology.tWidth,
      morphology.tAmplitude
    );


  if (
    morphology.uAmplitude >
    0
  ) {

    value +=
      gaussian(
        phase,
        uCenter,
        .035,
        morphology.uAmplitude
      );

  }


  return value;

}


function plethValueAtTime(
  absoluteTime,
  results
) {

  const rr =
    60 /
    Math.max(
      results.effectiveHR,
      1
    );


  const phase =
    modulo(
      absoluteTime,
      rr
    ) /
    rr;


  /*
   * Synthetic peripheral arterial pulse:
   * fast systolic upstroke, slower runoff and dicrotic notch.
   * Amplitude follows perfusion, not oxygen saturation.
   */
  let value =
    0;


  value +=
    gaussian(
      phase,
      .16,
      .055,
      1.0
    );


  value +=
    gaussian(
      phase,
      .30,
      .11,
      .52
    );


  value -=
    gaussian(
      phase,
      .36,
      .026,
      .16
    );


  value +=
    gaussian(
      phase,
      .43,
      .045,
      .16
    );


  return (
    value *
    results.perfusionIndex
  );

}


function perfusionIndex(
  results,
  values
) {

  const tonePenalty =
    clamp(
      1 -
      Math.max(
        0,
        (
          values.vasoconstricao -
          values.vasodilatacao
        ) /
        100
      ) *
      .55,
      .28,
      1.1
    );


  const pressureFactor =
    clamp(
      results.map /
      85,
      .35,
      1.3
    );


  const volumeFactor =
    clamp(
      values.hidratacao /
      100,
      .55,
      1.25
    );


  return clamp(
    .9 *
    tonePenalty *
    pressureFactor *
    Math.pow(
      volumeFactor,
      .35
    ),
    .12,
    1.25
  );

}


function physiologicalModel() {

  const values =
    physiologicalValues();


  const results =
    calculate(
      values
    );


  results.perfusionIndex =
    perfusionIndex(
      results,
      values
    );


  results.ecg =
    ecgMorphology(
      values,
      results
    );


  return {
    values,
    results
  };

}


function metric(
  label,
  value,
  unit,
  accent
) {

  return (
    '<article class="metric-card ' +
    (
      accent
        ? "accent"
        : ""
    ) +
    '">' +
      "<span>" +
        label +
      "</span>" +
      '<div class="metric-value">' +
        "<strong>" +
          value +
        "</strong>" +
        (
          unit
            ? "<small>" +
                unit +
              "</small>"
            : ""
        ) +
      "</div>" +
    "</article>"
  );

}


function resultRow(
  label,
  value,
  unit,
  className
) {

  return (
    '<div class="result-row">' +
      "<span>" +
        label +
      "</span>" +
      "<strong" +
        (
          className
            ? ' class="' +
              className +
              '"'
            : ""
        ) +
      ">" +
        value +
        (
          unit
            ? "<small>" +
              unit +
              "</small>"
            : ""
        ) +
      "</strong>" +
    "</div>"
  );

}


function scientificRow(
  label,
  value,
  className
) {

  return (
    '<div class="scientific-row">' +
      "<span>" +
        label +
      "</span>" +
      "<strong" +
        (
          className
            ? ' class="' +
              className +
              '"'
            : ""
        ) +
      ">" +
        value +
      "</strong>" +
    "</div>"
  );

}


function statusClass(
  value,
  normalMin,
  normalMax,
  warningMargin
) {

  if (
    value >=
      normalMin &&
    value <=
      normalMax
  ) {

    return "normal-text";

  }


  if (
    value >=
      normalMin -
      warningMargin &&
    value <=
      normalMax +
      warningMargin
  ) {

    return "warning-text";

  }


  return "danger-text";

}


function renderTabs() {

  $("tabs")
    .innerHTML =
    categories
      .map(
        function (
          category
        ) {

          return (
            '<button type="button" class="control-tab ' +
            (
              state.category ===
                category.id
                ? "active"
                : ""
            ) +
            '" data-category="' +
            category.id +
            '">' +
              category.label +
            "</button>"
          );

        }
      )
      .join("");


  document
    .querySelectorAll(
      "[data-category]"
    )
    .forEach(
      function (
        button
      ) {

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
      function (
        item
      ) {

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


          const derived =
            slider.derivedWhen
              ? Boolean(
                  state[
                    slider.derivedWhen
                  ]
                )
              : false;


          const decimals =
            slider.step <
              .1
              ? 2
              : slider.step <
                  1
                  ? 1
                  : 0;


          return (
            '<div class="slider-control ' +
            (
              derived
                ? "is-derived"
                : ""
            ) +
            '">' +
              '<div class="slider-heading">' +
                "<span>" +
                  slider.label +
                  (
                    derived
                      ? '<span class="slider-auto-label">AUTO</span>'
                      : ""
                  ) +
                "</span>" +
                '<span class="slider-number">' +
                  Number(
                    value
                  ).toFixed(
                    decimals
                  ).replace(
                    ".",
                    ","
                  ) +
                  "<small>" +
                    slider.unit +
                  "</small>" +
                "</span>" +
              "</div>" +
              '<input type="range" min="' +
                slider.min +
                '" max="' +
                slider.max +
                '" step="' +
                slider.step +
                '" value="' +
                value +
                '" data-slider="' +
                slider.field +
                '"' +
                (
                  derived
                    ? " disabled"
                    : ""
                ) +
              ">" +
              '<div class="slider-limits">' +
                "<span>" +
                  slider.min +
                "</span>" +
                "<span>" +
                  slider.max +
                "</span>" +
              "</div>" +
            "</div>"
          );

        }
      )
      .join("");


  document
    .querySelectorAll(
      "[data-slider]"
    )
    .forEach(
      function (
        input
      ) {

        input.addEventListener(
          "input",
          function () {

            const field =
              input.dataset
                .slider;


            const value =
              Number(
                input.value
              );


            state.values[
              field
            ] =
              value;


            const slider =
              category.sliders
                .find(
                  function (
                    item
                  ) {

                    return (
                      item.field ===
                      field
                    );

                  }
                );


            const container =
              input.closest(
                ".slider-control"
              );


            if (
              slider &&
              container
            ) {

              const number =
                container.querySelector(
                  ".slider-number"
                );


              if (number) {

                const decimals =
                  slider.step <
                    .1
                    ? 2
                    : slider.step <
                        1
                        ? 1
                        : 0;


                number.innerHTML =
                  Number(
                    value
                  )
                    .toFixed(
                      decimals
                    )
                    .replace(
                      ".",
                      ","
                    ) +
                  "<small>" +
                    slider.unit +
                  "</small>";

              }

            }


            queueRender();

          }
        );

      }
    );

}


function renderPresets() {

  $("presetBar")
    .innerHTML =
    presets
      .map(
        function (
          preset
        ) {

          return (
            '<button type="button" class="physiology-preset" data-preset="' +
            preset.id +
            '">' +
              preset.label +
            "</button>"
          );

        }
      )
      .join("");


  document
    .querySelectorAll(
      "[data-preset]"
    )
    .forEach(
      function (
        button
      ) {

        button.addEventListener(
          "click",
          function () {

            const preset =
              presets.find(
                function (
                  item
                ) {

                  return (
                    item.id ===
                    button.dataset
                      .preset
                  );

                }
              );


            if (!preset) {
              return;
            }


            if (
              preset.id ===
              "normal"
            ) {

              state.values = {
                ...initialState
              };


              state.autoRenal =
                true;


              state.autoBaroreflex =
                true;


              state.autoOxygen =
                true;


              state.simulatedRenalHours =
                0;

            }
            else {

              Object.assign(
                state.values,
                preset.patch
              );

            }


            renderControls();


            renderHomeostasis();


            renderData();

          }
        );

      }
    );

}


function renderHomeostasis() {

  const items = [

    {
      key:
        "autoRenal",

      label:
        "Compensação renal HCO₃⁻",

      status:
        state.autoRenal
          ? "ATIVA"
          : "MANUAL"
    },

    {
      key:
        "autoBaroreflex",

      label:
        "Barorreflexo / FC reflexa",

      status:
        state.autoBaroreflex
          ? "ATIVO"
          : "DESLIGADO"
    },

    {
      key:
        "autoOxygen",

      label:
        "FiO₂ + V/Q → PaO₂",

      status:
        state.autoOxygen
          ? "ACOPLADO"
          : "PaO₂ MANUAL"
    }

  ];


  $("homeostasis")
    .innerHTML =
    items
      .map(
        function (
          item
        ) {

          return (
            '<button type="button" class="physiology-toggle ' +
            (
              state[
                item.key
              ]
                ? "active"
                : ""
            ) +
            '" data-toggle="' +
            item.key +
            '">' +
              "<strong>" +
                item.label +
              "</strong>" +
              "<span>" +
                item.status +
              "</span>" +
            "</button>"
          );

        }
      )
      .join("") +
    '<div class="homeostasis-note">' +
      "Tempo renal acelerado para estudo: 1 s real ≈ 2 h fisiológicas. " +
      "Creatinina é usada somente como proxy didático de reserva renal, não como eGFR." +
    "</div>";


  document
    .querySelectorAll(
      "[data-toggle]"
    )
    .forEach(
      function (
        button
      ) {

        button.addEventListener(
          "click",
          function () {

            const key =
              button.dataset
                .toggle;


            state[
              key
            ] =
              !state[
                key
              ];


            renderHomeostasis();


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
        results.ph.toFixed(
          2
        ),
        "",
        true
      ),

      metric(
        "PaCO₂",
        values.paco2.toFixed(
          0
        ),
        "mmHg"
      ),

      metric(
        "HCO₃⁻",
        values.hco3.toFixed(
          1
        ),
        "mEq/L"
      ),

      metric(
        "PaO₂",
        Math.round(
          results.pao2Final
        ),
        "mmHg"
      ),

      metric(
        "SpO₂",
        Math.round(
          results.spo2
        ),
        "%"
      ),

      metric(
        "FC",
        Math.round(
          results.effectiveHR
        ),
        "bpm"
      ),

      metric(
        "PA",
        Math.round(
          results.systolic
        ) +
        "/" +
        Math.round(
          results.diastolic
        ),
        "mmHg"
      ),

      metric(
        "PAM",
        Math.round(
          results.map
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
    [
      [
        "pH",
        results.ph.toFixed(
          2
        ),
        "referência 7,35–7,45",
        "orange"
      ],

      [
        "PaCO₂",
        values.paco2.toFixed(
          0
        ),
        "mmHg",
        ""
      ],

      [
        "HCO₃⁻",
        values.hco3.toFixed(
          1
        ),
        "mEq/L",
        ""
      ],

      [
        "PaO₂",
        Math.round(
          results.pao2Final
        ),
        "mmHg",
        "blue"
      ],

      [
        "CaO₂",
        results
          .arterialOxygenContent
          .toFixed(
            1
          ),
        "mL O₂/dL",
        ""
      ],

      [
        "DO₂",
        Math.round(
          results.oxygenDelivery
        ),
        "mL O₂/min",
        ""
      ]
    ]
      .map(
        function (
          item
        ) {

          return (
            '<article class="gas-card">' +
              "<span>" +
                item[0] +
              "</span>" +
              '<strong class="' +
                item[3] +
              '">' +
                item[1] +
              "</strong>" +
              "<small>" +
                item[2] +
              "</small>" +
            "</article>"
          );

        }
      )
      .join("");


  $("gasometryFooter")
    .innerHTML =
    '<div class="simple-stat">' +
      "<span>FiO₂</span>" +
      "<strong>" +
        values.fio2 +
        "%" +
      "</strong>" +
    "</div>" +
    '<div class="simple-stat">' +
      "<span>Ânion gap</span>" +
      "<strong>" +
        results.anionGap.toFixed(
          1
        ) +
        "<small>mEq/L</small>" +
      "</strong>" +
    "</div>" +
    '<div class="simple-stat">' +
      "<span>P50</span>" +
      "<strong>" +
        results.p50.toFixed(
          1
        ) +
        "<small>mmHg</small>" +
      "</strong>" +
    "</div>" +
    '<div class="simple-stat">' +
      "<span>Distúrbio</span>" +
      '<strong class="orange">' +
        results.disturbo +
      "</strong>" +
    "</div>";

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
        .toFixed(
          1
        ),
      "L/min"
    ],

    [
      "VA",
      results
        .ventilacaoAlveolar
        .toFixed(
          1
        ),
      "L/min"
    ],

    [
      "V/Q",
      values.vq,
      "%"
    ],

    [
      "Hb",
      values.hemoglobina.toFixed(
        1
      ),
      "g/dL"
    ]

  ];


  $("respiratoryMechanics")
    .innerHTML =
    cards
      .map(
        function (
          item
        ) {

          return (
            '<article class="mechanics-card">' +
              "<span>" +
                item[0] +
              "</span>" +
              "<strong>" +
                item[1] +
              "</strong>" +
              "<small>" +
                item[2] +
              "</small>" +
            "</article>"
          );

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
    '<div class="interpretation-highlight">' +
      "<span>Ácido-base</span>" +
      "<strong>" +
        results.disturbo +
      "</strong>" +
    "</div>" +
    resultRow(
      "pH",
      results.ph.toFixed(
        2
      )
    ) +
    resultRow(
      "PaCO₂",
      values.paco2.toFixed(
        0
      ),
      "mmHg"
    ) +
    resultRow(
      "HCO₃⁻",
      values.hco3.toFixed(
        1
      ),
      "mEq/L"
    ) +
    resultRow(
      "Ânion gap",
      results.anionGap.toFixed(
        1
      )
    ) +
    resultRow(
      "Winter",
      results.winterMin.toFixed(
        1
      ) +
      "–" +
      results.winterMax.toFixed(
        1
      ),
      "mmHg"
    );

}


function renderHemodynamics(
  results
) {

  $("hemodynamics")
    .innerHTML =
    resultRow(
      "Pressão sistólica",
      Math.round(
        results.systolic
      ),
      "mmHg"
    ) +
    resultRow(
      "Pressão diastólica",
      Math.round(
        results.diastolic
      ),
      "mmHg"
    ) +
    resultRow(
      "PAM",
      Math.round(
        results.map
      ),
      "mmHg"
    ) +
    resultRow(
      "FC efetiva",
      Math.round(
        results.effectiveHR
      ),
      "bpm"
    ) +
    resultRow(
      "Volume sistólico",
      Math.round(
        results.strokeVolume
      ),
      "mL"
    ) +
    resultRow(
      "Débito cardíaco",
      results
        .cardiacOutput
        .toFixed(
          2
        ),
      "L/min"
    ) +
    resultRow(
      "RVS",
      Math.round(
        results.svr
      ),
      "dyn·s·cm⁻⁵"
    );

}


function renderElectrolytes(
  values
) {

  $("electrolytes")
    .innerHTML =
    resultRow(
      "Na⁺",
      values.sodio.toFixed(
        0
      ),
      "mEq/L",
      statusClass(
        values.sodio,
        135,
        145,
        5
      )
    ) +
    resultRow(
      "K⁺",
      values.potassio.toFixed(
        1
      ),
      "mEq/L",
      statusClass(
        values.potassio,
        3.5,
        5.0,
        .5
      )
    ) +
    resultRow(
      "Ca²⁺ total",
      values.calcio.toFixed(
        2
      ),
      "mmol/L",
      statusClass(
        values.calcio,
        2.15,
        2.60,
        .20
      )
    ) +
    resultRow(
      "Mg²⁺",
      values.magnesio.toFixed(
        2
      ),
      "mmol/L",
      statusClass(
        values.magnesio,
        .70,
        1.05,
        .15
      )
    ) +
    resultRow(
      "Cl⁻",
      values.cloro.toFixed(
        0
      ),
      "mEq/L",
      statusClass(
        values.cloro,
        98,
        107,
        6
      )
    );

}


function renderRenalState(
  values,
  results
) {

  const reserveClass =
    results.renalReserve >
      .7
      ? "normal-text"
      : results.renalReserve >
          .35
          ? "warning-text"
          : "danger-text";


  $("renalState")
    .innerHTML =
    scientificRow(
      "Modo",
      state.autoRenal
        ? "Compensação automática"
        : "HCO₃⁻ manual"
    ) +
    scientificRow(
      "HCO₃⁻ atual",
      values.hco3.toFixed(
        1
      ) +
      " mEq/L"
    ) +
    scientificRow(
      "Alvo renal crônico",
      results.renalTarget.toFixed(
        1
      ) +
      " mEq/L"
    ) +
    scientificRow(
      "Reserva renal relativa",
      Math.round(
        results.renalReserve *
        100
      ) +
      "%",
      reserveClass
    ) +
    scientificRow(
      "Creatinina",
      values.creatinina.toFixed(
        1
      ) +
      " mg/dL"
    ) +
    scientificRow(
      "Tempo simulado",
      state.simulatedRenalHours.toFixed(
        1
      ) +
      " h"
    );

}


function renderRespirationState() {

  $("respirationState")
    .innerHTML =
    '<div class="breathing-card ' +
    (
      state.breathing
        ? "normal"
        : "apnea"
    ) +
    '">' +
      "<span>Estado</span>" +
      "<strong>" +
        (
          state.breathing
            ? "RESPIRANDO"
            : "APNEIA"
        ) +
      "</strong>" +
      (
        state.breathing
          ? ""
          : "<small>Tempo: " +
            state.apneaTime +
            " s</small>"
      ) +
    "</div>";

}


function renderECGStatus(
  values,
  results
) {

  const ecg =
    results.ecg;


  const riskClass =
    ecg.risk ===
        "baixo"
      ? "normal"
      : ecg.risk ===
          "moderado"
          ? "warning"
          : "danger";


  $("ecgResults")
    .innerHTML =
    '<div class="monitor-result">' +
      "<span>Padrão</span>" +
      "<strong>" +
        ecg.pattern +
      "</strong>" +
    "</div>" +
    '<div class="monitor-result">' +
      "<span>PR</span>" +
      "<strong>" +
        Math.round(
          ecg.prMs
        ) +
        " ms" +
      "</strong>" +
    "</div>" +
    '<div class="monitor-result">' +
      "<span>QRS</span>" +
      "<strong>" +
        Math.round(
          ecg.qrsMs
        ) +
        " ms" +
      "</strong>" +
    "</div>" +
    '<div class="monitor-result">' +
      "<span>QT / QTc</span>" +
      "<strong>" +
        Math.round(
          ecg.qtMs
        ) +
        " / " +
        Math.round(
          ecg.qtcMs
        ) +
        " ms" +
      "</strong>" +
    "</div>" +
    '<div class="monitor-result">' +
      "<span>Risco elétrico</span>" +
      '<strong class="' +
        riskClass +
      '">' +
        ecg.risk.toUpperCase() +
      "</strong>" +
    "</div>";


  if ($("ecgPatternBadge")) {

    $("ecgPatternBadge")
      .textContent =
      ecg.pattern;

  }

}


function renderSPOStatus(
  values,
  results
) {

  const saturationClass =
    results.spo2 >=
      95
      ? "normal"
      : results.spo2 >=
          90
          ? "warning"
          : "danger";


  const quality =
    results.perfusionIndex >=
      .65
      ? "Sinal adequado"
      : results.perfusionIndex >=
          .35
          ? "Perfusão reduzida"
          : "Sinal fraco";


  $("spoResults")
    .innerHTML =
    '<div class="monitor-result">' +
      "<span>SpO₂</span>" +
      '<strong class="' +
        saturationClass +
      '">' +
        Math.round(
          results.spo2
        ) +
        "%" +
      "</strong>" +
    "</div>" +
    '<div class="monitor-result">' +
      "<span>PaO₂</span>" +
      "<strong>" +
        Math.round(
          results.pao2Final
        ) +
        " mmHg" +
      "</strong>" +
    "</div>" +
    '<div class="monitor-result">' +
      "<span>P50</span>" +
      "<strong>" +
        results.p50.toFixed(
          1
        ) +
        " mmHg" +
      "</strong>" +
    "</div>" +
    '<div class="monitor-result">' +
      "<span>Perfusão relativa</span>" +
      "<strong>" +
        Math.round(
          results.perfusionIndex *
          100
        ) +
        "%" +
      "</strong>" +
    "</div>" +
    '<div class="monitor-result">' +
      "<span>Qualidade PLETH</span>" +
      "<strong>" +
        quality +
      "</strong>" +
    "</div>";


  if ($("plethQualityBadge")) {

    $("plethQualityBadge")
      .textContent =
      quality;

  }

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
      ? "Pausar respiração"
      : "Retomar respiração";


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

  const model =
    physiologicalModel();


  const values =
    model.values;


  const results =
    model.results;


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


  renderElectrolytes(
    values
  );


  renderRenalState(
    values,
    results
  );


  renderRespirationState();


  renderECGStatus(
    values,
    results
  );


  renderSPOStatus(
    values,
    results
  );


  renderRespirationButton();


  $("ecgFC")
    .textContent =
    Math.round(
      results.effectiveHR
    );


  $("pulseFC")
    .textContent =
    Math.round(
      results.effectiveHR
    ) +
    " bpm";


  $("spo2Number")
    .textContent =
    Math.round(
      results.spo2
    );

}


function queueRender() {

  if (
    state.renderQueued
  ) {
    return;
  }


  state.renderQueued =
    true;


  requestAnimationFrame(
    function () {

      state.renderQueued =
        false;


      renderData();

    }
  );

}


function resizeCanvas(
  canvas
) {

  const dpr =
    Math.min(
      window.devicePixelRatio ||
      1,
      2
    );


  const rect =
    canvas.getBoundingClientRect();


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
    canvas.width !==
      width ||
    canvas.height !==
      height
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


function drawECGGrid(
  context,
  size,
  seconds
) {

  const width =
    size.width;


  const height =
    size.height;


  const pxPerSecond =
    width /
    seconds;


  const minorX =
    pxPerSecond *
    .04;


  const majorX =
    pxPerSecond *
    .20;


  context.save();


  context.lineWidth =
    1;


  context.strokeStyle =
    "rgba(49,170,88,.055)";


  context.beginPath();


  for (
    let x = 0;
    x <=
      width;
    x +=
      minorX
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


  const minorY =
    Math.max(
      6 *
      size.dpr,
      height /
      30
    );


  for (
    let y = 0;
    y <=
      height;
    y +=
      minorY
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


  context.strokeStyle =
    "rgba(49,170,88,.13)";


  context.beginPath();


  for (
    let x = 0;
    x <=
      width;
    x +=
      majorX
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
    y <=
      height;
    y +=
      minorY *
      5
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


  context.restore();

}


function drawCalibrationPulse(
  context,
  size,
  seconds
) {

  const pxPerSecond =
    size.width /
    seconds;


  const x =
    12 *
    size.dpr;


  const baseline =
    size.height -
    18 *
    size.dpr;


  const height =
    Math.min(
      32 *
      size.dpr,
      size.height *
      .22
    );


  const duration =
    pxPerSecond *
    .2;


  context.save();


  context.strokeStyle =
    "rgba(72,232,121,.55)";


  context.lineWidth =
    1.4 *
    size.dpr;


  context.beginPath();


  context.moveTo(
    x,
    baseline
  );


  context.lineTo(
    x,
    baseline -
    height
  );


  context.lineTo(
    x +
    duration,
    baseline -
    height
  );


  context.lineTo(
    x +
    duration,
    baseline
  );


  context.lineTo(
    x +
    duration *
    1.25,
    baseline
  );


  context.stroke();


  context.restore();

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


  const model =
    physiologicalModel();


  const values =
    model.values;


  const results =
    model.results;


  const morphology =
    results.ecg;


  const seconds =
    6;


  context.clearRect(
    0,
    0,
    size.width,
    size.height
  );


  drawECGGrid(
    context,
    size,
    seconds
  );


  drawCalibrationPulse(
    context,
    size,
    seconds
  );


  const points =
    Math.max(
      700,
      Math.floor(
        size.width /
        1.4
      )
    );


  const baseline =
    size.height *
    .52;


  const mvScale =
    size.height /
    3.2;


  context.beginPath();


  for (
    let i = 0;
    i <
      points;
    i++
  ) {

    const normalized =
      i /
      (
        points -
        1
      );


    const time =
      state.ecgClock -
      seconds *
      (
        1 -
        normalized
      );


    const millivolts =
      ecgValueAtTime(
        time,
        values,
        results,
        morphology
      );


    const x =
      normalized *
      size.width;


    const y =
      baseline -
      millivolts *
      mvScale;


    if (
      i ===
      0
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
    1.55 *
    size.dpr;


  context.shadowColor =
    "rgba(72,232,121,.28)";


  context.shadowBlur =
    4 *
    size.dpr;


  context.stroke();


  context.shadowBlur =
    0;

}


function drawPlethGrid(
  context,
  size
) {

  context.save();


  context.strokeStyle =
    "rgba(56,168,255,.065)";


  context.lineWidth =
    1;


  const gap =
    Math.max(
      18 *
      size.dpr,
      size.width /
      32
    );


  context.beginPath();


  for (
    let x = 0;
    x <
      size.width;
    x +=
      gap
  ) {

    context.moveTo(
      x,
      0
    );


    context.lineTo(
      x,
      size.height
    );

  }


  for (
    let y = 0;
    y <
      size.height;
    y +=
      gap
  ) {

    context.moveTo(
      0,
      y
    );


    context.lineTo(
      size.width,
      y
    );

  }


  context.stroke();


  context.restore();

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


  const model =
    physiologicalModel();


  const values =
    model.values;


  const results =
    model.results;


  const seconds =
    6;


  context.clearRect(
    0,
    0,
    size.width,
    size.height
  );


  drawPlethGrid(
    context,
    size
  );


  const points =
    Math.max(
      600,
      Math.floor(
        size.width /
        1.5
      )
    );


  const baseline =
    size.height *
    .72;


  const amplitudeScale =
    size.height *
    .32;


  const signalNoise =
    clamp(
      (
        .42 -
        results.perfusionIndex
      ) *
      .025,
      0,
      .015
    );


  context.beginPath();


  for (
    let i = 0;
    i <
      points;
    i++
  ) {

    const normalized =
      i /
      (
        points -
        1
      );


    const time =
      state.plethClock -
      seconds *
      (
        1 -
        normalized
      );


    let value =
      plethValueAtTime(
        time,
        results
      );


    if (
      signalNoise >
      0
    ) {

      value +=
        Math.sin(
          time *
          63
        ) *
        signalNoise;

    }


    const x =
      normalized *
      size.width;


    const y =
      baseline -
      value *
      amplitudeScale;


    if (
      i ===
      0
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
    1.65 *
    size.dpr;


  context.shadowColor =
    "rgba(56,168,255,.25)";


  context.shadowBlur =
    4 *
    size.dpr;


  context.stroke();


  context.shadowBlur =
    0;

}


function animationLoop(
  now
) {

  const deltaMs =
    clamp(
      now -
      state.previousAnimation,
      0,
      80
    );


  const deltaSeconds =
    deltaMs /
    1000;


  state.previousAnimation =
    now;


  state.ecgClock +=
    deltaSeconds;


  state.plethClock +=
    deltaSeconds;


  updateHomeostasis(
    deltaSeconds
  );


  drawECG();


  drawSPO();


  if (
    now -
    state.lastRender >
    250
  ) {

    state.lastRender =
      now;


    renderData();


    if (
      state.autoRenal &&
      state.category ===
        "gasometria"
    ) {

      const input =
        document.querySelector(
          '[data-slider="hco3"]'
        );


      if (
        input &&
        document.activeElement !==
          input
      ) {

        input.value =
          state.values.hco3;


        const container =
          input.closest(
            ".slider-control"
          );


        const number =
          container
            ? container.querySelector(
                ".slider-number"
              )
            : null;


        if (number) {

          number.innerHTML =
            state.values.hco3
              .toFixed(
                1
              )
              .replace(
                ".",
                ","
              ) +
            "<small>mEq/L</small>";

        }

      }

    }

  }


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
              600
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


  state.autoRenal =
    true;


  state.autoBaroreflex =
    true;


  state.autoOxygen =
    true;


  state.simulatedRenalHours =
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


  renderPresets();


  renderHomeostasis();


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


function bindEvents() {

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


  if (
    $("logoutSidebar")
  ) {

    $("logoutSidebar")
      .addEventListener(
        "click",
        logout
      );

  }

}


async function start() {

  try {

    await loadUser();


    renderTabs();


    renderControls();


    renderPresets();


    renderHomeostasis();


    renderData();


    bindEvents();


    state.previousAnimation =
      performance.now();


    requestAnimationFrame(
      animationLoop
    );

  }
  catch (
    error
  ) {

    console.error(
      error
    );

  }

}


start();
