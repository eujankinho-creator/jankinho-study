(function () {

  "use strict";


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
      ),

  };


  const sections = [

    {
      title:
        "Estudo",

      items: [

        {
          href: "/",
          key: "dashboard",
          label: "Dashboard",
        },

        {
          href: "/questoes",
          key: "questoes",
          label: "Questões",
        },

        {
          href: "/flashcards",
          key: "flashcards",
          label: "Flashcards",
        },

        {
          href: "/lousa",
          key: "lousa",
          label: "Lousa",
        },

        {
          href: "/farmacos",
          key: "farmacos",
          label: "Farmacologia",
        },
        {
          href: "/sigaa",
          key: "sigaa",
          label: "Acadêmico",
        },

        {
          href: "/casos",
          key: "casos",
          label: "Casos Clínicos",
        },

        {
          href: "/laboratorio",
          key: "laboratorio",
          label: "Laboratório",
        },

        {
          href: "/evolucao",
          key: "evolucao",
          label: "Evolução",
        },

      ],

    },

    {
      title:
        "Análise",

      items: [

        {
          href: "/desempenho",
          key: "desempenho",
          label: "Desempenho",
        },

        {
          href: "/ranking",
          key: "ranking",
          label: "Ranking",
        },

      ],

    },

    {
      title:
        "Pessoal",

      items: [

        {
          href: "/financas",
          key: "financas",
          label: "Finanças",
        },

        {
          href: "/musica",
          key: "musica",
          label: "Música",
        },

        {
          href: "/configuracoes",
          key: "configuracoes",
          label: "Configurações",
        },

      ],

    },

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
        'class="menu-item' +
        (
          active
            ? ' active'
            : ''
        ) +
        '" ' +
        'data-cortex-nav="' +
        item.key +
        '">' +

        icons[item.key] +

        '<span class="cortex-nav-label">' +
          item.label +
        '</span>' +

      '</a>'
    );

  }


  function renderMenu() {

    return sections.map(
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
    ).join("");

  }


  function applyStandardSidebar() {

    const menus =
      document.querySelectorAll(
        ".sidebar-menu"
      );


    if (
      !menus.length
    ) {

      return;

    }


    const content =
      renderMenu();


    menus.forEach(
      function (
        menu
      ) {

        menu.innerHTML =
          content;


        menu.setAttribute(
          "data-cortex-standard-sidebar",
          "true"
        );

      }
    );

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      applyStandardSidebar,
      {
        once:
          true,
      }
    );

  }
  else {

    applyStandardSidebar();

  }


  /*
   * Caso alguma pagina redesenhe o menu depois,
   * reaplica o padrao uma vez.
   */

  window.addEventListener(
    "load",
    function () {

      window.setTimeout(
        applyStandardSidebar,
        0
      );

    },
    {
      once:
        true,
    }
  );

})();