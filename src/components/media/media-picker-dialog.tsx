import * as React from 'react'
import {
  Check,
  Image as ImageIcon,
  Loader2,
  Plus,
  Search,
  UploadCloud,
} from 'lucide-react'

import { useQuery } from '@tanstack/react-query'

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
import { useUploadMedia } from '#/features/media/hooks'
import { mediaQueryOptions } from '#/features/media/query-options'
import type { MediaRecord } from '#/features/media/queries'
import { getBaseUrl } from '#/lib/api-client'

export type MediaPickerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (media: MediaRecord) => void
  currentUrl?: string | null
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  currentUrl,
}: MediaPickerDialogProps) {
  const copy = getDashboardCopy()
  const [search, setSearch] = React.useState('')
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const { data: mediaList = [], isLoading } = useQuery(
    mediaQueryOptions.list(search),
  )
  const uploadMutation = useUploadMedia()

  // Reset selected when dialog opens
  React.useEffect(() => {
    if (open) {
      const match = mediaList.find((m) => m.url === currentUrl)
      setSelectedId(match ? match.id : null)
    }
  }, [open, currentUrl, mediaList])

  const normalizeMedia = (media: MediaRecord): MediaRecord => {
    if (media.url.startsWith('http://') || media.url.startsWith('https://')) {
      return media
    }
    const baseUrl = getBaseUrl() as string
    return {
      ...media,
      url: `${baseUrl}${media.url.startsWith('/') ? '' : '/'}${media.url}`,
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const uploaded = await uploadMutation.mutateAsync({ file })
      const normalized = normalizeMedia(uploaded)
      setSelectedId(normalized.id)
      onSelect(normalized)
      onOpenChange(false)
    } catch (err) {
      console.error(err)
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleConfirm = () => {
    const selected = mediaList.find((m) => m.id === selectedId)
    if (selected) {
      onSelect(normalizeMedia(selected))
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] sm:max-w-3xl flex flex-col p-6 overflow-hidden">
        <DialogHeader>
          <DialogTitle>{copy.media.selectFromLibrary}</DialogTitle>
          <DialogDescription>{copy.media.description}</DialogDescription>
        </DialogHeader>

        {/* Action Header: Search + Upload Quick Button */}
        <div className="flex items-center gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--brand-muted)" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={copy.media.searchPlaceholder}
              className="pl-9"
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            type="button"
            variant="outline"
            disabled={uploadMutation.isPending}
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 gap-2"
          >
            {uploadMutation.isPending ? (
              <Loader2 className="size-4 animate-spin text-(--brand-orange-deep)" />
            ) : (
              <Plus className="size-4" />
            )}
            {copy.media.directUpload}
          </Button>
        </div>

        {uploadMutation.isError ? (
          <p className="text-xs font-semibold text-rose-500">
            {uploadMutation.error.message || copy.media.uploadError}
          </p>
        ) : null}

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto min-h-70 max-h-100 border border-(--brand-line) rounded-xl p-3 bg-(--surface-strong)/50">
          {isLoading ? (
            <div className="grid size-full place-items-center py-12">
              <Loader2 className="size-6 animate-spin text-(--brand-orange)" />
            </div>
          ) : mediaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="grid size-12 place-items-center rounded-2xl bg-(--brand-orange-soft) text-(--brand-orange-deep) mb-3">
                <ImageIcon className="size-6" />
              </div>
              <p className="text-sm font-semibold text-(--brand-ink)">
                {copy.media.noImagesFound}
              </p>
              <p className="text-xs text-(--brand-muted) mt-1">
                {copy.media.emptyDescription}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="size-4" />
                {copy.media.directUpload}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {mediaList.map((item) => {
                const isSelected = item.id === selectedId
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition duration-200 focus:outline-hidden ${
                      isSelected
                        ? 'border-(--brand-orange) bg-(--brand-orange-soft)/20 ring-2 ring-(--brand-orange)'
                        : 'border-(--brand-line) bg-(--surface-card) hover:border-(--brand-orange)/60'
                    }`}
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-black/5">
                      <img
                        src={item.url}
                        alt={item.alt || item.filename}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      {isSelected ? (
                        <div className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-(--brand-orange) text-white shadow-md">
                          <Check className="size-3.5 stroke-3" />
                        </div>
                      ) : null}
                    </div>

                    <div className="p-2.5">
                      <p
                        className="truncate text-xs font-semibold text-(--brand-ink)"
                        title={item.filename}
                      >
                        {item.filename}
                      </p>
                      <p className="mt-0.5 text-[11px] text-(--brand-muted)">
                        {(item.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Dialog Footer */}
        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {copy.common.back}
          </Button>
          <Button
            type="button"
            disabled={!selectedId}
            onClick={handleConfirm}
            className="gap-2 bg-(--brand-orange) text-white hover:bg-(--brand-orange-deep)"
          >
            {copy.media.useSelectedImage}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
