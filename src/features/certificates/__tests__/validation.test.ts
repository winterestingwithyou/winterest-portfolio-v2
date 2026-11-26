import { describe, expect, it } from 'vitest'

import { certificatesCopy } from '../copy'
import {
  certificateIdSchema,
  getCertificateFormSchema,
  getCertificateInputSchema,
} from '../validation'

const certificateInputSchema = getCertificateInputSchema(
  certificatesCopy.en.dashboard.form.validation,
)

const validCertificate = {
  title: 'Cloudflare Developer Certification',
  issuer: 'Cloudflare',
  status: 'draft' as const,
  issuedAt: new Date('2025-01-15T00:00:00.000Z'),
  pdfUrl: 'https://media.example.test/certificate.pdf',
}

describe('certificate input schema', () => {
  it('validates certificate route IDs', () => {
    expect(certificateIdSchema.safeParse('certificate-1').success).toBe(true)
    expect(certificateIdSchema.safeParse('').success).toBe(false)
    expect(certificateIdSchema.safeParse('x'.repeat(129)).success).toBe(false)
  })

  it('localizes form validation errors', () => {
    const invalid = {
      ...validCertificate,
      title: '',
      pdfUrl: undefined,
    }

    const english = getCertificateFormSchema(
      certificatesCopy.en.dashboard.form.validation,
    ).safeParse(invalid)
    const indonesian = getCertificateFormSchema(
      certificatesCopy.id.dashboard.form.validation,
    ).safeParse(invalid)

    expect(english.success).toBe(false)
    expect(indonesian.success).toBe(false)
    if (!english.success && !indonesian.success) {
      expect(english.error.issues[0]?.message).toBe('This field is required.')
      expect(indonesian.error.issues[0]?.message).toBe('Kolom ini wajib diisi.')
    }
  })
  it('defaults omitted publication status to draft', () => {
    const result = certificateInputSchema.parse({
      ...validCertificate,
      status: undefined,
    })

    expect(result.status).toBe('draft')
  })

  it('requires either a certificate PDF or a verification URL', () => {
    expect(
      certificateInputSchema.safeParse({
        ...validCertificate,
        pdfUrl: undefined,
      }).success,
    ).toBe(false)
  })

  it('accepts verification-only certificates', () => {
    const result = certificateInputSchema.safeParse({
      ...validCertificate,
      pdfUrl: undefined,
      verificationUrl: 'https://issuer.example.test/verify/123',
    })

    expect(result.success).toBe(true)
  })

  it('requires the original title, issuer, and issue date', () => {
    expect(
      certificateInputSchema.safeParse({ ...validCertificate, title: '' })
        .success,
    ).toBe(false)
    expect(
      certificateInputSchema.safeParse({ ...validCertificate, issuer: '' })
        .success,
    ).toBe(false)
    expect(
      certificateInputSchema.safeParse({ ...validCertificate, issuedAt: '' })
        .success,
    ).toBe(false)
  })

  it('allows optional bilingual description, expiry, and cover image', () => {
    const result = certificateInputSchema.safeParse({
      ...validCertificate,
      descriptionEn: 'Completed the professional certification.',
      descriptionId: 'Menyelesaikan sertifikasi profesional.',
      expiresAt: new Date('2028-01-15T00:00:00.000Z'),
      coverImageUrl: 'https://media.example.test/certificate-cover.jpg',
    })

    expect(result.success).toBe(true)
  })

  it('does not permit in-progress or archived certificate states', () => {
    expect(
      certificateInputSchema.safeParse({
        ...validCertificate,
        status: 'in_progress',
      }).success,
    ).toBe(false)
  })

  it('requires an expiry date to be after the issue date', () => {
    expect(
      certificateInputSchema.safeParse({
        ...validCertificate,
        expiresAt: new Date('2025-01-01T00:00:00.000Z'),
      }).success,
    ).toBe(false)
  })
})
