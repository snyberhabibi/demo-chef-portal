"use client";

import { BackButton } from "@/components/shared";

export default function CustomersPage() {
  return (
    <div className="space-y-4">
      {/* Back Button */}
      <BackButton href="/dashboard" label="Back to dashboard" />

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
        <p className="text-muted-foreground mt-2">
          View and manage your customers
        </p>
      </div>
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <p className="text-muted-foreground">Customers page coming soon...</p>
      </div>
    </div>
  );
}
