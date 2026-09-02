import { Link } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useMemo } from 'react'

import { getDashboardCopy } from '#/features/dashboard/copy'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { getCategoryColumns } from '#/features/technologies/components/table/dashboard-categories-table-columns'
import type { CategoryRecord } from '#/features/technologies/components/table/dashboard-categories-table-features'

type DashboardCategoriesTableProps = {
  categories: CategoryRecord[]
  isLoading: boolean
  onDeleteCategory: (id: string, name: string) => Promise<void>
}

export function DashboardCategoriesTable({
  categories,
  isLoading,
  onDeleteCategory,
}: DashboardCategoriesTableProps) {
  const copy = getDashboardCopy()
  const tableCopy = copy.stack.categoriesTable

  const columns = useMemo(
    () => getCategoryColumns({ copy, onDeleteCategory }),
    [copy, onDeleteCategory],
  )

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return (
      <div className="p-6 text-sm font-semibold text-(--brand-muted)">
        {tableCopy.loading}
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-(--brand-muted)">{tableCopy.empty}</p>
        <Link
          to="/dashboard/stack/categories/new"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-(--brand-orange) px-4 py-2 text-xs font-bold text-white no-underline"
        >
          <Plus className="size-3.5" />
          {tableCopy.addFirst}
        </Link>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
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
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
