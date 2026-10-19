import { prisma } from "../../lib/prisma";
import { FONTE_PROVAS_REAIS } from "./questoesOficiaisFGV2025";
import { QUESTOES_FGV_ABREU_TECNICO_2024 } from "./questoesFGVAbreuTecnico2024Conteudo";
import { QUESTOES_FGV_ALERJ_2026 } from "./questoesFGVAlerj2026Conteudo";
import { QUESTOES_FGV_MPU_ANALISTA_2025 } from "./questoesFGVMPUAnalista2025Conteudo";
import { QUESTOES_FGV_MPU_TECNICO_2025 } from "./questoesFGVMPUTecnico2025Conteudo";
import { QUESTOES_FGV_SJC2025_ANALISTA } from "./questoesFGVSJC2025AnalistaConteudo";
import { QUESTOES_FGV_SJC2025_TECNICO } from "./questoesFGVSJC2025TecnicoConteudo";

/** Lote incremental: fontes primárias FGV e gabaritos definitivos.
 * Enunciados/alternativas da prova autorizados conforme declaração do
 * responsável Córtex. No boot, apenas adiciona itens com origemId novo.
 * Preserva alternativas/respostas já existentes.
 */
const LOTES = [
  { nome:"abreu-tecnico-2024",itens:QUESTOES_FGV_ABREU_TECNICO_2024,tamanho:31,ano:2024,
    orgao:"Prefeitura Municipal de Abreu e Lima",
    cargo:"Técnico em Enfermagem — Edital 02/2024, Tipo 1",
    prova:"https://conhecimento.fgv.br/sites/default/files/concursos/tecnico-em-enfermagemcnm100-tipo-1_0.pdf",
    gabarito:"https://conhecimento.fgv.br/sites/default/files/concursos/pref_abreuelima_gabarito_definitivo_da0a4fs131.pdf",
  },
  { nome:"alerj-2026",itens:QUESTOES_FGV_ALERJ_2026,tamanho:24,ano:2026,
    orgao:"Assembleia Legislativa do Estado do Rio de Janeiro - ALERJ",
    cargo:"Especialista Legislativo IV — Saúde (Enfermagem), Tipo 1",
    prova:"https://conhecimento.fgv.br/sites/default/files/concursos/cns102-especialista-legislativo-nivel-iv-saude-enfermagem-cns102-tipo-1.pdf",
    gabarito:"https://conhecimento.fgv.br/sites/default/files/concursos/especialista-alerj-gabarito-definitivo.pdf",
  },
  { nome:"mpu-analista-2025",itens:QUESTOES_FGV_MPU_ANALISTA_2025,tamanho:28,ano:2025,
    orgao:"Ministério Público da União - MPU",
    cargo:"Analista do MPU — Enfermagem, Edital 01/2025, Tipo 1",
    prova:"https://conhecimento.fgv.br/sites/default/files/concursos/a08-analista-do-mpu-enfermagema08-tipo-1.pdf",
    gabarito:"https://conhecimento.fgv.br/sites/default/files/concursos/mpu-gabarito-definitivo.pdf",
  },
  { nome:"mpu-tecnico-2025",itens:QUESTOES_FGV_MPU_TECNICO_2025,tamanho:25,ano:2025,
    orgao:"Ministério Público da União - MPU",
    cargo:"Técnico do MPU — Enfermagem, Edital 01/2025, Tipo 1",
    prova:"https://conhecimento.fgv.br/sites/default/files/concursos/t02-tecnico-do-mpu-enfermagemt02-tipo-1.pdf",
    gabarito:"https://conhecimento.fgv.br/sites/default/files/concursos/mpu-gabarito-definitivo.pdf",
  },
  { nome:"sjc-analista-2025",itens:QUESTOES_FGV_SJC2025_ANALISTA,tamanho:32,ano:2025,
    orgao:"Prefeitura Municipal de São José dos Campos",
    cargo:"Analista em Saúde — Enfermagem, Edital 01/2025, Tipo 1",
    prova:"https://conhecimento.fgv.br/sites/default/files/concursos/analista-em-saude-enfermagemcns201-tipo-1.pdf",
    gabarito:"https://conhecimento.fgv.br/sites/default/files/concursos/gabarito-definitovo-prefeitura-de-sjc.pdf",
  },
  { nome:"sjc-tecnico-2025",itens:QUESTOES_FGV_SJC2025_TECNICO,tamanho:22,ano:2025,
    orgao:"Prefeitura Municipal de São José dos Campos",
    cargo:"Assistente Técnico em Saúde — Técnico em Enfermagem, Edital 01/2025, Tipo 1",
    prova:"https://conhecimento.fgv.br/sites/default/files/concursos/assistente-tecnico-em-saude-tecnico-de-enfermagemcnm101-tipo-1.pdf",
    gabarito:"https://conhecimento.fgv.br/sites/default/files/concursos/gabarito-definitovo-prefeitura-de-sjc.pdf",
  },
];

