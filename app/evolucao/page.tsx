"use client";

import { useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";

type Nivel = "Básico" | "Intermediário" | "Avançado";

type Setor =
  | "Clínica Médica"
  | "UTI"
  | "Emergência"
  | "Pediatria"
  | "Obstetrícia";

type TipoSituacao =
  | "Admissão"
  | "Acompanhamento"
  | "Pós-procedimento"
  | "Intercorrência";

type Criterio = {
  id: string;
  nome: string;
  palavras: string[];
  pontos: number;
};

type CasoClinico = {
  id: number;
  titulo: string;
  nivel: Nivel;
  setor: Setor;
  tipo: TipoSituacao;
  paciente: string;
  caso: string;
  criterios: Criterio[];
  modelo: string;
};

const casos: CasoClinico[] = [
  {
    id: 1,
    titulo: "Paciente com quadro respiratório",
    nivel: "Básico",
    setor: "Clínica Médica",
    tipo: "Acompanhamento",
    paciente: "Paciente masculino, 67 anos",
    caso:
      "Paciente masculino, 67 anos, internado em clínica médica por pneumonia. Encontra-se consciente, orientado e comunicativo, em decúbito elevado. Apresenta FR 24 irpm, SpO₂ 92% em ar ambiente, FC 98 bpm e PA 128/76 mmHg. Refere dispneia aos esforços e tosse produtiva. Acesso venoso periférico em membro superior direito, pérvio, sem sinais flogísticos.",
    criterios: [
      {
        id: "estado",
        nome: "Estado geral e nível de consciência",
        palavras: ["consciente", "orientado", "comunicativo"],
        pontos: 15,
      },
      {
        id: "respiratorio",
        nome: "Avaliação respiratória",
        palavras: ["dispneia", "tosse", "respirat", "fr"],
        pontos: 20,
      },
      {
        id: "sinais",
        nome: "Sinais vitais",
        palavras: ["spo2", "saturação", "fc", "pa", "pressão", "irpm"],
        pontos: 20,
      },
      {
        id: "acesso",
        nome: "Avaliação do acesso venoso",
        palavras: ["acesso venoso", "avp", "pérvio", "flogístico"],
        pontos: 15,
      },
      {
        id: "conduta",
        nome: "Cuidados e condutas",
        palavras: [
          "monitorização",
          "monitorar",
          "manter",
          "cuidados",
          "oxigen",
          "elevar",
        ],
        pontos: 15,
      },
      {
        id: "objetividade",
        nome: "Registro objetivo",
        palavras: ["paciente", "apresenta", "refere"],
        pontos: 15,
      },
    ],
    modelo:
      "28/09/2026 – 12h. Paciente masculino, 67 anos, consciente, orientado e comunicativo, em decúbito elevado. Apresenta dispneia aos esforços, FR 24 irpm, SpO₂ 92% em ar ambiente, FC 98 bpm e PA 128/76 mmHg. Refere tosse produtiva. AVP em membro superior direito, pérvio, sem sinais flogísticos. Mantida monitorização dos sinais vitais e cuidados de enfermagem conforme prescrição.",
  },

  {
    id: 2,
    titulo: "Pós-operatório imediato",
    nivel: "Intermediário",
    setor: "Clínica Médica",
    tipo: "Pós-procedimento",
    paciente: "Paciente feminina, 45 anos",
    caso:
      "Paciente feminina, 45 anos, em pós-operatório imediato de colecistectomia. Encontra-se consciente, orientada, sonolenta, porém responsiva aos comandos. PA 118/72 mmHg, FC 88 bpm, FR 18 irpm e SpO₂ 96% em ar ambiente. Refere dor abdominal de intensidade 5/10. Curativo abdominal limpo e seco, sem presença de sangramento aparente. Mantém acesso venoso periférico em membro superior esquerdo.",
    criterios: [
      {
        id: "consciencia",
        nome: "Consciência e estado geral",
        palavras: ["consciente", "orientada", "sonolenta", "responsiva"],
        pontos: 15,
      },
      {
        id: "sinais",
        nome: "Sinais vitais",
        palavras: ["pa", "fc", "fr", "spo2", "saturação"],
        pontos: 20,
      },
      {
        id: "dor",
        nome: "Avaliação da dor",
        palavras: ["dor", "5/10", "escala", "intensidade"],
        pontos: 15,
      },
      {
        id: "curativo",
        nome: "Avaliação do curativo",
        palavras: ["curativo", "limpo", "seco", "sangramento"],
        pontos: 20,
      },
      {
        id: "acesso",
        nome: "Avaliação do acesso venoso",
        palavras: ["acesso venoso", "avp"],
        pontos: 10,
      },
      {
        id: "conduta",
        nome: "Condutas e cuidados",
        palavras: ["monitorização", "monitorar", "cuidados", "mantido"],
        pontos: 20,
      },
    ],
    modelo:
      "28/09/2026 – 12h. Paciente feminina, 45 anos, em pós-operatório imediato de colecistectomia, consciente, orientada, sonolenta e responsiva aos comandos. PA 118/72 mmHg, FC 88 bpm, FR 18 irpm e SpO₂ 96% em ar ambiente. Refere dor abdominal 5/10. Curativo abdominal limpo e seco, sem sangramento aparente. AVP em membro superior esquerdo. Mantida monitorização e cuidados de enfermagem.",
  },

  {
    id: 3,
    titulo: "Paciente crítico em UTI",
    nivel: "Avançado",
    setor: "UTI",
    tipo: "Acompanhamento",
    paciente: "Paciente masculino, 72 anos",
    caso:
      "Paciente masculino, 72 anos, internado em UTI por insuficiência respiratória. Encontra-se sedado, em ventilação mecânica invasiva por tubo orotraqueal. Monitorização contínua. FC 104 bpm, PA 102/64 mmHg, FR controlada pelo ventilador e SpO₂ 95%. Apresenta acesso venoso central em jugular direita, sem hiperemia ou secreção no sítio de inserção. Diurese presente por cateter vesical de demora.",
    criterios: [
      {
        id: "neurologico",
        nome: "Estado neurológico",
        palavras: ["sedado", "consciência", "neurológico"],
        pontos: 15,
      },
      {
        id: "ventilacao",
        nome: "Ventilação mecânica",
        palavras: ["ventilação mecânica", "ventilador", "tubo", "tot"],
        pontos: 20,
      },
      {
        id: "sinais",
        nome: "Monitorização e sinais vitais",
        palavras: ["fc", "pa", "spo2", "monitorização"],
        pontos: 15,
      },
      {
        id: "cateter",
        nome: "Acesso venoso central",
        palavras: ["acesso venoso central", "cvc", "jugular", "hiperemia"],
        pontos: 15,
      },
      {
        id: "diurese",
        nome: "Controle urinário",
        palavras: ["diurese", "cateter vesical", "sonda vesical"],
        pontos: 15,
      },
      {
        id: "conduta",
        nome: "Cuidados de enfermagem",
        palavras: ["monitorização", "cuidados", "manter", "avaliar"],
        pontos: 20,
      },
    ],
    modelo:
      "28/09/2026 – 12h. Paciente masculino, 72 anos, internado em UTI por insuficiência respiratória, sedado, em ventilação mecânica invasiva por tubo orotraqueal. Em monitorização contínua, FC 104 bpm, PA 102/64 mmHg e SpO₂ 95%. CVC em jugular direita, sem hiperemia ou secreção no sítio de inserção. Diurese presente por cateter vesical de demora. Mantidos cuidados de enfermagem, monitorização contínua e avaliação dos dispositivos.",
  },

  {
    id: 4,
    titulo: "Intercorrência: hipotensão",
    nivel: "Avançado",
    setor: "Emergência",
    tipo: "Intercorrência",
    paciente: "Paciente feminina, 59 anos",
    caso:
      "Paciente feminina, 59 anos, em observação na emergência, apresenta tontura e fraqueza súbitas. Encontra-se consciente e orientada. PA 86/54 mmHg, FC 112 bpm, FR 20 irpm e SpO₂ 97% em ar ambiente. Pele fria e pálida. Acesso venoso periférico em membro superior direito, pérvio. Equipe médica comunicada sobre alteração dos sinais vitais.",
    criterios: [
      {
        id: "queixa",
        nome: "Queixa principal",
        palavras: ["tontura", "fraqueza"],
        pontos: 15,
      },
      {
        id: "sinais",
        nome: "Sinais vitais alterados",
        palavras: ["pa", "86/54", "fc", "112", "fr", "spo2"],
        pontos: 20,
      },
      {
        id: "avaliacao",
        nome: "Avaliação clínica",
        palavras: ["consciente", "orientada", "pálida", "fria"],
        pontos: 15,
      },
      {
        id: "acesso",
        nome: "Acesso venoso",
        palavras: ["acesso venoso", "pérvio", "avp"],
        pontos: 10,
      },
      {
        id: "conduta",
        nome: "Conduta diante da intercorrência",
        palavras: ["comunicada", "comunicado", "equipe", "médica", "monitorização"],
        pontos: 25,
      },
      {
        id: "registro",
        nome: "Registro objetivo da intercorrência",
        palavras: ["alteração", "sinais vitais", "intercorrência"],
        pontos: 15,
      },
    ],
    modelo:
      "28/09/2026 – 12h. Paciente feminina, 59 anos, consciente e orientada, apresenta tontura e fraqueza súbitas. PA 86/54 mmHg, FC 112 bpm, FR 20 irpm e SpO₂ 97% em ar ambiente. Pele fria e pálida. AVP em membro superior direito, pérvio. Equipe médica comunicada acerca da alteração dos sinais vitais. Mantida monitorização e assistência de enfermagem.",
  },
];

const niveis: Nivel[] = ["Básico", "Intermediário", "Avançado"];

const setores: Setor[] = [
  "Clínica Médica",
  "UTI",
  "Emergência",
  "Pediatria",
  "Obstetrícia",
];

const tipos: TipoSituacao[] = [
  "Admissão",
  "Acompanhamento",
  "Pós-procedimento",
  "Intercorrência",
];

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function EvolucaoPage() {
  const [nivel, setNivel] = useState<Nivel>("Básico");
  const [setor, setSetor] = useState<Setor>("Clínica Médica");
  const [tipo, setTipo] = useState<TipoSituacao>("Acompanhamento");

  const [casoAtualId, setCasoAtualId] = useState(1);
  const [resposta, setResposta] = useState("");
  const [corrigido, setCorrigido] = useState(false);

  const casoAtual = useMemo(() => {
    return (
      casos.find(function (caso) {
        return caso.id === casoAtualId;
      }) || casos[0]
    );
  }, [casoAtualId]);

  const criteriosEncontrados = useMemo(() => {
    const texto = normalizar(resposta);

    return casoAtual.criterios.map(function (criterio) {
      const encontrado = criterio.palavras.some(function (palavra) {
        return texto.includes(normalizar(palavra));
      });

      return {
        ...criterio,
        encontrado,
      };
    });
  }, [resposta, casoAtual]);

  const pontos = corrigido
    ? criteriosEncontrados.reduce(function (total, criterio) {
        return total + (criterio.encontrado ? criterio.pontos : 0);
      }, 0)
    : 0;

  const criteriosOk = criteriosEncontrados.filter(function (criterio) {
    return criterio.encontrado;
  }).length;

  const criteriosFaltantes = criteriosEncontrados.filter(function (criterio) {
    return !criterio.encontrado;
  });

  function selecionarCaso() {
    const filtrados = casos.filter(function (caso) {
      return (
        caso.nivel === nivel &&
        caso.setor === setor &&
        caso.tipo === tipo
      );
    });

    const lista = filtrados.length > 0 ? filtrados : casos;

    const outro = lista.find(function (caso) {
      return caso.id !== casoAtualId;
    });

    const escolhido = outro || lista[0];

    setCasoAtualId(escolhido.id);
    setResposta("");
    setCorrigido(false);
  }

  function corrigir() {
    if (!resposta.trim()) {
      return;
    }

    setCorrigido(true);
  }

  function novoCaso() {
    const candidatos = casos.filter(function (caso) {
      return caso.id !== casoAtualId;
    });

    const escolhido =
      candidatos[Math.floor(Math.random() * candidatos.length)];

    setCasoAtualId(escolhido.id);
    setResposta("");
    setCorrigido(false);

    setNivel(escolhido.nivel);
    setSetor(escolhido.setor);
    setTipo(escolhido.tipo);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <AppLayout>
      <main className="min-h-screen bg-[#050505] text-white">
        {/* HEADER */}
        <section className="border-b border-white/[0.06] bg-[#070707]">
          <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Treinamento prático
                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Evolução de Enfermagem
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
                  Treine a construção de registros de enfermagem a partir de
                  casos clínicos e desenvolva objetividade, organização e
                  raciocínio clínico.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                  ✎
                </div>

                <div>
                  <p className="text-xs text-neutral-500">Modo atual</p>
                  <p className="text-sm font-semibold text-white">
                    Prática livre
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          {/* FILTROS */}
          <section className="mb-6 rounded-3xl border border-white/[0.08] bg-[#0a0a0a] p-5 shadow-2xl shadow-black/20">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Configurar treinamento
                </h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Escolha o perfil do caso que deseja praticar.
                </p>
              </div>

              <div className="hidden h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm text-orange-400 sm:flex">
                ⚙
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-medium text-neutral-400">
                  Nível
                </label>

                <select
                  value={nivel}
                  onChange={function (event) {
                    setNivel(event.target.value as Nivel);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500/50"
                >
                  {niveis.map(function (item) {
                    return (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-neutral-400">
                  Setor
                </label>

                <select
                  value={setor}
                  onChange={function (event) {
                    setSetor(event.target.value as Setor);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500/50"
                >
                  {setores.map(function (item) {
                    return (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-neutral-400">
                  Situação
                </label>

                <select
                  value={tipo}
                  onChange={function (event) {
                    setTipo(event.target.value as TipoSituacao);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500/50"
                >
                  {tipos.map(function (item) {
                    return (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={selecionarCaso}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-neutral-200 transition hover:border-orange-500/30 hover:bg-orange-500/[0.06] hover:text-white"
              >
                Aplicar configuração
              </button>

              <button
                type="button"
                onClick={novoCaso}
                className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-400"
              >
                Novo caso
              </button>
            </div>
          </section>

          {/* CASO + RESPOSTA */}
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            {/* CASO */}
            <section className="rounded-3xl border border-white/[0.08] bg-[#0a0a0a] p-6 shadow-2xl shadow-black/20">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400">
                    Caso clínico
                  </span>

                  <h2 className="mt-2 text-xl font-bold text-white">
                    {casoAtual.titulo}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-neutral-400">
                    {casoAtual.nivel}
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-neutral-400">
                    {casoAtual.setor}
                  </span>
                </div>
              </div>

              <div className="mb-5 rounded-2xl border border-orange-500/10 bg-orange-500/[0.04] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Paciente
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  {casoAtual.paciente}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-[#080808] p-5">
                <p className="text-sm leading-7 text-neutral-300">
                  {casoAtual.caso}
                </p>
              </div>

              <div className="mt-5 flex gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                  !
                </div>

                <div>
                  <p className="text-sm font-semibold text-neutral-200">
                    Sua tarefa
                  </p>

                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Analise os dados apresentados e escreva uma evolução de
                    enfermagem objetiva, organizada e baseada nos achados do
                    caso.
                  </p>
                </div>
              </div>
            </section>

            {/* RESPOSTA */}
            <section className="rounded-3xl border border-white/[0.08] bg-[#0a0a0a] p-6 shadow-2xl shadow-black/20">
              <div className="mb-5">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400">
                  Sua resposta
                </span>

                <h2 className="mt-2 text-xl font-bold text-white">
                  Escreva a evolução
                </h2>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  Escreva como se estivesse realizando o registro no prontuário.
                </p>
              </div>

              <textarea
                value={resposta}
                onChange={function (event) {
                  setResposta(event.target.value);
                  setCorrigido(false);
                }}
                placeholder="Ex.: Paciente consciente, orientado, comunicativo..."
                className="min-h-[360px] w-full resize-y rounded-2xl border border-white/10 bg-[#080808] p-5 text-sm leading-7 text-white outline-none placeholder:text-neutral-700 transition focus:border-orange-500/40"
              />

              <div className="mt-3 flex items-center justify-between text-xs text-neutral-600">
                <span>{resposta.length} caracteres</span>

                <span>
                  {resposta.trim()
                    ? "Resposta preenchida"
                    : "Comece a escrever"}
                </span>
              </div>

              <button
                type="button"
                onClick={corrigir}
                disabled={!resposta.trim()}
                className="mt-5 w-full rounded-2xl bg-orange-500 px-5 py-4 text-sm font-bold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Corrigir minha evolução
              </button>
            </section>
          </div>

          {/* RESULTADO */}
          {corrigido && (
            <section className="mt-6 rounded-3xl border border-white/[0.08] bg-[#0a0a0a] p-6 shadow-2xl shadow-black/20">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400">
                    Resultado
                  </span>

                  <h2 className="mt-2 text-2xl font-bold text-white">
                    Avaliação da sua evolução
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    A correção abaixo verifica se os principais elementos do
                    caso foram contemplados.
                  </p>
                </div>

                <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-3xl border border-orange-500/20 bg-orange-500/[0.06]">
                  <span className="text-3xl font-black text-orange-400">
                    {pontos}
                  </span>

                  <span className="text-[10px] uppercase tracking-wider text-neutral-500">
                    pontos
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.04] p-4">
                  <p className="text-xs text-neutral-500">Critérios encontrados</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-400">
                    {criteriosOk}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-500/10 bg-amber-500/[0.04] p-4">
                  <p className="text-xs text-neutral-500">Critérios faltantes</p>
                  <p className="mt-1 text-2xl font-bold text-amber-400">
                    {criteriosFaltantes.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <p className="text-xs text-neutral-500">Total analisado</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {casoAtual.criterios.length}
                  </p>
                </div>
              </div>

              {/* CRITÉRIOS */}
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-semibold text-white">
                  Análise por critério
                </h3>

                <div className="space-y-2">
                  {criteriosEncontrados.map(function (criterio) {
                    return (
                      <div
                        key={criterio.id}
                        className={
                          "flex items-center justify-between gap-4 rounded-2xl border p-4 " +
                          (criterio.encontrado
                            ? "border-emerald-500/10 bg-emerald-500/[0.03]"
                            : "border-amber-500/10 bg-amber-500/[0.03]")
                        }
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold " +
                              (criterio.encontrado
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-amber-500/10 text-amber-400")
                            }
                          >
                            {criterio.encontrado ? "✓" : "!"}
                          </div>

                          <span className="text-sm text-neutral-300">
                            {criterio.nome}
                          </span>
                        </div>

                        <span className="shrink-0 text-xs font-semibold text-neutral-500">
                          {criterio.encontrado ? "+" + criterio.pontos : "0"} pts
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FALTANTES */}
              {criteriosFaltantes.length > 0 && (
                <div className="mt-6 rounded-2xl border border-amber-500/10 bg-amber-500/[0.03] p-5">
                  <h3 className="text-sm font-semibold text-amber-400">
                    O que você pode melhorar
                  </h3>

                  <ul className="mt-3 space-y-2">
                    {criteriosFaltantes.map(function (criterio) {
                      return (
                        <li
                          key={criterio.id}
                          className="flex gap-2 text-xs leading-5 text-neutral-400"
                        >
                          <span className="text-amber-400">•</span>
                          <span>{criterio.nome}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* MODELO */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07]">
                <div className="border-b border-white/[0.07] bg-white/[0.02] px-5 py-4">
                  <h3 className="text-sm font-semibold text-white">
                    Modelo de referência
                  </h3>

                  <p className="mt-1 text-xs text-neutral-600">
                    Use como comparação, não como texto para decorar.
                  </p>
                </div>

                <div className="bg-[#080808] p-5">
                  <p className="text-sm leading-7 text-neutral-300">
                    {casoAtual.modelo}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={function () {
                    setResposta("");
                    setCorrigido(false);
                  }}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-neutral-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  Refazer
                </button>

                <button
                  type="button"
                  onClick={novoCaso}
                  className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-400"
                >
                  Próximo caso
                </button>
              </div>
            </section>
          )}

          {/* RODAPÉ EDUCATIVO */}
          <section className="mt-6 rounded-3xl border border-white/[0.06] bg-[#080808] p-5">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                i
              </div>

              <div>
                <h3 className="text-sm font-semibold text-neutral-200">
                  Dica de treinamento
                </h3>

                <p className="mt-1 text-xs leading-6 text-neutral-500">
                  Uma boa evolução deve ser objetiva, clara, cronológica e
                  baseada em dados observados ou relatados. Evite julgamentos
                  vagos e priorize informações relevantes para o cuidado.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </AppLayout>
  );
}