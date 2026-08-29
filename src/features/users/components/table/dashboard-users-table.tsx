import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import type { getDashboardCopy } from '#/features/dashboard/copy'
import { getUserColumns } from '#/features/users/components/table/dashboard-users-table-columns'
import type { UserWithSessionCount } from '#/features/users/components/table/dashboard-users-table-features'

type DashboardUsersTableProps = {
  copy: ReturnType<typeof getDashboardCopy>
  users: UserWithSessionCount[]
  currentUserId?: string
  isDeletingId: string | null
  onDeleteUser: (user: UserWithSessionCount) => Promise<void>
}

export function DashboardUsersTable({
  copy,
  users,
  currentUserId,
  isDeletingId,
  onDeleteUser,
}: DashboardUsersTableProps) {
  const columns = useMemo(
    () =>
      getUserColumns({
        copy,
        currentUserId,
        isDeletingId,
        onDeleteUser,
      }),
    [copy, currentUserId, isDeletingId, onDeleteUser],
  )

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table className="min-w-200">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="border-(--brand-line) bg-surface-soft/40 hover:bg-surface-soft/40"
          >
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="whitespace-nowrap px-4 py-3 text-xs font-bold text-(--brand-muted)"
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
            className="border-(--brand-line) transition-colors hover:bg-surface-soft/20"
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="px-4 py-3.5 align-middle">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
