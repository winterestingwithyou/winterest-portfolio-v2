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
import { getDashboardCopy } from '#/features/dashboard/copy'
import { getUsersCopy } from '#/features/users/copy'
import { getUserColumns } from '#/features/users/components/table/dashboard-users-table-columns'
import type { UserWithSessionCount } from '#/features/users/components/table/dashboard-users-table-features'

type DashboardUsersTableProps = {
  copy?: ReturnType<typeof getUsersCopy>
  commonCopy?: ReturnType<typeof getDashboardCopy>['common']
  users: UserWithSessionCount[]
  currentUserId?: string
  isDeletingId: string | null
  onDeleteUser: (user: UserWithSessionCount) => Promise<void>
}

export function DashboardUsersTable({
  copy: customCopy,
  commonCopy: customCommonCopy,
  users,
  currentUserId,
  isDeletingId,
  onDeleteUser,
}: DashboardUsersTableProps) {
  const userCopy = customCopy ?? getUsersCopy()
  const commonCopy = customCommonCopy ?? getDashboardCopy().common

  const columns = useMemo(
    () =>
      getUserColumns({
        copy: userCopy,
        commonCopy,
        currentUserId,
        isDeletingId,
        onDeleteUser,
      }),
    [userCopy, commonCopy, currentUserId, isDeletingId, onDeleteUser],
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
