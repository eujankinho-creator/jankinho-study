import { prisma } from "../../lib/prisma";
import { QUESTOES_FGV_CARAGUA_2024 } from "./questoesFGVCaragua2024Conteudo";
import { FONTE_PROVAS_REAIS } from "./questoesOficiaisFGV2025";

/**
 * Importa o bloco de conteúdo específico de Enfermagem do concurso
 * Prefeitura de Caraguatatuba (Edital 03/2023, aplicado 28/01/2024).
 * Itens 31–60, exceto 37 (imagem) e 38 (anulada).
 * Nunca sobrescreve históricos e não duplica origemId.
 */
const PROVA="https://conhecimento.fgv.br/sites/default/files/concursos/cns310e3-enfermeirocns310e3-tipo-1.pdf";
const GABARITO="https://conhecimento.fgv.br/sites/default/files/concursos/caraguatatuba2024e0302_gabarito_definitivo_20240226.pdf";

export async function sincronizarFGVCaraguatatuba2024() {
  const linhas=QUESTOES_FGV_CARAGUA_2024;
  if (linhas.length!==28 ||
    linhas.some(q=>q.numero<31||q.numero>60||q.numero===37||q.numero===38||
      !q.enunciado.trim()||!q.assunto.trim()||!q.disciplina.trim()||
      !/^[A-E]$/.test(q.correta)||q.alternativas.length!==5||
      q.alternativas.map(a=>a.letra).join("")!=="ABCDE"||
      q.alternativas.some(a=>!a.texto.trim()))) {
    throw new Error("[fgv-caragua-2024] Integridade da prova não confirmada");
  }
  const usuario=await prisma.usuario.findFirst({
    orderBy:{id:"asc"},select:{id:true}
  });
  if(!usuario) return {inseridas:0,existentes:0};

  const disciplinas=new Map<string,number>();
  let inseridas=0,existentes=0;
  for(const q of linhas) {
    const origemId="fgv-caraguatatuba-2024-enfermeiro-tipo1-q"+
      String(q.numero).padStart(2,"0");
    const anterior=await prisma.questao.findFirst({
      where:{fonte:FONTE_PROVAS_REAIS,origemId},select:{id:true}
    });
    if(anterior){existentes++;continue;}
    let disciplinaId=disciplinas.get(q.disciplina);
    if(!disciplinaId){
      let disciplina=await prisma.disciplina.findFirst({
        where:{usuarioId:usuario.id,nome:{equals:q.disciplina,mode:"insensitive"}},
        select:{id:true}
      });
      if(!disciplina)disciplina=await prisma.disciplina.create({
        data:{usuarioId:usuario.id,nome:q.disciplina},select:{id:true}
      });
      disciplinaId=disciplina.id;
      disciplinas.set(q.disciplina,disciplinaId);
    }
    await prisma.questao.create({
      data:{
        usuarioId:usuario.id,disciplinaId,fonte:FONTE_PROVAS_REAIS,origemId,
        tema:q.assunto,dificuldade:"medio",banca:"FGV",
        orgao:"Prefeitura de Caraguatatuba",ano:2024,
        cargo:"Enfermeiro — Edital 03/2023, Tipo 1",
        fonteUrl:PROVA,enunciado:q.enunciado,
        explicacao:"FGV, Prefeitura de Caraguatatuba, Concurso Edital 03/2023, "+
          "prova de Enfermeiro Tipo 1 aplicada em 28/01/2024, questão "+
          q.numero+". Gabarito DEFINITIVO: alternativa "+q.correta+
          ". Enunciado original reproduzido com autorização informada pelo "+
          "responsável do Córtex. Prova: "+PROVA+" | Gabarito: "+GABARITO,
        alternativas:{create:q.alternativas.map(a=>({
          texto:a.letra+") "+a.texto,correta:a.letra===q.correta
        }))}
      }
    });
    inseridas++;
  }
  console.log("[fgv-caragua-2024] Enfermeiro Tipo 1: "+inseridas+
    " novas questões; "+existentes+" existentes; Q37 imagem e Q38 anulada excluídas.");
  return {inseridas,existentes};
}
