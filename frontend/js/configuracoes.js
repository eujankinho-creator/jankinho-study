const $ = function (id) {
  return document.getElementById(id);
};


const state = {
  temSenha: true,
  fotoPerfil: null,
  usuarioId: null,
  tema: "dark-orange",
  petMode: "removed",
  petProfile: null,
};


function petModeKey() {
  return "cortex_pet_mode_v1_" + (state.usuarioId || "local");
}


function getPetMode() {
  try {
    const mode = localStorage.getItem(petModeKey());
    if (mode === "visible" || mode === "hidden" || mode === "removed") {
      return mode;
    }
  }
  catch (error) {}

  return "removed";
}


const THEME_NAMES = {
  "dark-orange": "Orange",
  "dark-pink": "Rosa",
  "dark-green": "Verde",
  "dark-purple": "Roxo",
  "dark-black": "Dark Black",
};

const PET_COLORS = new Set([
  "theme",
  "orange",
  "pink",
  "green",
  "purple",
  "black",
  "white",
]);

const PET_OUTFITS = new Set([
  "none",
  "bow",
  "hoodie",
  "scarf",
  "glasses",
  "crown",
]);


function normalizeTheme(theme) {
  return Object.prototype.hasOwnProperty.call(THEME_NAMES, theme)
    ? theme
    : "dark-orange";
}


