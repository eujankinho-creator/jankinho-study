(function(){
  "use strict";

  var stage=document.getElementById("membraneStage");
  var bilayer=document.getElementById("bilayer");
  var layer=document.getElementById("placedLayer");
  var membraneBuildSlots=document.getElementById("membraneBuildSlots");
  var membraneBuildSlotNodes=membraneBuildSlots?Array.from(membraneBuildSlots.querySelectorAll(".membrane-build-slot")):[];
  var particleCanvas=document.getElementById("particleCanvas");
  var particleCtx=particleCanvas?particleCanvas.getContext("2d",{alpha:true,desynchronized:true}):null;
  var particleCanvasDpr=1;
  var particleSpriteCache=Object.create(null);
  var topRow=document.getElementById("phospholipidTop");
  var bottomRow=document.getElementById("phospholipidBottom");
  var dropHint=document.getElementById("dropHint");
  var armedHint=document.getElementById("armedHint");
  var armedText=document.getElementById("armedText");
  var counter=document.getElementById("elementCounter");
  var clearButton=document.getElementById("clearStage");
  var removeButton=document.getElementById("removeSelected");
  var collisionToast=document.getElementById("collisionToast");
  var gradientVm=document.getElementById("gradientVm");
  var stageVmStatus=document.getElementById("stageVmStatus");
  var activeSoluteSymbolEC=document.getElementById("activeSoluteSymbolEC");
  var activeSoluteSymbolIC=document.getElementById("activeSoluteSymbolIC");
  var activeCountEC=document.getElementById("activeCountEC");
  var activeCountIC=document.getElementById("activeCountIC");
  var simPause=document.getElementById("simPause");
  var simSlow=document.getElementById("simSlow");
  var simNormal=document.getElementById("simNormal");
  var chargeToggle=document.getElementById("chargeToggle");
  var cytoplasmPlane=document.getElementById("cytoplasmPlane");
  var chargeOuterBand=stage?stage.querySelector(".charge-positive"):null;
  var chargeInnerBand=stage?stage.querySelector(".charge-negative"):null;
  var ligandToggle=document.getElementById("ligandToggle");
  var vmPresetButtons=Array.from(document.querySelectorAll(".vm-preset"));
  var modeButtons=Array.from(document.querySelectorAll(".membrane-mode-tab"));
  var modeContextKicker=document.getElementById("modeContextKicker");
  var modeContextTitle=document.getElementById("modeContextTitle");
  var modeContextText=document.getElementById("modeContextText");
  var resetModeScenario=document.getElementById("resetModeScenario");
  var soluteTypes=["o2","co2","na","k","glucose","atp"];
  var selectedSoluteType="na";
  var currentLabMode="simple";
  var activeModeFeatures={
    gas:true,channels:false,ligands:false,pump:false,sglt:false,craft:false,voltage:false
  };
  var gradientUi={
    na:{
      direction:document.getElementById("gradientNaDirection"),
      counts:document.getElementById("gradientNaCounts"),
      gate:document.getElementById("gradientNaGate")
    },
    k:{
      direction:document.getElementById("gradientKDirection"),
      counts:document.getElementById("gradientKCounts"),
      gate:document.getElementById("gradientKGate")
    },
    cl:{
      direction:document.getElementById("gradientClDirection"),
      counts:document.getElementById("gradientClCounts"),
      gate:document.getElementById("gradientClGate")
    }
  };

  var selected=null;
  var placedCount=0;
  var sourceDrag=null;
  var moving=null;
  var rafMove=0;
  var rafSource=0;
  var collisionTimer=0;
  var lastCollisionType="";
  var lastCollisionAt=0;
  var resizeTimer=0;
  var armedTool=null;
  var moleculeMotion=new WeakMap();
  var physicsRaf=0;
  var lastPhysicsTime=0;
  var lastAssociationTime=0;
  var lastElectrostaticUpdate=0;
  var lastGradientUpdate=0;
  var labWindowFocused=document.hasFocus();
  var labForeground=!document.hidden&&labWindowFocused;
  var labForegroundQueue=[];
  var simulationActive=labForeground;
  var simulationPaused=false;
  var simulationTimeScale=1;
  var chargesVisible=false;
  var voltageGateTimer=0;
  var ligandsAdded=false;
  var sceneCacheDirty=true;
  var sceneCacheAt=0;
  var cachedMolecules=[];
  var cachedProteins=[];
  var cachedMoleculesByType=Object.create(null);
  var cachedProteinsByType=Object.create(null);
  var compartmentCountCache=Object.create(null);
  var compartmentCountCacheAt=0;
  var slotPointCache=new WeakMap();
  var motionSerial=0;
  var barrierCache=null;
  var geometryDirty=true;
  var membraneVoltageMv=-70;
  var thermalVoltageMv=26.7;
  var chemicalWeight=1.35;
  var labAudioContext=null;
  var labSoundLastAt=Object.create(null);

  function isLabForeground(){
    return labForeground&&!document.hidden&&labWindowFocused;
  }

  function runWhenLabForeground(callback){
    if(typeof callback!=="function")return;
    if(isLabForeground()){
      callback();
      return;
    }
    labForegroundQueue.push(callback);
  }

  function labSetTimeout(callback,delay){
    return setTimeout(function(){
      runWhenLabForeground(callback);
    },delay);
  }

  function unlockLabAudio(){
    if(!isLabForeground())return labAudioContext;
    if(labAudioContext){
      if(labAudioContext.state==="suspended")labAudioContext.resume().catch(function(){});
      return labAudioContext;
    }

    var AudioCtx=window.AudioContext||window.webkitAudioContext;
    if(!AudioCtx)return null;

    try{
      labAudioContext=new AudioCtx();
      if(labAudioContext.state==="suspended")labAudioContext.resume().catch(function(){});
    }catch(_){
      labAudioContext=null;
    }

    return labAudioContext;
  }

  function playLabSound(kind){
    if(!isLabForeground())return;
    var ctx=unlockLabAudio();
    if(!ctx||ctx.state==="closed")return;

    var nowMs=performance.now();
    var last=labSoundLastAt[kind]||0;
    if(nowMs-last<70)return;
    labSoundLastAt[kind]=nowMs;

    var patterns={
      place:[[220,.045,0],[330,.060,.045]],
      dock:[[430,.045,0],[520,.040,.035]],
      phosphorylate:[[300,.055,0],[455,.070,.055],[610,.085,.110]],
      release:[[610,.050,0],[500,.055,.050],[390,.080,.100]],
      hydrolysis:[[520,.045,0],[355,.080,.050]],
      synthesize:[[330,.055,0],[470,.065,.050],[660,.100,.110]],
      return:[[560,.055,0],[430,.065,.055],[340,.085,.115]],
      ligand:[[390,.045,0],[540,.075,.045]],
      voltage:[[260,.040,0],[390,.055,.045]]
    };

    var pattern=patterns[kind]||patterns.dock;
    var baseTime=ctx.currentTime+.008;

    pattern.forEach(function(note,index){
      var osc=ctx.createOscillator();
      var gain=ctx.createGain();
      var start=baseTime+(note[2]||0);
      var duration=note[1]||.06;
      var volume=kind==="dock"?.024:.032;

      osc.type=index%2===0?"sine":"triangle";
      osc.frequency.setValueAtTime(note[0],start);
      gain.gain.setValueAtTime(.0001,start);
      gain.gain.exponentialRampToValueAtTime(volume,start+.012);
      gain.gain.exponentialRampToValueAtTime(.0001,start+duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start+duration+.02);
    });
  }

  document.addEventListener("pointerdown",unlockLabAudio,{passive:true,once:true});
  document.addEventListener("keydown",unlockLabAudio,{once:true});

  var catalogue={
    "vazante-na":{name:"Canal de vazamento de Na⁺",category:"CANAL DE VAZAMENTO",text:"Canal de Na⁺ sempre aberto. O cruzamento é estocástico e enviesado pelo gradiente eletroquímico.",label:"Vazamento Na⁺",kind:"protein",art:"channel"},
    "vazante":{name:"Canal de vazamento de K⁺",category:"CANAL DE VAZAMENTO",text:"Canal de K⁺ sempre aberto. O cruzamento é estocástico e enviesado pelo gradiente eletroquímico.",label:"Vazamento K⁺",kind:"protein",art:"channel"},
    "vg-na":{name:"Canal de Na⁺ dependente de voltagem",category:"CANAL VOLTAGEM-DEPENDENTE",text:"Abre após uma curta latência em −50 mV e fecha em −70 mV ou +30 mV.",label:"Na⁺ · voltagem",kind:"protein",art:"channel"},
    "vg-k":{name:"Canal de K⁺ dependente de voltagem",category:"CANAL VOLTAGEM-DEPENDENTE",text:"Abre após uma curta latência em +30 mV e fecha em −70 mV ou −50 mV.",label:"K⁺ · voltagem",kind:"protein",art:"channel"},
    "lg-na":{name:"Canal de Na⁺ dependente de ligante",category:"CANAL LIGANTE-DEPENDENTE",text:"Um ligante compatível se liga ao canal, ele abre por alguns segundos e depois fecha.",label:"Na⁺ · ligante",kind:"protein",art:"channel"},
    "lg-k":{name:"Canal de K⁺ dependente de ligante",category:"CANAL LIGANTE-DEPENDENTE",text:"Um ligante compatível se liga ao canal, ele abre por alguns segundos e depois fecha.",label:"K⁺ · ligante",kind:"protein",art:"channel"},
    "bomba":{name:"Bomba Na⁺/K⁺-ATPase",category:"TRANSPORTE ATIVO",text:"Ciclo sequencial: 3 Na⁺ intracelulares, ATP, liberação de Na⁺ no exterior, 2 K⁺ externos e retorno.",label:"Bomba Na⁺/K⁺",kind:"protein",art:"pump"},
    "sglt":{name:"Cotransportador Na⁺/glicose",category:"TRANSPORTE ATIVO SECUNDÁRIO",text:"Usa o gradiente de Na⁺ para transportar glicose para o interior, com dois Na⁺ por glicose neste modelo didático.",label:"Na⁺/Glicose",kind:"protein",art:"cotransporter"},
    "o2":{name:"Oxigênio (O₂)",category:"GÁS",text:"Molécula apolar pequena: difunde-se diretamente pela bicamada, com viés do gradiente químico.",label:"O₂",kind:"molecule"},
    "co2":{name:"Dióxido de carbono (CO₂)",category:"GÁS",text:"Molécula pequena: difunde-se diretamente pela bicamada, com viés do gradiente químico.",label:"CO₂",kind:"molecule"},
    "glucose":{name:"Glicose",category:"SOLUTO",text:"Não cruza livremente a bicamada neste modelo. Pode entrar pelo cotransportador Na⁺/glicose.",label:"G",kind:"molecule"},
    "na":{name:"Sódio (Na⁺)",category:"ÍON",text:"Na⁺ cruza apenas por vias compatíveis e sofre viés do gradiente eletroquímico.",label:"Na⁺",kind:"molecule"},
    "k":{name:"Potássio (K⁺)",category:"ÍON",text:"K⁺ cruza apenas por vias compatíveis e sofre viés do gradiente eletroquímico.",label:"K⁺",kind:"molecule"},
    "cl":{name:"Cloreto (Cl⁻)",category:"ÍON",text:"Sem canal específico nesta versão do painel.",label:"Cl⁻",kind:"molecule"},
    "h2o":{name:"Água (H₂O)",category:"MOLÉCULA",text:"A água pode atravessar rapidamente pela aquaporina.",label:"H₂O",kind:"molecule"},
    "atp":{name:"ATP",category:"ENERGIA",text:"Substrato da Na⁺/K⁺-ATPase. ADP + Pi também podem formar ATP no modo didático.",label:"ATP",kind:"molecule"},
    "adp":{name:"ADP",category:"NUCLEOTÍDEO",text:"Produto da hidrólise de ATP.",label:"ADP",kind:"molecule"},
    "pi":{name:"Fosfato inorgânico (Pi)",category:"GRUPO FOSFATO",text:"Participa do ciclo da bomba e do craft ADP + Pi → ATP.",label:"Pi",kind:"molecule"},
    "ligand-na":{name:"Ligante do canal de Na⁺",category:"LIGANTE",text:"Liga-se ao canal de Na⁺ dependente de ligante.",label:"✦",kind:"molecule"},
    "ligand-k":{name:"Ligante do canal de K⁺",category:"LIGANTE",text:"Liga-se ao canal de K⁺ dependente de ligante.",label:"▲",kind:"molecule"}
  };

  var gates={
    na:["vazante-na","vg-na","lg-na"],
    k:["vazante","vg-k","lg-k"]
  };

  var labModes={
    simple:{order:"01",title:"Difusão simples pela bicamada",text:"O₂ e CO₂ atravessam diretamente a bicamada conforme o gradiente químico.",solutes:["o2","co2"],proteins:[],defaultSolute:"o2",voltage:false,ligands:false},
    leak:{order:"02",title:"Canais de vazamento",text:"Na⁺ e K⁺ atravessam canais sempre abertos seguindo o gradiente eletroquímico.",solutes:["na","k"],proteins:["vazante-na","vazante"],defaultSolute:"na",voltage:false,ligands:false},
    voltage:{order:"03",title:"Canais dependentes de voltagem",text:"Use −70, −50 e +30 mV para observar estados fechados e abertos dos canais de Na⁺ e K⁺.",solutes:["na","k"],proteins:["vg-na","vg-k"],defaultSolute:"na",voltage:true,ligands:false},
    ligand:{order:"04",title:"Canais dependentes de ligante",text:"Triângulos e estrelas se ligam aos seus canais. Arraste um ligante preso para retirá-lo.",solutes:["na","k"],proteins:["lg-na","lg-k"],defaultSolute:"na",voltage:false,ligands:true},
    pump:{order:"05",title:"Bomba Na⁺/K⁺-ATPase",text:"Ciclo ativo com 3 Na⁺, ATP e 2 K⁺, acompanhado pela mudança conformacional da bomba.",solutes:["na","k","atp"],proteins:["bomba"],defaultSolute:"na",voltage:false,ligands:false},
    sglt:{order:"06",title:"Cotransporte Na⁺/Glicose",text:"O gradiente de Na⁺ impulsiona a entrada de glicose pelo cotransportador.",solutes:["na","glucose"],proteins:["sglt"],defaultSolute:"na",voltage:false,ligands:false},
    all:{order:"07",title:"Todos os mecanismos juntos",text:"Difusão simples, vazamento, voltagem, ligantes e transporte ativo no mesmo laboratório.",solutes:["o2","co2","na","k","glucose","atp"],proteins:["vazante-na","vazante","vg-na","vg-k","lg-na","lg-k","bomba","sglt"],defaultSolute:"na",voltage:true,ligands:true}
  };

  function modeFeatures(modeName){
    return {
      gas:modeName==="simple"||modeName==="all",
      channels:modeName==="leak"||modeName==="voltage"||modeName==="ligand"||modeName==="all",
      ligands:modeName==="ligand"||modeName==="all",
      pump:modeName==="pump"||modeName==="all",
      sglt:modeName==="sglt"||modeName==="all",
      craft:modeName==="pump"||modeName==="all",
      voltage:modeName==="voltage"||modeName==="all"
    };
  }

  function modeAllowsProtein(type){
    var cfg=labModes[currentLabMode]||labModes.simple;
    return cfg.proteins.indexOf(type)!==-1;
  }

  function modeAllowsSolute(type){
    var cfg=labModes[currentLabMode]||labModes.simple;
    return cfg.solutes.indexOf(type)!==-1||isLigandType(type)||type==="adp"||type==="pi";
  }

  function setArmedTool(tool){
    if(armedTool===tool)return;
    if(armedTool)armedTool.classList.remove("palette-selected");
    armedTool=tool||null;
    document.querySelectorAll(".tool-item.palette-selected,.molecule-tool.palette-selected").forEach(function(node){
      if(node!==armedTool)node.classList.remove("palette-selected");
    });

    if(armedTool){
      armedTool.classList.add("palette-selected");
      armedHint.hidden=false;
      armedText.textContent=catalogue[armedTool.dataset.type].name;
    }else{
      armedHint.hidden=true;
    }
  }

  function clearArmedTool(){
    if(armedTool)armedTool.classList.remove("palette-selected");
    armedTool=null;
    armedHint.hidden=true;
  }

  function sampleRandomWalkDurationMs(){
    var u1=Math.max(1e-6,Math.random());
    var u2=Math.max(1e-6,Math.random());
    var z=Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);
    var seconds=Math.max(.03,Math.min(1,.16+.19*z));
    return seconds*1000;
  }

  function chooseRandomWalkVelocity(el,motion,scale){
    var angle=Math.random()*Math.PI*2;
    var diffusion=motion&&motion.diffusion?motion.diffusion:diffusionFactor(el.dataset.type);
    var speed=(36+Math.random()*8)*Math.sqrt(diffusion)*(scale||1);
    motion.vx=Math.cos(angle)*speed;
    motion.vy=Math.sin(angle)*speed;
    motion.targetVx=motion.vx;
    motion.targetVy=motion.vy;
    motion.directionChangeAt=performance.now()+sampleRandomWalkDurationMs()/Math.max(.35,simulationTimeScale);
  }

  function initMoleculeMotion(el){
    if(!el||el.dataset.kind!=="molecule")return;
    if(moleculeMotion.has(el))return;
    var angle=Math.random()*Math.PI*2;
    var diffusion=diffusionFactor(el.dataset.type);
    var speed=(20+Math.random()*20)*Math.sqrt(diffusion);
    moleculeMotion.set(el,{
      vx:Math.cos(angle)*speed,
      vy:Math.sin(angle)*speed,
      seed:Math.random()*1000,
      diffusion:diffusion,
      order:++motionSerial,
      charge:ionCharge(el.dataset.type),
      halfW:Math.max(14,el.offsetWidth/2),
      halfH:Math.max(10,el.offsetHeight/2),
      boostUntil:0,
      lastSide:null,
      channelCooldownUntil:0,
      associationCooldownUntil:0,
      lastGateId:null,
      clearanceRadius:0,
      gateGuide:null,
      pumpGuide:null,
      pumpReservedSlot:null,
      pumpGuideStartedAt:0,
      craftGuide:null,
      gasTransit:null,
      gasCooldownUntil:0,
      targetVx:Math.cos(angle)*speed,
      targetVy:Math.sin(angle)*speed,
      directionChangeAt:performance.now()+sampleRandomWalkDurationMs()
    });
  }

  function resizeParticleCanvas(){
    if(!particleCanvas||!particleCtx)return;

    var width=Math.max(1,stage.clientWidth);
    var height=Math.max(1,stage.clientHeight);
    var dpr=Math.min(1.5,window.devicePixelRatio||1);
    var pixelWidth=Math.max(1,Math.round(width*dpr));
    var pixelHeight=Math.max(1,Math.round(height*dpr));

    if(particleCanvas.width!==pixelWidth||particleCanvas.height!==pixelHeight){
      particleCanvas.width=pixelWidth;
      particleCanvas.height=pixelHeight;
      particleCanvas.style.width=width+"px";
      particleCanvas.style.height=height+"px";
    }

    particleCanvasDpr=dpr;
  }

  function particleVisual(type){
    if(type==="o2")return {label:"",fill:"#ff4655",stroke:"transparent",text:"#fff",w:30,h:18,shape:"o2"};
    if(type==="co2")return {label:"",fill:"#343b48",stroke:"transparent",text:"#fff",w:34,h:18,shape:"co2"};
    if(type==="glucose")return {label:"",fill:"#8b5cf6",stroke:"transparent",text:"#fff",w:26,h:24,shape:"hex"};
    if(type==="na")return {label:"+",fill:"#ffd000",stroke:"transparent",text:"#1f2430",w:22,h:22,shape:"circle"};
    if(type==="k")return {label:"+",fill:"#00bce7",stroke:"transparent",text:"#082b35",w:24,h:24,shape:"circle"};
    if(type==="cl")return {label:"−",fill:"#22c4d8",stroke:"transparent",text:"#08333a",w:23,h:23,shape:"circle"};
    if(type==="h2o")return {label:"",fill:"#00c8e0",stroke:"transparent",text:"#ecffff",w:22,h:24,shape:"drop"};
    if(type==="pi")return {label:"Pi",fill:"#705cf6",stroke:"transparent",text:"#fff",w:20,h:20,shape:"circle"};
    if(type==="atp")return {label:"",fill:"#55db57",stroke:"transparent",text:"#fff",w:39,h:19,shape:"atp"};
    if(type==="adp")return {label:"ADP",fill:"#5967df",stroke:"transparent",text:"#f4f5ff",w:36,h:19,shape:"adp"};
    if(type==="ligand-na")return {label:"",fill:"#ff8a3d",stroke:"transparent",text:"#fff",w:24,h:22,shape:"triangle"};
    if(type==="ligand-k")return {label:"",fill:"#4f7cff",stroke:"transparent",text:"#fff",w:24,h:24,shape:"star"};
    return {label:type.toUpperCase(),fill:"#526774",stroke:"transparent",text:"#ffffff",w:25,h:22,shape:"round"};
  }

  function roundedRectPath(ctx,x,y,w,h,r){
    var rr=Math.min(r,w/2,h/2);
    ctx.beginPath();
    ctx.moveTo(x+rr,y);
    ctx.arcTo(x+w,y,x+w,y+h,rr);
    ctx.arcTo(x+w,y+h,x,y+h,rr);
    ctx.arcTo(x,y+h,x,y,rr);
    ctx.arcTo(x,y,x+w,y,rr);
    ctx.closePath();
  }

  function createParticleSprite(type){
    if(particleSpriteCache[type])return particleSpriteCache[type];

    var v=particleVisual(type);
    var scale=2;
    var pad=4;
    var canvas=document.createElement("canvas");
    canvas.width=Math.ceil((v.w+pad*2)*scale);
    canvas.height=Math.ceil((v.h+pad*2)*scale);

    var ctx=canvas.getContext("2d");
    ctx.scale(scale,scale);
    ctx.translate(pad,pad);

    ctx.fillStyle=v.fill;
    var softParticleOutline="rgba(18,24,30,.28)";
    ctx.strokeStyle=softParticleOutline;
    ctx.lineWidth=.7;

    if(v.shape==="circle"){
      ctx.beginPath();
      ctx.arc(v.w/2,v.h/2,Math.min(v.w,v.h)/2-1,0,Math.PI*2);
      ctx.fill();
      ctx.stroke();
    }else if(v.shape==="o2"){
      var rO=7;
      ctx.fillStyle="#ff4655";
      ctx.beginPath();ctx.arc(v.w*.38,v.h/2,rO,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.arc(v.w*.62,v.h/2,rO,0,Math.PI*2);ctx.fill();ctx.stroke();
    }else if(v.shape==="co2"){
      var rC=6.5;
      ctx.fillStyle="#ff4655";
      ctx.beginPath();ctx.arc(v.w*.26,v.h/2,rC,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.fillStyle="#343b48";
      ctx.beginPath();ctx.arc(v.w*.50,v.h/2,rC,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.fillStyle="#ff4655";
      ctx.beginPath();ctx.arc(v.w*.74,v.h/2,rC,0,Math.PI*2);ctx.fill();ctx.stroke();
    }else if(v.shape==="atp"||v.shape==="adp"){
      var centers=v.shape==="atp"
        ? [[6,9],[15,7],[23,11],[31,8],[37,11]]
        : [[6,10],[15,7],[24,11],[32,8]];

      ctx.strokeStyle="rgba(76,205,91,.68)";
      ctx.lineWidth=1.15;
      for(var bond=0;bond<centers.length-1;bond++){
        ctx.beginPath();
        ctx.moveTo(centers[bond][0]+3.5,centers[bond][1]);
        ctx.lineTo(centers[bond+1][0]-3.5,centers[bond+1][1]);
        ctx.stroke();
      }

      for(var ai=0;ai<centers.length;ai++){
        ctx.fillStyle=v.shape==="atp"
          ? (ai<2?"#68e565":"#42d847")
          : (ai<2?"#7180ef":"#5362d6");
        ctx.strokeStyle=softParticleOutline;
        ctx.lineWidth=.65;
        ctx.beginPath();
        ctx.arc(centers[ai][0],centers[ai][1],ai<2?5:4,0,Math.PI*2);
        ctx.fill();
        ctx.stroke();
      }
    }else if(v.shape==="drop"){
      ctx.beginPath();
      ctx.moveTo(v.w/2,1);
      ctx.bezierCurveTo(v.w*.78,v.h*.28,v.w-1,v.h*.52,v.w-1,v.h*.68);
      ctx.bezierCurveTo(v.w-1,v.h-1,1,v.h-1,1,v.h*.68);
      ctx.bezierCurveTo(1,v.h*.52,v.w*.22,v.h*.28,v.w/2,1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }else if(v.shape==="star"){
      ctx.beginPath();
      var cx=v.w/2,cy=v.h/2,outer=Math.min(v.w,v.h)*.46,inner=outer*.44;
      for(var si=0;si<10;si++){
        var rr=si%2===0?outer:inner;
        var aa=-Math.PI/2+si*Math.PI/5;
        var sx=cx+Math.cos(aa)*rr,sy=cy+Math.sin(aa)*rr;
        if(si===0)ctx.moveTo(sx,sy);else ctx.lineTo(sx,sy);
      }
      ctx.closePath();ctx.fill();ctx.stroke();
    }else if(v.shape==="triangle"){
      ctx.beginPath();
      ctx.moveTo(v.w/2,1);
      ctx.lineTo(v.w-1,v.h-2);
      ctx.lineTo(1,v.h-2);
      ctx.closePath();ctx.fill();ctx.stroke();
    }else if(v.shape==="hex"){
      ctx.beginPath();
      ctx.moveTo(v.w*.25,1);ctx.lineTo(v.w*.75,1);ctx.lineTo(v.w-1,v.h/2);
      ctx.lineTo(v.w*.75,v.h-1);ctx.lineTo(v.w*.25,v.h-1);ctx.lineTo(1,v.h/2);
      ctx.closePath();ctx.fill();ctx.stroke();
    }else{
      roundedRectPath(ctx,1,1,v.w-2,v.h-2,7);
      ctx.fill();
      ctx.stroke();
    }

    if(v.label){
      ctx.fillStyle=v.text;
      ctx.font="700 8px system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
      ctx.textAlign="center";
      ctx.textBaseline="middle";
      ctx.fillText(v.label,v.w/2,v.h/2+.4);
    }

    var sprite={canvas:canvas,w:v.w+pad*2,h:v.h+pad*2,pad:pad};
    particleSpriteCache[type]=sprite;
    return sprite;
  }

  function shouldCanvasRender(el){
    return el&&
      el.isConnected&&
      el.dataset.kind==="molecule"&&
      el.classList.contains("canvas-managed")&&
      !el.classList.contains("docked")&&
      !el.classList.contains("craft-consumed")&&
      !el.dataset.autoTransport&&
      !el.dataset.autoBinding&&
      !el.dataset.pumpTransport&&
      !el.dataset.sgltTransport;
  }

  function setCanvasManaged(el,managed){
    if(!el||el.dataset.kind!=="molecule")return;
    el.classList.toggle("canvas-managed",!!managed);
  }

  function renderParticleCanvas(now){
    if(!particleCanvas||!particleCtx)return;
    resizeParticleCanvas();

    var width=stage.clientWidth;
    var height=stage.clientHeight;
    var ctx=particleCtx;

    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,particleCanvas.width,particleCanvas.height);
    ctx.setTransform(particleCanvasDpr,0,0,particleCanvasDpr,0,0);

    var molecules=getCachedMolecules(now);
    for(var i=0;i<molecules.length;i++){
      var el=molecules[i];
      if(!shouldCanvasRender(el))continue;

      var x=parseFloat(el.style.left)||0;
      var y=parseFloat(el.style.top)||0;
      if(x<-40||x>width+40||y<-40||y>height+40)continue;

      var sprite=createParticleSprite(el.dataset.type);
      var drawW=sprite.w;
      var drawH=sprite.h;

      var motion=moleculeMotion.get(el);
      var transit=motion&&motion.gasTransit;

      if(transit){
        var middle=1-Math.abs(transit.progress-.5)*2;
        ctx.save();
        ctx.globalAlpha=.84+.16*(1-middle);
        ctx.drawImage(
          sprite.canvas,
          x-drawW/2,
          y-drawH/2,
          drawW,
          drawH
        );
        ctx.restore();
      }else{
        ctx.drawImage(
          sprite.canvas,
          x-drawW/2,
          y-drawH/2,
          drawW,
          drawH
        );
      }
    }
  }

  function markSceneCacheDirty(){
    sceneCacheDirty=true;
  }

  function rebuildSceneCache(now){
    now=now||performance.now();
    cachedMolecules=Array.from(layer.getElementsByClassName("placed-molecule")).filter(function(el){
      return el.isConnected;
    });
    cachedProteins=Array.from(layer.getElementsByClassName("placed-protein")).filter(function(el){
      return el.isConnected;
    });

    cachedMoleculesByType=Object.create(null);
    cachedProteinsByType=Object.create(null);

    cachedMolecules.forEach(function(el){
      var type=el.dataset.type;
      if(!cachedMoleculesByType[type])cachedMoleculesByType[type]=[];
      cachedMoleculesByType[type].push(el);
    });

    cachedProteins.forEach(function(el){
      var type=el.dataset.type;
      if(!cachedProteinsByType[type])cachedProteinsByType[type]=[];
      cachedProteinsByType[type].push(el);
    });

    sceneCacheDirty=false;
    sceneCacheAt=now;
  }

  function ensureSceneCache(now){
    now=now||performance.now();
    if(sceneCacheDirty||now-sceneCacheAt>650)rebuildSceneCache(now);
  }

  function getCachedMolecules(now){
    ensureSceneCache(now);
    return cachedMolecules;
  }

  function getCachedProteins(now){
    ensureSceneCache(now);
    return cachedProteins;
  }

  function getCachedMoleculesOfType(type,now){
    ensureSceneCache(now);
    return cachedMoleculesByType[type]||[];
  }

  function getCachedProteinsOfType(type,now){
    ensureSceneCache(now);
    return cachedProteinsByType[type]||[];
  }

  function refreshCompartmentCounts(now,force){
    now=now||performance.now();
    if(!force&&now-compartmentCountCacheAt<260)return;

    var b=barrier();
    var next=Object.create(null);

    getCachedMolecules(now).forEach(function(el){
      if(!el.isConnected||el.classList.contains("docked")||el.classList.contains("craft-consumed"))return;
      var type=el.dataset.type;
      if(!next[type])next[type]={EC:0,IC:0};
      var y=parseFloat(el.style.top)||0;
      var compartment=sideOf(y,b);
      if(compartment==="EC"||compartment==="IC")next[type][compartment]++;
    });

    compartmentCountCache=next;
    compartmentCountCacheAt=now;
  }

  function ionCharge(type){
    if(type==="na"||type==="k")return 1;
    if(type==="cl")return -1;
    return 0;
  }

  function diffusionFactor(type){
    if(type==="o2")return 1.42;
    if(type==="co2")return 1.28;
    if(type==="glucose")return .58;
    if(type==="na")return 1.00;
    if(type==="k")return 1.34;
    if(type==="cl")return 1.42;
    if(type==="h2o")return 1.55;
    if(type==="pi")return 1.12;
    if(type==="adp")return .66;
    if(type==="atp")return .56;
    if(type==="ligand-na"||type==="ligand-k")return .78;
    return 1;
  }

  function moleculeHalfHeight(el){
    var motion=moleculeMotion.get(el);
    if(motion&&motion.halfH)return motion.halfH;
    return Math.max(10,el.offsetHeight/2);
  }

  function moleculeHalfWidth(el){
    var motion=moleculeMotion.get(el);
    if(motion&&motion.halfW)return motion.halfW;
    return Math.max(14,el.offsetWidth/2);
  }

  function isCationType(type){
    return ionCharge(type)>0;
  }

  function ionCompartmentCounts(type){
    refreshCompartmentCounts(performance.now(),false);
    var counts=compartmentCountCache[type];
    return counts?{EC:counts.EC,IC:counts.IC}:{EC:0,IC:0};
  }

  function compartmentAreas(){
    var b=barrier();
    var w=Math.max(1,stage.clientWidth);
    var ec=Math.max(1,b.top*w);
    var ic=Math.max(1,(stage.clientHeight-b.bottom)*w);
    return {EC:ec,IC:ic};
  }

  function ionCompartmentDensity(type){
    var counts=ionCompartmentCounts(type);
    var areas=compartmentAreas();
    var scale=10000;
    return {
      EC:(counts.EC+.35)/(areas.EC/scale),
      IC:(counts.IC+.35)/(areas.IC/scale),
      counts:counts
    };
  }

  function nernstPotentialMv(type){
    var z=ionCharge(type);
    if(!z)return 0;
    var density=ionCompartmentDensity(type);
    return (61.5/z)*Math.log10(Math.max(.0001,density.EC)/Math.max(.0001,density.IC));
  }

  function osmoticDriveECtoIC(){
    var solutes=["na","k","cl","atp","adp","pi"];
    var areas=compartmentAreas();
    var ec=0;
    var ic=0;

    solutes.forEach(function(type){
      var counts=ionCompartmentCounts(type);
      ec+=counts.EC;
      ic+=counts.IC;
    });

    var ecDensity=(ec+.5)/(areas.EC/10000);
    var icDensity=(ic+.5)/(areas.IC/10000);
    return Math.log(Math.max(.0001,icDensity)/Math.max(.0001,ecDensity));
  }

  function electrochemicalDriveECtoIC(type){
    var charge=ionCharge(type);
    if(!charge)return 0;

    var density=ionCompartmentDensity(type);
    var chemical=Math.log(Math.max(.0001,density.EC)/Math.max(.0001,density.IC));
    var electrical=-(charge*membraneVoltageMv)/thermalVoltageMv;
    return chemical+electrical;
  }

  function isGasType(type){return type==="o2"||type==="co2"}

  function passiveDriveForSide(type,fromSide){
    if(isGasType(type)){
      var density=ionCompartmentDensity(type);
      var chemical=Math.log(Math.max(.0001,density.EC)/Math.max(.0001,density.IC));
      return fromSide==="EC"?chemical:-chemical;
    }

    if(type==="h2o"){
      var osmosis=osmoticDriveECtoIC();
      return fromSide==="EC"?osmosis:-osmosis;
    }

    var charge=ionCharge(type);
    if(!charge)return -Infinity;

    var inward=electrochemicalDriveECtoIC(type);
    return fromSide==="EC"?inward:-inward;
  }

  function crossingProbability(type,fromSide){
    var drive=passiveDriveForSide(type,fromSide);
    if(!Number.isFinite(drive))return 0;

    var probability=.5+.44*Math.tanh(drive/2.25);
    if(type==="h2o")probability=.5+.38*Math.tanh(drive/1.8);
    return Math.max(.08,Math.min(.96,probability));
  }

  function passiveTransportAllowed(type,fromSide){
    return crossingProbability(type,fromSide)>.1;
  }

  function checkGradientForCrossing(type,fromSide){
    return Math.random()<crossingProbability(type,fromSide);
  }

  function associationAllowed(el,motion,now){
    if(!el||!motion)return false;
    if(el.dataset.autoTransport==="1"||el.dataset.autoBinding==="1")return false;
    return !(motion.associationCooldownUntil&&now<motion.associationCooldownUntil);
  }

  function gateGuidanceTarget(el,x,y,b,now){
    var type=el.dataset.type;
    var allowed=gates[type]||[];
    if(!allowed.length)return null;

    var motion=moleculeMotion.get(el);
    if(!associationAllowed(el,motion,now))return null;

    var side=sideOf(y,b);
    if(side==="MP"||!passiveTransportAllowed(type,side))return null;

    var half=moleculeHalfHeight(el);
    var mouthY=side==="EC"?b.top-half:b.bottom+half;
    var drive=Math.max(0,passiveDriveForSide(type,side));
    var best=null;
    var bestD=Infinity;

    getCachedProteins(now).forEach(function(protein){
      if(allowed.indexOf(protein.dataset.type)===-1)return;

      var px=parseFloat(protein.style.left)||0;
      var py=parseFloat(protein.style.top)||b.center;
      var radial=Math.hypot(px-x,(py-y)*.64);

      if(motion.lastGateId===protein.dataset.id&&motion.clearanceRadius>0&&radial<motion.clearanceRadius)return;
      if(radial>188)return;

      var d=Math.hypot(px-x,mouthY-y);
      if(d<bestD){
        best={
          gate:protein,
          x:px,
          y:mouthY,
          side:side,
          distance:d,
          strength:Math.min(1.35,.22+drive*.22)
        };
        bestD=d;
      }
    });

    return best;
  }

  function releasePumpReservation(el,motion){
    if(!motion||!motion.pumpReservedSlot)return;
    var slot=motion.pumpReservedSlot;
    if(slot.dataset.reservedBy===el.dataset.id)delete slot.dataset.reservedBy;
    motion.pumpReservedSlot=null;
  }

  function pumpGuidanceTarget(el,x,y,b,now){
    var type=el.dataset.type;
    if(type!=="na"&&type!=="k"&&type!=="atp")return null;

    var motion=moleculeMotion.get(el);
    if(!associationAllowed(el,motion,now)){
      releasePumpReservation(el,motion);
      return null;
    }

    var compartment=sideOf(y,b);
    if(type==="k"&&compartment!=="EC"){
      releasePumpReservation(el,motion);
      return null;
    }
    if((type==="na"||type==="atp")&&compartment!=="IC"){
      releasePumpReservation(el,motion);
      return null;
    }

    var best=null;
    var bestD=Infinity;

    getCachedProteinsOfType("bomba",now).forEach(function(pump){
      pump.querySelectorAll('.pump-slot:not(.occupied)').forEach(function(slot){
        if(slot.dataset.accept!==type||!pumpSlotActive(slot,pump))return;

        if(slot.dataset.reservedBy&&slot.dataset.reservedBy!==el.dataset.id){
          if(!layer.querySelector('[data-id="'+slot.dataset.reservedBy+'"]')){
            delete slot.dataset.reservedBy;
          }else{
            return;
          }
        }

        var p=slotStagePoint(slot);
        var d=Math.hypot(p.x-x,p.y-y);
        if(d<228&&d<bestD){
          best={pump:pump,slot:slot,x:p.x,y:p.y,distance:d};
          bestD=d;
        }
      });
    });

    if(!best){
      releasePumpReservation(el,motion);
      return null;
    }

    if(motion.pumpReservedSlot&&motion.pumpReservedSlot!==best.slot){
      releasePumpReservation(el,motion);
    }

    best.slot.dataset.reservedBy=el.dataset.id;
    motion.pumpReservedSlot=best.slot;
    best.pump.classList.add("capture-active");
    return best;
  }


  function clearPumpGuide(el,motion){
    if(!el||!motion)return;
    releasePumpReservation(el,motion);

    var guide=motion.pumpGuide;
    if(guide&&guide.pump&&guide.pump.dataset&&guide.pump.dataset.atpGuideId===el.dataset.id){
      delete guide.pump.dataset.atpGuideId;
    }

    motion.pumpGuide=null;
    motion.pumpGuideStartedAt=0;
  }

  function pumpRecruitmentSideMatches(type,y,b){
    var compartment=sideOf(y,b);
    if(type==="k")return compartment==="EC";
    if(type==="na"||type==="atp")return compartment==="IC";
    return false;
  }

  function pumpStillWantsGuide(pump,type,guide){
    if(!pump||!pump.isConnected||pump.dataset.cycling==="1")return false;

    var state=pumpState(pump);
    if(state==="inside-open"){
      if(type==="na")return true;
      if(type==="atp")return guide&&guide.kind==="waiting-atp";
      return false;
    }
    if(state==="inside-na-bound")return type==="atp"&&guide&&guide.kind==="slot";
    if(state==="outside-open")return type==="k"&&guide&&guide.kind==="slot";
    return false;
  }

  function pumpRecruitmentCandidates(type,pump,b,now,claimed){
    return getCachedMoleculesOfType(type,now).filter(function(el){
      if(!el||!el.isConnected||claimed.has(el.dataset.id))return false;
      if(el.classList.contains("docked")||el.classList.contains("craft-consumed"))return false;
      if(el.dataset.autoTransport==="1"||el.dataset.autoBinding==="1"||el.dataset.pumpTransport==="1"||el.dataset.sgltTransport==="1")return false;
      if(moving&&moving.el===el)return false;

      var y=parseFloat(el.style.top)||0;
      if(!pumpRecruitmentSideMatches(type,y,b))return false;

      var motion=moleculeMotion.get(el);
      if(!motion||!associationAllowed(el,motion,now))return false;

      if(motion.pumpGuide&&motion.pumpGuide.pump&&motion.pumpGuide.pump.isConnected){
        return false;
      }

      return true;
    });
  }

  function pumpApproachPoint(slot,pump,b){
    var p=slotStagePoint(slot);
    var px=parseFloat(pump.style.left)||p.x;
    var slotName=slot&&slot.dataset?slot.dataset.slot:"";
    var accept=slot&&slot.dataset?slot.dataset.accept:"";
    var laneX=0;
    var laneY=p.y;

    if(accept==="na"){
      laneX=slotName==="na1"?-34:slotName==="na2"?0:34;
      laneY=b.bottom+36;
    }else if(accept==="k"){
      laneX=slotName==="k1"?-27:27;
      laneY=b.top-34;
    }else if(accept==="atp"){
      laneX=-36;
      laneY=b.bottom+34;
    }

    return {
      x:Math.max(30,Math.min(stage.clientWidth-30,px+laneX)),
      y:Math.max(26,Math.min(stage.clientHeight-26,laneY)),
      finalX:p.x,
      finalY:p.y
    };
  }

  function assignPumpGuide(el,motion,pump,slot,targetX,targetY,kind,now){
    if(!el||!motion||!pump)return false;

    if(slot){
      if(slot.classList.contains("occupied")||slot.dataset.accept!==el.dataset.type||!pumpSlotActive(slot,pump))return false;

      if(slot.dataset.reservedBy&&slot.dataset.reservedBy!==el.dataset.id){
        var previous=layer.querySelector('[data-id="'+slot.dataset.reservedBy+'"]');
        if(previous&&previous.isConnected)return false;
        delete slot.dataset.reservedBy;
      }

      if(motion.pumpReservedSlot&&motion.pumpReservedSlot!==slot){
        releasePumpReservation(el,motion);
      }

      slot.dataset.reservedBy=el.dataset.id;
      motion.pumpReservedSlot=slot;
    }else{
      releasePumpReservation(el,motion);
    }

    var sameGuide=motion.pumpGuide&&motion.pumpGuide.pump===pump&&motion.pumpGuide.kind===kind;
    var started=sameGuide&&motion.pumpGuide.startedAt?motion.pumpGuide.startedAt:now;

    var approach=null;
    if(slot){
      approach=pumpApproachPoint(slot,pump,barrier());
    }

    motion.pumpGuide={
      pump:pump,
      slot:slot||null,
      x:approach?approach.x:targetX,
      y:approach?approach.y:targetY,
      finalX:approach?approach.finalX:targetX,
      finalY:approach?approach.finalY:targetY,
      approachX:approach?approach.x:targetX,
      approachY:approach?approach.y:targetY,
      kind:kind,
      startedAt:started
    };
    motion.pumpGuideStartedAt=started;
    pump.classList.add("capture-active");
    return true;
  }

  function refreshPumpRecruitment(now,b){
    var claimed=new Set();

    // Clean stale guides first, while preserving valid targets between association ticks.
    getCachedMolecules(now).forEach(function(el){
      var motion=moleculeMotion.get(el);
      if(!motion||!motion.pumpGuide)return;

      var guide=motion.pumpGuide;
      var pump=guide.pump;
      var y=parseFloat(el.style.top)||0;

      // During the final auto-bind animation the molecule crosses the membrane
      // region on its way into the protein. It must keep ownership even though
      // sideOf() temporarily returns MP instead of IC/EC.
      if(el.dataset.autoBinding==="1"){
        if(
          !pump||
          !pump.isConnected||
          !guide.slot||
          !guide.slot.isConnected||
          guide.slot.dataset.reservedBy!==el.dataset.id
        ){
          clearPumpGuide(el,motion);
          return;
        }
        claimed.add(el.dataset.id);
        return;
      }

      if(
        !pumpStillWantsGuide(pump,el.dataset.type,guide)||
        !pumpRecruitmentSideMatches(el.dataset.type,y,b)||
        el.classList.contains("docked")||
        el.dataset.pumpTransport==="1"
      ){
        clearPumpGuide(el,motion);
        return;
      }

      claimed.add(el.dataset.id);
    });

    getCachedProteinsOfType("bomba",now).forEach(function(pump){
      if(!pump||!pump.isConnected||pump.dataset.cycling==="1")return;

      var state=pumpState(pump);
      var desiredType=null;

      if(state==="inside-open")desiredType="na";
      else if(state==="inside-na-bound")desiredType="atp";
      else if(state==="outside-open")desiredType="k";

      // Active pockets recruit exactly the number of particles the pump can accept.
      if(desiredType){
        var openSlots=Array.from(pump.querySelectorAll('.pump-slot:not(.occupied)')).filter(function(slot){
          return slot.dataset.accept===desiredType&&pumpSlotActive(slot,pump);
        });

        openSlots.forEach(function(slot){
          var current=null;

          if(slot.dataset.reservedBy){
            current=layer.querySelector('[data-id="'+slot.dataset.reservedBy+'"]');
            if(
              !current||
              !current.isConnected||
              current.dataset.type!==desiredType||
              current.classList.contains("docked")
            ){
              delete slot.dataset.reservedBy;
              current=null;
            }
          }

          if(current){
            var currentMotion=moleculeMotion.get(current);
            var ownerValid=
              currentMotion&&
              currentMotion.pumpReservedSlot===slot&&
              currentMotion.pumpGuide&&
              currentMotion.pumpGuide.pump===pump&&
              currentMotion.pumpGuide.slot===slot;

            if(ownerValid){
              var cp=slotStagePoint(slot);
              assignPumpGuide(current,currentMotion,pump,slot,cp.x,cp.y,"slot",now);
              claimed.add(current.dataset.id);
              return;
            }

            if(currentMotion)clearPumpGuide(current,currentMotion);
            delete slot.dataset.reservedBy;
            current=null;
          }

          var p=slotStagePoint(slot);
          var lane=pumpApproachPoint(slot,pump,b);
          var candidates=pumpRecruitmentCandidates(desiredType,pump,b,now,claimed);
          var best=null;
          var bestDistance=Infinity;

          candidates.forEach(function(candidate){
            var cx=parseFloat(candidate.style.left)||0;
            var cy=parseFloat(candidate.style.top)||0;
            // Selecting by the staging lane prevents left/right particles from
            // crossing each other on the way to neighboring cavities.
            var d=Math.hypot(lane.x-cx,lane.y-cy);
            var captureRadius=desiredType==="na"?205:desiredType==="k"?190:220;
            if(d<captureRadius&&d<bestDistance){
              best=candidate;
              bestDistance=d;
            }
          });

          if(best){
            var bestMotion=moleculeMotion.get(best);
            if(bestMotion&&assignPumpGuide(best,bestMotion,pump,slot,p.x,p.y,"slot",now)){
              claimed.add(best.dataset.id);
            }
          }
        });
      }

      // ATP starts approaching as soon as the pump is placed, but waits near
      // its groove until all 3 Na+ are bound and the ATP pocket becomes active.
      if(state==="inside-open"&&pumpMolecules(pump,"atp").length===0){
        var atpSlot=pump.querySelector('.pump-slot[data-accept="atp"]');
        if(atpSlot){
          var atpPoint=slotStagePoint(atpSlot);
          var waitingX=Math.max(34,Math.min(stage.clientWidth-34,atpPoint.x-38));
          var waitingY=Math.max(b.bottom+30,atpPoint.y+34);
          var waiting=null;

          if(pump.dataset.atpGuideId){
            waiting=layer.querySelector('[data-id="'+pump.dataset.atpGuideId+'"]');
            if(!waiting||!waiting.isConnected||waiting.dataset.type!=="atp"||waiting.classList.contains("docked")){
              delete pump.dataset.atpGuideId;
              waiting=null;
            }
          }

          if(!waiting){
            var atpCandidates=pumpRecruitmentCandidates("atp",pump,b,now,claimed);
            var atpBestDistance=Infinity;

            atpCandidates.forEach(function(candidate){
              var ax=parseFloat(candidate.style.left)||0;
              var ay=parseFloat(candidate.style.top)||0;
              var d=Math.hypot(waitingX-ax,waitingY-ay);
              if(d<225&&d<atpBestDistance){
                waiting=candidate;
                atpBestDistance=d;
              }
            });
          }

          if(waiting){
            var waitingMotion=moleculeMotion.get(waiting);
            if(waitingMotion&&assignPumpGuide(waiting,waitingMotion,pump,null,waitingX,waitingY,"waiting-atp",now)){
              pump.dataset.atpGuideId=waiting.dataset.id;
              claimed.add(waiting.dataset.id);
            }
          }
        }
      }else if(pump.dataset.atpGuideId){
        var oldWaiting=layer.querySelector('[data-id="'+pump.dataset.atpGuideId+'"]');
        if(oldWaiting){
          var oldMotion=moleculeMotion.get(oldWaiting);
          if(oldMotion&&oldMotion.pumpGuide&&oldMotion.pumpGuide.pump===pump&&oldMotion.pumpGuide.kind==="waiting-atp"){
            // Let the next active ATP-slot pass recruit this same nearby ATP.
            oldMotion.pumpGuide=null;
            oldMotion.pumpGuideStartedAt=0;
          }
        }
        delete pump.dataset.atpGuideId;
      }
    });
  }

  function craftGuidanceTarget(el,x,y,b,now){
    var partnerType=craftPairType(el.dataset.type);
    if(!partnerType)return null;

    var motion=moleculeMotion.get(el);
    if(!associationAllowed(el,motion,now))return null;

    var compartment=sideOf(y,b);
    if(compartment==="MP")return null;

    var best=null;
    var bestD=Infinity;

    getCachedMoleculesOfType(partnerType,now).forEach(function(candidate){
      if(candidate===el||candidate.classList.contains("docked")||candidate.classList.contains("craft-consumed"))return;

      var cx=parseFloat(candidate.style.left)||0;
      var cy=parseFloat(candidate.style.top)||0;
      if(sideOf(cy,b)!==compartment)return;

      var d=Math.hypot(cx-x,cy-y);
      if(d<360&&d<bestD){
        best={partner:candidate,x:cx,y:cy,distance:d};
        bestD=d;
      }
    });

    return best;
  }

  function applyGuidanceForce(el,motion,dt,x,y,b,now){
    if(!motion||!associationAllowed(el,motion,now))return;

    if(motion.pumpGuide){
      var pg=motion.pumpGuide;
      var pump=pg.pump;

      if(!pumpStillWantsGuide(pump,el.dataset.type,pg)){
        clearPumpGuide(el,motion);
      }else{
        if(pg.slot){
          if(
            !pg.slot.isConnected||
            pg.slot.classList.contains("occupied")||
            pg.slot.dataset.accept!==el.dataset.type||
            !pumpSlotActive(pg.slot,pump)||
            (pg.slot.dataset.reservedBy&&pg.slot.dataset.reservedBy!==el.dataset.id)
          ){
            clearPumpGuide(el,motion);
          }else{
            var livePoint=slotStagePoint(pg.slot);
            var liveApproach=pumpApproachPoint(pg.slot,pump,b);
            pg.finalX=livePoint.x;
            pg.finalY=livePoint.y;
            pg.approachX=liveApproach.x;
            pg.approachY=liveApproach.y;
            pg.x=liveApproach.x;
            pg.y=liveApproach.y;
          }
        }

        if(motion.pumpGuide){
          pg=motion.pumpGuide;
          var pdx=pg.x-x;
          var pdy=pg.y-y;
          var pd=Math.hypot(pdx,pdy);
          var ramp=Math.min(1,Math.max(0,(now-(pg.startedAt||now))/1050));
          var maxGuideDistance=pg.kind==="waiting-atp"?255:235;

          if(pd>maxGuideDistance&&el.dataset.autoBinding!=="1"){
            clearPumpGuide(el,motion);
            return;
          }

          // Local guidance only. Molecules first diffuse near the pump naturally;
          // once inside its capture zone, the pump gently biases their trajectory.
          var pFalloff=Math.max(0,1-Math.min(pd,maxGuideDistance)/maxGuideDistance);
          var targetSpeed=pg.kind==="waiting-atp"
            ? 18+12*Math.pow(pFalloff,.68)
            : 20+16*Math.pow(pFalloff,.68);

          var nxp=pd>0?pdx/pd:0;
          var nyp=pd>0?pdy/pd:0;
          var desiredVx=nxp*targetSpeed;
          var desiredVy=nyp*targetSpeed;

          var steer=(pg.kind==="waiting-atp"?.026:.032)+
            (pg.kind==="waiting-atp"?.065:.085)*Math.pow(pFalloff,.78);
          steer*=.38+.62*ramp;

          motion.vx+=(desiredVx-motion.vx)*Math.min(.13,steer);
          motion.vy+=(desiredVy-motion.vy)*Math.min(.13,steer);

          var speed=Math.hypot(motion.vx,motion.vy);
          var speedCap=pg.kind==="waiting-atp"?38:44;
          if(speed>speedCap){
            motion.vx=motion.vx/speed*speedCap;
            motion.vy=motion.vy/speed*speedCap;
          }
        }
      }
    }

    if(motion.gateGuide&&motion.gateGuide.gate&&motion.gateGuide.gate.isConnected){
      var gg=motion.gateGuide;
      if(!passiveTransportAllowed(el.dataset.type,gg.side)){
        motion.gateGuide.gate.classList.remove("capture-active");
        motion.gateGuide=null;
      }else{
        var gd=Math.hypot(gg.x-x,gg.y-y);
        if(gd<198){
          var gFalloff=Math.max(0,1-gd/198);
          var gForce=(.34+.66*gg.strength)*Math.pow(gFalloff,.78);
          motion.vx+=(gg.x-x)*gForce*dt;
          motion.vy+=(gg.y-y)*gForce*dt;
          gg.gate.classList.add("capture-active");
        }else{
          gg.gate.classList.remove("capture-active");
          motion.gateGuide=null;
        }
      }
    }

    if(motion.craftGuide&&motion.craftGuide.partner&&motion.craftGuide.partner.isConnected){
      var cg=motion.craftGuide;
      cg.x=parseFloat(cg.partner.style.left)||cg.x;
      cg.y=parseFloat(cg.partner.style.top)||cg.y;

      var cdx=cg.x-x;
      var cdy=cg.y-y;
      var cd=Math.hypot(cdx,cdy);

      if(cd<390){
        var cFalloff=Math.max(0,1-cd/390);
        var cForce=.24+.96*Math.pow(cFalloff,.78);
        motion.vx+=cdx*cForce*dt;
        motion.vy+=cdy*cForce*dt;

        var cSpeed=Math.hypot(motion.vx,motion.vy);
        if(cSpeed>68){
          motion.vx=motion.vx/cSpeed*68;
          motion.vy=motion.vy/cSpeed*68;
        }
      }else{
        motion.craftGuide=null;
      }
    }
  }

  function hasCompatibleGate(type){
    var allowed=gates[type]||[];
    if(!allowed.length)return false;
    var proteins=getCachedProteins(performance.now());
    for(var i=0;i<proteins.length;i++){
      if(allowed.indexOf(proteins[i].dataset.type)!==-1&&proteinIsOpen(proteins[i]))return true;
    }
    return false;
  }

  function gradientDirectionText(type){
    var drive=electrochemicalDriveECtoIC(type);
    if(Math.abs(drive)<.30)return "quase em equilíbrio";
    return drive>0?"EC → IC":"IC → EC";
  }

  function updateGradientPanel(now){
    if(now-lastGradientUpdate<420)return;
    lastGradientUpdate=now;

    if(gradientVm)gradientVm.textContent="Vm ≈ "+(membraneVoltageMv>0?"+":"")+membraneVoltageMv+" mV";
    updateSoluteControlCounts();
    refreshCompartmentCounts(now,false);

    ["o2","co2","na","k","glucose"].forEach(function(type){
      var counts=compartmentCountCache[type]||{EC:0,IC:0};
      var max=Math.max(1,counts.EC,counts.IC);
      var ec=document.getElementById("conc-"+type+"-ec");
      var ic=document.getElementById("conc-"+type+"-ic");
      var label=document.getElementById("conc-"+type+"-counts");

      if(ec)ec.style.setProperty("--level",Math.max(2,Math.round(counts.EC/max*100))+"%");
      if(ic)ic.style.setProperty("--level",Math.max(2,Math.round(counts.IC/max*100))+"%");
      if(label)label.textContent="EC "+counts.EC+" · IC "+counts.IC;
    });
  }

  function applyMembraneElectricField(el,motion,dt,b){
    /* PhET-like model: Vm biases crossings and channel states instead of applying a per-frame force to every ion. */
  }

  function makeLipid(delay,flip){
    var lipid=document.createElement("span");
    lipid.className="phospholipid";
    lipid.style.setProperty("--delay",delay+"s");
    var head=document.createElement("i");head.className="lipid-head";
    var tailA=document.createElement("i");tailA.className="lipid-tail tail-a";
    var tailB=document.createElement("i");tailB.className="lipid-tail tail-b";
    if(flip){lipid.append(tailA,tailB,head)}else{lipid.append(head,tailA,tailB)}
    return lipid;
  }

  function buildBilayer(){
    if(!topRow||!bottomRow||!stage)return;
    topRow.textContent="";bottomRow.textContent="";
    var amount=Math.max(46,Math.min(92,Math.round(stage.clientWidth/14)));
    var fragTop=document.createDocumentFragment();
    var fragBottom=document.createDocumentFragment();
    for(var i=0;i<amount;i++){
      var delay=-((i%10)*0.3);
      fragTop.appendChild(makeLipid(delay,false));
      fragBottom.appendChild(makeLipid(delay-.7,true));
    }
    topRow.appendChild(fragTop);bottomRow.appendChild(fragBottom);
  }

  function barrier(){
    if(!geometryDirty&&barrierCache)return barrierCache;

    var stageBox=stage.getBoundingClientRect();
    var membraneBox=bilayer.getBoundingClientRect();
    var top=membraneBox.top-stageBox.top;
    var bottom=membraneBox.bottom-stageBox.top;

    barrierCache={top:top,bottom:bottom,center:(top+bottom)/2,height:bottom-top};
    geometryDirty=false;
    return barrierCache;
  }

  function stageRect(){return stage.getBoundingClientRect()}

  function pointFromClient(clientX,clientY,rect){
    rect=rect||stageRect();
    return {
      x:Math.max(16,Math.min(rect.width-16,clientX-rect.left)),
      y:Math.max(16,Math.min(rect.height-16,clientY-rect.top))
    };
  }

  function sideOf(y,b){
    b=b||barrier();
    if(y<b.top)return "EC";
    if(y>b.bottom)return "IC";
    return "MP";
  }

  function proteinY(){return barrier().center}
  function clampProteinX(x){return Math.max(50,Math.min(stage.clientWidth-50,x))}

  function isVoltageGate(type){return type==="vg-na"||type==="vg-k"}
  function isLigandGate(type){return type==="lg-na"||type==="lg-k"}

  function proteinIsOpen(protein){
    if(!protein||!protein.isConnected)return false;
    var type=protein.dataset.type;
    if(type==="vg-na"||type==="vg-k"||type==="lg-na"||type==="lg-k"){
      return protein.dataset.open==="1";
    }
    return true;
  }

  function syncProteinOpenState(protein){
    if(!protein||!protein.isConnected)return;
    var open=proteinIsOpen(protein);
    protein.classList.toggle("channel-open",open);
    protein.classList.toggle("channel-closed",!open);
    var badge=protein.querySelector(".gate-state-badge");
    if(badge)badge.textContent=open?"Aberto":"Fechado";

    if(isLigandGate(protein.dataset.type)&&protein.dataset.boundLigandId){
      positionBoundLigand(protein);
    }
  }

  function initializeProteinState(protein){
    if(!protein||protein.dataset.kind!=="protein")return;
    var type=protein.dataset.type;

    if(type==="vg-na"){
      protein.dataset.open=membraneVoltageMv===-50?"1":"0";
    }else if(type==="vg-k"){
      protein.dataset.open=membraneVoltageMv===30?"1":"0";
    }else if(type==="sglt"){
      protein.dataset.open="0";
      protein.dataset.cycling="0";
    }else if(isLigandGate(type)){
      protein.dataset.open="0";
      protein.dataset.ligandState="closed";
      protein.dataset.ligandCooldownUntil="0";
    }else{
      protein.dataset.open="1";
    }

    syncProteinOpenState(protein);
  }

  function syncVoltageGates(){
    getCachedProteins(performance.now()).forEach(function(protein){
      if(protein.dataset.type==="vg-na")protein.dataset.open=membraneVoltageMv===-50?"1":"0";
      if(protein.dataset.type==="vg-k")protein.dataset.open=membraneVoltageMv===30?"1":"0";
      if(isVoltageGate(protein.dataset.type))syncProteinOpenState(protein);
    });
  }

  function updateChargePolarity(){
    if(!chargeOuterBand||!chargeInnerBand)return;

    var outerSign=membraneVoltageMv>0?"−":membraneVoltageMv<0?"+":"±";
    var innerSign=membraneVoltageMv>0?"+":membraneVoltageMv<0?"−":"±";
    var outerPolarity=membraneVoltageMv>0?"negative":membraneVoltageMv<0?"positive":"neutral";
    var innerPolarity=membraneVoltageMv>0?"positive":membraneVoltageMv<0?"negative":"neutral";

    chargeOuterBand.dataset.polarity=outerPolarity;
    chargeInnerBand.dataset.polarity=innerPolarity;
    chargeOuterBand.setAttribute("aria-label","Exterior relativamente "+(outerPolarity==="positive"?"positivo":outerPolarity==="negative"?"negativo":"neutro"));
    chargeInnerBand.setAttribute("aria-label","Interior relativamente "+(innerPolarity==="positive"?"positivo":innerPolarity==="negative"?"negativo":"neutro"));

    chargeOuterBand.querySelectorAll("span").forEach(function(node){node.textContent=outerSign});
    chargeInnerBand.querySelectorAll("span").forEach(function(node){node.textContent=innerSign});
  }

  function setMembraneVoltage(value){
    var previousVoltage=membraneVoltageMv;
    membraneVoltageMv=parseInt(value,10);
    if(stageVmStatus)stageVmStatus.textContent="Vm ≈ "+(membraneVoltageMv>0?"+":"")+membraneVoltageMv+" mV";
    if(gradientVm)gradientVm.textContent="Vm ≈ "+(membraneVoltageMv>0?"+":"")+membraneVoltageMv+" mV";

    vmPresetButtons.forEach(function(button){
      var active=parseInt(button.dataset.vm,10)===membraneVoltageMv;
      button.classList.toggle("is-active",active);
      button.setAttribute("aria-pressed",active?"true":"false");
    });

    updateChargePolarity();
    if(previousVoltage!==membraneVoltageMv&&labAudioContext)playLabSound("voltage");

    clearTimeout(voltageGateTimer);
    voltageGateTimer=labSetTimeout(syncVoltageGates,250);
    lastGradientUpdate=0;
  }

  function setChargesVisible(visible){
    chargesVisible=!!visible;
    stage.classList.toggle("charges-visible",chargesVisible);
    if(chargeToggle){
      chargeToggle.classList.toggle("is-active",chargesVisible);
      chargeToggle.setAttribute("aria-pressed",chargesVisible?"true":"false");
    }
  }

  function proteinArt(type){
    if(type==="bomba"){
      return '<span class="protein-label">Bomba Na⁺/K⁺</span>'+
        '<span class="protein-art nak-pump-art" aria-label="Bomba de sódio e potássio">'+
          '<svg class="nak-pump-svg" viewBox="0 0 120 170" aria-hidden="true">'+
            '<path class="nak-shell" d="M31 12 C42 5 51 6 60 12 C69 6 84 7 94 15 C103 24 101 40 102 56 C103 73 108 93 110 106 C113 125 106 140 93 150 C84 156 75 156 68 149 C64 145 62 148 59 153 C55 159 49 159 45 153 C42 148 40 146 36 151 C28 158 17 156 10 149 C3 142 7 131 12 121 C18 109 20 94 22 79 C24 65 23 49 23 37 C23 25 24 17 31 12 Z"/>'+
            '<path class="nak-cavity" d="M53 31 C53 42 52 50 48 57 C43 64 39 69 39 77 C39 86 43 93 49 97 C55 101 57 108 54 116 C51 124 48 133 47 145 C53 140 57 135 61 130 C65 135 69 141 72 146 C73 133 70 123 66 116 C62 108 63 101 69 97 C77 92 82 87 82 79 C82 70 78 63 71 58 C65 53 65 44 65 31 Z"/>'+
            '<path class="nak-atp-groove" d="M31 127 C25 126 21 130 21 136 C21 142 26 145 32 143 C37 142 39 137 37 133 C36 129 34 128 31 127 Z"/>'+
          '</svg>'+
          '<span class="nak-phosphate">P</span>'+
          '<i class="pump-slot nak-site nak-site-k slot-k1" data-accept="k" data-slot="k1" aria-label="Sítio para K+"></i>'+
          '<i class="pump-slot nak-site nak-site-k slot-k2" data-accept="k" data-slot="k2" aria-label="Sítio para K+"></i>'+
          '<i class="pump-slot nak-site nak-site-na slot-na1" data-accept="na" data-slot="na1" aria-label="Sítio para Na+"></i>'+
          '<i class="pump-slot nak-site nak-site-na slot-na2" data-accept="na" data-slot="na2" aria-label="Sítio para Na+"></i>'+
          '<i class="pump-slot nak-site nak-site-na slot-na3" data-accept="na" data-slot="na3" aria-label="Sítio para Na+"></i>'+
          '<i class="pump-slot nak-site nak-site-atp slot-atp" data-accept="atp" data-slot="atp" aria-label="Ranhura intracelular inferior esquerda para ATP"></i>'+
        '</span>'+
        '<span class="pump-state-badge">Na⁺ · 0/3</span>';
    }

    if(type==="sglt"){
      return '<span class="protein-label">Na⁺/Glicose</span>'+
        '<span class="protein-art sglt-art">'+
          '<i class="sglt-site sglt-na-left">Na</i>'+
          '<i class="sglt-site sglt-glucose">G</i>'+
          '<i class="sglt-site sglt-na-right">Na</i>'+
        '</span>'+
        '<span class="gate-state-badge sglt-state-badge">2 Na + G</span>';
    }

    var gated=isVoltageGate(type)||isLigandGate(type);
    return '<span class="protein-label">'+catalogue[type].label+'</span>'+
      '<span class="protein-art protein-channel"><i class="protein-pore"></i></span>'+
      (gated?'<span class="gate-state-badge">Fechado</span>':'');
  }

  function updateCounter(){
    var count=layer.querySelectorAll(".placed-element").length;
    counter.textContent=count+(count===1?" elemento":" elementos");
    dropHint.classList.toggle("is-hidden",count>0);
    updateBuildSlotVisuals();
  }

  function renderDefaultInfo(){
    document.querySelector(".selection-index").textContent="01";
    document.getElementById("infoType").textContent="BICAMADA";
    document.getElementById("infoTitle").textContent="Fosfolipídios";
    document.getElementById("infoText").textContent="A colisão ocorre na própria superfície dos fosfolipídios. Íons só atravessam pelo poro da proteína compatível.";
  }

  function renderInfo(type){
    var item=catalogue[type];
    if(!item)return;
    document.querySelector(".selection-index").textContent="•";
    document.getElementById("infoType").textContent=item.category;
    document.getElementById("infoTitle").textContent=item.name;
    document.getElementById("infoText").textContent=item.text;
  }

  function selectElement(el){
    var previous=selected;
    if(previous&&previous!==el){
      previous.classList.remove("is-selected");
      if(previous.dataset.kind==="molecule"&&!previous.classList.contains("docked")&&!previous.dataset.autoTransport&&!previous.dataset.autoBinding&&!previous.dataset.pumpTransport){
        setCanvasManaged(previous,true);
      }
    }

    selected=el;

    if(el){
      if(el.dataset.kind==="molecule")setCanvasManaged(el,false);
      el.classList.add("is-selected");
      removeButton.hidden=false;
      renderInfo(el.dataset.type);
    }else{
      if(previous&&previous.dataset.kind==="molecule"&&!previous.classList.contains("docked")&&!previous.dataset.autoTransport&&!previous.dataset.autoBinding&&!previous.dataset.pumpTransport){
        setCanvasManaged(previous,true);
      }
      removeButton.hidden=true;
      renderDefaultInfo();
    }
  }

  function showCollision(type){
    var now=performance.now();
    if(type===lastCollisionType&&now-lastCollisionAt<420)return;
    lastCollisionType=type;lastCollisionAt=now;

    var message="A bicamada bloqueou a passagem.";
    if(type==="na")message="Na⁺: atravesse exatamente pelo Canal Na⁺.";
    else if(type==="k")message="K⁺: atravesse pelo Canal K⁺ ou canal vazante.";
    else if(type==="h2o")message="H₂O: atravesse pela aquaporina.";
    else if(type==="cl")message="Cl⁻: ainda não há canal compatível nesta versão.";
    else if(type==="atp")message="ATP: use o encaixe intracelular da bomba.";

    collisionToast.textContent=message;
    collisionToast.classList.add("is-visible");
    clearTimeout(collisionTimer);
    collisionTimer=setTimeout(function(){collisionToast.classList.remove("is-visible")},1000);
  }

  function showGradientBlock(type,fromSide){
    var now=performance.now();
    if(now-lastCollisionAt<520)return;
    lastCollisionAt=now;

    var label=type==="na"?"Na⁺":type==="k"?"K⁺":type==="cl"?"Cl⁻":"íon";
    var direction=gradientDirectionText(type);
    collisionToast.textContent=label+": gradiente eletroquímico favorece "+direction+". O canal passivo não força o fluxo contrário.";
    collisionToast.classList.add("is-visible");
    clearTimeout(collisionTimer);
    collisionTimer=setTimeout(function(){collisionToast.classList.remove("is-visible")},1400);
  }

  function moleculeArt(type){
    if(type==="na")return '<span class="molecule-shape molecule-ion molecule-na"><b>+</b></span>';
    if(type==="k")return '<span class="molecule-shape molecule-ion molecule-k"><b>+</b></span>';
    if(type==="cl")return '<span class="molecule-shape molecule-ion molecule-cl"><b>−</b></span>';
    if(type==="o2")return '<span class="molecule-shape molecule-o2"><i></i><i></i></span>';
    if(type==="co2")return '<span class="molecule-shape molecule-co2"><i></i><i></i><i></i></span>';
    if(type==="glucose")return '<span class="molecule-shape molecule-glucose"></span>';
    if(type==="atp")return '<span class="molecule-shape molecule-atp"><i></i><i></i><i></i><i></i><i></i></span>';
    if(type==="adp")return '<span class="molecule-shape molecule-adp"><i></i><i></i><i></i><b>ADP</b></span>';
    if(type==="pi")return '<span class="molecule-shape molecule-pi">Pi</span>';
    if(type==="ligand-na"||type==="ligand-k")return "";
    return '<span class="molecule-shape molecule-generic">'+(catalogue[type]?catalogue[type].label:type)+'</span>';
  }

  function proteinSlotPositions(){
    var width=Math.max(1,stage.clientWidth);
    var edge=Math.min(86,Math.max(46,width*.07));
    var usable=Math.max(1,width-edge*2);
    var positions=[];
    for(var i=0;i<7;i++)positions.push(edge+usable*(i/6));
    return positions;
  }

  function occupiedProteinSlots(ignoreEl){
    var occupied=new Set();
    layer.querySelectorAll('.placed-protein[data-membrane-slot]').forEach(function(protein){
      if(protein===ignoreEl)return;
      var index=parseInt(protein.dataset.membraneSlot,10);
      if(Number.isFinite(index))occupied.add(index);
    });
    return occupied;
  }

  function nearestAvailableProteinSlot(x,ignoreEl){
    var positions=proteinSlotPositions();
    var occupied=occupiedProteinSlots(ignoreEl);
    var best=null,bestDistance=Infinity;

    positions.forEach(function(px,index){
      if(occupied.has(index))return;
      var distance=Math.abs(px-x);
      if(distance<bestDistance){
        bestDistance=distance;
        best={index:index,x:px};
      }
    });

    return best;
  }

  function clearBuildSlotPreview(){
    membraneBuildSlotNodes.forEach(function(node){node.classList.remove("is-target")});
  }

  function highlightBuildSlot(index){
    membraneBuildSlotNodes.forEach(function(node,i){
      node.classList.toggle("is-target",i===index);
    });
  }

  function updateBuildSlotVisuals(){
    var positions=proteinSlotPositions();
    var occupied=occupiedProteinSlots(null);

    membraneBuildSlotNodes.forEach(function(node,index){
      node.style.left=positions[index]+"px";
      node.classList.toggle("is-occupied",occupied.has(index));
    });
  }

  function assignProteinToSlot(protein,index){
    if(!protein)return false;
    var positions=proteinSlotPositions();
    if(!Number.isFinite(index)||index<0||index>=positions.length)return false;
    if(occupiedProteinSlots(protein).has(index))return false;

    protein.dataset.membraneSlot=String(index);
    protein.style.left=positions[index]+"px";
    protein.style.top=barrier().center+"px";

    if(protein.dataset.type==="bomba")repositionDocked(protein);
    if(isLigandGate(protein.dataset.type))positionBoundLigand(protein);

    clearBuildSlotPreview();
    updateBuildSlotVisuals();
    return true;
  }

  function realignProteinsToBuildSlots(){
    var positions=proteinSlotPositions();

    layer.querySelectorAll('.placed-protein[data-membrane-slot]').forEach(function(protein){
      var index=parseInt(protein.dataset.membraneSlot,10);
      if(!Number.isFinite(index)||positions[index]===undefined)return;
      protein.style.left=positions[index]+"px";
      protein.style.top=barrier().center+"px";
      if(protein.dataset.type==="bomba")repositionDocked(protein);
      if(isLigandGate(protein.dataset.type))positionBoundLigand(protein);
    });

    updateBuildSlotVisuals();
  }

  function createPlaced(type,kind,x,y,options){
    options=options||{};
    var item=catalogue[type];
    if(!item)return null;
    var b=barrier();

    var proteinBuildSlot=null;
    if(kind==="protein"){
      proteinBuildSlot=nearestAvailableProteinSlot(x,null);
      if(!proteinBuildSlot){
        collisionToast.textContent="As 7 posições da membrana já estão ocupadas.";
        collisionToast.classList.add("is-visible");
        clearTimeout(collisionTimer);
        collisionTimer=setTimeout(function(){collisionToast.classList.remove("is-visible")},1200);
        return null;
      }
      x=proteinBuildSlot.x;
      y=b.center;
    }

    var el=document.createElement("div");
    el.className="placed-element "+(kind==="protein"?"placed-protein":"placed-molecule");
    el.dataset.type=type;
    el.dataset.kind=kind;
    el.dataset.id="mem-"+(++placedCount);
    el.innerHTML=kind==="protein"?proteinArt(type):moleculeArt(type);
    el.style.left=x+"px";
    el.style.top=y+"px";
    layer.appendChild(el);
    if(kind==="protein"&&proteinBuildSlot)el.dataset.membraneSlot=String(proteinBuildSlot.index);
    markSceneCacheDirty();

    if(kind==="molecule"){
      var half=Math.max(10,el.offsetHeight/2);
      if(y+half>b.top&&y<b.center)el.style.top=(b.top-half)+"px";
      else if(y-half<b.bottom&&y>=b.center)el.style.top=(b.bottom+half)+"px";
    }else{
      el.style.top=b.center+"px";
    }

    var moleculeInteractive=kind!=="molecule"||options.interactive!==false;

    if(moleculeInteractive){
      el.addEventListener("pointerdown",beginPlacedDrag,{passive:false});
      el.addEventListener("click",function(e){e.stopPropagation();selectElement(el)});
      el.addEventListener("mouseenter",function(){renderInfo(type)});
      el.addEventListener("mouseleave",function(){if(selected)renderInfo(selected.dataset.type);else renderDefaultInfo()});
    }

    if(kind==="molecule"){
      initMoleculeMotion(el);
      if(options.select===false&&options.canvasManaged!==false)setCanvasManaged(el,true);
    }
    if(kind==="protein"){
      initializeProteinState(el);
      if(type==="bomba")initializePumpState(el);
      playLabSound("place");
    }
    if(options.select!==false)selectElement(el);
    updateCounter();
    return el;
  }

  function ghostMarkup(type,kind){
    if(kind==="molecule"){
      return '<span class="ghost-molecule" data-type="'+type+'">'+catalogue[type].label+'</span>';
    }
    if(type==="bomba"){
      return '<span class="ghost-protein"><span class="protein-art nak-pump-art nak-pump-ghost"><svg class="nak-pump-svg" viewBox="0 0 120 170" aria-hidden="true"><path class="nak-shell" d="M31 12 C42 5 51 6 60 12 C69 6 84 7 94 15 C103 24 101 40 102 56 C103 73 108 93 110 106 C113 125 106 140 93 150 C84 156 75 156 68 149 C64 145 62 148 59 153 C55 159 49 159 45 153 C42 148 40 146 36 151 C28 158 17 156 10 149 C3 142 7 131 12 121 C18 109 20 94 22 79 C24 65 23 49 23 37 C23 25 24 17 31 12 Z"/><path class="nak-cavity" d="M53 31 C53 42 52 50 48 57 C43 64 39 69 39 77 C39 86 43 93 49 97 C55 101 57 108 54 116 C51 124 48 133 47 145 C53 140 57 135 61 130 C65 135 69 141 72 146 C73 133 70 123 66 116 C62 108 63 101 69 97 C77 92 82 87 82 79 C82 70 78 63 71 58 C65 53 65 44 65 31 Z"/><path class="nak-atp-groove" d="M31 127 C25 126 21 130 21 136 C21 142 26 145 32 143 C37 142 39 137 37 133 C36 129 34 128 31 127 Z"/></svg></span></span>';
    }
    if(type==="sglt"){
      return '<span class="ghost-protein"><span class="protein-art sglt-art"><i class="sglt-site sglt-na-left">Na</i><i class="sglt-site sglt-glucose">G</i><i class="sglt-site sglt-na-right">Na</i></span></span>';
    }
    return '<span class="ghost-protein"><span class="protein-art protein-channel"><i class="protein-pore"></i></span></span>';
  }

  function safeSpawnPoint(side,index,total){
    var b=barrier();
    var w=stage.clientWidth;
    var h=stage.clientHeight;
    var padX=30;
    var padY=34;
    var minY=side==="EC"?padY:b.bottom+padY;
    var maxY=side==="EC"?b.top-padY:h-padY;

    if(maxY<=minY){
      minY=side==="EC"?20:b.bottom+20;
      maxY=side==="EC"?Math.max(24,b.top-20):Math.max(b.bottom+24,h-20);
    }

    var cols=Math.max(1,Math.ceil(Math.sqrt(total*1.6)));
    var rows=Math.max(1,Math.ceil(total/cols));
    var col=index%cols;
    var row=Math.floor(index/cols);
    var cellW=(w-padX*2)/cols;
    var cellH=(maxY-minY)/rows;

    var x=padX+cellW*(col+.5)+(Math.random()-.5)*Math.min(28,cellW*.65);
    var y=minY+cellH*(row+.5)+(Math.random()-.5)*Math.min(26,cellH*.6);

    return {
      x:Math.max(18,Math.min(w-18,x)),
      y:Math.max(minY,Math.min(maxY,y))
    };
  }

  function freeMoleculeCount(){
    return getCachedMolecules(performance.now()).filter(function(el){
      return el.isConnected&&!el.classList.contains("craft-consumed");
    }).length;
  }

  function typeCount(type){
    return getCachedMoleculesOfType(type,performance.now()).filter(function(el){
      return el.isConnected&&!el.classList.contains("craft-consumed");
    }).length;
  }

  function spawnBatch(type,side,amount){
    amount=Math.max(1,Math.min(50,parseInt(amount,10)||10));
    ensureSceneCache(performance.now());

    var maxPerType=200;
    var maxTotal=520;
    var allowed=Math.max(0,Math.min(
      amount,
      maxPerType-typeCount(type),
      maxTotal-freeMoleculeCount()
    ));

    if(allowed<=0){
      collisionToast.textContent="Limite de partículas atingido para manter a simulação fluida.";
      collisionToast.classList.add("is-visible");
      clearTimeout(collisionTimer);
      collisionTimer=setTimeout(function(){collisionToast.classList.remove("is-visible")},1200);
      return;
    }

    for(var i=0;i<allowed;i++){
      var p=safeSpawnPoint(side,i,allowed);
      var el=createPlaced(type,"molecule",p.x,p.y,{select:false,interactive:false});
      if(el){
        var motion=moleculeMotion.get(el);
        if(motion)chooseRandomWalkVelocity(el,motion,1);
      }
    }

    markSceneCacheDirty();
    compartmentCountCacheAt=0;
    updateSoluteControlCounts();
    updateGradientPanel(performance.now()+500);
  }

  function removeBatch(type,side,amount){
    amount=Math.max(1,Math.min(50,parseInt(amount,10)||10));
    var b=barrier();
    var removed=0;
    var candidates=getCachedMoleculesOfType(type,performance.now()).slice().reverse();

    for(var i=0;i<candidates.length&&removed<amount;i++){
      var el=candidates[i];
      if(!el.isConnected||el===selected||el.classList.contains("docked")||el.classList.contains("craft-consumed"))continue;
      if(el.dataset.autoTransport||el.dataset.autoBinding||el.dataset.pumpTransport||el.dataset.sgltTransport)continue;
      var y=parseFloat(el.style.top)||0;
      if(sideOf(y,b)!==side)continue;
      el.remove();
      removed++;
    }

    if(removed){
      markSceneCacheDirty();
      compartmentCountCacheAt=0;
      updateSoluteControlCounts();
      updateGradientPanel(performance.now()+500);
    }
  }

  function adjustSelectedSolute(side,delta){
    if(delta>0)spawnBatch(selectedSoluteType,side,delta);
    else removeBatch(selectedSoluteType,side,Math.abs(delta));
  }

  function soluteDisplay(type){
    if(type==="o2")return {symbol:"O₂",name:"Oxigênio"};
    if(type==="co2")return {symbol:"CO₂",name:"Dióxido de carbono"};
    if(type==="na")return {symbol:"Na⁺",name:"Sódio"};
    if(type==="k")return {symbol:"K⁺",name:"Potássio"};
    if(type==="glucose")return {symbol:"G",name:"Glicose"};
    return {symbol:"ATP",name:"ATP"};
  }

  function selectSoluteType(type){
    if(soluteTypes.indexOf(type)===-1)return;
    selectedSoluteType=type;

    document.querySelectorAll(".solute-choice").forEach(function(button){
      var active=button.dataset.soluteType===type;
      button.classList.toggle("is-active",active);
      button.setAttribute("aria-selected",active?"true":"false");
    });

    var display=soluteDisplay(type);
    if(activeSoluteSymbolEC)activeSoluteSymbolEC.textContent=display.symbol;
    if(activeSoluteSymbolIC)activeSoluteSymbolIC.textContent=display.symbol;
    updateSoluteControlCounts();
  }

  function updateSoluteControlCounts(){
    refreshCompartmentCounts(performance.now(),false);
    var counts=compartmentCountCache[selectedSoluteType]||{EC:0,IC:0};

    if(activeCountEC)activeCountEC.textContent=counts.EC||0;
    if(activeCountIC)activeCountIC.textContent=counts.IC||0;
  }

  function beginSourceDrag(event){
    if(event.button!==undefined&&event.button!==0)return;
    event.preventDefault();

    var tool=event.currentTarget;
    setArmedTool(tool);

    var ghost=document.createElement("div");
    ghost.className="drag-ghost";
    ghost.innerHTML=ghostMarkup(tool.dataset.type,tool.dataset.kind);
    document.body.appendChild(ghost);

    var rect=stageRect();
    sourceDrag={
      tool:tool,
      type:tool.dataset.type,
      kind:tool.dataset.kind,
      pointerId:event.pointerId,
      startX:event.clientX,
      startY:event.clientY,
      clientX:event.clientX,
      clientY:event.clientY,
      rect:rect,
      ghost:ghost,
      moved:false
    };

    ghost.style.left="0px";
    ghost.style.top="0px";
    ghost.style.transform="translate3d("+event.clientX+"px,"+event.clientY+"px,0) translate(-50%,-50%)";
    stage.classList.add("drag-source-active");
    try{tool.setPointerCapture(event.pointerId)}catch(_){}
  }

  function queueSourceMove(event){
    if(!sourceDrag||event.pointerId!==sourceDrag.pointerId)return;
    sourceDrag.clientX=event.clientX;
    sourceDrag.clientY=event.clientY;
    if(Math.hypot(event.clientX-sourceDrag.startX,event.clientY-sourceDrag.startY)>4)sourceDrag.moved=true;
    if(rafSource)return;
    rafSource=requestAnimationFrame(applySourceMove);
  }

  function applySourceMove(){
    rafSource=0;
    if(!sourceDrag)return;
    var d=sourceDrag;
    d.ghost.style.transform="translate3d("+d.clientX+"px,"+d.clientY+"px,0) translate(-50%,-50%)";
    var r=d.rect;
    var inside=d.clientX>=r.left&&d.clientX<=r.right&&d.clientY>=r.top&&d.clientY<=r.bottom;
    stage.classList.toggle("is-drop-target",inside);
  }

  function endSourceDrag(event){
    if(!sourceDrag||event.pointerId!==sourceDrag.pointerId)return;
    if(rafSource){
      cancelAnimationFrame(rafSource);
      rafSource=0;
      applySourceMove();
    }

    var d=sourceDrag;
    var r=d.rect;
    var inside=d.clientX>=r.left&&d.clientX<=r.right&&d.clientY>=r.top&&d.clientY<=r.bottom;

    if(inside&&d.moved){
      var p=pointFromClient(d.clientX,d.clientY,r);
      var created=createPlaced(d.type,d.kind,p.x,p.y);

      if(created&&d.kind==="molecule"){
        var directSlot=findDockTarget(created,p.x,p.y);
        if(directSlot){
          dockElement(created,directSlot);
        }else{
          var directCraft=findCraftTarget(created,p.x,p.y);
          if(directCraft)craftATP(created,directCraft);
        }
      }

      clearArmedTool();
    }else if(!d.moved){
      setArmedTool(d.tool);
    }

    d.ghost.remove();
    stage.classList.remove("drag-source-active","is-drop-target");
    try{d.tool.releasePointerCapture(d.pointerId)}catch(_){}
    sourceDrag=null;
  }

  function compatibleGate(type,x){
    var allowed=gates[type]||[];
    if(!allowed.length)return null;
    var best=null,bestDistance=Infinity;
    getCachedProteins(performance.now()).forEach(function(protein){
      if(allowed.indexOf(protein.dataset.type)===-1||!proteinIsOpen(protein))return;
      var px=parseFloat(protein.style.left)||0;
      var distance=Math.abs(px-x);
      if(distance<=34&&distance<bestDistance){best=protein;bestDistance=distance}
    });
    return best;
  }

  function clearGateGlow(){
    layer.querySelectorAll(".channel-pass").forEach(function(el){el.classList.remove("channel-pass")});
  }

  function slotStagePoint(slot){
    var now=performance.now();
    var cached=slotPointCache.get(slot);
    if(cached&&now-cached.at<120)return {x:cached.x,y:cached.y};

    var sr=slot.getBoundingClientRect(),tr=stageRect();
    var point={x:sr.left+sr.width/2-tr.left,y:sr.top+sr.height/2-tr.top,at:now};
    slotPointCache.set(slot,point);
    return {x:point.x,y:point.y};
  }

  function releaseSlotFor(el){
    if(!el.dataset.dockedPump||!el.dataset.dockedSlot)return;
    var pump=layer.querySelector('[data-id="'+el.dataset.dockedPump+'"]');
    if(pump){
      var slot=pump.querySelector('[data-slot="'+el.dataset.dockedSlot+'"]');
      if(slot){
        slot.classList.remove("occupied","slot-ready");
        delete slot.dataset.occupiedId;
        if(slot.dataset.accept==="atp")delete pump.dataset.atpBound;
      }
      updatePumpState(pump);
    }
    delete el.dataset.dockedPump;delete el.dataset.dockedSlot;el.classList.remove("docked");
  }

  function clearPumpSlot(slot){
    if(!slot)return;

    var pump=slot.closest('.placed-protein[data-type="bomba"]');
    slot.classList.remove("occupied","slot-ready");
    delete slot.dataset.occupiedId;
    delete slot.dataset.reservedBy;
    slotPointCache.delete(slot);

    if(pump&&slot.dataset.accept==="atp"){
      delete pump.dataset.atpBound;
    }
  }

  function initializePumpState(pump){
    if(!pump)return;
    delete pump.dataset.cycling;
    delete pump.dataset.phosphateBound;
    setPumpVisualState(pump,"inside-open","Na⁺ · 0/3");
  }

  function pumpState(pump){
    return pump&&pump.dataset.pumpState?pump.dataset.pumpState:"inside-open";
  }

  function pumpSlotActive(slot,pump){
    var state=pumpState(pump);
    var accept=slot.dataset.accept;

    if(state==="inside-open")return accept==="na";
    if(state==="inside-na-bound")return accept==="atp";
    if(state==="outside-open")return accept==="k";
    // phosphorylating, na-releasing, atp-products, k-bound and resetting accept nothing
    return false;
  }

  function setPumpVisualState(pump,state,label){
    if(!pump)return;
    pump.dataset.pumpState=state;

    pump.querySelectorAll(".pump-slot").forEach(function(slot){
      var active=pumpSlotActive(slot,pump);
      slot.classList.toggle("pump-site-active",active);
      slot.classList.toggle("pump-site-inactive",!active&&!slot.classList.contains("occupied"));

      if(!active&&slot.dataset.reservedBy){
        var reserved=layer.querySelector('[data-id="'+slot.dataset.reservedBy+'"]');
        if(reserved){
          var motion=moleculeMotion.get(reserved);
          if(motion){
            motion.pumpReservedSlot=null;
            motion.pumpGuide=null;
          }
        }
        delete slot.dataset.reservedBy;
      }
    });

    var badge=pump.querySelector(".pump-state-badge");
    if(badge)badge.textContent=label||(
      state==="inside-open"?"Na⁺ · "+pumpMolecules(pump,"na").length+"/3":
      state==="inside-na-bound"?"ATP":
      state==="phosphorylating"?"Fosforilação":
      state==="na-releasing"?"3 Na⁺ → EC":
      state==="atp-products"?"ATP → ADP + Pi":
      state==="outside-open"?"K⁺ · "+pumpMolecules(pump,"k").length+"/2":
      state==="k-bound"?"Retorno":
      state==="resetting"?"Retorno":"Bomba ativa"
    );
  }

  function pumpOccupied(pump,type){
    return Array.from(pump.querySelectorAll(".pump-slot.occupied")).filter(function(slot){
      var el=layer.querySelector('[data-id="'+slot.dataset.occupiedId+'"]');
      return el&&el.dataset.type===type;
    });
  }

  function pumpMolecules(pump,type){
    return pumpOccupied(pump,type).map(function(slot){
      return {slot:slot,el:layer.querySelector('[data-id="'+slot.dataset.occupiedId+'"]')};
    }).filter(function(item){return item.el});
  }

  function releasePumpParticle(el,slot){
    if(slot)clearPumpSlot(slot);
    delete el.dataset.dockedPump;
    delete el.dataset.dockedSlot;
    el.classList.remove("docked");
  }

  function animatePumpParticle(el,pump,direction,lane,onDone){
    if(!el||!el.isConnected||!pump||!pump.isConnected){
      if(onDone)onDone();
      return;
    }

    var b=barrier();
    var pumpX=parseFloat(pump.style.left)||stage.clientWidth/2;
    var startX=parseFloat(el.style.left)||pumpX;
    var startY=parseFloat(el.style.top)||b.center;
    var outward=direction==="outward";
    var mouthY=outward?b.top-12:b.bottom+12;
    var finalY=outward?b.top-78:b.bottom+78;
    var finalX=pumpX+(lane||0);
    var started=performance.now();
    var duration=760;

    setCanvasManaged(el,false);
    el.dataset.pumpTransport="1";
    el.classList.add("pump-transit","crossing-flash");

    function frame(now){
      if(!isLabForeground()){
        var pausedAt=performance.now();
        runWhenLabForeground(function(){
          started+=performance.now()-pausedAt;
          requestAnimationFrame(frame);
        });
        return;
      }

      if(!el.isConnected||!pump.isConnected){
        delete el.dataset.pumpTransport;
        if(onDone)onDone();
        return;
      }

      var t=Math.min(1,(now-started)/duration);
      var eased=smooth01(t);
      var x,y;

      if(t<.46){
        var a=smooth01(t/.46);
        x=startX+(pumpX-startX)*a;
        y=startY+(b.center-startY)*a;
      }else{
        var q=smooth01((t-.46)/.54);
        x=pumpX+(finalX-pumpX)*q;
        y=b.center+(mouthY-b.center)*Math.min(q*1.45,1);
        if(q>.68){
          var r=smooth01((q-.68)/.32);
          y=mouthY+(finalY-mouthY)*r;
        }
      }

      el.style.left=x+"px";
      el.style.top=y+"px";

      if(t<1){
        requestAnimationFrame(frame);
      }else{
        el.style.left=finalX+"px";
        el.style.top=finalY+"px";
        el.classList.remove("pump-transit","crossing-flash");
        delete el.dataset.pumpTransport;

        var motion=moleculeMotion.get(el);
        if(motion){
          var sign=outward?-1:1;
          var now2=performance.now();
          motion.vx=(Math.random()-.5)*42;
          motion.vy=sign*(44+Math.random()*20);
          motion.targetVx=motion.vx;
          motion.targetVy=motion.vy;
          motion.boostUntil=now2+1350;
          motion.associationCooldownUntil=now2+1500;
          motion.channelCooldownUntil=now2+1500;
          motion.directionChangeAt=now2+900+Math.random()*500;
          motion.gateGuide=null;
          motion.pumpGuide=null;
        }

        if(el!==selected)setCanvasManaged(el,true);
        if(onDone)onDone();
      }
    }

    requestAnimationFrame(frame);
  }

  function moleculeAvailableForSglt(el){
    return el&&el.isConnected&&!el.classList.contains("docked")&&!el.classList.contains("craft-consumed")&&
      !el.dataset.autoTransport&&!el.dataset.autoBinding&&!el.dataset.pumpTransport&&!el.dataset.sgltTransport;
  }

  function animateSgltParticle(el,transporter,targetX,targetY,finalX,finalY,delay){
    setCanvasManaged(el,false);
    el.dataset.sgltTransport="1";

    var sx=parseFloat(el.style.left)||targetX;
    var sy=parseFloat(el.style.top)||targetY;

    labSetTimeout(function(){
      if(!el.isConnected||!transporter.isConnected)return;
      var start=performance.now();
      var bindDuration=320;

      function bindFrame(now){
        if(!isLabForeground()){
          var pausedAt=performance.now();
          runWhenLabForeground(function(){
            start+=performance.now()-pausedAt;
            requestAnimationFrame(bindFrame);
          });
          return;
        }
        if(!el.isConnected||!transporter.isConnected)return;
        var t=Math.min(1,(now-start)/bindDuration);
        var e=smooth01(t);
        el.style.left=(sx+(targetX-sx)*e)+"px";
        el.style.top=(sy+(targetY-sy)*e)+"px";
        if(t<1)requestAnimationFrame(bindFrame);
      }
      requestAnimationFrame(bindFrame);
    },delay||0);

    labSetTimeout(function(){
      if(!el.isConnected||!transporter.isConnected)return;
      var sx2=parseFloat(el.style.left)||targetX;
      var sy2=parseFloat(el.style.top)||targetY;
      var start2=performance.now();
      var duration2=620;

      function passFrame(now){
        if(!isLabForeground()){
          var pausedAt=performance.now();
          runWhenLabForeground(function(){
            start2+=performance.now()-pausedAt;
            requestAnimationFrame(passFrame);
          });
          return;
        }
        if(!el.isConnected||!transporter.isConnected)return;
        var t=Math.min(1,(now-start2)/duration2);
        var e=smooth01(t);
        el.style.left=(sx2+(finalX-sx2)*e)+"px";
        el.style.top=(sy2+(finalY-sy2)*e)+"px";

        if(t<1){
          requestAnimationFrame(passFrame);
        }else{
          delete el.dataset.sgltTransport;
          if(el!==selected)setCanvasManaged(el,true);
          var motion=moleculeMotion.get(el);
          if(motion){
            chooseRandomWalkVelocity(el,motion,1);
            motion.channelCooldownUntil=performance.now()+3500;
            motion.associationCooldownUntil=performance.now()+1000;
          }
        }
      }
      requestAnimationFrame(passFrame);
    },(delay||0)+820);
  }

  function startSgltCycle(transporter,naA,naB,glucose){
    if(!transporter||transporter.dataset.cycling==="1")return;
    transporter.dataset.cycling="1";
    transporter.classList.add("sglt-cycling");

    var badge=transporter.querySelector(".sglt-state-badge");
    if(badge)badge.textContent="Ligando";

    var b=barrier();
    var px=parseFloat(transporter.style.left)||stage.clientWidth/2;
    var entryY=b.top-34;
    var finalY=b.bottom+62;

    animateSgltParticle(naA,transporter,px-18,entryY,px-20,finalY,0);
    animateSgltParticle(glucose,transporter,px,entryY+8,px,finalY+8,80);
    animateSgltParticle(naB,transporter,px+18,entryY,px+20,finalY,160);

    labSetTimeout(function(){
      if(!transporter.isConnected)return;
      if(badge)badge.textContent="Transportando";
    },500);

    labSetTimeout(function(){
      if(!transporter.isConnected)return;
      transporter.dataset.cycling="0";
      transporter.classList.remove("sglt-cycling");
      if(badge)badge.textContent="Na⁺ + glicose";
    },1750);
  }

  function updateSgltTransporters(now,b){
    if(!activeModeFeatures.sglt)return;
    var transporters=getCachedProteinsOfType("sglt",now);
    if(!transporters.length)return;

    var sodium=getCachedMoleculesOfType("na",now);
    var glucose=getCachedMoleculesOfType("glucose",now);

    transporters.forEach(function(transporter){
      if(transporter.dataset.cycling==="1")return;
      if(crossingProbability("na","EC")<.52)return;

      var px=parseFloat(transporter.style.left)||0;
      var naNear=[];
      var glucoseNear=null;
      var glucoseD=Infinity;

      for(var i=0;i<sodium.length;i++){
        var ion=sodium[i];
        if(!moleculeAvailableForSglt(ion))continue;
        var iy=parseFloat(ion.style.top)||0;
        if(sideOf(iy,b)!=="EC")continue;
        var ix=parseFloat(ion.style.left)||0;
        var d=Math.hypot(ix-px,(iy-b.top)*.72);
        if(d<135)naNear.push({el:ion,d:d});
      }

      naNear.sort(function(a,c){return a.d-c.d});

      for(var g=0;g<glucose.length;g++){
        var sugar=glucose[g];
        if(!moleculeAvailableForSglt(sugar))continue;
        var gy=parseFloat(sugar.style.top)||0;
        if(sideOf(gy,b)!=="EC")continue;
        var gx=parseFloat(sugar.style.left)||0;
        var gd=Math.hypot(gx-px,(gy-b.top)*.72);
        if(gd<135&&gd<glucoseD){glucoseNear=sugar;glucoseD=gd}
      }

      if(naNear.length>=2&&glucoseNear){
        startSgltCycle(transporter,naNear[0].el,naNear[1].el,glucoseNear);
      }
    });
  }

  function isLigandType(type){return type==="ligand-na"||type==="ligand-k"}

  function ligandChannelType(ligandType){
    return ligandType==="ligand-na"?"lg-na":ligandType==="ligand-k"?"lg-k":null;
  }

  function ligandBindingPoint(channel){
    var px=parseFloat(channel.style.left)||0;
    var py=parseFloat(channel.style.top)||barrier().center;
    var open=channel.dataset.open==="1";
    var type=channel.dataset.type;

    // Ratios adapted from the reference artwork dimensions (650x900).
    // K ligand site sits very far to the extracellular-left edge.
    if(type==="lg-k"){
      return {
        x:px-27.5,
        y:py-55
      };
    }

    // Na site shifts further left after the channel opens.
    return {
      x:px+(open?-21.8:-15.5),
      y:py-51.5
    };
  }

  function positionBoundLigand(channel){
    if(!channel||!channel.dataset.boundLigandId)return;
    var ligand=layer.querySelector('[data-id="'+channel.dataset.boundLigandId+'"]');
    if(!ligand)return;

    var p=ligandBindingPoint(channel);
    ligand.style.left=p.x+"px";
    ligand.style.top=p.y+"px";
  }

  function releaseBoundLigand(channel,naturally){
    if(!channel)return;
    var ligandId=channel.dataset.boundLigandId;
    var ligand=ligandId?layer.querySelector('[data-id="'+ligandId+'"]'):null;

    if(ligand){
      delete ligand.dataset.ligandBound;
      var motion=moleculeMotion.get(ligand);
      if(motion){
        chooseRandomWalkVelocity(ligand,motion,1);
        motion.associationCooldownUntil=performance.now()+180;
      }
    }

    delete channel.dataset.boundLigandId;
    channel.dataset.open="0";
    channel.dataset.ligandState="closed";
    channel.dataset.ligandCooldownUntil="0";
    syncProteinOpenState(channel);
  }

  function bindLigandToChannel(ligand,channel){
    if(!ligand||!channel||ligand.dataset.ligandBound)return false;
    if(channel.dataset.boundLigandId)return false;

    ligand.dataset.ligandBound=channel.dataset.id;
    channel.dataset.boundLigandId=ligand.dataset.id;
    channel.dataset.ligandState="opening";
    channel.dataset.open="0";
    positionBoundLigand(channel);
    playLabSound("ligand");

    var motion=moleculeMotion.get(ligand);
    if(motion){motion.vx=0;motion.vy=0}

    syncProteinOpenState(channel);

    labSetTimeout(function(){
      if(!channel.isConnected||channel.dataset.boundLigandId!==ligand.dataset.id)return;
      channel.dataset.ligandState="open";
      channel.dataset.open="1";
      syncProteinOpenState(channel);
    },180);

    return true;
  }

  function tryLigandBinding(ligand,x,y,b,now){
    if(!activeModeFeatures.ligands)return false;
    var channelType=ligandChannelType(ligand.dataset.type);
    if(!channelType||ligand.dataset.ligandBound)return false;
    var side=sideOf(y,b);
    if(side!=="EC")return false;

    var channels=getCachedProteinsOfType(channelType,now);
    var best=null,bestD=Infinity;
    for(var i=0;i<channels.length;i++){
      var channel=channels[i];
      if(channel.dataset.boundLigandId)continue;
      if(now<(parseFloat(channel.dataset.ligandCooldownUntil)||0))continue;
      var px=parseFloat(channel.style.left)||0;
      var py=parseFloat(channel.style.top)||b.center;
      var d=Math.hypot(px-x,(py-y)*.7);
      if(d<105&&d<bestD){best=channel;bestD=d}
    }

    return best?bindLigandToChannel(ligand,best):false;
  }

  function clearLigandDropTargets(){
    getCachedProteins(performance.now()).forEach(function(channel){
      if(isLigandGate(channel.dataset.type))channel.classList.remove("ligand-drop-target");
    });
  }

  function closestLigandChannelForDrop(ligand,x,y,now,radius){
    var channelType=ligandChannelType(ligand.dataset.type);
    if(!channelType)return null;

    var b=barrier();
    if(sideOf(y,b)!=="EC")return null;

    var channels=getCachedProteinsOfType(channelType,now);
    var best=null,bestD=Infinity;

    for(var i=0;i<channels.length;i++){
      var channel=channels[i];
      if(channel.dataset.boundLigandId)continue;
      var binding=ligandBindingPoint(channel);
      var d=Math.hypot(binding.x-x,binding.y-y);
      if(d<(radius||115)&&d<bestD){best=channel;bestD=d}
    }

    return best;
  }

  function updateLigandChannels(now){
    if(!activeModeFeatures.ligands)return;
    getCachedProteins(now).forEach(function(channel){
      if(!isLigandGate(channel.dataset.type))return;
      var shouldOpen=!!channel.dataset.boundLigandId;
      if(shouldOpen&&channel.dataset.open!=="1"&&channel.dataset.ligandState!=="opening"){
        channel.dataset.open="1";
        channel.dataset.ligandState="open";
        syncProteinOpenState(channel);
      }else if(!shouldOpen&&channel.dataset.open==="1"){
        channel.dataset.open="0";
        channel.dataset.ligandState="closed";
        syncProteinOpenState(channel);
      }
    });
  }

  function addLigands(){
    if(ligandsAdded)return;
    ligandsAdded=true;

    ["ligand-na","ligand-k"].forEach(function(type,typeIndex){
      for(var i=0;i<7;i++){
        var p=safeSpawnPoint("EC",i,7);
        p.x+=typeIndex?10:-10;
        var ligand=createPlaced(type,"molecule",p.x,p.y,{
          select:false,
          interactive:true,
          canvasManaged:false
        });

        if(ligand){
          ligand.classList.add("free-ligand");
          var motion=moleculeMotion.get(ligand);
          if(motion)chooseRandomWalkVelocity(ligand,motion,.9);
        }
      }
    });

    if(ligandToggle){
      ligandToggle.textContent="Retirar ligantes";
      ligandToggle.classList.add("is-active");
      ligandToggle.setAttribute("aria-pressed","true");
    }

    markSceneCacheDirty();
  }

  function removeLigands(){
    getCachedProteins(performance.now()).forEach(function(channel){
      if(isLigandGate(channel.dataset.type)){
        if(channel.dataset.boundLigandId)releaseBoundLigand(channel,false);
        channel.dataset.open="0";
        channel.dataset.ligandState="closed";
        syncProteinOpenState(channel);
      }
    });

    getCachedMolecules(performance.now()).forEach(function(el){
      if(isLigandType(el.dataset.type))el.remove();
    });

    ligandsAdded=false;
    markSceneCacheDirty();
    compartmentCountCacheAt=0;

    if(ligandToggle){
      ligandToggle.textContent="Adicionar ligantes";
      ligandToggle.classList.remove("is-active");
      ligandToggle.setAttribute("aria-pressed","false");
    }
  }

  function findDockTarget(el,x,y){
    var type=el.dataset.type,best=null,bestDistance=Infinity;
    var b=barrier();

    if(type==="k"&&y>b.center+10)return null;
    if((type==="na"||type==="atp")&&y<b.center-10)return null;

    layer.querySelectorAll('.placed-protein[data-type="bomba"] .pump-slot:not(.occupied)').forEach(function(slot){
      var pump=slot.closest('.placed-protein[data-type="bomba"]');
      if(slot.dataset.accept!==type||!pumpSlotActive(slot,pump))return;
      var p=slotStagePoint(slot),d=Math.hypot(p.x-x,p.y-y);
      if(d<46&&d<bestDistance){best=slot;bestDistance=d}
    });
    return best;
  }

  function markReadySlot(slot){
    layer.querySelectorAll(".pump-slot.slot-ready").forEach(function(node){node.classList.remove("slot-ready")});
    if(slot)slot.classList.add("slot-ready");
  }

  function craftPairType(type){
    if(type==="adp")return "pi";
    if(type==="pi")return "adp";
    return null;
  }

  function findCraftTarget(el,x,y){
    var partnerType=craftPairType(el.dataset.type);
    if(!partnerType)return null;

    var b=barrier();
    var sourceSide=sideOf(y,b);
    if(sourceSide==="MP")return null;

    var best=null;
    var bestDistance=Infinity;

    layer.querySelectorAll('.placed-molecule[data-type="'+partnerType+'"]:not(.docked)').forEach(function(candidate){
      if(candidate===el)return;
      var cx=parseFloat(candidate.style.left)||0;
      var cy=parseFloat(candidate.style.top)||0;
      if(sideOf(cy,b)!==sourceSide)return;

      var d=Math.hypot(cx-x,cy-y);
      if(d<70&&d<bestDistance){
        best=candidate;
        bestDistance=d;
      }
    });

    return best;
  }

  function markCraftTarget(target){
    layer.querySelectorAll(".craft-ready").forEach(function(node){node.classList.remove("craft-ready")});
    if(target)target.classList.add("craft-ready");
  }

  function craftATP(a,b){
    if(!a||!b||!a.isConnected||!b.isConnected)return null;
    if(a.classList.contains("craft-consumed")||b.classList.contains("craft-consumed"))return null;

    var ax=parseFloat(a.style.left)||0;
    var ay=parseFloat(a.style.top)||0;
    var bx=parseFloat(b.style.left)||0;
    var by=parseFloat(b.style.top)||0;
    var x=(ax+bx)/2;
    var y=(ay+by)/2;

    if(selected===a||selected===b)selected=null;

    a.classList.add("craft-consumed");
    b.classList.add("craft-consumed");
    playLabSound("synthesize");

    labSetTimeout(function(){
      if(a.isConnected)a.remove();
      if(b.isConnected)b.remove();
      markSceneCacheDirty();
      compartmentCountCacheAt=0;

      var atp=createPlaced("atp","molecule",x,y,{select:false,interactive:false});
      if(atp){
        atp.classList.add("craft-created");
        labSetTimeout(function(){if(atp.isConnected)atp.classList.remove("craft-created")},700);
        selectElement(atp);
      }
      updateCounter();
    },180);

    collisionToast.textContent="Craft molecular: ADP + Pi → ATP";
    collisionToast.classList.add("is-visible");
    clearTimeout(collisionTimer);
    collisionTimer=labSetTimeout(function(){collisionToast.classList.remove("is-visible")},1200);

    return true;
  }

  function dockElement(el,slot){
    if(!el||!slot)return false;

    var pump=slot.closest('.placed-protein[data-type="bomba"]');
    if(!pump||pump.dataset.cycling==="1")return false;
    if(slot.classList.contains("occupied"))return false;
    if(slot.dataset.accept!==el.dataset.type||!pumpSlotActive(slot,pump))return false;

    if(slot.dataset.reservedBy&&slot.dataset.reservedBy!==el.dataset.id){
      var reserved=layer.querySelector('[data-id="'+slot.dataset.reservedBy+'"]');
      if(reserved){
        var reservedMotion=moleculeMotion.get(reserved);
        if(reservedMotion){
          reservedMotion.pumpGuide=null;
          reservedMotion.pumpGuideStartedAt=0;
          if(reservedMotion.pumpReservedSlot===slot)reservedMotion.pumpReservedSlot=null;
          reservedMotion.associationCooldownUntil=performance.now()+260;
          chooseRandomWalkVelocity(reserved,reservedMotion,.9);
        }
      }
      delete slot.dataset.reservedBy;
    }

    setCanvasManaged(el,false);
    releaseSlotFor(el);

    var p=slotStagePoint(slot);
    el.style.left=p.x+"px";el.style.top=p.y+"px";
    el.dataset.dockedPump=pump.dataset.id;el.dataset.dockedSlot=slot.dataset.slot;
    el.classList.add("docked");

    var motion=moleculeMotion.get(el);
    if(motion){
      if(motion.pumpReservedSlot===slot)motion.pumpReservedSlot=null;
      motion.pumpGuide=null;
    }

    delete slot.dataset.reservedBy;
    if(el.dataset.type==="atp")pump.dataset.atpBound="1";
    slot.classList.remove("slot-ready");
    slot.classList.add("occupied");
    slot.dataset.occupiedId=el.dataset.id;

    playLabSound("dock");
    updatePumpState(pump);
    selectElement(pump);
    return true;
  }

  function repositionDocked(pump){
    if(!pump)return;

    pump.querySelectorAll(".pump-slot.occupied").forEach(function(slot){
      var el=layer.querySelector('[data-id="'+slot.dataset.occupiedId+'"]');
      if(!el)return;

      // The pump itself is moving, so cached slot coordinates would make ions lag behind.
      slotPointCache.delete(slot);
      var p=slotStagePoint(slot);
      el.style.left=p.x+"px";
      el.style.top=p.y+"px";
    });
  }

  function updatePumpState(pump){
    if(!pump||!pump.isConnected||pump.dataset.cycling==="1")return;

    var state=pumpState(pump);
    var na=pumpMolecules(pump,"na").length;
    var k=pumpMolecules(pump,"k").length;
    var atp=pumpMolecules(pump,"atp").length;

    if(state==="inside-open"){
      if(na>=3){
        setPumpVisualState(pump,"inside-na-bound","ATP");
      }else{
        setPumpVisualState(pump,"inside-open",na+"/3 Na⁺");
      }
      return;
    }

    if(state==="inside-na-bound"){
      if(na<3){
        setPumpVisualState(pump,"inside-open",na+"/3 Na⁺");
        return;
      }
      if(atp>=1){
        startPumpPhosphorylation(pump);
      }else{
        setPumpVisualState(pump,"inside-na-bound","ATP");
      }
      return;
    }

    if(state==="outside-open"){
      if(k>=2){
        startPumpReturn(pump);
      }else{
        setPumpVisualState(pump,"outside-open",k+"/2 K⁺");
      }
    }
  }

  function startPumpPhosphorylation(pump){
    if(!pump||pump.dataset.cycling==="1")return;

    var sodium=pumpMolecules(pump,"na");
    var atpItems=pumpMolecules(pump,"atp");
    if(sodium.length<3||atpItems.length<1){
      updatePumpState(pump);
      return;
    }

    pump.dataset.cycling="1";
    var atpItem=atpItems[0];

    // 1) 3 Na+ and ATP remain visibly docked while phosphorylation occurs.
    pump.dataset.phosphateBound="1";
    setPumpVisualState(pump,"phosphorylating","Fosforilação");
    playLabSound("phosphorylate");

    labSetTimeout(function(){
      if(!pump.isConnected)return;

      // 2) Only after phosphorylation do the 3 Na+ leave toward EC.
      setPumpVisualState(pump,"na-releasing","3 Na⁺ → EC");
      playLabSound("release");

      var lanes=[-28,0,28];
      var remaining=sodium.length;

      if(!remaining){
        finishNaRelease();
        return;
      }

      sodium.forEach(function(item,index){
        if(!item.el||!item.el.isConnected){
          remaining-=1;
          if(remaining<=0)finishNaRelease();
          return;
        }

        releasePumpParticle(item.el,item.slot);
        animatePumpParticle(item.el,pump,"outward",lanes[index]||0,function(){
          remaining-=1;
          if(remaining<=0)finishNaRelease();
        });
      });

      function finishNaRelease(){
        if(!pump.isConnected)return;

        // 3) After all three Na+ reach EC, ATP leaves its groove and becomes ADP + Pi.
        setPumpVisualState(pump,"atp-products","ATP → ADP + Pi");
        playLabSound("hydrolysis");

        if(atpItem.el&&atpItem.el.isConnected){
          releasePumpParticle(atpItem.el,atpItem.slot);

          var px=parseFloat(pump.style.left)||stage.clientWidth/2;
          var b=barrier();

          atpItem.el.remove();
          delete pump.dataset.atpBound;
          markSceneCacheDirty();
          compartmentCountCacheAt=0;

          var adp=createPlaced(
            "adp","molecule",
            Math.max(42,Math.min(stage.clientWidth-42,px-31)),
            b.bottom+58,
            {select:false,interactive:false}
          );
          if(adp){
            var am=moleculeMotion.get(adp);
            if(am){
              am.vx=7+Math.random()*4;
              am.vy=12+Math.random()*6;
              am.targetVx=am.vx;
              am.targetVy=am.vy;
              am.directionChangeAt=performance.now()+700;
            }
          }

          var pi=createPlaced(
            "pi","molecule",
            Math.max(30,Math.min(stage.clientWidth-30,px+31)),
            b.bottom+55,
            {select:false,interactive:false}
          );
          if(pi){
            var pm=moleculeMotion.get(pi);
            if(pm){
              pm.vx=-7-Math.random()*4;
              pm.vy=12+Math.random()*6;
              pm.targetVx=pm.vx;
              pm.targetVy=pm.vy;
              pm.directionChangeAt=performance.now()+650;
            }
          }

          if(adp&&pi){
            var amNow=moleculeMotion.get(adp);
            var pmNow=moleculeMotion.get(pi);
            var adpX=parseFloat(adp.style.left)||px-31;
            var adpY=parseFloat(adp.style.top)||b.bottom+58;
            var piX=parseFloat(pi.style.left)||px+31;
            var piY=parseFloat(pi.style.top)||b.bottom+55;

            if(amNow)amNow.craftGuide={partner:pi,x:piX,y:piY,distance:Math.hypot(piX-adpX,piY-adpY)};
            if(pmNow)pmNow.craftGuide={partner:adp,x:adpX,y:adpY,distance:Math.hypot(piX-adpX,piY-adpY)};
          }
        }

        // Pi has now left the pump in this didactic cycle.
        delete pump.dataset.phosphateBound;

        // 4) Only after ATP products appear does the pump expose the two K+ cavities.
        labSetTimeout(function(){
          if(!pump.isConnected)return;
          delete pump.dataset.cycling;
          setPumpVisualState(pump,"outside-open","K⁺ · 0/2");
          updateCounter();
        },320);
      }
    },620);
  }

  function startPumpReturn(pump){
    if(!pump||pump.dataset.cycling==="1")return;

    var potassium=pumpMolecules(pump,"k");
    if(potassium.length<2){
      updatePumpState(pump);
      return;
    }

    pump.dataset.cycling="1";
    setPumpVisualState(pump,"k-bound","2 K⁺ ligados");
    playLabSound("return");

    labSetTimeout(function(){
      if(!pump.isConnected)return;

      // Occluded return toward IC with K+ still visibly inside the protein.
      setPumpVisualState(pump,"resetting","Retorno");

      labSetTimeout(function(){
        if(!pump.isConnected)return;

        var lanes=[-17,17];
        potassium.forEach(function(item,index){
          if(!item.el||!item.el.isConnected)return;
          releasePumpParticle(item.el,item.slot);
          animatePumpParticle(item.el,pump,"inward",lanes[index]||0);
        });

        labSetTimeout(function(){
          if(!pump.isConnected)return;
          delete pump.dataset.cycling;
          setPumpVisualState(pump,"inside-open","Na⁺ · 0/3");
          updateCounter();
        },820);
      },420);
    },420);
  }

  function beginPlacedDrag(event){
    if(event.button!==undefined&&event.button!==0)return;
    var el=event.currentTarget;
    if(el.dataset.cycling==="1")return;

    if(el.dataset.kind==="molecule"&&el.dataset.dockedPump){
      var dockedPump=layer.querySelector('[data-id="'+el.dataset.dockedPump+'"]');
      if(dockedPump&&dockedPump.dataset.cycling==="1")return;
    }

    event.preventDefault();event.stopPropagation();selectElement(el);

    if(isLigandType(el.dataset.type)&&el.dataset.ligandBound){
      var boundChannel=layer.querySelector('[data-id="'+el.dataset.ligandBound+'"]');
      if(boundChannel){
        releaseBoundLigand(boundChannel,false);
        boundChannel.dataset.ligandCooldownUntil="0";
      }else{
        delete el.dataset.ligandBound;
      }
    }

    if(el.dataset.kind==="molecule"){
      setCanvasManaged(el,false);
      releaseSlotFor(el);
    }

    var rect=stageRect(),b=barrier(),p=pointFromClient(event.clientX,event.clientY,rect);
    var left=parseFloat(el.style.left)||p.x,top=parseFloat(el.style.top)||p.y;

    moving={
      el:el,pointerId:event.pointerId,rect:rect,b:b,
      offsetX:p.x-left,offsetY:p.y-top,
      startSide:el.dataset.kind==="molecule"?sideOf(top,b):"MP",
      clientX:event.clientX,clientY:event.clientY,
      gate:null,readySlot:null,craftTarget:null,transit:null,ligandTarget:null,
      lastX:left,lastY:top
    };
    el.classList.add("is-dragging");
    try{el.setPointerCapture(event.pointerId)}catch(_){}
  }

  function queuePlacedMove(event){
    if(!moving||event.pointerId!==moving.pointerId)return;
    moving.clientX=event.clientX;moving.clientY=event.clientY;
    if(rafMove)return;
    rafMove=requestAnimationFrame(applyPlacedMove);
  }

  function limitStep(current,target,maxStep){
    var delta=target-current;
    if(Math.abs(delta)<=maxStep)return target;
    return current+Math.sign(delta)*maxStep;
  }

  function scheduleMoveAgain(){
    if(!moving||rafMove)return;
    rafMove=requestAnimationFrame(applyPlacedMove);
  }

  function applyPlacedMove(){
    rafMove=0;
    if(!moving)return;

    var m=moving;
    var p=pointFromClient(m.clientX,m.clientY,m.rect);
    var el=m.el;

    if(el.dataset.kind==="protein"){
      var proteinTargetX=clampProteinX(p.x-m.offsetX);
      var proteinCurrentX=parseFloat(el.style.left)||proteinTargetX;
      var proteinX=limitStep(proteinCurrentX,proteinTargetX,42);
      var buildTarget=nearestAvailableProteinSlot(proteinTargetX,el);

      m.proteinSlotIndex=buildTarget?buildTarget.index:null;
      if(buildTarget)highlightBuildSlot(buildTarget.index);
      else clearBuildSlotPreview();

      el.style.left=proteinX+"px";
      el.style.top=m.b.center+"px";
      if(el.dataset.type==="bomba")repositionDocked(el);
      if(isLigandGate(el.dataset.type))positionBoundLigand(el);
      if(Math.abs(proteinTargetX-proteinX)>.5)scheduleMoveAgain();
      return;
    }

    var type=el.dataset.type;
    var desiredX=Math.max(18,Math.min(m.rect.width-18,p.x-m.offsetX));
    var desiredY=Math.max(18,Math.min(m.rect.height-18,p.y-m.offsetY));
    var currentX=parseFloat(el.style.left)||m.lastX||desiredX;
    var currentY=parseFloat(el.style.top)||m.lastY||desiredY;
    var half=Math.max(10,el.offsetHeight/2);
    var topSurface=m.b.top;
    var bottomSurface=m.b.bottom;
    var entryTop=topSurface-half;
    var entryBottom=bottomSurface+half;

    if(isLigandType(type)){
      desiredY=Math.max(18,Math.min(topSurface-half-4,desiredY));

      var ligandX=limitStep(currentX,desiredX,44);
      var ligandY=limitStep(currentY,desiredY,44);
      el.style.left=ligandX+"px";
      el.style.top=ligandY+"px";
      m.lastX=ligandX;
      m.lastY=ligandY;

      clearLigandDropTargets();
      m.ligandTarget=closestLigandChannelForDrop(el,ligandX,ligandY,performance.now(),120);
      if(m.ligandTarget)m.ligandTarget.classList.add("ligand-drop-target");

      if(Math.abs(desiredX-ligandX)>.5||Math.abs(desiredY-ligandY)>.5)scheduleMoveAgain();
      return;
    }

    if(m.transit){
      var transit=m.transit;
      var gate=transit.gate;

      if(!gate||!gate.isConnected){
        m.transit=null;
        m.gate=null;
        clearGateGlow();
        el.classList.remove("is-channeling");
      }else{
        var gx=parseFloat(gate.style.left)||currentX;
        var targetY=Math.max(entryTop,Math.min(entryBottom,desiredY));
        var nextX=limitStep(currentX,gx,5);
        var nextY=limitStep(currentY,targetY,4.5);

        el.style.left=nextX+"px";
        el.style.top=nextY+"px";
        m.lastX=nextX;
        m.lastY=nextY;

        gate.classList.add("channel-pass");
        el.classList.add("is-channeling");
        el.classList.remove("is-blocked");

        var done=false;
        if(transit.from==="EC"){
          if(desiredY<=entryTop&&nextY<=entryTop+1){
            m.startSide="EC";
            done=true;
          }else if(desiredY>=entryBottom&&nextY>=entryBottom-1){
            m.startSide="IC";
            done=true;
          }
        }else{
          if(desiredY>=entryBottom&&nextY>=entryBottom-1){
            m.startSide="IC";
            done=true;
          }else if(desiredY<=entryTop&&nextY<=entryTop+1){
            m.startSide="EC";
            done=true;
          }
        }

        if(done){
          var completedFrom=transit.from;
          m.transit=null;
          m.gate=null;
          clearGateGlow();
          el.classList.remove("is-channeling");

          var postMotion=moleculeMotion.get(el);
          if(postMotion){
            var postNow=performance.now();
            var postDirection=completedFrom==="EC"?1:-1;
            postMotion.vx=(Math.random()-.5)*38;
            postMotion.vy=postDirection*(38+Math.random()*20);
            postMotion.boostUntil=postNow+1600;
            postMotion.channelCooldownUntil=postNow+1800;
            postMotion.associationCooldownUntil=postNow+1550;
            postMotion.gateGuide=null;
            postMotion.pumpGuide=null;
            postMotion.lastGateId=transit.gate&&transit.gate.dataset?transit.gate.dataset.id:null;
            postMotion.clearanceRadius=104;
          }
        }else{
          scheduleMoveAgain();
        }

        m.readySlot=findDockTarget(el,nextX,nextY);
        markReadySlot(m.readySlot);
        return;
      }
    }

    var directPumpSlot=findDockTarget(el,desiredX,desiredY);
    if(directPumpSlot){
      m.craftTarget=null;
      markCraftTarget(null);
      var dockPoint=slotStagePoint(directPumpSlot);
      var dockX=limitStep(currentX,dockPoint.x,10);
      var dockY=limitStep(currentY,dockPoint.y,10);
      el.style.left=dockX+"px";
      el.style.top=dockY+"px";
      m.lastX=dockX;
      m.lastY=dockY;
      m.readySlot=directPumpSlot;
      markReadySlot(directPumpSlot);
      el.classList.remove("is-blocked","is-channeling");
      clearGateGlow();
      if(Math.abs(dockPoint.x-dockX)>.5||Math.abs(dockPoint.y-dockY)>.5)scheduleMoveAgain();
      return;
    }

    m.readySlot=null;
    markReadySlot(null);

    var nearbyCraft=findCraftTarget(el,desiredX,desiredY);
    m.craftTarget=nearbyCraft;
    markCraftTarget(nearbyCraft);

    if(nearbyCraft){
      var craftX=parseFloat(nearbyCraft.style.left)||desiredX;
      var craftY=parseFloat(nearbyCraft.style.top)||desiredY;
      var nextCraftX=limitStep(currentX,craftX,12);
      var nextCraftY=limitStep(currentY,craftY,12);
      el.style.left=nextCraftX+"px";
      el.style.top=nextCraftY+"px";
      m.lastX=nextCraftX;
      m.lastY=nextCraftY;
      el.classList.remove("is-blocked","is-channeling");
      clearGateGlow();
      if(Math.abs(craftX-nextCraftX)>.5||Math.abs(craftY-nextCraftY)>.5)scheduleMoveAgain();
      return;
    }

    var targetX=desiredX;
    var targetY=desiredY;
    var crossingFromEC=m.startSide==="EC"&&desiredY+half>=topSurface;
    var crossingFromIC=m.startSide==="IC"&&desiredY-half<=bottomSurface;

    if(crossingFromEC||crossingFromIC){
      var gate=compatibleGate(type,desiredX);

      if(gate){
        var gateX=parseFloat(gate.style.left)||desiredX;
        var horizontalDistance=Math.abs(desiredX-gateX);

        if(horizontalDistance<=30){
          if(passiveTransportAllowed(type,m.startSide)){
            m.gate=gate;
            m.transit={gate:gate,from:m.startSide};
            gate.classList.add("channel-pass");
            el.classList.add("is-channeling");
            el.classList.remove("is-blocked");
            scheduleMoveAgain();
            return;
          }

          showGradientBlock(type,m.startSide);
        }
      }

      m.gate=null;
      clearGateGlow();
      el.classList.remove("is-channeling");
      targetY=crossingFromEC?entryTop:entryBottom;
      el.classList.add("is-blocked");

      if(Math.abs(currentY-targetY)<24)showCollision(type);
    }else{
      clearGateGlow();
      m.gate=null;
      el.classList.remove("is-channeling","is-blocked");
    }

    var nextFreeX=limitStep(currentX,targetX,36);
    var nextFreeY=limitStep(currentY,targetY,36);
    el.style.left=nextFreeX+"px";
    el.style.top=nextFreeY+"px";
    m.lastX=nextFreeX;
    m.lastY=nextFreeY;

    m.readySlot=findDockTarget(el,nextFreeX,nextFreeY);
    markReadySlot(m.readySlot);

    if(Math.abs(targetX-nextFreeX)>.5||Math.abs(targetY-nextFreeY)>.5){
      scheduleMoveAgain();
    }
  }

  function endPlacedDrag(event){
    if(!moving||event.pointerId!==moving.pointerId)return;
    if(rafMove){cancelAnimationFrame(rafMove);rafMove=0;applyPlacedMove()}

    var m=moving;

    if(m.el.dataset.kind==="protein"){
      var currentProteinX=parseFloat(m.el.style.left)||stage.clientWidth/2;
      var slotIndex=Number.isFinite(m.proteinSlotIndex)?m.proteinSlotIndex:null;
      if(slotIndex===null){
        var fallbackBuildSlot=nearestAvailableProteinSlot(currentProteinX,m.el);
        slotIndex=fallbackBuildSlot?fallbackBuildSlot.index:parseInt(m.el.dataset.membraneSlot,10);
      }

      assignProteinToSlot(m.el,slotIndex);
      m.el.classList.remove("is-dragging","is-blocked","is-channeling");
      clearBuildSlotPreview();
      try{m.el.releasePointerCapture(m.pointerId)}catch(_){}
      moving=null;
      return;
    }

    if(isLigandType(m.el.dataset.type)){
      clearLigandDropTargets();

      var lx=parseFloat(m.el.style.left)||m.lastX||0;
      var ly=parseFloat(m.el.style.top)||m.lastY||0;
      var target=m.ligandTarget||closestLigandChannelForDrop(m.el,lx,ly,performance.now(),120);

      if(target){
        target.dataset.ligandCooldownUntil="0";
        bindLigandToChannel(m.el,target);
      }else{
        delete m.el.dataset.ligandBound;
        var freeMotion=moleculeMotion.get(m.el);
        if(freeMotion){
          chooseRandomWalkVelocity(m.el,freeMotion,1);
          freeMotion.associationCooldownUntil=performance.now()+280;
        }
      }

      m.el.classList.remove("is-dragging","is-blocked","is-channeling");
      try{m.el.releasePointerCapture(m.pointerId)}catch(_){}
      moving=null;
      return;
    }

    if(m.transit){
      var half=Math.max(10,m.el.offsetHeight/2);
      var fallbackY=m.transit.from==="EC"?m.b.top-half:m.b.bottom+half;
      m.el.style.top=fallbackY+"px";
      m.startSide=m.transit.from;
      m.transit=null;
    }else if(m.readySlot&&m.el.dataset.kind==="molecule"){
      dockElement(m.el,m.readySlot);
    }else if(m.craftTarget&&m.el.dataset.kind==="molecule"){
      craftATP(m.el,m.craftTarget);
    }

    m.el.classList.remove("is-dragging","is-blocked","is-channeling");
    markReadySlot(null);
    markCraftTarget(null);
    clearGateGlow();
    try{m.el.releasePointerCapture(m.pointerId)}catch(_){}
    moving=null;
  }

  function syncSimulationControls(){
    if(simPause){
      simPause.classList.toggle("is-active",simulationPaused);
      simPause.setAttribute("aria-pressed",simulationPaused?"true":"false");
      simPause.textContent=simulationPaused?"▶":"Ⅱ";
      simPause.title=simulationPaused?"Continuar simulação":"Pausar simulação";
    }
    if(simSlow){
      var slow=!simulationPaused&&simulationTimeScale===.5;
      simSlow.classList.toggle("is-active",slow);
      simSlow.setAttribute("aria-pressed",slow?"true":"false");
    }
    if(simNormal){
      var normal=!simulationPaused&&simulationTimeScale===1;
      simNormal.classList.toggle("is-active",normal);
      simNormal.setAttribute("aria-pressed",normal?"true":"false");
    }
  }

  if(simPause)simPause.addEventListener("click",function(){
    simulationPaused=!simulationPaused;
    lastPhysicsTime=performance.now();
    syncSimulationControls();
  });

  if(simSlow)simSlow.addEventListener("click",function(){
    simulationPaused=false;
    simulationTimeScale=.5;
    syncSimulationControls();
  });

  if(simNormal)simNormal.addEventListener("click",function(){
    simulationPaused=false;
    simulationTimeScale=1;
    syncSimulationControls();
  });

  vmPresetButtons.forEach(function(button){
    button.addEventListener("click",function(){
      setMembraneVoltage(button.dataset.vm);
    });
  });

  if(chargeToggle)chargeToggle.addEventListener("click",function(){
    setChargesVisible(!chargesVisible);
  });

  if(ligandToggle)ligandToggle.addEventListener("click",function(){
    if(ligandsAdded)removeLigands();
    else addLigands();
  });

  modeButtons.forEach(function(button){
    button.addEventListener("click",function(){
      applyLabMode(button.dataset.labMode,true);
    });
  });

  if(resetModeScenario){
    resetModeScenario.addEventListener("click",function(){
      seedModeScenario(currentLabMode);
    });
  }

  document.querySelectorAll(".solute-choice").forEach(function(button){
    button.addEventListener("click",function(event){
      event.preventDefault();
      event.stopPropagation();
      selectSoluteType(button.dataset.soluteType);
    });
  });

  document.querySelectorAll(".solute-adjust").forEach(function(button){
    button.addEventListener("click",function(event){
      event.preventDefault();
      event.stopPropagation();
      adjustSelectedSolute(button.dataset.side,parseInt(button.dataset.delta,10)||0);
    });
  });

  document.querySelectorAll(".tool-item").forEach(function(tool){
    tool.addEventListener("pointerdown",beginSourceDrag,{passive:false});
    tool.addEventListener("pointermove",queueSourceMove,{passive:true});
    tool.addEventListener("pointerup",endSourceDrag,{passive:false});
    tool.addEventListener("pointercancel",endSourceDrag,{passive:false});
  });

  window.addEventListener("pointermove",queuePlacedMove,{passive:true});
  window.addEventListener("pointerup",endPlacedDrag,{passive:true});
  window.addEventListener("pointercancel",endPlacedDrag,{passive:true});

  stage.addEventListener("click",function(event){
    if(event.target.closest(".placed-element"))return;

    if(armedTool){
      var r=stageRect();
      var p=pointFromClient(event.clientX,event.clientY,r);
      var type=armedTool.dataset.type;
      var kind=armedTool.dataset.kind;
      var created=createPlaced(type,kind,p.x,p.y);

      if(created&&kind==="molecule"){
        var slot=findDockTarget(created,p.x,p.y);
        if(slot)dockElement(created,slot);
        else{
          var craft=findCraftTarget(created,p.x,p.y);
          if(craft)craftATP(created,craft);
        }
      }

      clearArmedTool();
      return;
    }

    selectElement(null);
  });

  function clearSimulationScene(){
    layer.textContent="";
    placedCount=0;
    ligandsAdded=false;
    markSceneCacheDirty();
    compartmentCountCacheAt=0;
    selectElement(null);
    clearArmedTool();

    if(ligandToggle){
      ligandToggle.textContent="Adicionar ligantes";
      ligandToggle.classList.remove("is-active");
      ligandToggle.setAttribute("aria-pressed","false");
    }

    updateCounter();
    updateSoluteControlCounts();
    updateGradientPanel(performance.now()+500);
    renderParticleCanvas(performance.now());
  }

  function seedModeScenario(modeName){
    var cfg=labModes[modeName]||labModes.simple;

    clearSimulationScene();
    setMembraneVoltage(-70);
    setChargesVisible(false);
    selectSoluteType(cfg.defaultSolute);

    updateBuildSlotVisuals();
    updateCounter();
    updateSoluteControlCounts();
    updateGradientPanel(performance.now()+500);
  }

  function applyLabMode(modeName,resetScene){
    var cfg=labModes[modeName]||labModes.simple;
    currentLabMode=labModes[modeName]?modeName:"simple";
    activeModeFeatures=modeFeatures(currentLabMode);
    document.body.dataset.membraneMode=currentLabMode;

    modeButtons.forEach(function(button){
      var active=button.dataset.labMode===currentLabMode;
      button.classList.toggle("is-active",active);
      button.setAttribute("aria-pressed",active?"true":"false");
    });

    if(modeContextKicker)modeContextKicker.textContent="MODO "+cfg.order;
    if(modeContextTitle)modeContextTitle.textContent=cfg.title;
    if(modeContextText)modeContextText.textContent=cfg.text;

    document.querySelectorAll(".solute-choice").forEach(function(button){
      button.hidden=cfg.solutes.indexOf(button.dataset.soluteType)===-1;
    });

    document.querySelectorAll(".structure-card").forEach(function(button){
      button.hidden=cfg.proteins.indexOf(button.dataset.type)===-1;
    });

    document.querySelectorAll(".structure-section").forEach(function(section){
      var cards=Array.from(section.querySelectorAll(".structure-card"));
      section.hidden=cards.length>0&&!cards.some(function(card){return !card.hidden});
    });

    var voltageControls=document.querySelector(".vm-preset-controls");
    if(voltageControls)voltageControls.hidden=!cfg.voltage;
    if(chargeToggle)chargeToggle.hidden=!cfg.voltage;
    if(ligandToggle)ligandToggle.hidden=!cfg.ligands;

    if(cfg.solutes.indexOf(selectedSoluteType)===-1)selectSoluteType(cfg.defaultSolute);
    if(resetScene!==false)seedModeScenario(currentLabMode);
  }

  clearButton.addEventListener("click",clearSimulationScene);

  function removeSelectedElement(){
    if(!selected)return;

    if(isLigandGate(selected.dataset.type)&&selected.dataset.boundLigandId){
      releaseBoundLigand(selected,false);
    }

    if(selected.dataset.type==="bomba"){
      getCachedMolecules(performance.now()).forEach(function(candidate){
        var candidateMotion=moleculeMotion.get(candidate);
        if(candidateMotion&&candidateMotion.pumpGuide&&candidateMotion.pumpGuide.pump===selected){
          clearPumpGuide(candidate,candidateMotion);
        }
      });
      delete selected.dataset.atpGuideId;

      selected.querySelectorAll(".pump-slot.occupied").forEach(function(slot){
        var molecule=layer.querySelector('[data-id="'+slot.dataset.occupiedId+'"]');
        if(molecule){
          delete molecule.dataset.dockedPump;
          delete molecule.dataset.dockedSlot;
          molecule.classList.remove("docked");
        }
        clearPumpSlot(slot);
      });
    }else if(selected.dataset.kind==="molecule"){
      if(isLigandType(selected.dataset.type)&&selected.dataset.ligandBound){
        var selectedLigandChannel=layer.querySelector('[data-id="'+selected.dataset.ligandBound+'"]');
        if(selectedLigandChannel)releaseBoundLigand(selectedLigandChannel,false);
      }
      releaseSlotFor(selected);
      var selectedMotion=moleculeMotion.get(selected);
      if(selectedMotion)releasePumpReservation(selected,selectedMotion);
    }

    selected.remove();
    markSceneCacheDirty();
    compartmentCountCacheAt=0;
    selected=null;
    removeButton.hidden=true;
    renderDefaultInfo();
    updateCounter();
  }

  removeButton.addEventListener("click",removeSelectedElement);

  document.addEventListener("keydown",function(event){
    var target=event.target;
    var typing=target&&(target.matches("input,textarea,select")||target.isContentEditable);
    if(typing)return;

    if(event.key==="Delete"||event.key==="Backspace"){
      if(selected){
        event.preventDefault();
        removeSelectedElement();
      }
      return;
    }

    if(event.key==="Escape"){
      selectElement(null);
      clearArmedTool();
    }
  });

  function nearestCompatibleChannel(el,x,y,b){
    if(!activeModeFeatures.channels)return null;
    var type=el.dataset.type;
    var allowed=gates[type]||[];
    if(!allowed.length)return null;

    var side=sideOf(y,b);
    if(side==="MP")return null;

    var now=performance.now();
    var motion=moleculeMotion.get(el);
    if(motion&&motion.channelCooldownUntil&&now<motion.channelCooldownUntil)return null;

    var half=moleculeHalfHeight(el);
    var surfaceDistance=side==="EC"
      ?Math.abs((y+half)-b.top)
      :Math.abs((y-half)-b.bottom);

    if(surfaceDistance>82)return null;

    var best=null;
    var bestDistance=Infinity;
    var proteins=getCachedProteins(now);

    for(var i=0;i<proteins.length;i++){
      var protein=proteins[i];
      if(allowed.indexOf(protein.dataset.type)===-1||!proteinIsOpen(protein))continue;
      if(protein.dataset.channelBusy==="1")continue;

      var px=parseFloat(protein.style.left)||0;
      var py=parseFloat(protein.style.top)||b.center;
      var radial=Math.hypot(px-x,(py-y)*.68);

      if(motion&&motion.lastGateId===protein.dataset.id&&motion.clearanceRadius>0){
        if(radial<motion.clearanceRadius)continue;
        motion.lastGateId=null;
        motion.clearanceRadius=0;
      }

      if(radial<92&&radial<bestDistance){
        best=protein;
        bestDistance=radial;
      }
    }

    return best;
  }

  function nearestPumpSlotForAuto(el,x,y,b){
    var type=el.dataset.type;
    if(type!=="na"&&type!=="k"&&type!=="atp")return null;

    var motion=moleculeMotion.get(el);
    var side=sideOf(y,b);
    if(type==="k"&&side!=="EC"){
      if(motion)releasePumpReservation(el,motion);
      return null;
    }
    if((type==="na"||type==="atp")&&side!=="IC"){
      if(motion)releasePumpReservation(el,motion);
      return null;
    }

    var bestPump=null;
    var bestDistance=Infinity;

    getCachedProteinsOfType("bomba",performance.now()).forEach(function(pump){
      if(pump.dataset.cycling==="1")return;
      var px=parseFloat(pump.style.left)||0;
      var py=parseFloat(pump.style.top)||b.center;
      var d=Math.hypot(px-x,(py-y)*.55);
      if(d<118&&d<bestDistance){
        bestPump=pump;
        bestDistance=d;
      }
    });

    if(!bestPump){
      if(motion)releasePumpReservation(el,motion);
      return null;
    }

    var bestSlot=null;
    var slotDistance=Infinity;
    bestPump.querySelectorAll('.pump-slot:not(.occupied)').forEach(function(slot){
      if(slot.dataset.accept!==type||!pumpSlotActive(slot,bestPump))return;

      if(slot.dataset.reservedBy&&slot.dataset.reservedBy!==el.dataset.id){
        var reserved=layer.querySelector('[data-id="'+slot.dataset.reservedBy+'"]');
        if(reserved)return;
        delete slot.dataset.reservedBy;
      }

      var p=slotStagePoint(slot);
      var d=Math.hypot(p.x-x,p.y-y);
      if(d<118&&d<slotDistance){
        bestSlot=slot;
        slotDistance=d;
      }
    });

    if(!bestSlot){
      if(motion)releasePumpReservation(el,motion);
      return null;
    }

    if(motion&&motion.pumpReservedSlot&&motion.pumpReservedSlot!==bestSlot){
      releasePumpReservation(el,motion);
    }

    bestSlot.dataset.reservedBy=el.dataset.id;
    if(motion)motion.pumpReservedSlot=bestSlot;
    return bestSlot;
  }

  function autoBindPump(el,slot){
    if(!el||!slot||el.dataset.autoBinding==="1"||el.classList.contains("docked"))return;

    var pump=slot.closest('.placed-protein[data-type="bomba"]');
    if(
      !pump||
      pump.dataset.cycling==="1"||
      slot.classList.contains("occupied")||
      slot.dataset.accept!==el.dataset.type||
      !pumpSlotActive(slot,pump)
    ){
      var rejectedMotion=moleculeMotion.get(el);
      if(rejectedMotion)releasePumpReservation(el,rejectedMotion);
      return;
    }

    if(slot.dataset.reservedBy&&slot.dataset.reservedBy!==el.dataset.id)return;
    slot.dataset.reservedBy=el.dataset.id;

    var p=slotStagePoint(slot);
    var startX=parseFloat(el.style.left)||0;
    var startY=parseFloat(el.style.top)||0;
    var distance=Math.hypot(p.x-startX,p.y-startY);
    if(distance>125){
      var farMotion=moleculeMotion.get(el);
      if(farMotion)releasePumpReservation(el,farMotion);
      return;
    }

    setCanvasManaged(el,false);
    el.dataset.autoBinding="1";
    el.classList.add("auto-associating");

    var started=performance.now();
    var duration=260+Math.min(220,distance*1.2);

    function abortBinding(){
      var motion=moleculeMotion.get(el);
      if(motion)releasePumpReservation(el,motion);
      if(slot.dataset.reservedBy===el.dataset.id)delete slot.dataset.reservedBy;
      delete el.dataset.autoBinding;
      el.classList.remove("auto-associating");
      if(el.isConnected&&!el.classList.contains("docked")&&el!==selected)setCanvasManaged(el,true);
    }

    function frame(now){
      if(!isLabForeground()){
        var pausedAt=performance.now();
        runWhenLabForeground(function(){
          started+=performance.now()-pausedAt;
          requestAnimationFrame(frame);
        });
        return;
      }

      if(!el.isConnected||!slot.isConnected||!pump.isConnected){
        abortBinding();
        return;
      }

      if(
        pump.dataset.cycling==="1"||
        slot.classList.contains("occupied")||
        slot.dataset.accept!==el.dataset.type||
        !pumpSlotActive(slot,pump)||
        (
          slot.dataset.reservedBy&&
          slot.dataset.reservedBy!==el.dataset.id&&
          !!layer.querySelector('[data-id="'+slot.dataset.reservedBy+'"]')
        )
      ){
        abortBinding();
        return;
      }

      if(slot.dataset.reservedBy!==el.dataset.id){
        slot.dataset.reservedBy=el.dataset.id;
      }

      slotPointCache.delete(slot);
      var liveP=slotStagePoint(slot);
      p.x=liveP.x;
      p.y=liveP.y;

      var t=Math.min(1,(now-started)/duration);
      var e=smooth01(t);
      el.style.left=(startX+(p.x-startX)*e)+"px";
      el.style.top=(startY+(p.y-startY)*e)+"px";

      if(t<1){
        requestAnimationFrame(frame);
      }else{
        var docked=dockElement(el,slot);
        delete el.dataset.autoBinding;
        el.classList.remove("auto-associating");

        if(!docked){
          abortBinding();
        }else if(!el.classList.contains("docked")&&el!==selected){
          setCanvasManaged(el,true);
        }
      }
    }

    requestAnimationFrame(frame);
  }

  function smooth01(t){
    t=Math.max(0,Math.min(1,t));
    return t*t*(3-2*t);
  }

  function finishChannelTransit(el,gate,fromSide){
    if(!el||!el.isConnected)return;

    el.classList.remove("channel-transit","auto-channeling","auto-associating","transporting");
    if(gate&&gate.isConnected){
      gate.classList.remove("channel-pass");
      delete gate.dataset.channelBusy;
    }
    delete el.dataset.autoTransport;

    var motion=moleculeMotion.get(el);
    if(motion){
      var now=performance.now();
      var direction=fromSide==="EC"?1:-1;

      motion.vx=(Math.random()-.5)*42;
      motion.vy=direction*(42+Math.random()*22);
      motion.targetVx=motion.vx;
      motion.targetVy=motion.vy;
      motion.directionChangeAt=now+900+Math.random()*500;
      motion.boostUntil=now+1800;
      motion.channelCooldownUntil=now+10000;
      motion.associationCooldownUntil=now+1200;
      motion.gateGuide=null;
      motion.pumpGuide=null;
      motion.lastSide=fromSide==="EC"?"IC":"EC";
      motion.lastGateId=gate&&gate.dataset?gate.dataset.id:null;
      motion.clearanceRadius=108;
    }

    if(el!==selected)setCanvasManaged(el,true);
  }

  function autoTransportChannel(el,gate,fromSide,b){
    if(!el||!gate||el.dataset.autoTransport==="1")return;
    if(!proteinIsOpen(gate))return;
    if(!checkGradientForCrossing(el.dataset.type,fromSide)){
      var rejectedMotion=moleculeMotion.get(el);
      if(rejectedMotion){
        rejectedMotion.associationCooldownUntil=performance.now()+450;
        chooseRandomWalkVelocity(el,rejectedMotion,1);
      }
      return;
    }

    if(gate.dataset.channelBusy==="1")return;
    gate.dataset.channelBusy="1";
    setCanvasManaged(el,false);
    el.dataset.autoTransport="1";
    el.classList.add("channel-transit","auto-channeling");
    gate.classList.add("channel-pass");

    var startX=parseFloat(el.style.left)||0;
    var startY=parseFloat(el.style.top)||0;
    var gx=parseFloat(gate.style.left)||startX;
    var half=Math.max(10,el.offsetHeight/2);

    var mouthY=fromSide==="EC"?b.top-half:b.bottom+half;
    var centerY=b.center;
    var exitY=fromSide==="EC"?b.bottom+half+28:b.top-half-28;

    var startTime=performance.now();
    var approachDuration=220;
    var poreDuration=460;
    var releaseDuration=240;
    var total=approachDuration+poreDuration+releaseDuration;

    function frame(now){
      if(!isLabForeground()){
        var pausedAt=performance.now();
        runWhenLabForeground(function(){
          startTime+=performance.now()-pausedAt;
          requestAnimationFrame(frame);
        });
        return;
      }

      if(!el.isConnected||!gate.isConnected){
        finishChannelTransit(el,gate,fromSide);
        return;
      }

      var elapsed=now-startTime;
      var x=startX;
      var y=startY;

      if(elapsed<=approachDuration){
        var p1=smooth01(elapsed/approachDuration);
        x=startX+(gx-startX)*p1;
        y=startY+(mouthY-startY)*p1;
      }else if(elapsed<=approachDuration+poreDuration){
        var p2=smooth01((elapsed-approachDuration)/poreDuration);
        x=gx;
        y=mouthY+(centerY-mouthY)*Math.min(p2*2,1);
        if(p2>.5){
          var q=smooth01((p2-.5)*2);
          y=centerY+(exitY-centerY)*q;
        }
      }else{
        var p3=smooth01((elapsed-approachDuration-poreDuration)/releaseDuration);
        var releaseX=gx+(Math.sin(p3*Math.PI)*(Math.random()-.5)*2);
        x=releaseX;
        y=exitY+(fromSide==="EC"?1:-1)*(20*p3);
      }

      el.style.left=x+"px";
      el.style.top=y+"px";

      if(elapsed<total){
        requestAnimationFrame(frame);
      }else{
        finishChannelTransit(el,gate,fromSide);
      }
    }

    requestAnimationFrame(frame);
  }

  function applyElectrostaticInteractions(molecules){
    var b=barrier();
    var cellSize=46;
    var grid=new Map();

    for(var i=0;i<molecules.length;i++){
      var el=molecules[i];
      var motion=moleculeMotion.get(el);
      if(!motion||!motion.charge||el.classList.contains("docked")||el.dataset.autoTransport||el.dataset.autoBinding||motion.pumpGuide)continue;

      var x=parseFloat(el.style.left)||0;
      var y=parseFloat(el.style.top)||0;
      var compartment=sideOf(y,b);
      if(compartment==="MP")continue;

      var key=compartment+":"+Math.floor(x/cellSize)+":"+Math.floor(y/cellSize);
      var bucket=grid.get(key);
      if(!bucket){bucket=[];grid.set(key,bucket)}
      bucket.push(el);
    }

    for(var aIndex=0;aIndex<molecules.length;aIndex++){
      var a=molecules[aIndex];
      var am=moleculeMotion.get(a);
      if(!am||!am.charge||a.classList.contains("docked")||a.dataset.autoTransport||a.dataset.autoBinding||am.pumpGuide)continue;

      var ax=parseFloat(a.style.left)||0;
      var ay=parseFloat(a.style.top)||0;
      var aside=sideOf(ay,b);
      if(aside==="MP")continue;

      var gx=Math.floor(ax/cellSize);
      var gy=Math.floor(ay/cellSize);

      for(var ox=-1;ox<=1;ox++){
        for(var oy=-1;oy<=1;oy++){
          var nearby=grid.get(aside+":"+(gx+ox)+":"+(gy+oy));
          if(!nearby)continue;

          for(var zIndex=0;zIndex<nearby.length;zIndex++){
            var z=nearby[zIndex];
            var zm=moleculeMotion.get(z);
            if(!zm||am.order>=zm.order)continue;

            var zx=parseFloat(z.style.left)||0;
            var zy=parseFloat(z.style.top)||0;
            var dx=ax-zx;
            var dy=ay-zy;
            var d2=dx*dx+dy*dy;
            if(d2<=1||d2>1936)continue;

            var d=Math.sqrt(d2);
            var nx=dx/d;
            var ny=dy/d;

            if(d<17){
              var steric=(17-d)/17;
              var push=24*steric;
              am.vx+=nx*push;
              am.vy+=ny*push;
              zm.vx-=nx*push;
              zm.vy-=ny*push;
              continue;
            }

            var falloff=(44-d)/27;
            if(falloff<=0)continue;
            var impulse=(am.charge*zm.charge>0?6:-4)*falloff;

            am.vx+=nx*impulse;
            am.vy+=ny*impulse;
            zm.vx-=nx*impulse;
            zm.vy-=ny*impulse;
          }
        }
      }
    }
  }

  function smootherStep01(t){
    t=Math.max(0,Math.min(1,t));
    return t*t*t*(t*(t*6-15)+10);
  }

  function startGasMembraneTransit(el,motion,fromSide,b,x,y,halfH,now){
    if(!el||!motion||!isGasType(el.dataset.type))return false;
    if(motion.gasTransit)return true;
    if(motion.gasCooldownUntil&&now<motion.gasCooldownUntil)return false;
    if(!checkGradientForCrossing(el.dataset.type,fromSide))return false;

    var direction=fromSide==="EC"?1:-1;
    var entryY=fromSide==="EC"?b.top-halfH:b.bottom+halfH;
    var exitY=fromSide==="EC"?b.bottom+halfH+5:b.top-halfH-5;
    var duration=el.dataset.type==="o2"?.48:.56;

    motion.gasTransit={
      from:fromSide,
      direction:direction,
      startX:x,
      endX:x+(Math.random()-.5)*10,
      startY:Math.abs(y-entryY)<12?y:entryY,
      endY:exitY,
      progress:0,
      duration:duration+Math.random()*.10,
      phase:Math.random()*Math.PI*2
    };

    motion.vx*=.44;
    motion.vy=direction*Math.max(24,Math.abs(motion.vy)*.7);
    motion.directionChangeAt=Infinity;
    return true;
  }

  function advanceGasMembraneTransit(el,motion,dt,now,width){
    var transit=motion&&motion.gasTransit;
    if(!transit)return false;

    transit.progress=Math.min(1,transit.progress+dt/Math.max(.32,transit.duration));
    var eased=smootherStep01(transit.progress);
    var lateral=Math.sin(transit.progress*Math.PI*2+transit.phase)*2.2*Math.sin(transit.progress*Math.PI);
    var x=transit.startX+(transit.endX-transit.startX)*eased+lateral;
    var y=transit.startY+(transit.endY-transit.startY)*eased;

    if(x<-motion.halfW)x=width+motion.halfW-1;
    else if(x>width+motion.halfW)x=-motion.halfW+1;

    el.style.left=x+"px";
    el.style.top=y+"px";

    if(transit.progress>=1){
      var direction=transit.direction;
      motion.gasTransit=null;
      motion.gasCooldownUntil=now+760;
      motion.vx=(Math.random()-.5)*30;
      motion.vy=direction*(34+Math.random()*18);
      motion.targetVx=motion.vx;
      motion.targetVy=motion.vy;
      motion.boostUntil=now+420;
      motion.directionChangeAt=now+540+Math.random()*420;
      compartmentCountCacheAt=0;
    }

    return true;
  }

  function molecularPhysicsStep(dt,now){
    if(!simulationActive||simulationPaused)return;

    var molecules=getCachedMolecules(now);
    if(!molecules.length)return;

    refreshCompartmentCounts(now,false);
    updateGradientPanel(now);

    var features=activeModeFeatures;
    var b=barrier();
    var width=stage.clientWidth;
    var height=stage.clientHeight;
    var activeCount=molecules.length;

    // Expensive association logic runs only for modes that actually need it.
    var needsAssociation=features.channels||features.ligands||features.pump||features.sglt||features.craft;
    var associationInterval=activeCount>220?180:activeCount>130?135:92;
    var associationTick=needsAssociation&&now-lastAssociationTime>associationInterval;

    if(associationTick&&features.ligands)updateLigandChannels(now);
    if(associationTick&&features.sglt)updateSgltTransporters(now,b);
    if(associationTick&&features.pump)refreshPumpRecruitment(now,b);

    for(var mi=0;mi<molecules.length;mi++){
      var el=molecules[mi];
      if(!el.isConnected||el.classList.contains("docked")||el.classList.contains("craft-consumed"))continue;
      if(!modeAllowsSolute(el.dataset.type))continue;
      if(el.dataset.autoTransport==="1"||el.dataset.autoBinding==="1"||el.dataset.pumpTransport==="1"||el.dataset.sgltTransport==="1"||el.classList.contains("transporting"))continue;

      if(el.dataset.ligandBound){
        if(features.ligands){
          var ligandChannel=layer.querySelector('[data-id="'+el.dataset.ligandBound+'"]');
          if(ligandChannel)positionBoundLigand(ligandChannel);
        }
        continue;
      }

      if(moving&&moving.el===el)continue;

      var motion=moleculeMotion.get(el);
      if(!motion){
        initMoleculeMotion(el);
        motion=moleculeMotion.get(el);
      }
      if(!motion)continue;

      var x=parseFloat(el.style.left)||width/2;
      var y=parseFloat(el.style.top)||height/2;
      var halfW=motion.halfW||moleculeHalfWidth(el);
      var halfH=motion.halfH||moleculeHalfHeight(el);
      var side=sideOf(y,b);
      var type=el.dataset.type;

      if(associationTick){
        if(features.ligands&&isLigandType(type)){
          if(tryLigandBinding(el,x,y,b,now))continue;
        }else{
          if(features.craft&&(type==="adp"||type==="pi")){
            motion.craftGuide=craftGuidanceTarget(el,x,y,b,now);
            if(motion.craftGuide&&motion.craftGuide.distance<42&&craftATP(el,motion.craftGuide.partner))continue;
          }

          if(features.pump&&(type==="na"||type==="k"||type==="atp")){
            var pumpSlot=null;

            if(
              motion.pumpGuide&&
              motion.pumpGuide.kind==="slot"&&
              motion.pumpGuide.slot&&
              motion.pumpGuide.slot.isConnected&&
              !motion.pumpGuide.slot.classList.contains("occupied")&&
              motion.pumpGuide.slot.dataset.reservedBy===el.dataset.id
            ){
              var guidedPoint=slotStagePoint(motion.pumpGuide.slot);
              var guidedPump=motion.pumpGuide.pump;
              var approachPoint=pumpApproachPoint(motion.pumpGuide.slot,guidedPump,b);

              motion.pumpGuide.finalX=guidedPoint.x;
              motion.pumpGuide.finalY=guidedPoint.y;
              motion.pumpGuide.approachX=approachPoint.x;
              motion.pumpGuide.approachY=approachPoint.y;
              motion.pumpGuide.x=approachPoint.x;
              motion.pumpGuide.y=approachPoint.y;

              // Each molecule reaches a different staging point first. Only then
              // does it enter its own cavity through the short docking animation.
              var approachDistance=Math.hypot(approachPoint.x-x,approachPoint.y-y);
              var directDistance=Math.hypot(guidedPoint.x-x,guidedPoint.y-y);
              if(approachDistance<20||directDistance<38){
                pumpSlot=motion.pumpGuide.slot;
              }
            }

            if(pumpSlot){
              autoBindPump(el,pumpSlot);
              if(el.dataset.autoBinding==="1")continue;
            }
          }

          if(features.channels&&(type==="na"||type==="k")){
            var gate=nearestCompatibleChannel(el,x,y,b);
            if(gate){
              autoTransportChannel(el,gate,side,b);
              if(el.dataset.autoTransport==="1")continue;
            }
          }
        }
      }

      var boosted=motion.boostUntil&&now<motion.boostUntil;
      if(!boosted&&now>=motion.directionChangeAt)chooseRandomWalkVelocity(el,motion,1);

      applyGuidanceForce(el,motion,dt,x,y,b,now);

      var nx=x+motion.vx*dt;
      var ny=y+motion.vy*dt;

      if(nx<-halfW)nx=width+halfW-1;
      else if(nx>width+halfW)nx=-halfW+1;

      if(ny<halfH){
        ny=halfH;
        motion.vy=Math.abs(motion.vy);
      }else if(ny>height-halfH){
        ny=height-halfH;
        motion.vy=-Math.abs(motion.vy);
      }

      if(features.ligands&&isLigandType(type)&&ny+halfH>b.top-3){
        ny=b.top-halfH-3;
        motion.vy=-Math.abs(motion.vy||28);
        motion.directionChangeAt=now+sampleRandomWalkDurationMs()/Math.max(.35,simulationTimeScale);
      }

      if(features.gas&&isGasType(type)){
        // Gas molecules cross the bilayer continuously instead of teleporting.
        if(motion.gasTransit){
          advanceGasMembraneTransit(el,motion,dt,now,width);
          continue;
        }

        var wantsGasTransit=false;
        if(side==="EC"&&ny+halfH>b.top){
          wantsGasTransit=startGasMembraneTransit(el,motion,"EC",b,x,y,halfH,now);
        }else if(side==="IC"&&ny-halfH<b.bottom){
          wantsGasTransit=startGasMembraneTransit(el,motion,"IC",b,x,y,halfH,now);
        }

        if(wantsGasTransit){
          advanceGasMembraneTransit(el,motion,dt,now,width);
          continue;
        }
      }

      if(side==="EC"&&ny+halfH>b.top){
        ny=b.top-halfH;
        motion.vy=-Math.abs(motion.vy||24);
        motion.directionChangeAt=now+sampleRandomWalkDurationMs()/Math.max(.35,simulationTimeScale);
      }else if(side==="IC"&&ny-halfH<b.bottom){
        ny=b.bottom+halfH;
        motion.vy=Math.abs(motion.vy||24);
        motion.directionChangeAt=now+sampleRandomWalkDurationMs()/Math.max(.35,simulationTimeScale);
      }else if(side==="MP"){
        if(features.gas&&isGasType(type)&&motion.gasTransit){
          advanceGasMembraneTransit(el,motion,dt,now,width);
          continue;
        }

        if(y<=b.center){
          ny=b.top-halfH;
          motion.vy=-Math.abs(motion.vy||24);
        }else{
          ny=b.bottom+halfH;
          motion.vy=Math.abs(motion.vy||24);
        }
      }

      el.style.left=nx+"px";
      el.style.top=ny+"px";
    }

    if(associationTick)lastAssociationTime=now;
  }

  function molecularPhysicsLoop(now){
    if(!simulationActive||!isLabForeground()){
      physicsRaf=0;
      return;
    }
    physicsRaf=requestAnimationFrame(molecularPhysicsLoop);

    if(!lastPhysicsTime){
      lastPhysicsTime=now;
      renderParticleCanvas(now);
      return;
    }

    ensureSceneCache(now);
    var visibleCount=cachedMolecules.length;
    var targetFrameMs=visibleCount<=120?16.5:visibleCount<=220?20:visibleCount<=360?24:30;
    var elapsed=now-lastPhysicsTime;
    if(elapsed<targetFrameMs)return;

    lastPhysicsTime=now;

    if(!simulationPaused){
      molecularPhysicsStep(Math.min(elapsed,42)/1000*simulationTimeScale,now);
    }

    renderParticleCanvas(now);
  }

  function suspendLabRuntime(){
    labForeground=false;
    simulationActive=false;
    lastPhysicsTime=0;

    if(physicsRaf){
      cancelAnimationFrame(physicsRaf);
      physicsRaf=0;
    }

    if(labAudioContext&&labAudioContext.state==="running"){
      labAudioContext.suspend().catch(function(){});
    }
  }

  function resumeLabRuntime(){
    labWindowFocused=document.hasFocus();
    if(document.hidden||!labWindowFocused)return;

    labForeground=true;
    simulationActive=true;
    lastPhysicsTime=0;
    lastAssociationTime=0;

    var queued=labForegroundQueue.splice(0,labForegroundQueue.length);
    queued.forEach(function(callback){
      try{callback()}catch(_){}
    });

    if(labAudioContext&&labAudioContext.state==="suspended"){
      labAudioContext.resume().catch(function(){});
    }

    if(!physicsRaf){
      physicsRaf=requestAnimationFrame(molecularPhysicsLoop);
    }
  }

  function syncLabForegroundState(){
    labWindowFocused=document.hasFocus();
    if(document.hidden||!labWindowFocused)suspendLabRuntime();
    else resumeLabRuntime();
  }

  document.addEventListener("visibilitychange",syncLabForegroundState);
  window.addEventListener("blur",function(){
    labWindowFocused=false;
    suspendLabRuntime();
  });
  window.addEventListener("focus",function(){
    labWindowFocused=true;
    syncLabForegroundState();
  });

  window.addEventListener("pagehide",suspendLabRuntime);
  window.addEventListener("pageshow",syncLabForegroundState);

  window.addEventListener("resize",function(){
    resizeParticleCanvas();
    realignProteinsToBuildSlots();
    slotPointCache=new WeakMap();
    geometryDirty=true;
    barrierCache=null;
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(function(){
      buildBilayer();
      var b=barrier();
      layer.querySelectorAll('.placed-element[data-kind="protein"]').forEach(function(el){
        el.style.top=b.center+"px";
        el.style.left=clampProteinX(parseFloat(el.style.left)||stage.clientWidth/2)+"px";
        if(el.dataset.type==="bomba")repositionDocked(el);
      });
    },160);
  });

  async function loadUser(){
    try{
      var response=await fetch("/api/auth/me",{credentials:"same-origin"});
      if(response.status===401){location.href="/login.html";return}
      if(!response.ok)return;
      var data=await response.json(),user=data.usuario||{},name=user.nome||"Usuário",initial=name.charAt(0).toUpperCase();
      var nameSidebar=document.getElementById("nomeSidebar");
      var emailSidebar=document.getElementById("emailSidebar");
      var nameHeader=document.getElementById("nomeHeader");
      var avatarSidebar=document.getElementById("avatarSidebar");
      var avatarHeader=document.getElementById("avatarHeader");
      if(nameSidebar)nameSidebar.textContent=name;
      if(emailSidebar)emailSidebar.textContent=user.email||"";
      if(nameHeader)nameHeader.textContent=name;
      if(avatarSidebar)avatarSidebar.textContent=initial;
      if(avatarHeader)avatarHeader.textContent=initial;
    }catch(_){}
  }

  var logout=document.getElementById("logoutSidebar");
  if(logout){
    logout.addEventListener("click",async function(){
      try{await fetch("/api/auth/logout",{method:"POST",credentials:"same-origin"})}
      finally{location.href="/login.html"}
    });
  }

  buildBilayer();
  resizeParticleCanvas();
  updateBuildSlotVisuals();
  setChargesVisible(false);
  setMembraneVoltage(-70);
  selectSoluteType("o2");
  syncSimulationControls();
  renderDefaultInfo();
  updateCounter();
  updateSoluteControlCounts();
  updateGradientPanel(performance.now()+500);
  applyLabMode("simple",true);
  loadUser();
  syncLabForegroundState();
})();