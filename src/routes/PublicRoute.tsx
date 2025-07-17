// src/routes/PublicRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import type { JSX } from "react";

interface PublicRouteProps {
  children: JSX.Element;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
