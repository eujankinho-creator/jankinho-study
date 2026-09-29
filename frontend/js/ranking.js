const $ = function (id) {
  return document.getElementById(id);
};


const state = {
  usuarioId: null,
};


function escapeHtml(value) {

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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

        ...options
      }
    );


  if (
    response.status === 401
  ) {

    location.href =
      "/login.html";

    throw new Error(
      "Nao autenticado."
    );
  }


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
      "Erro ao carregar dados."
    );
  }


  return data;
}


function initials(name) {

  const parts =
    String(name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);


  if (!parts.length) {
    return "?";
  }


  if (parts.length === 1) {

    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }


  return (
    parts[0][0] +
    parts[
      parts.length - 1
    ][0]
  ).toUpperCase();
}


function medal(position) {

  if (position === 1) {
    return "\ud83e\udd47";
  }


  if (position === 2) {
    return "\ud83e\udd48";
  }


  if (position === 3) {
    return "\ud83e\udd49";
  }


  if (position) {
    return "#" + position;
  }


  return "\u2014";
}


function percentClass(value) {

  if (value >= 80) {
    return "good";
  }


  if (value < 60) {
    return "low";
  }


  return "";
}


function width(value) {

  return (
    Math.max(
      0,
      Math.min(
        100,
        Number(value) || 0
      )
    ) +
    "%"
  );
}


async function loadUser() {

  const data =
    await api(
      "/api/auth/me"
    );


  const user =
    data.usuario ||
    data;


  state.usuarioId =
    user.id;


  const name =
    user.nome ||
    "Usuario";


  const initial =
    name
      .charAt(0)
      .toUpperCase();


  $("nomeSidebar")
    .textContent =
    name;


  $("emailSidebar")
    .textContent =
    user.email || "";


  $("nomeHeader")
    .textContent =
    name;


  $("avatarSidebar")
    .textContent =
    initial;


  $("avatarHeader")
    .textContent =
    initial;
}


function renderPodium(
  ranking
) {

  const order = [
    ranking[1],
    ranking[0],
    ranking[2],
  ];


  $("podio")
    .innerHTML =
    order
      .filter(Boolean)
      .map(
        function (item) {

          const current =
            item.usuarioId ===
            state.usuarioId;


          return `
            <article
              class="podium-card ${
                item.posicao === 1
                  ? "first"
                  : ""
              }"
            >

              ${
                current
                  ? `
                    <span class="you-badge">
                      Voce
                    </span>
                  `
                  : ""
              }


              <div class="medal">
                ${medal(
                  item.posicao
                )}
              </div>


              <div class="podium-avatar">
                ${escapeHtml(
                  initials(
                    item.nome
                  )
                )}
              </div>


              <h3>
                ${escapeHtml(
                  item.nome
                )}
              </h3>


              <strong
                class="podium-percent ${percentClass(
                  item.percentual
                )}"
              >
                ${item.percentual}%
              </strong>


              <span class="podium-caption">
                aproveitamento
              </span>


              <div class="progress">

                <div
                  class="progress-value ${percentClass(
                    item.percentual
                  )}"
                  style="width:${width(
                    item.percentual
                  )}"
                ></div>

              </div>


              <div class="podium-stats">

                <div class="podium-stat">

                  <strong class="green">
                    ${item.acertos}
                  </strong>

                  <span>
                    Acertos
                  </span>

                </div>


                <div class="podium-stat">

                  <strong class="red">
                    ${item.erros}
                  </strong>

                  <span>
                    Erros
                  </span>

                </div>


                <div class="podium-stat">

                  <strong>
                    ${item.total}
                  </strong>

                  <span>
                    Questoes
                  </span>

                </div>

              </div>

            </article>
          `;
        }
      )
      .join("");
}


