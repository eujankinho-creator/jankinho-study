const $ = function (id) {
  return document.getElementById(id);
};


const state = {
  temSenha: true,
};


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

        headers: {
          "Content-Type":
            "application/json",

          ...(
            options &&
            options.headers
              ? options.headers
              : {}
          ),
        },

        ...options,
      }
    );


  if (
    response.status ===
    401 &&
    url !==
      "/api/configuracoes/senha"
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
      "Erro na requisicao."
    );
  }


  return data;
}


function showMessage(
  message,
  type
) {

  const box =
    $("pageMessage");


  box.textContent =
    message;


  box.className =
    "page-message" +
    (
      type === "error"
        ? " error"
        : ""
    );


  box.classList.remove(
    "hidden"
  );


  window.clearTimeout(
    showMessage.timer
  );


  showMessage.timer =
    window.setTimeout(
      function () {

        box.classList.add(
          "hidden"
        );
      },
      4500
    );
}


function updateUserUI(
  user
) {

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


function formatDate(
  value
) {

  if (!value) {
    return "-";
  }


  try {

    return new Date(
      value
    )
      .toLocaleDateString(
        "pt-BR",
        {
          day:
            "2-digit",

          month:
            "2-digit",

          year:
            "numeric",
        }
      );

  }
  catch {

    return "-";
  }
}


async function loadSettings() {

  $("loading")
    .classList.remove(
      "hidden"
    );


  $("settingsContent")
    .classList.add(
      "hidden"
    );


  try {

    const data =
      await api(
        "/api/configuracoes",
        {
          method:
            "GET",
        }
      );


    const user =
      data.usuario;


    state.temSenha =
      Boolean(
        user.temSenha
      );


    updateUserUI(
      user
    );


    $("nome").value =
      user.nome || "";


    $("email").value =
      user.email || "";


    $("createdAt")
      .textContent =
      formatDate(
        user.createdAt
      );


    if (
      !state.temSenha
    ) {

      $("currentPasswordField")
        .classList.add(
          "hidden"
        );
    }


    $("loading")
      .classList.add(
        "hidden"
      );


    $("settingsContent")
      .classList.remove(
        "hidden"
      );

  }
  catch (error) {

    console.error(
      error
    );


    $("loading")
      .textContent =
      error.message ||
      "Nao foi possivel carregar as configuracoes.";
  }
}


$("profileForm")
  .addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const nome =
        $("nome")
          .value
          .trim();


      const button =
        $("saveProfile");


      button.disabled =
        true;


      button.textContent =
        "Salvando...";


      try {

        const data =
          await api(
            "/api/configuracoes/perfil",
            {
              method:
                "PATCH",

              body:
                JSON.stringify({
                  nome,
                }),
            }
          );


        updateUserUI(
          data.usuario
        );


        $("nome").value =
          data.usuario.nome;


        showMessage(
          "Perfil atualizado com sucesso."
        );

      }
      catch (error) {

        showMessage(
          error.message ||
          "Nao foi possivel atualizar o perfil.",
          "error"
        );

      }
      finally {

        button.disabled =
          false;


        button.textContent =
          "Salvar perfil";
      }
    }
  );


$("passwordForm")
  .addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const senhaAtual =
        $("senhaAtual")
          .value;


      const novaSenha =
        $("novaSenha")
          .value;


      const confirmarSenha =
        $("confirmarSenha")
          .value;


      if (
        novaSenha.length < 6
      ) {

        showMessage(
          "A nova senha deve ter pelo menos 6 caracteres.",
          "error"
        );

        return;
      }


      if (
        novaSenha !==
        confirmarSenha
      ) {

        showMessage(
          "As novas senhas nao coincidem.",
          "error"
        );

        return;
      }


      const button =
        $("savePassword");


      button.disabled =
        true;


      button.textContent =
        "Alterando...";


      try {

        await api(
          "/api/configuracoes/senha",
          {
            method:
              "PATCH",

            body:
              JSON.stringify({
                senhaAtual,
                novaSenha,
              }),
          }
        );


        $("senhaAtual").value =
          "";


        $("novaSenha").value =
          "";


        $("confirmarSenha").value =
          "";


        state.temSenha =
          true;


        $("currentPasswordField")
          .classList.remove(
            "hidden"
          );


        showMessage(
          "Senha alterada com sucesso."
        );

      }
      catch (error) {

        showMessage(
          error.message ||
          "Nao foi possivel alterar a senha.",
          "error"
        );

      }
      finally {

        button.disabled =
          false;


        button.textContent =
          "Alterar senha";
      }
    }
  );


async function logout() {

  try {

    await fetch(
      "/api/auth/logout",
      {
        method:
          "POST",

        credentials:
          "same-origin",
      }
    );

  }
  finally {

    location.href =
      "/login.html";
  }
}


$("logoutSidebar")
  .addEventListener(
    "click",
    logout
  );


$("logoutButton")
  .addEventListener(
    "click",
    logout
  );


loadSettings();