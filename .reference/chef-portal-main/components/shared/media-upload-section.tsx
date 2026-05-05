"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Banner, Spinner, MultiImageUpload } from "@/components/polaris";
import type { UploadedFile } from "@/components/polaris";
import { CheckIcon } from "@shopify/polaris-icons";
import { ImageDropzone } from "@/components/shared/image-dropzone";
import { useMediaUpload } from "@/hooks/use-media-upload";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import { mediaService, type MediaType } from "@/services/media.service";

export interface MediaUploadFormData {
  name?: string;
  imageIds: string[];
  mediaData?: Array<{
    publicUrl: string;
    alt: string;
    isPrimary?: boolean;
    dishMediaId?: string;
  }>;
}

interface MediaUploadSectionProps {
  mediaType?: MediaType;
  title?: string;
  description?: string;
  maxFiles?: number;
  maxFileSize?: number;
  tips?: string[];
  formData: MediaUploadFormData;
  onUpdate: (updates: Partial<MediaUploadFormData>) => void;
  onRemoveImage?: (imageIndex: number) => Promise<void> | void;
  isEditMode?: boolean;
  errors?: Record<string, string>;
  onUploadStateChange?: (
    isUploading: boolean,
    isCreatingMedia: boolean
  ) => void;
}

export function MediaUploadSection({
  mediaType = "dish",
  title = "Media",
  description = "Upload high-quality images. The first image will be used as the primary image.",
  maxFiles = 4,
  maxFileSize = 25 * 1024 * 1024,
  tips = [
    "Use high-quality, well-lit images",
    "The first image you upload will be used as the primary/featured image",
    "Supported formats: PNG, JPG, GIF (max 25MB per image)",
  ],
  formData,
  onUpdate,
  onRemoveImage,
  isEditMode = false,
  errors = {},
  onUploadStateChange,
}: MediaUploadSectionProps) {
  // Track multiple deleting images by their index
  const [deletingImageIndices, setDeletingImageIndices] = useState<Set<number>>(
    new Set()
  );

  const {
    uploadedImages,
    uploadFiles,
    removeImage,
    clearAll,
    getUploadedMediaData,
    isUploading,
    hasErrors,
  } = useMediaUpload({
    mediaType,
    itemName: formData.name,
    onMediaCreated: (imageId, mediaId) => {
      // Update formData with mediaId when media is created
      const uploadedMediaData = getUploadedMediaData();
      const mediaWithId = uploadedMediaData.find(
        (m) => m.dishMediaId === mediaId
      );

      if (mediaWithId) {
        // Get existing mediaData that was loaded from API (not from uploads)
        const existingServerMediaData = (formData.mediaData || []).filter(
          (existing) =>
            existing.dishMediaId &&
            !uploadedMediaData.some(
              (uploaded) => uploaded.dishMediaId === existing.dishMediaId
            )
        );

        // Merge existing server images with newly uploaded ones (now with media IDs)
        const mergedMediaData = [
          ...existingServerMediaData,
          ...uploadedMediaData,
        ];

        // Update formData with media IDs
        onUpdate({
          imageIds: mergedMediaData.map((m) => m.publicUrl),
          mediaData: mergedMediaData.length > 0 ? mergedMediaData : undefined,
        });
      }
    },
  });

  // Check if any images are currently creating media records
  const creatingMedia = uploadedImages.some((img) => img.isCreatingMedia);

  // Notify parent of upload state changes
  useEffect(() => {
    if (onUploadStateChange) {
      onUploadStateChange(isUploading, creatingMedia);
    }
  }, [isUploading, creatingMedia, onUploadStateChange]);

  // Handle files selected from dropzone
  const handleFilesChange = (files: File | File[] | null) => {
    if (files === null) {
      // Clear all - handled by clearAll
      clearAll();
      onUpdate({ imageIds: [] });
    } else if (Array.isArray(files)) {
      // Calculate current total: existing images + images being uploaded
      const uploadedMediaData = getUploadedMediaData();
      const uploadedPublicUrls = new Set(
        uploadedMediaData.map((m) => m.publicUrl)
      );

      // Count unique existing images (not in uploadedMediaData to avoid double counting)
      const uniqueExistingCount = existingImageUrls.filter(
        (url) => !uploadedPublicUrls.has(url)
      ).length;

      // Count images currently being uploaded
      const uploadedCount = uploadedImages.length;
      const newFilesCount = files.length;
      const totalAfterUpload =
        uniqueExistingCount + uploadedCount + newFilesCount;

      if (totalAfterUpload > maxFiles) {
        const remainingSlots = maxFiles - uniqueExistingCount - uploadedCount;
        if (remainingSlots > 0) {
          const filesToUpload = files.slice(0, remainingSlots);
          uploadFiles(filesToUpload);
          toast.warning(
            `Maximum ${maxFiles} images allowed. Only ${filesToUpload.length} of ${
              files.length
            } image${files.length > 1 ? "s" : ""} will be uploaded.`
          );
        } else {
          toast.error(
            `Maximum ${maxFiles} images allowed. Please remove some images before uploading more.`
          );
        }
      } else {
        uploadFiles(files);
      }
    } else {
      // Single file upload
      const uploadedMediaData = getUploadedMediaData();
      const uploadedPublicUrls = new Set(
        uploadedMediaData.map((m) => m.publicUrl)
      );

      const uniqueExistingCount = existingImageUrls.filter(
        (url) => !uploadedPublicUrls.has(url)
      ).length;

      const uploadedCount = uploadedImages.length;
      const totalAfterUpload = uniqueExistingCount + uploadedCount + 1;

      if (totalAfterUpload > maxFiles) {
        toast.error(
          `Maximum ${maxFiles} images allowed. Please remove some images before uploading more.`
        );
      } else {
        uploadFiles([files]);
      }
    }
  };

  // Sync uploaded media data to formData
  useEffect(() => {
    const uploadedMediaData = getUploadedMediaData();
    const uploadedPublicUrls = uploadedMediaData.map((m) => m.publicUrl);

    if (uploadedMediaData.length === 0) {
      return;
    }

    const existingServerMediaData = (formData.mediaData || []).filter(
      (existing) =>
        !uploadedPublicUrls.includes(existing.publicUrl) ||
        (existing.dishMediaId &&
          !uploadedMediaData.some(
            (uploaded) => uploaded.dishMediaId === existing.dishMediaId
          ))
    );

    const mergedMediaData = [...existingServerMediaData, ...uploadedMediaData];

    const needsUpdate =
      uploadedMediaData.length > 0 &&
      (mergedMediaData.length !== formData.mediaData?.length ||
        mergedMediaData.some(
          (m, index) =>
            m.dishMediaId !== formData.mediaData?.[index]?.dishMediaId
        ));

    if (needsUpdate) {
      onUpdate({
        imageIds: mergedMediaData.map((m) => m.publicUrl),
        mediaData: mergedMediaData.length > 0 ? mergedMediaData : undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUploadedMediaData, onUpdate]);

  // Get existing image URLs (for editing - only server images)
  const existingImageUrls = useMemo(() => {
    if (!formData.mediaData || formData.mediaData.length === 0) {
      return [];
    }
    const urls = formData.mediaData
      .map((m) => m.publicUrl)
      .filter(
        (url): url is string => typeof url === "string" && url.trim().length > 0
      );
    return urls;
  }, [formData.mediaData]);

  const allImageUrls = existingImageUrls;

  // Handle removing existing images
  const handleRemoveExisting = async (index: number) => {
    setDeletingImageIndices((prev) => new Set(prev).add(index));

    try {
      const mediaItem = formData.mediaData?.[index];
      if (!mediaItem) {
        toast.error(`Image at index ${index} not found.`);
        setDeletingImageIndices((prev) => {
          const updated = new Set(prev);
          updated.delete(index);
          return updated;
        });
        return;
      }

      const { dishMediaId, publicUrl } = mediaItem;

      // If in edit mode, the parent component handles deletion.
      if (isEditMode && onRemoveImage) {
        await onRemoveImage(index);
        const uploadedImage = uploadedImages.find(
          (img) => img.publicUrl === publicUrl
        );
        if (uploadedImage) {
          removeImage(uploadedImage.id);
        }
        setDeletingImageIndices((prev) => {
          const updated = new Set(prev);
          updated.delete(index);
          return updated;
        });
        return;
      }

      // In create mode, if the image has a dishMediaId, delete via API
      if (!isEditMode && dishMediaId) {
        await mediaService.deleteMedia(mediaType, dishMediaId);
        toast.success("Image deleted successfully");
      }

      // Clean up local state
      const uploadedImage = uploadedImages.find(
        (img) => img.publicUrl === publicUrl
      );
      if (uploadedImage) {
        removeImage(uploadedImage.id);
      }

      const updatedMediaData = (formData.mediaData || []).filter(
        (m) => m.publicUrl !== publicUrl
      );

      onUpdate({
        mediaData: updatedMediaData.length > 0 ? updatedMediaData : undefined,
        imageIds: updatedMediaData.map((m) => m.publicUrl),
      });
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete image. Please try again."
      );
    } finally {
      setDeletingImageIndices((prev) => {
        const updated = new Set(prev);
        updated.delete(index);
        return updated;
      });
    }
  };

  // Build unified file list for Polaris MultiImageUpload — deduplicated
  const polarisFiles: UploadedFile[] = useMemo(() => {
    // Collect publicUrls from completed uploads to avoid duplicates
    const completedUploadUrls = new Set(
      uploadedImages
        .filter((img) => img.publicUrl && !img.error)
        .map((img) => img.publicUrl)
    );

    // Existing server images — exclude ones that are also in uploadedImages
    const serverFiles: UploadedFile[] = existingImageUrls
      .filter((url) => !completedUploadUrls.has(url))
      .map((url, i) => ({
        id: `existing-${i}`,
        preview: url,
        name: `Image ${i + 1}`,
        status: deletingImageIndices.has(
          existingImageUrls.indexOf(url)
        ) ? "uploading" as const : "complete" as const,
      }));

    // Currently uploading / recently uploaded images
    const uploadingFiles: UploadedFile[] = uploadedImages.map((img) => ({
      id: img.id,
      preview: img.url,
      name: img.file.name,
      progress: img.uploadProgress,
      status: img.error
        ? "error" as const
        : img.dishMediaId
        ? "complete" as const
        : "uploading" as const,
    }));

    return [...serverFiles, ...uploadingFiles];
  }, [existingImageUrls, uploadedImages, deletingImageIndices]);

  const handlePolarisRemove = (fileId: string) => {
    if (fileId.startsWith("existing-")) {
      const index = parseInt(fileId.replace("existing-", ""), 10);
      handleRemoveExisting(index);
    } else {
      removeImage(fileId);
    }
  };

  const handlePolarisDrop = (files: File[]) => {
    handleFilesChange(files);
  };

  return (
    <Card>
      <div className="space-y-[var(--p-space-400)]">
        <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">
          {description}
        </p>

        {errors.imageIds && (
          <Banner tone="critical" title="">
            <p>{errors.imageIds}</p>
          </Banner>
        )}

        <MultiImageUpload
          files={polarisFiles}
          onDrop={handlePolarisDrop}
          onRemoveFile={handlePolarisRemove}
          maxFiles={maxFiles}
          maxSize={maxFileSize}
          label="Add images"
          hint={`Up to ${maxFiles} images · PNG, JPG, GIF · Max ${Math.round(maxFileSize / (1024 * 1024))}MB each`}
          disabled={isUploading || creatingMedia}
        />

        {/* Status summary */}
        {uploadedImages.length > 0 && (
          <div className="flex items-center justify-between text-[0.75rem] text-[var(--p-color-text-secondary)]">
            <span>
              {uploadedImages.filter((img) => img.publicUrl && !img.error).length} / {uploadedImages.length} uploaded
            </span>
            {uploadedImages.every((img) => img.publicUrl || img.error) &&
              !uploadedImages.some((img) => img.isUploading) && (
                <span className="flex items-center gap-[var(--p-space-100)] text-[rgba(4,123,93,1)]">
                  <CheckIcon className="size-3 fill-current" />
                  Ready to save
                </span>
              )}
          </div>
        )}

        {(isUploading || creatingMedia) && uploadedImages.length === 0 && (
          <div className="flex items-center gap-[var(--p-space-200)] text-[0.8125rem] text-[var(--p-color-text-secondary)]">
            <Spinner size="small" />
            <span>{creatingMedia ? "Creating media records..." : "Preparing upload..."}</span>
          </div>
        )}

        {hasErrors && uploadedImages.length === 0 && (
          <Banner tone="critical" title="">
            <p>Some images failed to upload. Please try again.</p>
          </Banner>
        )}
      </div>
    </Card>
  );
}
