"use client";

/**
 * Edit Modifier Group Page
 *
 * Simple form: name + description inside a single card.
 */

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/toast";
import { mapServerError, formatRHFErrors, showValidationToast } from "@/lib/validation-error-mapper";
import {
  Breadcrumb,
  Banner,
  Button,
  Card,
  Input,
  Textarea,
  Label,
  Spinner,
  SkeletonText,
} from "@/components/polaris";
import {
  useModifierGroup,
  useUpdateModifierGroup,
} from "@/hooks/use-modifier-groups";
import { FieldError } from "@/components/shared/field-error";

const modifierGroupSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").optional(),
  description: z.union([z.string().max(350, "Description must be 350 characters or less"), z.literal("")]).optional(),
});

type ModifierGroupFormValues = z.infer<typeof modifierGroupSchema>;

export default function EditModifierGroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;

  const { data: group, isLoading: groupLoading } = useModifierGroup(groupId);
  const updateMutation = useUpdateModifierGroup();

  const form = useForm<ModifierGroupFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(modifierGroupSchema) as any,
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (group) {
      form.reset({
        name: group.name,
        description: group.description || "",
      });
    }
  }, [group, form]);

  const onInvalid = (errors: Record<string, { message?: string }>) => {
    const { messages } = formatRHFErrors(errors, { name: "Name" });
    showValidationToast(messages, toast);
  };

  const onSubmit = async (values: ModifierGroupFormValues) => {
    try {
      const updateData: { name?: string; description?: string } = {};

      if (values.name !== undefined) {
        const trimmedName = values.name.trim();
        if (trimmedName && trimmedName !== group?.name) {
          updateData.name = trimmedName;
        } else if (!trimmedName && group?.name) {
          toast.error("Name cannot be empty");
          return;
        }
      }

      if (values.description !== undefined) {
        const trimmedDesc = values.description.trim();
        updateData.description = trimmedDesc || undefined;
      }

      if (Object.keys(updateData).length > 0) {
        await updateMutation.mutateAsync({
          id: groupId,
          ...updateData,
        });
        toast.success("Modifier group updated successfully!");
        router.push("/dashboard/modifier-groups");
      } else {
        toast.info("No changes to save");
      }
    } catch (error) {
      console.error("Update modifier group error:", error);
      const mapped = mapServerError(error);
      if (mapped.isValidationError && Object.keys(mapped.fieldErrors).length > 0) {
        Object.entries(mapped.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof ModifierGroupFormValues, { type: "server", message });
        });
      }
      showValidationToast(
        mapped.toastMessages.length > 0 ? mapped.toastMessages : ["Failed to update modifier group"],
        toast
      );
    }
  };

  // Loading state
  if (groupLoading) {
    return (
      <div>
        <div className="px-[var(--p-space-500)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)] sm:rounded-t-[var(--p-border-radius-400)]">
          <Breadcrumb items={[
            { label: "Dashboard", onClick: () => router.push("/dashboard") },
            { label: "Modifier Groups", onClick: () => router.push("/dashboard/modifier-groups") },
            { label: "Edit" },
          ]} />
        </div>
        <Card className="!rounded-t-none space-y-[var(--p-space-500)]">
          <div className="flex items-center justify-between">
            <div className="space-y-[var(--p-space-200)]">
              <div className="h-6 w-48 rounded bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
              <div className="h-4 w-64 rounded bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
            </div>
            <div className="flex gap-[var(--p-space-200)]">
              <div className="h-9 w-20 rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
              <div className="h-9 w-16 rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
            </div>
          </div>
          <div className="space-y-[var(--p-space-400)] max-w-2xl">
            <div className="space-y-[var(--p-space-150)]">
              <SkeletonText width="quarter" />
              <div className="h-9 w-full rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
            </div>
            <div className="space-y-[var(--p-space-150)]">
              <SkeletonText width="quarter" />
              <div className="h-24 w-full rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Not found state
  if (!group) {
    return (
      <div>
        <div className="px-[var(--p-space-500)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)] sm:rounded-t-[var(--p-border-radius-400)]">
          <Breadcrumb items={[
            { label: "Dashboard", onClick: () => router.push("/dashboard") },
            { label: "Modifier Groups", onClick: () => router.push("/dashboard/modifier-groups") },
            { label: "Not Found" },
          ]} />
        </div>
        <Card className="!rounded-t-none">
          <Banner tone="critical" title="Modifier group not found">
            <p>The modifier group you are looking for could not be found.</p>
          </Banner>
          <Button variant="secondary" className="mt-[var(--p-space-400)]" onClick={() => router.push("/dashboard/modifier-groups")}>
            Back to Groups
          </Button>
        </Card>
      </div>
    );
  }

  const isBusy = updateMutation.isPending;

  return (
    <div>
      {/* Breadcrumb bar */}
      <div className="px-[var(--p-space-500)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)] sm:rounded-t-[var(--p-border-radius-400)]">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Modifier Groups", onClick: () => router.push("/dashboard/modifier-groups") },
          { label: group.name || "Edit" },
        ]} />
      </div>

      <Card className="!rounded-t-none">
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
          {/* Header */}
          <header className="mb-[var(--p-space-500)]">
            <h1 className="text-[1.25rem] leading-[1.75rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
              {group.name}
            </h1>
            <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
              Update modifier group details
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
              {isBusy ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
