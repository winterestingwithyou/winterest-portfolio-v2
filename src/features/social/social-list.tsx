import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Share2,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { getDashboardCopy } from '#/features/dashboard/copy'

import { useDeleteSocialLink, useUpdateSocialLink } from './hooks'
import { SocialEditorDialog } from './social-editor-dialog'
import type { SocialLink, SocialPlatform } from './types'
import { platformMetaMap } from './types'

type SocialListProps = {
  items: SocialLink[]
  canEdit: boolean
  createDialogOpen?: boolean
  onCreateDialogOpenChange?: (open: boolean) => void
}

export function SocialList({
  items,
  canEdit,
  createDialogOpen = false,
  onCreateDialogOpenChange,
}: SocialListProps) {
  const copy = getDashboardCopy()
  const socialCopy = copy.social

  const [editLink, setEditLink] = useState<SocialLink | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [linkToDelete, setLinkToDelete] = useState<SocialLink | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  const updateMutation = useUpdateSocialLink()
  const deleteMutation = useDeleteSocialLink()

  const existingPlatforms: SocialPlatform[] = items.map((i) => i.platform)

  const isDialogOpen = createDialogOpen || Boolean(editLink)

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditLink(null)
      onCreateDialogOpenChange?.(false)
    }
  }

  const handleOpenCreate = () => {
    setEditLink(null)
    onCreateDialogOpenChange?.(true)
  }

  const handleOpenEdit = (link: SocialLink) => {
    setEditLink(link)
  }

  const handleOpenDelete = (link: SocialLink) => {
    setLinkToDelete(link)
    setDeleteConfirmOpen(true)
  }

  const handleToggleEnable = async (link: SocialLink) => {
    if (!canEdit) return
    try {
      await updateMutation.mutateAsync({
        id: link.id,
        data: { isEnabled: !link.isEnabled },
      })
      setFeedbackMessage(socialCopy.feedback.updated)
      setTimeout(() => setFeedbackMessage(null), 3000)
    } catch (err) {
      console.error('Failed to toggle visibility:', err)
    }
  }

  const handleConfirmDelete = async () => {
    if (!linkToDelete) return
    try {
      await deleteMutation.mutateAsync(linkToDelete.id)
      setDeleteConfirmOpen(false)
      setLinkToDelete(null)
      setFeedbackMessage(socialCopy.feedback.deleted)
      setTimeout(() => setFeedbackMessage(null), 3000)
    } catch (err) {
      console.error('Failed to delete social link:', err)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Feedback Message */}
      {feedbackMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold">{feedbackMessage}</span>
        </div>
      )}

      {/* Interactive List View */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-(--brand-line) bg-(--surface)/50 p-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-(--brand-orange-soft) text-(--brand-orange-deep)">
            <Share2 className="size-6" />
          </div>
          <h3 className="mt-4 font-bold text-sm text-(--brand-ink)">
            {socialCopy.emptyTitle}
          </h3>
          <p className="mt-1 max-w-sm text-xs text-(--brand-muted)">
            {socialCopy.emptyDescription}
          </p>
          {canEdit && (
            <Button
              onClick={handleOpenCreate}
              variant="outline"
              className="mt-6 gap-2 border-(--brand-line) font-bold text-xs hover:border-(--brand-orange) hover:bg-(--brand-orange-soft)"
            >
              <Plus className="size-3.5" />
              <span>{socialCopy.addLink}</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 min-w-0 w-full">
          {items.map((item) => {
            const meta = platformMetaMap[item.platform]
            const IconComponent = meta.icon
            const isUpdatingThis =
              updateMutation.isPending &&
              updateMutation.variables.id === item.id

            return (
              <div
                key={item.id}
                className="group relative flex flex-col gap-3.5 rounded-xl border border-(--brand-line) bg-card p-3.5 sm:p-4 shadow-xs transition hover:border-(--brand-orange)/40 sm:flex-row sm:items-center sm:justify-between min-w-0 w-full"
              >
                {/* Left: Platform Icon & Details */}
                <div className="flex min-w-0 flex-1 items-start sm:items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-(--brand-line) bg-(--surface-strong) text-(--brand-ink) shadow-2xs">
                    <IconComponent className="size-5" />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                      <span className="font-bold text-sm text-(--brand-ink) shrink-0">
                        {meta.name}
                      </span>
                      <span
                        className={`inline-flex max-w-[130px] sm:max-w-xs truncate items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}
                        title={item.accountName || meta.name}
                      >
                        {item.accountName || meta.name}
                      </span>
                      <Badge
                        variant={item.isEnabled ? 'default' : 'secondary'}
                        className="text-[10px] shrink-0"
                      >
                        {item.isEnabled
                          ? socialCopy.status.active
                          : socialCopy.status.inactive}
                      </Badge>
                      <span className="text-[10px] text-(--brand-muted) font-mono shrink-0">
                        #{item.sortOrder}
                      </span>
                    </div>

                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-(--brand-muted)">
                      {item.username && (
                        <>
                          <span className="truncate font-medium text-(--brand-ink)/80 max-w-[100px] sm:max-w-[160px] shrink-0">
                            {item.username}
                          </span>
                          <span
                            aria-hidden="true"
                            className="shrink-0 text-(--brand-muted)/60"
                          >
                            &bull;
                          </span>
                        </>
                      )}
                      <span
                        className="min-w-0 flex-1 truncate font-mono text-[11px]"
                        title={item.url}
                      >
                        {item.url}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-2 border-t border-(--brand-line)/60 pt-2.5 sm:border-t-0 sm:pt-0 shrink-0 w-full sm:w-auto">
                  {/* Quick Toggle Visible */}
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-(--brand-line) bg-(--surface) px-2.5 py-1.5 text-xs text-(--brand-ink) hover:bg-accent select-none">
                    <Checkbox
                      checked={item.isEnabled}
                      disabled={!canEdit || isUpdatingThis}
                      onCheckedChange={() => handleToggleEnable(item)}
                    />
                    <span className="text-[11px] font-semibold">
                      {isUpdatingThis ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : item.isEnabled ? (
                        socialCopy.status.active
                      ) : (
                        socialCopy.status.inactive
                      )}
                    </span>
                  </label>

                  {/* Action Buttons Group */}
                  <div className="flex items-center gap-1.5">
                    {/* Open Link */}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex size-8 items-center justify-center rounded-lg border border-(--brand-line) bg-(--surface) text-(--brand-muted) hover:border-(--brand-orange) hover:bg-(--brand-orange-soft) hover:text-(--brand-orange-deep) transition"
                      title={socialCopy.actions.openLink}
                    >
                      <ExternalLink className="size-3.5" />
                    </a>

                    {/* Edit */}
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(item)}
                        className="size-8 p-0 text-(--brand-ink) hover:bg-(--brand-orange-soft) hover:text-(--brand-orange-deep)"
                        title={socialCopy.actions.edit}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                    )}

                    {/* Delete */}
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDelete(item)}
                        className="size-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                        title={socialCopy.actions.delete}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Editor Modal Dialog */}
      <SocialEditorDialog
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        socialLink={editLink}
        existingPlatforms={existingPlatforms}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              {socialCopy.form.delete}
            </DialogTitle>
            <DialogDescription>
              {socialCopy.form.deleteConfirmDesc}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
            <AlertCircle className="size-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>
              {linkToDelete
                ? `${platformMetaMap[linkToDelete.platform].name} (${linkToDelete.url})`
                : null}
            </span>
          </div>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={deleteMutation.isPending}
            >
              {socialCopy.form.cancel}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {socialCopy.form.saving}
                </>
              ) : (
                socialCopy.form.delete
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
