(function(){
  "use strict";

  const details={
    bicamada:["ESTRUTURA","Bicamada fosfolipídica","Forma a barreira seletiva da célula. As cabeças hidrofílicas ficam voltadas para os meios aquosos e as caudas hidrofóbicas ficam no interior da bicamada."],
    canalNa:["CANAL IÔNICO","Canal de sódio (Na⁺)","Quando aberto, permite passagem seletiva de Na⁺ segundo o gradiente eletroquímico. A entrada de sódio tende a despolarizar a membrana."],
    bomba:["TRANSPORTE ATIVO","Bomba Na⁺/K⁺-ATPase","Usa ATP para transportar 3 Na⁺ para fora e 2 K⁺ para dentro, ajudando a manter os gradientes iônicos."],
    canalK:["CANAL IÔNICO","Canal de potássio (K⁺)","Permite fluxo seletivo de K⁺. A saída de potássio participa da repolarização e do potencial de repouso."],
    vazamento:["CANAL IÔNICO","Canal vazante","Permanece parcialmente aberto em repouso e permite fluxo passivo de íons. Canais vazantes de K⁺ ajudam a manter o potencial de repouso."],
    atp:["ENERGIA","ATP","Fornece energia para o transporte ativo da bomba Na⁺/K⁺."],
    adp:["ENERGIA","ADP + fosfato","São produtos da hidrólise do ATP durante o ciclo da bomba."]
  };

  const items=Array.from(document.querySelectorAll("[data-info]"));
  const workbench=document.querySelector(".membrane-workbench");

  function show(el){
    const data=details[el.dataset.info]||details.bicamada;
    items.forEach(function(item){item.classList.toggle("is-active",item===el);});
    if(workbench)workbench.classList.add("has-active");
    const type=document.getElementById("infoType");
    const title=document.getElementById("infoTitle");
    const text=document.getElementById("infoText");
    if(type)type.textContent=data[0];
    if(title)title.textContent=data[1];
    if(text)text.textContent=data[2];
    const index=document.querySelector(".info-index");
    if(index)index.textContent=String(items.indexOf(el)+1).padStart(2,"0");
  }

  items.forEach(function(el){
    ["mouseenter","focus","click"].forEach(function(evt){
      el.addEventListener(evt,function(){show(el);});
    });
  });

  async function loadUser(){
    try{
      const response=await fetch("/api/auth/me",{credentials:"same-origin"});
      if(response.status===401){location.href="/login.html";return;}
      if(!response.ok)return;
      const data=await response.json();
      const user=data.usuario||{};
      const name=user.nome||"Usuário";
      const initial=name.charAt(0).toUpperCase();
      const nameSidebar=document.getElementById("nomeSidebar");
      const emailSidebar=document.getElementById("emailSidebar");
      const nameHeader=document.getElementById("nomeHeader");
      const avatarSidebar=document.getElementById("avatarSidebar");
      const avatarHeader=document.getElementById("avatarHeader");
      if(nameSidebar)nameSidebar.textContent=name;
      if(emailSidebar)emailSidebar.textContent=user.email||"";
      if(nameHeader)nameHeader.textContent=name;
      if(avatarSidebar)avatarSidebar.textContent=initial;
      if(avatarHeader)avatarHeader.textContent=initial;
    }catch(error){}
  }

  const logout=document.getElementById("logoutSidebar");
  if(logout){
    logout.addEventListener("click",async function(){
      try{await fetch("/api/auth/logout",{method:"POST",credentials:"same-origin"});}
      finally{location.href="/login.html";}
    });
  }

  loadUser();
})();