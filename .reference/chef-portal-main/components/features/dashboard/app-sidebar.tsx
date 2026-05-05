"use client";

import * as React from "react";
import { DishIcon } from "@/components/icons/dish-icon";
import {
  HomeFilledIcon,
  OrderFilledIcon,
  PackageFilledIcon,
  ListBulletedIcon,
  CollectionFilledIcon,
  LocationFilledIcon,
  SettingsIcon,
  PersonIcon,
  CreditCardIcon,
  BookOpenIcon,
  CartFilledIcon,
  NoteIcon,
  StarFilledIcon,
} from "@shopify/polaris-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { YallaBitesLogoHorizontal, YallaBitesIcon } from "@/components/shared";
import { Badge } from "@/components/polaris";

type MenuItem = {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  badge?: string;
};

type MenuCategory = {
  label: string;
  items: MenuItem[];
};

const menuCategories: MenuCategory[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", icon: HomeFilledIcon, href: "/dashboard" },
      { title: "Orders", icon: OrderFilledIcon, href: "/dashboard/orders" },
      { title: "Reviews", icon: StarFilledIcon, href: "/dashboard/reviews" },
    ],
  },
  {
    label: "Menu Management",
    items: [
      { title: "Dishes", icon: DishIcon, href: "/dashboard/dishes" },
      { title: "Bundles", icon: PackageFilledIcon, href: "/dashboard/bundles", badge: "New" },
      { title: "Custom Menu Sections", icon: ListBulletedIcon, href: "/dashboard/custom-menu-sections" },
      { title: "Modifier Groups", icon: CollectionFilledIcon, href: "/dashboard/modifier-groups" },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Address Management", icon: LocationFilledIcon, href: "/dashboard/addresses" },
      { title: "Buy Packaging", icon: CartFilledIcon, href: "/dashboard/buy-packaging", badge: "New" },
    ],
  },
  {
    label: "Help & Guides",
    items: [
      { title: "Tutorials", icon: NoteIcon, href: "/dashboard/tutorials", badge: "New" },
      { title: "Portal Guide", icon: BookOpenIcon, href: "/dashboard/portal-guide" },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Account Settings", icon: SettingsIcon, href: "/dashboard/account-settings" },
      { title: "Profile", icon: PersonIcon, href: "/dashboard/profile" },
      { title: "Payment Methods", icon: CreditCardIcon, href: "/dashboard/payment-methods" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile, state } = useSidebar();

  // Close mobile sidebar when pathname changes (navigation occurs)
  React.useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  return (
    <Sidebar collapsible="icon" data-testid="app-sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              tooltip="Yalla Bites Chef Portal"
              className="h-auto min-h-12 overflow-visible py-2 flex items-center"
            >
              <Link href="/dashboard" className="flex items-center justify-start w-full gap-[var(--p-space-200)]">
                {state === "collapsed" ? (
                  <YallaBitesIcon className="h-8 w-8" />
                ) : (
                  <>
                    <YallaBitesLogoHorizontal className="h-5 w-auto shrink-0" />
                    <span className="text-[0.6875rem] font-[var(--p-font-weight-semibold)] text-white leading-tight whitespace-nowrap px-[var(--p-space-200)] py-[var(--p-space-050)] rounded-[var(--p-border-radius-150)] bg-[#e54141] border border-[#d13838] flex items-center justify-center -mb-0.5">
                      Chef Portal
                    </span>
                  </>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {menuCategories.map((category) => (
          <SidebarGroup key={category.label}>
            <SidebarGroupLabel>{category.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {category.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.href} data-testid={`sidebar-link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                          <Icon className="fill-current" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="absolute right-1 group-data-[collapsible=icon]:hidden">
                              <Badge tone="critical" size="sm">{item.badge}</Badge>
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

    </Sidebar>
  );
}
