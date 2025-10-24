import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { removeAuthToken } from "@/config/api";
import { LogOut } from "lucide-react";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/users", label: "Usuarios", icon: "👥" },
  { path: "/groups", label: "Grupos", icon: "👪" },
  { path: "/assignments", label: "Asignaciones", icon: "📦" },
  { path: "/products", label: "Productos", icon: "🛒" },
];

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAuthToken();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-2xl font-bold text-blue-600">Provisio</div>
        <nav className="flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 transition ${
                  isActive ? "bg-blue-100 text-blue-600 font-semibold" : ""
                }`
              }
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 m-4 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          <LogOut size={18} /> Cerrar sesión
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
