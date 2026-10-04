(()=>{const M=window.MembraneLab;if(!M)return;const {X,S}=M;
 const duration=3400;
 const smooth=v=>M.ease(M.clamp(v,0,1));
 M.cycle=()=>{
  const c=M.cnt();
  if(!S.busy&&c.n===3&&c.k===2&&c.a===1){
   S.busy=true;S.kind='exchange';S.t0=performance.now();S.duration=duration;S.progress=0;
   S.msg='Troca iniciada: 3 Na⁺ saem enquanto 2 K⁺ entram.'
  }else{
   const missing=[];
   if(c.n<3)missing.push((3-c.n)+' Na⁺');
   if(c.k<2)missing.push((2-c.k)+' K⁺');
   if(c.a<1)missing.push('1 ATP');
   S.msg=missing.length?'Para iniciar a troca, falta: '+missing.join(', ')+'.':'Tudo pronto.'
  }
  M.ui()
 };
 M.transportBound=(p,t)=>{
  if(!S.busy||!p.b)return false;
  const g=S.g,u=M.clamp((t-S.t0)/S.duration,0,1);
  if(p.b.k==='na'){
   const q=[-38,0,38][p.b.i],s=g.na[p.b.i],e=smooth((u-.05)/.55),tx=g.p.x+g.t.x*q+g.n.x*78,ty=g.p.y+g.t.y*q+g.n.y*78;
   p.x=M.L(s.x,tx,e);p.y=M.L(s.y,ty,e);return true
  }
  if(p.b.k==='k'){
   const q=[-24,24][p.b.i],s=g.k[p.b.i],e=smooth((u-.4)/.52),tx=g.p.x+g.t.x*q-g.n.x*78,ty=g.p.y+g.t.y*q-g.n.y*78;
   p.x=M.L(s.x,tx,e);p.y=M.L(s.y,ty,e);return true
  }
  if(p.b.k==='atp'){
   p.alpha=1-M.clamp((u-.12)/.28,0,1);return true
  }
  return false
 };
 M.finish=()=>{
  const g=S.g;
  S.p=S.p.filter(p=>{
   if(p.b&&p.b.k==='atp')return false;
   if(p.b&&p.b.k==='na'){
    const q=[-38,0,38][p.b.i];p.b=null;p.alpha=1;p.side='outside';p.x=g.p.x+g.t.x*q+g.n.x*80;p.y=g.p.y+g.t.y*q+g.n.y*80;p.vx=(Math.random()-.5)*.08;p.vy=(Math.random()-.5)*.08
   }else if(p.b&&p.b.k==='k'){
    const q=[-24,24][p.b.i];p.b=null;p.alpha=1;p.side='inside';p.x=g.p.x+g.t.x*q-g.n.x*80;p.y=g.p.y+g.t.y*q-g.n.y*80;p.vx=(Math.random()-.5)*.08;p.vy=(Math.random()-.5)*.08
   }
   return true
  });
  S.atp++;S.cycles++;S.phase='load';S.busy=false;S.kind='';S.progress=0;S.pumpConf=0;
  S.msg='Troca completa: 3 Na⁺ para fora, 2 K⁺ para dentro e 1 ATP consumido.';
  M.ui()
 };
 M.leak=(p,t)=>{
  if(p.b||p.c||p.type==='atp'||p.id===S.drag)return;const g=S.g,q=p.type==='na'?g.nc:g.kc;
  if(M.D(p.x,p.y,q.x,q.y)>52)return;
  const r=M.D(p.x,p.y,g.cx,g.cy),out=p.side==='outside';
  p.c={t0:t,a:p.type==='na'?Math.PI*1.18:Math.PI*1.82,r0:r,r1:out?g.i-40:g.o+40,side:out?'inside':'outside'}
 };
 M.resolveCollisions=()=>{
  const ions=S.p.filter(p=>p.type!=='atp');
  for(let pass=0;pass<3;pass++)for(let i=0;i<ions.length;i++)for(let j=i+1;j<ions.length;j++){
   const a=ions[i],b=ions[j],min=M.radius(a)+M.radius(b)+4,dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.001;
   if(d>=min)continue;
   const nx=dx/d,ny=dy/d,over=min-d,aFixed=!!a.b||!!a.c,bFixed=!!b.b||!!b.c,aDrag=a.id===S.drag,bDrag=b.id===S.drag;
   if(aFixed&&bFixed)continue;
   if(aFixed){b.x+=nx*over;b.y+=ny*over;M.keep(b)}
   else if(bFixed){a.x-=nx*over;a.y-=ny*over;M.keep(a)}
   else if(aDrag){b.x+=nx*over;b.y+=ny*over;M.keep(b)}
   else if(bDrag){a.x-=nx*over;a.y-=ny*over;M.keep(a)}
   else{a.x-=nx*over*.5;a.y-=ny*over*.5;b.x+=nx*over*.5;b.y+=ny*over*.5;M.keep(a);M.keep(b)}
  }
 };
 M.step=t=>{
  const g=S.g;
  if(S.busy){
   S.progress=M.clamp((t-S.t0)/S.duration,0,1);
   S.pumpConf=S.progress<.5?smooth(S.progress/.5):1-smooth((S.progress-.5)/.5);
   if(S.progress>=1){M.finish();return}
  }else S.pumpConf=0;
  for(const p of S.p){
   if(p.b){if(S.busy)M.transportBound(p,t);else{const q=M.pos(p,g);p.x=q.x;p.y=q.y;p.alpha=1}continue}
   if(p.id===S.drag)continue;
   if(p.c){
    const u=smooth((t-p.c.t0)/900),r=M.L(p.c.r0,p.c.r1,u);p.x=g.cx+Math.cos(p.c.a)*r;p.y=g.cy+Math.sin(p.c.a)*r;
    if(u>=1){p.side=p.c.side;p.c=null}
    continue
   }
   p.x+=p.vx;p.y+=p.vy;p.vx*=.992;p.vy*=.992;M.keep(p);M.leak(p,t)
  }
  M.resolveCollisions()
 };
 M.draw=t=>{
  const f=M.fit();S.g=M.geo(f.w,f.h);X.setTransform(f.d,0,0,f.d,0,0);X.clearRect(0,0,f.w,f.h);M.step(t);
  M.membrane(S.g,t);M.channel(S.g.nc,'na',t);M.channel(S.g.kc,'k',t);M.pump(S.g,t);M.sites(S.g);S.p.forEach(M.drawP);requestAnimationFrame(M.draw)
 };
 M.ui=()=>{
  const c=M.cnt(),$=M.$;
  $('phaseLabel').textContent=S.busy?'Trocando 3 Na⁺ ↔ 2 K⁺':'Preparar troca';
  $('naCount').textContent=c.n+' / 3';$('kCount').textContent=c.k+' / 2';$('atpCount').textContent=c.a+' / 1';
  $('naProgress').style.width=c.n/3*100+'%';$('kProgress').style.width=c.k/2*100+'%';$('atpProgress').style.width=c.a*100+'%';
  $('cycleMessage').textContent=S.msg;$('cycleTotal').textContent=S.cycles;$('atpTotal').textContent=S.atp
 };
})();