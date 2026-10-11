(function(){
"use strict";
const $=id=>document.getElementById(id);
const library=$("officialExamLibrary");if(!library)return;
/* Curadoria inicial de fontes verificadas; cada item leva à fonte primária, não a uma cópia não autorizada. */
const exams=[
 {kind:"ENARE",board:"HU Brasil",year:"Edições anteriores",title:"ENARE — residência multiprofissional e uniprofissional",org:"HU Brasil / Ministério da Educação",url:"https://www.gov.br/ebserh/pt-br/ensino-e-pesquisa/exame-nacional-de-residencia-enare",topics:["Enfermagem","SUS","Saúde Coletiva","Epidemiologia","Ética","Semiologia","Residência"],note:"Portal oficial com acesso a edições anteriores; verificar o caderno e gabarito da especialidade desejada."},
 {kind:"EBSERH",board:"FGV",year:"2025",title:"EBSERH — área assistencial (Enfermagem)",org:"Empresa Brasileira de Serviços Hospitalares",url:"https://conhecimento.fgv.br/concursos/ebserh24/3",topics:["Enfermagem","SUS","Segurança do Paciente","Urgência","Farmacologia","Português","Biossegurança"],note:"Cadernos por profissão e tipo de prova; gabarito oficial definitivo disponível na página."},
 {kind:"EBSERH",board:"FGV",year:"2025",title:"EBSERH — área médica",org:"Empresa Brasileira de Serviços Hospitalares",url:"https://conhecimento.fgv.br/concursos/ebserh24/2",topics:["Saúde Coletiva","Urgência","Medicina","Epidemiologia","Bioética","Farmacologia"],note:"Provas de especialidades médicas e gabaritos; filtre por conteúdo transversal."},
 {kind:"EBSERH",board:"FGV",year:"2026",title:"EBSERH — área médica",org:"Empresa Brasileira de Serviços Hospitalares",url:"https://conhecimento.fgv.br/concursos/ebserh26",topics:["Saúde Coletiva","Urgência","Medicina","Epidemiologia","Ética"],note:"Edição mais recente listada neste catálogo, com prova objetiva e gabaritos."},
 {kind:"MS",board:"Inep",year:"2025–2026",title:"Enamed — avaliação nacional médica",org:"Inep / Ministério da Educação",url:"https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enamed/provas-e-gabaritos",topics:["SUS","Saúde Coletiva","Medicina","Epidemiologia","Ética","Atenção Primária"],note:"Cadernos e gabaritos oficiais; avaliação médica relacionada a conteúdos de saúde e SUS, não concurso do Ministério da Saúde."},
 {kind:"VEST",board:"Fuvest",year:"2026",title:"Fuvest — Vestibular USP",org:"Fundação Universitária para o Vestibular",url:"https://www.fuvest.br/acervo-vestibular-2026/",topics:["Biologia","Química","Matemática","Português","Física","História","Geografia","Redação"],note:"Provas, gabaritos e respostas esperadas do vestibular 2026."},
 {kind:"VEST",board:"Inep",year:"2005–2025",title:"Enade — provas de graduação",org:"Inep / Ministério da Educação",url:"https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enade/provas-e-gabaritos",topics:["Enfermagem","Saúde Coletiva","Ética","Epidemiologia","Farmacologia","Educação"],note:"Acervo de provas por área e ano; confira as edições e cursos disponíveis."}
];
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const normalize=x=>String(x||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const vals=new URLSearchParams(location.search);
const preset=vals.get("tema")||vals.get("assunto")||"";
if(preset)$("officialExamTopic").value=preset;
function display(){
 const kind=$("officialExamKind").value,board=$("officialExamBoard").value,topic=normalize($("officialExamTopic").value).trim();
 const out=exams.filter(e=>(!kind||e.kind===kind)&&(!board||e.board===board)&&(!topic||normalize([e.title,e.org,e.note,...e.topics].join(" ")).includes(topic)));
 $("officialExamCount").textContent=out.length+" fonte(s) oficial(is) relacionadas. Escolha o caderno na página original.";
 $("officialExamGrid").innerHTML=out.length?out.map(e=>'<article class="official-exam-card"><div><span class="official-exam-tag">'+esc(e.kind)+'</span><span class="official-exam-tag">'+esc(e.board)+'</span><span class="official-exam-tag">'+esc(e.year)+'</span></div><strong>'+esc(e.title)+'</strong><p>'+esc(e.note)+'</p><div class="official-exam-topics">Assuntos: '+esc(e.topics.join(" · "))+'</div><div class="official-exam-links"><a target="_blank" rel="noopener noreferrer" href="'+esc(e.url)+'">Abrir provas e gabaritos ↗</a><button type="button" data-practice="'+esc(e.topics[0])+'">Praticar tema no Córtex</button></div></article>').join(""):'<p>Nenhuma fonte desta seleção. Experimente outro exame ou assunto.</p>';
 $("officialExamGrid").querySelectorAll("[data-practice]").forEach(b=>b.addEventListener("click",()=>{
   const value=$("officialExamTopic").value.trim()||b.dataset.practice;
   const search=$("busca");
   if(search){search.value=value;search.dispatchEvent(new Event("input",{bubbles:true}));search.scrollIntoView({behavior:"smooth",block:"center"})}
   else location.href="/questoes?tema="+encodeURIComponent(value);
 }));
}
$("officialExamExpand").addEventListener("click",()=>{
 const open=$("officialExamBody").hidden;
 $("officialExamBody").hidden=!open;
 $("officialExamExpand").setAttribute("aria-expanded",String(open));
 $("officialExamExpand").textContent=open?"Recolher acervo":"Explorar acervo";
 if(open)display();
});
["officialExamKind","officialExamBoard","officialExamTopic"].forEach(id=>$(id).addEventListener(id==="officialExamTopic"?"input":"change",display));
if(preset){$("officialExamExpand").click()}
})();
