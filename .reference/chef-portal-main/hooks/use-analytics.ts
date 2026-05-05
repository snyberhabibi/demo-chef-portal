"use client";

import { useCallback } from "react";
import { usePostHog } from "posthog-js/react";

// Event names for the chef portal
export const ANALYTICS_EVENTS = {
  // Authentication
  LOGIN_SUCCESS: "login_success",
  LOGIN_FAILED: "login_failed",
  LOGOUT: "logout",
  PASSWORD_RESET_REQUESTED: "password_reset_requested",
  PASSWORD_RESET_COMPLETED: "password_reset_completed",
  PASSWORD_CHANGED: "password_changed",

  // Dish Management
  DISH_CREATED: "dish_created",
  DISH_UPDATED: "dish_updated",
  DISH_DELETED: "dish_deleted",
  DISH_PUBLISHED: "dish_published",
  DISH_ARCHIVED: "dish_archived",
  DISH_VIEWED: "dish_viewed",
  DISHES_SEARCHED: "dishes_searched",
  DISHES_FILTERED: "dishes_filtered",

  // Order Management
  ORDER_VIEWED: "order_viewed",
  ORDER_CONFIRMED: "order_confirmed",
  ORDER_REJECTED: "order_rejected",
  ORDER_RESCHEDULE_PROPOSED: "order_reschedule_proposed",
  ORDER_RESCHEDULE_ACCEPTED: "order_reschedule_accepted",
  ORDER_RESCHEDULE_REJECTED: "order_reschedule_rejected",
  ORDER_PREPARATION_STARTED: "order_preparation_started",
  ORDER_MARKED_READY: "order_marked_ready",
  ORDER_SENT_FOR_DELIVERY: "order_sent_for_delivery",
  ORDER_DELIVERED: "order_delivered",
  ORDER_PICKED_UP: "order_picked_up",
  ORDER_CANCELLED: "order_cancelled",
  ORDER_UPDATED: "order_updated",
  ORDER_DELETED: "order_deleted",
  ORDERS_FILTERED: "orders_filtered",

  // Menu Sections
  MENU_SECTION_CREATED: "menu_section_created",
  MENU_SECTION_UPDATED: "menu_section_updated",
  MENU_SECTION_DELETED: "menu_section_deleted",
  MENU_SECTION_TOGGLED: "menu_section_toggled",

  // Modifier Groups
  MODIFIER_GROUP_CREATED: "modifier_group_created",
  MODIFIER_GROUP_UPDATED: "modifier_group_updated",
  MODIFIER_GROUP_DELETED: "modifier_group_deleted",

  // Chef Profile
  PROFILE_UPDATED: "profile_updated",
  PROFILE_AVAILABILITY_CHANGED: "profile_availability_changed",
  PROFILE_AUTO_ACCEPT_CHANGED: "profile_auto_accept_changed",
  PROFILE_CUISINES_UPDATED: "profile_cuisines_updated",
  PROFILE_BANNER_UPLOADED: "profile_banner_uploaded",

  // User Account
  ACCOUNT_UPDATED: "account_updated",
  AVATAR_UPLOADED: "avatar_uploaded",

  // Address
  ADDRESS_CREATED: "address_created",
  ADDRESS_UPDATED: "address_updated",

  // Media Upload
  IMAGE_UPLOADED: "image_uploaded",
  IMAGE_UPLOAD_FAILED: "image_upload_failed",

  // Stripe Connect
  STRIPE_ONBOARD_STARTED: "stripe_onboard_started",
  STRIPE_DASHBOARD_ACCESSED: "stripe_dashboard_accessed",

  // Navigation & UI
  PAGE_VIEWED: "page_viewed",
  DASHBOARD_VIEWED: "dashboard_viewed",
  FEATURE_USED: "feature_used",

  // Toast
  TOAST_DISPLAYED: "toast_displayed",
} as const;

type EventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

// Event properties - permissive record type for PostHog
type EventProperties = Record<string, unknown>;

// Type-safe event property interfaces (for documentation and IDE hints)
export interface DishEventProps {
  dishId?: string;
  dishName?: string;
  category?: string;
  status?: string;
  cuisineType?: string;
  hasImages?: boolean;
  portionCount?: number;
  hasModifiers?: boolean;
  [key: string]: unknown;
}

export interface OrderEventProps {
  orderId?: string;
  orderStatus?: string;
  orderTotal?: number;
  itemCount?: number;
  customerId?: string;
  reason?: string;
  proposedDateTime?: string;
  [key: string]: unknown;
}

export interface MenuSectionEventProps {
  sectionId?: string;
  sectionName?: string;
  isActive?: boolean;
  dishCount?: number;
  [key: string]: unknown;
}

export interface ModifierGroupEventProps {
  groupId?: string;
  groupName?: string;
  optionCount?: number;
  isRequired?: boolean;
  [key: string]: unknown;
}

export interface ProfileEventProps {
  field?: string;
  previousValue?: unknown;
  newValue?: unknown;
  available?: boolean;
  autoAcceptOrders?: boolean;
  cuisines?: string[];
  [key: string]: unknown;
}

