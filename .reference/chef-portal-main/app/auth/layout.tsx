"use client";

import { PublicRoute } from "@/components/shared/public-route";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicRoute>{children}</PublicRoute>;
}

