const $ = function (id) {
  return document.getElementById(id);
};


function moeda(valor) {

  return Number(valor || 0)
    .toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    );

}


function dataCurta(data) {

  return new Date(data)
    .toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "short"
      }
    );

}


function escapeHtml(texto) {

  const div =
    document.createElement("div");

  div.textContent =
    String(texto ?? "");

  return div.innerHTML;

}


function mesmoDia(a, b) {

  const dataA =
    new Date(a);

  const dataB =
    new Date(b);


  return (
    dataA.getFullYear() ===
      dataB.getFullYear() &&
    dataA.getMonth() ===
      dataB.getMonth() &&
    dataA.getDate() ===
      dataB.getDate()
  );

}


function atualizarData() {

  const data = new Date();
  const elemento = $("dashboardDate");
  const weekday = $("dashboardWeekday");

  if (weekday) {
    const nomeDia = new Intl.DateTimeFormat(
      "pt-BR",
      { weekday: "long" }
    ).format(data);

    weekday.textContent =
      nomeDia.charAt(0).toUpperCase() +
      nomeDia.slice(1);
  }

  if (elemento) {
    elemento.textContent =
      new Intl.DateTimeFormat(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric"
        }
      ).format(data);
  }

}


async function carregarUsuario() {

  const resposta =
    await fetch(
      "/api/auth/me",
      {
        credentials:
          "same-origin"
      }
    );


  if (!resposta.ok) {

    location.href =
      "/login.html";

    return null;
  }


  const dados =
    await resposta.json();


  const usuario =
    dados.usuario ||
    dados;


  if (!usuario) {

    location.href =
      "/login.html";

    return null;
  }


  const nome =
    usuario.nome ||
    "Usu\u00e1rio";


  const inicial =
    nome
      .charAt(0)
      .toUpperCase();


  const nomeSidebar =
    $("nomeSidebar");

  const emailSidebar =
    $("emailSidebar");

  const nomeHeader =
    $("nomeHeader");

  const avatarSidebar =
    $("avatarSidebar");

  const avatarHeader =
    $("avatarHeader");


  if (nomeSidebar) {
    nomeSidebar.textContent =
      nome;
  }


  if (emailSidebar) {
    emailSidebar.textContent =
      usuario.email || "";
  }


  if (nomeHeader) {
    nomeHeader.textContent =
      nome;
  }


  if (avatarSidebar) {
    avatarSidebar.textContent =
      inicial;
  }


  if (avatarHeader) {
    avatarHeader.textContent =
      inicial;
  }


  return usuario;

}


function mensagemDashboard(
  respondidas,
  percentual
) {

  if (respondidas === 0) {

    return (
      "Comece sua primeira sess\u00e3o " +
      "de estudos no Cortex."
    );
  }


  if (percentual >= 90) {

    return (
      "Excelente desempenho. " +
      "Continue mantendo o ritmo."
    );
  }


  if (percentual >= 75) {

    return (
      "Bom ritmo. Mais algumas quest\u00f5es " +
      "podem elevar seu desempenho."
    );
  }


  if (percentual >= 50) {

    return (
      "Voc\u00ea est\u00e1 evoluindo. " +
      "Use seus erros para direcionar a pr\u00f3xima sess\u00e3o."
    );
  }


  return (
    "Cada quest\u00e3o respondida ajuda a " +
    "construir consist\u00eancia."
  );

}


