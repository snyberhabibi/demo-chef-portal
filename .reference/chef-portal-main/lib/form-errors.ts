/**
 * Form Error Utilities
 * 
 * Utilities for handling API errors in react-hook-form forms.
 * Extracts field-specific errors and sets them on form fields.
 */

import { FieldValues, Path, UseFormSetError } from "react-hook-form";

/**
 * Extracts field-specific errors from API error response
 */
export function extractFieldErrors(error: unknown): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  if (error instanceof Error && "data" in error) {
    const errorData = (error as { data: unknown }).data;

    if (errorData && typeof errorData === "object") {
      const data = errorData as {
        errors?: Record<string, string[]> | string[];
        message?: string;
        error?: string;
      };

      // Handle validation errors object format: { errors: { field: ["error1", "error2"] } }
      if (data.errors && typeof data.errors === "object" && !Array.isArray(data.errors)) {
        Object.entries(data.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            fieldErrors[field] = messages[0]; // Use first error message
          } else if (typeof messages === "string") {
            fieldErrors[field] = messages;
          }
        });
      }

      // Handle array format: { errors: ["error1", "error2"] }
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        // If it's a general errors array, we can't map to specific fields
        // But we can return a generic form error
        fieldErrors.root = data.errors[0];
      }
    }
  }

  return fieldErrors;
}

/**
 * Sets form field errors from API error response
 */
export function setFormErrors<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
  options?: {
    mapFieldNames?: Record<string, Path<TFieldValues>>;
    generalErrorField?: Path<TFieldValues> | "root";
  }
) {
  const fieldErrors = extractFieldErrors(error);
  const { mapFieldNames, generalErrorField = "root" } = options || {};

  // Set field-specific errors
  Object.entries(fieldErrors).forEach(([field, message]) => {
    // Skip root/general errors for now
    if (field === "root" || field === generalErrorField) {
      return;
    }

    // Map field name if mapping provided
    const mappedField = mapFieldNames?.[field] || (field as Path<TFieldValues>);

    setError(mappedField, {
      type: "server",
      message,
    });
  });

  // Set general/root error if exists
  if (fieldErrors.root || fieldErrors[generalErrorField as string]) {
    const generalMessage =
      fieldErrors.root || fieldErrors[generalErrorField as string];

    if (generalErrorField === "root") {
      setError("root" as Path<TFieldValues>, {
        type: "server",
        message: generalMessage,
      });
    } else {
      setError(generalErrorField, {
        type: "server",
        message: generalMessage,
      });
    }
  }

  // If no field errors extracted, try to get a general error message
  if (Object.keys(fieldErrors).length === 0 && error instanceof Error) {
    const generalMessage = error.message;
    if (generalErrorField === "root") {
      setError("root" as Path<TFieldValues>, {
        type: "server",
        message: generalMessage,
      });
    } else {
      setError(generalErrorField, {
        type: "server",
        message: generalMessage,
      });
    }
  }
}

/**
 * Gets a general error message from an error (for displaying above form)
 */
export function getGeneralErrorMessage(error: unknown): string | null {
  if (error instanceof Error) {
    // Check if it's a field-specific error (has field mapping)
    const fieldErrors = extractFieldErrors(error);
    if (fieldErrors.root) {
      return fieldErrors.root;
    }

    // Return the error message
    return error.message;
  }

  return null;
}

