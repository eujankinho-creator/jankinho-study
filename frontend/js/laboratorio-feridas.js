(function(){
"use strict";
const cases={
 lpp2:{key:"lpp2",eyebrow:"CASO 01 · LPP ESTÁGIO 2",title:"Lesão por pressão em região sacral",pain:"Dor 4/10",temp:"Afebril",time:"Há 3 dias",history:"Pessoa com mobilidade reduzida, pele exposta à umidade e lesão superficial sacral. Sem odor forte ou secreção purulenta.",objective:"Limpar, proteger o leito e reduzir agressão por umidade/pressão.",assessment:{bed:"dermis",exudate:"low",skin:"erythema",infection:"absent"},preferred:["saline","barrier","foam"],allowed:["saline","barrier","foam"],avoid:["silver","alginate","phmb"],rationale:"LPP estágio 2 superficial, com baixo exsudato e sem sinais locais de infecção. A prioridade é limpeza, proteção do leito e da pele perilesional, além de alívio de pressão. Creme barreira protege a pele ao redor/umidade; não é tratamento do leito por si só."},
 venous:{key:"venous",eyebrow:"CASO 02 · ÚLCERA VENOSA",title:"Úlcera venosa em terço distal da perna",pain:"Dor 3/10",temp:"Afebril",time:"Há 8 semanas",history:"Ferida irregular em região maleolar, edema de membro inferior e exsudato seroso abundante. Sem pus ou piora sistêmica.",objective:"Controlar exsudato e proteger a pele perilesional sem usar antimicrobiano sem indicação.",assessment:{bed:"granulation",exudate:"high",skin:"maceration",infection:"absent"},preferred:["saline","alginate","barrier","foam"],allowed:["saline","alginate","barrier","foam"],avoid:["hydrogel","silver","phmb"],rationale:"Com alto exsudato, materiais absorventes como alginato podem ser úteis. A pele macerada ao redor precisa proteção. Sem sinais de infecção, prata/PHMB não devem ser escolhidos automaticamente. Compressão depende de avaliação vascular e protocolo e não é simulada aqui."},
 infected:{key:"infected",eyebrow:"CASO 03 · INFECÇÃO LOCAL SUSPEITA",title:"Ferida crônica com sinais locais de infecção",pain:"Dor 6/10",temp:"37,7 °C",time:"Há 5 semanas",history:"Lesão sacral crônica profunda, com tecido de granulação e fibrose, maceração periférica, aumento recente da dor, odor e exsudato alterado. Suspeita de infecção local, sem sinais de sepse.",objective:"Limpar, reduzir biocarga e manejar o exsudato. Reconhecer quando antimicrobiano tópico pode ter papel.",assessment:{bed:"granulation",exudate:"moderate",skin:"maceration",infection:"suspected"},preferred:["saline","phmb","silver"],allowed:["saline","phmb","silver","alginate","foam","barrier"],avoid:["hydrogel"],rationale:"Na presença de infecção local suspeita, uma estratégia antimicrobiana pode ser apropriada dentro de um plano completo. PHMB pode ser usado como solução antimicrobiana e prata em cobertura pode ser considerada. Alginato com prata faz mais sentido quando também há exsudato a manejar."},
 dry:{key:"dry",eyebrow:"CASO 04 · BAIXO EXSUDATO",title:"Ferida com fibrina e leito ressecado",pain:"Dor 2/10",temp:"Afebril",time:"Há 12 dias",history:"Ferida pequena, pouca secreção, leito com fibrina aderida e aspecto ressecado. Pele ao redor íntegra e sem sinais de infecção.",objective:"Limpar e favorecer ambiente úmido controlado sem cobertura excessivamente absorvente.",assessment:{bed:"slough",exudate:"low",skin:"intact",infection:"absent"},preferred:["saline","hydrogel"],allowed:["saline","hydrogel","foam"],avoid:["alginate","silver","phmb"],rationale:"Ferida ressecada/baixo exsudato não se beneficia de uma cobertura altamente absorvente como alginato. Hidrogel pode doar umidade; antimicrobianos não são escolhidos apenas por rotina quando não há sinais de infecção."}
};
const productNames={saline:"Soro 0,9%",phmb:"PHMB",alginate:"Alginato",silver:"Alginato + prata",barrier:"Creme barreira",hydrogel:"Hidrogel",foam:"Espuma"};
let current=cases.lpp2,selected=[],assessmentConfirmed=false,total=0,completed=0;
const $=id=>document.getElementById(id);
const qsa=s=>Array.from(document.querySelectorAll(s));
function setText(id,v){const el=$(id);if(el)el.textContent=v}
function loadCase(key){
 current=cases[key]||cases.lpp2;selected=[];assessmentConfirmed=false;resetProcedure();activateWorkflow("assessment");
 qsa(".case-pill").forEach(b=>b.classList.toggle("is-active",b.dataset.case===current.key));
 setText("caseEyebrow",current.eyebrow);setText("caseTitle",current.title);setText("casePain",current.pain);setText("caseTemp",current.temp);setText("caseTime",current.time);setText("caseHistory",current.history);setText("caseObjective",current.objective);
 $("skinStage").dataset.wound=current.key;
 loadClinicalReference();drawClinicalWound();setClinicalZoom(1);clinicalInspect=false;$("inspectWound").setAttribute("aria-pressed","false");$("clinicalInspection").hidden=true;
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
 if(vals.some(v=>!v)){fb.hidden=false;fb.className="feedback-box is-warn";fb.textContent="Complete todos os campos antes de confirmar.";return}
 const r=assessmentScore();assessmentConfirmed=true;fb.hidden=false;fb.className="feedback-box";activateWorkflow("procedure");
 if(r.correct===4){fb.classList.add("is-good");fb.innerHTML="<strong>Avaliação correta.</strong> Você identificou os quatro elementos essenciais deste caso."}
 else{fb.classList.add("is-warn");fb.innerHTML="<strong>"+r.correct+"/4 itens corretos.</strong> Revise a imagem e a história clínica antes de montar a cobertura."}
}
function toggleProduct(key){
 if(!assessmentConfirmed){procedureMessage("Avalie primeiro","Preencha e confirme os quatro itens da avaliação antes de manipular materiais.");return}
 if(procedure.tool===key)procedure.tool=null;else procedure.tool=key;
 qsa(".product-card").forEach(b=>{const yes=b.dataset.product===procedure.tool;b.classList.toggle("is-armed",yes);b.setAttribute("aria-pressed",String(yes))});
 if(key==="gauze"&&procedure.tool==="gauze"&&!procedure.fluid)procedureMessage("Prepare a gaze","Selecione soro ou PHMB e toque na bancada de preparo.");
 else if(procedure.tool==="gauze")procedureMessage("Limpeza do leito","Deslize a gaze preparada suavemente sobre o leito, sem esfregar o tecido.");
 else if(procedure.tool==="barrier")procedureMessage("Proteção perilesional","Passe o creme na pele ao redor da ferida, nunca sobre o leito.");
 else if(["saline","phmb"].includes(procedure.tool))procedureMessage("Solução selecionada","Solte a solução na bancada de gaze ou toque nela para preparar a gaze.");
 else if(procedure.tool)procedureMessage("Cobertura selecionada","Arraste até o leito ou toque na região central da ferida para posicionar.");
}
function renderSequence(){
 const host=$("sequenceList");
 if(!selected.length){host.innerHTML='<span class="empty-sequence">Nenhum produto selecionado.</span>';return}
 host.innerHTML=selected.map((k,i)=>'<span class="sequence-chip"><span>'+(i+1)+'</span>'+productNames[k]+'</span>').join("");
}
function finishTreatment(){
 const fb=$("treatmentFeedback");fb.hidden=false;fb.className="feedback-box treatment-feedback";
 if(procedure.finished){fb.scrollIntoView({block:"nearest",behavior:"smooth"});return}
 if(!assessmentConfirmed){fb.classList.add("is-warn");fb.textContent="Confirme a avaliação antes do procedimento.";return}
 const notes=[];let score=assessmentScore().correct*10;
 if(procedure.cleaned)score+=20;else notes.push("Limpeza não concluída: prepare a gaze e passe suavemente pelo leito.");
 const desired=current.key==="dry"?"hydrogel":current.key==="infected"?"silver":current.key==="venous"?"alginate":"foam";
 if(procedure.dressing===desired)score+=20;
 else if(current.allowed.includes(procedure.dressing)) {score+=10;notes.push("A cobertura pode ter utilidade, mas não é a opção-alvo deste exercício.")}
 else notes.push("Revise a adequação da cobertura ao exsudato e ao estado do leito.");
 const wantsBarrier=current.key==="lpp2"||current.key==="venous";
 if(wantsBarrier){if(procedure.barrier)score+=12;else notes.push("Proteção perilesional não realizada apesar da exposição à umidade.")}
 else score+=12;
 if(current.key==="infected"){
   if(procedure.phmbUsed)score+=8;
   else notes.push("Considere o controle de biocarga diante da suspeita de infecção local, conforme avaliação/protocolo.");
 }else if(!procedure.phmbUsed)score+=8;
 else {notes.push("PHMB aplicado sem indicação clara neste cenário.");score-=7}
 if(procedure.misapplications) {score-=procedure.misapplications*9;notes.push("Algumas aplicações ocorreram na zona incorreta ou em sequência inadequada.")}
 if(procedure.fluid==="phmb"&&current.key!=="infected")score-=4;
 score=Math.max(0,Math.min(100,Math.round(score)));
 total+=score;completed++;setText("sessionScore",Math.round(total/completed)+" pts");setText("sessionMeta",completed+" caso"+(completed===1?"":"s")+" concluído"+(completed===1?"":"s"));
 fb.classList.add(score>=75?"is-good":"is-warn");
 fb.innerHTML='<strong class="feedback-score">'+score+'/100</strong><strong>'+(score>=85?"Boa execução e seleção clínica.":score>=70?"Boa execução, com ajustes necessários.":"Revise avaliação, preparo e técnica de aplicação.")+'</strong>'+(notes.length?'<ul class="feedback-list">'+notes.map(n=>"<li>"+n+"</li>").join("")+"</ul>":"")+'<p style="margin:10px 0 0">'+current.rationale+'</p><p style="margin:6px 0 0">Simulação educativa: seleção final de coberturas e tratamentos depende do exame clínico e do protocolo local.</p>';
 procedure.finished=true;
}
function showRationale(){
 const fb=$("treatmentFeedback");fb.hidden=false;fb.className="feedback-box treatment-feedback is-good";fb.innerHTML="<strong>Raciocínio esperado</strong><p style='margin:6px 0 0'>"+current.rationale+"</p>"
 fb.scrollIntoView({behavior:"smooth",block:"nearest"});
}
qsa(".case-pill").forEach(b=>b.addEventListener("click",()=>loadCase(b.dataset.case)));
/* Product selection/drag listeners installed below. */
$("confirmAssessment").addEventListener("click",()=>{confirmAssessment();updateProcedureSteps();});
$("finishTreatment").addEventListener("click",finishTreatment);
$("clearTreatment").addEventListener("click",()=>{resetProcedure();selected=[];renderSequence();hideFeedback("treatmentFeedback");drawClinicalWound();procedureMessage("Técnica reiniciada","Escolha solução e prepare a gaze novamente.");});
$("randomCaseButton").addEventListener("click",()=>{const keys=Object.keys(cases).filter(k=>k!==current.key);loadCase(keys[Math.floor(Math.random()*keys.length)])});
$("showRationale").addEventListener("click",showRationale);

/* Renderização sob demanda: nenhuma dependência WebGL nem loop de animação. */
const clinicalCanvas=$("clinicalWoundCanvas");
const clinicalCtx=clinicalCanvas.getContext("2d",{alpha:false});
const fluidCanvas=$("fluidWoundCanvas"),fluidCtx=fluidCanvas.getContext("2d",{alpha:true});
let clinicalZoom=1,clinicalInspect=false;
const clinicalSeed={lpp2:17,venous:31,infected:51,dry:79};
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}}

