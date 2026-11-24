import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { Button } from '#/components/ui/button'
import { getCertificateCopy } from '#/features/certificates/copy'
import { DashboardCertificatesTable } from '#/features/certificates/components/table/dashboard-certificates-table'
import type { CertificateRecord } from '#/features/certificates/queries'
import { useDeleteCertificate } from '#/features/certificates/hooks'
import { certificateQueryOptions } from '#/features/certificates/query-options'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { getApiErrorMessage } from '#/lib/api-client'
import { getLocale } from '#/paraglide/runtime'

export function DashboardCertificatesPage() {
  const copy = getCertificateCopy().dashboard
  const common = getDashboardCopy().common
  const deleteMutation = useDeleteCertificate()
  const [certificateToDelete, setCertificateToDelete] =
    useState<CertificateRecord | null>(null)
  const [error, setError] = useState<string | null>(null)
  const {
    data: certificates,
    refetch,
    isFetching,
  } = useSuspenseQuery(certificateQueryOptions.list())
  const locale = getLocale() === 'id' ? 'id-ID' : 'en-US'

  const confirmDeleteCertificate = async () => {
    if (!certificateToDelete) return
    setError(null)
    try {
      await deleteMutation.mutateAsync(certificateToDelete.id)
      setCertificateToDelete(null)
    } catch (caught) {
      setError(getApiErrorMessage(caught, copy.deleteError))
    }
  }

  return (
    <DashboardShell
      title={copy.title}
      description={copy.description}
      actions={
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-(--brand-line) bg-surface-strong px-4 text-sm font-bold whitespace-nowrap text-(--brand-ink) transition hover:-translate-y-0.5 hover:border-(--brand-orange) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-orange) disabled:pointer-events-none disabled:opacity-50"
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            <RefreshCw
              aria-hidden="true"
              className={`size-4 ${isFetching ? 'animate-spin' : ''}`}
            />
            {copy.refresh}
          </button>
          <Link
            to="/dashboard/certificates/new"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-(--brand-orange) px-4 text-sm font-bold whitespace-nowrap text-white no-underline transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-orange)"
          >
            <Plus aria-hidden="true" className="size-4" />
            {copy.new}
          </Link>
        </div>
      }
    >
      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-700 dark:text-red-200">
          {error}
        </div>
      ) : null}

      {certificates.length === 0 ? (
        <section className="max-w-2xl border-y border-(--brand-line) py-8">
          <h2 className="text-lg font-semibold text-(--brand-ink)">
            {copy.emptyTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-(--brand-muted)">
            {copy.emptyDescription}
          </p>
          <Button asChild className="mt-5 min-h-11">
            <Link to="/dashboard/certificates/new">
              <Plus aria-hidden="true" data-icon="inline-start" />
              {copy.createFirst}
            </Link>
          </Button>
        </section>
      ) : (
        <section className="surface-card overflow-hidden">
          <DashboardCertificatesTable
            certificates={certificates}
            copy={copy}
            commonCopy={common}
            locale={locale}
            onDeleteCertificate={setCertificateToDelete}
          />
        </section>
      )}

      <AlertDialog
        open={Boolean(certificateToDelete)}
        onOpenChange={(open) => !open && setCertificateToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {certificateToDelete
                ? copy.deleteConfirm(certificateToDelete.title)
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              {common.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={(event) => {
                event.preventDefault()
                void confirmDeleteCertificate()
              }}
            >
              {deleteMutation.isPending ? common.saving : common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}