function renderThemeSettings(theme) {
  const normalized = normalizeTheme(theme);
  state.tema = normalized;

  const current = $("themeCurrentName");
  if (current) {
    current.textContent = THEME_NAMES[normalized];
  }

  document
    .querySelectorAll("[data-theme-choice]")
    .forEach(function (button) {
      const active =
        button.getAttribute("data-theme-choice") === normalized;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
}


function setThemeFromSettings(theme) {
  const normalized = normalizeTheme(theme);

  if (window.JankinhoTheme && typeof window.JankinhoTheme.setTheme === "function") {
    window.JankinhoTheme.setTheme(normalized);
  }
  else {
    document.documentElement.setAttribute("data-theme", normalized);
    try {
      localStorage.setItem("jankinho_theme_v1", normalized);
    }
    catch (error) {}
  }

  renderThemeSettings(normalized);
  showMessage("Tema " + THEME_NAMES[normalized] + " aplicado.");
}


function petProfileKey() {
  return "cortex_pet_profile_v1_" + (state.usuarioId || "local");
}


function getPetProfile() {
  const fallback = {
    name: "",
    color: "theme",
    outfit: "none",
  };

  try {
    const saved = JSON.parse(
      localStorage.getItem(petProfileKey()) || "null"
    );

    if (!saved || typeof saved !== "object") {
      return fallback;
    }

    return {
      name: String(saved.name || "")
        .replace(/[<>]/g, "")
        .trim()
        .slice(0, 16),

      color: PET_COLORS.has(saved.color)
        ? saved.color
        : "theme",

      outfit: PET_OUTFITS.has(saved.outfit)
        ? saved.outfit
        : "none",
    };
  }
  catch (error) {
    return fallback;
  }
}


function savePetProfile(profile) {
  const normalized = {
    name: String(profile.name || "")
      .replace(/[<>]/g, "")
      .trim()
      .slice(0, 16),

    color: PET_COLORS.has(profile.color)
      ? profile.color
      : "theme",

    outfit: PET_OUTFITS.has(profile.outfit)
      ? profile.outfit
      : "none",
  };

  try {
    localStorage.setItem(
      petProfileKey(),
      JSON.stringify(normalized)
    );
  }
  catch (error) {}

  try {
    const target = window.parent !== window ? window.parent : window;

    target.postMessage(
      {
        type: "cortex:pet-profile",
        profile: normalized,
        userId: state.usuarioId,
      },
      window.location.origin
    );
  }
  catch (error) {}

  state.petProfile =
    normalized;

  if (state.usuarioId) {
    void api(
      "/api/configuracoes/pet",
      {
        method:
          "PATCH",

        body:
          JSON.stringify({
            profile:
              normalized,
          }),
      }
    )
      .catch(
        function (error) {
          showMessage(
            error.message ||
            "Nao foi possivel salvar a personalizacao do pet.",
            "error"
          );
        }
      );
  }

  renderPetCustomization(normalized);

  return normalized;
}


function renderPetCustomization(profileInput) {
  const profile = profileInput || getPetProfile();
  const nameInput = $("petNameSetting");

  if (nameInput) {
    nameInput.value = profile.name || "";
  }

  document
    .querySelectorAll("[data-pet-color]")
    .forEach(function (button) {
      const active =
        button.getAttribute("data-pet-color") === profile.color;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

  document
    .querySelectorAll("[data-pet-outfit]")
    .forEach(function (button) {
      const active =
        button.getAttribute("data-pet-outfit") === profile.outfit;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
}


function renderPetSettings() {
  const status = $("petSettingsStatus");
  const hint = $("petSettingsHint");
  const mode = getPetMode();

  if (status) {
    status.textContent =
      mode === "visible"
        ? "Visível"
        : mode === "hidden"
          ? "Oculto"
          : "Removido";
  }

  if (hint) {
    hint.textContent =
      mode === "visible"
        ? "O pet está ativo no canto da plataforma."
        : mode === "hidden"
          ? "O pet continua salvo, mas não aparece na interface."
          : "O pet foi retirado da interface. Você pode adicioná-lo novamente quando quiser.";
  }

  document
    .querySelectorAll("[data-pet-mode]")
    .forEach(function (button) {
      const active =
        button.getAttribute("data-pet-mode") === mode;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
}


async function setPetMode(mode) {
  if (
    mode !== "visible" &&
    mode !== "hidden" &&
    mode !== "removed"
  ) {
    return;
  }

  try {
    const data =
      await api(
        "/api/configuracoes/pet",
        {
          method:
            "PATCH",

          body:
            JSON.stringify({
              mode,
            }),
        }
      );

    const savedMode =
      data &&
      (
        data.petMode === "visible" ||
        data.petMode === "hidden" ||
        data.petMode === "removed"
      )
        ? data.petMode
        : "removed";

    state.petMode =
      savedMode;

    try {
      localStorage.setItem(
        petModeKey(),
        savedMode
      );
    }
    catch (error) {}

    const target =
      window.parent !== window
        ? window.parent
        : window;

    try {
      target.postMessage(
        {
          type:
            "cortex:pet-mode",

          mode:
            savedMode,

          userId:
            state.usuarioId,
        },
        window.location.origin
      );
    }
    catch (error) {}

    renderPetSettings();

    showMessage(
      savedMode === "visible"
        ? "Pet ativado nesta conta."
        : savedMode === "hidden"
          ? "Pet ocultado. Ele continua salvo na sua conta."
          : "Pet removido da sua conta."
    );
  }
  catch (error) {
    showMessage(
      error.message ||
      "Nao foi possivel atualizar o pet.",
      "error"
    );
  }
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


    state.usuarioId =
      user.id ||
      null;


    state.petMode =
      (
        user.petMode === "visible" ||
        user.petMode === "hidden" ||
        user.petMode === "removed"
      )
        ? user.petMode
        : "removed";


    state.petProfile =
      user.petProfile &&
      typeof user.petProfile === "object"
        ? user.petProfile
        : {
            name: "",
            color: "theme",
            outfit: "none",
          };


    try {
      localStorage.setItem(
        petModeKey(),
        state.petMode
      );

      localStorage.setItem(
        petProfileKey(),
        JSON.stringify(
          state.petProfile
        )
      );
    }
    catch (error) {}


    state.fotoPerfil =
      user.fotoPerfil ||
      null;


    state.tema =
      normalizeTheme(
        user.tema
      );


    updateUserUI(
      user
    );


    renderThemeSettings(
      state.tema
    );


    if (
      window.JankinhoTheme &&
      typeof window.JankinhoTheme.setTheme === "function" &&
      window.JankinhoTheme.getTheme() !== state.tema
    ) {

      window.JankinhoTheme.setTheme(
        state.tema
      );

    }


    renderPetSettings();

    renderPetCustomization();


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


document
  .querySelectorAll("[data-pet-mode]")
  .forEach(function (button) {
    button.addEventListener("click", function () {
      setPetMode(
        button.getAttribute("data-pet-mode")
      );
    });
  });



document
  .querySelectorAll("[data-theme-choice]")
  .forEach(function (button) {
    button.addEventListener("click", function () {
      setThemeFromSettings(
        button.getAttribute("data-theme-choice")
      );
    });
  });


document
  .querySelectorAll("[data-pet-color]")
  .forEach(function (button) {
    button.addEventListener("click", function () {
      const profile = getPetProfile();
      profile.color = button.getAttribute("data-pet-color");
      savePetProfile(profile);
      showMessage("Cor do pet atualizada.");
    });
  });


document
  .querySelectorAll("[data-pet-outfit]")
  .forEach(function (button) {
    button.addEventListener("click", function () {
      const profile = getPetProfile();
      profile.outfit = button.getAttribute("data-pet-outfit");
      savePetProfile(profile);
      showMessage("Estilo do pet atualizado.");
    });
  });


$("petNameSave")?.addEventListener("click", function () {
  const profile = getPetProfile();
  profile.name = $("petNameSetting") ? $("petNameSetting").value : "";
  savePetProfile(profile);
  showMessage("Nome do pet salvo.");
});


$("petNameSetting")?.addEventListener("keydown", function (event) {
  if (event.key !== "Enter") {
    return;
  }

  event.preventDefault();
  $("petNameSave")?.click();
});


if (
  window.JankinhoTheme &&
  typeof window.JankinhoTheme.subscribe === "function"
) {
  window.JankinhoTheme.subscribe(function (theme) {
    renderThemeSettings(theme);
  });
}
