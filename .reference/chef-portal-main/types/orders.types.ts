// Order Types
// All TypeScript interfaces and types for orders

import type { PortionSize } from "./dishes.types";
import type { BundlePortionSize } from "./bundles.types";

// Delivery Address Type
export interface DeliveryAddress {
  street: string;
  apartment: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  instructions: string | null;
}

// Frontend Order Types
export interface OrderItemCustomization {
  groupName: string;
  modifiers: Array<{
    name: string;
    price: number;
  }>;
}

export interface OrderBundleItem {
  id: string;
  dishName: string;
  quantity: number;
  modifiers?: Array<{ name: string; price: number }>;
  ingredients?: string;
  allergens?: string[];
}

export interface OrderItem {
  id: string;
  dishId: string;
  dishName: string;
  productCode?: string;
  color?: string;
  image?: string;
  quantity: number;
  price: number;
  subtotal: number;
  specialInstructions?: string;
  portionSize?: PortionSize | BundlePortionSize | string | null;
  spiceLevel?: "none" | "mild" | "medium" | "hot" | "extraHot" | null;
  customizations?: OrderItemCustomization[];
  type?: "dish" | "bundle";
  bundleItems?: OrderBundleItem[];
  // Dish snapshot at time of order (for labels/compliance)
  ingredients?: string; // Comma-separated list of ingredient names
  allergens?: string[]; // Array of allergen names
}

export interface OrderActionHistory {
  id: string;
  action: string;
  doer: string;
  timestamp: string;
}

export interface OrderStatusHistoryChangedBy {
  email: string;
  id: string;
  name: string;
  role: string;
}

export interface OrderStatusHistory {
  status: string;
  previousStatus: string | null;
  changedAt: string;
  reason: string | null;
  changedBy?: OrderStatusHistoryChangedBy | null;
}

export type OrderStatus =
  | "confirmed"
  | "paid"
  | "rescheduling"
  | "preparing"
  | "ready"
  | "readyForPickup"
  | "outForDelivery"
  | "delivered"
  | "pickedUp"
  | "cancelled"
  | "rejected";

// Raw API response types (defined here so they can be reused in Order interface)
export interface RawOrderDetailsAddress {
  street: string;
  apartment: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  instructions: string | null;
}

export interface RawOrderDetailsDelivery {
  deliveryStatus: string | null;
  trackingUrl: string | null;
  pickupStartTime: string | null;
  pickupEndTime: string | null;
  dropoffStartTime: string | null;
  dropoffEndTime: string | null;
  pickupEta: string | null;
  advertisedPickupEta: string | null;
  dropoffEta: string | null;
  scheduledAt: string | null;
  deliveryWindow: "asap" | "30min" | "1hour" | "2hours" | "nextday" | "custom";
  address: RawOrderDetailsAddress | null;
  phoneNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  dropoffInstructions: string | null;
  pickupInstructions: string | null;
  nashOrderId: string | null;
  nashJobId: string | null;
  nashJobConfigurationId: string | null;
  nashQuoteId: string | null;
}

export type FulfillmentMethod = "delivery" | "shipping" | "chefPickup" | "yallaSpot";

export interface ShippingLabel {
  labelUrl: string;
  trackingNumber: string;
  trackingUrl: string;
  carrier: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAvatar?: string;
  items: OrderItem[];
  status: OrderStatus;
  pricing: {
    subtotal?: number;
    chefPayout: number;
  };
  total?: number; // Order total in dollars
  paymentMethod: "cash" | "card" | "online";
  paymentStatus: "pending" | "paid" | "refunded";
  deliveryAddress?: DeliveryAddress;
  deliveryInstructions?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt?: string;
  estimatedReadyTime?: string;
  deliveredAt?: string;
  actionHistory?: OrderActionHistory[];
  statusHistory?: OrderStatusHistory[];
  // Additional fields from API
  deliveryDate?: string;
  trackingUrl?: string;
  // Fulfillment method
  fulfillmentMethod?: FulfillmentMethod;
  shippingLabel?: ShippingLabel | null;
  // Detailed order fields
  rescheduling?: RawOrderDetailsRescheduling | null;
  refund?: {
    refundAmount: number | null;
    refundDate: string | null;
    refundStatus: "refunded" | "not_refunded";
  } | null;
  advertisedPickupEta?: string;
  deliveryDetails?: RawOrderDetailsDelivery | null;
  // Pickup fulfillment data
  pickupData?: {
    pickupAddress?: DeliveryAddress | null;
    pickupInstructions?: string | null;
    pickedUpAt?: string | null;
    spotName?: string | null;
  } | null;
}

export interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OrdersQueryParams {
  page?: number;
  pageSize?: number;
  limit?: number; // Backend uses 'limit' instead of 'pageSize'
  status?: OrderStatus;
  search?: string;
}

// Raw API response interfaces (internal to service)
export interface RawOrderCustomer {
  name: string;
  avatar: string;
  email: string;
  phone: string;
}

export interface RawOrderItem {
  name: string;
  quantity: number;
  portionSize: PortionSize | BundlePortionSize | string | null;
  customizations?: RawOrderDetailsItemCustomization[];
}

