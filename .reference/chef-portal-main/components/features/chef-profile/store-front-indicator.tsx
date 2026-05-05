"use client";

import { InfoIcon } from "@shopify/polaris-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/polaris";
import { Button } from "@/components/polaris";
import Image from "next/image";

interface StoreFrontIndicatorProps {
  description: string;
  screenshot?: string;
  screenshotAlt?: string;
}

export function StoreFrontIndicator({
  description,
  screenshot,
  screenshotAlt = "Store-front preview",
}: StoreFrontIndicatorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center size-4 cursor-pointer"
        >
          <InfoIcon className="size-3.5 fill-[var(--p-color-icon-secondary)] hover:fill-[var(--p-color-icon)]" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96" align="start">
        <div className="space-y-[var(--p-space-300)]">
          <div>
            <h4 className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] mb-[var(--p-space-100)]">
              Store-Front Impact
            </h4>
            <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">{description}</p>
          </div>
          {screenshot && (
            <div className="rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] overflow-hidden bg-[var(--p-color-bg-surface-secondary)]">
              <div className="relative w-full aspect-video">
                <Image
                  src={screenshot}
                  alt={screenshotAlt}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
