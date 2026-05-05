import { http, type ApiResponse } from "@/lib/http-client";
import { endpoints } from "@/config/endpoints";

export interface StripeConnectOnboardRequest {
  returnUrl: string;
  refreshUrl: string;
}

export interface StripeConnectOnboardResponse {
  success: boolean;
  onboardingUrl: string;
  accountId: string;
}

export interface StripeConnectDashboardResponse {
  success: boolean;
  dashboardUrl: string;
}

class StripeConnectService {
  /**
   * Validates that a redirect URL belongs to the same origin to prevent open redirect attacks.
   */
  private validateRedirectUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      const currentOrigin =
        typeof window !== "undefined" ? window.location.origin : "";
      return parsed.origin === currentOrigin;
    } catch {
      return false;
    }
  }

  /**
   * Create Stripe Connect onboarding link
   * This endpoint can be used for:
   * 1. Initial onboarding - when creating a new Stripe Connect account
   * 2. Completing verification steps - when account has unmet requirements (restricted/pending)
   *
   * The backend will determine the appropriate onboarding flow based on the account's current state
   */
  async onboard(
    data: StripeConnectOnboardRequest
  ): Promise<ApiResponse<StripeConnectOnboardResponse>> {
    if (
      !this.validateRedirectUrl(data.returnUrl) ||
      !this.validateRedirectUrl(data.refreshUrl)
    ) {
      throw new Error(
        "Invalid redirect URL. For your security, redirect URLs must belong to the same site."
      );
    }

    return http.post<StripeConnectOnboardResponse>(
      endpoints.stripeConnect.onboard,
      data
    );
  }

  /**
   * Connect to Stripe Connect dashboard
   * This endpoint gets the dashboard login link
   */
  async connectDashboard(): Promise<
    ApiResponse<StripeConnectDashboardResponse>
  > {
    return http.post<StripeConnectDashboardResponse>(
      endpoints.stripeConnect.dashboard
    );
  }
}

export const stripeConnectService = new StripeConnectService();
