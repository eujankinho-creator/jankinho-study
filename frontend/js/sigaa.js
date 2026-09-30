(function () {

  "use strict";


  const $ =
    function (
      id
    ) {

      return document
        .getElementById(
          id
        );

    };


  function escapeHtml(
    value
  ) {

    return String(
      value == null
        ? ""
        : value
    )
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );

  }


  async function api(
    url,
    options
  ) {

    const response =
      await fetch(
        url,
        {

          credentials:
            "same-origin",

          ...options,

        }
      );


    const data =
      await response
        .json()
        .catch(
          function () {

            return {};

          }
        );


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Erro ao comunicar com o servidor."
      );

    }


    return data;

  }


  function showMessage(
    text,
    type
  ) {

    const box =
      $("messageBox");


    if (!text) {

      box.className =
        "sigaa-message hidden";

      box.textContent =
        "";

      return;

    }


    box.className =
      "sigaa-message " +
      (
        type ||
        "info"
      );


    box.textContent =
      text;

  }


  function setConnected(
    connected,
    name
  ) {

    $("connectArea")
      .classList.toggle(
        "hidden",
        connected
      );


    $("academicArea")
      .classList.toggle(
        "hidden",
        !connected
      );


    $("statusDot")
      .classList.toggle(
        "connected",
        connected
      );


    $("statusText")
      .textContent =
      connected
        ? "Conectado"
        : "Não conectado";


    if (
      connected &&
      name
    ) {

      $("accountName")
        .textContent =
        name;

    }

  }


  function formatDate(
    value
  ) {

    if (!value) {

      return "Sem data";

    }


    const date =
      new Date(
        value
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return String(
        value
      );

    }


    return date
      .toLocaleString(
        "pt-BR",
        {

          dateStyle:
            "short",

          timeStyle:
            "short",

        }
      );

  }


  function renderSchedule(
    schedule
  ) {

    const days = [

      [
        "Segunda",
        "Segunda"
      ],

      [
        "Terca",
        "Terça"
      ],

      [
        "Quarta",
        "Quarta"
      ],

      [
        "Quinta",
        "Quinta"
      ],

      [
        "Sexta",
        "Sexta"
      ],

      [
        "Sabado",
        "Sábado"
      ],

    ];


    const todayMap = {

      0:
        null,

      1:
        "Segunda",

      2:
        "Terca",

      3:
        "Quarta",

      4:
        "Quinta",

      5:
        "Sexta",

      6:
        "Sabado",

    };


    const todayKey =
      todayMap[
        new Date()
          .getDay()
      ];


    const todayLabelMap = {

      Segunda:
        "Segunda-feira",

      Terca:
        "Terça-feira",

      Quarta:
        "Quarta-feira",

      Quinta:
        "Quinta-feira",

      Sexta:
        "Sexta-feira",

      Sabado:
        "Sábado",

    };


    const todayLessons =
      todayKey &&
      Array.isArray(
        schedule?.[
          todayKey
        ]
      )
        ? schedule[
            todayKey
          ]
        : [];


    const todayTitle =
      document.getElementById(
        "todayTitle"
      );


    const todaySummary =
      document.getElementById(
        "todaySummary"
      );


    if (todayTitle) {

      todayTitle.textContent =
        todayKey
          ? todayLabelMap[
              todayKey
            ]
          : "Domingo";

    }


    if (todaySummary) {

      if (!todayKey) {

        todaySummary.textContent =
          "Nenhuma aula prevista para hoje.";

      }
      else if (
        todayLessons.length ===
        0
      ) {

        todaySummary.textContent =
          "Nenhuma aula identificada no SIGAA para hoje.";

      }
      else if (
        todayLessons.length ===
        1
      ) {

        todaySummary.textContent =
          "1 aula identificada para hoje.";

      }
      else {

        todaySummary.textContent =
          todayLessons.length +
          " aulas identificadas para hoje.";

      }

    }


    $("scheduleGrid")
      .innerHTML =
      days.map(
        function (
          item
        ) {

          const key =
            item[0];

          const label =
            item[1];

          const lessons =
            Array.isArray(
              schedule?.[
                key
              ]
            )
              ? schedule[
                  key
                ]
              : [];


          const isToday =
            key ===
            todayKey;


          return `
            <article
              class="schedule-day ${
                isToday
                  ? "is-today"
                  : ""
              }"
            >

              <div class="day-heading">

                <strong>
                  ${label}
                </strong>

                <span>
                  ${lessons.length}
                </span>

              </div>

              <div class="day-lessons">

                ${
                  lessons.length
                    ? lessons
                        .map(
                          function (
                            lesson
                          ) {

                            return `
                              <div class="lesson-card">

                                <small>
                                  ${escapeHtml(
                                    lesson.shift ||
                                    "Horário"
                                  )}

                                  ${
                                    lesson.classes
                                      ? " · " +
                                        escapeHtml(
                                          lesson.classes
                                        )
                                      : ""
                                  }
                                </small>

                                <strong>
                                  ${escapeHtml(
                                    lesson.name
                                  )}
                                </strong>

                                <span>
                                  ${escapeHtml(
                                    lesson.scheduleCode ||
                                    lesson.schedule ||
                                    ""
                                  )}
                                </span>

                              </div>
                            `;

                          }
                        )
                        .join("")
                    : `
                      <div class="day-empty">
                        Sem aulas
                      </div>
                    `
                }

              </div>

            </article>
          `;

        }
      ).join("");

  }

  function renderNotices(
    notices
  ) {

    const list =
      Array.isArray(
        notices
      )
        ? notices
        : [];


    $("noticesMetric")
      .textContent =
      list.length;


    if (!list.length) {

      $("noticeList")
        .innerHTML = `
          <div class="empty-state">
            Nenhum aviso recente encontrado.
          </div>
        `;

      return;

    }


    $("noticeList")
      .innerHTML =
      list.map(
        function (
          notice,
          index
        ) {

          return `
            <article class="notice-card">

              <div class="notice-badge">
                ${index < 3 ? "NOVO" : "AVISO"}
              </div>

              <div>

                <div class="notice-meta">

                  <span>
                    ${escapeHtml(
                      notice.course
                    )}
                  </span>

                  <span>
                    ${escapeHtml(
                      formatDate(
                        notice.date
                      )
                    )}
                  </span>

                </div>

                <h3>
                  ${escapeHtml(
                    notice.title
                  )}
                </h3>

                ${
                  notice.content
                    ? `
                      <p>
                        ${escapeHtml(
                          notice.content
                        )}
                      </p>
                    `
                    : ""
                }

              </div>

            </article>
          `;

        }
      ).join("");

  }


  function renderCourses(
    courses
  ) {

    const list =
      Array.isArray(
        courses
      )
        ? courses
        : [];


    $("coursesMetric")
      .textContent =
      list.length;


    $("courseGrid")
      .innerHTML =
      list.length
        ? list.map(
            function (
              course
            ) {

              return `
                <article class="course-card">

                  <small>
                    ${escapeHtml(
                      course.code ||
                      "Turma"
                    )}
                  </small>

                  <h3>
                    ${escapeHtml(
                      course.name
                    )}
                  </h3>

                  <div>

                    <span>
                      Período
                      <strong>
                        ${escapeHtml(
                          course.period ||
                          "--"
                        )}
                      </strong>
                    </span>

                    <span>
                      Horário
                      <strong>
                        ${escapeHtml(
                          course.schedule ||
                          "Não informado"
                        )}
                      </strong>
                    </span>

                  </div>

                </article>
              `;

            }
          ).join("")
        : `
          <div class="empty-state">
            Nenhuma turma encontrada.
          </div>
        `;

  }


  function renderOverview(
    data
  ) {

    const student =
      data.student ||
      {};


    $("studentName")
      .textContent =
      student.name ||
      "--";


    $("studentRegistration")
      .textContent =
      student.registration ||
      "--";


    $("studentProgram")
      .textContent =
      student.program ||
      "--";


    $("periodMetric")
      .textContent =
      student.period ||
      "--";


    $("updatedMetric")
      .textContent =
      formatDate(
        data.updatedAt
      );


    renderSchedule(
      data.schedule ||
      {}
    );


    renderNotices(
      data.notices
    );


    renderCourses(
      data.courses
    );

  }


  async function loadOverview(
    force
  ) {

    showMessage(
      "Atualizando informações do SIGAA...",
      "info"
    );


    try {

      const data =
        await api(
          "/api/sigaa/overview" +
          (
            force
              ? "?force=1"
              : ""
          )
        );


      renderOverview(
        data
      );


      showMessage(
        "",
        ""
      );

    }
    catch (
      error
    ) {

      showMessage(
        error.message,
        "error"
      );

    }

  }


  async function loadStatus() {

    try {

      const status =
        await api(
          "/api/sigaa/status"
        );


      setConnected(
        Boolean(
          status.connected
        ),
        status.name
      );


      if (
        status.connected
      ) {

        await loadOverview(
          false
        );

      }

    }
    catch (
      error
    ) {

      setConnected(
        false
      );


      showMessage(
        error.message,
        "error"
      );

    }

  }


  $("sigaaForm")
    .addEventListener(
      "submit",
      async function (
        event
      ) {

        event.preventDefault();


        const username =
          $("sigaaUsername")
            .value
            .trim();


        const password =
          $("sigaaPassword")
            .value;


        if (
          !username ||
          !password
        ) {

          showMessage(
            "Informe usuário e senha.",
            "error"
          );

          return;

        }


        const button =
          $("connectButton");


        button.disabled =
          true;


        button.textContent =
          "Conectando...";


        showMessage(
          "Autenticando no SIGAA da UFPB...",
          "info"
        );


        try {

          const data =
            await api(
              "/api/sigaa/connect",
              {

                method:
                  "POST",

                headers: {

                  "Content-Type":
                    "application/json",

                },

                body:
                  JSON.stringify({

                    username,
                    password,

                  }),

              }
            );


          $("sigaaPassword")
            .value =
            "";


          setConnected(
            true,
            data.name
          );


          await loadOverview(
            true
          );

        }
        catch (
          error
        ) {

          $("sigaaPassword")
            .value =
            "";


          showMessage(
            error.message,
            "error"
          );

        }
        finally {

          button.disabled =
            false;


          button.textContent =
            "Conectar ao SIGAA";

        }

      }
    );


  $("refreshButton")
    .addEventListener(
      "click",
      function () {

        loadOverview(
          true
        );

      }
    );


  $("disconnectButton")
    .addEventListener(
      "click",
      async function () {

        try {

          await api(
            "/api/sigaa/disconnect",
            {
              method:
                "POST",
            }
          );

        }
        catch {

          // Estado visual sera limpo mesmo assim.

        }


        setConnected(
          false
        );


        showMessage(
          "SIGAA desconectado.",
          "info"
        );

      }
    );


  $("logoutSidebar")
    .addEventListener(
      "click",
      async function () {

        await fetch(
          "/api/auth/logout",
          {
            method:
              "POST",

            credentials:
              "same-origin",
          }
        );


        if (
          window.top &&
          window.top !==
          window
        ) {

          window.top.location.href =
            "/login.html";

        }
        else {

          location.href =
            "/login.html";

        }

      }
    );


  loadStatus();

})();