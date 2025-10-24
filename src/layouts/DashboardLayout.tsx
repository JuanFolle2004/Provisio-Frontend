import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { removeAuthToken } from "@/config/api";
import {
  LogOut,
  Home,
  Users,
  Boxes,
  Package,
  ClipboardList,
} from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: Home },
  { path: "/users", label: "Usuarios", icon: Users },
  { path: "/groups", label: "Grupos", icon: Boxes },
  { path: "/assignments", label: "Asignaciones", icon: ClipboardList },
  { path: "/products", label: "Productos", icon: Package },
];

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAuthToken();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-64 bg-card border-r border-border flex flex-col shadow-md"
      >
        <div className="p-6 text-2xl font-bold text-primary tracking-tight">
          Provisio
        </div>
        <nav className="flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-sm font-medium rounded-md transition-colors 
                   ${
                     isActive
                       ? "bg-primary/10 text-primary"
                       : "hover:bg-accent hover:text-accent-foreground"
                   }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-6 shadow-sm">
          <h1 className="text-lg font-semibold text-primary">Panel de Control</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              F
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
