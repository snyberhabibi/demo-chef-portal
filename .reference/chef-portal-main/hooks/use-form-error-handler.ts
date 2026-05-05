import { useState, useCallback } from "react";
import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { setFormErrors, getGeneralErrorMessage } from "@/lib/form-errors";
import { toast } from "@/components/ui/toast"

interface UseFormErrorHandlerOptions<TFieldValues extends FieldValues> {
  setError: UseFormSetError<TFieldValues>;
  mapFieldNames?: Record<string, Path<TFieldValues>>;
  generalErrorField?: Path<TFieldValues> | "root";
  showToast?: boolean;
  getCustomMessage?: (error: unknown) => string | null;
}

/**
 * Hook for handling form errors
 * 
 * Provides utilities to handle API errors in forms:
 * - Sets field-specific errors automatically
 * - Returns general error message for display
 * - Optionally shows toast notifications
 */
export function useFormErrorHandler<TFieldValues extends FieldValues>(
  options: UseFormErrorHandlerOptions<TFieldValues>
) {
  const {
    setError,
    mapFieldNames,
    generalErrorField = "root",
    showToast = true,
    getCustomMessage,
  } = options;

  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleError = useCallback(
    (error: unknown) => {
      // Clear previous general error
      setGeneralError(null);

      // Set field-specific errors
      setFormErrors(error, setError, {
        mapFieldNames,
        generalErrorField,
      });

      // Get general error message
      const errorMessage =
        getCustomMessage?.(error) || getGeneralErrorMessage(error);

      if (errorMessage) {
        setGeneralError(errorMessage);

        // Show toast if enabled
        if (showToast) {
          toast.error(errorMessage);
        }
      }

      return errorMessage;
    },
    [setError, mapFieldNames, generalErrorField, showToast, getCustomMessage]
  );

  const clearError = useCallback(() => {
    setGeneralError(null);
  }, []);

  return {
    handleError,
    generalError,
    clearError,
  };
}

