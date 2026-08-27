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
