/**
 * Error Utilities and Types
 * 
 * Provides utilities for categorizing and handling different types of errors
 * in a consistent way across the application.
 */

export type ErrorCategory =
  | "network"
  | "api"
  | "validation"
  | "authentication"
  | "authorization"
  | "not-found"
  | "server"
  | "unknown";

export interface AppError {
  message: string;
  category: ErrorCategory;
  statusCode?: number;
  originalError?: unknown;
  details?: Record<string, unknown>;
  retryable?: boolean;
}

/**
 * Checks if an error is a network error (no internet, timeout, etc.)
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes("fetch") ||
      error.message.includes("network") ||
      error.message.includes("timeout") ||
      error.message.includes("Failed to fetch") ||
      error.name === "NetworkError" ||
      error.name === "TypeError"
    );
  }
  return false;
}

/**
 * Checks if an error is an API error (HTTP error response)
 */
export function isApiError(error: unknown): error is Error & { status: number; data?: unknown } {
  return (
    error instanceof Error &&
    "status" in error &&
    typeof (error as { status: unknown }).status === "number"
  );
}

/**
 * Categorizes an error based on its properties
 */
export function categorizeError(error: unknown): ErrorCategory {
  if (isNetworkError(error)) {
    return "network";
  }

  if (isApiError(error)) {
    const status = error.status;

    if (status === 401) {
      return "authentication";
    }
    if (status === 403) {
      return "authorization";
    }
    if (status === 404) {
      return "not-found";
    }
    if (status >= 500) {
      return "server";
    }
    if (status >= 400) {
      return "api";
    }
  }

  if (error instanceof Error) {
    if (error.message.includes("validation") || error.message.includes("invalid")) {
      return "validation";
    }
  }

  return "unknown";
}

/**
 * Gets a user-friendly error message based on error category
 */
export function getErrorMessage(error: unknown, fallback?: string): string {
  if (error instanceof Error) {
    // If error has a message, use it
    if (error.message) {
      return error.message;
    }
  }

  // Try to extract message from error object
  if (typeof error === "object" && error !== null) {
    const errorObj = error as Record<string, unknown>;
    if (typeof errorObj.message === "string") {
      return errorObj.message;
    }
    if (typeof errorObj.error === "string") {
      return errorObj.error;
    }
  }

  // Fallback messages based on category
  const category = categorizeError(error);
  const categoryMessages: Record<ErrorCategory, string> = {
    network: "Network error. Please check your internet connection and try again.",
    api: "An error occurred while processing your request. Please try again.",
    validation: "Please check your input and try again.",
    authentication: "You need to be logged in to access this resource.",
    authorization: "You don't have permission to perform this action.",
    "not-found": "The requested resource was not found.",
    server: "Something went wrong on our end. Please try again in a moment.",
    unknown: fallback || "An unexpected error occurred. Please try again.",
  };

  return categoryMessages[category];
}

/**
 * Creates an AppError from any error
 */
export function createAppError(error: unknown, fallback?: string): AppError {
  const category = categorizeError(error);
  const message = getErrorMessage(error, fallback);

  const appError: AppError = {
    message,
    category,
    originalError: error,
    retryable: category === "network" || category === "server",
  };

  if (isApiError(error)) {
    appError.statusCode = error.status;
    if (error.data) {
      appError.details = { data: error.data };
    }
  }

  return appError;
}

/**
 * Checks if an error is retryable
 */
export function isRetryable(error: unknown): boolean {
  const category = categorizeError(error);
  return category === "network" || category === "server";
}

