import { z } from 'zod'

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
] as const

export const ALLOWED_DOC_TYPES = ['application/pdf'] as const

export const ALLOWED_MIME_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_DOC_TYPES,
] as const

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number]

export function getAssetType(mimeType: string): 'image' | 'document' | 'other' {
  if (
    ALLOWED_IMAGE_TYPES.includes(
      mimeType as (typeof ALLOWED_IMAGE_TYPES)[number],
    )
  ) {
    return 'image'
  }
  if (
    ALLOWED_DOC_TYPES.includes(mimeType as (typeof ALLOWED_DOC_TYPES)[number])
  ) {
    return 'document'
  }
  return 'other'
}

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

export const mediaUploadSchema = z.object({
  alt: z.string().trim().max(200).optional(),
})

export const mediaQuerySchema = z.object({
  search: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
})

export type MediaUploadInput = z.infer<typeof mediaUploadSchema>
export type MediaQueryInput = z.infer<typeof mediaQuerySchema>
