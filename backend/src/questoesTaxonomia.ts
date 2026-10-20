import { prisma } from "../../lib/prisma";
import { FONTE_PROVAS_REAIS } from "./questoesOficiaisFGV2025";

/**
 * Um nome canônico por assunto, inclusive entre disciplinas. Preserva a
 * disciplina de origem das questões; nunca apaga respostas ou alternativas.
 */
const limpar = (s: string) => String(s || "").normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const disciplinasAntigas = new Set([
  "enfermagem concursos", "enfermagem concursos publicos",
  "enfermagem residencias federais", "enfermagem residencia federal",
]);

export function disciplinaCanonica(nome: string): string {
  return disciplinasAntigas.has(limpar(nome)) ? "Enfermagem" : String(nome || "").trim();
}

/** Equivalências estritas: o mesmo conteúdo não deve aparecer como dois assuntos. */
const aliasesGerais: Record<string, string> = {
  "atencao primaria": "Atenção Primária à Saúde",
  "atencao primaria a saude": "Atenção Primária à Saúde",
  "atencao primaria e pnab": "Atenção Primária à Saúde",
  "atencao primaria a saude e pnab": "Atenção Primária à Saúde",
  "atencao basica": "Atenção Primária à Saúde",
  "atencao basica e pnab": "Atenção Primária à Saúde",
  "politica nacional de atencao basica": "Atenção Primária à Saúde",
  "processo de enfermagem": "Processo de Enfermagem e SAE",
  "processo de enfermagem e sae": "Processo de Enfermagem e SAE",
  "sistematizacao da assistencia de enfermagem": "Processo de Enfermagem e SAE",
  "urgencias e emergencias": "Urgência e Emergência",
  "urgencia emergencia": "Urgência e Emergência",
  "urgencia e emergencia": "Urgência e Emergência",
  "saude da crianca": "Saúde da Criança e do Adolescente",
  "saude da crianca e adolescente": "Saúde da Criança e do Adolescente",
  "saude da crianca e do adolescente": "Saúde da Criança e do Adolescente",
  "controle de infeccao": "Controle de Infecção e Biossegurança",
  "controle de infeccao e biosseguranca": "Controle de Infecção e Biossegurança",
  "centro de material e esterilizacao": "Centro de Material e Esterilização (CME)",
  "centro de material e esterilizacao cme": "Centro de Material e Esterilização (CME)",
  "cme": "Centro de Material e Esterilização (CME)",
};

const aliasesEnfermagem: Record<string,string> = {
  "sae": "Processo de Enfermagem e SAE",
  "biosseguranca": "Controle de Infecção e Biossegurança",
};

function centroCirurgicoComCme(nome: string): boolean {
  return nome === "centro cirurgico e cme" ||
    nome === "centro cirurgico e central de material e esterilizacao";
}

export function assuntoCanonico(disciplina: string, assunto: string, enunciado = ""): string {
  const nome = limpar(assunto);
  if (!nome) return "";
  if (limpar(disciplinaCanonica(disciplina)) === "enfermagem" && centroCirurgicoComCme(nome)) {
    // Estes são dois conteúdos diferentes: não fundir questões cirúrgicas com esterilização.
    return /\b(cme|esterilizacao|esterilizante|reprocessamento|autoclave|expurgo)\b/.test(limpar(enunciado))
      ? "Centro de Material e Esterilização (CME)" : "Centro Cirúrgico";
  }
  return aliasesGerais[nome] ||
    (limpar(disciplinaCanonica(disciplina)) === "enfermagem" ? aliasesEnfermagem[nome] : undefined) ||
    String(assunto || "").trim();
}

export function assuntosInventarioCanonicos(disciplina: string, assunto: string): string[] {
  if (limpar(disciplinaCanonica(disciplina)) === "enfermagem" &&
      centroCirurgicoComCme(limpar(assunto))) {
    return ["Centro Cirúrgico", "Centro de Material e Esterilização (CME)"];
  }
  return [assuntoCanonico(disciplina, assunto)];
}

/**
 * Atualização idempotente, em grupos, dos temas de provas verificadas.
 * Preserva ID, gabarito, alternativas, respostas e histórico de resolução.
 */
export async function sincronizarTaxonomiaQuestoes() {
  const disciplinas = await prisma.disciplina.findMany({
    select: { id: true, nome: true, usuarioId: true },
  });
  let realocadas = 0;
  for (const antiga of [...disciplinas]) {
    if (disciplinaCanonica(antiga.nome) === antiga.nome.trim()) continue;
    let atual = disciplinas.find(d => d.usuarioId === antiga.usuarioId && limpar(d.nome) === "enfermagem");
    if (!atual) {
      atual = await prisma.disciplina.create({
        data: { usuarioId: antiga.usuarioId, nome: "Enfermagem" },
        select: { id: true, nome: true, usuarioId: true },
      });
      disciplinas.push(atual);
    }
    realocadas += (await prisma.questao.updateMany({
      where: { fonte: FONTE_PROVAS_REAIS, disciplinaId: antiga.id },
      data: { disciplinaId: atual.id },
    })).count;
  }

  const disciplinasPorId = new Map(disciplinas.map(d => [d.id, d.nome]));
  const grupos = await prisma.questao.groupBy({
    by: ["disciplinaId", "tema"],
    where: { fonte: FONTE_PROVAS_REAIS, tema: { not: null } },
    _count: { _all: true },
  });
  let normalizadas = 0;
  for (const g of grupos) {
    if (!g.tema?.trim()) continue;
    const disciplina = disciplinasPorId.get(g.disciplinaId) || "";
    const original = g.tema;
    const generico = limpar(disciplinaCanonica(disciplina)) === "enfermagem" &&
      centroCirurgicoComCme(limpar(original));

    if (generico) {
      const questoes = await prisma.questao.findMany({
        where: { fonte: FONTE_PROVAS_REAIS, disciplinaId: g.disciplinaId, tema: original },
        select: { id: true, enunciado: true },
      });
      for (const q of questoes) {
        const novo = assuntoCanonico(disciplina, original, q.enunciado);
        await prisma.questao.update({ where: { id: q.id }, data: { tema: novo } });
        normalizadas++;
      }
      continue;
    }
    const destino = assuntoCanonico(disciplina, original);
    if (destino === original) continue;
    normalizadas += (await prisma.questao.updateMany({
      where: { fonte: FONTE_PROVAS_REAIS, disciplinaId: g.disciplinaId, tema: original },
      data: { tema: destino },
    })).count;
  }
  console.log("[questoes-taxonomia] " + realocadas + " questões realocadas, " +
    normalizadas + " temas canonizados, questões/respostas preservadas.");
  return { realocadas, assuntos: normalizadas };
}
