import {
  AlertCircle,
  Check,
  HardDrive,
  Loader2,
  Plus,
  UploadCloud,
} from 'lucide-react'
import { motion } from 'motion/react'
import * as React from 'react'

import { Button } from '#/components/ui/button'
import type { getMediaCopy } from '#/features/media/copy'
import { getApiErrorMessage } from '#/lib/api-client'

export type MediaUploadDropzoneProps = {
  copy: ReturnType<typeof getMediaCopy>
  isUploading: boolean
  isError?: boolean
  isSuccess?: boolean
  errorMessage?: string | null
  error?: unknown
  onUpload: (file: File) => Promise<void>
}

export function MediaUploadDropzone({
  copy,
  isUploading,
  isError = false,
  isSuccess = false,
  errorMessage,
  error,
  onUpload,
}: MediaUploadDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const processUpload = async (file: File) => {
    setUploadError(null)
    try {
      await onUpload(file)
    } catch (err) {
      const message = getApiErrorMessage(err, copy.uploadError)
      setUploadError(message)
      console.error('Media upload failed:', err)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await processUpload(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      await processUpload(files[0])
    }
  }

  const resolvedErrorMessage =
    uploadError ||
    (error ? getApiErrorMessage(error, copy.uploadError) : null) ||
    (errorMessage
      ? getApiErrorMessage(new Error(errorMessage), copy.uploadError)
      : null) ||
    copy.uploadError

  const hasError = Boolean(
    uploadError || isError || error || (errorMessage && !isSuccess),
  )

  return (
    <section
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`surface-card relative overflow-hidden p-6 sm:p-8 transition-all ${
        isDragging
          ? 'border-(--brand-orange) bg-(--brand-orange-soft)/25 shadow-lg'
          : 'border-(--brand-line)'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-(--brand-orange-soft) text-(--brand-orange-deep) shadow-xs">
          {isUploading ? (
            <Loader2 className="size-7 animate-spin" />
          ) : isDragging ? (
            <motion.div
              animate={{ scale: 1.1, y: -3 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex items-center justify-center"
            >
              <UploadCloud className="size-7" />
            </motion.div>
          ) : (
            <HardDrive className="size-7" />
          )}
        </div>

        <h2 className="text-xl font-bold text-(--brand-ink)">
          {isUploading
            ? copy.uploading
            : isDragging
              ? copy.dropToUpload
              : copy.uploadTitle}
        </h2>

        <p className="mt-1.5 max-w-md text-sm text-(--brand-muted)">
          {copy.uploadDesc}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="gap-2 bg-(--brand-orange) text-white font-bold shadow-md hover:bg-(--brand-orange-deep)"
          >
            <Plus className="size-4 stroke-[2.5]" />
            {copy.browseFiles}
          </Button>
        </div>

        {hasError ? (
          <div
            role="alert"
            className="mt-4 flex w-full max-w-md items-center gap-2.5 rounded-xl border border-rose-500/25 bg-rose-500/10 p-3 text-left text-xs font-medium text-rose-600 dark:text-rose-400 shadow-2xs"
          >
            <AlertCircle className="size-4 shrink-0" />
            <span className="flex-1 break-words">{resolvedErrorMessage}</span>
          </div>
        ) : null}

        {isSuccess && !hasError ? (
          <div
            role="status"
            className="mt-4 flex w-full max-w-md items-center gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-left text-xs font-medium text-emerald-600 dark:text-emerald-400 shadow-2xs"
          >
            <Check className="size-4 shrink-0" />
            <span className="flex-1 break-words">{copy.uploadSuccess}</span>
          </div>
        ) : null}
      </div>
    </section>
  )
}
