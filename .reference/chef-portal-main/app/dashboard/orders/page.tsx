"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useOrders } from "@/hooks/use-orders";
import { OrderIcon } from "@shopify/polaris-icons";
import {
  OrderCard,
  Banner,
  Card,
  EmptyState,
  Breadcrumb,
  SearchBar,
  Divider,
  FilterPills,
  Pagination,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/polaris";
import type { FilterPill } from "@/components/polaris";
import { OrderCardSkeleton } from "@/components/polaris";
import type { OrderStatus } from "@/types/orders.types";

const statusTabs: { id: string; label: string; status?: OrderStatus }[] = [
  { id: "all", label: "All" },
  { id: "confirmed", label: "Confirmed", status: "confirmed" },
  { id: "paid", label: "Paid", status: "paid" },
  { id: "preparing", label: "Preparing", status: "preparing" },
  { id: "ready", label: "Ready", status: "ready" },
  { id: "readyForPickup", label: "Pickup Ready", status: "readyForPickup" },
  { id: "outForDelivery", label: "Out for Delivery", status: "outForDelivery" },
  { id: "delivered", label: "Delivered", status: "delivered" },
  { id: "pickedUp", label: "Picked Up", status: "pickedUp" },
  { id: "rescheduling", label: "Rescheduling", status: "rescheduling" },
  { id: "cancelled", label: "Cancelled", status: "cancelled" },
  { id: "rejected", label: "Rejected", status: "rejected" },
];

export default function OrdersPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      if (searchQuery !== debouncedSearchQuery) {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery]);

  const activeStatus = statusTabs.find((t) => t.id === statusFilter)?.status;

  // Main data query
  const {
    data: ordersData,
    isLoading,
    isError,
    error,
  } = useOrders({
    page: currentPage,
    pageSize,
    status: activeStatus,
    search: debouncedSearchQuery || undefined,
  });

  // Build pills — show all status tabs without counts (no extra API calls)
  const pills: FilterPill[] = useMemo(() =>
    statusTabs.map((tab) => ({
      id: tab.id,
      label: tab.label,
      })),
    []
  );

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };
  const handleSearchChange = (value: string) => setSearchQuery(value);
  const handleStatusFilterChange = (value: string | string[]) => {
    const id = Array.isArray(value) ? value[0] : value;
    setStatusFilter(id);
    setCurrentPage(1);
  };

  const renderSkeletonCards = () =>
    Array.from({ length: pageSize }).map((_, index) => (
      <OrderCardSkeleton key={index} />
    ));

  // Error state
  if (isError) {
    return (
      <div className="space-y-[var(--p-space-400)]">
        <Breadcrumb
          items={[
            { label: "Dashboard", onClick: () => router.push("/dashboard") },
            { label: "Orders" },
          ]}
        />
        <h2 className="text-[var(--p-font-size-600)] leading-[var(--p-font-line-height-700)] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]" data-testid="orders-heading">
          Orders
        </h2>
        <Banner tone="critical" title="Error loading orders">
          <p>
            {error instanceof Error
              ? error.message
              : "Failed to load orders. Please try again."}
          </p>
        </Banner>
      </div>
    );
  }

  const orders = ordersData?.data || [];
  const totalItems = ordersData?.total || 0;
  const totalPages = ordersData?.totalPages || 0;

  return (
    <div>
      {/* Breadcrumb bar */}
      <div className="px-[var(--p-space-500)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)] sm:rounded-t-[var(--p-border-radius-400)]">
        <Breadcrumb
          items={[
            { label: "Dashboard", onClick: () => router.push("/dashboard") },
            { label: "Orders" },
          ]}
        />
      </div>

      {/* Content card */}
      <Card className="!rounded-t-none space-y-[var(--p-space-500)]">

      {/* Page header */}
      <div>
        <h2 className="text-[1.875rem] leading-[2.25rem] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-denser)] text-[var(--p-color-text)]" data-testid="orders-heading">
          Orders
        </h2>
        <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
          Manage and track your orders
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="overflow-x-auto">
        <FilterPills
          data-testid="orders-status-filter"
          pills={pills}
          selected={statusFilter}
          onSelect={handleStatusFilterChange}
        />
      </div>

      {/* Search bar */}
      <div className="max-w-md">
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by order ID, customer, or dish..."
          data-testid="orders-search-input"
        />
      </div>

      {/* Order cards */}
      {isLoading ? (
        <div className="flex flex-col gap-[var(--p-space-500)]">{renderSkeletonCards()}</div>
      ) : orders.length === 0 ? (
        <Card>
          <EmptyState
            heading="No orders found"
            description={
              searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Orders will appear here once customers place them"
            }
            icon={OrderIcon}
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-[var(--p-space-500)]">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={(o) => router.push(`/dashboard/orders/${o.id}`)}
              data-testid="order-card"
            />
          ))}
        </div>
      )}

      {/* Pagination footer */}
      <div className="border-t border-[var(--p-color-border-secondary)] pt-[var(--p-space-300)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-[var(--p-space-300)]">
          <div className="flex items-center gap-[var(--p-space-300)] text-[0.8125rem] text-[var(--p-color-text-secondary)]">
            <div className="flex items-center gap-[var(--p-space-150)]">
              <span>Rows per page</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => { if (!isLoading) handlePageSizeChange(Number(value)); }}
                disabled={isLoading}
              >
                <SelectTrigger className="h-7 w-[4.25rem] text-[0.8125rem]">
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
            <span className="sm:hidden">
              {totalItems > 0
                ? `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, totalItems)} of ${totalItems}`
                : "No results"}
            </span>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages || 1}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      </Card>{/* end content card */}
    </div>
  );
}
