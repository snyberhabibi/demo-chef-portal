"use client"

import * as React from "react"
import { useDropzone, type DropzoneOptions } from "react-dropzone"
import { UploadIcon, XIcon, CheckSmallIcon, ImageAddIcon, FileIcon } from "@shopify/polaris-icons"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Spinner } from "./spinner"

/**
 * Pixel-perfect Polaris DropZone / File Upload
 *
 * - Dashed border on idle, solid on drag
 * - Surface secondary background
 * - Upload icon + text
 * - Accepts file types via props
 */

interface FileUploadProps extends Omit<React.ComponentProps<"div">, "onDrop"> {
  accept?: DropzoneOptions["accept"]
  maxFiles?: number
  maxSize?: number
  disabled?: boolean
  onDrop?: (files: File[]) => void
  label?: string
  hint?: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

function FileUpload({
  accept,
  maxFiles = 1,
  maxSize,
  disabled,
  onDrop,
  label = "Add file",
  hint = "or drop files to upload",
  icon: IconComponent = FileIcon,
  className,
  ...props
}: FileUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    disabled,
    onDrop: (accepted) => onDrop?.(accepted),
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col items-center justify-center gap-[var(--p-space-200)]",
        "p-[var(--p-space-600)]",
        "rounded-[var(--p-border-radius-300)]",
        "border-[0.125rem] border-dashed",
        "cursor-pointer select-none",
        "text-center",
        isDragActive
          ? "border-[var(--p-color-border-emphasis)] bg-[var(--p-color-bg-surface-emphasis)]"
          : "border-[var(--p-color-border)] bg-[var(--p-color-bg-surface-secondary)]",
        "hover:bg-[var(--p-color-bg-surface-secondary-hover)]",
        "hover:border-[var(--p-color-border-hover)]",
        disabled && "opacity-50 cursor-not-allowed hover:bg-[var(--p-color-bg-surface-secondary)]",
        className
      )}
      {...props}
    >
      <input {...getInputProps()} />
      <IconComponent className="size-6 fill-[var(--p-color-icon-secondary)]" />
      <div>
        <p className="text-[0.8125rem] leading-[1.25rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text-emphasis)]">
          {label}
        </p>
        <p className="text-[0.75rem] leading-[1rem] text-[var(--p-color-text-secondary)]">
          {hint}
        </p>
      </div>
    </div>
  )
}

/**
 * Polaris Image Upload — Single image with preview
 */
interface ImageUploadProps extends Omit<FileUploadProps, "accept"> {
  preview?: string | null
  onRemove?: () => void
}

function ImageUpload({
  preview,
  onRemove,
  label = "Add image",
  hint = "Accepts .jpg, .png, .webp",
  ...props
}: ImageUploadProps) {
  if (preview) {
    return (
      <div className="relative rounded-[var(--p-border-radius-300)] overflow-hidden border border-[var(--p-color-border)]">
        <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-[var(--p-space-200)] right-[var(--p-space-200)] p-[var(--p-space-100)] rounded-full bg-[var(--p-color-bg-surface)] shadow-[var(--p-shadow-300)] cursor-pointer hover:bg-[var(--p-color-bg-surface-hover)]"
          >
            <XIcon className="size-4 fill-[var(--p-color-icon)]" />
          </button>
        )}
      </div>
    )
  }

  return (
    <FileUpload
      accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
      icon={ImageAddIcon}
      label={label}
      hint={hint}
      maxFiles={1}
      {...props}
    />
  )
}

/**
 * Polaris Multi-Image Upload with thumbnail grid + progress
 */
interface UploadedFile {
  id: string
  file?: File
  preview: string
  name: string
  progress?: number
  status: "uploading" | "complete" | "error"
}

interface MultiImageUploadProps extends Omit<FileUploadProps, "accept" | "maxFiles"> {
  files: UploadedFile[]
  onRemoveFile?: (id: string) => void
  maxFiles?: number
}

function MultiImageUpload({
  files,
  onRemoveFile,
  maxFiles = 10,
  label = "Add images",
  hint = "Accepts .jpg, .png, .webp",
  ...props
}: MultiImageUploadProps) {
  return (
    <div className="space-y-[var(--p-space-300)]">
      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-[var(--p-space-200)]">
          {files.map((file) => (
            <div
              key={file.id}
              className="relative group rounded-[var(--p-border-radius-200)] overflow-hidden border border-[var(--p-color-border)] aspect-square"
            >
              <img
                src={file.preview}
                alt={file.name}
                className="size-full object-cover"
              />
              {/* Progress overlay */}
              {file.status === "uploading" && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-[var(--p-space-150)]">
                    <Spinner size="small" tone="white" />
                    {file.progress !== undefined && (
                      <span className="text-white text-[0.75rem] font-[var(--p-font-weight-semibold)] drop-shadow-sm">
                        {file.progress}%
                      </span>
                    )}
                  </div>
                </div>
              )}
              {/* Complete indicator */}
              {file.status === "complete" && (
                <div className="absolute bottom-[var(--p-space-100)] right-[var(--p-space-100)]">
                  <div className="size-[1.25rem] rounded-full bg-[rgba(4,123,93,1)] flex items-center justify-center shadow-[var(--p-shadow-200)]">
                    <CheckSmallIcon className="size-[1.125rem] fill-white" />
                  </div>
                </div>
              )}
              {/* Remove button */}
              {onRemoveFile && (
                <button
                  type="button"
                  onClick={() => onRemoveFile(file.id)}
                  className="absolute top-[var(--p-space-100)] right-[var(--p-space-100)] p-[var(--p-space-050)] rounded-full bg-[var(--p-color-bg-surface)] shadow-[var(--p-shadow-200)] opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <XIcon className="size-3 fill-[var(--p-color-icon)]" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {files.length < maxFiles && (
        <FileUpload
          accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
          icon={ImageAddIcon}
          label={label}
          hint={hint}
          maxFiles={maxFiles - files.length}
          {...props}
        />
      )}
    </div>
  )
}

export { FileUpload, ImageUpload, MultiImageUpload }
export type { UploadedFile }
