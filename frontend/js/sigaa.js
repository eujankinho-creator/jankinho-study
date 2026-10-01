(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  let overviewData = null;
  let currentCourseId = null;
  let currentCourseData = null;

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  async function api(url, options) {
    const response = await fetch(url, { credentials: "same-origin", ...options });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Erro ao comunicar com o servidor.");
    return data;
  }

  function filenameFromDisposition(header, fallback) {
    const value = String(header || "");
    const encoded = value.match(/filename\*=UTF-8''([^;]+)/i);
    if (encoded) {
      try { return decodeURIComponent(encoded[1]); } catch {}
    }
    const plain = value.match(/filename="?([^";]+)"?/i);
    return plain ? plain[1] : (fallback || "arquivo");
  }

  function downloadSigaaFile(url, fallbackName, button) {
    const targetUrl = String(url || "").trim();
    if (!targetUrl) {
      showMessage("Link de download indisponível.", "error");
      return;
    }

    if (button) {
      button.setAttribute("aria-busy", "true");
    }

    showMessage(
      "Enviando " + (fallbackName || "arquivo") + " para o dispositivo...",
      "info"
    );

    /*
     * Download direto: preserva o gesto do usuario e deixa o
     * Content-Disposition: attachment do backend controlar o arquivo.
     * Isso e mais confiavel em mobile do que fetch -> Blob -> click().
     */
    try {
      const topWindow =
        window.top &&
        window.top !== window &&
        window.top.location.origin === window.location.origin
          ? window.top
          : window;

      topWindow.location.href = targetUrl;

      window.setTimeout(() => {
        if (button) {
          button.removeAttribute("aria-busy");
        }
        showMessage("", "");
      }, 1800);
    } catch {
      window.location.href = targetUrl;
    }
  }

  function renderLessonAttachment(attachment, courseId) {
    const item = attachment || {};
    const rawTitle = item.title || item.type || "Recurso";
    const title = escapeHtml(rawTitle);

    if (item.downloadable && item.verifiedFile && item.id) {
      const query = new URLSearchParams({
        source: item.sourceKind || "lesson",
        title: rawTitle
      });

      if (item.lessonId) {
        query.set("lessonId", item.lessonId);
      }

      const url = "/api/sigaa/courses/" + encodeURIComponent(courseId) +
        "/files/" + encodeURIComponent(item.id) + "/download?" +
        query.toString();
      const kind = item.kind && item.kind !== "ARQUIVO" ? " " + item.kind : "";
      return '<button type="button" data-sigaa-download="' + escapeHtml(url) +
        '" data-filename="' + escapeHtml(rawTitle) + '">Baixar' +
        escapeHtml(kind) + ' · ' + title + "</button>";
    }

    if (item.url) {
      return '<a href="' + escapeHtml(item.url) +
        '" target="_blank" rel="noopener noreferrer">Abrir · ' + title + "</a>";
    }

    return "<span>" + title + "</span>";
  }

  function showMessage(text, type) {
    const box = $("messageBox");
    if (!text) {
      box.className = "sigaa-message hidden";
      box.textContent = "";
      return;
    }
    box.className = "sigaa-message " + (type || "info");
    box.textContent = text;
  }

  function setConnected(connected, name) {
    $("connectArea").classList.toggle("hidden", connected);
    $("academicArea").classList.toggle("hidden", !connected);
    $("statusDot").classList.toggle("connected", connected);
    $("statusText").textContent = connected ? "Conectado" : "Não conectado";
    if (connected && name) $("accountName").textContent = name;
    if (!connected) {
      $("academicDashboard").classList.remove("hidden");
      $("courseWorkspace").classList.add("hidden");
      const prioritySection = $("prioritySection");
      if (prioritySection) prioritySection.classList.add("hidden");
      const priorityList = $("priorityList");
      if (priorityList) priorityList.innerHTML = "";
      currentCourseId = null;
      currentCourseData = null;
    }
  }

  function formatDate(value, withTime) {
    if (!value) return "Não informado";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString("pt-BR", withTime === false
      ? { dateStyle: "short" }
      : { dateStyle: "short", timeStyle: "short" });
  }

  function formatNumber(value) {
    if (value == null || value === "") return "--";
    const number = Number(value);
    return Number.isFinite(number)
      ? number.toLocaleString("pt-BR", { maximumFractionDigits: 2 })
      : String(value);
  }

  function emptyState(text) {
    return '<div class="empty-state">' + escapeHtml(text) + "</div>";
  }

  function unavailable(section, text) {
    if (section && section.available === false) {
      return '<div class="section-unavailable"><strong>Indisponível nesta turma</strong><span>' +
        escapeHtml(section.error || text || "O SIGAA não retornou esta informação.") +
        "</span></div>";
    }
    return "";
  }

  function renderSchedule(schedule) {
    const days = [
      ["Segunda", "SEG"], ["Terca", "TER"], ["Quarta", "QUA"],
      ["Quinta", "QUI"], ["Sexta", "SEX"], ["Sabado", "SÁB"]
    ];
    const todayMap = { 1: "Segunda", 2: "Terca", 3: "Quarta", 4: "Quinta", 5: "Sexta", 6: "Sabado" };
    const todayNames = { Segunda: "Segunda-feira", Terca: "Terça-feira", Quarta: "Quarta-feira", Quinta: "Quinta-feira", Sexta: "Sexta-feira", Sabado: "Sábado" };
    const todayKey = todayMap[new Date().getDay()] || null;
    const todayLessons = todayKey && Array.isArray(schedule?.[todayKey]) ? schedule[todayKey] : [];

    $("todayTitle").textContent = todayKey ? todayNames[todayKey] : "Domingo";
    $("todaySummary").textContent = todayLessons.length
      ? todayLessons.length + (todayLessons.length === 1 ? " aula identificada para hoje." : " aulas identificadas para hoje.")
      : "Nenhuma aula identificada para hoje.";

    $("scheduleGrid").innerHTML = days.map(([key, label]) => {
      const lessons = Array.isArray(schedule?.[key]) ? schedule[key] : [];
      return `
        <article class="schedule-day ${key === todayKey ? "is-today" : ""}">
          <div class="day-heading"><strong>${label}</strong><span>${lessons.length}</span></div>
          <div class="day-lessons">
            ${lessons.length ? lessons.map((lesson) => `
              <button class="lesson-card" type="button" data-course-id="${escapeHtml(lesson.id)}">
                <small>${escapeHtml(lesson.shift || "Horário")} ${lesson.classes ? "· " + escapeHtml(lesson.classes) : ""}</small>
                <strong>${escapeHtml(lesson.name)}</strong>
                <span>${escapeHtml(lesson.scheduleCode || lesson.schedule || "")}</span>
              </button>
            `).join("") : '<div class="day-empty">Livre</div>'}
          </div>
        </article>`;
    }).join("");
  }

  function renderPriorities(priorities) {
    const list = Array.isArray(priorities) ? priorities : [];
    const section = $("prioritySection");
    const container = $("priorityList");
    const count = $("priorityCount");

    if (!section || !container || !count) return;

    count.textContent = String(list.length);
    section.classList.toggle("hidden", list.length === 0);

    if (!list.length) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = list.map((item) => {
      const days = Number(item.daysLeft);
      const when =
        days <= 0 ? "Hoje" :
        days === 1 ? "Amanhã" :
        "Em " + days + " dias";

      const typeLabel =
        item.kind === "exam"
          ? "PROVA"
          : "ATIVIDADE";

      const urgency =
        item.urgency === "critical"
          ? "critical"
          : item.urgency === "high"
            ? "high"
            : "attention";

      return `
        <button
          type="button"
          class="priority-item priority-${urgency}"
          data-course-id="${escapeHtml(item.courseId || "")}"
        >
          <span class="priority-type">${typeLabel}</span>
          <span class="priority-copy">
            <strong>${escapeHtml(item.title || typeLabel)}</strong>
            <small>${escapeHtml(item.course || "Disciplina")}</small>
          </span>
          <span class="priority-date">
            <strong>${escapeHtml(when)}</strong>
            <small>${escapeHtml(formatDate(item.date, false))}</small>
          </span>
        </button>
      `;
    }).join("");
  }


  function renderNotices(notices) {
    const list = Array.isArray(notices) ? notices : [];
    $("noticesMetric").textContent = list.length;
    $("noticeList").innerHTML = list.length ? list.map((notice, index) => `
      <article class="notice-card">
        <div class="notice-badge">${index < 3 ? "NOVO" : "INFO"}</div>
        <div>
          <div class="notice-meta"><span>${escapeHtml(notice.course)}</span><span>${escapeHtml(formatDate(notice.date, false))}</span></div>
          <h3>${escapeHtml(notice.title)}</h3>
          ${notice.content ? "<p>" + escapeHtml(notice.content) + "</p>" : ""}
        </div>
      </article>
    `).join("") : emptyState("Nenhum aviso recente encontrado.");
  }

  function renderCourses(courses, query) {
    const list = Array.isArray(courses) ? courses : [];
    const normalized = String(query || "").trim().toLocaleLowerCase("pt-BR");
    const filtered = normalized
      ? list.filter((course) => (course.name + " " + course.code).toLocaleLowerCase("pt-BR").includes(normalized))
      : list;

    $("coursesMetric").textContent = list.length;
    $("courseGrid").innerHTML = filtered.length ? filtered.map((course, index) => `
      <button class="course-card" type="button" data-course-id="${escapeHtml(course.id)}">
        <div class="course-card-top">
          <span class="course-number">${String(index + 1).padStart(2, "0")}</span>
          <span class="course-arrow">↗</span>
        </div>
        <small>${escapeHtml(course.code || "TURMA")}</small>
        <h3>${escapeHtml(course.name)}</h3>
        <div class="course-card-meta">
          <span><small>Período</small><strong>${escapeHtml(course.period || "--")}</strong></span>
          <span><small>Horário</small><strong>${escapeHtml(course.schedule || "Não informado")}</strong></span>
        </div>
        <div class="course-card-action">Abrir ambiente da disciplina <span>→</span></div>
      </button>
    `).join("") : emptyState(normalized ? "Nenhuma disciplina corresponde à busca." : "Nenhuma turma encontrada.");
  }

  function renderOverview(data) {
    overviewData = data;
    const student = data.student || {};
    $("studentName").textContent = student.name || "--";
    $("studentRegistration").textContent = student.registration || "--";
    $("studentProgram").textContent = student.program || "--";
    $("studentPeriod").textContent = student.period || "--";
    $("periodMetric").textContent = student.period || "--";
    $("updatedMetric").textContent = formatDate(data.updatedAt);
    $("studentInitial").textContent = (student.name || "U").trim().charAt(0).toUpperCase();
    renderSchedule(data.schedule || {});
    renderPriorities(data.priorities);
    renderNotices(data.notices);
    renderCourses(data.courses);
  }

  async function loadOverview(force) {
    showMessage("Sincronizando dados acadêmicos...", "info");
    try {
      const data = await api("/api/sigaa/overview" + (force ? "?force=1" : ""));
      renderOverview(data);
      showMessage("", "");
    } catch (error) {
      showMessage(error.message, "error");
    }
  }

  function renderGrades(section) {
    if (!section || section.available === false) return unavailable(section);
    const groups = Array.isArray(section.data) ? section.data : [];
    if (!groups.length) return emptyState("Nenhuma nota foi lançada nesta disciplina.");

    return '<div class="grade-groups">' + groups.map((group) => `
      <article class="grade-group">
        <div class="grade-group-head">
          <div><small>${escapeHtml(group.type || "avaliação")}</small><strong>${escapeHtml(group.name || "Notas")}</strong></div>
          <span class="grade-average">${formatNumber(group.value)}</span>
        </div>
        <div class="grade-items">
          ${Array.isArray(group.grades) && group.grades.length ? group.grades.map((grade) => `
            <div class="grade-row">
              <div><strong>${escapeHtml(grade.name || grade.code || "Avaliação")}</strong>
                <small>${grade.weight != null ? "Peso " + formatNumber(grade.weight) : grade.maxValue != null ? "Máx. " + formatNumber(grade.maxValue) : escapeHtml(grade.code || "")}</small>
              </div>
              <span>${formatNumber(grade.value)}</span>
            </div>
          `).join("") : '<div class="grade-row solo"><span>Média registrada</span><strong>' + formatNumber(group.value) + "</strong></div>"}
        </div>
      </article>
    `).join("") + "</div>";
  }

  function renderFiles(section, courseId) {
    if (!section || section.available === false) return unavailable(section);

    const files = (Array.isArray(section.data) ? section.data : [])
      .filter((file) => file && file.verified && file.downloadable && file.id);

    if (!files.length) {
      return emptyState(
        "Nenhum arquivo baixável foi encontrado nesta disciplina. " +
        "Textos, descrições e informações das aulas não são tratados como arquivos."
      );
    }

    return '<div class="resource-list">' + files.map((file) => {
      const query = new URLSearchParams({
        source: file.sourceKind || "course",
        title: file.title || "Arquivo"
      });

      if (file.lessonId) {
        query.set("lessonId", file.lessonId);
      }

      const url = "/api/sigaa/courses/" + encodeURIComponent(courseId) +
        "/files/" + encodeURIComponent(file.id) + "/download?" +
        query.toString();
      const source = file.source || "SIGAA";
      const description = file.description ||
        "Arquivo confirmado no SIGAA e disponível para download.";
      const kind = file.kind || "ARQUIVO";
      const downloadLabel =
        kind === "PDF" ? "Baixar PDF" :
        kind === "WORD" ? "Baixar Word" :
        "Baixar arquivo";

      return `
        <article class="resource-row">
          <div class="resource-icon">${escapeHtml(kind)}</div>
          <div class="resource-copy">
            <strong>${escapeHtml(file.title || "Arquivo")}</strong>
            <span>${escapeHtml(description)}</span>
            <span class="resource-source">${escapeHtml(source)} · arquivo confirmado</span>
          </div>
          <a class="download-button" href="${escapeHtml(url)}"
            data-sigaa-download="${escapeHtml(url)}"
            data-filename="${escapeHtml(file.title || "arquivo")}"
            download>${escapeHtml(downloadLabel)}</a>
        </article>
      `;
    }).join("") + "</div>";
  }

  function renderAttendance(section) {
    if (!section || section.available === false) return unavailable(section);
    const data = section.data || {};
    const total = Number(data.totalAbsences || 0);
    const max = Number(data.maxAbsences || 0);
    const percentage = max > 0 ? Math.min(100, Math.round((total / max) * 100)) : 0;
    const rows = Array.isArray(data.list) ? data.list : [];

    return `
      <div class="attendance-summary">
        <div class="attendance-ring" style="--attendance:${percentage}"><strong>${total}</strong><span>faltas</span></div>
        <div><small>LIMITE REGISTRADO</small><strong>${max || "--"} faltas</strong><p>${max ? Math.max(0, max - total) + " faltas restantes até o limite informado pelo SIGAA." : "O SIGAA não informou um limite de faltas."}</p></div>
      </div>
      <div class="attendance-bar"><span style="width:${percentage}%"></span></div>
      <div class="attendance-history">
        ${rows.length ? rows.map((item) => `<div><span>${escapeHtml(formatDate(item.date, false))}</span><strong>${Number(item.numOfAbsences || 0)} falta(s)</strong></div>`).join("") : emptyState("Nenhum registro de falta encontrado.")}
      </div>`;
  }

  function renderActivities(sections, courseId) {
    const exams = sections.exams?.available === false ? [] : (sections.exams?.data || []);
    const homeworks = sections.homeworks?.available === false ? [] : (sections.homeworks?.data || []);
    const lessons = sections.lessons?.available === false ? [] : (sections.lessons?.data || []);

    return `
      <div class="activity-columns">
        <section><div class="subheading"><small>CALENDÁRIO</small><h3>Avaliações</h3></div>
          ${exams.length ? exams.map((exam) => `<article class="activity-card"><span class="activity-date">${escapeHtml(formatDate(exam.date, false))}</span><strong>${escapeHtml(exam.description || "Avaliação")}</strong></article>`).join("") : unavailable(sections.exams) || emptyState("Nenhuma avaliação encontrada.")}
        </section>
        <section><div class="subheading"><small>PENDÊNCIAS</small><h3>Tarefas</h3></div>
          ${homeworks.length ? homeworks.map((task) => `<article class="activity-card"><span class="activity-date">${escapeHtml(formatDate(task.endDate, false))}</span><strong>${escapeHtml(task.title || "Tarefa")}</strong><small>Disponível desde ${escapeHtml(formatDate(task.startDate, false))}</small></article>`).join("") : unavailable(sections.homeworks) || emptyState("Nenhuma tarefa encontrada.")}
        </section>
      </div>
      <section class="lessons-block"><div class="subheading"><small>CONTEÚDO</small><h3>Aulas e tópicos</h3></div>
        ${lessons.length ? '<div class="lesson-timeline">' + lessons.map((lesson) => `
          <article><div class="timeline-dot"></div><div><small>${escapeHtml(formatDate(lesson.startDate, false))}</small><strong>${escapeHtml(lesson.title || "Aula")}</strong>${lesson.content ? "<p>" + escapeHtml(lesson.content) + "</p>" : ""}${lesson.attachments?.length ? '<div class="attachment-tags">' + lesson.attachments.map((a) => renderLessonAttachment(a, courseId)).join("") + "</div>" : ""}</div></article>
        `).join("") + "</div>" : unavailable(sections.lessons) || emptyState("Nenhuma aula encontrada.")}
      </section>`;
  }

  function renderSyllabus(section) {
    if (!section || section.available === false) return unavailable(section);
    const data = section.data;
    if (!data) return emptyState("Plano de ensino não encontrado.");

    const references = [...(data.basicReferences || []), ...(data.supplementaryReferences || [])];
    return `
      <div class="syllabus-grid">
        <article><small>METODOLOGIA</small><h3>Como a disciplina é conduzida</h3><p>${escapeHtml(data.methods || "Não informado.")}</p></article>
        <article><small>AVALIAÇÃO</small><h3>Procedimentos avaliativos</h3><p>${escapeHtml(data.assessmentProcedures || "Não informado.")}</p></article>
        <article><small>FREQUÊNCIA</small><h3>Controle de presença</h3><p>${escapeHtml(data.attendanceSchedule || "Não informado.")}</p></article>
      </div>
      <div class="syllabus-bottom">
        <section><div class="subheading"><small>CRONOGRAMA</small><h3>Conteúdo programado</h3></div>
          ${data.schedule?.length ? '<div class="syllabus-list">' + data.schedule.map((item) => `<div><span>${escapeHtml(formatDate(item.startDate, false))}</span><strong>${escapeHtml(item.description)}</strong></div>`).join("") + "</div>" : emptyState("Cronograma não informado.")}
        </section>
        <section><div class="subheading"><small>BIBLIOGRAFIA</small><h3>Referências</h3></div>
          ${references.length ? '<div class="reference-list">' + references.map((item) => `<p><span>${escapeHtml(item.type || "Referência")}</span>${escapeHtml(item.description)}</p>`).join("") + "</div>" : emptyState("Referências não informadas.")}
        </section>
      </div>`;
  }

  function renderCourseDetail(data) {
    currentCourseData = data;
    const course = data.course || {};
    const sections = data.sections || {};
    const gradeGroups = sections.grades?.available === false ? [] : (sections.grades?.data || []);
    const gradeCount = gradeGroups.reduce((sum, group) => sum + (group.grades?.filter((g) => g.value != null).length || (group.value != null ? 1 : 0)), 0);
    const files = sections.files?.available === false ? [] : (sections.files?.data || []);
    const homeworks = sections.homeworks?.available === false ? [] : (sections.homeworks?.data || []);
    const exams = sections.exams?.available === false ? [] : (sections.exams?.data || []);

    $("workspaceCourseCode").textContent = course.code || "TURMA";
    $("workspaceCourseName").textContent = course.name || "Disciplina";
    $("workspaceCourseMeta").textContent = [course.period, course.schedule, course.numberOfStudents ? course.numberOfStudents + " alunos" : ""].filter(Boolean).join("  ·  ") || "Informações da turma";
    $("workspaceUpdated").textContent = formatDate(data.updatedAt);
    $("gradeCount").textContent = gradeCount;
    $("absenceCount").textContent = sections.absences?.data?.totalAbsences ?? "--";
    $("fileCount").textContent = files.length;
    $("activityCount").textContent = homeworks.length + exams.length;

    $("tab-grades").innerHTML = renderGrades(sections.grades);
    $("tab-files").innerHTML = renderFiles(sections.files, course.id);
    $("tab-attendance").innerHTML = renderAttendance(sections.absences);
    $("tab-activities").innerHTML = renderActivities(sections, course.id);
    $("tab-syllabus").innerHTML = renderSyllabus(sections.syllabus);

    $("tab-overview").innerHTML = `
      <div class="overview-cards">
        <article class="overview-feature"><small>DESEMPENHO</small><h3>Notas</h3><p>${gradeCount ? gradeCount + " lançamento(s) de nota disponíveis." : "Nenhuma nota lançada ou seção indisponível."}</p><button type="button" data-open-tab="grades">Ver boletim →</button></article>
        <article class="overview-feature"><small>MATERIAIS</small><h3>Arquivos</h3><p>${files.length ? files.length + " arquivo(s) real(is) confirmado(s) para download." : "Nenhum arquivo encontrado."}</p><button type="button" data-open-tab="files">Abrir materiais →</button></article>
        <article class="overview-feature"><small>FREQUÊNCIA</small><h3>Presença</h3><p>${sections.absences?.available === false ? "Seção indisponível." : (sections.absences?.data?.totalAbsences || 0) + " falta(s) registrada(s)."}</p><button type="button" data-open-tab="attendance">Ver frequência →</button></article>
        <article class="overview-feature"><small>AGENDA</small><h3>Atividades</h3><p>${homeworks.length + exams.length ? homeworks.length + exams.length + " atividade(s) ou avaliação(ões)." : "Nenhuma atividade encontrada."}</p><button type="button" data-open-tab="activities">Ver agenda →</button></article>
      </div>
      <div class="overview-lower">
        <section><div class="subheading"><small>PRÓXIMAS AVALIAÇÕES</small><h3>Calendário da disciplina</h3></div>
          ${exams.length ? exams.slice(0, 5).map((exam) => `<div class="mini-event"><span>${escapeHtml(formatDate(exam.date, false))}</span><strong>${escapeHtml(exam.description)}</strong></div>`).join("") : emptyState("Nenhuma avaliação encontrada.")}
        </section>
        <section><div class="subheading"><small>STATUS</small><h3>Disponibilidade no SIGAA</h3></div>
          <div class="availability-grid">
            ${Object.entries({ Notas: sections.grades, Arquivos: sections.files, Frequência: sections.absences, Avaliações: sections.exams, Tarefas: sections.homeworks, Aulas: sections.lessons, Plano: sections.syllabus }).map(([name, value]) => `<div><span class="${value?.available === false ? "off" : "on"}"></span><strong>${name}</strong><small>${value?.available === false ? "Indisponível" : "Disponível"}</small></div>`).join("")}
          </div>
        </section>
      </div>`;

    bindInternalTabLinks();
  }

  function setTab(tabName) {
    document.querySelectorAll("#courseTabs button").forEach((button) => button.classList.toggle("active", button.dataset.tab === tabName));
    document.querySelectorAll(".course-tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === "tab-" + tabName));
  }

  function bindInternalTabLinks() {
    document.querySelectorAll("[data-open-tab]").forEach((button) => {
      button.addEventListener("click", () => setTab(button.dataset.openTab));
    });
  }

  async function openCourse(courseId, force) {
    if (!courseId) return;
    currentCourseId = courseId;
    $("academicDashboard").classList.add("hidden");
    $("courseWorkspace").classList.remove("hidden");
    $("courseLoading").classList.remove("hidden");
    $("courseContent").classList.add("loading-content");
    setTab("overview");
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const data = await api("/api/sigaa/courses/" + encodeURIComponent(courseId) + (force ? "?force=1" : ""));
      renderCourseDetail(data);
      showMessage("", "");
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      $("courseLoading").classList.add("hidden");
      $("courseContent").classList.remove("loading-content");
    }
  }

  async function loadStatus() {
    try {
      const status = await api("/api/sigaa/status");
      setConnected(Boolean(status.connected), status.name);
      if (status.connected) await loadOverview(false);
    } catch (error) {
      setConnected(false);
      showMessage(error.message, "error");
    }
  }

  $("sigaaForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = $("sigaaUsername").value.trim();
    const password = $("sigaaPassword").value;
    if (!username || !password) return showMessage("Informe usuário e senha.", "error");

    const button = $("connectButton");
    button.disabled = true;
    button.textContent = "Conectando...";
    showMessage("Autenticando no SIGAA da UFPB...", "info");

    try {
      const data = await api("/api/sigaa/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      $("sigaaPassword").value = "";
      setConnected(true, data.name);
      await loadOverview(true);
    } catch (error) {
      $("sigaaPassword").value = "";
      showMessage(error.message, "error");
    } finally {
      button.disabled = false;
      button.textContent = "Conectar com segurança";
    }
  });

  $("refreshButton").addEventListener("click", () => loadOverview(true));
  $("refreshCourseButton").addEventListener("click", () => currentCourseId && openCourse(currentCourseId, true));
  $("backToDashboard").addEventListener("click", () => {
    $("courseWorkspace").classList.add("hidden");
    $("academicDashboard").classList.remove("hidden");
    currentCourseId = null;
    currentCourseData = null;
  });

  $("courseSearch").addEventListener("input", (event) => {
    renderCourses(overviewData?.courses || [], event.target.value);
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-course-id]");
    if (target) openCourse(target.dataset.courseId, false);
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-sigaa-download]");
    if (!button) return;
    event.preventDefault();
    downloadSigaaFile(
      button.dataset.sigaaDownload,
      button.dataset.filename || "arquivo",
      button
    );
  });

  $("courseTabs").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-tab]");
    if (button) setTab(button.dataset.tab);
  });

  $("disconnectButton").addEventListener("click", async () => {
    try { await api("/api/sigaa/disconnect", { method: "POST" }); } catch {}
    setConnected(false);
    showMessage("SIGAA desconectado.", "info");
  });

  $("logoutSidebar").addEventListener("click", async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    if (window.top && window.top !== window) window.top.location.href = "/login.html";
    else location.href = "/login.html";
  });

  loadStatus();
})();