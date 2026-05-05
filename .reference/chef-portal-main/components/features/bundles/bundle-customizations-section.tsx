"use client";

import { useState } from "react";
import {
  Label, Input, Textarea, HelpText,
  Button, Card, CardDivider, Badge,
  Checkbox,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter,
} from "@/components/polaris";
import { SearchableSelect } from "@/components/polaris/searchable-select";
import { XSmallIcon, PlusIcon } from "@shopify/polaris-icons";
import { useModifierGroups } from "@/hooks/use-modifier-groups";
import { modifierGroupsService } from "@/services/modifier-groups.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/providers";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldError } from "@/components/shared/field-error";
import type { BundleFormData } from "@/app/dashboard/bundles/new/page";

interface BundleCustomizationsSectionProps {
  formData: BundleFormData;
  onUpdate: (updates: Partial<BundleFormData>) => void;
  errors?: Record<string, string>;
}

export function BundleCustomizationsSection({
  formData,
  onUpdate,
  errors = {},
}: BundleCustomizationsSectionProps) {
  const { user } = useAuth();
  const chefUserId = user?.id || "";
  const { data: modifierGroups, isLoading: modifierGroupsLoading } =
    useModifierGroups(chefUserId);
  const queryClient = useQueryClient();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newModifierGroupName, setNewModifierGroupName] = useState("");
  const [creatingForGroupIndex, setCreatingForGroupIndex] = useState<number | null>(null);

  const addCustomizationGroup = () => {
    onUpdate({
      customizationGroups: [
        ...formData.customizationGroups,
        {
          modifierGroupId: "",
          required: false,
          requiredDescription: "",
          selectionType: "single",
          modifiers: [],
        },
      ],
    });
  };

  const updateCustomizationGroup = (
    index: number,
    updates: Partial<BundleFormData["customizationGroups"][0]>
  ) => {
    const newGroups = [...formData.customizationGroups];
    newGroups[index] = { ...newGroups[index], ...updates };
    onUpdate({ customizationGroups: newGroups });
  };

  const removeCustomizationGroup = (index: number) => {
    onUpdate({
      customizationGroups: formData.customizationGroups.filter((_, i) => i !== index),
    });
  };

  const addModifier = (groupIndex: number) => {
    const newGroups = [...formData.customizationGroups];
    newGroups[groupIndex].modifiers.push({
      name: "",
      priceAdjustment: 0,
      description: "",
    });
    onUpdate({ customizationGroups: newGroups });
  };

  const updateModifier = (
    groupIndex: number,
    modifierIndex: number,
    updates: Partial<BundleFormData["customizationGroups"][0]["modifiers"][0]>
  ) => {
    const newGroups = [...formData.customizationGroups];
    const newGroup = { ...newGroups[groupIndex] };
    const newModifiers = [...newGroup.modifiers];
    newModifiers[modifierIndex] = { ...newModifiers[modifierIndex], ...updates };
    newGroup.modifiers = newModifiers;
    newGroups[groupIndex] = newGroup;
    onUpdate({ customizationGroups: newGroups });
  };

  const removeModifier = (groupIndex: number, modifierIndex: number) => {
    const newGroups = [...formData.customizationGroups];
    newGroups[groupIndex].modifiers = newGroups[groupIndex].modifiers.filter(
      (_, i) => i !== modifierIndex
    );
    onUpdate({ customizationGroups: newGroups });
  };

  const createModifierGroupMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!chefUserId) throw new Error("Chef user ID is required");
      const response = await modifierGroupsService.createModifierGroup({
        name: name.trim(),
        chefUser: chefUserId,
      });
      return response.data;
    },
    onSuccess: (newGroup) => {
      queryClient.invalidateQueries({ queryKey: ["modifier-groups", chefUserId] });
      if (creatingForGroupIndex !== null) {
        updateCustomizationGroup(creatingForGroupIndex, { modifierGroupId: newGroup.id });
      }
      setCreateModalOpen(false);
      setNewModifierGroupName("");
      setCreatingForGroupIndex(null);
    },
  });

  return (
    <Card>
      <div className="space-y-[var(--p-space-500)]">
        <div className="flex flex-col gap-[var(--p-space-200)] sm:flex-row sm:items-center sm:justify-between">
          <HelpText>Add modifier groups to allow customers to customize their bundle.</HelpText>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addCustomizationGroup}
            className="w-full sm:w-auto shrink-0"
          >
            <PlusIcon className="size-4 fill-current" />
            Add Group
          </Button>
        </div>

        {formData.customizationGroups.length === 0 ? (
          <div className="py-[var(--p-space-600)] text-center border-2 border-dashed border-[var(--p-color-border)] rounded-[var(--p-border-radius-200)]">
            <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">No customization groups yet</p>
            <Button type="button" variant="plain" size="sm" onClick={addCustomizationGroup} className="mt-[var(--p-space-200)]">
              Add your first customization group
            </Button>
          </div>
        ) : (
          <div className="space-y-[var(--p-space-400)]">
            {formData.customizationGroups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)] overflow-hidden"
              >
                {/* Group header */}
                <div className="flex items-center justify-between px-[var(--p-space-400)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface-secondary)]">
                  <span className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                    Group {groupIndex + 1}
                    {group.modifierGroupId && modifierGroups?.find((mg) => mg.id === group.modifierGroupId) && (
                      <span className="font-[var(--p-font-weight-regular)] text-[var(--p-color-text-secondary)]">
                        {" "}&mdash; {modifierGroups.find((mg) => mg.id === group.modifierGroupId)?.name}
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCustomizationGroup(groupIndex)}
                    className="size-7 flex items-center justify-center rounded-[var(--p-border-radius-200)] text-[var(--p-color-icon-secondary)] hover:text-[var(--p-color-icon-critical)] hover:bg-[var(--p-color-bg-surface-critical)] cursor-pointer transition-colors"
                    aria-label="Remove group"
                  >
                    <XSmallIcon className="size-4 fill-current" />
                  </button>
                </div>

                {/* Group body */}
                <div className="px-[var(--p-space-400)] py-[var(--p-space-400)] space-y-[var(--p-space-400)]">
                  {/* Modifier Group, Selection Type, Required */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--p-space-300)]">
                    {/* Modifier Group */}
                    <div>
                      <Label className="text-[0.6875rem]">Modifier Group</Label>
                      {modifierGroupsLoading ? (
                        <Skeleton className="h-[2.25rem] w-full rounded-[var(--p-border-radius-200)]" />
                      ) : modifierGroups && modifierGroups.length === 0 ? (
                        <Button
                          type="button"
                          variant="secondary"
                          className="w-full"
                          onClick={() => {
                            setCreatingForGroupIndex(groupIndex);
                            setCreateModalOpen(true);
                          }}
                        >
                          <PlusIcon className="size-4 fill-current" />
                          Create Modifier Group
                        </Button>
                      ) : (
                        <div className="flex gap-[var(--p-space-150)]">
                          <SearchableSelect
                            options={modifierGroups?.map((mg) => ({ value: mg.id, label: mg.name })) || []}
                            value={group.modifierGroupId}
                            onValueChange={(v) => updateCustomizationGroup(groupIndex, { modifierGroupId: v })}
                            placeholder="Select"
                            searchPlaceholder="Search..."
                            emptyMessage="None found."
                            error={!!errors[`customizationGroups.${groupIndex}.modifierGroupId`]}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setCreatingForGroupIndex(groupIndex);
                              setCreateModalOpen(true);
                            }}
                            className="shrink-0 size-[2.25rem] flex items-center justify-center rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] bg-[var(--p-color-bg-surface)] hover:bg-[var(--p-color-bg-surface-hover)] cursor-pointer transition-colors"
                            title="Create new modifier group"
                          >
                            <PlusIcon className="size-4 fill-[var(--p-color-icon)]" />
                          </button>
                        </div>
                      )}
                      <FieldError message={errors[`customizationGroups.${groupIndex}.modifierGroupId`]} />
                    </div>

                    {/* Selection Type */}
                    <div>
                      <Label className="text-[0.6875rem]">Selection Type</Label>
                      <div className="flex rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] overflow-hidden">
                        {(["single", "multiple"] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => updateCustomizationGroup(groupIndex, { selectionType: type })}
                            className={`flex-1 px-[var(--p-space-300)] py-[var(--p-space-150)] text-[0.75rem] font-[var(--p-font-weight-medium)] cursor-pointer transition-colors ${
                              group.selectionType === type
                                ? "bg-[var(--p-color-bg-fill-brand)] text-white"
                                : "bg-[var(--p-color-bg-surface)] text-[var(--p-color-text)] hover:bg-[var(--p-color-bg-surface-hover)]"
                            } ${type === "multiple" ? "border-l border-[var(--p-color-border)]" : ""}`}
                          >
                            {type === "single" ? "Single" : "Multiple"}
                          </button>
                        ))}
                      </div>
                      <HelpText>
                        {group.selectionType === "single" ? "Customer picks one option" : "Customer picks multiple options"}
                      </HelpText>
                    </div>

                    {/* Required */}
                    <div>
                      <Label className="text-[0.6875rem]">Required</Label>
                      <div className="flex items-center gap-[var(--p-space-200)] mt-[var(--p-space-200)]">
                        <Checkbox
                          id={`required-${groupIndex}`}
                          checked={group.required}
                          onCheckedChange={(checked) =>
                            updateCustomizationGroup(groupIndex, { required: checked === true })
                          }
                        />
                        <label
                          htmlFor={`required-${groupIndex}`}
                          className="text-[0.8125rem] text-[var(--p-color-text)] cursor-pointer select-none"
                        >
                          {group.required ? "Required" : "Optional"}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Modifiers sub-section */}
                  <div className="border-t border-[var(--p-color-border-secondary)] pt-[var(--p-space-300)] space-y-[var(--p-space-300)]">
                    <div className="flex items-center justify-between">
                      <Label>
                        Modifiers
                        {group.modifiers.length > 0 && (
                          <Badge tone="default" size="sm" className="ml-[var(--p-space-150)]">{group.modifiers.length}</Badge>
                        )}
                      </Label>
                      <Button
                        type="button"
                        variant="secondary"
                        size="micro"
                        onClick={() => addModifier(groupIndex)}
                        disabled={!group.modifierGroupId}
                      >
                        <PlusIcon className="size-3.5 fill-current" />
                        Add
                      </Button>
                    </div>

                    <FieldError message={errors[`customizationGroups.${groupIndex}.modifiers`]} />

                    {group.modifiers.length === 0 ? (
                      <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] text-center py-[var(--p-space-400)]">
                        No modifiers yet. Add one to define customer options.
                      </p>
                    ) : (
                      <div className="space-y-[var(--p-space-200)]">
                        {group.modifiers.map((modifier, modifierIndex) => (
                          <div
                            key={modifierIndex}
                            className="flex items-start gap-[var(--p-space-200)] p-[var(--p-space-300)] bg-[var(--p-color-bg-surface-secondary)] rounded-[var(--p-border-radius-200)]"
                          >
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-[var(--p-space-200)]">
                              <div>
                                <Label className="text-[0.6875rem]">Name</Label>
                                <Input
                                  value={modifier.name}
                                  onChange={(e) => updateModifier(groupIndex, modifierIndex, { name: e.target.value })}
                                  placeholder="e.g., Extra Sauce"
                                  error={!!errors[`customizationGroups.${groupIndex}.modifiers.${modifierIndex}.name`]}
                                />
                                <FieldError message={errors[`customizationGroups.${groupIndex}.modifiers.${modifierIndex}.name`]} />
                              </div>
                              <div>
                                <Label className="text-[0.6875rem]">Price (+$)</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={modifier.priceAdjustment === 0 ? "" : modifier.priceAdjustment}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    if (v === "" || v === "-") {
                                      updateModifier(groupIndex, modifierIndex, { priceAdjustment: 0 });
                                      return;
                                    }
                                    const numValue = parseFloat(v);
                                    if (!isNaN(numValue) && isFinite(numValue)) {
                                      updateModifier(groupIndex, modifierIndex, { priceAdjustment: numValue });
                                    }
                                  }}
                                  placeholder="0.00"
                                />
                                <HelpText>
                                  {modifier.priceAdjustment > 0 ? `+$${modifier.priceAdjustment.toFixed(2)}` : "No extra cost"}
                                </HelpText>
                              </div>
                              <div>
                                <Label className="text-[0.6875rem]">Description</Label>
                                <Textarea
                                  value={modifier.description}
                                  onChange={(e) => updateModifier(groupIndex, modifierIndex, { description: e.target.value })}
                                  onPaste={(e) => {
                                    e.preventDefault();
                                    const text = e.clipboardData.getData("text/plain");
                                    const textarea = e.currentTarget;
                                    const start = textarea.selectionStart;
                                    const end = textarea.selectionEnd;
                                    const current = modifier.description || "";
                                    const newValue = current.substring(0, start) + text + current.substring(end);
                                    updateModifier(groupIndex, modifierIndex, { description: newValue });
                                    setTimeout(() => textarea.setSelectionRange(start + text.length, start + text.length), 0);
                                  }}
                                  placeholder="Optional"
                                  rows={1}
                                  className="resize-y"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeModifier(groupIndex, modifierIndex)}
                              className="mt-[1.25rem] shrink-0 size-7 flex items-center justify-center rounded-[var(--p-border-radius-200)] text-[var(--p-color-icon-secondary)] hover:text-[var(--p-color-icon-critical)] hover:bg-[var(--p-color-bg-surface-critical)] cursor-pointer transition-colors"
                              aria-label="Remove modifier"
                            >
                              <XSmallIcon className="size-4 fill-current" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modifier Group Dialog */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Modifier Group</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-[var(--p-space-400)]">
            <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">
              Create a new modifier group to use for this customization.
            </p>
            <div>
              <Label htmlFor="modifier-group-name">Name</Label>
              <Input
                id="modifier-group-name"
                value={newModifierGroupName}
                onChange={(e) => setNewModifierGroupName(e.target.value)}
                placeholder="e.g., Toppings, Size, Extras"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newModifierGroupName.trim()) {
                    createModifierGroupMutation.mutate(newModifierGroupName.trim());
                  }
                }}
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setCreateModalOpen(false);
                setNewModifierGroupName("");
                setCreatingForGroupIndex(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (newModifierGroupName.trim()) {
                  createModifierGroupMutation.mutate(newModifierGroupName.trim());
                }
              }}
              disabled={!newModifierGroupName.trim() || createModifierGroupMutation.isPending}
            >
              {createModifierGroupMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
