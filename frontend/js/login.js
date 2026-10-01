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


function resetCortexIntroSession() {

  try {

    const keys =
      [];


    for (
      let index = 0;
      index < sessionStorage.length;
      index += 1
    ) {

      const key =
        sessionStorage.key(
          index
        );


      if (
        key &&
        (
          key ===
            "cortexDesktopIntroSeen" ||
          key.startsWith(
            "cortexPageIntroSeen:"
          )
        )
      ) {

        keys.push(
          key
        );

      }

    }


    keys.forEach(
      function (
        key
      ) {

        sessionStorage.removeItem(
          key
        );

      }
    );

  }
  catch (
    error
  ) {

    /*
     * O login continua normalmente mesmo
     * se o navegador bloquear sessionStorage.
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


      resetCortexIntroSession();


      window.location.href = "/app";

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
