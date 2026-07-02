/* ──────────────────────────────────────────────────────────────
   ULMiND Admin — Route Guard
   Protects admin routes — redirects unauthenticated users
   ────────────────────────────────────────────────────────────── */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";

const AdminLoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-rose-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
      </div>
      <p className="text-sm text-gray-500 font-medium tracking-wider uppercase">Verifying access...</p>
    </div>
  </div>
);

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AdminLoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
