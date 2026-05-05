import { http, type ApiResponse } from "@/lib/http-client";
import { endpoints } from "@/config/endpoints";
import {
  deduplicateStatusHistory,
  validateStatusHistory,
} from "@/lib/order-utils";
import type {
  Order,
  OrderItem,
  OrderActionHistory,
  OrdersResponse,
  OrdersQueryParams,
  OrderStatus,
  ShippingLabel,
  RawOrder,
  RawOrdersResponse,
  RawOrderDetails,
  RawOrderDetailsResponse,
} from "@/types/orders.types";

// Transform raw API order to frontend Order format
function transformRawOrder(rawOrder: RawOrder): Order {
  // Map status to paymentStatus if it's a payment status
  const paymentStatusMap: Record<string, "pending" | "paid" | "refunded"> = {
    paid: "paid",
    confirmed: "paid", // Confirmed orders are paid
    pending: "pending",
    refunded: "refunded",
  };

  const paymentStatus =
    paymentStatusMap[rawOrder.status.toLowerCase()] || "pending";

  // Transform items from API format to frontend format
  const transformedItems: OrderItem[] = rawOrder.items.map((item, index) => ({
    id: `${rawOrder.id}-item-${index}`,
    dishId: "", // Not available in list endpoint
    dishName: item.name,
    productCode: undefined,
    color: undefined,
    image: undefined,
    quantity: item.quantity,
    price: 0, // Not available in list endpoint
    subtotal: 0, // Not available in list endpoint
    specialInstructions: undefined,
    portionSize: item.portionSize,
    customizations: item.customizations?.map((custom) => ({
      groupName: custom.groupName,
      modifiers: custom.modifiers,
    })),
  }));

  return {
    id: rawOrder.id,
    orderNumber: rawOrder.orderNumber,
    customerName: rawOrder.customer.name,
    customerPhone: rawOrder.customer.phone || undefined,
    customerEmail: rawOrder.customer.email || undefined,
    customerAvatar: rawOrder.customer.avatar || undefined,
    items: transformedItems,
    status: rawOrder.status, // API now returns order status directly
    pricing: {
      subtotal: rawOrder.pricing?.subtotal ?? 0,
      chefPayout: rawOrder.pricing?.chefPayout ?? 0,
    },
    total: rawOrder.total ?? 0,
    paymentMethod: "online", // Default
    paymentStatus,
    deliveryAddress:
      rawOrder.deliveryAddress ||
      rawOrder.fulfillment?.recipientAddress ||
      undefined,
    deliveryInstructions: undefined,
    specialInstructions: undefined,
    createdAt: rawOrder.createdAt,
    updatedAt: undefined,
    estimatedReadyTime: undefined,
    deliveredAt: undefined,
    actionHistory: undefined,
    deliveryDate:
      rawOrder.deliveryDate ||
      rawOrder.fulfillment?.scheduledAt ||
      undefined,
    trackingUrl:
      rawOrder.trackingUrl ||
      rawOrder.fulfillment?.trackingUrl ||
      undefined,
    fulfillmentMethod:
      rawOrder.fulfillment?.method ||
      rawOrder.fulfillmentMethod ||
      undefined,
    advertisedPickupEta:
      rawOrder.fulfillment?.delivery?.advertisedPickupEta || undefined,
    pickupData: rawOrder.fulfillment?.chefPickup
      ? {
          pickupAddress: rawOrder.fulfillment.chefPickup.pickupAddress || null,
          pickupInstructions: rawOrder.fulfillment.chefPickup.pickupInstructions || null,
          pickedUpAt: rawOrder.fulfillment.chefPickup.pickedUpAt || null,
        }
      : rawOrder.fulfillment?.yallaSpot
      ? {
          pickupInstructions: rawOrder.fulfillment.yallaSpot.pickupInstructions || null,
          pickedUpAt: rawOrder.fulfillment.yallaSpot.pickedUpAt || null,
          spotName: rawOrder.fulfillment.yallaSpot.spot?.name || null,
        }
      : null,
    shippingLabel:
      rawOrder.fulfillment?.shippingLabel ||
      (rawOrder.fulfillment?.shipping ? {
        labelUrl: rawOrder.fulfillment.shipping.labelUrl || "",
        trackingNumber: rawOrder.fulfillment.shipping.trackingNumber || "",
        trackingUrl: rawOrder.fulfillment.trackingUrl || "",
        carrier: rawOrder.fulfillment.shipping.carrier || "",
      } : null),
  };
}

