"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircleIcon,
  AlertCircleIcon,
  XCircleIcon,
  ClockIcon,
  CreditCardIcon,
  ExternalSmallIcon,
} from "@shopify/polaris-icons";
import {
  Breadcrumb,
  Card,
  CardDivider,
  Button,
  Badge,
  Banner,
  Spinner,
  SkeletonText,
  StatusDot,
} from "@/components/polaris";
import { useStripeConnectOnboard, useStripeConnectDashboard, useChefStripeConnectStatus } from "@/hooks/use-stripe-connect";
import { toast } from "@/components/ui/toast";
import { mapServerError } from "@/lib/validation-error-mapper";

export default function PaymentMethodsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasShownReturnToast = useRef(false);
  const lastOnboardingStatus = useRef<string | undefined>(undefined);

  const { data: stripeStatus, isLoading: isProfileLoading } = useChefStripeConnectStatus();
  const stripeConnectMutation = useStripeConnectOnboard();
  const stripeDashboardMutation = useStripeConnectDashboard();

  const accountStatus = stripeStatus?.stripeConnectAccountStatus;
  const onboardingStatus = stripeStatus?.stripeConnectOnboardingStatus;
  const stripeAccountId = stripeStatus?.stripeConnectAccountId ?? null;

  const isConnected = accountStatus === "enabled" && !!stripeAccountId;

  const shouldShowConnectButton = (() => {
    if (!stripeAccountId || onboardingStatus === "not_started") return true;
    if (accountStatus === "restricted" || accountStatus === "pending") return true;
    if (onboardingStatus === "failed") return true;
    return false;
  })();

  const isConnectButtonDisabled =
    accountStatus === "enabled" || stripeConnectMutation.isPending;

  // Return from Stripe onboarding toast
  useEffect(() => {
    if (isProfileLoading) return;
    const returnParam = searchParams.get("return");
    const stripeReturn = searchParams.get("stripe_return");
    const onboardingStatusChanged =
      lastOnboardingStatus.current === "in_progress" && onboardingStatus === "completed";
    lastOnboardingStatus.current = onboardingStatus ?? undefined;

    if ((returnParam === "true" || stripeReturn === "true" || onboardingStatusChanged) && !hasShownReturnToast.current) {
      hasShownReturnToast.current = true;
      toast.success("Thank you for completing the Stripe Connect setup! Your account is being verified.");
    }
  }, [searchParams, onboardingStatus, isProfileLoading]);

  const handleConnectStripe = async () => {
    try {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const response = await stripeConnectMutation.mutateAsync({
        returnUrl: `${baseUrl}/dashboard/payment-methods`,
        refreshUrl: `${baseUrl}/dashboard/payment-methods`,
      });
      if (response?.onboardingUrl) {
        window.location.href = response.onboardingUrl;
      } else {
        toast.error("Failed to get Stripe Connect onboarding URL");
      }
    } catch (error) {
      const mapped = mapServerError(error);
      toast.error(mapped.toastMessages[0] || "Failed to connect to Stripe. Please try again.");
    }
  };

  const handleViewDashboard = async () => {
    try {
      const response = await stripeDashboardMutation.mutateAsync();
      if (response?.dashboardUrl) {
        window.location.href = response.dashboardUrl;
      } else {
        toast.error("Failed to get Stripe dashboard URL");
      }
    } catch (error) {
      const mapped = mapServerError(error);
      toast.error(mapped.toastMessages[0] || "Failed to open Stripe dashboard. Please try again.");
    }
  };

  // Status config
  const getStatusInfo = () => {
    if (isConnected) return { tone: "success" as const, label: "Enabled", dotTone: "success" as const };
    if (accountStatus === "disabled") return { tone: "critical" as const, label: "Disabled", dotTone: "critical" as const };
    if (accountStatus === "restricted") return { tone: "attention" as const, label: "Restricted", dotTone: "warning" as const };
    if (accountStatus === "pending") return { tone: "default" as const, label: "Pending", dotTone: "warning" as const };
    if (onboardingStatus === "in_progress") return { tone: "info" as const, label: "Onboarding...", dotTone: "warning" as const };
    if (onboardingStatus === "failed") return { tone: "critical" as const, label: "Failed", dotTone: "critical" as const };
    return { tone: "default" as const, label: "Not Connected", dotTone: "warning" as const };
  };

  const status = getStatusInfo();

  // Loading state
  if (isProfileLoading) {
    return (
      <div className="space-y-[var(--p-space-500)]">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Payment Methods" },
        ]} />
        <div className="space-y-[var(--p-space-200)]">
          <div className="h-7 w-48 rounded bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
          <div className="h-4 w-72 rounded bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
        </div>
        <Card>
          <div className="flex items-center justify-between mb-[var(--p-space-400)]">
            <SkeletonText width="third" />
            <div className="h-6 w-20 rounded-full bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
          </div>
          <div className="h-24 w-full rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] animate-pulse" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-[var(--p-space-500)]">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        { label: "Payment Methods" },
      ]} />

      {/* Header */}
      <div>
        <h2 className="text-[1.875rem] leading-[2.25rem] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-denser)] text-[var(--p-color-text)]">
          Payment Methods
        </h2>
        <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
          Connect your Stripe account to receive payments from orders
        </p>
      </div>

      {/* Stripe Connect Card */}
      <Card>
        <div className="flex items-center justify-between mb-[var(--p-space-400)]">
          <div>
            <h3 className="text-[0.9375rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
              Stripe Connect
            </h3>
            <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-025)]">
              Manage your payment processing account
            </p>
          </div>
          <span className="inline-flex items-center gap-[var(--p-space-100)] bg-[var(--p-color-bg-surface)]/90 backdrop-blur-sm px-[var(--p-space-200)] py-[var(--p-space-050)] rounded-[var(--p-border-radius-full)] shadow-[var(--p-shadow-100)]">
            <StatusDot tone={status.dotTone} size="sm" />
            <span className="text-[0.6875rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)]">
              {status.label}
            </span>
          </span>
        </div>

        {isConnected ? (
          /* Enabled */
          <div className="space-y-[var(--p-space-400)]">
            <Banner tone="success">
              <p>Your Stripe account is active. You can process payments and receive payouts.</p>
              {stripeAccountId && (
                <p className="mt-[var(--p-space-100)] text-[0.75rem]">Account ID: {stripeAccountId}</p>
              )}
            </Banner>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={handleViewDashboard} disabled={stripeDashboardMutation.isPending}>
                {stripeDashboardMutation.isPending ? <Spinner size="small" /> : <ExternalSmallIcon className="size-4 fill-current" />}
                {stripeDashboardMutation.isPending ? "Loading..." : "View Dashboard"}
              </Button>
            </div>
          </div>
        ) : accountStatus === "restricted" || accountStatus === "pending" ? (
          /* Restricted / Pending */
          <div className="space-y-[var(--p-space-400)]">
            <Banner tone="warning">
              <p>
                {accountStatus === "restricted"
                  ? "Your account has limitations due to missing information. Complete verification to restore full functionality."
                  : "Your account is under review. Complete onboarding to enable payments."}
              </p>
              {onboardingStatus === "completed" && (
                <p className="mt-[var(--p-space-100)] font-[var(--p-font-weight-medium)]">Onboarding completed — verification in progress</p>
              )}
            </Banner>
            <div className="flex justify-end gap-[var(--p-space-200)]">
              {shouldShowConnectButton ? (
                <Button onClick={handleConnectStripe} disabled={isConnectButtonDisabled}>
                  {stripeConnectMutation.isPending && <Spinner size="small" />}
                  {stripeConnectMutation.isPending ? "Connecting..." : accountStatus === "restricted" ? "Complete Verification" : "Continue Onboarding"}
                </Button>
              ) : (
                <Button variant="secondary" onClick={handleViewDashboard} disabled={stripeDashboardMutation.isPending}>
                  {stripeDashboardMutation.isPending && <Spinner size="small" />}
                  {stripeDashboardMutation.isPending ? "Loading..." : "View Dashboard"}
                </Button>
              )}
            </div>
          </div>
        ) : onboardingStatus === "in_progress" ? (
          /* In Progress */
          <Banner tone="info">
            <p>Please complete the Stripe Connect onboarding in the tab that was opened. Once completed, your account will be activated.</p>
          </Banner>
        ) : accountStatus === "disabled" ? (
          /* Disabled */
          <div className="space-y-[var(--p-space-400)]">
            <Banner tone="critical">
              <p>Your Stripe account has been disabled. Check your Stripe dashboard for more information.</p>
            </Banner>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={handleViewDashboard} disabled={stripeDashboardMutation.isPending}>
                {stripeDashboardMutation.isPending && <Spinner size="small" />}
                {stripeDashboardMutation.isPending ? "Loading..." : "View Dashboard"}
              </Button>
            </div>
          </div>
        ) : onboardingStatus === "failed" ? (
          /* Failed */
          <div className="space-y-[var(--p-space-400)]">
            <Banner tone="critical">
              <p>Stripe Connect onboarding failed. Please try again or contact support.</p>
            </Banner>
            <div className="flex justify-end">
              <Button onClick={handleConnectStripe} disabled={isConnectButtonDisabled}>
                {stripeConnectMutation.isPending && <Spinner size="small" />}
                {stripeConnectMutation.isPending ? "Connecting..." : "Retry Onboarding"}
              </Button>
            </div>
          </div>
        ) : (
          /* Not Connected */
          <div className="space-y-[var(--p-space-400)]">
            <div className="rounded-[var(--p-border-radius-200)] border border-dashed border-[var(--p-color-border-secondary)] p-[var(--p-space-600)] text-center">
              <CreditCardIcon className="size-8 fill-[var(--p-color-icon-secondary)] mx-auto mb-[var(--p-space-300)]" />
              <p className="text-[0.8125rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)]">
                No payment account connected
              </p>
              <p className="text-[0.75rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-100)] max-w-md mx-auto">
                Connect your Stripe account to start receiving payments from customer orders.
              </p>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleConnectStripe} disabled={isConnectButtonDisabled}>
                {stripeConnectMutation.isPending && <Spinner size="small" />}
                {stripeConnectMutation.isPending ? "Connecting..." : "Connect Stripe Account"}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Info Card */}
      <Card>
        <h3 className="text-[0.9375rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] mb-[var(--p-space-400)]">
          About Stripe Connect
        </h3>
        <div className="space-y-[var(--p-space-400)]">
          <div>
            <p className="text-[0.8125rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)]">Secure Payments</p>
            <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-025)]">
              All transactions are encrypted and PCI compliant.
            </p>
          </div>
          <CardDivider />
          <div>
            <p className="text-[0.8125rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)]">Fast Payouts</p>
            <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-025)]">
              Receive payments directly to your bank account, typically within 2-3 business days.
            </p>
          </div>
          <CardDivider />
          <div>
            <p className="text-[0.8125rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)]">Transparent Fees</p>
            <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-025)]">
              All fees are clearly displayed before completing any transaction.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
