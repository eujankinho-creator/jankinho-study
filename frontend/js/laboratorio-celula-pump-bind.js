(()=>{const M=window.MembraneLab;if(!M)return;const {X,S}=M;
 M.bound=(k,i)=>S.p.find(p=>p.b&&p.b.k===k&&p.b.i===i);
 M.site=(s,lab,type,on,full)=>{
  const c=M.col(type),r=type==='atp'?19:17;X.save();X.shadowColor=full?c[0]:'transparent';X.shadowBlur=full?8:0;X.setLineDash(on&&!full?[4,4]:[]);
  X.strokeStyle=full?c[0]:on?c[1]:'rgba(132,146,164,.22)';X.fillStyle=full?'rgba(12,17,24,.98)':'rgba(7,10,15,.75)';X.lineWidth=full?1.8:1;
  X.beginPath();X.arc(s.x,s.y,r,0,Math.PI*2);X.fill();X.stroke();X.setLineDash([]);
  X.fillStyle=on||full?c[0]:'#667385';X.font='900 8px system-ui';X.textAlign='center';X.textBaseline='middle';X.fillText(lab,s.x,s.y+.5);X.restore()
 };
 M.sites=g=>{g.na.forEach((s,i)=>M.site(s,'Na','na',S.phase==='na'&&!S.busy,!!M.bound('na',i)));g.k.forEach((s,i)=>M.site(s,'K','k',S.phase==='k'&&!S.busy,!!M.bound('k',i)));M.site(g.at,'ATP','atp',S.phase==='na'&&!S.busy,!!M.bound('atp',0))};
 M.drawP=p=>{
  const c=M.col(p.type),r=M.radius(p),alpha=p.alpha==null?1:p.alpha;X.save();X.globalAlpha=alpha;X.shadowColor=c[0];X.shadowBlur=p.type==='atp'?7:9;
  if(p.type==='atp'){
   X.fillStyle=c[0];X.beginPath();X.roundRect(p.x-r,p.y-r*.72,r*2,r*1.44,8);X.fill();
   X.shadowBlur=0;X.strokeStyle='rgba(255,255,255,.3)';X.lineWidth=1;X.stroke()
  }else{
   X.fillStyle=c[0];X.beginPath();X.arc(p.x,p.y,r,0,Math.PI*2);X.fill();
   X.shadowBlur=0;X.strokeStyle='rgba(255,255,255,.35)';X.lineWidth=1;X.beginPath();X.arc(p.x,p.y,r-.5,0,Math.PI*2);X.stroke()
  }
  X.shadowBlur=0;X.fillStyle=p.type==='atp'?'#3e3210':'#071018';X.font=(p.type==='atp'?'900 9px':'950 10px')+' system-ui';X.textAlign='center';X.textBaseline='middle';X.fillText(c[2],p.x,p.y+.5);X.restore()
 };
 M.pos=(p,g)=>!p.b?null:p.b.k==='na'?g.na[p.b.i]:p.b.k==='k'?g.k[p.b.i]:g.at;
 M.cnt=()=>{let n=0,k=0,a=0;for(const p of S.p)if(p.b){if(p.b.k==='na')n++;else if(p.b.k==='k')k++;else a++}return{n,k,a}};
 M.bind=p=>{
  if(S.busy)return false;const g=S.g,arr=p.type==='na'&&S.phase==='na'?g.na.map((s,i)=>({s,k:'na',i})):p.type==='k'&&S.phase==='k'?g.k.map((s,i)=>({s,k:'k',i})):p.type==='atp'&&S.phase==='na'?[{s:g.at,k:'atp',i:0}]:[];
  let z=null,dd=999;for(const q of arr){if(M.bound(q.k,q.i))continue;const d=M.D(p.x,p.y,q.s.x,q.s.y);if(d<dd){dd=d;z=q}}
  if(z&&dd<36){p.b={k:z.k,i:z.i};p.x=z.s.x;p.y=z.s.y;p.vx=p.vy=0;M.cycle();return true}return false
 };
})();