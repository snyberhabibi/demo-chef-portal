import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface YallaBitesIconProps {
  className?: string
  href?: string
}

export const YallaBitesIcon = ({
  className = 'h-8 w-8',
  href,
}: YallaBitesIconProps) => {
  const IconComponent = () => (
    <Image
      src="/images/icon01.svg"
      alt="Yalla Bites Icon"
      width={1024}
      height={1024}
      className={cn('h-8 w-8', className)}
    />
  )

  if (href) {
    return (
      <Link href={href} aria-label="Yalla Bites Logo" className="flex items-center justify-center">
        {/* eslint-disable-next-line react-hooks/static-components */}
        <IconComponent />
      </Link>
    )
  }

  // eslint-disable-next-line react-hooks/static-components
  return <IconComponent />
}

export default YallaBitesIcon
