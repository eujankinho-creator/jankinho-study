(function () {

  "use strict";


  const STORAGE_KEY =
    "cortex_whiteboard_infinite_v2";

  const LEGACY_KEY =
    "cortex_whiteboard_v1";

  const SETTINGS_KEY =
    "cortex_whiteboard_settings_v1";

  const MIN_ZOOM =
    0.15;

  const MAX_ZOOM =
    6;


  const canvas =
    document.getElementById(
      "boardCanvas"
    );

  const stage =
    document.getElementById(
      "boardStage"
    );

  const shell =
    document.getElementById(
      "whiteboardShell"
    );

  if (
    !canvas ||
    !stage ||
    !shell
  ) {

    return;

  }


  const ctx =
    canvas.getContext(
      "2d"
    );


  const state = {

    tool:
      "pen",

    color:
      "#f97316",

    size:
      4,

    background:
      "grid",

    fill:
      false,

    commands:
      [],

    redo:
      [],

    draft:
      null,

    drawing:
      false,

    panning:
      false,

    spacePressed:
      false,

    panStart:
      null,

    dpr:
      1,

    width:
      1,

    height:
      1,

    camera: {

      x:
        0,

      y:
        0,

      zoom:
        1

    }

  };


  const toolNames = {

    hand:
      "M\u00e3o",

    pen:
      "Caneta",

    highlighter:
      "Marca-texto",

    eraser:
      "Borracha",

    line:
      "Linha",

    arrow:
      "Seta",

    rect:
      "Ret\u00e2ngulo",

    circle:
      "C\u00edrculo",

    text:
      "Texto"

  };


  let saveTimer =
    null;


  function $(
    id
  ) {

    return document
      .getElementById(
        id
      );

  }


  function clamp(
    value,
    minimum,
    maximum
  ) {

    return Math.min(
      maximum,
      Math.max(
        minimum,
        value
      )
    );

  }


  function setStatus(
    message
  ) {

    const status =
      $("saveStatus");

    if (
      status
    ) {

      status.textContent =
        message;

    }

  }


  function injectNavigationControls() {

    const tools =
      document.querySelector(
        ".tools-group .toolbar-buttons"
      );


    if (
      tools &&
      !tools.querySelector(
        '[data-tool="hand"]'
      )
    ) {

      const hand =
        document.createElement(
          "button"
        );


      hand.type =
        "button";

      hand.className =
        "tool-button";

      hand.dataset.tool =
        "hand";

      hand.title =
        "Mover lousa (Espa\u00e7o)";

      hand.innerHTML =
        '<span class="tool-symbol">&#9995;</span>' +
        'M\u00e3o';


      tools.insertBefore(
        hand,
        tools.firstChild
      );

    }


    const toolbar =
      document.querySelector(
        ".whiteboard-toolbar"
      );


    if (
      toolbar &&
      !$(
        "zoomToolbar"
      )
    ) {

      const group =
        document.createElement(
          "div"
        );


      group.id =
        "zoomToolbar";

      group.className =
        "toolbar-group zoom-toolbar";


      group.innerHTML = `
        <span class="toolbar-label">
          Navega\u00e7\u00e3o
        </span>

        <div class="toolbar-buttons compact">

          <button
            id="zoomOutBoard"
            class="tool-button zoom-button"
            type="button"
            title="Diminuir zoom"
          >
            &minus;
          </button>

          <button
            id="zoomPercentBoard"
            class="tool-button zoom-percent"
            type="button"
            title="Voltar para 100%"
          >
            100%
          </button>

          <button
            id="zoomInBoard"
            class="tool-button zoom-button"
            type="button"
            title="Aumentar zoom"
          >
            +
          </button>

          <button
            id="fitBoard"
            class="tool-button"
            type="button"
            title="Enquadrar todo o conteudo"
          >
            Enquadrar
          </button>

          <button
            id="originBoard"
            class="tool-button"
            type="button"
            title="Voltar para a origem"
          >
            Origem
          </button>

        </div>
      `;


      const history =
        toolbar.querySelector(
          ".toolbar-history"
        );


      if (
        history
      ) {

        toolbar.insertBefore(
          group,
          history
        );

      }
      else {

        toolbar.appendChild(
          group
        );

      }

    }

  }


  function saveNow() {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({

          version:
            2,

          background:
            state.background,

          commands:
            state.commands,

          camera: {

            x:
              state.camera.x,

            y:
              state.camera.y,

            zoom:
              state.camera.zoom

          }

        })
      );


      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({

          tool:
            state.tool,

          color:
            state.color,

          size:
            state.size,

          fill:
            state.fill

        })
      );


      setStatus(
        "Salva automaticamente"
      );

    }
    catch (
      error
    ) {

      console.error(
        error
      );


      setStatus(
        "Erro ao salvar"
      );

    }

  }


  function queueSave() {

    window.clearTimeout(
      saveTimer
    );


    setStatus(
      "Salvando..."
    );


    saveTimer =
      window.setTimeout(
        saveNow,
        280
      );

  }


  function migratePoint(
    point
  ) {

    return {

      x:
        Number(
          point?.x || 0
        ) *
        state.width,

      y:
        Number(
          point?.y || 0
        ) *
        state.height

    };

  }


  function migrateLegacyCommand(
    command
  ) {

    const migrated = {
      ...command
    };


    if (
      Array.isArray(
        command.points
      )
    ) {

      migrated.points =
        command.points.map(
          migratePoint
        );

    }


    if (
      command.start
    ) {

      migrated.start =
        migratePoint(
          command.start
        );

    }


    if (
      command.end
    ) {

      migrated.end =
        migratePoint(
          command.end
        );

    }


    if (
      command.position
    ) {

      migrated.position =
        migratePoint(
          command.position
        );

    }


    return migrated;

  }


  function loadSaved() {

    try {

      const saved =
        JSON.parse(
          localStorage.getItem(
            STORAGE_KEY
          ) ||
          "null"
        );


      if (
        saved &&
        Array.isArray(
          saved.commands
        )
      ) {

        state.commands =
          saved.commands;


        if (
          saved.background
        ) {

          state.background =
            saved.background;

        }


        if (
          saved.camera
        ) {

          state.camera.x =
            Number(
              saved.camera.x
            ) ||
            0;


          state.camera.y =
            Number(
              saved.camera.y
            ) ||
            0;


          state.camera.zoom =
            clamp(
              Number(
                saved.camera.zoom
              ) ||
              1,
              MIN_ZOOM,
              MAX_ZOOM
            );

        }

      }
      else {

        const legacy =
          JSON.parse(
            localStorage.getItem(
              LEGACY_KEY
            ) ||
            "null"
          );


        if (
          legacy &&
          Array.isArray(
            legacy.commands
          )
        ) {

          state.commands =
            legacy.commands.map(
              migrateLegacyCommand
            );


          if (
            legacy.background
          ) {

            state.background =
              legacy.background;

          }


          saveNow();

        }

      }


      const settings =
        JSON.parse(
          localStorage.getItem(
            SETTINGS_KEY
          ) ||
          "null"
        );


      if (
        settings
      ) {

        if (
          settings.tool &&
          toolNames[
            settings.tool
          ]
        ) {

          state.tool =
            settings.tool;

        }


        if (
          settings.color
        ) {

          state.color =
            settings.color;

        }


        if (
          Number(
            settings.size
          )
        ) {

          state.size =
            Number(
              settings.size
            );

        }


        state.fill =
          Boolean(
            settings.fill
          );

      }

    }
    catch (
      error
    ) {

      console.error(
        error
      );

    }

  }


  function screenPoint(
    event
  ) {

    const rect =
      canvas
        .getBoundingClientRect();


    return {

      x:
        event.clientX -
        rect.left,

      y:
        event.clientY -
        rect.top

    };

  }


  function screenToWorld(
    x,
    y
  ) {

    return {

      x:
        state.camera.x +
        x /
        state.camera.zoom,

      y:
        state.camera.y +
        y /
        state.camera.zoom

    };

  }


  function worldPoint(
    event
  ) {

    const screen =
      screenPoint(
        event
      );


    return screenToWorld(
      screen.x,
      screen.y
    );

  }


  function clearCanvas() {

    ctx.setTransform(
      1,
      0,
      0,
      1,
      0,
      0
    );


    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

  }


  function applyCamera() {

    const zoom =
      state.camera.zoom;


    ctx.setTransform(

      state.dpr *
      zoom,

      0,

      0,

      state.dpr *
      zoom,

      -state.camera.x *
      state.dpr *
      zoom,

      -state.camera.y *
      state.dpr *
      zoom

    );

  }


  function setupContext(
    context
  ) {

    context.lineCap =
      "round";

    context.lineJoin =
      "round";

  }


  function drawStroke(
    command,
    context
  ) {

    if (
      !Array.isArray(
        command.points
      ) ||
      command.points.length ===
      0
    ) {

      return;

    }


    context.save();

    setupContext(
      context
    );


    if (
      command.type ===
      "eraser"
    ) {

      context.globalCompositeOperation =
        "destination-out";

      context.globalAlpha =
        1;

      context.strokeStyle =
        "#000";

      context.lineWidth =
        Math.max(
          8,
          command.size *
          3.5
        );

    }
    else if (
      command.type ===
      "highlighter"
    ) {

      context.globalCompositeOperation =
        "source-over";

      context.globalAlpha =
        .25;

      context.strokeStyle =
        command.color;

      context.lineWidth =
        Math.max(
          8,
          command.size *
          4
        );

    }
    else {

      context.globalCompositeOperation =
        "source-over";

      context.globalAlpha =
        1;

      context.strokeStyle =
        command.color;

      context.lineWidth =
        command.size;

    }


    context.beginPath();


    const first =
      command.points[0];


    context.moveTo(
      first.x,
      first.y
    );


    for (
      let index = 1;
      index <
      command.points.length;
      index++
    ) {

      const point =
        command.points[
          index
        ];


      context.lineTo(
        point.x,
        point.y
      );

    }


    if (
      command.points.length ===
      1
    ) {

      context.lineTo(
        first.x + .1,
        first.y + .1
      );

    }


    context.stroke();

    context.restore();

  }


  function drawArrow(
    context,
    start,
    end,
    size
  ) {

    const angle =
      Math.atan2(
        end.y -
        start.y,
        end.x -
        start.x
      );


    const head =
      Math.max(
        10,
        size * 4
      );


    context.beginPath();

    context.moveTo(
      start.x,
      start.y
    );

    context.lineTo(
      end.x,
      end.y
    );

    context.stroke();


    context.beginPath();

    context.moveTo(
      end.x,
      end.y
    );


    context.lineTo(

      end.x -
      head *
      Math.cos(
        angle -
        Math.PI / 6
      ),

      end.y -
      head *
      Math.sin(
        angle -
        Math.PI / 6
      )

    );


    context.moveTo(
      end.x,
      end.y
    );


    context.lineTo(

      end.x -
      head *
      Math.cos(
        angle +
        Math.PI / 6
      ),

      end.y -
      head *
      Math.sin(
        angle +
        Math.PI / 6
      )

    );


    context.stroke();

  }


  function drawShape(
    command,
    context
  ) {

    const start =
      command.start;

    const end =
      command.end;


    if (
      !start ||
      !end
    ) {

      return;

    }


    const x =
      Math.min(
        start.x,
        end.x
      );


    const y =
      Math.min(
        start.y,
        end.y
      );


    const width =
      Math.abs(
        end.x -
        start.x
      );


    const height =
      Math.abs(
        end.y -
        start.y
      );


    context.save();

    setupContext(
      context
    );


    context.globalCompositeOperation =
      "source-over";

    context.globalAlpha =
      1;

    context.strokeStyle =
      command.color;

    context.fillStyle =
      command.color;

    context.lineWidth =
      command.size;


    if (
      command.type ===
      "line"
    ) {

      context.beginPath();

      context.moveTo(
        start.x,
        start.y
      );

      context.lineTo(
        end.x,
        end.y
      );

      context.stroke();

    }


    if (
      command.type ===
      "arrow"
    ) {

      drawArrow(
        context,
        start,
        end,
        command.size
      );

    }


    if (
      command.type ===
      "rect"
    ) {

      if (
        command.fill
      ) {

        context.save();

        context.globalAlpha =
          .14;

        context.fillRect(
          x,
          y,
          width,
          height
        );

        context.restore();

      }


      context.strokeRect(
        x,
        y,
        width,
        height
      );

    }


    if (
      command.type ===
      "circle"
    ) {

      context.beginPath();


      context.ellipse(

        x +
        width / 2,

        y +
        height / 2,

        Math.max(
          1,
          width / 2
        ),

        Math.max(
          1,
          height / 2
        ),

        0,
        0,
        Math.PI * 2

      );


      if (
        command.fill
      ) {

        context.save();

        context.globalAlpha =
          .14;

        context.fill();

        context.restore();

      }


      context.stroke();

    }


    context.restore();

  }


  function drawText(
    command,
    context
  ) {

    if (
      !command.position
    ) {

      return;

    }


    const fontSize =
      command.fontSize ||
      Math.max(
        16,
        command.size *
        4
      );


    context.save();


    context.globalCompositeOperation =
      "source-over";

    context.globalAlpha =
      1;

    context.fillStyle =
      command.color;

    context.font =
      "700 " +
      fontSize +
      "px Inter, Arial, sans-serif";

    context.textBaseline =
      "top";


    const words =
      String(
        command.text ||
        ""
      )
        .split(
          /\s+/
        );


    const maxWidth =
      420;


    let line =
      "";

    let y =
      command.position.y;


    words.forEach(
      function (
        word
      ) {

        const test =
          line
            ? line +
              " " +
              word
            : word;


        if (
          context
            .measureText(
              test
            )
            .width >
          maxWidth &&
          line
        ) {

          context.fillText(
            line,
            command.position.x,
            y
          );


          line =
            word;


          y +=
            fontSize *
            1.25;

        }
        else {

          line =
            test;

        }

      }
    );


    if (
      line
    ) {

      context.fillText(
        line,
        command.position.x,
        y
      );

    }


    context.restore();

  }


  function drawCommand(
    command,
    context
  ) {

    if (
      command.type ===
      "pen" ||
      command.type ===
      "highlighter" ||
      command.type ===
      "eraser"
    ) {

      drawStroke(
        command,
        context
      );

      return;

    }


    if (
      command.type ===
      "text"
    ) {

      drawText(
        command,
        context
      );

      return;

    }


    drawShape(
      command,
      context
    );

  }


  function gridWorldStep() {

    let worldStep =
      28;


    while (
      worldStep *
      state.camera.zoom <
      16
    ) {

      worldStep *=
        5;

    }


    return worldStep;

  }


  function updateInfiniteBackground() {

    const background =
      state.background;


    const zoom =
      state.camera.zoom;


    const worldStep =
      gridWorldStep();


    const step =
      worldStep *
      zoom;


    const x =
      (
        -state.camera.x *
        zoom
      ) %
      step;


    const y =
      (
        -state.camera.y *
        zoom
      ) %
      step;


    stage.style
      .backgroundPosition =
      x +
      "px " +
      y +
      "px";


    if (
      background ===
      "blank"
    ) {

      stage.style.backgroundColor =
        "#ffffff";

      stage.style.backgroundImage =
        "none";

      return;

    }


    if (
      background ===
      "dark"
    ) {

      stage.style.backgroundColor =
        "#090b10";


      stage.style.backgroundImage =
        "linear-gradient(" +
        "rgba(255,255,255,.055) 1px," +
        "transparent 1px)," +
        "linear-gradient(90deg," +
        "rgba(255,255,255,.055) 1px," +
        "transparent 1px)";


      stage.style.backgroundSize =
        step +
        "px " +
        step +
        "px";

      return;

    }


    stage.style.backgroundColor =
      "#ffffff";


    if (
      background ===
      "dots"
    ) {

      stage.style.backgroundImage =
        "radial-gradient(" +
        "#c9cbd1 1.3px," +
        "transparent 1.3px)";


      stage.style.backgroundSize =
        step +
        "px " +
        step +
        "px";

      return;

    }


    if (
      background ===
      "lines"
    ) {

      stage.style.backgroundImage =
        "linear-gradient(" +
        "#e1e3e8 1px," +
        "transparent 1px)";


      stage.style.backgroundSize =
        "100% " +
        step +
        "px";

      return;

    }


    stage.style.backgroundImage =
      "linear-gradient(" +
      "#e8e8ec 1px," +
      "transparent 1px)," +
      "linear-gradient(90deg," +
      "#e8e8ec 1px," +
      "transparent 1px)";


    stage.style.backgroundSize =
      step +
      "px " +
      step +
      "px";

  }


  function render() {

    clearCanvas();

    applyCamera();


    state.commands
      .forEach(
        function (
          command
        ) {

          drawCommand(
            command,
            ctx
          );

        }
      );


    if (
      state.draft
    ) {

      drawCommand(
        state.draft,
        ctx
      );

    }


    updateInfiniteBackground();


    const empty =
      $("boardEmpty");


    if (
      empty
    ) {

      empty.classList
        .toggle(
          "hidden",
          state.commands.length >
          0 ||
          Boolean(
            state.draft
          )
        );

    }


    updateZoomInterface();

  }


  function resizeCanvas() {

    const rect =
      stage
        .getBoundingClientRect();


    state.width =
      Math.max(
        1,
        rect.width
      );


    state.height =
      Math.max(
        1,
        rect.height
      );


    state.dpr =
      Math.min(
        window.devicePixelRatio ||
        1,
        2
      );


    canvas.width =
      Math.round(
        state.width *
        state.dpr
      );


    canvas.height =
      Math.round(
        state.height *
        state.dpr
      );


    canvas.style.width =
      state.width +
      "px";

    canvas.style.height =
      state.height +
      "px";


    render();

  }


  function updateZoomInterface() {

    const percent =
      $("zoomPercentBoard");


    if (
      percent
    ) {

      percent.textContent =
        Math.round(
          state.camera.zoom *
          100
        ) +
        "%";

    }

  }


  function syncInterface() {

    stage.dataset.background =
      state.background;

    stage.dataset.tool =
      state.tool;


    document
      .querySelectorAll(
        ".tool-button[data-tool]"
      )
      .forEach(
        function (
          button
        ) {

          button.classList
            .toggle(
              "active",
              button.dataset.tool ===
              state.tool
            );

        }
      );


    document
      .querySelectorAll(
        ".color-chip"
      )
      .forEach(
        function (
          chip
        ) {

          chip.classList
            .toggle(
              "active",
              chip.dataset.color
                .toLowerCase() ===
              state.color
                .toLowerCase()
            );

        }
      );


    if (
      $("colorPicker")
    ) {

      $("colorPicker").value =
        state.color;

    }


    if (
      $("brushSize")
    ) {

      $("brushSize").value =
        state.size;

    }


    if (
      $("brushSizeValue")
    ) {

      $("brushSizeValue")
        .textContent =
        state.size;

    }


    if (
      $("backgroundSelect")
    ) {

      $("backgroundSelect").value =
        state.background;

    }


    if (
      $("fillShapes")
    ) {

      $("fillShapes").checked =
        state.fill;

    }


    if (
      $("currentToolLabel")
    ) {

      $("currentToolLabel")
        .textContent =
        toolNames[
          state.tool
        ] ||
        state.tool;

    }


    updateZoomInterface();

    updateInfiniteBackground();

  }


  function selectTool(
    tool
  ) {

    if (
      !toolNames[
        tool
      ]
    ) {

      return;

    }


    state.tool =
      tool;


    syncInterface();

    queueSave();

  }


  function selectColor(
    color
  ) {

    state.color =
      color;


    syncInterface();

    queueSave();

  }


  function setZoomAt(
    nextZoom,
    screenX,
    screenY
  ) {

    const oldZoom =
      state.camera.zoom;


    const zoom =
      clamp(
        nextZoom,
        MIN_ZOOM,
        MAX_ZOOM
      );


    const worldX =
      state.camera.x +
      screenX /
      oldZoom;


    const worldY =
      state.camera.y +
      screenY /
      oldZoom;


    state.camera.zoom =
      zoom;


    state.camera.x =
      worldX -
      screenX /
      zoom;


    state.camera.y =
      worldY -
      screenY /
      zoom;


    render();

    queueSave();

  }


  function zoomCenter(
    factor
  ) {

    setZoomAt(

      state.camera.zoom *
      factor,

      state.width /
      2,

      state.height /
      2

    );

  }


  function resetZoom() {

    setZoomAt(

      1,

      state.width /
      2,

      state.height /
      2

    );

  }


  function resetOrigin() {

    state.camera.x =
      0;

    state.camera.y =
      0;

    state.camera.zoom =
      1;


    render();

    queueSave();

  }


  function includeBounds(
    bounds,
    x,
    y
  ) {

    bounds.minX =
      Math.min(
        bounds.minX,
        x
      );


    bounds.minY =
      Math.min(
        bounds.minY,
        y
      );


    bounds.maxX =
      Math.max(
        bounds.maxX,
        x
      );


    bounds.maxY =
      Math.max(
        bounds.maxY,
        y
      );

  }


  function commandBounds() {

    const bounds = {

      minX:
        Infinity,

      minY:
        Infinity,

      maxX:
        -Infinity,

      maxY:
        -Infinity

    };


    state.commands
      .forEach(
        function (
          command
        ) {

          if (
            Array.isArray(
              command.points
            )
          ) {

            command.points
              .forEach(
                function (
                  point
                ) {

                  includeBounds(
                    bounds,
                    point.x,
                    point.y
                  );

                }
              );

          }


          if (
            command.start
          ) {

            includeBounds(
              bounds,
              command.start.x,
              command.start.y
            );

          }


          if (
            command.end
          ) {

            includeBounds(
              bounds,
              command.end.x,
              command.end.y
            );

          }


          if (
            command.position
          ) {

            includeBounds(
              bounds,
              command.position.x,
              command.position.y
            );


            includeBounds(

              bounds,

              command.position.x +
              350,

              command.position.y +
              100

            );

          }

        }
      );


    if (
      bounds.minX ===
      Infinity
    ) {

      return null;

    }


    return bounds;

  }


  function fitContent() {

    const bounds =
      commandBounds();


    if (
      !bounds
    ) {

      resetOrigin();

      return;

    }


    const margin =
      90;


    const contentWidth =
      Math.max(
        100,
        bounds.maxX -
        bounds.minX
      );


    const contentHeight =
      Math.max(
        100,
        bounds.maxY -
        bounds.minY
      );


    const zoomX =
      (
        state.width -
        margin * 2
      ) /
      contentWidth;


    const zoomY =
      (
        state.height -
        margin * 2
      ) /
      contentHeight;


    state.camera.zoom =
      clamp(
        Math.min(
          zoomX,
          zoomY,
          2.5
        ),
        MIN_ZOOM,
        MAX_ZOOM
      );


    const centerX =
      (
        bounds.minX +
        bounds.maxX
      ) /
      2;


    const centerY =
      (
        bounds.minY +
        bounds.maxY
      ) /
      2;


    state.camera.x =
      centerX -
      state.width /
      (
        2 *
        state.camera.zoom
      );


    state.camera.y =
      centerY -
      state.height /
      (
        2 *
        state.camera.zoom
      );


    render();

    queueSave();

  }


  function beginPan(
    event
  ) {

    state.panning =
      true;


    state.panStart = {

      clientX:
        event.clientX,

      clientY:
        event.clientY,

      cameraX:
        state.camera.x,

      cameraY:
        state.camera.y

    };


    stage.classList.add(
      "is-panning"
    );


    try {

      canvas.setPointerCapture(
        event.pointerId
      );

    }
    catch (
      error
    ) {}

  }


  function movePan(
    event
  ) {

    if (
      !state.panning ||
      !state.panStart
    ) {

      return;

    }


    const deltaX =
      event.clientX -
      state.panStart.clientX;


    const deltaY =
      event.clientY -
      state.panStart.clientY;


    state.camera.x =
      state.panStart.cameraX -
      deltaX /
      state.camera.zoom;


    state.camera.y =
      state.panStart.cameraY -
      deltaY /
      state.camera.zoom;


    render();

  }


  function endPan() {

    if (
      !state.panning
    ) {

      return;

    }


    state.panning =
      false;

    state.panStart =
      null;


    stage.classList.remove(
      "is-panning"
    );


    queueSave();

  }


  function commitDraft() {

    if (
      !state.draft
    ) {

      return;

    }


    state.commands.push(
      state.draft
    );


    state.draft =
      null;

    state.redo =
      [];


    render();

    queueSave();

  }


  function pointerDown(
    event
  ) {

    const wantsPan =
      state.tool ===
      "hand" ||
      event.button ===
      1 ||
      (
        state.spacePressed &&
        event.button ===
        0
      );


    if (
      wantsPan
    ) {

      event.preventDefault();

      beginPan(
        event
      );

      return;

    }


    if (
      event.pointerType ===
      "mouse" &&
      event.button !==
      0
    ) {

      return;

    }


    event.preventDefault();


    const point =
      worldPoint(
        event
      );


    if (
      state.tool ===
      "text"
    ) {

      const text =
        window.prompt(
          "Digite o texto para adicionar na lousa:"
        );


      if (
        text &&
        text.trim()
      ) {

        state.commands.push({

          type:
            "text",

          text:
            text.trim(),

          position:
            point,

          color:
            state.color,

          size:
            state.size,

          fontSize:
            Math.max(
              16,
              state.size *
              4
            )

        });


        state.redo =
          [];


        render();

        queueSave();

      }


      return;

    }


    state.drawing =
      true;


    try {

      canvas.setPointerCapture(
        event.pointerId
      );

    }
    catch (
      error
    ) {}


    if (
      state.tool ===
      "pen" ||
      state.tool ===
      "highlighter" ||
      state.tool ===
      "eraser"
    ) {

      state.draft = {

        type:
          state.tool,

        points: [
          point
        ],

        color:
          state.color,

        size:
          state.size

      };

    }
    else {

      state.draft = {

        type:
          state.tool,

        start:
          point,

        end:
          point,

        color:
          state.color,

        size:
          state.size,

        fill:
          state.fill

      };

    }


    render();

  }


  function pointerMove(
    event
  ) {

    if (
      state.panning
    ) {

      event.preventDefault();

      movePan(
        event
      );

      return;

    }


    if (
      !state.drawing ||
      !state.draft
    ) {

      return;

    }


    event.preventDefault();


    const point =
      worldPoint(
        event
      );


    if (
      Array.isArray(
        state.draft.points
      )
    ) {

      const last =
        state.draft.points[
          state.draft.points.length -
          1
        ];


      const distance =
        Math.hypot(

          point.x -
          last.x,

          point.y -
          last.y

        ) *
        state.camera.zoom;


      if (
        distance >
        1.3
      ) {

        state.draft
          .points
          .push(
            point
          );

      }

    }
    else {

      state.draft.end =
        point;

    }


    render();

  }


  function pointerUp(
    event
  ) {

    if (
      state.panning
    ) {

      event.preventDefault();

      endPan();

      return;

    }


    if (
      !state.drawing
    ) {

      return;

    }


    event.preventDefault();


    state.drawing =
      false;


    commitDraft();

  }


  function wheelBoard(
    event
  ) {

    const point =
      screenPoint(
        event
      );


    if (
      event.ctrlKey ||
      event.metaKey
    ) {

      event.preventDefault();


      const factor =
        Math.exp(
          -event.deltaY *
          .0017
        );


      setZoomAt(

        state.camera.zoom *
        factor,

        point.x,

        point.y

      );


      return;

    }


    event.preventDefault();


    if (
      event.shiftKey
    ) {

      state.camera.x +=
        event.deltaY /
        state.camera.zoom;

    }
    else {

      state.camera.x +=
        event.deltaX /
        state.camera.zoom;


      state.camera.y +=
        event.deltaY /
        state.camera.zoom;

    }


    render();

    queueSave();

  }


  function undo() {

    if (
      state.commands.length ===
      0
    ) {

      return;

    }


    state.redo.push(
      state.commands.pop()
    );


    render();

    queueSave();

  }


  function redo() {

    if (
      state.redo.length ===
      0
    ) {

      return;

    }


    state.commands.push(
      state.redo.pop()
    );


    render();

    queueSave();

  }


  function clearBoard() {

    if (
      state.commands.length ===
      0
    ) {

      return;

    }


    if (
      !window.confirm(
        "Apagar todo o conteudo da lousa?"
      )
    ) {

      return;

    }


    state.commands =
      [];

    state.redo =
      [];


    render();

    saveNow();

  }


  function drawExportBackground(
    context,
    width,
    height
  ) {

    const dark =
      state.background ===
      "dark";


    context.fillStyle =
      dark
        ? "#090b10"
        : "#ffffff";


    context.fillRect(
      0,
      0,
      width,
      height
    );


    if (
      state.background ===
      "blank"
    ) {

      return;

    }


    let worldStep =
      gridWorldStep();


    let step =
      worldStep *
      state.camera.zoom;


    const offsetX =
      (
        -state.camera.x *
        state.camera.zoom
      ) %
      step;


    const offsetY =
      (
        -state.camera.y *
        state.camera.zoom
      ) %
      step;


    if (
      state.background ===
      "grid" ||
      state.background ===
      "dark"
    ) {

      context.strokeStyle =
        dark
          ? "rgba(255,255,255,.07)"
          : "#e8e8ec";


      context.lineWidth =
        1;


      for (
        let x = offsetX;
        x <= width;
        x += step
      ) {

        context.beginPath();

        context.moveTo(
          x,
          0
        );

        context.lineTo(
          x,
          height
        );

        context.stroke();

      }


      for (
        let y = offsetY;
        y <= height;
        y += step
      ) {

        context.beginPath();

        context.moveTo(
          0,
          y
        );

        context.lineTo(
          width,
          y
        );

        context.stroke();

      }

    }


    if (
      state.background ===
      "lines"
    ) {

      context.strokeStyle =
        "#e1e3e8";


      for (
        let y = offsetY;
        y <= height;
        y += step
      ) {

        context.beginPath();

        context.moveTo(
          0,
          y
        );

        context.lineTo(
          width,
          y
        );

        context.stroke();

      }

    }


    if (
      state.background ===
      "dots"
    ) {

      context.fillStyle =
        "#c9cbd1";


      for (
        let x = offsetX;
        x <= width;
        x += step
      ) {

        for (
          let y = offsetY;
          y <= height;
          y += step
        ) {

          context.beginPath();

          context.arc(
            x,
            y,
            1.3,
            0,
            Math.PI * 2
          );

          context.fill();

        }

      }

    }

  }


  function exportBoard() {

    const scale =
      2;


    const output =
      document.createElement(
        "canvas"
      );


    output.width =
      Math.round(
        state.width *
        scale
      );


    output.height =
      Math.round(
        state.height *
        scale
      );


    const outputContext =
      output.getContext(
        "2d"
      );


    outputContext.setTransform(
      scale,
      0,
      0,
      scale,
      0,
      0
    );


    drawExportBackground(

      outputContext,

      state.width,

      state.height

    );


    outputContext.save();


    outputContext.translate(

      -state.camera.x *
      state.camera.zoom,

      -state.camera.y *
      state.camera.zoom

    );


    outputContext.scale(

      state.camera.zoom,

      state.camera.zoom

    );


    state.commands
      .forEach(
        function (
          command
        ) {

          drawCommand(
            command,
            outputContext
          );

        }
      );


    outputContext.restore();


    output.toBlob(
      function (
        blob
      ) {

        if (
          !blob
        ) {

          return;

        }


        const url =
          URL.createObjectURL(
            blob
          );


        const link =
          document.createElement(
            "a"
          );


        link.href =
          url;


        link.download =
          "cortex-lousa-" +
          new Date()
            .toISOString()
            .slice(
              0,
              10
            ) +
          ".png";


        document.body
          .appendChild(
            link
          );


        link.click();

        link.remove();


        window.setTimeout(
          function () {

            URL.revokeObjectURL(
              url
            );

          },
          1000
        );

      },
      "image/png"
    );

  }


  async function toggleFullscreen() {

    try {

      if (
        document.fullscreenElement
      ) {

        await document
          .exitFullscreen();

      }
      else {

        await shell
          .requestFullscreen();

      }

    }
    catch (
      error
    ) {

      console.error(
        error
      );

    }

  }


  async function loadUser() {

    try {

      const response =
        await fetch(
          "/api/auth/me",
          {
            credentials:
              "same-origin"
          }
        );


      if (
        response.status ===
        401
      ) {

        location.href =
          "/login.html";

        return;

      }


      if (
        !response.ok
      ) {

        return;

      }


      const data =
        await response.json();


      const user =
        data.usuario ||
        {};


      const name =
        user.nome ||
        "Usuario";


      if (
        $("nomeSidebar")
      ) {

        $("nomeSidebar")
          .textContent =
          name;

      }


      if (
        $("emailSidebar")
      ) {

        $("emailSidebar")
          .textContent =
          user.email ||
          "";

      }


      if (
        $("avatarSidebar")
      ) {

        $("avatarSidebar")
          .textContent =
          name
            .charAt(
              0
            )
            .toUpperCase();

      }

    }
    catch (
      error
    ) {

      console.error(
        error
      );

    }

  }


  async function logout() {

    try {

      await fetch(
        "/api/auth/logout",
        {
          method:
            "POST",

          credentials:
            "same-origin"
        }
      );

    }
    finally {

      location.href =
        "/login.html";

    }

  }


  function editableTarget(
    target
  ) {

    if (
      !target
    ) {

      return false;

    }


    return (
      target.tagName ===
      "INPUT" ||
      target.tagName ===
      "TEXTAREA" ||
      target.tagName ===
      "SELECT" ||
      target.isContentEditable
    );

  }


  function bindEvents() {

    document
      .querySelectorAll(
        ".tool-button[data-tool]"
      )
      .forEach(
        function (
          button
        ) {

          button.addEventListener(
            "click",
            function () {

              selectTool(
                button.dataset.tool
              );

            }
          );

        }
      );


    document
      .querySelectorAll(
        ".color-chip"
      )
      .forEach(
        function (
          chip
        ) {

          chip.addEventListener(
            "click",
            function () {

              selectColor(
                chip.dataset.color
              );

            }
          );

        }
      );


    $("colorPicker")
      ?.addEventListener(
        "input",
        function (
          event
        ) {

          selectColor(
            event.target.value
          );

        }
      );


    $("brushSize")
      ?.addEventListener(
        "input",
        function (
          event
        ) {

          state.size =
            Number(
              event.target.value
            );


          if (
            $("brushSizeValue")
          ) {

            $("brushSizeValue")
              .textContent =
              state.size;

          }


          queueSave();

        }
      );


    $("backgroundSelect")
      ?.addEventListener(
        "change",
        function (
          event
        ) {

          state.background =
            event.target.value;


          stage.dataset.background =
            state.background;


          updateInfiniteBackground();

          queueSave();

        }
      );


    $("fillShapes")
      ?.addEventListener(
        "change",
        function (
          event
        ) {

          state.fill =
            event.target.checked;


          queueSave();

        }
      );


    $("undoBoard")
      ?.addEventListener(
        "click",
        undo
      );


    $("redoBoard")
      ?.addEventListener(
        "click",
        redo
      );


    $("clearBoard")
      ?.addEventListener(
        "click",
        clearBoard
      );


    $("saveBoard")
      ?.addEventListener(
        "click",
        function () {

          saveNow();

          setStatus(
            "Salvo agora"
          );


          window.setTimeout(
            function () {

              setStatus(
                "Salva automaticamente"
              );

            },
            1200
          );

        }
      );


    $("exportBoard")
      ?.addEventListener(
        "click",
        exportBoard
      );


    $("fullscreenBoard")
      ?.addEventListener(
        "click",
        toggleFullscreen
      );


    $("logoutSidebar")
      ?.addEventListener(
        "click",
        logout
      );


    $("zoomInBoard")
      ?.addEventListener(
        "click",
        function () {

          zoomCenter(
            1.25
          );

        }
      );


    $("zoomOutBoard")
      ?.addEventListener(
        "click",
        function () {

          zoomCenter(
            0.8
          );

        }
      );


    $("zoomPercentBoard")
      ?.addEventListener(
        "click",
        resetZoom
      );


    $("originBoard")
      ?.addEventListener(
        "click",
        resetOrigin
      );


    $("fitBoard")
      ?.addEventListener(
        "click",
        fitContent
      );


    canvas.addEventListener(
      "pointerdown",
      pointerDown
    );


    canvas.addEventListener(
      "pointermove",
      pointerMove
    );


    canvas.addEventListener(
      "pointerup",
      pointerUp
    );


    canvas.addEventListener(
      "pointercancel",
      pointerUp
    );


    stage.addEventListener(
      "wheel",
      wheelBoard,
      {
        passive:
          false
      }
    );


    document.addEventListener(
      "keydown",
      function (
        event
      ) {

        if (
          editableTarget(
            event.target
          )
        ) {

          return;

        }


        if (
          event.code ===
          "Space"
        ) {

          state.spacePressed =
            true;


          stage.classList.add(
            "space-pan-ready"
          );


          event.preventDefault();

          return;

        }


        if (
          (
            event.ctrlKey ||
            event.metaKey
          ) &&
          event.key
            .toLowerCase() ===
          "z"
        ) {

          event.preventDefault();

          undo();

          return;

        }


        if (
          (
            event.ctrlKey ||
            event.metaKey
          ) &&
          event.key
            .toLowerCase() ===
          "y"
        ) {

          event.preventDefault();

          redo();

          return;

        }


        const shortcuts = {

          v:
            "hand",

          b:
            "pen",

          h:
            "highlighter",

          e:
            "eraser",

          l:
            "line",

          a:
            "arrow",

          r:
            "rect",

          c:
            "circle",

          t:
            "text"

        };


        const tool =
          shortcuts[
            event.key
              .toLowerCase()
          ];


        if (
          tool
        ) {

          selectTool(
            tool
          );

        }

      }
    );


    document.addEventListener(
      "keyup",
      function (
        event
      ) {

        if (
          event.code ===
          "Space"
        ) {

          state.spacePressed =
            false;


          stage.classList.remove(
            "space-pan-ready"
          );

        }

      }
    );


    window.addEventListener(
      "blur",
      function () {

        state.spacePressed =
          false;

        endPan();


        stage.classList.remove(
          "space-pan-ready"
        );

      }
    );


    document.addEventListener(
      "fullscreenchange",
      function () {

        window.setTimeout(
          resizeCanvas,
          100
        );

      }
    );


    window.addEventListener(
      "resize",
      function () {

        window.requestAnimationFrame(
          resizeCanvas
        );

      }
    );


    if (
      "ResizeObserver"
      in window
    ) {

      const observer =
        new ResizeObserver(
          function () {

            window.requestAnimationFrame(
              resizeCanvas
            );

          }
        );


      observer.observe(
        stage
      );

    }

  }


  function init() {

    injectNavigationControls();

    resizeCanvas();

    loadSaved();

    syncInterface();

    bindEvents();

    render();

    loadUser();

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:
          true
      }
    );

  }
  else {

    init();

  }

})();