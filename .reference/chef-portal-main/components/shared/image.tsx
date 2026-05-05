"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
// Inline skeleton — avoids importing shadcn/polaris for a single div

interface OptimizedImageProps
  extends Omit<
    React.ComponentProps<typeof Image>,
    "src" | "onError" | "onLoad"
  > {
  src: string | null | undefined;
  alt: string;
  fallbackSrc?: string;
  fallbackComponent?: React.ReactNode;
  showSkeleton?: boolean;
  onError?: () => void;
  onLoad?: () => void;
  className?: string;
}

// Default fallback image (a simple placeholder)
const DEFAULT_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e5e7eb' width='400' height='400'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

// Blur placeholder for better perceived performance
const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  fallbackComponent,
  showSkeleton = true,
  onError,
  onLoad,
  className,
  priority = false,
  quality = 85,
  placeholder = "blur",
  blurDataURL = BLUR_DATA_URL,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = React.useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = React.useState(!src);
  const [isLoading, setIsLoading] = React.useState(!!src);

  // Update src when prop changes
  React.useEffect(() => {
    if (src) {
      setImgSrc(src);
      setHasError(false);
      setIsLoading(true);
    } else {
      setImgSrc(fallbackSrc);
      setHasError(true);
      setIsLoading(false);
    }
  }, [src, fallbackSrc]);

  const handleError = React.useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    
    // Try fallback if not already using it
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else if (onError) {
      onError();
    }
  }, [imgSrc, fallbackSrc, onError]);

  const handleLoad = React.useCallback(() => {
    setIsLoading(false);
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  // If no src at all and we have fallback component, render it immediately
  if (!src && fallbackComponent) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {fallbackComponent}
      </div>
    );
  }

  // If error and we have a custom fallback component, render it
  if (hasError && imgSrc === fallbackSrc && fallbackComponent) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {fallbackComponent}
      </div>
    );
  }

  // If using fill, the wrapper needs to fill the parent
  const wrapperClassName = props.fill 
    ? cn("relative overflow-hidden h-full w-full", className)
    : cn("relative overflow-hidden", className);

  return (
    <div className={wrapperClassName}>
      {/* Loading skeleton */}
      {showSkeleton && isLoading && (
        <div className="absolute inset-0 z-0 bg-[var(--p-color-bg-fill-secondary)] animate-pulse rounded-[inherit]" />
      )}

      {/* Image - Always visible, Next.js handles the loading */}
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          "z-10",
          props.fill ? "absolute inset-0 object-cover object-center" : "",
          // Ensure object-fit is preserved if already in className
          !className?.includes("object-") && props.fill && "object-cover object-center",
          className
        )}
        style={{
          ...(props.fill && {
            objectFit: "cover",
            objectPosition: "center",
          }),
          ...props.style,
        }}
      />
    </div>
  );
}

