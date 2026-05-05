"use client";

import { useState } from "react";
import { PackageFilledIcon, ExternalSmallIcon } from "@shopify/polaris-icons";
import { Button, Spinner } from "@/components/polaris";
import { toast } from "@/components/ui/toast";
import type { Order } from "@/types/orders.types";
import { ordersService } from "@/services/orders.service";
import { useQueryClient } from "@tanstack/react-query";

interface ShippingLabelButtonProps {
  order: Order;
}

export function ShippingLabelButton({ order }: ShippingLabelButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  if (order.fulfillmentMethod !== "shipping") return null;

  const hasLabel = !!order.shippingLabel?.labelUrl;

  const handleClick = async () => {
    if (hasLabel) {
      window.open(order.shippingLabel?.labelUrl, "_blank");
      return;
    }

    setIsLoading(true);
    try {
      const response = await ordersService.purchaseShippingLabel(order.id);
      if (response.data?.labelUrl) {
        window.open(response.data.labelUrl, "_blank");
        queryClient.invalidateQueries({ queryKey: ["order", order.id] });
        toast.success("Shipping label purchased successfully");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to purchase shipping label. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="secondary" onClick={handleClick} disabled={isLoading}>
      {isLoading ? (
        <Spinner size="small" />
      ) : hasLabel ? (
        <ExternalSmallIcon className="size-4 fill-current" />
      ) : (
        <PackageFilledIcon className="size-4 fill-current" />
      )}
      {isLoading ? "Generating..." : hasLabel ? "Shipping Label" : "Get Label"}
    </Button>
  );
}
