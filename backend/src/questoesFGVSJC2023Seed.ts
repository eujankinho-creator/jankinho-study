import { prisma } from "../../lib/prisma";
import { FONTE_PROVAS_REAIS } from "./questoesOficiaisFGV2025";
import { QUESTOES_FGV_SJC_ENFERMEIRO_2023 } from "./questoesFGVSJCEnfermeiro2023Conteudo";
import { QUESTOES_FGV_SJC_TECNICO_2023 } from "./questoesFGVSJCTecnico2023Conteudo";

/** FGV — Prefeitura de São José dos Campos (Saúde), edital 04/2023.
 * Enfermeiro Q31-70, exceto Q35 anulada.
 * Técnico em Enfermagem Q31-60, exceto Q39 com gráfico não reproduzível.
 * Gabarito definitivo retificado em 09/01/2024.
 * Os textos são originais e a reprodução foi autorizada, conforme
 * declaração do responsável pelo Córtex.
 */
const GABARITO =
  "https://conhecimento.fgv.br/sites/default/files/concursos/sjcsaude2023_gabarito_definitivo_20240104.pdf";
const LOTES = [
  {
    nome: "enfermeiro",
    itens: QUESTOES_FGV_SJC_ENFERMEIRO_2023,
    tamanho: 39,
    descartada: 35,
    url: "https://conhecimento.fgv.br/sites/default/files/concursos/cns001-analista-em-saude-enfermeirocns001-tipo-1.pdf",
    cargo: "Analista em Saúde — Enfermeiro, Edital 04/2023, Tipo 1",
  },
  {
    nome: "tecnico-enfermagem",
    itens: QUESTOES_FGV_SJC_TECNICO_2023,
    tamanho: 29,
    descartada: 39,
    url: "https://conhecimento.fgv.br/sites/default/files/concursos/cnm001-assistente-tecnico-em-saude-tecnico-em-enfermagemcnm001-tipo-1.pdf",
    cargo: "Assistente Técnico em Saúde — Técnico em Enfermagem, Edital 04/2023, Tipo 1",
  },
];

export async function sincronizarFGVSaoJoseCampos2023() {
  const usuario = await prisma.usuario.findFirst({
    orderBy: { id: "asc" },
    select: { id: true },
  });
  if (!usuario) {
    console.warn("[fgv-sjc-2023] Nenhum usuário-base para acervo compartilhado.");
    return { inseridas: 0, existentes: 0 };
  }
  const disciplinas = new Map<string, number>();
  let inseridas = 0, existentes = 0;
  for (const lote of LOTES) {
    const itens = lote.itens;
    if (itens.length !== lote.tamanho ||
        new Set(itens.map(x => x.numero)).size !== lote.tamanho ||
        itens.some(q => q.numero < 31 || q.numero > (lote.nome === "enfermeiro" ? 70 : 60) ||
          q.numero === lote.descartada || !q.disciplina.trim() || !q.assunto.trim() ||
          !q.enunciado.trim() || !/^[A-E]$/.test(q.correta) ||
          q.alternativas.length !== 5 ||
          q.alternativas.map(a => a.letra).join("") !== "ABCDE" ||
          q.alternativas.some(a => !a.texto.trim()) ||
          q.alternativas.filter(a => a.letra === q.correta).length !== 1)) {
      throw new Error("[fgv-sjc-2023] Integridade da prova/gabarito comprometida: " + lote.nome);
    }
    for (const q of itens) {
      const origemId = "fgv-sjc-2023-" + lote.nome + "-tipo1-q" +
        String(q.numero).padStart(2, "0");
      const existe = await prisma.questao.findFirst({
        where: { fonte: FONTE_PROVAS_REAIS, origemId },
        select: { id: true },
      });
      if (existe) { existentes++; continue; }
      let disciplinaId = disciplinas.get(q.disciplina);
      if (!disciplinaId) {
        let disciplina = await prisma.disciplina.findFirst({
          where: {
            usuarioId: usuario.id,
            nome: { equals: q.disciplina, mode: "insensitive" },
          },
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
          usuarioId: usuario.id, disciplinaId,
          fonte: FONTE_PROVAS_REAIS, origemId,
          tema: q.assunto, dificuldade: "medio",
          banca: "FGV", orgao: "Prefeitura Municipal de São José dos Campos",
          ano: 2023, cargo: lote.cargo, fonteUrl: lote.url,
          enunciado: q.enunciado,
          explicacao:
            "FGV, Prefeitura de São José dos Campos, edital 04/2023. " +
            "Prova objetiva Tipo 1 aplicada em 26/11/2023, " + lote.cargo +
            ", questão " + q.numero + ". Gabarito definitivo retificado: " +
            q.correta + ". Reprodução autorizada conforme declaração do responsável pelo Córtex. " +
            "Prova: " + lote.url + " | Gabarito oficial: " + GABARITO,
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
  }
  console.log("[fgv-sjc-2023] " + inseridas +
    " novas questões oficiais; " + existentes +
    " já existentes (Enfermeiro 39 + Técnico 29; Q35 anulada e Q39 com figura excluídas).");
  return { inseridas, existentes };
}
