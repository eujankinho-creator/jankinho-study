(function () {

  "use strict";


  /* =========================================================
     PASSWORD TOGGLE
  ========================================================= */

  const toggles =
    document.querySelectorAll(
      "[data-password-target]"
    );


  toggles.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const id =
            button.getAttribute(
              "data-password-target"
            );


          const input =
            document.getElementById(
              id
            );


          if (!input) {
            return;
          }


          const visible =
            input.type ===
            "text";


          input.type =
            visible
              ? "password"
              : "text";


          button.textContent =
            visible
              ? "Ver"
              : "Ocultar";


          button.setAttribute(
            "aria-label",
            visible
              ? "Mostrar senha"
              : "Ocultar senha"
          );

        }
      );

    }
  );


  /* =========================================================
     SUBTLE POINTER LIGHT
  ========================================================= */

  const shell =
    document.querySelector(
      ".auth-shell"
    );


  if (
    shell &&
    window.matchMedia(
      "(pointer: fine)"
    ).matches
  ) {

    shell.addEventListener(
      "pointermove",
      function (event) {

        const rect =
          shell.getBoundingClientRect();


        const x =
          (
            event.clientX -
            rect.left
          ) /
          rect.width;


        const y =
          (
            event.clientY -
            rect.top
          ) /
          rect.height;


        shell.style.setProperty(
          "--pointer-x",
          `${x * 100}%`
        );


        shell.style.setProperty(
          "--pointer-y",
          `${y * 100}%`
        );

      }
    );

  }


  /* =========================================================
     INPUT ERROR CLEANUP
  ========================================================= */

  const errorBox =
    document.getElementById(
      "erro"
    );


  const inputs =
    document.querySelectorAll(
      ".input"
    );


  inputs.forEach(
    function (input) {

      input.addEventListener(
        "input",
        function () {

          if (
            errorBox &&
            errorBox.classList.contains(
              "visible"
            )
          ) {

            errorBox.classList.remove(
              "visible"
            );

          }

        }
      );

    }
  );

})();