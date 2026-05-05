"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";

const titleMap: Record<string, string> = {
  dashboard: "Dashboard",
  orders: "Orders",
  menu: "Menu",
  bundles: "Bundles",
  sections: "Sections",
  operations: "Operations & Hours",
  "pickup-address": "Pickup Address",
  reviews: "Reviews",
  profile: "Profile",
  payments: "Payments",
  integrations: "POS & Integrations",
  settings: "Settings",
  help: "Help Center",
  modifiers: "Modifiers",
  packaging: "Packaging",
  welcome: "Welcome",
  "store-preview": "Store Preview",
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Extract the first segment after /
  const segment = pathname.split("/").filter(Boolean)[0] || "dashboard";
  const title = titleMap[segment] || "Dashboard";
  const activePath = `/${segment}`;

  return (
    <div className="flex min-h-screen">
      <Sidebar activePath={activePath} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={title} />
        <main
          className="flex-1 page-fade"
          style={{
            padding: "16px",
          }}
        >
          <style>{`
            @media (min-width: 1024px) {
              main { padding: 28px !important; }
            }
          `}</style>
          <div className="pb-20 lg:pb-0">{children}</div>
        </main>
      </div>
      <BottomTabBar activePath={activePath} />
    </div>
  );
}
