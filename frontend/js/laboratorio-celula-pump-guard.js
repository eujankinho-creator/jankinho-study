(()=>{const M=window.MembraneLab;if(!M)return;const C=M.C,S=M.S,pt=e=>{const r=C.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
 C.addEventListener('pointermove',e=>{if(S.drag==null)return;const p=S.p.find(q=>q.id===S.drag),m=pt(e);if(p){p.x=M.clamp(m.x,18,C.clientWidth-18);p.y=M.clamp(m.y,18,C.clientHeight-18);M.keep(p);M.resolveCollisions()}});
})();