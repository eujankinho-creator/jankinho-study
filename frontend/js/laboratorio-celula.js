// Comparador visual da membrana plasmática - Cortex
(function(){
  "use strict";

  function $(id){return document.getElementById(id);}
  function clamp(v,min,max){return Math.min(Math.max(v,min),max);}

  function fitCanvas(canvas){
    var dpr=window.devicePixelRatio||1;
    var rect=canvas.getBoundingClientRect();
    var w=Math.max(1,Math.round(rect.width*dpr));
    var h=Math.max(1,Math.round(rect.height*dpr));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    return {ctx:canvas.getContext("2d"),dpr:dpr,w:w/dpr,h:h/dpr};
  }

  function drawTail(ctx,x,y,angle,len,sway,color,width){
    var x1=x+Math.cos(angle)*len*.46;
    var y1=y+Math.sin(angle)*len*.46;
    var x2=x+Math.cos(angle)*len+Math.cos(angle+Math.PI/2)*sway;
    var y2=y+Math.sin(angle)*len+Math.sin(angle+Math.PI/2)*sway;
    ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x1,y1,x2,y2);
    ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap="round";ctx.stroke();
  }

  function drawHead(ctx,x,y,r,style){
    ctx.save();
    if(style==="premium"){
      var g=ctx.createRadialGradient(x-r*.35,y-r*.4,1,x,y,r);
      g.addColorStop(0,"rgba(255,255,255,.96)");
      g.addColorStop(.28,"rgba(189,220,255,.95)");
      g.addColorStop(.72,"rgba(107,137,255,.82)");
      g.addColorStop(1,"rgba(31,48,94,.92)");
      ctx.shadowColor="rgba(120,157,255,.28)";ctx.shadowBlur=8;ctx.fillStyle=g;
    }else{
      var g2=ctx.createRadialGradient(x-r*.35,y-r*.4,1,x,y,r);
      g2.addColorStop(0,"rgba(255,255,255,.98)");
      g2.addColorStop(.22,"rgba(180,239,255,.96)");
      g2.addColorStop(.58,"rgba(58,184,217,.88)");
      g2.addColorStop(1,"rgba(19,69,91,.94)");
      ctx.shadowColor="rgba(89,211,246,.28)";ctx.shadowBlur=9;ctx.fillStyle=g2;
    }
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;ctx.strokeStyle=style==="premium"?"rgba(180,203,255,.38)":"rgba(121,227,255,.42)";
    ctx.lineWidth=.8;ctx.stroke();ctx.restore();
  }

  function drawMembrane(canvas,mode,time){
    var s=fitCanvas(canvas),ctx=s.ctx,w=s.w,h=s.h;ctx.save();ctx.scale(s.dpr,s.dpr);ctx.clearRect(0,0,w,h);
    var cx=w*.5,cy=h*.91,base=Math.min(w*.44,h*.72);
    var outer=base,inner=base-34;
    var count=mode==="premium"?34:38;
    var headR=mode==="premium"?6.4:6.8;
    var tailLen=mode==="premium"?17:19;
    var start=Math.PI*1.08,end=Math.PI*1.92;

    ctx.save();
    ctx.beginPath();ctx.arc(cx,cy,outer+13,start,end);
    ctx.strokeStyle=mode==="premium"?"rgba(120,150,255,.055)":"rgba(91,214,244,.06)";
    ctx.lineWidth=28;ctx.shadowColor=mode==="premium"?"rgba(110,140,255,.15)":"rgba(74,205,235,.13)";
    ctx.shadowBlur=26;ctx.stroke();ctx.restore();

    for(var i=0;i<count;i++){
      var t=i/(count-1),a=start+(end-start)*t;
      var wave=Math.sin(time*.0014+i*.72)*(mode==="premium"?1.15:2.05);
      var micro=Math.sin(time*.0021+i*.37)*(mode==="premium"?.55:1.05);
      var ro=outer+wave;
      var ri=inner-wave*.55;
      var ox=cx+Math.cos(a)*ro,oy=cy+Math.sin(a)*ro;
      var ix=cx+Math.cos(a)*ri,iy=cy+Math.sin(a)*ri;

      var inward=a+Math.PI;
      var outward=a;
      var sway1=Math.sin(time*.002+i*.8)*(mode==="premium"?1.7:3.1)+micro;
      var sway2=Math.sin(time*.0018+i*.83+1.5)*(mode==="premium"?1.5:2.8)-micro;

      drawTail(ctx,ox+Math.cos(inward)*headR*.55,oy+Math.sin(inward)*headR*.55,inward-.07,tailLen,sway1,
        mode==="premium"?"rgba(122,145,209,.34)":"rgba(84,167,183,.38)",mode==="premium"?1.2:1.4);
      drawTail(ctx,ox+Math.cos(inward)*headR*.55,oy+Math.sin(inward)*headR*.55,inward+.07,tailLen,-sway1,
        mode==="premium"?"rgba(122,145,209,.28)":"rgba(84,167,183,.31)",mode==="premium"?1.1:1.25);

      drawTail(ctx,ix+Math.cos(outward)*headR*.55,iy+Math.sin(outward)*headR*.55,outward-.07,tailLen,sway2,
        mode==="premium"?"rgba(122,145,209,.34)":"rgba(84,167,183,.38)",mode==="premium"?1.2:1.4);
      drawTail(ctx,ix+Math.cos(outward)*headR*.55,iy+Math.sin(outward)*headR*.55,outward+.07,tailLen,-sway2,
        mode==="premium"?"rgba(122,145,209,.28)":"rgba(84,167,183,.31)",mode==="premium"?1.1:1.25);

      drawHead(ctx,ox,oy,headR,mode);
      drawHead(ctx,ix,iy,headR,mode);
    }

    if(mode==="premium"){
      ctx.save();ctx.globalAlpha=.35;
      var shine=ctx.createLinearGradient(w*.18,0,w*.82,0);
      shine.addColorStop(0,"rgba(255,255,255,0)");shine.addColorStop(.5,"rgba(207,220,255,.16)");shine.addColorStop(1,"rgba(255,255,255,0)");
      ctx.beginPath();ctx.arc(cx,cy,outer+1,start+.2,end-.25);ctx.strokeStyle=shine;ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
    }else{
      ctx.save();ctx.globalAlpha=.42;
      for(var j=0;j<10;j++){
        var pa=start+.15+(end-start-.3)*(j/9);
        var pr=(outer+inner)/2+Math.sin(time*.001+j)*4;
        var px=cx+Math.cos(pa)*pr,py=cy+Math.sin(pa)*pr;
        ctx.beginPath();ctx.arc(px,py,1.15,0,Math.PI*2);ctx.fillStyle="rgba(183,240,255,.42)";ctx.fill();
      }
      ctx.restore();
    }

    ctx.restore();
  }

  function animate(now){
    var a=$("membraneA"),b=$("membraneB");
    if(a)drawMembrane(a,"premium",now);
    if(b)drawMembrane(b,"organic",now);
    requestAnimationFrame(animate);
  }

  function choose(model){
    document.querySelectorAll(".membrane-model").forEach(function(card){
      card.classList.toggle("selected",card.dataset.model===model);
      var btn=card.querySelector(".choose-model");
      if(btn)btn.textContent=card.dataset.model===model?"Selecionado":"Escolher este";
    });
  }

  document.querySelectorAll(".choose-model").forEach(function(btn){
    btn.addEventListener("click",function(){choose(this.closest(".membrane-model").dataset.model);});
  });

  async function loadUser(){
    try{
      var response=await fetch("/api/auth/me",{credentials:"same-origin"});
      if(response.status===401){location.href="/login.html";return;}
      if(!response.ok)return;
      var data=await response.json(),user=data.usuario||{},name=user.nome||"Usuário",initial=name.charAt(0).toUpperCase();
      $("nomeSidebar").textContent=name;$("emailSidebar").textContent=user.email||"";
      $("nomeHeader").textContent=name;$("avatarSidebar").textContent=initial;$("avatarHeader").textContent=initial;
    }catch(e){}
  }

  $("logoutSidebar").addEventListener("click",async function(){
    try{await fetch("/api/auth/logout",{method:"POST",credentials:"same-origin"});}
    finally{location.href="/login.html";}
  });

  window.addEventListener("resize",function(){});
  loadUser();requestAnimationFrame(animate);
})();