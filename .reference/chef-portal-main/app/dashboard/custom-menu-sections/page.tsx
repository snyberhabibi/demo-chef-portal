"use client";

/**
 * Custom Menu Sections Listing Page
 *
 * Sortable drag-to-reorder list with three-dot action menu per row.
 */

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useCustomMenuSections,
  useDeleteCustomMenuSection,
  useToggleCustomMenuSectionStatus,
  useUpdateCustomMenuSection,
} from "@/hooks/use-custom-menu-sections";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
  EditIcon,
  DeleteIcon,
  PlusIcon,
  ViewIcon,
  HideIcon,
  ListBulletedIcon,
  MenuVerticalIcon,
} from "@shopify/polaris-icons";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  Breadcrumb,
  Banner,
  Button,
  Card,
  Spinner,
  EmptyState,
  StatusDot,
  SkeletonText,
  SortableList,
  ActionList,
} from "@/components/polaris";
import type { SortableItem, ActionListItem } from "@/components/polaris";
import { ConfirmationDialog } from "@/components/shared";
import { StoreFrontIndicator } from "@/components/features/chef-profile/store-front-indicator";

export default function CustomMenuSectionsPage() {
  const router = useRouter();
  const { data: sectionsData, isLoading, isError, error } = useCustomMenuSections();
  const deleteMutation = useDeleteCustomMenuSection();
  const toggleStatusMutation = useToggleCustomMenuSectionStatus();
  const updateMutation = useUpdateCustomMenuSection();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [togglingSectionId, setTogglingSectionId] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const sections = useMemo(() => {
    const raw = Array.isArray(sectionsData?.data)
      ? sectionsData.data
      : Array.isArray(sectionsData)
      ? sectionsData
      : [];
    return [...raw].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }, [sectionsData]);

  const handleDeleteClick = (id: string, name: string) => {
    setSectionToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sectionToDelete) return;
    try {
      await deleteMutation.mutateAsync(sectionToDelete.id);
      toast.success("Custom menu section deleted successfully");
      setDeleteDialogOpen(false);
      setSectionToDelete(null);
    } catch {
      toast.error("Failed to delete custom menu section");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setTogglingSectionId(id);
    try {
      await toggleStatusMutation.mutateAsync({ id, isActive: !currentStatus });
      toast.success(`Section ${!currentStatus ? "published" : "unpublished"} successfully`);
    } catch {
      toast.error(`Failed to ${!currentStatus ? "publish" : "unpublish"} section`);
    } finally {
      setTogglingSectionId(null);
    }
  };

  const handleReorder = async (reorderedItems: SortableItem[]) => {
    setIsReordering(true);
    try {
      for (let i = 0; i < reorderedItems.length; i++) {
        const section = sections.find((s) => s.id === reorderedItems[i].id);
        if (section && section.sortOrder !== i + 1) {
          await updateMutation.mutateAsync({ id: section.id, sortOrder: i + 1 });
        }
      }
      toast.success("Section order updated");
    } catch {
      toast.error("Failed to update section order");
    } finally {
      setIsReordering(false);
    }
  };

  // Error state
  if (isError) {
    return (
      <div className="space-y-[var(--p-space-400)]">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Custom Menu Sections" },
        ]} />
        <h2 className="text-[1.875rem] leading-[2.25rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
          Custom Menu Sections
        </h2>
        <Banner tone="critical" title="Error loading sections">
          <p>{error instanceof Error ? error.message : "Failed to load custom menu sections. Please try again."}</p>
        </Banner>
      </div>
    );
  }

  // Build sortable items
  const sortableItems: SortableItem[] = sections.map((section) => {
    const isToggling = toggleStatusMutation.isPending && togglingSectionId === section.id;

    const actionItems: ActionListItem[] = [
      {
        id: "toggle",
        label: section.isActive ? "Unpublish" : "Publish",
        icon: section.isActive ? HideIcon : ViewIcon,
        disabled: isToggling,
        onClick: () => handleToggleStatus(section.id, section.isActive),
      },
      {
        id: "edit",
        label: "Edit",
        icon: EditIcon,
        onClick: () => router.push(`/dashboard/custom-menu-sections/${section.id}/edit`),
      },
      {
        id: "delete",
        label: "Delete",
        icon: DeleteIcon,
        destructive: true,
        onClick: () => handleDeleteClick(section.id, section.name),
      },
    ];

    return {
      id: section.id,
      content: (
        <div className="flex items-center gap-[var(--p-space-300)] w-full">
          {/* Name + dish count */}
          <div className="flex-1 min-w-0">
            <h3 className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] truncate">
              {section.name}
            </h3>
            <p className="text-[0.75rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-025)]">
              {section.dishCount} {section.dishCount === 1 ? "dish" : "dishes"}
            </p>
          </div>

          {/* Status pill */}
          <span className="inline-flex items-center gap-[var(--p-space-100)] px-[var(--p-space-200)] py-[var(--p-space-050)] rounded-[var(--p-border-radius-full)] shrink-0">
            {isToggling ? (
              <Spinner size="small" />
            ) : (
              <>
                <StatusDot tone={section.isActive ? "success" : "warning"} size="sm" />
                <span className="text-[0.6875rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)]">
                  {section.isActive ? "Active" : "Inactive"}
                </span>
              </>
            )}
          </span>

          {/* Three-dot menu */}
          <PopoverPrimitive.Root>
            <PopoverPrimitive.Trigger asChild>
              <button
                type="button"
                className={cn(
                  "size-[2rem] rounded-full flex items-center justify-center shrink-0",
                  "text-[var(--p-color-icon)] cursor-pointer",
                  "transition-colors duration-150",
                  "hover:bg-[var(--p-color-bg-surface-hover)]",
                )}
              >
                <MenuVerticalIcon className="size-4 fill-current" />
              </button>
            </PopoverPrimitive.Trigger>
            <PopoverPrimitive.Portal>
              <PopoverPrimitive.Content
                align="end"
                sideOffset={4}
                className={cn(
                  "z-50 w-[12rem]",
                  "bg-[var(--p-color-bg-surface)]",
                  "border border-[var(--p-color-border)]",
                  "rounded-[var(--p-border-radius-300)]",
                  "shadow-[var(--p-shadow-300)]",
                  "overflow-hidden",
                  "animate-in fade-in-0 zoom-in-95 duration-150",
                  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                  "data-[side=bottom]:slide-in-from-top-2",
                  "data-[side=top]:slide-in-from-bottom-2",
                )}
              >
                <ActionList items={actionItems} />
              </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
          </PopoverPrimitive.Root>
        </div>
      ),
    };
  });

  return (
    <div className="space-y-[var(--p-space-500)]">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        { label: "Custom Menu Sections" },
      ]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[1.875rem] leading-[2.25rem] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-denser)] text-[var(--p-color-text)] flex items-center gap-[var(--p-space-200)]" data-testid="custom-menu-sections-heading">
            Custom Menu Sections
            <StoreFrontIndicator
              description="Custom menu sections appear as tabs on your store-front profile, positioned between 'Weekly Menu' and 'Chef Story'. Organize dishes into groups like 'Popular Dishes' or 'Chef's Specials' to help customers discover your menu."
              screenshot="/images/custom-sections.png"
              screenshotAlt="Custom menu sections on store-front"
            />
          </h2>
          <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
            Drag to reorder how sections appear on your store-front
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/custom-menu-sections/new")} data-testid="custom-menu-sections-create-button">
          <PlusIcon className="size-4 fill-current" />
          Create Section
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
                <div className="size-4 rounded bg-[var(--p-color-bg-fill-secondary)] animate-pulse shrink-0" />
                <div className="flex-1 space-y-[var(--p-space-150)]">
                  <SkeletonText width="third" />
                  <SkeletonText width="quarter" />
                </div>
                <div className="h-5 w-14 rounded-full bg-[var(--p-color-bg-fill-secondary)] animate-pulse shrink-0" />
                <div className="size-8 rounded-full bg-[var(--p-color-bg-fill-secondary)] animate-pulse shrink-0" />
              </div>
            ))}
          </div>
        ) : sections.length === 0 ? (
          <EmptyState
            heading="No custom menu sections"
            description="Create your first custom menu section to organize your dishes into curated groups."
            icon={ListBulletedIcon}
            primaryAction={{
              label: "Create Section",
              onClick: () => router.push("/dashboard/custom-menu-sections/new"),
            }}
          />
        ) : (
          <div className={cn(isReordering && "opacity-60 pointer-events-none")}>
            <SortableList items={sortableItems} onReorder={handleReorder} />
          </div>
        )}

        {isReordering && (
          <div className="flex items-center gap-[var(--p-space-200)] pt-[var(--p-space-300)] border-t border-[var(--p-color-border-secondary)]">
            <Spinner size="small" />
            <span className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">Saving new order...</span>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        type="delete"
        title="Delete Custom Menu Section"
        description={
          sectionToDelete
            ? `Are you sure you want to delete "${sectionToDelete.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this custom menu section? This action cannot be undone."
        }
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
        variant="destructive"
      />
    </div>
  );
}
