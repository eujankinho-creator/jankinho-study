import { prisma } from "../../lib/prisma";

/**
 * Questões ORIGINAIS verificadas no caderno oficial FGV/EBSERH 2025,
 * grupo Enfermagem, Tipo 1 (prova 16/03/2025). Não transcrevemos o
 * enunciado protegido: aluno lê no PDF da banca e responde A-E aqui.
 *
 * Fontes primárias:
 * Caderno: https://conhecimento.fgv.br/sites/default/files/concursos/grupo-4-enfermageme3cnsgp04-tipo-1.pdf
 * Gabarito DEFINITIVO, pág. 13, Enfermagem Tipo 1:
 * https://conhecimento.fgv.br/sites/default/files/concursos/ebserrhassistencial2024_gabarito_definitivo.pdf#page=13
 * Questão 36 anulada no gabarito definitivo, não é adicionada.
 */
export const FONTE_PROVAS_REAIS = "cortex-prova-original-verificada-v1";
const URL_PROVA = "https://conhecimento.fgv.br/sites/default/files/concursos/grupo-4-enfermageme3cnsgp04-tipo-1.pdf";
const URL_GABARITO = "https://conhecimento.fgv.br/sites/default/files/concursos/ebserrhassistencial2024_gabarito_definitivo.pdf#page=13";
const CHAVES = (
  "B D E A A E B A D C E D C C A D A B E C " +
  "D C E C B A D E B C A D B C E * C A E D " +
  "C B A D B E E C E A A B C D E A B C D E"
).split(" ");

