import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface YallaBitesLogoProps {
  className?: string
  showText?: boolean
  textClassName?: string
  href?: string | null
}

const YallaBitesLogo = ({
  className = 'w-12 h-12',
  showText = false,
  textClassName = '',
  href,
}: YallaBitesLogoProps) => {
  // Next.js imports SVGs as URLs by default, so use as image source
  // Using fixed dimensions (250x125 from SVG viewBox) - SVGs scale well with className
  const LogoIcon = () => (
    <Image 
      src="/images/yallabites-logo-colored.svg" 
      alt="Yalla Bites Logo" 
      width={250}
      height={125}
      className={cn('w-full h-full', className)}
    />
  )
  const finalHref = href === undefined ? '/' : href

  if (showText) {
    return (
      <Link
        href={finalHref || '/'}
        aria-label="Yalla Bites Logo"
        className="flex items-center justify-center gap-2"
      >
        {/* eslint-disable-next-line react-hooks/static-components */}
        <LogoIcon />
        <span className={cn('text-sm md:text-2xl font-bold', textClassName)}>YALLA BITES</span>
      </Link>
    )
  }

  if (finalHref) {
    return (
      <Link href={finalHref} aria-label="Yalla Bites Logo" className="flex items-center justify-center">
        {/* eslint-disable-next-line react-hooks/static-components */}
        <LogoIcon />
      </Link>
    )
  }

  // eslint-disable-next-line react-hooks/static-components
  return <LogoIcon />
}

export default YallaBitesLogo
