
(function(){
  "use strict";

  function $(id){return document.getElementById(id);}
  function $all(sel){return Array.prototype.slice.call(document.querySelectorAll(sel));}

  const pathways={
    gs:{
      key:"gs",family:"s",kicker:"VIA GS",title:"Gs estimula a adenilato ciclase",
      description:"Gαs-GTP ativa a adenilato ciclase, aumentando a conversão de ATP em cAMP e a ativação de PKA.",
      effectorShort:"AC",effectorName:"adenilato ciclase",effectorPill:"AC ↑",messengerPill:"cAMP ↑",
      effectorStep:"adenilato ciclase",messengerStep:"cAMP",responseStep:"PKA",
      memoryRule:"Gs = estimula AC",memoryText:"Gs aumenta adenilato ciclase, cAMP e sinalização dependente de PKA.",
      substrate:"ATP",effectorState:"ativada"
    },
    gi:{
      key:"gi",family:"i/o",kicker:"VIA GI/O",title:"Gi/o inibe a adenilato ciclase",
      description:"Gαi-GTP reduz a atividade da adenilato ciclase, diminuindo cAMP e reduzindo ativação de PKA.",
      effectorShort:"AC",effectorName:"adenilato ciclase",effectorPill:"AC ↓",messengerPill:"cAMP ↓",
      effectorStep:"adenilato ciclase",messengerStep:"cAMP reduzido",responseStep:"PKA reduzida",
      memoryRule:"Gi = inibe AC",memoryText:"Gi reduz adenilato ciclase e cAMP. O resultado típico é menor atividade dependente de PKA.",
      substrate:"ATP",effectorState:"inibida"
    },
    gq:{
      key:"gq",family:"q/11",kicker:"VIA GQ/11",title:"Gq/11 ativa PLCβ",
      description:"Gαq-GTP ativa PLCβ, que cliva PIP₂ em IP₃ e DAG. IP₃ libera Ca²⁺ do retículo e DAG + Ca²⁺ favorecem PKC.",
      effectorShort:"PLCβ",effectorName:"fosfolipase C beta",effectorPill:"PLCβ ↑",messengerPill:"IP₃ + DAG",
      effectorStep:"PLCβ",messengerStep:"IP₃ + DAG",responseStep:"Ca²⁺ + PKC",
      memoryRule:"Gq = PLCβ",memoryText:"Gq ativa PLCβ: PIP₂ vira IP₃ + DAG; IP₃ libera Ca²⁺ e DAG/Ca²⁺ ativam PKC.",
      substrate:"PIP₂",effectorState:"ativada"
    },
    g12:{
      key:"g12",family:"12/13",kicker:"VIA G12/13",title:"G12/13 ativa RhoGEFs",
      description:"Gα12/13-GTP ativa RhoGEFs, que promovem RhoA-GTP e sinalização por ROCK, alterando actomiosina, forma e motilidade celular.",
      effectorShort:"RhoGEF",effectorName:"fator de troca de Rho",effectorPill:"RhoGEF ↑",messengerPill:"RhoA-GTP",
      effectorStep:"RhoGEF",messengerStep:"RhoA-GTP",responseStep:"ROCK / citoesqueleto",
      memoryRule:"G12/13 = Rho",memoryText:"G12/13 sinaliza principalmente por RhoGEFs → RhoA → ROCK e remodelamento do citoesqueleto.",
      substrate:"RhoA-GDP",effectorState:"ativado"
    }
  };

  const stepCopy={
    0:{title:"Estado basal",text:"O GPCR está livre. Gα contém GDP e permanece associada ao dímero Gβγ."},
    1:{title:"Ligante ligado ao GPCR",text:"O agonista ocupa o sítio extracelular e estabiliza uma conformação ativa do receptor."},
    2:{title:"Troca de nucleotídeo",text:"O GPCR ativo atua como GEF: GDP deixa Gα e GTP ocupa o sítio nucleotídico."},
    3:{title:"Dissociação funcional",text:"Gα-GTP se separa funcionalmente de Gβγ e passa a interagir com efetores."},
    4:{title:"Efetor modulado",text:"A subunidade Gα-GTP alcança o efetor específico da família selecionada."},
    5:{title:"Sinal intracelular",text:"O efetor modifica a produção de segundos mensageiros ou ativa a próxima etapa da cascata."},
    6:{title:"Resposta celular",text:"A cascata alcança proteínas-alvo e modifica a atividade celular."},
    7:{title:"Desligamento",text:"A atividade GTPase de Gα hidrolisa GTP em GDP + Pi, permitindo reassociação ao dímero Gβγ."}
  };

  let pathway="gs";
  let step=0;
  let ligandBound=false;
  let dragging=false;
  let dragOffset={x:0,y:0};
  let autoTimer=null;

  async function api(url,opts){
    const r=await fetch(url,Object.assign({credentials:"same-origin"},opts||{}));
    if(r.status===401){location.href="/login.html";throw new Error("Não autenticado");}
    if(!r.ok) throw new Error("Falha de autenticação");
    return r.json();
  }

  async function loadUser(){
    try{
      const data=await api("/api/auth/me");
      const u=data.usuario||{};
      const name=u.nome||"Usuário";
      const initial=name.charAt(0).toUpperCase();
      if($("nomeSidebar")) $("nomeSidebar").textContent=name;
      if($("emailSidebar")) $("emailSidebar").textContent=u.email||"";
      if($("nomeHeader")) $("nomeHeader").textContent=name;
      if($("avatarSidebar")) $("avatarSidebar").textContent=initial;
      if($("avatarHeader")) $("avatarHeader").textContent=initial;
    }catch(e){console.error(e);}
  }

  async function logout(){
    try{await fetch("/api/auth/logout",{method:"POST",credentials:"same-origin"});}finally{location.href="/login.html";}
  }

  function ensureRhoModule(){
    if($("rhoModule")) return;
    const field=$("messengerField");
    if(!field) return;
    const node=document.createElement("div");
    node.id="rhoModule";
    node.className="rho-module";
    node.innerHTML='<div class="rho-node">RhoA-GTP</div><i class="rho-arrow a1"></i><div class="rock-node">ROCK</div><i class="rho-arrow a2"></i><div class="cytoskeleton-node">actomiosina<br>citoesqueleto</div>';
    field.appendChild(node);
  }

  function resetLigandPosition(){
    const ligand=$("gpLigand");
    if(!ligand) return;
    ligand.style.left="10%";
    ligand.style.top="105px";
    ligand.classList.remove("is-bound","is-dragging");
  }

  function siteCenter(){
    const stage=$("gpStage"),site=$("gpcrSite");
    const sr=stage.getBoundingClientRect(),rr=site.getBoundingClientRect();
    return {x:rr.left-sr.left+rr.width/2,y:rr.top-sr.top+rr.height/2};
  }

  function ligandCenter(){
    const stage=$("gpStage"),ligand=$("gpLigand");
    const sr=stage.getBoundingClientRect(),lr=ligand.getBoundingClientRect();
    return {x:lr.left-sr.left+lr.width/2,y:lr.top-sr.top+lr.height/2};
  }

  function placeLigandAtSite(){
    const stage=$("gpStage"),ligand=$("gpLigand"),site=$("gpcrSite");
    const sr=stage.getBoundingClientRect(),rr=site.getBoundingClientRect();
    const x=rr.left-sr.left+rr.width/2-ligand.offsetWidth/2;
    const y=rr.top-sr.top+rr.height/2-ligand.offsetHeight/2;
    ligand.style.left=x+"px";
    ligand.style.top=y+"px";
  }

  function bindLigand(){
    clearAuto();
    ligandBound=true;
    placeLigandAtSite();
    $("gpLigand").classList.add("is-bound");
    $("gpStage").classList.add("is-bound");
    $("bindLigandButton").disabled=true;
    $("releaseLigandButton").disabled=false;
    $("nextStepButton").disabled=false;
    setStep(1);
    if($("autoPlayToggle").checked) scheduleAuto();
  }

  function releaseLigand(){
    clearAuto();
    ligandBound=false;
    $("gpStage").classList.remove("is-bound");
    resetLigandPosition();
    $("bindLigandButton").disabled=false;
    $("releaseLigandButton").disabled=true;
    $("nextStepButton").disabled=true;
    setStep(0);
  }

  function scheduleAuto(){
    clearAuto();
    if(!ligandBound || !$("autoPlayToggle").checked || step>=7) return;
    autoTimer=setTimeout(function(){
      if(step<7){
        setStep(step+1);
        if(step<7) scheduleAuto();
      }
    },1100);
  }

  function clearAuto(){
    if(autoTimer){clearTimeout(autoTimer);autoTimer=null;}
  }

  function setStep(n){
    step=Math.max(0,Math.min(7,n));
    const stage=$("gpStage");
    stage.dataset.step=String(step);
    stage.dataset.pathway=pathway;

    $all("#stepList li").forEach(function(li){
      const s=Number(li.dataset.step);
      li.classList.toggle("is-active",s===step);
      li.classList.toggle("is-done",s<step);
    });

    const copy=stepCopy[step];
    $("learningTitle").textContent=copy.title;
    let text=copy.text;
    if(step===4) text="Gα-"+pathways[pathway].family+"-GTP modula "+pathways[pathway].effectorName+".";
    if(step===5){
      if(pathway==="gs") text="A adenilato ciclase aumenta a conversão de ATP em cAMP.";
      if(pathway==="gi") text="A adenilato ciclase é inibida e a produção de cAMP cai.";
      if(pathway==="gq") text="PLCβ cliva PIP₂ em IP₃ e DAG.";
      if(pathway==="g12") text="RhoGEF promove a troca GDP→GTP em RhoA.";
    }
    if(step===6){
      if(pathway==="gs") text="cAMP ativa PKA e amplia a fosforilação de proteínas-alvo.";
      if(pathway==="gi") text="A menor concentração de cAMP reduz a ativação de PKA.";
      if(pathway==="gq") text="IP₃ libera Ca²⁺ do retículo; DAG + Ca²⁺ favorecem ativação de PKC.";
      if(pathway==="g12") text="RhoA-GTP ativa ROCK e reorganiza actomiosina e citoesqueleto.";
    }
    $("learningText").textContent=text;

    $("stageStateLabel").textContent=step===0?"RECEPTOR INATIVO":step===7?"DESLIGAMENTO DO SINAL":"CASCATA ATIVA";
    $("stageStateText").textContent=copy.title;
    $("introStatus").textContent=step===0?"Aguardando ligante":step===7?"Hidrolisando GTP":"Sinal em andamento";

    $("pillReceptor").textContent=step===0?"GPCR off":"GPCR on";
    $("pillNucleotide").textContent=step<2?"Gα·GDP":step<7?"Gα·GTP":"Gα·GDP + Pi";
    $("pillEffector").textContent=step<4?pathways[pathway].effectorShort+" basal":pathways[pathway].effectorPill;

    $("nucleotideBadge").textContent=step<2?"GDP":step<7?"GTP":"GDP";
    $("effectorActivity").textContent=step<4?"basal":pathways[pathway].effectorState;

    if(pathway==="gs") $("pkaState").textContent=step>=6?"ativa":"inativa";
    if(pathway==="gi") $("pkaState").textContent=step>=6?"menos ativa":"inativa";
    const pkc=$("pkcNode");
    if(pkc && pkc.querySelector("small")) pkc.querySelector("small").textContent=step>=6?"ativa":"inativa";

    $("nextStepButton").disabled=!ligandBound || step>=7;
  }

  function applyPathway(key){
    clearAuto();
    pathway=key;
    const cfg=pathways[key];
    $("gpStage").dataset.pathway=key;
    $("pathKicker").textContent=cfg.kicker;
    $("pathTitle").textContent=cfg.title;
    $("pathDescription").textContent=cfg.description;
    $("contextEffector").textContent=cfg.effectorPill;
    $("contextMessenger").textContent=cfg.messengerPill;
    $("effectorShort").textContent=cfg.effectorShort;
    $("effectorName").textContent=cfg.effectorName;
    $("substrateTitle").textContent=cfg.substrate;
    $("alphaFamily").textContent=cfg.family;
    $("stepEffectorText").textContent=cfg.effectorStep;
    $("stepMessengerText").textContent=cfg.messengerStep;
    $("stepResponseText").textContent=cfg.responseStep;
    $("memoryRule").textContent=cfg.memoryRule;
    $("memoryText").textContent=cfg.memoryText;

    $all(".gp-path-tab").forEach(function(b){b.classList.toggle("is-active",b.dataset.pathway===key);});
    $all(".gp-summary-card").forEach(function(b){b.classList.toggle("is-active",b.dataset.summaryPath===key);});

    if(key==="gq"){
      $("effector").style.borderColor="rgba(255,185,104,.12)";
    }else if(key==="g12"){
      $("effector").style.borderColor="rgba(244,201,93,.13)";
    }else{
      $("effector").style.borderColor="";
    }
    releaseLigand();
  }

  function pointerDown(e){
    if(ligandBound){
      releaseLigand();
    }
    dragging=true;
    const ligand=$("gpLigand"),r=ligand.getBoundingClientRect();
    dragOffset.x=e.clientX-r.left;dragOffset.y=e.clientY-r.top;
    ligand.setPointerCapture && ligand.setPointerCapture(e.pointerId);
    ligand.classList.add("is-dragging");
  }

  function pointerMove(e){
    if(!dragging) return;
    const stage=$("gpStage"),ligand=$("gpLigand");
    const sr=stage.getBoundingClientRect();
    let x=e.clientX-sr.left-dragOffset.x;
    let y=e.clientY-sr.top-dragOffset.y;

    const membraneTop=246;
    const maxY=membraneTop-ligand.offsetHeight-14;
    x=Math.max(8,Math.min(stage.clientWidth-ligand.offsetWidth-8,x));
    y=Math.max(20,Math.min(maxY,y));

    ligand.style.left=x+"px";
    ligand.style.top=y+"px";

    const a=ligandCenter(),b=siteCenter();
    const near=Math.hypot(a.x-b.x,a.y-b.y)<58;
    $("gpcrSite").classList.toggle("is-target",near);
  }

  function pointerUp(){
    if(!dragging) return;
    dragging=false;
    $("gpLigand").classList.remove("is-dragging");
    $("gpcrSite").classList.remove("is-target");
    const a=ligandCenter(),b=siteCenter();
    if(Math.hypot(a.x-b.x,a.y-b.y)<62) bindLigand();
  }

  function init(){
    ensureRhoModule();
    loadUser();
    if($("logoutSidebar")) $("logoutSidebar").addEventListener("click",logout);

    $all(".gp-path-tab").forEach(function(btn){
      btn.addEventListener("click",function(){applyPathway(btn.dataset.pathway);});
    });
    $all(".gp-summary-card").forEach(function(btn){
      btn.addEventListener("click",function(){applyPathway(btn.dataset.summaryPath);window.scrollTo({top:document.querySelector(".gp-path-tabs").offsetTop-80,behavior:"smooth"});});
    });

    $("bindLigandButton").addEventListener("click",bindLigand);
    $("releaseLigandButton").addEventListener("click",releaseLigand);
    $("resetExperimentButton").addEventListener("click",releaseLigand);
    $("nextStepButton").addEventListener("click",function(){
      clearAuto();
      if(ligandBound && step<7) setStep(step+1);
    });
    $("autoPlayToggle").addEventListener("change",function(){
      clearAuto();
      if(this.checked && ligandBound && step<7) scheduleAuto();
    });

    const ligand=$("gpLigand");
    ligand.addEventListener("pointerdown",pointerDown);
    window.addEventListener("pointermove",pointerMove);
    window.addEventListener("pointerup",pointerUp);
    window.addEventListener("resize",function(){if(ligandBound) placeLigandAtSite();});

    applyPathway("gs");
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
  else init();
})();
