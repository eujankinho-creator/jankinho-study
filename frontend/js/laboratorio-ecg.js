(function () {
  "use strict";

  const $ = function (id) {
    return document.getElementById(id);
  };

  const LEADS = [
    { id: "I", group: "limb", scale: 0.72, polarity: 1.0 },
    { id: "II", group: "limb", scale: 1.0, polarity: 1.0 },
    { id: "III", group: "limb", scale: 0.76, polarity: 1.0 },
    { id: "aVR", group: "limb", scale: 0.72, polarity: -1.0 },
    { id: "aVL", group: "limb", scale: 0.55, polarity: 1.0 },
    { id: "aVF", group: "limb", scale: 0.86, polarity: 1.0 },
    { id: "V1", group: "chest", scale: 0.72, polarity: -0.55 },
    { id: "V2", group: "chest", scale: 0.82, polarity: -0.25 },
    { id: "V3", group: "chest", scale: 0.92, polarity: 0.15 },
    { id: "V4", group: "chest", scale: 1.02, polarity: 0.70 },
    { id: "V5", group: "chest", scale: 1.0, polarity: 0.95 },
    { id: "V6", group: "chest", scale: 0.88, polarity: 0.90 },
    { id: "V7", group: "posterior", scale: 0.72, polarity: 0.78 },
    { id: "V8", group: "posterior", scale: 0.64, polarity: 0.72 },
    { id: "V9", group: "posterior", scale: 0.58, polarity: 0.66 },
    { id: "V3R", group: "right", scale: 0.70, polarity: -0.35 },
    { id: "V4R", group: "right", scale: 0.75, polarity: -0.18 },
    { id: "V5R", group: "right", scale: 0.68, polarity: 0.04 },
    { id: "V6R", group: "right", scale: 0.60, polarity: 0.12 }
  ];

  const CORE_LEADS = new Set([
    "I", "II", "III", "aVR", "aVL", "aVF",
    "V1", "V2", "V3", "V4", "V5", "V6"
  ]);

  const PHASES = [
    {
      index: "00",
      min: 0.00,
      max: 0.05,
      title: "Linha de base — repouso elétrico",
      category: "DIÁSTOLE ELÉTRICA",
      short: "Repouso elétrico",
      vector: "Sem vetor dominante",
      description: "Entre os ciclos, não há um vetor cardíaco dominante. O traçado retorna à linha isoelétrica.",
      glow: [0.0, 0.15, 0.1],
      vector3d: [0.0, 0.1, 0.0]
    },
    {
      index: "01",
      min: 0.05,
      max: 0.12,
      title: "Onda P — despolarização atrial",
      category: "ATIVAÇÃO ATRIAL",
      short: "Onda P",
      vector: "Átrios → nó AV",
      description: "O impulso parte do nó sinusal e se propaga pelos átrios. A onda P representa a despolarização atrial.",
      glow: [0.05, 0.82, 0.08],
      vector3d: [0.25, -0.38, 0.05]
    },
    {
      index: "02",
      min: 0.12,
      max: 0.18,
      title: "Segmento PR — condução pelo nó AV",
      category: "CONDUÇÃO ATRIOVENTRICULAR",
      short: "Segmento PR",
      vector: "Atraso fisiológico no nó AV",
      description: "A condução desacelera no nó AV antes de alcançar o sistema His–Purkinje. Esse atraso favorece o enchimento ventricular.",
      glow: [0.03, 0.40, 0.02],
      vector3d: [0.02, -0.50, 0.02]
    },
    {
      index: "03",
      min: 0.18,
      max: 0.225,
      title: "Início do QRS — ativação septal",
      category: "DESPOLARIZAÇÃO VENTRICULAR",
      short: "QRS septal",
      vector: "Septo: esquerda → direita",
      description: "O septo interventricular é ativado primeiro. O vetor inicial se desloca da esquerda para a direita antes da massa ventricular dominar o QRS.",
      glow: [0.05, 0.08, 0.02],
      vector3d: [0.62, -0.08, 0.05]
    },
    {
      index: "04",
      min: 0.225,
      max: 0.29,
      title: "QRS — ativação da massa ventricular",
      category: "DESPOLARIZAÇÃO VENTRICULAR",
      short: "QRS principal",
      vector: "Base/septo → ápice e parede livre",
      description: "A maior massa do ventrículo esquerdo passa a dominar o vetor. A ativação percorre rapidamente o miocárdio pelo sistema de Purkinje.",
      glow: [-0.20, -0.40, 0.10],
      vector3d: [-0.72, -0.92, 0.12]
    },
    {
      index: "05",
      min: 0.29,
      max: 0.36,
      title: "Fim do QRS — regiões basais",
      category: "FINAL DA DESPOLARIZAÇÃO",
      short: "Fim do QRS",
      vector: "Últimas forças ventriculares",
      description: "As últimas regiões ventriculares são ativadas e o vetor líquido diminui, encerrando o complexo QRS.",
      glow: [-0.10, 0.28, -0.10],
      vector3d: [-0.26, 0.55, -0.12]
    },
    {
      index: "06",
      min: 0.36,
      max: 0.44,
      title: "Segmento ST — ventrículos despolarizados",
      category: "PLATÔ ELÉTRICO",
      short: "Segmento ST",
      vector: "Pouco vetor líquido",
      description: "Grande parte do miocárdio ventricular encontra-se despolarizada ao mesmo tempo, produzindo pouco vetor líquido e um segmento próximo da linha de base.",
      glow: [0.0, -0.20, 0.0],
      vector3d: [0.05, 0.0, 0.0]
    },
    {
      index: "07",
      min: 0.44,
      max: 0.58,
      title: "Onda T — repolarização ventricular",
      category: "REPOLARIZAÇÃO VENTRICULAR",
      short: "Onda T",
      vector: "Repolarização ventricular",
      description: "A repolarização ventricular gera a onda T. Apesar de ser um processo de recuperação elétrica, a direção resultante costuma produzir T positiva em várias derivações.",
      glow: [-0.28, -0.32, 0.02],
      vector3d: [-0.50, -0.60, 0.08]
    },
    {
      index: "08",
      min: 0.58,
      max: 0.68,
      title: "Fim da onda T — recuperação elétrica",
      category: "RECUPERAÇÃO",
      short: "Fim da T",
      vector: "Vetor reduzindo",
      description: "A repolarização se completa progressivamente e o vetor líquido retorna a valores mínimos.",
      glow: [0.0, -0.05, 0.0],
      vector3d: [-0.10, -0.12, 0.02]
    },
    {
      index: "09",
      min: 0.68,
      max: 1.01,
      title: "Intervalo TP — preparação para novo ciclo",
      category: "LINHA ISOELÉTRICA",
      short: "Intervalo TP",
      vector: "Sem vetor dominante",
      description: "O coração permanece eletricamente em repouso até o próximo disparo sinusal. O ciclo então recomeça.",
      glow: [0.0, 0.08, 0.0],
      vector3d: [0.0, 0.0, 0.0]
    }
  ];

  const GUIDED = [
    ["0", "Ritmo e frequência", "Observe regularidade, relação P–QRS e frequência.", 0.03],
    ["1", "Onda P", "Confirme morfologia e sequência atrial.", 0.08],
    ["2", "Intervalo PR", "Avalie o tempo de condução atrioventricular.", 0.15],
    ["3", "QRS septal", "Veja o vetor inicial de ativação do septo.", 0.20],
    ["4", "QRS principal", "Acompanhe a massa ventricular dominante.", 0.25],
    ["5", "Eixo elétrico", "Relacione o vetor com I, II, aVF e demais derivações.", 0.28],
    ["6", "Segmento ST", "Compare o ST com a linha isoelétrica.", 0.39],
    ["7", "Onda T", "Observe a repolarização ventricular.", 0.50],
    ["8", "QT / QTc", "Integre despolarização e repolarização ventriculares.", 0.57],
    ["9", "Revisão global", "Releia o traçado completo de forma sistemática.", 0.73]
  ];

  const PATTERNS = [
    {
      id: "sinus",
      name: "Ritmo sinusal",
      caption: "Referência didática",
      description: "P antes de cada QRS, intervalos regulares e progressão precordial preservada no modelo didático.",
      bpm: 72,
      tags: ["P presente", "QRS estreito", "Regular"]
    },
    {
      id: "brady",
      name: "Bradicardia sinusal",
      caption: "Frequência reduzida",
      description: "Mantém a sequência sinusal, porém com maior intervalo entre os ciclos cardíacos.",
      bpm: 48,
      tags: ["P presente", "FC baixa", "Regular"]
    },
    {
      id: "tachy",
      name: "Taquicardia sinusal",
      caption: "Frequência elevada",
      description: "Ritmo sinusal com ciclos mais próximos entre si e redução do intervalo diastólico.",
      bpm: 118,
      tags: ["P presente", "FC alta", "Regular"]
    },
    {
      id: "af",
      name: "Fibrilação atrial",
      caption: "Ritmo irregular",
      description: "Modelo visual com ausência de P organizada e irregularidade entre os complexos QRS.",
      bpm: 96,
      tags: ["Sem P organizada", "RR irregular", "Fibrilação"]
    },
    {
      id: "av1",
      name: "BAV de 1º grau",
      caption: "PR prolongado",
      description: "Cada onda P conduz ao QRS, porém o intervalo PR é prolongado no modelo.",
      bpm: 68,
      tags: ["PR prolongado", "1:1", "QRS após P"]
    },
    {
      id: "rbbb",
      name: "Bloqueio de ramo D",
      caption: "QRS alargado",
      description: "Simulação didática de atraso da ativação ventricular direita, com QRS mais largo e terminal modificado em V1.",
      bpm: 72,
      tags: ["QRS largo", "V1 terminal", "Condução intraventricular"]
    },
    {
      id: "stemi",
      name: "Elevação do ST",
      caption: "Alteração de ST",
      description: "Padrão educacional simplificado de elevação do segmento ST em derivações anteriores para treinamento visual.",
      bpm: 78,
      tags: ["ST elevado", "V2–V4", "Padrão didático"]
    },
    {
      id: "hyperk",
      name: "Hipercalemia",
      caption: "T apiculada",
      description: "Modelo didático com ondas T mais altas e estreitas, podendo evoluir com alargamento do QRS em graus maiores.",
      bpm: 70,
      tags: ["T apiculada", "Repolarização", "Eletrólitos"]
    }
  ];

  const state = {
    running: false,
    phase: 0.20,
    lastFrame: performance.now(),
    yaw: -0.35,
    pitch: 0.12,
    zoom: 1.0,
    sectioned: false,
    selectedLeads: new Set(LEADS.map(function (lead) { return lead.id; })),
    pattern: "sinus",
    dragging: false,
    dragX: 0,
    dragY: 0
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function wrap(value) {
    value = value % 1;
    return value < 0 ? value + 1 : value;
  }

  function currentPattern() {
    return PATTERNS.find(function (item) {
      return item.id === state.pattern;
    }) || PATTERNS[0];
  }

  function phaseInfo(value) {
    const p = wrap(value);
    for (let i = 0; i < PHASES.length; i += 1) {
      if (p >= PHASES[i].min && p < PHASES[i].max) {
        return PHASES[i];
      }
    }
    return PHASES[0];
  }

  async function api(url, options) {
    const response = await fetch(url, Object.assign({
      credentials: "same-origin"
    }, options || {}));

    if (response.status === 401) {
      location.href = "/login.html";
      throw new Error("Sessão expirada");
    }

    const data = await response.json().catch(function () {
      return {};
    });

    if (!response.ok) {
      throw new Error(data.error || "Erro na requisição");
    }

    return data;
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

  function resizeCanvas(canvas, cssHeight) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width * dpr));
    const targetCssHeight = cssHeight || rect.height || 400;
    const height = Math.max(1, Math.round(targetCssHeight * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    return {
      width: width,
      height: height,
      dpr: dpr,
      cssWidth: width / dpr,
      cssHeight: height / dpr
    };
  }

  function rotatePoint(point) {
    let x = point[0];
    let y = point[1];
    let z = point[2];

    const cy = Math.cos(state.yaw);
    const sy = Math.sin(state.yaw);
    const x1 = x * cy - z * sy;
    const z1 = x * sy + z * cy;
    x = x1;
    z = z1;

    const cp = Math.cos(state.pitch);
    const sp = Math.sin(state.pitch);
    const y1 = y * cp - z * sp;
    const z2 = y * sp + z * cp;

    return [x, y1, z2];
  }

  function projectPoint(point, width, height, scale) {
    const p = rotatePoint(point);
    const perspective = 4.4 / (4.4 + p[2]);
    return {
      x: width * 0.5 + p[0] * scale * perspective,
      y: height * 0.49 - p[1] * scale * perspective,
      z: p[2],
      perspective: perspective
    };
  }

  function ellipsoidMesh(cx, cy, cz, rx, ry, rz, rows, cols) {
    const vertices = [];
    const faces = [];

    for (let i = 0; i <= rows; i += 1) {
      const v = i / rows;
      const theta = Math.PI * v;

      for (let j = 0; j <= cols; j += 1) {
        const u = j / cols;
        const phi = Math.PI * 2 * u;
        const sinT = Math.sin(theta);

        vertices.push([
          cx + rx * sinT * Math.cos(phi),
          cy + ry * Math.cos(theta),
          cz + rz * sinT * Math.sin(phi)
        ]);
      }
    }

    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        const a = i * (cols + 1) + j;
        const b = a + 1;
        const c = a + (cols + 1);
        const d = c + 1;
        faces.push([a, c, b]);
        faces.push([b, c, d]);
      }
    }

    return {
      vertices: vertices,
      faces: faces
    };
  }

  function ventricularMesh() {
    const rows = 28;
    const cols = 40;
    const vertices = [];
    const faces = [];

    for (let i = 0; i <= rows; i += 1) {
      const t = i / rows;
      const theta = Math.PI * t;
      const baseRadius = Math.pow(Math.sin(theta), 0.74);
      const y = 1.08 - 2.45 * t;

      for (let j = 0; j <= cols; j += 1) {
        const u = j / cols;
        const phi = Math.PI * 2 * u;

        const frontBulge = 1 + 0.12 * Math.cos(phi - 0.35);
        const lateral = 1 + 0.09 * Math.cos(2 * phi) * (1 - t);
        const taper = 0.98 - 0.18 * t;
        let x = 0.96 * baseRadius * frontBulge * lateral * Math.cos(phi) * taper;
        let z = 0.78 * baseRadius * (1 + 0.06 * Math.sin(phi)) * Math.sin(phi) * taper;

        if (t < 0.24) {
          x += 0.08 * Math.sin(2 * phi) * (0.24 - t) / 0.24;
        }

        x -= 0.08;
        z += 0.04;

        vertices.push([x, y, z]);
      }
    }

    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        const a = i * (cols + 1) + j;
        const b = a + 1;
        const c = a + (cols + 1);
        const d = c + 1;
        faces.push([a, c, b]);
        faces.push([b, c, d]);
      }
    }

    return {
      vertices: vertices,
      faces: faces
    };
  }

  const heartMeshes = {
    ventricle: ventricularMesh(),
    leftAtrium: ellipsoidMesh(-0.48, 0.92, 0.03, 0.48, 0.40, 0.40, 13, 20),
    rightAtrium: ellipsoidMesh(0.45, 0.88, -0.03, 0.44, 0.38, 0.38, 13, 20),
    chamber: ellipsoidMesh(-0.15, -0.18, 0.02, 0.50, 0.78, 0.40, 14, 22)
  };

  function colorShade(base, light) {
    const r = clamp(Math.round(base[0] * light), 0, 255);
    const g = clamp(Math.round(base[1] * light), 0, 255);
    const b = clamp(Math.round(base[2] * light), 0, 255);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  function drawMesh(ctx, mesh, size, baseColor, alpha, sectionCut) {
    const projected = mesh.vertices.map(function (vertex) {
      const rotated = rotatePoint(vertex);
      const perspective = 4.4 / (4.4 + rotated[2]);
      return {
        x: size.cssWidth * 0.5 + rotated[0] * 125 * state.zoom * perspective,
        y: size.cssHeight * 0.50 - rotated[1] * 125 * state.zoom * perspective,
        z: rotated[2],
        rx: rotated[0],
        ry: rotated[1],
        rz: rotated[2]
      };
    });

    const triangles = [];

    mesh.faces.forEach(function (face) {
      const a = projected[face[0]];
      const b = projected[face[1]];
      const c = projected[face[2]];
      const avgX = (a.rx + b.rx + c.rx) / 3;

      if (sectionCut && avgX > 0.12) {
        return;
      }

      const ux = b.rx - a.rx;
      const uy = b.ry - a.ry;
      const uz = b.rz - a.rz;
      const vx = c.rx - a.rx;
      const vy = c.ry - a.ry;
      const vz = c.rz - a.rz;

      const nx = uy * vz - uz * vy;
      const ny = uz * vx - ux * vz;
      const nz = ux * vy - uy * vx;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      const lightDot = (nx * -0.4 + ny * 0.65 + nz * -0.45) / len;
      const light = 0.58 + 0.30 * lightDot + 0.12 * ((a.rz + b.rz + c.rz) / 3 + 1) / 2;

      triangles.push({
        a: a,
        b: b,
        c: c,
        z: (a.z + b.z + c.z) / 3,
        fill: colorShade(baseColor, clamp(light, 0.36, 1.15))
      });
    });

    triangles.sort(function (t1, t2) {
      return t2.z - t1.z;
    });

    ctx.save();
    ctx.globalAlpha = alpha;

    triangles.forEach(function (triangle) {
      ctx.beginPath();
      ctx.moveTo(triangle.a.x, triangle.a.y);
      ctx.lineTo(triangle.b.x, triangle.b.y);
      ctx.lineTo(triangle.c.x, triangle.c.y);
      ctx.closePath();
      ctx.fillStyle = triangle.fill;
      ctx.fill();
    });

    ctx.restore();
  }

  function drawVessel(ctx, size, from, to, width, color) {
    const a = projectPoint(from, size.cssWidth, size.cssHeight, 125 * state.zoom);
    const b = projectPoint(to, size.cssWidth, size.cssHeight, 125 * state.zoom);

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width * state.zoom;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,.13)";
    ctx.lineWidth = Math.max(1, width * .15);
    ctx.beginPath();
    ctx.moveTo(a.x - width * .12, a.y);
    ctx.lineTo(b.x - width * .12, b.y);
    ctx.stroke();
    ctx.restore();
  }

  function drawRing(ctx, size, plane, color, labels) {
    const points = [];

    for (let i = 0; i <= 90; i += 1) {
      const a = (Math.PI * 2 * i) / 90;
      let p;

      if (plane === "frontal") {
        p = [2.08 * Math.cos(a), 2.08 * Math.sin(a), 0];
      } else {
        p = [2.12 * Math.cos(a), 0, 2.12 * Math.sin(a)];
      }

      points.push(projectPoint(p, size.cssWidth, size.cssHeight, 125 * state.zoom));
    }

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 6]);
    ctx.beginPath();
    points.forEach(function (p, index) {
      if (index === 0) {
        ctx.moveTo(p.x, p.y);
      } else {
        ctx.lineTo(p.x, p.y);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);

    labels.forEach(function (item) {
      const a = item.angle;
      let p;
      if (plane === "frontal") {
        p = [2.25 * Math.cos(a), 2.25 * Math.sin(a), 0];
      } else {
        p = [2.27 * Math.cos(a), 0, 2.27 * Math.sin(a)];
      }

      const q = projectPoint(p, size.cssWidth, size.cssHeight, 125 * state.zoom);
      ctx.fillStyle = item.color || color;
      ctx.font = "700 9px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(item.label, q.x, q.y);
    });

    ctx.restore();
  }

  function drawArrow(ctx, size, vector) {
    const start = projectPoint([0, -0.02, 0], size.cssWidth, size.cssHeight, 125 * state.zoom);
    const end = projectPoint(vector, size.cssWidth, size.cssHeight, 125 * state.zoom);

    ctx.save();
    ctx.strokeStyle = "#facc15";
    ctx.fillStyle = "#facc15";
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(250,204,21,.55)";
    ctx.shadowBlur = 9;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const head = 8;
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(end.x - head * Math.cos(angle - Math.PI / 6), end.y - head * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(end.x - head * Math.cos(angle + Math.PI / 6), end.y - head * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawActivation(ctx, size, glow) {
    const p = projectPoint(glow, size.cssWidth, size.cssHeight, 125 * state.zoom);

    ctx.save();
    const radius = 18 + 7 * Math.sin(performance.now() / 170);
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
    gradient.addColorStop(0, "rgba(255,245,145,.95)");
    gradient.addColorStop(.25, "rgba(250,204,21,.68)");
    gradient.addColorStop(1, "rgba(250,204,21,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff3a4";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawHeart() {
    const canvas = $("heartCanvas");
    const size = resizeCanvas(canvas);
    const ctx = canvas.getContext("2d");
    const info = phaseInfo(state.phase);

    ctx.clearRect(0, 0, size.width, size.height);
    ctx.save();
    ctx.scale(size.dpr, size.dpr);

    drawRing(ctx, size, "frontal", "rgba(96,165,250,.42)", [
      { label: "I", angle: 0 },
      { label: "aVL", angle: -0.72 },
      { label: "II", angle: -1.08 },
      { label: "aVF", angle: -1.55 },
      { label: "III", angle: -2.10 },
      { label: "aVR", angle: 2.52 }
    ]);

    drawRing(ctx, size, "horizontal", "rgba(192,132,252,.40)", [
      { label: "V1", angle: 2.65 },
      { label: "V2", angle: 2.25 },
      { label: "V3", angle: 1.82 },
      { label: "V4", angle: 1.38 },
      { label: "V5", angle: .88 },
      { label: "V6", angle: .40 },
      { label: "V7", angle: .08, color: "#c084fc" },
      { label: "V8", angle: -.25, color: "#c084fc" },
      { label: "V9", angle: -.55, color: "#c084fc" },
      { label: "V4R", angle: -2.35, color: "#fb7185" }
    ]);

    if (state.sectioned) {
      drawMesh(ctx, heartMeshes.chamber, size, [100, 24, 34], .92, false);
    }

    drawMesh(ctx, heartMeshes.ventricle, size, [170, 40, 48], 1, state.sectioned);
    drawMesh(ctx, heartMeshes.leftAtrium, size, [190, 54, 62], .98, state.sectioned);
    drawMesh(ctx, heartMeshes.rightAtrium, size, [148, 30, 41], .98, state.sectioned);

    drawVessel(ctx, size, [-0.33, 1.05, .02], [-0.36, 1.88, .02], 18, "#9b2632");
    drawVessel(ctx, size, [0.15, 1.05, -.04], [0.12, 1.82, -.04], 14, "#7d2030");
    drawVessel(ctx, size, [0.05, 1.12, .10], [0.72, 1.62, .18], 12, "#713042");
    drawVessel(ctx, size, [0.40, 1.05, -.05], [0.82, 1.44, -.38], 10, "#6d3040");

    drawActivation(ctx, size, info.glow);
    drawArrow(ctx, size, info.vector3d);

    ctx.restore();
  }

  function gaussian(x, center, width, amplitude) {
    const d = (x - center) / width;
    return amplitude * Math.exp(-d * d);
  }

  function pseudoRandom(value) {
    return Math.sin(value * 93.731 + 17.17) * 0.5 + Math.sin(value * 37.19) * 0.25;
  }

  function baseWave(cycle, lead, rowSeed) {
    const pattern = currentPattern();
    const pol = lead.polarity;
    const amp = lead.scale;
    let value = 0;

    let pCenter = 0.09;
    let qrsCenter = 0.225;
    let tCenter = 0.50;

    if (pattern.id === "av1") {
      qrsCenter = 0.285;
    }

    if (pattern.id !== "af") {
      value += gaussian(cycle, pCenter, .032, 0.18 * amp * (pol < 0 ? -0.65 : 1));
    } else {
      value += 0.035 * pseudoRandom(cycle * 35 + rowSeed);
      value += 0.020 * Math.sin(cycle * Math.PI * 16 + rowSeed);
    }

    const qWidth = pattern.id === "rbbb" ? .022 : .012;
    const rWidth = pattern.id === "rbbb" ? .026 : .014;
    const sWidth = pattern.id === "rbbb" ? .030 : .016;

    value += gaussian(cycle, qrsCenter - .024, qWidth, -0.20 * amp);
    value += gaussian(cycle, qrsCenter, rWidth, 1.08 * amp * pol);
    value += gaussian(cycle, qrsCenter + .025, sWidth, -0.42 * amp * (pol >= 0 ? 1 : -0.65));

    if (pattern.id === "rbbb" && lead.id === "V1") {
      value += gaussian(cycle, qrsCenter + .062, .022, .68 * amp);
    }

    if (pattern.id === "stemi" && ["V2", "V3", "V4"].indexOf(lead.id) !== -1) {
      value += gaussian(cycle, .35, .075, .20);
      value += gaussian(cycle, .41, .06, .12);
    }

    let tAmp = .34 * amp * (pol < -0.5 ? -0.6 : 1);
    let tWidth = .070;

    if (pattern.id === "hyperk") {
      tAmp = .72 * amp;
      tWidth = .038;
    }

    value += gaussian(cycle, tCenter, tWidth, tAmp);

    return value;
  }

  function drawSmallGrid(ctx, width, height, rowHeight, dpr) {
    const small = 8 * dpr;

    ctx.save();
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x += small) {
      const major = Math.round(x / small) % 5 === 0;
      ctx.strokeStyle = major ? "rgba(54,145,86,.17)" : "rgba(54,145,86,.07)";
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += small) {
      const major = Math.round(y / small) % 5 === 0;
      ctx.strokeStyle = major ? "rgba(54,145,86,.17)" : "rgba(54,145,86,.07)";
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    for (let y = rowHeight; y < height; y += rowHeight) {
      ctx.strokeStyle = "rgba(255,255,255,.055)";
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawECG() {
    const canvas = $("ecgLearningCanvas");
    const selected = LEADS.filter(function (lead) {
      return state.selectedLeads.has(lead.id);
    });

    const rowCss = 45;
    const cssHeight = Math.max(330, selected.length * rowCss);
    canvas.style.height = cssHeight + "px";

    const size = resizeCanvas(canvas, cssHeight);
    const ctx = canvas.getContext("2d");
    const rowHeight = rowCss * size.dpr;

    ctx.clearRect(0, 0, size.width, size.height);
    ctx.fillStyle = "#030605";
    ctx.fillRect(0, 0, size.width, size.height);

    drawSmallGrid(ctx, size.width, size.height, rowHeight, size.dpr);

    selected.forEach(function (lead, row) {
      const centerY = row * rowHeight + rowHeight * .52;
      const leftPad = 44 * size.dpr;
      const usable = size.width - leftPad - 8 * size.dpr;

      ctx.save();
      ctx.fillStyle = lead.group === "right" ? "#fb7185" :
        lead.group === "posterior" ? "#c084fc" : "#76e89a";
      ctx.font = (8 * size.dpr) + "px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(lead.id, 10 * size.dpr, centerY);

      ctx.beginPath();

      const points = Math.max(420, Math.floor(usable / (2 * size.dpr)));

      for (let i = 0; i < points; i += 1) {
        const normalized = i / (points - 1);
        const cyclesShown = 3.0;
        let cycle = wrap(normalized * cyclesShown + state.phase);

        if (currentPattern().id === "af") {
          const irregularOffset = 0.015 * Math.sin(normalized * 21.0 + row * .7);
          cycle = wrap(cycle + irregularOffset);
        }

        const value = baseWave(cycle, lead, row);
        const x = leftPad + normalized * usable;
        const y = centerY - value * rowHeight * .34;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle = lead.group === "posterior" ? "#b98af0" :
        lead.group === "right" ? "#ef8294" : "#54e380";
      ctx.lineWidth = 1.35 * size.dpr;
      ctx.shadowColor = "rgba(72,232,121,.18)";
      ctx.shadowBlur = 3 * size.dpr;
      ctx.stroke();
      ctx.restore();
    });

    const cursorX = 44 * size.dpr + (wrap(state.phase) / 1) * (size.width - 52 * size.dpr);
    ctx.save();
    ctx.strokeStyle = "rgba(250,204,21,.42)";
    ctx.lineWidth = 1 * size.dpr;
    ctx.setLineDash([4 * size.dpr, 5 * size.dpr]);
    ctx.beginPath();
    ctx.moveTo(cursorX, 0);
    ctx.lineTo(cursorX, size.height);
    ctx.stroke();
    ctx.restore();
  }

  function renderLeadSelector() {
    $("leadSelector").innerHTML = LEADS.map(function (lead) {
      const active = state.selectedLeads.has(lead.id);
      const special = lead.group === "posterior" || lead.group === "right";
      return '<button type="button" class="lead-pill' +
        (active ? ' active' : '') +
        (special ? ' special' : '') +
        '" data-lead="' + lead.id + '">' + lead.id + '</button>';
    }).join("");

    document.querySelectorAll(".lead-pill").forEach(function (button) {
      button.addEventListener("click", function () {
        const id = button.dataset.lead;

        if (state.selectedLeads.has(id)) {
          if (state.selectedLeads.size > 1) {
            state.selectedLeads.delete(id);
          }
        } else {
          state.selectedLeads.add(id);
        }

        renderLeadSelector();
        drawECG();
      });
    });
  }

  function renderGuidedSteps() {
    $("guidedSteps").innerHTML = GUIDED.map(function (step) {
      const info = phaseInfo(step[3]);
      return '<button class="guided-step" type="button" data-phase="' + step[3] + '">' +
        '<span>ETAPA ' + step[0] + '</span>' +
        '<strong>' + step[1] + '</strong>' +
        '<small>' + step[2] + '</small>' +
        '<small>' + info.short + '</small>' +
        '</button>';
    }).join("");

    document.querySelectorAll(".guided-step").forEach(function (button) {
      button.addEventListener("click", function () {
        state.running = false;
        state.phase = Number(button.dataset.phase);
        syncUI();
        drawAll();

        document.querySelectorAll(".guided-step").forEach(function (item) {
          item.classList.toggle("active", item === button);
        });

        window.scrollTo({
          top: Math.max(0, document.querySelector(".ecg-simulator-grid").offsetTop - 80),
          behavior: "smooth"
        });
      });
    });
  }

  function renderPatterns() {
    $("patternSelector").innerHTML = PATTERNS.map(function (pattern) {
      return '<button type="button" class="pattern-button' +
        (pattern.id === state.pattern ? ' active' : '') +
        '" data-pattern="' + pattern.id + '">' +
        '<strong>' + pattern.name + '</strong>' +
        '<span>' + pattern.caption + '</span>' +
        '</button>';
    }).join("");

    document.querySelectorAll(".pattern-button").forEach(function (button) {
      button.addEventListener("click", function () {
        state.pattern = button.dataset.pattern;
        renderPatterns();
        renderPatternDetail();
        drawECG();
      });
    });
  }

  function renderPatternDetail() {
    const pattern = currentPattern();
    $("patternName").textContent = pattern.name;
    $("patternDescription").textContent = pattern.description;
    $("currentBpm").textContent = pattern.bpm;
    $("patternTags").innerHTML = pattern.tags.map(function (tag) {
      return "<span>" + tag + "</span>";
    }).join("");
  }

  function syncUI() {
    const info = phaseInfo(state.phase);
    const percent = Math.round(wrap(state.phase) * 100);

    $("heartPhaseName").textContent = info.short;
    $("heartVectorText").textContent = info.vector;
    $("phaseIndex").textContent = info.index;
    $("phaseCategory").textContent = info.category;
    $("phaseTitle").textContent = info.title;
    $("phaseDescription").textContent = info.description;
    $("phaseProgressBar").style.width = percent + "%";
    $("phasePercent").textContent = percent + "%";

    $("playIcon").textContent = state.running ? "Ⅱ" : "▶";
    $("playText").textContent = state.running ? "Pausar" : "Iniciar loop";
    $("playPause").classList.toggle("playing", state.running);
    $("sectionToggle").classList.toggle("active", state.sectioned);
  }

  function drawAll() {
    drawHeart();
    drawECG();
  }

  function setView(view) {
    if (view === "front") {
      state.yaw = 0;
      state.pitch = 0;
      state.zoom = 1.0;
    } else if (view === "horizontal") {
      state.yaw = -0.05;
      state.pitch = -1.18;
      state.zoom = 1.0;
    } else if (view === "free") {
      state.yaw = -0.35;
      state.pitch = 0.12;
      state.zoom = 1.0;
    }

    document.querySelectorAll(".heart-tool[data-view]").forEach(function (button) {
      button.classList.toggle("active", button.dataset.view === view);
    });

    drawHeart();
  }

  function bindHeartControls() {
    const canvas = $("heartCanvas");

    canvas.addEventListener("pointerdown", function (event) {
      state.dragging = true;
      state.dragX = event.clientX;
      state.dragY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", function (event) {
      if (!state.dragging) {
        return;
      }

      const dx = event.clientX - state.dragX;
      const dy = event.clientY - state.dragY;
      state.dragX = event.clientX;
      state.dragY = event.clientY;

      state.yaw += dx * .008;
      state.pitch = clamp(state.pitch + dy * .008, -1.45, 1.45);

      document.querySelectorAll(".heart-tool[data-view]").forEach(function (button) {
        button.classList.toggle("active", button.dataset.view === "free");
      });

      drawHeart();
    });

    function endDrag(event) {
      state.dragging = false;
      if (canvas.hasPointerCapture && canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    }

    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);

    canvas.addEventListener("wheel", function (event) {
      event.preventDefault();
      state.zoom = clamp(state.zoom - event.deltaY * .0007, .76, 1.35);
      drawHeart();
    }, { passive: false });

    document.querySelectorAll(".heart-tool[data-view]").forEach(function (button) {
      button.addEventListener("click", function () {
        setView(button.dataset.view);
      });
    });

    $("sectionToggle").addEventListener("click", function () {
      state.sectioned = !state.sectioned;
      syncUI();
      drawHeart();
    });

    $("resetHeart").addEventListener("click", function () {
      setView("free");
      state.sectioned = false;
      syncUI();
      drawHeart();
    });
  }

  function bindTransport() {
    $("playPause").addEventListener("click", function () {
      state.running = !state.running;
      state.lastFrame = performance.now();
      syncUI();
    });

    $("prevPhase").addEventListener("click", function () {
      state.running = false;
      state.phase = wrap(state.phase - .05);
      syncUI();
      drawAll();
    });

    $("nextPhase").addEventListener("click", function () {
      state.running = false;
      state.phase = wrap(state.phase + .05);
      syncUI();
      drawAll();
    });

    $("selectCoreLeads").addEventListener("click", function () {
      state.selectedLeads = new Set(Array.from(CORE_LEADS));
      renderLeadSelector();
      drawECG();
    });

    $("selectAllLeads").addEventListener("click", function () {
      state.selectedLeads = new Set(LEADS.map(function (lead) {
        return lead.id;
      }));
      renderLeadSelector();
      drawECG();
    });
  }

  function bindLearningTabs() {
    document.querySelectorAll(".learn-tab").forEach(function (button) {
      button.addEventListener("click", function () {
        const target = button.dataset.target;

        document.querySelectorAll(".learn-tab").forEach(function (item) {
          item.classList.toggle("active", item === button);
        });

        document.querySelectorAll(".learn-panel").forEach(function (panel) {
          panel.classList.toggle("active", panel.id === "panel-" + target);
        });
      });
    });
  }

  function bindElectrodes() {
    const descriptions = {
      RA: "Eletrodo de membro direito. Participa das derivações I, II, III, aVR, aVL e aVF.",
      LA: "Eletrodo de membro esquerdo. Essencial para I, III e derivações aumentadas do plano frontal.",
      RL: "Eletrodo de referência/terra no membro inferior direito.",
      LL: "Eletrodo de membro inferior esquerdo. Participa de II, III e aVF.",
      V1: "4º espaço intercostal direito, junto ao esterno. Observa principalmente septo e ventrículo direito.",
      V2: "4º espaço intercostal esquerdo, junto ao esterno. Explora a região septal.",
      V3: "Entre V2 e V4. Participa da zona de transição precordial.",
      V4: "5º espaço intercostal na linha hemiclavicular esquerda. Parede anterior.",
      V5: "Mesmo nível horizontal de V4, linha axilar anterior. Parede lateral.",
      V6: "Mesmo nível de V4/V5, linha axilar média. Parede lateral.",
      V7: "Extensão posterior no mesmo nível de V6, linha axilar posterior.",
      V8: "Extensão posterior no mesmo nível de V6, região escapular.",
      V9: "Extensão posterior mais medial no mesmo plano horizontal.",
      V3R: "Derivação direita espelhada de V3 para ampliar a observação do ventrículo direito.",
      V4R: "Derivação direita de maior uso para avaliação elétrica do ventrículo direito.",
      V5R: "Extensão lateral direita da sequência precordial.",
      V6R: "Extensão direita em linha axilar média."
    };

    document.querySelectorAll(".electrode-dot").forEach(function (dot) {
      dot.addEventListener("click", function () {
        document.querySelectorAll(".electrode-dot").forEach(function (item) {
          item.classList.toggle("active", item === dot);
        });

        const id = dot.dataset.lead;
        const box = $("electrodeFocus");
        box.querySelector("strong").textContent = id;
        box.querySelector("p").textContent = descriptions[id] || "Posição didática selecionada.";

        if (state.selectedLeads.has(id)) {
          document.querySelectorAll(".lead-pill").forEach(function (button) {
            button.classList.toggle("focus", button.dataset.lead === id);
          });
        }
      });
    });
  }

  function animationLoop(now) {
    const delta = now - state.lastFrame;
    state.lastFrame = now;

    if (state.running) {
      const bpm = currentPattern().bpm;
      state.phase = wrap(state.phase + delta * bpm / 60000);
      syncUI();
    }

    drawHeart();
    drawECG();
    requestAnimationFrame(animationLoop);
  }

  function bindResize() {
    let resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        drawAll();
      }, 80);
    });
  }

  async function start() {
    try {
      await loadUser();
    } catch (error) {
      console.error(error);
      return;
    }

    renderLeadSelector();
    renderGuidedSteps();
    renderPatterns();
    renderPatternDetail();
    bindHeartControls();
    bindTransport();
    bindLearningTabs();
    bindElectrodes();
    bindResize();
    syncUI();
    drawAll();

    $("logoutSidebar").addEventListener("click", logout);

    requestAnimationFrame(function (now) {
      state.lastFrame = now;
      animationLoop(now);
    });
  }

  start();
})();
