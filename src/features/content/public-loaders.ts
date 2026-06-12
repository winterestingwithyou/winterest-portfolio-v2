import { createServerFn } from '@tanstack/react-start'

export const getPublishedWritingEntries = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const db = await getContentDb()
    const { listPublishedWriting, toPublicWritingRecord } =
      await import('./queries')
    const records = await listPublishedWriting(db)
    return records.map(toPublicWritingRecord)
  } catch (error) {
    if (isMissingTableError(error)) {
      return []
    }

    throw error
  }
})

export const getPublishedWritingEntry = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data }) => {
    try {
      const db = await getContentDb()
      const { getWritingByIdOrSlug, toPublicWritingRecord } =
        await import('./queries')
      const record = await getWritingByIdOrSlug(db, data)

      if (
        !record ||
        record.status !== 'published' ||
        record.visibility !== 'public'
      ) {
        return null
      }

      return toPublicWritingRecord(record)
    } catch (error) {
      if (isMissingTableError(error)) {
        return null
      }

      throw error
    }
  })

export const getPublishedLabEntries = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const db = await getContentDb()
      const { listPublishedLabEntries, toPublicLabRecord } =
        await import('./queries')
      const records = await listPublishedLabEntries(db)
      return records.map(toPublicLabRecord)
    } catch (error) {
      if (isMissingTableError(error)) {
        return []
      }

      throw error
    }
  },
)

export const getPublishedLabEntry = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data }) => {
    try {
      const db = await getContentDb()
      const { getLabEntryByIdOrSlug, toPublicLabRecord } =
        await import('./queries')
      const record = await getLabEntryByIdOrSlug(db, data)

      if (
        !record ||
        record.status !== 'published' ||
        record.visibility !== 'public'
      ) {
        return null
      }

      return toPublicLabRecord(record)
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

async function getContentDb() {
  const [{ env }, { getDb }] = await Promise.all([
    import('cloudflare:workers'),
    import('#/db'),
  ])

  return getDb(env.DB)
}
