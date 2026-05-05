import { useCallback } from "react";
import { toast } from "@/components/ui/toast"
import { createAppError, type AppError, isRetryable } from "@/lib/errors";
import { useRouter } from "next/navigation";

/**
 * useErrorHandler Hook
 * 
 * Provides a convenient way to handle errors in components.
 * Automatically shows toast notifications and handles special cases
 * like authentication errors.
 */
export function useErrorHandler() {
  const router = useRouter();

  const handleError = useCallback(
    (error: unknown, options?: { 
      showToast?: boolean;
      fallbackMessage?: string;
      onError?: (appError: AppError) => void;
    }) => {
      const appError = createAppError(error, options?.fallbackMessage);

      // Handle authentication errors
      if (appError.category === "authentication") {
        if (!window.location.pathname.startsWith("/auth")) {
          toast.error("Your session has expired. Please log in again.");
          router.push("/auth/login");
        }
        return appError;
      }

      // Handle authorization errors
      if (appError.category === "authorization") {
        if (options?.showToast !== false) {
          toast.error("You don't have permission to perform this action.");
        }
        return appError;
      }

      // Show toast notification if enabled (default: true)
      if (options?.showToast !== false) {
        toast.error(appError.message);
      }

      // Call custom error handler if provided
      options?.onError?.(appError);

      return appError;
    },
    [router]
  );

  const handleAsyncError = useCallback(
    async <T,>(
      promise: Promise<T>,
      options?: Parameters<typeof handleError>[1]
    ): Promise<[T | null, AppError | null]> => {
      try {
        const result = await promise;
        return [result, null];
      } catch (error) {
        const appError = handleError(error, options);
        return [null, appError];
      }
    },
    [handleError]
  );

  return {
    handleError,
    handleAsyncError,
    isRetryable: (error: unknown) => isRetryable(error),
  };
}