function renderDisciplinas(
  disciplinas,
  respostas
) {

  const container =
    $("disciplinasContainer");


  if (!container) {
    return;
  }


  /*
   * Une disciplinas da API com disciplinas
   * encontradas nas respostas.
   *
   * Isso permite exibir desempenho de
   * conteudos globais tambem.
   */
  const mapa =
    new Map();


  disciplinas.forEach(
    function (disciplina) {

      if (
        disciplina &&
        disciplina.id
      ) {

        mapa.set(
          disciplina.id,
          {
            id:
              disciplina.id,

            nome:
              disciplina.nome ||
              "Disciplina"
          }
        );
      }

    }
  );


  respostas.forEach(
    function (resposta) {

      const disciplina =
        resposta.questao &&
        resposta.questao.disciplina;


      if (
        disciplina &&
        disciplina.id &&
        !mapa.has(
          disciplina.id
        )
      ) {

        mapa.set(
          disciplina.id,
          {
            id:
              disciplina.id,

            nome:
              disciplina.nome ||
              "Disciplina"
          }
        );
      }

    }
  );


  const desempenho =
    Array.from(
      mapa.values()
    )
      .map(
        function (disciplina) {

          const lista =
            respostas.filter(
              function (resposta) {

                return (
                  resposta.questao &&
                  resposta.questao.disciplina &&
                  resposta.questao.disciplina.id ===
                    disciplina.id
                );

              }
            );


          const total =
            lista.length;


          const acertos =
            lista.filter(
              function (resposta) {

                return Boolean(
                  resposta.correta
                );

              }
            ).length;


          const percentual =
            total > 0
              ? Math.round(
                  (
                    acertos /
                    total
                  ) *
                  100
                )
              : 0;


          return {
            id:
              disciplina.id,

            nome:
              disciplina.nome,

            total,

            percentual
          };

        }
      )
      .filter(
        function (item) {

          return (
            item.total >
            0
          );

        }
      )
      .sort(
        function (a, b) {

          return (
            b.total -
            a.total
          );

        }
      )
      .slice(
        0,
        5
      );


  if (
    desempenho.length ===
    0
  ) {

    container.innerHTML =
      [
        '<div class="empty">',
        'Ainda n\u00e3o h\u00e1 dados.<br>',
        'Resolva algumas quest\u00f5es para ',
        'acompanhar seu desempenho.',
        '</div>'
      ].join("");

    return;
  }


  container.innerHTML =
    desempenho
      .map(
        function (item) {

          let classe =
            "red";


          if (
            item.percentual >=
            80
          ) {

            classe =
              "green";

          }
          else if (
            item.percentual >=
            60
          ) {

            classe =
              "orange";

          }


          return `
            <div class="disciplina-row">

              <div class="disciplina-header">

                <strong>
                  ${escapeHtml(item.nome)}
                </strong>

                <div class="disciplina-info">

                  <span>
                    ${item.total}
                    quest\u00f5es
                  </span>

                  <b class="${classe}">
                    ${item.percentual}%
                  </b>

                </div>

              </div>

              <div class="progress-bar">

                <div
                  style="width:${item.percentual}%"
                ></div>

              </div>

            </div>
          `;

        }
      )
      .join("");

}


function renderAtividade(
  respostas
) {

  const container =
    $("atividadeContainer");


  if (!container) {
    return;
  }


  const recentes =
    respostas
      .slice(
        0,
        5
      );


  if (
    recentes.length ===
    0
  ) {

    container.innerHTML =
      [
        '<div class="empty">',
        'Nenhuma atividade ainda.',
        '</div>'
      ].join("");

    return;
  }


  container.innerHTML =
    recentes
      .map(
        function (resposta) {

          const correta =
            Boolean(
              resposta.correta
            );


          const enunciado =
            resposta.questao
              ? resposta.questao.enunciado
              : "Quest\u00e3o respondida";


          const disciplina =
            resposta.questao &&
            resposta.questao.disciplina
              ? resposta.questao.disciplina.nome
              : "Sem disciplina";


          return `
            <div class="activity-item">

              <div
                class="activity-result ${
                  correta
                    ? "correct"
                    : "wrong"
                }"
              >
                ${
                  correta
                    ? "\u2713"
                    : "\u00d7"
                }
              </div>

              <div class="activity-content">

                <strong>
                  ${escapeHtml(enunciado)}
                </strong>

                <span>
                  ${escapeHtml(disciplina)}
                  &middot;
                  ${dataCurta(
                    resposta.respondidaAt
                  )}
                </span>

              </div>

              <span
                class="activity-status ${
                  correta
                    ? "green"
                    : "red"
                }"
              >
                ${
                  correta
                    ? "Acerto"
                    : "Erro"
                }
              </span>

            </div>
          `;

        }
      )
      .join("");

}


function renderHoje(
  respostas
) {

  const hoje =
    new Date();


  const respostasHoje =
    respostas.filter(
      function (resposta) {

        return (
          resposta.respondidaAt &&
          mesmoDia(
            resposta.respondidaAt,
            hoje
          )
        );

      }
    );


  const acertosHoje =
    respostasHoje.filter(
      function (resposta) {

        return Boolean(
          resposta.correta
        );

      }
    ).length;


  const percentualHoje =
    respostasHoje.length > 0
      ? Math.round(
          (
            acertosHoje /
            respostasHoje.length
          ) *
          100
        )
      : 0;


  const hojeRespondidas =
    $("hojeRespondidas");

  const hojeAcertos =
    $("hojeAcertos");

  const hojePercentual =
    $("hojePercentual");


  if (hojeRespondidas) {

    hojeRespondidas.textContent =
      String(
        respostasHoje.length
      );
  }


  if (hojeAcertos) {

    hojeAcertos.textContent =
      String(
        acertosHoje
      );
  }


  if (hojePercentual) {

    hojePercentual.textContent =
      percentualHoje +
      "%";
  }

}




