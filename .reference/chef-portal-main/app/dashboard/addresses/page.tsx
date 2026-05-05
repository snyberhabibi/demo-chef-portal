"use client";

/**
 * Pickup Address Page
 *
 * Displays the chef's pickup address where delivery companies
 * can collect prepared orders.
 */

import { useRouter } from "next/navigation";
import { useAddress } from "@/hooks/use-addresses";
import { EditIcon, PlusIcon, LocationIcon } from "@shopify/polaris-icons";
import {
  Breadcrumb,
  Button,
  Card,
  Badge,
  EmptyState,
  SkeletonText,
} from "@/components/polaris";

export default function AddressesPage() {
  const router = useRouter();
  const { data: address, isLoading: isLoadingAddress } = useAddress();

  return (
    <div className="space-y-[var(--p-space-500)]">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        { label: "Pickup Address" },
      ]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[1.875rem] leading-[2.25rem] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-denser)] text-[var(--p-color-text)]" data-testid="addresses-heading">
            Pickup Address
          </h2>
          <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
            Your pickup address where delivery companies can collect prepared orders
          </p>
        </div>
        {address && (
          <Button onClick={() => router.push("/dashboard/addresses/edit")}>
            <EditIcon className="size-4 fill-current" />
            Edit Address
          </Button>
        )}
      </div>

      {/* Content */}
      <Card>
        {isLoadingAddress ? (
          <div className="flex items-start gap-[var(--p-space-400)]">
            <div className="size-12 rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] animate-pulse shrink-0" />
            <div className="flex-1 space-y-[var(--p-space-300)]">
              <SkeletonText width="quarter" />
              <SkeletonText width="half" />
              <SkeletonText width="third" />
              <SkeletonText width="quarter" />
            </div>
          </div>
        ) : address ? (
          <div className="flex items-start gap-[var(--p-space-400)]">
            <div className="bg-[var(--p-color-bg-fill-secondary)] rounded-[var(--p-border-radius-200)] p-[var(--p-space-250)] shrink-0">
              <LocationIcon className="size-6 fill-[var(--p-color-icon)]" />
            </div>
            <div className="flex-1 space-y-[var(--p-space-050)]">
              <div className="flex items-center gap-[var(--p-space-200)]">
                <h3 className="text-[1rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                  {address.label}
                </h3>
                {address.isDefault && (
                  <Badge tone="info" size="sm">Primary</Badge>
                )}
              </div>
              <p className="text-[0.875rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)]">
                {address.street}
              </p>
              {address.apartment && (
                <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">
                  {address.apartment}
                </p>
              )}
              <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">{address.country}</p>
              {address.pickupInstructions && (
                <div className="mt-[var(--p-space-400)] pt-[var(--p-space-400)] border-t border-[var(--p-color-border-secondary)]">
                  <p className="text-[0.6875rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-200)]">
                    Pickup Instructions
                  </p>
                  <p className="text-[0.8125rem] text-[var(--p-color-text)] whitespace-pre-wrap">
                    {address.pickupInstructions}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <EmptyState
            heading="No pickup address set"
            description="Add your pickup address so delivery companies know where to collect orders."
            icon={LocationIcon}
            primaryAction={{
              label: "Add Pickup Address",
              onClick: () => router.push("/dashboard/addresses/edit"),
            }}
          />
        )}
      </Card>
    </div>
  );
}
