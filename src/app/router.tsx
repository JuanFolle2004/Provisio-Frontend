import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "@/app/ProtectedRoute";

import DashboardPage from "@/pages/DashboardPage";
import UsersPage from "@/pages/UserPage";
import GroupsPage from "@/pages/Groups.Page";
import AssignmentsPage from "@/pages/AssignmentsPage";
import ProductsPage from "@/pages/ProductsPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <ProtectedRoute element={<DashboardLayout />} />,
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "groups", element: <GroupsPage /> },
      { path: "assignments", element: <AssignmentsPage /> },
      { path: "products", element: <ProductsPage /> },
    ],
  },
]);