// CORTEX DASHBOARD PLAN + WEATHER V1

function isoLocalDay(value) {
  const data = new Date(value);
  if (Number.isNaN(data.getTime())) return "";
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, "0");
  const d = String(data.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

function labelDiaSemana(value) {
  const data = new Date(value);
  if (Number.isNaN(data.getTime())) return "";
  const dia = new Intl.DateTimeFormat(
    "pt-BR",
    { weekday: "short", day: "2-digit" }
  ).format(data);
  return dia.replace(".", "");
}

function renderPlanoDashboard(data) {
  const container = $("dashboardWeekTasks");
  const subtitle = $("dashboardPlanSubtitle");
  const alerts = $("dashboardPlanAlerts");

  if (!container || !subtitle || !alerts) return;

  if (!data || !data.schedule) {
    subtitle.textContent = "Nenhum plano ativo.";
    alerts.innerHTML =
      '<a class="dashboard-plan-empty-cta" href="/cronograma">' +
      'Escolha seu objetivo e monte o cronograma <span>→</span></a>';
    container.innerHTML =
      '<div class="empty">Quando você criar um plano, as tarefas da semana aparecerão aqui.</div>';

    ["dashboardWeekCompleted","dashboardWeekPending","dashboardTodayPlan","dashboardPlanPercent","dashboardWeekRate"]
      .forEach(function (id) {
        const el = $(id);
        if (el) el.textContent = id === "dashboardTodayPlan" ? "0/0" : id.includes("Percent") || id.includes("Rate") ? "0%" : "0";
      });

    renderGraficoSemana([]);
    return;
  }

  const weekTasks =
    data.week && Array.isArray(data.week.tasks)
      ? data.week.tasks
      : [];

  const studyTasks =
    weekTasks.filter(function (task) {
      return task.tipo !== "DESCANSO";
    });

  const done =
    studyTasks.filter(function (task) {
      return Boolean(task.concluida);
    }).length;

  const pending = Math.max(0, studyTasks.length - done);
  const weekRate =
    studyTasks.length
      ? Math.round(done / studyTasks.length * 100)
      : 0;

  subtitle.textContent =
    data.schedule.prova
      ? data.schedule.prova
      : "Plano de estudos ativo";

  if ($("dashboardWeekCompleted")) $("dashboardWeekCompleted").textContent = String(done);
  if ($("dashboardWeekPending")) $("dashboardWeekPending").textContent = String(pending);
  if ($("dashboardTodayPlan")) {
    $("dashboardTodayPlan").textContent =
      String((data.stats && data.stats.todayCompleted) || 0) +
      "/" +
      String((data.stats && data.stats.todayTotal) || 0);
  }
  if ($("dashboardPlanPercent")) {
    $("dashboardPlanPercent").textContent =
      String((data.stats && data.stats.percent) || 0) + "%";
  }
  if ($("dashboardWeekRate")) {
    $("dashboardWeekRate").textContent = String(weekRate) + "%";
  }

  const today = isoLocalDay(new Date());
  const atrasadas =
    studyTasks.filter(function (task) {
      return !task.concluida && isoLocalDay(task.data) < today;
    }).length;
  const hojePendentes =
    studyTasks.filter(function (task) {
      return !task.concluida && isoLocalDay(task.data) === today;
    }).length;

  const avisos = [];

  if (atrasadas > 0) {
    avisos.push(
      '<span class="dashboard-plan-alert warning">' +
      '<b>' + atrasadas + '</b> pendência' + (atrasadas === 1 ? "" : "s") +
      ' anterior' + (atrasadas === 1 ? "" : "es") + '</span>'
    );
  }

  if (hojePendentes > 0) {
    avisos.push(
      '<span class="dashboard-plan-alert current">' +
      '<b>' + hojePendentes + '</b> tarefa' + (hojePendentes === 1 ? "" : "s") +
      ' para hoje</span>'
    );
  }

  if (studyTasks.length > 0 && pending === 0) {
    avisos.push(
      '<span class="dashboard-plan-alert success">Semana concluída</span>'
    );
  }

  if (data.schedule.dataProva) {
    const prova = new Date(data.schedule.dataProva);
    const agora = new Date();
    prova.setHours(12,0,0,0);
    agora.setHours(12,0,0,0);
    const dias = Math.ceil((prova.getTime() - agora.getTime()) / 86400000);
    if (Number.isFinite(dias) && dias >= 0) {
      avisos.push(
        '<span class="dashboard-plan-alert">' +
        (dias === 0 ? "Prova hoje" : dias + " dias até a prova") +
        '</span>'
      );
    }
  }

  alerts.innerHTML = avisos.join("");

  if (weekTasks.length === 0) {
    container.innerHTML =
      '<div class="empty">Não há tarefas previstas para esta semana.</div>';
    renderGraficoSemana([]);
    return;
  }

  const grupos = new Map();

  weekTasks.forEach(function (task) {
    const key = isoLocalDay(task.data);
    if (!grupos.has(key)) grupos.set(key, []);
    grupos.get(key).push(task);
  });

  container.innerHTML =
    Array.from(grupos.entries())
      .map(function (entry) {
        const dateKey = entry[0];
        const tasks = entry[1];
        const dataObj = new Date(dateKey + "T12:00:00");
        const isToday = dateKey === today;

        const items =
          tasks.map(function (task) {
            const concluida = Boolean(task.concluida);
            const tema = task.tema || task.titulo || "Atividade";
            const meta =
              task.tipo === "QUESTOES" && task.metaValor
                ? task.metaValor + " questões"
                : task.duracaoMinutos
                  ? task.duracaoMinutos + " min"
                  : "";

            return (
              '<a class="dashboard-week-task ' +
              (concluida ? "done" : "") +
              '" href="/cronograma">' +
              '<span class="dashboard-task-status">' +
              (concluida ? "✓" : "") +
              '</span>' +
              '<div><strong>' +
              escapeHtml(tema) +
              '</strong><span>' +
              escapeHtml(task.tipo || "ESTUDO") +
              (meta ? " · " + escapeHtml(meta) : "") +
              '</span></div>' +
              (concluida
                ? '<span class="dashboard-task-done-label">Concluído</span>'
                : '') +
              '</a>'
            );
          }).join("");

        return (
          '<div class="dashboard-week-day ' + (isToday ? "today" : "") + '">' +
          '<div class="dashboard-week-day-head">' +
          '<span>' + escapeHtml(labelDiaSemana(dataObj)) + '</span>' +
          '<strong>' + tasks.filter(function (task) { return task.concluida; }).length +
          '/' + tasks.length + '</strong>' +
          '</div>' +
          '<div class="dashboard-week-day-list">' + items + '</div>' +
          '</div>'
        );
      }).join("");

  renderGraficoSemana(weekTasks);
}

function renderGraficoSemana(tasks) {
  const chart = $("dashboardWeekChart");
  if (!chart) return;

  const dias = [];
  const base = new Date();
  const day = base.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  base.setDate(base.getDate() + mondayOffset);
  base.setHours(12,0,0,0);

  for (let i = 0; i < 7; i += 1) {
    const date = new Date(base);
    date.setDate(base.getDate() + i);
    const key = isoLocalDay(date);
    const list = tasks.filter(function (task) {
      return task.tipo !== "DESCANSO" && isoLocalDay(task.data) === key;
    });
    dias.push({
      label: new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(date).replace(".",""),
      total: list.length,
      done: list.filter(function (task) { return task.concluida; }).length
    });
  }

  const max = Math.max(1, ...dias.map(function (item) { return item.total; }));

  chart.innerHTML =
    dias.map(function (item) {
      const totalHeight = item.total ? Math.max(14, Math.round(item.total / max * 100)) : 5;
      const doneHeight = item.total ? Math.round(item.done / item.total * 100) : 0;
      return (
        '<div class="dashboard-week-bar-item">' +
        '<div class="dashboard-week-bar">' +
        '<div class="dashboard-week-bar-total" style="height:' + totalHeight + '%">' +
        '<span style="height:' + doneHeight + '%"></span>' +
        '</div></div>' +
        '<strong>' + escapeHtml(item.label) + '</strong>' +
        '<small>' + item.done + '/' + item.total + '</small>' +
        '</div>'
      );
    }).join("");
}

function renderTrajetoria(respostas) {
  const line = $("dashboardTrajectoryLine");
  const area = $("dashboardTrajectoryArea");
  const empty = $("dashboardTrajectoryEmpty");
  const recentAccuracy = $("dashboardRecentAccuracy");

  if (!line || !area || !empty) return;

  const dias = [];
  const now = new Date();
  now.setHours(12,0,0,0);

  for (let offset = 13; offset >= 0; offset -= 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - offset);
    const key = isoLocalDay(date);
    const list = respostas.filter(function (r) {
      return r.respondidaAt && isoLocalDay(r.respondidaAt) === key;
    });
    const acertos = list.filter(function (r) { return Boolean(r.correta); }).length;
    dias.push({
      key,
      total: list.length,
      accuracy: list.length ? Math.round(acertos / list.length * 100) : null
    });
  }

  const recentes = respostas.filter(function (r) {
    if (!r.respondidaAt) return false;
    const data = new Date(r.respondidaAt);
    return now.getTime() - data.getTime() <= 14 * 86400000;
  });
  const acertosRecentes = recentes.filter(function (r) { return Boolean(r.correta); }).length;
  const media =
    recentes.length
      ? Math.round(acertosRecentes / recentes.length * 100)
      : 0;

  if (recentAccuracy) recentAccuracy.textContent = media + "%";

  const validos = dias.filter(function (item) { return item.accuracy !== null; });

  if (validos.length < 2) {
    line.setAttribute("points", "");
    area.setAttribute("d", "");
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");

  const width = 720;
  const height = 190;
  const padX = 14;
  const padY = 20;
  const usableW = width - padX * 2;
  const usableH = height - padY * 2;

  const points = dias.map(function (item, index) {
    const x = padX + usableW * (index / 13);
    const value = item.accuracy === null ? null : item.accuracy;
    const y = value === null ? null : padY + usableH * (1 - value / 100);
    return { x, y, value };
  });

  const rendered = [];
  let last = null;

  points.forEach(function (point) {
    if (point.y !== null) {
      last = point;
      rendered.push(point);
    } else if (last) {
      rendered.push({ x: point.x, y: last.y, value: last.value });
    }
  });

  if (rendered.length < 2) return;

  const pointString =
    rendered.map(function (p) {
      return p.x.toFixed(1) + "," + p.y.toFixed(1);
    }).join(" ");

  line.setAttribute("points", pointString);

  const first = rendered[0];
  const lastPoint = rendered[rendered.length - 1];
  const areaPath =
    "M " + first.x.toFixed(1) + " " + (height - padY) +
    " L " +
    rendered.map(function (p) {
      return p.x.toFixed(1) + " " + p.y.toFixed(1);
    }).join(" L ") +
    " L " + lastPoint.x.toFixed(1) + " " + (height - padY) +
    " Z";

  area.setAttribute("d", areaPath);
}

function weatherDescription(code, isDay) {
  const descriptions = {
    0: isDay ? "Céu limpo" : "Noite limpa",
    1: "Predominantemente limpo",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Neblina",
    48: "Neblina com geada",
    51: "Garoa leve",
    53: "Garoa",
    55: "Garoa intensa",
    61: "Chuva leve",
    63: "Chuva",
    65: "Chuva forte",
    71: "Neve leve",
    73: "Neve",
    75: "Neve forte",
    80: "Pancadas leves",
    81: "Pancadas de chuva",
    82: "Pancadas fortes",
    95: "Trovoadas",
    96: "Trovoadas com granizo",
    99: "Trovoadas fortes"
  };
  return descriptions[code] || "Condição atual";
}

function weatherIcon(code, isDay) {
  if (code === 0) return isDay ? "☀" : "☾";
  if (code <= 2) return isDay ? "◐" : "☾";
  if (code === 3) return "☁";
  if (code === 45 || code === 48) return "≋";
  if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) return "☂";
  if (code >= 71 && code <= 75) return "✦";
  if (code >= 95) return "ϟ";
  return "•";
}

