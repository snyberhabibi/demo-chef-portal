"use client";

import React, { useState, useEffect, useRef, startTransition } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogBody,
  Label,
  Textarea,
  Spinner,
  DateTimePicker,
} from "@/components/polaris";
import {
  CheckCircleIcon,
  XSmallIcon,
  PackageFilledIcon,
  DeliveryFilledIcon,
  CalendarIcon,
  ClockIcon,
} from "@shopify/polaris-icons";
import type { OrderStatus, Order } from "@/types/orders.types";
import { useAddress } from "@/hooks/use-addresses";

export interface ChefOrderAction {
  status: OrderStatus;
  action: string;
  label: string;
  variant: "default" | "destructive" | "outline" | "secondary";
  requiresReason?: boolean;
  requiresDateTime?: boolean;
  requiresPickupInstructions?: boolean;
  reason?: string;
  proposedDateTime?: string;
  reschedulingReason?: string;
  pickupInstructions?: string;
}

interface ChefOrderActionsProps {
  currentStatus: OrderStatus;
  onActionClick: (action: ChefOrderAction) => void;
  onReschedule?: (data: { proposedDateTime: string; reason?: string }) => Promise<void>;
  isLoading?: boolean;
  loadingAction?: string | null;
  didChefProposeReschedule?: boolean;
  order?: Order;
}

