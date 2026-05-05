import { http, type ApiResponse } from "@/lib/http-client";
import { endpoints } from "@/config/endpoints";
import { mediaService } from "./media.service";

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  phone?: string | null;
  avatar?: string | {
    id?: string;
    url?: string;
    filename?: string;
    size?: number;
    width?: number;
    height?: number;
    mimeType?: string;
  } | null;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateUserAccountData {
  name?: string;
  phone?: string | null;
  avatar?: File | string | null;
  oldPassword?: string;
  newPassword?: string;
}

class UserAccountService {
  async getUserAccount(): Promise<ApiResponse<UserAccount>> {
    return http.get<UserAccount>(endpoints.userAccount.get);
  }

  async updateUserAccount(
    data: UpdateUserAccountData
  ): Promise<ApiResponse<UserAccount>> {
    // Prepare update payload
    const updatePayload: {
      name?: string;
      phone?: string | null;
      avatar?: string | null;
      oldPassword?: string;
      newPassword?: string;
    } = {};

    // Add name if provided
    if (data.name !== undefined) {
      updatePayload.name = data.name;
    }

    // Add phone if provided
    if (data.phone !== undefined) {
      updatePayload.phone = data.phone;
    }

    // Handle avatar: upload file first if it's a File, then use UUID
    if (data.avatar instanceof File) {
      // Upload file to get UUID
      const avatarFile = data.avatar;
      const { publicUrl, filename } = await mediaService.uploadFile(
        avatarFile,
        undefined,
        "chef"
      );

      // Create chef media record to get UUID
      const mediaResponse = await mediaService.createChefMedia({
        publicUrl,
        filename,
        mimeType: avatarFile.type,
        filesize: avatarFile.size,
        alt: "User avatar",
      });

      if (!mediaResponse.data?.id) {
        throw new Error("Failed to create media record");
      }

      updatePayload.avatar = mediaResponse.data.id;
    } else if (data.avatar === null || data.avatar === "") {
      // Remove avatar
      updatePayload.avatar = null;
    } else if (typeof data.avatar === "string") {
      // Avatar is already a UUID or URL
      updatePayload.avatar = data.avatar;
    }

    // Add password fields if provided
    if (data.oldPassword && data.newPassword) {
      updatePayload.oldPassword = data.oldPassword;
      updatePayload.newPassword = data.newPassword;
    }

    // Use PUT method as per API guide
    return http.put<UserAccount>(endpoints.userAccount.update, updatePayload);
  }

  async forceUnlock(): Promise<ApiResponse<{ message: string }>> {
    return http.post<{ message: string }>(endpoints.userAccount.forceUnlock);
  }
}

export const userAccountService = new UserAccountService();

