"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ViewIcon, HideIcon } from "@shopify/polaris-icons"
import { Input } from "./input"

interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  error?: boolean
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
          error={error}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          className={cn(
            "absolute right-0 top-0 h-full px-[var(--p-space-300)] flex items-center justify-center",
            "text-[var(--p-color-icon-secondary)] hover:text-[var(--p-color-icon)]",
            "transition-colors cursor-pointer",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={props.disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <HideIcon className="size-4 fill-current" />
          ) : (
            <ViewIcon className="size-4 fill-current" />
          )}
        </button>
      </div>
    )
  }
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
