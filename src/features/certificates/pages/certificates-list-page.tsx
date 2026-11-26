import { useMemo } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'

import { Container, SectionHeader } from '#/components/marketing/section'
import { DataPagination } from '#/components/ui/data-pagination'
import { SearchInput } from '#/components/ui/search-input'
import type { CertificatesPageConfig } from '#/features/portfolio/page-content-schemas'
import type { CertificateRecord } from '#/features/certificates/queries'
import { getCertificateCopy } from '#/features/certificates/copy'
import { getLocale } from '#/paraglide/runtime'

type CertificatesListPageProps = {
  certificates: CertificateRecord[]
  pageContent: CertificatesPageConfig
}

const PAGE_SIZE = 10

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function CertificatesListPage({
  certificates,
  pageContent,
}: CertificatesListPageProps) {
  const copy = getCertificateCopy().public
  const locale = getLocale() === 'id' ? 'id' : 'en'
  const intlLocale = locale === 'id' ? 'id-ID' : 'en-US'
  const today = new Date().toISOString().slice(0, 10)
  const searchParams = useSearch({ from: '/certificates/' })
  const navigate = useNavigate({ from: '/certificates/' })
  const searchQuery = searchParams.q ?? ''
  const page = searchParams.page ?? 1

  const resolvedEyebrow =
    (locale === 'en' ? pageContent.eyebrowEn : pageContent.eyebrowId) ||
    copy.eyebrow
  const resolvedTitle =
    (locale === 'en' ? pageContent.titleEn : pageContent.titleId) || copy.title
  const resolvedDescription = pageContent.showDescription
    ? (locale === 'en'
        ? pageContent.descriptionEn
        : pageContent.descriptionId) || copy.description
    : undefined

  const filteredCertificates = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase(locale)
    if (!query) return certificates

    return certificates.filter((certificate) =>
      [
        certificate.title,
        certificate.issuer,
        certificate.descriptionEn,
        certificate.descriptionId,
      ].some((value) => value?.toLocaleLowerCase(locale).includes(query)),
    )
  }, [certificates, locale, searchQuery])

  const totalPages = Math.ceil(filteredCertificates.length / PAGE_SIZE)
  const currentPage = Math.min(page, Math.max(totalPages, 1))
  const paginatedCertificates = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredCertificates.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredCertificates])

  const handleSearchChange = (value: string) => {
    void navigate({
      search: (previous) => ({
        ...previous,
        q: value || undefined,
        page: undefined,
      }),
      replace: true,
      resetScroll: false,
    })
  }

  const handlePageChange = (nextPage: number) => {
    void navigate({
      search: (previous) => ({
        ...previous,
        page: nextPage === 1 ? undefined : nextPage,
      }),
      replace: true,
      resetScroll: false,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearSearch = () => {
    void navigate({ search: () => ({}), replace: true, resetScroll: false })
  }

  return (
    <main className="py-12 sm:py-16 md:py-20">
      <Container>
        <SectionHeader
          eyebrow={resolvedEyebrow}
          title={resolvedTitle}
          description={resolvedDescription}
          asHeading="h1"
        />

        {certificates.length === 0 ? (
          <p className="border-y border-(--brand-line) py-8 text-sm text-(--brand-muted)">
            {copy.empty}
          </p>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-3 border-y border-(--brand-line) py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-(--brand-muted)" aria-live="polite">
                {filteredCertificates.length} {copy.itemLabel}
              </p>
              <label className="w-full sm:max-w-sm">
                <span className="sr-only">{copy.searchLabel}</span>
                <SearchInput
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={copy.searchPlaceholder}
                  clearAriaLabel={copy.clearSearch}
                  className="w-full"
                />
              </label>
            </div>

            {filteredCertificates.length === 0 ? (
              <div className="border-b border-(--brand-line) py-10 text-center">
                <h2 className="text-xl font-semibold text-(--brand-ink)">
                  {copy.noMatchesTitle}
                </h2>
                <p className="mt-2 text-sm text-(--brand-muted)">
                  {copy.noMatchesDescription}
                </p>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md border border-(--brand-line) px-4 text-sm font-semibold text-(--brand-ink) transition hover:border-(--brand-orange) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-orange)"
                >
                  {copy.clearSearch}
                </button>
              </div>
            ) : (
              <>
                <ul className="space-y-4">
                  {paginatedCertificates.map((certificate) => {
                    const isExpired =
                      certificate.expiresAt &&
                      certificate.expiresAt.toISOString().slice(0, 10) < today
                    const description =
                      locale === 'id'
                        ? certificate.descriptionId
                        : certificate.descriptionEn
                    const hasCover = Boolean(certificate.coverImageUrl)

                    return (
                      <li
                        key={certificate.id}
                        className={`grid gap-5 rounded-xl border border-(--brand-line) bg-card p-4 sm:p-5 ${
                          hasCover
                            ? 'sm:grid-cols-[minmax(9rem,13rem)_minmax(0,1fr)] lg:grid-cols-[minmax(9rem,13rem)_minmax(0,1fr)_12rem]'
                            : 'lg:grid-cols-[minmax(0,1fr)_12rem]'
                        }`}
                      >
                        {certificate.coverImageUrl ? (
                          <img
                            src={certificate.coverImageUrl}
                            alt={copy.coverAlt(
                              certificate.title,
                              certificate.issuer,
                            )}
                            loading="lazy"
                            className="aspect-4/3 w-full rounded-lg border border-(--brand-line) bg-card object-cover"
                          />
                        ) : null}
                        <div className="min-w-0">
                          <h2 className="text-xl font-semibold tracking-tight text-(--brand-ink)">
                            {certificate.title}
                          </h2>
                          <p className="mt-1 text-sm font-medium text-(--brand-muted)">
                            {certificate.issuer}
                          </p>
                          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-(--brand-muted)">
                            <div className="flex gap-1.5">
                              <dt>{copy.issued}:</dt>
                              <dd>
                                {formatDate(certificate.issuedAt, intlLocale)}
                              </dd>
                            </div>
                            {certificate.expiresAt ? (
                              <div className="flex gap-1.5">
                                <dt>{copy.expires}:</dt>
                                <dd>
                                  {formatDate(
                                    certificate.expiresAt,
                                    intlLocale,
                                  )}
                                </dd>
                              </div>
                            ) : null}
                          </dl>
                          {isExpired ? (
                            <p className="mt-3 text-sm font-semibold text-(--brand-muted)">
                              {copy.expired}
                            </p>
                          ) : null}
                          {certificate.credentialId ? (
                            <p className="mt-3 break-all text-sm text-(--brand-muted)">
                              <span className="font-medium text-(--brand-ink)">
                                {copy.credentialId}:
                              </span>{' '}
                              {certificate.credentialId}
                            </p>
                          ) : null}
                          {description ? (
                            <p className="mt-3 max-w-3xl text-sm leading-7 text-(--brand-muted)">
                              {description}
                            </p>
                          ) : null}
                        </div>
                        <div
                          className={`flex flex-wrap items-start gap-3 ${
                            hasCover
                              ? 'sm:col-span-2 lg:col-span-1 lg:flex-col lg:items-stretch'
                              : 'lg:flex-col lg:items-stretch'
                          }`}
                        >
                          {certificate.pdfUrl ? (
                            <a
                              href={certificate.pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex min-h-11 items-center justify-center rounded-md border border-(--brand-line) px-4 text-center text-sm font-semibold text-(--brand-ink) underline-offset-4 hover:border-(--brand-orange) hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-orange)"
                            >
                              {copy.openPdf}
                            </a>
                          ) : null}
                          {certificate.verificationUrl ? (
                            <a
                              href={certificate.verificationUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex min-h-11 items-center justify-center rounded-md px-2 text-center text-sm font-semibold text-(--brand-orange-deep) underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-orange)"
                            >
                              {copy.verify}
                            </a>
                          ) : null}
                        </div>
                      </li>
                    )
                  })}
                </ul>
                <DataPagination
                  page={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredCertificates.length}
                  pageSize={PAGE_SIZE}
                  showItemCount
                  onPageChange={handlePageChange}
                  itemLabel={copy.itemLabel}
                  locale={locale}
                  className="mt-6"
                />
              </>
            )}
          </>
        )}
      </Container>
    </main>
  )
}
