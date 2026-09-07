import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { FolderKanban, RotateCcw } from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'

import { DataPagination } from '#/components/ui/data-pagination'
import { SearchInput } from '#/components/ui/search-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
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
  search?: string
  onSearchChange?: (val: string) => void
  statusFilter?: string
  onStatusFilterChange?: (val: string) => void
  page?: number
  onPageChange?: (val: number) => void
  pageSize?: number
}

export function DashboardProjectsTable({
  copy,
  projects,
  onDeleteProject,
  search = '',
  onSearchChange,
  statusFilter = 'all',
  onStatusFilterChange,
  page = 1,
  onPageChange,
  pageSize = 10,
}: DashboardProjectsTableProps) {
  const [internalSearch, setInternalSearch] = useState(search)
  const [internalStatus, setInternalStatus] = useState(statusFilter)
  const [internalPage, setInternalPage] = useState(page)

  useEffect(() => {
    setInternalSearch(search)
  }, [search])

  useEffect(() => {
    setInternalStatus(statusFilter)
  }, [statusFilter])

  useEffect(() => {
    setInternalPage(page)
  }, [page])

  const activeSearch = onSearchChange ? search : internalSearch
  const activeStatus = onStatusFilterChange ? statusFilter : internalStatus
  const activePage = onPageChange ? page : internalPage

  const handleSearch = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val)
    } else {
      setInternalSearch(val)
      setInternalPage(1)
    }
  }

  const handleStatus = (val: string) => {
    if (onStatusFilterChange) {
      onStatusFilterChange(val)
    } else {
      setInternalStatus(val)
      setInternalPage(1)
    }
  }

  const handlePage = (p: number) => {
    if (onPageChange) {
      onPageChange(p)
    } else {
      setInternalPage(p)
    }
  }

  const columns = useMemo(
    () => getProjectColumns({ copy, onDeleteProject }),
    [copy, onDeleteProject],
  )

  // Filtered dataset according to search and status
  const filteredData = useMemo(() => {
    const q = activeSearch.toLowerCase().trim()
    return projects.filter((p) => {
      const matchStatus = activeStatus === 'all' || p.status === activeStatus
      if (!matchStatus) return false

      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    })
  }, [projects, activeSearch, activeStatus])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: Math.max(0, activePage - 1),
        pageSize,
      },
    },
    manualPagination: false,
  })

  const totalPages = table.getPageCount()

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 pt-6">
        <div className="w-full sm:w-72">
          <SearchInput
            value={activeSearch}
            onChange={handleSearch}
            placeholder={copy.projects.searchPlaceholder}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={activeStatus} onValueChange={handleStatus}>
            <SelectTrigger className="w-40 border-(--brand-line) bg-(--surface-card)">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
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
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-44 text-center"
                >
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="mb-3 grid size-10 place-items-center rounded-xl bg-(--brand-orange-soft) text-(--brand-orange-deep)">
                      <FolderKanban className="size-5" />
                    </div>
                    <p className="text-sm font-semibold text-(--brand-ink)">
                      {activeSearch || activeStatus !== 'all'
                        ? copy.projects.noMatchingProjects
                        : copy.projects.emptyTitle}
                    </p>
                    <p className="mt-1 max-w-xs text-xs text-(--brand-muted)">
                      {activeSearch || activeStatus !== 'all'
                        ? copy.common.noResultsFilterDescription
                        : copy.projects.emptyDescription}
                    </p>
                    {activeSearch || activeStatus !== 'all' ? (
                      <button
                        type="button"
                        onClick={() => {
                          handleSearch('')
                          handleStatus('all')
                        }}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-(--brand-orange-soft) px-3 py-1.5 text-xs font-semibold text-(--brand-orange-deep) transition hover:bg-(--brand-orange) hover:text-white cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-(--brand-orange)"
                      >
                        <RotateCcw className="size-3" />
                        {copy.common.resetFilters}
                      </button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-(--brand-line) transition hover:bg-surface/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-5 py-4 align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 pb-6 pt-2">
        <DataPagination
          page={activePage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          pageSize={pageSize}
          showItemCount
          onPageChange={handlePage}
          itemLabel={copy.projects.projectsLabel}
        />
      </div>
    </div>
  )
}
