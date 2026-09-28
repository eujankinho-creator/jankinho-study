import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const usuario = await prisma.usuario.upsert({
    where: {
      email: "jan@jankinhostudy.com",
    },
    update: {},
    create: {
      nome: "Jan",
      email: "jan@jankinhostudy.com",
    },
  });

  console.log("Usuário criado/encontrado:");
  console.log(usuario);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });