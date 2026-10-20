import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../../lib/prisma";
import { FONTE_PROVAS_REAIS } from "./questoesOficiaisFGV2025";

/**
 * Acervo oficial em lotes: até 1.000 questões por arquivo JSON;
 * vários arquivos podem ser aplicados em um único deploy.
 * As gravações são atômicas em blocos de 150 questões + suas alternativas.
 * Reexecutar o importador não recria questões e preserva respostas dos alunos.
 */
const MAX_POR_ARQUIVO = 1000;
const BLOCO_TRANSACAO = 150;
const DIRETORIO = path.resolve(process.cwd(), "backend", "data", "questoes-oficiais");

type QuestaoLote = {
  numero: number;
  disciplina: string;
  assunto: string;
  enunciado: string;
  alternativas: string[];
  correta: string;
  imagemUrl?: string;
  imagemAlt?: string;
};
type ProvaLote = {
  codigo: string;
  banca: string;
  ano: number;
  orgao: string;
  cargo: string;
  cadernoUrl: string;
  gabaritoUrl: string;
  gabaritoDefinitivo: true;
  questoes: QuestaoLote[];
};
type Manifesto = {
  formato: "cortex-questoes-oficiais-v1";
  lote: string;
  provas: ProvaLote[];
};
type Registro = {
  origemId: string;
  prova: ProvaLote;
  questao: QuestaoLote;
  disciplinaId: number;
};
export type ResultadoImportacaoMassa = {
  arquivos: number;
  candidatas: number;
  inseridas: number;
  existentes: number;
  repetidas: number;
};

function normalizar(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, " ").trim();
}
function stringValida(value: unknown, minimo = 1, maximo = 10000): value is string {
  return typeof value === "string" && value.trim().length >= minimo && value.length <= maximo;
}
function urlHttps(value: unknown): value is string {
  if (!stringValida(value, 12, 3000)) return false;
  try { return new URL(value).protocol === "https:"; }
  catch { return false; }
}
function erro(message: string): never { throw new Error("[lotes-massivos] " + message); }

