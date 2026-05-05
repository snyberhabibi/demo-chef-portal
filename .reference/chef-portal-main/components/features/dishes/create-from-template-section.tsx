"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { DishTemplateSelector, type DishTemplate } from "./dish-template-selector";

interface CreateFromTemplateSectionProps {
  templates: DishTemplate[];
  selectedTemplate: DishTemplate | null;
  onTemplateSelect: (template: DishTemplate) => void;
  onContinue: () => void;
  onCancel: () => void;
}

export function CreateFromTemplateSection({
  templates,
  selectedTemplate,
  onTemplateSelect,
  onContinue,
  onCancel,
}: CreateFromTemplateSectionProps) {
  return (
    <div className="space-y-4">
      <DishTemplateSelector
        templates={templates}
        selectedTemplate={selectedTemplate}
        onTemplateSelect={onTemplateSelect}
      />

      {selectedTemplate && (
        <div className="space-y-4">
          <div className="rounded-lg border p-6">
            <p className="text-sm text-muted-foreground mb-4">
              You&apos;ll be redirected to the create page with this template data
              pre-filled. You can customize it before saving.
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
      )}
    </div>
  );
}

