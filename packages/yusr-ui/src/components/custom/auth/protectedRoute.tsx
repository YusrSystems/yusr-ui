import React, { useEffect } from "react";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
  /** Optional: What to show while redirecting (e.g., a loader or "Access Denied") */
  fallback?: React.ReactNode;
  /** Optional: Function to trigger the redirect based on your framework */
  onUnauthenticated?: () => void;
}

export function ProtectedRoute({
  isAuthenticated,
  children,
  fallback = null,
  onUnauthenticated,
}: ProtectedRouteProps) {
  // Trigger the redirect logic if the user is not authenticated
  useEffect(() => {
    if (!isAuthenticated && onUnauthenticated) {
      onUnauthenticated();
    }
  }, [isAuthenticated, onUnauthenticated]);

  // If not authenticated, show the fallback (or nothing)
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
}
/* HOW to use in React Router 
import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export function AppRoutes() {
  const user = null; // Replace with actual auth state

  return (
    <ProtectedRoute 
      isAuthenticated={!!user} 
      fallback={<Navigate to="/login" replace />}
    >
      <Dashboard />
    </ProtectedRoute>
  );
}



-=-
How to use in Next js
"use client";

import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardPage() {
  const router = useRouter();
  const user = null; // Replace with actual auth state

  return (
    <ProtectedRoute 
      isAuthenticated={!!user} 
      onUnauthenticated={() => router.push("/login")}
      fallback={<div>Redirecting to login...</div>}
    >
      <DashboardContent />
    </ProtectedRoute>
  );
}


*/
