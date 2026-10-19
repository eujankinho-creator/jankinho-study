import { prisma } from "../../lib/prisma";
import { FONTE_PROVAS_REAIS } from "./questoesOficiaisFGV2025";
/** Transcrição conferida do caderno oficial SES-MT, Enfermeiro, Tipo 1 (2024).
 * Fonte e gabarito definitivo disponíveis na página pública da FGV.
 * Os itens anulados nunca são incluídos. Importação incremental/idempotente.
 */
const PROVA = "https://conhecimento.fgv.br/sites/default/files/concursos/cns311-enfermeiro-cns311-tipo-1.pdf";
const GABARITO = "https://conhecimento.fgv.br/concursos/sesmt23";
const QUESTOES = [
  {
    "n": 1,
    "tema": "Interpretação de Textos",
    "q": "Leia o texto a seguir.\nOs homens não estão cientes do calor que emana de seu coração, embora ele dê vida e movimento a todas as outras partes do seu corpo. [...] O mesmo se dá com a vaidade: ela é tão natural para o homem que ele não a percebe. E, embora seja isso que dê, por assim dizer, vida e movimento à maioria dos seus pensamentos e desígnios, isso ocorre de um modo que é imperceptível para o sujeito. [...] Os homens não percebem que é a vaidade que dá ímpeto à maioria de suas ações.\nA respeito do significado ou da estruturação desse fragmento, assinale a afirmativa inadequada.",
    "a": [
      "O comentário inicial sobre o calor do coração serve de ponto de comparação para o papel da vaidade.",
      "A semelhança entre o calor do coração e a vaidade é que ambos são imperceptíveis para os homens.",
      "Ao indicar a vaidade como fonte da maioria das ações humanas, o autor do texto as desvaloriza.",
      "O homem deve tornar a vaidade uma força consciente para o seu progresso."
    ],
    "k": "D"
  },
  {
    "n": 2,
    "tema": "Interpretação de Textos",
    "q": "Leia o texto a seguir.\nEm seu coração, os homens desejam ser estimados, mas eles cuidadosamente ocultam esse desejo porque querem se passar por virtuosos e porque o desejo de receber da virtude qualquer vantagem além dela mesma não seria ser virtuoso, mas amar a estima e o elogio – ou seja, ser vaidoso. Os homens são muito vaidosos, mas não há nada que eles mais detestem do que serem considerados vaidosos.\nAssinale a afirmativa adequada ao seu significado ou à sua estruturação.",
    "a": [
      "A discussão no texto opõe a essência (os homens serem vaidosos) à aparência (quererem passar por virtuosos).",
      "A vaidade humana só não é vista como um defeito porque os homens fazem questão de ocultá-la.",
      "Os homens têm o desejo de serem estimados, ou seja, pretendem alcançar a estima e o elogio, sem serem motivados pela vaidade.",
      "O fato de serem considerados vaidosos faz com que a imagem pública dos homens cresça ao olhar dos outros."
    ],
    "k": "A"
  },
  {
    "n": 3,
    "tema": "Semântica e Significação",
    "q": "Assinale a opção que apresenta a frase em que os dois termos sublinhados não são antônimos.",
    "a": [
      "Juízes implacáveis são todos aqueles que antes foram réus. (implacáveis / réus)",
      "O homem não teria alcançado o possível se, repetidas vezes, não tivesse tentado o impossível. (possível / impossível)",
      "Você não será nada se quiser ser tudo. (nada / tudo)",
      "Só tenho por seguro o que é incerto. (seguro / incerto)"
    ],
    "k": "A"
  },
  {
    "n": 4,
    "tema": "Coesão e Coerência",
    "q": "Analise a frase a seguir.\nÉ claro que a justiça, sendo cega, não vê se é vista, e então não cora. (Machado de Assis)\nAs opções a seguir apresentam formas de reescrever a frase acima sem modificação do seu sentido original, à exceção de uma. Assinale-a.",
    "a": [
      "É claro que a justiça, sendo cega, não cora, já que não vê se é vista.",
      "Sendo cega, é claro que a justiça não vê se é vista, e então não cora.",
      "É claro que, sendo cega, a justiça não vê se é vista, e então não cora.",
      "É claro que a justiça não vê se é vista, e então, sendo cega, não cora."
    ],
    "k": "D"
  },
  {
    "n": 5,
    "tema": "Interpretação de Textos",
    "q": "Assinale a frase que não apresenta tom crítico.",
    "a": [
      "Nenhum homem rico é feio, dizia uma grande atriz.",
      "Mostre-me um herói e eu escreverei uma tragédia.",
      "Não é bom que o homem esteja só.",
      "Ele é a pessoa mais interessante que ele já conheceu."
    ],
    "k": "C"
  }
] as const;
export async function sincronizarFGVSES2024() {
  const usuario = await prisma.usuario.findFirst({ orderBy: { id: "asc" }, select: { id: true } });
  if (!usuario) return { inseridas: 0, existentes: 0 };
  let disciplina = await prisma.disciplina.findFirst({ where: { usuarioId: usuario.id, nome: { equals: "Língua Portuguesa", mode: "insensitive" } }, select: { id: true } });
  if (!disciplina) disciplina = await prisma.disciplina.create({ data: { usuarioId: usuario.id, nome: "Língua Portuguesa" }, select: { id: true } });
  let inseridas = 0, existentes = 0;
  for (const q of QUESTOES) {
    const origemId = "fgv-sesmt-2024-enfermeiro-tipo1-q" + String(q.n).padStart(2, "0");
    if (q.a.length !== 4 || !["A","B","C","D"].includes(q.k) || !q.q.trim()) throw new Error("[sesmt-2024] Item inválido " + q.n);
    const achou = await prisma.questao.findFirst({ where: { fonte: FONTE_PROVAS_REAIS, origemId }, select: { id: true } });
    if (achou) { existentes++; continue; }
    await prisma.questao.create({ data: {
      usuarioId: usuario.id, disciplinaId: disciplina.id, fonte: FONTE_PROVAS_REAIS,
      origemId, tema: q.tema, dificuldade: "medio", banca: "FGV", ano: 2024,
      orgao: "Secretaria de Estado de Saúde de Mato Grosso",
      cargo: "Enfermeiro — CNS311, Tipo 1", fonteUrl: PROVA, enunciado: q.q,
      explicacao: "FGV/SES-MT 2024, Enfermeiro Tipo 1, questão " + q.n +
        ". Gabarito definitivo: alternativa " + q.k + ". Caderno: " + PROVA + " | Página da banca e gabarito definitivo: " + GABARITO,
      alternativas: { create: q.a.map((texto,i) => ({ texto: "ABCD"[i] + ") " + texto, correta: "ABCD"[i] === q.k })) }
    } });
    inseridas++;
  }
  console.log("[sesmt-2024] " + inseridas + " inseridas; " + existentes + " existentes");
  return { inseridas, existentes };
}