// Transform raw API response to frontend format
function transformRawOrdersResponse(
  rawResponse: RawOrdersResponse
): OrdersResponse {
  // Handle cases where the response structure might be different
  if (!rawResponse) {
    throw new Error("Invalid response: response is null or undefined");
  }

  // Safely extract orders array
  const orders = Array.isArray(rawResponse.orders) ? rawResponse.orders : [];
  
  // Transform orders with error handling
  const transformedOrders = orders.map((order, index) => {
    try {
      return transformRawOrder(order);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(`[transformRawOrdersResponse] Error transforming order at index ${index}:`, error);
        console.error(`[transformRawOrdersResponse] Order data:`, order);
      }
      throw new Error(
        "We couldn't load your orders. Please refresh the page or try again."
      );
    }
  });

  return {
    data: transformedOrders,
    total: rawResponse.total ?? 0,
    page: rawResponse.page ?? 1,
    pageSize: rawResponse.limit ?? 10,
    totalPages: rawResponse.totalPages ?? 0,
  };
}

// Transform raw order details API response to frontend Order format
function transformRawOrderDetails(rawOrderDetails: RawOrderDetails): Order {
  // Map status to paymentStatus
  const paymentStatusMap: Record<string, "pending" | "paid" | "refunded"> = {
    paid: "paid",
    confirmed: "paid",
    pending: "pending",
    refunded: "refunded",
  };

  const paymentStatus =
    paymentStatusMap[rawOrderDetails.status.toLowerCase()] ||
    (rawOrderDetails.refund?.refundStatus === "refunded"
      ? "refunded"
      : "pending");

  // Transform order items (handle case where orderItems might be missing)
  const transformedItems: OrderItem[] = (rawOrderDetails.orderItems || []).map(
    (item) => {
      // Extract ingredients from snapshot (handle different formats)
      let ingredients: string | undefined;
      if (item.ingredients) {
        if (typeof item.ingredients === "string") {
          ingredients = item.ingredients;
        } else if (Array.isArray(item.ingredients)) {
          ingredients = item.ingredients
            .map((ing) =>
              typeof ing === "string" ? ing : (ing as { name: string }).name
            )
            .join(", ");
        }
      }

      // Extract allergens from snapshot (handle different formats)
      let allergens: string[] | undefined;
      if (item.allergens) {
        if (Array.isArray(item.allergens)) {
          allergens = item.allergens.map((allergen) =>
            typeof allergen === "string"
              ? allergen
              : (allergen as { name: string }).name
          );
        }
      }

      return {
        id: item.id,
        dishId: item.id, // Use item id as dishId
        dishName: item.name,
        productCode: undefined,
        color: undefined,
        image: item.image || undefined,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.lineTotal,
        specialInstructions: item.specialInstructions || undefined,
        portionSize: item.portionSize,
        spiceLevel: item.spiceLevel,
        customizations: item.customizations.map((custom) => ({
          groupName: custom.groupName,
          modifiers: custom.modifiers,
        })),
        type: item.type || "dish",
        bundleItems: item.bundleItems?.map((bi) => {
          // Extract ingredients from dish object within bundle item
          let biIngredients: string | undefined;
          if (bi.dish?.ingredients) {
            if (typeof bi.dish.ingredients === "string") {
              biIngredients = bi.dish.ingredients;
            } else if (Array.isArray(bi.dish.ingredients)) {
              biIngredients = bi.dish.ingredients
                .map((ing) =>
                  typeof ing === "string" ? ing : (ing as { name: string }).name
                )
                .join(", ");
            }
          }

          // Extract allergens from dish object within bundle item
          let biAllergens: string[] | undefined;
          if (bi.dish?.allergens) {
            if (Array.isArray(bi.dish.allergens)) {
              biAllergens = bi.dish.allergens.map((allergen) =>
                typeof allergen === "string"
                  ? allergen
                  : (allergen as { name: string }).name
              );
            }
          }

          return {
            id: bi.id,
            dishName: bi.dishName,
            quantity: bi.quantity,
            modifiers: bi.modifiers,
            ingredients: biIngredients,
            allergens: biAllergens,
          };
        }),
        ingredients,
        allergens,
      };
    }
  );

  // Get delivery address - prefer new fulfillment structure, fall back to old deliveryDetails
  const deliveryAddress =
    rawOrderDetails.fulfillment?.recipientAddress ||
    rawOrderDetails.deliveryDetails?.address ||
    undefined;

  // Transform status history to action history format (handle missing statusHistory)
  const actionHistory: OrderActionHistory[] = (rawOrderDetails.statusHistory || []).map(
    (history, index) => ({
      id: `status-${rawOrderDetails.id}-${index}`,
      action: history.previousStatus
        ? `Status changed from ${history.previousStatus} to ${history.status}`
        : `Status set to ${history.status}`,
      doer: history.changedBy?.name || "System",
      timestamp: history.changedAt,
    })
  );

  return {
    id: rawOrderDetails.id,
    orderNumber: rawOrderDetails.orderNumber || "",
    customerName: rawOrderDetails.customer?.name || "",
    customerPhone:
      rawOrderDetails.customer?.phone ||
      undefined,
    customerEmail: rawOrderDetails.customer?.email || undefined,
    customerAvatar: rawOrderDetails.customer?.avatar || undefined,
    items: transformedItems,
    status: rawOrderDetails.status,
    pricing: {
      subtotal: rawOrderDetails.pricing?.subtotal ?? undefined,
      chefPayout: rawOrderDetails.pricing?.chefPayout ?? 0,
    },
    total: rawOrderDetails.total,
    paymentMethod: "online", // Default, not provided by API
    paymentStatus,
    deliveryAddress,
    deliveryInstructions:
      rawOrderDetails.deliveryDetails?.dropoffInstructions ||
      undefined,
    specialInstructions: undefined,
    createdAt: rawOrderDetails.createdAt || new Date().toISOString(),
    updatedAt: rawOrderDetails.updatedAt || new Date().toISOString(),
    estimatedReadyTime:
      rawOrderDetails.fulfillment?.scheduledAt ||
      rawOrderDetails.deliveryDetails?.scheduledAt ||
      undefined,
    deliveredAt:
      rawOrderDetails.status === "delivered"
        ? rawOrderDetails.updatedAt
        : undefined,
    actionHistory,
    statusHistory: (() => {
      // Transform status history (handle missing statusHistory)
      const transformedHistory = (rawOrderDetails.statusHistory || []).map(
        (history) => ({
          status: history.status,
          previousStatus: history.previousStatus,
          changedAt: history.changedAt,
          reason: history.reason,
          changedBy: history.changedBy || null,
        })
      );

      // Validate and deduplicate status history
      const validation = validateStatusHistory(transformedHistory);
      if (
        validation.warnings.length > 0 &&
        process.env.NODE_ENV === "development"
      ) {
        console.warn(
          `[Orders Service] Status history validation warnings for order ${rawOrderDetails.id}:`,
          validation.warnings
        );
      }

      // Deduplicate entries
      const deduplicated = deduplicateStatusHistory(transformedHistory);

      if (deduplicated.length !== transformedHistory.length) {
        console.warn(
          `[Orders Service] Removed ${
            transformedHistory.length - deduplicated.length
          } duplicate status history entry(ies) for order ${rawOrderDetails.id}`
        );
      }

      return deduplicated;
    })(),
    deliveryDate:
      rawOrderDetails.fulfillment?.scheduledAt ||
      rawOrderDetails.deliveryDetails?.scheduledAt ||
      rawOrderDetails.fulfillment?.shipping?.shipmentDate ||
      undefined,
    trackingUrl:
      rawOrderDetails.fulfillment?.trackingUrl ||
      rawOrderDetails.deliveryDetails?.trackingUrl ||
      undefined,
    fulfillmentMethod: rawOrderDetails.fulfillment?.method || undefined,
    advertisedPickupEta:
      rawOrderDetails.fulfillment?.delivery?.advertisedPickupEta ||
      rawOrderDetails.deliveryDetails?.advertisedPickupEta ||
      undefined,
    shippingLabel: rawOrderDetails.fulfillment?.shippingLabel || null,
    pickupData: rawOrderDetails.fulfillment?.chefPickup
      ? {
          pickupAddress: rawOrderDetails.fulfillment.chefPickup.pickupAddress || null,
          pickupInstructions: rawOrderDetails.fulfillment.chefPickup.pickupInstructions || null,
          pickedUpAt: rawOrderDetails.fulfillment.chefPickup.pickedUpAt || null,
        }
      : rawOrderDetails.fulfillment?.yallaSpot
      ? {
          pickupInstructions: rawOrderDetails.fulfillment.yallaSpot.pickupInstructions || null,
          pickedUpAt: rawOrderDetails.fulfillment.yallaSpot.pickedUpAt || null,
          spotName: rawOrderDetails.fulfillment.yallaSpot.spot?.name || null,
        }
      : null,
    rescheduling: rawOrderDetails.rescheduling || null,
    refund: rawOrderDetails.refund || null,
    deliveryDetails: rawOrderDetails.deliveryDetails || null,
  };
}