function setWeatherState(temp, text, icon, retry) {
  if ($("dashboardWeatherTemp")) $("dashboardWeatherTemp").textContent = temp;
  if ($("dashboardWeatherText")) $("dashboardWeatherText").textContent = text;
  if ($("dashboardWeatherIcon")) $("dashboardWeatherIcon").textContent = icon;
  const button = $("dashboardWeatherRetry");
  if (button) button.classList.toggle("hidden", !retry);
}

function carregarClima() {
  if (!navigator.geolocation) {
    setWeatherState("Clima", "Localização indisponível", "•", false);
    return;
  }

  setWeatherState("Clima", "Obtendo localização...", "·", false);

  navigator.geolocation.getCurrentPosition(
    async function (position) {
      try {
        const latitude = position.coords.latitude.toFixed(4);
        const longitude = position.coords.longitude.toFixed(4);
        const url =
          "https://api.open-meteo.com/v1/forecast" +
          "?latitude=" + encodeURIComponent(latitude) +
          "&longitude=" + encodeURIComponent(longitude) +
          "&current=temperature_2m,apparent_temperature,weather_code,is_day" +
          "&temperature_unit=celsius&timezone=auto&forecast_days=1";

        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) throw new Error("weather");

        const data = await response.json();
        const current = data && data.current ? data.current : {};
        const temperature = Number(current.temperature_2m);
        const apparent = Number(current.apparent_temperature);
        const code = Number(current.weather_code);
        const isDay = Number(current.is_day) === 1;

        const tempText =
          Number.isFinite(temperature)
            ? Math.round(temperature) + "°C"
            : "Clima";

        let description = weatherDescription(code, isDay);
        if (Number.isFinite(apparent)) {
          description += " · sensação " + Math.round(apparent) + "°";
        }

        setWeatherState(
          tempText,
          description,
          weatherIcon(code, isDay),
          false
        );
      }
      catch (error) {
        setWeatherState("Clima", "Não foi possível atualizar agora", "•", true);
      }
    },
    function () {
      setWeatherState("Clima", "Ative a localização para ver o tempo", "•", true);
    },
    {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 15 * 60 * 1000
    }
  );
}

