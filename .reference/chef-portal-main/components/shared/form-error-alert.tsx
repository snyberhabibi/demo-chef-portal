"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrorAlertProps {
  error?: string | null;
  className?: string;
}

/**
 * FormErrorAlert Component
 * 
 * A styled error alert for displaying form errors with:
 * - Light red background and border
 * - Alert icon
 * - Consistent styling across the app
 * - Only renders when there's an error (doesn't reserve space)
 */
export function FormErrorAlert({ error, className }: FormErrorAlertProps) {
  // Don't render if there's no error to avoid reserving space
  if (!error) {
    return null;
  }

  return (
    <Alert
      className={cn(
        "border-destructive/50 bg-destructive/10 text-destructive [&>svg]:text-destructive",
        className
      )}
    >
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-destructive">
        {error}
      </AlertDescription>
    </Alert>
  );
}

