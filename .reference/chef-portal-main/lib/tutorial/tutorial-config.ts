import type { ComponentType, SVGProps } from "react";
import {
  OrderFilledIcon,
  ListBulletedIcon,
  CollectionFilledIcon,
  PackageFilledIcon,
  PersonIcon,
  SettingsIcon,
  LocationFilledIcon,
} from "@shopify/polaris-icons";
import { DishIcon } from "@/components/icons/dish-icon";

export interface TutorialMeta {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
  storageKey: string;
  stepCount: number;
}

/** localStorage key prefix for tutorial completion */
const STORAGE_PREFIX = "yb-tutorial-completed-";

export const TUTORIALS: TutorialMeta[] = [
  {
    id: "orders",
    title: "Managing Orders",
    description:
      "Learn how to view, process, and complete customer orders step by step.",
    icon: OrderFilledIcon,
    href: "/dashboard/order-tutorial",
    storageKey: "yb-order-tutorial-completed", // existing key — keep backwards-compatible
    stepCount: 14,
  },
  {
    id: "dishes",
    title: "Creating Dishes",
    description:
      "Walk through every step of the dish creation wizard — from details to customizations.",
    icon: DishIcon,
    href: "/dashboard/tutorials/dishes",
    storageKey: `${STORAGE_PREFIX}dishes`,
    stepCount: 12,
  },
  {
    id: "bundles",
    title: "Creating Bundles",
    description:
      "Learn how to combine dishes into bundles with special pricing for your customers.",
    icon: PackageFilledIcon,
    href: "/dashboard/tutorials/bundles",
    storageKey: `${STORAGE_PREFIX}bundles`,
    stepCount: 10,
  },
  {
    id: "modifiers",
    title: "Modifier Groups",
    description:
      "Understand how to create modifier groups that let customers customize their orders.",
    icon: CollectionFilledIcon,
    href: "/dashboard/tutorials/modifiers",
    storageKey: `${STORAGE_PREFIX}modifiers`,
    stepCount: 6,
  },
  {
    id: "menus",
    title: "Custom Menu Sections",
    description:
      "Learn how to organize your dishes into custom sections for a better browsing experience.",
    icon: ListBulletedIcon,
    href: "/dashboard/tutorials/menus",
    storageKey: `${STORAGE_PREFIX}menus`,
    stepCount: 7,
  },
  {
    id: "profile",
    title: "Chef Profile",
    description:
      "Set up your chef profile — business name, bio, cuisines, branding, and operations.",
    icon: PersonIcon,
    href: "/dashboard/tutorials/profile",
    storageKey: `${STORAGE_PREFIX}profile`,
    stepCount: 10,
  },
  {
    id: "account",
    title: "Account Settings",
    description:
      "Manage your avatar, contact information, and security settings.",
    icon: SettingsIcon,
    href: "/dashboard/tutorials/account",
    storageKey: `${STORAGE_PREFIX}account`,
    stepCount: 7,
  },
  {
    id: "addresses",
    title: "Address Management",
    description:
      "Set up your pickup address so customers and drivers know where to find you.",
    icon: LocationFilledIcon,
    href: "/dashboard/tutorials/addresses",
    storageKey: `${STORAGE_PREFIX}addresses`,
    stepCount: 6,
  },
];

export function isTutorialCompleted(storageKey: string): boolean {
  try {
    return localStorage.getItem(storageKey) === "true";
  } catch {
    return false;
  }
}

export function markTutorialCompleted(storageKey: string): void {
  try {
    localStorage.setItem(storageKey, "true");
  } catch {
    // localStorage unavailable
  }
}

export function resetTutorialCompletion(storageKey: string): void {
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // localStorage unavailable
  }
}
