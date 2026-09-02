import { AlertCircle, Loader2, Trash2 } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'
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
    <AlertDialog
      open={Boolean(deletingMedia)}
      onOpenChange={(open) => !open && onClose()}
    >
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-rose-600">
            <AlertCircle className="size-5" />
            {copy.common.delete}
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-2">
            {copy.media.deleteConfirm}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deletingMedia ? (
          <div className="my-2 flex w-full min-w-0 max-w-full items-center gap-3 overflow-hidden rounded-xl border border-(--brand-line) bg-(--surface-strong) p-3">
            <img
              src={deletingMedia.url}
              alt={deletingMedia.filename}
              className="size-12 shrink-0 rounded-lg border border-(--brand-line) object-cover"
            />
            <div className="min-w-0 flex-1 overflow-hidden">
              <p
                className="truncate text-xs font-bold text-(--brand-ink)"
                title={deletingMedia.filename}
              >
                {deletingMedia.filename}
              </p>
              <p className="truncate font-mono text-[11px] text-(--brand-muted)">
                {formatBytes(deletingMedia.size)}
              </p>
            </div>
          </div>
        ) : null}

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel disabled={isDeleting} onClick={onClose}>
            {copy.common.back}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isDeleting}
            onClick={(e) => {
              e.preventDefault()
              void onConfirm()
            }}
            className="gap-1.5 bg-rose-600 text-white hover:bg-rose-700"
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            {copy.common.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
