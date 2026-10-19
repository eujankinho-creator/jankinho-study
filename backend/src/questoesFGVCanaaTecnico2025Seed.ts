import { prisma } from "../../lib/prisma";
import { QUESTOES_FGV_CANAA_TECNICO_2025 } from "./questoesFGVCanaaTecnico2025Conteudo";
import { FONTE_PROVAS_REAIS } from "./questoesOficiaisFGV2025";

/** FGV Canaã dos Carajás/PA, Técnico em Enfermagem, Edital 01/2024,
 * Tipo 1, aplicada em 13/04/2025. Questões específicas 31-50.
 * Registro idempotente por origemId, apenas com fonte e gabarito definitivo.
 */
const PROVA="https://conhecimento.fgv.br/sites/default/files/concursos/agente-de-servicos-tecnicos-em-enfermagemcnt104-tipo-1.pdf";
const GABARITO="https://conhecimento.fgv.br/sites/default/files/concursos/canaa-dos-carajas-gabarito-definitivo-compilado-13.04_0.pdf";
export async function sincronizarFGVCanaaTecnico2025(){
  const itens=QUESTOES_FGV_CANAA_TECNICO_2025;
  if(itens.length!==20 || new Set(itens.map(x=>x.numero)).size!==20 ||
    itens.some(x=>x.numero<31||x.numero>50||!x.disciplina.trim()||
      !x.assunto.trim()||!x.enunciado.trim()||!/^[A-E]$/.test(x.correta)||
      x.alternativas.length!==5||x.alternativas.map(a=>a.letra).join("")!=="ABCDE"||
      x.alternativas.some(a=>!a.texto.trim())||
      x.alternativas.filter(a=>a.letra===x.correta).length!==1))
    throw new Error("[fgv-canaa-tecnico-2025] Caderno ou gabarito inconsistente");

  const user=await prisma.usuario.findFirst({orderBy:{id:"asc"},select:{id:true}});
  if(!user){console.warn("[fgv-canaa-tecnico-2025] Acervo sem usuário base");return {inseridas:0,existentes:0};}
  const disciplinas=new Map<string,number>();let inseridas=0,existentes=0;
  for(const item of itens){
    const origemId="fgv-canaa-2025-tecnico-enfermagem-tipo1-q"+String(item.numero).padStart(2,"0");
    const presente=await prisma.questao.findFirst({where:{fonte:FONTE_PROVAS_REAIS,origemId},select:{id:true}});
    if(presente){existentes++;continue;}
    let disciplinaId=disciplinas.get(item.disciplina);
    if(!disciplinaId){
      let d=await prisma.disciplina.findFirst({where:{
        usuarioId:user.id,nome:{equals:item.disciplina,mode:"insensitive"}},select:{id:true}});
      if(!d)d=await prisma.disciplina.create({data:{usuarioId:user.id,nome:item.disciplina},select:{id:true}});
      disciplinaId=d.id;disciplinas.set(item.disciplina,disciplinaId);
    }
    await prisma.questao.create({data:{
      usuarioId:user.id,disciplinaId,fonte:FONTE_PROVAS_REAIS,origemId,
      tema:item.assunto,dificuldade:"medio",banca:"FGV",
      orgao:"Prefeitura Municipal de Canaã dos Carajás",
      ano:2025,cargo:"Técnico em Enfermagem — Edital 01/2024, Tipo 1",
      fonteUrl:PROVA,enunciado:item.enunciado,
      explicacao:"FGV, Prefeitura Municipal de Canaã dos Carajás/PA, Edital 01/2024."+
        " Prova de Técnico em Enfermagem Tipo 1 aplicada em 13/04/2025, questão "+
        item.numero+". Gabarito definitivo: "+item.correta+
        ". Reprodução autorizada conforme informação do responsável do Córtex."+
        " Prova: "+PROVA+" | Gabarito: "+GABARITO,
      alternativas:{create:item.alternativas.map(a=>({
        texto:a.letra+") "+a.texto,correta:a.letra===item.correta
      }))}
    }});
    inseridas++;
  }
  console.log("[fgv-canaa-tecnico-2025] "+inseridas+
    " questões inseridas; "+existentes+" existentes (Tipo 1, 31-50).");
  return {inseridas,existentes};
}
