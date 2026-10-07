(function(){"use strict";
const STORAGE_KEY="cortex_pmpe_2026";
const SUBJECTS=[
{key:"portugues",name:"Língua Portuguesa",block:"Bloco I",topics:[
"Compreensão e interpretação de textos","Tipologias e gêneros textuais","Figuras de linguagem","Relações semânticas: oposição, conclusão, concessão, causalidade, adição e alternância","Ortografia oficial","Acentuação gráfica","Emprego das classes de palavras","Emprego do sinal indicativo de crase","Sintaxe da oração e do período","Funções do “que” e do “se”","Mecanismos de coesão textual","Emprego dos sinais de pontuação","Concordância nominal e verbal","Regência nominal e verbal","Colocação pronominal","Processos de formação de palavras","Significação das palavras","Variação linguística"]},
{key:"historia",name:"História de Pernambuco",block:"Bloco I",topics:[
"Ocupação e colonização: contatos iniciais, capitanias hereditárias e Duarte Coelho","Importância do açúcar para a economia local","Formação de Olinda e Recife","Presença holandesa e governo de Maurício de Nassau","Resistência e movimentos emancipacionistas: quilombos, Insurreição, Mascates, 1817, Equador, Cabanos e Praieira","Pernambuco durante o período republicano","Cultura popular pernambucana: frevo, maracatu, culinária e festas","Aspectos afro-brasileiros em Pernambuco"]},
{key:"rlm",name:"Raciocínio Lógico",block:"Bloco II",topics:[
"Estruturas lógicas: proposições, conectivos, quantificadores e falácias","Lógica de argumentação: analogias, inferências, deduções, equivalência e implicação","Diagramas lógicos","Contagem: princípio multiplicativo, permutações, arranjos, combinações e probabilidade"]},
{key:"informatica",name:"Informática",block:"Bloco II",topics:[
"Internet e intranet","Navegadores, serviços de internet e computação em nuvem","Segurança da informação: ameaças, malwares, phishing, criptografia e autenticação","Armazenamento, backup e restauração de dados","Arquivos, pastas, programas e organização de computadores/periféricos","Windows 11: arquivos, configurações, Painel de Controle e Prompt de Comando","Office 2019 e LibreOffice 7: Word/Writer, Excel/Calc e PowerPoint/Impress"]},
{key:"constitucional",name:"Direito Constitucional",block:"Bloco III",topics:[
"Princípios fundamentais","Direitos e garantias fundamentais, direitos sociais, nacionalidade, direitos políticos e remédios constitucionais","Organização do Estado, competências, Administração Pública, servidores e militares estaduais","Organização dos Poderes e Funções Essenciais à Justiça","Defesa do Estado e das instituições democráticas","Súmulas, jurisprudência dominante e legislação relacionada"]},
{key:"dh",name:"Direitos Humanos e Legislação Extravagante",block:"Bloco III",topics:[
"Teoria geral dos direitos humanos","Evolução histórica e gerações de direitos humanos","Tratados internacionais de direitos humanos e CF art. 5º §§2º e 3º","Declaração Universal dos Direitos Humanos","Convenção Americana de Direitos Humanos — Pacto de San José","ECA — Lei 8.069/1990: pontos pertinentes à atividade policial","Lei 13.869/2019 — Abuso de Autoridade","Lei 9.455/1997 — Tortura","Lei 11.340/2006 — Maria da Penha","Lei 7.716/1989 — Crimes de preconceito de raça ou cor","Lei 9.605/1998 — Crimes ambientais","Lei 8.072/1990 — Crimes hediondos","Lei 11.343/2006 — Drogas","Lei Estadual 6.783/1974 — Estatuto dos Policiais Militares de Pernambuco","Lei 10.741/2003 — Estatuto da Pessoa Idosa","Lei 12.852/2013 — Estatuto da Juventude","Súmulas, jurisprudência dominante e legislação relacionada"]}];


const LAW_LINKS={
"Tratados internacionais de direitos humanos e CF art. 5º §§2º e 3º":"https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
"Declaração Universal dos Direitos Humanos":"https://www.unicef.org/brazil/declaracao-universal-dos-direitos-humanos",
"Convenção Americana de Direitos Humanos — Pacto de San José":"https://www.planalto.gov.br/ccivil_03/decreto/d0678.htm",
"ECA — Lei 8.069/1990: pontos pertinentes à atividade policial":"https://www.planalto.gov.br/ccivil_03/leis/l8069.htm",
"Lei 13.869/2019 — Abuso de Autoridade":"https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2019/lei/l13869.htm",
"Lei 9.455/1997 — Tortura":"https://www.planalto.gov.br/ccivil_03/leis/l9455.htm",
"Lei 11.340/2006 — Maria da Penha":"https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11340.htm",
"Lei 7.716/1989 — Crimes de preconceito de raça ou cor":"https://www.planalto.gov.br/ccivil_03/leis/l7716.htm",
"Lei 9.605/1998 — Crimes ambientais":"https://www.planalto.gov.br/ccivil_03/leis/l9605.htm",
"Lei 8.072/1990 — Crimes hediondos":"https://www.planalto.gov.br/ccivil_03/leis/l8072.htm",
"Lei 11.343/2006 — Drogas":"https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11343.htm",
"Lei 10.741/2003 — Estatuto da Pessoa Idosa":"https://www.planalto.gov.br/ccivil_03/leis/2003/l10.741.htm",
"Lei 12.852/2013 — Estatuto da Juventude":"https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/lei/l12852.htm",
"Princípios fundamentais":"https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
"Direitos e garantias fundamentais, direitos sociais, nacionalidade, direitos políticos e remédios constitucionais":"https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
"Organização do Estado, competências, Administração Pública, servidores e militares estaduais":"https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
"Organização dos Poderes e Funções Essenciais à Justiça":"https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
"Defesa do Estado e das instituições democráticas":"https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"};

const SPECIAL={
rlm:"https://profrafaelcardoso.com.br/pm-pe/raio-x-aocp/",
constitucional:"https://escola.mpu.mp.br/plataforma-aprender/acervo-educacional/conteudo/direito-constitucional-modulo-1-teoria-da-constituicao",
historia:"https://www.pm.pe.gov.br/historico/"
};

let state=loadState(),activeFilter="all",searchTerm="";
function loadState(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")||{};}catch(e){return {};}}
function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(e){}}
function topicKey(s,i){return s.key+":"+i;}
function getTopicState(key){return state[key]||{};}
function toggle(key,field){const next={...getTopicState(key)};next[field]=!next[field];state[key]=next;state.last=key;saveState();render();}
function qSearch(subject,topic){return "https://www.youtube.com/results?search_query="+encodeURIComponent("PMPE 2026 "+subject+" "+topic+" Instituto AOCP aula");}
function qQuestions(subject,topic){return "https://www.google.com/search?q="+encodeURIComponent("questões Instituto AOCP "+subject+" "+topic+" grátis");}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
function renderFilters(){const el=document.getElementById("pmpeFilters");el.innerHTML=[["all","Todas"],...SUBJECTS.map(s=>[s.key,s.name])].map(([k,n])=>'<button type="button" data-filter="'+k+'" class="'+(activeFilter===k?"active":"")+'">'+esc(n)+'</button>').join("");el.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{activeFilter=b.dataset.filter;render();}));}
function render(){
renderFilters();
const host=document.getElementById("pmpeSubjects");let visible=0;
host.innerHTML=SUBJECTS.filter(s=>activeFilter==="all"||s.key===activeFilter).map((s,si)=>{
const rows=s.topics.map((topic,i)=>{const key=topicKey(s,i),t=getTopicState(key);const match=!searchTerm||(s.name+" "+topic).toLowerCase().includes(searchTerm);if(!match)return "";visible++;const law=LAW_LINKS[topic];return '<article class="pmpe-topic '+(t.studied?"complete":"")+'" data-topic-key="'+key+'"><div class="pmpe-topic-index">'+String(i+1).padStart(2,"0")+'</div><div><h3>'+esc(topic)+'</h3><p>'+esc(s.block)+' · tópico '+(i+1)+' de '+s.topics.length+'</p><div class="pmpe-topic-links"><a href="'+qSearch(s.name,topic)+'" target="_blank" rel="noopener">Aula gratuita ↗</a><a href="'+qQuestions(s.name,topic)+'" target="_blank" rel="noopener">Questões AOCP ↗</a>'+(SPECIAL[s.key]?'<a href="'+SPECIAL[s.key]+'" target="_blank" rel="noopener">Material selecionado ↗</a>':"")+(law?'<a href="'+law+'" target="_blank" rel="noopener">Lei seca ↗</a>':"")+'</div></div><div class="pmpe-topic-actions"><button type="button" data-action="studied" class="'+(t.studied?"active":"")+'">✓ Estudado</button><button type="button" data-action="reviewed" class="'+(t.reviewed?"active":"")+'">↻ Revisado</button><button type="button" data-action="questions" class="'+(t.questions?"active":"")+'">◎ Questões</button></div></article>';}).join("");
const completed=s.topics.filter((_,i)=>getTopicState(topicKey(s,i)).studied).length;const pct=Math.round(completed/s.topics.length*100);if(!rows)return "";
return '<section class="pmpe-subject '+((activeFilter===s.key||searchTerm)?"open":"")+'" data-subject="'+s.key+'"><div class="pmpe-subject-head"><div class="pmpe-subject-badge">'+(si+1)+'</div><div class="pmpe-subject-copy"><strong>'+esc(s.name)+'</strong><small>'+esc(s.block)+' · '+s.topics.length+' tópicos · '+completed+' concluídos</small></div><div class="pmpe-subject-progress"><i style="width:'+pct+'%"></i></div><div class="pmpe-subject-toggle">⌄</div></div><div class="pmpe-topic-list">'+rows+'</div></section>';}).join("")||'<div class="pmpe-empty">Nenhum tópico encontrado.</div>';
host.querySelectorAll(".pmpe-subject-head").forEach(h=>h.addEventListener("click",e=>{if(e.target.closest("a,button"))return;h.parentElement.classList.toggle("open");}));
host.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",()=>{const key=b.closest(".pmpe-topic").dataset.topicKey;toggle(key,b.dataset.action);}));
document.getElementById("pmpeVisibleCount").textContent=visible+" tópicos";updateStats();
}
function updateStats(){let studied=0,reviewed=0,questions=0,total=0;SUBJECTS.forEach(s=>s.topics.forEach((_,i)=>{total++;const t=getTopicState(topicKey(s,i));if(t.studied)studied++;if(t.reviewed)reviewed++;if(t.questions)questions++;}));const pct=Math.round(studied/total*100);document.getElementById("pmpeProgressValue").textContent=pct+"%";document.getElementById("pmpeProgressText").textContent=studied+" de "+total+" tópicos";document.getElementById("pmpeStudied").textContent=studied;document.getElementById("pmpeReviewed").textContent=reviewed;document.getElementById("pmpeQuestions").textContent=questions;}
function countdown(){const exam=new Date("2027-02-21T08:00:00-03:00"),now=new Date(),days=Math.max(0,Math.ceil((exam-now)/86400000));document.getElementById("pmpeCountdown").textContent=days+" dias";}
document.getElementById("pmpeSearch").addEventListener("input",e=>{searchTerm=e.target.value.trim().toLowerCase();render();});
document.getElementById("pmpeResumeBtn").addEventListener("click",()=>{if(!state.last){document.querySelector(".pmpe-course").scrollIntoView({behavior:"smooth"});return;}const subject=state.last.split(":")[0];activeFilter=subject;searchTerm="";document.getElementById("pmpeSearch").value="";render();setTimeout(()=>{const el=document.querySelector('[data-topic-key="'+CSS.escape(state.last)+'"]');if(el)el.scrollIntoView({behavior:"smooth",block:"center"});},50);});
countdown();render();
})();