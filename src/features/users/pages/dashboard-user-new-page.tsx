import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { UserEditorForm } from '#/features/users/components/form/user-editor-form'

export function DashboardUserNewPage() {
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
