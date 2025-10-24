import { NavLink } from "react-router-dom";

export interface SidebarLinkProps {
  to: string;
  icon?: React.ReactNode;
  label: string;
}

export default function SidebarLink({ to, icon, label }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
          isActive
            ? "bg-indigo-600 text-white"
            : "hover:bg-gray-100 dark:hover:bg-zinc-800"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
