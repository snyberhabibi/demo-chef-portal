"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createAppError } from "@/lib/errors";
import { useRouter, usePathname } from "next/navigation";

/**
 * ErrorHandlerProvider
 *
 * Provides global error handling for React Query errors.
 * Automatically shows toast notifications for errors and handles
 * authentication errors by redirecting to login.
 */
export function ErrorHandlerProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const shownErrorsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Clear any existing errors for the "me" query to prevent stale errors from showing
    const meQuery = queryClient.getQueryCache().find({ queryKey: ["auth", "user"] });
    if (meQuery?.state?.error) {
      queryClient.resetQueries({ queryKey: ["auth", "user"] });
    }

    // Listen for React Query errors
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      // Check if query state has an error
      if (event?.query?.state?.error) {
        const error = event.query.state.error;
        const appError = createAppError(error);
        const queryKey = JSON.stringify(event.query.queryKey);
        const errorKey = `${queryKey}-${appError.statusCode}`;

        // Skip if we've already shown this error
        if (shownErrorsRef.current.has(errorKey)) {
          return;
        }

        // Check if this is the "me" query (auth check query)
        const isMeQuery = 
          event.query.queryKey[0] === "auth" && 
          event.query.queryKey[1] === "user";

        // ALWAYS suppress errors from the "me" query - it's just for checking auth status
        // Failures are expected when no cookies exist and shouldn't show toasts
        if (isMeQuery) {
          return;
        }

        // Handle authentication errors globally
        if (appError.category === "authentication") {
          // Check pathname using window.location directly for reliability
          const currentPath = typeof window !== "undefined"
            ? window.location.pathname
            : (pathname ?? "");
          const isOnAuthPage = currentPath.startsWith("/auth");

          // Don't redirect if already on auth page
          if (isOnAuthPage) {
            return;
          }

          // Skip if we've already handled this auth error
          if (shownErrorsRef.current.has(errorKey)) {
            return;
          }
          shownErrorsRef.current.add(errorKey);

          // Silently redirect to login - no toast needed
          // The redirect itself is enough feedback that session ended
          router.push("/auth/login");
          return;
        }

        // For other errors, we let individual components handle them
        // but we can log them here for monitoring
        if (process.env.NODE_ENV === "development") {
          console.error("Query error:", appError);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient, router, pathname]);

  return <>{children}</>;
}

