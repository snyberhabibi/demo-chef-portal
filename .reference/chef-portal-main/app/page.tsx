"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers";
import { LoadingScreen } from "@/components/shared";

/**
 * Root page component
 * 
 * Redirects users based on authentication status:
 * - Authenticated users → /dashboard
 * - Unauthenticated users → /auth/login
 */
export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/auth/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking authentication
  return <LoadingScreen />;
}
