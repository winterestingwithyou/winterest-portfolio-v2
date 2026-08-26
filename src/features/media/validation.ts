import { z } from 'zod'

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
] as const

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
