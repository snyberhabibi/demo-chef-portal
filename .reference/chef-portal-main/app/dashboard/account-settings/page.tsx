"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useUserAccount,
  useUpdateUserAccount,
  useChangePassword,
  useUpdatePhone,
} from "@/hooks/use-user-account";
import { useAuth } from "@/components/providers";
import { useLoading } from "@/contexts/loading-context";
import {
  CheckCircleIcon,
  PhoneIcon,
  LockIcon,
} from "@shopify/polaris-icons";
import {
  Breadcrumb,
  Button,
  Card,
  CardDivider,
  Input,
  Label,
  HelpText,
  Spinner,
  ProgressBar,
  PasswordInput,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  SkeletonText,
  ImageUpload,
} from "@/components/polaris";
import { FieldError } from "@/components/shared/field-error";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/components/ui/toast";
import { mapServerError, formatRHFErrors, showValidationToast } from "@/lib/validation-error-mapper";
import { LoadingOverlay } from "@/components/shared";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { processImageFile } from "@/lib/image-utils";
import { mediaService } from "@/services/media.service";

// Format phone input - only allow digits, spaces, dashes, dots, and +
const formatPhoneInput = (value: string): string => {
  return value.replace(/[^\d\s\-\.\+]/g, "");
};

// US Phone number validation
const validateUSPhone = (value: string): boolean => {
  const digitsOnly = value.replace(/[^\d+]/g, "");
  const digitCount = digitsOnly.replace(/\+/g, "").length;
  if (digitCount === 10) return true;
  if (digitCount === 11 && digitsOnly.replace(/\+/g, "").startsWith("1")) return true;
  if (digitCount === 11 && digitsOnly.startsWith("+1")) return true;
  return false;
};

// Normalize a US phone number to E.164 format (+1XXXXXXXXXX) for Supabase
const normalizeToE164 = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
};

