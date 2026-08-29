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
import { getProjectColumns } from '#/features/projects/components/table/dashboard-projects-table-columns'
import type { ProjectRow } from '#/features/projects/components/table/dashboard-projects-table-features'

type DashboardProjectsTableProps = {
  copy: ReturnType<typeof getDashboardCopy>
  projects: ProjectRow[]
  onDeleteProject: (project: ProjectRow) => Promise<void>
}

export function DashboardProjectsTable({
  copy,
  projects,
  onDeleteProject,
}: DashboardProjectsTableProps) {
  const columns = useMemo(
    () => getProjectColumns({ copy, onDeleteProject }),
    [copy, onDeleteProject],
  )

  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table className="min-w-240">
      <TableHeader className="bg-(--brand-orange-soft)">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="whitespace-nowrap px-5 py-3.5 text-xs font-bold text-(--brand-orange-deep)"
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
            className="border-(--brand-line) transition hover:bg-surface/50"
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="px-5 py-4 align-top">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
