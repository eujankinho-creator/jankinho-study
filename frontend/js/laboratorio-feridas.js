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
 drawClinicalWound();setClinicalZoom(1);clinicalInspect=false;$("inspectWound").setAttribute("aria-pressed","false");$("clinicalInspection").hidden=true;
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

/* Renderização sob demanda: nenhuma dependência WebGL nem loop de animação. */
const clinicalCanvas=$("clinicalWoundCanvas");
const clinicalCtx=clinicalCanvas.getContext("2d",{alpha:false});
let clinicalZoom=1,clinicalInspect=false;
const clinicalSeed={lpp2:17,venous:31,infected:51,dry:79};
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}}
function regionPath(ctx,cx,cy,rx,ry,seed){
 const rnd=mulberry32(seed),nodes=[],n=90;
 for(let i=0;i<n;i++){const ang=i*Math.PI*2/n;const wave=1+.09*Math.sin(ang*3+2)+.065*Math.sin(ang*7+.9)+.04*(rnd()-.5);nodes.push([cx+Math.cos(ang)*rx*wave,cy+Math.sin(ang)*ry*wave])}
 ctx.beginPath();ctx.moveTo((nodes[n-1][0]+nodes[0][0])/2,(nodes[n-1][1]+nodes[0][1])/2);
 for(let i=0;i<n;i++){const p=nodes[i],q=nodes[(i+1)%n];ctx.quadraticCurveTo(p[0],p[1],(p[0]+q[0])/2,(p[1]+q[1])/2)}ctx.closePath()
}
function drawClinicalWound(){
 if(!clinicalCtx)return;
 const ctx=clinicalCtx,w=960,h=650,k=current.key,rnd=mulberry32(clinicalSeed[k]),cx=478,cy=318,rx=k==="venous"?255:k==="dry"?174:214,ry=k==="venous"?163:k==="dry"?112:147;
 ctx.save();ctx.clearRect(0,0,w,h);
 const base=ctx.createLinearGradient(0,0,960,650);base.addColorStop(0,"#c99078");base.addColorStop(.35,"#d7a28b");base.addColorStop(.7,"#b77860");base.addColorStop(1,"#a96956");ctx.fillStyle=base;ctx.fillRect(0,0,w,h);
 // Epidermis: pores, subtle freckles and soft fold lines, without synthetic stripes.
 for(let i=0;i<27000;i++){const x=rnd()*w,y=rnd()*h,rad=.35+rnd()*1.15;ctx.fillStyle=rnd()>.55?"rgba(91,46,42,.085)":"rgba(255,239,218,.12)";ctx.beginPath();ctx.ellipse(x,y,rad,rad*.75,0,0,Math.PI*2);ctx.fill()}
 for(let i=0;i<140;i++){const x=rnd()*w,y=rnd()*h,sz=1+rnd()*5;ctx.fillStyle="rgba(101,51,38,.09)";ctx.beginPath();ctx.ellipse(x,y,sz,sz*.7,0,0,Math.PI*2);ctx.fill()}
 for(let i=0;i<75;i++){const x=rnd()*w,y=rnd()*h;ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x+18,y-6,x+22,y+5,x+40+rnd()*35,y-2);ctx.strokeStyle="rgba(103,52,47,.045)";ctx.lineWidth=.6+rnd();ctx.stroke()}
 // surrounding tissue edema, erythema, venous discoloration, inflammation
 ctx.save();ctx.translate(cx,cy);ctx.scale(1.28,1.32);const peri=ctx.createRadialGradient(0,0,rx*.5,0,0,rx*1.1);
 const e=k==="infected"?"rgba(165,27,39,.58)":k==="venous"?"rgba(104,65,68,.4)":"rgba(166,58,59,.36)";
 peri.addColorStop(0,e);peri.addColorStop(.68,k==="venous"?"rgba(121,68,73,.25)":"rgba(166,55,54,.16)");peri.addColorStop(1,"rgba(158,64,55,0)");
 ctx.fillStyle=peri;ctx.beginPath();ctx.ellipse(0,0,rx*1.18,ry*1.35,0,0,Math.PI*2);ctx.fill();ctx.restore();
 if(k==="venous"){for(let i=0;i<95;i++){const x=rnd()*w,y=rnd()*h;ctx.fillStyle="rgba(100,60,55,.055)";ctx.beginPath();ctx.ellipse(x,y,8+rnd()*25,4+rnd()*15,0,0,Math.PI*2);ctx.fill()}}
 // Wound cavity with irregular border and recessed shading
 ctx.save();ctx.shadowColor="rgba(72,23,27,.82)";ctx.shadowBlur=25;ctx.shadowOffsetY=12;regionPath(ctx,cx,cy,rx+11,ry+10,clinicalSeed[k]);ctx.fillStyle=k==="dry"?"#795044":"#873c41";ctx.fill();ctx.restore();
 regionPath(ctx,cx,cy,rx+12,ry+11,clinicalSeed[k]);ctx.strokeStyle=k==="venous"?"rgba(241,207,169,.65)":"rgba(237,145,132,.77)";ctx.lineWidth=k==="venous"?19:12;ctx.stroke();
 regionPath(ctx,cx,cy,rx,ry,clinicalSeed[k]);ctx.save();ctx.clip();
 const bed=ctx.createRadialGradient(cx-65,cy-48,10,cx,cy,rx+55);
 if(k==="dry"){bed.addColorStop(0,"#b9a074");bed.addColorStop(.55,"#a18b65");bed.addColorStop(1,"#7d574a")}
 else if(k==="infected"){bed.addColorStop(0,"#a24e4c");bed.addColorStop(.58,"#84393b");bed.addColorStop(1,"#5e242d")}
 else {bed.addColorStop(0,"#d76462");bed.addColorStop(.65,"#ad4347");bed.addColorStop(1,"#682a38")}
 ctx.fillStyle=bed;ctx.fillRect(cx-rx-30,cy-ry-30,rx*2+60,ry*2+60);
 // Tissue-rich granulation: micro-lobules, capillaries and irregular wet specular reflections
 const n=k==="dry"?550:3500;
 for(let i=0;i<n;i++){
  const x=cx+(rnd()*2-1)*rx*1.07,y=cy+(rnd()*2-1)*ry*1.11,z=1+rnd()*5.2;
  ctx.fillStyle=k==="dry"?(rnd()>.5?"rgba(213,175,103,.44)":"rgba(103,59,43,.19)"):(rnd()>.54?"rgba(238,114,104,.42)":"rgba(93,15,32,.26)");
  ctx.beginPath();ctx.ellipse(x,y,z,z*(.5+rnd()*.55),rnd()*Math.PI,0,Math.PI*2);ctx.fill();
 }
 // Coherent islands of slough over granular bed
 const sloughCount=k==="infected"?14:k==="dry"?15:k==="venous"?5:0;
 for(let i=0;i<sloughCount;i++){
   const x=cx+(rnd()-.5)*rx*1.3,y=cy+(rnd()-.5)*ry*1.3,s=13+rnd()*(k==="dry"?47:34);
   const g=ctx.createRadialGradient(x,y,2,x,y,s);g.addColorStop(0,k==="infected"?"rgba(231,218,144,.92)":"rgba(229,206,139,.87)");g.addColorStop(.57,"rgba(194,166,108,.75)");g.addColorStop(1,"rgba(148,116,82,0)");
   ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,s,s*(.3+rnd()*.5),rnd()*3,0,Math.PI*2);ctx.fill();
 }
 if(k!=="dry"){
  for(let i=0;i<(k==="venous"?120:k==="infected"?100:45);i++){
   const x=cx+(rnd()-.5)*rx*1.65,y=cy+(rnd()-.5)*ry*1.55;
   ctx.fillStyle=k==="infected"?"rgba(235,217,145,.2)":"rgba(255,224,187,.16)";
   ctx.beginPath();ctx.ellipse(x,y,1+rnd()*8,.5+rnd()*2,rnd()*3,0,Math.PI*2);ctx.fill()
  }
 }
 ctx.restore();
 // Delicate epithelial rim, not identical to slough
 regionPath(ctx,cx,cy,rx+2,ry+1,clinicalSeed[k]);ctx.strokeStyle="rgba(245,165,156,.45)";ctx.lineWidth=5;ctx.stroke();
 // Clinical illumination and microtopography
 const light=ctx.createLinearGradient(0,0,850,650);light.addColorStop(0,"rgba(255,243,218,.10)");light.addColorStop(.55,"rgba(255,255,255,0)");light.addColorStop(1,"rgba(27,11,16,.18)");ctx.fillStyle=light;ctx.fillRect(0,0,w,h);
 // Dark side vignette for physical depth
 const vign=ctx.createRadialGradient(w/2,h/2,170,w/2,h/2,620);vign.addColorStop(0,"rgba(20,8,11,0)");vign.addColorStop(1,"rgba(31,11,14,.24)");ctx.fillStyle=vign;ctx.fillRect(0,0,w,h);
 ctx.restore();
}
function setClinicalZoom(value){clinicalZoom=Math.max(1,Math.min(2.25,Math.round(value*100)/100));clinicalCanvas.style.transform="scale("+clinicalZoom+")";clinicalCanvas.style.transformOrigin="center 49%";setText("zoomWoundLabel",Math.round(clinicalZoom*100)+"%")}
$("zoomOutWound").addEventListener("click",()=>setClinicalZoom(clinicalZoom-.25));
$("zoomInWound").addEventListener("click",()=>setClinicalZoom(clinicalZoom+.25));
$("inspectWound").addEventListener("click",()=>{clinicalInspect=!clinicalInspect;$("inspectWound").setAttribute("aria-pressed",String(clinicalInspect));$("clinicalInspection").hidden=!clinicalInspect;if(clinicalInspect)setText("clinicalInspection","Toque no leito, bordas ou pele ao redor para identificar estruturas.")});
clinicalCanvas.addEventListener("click",event=>{
 if(!clinicalInspect)return;
 const rect=clinicalCanvas.getBoundingClientRect();
 const x=(event.clientX-rect.left)/rect.width*960,y=(event.clientY-rect.top)/rect.height*650;
 const d=Math.sqrt(Math.pow((x-478)/215,2)+Math.pow((y-318)/147,2));
 let text=d<.75?(current.key==="dry"?"Leito: predominam depósitos amarelados de fibrina/esfacelo com pouca umidade.":current.key==="infected"?"Leito: esfacelo amarelado misturado a tecido avermelhado e exsudato alterado.":"Leito: tecido predominantemente vermelho, úmido e granular."):(d<1.2?"Bordas: transição epitelial e possível alteração pela umidade; observe irregularidade e coloração.":"Pele perilesional: inspecione eritema, maceração, edema e integridade cutânea.");
 setText("clinicalInspection",text);
});

loadCase("lpp2");
})();