"use client";

import { useAuth } from "@/components/providers";
import { useOrders } from "@/hooks/use-orders";
import { useDishes } from "@/hooks/use-dishes";
import { Button, StatsCard, Divider, Banner, Card, EmptyState, OrderCard } from "@/components/polaris";
import { SkeletonText, SkeletonCard, OrderCardSkeleton } from "@/components/polaris";
import { OrderFilledIcon, CashDollarFilledIcon, ProductFilledIcon, OrderIcon } from "@shopify/polaris-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Fetch recent orders (first page, 5 items)
  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useOrders({
    page: 1,
    pageSize: 5,
  });

  // Fetch delivered orders to calculate revenue (chef payout from completed orders)
  const {
    data: deliveredOrdersData,
    isLoading: deliveredOrdersLoading,
  } = useOrders({
    page: 1,
    limit: 1000,
    status: "delivered",
  });

  // Fetch published dishes to get active dishes count
  const {
    data: dishesData,
    isLoading: dishesLoading,
  } = useDishes({
    page: 1,
    limit: 1,
    status: "published",
  });



  const recentOrders = ordersData?.data || [];
  const totalOrders = ordersData?.total || 0;
  const activeDishesCount = dishesData?.total || 0;

  const totalPayouts = deliveredOrdersLoading
    ? "..."
    : `$${(deliveredOrdersData?.data?.reduce((sum, order) => sum + (order.pricing?.chefPayout ?? 0), 0) || 0).toFixed(2)}`;

  return (
    <div className="space-y-[var(--p-space-500)]">
      <div>
        <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">Welcome back,</p>
        <h1 data-testid="dashboard-heading" className="text-[1.875rem] leading-[2.5rem] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-denser)] text-[var(--p-color-text)]">
          {user?.name || "Chef"} 👋
        </h1>
        <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
          Ready to manage your orders and delight your customers today?
        </p>
      </div>

      <div className="grid gap-[var(--p-space-400)] md:grid-cols-2 lg:grid-cols-3" data-testid="dashboard-metrics">
        <StatsCard
          label="Total Orders"
          value={ordersLoading ? "..." : String(totalOrders)}
          icon={OrderFilledIcon}
          helpText={ordersLoading ? "Loading..." : "All time orders"}
          animate={!ordersLoading}
        />
        <StatsCard
          label="Active Dishes"
          value={dishesLoading ? "..." : String(activeDishesCount)}
          icon={ProductFilledIcon}
          helpText={dishesLoading ? "Loading..." : "Published dishes"}
          animate={!dishesLoading}
        />
        <StatsCard
          label="Your Total Payouts"
          value={deliveredOrdersLoading ? "..." : totalPayouts}
          icon={CashDollarFilledIcon}
          helpText={deliveredOrdersLoading ? "Loading..." : "From completed orders"}
          animate={!deliveredOrdersLoading}
        />
      </div>

      <Divider />

      {/* Recent Orders */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[var(--p-font-size-500)] leading-[var(--p-font-line-height-600)] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]" data-testid="dashboard-recent-orders-heading">
              Recent Orders
            </h3>
            <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
              Latest orders from your customers
            </p>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/dashboard/orders" data-testid="dashboard-view-all-orders">View All</Link>
          </Button>
        </div>

        {ordersError ? (
          <Banner tone="critical" title="Error loading orders">
            <p>Failed to load recent orders. Please try again later.</p>
          </Banner>
        ) : ordersLoading ? (
          <div className="space-y-[var(--p-space-300)]">
            {Array.from({ length: 3 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <EmptyState
            heading="No orders yet"
            description="When customers place orders, they'll appear here."
            icon={OrderIcon}
          />
        ) : (
          <div className="space-y-[var(--p-space-300)]">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} onClick={(o) => router.push(`/dashboard/orders/${o.id}`)} />
            ))}
          </div>
        )}

        {!ordersLoading && totalOrders > 5 && (
          <div className="text-center">
            <Button variant="plain" asChild>
              <Link href="/dashboard/orders">
                View all {totalOrders} orders →
              </Link>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
