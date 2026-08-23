import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { Button } from '#/components/ui/button'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { useCurrentSession, useUser } from '#/features/users/hooks'
import { UserEditorForm } from '#/features/users/user-editor-form'

export const Route = createFileRoute('/dashboard/users/$id')({
  component: DashboardUserEditPage,
})

function DashboardUserEditPage() {
  const { id } = Route.useParams()
  const copy = getDashboardCopy()
  const userCopy = copy.users

  const {
    data: targetUser,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useUser(id)

  const { data: currentUser } = useCurrentSession()

  return (
    <DashboardShell
      title={
        targetUser
          ? `${userCopy.editUser}: ${targetUser.name}`
          : userCopy.editUser
      }
      description={userCopy.editDescription}
      actions={
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
      }
    >
      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="size-6 animate-spin text-(--brand-orange)" />
            <span className="text-sm font-semibold text-(--brand-muted)">
              {userCopy.loadingUser}
            </span>
          </div>
        </div>
      ) : error ?? !targetUser ? (
        <div className="mx-auto max-w-xl rounded-2xl border border-red-500/20 bg-card p-8 text-center shadow-xs">
          <AlertCircle className="mx-auto size-10 text-red-500" />
          <h3 className="mt-3 text-base font-bold text-(--brand-ink)">
            {error?.message ?? userCopy.notFound}
          </h3>
          <Button
            asChild
            size="sm"
            className="mt-4 gap-2 rounded-xl bg-(--brand-orange) font-bold text-white hover:bg-(--brand-orange-deep)"
          >
            <Link to="/dashboard/users">
              <ArrowLeft className="size-4" />
              {copy.common.back}
            </Link>
          </Button>
        </div>
      ) : (
        <UserEditorForm
          mode="edit"
          initialData={targetUser}
          currentUserId={currentUser?.id}
        />
      )}
    </DashboardShell>
  )
}
