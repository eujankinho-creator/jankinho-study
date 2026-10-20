import { prisma } from "../../lib/prisma";
import { FONTE_PROVAS_REAIS } from "./questoesOficiaisFGV2025";

/** Taxonomia única para cursos, concursos e residências. */
const limpar = (s: string) => String(s || "").normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const disciplinasAntigas = new Set([
  "enfermagem concursos", "enfermagem concursos publicos",
  "enfermagem residencias federais", "enfermagem residencia federal",
]);
export function disciplinaCanonica(nome: string): string {
  return disciplinasAntigas.has(limpar(nome)) ? "Enfermagem" : String(nome || "").trim();
}
export function assuntoCanonico(disciplina: string, assunto: string, enunciado = ""): string {
  const nome = limpar(assunto);
  if (limpar(disciplinaCanonica(disciplina)) !== "enfermagem") return String(assunto || "").trim();
  const aliases: Record<string,string> = {
    "urgencias e emergencias": "Urgência e Emergência",
    "urgencia emergencia": "Urgência e Emergência",
    "atencao basica": "Atenção Primária à Saúde",
    "atencao primaria": "Atenção Primária à Saúde",
    "saude da crianca": "Saúde da Criança e do Adolescente",
    "saude da crianca e adolescente": "Saúde da Criança e do Adolescente",
    "sistematizacao da assistencia de enfermagem": "Processo de Enfermagem e SAE",
    "sae": "Processo de Enfermagem e SAE",
    "controle de infeccao": "Controle de Infecção e Biossegurança",
    "biosseguranca": "Controle de Infecção e Biossegurança",
    "centro de material e esterilizacao": "Centro de Material e Esterilização (CME)",
    "cme": "Centro de Material e Esterilização (CME)",
  };
  if (nome === "centro cirurgico e cme" ||
      nome === "centro cirurgico e central de material e esterilizacao") {
    // Uma entrada "Centro Cirúrgico e CME" não corresponde a assunto único.
    // Classifica pela questão; CME e Centro Cirúrgico permanecem separados.
    return /\b(cme|esterilizacao|esterilizante|reprocessamento|autoclave|expurgo)\b/.test(limpar(enunciado))
      ? "Centro de Material e Esterilização (CME)" : "Centro Cirúrgico";
  }
  return aliases[nome] || String(assunto || "").trim();
}
export function assuntosInventarioCanonicos(disciplina: string, assunto: string): string[] {
  const nome = limpar(assunto);
  if (limpar(disciplinaCanonica(disciplina)) === "enfermagem" &&
      (nome === "centro cirurgico e cme" ||
       nome === "centro cirurgico e central de material e esterilizacao")) {
    return ["Centro Cirúrgico", "Centro de Material e Esterilização (CME)"];
  }
  return [assuntoCanonico(disciplina, assunto)];
}
/** Somente atualizações nas FKs e temas das questões oficiais: nunca deleta
 * questões, alternativas, respostas ou flashcards. Idempotente. */
export async function sincronizarTaxonomiaQuestoes() {
  const disciplinas = await prisma.disciplina.findMany({
    select: { id: true, nome: true, usuarioId: true },
  });
  let realocadas = 0, assuntos = 0;
  for (const antiga of [...disciplinas]) {
    if (disciplinaCanonica(antiga.nome) === antiga.nome.trim()) continue;
    let atual = disciplinas.find(d => d.usuarioId === antiga.usuarioId &&
      limpar(d.nome) === "enfermagem");
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
  const questoes = await prisma.questao.findMany({
    where: { fonte: FONTE_PROVAS_REAIS, tema: { not: null } },
    select: { id: true, tema: true, enunciado: true, disciplina: { select: { nome: true } } },
  });
  for (const q of questoes) {
    const nome = assuntoCanonico(q.disciplina.nome, q.tema || "", q.enunciado);
    if (nome && nome !== q.tema) {
      await prisma.questao.update({ where: { id: q.id }, data: { tema: nome } });
      assuntos++;
    }
  }
  console.log("[questoes-taxonomia] " + realocadas + " questões realocadas, " +
    assuntos + " temas normalizados; nenhum registro excluído.");
  return { realocadas, assuntos };
}
