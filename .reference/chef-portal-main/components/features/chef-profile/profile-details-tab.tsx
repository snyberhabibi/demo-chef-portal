"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/toast";
import type { ChefProfile } from "@/services/chef-profile.service";
import { StoreFrontIndicator } from "./store-front-indicator";
import { useCuisines } from "@/hooks/use-cuisines";
import { OptimizedImage } from "@/components/shared/image";
import { getCuisineEmoji } from "@/lib/cuisine-emoji";
import { useMutation } from "@tanstack/react-query";
import { processImageFile } from "@/lib/image-utils";
import { mediaService } from "@/services/media.service";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { FormErrorAlert } from "@/components/shared/form-error-alert";
import { useUpdateChefProfilePartial } from "@/hooks/use-chef-profile";
import { getGeneralErrorMessage, setFormErrors } from "@/lib/form-errors";
import { useLoading } from "@/contexts/loading-context";
import {
  CheckCircleIcon,
  AlertCircleIcon,
  XSmallIcon,
} from "@shopify/polaris-icons";
import {
  Input,
  Textarea,
  Label,
  HelpText,
  Badge,
  Spinner,
  ProgressBar,
  ImageUpload,
  SearchableSelect,
  SkeletonText,
  Tag,
} from "@/components/polaris";
import { FieldError } from "@/components/shared/field-error";

const profileDetailsSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  slug: z.string().optional(),
  bio: z.string().optional(),
  story: z.string().optional(),
  whatInspiresMe: z.string().optional(),
  experience: z.number().min(0).optional(),
  cuisines: z.array(z.string()), // Array of cuisine IDs
  bannerImage: z.string().optional(),
});

type ProfileDetailsFormValues = z.infer<typeof profileDetailsSchema>;

export type ProfileSection = "basic-info" | "about-you" | "cuisines" | "branding";

interface ProfileDetailsTabProps {
  profile?: ChefProfile;
  isEditing: boolean;
  onSave: (data: Partial<ChefProfile>) => void;
  /** Which section to display. If undefined, all sections show. */
  activeSection?: ProfileSection;
  formRef?: (ref: {
    submit: () => void;
    setFieldError?: (field: string, message: string) => void;
    hasErrors?: () => boolean;
    isDirty?: () => boolean;
    validate?: () => Promise<boolean>;
  }) => void;
}

