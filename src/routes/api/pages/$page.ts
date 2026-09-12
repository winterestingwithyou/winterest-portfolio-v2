import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { ZodError } from 'zod'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import {
  getPageContent,
  updatePageContent,
} from '#/features/portfolio/page-content-queries'
import {
  contactPageConfigSchema,
  projectsPageConfigSchema,
  publicPageKeys,
  stackPageConfigSchema,
} from '#/features/portfolio/page-content-schemas'
import type { PublicPageKey } from '#/features/portfolio/page-content-schemas'

function isPublicPageKey(val: string): val is PublicPageKey {
  return (publicPageKeys as readonly string[]).includes(val)
}

export const Route = createFileRoute('/api/pages/$page')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { page } = params
        if (!isPublicPageKey(page)) {
          return Response.json({ error: 'Page not found.' }, { status: 404 })
        }

        try {
          const db = getDb(env.DB)
          const content = await getPageContent(db, page)
          return Response.json({ data: content })
        } catch (error) {
          console.error(`Failed to fetch page config for ${page}:`, error)
          return Response.json(
            { error: 'Failed to fetch page content.' },
            { status: 500 },
          )
        }
      },

      PUT: async ({ request, params }) => {
        const { page } = params
        if (!isPublicPageKey(page)) {
          return Response.json({ error: 'Page not found.' }, { status: 404 })
        }

        try {
          const authUser = await requireDashboardUser(request)
          if (authUser instanceof Response) return authUser

          const payload = await request.json()
          let validated: Record<string, unknown>

          if (page === 'projects') {
            validated = projectsPageConfigSchema.parse(payload)
          } else if (page === 'stack') {
            validated = stackPageConfigSchema.parse(payload)
          } else {
            validated = contactPageConfigSchema.parse(payload)
          }

          const db = getDb(env.DB)
          await updatePageContent(db, page, validated)
          const updated = await getPageContent(db, page)

          return Response.json({ data: updated })
        } catch (error) {
          if (error instanceof ZodError) {
            const message = error.issues[0]?.message || 'Validation error.'
            return Response.json(
              {
                error: message,
                issues: error.issues,
              },
              { status: 422 },
            )
          }

          console.error(`Failed to update page config for ${page}:`, error)
          return Response.json(
            { error: 'Failed to save page content.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
