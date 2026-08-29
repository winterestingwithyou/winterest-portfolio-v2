import { useSuspenseQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { Button } from '#/components/ui/button'
import { AccountEditorForm } from '#/features/account/components/form/account-editor-form'
import { accountQueryOptions } from '#/features/account/query-options'
import { getDashboardCopy } from '#/features/dashboard/copy'

export function AccountPage() {
  const copy = getDashboardCopy()
  const accountCopy = copy.account

  const {
    data: profile,
    isFetching,
    refetch,
  } = useSuspenseQuery(accountQueryOptions.profile())

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
      <AccountEditorForm profile={profile} />
    </DashboardShell>
  )
}
