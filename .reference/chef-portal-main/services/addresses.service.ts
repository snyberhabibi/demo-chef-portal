import { endpoints } from "@/config/endpoints";
import { http, type ApiResponse } from "@/lib/http-client";
import type {
  AddressResponse,
  AddressSearchResult,
  CreateAddressData,
  CreateAddressRequest,
  AddressSuggestion,
  AddressAutocompleteResponse,
  UpdateAddressData,
} from "@/types/addresses.types";

class AddressesService {
  private readonly basePath = endpoints.addresses.base;

  // Get the single address for the current chef
  async getAddress(): Promise<ApiResponse<AddressResponse>> {
    return http.get<AddressResponse>(this.basePath);
  }

  // Create or update address (both use PUT to the same endpoint)
  // The API uses PUT for both create and update operations
  async createOrUpdateAddress(
    data: CreateAddressData | UpdateAddressData
  ): Promise<ApiResponse<AddressResponse>> {
    // Extract address fields from CreateAddressData or UpdateAddressData
    // API expects: { id: "current", street, apartment, city, state, zipCode, country }

    // Validate required fields
    if (
      !data.street ||
      !data.city ||
      !data.state ||
      !data.zipCode ||
      !data.country
    ) {
      throw new Error(
        "Missing required address fields: street, city, state, zipCode, and country are required"
      );
    }

    // Check if pickupInstructions exists in the data
    const hasPickupInstructions =
      "pickupInstructions" in data &&
      data.pickupInstructions !== undefined;

    const requestBody: {
      id: string;
      street: string;
      apartment?: string | null;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      latitude?: number;
      longitude?: number;
      googlePlaceId?: string;
      pickupInstructions?: string | null;
    } = {
      id: "current",
      street: data.street!,
      apartment: data.apartment || null,
      city: data.city!,
      state: data.state!,
      zipCode: data.zipCode!,
      country: data.country!,
      ...(data.latitude !== undefined && { latitude: data.latitude }),
      ...(data.longitude !== undefined && { longitude: data.longitude }),
      ...(data.googlePlaceId && { googlePlaceId: data.googlePlaceId }),
      ...(hasPickupInstructions && {
        pickupInstructions:
          (data as UpdateAddressData).pickupInstructions || null,
      }),
    };

    return http.put<AddressResponse>(this.basePath, requestBody);
  }

  // Alias for backward compatibility
  async createAddress(
    data: CreateAddressData | CreateAddressRequest
  ): Promise<ApiResponse<AddressResponse>> {
    return this.createOrUpdateAddress(data as CreateAddressData);
  }

  async updateAddress(
    data: UpdateAddressData
  ): Promise<ApiResponse<AddressResponse>> {
    return this.createOrUpdateAddress(data);
  }

  /**
   * Search addresses using backend API autocomplete endpoint
   */
  async searchAddresses(query: string): Promise<AddressSearchResult[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    try {
      const response = await http.get<AddressAutocompleteResponse>(
        `${endpoints.addressAutocomplete}?search=${encodeURIComponent(query)}`
      );

      // Map AddressSuggestion to AddressSearchResult
      return response.data.suggestions.map((suggestion, index) => {
        const fullAddress = this.formatAddress(suggestion);
        return {
          placeId: `address-${suggestion.street_line}-${suggestion.city}-${suggestion.zipcode}-${index}`,
          description: fullAddress,
          street: suggestion.street_line,
          city: suggestion.city,
          state: suggestion.state,
          zipCode: suggestion.zipcode,
          country: "US",
        };
      });
    } catch (error) {
      console.error("Error searching addresses:", error);
      throw error;
    }
  }

  /**
   * Format address into a full address string
   */
  private formatAddress(address: AddressSuggestion): string {
    const parts = [
      address.street_line,
      address.secondary,
      address.city,
      `${address.state} ${address.zipcode}`,
      "US",
    ].filter(Boolean);

    return parts.join(", ");
  }
}

export const addressesService = new AddressesService();