type Registro = { disciplina: string; assunto: string; resumo: string };
const D = (disciplina: string, assunto: string, resumo: string): Registro => ({ disciplina, assunto, resumo });
const ITENS: Registro[] = [
  D("Língua Portuguesa","Interpretação de Textos","Finalidade comunicativa do texto"),
  D("Língua Portuguesa","Interpretação de Textos","Inferências textuais"),
  D("Língua Portuguesa","Coesão e Coerência","Referência e coesão textual"),
  D("Língua Portuguesa","Semântica e Significação","Referência temporal e interpretação"),
  D("Língua Portuguesa","Coordenação e Subordinação","Equivalência de orações"),
  D("Língua Portuguesa","Semântica e Significação","Reescrita e preservação de sentido"),
  D("Língua Portuguesa","Interpretação de Textos","Argumentação em texto publicitário"),
  D("Língua Portuguesa","Regência Verbal e Nominal","Regência do verbo esquecer"),
  D("Língua Portuguesa","Coesão e Coerência","Relações lógicas entre frases"),
  D("Língua Portuguesa","Semântica e Significação","Valores semânticos de adjetivos"),
  D("Legislação da EBSERH","Lei 12.550/2011","Finalidades da Ebserh"),
  D("Legislação da EBSERH","Regimento Interno","Colegiados internos"),
  D("Legislação da EBSERH","Lei 12.550/2011","Regras de pessoal da Ebserh"),
  D("Legislação da EBSERH","Estatuto Social","Conselho de Administração"),
  D("Legislação da EBSERH","Ética Institucional","Comissão de Ética da Ebserh"),
  D("Legislação do SUS","Controle Social no SUS","Conselhos e conferências de saúde"),
  D("Legislação do SUS","Constituição Federal - Saúde","Construção histórica do SUS e universalidade"),
  D("Enfermagem","Imunização","Revolta da Vacina e saúde pública"),
  D("Saúde Coletiva I","Determinação Social da Saúde","Determinação social do processo saúde-doença"),
  D("Enfermagem","Gestão em Enfermagem","Blockchain e rastreabilidade de informações em saúde"),
  D("Legislação do SUS","Constituição Federal - Saúde","Regulação do SUS e saúde suplementar"),
  D("Enfermagem","Ética e Legislação em Enfermagem","Bioética e edição genética"),
  D("Enfermagem","Atenção Primária à Saúde","Atribuições e funções da APS"),
  D("Enfermagem","Atenção Primária à Saúde","Política Nacional de Humanização"),
  D("Enfermagem","Atenção Primária à Saúde","Estratégia Saúde da Família e território"),
  D("Enfermagem","Gestão em Enfermagem","Política Nacional de Atenção Hospitalar"),
  D("Enfermagem","Ética e Legislação em Enfermagem","Direitos do usuário no atendimento"),
  D("Legislação do SUS","Redes de Atenção à Saúde","Organização das RAS"),
  D("Enfermagem","Saúde do Trabalhador","Princípios de saúde do trabalhador"),
  D("Enfermagem","Epidemiologia e Vigilância em Saúde","Política Nacional da Saúde da População Negra"),
  D("Enfermagem","Imunização","Vacina rotavírus e calendário vacinal"),
  D("Enfermagem","Epidemiologia e Vigilância em Saúde","Influenza e vigilância epidemiológica"),
  D("Enfermagem","Saúde Mental","Acompanhamento de pessoas com TEA"),
  D("Enfermagem","Saúde Mental","Cuidado de enfermagem em saúde mental"),
  D("Enfermagem","Saúde da Criança e do Adolescente","Caderneta da criança e antropometria"),
  D("Enfermagem","Saúde da Mulher","Rede Alyne e atenção materno-infantil"), // ANULADA
  D("Enfermagem","Saúde da Mulher","Cuidados e boas práticas durante o parto"),
  D("Enfermagem","Saúde da Mulher","Aleitamento materno"),
  D("Enfermagem","Saúde do Adulto","PEP e IST"),
  D("Enfermagem","Epidemiologia e Vigilância em Saúde","Desastres, clima e saúde"),
  D("Legislação do SUS","Lei 8.080/1990 - Organização e Competências","Objetivos e atribuições do SUS"),
  D("Enfermagem","Gestão em Enfermagem","Auditoria de enfermagem"),
  D("Enfermagem","Urgência e Emergência","Traumatismo cranioencefálico e Escala de Glasgow"),
  D("Enfermagem","Saúde do Adulto","Assistência a pacientes oncológicos"),
  D("Enfermagem","Urgência e Emergência","Diretrizes de SBV e SAVC"),
  D("Enfermagem","Saúde do Adulto","Cuidados com fístula arteriovenosa"),
  D("Enfermagem","Urgência e Emergência","Avaliação de dor torácica aguda"),
  D("Enfermagem","Ética e Legislação em Enfermagem","Cofen e atuação no processo de transplantes"),
  D("Enfermagem","Gestão em Enfermagem","Dimensionamento de pessoal"),
  D("Enfermagem","Gerenciamento de Resíduos de Serviços de Saúde (GRSS)","RDC 222/2018 e resíduos"),
  D("Enfermagem","Processo de Enfermagem e SAE","Evolução no Processo de Enfermagem"),
  D("Enfermagem","Processo de Enfermagem e SAE","Planejamento e prescrição de enfermagem"),
  D("Enfermagem","Centro Cirúrgico","Ações do período transoperatório"),
  D("Enfermagem","Fundamentos e Semiotécnica","Padrão respiratório de Cheyne-Stokes"),
  D("Enfermagem","Saúde do Adulto","Cuidado na doença renal crônica"),
  D("Enfermagem","Controle de Infecção e Biossegurança","Flushing de cateter e prevenção de infecção"),
  D("Enfermagem","Controle de Infecção e Biossegurança","Precauções por vias de transmissão"),
  D("Enfermagem","Centro de Material e Esterilização (CME)","RDC 15/2012 e monitoramento da esterilização"),
  D("Enfermagem","Saúde do Idoso","Síndrome de fragilidade no idoso"),
  D("Enfermagem","Fundamentos e Semiotécnica","Foco de ausculta da válvula mitral"),
];
// 60 itens / chaves em ordem do documento.
if (ITENS.length !== 60 || CHAVES.length !== 60) {
  throw new Error("FGV 2025: índice ou gabarito incompleto");
}

