import { prisma } from "../../lib/prisma";


export async function resetAllPerformanceIfRequested() {

  if (
    process.env.RESET_ALL_RESPONSES_ONCE !==
      "1"
  ) {
    return;
  }


  const before =
    await prisma.resposta.count();


  const result =
    await prisma.resposta.deleteMany({});


  const after =
    await prisma.resposta.count();


  console.log(
    "[performance-reset] Respostas antes:",
    before,
    "| apagadas:",
    result.count,
    "| depois:",
    after
  );

}