export interface UploadEventProps {
  fileType?: string;
  fileSize?: number;
  uploadType?: "dish" | "profile" | "avatar";
  error?: string;
  [key: string]: unknown;
}

export interface SearchEventProps {
  query?: string;
  filters?: Record<string, unknown>;
  resultCount?: number;
  [key: string]: unknown;
}

export function useAnalytics() {
  const posthog = usePostHog();

  const track = useCallback(
    (eventName: EventName, properties?: EventProperties) => {
      if (!posthog) {
        if (process.env.NODE_ENV === "development") {
          console.log("[Analytics] PostHog not available:", eventName, properties);
        }
        return;
      }

      posthog.capture(eventName, {
        ...properties,
        timestamp: new Date().toISOString(),
        portal: "chef",
      });

      if (process.env.NODE_ENV === "development") {
        console.log("[Analytics] Event tracked:", eventName, properties);
      }
    },
    [posthog]
  );

  // Authentication events
  const trackLogin = useCallback(
    (success: boolean, email?: string, errorMessage?: string) => {
      track(success ? ANALYTICS_EVENTS.LOGIN_SUCCESS : ANALYTICS_EVENTS.LOGIN_FAILED, {
        email: success ? undefined : email, // Only include email on failure for debugging
        error: errorMessage,
      });
    },
    [track]
  );

  const trackLogout = useCallback(() => {
    track(ANALYTICS_EVENTS.LOGOUT);
  }, [track]);

  const trackPasswordReset = useCallback(
    (type: "requested" | "completed", email?: string) => {
      track(
        type === "requested"
          ? ANALYTICS_EVENTS.PASSWORD_RESET_REQUESTED
          : ANALYTICS_EVENTS.PASSWORD_RESET_COMPLETED,
        { email }
      );
    },
    [track]
  );

  const trackPasswordChanged = useCallback(() => {
    track(ANALYTICS_EVENTS.PASSWORD_CHANGED);
  }, [track]);

  // Dish events
  const trackDishCreated = useCallback(
    (props: DishEventProps) => {
      track(ANALYTICS_EVENTS.DISH_CREATED, props);
    },
    [track]
  );

  const trackDishUpdated = useCallback(
    (props: DishEventProps) => {
      track(ANALYTICS_EVENTS.DISH_UPDATED, props);
    },
    [track]
  );

  const trackDishDeleted = useCallback(
    (props: DishEventProps) => {
      track(ANALYTICS_EVENTS.DISH_DELETED, props);
    },
    [track]
  );

  const trackDishStatusChange = useCallback(
    (dishId: string, dishName: string, newStatus: string) => {
      const event =
        newStatus === "published"
          ? ANALYTICS_EVENTS.DISH_PUBLISHED
          : newStatus === "archived"
            ? ANALYTICS_EVENTS.DISH_ARCHIVED
            : ANALYTICS_EVENTS.DISH_UPDATED;
      track(event, { dishId, dishName, status: newStatus });
    },
    [track]
  );

  const trackDishSearch = useCallback(
    (props: SearchEventProps) => {
      track(ANALYTICS_EVENTS.DISHES_SEARCHED, props);
    },
    [track]
  );

  // Order events
  const trackOrderAction = useCallback(
    (
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
        | "cancel"
        | "reschedule",

      props: OrderEventProps
    ) => {
      const eventMap: Record<string, EventName> = {
        confirm: ANALYTICS_EVENTS.ORDER_CONFIRMED,
        reject: ANALYTICS_EVENTS.ORDER_REJECTED,
        propose_reschedule: ANALYTICS_EVENTS.ORDER_RESCHEDULE_PROPOSED,
        accept_reschedule: ANALYTICS_EVENTS.ORDER_RESCHEDULE_ACCEPTED,
        reject_reschedule: ANALYTICS_EVENTS.ORDER_RESCHEDULE_REJECTED,
        start_preparing: ANALYTICS_EVENTS.ORDER_PREPARATION_STARTED,
        mark_ready: ANALYTICS_EVENTS.ORDER_MARKED_READY,
        send_for_delivery: ANALYTICS_EVENTS.ORDER_SENT_FOR_DELIVERY,
        mark_delivered: ANALYTICS_EVENTS.ORDER_DELIVERED,
        mark_picked_up: ANALYTICS_EVENTS.ORDER_PICKED_UP,
        cancel: ANALYTICS_EVENTS.ORDER_CANCELLED,
        reschedule: ANALYTICS_EVENTS.ORDER_RESCHEDULE_PROPOSED,
      };
      track(eventMap[action], { ...props, action });
    },
    [track]
  );

  const trackOrderViewed = useCallback(
    (props: OrderEventProps) => {
      track(ANALYTICS_EVENTS.ORDER_VIEWED, props);
    },
    [track]
  );

  // Menu section events
  const trackMenuSectionCreated = useCallback(
    (props: MenuSectionEventProps) => {
      track(ANALYTICS_EVENTS.MENU_SECTION_CREATED, props);
    },
    [track]
  );

  const trackMenuSectionUpdated = useCallback(
    (props: MenuSectionEventProps) => {
      track(ANALYTICS_EVENTS.MENU_SECTION_UPDATED, props);
    },
    [track]
  );

  const trackMenuSectionDeleted = useCallback(
    (props: MenuSectionEventProps) => {
      track(ANALYTICS_EVENTS.MENU_SECTION_DELETED, props);
    },
    [track]
  );

  const trackMenuSectionToggled = useCallback(
    (props: MenuSectionEventProps) => {
      track(ANALYTICS_EVENTS.MENU_SECTION_TOGGLED, props);
    },
    [track]
  );

  // Modifier group events
  const trackModifierGroupCreated = useCallback(
    (props: ModifierGroupEventProps) => {
      track(ANALYTICS_EVENTS.MODIFIER_GROUP_CREATED, props);
    },
    [track]
  );

  const trackModifierGroupUpdated = useCallback(
    (props: ModifierGroupEventProps) => {
      track(ANALYTICS_EVENTS.MODIFIER_GROUP_UPDATED, props);
    },
    [track]
  );

  const trackModifierGroupDeleted = useCallback(
    (props: ModifierGroupEventProps) => {
      track(ANALYTICS_EVENTS.MODIFIER_GROUP_DELETED, props);
    },
    [track]
  );

  // Profile events
  const trackProfileUpdated = useCallback(
    (props: ProfileEventProps) => {
      track(ANALYTICS_EVENTS.PROFILE_UPDATED, props);
    },
    [track]
  );

  const trackAvailabilityChanged = useCallback(
    (available: boolean) => {
      track(ANALYTICS_EVENTS.PROFILE_AVAILABILITY_CHANGED, { available });
    },
    [track]
  );

  const trackAutoAcceptChanged = useCallback(
    (autoAcceptOrders: boolean) => {
      track(ANALYTICS_EVENTS.PROFILE_AUTO_ACCEPT_CHANGED, { autoAcceptOrders });
    },
    [track]
  );

  // Account events
  const trackAccountUpdated = useCallback(
    (fields: string[]) => {
      track(ANALYTICS_EVENTS.ACCOUNT_UPDATED, { updatedFields: fields });
    },
    [track]
  );

  // Address events
  const trackAddressCreated = useCallback(() => {
    track(ANALYTICS_EVENTS.ADDRESS_CREATED);
  }, [track]);

  const trackAddressUpdated = useCallback(() => {
    track(ANALYTICS_EVENTS.ADDRESS_UPDATED);
  }, [track]);

  // Upload events
  const trackImageUploaded = useCallback(
    (props: UploadEventProps) => {
      track(ANALYTICS_EVENTS.IMAGE_UPLOADED, props);
    },
    [track]
  );

  const trackImageUploadFailed = useCallback(
    (props: UploadEventProps) => {
      track(ANALYTICS_EVENTS.IMAGE_UPLOAD_FAILED, props);
    },
    [track]
  );

  // Stripe events
  const trackStripeOnboardStarted = useCallback(() => {
    track(ANALYTICS_EVENTS.STRIPE_ONBOARD_STARTED);
  }, [track]);

  const trackStripeDashboardAccessed = useCallback(() => {
    track(ANALYTICS_EVENTS.STRIPE_DASHBOARD_ACCESSED);
  }, [track]);

  // Navigation events
  const trackPageView = useCallback(
    (pageName: string, properties?: Record<string, unknown>) => {
      track(ANALYTICS_EVENTS.PAGE_VIEWED, { pageName, ...properties });
    },
    [track]
  );

  const trackFeatureUsed = useCallback(
    (featureName: string, properties?: Record<string, unknown>) => {
      track(ANALYTICS_EVENTS.FEATURE_USED, { featureName, ...properties });
    },
    [track]
  );

  return {
    track,
    // Auth
    trackLogin,
    trackLogout,
    trackPasswordReset,
    trackPasswordChanged,
    // Dishes
    trackDishCreated,
    trackDishUpdated,
    trackDishDeleted,
    trackDishStatusChange,
    trackDishSearch,
    // Orders
    trackOrderAction,
    trackOrderViewed,
    // Menu Sections
    trackMenuSectionCreated,
    trackMenuSectionUpdated,
    trackMenuSectionDeleted,
    trackMenuSectionToggled,
    // Modifier Groups
    trackModifierGroupCreated,
    trackModifierGroupUpdated,
    trackModifierGroupDeleted,
    // Profile
    trackProfileUpdated,
    trackAvailabilityChanged,
    trackAutoAcceptChanged,
    // Account
    trackAccountUpdated,
    // Address
    trackAddressCreated,
    trackAddressUpdated,
    // Uploads
    trackImageUploaded,
    trackImageUploadFailed,
    // Stripe
    trackStripeOnboardStarted,
    trackStripeDashboardAccessed,
    // Navigation
    trackPageView,
    trackFeatureUsed,
  };
}
