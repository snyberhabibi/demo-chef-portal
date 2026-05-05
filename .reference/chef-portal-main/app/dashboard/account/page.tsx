"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useUserAccount,
  useUpdateUserAccount,
  useChangePassword,
  useForceUnlock,
} from "@/hooks/use-user-account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Lock, Unlock, Loader2, User } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { mapServerError, formatRHFErrors, showValidationToast } from "@/lib/validation-error-mapper";
import { OptimizedImage, BackButton } from "@/components/shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Format phone input
const formatPhoneInput = (value: string): string => {
  return value.replace(/[^\d\s\-\.\+]/g, "");
};

const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountSchema>;

export default function AccountSettingsPage() {
  const { data: account, isLoading } = useUserAccount();
  const updateMutation = useUpdateUserAccount();
  const changePasswordMutation = useChangePassword();
  const forceUnlockMutation = useForceUnlock();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  // Sync form with account data
  useEffect(() => {
    if (account) {
      form.reset({
        name: account.name || "",
        phone: account.phone || "",
      });
      queueMicrotask(() => {
        if (account.avatar && typeof account.avatar === "object" && account.avatar.url) {
          setAvatarPreview(account.avatar.url);
        } else if (typeof account.avatar === "string") {
          setAvatarPreview(account.avatar);
        }
      });
    }
  }, [account, form]);

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle avatar removal
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle avatar edit
  const handleEditAvatar = () => {
    fileInputRef.current?.click();
  };

  const onInvalid = (errors: Record<string, { message?: string }>) => {
    const { messages } = formatRHFErrors(errors, { name: "Name" });
    showValidationToast(messages, toast);
  };

  const onSubmit = async (values: AccountFormValues) => {
    try {
      await updateMutation.mutateAsync({
        name: values.name,
        phone: values.phone,
        avatar: avatarFile || (avatarPreview === null ? "" : undefined),
      });
      toast.success("Account updated successfully");
      setAvatarFile(null);
    } catch (error) {
      console.error("Update account error:", error);
      const mapped = mapServerError(error);

      if (mapped.isValidationError && Object.keys(mapped.fieldErrors).length > 0) {
        Object.entries(mapped.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof AccountFormValues, { type: "server", message });
        });
      }

      showValidationToast(
        mapped.toastMessages.length > 0 ? mapped.toastMessages : ["Failed to update account"],
        toast
      );
    }
  };

  const handleChangePassword = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      await changePasswordMutation.mutateAsync({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully");
      setIsChangePasswordOpen(false);
    } catch (error) {
      toast.error("Failed to change password");
      console.error("Change password error:", error);
    }
  };

  const handleForceUnlock = async () => {
    try {
      await forceUnlockMutation.mutateAsync();
      toast.success("Account unlocked successfully");
    } catch (error) {
      toast.error("Failed to unlock account");
      console.error("Force unlock error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  const userAccount = account;
  const avatarUrl =
    avatarPreview ||
    (userAccount?.avatar &&
      typeof userAccount.avatar === "object" &&
      userAccount.avatar.url
      ? userAccount.avatar.url
      : typeof userAccount?.avatar === "string"
      ? userAccount.avatar
      : null);

  return (
    <div className="space-y-4 max-w-3xl">
      <BackButton href="/dashboard" label="Back to dashboard" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Account Settings</h2>
          <p className="text-muted-foreground mt-2">
            Manage your account information and preferences
          </p>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit, onInvalid)}
          disabled={updateMutation.isPending}
          className="w-full sm:w-auto"
        >
          {updateMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-4">
          {/* Profile Section */}
          <div className="rounded-lg border bg-card p-5">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            <div className="space-y-4">
              {/* Avatar */}
              <div className="space-y-2">
                <FormLabel>Profile Picture</FormLabel>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 bg-muted shrink-0">
                    {avatarUrl ? (
                      <OptimizedImage
                        src={avatarUrl}
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-primary/10">
                        <User className="h-10 w-10 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleEditAvatar}
                    >
                      {avatarUrl ? "Change" : "Upload"}
                    </Button>
                    {avatarUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveAvatar}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your full name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <div className="space-y-2">
                <FormLabel>Email Address</FormLabel>
                <Input
                  value={userAccount?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your phone number"
                        type="tel"
                        onChange={(e) => {
                          const formatted = formatPhoneInput(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Security Section */}
          <div className="rounded-lg border bg-card p-5">
            <h3 className="text-lg font-semibold mb-4">Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">
                    Change your password to keep your account secure
                  </p>
                </div>
                <Dialog
                  open={isChangePasswordOpen}
                  onOpenChange={setIsChangePasswordOpen}
                >
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline">
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new password
                      </DialogDescription>
                    </DialogHeader>
                    <ChangePasswordForm
                      onSubmit={handleChangePassword}
                      isLoading={changePasswordMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                <div>
                  <p className="font-medium">Account Lock</p>
                  <p className="text-sm text-muted-foreground">
                    Force unlock your account if it gets locked
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleForceUnlock}
                  disabled={forceUnlockMutation.isPending}
                >
                  {forceUnlockMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Unlock className="mr-2 h-4 w-4" />
                  )}
                  Force Unlock
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

// Change Password Form Component
function ChangePasswordForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
  isLoading: boolean;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ currentPassword, newPassword, confirmPassword });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Current Password</label>
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">New Password</label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Confirm Password</label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Change Password
        </Button>
      </div>
    </form>
  );
}
