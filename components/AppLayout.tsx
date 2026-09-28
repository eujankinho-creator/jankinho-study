"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type AppLayoutProps = {
  children: ReactNode;
};

type Usuario = {
  id: number;
  nome: string;
  email: string;
};

type ItemMenu = {
  href: string;
  label: string;
  icone: string;
};

type GrupoMenu = {
  titulo: string;
  itens: ItemMenu[];
};

const gruposMenu: GrupoMenu[] = [
  {
    titulo: "Estudo",
    itens: [
      {
        href: "/",
        label: "Dashboard",
        icone: "⌂",
      },
      {
        href: "/questoes",
        label: "Questões",
        icone: "✓",
      },
      {
        href: "/flashcards",
        label: "Flashcards",
        icone: "▣",
      },
      {
        href: "/laboratorio",
        label: "Laboratório",
        icone: "◉",
      },
    ],
  },
  {
    titulo: "Análise",
    itens: [
      {
        href: "/desempenho",
        label: "Desempenho",
        icone: "↗",
      },
      {
        href: "/ranking",
        label: "Ranking",
        icone: "★",
      },
      {
        href: "/relatorios",
        label: "Relatórios",
        icone: "▤",
      },
    ],
  },
  {
    titulo: "Pessoal",
    itens: [
      {
        href: "/financas",
        label: "Finanças",
        icone: "R$",
      },
    ],
  },
];

