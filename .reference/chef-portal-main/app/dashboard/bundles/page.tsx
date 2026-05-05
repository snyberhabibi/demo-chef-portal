"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useBundles, useUpdateBundle, useDeleteBundle } from "@/hooks/use-bundles";
import { BundlesEmptyState } from "@/components/features/bundles/bundles-empty-state";
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
import type { Bundle } from "@/types/bundles.types";
import type { DataTableAction } from "@/components/shared/data-table";
import type { FilterPill } from "@/components/polaris";
import {
  Breadcrumb,
  Banner,
  Button,
  SearchBar,
  Pagination,
  Card,
  Spinner,
  FilterPills,
  PolarisBundleCard,
  SkeletonCard,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/polaris";

const statusPills: FilterPill[] = [
  { id: "all", label: "All" },
  { id: "published", label: "Published" },
  { id: "draft", label: "Draft" },
  { id: "archived", label: "Archived" },
];

export default function BundlesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL search params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "all");
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

  const hasClientFilters = !!debouncedSearchQuery;
  const {
    data: rawBundlesData,
    isLoading,
    isError,
    error,
  } = useBundles({
    page: hasClientFilters ? 1 : currentPage,
    limit: hasClientFilters ? 100 : pageSize,
    status: activeStatus,
  });

  // Client-side search filtering
  const bundlesData = useMemo(() => {
    if (!rawBundlesData) return rawBundlesData;
    if (!debouncedSearchQuery) return rawBundlesData;

    const q = debouncedSearchQuery.toLowerCase();
    const filtered = rawBundlesData.data.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.description && b.description.toLowerCase().includes(q))
    );

    const start = (currentPage - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);
    return {
      ...rawBundlesData,
      data: paged,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize),
      page: currentPage,
    };
  }, [rawBundlesData, debouncedSearchQuery, currentPage, pageSize]);

  const updateBundleMutation = useUpdateBundle();
  const deleteMutation = useDeleteBundle();
  const { setLoading } = useLoading();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "publish" | "unpublish" | "archive" | "restore";
    bundle: Bundle;
  } | null>(null);
  const [processingBundleId, setProcessingBundleId] = useState<string | null>(null);

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

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    const { type, bundle } = confirmAction;

    if (type === "publish" || type === "restore") {
      const hasImages =
        (bundle.images && bundle.images.length > 0) ||
        (bundle.image && bundle.image.trim().length > 0);

      if (!hasImages) {
        toast.error(
          `Cannot publish "${bundle.name}". Please add at least one image before publishing.`
        );
        setConfirmDialogOpen(false);
        setConfirmAction(null);
        return;
      }
    }

    try {
      setProcessingBundleId(bundle.id);
      setLoading(true);

      switch (type) {
        case "delete":
          await deleteMutation.mutateAsync(bundle.id);
          toast.success(`"${bundle.name}" has been deleted`);
          break;
        case "publish":
          await updateBundleMutation.mutateAsync({ id: bundle.id, data: { status: "published" } });
          toast.success(`"${bundle.name}" has been published`);
          break;
        case "unpublish":
          await updateBundleMutation.mutateAsync({ id: bundle.id, data: { status: "draft" } });
          toast.success(`"${bundle.name}" has been unpublished`);
          break;
        case "archive":
          await updateBundleMutation.mutateAsync({ id: bundle.id, data: { status: "archived" } });
          toast.success(`"${bundle.name}" has been archived`);
          break;
        case "restore":
          await updateBundleMutation.mutateAsync({ id: bundle.id, data: { status: "published" } });
          toast.success(`"${bundle.name}" has been restored`);
          break;
      }
      setConfirmDialogOpen(false);
      setConfirmAction(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to ${type} bundle.`);
    } finally {
      setProcessingBundleId(null);
      setLoading(false);
    }
  };

  const getRowActions = (bundle: Bundle): DataTableAction<Bundle>[] => [
    {
      label: "Edit",
      icon: EditIcon,
      onClick: () => router.push(`/dashboard/bundles/${bundle.id}/edit`),
    },
    {
      label: bundle.status === "published" ? "Unpublish" : bundle.status === "archived" ? "Restore" : "Publish",
      icon: bundle.status === "published" ? HideIcon : ViewIcon,
      onClick: () => {
        const type = bundle.status === "published" ? "unpublish" : bundle.status === "archived" ? "restore" : "publish";
        if ((type === "publish" || type === "restore") && !(bundle.images?.length || bundle.image?.trim())) {
          toast.error(`Cannot publish "${bundle.name}". Please add at least one image before publishing.`);
          return;
        }
        setConfirmAction({ type, bundle });
        setConfirmDialogOpen(true);
      },
      disabled: () => updateBundleMutation.isPending || deleteMutation.isPending,
    },
    ...(bundle.status !== "archived" ? [{
      label: "Archive",
      icon: ArchiveIcon,
      onClick: () => { setConfirmAction({ type: "archive", bundle }); setConfirmDialogOpen(true); },
      disabled: () => updateBundleMutation.isPending || deleteMutation.isPending,
    } as DataTableAction<Bundle>] : []),
    {
      label: "Delete",
      icon: DeleteIcon,
      variant: "destructive" as const,
      onClick: () => { setConfirmAction({ type: "delete", bundle }); setConfirmDialogOpen(true); },
      disabled: () => deleteMutation.isPending || updateBundleMutation.isPending,
    },
  ];

  // Error state
  if (isError) {
    return (
      <div className="space-y-[var(--p-space-400)]">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Bundles" },
        ]} />
        <h2 className="text-[1.875rem] leading-[2.25rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]" data-testid="bundles-heading">Bundles</h2>
        <Banner tone="critical" title="Error loading bundles">
          <p>{error instanceof Error ? error.message : "Failed to load bundles. Please try again."}</p>
        </Banner>
      </div>
    );
  }

  const bundles = bundlesData?.data || [];
  const totalItems = bundlesData?.total || 0;
  const totalPages = bundlesData?.totalPages || 0;
  const hasAnyBundles = totalItems > 0;

  const getEmptyStateVariant = (): "no-bundles" | "no-results" | "no-draft" | "no-published" | "no-archived" | "no-search-results" => {
    if (!hasAnyBundles) return "no-bundles";
    if (debouncedSearchQuery) return "no-search-results";
    if (statusFilter === "draft") return "no-draft";
    if (statusFilter === "published") return "no-published";
    if (statusFilter === "archived") return "no-archived";
    return "no-results";
  };

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const handleEmptyStateAction = () => {
    if (!hasAnyBundles) router.push("/dashboard/bundles/new");
    else if (debouncedSearchQuery) handleSearchChange("");
    else handleClearAllFilters();
  };

  const visibilityWarning = "Changing this bundle's status will affect its visibility to customers.";

  const getConfirmationProps = () => {
    if (!confirmAction) return null;
    const { type, bundle } = confirmAction;
    const base = {
      open: confirmDialogOpen,
      onOpenChange: (open: boolean) => { setConfirmDialogOpen(open); if (!open) setConfirmAction(null); },
      onConfirm: handleConfirmAction,
      isLoading: updateBundleMutation.isPending || deleteMutation.isPending,
    };
    const messages: Record<string, { title: string; description: string; variant?: "destructive" | "default" }> = {
      delete: { title: "Delete Bundle", description: `Delete "${bundle.name}"? This cannot be undone.`, variant: "destructive" },
      archive: { title: "Archive Bundle", description: `Archive "${bundle.name}"? It will be hidden but can be restored.` },
      restore: { title: "Restore Bundle", description: `Restore "${bundle.name}"? It will be published and visible.` },
      publish: { title: "Publish Bundle", description: `Publish "${bundle.name}"? It will be visible to customers.` },
      unpublish: { title: "Unpublish Bundle", description: `Unpublish "${bundle.name}"? It will be moved to draft.` },
    };
    const m = messages[type];
    return { ...base, type: type as "delete", title: m.title, description: m.description, variant: m.variant || ("default" as const), warning: visibilityWarning };
  };

  return (
    <div className="space-y-[var(--p-space-500)]">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        { label: "Bundles" },
      ]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[1.875rem] leading-[2.25rem] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-denser)] text-[var(--p-color-text)]" data-testid="bundles-heading">
            Bundles
          </h2>
          <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
            Manage your bundle packages
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/bundles/new")} data-testid="bundles-create-button">
          <PlusIcon className="size-4 fill-current" />
          Create Bundle
        </Button>
      </div>

      {/* Search + status pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[var(--p-space-300)]">
        <div className="w-full sm:max-w-sm">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search bundles..."
            data-testid="bundles-search-input"
          />
        </div>
        <FilterPills
          pills={statusPills}
          selected={statusFilter}
          onSelect={handleStatusFilterChange}
          data-testid="bundles-status-filter"
        />
      </div>

      {/* Content card: grid */}
      <Card>
        {isLoading ? (
          <div className="@container">
            <div className="grid grid-cols-2 @[42rem]:grid-cols-3 @[56rem]:grid-cols-4 gap-[var(--p-space-400)]">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : bundles.length === 0 ? (
          <BundlesEmptyState
            variant={getEmptyStateVariant()}
            searchQuery={searchQuery}
            onAction={handleEmptyStateAction}
          />
        ) : (
          <div className="@container">
            <div className="grid grid-cols-2 @[42rem]:grid-cols-3 @[56rem]:grid-cols-4 gap-[var(--p-space-400)]">
              {bundles.map((bundle, index) => (
                <PolarisBundleCard
                  key={bundle.id}
                  bundle={bundle}
                  actions={getRowActions(bundle)}
                  priority={index < 8}
                  isProcessing={processingBundleId === bundle.id}
                  onCardClick={(b) => router.push(`/dashboard/bundles/${b.id}/edit`)}
                  className="w-full"
                />
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Mutation loading */}
      {(updateBundleMutation.isPending || deleteMutation.isPending) && (
        <div className="flex items-center gap-[var(--p-space-200)] text-[0.8125rem] text-[var(--p-color-text-secondary)]">
          <Spinner size="small" />
          <span>Processing...</span>
        </div>
      )}

      {/* Pagination */}
      {(totalPages > 0 || bundlesData) && (
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
                  <SelectTrigger className="h-7 w-[4.25rem] text-[0.8125rem]" data-testid="bundles-page-size">
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

      {/* Confirmation dialog */}
      {getConfirmationProps() && <ConfirmationDialog {...getConfirmationProps()!} />}
    </div>
  );
}
