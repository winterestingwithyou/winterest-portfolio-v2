import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  HardDrive,
  Image as ImageIcon,
  Loader2,
  Plus,
  Search,
  Trash2,
  UploadCloud,
} from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { useDeleteMedia, useMediaList, useUploadMedia } from '#/features/media/hooks'
import type { MediaRecord } from '#/features/media/queries'

export const Route = createFileRoute('/dashboard/media')({
  component: DashboardMediaPage,
})

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatDate(date: Date | string | null): string {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function DashboardMediaPage() {
  const copy = getDashboardCopy()
  const [search, setSearch] = React.useState('')
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [deletingMedia, setDeletingMedia] = React.useState<MediaRecord | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const { data: mediaList = [], isLoading, error: loadError } = useMediaList(search)
  const uploadMutation = useUploadMedia()
  const deleteMutation = useDeleteMedia()

  const handleCopyUrl = async (item: MediaRecord) => {
    try {
      const baseUrl = (
        import.meta.env.VITE_PUBLIC_APP_URL ||
        (typeof window !== 'undefined' ? window.location.origin : '')
      ).replace(/\/+$/, '')
      const fullUrl = item.url.startsWith('http')
        ? item.url
        : `${baseUrl}${item.url.startsWith('/') ? '' : '/'}${item.url}`
      await navigator.clipboard.writeText(fullUrl)
      setCopiedId(item.id)
      setTimeout(() => setCopiedId(null), 2500)
    } catch (err) {
      console.error('Failed to copy URL:', err)
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

  const processUpload = async (file: File) => {
    try {
      await uploadMutation.mutateAsync({ file })
    } catch (err) {
      console.error('Media upload failed:', err)
    }
  }

  const confirmDelete = async () => {
    if (!deletingMedia) return
    try {
      await deleteMutation.mutateAsync(deletingMedia.id)
      setDeletingMedia(null)
    } catch (err) {
      console.error('Failed to delete media:', err)
    }
  }

  return (
    <DashboardShell
      title={copy.media.title}
      description={copy.media.description}
    >
      <div className="space-y-8">
        {/* Upload Card / Dropzone */}
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
            <div className="grid size-14 place-items-center rounded-2xl bg-(--brand-orange-soft) text-(--brand-orange-deep) mb-4 shadow-xs">
              {uploadMutation.isPending ? (
                <Loader2 className="size-7 animate-spin" />
              ) : isDragging ? (
                <UploadCloud className="size-7 animate-bounce" />
              ) : (
                <HardDrive className="size-7" />
              )}
            </div>

            <h2 className="text-xl font-bold text-(--brand-ink)">
              {uploadMutation.isPending
                ? copy.media.uploading
                : isDragging
                  ? copy.media.dropToUpload
                  : copy.media.uploadTitle}
            </h2>

            <p className="mt-1.5 max-w-md text-sm text-(--brand-muted)">
              {copy.media.uploadDesc}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                disabled={uploadMutation.isPending}
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 bg-(--brand-orange) text-white hover:bg-(--brand-orange-deep) shadow-md"
              >
                <Plus className="size-4 stroke-[2.5]" />
                {copy.media.browseFiles}
              </Button>
            </div>

            {uploadMutation.isError ? (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-600">
                <AlertCircle className="size-4" />
                {uploadMutation.error.message || copy.media.uploadError}
              </div>
            ) : null}

            {uploadMutation.isSuccess ? (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-600">
                <Check className="size-4" />
                {copy.media.uploadSuccess}
              </div>
            ) : null}
          </div>
        </section>

        {/* Media Gallery Section */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-(--brand-ink)">
                {copy.media.title}
              </h3>
              <span className="rounded-full border border-(--brand-line) bg-(--surface-strong) px-2.5 py-0.5 font-mono text-xs font-semibold text-(--brand-muted)">
                {mediaList.length}
              </span>
            </div>

            {/* Search filter */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--brand-muted)" />
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={copy.media.searchPlaceholder}
                className="pl-9 h-10 rounded-xl bg-(--surface-card)"
              />
            </div>
          </div>

          {/* Error state */}
          {loadError ? (
            <div className="surface-card p-6 text-center text-rose-500">
              <p className="text-sm font-semibold">
                {loadError instanceof Error ? loadError.message : copy.common.loadError}
              </p>
            </div>
          ) : null}

          {/* Loading state */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="surface-card overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-(--surface-strong)" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-3/4 rounded-md bg-(--surface-strong)" />
                    <div className="h-3 w-1/2 rounded-md bg-(--surface-strong)" />
                  </div>
                </div>
              ))}
            </div>
          ) : mediaList.length === 0 ? (
            <div className="surface-card flex flex-col items-center justify-center p-12 text-center">
              <div className="grid size-12 place-items-center rounded-2xl bg-(--brand-orange-soft) text-(--brand-orange-deep) mb-3">
                <ImageIcon className="size-6" />
              </div>
              <h4 className="text-base font-bold text-(--brand-ink)">
                {search.trim() ? copy.media.noImagesFound : copy.media.emptyTitle}
              </h4>
              <p className="mt-1 max-w-sm text-sm text-(--brand-muted)">
                {copy.media.emptyDescription}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {mediaList.map((item) => {
                const isCopied = copiedId === item.id

                return (
                  <article
                    key={item.id}
                    className="surface-card group relative flex flex-col justify-between overflow-hidden transition duration-300 hover:border-(--brand-orange) hover:shadow-md"
                  >
                    {/* Thumbnail Image */}
                    <div className="relative aspect-video w-full overflow-hidden bg-black/5 border-b border-(--brand-line)">
                      <img
                        src={item.url}
                        alt={item.alt || item.filename}
                        className="size-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                        <span className="rounded-md border border-white/20 bg-black/60 px-2 py-0.5 font-mono text-[10px] font-semibold text-white backdrop-blur-md">
                          {formatBytes(item.size)}
                        </span>
                        <span className="rounded-md border border-white/20 bg-black/60 px-2 py-0.5 font-mono text-[10px] font-semibold text-white backdrop-blur-md uppercase">
                          {item.mimeType.replace('image/', '')}
                        </span>
                      </div>
                    </div>

                    {/* Metadata Body */}
                    <div className="p-4 flex-1">
                      <h4
                        className="truncate text-sm font-bold text-(--brand-ink)"
                        title={item.filename}
                      >
                        {item.filename}
                      </h4>
                      {item.alt ? (
                        <p className="mt-1 truncate text-xs text-(--brand-muted)" title={item.alt}>
                          Alt: {item.alt}
                        </p>
                      ) : null}
                      <p className="mt-1.5 font-mono text-[11px] text-(--brand-muted)">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between border-t border-(--brand-line) bg-(--surface-strong)/40 px-4 py-2.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyUrl(item)}
                        className={`h-8 gap-1.5 text-xs font-semibold ${
                          isCopied
                            ? 'text-emerald-600'
                            : 'text-(--brand-ink) hover:text-(--brand-orange-deep)'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="size-3.5" />
                            {copy.media.copied}
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5" />
                            {copy.media.copyUrl}
                          </>
                        )}
                      </Button>

                      <div className="flex items-center gap-1">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="grid size-8 place-items-center rounded-lg text-(--brand-muted) hover:bg-(--surface-strong) hover:text-(--brand-ink) transition"
                          title="Open preview"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingMedia(item)}
                          className="size-8 p-0 text-(--brand-muted) hover:bg-rose-500/10 hover:text-rose-600 transition"
                          title={copy.common.delete}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deletingMedia)}
        onOpenChange={(open) => !open && setDeletingMedia(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-rose-600 flex items-center gap-2">
              <AlertCircle className="size-5" />
              {copy.common.delete}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {copy.media.deleteConfirm}
            </DialogDescription>
          </DialogHeader>

          {deletingMedia ? (
            <div className="rounded-xl border border-(--brand-line) bg-(--surface-strong) p-3 flex items-center gap-3 my-2">
              <img
                src={deletingMedia.url}
                alt={deletingMedia.filename}
                className="size-12 rounded-lg object-cover border border-(--brand-line)"
              />
              <div className="overflow-hidden">
                <p className="truncate text-xs font-bold text-(--brand-ink)">
                  {deletingMedia.filename}
                </p>
                <p className="text-[11px] font-mono text-(--brand-muted)">
                  {formatBytes(deletingMedia.size)}
                </p>
              </div>
            </div>
          ) : null}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingMedia(null)}
            >
              {copy.common.back}
            </Button>
            <Button
              type="button"
              disabled={deleteMutation.isPending}
              onClick={confirmDelete}
              className="bg-rose-600 text-white hover:bg-rose-700 gap-1.5"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              {copy.common.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
