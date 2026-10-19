import { prisma } from "../../lib/prisma";
import { QUESTOES_FGV_CANAA_2025 } from "./questoesFGVCanaa2025Conteudo";
import { FONTE_PROVAS_REAIS } from "./questoesOficiaisFGV2025";

/** Questões oficiais FGV Canaã dos Carajás, enfermeiro Tipo 1,
 * 06/04/2025: itens 31..60 SUS/Enfermagem, gabarito definitivo.
 * Origem única para atualização idempotente (não duplica).
 */
const PROVA = "https://conhecimento.fgv.br/sites/default/files/concursos/enfermeirocns201-tipo-1_1.pdf";
const GABARITO = "https://conhecimento.fgv.br/sites/default/files/concursos/prefcanaa202403_gabarito_definitivo-compilado-06.04_0.pdf";

export async function sincronizarFGVCanaaEnfermagem2025() {
  const questoes = QUESTOES_FGV_CANAA_2025;
  if(questoes.length!==30 || new Set(questoes.map(q=>q.numero)).size!==30 ||
     questoes.some(q=>q.numero<31||q.numero>60||!q.enunciado.trim()||
       !q.disciplina.trim()||!q.assunto.trim()||!/^[A-E]$/.test(q.correta)||
       q.alternativas.length!==5||q.alternativas.map(a=>a.letra).join("")!=="ABCDE"||
       q.alternativas.some(a=>!a.texto.trim())||
       q.alternativas.filter(a=>a.letra===q.correta).length!==1)) {
    throw new Error("[fgv-canaa-2025] Prova/gabarito sem integridade");
  }
  const usuario=await prisma.usuario.findFirst({orderBy:{id:"asc"},select:{id:true}});
  if(!usuario){console.warn("[fgv-canaa-2025] Usuário base inexistente");return {inseridas:0,existentes:0};}
  const disciplinas=new Map<string,number>();let inseridas=0,existentes=0;
  for(const q of questoes){
    const origemId="fgv-canaa-2025-enfermeiro-tipo1-q"+String(q.numero).padStart(2,"0");
    const anterior=await prisma.questao.findFirst({
      where:{fonte:FONTE_PROVAS_REAIS,origemId},select:{id:true}
    });
    if(anterior){existentes++;continue;}
    let disciplinaId=disciplinas.get(q.disciplina);
    if(!disciplinaId){
      let d=await prisma.disciplina.findFirst({
        where:{usuarioId:usuario.id,nome:{equals:q.disciplina,mode:"insensitive"}},
        select:{id:true}
      });
      if(!d)d=await prisma.disciplina.create({
        data:{usuarioId:usuario.id,nome:q.disciplina},select:{id:true}
      });
      disciplinaId=d.id;disciplinas.set(q.disciplina,disciplinaId);
    }
    await prisma.questao.create({data:{
      usuarioId:usuario.id,disciplinaId,fonte:FONTE_PROVAS_REAIS,origemId,
      tema:q.assunto,dificuldade:"medio",banca:"FGV",
      orgao:"Prefeitura Municipal de Canaã dos Carajás",ano:2025,
      cargo:"Enfermeiro — Edital 01/2024, Tipo 1",
      fonteUrl:PROVA,enunciado:q.enunciado,
      explicacao:"Gabarito DEFINITIVO FGV, Prefeitura Municipal de Canaã dos Carajás/PA,"+
        " Edital 01/2024, prova Enfermeiro Tipo 1 de 06/04/2025. Questão "+
        q.numero+": alternativa "+q.correta+". Original reproduzido conforme autorização"+
        " informada pelo responsável do Córtex. Prova: "+PROVA+" | Gabarito: "+GABARITO,
      alternativas:{create:q.alternativas.map(a=>({
        texto:a.letra+") "+a.texto,correta:a.letra===q.correta
      }))}
    }});
    inseridas++;
  }
  console.log("[fgv-canaa-2025] Enfermeiro Tipo 1: "+inseridas+
    " questões inseridas; "+existentes+" existentes. Bloco 31 a 60.");
  return {inseridas,existentes};
}
