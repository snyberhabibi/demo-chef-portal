/**
 * Chef Profile types
 */

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
}

// Timezone values allowed by the API
export type Timezone =
  | "America/New_York"
  | "America/Chicago"
  | "America/Denver"
  | "America/Los_Angeles"
  | "America/Anchorage"
  | "Pacific/Honolulu";

// Weekday values allowed by the API
export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

// Tags that can be assigned by admin
export type ChefTag = "new" | "promoted" | "special" | "top";

// Address returned by chefs/me
export interface ChefAddress {
  street: string;
  apartment?: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
}

// Pickup settings from chefs/me
export interface ChefPickup {
  enabled: boolean;
  adminAllowed: boolean;
}

// API response shape - direct chef profile object (not wrapped)
export interface ChefProfileApiResponse {
  id: string;
  user: string | Record<string, unknown>; // Can be string ID or User object
  businessName: string;
  slug: string | null;
  bio: string | null;
  story: string | null;
  whatInspiresMe: string | null;
  experience: number | null;
  cuisines: (string | Record<string, unknown>)[] | null; // Can be string IDs or Cuisine objects
  bannerImage: string | Record<string, unknown> | null; // Can be string ID or ChefMedia object
  customSections: (string | Record<string, unknown>)[] | null; // Can be string IDs or CustomSection objects
  licenseNumber: string | null;
  taxId: string | null;
  timezone: Timezone;
  available: boolean;
  adminAvailable: boolean;
  availability: Array<{
    weekday: Weekday;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    id: string | null;
  }> | null;
  autoAcceptOrders: boolean | null;
  tags: ChefTag[] | null; // Admin-only, read-only
  isFeatured: boolean | null; // Admin-only, read-only
  achievements: Array<{
    title: string;
    description: string | null;
    startDate: string | null; // ISO date
    endDate: string | null; // ISO date
    id: string | null;
  }> | null;
  stripeConnectAccountId?: string | null; // Stripe Connect Express account ID
  stripeConnectOnboardingStatus?:
    | "not_started"
    | "in_progress"
    | "completed"
    | "failed"
    | null; // Stripe Connect onboarding status
  stripeConnectAccountStatus?:
    | "pending"
    | "restricted"
    | "enabled"
    | "disabled"
    | null; // Stripe Connect account status
  stripeConnectOnboardingUrl?: string | null; // Last Stripe Connect onboarding URL
  address?: ChefAddress | null; // Chef address from chefs/me
  pickup?: ChefPickup | null; // Pickup settings from chefs/me
  pickupInstructions?: string | null; // Pickup instructions
  updatedAt: string; // ISO date
  createdAt: string; // ISO date
}

// Frontend-normalized ChefProfile interface
export interface ChefProfile {
  id: string;
  businessName: string;
  slug: string | null;
  bio?: string | null;
  story?: string | null;
  whatInspiresMe?: string | null;
  experience?: number | null;
  cuisines: string[]; // Normalized to string IDs
  bannerImage?: string | null; // Normalized to media ID (for API updates)
  bannerImageUrl?: string | null; // URL for display purposes (extracted from API response)
  customSections: string[]; // Normalized to string IDs
  licenseNumber?: string | null;
  taxId?: string | null;
  timezone?: Timezone;
  available: boolean;
  adminAvailable: boolean;
  availabilitySchedule: AvailabilitySchedule[];
  autoAcceptOrders: boolean | null;
  tags?: ChefTag[] | null; // Read-only admin field
  isFeatured?: boolean | null; // Read-only admin field
  achievements: Achievement[];
  stripeConnectAccountId?: string | null; // Stripe Connect Express account ID
  stripeConnectOnboardingStatus?:
    | "not_started"
    | "in_progress"
    | "completed"
    | "failed"
    | null; // Stripe Connect onboarding status
  stripeConnectAccountStatus?:
    | "pending"
    | "restricted"
    | "enabled"
    | "disabled"
    | null; // Stripe Connect account status
  stripeConnectOnboardingUrl?: string | null; // Last Stripe Connect onboarding URL
  address?: ChefAddress | null; // Chef address from chefs/me
  pickup?: ChefPickup | null; // Pickup settings from chefs/me
  pickupInstructions?: string | null; // Pickup instructions
  socialMediaLinks?: SocialMediaLinks; // Not in API, kept for backward compatibility
  marketingDescription?: string; // Not in API, kept for backward compatibility
  createdAt: string;
  updatedAt?: string;
}

export interface AvailabilitySchedule {
  id: string | null;
  weekday: Weekday;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface Achievement {
  id: string | null;
  title: string;
  description?: string | null;
  startDate?: string | null; // ISO date
  endDate?: string | null; // ISO date
}

// Update payload - matches API request format
export interface UpdateChefProfileData {
  businessName?: string;
  bio?: string | null;
  story?: string | null;
  whatInspiresMe?: string | null;
  experience?: number | null;
  cuisines?: string[];
  bannerImage?: string | null; // Chef-media ID string or null
  customSections?: string[];
  licenseNumber?: string | null;
  taxId?: string | null;
  timezone?: Timezone;
  available?: boolean | null;
  availability?: Array<{
    weekday: Weekday;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    id?: string | null;
  }>;
  autoAcceptOrders?: boolean | null;
  achievements?: Array<{
    title: string;
    description?: string | null;
    startDate?: string | null; // ISO date
    endDate?: string | null; // ISO date
    id?: string | null;
  }>;
  pickup?: { enabled: boolean }; // Only 'enabled' is writable by chefs
  pickupInstructions?: string | null;
  // Legacy fields kept for backward compatibility but not sent to API
  slug?: string | null; // System-managed, not updatable
  socialMediaLinks?: SocialMediaLinks; // Not in API
  marketingDescription?: string; // Not in API
  availabilitySchedule?: AvailabilitySchedule[]; // Transformed to availability[]
}
