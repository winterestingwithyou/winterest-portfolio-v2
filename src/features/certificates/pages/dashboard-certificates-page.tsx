import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Plus, RefreshCw } from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { Button } from '#/components/ui/button'
import { getCertificateCopy } from '#/features/certificates/copy'
import { certificateQueryOptions } from '#/features/certificates/query-options'
import { getLocale } from '#/paraglide/runtime'

export function DashboardCertificatesPage() {
  const copy = getCertificateCopy().dashboard
  const {
    data: certificates,
    refetch,
    isFetching,
  } = useSuspenseQuery(certificateQueryOptions.list())
  const locale = getLocale() === 'id' ? 'id-ID' : 'en-US'

  return (
    <DashboardShell
      title={copy.title}
      description={copy.description}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            <RefreshCw
              aria-hidden="true"
              data-icon="inline-start"
              className={isFetching ? 'animate-spin' : undefined}
            />
            {copy.refresh}
          </Button>
          <Button asChild className="min-h-11">
            <Link to="/dashboard/certificates/new">
              <Plus aria-hidden="true" data-icon="inline-start" />
              {copy.new}
            </Link>
          </Button>
        </div>
      }
    >
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
        <ul className="max-w-4xl divide-y divide-(--brand-line) border-y border-(--brand-line)">
          {certificates.map((certificate) => (
            <li key={certificate.id}>
              <Link
                to="/dashboard/certificates/$id"
                params={{ id: certificate.id }}
                className="flex min-h-20 flex-col gap-2 py-4 text-inherit no-underline hover:bg-(--surface-strong)/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-orange) sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-(--brand-ink)">
                    {certificate.title}
                  </span>
                  <span className="mt-1 block text-sm text-(--brand-muted)">
                    {certificate.issuer} ·{' '}
                    {new Intl.DateTimeFormat(locale, {
                      year: 'numeric',
                      month: 'short',
                      timeZone: 'UTC',
                    }).format(certificate.issuedAt)}
                  </span>
                </span>
                <span className="text-sm font-medium text-(--brand-muted)">
                  {certificate.status === 'published'
                    ? copy.statusPublished
                    : copy.statusDraft}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardShell>
  )
}
