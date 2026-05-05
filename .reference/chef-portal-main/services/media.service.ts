import { http, type ApiResponse } from "@/lib/http-client";
import { endpoints } from "@/config/endpoints";

export type MediaType = "dish" | "chef" | "target";

export interface PresignedUrlRequest {
  directory: "chef" | "chef-media" | "dish" | "dish-template" | "media";
  fileName: string;
  contentType?: string;
}

export interface PresignedUrlResponse {
  success: boolean;
  presignedUrl: string;
  key: string;
  publicUrl: string; // Storage URL to use after upload
  expiresIn: number; // URL expiration in seconds
  directory: string;
}

export interface CreateChefMediaRequest {
  publicUrl: string;
  filename: string;
  mimeType: string;
  filesize: number;
  alt: string;
  caption?: string;
}

export interface CreateTargetMediaRequest {
  imageUrl: string; // Backend expects 'imageUrl' not 'publicUrl'
  alt: string;
  caption?: string;
  targetId?: string; // Optional target ID to link the media
  targetType?: string; // Optional target type (e.g., 'chef-profile')
}

class MediaService {
  /**
   * Get a presigned URL for uploading a file
   */
  async getPresignedUrl(
    data: PresignedUrlRequest
  ): Promise<ApiResponse<PresignedUrlResponse>> {
    return http.post<PresignedUrlResponse>(
      endpoints.media.getPresignedUrl,
      data
    );
  }

