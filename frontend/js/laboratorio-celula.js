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
    "atp":{name:"ATP",category:"ENERGIA",text:"ATP não atravessa a bicamada. Arraste-o para o encaixe energético da bomba pelo lado intracelular.",label:"ATP",kind:"molecule"},
    "adp":{name:"ADP + Pi",category:"PRODUTO ENERGÉTICO",text:"Produtos da hidrólise do ATP após um ciclo completo da bomba.",label:"ADP+Pi",kind:"molecule"}
  };

  var gates={na:["canal-na"],k:["canal-k","vazante"],h2o:["aquaporina"]};

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
    var stageBox=stage.getBoundingClientRect();
    var membraneBox=bilayer.getBoundingClientRect();
    var top=membraneBox.top-stageBox.top;
    var bottom=membraneBox.bottom-stageBox.top;
    return {top:top,bottom:bottom,center:(top+bottom)/2,height:bottom-top};
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

  function beginSourceDrag(event){
    if(event.button!==undefined&&event.button!==0)return;
    event.preventDefault();

    var tool=event.currentTarget;
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

    ghost.style.left=event.clientX+"px";
    ghost.style.top=event.clientY+"px";
    stage.classList.add("drag-source-active");
    try{tool.setPointerCapture(event.pointerId)}catch(_){}
  }

  function queueSourceMove(event){
    if(!sourceDrag||event.pointerId!==sourceDrag.pointerId)return;
    sourceDrag.clientX=event.clientX;sourceDrag.clientY=event.clientY;
    if(Math.hypot(event.clientX-sourceDrag.startX,event.clientY-sourceDrag.startY)>4)sourceDrag.moved=true;
    if(rafSource)return;
    rafSource=requestAnimationFrame(applySourceMove);
  }

  function applySourceMove(){
    rafSource=0;
    if(!sourceDrag)return;
    var d=sourceDrag;
    d.ghost.style.left=d.clientX+"px";
    d.ghost.style.top=d.clientY+"px";
    var r=d.rect;
    var inside=d.clientX>=r.left&&d.clientX<=r.right&&d.clientY>=r.top&&d.clientY<=r.bottom;
    stage.classList.toggle("is-drop-target",inside);
  }

  function endSourceDrag(event){
    if(!sourceDrag||event.pointerId!==sourceDrag.pointerId)return;
    if(rafSource){cancelAnimationFrame(rafSource);rafSource=0;applySourceMove()}

    var d=sourceDrag;
    var r=d.rect;
    var inside=d.clientX>=r.left&&d.clientX<=r.right&&d.clientY>=r.top&&d.clientY<=r.bottom;

    if(inside&&d.moved){
      var p=pointFromClient(d.clientX,d.clientY,r);
      var created=createPlaced(d.type,d.kind,p.x,p.y);
      if(created&&d.kind==="molecule"){
        var directSlot=findDockTarget(created,p.x,p.y);
        if(directSlot)dockElement(created,directSlot);
      }
    }else if(!d.moved){
      armedHint.hidden=false;
      armedText.textContent=catalogue[d.type].name;
      var once=function(e){
        if(e.target.closest(".tool-item,.molecule-tool"))return;
        var rr=stageRect();
        if(e.clientX>=rr.left&&e.clientX<=rr.right&&e.clientY>=rr.top&&e.clientY<=rr.bottom){
          var p=pointFromClient(e.clientX,e.clientY,rr);
          createPlaced(d.type,d.kind,p.x,p.y);
        }
        armedHint.hidden=true;
        window.removeEventListener("pointerdown",once,true);
      };
      setTimeout(function(){window.addEventListener("pointerdown",once,true)},0);
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
    layer.querySelectorAll(".placed-protein").forEach(function(protein){
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
    var sr=slot.getBoundingClientRect(),tr=stageRect();
    return {x:sr.left+sr.width/2-tr.left,y:sr.top+sr.height/2-tr.top};
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

  function findDockTarget(el,x,y){
    var type=el.dataset.type,best=null,bestDistance=Infinity;
    var b=barrier();

    if(type==="k"&&y>b.center+10)return null;
    if((type==="na"||type==="atp")&&y<b.center-10)return null;

    layer.querySelectorAll('.placed-protein[data-type="bomba"] .pump-slot:not(.occupied)').forEach(function(slot){
      if(slot.dataset.accept!==type)return;
      var p=slotStagePoint(slot),d=Math.hypot(p.x-x,p.y-y);
      if(d<46&&d<bestDistance){best=slot;bestDistance=d}
    });
    return best;
  }

  function markReadySlot(slot){
    layer.querySelectorAll(".pump-slot.slot-ready").forEach(function(node){node.classList.remove("slot-ready")});
    if(slot)slot.classList.add("slot-ready");
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
    if(!pump||pump.dataset.cycling==="1")return;
    var occupied=pump.querySelectorAll(".pump-slot.occupied").length;
    var badge=pump.querySelector(".pump-state-badge");
    if(badge)badge.textContent=occupied+"/6";
    pump.classList.toggle("pump-ready",occupied===6);
    if(occupied===6){
      pump.dataset.cycling="1";
      if(badge)badge.textContent="PRONTA";
      setTimeout(function(){startPumpCycle(pump)},360);
    }
  }

  function clearPumpSlot(slot){
    slot.classList.remove("occupied","slot-ready");delete slot.dataset.occupiedId;
  }

  function startPumpCycle(pump){
    if(!pump||!pump.isConnected)return;
    var slots=Array.from(pump.querySelectorAll(".pump-slot"));
    if(slots.filter(function(s){return s.classList.contains("occupied")}).length!==6){
      delete pump.dataset.cycling;pump.classList.remove("pump-ready");updatePumpState(pump);return;
    }

    pump.classList.add("pump-cycling");
    var badge=pump.querySelector(".pump-state-badge");
    if(badge)badge.textContent="ATIVA";

    setTimeout(function(){
      var b=barrier(),px=parseFloat(pump.style.left)||stage.clientWidth/2;
      var naIndex=0,kIndex=0,atpEl=null;

      slots.forEach(function(slot){
        var el=layer.querySelector('[data-id="'+slot.dataset.occupiedId+'"]');
        if(!el){clearPumpSlot(slot);return}
        delete el.dataset.dockedPump;delete el.dataset.dockedSlot;
        el.classList.remove("docked");el.classList.add("transporting");

        if(el.dataset.type==="na"){
          var no=[-30,0,30];
          el.style.left=(px+no[naIndex++])+"px";el.style.top=(b.top-34)+"px";
        }else if(el.dataset.type==="k"){
          var ko=[-18,18];
          el.style.left=(px+ko[kIndex++])+"px";el.style.top=(b.bottom+34)+"px";
        }else if(el.dataset.type==="atp"){atpEl=el}
        clearPumpSlot(slot);
      });

      if(atpEl){
        atpEl.remove();
        createPlaced("adp","molecule",Math.min(stage.clientWidth-50,px+70),b.bottom+56,{select:false});
      }
      updateCounter();

      setTimeout(function(){
        layer.querySelectorAll(".transporting").forEach(function(el){el.classList.remove("transporting")});
        pump.classList.remove("pump-ready","pump-cycling");delete pump.dataset.cycling;
        if(badge)badge.textContent="0/6";
      },760);
    },480);
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
      gate:null,readySlot:null,transit:null,
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
        var nextX=limitStep(currentX,gx,8);
        var nextY=limitStep(currentY,targetY,9);

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
          m.transit=null;
          m.gate=null;
          clearGateGlow();
          el.classList.remove("is-channeling");
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
          m.gate=gate;
          m.transit={gate:gate,from:m.startSide};
          gate.classList.add("channel-pass");
          el.classList.add("is-channeling");
          el.classList.remove("is-blocked");
          scheduleMoveAgain();
          return;
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
    }

    m.el.classList.remove("is-dragging","is-blocked","is-channeling");
    markReadySlot(null);
    clearGateGlow();
    try{m.el.releasePointerCapture(m.pointerId)}catch(_){}
    moving=null;
  }

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
    if(!event.target.closest(".placed-element"))selectElement(null);
  });

  clearButton.addEventListener("click",function(){
    layer.textContent="";placedCount=0;selectElement(null);updateCounter();
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
    }

    selected.remove();
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
      armedHint.hidden=true;
    }
  });

  window.addEventListener("resize",function(){
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
  loadUser();
})();