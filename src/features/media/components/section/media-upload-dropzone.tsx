import {
  AlertCircle,
  Check,
  HardDrive,
  Loader2,
  Plus,
  UploadCloud,
} from 'lucide-react'
import * as React from 'react'

import { Button } from '#/components/ui/button'
import type { getDashboardCopy } from '#/features/dashboard/copy'

type MediaUploadDropzoneProps = {
  copy: ReturnType<typeof getDashboardCopy>['media']
  isUploading: boolean
  isError: boolean
  isSuccess: boolean
  errorMessage?: string
  onUpload: (file: File) => Promise<void>
}

export function MediaUploadDropzone({
  copy,
  isUploading,
  isError,
  isSuccess,
  errorMessage,
  onUpload,
}: MediaUploadDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onUpload(file)
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
      await onUpload(files[0])
    }
  }

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
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-(--brand-orange-soft) text-(--brand-orange-deep) shadow-xs">
          {isUploading ? (
            <Loader2 className="size-7 animate-spin" />
          ) : isDragging ? (
            <UploadCloud className="size-7 animate-bounce" />
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
            className="gap-2 bg-(--brand-orange) text-white shadow-md hover:bg-(--brand-orange-deep)"
          >
            <Plus className="size-4 stroke-[2.5]" />
            {copy.browseFiles}
          </Button>
        </div>

        {isError ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-600">
            <AlertCircle className="size-4" />
            {errorMessage || copy.uploadError}
          </div>
        ) : null}

        {isSuccess ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-600">
            <Check className="size-4" />
            {copy.uploadSuccess}
          </div>
        ) : null}
      </div>
    </section>
  )
}
