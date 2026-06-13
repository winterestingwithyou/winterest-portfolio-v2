import { createServerFn } from '@tanstack/react-start'

import { contentLocales } from '#/db/schema'
import type { ContentLocale } from '#/db/schema'

export const getPublishedProjects = createServerFn({
  method: 'GET',
})
  .validator((input: { locale?: string } | undefined) => ({
    locale: normalizeLocale(input?.locale),
  }))
  .handler(async ({ data }) => {
    try {
      const db = await getProjectDb()
      const { listPublishedPublicProjects } = await import('./queries')

      return listPublishedPublicProjects(db, data.locale)
    } catch (error) {
      if (isMissingTableError(error)) {
        return []
      }

      throw error
    }
  })

export const getPublishedProject = createServerFn({ method: 'GET' })
  .validator((input: { slug: string; locale?: string }) => ({
    slug: input.slug,
    locale: normalizeLocale(input.locale),
  }))
  .handler(async ({ data }) => {
    try {
      const db = await getProjectDb()
      const { getPublishedPublicProjectBySlug } = await import('./queries')

      return getPublishedPublicProjectBySlug(db, data.slug, data.locale)
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

async function getProjectDb() {
  const [{ env }, { getDb }] = await Promise.all([
    import('cloudflare:workers'),
    import('#/db'),
  ])

  return getDb(env.DB)
}
