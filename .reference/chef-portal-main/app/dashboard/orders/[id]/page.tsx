"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useOrder, useOrderAction, useRescheduleOrder } from "@/hooks/use-orders";
import { useAuth } from "@/components/providers";
import {
  ChefOrderActions,
  OrderHeader,
  OrderItemsList,
  OrderNote,
  OrderSummary,
  OrderActivityTimeline,
  OrderCustomerDetails,
  PrintLabelButton,
  ShippingLabelButton,
  type ChefOrderAction,
} from "@/components/features/orders";
import { toast } from "@/components/ui/toast";
import { ClockIcon } from "@shopify/polaris-icons";
import {
  OrderStatusBadge,
  OrderFulfillmentBadge,
  Breadcrumb,
  Banner,
  Card,
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  Textarea,
  Label,
} from "@/components/polaris";
import { Skeleton } from "@/components/ui/skeleton";
import type { OrderStatus } from "@/types/orders.types";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { data: order, isLoading, isError, error } = useOrder(orderId);
  const orderActionMutation = useOrderAction();
  const rescheduleMutation = useRescheduleOrder();
  const { user } = useAuth();

  const [eta, setEta] = useState<{ minutes: number; seconds: number } | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (!order) {
      queueMicrotask(() => setEta(null));
      return;
    }

    let targetDateString: string | null = null;

    if (
      (order.status === "ready" || order.status === "readyForPickup") &&
      order.advertisedPickupEta
    ) {
      targetDateString = order.advertisedPickupEta;
    } else if (order.estimatedReadyTime) {
      targetDateString = order.estimatedReadyTime;
    }

    if (!targetDateString) {
      queueMicrotask(() => setEta(null));
      return;
    }

    const updateCountdown = () => {
      const targetDate = new Date(targetDateString!);
      const now = new Date();
      const diffMs = targetDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        setEta(null);
        return;
      }

      const minutes = Math.floor(diffMs / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);
      setEta({ minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [order]);

  const didChefProposeReschedule = (() => {
    if (!order || !user || order.status !== "rescheduling") return false;
    if (!order.statusHistory || order.statusHistory.length === 0) return false;

    const sortedHistory = [...order.statusHistory].sort(
      (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
    );
    const lastRescheduleChange = sortedHistory.find((h) => h.status === "rescheduling");
    if (!lastRescheduleChange || !lastRescheduleChange.changedBy) return false;
    return lastRescheduleChange.changedBy.email === user.email;
  })();

  // Loading state
  if (isLoading) {
    return (
      <div>
        {/* Breadcrumb bar skeleton */}
        <div className="px-[var(--p-space-500)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)] sm:rounded-t-[var(--p-border-radius-400)]">
          <div className="flex items-center gap-[var(--p-space-200)]">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-3" />
            <Skeleton className="h-3.5 w-14" />
            <Skeleton className="h-3.5 w-3" />
            <Skeleton className="h-3.5 w-24" />
          </div>
        </div>

        {/* Content card skeleton */}
        <Card className="!rounded-t-none space-y-[var(--p-space-500)]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[var(--p-space-300)]">
            <div className="space-y-[var(--p-space-200)]">
              <div className="flex items-center gap-[var(--p-space-200)]">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            </div>
            <div className="flex gap-[var(--p-space-200)]">
              <Skeleton className="h-[1.75rem] w-24 rounded-[var(--p-border-radius-200)]" />
              <Skeleton className="h-[1.75rem] w-20 rounded-[var(--p-border-radius-200)]" />
            </div>
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--p-space-500)]">
            {/* Left column */}
            <div className="lg:col-span-7 space-y-[var(--p-space-500)]">
              {/* Order Dates */}
              <div>
                <Skeleton className="h-3 w-24 mb-[var(--p-space-200)]" />
                <div className="rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-surface-secondary)] p-[var(--p-space-300)]">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-[var(--p-space-400)]">
                    <div className="space-y-[var(--p-space-100)]">
                      <Skeleton className="h-2.5 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="space-y-[var(--p-space-100)]">
                      <Skeleton className="h-2.5 w-20" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ordered Items */}
              <div>
                <div className="flex justify-between items-center mb-[var(--p-space-200)]">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
                <div className="rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)] p-[var(--p-space-100)]">
                  {[0, 1].map((i) => (
                    <div key={i} className={`flex items-center gap-[var(--p-space-300)] px-[var(--p-space-400)] py-[var(--p-space-300)] ${i === 0 ? "border-b border-[var(--p-color-border-secondary)]" : ""}`}>
                      <Skeleton className="size-12 rounded-[var(--p-border-radius-150)]" />
                      <Skeleton className="size-12 rounded-[var(--p-border-radius-200)]" />
                      <div className="flex-1 space-y-[var(--p-space-100)]">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer */}
              <div>
                <Skeleton className="h-3 w-16 mb-[var(--p-space-200)]" />
                <div className="rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)] px-[var(--p-space-400)] py-[var(--p-space-300)] flex items-center gap-[var(--p-space-300)]">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="space-y-[var(--p-space-100)]">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-5 space-y-[var(--p-space-500)]">
              {/* Order Activity */}
              <div>
                <Skeleton className="h-3 w-24 mb-[var(--p-space-200)]" />
                <div className="rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)] px-[var(--p-space-400)] py-[var(--p-space-400)] space-y-[var(--p-space-400)]">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-start gap-[var(--p-space-300)]">
                      <Skeleton className="size-3 rounded-full mt-1 shrink-0" />
                      <div className="space-y-[var(--p-space-100)] flex-1">
                        <Skeleton className="h-3.5 w-20" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <Skeleton className="h-3 w-28 mb-[var(--p-space-200)]" />
                <div className="rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)] px-[var(--p-space-400)] py-[var(--p-space-400)] space-y-[var(--p-space-300)]">
                  <div className="space-y-[var(--p-space-100)]">
                    <Skeleton className="h-2.5 w-20" />
                    <Skeleton className="h-7 w-28" />
                  </div>
                  <div className="space-y-[var(--p-space-100)]">
                    <Skeleton className="h-2.5 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-[var(--p-space-200)]">
                <Skeleton className="h-10 w-full rounded-[var(--p-border-radius-200)]" />
                <div className="grid grid-cols-2 gap-[var(--p-space-200)]">
                  <Skeleton className="h-10 w-full rounded-[var(--p-border-radius-200)]" />
                  <Skeleton className="h-10 w-full rounded-[var(--p-border-radius-200)]" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (isError || !order) {
    return (
      <div className="space-y-[var(--p-space-500)]">
        <Breadcrumb
          items={[
            { label: "Dashboard", onClick: () => router.push("/dashboard") },
            { label: "Orders", onClick: () => router.push("/dashboard/orders") },
            { label: "Order Details" },
          ]}
        />
        <Banner tone="critical" title="Error loading order">
          <p>
            {error instanceof Error
              ? error.message
              : "Failed to load order details. Please try again."}
          </p>
        </Banner>
      </div>
    );
  }

  // Handle chef action clicks
  const handleChefActionClick = async (action: ChefOrderAction) => {
    if (!order) return;

    try {
      const params: {
        proposedDateTime?: string;
        reason?: string;
        pickupInstructions?: string;
      } = {};

      if (action.proposedDateTime) {
        params.proposedDateTime = action.proposedDateTime;
      }

      if (action.requiresReason && action.reason) {
        params.reason = action.reason;
      } else if (action.action === "propose_reschedule" && action.reschedulingReason) {
        params.reason = action.reschedulingReason;
      } else if (action.requiresReason && !action.reason) {
        toast.error(`Please provide a reason to ${action.label.toLowerCase()}`);
        return;
      }

      if (action.action === "cancel" && !params.reason?.trim()) {
        toast.error("Please provide a reason to cancel the order");
        return;
      }

      if (action.action === "confirm" && action.pickupInstructions) {
        params.pickupInstructions = action.pickupInstructions.trim() || undefined;
      }

      const mutationResult = await orderActionMutation.mutateAsync({
        id: order.id,
        action: action.action as
          | "confirm"
          | "reject"
          | "propose_reschedule"
          | "accept_reschedule"
          | "reject_reschedule"
          | "start_preparing"
          | "mark_ready"
          | "send_for_delivery"
          | "mark_delivered"
          | "mark_picked_up"
          | "cancel",
        params: Object.keys(params).length > 0 ? params : undefined,
      });

      const actionMessages: Record<string, string> = {
        confirm: "Order confirmed successfully!",
        start_preparing: "Order preparation started!",
        mark_ready: "Order marked as ready!",
        send_for_delivery: "Order sent for delivery!",
        mark_delivered: "Order marked as delivered!",
        mark_picked_up: "Order marked as picked up!",
        propose_reschedule: "Rescheduling proposal sent successfully!",
        accept_reschedule: "New delivery time accepted successfully!",
        reject_reschedule: "Order cancelled and refund initiated!",
        reject: "Order rejected successfully!",
        cancel: "Order cancelled successfully!",
      };

      toast.success(
        actionMessages[action.action] || `Order ${action.action} completed successfully!`
      );

      if (action.variant === "destructive") {
        setTimeout(() => router.push("/dashboard/orders"), 1500);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to ${action.action.replace("_", " ")} order. Please try again.`;
      toast.error(errorMessage);
    }
  };

  const handleCancelOrderSubmit = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    const cancelAction: ChefOrderAction = {
      status: "cancelled",
      action: "cancel",
      label: "Cancel Order",
      variant: "destructive",
      requiresReason: true,
      reason: cancelReason.trim(),
    };

    setShowCancelModal(false);
    setCancelReason("");
    await handleChefActionClick(cancelAction);
  };

  const getBannerTime = () => {
    if ((order.status !== "ready" && order.status !== "readyForPickup") || !order.advertisedPickupEta) {
      return null;
    }
    const d = new Date(order.advertisedPickupEta);
    const isPickup = order.fulfillmentMethod === "chefPickup" || order.fulfillmentMethod === "yallaSpot";
    return {
      time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
      isPickup,
    };
  };

  return (
    <div>
      {/* Breadcrumb bar */}
      <div className="px-[var(--p-space-500)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)] sm:rounded-t-[var(--p-border-radius-400)]">
        <Breadcrumb
          items={[
            { label: "Dashboard", onClick: () => router.push("/dashboard") },
            { label: "Orders", onClick: () => router.push("/dashboard/orders") },
            { label: `#${order.orderNumber}` },
          ]}
        />
      </div>

      {/* Content */}
      <Card className="!rounded-t-none space-y-[var(--p-space-500)]">

      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[var(--p-space-300)]" data-testid="order-detail-header">
        <div>
          <div className="flex items-center gap-[var(--p-space-300)] flex-wrap" data-testid="order-detail-heading">
            <h1 className="text-[1.25rem] leading-[1.75rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)] font-[var(--p-font-family-mono)]" data-testid="order-number">
              Order #{order.orderNumber}
            </h1>
            <OrderFulfillmentBadge method={order.fulfillmentMethod} />
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
        <div className="flex items-center gap-[var(--p-space-200)]">
          <ShippingLabelButton order={order} />
          <PrintLabelButton order={order} variant="default" size="default" />
          {["confirmed", "preparing", "ready"].includes(order.status) && (
            <Button
              variant="destructive"
              onClick={() => setShowCancelModal(true)}
              disabled={orderActionMutation.isPending}
              data-testid="order-cancel-button"
            >
              Cancel
            </Button>
          )}
        </div>
      </header>

      {/* ETA Banner */}
      {(() => {
        const bannerTime = getBannerTime();
        if (!bannerTime) return null;

        return (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[var(--p-space-200)] bg-[rgba(255,230,0,1)] rounded-[var(--p-border-radius-200)] px-[var(--p-space-400)] py-[var(--p-space-300)]">
            <div className="flex items-center gap-[var(--p-space-200)]">
              <ClockIcon className="size-5 fill-[rgba(51,46,0,1)] shrink-0" />
              <p className="text-[0.875rem] font-[var(--p-font-weight-semibold)] text-[rgba(51,46,0,1)]">
                {bannerTime.isPickup ? "Pickup ETA: " : "Have it ready by "}
                <span className="font-[var(--p-font-weight-bold)]">{bannerTime.time}</span>
              </p>
            </div>
            {eta && (
              <span className="font-[var(--p-font-family-mono)] font-[var(--p-font-weight-bold)] text-[rgba(51,46,0,1)] text-[0.8125rem] bg-[rgba(51,46,0,0.08)] px-[var(--p-space-200)] py-[var(--p-space-050)] rounded-[var(--p-border-radius-200)]">
                {eta.minutes}:{String(eta.seconds).padStart(2, "0")}
              </span>
            )}
          </div>
        );
      })()}

      {/* Terminal status banner */}
      {(order.status === "delivered" || order.status === "pickedUp") && (
        <Banner tone="success" title={order.status === "delivered" ? "Order Delivered" : "Order Picked Up"}>
          <p>This order has been successfully completed.</p>
        </Banner>
      )}
      {(order.status === "cancelled" || order.status === "rejected") && (
        <Banner tone="critical" title={order.status === "cancelled" ? "Order Cancelled" : "Order Rejected"}>
          <p>{order.status === "cancelled" ? "This order was cancelled." : "This order was rejected."}</p>
        </Banner>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--p-space-500)]">
        {/* Left */}
        <div className="lg:col-span-7 space-y-[var(--p-space-500)]">
          <OrderHeader order={order} />
          <OrderItemsList items={order.items} />
          <OrderNote note={order.specialInstructions || ""} />
          <OrderCustomerDetails order={order} />
        </div>

        {/* Right */}
        <div className="lg:col-span-5 space-y-[var(--p-space-500)]">
          <OrderActivityTimeline order={order} />
          <OrderSummary order={order} />
          <ChefOrderActions
            currentStatus={order.status}
            onActionClick={handleChefActionClick}
            onReschedule={async (data) => {
              await rescheduleMutation.mutateAsync({
                id: order.id,
                proposedDateTime: data.proposedDateTime,
                reason: data.reason,
              });
              toast.success("Rescheduling proposal sent successfully! The customer will be notified.");
            }}
            isLoading={orderActionMutation.isPending || rescheduleMutation.isPending}
            loadingAction={
              rescheduleMutation.isPending
                ? "reschedule"
                : orderActionMutation.isPending
                ? "updating"
                : null
            }
            didChefProposeReschedule={didChefProposeReschedule}
            order={order}
          />
        </div>
      </div>

      </Card>{/* end content */}

      {/* Cancel Order Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent data-testid="cancel-order-modal">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this order. The customer will be notified.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-[var(--p-space-200)]">
              <Label htmlFor="cancel-reason">Reason *</Label>
              <Textarea
                id="cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter the reason for cancellation..."
                rows={4}
                required
                data-testid="cancel-reason-textarea"
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => { setShowCancelModal(false); setCancelReason(""); }}
              data-testid="cancel-modal-go-back"
            >
              Go Back
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrderSubmit}
              disabled={!cancelReason.trim() || orderActionMutation.isPending}
              data-testid="cancel-modal-submit"
            >
              {orderActionMutation.isPending ? "Cancelling..." : "Cancel Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
