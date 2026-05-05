import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  stripeConnectService,
  type StripeConnectOnboardRequest,
} from "@/services/stripe-connect.service";
import { http } from "@/lib/http-client";
import { endpoints } from "@/config/endpoints";
import type { ChefProfileApiResponse } from "@/types/chef-profile.types";
import { useAnalytics } from "@/hooks/use-analytics";

/**
 * Fetches Stripe Connect status from the chef-portal/profile endpoint.
 * The chefs/me endpoint does not include stripeConnect fields,
 * so payment-methods uses this dedicated hook.
 */
export function useChefStripeConnectStatus() {
  return useQuery({
    queryKey: ["chef-stripe-connect-status"],
    queryFn: () =>
      http.get<ChefProfileApiResponse>(endpoints.stripeConnect.profile),
    select: (response) => {
      const raw = response.data as ChefProfileApiResponse;
      return {
        stripeConnectAccountId: raw.stripeConnectAccountId ?? null,
        stripeConnectOnboardingStatus:
          raw.stripeConnectOnboardingStatus ?? null,
        stripeConnectAccountStatus: raw.stripeConnectAccountStatus ?? null,
        stripeConnectOnboardingUrl: raw.stripeConnectOnboardingUrl ?? null,
      };
    },
  });
}

export function useStripeConnectOnboard() {
  const queryClient = useQueryClient();
  const { trackStripeOnboardStarted } = useAnalytics();

  return useMutation({
    mutationFn: async (data: StripeConnectOnboardRequest) => {
      const response = await stripeConnectService.onboard(data);
      return response.data;
    },
    onSuccess: () => {
      trackStripeOnboardStarted();
      // Invalidate Stripe Connect status to refresh on return
      queryClient.invalidateQueries({ queryKey: ["chef-stripe-connect-status"] });
    },
  });
}

export function useStripeConnectDashboard() {
  const { trackStripeDashboardAccessed } = useAnalytics();

  return useMutation({
    mutationFn: async () => {
      const response = await stripeConnectService.connectDashboard();
      return response.data;
    },
    onSuccess: () => {
      trackStripeDashboardAccessed();
    },
  });
}
