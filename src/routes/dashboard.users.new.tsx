import { createFileRoute } from '@tanstack/react-router'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { UserEditorForm } from '#/features/users/user-editor-form'

export const Route = createFileRoute('/dashboard/users/new')({
  component: DashboardUserNewPage,
})

function DashboardUserNewPage() {
  const copy = getDashboardCopy()
  const userCopy = copy.users

  return (
    <DashboardShell
      title={userCopy.newUser}
      description={userCopy.newDescription}
    >
      <UserEditorForm mode="create" />
    </DashboardShell>
  )
}