function pagina(numero: number): number {
  if (numero <= 6) return 2;
  if (numero <= 12) return 3;
  if (numero <= 16) return 4;
  if (numero <= 20) return 5;
  if (numero <= 25) return 6;
  if (numero <= 30) return 7;
  if (numero <= 33) return 8;
  if (numero <= 36) return 9;
  if (numero <= 39) return 10;
  if (numero <= 42) return 11;
  if (numero <= 46) return 12;
  if (numero <= 50) return 13;
  if (numero <= 56) return 14;
  return 15;
}

export async function sincronizarProvasOficiaisFGV2025() {
  const usuario = await prisma.usuario.findFirst({
    orderBy: { id: "asc" }, select: { id: true },
  });
  if (!usuario) {
    console.warn("[provas-oficiais] Nenhum usuário encontrado para o acervo compartilhado.");
    return { inseridas: 0, existentes: 0 };
  }

  let inseridas = 0, existentes = 0;
  const disciplinas = new Map<string, number>();
  for (const [idx, item] of ITENS.entries()) {
    const numero = idx + 1, correta = CHAVES[idx];
    if (correta === "*") continue;
    const origemId = "fgv-ebserh-2025-grupo-enfermagem-tipo1-q" + String(numero).padStart(2, "0");
    const existente = await prisma.questao.findFirst({
      where: { fonte: FONTE_PROVAS_REAIS, origemId },
      select: { id: true },
    });
    if (existente) { existentes++; continue; }

    let disciplinaId = disciplinas.get(item.disciplina);
    if (!disciplinaId) {
      let d = await prisma.disciplina.findFirst({
        where: { usuarioId: usuario.id, nome: { equals: item.disciplina, mode: "insensitive" } },
        select: { id: true },
      });
      if (!d) d = await prisma.disciplina.create({
        data: { usuarioId: usuario.id, nome: item.disciplina },
        select: { id: true },
      });
      disciplinaId = d.id;
      disciplinas.set(item.disciplina, disciplinaId);
    }

    await prisma.questao.create({
      data: {
        usuarioId: usuario.id, disciplinaId,
        fonte: FONTE_PROVAS_REAIS, origemId,
        tema: item.assunto, dificuldade: "medio",
        banca: "FGV", orgao: "EBSERH",
        ano: 2025, cargo: "Grupo Enfermagem — Tipo 1",
        fonteUrl: URL_PROVA + "#page=" + pagina(numero),
        enunciado:
          "QUESTÃO OFICIAL Nº " + numero + " — FGV / EBSERH 2025 — GRUPO ENFERMAGEM, TIPO 1.\n" +
          "Assunto: " + item.resumo + ".\n" +
          "Abra o caderno oficial pelo link 'Questão original' abaixo e leia o enunciado e as cinco alternativas na página " +
          pagina(numero) + ". Depois marque aqui a letra que você considera correta. " +
          "A redação integral permanece no site da banca.",
        explicacao:
          "Resposta conforme o GABARITO DEFINITIVO publicado pela FGV: alternativa " + correta +
          ". Caderno nº " + numero + " (Tipo 1), página " + pagina(numero) +
          ". Verifique o gabarito na fonte: " + URL_GABARITO +
          ". O Córtex não reproduz nem atribui autoria do enunciado à plataforma.",
        alternativas: { create: ["A","B","C","D","E"].map(letra => ({
          texto: "Alternativa " + letra + " — leia o texto correspondente no caderno oficial da FGV",
          correta: letra === correta,
        })) },
      },
    });
    inseridas++;
  }
  console.log("[provas-oficiais] FGV/EBSERH 2025 Tipo 1: " + inseridas +
    " inseridas; " + existentes + " existentes; Q36 anulada ignorada.");
  return { inseridas, existentes };
}
