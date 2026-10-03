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
    lastPhysicsFlux: 0,
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
      radius: 13,
      vx: (Math.random() - .5) * 8,
      vy: (Math.random() - .5) * 8,
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
    return {
      na: state.naChannelOpen ? .04 : .0015,
      k: state.kChannelOpen ? 1 : .012
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
      base + pumpElectrogenic + crossingCharge + state.stimulusOffset,
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
          !ion.transport
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
      return !ion.transport && ion.id !== state.draggingId;
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
    if (state.actionPotential) return;

    CHANNELS.forEach(function (channel) {
      if (!channelIsOpen(channel.type)) return;

      const drive = electrochemicalDrive(channel.type);
      const fromZone = drive.outward ? "in" : "out";
      const toZone = drive.outward ? "out" : "in";
      const local = localIonCandidates(channel.type, fromZone, channel.angle, 48);

      if (!local.length) return;

      // Higher electrochemical drive means a nearby particle is more likely to cross.
      const chance = .16 + drive.strength * .56;
      if (Math.random() > chance) return;

      startIonTransport(local[0].ion, toZone, channel.angle, {
        kind: "channel",
        duration: 720,
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
    if (!state.pumpOn || state.actionPotential) return;

    const naLocal = localIonCandidates("Na", "in", PUMP_ANGLE, 64);
    const kLocal = localIonCandidates("K", "out", PUMP_ANGLE, 64);

    // A complete pump cycle only occurs when substrates are physically near the ATPase.
    if (naLocal.length < 3 || kLocal.length < 2) return;

    for (let i = 0; i < 3; i += 1) {
      startIonTransport(naLocal[i].ion, "out", PUMP_ANGLE, {
        kind: "pump",
        duration: 1120,
        delay: i * 95,
        silent: true,
        extra: 13 + i * 2
      });
    }

    for (let i = 0; i < 2; i += 1) {
      startIonTransport(kLocal[i].ion, "in", PUMP_ANGLE + .05, {
        kind: "pump",
        duration: 1120,
        delay: 70 + i * 125,
        silent: true,
        extra: 12 + i * 2
      });
    }

    state.pumpPulseUntil = now + 1250;
    setExplanation(
      "Ciclo local da bomba Na⁺/K⁺",
      "A bomba só funcionou porque 3 Na⁺ intracelulares e 2 K⁺ extracelulares chegaram fisicamente à sua vizinhança. Nenhuma partícula distante foi puxada.",
      "3 Na⁺ locais → fora  ·  2 K⁺ locais → dentro"
    );
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
    state.lastPhysicsFlux = performance.now();

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

    updateParticlePhysics(delta);

    if (state.pumpOn && now - state.lastPumpCycle > 720) {
      runPumpCycle(now);
      state.lastPumpCycle = now;
    }

    if (now - state.lastLeakCycle > 240) {
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