function boundaryPoint(angle,cx,cy,rx,ry,seed){
 const phase=seed*.13;
 // Frequency-limited coastal contour: the edge is asymmetrical and continuous, not a regular oval.
 const wave=1+.105*Math.sin(3*angle+phase)+.062*Math.sin(5*angle-phase*.8)
   +.037*Math.sin(9*angle+phase*1.7)+.017*Math.sin(17*angle-phase*.6);
 const lean=1+.10*Math.cos(angle-1.5);
 return [cx+Math.cos(angle)*rx*wave*lean+Math.sin(2*angle+phase)*6,
         cy+Math.sin(angle)*ry*wave*(1+.045*Math.sin(angle*2-.6))-Math.cos(3*angle)*3];
}
function organicPath(ctx,cx,cy,rx,ry,seed){
 const n=160;
 for(let i=0;i<=n;i++){
   const p=boundaryPoint(i/n*Math.PI*2,cx,cy,rx,ry,seed);
   if(!i)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1]);
 }
 ctx.closePath();
}
function regionPath(ctx,cx,cy,rx,ry,seed){
 ctx.beginPath();organicPath(ctx,cx,cy,rx,ry,seed);
}
function organicStipple(ctx,rnd,cx,cy,rx,ry,n,palette,minR,maxR){
 for(let i=0;i<n;i++){
   const x=cx+(rnd()*2-1)*rx,y=cy+(rnd()*2-1)*ry,rad=minR+rnd()*(maxR-minR);
   ctx.fillStyle=palette[Math.floor(rnd()*palette.length)];
   ctx.beginPath();ctx.moveTo(x-rad,y);
   ctx.quadraticCurveTo(x+rad*(rnd()-.5),y-rad*(.45+rnd()),x+rad,y-rad*.1);
   ctx.quadraticCurveTo(x+rad*.6,y+rad*(.3+rnd()),x-rad,y);
   ctx.fill();
 }
}
function drawClinicalWound(){
 if(!clinicalCtx)return;
 const ctx=clinicalCtx,k=current.key,rnd=mulberry32(clinicalSeed[k]),g=clinicalGeometry();
 const {cx,cy,rx,ry}=g,w=960,h=650;
 ctx.clearRect(0,0,w,h);
 ctx.save();
 const bg=ctx.createLinearGradient(110,0,840,h);
 bg.addColorStop(0,"#cc9780");bg.addColorStop(.47,"#bf806c");bg.addColorStop(1,"#aa7164");
 ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 // Dermal topography: low-contrast pores, mottling, folds and matte lighting.
 for(let i=0;i<24000;i++){
   const x=rnd()*w,y=rnd()*h,v=rnd();
   ctx.fillStyle=v>.61?"rgba(91,54,49,.095)":"rgba(255,228,204,.075)";
   ctx.fillRect(x,y,.3+rnd()*1.4,.4+rnd()*1.4);
 }
 for(let i=0;i<170;i++){
   const x=rnd()*w,y=rnd()*h;
   ctx.strokeStyle="rgba(94,45,42,.04)";ctx.lineWidth=.6+rnd()*.9;
   ctx.beginPath();ctx.moveTo(x,y);
   ctx.bezierCurveTo(x+13,y-5,x+23,y+8,x+32+rnd()*32,y+2);ctx.stroke();
 }
 // Discoloured perilesional skin: distributed capillary redness, edema/maceration according to case.
 const ringScale=k==="infected"?1.65:k==="lpp2"?1.55:k==="venous"?1.5:1.12;
 regionPath(ctx,cx,cy,rx*ringScale,ry*ringScale,clinicalSeed[k]);ctx.save();ctx.clip();
 const ery=ctx.createRadialGradient(cx,cy,rx*.64,cx,cy,rx*1.65);
 const red=k==="infected"?"rgba(161,37,49,.55)":k==="lpp2"?"rgba(172,55,59,.43)":k==="venous"?"rgba(125,62,60,.36)":"rgba(144,81,69,.13)";
 ery.addColorStop(0,red);ery.addColorStop(.6,red);ery.addColorStop(1,"rgba(160,45,50,0)");
 ctx.fillStyle=ery;ctx.fillRect(cx-rx*2,cy-ry*2,rx*4,ry*4);
 for(let i=0;i<(k==="dry"?650:2900);i++){
   const x=cx+(rnd()*2-1)*rx*ringScale,y=cy+(rnd()*2-1)*ry*ringScale;
   const d=Math.sqrt(((x-cx)/rx)**2+((y-cy)/ry)**2);
   if(d<.93||d>ringScale)returnFill();
   function returnFill(){return}
   if(d>.93&&d<ringScale){
     ctx.fillStyle=rnd()>.49?(k==="infected"?"rgba(114,24,36,.13)":"rgba(124,49,48,.1)"):"rgba(242,176,153,.12)";
     ctx.fillRect(x,y,1+rnd()*4,1+rnd()*2);
   }
 }
 ctx.restore();
 if(k==="venous"){
   for(let i=0;i<115;i++){
     const x=cx+(rnd()*2-1)*rx*1.8,y=cy+(rnd()*2-1)*ry*1.8;
     ctx.strokeStyle="rgba(105,69,68,.055)";ctx.lineWidth=5+rnd()*16;
     ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+12,y+13,x+37,y+3);ctx.stroke();
   }
 }
 // Undercut boundary and layered sloping tissue walls: shallow in stage 2, deeper in infected/dry.
 const deep=k==="lpp2"?9:k==="venous"?18:k==="dry"?25:34;
 ctx.save();ctx.shadowColor="rgba(56,17,20,.74)";ctx.shadowBlur=27;ctx.shadowOffsetY=deep*.5;
 regionPath(ctx,cx,cy+deep*.3,rx+7,ry+8,clinicalSeed[k]);ctx.fillStyle="#683638";ctx.fill();ctx.restore();
 const wallStops=k==="lpp2"?["#a85d5c","#9a4f50","#8d4349"]:["#c17a67","#9c5047","#71363c","#51252d","#76353a"];
 for(let i=0;i<wallStops.length;i++){
   const t=i/(wallStops.length-1),scale=1.08-t*.16;
   regionPath(ctx,cx+(t-.4)*3,cy+t*deep,rx*scale,ry*scale,clinicalSeed[k]);
   ctx.fillStyle=wallStops[i];ctx.fill();
 }
 // Textured, irregular epithelial ridge follows the eroded contour.
 ctx.save();regionPath(ctx,cx,cy,rx*1.06,ry*1.07,clinicalSeed[k]);ctx.clip();
 organicStipple(ctx,rnd,cx,cy,rx*1.2,ry*1.15,900,
   ["rgba(246,176,153,.12)","rgba(77,25,31,.09)","rgba(255,227,204,.12)"],.8,5);
 ctx.restore();
 // True wound bed lies below the skin's upper plane.
 const floorCy=cy+deep*.46,floorRx=rx*.90,floorRy=ry*.87;
 regionPath(ctx,cx,floorCy,floorRx,floorRy,clinicalSeed[k]);ctx.save();ctx.clip();
 const bed=ctx.createLinearGradient(cx-50,cy-ry,cx+30,cy+ry);
 if(k==="lpp2"){bed.addColorStop(0,"#dc7f75");bed.addColorStop(.58,"#c76262");bed.addColorStop(1,"#ad5055")}
 else if(k==="venous"){bed.addColorStop(0,"#d36d66");bed.addColorStop(.55,"#a94145");bed.addColorStop(1,"#77333c")}
 else if(k==="infected"){bed.addColorStop(0,"#ac5852");bed.addColorStop(.5,"#894348");bed.addColorStop(1,"#673b3c")}
 else{bed.addColorStop(0,"#c2a07a");bed.addColorStop(.6,"#a58b6d");bed.addColorStop(1,"#765b4e")}
 ctx.fillStyle=bed;ctx.fillRect(cx-rx,cy-ry-30,rx*2,ry*2+90);
 // Fine organic granules — irregular embedded tissue, not separate polished spheres.
 organicStipple(ctx,rnd,cx,floorCy,floorRx,floorRy,k==="dry"?650:k==="lpp2"?1150:3800,
   k==="dry"?["rgba(200,169,124,.31)","rgba(106,72,57,.13)"]:
   ["rgba(236,115,111,.33)","rgba(88,22,35,.24)","rgba(236,150,131,.16)"],1.5,6.5);
 // Adherent stringy slough lies across the bed in uneven connective streaks.
 const patches=k==="infected"?15:k==="dry"?16:k==="venous"?4:0;
 for(let i=0;i<patches;i++){
   const x=cx+(rnd()-.5)*rx*1.35,y=floorCy+(rnd()-.5)*ry*1.34,size=12+rnd()*(k==="dry"?45:36);
   ctx.save();ctx.translate(x,y);ctx.rotate((rnd()-.5)*1.8);
   ctx.beginPath();ctx.moveTo(-size,0);
   ctx.bezierCurveTo(-size*.6,-size*.5,size*.1,-size*.6,size*.8,-size*.13);
   ctx.bezierCurveTo(size*.95,size*.19,size*.5,size*.35,-size*.5,size*.25);
   ctx.closePath();ctx.fillStyle=i%3===0?"rgba(231,212,148,.76)":"rgba(185,155,105,.72)";ctx.fill();
   ctx.strokeStyle="rgba(231,220,163,.26)";ctx.lineWidth=2;
   for(let z=0;z<3;z++){const yy=(z-1)*5;ctx.beginPath();ctx.moveTo(-size*.7,yy);ctx.quadraticCurveTo(0,yy+5,size*.55,yy-4);ctx.stroke()}
   ctx.restore();
 }
 ctx.restore();
 // Inner pocket shadow, irregular and feathered; no geometric glow rings.
 for(let i=0;i<3;i++){
   regionPath(ctx,cx,cy+deep*.3,rx*(.98-i*.013),ry*(.99-i*.013),clinicalSeed[k]);
   ctx.strokeStyle=["rgba(64,24,32,.35)","rgba(77,29,35,.18)","rgba(93,35,41,.09)"][i];
   ctx.lineWidth=k==="lpp2"?2.5:4+i;
   ctx.stroke();
 }
 // Detached epithelial fragments and subtle maceration flakes on selected sections only.
 for(let i=0;i<(k==="venous"?180:k==="infected"?90:60);i++){
   const a=rnd()*Math.PI*2,p=boundaryPoint(a,cx,cy,rx*(1.03+rnd()*.045),ry*(1.02+rnd()*.08),clinicalSeed[k]);
   ctx.strokeStyle=k==="venous"?"rgba(238,215,197,.25)":"rgba(236,166,155,.23)";
   ctx.lineWidth=.7+rnd()*2.5;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+(rnd()-.5)*7,p[1]-1-rnd()*4);ctx.stroke();
 }
 const shade=ctx.createLinearGradient(0,0,w,h);
 shade.addColorStop(0,"rgba(255,242,216,.05)");shade.addColorStop(.6,"rgba(20,5,6,0)");shade.addColorStop(1,"rgba(27,9,10,.11)");
 ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
 ctx.restore();
 drawFluidFrame(0);
}
function drawFluidFrame(t){
 if(!fluidCtx)return;
 if(clinicalPhotoMode){fluidCtx.clearRect(0,0,960,650);return;}
 const ctx=fluidCtx,k=current.key,wet=k!=="dry",isVenous=k==="venous",isInfected=k==="infected";
 const {cx,cy,rx,ry}=clinicalGeometry();
 ctx.clearRect(0,0,960,650);if(!wet)return;
 ctx.save();regionPath(ctx,cx,cy,rx*.88,ry*.86,clinicalSeed[k]);ctx.clip();
 const opacity=(procedure.cleaned?.55:1)*(isVenous?1:isInfected?.8:.35);
 ctx.globalAlpha=opacity;
 // Translucent gravity-fed film bounded by uneven shorelines; no separate circular puddles.
 const surface=cy+ry*(isVenous?-.15:isInfected?.10:.40);
 const phase=t/2900;
 const grad=ctx.createLinearGradient(0,surface-30,0,cy+ry*.9);
 grad.addColorStop(0,"rgba(237,185,123,0)");
 grad.addColorStop(.42,isInfected?"rgba(209,156,103,.18)":"rgba(252,218,174,.16)");
 grad.addColorStop(1,isVenous?"rgba(228,180,112,.52)":"rgba(236,188,143,.32)");
 ctx.beginPath();
 for(let i=0;i<=30;i++){
   const x=cx-rx+i*(rx*2/30);
   const y=surface+10*Math.sin(i*.56+phase)+4.5*Math.sin(i*1.8-phase*.6)+(i%4===0?1:0);
   if(!i)ctx.moveTo(x,y);else ctx.lineTo(x,y);
 }
 ctx.lineTo(cx+rx,cy+ry+60);ctx.lineTo(cx-rx,cy+ry+60);ctx.closePath();
 ctx.fillStyle=grad;ctx.fill();
 // A thin contact meniscus is irregular, opaque only where the film meets uncovered tissue.
 ctx.lineWidth=1.6;ctx.strokeStyle=isVenous?"rgba(255,232,195,.34)":"rgba(244,212,179,.25)";
 ctx.beginPath();
 for(let i=0;i<=38;i++){
   const x=cx-rx+i*(rx*2/38),y=surface+10*Math.sin(i*.44+phase)+4.5*Math.sin(i*1.44-phase*.6);
   if(!i)ctx.moveTo(x,y);else ctx.lineTo(x,y);
 }ctx.stroke();
 // Irregular vertical channels and translucent thin wet streaks reflect the tilted examination light.
 ctx.lineCap="round";
 for(let i=0;i<(isVenous?11:isInfected?7:3);i++){
   const x=cx-rx*.76+i*rx*.15,y=surface+15+i%3*12;
   const shift=Math.sin(phase+i)*3;
   ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x-6+shift,y+23,x+8-shift,y+35,x-4+shift,y+51);
   ctx.strokeStyle=i%3===0?"rgba(249,226,187,.22)":"rgba(240,199,156,.12)";
   ctx.lineWidth=2+i%2*2;ctx.stroke();
 }
 ctx.restore();
 // Subtle transudate following the lower wound edge only for high-exudate cases.
 if(isVenous&&!procedure.cleaned){
   ctx.save();ctx.globalAlpha=.36;
   for(let i=0;i<3;i++){
     const angle=.8+(i*.34),p=boundaryPoint(angle,cx,cy,rx,ry,clinicalSeed[k]);
     ctx.strokeStyle="#dfbb91";ctx.lineCap="round";ctx.lineWidth=2.3;
     ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.bezierCurveTo(p[0]-1,p[1]+11,p[0]+6,p[1]+22+Math.sin(t/3000+i)*3,p[0]+2,p[1]+29);ctx.stroke();
   }ctx.restore();
 }
}

