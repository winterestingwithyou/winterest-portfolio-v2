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
import { getDashboardCopy as getDefaultDashboardCopy } from '#/features/dashboard/copy'
import type { getCertificateCopy } from '#/features/certificates/copy'
import type { CertificateRecord } from '#/features/certificates/queries'
import { getCertificateColumns } from '#/features/certificates/components/table/dashboard-certificates-table-columns'

type DashboardCertificatesTableProps = {
  certificates: CertificateRecord[]
  copy: ReturnType<typeof getCertificateCopy>['dashboard']
  commonCopy?: ReturnType<typeof getDashboardCopy>['common']
  locale: string
  onDeleteCertificate: (certificate: CertificateRecord) => void
}

export function DashboardCertificatesTable({
  certificates,
  copy,
  commonCopy,
  locale,
  onDeleteCertificate,
}: DashboardCertificatesTableProps) {
  const common = commonCopy ?? getDefaultDashboardCopy().common
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
    data: certificates,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
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
        {table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            className="border-(--brand-line) transition hover:bg-surface/50"
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="px-5 py-4 align-middle">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
