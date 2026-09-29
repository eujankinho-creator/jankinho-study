const form =
  document.getElementById("cadastroForm");

const nomeInput =
  document.getElementById("nome");

const emailInput =
  document.getElementById("email");

const senhaInput =
  document.getElementById("senha");

const confirmarInput =
  document.getElementById("confirmarSenha");

const erroBox =
  document.getElementById("erro");

const cadastroBtn =
  document.getElementById("cadastroBtn");


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


form.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    const nome =
      nomeInput.value.trim();

    const email =
      emailInput.value.trim();

    const senha =
      senhaInput.value;

    const confirmarSenha =
      confirmarInput.value;


    if (
      !nome ||
      !email ||
      !senha ||
      !confirmarSenha
    ) {

      mostrarErro(
        "Preencha todos os campos."
      );

      return;
    }


    if (senha.length < 6) {

      mostrarErro(
        "A senha precisa ter pelo menos 6 caracteres."
      );

      return;
    }


    if (senha !== confirmarSenha) {

      mostrarErro(
        "As senhas nÃ£o coincidem."
      );

      return;
    }


    try {

      limparErro();

      cadastroBtn.disabled =
        true;

      cadastroBtn.textContent =
        "Criando conta...";


      const resposta =
        await fetch(
          "/api/auth/cadastro",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({
                nome,
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
          "NÃ£o foi possÃ­vel criar sua conta."
        );

      }


      window.location.href =
        "/login.html";

    }
    catch (error) {

      mostrarErro(
        error instanceof Error
          ? error.message
          : "NÃ£o foi possÃ­vel criar sua conta."
      );

    }
    finally {

      cadastroBtn.disabled =
        false;

      cadastroBtn.textContent =
        "Criar minha conta";

    }

  }
);
