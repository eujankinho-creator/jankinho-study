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
    draggingLigand: null,
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
    pump: {
      phase: "na-loading",
      phaseStarted: performance.now(),
      naBoundIds: [],
      kBoundIds: [],
      atpBound: false,
      atpDrag: null,
      productsStarted: 0,
      productsUntil: 0,
      releaseIndex: 0,
      cycle: 0,
      pausedAt: 0
    },
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
  const PUMP_CAPTURE_RADIUS = 30;
  const PUMP_BODY_RADIUS = 58;
  const PUMP_PHASE = {
    NA_LOADING: "na-loading",
    PHOSPHORYLATING: "phosphorylating",
    RELEASING_NA: "releasing-na",
    K_LOADING: "k-loading",
    K_OCCLUDED: "k-occluded",
    RELEASING_K: "releasing-k"
  };

  function pumpGeometry(g) {
    const rx = Math.cos(PUMP_ANGLE);
    const ry = Math.sin(PUMP_ANGLE);
    const tx = -ry;
    const ty = rx;
    const x = g.cx + rx * g.r;
    const y = g.cy + ry * g.r;

    return {
      x: x,
      y: y,
      rx: rx,
      ry: ry,
      tx: tx,
      ty: ty,
      point: function (radial, tangent) {
        return {
          x: x + rx * radial + tx * tangent,
          y: y + ry * radial + ty * tangent
        };
      }
    };
  }

  function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function pumpNaRadial(now) {
    const phase = state.pump.phase;
    if (phase === PUMP_PHASE.NA_LOADING) return -9;

    if (phase === PUMP_PHASE.PHOSPHORYLATING) {
      const u = clamp((now - state.pump.phaseStarted) / 650, 0, 1);
      return -9 + u * 18;
    }

    return 9;
  }

  function pumpKRadial(now) {
    const phase = state.pump.phase;
    if (phase === PUMP_PHASE.K_LOADING) return 9;

    if (phase === PUMP_PHASE.K_OCCLUDED) {
      const u = clamp((now - state.pump.phaseStarted) / 650, 0, 1);
      return 9 - u * 18;
    }

    return -9;
  }

  function pumpSlotPoint(type, index, g, now) {
    const pg = pumpGeometry(g);
    const tangent = type === "Na"
      ? [-15, 0, 15][index]
      : [-10, 10][index];
    const radial = type === "Na" ? pumpNaRadial(now) : pumpKRadial(now);
    return pg.point(radial, tangent);
  }

  function atpSitePoint(g) {
    return pumpGeometry(g).point(-22, 25);
  }

  function atpTokenPoint(g) {
    if (state.pump.atpDrag) {
      return {
        x: state.pump.atpDrag.nx * g.w,
        y: state.pump.atpDrag.ny * g.h
      };
    }
    return pumpGeometry(g).point(-82, 35);
  }

  function ionPointForDrawing(ion, g, now) {
    if (ion.boundToPump === "Na") {
      return pumpSlotPoint("Na", ion.pumpSlot, g, now);
    }
    if (ion.boundToPump === "K") {
      return pumpSlotPoint("K", ion.pumpSlot, g, now);
    }
    return normalizedToPoint(ion, g);
  }

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
      if (ion.boundToPump) return;

      const p = ionPointForDrawing(ion, g, now);
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

  function restoreDraggedIon(ion, original) {
    ion.zone = original.zone;
    ion.nx = original.nx;
    ion.ny = original.ny;
  }

  function freePumpSlot(type, p, g, now) {
    const total = type === "Na" ? 3 : 2;
    const occupied = type === "Na" ? state.pump.naBoundIds : state.pump.kBoundIds;
    let best = -1;
    let bestDistance = Infinity;

    for (let index = 0; index < total; index += 1) {
      const alreadyUsed = occupied.some(function (id) {
        const boundIon = state.ions.find(function (item) { return item.id === id; });
        return boundIon && boundIon.pumpSlot === index;
      });
      if (alreadyUsed) continue;

      const slot = pumpSlotPoint(type, index, g, now);
      const d = distance(slot, p);
      if (d < bestDistance) {
        bestDistance = d;
        best = index;
      }
    }

    return bestDistance <= PUMP_CAPTURE_RADIUS ? best : -1;
  }

  function maybeStartPumpReaction(now) {
    if (
      state.pump.phase === PUMP_PHASE.NA_LOADING &&
      state.pump.naBoundIds.length === 3 &&
      state.pump.atpBound
    ) {
      state.pump.phase = PUMP_PHASE.PHOSPHORYLATING;
      state.pump.phaseStarted = now;
      state.pump.releaseIndex = 0;
      state.pumpPulseUntil = now + 1100;

      setExplanation(
        "Fosforilação da Na⁺/K⁺-ATPase",
        "Os 3 Na⁺ estão ocupando seus sítios no lado intracelular e o ATP também está ligado. Agora o ATP fosforila a proteína: só depois disso a bomba muda de conformação e pode liberar Na⁺ no EC.",
        "3 Na⁺ + ATP → bomba fosforilada"
      );
      setHint("Fosforilação iniciada. Observe a mudança de conformação antes da saída do Na⁺.");
      return;
    }

    if (
      state.pump.phase === PUMP_PHASE.K_LOADING &&
      state.pump.kBoundIds.length === 2
    ) {
      state.pump.phase = PUMP_PHASE.K_OCCLUDED;
      state.pump.phaseStarted = now;
      state.pump.releaseIndex = 0;
      state.pumpPulseUntil = now + 950;

      setExplanation(
        "2 K⁺ ligados no lado extracelular",
        "As duas cavidades externas foram ocupadas por K⁺. A bomba fecha esses sítios e começa a retornar para a conformação voltada ao IC.",
        "2 K⁺ ligados → retorno para E1"
      );
      setHint("Os 2 K⁺ estão ocluídos. Agora a proteína volta a abrir para o IC.");
    }
  }

  function tryBindIonToPump(ion, p, original, now) {
    if (!state.pumpOn) return false;

    const g = geometry();
    const pg = pumpGeometry(g);
    if (distance(p, pg) > PUMP_BODY_RADIUS) return false;

    const phase = state.pump.phase;

    if (phase === PUMP_PHASE.NA_LOADING) {
      if (ion.type !== "Na" || original.zone !== "in") {
        restoreDraggedIon(ion, original);
        setExplanation(
          "Sítios voltados para o IC",
          "Nesta conformação a bomba aceita somente Na⁺ vindo do meio intracelular. Encaixe três Na⁺ nas três cavidades internas.",
          "E1: 3 sítios para Na⁺ no IC"
        );
        setHint("Use Na⁺ do IC e solte-o diretamente sobre uma cavidade da bomba.");
        return true;
      }

      const slot = freePumpSlot("Na", p, g, now);
      if (slot < 0) {
        restoreDraggedIon(ion, original);
        setHint("Solte o Na⁺ sobre um dos espaços livres dentro da proteína.");
        return true;
      }

      ion.boundToPump = "Na";
      ion.pumpSlot = slot;
      ion.zone = "in";
      state.pump.naBoundIds.push(ion.id);
      ion.flashUntil = now + 650;

      setExplanation(
        "Na⁺ encaixado na bomba",
        "O Na⁺ ficou preso em um sítio voltado para o IC. A proteína ainda não transporta nada: são necessários 3 Na⁺ e ATP ligados antes da fosforilação.",
        state.pump.naBoundIds.length + "/3 Na⁺ ligados  ·  ATP " + (state.pump.atpBound ? "ligado" : "livre")
      );
      setHint(state.pump.naBoundIds.length < 3
        ? "Encaixe os outros Na⁺ nas cavidades livres."
        : (state.pump.atpBound ? "Todos os reagentes ligados." : "Agora arraste ATP até o sítio de ATP."));
      maybeStartPumpReaction(now);
      return true;
    }

    if (phase === PUMP_PHASE.K_LOADING) {
      if (ion.type !== "K" || original.zone !== "out") {
        restoreDraggedIon(ion, original);
        setExplanation(
          "Conformação aberta para o EC",
          "Depois de liberar os 3 Na⁺ e os produtos do ATP, a bomba expõe duas novas cavidades para K⁺ no lado extracelular.",
          "E2: 2 sítios para K⁺ no EC"
        );
        setHint("Use K⁺ do EC e solte-o em uma das duas novas cavidades.");
        return true;
      }

      const slot = freePumpSlot("K", p, g, now);
      if (slot < 0) {
        restoreDraggedIon(ion, original);
        setHint("Solte o K⁺ sobre um dos dois espaços livres da bomba.");
        return true;
      }

      ion.boundToPump = "K";
      ion.pumpSlot = slot;
      ion.zone = "out";
      state.pump.kBoundIds.push(ion.id);
      ion.flashUntil = now + 650;

      setExplanation(
        "K⁺ encaixado na bomba",
        "O K⁺ entrou em uma cavidade que só apareceu após a liberação do Na⁺. Quando os 2 sítios estiverem ocupados, a proteína retorna para o lado IC.",
        state.pump.kBoundIds.length + "/2 K⁺ ligados"
      );
      setHint(state.pump.kBoundIds.length < 2
        ? "Encaixe mais um K⁺ na segunda cavidade."
        : "Os dois K⁺ estão ligados.");
      maybeStartPumpReaction(now);
      return true;
    }

    restoreDraggedIon(ion, original);
    setExplanation(
      "Bomba em transição",
      "A proteína está mudando de conformação. Durante esta etapa os sítios não aceitam novos íons.",
      "aguarde a etapa atual"
    );
    setHint("Espere a bomba terminar esta etapa antes de encaixar outro íon.");
    return true;
  }

  function releaseBoundIon(id, type, slot, toZone, now) {
    const ion = state.ions.find(function (item) { return item.id === id; });
    if (!ion) return;

    ion.boundToPump = null;
    ion.pumpSlot = null;
    placeIonNearAngle(
      ion,
      PUMP_ANGLE + (type === "Na" ? (slot - 1) * .075 : (slot === 0 ? -.055 : .055)),
      toZone,
      18 + slot * 5
    );
    ion.flashUntil = now + 950;
    state.eventPulse = {
      type: type,
      angle: PUMP_ANGLE,
      until: now + 780
    };
  }

  function updatePumpCycle(now) {
    if (!state.pumpOn || state.actionPotential) return;

    const phase = state.pump.phase;
    const elapsed = now - state.pump.phaseStarted;

    if (phase === PUMP_PHASE.PHOSPHORYLATING && elapsed >= 650) {
      state.pump.phase = PUMP_PHASE.RELEASING_NA;
      state.pump.phaseStarted = now;
      state.pump.releaseIndex = 0;
      state.pumpPulseUntil = now + 1200;

      setExplanation(
        "Conformação aberta para o EC",
        "A fosforilação mudou a conformação da proteína. Agora os sítios que seguravam os 3 Na⁺ estão voltados para o meio extracelular e o Na⁺ pode ser liberado.",
        "P-bomba · 3 Na⁺ → EC"
      );
      setHint("Os três Na⁺ serão liberados para o EC antes de surgirem os sítios de K⁺.");
      return;
    }

    if (phase === PUMP_PHASE.RELEASING_NA) {
      const thresholds = [220, 470, 720];
      while (
        state.pump.releaseIndex < 3 &&
        elapsed >= thresholds[state.pump.releaseIndex]
      ) {
        const slot = state.pump.releaseIndex;
        const id = state.pump.naBoundIds[slot];
        releaseBoundIon(id, "Na", slot, "out", now);
        state.pump.releaseIndex += 1;
      }

      if (elapsed >= 980) {
        state.pump.naBoundIds = [];
        state.pump.atpBound = false;
        state.pump.atpDrag = null;
        state.pump.productsStarted = now;
        state.pump.productsUntil = now + 1600;
        state.pump.phase = PUMP_PHASE.K_LOADING;
        state.pump.phaseStarted = now;
        state.pump.releaseIndex = 0;

        setExplanation(
          "ATP convertido em ADP + Pi",
          "Somente depois que os 3 Na⁺ foram liberados no EC, o ATP deixa o sítio como ADP + Pi. A conformação externa passa a exibir duas novas cavidades para entrada de K⁺.",
          "ATP → ADP + Pi  ·  2 K⁺ podem ligar"
        );
        setHint("Agora arraste 2 K⁺ do EC para as duas cavidades que apareceram.");
      }
      return;
    }

    if (phase === PUMP_PHASE.K_OCCLUDED && elapsed >= 650) {
      state.pump.phase = PUMP_PHASE.RELEASING_K;
      state.pump.phaseStarted = now;
      state.pump.releaseIndex = 0;
      state.pumpPulseUntil = now + 1000;

      setExplanation(
        "Retorno da bomba para o IC",
        "A proteína voltou para a conformação voltada ao citoplasma. Os dois K⁺ agora ficam expostos ao IC e serão liberados para dentro da célula.",
        "2 K⁺ → IC"
      );
      setHint("A bomba abriu para o IC; os K⁺ serão liberados no citoplasma.");
      return;
    }

    if (phase === PUMP_PHASE.RELEASING_K) {
      const thresholds = [220, 510];
      while (
        state.pump.releaseIndex < 2 &&
        elapsed >= thresholds[state.pump.releaseIndex]
      ) {
        const slot = state.pump.releaseIndex;
        const id = state.pump.kBoundIds[slot];
        releaseBoundIon(id, "K", slot, "in", now);
        state.pump.releaseIndex += 1;
      }

      if (elapsed >= 820) {
        state.pump.kBoundIds = [];
        state.pump.phase = PUMP_PHASE.NA_LOADING;
        state.pump.phaseStarted = now;
        state.pump.releaseIndex = 0;
        state.pump.cycle += 1;
        state.pump.productsStarted = 0;
        state.pump.productsUntil = 0;

        setExplanation(
          "Ciclo concluído",
          "Os 2 K⁺ foram entregues ao IC. A Na⁺/K⁺-ATPase voltou à conformação inicial e novamente apresenta três cavidades para Na⁺ e um sítio para ATP.",
          "3 Na⁺ para fora · 2 K⁺ para dentro · 1 ATP"
        );
        setHint("Novo ciclo: encaixe 3 Na⁺ do IC e ATP.");
      }
    }
  }

  function bindCellInteraction() {
    const canvas = $("cellCanvas");

    canvas.addEventListener("pointerdown", function (event) {
      const p = pointerPosition(event);
      const g = geometry();

      if (
        state.pumpOn &&
        state.pump.phase === PUMP_PHASE.NA_LOADING &&
        !state.pump.atpBound &&
        distance(p, atpTokenPoint(g)) <= 24
      ) {
        state.draggingLigand = "ATP";
        state.pump.atpDrag = {
          nx: p.x / g.w,
          ny: p.y / g.h
        };
        canvas.classList.add("dragging");
        canvas.setPointerCapture(event.pointerId);
        event.preventDefault();
        return;
      }

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
      const p = pointerPosition(event);
      const g = geometry();

      if (state.draggingLigand === "ATP") {
        state.pump.atpDrag = {
          nx: clamp(p.x / g.w, .02, .98),
          ny: clamp(p.y / g.h, .025, .975)
        };
        event.preventDefault();
        return;
      }

      if (!state.draggingId) return;

      const ion = state.ions.find(function (item) {
        return item.id === state.draggingId;
      });
      if (!ion) return;

      ion.nx = clamp(p.x / g.w, .02, .98);
      ion.ny = clamp(p.y / g.h, .025, .975);
      event.preventDefault();
    });

    function finishDrag(event) {
      const now = performance.now();

      if (state.draggingLigand === "ATP") {
        const g = geometry();
        const p = pointerPosition(event);
        const site = atpSitePoint(g);

        state.draggingLigand = null;
        canvas.classList.remove("dragging");

        if (canvas.hasPointerCapture && canvas.hasPointerCapture(event.pointerId)) {
          canvas.releasePointerCapture(event.pointerId);
        }

        if (
          state.pumpOn &&
          state.pump.phase === PUMP_PHASE.NA_LOADING &&
          distance(p, site) <= 30
        ) {
          state.pump.atpBound = true;
          state.pump.atpDrag = null;
          state.pumpPulseUntil = now + 700;

          setExplanation(
            "ATP encaixado",
            "O ATP está ligado ao domínio citoplasmático da bomba. A fosforilação só começa quando os três sítios de Na⁺ também estiverem ocupados.",
            "ATP ligado · Na⁺ " + state.pump.naBoundIds.length + "/3"
          );
          setHint(state.pump.naBoundIds.length === 3
            ? "ATP e 3 Na⁺ ligados: a fosforilação começa agora."
            : "ATP ligado. Complete as três cavidades com Na⁺ do IC.");
          maybeStartPumpReaction(now);
        } else {
          state.pump.atpDrag = null;
          setHint("Arraste ATP até o sítio de ATP na própria proteína.");
        }
        return;
      }

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

      if (tryBindIonToPump(ion, p, original, now)) return;

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
      return item.type === type &&
        item.zone === fromZone &&
        item.id !== state.draggingId &&
        !item.boundToPump;
    });

    if (!ion) return false;

    placeIonNearAngle(ion, angle, toZone, extra || 0);
    return true;
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
    $("pumpStateMetric").textContent = pumpStatusText();
  }

  function pumpStatusText() {
    if (!state.pumpOn) return "desligada";

    const phase = state.pump.phase;
    if (phase === PUMP_PHASE.NA_LOADING) {
      return state.pump.naBoundIds.length + "/3 Na⁺ · " + (state.pump.atpBound ? "ATP ✓" : "ATP");
    }
    if (phase === PUMP_PHASE.PHOSPHORYLATING) return "fosforilando";
    if (phase === PUMP_PHASE.RELEASING_NA) return "3 Na⁺ → EC";
    if (phase === PUMP_PHASE.K_LOADING) return state.pump.kBoundIds.length + "/2 K⁺ · EC";
    if (phase === PUMP_PHASE.K_OCCLUDED) return "retornando";
    return "2 K⁺ → IC";
  }

  function drawPumpToken(ctx, x, y, label, stroke, fill, dragging) {
    ctx.save();
    if (dragging) {
      ctx.shadowColor = stroke;
      ctx.shadowBlur = 18;
    } else {
      ctx.shadowColor = stroke;
      ctx.shadowBlur = 9;
    }
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(x - 19, y - 11, 38, 22, 11);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#eef5ff";
    ctx.font = "800 8px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y + .5);
    ctx.restore();
  }

  function drawPump(ctx, g, now) {
    const pg = pumpGeometry(g);
    const phase = state.pump.phase;
    const active = state.pumpOn;
    const outward =
      phase === PUMP_PHASE.PHOSPHORYLATING ||
      phase === PUMP_PHASE.RELEASING_NA ||
      phase === PUMP_PHASE.K_LOADING ||
      phase === PUMP_PHASE.K_OCCLUDED;

    ctx.save();
    ctx.translate(pg.x, pg.y);
    ctx.rotate(PUMP_ANGLE);

    const conformProgress = phase === PUMP_PHASE.PHOSPHORYLATING
      ? clamp((now - state.pump.phaseStarted) / 650, 0, 1)
      : (outward ? 1 : 0);

    ctx.rotate(conformProgress * .055);
    ctx.scale(1 + conformProgress * .07, 1 - conformProgress * .035);

    if (active) {
      ctx.shadowColor = now < state.pumpPulseUntil
        ? "rgba(176, 130, 255, .9)"
        : "rgba(139, 92, 246, .48)";
      ctx.shadowBlur = now < state.pumpPulseUntil ? 24 : 13;
    }

    const bodyGradient = ctx.createLinearGradient(-34, -26, 38, 28);
    bodyGradient.addColorStop(0, active ? "rgba(83, 58, 145, .98)" : "rgba(65, 68, 78, .9)");
    bodyGradient.addColorStop(.48, active ? "rgba(120, 78, 187, .98)" : "rgba(77, 80, 90, .9)");
    bodyGradient.addColorStop(1, active ? "rgba(57, 36, 111, .98)" : "rgba(54, 57, 66, .9)");

    ctx.beginPath();
    ctx.moveTo(-29, -29);
    ctx.bezierCurveTo(-42, -22, -42, -8, -31, -1);
    ctx.bezierCurveTo(-41, 8, -34, 27, -18, 31);
    ctx.bezierCurveTo(-5, 35, 2, 27, 10, 27);
    ctx.bezierCurveTo(26, 30, 39, 18, 35, 3);
    ctx.bezierCurveTo(42, -12, 31, -30, 15, -28);
    ctx.bezierCurveTo(4, -26, -3, -33, -15, -32);
    ctx.closePath();
    ctx.fillStyle = bodyGradient;
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.globalAlpha = active ? .68 : .28;
    ctx.strokeStyle = active ? "rgba(222, 205, 255, .64)" : "rgba(180,180,190,.22)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-20, -22);
    ctx.bezierCurveTo(-4, -9, -8, 12, 16, 21);
    ctx.stroke();
    ctx.globalAlpha = 1;

    function cavity(radial, tangent, rx, ry) {
      ctx.save();
      ctx.fillStyle = "rgba(5, 10, 20, .92)";
      ctx.beginPath();
      ctx.ellipse(radial, tangent, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (
      phase === PUMP_PHASE.NA_LOADING ||
      phase === PUMP_PHASE.PHOSPHORYLATING ||
      phase === PUMP_PHASE.RELEASING_NA
    ) {
      const radial = pumpNaRadial(now);
      [-15, 0, 15].forEach(function (tangent) {
        cavity(radial, tangent, 7.8, 6.5);
      });
    }

    if (
      phase === PUMP_PHASE.K_LOADING ||
      phase === PUMP_PHASE.K_OCCLUDED ||
      phase === PUMP_PHASE.RELEASING_K
    ) {
      const radial = pumpKRadial(now);
      [-10, 10].forEach(function (tangent) {
        cavity(radial, tangent, 8.2, 7.1);
      });
    }

    const siteRadial = -22;
    const siteTangent = 25;
    if (phase === PUMP_PHASE.NA_LOADING || phase === PUMP_PHASE.PHOSPHORYLATING) {
      cavity(siteRadial, siteTangent, 11, 6.4);
      ctx.fillStyle = state.pump.atpBound ? "#e8d6ff" : "rgba(222, 205, 255, .72)";
      ctx.font = "800 6px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(state.pump.atpBound ? "ATP" : "ATP", siteRadial, siteTangent + .5);
    }

    ctx.restore();

    if (
      phase === PUMP_PHASE.NA_LOADING &&
      !state.pump.atpBound
    ) {
      const atp = atpTokenPoint(g);
      drawPumpToken(
        ctx,
        atp.x,
        atp.y,
        "ATP",
        "#c4a7ff",
        "rgba(109, 70, 176, .48)",
        state.draggingLigand === "ATP"
      );
    }

    if (now < state.pump.productsUntil && state.pump.productsStarted > 0) {
      const total = Math.max(1, state.pump.productsUntil - state.pump.productsStarted);
      const u = clamp((now - state.pump.productsStarted) / total, 0, 1);
      const adp = pg.point(-48 - u * 34, 25 + u * 7);
      const pi = pg.point(-43 - u * 30, -20 - u * 5);
      ctx.save();
      ctx.globalAlpha = 1 - u * .72;
      drawPumpToken(ctx, adp.x, adp.y, "ADP", "#d9c6ff", "rgba(92, 63, 150, .38)", false);
      drawPumpToken(ctx, pi.x, pi.y, "Pi", "#f2d58c", "rgba(156, 113, 37, .34)", false);
      ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = active ? "#d7c7ff" : "#687180";
    ctx.font = "800 8px system-ui, sans-serif";
    ctx.textAlign = "center";
    const label = pg.point(0, 48);
    ctx.fillText("Na⁺/K⁺-ATPase", label.x, label.y);
    ctx.font = "700 7px system-ui, sans-serif";
    ctx.fillStyle = "rgba(210,220,238,.6)";
    const ec = pg.point(58, 0);
    const ic = pg.point(-58, 0);
    ctx.fillText("EC", ec.x, ec.y);
    ctx.fillText("IC", ic.x, ic.y);
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

    drawPump(ctx, g, now);

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

      const now = performance.now();

      if (state.pumpOn) {
        if (state.pump.pausedAt) {
          const pausedFor = now - state.pump.pausedAt;
          state.pump.phaseStarted += pausedFor;
          if (state.pump.productsStarted) state.pump.productsStarted += pausedFor;
          if (state.pump.productsUntil) state.pump.productsUntil += pausedFor;
          state.pump.pausedAt = 0;
        }

        setExplanation(
          "Bomba reativada",
          "A Na⁺/K⁺-ATPase continua exatamente da etapa em que parou. O transporte só ocorre depois dos encaixes e mudanças de conformação corretos.",
          pumpStatusText()
        );
      } else {
        state.pump.pausedAt = now;
        state.draggingLigand = null;
        state.pump.atpDrag = null;

        setExplanation(
          "Bomba desligada",
          "A sequência da Na⁺/K⁺-ATPase ficou pausada. Nenhum Na⁺ ou K⁺ será transportado ativamente enquanto a bomba estiver desligada.",
          "ATPase OFF  ·  ciclo pausado"
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
    state.draggingLigand = null;
    state.pump = {
      phase: PUMP_PHASE.NA_LOADING,
      phaseStarted: performance.now(),
      naBoundIds: [],
      kBoundIds: [],
      atpBound: false,
      atpDrag: null,
      productsStarted: 0,
      productsUntil: 0,
      releaseIndex: 0,
      cycle: 0,
      pausedAt: 0
    };
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
    setHint("Bomba: encaixe 3 Na⁺ do IC nas cavidades e arraste ATP para o sítio da proteína.");
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

    updatePumpCycle(now);

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