const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type AccountFormValues = z.infer<typeof accountSchema>;

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  try {
    return format(new Date(dateString), "MMMM do yyyy, h:mm a");
  } catch {
    return dateString;
  }
};

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const { data: account, isLoading } = useUserAccount();
  const updateMutation = useUpdateUserAccount();
  const changePasswordMutation = useChangePassword();
  const { sendOtp, verifyOtp } = useUpdatePhone();
  const { setLoading } = useLoading();

  const displayAccount = useMemo(() => {
    if (account) return account;
    if (authUser) {
      return {
        id: authUser.id,
        email: authUser.email,
        name: authUser.name,
        role: authUser.role,
        phone: authUser.phone || undefined,
        avatar: authUser.avatar
          ? typeof authUser.avatar === "string"
            ? authUser.avatar
            : { url: authUser.avatar.url, filename: authUser.avatar.filename, size: authUser.avatar.filesize, width: authUser.avatar.width, height: authUser.avatar.height, mimeType: authUser.avatar.mimeType }
          : undefined,
        status: "active" as const,
        createdAt: new Date().toISOString(),
      };
    }
    return null;
  }, [account, authUser]);

  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [avatarUploadProgress, setAvatarUploadProgress] = useState<number>(0);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const [avatarUploadSuccess, setAvatarUploadSuccess] = useState(false);
  const avatarPreviewUrlRef = useRef<string | null>(null);
  const [isRemoveAvatarDialogOpen, setIsRemoveAvatarDialogOpen] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isChangePhoneOpen, setIsChangePhoneOpen] = useState(false);
  const [phoneStep, setPhoneStep] = useState<"enter" | "verify">("enter");
  const [newPhone, setNewPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: "" },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  // Sync form with account data
  useEffect(() => {
    if (!displayAccount) return;
    const currentName = form.getValues("name");
    const newName = displayAccount.name || "";
    if (currentName !== newName) {
      form.reset({ name: newName }, { keepDefaultValues: false });
    }
    if (displayAccount.avatar) {
      if (typeof displayAccount.avatar === "string") {
        setAvatarId(displayAccount.avatar);
        setAvatarUrl(displayAccount.avatar);
      } else {
        setAvatarId(displayAccount.avatar.id || null);
        setAvatarUrl(displayAccount.avatar.url || null);
      }
    } else {
      setAvatarId(null);
      setAvatarUrl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayAccount?.id, displayAccount?.name, displayAccount?.avatar, form]);

  // Avatar upload mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: async ({ file }: { file: File; previewUrl: string }) => {
      setIsUploadingAvatar(true);
      setAvatarUploadProgress(0);
      setAvatarUploadError(null);
      setAvatarUploadSuccess(false);
      try {
        const fileToUpload = await processImageFile(file);
        const onProgress = (progress: number) => setAvatarUploadProgress(Math.round(progress * 0.8));
        const uploadResult = await mediaService.uploadFile(fileToUpload, onProgress, "chef");
        setAvatarUploadProgress(85);
        const mediaResult = await mediaService.createChefMedia({
          publicUrl: uploadResult.publicUrl,
          filename: uploadResult.filename,
          mimeType: fileToUpload.type,
          filesize: fileToUpload.size,
          alt: `Avatar for ${displayAccount?.name || "user"}`,
        });
        setAvatarUploadProgress(90);
        if (mediaResult.data) {
          return { id: mediaResult.data.id, url: mediaResult.data.publicUrl, chefMedia: mediaResult.data };
        }
        throw new Error("Failed to create chef media");
      } catch (error) {
        setIsUploadingAvatar(false);
        const mapped = mapServerError(error);
        setAvatarUploadError(mapped.toastMessages[0] || "Upload failed");
        throw error;
      }
    },
    onSuccess: async (result) => {
      setAvatarId(result.id);
      setAvatarUrl(result.url);
      setAvatarUploadProgress(95);
      try {
        await updateMutation.mutateAsync({ avatar: result.id });
        setAvatarUploadProgress(100);
        setAvatarUploadSuccess(true);
        toast.success("Avatar uploaded and saved successfully");
      } catch (error) {
        setIsUploadingAvatar(false);
        console.error("Failed to update avatar:", error);
        const mapped = mapServerError(error);
        const errorMessage = mapped.toastMessages[0] || "Avatar uploaded but failed to save. Please try saving again.";
        setAvatarUploadError(errorMessage);
        toast.error(errorMessage);
      }
      setTimeout(() => {
        setIsUploadingAvatar(false);
        const previewUrlToClean = avatarPreviewUrlRef.current;
        if (previewUrlToClean) { URL.revokeObjectURL(previewUrlToClean); avatarPreviewUrlRef.current = null; }
        setAvatarPreviewUrl(null);
        setAvatarUploadProgress(0);
        setAvatarUploadSuccess(false);
      }, 1500);
    },
    onError: (error: Error) => {
      setIsUploadingAvatar(false);
      toast.error(`Failed to upload avatar: ${error.message}`);
    },
  });

  const handleAvatarChange = useCallback((files: File | File[] | null) => {
    if (files === null) {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
      if (avatarPreviewUrlRef.current) { URL.revokeObjectURL(avatarPreviewUrlRef.current); avatarPreviewUrlRef.current = null; }
      setAvatarId(null); setAvatarUrl(null); setAvatarPreviewUrl(null);
      setAvatarUploadProgress(0); setAvatarUploadError(null); setAvatarUploadSuccess(false);
      return;
    }
    const file = Array.isArray(files) ? files[0] : files;
    if (file) {
      setAvatarUploadError(null); setAvatarUploadSuccess(false);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreviewUrl(previewUrl);
      avatarPreviewUrlRef.current = previewUrl;
      uploadAvatarMutation.mutate({ file, previewUrl });
    }
  }, [uploadAvatarMutation, avatarPreviewUrl]);

  const handleRemoveAvatar = useCallback(async (index: number) => {
    if (index === 0 && avatarId) setIsRemoveAvatarDialogOpen(true);
  }, [avatarId]);

  const confirmRemoveAvatar = useCallback(async () => {
    if (!avatarId) {
      // Just a preview, not saved — clear locally
      handleAvatarChange(null);
      setIsRemoveAvatarDialogOpen(false);
      return;
    }
    const imageIdToDelete = avatarId;
    try {
      setIsDeletingAvatar(true);
      setIsRemoveAvatarDialogOpen(false);
      try { await mediaService.deleteChefMedia(imageIdToDelete); } catch (error) { console.error("Failed to delete avatar media:", error); }
      await updateMutation.mutateAsync({ avatar: null });
      setAvatarId(null); setAvatarUrl(null);
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
      if (avatarPreviewUrlRef.current) { URL.revokeObjectURL(avatarPreviewUrlRef.current); avatarPreviewUrlRef.current = null; }
      setAvatarPreviewUrl(null); setAvatarUploadProgress(0); setAvatarUploadError(null); setAvatarUploadSuccess(false);
      toast.success("Avatar removed successfully");
    } catch (error) {
      console.error("Failed to remove avatar:", error);
      const mapped = mapServerError(error);
      toast.error(mapped.toastMessages[0] || "Failed to remove avatar");
    } finally {
      setIsDeletingAvatar(false);
    }
  }, [avatarId, updateMutation, avatarPreviewUrl]);

  const avatarDisplayUrl = avatarPreviewUrl || avatarUrl;

  const onInvalid = (errors: Record<string, { message?: string }>) => {
    const { messages } = formatRHFErrors(errors, { name: "Name" });
    showValidationToast(messages, toast);
  };

  const onSubmit = async (values: AccountFormValues) => {
    try {
      setLoading(true);
      await updateMutation.mutateAsync({ name: values.name });
      toast.success("Account updated successfully");
    } catch (error) {
      console.error("Update account error:", error);
      const mapped = mapServerError(error);
      if (mapped.isValidationError && Object.keys(mapped.fieldErrors).length > 0) {
        Object.entries(mapped.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof AccountFormValues, { type: "server", message });
        });
      }
      showValidationToast(mapped.toastMessages.length > 0 ? mapped.toastMessages : ["Failed to update account"], toast);
    } finally {
      setLoading(false);
    }
  };

  // Phone change handlers
  const handleSendPhoneOtp = async () => {
    setPhoneError("");
    if (!validateUSPhone(newPhone)) { setPhoneError("Please enter a valid US phone number (e.g., 123-456-7890)"); return; }
    try {
      await sendOtp.mutateAsync(normalizeToE164(newPhone));
      setPhoneStep("verify");
      setResendCooldown(60);
    } catch (error) {
      const mapped = mapServerError(error);
      setPhoneError(mapped.toastMessages[0] || "Failed to send code");
    }
  };

  const handleVerifyPhoneOtp = async () => {
    setOtpError("");
    if (otpCode.length !== 6) { setOtpError("Please enter the 6-digit code"); return; }
    try {
      await verifyOtp.mutateAsync({ phone: normalizeToE164(newPhone), token: otpCode });
      toast.success("Phone number updated successfully");
      setIsChangePhoneOpen(false);
      resetPhoneDialog();
    } catch (error) {
      const mapped = mapServerError(error);
      setOtpError(mapped.toastMessages[0] || "Failed to verify code");
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    try {
      await sendOtp.mutateAsync(normalizeToE164(newPhone));
      setResendCooldown(60);
      toast.success("Verification code resent");
    } catch (error) {
      const mapped = mapServerError(error);
      toast.error(mapped.toastMessages[0] || "Failed to resend code");
    }
  };

  const resetPhoneDialog = () => {
    setPhoneStep("enter"); setNewPhone(""); setPhoneError("");
    setOtpCode(""); setOtpError(""); setResendCooldown(0);
  };

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    try {
      await changePasswordMutation.mutateAsync({ oldPassword: values.oldPassword, newPassword: values.newPassword });
      toast.success("Password changed successfully");
      setIsChangePasswordOpen(false);
      passwordForm.reset();
    } catch (error) {
      console.error("Change password error:", error);
      const mapped = mapServerError(error);
      toast.error(mapped.toastMessages[0] || "Failed to change password");
    }
  };

  // Cleanup avatar preview URL on unmount
  useEffect(() => {
    return () => {
      if (avatarPreviewUrlRef.current) URL.revokeObjectURL(avatarPreviewUrlRef.current);
      if (avatarPreviewUrl && avatarPreviewUrl.startsWith("blob:")) URL.revokeObjectURL(avatarPreviewUrl);
    };
  }, [avatarPreviewUrl]);

  // Loading state — show skeleton while account data is fetching
  if (isLoading && !account) {
    return (
      <div className="space-y-[var(--p-space-500)]">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Account Settings" },
        ]} />
        <div className="space-y-[var(--p-space-200)]">
          <div className="h-7 w-48 rounded bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
          <div className="h-4 w-72 rounded bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
        </div>
        <Card>
          <SkeletonText width="quarter" />
          <div className="space-y-[var(--p-space-400)] max-w-2xl mt-[var(--p-space-400)]">
            <div className="size-24 rounded-full bg-[var(--p-color-bg-fill-secondary)] animate-pulse mx-auto" />
            <div className="h-9 w-full rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
          </div>
        </Card>
        <Card>
          <SkeletonText width="third" />
          <div className="space-y-[var(--p-space-400)] max-w-2xl mt-[var(--p-space-400)]">
            <div className="h-9 w-full rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
            <div className="h-9 w-full rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
          </div>
        </Card>
        <Card>
          <SkeletonText width="quarter" />
          <div className="h-9 w-40 rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] animate-pulse mt-[var(--p-space-400)]" />
        </Card>
      </div>
    );
  }

  const userAccount = displayAccount;
  const newPasswordValue = passwordForm.watch("newPassword") || "";
  const passwordRequirements = [
    { met: newPasswordValue.length >= 6, label: "At least 6 characters" },
    { met: /[a-z]/.test(newPasswordValue), label: "One lowercase letter" },
    { met: /[A-Z]/.test(newPasswordValue), label: "One uppercase letter" },
    { met: /[0-9]/.test(newPasswordValue), label: "One number" },
  ];

  return (
    <div className="space-y-[var(--p-space-500)] relative">
      <LoadingOverlay />

      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        { label: "Account Settings" },
      ]} />

      {/* Header */}
      <div>
        <h2 className="text-[1.875rem] leading-[2.25rem] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-denser)] text-[var(--p-color-text)]" data-testid="account-settings-heading">
          Account Settings
        </h2>
        <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
          Manage your account information and preferences
        </p>
      </div>

      {/* ── Card 1: Profile ── */}
      <Card>
        <div className="flex items-center justify-between mb-[var(--p-space-400)]">
          <div>
            <h3 className="text-[0.9375rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
              Profile
            </h3>
            <HelpText>Your name and profile picture</HelpText>
          </div>
          <Button
            onClick={form.handleSubmit(onSubmit, onInvalid)}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending && <Spinner size="small" />}
            {updateMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
          <div className="space-y-[var(--p-space-500)] max-w-2xl">
            {/* Avatar */}
            <div className="space-y-[var(--p-space-300)]">
              <Label>Avatar</Label>
              <div className="relative max-w-xs">
                <ImageUpload
                  preview={avatarDisplayUrl}
                  onRemove={() => setIsRemoveAvatarDialogOpen(true)}
                  onDrop={(files) => handleAvatarChange(files[0] || null)}
                  disabled={isUploadingAvatar}
                  maxSize={5 * 1024 * 1024}
                  label="Upload avatar"
                  hint="JPG, PNG, or WebP. Max 5MB"
                />
                {/* Upload progress overlay */}
                {isUploadingAvatar && avatarDisplayUrl && (
                  <div className="absolute inset-0 bg-black/60 rounded-[var(--p-border-radius-300)] flex flex-col items-center justify-center gap-[var(--p-space-200)] p-[var(--p-space-400)]">
                    <Spinner size="small" />
                    <div className="w-full space-y-[var(--p-space-100)]">
                      <div className="flex items-center justify-between text-[0.6875rem]">
                        <span className="font-[var(--p-font-weight-medium)] text-white">
                          {avatarUploadProgress < 80 ? "Uploading..." : avatarUploadProgress < 90 ? "Processing..." : avatarUploadProgress < 100 ? "Saving..." : "Done!"}
                        </span>
                        <span className="text-white/80 tabular-nums">{avatarUploadProgress}%</span>
                      </div>
                      <ProgressBar progress={avatarUploadProgress} size="small" />
                    </div>
                  </div>
                )}
                {/* Success flash */}
                {avatarUploadSuccess && !isUploadingAvatar && (
                  <div className="absolute inset-0 bg-[var(--p-color-bg-fill-success)]/70 rounded-[var(--p-border-radius-300)] flex items-center justify-center pointer-events-none">
                    <CheckCircleIcon className="size-8 fill-white" />
                  </div>
                )}
              </div>
              <HelpText>Recommended size: 1500x1500px</HelpText>
            </div>

            <ConfirmationDialog
              open={isRemoveAvatarDialogOpen}
              onOpenChange={setIsRemoveAvatarDialogOpen}
              onConfirm={confirmRemoveAvatar}
              type="delete"
              title="Remove Avatar"
              description="Are you sure you want to remove your avatar? This action cannot be undone."
              confirmLabel="Remove"
              cancelLabel="Cancel"
              variant="destructive"
              isLoading={isDeletingAvatar}
            />

            {/* Name */}
            <div className="space-y-[var(--p-space-150)]">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your full name" {...form.register("name")} />
              <FieldError message={form.formState.errors.name?.message} />
            </div>
          </div>
        </form>
      </Card>

      {/* ── Card 2: Contact Information ── */}
      <Card>
        <div className="mb-[var(--p-space-400)]">
          <h3 className="text-[0.9375rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
            Contact Information
          </h3>
          <HelpText>Your email and phone number</HelpText>
        </div>

        <div className="space-y-[var(--p-space-400)] max-w-2xl">
          {/* Email */}
          <div className="space-y-[var(--p-space-150)]">
            <Label>Email</Label>
            <Input value={userAccount?.email || ""} disabled />
            <HelpText>Your email address cannot be changed</HelpText>
          </div>

          {/* Phone */}
          <div className="space-y-[var(--p-space-150)]">
            <Label>Phone</Label>
            <div className="flex items-center gap-[var(--p-space-200)]">
              <Input value={displayAccount?.phone || "Not set"} disabled className="flex-1" />
              <Button type="button" variant="secondary" onClick={() => setIsChangePhoneOpen(true)}>
                <PhoneIcon className="size-4 fill-current" />
                Change
              </Button>
            </div>
            <HelpText>Phone number is verified via SMS</HelpText>
          </div>
        </div>

        {userAccount?.createdAt && (
          <p className="text-[0.75rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-500)]">
            Account created: {formatDate(userAccount.createdAt)}
          </p>
        )}
      </Card>

      {/* ── Card 3: Security ── */}
      <Card>
        <div className="mb-[var(--p-space-400)]">
          <h3 className="text-[0.9375rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
            Security
          </h3>
          <HelpText>Manage your password and account security</HelpText>
        </div>

        <div className="max-w-2xl">
          <Button type="button" variant="secondary" onClick={() => setIsChangePasswordOpen(true)}>
            <LockIcon className="size-4 fill-current" />
            Change Password
          </Button>
        </div>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current password and choose a new password</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-[var(--p-space-400)]">
              <div className="space-y-[var(--p-space-150)]">
                <Label htmlFor="oldPassword">Current Password</Label>
                <PasswordInput
                  id="oldPassword"
                  placeholder="Enter current password"
                  {...passwordForm.register("oldPassword")}
                />
                <FieldError message={passwordForm.formState.errors.oldPassword?.message} />
              </div>

              <div className="space-y-[var(--p-space-150)]">
                <Label htmlFor="newPassword">New Password</Label>
                <PasswordInput
                  id="newPassword"
                  placeholder="Enter new password"
                  {...passwordForm.register("newPassword")}
                />
                <ul className="space-y-[var(--p-space-100)] mt-[var(--p-space-200)]">
                  {passwordRequirements.map((req) => (
                    <li
                      key={req.label}
                      className={`flex items-center gap-[var(--p-space-200)] text-[0.75rem] ${req.met ? "text-[var(--p-color-text-success)]" : "text-[var(--p-color-text-secondary)]"}`}
                    >
                      {req.met ? (
                        <CheckCircleIcon className="size-3.5 fill-current" />
                      ) : (
                        <div className="size-3.5 rounded-full border border-current" />
                      )}
                      {req.label}
                    </li>
                  ))}
                </ul>
                <FieldError message={passwordForm.formState.errors.newPassword?.message} />
              </div>

              <div className="space-y-[var(--p-space-150)]">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  {...passwordForm.register("confirmPassword")}
                />
                <FieldError message={passwordForm.formState.errors.confirmPassword?.message} />
              </div>
            </form>
          </DialogBody>
          <DialogFooter>
            <Button variant="tertiary" onClick={() => { setIsChangePasswordOpen(false); passwordForm.reset(); }}>
              Cancel
            </Button>
            <Button
              onClick={passwordForm.handleSubmit(onPasswordSubmit)}
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending && <Spinner size="small" />}
              {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Phone Dialog */}
      <Dialog
        open={isChangePhoneOpen}
        onOpenChange={(open) => { setIsChangePhoneOpen(open); if (!open) resetPhoneDialog(); }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Phone Number</DialogTitle>
            <DialogDescription>
              {phoneStep === "enter"
                ? "Enter your new phone number. We'll send a verification code via SMS."
                : `Enter the 6-digit code sent to ${newPhone}`}
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            {phoneStep === "enter" ? (
              <div className="space-y-[var(--p-space-400)]">
                <div className="space-y-[var(--p-space-150)]">
                  <Label>New Phone Number</Label>
                  <Input
                    type="tel"
                    placeholder="123-456-7890"
                    value={newPhone}
                    onChange={(e) => { setNewPhone(formatPhoneInput(e.target.value)); setPhoneError(""); }}
                  />
                  {phoneError && <p className="text-[0.8125rem] text-[var(--p-color-text-critical)]">{phoneError}</p>}
                </div>
              </div>
            ) : (
              <div className="space-y-[var(--p-space-400)]">
                <div className="space-y-[var(--p-space-200)]">
                  <Label>Verification Code</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otpCode}
                      onChange={(value) => { setOtpCode(value); setOtpError(""); }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {otpError && <p className="text-[0.8125rem] text-[var(--p-color-text-critical)] text-center">{otpError}</p>}
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    className="text-[0.8125rem] text-[var(--p-color-text-secondary)] hover:text-[var(--p-color-text)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0 || sendOtp.isPending}
                  >
                    {sendOtp.isPending ? "Sending..." : resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
                  </button>
                </div>
              </div>
            )}
          </DialogBody>
          <DialogFooter>
            {phoneStep === "enter" ? (
              <>
                <Button variant="tertiary" onClick={() => { setIsChangePhoneOpen(false); resetPhoneDialog(); }}>
                  Cancel
                </Button>
                <Button onClick={handleSendPhoneOtp} disabled={sendOtp.isPending}>
                  {sendOtp.isPending && <Spinner size="small" />}
                  {sendOtp.isPending ? "Sending..." : "Send Code"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="tertiary" onClick={() => { setPhoneStep("enter"); setOtpCode(""); setOtpError(""); }}>
                  Back
                </Button>
                <Button onClick={handleVerifyPhoneOtp} disabled={verifyOtp.isPending}>
                  {verifyOtp.isPending && <Spinner size="small" />}
                  {verifyOtp.isPending ? "Verifying..." : "Verify"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
