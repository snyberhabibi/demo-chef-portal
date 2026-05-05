"use client";

import {
  MediaUploadSection,
  type MediaUploadFormData,
} from "@/components/shared/media-upload-section";
import type { DishFormData } from "@/app/dashboard/dishes/new/page";
import { useMediaUpload } from "@/hooks/use-media-upload";
import { useEffect } from "react";

interface DishMediaSectionProps {
  formData: DishFormData;
  onUpdate: (updates: Partial<DishFormData>) => void;
  onRemoveImage?: (imageIndex: number) => Promise<void> | void;
  isEditMode?: boolean;
  errors?: Record<string, string>;
  onUploadStateChange?: (
    isUploading: boolean,
    isCreatingMedia: boolean
  ) => void;
}

export function DishMediaSection({
  formData,
  onUpdate,
  onRemoveImage,
  isEditMode = false,
  errors = {},
  onUploadStateChange,
}: DishMediaSectionProps) {
  const {
    uploadedImages,
    getUploadedMediaData,
    isUploading,
  } = useMediaUpload({
    dishName: formData.name,
  });

  // The hook will automatically create media for images when dishId becomes available

  // Check if any images are currently creating media records
  const creatingMedia = uploadedImages.some((img) => img.isCreatingMedia);

  // Notify parent of upload state changes
  useEffect(() => {
    if (onUploadStateChange) {
      onUploadStateChange(isUploading, creatingMedia);
    }
  }, [isUploading, creatingMedia, onUploadStateChange]);

  // Handle files selected from dropzone

  // Store uploaded media data (dish media creation now happens in useMediaUpload hook)
  // IMPORTANT: Only update formData when there are NEW uploads from useMediaUpload hook
  // Do NOT overwrite existing mediaData from API when editing
  useEffect(() => {
    const uploadedMediaData = getUploadedMediaData();
    const uploadedPublicUrls = uploadedMediaData.map((m) => m.publicUrl);

    // Only proceed if there are actually new uploads from the upload hook
    if (uploadedMediaData.length === 0) {
      // No new uploads - don't modify formData at all, preserve existing mediaData
      return;
    }

    // Get existing mediaData that was loaded from API (not from uploads)
    const existingServerMediaData = (formData.mediaData || []).filter(
      (existing) =>
        !uploadedPublicUrls.includes(existing.publicUrl) ||
        (existing.dishMediaId &&
          !uploadedMediaData.some(
            (uploaded) => uploaded.dishMediaId === existing.dishMediaId
          ))
    );

    // Merge existing server images with newly uploaded ones
    const mergedMediaData = [...existingServerMediaData, ...uploadedMediaData];

    // Only update if there's an actual change
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
  }, [getUploadedMediaData, onUpdate]); // Don't include dishId to avoid re-running when it changes


  return (
    <MediaUploadSection
      mediaType="dish"
      title="Dish Media"
      description="Upload high-quality images of your dish. You can upload up to 4 images. The first image will be used as the primary image."
      tips={[
        "Use high-quality, well-lit images that showcase your dish from the best angle",
        "The first image you upload will be used as the primary/featured image in your storefront",
        "Supported formats: PNG, JPG, GIF (max 10MB per image)",
        "Consider showing different angles or details in additional images to help customers make decisions",
        "Ensure images are clear and appetizing - they're the first thing customers see",
      ]}
      formData={formData as MediaUploadFormData}
      onUpdate={onUpdate as (updates: Partial<MediaUploadFormData>) => void}
      onRemoveImage={onRemoveImage}
      isEditMode={isEditMode}
      errors={errors}
      onUploadStateChange={onUploadStateChange}
    />
  );
}
