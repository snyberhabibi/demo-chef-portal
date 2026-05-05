"use client";

import { useState } from "react";
import { PrintIcon } from "@shopify/polaris-icons";
import { Button, Spinner } from "@/components/polaris";
import { toast } from "@/components/ui/toast";
import type { Order } from "@/types/orders.types";
import {
  generateOrderLabelHTML,
  orderToLabelData,
} from "@/lib/order-label-generator";
import { dishesService } from "@/services/dishes.service";
import type { DishApiResponse } from "@/types/dishes.types";
import { useAuth } from "@/components/providers";
import { useQueryClient } from "@tanstack/react-query";
import { printHTML } from "@/lib/print-utils";

interface PrintLabelButtonProps {
  order: Order;
  variant?: string;
  size?: string;
}

export function PrintLabelButton({ order }: PrintLabelButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handlePrintLabel = async () => {
    setIsLoading(true);
    try {
      const itemsNeedingData = order.items.filter(
        (item) =>
          item.type !== "bundle" &&
          (!item.ingredients || item.allergens === undefined || item.allergens === null)
      );

      const dishDataMap = new Map<string, DishApiResponse>();

      if (itemsNeedingData.length > 0) {
        const uniqueDishIds = Array.from(
          new Set(itemsNeedingData.map((item) => item.dishId).filter(Boolean))
        );

        if (uniqueDishIds.length > 0) {
          await Promise.all(
            uniqueDishIds.map(async (dishId) => {
              try {
                const response = await queryClient.fetchQuery({
                  queryKey: ["dish-raw", dishId],
                  queryFn: async () => {
                    const result = await dishesService.getDishById(dishId);
                    return result.data;
                  },
                  staleTime: 5 * 60 * 1000,
                });
                dishDataMap.set(dishId, response);
              } catch (error) {
                console.warn(`Failed to fetch dish ${dishId}:`, error);
              }
            })
          );
        }
      }

      const labelData = orderToLabelData(order, {
        chefName: user?.name || "Chef",
        dishDataMap,
      });

      const baseHtml = generateOrderLabelHTML(labelData);

      printHTML(baseHtml, {
        onSuccess: () => toast.success("Print dialog opened"),
        onError: (error) => toast.error(error),
      });
    } catch {
      toast.error("Failed to generate label. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="secondary" onClick={handlePrintLabel} disabled={isLoading} data-testid="print-label-button">
      {isLoading ? (
        <Spinner size="small" />
      ) : (
        <PrintIcon className="size-4 fill-current" />
      )}
      {isLoading ? "Generating..." : "Print Label"}
    </Button>
  );
}
