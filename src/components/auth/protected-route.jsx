"use client";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// 🔥 Read environment variable to disable auth in development
const DISABLE_AUTH = import.meta.env.VITE_REACT_APP_DISABLE_AUTH === "true";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoadingUser } = useAuth();
  const location = useLocation();

  // If auth is disabled, allow all routes
  if (DISABLE_AUTH) {
    return <Outlet />;
  }

  // Show spinner while checking token/user
  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the route
  return <Outlet />;
}
