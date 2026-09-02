import {
  Check,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Search,
  Trash2,
} from 'lucide-react'
import * as React from 'react'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import type { getDashboardCopy } from '#/features/dashboard/copy'
import type { MediaRecord } from '#/features/media/queries'
import { getBaseUrl } from '#/lib/api-client'
import { formatBytes, formatDate } from '#/lib/utils'

type MediaGallerySectionProps = {
  copy: ReturnType<typeof getDashboardCopy>
  mediaList: MediaRecord[]
  isLoading: boolean
  loadError: unknown
  search: string
  onSearchChange: (value: string) => void
  onDeleteSelect: (item: MediaRecord) => void
}

export function MediaGallerySection({
  copy,
  mediaList,
  isLoading,
  loadError,
  search,
  onSearchChange,
  onDeleteSelect,
}: MediaGallerySectionProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const handleCopyUrl = async (item: MediaRecord) => {
    try {
      const baseUrl = getBaseUrl() as string
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

  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={copy.media.searchPlaceholder}
            className="h-10 rounded-xl bg-(--surface-card) pl-9"
          />
        </div>
      </div>

      {/* Error state */}
      {loadError ? (
        <div className="surface-card p-6 text-center text-rose-500">
          <p className="text-sm font-semibold">
            {loadError instanceof Error
              ? loadError.message
              : copy.common.loadError}
          </p>
        </div>
      ) : null}

      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="surface-card overflow-hidden animate-pulse">
              <div className="aspect-video bg-(--surface-strong)" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 rounded-md bg-(--surface-strong)" />
                <div className="h-3 w-1/2 rounded-md bg-(--surface-strong)" />
              </div>
            </div>
          ))}
        </div>
      ) : mediaList.length === 0 ? (
        <div className="surface-card flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-3 grid size-12 place-items-center rounded-2xl bg-(--brand-orange-soft) text-(--brand-orange-deep)">
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
                <div className="relative aspect-video w-full overflow-hidden border-b border-(--brand-line) bg-black/5">
                  <img
                    src={item.url}
                    alt={item.alt || item.filename}
                    className="size-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Top Badges */}
                  <div className="pointer-events-none absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between">
                    <span className="rounded-md border border-white/20 bg-black/60 px-2 py-0.5 font-mono text-[10px] font-semibold text-white backdrop-blur-md">
                      {formatBytes(item.size)}
                    </span>
                    <span className="rounded-md border border-white/20 bg-black/60 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-white backdrop-blur-md">
                      {item.mimeType.replace('image/', '')}
                    </span>
                  </div>
                </div>

                {/* Metadata Body */}
                <div className="flex-1 p-4">
                  <h4
                    className="truncate text-sm font-bold text-(--brand-ink)"
                    title={item.filename}
                  >
                    {item.filename}
                  </h4>
                  {item.alt ? (
                    <p
                      className="mt-1 truncate text-xs text-(--brand-muted)"
                      title={item.alt}
                    >
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
                      className="grid size-8 place-items-center rounded-lg text-(--brand-muted) transition hover:bg-(--surface-strong) hover:text-(--brand-ink)"
                      title="Open preview"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteSelect(item)}
                      className="size-8 p-0 text-(--brand-muted) transition hover:bg-rose-500/10 hover:text-rose-600"
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
  )
}
