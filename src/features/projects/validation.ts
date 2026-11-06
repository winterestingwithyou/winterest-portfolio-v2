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
  coverImageAlt: z.string().trim().max(500).optional().default(''),
})

const projectGalleryImageSchema = z.object({
  url: z.string().trim().url(),
  alt: z
    .object({
      en: z.string().trim().max(500).optional().default(''),
      id: z.string().trim().max(500).optional().default(''),
    })
    .optional()
    .default({ en: '', id: '' }),
})

export const projectInputSchema = z
  .object({
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
    galleryImages: z.array(projectGalleryImageSchema).default([]),
    translations: z.object({
      en: projectTranslationSchema,
      id: projectTranslationSchema,
    }),
  })
  .superRefine((project, ctx) => {
    const isPubliclyVisible =
      project.visibility === 'public' &&
      (project.status === 'published' || project.status === 'in_progress')

    if (isPubliclyVisible) {
      if (project.coverImage) {
        for (const locale of ['en', 'id'] as const) {
          if (!project.translations[locale].coverImageAlt) {
            ctx.addIssue({
              code: 'custom',
              path: ['translations', locale, 'coverImageAlt'],
              message: `Cover image alternative text is required in ${locale}.`,
            })
          }
        }
      }

      project.galleryImages.forEach((image, index) => {
        for (const locale of ['en', 'id'] as const) {
          if (!image.alt[locale]) {
            ctx.addIssue({
              code: 'custom',
              path: ['galleryImages', index, 'alt', locale],
              message: `Gallery image alternative text is required in ${locale}.`,
            })
          }
        }
      })
    }

    const imageUrls = [
      ...(project.coverImage ? [project.coverImage] : []),
      ...project.galleryImages.map((image) => image.url),
    ]
    if (new Set(imageUrls).size !== imageUrls.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['galleryImages'],
        message: 'Project images must not be repeated.',
      })
    }
  })

export type ProjectInput = z.infer<typeof projectInputSchema>

export function getProjectFormSchema(locale: 'en' | 'id' = 'id') {
  const isId = locale === 'id'

  return z
    .object({
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
      status: z.enum(contentStatuses),
      visibility: z.enum(contentVisibilities),
      repoVisibility: z.enum(contentVisibilities),
      featured: z.boolean(),
      coverImage: z.string(),
      galleryImages: z.array(
        z.object({
          url: z
            .string()
            .trim()
            .url(
              isId
                ? 'URL gambar galeri harus valid.'
                : 'Gallery image URL must be valid.',
            ),
          alt: z.object({ en: z.string(), id: z.string() }),
        }),
      ),
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
          coverImageAlt: z.string().trim(),
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
          coverImageAlt: z.string().trim(),
        }),
      }),
    })
    .superRefine((project, ctx) => {
      const isPubliclyVisible =
        project.visibility === 'public' &&
        (project.status === 'published' || project.status === 'in_progress')

      if (isPubliclyVisible) {
        if (project.coverImage.trim()) {
          for (const altLocale of ['en', 'id'] as const) {
            if (!project.translations[altLocale].coverImageAlt) {
              ctx.addIssue({
                code: 'custom',
                path: ['translations', altLocale, 'coverImageAlt'],
                message: isId
                  ? 'Teks alternatif cover wajib diisi dalam kedua bahasa.'
                  : 'Cover image alt text is required in both languages.',
              })
            }
          }
        }

        project.galleryImages.forEach((image, index) => {
          for (const altLocale of ['en', 'id'] as const) {
            if (!image.alt[altLocale].trim()) {
              ctx.addIssue({
                code: 'custom',
                path: ['galleryImages', index, 'alt', altLocale],
                message: isId
                  ? 'Teks alternatif gambar wajib diisi dalam kedua bahasa.'
                  : 'Gallery image alt text is required in both languages.',
              })
            }
          }
        })
      }

      const imageUrls = [
        ...(project.coverImage.trim() ? [project.coverImage.trim()] : []),
        ...project.galleryImages.map((image) => image.url.trim()),
      ]
      if (new Set(imageUrls).size !== imageUrls.length) {
        ctx.addIssue({
          code: 'custom',
          path: ['galleryImages'],
          message: isId
            ? 'Gambar proyek tidak boleh berulang.'
            : 'Project images must not be repeated.',
        })
      }
    })
}

export const projectFormSchema = getProjectFormSchema('id')
