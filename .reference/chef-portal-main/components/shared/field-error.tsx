import { InlineError } from "@/components/polaris";

interface FieldErrorProps {
  message?: string;
  className?: string;
}

export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null;
  return <InlineError className={className}>{message}</InlineError>;
}
