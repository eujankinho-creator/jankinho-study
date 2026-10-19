import { prisma } from "../../lib/prisma";
import { obterMatrizQuestoes30PorAssunto } from "./questoesMatriz30PorAssunto";

/**
 * Medição baseada no banco REAL do usuário, não em uma lista de demonstração.
 * Questões antigas, autorais ou "estilo FGV" nunca contam como prova original.
 * Importações oficiais precisam de revisão documental e da licença de reprodução.
 */
const FONTE_OFICIAL_VERIFICADA = "cortex-prova-original-verificada-v1";
const META = 30;

function normalizar(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

export async function obterCoberturaQuestoesOficiais(usuarioId: number) {
  const [disciplinas, agrupamento, candidatos] = await Promise.all([
    prisma.disciplina.findMany({
      where: { usuarioId },
      select: { id: true, nome: true },
    }),
    prisma.questao.groupBy({
      by: ["disciplinaId", "tema", "fonte"],
      where: { usuarioId },
      _count: { _all: true },
    }),
    prisma.questao.findMany({
      where: { usuarioId, fonte: FONTE_OFICIAL_VERIFICADA },
      select: {
        disciplinaId: true, tema: true, origemId: true, fonteUrl: true,
        banca: true, ano: true, cargo: true,
        alternativas: { select: { correta: true } },
      },
    }),
  ]);

  const nomes = new Map(disciplinas.map((d) => [d.id, d.nome]));
  type Linha = {
    disciplina: string; assunto: string; totalBanco: number;
    originaisVerificadas: number; meta: number; faltam: number;
  };
  const itens = new Map<string, Linha>();
  const obter = (disciplina: string, assunto: string) => {
    const chave = normalizar(disciplina) + "|" + normalizar(assunto);
    let linha = itens.get(chave);
    if (!linha) {
      linha = { disciplina, assunto, totalBanco: 0, originaisVerificadas: 0, meta: META, faltam: META };
      itens.set(chave, linha);
    }
    return linha;
  };

  // Inclui todo o currículo conhecido, mesmo sem nenhuma questão no banco.
  for (const d of obterMatrizQuestoes30PorAssunto()) {
    for (const assunto of d.assuntos) obter(d.disciplina, assunto);
  }
  // Inclui os temas reais de todas as disciplinas deste usuário.
  for (const g of agrupamento) {
    const disciplina = nomes.get(g.disciplinaId);
    if (!disciplina) continue;
    const assunto = String(g.tema || "").trim();
    if (!assunto) continue;
    obter(disciplina, assunto).totalBanco += g._count._all;
  }

  // Nunca contamos como "original" uma questão simplesmente marcada como FGV.
  // Exigimos origem estável, prova, ano, URL, 2+ alternativas e 1 único gabarito.
  const ids = new Set<string>();
  for (const q of candidatos) {
    const disciplina = nomes.get(q.disciplinaId);
    const assunto = String(q.tema || "").trim();
    if (!disciplina || !assunto || !q.origemId?.trim() ||
        !q.fonteUrl?.startsWith("https://") || !q.banca?.trim() ||
        !q.ano || !q.cargo?.trim() || q.alternativas.length < 2 ||
        q.alternativas.filter((a) => a.correta).length !== 1) continue;
    const origem = q.banca.toLowerCase() + "|" + q.ano + "|" + q.origemId.toLowerCase();
    if (ids.has(origem)) continue;
    ids.add(origem);
    obter(disciplina, assunto).originaisVerificadas++;
  }

  const linhas = [...itens.values()].map((item) => ({
    ...item, faltam: Math.max(0, META - item.originaisVerificadas),
  })).sort((a,b) =>
    a.disciplina.localeCompare(b.disciplina, "pt-BR") ||
    a.assunto.localeCompare(b.assunto, "pt-BR")
  );
  return {
    metaPorAssunto: META,
    assuntos: linhas.length,
    disciplinas: new Set(linhas.map((x) => x.disciplina)).size,
    metaTotal: META * linhas.length,
    questoesVerificadas: linhas.reduce((sum, x) => sum + Math.min(META,x.originaisVerificadas),0),
    questoesNoBanco: linhas.reduce((sum, x) => sum + x.totalBanco,0),
    criterio: "Originais documentados em prova/gabarito; autorais e simuladas excluídas da contagem.",
    itens: linhas,
  };
}
