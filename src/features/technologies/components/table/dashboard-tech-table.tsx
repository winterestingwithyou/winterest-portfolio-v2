import { Link } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useMemo } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { getTechColumns } from '#/features/technologies/components/table/dashboard-tech-table-columns'
import type {
  CategoryRecord,
  TechnologyWithCategories,
} from '#/features/technologies/components/table/dashboard-tech-table-features'
import { getCategoryMap } from '#/features/technologies/components/table/dashboard-tech-table-features'

type DashboardTechTableProps = {
  technologies: TechnologyWithCategories[]
  categories: CategoryRecord[]
  isLoading: boolean
  onDeleteTech: (id: string, name: string) => Promise<void>
}

export function DashboardTechTable({
  technologies,
  categories,
  isLoading,
  onDeleteTech,
}: DashboardTechTableProps) {
  const categoryMap = useMemo(() => getCategoryMap(categories), [categories])

  const columns = useMemo(
    () => getTechColumns({ categoryMap, onDeleteTech }),
    [categoryMap, onDeleteTech],
  )

  const table = useReactTable({
    data: technologies,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return (
      <div className="p-6 text-sm font-semibold text-(--brand-muted)">
        Memuat daftar teknologi...
      </div>
    )
  }

  if (technologies.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-(--brand-muted)">Belum ada teknologi.</p>
        <Link
          to="/dashboard/stack/technologies/new"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-(--brand-orange) px-4 py-2 text-xs font-bold text-white no-underline"
        >
          <Plus className="size-3.5" />
          Tambah Teknologi Pertama
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
