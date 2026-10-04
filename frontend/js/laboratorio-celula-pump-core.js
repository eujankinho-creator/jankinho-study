(()=>{
 const $=id=>document.getElementById(id), C=$('membraneCanvas'); if(!C)return; const X=C.getContext('2d');
 const M=window.MembraneLab={$,C,X,S:{p:[],phase:'na',busy:false,kind:'',t0:0,duration:0,progress:0,pumpConf:0,cycles:0,atp:0,id:1,drag:null,g:null,msg:'Encaixe 3 Na⁺ e 1 ATP nos sítios internos.'}};
 M.D=(a,b,c,d)=>Math.hypot(a-c,b-d);
 M.clamp=(v,a,b)=>Math.min(Math.max(v,a),b);
 M.L=(a,b,t)=>a+(b-a)*t;
 M.ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
 M.radius=p=>p.type==='atp'?13:11;
 M.fit=()=>{const d=devicePixelRatio||1,r=C.getBoundingClientRect(),w=Math.max(1,Math.round(r.width*d)),h=Math.max(1,Math.round(r.height*d));if(C.width!==w||C.height!==h){C.width=w;C.height=h}return{d,w:r.width,h:r.height}};
 M.geo=(w,h)=>{
  const cx=w/2,cy=h*.92,o=Math.min(w*.43,h*.72),i=o-36,m=(o+i)/2,st=Math.PI*1.08,en=Math.PI*1.92,a=Math.PI*1.5;
  const p={x:cx+Math.cos(a)*m,y:cy+Math.sin(a)*m},n={x:Math.cos(a),y:Math.sin(a)},t={x:-n.y,y:n.x},pol=(aa,r)=>({x:cx+Math.cos(aa)*r,y:cy+Math.sin(aa)*r});
  return{cx,cy,o,i,m,st,en,p,n,t,na:[-28,0,28].map(q=>({x:p.x+t.x*q-n.x*48,y:p.y+t.y*q-n.y*48})),k:[-17,17].map(q=>({x:p.x+t.x*q+n.x*48,y:p.y+t.y*q+n.y*48})),at:{x:p.x+t.x*53-n.x*62,y:p.y+t.y*53-n.y*62},nc:pol(Math.PI*1.27,m),kc:pol(Math.PI*1.73,m)};
 };
 M.keep=p=>{
  const g=M.S.g;if(!g||p.b||p.c)return;
  let dx=p.x-g.cx,dy=p.y-g.cy,r=Math.max(1,Math.hypot(dx,dy)),a=Math.atan2(dy,dx);
  if(a<0)a+=Math.PI*2;
  if(a>=g.st&&a<=g.en){
   if(p.side==='inside'&&r>g.i-23){const rr=g.i-23;p.x=g.cx+dx/r*rr;p.y=g.cy+dy/r*rr}
   if(p.side==='outside'&&r<g.o+23){const rr=g.o+23;p.x=g.cx+dx/r*rr;p.y=g.cy+dy/r*rr}
  }
 };
 M.space=(x,y,type,ignore)=>{
  const r=type==='atp'?13:11;
  return !M.S.p.some(q=>q.id!==ignore&&q.type!=='atp'&&type!=='atp'&&M.D(x,y,q.x,q.y)<r+M.radius(q)+4);
 };
 M.add=(type,side)=>{
  const g=M.S.g||M.geo(C.clientWidth,C.clientHeight);let x,y,a,r,ok=false;
  for(let z=0;z<50&&!ok;z++){a=Math.PI*(1.14+Math.random()*.72);r=side==='inside'?g.i-70-Math.random()*55:g.o+58+Math.random()*58;x=g.cx+Math.cos(a)*r;y=g.cy+Math.sin(a)*r;ok=M.space(x,y,type,null)}
  M.S.p.push({id:M.S.id++,type,side,x,y,vx:(Math.random()-.5)*.1,vy:(Math.random()-.5)*.1,b:null,c:null,alpha:1});
 };
 M.seed=()=>{M.S.p=[];M.S.id=1;for(let q=0;q<3;q++)M.add('na','inside');for(let q=0;q<2;q++)M.add('k','outside');M.add('atp','inside')};
 M.col=t=>t==='na'?['#71d7ff','#247fff','Na⁺']:t==='k'?['#c5a0ff','#7d4dff','K⁺']:['#ffe58a','#d99c22','ATP'];
 M.head=(x,y,r)=>{
  X.save();X.shadowColor='rgba(99,157,255,.32)';X.shadowBlur=9;
  const g=X.createRadialGradient(x-r*.4,y-r*.45,1,x,y,r);g.addColorStop(0,'#ffffff');g.addColorStop(.25,'#d9e8ff');g.addColorStop(.72,'#7899ff');g.addColorStop(1,'#243761');
  X.fillStyle=g;X.beginPath();X.arc(x,y,r,0,Math.PI*2);X.fill();X.restore()
 };
 M.tail=(x,y,a,l,s)=>{X.beginPath();X.moveTo(x,y);X.quadraticCurveTo(x+Math.cos(a)*l*.45,y+Math.sin(a)*l*.45,x+Math.cos(a)*l+Math.cos(a+Math.PI/2)*s,y+Math.sin(a)*l+Math.sin(a+Math.PI/2)*s);X.strokeStyle='rgba(129,156,221,.36)';X.lineWidth=1.15;X.lineCap='round';X.stroke()};
 M.membrane=(g,t)=>{
  for(let q=0;q<44;q++){const a=g.st+(g.en-g.st)*q/43,w=Math.sin(t*.00135+q*.71)*1.25,ro=g.o+w,ri=g.i-w*.55,ox=g.cx+Math.cos(a)*ro,oy=g.cy+Math.sin(a)*ro,ix=g.cx+Math.cos(a)*ri,iy=g.cy+Math.sin(a)*ri,sw=Math.sin(t*.002+q*.8)*1.6;M.tail(ox,oy,a+Math.PI,18,sw);M.tail(ix,iy,a,18,-sw);M.head(ox,oy,6.25);M.head(ix,iy,6.25)}
 };
 M.channel=(p,type,t)=>{
  const c=type==='na'?'#66d9ff':'#bd92ff',g=M.S.g,n={x:(p.x-g.cx)/g.m,y:(p.y-g.cy)/g.m},pulse=.55+.45*((Math.sin(t*.0045)+1)/2);
  X.save();X.translate(p.x,p.y);X.rotate(Math.atan2(n.y,n.x)+Math.PI/2);X.shadowColor=c;X.shadowBlur=16;
  const gr=X.createLinearGradient(-24,0,24,0);gr.addColorStop(0,'#263248');gr.addColorStop(.28,'#7891b8');gr.addColorStop(.5,'#d5e5ff');gr.addColorStop(.72,'#7891b8');gr.addColorStop(1,'#263248');
  X.fillStyle=gr;X.beginPath();X.roundRect(-24,-35,17,70,9);X.fill();X.beginPath();X.roundRect(7,-35,17,70,9);X.fill();
  X.shadowBlur=0;X.fillStyle='rgba(4,8,15,.95)';X.beginPath();X.roundRect(-6,-37,12,74,6);X.fill();
  X.globalAlpha=.25+.38*pulse;X.fillStyle=c;X.beginPath();X.roundRect(-2,-28,4,56,2);X.fill();X.restore();
  X.save();X.shadowColor=c;X.shadowBlur=10;X.fillStyle=c;X.font='800 8px system-ui';X.textAlign='center';X.fillText(type==='na'?'CANAL Na⁺':'CANAL K⁺',p.x,p.y-47);X.restore()
 };
 M.pump=(g,t)=>{
  const p=g.p,conf=M.S.pumpConf||0,busy=M.S.busy,pulse=busy?.75+.25*Math.sin(t*.018):.55;
  const topOpen=9+conf*16,bottomOpen=25-conf*16,bulge=36+Math.sin(conf*Math.PI)*6;
  X.save();X.translate(p.x,p.y);X.shadowColor='rgba(111,174,255,.7)';X.shadowBlur=busy?28:18;
  const gr=X.createLinearGradient(-45,0,45,0);gr.addColorStop(0,'#202a3d');gr.addColorStop(.18,'#577399');gr.addColorStop(.43,'#b9d4f5');gr.addColorStop(.5,'#eef7ff');gr.addColorStop(.57,'#b9d4f5');gr.addColorStop(.82,'#577399');gr.addColorStop(1,'#202a3d');
  X.fillStyle=gr;
  X.beginPath();X.moveTo(-topOpen,-57);X.bezierCurveTo(-bulge,-51,-42,-18,-31,0);X.bezierCurveTo(-22,18,-bottomOpen,40,-bottomOpen,57);X.lineTo(-7,57);X.bezierCurveTo(-8,34,-12,18,-9,6);X.bezierCurveTo(-5,-13,-6,-35,-topOpen,-57);X.closePath();X.fill();
  X.beginPath();X.moveTo(topOpen,-57);X.bezierCurveTo(bulge,-51,42,-18,31,0);X.bezierCurveTo(22,18,bottomOpen,40,bottomOpen,57);X.lineTo(7,57);X.bezierCurveTo(8,34,12,18,9,6);X.bezierCurveTo(5,-13,6,-35,topOpen,-57);X.closePath();X.fill();
  X.shadowBlur=0;X.fillStyle='rgba(4,8,15,.92)';X.beginPath();X.ellipse(0,-5,8+conf*4,28,0,0,Math.PI*2);X.fill();
  X.globalAlpha=.28+.28*pulse;X.fillStyle='#73d9ff';X.beginPath();X.ellipse(0,-5,2.4,23,0,0,Math.PI*2);X.fill();X.globalAlpha=1;
  X.strokeStyle='rgba(211,235,255,.3)';X.lineWidth=1;X.beginPath();X.arc(0,0,45,-2.55,-.58);X.stroke();X.restore();
  X.save();X.shadowColor='rgba(118,190,255,.45)';X.shadowBlur=10;X.fillStyle='#a8bed8';X.font='900 8px system-ui';X.textAlign='center';X.fillText('Na⁺/K⁺ ATPase',p.x,p.y+78);X.restore()
 };
})();