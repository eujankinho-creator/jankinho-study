const $ = function (id) {
  return document.getElementById(id);
};


const state = {
  temSenha: true,
  fotoPerfil: null,
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


function applyProfilePhoto(
  element,
  photo,
  initial
) {

  if (!element) {
    return;
  }


  if (photo) {

    element.style.setProperty(
      "--cortex-profile-photo",
      "url(" + JSON.stringify(String(photo)) + ")"
    );

    element.style.removeProperty(
      "background-image"
    );

    element.style.removeProperty(
      "background-size"
    );

    element.style.removeProperty(
      "background-position"
    );

    element.style.removeProperty(
      "background-repeat"
    );

    element.style.removeProperty(
      "color"
    );

    element.style.overflow =
      "hidden";

    element.style.borderRadius =
      "50%";

    element.classList.add(
      "has-profile-photo"
    );

    return;
  }


  element.style.removeProperty(
    "--cortex-profile-photo"
  );

  element.style.removeProperty(
    "background-image"
  );

  element.style.removeProperty(
    "background-size"
  );

  element.style.removeProperty(
    "background-position"
  );

  element.style.removeProperty(
    "background-repeat"
  );

  element.style.removeProperty(
    "color"
  );

  element.classList.remove(
    "has-profile-photo"
  );

  element.textContent =
    initial ||
    "U";
}


function renderProfilePhoto() {

  const name =
    $("nome") &&
    $("nome").value
      ? $("nome").value
      : (
          $("nomeHeader")
            ? $("nomeHeader").textContent
            : "Usuario"
        );


  const initial =
    String(
      name ||
      "Usuario"
    )
      .charAt(0)
      .toUpperCase();


  const image =
    $("profilePhotoImage");


  const initialNode =
    $("profilePhotoInitial");


  if (
    image &&
    initialNode
  ) {

    if (
      state.fotoPerfil
    ) {

      image.src =
        state.fotoPerfil;

      image.classList.remove(
        "hidden"
      );

      initialNode.classList.add(
        "hidden"
      );

    }
    else {

      image.removeAttribute(
        "src"
      );

      image.classList.add(
        "hidden"
      );

      initialNode.textContent =
        initial;

      initialNode.classList.remove(
        "hidden"
      );

    }

  }


  [
    $("avatarSidebar"),
    $("avatarHeader"),
    $("settingsHeroAvatar")
  ]
    .filter(Boolean)
    .forEach(
      function (
        element
      ) {

        applyProfilePhoto(
          element,
          state.fotoPerfil,
          initial
        );

      }
    );
}


function notifyGlobalProfile(user) {

  if (
    window.parent !==
    window
  ) {

    window.parent.postMessage(
      {
        type:
          "cortex:profile-updated",

        usuario: {
          nome:
            user && user.nome
              ? user.nome
              : ($("nome") ? $("nome").value.trim() : "Usuario"),

          email:
            user && user.email
              ? user.email
              : ($("email") ? $("email").value.trim() : ""),

          fotoPerfil:
            state.fotoPerfil || null
        }
      },
      window.location.origin
    );

  }

}


function notifyGlobalProfilePhoto() {

  if (
    window.parent !==
    window
  ) {

    window.parent.postMessage(
      {
        type:
          "cortex:profile-photo-updated",

        fotoPerfil:
          state.fotoPerfil
      },
      window.location.origin
    );

  }

}


function loadImageElement(
  file
) {

  return new Promise(
    function (
      resolve,
      reject
    ) {

      const image =
        new Image();


      const url =
        URL.createObjectURL(
          file
        );


      image.onload =
        function () {

          URL.revokeObjectURL(
            url
          );

          resolve(
            image
          );

        };


      image.onerror =
        function () {

          URL.revokeObjectURL(
            url
          );

          reject(
            new Error(
              "Nao foi possivel ler a imagem."
            )
          );

        };


      image.src =
        url;

    }
  );
}


async function compressProfilePhoto(
  file
) {

  if (
    !file ||
    !/^image\/(?:jpeg|png|webp)$/
      .test(
        file.type
      )
  ) {

    throw new Error(
      "Escolha uma imagem JPG, PNG ou WebP."
    );
  }


  if (
    file.size >
    8 * 1024 * 1024
  ) {

    throw new Error(
      "A imagem original deve ter no maximo 8 MB."
    );
  }


  const image =
    await loadImageElement(
      file
    );


  const cropSize =
    Math.min(
      image.naturalWidth,
      image.naturalHeight
    );


  const sx =
    Math.max(
      0,
      (
        image.naturalWidth -
        cropSize
      ) /
      2
    );


  const sy =
    Math.max(
      0,
      (
        image.naturalHeight -
        cropSize
      ) /
      2
    );


  const attempts = [
    {
      size: 320,
      quality: .84
    },
    {
      size: 288,
      quality: .78
    },
    {
      size: 256,
      quality: .72
    }
  ];


  for (
    const attempt of
    attempts
  ) {

    const canvas =
      document.createElement(
        "canvas"
      );


    canvas.width =
      attempt.size;

    canvas.height =
      attempt.size;


    const context =
      canvas.getContext(
        "2d"
      );


    if (!context) {

      throw new Error(
        "Seu navegador nao conseguiu processar a foto."
      );
    }


    context.fillStyle =
      "#111111";

    context.fillRect(
      0,
      0,
      attempt.size,
      attempt.size
    );


    context.drawImage(
      image,
      sx,
      sy,
      cropSize,
      cropSize,
      0,
      0,
      attempt.size,
      attempt.size
    );


    const data =
      canvas.toDataURL(
        "image/jpeg",
        attempt.quality
      );


    if (
      data.length <
      260 * 1024
    ) {

      return data;
    }

  }


  throw new Error(
    "A foto ficou muito grande mesmo apos a compressao."
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


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        user,
        "fotoPerfil"
      )
  ) {

    state.fotoPerfil =
      user.fotoPerfil ||
      null;

  }


  [
    $("avatarSidebar"),
    $("avatarHeader")
  ]
    .forEach(
      function (
        element
      ) {

        applyProfilePhoto(
          element,
          state.fotoPerfil,
          initial
        );

      }
    );


  renderProfilePhoto();


  window.setTimeout(
    renderProfilePhoto,
    0
  );

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


    state.fotoPerfil =
      user.fotoPerfil ||
      null;


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
                  fotoPerfil:
                    state.fotoPerfil,
                }),
            }
          );


        updateUserUI(
          data.usuario
        );


        state.fotoPerfil =
          data.usuario.fotoPerfil ||
          null;


        renderProfilePhoto();


        notifyGlobalProfile(
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


$("chooseProfilePhoto")
  .addEventListener(
    "click",
    function () {

      $("profilePhotoInput")
        .click();

    }
  );


$("profilePhotoInput")
  .addEventListener(
    "change",
    async function () {

      const file =
        this.files &&
        this.files[0];


      this.value =
        "";


      if (!file) {
        return;
      }


      const button =
        $("chooseProfilePhoto");


      button.disabled =
        true;

      button.textContent =
        "Processando...";


      try {

        state.fotoPerfil =
          await compressProfilePhoto(
            file
          );


        renderProfilePhoto();


        showMessage(
          "Foto pronta. Clique em Salvar perfil para sincronizar em todos os dispositivos."
        );

      }
      catch (error) {

        showMessage(
          error.message ||
          "Nao foi possivel processar a foto.",
          "error"
        );

      }
      finally {

        button.disabled =
          false;

        button.textContent =
          "Escolher foto";

      }

    }
  );


$("removeProfilePhoto")
  .addEventListener(
    "click",
    function () {

      state.fotoPerfil =
        null;


      renderProfilePhoto();


      showMessage(
        "Foto removida da pre-visualizacao. Clique em Salvar perfil para confirmar."
      );

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