  /**
   * Upload a file to storage using a presigned URL
   * @param presignedUrl The presigned URL to upload to
   * @param file The file to upload
   * @param onProgress Optional callback to track upload progress (0-100)
   */
  async uploadToPresignedUrl(
    presignedUrl: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          if (onProgress) {
            onProgress(100);
          }
          resolve();
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed: Network error"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload aborted"));
      });

      xhr.open("PUT", presignedUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  }

  /**
   * Upload a file: get presigned URL and upload to it
   * Returns the publicUrl to be used for creating dish media
   * @param file The file to upload
   * @param onProgress Optional callback to track upload progress (0-100)
   * @param directory Optional directory (default: "dish")
   */
  async uploadFile(
    file: File,
    onProgress?: (progress: number) => void,
    directory: "dish" | "chef" | "media" = "dish"
  ): Promise<{ publicUrl: string; key: string; filename: string }> {
    // Step 1: Get presigned URL
    const presignedResponse = await this.getPresignedUrl({
      directory,
      fileName: file.name,
      contentType: file.type,
    });

    if (!presignedResponse.data) {
      throw new Error("We couldn't upload your image. Please try again.");
    }

    const { presignedUrl, publicUrl, key } = presignedResponse.data;

    // Step 2: Upload file to presigned URL with progress tracking
    await this.uploadToPresignedUrl(presignedUrl, file, onProgress);

    const filename = key.split("/").pop() || file.name;
    return { publicUrl, key, filename };
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(
    files: File[]
  ): Promise<Array<{ publicUrl: string; key: string; filename: string }>> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  /**
   * Create dish media record via /api/dish-media (proxied to Payload).
   * Sends the publicUrl and filename from the presigned URL response.
   */
  async createDishMedia(data: {
    publicUrl: string;
    filename: string;
    mimeType: string;
    filesize: number;
    alt: string;
    caption?: string;
  }): Promise<ApiResponse<{ id: string; publicUrl: string; alt: string }>> {
    const response = await http.post<{
      doc: {
        id: string;
        alt?: string;
        caption?: string;
        filename?: string;
        url?: string;
      };
      message?: string;
    }>(endpoints.media.createDishMedia, {
      url: data.publicUrl,
      filename: data.filename,
      mimeType: data.mimeType,
      filesize: data.filesize,
      alt: data.alt,
      ...(data.caption && { caption: data.caption }),
    });

    if (response.data?.doc?.id) {
      const doc = response.data.doc;
      return {
        ...response,
        data: {
          id: doc.id,
          publicUrl: doc.url || data.publicUrl,
          alt: doc.alt || data.alt,
        },
      };
    }

    throw new Error("Your image was uploaded but we couldn't save the record. Please try uploading again.");
  }

  /**
   * Delete a dish media record by ID
   */
  async deleteDishMedia(id: string): Promise<ApiResponse<void>> {
    return http.delete<void>(endpoints.media.deleteDishMedia(id));
  }

  /**
   * Create chef media record via /api/chef-media (proxied to Payload).
   * Sends the same params as dish-media: url, filename, mimeType, filesize, alt.
   */
  async createChefMedia(
    data: CreateChefMediaRequest
  ): Promise<ApiResponse<{ id: string; publicUrl: string; alt: string }>> {
    const response = await http.post<{
      doc: {
        id: string;
        alt?: string;
        caption?: string;
        filename?: string;
        url?: string;
      };
      message?: string;
    }>(endpoints.media.createChefMedia, {
      url: data.publicUrl,
      filename: data.filename,
      mimeType: data.mimeType,
      filesize: data.filesize,
      alt: data.alt,
      ...(data.caption && { caption: data.caption }),
    });

    if (response.data?.doc?.id) {
      const doc = response.data.doc;
      return {
        ...response,
        data: {
          id: doc.id,
          publicUrl: doc.url || data.publicUrl,
          alt: doc.alt || data.alt,
        },
      };
    }

    throw new Error("Your image was uploaded but we couldn't save the record. Please try uploading again.");
  }

  /**
   * Delete a chef media record by ID
   */
  async deleteChefMedia(id: string): Promise<ApiResponse<void>> {
    return http.delete<void>(endpoints.media.deleteChefMedia(id));
  }

  /**
   * Upload a file for target media (e.g., chef profile banner)
   * Uses "chef" directory instead of "dish"
   */
  async uploadFileForTarget(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ publicUrl: string; key: string; filename: string }> {
    // Step 1: Get presigned URL with "chef" directory
    const presignedResponse = await this.getPresignedUrl({
      directory: "chef",
      fileName: file.name,
      contentType: file.type,
    });

    if (!presignedResponse.data) {
      throw new Error("We couldn't upload your image. Please try again.");
    }

    const { presignedUrl, publicUrl, key } = presignedResponse.data;

    // Step 2: Upload file to presigned URL with progress tracking
    await this.uploadToPresignedUrl(presignedUrl, file, onProgress);

    const filename = key.split("/").pop() || file.name;
    return { publicUrl, key, filename };
  }

  /**
   * Create target media record (for chef profile banner, etc.)
   */
  async createTargetMedia(
    data: CreateTargetMediaRequest
  ): Promise<ApiResponse<{ id: string; publicUrl: string; alt: string }>> {
    return http.post<{ id: string; publicUrl: string; alt: string }>(
      endpoints.media.createTargetMedia,
      {
        imageUrl: data.imageUrl,
        alt: data.alt,
        ...(data.caption && { caption: data.caption }),
        ...(data.targetId && { targetId: data.targetId }),
        ...(data.targetType && { targetType: data.targetType }),
      }
    );
  }

  /**
   * Delete a target media record by ID
   */
  async deleteTargetMedia(id: string): Promise<ApiResponse<void>> {
    return http.delete<void>(endpoints.media.deleteTargetMedia(id));
  }

  /**
   * Get the upload directory for a given media type
   */
  getUploadDirectory(mediaType: MediaType): "dish" | "chef" | "media" {
    switch (mediaType) {
      case "dish":
        return "dish";
      case "chef":
      case "target":
        return "chef";
    }
  }

  /**
   * Create a media record, routing to the correct endpoint based on mediaType.
   * For dish: sends publicUrl + filename to /api/dish-media (Payload).
   * For chef/target: sends JSON with imageUrl to the custom handler.
   */
  async createMedia(data: {
    mediaType: MediaType;
    publicUrl: string;
    filename?: string;
    mimeType?: string;
    filesize?: number;
    alt: string;
    caption?: string;
  }): Promise<ApiResponse<{ id: string; publicUrl: string; alt: string }>> {
    switch (data.mediaType) {
      case "dish":
        return this.createDishMedia({
          publicUrl: data.publicUrl,
          filename: data.filename || "",
          mimeType: data.mimeType || "image/jpeg",
          filesize: data.filesize || 0,
          alt: data.alt,
          caption: data.caption,
        });
      case "chef":
        return this.createChefMedia({
          publicUrl: data.publicUrl,
          filename: data.filename || "",
          mimeType: data.mimeType || "image/jpeg",
          filesize: data.filesize || 0,
          alt: data.alt,
          caption: data.caption,
        });
      case "target":
        return this.createTargetMedia({
          imageUrl: data.publicUrl,
          alt: data.alt,
          caption: data.caption,
        });
    }
  }

  /**
   * Delete a media record, routing to the correct endpoint based on mediaType
   */
  async deleteMedia(
    mediaType: MediaType,
    id: string
  ): Promise<ApiResponse<void>> {
    switch (mediaType) {
      case "dish":
        return this.deleteDishMedia(id);
      case "chef":
        return this.deleteChefMedia(id);
      case "target":
        return this.deleteTargetMedia(id);
    }
  }
}

export const mediaService = new MediaService();
