import {
  Check,
  Copy,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import * as React from 'react'

import { Button } from '#/components/ui/button'
import { DataPagination } from '#/components/ui/data-pagination'
import { SearchInput } from '#/components/ui/search-input'
import type { getDashboardCopy } from '#/features/dashboard/copy'
import type { MediaPaginationMeta, MediaRecord } from '#/features/media/queries'
import { getBaseUrl } from '#/lib/api-client'
import { formatBytes, formatDate } from '#/lib/utils'

export type AssetFilter = 'all' | 'image' | 'document'

type MediaGallerySectionProps = {
  copy: ReturnType<typeof getDashboardCopy>
  mediaList: MediaRecord[]
  pagination: MediaPaginationMeta
  isLoading: boolean
  loadError: unknown
  search: string
  onSearchChange: (value: string) => void
  activeTab: AssetFilter
  onTabChange: (tab: AssetFilter) => void
  onPageChange: (page: number) => void
  onDeleteSelect: (item: MediaRecord) => void
}

export function MediaGallerySection({
  copy,
  mediaList,
  pagination,
  isLoading,
  loadError,
  search,
  onSearchChange,
  activeTab,
  onTabChange,
  onPageChange,
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
            {pagination.total}
          </span>
        </div>

        {/* Search filter */}
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder={copy.media.searchPlaceholder}
            className="w-full"
          />
        </div>
      </div>

      {/* Asset Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
        <button
          type="button"
          onClick={() => onTabChange('all')}
          className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'all'
              ? 'bg-(--brand-orange) text-white font-bold shadow-xs'
              : 'border border-(--brand-line) bg-(--surface-card) text-(--brand-ink) hover:border-(--brand-orange)/50'
          }`}
        >
          {copy.media.tabAll}
        </button>
        <button
          type="button"
          onClick={() => onTabChange('image')}
          className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'image'
              ? 'bg-(--brand-orange) text-white font-bold shadow-xs'
              : 'border border-(--brand-line) bg-(--surface-card) text-(--brand-ink) hover:border-(--brand-orange)/50'
          }`}
        >
          {copy.media.tabImages}
        </button>
        <button
          type="button"
          onClick={() => onTabChange('document')}
          className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
            activeTab === 'document'
              ? 'bg-(--brand-orange) text-white font-bold shadow-xs'
              : 'border border-(--brand-line) bg-(--surface-card) text-(--brand-ink) hover:border-(--brand-orange)/50'
          }`}
        >
          {copy.media.tabDocuments}
        </button>
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
            {activeTab === 'document' ? (
              <FileText className="size-6" />
            ) : (
              <ImageIcon className="size-6" />
            )}
          </div>
          <h4 className="text-base font-bold text-(--brand-ink)">
            {search.trim()
              ? copy.media.noImagesFound
              : activeTab === 'document'
                ? copy.media.noDocumentsFound
                : copy.media.emptyTitle}
          </h4>
          <p className="mt-1 max-w-sm text-sm text-(--brand-muted)">
            {search.trim() || activeTab !== 'all'
              ? copy.media.noMatchingDescription
              : copy.media.emptyDescription}
          </p>
          {search.trim() || activeTab !== 'all' ? (
            <button
              type="button"
              onClick={() => {
                onSearchChange('')
                onTabChange('all')
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-(--brand-orange-soft) px-4 py-2 text-xs font-semibold text-(--brand-orange-deep) transition hover:bg-(--brand-orange) hover:text-white cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-(--brand-orange)"
            >
              <RotateCcw className="size-3.5" />
              {copy.media.resetFilters}
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mediaList.map((item) => {
              const isCopied = copiedId === item.id
              const isPdf =
                item.mimeType === 'application/pdf' ||
                !item.mimeType.startsWith('image/')

              return (
                <article
                  key={item.id}
                  className="surface-card group relative flex flex-col justify-between overflow-hidden transition duration-300 hover:border-(--brand-orange) hover:shadow-md"
                >
                  {/* Thumbnail / Document Box */}
                  {isPdf ? (
                    <div className="relative aspect-video w-full overflow-hidden border-b border-(--brand-line) bg-rose-500/5 flex flex-col items-center justify-center p-4">
                      <div className="grid size-12 place-items-center rounded-2xl bg-rose-500/10 text-rose-600 border border-rose-500/20 shadow-xs transition group-hover:scale-110">
                        <FileText className="size-6" />
                      </div>
                      <span className="mt-2.5 max-w-[85%] truncate text-xs font-semibold text-(--brand-ink)">
                        {item.filename}
                      </span>
                    </div>
                  ) : (
                    <div className="relative aspect-video w-full overflow-hidden border-b border-(--brand-line) bg-(--surface-strong)">
                      <img
                        src={item.url}
                        alt={item.alt || item.filename}
                        loading="lazy"
                        className="size-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Metadata and Actions */}
                  <div className="flex flex-col justify-between flex-1 p-3.5 space-y-3">
                    <div className="space-y-1">
                      <p
                        className="truncate text-xs font-bold text-(--brand-ink)"
                        title={item.filename}
                      >
                        {item.filename}
                      </p>
                      <div className="flex items-center gap-2 font-mono text-[11px] text-(--brand-muted)">
                        <span>{formatBytes(item.size)}</span>
                        <span>•</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between border-t border-(--brand-line) pt-2">
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => void handleCopyUrl(item)}
                          className="h-8 gap-1.5 px-2 text-xs font-medium text-(--brand-muted) transition hover:text-(--brand-ink)"
                          title={copy.media.copyUrl}
                        >
                          {isCopied ? (
                            <>
                              <Check className="size-3.5 text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                                {copy.media.copied}
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="size-3.5" />
                              <span className="text-[11px]">
                                {copy.media.copyUrl}
                              </span>
                            </>
                          )}
                        </Button>

                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex size-8 items-center justify-center rounded-md text-(--brand-muted) transition hover:bg-(--surface-strong) hover:text-(--brand-ink)"
                          title={copy.media.preview}
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      </div>

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

          <DataPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            showItemCount
            onPageChange={onPageChange}
            itemLabel={copy.media.assetsLabel}
            className="pt-4"
          />
        </>
      )}
    </section>
  )
}
