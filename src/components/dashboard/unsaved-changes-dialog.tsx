import type { useBlocker } from '@tanstack/react-router'

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
import { getDashboardCopy } from '#/features/dashboard/copy'

export type BlockerResolver = ReturnType<typeof useBlocker<any, true>>

export type UnsavedChangesDialogProps = {
  blocker: BlockerResolver
}

export function UnsavedChangesDialog({ blocker }: UnsavedChangesDialogProps) {
  const copy = getDashboardCopy().common
  const isBlocked = blocker.status === 'blocked'

  return (
    <AlertDialog
      open={isBlocked}
      onOpenChange={(open) => {
        if (!open) {
          blocker.reset?.()
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{copy.unsavedChangesTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {copy.unsavedChangesDesc}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{copy.stay}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(e) => {
              e.preventDefault()
              blocker.proceed?.()
            }}
          >
            {copy.leave}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
