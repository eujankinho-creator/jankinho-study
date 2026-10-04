(()=>{const M=window.MembraneLab;if(!M)return;const {X,S}=M;
 M.bound=(k,i)=>S.p.find(p=>p.b&&p.b.k===k&&p.b.i===i);
 M.site=(s,lab,type,on,full)=>{
  const c=M.col(type),r=type==='atp'?20:18;X.save();X.setLineDash(on&&!full?[4,4]:[]);
  X.strokeStyle=full?c[0]:on?c[1]:'#42505b';X.fillStyle=full?'#10181b':'#0a1013';X.lineWidth=full?2:1.2;
  X.beginPath();X.arc(s.x,s.y,r,0,Math.PI*2);X.fill();X.stroke();X.setLineDash([]);
  X.fillStyle=on||full?c[0]:'#6c787d';X.font='900 8px system-ui';X.textAlign='center';X.textBaseline='middle';X.fillText(lab,s.x,s.y+.5);X.restore()
 };
 M.sites=g=>{
  const on=!S.busy;
  g.na.forEach((s,i)=>M.site(s,'Na','na',on,!!M.bound('na',i)));
  g.k.forEach((s,i)=>M.site(s,'K','k',on,!!M.bound('k',i)));
  M.site(g.at,'ATP','atp',on,!!M.bound('atp',0))
 };
 M.drawP=p=>{
  const c=M.col(p.type),r=M.radius(p),alpha=p.alpha==null?1:p.alpha;X.save();X.globalAlpha=alpha;
  if(p.type==='atp'){
   X.fillStyle=c[0];X.strokeStyle='#6e5318';X.lineWidth=1.6;X.beginPath();X.roundRect(p.x-r,p.y-r*.72,r*2,r*1.44,8);X.fill();X.stroke();
   X.fillStyle='rgba(255,255,255,.55)';X.beginPath();X.roundRect(p.x-r*.62,p.y-r*.45,r*.7,3,1.5);X.fill()
  }else{
   X.fillStyle=c[0];X.strokeStyle=p.type==='na'?'#14536a':'#49306f';X.lineWidth=1.7;X.beginPath();X.arc(p.x,p.y,r,0,Math.PI*2);X.fill();X.stroke();
   X.fillStyle='rgba(255,255,255,.6)';X.beginPath();X.arc(p.x-r*.32,p.y-r*.34,2.2,0,Math.PI*2);X.fill()
  }
  X.fillStyle=p.type==='atp'?'#49380d':'#071014';X.font=(p.type==='atp'?'900 9px':'950 10px')+' system-ui';X.textAlign='center';X.textBaseline='middle';X.fillText(c[2],p.x,p.y+.5);X.restore()
 };
 M.pos=(p,g)=>!p.b?null:p.b.k==='na'?g.na[p.b.i]:p.b.k==='k'?g.k[p.b.i]:g.at;
 M.cnt=()=>{let n=0,k=0,a=0;for(const p of S.p)if(p.b){if(p.b.k==='na')n++;else if(p.b.k==='k')k++;else a++}return{n,k,a}};
 M.bind=p=>{
  if(S.busy)return false;
  const g=S.g,arr=p.type==='na'?g.na.map((s,i)=>({s,k:'na',i})):p.type==='k'?g.k.map((s,i)=>({s,k:'k',i})):p.type==='atp'?[{s:g.at,k:'atp',i:0}]:[];
  let z=null,dd=999;
  for(const q of arr){if(M.bound(q.k,q.i))continue;const d=M.D(p.x,p.y,q.s.x,q.s.y);if(d<dd){dd=d;z=q}}
  if(z&&dd<39){p.b={k:z.k,i:z.i};p.x=z.s.x;p.y=z.s.y;p.vx=p.vy=0;M.cycle();return true}
  return false
 };
})();