function setClinicalZoom(value){clinicalZoom=Math.max(1,Math.min(2.25,Math.round(value*100)/100));clinicalCanvas.style.transform="scale("+clinicalZoom+")";clinicalCanvas.style.transformOrigin="center 49%";$("procedureCanvas").style.transform="scale("+clinicalZoom+")";fluidCanvas.style.transform="scale("+clinicalZoom+")";referencePhoto.style.transform="scale("+clinicalZoom+")";setText("zoomWoundLabel",Math.round(clinicalZoom*100)+"%")}
$("zoomOutWound").addEventListener("click",()=>setClinicalZoom(clinicalZoom-.25));
$("zoomInWound").addEventListener("click",()=>setClinicalZoom(clinicalZoom+.25));
$("inspectWound").addEventListener("click",()=>{clinicalInspect=!clinicalInspect;$("inspectWound").setAttribute("aria-pressed",String(clinicalInspect));$("clinicalInspection").hidden=!clinicalInspect;if(clinicalInspect)setText("clinicalInspection","Toque no leito, bordas ou pele ao redor para identificar estruturas.")});
clinicalCanvas.addEventListener("click",event=>{
 if(!clinicalInspect)return;
 const rect=clinicalCanvas.getBoundingClientRect();
 const x=(event.clientX-rect.left)/rect.width*960,y=(event.clientY-rect.top)/rect.height*650;
 const d=Math.sqrt(Math.pow((x-478)/215,2)+Math.pow((y-318)/147,2));
 let text=d<.75?(current.key==="dry"?"Leito: predominam depósitos amarelados de fibrina/esfacelo com pouca umidade.":current.key==="infected"?"No esquema, o leito apresenta áreas viáveis e tecido desvitalizado. Na foto clínica real, observe granulação, fibrose e maceração.":"Leito: tecido vermelho/rosado viável e úmido. Na LPP estágio 2 há exposição da derme, sem tecido de granulação."):(d<1.2?"Bordas: transição epitelial e possível alteração pela umidade; observe irregularidade e coloração.":"Pele perilesional: inspecione eritema, maceração, edema e integridade cutânea.");
 setText("clinicalInspection",text);
});


