import { Navigate } from "react-router-dom";
import { getAuthToken } from "@/config/api";
import type { PropsWithChildren } from 'react'


export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const token = getAuthToken();
  return token ? { children } : <Navigate to="/login" replace />
};
