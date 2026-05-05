import { useState, useCallback, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { mediaService, type MediaType } from "@/services/media.service";
import { toast } from "@/components/ui/toast"
import { processImageFile, isHeicFile } from "@/lib/image-utils";

export interface UploadedImage {
  id: string;
  url: string; // Preview URL (blob) or publicUrl after upload
  file: File;
  publicUrl?: string; // Storage URL after upload
  key?: string; // S3 key
  filename?: string; // Filename from presigned URL response
  alt?: string; // Alt text for media
  mediaId?: string; // Media record ID after creation
  dishMediaId?: string; // Backward-compat alias for mediaId
  isUploading?: boolean;
  uploadProgress?: number; // Upload progress percentage (0-100)
  isCreatingMedia?: boolean; // True when creating media record
  error?: string;
}

interface UseMediaUploadOptions {
  mediaType?: MediaType; // Defaults to "dish"
  itemName?: string; // Used for generating alt text (item-name-image-0, etc.)
  dishName?: string; // Backward-compat alias for itemName
  onMediaCreated?: (imageId: string, mediaId: string) => void;
  onDishMediaCreated?: (imageId: string, dishMediaId: string) => void; // Backward-compat alias
}

export function useMediaUpload(options?: UseMediaUploadOptions) {
  const {
    mediaType = "dish",
    itemName,
    dishName,
    onMediaCreated,
    onDishMediaCreated,
  } = options || {};

  const resolvedItemName = itemName ?? dishName;
  const resolvedCallback = onMediaCreated ?? onDishMediaCreated;

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const callbackRef = useRef(resolvedCallback);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = resolvedCallback;
  }, [resolvedCallback]);

  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      onProgress,
    }: {
      file: File;
      onProgress?: (progress: number) => void;
    }) => {
      // Step 1: Upload to S3 via presigned URL (all media types)
      const directory = mediaService.getUploadDirectory(mediaType);
      return mediaService.uploadFile(file, onProgress, directory);
    },
    onSuccess: async (result, { file }) => {
      const newImageId = `uploaded-${Date.now()}-${Math.random()}`;

      // Determine actualImageId and altText inside the functional update
      // to avoid stale closure issues with uploadedImages
      let actualImageId = newImageId;
      let altText = "";

      // Generate alt text

      // Mark as uploaded, now creating media
      setUploadedImages((prev) => {
        // Generate alt text from actual state
        const index = prev.filter(
          (img) => img.publicUrl && !img.error
        ).length;
        altText = resolvedItemName
          ? `${resolvedItemName.toLowerCase().replace(/\s+/g, "-")}-image-${index}`
          : `${mediaType}-image-${index}`;

        const existing = prev.find((img) => img.file === file);
        if (existing) {
          // Capture the real ID from state (avoids stale closure mismatch)
          actualImageId = existing.id;
          return prev.map((img) =>
            img.file === file
              ? {
                  ...img,
                  id: existing.id,
                  publicUrl: result.publicUrl,
                  key: result.key,
                  filename: result.filename,
                  url: result.publicUrl,
                  alt: altText,
                  isUploading: false,
                  isCreatingMedia: true,
                  uploadProgress: 100,
                  error: undefined,
                }
              : img
          );
        }
        actualImageId = newImageId;
        return [
          ...prev,
          {
            id: newImageId,
            url: result.publicUrl,
            file,
            publicUrl: result.publicUrl,
            key: result.key,
            filename: result.filename,
            alt: altText,
            isUploading: false,
            isCreatingMedia: true,
            uploadProgress: 100,
          },
        ];
      });

      // Step 2: Create media record
      try {
        const mediaResult = await mediaService.createMedia({
          mediaType,
          publicUrl: result.publicUrl,
          filename: result.filename,
          mimeType: file.type,
          filesize: file.size,
          alt: altText,
        });

        if (mediaResult.data?.id) {
          const createdMediaId = mediaResult.data.id;

          setUploadedImages((current) =>
            current.map((img) =>
              img.id === actualImageId
                ? {
                    ...img,
                    mediaId: createdMediaId,
                    dishMediaId: createdMediaId,
                    isCreatingMedia: false,
                  }
                : img
            )
          );

          // Call callback if provided
          if (callbackRef.current) {
            callbackRef.current(actualImageId, createdMediaId);
          }
        } else {
          setUploadedImages((current) =>
            current.map((img) =>
              img.id === actualImageId
                ? {
                    ...img,
                    isCreatingMedia: false,
                    error: "Failed to create media record",
                  }
                : img
            )
          );
        }
      } catch (error) {
        console.error("[useMediaUpload] Failed to create media:", error);
        setUploadedImages((current) =>
          current.map((img) =>
            img.id === actualImageId
              ? {
                  ...img,
                  isCreatingMedia: false,
                  error: "Uploaded but failed to create media record",
                }
              : img
          )
        );
      }
    },
    onError: (error: Error, { file }) => {
      setUploadedImages((prev) => {
        const existing = prev.find((img) => img.file === file);
        if (existing) {
          return prev.map((img) =>
            img.file === file
              ? {
                  ...img,
                  isUploading: false,
                  uploadProgress: undefined,
                  error: error.message,
                }
              : img
          );
        }
        return [
          ...prev,
          {
            id: `error-${Date.now()}`,
            url: URL.createObjectURL(file),
            file,
            isUploading: false,
            uploadProgress: undefined,
            error: error.message,
          },
        ];
      });
      toast.error(`Failed to upload ${file.name}: ${error.message}`);
    },
  });

  const uploadFile = useCallback(
    async (file: File) => {
      // Add to list as uploading (before conversion)
      const imageId = `temp-${Date.now()}-${Math.random()}`;
      const originalFile = file;

      setUploadedImages((prev) => {
        const exists = prev.some((img) => img.file === originalFile);
        if (exists) return prev;
        return [
          ...prev,
          {
            id: imageId,
            url: URL.createObjectURL(originalFile),
            file: originalFile,
            isUploading: true,
            uploadProgress: 0,
          },
        ];
      });

      try {
        // Convert HEIC to JPG if needed
        let fileToUpload = originalFile;
        if (isHeicFile(originalFile)) {
          // Update progress to show conversion is happening
          setUploadedImages((prev) =>
            prev.map((img) =>
              img.id === imageId
                ? { ...img, uploadProgress: 5, error: undefined }
                : img
            )
          );

          fileToUpload = await processImageFile(originalFile);

          // Update the preview URL to use the converted JPG
          const convertedPreviewUrl = URL.createObjectURL(fileToUpload);
          setUploadedImages((prev) =>
            prev.map((img) => {
              if (img.id === imageId) {
                // Revoke old preview URL
                if (img.url.startsWith("blob:")) {
                  URL.revokeObjectURL(img.url);
                }
                return {
                  ...img,
                  file: fileToUpload, // Update to converted file
                  url: convertedPreviewUrl, // Update preview to converted JPG
                  uploadProgress: 10,
                };
              }
              return img;
            })
          );
        }

        // Progress callback to update progress for this specific image
        const onProgress = (progress: number) => {
          setUploadedImages((prev) =>
            prev.map((img) => {
              if (img.id === imageId) {
                // Scale progress: 10-100% (since conversion takes first 10%)
                const scaledProgress = isHeicFile(originalFile)
                  ? 10 + Math.round((progress / 100) * 90)
                  : progress;
                return { ...img, uploadProgress: scaledProgress };
              }
              return img;
            })
          );
        };

        // Start upload with progress tracking (using converted file if HEIC)
        uploadMutation.mutate({ file: fileToUpload, onProgress });
      } catch (error) {
        // Handle conversion error
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to process image file";
        setUploadedImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? {
                  ...img,
                  isUploading: false,
                  uploadProgress: undefined,
                  error: errorMessage,
                }
              : img
          )
        );
        toast.error(`Failed to process ${originalFile.name}: ${errorMessage}`);
      }
    },
    [uploadMutation]
  );

  const uploadFiles = useCallback(
    async (files: File[]) => {
      files.forEach((file) => uploadFile(file));
    },
    [uploadFile]
  );

  const removeImage = useCallback((id: string) => {
    setUploadedImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        // Revoke blob URL if it exists
        if (image.url.startsWith("blob:")) {
          URL.revokeObjectURL(image.url);
        }
        return prev.filter((img) => img.id !== id);
      }
      return prev;
    });
  }, []);

  const clearAll = useCallback(() => {
    uploadedImages.forEach((img) => {
      if (img.url.startsWith("blob:")) {
        URL.revokeObjectURL(img.url);
      }
    });
    setUploadedImages([]);
  }, [uploadedImages]);

  const getUploadedMediaData = useCallback((): Array<{
    publicUrl: string;
    alt: string;
    isPrimary?: boolean;
    mediaId?: string;
    dishMediaId?: string;
  }> => {
    return uploadedImages
      .filter((img) => img.publicUrl && !img.error)
      .map((img, index) => ({
        publicUrl: img.publicUrl!,
        alt: img.alt || `${mediaType}-image-${index}`,
        isPrimary: index === 0, // First image is primary
        mediaId: img.mediaId,
        dishMediaId: img.dishMediaId ?? img.mediaId, // Backward compat
      }));
  }, [uploadedImages, mediaType]);

  const isUploading = uploadMutation.isPending;
  const hasErrors = uploadedImages.some((img) => img.error);

  return {
    uploadedImages,
    uploadFile,
    uploadFiles,
    removeImage,
    clearAll,
    getUploadedMediaData,
    isUploading,
    hasErrors,
  };
}
