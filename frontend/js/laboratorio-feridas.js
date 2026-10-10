(function(){
"use strict";
const cases={
 lpp2:{key:"lpp2",eyebrow:"CASO 01 · LPP ESTÁGIO 2",title:"Lesão por pressão em região sacral",pain:"Dor 4/10",temp:"Afebril",time:"Há 3 dias",history:"Pessoa com mobilidade reduzida, pele exposta à umidade e lesão superficial sacral. Sem odor forte ou secreção purulenta.",objective:"Limpar, proteger o leito e reduzir agressão por umidade/pressão.",assessment:{bed:"granulation",exudate:"low",skin:"erythema",infection:"absent"},preferred:["saline","barrier","foam"],allowed:["saline","barrier","foam"],avoid:["silver","alginate","phmb"],rationale:"LPP estágio 2 superficial, com baixo exsudato e sem sinais locais de infecção. A prioridade é limpeza, proteção do leito e da pele perilesional, além de alívio de pressão. Creme barreira protege a pele ao redor/umidade; não é tratamento do leito por si só."},
 venous:{key:"venous",eyebrow:"CASO 02 · ÚLCERA VENOSA",title:"Úlcera venosa em terço distal da perna",pain:"Dor 3/10",temp:"Afebril",time:"Há 8 semanas",history:"Ferida irregular em região maleolar, edema de membro inferior e exsudato seroso abundante. Sem pus ou piora sistêmica.",objective:"Controlar exsudato e proteger a pele perilesional sem usar antimicrobiano sem indicação.",assessment:{bed:"granulation",exudate:"high",skin:"maceration",infection:"absent"},preferred:["saline","alginate","barrier","foam"],allowed:["saline","alginate","barrier","foam"],avoid:["hydrogel","silver","phmb"],rationale:"Com alto exsudato, materiais absorventes como alginato podem ser úteis. A pele macerada ao redor precisa proteção. Sem sinais de infecção, prata/PHMB não devem ser escolhidos automaticamente. Compressão depende de avaliação vascular e protocolo e não é simulada aqui."},
 infected:{key:"infected",eyebrow:"CASO 03 · INFECÇÃO LOCAL SUSPEITA",title:"Ferida crônica com sinais locais de infecção",pain:"Dor 6/10",temp:"37,7 °C",time:"Há 5 semanas",history:"Aumento recente de dor, eritema perilesional, odor e exsudato amarelado moderado. O caso simula suspeita de infecção local, sem sinais de sepse.",objective:"Limpar, reduzir biocarga e manejar o exsudato. Reconhecer quando antimicrobiano tópico pode ter papel.",assessment:{bed:"slough",exudate:"moderate",skin:"erythema",infection:"suspected"},preferred:["saline","phmb","silver"],allowed:["saline","phmb","silver","alginate","foam","barrier"],avoid:["hydrogel"],rationale:"Na presença de infecção local suspeita, uma estratégia antimicrobiana pode ser apropriada dentro de um plano completo. PHMB pode ser usado como solução antimicrobiana e prata em cobertura pode ser considerada. Alginato com prata faz mais sentido quando também há exsudato a manejar."},
 dry:{key:"dry",eyebrow:"CASO 04 · BAIXO EXSUDATO",title:"Ferida com fibrina e leito ressecado",pain:"Dor 2/10",temp:"Afebril",time:"Há 12 dias",history:"Ferida pequena, pouca secreção, leito com fibrina aderida e aspecto ressecado. Pele ao redor íntegra e sem sinais de infecção.",objective:"Limpar e favorecer ambiente úmido controlado sem cobertura excessivamente absorvente.",assessment:{bed:"slough",exudate:"low",skin:"intact",infection:"absent"},preferred:["saline","hydrogel"],allowed:["saline","hydrogel","foam"],avoid:["alginate","silver","phmb"],rationale:"Ferida ressecada/baixo exsudato não se beneficia de uma cobertura altamente absorvente como alginato. Hidrogel pode doar umidade; antimicrobianos não são escolhidos apenas por rotina quando não há sinais de infecção."}
};
const productNames={saline:"Soro 0,9%",phmb:"PHMB",alginate:"Alginato",silver:"Alginato + prata",barrier:"Creme barreira",hydrogel:"Hidrogel",foam:"Espuma"};
let current=cases.lpp2,selected=[],assessmentConfirmed=false,total=0,completed=0;
const $=id=>document.getElementById(id);
const qsa=s=>Array.from(document.querySelectorAll(s));
function setText(id,v){const el=$(id);if(el)el.textContent=v}
function loadCase(key){
 current=cases[key]||cases.lpp2;selected=[];assessmentConfirmed=false;
 qsa(".case-pill").forEach(b=>b.classList.toggle("is-active",b.dataset.case===current.key));
 setText("caseEyebrow",current.eyebrow);setText("caseTitle",current.title);setText("casePain",current.pain);setText("caseTemp",current.temp);setText("caseTime",current.time);setText("caseHistory",current.history);setText("caseObjective",current.objective);
 $("skinStage").dataset.wound=current.key;
 ["bedSelect","exudateSelect","skinSelect","infectionSelect"].forEach(id=>$(id).value="");
 hideFeedback("assessmentFeedback");hideFeedback("treatmentFeedback");renderSequence();
 qsa(".product-card").forEach(b=>b.classList.remove("is-selected"));
}
function hideFeedback(id){const el=$(id);el.hidden=true;el.className="feedback-box"+(id==="treatmentFeedback"?" treatment-feedback":"");el.innerHTML=""}
function assessmentScore(){
 const fields=[["bedSelect","bed"],["exudateSelect","exudate"],["skinSelect","skin"],["infectionSelect","infection"]];
 let correct=0,wrong=[];
 fields.forEach(([id,k])=>{if($(id).value===current.assessment[k])correct++;else wrong.push(k)});
 return {correct,wrong};
}
function confirmAssessment(){
 const vals=["bedSelect","exudateSelect","skinSelect","infectionSelect"].map(id=>$(id).value);
 const fb=$("assessmentFeedback");
 if(vals.some(v=>!v)){fb.hidden=false;fb.classList.add("is-warn");fb.textContent="Complete todos os campos antes de confirmar.";return}
 const r=assessmentScore();assessmentConfirmed=true;fb.hidden=false;
 if(r.correct===4){fb.classList.add("is-good");fb.innerHTML="<strong>Avaliação correta.</strong> Você identificou os quatro elementos essenciais deste caso."}
 else{fb.classList.add("is-warn");fb.innerHTML="<strong>"+r.correct+"/4 itens corretos.</strong> Revise a imagem e a história clínica antes de montar a cobertura."}
}
function toggleProduct(key){
 const i=selected.indexOf(key);
 if(i>=0)selected.splice(i,1);else selected.push(key);
 qsa(".product-card").forEach(b=>b.classList.toggle("is-selected",selected.includes(b.dataset.product)));
 renderSequence();
}
function renderSequence(){
 const host=$("sequenceList");
 if(!selected.length){host.innerHTML='<span class="empty-sequence">Nenhum produto selecionado.</span>';return}
 host.innerHTML=selected.map((k,i)=>'<span class="sequence-chip"><span>'+(i+1)+'</span>'+productNames[k]+'</span>').join("");
}
function finishTreatment(){
 const fb=$("treatmentFeedback");fb.hidden=false;fb.className="feedback-box treatment-feedback";
 if(!assessmentConfirmed){fb.classList.add("is-warn");fb.innerHTML="<strong>Faça a avaliação primeiro.</strong> O laboratório exige raciocínio clínico antes da escolha da cobertura.";return}
 if(!selected.length){fb.classList.add("is-warn");fb.textContent="Escolha pelo menos um produto.";return}
 const assess=assessmentScore().correct;
 let score=assess*10,notes=[];
 current.preferred.forEach(p=>{if(selected.includes(p))score+=12;else notes.push("Faltou considerar "+productNames[p]+".")});
 selected.forEach(p=>{if(current.avoid.includes(p)){score-=10;notes.push(productNames[p]+" não é uma boa escolha para este cenário.")}else if(!current.allowed.includes(p)){score-=4}});
 if(selected[0]==="saline")score+=4;else notes.push("Considere começar pela limpeza/irrigação quando indicada.");
 score=Math.max(0,Math.min(100,score));
 total+=score;completed+=1;setText("sessionScore",Math.round(total/completed)+" pts");setText("sessionMeta",completed+" caso"+(completed===1?"":"s")+" concluído"+(completed===1?"":"s"));
 fb.classList.add(score>=75?"is-good":"is-warn");
 fb.innerHTML='<strong class="feedback-score">'+score+'/100</strong><b>'+(score>=85?"Conduta muito coerente.":score>=70?"Boa linha de raciocínio, com pontos para revisar.":"Revise a relação entre leito, exsudato, biocarga e cobertura.")+'</b>'+(notes.length?'<ul class="feedback-list">'+notes.map(n=>"<li>"+n+"</li>").join("")+"</ul>":"")+'<p style="margin:8px 0 0">'+current.rationale+'</p>';
}
function showRationale(){
 const fb=$("treatmentFeedback");fb.hidden=false;fb.className="feedback-box treatment-feedback is-good";fb.innerHTML="<strong>Raciocínio esperado</strong><p style='margin:6px 0 0'>"+current.rationale+"</p>"
 fb.scrollIntoView({behavior:"smooth",block:"nearest"});
}
qsa(".case-pill").forEach(b=>b.addEventListener("click",()=>loadCase(b.dataset.case)));
qsa(".product-card").forEach(b=>b.addEventListener("click",()=>toggleProduct(b.dataset.product)));
$("confirmAssessment").addEventListener("click",confirmAssessment);
$("finishTreatment").addEventListener("click",finishTreatment);
$("clearTreatment").addEventListener("click",()=>{selected=[];qsa(".product-card").forEach(b=>b.classList.remove("is-selected"));renderSequence();hideFeedback("treatmentFeedback")});
$("randomCaseButton").addEventListener("click",()=>{const keys=Object.keys(cases).filter(k=>k!==current.key);loadCase(keys[Math.floor(Math.random()*keys.length)])});
$("showRationale").addEventListener("click",showRationale);
loadCase("lpp2");
})();