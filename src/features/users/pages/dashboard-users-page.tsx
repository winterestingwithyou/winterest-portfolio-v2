import { Link } from '@tanstack/react-router'
import { AlertCircle, Plus, RefreshCw } from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { Button } from '#/components/ui/button'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { DashboardUsersMetrics } from '#/features/users/components/section/dashboard-users-metrics'
import { DashboardUsersTable } from '#/features/users/components/table/dashboard-users-table'
import {
  useCurrentSession,
  useDeleteUser,
  useUsers,
} from '#/features/users/hooks'
import type { UserWithSessionCount } from '#/features/users/queries'

export function DashboardUsersPage() {
  const copy = getDashboardCopy()
  const userCopy = copy.users

  const {
    data: users = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useUsers()

  const { data: currentUser } = useCurrentSession()
  const deleteMutation = useDeleteUser()

  const handleDeleteUser = async (targetUser: UserWithSessionCount) => {
    if (currentUser?.id === targetUser.id) {
      alert(userCopy.form.selfDeleteWarning)
      return
    }
    if (!confirm(userCopy.form.deleteConfirm)) return

    await deleteMutation.mutateAsync(targetUser.id).catch((err: unknown) => {
      alert(err instanceof Error ? err.message : userCopy.feedback.deleteError)
    })
  }

  // Calculate metrics
  const totalUsers = users.length
  const ownerCount = users.filter((u) => u.role === 'owner').length
  const adminCount = users.filter((u) => u.role === 'admin').length
  const teamCount = users.filter((u) => u.role === 'editor').length

  const isAccessDenied =
    error?.message.includes('Only owner') ||
    error?.message.includes('Insufficient role')

  const isDeletingId = deleteMutation.isPending
    ? deleteMutation.variables
    : null

  return (
    <DashboardShell
      title={userCopy.title}
      description={userCopy.description}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="gap-2 border-(--brand-line) font-semibold text-(--brand-ink) hover:bg-surface-soft"
          >
            <RefreshCw
              className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`}
            />
            {copy.common.refresh}
          </Button>

          <Button
            asChild
            size="sm"
            className="gap-2 rounded-xl bg-(--brand-orange) font-bold text-white shadow-xs hover:bg-(--brand-orange-deep)"
          >
            <Link to="/dashboard/users/new">
              <Plus className="size-4" />
              {userCopy.newUser}
            </Link>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <DashboardUsersMetrics
          copy={userCopy}
          totalUsers={totalUsers}
          ownerCount={ownerCount}
          adminCount={adminCount}
          teamCount={teamCount}
        />

        {/* Error / Access Denied State */}
        {error ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-500/20 bg-card p-8 text-center shadow-xs">
            <AlertCircle className="size-10 text-red-500" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-(--brand-ink)">
                {isAccessDenied
                  ? userCopy.accessDeniedTitle
                  : copy.common.loadError}
              </h3>
              <p className="text-xs text-(--brand-muted)">
                {error instanceof Error ? error.message : String(error)}
              </p>
            </div>
            {!isAccessDenied && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
                className="mt-2 text-xs font-semibold"
              >
                {copy.common.refresh}
              </Button>
            )}
          </div>
        ) : (
          /* Users Table */
          <div className="surface-card overflow-hidden">
            {isLoading ? (
              <div className="flex min-h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="size-6 animate-spin text-(--brand-orange)" />
                  <span className="text-sm font-semibold text-(--brand-muted)">
                    {userCopy.loading}
                  </span>
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-sm font-semibold text-(--brand-muted)">
                  {userCopy.emptyTitle}
                </p>
              </div>
            ) : (
              <DashboardUsersTable
                copy={copy}
                users={users}
                currentUserId={currentUser?.id}
                isDeletingId={isDeletingId ?? null}
                onDeleteUser={handleDeleteUser}
              />
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
