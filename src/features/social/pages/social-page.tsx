import { useSuspenseQuery } from '@tanstack/react-query'
import { Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'

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

  const [createDialogOpen, setCreateDialogOpen] = useState(false)

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
        <div className="flex flex-wrap items-center gap-2.5">
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

          {canEdit && (
            <Button
              size="sm"
              onClick={() => setCreateDialogOpen(true)}
              className="gap-2 bg-linear-to-r from-(--brand-orange) to-(--brand-orange-deep) text-xs font-bold text-white shadow-xs hover:opacity-95"
            >
              <Plus className="size-3.5" />
              <span>{socialCopy.addLink}</span>
            </Button>
          )}
        </div>
      }
    >
      <SocialList
        items={socialLinks}
        canEdit={canEdit}
        createDialogOpen={createDialogOpen}
        onCreateDialogOpenChange={setCreateDialogOpen}
      />
    </DashboardShell>
  )
}
