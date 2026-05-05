import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  chefProfileService,
  type ChefProfile,
  type AvailabilitySchedule,
  type Achievement,
  type UpdateChefProfileData,
  type ChefProfileApiResponse,
  type ChefTag,
} from "@/services/chef-profile.service";
import { useAnalytics } from "@/hooks/use-analytics";

export function useChefProfile() {
  return useQuery({
    queryKey: ["chef-profile"],
    queryFn: () => chefProfileService.getChefProfile(),
    // API returns direct ChefProfileApiResponse object (not wrapped)
    // Map to normalized ChefProfile for consumers
    select: (response) => {
      const raw = response.data as ChefProfileApiResponse;

      // Normalize cuisines to string[]
      const cuisines: string[] = Array.isArray(raw.cuisines)
        ? raw.cuisines.map((c) => {
            if (typeof c === "string") return c;
            if (c && typeof c === "object") {
              const obj = c as Record<string, unknown>;
              if (typeof obj.id === "string") return obj.id;
              if (typeof obj.slug === "string") return obj.slug;
              if (typeof obj.name === "string") return obj.name;
            }
            return String(c);
          })
        : [];

      // Normalize customSections to string[]
      const customSections: string[] = Array.isArray(raw.customSections)
        ? raw.customSections.map((cs) => {
            if (typeof cs === "string") return cs;
            if (cs && typeof cs === "object") {
              const obj = cs as Record<string, unknown>;
              if (typeof obj.id === "string") return obj.id;
              if (typeof obj.slug === "string") return obj.slug;
            }
            return String(cs);
          })
        : [];

      // Normalize availability (backend: availability[]) to availabilitySchedule[]
      const availabilitySchedule: AvailabilitySchedule[] = Array.isArray(
        raw.availability
      )
        ? raw.availability.map((a) => ({
            id: a.id ?? null,
            weekday: a.weekday,
            startTime: a.startTime,
            endTime: a.endTime,
          }))
        : [];

      // Normalize bannerImage to a media ID (for API updates) and extract URL (for display)
      // API may return an object with both id and publicUrl, or just a string (ID or URL)
      let bannerImage: string | null | undefined;
      let bannerImageUrl: string | null | undefined;

      if (raw.bannerImage === null || raw.bannerImage === undefined) {
        bannerImage = null;
        bannerImageUrl = null;
      } else if (typeof raw.bannerImage === "string") {
        // If it's a string, check if it's a URL or ID
        const isUrl =
          raw.bannerImage.startsWith("http://") ||
          raw.bannerImage.startsWith("https://") ||
          raw.bannerImage.startsWith("/");
        if (isUrl) {
          // It's a URL - use for display, but we don't have the ID
          bannerImage = null;
          bannerImageUrl = raw.bannerImage;
        } else {
          // It's likely an ID
          bannerImage = raw.bannerImage;
          bannerImageUrl = null;
        }
      } else if (raw.bannerImage && typeof raw.bannerImage === "object") {
        const obj = raw.bannerImage as Record<string, unknown>;
        // Extract ID for form updates (check multiple possible field names)
        const idValue =
          (obj.id as string | undefined) ||
          (obj.chefMediaId as string | undefined) ||
          (obj.mediaId as string | undefined);

        bannerImage =
          idValue && typeof idValue === "string" && idValue.length > 0
            ? idValue
            : null;

        // Extract URL for display (prioritize publicUrl field)
        bannerImageUrl =
          (obj.publicUrl as string | undefined) ||
          (obj.imageUrl as string | undefined) ||
          (obj.url as string | undefined) ||
          (obj.src as string | undefined) ||
          null;

        // Debug logging if ID extraction fails
        if (!bannerImage && obj) {
          console.warn(
            "[useChefProfile] Could not extract bannerImage ID from object:",
            obj
          );
        }
      }

      // Normalize achievements to typed array
      const achievements: Achievement[] = Array.isArray(raw.achievements)
        ? raw.achievements
            .filter(
              (a) => a && typeof a === "object" && typeof a.title === "string"
            )
            .map((a) => ({
              id: a.id ?? null,
              title: a.title,
              description: a.description ?? undefined,
              startDate: a.startDate ?? undefined,
              endDate: a.endDate ?? undefined,
            }))
        : [];

      // Normalize tags (read-only admin field)
      const tags: ChefTag[] | null = Array.isArray(raw.tags) ? raw.tags : null;

      // Build normalized profile
      const normalized: ChefProfile = {
        id: raw.id,
        businessName: raw.businessName,
        slug: raw.slug,
        bio: raw.bio ?? undefined,
        story: raw.story ?? undefined,
        whatInspiresMe: raw.whatInspiresMe ?? undefined,
        experience: raw.experience ?? undefined,
        cuisines,
        bannerImage,
        bannerImageUrl,
        customSections,
        licenseNumber: raw.licenseNumber ?? undefined,
        taxId: raw.taxId ?? undefined,
        timezone: raw.timezone,
        available: raw.available,
        adminAvailable: raw.adminAvailable,
        availabilitySchedule,
        autoAcceptOrders: raw.autoAcceptOrders,
        tags,
        isFeatured: raw.isFeatured ?? undefined,
        achievements,
        stripeConnectAccountId: raw.stripeConnectAccountId ?? undefined,
        stripeConnectOnboardingStatus:
          raw.stripeConnectOnboardingStatus ?? undefined,
        stripeConnectAccountStatus: raw.stripeConnectAccountStatus ?? undefined,
        stripeConnectOnboardingUrl: raw.stripeConnectOnboardingUrl ?? undefined,
        address: raw.address ?? undefined,
        pickup: raw.pickup ?? null,
        pickupInstructions: raw.pickupInstructions ?? undefined,
        // Legacy fields not in API - set to undefined
        socialMediaLinks: undefined,
        marketingDescription: undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      };

      return normalized;
    },
  });
}

