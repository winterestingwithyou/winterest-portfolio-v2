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
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((media: string) => ({
        matches: false,
        media,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
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

    expect(screen.getByRole('article')).toBeTruthy()
    expect(screen.queryByRole('region', { name: 'Certificates' })).toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('uses a looping keyboard-focusable carousel without arrow buttons or autoplay controls', () => {
    render(
      <CertificateCarouselSection
        certificates={[
          makeCertificate('one'),
          makeCertificate('two'),
          makeCertificate('three'),
        ]}
        copy={copy}
        locale="en"
      />,
    )

    const carousel = screen.getByRole('region', { name: 'Certificates' })
    expect(carousel.getAttribute('tabindex')).toBe('0')
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.getByText('Certificate 1 of 3')).toBeTruthy()
    expect(
      screen.queryByRole('button', { name: /previous|next|play|pause/i }),
    ).toBeNull()
  })
})
