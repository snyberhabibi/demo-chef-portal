"use client";

/**
 * Chef Profile Page
 *
 * FormWizard layout matching dish/bundle create/edit for consistency.
 * Steps: Profile Details, Operations (Business Info & Achievements hidden for now)
 */

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useChefProfile, useUpdateChefProfile } from "@/hooks/use-chef-profile";
import type { UpdateChefProfileData, ChefProfile } from "@/types/chef-profile.types";
import { toast } from "@/components/ui/toast";
import { LoadingOverlay } from "@/components/shared";
import { FormErrorAlert } from "@/components/shared/form-error-alert";
import { getGeneralErrorMessage, extractFieldErrors } from "@/lib/form-errors";
import { mapServerError, showValidationToast } from "@/lib/validation-error-mapper";
import { useLoading } from "@/contexts/loading-context";
import {
  Breadcrumb,
  Button,
  Badge,
  Spinner,
  FormWizard,
  FormWizardSkeleton,
} from "@/components/polaris";
import type { WizardStep } from "@/components/polaris";
import {
  ProfileDetailsTab,
  BusinessInfoTab,
  OperationsTab,
  AchievementsTab,
} from "@/components/features/chef-profile";
import type { ProfileSection } from "@/components/features/chef-profile/profile-details-tab";

const stepTips: Record<string, string> = {
  "basic-info": "Use a clear, memorable business name that customers will recognize.",
  "about-you": "Write a compelling bio and share your story to connect with customers.",
  cuisines: "Select the cuisines you specialize in to help customers find you.",
  branding: "Upload a high-quality banner image (1920x600px) for your store-front.",
  operations: "Set your timezone, configure your weekly schedule, and choose whether to auto-accept orders.",
};

// Map wizard step IDs to ProfileDetailsTab sections
const profileSectionMap: Record<string, ProfileSection> = {
  "basic-info": "basic-info",
  "about-you": "about-you",
  cuisines: "cuisines",
  branding: "branding",
};

