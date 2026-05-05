"use client";

import React, { Component, type ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { createAppError, type AppError } from "@/lib/errors";
import { useRouter } from "next/navigation";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: AppError, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
  isTranslationError: boolean;
}

/**
 * ErrorBoundary Component
 * 
 * Catches React component errors and displays a user-friendly error UI.
 * Provides options to reset the error or navigate away.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isTranslationError: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Check if this is a translation-related DOM error
    const isTranslationError = 
      error.message?.includes("removeChild") ||
      error.message?.includes("not a child") ||
      error.name === "NotFoundError" ||
      (error.message?.includes("Node") && error.message?.includes("remove"));

    return {
      hasError: true,
      error: createAppError(error),
      isTranslationError,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // TODO: In production, you might want to log this to an error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      isTranslationError: false,
    });
  };

  handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Default error UI
      return (
        <ErrorFallback 
          error={this.state.error} 
          onReset={this.handleReset}
          isTranslationError={this.state.isTranslationError}
          onReload={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component
 */
interface ErrorFallbackProps {
  error: AppError;
  onReset: () => void;
  isTranslationError?: boolean;
  onReload?: () => void;
}

function ErrorFallback({ error, onReset, isTranslationError, onReload }: ErrorFallbackProps) {
  const router = useRouter();
  const showErrorDetails =
    process.env.NODE_ENV === "development" && error.originalError !== undefined;

  return (
    <div className="flex min-h-screen items-center justify-center p-4" translate="no">
      <div className="w-full max-w-md space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {isTranslationError ? "Translation Conflict Detected" : "Something went wrong"}
          </AlertTitle>
          <AlertDescription className="space-y-3">
            {isTranslationError ? (
              <div className="space-y-2">
                <p>
                  The page encountered an error due to browser translation. 
                  Please disable browser translation and reload the page.
                </p>
                <p className="text-sm text-muted-foreground">
                  This application is designed to work best without browser translation enabled.
                </p>
              </div>
            ) : (
              <p>{error.message}</p>
            )}
            {showErrorDetails && (
              <details className="mt-2 text-xs">
                <summary className="cursor-pointer font-medium">
                  Error details (development only)
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-muted p-2">
                  {String(
                    error.originalError instanceof Error
                      ? error.originalError.stack || error.originalError.toString()
                      : JSON.stringify(error.originalError, null, 2)
                  )}
                </pre>
              </details>
            )}
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          {isTranslationError && onReload ? (
            <Button onClick={onReload} variant="default" className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload Page
            </Button>
          ) : (
            <>
              {error.retryable && (
                <Button onClick={onReset} variant="outline" className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              )}
              <Button
                onClick={() => router.push("/dashboard")}
                variant="default"
                className="flex-1"
              >
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

