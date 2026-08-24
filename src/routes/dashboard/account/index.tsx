import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, RefreshCw, UserCheck } from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { Button } from '#/components/ui/button'
import { AccountEditorForm } from '#/features/account/account-editor-form'
import { useAccountProfile } from '#/features/account/hooks'
import { getDashboardCopy } from '#/features/dashboard/copy'

export const Route = createFileRoute('/dashboard/account/')({
  component: DashboardAccountPage,
})

function DashboardAccountPage() {
  const copy = getDashboardCopy()
  const accountCopy = copy.account

  const {
    data: profile,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useAccountProfile()

  return (
    <DashboardShell
      title={accountCopy.title}
      description={accountCopy.description}
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
          <UserCheck className="size-8 animate-spin text-(--brand-orange)" />
          <span className="text-xs font-semibold">{copy.common.loading}</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
          <AlertCircle className="size-8 text-red-600 dark:text-red-400" />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold">
              {accountCopy.feedback.loadError}
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
      ) : profile ? (
        <AccountEditorForm profile={profile} />
      ) : null}
    </DashboardShell>
  )
}
