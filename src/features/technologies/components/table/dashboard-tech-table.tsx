import { Link } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Cpu, Plus, RotateCcw } from 'lucide-react'
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
import { getDashboardCopy } from '#/features/dashboard/copy'
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
  search?: string
  onSearchChange?: (val: string) => void
  categoryFilter?: string
  onCategoryFilterChange?: (val: string) => void
  page?: number
  onPageChange?: (val: number) => void
  pageSize?: number
}

export function DashboardTechTable({
  technologies,
  categories,
  isLoading,
  onDeleteTech,
  search = '',
  onSearchChange,
  categoryFilter = 'all',
  onCategoryFilterChange,
  page = 1,
  onPageChange,
  pageSize = 10,
}: DashboardTechTableProps) {
  const copy = getDashboardCopy()
  const tableCopy = copy.stack.techTable
  const categoryMap = useMemo(() => getCategoryMap(categories), [categories])

  const [internalSearch, setInternalSearch] = useState(search)
  const [internalCategory, setInternalCategory] = useState(categoryFilter)
  const [internalPage, setInternalPage] = useState(page)

  useEffect(() => {
    setInternalSearch(search)
  }, [search])

  useEffect(() => {
    setInternalCategory(categoryFilter)
  }, [categoryFilter])

  useEffect(() => {
    setInternalPage(page)
  }, [page])

  const activeSearch = onSearchChange ? search : internalSearch
  const activeCategory = onCategoryFilterChange
    ? categoryFilter
    : internalCategory
  const activePage = onPageChange ? page : internalPage

  const handleSearch = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val)
    } else {
      setInternalSearch(val)
      setInternalPage(1)
    }
  }

  const handleCategory = (val: string) => {
    if (onCategoryFilterChange) {
      onCategoryFilterChange(val)
    } else {
      setInternalCategory(val)
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
    () => getTechColumns({ copy, categoryMap, onDeleteTech }),
    [copy, categoryMap, onDeleteTech],
  )

  const filteredData = useMemo(() => {
    const q = activeSearch.toLowerCase().trim()
    return technologies.filter((tech) => {
      const matchCategory =
        activeCategory === 'all' || tech.categoryIds.includes(activeCategory)
      if (!matchCategory) return false

      if (!q) return true
      return (
        tech.name.toLowerCase().includes(q) ||
        tech.slug.toLowerCase().includes(q)
      )
    })
  }, [technologies, activeSearch, activeCategory])

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

  if (isLoading) {
    return (
      <div className="p-6 text-sm font-semibold text-(--brand-muted)">
        {tableCopy.loading}
      </div>
    )
  }

  if (technologies.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-(--brand-muted)">{tableCopy.empty}</p>
        <Link
          to="/dashboard/stack/technologies/new"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-(--brand-orange) px-4 py-2 text-xs font-bold text-white no-underline"
        >
          <Plus className="size-3.5" />
          {tableCopy.addFirst}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 pt-6">
        <div className="w-full sm:w-72">
          <SearchInput
            value={activeSearch}
            onChange={handleSearch}
            placeholder="Search technologies..."
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={activeCategory} onValueChange={handleCategory}>
            <SelectTrigger className="w-48 border-(--brand-line) bg-(--surface-card)">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
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
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-44 text-center"
                >
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="mb-3 grid size-10 place-items-center rounded-xl bg-(--brand-orange-soft) text-(--brand-orange-deep)">
                      <Cpu className="size-5" />
                    </div>
                    <p className="text-sm font-semibold text-(--brand-ink)">
                      {activeSearch || activeCategory !== 'all'
                        ? copy.stack.noMatchingTech
                        : copy.stack.techTable.empty}
                    </p>
                    <p className="mt-1 max-w-xs text-xs text-(--brand-muted)">
                      {activeSearch || activeCategory !== 'all'
                        ? copy.common.noResultsFilterDescription
                        : copy.stack.techTable.empty}
                    </p>
                    {activeSearch || activeCategory !== 'all' ? (
                      <button
                        type="button"
                        onClick={() => {
                          handleSearch('')
                          handleCategory('all')
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
          totalPages={table.getPageCount()}
          totalItems={filteredData.length}
          pageSize={pageSize}
          showItemCount
          onPageChange={handlePage}
          itemLabel={copy.stack.technologiesLabel}
        />
      </div>
    </div>
  )
}