/* Realce de sinais clinicamente legíveis — eritema periférico, maceração, profundidade e exsudato */
/* Bancada procedural: estado persiste durante o caso e é reiniciado ao trocar de caso */
let procedure={tool:null,fluid:null,prepared:false,cleaned:false,wipeDistance:0,
 barrier:false,periDistance:0,dressing:null,phmbUsed:false,misapplications:0,actions:[],finished:false,
 traces:[],barrierTraces:[]};
let stageGesture=null,materialGesture=null,suppressToolClickUntil=0;
const procedureCanvas=$("procedureCanvas"),procedureCtx=procedureCanvas.getContext("2d");
function procedureMessage(title,body){
 const el=$("procedureGuide");el.innerHTML="";
 const strong=document.createElement("strong"),span=document.createElement("span");
 strong.textContent=title;span.textContent=body;el.append(strong,span);
 setText("stageTreatmentHint",body.length>65?body.slice(0,62)+"…":body);
}
function updateProcedureSteps(){
 const done=[assessmentConfirmed,procedure.prepared,procedure.cleaned,!!procedure.dressing];
 ["stepAssessment","stepPreparation","stepCleaning","stepCover"].forEach((id,i)=>{
 const el=$(id);el.classList.toggle("is-done",done[i]);el.classList.toggle("is-current",!done[i]&&done.slice(0,i).every(Boolean));
 });
 const names=procedure.actions.map(a=>a.name);
 selected=[...new Set(names.filter(k=>productNames[k]))];
 renderSequence();
 $("gauzePrepZone").classList.toggle("is-loaded",procedure.prepared);
 setText("gauzeState",procedure.fluid==="saline"?"Gaze umedecida com SF 0,9%":procedure.fluid==="phmb"?"Gaze umedecida com PHMB":"Gaze seca — solte soro ou PHMB aqui");
 setText("gauzePrepBadge",procedure.prepared?"PRONTA":"AGUARDANDO");
}
function resetProcedure(){
 procedure={tool:null,fluid:null,prepared:false,cleaned:false,wipeDistance:0,
 barrier:false,periDistance:0,dressing:null,phmbUsed:false,misapplications:0,actions:[],finished:false,
 traces:[],barrierTraces:[]};
 if(procedureCtx)procedureCtx.clearRect(0,0,960,650);
 qsa(".product-card").forEach(b=>{b.classList.remove("is-armed","is-selected");b.setAttribute("aria-pressed","false")});
 updateProcedureSteps();
 procedureMessage("Observe a ferida","Faça a avaliação clínica antes de preparar materiais.");
}
function recordAction(name){procedure.actions.push({name,at:Date.now()});updateProcedureSteps()}
function prepGauze(tool){
 if(!assessmentConfirmed){procedureMessage("Avalie antes","Confirme primeiro a avaliação dos tecidos e sinais locais.");return}
 if(!["saline","phmb"].includes(tool)){procedureMessage("Escolha uma solução","Selecione soro 0,9% ou PHMB antes de tocar na bancada.");return}
 procedure.fluid=tool;procedure.prepared=true;recordAction(tool);procedureMessage("Gaze preparada","Agora selecione Gaze estéril e deslize suavemente sobre o leito.");
}
function clinicalGeometry(){
 const rx=current.key==="venous"?255:current.key==="dry"?174:214;
 const ry=current.key==="venous"?163:current.key==="dry"?112:147;
 return {cx:478,cy:318,rx,ry};
}
function stagePosition(ev){
 const r=clinicalCanvas.getBoundingClientRect();
 if(!r.width||!r.height)return null;
 return {x:(ev.clientX-r.left)/r.width*960,y:(ev.clientY-r.top)/r.height*650};
}
function zoneAt(pos){
 if(!pos)return "outside";
 const g=clinicalGeometry(),d=Math.sqrt(((pos.x-g.cx)/g.rx)**2+((pos.y-g.cy)/g.ry)**2);
 return d<.88?"bed":d<1.57?"peri":"skin";
}
function addMisapplication(reason){procedure.misapplications++;procedureMessage("Atenção à técnica",reason)}
function applyAt(tool,pos){
 if(!assessmentConfirmed){procedureMessage("Avaliação pendente","Confirme a avaliação antes de iniciar a técnica.");return}
 if(procedure.finished){procedureMessage("Caso finalizado","Reinicie a técnica ou selecione outro caso para continuar.");return}
 const zone=zoneAt(pos);
 if(tool==="saline"||tool==="phmb"){procedureMessage("Prepare a gaze","Coloque a solução na bancada de preparo da gaze.");return}
 if(tool==="gauze"){if(!procedure.prepared)procedureMessage("Gaze ainda seca","Prepare a gaze com soro ou PHMB antes da limpeza.");else procedureMessage("Faça passadas suaves","Passe a gaze por diferentes partes do leito, sem esfregar.");return}
 if(tool==="barrier"){
  if(zone!=="peri"){addMisapplication("Creme barreira é para proteção da pele perilesional, não do leito.");return}
  if(!procedure.cleaned){procedureMessage("Limpe primeiro","Conclua a limpeza antes de proteger a perilesão.");return}
  procedure.barrier=true;procedure.periDistance=130;procedure.barrierTraces.push({x:pos.x,y:pos.y});recordAction("barrier");drawProcedureOverlay();
  procedureMessage("Pele protegida","Creme barreira aplicado na pele ao redor, mantendo o leito livre.");
  return;
 }
 if(zone!=="bed"){addMisapplication("A cobertura deve ser posicionada no leito da ferida.");return}
 if(!procedure.cleaned){procedureMessage("Faça a limpeza","Antes da cobertura, prepare a gaze e limpe o leito.");return}
 if(["alginate","silver","foam","hydrogel"].includes(tool)){
   procedure.dressing=tool;recordAction(tool);drawProcedureOverlay();
   procedureMessage("Cobertura posicionada","Verifique se o material é coerente com exsudato, tecido e sinais de infecção.");
 }
}
function drawProcedureOverlay(){
 if(!procedureCtx)return;
 const ctx=procedureCtx;ctx.clearRect(0,0,960,650);ctx.save();
 if(procedure.barrierTraces.length){
  ctx.fillStyle="rgba(248,242,213,.39)";ctx.strokeStyle="rgba(255,246,217,.58)";ctx.lineWidth=26;ctx.lineCap="round";ctx.lineJoin="round";
  for(const p of procedure.barrierTraces){ctx.beginPath();ctx.arc(p.x,p.y,13,0,Math.PI*2);ctx.fill();}
  ctx.beginPath();procedure.barrierTraces.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();
 }
 if(procedure.traces.length){
   ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle="rgba(238,248,251,.20)";ctx.lineWidth=14;
   ctx.beginPath();procedure.traces.forEach((p,i)=>{if(i===0||p.break)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y)});ctx.stroke();
 }
 if(procedure.dressing){
   const g=clinicalGeometry();ctx.save();ctx.translate(g.cx,g.cy);const rx=g.rx*.94,ry=g.ry*.94;
   ctx.shadowBlur=24;ctx.shadowColor="rgba(36,32,33,.42)";ctx.shadowOffsetY=9;
   ctx.beginPath();ctx.ellipse(0,0,rx,ry,-.08,0,2*Math.PI);
   const grad=ctx.createLinearGradient(-rx,-ry,rx,ry);
   if(procedure.dressing==="hydrogel"){grad.addColorStop(0,"rgba(225,244,240,.64)");grad.addColorStop(.6,"rgba(170,225,230,.3)");grad.addColorStop(1,"rgba(229,250,247,.56)")}
   else if(procedure.dressing==="foam"){grad.addColorStop(0,"#ecdecb");grad.addColorStop(.56,"#e7d5bc");grad.addColorStop(1,"#cdbba6")}
   else{grad.addColorStop(0,"#f4eee0");grad.addColorStop(.5,procedure.dressing==="silver"?"#aeb9c3":"#e3ddd2");grad.addColorStop(1,"#d0c9b9")}
   ctx.fillStyle=grad;ctx.fill();ctx.clip();ctx.shadowBlur=0;
   ctx.strokeStyle=procedure.dressing==="silver"?"rgba(87,115,140,.25)":"rgba(147,129,114,.18)";ctx.lineWidth=1;
   for(let y=-ry;y<ry;y+=8){ctx.beginPath();ctx.moveTo(-rx,y);ctx.lineTo(rx,y+6);ctx.stroke()}
   for(let x=-rx;x<rx;x+=9){ctx.beginPath();ctx.moveTo(x,-ry);ctx.lineTo(x+5,ry);ctx.stroke()}
   ctx.restore();
 }
 ctx.restore();
}
function wipeStroke(from,to){
 if(!procedure.prepared){procedureMessage("Prepare a gaze","Selecione soro ou PHMB e umedeça a gaze.");return}
 if(procedure.dressing){procedureMessage("Cobertura já aplicada","Reinicie a técnica para limpar antes da cobertura.");return}
 const z=zoneAt(to);
 if(z!=="bed")return;
 const dx=to.x-from.x,dy=to.y-from.y,step=Math.hypot(dx,dy);
 if(step>110||step<1)return;
 procedure.wipeDistance+=step;
 procedure.traces.push({x:to.x,y:to.y});
 if(procedure.traces.length>300)procedure.traces.shift();
 drawProcedureOverlay();
 if(!procedure.cleaned&&procedure.wipeDistance>160){
   procedure.cleaned=true;recordAction(procedure.fluid);
   if(procedure.fluid==="phmb")procedure.phmbUsed=true;
   drawFluidFrame(0); // após a limpeza, reduzir visualmente o líquido superficial
   procedureMessage("Leito limpo","Limpeza simulada concluída. Continue com proteção perilesional e cobertura.");
 }
}
function applyBarrierStroke(from,to){
 if(!procedure.cleaned)return;
 if(zoneAt(to)!=="peri")return;
 const d=Math.hypot(to.x-from.x,to.y-from.y);if(d>110||d<1)return;
 procedure.periDistance+=d;procedure.barrierTraces.push(to);
 if(procedure.barrierTraces.length>300)procedure.barrierTraces.shift();
 drawProcedureOverlay();
 if(!procedure.barrier&&procedure.periDistance>100){
    procedure.barrier=true;recordAction("barrier");
    procedureMessage("Proteção perilesional","Creme aplicado na pele ao redor. Escolha a cobertura adequada ao exsudato.");
 }
}
$("gauzePrepZone").addEventListener("click",()=>prepGauze(procedure.tool));
/* Tap: select. Pointer drag: drop onto preparation zone or clinical view. */
qsa(".product-card").forEach(btn=>{
 btn.addEventListener("pointerdown",ev=>{
   if(ev.button!==0||!ev.isPrimary)return;
   materialGesture={pointerId:ev.pointerId,tool:btn.dataset.product,x:ev.clientX,y:ev.clientY,moved:false};
 });
 btn.addEventListener("click",()=>{
   if(performance.now()<suppressToolClickUntil)return;
   toggleProduct(btn.dataset.product);
 });
});
let floatingTool=null;
function removeFloating(){
 if(floatingTool){floatingTool.remove();floatingTool=null}
 $("gauzePrepZone").classList.remove("is-over");$("skinStage").classList.remove("is-treatment-target");
}
document.addEventListener("pointermove",ev=>{
 if(!materialGesture||materialGesture.pointerId!==ev.pointerId)return;
 const g=materialGesture;
 if(Math.hypot(ev.clientX-g.x,ev.clientY-g.y)>9)g.moved=true;
 if(!g.moved)return;
 if(!floatingTool){floatingTool=document.createElement("div");floatingTool.className="drag-supply-ghost";document.body.appendChild(floatingTool);floatingTool.textContent=g.tool==="gauze"?"Gaze estéril":productNames[g.tool]||g.tool;}
 floatingTool.style.left=ev.clientX+"px";floatingTool.style.top=ev.clientY+"px";
 const target=document.elementFromPoint(ev.clientX,ev.clientY);
 $("gauzePrepZone").classList.toggle("is-over",Boolean(target&&target.closest("#gauzePrepZone")));
 $("skinStage").classList.toggle("is-treatment-target",Boolean(target&&target.closest("#skinStage")));
});
document.addEventListener("pointerup",ev=>{
 if(!materialGesture||materialGesture.pointerId!==ev.pointerId)return;
 const g=materialGesture;materialGesture=null;
 if(!g.moved){removeFloating();return}
 suppressToolClickUntil=performance.now()+350;
 const target=document.elementFromPoint(ev.clientX,ev.clientY),isPrep=target&&target.closest("#gauzePrepZone"),isStage=target&&target.closest("#skinStage");
 if(isPrep)prepGauze(g.tool);
 else if(isStage){procedure.tool=g.tool;updateProcedureSteps();applyAt(g.tool,stagePosition(ev));}
 else toggleProduct(g.tool);
 removeFloating();
});
document.addEventListener("pointercancel",()=>{materialGesture=null;removeFloating()});
$("skinStage").addEventListener("pointerdown",ev=>{
 if(ev.target.closest(".clinical-controls")||ev.target.closest(".case-vitals"))return;
 if(!assessmentConfirmed||clinicalInspect||!procedure.tool||procedure.finished)return;
 const pos=stagePosition(ev);if(!pos)return;
 stageGesture={pointerId:ev.pointerId,last:pos,moved:0,tool:procedure.tool};
 if(procedure.tool==="gauze"&&procedure.prepared){procedure.traces.push({...pos,break:true});drawProcedureOverlay()}
 if(procedure.tool==="barrier")procedure.barrierTraces.push(pos);
});
$("skinStage").addEventListener("pointermove",ev=>{
 if(!stageGesture||stageGesture.pointerId!==ev.pointerId)return;
 const pos=stagePosition(ev);if(!pos)return;
 if(zoneAt(pos)==="outside")return;
 const prev=stageGesture.last;
 stageGesture.moved+=Math.hypot(pos.x-prev.x,pos.y-prev.y);
 if(stageGesture.tool==="gauze")wipeStroke(prev,pos);
 else if(stageGesture.tool==="barrier")applyBarrierStroke(prev,pos);
 stageGesture.last=pos;
});
function finishStageGesture(ev){
 if(!stageGesture||stageGesture.pointerId!==ev.pointerId)return;
 const g=stageGesture;stageGesture=null;
 if(g.moved<15)applyAt(g.tool,stagePosition(ev));
}
$("skinStage").addEventListener("pointerup",finishStageGesture);
$("skinStage").addEventListener("pointercancel",()=>stageGesture=null);


