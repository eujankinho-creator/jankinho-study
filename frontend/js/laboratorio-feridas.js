(function(){
"use strict";
const cases={
 lpp2:{key:"lpp2",eyebrow:"CASO 01 · LPP ESTÁGIO 2",title:"Lesão por pressão em região sacral",pain:"Dor 4/10",temp:"Afebril",time:"Há 3 dias",history:"Pessoa com mobilidade reduzida, pele exposta à umidade e lesão superficial sacral. Sem odor forte ou secreção purulenta.",objective:"Limpar, proteger o leito e reduzir agressão por umidade/pressão.",assessment:{bed:"dermis",exudate:"low",skin:"erythema",infection:"absent"},preferred:["saline","barrier","foam"],allowed:["saline","barrier","foam"],avoid:["silver","alginate","phmb"],rationale:"LPP estágio 2 superficial, com baixo exsudato e sem sinais locais de infecção. A prioridade é limpeza, proteção do leito e da pele perilesional, além de alívio de pressão. Creme barreira protege a pele ao redor/umidade; não é tratamento do leito por si só."},
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
 current=cases[key]||cases.lpp2;selected=[];assessmentConfirmed=false;resetProcedure();
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
 drawClinicalSigns(ctx,cx,cy,rx,ry,k,rnd);
 ctx.restore();
}
function setClinicalZoom(value){clinicalZoom=Math.max(1,Math.min(2.25,Math.round(value*100)/100));clinicalCanvas.style.transform="scale("+clinicalZoom+")";clinicalCanvas.style.transformOrigin="center 49%";$("procedureCanvas").style.transform="scale("+clinicalZoom+")";setText("zoomWoundLabel",Math.round(clinicalZoom*100)+"%")}
$("zoomOutWound").addEventListener("click",()=>setClinicalZoom(clinicalZoom-.25));
$("zoomInWound").addEventListener("click",()=>setClinicalZoom(clinicalZoom+.25));
$("inspectWound").addEventListener("click",()=>{clinicalInspect=!clinicalInspect;$("inspectWound").setAttribute("aria-pressed",String(clinicalInspect));$("clinicalInspection").hidden=!clinicalInspect;if(clinicalInspect)setText("clinicalInspection","Toque no leito, bordas ou pele ao redor para identificar estruturas.")});
clinicalCanvas.addEventListener("click",event=>{
 if(!clinicalInspect)return;
 const rect=clinicalCanvas.getBoundingClientRect();
 const x=(event.clientX-rect.left)/rect.width*960,y=(event.clientY-rect.top)/rect.height*650;
 const d=Math.sqrt(Math.pow((x-478)/215,2)+Math.pow((y-318)/147,2));
 let text=d<.75?(current.key==="dry"?"Leito: predominam depósitos amarelados de fibrina/esfacelo com pouca umidade.":current.key==="infected"?"Leito: esfacelo amarelado misturado a tecido avermelhado e exsudato alterado.":"Leito: tecido vermelho/rosado viável e úmido. Na LPP estágio 2 há exposição da derme, sem tecido de granulação."):(d<1.2?"Bordas: transição epitelial e possível alteração pela umidade; observe irregularidade e coloração.":"Pele perilesional: inspecione eritema, maceração, edema e integridade cutânea.");
 setText("clinicalInspection",text);
});


/* Realce de sinais clinicamente legíveis — eritema periférico, maceração, profundidade e exsudato */
function drawClinicalSigns(ctx,cx,cy,rx,ry,k,rnd){
 const inflamed=k==="infected",venous=k==="venous",dry=k==="dry",stage2=k==="lpp2";
 ctx.save();
 // Intensidade heterogênea e não circular do eritema, sobretudo no cenário infeccioso.
 const count=inflamed?34:stage2?20:venous?13:3;
 for(let i=0;i<count;i++){
   const angle=i*Math.PI*2/count+(rnd()-.5)*.45,ring=1.1+(rnd()-.5)*.34;
   const x=cx+Math.cos(angle)*rx*ring,y=cy+Math.sin(angle)*ry*ring;
   const rad=(inflamed?62:stage2?51:42)*(0.6+rnd()*.55);
   const g=ctx.createRadialGradient(x,y,0,x,y,rad);
   g.addColorStop(0,inflamed?"rgba(177,29,40,.33)":stage2?"rgba(181,35,51,.27)":"rgba(112,43,49,.13)");
   g.addColorStop(1,"rgba(166,47,46,0)");
   ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,rad,rad*.72,angle,0,Math.PI*2);ctx.fill();
 }
 // Bordas com depressão física: sombra interna escura e parede lateral com brilho na crista.
 ctx.save();ctx.shadowColor="rgba(58,15,23,.8)";ctx.shadowBlur=20;ctx.shadowOffsetY=11;
 regionPath(ctx,cx,cy,rx+1,ry+1,clinicalSeed[k]);ctx.lineWidth=stage2?11:venous?24:23;
 ctx.strokeStyle=stage2?"rgba(97,39,44,.66)":"rgba(73,25,31,.84)";ctx.stroke();ctx.restore();
 regionPath(ctx,cx,cy,rx-7,ry-7,clinicalSeed[k]);ctx.lineWidth=stage2?6:17;
 ctx.strokeStyle=dry?"rgba(158,105,75,.48)":"rgba(194,103,100,.53)";ctx.stroke();
 regionPath(ctx,cx,cy-3,rx+8,ry+8,clinicalSeed[k]);ctx.lineWidth=4;
 ctx.strokeStyle=venous?"rgba(240,221,198,.8)":"rgba(250,172,155,.68)";ctx.stroke();
 if(venous){
   // Bordas maceradas: irregularidade esbranquiçada localizada, não uniformemente saudável.
   for(let i=0;i<55;i++){const a=rnd()*Math.PI*2,x=cx+Math.cos(a)*(rx+9+rnd()*13),y=cy+Math.sin(a)*(ry+10+rnd()*10);
     ctx.fillStyle="rgba(246,231,207,.29)";ctx.beginPath();ctx.ellipse(x,y,2+rnd()*7,1.3+rnd()*4,a,0,Math.PI*2);ctx.fill();
   }
 }
 // Exsudato realçado por película de fluido, menisco e microreflexos especulares.
 if(!dry){
  ctx.save();regionPath(ctx,cx,cy,rx-13,ry-12,clinicalSeed[k]);ctx.clip();
  const pools=venous?4:inflamed?3:1,fluidAlpha=venous?.7:inflamed?.55:.24;
  for(let i=0;i<pools;i++){
    const x=cx+(rnd()-.5)*rx*.95,y=cy+ry*(.12+rnd()*.57),pw=(venous?90:inflamed?65:40)*(0.65+rnd()*.6),ph=(venous?33:inflamed?26:17)*(0.65+rnd()*.5);
    ctx.save();ctx.translate(x,y);ctx.rotate((rnd()-.5)*.32);
    const g=ctx.createLinearGradient(0,-ph,0,ph);
    g.addColorStop(0,"rgba(255,249,231,0)");
    g.addColorStop(.42,venous?"rgba(239,204,136,.17)":inflamed?"rgba(229,188,102,.29)":"rgba(255,235,206,.09)");
    g.addColorStop(1,venous?"rgba(236,188,91,.53)":inflamed?"rgba(208,168,74,.5)":"rgba(255,210,185,.2)");
    ctx.fillStyle=g;ctx.globalAlpha=fluidAlpha+.15;
    ctx.beginPath();ctx.ellipse(0,0,pw,ph,0,0,2*Math.PI);ctx.fill();
    ctx.globalAlpha=fluidAlpha;ctx.strokeStyle="rgba(255,248,227,.62)";ctx.lineWidth=2.1;ctx.beginPath();ctx.ellipse(0,-ph*.34,pw*.76,ph*.43,0,Math.PI*.97,Math.PI*1.86);ctx.stroke();ctx.restore();
  }
  const drops=venous?95:inflamed?55:15;
  for(let i=0;i<drops;i++){
    const x=cx+(rnd()-.5)*rx*1.68,y=cy+(rnd()-.5)*ry*1.55;
    ctx.fillStyle=venous?"rgba(255,245,213,.46)":"rgba(255,244,222,.33)";
    ctx.beginPath();ctx.ellipse(x,y,.6+rnd()*2.6,.3+rnd()*1.15,rnd()*2,0,2*Math.PI);ctx.fill();
  }
  ctx.restore();
  if(venous){
    // Escorrimento superficial translúcido na borda inferior (sem simular hemorragia).
    for(let i=0;i<3;i++){
      const x=cx-78+i*63,top=cy+ry*.82;
      ctx.strokeStyle=i===1?"rgba(229,189,104,.33)":"rgba(255,225,171,.24)";
      ctx.lineWidth=5+i*2;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(x,top);ctx.bezierCurveTo(x-10,top+22,x+6,top+37,x-4,top+45+i*8);ctx.stroke();
      ctx.strokeStyle="rgba(255,248,221,.31)";ctx.lineWidth=1.5;ctx.stroke();
    }
  }
 }
 ctx.restore();
}
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
   drawClinicalWound(); // only once after meaningful cleaning, no rendering loop
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

loadCase("lpp2");
})();