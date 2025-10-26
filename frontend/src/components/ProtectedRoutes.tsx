import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  if (!user) {
    // not authenticated → redirect to login
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
