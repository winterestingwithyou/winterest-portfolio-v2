import { cleanup, render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CertificateCarouselSection } from '../components/section/certificate-carousel-section'
import type { CertificateRecord } from '#/features/certificates/queries'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: ComponentProps<'a'>) => (
    <a {...props}>{children}</a>
  ),
}))

const copy = {
  title: 'Certificates',
  viewAll: 'View all certificates',
  issued: 'Issued',
  openPdf: 'Open PDF',
  verify: 'Verify',
  expired: 'Expired',
  position: (current: number, total: number) =>
    `Certificate ${current} of ${total}`,
  coverAlt: (title: string, issuer: string) => `${title}, issued by ${issuer}`,
}

function mockMatchMedia(isDesktop: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockImplementation((media: string) => ({
      matches: isDesktop && media === '(min-width: 64rem)',
      media,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

function makeCertificate(id: string): CertificateRecord {
  return {
    id,
    title: `Certificate ${id}`,
    issuer: 'Issuer',
    credentialId: null,
    descriptionEn: null,
    descriptionId: null,
    coverImageUrl: null,
    pdfUrl: null,
    verificationUrl: null,
    status: 'published',
    issuedAt: new Date('2025-01-01T00:00:00.000Z'),
    expiresAt: null,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  }
}

describe('CertificateCarouselSection', () => {
  afterEach(cleanup)

  beforeEach(() => {
    const Observer = class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    }
    vi.stubGlobal('IntersectionObserver', Observer)
    vi.stubGlobal('ResizeObserver', Observer)
    mockMatchMedia(false)
  })

  it('renders no section when there are no published certificates', () => {
    const { container } = render(
      <CertificateCarouselSection certificates={[]} copy={copy} locale="en" />,
    )

    expect(container.innerHTML).toBe('')
  })

  it('renders a single certificate without carousel controls', () => {
    render(
      <CertificateCarouselSection
        certificates={[makeCertificate('one')]}
        copy={copy}
        locale="en"
      />,
    )

    const article = screen.getByRole('article')
    expect(article).toBeTruthy()
    expect(article.parentElement?.className).toContain('w-[min(88vw,35rem)]')
    expect(screen.queryByRole('region', { name: 'Certificates' })).toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('does not include desktop loop copies in the mobile carousel', () => {
    render(
      <CertificateCarouselSection
        certificates={[makeCertificate('one'), makeCertificate('two')]}
        copy={copy}
        locale="en"
      />,
    )

    const carousel = screen.getByRole('region', { name: 'Certificates' })
    expect(
      carousel.querySelectorAll('[data-slot="carousel-item"]'),
    ).toHaveLength(2)
  })

  it('adds desktop wraparound slides without exposing duplicates to accessibility navigation', () => {
    mockMatchMedia(true)
    const { container } = render(
      <CertificateCarouselSection
        certificates={[makeCertificate('one'), makeCertificate('two')]}
        copy={copy}
        locale="en"
      />,
    )

    const carousel = screen.getByRole('region', { name: 'Certificates' })
    expect(carousel.getAttribute('tabindex')).toBe('0')
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(
      carousel.querySelectorAll('[data-slot="carousel-item"]'),
    ).toHaveLength(6)
    expect(
      container.querySelectorAll('[aria-hidden="true"][inert]'),
    ).toHaveLength(4)

    expect(screen.getByText('Certificate 1 of 2')).toBeTruthy()
    expect(
      screen.queryByRole('button', { name: /previous|next|play|pause/i }),
    ).toBeNull()
  })
})
