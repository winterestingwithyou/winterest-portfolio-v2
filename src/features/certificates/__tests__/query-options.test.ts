import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { CertificateRecord } from '#/features/certificates/queries'
import { api } from '#/lib/api-client'
import { certificateQueryOptions } from '../query-options'

vi.mock('#/lib/api-client', () => ({
  api: vi.fn(),
}))

const serializedCertificate = {
  id: 'certificate-1',
  title: 'Certificate',
  issuer: 'Issuer',
  credentialId: null,
  descriptionEn: null,
  descriptionId: null,
  coverImageUrl: null,
  pdfUrl: null,
  verificationUrl: 'https://issuer.example.test/verify/1',
  status: 'published',
  issuedAt: '2025-01-15T00:00:00.000Z',
  expiresAt: null,
  createdAt: '2025-01-15T00:00:00.000Z',
  updatedAt: '2025-01-15T00:00:00.000Z',
}

const runQuery = async <T>(queryFn: unknown): Promise<T> => {
  if (typeof queryFn !== 'function') {
    throw new Error('queryFn is not a function')
  }
  return (queryFn as (ctx: unknown) => Promise<T>)({})
}

describe('certificateQueryOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('restores serialized dates before the dashboard formats issue dates', async () => {
    vi.mocked(api).mockResolvedValueOnce({
      data: [serializedCertificate],
    })

    const records = await runQuery<CertificateRecord[]>(
      certificateQueryOptions.list().queryFn,
    )

    expect(records[0].issuedAt).toBeInstanceOf(Date)
    expect(() =>
      new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        timeZone: 'UTC',
      }).format(records[0].issuedAt),
    ).not.toThrow()
  })

  it('restores serialized dates for the certificate editor', async () => {
    vi.mocked(api).mockResolvedValueOnce({ data: serializedCertificate })

    const record = await runQuery<CertificateRecord>(
      certificateQueryOptions.detail('certificate-1').queryFn,
    )

    expect(record.issuedAt).toBeInstanceOf(Date)
    expect(record.issuedAt.toISOString()).toBe('2025-01-15T00:00:00.000Z')
    expect(record.createdAt).toBeInstanceOf(Date)
    expect(record.expiresAt).toBeNull()
  })
})
