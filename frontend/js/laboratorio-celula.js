(function(){
  "use strict";

  var stage=document.getElementById("membraneStage");
  var layer=document.getElementById("placedLayer");
  var topRow=document.getElementById("phospholipidTop");
  var bottomRow=document.getElementById("phospholipidBottom");
  var dropHint=document.getElementById("dropHint");
  var armedHint=document.getElementById("armedHint");
  var armedText=document.getElementById("armedText");
  var counter=document.getElementById("elementCounter");
  var clearButton=document.getElementById("clearStage");
  var removeButton=document.getElementById("removeSelected");

  var armed=null;
  var selected=null;
  var placedCount=0;
  var dragPayload=null;
  var moving=null;
  var ghost=null;

  var catalogue={
    "canal-na":{
      name:"Canal de sódio (Na⁺)",
      category:"PROTEÍNA TRANSMEMBRANA",
      text:"Canal seletivo para Na⁺. Quando aberto, favorece o fluxo de sódio de acordo com seu gradiente eletroquímico.",
      label:"Canal Na⁺",
      kind:"protein",
      art:"channel"
    },
    "canal-k":{
      name:"Canal de potássio (K⁺)",
      category:"PROTEÍNA TRANSMEMBRANA",
      text:"Canal seletivo para K⁺. O fluxo de potássio é essencial para o potencial de repouso e para a repolarização.",
      label:"Canal K⁺",
      kind:"protein",
      art:"channel"
    },
    "vazante":{
      name:"Canal vazante",
      category:"PROTEÍNA TRANSMEMBRANA",
      text:"Canal que permanece parcialmente aberto e permite fluxo passivo. Canais vazantes de K⁺ ajudam a manter o potencial de repouso.",
      label:"Canal vazante",
      kind:"protein",
      art:"channel"
    },
    "bomba":{
      name:"Bomba Na⁺/K⁺-ATPase",
      category:"TRANSPORTE ATIVO",
      text:"Utiliza ATP para transportar 3 Na⁺ para fora e 2 K⁺ para dentro da célula, mantendo os gradientes iônicos.",
      label:"Bomba Na⁺/K⁺",
      kind:"protein",
      art:"pump"
    },
    "aquaporina":{
      name:"Aquaporina",
      category:"PROTEÍNA TRANSMEMBRANA",
      text:"Canal altamente seletivo para água, facilitando o transporte de H₂O através da membrana.",
      label:"Aquaporina",
      kind:"protein",
      art:"channel"
    },
    "receptor":{
      name:"Receptor de membrana",
      category:"PROTEÍNA INTEGRAL",
      text:"Proteína capaz de reconhecer ligantes no meio extracelular e transmitir sinais para o interior da célula.",
      label:"Receptor",
      kind:"protein",
      art:"receptor"
    },
    "na":{
      name:"Sódio (Na⁺)",
      category:"ÍON",
      text:"O Na⁺ encontra-se em maior concentração no meio extracelular em uma célula típica em repouso.",
      label:"Na⁺",
      kind:"molecule"
    },
    "k":{
      name:"Potássio (K⁺)",
      category:"ÍON",
      text:"O K⁺ encontra-se em maior concentração no meio intracelular em uma célula típica em repouso.",
      label:"K⁺",
      kind:"molecule"
    },
    "cl":{
      name:"Cloreto (Cl⁻)",
      category:"ÍON",
      text:"Ânion importante para o equilíbrio eletroquímico e osmótico de muitas células.",
      label:"Cl⁻",
      kind:"molecule"
    },
    "h2o":{
      name:"Água (H₂O)",
      category:"MOLÉCULA",
      text:"A água pode atravessar a membrana principalmente por canais de aquaporina, seguindo gradientes osmóticos.",
      label:"H₂O",
      kind:"molecule"
    },
    "atp":{
      name:"ATP",
      category:"ENERGIA",
      text:"Molécula energética utilizada pela bomba Na⁺/K⁺-ATPase para realizar transporte ativo.",
      label:"ATP",
      kind:"molecule"
    },
    "glicose":{
      name:"Glicose",
      category:"MOLÉCULA",
      text:"Molécula polar que normalmente depende de transportadores específicos para atravessar a membrana.",
      label:"Glu",
      kind:"molecule"
    }
  };

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

    if(flip){
      lipid.appendChild(tailA);
      lipid.appendChild(tailB);
      lipid.appendChild(head);
    }else{
      lipid.appendChild(head);
      lipid.appendChild(tailA);
      lipid.appendChild(tailB);
    }

    return lipid;
  }

  function buildBilayer(){
    if(!topRow||!bottomRow)return;
    topRow.innerHTML="";
    bottomRow.innerHTML="";

    var width=stage?stage.clientWidth:1000;
    var amount=Math.max(24,Math.min(46,Math.round(width/31)));

    for(var i=0;i<amount;i++){
      var delay=-((i%11)*0.31);
      topRow.appendChild(makeLipid(delay,false));
      bottomRow.appendChild(makeLipid(delay-0.7,true));
    }
  }

  function stagePoint(clientX,clientY){
    var rect=stage.getBoundingClientRect();
    return {
      x:Math.max(18,Math.min(rect.width-18,clientX-rect.left)),
      y:Math.max(18,Math.min(rect.height-18,clientY-rect.top)),
      width:rect.width,
      height:rect.height
    };
  }

  function proteinY(){
    return stage.clientHeight/2;
  }

  function clampProteinX(x){
    return Math.max(48,Math.min(stage.clientWidth-48,x));
  }

  function elementMarkup(type){
    var item=catalogue[type];
    if(!item)return "";

    if(item.kind==="protein"){
      if(item.art==="pump"){
        return '<span class="protein-label">'+item.label+'</span><span class="protein-art pump-art"></span>';
      }
      if(item.art==="receptor"){
        return '<span class="protein-label">'+item.label+'</span><span class="protein-art receptor-art"></span>';
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

  function clearSelection(){
    if(selected)selected.classList.remove("is-selected");
    selected=null;
    removeButton.hidden=true;
    renderDefaultInfo();
  }

  function selectElement(el){
    if(selected&&selected!==el)selected.classList.remove("is-selected");
    selected=el;
    el.classList.add("is-selected");
    removeButton.hidden=false;
    renderInfo(el.dataset.type);
  }

  function renderDefaultInfo(){
    document.querySelector(".selection-index").textContent="01";
    document.getElementById("infoType").textContent="BICAMADA";
    document.getElementById("infoTitle").textContent="Fosfolipídios";
    document.getElementById("infoText").textContent="Cabeças hidrofílicas voltadas aos meios aquosos e caudas hidrofóbicas apontadas umas para as outras.";
  }

  function renderInfo(type){
    var item=catalogue[type];
    if(!item)return;
    document.querySelector(".selection-index").textContent="•";
    document.getElementById("infoType").textContent=item.category;
    document.getElementById("infoTitle").textContent=item.name;
    document.getElementById("infoText").textContent=item.text;
  }

  function createPlaced(type,kind,x,y){
    var item=catalogue[type];
    if(!item)return null;

    var el=document.createElement("div");
    el.className="placed-element "+(kind==="protein"?"placed-protein":"placed-molecule");
    el.dataset.type=type;
    el.dataset.kind=kind;
    el.dataset.id="mem-"+(++placedCount);
    el.innerHTML=elementMarkup(type);

    if(kind==="protein"){
      x=clampProteinX(x);
      y=proteinY();
    }

    el.style.left=x+"px";
    el.style.top=y+"px";

    el.addEventListener("pointerdown",beginMovePlaced);
    el.addEventListener("click",function(event){
      event.stopPropagation();
      selectElement(el);
    });
    el.addEventListener("mouseenter",function(){
      renderInfo(type);
    });
    el.addEventListener("mouseleave",function(){
      if(selected)renderInfo(selected.dataset.type);
      else renderDefaultInfo();
    });

    layer.appendChild(el);
    selectElement(el);
    updateCounter();
    return el;
  }

  function armTool(tool){
    document.querySelectorAll(".tool-item,.molecule-tool").forEach(function(node){
      node.classList.toggle("is-armed",node===tool);
    });

    armed={
      type:tool.dataset.type,
      kind:tool.dataset.kind
    };

    var item=catalogue[armed.type];
    armedText.textContent=item?item.name:"Item selecionado";
    armedHint.hidden=false;
  }

  function disarmTool(){
    armed=null;
    armedHint.hidden=true;
    document.querySelectorAll(".tool-item,.molecule-tool").forEach(function(node){
      node.classList.remove("is-armed");
    });
  }

  function beginMovePlaced(event){
    if(event.button!==undefined&&event.button!==0)return;
    event.preventDefault();
    event.stopPropagation();

    var el=event.currentTarget;
    selectElement(el);

    var point=stagePoint(event.clientX,event.clientY);
    var left=parseFloat(el.style.left)||point.x;
    var top=parseFloat(el.style.top)||point.y;

    moving={
      el:el,
      offsetX:point.x-left,
      offsetY:point.y-top,
      pointerId:event.pointerId
    };

    try{el.setPointerCapture(event.pointerId)}catch(_){}
  }

  function movePlaced(event){
    if(!moving)return;
    var point=stagePoint(event.clientX,event.clientY);
    var x=point.x-moving.offsetX;
    var y=point.y-moving.offsetY;

    if(moving.el.dataset.kind==="protein"){
      x=clampProteinX(x);
      y=proteinY();
    }

    moving.el.style.left=x+"px";
    moving.el.style.top=y+"px";
  }

  function endMovePlaced(event){
    if(!moving)return;
    try{moving.el.releasePointerCapture(moving.pointerId)}catch(_){}
    moving=null;
  }

  function ghostFor(tool){
    var node=document.createElement("div");
    node.className="drag-ghost";
    node.innerHTML=tool.dataset.kind==="protein"
      ? '<span class="tool-preview '+(tool.querySelector(".tool-preview")?tool.querySelector(".tool-preview").className.replace("tool-preview ",""):"")+'"></span>'
      : '<span class="placed-molecule" data-type="'+tool.dataset.type+'">'+catalogue[tool.dataset.type].label+'</span>';
    document.body.appendChild(node);
    return node;
  }

  function startTouchTool(event){
    if(event.pointerType==="mouse")return;
    event.preventDefault();

    var tool=event.currentTarget;
    armTool(tool);
    ghost=ghostFor(tool);
    ghost.style.left=event.clientX+"px";
    ghost.style.top=event.clientY+"px";

    dragPayload={type:tool.dataset.type,kind:tool.dataset.kind,pointerId:event.pointerId};
    try{tool.setPointerCapture(event.pointerId)}catch(_){}
  }

  function moveTouchTool(event){
    if(!dragPayload||event.pointerId!==dragPayload.pointerId)return;
    if(ghost){
      ghost.style.left=event.clientX+"px";
      ghost.style.top=event.clientY+"px";
    }

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
    stage.classList.remove("is-drop-target");
    dragPayload=null;
  }

  document.querySelectorAll(".tool-item,.molecule-tool").forEach(function(tool){
    tool.addEventListener("click",function(){
      if(armed&&armed.type===tool.dataset.type)disarmTool();
      else armTool(tool);
    });

    tool.addEventListener("dragstart",function(event){
      var data={type:tool.dataset.type,kind:tool.dataset.kind};
      event.dataTransfer.effectAllowed="copy";
      event.dataTransfer.setData("text/plain",JSON.stringify(data));
      armTool(tool);
    });

    tool.addEventListener("dragend",function(){
      stage.classList.remove("is-drop-target");
      disarmTool();
    });

    tool.addEventListener("pointerdown",startTouchTool);
    tool.addEventListener("pointermove",moveTouchTool);
    tool.addEventListener("pointerup",endTouchTool);
    tool.addEventListener("pointercancel",endTouchTool);
  });

  stage.addEventListener("dragover",function(event){
    event.preventDefault();
    stage.classList.add("is-drop-target");
    event.dataTransfer.dropEffect="copy";
  });

  stage.addEventListener("dragleave",function(event){
    if(!stage.contains(event.relatedTarget))stage.classList.remove("is-drop-target");
  });

  stage.addEventListener("drop",function(event){
    event.preventDefault();
    stage.classList.remove("is-drop-target");

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
      createPlaced(armed.type,armed.kind,point.x,point.y);
      disarmTool();
      return;
    }

    clearSelection();
  });

  window.addEventListener("pointermove",movePlaced);
  window.addEventListener("pointerup",endMovePlaced);
  window.addEventListener("pointercancel",endMovePlaced);

  clearButton.addEventListener("click",function(){
    layer.innerHTML="";
    placedCount=0;
    disarmTool();
    clearSelection();
    updateCounter();
  });

  removeButton.addEventListener("click",function(){
    if(!selected)return;
    selected.remove();
    selected=null;
    removeButton.hidden=true;
    renderDefaultInfo();
    updateCounter();
  });

  document.addEventListener("keydown",function(event){
    if((event.key==="Delete"||event.key==="Backspace")&&selected&&document.activeElement===document.body){
      selected.remove();
      selected=null;
      removeButton.hidden=true;
      renderDefaultInfo();
      updateCounter();
    }

    if(event.key==="Escape"){
      disarmTool();
      clearSelection();
    }
  });

  var resizeTimer=0;
  window.addEventListener("resize",function(){
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(function(){
      buildBilayer();

      layer.querySelectorAll('.placed-element[data-kind="protein"]').forEach(function(el){
        el.style.top=proteinY()+"px";
        el.style.left=clampProteinX(parseFloat(el.style.left)||stage.clientWidth/2)+"px";
      });
    },120);
  });

  async function loadUser(){
    try{
      var response=await fetch("/api/auth/me",{credentials:"same-origin"});
      if(response.status===401){location.href="/login.html";return}
      if(!response.ok)return;

      var data=await response.json();
      var user=data.usuario||{};
      var name=user.nome||"Usuário";
      var initial=name.charAt(0).toUpperCase();

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