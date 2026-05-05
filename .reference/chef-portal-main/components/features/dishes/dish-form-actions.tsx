"use client";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface DishFormActionsProps {
  onCancel: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

export function DishFormActions({
  onCancel,
  isSubmitting = false,
  submitLabel = "Create Dish",
  cancelLabel = "Cancel",
}: DishFormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-4 border-t">
      <Button type="button" variant="outline" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        <Save className="mr-2 h-4 w-4" />
        {isSubmitting ? "Creating..." : submitLabel}
      </Button>
    </div>
  );
}

