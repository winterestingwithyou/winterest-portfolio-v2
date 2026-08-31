import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'Nama kategori wajib diisi.'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug URL wajib diisi.')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).',
    ),
  sortOrder: z.number(),
})

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1, 'Nama kategori wajib diisi.'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug URL wajib diisi.')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).',
    ),
  sortOrder: z.coerce.number().default(0),
})

export const technologySchema = z.object({
  name: z.string().trim().min(1, 'Nama teknologi wajib diisi.'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug URL wajib diisi.')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).',
    ),
  icon: z.string(),
  color: z.string(),
  url: z
    .string()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: 'Format URL tidak valid.',
    }),
  isUltimate: z.boolean(),
  categoryIds: z.array(z.string()),
})

export const technologyInputSchema = z.object({
  name: z.string().trim().min(1, 'Nama teknologi wajib diisi.'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug URL wajib diisi.')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).',
    ),
  icon: z.string().trim().default(''),
  color: z.string().trim().default(''),
  url: z
    .string()
    .trim()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: 'Format URL tidak valid.',
    })
    .default(''),
  isUltimate: z.boolean().default(false),
  categoryIds: z.array(z.string()).default([]),
})

export type CategoryInput = z.infer<typeof categoryInputSchema>
export type TechnologyInput = z.infer<typeof technologyInputSchema>
