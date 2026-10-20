import { prisma } from "../lib/prisma";
import { sincronizarLotesQuestoesEmMassa } from "../backend/src/questoesImportadorMassivo";

sincronizarLotesQuestoesEmMassa()
  .catch((error) => {
    console.error("[lotes-massivos] Importação interrompida:", error);
    process.exitCode = 1;
  })
  .finally(async () => { await prisma.$disconnect(); });
