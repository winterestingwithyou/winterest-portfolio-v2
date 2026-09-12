import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { UserEditorForm } from '#/features/users/components/form/user-editor-form'
import { getUsersCopy } from '#/features/users/copy'

export function DashboardUserNewPage() {
  const userCopy = getUsersCopy()

  return (
    <DashboardShell
      title={userCopy.newUser}
      description={userCopy.newDescription}
    >
      <UserEditorForm mode="create" />
    </DashboardShell>
  )
}
