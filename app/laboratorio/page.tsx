"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

  creatinina: 0.9,
  adh: 50,
  hidratacao: 100,

  vasoconstricao: 50,
  vasodilatacao: 50,
};

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.min(
    Math.max(value, min),
    max
  );
}

/* =========================================================
   CÁLCULOS FISIOLÓGICOS
========================================================= */

function calcular(estado: Estado) {
  const ventilacaoMinuto =
    (estado.fr *
      estado.volumeCorrente) /
    1000;

  const ventilacaoAlveolar =
    (estado.fr *
      Math.max(
        estado.volumeCorrente - 150,
        0
      )) /
    1000;

  const ph =
    6.1 +
    Math.log10(
      estado.hco3 /
        (0.03 *
          Math.max(
            estado.paco2,
            1
          ))
    );

  const anionGap =
    estado.sodio -
    estado.cloro -
    estado.hco3;

  const winter =
    1.5 * estado.hco3 + 8;

  const winterMin =
    winter - 2;

  const winterMax =
    winter + 2;

  const spo2 = clamp(
    90 +
      (estado.pao2 - 60) *
        0.12,
    60,
    100
  );

  const pas = clamp(
    110 +
      (estado.fc - 70) *
        0.2 +
      estado.vasoconstricao *
        0.25 -
      estado.vasodilatacao *
        0.2,
    60,
    220
  );

  const pad = clamp(
    70 +
      estado.vasoconstricao *
        0.15 -
      estado.vasodilatacao *
        0.12,
    35,
    140
  );

  const pam =
    (pas + 2 * pad) / 3;

  const rr =
    60000 /
    Math.max(estado.fc, 1);

  const qtc =
    380 *
    Math.sqrt(
      60 /
        Math.max(
          estado.fc,
          1
        )
    );

  let disturbo =
    "Equilíbrio ácido-base";

  if (ph < 7.35) {
    if (
      estado.hco3 < 22 &&
      estado.paco2 > 45
    ) {
      disturbo = "Acidose mista";
    } else if (
      estado.hco3 < 22
    ) {
      disturbo =
        "Acidose metabólica";
    } else if (
      estado.paco2 > 45
    ) {
      disturbo =
        "Acidose respiratória";
    } else {
      disturbo = "Acidemia";
    }
  }

  if (ph > 7.45) {
    if (
      estado.hco3 > 26 &&
      estado.paco2 < 35
    ) {
      disturbo =
        "Alcalose mista";
    } else if (
      estado.hco3 > 26
    ) {
      disturbo =
        "Alcalose metabólica";
    } else if (
      estado.paco2 < 35
    ) {
      disturbo =
        "Alcalose respiratória";
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
    spo2,
    pas,
    pad,
    pam,
    rr,
    qtc,
    disturbo,
  };
}

/* =========================================================
   ECG
========================================================= */

function ECGMonitor({
  fc,
  parado,
}: {
  fc: number;
  parado: boolean;
}) {
  const [phase, setPhase] =
    useState(0);

  const frameRef =
    useRef<number | null>(null);

  const lastTimeRef =
    useRef<number | null>(null);

  useEffect(() => {
    const bpm =
      Math.max(fc, 30);

    const beatInterval =
      60000 / bpm;

    let elapsed = 0;

    function animate(time: number) {
      if (
        lastTimeRef.current ===
        null
      ) {
        lastTimeRef.current =
          time;
      }

      const delta =
        time -
        lastTimeRef.current;

      lastTimeRef.current =
        time;

      elapsed += delta;

      setPhase(
        (elapsed %
          beatInterval) /
          beatInterval
      );

      frameRef.current =
        requestAnimationFrame(
          animate
        );
    }

    frameRef.current =
      requestAnimationFrame(
        animate
      );

    return () => {
      if (
        frameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          frameRef.current
        );
      }

      lastTimeRef.current =
        null;
    };
  }, [fc]);

  const pontos = useMemo(() => {
    const resultado: string[] =
      [];

    for (
      let i = 0;
      i < 900;
      i++
    ) {
      const x =
        (i / 899) * 1000;

      const normalizado =
        (i / 900 + phase) % 1;

      let y = 50;

      if (
        normalizado >= 0.08 &&
        normalizado < 0.17
      ) {
        const p =
          (normalizado - 0.08) /
          0.09;

        y -=
          Math.sin(
            p * Math.PI
          ) * 8;
      }

      if (
        normalizado >= 0.22 &&
        normalizado < 0.245
      ) {
        const q =
          (normalizado - 0.22) /
          0.025;

        y +=
          Math.sin(
            q * Math.PI
          ) * 9;
      }

      if (
        normalizado >= 0.245 &&
        normalizado < 0.275
      ) {
        const r =
          (normalizado - 0.245) /
          0.03;

        y -=
          Math.sin(
            r * Math.PI
          ) * 42;
      }

      if (
        normalizado >= 0.275 &&
        normalizado < 0.305
      ) {
        const s =
          (normalizado - 0.275) /
          0.03;

        y +=
          Math.sin(
            s * Math.PI
          ) * 15;
      }

      if (
        normalizado >= 0.39 &&
        normalizado < 0.58
      ) {
        const t =
          (normalizado - 0.39) /
          0.19;

        y -=
          Math.sin(
            t * Math.PI
          ) * 12;
      }

      resultado.push(
        `${x.toFixed(
          2
        )},${y.toFixed(2)}`
      );
    }

    return resultado.join(" ");
  }, [phase]);

  const rr =
    60000 /
    Math.max(fc, 1);

  const qtc =
    380 *
    Math.sqrt(
      60 /
        Math.max(
          fc,
          1
        )
    );

  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-[#080909]">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-4 py-2.5">
        <div>
          <p className="text-[8px] uppercase tracking-[0.22em] text-neutral-600">
            Monitor fisiológico
          </p>

          <h3 className="text-xs font-semibold text-neutral-300">
            Eletrocardiograma
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              parado
                ? "bg-orange-400"
                : "animate-pulse bg-emerald-400"
            }`}
          />

          <span
            className={`text-[8px] uppercase tracking-widest ${
              parado
                ? "text-orange-400"
                : "text-emerald-400/70"
            }`}
          >
            {parado
              ? "Apneia"
              : "Ritmo sinusal"}
          </span>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#030605]">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(74,222,128,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,.07) 1px, transparent 1px)",
            backgroundSize:
              "24px 24px",
          }}
        />

        <svg
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          className="relative h-full w-full"
        >
          <polyline
            points={pontos}
            fill="none"
            stroke="#4ade80"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="absolute left-4 top-3">
          <p className="text-[7px] uppercase tracking-widest text-emerald-500/60">
            ECG
          </p>

          <p className="font-mono text-xl font-semibold text-emerald-300">
            {fc}

            <span className="ml-1 text-[8px] font-normal text-emerald-500/60">
              BPM
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 border-t border-white/[0.05]">
        <ECGStat
          label="Ritmo"
          value="Sinusal"
        />

        <ECGStat
          label="RR"
          value={`${rr.toFixed(
            0
          )} ms`}
        />

        <ECGStat
          label="QRS"
          value="80 ms"
        />

        <ECGStat
          label="QTc"
          value={`${qtc.toFixed(
            0
          )} ms`}
        />
      </div>
    </section>
  );
}

/* =========================================================
   CORPO HUMANO MINIMALISTA
========================================================= */

function HumanBody({
  respirando,
  ph,
  spo2,
  fc,
}: {
  respirando: boolean;
  ph: number;
  spo2: number;
  fc: number;
}) {
  return (
    <div className="relative h-[220px] w-[145px]">
      <style jsx>{`
        @keyframes breathing {
          0%,
          100% {
            transform: translateX(-50%) scale(1);
          }

          50% {
            transform: translateX(-50%) scale(1.035);
          }
        }

        @keyframes heartbeat {
          0%,
          100% {
            transform: translateX(-50%) scale(1);
          }

          12% {
            transform: translateX(-50%) scale(1.12);
          }

          24% {
            transform: translateX(-50%) scale(1);
          }
        }

        .lungs {
          animation: ${
            respirando
              ? "breathing 3s ease-in-out infinite"
              : "none"
          };
        }

        .heart {
          animation: ${
            fc > 30
              ? `heartbeat ${
                  60 /
                  Math.max(
                    fc,
                    1
                  )
                }s ease-in-out infinite`
              : "none"
          };
        }
      `}</style>

      {/* SILHUETA */}

      <svg
        viewBox="0 0 180 300"
        className="absolute inset-0 h-full w-full"
        aria-label="Modelo corporal"
      >
        {/* cabeça */}

        <circle
          cx="90"
          cy="25"
          r="18"
          fill="none"
          stroke="rgba(255,255,255,.16)"
          strokeWidth="1.2"
        />

        {/* pescoço */}

        <path
          d="M82 42 L82 58 M98 42 L98 58"
          stroke="rgba(255,255,255,.12)"
          strokeWidth="1.2"
        />

        {/* tronco */}

        <path
          d="
            M82 54
            C65 57 55 69 53 91
            L49 144
            C48 157 58 166 70 167
            L110 167
            C122 166 132 157 131 144
            L127 91
            C125 69 115 57 98 54
          "
          fill="rgba(255,255,255,.012)"
          stroke="rgba(255,255,255,.13)"
          strokeWidth="1.2"
        />

        {/* braço esquerdo */}

        <path
          d="
            M57 70
            C47 75 42 89 39 108
            L34 150
            C33 158 37 163 42 163
            C47 163 50 158 51 151
            L59 110
          "
          fill="none"
          stroke="rgba(255,255,255,.11)"
          strokeWidth="1.2"
        />

        {/* braço direito */}

        <path
          d="
            M123 70
            C133 75 138 89 141 108
            L146 150
            C147 158 143 163 138 163
            C133 163 130 158 129 151
            L121 110
          "
          fill="none"
          stroke="rgba(255,255,255,.11)"
          strokeWidth="1.2"
        />

        {/* pernas */}

        <path
          d="
            M70 163
            L69 220
            L64 276
          "
          fill="none"
          stroke="rgba(255,255,255,.12)"
          strokeWidth="1.5"
        />

        <path
          d="
            M110 163
            L111 220
            L116 276
          "
          fill="none"
          stroke="rgba(255,255,255,.12)"
          strokeWidth="1.5"
        />

        {/* pés */}

        <path
          d="M64 276 L55 282"
          stroke="rgba(255,255,255,.12)"
          strokeWidth="1.5"
        />

        <path
          d="M116 276 L125 282"
          stroke="rgba(255,255,255,.12)"
          strokeWidth="1.5"
        />

        {/* linha central */}

        <path
          d="M90 58 L90 166"
          stroke="rgba(249,115,22,.12)"
          strokeDasharray="2 4"
        />
      </svg>

      {/* PULMÕES */}

      <div
        className={`lungs absolute left-1/2 top-[58px] z-10 flex h-[72px] w-[64px] -translate-x-1/2 items-center justify-center ${
          respirando
            ? "opacity-80"
            : "opacity-25 grayscale"
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full"
        >
          <path
            d="
              M48 22
              C39 28 30 39 24 51
              C18 64 18 78 27 83
              C35 87 43 80 46 69
              L50 48
              Z
            "
            fill="rgba(249,115,22,.08)"
            stroke="rgba(249,115,22,.45)"
            strokeWidth="1.5"
          />

          <path
            d="
              M52 22
              C61 28 70 39 76 51
              C82 64 82 78 73 83
              C65 87 57 80 54 69
              L50 48
              Z
            "
            fill="rgba(249,115,22,.08)"
            stroke="rgba(249,115,22,.45)"
            strokeWidth="1.5"
          />

          <path
            d="M50 8 L50 48"
            stroke="rgba(249,115,22,.55)"
            strokeWidth="2"
          />

          <path
            d="M50 42 L37 55 M50 42 L63 55"
            stroke="rgba(249,115,22,.35)"
            strokeWidth="1.3"
          />
        </svg>
      </div>

      {/* CORAÇÃO */}

      <div className="heart absolute left-1/2 top-[103px] z-20 -translate-x-1/2">
        <svg
          viewBox="0 0 40 40"
          className="h-[29px] w-[29px]"
        >
          <path
            d="
              M20 34
              C17 31 6 24 6 14
              C6 7 15 5 20 12
              C25 5 34 7 34 14
              C34 24 23 31 20 34
              Z
            "
            fill={
              fc > 100
                ? "rgba(248,113,113,.22)"
                : "rgba(249,115,22,.18)"
            }
            stroke={
              fc > 100
                ? "rgba(248,113,113,.7)"
                : "rgba(249,115,22,.65)"
            }
            strokeWidth="1.3"
          />
        </svg>
      </div>

      {/* STATUS RESPIRAÇÃO */}

      <div className="absolute -left-[54px] top-[67px]">
        <StatusBadge
          label="RESP"
          value={
            respirando
              ? "ATIVA"
              : "APNEIA"
          }
          warning={!respirando}
        />
      </div>

      {/* SpO2 */}

      <div className="absolute -right-[54px] top-[82px]">
        <StatusBadge
          label="SpO₂"
          value={`${spo2.toFixed(
            0
          )}%`}
          warning={spo2 < 92}
        />
      </div>

      {/* pH */}

      <div className="absolute -left-[44px] top-[124px]">
        <StatusBadge
          label="pH"
          value={ph.toFixed(2)}
          warning={
            ph < 7.35 ||
            ph > 7.45
          }
        />
      </div>
    </div>
  );
}