function activateWorkflow(view){
 const assessment=view==="assessment";
 $("assessmentPanel").hidden=!assessment;$("procedurePanel").hidden=assessment;
 for(const [id,on] of [["tabAssessment",assessment],["tabProcedure",!assessment]]){
  const b=$(id);b.classList.toggle("is-active",on);b.setAttribute("aria-selected",String(on));b.tabIndex=on?0:-1;
 }
}
$("tabAssessment").addEventListener("click",()=>activateWorkflow("assessment"));
$("tabProcedure").addEventListener("click",()=>activateWorkflow("procedure"));
for(const [id,v] of [["tabAssessment","assessment"],["tabProcedure","procedure"]]){
 $(id).addEventListener("keydown",e=>{
  if(e.key==="ArrowRight"||e.key==="ArrowLeft"){
   e.preventDefault();const to=v==="assessment"?"procedure":"assessment";
   activateWorkflow(to);$(to==="assessment"?"tabAssessment":"tabProcedure").focus();
  }
 });
}
let fluidVisible=true;
const reduceFluidMotion=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if("IntersectionObserver" in window){
 const fluidObserver=new IntersectionObserver(entries=>fluidVisible=entries.some(x=>x.isIntersecting),{threshold:.02});
 fluidObserver.observe($("skinStage"));
}
if(!reduceFluidMotion)window.setInterval(()=>{
 if(document.hidden||!fluidVisible||!current||!["venous","infected"].includes(current.key)||procedure.dressing)return;
 drawFluidFrame(performance.now());
},window.matchMedia&&window.matchMedia("(max-width: 820px)").matches?330:170);


