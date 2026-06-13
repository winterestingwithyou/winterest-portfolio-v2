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

const tagsSchema = z.preprocess(
  (value) => {
    if (Array.isArray(value)) {
      return value
    }

    if (typeof value === 'string') {
      return value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    }

    return []
  },
  z.array(z.string().trim().min(1).max(40)).max(12).default([]),
)

export const contentBaseInputSchema = z.object({
  locale: z.enum(contentLocales).default('en'),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(96)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a URL-safe slug.'),
  title: z.string().trim().min(2).max(180),
  summary: z.string().trim().min(8).max(320),
  content: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  status: z.enum(contentStatuses).default('draft'),
  visibility: z.enum(contentVisibilities).default('public'),
  coverImage: z.preprocess(emptyToUndefined, z.string().url().optional()),
  tags: tagsSchema,
})

export const writingInputSchema = contentBaseInputSchema

export const labEntryInputSchema = contentBaseInputSchema.extend({
  demoUrl: z.preprocess(emptyToUndefined, z.string().url().optional()),
  repoUrl: z.preprocess(emptyToUndefined, z.string().url().optional()),
})

export type WritingInput = z.infer<typeof writingInputSchema>
export type LabEntryInput = z.infer<typeof labEntryInputSchema>