/* =========================================================
   PÁGINA
========================================================= */

export default function LaboratorioPage() {
  const [estado, setEstado] =
    useState<Estado>(
      estadoInicial
    );

  const [categoria, setCategoria] =
    useState<Categoria>(
      "gasometria"
    );

  const [respirando, setRespirando] =
    useState(true);

  const [tempoApneia, setTempoApneia] =
    useState(0);

  /* -------------------------------------------------------
     CRONÔMETRO DA APNEIA
  ------------------------------------------------------- */

  useEffect(() => {
    if (respirando) {
      return;
    }

    const intervalo =
      window.setInterval(() => {
        setTempoApneia(
          (tempo) =>
            Math.min(
              tempo + 1,
              120
            )
        );
      }, 1000);

    return () =>
      window.clearInterval(
        intervalo
      );
  }, [respirando]);

  /* -------------------------------------------------------
     ALTERAÇÕES CAUSADAS PELA APNEIA
  ------------------------------------------------------- */

  const estadoEfetivo =
    useMemo<Estado>(() => {
      if (respirando) {
        return estado;
      }

      /*
       * Modelo didático simplificado.
       *
       * Apneia:
       * - ventilação cai para zero
       * - PaO2 cai progressivamente
       * - PaCO2 aumenta progressivamente
       */

      const quedaO2 =
        tempoApneia * 1.25;

      const aumentoCO2 =
        tempoApneia * 1.35;

      return {
        ...estado,

        fr: 0,

        volumeCorrente: 0,

        pao2: clamp(
          estado.pao2 -
            quedaO2,
          30,
          500
        ),

        paco2: clamp(
          estado.paco2 +
            aumentoCO2,
          20,
          120
        ),
      };
    }, [
      estado,
      respirando,
      tempoApneia,
    ]);

  const resultados =
    useMemo(
      () =>
        calcular(
          estadoEfetivo
        ),
      [estadoEfetivo]
    );

  function alterar(
    campo: keyof Estado,
    valor: number
  ) {
    setEstado(
      (atual) => ({
        ...atual,
        [campo]: valor,
      })
    );
  }

  function alternarRespiracao() {
    if (respirando) {
      setTempoApneia(0);
      setRespirando(false);
    } else {
      setTempoApneia(0);
      setRespirando(true);
    }
  }

  function resetar() {
    setEstado(
      estadoInicial
    );

    setTempoApneia(0);
    setRespirando(true);
  }

  return (
    <AppLayout>
      <main className="h-[calc(100vh-72px)] min-h-[620px] overflow-hidden bg-[#050505] text-white">
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="flex h-[52px] items-center justify-between border-b border-white/[0.06] bg-[#070707] px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(249,115,22,.7)]" />

              <div>
                <p className="text-[8px] uppercase tracking-[0.24em] text-orange-400">
                  Laboratório
                </p>

                <h1 className="text-sm font-semibold text-neutral-200">
                  Simulação Fisiológica
                </h1>
              </div>
            </div>

            {!respirando && (
              <div className="hidden rounded-md border border-orange-500/20 bg-orange-500/[0.06] px-2 py-1 sm:block">
                <span className="text-[8px] font-medium uppercase tracking-wider text-orange-400">
                  ⚠ Apneia ·{" "}
                  {tempoApneia}s
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={
                alternarRespiracao
              }
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[9px] font-semibold uppercase tracking-wider transition ${
                respirando
                  ? "border-orange-500/25 bg-orange-500/[0.08] text-orange-400 hover:bg-orange-500/[0.14]"
                  : "border-red-500/25 bg-red-500/[0.08] text-red-300 hover:bg-red-500/[0.14]"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  respirando
                    ? "bg-orange-400"
                    : "animate-pulse bg-red-400"
                }`}
              />

              {respirando
                ? "Parar de respirar"
                : "Retomar respiração"}
            </button>

            <button
              type="button"
              onClick={resetar}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[9px] text-neutral-600 transition hover:border-orange-500/20 hover:text-orange-400"
            >
              Resetar
            </button>
          </div>
        </header>

        {/* =================================================
            VITAIS
        ================================================= */}

        <section className="h-[48px] border-b border-white/[0.06] bg-[#060606]">
          <div className="grid h-full grid-cols-4 lg:grid-cols-8">
            <TopMetric
              label="pH"
              value={resultados.ph.toFixed(
                2
              )}
              warning={
                resultados.ph <
                  7.35 ||
                resultados.ph >
                  7.45
              }
            />

            <TopMetric
              label="PaCO₂"
              value={estadoEfetivo.paco2.toFixed(
                0
              )}
              unit="mmHg"
              warning={
                estadoEfetivo.paco2 <
                  35 ||
                estadoEfetivo.paco2 >
                  45
              }
            />

            <TopMetric
              label="HCO₃⁻"
              value={`${estadoEfetivo.hco3}`}
              unit="mEq/L"
              warning={
                estadoEfetivo.hco3 <
                  22 ||
                estadoEfetivo.hco3 >
                  26
              }
            />

            <TopMetric
              label="PaO₂"
              value={estadoEfetivo.pao2.toFixed(
                0
              )}
              unit="mmHg"
              warning={
                estadoEfetivo.pao2 <
                80
              }
            />

            <TopMetric
              label="SpO₂"
              value={resultados.spo2.toFixed(
                0
              )}
              unit="%"
              warning={
                resultados.spo2 <
                95
              }
            />

            <TopMetric
              label="Na⁺"
              value={`${estado.sodio}`}
              unit="mEq/L"
            />

            <TopMetric
              label="K⁺"
              value={estado.potassio.toFixed(
                1
              )}
              unit="mEq/L"
              warning={
                estado.potassio <
                  3.5 ||
                estado.potassio >
                  5
              }
            />

            <TopMetric
              label="Ânion Gap"
              value={`${resultados.anionGap}`}
              unit="mEq/L"
              warning={
                resultados.anionGap >
                12
              }
            />
          </div>
        </section>

        {/* =================================================
            ÁREA PRINCIPAL
        ================================================= */}

        <div className="grid h-[calc(100%-100px)] grid-cols-[205px_minmax(400px,1fr)_285px] gap-3 p-3">
          {/* =================================================
              CONTROLES
          ================================================= */}

          <aside className="min-h-0 overflow-hidden rounded-xl border border-white/[0.06] bg-[#090909] p-3">
            <div className="mb-3">
              <p className="text-[7px] uppercase tracking-[0.22em] text-neutral-700">
                Variáveis
              </p>

              <h2 className="mt-0.5 text-xs font-semibold text-neutral-300">
                Controle fisiológico
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <Tab
                active={
                  categoria ===
                  "gasometria"
                }
                onClick={() =>
                  setCategoria(
                    "gasometria"
                  )
                }
              >
                Gasometria
              </Tab>

              <Tab
                active={
                  categoria ===
                  "respiratorio"
                }
                onClick={() =>
                  setCategoria(
                    "respiratorio"
                  )
                }
              >
                Respiratório
              </Tab>

              <Tab
                active={
                  categoria ===
                  "cardio"
                }
                onClick={() =>
                  setCategoria(
                    "cardio"
                  )
                }
              >
                Cardio
              </Tab>

              <Tab
                active={
                  categoria ===
                  "renal"
                }
                onClick={() =>
                  setCategoria(
                    "renal"
                  )
                }
              >
                Renal
              </Tab>

              <Tab
                active={
                  categoria ===
                  "eletrólitos"
                }
                onClick={() =>
                  setCategoria(
                    "eletrólitos"
                  )
                }
              >
                Eletrólitos
              </Tab>
            </div>

            <div className="my-3 h-px bg-white/[0.05]" />

            {categoria ===
              "gasometria" && (
              <div className="space-y-4">
                <Slider
                  label="PaCO₂"
                  value={
                    estado.paco2
                  }
                  min={10}
                  max={100}
                  unit="mmHg"
                  onChange={(v) =>
                    alterar(
                      "paco2",
                      v
                    )
                  }
                />

                <Slider
                  label="HCO₃⁻"
                  value={
                    estado.hco3
                  }
                  min={5}
                  max={50}
                  unit="mEq/L"
                  onChange={(v) =>
                    alterar(
                      "hco3",
                      v
                    )
                  }
                />

                <Slider
                  label="PaO₂"
                  value={
                    estado.pao2
                  }
                  min={30}
                  max={500}
                  unit="mmHg"
                  onChange={(v) =>
                    alterar(
                      "pao2",
                      v
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
                  unit="%"
                  onChange={(v) =>
                    alterar(
                      "fio2",
                      v
                    )
                  }
                />
              </div>
            )}

            {categoria ===
              "respiratorio" && (
              <div className="space-y-4">
                <Slider
                  label="Frequência respiratória"
                  value={
                    estado.fr
                  }
                  min={4}
                  max={60}
                  unit="irpm"
                  onChange={(v) =>
                    alterar(
                      "fr",
                      v
                    )
                  }
                />

                <Slider
                  label="Volume corrente"
                  value={
                    estado.volumeCorrente
                  }
                  min={100}
                  max={1500}
                  step={10}
                  unit="mL"
                  onChange={(v) =>
                    alterar(
                      "volumeCorrente",
                      v
                    )
                  }
                />

                <Slider
                  label="Metabolismo"
                  value={
                    estado.metabolismo
                  }
                  min={25}
                  max={250}
                  unit="%"
                  onChange={(v) =>
                    alterar(
                      "metabolismo",
                      v
                    )
                  }
                />
              </div>
            )}

            {categoria ===
              "cardio" && (
              <div className="space-y-4">
                <Slider
                  label="Frequência cardíaca"
                  value={
                    estado.fc
                  }
                  min={30}
                  max={220}
                  unit="bpm"
                  onChange={(v) =>
                    alterar(
                      "fc",
                      v
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
                  unit="%"
                  onChange={(v) =>
                    alterar(
                      "vasoconstricao",
                      v
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
                  unit="%"
                  onChange={(v) =>
                    alterar(
                      "vasodilatacao",
                      v
                    )
                  }
                />
              </div>
            )}

            {categoria ===
              "renal" && (
              <div className="space-y-4">
                <Slider
                  label="Hidratação"
                  value={
                    estado.hidratacao
                  }
                  min={40}
                  max={160}
                  unit="%"
                  onChange={(v) =>
                    alterar(
                      "hidratacao",
                      v
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
                  unit="%"
                  onChange={(v) =>
                    alterar(
                      "adh",
                      v
                    )
                  }
                />

                <Slider
                  label="Creatinina"
                  value={
                    estado.creatinina
                  }
                  min={0.2}
                  max={10}
                  step={0.1}
                  unit="mg/dL"
                  onChange={(v) =>
                    alterar(
                      "creatinina",
                      v
                    )
                  }
                />
              </div>
            )}

            {categoria ===
              "eletrólitos" && (
              <div className="space-y-4">
                <Slider
                  label="Sódio"
                  value={
                    estado.sodio
                  }
                  min={110}
                  max={180}
                  unit="mEq/L"
                  onChange={(v) =>
                    alterar(
                      "sodio",
                      v
                    )
                  }
                />

                <Slider
                  label="Cloro"
                  value={
                    estado.cloro
                  }
                  min={70}
                  max={150}
                  unit="mEq/L"
                  onChange={(v) =>
                    alterar(
                      "cloro",
                      v
                    )
                  }
                />

                <Slider
                  label="Potássio"
                  value={
                    estado.potassio
                  }
                  min={1}
                  max={8}
                  step={0.1}
                  unit="mEq/L"
                  onChange={(v) =>
                    alterar(
                      "potassio",
                      v
                    )
                  }
                />
              </div>
            )}
          </aside>

          {/* =================================================
              CENTRO — ECG + CORPO
          ================================================= */}

<section className="grid min-h-0 grid-rows-[405px_minmax(0,1fr)] gap-3">
            {/* PAINEL CENTRAL */}

            <div className="relative min-h-0 overflow-hidden rounded-xl border border-white/[0.06] bg-[#080808]">
  <div className="absolute left-3 top-2 z-30">
    <p className="text-[6px] uppercase tracking-[0.22em] text-neutral-700">
      Organismo
    </p>

    <p className="text-[9px] font-semibold text-neutral-400">
      Estado fisiológico
    </p>
  </div>

  <div className="flex h-full items-center justify-center">
    <HumanBody
      respirando={respirando}
      ph={resultados.ph}
      spo2={resultados.spo2}
      fc={estado.fc}
    />
  </div>

  <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
    <MiniIndicator
      label="FC"
      value={`${estado.fc}`}
    />

    <MiniIndicator
      label="FR"
      value={`${estadoEfetivo.fr}`}
      warning={!respirando}
    />

    <MiniIndicator
      label="SpO₂"
      value={`${resultados.spo2.toFixed(0)}%`}
      warning={resultados.spo2 < 95}
    />
  </div>
</div>

            {/* ECG */}

            <ECGMonitor
              fc={estado.fc}
              parado={!respirando}
            />
          </section>

          {/* =================================================
              RESULTADOS
          ================================================= */}

          <aside className="grid min-h-0 grid-rows-3 gap-2 overflow-hidden">
            <Panel title="Gasometria">
              <Result
                label="pH"
                value={resultados.ph.toFixed(
                  2
                )}
                reference="7.35–7.45"
                warning={
                  resultados.ph <
                    7.35 ||
                  resultados.ph >
                    7.45
                }
              />

              <Result
                label="PaO₂"
                value={`${estadoEfetivo.pao2.toFixed(
                  0
                )} mmHg`}
                reference="80–100"
                warning={
                  estadoEfetivo.pao2 <
                  80
                }
              />

              <Result
                label="PaCO₂"
                value={`${estadoEfetivo.paco2.toFixed(
                  0
                )} mmHg`}
                reference="35–45"
                warning={
                  estadoEfetivo.paco2 >
                    45 ||
                  estadoEfetivo.paco2 <
                    35
                }
              />

              <Result
                label="HCO₃⁻"
                value={`${estadoEfetivo.hco3} mEq/L`}
                reference="22–26"
                warning={
                  estadoEfetivo.hco3 <
                    22 ||
                  estadoEfetivo.hco3 >
                    26
                }
              />

              <Result
                label="SpO₂"
                value={`${resultados.spo2.toFixed(
                  0
                )}%`}
                reference="≥95%"
                warning={
                  resultados.spo2 <
                  95
                }
              />
            </Panel>

            <Panel title="Interpretação">
              <div
                className={`mb-2 rounded-md border p-2 ${
                  respirando
                    ? "border-orange-500/10 bg-orange-500/[0.025]"
                    : "border-red-500/20 bg-red-500/[0.04]"
                }`}
              >
                <p className="text-[7px] uppercase tracking-widest text-neutral-700">
                  Estado
                </p>

                <p
                  className={`mt-0.5 text-[11px] font-medium ${
                    respirando
                      ? "text-neutral-300"
                      : "text-orange-400"
                  }`}
                >
                  {respirando
                    ? resultados.disturbo
                    : `Apneia · ${tempoApneia}s`}
                </p>
              </div>

              <Result
                label="Ânion gap"
                value={`${resultados.anionGap}`}
                reference="8–12"
                warning={
                  resultados.anionGap >
                  12
                }
              />

              <Result
                label="Winter"
                value={`${resultados.winter.toFixed(
                  1
                )}`}
                reference={`${resultados.winterMin.toFixed(
                  1
                )}–${resultados.winterMax.toFixed(
                  1
                )}`}
              />

              <Result
                label="Ventilação"
                value={`${resultados.ventilacaoAlveolar.toFixed(
                  1
                )} L/min`}
                reference=""
                warning={
                  !respirando
                }
              />
            </Panel>

            <Panel title="Hemodinâmica">
              <Result
                label="FC"
                value={`${estado.fc} bpm`}
                reference=""
              />

              <Result
                label="PA"
                value={`${resultados.pas.toFixed(
                  0
                )}/${resultados.pad.toFixed(
                  0
                )}`}
                reference="mmHg"
              />

              <Result
                label="PAM"
                value={`${resultados.pam.toFixed(
                  0
                )} mmHg`}
                reference=""
              />

              <Result
                label="Na⁺"
                value={`${estado.sodio}`}
                reference="mEq/L"
              />

              <Result
                label="K⁺"
                value={`${estado.potassio.toFixed(
                  1
                )}`}
                reference="mEq/L"
                warning={
                  estado.potassio <
                    3.5 ||
                  estado.potassio >
                    5
                }
              />
            </Panel>
          </aside>
        </div>
      </main>
    </AppLayout>
  );
}

/* =========================================================
   COMPONENTES VISUAIS
========================================================= */

function TopMetric({
  label,
  value,
  unit,
  warning = false,
}: {
  label: string;
  value: string;
  unit?: string;
  warning?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center border-r border-white/[0.05] px-3">
      <div className="min-w-0">
        <p className="text-[7px] uppercase tracking-widest text-neutral-700">
          {label}
        </p>

        <p
          className={`mt-0.5 truncate font-mono text-[11px] font-semibold ${
            warning
              ? "text-orange-400"
              : "text-neutral-300"
          }`}
        >
          {value}

          {unit && (
            <span className="ml-1 text-[7px] font-normal text-neutral-700">
              {unit}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-1.5 py-1.5 text-[8px] transition ${
        active
          ? "border-orange-500/25 bg-orange-500/[0.08] text-orange-400"
          : "border-white/[0.05] bg-white/[0.015] text-neutral-600 hover:text-neutral-300"
      }`}
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
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (
    value: number
  ) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <label className="text-[9px] text-neutral-500">
          {label}
        </label>

        <span className="font-mono text-[8px] text-orange-400">
          {value} {unit}
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
            Number(
              event.target.value
            )
          )
        }
        className="h-1 w-full cursor-pointer accent-orange-500"
      />

      <div className="mt-0.5 flex justify-between text-[6px] text-neutral-800">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="min-h-0 overflow-hidden rounded-xl border border-white/[0.06] bg-[#090909] p-3">
      <div className="mb-1.5 flex items-center justify-between">
        <h3 className="text-[10px] font-semibold text-neutral-300">
          {title}
        </h3>

        <span className="h-1 w-1 rounded-full bg-orange-400/50" />
      </div>

      {children}
    </section>
  );
}

