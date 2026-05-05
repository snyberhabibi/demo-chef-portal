"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  RefreshCw,
  WifiOff,
  ShieldAlert,
  FileQuestion,
  Server,
  AlertTriangle,
} from "lucide-react";
import { createAppError, type ErrorCategory } from "@/lib/errors";
import { cn } from "@/lib/utils";

interface ErrorDisplayProps {
  error: unknown;
  title?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  compact?: boolean;
  showDetails?: boolean;
}

/**
 * ErrorDisplay Component
 * 
 * Displays errors in a user-friendly way with appropriate icons and actions.
 * Handles different error categories with specific UI for each.
 */
export function ErrorDisplay({
  error,
  title,
  onRetry,
  onDismiss,
  className,
  compact = false,
  showDetails = false,
}: ErrorDisplayProps) {
  const appError = createAppError(error);
  const icon = getErrorIcon(appError.category);
  const defaultTitle = getErrorTitle(appError.category, appError.statusCode);

  if (compact) {
    return (
      <Alert variant="destructive" className={cn("", className)}>
        {icon}
        <AlertTitle className="text-sm">{title || defaultTitle}</AlertTitle>
        <AlertDescription className="text-sm">
          {appError.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Alert variant="destructive">
        {icon}
        <AlertTitle>{title || defaultTitle}</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>{appError.message}</p>
          {showDetails && appError.details && (
            <details className="mt-2 text-xs">
              <summary className="cursor-pointer font-medium">
                Error details
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-muted p-2">
                {JSON.stringify(appError.details, null, 2)}
              </pre>
            </details>
          )}
        </AlertDescription>
      </Alert>

      {(onRetry || onDismiss) && (
        <div className="flex gap-2">
          {onRetry && appError.retryable && (
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          {onDismiss && (
            <Button onClick={onDismiss} variant="ghost" size="sm">
              Dismiss
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Gets appropriate icon for error category
 */
function getErrorIcon(category: ErrorCategory) {
  const iconClass = "h-4 w-4";
  switch (category) {
    case "network":
      return <WifiOff className={iconClass} />;
    case "authentication":
    case "authorization":
      return <ShieldAlert className={iconClass} />;
    case "not-found":
      return <FileQuestion className={iconClass} />;
    case "server":
      return <Server className={iconClass} />;
    case "api":
    case "validation":
      return <AlertCircle className={iconClass} />;
    default:
      return <AlertTriangle className={iconClass} />;
  }
}

/**
 * Gets appropriate title for error category
 */
function getErrorTitle(category: ErrorCategory, statusCode?: number): string {
  switch (category) {
    case "network":
      return "Connection Error";
    case "authentication":
      return statusCode === 401 ? "Authentication Required" : "Login Required";
    case "authorization":
      return "Access Denied";
    case "not-found":
      return "Not Found";
    case "server":
      return "Server Error";
    case "api":
      return statusCode ? `Error ${statusCode}` : "Request Error";
    case "validation":
      return "Validation Error";
    default:
      return "Error";
  }
}

/**
 * Hook for handling async errors with retry functionality
 */
export function useErrorHandler() {
  const handleError = (error: unknown, options?: { retry?: () => void }) => {
    const appError = createAppError(error);

    // Log error (in production, send to error tracking service)
    if (process.env.NODE_ENV === "development") {
      console.error("Error handled:", appError);
    }

    return {
      error: appError,
      retry: options?.retry,
      retryable: appError.retryable,
    };
  };

  return { handleError };
}

