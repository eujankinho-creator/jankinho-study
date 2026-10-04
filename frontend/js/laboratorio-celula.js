(function(){
  "use strict";

  var stage=document.getElementById("membraneStage");
  var bilayer=document.getElementById("bilayer");
  var layer=document.getElementById("placedLayer");
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
  var soluteTypes=["na","k","cl","h2o","atp","pi"];
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
  var simulationActive=true;
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

  var catalogue={
    "canal-na":{name:"Canal de sódio (Na⁺)",category:"PROTEÍNA TRANSMEMBRANA",text:"Canal seletivo para Na⁺. O sódio atravessa a bicamada somente quando passa pelo poro deste canal.",label:"Canal Na⁺",kind:"protein",art:"channel"},
    "canal-k":{name:"Canal de potássio (K⁺)",category:"PROTEÍNA TRANSMEMBRANA",text:"Canal seletivo para K⁺. O potássio atravessa a bicamada somente pelo poro compatível ou pela bomba.",label:"Canal K⁺",kind:"protein",art:"channel"},
    "vazante":{name:"Canal vazante de K⁺",category:"PROTEÍNA TRANSMEMBRANA",text:"Canal passivo para K⁺. Nesta simulação funciona como via seletiva para potássio.",label:"Canal vazante",kind:"protein",art:"channel"},
    "bomba":{name:"Bomba Na⁺/K⁺-ATPase",category:"TRANSPORTE ATIVO",text:"Só inicia o ciclo com 3 Na⁺ no lado intracelular, 2 K⁺ no lado extracelular e 1 ATP no sítio energético.",label:"Bomba Na⁺/K⁺",kind:"protein",art:"pump"},
    "aquaporina":{name:"Aquaporina",category:"PROTEÍNA TRANSMEMBRANA",text:"Canal seletivo para água. H₂O cruza a membrana pelo poro da aquaporina.",label:"Aquaporina",kind:"protein",art:"channel"},
    "na":{name:"Sódio (Na⁺)",category:"ÍON",text:"Na⁺ não atravessa diretamente os fosfolipídios. Use um Canal Na⁺ ou a bomba Na⁺/K⁺.",label:"Na⁺",kind:"molecule"},
    "k":{name:"Potássio (K⁺)",category:"ÍON",text:"K⁺ não atravessa diretamente os fosfolipídios. Use Canal K⁺, canal vazante ou a bomba.",label:"K⁺",kind:"molecule"},
    "cl":{name:"Cloreto (Cl⁻)",category:"ÍON",text:"Sem canal de Cl⁻ nesta versão, o íon colide com a bicamada e não a atravessa.",label:"Cl⁻",kind:"molecule"},
    "h2o":{name:"Água (H₂O)",category:"MOLÉCULA",text:"Nesta simulação a travessia rápida da água ocorre por aquaporina.",label:"H₂O",kind:"molecule"},
    "atp":{name:"ATP",category:"ENERGIA",text:"ATP não atravessa a bicamada. Pode ser usado pela bomba ou sintetizado nesta simulação aproximando Pi de uma molécula de ADP.",label:"ATP",kind:"molecule"},
    "adp":{name:"ADP",category:"NUCLEOTÍDEO",text:"ADP é formado após o consumo de ATP. Aproxime um fosfato inorgânico (Pi) para sintetizar ATP.",label:"ADP",kind:"molecule"},
    "pi":{name:"Fosfato inorgânico (Pi)",category:"GRUPO FOSFATO",text:"Pi pode se ligar ao ADP no modo de craft molecular para formar ATP.",label:"Pi",kind:"molecule"}
  };

  var gates={na:["canal-na"],k:["canal-k","vazante"],h2o:["aquaporina"]};

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
      craftGuide:null,
      targetVx:Math.cos(angle)*speed,
      targetVy:Math.sin(angle)*speed,
      directionChangeAt:performance.now()+240+Math.random()*620
    });
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
    if(type==="na")return 1.00;
    if(type==="k")return 1.34;
    if(type==="cl")return 1.42;
    if(type==="h2o")return 1.55;
    if(type==="pi")return 1.12;
    if(type==="adp")return .66;
    if(type==="atp")return .56;
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

  function passiveDriveForSide(type,fromSide){
    if(type==="h2o"){
      var osmosis=osmoticDriveECtoIC();
      return fromSide==="EC"?osmosis:-osmosis;
    }

    var charge=ionCharge(type);
    if(!charge)return -Infinity;

    var inward=electrochemicalDriveECtoIC(type);
    return fromSide==="EC"?inward:-inward;
  }

  function passiveTransportAllowed(type,fromSide){
    var drive=passiveDriveForSide(type,fromSide);
    if(type==="h2o")return drive>.12;
    return drive>.30;
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
      if(d<142&&d<bestD){
        best={partner:candidate,x:cx,y:cy,distance:d};
        bestD=d;
      }
    });

    return best;
  }

  function applyGuidanceForce(el,motion,dt,x,y,b,now){
    if(!motion||!associationAllowed(el,motion,now))return;

    if(motion.pumpGuide&&motion.pumpGuide.slot&&motion.pumpGuide.slot.isConnected&&!motion.pumpGuide.slot.classList.contains("occupied")){
      var pg=motion.pumpGuide;
      var pd=Math.hypot(pg.x-x,pg.y-y);

      if(pd<238){
        var pFalloff=Math.max(0,1-pd/238);
        var pForce=.42+1.28*Math.pow(pFalloff,.72);
        motion.vx+=(pg.x-x)*pForce*dt;
        motion.vy+=(pg.y-y)*pForce*dt;
      }else{
        releasePumpReservation(el,motion);
        motion.pumpGuide=null;
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
      var cd=Math.hypot(cg.x-x,cg.y-y);
      if(cd<150){
        var cFalloff=Math.max(0,1-cd/150);
        var cForce=.30*Math.pow(cFalloff,.8);
        motion.vx+=(cg.x-x)*cForce*dt;
        motion.vy+=(cg.y-y)*cForce*dt;
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
      if(allowed.indexOf(proteins[i].dataset.type)!==-1)return true;
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

    if(gradientVm)gradientVm.textContent="Vm ≈ "+membraneVoltageMv+" mV";

    updateSoluteControlCounts();

    ["na","k","cl"].forEach(function(type){
      var ui=gradientUi[type];
      if(!ui||!ui.direction)return;

      var counts=ionCompartmentCounts(type);
      var drive=electrochemicalDriveECtoIC(type);
      var gateOpen=hasCompatibleGate(type);
      var ex=Math.round(nernstPotentialMv(type));

      ui.direction.textContent=gradientDirectionText(type);
      ui.counts.textContent="EC "+counts.EC+" · IC "+counts.IC+" · E≈"+(ex>0?"+":"")+ex+" mV";
      ui.gate.textContent=gateOpen?"via disponível":"sem via";
      ui.gate.classList.toggle("is-open",gateOpen);
      ui.gate.classList.toggle("is-closed",!gateOpen);
      ui.direction.dataset.drive=drive>0?".in":drive<0?".out":".eq";
    });
  }

  function applyMembraneElectricField(el,motion,dt,b){
    var charge=ionCharge(el.dataset.type);
    if(!charge)return;

    var y=parseFloat(el.style.top)||0;
    var distance=Math.abs(y-b.center);
    var range=Math.max(120,b.height*1.55);
    var proximity=Math.max(.18,1-Math.min(distance/range,1));
    var acceleration=34*proximity*charge;

    motion.vy+=acceleration*dt;
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
    var amount=Math.max(24,Math.min(44,Math.round(stage.clientWidth/31)));
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

  function proteinArt(type){
    if(type==="bomba"){
      return '<span class="protein-label">Bomba Na⁺/K⁺</span>'+
        '<span class="protein-art pump-art">'+
          '<span class="pump-lobe pump-lobe-left"></span>'+
          '<span class="pump-lobe pump-lobe-right"></span>'+
          '<span class="pump-chamber"></span>'+
          '<span class="pump-pocket-caption pocket-caption-k">2 K⁺</span>'+
          '<i class="pump-slot slot-k1" data-accept="k" data-slot="k1" aria-label="Sítio vazio para K+"></i>'+
          '<i class="pump-slot slot-k2" data-accept="k" data-slot="k2" aria-label="Sítio vazio para K+"></i>'+
          '<span class="pump-pocket-caption pocket-caption-na">3 Na⁺</span>'+
          '<i class="pump-slot slot-na1" data-accept="na" data-slot="na1" aria-label="Sítio vazio para Na+"></i>'+
          '<i class="pump-slot slot-na2" data-accept="na" data-slot="na2" aria-label="Sítio vazio para Na+"></i>'+
          '<i class="pump-slot slot-na3" data-accept="na" data-slot="na3" aria-label="Sítio vazio para Na+"></i>'+
          '<span class="pump-atp-cavity"></span>'+
          '<i class="pump-slot slot-atp" data-accept="atp" data-slot="atp" aria-label="Sítio vazio para ATP"></i>'+
          '<b class="pump-ratio">3:2</b>'+
        '</span>'+
        '<span class="pump-state-badge">0/6</span>';
    }
    return '<span class="protein-label">'+catalogue[type].label+'</span><span class="protein-art protein-channel"><i class="protein-pore"></i></span>';
  }

  function updateCounter(){
    var count=layer.querySelectorAll(".placed-element").length;
    counter.textContent=count+(count===1?" elemento":" elementos");
    dropHint.classList.toggle("is-hidden",count>0);
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
    if(selected&&selected!==el)selected.classList.remove("is-selected");
    selected=el;
    if(el){el.classList.add("is-selected");removeButton.hidden=false;renderInfo(el.dataset.type)}
    else{removeButton.hidden=true;renderDefaultInfo()}
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

  function createPlaced(type,kind,x,y,options){
    options=options||{};
    var item=catalogue[type];
    if(!item)return null;
    var b=barrier();

    if(kind==="protein"){
      x=clampProteinX(x);
      y=b.center;
    }

    var el=document.createElement("div");
    el.className="placed-element "+(kind==="protein"?"placed-protein":"placed-molecule");
    el.dataset.type=type;
    el.dataset.kind=kind;
    el.dataset.id="mem-"+(++placedCount);
    el.innerHTML=kind==="protein"?proteinArt(type):item.label;
    el.style.left=x+"px";
    el.style.top=y+"px";
    layer.appendChild(el);
    markSceneCacheDirty();

    if(kind==="molecule"){
      var half=Math.max(10,el.offsetHeight/2);
      if(y+half>b.top&&y<b.center)el.style.top=(b.top-half)+"px";
      else if(y-half<b.bottom&&y>=b.center)el.style.top=(b.bottom+half)+"px";
    }else{
      el.style.top=b.center+"px";
    }

    el.addEventListener("pointerdown",beginPlacedDrag,{passive:false});
    el.addEventListener("click",function(e){e.stopPropagation();selectElement(el)});
    el.addEventListener("mouseenter",function(){renderInfo(type)});
    el.addEventListener("mouseleave",function(){if(selected)renderInfo(selected.dataset.type);else renderDefaultInfo()});

    if(kind==="molecule")initMoleculeMotion(el);
    if(kind==="protein"&&type==="bomba")initializePumpState(el);
    if(options.select!==false)selectElement(el);
    updateCounter();
    return el;
  }

  function ghostMarkup(type,kind){
    if(kind==="molecule"){
      return '<span class="ghost-molecule" data-type="'+type+'">'+catalogue[type].label+'</span>';
    }
    if(type==="bomba"){
      return '<span class="ghost-protein"><span class="protein-art pump-art"><span class="pump-lobe pump-lobe-left"></span><span class="pump-lobe pump-lobe-right"></span><span class="pump-chamber"></span><span class="pump-atp-cavity"></span><b class="pump-ratio">3:2</b></span></span>';
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

  function countFreeMolecules(){
    return layer.querySelectorAll(".placed-molecule").length;
  }

  function spawnBatch(type,side,amount){
    amount=Math.max(1,Math.min(25,parseInt(amount,10)||1));
    var current=countFreeMolecules();
    var limit=240;
    var allowed=Math.max(0,Math.min(amount,limit-current));

    if(allowed<=0){
      collisionToast.textContent="Limite de partículas atingido para manter a simulação fluida.";
      collisionToast.classList.add("is-visible");
      clearTimeout(collisionTimer);
      collisionTimer=setTimeout(function(){collisionToast.classList.remove("is-visible")},1500);
      return;
    }

    for(var i=0;i<allowed;i++){
      var p=safeSpawnPoint(side,i,allowed);
      var el=createPlaced(type,"molecule",p.x,p.y,{select:false});
      if(el){
        var motion=moleculeMotion.get(el);
        if(motion){
          var angle=Math.random()*Math.PI*2;
          var speed=(34+Math.random()*28)*Math.sqrt(motion.diffusion||1);
          motion.vx=Math.cos(angle)*speed;
          motion.vy=Math.sin(angle)*speed;
          motion.targetVx=motion.vx;
          motion.targetVy=motion.vy;
          motion.directionChangeAt=performance.now()+180+Math.random()*720;
        }
      }
    }

    clearArmedTool();
    updateCounter();
    updateSoluteControlCounts();
    updateGradientPanel(performance.now()+500);
  }

  function updateSoluteControlCounts(){
    refreshCompartmentCounts(performance.now(),false);

    soluteTypes.forEach(function(type){
      var counts=compartmentCountCache[type]||{EC:0,IC:0};
      ["EC","IC"].forEach(function(sideName){
        var node=document.getElementById("count-"+type+"-"+sideName);
        if(node)node.textContent=counts[sideName]||0;
      });
    });
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
      if(allowed.indexOf(protein.dataset.type)===-1)return;
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
      if(slot){slot.classList.remove("occupied","slot-ready");delete slot.dataset.occupiedId}
      updatePumpState(pump);
    }
    delete el.dataset.dockedPump;delete el.dataset.dockedSlot;el.classList.remove("docked");
  }

  function initializePumpState(pump){
    if(!pump)return;
    pump.dataset.pumpState="inside-open";
    delete pump.dataset.phosphateBound;
    setPumpVisualState(pump,"inside-open");
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
    return false;
  }

  function setPumpVisualState(pump,state,label){
    if(!pump)return;
    pump.dataset.pumpState=state;

    pump.classList.remove(
      "pump-open-in","pump-open-out","pump-occluded",
      "pump-phosphorylating","pump-k-bound","pump-phosphate-bound"
    );

    if(state==="inside-open"||state==="inside-na-bound")pump.classList.add("pump-open-in");
    else if(state==="outside-open")pump.classList.add("pump-open-out");
    else pump.classList.add("pump-occluded");

    if(pump.dataset.phosphateBound==="1")pump.classList.add("pump-phosphate-bound");

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
      state==="inside-open"?"3 Na⁺":
      state==="inside-na-bound"?"ATP":
      state==="outside-open"?"2 K⁺":"ATIVA"
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

    el.dataset.pumpTransport="1";
    el.classList.add("pump-transit","crossing-flash");

    function frame(now){
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

        if(onDone)onDone();
      }
    }

    requestAnimationFrame(frame);
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
      if(d<44&&d<bestDistance){
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

    setTimeout(function(){
      if(a.isConnected)a.remove();
      if(b.isConnected)b.remove();
      markSceneCacheDirty();
      compartmentCountCacheAt=0;

      var atp=createPlaced("atp","molecule",x,y,{select:false});
      if(atp){
        atp.classList.add("craft-created");
        setTimeout(function(){if(atp.isConnected)atp.classList.remove("craft-created")},700);
        selectElement(atp);
      }
      updateCounter();
    },180);

    collisionToast.textContent="Craft molecular: ADP + Pi → ATP";
    collisionToast.classList.add("is-visible");
    clearTimeout(collisionTimer);
    collisionTimer=setTimeout(function(){collisionToast.classList.remove("is-visible")},1200);

    return true;
  }

  function dockElement(el,slot){
    if(!slot)return;
    releaseSlotFor(el);
    var pump=slot.closest('.placed-protein[data-type="bomba"]');
    if(!pump)return;
    var p=slotStagePoint(slot);
    el.style.left=p.x+"px";el.style.top=p.y+"px";
    el.dataset.dockedPump=pump.dataset.id;el.dataset.dockedSlot=slot.dataset.slot;
    el.classList.add("docked");
    slot.classList.remove("slot-ready");slot.classList.add("occupied");slot.dataset.occupiedId=el.dataset.id;
    updatePumpState(pump);selectElement(pump);
  }

  function repositionDocked(pump){
    pump.querySelectorAll(".pump-slot.occupied").forEach(function(slot){
      var el=layer.querySelector('[data-id="'+slot.dataset.occupiedId+'"]');
      if(!el)return;
      var p=slotStagePoint(slot);
      el.style.left=p.x+"px";el.style.top=p.y+"px";
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
    pump.dataset.pumpState="phosphorylating";
    pump.classList.add("pump-cycling","pump-phosphorylating","pump-occluded");

    var badge=pump.querySelector(".pump-state-badge");
    if(badge)badge.textContent="ATP → ADP";

    var atpItem=atpItems[0];

    setTimeout(function(){
      if(!pump.isConnected)return;

      if(atpItem.el&&atpItem.el.isConnected){
        releasePumpParticle(atpItem.el,atpItem.slot);
        var px=parseFloat(pump.style.left)||stage.clientWidth/2;
        var b=barrier();
        atpItem.el.remove();
        markSceneCacheDirty();
        compartmentCountCacheAt=0;

        var adp=createPlaced("adp","molecule",Math.min(stage.clientWidth-42,px+74),b.bottom+62,{select:false});
        if(adp){
          var m=moleculeMotion.get(adp);
          if(m){
            m.vx=18+Math.random()*15;
            m.vy=18+Math.random()*12;
            m.targetVx=m.vx;
            m.targetVy=m.vy;
            m.directionChangeAt=performance.now()+700;
          }
        }
      }

      pump.dataset.phosphateBound="1";
      pump.classList.add("pump-phosphate-bound");
      if(badge)badge.textContent="P";

      setTimeout(function(){
        if(!pump.isConnected)return;

        pump.classList.remove("pump-phosphorylating","pump-occluded");
        pump.classList.add("pump-open-out");
        pump.dataset.pumpState="outside-open";

        var lanes=[-28,0,28];
        sodium.forEach(function(item,index){
          if(!item.el||!item.el.isConnected)return;
          releasePumpParticle(item.el,item.slot);
          animatePumpParticle(item.el,pump,"outward",lanes[index]||0);
        });

        setTimeout(function(){
          if(!pump.isConnected)return;
          delete pump.dataset.cycling;
          pump.classList.remove("pump-cycling");
          setPumpVisualState(pump,"outside-open","0/2 K⁺");
          updateCounter();
        },820);
      },420);
    },360);
  }

  function startPumpReturn(pump){
    if(!pump||pump.dataset.cycling==="1")return;

    var potassium=pumpMolecules(pump,"k");
    if(potassium.length<2){
      updatePumpState(pump);
      return;
    }

    pump.dataset.cycling="1";
    pump.dataset.pumpState="k-bound";
    pump.classList.add("pump-cycling","pump-k-bound","pump-occluded");
    pump.classList.remove("pump-open-out");

    var badge=pump.querySelector(".pump-state-badge");
    if(badge)badge.textContent="RETORNO";

    setTimeout(function(){
      if(!pump.isConnected)return;

      var lanes=[-16,16];
      potassium.forEach(function(item,index){
        if(!item.el||!item.el.isConnected)return;
        releasePumpParticle(item.el,item.slot);
        animatePumpParticle(item.el,pump,"inward",lanes[index]||0);
      });

      pump.dataset.pumpState="inside-open";
      pump.classList.remove("pump-k-bound","pump-occluded");
      pump.classList.add("pump-open-in");

      if(pump.dataset.phosphateBound==="1"){
        delete pump.dataset.phosphateBound;
        pump.classList.remove("pump-phosphate-bound");

        var b=barrier();
        var px=parseFloat(pump.style.left)||stage.clientWidth/2;
        var pi=createPlaced("pi","molecule",Math.min(stage.clientWidth-30,px+54),b.bottom+54,{select:false});
        if(pi){
          var pm=moleculeMotion.get(pi);
          if(pm){
            pm.vx=16+Math.random()*12;
            pm.vy=20+Math.random()*10;
            pm.targetVx=pm.vx;
            pm.targetVy=pm.vy;
            pm.directionChangeAt=performance.now()+650;
          }
        }
      }

      setTimeout(function(){
        if(!pump.isConnected)return;
        delete pump.dataset.cycling;
        pump.classList.remove("pump-cycling");
        setPumpVisualState(pump,"inside-open","0/3 Na⁺");
        updateCounter();
      },820);
    },520);
  }

  function beginPlacedDrag(event){
    if(event.button!==undefined&&event.button!==0)return;
    var el=event.currentTarget;
    if(el.dataset.cycling==="1")return;
    event.preventDefault();event.stopPropagation();selectElement(el);
    if(el.dataset.kind==="molecule")releaseSlotFor(el);

    var rect=stageRect(),b=barrier(),p=pointFromClient(event.clientX,event.clientY,rect);
    var left=parseFloat(el.style.left)||p.x,top=parseFloat(el.style.top)||p.y;

    moving={
      el:el,pointerId:event.pointerId,rect:rect,b:b,
      offsetX:p.x-left,offsetY:p.y-top,
      startSide:el.dataset.kind==="molecule"?sideOf(top,b):"MP",
      clientX:event.clientX,clientY:event.clientY,
      gate:null,readySlot:null,craftTarget:null,transit:null,
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
      el.style.left=proteinX+"px";
      el.style.top=m.b.center+"px";
      if(el.dataset.type==="bomba")repositionDocked(el);
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

  document.querySelectorAll(".side-select").forEach(function(button){
    button.addEventListener("pointerdown",function(event){event.stopPropagation()});
    button.addEventListener("click",function(event){
      event.preventDefault();
      event.stopPropagation();

      var row=button.closest(".solute-compact-row");
      if(!row)return;

      row.dataset.selectedSide=button.dataset.side;
      row.querySelectorAll(".side-select").forEach(function(node){
        node.classList.toggle("is-active",node===button);
      });

      var target=row.querySelector(".target-side-label b");
      if(target)target.textContent=button.dataset.side;
    });
  });

  document.querySelectorAll(".bulk-add").forEach(function(button){
    button.addEventListener("pointerdown",function(event){event.stopPropagation()});
    button.addEventListener("click",function(event){
      event.preventDefault();
      event.stopPropagation();

      var row=button.closest(".solute-compact-row");
      var side=row&&row.dataset.selectedSide?row.dataset.selectedSide:"EC";
      spawnBatch(button.dataset.spawnType,side,button.dataset.amount);
    });
  });

  document.querySelectorAll(".tool-item,.molecule-tool").forEach(function(tool){
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

  clearButton.addEventListener("click",function(){
    layer.textContent="";placedCount=0;markSceneCacheDirty();compartmentCountCacheAt=0;selectElement(null);clearArmedTool();updateCounter();updateSoluteControlCounts();updateGradientPanel(performance.now()+500);
  });

  function removeSelectedElement(){
    if(!selected)return;

    if(selected.dataset.type==="bomba"){
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
    var type=el.dataset.type;
    var allowed=gates[type]||[];
    if(!allowed.length)return null;

    var side=sideOf(y,b);
    if(side==="MP")return null;
    if(!passiveTransportAllowed(el.dataset.type,side))return null;

    var now=performance.now();
    var motion=moleculeMotion.get(el);
    if(motion&&motion.channelCooldownUntil&&now<motion.channelCooldownUntil)return null;

    var half=moleculeHalfHeight(el);
    var surfaceDistance=side==="EC"
      ?Math.abs((y+half)-b.top)
      :Math.abs((y-half)-b.bottom);

    if(surfaceDistance>60)return null;

    var best=null;
    var bestDistance=Infinity;

    layer.querySelectorAll(".placed-protein").forEach(function(protein){
      if(allowed.indexOf(protein.dataset.type)===-1)return;

      var px=parseFloat(protein.style.left)||0;
      var py=parseFloat(protein.style.top)||b.center;
      var dx=Math.abs(px-x);
      var radial=Math.hypot(px-x,(py-y)*.72);

      if(motion&&motion.lastGateId===protein.dataset.id&&motion.clearanceRadius>0){
        if(radial<motion.clearanceRadius)return;
        motion.lastGateId=null;
        motion.clearanceRadius=0;
      }

      if(protein.dataset.channelBusy==="1")return;

      var captureDrive=Math.max(0,passiveDriveForSide(type,side));
      var captureRadius=22+Math.min(8,captureDrive*2.5);
      if(dx<captureRadius&&dx<bestDistance){
        best=protein;
        bestDistance=dx;
      }
    });

    return best;
  }

  function nearestPumpSlotForAuto(el,x,y,b){
    var type=el.dataset.type;
    if(type!=="na"&&type!=="k"&&type!=="atp")return null;

    var side=sideOf(y,b);
    if(type==="k"&&side!=="EC")return null;
    if((type==="na"||type==="atp")&&side!=="IC")return null;

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

    if(!bestPump)return null;

    var bestSlot=null;
    var slotDistance=Infinity;
    bestPump.querySelectorAll('.pump-slot:not(.occupied)').forEach(function(slot){
      if(slot.dataset.accept!==type||!pumpSlotActive(slot,bestPump))return;
      var p=slotStagePoint(slot);
      var d=Math.hypot(p.x-x,p.y-y);
      if(d<26&&d<slotDistance){
        bestSlot=slot;
        slotDistance=d;
      }
    });

    return bestSlot;
  }

  function autoBindPump(el,slot){
    if(!el||!slot||el.dataset.autoBinding==="1"||el.classList.contains("docked"))return;
    var p=slotStagePoint(slot);
    var x=parseFloat(el.style.left)||0;
    var y=parseFloat(el.style.top)||0;
    if(Math.hypot(p.x-x,p.y-y)>32)return;

    el.dataset.autoBinding="1";
    el.classList.add("auto-associating");
    el.style.left=p.x+"px";
    el.style.top=p.y+"px";

    setTimeout(function(){
      if(!el.isConnected)return;
      if(slot.isConnected&&!slot.classList.contains("occupied")){
        var motion=moleculeMotion.get(el);
        if(slot.dataset.reservedBy===el.dataset.id)delete slot.dataset.reservedBy;
        if(motion)motion.pumpReservedSlot=null;
        dockElement(el,slot);
      }
      delete el.dataset.autoBinding;
      el.classList.remove("auto-associating");
    },260);
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
      motion.channelCooldownUntil=now+1900;
      motion.associationCooldownUntil=now+1650;
      motion.gateGuide=null;
      motion.pumpGuide=null;
      motion.lastSide=fromSide==="EC"?"IC":"EC";
      motion.lastGateId=gate&&gate.dataset?gate.dataset.id:null;
      motion.clearanceRadius=108;
    }
  }

  function autoTransportChannel(el,gate,fromSide,b){
    if(!el||!gate||el.dataset.autoTransport==="1")return;
    if(!passiveTransportAllowed(el.dataset.type,fromSide))return;

    if(gate.dataset.channelBusy==="1")return;
    gate.dataset.channelBusy="1";
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
      if(!motion||!motion.charge||el.classList.contains("docked")||el.dataset.autoTransport||el.dataset.autoBinding)continue;

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
      if(!am||!am.charge||a.classList.contains("docked")||a.dataset.autoTransport||a.dataset.autoBinding)continue;

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

  function molecularPhysicsStep(dt,now){
    if(!simulationActive)return;

    var molecules=getCachedMolecules(now).filter(function(el){
      return el.isConnected&&!el.classList.contains("docked")&&!el.classList.contains("craft-consumed");
    });

    refreshCompartmentCounts(now,false);
    updateGradientPanel(now);
    if(!molecules.length)return;

    molecules.forEach(initMoleculeMotion);

    var interactiveMolecules=molecules.filter(function(el){
      return !(moving&&moving.el===el);
    });

    var electroInterval=interactiveMolecules.length>180?240:interactiveMolecules.length>100?160:100;
    if(now-lastElectrostaticUpdate>=electroInterval){
      applyElectrostaticInteractions(interactiveMolecules);
      lastElectrostaticUpdate=now;
    }

    var b=barrier();
    var width=stage.clientWidth;
    var height=stage.clientHeight;
    var associationInterval=molecules.length>180?260:molecules.length>100?210:155;
    var associationTick=now-lastAssociationTime>associationInterval;

    if(associationTick){
      getCachedProteins(now).forEach(function(protein){
        if(protein.classList.contains("capture-active"))protein.classList.remove("capture-active");
      });
    }

    molecules.forEach(function(el){
      if(el.dataset.autoTransport==="1"||el.dataset.autoBinding==="1"||el.dataset.pumpTransport==="1"||el.classList.contains("transporting"))return;
      if(moving&&moving.el===el)return;

      var motion=moleculeMotion.get(el);
      if(!motion)return;

      var x=parseFloat(el.style.left)||width/2;
      var y=parseFloat(el.style.top)||height/2;
      var halfW=motion.halfW||moleculeHalfWidth(el);
      var halfH=motion.halfH||moleculeHalfHeight(el);
      var side=sideOf(y,b);

      if(associationTick){
        motion.pumpGuide=pumpGuidanceTarget(el,x,y,b,now);
        motion.gateGuide=gateGuidanceTarget(el,x,y,b,now);
        motion.craftGuide=craftGuidanceTarget(el,x,y,b,now);

        if(motion.craftGuide&&motion.craftGuide.distance<27){
          if(craftATP(el,motion.craftGuide.partner))return;
        }

        var slot=nearestPumpSlotForAuto(el,x,y,b);
        if(slot){
          autoBindPump(el,slot);
          if(el.dataset.autoBinding==="1")return;
        }

        var gate=nearestCompatibleChannel(el,x,y,b);
        if(gate){
          autoTransportChannel(el,gate,side,b);
          if(el.dataset.autoTransport==="1")return;
        }
      }

      applyGuidanceForce(el,motion,dt,x,y,b,now);

      var boosted=motion.boostUntil&&now<motion.boostUntil;
      var diffusion=motion.diffusion||diffusionFactor(el.dataset.type);
      var sqrtDiffusion=Math.sqrt(diffusion);

      if(!boosted&&now>=motion.directionChangeAt){
        var walkAngle=Math.random()*Math.PI*2;
        var walkSpeed=(38+Math.random()*26)*Math.min(1.30,Math.max(.80,sqrtDiffusion));
        motion.targetVx=Math.cos(walkAngle)*walkSpeed;
        motion.targetVy=Math.sin(walkAngle)*walkSpeed;
        motion.directionChangeAt=now+220+Math.random()*620;
      }

      if(boosted){
        motion.targetVx=motion.vx;
        motion.targetVy=motion.vy;
      }

      var steering=boosted?1.35:5.2;
      motion.vx+=(motion.targetVx-motion.vx)*Math.min(1,steering*dt);
      motion.vy+=(motion.targetVy-motion.vy)*Math.min(1,steering*dt);

      var microNoise=(boosted?14:10)*sqrtDiffusion*Math.sqrt(Math.max(dt,.001));
      motion.vx+=(Math.random()*2-1)*microNoise;
      motion.vy+=(Math.random()*2-1)*microNoise;

      applyMembraneElectricField(el,motion,dt,b);

      var speed=Math.hypot(motion.vx,motion.vy);
      var maxSpeed=(boosted?88:74)*Math.min(1.30,Math.max(.80,sqrtDiffusion));
      if(speed>maxSpeed){
        motion.vx=motion.vx/speed*maxSpeed;
        motion.vy=motion.vy/speed*maxSpeed;
      }

      var nx=x+motion.vx*dt;
      var ny=y+motion.vy*dt;

      if(nx<-halfW){
        nx=width+halfW-1;
      }else if(nx>width+halfW){
        nx=-halfW+1;
      }

      if(ny<halfH){
        ny=halfH;
        motion.vy=Math.abs(motion.vy)*.75;
      }else if(ny>height-halfH){
        ny=height-halfH;
        motion.vy=-Math.abs(motion.vy)*.75;
      }

      if(side==="EC"&&ny+halfH>b.top){
        ny=b.top-halfH;
        motion.vy=-Math.abs(motion.vy)*(.62+Math.random()*.18);
        motion.vx+=(Math.random()-.5)*12;
      }else if(side==="IC"&&ny-halfH<b.bottom){
        ny=b.bottom+halfH;
        motion.vy=Math.abs(motion.vy)*(.62+Math.random()*.18);
        motion.vx+=(Math.random()-.5)*12;
      }else if(side==="MP"){
        if(y<=b.center){
          ny=b.top-halfH;
          motion.vy=-Math.abs(motion.vy||6);
        }else{
          ny=b.bottom+halfH;
          motion.vy=Math.abs(motion.vy||6);
        }
      }

      el.style.left=nx+"px";
      el.style.top=ny+"px";
    });

    if(associationTick)lastAssociationTime=now;
  }

  function molecularPhysicsLoop(now){
    if(!simulationActive)return;
    physicsRaf=requestAnimationFrame(molecularPhysicsLoop);

    if(!lastPhysicsTime){
      lastPhysicsTime=now;
      return;
    }

    var elapsed=now-lastPhysicsTime;
    if(elapsed<31)return;
    lastPhysicsTime=now;
    molecularPhysicsStep(Math.min(elapsed,50)/1000,now);
  }

  window.addEventListener("pagehide",function(){
    simulationActive=false;
    if(physicsRaf){
      cancelAnimationFrame(physicsRaf);
      physicsRaf=0;
    }
  });

  window.addEventListener("pageshow",function(){
    if(simulationActive)return;
    simulationActive=true;
    lastPhysicsTime=0;
    physicsRaf=requestAnimationFrame(molecularPhysicsLoop);
  });

  window.addEventListener("resize",function(){
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
  renderDefaultInfo();
  updateCounter();
  updateSoluteControlCounts();
  updateGradientPanel(performance.now()+500);
  loadUser();
  physicsRaf=requestAnimationFrame(molecularPhysicsLoop);
})();