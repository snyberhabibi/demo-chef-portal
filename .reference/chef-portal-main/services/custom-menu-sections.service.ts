import { http, type ApiResponse } from "@/lib/http-client";
import { endpoints } from "@/config/endpoints";

// Transformed dish structure from API (used in single section response)
export interface CustomMenuSectionDish {
  id: string;
  name: string;
  description: string;
  status: "draft" | "published" | "archived";
  image: string | null;
  portionSize: {
    id: string;
    size: string;
    price: number;
    portionLabel: {
      id: string;
      label: string;
      singularName: string;
      pluralName: string;
    } | null;
  } | null;
}

// Custom menu section from listing API
export interface CustomMenuSectionListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  dishCount: number;
  dishes: string[]; // Array of dish IDs
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Custom menu section from single section API (by ID)
export interface CustomMenuSection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  dishes: CustomMenuSectionDish[]; // Array of transformed dish objects
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomMenuSectionData {
  name: string;
  description?: string | null;
  dishes: string[];
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCustomMenuSectionData {
  name?: string;
  description?: string | null;
  dishes?: string[];
  sortOrder?: number;
  isActive?: boolean;
}

// Paginated API Response (matches backend structure)
export interface CustomMenuSectionsApiResponse {
  docs: CustomMenuSectionListItem[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Frontend response format
export interface CustomMenuSectionsResponse {
  data: CustomMenuSectionListItem[];
  total: number;
}

class CustomMenuSectionsService {
  private readonly basePath = endpoints.customMenuSections.base;

  async getCustomMenuSections(): Promise<
    ApiResponse<CustomMenuSectionsResponse>
  > {
    // API returns paginated response: { docs: [...], totalDocs: number, ... }
    const response = await http.get<CustomMenuSectionsApiResponse>(
      this.basePath
    );

    // Transform paginated response to expected structure
    return {
      ...response,
      data: {
        data: response.data?.docs || [],
        total: response.data?.totalDocs || 0,
      },
    };
  }

  async getCustomMenuSectionById(
    id: string
  ): Promise<ApiResponse<CustomMenuSection>> {
    return http.get<CustomMenuSection>(endpoints.customMenuSections.get(id));
  }

  async createCustomMenuSection(
    data: CreateCustomMenuSectionData
  ): Promise<ApiResponse<CustomMenuSection>> {
    return http.post<CustomMenuSection>(
      endpoints.customMenuSections.create,
      data
    );
  }

  async updateCustomMenuSection(
    data: UpdateCustomMenuSectionData & { id: string }
  ): Promise<ApiResponse<CustomMenuSection>> {
    const { id, ...updateData } = data;
    return http.put<CustomMenuSection>(
      endpoints.customMenuSections.update(id),
      updateData
    );
  }

  async deleteCustomMenuSection(id: string): Promise<ApiResponse<void>> {
    return http.delete<void>(endpoints.customMenuSections.delete(id));
  }
}

export const customMenuSectionsService = new CustomMenuSectionsService();
