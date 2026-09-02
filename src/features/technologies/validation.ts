import { z } from 'zod'

export function getCategoryFormSchema(locale: 'en' | 'id' = 'id') {
  const isId = locale === 'id'
  return z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        isId ? 'Nama kategori wajib diisi.' : 'Category name is required.',
      ),
    slug: z
      .string()
      .trim()
      .min(1, isId ? 'Slug URL wajib diisi.' : 'Slug URL is required.')
      .regex(
        /^[a-z0-9-]+$/,
        isId
          ? 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).'
          : 'Slug may only contain lowercase letters, numbers, and hyphens (-).',
      ),
    sortOrder: z.number(),
  })
}

export const categorySchema = getCategoryFormSchema('id')

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1, 'Category name is required.'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required.')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug may only contain lowercase letters, numbers, and hyphens (-).',
    ),
  sortOrder: z.coerce.number().default(0),
})

export function getTechnologyFormSchema(locale: 'en' | 'id' = 'id') {
  const isId = locale === 'id'
  return z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        isId ? 'Nama teknologi wajib diisi.' : 'Technology name is required.',
      ),
    slug: z
      .string()
      .trim()
      .min(1, isId ? 'Slug URL wajib diisi.' : 'Slug URL is required.')
      .regex(
        /^[a-z0-9-]+$/,
        isId
          ? 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).'
          : 'Slug may only contain lowercase letters, numbers, and hyphens (-).',
      ),
    icon: z.string(),
    color: z.string(),
    url: z
      .string()
      .refine((val) => !val || z.string().url().safeParse(val).success, {
        message: isId ? 'Format URL tidak valid.' : 'Invalid URL format.',
      }),
    isUltimate: z.boolean(),
    categoryIds: z.array(z.string()),
  })
}

export const technologySchema = getTechnologyFormSchema('id')

export const technologyInputSchema = z.object({
  name: z.string().trim().min(1, 'Technology name is required.'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required.')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug may only contain lowercase letters, numbers, and hyphens (-).',
    ),
  icon: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((val) => (val ? val : null)),
  color: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((val) => (val ? val : null)),
  url: z
    .string()
    .trim()
    .nullable()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: 'Invalid URL format.',
    })
    .transform((val) => (val ? val : null)),
  isUltimate: z.boolean().default(false),
  categoryIds: z.array(z.string()).default([]),
})

export type CategoryInput = z.infer<typeof categoryInputSchema>
export type TechnologyInput = z.infer<typeof technologyInputSchema>
