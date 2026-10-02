
(function () {
  "use strict";

  const get = function (id) {
    return document.getElementById(id);
  };

  const root = get("ecgLearningLab");

  if (!root) {
    return;
  }


  async function loadCurrentUser() {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "same-origin"
      });

      if (response.status === 401) {
        location.href = "/login.html";
        return;
      }

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      const user = data.usuario || {};
      const name = user.nome || "Usuário";
      const initial = name.charAt(0).toUpperCase();

      if (get("nomeSidebar")) get("nomeSidebar").textContent = name;
      if (get("emailSidebar")) get("emailSidebar").textContent = user.email || "";
      if (get("nomeHeader")) get("nomeHeader").textContent = name;
      if (get("avatarSidebar")) get("avatarSidebar").textContent = initial;
      if (get("avatarHeader")) get("avatarHeader").textContent = initial;
    }
    catch (error) {
      console.error("Falha ao carregar usuário do laboratório:", error);
    }
  }

  async function logoutLaboratory() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin"
      });
    }
    finally {
      location.href = "/login.html";
    }
  }

  const LEADS = [
    ["I","limb",.72,1],
    ["II","limb",1,1],
    ["III","limb",.76,1],
    ["aVR","limb",.72,-1],
    ["aVL","limb",.55,1],
    ["aVF","limb",.86,1],
    ["V1","chest",.72,-.55],
    ["V2","chest",.82,-.25],
    ["V3","chest",.92,.15],
    ["V4","chest",1.02,.70],
    ["V5","chest",1,.95],
    ["V6","chest",.88,.90],
    ["V7","posterior",.72,.78],
    ["V8","posterior",.64,.72],
    ["V9","posterior",.58,.66],
    ["V3R","right",.70,-.35],
    ["V4R","right",.75,-.18],
    ["V5R","right",.68,.04],
    ["V6R","right",.60,.12]
  ].map(function (item) {
    return {
      id: item[0],
      group: item[1],
      scale: item[2],
      polarity: item[3]
    };
  });

  const CORE = new Set([
    "I","II","III","aVR","aVL","aVF",
    "V1","V2","V3","V4","V5","V6"
  ]);

  const PHASES = [
    {
      index:"00", min:0, max:.05,
      title:"Linha de base — repouso elétrico",
      category:"DIÁSTOLE ELÉTRICA",
      short:"Repouso elétrico",
      vector:"Sem vetor dominante",
      description:"Entre os ciclos não há um vetor cardíaco dominante e o traçado retorna à linha isoelétrica.",
      glow:[0,.18,.05], vector3d:[0,.10,0]
    },
    {
      index:"01", min:.05, max:.12,
      title:"Onda P — despolarização atrial",
      category:"ATIVAÇÃO ATRIAL",
      short:"Onda P",
      vector:"Átrios → nó AV",
      description:"O impulso parte do nó sinusal e se propaga pelos átrios. A onda P representa essa despolarização atrial.",
      glow:[.05,.88,.05], vector3d:[.25,-.34,.05]
    },
    {
      index:"02", min:.12, max:.18,
      title:"Segmento PR — condução pelo nó AV",
      category:"CONDUÇÃO ATRIOVENTRICULAR",
      short:"Segmento PR",
      vector:"Atraso fisiológico no nó AV",
      description:"A condução desacelera no nó AV antes de alcançar o sistema His–Purkinje, favorecendo o enchimento ventricular.",
      glow:[.02,.42,.02], vector3d:[.02,-.50,.02]
    },
    {
      index:"03", min:.18, max:.225,
      title:"Início do QRS — ativação septal",
      category:"DESPOLARIZAÇÃO VENTRICULAR",
      short:"QRS septal",
      vector:"Septo: esquerda → direita",
      description:"O septo interventricular é ativado primeiro. O vetor inicial se desloca da esquerda para a direita antes de a massa ventricular dominar o QRS.",
      glow:[.04,.05,.03], vector3d:[.62,-.08,.05]
    },
    {
      index:"04", min:.225, max:.29,
      title:"QRS — ativação da massa ventricular",
      category:"DESPOLARIZAÇÃO VENTRICULAR",
      short:"QRS principal",
      vector:"Base/septo → ápice e parede livre",
      description:"A maior massa do ventrículo esquerdo domina o vetor. A ativação percorre rapidamente o miocárdio pelo sistema de Purkinje.",
      glow:[-.20,-.45,.10], vector3d:[-.72,-.92,.12]
    },
    {
      index:"05", min:.29, max:.36,
      title:"Fim do QRS — regiões basais",
      category:"FINAL DA DESPOLARIZAÇÃO",
      short:"Fim do QRS",
      vector:"Últimas forças ventriculares",
      description:"As últimas regiões ventriculares são ativadas e o vetor líquido diminui, encerrando o complexo QRS.",
      glow:[-.10,.28,-.10], vector3d:[-.26,.55,-.12]
    },
    {
      index:"06", min:.36, max:.44,
      title:"Segmento ST — ventrículos despolarizados",
      category:"PLATÔ ELÉTRICO",
      short:"Segmento ST",
      vector:"Pouco vetor líquido",
      description:"Grande parte do miocárdio ventricular está despolarizada ao mesmo tempo, produzindo pouco vetor líquido.",
      glow:[0,-.20,0], vector3d:[.05,0,0]
    },
    {
      index:"07", min:.44, max:.58,
      title:"Onda T — repolarização ventricular",
      category:"REPOLARIZAÇÃO VENTRICULAR",
      short:"Onda T",
      vector:"Repolarização ventricular",
      description:"A repolarização ventricular gera a onda T. O coração e o traçado mostram juntos a recuperação elétrica.",
      glow:[-.28,-.32,.02], vector3d:[-.50,-.60,.08]
    },
    {
      index:"08", min:.58, max:.68,
      title:"Fim da onda T — recuperação elétrica",
      category:"RECUPERAÇÃO",
      short:"Fim da T",
      vector:"Vetor reduzindo",
      description:"A repolarização se completa progressivamente e o vetor líquido retorna a valores mínimos.",
      glow:[0,-.05,0], vector3d:[-.10,-.12,.02]
    },
    {
      index:"09", min:.68, max:1.01,
      title:"Intervalo TP — preparação para novo ciclo",
      category:"LINHA ISOELÉTRICA",
      short:"Intervalo TP",
      vector:"Sem vetor dominante",
      description:"O coração permanece eletricamente em repouso até o próximo disparo sinusal, quando o ciclo recomeça.",
      glow:[0,.08,0], vector3d:[0,0,0]
    }
  ];

  const GUIDED = [
    ["0","Ritmo e frequência","Regularidade, relação P–QRS e frequência.",.03],
    ["1","Onda P","Morfologia e sequência da ativação atrial.",.08],
    ["2","Intervalo PR","Tempo de condução atrioventricular.",.15],
    ["3","QRS septal","Vetor inicial de ativação do septo.",.20],
    ["4","QRS principal","Massa ventricular dominante.",.25],
    ["5","Eixo elétrico","Relacione o vetor com I, II, aVF e demais derivações.",.28],
    ["6","Segmento ST","Compare o ST com a linha isoelétrica.",.39],
    ["7","Onda T","Observe a repolarização ventricular.",.50],
    ["8","QT / QTc","Despolarização + repolarização ventriculares.",.57],
    ["9","Revisão global","Releia o traçado completo sistematicamente.",.73]
  ];

  const PATTERNS = [
    {
      id:"sinus", name:"Ritmo sinusal", caption:"Referência didática",
      description:"P antes de cada QRS, intervalos regulares e progressão precordial preservada no modelo didático.",
      bpm:72, tags:["P presente","QRS estreito","Regular"]
    },
    {
      id:"brady", name:"Bradicardia sinusal", caption:"Frequência reduzida",
      description:"Mantém a sequência sinusal, porém com maior intervalo entre os ciclos cardíacos.",
      bpm:48, tags:["P presente","FC baixa","Regular"]
    },
    {
      id:"tachy", name:"Taquicardia sinusal", caption:"Frequência elevada",
      description:"Ritmo sinusal com ciclos mais próximos entre si e menor intervalo diastólico.",
      bpm:118, tags:["P presente","FC alta","Regular"]
    },
    {
      id:"af", name:"Fibrilação atrial", caption:"Ritmo irregular",
      description:"Modelo visual com ausência de P organizada e irregularidade entre os complexos QRS.",
      bpm:96, tags:["Sem P organizada","RR irregular","Fibrilação"]
    },
    {
      id:"av1", name:"BAV de 1º grau", caption:"PR prolongado",
      description:"Cada onda P conduz ao QRS, porém o intervalo PR está prolongado no modelo.",
      bpm:68, tags:["PR prolongado","1:1","QRS após P"]
    },
    {
      id:"rbbb", name:"Bloqueio de ramo D", caption:"QRS alargado",
      description:"Atraso didático da ativação ventricular direita, com QRS mais largo e componente terminal em V1.",
      bpm:72, tags:["QRS largo","V1 terminal","Condução"]
    },
    {
      id:"stemi", name:"Elevação do ST", caption:"Alteração de ST",
      description:"Padrão educacional simplificado de elevação do ST em derivações anteriores para treinamento visual.",
      bpm:78, tags:["ST elevado","V2–V4","Padrão didático"]
    },
    {
      id:"hyperk", name:"Hipercalemia", caption:"T apiculada",
      description:"Modelo com ondas T mais altas e estreitas, usado para reconhecer alterações de repolarização associadas ao potássio.",
      bpm:70, tags:["T apiculada","Repolarização","Eletrólitos"]
    }
  ];

  const ELECTRODES = {
    RA:"Eletrodo do membro superior direito. Participa da construção das derivações do plano frontal.",
    LA:"Eletrodo do membro superior esquerdo. Participa de I, III e das derivações aumentadas.",
    RL:"Eletrodo de referência/terra no membro inferior direito.",
    LL:"Eletrodo do membro inferior esquerdo. Participa de II, III e aVF.",
    V1:"4º espaço intercostal direito, junto ao esterno. Observa principalmente septo e ventrículo direito.",
    V2:"4º espaço intercostal esquerdo, junto ao esterno. Explora a região septal.",
    V3:"Posicionado entre V2 e V4. Participa da zona de transição precordial.",
    V4:"5º espaço intercostal na linha hemiclavicular esquerda. Parede anterior.",
    V5:"Mesmo nível horizontal de V4, linha axilar anterior. Parede lateral.",
    V6:"Mesmo nível de V4/V5, linha axilar média. Parede lateral.",
    V7:"Extensão posterior no mesmo nível horizontal de V6, linha axilar posterior.",
    V8:"Extensão posterior no mesmo nível de V6, em direção à região escapular.",
    V9:"Extensão posterior mais medial no mesmo plano horizontal.",
    V3R:"Posição direita espelhada de V3.",
    V4R:"Derivação direita importante para observar o ventrículo direito.",
    V5R:"Extensão lateral direita da sequência precordial.",
    V6R:"Extensão direita em linha axilar média."
  };

  const state = {
    running:false,
    phase:.20,
    lastFrame:performance.now(),
    yaw:-.35,
    pitch:.12,
    zoom:1,
    sectioned:false,
    pattern:"sinus",
    selected:new Set(LEADS.map(function (lead) { return lead.id; })),
    dragging:false,
    dragX:0,
    dragY:0
  };

  function clamp(value,min,max) {
    return Math.min(Math.max(value,min),max);
  }

  function wrap(value) {
    value=value%1;
    return value<0 ? value+1 : value;
  }

  function currentPattern() {
    return PATTERNS.find(function (item) {
      return item.id===state.pattern;
    }) || PATTERNS[0];
  }

  function phaseInfo(value) {
    const p=wrap(value);
    return PHASES.find(function (item) {
      return p>=item.min && p<item.max;
    }) || PHASES[0];
  }

  function canvasSize(canvas,forcedCssHeight) {
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const rect=canvas.getBoundingClientRect();
    const cssWidth=Math.max(1,rect.width);
    const cssHeight=Math.max(1,forcedCssHeight||rect.height||360);
    const width=Math.round(cssWidth*dpr);
    const height=Math.round(cssHeight*dpr);

    if(canvas.width!==width || canvas.height!==height) {
      canvas.width=width;
      canvas.height=height;
    }

    return {dpr:dpr,width:width,height:height,cssWidth:cssWidth,cssHeight:cssHeight};
  }

  function rotate(point) {
    let x=point[0], y=point[1], z=point[2];

    const cy=Math.cos(state.yaw);
    const sy=Math.sin(state.yaw);
    const x1=x*cy-z*sy;
    const z1=x*sy+z*cy;
    x=x1; z=z1;

    const cp=Math.cos(state.pitch);
    const sp=Math.sin(state.pitch);
    const y1=y*cp-z*sp;
    const z2=y*sp+z*cp;

    return [x,y1,z2];
  }

  function project(point,size,scale) {
    const p=rotate(point);
    const perspective=4.2/(4.2+p[2]);

    return {
      x:size.cssWidth*.5+p[0]*scale*perspective,
      y:size.cssHeight*.49-p[1]*scale*perspective,
      z:p[2],
      rx:p[0],
      ry:p[1],
      rz:p[2]
    };
  }

  function heartMesh() {
    const rows=25;
    const cols=36;
    const vertices=[];
    const faces=[];

    for(let i=0;i<=rows;i+=1) {
      const t=i/rows;
      const theta=Math.PI*t;
      const radial=Math.pow(Math.sin(theta),.73);
      const y=1.08-2.42*t;

      for(let j=0;j<=cols;j+=1) {
        const phi=Math.PI*2*j/cols;
        const front=1+.12*Math.cos(phi-.35);
        const lateral=1+.08*Math.cos(2*phi)*(1-t);
        const taper=.98-.18*t;
        let x=.95*radial*front*lateral*Math.cos(phi)*taper-.08;
        let z=.76*radial*(1+.06*Math.sin(phi))*Math.sin(phi)*taper+.04;

        if(t<.23) {
          x+=.08*Math.sin(2*phi)*(.23-t)/.23;
        }

        vertices.push([x,y,z]);
      }
    }

    for(let i=0;i<rows;i+=1) {
      for(let j=0;j<cols;j+=1) {
        const a=i*(cols+1)+j;
        const b=a+1;
        const c=a+(cols+1);
        const d=c+1;
        faces.push([a,c,b],[b,c,d]);
      }
    }

    return {vertices:vertices,faces:faces};
  }

  function ellipsoid(cx,cy,cz,rx,ry,rz,rows,cols) {
    const vertices=[];
    const faces=[];

    for(let i=0;i<=rows;i+=1) {
      const theta=Math.PI*i/rows;
      const st=Math.sin(theta);

      for(let j=0;j<=cols;j+=1) {
        const phi=Math.PI*2*j/cols;
        vertices.push([
          cx+rx*st*Math.cos(phi),
          cy+ry*Math.cos(theta),
          cz+rz*st*Math.sin(phi)
        ]);
      }
    }

    for(let i=0;i<rows;i+=1) {
      for(let j=0;j<cols;j+=1) {
        const a=i*(cols+1)+j;
        const b=a+1;
        const c=a+(cols+1);
        const d=c+1;
        faces.push([a,c,b],[b,c,d]);
      }
    }

    return {vertices:vertices,faces:faces};
  }

  const meshes = {
    ventricle:heartMesh(),
    leftAtrium:ellipsoid(-.48,.92,.03,.47,.39,.39,12,18),
    rightAtrium:ellipsoid(.44,.88,-.03,.43,.37,.37,12,18),
    inner:ellipsoid(-.12,-.18,.02,.48,.75,.38,12,18)
  };

  function shade(base,light) {
    return "rgb("+
      clamp(Math.round(base[0]*light),0,255)+","+
      clamp(Math.round(base[1]*light),0,255)+","+
      clamp(Math.round(base[2]*light),0,255)+")";
  }

  function drawMesh(ctx,mesh,size,base,alpha,cut) {
    const scale=120*state.zoom;
    const projected=mesh.vertices.map(function (point) {
      return project(point,size,scale);
    });

    const triangles=[];

    mesh.faces.forEach(function (face) {
      const a=projected[face[0]];
      const b=projected[face[1]];
      const c=projected[face[2]];
      const avgX=(a.rx+b.rx+c.rx)/3;

      if(cut && avgX>.10) {
        return;
      }

      const ux=b.rx-a.rx, uy=b.ry-a.ry, uz=b.rz-a.rz;
      const vx=c.rx-a.rx, vy=c.ry-a.ry, vz=c.rz-a.rz;
      const nx=uy*vz-uz*vy;
      const ny=uz*vx-ux*vz;
      const nz=ux*vy-uy*vx;
      const len=Math.sqrt(nx*nx+ny*ny+nz*nz)||1;
      const dot=(nx*-.35+ny*.68+nz*-.45)/len;
      const light=clamp(.58+.31*dot+.08*((a.rz+b.rz+c.rz)/3+1)/2,.37,1.13);

      triangles.push({
        a:a,b:b,c:c,
        z:(a.z+b.z+c.z)/3,
        fill:shade(base,light)
      });
    });

    triangles.sort(function (one,two) {
      return two.z-one.z;
    });

    ctx.save();
    ctx.globalAlpha=alpha;

    triangles.forEach(function (tri) {
      ctx.beginPath();
      ctx.moveTo(tri.a.x,tri.a.y);
      ctx.lineTo(tri.b.x,tri.b.y);
      ctx.lineTo(tri.c.x,tri.c.y);
      ctx.closePath();
      ctx.fillStyle=tri.fill;
      ctx.fill();
    });

    ctx.restore();
  }

  function drawVessel(ctx,size,from,to,width,color) {
    const scale=120*state.zoom;
    const a=project(from,size,scale);
    const b=project(to,size,scale);

    ctx.save();
    ctx.lineCap="round";
    ctx.strokeStyle=color;
    ctx.lineWidth=width*state.zoom;
    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.stroke();

    ctx.strokeStyle="rgba(255,255,255,.12)";
    ctx.lineWidth=Math.max(1,width*.13);
    ctx.beginPath();
    ctx.moveTo(a.x-width*.12,a.y);
    ctx.lineTo(b.x-width*.12,b.y);
    ctx.stroke();
    ctx.restore();
  }

  function drawRing(ctx,size,plane,color,labels) {
    const scale=120*state.zoom;
    const pts=[];

    for(let i=0;i<=90;i+=1) {
      const a=Math.PI*2*i/90;
      const point=plane==="frontal"
        ? [2.04*Math.cos(a),2.04*Math.sin(a),0]
        : [2.08*Math.cos(a),0,2.08*Math.sin(a)];

      pts.push(project(point,size,scale));
    }

    ctx.save();
    ctx.strokeStyle=color;
    ctx.lineWidth=1;
    ctx.setLineDash([5,6]);
    ctx.beginPath();
    pts.forEach(function (p,index) {
      if(index===0) ctx.moveTo(p.x,p.y);
      else ctx.lineTo(p.x,p.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    labels.forEach(function (item) {
      const point=plane==="frontal"
        ? [2.22*Math.cos(item.angle),2.22*Math.sin(item.angle),0]
        : [2.24*Math.cos(item.angle),0,2.24*Math.sin(item.angle)];

      const p=project(point,size,scale);
      ctx.fillStyle=item.color||color;
      ctx.font="700 8px system-ui, sans-serif";
      ctx.textAlign="center";
      ctx.textBaseline="middle";
      ctx.fillText(item.label,p.x,p.y);
    });

    ctx.restore();
  }

  function drawArrow(ctx,size,vector) {
    const scale=120*state.zoom;
    const a=project([0,-.02,0],size,scale);
    const b=project(vector,size,scale);
    const angle=Math.atan2(b.y-a.y,b.x-a.x);

    ctx.save();
    ctx.strokeStyle="#facc15";
    ctx.fillStyle="#facc15";
    ctx.lineWidth=2;
    ctx.shadowColor="rgba(250,204,21,.55)";
    ctx.shadowBlur=8;
    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(b.x,b.y);
    ctx.lineTo(b.x-8*Math.cos(angle-Math.PI/6),b.y-8*Math.sin(angle-Math.PI/6));
    ctx.lineTo(b.x-8*Math.cos(angle+Math.PI/6),b.y-8*Math.sin(angle+Math.PI/6));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawActivation(ctx,size,point) {
    const p=project(point,size,120*state.zoom);
    const pulse=18+4*Math.sin(performance.now()/150);
    const gradient=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,pulse);

    gradient.addColorStop(0,"rgba(255,247,165,.95)");
    gradient.addColorStop(.25,"rgba(250,204,21,.65)");
    gradient.addColorStop(1,"rgba(250,204,21,0)");

    ctx.save();
    ctx.fillStyle=gradient;
    ctx.beginPath();
    ctx.arc(p.x,p.y,pulse,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle="#fff2a1";
    ctx.beginPath();
    ctx.arc(p.x,p.y,3,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  function drawHeart() {
    const canvas=get("ecgHeartCanvas");

    if(!canvas || root.hidden) {
      return;
    }

    const size=canvasSize(canvas);
    const ctx=canvas.getContext("2d");
    const info=phaseInfo(state.phase);

    ctx.clearRect(0,0,size.width,size.height);
    ctx.save();
    ctx.scale(size.dpr,size.dpr);

    drawRing(ctx,size,"frontal","rgba(96,165,250,.42)",[
      {label:"I",angle:0},
      {label:"aVL",angle:-.72},
      {label:"II",angle:-1.08},
      {label:"aVF",angle:-1.55},
      {label:"III",angle:-2.10},
      {label:"aVR",angle:2.52}
    ]);

    drawRing(ctx,size,"horizontal","rgba(192,132,252,.40)",[
      {label:"V1",angle:2.65},
      {label:"V2",angle:2.25},
      {label:"V3",angle:1.82},
      {label:"V4",angle:1.38},
      {label:"V5",angle:.88},
      {label:"V6",angle:.40},
      {label:"V7",angle:.08,color:"#c084fc"},
      {label:"V8",angle:-.25,color:"#c084fc"},
      {label:"V9",angle:-.55,color:"#c084fc"},
      {label:"V4R",angle:-2.35,color:"#fb7185"}
    ]);

    if(state.sectioned) {
      drawMesh(ctx,meshes.inner,size,[92,22,31],.95,false);
    }

    drawMesh(ctx,meshes.ventricle,size,[174,39,49],1,state.sectioned);
    drawMesh(ctx,meshes.leftAtrium,size,[194,52,61],.98,state.sectioned);
    drawMesh(ctx,meshes.rightAtrium,size,[148,30,42],.98,state.sectioned);

    drawVessel(ctx,size,[-.33,1.05,.02],[-.36,1.90,.02],17,"#a22d3a");
    drawVessel(ctx,size,[.15,1.05,-.04],[.12,1.82,-.04],13,"#7f2231");
    drawVessel(ctx,size,[.05,1.12,.10],[.72,1.62,.18],11,"#713042");
    drawVessel(ctx,size,[.40,1.05,-.05],[.82,1.44,-.38],9,"#66303f");

    drawActivation(ctx,size,info.glow);
    drawArrow(ctx,size,info.vector3d);

    ctx.restore();
  }

  function gaussian(x,center,width,amplitude) {
    const d=(x-center)/width;
    return amplitude*Math.exp(-d*d);
  }

  function noise(value) {
    return Math.sin(value*93.731+17.17)*.5+
      Math.sin(value*37.19)*.25;
  }

  function wave(cycle,lead,rowSeed) {
    const pattern=currentPattern();
    const pol=lead.polarity;
    const amp=lead.scale;
    let value=0;
    let qrs=.225;

    if(pattern.id==="av1") {
      qrs=.285;
    }

    if(pattern.id!=="af") {
      value+=gaussian(cycle,.09,.032,.18*amp*(pol<0?-.65:1));
    }
    else {
      value+=.035*noise(cycle*35+rowSeed);
      value+=.020*Math.sin(cycle*Math.PI*16+rowSeed);
    }

    const qWidth=pattern.id==="rbbb"?.022:.012;
    const rWidth=pattern.id==="rbbb"?.026:.014;
    const sWidth=pattern.id==="rbbb"?.030:.016;

    value+=gaussian(cycle,qrs-.024,qWidth,-.20*amp);
    value+=gaussian(cycle,qrs,rWidth,1.08*amp*pol);
    value+=gaussian(cycle,qrs+.025,sWidth,-.42*amp*(pol>=0?1:-.65));

    if(pattern.id==="rbbb" && lead.id==="V1") {
      value+=gaussian(cycle,qrs+.062,.022,.68*amp);
    }

    if(pattern.id==="stemi" && ["V2","V3","V4"].indexOf(lead.id)!==-1) {
      value+=gaussian(cycle,.35,.075,.20);
      value+=gaussian(cycle,.41,.06,.12);
    }

    let tAmp=.34*amp*(pol<-.5?-.6:1);
    let tWidth=.070;

    if(pattern.id==="hyperk") {
      tAmp=.72*amp;
      tWidth=.038;
    }

    value+=gaussian(cycle,.50,tWidth,tAmp);

    return value;
  }

  function drawTraceGrid(ctx,size,rowHeight) {
    const step=8*size.dpr;

    ctx.save();
    ctx.lineWidth=1;

    for(let x=0;x<=size.width;x+=step) {
      const major=Math.round(x/step)%5===0;
      ctx.strokeStyle=major?"rgba(54,145,86,.16)":"rgba(54,145,86,.06)";
      ctx.beginPath();
      ctx.moveTo(x,0);
      ctx.lineTo(x,size.height);
      ctx.stroke();
    }

    for(let y=0;y<=size.height;y+=step) {
      const major=Math.round(y/step)%5===0;
      ctx.strokeStyle=major?"rgba(54,145,86,.16)":"rgba(54,145,86,.06)";
      ctx.beginPath();
      ctx.moveTo(0,y);
      ctx.lineTo(size.width,y);
      ctx.stroke();
    }

    for(let y=rowHeight;y<size.height;y+=rowHeight) {
      ctx.strokeStyle="rgba(255,255,255,.045)";
      ctx.beginPath();
      ctx.moveTo(0,y);
      ctx.lineTo(size.width,y);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawTrace() {
    const canvas=get("ecgTutorCanvas");

    if(!canvas || root.hidden) {
      return;
    }

    const selected=LEADS.filter(function (lead) {
      return state.selected.has(lead.id);
    });

    const rowCss=36;
    const cssHeight=Math.max(320,selected.length*rowCss);
    canvas.style.height=cssHeight+"px";

    const size=canvasSize(canvas,cssHeight);
    const ctx=canvas.getContext("2d");
    const rowHeight=rowCss*size.dpr;

    ctx.clearRect(0,0,size.width,size.height);
    ctx.fillStyle="#030605";
    ctx.fillRect(0,0,size.width,size.height);

    drawTraceGrid(ctx,size,rowHeight);

    selected.forEach(function (lead,row) {
      const center=row*rowHeight+rowHeight*.53;
      const pad=40*size.dpr;
      const usable=size.width-pad-7*size.dpr;

      ctx.save();
      ctx.fillStyle=lead.group==="right"?"#fb7185":
        lead.group==="posterior"?"#c084fc":"#72e596";
      ctx.font=(7*size.dpr)+"px system-ui,sans-serif";
      ctx.textBaseline="middle";
      ctx.fillText(lead.id,9*size.dpr,center);

      ctx.beginPath();
      const points=Math.max(360,Math.floor(usable/(2*size.dpr)));

      for(let i=0;i<points;i+=1) {
        const normalized=i/(points-1);
        const cycles=2.7;
        let cycle=wrap(normalized*cycles+state.phase);

        if(currentPattern().id==="af") {
          cycle=wrap(cycle+.014*Math.sin(normalized*21+row*.7));
        }

        const value=wave(cycle,lead,row);
        const x=pad+normalized*usable;
        const y=center-value*rowHeight*.34;

        if(i===0) ctx.moveTo(x,y);
        else ctx.lineTo(x,y);
      }

      ctx.strokeStyle=lead.group==="posterior"?"#bd91ed":
        lead.group==="right"?"#ef8496":"#56df80";
      ctx.lineWidth=1.2*size.dpr;
      ctx.shadowColor="rgba(72,232,121,.16)";
      ctx.shadowBlur=2.5*size.dpr;
      ctx.stroke();
      ctx.restore();
    });

    const markerX=40*size.dpr+
      wrap(state.phase)*(size.width-47*size.dpr);

    ctx.save();
    ctx.strokeStyle="rgba(250,204,21,.40)";
    ctx.lineWidth=1*size.dpr;
    ctx.setLineDash([4*size.dpr,5*size.dpr]);
    ctx.beginPath();
    ctx.moveTo(markerX,0);
    ctx.lineTo(markerX,size.height);
    ctx.stroke();
    ctx.restore();
  }

  function syncUI() {
    const info=phaseInfo(state.phase);
    const percent=Math.round(wrap(state.phase)*100);
    const pattern=currentPattern();

    get("ecgHeartPhase").textContent=info.short;
    get("ecgHeartVector").textContent=info.vector;
    get("ecgPhaseIndex").textContent=info.index;
    get("ecgPhaseCategory").textContent=info.category;
    get("ecgPhaseTitle").textContent=info.title;
    get("ecgPhaseDescription").textContent=info.description;
    get("ecgProgressBar").style.width=percent+"%";
    get("ecgProgressText").textContent=percent+"%";
    get("ecgTutorBpm").textContent=pattern.bpm;

    get("ecgPlayIcon").textContent=state.running?"Ⅱ":"▶";
    get("ecgPlayText").textContent=state.running?"Pausar":"Iniciar loop";
    get("ecgPlayPause").classList.toggle("playing",state.running);
    get("ecgSectionToggle").classList.toggle("active",state.sectioned);

    get("ecgTutorStatus").textContent=state.running?"AO VIVO":"PAUSADO";
    const status=get("ecgTutorStatus").parentElement;
    status.classList.toggle("is-running",state.running);
  }

  function renderLeads() {
    get("ecgLeadSelector").innerHTML=LEADS.map(function (lead) {
      const active=state.selected.has(lead.id);
      const special=lead.group==="posterior" || lead.group==="right";

      return '<button type="button" class="ecg3d-lead-pill'+
        (active?" active":"")+
        (special?" special":"")+
        '" data-ecg-lead="'+lead.id+'">'+lead.id+"</button>";
    }).join("");

    root.querySelectorAll("[data-ecg-lead]").forEach(function (button) {
      button.addEventListener("click",function () {
        const id=button.dataset.ecgLead;

        if(state.selected.has(id)) {
          if(state.selected.size>1) {
            state.selected.delete(id);
          }
        }
        else {
          state.selected.add(id);
        }

        renderLeads();
        drawTrace();
      });
    });
  }

  function renderGuided() {
    get("ecgGuidedSteps").innerHTML=GUIDED.map(function (step) {
      return '<button type="button" class="ecg3d-guided-step" data-ecg-phase="'+step[3]+'">'+
        "<span>ETAPA "+step[0]+"</span>"+
        "<strong>"+step[1]+"</strong>"+
        "<small>"+step[2]+"</small>"+
        "</button>";
    }).join("");

    root.querySelectorAll("[data-ecg-phase]").forEach(function (button) {
      button.addEventListener("click",function () {
        state.running=false;
        state.phase=Number(button.dataset.ecgPhase);

        root.querySelectorAll("[data-ecg-phase]").forEach(function (item) {
          item.classList.toggle("active",item===button);
        });

        syncUI();
        drawHeart();
        drawTrace();

        root.scrollIntoView({
          behavior:"smooth",
          block:"start"
        });
      });
    });
  }

  function renderPatterns() {
    get("ecgPatternSelector").innerHTML=PATTERNS.map(function (pattern) {
      return '<button type="button" class="ecg3d-pattern-button'+
        (pattern.id===state.pattern?" active":"")+
        '" data-ecg-pattern="'+pattern.id+'">'+
        "<strong>"+pattern.name+"</strong>"+
        "<span>"+pattern.caption+"</span>"+
        "</button>";
    }).join("");

    root.querySelectorAll("[data-ecg-pattern]").forEach(function (button) {
      button.addEventListener("click",function () {
        state.pattern=button.dataset.ecgPattern;
        renderPatterns();
        renderPatternDetail();
        syncUI();
        drawTrace();
      });
    });
  }

  function renderPatternDetail() {
    const pattern=currentPattern();

    get("ecgPatternName").textContent=pattern.name;
    get("ecgPatternDescription").textContent=pattern.description;
    get("ecgPatternTags").innerHTML=pattern.tags.map(function (tag) {
      return "<span>"+tag+"</span>";
    }).join("");
  }

  function setView(view) {
    if(view==="front") {
      state.yaw=0;
      state.pitch=0;
      state.zoom=1;
    }
    else if(view==="horizontal") {
      state.yaw=-.05;
      state.pitch=-1.18;
      state.zoom=1;
    }
    else {
      state.yaw=-.35;
      state.pitch=.12;
      state.zoom=1;
    }

    root.querySelectorAll("[data-ecg-view]").forEach(function (button) {
      button.classList.toggle("active",button.dataset.ecgView===view);
    });

    drawHeart();
  }

  function bindHeart() {
    const canvas=get("ecgHeartCanvas");

    canvas.addEventListener("pointerdown",function (event) {
      state.dragging=true;
      state.dragX=event.clientX;
      state.dragY=event.clientY;
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove",function (event) {
      if(!state.dragging) return;

      const dx=event.clientX-state.dragX;
      const dy=event.clientY-state.dragY;
      state.dragX=event.clientX;
      state.dragY=event.clientY;
      state.yaw+=dx*.008;
      state.pitch=clamp(state.pitch+dy*.008,-1.45,1.45);

      root.querySelectorAll("[data-ecg-view]").forEach(function (button) {
        button.classList.toggle("active",button.dataset.ecgView==="free");
      });

      drawHeart();
    });

    function end(event) {
      state.dragging=false;
      if(canvas.hasPointerCapture && canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    }

    canvas.addEventListener("pointerup",end);
    canvas.addEventListener("pointercancel",end);

    canvas.addEventListener("wheel",function (event) {
      event.preventDefault();
      state.zoom=clamp(state.zoom-event.deltaY*.0007,.76,1.34);
      drawHeart();
    },{passive:false});

    root.querySelectorAll("[data-ecg-view]").forEach(function (button) {
      button.addEventListener("click",function () {
        setView(button.dataset.ecgView);
      });
    });

    get("ecgSectionToggle").addEventListener("click",function () {
      state.sectioned=!state.sectioned;
      syncUI();
      drawHeart();
    });

    get("ecgHeartReset").addEventListener("click",function () {
      state.sectioned=false;
      setView("free");
      syncUI();
    });
  }

  function bindTransport() {
    get("ecgPlayPause").addEventListener("click",function () {
      state.running=!state.running;
      state.lastFrame=performance.now();
      syncUI();
    });

    get("ecgPrevPhase").addEventListener("click",function () {
      state.running=false;
      state.phase=wrap(state.phase-.05);
      syncUI();
      drawHeart();
      drawTrace();
    });

    get("ecgNextPhase").addEventListener("click",function () {
      state.running=false;
      state.phase=wrap(state.phase+.05);
      syncUI();
      drawHeart();
      drawTrace();
    });

    get("ecgCoreLeads").addEventListener("click",function () {
      state.selected=new Set(Array.from(CORE));
      renderLeads();
      drawTrace();
    });

    get("ecgAllLeads").addEventListener("click",function () {
      state.selected=new Set(LEADS.map(function (lead) {
        return lead.id;
      }));
      renderLeads();
      drawTrace();
    });
  }

  function bindLearning() {
    root.querySelectorAll("[data-ecg-learn]").forEach(function (button) {
      button.addEventListener("click",function () {
        const target=button.dataset.ecgLearn;

        root.querySelectorAll("[data-ecg-learn]").forEach(function (item) {
          item.classList.toggle("active",item===button);
        });

        root.querySelectorAll(".ecg3d-learn-panel").forEach(function (panel) {
          panel.classList.toggle("active",panel.id==="ecgLearn-"+target);
        });
      });
    });

    root.querySelectorAll(".ecg-electrode").forEach(function (dot) {
      dot.addEventListener("click",function () {
        root.querySelectorAll(".ecg-electrode").forEach(function (item) {
          item.classList.toggle("active",item===dot);
        });

        const id=dot.dataset.electrode;
        const box=get("ecgElectrodeFocus");
        box.querySelector("strong").textContent=id;
        box.querySelector("p").textContent=ELECTRODES[id]||"Posição didática selecionada.";
      });
    });
  }

  function animation(now) {
    const delta=Math.min(80,Math.max(0,now-state.lastFrame));
    state.lastFrame=now;

    if(!root.hidden) {
      if(state.running) {
        state.phase=wrap(
          state.phase+
          delta*currentPattern().bpm/60000
        );
        syncUI();
      }

      drawHeart();
      drawTrace();
    }

    requestAnimationFrame(animation);
  }

  function init() {
    loadCurrentUser();

    if (get("logoutSidebar")) {
      get("logoutSidebar").addEventListener("click", logoutLaboratory);
    }

    renderLeads();
    renderGuided();
    renderPatterns();
    renderPatternDetail();
    bindHeart();
    bindTransport();
    bindLearning();
    syncUI();

    const observer=new MutationObserver(function () {
      if(!root.hidden) {
        requestAnimationFrame(function () {
          drawHeart();
          drawTrace();
        });
      }
    });

    observer.observe(root,{attributes:true,attributeFilter:["hidden"]});

    let resizeTimer=null;
    window.addEventListener("resize",function () {
      clearTimeout(resizeTimer);
      resizeTimer=setTimeout(function () {
        drawHeart();
        drawTrace();
      },80);
    });

    requestAnimationFrame(function (now) {
      state.lastFrame=now;
      animation(now);
    });
  }

  init();
})();
