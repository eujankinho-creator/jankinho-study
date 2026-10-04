(()=>{const M=window.MembraneLab;if(!M)return;const {X,S}=M;
 M.bound=(k,i)=>S.p.find(p=>p.b&&p.b.k===k&&p.b.i===i);
 M.site=(s,lab,type,on,full)=>{
  const c=M.col(type);X.save();X.shadowColor=full?c[0]:'transparent';X.shadowBlur=full?13:0;X.setLineDash(on&&!full?[3,3]:[]);
  X.strokeStyle=full?c[0]:on?c[1]:'rgba(120,130,150,.23)';X.fillStyle=full?'rgba(8,14,24,.96)':'rgba(7,10,15,.78)';X.lineWidth=full?2.2:1;
  X.beginPath();X.arc(s.x,s.y,type==='atp'?15:12,0,Math.PI*2);X.fill();X.stroke();X.setLineDash([]);
  X.fillStyle=on||full?c[0]:'#687384';X.font='900 7px system-ui';X.textAlign='center';X.textBaseline='middle';X.fillText(lab,s.x,s.y+.5);X.restore()
 };
 M.sites=g=>{g.na.forEach((s,i)=>M.site(s,'Na','na',S.phase==='na'&&!S.busy,!!M.bound('na',i)));g.k.forEach((s,i)=>M.site(s,'K','k',S.phase==='k'&&!S.busy,!!M.bound('k',i)));M.site(g.at,'ATP','atp',S.phase==='na'&&!S.busy,!!M.bound('atp',0))};
 M.drawP=p=>{
  const c=M.col(p.type),r=M.radius(p),alpha=p.alpha==null?1:p.alpha;X.save();X.globalAlpha=alpha;X.shadowColor=c[0];X.shadowBlur=p.type==='atp'?14:18;
  if(p.type==='atp'){
   const gr=X.createLinearGradient(p.x-r,p.y-r,p.x+r,p.y+r);gr.addColorStop(0,'#fff3af');gr.addColorStop(.45,c[0]);gr.addColorStop(1,c[1]);X.fillStyle=gr;X.beginPath();
   for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3,x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r;i?X.lineTo(x,y):X.moveTo(x,y)}X.closePath();X.fill();
   X.strokeStyle='rgba(255,255,255,.55)';X.lineWidth=1;X.stroke()
  }else{
   const gr=X.createRadialGradient(p.x-r*.38,p.y-r*.42,1,p.x,p.y,r);gr.addColorStop(0,'#fff');gr.addColorStop(.28,c[0]);gr.addColorStop(.74,c[1]);gr.addColorStop(1,'#101a30');X.fillStyle=gr;X.beginPath();X.arc(p.x,p.y,r,0,Math.PI*2);X.fill();
   X.strokeStyle='rgba(255,255,255,.42)';X.lineWidth=1;X.beginPath();X.arc(p.x,p.y,r-1,Math.PI*1.1,Math.PI*1.8);X.stroke()
  }
  X.shadowBlur=0;X.fillStyle=p.type==='atp'?'#5d4308':'#07101d';X.font=(p.type==='atp'?'900 7px':'950 8px')+' system-ui';X.textAlign='center';X.textBaseline='middle';X.fillText(c[2],p.x,p.y+.5);X.restore()
 };
 M.pos=(p,g)=>!p.b?null:p.b.k==='na'?g.na[p.b.i]:p.b.k==='k'?g.k[p.b.i]:g.at;
 M.cnt=()=>{let n=0,k=0,a=0;for(const p of S.p)if(p.b){if(p.b.k==='na')n++;else if(p.b.k==='k')k++;else a++}return{n,k,a}};
 M.bind=p=>{
  if(S.busy)return false;const g=S.g,arr=p.type==='na'&&S.phase==='na'?g.na.map((s,i)=>({s,k:'na',i})):p.type==='k'&&S.phase==='k'?g.k.map((s,i)=>({s,k:'k',i})):p.type==='atp'&&S.phase==='na'?[{s:g.at,k:'atp',i:0}]:[];
  let z=null,dd=999;for(const q of arr){if(M.bound(q.k,q.i))continue;const d=M.D(p.x,p.y,q.s.x,q.s.y);if(d<dd){dd=d;z=q}}
  if(z&&dd<30){p.b={k:z.k,i:z.i};p.x=z.s.x;p.y=z.s.y;p.vx=p.vy=0;M.cycle();return true}return false
 };
})();