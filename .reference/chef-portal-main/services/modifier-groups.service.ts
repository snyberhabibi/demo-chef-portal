import { http, type ApiResponse } from "@/lib/http-client";
import { endpoints } from "@/config/endpoints";

export interface ModifierGroup {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface CreateModifierGroupData {
  name: string;
  description?: string;
  chefUser?: string;
}

export interface UpdateModifierGroupData {
  name?: string;
  description?: string;
}

class ModifierGroupsService {
  private readonly basePath = endpoints.modifierGroups.base;

  async getModifierGroups(): Promise<ApiResponse<ModifierGroup[]>> {
    return http.get<ModifierGroup[]>(this.basePath);
  }

  async getModifierGroupById(id: string): Promise<ApiResponse<ModifierGroup>> {
    return http.get<ModifierGroup>(endpoints.modifierGroups.get(id));
  }

  async createModifierGroup(
    data: CreateModifierGroupData
  ): Promise<ApiResponse<ModifierGroup>> {
    return http.post<ModifierGroup>(endpoints.modifierGroups.create, data);
  }

  async updateModifierGroup(
    id: string,
    data: UpdateModifierGroupData
  ): Promise<ApiResponse<ModifierGroup>> {
    return http.put<ModifierGroup>(endpoints.modifierGroups.update(id), data);
  }

  async deleteModifierGroup(id: string): Promise<ApiResponse<void>> {
    return http.delete<void>(endpoints.modifierGroups.delete(id));
  }
}

export const modifierGroupsService = new ModifierGroupsService();