function Result({
  label,
  value,
  reference,
  warning = false,
}: {
  label: string;
  value: string;
  reference: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.035] py-1.5 last:border-0">
      <div className="min-w-0">
        <p className="text-[9px] text-neutral-500">
          {label}
        </p>

        {reference && (
          <p className="text-[6px] text-neutral-800">
            Ref: {reference}
          </p>
        )}
      </div>

      <span
        className={`font-mono text-[9px] ${
          warning
            ? "text-orange-400"
            : "text-neutral-300"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function ECGStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-r border-white/[0.05] py-1 text-center last:border-0">
      <p className="text-[6px] uppercase tracking-widest text-neutral-800">
        {label}
      </p>

      <p className="font-mono text-[8px] text-neutral-500">
        {value}
      </p>
    </div>
  );
}

function MiniIndicator({
  label,
  value,
  warning = false,
}: {
  label: string;
  value: string;
  warning?: boolean;
}) {
  return (
    <div className="rounded-md border border-white/[0.06] bg-[#090909]/95 px-2 py-1">
      <span className="text-[6px] uppercase tracking-wider text-neutral-700">
        {label}
      </span>

      <span
        className={`ml-1.5 font-mono text-[8px] ${
          warning
            ? "text-orange-400"
            : "text-neutral-400"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function StatusBadge({
  label,
  value,
  warning = false,
}: {
  label: string;
  value: string;
  warning?: boolean;
}) {
  return (
    <div className="rounded-md border border-white/[0.06] bg-[#090909] px-2 py-1">
      <p className="text-[6px] uppercase tracking-widest text-neutral-700">
        {label}
      </p>

      <p
        className={`mt-0.5 font-mono text-[8px] ${
          warning
            ? "text-orange-400"
            : "text-neutral-400"
        }`}
      >
        {value}
      </p>
    </div>
  );
}