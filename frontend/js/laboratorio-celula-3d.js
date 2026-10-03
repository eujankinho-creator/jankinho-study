(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const TAU = Math.PI * 2;

  let lab = null;
  let canvas = null;
  let ctx = null;
  let mode = "2d";
  let yaw = -0.52;
  let pitch = 0.23;
  let rotating = false;
  let activePointer = null;
  let lastPointer = null;
  let draggingIon = null;
  let draggingOrigin = null;
  const depthOffsets = new Map();
  let projectedIons = [];
  let animationFrame = 0;

  function canvasInfo() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    return { dpr, w: width / dpr, h: height / dpr };
  }

  function rotate3(point) {
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);

    const x1 = point.x * cy - point.z * sy;
    const z1 = point.x * sy + point.z * cy;
    const y1 = point.y * cp - z1 * sp;
    const z2 = point.y * sp + z1 * cp;
    return { x: x1, y: y1, z: z2 };
  }

  function project(point, view) {
    const p = rotate3(point);
    const camera = 4.6;
    const scale = Math.min(view.w, view.h) * 0.31;
    const perspective = camera / Math.max(1.4, camera - p.z);
    return {
      x: view.w * 0.51 + p.x * scale * perspective,
      y: view.h * 0.51 - p.y * scale * perspective,
      z: p.z,
      scale: perspective
    };
  }

  function seededDepth(id) {
    if (!depthOffsets.has(id)) {
      const raw = (((id * 9301 + 49297) % 233280) / 233280) * 2 - 1;
      depthOffsets.set(id, raw * 0.48);
    }
    return depthOffsets.get(id);
  }

  function ionWorld(ion) {
    const g = lab.geometry();
    let x = (ion.nx * g.w - g.cx) / g.r;
    let y = -(ion.ny * g.h - g.cy) / g.r;
    let z = seededDepth(ion.id);
    let r = Math.hypot(x, y, z);

    if (ion.zone === "in") {
      if (r > 0.72) {
        const s = 0.72 / Math.max(r, 0.001);
        x *= s; y *= s; z *= s;
      }
    } else if (r < 1.14) {
      const planar = Math.hypot(x, y) || 1;
      x *= 1.14 / planar;
      y *= 1.14 / planar;
      r = Math.hypot(x, y, z);
    }

    return { x, y, z };
  }

  function surfacePoint(angle, latitude) {
    const lat = latitude || 0;
    const c = Math.cos(lat);
    return {
      x: Math.cos(angle) * c,
      y: Math.sin(lat),
      z: Math.sin(angle) * c
    };
  }

  function drawGrid(view) {
    ctx.save();
    ctx.lineWidth = 1;

    const rings = [-0.62, -0.3, 0, 0.3, 0.62];
    rings.forEach((lat) => {
      const pts = [];
      for (let i = 0; i <= 72; i += 1) {
        pts.push(project(surfacePoint((i / 72) * TAU, lat), view));
      }
      ctx.beginPath();
      pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
      ctx.strokeStyle = lat === 0 ? "rgba(157,184,229,.16)" : "rgba(123,151,197,.075)";
      ctx.stroke();
    });

    for (let meridian = 0; meridian < 8; meridian += 1) {
      const a = (meridian / 8) * TAU;
      const pts = [];
      for (let i = 0; i <= 52; i += 1) {
        const lat = -Math.PI / 2 + (i / 52) * Math.PI;
        const c = Math.cos(lat);
        pts.push(project({ x: Math.cos(a) * c, y: Math.sin(lat), z: Math.sin(a) * c }, view));
      }
      ctx.beginPath();
      pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
      ctx.strokeStyle = "rgba(123,151,197,.065)";
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawMembrane(view) {
    const center = project({ x: 0, y: 0, z: 0 }, view);
    const edge = project({ x: 1, y: 0, z: 0 }, view);
    const radius = Math.abs(edge.x - center.x);

    const body = ctx.createRadialGradient(
      center.x - radius * .24,
      center.y - radius * .22,
      radius * .08,
      center.x,
      center.y,
      radius * 1.04
    );
    body.addColorStop(0, "rgba(62,89,128,.25)");
    body.addColorStop(.55, "rgba(14,29,49,.74)");
    body.addColorStop(1, "rgba(3,8,15,.96)");

    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, TAU);
    ctx.fillStyle = body;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, TAU);
    ctx.strokeStyle = "rgba(144,174,222,.24)";
    ctx.lineWidth = 7;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center.x, center.y, Math.max(0, radius - 8), 0, TAU);
    ctx.strokeStyle = "rgba(188,209,240,.13)";
    ctx.lineWidth = 1.3;
    ctx.stroke();

    drawGrid(view);

    const strength = clamp(Math.abs(lab.state.vm) / 75, 0, 1);
    const insideNegative = lab.state.vm <= 0;
    if (strength > .05) {
      for (let i = 0; i < 14; i += 1) {
        const angle = (i / 14) * TAU;
        const inner = project(surfacePoint(angle, 0.04), view);
        const outer = project({ ...surfacePoint(angle, 0.04), x: surfacePoint(angle, 0.04).x * 1.13, z: surfacePoint(angle, 0.04).z * 1.13 }, view);
        ctx.globalAlpha = .18 + strength * .48;
        ctx.fillStyle = insideNegative ? "#7f9fff" : "#ffc06b";
        ctx.font = "800 9px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(insideNegative ? "−" : "+", inner.x, inner.y);
        ctx.fillStyle = insideNegative ? "#ffc06b" : "#7f9fff";
        ctx.fillText(insideNegative ? "+" : "−", outer.x, outer.y);
      }
      ctx.globalAlpha = 1;
    }
  }

  function drawProtein(view, point, type, label) {
    const p = project(point, view);
    const front = p.z > -0.65;
    if (!front) return null;
    const isNa = type === "Na";
    const isK = type === "K";
    const accent = isNa ? "#6dcff6" : isK ? "#eab45a" : "#b7a3ff";
    const width = (type === "pump" ? 34 : 22) * p.scale;
    const height = (type === "pump" ? 44 : 34) * p.scale;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(-yaw * .18);
    ctx.beginPath();
    ctx.roundRect(-width / 2, -height / 2, width, height, Math.min(10, width * .3));
    ctx.fillStyle = type === "pump"
      ? "rgba(48,43,70,.97)"
      : isNa ? "rgba(17,60,82,.96)" : "rgba(75,50,20,.96)";
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.globalAlpha = .62;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.globalAlpha = 1;
    if (type !== "pump") {
      ctx.beginPath();
      ctx.roundRect(-2.5 * p.scale, -height * .32, 5 * p.scale, height * .64, 3);
      ctx.fillStyle = "rgba(4,8,13,.88)";
      ctx.fill();
    }
    ctx.restore();

    if (label) {
      ctx.fillStyle = accent;
      ctx.font = "800 7px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, p.x, p.y + height * .72);
    }
    return p;
  }

  function pumpWorld(pump, index) {
    const latitude = [-0.34, 0.08, 0.34][index] || 0;
    return surfacePoint(pump.angle, latitude);
  }

  function pumpSocketWorld(pump, pumpIndex, type, slotIndex) {
    const base = pumpWorld(pump, pumpIndex);
    const tangent = { x: -base.z, y: 0, z: base.x };
    const outward = type === "Na" ? -0.04 : 0.08;
    const offsets = type === "Na" ? [-0.12, 0, 0.12] : [-0.08, 0.08];
    const o = offsets[slotIndex] || 0;
    return {
      x: base.x * (1 + outward) + tangent.x * o,
      y: base.y + (type === "Na" ? -0.075 : 0.075),
      z: base.z * (1 + outward) + tangent.z * o
    };
  }

  function drawPumps(view) {
    lab.state.pumps.forEach((pump, index) => {
      const base = pumpWorld(pump, index);
      const p = drawProtein(view, base, "pump", "3Na⁺ : 2K⁺");
      if (!p) return;

      [["Na", pump.naSlots], ["K", pump.kSlots]].forEach(([type, slots]) => {
        slots.forEach((ionId, slotIndex) => {
          const wp = pumpSocketWorld(pump, index, type, slotIndex);
          const sp = project(wp, view);
          if (sp.z < -0.75) return;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 8.5 * sp.scale, 0, TAU);
          ctx.fillStyle = ionId !== null ? "rgba(8,13,20,.88)" : "rgba(3,7,12,.96)";
          ctx.fill();
          ctx.strokeStyle = type === "Na" ? "rgba(109,207,246,.72)" : "rgba(234,180,90,.72)";
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });
    });
  }

  function drawChannels(view) {
    const channels = lab.channels || [];
    channels.forEach((channel, index) => {
      const lat = [-0.18, .18, -.12, .14][index] || 0;
      drawProtein(
        view,
        surfacePoint(channel.angle, lat),
        channel.type,
        channel.type + "⁺"
      );
    });
  }

  function boundIonWorld(ion) {
    if (!ion.boundPumpId) return null;
    const pumpIndex = lab.state.pumps.findIndex((p) => p.id === ion.boundPumpId);
    if (pumpIndex < 0) return null;
    const pump = lab.state.pumps[pumpIndex];
    return pumpSocketWorld(pump, pumpIndex, ion.boundSlotType, ion.boundSlotIndex);
  }

  function drawIon(view, ion, world) {
    const p = project(world, view);
    if (p.z < -1.55) return null;
    const radius = clamp(10.5 * p.scale, 7.5, 16);
    const isNa = ion.type === "Na";
    const accent = isNa ? "#6dcff6" : "#eab45a";

    const sphere = ctx.createRadialGradient(
      p.x - radius * .25,
      p.y - radius * .28,
      Math.max(1, radius * .08),
      p.x,
      p.y,
      radius
    );
    sphere.addColorStop(0, isNa ? "rgba(197,241,255,.95)" : "rgba(255,232,191,.95)");
    sphere.addColorStop(.24, isNa ? "rgba(91,183,224,.94)" : "rgba(223,158,72,.94)");
    sphere.addColorStop(1, isNa ? "rgba(10,51,70,.98)" : "rgba(73,43,10,.98)");

    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, TAU);
    ctx.fillStyle = sphere;
    ctx.fill();
    ctx.strokeStyle = ion.boundPumpId ? "rgba(255,255,255,.6)" : accent;
    ctx.globalAlpha = ion.boundPumpId ? .9 : .72;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.fillStyle = isNa ? "#e7faff" : "#fff2d4";
    ctx.font = "800 " + Math.max(7, radius * .62) + "px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(ion.type + "⁺", p.x, p.y + .3);

    return { ion, x: p.x, y: p.y, r: radius + 5, z: p.z };
  }

  function render() {
    if (!canvas || mode !== "3d") {
      animationFrame = requestAnimationFrame(render);
      return;
    }

    const view = canvasInfo();
    ctx.save();
    ctx.scale(view.dpr, view.dpr);
    ctx.clearRect(0, 0, view.w, view.h);

    const bg = ctx.createRadialGradient(view.w * .5, view.h * .45, 20, view.w * .5, view.h * .5, Math.max(view.w, view.h) * .72);
    bg.addColorStop(0, "rgba(20,35,57,.36)");
    bg.addColorStop(1, "rgba(3,7,12,.02)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, view.w, view.h);

    drawMembrane(view);
    drawChannels(view);
    drawPumps(view);

    projectedIons = lab.state.ions
      .map((ion) => {
        const world = boundIonWorld(ion) || ionWorld(ion);
        return { ion, world, projected: project(world, view) };
      })
      .sort((a, b) => a.projected.z - b.projected.z)
      .map((item) => drawIon(view, item.ion, item.world))
      .filter(Boolean);

    ctx.restore();
    animationFrame = requestAnimationFrame(render);
  }

  function setMode(next) {
    mode = next === "3d" ? "3d" : "2d";
    document.body.classList.toggle("membrane-3d", mode === "3d");
    const b2 = $("mode2d");
    const b3 = $("mode3d");
    if (b2) {
      b2.classList.toggle("active", mode === "2d");
      b2.setAttribute("aria-pressed", String(mode === "2d"));
    }
    if (b3) {
      b3.classList.toggle("active", mode === "3d");
      b3.setAttribute("aria-pressed", String(mode === "3d"));
    }
    const chip = $("interactionChip");
    if (chip) {
      chip.textContent = mode === "3d"
        ? "gire a cena · arraste íons · roda = profundidade"
        : "clique + arraste";
    }
    try { localStorage.setItem("membrane_view_mode", mode); } catch (e) {}
  }

  function pointerPos(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function hitIon(pos) {
    let hit = null;
    projectedIons.forEach((item) => {
      const d = Math.hypot(pos.x - item.x, pos.y - item.y);
      if (d <= item.r && (!hit || item.z > hit.z)) hit = item;
    });
    return hit ? hit.ion : null;
  }

  function confineIon(ion) {
    const g = lab.geometry();
    let x = ion.nx * g.w;
    let y = ion.ny * g.h;
    let dx = x - g.cx;
    let dy = y - g.cy;
    let r = Math.hypot(dx, dy) || 1;
    const minOut = g.r + 22;
    const maxIn = g.r - 22;

    if (ion.zone === "in" && r > maxIn) {
      x = g.cx + dx / r * maxIn;
      y = g.cy + dy / r * maxIn;
    } else if (ion.zone === "out" && r < minOut) {
      x = g.cx + dx / r * minOut;
      y = g.cy + dy / r * minOut;
    }

    ion.nx = clamp(x / g.w, .025, .975);
    ion.ny = clamp(y / g.h, .035, .965);
  }

  function onPointerDown(event) {
    if (mode !== "3d") return;
    const pos = pointerPos(event);
    const ion = hitIon(pos);

    activePointer = event.pointerId;
    lastPointer = pos;
    canvas.setPointerCapture(event.pointerId);

    if (ion && !ion.transport && !ion.boundPumpId) {
      draggingIon = ion;
      draggingOrigin = { zone: ion.zone, nx: ion.nx, ny: ion.ny };
      lab.state.draggingId = ion.id;
      lab.state.draggingStart = { ...draggingOrigin };
      canvas.classList.add("dragging-ion-3d");
    } else {
      rotating = true;
      canvas.classList.add("rotating-3d");
    }
    event.preventDefault();
  }

  function onPointerMove(event) {
    if (mode !== "3d" || activePointer !== event.pointerId || !lastPointer) return;
    const pos = pointerPos(event);
    const dx = pos.x - lastPointer.x;
    const dy = pos.y - lastPointer.y;
    lastPointer = pos;

    if (draggingIon) {
      const g = lab.geometry();
      const targetNx = clamp(draggingIon.nx + dx / Math.max(g.w, 1), .025, .975);
      const targetNy = clamp(draggingIon.ny + dy / Math.max(g.h, 1), .035, .965);
      const result = lab.moveExternalIon
        ? lab.moveExternalIon(draggingIon, draggingOrigin, targetNx * g.w, targetNy * g.h)
        : "moved";

      if (result === "bound" || result === "transferred") {
        lab.state.draggingId = null;
        lab.state.draggingStart = null;
        draggingIon = null;
        draggingOrigin = null;
        canvas.classList.remove("dragging-ion-3d");
      }
    } else if (rotating) {
      yaw += dx * .008;
      pitch = clamp(pitch + dy * .006, -.78, .78);
    }
    event.preventDefault();
  }

  function finishPointer(event) {
    if (activePointer !== event.pointerId) return;

    if (draggingIon && draggingOrigin) {
      lab.state.draggingId = null;
      lab.state.draggingStart = null;
    }

    draggingIon = null;
    draggingOrigin = null;
    rotating = false;
    activePointer = null;
    lastPointer = null;
    canvas.classList.remove("dragging-ion-3d", "rotating-3d");

    if (canvas.hasPointerCapture && canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
  }

  function onWheel(event) {
    if (mode !== "3d") return;
    const pos = pointerPos(event);
    const ion = draggingIon || hitIon(pos);
    if (!ion) return;
    const current = seededDepth(ion.id);
    depthOffsets.set(ion.id, clamp(current - event.deltaY * .0012, -.76, .76));
    event.preventDefault();
  }

  function init() {
    lab = window.__membraneLab;
    canvas = $("cellCanvas3d");
    if (!lab || !canvas) return;
    ctx = canvas.getContext("2d");

    $("mode2d")?.addEventListener("click", () => setMode("2d"));
    $("mode3d")?.addEventListener("click", () => setMode("3d"));

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", finishPointer);
    canvas.addEventListener("pointercancel", finishPointer);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    let saved = "3d";
    try { saved = localStorage.getItem("membrane_view_mode") || "3d"; } catch (e) {}
    setMode(saved);
    cancelAnimationFrame(animationFrame);
    render();
  }

  function waitForLab() {
    if (window.__membraneLab) {
      init();
    } else {
      setTimeout(waitForLab, 40);
    }
  }

  waitForLab();
})();