"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import AppLayout from "@/components/AppLayout";

type Categoria =
  | "gasometria"
  | "respiratorio"
  | "cardio"
  | "renal"
  | "eletrólitos";

type Estado = {
  fc: number;
  fr: number;
  volumeCorrente: number;
  metabolismo: number;
  pao2: number;
  paco2: number;
  hco3: number;
  fio2: number;
  sodio: number;
  cloro: number;
  potassio: number;
  calcio: number;
  creatinina: number;
  adh: number;
  hidratacao: number;
  vasoconstricao: number;
  vasodilatacao: number;
};

const estadoInicial: Estado = {
  fc: 72,
  fr: 16,
  volumeCorrente: 500,
  metabolismo: 100,
  pao2: 95,
  paco2: 40,
  hco3: 24,
  fio2: 21,
  sodio: 140,
  cloro: 104,
  potassio: 4.2,
  calcio: 2.4,
  creatinina: 0.9,
  adh: 50,
  hidratacao: 100,
  vasoconstricao: 50,
  vasodilatacao: 50,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function calcular(estado: Estado) {
  const ventilacaoMinuto =
    (estado.fr * estado.volumeCorrente) / 1000;

  const ventilacaoAlveolar =
    (estado.fr *
      Math.max(estado.volumeCorrente - 150, 0)) /
    1000;

  const ph =
    6.1 +
    Math.log10(
      estado.hco3 /
        (0.03 * Math.max(estado.paco2, 1))
    );

  const anionGap =
    estado.sodio -
    estado.cloro -
    estado.hco3;

  const winter =
    1.5 * estado.hco3 + 8;

  const winterMin = winter - 2;
  const winterMax = winter + 2;

  const pao2Esperada =
    95 + (estado.fio2 - 21) * 4.5;

  const pao2Final =
    estado.pao2 * 0.55 +
    pao2Esperada * 0.45;

  const spo2 = clamp(
    90 + (pao2Final - 60) * 0.12,
    60,
    100
  );

  const pas = clamp(
    110 +
      (estado.fc - 70) * 0.2 +
      estado.vasoconstricao * 0.25 -
      estado.vasodilatacao * 0.2,
    60,
    220
  );

  const pad = clamp(
    70 +
      estado.vasoconstricao * 0.15 -
      estado.vasodilatacao * 0.12,
    35,
    140
  );

  const pam =
    (pas + 2 * pad) / 3;

  const rr =
    60000 / Math.max(estado.fc, 1);

  const qtc =
    380 *
    Math.sqrt(
      60 / Math.max(estado.fc, 1)
    );

  let disturbo =
    "Equilíbrio ácido-base";

  if (ph < 7.35) {
    if (
      estado.hco3 < 22 &&
      estado.paco2 > 45
    ) {
      disturbo = "Acidose mista";
    } else if (estado.hco3 < 22) {
      disturbo = "Acidose metabólica";
    } else if (estado.paco2 > 45) {
      disturbo = "Acidose respiratória";
    } else {
      disturbo = "Acidemia";
    }
  }

  if (ph > 7.45) {
    if (
      estado.hco3 > 26 &&
      estado.paco2 < 35
    ) {
      disturbo = "Alcalose mista";
    } else if (estado.hco3 > 26) {
      disturbo = "Alcalose metabólica";
    } else if (estado.paco2 < 35) {
      disturbo = "Alcalose respiratória";
    } else {
      disturbo = "Alcalemia";
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
    disturbo,
  };
}

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={
        "rounded-2xl border border-zinc-800 bg-[#101010] " +
        "shadow-[0_10px_40px_rgba(0,0,0,0.25)] " +
        className
      }
    >
      {children}
    </section>
  );
}

function PanelTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="border-b border-zinc-800 px-5 py-4">
      <h2 className="text-sm font-semibold text-zinc-100">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-1 text-[11px] text-zinc-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function TopMetric({
  label,
  value,
  unit,
  accent = false,
}: {
  label: string;
  value: string | number;
  unit?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#0c0c0c] px-4 py-3">
      <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </div>

      <div
        className={
          "mt-1 flex items-end gap-1 " +
          (accent
            ? "text-orange-400"
            : "text-zinc-100")
        }
      >
        <span className="text-xl font-semibold">
          {value}
        </span>

        {unit && (
          <span className="pb-0.5 text-[10px] text-zinc-500">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function Tab({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "w-full rounded-lg px-3 py-2.5 text-left text-xs font-medium transition " +
        (active
          ? "bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20"
          : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300")
      }
    >
      {children}
    </button>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">
          {label}
        </span>

        <span className="text-xs font-medium text-zinc-200">
          {value}

          {unit && (
            <span className="ml-1 text-zinc-600">
              {unit}
            </span>
          )}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(
            Number(event.target.value)
          )
        }
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-orange-500"
      />

      <div className="flex justify-between text-[9px] text-zinc-700">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function Result({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-900 py-2.5 last:border-0">
      <span className="text-xs text-zinc-500">
        {label}
      </span>

      <span className="text-xs font-medium text-zinc-200">
        {value}

        {unit && (
          <span className="ml-1 text-zinc-600">
            {unit}
          </span>
        )}
      </span>
    </div>
  );
}

/* =========================================================
   ECG
   ========================================================= */

function ECGMonitor({
  fc,
  qtc,
  potassio,
  calcio,
  sodio,
}: {
  fc: number;
  qtc: number;
  potassio: number;
  calcio: number;
  sodio: number;
}) {
  const [phase, setPhase] = useState(0);
  const [mounted, setMounted] = useState(false);

  const animationRef =
    useRef<number | null>(null);

  const previousTime =
    useRef(0);

  useEffect(() => {
    setMounted(true);

    const animate = (time: number) => {
      if (previousTime.current === 0) {
        previousTime.current = time;
      }

      const delta =
        time - previousTime.current;

      previousTime.current = time;

      setPhase(
        (oldPhase) =>
          oldPhase +
          delta * (fc / 60000)
      );

      animationRef.current =
        requestAnimationFrame(animate);
    };

    animationRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (
        animationRef.current !== null
      ) {
        cancelAnimationFrame(
          animationRef.current
        );
      }
    };
  }, [fc]);

  /*
   * POTÁSSIO
   *
   * O K+ continua sendo o principal
   * modulador das alterações de
   * repolarização neste modelo.
   */
  const kFactor = clamp(
    (potassio - 4.2) / 2,
    -1,
    1
  );

  /*
   * CÁLCIO
   *
   * O Ca2+ modula principalmente
   * a duração do QT.
   */
  const calciumFactor = clamp(
    (calcio - 2.4) / 1.1,
    -1,
    1
  );

  /*
   * SÓDIO
   *
   * 140 mEq/L é utilizado como
   * referência.
   *
   * O efeito foi mantido pequeno,
   * porque o Na+ sérico não produz
   * uma relação ECG tão direta quanto
   * K+ e Ca2+.
   */
  const sodiumFactor = clamp(
    (sodio - 140) / 20,
    -1,
    1
  );

  /*
   * Onda T.
   */
  const tAmplitude = clamp(
    13 + kFactor * 15,
    5,
    29
  );

  /*
   * QRS.
   *
   * Potássio elevado:
   * → maior tendência ao alargamento.
   *
   * Sódio muito alterado:
   * → pequena modulação adicional.
   */
  const sodiumQrsEffect =
    Math.abs(sodiumFactor) * 0.008;

  const qrsWidth =
    0.035 +
    Math.max(kFactor, 0) * 0.025 +
    (sodiumFactor < 0
      ? sodiumQrsEffect
      : sodiumQrsEffect * 0.35);

  /*
   * Amplitude da onda R.
   */
  const qrsAmplitude = clamp(
    50 + sodiumFactor * 8,
    38,
    58
  );

  /*
   * Pequena modulação da onda P.
   */
  const pAmplitude = clamp(
    10 + sodiumFactor * 1.8,
    7,
    12
  );

  /*
   * QT.
   */
  const qtWidth = clamp(
    0.22 -
      calciumFactor * 0.07,
    0.13,
    0.34
  );

  /*
   * Onda U na hipocalemia.
   */
  const uAmplitude =
    potassio < 3.2 ? 7 : 0;

  const width = 1000;
  const height = 190;

  /*
   * Durante SSR:
   *
   * phase = 0
   *
   * Depois que o componente monta:
   * phase começa a animar.
   *
   * Isso impede que o servidor
   * gere pontos diferentes do
   * primeiro HTML do navegador.
   */
  const animationPhase =
    mounted ? phase : 0;

  const points: string[] = [];

  for (let i = 0; i < width; i++) {
    const normalized =
      i / width;

    const cycle =
      (normalized +
        animationPhase) %
      1;

    let y = 0;

    /*
     * Onda P
     */
    if (
      cycle >= 0.04 &&
      cycle < 0.12
    ) {
      const t =
        (cycle - 0.04) / 0.08;

      y =
        Math.sin(t * Math.PI) *
        pAmplitude;
    }

    /*
     * Onda Q
     */
    if (
      cycle >= 0.17 &&
      cycle < 0.185
    ) {
      const t =
        (cycle - 0.17) / 0.015;

      y =
        -12 *
        Math.sin(t * Math.PI);
    }

    /*
     * Onda R
     */
    if (
      cycle >= 0.185 &&
      cycle < 0.205
    ) {
      const t =
        (cycle - 0.185) / 0.02;

      y =
        qrsAmplitude *
        Math.sin(t * Math.PI);
    }

    /*
     * Onda S
     */
    if (
      cycle >= 0.205 &&
      cycle < 0.205 + qrsWidth
    ) {
      const t =
        (cycle - 0.205) /
        qrsWidth;

      y =
        -22 *
        Math.sin(t * Math.PI);
    }

    /*
     * Onda T
     */
    if (
      cycle >= 0.29 &&
      cycle < 0.29 + qtWidth
    ) {
      const t =
        (cycle - 0.29) /
        qtWidth;

      y =
        tAmplitude *
        Math.sin(t * Math.PI);
    }

    /*
     * Onda U.
     */
    if (
      uAmplitude > 0 &&
      cycle >= 0.43 &&
      cycle < 0.52
    ) {
      const t =
        (cycle - 0.43) /
        0.09;

      y +=
        uAmplitude *
        Math.sin(t * Math.PI);
    }

    const screenY =
      height / 2 -
      y * 2.1;

    points.push(
      String(i) +
        "," +
        String(screenY)
    );
  }

  const qrsStatus =
    potassio >= 6
      ? "QRS ALARGANDO"
      : sodio < 125
      ? "CONDUÇÃO MODULADA"
      : "QRS PRESERVADO";

  const qtStatus =
    calcio < 2.1
      ? "QT PROLONGADO"
      : calcio > 2.7
      ? "QT ENCURTADO"
      : "QT PRESERVADO";

  const tStatus =
    potassio > 5.5
      ? "T APICULADA"
      : potassio < 3.2
      ? "T ACHATADA + U"
      : "REPOLARIZAÇÃO";

  const sodiumStatus =
    sodio < 125
      ? "Na⁺ BAIXO"
      : sodio > 155
      ? "Na⁺ ALTO"
      : "Na⁺ NORMAL";

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
        <div>
          <div className="text-xs font-semibold text-zinc-100">
            ECG
          </div>

          <div className="mt-0.5 text-[10px] text-zinc-600">
            Monitorização elétrica
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-semibold text-green-400">
            {fc}
          </div>

          <div className="text-[9px] uppercase tracking-widest text-zinc-600">
            bpm
          </div>
        </div>
      </div>

      <div className="relative h-[215px] overflow-hidden bg-[#050807]">
        <svg
          viewBox="0 0 1000 190"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <pattern
              id="ecgGrid"
              width="25"
              height="19"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 25 0 L 0 0 0 19"
                fill="none"
                stroke="rgba(40,120,70,0.18)"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          <rect
            width="100%"
            height="100%"
            fill="url(#ecgGrid)"
          />

          <polyline
            points={points.join(" ")}
            fill="none"
            stroke="#48e879"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="absolute left-4 top-3 text-[9px] text-green-500/60">
          ECG II
        </div>
      </div>

      <div className="grid grid-cols-5 divide-x divide-zinc-800 border-t border-zinc-800">
        <div className="px-3 py-3">
          <div className="text-[9px] uppercase text-zinc-600">
            QRS
          </div>

          <div className="mt-1 text-[10px] text-zinc-300">
            {qrsStatus}
          </div>
        </div>

        <div className="px-3 py-3">
          <div className="text-[9px] uppercase text-zinc-600">
            QTc
          </div>

          <div className="mt-1 text-[10px] text-zinc-300">
            {Math.round(qtc)} ms
          </div>
        </div>

        <div className="px-3 py-3">
          <div className="text-[9px] uppercase text-zinc-600">
            Ca²⁺
          </div>

          <div className="mt-1 text-[10px] text-zinc-300">
            {qtStatus}
          </div>
        </div>

        <div className="px-3 py-3">
          <div className="text-[9px] uppercase text-zinc-600">
            K⁺
          </div>

          <div className="mt-1 text-[10px] text-zinc-300">
            {tStatus}
          </div>
        </div>

        <div className="px-3 py-3">
          <div className="text-[9px] uppercase text-zinc-600">
            Na⁺
          </div>

          <div className="mt-1 text-[10px] text-zinc-300">
            {sodiumStatus}
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* =========================================================
   SATURAÇÃO / PLETH
   ========================================================= */

function SaturationMonitor({
  spo2,
  fc,
  pao2,
}: {
  spo2: number;
  fc: number;
  pao2: number;
}) {
  const [phase, setPhase] = useState(0);
  const [mounted, setMounted] = useState(false);

  const animationRef =
    useRef<number | null>(null);

  const previousTime =
    useRef(0);

  useEffect(() => {
    setMounted(true);

    const animate = (time: number) => {
      if (previousTime.current === 0) {
        previousTime.current = time;
      }

      const delta =
        time - previousTime.current;

      previousTime.current = time;

      setPhase(
        (oldPhase) =>
          oldPhase +
          delta * (fc / 60000)
      );

      animationRef.current =
        requestAnimationFrame(animate);
    };

    animationRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (
        animationRef.current !== null
      ) {
        cancelAnimationFrame(
          animationRef.current
        );
      }
    };
  }, [fc]);

  const width = 1000;
  const height = 190;

  const animationPhase =
    mounted ? phase : 0;

  const points: string[] = [];

  for (let i = 0; i < width; i++) {
    const normalized =
      i / width;

    const cycle =
      (normalized +
        animationPhase) %
      1;

    let y = 0;

    if (cycle < 0.12) {
      const t =
        cycle / 0.12;

      y =
        10 + 42 * t;
    } else if (cycle < 0.22) {
      const t =
        (cycle - 0.12) / 0.1;

      y =
        52 - 15 * t;
    } else if (cycle < 0.28) {
      const t =
        (cycle - 0.22) / 0.06;

      y =
        37 - 28 * t;
    } else {
      const t =
        (cycle - 0.28) / 0.72;

      y =
        9 - 5 * t;
    }

    y *= clamp(
      spo2 / 100,
      0.55,
      1
    );

    const screenY =
      height / 2 -
      y * 2;

    points.push(
      String(i) +
        "," +
        String(screenY)
    );
  }

  const status =
    spo2 >= 95
      ? "NORMAL"
      : spo2 >= 90
      ? "ATENÇÃO"
      : "BAIXA";

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
        <div>
          <div className="text-xs font-semibold text-zinc-100">
            SpO₂
          </div>

          <div className="mt-0.5 text-[10px] text-zinc-600">
            Oximetria / pletismografia
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-semibold text-blue-400">
            {Math.round(spo2)}

            <span className="ml-1 text-sm">
              %
            </span>
          </div>

          <div className="text-[9px] uppercase tracking-widest text-zinc-600">
            saturação
          </div>
        </div>
      </div>

      <div className="relative h-[215px] overflow-hidden bg-[#04080d]">
        <svg
          viewBox="0 0 1000 190"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <pattern
              id="spoGrid"
              width="25"
              height="19"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 25 0 L 0 0 0 19"
                fill="none"
                stroke="rgba(30,100,180,0.2)"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          <rect
            width="100%"
            height="100%"
            fill="url(#spoGrid)"
          />

          <polyline
            points={points.join(" ")}
            fill="none"
            stroke="#38a8ff"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="absolute left-4 top-3 text-[9px] text-blue-400/60">
          PLETH
        </div>

        <div className="absolute right-4 top-3 text-right">
          <div className="text-[9px] uppercase text-zinc-600">
            PR
          </div>

          <div className="text-sm font-medium text-blue-300">
            {fc} bpm
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-zinc-800 border-t border-zinc-800">
        <div className="px-4 py-3">
          <div className="text-[9px] uppercase text-zinc-600">
            Status
          </div>

          <div
            className={
              "mt-1 text-[10px] " +
              (spo2 >= 95
                ? "text-blue-400"
                : spo2 >= 90
                ? "text-yellow-400"
                : "text-red-400")
            }
          >
            {status}
          </div>
        </div>

        <div className="px-4 py-3">
          <div className="text-[9px] uppercase text-zinc-600">
            PaO₂
          </div>

          <div className="mt-1 text-[10px] text-zinc-300">
            {Math.round(pao2)} mmHg
          </div>
        </div>

        <div className="px-4 py-3">
          <div className="text-[9px] uppercase text-zinc-600">
            FC
          </div>

          <div className="mt-1 text-[10px] text-zinc-300">
            {fc} bpm
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* =========================================================
   PÁGINA
   ========================================================= */

export default function LaboratorioPage() {
  const [estado, setEstado] =
    useState<Estado>(estadoInicial);

  const [categoria, setCategoria] =
    useState<Categoria>(
      "gasometria"
    );

  const [respirando, setRespirando] =
    useState(true);

  const [tempoApneia, setTempoApneia] =
    useState(0);

  useEffect(() => {
    if (respirando) {
      setTempoApneia(0);
      return;
    }

    const timer =
      window.setInterval(() => {
        setTempoApneia(
          (previous) =>
            Math.min(
              previous + 1,
              120
            )
        );
      }, 1000);

    return () =>
      window.clearInterval(timer);
  }, [respirando]);

  const estadoEfetivo =
    useMemo<Estado>(() => {
      if (respirando) {
        return estado;
      }

      return {
        ...estado,

        fr: 0,

        volumeCorrente: 0,

        pao2: clamp(
          estado.pao2 -
            tempoApneia * 1.25,
          20,
          500
        ),

        paco2: clamp(
          estado.paco2 +
            tempoApneia * 1.35,
          10,
          150
        ),
      };
    }, [
      estado,
      respirando,
      tempoApneia,
    ]);

  const resultados = useMemo(
    () =>
      calcular(estadoEfetivo),
    [estadoEfetivo]
  );

  function alterar(
    campo: keyof Estado,
    valor: number
  ) {
    setEstado((previous) => ({
      ...previous,
      [campo]: valor,
    }));
  }

  function alternarRespiracao() {
    setRespirando(
      (previous) => !previous
    );

    setTempoApneia(0);
  }

  function resetar() {
    setEstado({
      ...estadoInicial,
    });

    setRespirando(true);
    setTempoApneia(0);
  }

  const categorias: {
    id: Categoria;
    label: string;
  }[] = [
    {
      id: "gasometria",
      label: "Gasometria",
    },
    {
      id: "respiratorio",
      label: "Respiratório",
    },
    {
      id: "cardio",
      label: "Cardiovascular",
    },
    {
      id: "renal",
      label: "Renal",
    },
    {
      id: "eletrólitos",
      label: "Eletrólitos",
    },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#080808] text-zinc-100">
        <div className="mx-auto max-w-[1700px] px-5 py-6">
          <header className="mb-5 flex flex-col gap-4 border-b border-zinc-800 pb-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={
                    "h-2 w-2 rounded-full " +
                    (respirando
                      ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.7)]"
                      : "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.7)]")
                  }
                />

                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Simulação fisiológica
                </span>
              </div>

              <h1 className="mt-2 text-xl font-semibold">
                Laboratório
              </h1>

              <p className="mt-1 text-xs text-zinc-600">
                Ambiente interativo de
                fisiologia cardiovascular,
                respiratória e ácido-base.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!respirando && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400">
                  Apneia · {tempoApneia}s
                </div>
              )}

              <button
                type="button"
                onClick={alternarRespiracao}
                className={
                  "rounded-xl px-4 py-2.5 text-xs font-semibold " +
                  (respirando
                    ? "border border-zinc-700 bg-zinc-900 text-zinc-200"
                    : "bg-red-500 text-white")
                }
              >
                {respirando
                  ? "Pausar respiração"
                  : "Retomar respiração"}
              </button>

              <button
                type="button"
                onClick={resetar}
                className="rounded-xl border border-zinc-800 px-4 py-2.5 text-xs text-zinc-500"
              >
                Resetar
              </button>
            </div>
          </header>

          <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
            <TopMetric
              label="pH"
              value={resultados.ph.toFixed(2)}
              accent
            />

            <TopMetric
              label="PaCO₂"
              value={estadoEfetivo.paco2}
              unit="mmHg"
            />

            <TopMetric
              label="HCO₃⁻"
              value={estadoEfetivo.hco3}
              unit="mEq/L"
            />

            <TopMetric
              label="PaO₂"
              value={Math.round(
                resultados.pao2Final
              )}
              unit="mmHg"
            />

            <TopMetric
              label="SpO₂"
              value={Math.round(
                resultados.spo2
              )}
              unit="%"
            />

            <TopMetric
              label="FC"
              value={estado.fc}
              unit="bpm"
            />

            <TopMetric
              label="PA"
              value={
                String(
                  Math.round(
                    resultados.pas
                  )
                ) +
                "/" +
                String(
                  Math.round(
                    resultados.pad
                  )
                )
              }
              unit="mmHg"
            />

            <TopMetric
              label="PAM"
              value={Math.round(
                resultados.pam
              )}
              unit="mmHg"
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-[235px_minmax(0,1fr)_300px]">
            <aside>
              <Panel className="overflow-hidden">
                <PanelTitle
                  title="Controles"
                  subtitle="Variáveis fisiológicas"
                />

                <div className="space-y-1 p-3">
                  {categorias.map(
                    (item) => (
                      <Tab
                        key={item.id}
                        active={
                          categoria ===
                          item.id
                        }
                        onClick={() =>
                          setCategoria(
                            item.id
                          )
                        }
                      >
                        {item.label}
                      </Tab>
                    )
                  )}
                </div>

                <div className="border-t border-zinc-800 p-5">
                  {categoria ===
                    "gasometria" && (
                    <div className="space-y-6">
                      <Slider
                        label="PaCO₂"
                        value={
                          estado.paco2
                        }
                        min={20}
                        max={100}
                        step={1}
                        unit="mmHg"
                        onChange={(
                          value
                        ) =>
                          alterar(
                            "paco2",
                            value
                          )
                        }
                      />

                      <Slider
                        label="HCO₃⁻"
                        value={
                          estado.hco3
                        }
                        min={10}
                        max={40}
                        step={1}
                        unit="mEq/L"
                        onChange={(
                          value
                        ) =>
                          alterar(
                            "hco3",
                            value
                          )
                        }
                      />

                      <Slider
                        label="PaO₂"
                        value={
                          estado.pao2
                        }
                        min={30}
                        max={300}
                        step={1}
                        unit="mmHg"
                        onChange={(
                          value
                        ) =>
                          alterar(
                            "pao2",
                            value
                          )
                        }
                      />

                      <Slider
                        label="FiO₂"
                        value={
                          estado.fio2
                        }
                        min={21}
                        max={100}
                        step={1}
                        unit="%"
                        onChange={(
                          value
                        ) =>
                          alterar(
                            "fio2",
                            value
                          )
                        }
                      />
                    </div>
                  )}

                  {categoria ===
                    "respiratorio" && (
                    <div className="space-y-6">
                      <Slider
                        label="Frequência respiratória"
                        value={
                          estado.fr
                        }
                        min={4}
                        max={40}
                        step={1}
                        unit="irpm"
                        onChange={(
                          value
                        ) =>
                          alterar(
                            "fr",
                            value
                          )
                        }
                      />

                      <Slider
                        label="Volume corrente"
                        value={
                          estado.volumeCorrente
                        }
                        min={200}
                        max={1200}
                        step={10}
                        unit="mL"
                        onChange={(
                          value
                        ) =>
                          alterar(
                            "volumeCorrente",
                            value
                          )
                        }
                      />

                      <Slider
                        label="Metabolismo"
                        value={
                          estado.metabolismo
                        }
                        min={50}
                        max={200}
                        step={5}
                        unit="%"
                        onChange={(
                          value
                        ) =>
                          alterar(
                            "metabolismo",
                            value
                          )
                        }
                      />
                    </div>
                  )}

                  {categoria ===
                    "cardio" && (
                    <div className="space-y-6">
                      <Slider
                        label="Frequência cardíaca"
                        value={
                          estado.fc
                        }
                        min={30}
                        max={180}
                        step={1}
                        unit="bpm"
                        onChange={(
                          value
                        ) =>
                          alterar(
                            "fc",
                            value
                          )
                        }
                      />

                      <Slider
                        label="Vasoconstrição"
                        value={
                          estado.vasoconstricao
                        }
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                        onChange={(
                          value
                        ) =>
                          alterar(
                            "vasoconstricao",
                            value
                          )
                        }
                      />

                      <Slider
                        label="Vasodilatação"
                        value={
                          estado.vasodilatacao
                        }
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                        onChange={(
                          value
                        ) =>
                          alterar(
                            "vasodilatacao",
                            value
                          )
                        }
                      />
                    </div>
                  )}

                  {categoria ===
                    "renal" && (
                    <div className="space-y-6">
                      <Slider
                        label="Hidratação"
                        value={
                          estado.hidratacao
                        }
                        min={0}
                        max={150}
                        step={1}
                        unit="%"
                        onChange={(
                          value
                        ) =>
                          alterar(
                            "hidratacao",
                            value
                          )
                        }
                      />

                      <Slider
                        label="ADH"
                        value={
                          estado.adh
                        }
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                        onChange={(
                          value
                        ) =>
                          alterar(
                            "adh",
                            value
                          )
                        }
                      />

                      <Slider
                        label="Creatinina"
                        value={
                          estado.creatinina
                        }
                        min={0.3}
                        max={5}
                        step={0.1}
                        unit="mg/dL"
                        onChange={(
                          value
                        ) =>
                          alterar(
                            "creatinina",
                            value
                          )
                        }
                      />
                    </div>
                  )}

                  {categoria ===
                    "eletrólitos" && (
                    <div className="space-y-6">
                      <Slider
                        label="Sódio"
                        value={
                          estado.sodio
                        }
                        min={110}
                        max={170}
                        step={1}
                        unit="mEq/L"
                        onChange={(
                          value
                        ) =>
                          alterar(
                            "sodio",
                            value
                          )
                        }
                      />

                      <Slider
                        label="Potássio"
                        value={
                          estado.potassio
                        }
                        min={2}
                        max={8}
                        step={0.1}
                        unit="mEq/L"
                        onChange={(
                          value
                        ) =>
                          alterar(
                            "potassio",
                            value
                          )
                        }
                      />

                      <Slider
                        label="Cálcio"
                        value={
                          estado.calcio
                        }
                        min={1.5}
                        max={3.5}
                        step={0.1}
                        unit="mmol/L"
                        onChange={(
                          value
                        ) =>
                          alterar(
                            "calcio",
                            value
                          )
                        }
                      />

                      <Slider
                        label="Cloro"
                        value={
                          estado.cloro
                        }
                        min={80}
                        max={130}
                        step={1}
                        unit="mEq/L"
                        onChange={(
                          value
                        ) =>
                          alterar(
                            "cloro",
                            value
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              </Panel>
            </aside>

            <main className="min-w-0 space-y-5">
              <div className="grid gap-5 lg:grid-cols-2">
                <ECGMonitor
                  fc={estado.fc}
                  qtc={resultados.qtc}
                  potassio={
                    estado.potassio
                  }
                  calcio={estado.calcio}
                  sodio={estado.sodio}
                />

                <SaturationMonitor
                  spo2={
                    resultados.spo2
                  }
                  fc={estado.fc}
                  pao2={
                    resultados.pao2Final
                  }
                />
              </div>

              <Panel>
                <PanelTitle
                  title="Gasometria arterial"
                  subtitle="Análise ácido-base e oxigenação"
                />

                <div className="grid grid-cols-2 gap-px bg-zinc-800 sm:grid-cols-4">
                  <div className="bg-[#101010] p-5">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600">
                      pH
                    </div>

                    <div className="mt-2 text-4xl font-semibold text-orange-400">
                      {resultados.ph.toFixed(
                        2
                      )}
                    </div>

                    <div className="mt-2 text-[10px] text-zinc-600">
                      referência
                      7,35–7,45
                    </div>
                  </div>

                  <div className="bg-[#101010] p-5">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600">
                      PaCO₂
                    </div>

                    <div className="mt-2 text-4xl font-semibold">
                      {
                        estadoEfetivo.paco2
                      }
                    </div>

                    <div className="mt-2 text-[10px] text-zinc-600">
                      mmHg
                    </div>
                  </div>

                  <div className="bg-[#101010] p-5">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600">
                      HCO₃⁻
                    </div>

                    <div className="mt-2 text-4xl font-semibold">
                      {
                        estadoEfetivo.hco3
                      }
                    </div>

                    <div className="mt-2 text-[10px] text-zinc-600">
                      mEq/L
                    </div>
                  </div>

                  <div className="bg-[#101010] p-5">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600">
                      PaO₂
                    </div>

                    <div className="mt-2 text-4xl font-semibold text-blue-400">
                      {Math.round(
                        resultados.pao2Final
                      )}
                    </div>

                    <div className="mt-2 text-[10px] text-zinc-600">
                      mmHg
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 p-5 md:grid-cols-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600">
                      FiO₂
                    </div>

                    <div className="mt-1 text-lg font-medium">
                      {estado.fio2}%
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600">
                      Ânion gap
                    </div>

                    <div className="mt-1 text-lg font-medium">
                      {resultados.anionGap.toFixed(
                        1
                      )}

                      <span className="ml-1 text-xs text-zinc-600">
                        mEq/L
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600">
                      Distúrbio
                    </div>

                    <div className="mt-1 text-sm font-medium text-orange-400">
                      {
                        resultados.disturbo
                      }
                    </div>
                  </div>
                </div>
              </Panel>

              <Panel>
                <PanelTitle
                  title="Mecânica respiratória"
                  subtitle="Dados derivados da ventilação"
                />

                <div className="grid grid-cols-2 divide-x divide-zinc-800 sm:grid-cols-4">
                  <div className="p-5">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600">
                      FR
                    </div>

                    <div className="mt-2 text-2xl font-semibold">
                      {
                        estadoEfetivo.fr
                      }
                    </div>

                    <div className="mt-1 text-[10px] text-zinc-600">
                      irpm
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600">
                      VC
                    </div>

                    <div className="mt-2 text-2xl font-semibold">
                      {
                        estadoEfetivo.volumeCorrente
                      }
                    </div>

                    <div className="mt-1 text-[10px] text-zinc-600">
                      mL
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600">
                      VE
                    </div>

                    <div className="mt-2 text-2xl font-semibold">
                      {resultados.ventilacaoMinuto.toFixed(
                        1
                      )}
                    </div>

                    <div className="mt-1 text-[10px] text-zinc-600">
                      L/min
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600">
                      VA
                    </div>

                    <div className="mt-2 text-2xl font-semibold">
                      {resultados.ventilacaoAlveolar.toFixed(
                        1
                      )}
                    </div>

                    <div className="mt-1 text-[10px] text-zinc-600">
                      L/min
                    </div>
                  </div>
                </div>
              </Panel>
            </main>

            <aside className="space-y-5">
              <Panel>
                <PanelTitle
                  title="Interpretação"
                  subtitle="Leitura dos resultados"
                />

                <div className="p-5">
                  <div className="rounded-xl border border-orange-500/10 bg-orange-500/5 p-4">
                    <div className="text-[9px] uppercase tracking-widest text-orange-500/70">
                      Ácido-base
                    </div>

                    <div className="mt-2 text-sm font-semibold text-orange-400">
                      {
                        resultados.disturbo
                      }
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <Result
                      label="pH"
                      value={resultados.ph.toFixed(
                        2
                      )}
                    />

                    <Result
                      label="PaCO₂"
                      value={
                        estadoEfetivo.paco2
                      }
                      unit="mmHg"
                    />

                    <Result
                      label="HCO₃⁻"
                      value={
                        estadoEfetivo.hco3
                      }
                      unit="mEq/L"
                    />

                    <Result
                      label="Ânion gap"
                      value={resultados.anionGap.toFixed(
                        1
                      )}
                    />

                    <Result
                      label="Winter"
                      value={
                        resultados.winterMin.toFixed(
                          1
                        ) +
                        "–" +
                        resultados.winterMax.toFixed(
                          1
                        )
                      }
                    />
                  </div>
                </div>
              </Panel>

              <Panel>
                <PanelTitle
                  title="Hemodinâmica"
                  subtitle="Variáveis cardiovasculares"
                />

                <div className="p-5">
                  <Result
                    label="Pressão sistólica"
                    value={Math.round(
                      resultados.pas
                    )}
                    unit="mmHg"
                  />

                  <Result
                    label="Pressão diastólica"
                    value={Math.round(
                      resultados.pad
                    )}
                    unit="mmHg"
                  />

                  <Result
                    label="PAM"
                    value={Math.round(
                      resultados.pam
                    )}
                    unit="mmHg"
                  />

                  <Result
                    label="FC"
                    value={estado.fc}
                    unit="bpm"
                  />

                  <Result
                    label="R-R"
                    value={Math.round(
                      resultados.rr
                    )}
                    unit="ms"
                  />
                </div>
              </Panel>

              <Panel>
                <PanelTitle
                  title="Eletrólitos"
                  subtitle="Estado atual"
                />

                <div className="p-5">
                  <Result
                    label="Na⁺"
                    value={estado.sodio}
                    unit="mEq/L"
                  />

                  <Result
                    label="K⁺"
                    value={estado.potassio.toFixed(
                      1
                    )}
                    unit="mEq/L"
                  />

                  <Result
                    label="Ca²⁺"
                    value={estado.calcio.toFixed(
                      1
                    )}
                    unit="mmol/L"
                  />

                  <Result
                    label="Cl⁻"
                    value={estado.cloro}
                    unit="mEq/L"
                  />
                </div>
              </Panel>

              <Panel>
                <PanelTitle
                  title="Respiração"
                  subtitle="Estado atual"
                />

                <div className="p-5">
                  <div
                    className={
                      "rounded-xl border p-4 " +
                      (respirando
                        ? "border-green-500/10 bg-green-500/5"
                        : "border-red-500/10 bg-red-500/5")
                    }
                  >
                    <div className="text-[9px] uppercase tracking-widest text-zinc-600">
                      Estado
                    </div>

                    <div
                      className={
                        "mt-2 text-sm font-semibold " +
                        (respirando
                          ? "text-green-400"
                          : "text-red-400")
                      }
                    >
                      {respirando
                        ? "RESPIRANDO"
                        : "APNEIA"}
                    </div>

                    {!respirando && (
                      <div className="mt-2 text-[10px] text-zinc-600">
                        Tempo:{" "}
                        {tempoApneia}s
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            </aside>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}