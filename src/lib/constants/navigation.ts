import {
  Home,
  Receipt,
  Star,
  UtensilsCrossed,
  Zap,
  Wallet,
  Clock,
  MapPin,
  Settings,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: Home },
      { href: "/orders", label: "Orders", icon: Receipt, badge: "2" },
      { href: "/menu", label: "Menu", icon: UtensilsCrossed },
      { href: "/flash-sales", label: "Flash Sales", icon: Zap },
      { href: "/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    label: "Business",
    items: [
      { href: "/payments", label: "Earnings", icon: Wallet },
      { href: "/operations", label: "Operations", icon: Clock },
      { href: "/pickup-address", label: "Pickup Address", icon: MapPin },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/profile", label: "Profile", icon: User },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];
