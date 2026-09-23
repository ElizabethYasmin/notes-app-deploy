import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getAuthHeader } from "../services/http";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!getAuthHeader()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