function obterIniciais(nome: string) {
  const partes = nome
    .trim()
    .split(" ")
    .filter(Boolean);

  if (partes.length === 0) {
    return "J";
  }

  if (partes.length === 1) {
    return partes[0].slice(0, 1).toUpperCase();
  }

  return (
    partes[0].slice(0, 1) +
    partes[partes.length - 1].slice(0, 1)
  ).toUpperCase();
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [menuAberto, setMenuAberto] =
    useState(false);

  const [carregandoUsuario, setCarregandoUsuario] =
    useState(true);

  useEffect(function () {
    async function carregarUsuario() {
      try {
        const resposta = await fetch(
          "/api/auth/me",
          {
            cache: "no-store",
          }
        );

        if (!resposta.ok) {
          setUsuario(null);
          return;
        }

        const dados = await resposta.json();

        setUsuario(dados.usuario || null);
      } catch (error) {
        console.error(
          "Erro ao carregar usuário:",
          error
        );

        setUsuario(null);
      } finally {
        setCarregandoUsuario(false);
      }
    }

    carregarUsuario();
  }, []);

  useEffect(
    function () {
      setMenuAberto(false);
    },
    [pathname]
  );

  async function sair() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error(
        "Erro ao encerrar sessão:",
        error
      );
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  function itemAtivo(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(href + "/")
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-[248px] shrink-0 border-r border-white/[0.06] bg-[#070707] lg:flex lg:flex-col">
          <div className="flex h-[72px] items-center border-b border-white/[0.05] px-5">
            <Link
              href="/"
              className="group flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 transition duration-300 group-hover:border-orange-500/40 group-hover:bg-orange-500/15">
                <span className="text-sm font-black text-orange-400">
                  J
                </span>
              </div>

              <div>
                <p className="text-sm font-bold tracking-tight text-white">
                  Jankinho Study
                </p>

                <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-700">
                  Study platform
                </p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-5">
            {gruposMenu.map(function (grupo) {
              return (
                <div
                  key={grupo.titulo}
                  className="mb-6 last:mb-0"
                >
                  <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-700">
                    {grupo.titulo}
                  </p>

                  <div className="space-y-1">
                    {grupo.itens.map(
                      function (item) {
                        const ativo =
                          itemAtivo(item.href);

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={
                              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 " +
                              (ativo
                                ? "bg-orange-500/[0.09] text-white"
                                : "text-neutral-500 hover:bg-white/[0.035] hover:text-neutral-200")
                            }
                          >
                            <span
                              className={
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all duration-200 " +
                                (ativo
                                  ? "bg-orange-500/15 text-orange-400"
                                  : "bg-white/[0.025] text-neutral-600 group-hover:bg-white/[0.06] group-hover:text-neutral-300")
                              }
                            >
                              {item.icone}
                            </span>

                            <span className="truncate">
                              {item.label}
                            </span>

                            {ativo && (
                              <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.7)]" />
                            )}
                          </Link>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="border-t border-white/[0.05] p-3">
            {carregandoUsuario ? (
              <div className="flex items-center gap-3 rounded-xl p-3">
                <div className="skeleton h-9 w-9 rounded-xl" />

                <div className="min-w-0 flex-1">
                  <div className="skeleton h-3 w-24 rounded" />
                  <div className="mt-2 skeleton h-2 w-32 rounded" />
                </div>
              </div>
            ) : (
              <div className="group rounded-xl border border-white/[0.05] bg-white/[0.018] p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-xs font-bold text-orange-400">
                    {obterIniciais(
                      usuario?.nome || "Jan"
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white">
                      {usuario?.nome || "Usuário"}
                    </p>

                    <p className="truncate text-[10px] text-neutral-700">
                      {usuario?.email ||
                        "Conta ativa"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={sair}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-neutral-600 transition hover:border-rose-500/15 hover:bg-rose-500/[0.05] hover:text-rose-400"
                >
                  <span>↪</span>
                  Sair da conta
                </button>
              </div>
            )}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-white/[0.06] bg-[#050505]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={function () {
                  setMenuAberto(
                    function (aberto) {
                      return !aberto;
                    }
                  );
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-neutral-400 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
                aria-label="Abrir menu"
              >
                <span className="text-lg">
                  {menuAberto ? "×" : "☰"}
                </span>
              </button>

              <div className="lg:hidden">
                <p className="text-sm font-bold text-white">
                  Jankinho Study
                </p>

                <p className="text-[9px] uppercase tracking-[0.16em] text-neutral-700">
                  Study platform
                </p>
              </div>

              <div className="hidden lg:block">
                <p className="text-xs text-neutral-700">
                  {pathname === "/"
                    ? "Visão geral"
                    : "Área de estudos"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/laboratorio"
                className="hidden items-center gap-2 rounded-xl border border-orange-500/10 bg-orange-500/[0.04] px-3 py-2 text-xs font-medium text-orange-400 transition hover:border-orange-500/20 hover:bg-orange-500/[0.08] sm:flex"
              >
                <span>◉</span>
                Laboratório
              </Link>

              <div className="hidden h-7 w-px bg-white/[0.06] sm:block" />

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-xs font-bold text-orange-400">
                  {obterIniciais(
                    usuario?.nome || "Jan"
                  )}
                </div>

                <div className="hidden max-w-[150px] sm:block">
                  <p className="truncate text-xs font-semibold text-neutral-200">
                    {usuario?.nome || "Usuário"}
                  </p>

                  <p className="text-[10px] text-neutral-700">
                    Estudante
                  </p>
                </div>
              </div>
            </div>
          </header>

          {menuAberto && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={function () {
                  setMenuAberto(false);
                }}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              />

              <aside className="relative flex h-full w-[280px] flex-col border-r border-white/[0.07] bg-[#080808] shadow-2xl">
                <div className="flex h-[72px] items-center justify-between border-b border-white/[0.05] px-5">
                  <Link
                    href="/"
                    onClick={function () {
                      setMenuAberto(false);
                    }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
                      <span className="text-sm font-black text-orange-400">
                        J
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">
                        Jankinho Study
                      </p>

                      <p className="text-[9px] uppercase tracking-[0.16em] text-neutral-700">
                        Study platform
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={function () {
                      setMenuAberto(false);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-neutral-600 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-5">
                  {gruposMenu.map(
                    function (grupo) {
                      return (
                        <div
                          key={grupo.titulo}
                          className="mb-6"
                        >
                          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-700">
                            {grupo.titulo}
                          </p>

                          <div className="space-y-1">
                            {grupo.itens.map(
                              function (item) {
                                const ativo =
                                  itemAtivo(
                                    item.href
                                  );

                                return (
                                  <Link
                                    key={
                                      item.href
                                    }
                                    href={
                                      item.href
                                    }
                                    className={
                                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition " +
                                      (ativo
                                        ? "bg-orange-500/[0.09] text-white"
                                        : "text-neutral-500 hover:bg-white/[0.035] hover:text-white")
                                    }
                                  >
                                    <span
                                      className={
                                        "flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold " +
                                        (ativo
                                          ? "bg-orange-500/15 text-orange-400"
                                          : "bg-white/[0.025] text-neutral-600")
                                      }
                                    >
                                      {
                                        item.icone
                                      }
                                    </span>

                                    <span>
                                      {
                                        item.label
                                      }
                                    </span>

                                    {ativo && (
                                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-400" />
                                    )}
                                  </Link>
                                );
                              }
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </nav>

                <div className="border-t border-white/[0.05] p-3">
                  <button
                    type="button"
                    onClick={sair}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-xs text-neutral-500 transition hover:border-rose-500/15 hover:bg-rose-500/[0.05] hover:text-rose-400"
                  >
                    <span>↪</span>
                    Sair da conta
                  </button>
                </div>
              </aside>
            </div>
          )}

          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}