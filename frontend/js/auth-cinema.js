(function () {

  "use strict";


  const desktop =
    window.matchMedia(
      "(min-width: 901px)"
    );


  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );


  if (
    !desktop.matches ||
    reduceMotion.matches
  ) {
    return;
  }


  const stage =
    document.querySelector(
      ".auth-cinema-stage"
    );


  if (!stage) {
    return;
  }


  const glyphs =
    Array.from(
      stage.querySelectorAll(
        ".cinema-morph-glyph"
      )
    );


  if (!glyphs.length) {
    return;
  }


  let index =
    0;


  let timer =
    0;


  function morphOne() {

    if (
      document.hidden ||
      !glyphs.length
    ) {
      return;
    }


    const glyph =
      glyphs[
        index %
        glyphs.length
      ];


    index +=
      1;


    const showingNumber =
      glyph.dataset.state ===
        "number";


    const next =
      showingNumber
        ? glyph.dataset.from
        : glyph.dataset.to;


    glyph.classList.remove(
      "is-morphing"
    );


    void glyph.offsetWidth;


    glyph.classList.add(
      "is-morphing"
    );


    window.setTimeout(
      function () {

        glyph.textContent =
          next || "";


        glyph.dataset.state =
          showingNumber
            ? "letter"
            : "number";

      },
      350
    );


    window.setTimeout(
      function () {

        glyph.classList.remove(
          "is-morphing"
        );

      },
      760
    );

  }


  function schedule() {

    window.clearInterval(
      timer
    );


    timer =
      window.setInterval(
        morphOne,
        900
      );

  }


  function syncVisibility() {

    const paused =
      document.hidden;


    document.documentElement
      .classList.toggle(
        "cortex-cinema-paused",
        paused
      );


    if (paused) {

      window.clearInterval(
        timer
      );

    }
    else {

      schedule();

    }

  }


  document.addEventListener(
    "visibilitychange",
    syncVisibility,
    {
      passive:
        true,
    }
  );


  schedule();

})();
