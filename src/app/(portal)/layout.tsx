"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";
import { MobileDrawer } from "@/components/layout/mobile-drawer";

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
  menu: {
    title: "Menu",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Menu" },
    ],
  },
  "menu/new": {
    title: "Create Dish",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Menu", href: "/menu" },
      { label: "Create" },
    ],
  },
  "flash-sales": {
    title: "Flash Sales",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Flash Sales" },
    ],
  },
  reviews: {
    title: "Reviews",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Reviews" },
    ],
  },
  payments: {
    title: "Earnings & Payments",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Earnings & Payments" },
    ],
  },
  profile: {
    title: "Profile",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Profile" },
    ],
  },
  settings: {
    title: "Settings",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Settings" },
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
  "pickup-address": {
    title: "Pickup Address",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Pickup Address" },
    ],
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          onMobileMenuToggle={() => setDrawerOpen(true)}
        />
        <main
          className="flex-1 page-fade"
          style={{ padding: "16px", overflowX: "hidden" }}
        >
          <style>{`
            @media (min-width: 640px) {
              main { padding: 20px !important; }
            }
            @media (min-width: 1024px) {
              main { padding: 32px !important; }
            }
          `}</style>
          <div className="pb-24 lg:pb-0">{children}</div>
        </main>
      </div>
      <BottomTabBar activePath={activePath} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} activePath={activePath} />
    </div>
  );
}
