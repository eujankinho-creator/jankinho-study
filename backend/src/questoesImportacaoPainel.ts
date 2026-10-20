import { prisma } from "../../lib/prisma";
import { FONTE_PROVAS_REAIS } from "./questoesOficiaisFGV2025";
import { validarManifesto } from "./questoesImportadorMassivo";

/**
 * Importação direta de manifesto disponibilizado pelo proprietário autenticado.
 * O servidor exige declaração explícita de permissão e revisão do gabarito.
 * Não coleta PDFs de terceiros nem simula licença de reprodução.
 */
let ocupada = false;

function normalizar(v: string) {
  return v.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export async function podeImportarQuestoes(usuarioId: number): Promise<boolean> {
  const [usuario, dono] = await Promise.all([
    prisma.usuario.findUnique({ where: { id: usuarioId }, select: { id: true, email: true } }),
    prisma.usuario.findFirst({ orderBy: { id: "asc" }, select: { id: true } }),
  ]);
  if (!usuario || !dono || usuario.id !== dono.id) return false;
  const permitidos = (process.env.CORTEX_QUESTOES_IMPORT_ADMIN_EMAILS || "")
    .split(",").map((x) => x.toLowerCase().trim()).filter(Boolean);
  // Quando configurado, o e-mail é um segundo requisito além da conta proprietária.
  if (permitidos.length && !permitidos.includes(usuario.email.toLowerCase())) return false;
  return true;
}

type Resultado = {
  candidatas: number;
  inseridas: number;
  repetidas: number;
  jaImportadas: number;
  transacoes: number;
};

export async function importarLoteDoProprietario(valor: unknown, usuarioId: number): Promise<Resultado> {
  if (ocupada) throw new Error("Outra importação está em andamento. Aguarde sua conclusão.");
  if (!(await podeImportarQuestoes(usuarioId))) throw new Error("Apenas a conta proprietária pode importar lotes.");
  const manifesto = validarManifesto(valor, "lote enviado pelo proprietário");
  ocupada = true;
  try {
    const registros = await prisma.questao.findMany({
      where: { fonte: FONTE_PROVAS_REAIS },
      select: { origemId: true, enunciado: true },
    });
    const origens = new Set(registros.map((x) => x.origemId).filter((v): v is string => !!v));
    const textos = new Set(registros.map((x) => normalizar(x.enunciado)));
    const disciplinas = await prisma.disciplina.findMany({
      where: { usuarioId }, select: { id: true, nome: true },
    });
    const dmap = new Map(disciplinas.map((d) => [normalizar(d.nome), d.id]));
    const preparar: Array<{
      id: string;
      disciplina: number;
      fonte: typeof manifesto.provas[number];
      questao: typeof manifesto.provas[number]["questoes"][number];
    }> = [];
    const resultado: Resultado = {
      candidatas: 0, inseridas: 0, repetidas: 0, jaImportadas: 0, transacoes: 0,
    };

    for (const prova of manifesto.provas) {
      for (const q of prova.questoes) {
        resultado.candidatas++;
        const origemId = "oficial-" + prova.codigo + "-q" + String(q.numero).padStart(4, "0");
        if (origens.has(origemId)) { resultado.jaImportadas++; continue; }
        const hash = normalizar(q.enunciado);
        if (textos.has(hash)) { resultado.repetidas++; continue; }
        let idDisciplina = dmap.get(normalizar(q.disciplina));
        if (!idDisciplina) {
          const existing = await prisma.disciplina.findFirst({
            where: { usuarioId, nome: { equals: q.disciplina, mode: "insensitive" } },
            select: { id: true },
          });
          const created = existing || await prisma.disciplina.create({
            data: { usuarioId, nome: q.disciplina }, select: { id: true },
          });
          idDisciplina = created.id;
          dmap.set(normalizar(q.disciplina), idDisciplina);
        }
        preparar.push({ id: origemId, disciplina: idDisciplina, fonte: prova, questao: q });
        origens.add(origemId); textos.add(hash);
      }
    }

    const TAMANHO = 100;
    for (let start = 0; start < preparar.length; start += TAMANHO) {
      const bloco = preparar.slice(start, start + TAMANHO);
      await prisma.$transaction(async (tx) => {
        await tx.questao.createMany({
          data: bloco.map(({ id, disciplina, fonte, questao: q }) => ({
            usuarioId, disciplinaId: disciplina, fonte: FONTE_PROVAS_REAIS,
            origemId: id, enunciado: q.enunciado, tema: q.assunto,
            dificuldade: "medio", banca: fonte.banca, ano: fonte.ano,
            orgao: fonte.orgao, cargo: fonte.cargo, fonteUrl: fonte.cadernoUrl,
            imagemUrl: q.imagemUrl ?? null, imagemAlt: q.imagemAlt ?? null,
            explicacao: "Questão " + q.numero + " da prova " + fonte.cargo +
              " (" + fonte.ano + "). Gabarito declarado e conferido pelo fornecedor: " +
              q.correta + ". Caderno: " + fonte.cadernoUrl +
              " | Gabarito definitivo: " + fonte.gabaritoUrl,
          })),
        });
        const criadas = await tx.questao.findMany({
          where: { usuarioId, fonte: FONTE_PROVAS_REAIS,
            origemId: { in: bloco.map((b) => b.id) } },
          select: { id: true, origemId: true },
        });
        const mapa = new Map(criadas.map((q) => [q.origemId, q.id]));
        if (mapa.size !== bloco.length) throw new Error("Falha na associação das alternativas.");
        await tx.alternativa.createMany({
          data: bloco.flatMap(({ id, questao: q }) => {
            const questaoId = mapa.get(id);
            if (!questaoId) throw new Error("Questão sem ID: " + id);
            return q.alternativas.map((texto, i) => ({
              questaoId, texto: "ABCDE"[i] + ") " + texto,
              correta: "ABCDE"[i] === q.correta,
            }));
          }),
        });
      }, { timeout: 60000, maxWait: 10000 });
      resultado.inseridas += bloco.length;
      resultado.transacoes++;
      console.log("[importacao-autorizada] " + resultado.inseridas + "/" + preparar.length);
    }
    console.log("[importacao-autorizada] RESUMO " + JSON.stringify(resultado));
    return resultado;
  } finally {
    ocupada = false;
  }
}
