import { prisma } from "../../lib/prisma";
import { QUESTOES_FGV_ABREU_LIMA_2024 } from "./questoesFGVAbreuLima2024Conteudo";
import { FONTE_PROVAS_REAIS } from "./questoesOficiaisFGV2025";

/**
 * Segundo lote de questões reais. Nunca cria alternativas fictícias.
 * Questões 21..70 da prova FGV Enfermeiro, tipo 1 (01/09/2024),
 * com exclusão da questão 27, anulada no gabarito definitivo.
 *
 * Banco compartilhado via primeiro usuário, conforme lote FGV/EBSERH.
 * Idempotente por origemId (não altera respostas/flashcards existentes).
 */
const PROVA = "https://conhecimento.fgv.br/sites/default/files/concursos/enfermeirocns201-tipo-1_0.pdf";
const GABARITO = "https://conhecimento.fgv.br/sites/default/files/concursos/pref_abreuelima_gabarito_definitivo_da0a4fs131.pdf";

export async function sincronizarFGVAbreuLimaEnfermagem2024() {
  const usuario = await prisma.usuario.findFirst({
    orderBy: { id: "asc" },
    select: { id: true },
  });
  if (!usuario) {
    console.warn("[fgv-abreulima-2024] Sem usuário-base para o acervo compartilhado.");
    return { inseridas: 0, existentes: 0 };
  }
  if (QUESTOES_FGV_ABREU_LIMA_2024.length !== 49 ||
      QUESTOES_FGV_ABREU_LIMA_2024.some((q) =>
        q.numero === 27 || q.numero < 21 || q.numero > 70 ||
        !/^[A-E]$/.test(q.correta) || q.alternativas.length !== 5 ||
        q.alternativas.map(a => a.letra).join("") !== "ABCDE" ||
        q.alternativas.some(a => !a.texto.trim()) ||
        !q.enunciado.trim() || !q.assunto.trim())) {
    throw new Error("Integridade do caderno/gabarito FGV Abreu e Lima não confirmada");
  }
  const disciplinas = new Map<string, number>();
  let inseridas = 0, existentes = 0;
  for (const item of QUESTOES_FGV_ABREU_LIMA_2024) {
    const origemId = "fgv-abreu-lima-2024-enfermeiro-tipo1-q" +
      String(item.numero).padStart(2, "0");
    const duplicada = await prisma.questao.findFirst({
      where: { fonte: FONTE_PROVAS_REAIS, origemId },
      select: { id: true },
    });
    if (duplicada) {
      existentes++;
      continue;
    }
    let disciplinaId = disciplinas.get(item.disciplina);
    if (!disciplinaId) {
      let disciplina = await prisma.disciplina.findFirst({
        where: {
          usuarioId: usuario.id,
          nome: { equals: item.disciplina, mode: "insensitive" },
        },
        select: { id: true },
      });
      if (!disciplina) {
        disciplina = await prisma.disciplina.create({
          data: { usuarioId: usuario.id, nome: item.disciplina },
          select: { id: true },
        });
      }
      disciplinaId = disciplina.id;
      disciplinas.set(item.disciplina, disciplinaId);
    }
    await prisma.questao.create({
      data: {
        usuarioId: usuario.id,
        disciplinaId,
        fonte: FONTE_PROVAS_REAIS,
        origemId,
        tema: item.assunto,
        dificuldade: "medio",
        banca: "FGV",
        orgao: "Prefeitura Municipal de Abreu e Lima",
        ano: 2024,
        cargo: "Enfermeiro — Edital 02/2024, Tipo 1",
        fonteUrl: PROVA,
        enunciado: item.enunciado,
        explicacao:
          "Gabarito definitivo da FGV, Concurso Público da Prefeitura de Abreu e Lima, " +
          "edital 02/2024, prova de Enfermeiro Tipo 1 de 01/09/2024, questão " +
          item.numero + ": alternativa " + item.correta +
          ". Questão original reproduzida sob autorização informada pelo responsável do Córtex. " +
          "Prova: " + PROVA + " | Gabarito definitivo: " + GABARITO,
        alternativas: {
          create: item.alternativas.map(a => ({
            texto: a.letra + ") " + a.texto,
            correta: a.letra === item.correta,
          })),
        },
      },
    });
    inseridas++;
  }
  console.log("[fgv-abreulima-2024] Prova Tipo 1: " + inseridas +
    " questões novas, " + existentes + " existentes; Q27 anulada excluída.");
  return { inseridas, existentes };
}
