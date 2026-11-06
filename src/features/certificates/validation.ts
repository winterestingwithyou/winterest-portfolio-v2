import { z } from 'zod'

import { certificateStatuses } from '#/db/schema'

import type { CertificateFormValidationCopy } from './copy'

const emptyToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value

type CertificateInvariantInput = {
  pdfUrl?: string | undefined
  verificationUrl?: string | undefined
  issuedAt: string | Date
  expiresAt?: string | Date | undefined
}

function addCertificateInvariantIssues(
  certificate: CertificateInvariantInput,
  ctx: z.RefinementCtx,
  messages: CertificateFormValidationCopy,
) {
  if (!certificate.pdfUrl && !certificate.verificationUrl) {
    ctx.addIssue({
      code: 'custom',
      path: ['pdfUrl'],
      message: messages.mediaRequired,
    })
  }

  if (certificate.expiresAt) {
    const issuedAt =
      typeof certificate.issuedAt === 'string'
        ? new Date(certificate.issuedAt)
        : certificate.issuedAt
    const expiresAt =
      typeof certificate.expiresAt === 'string'
        ? new Date(certificate.expiresAt)
        : certificate.expiresAt

    if (expiresAt.getTime() <= issuedAt.getTime()) {
      ctx.addIssue({
        code: 'custom',
        path: ['expiresAt'],
        message: messages.expiryDateError,
      })
    }
  }
}

export function getCertificateInputSchema(
  messages: CertificateFormValidationCopy,
) {
  const optionalUrl = z.preprocess(
    emptyToUndefined,
    z
      .string()
      .refine((value) => z.string().url().safeParse(value).success, {
        message: messages.invalidUrl,
      })
      .optional(),
  )
  const optionalDate = z.preprocess(
    emptyToUndefined,
    z.coerce.date({ error: messages.invalidDate }).optional(),
  )

  return z
    .object({
      title: z
        .string()
        .trim()
        .min(1, messages.required)
        .max(200, messages.titleTooLong),
      issuer: z
        .string()
        .trim()
        .min(1, messages.required)
        .max(160, messages.issuerTooLong),
      credentialId: z.preprocess(
        emptyToUndefined,
        z.string().trim().max(160, messages.credentialTooLong).optional(),
      ),
      descriptionEn: z.preprocess(
        emptyToUndefined,
        z.string().trim().max(2000, messages.descriptionTooLong).optional(),
      ),
      descriptionId: z.preprocess(
        emptyToUndefined,
        z.string().trim().max(2000, messages.descriptionTooLong).optional(),
      ),
      coverImageUrl: optionalUrl,
      pdfUrl: optionalUrl,
      verificationUrl: optionalUrl,
      status: z
        .enum(certificateStatuses, { error: messages.invalidStatus })
        .default('draft'),
      issuedAt: z.coerce.date({ error: messages.invalidDate }),
      expiresAt: optionalDate,
    })
    .superRefine((certificate, ctx) =>
      addCertificateInvariantIssues(certificate, ctx, messages),
    )
}

export function getCertificateFormSchema(
  messages: CertificateFormValidationCopy,
) {
  const optionalText = (max: number, error: string) =>
    z.string().trim().max(max, error)
  const optionalUrlString = z
    .string()
    .trim()
    .refine((value) => !value || z.string().url().safeParse(value).success, {
      message: messages.invalidUrl,
    })

  return z
    .object({
      title: z
        .string()
        .trim()
        .min(1, messages.required)
        .max(200, messages.titleTooLong),
      issuer: z
        .string()
        .trim()
        .min(1, messages.required)
        .max(160, messages.issuerTooLong),
      credentialId: optionalText(160, messages.credentialTooLong),
      descriptionEn: optionalText(2000, messages.descriptionTooLong),
      descriptionId: optionalText(2000, messages.descriptionTooLong),
      coverImageUrl: optionalUrlString,
      pdfUrl: optionalUrlString,
      verificationUrl: optionalUrlString,
      status: z.enum(certificateStatuses, { error: messages.invalidStatus }),
      issuedAt: z
        .string()
        .min(1, messages.required)
        .refine((value) => z.coerce.date().safeParse(value).success, {
          message: messages.invalidDate,
        }),
      expiresAt: z
        .string()
        .refine((value) => !value || z.coerce.date().safeParse(value).success, {
          message: messages.invalidDate,
        }),
    })
    .superRefine((certificate, ctx) =>
      addCertificateInvariantIssues(certificate, ctx, messages),
    )
}

export const certificateIdSchema = z.string().trim().min(1).max(128)

export type CertificateInput = z.infer<
  ReturnType<typeof getCertificateInputSchema>
>
