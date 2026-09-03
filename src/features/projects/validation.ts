import { z } from 'zod'

import { contentStatuses, contentVisibilities } from '#/db/schema'

const emptyToUndefined = (value: unknown) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined
  }

  return value
}

const projectTranslationSchema = z.object({
  title: z.string().trim().min(2).max(160),
  summary: z.string().trim().min(8).max(280),
  description: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(3000).optional(),
  ),
  category: z.string().trim().min(2).max(80).default('Project'),
})

export const projectInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(96)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a URL-safe slug.'),
  status: z.enum(contentStatuses).default('draft'),
  visibility: z.enum(contentVisibilities).default('public'),
  repoVisibility: z.enum(contentVisibilities).default('public'),
  featured: z.boolean().default(false),
  coverImage: z.preprocess(emptyToUndefined, z.string().url().optional()),
  repoUrl: z.preprocess(emptyToUndefined, z.string().url().optional()),
  demoUrl: z.preprocess(emptyToUndefined, z.string().url().optional()),
  productionUrl: z.preprocess(emptyToUndefined, z.string().url().optional()),
  startedAt: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
  completedAt: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
  publishedAt: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
  technologyIds: z.array(z.string()).default([]),
  translations: z.object({
    en: projectTranslationSchema,
    id: projectTranslationSchema,
  }),
})

export type ProjectInput = z.infer<typeof projectInputSchema>

export function getProjectFormSchema(locale: 'en' | 'id' = 'id') {
  const isId = locale === 'id'

  return z.object({
    slug: z
      .string()
      .trim()
      .min(1, isId ? 'Slug wajib diisi.' : 'Slug is required.')
      .regex(
        /^[a-z0-9-]+$/,
        isId
          ? 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).'
          : 'Slug may only contain lowercase letters, numbers, and hyphens (-).',
      ),
    status: z.enum(['draft', 'published', 'archived'] as const),
    visibility: z.enum(['public', 'private'] as const),
    repoVisibility: z.enum(['public', 'private'] as const),
    featured: z.boolean(),
    coverImage: z.string(),
    repoUrl: z.string(),
    demoUrl: z.string(),
    productionUrl: z.string(),
    startedAt: z.string(),
    completedAt: z.string(),
    publishedAt: z.string(),
    technologyIds: z.array(z.string()),
    translations: z.object({
      en: z.object({
        title: z
          .string()
          .trim()
          .min(
            1,
            isId
              ? 'Judul (English) wajib diisi.'
              : 'Title (English) is required.',
          ),
        summary: z
          .string()
          .trim()
          .min(
            1,
            isId
              ? 'Ringkasan (English) wajib diisi.'
              : 'Summary (English) is required.',
          ),
        description: z
          .string()
          .trim()
          .min(
            1,
            isId
              ? 'Deskripsi (English) wajib diisi.'
              : 'Description (English) is required.',
          ),
        category: z
          .string()
          .trim()
          .min(
            1,
            isId
              ? 'Kategori (English) wajib diisi.'
              : 'Category (English) is required.',
          ),
      }),
      id: z.object({
        title: z
          .string()
          .trim()
          .min(
            1,
            isId
              ? 'Judul (Indonesia) wajib diisi.'
              : 'Title (Indonesia) is required.',
          ),
        summary: z
          .string()
          .trim()
          .min(
            1,
            isId
              ? 'Ringkasan (Indonesia) wajib diisi.'
              : 'Summary (Indonesia) is required.',
          ),
        description: z
          .string()
          .trim()
          .min(
            1,
            isId
              ? 'Deskripsi (Indonesia) wajib diisi.'
              : 'Description (Indonesia) is required.',
          ),
        category: z
          .string()
          .trim()
          .min(
            1,
            isId
              ? 'Kategori (Indonesia) wajib diisi.'
              : 'Category (Indonesia) is required.',
          ),
      }),
    }),
  })
}

export const projectFormSchema = getProjectFormSchema('id')