class OrdersService {
  async getOrders(
    params?: OrdersQueryParams
  ): Promise<ApiResponse<OrdersResponse>> {
    // Transform pageSize to limit for backend
    const apiParams: Record<string, string | number | boolean> = {};
    if (params?.page) apiParams.page = params.page;
    if (params?.pageSize) apiParams.limit = params.pageSize;
    if (params?.limit) apiParams.limit = params.limit;
    if (params?.status) apiParams.status = params.status;
    if (params?.search) apiParams.search = params.search;

    const response = await http.get<RawOrdersResponse>(endpoints.orders.list, {
      params: Object.keys(apiParams).length > 0 ? apiParams : undefined,
    });

    // Log response in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.log("[OrdersService] API Response:", {
        status: response.status,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        dataType: typeof response.data,
      });
    }

    // Transform the response with error handling
    try {
      // Check if response.data exists and has the expected structure
      if (!response.data) {
        throw new Error("Response data is missing or undefined");
      }

      return {
        ...response,
        data: transformRawOrdersResponse(response.data),
      };
    } catch (error) {
      // Log transformation error for debugging
      if (process.env.NODE_ENV === "development") {
        console.error("[OrdersService] Error transforming orders response:", error);
        console.error("[OrdersService] Raw response:", response);
        console.error("[OrdersService] Raw response data:", response.data);
        console.error("[OrdersService] Response data type:", typeof response.data);
        console.error("[OrdersService] Response data keys:", response.data ? Object.keys(response.data) : "N/A");
      }
      throw new Error(
        "We couldn't load your orders. Please refresh the page or try again."
      );
    }
  }

  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    const response = await http.get<RawOrderDetailsResponse>(
      endpoints.orders.get(id)
    );

    // Transform the response
    return {
      ...response,
      data: transformRawOrderDetails(response.data.order),
    };
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
    additionalData?: {
      reason?: string;
      proposedDateTime?: string;
      reschedulingReason?: string;
    }
  ): Promise<ApiResponse<Order>> {
    const payload: Record<string, unknown> = { status };

    // Add additional data if provided
    if (additionalData) {
      if (additionalData.reason) payload.reason = additionalData.reason;
      if (additionalData.proposedDateTime)
        payload.proposedDateTime = additionalData.proposedDateTime;
      if (additionalData.reschedulingReason)
        payload.reschedulingReason = additionalData.reschedulingReason;
    }

    return http.patch<Order>(endpoints.orders.updateStatus(id), payload);
  }

  async cancelOrder(
    id: string,
    reason: string
  ): Promise<ApiResponse<Order>> {
    if (!reason || !reason.trim()) {
      throw new Error("Cancel action requires a reason");
    }

    const payload = { reason: reason.trim() };

    console.log("[OrdersService] Calling cancel order API:", {
      endpoint: endpoints.orders.cancel(id),
      orderId: id,
      payload,
    });

    // The cancel endpoint returns a wrapped response with success, data.order, and data.refunded
    // Handle the wrapped response structure: { success: true, data: { order: {...}, refunded: true } }
    // The http client returns { data: <API response> }, so:
    // - API returns: { success: true, data: { order: {...}, refunded: true } }
    // - http client wraps it: { data: { success: true, data: { order: {...}, refunded: true } }, status, message }
    // - So we access: response.data.data.order
    const response = await http.post<{
      success: boolean;
      data: {
        order: {
          id: string;
          status: OrderStatus;
        };
        refunded: boolean;
      };
    }>(endpoints.orders.cancel(id), payload);

    const apiResponse = response.data as {
      success: boolean;
      data: {
        order: {
          id: string;
          status: OrderStatus;
        };
        refunded: boolean;
      };
    };

    // Extract order and refunded status from wrapped response
    if (!apiResponse.success || !apiResponse.data?.order) {
      throw new Error("We couldn't cancel this order. Please try again or contact support if the problem continues.");
    }

    console.log("[OrdersService] Cancel order API response:", {
      orderId: apiResponse.data.order.id,
      newStatus: apiResponse.data.order.status,
      refunded: apiResponse.data.refunded,
      success: true,
    });

    // After cancellation, fetch the full order details to return complete order data
    // The cancel response only contains id and status, so we need to fetch the full order
    const fullOrderResponse = await this.getOrderById(id);

    return {
      ...response,
      data: fullOrderResponse.data,
    };
  }

  async performOrderAction(
    id: string,
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
      | "mark_picked_up",
    params?: {
      proposedDateTime?: string;
      reason?: string;
      pickupInstructions?: string;
    }
  ): Promise<ApiResponse<Order>> {
    const payload: {
      action: string;
      proposedDateTime?: string;
      reason?: string;
      pickupInstructions?: string;
    } = { action };

    // Add optional parameters
    if (params?.proposedDateTime) {
      payload.proposedDateTime = params.proposedDateTime;
    }
    if (params?.reason) {
      payload.reason = params.reason;
    }
    if (params?.pickupInstructions) {
      payload.pickupInstructions = params.pickupInstructions;
    }

    // Validate required parameters for specific actions
    // Reject action requires a reason according to API spec
    if (action === "reject" && !payload.reason) {
      throw new Error(`${action} action requires a reason`);
    }

    console.log("[OrdersService] Calling order action API:", {
      endpoint: endpoints.orders.action(id),
      action,
      payload,
    });

    const response = await http.post<RawOrderDetailsResponse>(
      endpoints.orders.action(id),
      payload
    );

    console.log("[OrdersService] Order action API response:", {
      action,
      orderId: response.data.order.id,
      newStatus: response.data.order.status,
      success: true,
    });

    // Transform the response
    return {
      ...response,
      data: transformRawOrderDetails(response.data.order),
    };
  }

  async rescheduleOrder(
    id: string,
    data: {
      proposedDateTime: string;
      reason?: string;
    }
  ): Promise<ApiResponse<Order>> {
    const payload: {
      proposedDateTime: string;
      reason?: string;
    } = {
      proposedDateTime: data.proposedDateTime,
    };

    if (data.reason) {
      payload.reason = data.reason;
    }

    const endpoint = endpoints.orders.reschedule(id);
    
    if (process.env.NODE_ENV === "development") {
      console.log("[OrdersService] Rescheduling order:", {
        endpoint,
        orderId: id,
        payload,
      });
    }

    const response = await http.post<{
      success: boolean;
      data: RawOrderDetailsResponse;
    }>(endpoint, payload);

    if (process.env.NODE_ENV === "development") {
      console.log("[OrdersService] Reschedule response:", response);
    }

    // Handle the wrapped response structure: { success: true, data: { order: ... } }
    // The http client returns { data: <API response> }, so:
    // - API returns: { success: true, data: { order: {...} } }
    // - http client wraps it: { data: { success: true, data: { order: {...} } }, status, message }
    // - So we access: response.data.data.order
    const apiResponse = response.data as {
      success: boolean;
      data: {
        order: RawOrderDetails;
      };
    };

    // Extract order from wrapped response
    if (!apiResponse.success || !apiResponse.data?.order) {
      throw new Error("We couldn't reschedule this order. Please try again or contact support if the problem continues.");
    }

    const orderData = apiResponse.data.order;

    // Transform the response
    return {
      ...response,
      data: transformRawOrderDetails(orderData),
    };
  }

  async updateOrder(
    id: string,
    data: {
      deliveryDetails?: {
        pickupInstructions?: string | null;
      };
    }
  ): Promise<ApiResponse<Order>> {
    const response = await http.put<RawOrderDetailsResponse>(
      endpoints.orders.get(id),
      data
    );

    // Transform the response
    return {
      ...response,
      data: transformRawOrderDetails(response.data.order),
    };
  }

  async deleteOrder(id: string): Promise<ApiResponse<void>> {
    return http.delete<void>(endpoints.orders.delete(id));
  }

  async markPickedUp(id: string): Promise<ApiResponse<Order>> {
    const response = await http.post<{ success: boolean; order: RawOrderDetails }>(
      endpoints.orders.pickedUp(id),
      {}
    );

    const apiResponse = response.data as { success: boolean; order: RawOrderDetails };

    if (!apiResponse.success || !apiResponse.order) {
      throw new Error("Invalid response format from picked-up endpoint");
    }

    return {
      ...response,
      data: transformRawOrderDetails(apiResponse.order),
    };
  }

  async purchaseShippingLabel(
    id: string
  ): Promise<ApiResponse<ShippingLabel>> {
    const response = await http.post<ShippingLabel>(
      endpoints.orders.purchaseLabel(id),
      {}
    );
    return response;
  }
}

export const ordersService = new OrdersService();
