"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  Button,
  Banner,
  Spinner,
} from "@/components/polaris";

export type ConfirmationActionType =
  | "delete"
  | "archive"
  | "restore"
  | "publish"
  | "unpublish"
  | "custom";

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: ConfirmationActionType;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  variant?: "default" | "destructive";
  disabled?: boolean;
  warning?: string;
}

const defaultLabels: Record<ConfirmationActionType, string> = {
  delete: "Delete",
  archive: "Archive",
  restore: "Restore",
  publish: "Publish",
  unpublish: "Unpublish",
  custom: "Confirm",
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  type,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  isLoading = false,
  variant = "default",
  disabled = false,
  warning,
}: ConfirmationDialogProps) {
  const isDestructive = variant === "destructive" || type === "delete";
  const finalConfirmLabel = confirmLabel || defaultLabels[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-[var(--p-space-400)]">
          <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">
            {description}
          </p>
          {warning && (
            <Banner tone="warning" title="">
              <p>{warning}</p>
            </Banner>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isLoading || disabled}>
            {cancelLabel}
          </Button>
          <Button
            variant={isDestructive ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isLoading || disabled}
          >
            {isLoading && <Spinner size="small" />}
            {finalConfirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
