import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'
import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { Button } from '#/components/ui/button'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { DashboardUsersMetrics } from '#/features/users/components/section/dashboard-users-metrics'
import { DashboardUsersTable } from '#/features/users/components/table/dashboard-users-table'
import { useDeleteUser } from '#/features/users/hooks'
import type { UserWithSessionCount } from '#/features/users/queries'
import {
  sessionQueryOptions,
  userQueryOptions,
} from '#/features/users/query-options'

export function DashboardUsersPage() {
  const copy = getDashboardCopy()
  const userCopy = copy.users

  const {
    data: users,
    isFetching,
    refetch,
  } = useSuspenseQuery(userQueryOptions.list())

  const { data: currentUser } = useSuspenseQuery(sessionQueryOptions.current())
  const deleteMutation = useDeleteUser()
  const [userToDelete, setUserToDelete] = useState<UserWithSessionCount | null>(null)
  const [warningNotice, setWarningNotice] = useState<string | null>(null)
  const [errorNotice, setErrorNotice] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteUser = async (targetUser: UserWithSessionCount) => {
    if (currentUser?.id === targetUser.id) {
      setWarningNotice(userCopy.form.selfDeleteWarning)
      return
    }
    setUserToDelete(targetUser)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return
    setIsDeleting(true)
    setErrorNotice(null)
    try {
      await deleteMutation.mutateAsync(userToDelete.id)
      setUserToDelete(null)
    } catch (err: unknown) {
      setErrorNotice(err instanceof Error ? err.message : userCopy.feedback.deleteError)
    } finally {
      setIsDeleting(false)
    }
  }

  // Calculate metrics
  const totalUsers = users.length
  const ownerCount = users.filter((u) => u.role === 'owner').length
  const adminCount = users.filter((u) => u.role === 'admin').length
  const teamCount = users.filter((u) => u.role === 'editor').length

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

        {/* Users Table */}
        <div className="surface-card overflow-hidden">
          {users.length === 0 ? (
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
      </div>

      {errorNotice ? (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-700 dark:text-red-200">
          {errorNotice}
        </div>
      ) : null}

      {/* Delete User Confirmation Dialog */}
      <AlertDialog
        open={Boolean(userToDelete)}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {userCopy.form.deleteUser}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {userToDelete
                ? `${userCopy.form.deleteConfirm} (${userToDelete.name || userToDelete.email})`
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {copy.common.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault()
                void confirmDeleteUser()
              }}
            >
              {isDeleting ? copy.common.saving : userCopy.form.deleteUser}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Warning Notice Dialog */}
      <AlertDialog
        open={Boolean(warningNotice)}
        onOpenChange={(open) => !open && setWarningNotice(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {copy.common.notice}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {warningNotice}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setWarningNotice(null)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}