export function ChefOrderActions({
  currentStatus,
  onActionClick,
  onReschedule,
  isLoading = false,
  loadingAction = null,
  order,
}: ChefOrderActionsProps) {
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [rescheduleDateTime, setRescheduleDateTime] = useState<Date | undefined>(undefined);
  const [reschedulingReason, setReschedulingReason] = useState("");
  const [reason, setReason] = useState("");
  const [pickupInstructions, setPickupInstructions] = useState("");
  const [pendingAction, setPendingAction] = useState<ChefOrderAction | null>(null);
  const pendingActionRef = useRef<ChefOrderAction | null>(null);
  const [dateTimeError, setDateTimeError] = useState<string>("");

  const { data: address } = useAddress();
  const hasAutoFilledRef = useRef(false);

  useEffect(() => {
    if (
      showConfirmationDialog &&
      pendingAction?.requiresPickupInstructions &&
      pendingAction?.action === "confirm" &&
      address?.pickupInstructions &&
      !hasAutoFilledRef.current
    ) {
      const instructions = address.pickupInstructions || "";
      startTransition(() => setPickupInstructions(instructions));
      hasAutoFilledRef.current = true;
    }
    if (!showConfirmationDialog) hasAutoFilledRef.current = false;
  }, [showConfirmationDialog, pendingAction, address]);

  const isPickupOrder = order?.fulfillmentMethod === "chefPickup" || order?.fulfillmentMethod === "yallaSpot";

  const getAvailableActions = (status: OrderStatus): ChefOrderAction[] => {
    switch (status) {
      case "paid":
        return [
          { status: "confirmed", action: "confirm", label: "Confirm Order", variant: "default", requiresPickupInstructions: isPickupOrder },
          { status: "rescheduling", action: "reschedule", label: "Reschedule", variant: "outline", requiresDateTime: true },
          { status: "rejected", action: "reject", label: "Reject", variant: "destructive", requiresReason: true },
        ];
      case "confirmed":
        return [
          { status: "preparing", action: "start_preparing", label: "Start Preparing", variant: "default" },
          { status: "rescheduling", action: "reschedule", label: "Reschedule", variant: "outline", requiresDateTime: true },
          { status: "cancelled", action: "cancel", label: "Cancel", variant: "destructive", requiresReason: true },
        ];
      case "preparing":
        return [
          { status: "ready", action: "mark_ready", label: isPickupOrder ? "Ready for Pickup" : "Mark Ready", variant: "default" },
          { status: "cancelled", action: "cancel", label: "Cancel", variant: "destructive", requiresReason: true },
        ];
      case "readyForPickup":
        if (order?.fulfillmentMethod === "chefPickup") {
          return [{ status: "pickedUp", action: "mark_picked_up", label: "Mark Picked Up", variant: "default" }];
        }
        return [];
      case "rescheduling":
        return [];
      default:
        return [];
    }
  };

  const getMinDateTime = (): Date => {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    if (order?.deliveryDate) {
      const deliveryDate = new Date(order.deliveryDate);
      return deliveryDate > oneHourFromNow ? deliveryDate : oneHourFromNow;
    }
    return oneHourFromNow;
  };

  const minDateTime = getMinDateTime();

  const getConfirmationContent = (action: ChefOrderAction) => {
    const messages: Record<string, { title: string; description: string }> = {
      confirm: {
        title: "Confirm Order",
        description: isPickupOrder
          ? "Confirm this pickup order? The customer will be notified."
          : "Confirm this order? The customer will be notified.",
      },
      start_preparing: { title: "Start Preparing", description: "Start preparing this order?" },
      mark_ready: {
        title: isPickupOrder ? "Ready for Pickup" : "Mark Ready",
        description: isPickupOrder
          ? "Mark this order as ready? The customer will be notified for pickup."
          : "Mark this order as ready?",
      },
      mark_picked_up: { title: "Mark Picked Up", description: "Confirm the customer has collected their order?" },
      reject: { title: "Reject Order", description: "Reject this order? This cannot be undone." },
      cancel: { title: "Cancel Order", description: "Cancel this order? This cannot be undone." },
    };
    return messages[action.action] || { title: "Confirm", description: `Are you sure you want to ${action.label.toLowerCase()}?` };
  };

  const handleActionClick = (action: ChefOrderAction) => {
    if (action.action === "reschedule") {
      const now = new Date();
      const defaultDate = new Date(minDateTime);
      if (defaultDate <= now) {
        defaultDate.setDate(now.getDate() + 1);
        defaultDate.setHours(12, 0, 0, 0);
      }
      setRescheduleDateTime(defaultDate);
      setReschedulingReason("");
      setDateTimeError("");
      setShowRescheduleModal(true);
      return;
    }

    if (action.requiresPickupInstructions) {
      if (address?.pickupInstructions) {
        setPickupInstructions(address.pickupInstructions || "");
        hasAutoFilledRef.current = true;
      } else {
        setPickupInstructions("");
        hasAutoFilledRef.current = false;
      }
    }
    setPendingAction(action);
    pendingActionRef.current = action;
    setShowConfirmationDialog(true);
  };

  const handleConfirmationConfirm = () => {
    if (!pendingAction) return;
    const currentAction = pendingAction;

    if (pendingAction.requiresPickupInstructions && pickupInstructions.length > 280) return;

    setShowConfirmationDialog(false);

    if (currentAction.requiresReason) {
      if (!pendingActionRef.current) pendingActionRef.current = currentAction;
      setReason("");
      requestAnimationFrame(() => setShowReasonModal(true));
      return;
    }

    requestAnimationFrame(() => {
      const actionToSubmit = currentAction.requiresPickupInstructions
        ? { ...currentAction, pickupInstructions: pickupInstructions.trim() || undefined }
        : currentAction;
      onActionClick(actionToSubmit);
      setPendingAction(null);
      pendingActionRef.current = null;
      if (currentAction.requiresPickupInstructions) setPickupInstructions("");
    });
  };

  const handleConfirmationCancel = () => {
    setShowConfirmationDialog(false);
    setPendingAction(null);
    pendingActionRef.current = null;
    setPickupInstructions("");
  };

  const handleConfirmationDialogClose = (open: boolean) => {
    if (!open) {
      const action = pendingAction || pendingActionRef.current;
      if (action?.requiresReason) return;
      handleConfirmationCancel();
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!onReschedule || !order) return;
    if (!rescheduleDateTime) { setDateTimeError("Please select a date and time"); return; }
    if (rescheduleDateTime <= minDateTime) {
      const min = minDateTime;
      const d = min.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      let h = min.getHours(); const m = min.getMinutes().toString().padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM"; h = h % 12 || 12;
      setDateTimeError(`Must be after ${d} at ${h}:${m} ${ampm}`);
      return;
    }

    try {
      await onReschedule({ proposedDateTime: rescheduleDateTime.toISOString(), reason: reschedulingReason || undefined });
      setShowRescheduleModal(false);
      setRescheduleDateTime(undefined);
      setReschedulingReason("");
      setDateTimeError("");
    } catch (error) {
      setDateTimeError(error instanceof Error ? error.message : "Invalid date format.");
    }
  };

  const handleRescheduleCancel = () => {
    setShowRescheduleModal(false);
    setRescheduleDateTime(undefined);
    setReschedulingReason("");
    setDateTimeError("");
  };

  const handleReasonSubmit = () => {
    const trimmedReason = reason.trim();
    if (!trimmedReason) return;

    const action = pendingAction || pendingActionRef.current;
    if (!action?.action) return;

    const actionToSubmit: ChefOrderAction = { ...action, reason: trimmedReason };

    setShowReasonModal(false);
    setPendingAction(null);
    pendingActionRef.current = null;
    setReason("");

    try {
      onActionClick(actionToSubmit);
    } catch {
      setShowReasonModal(true);
      setPendingAction(action);
      pendingActionRef.current = action;
      setReason(trimmedReason);
    }
  };

  const handleReasonCancel = () => {
    setShowReasonModal(false);
    setPendingAction(null);
    pendingActionRef.current = null;
    setReason("");
  };

  const getActionVariant = (action: ChefOrderAction): "default" | "secondary" | "destructive" | "success" | "tertiary" => {
    if (action.variant === "destructive") return "destructive";
    if (action.action === "confirm") return "success";
    if (action.variant === "outline") return "secondary";
    return "default";
  };

  const getActionIcon = (action: string): React.ComponentType<React.SVGProps<SVGSVGElement>> | null => {
    switch (action) {
      case "confirm": return CheckCircleIcon;
      case "reject": case "cancel": return XSmallIcon;
      case "start_preparing": return ClockIcon;
      case "mark_ready": return PackageFilledIcon;
      case "send_for_delivery": case "mark_delivered": return DeliveryFilledIcon;
      case "mark_picked_up": return PackageFilledIcon;
      case "reschedule": return CalendarIcon;
      default: return null;
    }
  };

  const availableActions = getAvailableActions(currentStatus);
  if (availableActions.length === 0) return <span data-testid="chef-order-actions-empty" />;

  const confirmationContent = pendingAction ? getConfirmationContent(pendingAction) : { title: "", description: "" };
  const primaryAction = availableActions.find((a) => a.variant === "default") || null;
  const destructiveAction = availableActions.find((a) => a.variant === "destructive") || null;
  const escapeAction = availableActions.find((a) => a.variant === "outline") || null;

  return (
    <>
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmationDialog} onOpenChange={handleConfirmationDialogClose}>
        <DialogContent data-testid="confirmation-dialog">
          <DialogHeader>
            <DialogTitle>{confirmationContent.title}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mb-[var(--p-space-400)]">{confirmationContent.description}</p>
          {pendingAction?.requiresPickupInstructions && (
            <div>
              <div className="space-y-[var(--p-space-200)]">
                <Label htmlFor="pickup-instructions">Pickup Instructions (Optional)</Label>
                <div className="relative">
                  <Textarea
                    id="pickup-instructions"
                    value={pickupInstructions}
                    onChange={(e) => setPickupInstructions(e.target.value)}
                    placeholder="Enter pickup instructions for the customer..."
                    rows={5}
                    maxLength={280}
                    data-testid="pickup-instructions-textarea"
                  />
                  <span className="absolute bottom-2 right-2 text-[0.6875rem] text-[var(--p-color-text-secondary)]">
                    {pickupInstructions.length}/280
                  </span>
                </div>
                <p className="text-[0.75rem] text-[var(--p-color-text-secondary)]">
                  Set default pickup instructions in Address Management to auto-fill for all orders.
                </p>
              </div>
            </div>
          )}
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={handleConfirmationCancel} data-testid="confirmation-cancel">
              Cancel
            </Button>
            <Button
              variant={pendingAction?.variant === "destructive" ? "destructive" : pendingAction?.action === "confirm" ? "success" : "default"}
              onClick={handleConfirmationConfirm}
              disabled={pendingAction?.requiresPickupInstructions && pickupInstructions.length > 280}
              data-testid="confirmation-confirm"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action buttons — single primary CTA, secondary options as text links */}
      <div data-testid="chef-order-actions">
          {/* Primary action — full width, the ONE thing to do */}
          {primaryAction && (() => {
            const Icon = getActionIcon(primaryAction.action);
            const isPrimaryLoading = isLoading && loadingAction === primaryAction.action;
            return (
              <Button
                variant={getActionVariant(primaryAction)}
                size="lg"
                fullWidth
                onClick={() => handleActionClick(primaryAction)}
                disabled={isLoading}
                data-testid={`order-action-${primaryAction.action}`}
              >
                {isPrimaryLoading ? (
                  <><Spinner size="small" /> Processing...</>
                ) : (
                  <>
                    {Icon && <Icon className="size-5 fill-current" />}
                    {primaryAction.label}
                  </>
                )}
              </Button>
            );
          })()}

          {/* Secondary options — text links, centered below */}
          {(escapeAction || destructiveAction) && (
            <div className="flex items-center justify-center gap-[var(--p-space-400)] mt-[var(--p-space-300)]">
              {escapeAction && (() => {
                const Icon = getActionIcon(escapeAction.action);
                const isEscapeLoading = isLoading && loadingAction === escapeAction.action;
                return (
                  <button
                    type="button"
                    onClick={() => handleActionClick(escapeAction)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-[var(--p-space-100)] text-[0.8125rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text-secondary)] hover:text-[var(--p-color-text)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    data-testid={`order-action-${escapeAction.action}`}
                  >
                    {isEscapeLoading ? "Processing..." : (
                      <>{Icon && <Icon className="size-4 fill-current" />}{escapeAction.label}</>
                    )}
                  </button>
                );
              })()}
              {destructiveAction && (() => {
                const Icon = getActionIcon(destructiveAction.action);
                const isDestructiveLoading = isLoading && loadingAction === destructiveAction.action;
                return (
                  <button
                    type="button"
                    onClick={() => handleActionClick(destructiveAction)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-[var(--p-space-100)] text-[0.8125rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text-critical)] hover:text-[var(--p-color-text-critical-hover)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    data-testid={`order-action-${destructiveAction.action}`}
                  >
                    {isDestructiveLoading ? "Processing..." : (
                      <>{Icon && <Icon className="size-4 fill-current" />}{destructiveAction.label}</>
                    )}
                  </button>
                );
              })()}
            </div>
          )}
      </div>

      {/* Reason Modal */}
      <Dialog open={showReasonModal} onOpenChange={(open) => { if (!open) handleReasonCancel(); }}>
        <DialogContent data-testid="reason-modal">
          <DialogHeader>
            <DialogTitle>
              {pendingAction?.action === "reject" ? "Reject Order" : "Cancel Order"}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mb-[var(--p-space-400)]">
              Please provide a reason for {pendingAction?.action === "reject" ? "rejecting" : "cancelling"} this order.
            </p>
            <div className="space-y-[var(--p-space-200)]">
              <Label htmlFor="reason-text">Reason *</Label>
              <Textarea
                id="reason-text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter the reason..."
                rows={4}
                required
                data-testid="reason-textarea"
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={handleReasonCancel} data-testid="reason-modal-cancel">
              Cancel
            </Button>
            <Button
              onClick={(e) => { e.preventDefault(); handleReasonSubmit(); }}
              disabled={!reason.trim() || isLoading}
              data-testid="reason-modal-submit"
            >
              {isLoading ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Modal */}
      <Dialog open={showRescheduleModal} onOpenChange={(open) => { if (!open) handleRescheduleCancel(); }}>
        <DialogContent
          data-testid="reschedule-modal"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Reschedule Order</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mb-[var(--p-space-400)]">
              Select a new date and time. The customer will be notified.
            </p>
            <div className="space-y-[var(--p-space-400)]">
              <DateTimePicker
                label="New Delivery Date & Time *"
                value={rescheduleDateTime}
                onChange={(date) => { setRescheduleDateTime(date); setDateTimeError(""); }}
                error={!!dateTimeError}
              />
              {dateTimeError && (
                <p className="text-[0.8125rem] text-[var(--p-color-text-critical)]">{dateTimeError}</p>
              )}
              <div className="space-y-[var(--p-space-200)]">
                <Label htmlFor="reschedule-reason">Reason (Optional)</Label>
                <Textarea
                  id="reschedule-reason"
                  value={reschedulingReason}
                  onChange={(e) => setReschedulingReason(e.target.value)}
                  placeholder="Explain why you need to reschedule..."
                  rows={3}
                  data-testid="reschedule-reason-textarea"
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={handleRescheduleCancel} data-testid="reschedule-modal-cancel">
              Cancel
            </Button>
            <Button
              onClick={(e) => { e.preventDefault(); handleRescheduleSubmit(); }}
              disabled={!rescheduleDateTime || isLoading || !!dateTimeError}
              data-testid="reschedule-modal-submit"
            >
              {isLoading && loadingAction === "reschedule" ? "Rescheduling..." : "Reschedule Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
