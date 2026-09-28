"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Início", href: "/", icon: "🏠" },
  { name: "Questões", href: "/questoes", icon: "📝" },
  { name: "Flashcards", href: "/flashcards", icon: "🧠" },
  { name: "Finanças", href: "/financas", icon: "💰" },
  { name: "Relatórios", href: "/relatorios", icon: "📊" },
  { name: "Configurações", href: "/configuracoes", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-800 bg-slate-900 p-6 text-white">
      <h1 className="mb-10 text-2xl font-bold">
        Jankinho Study
      </h1>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-3 transition ${
                active
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`}
            >
              {item.icon} {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}