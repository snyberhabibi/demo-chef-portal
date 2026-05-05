"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Colorful SVG illustrations for stats cards, empty states, etc.
 * Each is a self-contained SVG with multiple colors.
 */

interface IllustrationProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
}

function OrdersIllustration({ size = 40, className, ...props }: IllustrationProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} fill="none" className={className} {...props}>
      {/* Clipboard */}
      <rect x="8" y="4" width="24" height="32" rx="4" fill="#E3E3E3" />
      <rect x="10" y="6" width="20" height="28" rx="3" fill="white" />
      {/* Clip */}
      <rect x="14" y="2" width="12" height="6" rx="2" fill="#303030" />
      {/* Lines */}
      <rect x="14" y="14" width="12" height="2" rx="1" fill="#E3E3E3" />
      <rect x="14" y="19" width="10" height="2" rx="1" fill="#E3E3E3" />
      <rect x="14" y="24" width="8" height="2" rx="1" fill="#E3E3E3" />
      {/* Check circle */}
      <circle cx="30" cy="30" r="8" fill="#047B5D" />
      <path d="M26 30l2.5 2.5L33 27" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RevenueIllustration({ size = 40, className, ...props }: IllustrationProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} fill="none" className={className} {...props}>
      {/* Coin stack */}
      <ellipse cx="20" cy="30" rx="14" ry="4" fill="#FFE600" opacity="0.3" />
      <ellipse cx="20" cy="26" rx="12" ry="3.5" fill="#FFE600" opacity="0.5" />
      <ellipse cx="20" cy="22" rx="12" ry="3.5" fill="#FFE600" />
      <ellipse cx="20" cy="22" rx="10" ry="2.5" fill="#FFD000" />
      {/* Dollar sign */}
      <text x="20" y="25" textAnchor="middle" fontSize="8" fontWeight="700" fill="#8E4308">$</text>
      {/* Arrow up */}
      <path d="M32 14l-4-6-4 6" stroke="#047B5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="28" y1="8" x2="28" y2="18" stroke="#047B5D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function DishesIllustration({ size = 40, className, ...props }: IllustrationProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} fill="none" className={className} {...props}>
      {/* Plate */}
      <ellipse cx="20" cy="28" rx="16" ry="5" fill="#E3E3E3" />
      <ellipse cx="20" cy="26" rx="14" ry="4" fill="#F7F7F7" />
      <ellipse cx="20" cy="26" rx="10" ry="3" fill="white" />
      {/* Food */}
      <circle cx="17" cy="20" r="4" fill="#FF8B42" />
      <circle cx="23" cy="19" r="3.5" fill="#E54937" />
      <circle cx="20" cy="16" r="3" fill="#43B982" />
      {/* Steam */}
      <path d="M15 10c0-2 2-2 2-4" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 8c0-2 2-2 2-4" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M25 10c0-2 2-2 2-4" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CustomersIllustration({ size = 40, className, ...props }: IllustrationProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} fill="none" className={className} {...props}>
      {/* Person 1 (back) */}
      <circle cx="14" cy="14" r="5" fill="#91D0FF" />
      <path d="M6 32c0-5.5 3.6-8 8-8s8 2.5 8 8" fill="#91D0FF" opacity="0.5" />
      {/* Person 2 (front) */}
      <circle cx="26" cy="12" r="6" fill="#005BD3" />
      <path d="M16 34c0-6.5 4.5-10 10-10s10 3.5 10 10" fill="#005BD3" opacity="0.6" />
      {/* Smile on front person */}
      <path d="M23.5 14a3 3 0 005 0" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function DeliveryIllustration({ size = 40, className, ...props }: IllustrationProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} fill="none" className={className} {...props}>
      {/* Truck body */}
      <rect x="2" y="16" width="22" height="14" rx="2" fill="#303030" />
      <rect x="4" y="18" width="8" height="8" rx="1" fill="#91D0FF" />
      {/* Truck cab */}
      <path d="M24 20h8a4 4 0 014 4v6H24V20z" fill="#4A4A4A" />
      <rect x="26" y="22" width="6" height="4" rx="1" fill="#B5DFF8" />
      {/* Wheels */}
      <circle cx="10" cy="32" r="3.5" fill="#4A4A4A" />
      <circle cx="10" cy="32" r="1.5" fill="#E3E3E3" />
      <circle cx="30" cy="32" r="3.5" fill="#4A4A4A" />
      <circle cx="30" cy="32" r="1.5" fill="#E3E3E3" />
      {/* Package on truck */}
      <rect x="14" y="19" width="6" height="5" rx="0.5" fill="#FFB800" />
      <line x1="17" y1="19" x2="17" y2="24" stroke="#E5A000" strokeWidth="0.8" />
      <line x1="14" y1="21.5" x2="20" y2="21.5" stroke="#E5A000" strokeWidth="0.8" />
    </svg>
  )
}

function PayoutIllustration({ size = 40, className, ...props }: IllustrationProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} fill="none" className={className} {...props}>
      {/* Wallet */}
      <rect x="4" y="10" width="28" height="22" rx="4" fill="#303030" />
      <rect x="6" y="12" width="24" height="18" rx="3" fill="#4A4A4A" />
      {/* Card slot */}
      <rect x="22" y="18" width="12" height="8" rx="2" fill="#303030" />
      <circle cx="28" cy="22" r="2.5" fill="#FFB800" />
      {/* Bills peeking out */}
      <rect x="8" y="8" width="20" height="6" rx="2" fill="#43B982" />
      <rect x="10" y="6" width="16" height="5" rx="2" fill="#07A35A" />
      {/* Dollar sign */}
      <text x="18" y="11" textAnchor="middle" fontSize="5" fontWeight="700" fill="white">$</text>
    </svg>
  )
}

export {
  OrdersIllustration,
  RevenueIllustration,
  DishesIllustration,
  CustomersIllustration,
  DeliveryIllustration,
  PayoutIllustration,
}
