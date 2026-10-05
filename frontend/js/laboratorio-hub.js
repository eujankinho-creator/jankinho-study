(function () {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }

  async function api(url, options) {
    const response = await fetch(url, Object.assign({
      credentials: "same-origin"
    }, options || {}));

    if (response.status === 401) {
      location.href = "/login.html";
      throw new Error("Não autenticado.");
    }

    if (!response.ok) {
      throw new Error("Falha ao carregar o laboratório.");
    }

    return response.json();
  }

  async function loadUser() {
    const data = await api("/api/auth/me");
    const user = data.usuario || {};
    const name = user.nome || "Usuário";
    const initial = name.charAt(0).toUpperCase();

    if ($("nomeSidebar")) $("nomeSidebar").textContent = name;
    if ($("emailSidebar")) $("emailSidebar").textContent = user.email || "";
    if ($("nomeHeader")) $("nomeHeader").textContent = name;
    if ($("avatarSidebar")) $("avatarSidebar").textContent = initial;
    if ($("avatarHeader")) $("avatarHeader").textContent = initial;
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

  loadUser().catch(function (error) {
    console.error(error);
  });

  if ($("logoutSidebar")) {
    $("logoutSidebar").addEventListener("click", logout);
  }
})();