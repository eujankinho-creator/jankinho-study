(function () {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function angleDistance(a, b) {
    let d = Math.abs(a - b) % (Math.PI * 2);
    if (d > Math.PI) d = Math.PI * 2 - d;
    return d;
  }

  function api(url, options) {
    return fetch(url, Object.assign({
      credentials: "same-origin"
    }, options || {})).then(function (response) {
      if (response.status === 401) {
        location.href = "/login.html";
        throw new Error("Não autenticado.");
      }

      if (!response.ok) {
        throw new Error("Falha de comunicação.");
      }

      return response.json();
    });
  }

  const state = {
    ions: [],
    nextIonId: 1,
    draggingId: null,
    draggingStart: null,
    pumpOn: true,
    naChannelOpen: true,
    kChannelOpen: true,
    vm: -70,
    stimulusOffset: 0,
    history: [],
    lastHistory: 0,
    lastPumpCycle: 0,
    lastLeakCycle: 0,
    pumpPulseUntil: 0,
    eventPulse: null,
    actionPotential: null,
    lastFrame: performance.now()
  };

  const INITIAL = {
    naIn: 5,
    naOut: 18,
    kIn: 18,
    kOut: 5
  };

  const CHANNELS = [
    { type: "Na", angle: -1.15, color: "#38bdf8" },
    { type: "Na", angle: 0.08, color: "#38bdf8" },
    { type: "K", angle: 1.03, color: "#f59e0b" },
    { type: "K", angle: 2.48, color: "#f59e0b" }
  ];

  const PUMP_ANGLE = -2.32;

  function canvasInfo(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    return {
      dpr: dpr,
      width: width,
      height: height,
      cssWidth: width / dpr,
      cssHeight: height / dpr
    };
  }

  function geometry() {
    const canvas = $("cellCanvas");
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(rect.width, 1);
    const h = Math.max(rect.height, 1);
    const r = Math.min(w, h) * .285;

    return {
      w: w,
      h: h,
      cx: w * .51,
      cy: h * .51,
      r: r
    };
  }

  function normalizedToPoint(ion, g) {
    return {
      x: ion.nx * g.w,
      y: ion.ny * g.h
    };
  }

  function zoneAt(x, y, g) {
    const dx = x - g.cx;
    const dy = y - g.cy;
    return Math.sqrt(dx * dx + dy * dy) < g.r - 5 ? "in" : "out";
  }

  function randomPoint(zone) {
    const g = geometry();
    let x;
    let y;
    let tries = 0;

    do {
      if (zone === "in") {
        const angle = Math.random() * Math.PI * 2;
        const radius = g.r * (.18 + Math.random() * .62);
        x = g.cx + Math.cos(angle) * radius;
        y = g.cy + Math.sin(angle) * radius;
      } else {
        x = 26 + Math.random() * Math.max(40, g.w - 52);
        y = 28 + Math.random() * Math.max(40, g.h - 56);
      }

      tries += 1;
    } while (zoneAt(x, y, g) !== zone && tries < 120);

    return {
      nx: clamp(x / g.w, .03, .97),
      ny: clamp(y / g.h, .04, .96)
    };
  }

  function createIon(type, zone) {
    const point = randomPoint(zone);

    return {
      id: state.nextIonId++,
      type: type,
      zone: zone,
      nx: point.nx,
      ny: point.ny,
      radius: 13,
      wobble: Math.random() * Math.PI * 2,
      flashUntil: 0
    };
  }

  function spawnInitialIons() {
    state.ions = [];
    state.nextIonId = 1;

    for (let i = 0; i < INITIAL.naOut; i += 1) state.ions.push(createIon("Na", "out"));
    for (let i = 0; i < INITIAL.naIn; i += 1) state.ions.push(createIon("Na", "in"));
    for (let i = 0; i < INITIAL.kIn; i += 1) state.ions.push(createIon("K", "in"));
    for (let i = 0; i < INITIAL.kOut; i += 1) state.ions.push(createIon("K", "out"));
  }

  function counts() {
    const result = {
      naIn: 0,
      naOut: 0,
      kIn: 0,
      kOut: 0
    };

    state.ions.forEach(function (ion) {
      const key = ion.type.toLowerCase() + (ion.zone === "in" ? "In" : "Out");
      result[key] += 1;
    });

    return result;
  }

  function concentrations(current) {
    const naDelta = current.naIn - INITIAL.naIn;
    const kOutDelta = current.kOut - INITIAL.kOut;

    return {
      naIn: clamp(12 + naDelta * 3, 2, 150),
      naOut: clamp(145 - naDelta * 3, 25, 180),
      kOut: clamp(4 + kOutDelta * 3, 1, 120),
      kIn: clamp(140 - kOutDelta * 3, 20, 170)
    };
  }

  function targetVm() {
    const current = counts();
    const naDelta = current.naIn - INITIAL.naIn;
    const kOutDelta = current.kOut - INITIAL.kOut;
    const pumpPenalty = state.pumpOn ? 0 : 1.8;
    return clamp(-70 + naDelta * 3.6 - kOutDelta * 2.7 + state.stimulusOffset + pumpPenalty, -95, 20);
  }

  function setExplanation(title, text, equation) {
    $("explanationTitle").textContent = title;
    $("explanationText").textContent = text;
    $("explanationEquation").textContent = equation;
  }

  function setHint(text) {
    $("dragHint").textContent = text;
    $("dragHint").style.opacity = "1";
  }

  function channelIsOpen(type) {
    return type === "Na" ? state.naChannelOpen : state.kChannelOpen;
  }

  function nearestValidChannel(type, angle) {
    let best = null;
    let distance = Infinity;

    CHANNELS.forEach(function (channel) {
      if (channel.type !== type) return;
      const d = angleDistance(channel.angle, angle);
      if (d < distance) {
        distance = d;
        best = channel;
      }
    });

    if (distance <= .24) return best;
    return null;
  }

  function placeIonNearAngle(ion, angle, zone, extra) {
    const g = geometry();
    const radial = zone === "in" ? g.r - 32 : g.r + 34 + (extra || 0);
    const x = g.cx + Math.cos(angle) * radial;
    const y = g.cy + Math.sin(angle) * radial;

    ion.zone = zone;
    ion.nx = clamp(x / g.w, .025, .975);
    ion.ny = clamp(y / g.h, .035, .965);
    ion.flashUntil = performance.now() + 700;
  }

  function transferThroughChannel(ion, newZone, angle) {
    const oldZone = ion.zone;
    ion.zone = newZone;
    state.eventPulse = {
      type: ion.type,
      angle: angle,
      until: performance.now() + 780
    };

    if (ion.type === "Na" && oldZone === "out" && newZone === "in") {
      setExplanation(
        "Na⁺ entrou na célula",
        "O gradiente químico e a atração elétrica favorecem a entrada de Na⁺. A carga positiva entrando torna o interior menos negativo: ocorre despolarização.",
        "Na⁺ → interior  ·  Vm sobe"
      );
      setHint("Boa: a entrada de Na⁺ despolarizou a membrana.");
    } else if (ion.type === "Na" && oldZone === "in" && newZone === "out") {
      setExplanation(
        "Na⁺ saiu da célula",
        "Retirar carga positiva do citoplasma favorece maior negatividade interna. Em condições fisiológicas, a bomba Na⁺/K⁺ é o principal mecanismo sustentando esse gradiente ao longo do tempo.",
        "Na⁺ → exterior  ·  interior mais negativo"
      );
    } else if (ion.type === "K" && oldZone === "in" && newZone === "out") {
      placeIonNearAngle(ion, angle, "out", 18);
      setExplanation(
        "K⁺ saiu e sofreu oposição elétrica",
        "O gradiente químico empurra K⁺ para fora, mas o interior negativo passa a atrair esse cátion de volta. O equilíbrio entre essas forças ajuda a estabelecer o potencial de repouso.",
        "K⁺ → exterior  ·  hiperpolarização"
      );
      setHint("Perceba a 'repulsão' para fora e a atração elétrica tentando limitar a saída de K⁺.");
    } else if (ion.type === "K" && oldZone === "out" && newZone === "in") {
      setExplanation(
        "K⁺ entrou na célula",
        "A entrada de carga positiva reduz parte da negatividade do citoplasma. No repouso fisiológico, porém, o gradiente de K⁺ favorece principalmente sua saída.",
        "K⁺ → interior  ·  Vm sobe"
      );
    }
  }

  function rejectCrossing(ion, original, reason) {
    ion.zone = original.zone;
    ion.nx = original.nx;
    ion.ny = original.ny;
    ion.flashUntil = performance.now() + 450;

    setExplanation(
      "Membrana seletiva",
      reason,
      "sem canal compatível → sem passagem"
    );
    setHint("Tente alinhar o íon com um canal da mesma cor.");
  }

  function pointerPosition(event) {
    const rect = $("cellCanvas").getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function findIonAt(x, y) {
    const g = geometry();
    let best = null;
    let bestDistance = 25;

    state.ions.forEach(function (ion) {
      const p = normalizedToPoint(ion, g);
      const dx = p.x - x;
      const dy = p.y - y;
      const d = Math.sqrt(dx * dx + dy * dy);

      if (d < bestDistance) {
        bestDistance = d;
        best = ion;
      }
    });

    return best;
  }

  function bindCellInteraction() {
    const canvas = $("cellCanvas");

    canvas.addEventListener("pointerdown", function (event) {
      const p = pointerPosition(event);
      const ion = findIonAt(p.x, p.y);
      if (!ion) return;

      state.draggingId = ion.id;
      state.draggingStart = {
        zone: ion.zone,
        nx: ion.nx,
        ny: ion.ny
      };

      canvas.classList.add("dragging");
      canvas.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    canvas.addEventListener("pointermove", function (event) {
      if (!state.draggingId) return;

      const ion = state.ions.find(function (item) {
        return item.id === state.draggingId;
      });

      if (!ion) return;

      const rect = canvas.getBoundingClientRect();
      const p = pointerPosition(event);

      ion.nx = clamp(p.x / rect.width, .02, .98);
      ion.ny = clamp(p.y / rect.height, .025, .975);
      event.preventDefault();
    });

    function finishDrag(event) {
      if (!state.draggingId) return;

      const ion = state.ions.find(function (item) {
        return item.id === state.draggingId;
      });
      const original = state.draggingStart;

      state.draggingId = null;
      state.draggingStart = null;
      canvas.classList.remove("dragging");

      if (canvas.hasPointerCapture && canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }

      if (!ion || !original) return;

      const g = geometry();
      const p = normalizedToPoint(ion, g);
      const newZone = zoneAt(p.x, p.y, g);

      if (newZone === original.zone) {
        ion.zone = original.zone;
        return;
      }

      const angle = Math.atan2(p.y - g.cy, p.x - g.cx);
      const channel = nearestValidChannel(ion.type, angle);

      if (!channel) {
        rejectCrossing(
          ion,
          original,
          "A bicamada lipídica bloqueou o cátion. Para atravessar, leve-o até um canal compatível localizado na própria membrana."
        );
        return;
      }

      if (!channelIsOpen(ion.type)) {
        rejectCrossing(
          ion,
          original,
          "Você encontrou o canal correto, mas ele está fechado. Reabra o canal e tente novamente."
        );
        return;
      }

      transferThroughChannel(ion, newZone, channel.angle);
    }

    canvas.addEventListener("pointerup", finishDrag);
    canvas.addEventListener("pointercancel", finishDrag);
  }

  function moveOne(type, fromZone, toZone, angle, extra) {
    const ion = state.ions.find(function (item) {
      return item.type === type && item.zone === fromZone && item.id !== state.draggingId;
    });

    if (!ion) return false;

    placeIonNearAngle(ion, angle, toZone, extra || 0);
    return true;
  }

  function runPumpCycle(now) {
    if (!state.pumpOn || state.actionPotential) return;

    let moved = 0;
    for (let i = 0; i < 3; i += 1) {
      if (moveOne("Na", "in", "out", PUMP_ANGLE, i * 4)) moved += 1;
    }

    for (let i = 0; i < 2; i += 1) {
      if (moveOne("K", "out", "in", PUMP_ANGLE + .12, i * 4)) moved += 1;
    }

    state.pumpPulseUntil = now + 900;

    if (moved > 0) {
      setExplanation(
        "Bomba Na⁺/K⁺ em ação",
        "A ATPase remove 3 Na⁺ do citoplasma e traz 2 K⁺ para dentro por ciclo. Isso preserva os gradientes e contribui levemente para a negatividade interna.",
        "3 Na⁺ → fora  ·  2 K⁺ → dentro  ·  ATP"
      );
    }
  }

  function passiveLeak() {
    if (state.actionPotential) return;

    if (state.naChannelOpen) {
      moveOne("Na", "out", "in", -1.15, 0);
    }

    if (state.kChannelOpen) {
      moveOne("K", "in", "out", 1.03, 8);
    }

    if (!state.pumpOn) {
      setExplanation(
        "Bomba desligada",
        "Sem a ATPase Na⁺/K⁺, os gradientes começam a se dissipar lentamente pelos fluxos passivos. O potencial tende a perder estabilidade e caminhar em direção a valores menos negativos.",
        "gradientes ↓  ·  Vm → 0 mV"
      );
    }
  }

  function triggerActionPotential(now) {
    if (state.actionPotential) return;

    state.actionPotential = {
      start: now,
      sodiumMoved: false,
      potassiumMoved: false
    };

    setExplanation(
      "Limiar atingido",
      "O limiar foi alcançado. Canais de Na⁺ dependentes de voltagem abrem em cascata e produzem uma despolarização rápida: começa o potencial de ação.",
      "Vm ≥ -55 mV  →  disparo"
    );
  }

  function actionPotentialVoltage(now) {
    const ap = state.actionPotential;
    if (!ap) return null;

    const t = now - ap.start;

    if (t < 220) {
      if (!ap.sodiumMoved && t > 40) {
        for (let i = 0; i < 4; i += 1) moveOne("Na", "out", "in", -.98 + i * .08, i * 2);
        ap.sodiumMoved = true;
      }

      const u = clamp(t / 220, 0, 1);
      setPhase("despolarização", "entrada rápida de Na⁺");
      return -55 + u * 85;
    }

    if (t < 470) {
      if (!ap.potassiumMoved) {
        for (let i = 0; i < 4; i += 1) moveOne("K", "in", "out", .94 + i * .08, i * 4);
        ap.potassiumMoved = true;
        setExplanation(
          "Repolarização",
          "Os canais de Na⁺ inativam e a permeabilidade ao K⁺ domina. A saída de K⁺ devolve negatividade ao interior.",
          "K⁺ → exterior  ·  Vm cai"
        );
      }

      const u = clamp((t - 220) / 250, 0, 1);
      setPhase("repolarização", "saída de K⁺");
      return 30 - u * 110;
    }

    if (t < 720) {
      const u = clamp((t - 470) / 250, 0, 1);
      setPhase("hiperpolarização", "K⁺ ainda saindo");
      return -80 + u * 10;
    }

    state.actionPotential = null;
    state.stimulusOffset = 0;
    setPhase("repouso", "recuperação dos gradientes");
    setExplanation(
      "Retorno ao repouso",
      "Após a hiperpolarização, os canais voltam ao estado basal. Vazamentos seletivos e a bomba Na⁺/K⁺ ajudam a restabelecer as condições de repouso.",
      "Vm → -70 mV"
    );
    return null;
  }

  function setPhase(name, detail) {
    $("phaseMetric").textContent = name;
    $("phaseMetricDetail").textContent = detail;

    $("lessonRest").classList.toggle("active", name === "repouso");
    $("lessonDepolarization").classList.toggle("active", name === "despolarização");
    $("lessonRepolarization").classList.toggle("active", name === "repolarização" || name === "hiperpolarização");
  }

  function updateVm(now, delta) {
    const apVoltage = actionPotentialVoltage(now);

    if (apVoltage !== null) {
      state.vm = apVoltage;
      return;
    }

    if (state.stimulusOffset > 0) {
      state.stimulusOffset = Math.max(0, state.stimulusOffset - delta * .0042);
    }

    const target = targetVm();
    state.vm += (target - state.vm) * Math.min(1, delta * .004);

    if (state.vm >= -55 && !state.actionPotential) {
      triggerActionPotential(now);
    }

    if (!state.actionPotential) {
      if (state.vm > -65) {
        setPhase("despolarização", "interior menos negativo");
      } else if (state.vm < -75) {
        setPhase("hiperpolarização", "interior mais negativo");
      } else {
        setPhase("repouso", "gradientes preservados");
      }
    }
  }

  function updateDataUI() {
    const current = counts();
    const c = concentrations(current);

    $("naOutConcentration").textContent = Math.round(c.naOut) + " mM";
    $("naInConcentration").textContent = Math.round(c.naIn) + " mM";
    $("kOutConcentration").textContent = Math.round(c.kOut) + " mM";
    $("kInConcentration").textContent = Math.round(c.kIn) + " mM";

    $("naOutParticles").textContent = current.naOut + " partículas relativas";
    $("naInParticles").textContent = current.naIn + " partículas relativas";
    $("kOutParticles").textContent = current.kOut + " partículas relativas";
    $("kInParticles").textContent = current.kIn + " partículas relativas";

    $("vmValue").textContent = Math.round(state.vm) + " mV";

    let stateText = "repouso";
    if (state.vm >= 0) stateText = "pico positivo";
    else if (state.vm >= -55) stateText = "limiar atingido";
    else if (state.vm > -65) stateText = "despolarizando";
    else if (state.vm < -75) stateText = "hiperpolarizado";

    $("vmState").textContent = stateText;
    $("pumpStateMetric").textContent = state.pumpOn ? "ativa" : "desligada";
  }

  function drawCell(now) {
    const canvas = $("cellCanvas");
    const size = canvasInfo(canvas);
    const ctx = canvas.getContext("2d");
    const dpr = size.dpr;
    const g = geometry();

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size.cssWidth, size.cssHeight);

    const gradient = ctx.createRadialGradient(g.cx, g.cy, g.r * .12, g.cx, g.cy, g.r * 1.08);
    gradient.addColorStop(0, "rgba(28, 51, 92, .56)");
    gradient.addColorStop(.78, "rgba(12, 24, 43, .48)");
    gradient.addColorStop(1, "rgba(8, 15, 28, .25)");

    ctx.beginPath();
    ctx.arc(g.cx, g.cy, g.r - 8, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(g.cx, g.cy, g.r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(118, 154, 246, .17)";
    ctx.lineWidth = 15;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(g.cx, g.cy, g.r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(176, 196, 255, .13)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(g.cx, g.cy, g.r - 11, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(81, 115, 196, .12)";
    ctx.lineWidth = 1;
    ctx.stroke();

    CHANNELS.forEach(function (channel) {
      const x = g.cx + Math.cos(channel.angle) * g.r;
      const y = g.cy + Math.sin(channel.angle) * g.r;
      const open = channelIsOpen(channel.type);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(channel.angle + Math.PI / 2);
      ctx.fillStyle = open ? "rgba(12, 20, 30, .95)" : "rgba(24, 24, 28, .96)";
      ctx.strokeStyle = open ? channel.color : "rgba(130, 136, 148, .24)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-10, -21, 20, 42, 6);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-5, -16);
      ctx.lineTo(-5, 16);
      ctx.moveTo(5, -16);
      ctx.lineTo(5, 16);
      ctx.strokeStyle = open ? channel.color : "rgba(130, 136, 148, .18)";
      ctx.globalAlpha = open ? .6 : .3;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.fillStyle = open ? channel.color : "#525b67";
      ctx.font = "700 8px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const labelRadius = g.r + 33;
      ctx.fillText(
        channel.type + "⁺",
        g.cx + Math.cos(channel.angle) * labelRadius,
        g.cy + Math.sin(channel.angle) * labelRadius
      );
      ctx.restore();
    });

    const pumpX = g.cx + Math.cos(PUMP_ANGLE) * g.r;
    const pumpY = g.cy + Math.sin(PUMP_ANGLE) * g.r;
    const pumpActive = state.pumpOn;

    ctx.save();
    ctx.translate(pumpX, pumpY);
    ctx.rotate(PUMP_ANGLE + Math.PI / 2);
    ctx.fillStyle = pumpActive ? "rgba(167, 139, 250, .14)" : "rgba(90, 90, 100, .08)";
    ctx.strokeStyle = pumpActive ? "#a78bfa" : "rgba(130, 130, 140, .28)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(-14, -22, 28, 44, 9);
    ctx.fill();
    ctx.stroke();

    if (now < state.pumpPulseUntil) {
      ctx.strokeStyle = "rgba(188, 166, 255, .55)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-20, -28, 40, 56, 12);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.fillStyle = pumpActive ? "#bda8ff" : "#59616d";
    ctx.font = "700 8px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Na⁺/K⁺", g.cx + Math.cos(PUMP_ANGLE) * (g.r + 40), g.cy + Math.sin(PUMP_ANGLE) * (g.r + 40));
    ctx.restore();

    if (state.eventPulse && now < state.eventPulse.until) {
      const ratio = 1 - (state.eventPulse.until - now) / 780;
      const px = g.cx + Math.cos(state.eventPulse.angle) * g.r;
      const py = g.cy + Math.sin(state.eventPulse.angle) * g.r;
      ctx.save();
      ctx.strokeStyle = state.eventPulse.type === "Na" ? "rgba(56,189,248,.5)" : "rgba(245,158,11,.5)";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 1 - ratio;
      ctx.beginPath();
      ctx.arc(px, py, 16 + ratio * 35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    state.ions.forEach(function (ion) {
      const p = normalizedToPoint(ion, g);
      const wobble = ion.id === state.draggingId ? 0 : Math.sin(now * .0017 + ion.wobble) * 1.6;
      const x = p.x + wobble;
      const y = p.y + Math.cos(now * .0014 + ion.wobble) * 1.2;
      const isNa = ion.type === "Na";
      const fill = isNa ? "rgba(56, 189, 248, .16)" : "rgba(245, 158, 11, .15)";
      const stroke = isNa ? "#38bdf8" : "#f59e0b";
      const text = isNa ? "#c5f1ff" : "#ffe0aa";

      ctx.save();
      if (ion.id === state.draggingId || now < ion.flashUntil) {
        ctx.shadowColor = stroke;
        ctx.shadowBlur = 14;
      }
      ctx.beginPath();
      ctx.arc(x, y, ion.radius, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.globalAlpha = .9;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.fillStyle = text;
      ctx.font = "800 8px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(ion.type + "⁺", x, y + .5);
      ctx.restore();
    });

    ctx.save();
    ctx.fillStyle = "rgba(138, 155, 188, .36)";
    ctx.font = "700 8px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("MEMBRANA", g.cx, g.cy - g.r - 14);
    ctx.restore();

    ctx.restore();
  }

  function drawVoltageGraph() {
    const canvas = $("voltageCanvas");
    const size = canvasInfo(canvas);
    const ctx = canvas.getContext("2d");
    const dpr = size.dpr;
    const w = size.cssWidth;
    const h = size.cssHeight;
    const padL = 42;
    const padR = 13;
    const padT = 12;
    const padB = 24;
    const minMv = -100;
    const maxMv = 40;

    function yFor(value) {
      const ratio = (maxMv - value) / (maxMv - minMv);
      return padT + ratio * (h - padT - padB);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#080c12";
    ctx.fillRect(0, 0, w, h);

    for (let mv = -100; mv <= 40; mv += 20) {
      const y = yFor(mv);
      ctx.strokeStyle = "rgba(255,255,255,.045)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();

      ctx.fillStyle = "#4e5866";
      ctx.font = "8px system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(mv + " mV", padL - 7, y);
    }

    for (let i = 0; i <= 8; i += 1) {
      const x = padL + (w - padL - padR) * i / 8;
      ctx.strokeStyle = "rgba(255,255,255,.03)";
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, h - padB);
      ctx.stroke();
    }

    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "rgba(246,199,100,.62)";
    ctx.beginPath();
    ctx.moveTo(padL, yFor(-55));
    ctx.lineTo(w - padR, yFor(-55));
    ctx.stroke();

    ctx.strokeStyle = "rgba(104,120,140,.48)";
    ctx.beginPath();
    ctx.moveTo(padL, yFor(-70));
    ctx.lineTo(w - padR, yFor(-70));
    ctx.stroke();
    ctx.restore();

    if (state.history.length > 1) {
      ctx.beginPath();
      state.history.forEach(function (value, index) {
        const x = padL + (w - padL - padR) * index / Math.max(1, state.history.length - 1);
        const y = yFor(value);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = "#78e6a0";
      ctx.lineWidth = 1.8;
      ctx.shadowColor = "rgba(120,230,160,.25)";
      ctx.shadowBlur = 5;
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#4f5967";
    ctx.font = "8px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("tempo →", padL, h - 8);

    ctx.restore();
  }

  function bindControls() {
    $("pumpToggle").addEventListener("click", function () {
      state.pumpOn = !state.pumpOn;
      this.classList.toggle("on", state.pumpOn);
      this.setAttribute("aria-pressed", String(state.pumpOn));

      if (state.pumpOn) {
        setExplanation(
          "Bomba reativada",
          "A Na⁺/K⁺-ATPase volta a usar ATP para restaurar os gradientes: três Na⁺ saem e dois K⁺ entram por ciclo.",
          "3 Na⁺ → fora  ·  2 K⁺ → dentro"
        );
      } else {
        setExplanation(
          "Bomba desligada",
          "Agora os gradientes não são ativamente restaurados. Observe como os vazamentos iônicos passam a modificar lentamente a distribuição e o potencial.",
          "ATPase OFF  ·  gradientes ↓"
        );
      }
    });

    $("naChannelToggle").addEventListener("click", function () {
      state.naChannelOpen = !state.naChannelOpen;
      this.classList.toggle("on", state.naChannelOpen);
      this.setAttribute("aria-pressed", String(state.naChannelOpen));
      setExplanation(
        state.naChannelOpen ? "Canal de Na⁺ aberto" : "Canal de Na⁺ fechado",
        state.naChannelOpen
          ? "Na⁺ pode atravessar a membrana pelos canais azuis quando você o arrasta até a abertura."
          : "Mesmo que o Na⁺ alcance a posição correta, a passagem ficará bloqueada enquanto este canal estiver fechado.",
        state.naChannelOpen ? "PNa ↑" : "PNa ↓"
      );
    });

    $("kChannelToggle").addEventListener("click", function () {
      state.kChannelOpen = !state.kChannelOpen;
      this.classList.toggle("on", state.kChannelOpen);
      this.setAttribute("aria-pressed", String(state.kChannelOpen));
      setExplanation(
        state.kChannelOpen ? "Canal de K⁺ aberto" : "Canal de K⁺ fechado",
        state.kChannelOpen
          ? "K⁺ pode sair pelo canal amarelo; a força química favorece a saída, enquanto a força elétrica tenta atraí-lo de volta."
          : "A redução da permeabilidade ao K⁺ diminui sua saída e altera uma das principais forças do potencial de repouso.",
        state.kChannelOpen ? "PK ↑" : "PK ↓"
      );
    });

    $("stimulusButton").addEventListener("click", function () {
      if (state.actionPotential) return;
      state.stimulusOffset = Math.min(28, state.stimulusOffset + 8);
      setExplanation(
        "Estímulo despolarizante",
        "O estímulo deslocou o potencial para valores menos negativos. Se a membrana alcançar -55 mV, o potencial de ação será disparado.",
        "Vm + 8 mV  ·  alvo: -55 mV"
      );
    });

    $("resetMembrane").addEventListener("click", resetSimulation);
  }

  function resetSimulation() {
    state.pumpOn = true;
    state.naChannelOpen = true;
    state.kChannelOpen = true;
    state.vm = -70;
    state.stimulusOffset = 0;
    state.history = new Array(150).fill(-70);
    state.actionPotential = null;
    state.eventPulse = null;
    state.pumpPulseUntil = 0;
    state.lastPumpCycle = performance.now();
    state.lastLeakCycle = performance.now();

    spawnInitialIons();

    ["pumpToggle", "naChannelToggle", "kChannelToggle"].forEach(function (id) {
      const button = $(id);
      button.classList.add("on");
      button.setAttribute("aria-pressed", "true");
    });

    setPhase("repouso", "gradientes preservados");
    setExplanation(
      "Potencial de repouso",
      "O interior permanece negativo porque a membrana é muito mais permeável ao K⁺, enquanto a bomba Na⁺/K⁺ sustenta os gradientes ao longo do tempo.",
      "Vm ≈ -70 mV"
    );
    setHint("Arraste um Na⁺ externo até um canal azul.");
    updateDataUI();
  }

  async function loadUser() {
    const data = await api("/api/auth/me");
    const user = data.usuario || {};
    const name = user.nome || "Usuário";
    const initial = name.charAt(0).toUpperCase();

    $("nomeSidebar").textContent = name;
    $("emailSidebar").textContent = user.email || "";
    $("nomeHeader").textContent = name;
    $("avatarSidebar").textContent = initial;
    $("avatarHeader").textContent = initial;
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin"
      });
    } finally {
      location.href = "/login.html";
    }
  }

  function loop(now) {
    const delta = Math.min(50, now - state.lastFrame);
    state.lastFrame = now;

    if (state.pumpOn && now - state.lastPumpCycle > 2600) {
      runPumpCycle(now);
      state.lastPumpCycle = now;
    }

    if (now - state.lastLeakCycle > (state.pumpOn ? 6200 : 2700)) {
      passiveLeak();
      state.lastLeakCycle = now;
    }

    updateVm(now, delta);

    if (now - state.lastHistory > 90) {
      state.history.push(state.vm);
      if (state.history.length > 240) state.history.shift();
      state.lastHistory = now;
    }

    updateDataUI();
    drawCell(now);
    drawVoltageGraph();

    requestAnimationFrame(loop);
  }

  async function start() {
    try {
      await loadUser();
    } catch (error) {
      console.error(error);
      return;
    }

    bindCellInteraction();
    bindControls();
    $("logoutSidebar").addEventListener("click", logout);

    resetSimulation();

    window.addEventListener("resize", function () {
      drawCell(performance.now());
      drawVoltageGraph();
    });

    requestAnimationFrame(function (now) {
      state.lastFrame = now;
      state.lastHistory = now;
      loop(now);
    });
  }

  start();
})();