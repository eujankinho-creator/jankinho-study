(function () {
  "use strict";

  function commonsFile(name) {
    return "https://commons.wikimedia.org/wiki/Special:Redirect/file/" +
      encodeURIComponent(name);
  }

  function commonsPage(name) {
    return "https://commons.wikimedia.org/wiki/File:" +
      encodeURIComponent(name);
  }

  const slides = [
    {
      id: "trachea",
      title: "Traqueia",
      subtitle: "Epitélio respiratório e cartilagem hialina",
      category: "epitelial",
      type: "Tecido epitelial respiratório",
      stain: "H&E",
      file: "Traqueia – HE – 20x.jpg",
      zoomFiles: [
        "Traqueia – HE – 20x.jpg",
        "Traqueia – HE – 100x.jpg",
        "Traqueia2 – HE – 400x.jpg"
      ],
      magnifications: ["20×", "100×", "400×"],
      lead: "Reconheça a mucosa respiratória, glândulas submucosas e cartilagem hialina.",
      recognize: "Procure um lúmen revestido por epitélio pseudoestratificado ciliado, glândulas na submucosa e grandes placas de cartilagem hialina.",
      cells: ["células ciliadas", "células caliciformes", "células basais", "condrócitos"],
      func: "Conduzir o ar, filtrar partículas pelo aparelho mucociliar e manter a via aérea pérvia.",
      zoom: [
        "Em baixa magnificação, identifique primeiro o lúmen, a mucosa e a grande área de cartilagem.",
        "Em média magnificação, compare epitélio, lâmina própria e glândulas da submucosa.",
        "Em alta magnificação, procure cílios, células caliciformes e condrócitos em lacunas."
      ],
      hotspots: [
        { x: 32, y: 24, title: "Epitélio pseudoestratificado ciliado", text: "Núcleos em diferentes alturas, cílios no polo apical e presença de células caliciformes.", cells: ["ciliadas", "caliciformes", "basais"] },
        { x: 54, y: 44, title: "Glândulas submucosas", text: "Ácinos seromucosos localizados abaixo da mucosa ajudam a umidificar a via aérea.", cells: ["células mucosas", "células serosas"] },
        { x: 72, y: 70, title: "Cartilagem hialina", text: "Matriz homogênea com condrócitos dentro de lacunas. Dá sustentação à parede traqueal.", cells: ["condrócitos"] }
      ]
    },
    {
      id: "lung",
      title: "Pulmão",
      subtitle: "Bronquíolos e alvéolos",
      category: "epitelial",
      type: "Sistema respiratório",
      stain: "H&E",
      file: "Human tertiary bronchus - Respiratory bronchiole.jpg",
      magnifications: ["campo", "detalhe", "alto zoom"],
      lead: "Observe espaços alveolares, septos finos e vias aéreas de pequeno calibre.",
      recognize: "A grande quantidade de espaços vazios separados por septos delgados é o principal padrão do parênquima pulmonar.",
      cells: ["pneumócitos I", "pneumócitos II", "macrófagos alveolares"],
      func: "Realizar trocas gasosas e manter uma barreira alvéolo-capilar extremamente delgada.",
      zoom: [
        "Em baixa magnificação, procure o aspecto esponjoso do parênquima.",
        "Aproxime para diferenciar bronquíolos dos espaços alveolares.",
        "Em alta magnificação, observe septos e células que revestem os alvéolos."
      ],
      hotspots: [
        { x: 27, y: 35, title: "Alvéolos", text: "Pequenos espaços aéreos delimitados por septos muito finos.", cells: ["pneumócitos I", "pneumócitos II"] },
        { x: 57, y: 48, title: "Septo alveolar", text: "Contém capilares e constitui parte da barreira de troca gasosa.", cells: ["endotélio capilar", "pneumócitos"] },
        { x: 74, y: 63, title: "Via aérea distal", text: "O revestimento fica progressivamente mais simples conforme a via aérea diminui.", cells: ["células epiteliais", "células club"] }
      ]
    },
    {
      id: "liver",
      title: "Fígado",
      subtitle: "Hepatócitos e sinusóides",
      category: "glandular",
      type: "Órgão glandular",
      stain: "H&E",
      file: "Liver (254 13).jpg",
      magnifications: ["300×", "zoom digital", "zoom digital"],
      lead: "Observe cordões de hepatócitos separados por sinusóides.",
      recognize: "Hepatócitos são células grandes e eosinofílicas, frequentemente com núcleo central evidente, organizadas em placas.",
      cells: ["hepatócitos", "células de Kupffer", "endotélio sinusoidal"],
      func: "Metabolismo, síntese proteica, detoxificação, armazenamento e produção de bile.",
      zoom: [
        "Na visão geral, reconheça o padrão sólido do parênquima hepático.",
        "Aproxime para encontrar cordões celulares e sinusóides.",
        "Em alta magnificação, observe núcleos e nucléolos dos hepatócitos."
      ],
      hotspots: [
        { x: 30, y: 34, title: "Cordões de hepatócitos", text: "Placas de células grandes, poliédricas e com citoplasma eosinofílico.", cells: ["hepatócitos"] },
        { x: 58, y: 52, title: "Sinusóide hepático", text: "Canal vascular entre os cordões de hepatócitos.", cells: ["endotélio", "células de Kupffer"] },
        { x: 72, y: 28, title: "Núcleo do hepatócito", text: "Núcleo arredondado central; alguns hepatócitos podem ser binucleados.", cells: ["hepatócitos"] }
      ]
    },
    {
      id: "kidney",
      title: "Rim",
      subtitle: "Glomérulos e túbulos renais",
      category: "epitelial",
      type: "Sistema urinário",
      stain: "H&E",
      file: "Kidney cortex (947 21) Human.jpg",
      zoomFiles: [
        "Kidney cortex (947 21) Human.jpg",
        "Kidney cortex (947 22) Human.jpg",
        "Glomerulus.jpg"
      ],
      magnifications: ["600×", "1200×", "glomérulo"],
      lead: "Procure corpúsculos renais arredondados entre numerosos túbulos.",
      recognize: "O córtex renal mostra glomérulos e grande quantidade de túbulos em cortes transversais e longitudinais.",
      cells: ["podócitos", "células endoteliais", "epitélio tubular"],
      func: "Filtrar o plasma, ajustar composição do filtrado e manter equilíbrio hidroeletrolítico.",
      zoom: [
        "Em baixa magnificação, identifique regiões com muitos túbulos e corpúsculos renais.",
        "Aproxime para diferenciar glomérulo, cápsula e túbulos.",
        "Em alta magnificação, compare o epitélio do túbulo proximal com o distal."
      ],
      hotspots: [
        { x: 35, y: 34, title: "Glomérulo", text: "Tufo capilar arredondado dentro da cápsula de Bowman.", cells: ["endotélio", "podócitos", "mesangiais"] },
        { x: 61, y: 49, title: "Túbulo proximal", text: "Epitélio cúbico mais eosinofílico e lúmen menos nítido pela borda em escova.", cells: ["epitélio cúbico"] },
        { x: 69, y: 72, title: "Túbulo distal", text: "Lúmen geralmente mais aberto e células menos eosinofílicas.", cells: ["epitélio cúbico"] }
      ]
    },
    {
      id: "muscle",
      title: "Músculo esquelético",
      subtitle: "Fibras estriadas e núcleos periféricos",
      category: "muscular",
      type: "Tecido muscular estriado",
      stain: "H&E",
      file: "Skeletal muscle histology.jpg",
      magnifications: ["campo", "detalhe", "alto zoom"],
      lead: "Observe fibras longas paralelas, estriações e núcleos periféricos.",
      recognize: "Fibras multinucleadas, alongadas e organizadas paralelamente, com núcleos localizados na periferia.",
      cells: ["fibras musculares", "células satélite", "fibroblastos"],
      func: "Produzir força e movimento voluntário.",
      zoom: [
        "Na visão geral, perceba a orientação paralela das fibras.",
        "Aproxime para observar diâmetro e limites das fibras.",
        "Em alta magnificação, procure estriações e núcleos periféricos."
      ],
      hotspots: [
        { x: 27, y: 37, title: "Fibra muscular", text: "Cada fibra é uma célula longa e multinucleada.", cells: ["miócitos esqueléticos"] },
        { x: 56, y: 48, title: "Estriações", text: "Alternância regular de bandas claras e escuras relacionada à organização dos sarcômeros.", cells: ["miofibrilas"] },
        { x: 76, y: 65, title: "Núcleo periférico", text: "Característica útil para diferenciar músculo esquelético de cardíaco.", cells: ["núcleos de miócitos"] }
      ]
    },
    {
      id: "thyroid",
      title: "Tireoide",
      subtitle: "Folículos e coloide",
      category: "glandular",
      type: "Glândula endócrina",
      stain: "H&E",
      file: "Thyroid gland microscope.jpg",
      magnifications: ["campo", "detalhe", "alto zoom"],
      lead: "Observe numerosos folículos esféricos preenchidos por coloide.",
      recognize: "Folículos revestidos por epitélio cúbico simples e preenchidos por material eosinofílico homogêneo.",
      cells: ["células foliculares", "células parafoliculares"],
      func: "Sintetizar, armazenar e secretar hormônios tireoidianos.",
      zoom: [
        "Em baixa magnificação, procure o padrão repetitivo de folículos.",
        "Aproxime para avaliar o tamanho dos folículos e o coloide.",
        "Em alta magnificação, observe o epitélio folicular."
      ],
      hotspots: [
        { x: 29, y: 33, title: "Folículo tireoidiano", text: "Unidade esférica revestida por células foliculares.", cells: ["células foliculares"] },
        { x: 55, y: 51, title: "Coloide", text: "Material eosinofílico dentro do folículo, rico em tireoglobulina.", cells: ["tireoglobulina"] },
        { x: 75, y: 67, title: "Epitélio folicular", text: "Epitélio geralmente cúbico simples, cuja altura varia com atividade funcional.", cells: ["células foliculares"] }
      ]
    },
    {
      id: "cerebellum",
      title: "Cerebelo",
      subtitle: "Camadas cortical e células de Purkinje",
      category: "nervoso",
      type: "Tecido nervoso",
      stain: "H&E",
      file: "CEREBELLUM HE.jpg",
      magnifications: ["campo", "camadas", "alto zoom"],
      lead: "Reconheça o córtex cerebelar organizado em camadas bem definidas.",
      recognize: "Procure uma camada molecular clara, uma fileira de grandes células de Purkinje e uma camada granulosa muito basófila.",
      cells: ["Purkinje", "células granulares", "células estreladas", "glia"],
      func: "Coordenação motora, equilíbrio e ajuste fino dos movimentos.",
      zoom: [
        "Em baixa magnificação, reconheça as folhas cerebelares.",
        "Aproxime para separar camada molecular e granulosa.",
        "Em alta magnificação, procure a fileira de células de Purkinje."
      ],
      hotspots: [
        { x: 29, y: 31, title: "Camada molecular", text: "Camada mais clara, relativamente pobre em corpos celulares.", cells: ["células estreladas", "fibras"] },
        { x: 52, y: 50, title: "Células de Purkinje", text: "Grandes neurônios em fileira única entre as camadas molecular e granulosa.", cells: ["Purkinje"] },
        { x: 73, y: 70, title: "Camada granulosa", text: "Muito basófila pela grande densidade de pequenos neurônios.", cells: ["células granulares"] }
      ]
    },
    {
      id: "small-intestine",
      title: "Intestino delgado",
      subtitle: "Vilosidades e mucosa intestinal",
      category: "epitelial",
      type: "Sistema digestório",
      stain: "H&E",
      file: "Small intestine low mag.jpg",
      magnifications: ["campo", "vilosidades", "alto zoom"],
      lead: "Observe a mucosa formando projeções digitiformes em direção ao lúmen.",
      recognize: "As vilosidades são projeções da mucosa revestidas por epitélio cilíndrico simples, com tecido conjuntivo no eixo.",
      cells: ["enterócitos", "células caliciformes", "linfócitos"],
      func: "Aumentar a superfície de absorção e participar da digestão e defesa da mucosa.",
      zoom: [
        "Em baixa magnificação, reconheça as vilosidades projetando-se para o lúmen.",
        "Aproxime para comparar o epitélio de revestimento e o eixo conjuntivo das vilosidades.",
        "Em alto zoom, procure enterócitos, células caliciformes e núcleos da lâmina própria."
      ],
      hotspots: [
        { x: 30, y: 30, title: "Vilosidade intestinal", text: "Projeção da mucosa que aumenta a área de absorção.", cells: ["enterócitos", "células caliciformes"] },
        { x: 54, y: 48, title: "Epitélio cilíndrico simples", text: "Revestimento com enterócitos e células caliciformes.", cells: ["enterócitos", "células caliciformes"] },
        { x: 70, y: 68, title: "Lâmina própria", text: "Tecido conjuntivo do eixo da vilosidade, contendo vasos e células imunes.", cells: ["linfócitos", "fibroblastos"] }
      ]
    }
  ];

  const state = {
    slide: slides[0],
    scale: 1,
    x: 0,
    y: 0,
    mode: "learn",
    dragging: false,
    lastX: 0,
    lastY: 0,
    filter: "all",
    search: ""
  };

  const $ = function (id) {
    return document.getElementById(id);
  };

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = String(value == null ? "" : value);
    return div.innerHTML;
  }

  function slideFileForZoom(slide, index) {
    if (
      Array.isArray(slide.zoomFiles) &&
      slide.zoomFiles[index]
    ) {
      return slide.zoomFiles[index];
    }

    return slide.file;
  }

  function slideImage(slide, index) {
    return commonsFile(
      slideFileForZoom(
        slide,
        typeof index === "number"
          ? index
          : 0
      )
    );
  }

  function slideSource(slide, index) {
    return commonsPage(
      slideFileForZoom(
        slide,
        typeof index === "number"
          ? index
          : 0
      )
    );
  }

  function magnificationLabel(scale) {
    const index =
      zoomIndex(scale);

    if (
      state.slide &&
      Array.isArray(state.slide.magnifications) &&
      state.slide.magnifications[index]
    ) {
      return state.slide.magnifications[index];
    }

    return index === 0
      ? "campo"
      : index === 1
        ? "detalhe"
        : "alto zoom";
  }

  function zoomIndex(scale) {
    if (scale < 1.4) return 0;
    if (scale < 2.2) return 1;
    return 2;
  }

  function updateTransform() {
    const layer = $("slideLayer");
    if (!layer) return;

    layer.style.transform =
      "translate(" + state.x + "px," + state.y + "px) scale(" + state.scale + ")";

    const inverse =
      Math.max(.46, 1 / state.scale);

    document
      .querySelectorAll(".histology-hotspot")
      .forEach(function (hotspot) {
        hotspot.style.setProperty(
          "--hotspot-scale",
          String(inverse)
        );
      });

    const mag =
      magnificationLabel(
        state.scale
      );

    $("zoomLabel").textContent =
      mag;

    $("scopeMagnification").textContent =
      mag;

    const index =
      zoomIndex(
        state.scale
      );

    const activeFile =
      slideFileForZoom(
        state.slide,
        index
      );

    if (
      layer.dataset.activeFile !==
      activeFile
    ) {
      layer.dataset.activeFile =
        activeFile;

      layer.style.backgroundImage =
        'url("' +
        commonsFile(activeFile) +
        '")';

      $("slideSourceLink").href =
        commonsPage(activeFile);
    }

    $("scaleLabel").textContent =
      index === 0
        ? "arquitetura"
        : index === 1
          ? "camadas"
          : "detalhes celulares";

    $("zoomNarration").textContent =
      state.slide.zoom[index];

    $("zoomTeachingText").textContent =
      state.slide.zoom[index];

    document
      .querySelectorAll("[data-zoom-level]")
      .forEach(function (button, buttonIndex) {
        button.classList.toggle(
          "active",
          buttonIndex === index
        );
      });
  }

  function setScale(nextScale) {
    state.scale =
      Math.min(
        3.2,
        Math.max(
          1,
          nextScale
        )
      );

    if (state.scale === 1) {
      state.x = 0;
      state.y = 0;
    }

    updateTransform();
  }

  function resetView() {
    state.scale = 1;
    state.x = 0;
    state.y = 0;
    updateTransform();
  }

  function renderInspector(slide, hotspot) {
    const focus =
      hotspot || null;

    $("inspectorState").textContent =
      focus
        ? "Estrutura selecionada"
        : "Visão geral";

    $("inspectorType").textContent =
      focus
        ? "ESTRUTURA"
        : slide.type.toUpperCase();

    $("inspectorTitle").textContent =
      focus
        ? focus.title
        : slide.title;

    $("inspectorLead").textContent =
      focus
        ? focus.text
        : slide.lead;

    $("inspectorRecognize").textContent =
      focus
        ? focus.text
        : slide.recognize;

    $("inspectorFunction").textContent =
      focus
        ? "Relacione esta estrutura com a função geral do órgão: " + slide.func
        : slide.func;

    const cells =
      focus && focus.cells && focus.cells.length
        ? focus.cells
        : slide.cells;

    $("cellChips").innerHTML =
      cells
        .map(function (cell) {
          return "<span>" +
            escapeHtml(cell) +
            "</span>";
        })
        .join("");
  }

  function renderHotspots(slide) {
    const layer =
      $("hotspotLayer");

    layer.innerHTML =
      slide.hotspots
        .map(function (hotspot, index) {
          return (
            '<button class="histology-hotspot" ' +
            'type="button" ' +
            'data-hotspot="' + index + '" ' +
            'style="left:' + hotspot.x + '%;top:' + hotspot.y + '%" ' +
            'aria-label="' + escapeHtml(hotspot.title) + '">' +
            "</button>"
          );
        })
        .join("");

    layer
      .querySelectorAll("[data-hotspot]")
      .forEach(function (button) {
        const index =
          Number(
            button.dataset.hotspot
          );

        const hotspot =
          slide.hotspots[index];

        button.addEventListener(
          "mouseenter",
          function (event) {
            showTooltip(
              hotspot,
              event
            );

            if (
              state.mode ===
              "learn"
            ) {
              renderInspector(
                slide,
                hotspot
              );
            }
          }
        );

        button.addEventListener(
          "mouseleave",
          function () {
            hideTooltip();

            if (
              state.mode ===
              "learn"
            ) {
              renderInspector(
                slide,
                null
              );
            }
          }
        );

        button.addEventListener(
          "click",
          function (event) {
            event.stopPropagation();

            document
              .querySelectorAll(".histology-hotspot")
              .forEach(function (item) {
                item.classList.remove(
                  "active"
                );
              });

            button.classList.add(
              "active"
            );

            if (
              state.mode ===
              "test"
            ) {
              startHotspotTest(
                hotspot
              );
            }
            else {
              renderInspector(
                slide,
                hotspot
              );
            }
          }
        );
      });
  }

  function showTooltip(hotspot, event) {
    const tooltip =
      $("hoverTooltip");

    tooltip.innerHTML =
      "<strong>" +
      escapeHtml(
        state.mode === "test"
          ? "Clique para identificar"
          : hotspot.title
      ) +
      "</strong>" +
      (
        state.mode === "learn"
          ? "<br>" + escapeHtml(hotspot.text)
          : ""
      );

    tooltip.hidden =
      false;

    const viewport =
      $("microscopeViewport")
        .getBoundingClientRect();

    tooltip.style.left =
      Math.min(
        viewport.width - 250,
        Math.max(
          8,
          event.clientX -
          viewport.left +
          12
        )
      ) +
      "px";

    tooltip.style.top =
      Math.min(
        viewport.height - 90,
        Math.max(
          8,
          event.clientY -
          viewport.top +
          12
        )
      ) +
      "px";
  }

  function hideTooltip() {
    $("hoverTooltip").hidden =
      true;
  }

  function renderSlide(slide) {
    state.slide =
      slide;

    resetView();

    const layer =
      $("slideLayer");

    const initialFile =
      slideFileForZoom(
        slide,
        0
      );

    layer.dataset.activeFile =
      initialFile;

    layer.style.backgroundImage =
      'url("' +
      commonsFile(initialFile) +
      '")';

    $("scopeSlideName").textContent =
      slide.title;

    $("scopeStain").textContent =
      slide.stain;

    $("slideTitle").textContent =
      slide.title;

    $("slideSubtitle").textContent =
      slide.subtitle;

    $("slideSourceLink").href =
      slideSource(
        slide,
        0
      );

    $("slideSourceLink").textContent =
      "Wikimedia Commons ↗";

    renderHotspots(
      slide
    );

    renderInspector(
      slide,
      null
    );

    document
      .querySelectorAll(".slide-item")
      .forEach(function (item) {
        item.classList.toggle(
          "active",
          item.dataset.slideId ===
          slide.id
        );
      });
  }

  function filteredSlides() {
    const query =
      state.search
        .trim()
        .toLocaleLowerCase(
          "pt-BR"
        );

    return slides.filter(
      function (slide) {
        const matchesFilter =
          state.filter === "all" ||
          slide.category ===
          state.filter;

        const haystack =
          (
            slide.title +
            " " +
            slide.subtitle +
            " " +
            slide.type +
            " " +
            slide.cells.join(" ")
          )
            .toLocaleLowerCase(
              "pt-BR"
            );

        return (
          matchesFilter &&
          (
            !query ||
            haystack.includes(
              query
            )
          )
        );
      }
    );
  }

  function renderLibrary() {
    const items =
      filteredSlides();

    $("libraryCount").textContent =
      String(
        items.length
      );

    $("slideList").innerHTML =
      items
        .map(function (slide) {
          return (
            '<button class="slide-item ' +
            (
              slide.id === state.slide.id
                ? "active"
                : ""
            ) +
            '" type="button" data-slide-id="' +
            escapeHtml(slide.id) +
            '">' +
              '<span class="slide-thumb" style="background-image:url(&quot;' +
              escapeHtml(slideImage(slide, 0)) +
              '&quot;)"></span>' +
              "<span>" +
                "<strong>" +
                  escapeHtml(slide.title) +
                "</strong>" +
                "<span>" +
                  escapeHtml(slide.subtitle) +
                "</span>" +
                "<small>" +
                  escapeHtml(slide.stain) +
                  " · lâmina real" +
                "</small>" +
              "</span>" +
            "</button>"
          );
        })
        .join("");

    document
      .querySelectorAll("[data-slide-id]")
      .forEach(function (button) {
        button.addEventListener(
          "click",
          function () {
            const slide =
              slides.find(
                function (item) {
                  return (
                    item.id ===
                    button.dataset.slideId
                  );
                }
              );

            if (slide) {
              renderSlide(
                slide
              );
            }
          }
        );
      });
  }

  function setMode(mode) {
    state.mode =
      mode;

    $("learnMode").classList.toggle(
      "active",
      mode === "learn"
    );

    $("testMode").classList.toggle(
      "active",
      mode === "test"
    );

    $("microscopeViewport").classList.toggle(
      "test-mode",
      mode === "test"
    );

    $("testPrompt").hidden =
      mode !== "test";

    if (
      mode === "test"
    ) {
      $("testQuestion").textContent =
        "Clique em um ponto da lâmina e identifique a estrutura.";

      $("testAnswers").innerHTML =
        "";

      $("testFeedback").textContent =
        "";

      $("inspectorState").textContent =
        "Modo teste";
    }
    else {
      renderInspector(
        state.slide,
        null
      );
    }
  }

  function startHotspotTest(hotspot) {
    const alternatives =
      state.slide.hotspots
        .map(function (item) {
          return item.title;
        })
        .filter(function (title) {
          return (
            title !==
            hotspot.title
          );
        })
        .slice(0, 3);

    alternatives.push(
      hotspot.title
    );

    for (
      let i =
        alternatives.length -
        1;
      i > 0;
      i--
    ) {
      const j =
        Math.floor(
          Math.random() *
          (i + 1)
        );

      [
        alternatives[i],
        alternatives[j]
      ] =
      [
        alternatives[j],
        alternatives[i]
      ];
    }

    $("testQuestion").textContent =
      "Qual estrutura foi marcada?";

    $("testFeedback").textContent =
      "";

    $("testAnswers").innerHTML =
      alternatives
        .map(function (answer) {
          return (
            '<button type="button" data-test-answer="' +
            escapeHtml(answer) +
            '">' +
            escapeHtml(answer) +
            "</button>"
          );
        })
        .join("");

    $("testAnswers")
      .querySelectorAll("[data-test-answer]")
      .forEach(function (button) {
        button.addEventListener(
          "click",
          function () {
            const correct =
              button.dataset.testAnswer ===
              hotspot.title;

            $("testAnswers")
              .querySelectorAll("button")
              .forEach(function (item) {
                item.disabled =
                  true;

                if (
                  item.dataset.testAnswer ===
                  hotspot.title
                ) {
                  item.classList.add(
                    "correct"
                  );
                }
              });

            if (!correct) {
              button.classList.add(
                "wrong"
              );
            }

            $("testFeedback").textContent =
              correct
                ? "Correto. " + hotspot.text
                : "Ainda não. A estrutura é " + hotspot.title + ". " + hotspot.text;

            renderInspector(
              state.slide,
              hotspot
            );
          }
        );
      });
  }

  function bindViewer() {
    const viewport =
      $("microscopeViewport");

    viewport.addEventListener(
      "wheel",
      function (event) {
        event.preventDefault();

        setScale(
          state.scale +
          (
            event.deltaY < 0
              ? .18
              : -.18
          )
        );
      },
      {
        passive:
          false
      }
    );

    viewport.addEventListener(
      "pointerdown",
      function (event) {
        state.dragging =
          true;

        state.lastX =
          event.clientX;

        state.lastY =
          event.clientY;

        viewport.classList.add(
          "dragging"
        );

        viewport.setPointerCapture(
          event.pointerId
        );
      }
    );

    viewport.addEventListener(
      "pointermove",
      function (event) {
        if (
          !state.dragging
        ) {
          return;
        }

        state.x +=
          event.clientX -
          state.lastX;

        state.y +=
          event.clientY -
          state.lastY;

        state.lastX =
          event.clientX;

        state.lastY =
          event.clientY;

        updateTransform();
      }
    );

    viewport.addEventListener(
      "pointerup",
      function (event) {
        state.dragging =
          false;

        viewport.classList.remove(
          "dragging"
        );

        try {
          viewport.releasePointerCapture(
            event.pointerId
          );
        }
        catch (error) {}
      }
    );

    viewport.addEventListener(
      "pointercancel",
      function () {
        state.dragging =
          false;

        viewport.classList.remove(
          "dragging"
        );
      }
    );
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

      const data =
        await response.json();

      const user =
        data.usuario || {};

      const name =
        user.nome ||
        "Cortex";

      $("nomeSidebar").textContent =
        name;

      $("emailSidebar").textContent =
        user.email || "";

      $("avatarSidebar").textContent =
        name
          .charAt(0)
          .toUpperCase();
    }
    catch (error) {
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

  function bindEvents() {
    $("zoomIn").addEventListener(
      "click",
      function () {
        setScale(
          state.scale +
          .35
        );
      }
    );

    $("zoomOut").addEventListener(
      "click",
      function () {
        setScale(
          state.scale -
          .35
        );
      }
    );

    $("resetView").addEventListener(
      "click",
      resetView
    );

    $("fullscreenViewer").addEventListener(
      "click",
      function () {
        const viewport =
          $("microscopeViewport");

        if (
          document.fullscreenElement
        ) {
          document.exitFullscreen();
        }
        else if (
          viewport.requestFullscreen
        ) {
          viewport.requestFullscreen();
        }
      }
    );

    $("learnMode").addEventListener(
      "click",
      function () {
        setMode(
          "learn"
        );
      }
    );

    $("testMode").addEventListener(
      "click",
      function () {
        setMode(
          "test"
        );
      }
    );

    document
      .querySelectorAll("[data-zoom-level]")
      .forEach(function (button) {
        button.addEventListener(
          "click",
          function () {
            setScale(
              Number(
                button.dataset.zoomLevel
              )
            );
          }
        );
      });

    document
      .querySelectorAll("[data-slide-filter]")
      .forEach(function (button) {
        button.addEventListener(
          "click",
          function () {
            state.filter =
              button.dataset.slideFilter ||
              "all";

            document
              .querySelectorAll("[data-slide-filter]")
              .forEach(function (item) {
                item.classList.toggle(
                  "active",
                  item === button
                );
              });

            renderLibrary();
          }
        );
      });

    $("slideSearch").addEventListener(
      "input",
      function (event) {
        state.search =
          event.target.value;

        renderLibrary();
      }
    );

    $("logoutSidebar").addEventListener(
      "click",
      logout
    );

    bindViewer();
  }

  function preloadFirstSlide() {
    const img =
      new Image();

    img.onload =
      function () {
        $("slideLayer").style.opacity =
          "1";
      };

    img.onerror =
      function () {
        console.error(
          "Não foi possível carregar a lâmina inicial."
        );
      };

    img.src =
      slideImage(
        slides[0]
      );
  }

  function init() {
    $("slideCount").textContent =
      String(
        slides.length
      );

    bindEvents();
    renderLibrary();
    renderSlide(
      slides[0]
    );
    preloadFirstSlide();
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