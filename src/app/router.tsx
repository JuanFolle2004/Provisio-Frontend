import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import ListsPage from "../pages/ListsPage";
import GroupsPage from "../pages/Groups.Page";
import { ProductsPage } from '../pages/ProductsPage'
import CartPage from '../pages/CartPage'
import SettingsPage from "../pages/SettingsPage";
import { ProfilePage } from '../pages/ProfilePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/list/:id", element: <ListsPage />},
  { path: "/groups", element: <GroupsPage /> },
  { path: "/products", element: <ProductsPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/settings", element: <SettingsPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
