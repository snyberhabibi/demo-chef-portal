"use client";

import { createContext, useContext, useEffect, useRef, useCallback, useState } from "react";
import { supabase } from "@/lib/supabase/browser-client";
import { authService } from "@/services/auth.service";
import { loginAction, logoutAction, updatePasswordAction, getSessionAction } from "@/actions/auth";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "@/components/ui/toast"
import posthog from "posthog-js";
import type {
  User,
  AuthContextType,
  ForgotPasswordData,
  ResetPasswordData,
  ForgotPasswordResponse,
  ResetPasswordResponse
} from "@/types/auth.types";
import type { ApiResponse } from "@/lib/http-client";
import { useSessionKeepAlive } from "@/hooks/use-session-keep-alive";

// Analytics helper for auth events (uses posthog directly to avoid circular dependencies)
function trackAuthEvent(eventName: string, properties?: Record<string, unknown>) {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.capture(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
      portal: "chef",
    });
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isMountedRef = useRef(true);

  const currentPathname = typeof window !== "undefined" 
    ? window.location.pathname 
    : (pathname ?? "");
  const isAuthPage = currentPathname.startsWith("/auth");

  useSessionKeepAlive(!isAuthPage);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAutomaticLogoutRef = useRef(false);

  const fetchUser = useCallback(async () => {
    if (isAuthPage) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.getCurrentUser();
      
      if (!response.data.success || !response.data.user) {
        if (isMountedRef.current) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      const payloadUser = response.data.user;

      if (isMountedRef.current) {
        setUser(payloadUser);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      if (isMountedRef.current) {
        setUser(null);
        setIsLoading(false);
      }
    }
  }, [isAuthPage]);

  useEffect(() => {
    queueMicrotask(fetchUser);
  }, [fetchUser]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleLogout = useCallback(async () => {
    await authService.logout();

    setUser(null);
    if (!isAuthPage) {
      if (isAutomaticLogoutRef.current) {
        toast.error("Unauthorized. Only chefs can access this portal.");
        isAutomaticLogoutRef.current = false;
      }
      router.push("/auth/login");
    }
  }, [isAuthPage, router]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
      }
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        fetchUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUser]);

  const logoutInitiatedRef = useRef<string | null>(null);

  useEffect(() => {
    if (user && !isAuthPage) {
      if (logoutInitiatedRef.current !== user.id) {
        logoutInitiatedRef.current = null;
      }

      if (user.role !== "chef" && logoutInitiatedRef.current !== user.id) {
        logoutInitiatedRef.current = user.id;
        isAutomaticLogoutRef.current = true;
        queueMicrotask(handleLogout);
      }
    } else if (!user) {
      logoutInitiatedRef.current = null;
    }
  }, [user, isAuthPage, handleLogout]);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const { data, error } = await loginAction(email, password);

    if (error) {
      throw new Error("Login failed. Please try again.");
    }

    if (!data.session || !data.user) {
      throw new Error("No session established");
    }

    const payloadUserResponse = await authService.getCurrentUser();

    if (!payloadUserResponse.data.success || !payloadUserResponse.data.user) {
      await logoutAction();
      throw new Error("Failed to get user information");
    }

    const payloadUser = payloadUserResponse.data.user;

    if (payloadUser.role !== "chef") {
      await logoutAction();
      throw new Error("Unauthorized. Only chefs can access this portal.");
    }

    if (payloadUser.status && payloadUser.status !== "active") {
      await logoutAction();
      throw new Error("Account is not active, please contact support");
    }

    setUser(payloadUser);
    trackAuthEvent("logged_in");
    const userName = payloadUser.name || payloadUser.email || "Chef";
    toast.success(`Welcome back, ${userName}!`);
    router.push("/dashboard");
  }, [router]);

  const handleForgotPassword = useCallback(async (data: ForgotPasswordData): Promise<ApiResponse<ForgotPasswordResponse>> => {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw error;
    }

    return {
      data: {
        success: true,
        message: "Password reset link sent! Check your email.",
      },
      status: 200,
    };
  }, []);

  const handleResetPassword = useCallback(async (data: ResetPasswordData): Promise<ApiResponse<ResetPasswordResponse>> => {
    const { data: sessionData } = await getSessionAction();

    if (!sessionData.session) {
      throw new Error("Session expired. Please verify OTP again from the forgot password page.");
    }

    const { error: updateError } = await updatePasswordAction(data.password);

    if (updateError) {
      throw updateError;
    }

    await logoutAction();

    return {
      data: {
        success: true,
        message: "Password reset successfully",
      },
      status: 200,
    };
  }, []);

  const handleRefreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  const value: AuthContextType = {
    user: user && user.role === "chef" ? user : null,
    isLoading,
    isAuthenticated: !!(user && user.role === "chef"),
    login: handleLogin,
    logout: async () => {
      isAutomaticLogoutRef.current = false;
      await handleLogout();
    },
    refreshUser: handleRefreshUser,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
