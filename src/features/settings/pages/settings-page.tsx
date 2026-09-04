import { useSuspenseQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { Button } from '#/components/ui/button'
import { canManageSettings, isUserRole } from '#/features/auth/roles'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { SettingsEditorForm } from '#/features/settings/components/form/settings-editor-form'
import { settingsQueryOptions } from '#/features/settings/query-options'
import { sessionQueryOptions } from '#/features/users/query-options'

export function SettingsPage() {
  const copy = getDashboardCopy()
  const settingsCopy = copy.settings

  const { data: currentUser } = useSuspenseQuery(sessionQueryOptions.current())
  const {
    data: settings,
    isFetching,
    refetch,
  } = useSuspenseQuery(settingsQueryOptions.get())

  const role = isUserRole(currentUser?.role) ? currentUser.role : 'editor'
  const canEdit = canManageSettings(role)

  return (
    <DashboardShell
      title={settingsCopy.title}
      description={settingsCopy.description}
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="shrink-0 text-xs whitespace-nowrap"
        >
          <RefreshCw
            className={`mr-2 size-3.5 ${isFetching ? 'animate-spin' : ''}`}
          />
          {copy.common.refresh}
        </Button>
      }
    >
      <SettingsEditorForm initialData={settings} canEdit={canEdit} />
    </DashboardShell>
  )
}
