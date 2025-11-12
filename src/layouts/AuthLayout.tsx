// src/layouts/AuthLayout.tsx
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
      <Outlet />
    </div>
  );
}
