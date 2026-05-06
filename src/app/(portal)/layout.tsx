"use client";

import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";
import { MobileDrawer } from "@/components/layout/mobile-drawer";
import { useDesignMode } from "@/lib/design-mode";

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
  cookbook: {
    title: "Cookbook",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Cookbook" },
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
  help: {
    title: "Help Center",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Help Center" },
    ],
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { mode } = useDesignMode();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Try two-segment match first (e.g. menu/new), then single segment
  const segments = pathname.split("/").filter(Boolean);
  const twoSegmentKey = segments.slice(0, 2).join("/");
  const oneSegmentKey = segments[0] || "dashboard";

  // Dynamic route handling for order detail pages (orders/[id])
  let config: RouteConfig;
  if (segments[0] === "orders" && segments[1] && !routeMap[twoSegmentKey]) {
    const orderId = segments[1];
    config = {
      title: `Order #${orderId}`,
      breadcrumbs: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Orders", href: "/orders" },
        { label: `Order #${orderId}` },
      ],
    };
  } else {
    config = routeMap[twoSegmentKey] || routeMap[oneSegmentKey] || {
      title: "Dashboard",
      breadcrumbs: [{ label: "Dashboard" }],
    };
  }

  const activePath = `/${oneSegmentKey}`;

  return (
    <div className="flex" data-design-mode={mode} style={{ minHeight: "100dvh" }}>
      <Sidebar activePath={activePath} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title={config.title}
          breadcrumbs={config.breadcrumbs}
          onMobileMenuToggle={() => setDrawerOpen(true)}
          hamburgerRef={hamburgerRef}
        />
        <main
          className="flex-1 page-fade portal-main"
          style={{ padding: "16px", overflowX: "hidden" }}
        >
          <div className="pb-16 lg:pb-0">{children}</div>
        </main>
      </div>
      <BottomTabBar activePath={activePath} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} activePath={activePath} triggerRef={hamburgerRef} />
    </div>
  );
}
