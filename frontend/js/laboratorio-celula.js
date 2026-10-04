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

  var armed=null;
  var selected=null;
  var placedCount=0;
  var dragPayload=null;
  var moving=null;
  var ghost=null;
  var collisionTimer=0;
  var resizeTimer=0;

  var catalogue={
    "canal-na":{
      name:"Canal de sódio (Na⁺)",category:"PROTEÍNA TRANSMEMBRANA",
      text:"Canal seletivo para Na⁺. O sódio só atravessa esta membrana pelo canal compatível ou por transporte ativo.",
      label:"Canal Na⁺",kind:"protein",art:"channel"
    },
    "canal-k":{
      name:"Canal de potássio (K⁺)",category:"PROTEÍNA TRANSMEMBRANA",
      text:"Canal seletivo para K⁺. Permite a travessia do potássio pela bicamada sem que o íon atravesse diretamente a região hidrofóbica.",
      label:"Canal K⁺",kind:"protein",art:"channel"
    },
    "vazante":{
      name:"Canal vazante de K⁺",category:"PROTEÍNA TRANSMEMBRANA",
      text:"Canal passivo para K⁺. Nesta simulação ele também funciona como uma via seletiva para potássio.",
      label:"Canal vazante",kind:"protein",art:"channel"
    },
    "bomba":{
      name:"Bomba Na⁺/K⁺-ATPase",category:"TRANSPORTE ATIVO",
      text:"Só inicia o ciclo com 3 Na⁺ encaixados no lado intracelular, 2 K⁺ no lado extracelular e 1 ATP no encaixe energético.",
      label:"Bomba Na⁺/K⁺",kind:"protein",art:"pump"
    },
    "aquaporina":{
      name:"Aquaporina",category:"PROTEÍNA TRANSMEMBRANA",
      text:"Canal seletivo para água. H₂O pode cruzar a bicamada apenas quando passa por uma aquaporina colocada na membrana.",
      label:"Aquaporina",kind:"protein",art:"channel"
    },
    "na":{
      name:"Sódio (Na⁺)",category:"ÍON",
      text:"O Na⁺ não atravessa diretamente a bicamada. Use um Canal Na⁺ ou carregue a bomba Na⁺/K⁺ pelo lado intracelular.",
      label:"Na⁺",kind:"molecule"
    },
    "k":{
      name:"Potássio (K⁺)",category:"ÍON",
      text:"O K⁺ não atravessa diretamente a bicamada. Use Canal K⁺, canal vazante ou o ciclo da bomba Na⁺/K⁺.",
      label:"K⁺",kind:"molecule"
    },
    "cl":{
      name:"Cloreto (Cl⁻)",category:"ÍON",
      text:"Sem um canal de Cl⁻ disponível nesta versão, o íon fica bloqueado pela bicamada.",
      label:"Cl⁻",kind:"molecule"
    },
    "h2o":{
      name:"Água (H₂O)",category:"MOLÉCULA",
      text:"Nesta simulação a travessia rápida de água ocorre pela aquaporina.",
      label:"H₂O",kind:"molecule"
    },
    "atp":{
      name:"ATP",category:"ENERGIA",
      text:"O ATP não atravessa a membrana nesta simulação. Ele deve ser encaixado no sítio energético da bomba pelo lado intracelular.",
      label:"ATP",kind:"molecule"
    },
    "adp":{
      name:"ADP + Pi",category:"PRODUTO ENERGÉTICO",
      text:"Produtos gerados após a hidrólise do ATP durante o ciclo da bomba Na⁺/K⁺.",
      label:"ADP+Pi",kind:"molecule"
    }
  };

  var gates={na:["canal-na"],k:["canal-k","vazante"],h2o:["aquaporina"]};

  function makeLipid(delay,flip){
    var lipid=document.createElement("span");
    lipid.className="phospholipid";
    lipid.style.setProperty("--delay",delay+"s");
    var head=document.createElement("i");
    head.className="lipid-head";
    var tailA=document.createElement("i");
    tailA.className="lipid-tail tail-a";
    var tailB=document.createElement("i");
    tailB.className="lipid-tail tail-b";
    if(flip){lipid.appendChild(tailA);lipid.appendChild(tailB);lipid.appendChild(head)}
    else{lipid.appendChild(head);lipid.appendChild(tailA);lipid.appendChild(tailB)}
    return lipid;
  }

  function buildBilayer(){
    if(!topRow||!bottomRow||!stage)return;
    topRow.innerHTML="";bottomRow.innerHTML="";
    var amount=Math.max(24,Math.min(48,Math.round(stage.clientWidth/30)));
    for(var i=0;i<amount;i++){
      var delay=-((i%12)*0.28);
      topRow.appendChild(makeLipid(delay,false));
      bottomRow.appendChild(makeLipid(delay-.65,true));
    }
  }

  function getBarrier(){
    var top=bilayer.offsetTop;
    return {top:top,bottom:top+bilayer.offsetHeight,center:top+bilayer.offsetHeight/2};
  }

  function sideOf(y){
    var b=getBarrier();
    if(y<b.top)return "EC";
    if(y>b.bottom)return "IC";
    return "MP";
  }

  function stagePoint(clientX,clientY){
    var rect=stage.getBoundingClientRect();
    return {
      x:Math.max(16,Math.min(rect.width-16,clientX-rect.left)),
      y:Math.max(16,Math.min(rect.height-16,clientY-rect.top))
    };
  }

  function proteinY(){return getBarrier().center}
  function clampProteinX(x){return Math.max(50,Math.min(stage.clientWidth-50,x))}

  function itemMarkup(type){
    var item=catalogue[type];
    if(!item)return "";
    if(item.kind==="protein"){
      if(item.art==="pump"){
        return '<span class="protein-label">'+item.label+'</span>'+
          '<span class="protein-art pump-art"></span>'+
          '<i class="pump-slot slot-k1" data-accept="k" data-slot="k1">K</i>'+
          '<i class="pump-slot slot-k2" data-accept="k" data-slot="k2">K</i>'+
          '<i class="pump-slot slot-na1" data-accept="na" data-slot="na1">Na</i>'+
          '<i class="pump-slot slot-na2" data-accept="na" data-slot="na2">Na</i>'+
          '<i class="pump-slot slot-na3" data-accept="na" data-slot="na3">Na</i>'+
          '<i class="pump-slot slot-atp" data-accept="atp" data-slot="atp">ATP</i>'+
          '<span class="pump-state-badge">0/6</span>';
      }
      return '<span class="protein-label">'+item.label+'</span><span class="protein-art protein-channel"><i class="protein-pore"></i></span>';
    }
    return item.label;
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
    document.getElementById("infoText").textContent="Cabeças hidrofílicas voltadas aos meios aquosos e caudas hidrofóbicas apontadas umas para as outras. Íons não atravessam diretamente a região hidrofóbica.";
  }

  function renderInfo(type){
    var item=catalogue[type];
    if(!item)return;
    document.querySelector(".selection-index").textContent="•";
    document.getElementById("infoType").textContent=item.category;
    document.getElementById("infoTitle").textContent=item.name;
    document.getElementById("infoText").textContent=item.text;
  }

  function clearSelection(){
    if(selected)selected.classList.remove("is-selected");
    selected=null;removeButton.hidden=true;renderDefaultInfo();
  }

  function selectElement(el){
    if(selected&&selected!==el)selected.classList.remove("is-selected");
    selected=el;el.classList.add("is-selected");removeButton.hidden=false;renderInfo(el.dataset.type);
  }

  function showCollision(type){
    var message="A bicamada bloqueou a passagem.";
    if(type==="na")message="Na⁺ bloqueado: atravesse por um Canal Na⁺ ou use a bomba Na⁺/K⁺.";
    if(type==="k")message="K⁺ bloqueado: atravesse por um Canal K⁺/vazante ou use a bomba Na⁺/K⁺.";
    if(type==="h2o")message="H₂O bloqueada: use uma aquaporina para cruzar a membrana.";
    if(type==="cl")message="Cl⁻ bloqueado: ainda não há canal de cloreto nesta versão.";
    if(type==="atp")message="ATP não atravessa a bicamada: use-o no encaixe intracelular da bomba.";
    collisionToast.textContent=message;
    collisionToast.classList.add("is-visible");
    stage.classList.remove("barrier-hit");void stage.offsetWidth;stage.classList.add("barrier-hit");
    clearTimeout(collisionTimer);
    collisionTimer=setTimeout(function(){
      collisionToast.classList.remove("is-visible");stage.classList.remove("barrier-hit");
    },1450);
  }

  function createPlaced(type,kind,x,y,options){
    options=options||{};
    var item=catalogue[type];
    if(!item)return null;
    var b=getBarrier();

    if(kind==="protein"){
      x=clampProteinX(x);y=b.center;
    }else if(y>=b.top&&y<=b.bottom){
      y=y<b.center?b.top-26:b.bottom+26;
    }

    var el=document.createElement("div");
    el.className="placed-element "+(kind==="protein"?"placed-protein":"placed-molecule");
    el.dataset.type=type;el.dataset.kind=kind;el.dataset.id="mem-"+(++placedCount);
    el.innerHTML=itemMarkup(type);el.style.left=x+"px";el.style.top=y+"px";

    el.addEventListener("pointerdown",beginMovePlaced);
    el.addEventListener("click",function(event){event.stopPropagation();selectElement(el)});
    el.addEventListener("mouseenter",function(){renderInfo(type)});
    el.addEventListener("mouseleave",function(){if(selected)renderInfo(selected.dataset.type);else renderDefaultInfo()});

    layer.appendChild(el);
    if(options.select!==false)selectElement(el);
    updateCounter();
    return el;
  }

  function armTool(tool){
    document.querySelectorAll(".tool-item,.molecule-tool").forEach(function(node){
      node.classList.toggle("is-armed",node===tool);
    });
    armed={type:tool.dataset.type,kind:tool.dataset.kind};
    var item=catalogue[armed.type];
    armedText.textContent=item?item.name:"Item selecionado";
    armedHint.hidden=false;
  }

  function disarmTool(){
    armed=null;armedHint.hidden=true;
    document.querySelectorAll(".tool-item,.molecule-tool").forEach(function(node){node.classList.remove("is-armed")});
  }

  function compatibleGate(type,x){
    var allowed=gates[type]||[];
    if(!allowed.length)return null;
    var best=null,bestDistance=9999;
    Array.from(layer.querySelectorAll(".placed-protein")).forEach(function(protein){
      if(allowed.indexOf(protein.dataset.type)===-1)return;
      var px=parseFloat(protein.style.left)||0;
      var d=Math.abs(px-x);
      if(d<48&&d<bestDistance){best=protein;bestDistance=d}
    });
    return best;
  }

  function clearGateGlow(){
    layer.querySelectorAll(".channel-pass").forEach(function(el){el.classList.remove("channel-pass")});
  }

  function slotStagePoint(slot){
    var sr=slot.getBoundingClientRect(),tr=stage.getBoundingClientRect();
    return {x:sr.left+sr.width/2-tr.left,y:sr.top+sr.height/2-tr.top};
  }

  function releaseSlotFor(el){
    if(!el.dataset.dockedPump||!el.dataset.dockedSlot)return;
    var pump=layer.querySelector('[data-id="'+el.dataset.dockedPump+'"]');
    if(pump){
      var slot=pump.querySelector('[data-slot="'+el.dataset.dockedSlot+'"]');
      if(slot){
        slot.classList.remove("occupied","slot-ready");
        delete slot.dataset.occupiedId;
      }
      updatePumpState(pump);
    }
    delete el.dataset.dockedPump;delete el.dataset.dockedSlot;el.classList.remove("docked");
  }

  function findDockTarget(el,x,y){
    var type=el.dataset.type,best=null,bestDistance=9999;
    Array.from(layer.querySelectorAll('.placed-protein[data-type="bomba"] .pump-slot:not(.occupied)')).forEach(function(slot){
      if(slot.dataset.accept!==type)return;
      var point=slotStagePoint(slot);
      var d=Math.hypot(point.x-x,point.y-y);
      if(d<34&&d<bestDistance){best=slot;bestDistance=d}
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
    var point=slotStagePoint(slot);
    el.style.left=point.x+"px";el.style.top=point.y+"px";
    el.dataset.dockedPump=pump.dataset.id;el.dataset.dockedSlot=slot.dataset.slot;
    el.classList.add("docked");
    slot.classList.remove("slot-ready");slot.classList.add("occupied");slot.dataset.occupiedId=el.dataset.id;
    updatePumpState(pump);selectElement(pump);
  }

  function repositionDocked(pump){
    Array.from(pump.querySelectorAll(".pump-slot.occupied")).forEach(function(slot){
      var el=layer.querySelector('[data-id="'+slot.dataset.occupiedId+'"]');
      if(!el)return;
      var point=slotStagePoint(slot);
      el.style.left=point.x+"px";el.style.top=point.y+"px";
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
      setTimeout(function(){startPumpCycle(pump)},420);
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
      var b=getBarrier();
      var px=parseFloat(pump.style.left)||stage.clientWidth/2;
      var naIndex=0,kIndex=0,atpEl=null;

      slots.forEach(function(slot){
        var el=layer.querySelector('[data-id="'+slot.dataset.occupiedId+'"]');
        if(!el){clearPumpSlot(slot);return}
        delete el.dataset.dockedPump;delete el.dataset.dockedSlot;
        el.classList.remove("docked");el.classList.add("transporting");

        if(el.dataset.type==="na"){
          var naOffsets=[-30,0,30];
          el.style.left=(px+naOffsets[naIndex++])+"px";el.style.top=(b.top-48)+"px";
        }else if(el.dataset.type==="k"){
          var kOffsets=[-18,18];
          el.style.left=(px+kOffsets[kIndex++])+"px";el.style.top=(b.bottom+48)+"px";
        }else if(el.dataset.type==="atp"){
          atpEl=el;
        }
        clearPumpSlot(slot);
      });

      if(atpEl){
        atpEl.remove();
        createPlaced("adp","molecule",Math.min(stage.clientWidth-50,px+72),b.bottom+70,{select:false});
      }
      updateCounter();

      setTimeout(function(){
        layer.querySelectorAll(".transporting").forEach(function(el){el.classList.remove("transporting")});
        pump.classList.remove("pump-ready","pump-cycling");
        delete pump.dataset.cycling;
        if(badge)badge.textContent="0/6";
        renderInfo("bomba");
      },820);
    },520);
  }

  function beginMovePlaced(event){
    if(event.button!==undefined&&event.button!==0)return;
    var el=event.currentTarget;
    if(el.dataset.cycling==="1")return;
    event.preventDefault();event.stopPropagation();selectElement(el);
    if(el.dataset.kind==="molecule")releaseSlotFor(el);

    var point=stagePoint(event.clientX,event.clientY);
    var left=parseFloat(el.style.left)||point.x;
    var top=parseFloat(el.style.top)||point.y;

    moving={
      el:el,offsetX:point.x-left,offsetY:point.y-top,pointerId:event.pointerId,
      startSide:el.dataset.kind==="molecule"?sideOf(top):"MP",gate:null,readySlot:null
    };
    try{el.setPointerCapture(event.pointerId)}catch(_){}
  }

  function moveProtein(point){
    var el=moving.el;
    var x=clampProteinX(point.x-moving.offsetX);
    el.style.left=x+"px";el.style.top=proteinY()+"px";
    if(el.dataset.type==="bomba")repositionDocked(el);
  }

  function moveMolecule(point){
    var el=moving.el,type=el.dataset.type,b=getBarrier();
    var x=point.x-moving.offsetX,y=point.y-moving.offsetY;
    x=Math.max(18,Math.min(stage.clientWidth-18,x));
    y=Math.max(18,Math.min(stage.clientHeight-18,y));

    var enteringFromEC=moving.startSide==="EC"&&y>=b.top;
    var enteringFromIC=moving.startSide==="IC"&&y<=b.bottom;

    if(enteringFromEC||enteringFromIC){
      if(!moving.gate)moving.gate=compatibleGate(type,x);
      if(moving.gate){
        var gx=parseFloat(moving.gate.style.left)||x;
        if(y>=b.top-12&&y<=b.bottom+12)x=gx;
        moving.gate.classList.add("channel-pass");
        el.classList.remove("is-blocked");
      }else{
        if(enteringFromEC)y=b.top-20;
        if(enteringFromIC)y=b.bottom+20;
        el.classList.add("is-blocked");
        showCollision(type);
      }
    }else{
      el.classList.remove("is-blocked");
    }

    el.style.left=x+"px";el.style.top=y+"px";
    var slot=findDockTarget(el,x,y);
    moving.readySlot=slot;markReadySlot(slot);
  }

  function movePlaced(event){
    if(!moving)return;
    var point=stagePoint(event.clientX,event.clientY);
    if(moving.el.dataset.kind==="protein")moveProtein(point);
    else moveMolecule(point);
  }

  function endMovePlaced(){
    if(!moving)return;
    if(moving.readySlot&&moving.el.dataset.kind==="molecule")dockElement(moving.el,moving.readySlot);
    moving.el.classList.remove("is-blocked");
    markReadySlot(null);clearGateGlow();
    try{moving.el.releasePointerCapture(moving.pointerId)}catch(_){}
    moving=null;
  }

  function ghostFor(tool){
    var node=document.createElement("div");
    node.className="drag-ghost";
    var item=catalogue[tool.dataset.type];
    node.innerHTML=tool.dataset.kind==="protein"
      ? '<span class="tool-preview channel-preview"><i></i></span>'
      : '<span class="placed-molecule" data-type="'+tool.dataset.type+'">'+item.label+'</span>';
    document.body.appendChild(node);
    return node;
  }

  function startTouchTool(event){
    if(event.pointerType==="mouse")return;
    event.preventDefault();
    var tool=event.currentTarget;
    armTool(tool);
    ghost=ghostFor(tool);ghost.style.left=event.clientX+"px";ghost.style.top=event.clientY+"px";
    dragPayload={type:tool.dataset.type,kind:tool.dataset.kind,pointerId:event.pointerId};
    try{tool.setPointerCapture(event.pointerId)}catch(_){}
  }

  function moveTouchTool(event){
    if(!dragPayload||event.pointerId!==dragPayload.pointerId)return;
    if(ghost){ghost.style.left=event.clientX+"px";ghost.style.top=event.clientY+"px"}
    var rect=stage.getBoundingClientRect();
    var inside=event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom;
    stage.classList.toggle("is-drop-target",inside);
  }

  function endTouchTool(event){
    if(!dragPayload||event.pointerId!==dragPayload.pointerId)return;
    var rect=stage.getBoundingClientRect();
    var inside=event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom;
    if(inside){
      var point=stagePoint(event.clientX,event.clientY);
      createPlaced(dragPayload.type,dragPayload.kind,point.x,point.y);
      disarmTool();
    }
    if(ghost){ghost.remove();ghost=null}
    stage.classList.remove("is-drop-target");dragPayload=null;
  }

  document.querySelectorAll(".tool-item,.molecule-tool").forEach(function(tool){
    tool.addEventListener("click",function(){
      if(armed&&armed.type===tool.dataset.type)disarmTool();else armTool(tool);
    });
    tool.addEventListener("dragstart",function(event){
      var data={type:tool.dataset.type,kind:tool.dataset.kind};
      event.dataTransfer.effectAllowed="copy";
      event.dataTransfer.setData("text/plain",JSON.stringify(data));
      armTool(tool);
    });
    tool.addEventListener("dragend",function(){stage.classList.remove("is-drop-target");disarmTool()});
    tool.addEventListener("pointerdown",startTouchTool);
    tool.addEventListener("pointermove",moveTouchTool);
    tool.addEventListener("pointerup",endTouchTool);
    tool.addEventListener("pointercancel",endTouchTool);
  });

  stage.addEventListener("dragover",function(event){
    event.preventDefault();stage.classList.add("is-drop-target");event.dataTransfer.dropEffect="copy";
  });
  stage.addEventListener("dragleave",function(event){
    if(!stage.contains(event.relatedTarget))stage.classList.remove("is-drop-target");
  });
  stage.addEventListener("drop",function(event){
    event.preventDefault();stage.classList.remove("is-drop-target");
    try{
      var data=JSON.parse(event.dataTransfer.getData("text/plain"));
      var point=stagePoint(event.clientX,event.clientY);
      createPlaced(data.type,data.kind,point.x,point.y);
    }catch(_){}
    disarmTool();
  });

  stage.addEventListener("click",function(event){
    if(event.target.closest(".placed-element"))return;
    if(armed){
      var point=stagePoint(event.clientX,event.clientY);
      createPlaced(armed.type,armed.kind,point.x,point.y);disarmTool();return;
    }
    clearSelection();
  });

  window.addEventListener("pointermove",movePlaced);
  window.addEventListener("pointerup",endMovePlaced);
  window.addEventListener("pointercancel",endMovePlaced);

  clearButton.addEventListener("click",function(){
    layer.innerHTML="";placedCount=0;disarmTool();clearSelection();updateCounter();
  });

  removeButton.addEventListener("click",function(){
    if(!selected)return;
    if(selected.dataset.type==="bomba"){
      Array.from(selected.querySelectorAll(".pump-slot.occupied")).forEach(function(slot){
        var molecule=layer.querySelector('[data-id="'+slot.dataset.occupiedId+'"]');
        if(molecule){
          delete molecule.dataset.dockedPump;delete molecule.dataset.dockedSlot;molecule.classList.remove("docked");
        }
        clearPumpSlot(slot);
      });
    }else if(selected.dataset.kind==="molecule"){
      releaseSlotFor(selected);
    }
    selected.remove();selected=null;removeButton.hidden=true;renderDefaultInfo();updateCounter();
  });

  document.addEventListener("keydown",function(event){
    if(event.key==="Escape"){disarmTool();clearSelection()}
  });

  window.addEventListener("resize",function(){
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(function(){
      buildBilayer();
      var b=getBarrier();
      layer.querySelectorAll('.placed-element[data-kind="protein"]').forEach(function(el){
        el.style.top=b.center+"px";
        el.style.left=clampProteinX(parseFloat(el.style.left)||stage.clientWidth/2)+"px";
        if(el.dataset.type==="bomba")repositionDocked(el);
      });
    },120);
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

  buildBilayer();renderDefaultInfo();updateCounter();loadUser();
})();