export async function sincronizarFGVLotesComplementares() {
  const usuario=await prisma.usuario.findFirst({orderBy:{id:"asc"},select:{id:true}});
  if(!usuario){console.warn("[fgv-complementares] Sem usuário-base");return {inseridas:0,existentes:0};}
  let inseridas=0,existentes=0;
  const disciplinas=new Map<string,number>();
  for(const lote of LOTES){
    if(lote.itens.length!==lote.tamanho||
       new Set(lote.itens.map(q=>q.numero)).size!==lote.tamanho||
       lote.itens.some(q=>!q.disciplina.trim()||!q.assunto.trim()||
         !q.enunciado.trim()||!/^[A-E]$/.test(q.correta)||
         q.alternativas.length!==5||q.alternativas.map(a=>a.letra).join("")!=="ABCDE"||
         q.alternativas.some(a=>!a.texto.trim())||
         q.alternativas.filter(a=>a.letra===q.correta).length!==1))
       throw new Error("[fgv-complementares] Integridade falhou: "+lote.nome);
    for(const q of lote.itens){
      const origemId="fgv-"+lote.nome+"-tipo1-q"+String(q.numero).padStart(2,"0");
      const existe=await prisma.questao.findFirst({
        where:{fonte:FONTE_PROVAS_REAIS,origemId},select:{id:true},
      });
      if(existe){existentes++;continue;}
      let disciplinaId=disciplinas.get(q.disciplina);
      if(!disciplinaId){
        let disc=await prisma.disciplina.findFirst({
          where:{usuarioId:usuario.id,nome:{equals:q.disciplina,mode:"insensitive"}},
          select:{id:true},
        });
        if(!disc)disc=await prisma.disciplina.create({
          data:{usuarioId:usuario.id,nome:q.disciplina},select:{id:true},
        });
        disciplinaId=disc.id;disciplinas.set(q.disciplina,disciplinaId);
      }
      await prisma.questao.create({data:{
        usuarioId:usuario.id,disciplinaId,fonte:FONTE_PROVAS_REAIS,origemId,
        tema:q.assunto,dificuldade:"medio",banca:"FGV",orgao:lote.orgao,
        ano:lote.ano,cargo:lote.cargo,fonteUrl:lote.prova,enunciado:q.enunciado,
        explicacao:"FGV — "+lote.orgao+" — "+lote.cargo+" — questão "+
          q.numero+". Gabarito DEFINITIVO: alternativa "+q.correta+
          ". Reprodução autorizada conforme declaração do responsável pelo Córtex. "+
          "Caderno: "+lote.prova+" | Gabarito: "+lote.gabarito,
        alternativas:{create:q.alternativas.map(a=>({
          texto:a.letra+") "+a.texto,correta:a.letra===q.correta,
        }))},
      }});
      inseridas++;
    }
  }
  console.log("[fgv-complementares] "+inseridas+" novas questões (31 Abreu Técnico / 24 ALERJ / 28 MPU Analista / 25 MPU Técnico / 32 SJC Analista / 22 SJC Técnico); "+
    existentes+" existentes.");
  return {inseridas,existentes};
}
