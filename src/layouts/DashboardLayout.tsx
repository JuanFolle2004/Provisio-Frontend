import { useTheme } from "../hooks/useTheme";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import SidebarLink from "../components/SidebarLink"; // ✅ IMPORT DEFAULT

import {
  Home,
  LayoutDashboard,
  ListChecks,
  Users,
  Package,
  ShoppingCart,
  Settings,
  User,
  Moon,
  Sun,
  Search,
  Globe,
} from "lucide-react";

const sidebarLinks = [
  { to: "/", icon: <Home size={16} />, label: "Home" },
  { to: "/dashboard", icon: <LayoutDashboard size={16} />, label: "Dashboard" },
  { to: "/lists", icon: <ListChecks size={16} />, label: "Listas" },
  { to: "/groups", icon: <Users size={16} />, label: "Grupos" },
  { to: "/products", icon: <Package size={16} />, label: "Productos" },
  { to: "/cart", icon: <ShoppingCart size={16} />, label: "Carrito" },
  { to: "/settings", icon: <Settings size={16} />, label: "Ajustes" },
  { to: "/profile", icon: <User size={16} />, label: "Perfil" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
      {/* HEADER */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 dark:bg-zinc-900/70 border-b border-gray-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            <div className="h-8 w-8 rounded-2xl bg-indigo-600 text-white grid place-items-center font-bold">
              P
            </div>
            <span className="font-semibold hidden sm:block">Provisio</span>
          </div>

          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
              <Input placeholder="Buscar..." className="pl-9" />
            </div>
          </div>

          <Button variant="ghost" onClick={toggle}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 py-6">
        {/* SIDEBAR */}
        <aside className="hidden md:block">
          <nav className="sticky top-[4.25rem] space-y-1">
            {sidebarLinks.map((link) => (
              <SidebarLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={link.label}
              />
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="pb-16">{children}</main>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 dark:border-zinc-800 py-6">
        <div className="mx-auto max-w-7xl px-4 md:px-6 text-xs text-gray-500 flex items-center justify-between">
          <span className="inline-flex items-center gap-2">
            <Globe size={14} /> Montevideo 🇺🇾
          </span>
          <span>© {new Date().getFullYear()} Provisio</span>
        </div>
      </footer>
    </div>
  );
}