export function validarManifesto(value: unknown, arquivo: string): Manifesto {
  if (!value || typeof value !== "object" || Array.isArray(value)) erro(arquivo + " não é objeto JSON");
  const m = value as Record<string, unknown>;
  if (m.formato !== "cortex-questoes-oficiais-v1" || !stringValida(m.lote, 4, 120) ||
      !Array.isArray(m.provas) || m.provas.length < 1) erro(arquivo + ": manifesto incompleto");
  let total = 0;
  const codigos = new Set<string>();
  for (const item of m.provas) {
    if (!item || typeof item !== "object" || Array.isArray(item)) erro(arquivo + ": prova inválida");
    const prova = item as Record<string, unknown>;
    if (!stringValida(prova.codigo, 5, 110) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(prova.codigo) ||
        !stringValida(prova.banca, 2, 100) ||
        !Number.isInteger(prova.ano) || Number(prova.ano) < 1950 || Number(prova.ano) > 2100 ||
        !stringValida(prova.orgao, 2, 240) || !stringValida(prova.cargo, 2, 250) ||
        !urlHttps(prova.cadernoUrl) || !urlHttps(prova.gabaritoUrl) ||
        prova.gabaritoDefinitivo !== true || !Array.isArray(prova.questoes) ||
        prova.questoes.length < 1) erro(arquivo + ": prova sem identificação, fonte ou gabarito definitivo");
    if (codigos.has(prova.codigo)) erro(arquivo + ": código repetido: " + prova.codigo);
    codigos.add(prova.codigo);
    const numeros = new Set<number>();
    for (const q of prova.questoes) {
      if (!q || typeof q !== "object" || Array.isArray(q)) erro(arquivo + ": questão inválida");
      const questao = q as Record<string, unknown>;
      const numero = Number(questao.numero);
      if (!Number.isInteger(numero) || numero < 1 || numero > 9999 || numeros.has(numero) ||
          !stringValida(questao.disciplina, 2, 150) ||
          !stringValida(questao.assunto, 2, 200) || !stringValida(questao.enunciado, 25, 10000) ||
          !Array.isArray(questao.alternativas) ||
          (questao.alternativas.length !== 4 && questao.alternativas.length !== 5) ||
          !questao.alternativas.every((a: unknown) => stringValida(a, 2, 3500)) ||
          typeof questao.correta !== "string" ||
          !("ABCDE".slice(0, questao.alternativas.length)).includes(questao.correta)) {
        erro(arquivo + ": questão inválida em " + prova.codigo + " nº " + numero);
      }
      numeros.add(numero);
      const alternativas = questao.alternativas as string[];
      if (new Set(alternativas.map(normalizar)).size !== alternativas.length) {
        erro(arquivo + ": alternativas semanticamente iguais em " + prova.codigo + " nº " + numero);
      }
      const textoCompleto = (questao.enunciado as string) + " " + alternativas.join(" ");
      if (/\bRASCUNHO\s+PROVA\b|\bPROVA\s+DISCURSIVA\b|\bFOLHA\s+DE\s+RESPOSTAS\b/i.test(textoCompleto)) {
        erro(arquivo + ": texto de outra seção do caderno em " + prova.codigo + " nº " + numero);
      }
      if (questao.imagemUrl !== undefined && !urlHttps(questao.imagemUrl)) {
        erro(arquivo + ": imagem não é URL HTTPS em " + prova.codigo + " nº " + numero);
      }
      if (questao.imagemAlt !== undefined && !stringValida(questao.imagemAlt, 3, 500)) {
        erro(arquivo + ": descrição de imagem inválida em " + prova.codigo + " nº " + numero);
      }
      if (/\b(?:figura|imagem|grafico|gráfico|diagrama)\s+(?:abaixo|a seguir)\b/i.test(questao.enunciado as string)
          && !questao.imagemUrl) {
        erro(arquivo + ": depende de imagem ausente em " + prova.codigo + " nº " + numero);
      }
      total++;
    }
  }
  if (total > MAX_POR_ARQUIVO) erro(arquivo + " excede " + MAX_POR_ARQUIVO + " questões; divida em arquivos");
  return value as Manifesto;
}

