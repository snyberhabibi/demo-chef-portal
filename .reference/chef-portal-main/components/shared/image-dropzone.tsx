"use client";

import React, { useCallback, useState, useMemo, useEffect } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { OptimizedImage } from "./image";
import { FormErrorAlert } from "./form-error-alert";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

interface ImageDropzoneProps {
  /**
   * Single file mode - returns File | null
   * Multiple file mode - returns File[]
   */
  multiple?: boolean;

  /**
   * Maximum number of files (only applies when multiple=true)
   */
  maxFiles?: number;

  /**
   * Maximum file size in bytes (default: 10MB)
   */
  maxSize?: number;

  /**
   * Accepted file types (default: image/*)
   */
  accept?: string;

  /**
   * Callback when files are selected/dropped
   */
  onFilesChange?: (files: File | File[] | null) => void;

  /**
   * Existing image URLs to display
   */
  existingImages?: string[];

  /**
   * Callback when an existing image is removed
   */
  onRemoveExisting?: (index: number) => void;

  /**
   * Whether the dropzone is disabled
   */
  disabled?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Show previews inline
   */
  showPreviews?: boolean;

  /**
   * Custom upload button text
   */
  uploadButtonText?: string;

  /**
   * Custom drag text
   */
  dragText?: string;

  /**
   * Aspect ratio for previews (e.g., "16/9", "1/1")
   */
  aspectRatio?: string;

  /**
   * If true, clears internal state after calling onFilesChange
   * Useful when parent manages upload state separately
   */
  clearAfterChange?: boolean;

  /**
   * Index or indices of images currently being deleted (for showing loading overlay)
   */
  deletingImageIndex?: number | null | Set<number> | number[];

  /**
   * Whether an upload is currently in progress
   */
  isUploading?: boolean;

  /**
   * Upload progress percentage (0-100)
   */
  uploadProgress?: number;
}

/**
 * ImageDropzone Component
 *
 * A reusable drag-and-drop image upload component that supports:
 * - Single or multiple image uploads
 * - Drag and drop
 * - Click to upload
 * - Image previews
 * - File validation
 * - Error handling
 */
