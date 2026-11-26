import { useCallback, useEffect, useState } from 'react'
import type { UseEmblaCarouselType } from 'embla-carousel-react'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { Container, SectionHeader } from '#/components/marketing/section'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '#/components/ui/carousel'
import type { CertificateRecord } from '#/features/certificates/queries'

function formatIssueDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date)
}

type CertificateCarouselSectionProps = {
  certificates: CertificateRecord[]
  copy: {
    eyebrow?: string
    title: string
    description?: string
    viewAll: string
    issued: string
    openPdf: string
    verify: string
    expired: string
    position: (current: number, total: number) => string
    coverAlt: (title: string, issuer: string) => string
  }
  locale: 'en' | 'id'
}

export function CertificateCarouselSection({
  certificates,
  copy,
  locale,
}: CertificateCarouselSectionProps) {
  const [api, setApi] = useState<UseEmblaCarouselType[1]>()
  const [selectedSnap, setSelectedSnap] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const selectedIndex = selectedSnap % certificates.length
  const intlLocale = locale === 'id' ? 'id-ID' : 'en-US'

  const updateSelectedIndex = useCallback(() => {
    setSelectedSnap(api?.selectedScrollSnap() ?? 0)
  }, [api])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 64rem)')
    const updateDesktopState = () => setIsDesktop(mediaQuery.matches)
    updateDesktopState()
    mediaQuery.addEventListener('change', updateDesktopState)
    return () => mediaQuery.removeEventListener('change', updateDesktopState)
  }, [])

  useEffect(() => {
    if (!api) return
    updateSelectedIndex()
    api.on('select', updateSelectedIndex)
    api.on('reInit', updateSelectedIndex)
    return () => {
      api.off('select', updateSelectedIndex)
      api.off('reInit', updateSelectedIndex)
    }
  }, [api, updateSelectedIndex])

  if (certificates.length === 0) return null

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
        />
      </Container>

      {certificates.length === 1 ? (
        <Container>
          <div className="mx-auto w-[min(88vw,35rem)]">
            <CertificateSlide
              certificate={certificates[0]}
              copy={copy}
              locale={intlLocale}
            />
          </div>
        </Container>
      ) : (
        <>
          <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
            <Carousel
              opts={{ loop: true, align: 'center', containScroll: false }}
              setApi={setApi}
              tabIndex={0}
              className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--brand-orange)"
              aria-label={copy.title}
            >
              <CarouselContent className="items-stretch py-2">
                {Array.from(
                  { length: isDesktop ? 3 : 1 },
                  (_, setIndex) => setIndex,
                ).flatMap((setIndex) =>
                  certificates.map((certificate, index) => {
                    const isDuplicate = setIndex > 0
                    const slideIndex = setIndex * certificates.length + index
                    return (
                      <CarouselItem
                        key={`${certificate.id}-${setIndex}`}
                        aria-hidden={isDuplicate}
                        inert={isDuplicate}
                        className="basis-[min(88vw,35rem)] pl-3 sm:pl-5"
                      >
                        <div
                          className={`h-full transition-transform duration-300 motion-reduce:transition-none ${
                            slideIndex === selectedSnap
                              ? 'scale-100'
                              : 'scale-[0.94]'
                          }`}
                        >
                          <CertificateSlide
                            certificate={certificate}
                            copy={copy}
                            locale={intlLocale}
                          />
                        </div>
                      </CarouselItem>
                    )
                  }),
                )}
              </CarouselContent>
            </Carousel>
          </div>
          <Container>
            <div
              className="mt-5 flex items-center justify-center gap-2"
              aria-hidden="true"
            >
              {certificates.map((certificate, index) => (
                <span
                  key={certificate.id}
                  className={`h-1.5 rounded-full transition-[width,background-color] motion-reduce:transition-none ${
                    index === selectedIndex
                      ? 'w-6 bg-(--brand-orange)'
                      : 'w-1.5 bg-(--brand-line)'
                  }`}
                />
              ))}
            </div>
            <p className="sr-only" aria-live="polite">
              {copy.position(selectedIndex + 1, certificates.length)}
            </p>
          </Container>
        </>
      )}

      <Container>
        <div className="mt-10 flex justify-center">
          <Link
            to="/certificates"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-(--brand-line) bg-card px-6 text-sm font-bold text-(--brand-ink) no-underline transition duration-200 hover:-translate-y-0.5 hover:border-(--brand-orange) hover:text-(--brand-orange-deep) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--brand-orange)"
          >
            {copy.viewAll}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  )
}

function CertificateSlide({
  certificate,
  copy,
  locale,
}: {
  certificate: CertificateRecord
  copy: CertificateCarouselSectionProps['copy']
  locale: string
}) {
  const today = new Date().toISOString().slice(0, 10)
  const isExpired =
    certificate.expiresAt &&
    certificate.expiresAt.toISOString().slice(0, 10) < today

  return (
    <article className="h-full overflow-hidden rounded-xl border border-(--brand-line) bg-card">
      {certificate.coverImageUrl ? (
        <img
          src={certificate.coverImageUrl}
          alt={copy.coverAlt(certificate.title, certificate.issuer)}
          loading="lazy"
          className="aspect-[16/9] w-full bg-(--surface-strong) object-cover"
        />
      ) : (
        <div className="flex aspect-[16/9] items-end border-b border-(--brand-line) bg-(--surface-strong) p-5 sm:p-7">
          <p className="max-w-[24ch] text-2xl font-semibold tracking-tight text-(--brand-ink) sm:text-3xl">
            {certificate.issuer}
          </p>
        </div>
      )}
      <div className="flex h-full flex-col gap-4 p-5 sm:p-6">
        <div>
          <h3 className="text-lg font-semibold leading-snug text-(--brand-ink) sm:text-xl">
            {certificate.title}
          </h3>
          <p className="mt-1 text-sm text-(--brand-muted)">
            {certificate.issuer} · {copy.issued}{' '}
            {formatIssueDate(certificate.issuedAt, locale)}
          </p>
          {isExpired ? (
            <p className="mt-2 text-sm font-medium text-(--brand-muted)">
              {copy.expired}
            </p>
          ) : null}
        </div>
        <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {certificate.pdfUrl ? (
            <a
              href={certificate.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="min-h-11 inline-flex items-center text-(--brand-ink) underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-orange)"
            >
              {copy.openPdf}
            </a>
          ) : null}
          {certificate.verificationUrl ? (
            <a
              href={certificate.verificationUrl}
              target="_blank"
              rel="noreferrer"
              className="min-h-11 inline-flex items-center text-(--brand-orange-deep) underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-orange)"
            >
              {copy.verify}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
