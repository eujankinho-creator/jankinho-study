(function () {
  "use strict";

  async function api(url, options) {
    var response = await fetch(url, Object.assign({
      credentials: "same-origin"
    }, options || {}));

    if (response.status === 401) {
      location.href = "/login.html";
      throw new Error("Não autenticado.");
    }

    var data = await response.json().catch(function () { return {}; });

    if (!response.ok) {
      throw new Error(data.error || "Erro na requisição.");
    }

    return data;
  }

  async function loadUser() {
    try {
      var data = await api("/api/auth/me");
      var user = data.usuario || {};
      var name = user.nome || "Cortex";
      var initial = name.charAt(0).toUpperCase();

      var nomeSidebar = document.getElementById("nomeSidebar");
      var emailSidebar = document.getElementById("emailSidebar");
      var nomeHeader = document.getElementById("nomeHeader");
      var avatarSidebar = document.getElementById("avatarSidebar");
      var avatarHeader = document.getElementById("avatarHeader");

      if (nomeSidebar) nomeSidebar.textContent = name;
      if (emailSidebar) emailSidebar.textContent = user.email || "";
      if (nomeHeader) nomeHeader.textContent = name;
      if (avatarSidebar) avatarSidebar.textContent = initial;
      if (avatarHeader) avatarHeader.textContent = initial;
    } catch (error) {
      console.error(error);
    }
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

  document.addEventListener("DOMContentLoaded", function () {
    loadUser();
    var logoutButton = document.getElementById("logoutSidebar");
    if (logoutButton) logoutButton.addEventListener("click", logout);
  }, { once: true });
})();