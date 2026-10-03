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
    lastBlockNotice: 0,
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
      flashUntil: 0,
      transport: null
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

  function transportVoltageDelta(type, fromZone, toZone) {
    if (type === "Na") return fromZone === "out" && toZone === "in" ? 3.6 : -3.6;
    return fromZone === "in" && toZone === "out" ? -2.7 : 2.7;
  }

  function activeTransportVoltage() {
    return state.ions.reduce(function (sum, ion) {
      if (!ion.transport) return sum;
      return sum + ion.transport.voltageDelta * ion.transport.chargeProgress;
    }, 0);
  }

  function targetVm() {
    const current = counts();
    const naDelta = current.naIn - INITIAL.naIn;
    const kOutDelta = current.kOut - INITIAL.kOut;
    const pumpPenalty = state.pumpOn ? 0 : 1.8;
    const crossingCharge = activeTransportVoltage();

    return clamp(
      -70 + naDelta * 3.6 - kOutDelta * 2.7 + crossingCharge + state.stimulusOffset + pumpPenalty,
      -95,
      20
    );
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

  function radialDistance(x, y, g) {
    const dx = x - g.cx;
    const dy = y - g.cy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function pointAtRadius(angle, radius, g) {
    return {
      x: g.cx + Math.cos(angle) * radius,
      y: g.cy + Math.sin(angle) * radius
    };
  }

  function membraneStopRadius(zone, ion, g) {
    const membraneHalf = 8;
    const clearance = 2;
    return zone === "in"
      ? g.r - membraneHalf - ion.radius - clearance
      : g.r + membraneHalf + ion.radius + clearance;
  }

  function nearestChannelAny(angle) {
    let best = null;
    let distance = Infinity;

    CHANNELS.forEach(function (channel) {
      const d = angleDistance(channel.angle, angle);
      if (d < distance) {
        distance = d;
        best = channel;
      }
    });

    return distance <= .24 ? best : null;
  }

  function notifyBlocked(ion, angle, reason) {
    const now = performance.now();
    ion.flashUntil = now + 360;

    state.eventPulse = {
      type: "blocked",
      angle: angle,
      until: now + 420
    };

    if (now - state.lastBlockNotice < 650) return;
    state.lastBlockNotice = now;

    setExplanation(
      "A membrana bloqueou o íon",
      reason,
      "bicamada ≠ passagem livre  ·  use o canal correto"
    );
    setHint("A membrana é uma barreira física: procure a abertura compatível.");
  }

  function explainCompletedTransport(ion, oldZone, newZone) {
    if (ion.type === "Na" && oldZone === "out" && newZone === "in") {
      setExplanation(
        "Na⁺ atravessou o canal",
        "A entrada real de carga positiva tornou o interior menos negativo. O traçado de Vm sobe durante a própria travessia, não depois dela.",
        "Na⁺ → interior  ·  despolarização"
      );
      setHint("Observe: o Vm mudou enquanto o Na⁺ cruzava a membrana.");
    } else if (ion.type === "Na" && oldZone === "in" && newZone === "out") {
      setExplanation(
        "Na⁺ saiu da célula",
        "A saída de carga positiva favorece maior negatividade interna. Na fisiologia, esse fluxo ativo é sustentado principalmente pela Na⁺/K⁺-ATPase.",
        "Na⁺ → exterior  ·  Vm cai"
      );
    } else if (ion.type === "K" && oldZone === "in" && newZone === "out") {
      setExplanation(
        "K⁺ atravessou o canal",
        "O gradiente químico favoreceu a saída, mas a negatividade interna gera uma força elétrica oposta. A saída de K⁺ deixa o interior mais negativo e o gráfico acompanha essa mudança.",
        "K⁺ → exterior  ·  hiperpolarização"
      );
      setHint("O K⁺ só saiu pelo canal e o Vm caiu durante a passagem.");
    } else if (ion.type === "K" && oldZone === "out" && newZone === "in") {
      setExplanation(
        "K⁺ entrou na célula",
        "A entrada de carga positiva deixa o interior menos negativo. O gradiente fisiológico de K⁺, porém, tende a favorecer sua saída no repouso.",
        "K⁺ → interior  ·  Vm sobe"
      );
    }
  }

  function startIonTransport(ion, newZone, angle, options) {
    if (!ion || ion.transport || ion.zone === newZone) return false;

    const opts = options || {};
    const g = geometry();
    const current = normalizedToPoint(ion, g);
    const oldZone = ion.zone;
    const entryRadius = membraneStopRadius(oldZone, ion, g);
    const exitRadius = membraneStopRadius(newZone, ion, g);
    const entry = pointAtRadius(angle, entryRadius, g);
    const exit = pointAtRadius(angle, exitRadius, g);
    const destinationExtra = opts.extra || 9;
    const destinationRadius = newZone === "in"
      ? Math.max(18, exitRadius - destinationExtra)
      : exitRadius + destinationExtra;
    const destination = pointAtRadius(angle, destinationRadius, g);
    const now = performance.now();

    ion.transport = {
      kind: opts.kind || "channel",
      oldZone: oldZone,
      newZone: newZone,
      angle: angle,
      start: now + (opts.delay || 0),
      duration: opts.duration || (opts.kind === "pump" ? 980 : 680),
      source: { x: current.x, y: current.y },
      entry: entry,
      exit: exit,
      destination: destination,
      progress: 0,
      chargeProgress: 0,
      voltageDelta: transportVoltageDelta(ion.type, oldZone, newZone),
      silent: Boolean(opts.silent)
    };

    return true;
  }

  function positionTransport(ion, now) {
    const tr = ion.transport;
    if (!tr) return false;
    if (now < tr.start) return true;

    const g = geometry();
    const p = clamp((now - tr.start) / tr.duration, 0, 1);
    const approachEnd = tr.kind === "pump" ? .38 : .14;
    const crossingEnd = tr.kind === "pump" ? .70 : .72;
    let x;
    let y;

    function ease(t) {
      return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    if (p < approachEnd) {
      const u = ease(p / approachEnd);
      x = tr.source.x + (tr.entry.x - tr.source.x) * u;
      y = tr.source.y + (tr.entry.y - tr.source.y) * u;
      tr.chargeProgress = 0;
    } else if (p < crossingEnd) {
      const u = ease((p - approachEnd) / (crossingEnd - approachEnd));
      x = tr.entry.x + (tr.exit.x - tr.entry.x) * u;
      y = tr.entry.y + (tr.exit.y - tr.entry.y) * u;
      tr.chargeProgress = u;
    } else {
      const u = ease((p - crossingEnd) / (1 - crossingEnd));
      x = tr.exit.x + (tr.destination.x - tr.exit.x) * u;
      y = tr.exit.y + (tr.destination.y - tr.exit.y) * u;
      tr.chargeProgress = 1;
    }

    tr.progress = p;
    ion.nx = clamp(x / g.w, .02, .98);
    ion.ny = clamp(y / g.h, .025, .975);

    if (p >= 1) {
      const oldZone = tr.oldZone;
      const newZone = tr.newZone;
      const silent = tr.silent;
      ion.zone = newZone;
      ion.transport = null;
      ion.flashUntil = now + 520;

      state.eventPulse = {
        type: ion.type,
        angle: tr.angle,
        until: now + 650
      };

      if (!silent) explainCompletedTransport(ion, oldZone, newZone);
      return false;
    }

    return true;
  }

  function updateIonTransports(now) {
    state.ions.forEach(function (ion) {
      if (ion.transport) positionTransport(ion, now);
    });
  }

  function transferThroughChannel(ion, newZone, angle, options) {
    const oldZone = ion.zone;
    const started = startIonTransport(ion, newZone, angle, options);

    if (!started) return false;

    if (!(options && options.silent)) {
      const verb = newZone === "in" ? "entrando" : "saindo";
      setExplanation(
        ion.type + "⁺ está " + verb,
        "O íon foi capturado pela abertura do canal. Agora ele percorre fisicamente a proteína até o outro lado; enquanto cruza, sua carga já altera o potencial de membrana.",
        ion.type + "⁺ em trânsito  ·  Vm responde em tempo real"
      );
      setHint("Solte o mouse: o canal conclui a passagem, sem teletransporte.");
    }

    return true;
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
      if (ion.transport) return;
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

    function endDragging(pointerId) {
      state.draggingId = null;
      state.draggingStart = null;
      canvas.classList.remove("dragging");

      if (
        pointerId !== undefined &&
        canvas.hasPointerCapture &&
        canvas.hasPointerCapture(pointerId)
      ) {
        canvas.releasePointerCapture(pointerId);
      }
    }

    canvas.addEventListener("pointerdown", function (event) {
      const p = pointerPosition(event);
      const ion = findIonAt(p.x, p.y);
      if (!ion || ion.transport) return;

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

      if (!ion || ion.transport) {
        endDragging(event.pointerId);
        return;
      }

      const g = geometry();
      const p = pointerPosition(event);
      const dx = p.x - g.cx;
      const dy = p.y - g.cy;
      const desiredRadius = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      const originZone = state.draggingStart.zone;
      const stopRadius = membraneStopRadius(originZone, ion, g);
      const pushingAcross = originZone === "out"
        ? desiredRadius < stopRadius
        : desiredRadius > stopRadius;

      if (!pushingAcross) {
        ion.nx = clamp(p.x / g.w, .02, .98);
        ion.ny = clamp(p.y / g.h, .025, .975);
        event.preventDefault();
        return;
      }

      const stopPoint = pointAtRadius(angle, stopRadius, g);
      ion.nx = clamp(stopPoint.x / g.w, .02, .98);
      ion.ny = clamp(stopPoint.y / g.h, .025, .975);

      const compatible = nearestValidChannel(ion.type, angle);
      const anyChannel = nearestChannelAny(angle);

      if (!compatible) {
        if (anyChannel && anyChannel.type !== ion.type) {
          notifyBlocked(
            ion,
            angle,
            "Esse é um canal de " + anyChannel.type + "⁺. Ele não oferece a seletividade necessária para " + ion.type + "⁺, então o íon encosta na membrana e não atravessa."
          );
        } else {
          notifyBlocked(
            ion,
            angle,
            "Fora da abertura de um canal compatível, a bicamada lipídica funciona como obstáculo. O íon pode deslizar pela superfície, mas não cruzar a membrana."
          );
        }
        event.preventDefault();
        return;
      }

      if (!channelIsOpen(ion.type)) {
        notifyBlocked(
          ion,
          compatible.angle,
          "O canal correto está alinhado, mas está fechado. A barreira permanece contínua até você abrir esse canal."
        );
        event.preventDefault();
        return;
      }

      const newZone = originZone === "out" ? "in" : "out";
      const entryPoint = pointAtRadius(compatible.angle, stopRadius, g);
      ion.nx = clamp(entryPoint.x / g.w, .02, .98);
      ion.ny = clamp(entryPoint.y / g.h, .025, .975);

      if (transferThroughChannel(ion, newZone, compatible.angle, { kind: "channel" })) {
        endDragging(event.pointerId);
      }

      event.preventDefault();
    });

    function finishDrag(event) {
      if (!state.draggingId) return;
      endDragging(event.pointerId);
    }

    canvas.addEventListener("pointerup", finishDrag);
    canvas.addEventListener("pointercancel", finishDrag);
  }

  function moveOne(type, fromZone, toZone, angle, extra, options) {
    const ion = state.ions.find(function (item) {
      return (
        item.type === type &&
        item.zone === fromZone &&
        item.id !== state.draggingId &&
        !item.transport
      );
    });

    if (!ion) return false;

    const opts = Object.assign({}, options || {}, {
      extra: extra || 9,
      silent: options && "silent" in options ? options.silent : true
    });

    return startIonTransport(ion, toZone, angle, opts);
  }

  function runPumpCycle(now) {
    if (!state.pumpOn || state.actionPotential) return;

    const current = counts();
    const excessNaInside = Math.max(0, current.naIn - INITIAL.naIn);
    const excessKOutside = Math.max(0, current.kOut - INITIAL.kOut);
    const naMoves = Math.min(3, excessNaInside);
    const kMoves = Math.min(2, excessKOutside);
    let moved = 0;

    for (let i = 0; i < naMoves; i += 1) {
      if (moveOne("Na", "in", "out", PUMP_ANGLE, 11 + i * 2, {
        kind: "pump",
        duration: 1080,
        delay: i * 120,
        silent: true
      })) moved += 1;
    }

    for (let i = 0; i < kMoves; i += 1) {
      if (moveOne("K", "out", "in", PUMP_ANGLE + .05, 10 + i * 2, {
        kind: "pump",
        duration: 1080,
        delay: 80 + i * 140,
        silent: true
      })) moved += 1;
    }

    state.pumpPulseUntil = now + 1100;

    if (moved > 0) {
      setExplanation(
        "Bomba Na⁺/K⁺ restaurando o gradiente",
        "A ATPase está recolhendo os íons que se desviaram do repouso. Cada partícula percorre visualmente a proteína; não há mais salto instantâneo entre os lados.",
        "até 3 Na⁺ → fora  ·  até 2 K⁺ → dentro  ·  ATP"
      );
    }
  }

  function passiveLeak() {
    if (state.actionPotential) return;

    if (state.naChannelOpen) {
      moveOne("Na", "out", "in", -1.15, 8, {
        kind: "channel",
        duration: 760,
        silent: true
      });
    }

    if (state.kChannelOpen) {
      moveOne("K", "in", "out", 1.03, 12, {
        kind: "channel",
        duration: 780,
        delay: 120,
        silent: true
      });
    }

    if (!state.pumpOn) {
      setExplanation(
        "Bomba desligada",
        "Sem a ATPase Na⁺/K⁺, os vazamentos agora deslocam íons fisicamente pelos canais e os gradientes começam a se dissipar. O gráfico acompanha essa redistribuição a cada travessia.",
        "gradientes ↓  ·  Vm perde estabilidade"
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
        const naAngles = [-1.15, .08, -1.15, .08];
        for (let i = 0; i < 4; i += 1) moveOne("Na", "out", "in", naAngles[i], 8 + i, { kind: "channel", duration: 420, delay: i * 55, silent: true });
        ap.sodiumMoved = true;
      }

      const u = clamp(t / 220, 0, 1);
      setPhase("despolarização", "entrada rápida de Na⁺");
      return -55 + u * 85;
    }

    if (t < 470) {
      if (!ap.potassiumMoved) {
        const kAngles = [1.03, 2.48, 1.03, 2.48];
        for (let i = 0; i < 4; i += 1) moveOne("K", "in", "out", kAngles[i], 10 + i * 2, { kind: "channel", duration: 460, delay: i * 60, silent: true });
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
      ctx.strokeStyle = state.eventPulse.type === "Na"
        ? "rgba(56,189,248,.5)"
        : state.eventPulse.type === "K"
          ? "rgba(245,158,11,.5)"
          : "rgba(251,113,133,.55)";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 1 - ratio;
      ctx.beginPath();
      ctx.arc(px, py, 16 + ratio * 35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    state.ions.forEach(function (ion) {
      const p = normalizedToPoint(ion, g);
      const moving = Boolean(ion.transport);
      const wobble = ion.id === state.draggingId || moving ? 0 : Math.sin(now * .0017 + ion.wobble) * 1.6;
      const x = p.x + wobble;
      const y = p.y + (moving ? 0 : Math.cos(now * .0014 + ion.wobble) * 1.2);
      const isNa = ion.type === "Na";
      const fill = isNa ? "rgba(56, 189, 248, .16)" : "rgba(245, 158, 11, .15)";
      const stroke = isNa ? "#38bdf8" : "#f59e0b";
      const text = isNa ? "#c5f1ff" : "#ffe0aa";
      const crossing = moving ? ion.transport.chargeProgress : 0;
      const visibleRadius = ion.radius * (1 - Math.sin(crossing * Math.PI) * .24);

      ctx.save();

      if (moving) {
        const trailEnd = pointAtRadius(ion.transport.angle, g.r, g);
        ctx.strokeStyle = isNa ? "rgba(56,189,248,.22)" : "rgba(245,158,11,.20)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(trailEnd.x, trailEnd.y);
        ctx.stroke();

        ctx.shadowColor = stroke;
        ctx.shadowBlur = 18;
      } else if (ion.id === state.draggingId || now < ion.flashUntil) {
        ctx.shadowColor = stroke;
        ctx.shadowBlur = 14;
      }

      ctx.beginPath();
      ctx.arc(x, y, visibleRadius, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.globalAlpha = .9;
      ctx.lineWidth = moving ? 1.8 : 1.2;
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
    state.draggingId = null;
    state.draggingStart = null;
    state.lastBlockNotice = 0;
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

    updateIonTransports(now);
    updateVm(now, delta);

    if (now - state.lastHistory > 70) {
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