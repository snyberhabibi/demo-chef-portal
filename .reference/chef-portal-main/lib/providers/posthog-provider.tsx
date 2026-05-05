"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useEffect, useRef } from "react";
import { useAuth } from "@/components/providers";
import { useChefProfile } from "@/hooks/use-chef-profile";

// Initialize PostHog only once on client side
if (typeof window !== "undefined") {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (posthogKey && posthogHost) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      persistence: "localStorage",
      loaded: () => {
        if (process.env.NODE_ENV === "development") {
          // Optionally disable in development
          // posthog.opt_out_capturing();
          console.log("[PostHog] Initialized in development mode");
        }
      },
    });
  }
}

function PostHogUserIdentifier() {
  const { user, isAuthenticated } = useAuth();
  const { data: chefProfile } = useChefProfile();
  const posthog = usePostHog();
  const hasIdentifiedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!posthog) return;

    if (isAuthenticated && user) {
      // Only identify if we haven't already for this user
      if (lastUserIdRef.current !== user.id) {
        // Identify user with just name and business name
        posthog.identify(user.id, {
          name: user.name,
          businessName: chefProfile?.businessName,
        });

        lastUserIdRef.current = user.id;
        hasIdentifiedRef.current = true;

        if (process.env.NODE_ENV === "development") {
          console.log("[PostHog] User identified:", user.id, {
            name: user.name,
            businessName: chefProfile?.businessName,
          });
        }
      }
    } else if (!isAuthenticated && hasIdentifiedRef.current) {
      // User logged out - reset PostHog
      posthog.reset();
      hasIdentifiedRef.current = false;
      lastUserIdRef.current = null;

      if (process.env.NODE_ENV === "development") {
        console.log("[PostHog] User reset on logout");
      }
    }
  }, [posthog, user, isAuthenticated, chefProfile]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  // Only render provider if PostHog is configured
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  if (!posthogKey) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      <PostHogUserIdentifier />
      {children}
    </PHProvider>
  );
}

export { usePostHog };
