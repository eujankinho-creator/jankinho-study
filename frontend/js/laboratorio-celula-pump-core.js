(()=>{
 const $=id=>document.getElementById(id), C=$('membraneCanvas'); if(!C)return; const X=C.getContext('2d');
 const M=window.MembraneLab={$,C,X,S:{p:[],phase:'na',busy:false,kind:'',t0:0,duration:0,progress:0,pumpConf:0,cycles:0,atp:0,id:1,drag:null,g:null,msg:'Encaixe 3 Na⁺ e 1 ATP nos sítios internos.'}};
 M.D=(a,b,c,d)=>Math.hypot(a-c,b-d);
 M.clamp=(v,a,b)=>Math.min(Math.max(v,a),b);
 M.L=(a,b,t)=>a+(b-a)*t;
 M.ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
 M.radius=p=>p.type==='atp'?17:15;
 M.fit=()=>{const d=devicePixelRatio||1,r=C.getBoundingClientRect(),w=Math.max(1,Math.round(r.width*d)),h=Math.max(1,Math.round(r.height*d));if(C.width!==w||C.height!==h){C.width=w;C.height=h}return{d,w:r.width,h:r.height}};
 M.geo=(w,h)=>{
  const cx=w/2,cy=h*.92,o=Math.min(w*.43,h*.72),i=o-36,m=(o+i)/2,st=Math.PI*1.08,en=Math.PI*1.92,a=Math.PI*1.5;
  const p={x:cx+Math.cos(a)*m,y:cy+Math.sin(a)*m},n={x:Math.cos(a),y:Math.sin(a)},t={x:-n.y,y:n.x},pol=(aa,r)=>({x:cx+Math.cos(aa)*r,y:cy+Math.sin(aa)*r});
  return{cx,cy,o,i,m,st,en,p,n,t,na:[-36,0,36].map(q=>({x:p.x+t.x*q-n.x*52,y:p.y+t.y*q-n.y*52})),k:[-23,23].map(q=>({x:p.x+t.x*q+n.x*52,y:p.y+t.y*q+n.y*52})),at:{x:p.x+t.x*66-n.x*64,y:p.y+t.y*66-n.y*64},nc:pol(Math.PI*1.27,m),kc:pol(Math.PI*1.73,m)};
 };
 M.keep=p=>{
  const g=M.S.g;if(!g||p.b||p.c)return;
  let dx=p.x-g.cx,dy=p.y-g.cy,r=Math.max(1,Math.hypot(dx,dy)),a=Math.atan2(dy,dx);
  if(a<0)a+=Math.PI*2;
  if(a>=g.st&&a<=g.en){
   const pad=M.radius(p)+10;
   if(p.side==='inside'&&r>g.i-pad){const rr=g.i-pad;p.x=g.cx+dx/r*rr;p.y=g.cy+dy/r*rr}
   if(p.side==='outside'&&r<g.o+pad){const rr=g.o+pad;p.x=g.cx+dx/r*rr;p.y=g.cy+dy/r*rr}
  }
 };
 M.space=(x,y,type,ignore)=>{
  const r=type==='atp'?17:15;
  return !M.S.p.some(q=>q.id!==ignore&&q.type!=='atp'&&type!=='atp'&&M.D(x,y,q.x,q.y)<r+M.radius(q)+5);
 };
 M.add=(type,side)=>{
  const g=M.S.g||M.geo(C.clientWidth,C.clientHeight);let x,y,a,r,ok=false;
  for(let z=0;z<60&&!ok;z++){a=Math.PI*(1.14+Math.random()*.72);r=side==='inside'?g.i-78-Math.random()*56:g.o+66+Math.random()*58;x=g.cx+Math.cos(a)*r;y=g.cy+Math.sin(a)*r;ok=M.space(x,y,type,null)}
  M.S.p.push({id:M.S.id++,type,side,x,y,vx:(Math.random()-.5)*.08,vy:(Math.random()-.5)*.08,b:null,c:null,alpha:1});
 };
 M.seed=()=>{M.S.p=[];M.S.id=1;for(let q=0;q<3;q++)M.add('na','inside');for(let q=0;q<2;q++)M.add('k','outside');M.add('atp','inside')};
 M.col=t=>t==='na'?['#66d9ff','#3196c7','Na⁺']:t==='k'?['#c2a1ff','#845bc7','K⁺']:['#f2cf67','#bb8d2d','ATP'];
 M.head=(x,y,r)=>{
  X.save();
  const g=X.createLinearGradient(x-r,y-r,x+r,y+r);g.addColorStop(0,'#c9dcff');g.addColorStop(1,'#6f8fd6');
  X.fillStyle=g;X.beginPath();X.arc(x,y,r,0,Math.PI*2);X.fill();
  X.strokeStyle='rgba(255,255,255,.18)';X.lineWidth=.8;X.stroke();X.restore()
 };
 M.tail=(x,y,a,l,s)=>{X.beginPath();X.moveTo(x,y);X.quadraticCurveTo(x+Math.cos(a)*l*.5,y+Math.sin(a)*l*.5,x+Math.cos(a)*l+Math.cos(a+Math.PI/2)*s,y+Math.sin(a)*l+Math.sin(a+Math.PI/2)*s);X.strokeStyle='rgba(126,149,199,.28)';X.lineWidth=1.1;X.lineCap='round';X.stroke()};
 M.membrane=(g,t)=>{
  for(let q=0;q<44;q++){const a=g.st+(g.en-g.st)*q/43,w=Math.sin(t*.0012+q*.68)*.8,ro=g.o+w,ri=g.i-w*.45,ox=g.cx+Math.cos(a)*ro,oy=g.cy+Math.sin(a)*ro,ix=g.cx+Math.cos(a)*ri,iy=g.cy+Math.sin(a)*ri,sw=Math.sin(t*.0018+q*.75)*1.1;M.tail(ox,oy,a+Math.PI,18,sw);M.tail(ix,iy,a,18,-sw);M.head(ox,oy,6);M.head(ix,iy,6)}
 };
 M.channel=(p,type,t)=>{
  const c=type==='na'?'#66d9ff':'#c2a1ff',g=M.S.g,n={x:(p.x-g.cx)/g.m,y:(p.y-g.cy)/g.m},pulse=.5+.5*((Math.sin(t*.004)+1)/2);
  X.save();X.translate(p.x,p.y);X.rotate(Math.atan2(n.y,n.x)+Math.PI/2);
  X.shadowColor=c;X.shadowBlur=8;
  X.fillStyle='#17202d';X.strokeStyle='rgba(255,255,255,.1)';X.lineWidth=1;
  X.beginPath();X.roundRect(-24,-34,17,68,8);X.fill();X.stroke();
  X.beginPath();X.roundRect(7,-34,17,68,8);X.fill();X.stroke();
  X.shadowBlur=0;X.fillStyle='#070a10';X.beginPath();X.roundRect(-5,-36,10,72,5);X.fill();
  X.globalAlpha=.2+.22*pulse;X.fillStyle=c;X.fillRect(-1,-27,2,54);X.restore();
  X.fillStyle='#7f8da0';X.font='800 9px system-ui';X.textAlign='center';X.fillText(type==='na'?'Na⁺':'K⁺',p.x,p.y-46)
 };
 M.pump=(g,t)=>{
  const p=g.p,conf=M.S.pumpConf||0,busy=M.S.busy;
  const topGap=10+conf*18,bottomGap=28-conf*18,side=34+Math.sin(conf*Math.PI)*4;
  X.save();X.translate(p.x,p.y);X.shadowColor='rgba(91,174,255,.35)';X.shadowBlur=busy?18:10;
  X.fillStyle='#263243';X.strokeStyle='rgba(191,219,255,.22)';X.lineWidth=1.1;
  X.beginPath();X.moveTo(-topGap,-58);X.bezierCurveTo(-side,-52,-41,-18,-31,1);X.bezierCurveTo(-23,20,-bottomGap,39,-bottomGap,58);X.lineTo(-8,58);X.bezierCurveTo(-8,35,-11,17,-8,5);X.bezierCurveTo(-4,-15,-5,-36,-topGap,-58);X.closePath();X.fill();X.stroke();
  X.beginPath();X.moveTo(topGap,-58);X.bezierCurveTo(side,-52,41,-18,31,1);X.bezierCurveTo(23,20,bottomGap,39,bottomGap,58);X.lineTo(8,58);X.bezierCurveTo(8,35,11,17,8,5);X.bezierCurveTo(4,-15,5,-36,topGap,-58);X.closePath();X.fill();X.stroke();
  X.shadowBlur=0;X.fillStyle='#070a10';X.beginPath();X.ellipse(0,-4,7+conf*4,27,0,0,Math.PI*2);X.fill();
  X.globalAlpha=busy?.42:.22;X.fillStyle='#6fd9ff';X.beginPath();X.roundRect(-1.5,-25,3,43,1.5);X.fill();X.restore();
  X.fillStyle='#8c9caf';X.font='800 9px system-ui';X.textAlign='center';X.fillText('Na⁺/K⁺ ATPase',p.x,p.y+80)
 };
})();