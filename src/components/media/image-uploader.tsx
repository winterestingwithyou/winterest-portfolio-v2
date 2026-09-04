import * as React from 'react'
import {
  ExternalLink,
  FolderOpen,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Trash2,
  UploadCloud,
} from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { useUploadMedia } from '#/features/media/hooks'
import { getBaseUrl } from '#/lib/api-client'
import { MediaPickerDialog } from './media-picker-dialog'

export type ImageUploaderProps = {
  value?: string | null
  onChange: (url: string | null) => void
  label?: string
  description?: string
  aspectRatio?: 'video' | 'wide' | 'square'
}

export function ImageUploader({
  value,
  onChange,
  label,
  description,
  aspectRatio = 'video',
}: ImageUploaderProps) {
  const copy = getDashboardCopy()
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const [isManualUrl, setIsManualUrl] = React.useState(false)
  const [manualUrlInput, setManualUrlInput] = React.useState('')
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const uploadMutation = useUploadMedia()

  React.useEffect(() => {
    if (value && !manualUrlInput) {
      setManualUrlInput(value)
    }
  }, [value, manualUrlInput])

  const aspectClass =
    aspectRatio === 'wide'
      ? 'aspect-21/9'
      : aspectRatio === 'square'
        ? 'aspect-square'
        : 'aspect-video'

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
      const file = files[0]
      await processFileUpload(file)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await processFileUpload(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const processFileUpload = async (file: File) => {
    try {
      const uploaded = await uploadMutation.mutateAsync({ file })
      const baseUrl = getBaseUrl() as string
      const fullUrl = uploaded.url.startsWith('http')
        ? uploaded.url
        : `${baseUrl}${uploaded.url.startsWith('/') ? '' : '/'}${uploaded.url}`
      onChange(fullUrl)
    } catch (err) {
      console.error('File upload failed:', err)
    }
  }

  const handleManualApply = () => {
    if (manualUrlInput.trim()) {
      onChange(manualUrlInput.trim())
    } else {
      onChange(null)
    }
    setIsManualUrl(false)
  }

  const baseUrl = getBaseUrl() as string
  const displayUrl = value
    ? value.startsWith('http')
      ? value
      : `${baseUrl}${value.startsWith('/') ? '' : '/'}${value}`
    : ''

  return (
    <div className="w-full min-w-0 max-w-full space-y-3">
      {label ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold text-(--brand-ink)">
            {label}
          </span>
          <button
            type="button"
            onClick={() => setIsManualUrl(!isManualUrl)}
            className="inline-flex shrink-0 items-center gap-1.5 text-xs text-(--brand-muted) hover:text-(--brand-orange-deep) transition focus:outline-hidden"
          >
            <LinkIcon className="size-3.5" />
            {isManualUrl ? copy.media.directUpload : copy.media.orPasteUrl}
          </button>
        </div>
      ) : null}

      {/* Manual URL Input view */}
      {isManualUrl ? (
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="url"
            value={manualUrlInput}
            onChange={(e) => setManualUrlInput(e.target.value)}
            placeholder="https://..."
            className="flex-1 text-sm font-mono"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleManualApply}
            className="shrink-0 whitespace-nowrap bg-(--brand-orange) text-white hover:bg-(--brand-orange-deep)"
          >
            Apply
          </Button>
        </div>
      ) : null}

      {/* Main Preview / Upload Box */}
      {displayUrl ? (
        <div className="relative group w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-(--brand-line) bg-(--surface-card) shadow-xs">
          <div
            className={`relative w-full max-w-full overflow-hidden bg-black/5 ${aspectClass}`}
          >
            <img
              src={displayUrl}
              alt="Project Cover"
              className="size-full object-cover"
            />
            {/* Overlay action bar on hover (desktop only) */}
            <div className="absolute inset-0 bg-black/50 opacity-0 backdrop-blur-xs transition duration-200 group-hover:opacity-100 hidden sm:flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="bg-white/90 text-black hover:bg-white gap-1.5"
                onClick={() => setPickerOpen(true)}
              >
                <FolderOpen className="size-4" />
                {copy.media.changeImage}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="bg-white/90 text-rose-600 hover:bg-white hover:text-rose-700 gap-1.5"
                onClick={() => onChange(null)}
              >
                <Trash2 className="size-4" />
                {copy.media.removeImage}
              </Button>
              <a
                href={displayUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-lg bg-white/90 text-black hover:bg-white transition"
                title="Open in new tab"
              >
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>

          <div className="flex w-full min-w-0 max-w-full flex-col gap-2.5 p-3 sm:flex-row sm:items-center sm:justify-between border-t border-(--brand-line) bg-(--surface-strong)/50 text-xs text-(--brand-muted)">
            <div className="flex w-full min-w-0 items-center justify-between sm:justify-start gap-2">
              <span className="block min-w-0 flex-1 truncate font-mono text-[11px]" title={displayUrl}>
                {displayUrl}
              </span>
              <a
                href={displayUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-(--brand-muted) hover:text-(--brand-ink) hover:bg-surface-soft transition"
                title="Open in new tab"
              >
                <ExternalLink className="size-3.5" />
              </a>
            </div>

            <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-2 border-t border-(--brand-line)/60 pt-2 sm:border-t-0 sm:pt-0 shrink-0">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="inline-flex min-h-[36px] sm:min-h-8 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-(--brand-orange-deep) hover:bg-(--brand-orange-soft) whitespace-nowrap transition"
              >
                <FolderOpen className="size-3.5" />
                {copy.media.selectFromLibrary}
              </button>
              <span className="hidden sm:inline text-(--brand-line)">•</span>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="inline-flex min-h-[36px] sm:min-h-8 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 whitespace-nowrap transition"
              >
                <Trash2 className="size-3.5" />
                {copy.common.delete}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex w-full min-w-0 max-w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 sm:p-6 text-center transition-colors ${
            isDragging
              ? 'border-(--brand-orange) bg-(--brand-orange-soft)/30'
              : 'border-(--brand-line) bg-(--surface-card)/60 hover:border-(--brand-orange)/50 hover:bg-(--surface-card)'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="grid size-12 place-items-center rounded-2xl bg-(--brand-orange-soft) text-(--brand-orange-deep) mb-3 shadow-xs">
            {uploadMutation.isPending ? (
              <Loader2 className="size-6 animate-spin" />
            ) : isDragging ? (
              <UploadCloud className="size-6 animate-bounce" />
            ) : (
              <ImageIcon className="size-6" />
            )}
          </div>

          <h4 className="text-sm font-semibold text-(--brand-ink)">
            {uploadMutation.isPending
              ? copy.media.uploading
              : isDragging
                ? copy.media.dropToUpload
                : copy.media.uploadTitle}
          </h4>

          <p className="mt-1 max-w-sm text-xs leading-relaxed text-(--brand-muted)">
            {description || copy.media.uploadDesc}
          </p>

          <div className="mt-4 flex flex-col sm:flex-row w-full max-w-full items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto min-h-10 max-w-full justify-center gap-2 border-(--brand-line) shadow-xs shrink sm:shrink-0 text-xs sm:text-sm"
            >
              <UploadCloud className="size-4 shrink-0" />
              <span className="truncate">{copy.media.browseFiles}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPickerOpen(true)}
              className="w-full sm:w-auto min-h-10 max-w-full justify-center gap-2 border-(--brand-line) text-(--brand-orange-deep) shadow-xs shrink sm:shrink-0 text-xs sm:text-sm"
            >
              <FolderOpen className="size-4 shrink-0" />
              <span className="truncate">{copy.media.selectFromLibrary}</span>
            </Button>
          </div>

          {uploadMutation.isError ? (
            <p className="mt-3 text-xs font-semibold text-rose-500">
              {uploadMutation.error.message || copy.media.uploadError}
            </p>
          ) : null}
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(media) => onChange(media.url)}
        currentUrl={value}
        accept="image"
      />
    </div>
  )
}
