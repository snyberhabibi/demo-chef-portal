import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressesService } from "@/services/addresses.service";
import type {
  Address,
  CreateAddressData,
  UpdateAddressData,
} from "@/types/addresses.types";
import { useAnalytics } from "@/hooks/use-analytics";

// Helper function to construct fullAddress from address fields
function constructFullAddress(address: Address): string {
  const parts = [
    address.street,
    address.apartment,
    address.city,
    `${address.state} ${address.zipCode}`,
    address.country,
  ].filter(Boolean);
  return parts.join(", ");
}

// Extend Address type to include fullAddress and pickupInstructions
type AddressWithFullAddress = Address & { 
  fullAddress: string;
  pickupInstructions?: string | null;
};

// Get single address for the chef
export function useAddress() {
  return useQuery({
    queryKey: ["address"],
    queryFn: async () => {
      const response = await addressesService.getAddress();
      const addressData = response.data.address;

      // Convert API response to Address format with required fields
      const address: Address = {
        id: "current",
        label: "My Address",
        street: addressData.street,
        apartment: addressData.apartment || undefined,
        city: addressData.city,
        state: addressData.state,
        zipCode: addressData.zipCode,
        country: addressData.country,
        isDefault: true,
        isActive: true,
        latitude: addressData.latitude ?? 0,
        longitude: addressData.longitude ?? 0,
      };

      // Add fullAddress and pickupInstructions
      const addressWithFullAddress: AddressWithFullAddress = {
        ...address,
        fullAddress: constructFullAddress(address),
        pickupInstructions: response.data.pickupInstructions || null,
      };

      return addressWithFullAddress;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useAddressSearch(query: string) {
  return useQuery({
    queryKey: ["addresses", "search", query],
    queryFn: async () => {
      return await addressesService.searchAddresses(query);
    },
    enabled: query.length > 2, // Only search if query is longer than 2 characters
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  const { trackAddressCreated } = useAnalytics();

  return useMutation({
    mutationFn: async (data: CreateAddressData) => {
      // Service method uses PUT to create/update address
      const response = await addressesService.createAddress(data);
      const addressData = response.data.address;

      // Convert API response to Address format
      // Fall back to the request data lat/lng if the API response omits them
      const address: Address = {
        id: "current",
        label: "My Address",
        street: addressData.street,
        apartment: addressData.apartment || undefined,
        city: addressData.city,
        state: addressData.state,
        zipCode: addressData.zipCode,
        country: addressData.country,
        isDefault: true,
        isActive: true,
        latitude: addressData.latitude ?? data.latitude ?? 0,
        longitude: addressData.longitude ?? data.longitude ?? 0,
      };

      // Add fullAddress and pickupInstructions
      const addressWithFullAddress: AddressWithFullAddress = {
        ...address,
        fullAddress: constructFullAddress(address),
        pickupInstructions: response.data.pickupInstructions || null,
      };

      return addressWithFullAddress;
    },
    onSuccess: () => {
      trackAddressCreated();
      queryClient.invalidateQueries({ queryKey: ["address"] });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  const { trackAddressUpdated } = useAnalytics();

  return useMutation({
    mutationFn: async (data: UpdateAddressData) => {
      // Service method uses PUT to create/update address
      const response = await addressesService.updateAddress(data);
      const addressData = response.data.address;

      // Convert API response to Address format
      // Fall back to the request data lat/lng if the API response omits them
      const address: Address = {
        id: "current",
        label: data.label || "My Address",
        street: addressData.street,
        apartment: addressData.apartment || undefined,
        city: addressData.city,
        state: addressData.state,
        zipCode: addressData.zipCode,
        country: addressData.country,
        isDefault: true,
        isActive: true,
        latitude: addressData.latitude ?? data.latitude ?? 0,
        longitude: addressData.longitude ?? data.longitude ?? 0,
      };

      // Add fullAddress and pickupInstructions
      const addressWithFullAddress: AddressWithFullAddress = {
        ...address,
        fullAddress: constructFullAddress(address),
        pickupInstructions: response.data.pickupInstructions || null,
      };

      return addressWithFullAddress;
    },
    onSuccess: () => {
      trackAddressUpdated();
      queryClient.invalidateQueries({ queryKey: ["address"] });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}
