const form =
  document.getElementById("loginForm");

const emailInput =
  document.getElementById("email");

const senhaInput =
  document.getElementById("senha");

const erroBox =
  document.getElementById("erro");

const entrarBtn =
  document.getElementById("entrarBtn");


function mostrarErro(mensagem) {

  erroBox.textContent =
    mensagem;

  erroBox.classList.add(
    "visible"
  );

}


function limparErro() {

  erroBox.textContent = "";

  erroBox.classList.remove(
    "visible"
  );

}



function accountThemeKey(email) {
  return "cortex_account_theme_v1:" + String(email || "").trim().toLowerCase();
}

function applyRememberedAccountTheme(email) {
  try {
    const remembered = localStorage.getItem(accountThemeKey(email));
    if (!remembered) return;

    if (window.JankinhoTheme && typeof window.JankinhoTheme.setTheme === "function") {
      window.JankinhoTheme.setTheme(remembered);
    } else {
      document.documentElement.setAttribute("data-theme", remembered);
      localStorage.setItem("jankinho_theme_v1", remembered);
    }
  } catch {}
}

emailInput.addEventListener("change", function () {
  applyRememberedAccountTheme(emailInput.value);
});

emailInput.addEventListener("blur", function () {
  applyRememberedAccountTheme(emailInput.value);
});


function prepareDashboardAfterLogin(
  theme
) {

  try {

    /*
     * A intro do Dashboard pertence ao login atual.
     * O preenchimento automatico/salvamento de senha
     * nao interfere mais nessa marcacao.
     */
    sessionStorage.removeItem(
      "cortexDesktopIntroSeen"
    );


    sessionStorage.removeItem(
      "cortex_auth_me_v1"
    );


    sessionStorage.removeItem(
      "cortex_timer_key_v1"
    );

    sessionStorage.setItem(
      "cortexDashboardFreshLogin",
      "1"
    );


    /*
     * Sempre inicia um novo login no Dashboard.
     * Evita restaurar uma janela antiga antes da intro.
     */
    localStorage.removeItem(
      "cortex_shell_last_view"
    );


    if (theme) {

      localStorage.setItem(
        "jankinho_theme_v1",
        theme
      );

    }

  }
  catch (
    error
  ) {

    /*
     * Se o navegador bloquear storage,
     * o login continua normalmente.
     */

  }

}

form.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();

    const email =
      emailInput.value.trim();

    const senha =
      senhaInput.value;


    if (!email || !senha) {

      mostrarErro(
        "Preencha seu e-mail e sua senha."
      );

      return;
    }


    try {

      limparErro();

      entrarBtn.disabled =
        true;

      entrarBtn.textContent =
        "Entrando...";


      const resposta =
        await fetch(
          "/api/auth/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({
                email,
                senha
              })
          }
        );


      const dados =
        await resposta.json();


      if (!resposta.ok) {

        throw new Error(
          dados.error ||
          "Não foi possível entrar."
        );

      }


      const accountTheme =
        dados &&
        dados.usuario
          ? dados.usuario.tema
          : null;


      try {
        if (dados && dados.usuario) {
          sessionStorage.setItem(
            "cortex_user_profile_v3",
            JSON.stringify({
              nome: dados.usuario.nome || "Usuario",
              email: dados.usuario.email || email,
              fotoPerfil: dados.usuario.fotoPerfil || null
            })
          );

          if (accountTheme) {
            localStorage.setItem(
              accountThemeKey(dados.usuario.email || email),
              accountTheme
            );
          }
        }
      } catch {}


      prepareDashboardAfterLogin(
        accountTheme
      );


      /*
       * replace evita voltar para um estado intermediario
       * do formulario/autofill com o botao "Voltar".
       */
      window.location.replace(
        "/app"
      );

    }
    catch (error) {

      mostrarErro(
        error instanceof Error
          ? error.message
          : "Não foi possível entrar."
      );

    }
    finally {

      entrarBtn.disabled =
        false;

      entrarBtn.textContent =
        "Entrar na conta";

    }

  }
);
