/**
 * Authentication Types
 */

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface Avatar {
  id: string;
  alt: string;
  prefix: string;
  updatedAt: string;
  createdAt: string;
  url: string;
  thumbnailURL: string | null;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  focalX: number;
  focalY: number;
}

export interface UserAddress {
  id: string;
  label: string;
  street: string;
  apartment: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  instructions: string | null;
  isDefault: boolean;
  updatedAt: string;
  createdAt: string;
}

/**
 * User profile from /me endpoint
 */
export interface User {
  id: string;
  avatar: Avatar | null;
  email: string;
  phone: string | null;
  name: string;
  role: "chef" | "admin" | string;
  status?: string;
  addresses: UserAddress[];
}

export interface MeResponse {
  success: boolean;
  user: User | null;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<import("@/lib/http-client").ApiResponse<ForgotPasswordResponse>>;
  resetPassword: (data: ResetPasswordData) => Promise<import("@/lib/http-client").ApiResponse<ResetPasswordResponse>>;
}

