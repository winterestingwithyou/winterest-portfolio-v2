import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

import type { ContentStatus } from '#/db/schema'

type DashboardSummaryItem = {
  id: string
  slug: string
  title: string
  summary: string
  status: ContentStatus
  updatedAt: Date
}

export type DashboardSummary = {
  totalItems: number
  featuredCount: number
  draftCount: number
  publishedCount: number
  contentMix: Array<{
    key: 'projects'
    value: number
  }>
  recentProjects: DashboardSummaryItem[]
}

const emptySummary: DashboardSummary = {
  totalItems: 0,
  featuredCount: 0,
  draftCount: 0,
  publishedCount: 0,
  contentMix: [{ key: 'projects', value: 0 }],
  recentProjects: [],
}

export const getDashboardSummary = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getDashboardUserFromRequest } =
      await import('#/features/auth/session')
    const user = await getDashboardUserFromRequest(getRequest())

    if (!user) {
      return emptySummary
    }

    try {
      const db = await getDashboardDb()
      const { listProjects } = await import('#/features/projects/queries')
      const projects = await listProjects(db)
      const allStatuses = projects.map((project) => project.status)

      return {
        totalItems: projects.length,
        featuredCount: projects.filter((project) => project.featured).length,
        draftCount: allStatuses.filter((status) => status === 'draft').length,
        publishedCount: allStatuses.filter((status) => status === 'published')
          .length,
        contentMix: [{ key: 'projects' as const, value: projects.length }],
        recentProjects: projects.slice(0, 5).map((project) => ({
          id: project.id,
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          status: project.status,
          updatedAt: project.updatedAt,
        })),
      }
    } catch (error) {
      if (isMissingTableError(error)) {
        return emptySummary
      }

      throw error
    }
  },
)

function isMissingTableError(error: unknown) {
  return error instanceof Error && error.message.includes('no such table')
}

async function getDashboardDb() {
  const [{ env }, { getDb }] = await Promise.all([
    import('cloudflare:workers'),
    import('#/db'),
  ])

  return getDb(env.DB)
}
