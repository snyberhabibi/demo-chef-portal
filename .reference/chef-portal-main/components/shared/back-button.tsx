"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ConfirmationDialog } from "./confirmation-dialog";

interface BackButtonProps {
  href: string;
  label?: string;
  hasUnsavedChanges?: boolean;
  onConfirmLeave?: () => void;
  disabled?: boolean;
}

export function BackButton({
  href,
  label,
  hasUnsavedChanges = false,
  onConfirmLeave,
  disabled = false,
}: BackButtonProps) {
  const router = useRouter();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (hasUnsavedChanges) {
      e.preventDefault();
      setShowConfirmDialog(true);
    }
  };

  const handleConfirm = () => {
    setShowConfirmDialog(false);
    if (onConfirmLeave) {
      onConfirmLeave();
    }
    router.push(href);
  };

  // If no unsaved changes, use simple Link navigation
  if (!hasUnsavedChanges) {
    return (
      <Button variant="ghost" size="icon" disabled={disabled} asChild>
        <Link href={href} aria-label={label || "Go back"} onClick={handleClick}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
    );
  }

  // If there are unsaved changes, show confirmation dialog
  return (
    <>
      <Button variant="ghost" size="icon" disabled={disabled} asChild>
        <Link href={href} aria-label={label || "Go back"} onClick={handleClick}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        type="custom"
        title="Unsaved Changes"
        description="You have unsaved changes on this page. If you continue, your changes will be lost."
        confirmLabel="Continue"
        cancelLabel="Cancel"
        onConfirm={handleConfirm}
        variant="default"
      />
    </>
  );
}
