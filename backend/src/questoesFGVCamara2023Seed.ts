import { prisma } from "../../lib/prisma";
import { QUESTOES_FGV_CAMARA_2023 } from "./questoesFGVCamara2023Conteudo";
import { FONTE_PROVAS_REAIS } from "./questoesOficiaisFGV2025";

/**
 * Caderno ORIGINAL do concurso Câmara dos Deputados/FGV 2023, Enfermeiro,
 * turno TARDE, Tipo 1. Reprodução autorizada pelo responsável do Córtex.
 * Gabarito DEFINITIVO, com Q69 anulada e Q28 excluída por depender de
 * figura diagnóstica ausente da reprodução textual.
 * Compartilha a origem com o catálogo oficial e não reativa seeds autorais.
 */
const PDF = "https://conhecimento.fgv.br/sites/default/files/concursos/cns202-analista-legislativo-enfermeirocns202-tipo-1-tarde.pdf";
const GABARITO = "https://conhecimento.fgv.br/sites/default/files/concursos/camara-dos-deputados-gabaritos-definitivo-para-publicacao-edital-2-tarde.pdf";

export async function sincronizarFGVCamaraEnfermeiro2023() {
  if (QUESTOES_FGV_CAMARA_2023.length !== 68 ||
    QUESTOES_FGV_CAMARA_2023.some((q) =>
      q.numero === 28 || q.numero === 69 || q.numero < 1 || q.numero > 70 ||
      !q.disciplina.trim() || !q.assunto.trim() || q.enunciado.length < 32 ||
      !/^[A-E]$/.test(q.correta) || q.alternativas.length !== 5 ||
      q.alternativas.map(a => a.letra).join("") !== "ABCDE" ||
      q.alternativas.some(a => !a.texto.trim()))) {
    throw new Error("FGV Câmara 2023: caderno não validado");
  }

  const usuario = await prisma.usuario.findFirst({
    orderBy: { id: "asc" }, select: { id: true },
  });
  if (!usuario) {
    console.warn("[fgv-camara-2023] Nenhum usuário-base cadastrado");
    return { inseridas: 0, existentes: 0 };
  }

  let inseridas = 0, existentes = 0;
  const disciplinas = new Map<string, number>();

  for (const q of QUESTOES_FGV_CAMARA_2023) {
    const origemId = "fgv-camara-2023-enfermeiro-tarde-tipo1-q" + String(q.numero).padStart(2, "0");
    const presente = await prisma.questao.findFirst({
      where: { fonte: FONTE_PROVAS_REAIS, origemId },
      select: { id: true },
    });
    if (presente) { existentes++; continue; }

    let disciplinaId = disciplinas.get(q.disciplina);
    if (!disciplinaId) {
      let disciplina = await prisma.disciplina.findFirst({
        where: { usuarioId: usuario.id, nome: { equals: q.disciplina, mode: "insensitive" } },
        select: { id: true },
      });
      if (!disciplina) {
        disciplina = await prisma.disciplina.create({
          data: { usuarioId: usuario.id, nome: q.disciplina },
          select: { id: true },
        });
      }
      disciplinaId = disciplina.id;
      disciplinas.set(q.disciplina, disciplinaId);
    }

    await prisma.questao.create({
      data: {
        usuarioId: usuario.id,
        disciplinaId,
        fonte: FONTE_PROVAS_REAIS,
        origemId,
        tema: q.assunto,
        dificuldade: "medio",
        banca: "FGV",
        orgao: "Câmara dos Deputados",
        ano: 2023,
        cargo: "Analista Legislativo — Enfermeiro, Edital 2, Turno Tarde, Tipo 1",
        fonteUrl: PDF,
        enunciado: q.enunciado,
        explicacao:
          "Resposta conforme o gabarito DEFINITIVO FGV, Câmara dos Deputados, " +
          "Concurso 2023, Edital 2, Enfermeiro Tipo 1 TARDE, questão " +
          q.numero + ": alternativa " + q.correta + ". " +
          "Enunciado e opções da prova original, reproduzidos sob autorização " +
          "informada pelo responsável do Córtex. Prova: " + PDF +
          ". Gabarito: " + GABARITO,
        alternativas: {
          create: q.alternativas.map(a => ({
            texto: a.letra + ") " + a.texto,
            correta: a.letra === q.correta,
          })),
        },
      },
    });
    inseridas++;
  }

  console.log("[fgv-camara-2023] Enfermeiro TARDE Tipo 1: " + inseridas +
    " novas questões, " + existentes +
    " existentes. Q28 (imagem) e Q69 (anulada) excluídas.");
  return { inseridas, existentes };
}
