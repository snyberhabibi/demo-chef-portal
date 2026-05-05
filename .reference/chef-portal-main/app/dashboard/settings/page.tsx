"use client";

import { BackButton } from "@/components/shared";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      {/* Back Button */}
      <BackButton href="/dashboard" label="Back to dashboard" />

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-2">
          Manage your account and preferences
        </p>
      </div>
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <p className="text-muted-foreground">Settings page coming soon...</p>
      </div>
    </div>
  );
}
