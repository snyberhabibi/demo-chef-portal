"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";

interface RouteConfig {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
}

const routeMap: Record<string, RouteConfig> = {
  dashboard: {
    title: "Dashboard",
    breadcrumbs: [{ label: "Dashboard" }],
  },
  orders: {
    title: "Orders",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Orders" },
    ],
  },
  reviews: {
    title: "Reviews",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Reviews" },
    ],
  },
  menu: {
    title: "Dishes",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Dishes" },
    ],
  },
  "menu/new": {
    title: "Create Dish",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Dishes", href: "/menu" },
      { label: "Create" },
    ],
  },
  bundles: {
    title: "Bundles",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Bundles" },
    ],
  },
  sections: {
    title: "Custom Menu Sections",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Custom Menu Sections" },
    ],
  },
  "pickup-address": {
    title: "Pickup Address",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Pickup Address" },
    ],
  },
  packaging: {
    title: "Buy Packaging",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Buy Packaging" },
    ],
  },
  tutorials: {
    title: "Tutorials",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Tutorials" },
    ],
  },
  "portal-guide": {
    title: "Portal Guide",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Portal Guide" },
    ],
  },
  settings: {
    title: "Account Settings",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Account Settings" },
    ],
  },
  profile: {
    title: "Profile",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Profile" },
    ],
  },
  payments: {
    title: "Payment Methods",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Payment Methods" },
    ],
  },
  operations: {
    title: "Operations",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Operations" },
    ],
  },
  "store-preview": {
    title: "Store Preview",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Store Preview" },
    ],
  },
  integrations: {
    title: "POS & Integrations",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "POS & Integrations" },
    ],
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Try two-segment match first (e.g. menu/new), then single segment
  const segments = pathname.split("/").filter(Boolean);
  const twoSegmentKey = segments.slice(0, 2).join("/");
  const oneSegmentKey = segments[0] || "dashboard";

  const config = routeMap[twoSegmentKey] || routeMap[oneSegmentKey] || {
    title: "Dashboard",
    breadcrumbs: [{ label: "Dashboard" }],
  };

  const activePath = `/${oneSegmentKey}`;

  return (
    <div className="flex min-h-screen">
      <Sidebar activePath={activePath} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title={config.title}
          breadcrumbs={config.breadcrumbs}
        />
        <main
          className="flex-1 page-fade"
          style={{ padding: "20px" }}
        >
          <style>{`
            @media (min-width: 1024px) {
              main { padding: 32px !important; }
            }
          `}</style>
          <div className="pb-20 lg:pb-0">{children}</div>
        </main>
      </div>
      <BottomTabBar activePath={activePath} />
    </div>
  );
}
