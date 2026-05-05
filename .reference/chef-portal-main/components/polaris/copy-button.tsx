"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ClipboardIcon, CheckSmallIcon } from "@shopify/polaris-icons"
import { Button } from "./button"

/**
 * Polaris Copy Button
 * Click to copy text, shows checkmark feedback
 */

interface CopyButtonProps extends Omit<React.ComponentProps<typeof Button>, "onClick"> {
  text: string
  onCopy?: () => void
  feedbackDuration?: number
}

function CopyButton({
  text,
  onCopy,
  feedbackDuration = 2000,
  children,
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), feedbackDuration)
    } catch {
      // Fallback
      const textarea = document.createElement("textarea")
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), feedbackDuration)
    }
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleCopy}
      className={className}
      {...props}
    >
      {copied ? (
        <>
          <CheckSmallIcon className="size-4 fill-[rgba(4,123,93,1)]" />
          <span className="text-[rgba(4,123,93,1)]">Copied!</span>
        </>
      ) : (
        <>
          <ClipboardIcon className="size-4 fill-current" />
          {children || <span>Copy</span>}
        </>
      )}
    </Button>
  )
}

export { CopyButton }
