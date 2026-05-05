"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster notranslate"
      style={{ ["--width" as string]: "auto" }}
      toastOptions={{
        unstyled: true,
      }}
      {...props}
    />
  )
}

export { Toaster }
