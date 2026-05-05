"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDishes, useUpdateDish, useDeleteDish } from "@/hooks/use-dishes";
import { useCategories } from "@/hooks/use-categories";
import { CreateDishModal } from "@/components/features/dishes/create-dish-modal";
import {
  CreateFlashSaleModal,
  type SelectedDish,
} from "@/components/features/dishes/create-flash-sale-modal";
import type { IconTab, FilterPill } from "@/components/polaris";

const statusPills: FilterPill[] = [
  { id: "all", label: "All" },
  { id: "published", label: "Published" },
  { id: "draft", label: "Draft" },
  { id: "archived", label: "Archived" },
];
import type { DataTableAction } from "@/components/shared/data-table";
import { PolarisDishCard } from "@/components/polaris";
import { DishesEmptyState } from "@/components/features/dishes/dishes-empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import {
  EditIcon,
  DeleteIcon,
  ViewIcon,
  HideIcon,
  ArchiveIcon,
  PlusIcon,
} from "@shopify/polaris-icons";
import { ConfirmationDialog } from "@/components/shared";
import { useLoading } from "@/contexts/loading-context";
import type { Dish } from "@/types/dishes.types";
import {
  Breadcrumb,
  Banner,
  Button,
  SearchBar,
  Pagination,
  Card,
  Spinner,
  IconTabs,
  FilterPills,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/polaris";


export default function DishesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL search params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categoryResolved, setCategoryResolved] = useState(!searchParams.get("category"));
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [pageSize, setPageSize] = useState(12);

  // Sync state to URL
  const updateUrl = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(overrides)) {
        if (!value || (key === "page" && value === "1")) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      if (searchQuery !== debouncedSearchQuery) {
        setCurrentPage(1);
        updateUrl({ q: searchQuery || undefined, page: undefined });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery, updateUrl]);

  const activeStatus = statusFilter === "all" ? undefined : (statusFilter as "draft" | "published" | "archived");
  const activeCategory = selectedCategory !== "all" ? selectedCategory : undefined;

  const {
    data: dishesData,
    isLoading,
    isError,
    error,
  } = useDishes({
    page: currentPage,
    limit: pageSize,
    status: activeStatus,
    search: debouncedSearchQuery || undefined,
    category: activeCategory,
  });

  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  // Resolve category slug from URL → category ID once categories load
  useEffect(() => {
    if (categoryResolved || !categories) return;
    const categorySlug = searchParams.get("category");
    if (categorySlug) {
      const match = categories.find((c) => c.slug === categorySlug);
      if (match) setSelectedCategory(match.id);
    }
    setCategoryResolved(true);
  }, [categories, categoryResolved, searchParams]);

  const categoryTabs: IconTab[] = useMemo(() => {
    if (!categories || categories.length === 0) return [{ id: "all", label: "All" }];
    const list = categories
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name))
      .map((cat) => ({ id: cat.id, label: cat.name, image: cat.image || null }));
    return [{ id: "all", label: "All" }, ...list];
  }, [categories]);

  const updateDishMutation = useUpdateDish();
  const deleteMutation = useDeleteDish();
  const { setLoading } = useLoading();

  const [createDishModalOpen, setCreateDishModalOpen] = useState(false);
  const [flashSaleModalOpen, setFlashSaleModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "publish" | "unpublish" | "archive" | "restore";
    dish: Dish;
  } | null>(null);
  const [processingDishId, setProcessingDishId] = useState<string | null>(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl({ page: page > 1 ? page.toString() : undefined });
  };
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    updateUrl({ page: undefined });
  };
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const handleStatusFilterChange = (value: string | string[]) => {
    const status = Array.isArray(value) ? value[0] : value;
    setStatusFilter(status);
    setCurrentPage(1);
    updateUrl({ status: status !== "all" ? status : undefined, page: undefined });
  };
  const handleCategoryFilterChange = (categoryId: string) => {
    const newCat = selectedCategory === categoryId ? "all" : categoryId;
    setSelectedCategory(newCat);
    setCurrentPage(1);
    // Write slug to URL instead of ID
    const slug = newCat !== "all" ? categories?.find((c) => c.id === newCat)?.slug : undefined;
    updateUrl({ category: slug || undefined, page: undefined });
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    const { type, dish } = confirmAction;

    if (type === "publish" || type === "restore") {
      const hasImages = (dish.images && dish.images.length > 0) || (dish.image && dish.image.trim().length > 0);
      if (!hasImages) {
        toast.error(`Cannot publish "${dish.name}". Please add at least one image first.`);
        setConfirmDialogOpen(false);
        setConfirmAction(null);
        return;
      }
    }

    try {
      setProcessingDishId(dish.id);
      setLoading(true);

      switch (type) {
        case "delete":
          await deleteMutation.mutateAsync(dish.id);
          toast.success(`"${dish.name}" has been deleted`);
          break;
        case "publish":
          await updateDishMutation.mutateAsync({ id: dish.id, data: { status: "published" } });
          toast.success(`"${dish.name}" has been published`);
          break;
        case "unpublish":
          await updateDishMutation.mutateAsync({ id: dish.id, data: { status: "draft" } });
          toast.success(`"${dish.name}" has been unpublished`);
          break;
        case "archive":
          await updateDishMutation.mutateAsync({ id: dish.id, data: { status: "archived" } });
          toast.success(`"${dish.name}" has been archived`);
          break;
        case "restore":
          await updateDishMutation.mutateAsync({ id: dish.id, data: { status: "published" } });
          toast.success(`"${dish.name}" has been restored`);
          break;
      }
      setConfirmDialogOpen(false);
      setConfirmAction(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to ${type} dish.`);
    } finally {
      setProcessingDishId(null);
      setLoading(false);
    }
  };

  const getRowActions = (dish: Dish): DataTableAction<Dish>[] => [
    {
      label: "Edit",
      icon: EditIcon,
      onClick: () => router.push(`/dashboard/dishes/${dish.id}/edit`),
    },
    {
      label: dish.status === "published" ? "Unpublish" : dish.status === "archived" ? "Restore" : "Publish",
      icon: dish.status === "published" ? HideIcon : ViewIcon,
      onClick: () => {
        const type = dish.status === "published" ? "unpublish" : dish.status === "archived" ? "restore" : "publish";
        if ((type === "publish" || type === "restore") && !(dish.images?.length || dish.image?.trim())) {
          toast.error(`Cannot publish "${dish.name}". Please add at least one image first.`);
          return;
        }
        setConfirmAction({ type, dish });
        setConfirmDialogOpen(true);
      },
      disabled: () => updateDishMutation.isPending || deleteMutation.isPending,
    },
    ...(dish.status !== "archived" ? [{
      label: "Archive",
      icon: ArchiveIcon,
      onClick: () => { setConfirmAction({ type: "archive", dish }); setConfirmDialogOpen(true); },
      disabled: () => updateDishMutation.isPending || deleteMutation.isPending,
    } as DataTableAction<Dish>] : []),
    {
      label: "Delete",
      icon: DeleteIcon,
      variant: "destructive" as const,
      onClick: () => { setConfirmAction({ type: "delete", dish }); setConfirmDialogOpen(true); },
      disabled: () => deleteMutation.isPending || updateDishMutation.isPending,
    },
  ];

  // Error state
  if (isError) {
    return (
      <div className="space-y-[var(--p-space-400)]">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Dishes" },
        ]} />
        <h2 className="text-[1.875rem] leading-[2.25rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]" data-testid="dishes-heading">Dishes</h2>
        <Banner tone="critical" title="Error loading dishes">
          <p>{error instanceof Error ? error.message : "Failed to load dishes. Please try again."}</p>
        </Banner>
      </div>
    );
  }

  const dishes = dishesData?.data || [];
  const totalItems = dishesData?.total || 0;
  const totalPages = dishesData?.totalPages || 0;
  const hasAnyDishes = totalItems > 0;

  const getEmptyStateVariant = (): "no-dishes" | "no-results" | "no-draft" | "no-published" | "no-archived" | "no-search-results" => {
    if (!hasAnyDishes) return "no-dishes";
    if (debouncedSearchQuery) return "no-search-results";
    if (statusFilter === "draft") return "no-draft";
    if (statusFilter === "published") return "no-published";
    if (statusFilter === "archived") return "no-archived";
    return "no-results";
  };

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  const handleEmptyStateAction = () => {
    if (!hasAnyDishes) setCreateDishModalOpen(true);
    else if (debouncedSearchQuery) handleSearchChange("");
    else handleClearAllFilters();
  };

  const visibilityWarning = "Changing this dish's status will affect its appearance on the menu, custom menu sections, and search results.";

  const getConfirmationProps = () => {
    if (!confirmAction) return null;
    const { type, dish } = confirmAction;
    const base = {
      open: confirmDialogOpen,
      onOpenChange: (open: boolean) => { setConfirmDialogOpen(open); if (!open) setConfirmAction(null); },
      onConfirm: handleConfirmAction,
      isLoading: updateDishMutation.isPending || deleteMutation.isPending,
    };
    const messages: Record<string, { title: string; description: string; variant?: "destructive" | "default" }> = {
      delete: { title: "Delete Dish", description: `Delete "${dish.name}"? This cannot be undone.`, variant: "destructive" },
      archive: { title: "Archive Dish", description: `Archive "${dish.name}"? It will be hidden but can be restored.` },
      restore: { title: "Restore Dish", description: `Restore "${dish.name}"? It will be published and visible.` },
      publish: { title: "Publish Dish", description: `Publish "${dish.name}"? It will be visible to customers.` },
      unpublish: { title: "Unpublish Dish", description: `Unpublish "${dish.name}"? It will be moved to draft.` },
    };
    const m = messages[type];
    return { ...base, type: type as "delete", title: m.title, description: m.description, variant: m.variant || ("default" as const), warning: visibilityWarning };
  };

  const handleCreateFlashSale = (data: { startDate: Date; endDate: Date; dishes: SelectedDish[] }): void => {
    toast.success(`Flash sale created for ${data.dishes.length} dish(es)`);
    setFlashSaleModalOpen(false);
  };

  return (
    <div className="space-y-[var(--p-space-500)]">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        { label: "Dishes" },
      ]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[1.875rem] leading-[2.25rem] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-denser)] text-[var(--p-color-text)]" data-testid="dishes-heading">
            Dishes
          </h2>
          <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
            Manage your menu dishes
          </p>
        </div>
        <Button onClick={() => setCreateDishModalOpen(true)} data-testid="dishes-create-button">
          <PlusIcon className="size-4 fill-current" />
          Create Dish
        </Button>
      </div>

      {/* Search + status pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[var(--p-space-300)]">
        <div className="w-full sm:max-w-sm">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search dishes..."
            data-testid="dishes-search-input"
          />
        </div>
        <FilterPills
          pills={statusPills}
          selected={statusFilter}
          onSelect={handleStatusFilterChange}
          data-testid="dishes-status-filter"
        />
      </div>

      {/* Content card: categories + grid */}
      <Card>
        {/* Category tabs */}
        <div className="overflow-x-auto">
          {isLoadingCategories ? (
            <div className="flex gap-[var(--p-space-050)] border border-[var(--p-color-border)] rounded-[var(--p-border-radius-200)] p-[var(--p-space-050)] w-fit">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[1.75rem] w-20 rounded-[var(--p-border-radius-150)] shrink-0" />
              ))}
            </div>
          ) : (
            <IconTabs
              tabs={categoryTabs}
              activeTab={selectedCategory}
              onTabChange={handleCategoryFilterChange}
              variant="segmented"
              data-testid="dishes-category-filter"
            />
          )}
        </div>

        {/* Dishes grid */}
        {isLoading ? (
          <div className="@container">
            <div className="grid grid-cols-2 @[42rem]:grid-cols-3 @[56rem]:grid-cols-4 @[70rem]:grid-cols-5 gap-[var(--p-space-400)]">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="w-full aspect-[4/3] rounded-[var(--p-border-radius-300)]" />
                  <div className="mt-[var(--p-space-200)] space-y-[var(--p-space-100)]">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3.5 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : dishes.length === 0 ? (
          <DishesEmptyState
            variant={getEmptyStateVariant()}
            searchQuery={searchQuery}
            onAction={handleEmptyStateAction}
          />
        ) : (
          <div className="@container">
            <div className="grid grid-cols-2 @[42rem]:grid-cols-3 @[56rem]:grid-cols-4 @[70rem]:grid-cols-5 gap-[var(--p-space-400)]">
              {dishes.map((dish, index) => (
                <PolarisDishCard
                  key={dish.id}
                  dish={dish}
                  actions={getRowActions(dish)}
                  imagePriority={index < 8}
                  isProcessing={processingDishId === dish.id}
                  onCardClick={(d) => router.push(`/dashboard/dishes/${d.id}/edit`)}
                  className="w-full"
                />
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Mutation loading */}
      {(updateDishMutation.isPending || deleteMutation.isPending) && (
        <div className="flex items-center gap-[var(--p-space-200)] text-[0.8125rem] text-[var(--p-color-text-secondary)]">
          <Spinner size="small" />
          <span>Processing...</span>
        </div>
      )}

      {/* Pagination */}
      {(totalPages > 0 || dishesData) && (
        <Card className="!py-[var(--p-space-300)] !px-[var(--p-space-400)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-[var(--p-space-300)]">
            <div className="flex items-center gap-[var(--p-space-300)] text-[0.8125rem] text-[var(--p-color-text-secondary)]">
              <div className="flex items-center gap-[var(--p-space-150)]">
                <span>Rows per page</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(v) => { if (!isLoading) handlePageSizeChange(Number(v)); }}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-7 w-[4.25rem] text-[0.8125rem]" data-testid="dishes-page-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[12, 24, 48, 96].map((size) => (
                      <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="hidden sm:inline">
                {totalItems > 0
                  ? `Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, totalItems)} of ${totalItems}`
                  : "No results"}
              </span>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages || 1}
              onPageChange={handlePageChange}
            />
          </div>
        </Card>
      )}

      {/* Modals */}
      <CreateDishModal open={createDishModalOpen} onOpenChange={setCreateDishModalOpen} />
      <CreateFlashSaleModal
        open={flashSaleModalOpen}
        onOpenChange={setFlashSaleModalOpen}
        dishes={dishes}
        onSubmit={handleCreateFlashSale}
        isLoading={false}
      />
      {getConfirmationProps() && <ConfirmationDialog {...getConfirmationProps()!} />}
    </div>
  );
}
