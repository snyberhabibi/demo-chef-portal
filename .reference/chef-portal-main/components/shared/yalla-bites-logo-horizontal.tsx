import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface YallaBitesLogoHorizontalProps {
  /**
   * Optional href to make the logo a clickable link. If not provided, renders as a plain SVG.
   */
  href?: string
  /**
   * Optional className for the wrapper element (Link or div)
   */
  wrapperClassName?: string
  /**
   * Optional className for the image element
   */
  className?: string
}

export const YallaBitesLogoHorizontal = ({
  className = 'h-6 w-auto',
  href,
  wrapperClassName,
}: YallaBitesLogoHorizontalProps) => {
  const logoImage = (
    <Image
      src="/images/yalla-bites-logo-horizontal.svg"
      alt="Yalla Bites Logo"
      width={250}
      height={47}
      className={cn('h-6 w-auto', className)}
      priority
      unoptimized
    />
  )

  if (href) {
    return (
      <Link
        href={href}
        aria-label="Yalla Bites Logo"
        className={cn('flex items-center justify-center', wrapperClassName)}
      >
        {logoImage}
      </Link>
    )
  }

  return (
    <div className={cn('flex items-center justify-center', wrapperClassName)}>
      {logoImage}
    </div>
  )
}

export default YallaBitesLogoHorizontal
