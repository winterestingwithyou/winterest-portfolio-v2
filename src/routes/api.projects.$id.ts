import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { ZodError } from 'zod'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import {
  deleteProject,
  getDashboardProjectByIdOrSlug,
  updateProject,
} from '#/features/projects/queries'
import { projectInputSchema } from '#/features/projects/validation'

export const Route = createFileRoute('/api/projects/$id')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const user = await requireDashboardUser(request)

          if (user instanceof Response) {
            return user
          }

          const db = getDb(env.DB)
          const project = await getDashboardProjectByIdOrSlug(db, params.id)

          if (!project) {
            return json({ error: 'Project not found.' }, { status: 404 })
          }

          return json({ data: project })
        } catch (error) {
          return handleApiError(error)
        }
      },
      PATCH: async ({ request, params }) => {
        try {
          const user = await requireDashboardUser(request)

          if (user instanceof Response) {
            return user
          }

          const payload = await request.json()
          const input = projectInputSchema.parse(payload)
          const db = getDb(env.DB)
          const project = await updateProject(db, params.id, input)

          if (!project) {
            return json({ error: 'Project not found.' }, { status: 404 })
          }

          return json({ data: project })
        } catch (error) {
          return handleApiError(error)
        }
      },
      DELETE: async ({ request, params }) => {
        try {
          const user = await requireDashboardUser(request)

          if (user instanceof Response) {
            return user
          }

          const db = getDb(env.DB)
          const deleted = await deleteProject(db, params.id)

          if (!deleted) {
            return json({ error: 'Project not found.' }, { status: 404 })
          }

          return json({ data: { deleted: true } })
        } catch (error) {
          return handleApiError(error)
        }
      },
    },
  },
})

function json(body: unknown, init?: ResponseInit) {
  return Response.json(body, init)
}

function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return json(
      {
        error: 'Invalid project payload.',
        issues: error.issues,
      },
      { status: 422 },
    )
  }

  if (error instanceof Error && error.message.includes('no such table')) {
    return json(
      {
        error:
          'Project tables are not available yet. Apply the D1 migration first.',
      },
      { status: 503 },
    )
  }

  console.error(error)
  return json({ error: 'Project request failed.' }, { status: 500 })
}
