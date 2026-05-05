import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { ordersService } from "@/services/orders.service";
import type {
  OrdersQueryParams,
  OrderStatus,
  Order,
} from "@/types/orders.types";
import { useAnalytics } from "@/hooks/use-analytics";

export function useOrders(params?: OrdersQueryParams) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      try {
        const response = await ordersService.getOrders(params);
        return response.data;
      } catch (error) {
        // Log the error for debugging
        if (process.env.NODE_ENV === "development") {
          console.error("[useOrders] Error fetching orders:", error);
          console.error("[useOrders] Error details:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          });
        }
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const response = await ordersService.getOrderById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      additionalData,
    }: {
      id: string;
      status: OrderStatus;
      additionalData?: {
        reason?: string;
        proposedDateTime?: string;
        reschedulingReason?: string;
      };
    }) => {
      const response = await ordersService.updateOrderStatus(
        id,
        status,
        additionalData
      );
      return response;
    },
    onSuccess: () => {
      // Invalidate orders queries to refetch
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useOrderAction() {
  const queryClient = useQueryClient();
  const { trackOrderAction } = useAnalytics();
  // Track in-flight requests to prevent duplicate calls (persists across renders)
  const inFlightRequestsRef = useRef(new Map<string, Promise<Order>>());

  return useMutation({
    mutationFn: async ({
      id,
      action,
      params,
    }: {
      id: string;
      action:
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
        | "cancel";
      params?: {
        proposedDateTime?: string;
        reason?: string;
        pickupInstructions?: string;
      };
    }) => {
      // Handle cancel action separately using the new cancel endpoint
      if (action === "cancel") {
        if (!params?.reason || !params.reason.trim()) {
          throw new Error("Cancel action requires a reason");
        }

        // Create a unique key for this request
        const requestKey = `${id}-cancel-${params.reason}`;
        const inFlightRequests = inFlightRequestsRef.current;

        // Check if there's already an in-flight request for this action
        const existingRequest = inFlightRequests.get(requestKey);
        if (existingRequest) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              `[useOrderAction] Duplicate cancel request detected for ${requestKey}. Reusing existing request.`
            );
          }
          return existingRequest;
        }

        // Create the cancel request
        const requestPromise = ordersService
          .cancelOrder(id, params.reason)
          .then((response) => {
            // Remove from in-flight requests on success
            inFlightRequests.delete(requestKey);
            return response.data;
          })
          .catch((error) => {
            // Remove from in-flight requests on error
            inFlightRequests.delete(requestKey);
            throw error;
          });

        // Store the in-flight request
        inFlightRequests.set(requestKey, requestPromise);
        // Cleanup timeout: remove entry after 30s if still present
        setTimeout(() => inFlightRequests.delete(requestKey), 30000);

        return requestPromise;
      }

      // Handle mark_picked_up action using the dedicated endpoint
      if (action === "mark_picked_up") {
        const requestKey = `${id}-mark_picked_up`;
        const inFlightRequests = inFlightRequestsRef.current;

        const existingRequest = inFlightRequests.get(requestKey);
        if (existingRequest) {
          return existingRequest;
        }

        const requestPromise = ordersService
          .markPickedUp(id)
          .then((response) => {
            inFlightRequests.delete(requestKey);
            return response.data;
          })
          .catch((error) => {
            inFlightRequests.delete(requestKey);
            throw error;
          });

        inFlightRequests.set(requestKey, requestPromise);
        return requestPromise;
      }

      // Handle other actions using the existing performOrderAction method
      // Create a unique key for this request
      const requestKey = `${id}-${action}-${JSON.stringify(params || {})}`;
      const inFlightRequests = inFlightRequestsRef.current;

      // Check if there's already an in-flight request for this action
      const existingRequest = inFlightRequests.get(requestKey);
      if (existingRequest) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[useOrderAction] Duplicate request detected for ${requestKey}. Reusing existing request.`
          );
        }
        return existingRequest;
      }

      // Create the request (cancel and mark_picked_up are handled above with early returns)
      const requestPromise = ordersService
        .performOrderAction(id, action as Exclude<typeof action, "cancel" | "mark_picked_up">, params)
        .then((response) => {
          // Remove from in-flight requests on success
          inFlightRequests.delete(requestKey);
          return response.data;
        })
        .catch((error) => {
          // Remove from in-flight requests on error
          inFlightRequests.delete(requestKey);
          throw error;
        });

      // Store the in-flight request
      inFlightRequests.set(requestKey, requestPromise);
      // Cleanup timeout: remove entry after 30s if still present
      setTimeout(() => inFlightRequests.delete(requestKey), 30000);

      return requestPromise;
    },
    onSuccess: (order, variables) => {
      // Track order action
      trackOrderAction(variables.action, {
        orderId: variables.id,
        orderStatus: order.status,
        reason: variables.params?.reason,
        proposedDateTime: variables.params?.proposedDateTime,
      });
      // Invalidate orders queries to refetch
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // Invalidate the specific order query
      queryClient.invalidateQueries({ queryKey: ["orders", variables.id] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        deliveryDetails?: {
          pickupInstructions?: string | null;
        };
      };
    }) => {
      const response = await ordersService.updateOrder(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate orders queries to refetch
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", variables.id] });
    },
  });
}

export function useRescheduleOrder() {
  const queryClient = useQueryClient();
  const { trackOrderAction } = useAnalytics();

  return useMutation({
    mutationFn: async ({
      id,
      proposedDateTime,
      reason,
    }: {
      id: string;
      proposedDateTime: string;
      reason?: string;
    }) => {
      const response = await ordersService.rescheduleOrder(id, {
        proposedDateTime,
        reason,
      });
      return response.data;
    },
    onSuccess: (order, variables) => {
      // Track order action
      trackOrderAction("reschedule", {
        orderId: variables.id,
        orderStatus: order.status,
        proposedDateTime: variables.proposedDateTime,
        reason: variables.reason,
      });
      // Invalidate orders queries to refetch
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // Invalidate the specific order query
      queryClient.invalidateQueries({ queryKey: ["orders", variables.id] });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await ordersService.deleteOrder(id);
      return response;
    },
    onSuccess: () => {
      // Invalidate orders queries to refetch
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
