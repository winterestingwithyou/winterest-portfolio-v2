import { Container, SectionHeader } from '#/components/marketing/section'
import type { CertificateRecord } from '#/features/certificates/queries'
import { getCertificateCopy } from '#/features/certificates/copy'
import { getLocale } from '#/paraglide/runtime'

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
}: {
  certificates: CertificateRecord[]
}) {
  const copy = getCertificateCopy().public
  const locale = getLocale() === 'id' ? 'id-ID' : 'en-US'
  const today = new Date().toISOString().slice(0, 10)

  return (
    <main className="py-12 sm:py-16 md:py-20">
      <Container>
        <SectionHeader
          title={copy.title}
          description={copy.description}
          asHeading="h1"
        />

        {certificates.length === 0 ? (
          <p className="border-y border-(--brand-line) py-8 text-sm text-(--brand-muted)">
            {copy.empty}
          </p>
        ) : (
          <ul className="divide-y divide-(--brand-line) border-y border-(--brand-line)">
            {certificates.map((certificate) => {
              const isExpired =
                certificate.expiresAt &&
                certificate.expiresAt.toISOString().slice(0, 10) < today
              const description =
                locale === 'id-ID'
                  ? certificate.descriptionId
                  : certificate.descriptionEn

              return (
                <li
                  key={certificate.id}
                  className={
                    certificate.coverImageUrl
                      ? 'grid gap-5 py-6 sm:grid-cols-[minmax(9rem,13rem)_1fr] sm:gap-8'
                      : 'py-6'
                  }
                >
                  {certificate.coverImageUrl ? (
                    <img
                      src={certificate.coverImageUrl}
                      alt={copy.coverAlt(certificate.title, certificate.issuer)}
                      loading="lazy"
                      className="aspect-[4/3] w-full rounded-lg border border-(--brand-line) bg-card object-cover"
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
                        <dd>{formatDate(certificate.issuedAt, locale)}</dd>
                      </div>
                      {certificate.expiresAt ? (
                        <div className="flex gap-1.5">
                          <dt>{copy.expires}:</dt>
                          <dd>{formatDate(certificate.expiresAt, locale)}</dd>
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
                    <div className="mt-5 flex flex-wrap gap-3">
                      {certificate.pdfUrl ? (
                        <a
                          href={certificate.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-11 items-center rounded-md border border-(--brand-line) px-4 text-sm font-semibold text-(--brand-ink) underline-offset-4 hover:border-(--brand-orange) hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-orange)"
                        >
                          {copy.openPdf}
                        </a>
                      ) : null}
                      {certificate.verificationUrl ? (
                        <a
                          href={certificate.verificationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-(--brand-orange-deep) underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-orange)"
                        >
                          {copy.verify}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Container>
    </main>
  )
}