export default function ChefProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: profile, isLoading } = useChefProfile();
  const updateMutation = useUpdateChefProfile();
  const { showLoading, hideLoading } = useLoading();

  const validStepIds = ["basic-info", "about-you", "cuisines", "branding", "operations"];
  const tabFromUrl = searchParams.get("tab");
  const initialTab = tabFromUrl && validStepIds.includes(tabFromUrl) ? tabFromUrl : "basic-info";
  const [activeTab, setActiveTab] = useState(initialTab);

  const setActiveTabWithUrl = useCallback((tab: string) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  }, []);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [, setFieldErrors] = useState<Record<string, string>>({});
  const formRefs = useRef<{
    profileDetails?: {
      submit: () => void;
      setFieldError?: (field: string, message: string) => void;
      hasErrors?: () => boolean;
      isDirty?: () => boolean;
      validate?: () => Promise<boolean>;
    };
    businessInfo?: {
      submit: () => void;
      setFieldError?: (field: string, message: string) => void;
      hasErrors?: () => boolean;
      isDirty?: () => boolean;
      validate?: () => Promise<boolean>;
    };
    operations?: {
      submit: () => void;
      setFieldError?: (field: string, message: string) => void;
      hasErrors?: () => boolean;
      isDirty?: () => boolean;
      validate?: () => Promise<boolean>;
    };
    achievements?: {
      submit: () => void;
      setFieldError?: (field: string, message: string) => void;
      hasErrors?: () => boolean;
      isDirty?: () => boolean;
      validate?: () => Promise<boolean>;
    };
  }>({});

  const [isFormDirty, setIsFormDirty] = useState(false);

  // Mark form dirty on any user interaction — no polling
  const markDirty = useCallback(() => {
    if (!isFormDirty) setIsFormDirty(true);
  }, [isFormDirty]);

  // Reset dirty state when profile data refreshes from server
  useEffect(() => {
    setIsFormDirty(false);
  }, [profile]);

  // Wizard steps — profile details split into focused sections
  const wizardSteps: WizardStep[] = useMemo(() => [
    {
      id: "basic-info",
      title: "Basic Info",
      description: "Business name & experience",
      isComplete: !!profile?.businessName,
      errorCount: 0,
    },
    {
      id: "about-you",
      title: "About You",
      description: "Bio, story & inspiration",
      isComplete: !!(profile?.bio || profile?.story),
    },
    {
      id: "cuisines",
      title: "Cuisines",
      description: "Specialties & cuisine types",
      isComplete: (profile?.cuisines?.length || 0) > 0,
    },
    {
      id: "branding",
      title: "Branding",
      description: "Banner image for store-front",
      isComplete: !!(profile?.bannerImage || profile?.bannerImageUrl),
    },
    {
      id: "operations",
      title: "Operations",
      description: "Availability & order settings",
      isComplete: !!profile?.timezone,
    },
  ], [profile]);

  const stepIndex = wizardSteps.findIndex((s) => s.id === activeTab);
  const activeStepIndex = stepIndex >= 0 ? stepIndex : 0;

  const handleStepChange = (index: number) => {
    const step = wizardSteps[index];
    if (step) setActiveTabWithUrl(step.id);
  };

  // Progress
  const progress = useMemo(() => {
    let filled = 0;
    const total = 5;
    if (profile?.businessName) filled++;
    if (profile?.bio || profile?.story) filled++;
    if ((profile?.cuisines?.length || 0) > 0) filled++;
    if (profile?.bannerImage || profile?.bannerImageUrl) filled++;
    if (profile?.timezone) filled++;
    return Math.round((filled / total) * 100);
  }, [profile]);

  const pendingFormDataRef = useRef<UpdateChefProfileData>({});
  const [formsSubmitted, setFormsSubmitted] = useState(0);
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const totalForms = 4;

  const fieldMapping: Record<string, { tab: string; field: string }> = {
    businessName: { tab: "profileDetails", field: "businessName" },
    bio: { tab: "profileDetails", field: "bio" },
    story: { tab: "profileDetails", field: "story" },
    whatInspiresMe: { tab: "profileDetails", field: "whatInspiresMe" },
    experience: { tab: "profileDetails", field: "experience" },
    cuisines: { tab: "profileDetails", field: "cuisines" },
    bannerImage: { tab: "profileDetails", field: "bannerImage" },
    licenseNumber: { tab: "businessInfo", field: "licenseNumber" },
    taxId: { tab: "businessInfo", field: "taxId" },
    timezone: { tab: "operations", field: "timezone" },
    available: { tab: "operations", field: "available" },
    autoAcceptOrders: { tab: "operations", field: "autoAcceptOrders" },
    availability: { tab: "operations", field: "availabilitySchedule" },
    availabilitySchedule: { tab: "operations", field: "availabilitySchedule" },
    achievements: { tab: "achievements", field: "achievements" },
  };

  const handleServerError = (error: unknown) => {
    const extractedErrors = extractFieldErrors(error);
    setFieldErrors(extractedErrors);
    let hasGeneralError = false;
    Object.entries(extractedErrors).forEach(([field, message]) => {
      if (field === "root") { setGeneralError(message); hasGeneralError = true; return; }
      const mapping = fieldMapping[field];
      if (mapping) {
        formRefs.current[mapping.tab as keyof typeof formRefs.current]?.setFieldError?.(mapping.field, message);
      } else {
        setGeneralError((prev) => prev ? `${prev}. ${field}: ${message}` : `${field}: ${message}`);
        hasGeneralError = true;
      }
    });
    const mapped = mapServerError(error);
    const errorMessage = mapped.toastMessages[0] || getGeneralErrorMessage(error) || "Failed to update profile";
    if (!hasGeneralError) setGeneralError(errorMessage);
    showValidationToast(mapped.toastMessages.length > 0 ? mapped.toastMessages : [errorMessage], toast);
  };

  const submitPendingData = async () => {
    try {
      setGeneralError(null); setFieldErrors({});
      showLoading();
      await updateMutation.mutateAsync(pendingFormDataRef.current);
      toast.success("Profile updated successfully");
      pendingFormDataRef.current = {};
      setFormsSubmitted(0);
      setIsFormDirty(false);
    } catch (error) {
      handleServerError(error);
    } finally {
      hideLoading();
    }
  };

  const handleSave = async () => {
    const validationResults = await Promise.all([
      formRefs.current.profileDetails?.validate?.(),
      formRefs.current.businessInfo?.validate?.(),
      formRefs.current.operations?.validate?.(),
      formRefs.current.achievements?.validate?.(),
    ]);
    const hasValidationErrors = validationResults.some((r) => r === false) ||
      formRefs.current.profileDetails?.hasErrors?.() ||
      formRefs.current.businessInfo?.hasErrors?.() ||
      formRefs.current.operations?.hasErrors?.() ||
      formRefs.current.achievements?.hasErrors?.();
    if (hasValidationErrors) { toast.error("Please fix validation errors before saving"); return; }

    pendingFormDataRef.current = {};
    setFormsSubmitted(0);
    setGeneralError(null); setFieldErrors({});
    if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);

    formRefs.current.profileDetails?.submit();
    formRefs.current.businessInfo?.submit();
    formRefs.current.operations?.submit();
    formRefs.current.achievements?.submit();

    submitTimeoutRef.current = setTimeout(() => {
      if (Object.keys(pendingFormDataRef.current).length > 0) submitPendingData();
    }, 500);
  };

  const handleSaveImmediate = async (formData: Partial<ChefProfile>) => {
    try {
      setGeneralError(null); setFieldErrors({});
      await updateMutation.mutateAsync(formData as UpdateChefProfileData);
      toast.success("Profile updated successfully");
      setIsFormDirty(false);
    } catch (error) {
      handleServerError(error);
      throw error;
    }
  };

  const handleSaveData = async (formData: Partial<ChefProfile>) => {
    pendingFormDataRef.current = { ...pendingFormDataRef.current, ...formData as UpdateChefProfileData };
    const newCount = formsSubmitted + 1;
    setFormsSubmitted(newCount);
    if (newCount === totalForms) {
      if (submitTimeoutRef.current) { clearTimeout(submitTimeoutRef.current); submitTimeoutRef.current = null; }
      submitPendingData();
    }
  };

  useEffect(() => {
    return () => { if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current); };
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-[var(--p-space-500)]">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Profile" },
        ]} />
        <FormWizardSkeleton stepCount={5} />
      </div>
    );
  }

  const chefProfile = profile;
  const isBusy = updateMutation.isPending;

  return (
    <div className="relative sm:rounded-[var(--p-border-radius-400)] sm:overflow-hidden">
      {isBusy && <LoadingOverlay />}

      {/* Breadcrumb bar — attached to FormWizard */}
      <div className="px-[var(--p-space-500)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)]">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Profile" },
        ]} />
      </div>

      {/* General Error */}
      {generalError && (
        <div className="px-[var(--p-space-500)] py-[var(--p-space-300)]">
          <FormErrorAlert error={generalError} />
        </div>
      )}

      {/* FormWizard */}
      <FormWizard
        steps={wizardSteps}
        activeStep={activeStepIndex}
        onStepChange={handleStepChange}
        pageTitle={chefProfile?.businessName || "Chef Profile"}
        progress={progress}
        tip={stepTips[activeTab]}
        statusBadge={
          <Badge tone={chefProfile?.available ? "success" : "warning"} size="sm">
            {chefProfile?.available ? "Available" : "Unavailable"}
          </Badge>
        }
        headerActions={
          <>
            <Button variant="tertiary" onClick={() => router.push("/dashboard")}>
              Discard
            </Button>
            <Button
              onClick={handleSave}
              disabled={isBusy || !isFormDirty}
              data-testid="profile-save-button"
            >
              {isBusy && <Spinner size="small" />}
              {isBusy ? "Saving..." : "Save"}
            </Button>
          </>
        }
        onBeforeNext={() => true}
        onComplete={handleSave}
      >
        {/* ProfileDetailsTab handles all 4 profile sections via activeSection prop */}
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div style={{ display: profileSectionMap[activeTab] ? "block" : "none" }} onInput={markDirty} onChange={markDirty}>
          <ProfileDetailsTab
            profile={chefProfile}
            isEditing={true}
            onSave={handleSaveData}
            activeSection={profileSectionMap[activeTab]}
            formRef={(ref) => { formRefs.current.profileDetails = ref; }}
          />
        </div>

        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div style={{ display: activeTab === "operations" ? "block" : "none" }} onInput={markDirty} onChange={markDirty}>
          <OperationsTab
            profile={chefProfile}
            isEditing={true}
            onSave={handleSaveData}
            onSaveImmediate={handleSaveImmediate}
            formRef={(ref) => { formRefs.current.operations = ref; }}
          />
        </div>

        {/* Hidden sections — mounted but not shown, preserves hooks */}
        <div style={{ display: "none" }}>
          <BusinessInfoTab
            profile={chefProfile}
            isEditing={true}
            onSave={handleSaveData}
            formRef={(ref) => { formRefs.current.businessInfo = ref; }}
          />
          <AchievementsTab
            profile={chefProfile}
            isEditing={true}
            onSave={handleSaveData}
            formRef={(ref) => { formRefs.current.achievements = ref; }}
          />
        </div>
      </FormWizard>
    </div>
  );
}
