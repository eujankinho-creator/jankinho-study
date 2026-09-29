"use client";

import {
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Usuario = {
  id: number;
  nome: string;
  email: string;
};

type AppLayoutProps = {
  children: ReactNode;
};

type MenuItem = {
  href: string;
  label: string;
  icon: string;
};

type MenuGroup = {
  titulo: string;
  itens: MenuItem[];
};

const gruposMenu: MenuGroup[] = [
  {
    titulo: "Estudo",
    itens: [
      {
        href: "/",
        label: "Dashboard",
        icon: "⌂",
      },
      {
        href: "/questoes",
        label: "Questões",
        icon: "▣",
      },
      {
        href: "/flashcards",
        label: "Flashcards",
        icon: "▤",
      },
      {
        href: "/casos",
        label: "Casos Clínicos",
        icon: "⚕",
      },
      {
        href: "/laboratorio",
        label: "Laboratório",
        icon: "⚗",
      },
      {
        href: "/evolucao",
        label: "Evolução",
        icon: "✎",
      },
    ],
  },
  {
    titulo: "Análise",
    itens: [
      {
        href: "/desempenho",
        label: "Desempenho",
        icon: "◒",
      },
      {
        href: "/ranking",
        label: "Ranking",
        icon: "♛",
      },
    ],
  },
  {
    titulo: "Pessoal",
    itens: [
      {
        href: "/financas",
        label: "Finanças",
        icon: "R$",
      },
    ],
  },
];

function itemAtivo(href: string, pathname: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

function tituloPagina(pathname: string) {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/questoes")) return "Questões";
  if (pathname.startsWith("/flashcards")) return "Flashcards";
  if (pathname.startsWith("/casos")) return "Casos Clínicos";
  if (pathname.startsWith("/laboratorio")) return "Laboratório";
  if (pathname.startsWith("/evolucao")) return "Evolução";
  if (pathname.startsWith("/desempenho")) return "Desempenho";
  if (pathname.startsWith("/ranking")) return "Ranking";

  if (pathname.startsWith("/financas")) return "Finanças";

  return "Jankinho Study";
}

/* =========================================================
   MENU MOBILE

   O estado fica aqui dentro.
   Assim, abrir/fechar o menu não renderiza o AppLayout inteiro.
========================================================= */

type MobileMenuProps = {
  pathname: string;
  nomeUsuario: string;
  inicial: string;
  email: string;
  onLogout: () => void;
};

const MobileMenu = memo(function MobileMenu({
  pathname,
  nomeUsuario,
  inicial,
  email,
  onLogout,
}: MobileMenuProps) {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    setAberto(false);
  }, [pathname]);

  return (
    <>
      {/* BOTÃO MOBILE */}
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="mr-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-white/70 transition-colors hover:bg-white/[0.05] hover:text-white lg:hidden"
        aria-label="Abrir menu"
      >
        <span className="text-xl">☰</span>
      </button>

      {/* MENU ABERTO */}
      {aberto && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* FUNDO */}
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setAberto(false)}
            className="absolute inset-0 bg-black/75"
          />

          {/* SIDEBAR */}
          <aside className="relative flex h-full w-[280px] flex-col border-r border-white/[0.08] bg-[#080808] shadow-xl">
            {/* LOGO */}
            <div className="flex h-[72px] items-center justify-between border-b border-white/[0.07] px-5">
              <Link
                href="/"
                onClick={() => setAberto(false)}
                className="flex items-center gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-sm font-black text-black">
                  J
                </div>

                <div>
                  <div className="text-[15px] font-bold">
                    Jankinho
                  </div>

                  <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                    Study
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setAberto(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white"
                aria-label="Fechar menu"
              >
                ×
              </button>
            </div>

            {/* MENU */}
            <div className="flex-1 overflow-y-auto px-3 py-5">
              {gruposMenu.map((grupo) => (
                <div
                  key={grupo.titulo}
                  className="mb-6"
                >
                  <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                    {grupo.titulo}
                  </div>

                  <nav className="space-y-1">
                    {grupo.itens.map((item) => {
                      const ativo = itemAtivo(
                        item.href,
                        pathname
                      );

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setAberto(false)}
                          className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                            ativo
                              ? "bg-orange-500/[0.10] text-orange-400"
                              : "text-white/50 hover:bg-white/[0.045] hover:text-white"
                          }`}
                        >
                          <span
                            className={`flex w-5 items-center justify-center text-[15px] ${
                              ativo
                                ? "text-orange-400"
                                : "text-white/35"
                            }`}
                          >
                            {item.icon}
                          </span>

                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>

            {/* USUÁRIO MOBILE */}
            <div className="border-t border-white/[0.07] p-3">
              <div className="flex items-center gap-3 rounded-xl px-3 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-sm font-bold text-orange-400">
                  {inicial}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-white/85">
                    {nomeUsuario}
                  </div>

                  <div className="truncate text-[11px] text-white/30">
                    {email}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  title="Sair"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  ↪
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
});

MobileMenu.displayName = "MobileMenu";

/* =========================================================
   APP LAYOUT
========================================================= */

export default function AppLayout({
  children,
}: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [carregandoUsuario, setCarregandoUsuario] =
    useState(true);

  /* =========================================================
     CARREGAR USUÁRIO
  ========================================================= */

  useEffect(() => {
    let ativo = true;

    async function carregarUsuario() {
      try {
        const resposta = await fetch(
          "/api/auth/me",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!resposta.ok) {
          router.push("/login");
          return;
        }

        const dados = await resposta.json();

        if (ativo) {
          setUsuario(
            dados.usuario ?? dados
          );
        }
      } catch (error) {
        console.error(
          "Erro ao carregar usuário:",
          error
        );

        if (ativo) {
          router.push("/login");
        }
      } finally {
        if (ativo) {
          setCarregandoUsuario(false);
        }
      }
    }

    carregarUsuario();

    return () => {
      ativo = false;
    };
  }, [router]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const sair = useCallback(async () => {
    try {
      await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.error(
        "Erro ao sair:",
        error
      );
    } finally {
      router.push("/login");
      router.refresh();
    }
  }, [router]);

  const nomeUsuario =
    usuario?.nome?.trim() || "Usuário";

  const inicial =
    nomeUsuario.charAt(0).toUpperCase();

  const titulo =
    tituloPagina(pathname);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* =====================================================
          FUNDO
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[-180px] h-[300px] w-[300px] rounded-full bg-orange-500/[0.025]" />
      </div>

      {/* =====================================================
          SIDEBAR DESKTOP
      ===================================================== */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-white/[0.07] bg-[#080808] lg:flex lg:flex-col">
        {/* LOGO */}

        <div className="flex h-[72px] items-center border-b border-white/[0.07] px-6">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-sm font-black text-black">
              J
            </div>

            <div>
              <div className="text-[15px] font-bold tracking-tight">
                Jankinho
              </div>

              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                Study
              </div>
            </div>
          </Link>
        </div>

        {/* MENU */}

        <div className="flex-1 overflow-y-auto px-3 py-5">
          {gruposMenu.map((grupo) => (
            <div
              key={grupo.titulo}
              className="mb-6"
            >
              <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                {grupo.titulo}
              </div>

              <nav className="space-y-1">
                {grupo.itens.map((item) => {
                  const ativo = itemAtivo(
                    item.href,
                    pathname
                  );

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                        ativo
                          ? "bg-orange-500/[0.10] text-orange-400"
                          : "text-white/50 hover:bg-white/[0.045] hover:text-white"
                      }`}
                    >
                      {ativo && (
                        <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-orange-500" />
                      )}

                      <span
                        className={`flex w-5 items-center justify-center text-[15px] ${
                          ativo
                            ? "text-orange-400"
                            : "text-white/35 group-hover:text-white/70"
                        }`}
                      >
                        {item.icon}
                      </span>

                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* USUÁRIO DESKTOP */}

        <div className="border-t border-white/[0.07] p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-sm font-bold text-orange-400">
              {inicial}
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white/85">
                {carregandoUsuario
                  ? "Carregando..."
                  : nomeUsuario}
              </div>

              <div className="truncate text-[11px] text-white/30">
                {usuario?.email || ""}
              </div>
            </div>

            <button
              type="button"
              onClick={sair}
              title="Sair"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/[0.05] hover:text-white"
            >
              ↪
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================
          ÁREA PRINCIPAL
      ===================================================== */}

      <div className="relative min-h-screen lg:pl-[248px]">
        {/* HEADER */}

        <header className="sticky top-0 z-30 flex h-[72px] items-center border-b border-white/[0.07] bg-[#050505]/95 px-4 sm:px-6 lg:px-8">
          {/* MENU MOBILE */}

          <MobileMenu
            pathname={pathname}
            nomeUsuario={nomeUsuario}
            inicial={inicial}
            email={usuario?.email || ""}
            onLogout={sair}
          />

          {/* TÍTULO */}

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-white/85">
              {titulo}
            </div>
          </div>

          {/* USUÁRIO HEADER */}

          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <div className="text-xs font-semibold text-white/70">
                {nomeUsuario}
              </div>

              <div className="text-[10px] text-white/25">
                Jankinho Study
              </div>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10 text-sm font-bold text-orange-400">
              {inicial}
            </div>
          </div>
        </header>

        {/* CONTEÚDO */}

        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}