// Create this file: src/components/ProtectedRoute.tsx (or anywhere, e.g., src/components/ProtectedRoute.tsx)

import { useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [location, navigate] = useLocation();

  useEffect(() => {
    if (!isLoggedIn && location !== "/login") {
      navigate("/login");
    }
  }, [isLoggedIn, location, navigate]);

  if (!isLoggedIn) {
    return null; // Prevents flash of protected content
  }

  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;