export function ImageDropzone({
  multiple = false,
  maxFiles,
  maxSize = 10 * 1024 * 1024, // 10MB default
  accept = "image/*",
  onFilesChange,
  existingImages = [],
  onRemoveExisting,
  disabled = false,
  className,
  showPreviews = true,
  uploadButtonText,
  dragText,
  aspectRatio,
  clearAfterChange = false,
  deletingImageIndex = null,
  isUploading = false,
  uploadProgress,
}: ImageDropzoneProps) {
  // Helper function to check if an index is being deleted
  const isDeleting = (index: number): boolean => {
    if (deletingImageIndex === null || deletingImageIndex === undefined) {
      return false;
    }
    if (typeof deletingImageIndex === "number") {
      return deletingImageIndex === index;
    }
    if (deletingImageIndex instanceof Set) {
      return deletingImageIndex.has(index);
    }
    if (Array.isArray(deletingImageIndex)) {
      return deletingImageIndex.includes(index);
    }
    return false;
  };

  // Debug: Log existing images prop
  React.useEffect(() => {
    console.log("ImageDropzone: existingImages prop", existingImages);
    console.log("ImageDropzone: existingImages length", existingImages.length);
    console.log("ImageDropzone: showPreviews", showPreviews);
  }, [existingImages, showPreviews]);

  const [images, setImages] = useState<ImageFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{
    type: "existing" | "new";
    index?: number;
    id?: string;
  } | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Generate unique ID for each image
  const generateId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Handle accepted files
  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      // Validate file sizes (react-dropzone handles file type via accept prop)
      const invalidFiles = acceptedFiles.filter((file) => file.size > maxSize);
      if (invalidFiles.length > 0) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
        if (invalidFiles.length === 1) {
          setError(
            `File "${invalidFiles[0].name}" exceeds the maximum size of ${maxSizeMB}MB. Please select a smaller file.`
          );
        } else {
          setError(
            `${invalidFiles.length} file${
              invalidFiles.length > 1 ? "s" : ""
            } exceed the maximum size of ${maxSizeMB}MB. Please select smaller files.`
          );
        }
        // Filter out invalid files
        acceptedFiles = acceptedFiles.filter((file) => file.size <= maxSize);
      }

      if (acceptedFiles.length === 0) {
        return;
      }

      setImages((prevImages) => {
        // Validate count
        if (multiple) {
          const totalFiles =
            prevImages.length + acceptedFiles.length + existingImages.length;
          if (maxFiles && totalFiles > maxFiles) {
            setError(
              `Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} allowed`
            );
            return prevImages;
          }
        } else {
          if (acceptedFiles.length > 1) {
            setError("Only one file is allowed");
            return prevImages;
          }
        }

        // Create ImageFile objects with previews
        const newImageFiles: ImageFile[] = acceptedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          id: generateId(),
        }));

        // Calculate new images
        if (multiple) {
          return [...prevImages, ...newImageFiles];
        } else {
          // Clear previous single image
          prevImages.forEach((img) => URL.revokeObjectURL(img.preview));
          return newImageFiles;
        }
      });
    },
    [multiple, maxFiles, maxSize, existingImages.length, generateId]
  );

  // Handle rejected files
  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      const firstRejection = fileRejections[0];
      const firstError = firstRejection?.errors[0];

      if (firstError) {
        // Check if it's a file size error
        if (
          firstError.code === "file-too-large" ||
          firstError.message.includes("larger than")
        ) {
          const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
          const fileName = firstRejection.file.name;
          setError(
            `File "${fileName}" exceeds the maximum size of ${maxSizeMB}MB. Please select a smaller file.`
          );
        } else {
          setError(firstError.message);
        }
      }
    },
    [maxSize]
  );

  // Configure dropzone with explicit HEIC support
  const dropzoneAccept = useMemo(() => {
    if (!accept) return undefined;

    // If accept is "image/*", explicitly include HEIC MIME types
    if (accept === "image/*") {
      return {
        "image/*": [],
        "image/heic": [],
        "image/heif": [],
        "image/heic-sequence": [],
        "image/heif-sequence": [],
      };
    }

    // Otherwise use the provided accept value
    return { [accept]: [] };
  }, [accept]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDropAccepted,
    onDropRejected,
    accept: dropzoneAccept,
    multiple: multiple && (!maxFiles || maxFiles > 1),
    disabled,
    maxSize,
    noClick: false,
    noKeyboard: false,
  });

  // Remove image
  const handleRemove = useCallback((id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  // Handle delete confirmation
  const handleDeleteConfirm = useCallback(() => {
    if (!imageToDelete) return;

    if (
      imageToDelete.type === "existing" &&
      imageToDelete.index !== undefined
    ) {
      onRemoveExisting?.(imageToDelete.index);
    } else if (imageToDelete.type === "new" && imageToDelete.id) {
      handleRemove(imageToDelete.id);
    }

    setDeleteDialogOpen(false);
    setImageToDelete(null);
  }, [imageToDelete, onRemoveExisting, handleRemove]);

  // Handle delete button click - open confirmation dialog
  const handleDeleteClick = useCallback(
    (type: "existing" | "new", index?: number, id?: string) => {
      setImageToDelete({ type, index, id });
      setDeleteDialogOpen(true);
    },
    []
  );

  // Clear all images
  const handleClearAll = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
  }, [images]);

  // Track previous images to only call callback when images actually change
  const prevImagesRef = React.useRef<ImageFile[]>([]);
  const onFilesChangeRef = React.useRef(onFilesChange);

  // Keep callback ref up to date
  React.useEffect(() => {
    onFilesChangeRef.current = onFilesChange;
  }, [onFilesChange]);

  // Sync images with parent callback (using useEffect to avoid setState during render)
  React.useEffect(() => {
    // Only call callback if images actually changed (compare by ID)
    const prevIds = prevImagesRef.current.map((img) => img.id).join(",");
    const currentIds = images.map((img) => img.id).join(",");
    const imagesChanged = prevIds !== currentIds;

    if (imagesChanged && onFilesChangeRef.current) {
      if (multiple) {
        onFilesChangeRef.current(images.map((img) => img.file));
      } else {
        onFilesChangeRef.current(images[0]?.file || null);
      }
      // Store a shallow copy to avoid reference issues
      prevImagesRef.current = [...images];

      // Clear internal state after passing to parent if requested
      // This prevents duplication when parent manages upload state separately
      if (clearAfterChange && images.length > 0) {
        // Clear after a short delay to allow parent to process
        setTimeout(() => {
          images.forEach((img) => URL.revokeObjectURL(img.preview));
          setImages([]);
          prevImagesRef.current = [];
        }, 100);
      }
    }
  }, [images, multiple, clearAfterChange]);

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  const allImages = useMemo(() => {
    const existing = existingImages.map((url, index) => ({
      url,
      id: `existing-${index}`,
    }));
    // When clearAfterChange is true, don't include uploaded images in previews
    // because the parent component manages them separately
    const uploaded = clearAfterChange
      ? []
      : images.map((img) => ({ url: img.preview, id: img.id }));
    const combined = [...existing, ...uploaded];
    console.log("ImageDropzone: allImages", combined);
    console.log(
      "ImageDropzone: existing count",
      existing.length,
      "uploaded count",
      uploaded.length,
      "clearAfterChange",
      clearAfterChange
    );
    return combined;
  }, [existingImages, images, clearAfterChange]);
  const hasImages = allImages.length > 0;
  console.log(
    "ImageDropzone: hasImages",
    hasImages,
    "showPreviews",
    showPreviews
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative border border-dashed rounded-lg transition-colors",
          isDragActive && !disabled
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "cursor-pointer",
          isUploading && "border-primary bg-primary/5"
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div
            className={cn(
              "rounded-full p-3 mb-4",
              isDragActive && !disabled
                ? "bg-primary/10"
                : isUploading
                ? "bg-primary/10"
                : "bg-muted"
            )}
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            ) : isDragActive ? (
              <Upload className="h-6 w-6 text-primary" />
            ) : (
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          <div className="space-y-2 w-full">
            <p className="text-sm font-medium">
              {isUploading
                ? "Uploading..."
                : isDragActive
                ? "Drop images here"
                : dragText ||
                  (multiple
                    ? "Drag images here or click to upload"
                    : "Drag image here or click to upload")}
            </p>
            {isUploading && uploadProgress !== undefined ? (
              <div className="w-full max-w-md mx-auto space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {uploadProgress}% complete
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {accept === "image/*"
                  ? "PNG, JPG, GIF, HEIC up to " +
                    (maxSize / (1024 * 1024)).toFixed(0) +
                    "MB"
                  : `Accepted: ${accept}`}
                {multiple && maxFiles && ` (max ${maxFiles})`}
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
            disabled={disabled || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {uploadButtonText ||
                  (multiple ? "Select Images" : "Select Image")}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      <FormErrorAlert error={error} />

      {/* Previews */}
      {showPreviews && hasImages && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {multiple ? `Images (${allImages.length})` : "Image"}
            </p>
            {images.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                disabled={disabled}
              >
                <X className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>

          <div
            className={cn(
              "grid gap-4",
              multiple
                ? "grid-cols-4 sm:grid-cols-6 md:grid-cols-8"
                : "grid-cols-1"
            )}
          >
            {allImages.map((item, index) => {
              const isExisting = index < existingImages.length;
              const imageFile = !isExisting
                ? images.find((img) => img.id === item.id)
                : null;

              return (
                <div
                  key={item.id}
                  className={cn(
                    "relative group rounded-lg border bg-white",
                    aspectRatio && "aspect-square"
                  )}
                >
                  <div
                    className={cn(
                      "relative w-full cursor-pointer",
                      aspectRatio ? "aspect-square" : "h-16"
                    )}
                    onClick={(e) => {
                      // Don't open lightbox if clicking on delete button
                      if (
                        (e.target as HTMLElement).closest(
                          "button[aria-label='Remove image']"
                        )
                      ) {
                        return;
                      }
                      setLightboxIndex(index);
                      setLightboxOpen(true);
                    }}
                  >
                    <OptimizedImage
                      src={item.url}
                      alt={imageFile?.file.name || `Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Remove button - always visible for existing images */}
                  {!disabled && isExisting && (
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDeleteClick("existing", index);
                      }}
                      aria-label="Remove image"
                      disabled={isDeleting(index)}
                    >
                      <X className="h-4 w-4 stroke-[1.5]" />
                    </button>
                  )}

                  {/* Loading overlay when deleting */}
                  {isDeleting(index) && (
                    <div className="absolute inset-0 z-30 bg-black/60 flex items-center justify-center rounded-lg">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
                  {/* Remove button for new uploads - only on hover */}
                  {!disabled && !isExisting && (
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer pointer-events-auto opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDeleteClick("new", undefined, item.id);
                      }}
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4 stroke-[1.5]" />
                    </button>
                  )}

                  {/* File info overlay */}
                  {imageFile && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="truncate">{imageFile.file.name}</p>
                      <p className="text-xs opacity-75">
                        {(imageFile.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image Lightbox/Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 bg-black/95 border-none"
          showCloseButton={true}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Previous button */}
            {allImages.length > 1 && lightboxIndex > 0 && (
              <button
                onClick={() => setLightboxIndex((prev) => prev - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Next button */}
            {allImages.length > 1 && lightboxIndex < allImages.length - 1 && (
              <button
                onClick={() => setLightboxIndex((prev) => prev + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Image */}
            {allImages[lightboxIndex] && (
              <div className="relative w-full h-full max-w-[90vw] max-h-[90vh] flex items-center justify-center p-4">
                <div className="relative w-full h-full">
                  <OptimizedImage
                    src={allImages[lightboxIndex].url}
                    alt={
                      images.find(
                        (img) => img.id === allImages[lightboxIndex].id
                      )?.file.name || `Image ${lightboxIndex + 1}`
                    }
                    fill
                    className="object-contain"
                    unoptimized={allImages[lightboxIndex].url.startsWith(
                      "blob:"
                    )}
                  />
                </div>
              </div>
            )}

            {/* Image counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/50 text-white text-sm">
                {lightboxIndex + 1} / {allImages.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Keyboard navigation */}
      {lightboxOpen && (
        <LightboxKeyboardHandler
          currentIndex={lightboxIndex}
          totalImages={allImages.length}
          onPrevious={() => setLightboxIndex((prev) => Math.max(0, prev - 1))}
          onNext={() =>
            setLightboxIndex((prev) => Math.min(allImages.length - 1, prev + 1))
          }
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}

// Keyboard handler component for lightbox navigation
function LightboxKeyboardHandler({
  currentIndex,
  totalImages,
  onPrevious,
  onNext,
  onClose,
}: {
  currentIndex: number;
  totalImages: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        onPrevious();
      } else if (e.key === "ArrowRight" && currentIndex < totalImages - 1) {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, totalImages, onPrevious, onNext, onClose]);

  return null;
}
