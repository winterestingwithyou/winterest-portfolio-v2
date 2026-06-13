import { z } from 'zod'

import {
  contentLocales,
  contentStatuses,
  contentVisibilities,
} from '#/db/schema'

const emptyToUndefined = (value: unknown) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined
  }

  return value
}

export const projectInputSchema = z.object({
  locale: z.enum(contentLocales).default('en'),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(96)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a URL-safe slug.'),
  title: z.string().trim().min(2).max(160),
  summary: z.string().trim().min(8).max(280),
  description: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(1200).optional(),
  ),
  content: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  status: z.enum(contentStatuses).default('draft'),
  visibility: z.enum(contentVisibilities).default('public'),
  featured: z.boolean().default(false),
  category: z.string().trim().min(2).max(80).default('Project'),
  coverImage: z.preprocess(emptyToUndefined, z.string().url().optional()),
  repoUrl: z.preprocess(emptyToUndefined, z.string().url().optional()),
  demoUrl: z.preprocess(emptyToUndefined, z.string().url().optional()),
  caseStudyUrl: z.preprocess(emptyToUndefined, z.string().url().optional()),
})

export type ProjectInput = z.infer<typeof projectInputSchema>
