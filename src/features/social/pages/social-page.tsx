import { AlertCircle, RefreshCw, Share2 } from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { Button } from '#/components/ui/button'
import { canManageContent, isUserRole } from '#/features/auth/roles'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { useSocialLinks } from '#/features/social/hooks'
import { SocialList } from '#/features/social/social-list'
import { useCurrentSession } from '#/features/users/hooks'

export function SocialPage() {
  const copy = getDashboardCopy()
  const socialCopy = copy.social

  const { data: currentUser } = useCurrentSession()
  const {
    data: socialLinks = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useSocialLinks()

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
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-(--brand-line) bg-card p-6 text-muted-foreground">
          <Share2 className="size-8 animate-pulse text-(--brand-orange)" />
          <span className="text-xs font-semibold">{copy.common.loading}</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
          <AlertCircle className="size-8 text-red-600 dark:text-red-400" />
          <div className="flex flex-col gap-1">
            <span className="font-bold text-sm">
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
        <SocialList items={socialLinks} canEdit={canEdit} />
      )}
    </DashboardShell>
  )
}
