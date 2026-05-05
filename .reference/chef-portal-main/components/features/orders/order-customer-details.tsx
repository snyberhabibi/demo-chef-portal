"use client";

import { Avatar } from "@/components/polaris";
import type { Order } from "@/types/orders.types";

interface OrderCustomerDetailsProps {
  order: Order;
}

export function OrderCustomerDetails({ order }: OrderCustomerDetailsProps) {
  return (
    <div data-testid="order-customer-details">
      <h3 className="text-[0.6875rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-200)]">
        Customer
      </h3>
      <div className="rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)] px-[var(--p-space-400)] py-[var(--p-space-300)] flex items-center gap-[var(--p-space-300)]">
        <Avatar name={order.customerName} size="sm" />
        <div className="overflow-hidden">
          <p className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] truncate" data-testid="customer-name">
            {order.customerName}
          </p>
          {order.customerEmail && (
            <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] truncate">
              {order.customerEmail}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
