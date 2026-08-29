import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { Edit3, Loader2, Trash2 } from 'lucide-react'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import type { getDashboardCopy } from '#/features/dashboard/copy'
import type { UserWithSessionCount } from '#/features/users/components/table/dashboard-users-table-features'
import { getRoleBadges } from '#/features/users/components/table/dashboard-users-table-features'

const columnHelper = createColumnHelper<UserWithSessionCount>()

type CreateUserColumnsOptions = {
  copy: ReturnType<typeof getDashboardCopy>
  currentUserId?: string
  isDeletingId: string | null
  onDeleteUser: (user: UserWithSessionCount) => Promise<void>
}

export function getUserColumns({
  copy,
  currentUserId,
  isDeletingId,
  onDeleteUser,
}: CreateUserColumnsOptions) {
  const userCopy = copy.users
  const roleBadges = getRoleBadges(userCopy)

  return [
    columnHelper.accessor('name', {
      header: userCopy.table.user,
      cell: (info) => {
        const row = info.row.original
        const isMe = currentUserId === row.id
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
        const isMe = currentUserId === row.id

        return (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 gap-1.5 px-2 text-xs font-semibold text-(--brand-ink) hover:bg-surface-soft hover:text-(--brand-orange)"
            >
              <Link to="/dashboard/users/$id" params={{ id: row.id }}>
                <Edit3 className="size-3.5" />
                {copy.common.edit}
              </Link>
            </Button>

            {!isMe && (
              <Button
                variant="ghost"
                size="sm"
                disabled={isDeletingId === row.id}
                onClick={() => void onDeleteUser(row)}
                className="h-8 gap-1.5 px-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 hover:text-red-600"
              >
                {isDeletingId === row.id ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
                {copy.common.delete}
              </Button>
            )}
          </div>
        )
      },
    }),
  ]
}
