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


window.PMPE_SUBJECTS=SUBJECTS;

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
host.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",()=>{const key=b.closest(".pmpe-topic").dataset.topicKey;if(b.dataset.action==="questions"&&typeof window.PMPEOpenQuestions==="function"){window.PMPEOpenQuestions(key);return;}toggle(key,b.dataset.action);}));
document.getElementById("pmpeVisibleCount").textContent=visible+" tópicos";updateStats();
}
function updateStats(){let studied=0,reviewed=0,questions=0,total=0;SUBJECTS.forEach(s=>s.topics.forEach((_,i)=>{total++;const t=getTopicState(topicKey(s,i));if(t.studied)studied++;if(t.reviewed)reviewed++;if(t.questions)questions++;}));const pct=Math.round(studied/total*100);document.getElementById("pmpeProgressValue").textContent=pct+"%";document.getElementById("pmpeProgressText").textContent=studied+" de "+total+" tópicos";document.getElementById("pmpeStudied").textContent=studied;document.getElementById("pmpeReviewed").textContent=reviewed;document.getElementById("pmpeQuestions").textContent=questions;}
function countdown(){const exam=new Date("2027-02-21T08:00:00-03:00"),now=new Date(),days=Math.max(0,Math.ceil((exam-now)/86400000));document.getElementById("pmpeCountdown").textContent=days+" dias";}
document.getElementById("pmpeSearch").addEventListener("input",e=>{searchTerm=e.target.value.trim().toLowerCase();render();});
document.getElementById("pmpeResumeBtn").addEventListener("click",()=>{if(!state.last){document.querySelector(".pmpe-course").scrollIntoView({behavior:"smooth"});return;}const subject=state.last.split(":")[0];activeFilter=subject;searchTerm="";document.getElementById("pmpeSearch").value="";render();setTimeout(()=>{const el=document.querySelector('[data-topic-key="'+CSS.escape(state.last)+'"]');if(el)el.scrollIntoView({behavior:"smooth",block:"center"});},50);});
countdown();render();
})();