export function ProfileDetailsTab({
  profile,
  isEditing,
  onSave,
  activeSection,
  formRef,
}: ProfileDetailsTabProps) {
  const { data: cuisines, isLoading: cuisinesLoading } = useCuisines();
  const updatePartialMutation = useUpdateChefProfilePartial();
  const { showLoading, hideLoading } = useLoading();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [bannerImageId, setBannerImageId] = useState<string | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null); // For display purposes
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
  const [bannerUploadProgress, setBannerUploadProgress] = useState<number>(0);
  const [bannerUploadError, setBannerUploadError] = useState<string | null>(
    null
  );
  const [bannerUploadSuccess, setBannerUploadSuccess] = useState(false);
  const bannerPreviewUrlRef = useRef<string | null>(null);
  const [cuisineToRemove, setCuisineToRemove] = useState<string | null>(null); // Stores cuisine ID
  const [isRemoveCuisineDialogOpen, setIsRemoveCuisineDialogOpen] =
    useState(false);
  const [isRemoveBannerDialogOpen, setIsRemoveBannerDialogOpen] =
    useState(false);
  const [isDeletingBanner, setIsDeletingBanner] = useState(false);

  const form = useForm<ProfileDetailsFormValues>({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: {
      businessName: profile?.businessName || "",
      slug: profile?.slug ?? "",
      bio: profile?.bio || "",
      story: profile?.story || "",
      whatInspiresMe: profile?.whatInspiresMe || "",
      experience: profile?.experience ?? undefined,
      cuisines: profile?.cuisines || [],
      bannerImage: profile?.bannerImage || "",
    },
  });

  // Sync form with profile data when it changes
  useEffect(() => {
    if (profile) {
      console.log(
        "[ProfileDetailsTab] Profile updated, bannerImage:",
        profile.bannerImage,
        "bannerImageUrl:",
        profile.bannerImageUrl
      );
      form.reset({
        businessName: profile.businessName || "",
        slug: profile.slug ?? "",
        bio: profile.bio || "",
        story: profile.story || "",
        whatInspiresMe: profile.whatInspiresMe || "",
        experience: profile.experience ?? (undefined as number | undefined),
        cuisines: profile.cuisines || [],
        bannerImage: profile.bannerImage || "",
      });
      // Set banner image ID and URL from profile
      // The hook now extracts both ID and URL separately
      setBannerImageId(profile.bannerImage || null);
      setBannerImageUrl(profile.bannerImageUrl || null);
      console.log(
        "[ProfileDetailsTab] Form reset with bannerImage:",
        profile.bannerImage || ""
      );
    }
  }, [profile, form]);

  const selectedCuisineIds = form.watch("cuisines"); // Array of cuisine IDs

  // Map selected cuisine IDs to cuisine objects for display
  const selectedCuisines = useMemo(() => {
    if (!cuisines || !selectedCuisineIds) return [];
    return selectedCuisineIds
      .map((id) => cuisines.find((c) => c.id === id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);
  }, [cuisines, selectedCuisineIds]);

  // Filter out already selected cuisines from dropdown options
  const availableCuisines = useMemo(() => {
    if (!cuisines) return [];
    return cuisines.filter(
      (cuisine) => !selectedCuisineIds.includes(cuisine.id)
    );
  }, [cuisines, selectedCuisineIds]);

  // Handle cuisine selection from SearchableSelect - auto-save on change
  const handleCuisineChange = async (cuisineId: string) => {
    if (updatePartialMutation.isPending) return; // Prevent concurrent updates

    const currentCuisineIds = form.getValues("cuisines");
    // Check if cuisine ID is already selected
    if (!currentCuisineIds.includes(cuisineId)) {
      const newCuisineIds = [...currentCuisineIds, cuisineId];
      form.setValue("cuisines", newCuisineIds);

      // Auto-save cuisines only
      try {
        setGeneralError(null);
        form.clearErrors("cuisines");
        showLoading();
        await updatePartialMutation.mutateAsync({ cuisines: newCuisineIds });
        toast.success("Cuisine added successfully");
      } catch (error) {
        // Revert on error
        form.setValue("cuisines", currentCuisineIds);
        // Set field errors
        setFormErrors(error, form.setError, {
          mapFieldNames: { cuisines: "cuisines" },
        });
        const errorMessage =
          getGeneralErrorMessage(error) || "Failed to add cuisine";
        setGeneralError(errorMessage);
        toast.error(errorMessage);
        console.error("Failed to update cuisines:", error);
      } finally {
        hideLoading();
      }
    }
  };

  // Handle cuisine removal - show confirmation dialog first
  const handleRemoveCuisine = (cuisineId: string) => {
    setCuisineToRemove(cuisineId);
    setIsRemoveCuisineDialogOpen(true);
  };

  // Actually remove the cuisine after confirmation - auto-save on removal
  const confirmRemoveCuisine = useCallback(async () => {
    if (cuisineToRemove && !updatePartialMutation.isPending) {
      const currentCuisineIds = form.getValues("cuisines");
      const newCuisineIds = currentCuisineIds.filter(
        (id) => id !== cuisineToRemove
      );
      form.setValue("cuisines", newCuisineIds);
      setCuisineToRemove(null);
      setIsRemoveCuisineDialogOpen(false);

      // Auto-save cuisines only
      try {
        setGeneralError(null);
        form.clearErrors("cuisines");
        showLoading();
        await updatePartialMutation.mutateAsync({ cuisines: newCuisineIds });
        toast.success("Cuisine removed successfully");
      } catch (error) {
        // Revert on error
        form.setValue("cuisines", currentCuisineIds);
        // Set field errors
        setFormErrors(error, form.setError, {
          mapFieldNames: { cuisines: "cuisines" },
        });
        const errorMessage =
          getGeneralErrorMessage(error) || "Failed to remove cuisine";
        setGeneralError(errorMessage);
        toast.error(errorMessage);
        console.error("Failed to update cuisines:", error);
      } finally {
        hideLoading();
      }
    }
  }, [cuisineToRemove, form, updatePartialMutation, showLoading, hideLoading]);

  // Banner image upload mutation
  const uploadBannerMutation = useMutation({
    mutationFn: async ({
      file,
    }: {
      file: File;
      previewUrl: string;
    }) => {
      setIsUploadingBanner(true);
      setBannerUploadProgress(0);
      setBannerUploadError(null);
      setBannerUploadSuccess(false);

      try {
        // Convert HEIC to JPG if needed
        const fileToUpload = await processImageFile(file);

        // Progress callback to track upload progress (0-80% for upload)
        const onProgress = (progress: number) => {
          // Scale upload progress to 0-80% (remaining 20% for media creation)
          setBannerUploadProgress(Math.round(progress * 0.8));
        };

        // Upload file to chef-media directory with progress tracking
        const uploadResult = await mediaService.uploadFile(
          fileToUpload,
          onProgress,
          "chef"
        );

        // Update progress to 85% (upload complete, creating media)
        setBannerUploadProgress(85);

        // Create chef media record
        const mediaResult = await mediaService.createChefMedia({
          publicUrl: uploadResult.publicUrl,
          filename: uploadResult.filename,
          mimeType: fileToUpload.type,
          filesize: fileToUpload.size,
          alt: `Banner image for ${profile?.businessName || "chef profile"}`,
        });

        // Update progress to 90% (media created)
        setBannerUploadProgress(90);

        if (mediaResult.data) {
          // Return the full chef-media response object
          return {
            id: mediaResult.data.id,
            url: mediaResult.data.publicUrl,
            chefMedia: mediaResult.data, // Include full chef-media response
          };
        }
        throw new Error("Failed to create chef media");
      } catch (error) {
        setIsUploadingBanner(false);
        setBannerUploadError(
          error instanceof Error ? error.message : "Upload failed"
        );
        // Don't revoke preview URL on error - keep it visible so user can retry
        throw error;
      }
    },
    onSuccess: async (result: {
      id: string;
      url: string;
      chefMedia: { id: string; publicUrl: string; alt: string };
    }) => {
      // Store the media ID in the form (this is what gets sent to the API)
      console.log("[BannerUpload] Chef-media created:", result.chefMedia);
      form.setValue("bannerImage", result.id);
      setBannerImageId(result.id);
      // Store the URL for display purposes
      setBannerImageUrl(result.url);

      // Update progress to 95% (updating profile)
      setBannerUploadProgress(95);

      // Auto-save banner image only - send the chef-media ID
      try {
        setGeneralError(null);
        form.clearErrors("bannerImage");
        console.log(
          "[BannerUpload] Updating profile with chef-media ID:",
          result.id
        );
        // Send the chef-media ID as a string to the API
        showLoading();
        await updatePartialMutation.mutateAsync({
          bannerImage: result.id,
        });
        console.log("[BannerUpload] Profile updated successfully");

        // Update progress to 100% (complete)
        setBannerUploadProgress(100);
        setBannerUploadSuccess(true);

        toast.success("Banner image uploaded and saved successfully");
      } catch (error) {
        setIsUploadingBanner(false);
        // Set field errors
        setFormErrors(error, form.setError, {
          mapFieldNames: { bannerImage: "bannerImage" },
        });
        const errorMessage =
          getGeneralErrorMessage(error) ||
          "Banner uploaded but failed to save. Please try saving again.";
        setGeneralError(errorMessage);
        toast.error(errorMessage);
        console.error("Failed to update banner image:", error);
      } finally {
        hideLoading();
      }

      // Keep preview URL for a moment to show success, then clear and clean up
      setTimeout(() => {
        setIsUploadingBanner(false);
        const previewUrlToClean = bannerPreviewUrlRef.current;
        if (previewUrlToClean) {
          URL.revokeObjectURL(previewUrlToClean);
          bannerPreviewUrlRef.current = null;
        }
        setBannerPreviewUrl(null);
        setBannerUploadProgress(0);
        setBannerUploadSuccess(false);
      }, 1500);
    },
    onError: (error: Error) => {
      setIsUploadingBanner(false);
      // Keep preview URL visible so user can retry
      toast.error(`Failed to upload banner image: ${error.message}`);
    },
  });

  // Handle banner image file selection
  const handleBannerFilesChange = useCallback(
    (files: File | File[] | null) => {
      if (files === null) {
        // Remove banner image
        if (bannerPreviewUrl) {
          URL.revokeObjectURL(bannerPreviewUrl);
        }
        if (bannerPreviewUrlRef.current) {
          URL.revokeObjectURL(bannerPreviewUrlRef.current);
          bannerPreviewUrlRef.current = null;
        }
        form.setValue("bannerImage", "");
        setBannerImageId(null);
        setBannerImageUrl(null);
        setBannerPreviewUrl(null);
        setBannerUploadProgress(0);
        setBannerUploadError(null);
        setBannerUploadSuccess(false);
        return;
      }

      const file = Array.isArray(files) ? files[0] : files;
      if (file) {
        // Reset states
        setBannerUploadError(null);
        setBannerUploadSuccess(false);

        // Create preview URL immediately
        const previewUrl = URL.createObjectURL(file);
        setBannerPreviewUrl(previewUrl);
        bannerPreviewUrlRef.current = previewUrl;

        // Start upload
        uploadBannerMutation.mutate({ file, previewUrl });
      }
    },
    [uploadBannerMutation, form, bannerPreviewUrl]
  );

  // Handle banner image removal - auto-save on removal
  const handleRemoveBanner = useCallback(
    async (index: number) => {
      if (index === 0 && bannerImageId) {
        // Open confirmation dialog
        setIsRemoveBannerDialogOpen(true);
      }
    },
    [bannerImageId]
  );

  // Confirm banner image removal - delete via API and update profile
  const confirmRemoveBanner = useCallback(async () => {
    // If no saved banner (neither ID nor URL), just clear preview
    if (!bannerImageId && !bannerImageUrl) {
      handleBannerFilesChange(null);
      setIsRemoveBannerDialogOpen(false);
      return;
    }

    try {
      setIsDeletingBanner(true);
      setIsRemoveBannerDialogOpen(false);
      setGeneralError(null);
      form.clearErrors("bannerImage");

      // Delete chef media from storage (only if we have the ID)
      if (bannerImageId) {
        try {
          await mediaService.deleteChefMedia(bannerImageId);
        } catch (error) {
          console.error("Failed to delete banner media:", error);
        }
      }

      // Update profile to remove banner image
      showLoading();
      await updatePartialMutation.mutateAsync({ bannerImage: null });

      // Clear form state
      form.setValue("bannerImage", "");
      setBannerImageId(null);
      setBannerImageUrl(null);

      // Clean up preview URL if exists
      if (bannerPreviewUrl) {
        URL.revokeObjectURL(bannerPreviewUrl);
      }
      if (bannerPreviewUrlRef.current) {
        URL.revokeObjectURL(bannerPreviewUrlRef.current);
        bannerPreviewUrlRef.current = null;
      }
      setBannerPreviewUrl(null);
      setBannerUploadProgress(0);
      setBannerUploadError(null);
      setBannerUploadSuccess(false);

      toast.success("Banner image removed successfully");
    } catch (error) {
      // Set field errors
      setFormErrors(error, form.setError, {
        mapFieldNames: { bannerImage: "bannerImage" },
      });
      const errorMessage =
        getGeneralErrorMessage(error) || "Failed to remove banner image";
      setGeneralError(errorMessage);
      toast.error(errorMessage);
      console.error("Failed to update banner image:", error);
    } finally {
      setIsDeletingBanner(false);
      hideLoading();
    }
  }, [
    bannerImageId,
    bannerImageUrl,
    handleBannerFilesChange,
    form,
    updatePartialMutation,
    bannerPreviewUrl,
    showLoading,
    hideLoading,
  ]);

  const onSubmit = (values: ProfileDetailsFormValues) => {
    // Exclude bannerImage — it's auto-saved on upload/remove
    const { bannerImage: _, ...rest } = values;
    onSave(rest);
  };

  // Expose submit method and setFieldError to parent
  useEffect(() => {
    if (formRef) {
      formRef({
        submit: () => {
          form.handleSubmit(onSubmit)();
        },
        setFieldError: (field: string, message: string) => {
          form.setError(field as Path<ProfileDetailsFormValues>, {
            type: "server",
            message,
          });
        },
        hasErrors: () => {
          return Object.keys(form.formState.errors).length > 0;
        },
        isDirty: () => {
          return form.formState.isDirty;
        },
        validate: async () => {
          const result = await form.trigger();
          return result;
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRef, form]);

  // Import Card at top — it's already available from polaris
  const CardWrap = ({ children, visible }: { children: React.ReactNode; visible: boolean }) => (
    <div style={{ display: visible ? "block" : "none" }}>
      <div className="rounded-[var(--p-border-radius-300)] border border-[var(--p-color-border-secondary)] bg-[var(--p-color-bg-surface)] p-[var(--p-space-500)] shadow-[var(--p-shadow-100)]">
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full relative">
        {/* General Error Alert */}
        <FormErrorAlert error={generalError} className="mb-[var(--p-space-500)]" />
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[var(--p-space-600)]">
            {/* Basic Information Section */}
            <CardWrap visible={!activeSection || activeSection === "basic-info"}>
              <div className="space-y-[var(--p-space-400)]">
                <div className="space-y-[var(--p-space-150)]">
                  <Label className="flex items-center gap-[var(--p-space-100)]">
                    Business Name <span className="text-[var(--p-color-text-critical)]">*</span>
                    <StoreFrontIndicator
                      description="This is the main title displayed at the top of your store-front profile page."
                      screenshot="/screenshots/business-name.png"
                      screenshotAlt="Business name on store-front"
                    />
                  </Label>
                  <Input
                    {...form.register("businessName")}
                    disabled={!isEditing}
                    placeholder="Enter your business or kitchen name"
                  />
                  <FieldError message={form.formState.errors.businessName?.message} />
                </div>

                <div className="space-y-[var(--p-space-150)]">
                  <Label className="flex items-center gap-[var(--p-space-100)]">
                    Years of Experience
                    <StoreFrontIndicator
                      description="Your years of experience are displayed on your store-front profile."
                      screenshot="/screenshots/experience.png"
                      screenshotAlt="Experience on store-front"
                    />
                  </Label>
                  <Input
                    type="number"
                    disabled={!isEditing}
                    placeholder="e.g., 10"
                    value={form.watch("experience") ?? ""}
                    onChange={(e) =>
                      form.setValue("experience", e.target.value ? parseInt(e.target.value) : undefined, { shouldDirty: true })
                    }
                  />
                  <FieldError message={form.formState.errors.experience?.message} />
                </div>
              </div>
            </CardWrap>

            {/* About You Section */}
            <CardWrap visible={!activeSection || activeSection === "about-you"}>
              <div className="space-y-[var(--p-space-400)]">
                <div className="space-y-[var(--p-space-150)]">
                  <Label className="flex items-center gap-[var(--p-space-100)]">
                    Bio
                    <StoreFrontIndicator
                      description="Your bio appears in the profile overview section of your store-front."
                      screenshot="/screenshots/bio.png"
                      screenshotAlt="Bio on store-front"
                    />
                  </Label>
                  <Input
                    {...form.register("bio")}
                    disabled={!isEditing}
                    placeholder="A short professional summary"
                  />
                  <FieldError message={form.formState.errors.bio?.message} />
                </div>

                <div className="space-y-[var(--p-space-150)]">
                  <Label className="flex items-center gap-[var(--p-space-100)]">
                    Your Story
                    <StoreFrontIndicator
                      description="Your story appears in the 'About' section of your store-front."
                      screenshot="/screenshots/story.png"
                      screenshotAlt="Story on store-front"
                    />
                  </Label>
                  <Textarea
                    {...form.register("story")}
                    disabled={!isEditing}
                    placeholder="Share your culinary journey, background, and cooking philosophy"
                    className="resize-y min-h-[120px]"
                  />
                  <FieldError message={form.formState.errors.story?.message} />
                </div>

                <div className="space-y-[var(--p-space-150)]">
                  <Label className="flex items-center gap-[var(--p-space-100)]">
                    What Inspires You
                    <StoreFrontIndicator
                      description="This section appears in your store-front profile to show customers what drives your passion."
                      screenshot="/screenshots/what-inspires-me.png"
                      screenshotAlt="What Inspires Me on store-front"
                    />
                  </Label>
                  <Textarea
                    {...form.register("whatInspiresMe")}
                    disabled={!isEditing}
                    placeholder="What inspires your passion for cooking"
                    className="resize-y min-h-[100px]"
                  />
                  <FieldError message={form.formState.errors.whatInspiresMe?.message} />
                </div>
              </div>
            </CardWrap>

            {/* Cuisines Section */}
            <CardWrap visible={!activeSection || activeSection === "cuisines"}>
              <div className="space-y-[var(--p-space-150)]">
                <Label className="flex items-center gap-[var(--p-space-100)]">
                  Cuisines
                  <StoreFrontIndicator
                    description="The cuisines you specialize in are displayed as tags on your store-front profile."
                    screenshot="/screenshots/cuisines.png"
                    screenshotAlt="Cuisines on store-front"
                  />
                </Label>
              {isEditing ? (
                <div className="space-y-[var(--p-space-200)]">
                  {cuisinesLoading ? (
                    <div className="h-9 w-full rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
                  ) : (
                    <SearchableSelect
                      options={availableCuisines.map((cuisine) => ({
                        value: cuisine.id,
                        label: cuisine.name,
                      }))}
                      value=""
                      onValueChange={handleCuisineChange}
                      placeholder={
                        availableCuisines.length === 0
                          ? "All cuisines selected"
                          : "Select cuisine to add"
                      }
                      searchPlaceholder="Search cuisines..."
                      emptyMessage="No cuisines found."
                      className="w-full"
                      disabled={
                        availableCuisines.length === 0 ||
                        updatePartialMutation.isPending
                      }
                      renderOption={(option) => (
                        <div className="flex items-center gap-[var(--p-space-200)]">
                          <span className="text-[1rem] leading-none shrink-0">{getCuisineEmoji(option.label)}</span>
                          <span>{option.label}</span>
                        </div>
                      )}
                    />
                  )}
                  {selectedCuisines.length > 0 && (
                    <div className="flex flex-wrap gap-[var(--p-space-200)] mt-[var(--p-space-200)]">
                      {selectedCuisines.map((cuisine) => (
                        <Tag key={cuisine.id} onRemove={() => handleRemoveCuisine(cuisine.id)}>
                          {getCuisineEmoji(cuisine.name)} {cuisine.name}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-[var(--p-space-200)]">
                  {selectedCuisines.length > 0 ? (
                    selectedCuisines.map((cuisine) => (
                      <Tag key={cuisine.id}>{getCuisineEmoji(cuisine.name)} {cuisine.name}</Tag>
                    ))
                  ) : (
                    <span className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">
                      No cuisines added
                    </span>
                  )}
                </div>
              )}
              </div>
            </CardWrap>

            {/* Branding Section */}
            <CardWrap visible={!activeSection || activeSection === "branding"}>
              <div className="space-y-[var(--p-space-150)]">
                <Label className="flex items-center gap-[var(--p-space-100)]">
                  Banner Image
                  <StoreFrontIndicator
                    description="The banner image is displayed at the top of your store-front profile page."
                    screenshot="/screenshots/banner-image.png"
                    screenshotAlt="Banner image on store-front"
                  />
                </Label>
                <div className="relative">
                  <ImageUpload
                    preview={bannerPreviewUrl || bannerImageUrl}
                    onRemove={() => setIsRemoveBannerDialogOpen(true)}
                    onDrop={(files) => handleBannerFilesChange(files[0] || null)}
                    disabled={!isEditing || isUploadingBanner}
                    maxSize={10 * 1024 * 1024}
                    label="Upload banner image"
                    hint="Recommended: 1920x600px. JPG, PNG, or WebP"
                  />
                  {/* Upload progress overlay */}
                  {isUploadingBanner && (bannerPreviewUrl || bannerImageUrl) && (
                    <div className="absolute inset-0 bg-black/60 rounded-[var(--p-border-radius-300)] flex flex-col items-center justify-center gap-[var(--p-space-300)] p-[var(--p-space-400)]">
                      <Spinner size="small" />
                      <div className="w-full max-w-md space-y-[var(--p-space-100)]">
                        <div className="flex items-center justify-between text-[0.6875rem]">
                          <span className="font-[var(--p-font-weight-medium)] text-white">
                            {bannerUploadProgress < 80 ? "Uploading..." : bannerUploadProgress < 90 ? "Processing..." : bannerUploadProgress < 100 ? "Saving..." : "Done!"}
                          </span>
                          <span className="text-white/80 tabular-nums">{bannerUploadProgress}%</span>
                        </div>
                        <ProgressBar progress={bannerUploadProgress} size="small" />
                      </div>
                    </div>
                  )}
                  {/* Success flash */}
                  {bannerUploadSuccess && !isUploadingBanner && (
                    <div className="absolute inset-0 bg-[var(--p-color-bg-fill-success)]/70 rounded-[var(--p-border-radius-300)] flex items-center justify-center pointer-events-none">
                      <CheckCircleIcon className="size-8 fill-white" />
                    </div>
                  )}
                </div>
                <FieldError message={form.formState.errors.bannerImage?.message} />
              </div>
            </CardWrap>
          </form>

      {/* Confirmation Dialog for Removing Cuisine */}
      <ConfirmationDialog
        open={isRemoveCuisineDialogOpen}
        onOpenChange={(open) => {
          setIsRemoveCuisineDialogOpen(open);
          if (!open) {
            // Reset when dialog closes without confirming
            setCuisineToRemove(null);
          }
        }}
        type="delete"
        title="Remove Cuisine"
        description={`Are you sure you want to remove "${
          cuisineToRemove
            ? cuisines?.find((c) => c.id === cuisineToRemove)?.name ||
              cuisineToRemove
            : ""
        }" from your profile?`}
        warning="Note: If you have dishes linked to this cuisine, removing it may affect how customers find your dishes. You can always add it back later."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={confirmRemoveCuisine}
        variant="destructive"
      />

      {/* Confirmation Dialog for Removing Banner Image */}
      <ConfirmationDialog
        open={isRemoveBannerDialogOpen}
        onOpenChange={setIsRemoveBannerDialogOpen}
        type="delete"
        title="Remove Banner Image"
        description="Are you sure you want to remove the banner image from your profile? This action cannot be undone."
        warning="The banner image will be permanently deleted from your profile and storage."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={confirmRemoveBanner}
        isLoading={isDeletingBanner || updatePartialMutation.isPending}
        variant="destructive"
      />
    </div>
  );
}