/* Fotografias originais, identificadas e licenciadas. Não simulam evolução real após curativos. */
const clinicalReferences={
 lpp2:{url:"https://upload.wikimedia.org/wikipedia/commons/9/90/Decubitus_01.JPG",
  source:"https://commons.wikimedia.org/wiki/File:Decubitus_01.JPG",author:"AfroBrazilian",license:"CC BY-SA 3.0",
  alt:"Fotografia original de lesão por pressão estágio 2 na região sacral.",
  note:"Fotografia real de LPP estágio 2: inspecione a perda parcial de pele e a derme exposta. O histórico e a técnica são simulados."},
 venous:{url:"https://upload.wikimedia.org/wikipedia/commons/3/38/Venous_ulcer_dorsal_leg.jpg",
  source:"https://commons.wikimedia.org/wiki/File:Venous_ulcer_dorsal_leg.jpg",author:"Jonathan Moore",license:"CC BY 3.0",
  alt:"Fotografia clínica de úlcera venosa real em membro inferior.",
  note:"Fotografia real de úlcera venosa: observe bordas e alterações locais. A quantidade de exsudato da atividade é definida pelo caso didático."},
 infected:{url:"https://upload.wikimedia.org/wikipedia/commons/9/94/Decubitus_03.JPG",
  source:"https://commons.wikimedia.org/wiki/File:Decubitus_03.JPG",author:"AfroBrazilian",license:"CC BY-SA 4.0",
  alt:"Fotografia clínica real de lesão sacral profunda com tecido de granulação, fibrose, infecção e maceração.",
  note:"Referência clínica real de lesão sacral profunda com infecção e maceração. A fotografia NÃO permite, isoladamente, confirmar infecção."},
 dry:{url:"https://upload.wikimedia.org/wikipedia/commons/e/e1/Ulcus_01.JPG",
  source:"https://commons.wikimedia.org/wiki/File:Ulcus_01.JPG",author:"AfroBrazilian",license:"CC BY-SA 3.0",
  alt:"Fotografia real de uma úlcera cutânea na região do joelho, usada apenas como comparação de morfologia.",
  note:"Fotografia comparativa de úlcera no joelho, NÃO necessariamente fibrinosa ou seca. Para avaliar a classificação deste caso, considere também a história clínica e o esquema."}
};
let clinicalPhotoMode=true;
let photoGeneration=0;
const referencePhoto=$("clinicalReferencePhoto");
function updatePhotoMode(){
 const stage=$("skinStage");stage.classList.toggle("is-photo-mode",clinicalPhotoMode);
 $("clinicalPhotoMode").setAttribute("aria-pressed",String(clinicalPhotoMode));
 $("clinicalIllustrationMode").setAttribute("aria-pressed",String(!clinicalPhotoMode));
 $("clinicalPhotoCredit").hidden=!clinicalPhotoMode;
 setText("clinicalViewLabel",clinicalPhotoMode?"FOTOGRAFIA CLÍNICA ORIGINAL":"ILUSTRAÇÃO DIDÁTICA INTERATIVA");
 if(clinicalPhotoMode){if(fluidCtx)fluidCtx.clearRect(0,0,960,650)}
 else drawFluidFrame(0);
}
function loadClinicalReference(){
 const reference=clinicalReferences[current.key],generation=++photoGeneration;
 const stage=$("skinStage");stage.classList.remove("is-photo-loaded");
 referencePhoto.alt=reference.alt;
 referencePhoto.onload=()=>{if(generation!==photoGeneration)return;stage.classList.add("is-photo-loaded");updatePhotoMode()};
 referencePhoto.onerror=()=>{if(generation!==photoGeneration)return;stage.classList.remove("is-photo-loaded");setText("woundImageNote","Fotografia temporariamente indisponível. O esquema local permanece disponível.");};
 referencePhoto.src=reference.url;
 if(referencePhoto.complete&&referencePhoto.naturalWidth>0)stage.classList.add("is-photo-loaded");
 $("clinicalPhotoSource").textContent=reference.author+" · Wikimedia Commons";
 $("clinicalPhotoSource").href=reference.source;
 setText("clinicalPhotoCredit", ""); // Créditos reconstruídos com texto e link seguros
 const host=$("clinicalPhotoCredit"),prefix=document.createElement("span"),anchor=document.createElement("a"),suffix=document.createElement("span");
 prefix.textContent="Foto original:";
 anchor.href=reference.source;anchor.target="_blank";anchor.rel="noopener noreferrer";
 anchor.textContent=reference.author+" · Wikimedia Commons";
 suffix.textContent="· "+reference.license+" · efeitos de curativo simulados";
 host.append(prefix,anchor,suffix);
 setText("woundImageNote",reference.note);
 updatePhotoMode();
}
$("clinicalPhotoMode").addEventListener("click",()=>{clinicalPhotoMode=true;updatePhotoMode()});
$("clinicalIllustrationMode").addEventListener("click",()=>{clinicalPhotoMode=false;updatePhotoMode()});

loadCase("lpp2");
})();