(function(){"use strict";
const SUBJECTS=window.PMPE_SUBJECTS||[];
const QSTORE="cortex_pmpe_2026_questions";
const FACTS={
portugues:[
"A interpretação correta deve permanecer apoiada nas informações expressas ou inferíveis do texto, sem extrapolações.",
"Tipologia textual descreve a estrutura predominante; gênero textual é a forma social concreta, como notícia, crônica ou ofício.",
"Metáfora, metonímia, ironia, hipérbole e eufemismo são exemplos de figuras de linguagem.",
"Conjunções e locuções podem estabelecer oposição, conclusão, concessão, causa, adição ou alternância entre segmentos.",
"A ortografia oficial corresponde às convenções vigentes de escrita das palavras na norma-padrão.",
"As regras de acentuação dependem da posição da sílaba tônica e da terminação da palavra, além de casos especiais.",
"Substantivo, adjetivo, verbo, advérbio, pronome, preposição e conjunção exercem funções distintas no texto.",
"A crase representa, em regra, a fusão da preposição 'a' com o artigo feminino 'a' ou com certos pronomes iniciados por a.",
"A análise sintática identifica termos da oração e relações de coordenação e subordinação no período composto.",
"'Que' e 'se' podem exercer funções diferentes conforme o contexto, como pronome relativo, conjunção ou partícula apassivadora.",
"Coesão textual envolve mecanismos de referenciação, substituição, repetição e conexão entre partes do texto.",
"Pontuação organiza a estrutura sintática e pode alterar o sentido; a vírgula não deve separar sujeito e verbo sem motivo sintático.",
"Na concordância verbal, o verbo se ajusta ao núcleo do sujeito; na nominal, determinantes e modificadores ajustam-se ao nome.",
"Regência trata da relação entre termos e das preposições exigidas por verbos e nomes.",
"Próclise, ênclise e mesóclise são posições possíveis dos pronomes oblíquos átonos conforme fatores de atração e norma-padrão.",
"Derivação e composição são processos centrais de formação de palavras.",
"Sinonímia, antonímia, polissemia, homonímia e sentido contextual pertencem ao campo da significação das palavras.",
"Variação linguística decorre de fatores regionais, sociais, históricos e situacionais, sem eliminar a noção de adequação ao contexto."
],
historia:[
"A ocupação efetiva de Pernambuco relaciona-se ao sistema de capitanias hereditárias e à atuação de Duarte Coelho como donatário.",
"O açúcar foi base da riqueza colonial pernambucana, apoiado em engenhos, trabalho escravizado e comércio atlântico.",
"Olinda consolidou-se como centro ligado à elite açucareira, enquanto Recife cresceu fortemente em função do porto e do comércio.",
"A ocupação holandesa iniciou-se em 1630; Maurício de Nassau governou entre 1637 e 1644 e promoveu intervenções urbanas no Recife.",
"A história pernambucana inclui quilombos, Insurreição Pernambucana, Guerra dos Mascates, 1817, Confederação do Equador, Cabanada e Praieira.",
"No período republicano, Pernambuco passou por República Velha, Era Vargas, mobilizações sociais, regime militar e redemocratização.",
"Frevo e maracatu são manifestações marcantes da cultura popular pernambucana, ao lado de festas e tradições culinárias.",
"A presença afro-brasileira é essencial para a formação histórica, religiosa, cultural e social de Pernambuco."
],
rlm:[
"Proposição é uma sentença declarativa à qual se pode atribuir valor verdadeiro ou falso; conectivos formam proposições compostas.",
"Um argumento é válido quando a conclusão decorre logicamente das premissas; equivalência e implicação são relações distintas.",
"Diagramas lógicos e de Venn representam conjuntos, inclusões, interseções e exclusões entre classes.",
"O princípio multiplicativo, permutações, arranjos e combinações são técnicas de contagem usadas também em problemas de probabilidade."
],
informatica:[
"A internet é uma rede mundial de redes; a intranet é uma rede privada de uma organização, embora ambas possam usar TCP/IP.",
"Navegadores acessam serviços web; computação em nuvem disponibiliza recursos computacionais por rede conforme o serviço contratado.",
"Phishing busca induzir a vítima a fornecer dados; autenticação, criptografia, atualizações e boas práticas reduzem riscos.",
"Backup permite recuperação de dados; cópia completa, incremental e diferencial possuem estratégias distintas.",
"Arquivos e pastas podem ser criados, renomeados, copiados, movidos e excluídos; periféricos são dispositivos ligados ao sistema.",
"O Windows 11 oferece gerenciamento de arquivos, configurações, Painel de Controle e comandos de terminal/Prompt de Comando.",
"Word/Writer tratam textos, Excel/Calc trabalham planilhas e fórmulas, e PowerPoint/Impress criam apresentações."
],
constitucional:[
"Os fundamentos da República estão no art. 1º da CF/88 e incluem soberania, cidadania, dignidade da pessoa humana, valores sociais do trabalho e livre iniciativa e pluralismo político.",
"Direitos fundamentais abrangem direitos individuais e coletivos, sociais, nacionalidade, direitos políticos e garantias como os remédios constitucionais.",
"A Federação distribui competências entre União, Estados, Distrito Federal e Municípios; a Administração Pública submete-se aos princípios constitucionais.",
"Legislativo, Executivo e Judiciário são independentes e harmônicos, e a Constituição também disciplina Funções Essenciais à Justiça.",
"A defesa do Estado e das instituições democráticas inclui mecanismos constitucionais excepcionais e regras sobre segurança pública.",
"Súmulas e jurisprudência dos tribunais superiores devem ser estudadas em conexão com a Constituição e a legislação aplicável."
],
dh:[
"A teoria geral dos direitos humanos trabalha conceito, fundamento, características, classificação e proteção da dignidade humana.",
"As dimensões dos direitos humanos são construção didática histórica e coexistem; uma não elimina a anterior.",
"Tratados de direitos humanos podem ingressar no ordenamento brasileiro com diferentes hierarquias conforme o procedimento constitucional.",
"A Declaração Universal de 1948 afirma direitos e liberdades fundamentais como padrão comum de proteção da pessoa humana.",
"A Convenção Americana sobre Direitos Humanos integra o sistema interamericano e foi promulgada no Brasil pelo Decreto 678/1992.",
"O ECA disciplina direitos de crianças e adolescentes, ato infracional, garantias, medidas e crimes pertinentes à atuação policial.",
"A Lei 13.869/2019 tipifica crimes de abuso de autoridade e exige os elementos previstos em lei para responsabilização.",
"A Lei 9.455/1997 define crimes de tortura e prevê causas de aumento e efeitos específicos da condenação.",
"A Lei Maria da Penha cria mecanismos de prevenção e enfrentamento da violência doméstica e familiar contra a mulher.",
"A Lei 7.716/1989 criminaliza condutas resultantes de discriminação ou preconceito de raça, cor, etnia, religião ou procedência nacional nos termos legais.",
"A Lei 9.605/1998 reúne sanções penais e administrativas derivadas de condutas lesivas ao meio ambiente.",
"A Lei 8.072/1990 lista crimes hediondos e estabelece regime jurídico mais rigoroso para eles.",
"A Lei 11.343/2006 institui o Sistema Nacional de Políticas Públicas sobre Drogas e disciplina crimes relacionados a drogas.",
"A Lei Estadual 6.783/1974 dispõe sobre o Estatuto dos Policiais Militares do Estado de Pernambuco.",
"O Estatuto da Pessoa Idosa protege pessoas com 60 anos ou mais e prevê garantias e crimes específicos.",
"O Estatuto da Juventude estabelece direitos dos jovens e regras específicas, inclusive sobre benefícios previstos em lei.",
"Súmulas, jurisprudência dominante e legislação atualizada devem ser relacionadas aos temas de direitos humanos e legislação extravagante."
]};

function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
function flatQuestions(){
  const all=[];
  SUBJECTS.forEach((s,si)=>{
    const facts=FACTS[s.key]||[];
    s.topics.forEach((topic,ti)=>{
      const correct=facts[ti]||("Conteúdo central: "+topic+".");
      const pool=facts.filter((_,i)=>i!==ti);
      const distract=[pool[(ti+1)%pool.length],pool[(ti+3)%pool.length],pool[(ti+5)%pool.length],pool[(ti+7)%pool.length]].filter(Boolean);
      let opts=[correct,...distract].slice(0,5);
      while(opts.length<5)opts.push("A afirmação apresentada não corresponde ao conteúdo deste tópico.");
      const shift=(ti+si)%5;opts=opts.slice(shift).concat(opts.slice(0,shift));
      all.push({id:s.key+":"+ti,subject:s.key,subjectName:s.name,topicIndex:ti,topic,source:"Autoral · edital + materiais PMPE",options:opts,answer:opts.indexOf(correct),explanation:correct});
    });
  });
  return all;
}
const BANK=flatQuestions();
let qstate={};
try{qstate=JSON.parse(localStorage.getItem(QSTORE)||"{}")||{};}catch(e){}
function saveQ(){try{localStorage.setItem(QSTORE,JSON.stringify(qstate));}catch(e){}}
function setTab(name){
  document.querySelectorAll("[data-pmpe-tab]").forEach(b=>b.classList.toggle("active",b.dataset.pmpeTab===name));
  document.querySelectorAll("[data-pmpe-panel]").forEach(p=>p.hidden=p.dataset.pmpePanel!==name);
  document.querySelectorAll(".pmpe-course,.pmpe-week").forEach(p=>p.hidden=name!=="plano");
  if(name==="questoes")populateQuestionSelectors();
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-pmpe-tab]").forEach(b=>b.addEventListener("click",()=>setTab(b.dataset.pmpeTab)));
window.PMPEOpenQuestions=function(key){
  setTab("questoes");
  const [subject,idx]=String(key).split(":");
  const ss=document.getElementById("pmpeQuestionSubject"),ts=document.getElementById("pmpeQuestionTopic");
  if(ss){ss.value=subject;populateTopics();if(ts)ts.value=idx;}
  startQuestions();
};
function populateQuestionSelectors(){
  const ss=document.getElementById("pmpeQuestionSubject");
  if(!ss||ss.dataset.ready)return;
  ss.innerHTML='<option value="all">Todas as matérias</option>'+SUBJECTS.map(s=>'<option value="'+s.key+'">'+esc(s.name)+'</option>').join("");
  ss.dataset.ready="1";ss.addEventListener("change",populateTopics);populateTopics();
}
function populateTopics(){
  const ss=document.getElementById("pmpeQuestionSubject"),ts=document.getElementById("pmpeQuestionTopic");if(!ss||!ts)return;
  const s=SUBJECTS.find(x=>x.key===ss.value);
  ts.innerHTML='<option value="all">Todos os tópicos</option>'+(s?s.topics.map((t,i)=>'<option value="'+i+'">'+esc(t)+'</option>').join(""):"");
}
function selectedQuestions(){
  const subject=document.getElementById("pmpeQuestionSubject")?.value||"all";
  const topic=document.getElementById("pmpeQuestionTopic")?.value||"all";
  let list=BANK.filter(q=>(subject==="all"||q.subject===subject)&&(topic==="all"||String(q.topicIndex)===topic));
  const n=Number(document.getElementById("pmpeQuestionAmount")?.value||5);
  if(n>0)list=list.slice(0,n);
  return list;
}
let session=[],current=0,answers={};
function startQuestions(){
  session=selectedQuestions();current=0;answers={};renderQuestion();
}
function renderQuestion(){
  const host=document.getElementById("pmpeQuestionRunner");if(!host)return;
  if(!session.length){host.innerHTML='<div class="pmpe-empty">Nenhuma questão encontrada para este filtro.</div>';return;}
  if(current>=session.length){const hits=session.reduce((n,q)=>n+(answers[q.id]===q.answer?1:0),0);qstate.sessions=(qstate.sessions||0)+1;qstate.answered=(qstate.answered||0)+session.length;qstate.correct=(qstate.correct||0)+hits;saveQ();host.innerHTML='<div class="pmpe-question-summary"><article><span>Resultado</span><strong>'+hits+'/'+session.length+'</strong></article><article><span>Aproveitamento</span><strong>'+Math.round(hits/session.length*100)+'%</strong></article><article><span>Sessões PMPE</span><strong>'+qstate.sessions+'</strong></article></div><div class="pmpe-question-nav"><button type="button" id="pmpeReviewAgain">Refazer</button><button type="button" id="pmpeBackTopics">Escolher outro tópico</button></div>';document.getElementById("pmpeReviewAgain")?.addEventListener("click",startQuestions);return;}
  const q=session[current],chosen=answers[q.id],answered=chosen!==undefined;
  host.innerHTML='<article class="pmpe-question-card"><div class="pmpe-question-meta"><span>'+esc(q.subjectName)+' · '+esc(q.topic)+'</span><span>'+(current+1)+' / '+session.length+'</span></div><h3>'+esc('Qual afirmação está diretamente relacionada ao tópico "'+q.topic+'"?')+'</h3><div class="pmpe-answer-list">'+q.options.map((o,i)=>'<button class="pmpe-answer '+(answered?(i===q.answer?"correct":i===chosen?"wrong":""):"")+'" type="button" data-answer="'+i+'" '+(answered?"disabled":"")+'><b>'+"ABCDE"[i]+'</b><span>'+esc(o)+'</span></button>').join("")+'</div>'+(answered?'<div class="pmpe-question-feedback"><strong>'+(chosen===q.answer?"Correto.":"Resposta correta: "+"ABCDE"[q.answer]+".")+'</strong><br>'+esc(q.explanation)+'<br><small>'+esc(q.source)+'</small></div>':"")+'<div class="pmpe-question-nav"><button type="button" id="pmpePrevQuestion" '+(current===0?"disabled":"")+'>Anterior</button><button type="button" id="pmpeNextQuestion">'+(answered?(current===session.length-1?"Finalizar":"Próxima"):"Responder")+'</button></div></article>';
  host.querySelectorAll("[data-answer]").forEach(b=>b.addEventListener("click",()=>{answers[q.id]=Number(b.dataset.answer);renderQuestion();}));
  document.getElementById("pmpePrevQuestion")?.addEventListener("click",()=>{if(current>0){current--;renderQuestion();}});
  document.getElementById("pmpeNextQuestion")?.addEventListener("click",()=>{if(answers[q.id]===undefined)return;current++;renderQuestion();});
}
document.getElementById("pmpeStartQuestions")?.addEventListener("click",startQuestions);
document.querySelectorAll("[data-open-bank]").forEach(b=>b.addEventListener("click",()=>{setTab("questoes");populateQuestionSelectors();document.getElementById("pmpeQuestionSubject").value="all";populateTopics();startQuestions();}));

let pdfjs=null,pdfDoc=null,pdfPage=1,pdfDocName="sim2026",renderToken=0;
async function ensurePdf(){
  if(pdfjs)return pdfjs;
  pdfjs=await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc="https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";
  return pdfjs;
}
async function openPdf(doc,title){
  const reader=document.getElementById("pmpePdfReader");if(!reader)return;
  reader.hidden=false;pdfDocName=doc;pdfPage=1;document.getElementById("pmpeReaderTitle").textContent=title;document.getElementById("pmpeReaderLabel").textContent=doc==="gabarito2026"?"GABARITO":"SIMULADO";
  reader.scrollIntoView({behavior:"smooth",block:"start"});
  const lib=await ensurePdf();pdfDoc=await lib.getDocument({url:"/api/pmpe/pdf?doc="+encodeURIComponent(doc),withCredentials:true}).promise;await renderPdfPage();
}
async function renderPdfPage(){
  if(!pdfDoc)return;const token=++renderToken,page=await pdfDoc.getPage(pdfPage);if(token!==renderToken)return;
  const stage=document.getElementById("pmpeCanvasStage"),canvas=document.getElementById("pmpePdfCanvas"),ctx=canvas.getContext("2d");
  const base=page.getViewport({scale:1});const maxW=Math.min(stage.clientWidth-20,1050);const scale=Math.max(.6,Math.min(2,maxW/base.width));const vp=page.getViewport({scale});
  canvas.width=Math.floor(vp.width*devicePixelRatio);canvas.height=Math.floor(vp.height*devicePixelRatio);canvas.style.width=Math.floor(vp.width)+"px";canvas.style.height=Math.floor(vp.height)+"px";
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);await page.render({canvasContext:ctx,viewport:vp}).promise;
  document.getElementById("pmpeReaderPage").textContent=pdfPage+" / "+pdfDoc.numPages;
}
document.querySelectorAll("[data-open-sim]").forEach(b=>b.addEventListener("click",()=>openPdf("sim2026","Simulado gratuito EBN · PMPE 2026").catch(()=>alert("Não foi possível abrir o caderno agora."))));
document.getElementById("pmpeReaderPrev")?.addEventListener("click",()=>{if(pdfDoc&&pdfPage>1){pdfPage--;renderPdfPage();}});
document.getElementById("pmpeReaderNext")?.addEventListener("click",()=>{if(pdfDoc&&pdfPage<pdfDoc.numPages){pdfPage++;renderPdfPage();}});
document.getElementById("pmpeReaderClose")?.addEventListener("click",()=>{document.getElementById("pmpePdfReader").hidden=true;pdfDoc=null;});
document.getElementById("pmpeOpenAnswerSheet")?.addEventListener("click",()=>openPdf(pdfDocName==="gabarito2026"?"sim2026":"gabarito2026",pdfDocName==="gabarito2026"?"Simulado gratuito EBN · PMPE 2026":"Gabarito · PMPE 2026"));
let touchX=null;const stage=document.getElementById("pmpeCanvasStage");stage?.addEventListener("pointerdown",e=>{touchX=e.clientX;});stage?.addEventListener("pointerup",e=>{if(touchX===null)return;const d=e.clientX-touchX;touchX=null;if(Math.abs(d)<60)return;if(d<0&&pdfDoc&&pdfPage<pdfDoc.numPages){pdfPage++;renderPdfPage();}if(d>0&&pdfDoc&&pdfPage>1){pdfPage--;renderPdfPage();}});
populateQuestionSelectors();
})();
