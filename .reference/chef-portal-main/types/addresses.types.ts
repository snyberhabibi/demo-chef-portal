export interface Address {
  id: string;
  label: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  instructions?: string;
  isDefault: boolean;
  isActive: boolean;
  latitude: number;
  longitude: number;
}

export interface CreateAddressRequest {
  label: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  instructions?: string;
  isDefault: boolean;
  isActive: boolean;
  latitude: number;
  longitude: number;
}

export interface UpdateAddressRequest {
  id: string;
  label?: string;
  street?: string;
  apartment?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  instructions?: string;
  pickupInstructions?: string;
  isDefault?: boolean;
  isActive?: boolean;
  latitude?: number;
  longitude?: number;
  googlePlaceId?: string;
}

export interface AddressAutocompleteResponse {
  suggestions: AddressSuggestion[];
}

export interface AddressSuggestion {
  street_line: string;
  secondary?: string;
  city: string;
  state: string;
  zipcode: string;
  entries?: number;
}

export interface AddressSearchResult {
  placeId: string;
  description: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

// Legacy types for backward compatibility (kept for existing code)
export interface CreateAddressData {
  label: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  fullAddress: string;
  latitude?: number;
  longitude?: number;
  googlePlaceId?: string;
  isDefault?: boolean;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  id: string;
  pickupInstructions?: string;
}

// API Response structure for single address
export interface AddressApiResponse {
  address: {
    street: string;
    apartment: string | null;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
}

// Response for single address (since each chef has only one address)
export interface AddressResponse {
  address: {
    street: string;
    apartment: string | null;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  pickupInstructions?: string | null;
}