async function carregarDashboard() {

  atualizarData();

  /*
   * Mostra a estrutura da Dashboard imediatamente.
   * Os dados entram progressivamente, sem bloquear a interface
   * esperando módulos secundários.
   */
  document.body.classList.add(
    "dashboard-loaded"
  );


  try {

    const usuarioPromise =
      carregarUsuario();


    /*
     * A Dashboard não precisa carregar milhares de questões.
     * Busca somente uma página mínima para obter o total global.
     */
    const questoesResumoPromise =
      fetch(
        "/api/questoes?pagina=1&limite=10",
        {
          credentials:
            "same-origin"
        }
      );


    const respostasPromise =
      fetch(
        "/api/respostas?modo=dashboard",
        {
          credentials:
            "same-origin"
        }
      );


    const disciplinasPromise =
      fetch(
        "/api/disciplinas",
        {
          credentials:
            "same-origin"
        }
      );


    /*
     * Financeiro e cronograma começam ao mesmo tempo,
     * mas não bloqueiam a primeira renderização.
     */
    const financeiroPromise =
      fetch(
        "/api/financeiro",
        {
          credentials:
            "same-origin"
        }
      );


    const cronogramaPromise =
      fetch(
        "/api/cronograma/dashboard",
        {
          credentials:
            "same-origin"
        }
      );


    const [
      usuario,
      questoesResponse,
      respostasResponse,
      disciplinasResponse
    ] =
      await Promise.all([
        usuarioPromise,
        questoesResumoPromise,
        respostasPromise,
        disciplinasPromise
      ]);


    if (!usuario) {
      return;
    }


    const respostasPrincipais =
      [
        questoesResponse,
        respostasResponse,
        disciplinasResponse
      ];


    if (
      respostasPrincipais.some(
        function (response) {
          return response.status === 401;
        }
      )
    ) {

      location.href =
        "/login.html";

      return;
    }


    const [
      questoesResumo,
      respostas,
      disciplinas
    ] =
      await Promise.all([
        questoesResponse.ok
          ? questoesResponse.json()
          : Promise.resolve({
              total: 0,
              itens: []
            }),

        respostasResponse.ok
          ? respostasResponse.json()
          : Promise.resolve([]),

        disciplinasResponse.ok
          ? disciplinasResponse.json()
          : Promise.resolve([])
      ]);


    const listaRespostas =
      Array.isArray(respostas)
        ? respostas
        : [];


    const listaDisciplinas =
      Array.isArray(disciplinas)
        ? disciplinas
        : [];


    const totalQuestoes =
      Number(
        questoesResumo &&
        !Array.isArray(questoesResumo)
          ? questoesResumo.total
          : Array.isArray(questoesResumo)
            ? questoesResumo.length
            : 0
      ) || 0;


    const totalRespondidas =
      listaRespostas.length;


    const totalAcertos =
      listaRespostas.filter(
        function (resposta) {
          return Boolean(
            resposta.correta
          );
        }
      ).length;


    const percentual =
      totalRespondidas > 0
        ? Math.round(
            (
              totalAcertos /
              totalRespondidas
            ) *
            100
          )
        : 0;


    const progresso =
      totalQuestoes > 0
        ? Math.min(
            100,
            Math.round(
              (
                totalRespondidas /
                totalQuestoes
              ) *
              100
            )
          )
        : 0;


    if ($("totalQuestoes")) {
      $("totalQuestoes")
        .textContent =
        totalQuestoes;
    }


    if ($("totalRespondidas")) {
      $("totalRespondidas")
        .textContent =
        totalRespondidas;
    }


    if ($("totalAcertos")) {
      $("totalAcertos")
        .textContent =
        totalAcertos;
    }


    if ($("percentual")) {
      $("percentual")
        .textContent =
        percentual +
        "%";
    }


    if ($("mensagemHero")) {
      $("mensagemHero")
        .textContent =
        mensagemDashboard(
          totalRespondidas,
          percentual
        );
    }


    if ($("progressoPercentual")) {
      $("progressoPercentual")
        .textContent =
        progresso +
        "%";
    }


    if ($("progressoRespondidas")) {
      $("progressoRespondidas")
        .textContent =
        totalRespondidas;
    }


    if ($("progressoDisponiveis")) {
      $("progressoDisponiveis")
        .textContent =
        totalQuestoes;
    }


    const circunferencia =
      263.9;


    const offset =
      circunferencia -
      (
        circunferencia *
        progresso /
        100
      );


    if ($("progressCircle")) {
      $("progressCircle")
        .style
        .strokeDashoffset =
        String(offset);
    }


    renderDisciplinas(
      listaDisciplinas,
      listaRespostas
    );


    renderAtividade(
      listaRespostas
    );


    renderHoje(
      listaRespostas
    );


    renderTrajetoria(
      listaRespostas
    );


    /*
     * Atualizações secundárias não seguram mais a Dashboard.
     */
    void financeiroPromise
      .then(
        async function (response) {

          if (
            response.status ===
            401
          ) {
            return;
          }


          const financeiro =
            response.ok
              ? await response.json()
              : {
                  resumo: {
                    receitas: 0,
                    despesas: 0,
                    saldo: 0
                  }
                };


          const resumo =
            financeiro &&
            financeiro.resumo
              ? financeiro.resumo
              : {
                  receitas: 0,
                  despesas: 0,
                  saldo: 0
                };


          if ($("saldo")) {
            $("saldo").textContent =
              moeda(
                resumo.saldo
              );
          }


          if ($("receitas")) {
            $("receitas").textContent =
              moeda(
                resumo.receitas
              );
          }


          if ($("despesas")) {
            $("despesas").textContent =
              moeda(
                resumo.despesas
              );
          }

        }
      )
      .catch(
        function (erro) {
          console.warn(
            "Financeiro da Dashboard carregou com atraso:",
            erro
          );
        }
      );


    void cronogramaPromise
      .then(
        async function (response) {

          if (
            response.status ===
            401
          ) {
            return;
          }


          const cronograma =
            response.ok
              ? await response.json()
              : {
                  schedule: null
                };


          renderPlanoDashboard(
            cronograma
          );

        }
      )
      .catch(
        function (erro) {
          console.warn(
            "Cronograma da Dashboard carregou com atraso:",
            erro
          );
        }
      );

  }
  catch (erro) {

    console.error(
      "Erro ao carregar dashboard:",
      erro
    );

  }

}

async function sair() {

  try {

    await fetch(
      "/api/auth/logout",
      {
        method:
          "POST",

        credentials:
          "same-origin"
      }
    );

  }
  finally {

    location.href =
      "/login.html";

  }

}


const logoutSidebar =
  $("logoutSidebar");


if (logoutSidebar) {

  logoutSidebar.addEventListener(
    "click",
    sair
  );

}


const dashboardWeatherRetry = $("dashboardWeatherRetry");

if (dashboardWeatherRetry) {
  dashboardWeatherRetry.addEventListener(
    "click",
    carregarClima
  );
}

carregarClima();
carregarDashboard();