import { useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  AlertTriangle,
  Briefcase,
  Cpu,
  FileText,
  Globe,
  Loader2,
  Trash2,
} from 'lucide-react'

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
import { mediaQueryOptions } from '#/features/media/query-options'
import { formatBytes } from '#/lib/utils'

type MediaDeleteDialogProps = {
  copy: ReturnType<typeof getDashboardCopy>
  deletingMedia: MediaRecord | null
  isDeleting: boolean
  onClose: () => void
  onConfirm: (options?: { cascade?: boolean }) => Promise<void>
}

export function MediaDeleteDialog({
  copy,
  deletingMedia,
  isDeleting,
  onClose,
  onConfirm,
}: MediaDeleteDialogProps) {
  const { data: detailData, isLoading: isCheckingUsage } = useQuery({
    ...mediaQueryOptions.detail(deletingMedia?.id ?? ''),
    enabled: Boolean(deletingMedia),
  })

  const usage = detailData?.usage
  const isInUse = usage?.inUse ?? false
  const references = usage?.references ?? []

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

        {isCheckingUsage ? (
          <div className="my-2 flex items-center justify-center gap-2 rounded-xl border border-(--brand-line) bg-(--surface-strong) p-3 text-xs text-(--brand-muted)">
            <Loader2 className="size-3.5 animate-spin" />
            <span>{copy.media.checkingUsage}</span>
          </div>
        ) : isInUse ? (
          <div className="my-2 space-y-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs">
            <div className="flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-400">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{copy.media.usageWarningTitle}</span>
            </div>
            <p className="text-(--brand-muted)">
              {copy.media.usageWarningDesc}
            </p>
            <div className="max-h-36 space-y-1.5 overflow-y-auto pr-1">
              {references.map((ref) => (
                <div
                  key={`${ref.entityType}-${ref.id}-${ref.field}`}
                  className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-(--surface-strong) px-2.5 py-1.5 text-[11px]"
                >
                  {ref.entityType === 'site_settings' && (
                    <Globe className="size-3.5 shrink-0 text-blue-500" />
                  )}
                  {ref.entityType === 'project_cover' && (
                    <Briefcase className="size-3.5 shrink-0 text-amber-500" />
                  )}
                  {ref.entityType === 'technology_icon' && (
                    <Cpu className="size-3.5 shrink-0 text-purple-500" />
                  )}
                  {ref.entityType === 'project_content' && (
                    <FileText className="size-3.5 shrink-0 text-emerald-500" />
                  )}
                  <div className="min-w-0 flex-1 truncate">
                    <span className="font-medium text-(--brand-ink)">
                      {ref.label}
                    </span>
                    {ref.details ? (
                      <span className="ml-1.5 text-(--brand-muted)">
                        — {ref.details}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300/90">
              {copy.media.usageAutoCleanNotice}
            </p>
          </div>
        ) : null}

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel disabled={isDeleting} onClick={onClose}>
            {copy.common.back}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isDeleting || isCheckingUsage}
            onClick={(e) => {
              e.preventDefault()
              void onConfirm({ cascade: isInUse })
            }}
            className="gap-1.5 bg-rose-600 text-white hover:bg-rose-700"
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            {isInUse
              ? copy.media.confirmDeleteAndClean(
                  usage?.totalReferences ?? references.length,
                )
              : copy.common.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
