import { useSuspenseQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { Button } from '#/components/ui/button'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { UserEditorForm } from '#/features/users/components/form/user-editor-form'
import {
  sessionQueryOptions,
  userQueryOptions,
} from '#/features/users/query-options'

type DashboardUserEditPageProps = {
  id: string
}

export function DashboardUserEditPage({ id }: DashboardUserEditPageProps) {
  const copy = getDashboardCopy()
  const userCopy = copy.users

  const {
    data: targetUser,
    isFetching,
    refetch,
  } = useSuspenseQuery(userQueryOptions.detail(id))

  const { data: currentUser } = useSuspenseQuery(sessionQueryOptions.current())

  return (
    <DashboardShell
      title={`${userCopy.editUser}: ${targetUser.name}`}
      description={userCopy.editDescription}
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="gap-2 border-(--brand-line) font-semibold text-(--brand-ink) hover:bg-surface-soft"
        >
          <RefreshCw
            className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`}
          />
          {copy.common.refresh}
        </Button>
      }
    >
      <UserEditorForm
        mode="edit"
        initialData={targetUser}
        currentUserId={currentUser?.id}
      />
    </DashboardShell>
  )
}