function renderUsers(
  users
) {

  $("listaUsuarios")
    .innerHTML =
    users
      .map(
        function (item) {

          const current =
            item.usuarioId ===
            state.usuarioId;


          return `
            <article
              class="user-row ${
                current
                  ? "current"
                  : ""
              }"
            >

              <div class="user-main">


                <div class="user-identity">

                  <div class="position-box">
                    ${medal(
                      item.posicao
                    )}
                  </div>


                  <div class="user-avatar">
                    ${escapeHtml(
                      initials(
                        item.nome
                      )
                    )}
                  </div>


                  <div class="user-name">

                    <strong>

                      ${escapeHtml(
                        item.nome
                      )}

                      ${
                        current
                          ? `
                            <span class="inline-you">
                              Voce
                            </span>
                          `
                          : ""
                      }

                    </strong>


                    ${
                      !item.elegivel
                        ? `
                          <small>
                            Ainda nao classificado
                          </small>
                        `
                        : ""
                    }

                  </div>

                </div>


                <div class="user-stats">


                  <div class="user-stat">

                    <strong class="${item.elegivel
                      ? percentClass(
                          item.percentual
                        )
                      : ""
                    }">

                      ${
                        item.elegivel
                          ? item.percentual +
                            "%"
                          : "\u2014"
                      }

                    </strong>

                    <span>
                      Aproveitamento
                    </span>

                  </div>


                  <div class="user-stat">

                    <strong class="green">
                      ${item.acertos}
                    </strong>

                    <span>
                      Acertos
                    </span>

                  </div>


                  <div class="user-stat">

                    <strong class="red">
                      ${item.erros}
                    </strong>

                    <span>
                      Erros
                    </span>

                  </div>


                  <div class="user-stat">

                    <strong>
                      ${item.total}
                    </strong>

                    <span>
                      Questoes
                    </span>

                  </div>


                </div>

              </div>


              ${
                item.elegivel
                  ? `
                    <div class="progress">

                      <div
                        class="progress-value ${percentClass(
                          item.percentual
                        )}"
                        style="width:${width(
                          item.percentual
                        )}"
                      ></div>

                    </div>
                  `
                  : ""
              }

            </article>
          `;
        }
      )
      .join("");
}


async function loadRanking() {

  $("loading")
    .classList.remove(
      "hidden"
    );


  $("erro")
    .classList.add(
      "hidden"
    );


  $("conteudo")
    .classList.add(
      "hidden"
    );


  $("semClassificados")
    .classList.add(
      "hidden"
    );


  try {

    const data =
      await api(
        "/api/ranking"
      );


    const ranking =
      data.ranking ||
      [];


    const users =
      data.usuarios ||
      [];


    $("loading")
      .classList.add(
        "hidden"
      );


    $("totalClassificados")
      .textContent =
      ranking.length;


    if (!ranking.length) {

      $("semClassificados")
        .classList.remove(
          "hidden"
        );


      /*
       * Mesmo sem classificados,
       * mantemos a lista geral abaixo
       * se existirem usuarios.
       */
      if (users.length) {

        $("conteudo")
          .classList.remove(
            "hidden"
          );


        $("podioSection")
          .classList.add(
            "hidden"
          );


        renderUsers(
          users
        );


        $("avisoMinimo")
          .classList.remove(
            "hidden"
          );
      }


      return;
    }


    $("podioSection")
      .classList.remove(
        "hidden"
      );


    renderPodium(
      ranking
    );


    renderUsers(
      users
    );


    const hasNotEligible =
      users.some(
        function (item) {
          return !item.elegivel;
        }
      );


    $("avisoMinimo")
      .classList.toggle(
        "hidden",
        !hasNotEligible
      );


    $("conteudo")
      .classList.remove(
        "hidden"
      );

  }
  catch (error) {

    console.error(
      error
    );


    $("loading")
      .classList.add(
        "hidden"
      );


    $("erro")
      .textContent =
      error.message ||
      "Nao foi possivel carregar o ranking.";


    $("erro")
      .classList.remove(
        "hidden"
      );
  }
}


async function logout() {

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


$("atualizarRanking")
  .addEventListener(
    "click",
    loadRanking
  );


$("atualizarRodape")
  .addEventListener(
    "click",
    loadRanking
  );


$("atualizarVazio")
  .addEventListener(
    "click",
    loadRanking
  );


$("logoutSidebar")
  .addEventListener(
    "click",
    logout
  );


async function start() {

  try {

    await loadUser();

    await loadRanking();

  }
  catch (error) {

    console.error(
      error
    );
  }
}


start();