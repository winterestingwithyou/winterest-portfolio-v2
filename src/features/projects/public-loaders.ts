import { createServerFn } from '@tanstack/react-start'

export const getPublishedProjects = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const db = await getProjectDb()
    const { listPublishedPublicProjects } = await import('./queries')

    return listPublishedPublicProjects(db)
  } catch (error) {
    if (isMissingTableError(error)) {
      return []
    }

    throw error
  }
})

export const getPublishedProject = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data }) => {
    try {
      const db = await getProjectDb()
      const { getPublishedPublicProjectBySlug } = await import('./queries')

      return getPublishedPublicProjectBySlug(db, data)
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

async function getProjectDb() {
  const [{ env }, { getDb }] = await Promise.all([
    import('cloudflare:workers'),
    import('#/db'),
  ])

  return getDb(env.DB)
}
