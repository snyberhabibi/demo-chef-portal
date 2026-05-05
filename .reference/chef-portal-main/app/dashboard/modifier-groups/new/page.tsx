"use client";

/**
 * Create Modifier Group Page
 *
 * Simple form: name + description inside a single card.
 */

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/toast";
import { mapServerError, formatRHFErrors, showValidationToast } from "@/lib/validation-error-mapper";
import { PlusIcon } from "@shopify/polaris-icons";
import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Textarea,
  Label,
  Spinner,
} from "@/components/polaris";
import { useCreateModifierGroup } from "@/hooks/use-modifier-groups";
import { FieldError } from "@/components/shared/field-error";

const modifierGroupSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  description: z.union([z.string().max(350, "Description must be 350 characters or less"), z.literal("")]).optional(),
});

type ModifierGroupFormValues = z.infer<typeof modifierGroupSchema>;

export default function CreateModifierGroupPage() {
  const router = useRouter();
  const createMutation = useCreateModifierGroup();

  const form = useForm<ModifierGroupFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(modifierGroupSchema) as any,
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onInvalid = (errors: Record<string, { message?: string }>) => {
    const { messages } = formatRHFErrors(errors, { name: "Name" });
    showValidationToast(messages, toast);
  };

  const onSubmit = async (values: ModifierGroupFormValues) => {
    try {
      await createMutation.mutateAsync({
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
      });
      toast.success("Modifier group created successfully!");
      router.push("/dashboard/modifier-groups");
    } catch (error) {
      console.error("Create modifier group error:", error);
      const mapped = mapServerError(error);
      if (mapped.isValidationError && Object.keys(mapped.fieldErrors).length > 0) {
        Object.entries(mapped.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof ModifierGroupFormValues, { type: "server", message });
        });
      }
      showValidationToast(
        mapped.toastMessages.length > 0 ? mapped.toastMessages : ["Failed to create modifier group"],
        toast
      );
    }
  };

  const isBusy = createMutation.isPending;

  return (
    <div>
      {/* Breadcrumb bar */}
      <div className="px-[var(--p-space-500)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)] sm:rounded-t-[var(--p-border-radius-400)]">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Modifier Groups", onClick: () => router.push("/dashboard/modifier-groups") },
          { label: "Create" },
        ]} />
      </div>

      <Card className="!rounded-t-none">
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
          {/* Header */}
          <header className="mb-[var(--p-space-500)]">
            <h1 className="text-[1.25rem] leading-[1.75rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
              Create Modifier Group
            </h1>
            <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
              Create a new group to organize modifiers for your dishes
            </p>
          </header>

          {/* Form fields */}
          <div className="space-y-[var(--p-space-400)] max-w-2xl">
            <div className="space-y-[var(--p-space-150)]">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., Protein Choice, Extra Toppings"
                {...form.register("name")}
              />
              <FieldError message={form.formState.errors.name?.message} />
            </div>

            <div className="space-y-[var(--p-space-150)]">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description for this modifier group"
                className="resize-y min-h-[100px]"
                maxLength={350}
                {...form.register("description")}
              />
              <div className="flex items-center justify-between">
                <FieldError message={form.formState.errors.description?.message} />
                <span className="text-[0.6875rem] text-[var(--p-color-text-secondary)] tabular-nums ml-auto">
                  {(form.watch("description") || "").length}/350
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-[var(--p-space-200)] pt-[var(--p-space-500)] mt-[var(--p-space-500)] border-t border-[var(--p-color-border-secondary)]">
            <Button type="button" variant="tertiary" onClick={() => router.push("/dashboard/modifier-groups")}>
              Discard
            </Button>
            <Button
              type="button"
              onClick={() => form.handleSubmit(onSubmit, onInvalid)()}
              disabled={isBusy}
            >
              {isBusy && <Spinner size="small" />}
              {isBusy ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
