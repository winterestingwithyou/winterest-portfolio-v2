import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getDefaultCertificatesPageConfig } from '#/features/portfolio/page-content-schemas'
import type { CertificateRecord } from '../queries'
import { CertificatesListPage } from '../pages/certificates-list-page'

const { navigate, searchState } = vi.hoisted(() => ({
  navigate: vi.fn(),
  searchState: {
    q: undefined as string | undefined,
    page: undefined as number | undefined,
  },
}))

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
  useSearch: () => searchState,
}))

vi.mock('#/paraglide/runtime', () => ({ getLocale: () => 'en' }))

function makeCertificate(
  index: number,
  overrides: Partial<CertificateRecord> = {},
): CertificateRecord {
  return {
    id: `certificate-${index}`,
    title: `Certificate ${index}`,
    issuer: `Issuer ${index}`,
    credentialId: null,
    descriptionEn: null,
    descriptionId: null,
    coverImageUrl: null,
    pdfUrl: null,
    verificationUrl: 'https://issuer.example.test/verify',
    status: 'published',
    issuedAt: new Date('2025-01-01T00:00:00.000Z'),
    expiresAt: null,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
    ...overrides,
  }
}

describe('CertificatesListPage', () => {
  beforeEach(() => {
    searchState.q = undefined
    searchState.page = undefined
    navigate.mockClear()
    Object.defineProperty(window, 'scrollTo', {
      configurable: true,
      value: vi.fn(),
    })
  })

  afterEach(cleanup)

  it('shows ten certificates per page and keeps the query when changing pages', () => {
    render(
      <CertificatesListPage
        certificates={Array.from({ length: 11 }, (_, index) =>
          makeCertificate(index + 1),
        )}
        pageContent={getDefaultCertificatesPageConfig()}
      />,
    )

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(10)
    fireEvent.click(screen.getByRole('button', { name: 'Go to page 2' }))

    const navigation = navigate.mock.calls[0][0]
    expect(navigation.replace).toBe(true)
    expect(navigation.search({ q: 'typescript', page: 1 })).toEqual({
      q: 'typescript',
      page: 2,
    })
  }, 10_000)

  it('searches certificate title, issuer, and descriptions', () => {
    searchState.q = 'edge runtime'
    render(
      <CertificatesListPage
        certificates={[
          makeCertificate(1, { title: 'Edge Runtime Basics' }),
          makeCertificate(2, { issuer: 'Edge Runtime Academy' }),
          makeCertificate(3, { descriptionEn: 'An Edge Runtime credential' }),
          makeCertificate(4),
        ]}
        pageContent={getDefaultCertificatesPageConfig()}
      />,
    )

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3)
    expect(screen.queryByText('Certificate 4')).toBeNull()
  })
})
