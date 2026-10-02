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
