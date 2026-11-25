import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { RotateCcw } from 'lucide-react'
import { useMemo } from 'react'

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
import { getDashboardCopy as getDefaultDashboardCopy } from '#/features/dashboard/copy'
import type { getCertificateCopy } from '#/features/certificates/copy'
import type { CertificateRecord } from '#/features/certificates/queries'
import { getCertificateColumns } from '#/features/certificates/components/table/dashboard-certificates-table-columns'

type CertificateStatusFilter = 'all' | CertificateRecord['status']
type DashboardCertificatesTableProps = {
  certificates: CertificateRecord[]
  copy: ReturnType<typeof getCertificateCopy>['dashboard']
  commonCopy?: ReturnType<typeof getDashboardCopy>['common']
  locale: string
  onDeleteCertificate: (certificate: CertificateRecord) => void
  search: string
  onSearchChange: (value: string) => void
  statusFilter: CertificateStatusFilter
  onStatusFilterChange: (value: string) => void
  issuerFilter: string
  onIssuerFilterChange: (value: string) => void
  page: number
  onPageChange: (page: number) => void
  onResetFilters: () => void
}

const PAGE_SIZE = 10

export function DashboardCertificatesTable({
  certificates,
  copy,
  commonCopy,
  locale,
  onDeleteCertificate,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  issuerFilter,
  onIssuerFilterChange,
  page,
  onPageChange,
  onResetFilters,
}: DashboardCertificatesTableProps) {
  const common = commonCopy ?? getDefaultDashboardCopy().common
  const issuers = useMemo(
    () =>
      [...new Set(certificates.map((certificate) => certificate.issuer))].sort(
        (left, right) => left.localeCompare(right, locale),
      ),
    [certificates, locale],
  )
  const filteredCertificates = useMemo(() => {
    const query = search.trim().toLocaleLowerCase(locale)

    return certificates.filter((certificate) => {
      if (statusFilter !== 'all' && certificate.status !== statusFilter) {
        return false
      }
      if (issuerFilter !== 'all' && certificate.issuer !== issuerFilter) {
        return false
      }
      if (!query) return true

      return [
        certificate.title,
        certificate.issuer,
        certificate.credentialId,
        certificate.descriptionEn,
        certificate.descriptionId,
      ].some((value) => value?.toLocaleLowerCase(locale).includes(query))
    })
  }, [certificates, issuerFilter, locale, search, statusFilter])
  const totalPages = Math.ceil(filteredCertificates.length / PAGE_SIZE)
  const activePage = Math.min(page, Math.max(totalPages, 1))
  const columns = useMemo(
    () =>
      getCertificateColumns({
        copy,
        commonCopy: common,
        locale,
        onDeleteCertificate,
      }),
    [copy, common, locale, onDeleteCertificate],
  )
  const table = useReactTable({
    data: filteredCertificates,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: Math.max(0, activePage - 1),
        pageSize: PAGE_SIZE,
      },
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 px-6 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-72">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder={copy.searchPlaceholder}
            clearAriaLabel={copy.clearSearch}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger
              aria-label={copy.statusFilterLabel}
              className="min-h-11 w-full border-(--brand-line) bg-(--surface-card) sm:w-44"
            >
              <SelectValue placeholder={copy.allStatuses} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{copy.allStatuses}</SelectItem>
              <SelectItem value="draft">{copy.statusDraft}</SelectItem>
              <SelectItem value="published">{copy.statusPublished}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={issuerFilter} onValueChange={onIssuerFilterChange}>
            <SelectTrigger
              aria-label={copy.issuerFilterLabel}
              className="min-h-11 w-full border-(--brand-line) bg-(--surface-card) sm:w-44"
            >
              <SelectValue placeholder={copy.allIssuers} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{copy.allIssuers}</SelectItem>
              {issuers.map((issuer) => (
                <SelectItem key={issuer} value={issuer}>
                  {issuer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-208">
          <TableHeader className="bg-(--brand-orange-soft)">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-5 py-3.5 text-xs font-bold text-(--brand-orange-deep)"
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
                    <p className="text-sm font-semibold text-(--brand-ink)">
                      {copy.noMatchingCertificates}
                    </p>
                    <p className="mt-1 max-w-xs text-xs text-(--brand-muted)">
                      {common.noResultsFilterDescription}
                    </p>
                    <button
                      type="button"
                      onClick={onResetFilters}
                      className="mt-3 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-(--brand-orange-soft) px-3 text-xs font-semibold text-(--brand-orange-deep) transition hover:bg-(--brand-orange) hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-(--brand-orange)"
                    >
                      <RotateCcw aria-hidden="true" className="size-3" />
                      {common.resetFilters}
                    </button>
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
                    <TableCell key={cell.id} className="px-5 py-4 align-middle">
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

      <div className="px-6 pb-6 pt-2">
        <DataPagination
          page={activePage}
          totalPages={totalPages}
          totalItems={filteredCertificates.length}
          pageSize={PAGE_SIZE}
          showItemCount
          onPageChange={onPageChange}
          itemLabel={copy.certificatesLabel}
          locale={locale === 'id-ID' ? 'id' : 'en'}
        />
      </div>
    </div>
  )
}
