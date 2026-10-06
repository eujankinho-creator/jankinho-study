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

    toolSizes: {

      pen:
        4,

      highlighter:
        12,

      eraser:
        18,

      line:
        3,

      arrow:
        3,

      rect:
        3,

      circle:
        3

    },

    toolSmoothing: {

      pen:
        58,

      highlighter:
        68,

      eraser:
        35

    },


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

    touchPointers:
      new Map(),

    touchGesture:
      null,

    selectedIndex:
      null,

    selectedIndices:
      new Set(),

    selectionMarquee:
      null,

    selectionDraggingGroup:
      false,

    selectionDragStart:
      null,

    selectionOriginalCommands:
      new Map(),

    selectionMoved:
      false,

    selectionClipboard:
      [],

    undoSnapshots:
      [],

    redoSnapshots:
      [],

    selectionDragging:
      false,

    selectionStart:
      null,

    selectionOriginal:
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

    select:
      "Seleção",

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


  function smoothStrokePoints(
    points,
    smoothing
  ) {

    if (
      !Array.isArray(
        points
      ) ||
      points.length <
        3 ||
      smoothing <=
        0
    ) {

      return points;

    }


    const strength =
      Math.max(
        0,
        Math.min(
          1,
          smoothing /
          100
        )
      );


    const result = [
      {
        x:
          points[0].x,

        y:
          points[0].y
      }
    ];


    for (
      let index = 1;
      index <
        points.length -
        1;
      index++
    ) {

      const previous =
        points[
          index -
          1
        ];


      const current =
        points[
          index
        ];


      const next =
        points[
          index +
          1
        ];


      const averageX =
        (
          previous.x +
          current.x *
          2 +
          next.x
        ) /
        4;


      const averageY =
        (
          previous.y +
          current.y *
          2 +
          next.y
        ) /
        4;


      result.push({

        x:
          current.x *
          (
            1 -
            strength
          ) +
          averageX *
          strength,

        y:
          current.y *
          (
            1 -
            strength
          ) +
          averageY *
          strength

      });

    }


    result.push({

      x:
        points[
          points.length -
          1
        ].x,

      y:
        points[
          points.length -
          1
        ].y

    });


    return result;

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


    const smoothing =
      Number(
        command.smoothing ||
        0
      );


    const points =
      smoothStrokePoints(
        command.points,
        smoothing
      );


    const first =
      points[0];


    context.beginPath();


    context.moveTo(
      first.x,
      first.y
    );


    if (
      points.length ===
      1
    ) {

      context.lineTo(
        first.x +
        .1,
        first.y +
        .1
      );

    }
    else if (
      smoothing >
        0 &&
      points.length >
        2
    ) {

      for (
        let index = 1;
        index <
          points.length -
          1;
        index++
      ) {

        const current =
          points[
            index
          ];


        const next =
          points[
            index +
            1
          ];


        const middle = {

          x:
            (
              current.x +
              next.x
            ) /
            2,

          y:
            (
              current.y +
              next.y
            ) /
            2

        };


        context.quadraticCurveTo(
          current.x,
          current.y,
          middle.x,
          middle.y
        );

      }


      const last =
        points[
          points.length -
          1
        ];


      context.lineTo(
        last.x,
        last.y
      );

    }
    else {

      for (
        let index = 1;
        index <
          points.length;
        index++
      ) {

        context.lineTo(
          points[index].x,
          points[index].y
        );

      }

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


    drawSelectionOverlay();


    drawMultiSelectionOverlay();


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


  function effectivePreviewSize(
    tool,
    size
  ) {

    const value =
      Number(size) || 1;


    if (
      tool === "highlighter"
    ) {

      return Math.max(
        8,
        value * 4
      );

    }


    if (
      tool === "eraser"
    ) {

      return Math.max(
        8,
        value * 3.5
      );

    }


    return value;

  }


  function ensureBrushCursor() {

    let cursor =
      $("cortexBrushCursor");


    if (
      cursor
    ) {

      return cursor;

    }


    cursor =
      document.createElement(
        "span"
      );


    cursor.id =
      "cortexBrushCursor";


    cursor.className =
      "cortex-brush-cursor";


    cursor.setAttribute(
      "aria-hidden",
      "true"
    );


    stage.appendChild(
      cursor
    );


    return cursor;

  }


  function updateBrushCursorStyle(
    tool,
    size
  ) {

    const cursor =
      ensureBrushCursor();


    const activeTool =
      tool ||
      state.tool;


    const activeSize =
      Number(
        size ??
        state.size ??
        1
      );


    const visualSize =
      effectivePreviewSize(
        activeTool,
        activeSize
      ) *
      state.camera.zoom;


    const diameter =
      Math.max(
        4,
        Math.min(
          96,
          visualSize
        )
      );


    cursor.style.width =
      diameter +
      "px";


    cursor.style.height =
      diameter +
      "px";


    cursor.dataset.tool =
      activeTool;


    if (
      activeTool ===
      "eraser"
    ) {

      cursor.style.background =
        "rgba(255,255,255,.08)";

    }
    else if (
      activeTool ===
      "highlighter"
    ) {

      cursor.style.background =
        state.color
          .replace(
            "#",
            ""
          )
          .length ===
          6
          ? state.color +
            "38"
          : state.color;

    }
    else {

      cursor.style.background =
        state.color +
        (
          /^#[0-9a-f]{6}$/i.test(
            state.color
          )
            ? "24"
            : ""
        );

    }


    cursor.style.borderColor =
      activeTool ===
      "eraser"
        ? "rgba(255,255,255,.92)"
        : state.color;

  }


  function updateBrushCursorFromEvent(
    event
  ) {

    const cursor =
      ensureBrushCursor();


    if (
      !thicknessTools.has(
        state.tool
      ) ||
      state.panning ||
      state.touchGesture
    ) {

      cursor.classList.remove(
        "visible"
      );

      return;

    }


    const rect =
      stage.getBoundingClientRect();


    cursor.style.left =
      (
        event.clientX -
        rect.left
      ) +
      "px";


    cursor.style.top =
      (
        event.clientY -
        rect.top
      ) +
      "px";


    updateBrushCursorStyle(
      state.tool,
      state.size
    );


    cursor.classList.add(
      "visible"
    );

  }


  function hideBrushCursor() {

    const cursor =
      $("cortexBrushCursor");


    if (
      cursor
    ) {

      cursor.classList.remove(
        "visible"
      );

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


    updateBrushCursorStyle(
      state.tool,
      state.size
    );


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

    updateToolContext();

  }


  /* =======================================================
     CORTEX TOOL THICKNESS V6
  ======================================================= */


  const thicknessTools =
    new Set([
      "pen",
      "highlighter",
      "eraser",
      "line",
      "arrow",
      "rect",
      "circle"
    ]);


  /* CORTEX SMOOTHING SETTINGS V7 */


  const smoothingTools =
    new Set([
      "pen",
      "highlighter",
      "eraser"
    ]);


  function loadToolSmoothing() {

    try {

      const saved =
        JSON.parse(
          localStorage.getItem(
            "cortex_whiteboard_smoothing_v1"
          ) ||
          "null"
        );


      if (
        !saved ||
        typeof saved !==
        "object"
      ) {

        return;

      }


      Object.keys(
        state.toolSmoothing
      )
        .forEach(
          function (
            tool
          ) {

            const value =
              Number(
                saved[
                  tool
                ]
              );


            if (
              Number.isFinite(
                value
              )
            ) {

              state.toolSmoothing[
                tool
              ] =
                Math.max(
                  0,
                  Math.min(
                    100,
                    value
                  )
                );

            }

          }
        );

    }
    catch (
      error
    ) {

      console.error(
        error
      );

    }

  }


  function saveToolSmoothing() {

    try {

      localStorage.setItem(
        "cortex_whiteboard_smoothing_v1",
        JSON.stringify(
          state.toolSmoothing
        )
      );

    }
    catch (
      error
    ) {

      console.error(
        error
      );

    }

  }


  function loadToolSizes() {

    try {

      const saved =
        JSON.parse(
          localStorage.getItem(
            "cortex_whiteboard_tool_sizes_v1"
          ) ||
          "null"
        );


      if (
        saved &&
        typeof saved ===
        "object"
      ) {

        Object.keys(
          state.toolSizes
        )
          .forEach(
            function (
              tool
            ) {

              const value =
                Number(
                  saved[
                    tool
                  ]
                );


              if (
                Number.isFinite(
                  value
                ) &&
                value >= 1 &&
                value <= 20
              ) {

                state.toolSizes[
                  tool
                ] =
                  value;

              }

            }
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


  function saveToolSizes() {

    try {

      localStorage.setItem(
        "cortex_whiteboard_tool_sizes_v1",
        JSON.stringify(
          state.toolSizes
        )
      );

    }
    catch (
      error
    ) {

      console.error(
        error
      );

    }

  }


  function thicknessToolName(
    tool
  ) {

    const names = {

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
        "Retangulo",

      circle:
        "Circulo"

    };


    return (
      names[
        tool
      ] ||
      "Ferramenta"
    );

  }


  function setupThicknessPopover() {

    const panel =
      $("strokeControls");


    if (!panel) {
      return;
    }


    if (
      panel.dataset
        .floatingReady ===
      "true"
    ) {

      return;

    }


    panel.dataset
      .floatingReady =
      "true";


    panel.classList.add(
      "tool-thickness-popover"
    );


    panel.classList.remove(
      "thickness-popover-open"
    );


    /*
     * Suavizacao aparece apenas para
     * ferramentas de desenho livre.
     */

    if (
      !panel.querySelector(
        ".tool-smoothing-control"
      )
    ) {

      const smoothing =
        document.createElement(
          "div"
        );


      smoothing.className =
        "tool-smoothing-control hidden";


      smoothing.innerHTML = `
        <span class="smoothing-label">
          Suavizacao
        </span>

        <input
          id="smoothingRange"
          type="range"
          min="0"
          max="100"
          step="1"
          value="58"
        >

        <strong id="smoothingValue">
          58%
        </strong>
      `;


      panel.appendChild(
        smoothing
      );

    }


    document.body
      .appendChild(
        panel
      );


    const sizeRange =
      $("brushSize");


    if (
      sizeRange
    ) {

      sizeRange.addEventListener(
        "input",
        function (
          event
        ) {

          const value =
            Number(
              event.target.value
            );


          state.size =
            value;


          if (
            thicknessTools.has(
              state.tool
            )
          ) {

            state.toolSizes[
              state.tool
            ] =
              value;


            saveToolSizes();

          }


          const output =
            $("brushSizeValue");


          if (
            output
          ) {

            output.textContent =
              value;

          }


          updateBrushCursorStyle(
            state.tool,
            value
          );


          queueSave();

        }
      );

    }


    const smoothingRange =
      $("smoothingRange");


    if (
      smoothingRange
    ) {

      smoothingRange.addEventListener(
        "input",
        function (
          event
        ) {

          if (
            !smoothingTools.has(
              state.tool
            )
          ) {

            return;

          }


          const value =
            Number(
              event.target.value
            );


          state.toolSmoothing[
            state.tool
          ] =
            value;


          const output =
            $("smoothingValue");


          if (
            output
          ) {

            output.textContent =
              value +
              "%";

          }


          saveToolSmoothing();

        }
      );

    }


    document.addEventListener(
      "pointerdown",
      function (
        event
      ) {

        if (
          !panel.classList
            .contains(
              "thickness-popover-open"
            )
        ) {

          return;

        }


        if (
          panel.contains(
            event.target
          )
        ) {

          return;

        }


        if (
          event.target.closest &&
          event.target.closest(
            "[data-tool]"
          )
        ) {

          return;

        }


        hideThicknessPopover();

      }
    );


    window.addEventListener(
      "resize",
      hideThicknessPopover
    );

  }


  function hideThicknessPopover() {

    const panel =
      $("strokeControls");


    if (!panel) {
      return;
    }


    panel.classList.remove(
      "thickness-popover-open"
    );


    panel.classList.add(
      "hidden"
    );

  }


  function showThicknessPopover(
    tool
  ) {

    if (
      !thicknessTools.has(
        tool
      )
    ) {

      hideThicknessPopover();

      return;

    }


    const panel =
      $("strokeControls");


    const button =
      document.querySelector(
        '[data-tool="' +
        tool +
        '"]'
      );


    if (
      !panel ||
      !button
    ) {

      return;

    }


    const size =
      Number(
        state.toolSizes[
          tool
        ] ||
        state.size ||
        4
      );


    state.size =
      size;


    const sizeRange =
      $("brushSize");


    const sizeOutput =
      $("brushSizeValue");


    const caption =
      panel.querySelector(
        ".context-caption"
      );


    if (
      sizeRange
    ) {

      sizeRange.value =
        size;

    }


    if (
      sizeOutput
    ) {

      sizeOutput.textContent =
        size;

    }


    updateBrushCursorStyle(
      tool,
      size
    );


    if (
      caption
    ) {

      caption.textContent =
        thicknessToolName(
          tool
        );

    }


    const smoothingBlock =
      panel.querySelector(
        ".tool-smoothing-control"
      );


    if (
      smoothingBlock
    ) {

      const showSmoothing =
        smoothingTools.has(
          tool
        );


      smoothingBlock
        .classList.toggle(
          "hidden",
          !showSmoothing
        );


      if (
        showSmoothing
      ) {

        const smooth =
          Number(
            state.toolSmoothing[
              tool
            ] ??
            50
          );


        const range =
          $("smoothingRange");


        const output =
          $("smoothingValue");


        if (
          range
        ) {

          range.value =
            smooth;

        }


        if (
          output
        ) {

          output.textContent =
            smooth +
            "%";

        }

      }

    }


    panel.classList.remove(
      "hidden"
    );


    panel.classList.add(
      "thickness-popover-open"
    );


    requestAnimationFrame(
      function () {

        const buttonRect =
          button
            .getBoundingClientRect();


        const panelRect =
          panel
            .getBoundingClientRect();


        let left =
          buttonRect.left +
          buttonRect.width /
          2 -
          panelRect.width /
          2;


        left =
          Math.max(
            8,
            Math.min(
              window.innerWidth -
              panelRect.width -
              8,
              left
            )
          );


        let top =
          buttonRect.bottom +
          9;


        if (
          top +
          panelRect.height >
          window.innerHeight -
          8
        ) {

          top =
            buttonRect.top -
            panelRect.height -
            9;

        }


        panel.style.left =
          left +
          "px";


        panel.style.top =
          top +
          "px";

      }
    );

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

    /* CORTEX MULTI TOOL CHANGE V8_1 */

    if (
      tool !==
      "select" &&
      state.selectedIndices
    ) {

      clearBoardSelection();

    }



    if (
      thicknessTools.has(
        tool
      )
    ) {

      state.size =
        Number(
          state.toolSizes[
            tool
          ] ||
          state.size ||
          4
        );

    }


    if (
      tool !==
      "select"
    ) {

      state.selectedIndex =
        null;


      state.selectionDragging =
        false;


      state.selectionOriginal =
        null;

    }


    syncInterface();


    if (
      thicknessTools.has(
        tool
      )
    ) {

      showThicknessPopover(
        tool
      );

    }
    else {

      hideThicknessPopover();

    }


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


  /* CORTEX MULTI HISTORY V8_1 */


  function cloneBoardCommands(
    commands
  ) {

    return JSON.parse(
      JSON.stringify(
        commands
      )
    );

  }


  function saveUndoSnapshot() {

    state.undoSnapshots.push(
      cloneBoardCommands(
        state.commands
      )
    );


    if (
      state.undoSnapshots.length >
      80
    ) {

      state.undoSnapshots.shift();

    }


    state.redoSnapshots =
      [];

  }


  function commitDraft() {

    if (
      !state.draft
    ) {

      return;

    }


    /* CORTEX COMMIT SNAPSHOT V8_1 */

    saveUndoSnapshot();


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



  /* CORTEX MULTITOUCH MOBILE V4 */


  function registerTouchPointer(
    event
  ) {

    if (
      event.pointerType !==
      "touch"
    ) {

      return;

    }


    const point =
      screenPoint(
        event
      );


    state.touchPointers.set(
      event.pointerId,
      {
        x:
          point.x,

        y:
          point.y
      }
    );

  }


  function getTouchMetrics() {

    const points =
      Array.from(
        state.touchPointers.values()
      );


    if (
      points.length <
      2
    ) {

      return null;

    }


    const first =
      points[0];

    const second =
      points[1];


    const center = {

      x:
        (
          first.x +
          second.x
        ) /
        2,

      y:
        (
          first.y +
          second.y
        ) /
        2

    };


    const distance =
      Math.max(
        1,
        Math.hypot(
          second.x -
          first.x,
          second.y -
          first.y
        )
      );


    return {
      center,
      distance
    };

  }


  function beginTouchGesture() {

    const metrics =
      getTouchMetrics();


    if (
      !metrics
    ) {

      return false;

    }


    /*
     * Se o primeiro dedo comecou um risco,
     * cancela esse risco assim que o segundo
     * dedo entra na lousa.
     */
    state.drawing =
      false;

    state.draft =
      null;

    state.panning =
      false;

    state.panStart =
      null;


    stage.classList.remove(
      "is-panning"
    );


    const anchorWorld =
      screenToWorld(
        metrics.center.x,
        metrics.center.y
      );


    state.touchGesture = {

      startDistance:
        metrics.distance,

      startZoom:
        state.camera.zoom,

      anchorWorld

    };


    stage.classList.add(
      "is-touch-navigating"
    );


    render();

    return true;

  }


  function updateTouchGesture() {

    const gesture =
      state.touchGesture;


    const metrics =
      getTouchMetrics();


    if (
      !gesture ||
      !metrics
    ) {

      return false;

    }


    const scale =
      metrics.distance /
      gesture.startDistance;


    const zoom =
      clamp(
        gesture.startZoom *
        scale,
        MIN_ZOOM,
        MAX_ZOOM
      );


    state.camera.zoom =
      zoom;


    /*
     * O ponto que estava entre os dois dedos
     * continua preso entre eles durante pan
     * e pinch-to-zoom.
     */
    state.camera.x =
      gesture.anchorWorld.x -
      metrics.center.x /
      zoom;


    state.camera.y =
      gesture.anchorWorld.y -
      metrics.center.y /
      zoom;


    render();

    return true;

  }


  function finishTouchGesture() {

    state.touchGesture =
      null;

    state.drawing =
      false;

    state.draft =
      null;

    state.panning =
      false;

    state.panStart =
      null;


    stage.classList.remove(
      "is-touch-navigating"
    );


    stage.classList.remove(
      "is-panning"
    );


    render();

    queueSave();

  }



  /* =======================================================
     CORTEX SELECTION TOOL V5
  ======================================================= */


  function cloneCommand(
    command
  ) {

    return JSON.parse(
      JSON.stringify(
        command
      )
    );

  }


  function commandBoundsOne(
    command
  ) {

    let minX =
      Infinity;

    let minY =
      Infinity;

    let maxX =
      -Infinity;

    let maxY =
      -Infinity;


    function include(
      point
    ) {

      if (!point) {
        return;
      }


      minX =
        Math.min(
          minX,
          point.x
        );


      minY =
        Math.min(
          minY,
          point.y
        );


      maxX =
        Math.max(
          maxX,
          point.x
        );


      maxY =
        Math.max(
          maxY,
          point.y
        );

    }


    if (
      Array.isArray(
        command.points
      )
    ) {

      command.points.forEach(
        include
      );

    }


    include(
      command.start
    );


    include(
      command.end
    );


    if (
      command.position
    ) {

      include(
        command.position
      );


      const fontSize =
        command.fontSize ||
        18;


      include({
        x:
          command.position.x +
          360,

        y:
          command.position.y +
          fontSize *
          2.4
      });

    }


    if (
      minX === Infinity
    ) {

      return null;

    }


    return {
      minX,
      minY,
      maxX,
      maxY
    };

  }


  function selectedCommand() {

    if (
      state.selectedIndex ===
      null
    ) {

      return null;

    }


    return (
      state.commands[
        state.selectedIndex
      ] ||
      null
    );

  }


  function hitTestCommand(
    point
  ) {

    for (
      let index =
        state.commands.length -
        1;

      index >= 0;

      index--
    ) {

      const command =
        state.commands[
          index
        ];


      const bounds =
        commandBoundsOne(
          command
        );


      if (!bounds) {
        continue;
      }


      const padding =
        Math.max(
          10 /
          state.camera.zoom,
          Number(
            command.size ||
            2
          ) *
          2
        );


      if (
        point.x >=
          bounds.minX -
          padding &&
        point.x <=
          bounds.maxX +
          padding &&
        point.y >=
          bounds.minY -
          padding &&
        point.y <=
          bounds.maxY +
          padding
      ) {

        return index;

      }

    }


    return null;

  }


  function translateCommand(
    source,
    deltaX,
    deltaY
  ) {

    const command =
      cloneCommand(
        source
      );


    function move(
      point
    ) {

      if (!point) {
        return;
      }


      point.x +=
        deltaX;


      point.y +=
        deltaY;

    }


    if (
      Array.isArray(
        command.points
      )
    ) {

      command.points.forEach(
        move
      );

    }


    move(
      command.start
    );


    move(
      command.end
    );


    move(
      command.position
    );


    return command;

  }


  function beginSelection(
    event
  ) {

    const point =
      worldPoint(
        event
      );


    const index =
      hitTestCommand(
        point
      );


    state.selectedIndex =
      index;


    if (
      index ===
      null
    ) {

      state.selectionDragging =
        false;

      state.selectionOriginal =
        null;

      render();

      return;

    }


    state.selectionDragging =
      true;


    state.selectionStart =
      point;


    state.selectionOriginal =
      cloneCommand(
        state.commands[
          index
        ]
      );


    try {

      canvas.setPointerCapture(
        event.pointerId
      );

    }
    catch (
      error
    ) {}


    render();

  }


  function moveSelection(
    event
  ) {

    if (
      !state.selectionDragging ||
      state.selectedIndex ===
        null ||
      !state.selectionOriginal ||
      !state.selectionStart
    ) {

      return;

    }


    const point =
      worldPoint(
        event
      );


    const deltaX =
      point.x -
      state.selectionStart.x;


    const deltaY =
      point.y -
      state.selectionStart.y;


    state.commands[
      state.selectedIndex
    ] =
      translateCommand(
        state.selectionOriginal,
        deltaX,
        deltaY
      );


    render();

  }


  function finishSelection() {

    if (
      !state.selectionDragging
    ) {

      return;

    }


    state.selectionDragging =
      false;


    state.selectionStart =
      null;


    state.selectionOriginal =
      null;


    queueSave();

    render();

  }


  function deleteSelection() {

    if (
      state.selectedIndex ===
      null
    ) {

      return;

    }


    if (
      !state.commands[
        state.selectedIndex
      ]
    ) {

      state.selectedIndex =
        null;

      return;

    }


    state.commands.splice(
      state.selectedIndex,
      1
    );


    state.selectedIndex =
      null;


    state.selectionDragging =
      false;


    state.selectionOriginal =
      null;


    state.redo =
      [];


    queueSave();

    render();

  }


  function drawSelectionOverlay() {

    const command =
      selectedCommand();


    if (
      state.tool !==
        "select" ||
      !command
    ) {

      return;

    }


    const bounds =
      commandBoundsOne(
        command
      );


    if (!bounds) {
      return;
    }


    const padding =
      8 /
      state.camera.zoom;


    const accent =
      getComputedStyle(
        document.documentElement
      )
        .getPropertyValue(
          "--theme-accent"
        )
        .trim() ||
      "#f97316";


    const x =
      bounds.minX -
      padding;


    const y =
      bounds.minY -
      padding;


    const width =
      bounds.maxX -
      bounds.minX +
      padding *
      2;


    const height =
      bounds.maxY -
      bounds.minY +
      padding *
      2;


    ctx.save();


    ctx.globalCompositeOperation =
      "source-over";


    ctx.strokeStyle =
      accent;


    ctx.fillStyle =
      accent;


    ctx.lineWidth =
      1.5 /
      state.camera.zoom;


    ctx.setLineDash([
      6 /
        state.camera.zoom,

      4 /
        state.camera.zoom
    ]);


    ctx.strokeRect(
      x,
      y,
      width,
      height
    );


    ctx.setLineDash([]);


    const handle =
      6 /
      state.camera.zoom;


    [
      [x, y],
      [x + width, y],
      [x, y + height],
      [
        x + width,
        y + height
      ]
    ].forEach(
      function (
        position
      ) {

        ctx.beginPath();


        ctx.arc(
          position[0],
          position[1],
          handle,
          0,
          Math.PI *
          2
        );


        ctx.fill();

      }
    );


    ctx.restore();

  }


  function updateToolContext() {

    const colorControls =
      $("colorControls");


    const shapeControls =
      $("shapeControls");


    const colorTools =
      new Set([
        "pen",
        "highlighter",
        "line",
        "arrow",
        "rect",
        "circle",
        "text"
      ]);


    const fillTools =
      new Set([
        "rect",
        "circle"
      ]);


    if (
      colorControls
    ) {

      colorControls
        .classList.toggle(
          "hidden",
          !colorTools.has(
            state.tool
          )
        );

    }


    if (
      shapeControls
    ) {

      shapeControls
        .classList.toggle(
          "hidden",
          !fillTools.has(
            state.tool
          )
        );

    }

  }

  /* =======================================================
     CORTEX MULTI SELECTION V8_1
  ======================================================= */


  function selectionClone(
    value
  ) {

    return JSON.parse(
      JSON.stringify(
        value
      )
    );

  }


  function selectionCommandBounds(
    command
  ) {

    if (
      typeof commandBoundsOne ===
      "function"
    ) {

      return commandBoundsOne(
        command
      );

    }


    let minX =
      Infinity;

    let minY =
      Infinity;

    let maxX =
      -Infinity;

    let maxY =
      -Infinity;


    function include(
      point
    ) {

      if (!point) {
        return;
      }


      minX =
        Math.min(
          minX,
          point.x
        );


      minY =
        Math.min(
          minY,
          point.y
        );


      maxX =
        Math.max(
          maxX,
          point.x
        );


      maxY =
        Math.max(
          maxY,
          point.y
        );

    }


    if (
      Array.isArray(
        command.points
      )
    ) {

      command.points
        .forEach(
          include
        );

    }


    include(
      command.start
    );


    include(
      command.end
    );


    if (
      command.position
    ) {

      include(
        command.position
      );


      const fontSize =
        Number(
          command.fontSize ||
          18
        );


      include({

        x:
          command.position.x +
          360,

        y:
          command.position.y +
          fontSize *
          2.5

      });

    }


    if (
      minX ===
      Infinity
    ) {

      return null;

    }


    return {
      minX,
      minY,
      maxX,
      maxY
    };

  }


  function selectionRect(
    start,
    end
  ) {

    return {

      minX:
        Math.min(
          start.x,
          end.x
        ),

      minY:
        Math.min(
          start.y,
          end.y
        ),

      maxX:
        Math.max(
          start.x,
          end.x
        ),

      maxY:
        Math.max(
          start.y,
          end.y
        )

    };

  }


  function selectionIntersects(
    a,
    b
  ) {

    return !(
      a.maxX <
        b.minX ||
      a.minX >
        b.maxX ||
      a.maxY <
        b.minY ||
      a.minY >
        b.maxY
    );

  }


  function selectedIndexes() {

    return Array
      .from(
        state.selectedIndices
      )
      .filter(
        function (
          index
        ) {

          return Boolean(
            state.commands[
              index
            ]
          );

        }
      )
      .sort(
        function (
          a,
          b
        ) {

          return a - b;

        }
      );

  }


  function clearBoardSelection() {

    state.selectedIndices
      .clear();


    state.selectedIndex =
      null;


    state.selectionMarquee =
      null;


    state.selectionDraggingGroup =
      false;


    state.selectionDragStart =
      null;


    state.selectionOriginalCommands
      .clear();


    state.selectionMoved =
      false;


    updateSelectionToolbar();

  }


  function selectAllBoardItems() {

    state.selectedIndices
      .clear();


    state.commands.forEach(
      function (
        command,
        index
      ) {

        state.selectedIndices
          .add(
            index
          );

      }
    );


    state.selectedIndex =
      null;


    updateSelectionToolbar();

    render();

  }


  function hitTestBoardItem(
    point
  ) {

    for (
      let index =
        state.commands.length -
        1;

      index >=
        0;

      index--
    ) {

      const bounds =
        selectionCommandBounds(
          state.commands[
            index
          ]
        );


      if (!bounds) {
        continue;
      }


      const padding =
        Math.max(
          8 /
          state.camera.zoom,
          3
        );


      if (
        point.x >=
          bounds.minX -
          padding &&
        point.x <=
          bounds.maxX +
          padding &&
        point.y >=
          bounds.minY -
          padding &&
        point.y <=
          bounds.maxY +
          padding
      ) {

        return index;

      }

    }


    return null;

  }


  function moveCommandForSelection(
    original,
    deltaX,
    deltaY
  ) {

    const command =
      selectionClone(
        original
      );


    function move(
      point
    ) {

      if (!point) {
        return;
      }


      point.x +=
        deltaX;


      point.y +=
        deltaY;

    }


    if (
      Array.isArray(
        command.points
      )
    ) {

      command.points
        .forEach(
          move
        );

    }


    move(
      command.start
    );


    move(
      command.end
    );


    move(
      command.position
    );


    return command;

  }


  function beginBoardSelection(
    event
  ) {

    const point =
      worldPoint(
        event
      );


    const hit =
      hitTestBoardItem(
        point
      );


    const additive =
      Boolean(
        event.shiftKey ||
        event.ctrlKey ||
        event.metaKey
      );


    state.selectedIndex =
      null;


    if (
      hit !==
      null
    ) {

      if (
        additive
      ) {

        if (
          state.selectedIndices
            .has(
              hit
            )
        ) {

          state.selectedIndices
            .delete(
              hit
            );


          updateSelectionToolbar();

          render();

          return;

        }


        state.selectedIndices
          .add(
            hit
          );

      }
      else if (
        !state.selectedIndices
          .has(
            hit
          )
      ) {

        state.selectedIndices
          .clear();


        state.selectedIndices
          .add(
            hit
          );

      }


      state.selectionDraggingGroup =
        true;


      state.selectionDragStart =
        point;


      state.selectionOriginalCommands =
        new Map();


      selectedIndexes()
        .forEach(
          function (
            index
          ) {

            state.selectionOriginalCommands
              .set(
                index,
                selectionClone(
                  state.commands[
                    index
                  ]
                )
              );

          }
        );


      state.selectionMoved =
        false;


      try {

        canvas.setPointerCapture(
          event.pointerId
        );

      }
      catch (
        error
      ) {}


      updateSelectionToolbar();

      render();

      return;

    }


    if (
      !additive
    ) {

      state.selectedIndices
        .clear();

    }


    state.selectionMarquee = {

      start:
        point,

      end:
        point,

      additive

    };


    try {

      canvas.setPointerCapture(
        event.pointerId
      );

    }
    catch (
      error
    ) {}


    updateSelectionToolbar();

    render();

  }


  function moveBoardSelection(
    event
  ) {

    if (
      state.selectionDraggingGroup &&
      state.selectionDragStart
    ) {

      const point =
        worldPoint(
          event
        );


      const deltaX =
        point.x -
        state.selectionDragStart.x;


      const deltaY =
        point.y -
        state.selectionDragStart.y;


      const distance =
        Math.hypot(
          deltaX,
          deltaY
        ) *
        state.camera.zoom;


      if (
        distance >
        2
      ) {

        if (
          !state.selectionMoved
        ) {

          saveUndoSnapshot();


          state.selectionMoved =
            true;

        }


        state.selectionOriginalCommands
          .forEach(
            function (
              original,
              index
            ) {

              state.commands[
                index
              ] =
                moveCommandForSelection(
                  original,
                  deltaX,
                  deltaY
                );

            }
          );

      }


      render();

      return;

    }


    if (
      state.selectionMarquee
    ) {

      state.selectionMarquee.end =
        worldPoint(
          event
        );


      render();

    }

  }


  function finishBoardSelection() {

    if (
      state.selectionDraggingGroup
    ) {

      state.selectionDraggingGroup =
        false;


      state.selectionDragStart =
        null;


      state.selectionOriginalCommands
        .clear();


      if (
        state.selectionMoved
      ) {

        queueSave();

      }


      state.selectionMoved =
        false;


      updateSelectionToolbar();

      render();

      return;

    }


    if (
      !state.selectionMarquee
    ) {

      return;

    }


    const marquee =
      state.selectionMarquee;


    const area =
      selectionRect(
        marquee.start,
        marquee.end
      );


    const width =
      (
        area.maxX -
        area.minX
      ) *
      state.camera.zoom;


    const height =
      (
        area.maxY -
        area.minY
      ) *
      state.camera.zoom;


    if (
      width >
        3 ||
      height >
        3
    ) {

      state.commands
        .forEach(
          function (
            command,
            index
          ) {

            const bounds =
              selectionCommandBounds(
                command
              );


            if (
              bounds &&
              selectionIntersects(
                area,
                bounds
              )
            ) {

              state.selectedIndices
                .add(
                  index
                );

            }

          }
        );

    }
    else if (
      !marquee.additive
    ) {

      state.selectedIndices
        .clear();

    }


    state.selectionMarquee =
      null;


    updateSelectionToolbar();

    render();

  }


  function selectionGroupBounds() {

    const indexes =
      selectedIndexes();


    if (
      indexes.length ===
      0
    ) {

      return null;

    }


    const result = {

      minX:
        Infinity,

      minY:
        Infinity,

      maxX:
        -Infinity,

      maxY:
        -Infinity

    };


    indexes.forEach(
      function (
        index
      ) {

        const bounds =
          selectionCommandBounds(
            state.commands[
              index
            ]
          );


        if (!bounds) {
          return;
        }


        result.minX =
          Math.min(
            result.minX,
            bounds.minX
          );


        result.minY =
          Math.min(
            result.minY,
            bounds.minY
          );


        result.maxX =
          Math.max(
            result.maxX,
            bounds.maxX
          );


        result.maxY =
          Math.max(
            result.maxY,
            bounds.maxY
          );

      }
    );


    return (
      result.minX ===
      Infinity
        ? null
        : result
    );

  }


  function drawSelectionBox(
    bounds,
    accent,
    strong
  ) {

    const padding =
      7 /
      state.camera.zoom;


    ctx.save();


    ctx.globalCompositeOperation =
      "source-over";


    ctx.strokeStyle =
      accent;


    ctx.lineWidth =
      (
        strong
          ? 1.8
          : 1.1
      ) /
      state.camera.zoom;


    ctx.globalAlpha =
      strong
        ? 1
        : .55;


    ctx.setLineDash([
      6 /
        state.camera.zoom,

      4 /
        state.camera.zoom
    ]);


    ctx.strokeRect(

      bounds.minX -
      padding,

      bounds.minY -
      padding,

      bounds.maxX -
      bounds.minX +
      padding *
      2,

      bounds.maxY -
      bounds.minY +
      padding *
      2

    );


    ctx.restore();

  }


  function drawMultiSelectionOverlay() {

    if (
      state.tool !==
      "select"
    ) {

      return;

    }


    const accent =
      getComputedStyle(
        document.documentElement
      )
        .getPropertyValue(
          "--theme-accent"
        )
        .trim() ||
      "#f97316";


    selectedIndexes()
      .forEach(
        function (
          index
        ) {

          const bounds =
            selectionCommandBounds(
              state.commands[
                index
              ]
            );


          if (
            bounds
          ) {

            drawSelectionBox(
              bounds,
              accent,
              false
            );

          }

        }
      );


    if (
      state.selectedIndices.size >
      1
    ) {

      const group =
        selectionGroupBounds();


      if (
        group
      ) {

        drawSelectionBox(
          group,
          accent,
          true
        );

      }

    }


    if (
      state.selectionMarquee
    ) {

      const area =
        selectionRect(
          state.selectionMarquee.start,
          state.selectionMarquee.end
        );


      ctx.save();


      ctx.globalCompositeOperation =
        "source-over";


      ctx.fillStyle =
        accent;


      ctx.strokeStyle =
        accent;


      ctx.globalAlpha =
        .11;


      ctx.fillRect(

        area.minX,

        area.minY,

        area.maxX -
        area.minX,

        area.maxY -
        area.minY

      );


      ctx.globalAlpha =
        .95;


      ctx.lineWidth =
        1.3 /
        state.camera.zoom;


      ctx.setLineDash([
        6 /
          state.camera.zoom,

        4 /
          state.camera.zoom
      ]);


      ctx.strokeRect(

        area.minX,

        area.minY,

        area.maxX -
        area.minX,

        area.maxY -
        area.minY

      );


      ctx.restore();

    }

  }


  function copyBoardSelection() {

    const copied =
      selectedIndexes()
        .map(
          function (
            index
          ) {

            return (
              state.commands[
                index
              ]
            );

          }
        );


    if (
      copied.length ===
      0
    ) {

      return;

    }


    state.selectionClipboard =
      cloneBoardCommands(
        copied
      );


    try {

      localStorage.setItem(
        "cortex_whiteboard_clipboard_v2",
        JSON.stringify(
          state.selectionClipboard
        )
      );

    }
    catch (
      error
    ) {}


    flashSelectionToolbar(
      "Copiado"
    );

  }


  function loadBoardClipboard() {

    if (
      state.selectionClipboard.length >
      0
    ) {

      return (
        state.selectionClipboard
      );

    }


    try {

      const saved =
        JSON.parse(
          localStorage.getItem(
            "cortex_whiteboard_clipboard_v2"
          ) ||
          "[]"
        );


      if (
        Array.isArray(
          saved
        )
      ) {

        state.selectionClipboard =
          saved;

      }

    }
    catch (
      error
    ) {}


    return (
      state.selectionClipboard
    );

  }


  function pasteBoardSelection() {

    const clipboard =
      loadBoardClipboard();


    if (
      clipboard.length ===
      0
    ) {

      return;

    }


    saveUndoSnapshot();


    const offset =
      28 /
      Math.max(
        .3,
        state.camera.zoom
      );


    const firstIndex =
      state.commands.length;


    clipboard.forEach(
      function (
        command
      ) {

        state.commands.push(
          moveCommandForSelection(
            command,
            offset,
            offset
          )
        );

      }
    );


    state.selectedIndices
      .clear();


    for (
      let index =
        firstIndex;

      index <
        state.commands.length;

      index++
    ) {

      state.selectedIndices
        .add(
          index
        );

    }


    state.selectionClipboard =
      clipboard.map(
        function (
          command
        ) {

          return (
            moveCommandForSelection(
              command,
              offset,
              offset
            )
          );

        }
      );


    try {

      localStorage.setItem(
        "cortex_whiteboard_clipboard_v2",
        JSON.stringify(
          state.selectionClipboard
        )
      );

    }
    catch (
      error
    ) {}


    queueSave();

    updateSelectionToolbar();

    render();

  }


  function duplicateBoardSelection() {

    copyBoardSelection();

    pasteBoardSelection();

  }


  function deleteBoardSelection() {

    const indexes =
      selectedIndexes();


    if (
      indexes.length ===
      0
    ) {

      return;

    }


    saveUndoSnapshot();


    indexes
      .sort(
        function (
          a,
          b
        ) {

          return b - a;

        }
      )
      .forEach(
        function (
          index
        ) {

          state.commands.splice(
            index,
            1
          );

        }
      );


    clearBoardSelection();

    queueSave();

    render();

  }


  function ensureSelectionToolbar() {

    if (
      $("selectionActionBar")
    ) {

      return;

    }


    const bar =
      document.createElement(
        "div"
      );


    bar.id =
      "selectionActionBar";


    bar.className =
      "selection-action-bar hidden";


    bar.innerHTML = `
      <span
        id="selectionCount"
        class="selection-count"
      >
        0 selecionados
      </span>

      <span class="selection-bar-divider"></span>

      <button
        type="button"
        data-selection-action="all"
        title="Selecionar todos - Ctrl+A"
      >
        Todos
      </button>

      <button
        type="button"
        data-selection-action="copy"
        title="Copiar - Ctrl+C"
      >
        Copiar
      </button>

      <button
        type="button"
        data-selection-action="paste"
        title="Colar - Ctrl+V"
      >
        Colar
      </button>

      <button
        type="button"
        data-selection-action="duplicate"
      >
        Duplicar
      </button>

      <button
        type="button"
        class="selection-delete"
        data-selection-action="delete"
      >
        Apagar
      </button>
    `;


    stage.appendChild(
      bar
    );


    bar.addEventListener(
      "pointerdown",
      function (
        event
      ) {

        event.stopPropagation();

      }
    );


    bar.addEventListener(
      "click",
      function (
        event
      ) {

        const button =
          event.target.closest(
            "[data-selection-action]"
          );


        if (!button) {
          return;
        }


        const action =
          button.dataset
            .selectionAction;


        if (
          action ===
          "all"
        ) {

          selectAllBoardItems();

        }


        if (
          action ===
          "copy"
        ) {

          copyBoardSelection();

        }


        if (
          action ===
          "paste"
        ) {

          pasteBoardSelection();

        }


        if (
          action ===
          "duplicate"
        ) {

          duplicateBoardSelection();

        }


        if (
          action ===
          "delete"
        ) {

          deleteBoardSelection();

        }

      }
    );

  }


  function updateSelectionToolbar() {

    const bar =
      $("selectionActionBar");


    if (!bar) {
      return;
    }


    const count =
      state.selectedIndices.size;


    bar.classList.toggle(
      "hidden",
      state.tool !==
        "select"
    );


    const countElement =
      $("selectionCount");


    if (
      countElement
    ) {

      countElement.textContent =
        count +
        (
          count === 1
            ? " selecionado"
            : " selecionados"
        );

    }


    const actions =
      bar.querySelectorAll(
        "[data-selection-action]"
      );


    actions.forEach(
      function (
        button
      ) {

        const action =
          button.dataset
            .selectionAction;


        if (
          action ===
            "all" ||
          action ===
            "paste"
        ) {

          button.disabled =
            false;

          return;

        }


        button.disabled =
          count ===
          0;

      }
    );

  }


  function flashSelectionToolbar(
    message
  ) {

    const count =
      $("selectionCount");


    if (!count) {
      return;
    }


    count.textContent =
      message;


    window.setTimeout(
      updateSelectionToolbar,
      650
    );

  }


  function pointerDown(
    event
  ) {

    updateBrushCursorFromEvent(
      event
    );


    /* CORTEX CLOSE POPOVER ON CANVAS V7 */

    hideThicknessPopover();


    /* CORTEX TOUCH DOWN V4 */

    if (
      event.pointerType ===
      "touch"
    ) {

      registerTouchPointer(
        event
      );


      if (
        state.touchPointers.size >=
        2
      ) {

        event.preventDefault();


        try {

          canvas.setPointerCapture(
            event.pointerId
          );

        }
        catch (
          error
        ) {}


        if (
          !state.touchGesture
        ) {

          beginTouchGesture();

        }


        return;

      }

    }


    /* CORTEX MULTI DOWN V8_1 */

    if (
      state.tool ===
        "select" &&
      event.button ===
        0 &&
      !state.touchGesture
    ) {

      hideThicknessPopover();

      event.preventDefault();


      beginBoardSelection(
        event
      );


      return;

    }


    const wantsPan =
      state.tool ===
      "hand" ||
      event.button ===
      1 ||
      event.button ===
      2 ||
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


    /* CORTEX SELECT POINTER DOWN V5 */

    if (
      state.tool ===
      "select" &&
      event.button ===
      0
    ) {

      event.preventDefault();

      beginSelection(
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
          state.size,

        smoothing:
          smoothingTools.has(
            state.tool
          )
            ? Number(
                state.toolSmoothing[
                  state.tool
                ] ||
                0
              )
            : 0

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

    updateBrushCursorFromEvent(
      event
    );


    /* CORTEX TOUCH MOVE V4 */

    if (
      event.pointerType ===
      "touch" &&
      state.touchPointers.has(
        event.pointerId
      )
    ) {

      registerTouchPointer(
        event
      );


      if (
        state.touchGesture ||
        state.touchPointers.size >=
        2
      ) {

        event.preventDefault();


        if (
          !state.touchGesture
        ) {

          beginTouchGesture();

        }


        updateTouchGesture();

        return;

      }

    }


    /* CORTEX SELECT POINTER MOVE V5 */

    if (
      state.tool ===
      "select" &&
      state.selectionDragging
    ) {

      event.preventDefault();

      moveSelection(
        event
      );

      return;

    }


    /* CORTEX MULTI MOVE V8_1 */

    if (
      state.tool ===
        "select" &&
      (
        state.selectionDraggingGroup ||
        state.selectionMarquee
      )
    ) {

      event.preventDefault();


      moveBoardSelection(
        event
      );


      return;

    }


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
      event.pointerType !==
      "mouse"
    ) {

      hideBrushCursor();

    }


    /* CORTEX TOUCH UP V4 */

    if (
      event.pointerType ===
      "touch"
    ) {

      const wasGesture =
        Boolean(
          state.touchGesture
        );


      state.touchPointers.delete(
        event.pointerId
      );


      if (
        wasGesture
      ) {

        event.preventDefault();


        if (
          state.touchPointers.size <
          2
        ) {

          finishTouchGesture();

        }


        return;

      }

    }


    /* CORTEX SELECT POINTER UP V5 */

    if (
      state.tool ===
      "select" &&
      state.selectionDragging
    ) {

      event.preventDefault();

      finishSelection();

      return;

    }


    /* CORTEX MULTI UP V8_1 */

    if (
      state.tool ===
        "select" &&
      (
        state.selectionDraggingGroup ||
        state.selectionMarquee
      )
    ) {

      event.preventDefault();


      finishBoardSelection();


      return;

    }


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
      state.undoSnapshots.length >
      0
    ) {

      state.redoSnapshots.push(
        cloneBoardCommands(
          state.commands
        )
      );


      state.commands =
        state.undoSnapshots.pop();


      clearBoardSelection();

      render();

      queueSave();

      return;

    }


    /*
     * Compatibilidade com desenhos antigos
     * realizados antes da V8.
     */

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
      state.redoSnapshots.length >
      0
    ) {

      state.undoSnapshots.push(
        cloneBoardCommands(
          state.commands
        )
      );


      state.commands =
        state.redoSnapshots.pop();


      clearBoardSelection();

      render();

      queueSave();

      return;

    }


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


          updateBrushCursorStyle(
            state.tool,
            state.size
          );


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


    canvas.addEventListener(
      "pointerleave",
      hideBrushCursor
    );


    /* CORTEX RIGHT CLICK PAN V5 */

    canvas.addEventListener(
      "contextmenu",
      function (
        event
      ) {

        event.preventDefault();

      }
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


        /* CORTEX SELECTION KEYBOARD V5 */

        if (
          state.tool ===
          "select" &&
          (
            event.key ===
              "Delete" ||
            event.key ===
              "Backspace"
          )
        ) {

          event.preventDefault();

          deleteSelection();

          return;

        }


        if (
          event.key ===
          "Escape"
        ) {

          state.selectedIndex =
            null;


          state.selectionDragging =
            false;


          state.selectionOriginal =
            null;


          render();

          return;

        }


        /* CORTEX MULTI KEYBOARD V8_1 */

        if (
          state.tool ===
          "select"
        ) {

          const selectionKey =
            event.key
              .toLowerCase();


          if (
            (
              event.ctrlKey ||
              event.metaKey
            ) &&
            selectionKey ===
              "a"
          ) {

            event.preventDefault();

            selectAllBoardItems();

            return;

          }


          if (
            (
              event.ctrlKey ||
              event.metaKey
            ) &&
            selectionKey ===
              "c"
          ) {

            event.preventDefault();

            copyBoardSelection();

            return;

          }


          if (
            (
              event.ctrlKey ||
              event.metaKey
            ) &&
            selectionKey ===
              "v"
          ) {

            event.preventDefault();

            pasteBoardSelection();

            return;

          }


          if (
            (
              event.ctrlKey ||
              event.metaKey
            ) &&
            selectionKey ===
              "x"
          ) {

            event.preventDefault();

            copyBoardSelection();

            deleteBoardSelection();

            return;

          }


          if (
            event.key ===
              "Delete" ||
            event.key ===
              "Backspace"
          ) {

            event.preventDefault();

            deleteBoardSelection();

            return;

          }


          if (
            event.key ===
            "Escape"
          ) {

            event.preventDefault();

            clearBoardSelection();

            render();

            return;

          }

        }


        const shortcuts = {

          s:
            "select",

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

    loadToolSizes();

    loadToolSmoothing();


    if (
      thicknessTools.has(
        state.tool
      )
    ) {

      state.size =
        state.toolSizes[
          state.tool
        ] ||
        state.size;

    }


    setupThicknessPopover();

    ensureBrushCursor();

    syncInterface();

    bindEvents();

    ensureSelectionToolbar();

    updateSelectionToolbar();


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