import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { Edit3, Trash2 } from 'lucide-react'

import type { getDashboardCopy } from '#/features/dashboard/copy'
import { getDashboardCopy as getDefaultDashboardCopy } from '#/features/dashboard/copy'
import type { getCertificateCopy } from '#/features/certificates/copy'
import type { CertificateRecord } from '#/features/certificates/queries'
import { formatCertificateDate } from '#/features/certificates/components/table/dashboard-certificates-table-features'

const columnHelper = createColumnHelper<CertificateRecord>()

type CertificateDashboardCopy = ReturnType<
  typeof getCertificateCopy
>['dashboard']

type CertificateColumnOptions = {
  copy: CertificateDashboardCopy
  commonCopy?: ReturnType<typeof getDashboardCopy>['common']
  locale: string
  onDeleteCertificate: (certificate: CertificateRecord) => void
}

export function getCertificateColumns({
  copy,
  commonCopy,
  locale,
  onDeleteCertificate,
}: CertificateColumnOptions) {
  const formCopy = copy.form
  const common = commonCopy ?? getDefaultDashboardCopy().common

  return [
    columnHelper.accessor('title', {
      header: formCopy.title,
      cell: (info) => (
        <span
          className="block max-w-md truncate font-semibold text-(--brand-ink)"
          title={info.getValue()}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('issuer', {
      header: formCopy.issuer,
      cell: (info) => (
        <span className="whitespace-nowrap text-sm text-(--brand-muted)">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('issuedAt', {
      header: formCopy.issuedAt,
      cell: (info) => (
        <span className="whitespace-nowrap text-sm text-(--brand-muted)">
          {formatCertificateDate(info.getValue(), locale)}
        </span>
      ),
    }),
    columnHelper.accessor('expiresAt', {
      header: formCopy.expiresAt,
      cell: (info) => {
        const expiresAt = info.getValue()
        return (
          <span className="whitespace-nowrap text-sm text-(--brand-muted)">
            {expiresAt ? formatCertificateDate(expiresAt, locale) : '-'}
          </span>
        )
      },
    }),
    columnHelper.accessor('status', {
      header: formCopy.status,
      cell: (info) => {
        const isPublished = info.getValue() === 'published'
        return (
          <span
            className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold ${
              isPublished
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-(--brand-orange)/30 bg-(--brand-orange-soft) text-(--brand-orange-deep)'
            }`}
          >
            {isPublished ? copy.statusPublished : copy.statusDraft}
          </span>
        )
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: () => (
        <div className="whitespace-nowrap text-right font-bold">
          {common.actions}
        </div>
      ),
      cell: (info) => {
        const certificate = info.row.original
        return (
          <div className="flex items-center justify-end gap-2">
            <Link
              to="/dashboard/certificates/$id"
              params={{ id: certificate.id }}
              className="inline-grid size-9 place-items-center rounded-lg border border-(--brand-line) bg-surface-strong text-(--brand-ink) transition hover:border-(--brand-orange) hover:text-(--brand-orange-deep) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-orange)"
              title={`${common.edit} ${certificate.title}`}
            >
              <span className="sr-only">
                {common.edit} {certificate.title}
              </span>
              <Edit3 aria-hidden="true" className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => void onDeleteCertificate(certificate)}
              className="inline-grid size-9 place-items-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-700 transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:text-red-200"
              title={`${common.delete} ${certificate.title}`}
            >
              <span className="sr-only">
                {common.delete} {certificate.title}
              </span>
              <Trash2 aria-hidden="true" className="size-4" />
            </button>
          </div>
        )
      },
    }),
  ]
}
