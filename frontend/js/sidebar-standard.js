(function () {

  "use strict";


  /* =======================================================
     MANTER PAGINAS INTERNAS DENTRO DO /APP
  ======================================================= */

  function ensureCortexShell() {

    if (
      window.parent !==
      window
    ) {

      return false;

    }


    const path =
      window.location.pathname ||
      "/";


    if (
      path === "/app" ||
      path === "/app.html" ||
      path === "/login" ||
      path === "/login.html" ||
      path === "/cadastro" ||
      path === "/cadastro.html"
    ) {

      return false;

    }


    const view =
      path +
      window.location.search;


    window.location.replace(
      "/app?view=" +
      encodeURIComponent(
        view
      )
    );


    return true;

  }


  if (
    ensureCortexShell()
  ) {

    return;

  }


  function icon(
    paths
  ) {

    return (
      '<span class="menu-icon cortex-nav-icon">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          paths +
        '</svg>' +
      '</span>'
    );

  }


  const icons = {

    dashboard:
      icon(
        '<path d="M4 11.5 12 5l8 6.5"/>' +
        '<path d="M6.5 10.5V19h11v-8.5"/>' +
        '<path d="M9.5 19v-5h5v5"/>'
      ),

    simulado:
      icon(
        '<rect x="5" y="3.5" width="14" height="17" rx="2.5"/>' +
        '<path d="M9 8h6"/>' +
        '<path d="m9 12 1.7 1.7L15 9.5"/>' +
        '<path d="M9 17h6"/>'
      ),

    questoes:
      icon(
        '<rect x="5" y="4" width="14" height="16" rx="3"/>' +
        '<path d="M9 9h6"/>' +
        '<path d="M9 13h6"/>' +
        '<path d="M9 17h3"/>'
      ),

    flashcards:
      icon(
        '<rect x="4" y="6" width="14" height="12" rx="2"/>' +
        '<path d="m8 6 2-2h10v12l-2 2"/>'
      ),

    lousa:
      icon(
        '<rect x="4" y="4" width="16" height="13" rx="2"/>' +
        '<path d="M8 21h8"/>' +
        '<path d="M12 17v4"/>' +
        '<path d="m7 13 3-3 2 2 5-5"/>'
      ),

    farmacos:
      icon(
        '<path d="M8.1 4.6a5 5 0 0 1 7.1 0l4.2 4.2a5 5 0 0 1-7.1 7.1l-4.2-4.2a5 5 0 0 1 0-7.1Z"/>' +
        '<path d="m9.2 12.8 6.4-6.4"/>'
      ),

    sigaa:
      icon(
        '<rect x="4" y="5" width="16" height="15" rx="2"/>' +
        '<path d="M8 3v4"/>' +
        '<path d="M16 3v4"/>' +
        '<path d="M4 9h16"/>' +
        '<path d="M8 13h3"/>' +
        '<path d="M8 16h6"/>'
      ),

    casos:
      icon(
        '<path d="M8 5h8"/>' +
        '<path d="M10 3h4v4h-4z"/>' +
        '<rect x="5" y="6" width="14" height="15" rx="3"/>' +
        '<path d="M12 10v7"/>' +
        '<path d="M8.5 13.5h7"/>'
      ),

    laboratorio:
      icon(
        '<path d="M9 3h6"/>' +
        '<path d="M10 3v6l-5 8a2.5 2.5 0 0 0 2.2 4h9.6A2.5 2.5 0 0 0 19 17l-5-8V3"/>' +
        '<path d="M7.5 15h9"/>'
      ),

    evolucao:
      icon(
        '<path d="M5 19h14"/>' +
        '<path d="m7 15 3-4 3 2 4-6"/>' +
        '<path d="M15 7h2v2"/>'
      ),

    desempenho:
      icon(
        '<path d="M5 19V10"/>' +
        '<path d="M10 19V5"/>' +
        '<path d="M15 19v-7"/>' +
        '<path d="M20 19V8"/>'
      ),

    ranking:
      icon(
        '<path d="M8 21h8"/>' +
        '<path d="M12 17v4"/>' +
        '<path d="M7 4h10v4a5 5 0 0 1-10 0z"/>' +
        '<path d="M7 6H4v1a4 4 0 0 0 4 4"/>' +
        '<path d="M17 6h3v1a4 4 0 0 1-4 4"/>'
      ),

    financas:
      icon(
        '<circle cx="12" cy="12" r="8"/>' +
        '<path d="M15 8.5h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9"/>' +
        '<path d="M12 6.5v11"/>'
      ),

    musica:
      icon(
        '<path d="M9 18V6l10-2v12"/>' +
        '<circle cx="6.5" cy="18" r="2.5"/>' +
        '<circle cx="16.5" cy="16" r="2.5"/>'
      ),

    configuracoes:
      icon(
        '<circle cx="12" cy="12" r="3"/>' +
        '<path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>'
      )

  };


  const sections = [

    {

      title:
        "Estudo",

      items: [

        {
          href: "/",
          key: "dashboard",
          label: "Dashboard"
        },

        {
          href: "/simulado",
          key: "simulado",
          label: "Simulado"
        },

        {
          href: "/questoes",
          key: "questoes",
          label: "Quest\u00f5es"
        },

        {
          href: "/flashcards",
          key: "flashcards",
          label: "Flashcards"
        },

        {
          href: "/lousa",
          key: "lousa",
          label: "Lousa"
        },

        {
          href: "/farmacos",
          key: "farmacos",
          label: "Farmacologia"
        },

        {
          href: "/sigaa",
          key: "sigaa",
          label: "Acad\u00eamico"
        },

        {
          href: "/casos",
          key: "casos",
          label: "Casos Cl\u00ednicos"
        },

        {
          href: "/laboratorio",
          key: "laboratorio",
          label: "Laborat\u00f3rio"
        },

        {
          href: "/evolucao",
          key: "evolucao",
          label: "Evolu\u00e7\u00e3o"
        }

      ]

    },


    {

      title:
        "An\u00e1lise",

      items: [

        {
          href: "/desempenho",
          key: "desempenho",
          label: "Desempenho"
        },

        {
          href: "/ranking",
          key: "ranking",
          label: "Ranking"
        }

      ]

    },


    {

      title:
        "Pessoal",

      items: [

        {
          href: "/financas",
          key: "financas",
          label: "Finan\u00e7as"
        },

        {
          href: "/musica",
          key: "musica",
          label: "M\u00fasica"
        },

        {
          href: "/configuracoes",
          key: "configuracoes",
          label: "Configura\u00e7\u00f5es"
        }

      ]

    }

  ];


  function currentRoute() {

    let path =
      window.location.pathname ||
      "/";


    path =
      path.replace(
        /\.html$/,
        ""
      );


    if (
      path === "/index" ||
      path === ""
    ) {

      return "/";

    }


    if (
      path === "/caso"
    ) {

      return "/casos";

    }


    return path;

  }


  function isActive(
    href
  ) {

    const current =
      currentRoute();


    if (
      href === "/"
    ) {

      return current === "/";

    }


    if (
      href === "/casos"
    ) {

      return (
        current === "/casos" ||
        current.startsWith(
          "/casos/"
        )
      );

    }


    return current ===
      href;

  }


  function renderItem(
    item
  ) {

    const active =
      isActive(
        item.href
      );


    return (
      '<a ' +
        'href="' +
        item.href +
        '" ' +
        'data-cortex-nav="' +
        item.href +
        '" ' +
        'class="menu-item' +
        (
          active
            ? ' active'
            : ''
        ) +
        '">' +

        icons[
          item.key
        ] +

        '<span class="cortex-nav-label">' +
          item.label +
        '</span>' +

      '</a>'
    );

  }


  function renderMenu() {

    return sections
      .map(
        function (
          section
        ) {

          return (
            '<div class="menu-group">' +

              '<div class="menu-title">' +
                section.title +
              '</div>' +

              section.items
                .map(
                  renderItem
                )
                .join("") +

            '</div>'
          );

        }
      )
      .join("");

  }


  function applySidebar() {

    const menus =
      document.querySelectorAll(
        ".sidebar-menu"
      );


    const content =
      renderMenu();


    menus.forEach(
      function (
        menu
      ) {

        menu.innerHTML =
          content;

      }
    );

  }


  /* =======================================================
     NAVEGACAO ACELERADA
  ======================================================= */

  const prefetchedRoutes =
    new Set();


  function normalizedNavigationPath(
    href
  ) {

    const value =
      String(
        href ||
        ""
      );


    if (
      value === "/"
    ) {
      return "/index.html";
    }


    return value;

  }


  function prefetchRoute(
    href
  ) {

    const route =
      normalizedNavigationPath(
        href
      );


    if (
      !route ||
      prefetchedRoutes.has(
        route
      )
    ) {
      return;
    }


    prefetchedRoutes.add(
      route
    );


    fetch(
      route,
      {
        method:
          "GET",

        credentials:
          "same-origin",

        cache:
          "force-cache",
      }
    )
      .catch(
        function () {

          prefetchedRoutes.delete(
            route
          );

        }
      );

  }


  function setOptimisticActive(
    href
  ) {

    document
      .querySelectorAll(
        ".sidebar-menu .menu-item"
      )
      .forEach(
        function (
          item
        ) {

          item.classList.toggle(
            "active",
            item.getAttribute(
              "href"
            ) ===
              href
          );

        }
      );

  }


  function enhanceFastNavigation() {

    document
      .querySelectorAll(
        ".sidebar-menu .menu-item"
      )
      .forEach(
        function (
          link
        ) {

          if (
            link.dataset
              .cortexFastNav ===
            "1"
          ) {
            return;
          }


          link.dataset
            .cortexFastNav =
            "1";


          const href =
            link.getAttribute(
              "href"
            );


          if (!href) {
            return;
          }


          link.addEventListener(
            "pointerenter",
            function () {

              prefetchRoute(
                href
              );

            },
            {
              passive:
                true
            }
          );


          link.addEventListener(
            "pointerdown",
            function () {

              prefetchRoute(
                href
              );


              setOptimisticActive(
                href
              );

            },
            {
              passive:
                true
            }
          );


          link.addEventListener(
            "click",
            function (
              event
            ) {

              if (
                event.defaultPrevented ||
                event.button > 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              ) {
                return;
              }


              const targetRoute =
                href === "/"
                  ? "/"
                  : href
                      .replace(
                        /\.html$/,
                        ""
                      );


              if (
                currentRoute() ===
                  targetRoute
              ) {

                event.preventDefault();

                return;

              }


              if (
                window.parent !==
                window
              ) {

                event.preventDefault();


                window.parent
                  .postMessage(
                    {
                      type:
                        "cortex:navigate",

                      href:
                        href,
                    },
                    window.location
                      .origin
                  );

              }

            }
          );

        }
      );

  }


  /* =======================================================
     MOBILE - IMPLEMENTACAO UNICA
  ======================================================= */

  function cleanupLegacyMobileArtifacts() {

    document
      .querySelectorAll(
        [
          "#mobileOverlay",
          "#abrirMenu",
          "#fecharMenu",
          "#fecharOverlay",
          ".mobile-menu-button",
          ".finance-mobile-button",
          ".finance-mobile-overlay"
        ].join(",")
      )
      .forEach(
        function (
          element
        ) {

          element.remove();

        }
      );

  }


  function setMobileMenuOpen(
    button,
    overlay,
    open
  ) {

    overlay.classList.toggle(
      "open",
      open
    );


    overlay.setAttribute(
      "aria-hidden",
      open
        ? "false"
        : "true"
    );


    button.setAttribute(
      "aria-expanded",
      open
        ? "true"
        : "false"
    );


    document.documentElement
      .classList.toggle(
        "cortex-mobile-menu-open",
        open
      );


    document.body
      .classList.toggle(
        "cortex-mobile-menu-open",
        open
      );


    if (
      open
    ) {

      const menu =
        overlay.querySelector(
          ".cortex-mobile-sidebar-menu"
        );


      const active =
        overlay.querySelector(
          ".menu-item.active"
        );


      if (
        menu &&
        active
      ) {

        window.requestAnimationFrame(
          function () {

            const menuRect =
              menu.getBoundingClientRect();


            const activeRect =
              active.getBoundingClientRect();


            if (
              activeRect.top <
                menuRect.top ||
              activeRect.bottom >
                menuRect.bottom
            ) {

              const target =
                active.offsetTop -
                menu.clientHeight /
                  2 +
                active.clientHeight /
                  2;


              menu.scrollTop =
                Math.max(
                  0,
                  target
                );

            }

          }
        );

      }

    }

  }


  function resetMobileMenuState() {

    document.documentElement
      .classList.remove(
        "cortex-mobile-menu-open"
      );


    document.body
      .classList.remove(
        "cortex-mobile-menu-open"
      );


    const button =
      document.getElementById(
        "cortexMobileSidebarButton"
      );


    const overlay =
      document.getElementById(
        "cortexMobileSidebarOverlay"
      );


    if (
      button
    ) {

      button.setAttribute(
        "aria-expanded",
        "false"
      );

    }


    if (
      overlay
    ) {

      overlay.classList.remove(
        "open"
      );


      overlay.setAttribute(
        "aria-hidden",
        "true"
      );

    }

  }


  function ensureMobileMenu() {

    cleanupLegacyMobileArtifacts();


    document
      .querySelectorAll(
        "#cortexMobileSidebarButton"
      )
      .forEach(
        function (
          element,
          index
        ) {

          if (
            index > 0
          ) {
            element.remove();
          }

        }
      );


    document
      .querySelectorAll(
        "#cortexMobileSidebarOverlay"
      )
      .forEach(
        function (
          element,
          index
        ) {

          if (
            index > 0
          ) {
            element.remove();
          }

        }
      );


    let button =
      document.getElementById(
        "cortexMobileSidebarButton"
      );


    let overlay =
      document.getElementById(
        "cortexMobileSidebarOverlay"
      );


    /*
     * Se apenas metade do componente existir,
     * remove o fragmento e recria o par completo.
     */
    if (
      Boolean(button) !==
      Boolean(overlay)
    ) {

      if (button) {
        button.remove();
      }


      if (overlay) {
        overlay.remove();
      }


      button =
        null;

      overlay =
        null;

    }


    if (
      button &&
      overlay
    ) {

      return;

    }


    button =
      document.createElement(
        "button"
      );


    button.id =
      "cortexMobileSidebarButton";


    button.className =
      "cortex-mobile-sidebar-button";


    button.type =
      "button";


    button.setAttribute(
      "aria-label",
      "Abrir menu"
    );


    button.setAttribute(
      "aria-expanded",
      "false"
    );


    button.setAttribute(
      "aria-controls",
      "cortexMobileSidebarPanel"
    );


    button.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M5 7h14"/>' +
        '<path d="M5 12h14"/>' +
        '<path d="M5 17h14"/>' +
      '</svg>';


    overlay =
      document.createElement(
        "div"
      );


    overlay.id =
      "cortexMobileSidebarOverlay";


    overlay.className =
      "cortex-mobile-sidebar-overlay";


    overlay.setAttribute(
      "aria-hidden",
      "true"
    );


    overlay.innerHTML =
      '<button ' +
        'class="cortex-mobile-sidebar-backdrop" ' +
        'type="button" ' +
        'aria-label="Fechar menu">' +
      '</button>' +

      '<aside ' +
        'id="cortexMobileSidebarPanel" ' +
        'class="cortex-mobile-sidebar-panel" ' +
        'aria-label="Navegacao principal">' +

        '<div class="cortex-mobile-sidebar-header">' +

          '<div>' +
            '<strong>Cortex</strong>' +
            '<span>Study Platform</span>' +
          '</div>' +

          '<button ' +
            'class="cortex-mobile-sidebar-close" ' +
            'type="button" ' +
            'aria-label="Fechar menu">' +
            '&times;' +
          '</button>' +

        '</div>' +

        '<div class="sidebar-menu cortex-mobile-sidebar-menu">' +
          renderMenu() +
        '</div>' +

      '</aside>';


    document.body
      .appendChild(
        button
      );


    document.body
      .appendChild(
        overlay
      );


    const close =
      function () {

        setMobileMenuOpen(
          button,
          overlay,
          false
        );

      };


    button.addEventListener(
      "click",
      function () {

        setMobileMenuOpen(
          button,
          overlay,
          true
        );

      }
    );


    overlay
      .querySelector(
        ".cortex-mobile-sidebar-backdrop"
      )
      .addEventListener(
        "click",
        close
      );


    overlay
      .querySelector(
        ".cortex-mobile-sidebar-close"
      )
      .addEventListener(
        "click",
        close
      );


    overlay
      .querySelectorAll(
        ".menu-item"
      )
      .forEach(
        function (
          link
        ) {

          link.addEventListener(
            "click",
            close
          );

        }
      );


    document.addEventListener(
      "keydown",
      function (
        event
      ) {

        if (
          event.key ===
            "Escape" &&
          overlay.classList
            .contains(
              "open"
            )
        ) {

          close();

        }

      }
    );


    window.addEventListener(
      "resize",
      function () {

        if (
          window.innerWidth >
            900 &&
          overlay.classList
            .contains(
              "open"
            )
        ) {

          close();

        }

      },
      {
        passive:
          true
      }
    );

  }


  window.addEventListener(
      "pageshow",
      function () {

        resetMobileMenuState();

      },
      {
        passive:
          true
      }
    );


  window.addEventListener(
      "orientationchange",
      function () {

        window.setTimeout(
          resetMobileMenuState,
          80
        );

      },
      {
        passive:
          true
      }
    );


  function init() {

    resetMobileMenuState();

    cleanupLegacyMobileArtifacts();

    applySidebar();

    ensureMobileMenu();

    enhanceFastNavigation();

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