(()=>{const M=window.MembraneLab;if(!M)return;const {C,S,$}=M;
 const pt=e=>{const r=C.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
 C.onpointerdown=e=>{const m=pt(e);let b=null,dd=99;for(const p of S.p){if(p.b||p.c||S.busy)continue;const d=M.D(m.x,m.y,p.x,p.y);if(d<22&&d<dd){b=p;dd=d}}if(b){S.drag=b.id;b.vx=b.vy=0;C.setPointerCapture(e.pointerId)}};
 C.onpointermove=e=>{if(S.drag==null)return;const p=S.p.find(q=>q.id===S.drag),m=pt(e);if(p){p.x=M.clamp(m.x,18,C.clientWidth-18);p.y=M.clamp(m.y,18,C.clientHeight-18);M.keep(p);M.resolveCollisions()}};
 const up=e=>{if(S.drag==null)return;const p=S.p.find(q=>q.id===S.drag);S.drag=null;if(p&&!M.bind(p)){M.keep(p);M.leak(p,performance.now());M.resolveCollisions()}try{C.releasePointerCapture(e.pointerId)}catch(_){}};C.onpointerup=up;C.onpointercancel=up;
 [['addNa','na','inside'],['addK','k','outside'],['addAtp','atp','inside']].forEach(([id,t,s])=>$(id).onclick=()=>{if(!S.busy){M.add(t,s);M.resolveCollisions();M.ui()}});
 $('resetMembrane').onclick=()=>{S.phase='load';S.busy=false;S.kind='';S.t0=0;S.duration=0;S.progress=0;S.pumpConf=0;S.cycles=0;S.atp=0;S.drag=null;S.msg='Encaixe 3 Na⁺, 2 K⁺ e 1 ATP para iniciar a troca.';M.seed();M.ui()};
 async function user(){try{const r=await fetch('/api/auth/me',{credentials:'same-origin'});if(r.status===401){location.href='/login.html';return}if(!r.ok)return;const d=await r.json(),u=d.usuario||{},n=u.nome||'Usuário',i=n[0].toUpperCase();$('nomeSidebar').textContent=n;$('emailSidebar').textContent=u.email||'';$('nomeHeader').textContent=n;$('avatarSidebar').textContent=i;$('avatarHeader').textContent=i}catch(_){}}
 $('logoutSidebar').onclick=async()=>{try{await fetch('/api/auth/logout',{method:'POST',credentials:'same-origin'})}finally{location.href='/login.html'}};
 M.seed();M.ui();user();requestAnimationFrame(M.draw);
})();