async function lerManifestos(): Promise<Array<{ nome: string; manifesto: Manifesto }>> {
  let arquivos: string[];
  try {
    arquivos = (await readdir(DIRETORIO)).filter((f) => f.endsWith(".json") && !f.endsWith(".example.json")).sort();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const lista: Array<{ nome: string; manifesto: Manifesto }> = [];
  for (const nome of arquivos) {
    const data = JSON.parse(await readFile(path.join(DIRETORIO, nome), "utf8")) as unknown;
    lista.push({ nome, manifesto: validarManifesto(data, nome) });
  }
  return lista;
}

/** Pode ser executado no startup do servidor ou pelo comando npm run questoes:importar-lote. */
export async function sincronizarLotesQuestoesEmMassa(): Promise<ResultadoImportacaoMassa> {
  const arquivos = await lerManifestos();
  const resumo: ResultadoImportacaoMassa = {
    arquivos: arquivos.length, candidatas: 0, inseridas: 0, existentes: 0, repetidas: 0,
  };
  if (!arquivos.length) {
    console.log("[lotes-massivos] Importador pronto: 1.000 questões por arquivo, vários arquivos por deploy.");
    return resumo;
  }

  const usuario = await prisma.usuario.findFirst({ orderBy: { id: "asc" }, select: { id: true } });
  if (!usuario) erro("não existe usuário de referência para o acervo compartilhado");

  const [questoesExistentes, disciplinasExistentes] = await Promise.all([
    prisma.questao.findMany({
      where: { fonte: FONTE_PROVAS_REAIS },
      select: { origemId: true, enunciado: true },
    }),
    prisma.disciplina.findMany({ where: { usuarioId: usuario.id }, select: { id: true, nome: true } }),
  ]);
  const origens = new Set(questoesExistentes.map((q) => q.origemId).filter((x): x is string => !!x));
  const textos = new Set(questoesExistentes.map((q) => normalizar(q.enunciado)));
  const disciplinas = new Map(disciplinasExistentes.map((d) => [normalizar(d.nome), d.id]));
  const preparadas: Registro[] = [];
  const codigoProvas = new Set<string>();

  for (const { nome, manifesto } of arquivos) {
    for (const prova of manifesto.provas) {
      if (codigoProvas.has(prova.codigo)) erro("código de prova duplicado entre arquivos: " + prova.codigo);
      codigoProvas.add(prova.codigo);
      for (const q of prova.questoes) {
        resumo.candidatas++;
        const origemId = "oficial-" + prova.codigo + "-q" + String(q.numero).padStart(4, "0");
        if (origens.has(origemId)) { resumo.existentes++; continue; }
        const texto = normalizar(q.enunciado);
        if (textos.has(texto)) { resumo.repetidas++; continue; }

        const disciplinaKey = normalizar(q.disciplina);
        let disciplinaId = disciplinas.get(disciplinaKey);
        if (!disciplinaId) {
          const d = await prisma.disciplina.create({
            data: { usuarioId: usuario.id, nome: q.disciplina }, select: { id: true },
          });
          disciplinaId = d.id;
          disciplinas.set(disciplinaKey, disciplinaId);
        }
        preparadas.push({ origemId, prova, questao: q, disciplinaId });
        origens.add(origemId); textos.add(texto);
      }
    }
    console.log("[lotes-massivos] Manifesto validado: " + nome + " (" +
      manifesto.provas.reduce((s, p) => s + p.questoes.length, 0) + " itens)");
  }

  for (let inicio = 0; inicio < preparadas.length; inicio += BLOCO_TRANSACAO) {
    const bloco = preparadas.slice(inicio, inicio + BLOCO_TRANSACAO);
    await prisma.$transaction(async (tx) => {
      await tx.questao.createMany({
        data: bloco.map(({ origemId, prova, questao: q, disciplinaId }) => ({
          usuarioId: usuario.id, disciplinaId, fonte: FONTE_PROVAS_REAIS, origemId,
          enunciado: q.enunciado, tema: q.assunto, dificuldade: "medio",
          banca: prova.banca, ano: prova.ano, orgao: prova.orgao, cargo: prova.cargo,
          fonteUrl: prova.cadernoUrl, imagemUrl: q.imagemUrl ?? null, imagemAlt: q.imagemAlt ?? null,
          explicacao: "Fonte: " + prova.banca + ", " + prova.orgao + ", " + prova.ano +
            ", " + prova.cargo + ", questão " + q.numero + ". Gabarito DEFINITIVO: " +
            q.correta + ". Caderno: " + prova.cadernoUrl + " | Gabarito: " + prova.gabaritoUrl,
        })),
      });
      const ids = await tx.questao.findMany({
        where: {
          fonte: FONTE_PROVAS_REAIS, usuarioId: usuario.id,
          origemId: { in: bloco.map((q) => q.origemId) },
        },
        select: { id: true, origemId: true },
      });
      const mapa = new Map(ids.map((q) => [q.origemId, q.id]));
      if (ids.length !== bloco.length || mapa.size !== bloco.length) {
        throw new Error("[lotes-massivos] Falha na associação de questões e alternativas.");
      }
      await tx.alternativa.createMany({
        data: bloco.flatMap(({ origemId, questao: q }) => {
          const questaoId = mapa.get(origemId);
          if (!questaoId) throw new Error("[lotes-massivos] ID não encontrado: " + origemId);
          return q.alternativas.map((texto, i) => ({
            questaoId, texto: "ABCDE"[i] + ") " + texto, correta: "ABCDE"[i] === q.correta,
          }));
        }),
      });
    }, { maxWait: 10000, timeout: 60000 });
    resumo.inseridas += bloco.length;
    console.log("[lotes-massivos] Bloco gravado: " + resumo.inseridas + "/" + preparadas.length);
  }
  console.log("[lotes-massivos] RESUMO " + JSON.stringify(resumo));
  return resumo;
}
