import { useSuspenseQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { Button } from '#/components/ui/button'
import { canManageContent, isUserRole } from '#/features/auth/roles'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { socialQueryOptions } from '#/features/social/query-options'
import { SocialList } from '#/features/social/social-list'
import { sessionQueryOptions } from '#/features/users/query-options'

export function SocialPage() {
  const copy = getDashboardCopy()
  const socialCopy = copy.social

  const { data: currentUser } = useSuspenseQuery(sessionQueryOptions.current())
  const {
    data: socialLinks,
    isFetching,
    refetch,
  } = useSuspenseQuery(socialQueryOptions.list())

  const role = isUserRole(currentUser?.role) ? currentUser.role : 'editor'
  const canEdit = canManageContent(role)

  return (
    <DashboardShell
      title={socialCopy.title}
      description={socialCopy.description}
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
      <SocialList items={socialLinks} canEdit={canEdit} />
    </DashboardShell>
  )
}
