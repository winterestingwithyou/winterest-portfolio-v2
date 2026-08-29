import { AlertCircle, RefreshCw, Settings as SettingsIcon } from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { Button } from '#/components/ui/button'
import { canManageSettings, isUserRole } from '#/features/auth/roles'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { SettingsEditorForm } from '#/features/settings/components/form/settings-editor-form'
import { useSiteSettings } from '#/features/settings/hooks'
import { defaultSiteSettings } from '#/features/settings/types'
import { useCurrentSession } from '#/features/users/hooks'

export function SettingsPage() {
  const copy = getDashboardCopy()
  const settingsCopy = copy.settings

  const { data: currentUser } = useCurrentSession()
  const {
    data: settings = defaultSiteSettings,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useSiteSettings()

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
          className="text-xs"
        >
          <RefreshCw
            className={`mr-2 size-3.5 ${isFetching ? 'animate-spin' : ''}`}
          />
          {copy.common.refresh}
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-(--brand-line) bg-card p-6 text-muted-foreground">
          <SettingsIcon className="size-8 animate-spin text-(--brand-orange)" />
          <span className="text-xs font-semibold">{copy.common.loading}</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
          <AlertCircle className="size-8 text-red-600 dark:text-red-400" />
          <div className="flex flex-col gap-1">
            <span className="font-bold text-sm">
              {settingsCopy.feedback.loadError}
            </span>
            <span className="text-xs opacity-80">
              {error instanceof Error ? error.message : String(error)}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            className="mt-2 text-xs"
          >
            {copy.common.refresh}
          </Button>
        </div>
      ) : (
        <SettingsEditorForm initialData={settings} canEdit={canEdit} />
      )}
    </DashboardShell>
  )
}
