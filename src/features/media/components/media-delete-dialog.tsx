import { AlertCircle, Loader2, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import type { getDashboardCopy } from '#/features/dashboard/copy'
import type { MediaRecord } from '#/features/media/queries'
import { formatBytes } from '#/lib/utils'

type MediaDeleteDialogProps = {
  copy: ReturnType<typeof getDashboardCopy>
  deletingMedia: MediaRecord | null
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function MediaDeleteDialog({
  copy,
  deletingMedia,
  isDeleting,
  onClose,
  onConfirm,
}: MediaDeleteDialogProps) {
  return (
    <Dialog open={Boolean(deletingMedia)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-600">
            <AlertCircle className="size-5" />
            {copy.common.delete}
          </DialogTitle>
          <DialogDescription className="pt-2">
            {copy.media.deleteConfirm}
          </DialogDescription>
        </DialogHeader>

        {deletingMedia ? (
          <div className="my-2 flex items-center gap-3 rounded-xl border border-(--brand-line) bg-(--surface-strong) p-3">
            <img
              src={deletingMedia.url}
              alt={deletingMedia.filename}
              className="size-12 rounded-lg border border-(--brand-line) object-cover"
            />
            <div className="overflow-hidden">
              <p className="truncate text-xs font-bold text-(--brand-ink)">
                {deletingMedia.filename}
              </p>
              <p className="font-mono text-[11px] text-(--brand-muted)">
                {formatBytes(deletingMedia.size)}
              </p>
            </div>
          </div>
        ) : null}

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {copy.common.back}
          </Button>
          <Button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="gap-1.5 bg-rose-600 text-white hover:bg-rose-700"
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            {copy.common.delete}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
