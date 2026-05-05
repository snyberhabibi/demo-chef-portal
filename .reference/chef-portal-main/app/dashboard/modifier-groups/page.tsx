"use client";

/**
 * Modifier Groups Listing Page
 *
 * Simple list with three-dot action menu per row.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useModifierGroups,
  useDeleteModifierGroup,
} from "@/hooks/use-modifier-groups";
import { toast } from "@/components/ui/toast";
import {
  EditIcon,
  DeleteIcon,
  PlusIcon,
  ListBulletedIcon,
} from "@shopify/polaris-icons";
import {
  Breadcrumb,
  Banner,
  Button,
  Card,
  Spinner,
  EmptyState,
  SkeletonText,
} from "@/components/polaris";
import { ConfirmationDialog } from "@/components/shared";

export default function ModifierGroupsPage() {
  const router = useRouter();
  const { data: modifierGroups, isLoading, isError, error } = useModifierGroups();
  const deleteMutation = useDeleteModifierGroup();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const groups = Array.isArray(modifierGroups) ? modifierGroups : [];

  const handleDeleteClick = (id: string, name: string) => {
    setGroupToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!groupToDelete) return;
    try {
      await deleteMutation.mutateAsync(groupToDelete.id);
      toast.success("Modifier group deleted successfully");
      setDeleteDialogOpen(false);
      setGroupToDelete(null);
    } catch {
      toast.error("Failed to delete modifier group");
    }
  };

  // Error state
  if (isError) {
    return (
      <div className="space-y-[var(--p-space-400)]">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Modifier Groups" },
        ]} />
        <h2 className="text-[1.875rem] leading-[2.25rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
          Modifier Groups
        </h2>
        <Banner tone="critical" title="Error loading modifier groups">
          <p>{error instanceof Error ? error.message : "Failed to load modifier groups. Please try again."}</p>
        </Banner>
      </div>
    );
  }

  return (
    <div className="space-y-[var(--p-space-500)]">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        { label: "Modifier Groups" },
      ]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[1.875rem] leading-[2.25rem] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-denser)] text-[var(--p-color-text)]" data-testid="modifier-groups-heading">
            Modifier Groups
          </h2>
          <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
            Organize modifiers into groups for your dishes
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/modifier-groups/new")} data-testid="modifier-groups-create-button">
          <PlusIcon className="size-4 fill-current" />
          Create Group
        </Button>
      </div>

      {/* Content */}
      <Card>
        {isLoading ? (
          <div className="space-y-[var(--p-space-200)]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-[var(--p-space-300)] px-[var(--p-space-300)] py-[var(--p-space-300)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)]"
              >
                <div className="flex-1 space-y-[var(--p-space-150)]">
                  <SkeletonText width="third" />
                  <SkeletonText width="half" />
                </div>
                <div className="size-8 rounded-full bg-[var(--p-color-bg-fill-secondary)] animate-pulse shrink-0" />
              </div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <EmptyState
            heading="No modifier groups"
            description="Create your first modifier group to organize modifiers for your dishes."
            icon={ListBulletedIcon}
            primaryAction={{
              label: "Create Group",
              onClick: () => router.push("/dashboard/modifier-groups/new"),
            }}
          />
        ) : (
          <div className="space-y-[var(--p-space-200)]">
            {groups.map((group) => {
              const isDeleting = deleteMutation.isPending && groupToDelete?.id === group.id;

              return (
                <div
                  key={group.id}
                  className="flex items-center gap-[var(--p-space-300)] px-[var(--p-space-300)] py-[var(--p-space-300)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)] transition-shadow duration-150 hover:shadow-[var(--p-shadow-200)] cursor-pointer"
                  onClick={() => router.push(`/dashboard/modifier-groups/${group.id}/edit`)}
                >
                  {/* Name + description */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] truncate">
                      {group.name}
                    </h3>
                    {group.description && (
                      <p className="text-[0.75rem] text-[var(--p-color-text-secondary)] truncate mt-[var(--p-space-025)]">
                        {group.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-[var(--p-space-100)] shrink-0">
                    <Button
                      type="button"
                      variant="tertiary"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/modifier-groups/${group.id}/edit`); }}
                    >
                      <EditIcon className="size-4 fill-current" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      type="button"
                      variant="tertiary"
                      size="sm"
                      className="text-[var(--p-color-text-critical)] hover:text-[var(--p-color-text-critical)]"
                      onClick={(e) => { e.stopPropagation(); handleDeleteClick(group.id, group.name); }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Spinner size="small" />
                      ) : (
                        <DeleteIcon className="size-4 fill-current" />
                      )}
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        type="delete"
        title="Delete Modifier Group"
        description={
          groupToDelete
            ? `Are you sure you want to delete "${groupToDelete.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this modifier group? This action cannot be undone."
        }
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
        variant="destructive"
      />
    </div>
  );
}
