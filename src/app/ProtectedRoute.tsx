import { Navigate } from "react-router-dom";
import { getAuthToken } from "@/config/api";
import type { JSX } from "react";


interface ProtectedRouteProps {
  element: JSX.Element;
}

export const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const token = getAuthToken();
  return token ? element : <Navigate to="/login" replace />;
};
