import { http, type ApiResponse } from "@/lib/http-client";
import { endpoints } from "@/config/endpoints";
import type {
  ChefProfileApiResponse,
  UpdateChefProfileData,
} from "@/types/chef-profile.types";

// Re-export types for backward compatibility
export type {
  ChefProfileApiResponse,
  ChefProfile,
  AvailabilitySchedule,
  Achievement,
  UpdateChefProfileData,
  Timezone,
  Weekday,
  ChefTag,
  SocialMediaLinks,
  ChefAddress,
  ChefPickup,
} from "@/types/chef-profile.types";

class ChefProfileService {
  async getChefProfile(): Promise<ApiResponse<ChefProfileApiResponse>> {
    return http.get<ChefProfileApiResponse>(endpoints.chefProfile.get);
  }

  async updateChefProfile(
    data: UpdateChefProfileData
  ): Promise<ApiResponse<ChefProfileApiResponse>> {
    // Transform frontend shape to backend shape:
    // - availabilitySchedule[] -> availability[] (if provided)
    // - Remove fields that shouldn't be sent (slug, socialMediaLinks, marketingDescription)
    const payload: Record<string, unknown> = {};

    // Copy allowed fields
    if (data.businessName !== undefined)
      payload.businessName = data.businessName;
    if (data.bio !== undefined) payload.bio = data.bio;
    if (data.story !== undefined) payload.story = data.story;
    if (data.whatInspiresMe !== undefined)
      payload.whatInspiresMe = data.whatInspiresMe;
    if (data.experience !== undefined) payload.experience = data.experience;
    if (data.cuisines !== undefined) payload.cuisines = data.cuisines;
    if (data.bannerImage !== undefined) {
      payload.bannerImage = data.bannerImage;
      console.log(
        "[ChefProfileService] Updating bannerImage:",
        data.bannerImage
      );
    }
    if (data.customSections !== undefined)
      payload.customSections = data.customSections;
    if (data.licenseNumber !== undefined)
      payload.licenseNumber = data.licenseNumber;
    if (data.taxId !== undefined) payload.taxId = data.taxId;
    if (data.timezone !== undefined) payload.timezone = data.timezone;
    if (data.available !== undefined) payload.available = data.available;
    if (data.autoAcceptOrders !== undefined)
      payload.autoAcceptOrders = data.autoAcceptOrders;
    if (data.achievements !== undefined)
      payload.achievements = data.achievements;
    if (data.pickup !== undefined) payload.pickup = data.pickup;
    if (data.pickupInstructions !== undefined)
      payload.pickupInstructions = data.pickupInstructions;

    // Transform availabilitySchedule to availability if provided
    if (Array.isArray(data.availabilitySchedule)) {
      payload.availability = data.availabilitySchedule.map((s) => ({
        weekday: s.weekday,
        startTime: s.startTime,
        endTime: s.endTime,
        ...(s.id !== null && s.id !== undefined ? { id: s.id } : {}),
      }));
    } else if (data.availability !== undefined) {
      // If availability is directly provided, use it
      payload.availability = data.availability;
    }

    console.log("[ChefProfileService] Payload being sent:", payload);
    return http.put<ChefProfileApiResponse>(
      endpoints.chefProfile.update,
      payload
    );
  }
}

export const chefProfileService = new ChefProfileService();
