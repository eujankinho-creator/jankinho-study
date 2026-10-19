import { prisma } from "../../lib/prisma";
import { FONTE_PROVAS_REAIS } from "./questoesOficiaisFGV2025";

/**
 * Migração destrutiva protegida por cópia na própria base PostgreSQL.
 *
 * Nunca remove originais FGV validados. Guarda questões antigas, alternativas
 * e respostas em AppConfig (lotes determinísticos) no MESMO transaction do
 * delete correspondente. Flashcards pessoais ligados à questão são soltos,
 * não apagados. Assim o histórico pode ser restaurado pela administração.
 *
 * A autenticação não expõe o arquivo: AppConfig não tem endpoint de download.
 */
const ARQUIVO = "cortex-questoes-legado-arquivado-v1";
const LOTE = 60;
const antigas = {
  OR: [
    { fonte: { not: FONTE_PROVAS_REAIS } },
    { fonte: null },
  ],
};

export async function arquivarESubstituirBancoLegado() {
  // Guardar inventário completo antes de excluir as questões anteriores.
  // A aplicação pode usar estes temas para continuar pesquisando provas.
  const inventarioExistente = await prisma.appConfig.findUnique({
    where: { chave: ARQUIVO + "-inventario" },
    select: { chave: true },
  });
  if (!inventarioExistente) {
    const [agrupamento, disciplinas] = await Promise.all([
      prisma.questao.groupBy({
        by: ["disciplinaId", "tema"],
        where: antigas,
        _count: { _all: true },
      }),
      prisma.disciplina.findMany({
        select: { id: true, nome: true },
      }),
    ]);
    const nomes = new Map(disciplinas.map(d => [d.id, d.nome]));
    await prisma.appConfig.upsert({
      where: { chave: ARQUIVO + "-inventario" },
      create: {
        chave: ARQUIVO + "-inventario",
        valor: {
          tipo: "inventario-assuntos-historicos",
          assuntoTotal: agrupamento.length,
          assuntos: agrupamento.map(x => ({
            disciplina: nomes.get(x.disciplinaId) || "Desconhecida",
            assunto: x.tema || "Sem assunto",
            quantidadeAnterior: x._count._all,
          })),
          guardadoEm: new Date().toISOString(),
        },
      },
      update: {},
    });
  }

  let removidas = 0, lotes = 0;
  while (true) {
    const questoes = await prisma.questao.findMany({
      where: antigas,
      take: LOTE,
      orderBy: { id: "asc" },
      include: { alternativas: true, respostas: true },
    });
    if (!questoes.length) break;

    const ids = questoes.map(q => q.id);
    const chave = ARQUIVO + "-lote-" + ids[0] + "-" + ids[ids.length-1];
    const json = JSON.parse(JSON.stringify({
      guardadoEm: new Date().toISOString(),
      originalIds: ids,
      versao: 1,
      questoes,
    }));
    const deletedCount = await prisma.$transaction(async tx => {
      // Atomicidade crítica: sem backup salvo, não há DELETE.
      await tx.appConfig.upsert({
        where: { chave },
        create: { chave, valor: json },
        update: { valor: json },
      });
      // Nunca eliminar flashcards pessoais por cascata do Prisma.
      await tx.flashcard.updateMany({
        where: { questaoId: { in: ids } },
        data: { questaoId: null },
      });
      return (await tx.questao.deleteMany({ where: { id: { in: ids } } })).count;
    }, { timeout: 60000 });

    if (deletedCount !== ids.length) {
      throw new Error("Falha de consistência de lote: esperadas " +
        ids.length + ", excluídas " + deletedCount);
    }
    removidas += deletedCount;
    lotes++;
    if (lotes % 10 === 0) {
      console.log("[provas-oficiais] Questões antigas arquivadas e removidas: "+removidas);
    }
  }
  await prisma.appConfig.upsert({
    where: { chave: ARQUIVO + "-concluido" },
    create: {
      chave: ARQUIVO + "-concluido",
      valor: { removidas, lotes, concluidoEm: new Date().toISOString(), fonteNova: FONTE_PROVAS_REAIS },
    },
    update: {
      valor: { removidas, lotes, concluidoEm: new Date().toISOString(), fonteNova: FONTE_PROVAS_REAIS },
    },
  });
  console.log("[provas-oficiais] Banco legado arquivado com segurança: " +
    removidas + " questões / " + lotes + " lotes; flashcards preservados.");
  return { removidas, lotes };
}