export interface RawOrderFulfillment {
  method: FulfillmentMethod | null;
  scheduledAt?: string | null;
  trackingUrl?: string | null;
  supportedMethods?: FulfillmentMethod[];
  recipientAddress?: RawOrderDetailsAddress | null;
  delivery?: {
    status?: string | null;
    pickupEta?: string | null;
    advertisedPickupEta?: string | null;
    dropoffEta?: string | null;
    pickupWindow?: {
      start?: string | null;
      end?: string | null;
    } | null;
    pickupInstructions?: string | null;
  } | null;
  shipping?: {
    status?: string | null;
    labelUrl?: string | null;
    carrier?: string | null;
    trackingNumber?: string | null;
    shipmentDate?: string | null;
    shippedAt?: string | null;
    estimatedDeliveryDays?: number | null;
  } | null;
  recipient?: {
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    address?: RawOrderDetailsAddress | null;
  } | null;
  chefPickup?: {
    pickupAddress?: DeliveryAddress | null;
    pickupInstructions?: string | null;
    pickedUpAt?: string | null;
  } | null;
  yallaSpot?: {
    spot?: {
      id: string;
      name: string;
      slug?: string;
      address?: DeliveryAddress | null;
    } | null;
    pickupInstructions?: string | null;
    pickedUpAt?: string | null;
  } | null;
  nash?: {
    dropoffInstructions?: string | null;
    pickupInstructions?: string | null;
  } | null;
  shippo?: {
    shipmentDate?: string | null;
  } | null;
  shippingLabel?: ShippingLabel | null;
}

export interface RawOrder {
  id: string;
  orderNumber: string;
  customer: RawOrderCustomer;
  status: OrderStatus;
  total: number;
  pricing?: {
    subtotal?: number;
    chefPayout: number;
  };
  deliveryDate?: string | "";
  trackingUrl?: string | "";
  deliveryAddress?: DeliveryAddress;
  items: RawOrderItem[];
  fulfillment?: RawOrderFulfillment | null;
  fulfillmentMethod?: FulfillmentMethod | null;
  createdAt: string;
}

export interface RawOrdersResponse {
  orders: RawOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Raw order details API response interfaces
export interface RawOrderDetailsCustomer {
  name: string;
  avatar: string;
  email?: string;
  phone?: string;
}

export interface RawOrderDetailsItemCustomization {
  groupName: string;
  modifiers: Array<{
    name: string;
    price: number;
  }>;
}

export interface RawOrderDetailsItem {
  id: string;
  name: string;
  image: string | null;
  portionSize: PortionSize | BundlePortionSize | string | null;
  spiceLevel: "none" | "mild" | "medium" | "hot" | "extraHot" | null;
  specialInstructions: string | null;
  quantity: number;
  price: number;
  lineTotal: number;
  customizations: RawOrderDetailsItemCustomization[];
  type?: "dish" | "bundle";
  bundleItems?: Array<{
    id: string;
    dishName: string;
    quantity: number;
    modifiers?: Array<{ name: string; price: number }>;
    dish?: {
      id: string;
      name: string;
      ingredients?: string | string[] | Array<{ id: string; name: string }>;
      allergens?: string[] | Array<{ id: string; name: string }>;
    };
  }>;
  // Dish snapshot fields (may be present if backend includes them)
  ingredients?: string | string[] | Array<{ id: string; name: string }>;
  allergens?: string[] | Array<{ id: string; name: string }>;
}

export interface RawOrderDetailsPricing {
  subtotal?: number;
  chefPayout: number;
}

export interface RawOrderDetailsRefund {
  refundAmount: number | null;
  refundDate: string | null;
  refundStatus: "refunded" | "not_refunded";
}

export interface RawOrderDetailsReschedulingProposedBy {
  id: string;
  name: string;
  role: string;
  avatar: string | null;
}

export interface RawOrderDetailsReschedulingHistory {
  id: string;
  proposedDateTime: string;
  proposedBy: RawOrderDetailsReschedulingProposedBy;
  reason: string | null;
  timestamp: string;
  action: "proposed" | "accepted" | "rejected";
  expiresAt: string | null;
  initiatorRole: string | null;
  nashQuoteId: string | null;
  nashJobId: string | null;
  deliveryFee: number | null;
  deliveryFeeDelta: number | null;
  nashCancellationFee: number | null;
}

export interface RawOrderDetailsRescheduling {
  proposedDateTime: string | null;
  proposedBy: RawOrderDetailsReschedulingProposedBy | null;
  reschedulingReason: string | null;
  expiresAt: string | null;
  initiatorRole: string | null;
  reminderSent: boolean | null;
  originalDeliveryFee: number | null;
  reschedulingHistory: RawOrderDetailsReschedulingHistory[];
}

export interface RawOrderDetailsStatusHistoryChangedBy {
  email: string;
  id: string;
  name: string;
  role: string;
}

export interface RawOrderDetailsStatusHistory {
  status: string;
  previousStatus: string | null;
  changedAt: string;
  reason: string | null;
  changedBy?: RawOrderDetailsStatusHistoryChangedBy | null;
}

export interface RawOrderDetails {
  id: string;
  orderNumber: string;
  customer: RawOrderDetailsCustomer;
  status: OrderStatus;
  rescheduling: RawOrderDetailsRescheduling | null;
  total: number;
  pricing: RawOrderDetailsPricing;
  refund: RawOrderDetailsRefund;
  deliveryDetails: RawOrderDetailsDelivery | null;
  fulfillment: RawOrderFulfillment | null;
  orderItems: RawOrderDetailsItem[];
  statusHistory: RawOrderDetailsStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface RawOrderDetailsResponse {
  order: RawOrderDetails;
}

const ORDER_STATUSES: OrderStatus[] = ["confirmed", "paid", "rescheduling", "preparing", "ready", "outForDelivery", "delivered", "cancelled", "rejected"];

export function isValidOrderStatus(status: string): status is OrderStatus {
  return ORDER_STATUSES.includes(status as OrderStatus);
}
