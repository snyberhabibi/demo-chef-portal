"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CreateFromScratchSectionProps {
  onContinue: () => void;
  onCancel: () => void;
}

export function CreateFromScratchSection({
  onContinue,
  onCancel,
}: CreateFromScratchSectionProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground mb-4">
          Create a new dish from scratch with full customization options
        </p>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onContinue}>
            Continue to Create Page
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

