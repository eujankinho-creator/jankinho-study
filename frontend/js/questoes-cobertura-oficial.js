(function () {
"use strict";
const root=document.getElementById("officialCoverage");
if(!root) return;

const prova="https://conhecimento.fgv.br/sites/default/files/concursos/grupo-4-enfermageme3cnsgp04-tipo-1.pdf";
const gabarito="https://conhecimento.fgv.br/sites/default/files/concursos/ebserrhassistencial2024_gabarito_definitivo.pdf";
/* Índice DOCUMENTAL (não transcrição de questões):
   FGV / EBSERH / Enfermagem / 2025 / caderno tipo 1 (60 questões).
   Título = resumo temático editorial, NUNCA enunciado da banca.
   Conferência: número e página do caderno oficial + gabarito definitivo.
   Não constitui inserção de questão original respondível no banco. */
const referencias = [
 [16,4,"Controle Social no SUS","Conselhos e conferências de saúde"],
 [17,5,"Revisão Geral do SUS","História e construção do SUS"],
 [18,5,"Revisão Geral do SUS","História da vacinação no Brasil"],
 [19,5,"Determinação Social da Saúde","Determinação social do processo saúde-doença"],
 [22,6,"Ética e Legislação em Enfermagem","Bioética e pesquisa em seres humanos"],
 [23,6,"Atenção Primária à Saúde","Funções e atributos da atenção primária"],
 [24,6,"Atenção Primária à Saúde","Humanização do cuidado no SUS"],
 [25,6,"Atenção Primária à Saúde","Estratégia Saúde da Família"],
 [26,7,"Gestão em Enfermagem","Política Nacional de Atenção Hospitalar"],
 [27,7,"Ética e Legislação em Enfermagem","Direitos e deveres de usuários dos serviços de saúde"],
 [28,7,"Redes de Atenção à Saúde","Estrutura e organização das redes de atenção"],
 [29,7,"Saúde do Trabalhador","Princípios de atenção à saúde do trabalhador"],
 [30,7,"Epidemiologia e Vigilância em Saúde","Política Nacional de Saúde Integral da População Negra"],
 [31,8,"Imunização","Calendário vacinal e vacina rotavírus"],
 [32,8,"Epidemiologia e Vigilância em Saúde","Vigilância e prevenção da influenza"],
 [33,8,"Saúde Mental","Atenção psicossocial e transtorno do espectro autista"],
 [34,9,"Saúde Mental","Cuidados de enfermagem em saúde mental"],
 [35,9,"Saúde da Criança e do Adolescente","Caderneta da Criança e avaliação antropométrica"],
 [36,9,"Saúde da Mulher","Rede Alyne e atenção materno-infantil"],
 [37,10,"Saúde da Mulher","Assistência humanizada ao parto"],
 [38,10,"Saúde da Mulher","Aleitamento materno e cuidados de enfermagem"],
 [39,10,"Saúde do Adulto","Profilaxia pós-exposição e IST"],
 [40,11,"Epidemiologia e Vigilância em Saúde","Impactos de desastres e eventos climáticos na saúde"],
 [41,11,"Lei 8.080/1990 - Organização e Competências","Objetivos e atribuições do SUS"],
 [42,11,"Gestão em Enfermagem","Auditoria e qualidade da assistência"],
 [43,12,"Urgência e Emergência","Traumatismo cranioencefálico e avaliação neurológica"],
 [44,12,"Saúde do Adulto","Assistência oncológica e modalidades de tratamento"],
 [46,12,"Saúde do Adulto","Hemodiálise e cuidados com a fístula arteriovenosa"],
 [47,13,"Urgência e Emergência","Avaliação de paciente com dor torácica"],
 [48,13,"Ética e Legislação em Enfermagem","Atuação da enfermagem em transplantes"],
 [49,13,"Gestão em Enfermagem","Dimensionamento de equipe de enfermagem"],
 [50,13,"Gerenciamento de Resíduos de Serviços de Saúde (GRSS)","RDC 222/2018 e resíduos de serviços de saúde"],
 [51,14,"Processo de Enfermagem e SAE","Etapa de evolução do Processo de Enfermagem"],
 [52,14,"Processo de Enfermagem e SAE","Planejamento no Processo de Enfermagem"],
 [53,14,"Centro Cirúrgico","Assistência no período transoperatório"],
 [54,14,"Fundamentos e Semiotécnica","Padrões respiratórios e avaliação clínica"],
 [55,14,"Saúde do Adulto","Doença renal crônica e cuidados de enfermagem"],
 [56,14,"Controle de Infecção e Biossegurança","Prevenção de infecção associada a cateter"]
].map(([numero,pagina,assunto,resumo])=>({
 numero,pagina,assunto,resumo,
 banca:"FGV",instituicao:"EBSERH",ano:2025,
 prova:prova+"#page="+pagina,gabarito
}));

const $=id=>document.getElementById(id);
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=x=>String(x||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
let dados=null;
function refsPara(assunto){
 const n=norm(assunto);
 const pontos=referencias.filter(item=>norm(item.assunto)===n);
 // Não expande assunto por semelhança fraca para evitar falsas atribuições.
 return pontos;
}
function render(){
 if(!dados) return;
 const needle=norm($("officialCoverageSearch").value);
 const disciplina=$("officialCoverageDiscipline").value;
 const linhas=dados.itens.map(item=>({...item,refs:refsPara(item.assunto)}))
  .filter(item=>(!disciplina||(item.disciplinas||[item.disciplina]).includes(disciplina))&&
    (!needle||norm(item.assunto+" "+item.disciplina).includes(needle)))
  .sort((a,b)=>b.refs.length-a.refs.length ||
    a.disciplina.localeCompare(b.disciplina,"pt-BR") ||
    a.assunto.localeCompare(b.assunto,"pt-BR"));
 $("officialCoverageCount").textContent=linhas.length+" assunto(s) exibido(s) · "+
   referencias.length+" questões originais catalogadas; os itens incorporados são respondidos no próprio Córtex.";
 $("officialCoverageList").innerHTML=linhas.map(item=>{
  const n=Math.min(item.meta,item.originaisVerificadas);
  const refs=item.refs.slice(0,5).map(q=>
   '<span class="official-reference-tag" title="'+esc(q.resumo)+'">FGV/EBSERH 2025 · Q'+q.numero+'</span>'
 ).join("");
  return '<article class="official-coverage-item"><small>'+esc((item.disciplinas||[item.disciplina]).join(" · "))+'</small>'+
  '<strong>'+esc(item.assunto)+'</strong>'+
  '<small>'+n+' / '+item.meta+' originais incorporadas · '+item.totalBanco+' questões totais no banco</small>'+
  '<progress value="'+n+'" max="'+item.meta+'"></progress>'+
  (item.refs.length ? '<small>'+item.refs.length+' referência(s) documentais desta prova:</small>'+
   '<div class="official-coverage-ref">'+refs+'</div>' :
   '<small>Sem referência individual indexada neste lote. A pesquisa continuará por outras provas.</small>')+
  '</article>';
 }).join("")||'<p>Nenhum assunto corresponde aos filtros.</p>';
}
async function carregar(){
 try{
  const r=await fetch("/api/questoes/cobertura-oficial",{credentials:"same-origin",cache:"no-store"});
  if(!r.ok)throw Error("HTTP "+r.status);
  dados=await r.json();
  if(!Array.isArray(dados.itens))throw Error("Resposta inválida");
  $("officialCoverageStats").textContent=dados.questoesVerificadas+" / "+dados.metaTotal+" questões originais validadas";
  const disciplinas=[...new Set(dados.itens.flatMap(x=>x.disciplinas||[x.disciplina]))].sort((a,b)=>a.localeCompare(b,"pt-BR"));
  $("officialCoverageDiscipline").innerHTML='<option value="">Todas as disciplinas</option>'+
   disciplinas.map(d=>'<option value="'+esc(d)+'">'+esc(d)+'</option>').join("");
  render();
 }catch(e){
  $("officialCoverageStats").textContent="Cobertura temporariamente indisponível";
  $("officialCoverageCount").textContent="Não foi possível consultar o inventário da sua conta.";
  console.warn("[questoes-oficiais] cobertura:",e);
 }
}
$("officialCoverageSearch").addEventListener("input",render);
$("officialCoverageDiscipline").addEventListener("change",render);
void carregar();
})();