export function useUpdateChefProfile() {
  const queryClient = useQueryClient();
  const { trackProfileUpdated, trackAvailabilityChanged, trackAutoAcceptChanged } = useAnalytics();

  return useMutation({
    mutationFn: (data: UpdateChefProfileData) =>
      chefProfileService.updateChefProfile(data).then((response) => ({ response, payload: data })),
    onSuccess: ({ payload }) => {
      // Track profile update with relevant fields
      const updatedFields = Object.keys(payload).filter(
        (key) => payload[key as keyof UpdateChefProfileData] !== undefined
      );
      trackProfileUpdated({ field: updatedFields.join(", ") });

      // Track specific important changes (only when boolean, not null)
      if (typeof payload.available === "boolean") {
        trackAvailabilityChanged(payload.available);
      }
      if (typeof payload.autoAcceptOrders === "boolean") {
        trackAutoAcceptChanged(payload.autoAcceptOrders);
      }

      queryClient.invalidateQueries({ queryKey: ["chef-profile"] });
    },
    onError: (error: unknown) => {
      // Error is already handled by http-client and will throw with proper message
      // This is here for any additional error handling if needed
      console.error("Failed to update chef profile:", error);
    },
  });
}

// Hook for partial updates - only updates specific fields
export function useUpdateChefProfilePartial() {
  const queryClient = useQueryClient();
  const { trackProfileUpdated, trackAvailabilityChanged, trackAutoAcceptChanged } = useAnalytics();

  return useMutation({
    mutationFn: (data: UpdateChefProfileData) =>
      chefProfileService.updateChefProfile(data).then((response) => ({ response, payload: data })),
    onSuccess: ({ payload }) => {
      // Track profile update with relevant fields
      const updatedFields = Object.keys(payload).filter(
        (key) => payload[key as keyof UpdateChefProfileData] !== undefined
      );
      trackProfileUpdated({ field: updatedFields.join(", ") });

      // Track specific important changes (only when boolean, not null)
      if (typeof payload.available === "boolean") {
        trackAvailabilityChanged(payload.available);
      }
      if (typeof payload.autoAcceptOrders === "boolean") {
        trackAutoAcceptChanged(payload.autoAcceptOrders);
      }

      queryClient.invalidateQueries({ queryKey: ["chef-profile"] });
    },
    onError: (error: unknown) => {
      console.error("Failed to update chef profile:", error);
    },
  });
}
