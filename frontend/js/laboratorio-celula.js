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
    pumpMode: "manual",
    naChannelOpen: true,
    kChannelOpen: true,
    vm: -70,
    lastVm: -70,
    stimulusCurrent: 0,
    stimulusUntil: 0,
    refractoryUntil: 0,
    pumps: [],
    history: [],
    lastHistory: 0,
    lastPumpCycle: 0,
    lastLeakCycle: 0,
    lastPhysicsFlux: 0,
    pumpPulseUntil: 0,
    eventPulse: null,
    actionPotential: null,
    lastBlockNotice: 0,
    lastFrame: performance.now()
  };

  const INITIAL = {
    // Poucas partículas visíveis: cada uma representa um conjunto de íons.
    // As concentrações fisiológicas continuam sendo exibidas em mM.
    naIn: 3,
    naOut: 8,
    kIn: 8,
    kOut: 3
  };

  const CHANNELS = [
    { type: "Na", angle: -1.15, color: "#38bdf8" },
    { type: "Na", angle: 0.08, color: "#38bdf8" },
    { type: "K", angle: 1.03, color: "#f59e0b" },
    { type: "K", angle: 2.48, color: "#f59e0b" }
  ];

  const PUMP_ANGLES = [-2.32, -0.52, 1.72];

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

  function pointIsClear(x, y, zone, g, minDistance) {
    const minimum = minDistance || 30;

    return state.ions.every(function (other) {
      if (other.zone !== zone || other.transport) return true;
      const p = normalizedToPoint(other, g);
      return Math.hypot(x - p.x, y - p.y) >= minimum;
    });
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
    } while (
      (
        zoneAt(x, y, g) !== zone ||
        !pointIsClear(x, y, zone, g, 31)
      ) &&
      tries < 220
    );

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
      charge: 1,
      zone: zone,
      nx: point.nx,
      ny: point.ny,
      radius: 11,
      vx: (Math.random() - .5) * 8,
      vy: (Math.random() - .5) * 8,
      wobble: Math.random() * Math.PI * 2,
      flashUntil: 0,
      boundPumpId: null,
      boundSlotType: null,
      boundSlotIndex: null,
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
      naIn: clamp(12 + naDelta * 4, 2, 150),
      naOut: clamp(145 - naDelta * 4, 25, 180),
      kOut: clamp(4 + kOutDelta * 4, 1, 120),
      kIn: clamp(140 - kOutDelta * 4, 20, 170)
    };
  }

  function transportVoltageDelta(type, fromZone, toZone) {
    if (type === "Na") return fromZone === "out" && toZone === "in" ? 2.2 : -2.2;
    return fromZone === "in" && toZone === "out" ? -1.8 : 1.8;
  }

  function activeTransportVoltage() {
    return state.ions.reduce(function (sum, ion) {
      if (!ion.transport) return sum;
      return sum + ion.transport.voltageDelta * ion.transport.chargeProgress;
    }, 0);
  }

  function equilibriumPotential(type) {
    const c = concentrations(counts());
    const inside = type === "Na" ? c.naIn : c.kIn;
    const outside = type === "Na" ? c.naOut : c.kOut;
    return 61.5 * Math.log10(Math.max(.01, outside) / Math.max(.01, inside));
  }

  function membranePermeabilities() {
    let na = .04;
    let k = 1;
    const phase = state.actionPotential ? state.actionPotential.phase : "rest";

    if (phase === "depolarization") {
      na = 8;
      k = .65;
    } else if (phase === "repolarization") {
      na = .008;
      k = 5;
    } else if (phase === "hyperpolarization") {
      na = .012;
      k = 2.2;
    }

    return {
      na: state.naChannelOpen ? na : .0015,
      k: state.kChannelOpen ? k : .012
    };
  }

  function ghkVoltage() {
    const c = concentrations(counts());
    const p = membranePermeabilities();
    const numerator = p.k * c.kOut + p.na * c.naOut;
    const denominator = p.k * c.kIn + p.na * c.naIn;

    return 61.5 * Math.log10(
      Math.max(.001, numerator) / Math.max(.001, denominator)
    );
  }

  function targetVm() {
    const base = ghkVoltage();
    const pumpElectrogenic = state.pumpOn ? -1.2 : 0;
    const crossingCharge = activeTransportVoltage();

    return clamp(
      base + pumpElectrogenic + crossingCharge,
      -100,
      35
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

    if (distance <= .12) return best;
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

  function resetPumps() {
    state.pumps = PUMP_ANGLES.map(function (angle, index) {
      return {
        id: "pump-" + index,
        angle: angle,
        phase: "na-binding",
        phaseSince: performance.now(),
        readyAt: 0,
        lastAutoBind: 0,
        pulseUntil: 0,
        naSlots: [null, null, null],
        kSlots: [null, null]
      };
    });
  }

  function pumpBindingPoint(pump, type, index, g) {
    // Sítios separados o suficiente para que cada esfera "encaixe" visualmente
    // sem se sobrepor às vizinhas.
    const offsets = type === "Na" ? [-.155, 0, .155] : [-.105, .105];
    const radius = type === "Na" ? g.r - 31 : g.r + 31;
    return pointAtRadius(pump.angle + offsets[index], radius, g);
  }

  function pumpSlotActive(pump, type) {
    return (
      (type === "Na" && pump.phase === "na-binding") ||
      (type === "K" && pump.phase === "k-binding")
    );
  }

  function freePumpSlot(pump, type) {
    const slots = type === "Na" ? pump.naSlots : pump.kSlots;
    for (let i = 0; i < slots.length; i += 1) {
      if (slots[i] === null) return i;
    }
    return -1;
  }

  function pumpSlotsFull(pump, type) {
    const slots = type === "Na" ? pump.naSlots : pump.kSlots;
    return slots.every(function (id) { return id !== null; });
  }

  function bindIonToPumpSlot(pump, ion, type, slotIndex, manual) {
    if (!state.pumpOn || !pumpSlotActive(pump, type)) return false;
    if (ion.transport || ion.boundPumpId) return false;

    const expectedZone = type === "Na" ? "in" : "out";
    if (ion.type !== type || ion.zone !== expectedZone) return false;

    const slots = type === "Na" ? pump.naSlots : pump.kSlots;
    if (slots[slotIndex] !== null) return false;

    const g = geometry();
    const point = pumpBindingPoint(pump, type, slotIndex, g);

    slots[slotIndex] = ion.id;
    ion.boundPumpId = pump.id;
    ion.boundSlotType = type;
    ion.boundSlotIndex = slotIndex;
    ion.vx = 0;
    ion.vy = 0;
    ion.nx = clamp(point.x / g.w, .02, .98);
    ion.ny = clamp(point.y / g.h, .025, .975);
    ion.flashUntil = performance.now() + 450;

    if (pumpSlotsFull(pump, type)) {
      pump.readyAt = performance.now() + 650;
    }

    if (manual) {
      const filled = slots.filter(function (id) { return id !== null; }).length;
      const total = slots.length;
      setExplanation(
        type + "⁺ encaixado na Na⁺/K⁺-ATPase",
        "O íon ocupou um sítio específico da bomba. O ciclo só avança quando todos os sítios exigidos desta etapa estiverem preenchidos.",
        type === "Na"
          ? filled + "/3 Na⁺ intracelulares ligados"
          : filled + "/2 K⁺ extracelulares ligados"
      );
      setHint(type === "Na" ? "Complete os 3 sítios de Na⁺." : "Complete os 2 sítios de K⁺.");
    }

    return true;
  }

  function nearestFreeIonToPoint(type, zone, point, radius) {
    let best = null;
    let bestDistance = radius;

    state.ions.forEach(function (ion) {
      if (
        ion.type !== type ||
        ion.zone !== zone ||
        ion.transport ||
        ion.boundPumpId ||
        ion.id === state.draggingId
      ) return;

      const p = normalizedToPoint(ion, geometry());
      const d = Math.hypot(p.x - point.x, p.y - point.y);
      if (d < bestDistance) {
        bestDistance = d;
        best = ion;
      }
    });

    return best;
  }

  function tryBindIonToPump(ion, x, y, manual) {
    if (!state.pumpOn || ion.transport || ion.boundPumpId) return false;

    const g = geometry();
    let match = null;
    let bestDistance = 25;

    state.pumps.forEach(function (pump) {
      const type = pump.phase === "na-binding" ? "Na" : pump.phase === "k-binding" ? "K" : null;
      if (!type || ion.type !== type) return;

      const expectedZone = type === "Na" ? "in" : "out";
      if (ion.zone !== expectedZone) return;

      const slots = type === "Na" ? pump.naSlots : pump.kSlots;
      slots.forEach(function (slotIonId, index) {
        if (slotIonId !== null) return;
        const p = pumpBindingPoint(pump, type, index, g);
        const d = Math.hypot(x - p.x, y - p.y);
        if (d < bestDistance) {
          bestDistance = d;
          match = { pump: pump, type: type, index: index };
        }
      });
    });

    if (!match) return false;
    return bindIonToPumpSlot(match.pump, ion, match.type, match.index, manual);
  }

  function releasePumpBoundIons(pump, type, newZone, now) {
    const slots = type === "Na" ? pump.naSlots : pump.kSlots;
    const ids = slots.slice();
    const duration = 960;

    ids.forEach(function (id, index) {
      const ion = state.ions.find(function (item) { return item.id === id; });
      if (!ion) return;

      ion.boundPumpId = null;
      ion.boundSlotType = null;
      ion.boundSlotIndex = null;

      startIonTransport(ion, newZone, pump.angle, {
        kind: "pump",
        duration: duration,
        delay: index * 90,
        silent: true,
        extra: 13 + index * 2
      });
    });

    for (let i = 0; i < slots.length; i += 1) slots[i] = null;
    pump.pulseUntil = now + 1200;
  }

  function updatePumpStates(now) {
    if (!state.pumpOn) return;

    const g = geometry();

    state.pumps.forEach(function (pump) {
      const autoMode = state.pumpMode === "auto";

      if (pump.phase === "na-binding") {
        if (autoMode && !pumpSlotsFull(pump, "Na") && now - pump.lastAutoBind > 320) {
          const slot = freePumpSlot(pump, "Na");
          if (slot >= 0) {
            const site = pumpBindingPoint(pump, "Na", slot, g);
            const ion = nearestFreeIonToPoint("Na", "in", site, 30);
            if (ion) {
              bindIonToPumpSlot(pump, ion, "Na", slot, false);
              pump.lastAutoBind = now;
            }
          }
        }

        if (pumpSlotsFull(pump, "Na") && now >= pump.readyAt) {
          pump.phase = "na-release";
          pump.phaseSince = now;
          releasePumpBoundIons(pump, "Na", "out", now);
          setExplanation(
            "ATPase: 3 Na⁺ liberados para fora",
            "Após ligar três Na⁺ intracelulares, a bomba muda de conformação e os libera no meio extracelular. Agora expõe dois sítios para K⁺.",
            "3 Na⁺ → exterior  ·  próximo: 2 K⁺"
          );
        }
      } else if (pump.phase === "na-release" && now - pump.phaseSince > 1180) {
        pump.phase = "k-binding";
        pump.phaseSince = now;
        pump.readyAt = 0;
      } else if (pump.phase === "k-binding") {
        if (autoMode && !pumpSlotsFull(pump, "K") && now - pump.lastAutoBind > 320) {
          const slot = freePumpSlot(pump, "K");
          if (slot >= 0) {
            const site = pumpBindingPoint(pump, "K", slot, g);
            const ion = nearestFreeIonToPoint("K", "out", site, 30);
            if (ion) {
              bindIonToPumpSlot(pump, ion, "K", slot, false);
              pump.lastAutoBind = now;
            }
          }
        }

        if (pumpSlotsFull(pump, "K") && now >= pump.readyAt) {
          pump.phase = "k-release";
          pump.phaseSince = now;
          releasePumpBoundIons(pump, "K", "in", now);
          setExplanation(
            "ATPase: 2 K⁺ liberados para dentro",
            "Com dois K⁺ extracelulares ligados, a bomba retorna à conformação inicial e libera K⁺ no citoplasma. Um ciclo 3:2 foi concluído.",
            "2 K⁺ → interior  ·  ciclo concluído"
          );
        }
      } else if (pump.phase === "k-release" && now - pump.phaseSince > 1180) {
        pump.phase = "na-binding";
        pump.phaseSince = now;
        pump.readyAt = 0;
      }
    });
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

    return distance <= .12 ? best : null;
  }

  function notifyBlocked(ion, angle, reason) {
    const now = performance.now();
    ion.flashUntil = now + 220;

    state.eventPulse = {
      type: "blocked",
      angle: angle,
      until: now + 280
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

  function distanceToAngleSite(ion, angle, zone, g) {
    if (ion.zone !== zone || ion.transport) return Infinity;
    const radial = membraneStopRadius(zone, ion, g);
    const site = pointAtRadius(angle, radial, g);
    const p = normalizedToPoint(ion, g);
    return Math.hypot(p.x - site.x, p.y - site.y);
  }

  function localIonCandidates(type, zone, angle, captureRadius) {
    const g = geometry();

    return state.ions
      .filter(function (ion) {
        return (
          ion.type === type &&
          ion.zone === zone &&
          ion.id !== state.draggingId &&
          !ion.transport &&
          !ion.boundPumpId
        );
      })
      .map(function (ion) {
        return {
          ion: ion,
          distance: distanceToAngleSite(ion, angle, zone, g)
        };
      })
      .filter(function (entry) {
        return entry.distance <= captureRadius;
      })
      .sort(function (a, b) {
        return a.distance - b.distance;
      });
  }

  function electrochemicalDrive(type) {
    const eIon = equilibriumPotential(type);
    const difference = state.vm - eIon;
    const outward = difference > 0;

    return {
      eIon: eIon,
      outward: outward,
      strength: clamp(Math.abs(difference) / 120, .06, .95)
    };
  }

  function resolveIonOverlap(ion, x, y, g) {
    let rx = x;
    let ry = y;

    // Algumas passadas curtas resolvem também pequenos "engarrafamentos"
    // quando várias partículas estão muito próximas.
    for (let pass = 0; pass < 4; pass += 1) {
      state.ions.forEach(function (other) {
        if (
          other.id === ion.id ||
          other.zone !== ion.zone ||
          other.transport
        ) return;

        const op = normalizedToPoint(other, g);
        let dx = rx - op.x;
        let dy = ry - op.y;
        let d = Math.hypot(dx, dy);
        const minDistance = ion.radius + other.radius + 3;

        if (d >= minDistance) return;

        if (d < .001) {
          const a = ((ion.id + other.id) * 2.399963) % (Math.PI * 2);
          dx = Math.cos(a);
          dy = Math.sin(a);
          d = 1;
        }

        const push = minDistance - d;
        rx += dx / d * push;
        ry += dy / d * push;
      });
    }

    return { x: rx, y: ry };
  }

  function confineIonToZone(ion, x, y, g) {
    const dx = x - g.cx;
    const dy = y - g.cy;
    const d = Math.max(.001, Math.hypot(dx, dy));
    const stop = membraneStopRadius(ion.zone, ion, g);

    if (ion.zone === "in" && d > stop) {
      return {
        x: g.cx + dx / d * stop,
        y: g.cy + dy / d * stop,
        hitMembrane: true
      };
    }

    if (ion.zone === "out" && d < stop) {
      return {
        x: g.cx + dx / d * stop,
        y: g.cy + dy / d * stop,
        hitMembrane: true
      };
    }

    return {
      x: clamp(x, ion.radius + 4, g.w - ion.radius - 4),
      y: clamp(y, ion.radius + 4, g.h - ion.radius - 4),
      hitMembrane: false
    };
  }

  function updateParticlePhysics(delta) {
    const g = geometry();
    const dt = Math.min(delta, 40) / 1000;
    const active = state.ions.filter(function (ion) {
      return !ion.transport && !ion.boundPumpId && ion.id !== state.draggingId;
    });

    // Brownian motion + like-charge repulsion. All visible Na⁺/K⁺ are +1 cations.
    active.forEach(function (ion) {
      ion.vx += (Math.random() - .5) * 23 * dt;
      ion.vy += (Math.random() - .5) * 23 * dt;
    });

    for (let i = 0; i < active.length; i += 1) {
      for (let j = i + 1; j < active.length; j += 1) {
        const a = active[i];
        const b = active[j];
        if (a.zone !== b.zone) continue;

        const ap = normalizedToPoint(a, g);
        const bp = normalizedToPoint(b, g);
        let dx = ap.x - bp.x;
        let dy = ap.y - bp.y;
        let d = Math.hypot(dx, dy);

        if (d > 82) continue;
        if (d < .01) {
          const seed = ((a.id + b.id) * 1.618) % (Math.PI * 2);
          dx = Math.cos(seed);
          dy = Math.sin(seed);
          d = 1;
        }

        const ux = dx / d;
        const uy = dy / d;
        const hardCore = a.radius + b.radius + 3;
        const chargeProduct = (a.charge || 0) * (b.charge || 0);
        const electrostaticForce = ((82 - d) / 82) * 25 * chargeProduct;
        const overlapForce = d < hardCore ? (hardCore - d) * 34 : 0;

        // Sinais iguais se repelem; sinais opostos tenderiam à atração.
        // O termo de volume excluído continua impedindo sobreposição física.
        const force = electrostaticForce + overlapForce;

        a.vx += ux * force * dt;
        a.vy += uy * force * dt;
        b.vx -= ux * force * dt;
        b.vy -= uy * force * dt;
      }
    }

    active.forEach(function (ion) {
      const damping = Math.pow(.965, delta / 16.67);
      ion.vx *= damping;
      ion.vy *= damping;

      const speed = Math.hypot(ion.vx, ion.vy);
      const maxSpeed = 27;
      if (speed > maxSpeed) {
        ion.vx = ion.vx / speed * maxSpeed;
        ion.vy = ion.vy / speed * maxSpeed;
      }

      const p = normalizedToPoint(ion, g);
      let next = {
        x: p.x + ion.vx * dt,
        y: p.y + ion.vy * dt
      };

      next = resolveIonOverlap(ion, next.x, next.y, g);
      const confined = confineIonToZone(ion, next.x, next.y, g);

      if (confined.hitMembrane) {
        const nx = (confined.x - g.cx) / Math.max(1, Math.hypot(confined.x - g.cx, confined.y - g.cy));
        const ny = (confined.y - g.cy) / Math.max(1, Math.hypot(confined.x - g.cx, confined.y - g.cy));
        const radialVelocity = ion.vx * nx + ion.vy * ny;
        ion.vx -= 1.55 * radialVelocity * nx;
        ion.vy -= 1.55 * radialVelocity * ny;
      }

      if (confined.x <= ion.radius + 5 || confined.x >= g.w - ion.radius - 5) ion.vx *= -.65;
      if (confined.y <= ion.radius + 5 || confined.y >= g.h - ion.radius - 5) ion.vy *= -.65;

      ion.nx = clamp(confined.x / g.w, .02, .98);
      ion.ny = clamp(confined.y / g.h, .025, .975);
    });
  }

  function tryLocalChannelFlux(now) {
    const permeability = membranePermeabilities();

    CHANNELS.forEach(function (channel) {
      if (!channelIsOpen(channel.type)) return;

      const drive = electrochemicalDrive(channel.type);
      const fromZone = drive.outward ? "in" : "out";
      const toZone = drive.outward ? "out" : "in";
      const local = localIonCandidates(channel.type, fromZone, channel.angle, 56);

      if (!local.length) return;

      const p = channel.type === "Na" ? permeability.na : permeability.k;
      const reference = channel.type === "Na" ? 8 : 5;
      const permeabilityFactor = clamp(p / reference, .002, 1);
      const chance = clamp(.015 + drive.strength * permeabilityFactor * .94, .015, .96);

      if (Math.random() > chance) return;

      startIonTransport(local[0].ion, toZone, channel.angle, {
        kind: "channel",
        duration: state.actionPotential ? 520 : 720,
        silent: true,
        extra: 12
      });
    });
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
      if (ion.transport || ion.boundPumpId) return;
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

  function moveExternalIon(ion, original, x, y) {
    if (!ion || !original || ion.transport || ion.boundPumpId) return "locked";

    const g = geometry();

    if (tryBindIonToPump(ion, x, y, true)) {
      return "bound";
    }

    const dx = x - g.cx;
    const dy = y - g.cy;
    const desiredRadius = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const originZone = original.zone;
    const stopRadius = membraneStopRadius(originZone, ion, g);
    const pushingAcross = originZone === "out"
      ? desiredRadius < stopRadius
      : desiredRadius > stopRadius;

    if (!pushingAcross) {
      const resolved = resolveIonOverlap(ion, x, y, g);
      const confined = confineIonToZone(ion, resolved.x, resolved.y, g);
      ion.nx = clamp(confined.x / g.w, .02, .98);
      ion.ny = clamp(confined.y / g.h, .025, .975);
      return "moved";
    }

    const rawStopPoint = pointAtRadius(angle, stopRadius, g);
    const stopPoint = resolveIonOverlap(ion, rawStopPoint.x, rawStopPoint.y, g);
    ion.nx = clamp(stopPoint.x / g.w, .02, .98);
    ion.ny = clamp(stopPoint.y / g.h, .025, .975);

    const compatible = nearestValidChannel(ion.type, angle);
    const anyChannel = nearestChannelAny(angle);

    if (!compatible) {
      if (anyChannel && anyChannel.type !== ion.type) {
        notifyBlocked(
          ion,
          angle,
          "Esse canal é seletivo para " + anyChannel.type + "⁺. O " + ion.type + "⁺ encosta na membrana, mas não atravessa."
        );
      } else {
        notifyBlocked(
          ion,
          angle,
          "A bicamada continua sendo uma barreira no 3D. O íon só cruza quando encontra a abertura de um canal compatível."
        );
      }
      return "blocked";
    }

    if (!channelIsOpen(ion.type)) {
      notifyBlocked(
        ion,
        compatible.angle,
        "O canal compatível está fechado. Mesmo no modo 3D, o íon fica retido do lado de origem."
      );
      return "blocked";
    }

    const newZone = originZone === "out" ? "in" : "out";
    const entryPoint = pointAtRadius(compatible.angle, stopRadius, g);
    ion.nx = clamp(entryPoint.x / g.w, .02, .98);
    ion.ny = clamp(entryPoint.y / g.h, .025, .975);

    return transferThroughChannel(ion, newZone, compatible.angle, { kind: "channel" })
      ? "transferred"
      : "blocked";
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

      if (tryBindIonToPump(ion, p.x, p.y, true)) {
        endDragging(event.pointerId);
        event.preventDefault();
        return;
      }

      if (!pushingAcross) {
        const resolved = resolveIonOverlap(ion, p.x, p.y, g);
        const confined = confineIonToZone(ion, resolved.x, resolved.y, g);
        ion.nx = clamp(confined.x / g.w, .02, .98);
        ion.ny = clamp(confined.y / g.h, .025, .975);
        event.preventDefault();
        return;
      }

      const rawStopPoint = pointAtRadius(angle, stopRadius, g);
      const stopPoint = resolveIonOverlap(ion, rawStopPoint.x, rawStopPoint.y, g);
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
    const opts = options || {};
    const captureRadius = opts.captureRadius || (opts.kind === "pump" ? 58 : 50);
    const local = localIonCandidates(type, fromZone, angle, captureRadius);
    if (!local.length) return false;

    const transportOptions = Object.assign({}, opts, {
      extra: extra || 9,
      silent: "silent" in opts ? opts.silent : true
    });

    return startIonTransport(local[0].ion, toZone, angle, transportOptions);
  }

  function runPumpCycle(now) {
    updatePumpStates(now);
  }

  function passiveLeak() {
    tryLocalChannelFlux(performance.now());

    if (!state.pumpOn) {
      setExplanation(
        "Bomba desligada",
        "Sem a ATPase Na⁺/K⁺, os gradientes deixam de ser restaurados. Os canais continuam permitindo apenas fluxos locais, guiados pela força eletroquímica e pela concentração disponível junto à membrana.",
        "difusão local + força elétrica  ·  gradientes se dissipam"
      );
    }
  }

  function triggerActionPotential(now) {
    if (
      state.actionPotential ||
      now < state.refractoryUntil ||
      !state.naChannelOpen
    ) return;

    state.actionPotential = {
      phase: "depolarization",
      phaseSince: now
    };
    state.refractoryUntil = now + 1550;

    setPhase("despolarização", "canais de Na⁺ ativados por voltagem");
    setExplanation(
      "Limiar atingido",
      "O Vm cruzou -55 mV. A permeabilidade ao Na⁺ aumentou e o gradiente eletroquímico favorece entrada de Na⁺ pelos canais próximos.",
      "Vm ≥ -55 mV  →  PNa ↑"
    );
  }

  function updateActionPotentialState(now) {
    const ap = state.actionPotential;
    if (!ap) return;

    const elapsed = now - ap.phaseSince;

    if (
      ap.phase === "depolarization" &&
      (state.vm >= 20 || elapsed > 720)
    ) {
      ap.phase = "repolarization";
      ap.phaseSince = now;
      setPhase("repolarização", "Na⁺ inativa · K⁺ domina");
      setExplanation(
        "Repolarização",
        "A permeabilidade ao Na⁺ cai e a permeabilidade ao K⁺ aumenta. O K⁺ próximo aos canais tende a sair, trazendo o Vm de volta para valores negativos.",
        "PNa ↓  ·  PK ↑"
      );
      return;
    }

    if (
      ap.phase === "repolarization" &&
      (state.vm <= -72 || elapsed > 980)
    ) {
      ap.phase = "hyperpolarization";
      ap.phaseSince = now;
      setPhase("hiperpolarização", "canais de K⁺ fechando lentamente");
      return;
    }

    if (ap.phase === "hyperpolarization" && elapsed > 340) {
      ap.phase = "recovery";
      ap.phaseSince = now;
      setPhase("hiperpolarização", "recuperação das permeabilidades");
      return;
    }

    if (
      ap.phase === "recovery" &&
      elapsed > 260 &&
      state.vm > -78 &&
      state.vm < -62
    ) {
      state.actionPotential = null;
      setPhase("repouso", "gradientes e permeabilidades basais");
      setExplanation(
        "Retorno ao repouso",
        "As permeabilidades voltaram ao padrão basal. A bomba e os vazamentos seletivos sustentam os gradientes para um próximo potencial de ação.",
        "Vm → repouso"
      );
    }
  }

  function setPhase(name, detail) {
    $("phaseMetric").textContent = name;
    $("phaseMetricDetail").textContent = detail;

    $("lessonRest").classList.toggle("active", name === "repouso");
    $("lessonDepolarization").classList.toggle("active", name === "despolarização");
    $("lessonRepolarization").classList.toggle("active", name === "repolarização" || name === "hiperpolarização");
  }

  function updateVm(now, delta) {
    updateActionPotentialState(now);

    const target = targetVm();
    const phase = state.actionPotential ? state.actionPotential.phase : "rest";
    const responseRate =
      phase === "depolarization" ? .010 :
      phase === "repolarization" ? .009 :
      phase === "hyperpolarization" ? .006 :
      .0038;

    state.vm += (target - state.vm) * Math.min(1, delta * responseRate);

    if (now < state.stimulusUntil) {
      // Corrente externa carrega a capacitância da membrana; não altera
      // diretamente as concentrações. Os fluxos iônicos respondem depois.
      state.vm += state.stimulusCurrent * delta * .0045;
    } else {
      state.stimulusCurrent = 0;
    }

    state.vm = clamp(state.vm, -100, 35);

    const crossedThreshold = state.lastVm < -55 && state.vm >= -55;
    if (
      crossedThreshold &&
      !state.actionPotential &&
      now >= state.refractoryUntil
    ) {
      triggerActionPotential(now);
    }

    if (!state.actionPotential) {
      if (now < state.refractoryUntil) {
        setPhase("refratário", "excitabilidade temporariamente reduzida");
      } else if (state.vm > -65) {
        setPhase("despolarização", "interior menos negativo");
      } else if (state.vm < -75) {
        setPhase("hiperpolarização", "interior mais negativo");
      } else {
        setPhase("repouso", "gradientes preservados");
      }
    }

    state.lastVm = state.vm;
  }

  function updateDataUI() {
    const current = counts();
    const c = concentrations(current);

    $("naOutConcentration").textContent = Math.round(c.naOut) + " mM";
    $("naInConcentration").textContent = Math.round(c.naIn) + " mM";
    $("kOutConcentration").textContent = Math.round(c.kOut) + " mM";
    $("kInConcentration").textContent = Math.round(c.kIn) + " mM";

    $("naOutParticles").textContent = current.naOut + " partículas didáticas";
    $("naInParticles").textContent = current.naIn + " partículas didáticas";
    $("kOutParticles").textContent = current.kOut + " partículas didáticas";
    $("kInParticles").textContent = current.kIn + " partículas didáticas";

    $("vmValue").textContent = Math.round(state.vm) + " mV";

    let stateText = "repouso";
    if (state.vm >= 0) stateText = "pico positivo";
    else if (state.vm >= -55) stateText = "limiar atingido";
    else if (state.vm > -65) stateText = "despolarizando";
    else if (state.vm < -75) stateText = "hiperpolarizado";

    $("vmState").textContent = stateText;
    $("pumpStateMetric").textContent = state.pumpOn ? "ativa" : "desligada";

    if ($("naEquilibriumMetric")) {
      $("naEquilibriumMetric").textContent = Math.round(equilibriumPotential("Na")) + " mV";
    }
    if ($("kEquilibriumMetric")) {
      $("kEquilibriumMetric").textContent = Math.round(equilibriumPotential("K")) + " mV";
    }
    if ($("polarityMetric")) {
      $("polarityMetric").textContent =
        state.vm < -5 ? "interior − / exterior +" :
        state.vm > 5 ? "interior + / exterior −" :
        "próximo de 0 mV";
    }
  }

  function drawIonSphere(ctx, x, y, radius, type, glow, bound) {
    const isNa = type === "Na";
    const accent = isNa ? "#6dcff6" : "#eab45a";
    const inner = isNa ? "rgba(61,150,194,.88)" : "rgba(183,119,40,.88)";
    const deep = isNa ? "rgba(9,35,49,.96)" : "rgba(52,31,9,.96)";
    const text = isNa ? "#dff8ff" : "#fff0cf";

    ctx.save();

    // Volume sem sombra projetada: o relevo vem apenas do gradiente da esfera.
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    const sphere = ctx.createRadialGradient(
      x - radius * .28,
      y - radius * .34,
      Math.max(1, radius * .10),
      x,
      y,
      radius * 1.05
    );
    sphere.addColorStop(0, "rgba(255,255,255,.52)");
    sphere.addColorStop(.16, isNa ? "rgba(150,222,247,.66)" : "rgba(248,211,149,.64)");
    sphere.addColorStop(.44, inner);
    sphere.addColorStop(.82, deep);
    sphere.addColorStop(1, "rgba(2,6,10,.98)");

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = sphere;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = bound ? "rgba(255,255,255,.34)" : accent;
    ctx.globalAlpha = bound ? .9 : .62;
    ctx.lineWidth = bound ? 1.35 : .85;
    ctx.stroke();

    // Fresnel-like rim instead of a glossy white dot.
    ctx.globalAlpha = .20;
    ctx.beginPath();
    ctx.arc(x, y, radius - 1.7, -.9, 2.0);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.1;
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.fillStyle = text;
    ctx.font = "800 " + Math.max(7, radius * .58) + "px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(type + "⁺", x, y + .4);
    ctx.restore();
  }

  function drawMembranePolarity(ctx, g) {
    const strength = clamp(Math.abs(state.vm) / 70, 0, 1);
    const negativeInside = state.vm <= 0;
    const count = 18;

    if (strength < .04) return;

    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count + .04;
      const inner = pointAtRadius(angle, g.r - 22, g);
      const outer = pointAtRadius(angle, g.r + 22, g);
      const alpha = .10 + strength * .58;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = "900 9px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillStyle = negativeInside ? "rgba(117,154,255,.95)" : "rgba(255,183,82,.95)";
      ctx.fillText(negativeInside ? "−" : "+", inner.x, inner.y);

      ctx.fillStyle = negativeInside ? "rgba(255,183,82,.88)" : "rgba(117,154,255,.95)";
      ctx.fillText(negativeInside ? "+" : "−", outer.x, outer.y);
      ctx.restore();
    }

    ctx.save();
    ctx.globalAlpha = .42 + strength * .35;
    ctx.font = "800 7px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = negativeInside ? "#8da9ff" : "#ffc16b";
    ctx.fillText(
      negativeInside ? "INTERIOR MAIS NEGATIVO" : "INTERIOR POSITIVO",
      g.cx,
      g.cy + g.r * .34
    );
    ctx.restore();
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

    const bodyGradient = ctx.createRadialGradient(
      g.cx - g.r * .24,
      g.cy - g.r * .28,
      g.r * .08,
      g.cx,
      g.cy,
      g.r
    );
    bodyGradient.addColorStop(0, "rgba(66,88,122,.32)");
    bodyGradient.addColorStop(.46, "rgba(18,35,60,.58)");
    bodyGradient.addColorStop(.82, "rgba(7,17,31,.90)");
    bodyGradient.addColorStop(1, "rgba(4,9,17,.98)");

    ctx.save();
    ctx.shadowColor = "rgba(55,93,145,.16)";
    ctx.shadowBlur = 28;
    ctx.beginPath();
    ctx.arc(g.cx, g.cy, g.r - 11, 0, Math.PI * 2);
    ctx.fillStyle = bodyGradient;
    ctx.fill();
    ctx.restore();

    // Subtle depth/vignette within the cytoplasm.
    const depth = ctx.createLinearGradient(
      g.cx - g.r,
      g.cy - g.r,
      g.cx + g.r,
      g.cy + g.r
    );
    depth.addColorStop(0, "rgba(255,255,255,.025)");
    depth.addColorStop(.50, "rgba(255,255,255,0)");
    depth.addColorStop(1, "rgba(0,0,0,.20)");
    ctx.beginPath();
    ctx.arc(g.cx, g.cy, g.r - 12, 0, Math.PI * 2);
    ctx.fillStyle = depth;
    ctx.fill();

    // Bilayer: two rings of polar heads with faint tails between them.
    const lipidCount = 48;
    for (let i = 0; i < lipidCount; i += 1) {
      const a = (Math.PI * 2 * i) / lipidCount;
      const outer = pointAtRadius(a, g.r + 5, g);
      const inner = pointAtRadius(a, g.r - 5, g);
      const tailOuter = pointAtRadius(a, g.r + 1, g);
      const tailInner = pointAtRadius(a, g.r - 1, g);

      ctx.save();
      ctx.strokeStyle = "rgba(106,137,185,.11)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(outer.x, outer.y);
      ctx.lineTo(tailOuter.x, tailOuter.y);
      ctx.moveTo(inner.x, inner.y);
      ctx.lineTo(tailInner.x, tailInner.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(outer.x, outer.y, 2.35, 0, Math.PI * 2);
      ctx.arc(inner.x, inner.y, 2.35, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(146,173,217,.42)";
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(g.cx, g.cy, g.r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(123,155,205,.13)";
    ctx.lineWidth = 15;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(g.cx, g.cy, g.r - 1, -2.75, -.42);
    ctx.strokeStyle = "rgba(218,230,247,.12)";
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();

    drawMembranePolarity(ctx, g);

    CHANNELS.forEach(function (channel) {
      const x = g.cx + Math.cos(channel.angle) * g.r;
      const y = g.cy + Math.sin(channel.angle) * g.r;
      const open = channelIsOpen(channel.type);
      const isNa = channel.type === "Na";
      const accent = isNa ? "#6dcff6" : "#eab45a";

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(channel.angle + Math.PI / 2);

      const protein = ctx.createLinearGradient(-16, 0, 16, 0);
      protein.addColorStop(0, "rgba(29,37,49,.98)");
      protein.addColorStop(.36, open ? (isNa ? "rgba(40,95,120,.96)" : "rgba(104,72,31,.96)") : "rgba(48,50,56,.96)");
      protein.addColorStop(.64, open ? (isNa ? "rgba(23,66,87,.98)" : "rgba(73,48,18,.98)") : "rgba(42,44,49,.98)");
      protein.addColorStop(1, "rgba(20,25,34,.98)");

      ctx.beginPath();
      ctx.moveTo(-14, -22);
      ctx.bezierCurveTo(-21, -13, -18, -4, -12, 0);
      ctx.bezierCurveTo(-18, 5, -20, 14, -13, 22);
      ctx.lineTo(13, 22);
      ctx.bezierCurveTo(20, 14, 18, 5, 12, 0);
      ctx.bezierCurveTo(18, -5, 21, -14, 14, -22);
      ctx.closePath();
      ctx.fillStyle = protein;
      ctx.fill();
      ctx.strokeStyle = open ? accent : "rgba(139,147,159,.18)";
      ctx.globalAlpha = open ? .58 : .26;
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // Pore
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.roundRect(-3.2, -16, 6.4, 32, 3.2);
      ctx.fillStyle = open
        ? (isNa ? "rgba(109,207,246,.16)" : "rgba(234,180,90,.15)")
        : "rgba(6,8,12,.82)";
      ctx.fill();
      ctx.strokeStyle = open ? accent : "rgba(92,98,108,.22)";
      ctx.globalAlpha = open ? .58 : .24;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.fillStyle = open ? accent : "#626a75";
      ctx.font = "800 7px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const labelRadius = g.r + 31;
      ctx.fillText(
        channel.type + "⁺",
        g.cx + Math.cos(channel.angle) * labelRadius,
        g.cy + Math.sin(channel.angle) * labelRadius
      );
      ctx.restore();
    });

    state.pumps.forEach(function (pump) {
      const pumpX = g.cx + Math.cos(pump.angle) * g.r;
      const pumpY = g.cy + Math.sin(pump.angle) * g.r;
      const pumpActive = state.pumpOn;

      ctx.save();
      ctx.translate(pumpX, pumpY);
      ctx.rotate(pump.angle + Math.PI / 2);
      const pumpBody = ctx.createLinearGradient(-24, 0, 24, 0);
      pumpBody.addColorStop(0, pumpActive ? "rgba(45,42,64,.98)" : "rgba(40,42,47,.92)");
      pumpBody.addColorStop(.38, pumpActive ? "rgba(94,79,135,.94)" : "rgba(61,63,69,.74)");
      pumpBody.addColorStop(.62, pumpActive ? "rgba(65,53,98,.98)" : "rgba(46,48,54,.90)");
      pumpBody.addColorStop(1, pumpActive ? "rgba(36,33,53,.98)" : "rgba(37,39,44,.94)");

      ctx.shadowColor = pumpActive ? "rgba(130,110,180,.14)" : "transparent";
      ctx.shadowBlur = pumpActive ? 8 : 0;
      ctx.beginPath();
      ctx.moveTo(-16, -28);
      ctx.bezierCurveTo(-27, -19, -22, -6, -15, 0);
      ctx.bezierCurveTo(-23, 7, -26, 18, -15, 28);
      ctx.bezierCurveTo(-4, 23, 3, 23, 15, 28);
      ctx.bezierCurveTo(26, 18, 23, 7, 15, 0);
      ctx.bezierCurveTo(22, -6, 27, -19, 16, -28);
      ctx.bezierCurveTo(5, -24, -5, -24, -16, -28);
      ctx.closePath();
      ctx.fillStyle = pumpBody;
      ctx.fill();
      ctx.strokeStyle = pumpActive ? "rgba(171,155,211,.34)" : "rgba(130,130,140,.18)";
      ctx.lineWidth = 1.1;
      ctx.stroke();

      if (now < pump.pulseUntil) {
        ctx.strokeStyle = "rgba(188, 166, 255, .48)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-19, -28, 38, 56, 12);
        ctx.stroke();
      }
      ctx.restore();

      ["Na", "K"].forEach(function (type) {
        const slots = type === "Na" ? pump.naSlots : pump.kSlots;
        const activeSites = pumpSlotActive(pump, type);

        slots.forEach(function (ionId, index) {
          const p = pumpBindingPoint(pump, type, index, g);
          const occupied = ionId !== null;
          const siteColor = type === "Na" ? "#38bdf8" : "#f59e0b";

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, 11.8, 0, Math.PI * 2);
          const socket = ctx.createRadialGradient(p.x - 3, p.y - 3, 1, p.x, p.y, 12);
          socket.addColorStop(0, occupied
            ? (type === "Na" ? "rgba(67,151,191,.34)" : "rgba(178,117,41,.34)")
            : "rgba(23,27,34,.82)");
          socket.addColorStop(.72, "rgba(6,9,14,.96)");
          socket.addColorStop(1, "rgba(0,0,0,.98)");
          ctx.fillStyle = socket;
          ctx.fill();
          ctx.strokeStyle = activeSites && pumpActive
            ? siteColor
            : "rgba(126,137,154,.16)";
          ctx.globalAlpha = activeSites ? .58 : .24;
          ctx.lineWidth = occupied ? 1.2 : .9;
          ctx.stroke();
          ctx.restore();
        });
      });

      ctx.save();
      ctx.fillStyle = pumpActive ? "#bda8ff" : "#59616d";
      ctx.font = "800 7px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        "3Na⁺ : 2K⁺",
        g.cx + Math.cos(pump.angle) * (g.r + 47),
        g.cy + Math.sin(pump.angle) * (g.r + 47)
      );
      ctx.restore();
    });

    if (state.eventPulse && now < state.eventPulse.until) {
      const ratio = 1 - (state.eventPulse.until - now) / 780;
      const px = g.cx + Math.cos(state.eventPulse.angle) * g.r;
      const py = g.cy + Math.sin(state.eventPulse.angle) * g.r;
      ctx.save();
      ctx.strokeStyle = state.eventPulse.type === "Na"
        ? "rgba(56,189,248,.5)"
        : state.eventPulse.type === "K"
          ? "rgba(245,158,11,.5)"
          : "rgba(184,194,209,.24)";
      ctx.lineWidth = state.eventPulse.type === "blocked" ? 1 : 2;
      ctx.globalAlpha = (1 - ratio) * (state.eventPulse.type === "blocked" ? .6 : 1);
      ctx.beginPath();
      ctx.arc(
        px,
        py,
        state.eventPulse.type === "blocked" ? 12 + ratio * 13 : 16 + ratio * 35,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.restore();
    }

    state.ions.forEach(function (ion) {
      const p = normalizedToPoint(ion, g);
      const moving = Boolean(ion.transport);
      const bound = Boolean(ion.boundPumpId);
      const wobble = ion.id === state.draggingId || moving || bound
        ? 0
        : Math.sin(now * .0017 + ion.wobble) * 1.25;
      const x = p.x + wobble;
      const y = p.y + (moving || bound ? 0 : Math.cos(now * .0014 + ion.wobble) * 1.0);
      const crossing = moving ? ion.transport.chargeProgress : 0;
      const radius = bound
        ? 10.2
        : ion.radius * (1 - Math.sin(crossing * Math.PI) * .18);
      const glow = ion.id === state.draggingId || moving || now < ion.flashUntil;

      if (moving) {
        const trailEnd = pointAtRadius(ion.transport.angle, g.r, g);
        ctx.save();
        ctx.strokeStyle = ion.type === "Na"
          ? "rgba(56,189,248,.20)"
          : "rgba(245,158,11,.18)";
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(trailEnd.x, trailEnd.y);
        ctx.stroke();
        ctx.restore();
      }

      drawIonSphere(ctx, x, y, radius, ion.type, glow, bound);
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

    const thresholdY = yFor(-55);
    ctx.fillStyle = "rgba(246,199,100,.045)";
    ctx.fillRect(padL, thresholdY - 4, w - padL - padR, 8);

    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = "rgba(246,199,100,.82)";
    ctx.lineWidth = 1.35;
    ctx.shadowColor = "rgba(246,199,100,.18)";
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.moveTo(padL, thresholdY);
    ctx.lineTo(w - padR, thresholdY);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.setLineDash([]);
    ctx.font = "800 8px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "rgba(246,211,132,.92)";
    ctx.fillText("LIMIAR  −55 mV", w - padR - 4, thresholdY - 5);

    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = "rgba(104,120,140,.50)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, yFor(-70));
    ctx.lineTo(w - padR, yFor(-70));
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.font = "700 7px system-ui, sans-serif";
    ctx.fillStyle = "rgba(112,128,148,.72)";
    ctx.fillText("REPOUSO  −70 mV", w - padR - 4, yFor(-70) - 4);
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

  function setPumpMode(mode) {
    const nextMode = mode === "auto" ? "auto" : "manual";
    state.pumpMode = nextMode;

    // Cancela somente ligações parciais da ATPase para não misturar os modos.
    state.ions.forEach(function (ion) {
      if (!ion.boundPumpId) return;
      ion.boundPumpId = null;
      ion.boundSlotType = null;
      ion.boundSlotIndex = null;
      ion.flashUntil = performance.now() + 240;
    });

    resetPumps();

    const manualButton = $("pumpModeManual");
    const autoButton = $("pumpModeAuto");
    if (manualButton) {
      manualButton.classList.toggle("active", nextMode === "manual");
      manualButton.setAttribute("aria-pressed", String(nextMode === "manual"));
    }
    if (autoButton) {
      autoButton.classList.toggle("active", nextMode === "auto");
      autoButton.setAttribute("aria-pressed", String(nextMode === "auto"));
    }

    if ($("pumpModeMetric")) {
      $("pumpModeMetric").textContent = nextMode === "manual" ? "manual" : "automático";
    }

    setExplanation(
      nextMode === "manual" ? "ATPase em modo manual" : "ATPase em modo automático",
      nextMode === "manual"
        ? "Nenhum sítio será preenchido sozinho. Encaixe 3 Na⁺ do citoplasma; depois, quando a bomba virar para fora, encaixe 2 K⁺ extracelulares."
        : "A ATPase só captura automaticamente íons que chegarem à vizinhança imediata dos seus sítios por difusão.",
      nextMode === "manual"
        ? "3 Na⁺ manuais → mudança conformacional → 2 K⁺ manuais"
        : "captura local · sem puxar íons à distância"
    );
  }

  function bindControls() {
    if ($("pumpModeManual")) {
      $("pumpModeManual").addEventListener("click", function () {
        if (state.pumpMode !== "manual") setPumpMode("manual");
      });
    }

    if ($("pumpModeAuto")) {
      $("pumpModeAuto").addEventListener("click", function () {
        if (state.pumpMode !== "auto") setPumpMode("auto");
      });
    }

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
      const now = performance.now();

      if (now < state.refractoryUntil) {
        setExplanation(
          "Período refratário",
          "A membrana ainda está recuperando a excitabilidade. Um novo pulso não produz outro potencial de ação imediatamente.",
          "refratário  ·  novo disparo bloqueado"
        );
        return;
      }

      state.stimulusCurrent = 18;
      state.stimulusUntil = now + 220;

      setExplanation(
        "Pulso de corrente aplicado",
        "Uma corrente despolarizante carrega temporariamente a capacitância da membrana. Se o Vm cruzar o limiar, os canais dependentes de voltagem assumem a resposta.",
        "Iinj por 220 ms  →  ΔVm  →  limiar"
      );
    });

    $("resetMembrane").addEventListener("click", resetSimulation);
  }

  function resetSimulation() {
    state.pumpOn = true;
    state.pumpMode = "manual";
    state.naChannelOpen = true;
    state.kChannelOpen = true;
    state.vm = -70;
    state.lastVm = -70;
    state.stimulusCurrent = 0;
    state.stimulusUntil = 0;
    state.refractoryUntil = 0;
    state.history = new Array(150).fill(-70);
    state.actionPotential = null;
    state.eventPulse = null;
    state.pumpPulseUntil = 0;
    state.draggingId = null;
    state.draggingStart = null;
    state.lastBlockNotice = 0;
    state.lastPumpCycle = performance.now();
    state.lastLeakCycle = performance.now();
    state.lastPhysicsFlux = performance.now();

    resetPumps();
    spawnInitialIons();

    ["pumpToggle", "naChannelToggle", "kChannelToggle"].forEach(function (id) {
      const button = $(id);
      button.classList.add("on");
      button.setAttribute("aria-pressed", "true");
    });

    if ($("pumpModeManual")) {
      $("pumpModeManual").classList.add("active");
      $("pumpModeManual").setAttribute("aria-pressed", "true");
    }
    if ($("pumpModeAuto")) {
      $("pumpModeAuto").classList.remove("active");
      $("pumpModeAuto").setAttribute("aria-pressed", "false");
    }
    if ($("pumpModeMetric")) {
      $("pumpModeMetric").textContent = "manual";
    }

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

    updateParticlePhysics(delta);

    if (state.pumpOn) {
      runPumpCycle(now);
    }

    if (now - state.lastLeakCycle > (state.actionPotential ? 90 : 220)) {
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

  window.__membraneLab = {
    state: state,
    geometry: geometry,
    normalizedToPoint: normalizedToPoint,
    pumpBindingPoint: pumpBindingPoint,
    tryBindIonToPump: tryBindIonToPump,
    moveExternalIon: moveExternalIon,
    channels: CHANNELS
  };

  start();
})();