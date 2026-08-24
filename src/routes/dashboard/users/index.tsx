import { createFileRoute, Link } from '@tanstack/react-router'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  AlertCircle,
  Edit3,
  Plus,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react'
import { useMemo } from 'react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import type { UserRole } from '#/db/schema'
import { getDashboardCopy } from '#/features/dashboard/copy'
import {
  useCurrentSession,
  useDeleteUser,
  useUsers,
} from '#/features/users/hooks'
import type { UserWithSessionCount } from '#/features/users/queries'

export const Route = createFileRoute('/dashboard/users/')({
  component: DashboardUsersPage,
})

const columnHelper = createColumnHelper<UserWithSessionCount>()

function DashboardUsersPage() {
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
  const teamCount = users.filter(
    (u) => u.role === 'editor' || u.role === 'viewer',
  ).length

  const roleBadges: Record<
    UserRole,
    { label: string; className: string; icon: typeof Shield }
  > = {
    owner: {
      label: userCopy.roles.owner,
      className:
        'bg-linear-to-r from-(--brand-orange) to-(--brand-orange-deep) text-white border-transparent shadow-xs',
      icon: ShieldAlert,
    },
    admin: {
      label: userCopy.roles.admin,
      className:
        'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30',
      icon: ShieldCheck,
    },
    editor: {
      label: userCopy.roles.editor,
      className:
        'bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30',
      icon: Shield,
    },
    viewer: {
      label: userCopy.roles.viewer,
      className:
        'bg-(--surface-soft) text-(--brand-muted) border-(--brand-line)',
      icon: UserCheck,
    },
  }

  const isAccessDenied =
    error?.message.includes('Only owner') ||
    error?.message.includes('Insufficient role')

  const isDeletingId = deleteMutation.isPending
    ? deleteMutation.variables
    : null

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: userCopy.table.user,
        cell: (info) => {
          const row = info.row.original
          const isMe = currentUser?.id === row.id
          return (
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-(--brand-line) bg-(--brand-orange-soft) text-xs font-black text-(--brand-orange-deep)">
                {row.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex min-w-0 flex-col">
                <div className="flex items-center gap-2">
                  <span className="truncate font-bold text-(--brand-ink)">
                    {row.name}
                  </span>
                  {isMe && (
                    <Badge
                      variant="outline"
                      className="border-(--brand-orange)/40 bg-(--brand-orange-soft)/30 text-[0.65rem] font-extrabold text-(--brand-orange-deep)"
                    >
                      You
                    </Badge>
                  )}
                </div>
                <span className="truncate text-xs text-(--brand-muted)">
                  {row.email}
                </span>
              </div>
            </div>
          )
        },
      }),

      columnHelper.accessor('role', {
        header: userCopy.table.role,
        cell: (info) => {
          const role = info.getValue()
          const badge = roleBadges[role]
          const Icon = badge.icon

          return (
            <span
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-bold ${badge.className}`}
            >
              <Icon className="size-3.5" />
              {badge.label}
            </span>
          )
        },
      }),

      columnHelper.accessor('sessionCount', {
        header: userCopy.table.sessions,
        cell: (info) => {
          const count = info.getValue()
          return (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-(--brand-muted)">
              <span
                className={`size-2 rounded-full ${
                  count > 0 ? 'bg-emerald-500' : 'bg-zinc-400'
                }`}
              />
              {count} {count === 1 ? 'session' : 'sessions'}
            </span>
          )
        },
      }),

      columnHelper.accessor('createdAt', {
        header: userCopy.table.created,
        cell: (info) => {
          const raw = info.getValue()
          const date = new Date(raw)
          return (
            <span className="text-xs text-(--brand-muted)">
              {date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )
        },
      }),

      columnHelper.display({
        id: 'actions',
        header: userCopy.table.actions,
        cell: (info) => {
          const row = info.row.original
          const isMe = currentUser?.id === row.id

          return (
            <div className="flex items-center justify-end gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-8 gap-1.5 px-2 text-xs font-semibold text-(--brand-ink) hover:bg-surface-soft hover:text-(--brand-orange)"
              >
                <Link
                  to="/dashboard/users/$id"
                  params={{ id: row.id }}
                >
                  <Edit3 className="size-3.5" />
                  {copy.common.edit}
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                disabled={isMe || isDeletingId === row.id}
                onClick={() => void handleDeleteUser(row)}
                className="h-8 gap-1.5 px-2 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-40 dark:hover:bg-red-950/30"
                title={isMe ? userCopy.form.selfDeleteWarning : undefined}
              >
                <Trash2 className="size-3.5" />
                {isDeletingId === row.id ? '...' : copy.common.delete}
              </Button>
            </div>
          )
        },
      }),
    ],
    [currentUser, isDeletingId, roleBadges, userCopy, copy.common],
  )

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
            size="sm"
            asChild
            className="gap-2 rounded-xl bg-linear-to-r from-(--brand-orange) to-(--brand-orange-deep) font-bold text-white shadow-sm hover:opacity-90"
          >
            <Link to="/dashboard/users/new">
              <Plus className="size-4" />
              {userCopy.new}
            </Link>
          </Button>
        </div>
      }
    >
      {/* Access Denied State */}
      {isAccessDenied ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center sm:p-12">
          <ShieldAlert className="mx-auto size-12 text-red-500" />
          <h2 className="mt-4 text-xl font-black text-(--brand-ink)">
            {userCopy.accessDeniedTitle}
          </h2>
          <p className="mt-2 text-sm text-(--brand-muted)">
            {userCopy.accessDeniedDescription}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-(--brand-line) bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-(--brand-muted)">
                  {userCopy.metrics.total}
                </span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-(--brand-orange-soft) text-(--brand-orange-deep)">
                  <Users className="size-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-black text-(--brand-ink)">
                {totalUsers}
              </p>
            </div>

            <div className="rounded-2xl border border-(--brand-line) bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-(--brand-muted)">
                  {userCopy.metrics.owners}
                </span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-orange-500/15 text-orange-600">
                  <ShieldAlert className="size-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-black text-(--brand-ink)">
                {ownerCount}
              </p>
            </div>

            <div className="rounded-2xl border border-(--brand-line) bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-(--brand-muted)">
                  {userCopy.metrics.admins}
                </span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/15 text-purple-600">
                  <ShieldCheck className="size-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-black text-(--brand-ink)">
                {adminCount}
              </p>
            </div>

            <div className="rounded-2xl border border-(--brand-line) bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-(--brand-muted)">
                  {userCopy.metrics.team}
                </span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600">
                  <Shield className="size-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-black text-(--brand-ink)">
                {teamCount}
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-600 dark:text-red-400">
              <AlertCircle className="size-5 shrink-0" />
              <span>{error.message}</span>
            </div>
          )}

          {/* Table Container */}
          <div className="overflow-hidden rounded-2xl border border-(--brand-line) bg-card shadow-xs">
            {isLoading && users.length === 0 ? (
              <div className="flex min-h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="size-6 animate-spin text-(--brand-orange)" />
                  <span className="text-sm font-semibold text-(--brand-muted)">
                    {userCopy.loading}
                  </span>
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
                <Users className="size-10 text-(--brand-muted)" />
                <h3 className="mt-3 text-base font-bold text-(--brand-ink)">
                  {userCopy.emptyTitle}
                </h3>
                <p className="mt-1 max-w-sm text-xs text-(--brand-muted)">
                  {userCopy.emptyDescription}
                </p>
                <Button
                  size="sm"
                  asChild
                  className="mt-4 gap-2 rounded-xl bg-(--brand-orange) font-bold text-white shadow-sm hover:bg-(--brand-orange-deep)"
                >
                  <Link to="/dashboard/users/new">
                    <Plus className="size-4" />
                    {userCopy.new}
                  </Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-surface/50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="h-11 text-xs font-bold uppercase tracking-wider text-(--brand-muted)"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-(--brand-line) transition hover:bg-surface/60"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3.5">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
