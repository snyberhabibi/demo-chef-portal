"use client";

import Image from "next/image";
import { ExternalSmallIcon } from "@shopify/polaris-icons";
import { Breadcrumb, Button, Card } from "@/components/polaris";
import { useRouter } from "next/navigation";

const packagingItems = [
  {
    title: "Large Catering Bags",
    description: "Plastic take-out bag 22\" x 14\" x 15 1/4\" — perfect for large catering orders.",
    image: "/images/packaging/large-catering-bags.jpg",
    url: "https://www.webstaurantstore.com/plastic-take-out-bag-22-x-14-x-15-1-4-box/130TO2214WH.html",
  },
  {
    title: "Half Tray Boxes",
    description: "Choice 13\" x 10 1/2\" x 3 1/4\" half pan corrugated catering box.",
    image: "/images/packaging/half-tray-boxes.jpg",
    url: "https://www.webstaurantstore.com/choice-13-x-10-1-2-x-3-1-4-half-pan-corrugated-catering-box-case/24577362.html",
  },
  {
    title: "Full Tray Boxes",
    description: "Choice 21\" x 13\" x 4\" deep full pan corrugated catering box.",
    image: "/images/packaging/full-tray-boxes.jpg",
    url: "https://www.webstaurantstore.com/choice-21-x-13-x-4-deep-full-pan-corrugated-catering-box-case/24577363.html",
  },
  {
    title: "All Take-Out / To-Go Supplies",
    description: "Browse the full range of take-out containers, bags, and to-go supplies.",
    image: "/images/packaging/takeout-supplies.jpg",
    url: "https://www.webstaurantstore.com/search/to-go.html",
  },
];

export default function BuyPackagingPage() {
  const router = useRouter();

  return (
    <div className="space-y-[var(--p-space-500)]">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        { label: "Buy Packaging" },
      ]} />

      {/* Header */}
      <div>
        <h2 className="text-[1.875rem] leading-[2.25rem] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-denser)] text-[var(--p-color-text)]">
          Buy Packaging
        </h2>
        <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
          Stock up on packaging supplies for your orders
        </p>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--p-space-500)]">
        {packagingItems.map((item) => (
          <Card key={item.title} className="!p-0 overflow-hidden flex flex-col">
            <div className="relative aspect-square bg-[var(--p-color-bg-surface-secondary)]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="flex flex-col flex-1 gap-[var(--p-space-300)] p-[var(--p-space-400)]">
              <h3 className="text-[0.9375rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] leading-tight">
                {item.title}
              </h3>
              <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] flex-1">
                {item.description}
              </p>
              <Button asChild className="w-full mt-auto">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  Buy Now
                  <ExternalSmallIcon className="size-4 fill-current" />
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
