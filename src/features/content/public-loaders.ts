import { createServerFn } from '@tanstack/react-start'

import { contentLocales } from '#/db/schema'
import type { ContentLocale } from '#/db/schema'

export const getPublishedWritingEntries = createServerFn({
  method: 'GET',
})
  .validator((input: { locale?: string } | undefined) => ({
    locale: normalizeLocale(input?.locale),
  }))
  .handler(async ({ data }) => {
    try {
      const db = await getContentDb()
      const { listPublishedWriting, toPublicWritingRecord } =
        await import('./queries')
      const entries = await listPublishedWriting(db, data.locale)
      return entries.map(({ record, translation }) =>
        toPublicWritingRecord(record, translation),
      )
    } catch (error) {
      if (isMissingTableError(error)) {
        return []
      }

      throw error
    }
  })

export const getPublishedWritingEntry = createServerFn({ method: 'GET' })
  .validator((input: { slug: string; locale?: string }) => ({
    slug: input.slug,
    locale: normalizeLocale(input.locale),
  }))
  .handler(async ({ data }) => {
    try {
      const db = await getContentDb()
      const { getPublishedWritingBySlug, toPublicWritingRecord } =
        await import('./queries')
      const entry = await getPublishedWritingBySlug(db, data.slug, data.locale)

      if (!entry) {
        return null
      }

      return toPublicWritingRecord(entry.record, entry.translation)
    } catch (error) {
      if (isMissingTableError(error)) {
        return null
      }

      throw error
    }
  })

export const getPublishedLabEntries = createServerFn({ method: 'GET' })
  .validator((input: { locale?: string } | undefined) => ({
    locale: normalizeLocale(input?.locale),
  }))
  .handler(async ({ data }) => {
    try {
      const db = await getContentDb()
      const { listPublishedLabEntries, toPublicLabRecord } =
        await import('./queries')
      const entries = await listPublishedLabEntries(db, data.locale)
      return entries.map(({ record, translation }) =>
        toPublicLabRecord(record, translation),
      )
    } catch (error) {
      if (isMissingTableError(error)) {
        return []
      }

      throw error
    }
  })

export const getPublishedLabEntry = createServerFn({ method: 'GET' })
  .validator((input: { slug: string; locale?: string }) => ({
    slug: input.slug,
    locale: normalizeLocale(input.locale),
  }))
  .handler(async ({ data }) => {
    try {
      const db = await getContentDb()
      const { getPublishedLabEntryBySlug, toPublicLabRecord } =
        await import('./queries')
      const entry = await getPublishedLabEntryBySlug(db, data.slug, data.locale)

      if (!entry) {
        return null
      }

      return toPublicLabRecord(entry.record, entry.translation)
    } catch (error) {
      if (isMissingTableError(error)) {
        return null
      }

      throw error
    }
  })

function isMissingTableError(error: unknown) {
  return error instanceof Error && error.message.includes('no such table')
}

function normalizeLocale(locale: string | undefined): ContentLocale {
  return contentLocales.includes(locale as ContentLocale)
    ? (locale as ContentLocale)
    : 'en'
}

async function getContentDb() {
  const [{ env }, { getDb }] = await Promise.all([
    import('cloudflare:workers'),
    import('#/db'),
  ])

  return getDb(env.DB)
}
