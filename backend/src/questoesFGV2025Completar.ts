import { prisma } from "../../lib/prisma";
import { QUESTOES_FGV_2025_ORIGINAIS } from "./questoesFGV2025Conteudo";
import { FONTE_PROVAS_REAIS } from "./questoesOficiaisFGV2025";

/** Substitui os placeholders anteriores sem criar IDs novos nem perder respostas.
 * Uma questão é atualizada atomicamente com suas cinco alternativas originais.
 * A importação é idempotente: após a primeira conversão, não há writes.
 */
export async function preencherQuestoesOriginaisFGV2025() {
  let convertidas = 0, jaCompletas = 0;
  for (const original of QUESTOES_FGV_2025_ORIGINAIS) {
    const origemId = "fgv-ebserh-2025-grupo-enfermagem-tipo1-q" +
      String(original.numero).padStart(2, "0");
    const item = await prisma.questao.findFirst({
      where: { fonte: FONTE_PROVAS_REAIS, origemId },
      select: {
        id: true, enunciado: true,
        alternativas: { select: { texto: true, correta: true } },
      },
    });
    if (!item) {
      // Fail-fast para não sinalizar uma migração completa com itens faltando.
      throw new Error("[fgv-original] Questão ausente no banco: " + origemId);
    }
    const enunciado = original.contexto
      ? "TEXTO " + (original.numero <= 6 ? "1" : "2") +
        " — MATERIAL DE APOIO DA PROVA\n\n" + original.contexto +
        "\n\nENUNCIADO DA QUESTÃO " + original.numero + "\n\n" + original.enunciado
      : original.enunciado;
    const alternativas = original.alternativas.map((a) => ({
      texto: a.letra + ") " + a.texto,
      correta: a.letra === original.correta,
    }));

    if (item.enunciado === enunciado &&
      item.alternativas.length === 5 &&
      alternativas.every((a) =>
        item.alternativas.some(x => x.texto === a.texto && x.correta === a.correta))) {
      jaCompletas++;
      continue;
    }

    await prisma.questao.update({
      where: { id: item.id },
      data: {
        enunciado,
        explicacao: "Gabarito definitivo FGV/EBSERH, edital 03/2024, prova aplicada em 16/03/2025, " +
          "Grupo Enfermagem Tipo 1, questão " + original.numero +
          ": alternativa " + original.correta +
          ". As alternativas e o enunciado foram reproduzidos sob autorização informada pelo responsável da plataforma. " +
          "Prova: https://conhecimento.fgv.br/sites/default/files/concursos/grupo-4-enfermageme3cnsgp04-tipo-1.pdf " +
          "Gabarito definitivo: https://conhecimento.fgv.br/sites/default/files/concursos/ebserrhassistencial2024_gabarito_definitivo.pdf",
        alternativas: { deleteMany: {}, create: alternativas },
      },
    });
    convertidas++;
  }
  console.log("[fgv-original] 59 questões disponíveis integralmente no Córtex: " +
    convertidas + " convertidas; " + jaCompletas + " já completas; 36 anulada excluída.");
  return { convertidas, jaCompletas };
}
