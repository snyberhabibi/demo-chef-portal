import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  userAccountService,
  type UpdateUserAccountData,
} from "@/services/user-account.service";
import { useAuth } from "@/components/providers";
import { useAnalytics } from "@/hooks/use-analytics";
import {
  changePasswordAction,
  updatePhoneAction,
  verifyPhoneOtpAction,
} from "@/actions/auth/auth-actions";

/**
 * Hook to get user account data
 * 
 * Uses auth context data as initial/fallback data to avoid unnecessary API calls.
 * Fetches from /user/account for additional fields like status, createdAt, updatedAt.
 */
export function useUserAccount() {
  const { user } = useAuth();
  
  const placeholderData = useMemo(() => {
    if (!user) return undefined;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone || undefined,
      avatar: user.avatar
        ? {
            url: user.avatar.url,
            filename: user.avatar.filename,
            size: user.avatar.filesize,
            width: user.avatar.width,
            height: user.avatar.height,
            mimeType: user.avatar.mimeType,
          }
        : undefined,
      status: "active" as const,
      createdAt: new Date().toISOString(),
    };
  }, [user]);
  
  return useQuery({
    queryKey: ["user-account"],
    queryFn: async () => {
      const response = await userAccountService.getUserAccount();
      return response.data;
    },
    placeholderData,
    // Refetch in background to get latest data (status, timestamps)
    refetchOnMount: true,
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter than auth context
  });
}

export function useUpdateUserAccount() {
  const queryClient = useQueryClient();
  const { trackAccountUpdated } = useAnalytics();

  return useMutation({
    mutationFn: (data: UpdateUserAccountData) =>
      userAccountService.updateUserAccount(data).then((response) => ({ response, payload: data })),
    onSuccess: ({ payload }) => {
      const updatedFields = Object.keys(payload).filter(
        (key) => payload[key as keyof UpdateUserAccountData] !== undefined
      );
      trackAccountUpdated(updatedFields);
      queryClient.invalidateQueries({ queryKey: ["user-account"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      const result = await changePasswordAction(
        data.oldPassword,
        data.newPassword
      );

      if (result.error) {
        throw new Error(result.error.message);
      }
    },
  });
}

export function useUpdatePhone() {
  const queryClient = useQueryClient();
  const updateAccount = useUpdateUserAccount();

  const sendOtp = useMutation({
    mutationFn: async (phone: string) => {
      const result = await updatePhoneAction(phone);
      if (result.error) {
        throw new Error(result.error.message);
      }
    },
  });

  const verifyOtp = useMutation({
    mutationFn: async ({ phone, token }: { phone: string; token: string }) => {
      const result = await verifyPhoneOtpAction(phone, token);
      if (result.error) {
        throw new Error(result.error.message);
      }
      // Sync verified phone to backend API
      await updateAccount.mutateAsync({ phone });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-account"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });

  return { sendOtp, verifyOtp };
}

export function useForceUnlock() {
  return useMutation({
    mutationFn: () => userAccountService.forceUnlock(),
  });
}

