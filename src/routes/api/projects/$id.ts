import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import {
  deleteProject,
  getDashboardProjectByIdOrSlug,
  updateProject,
} from '#/features/projects/queries'
import { projectInputSchema } from '#/features/projects/validation'
import { handleApiError } from '#/lib/api-response'

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
            return Response.json(
              { error: 'Project not found.' },
              { status: 404 },
            )
          }

          return Response.json({ data: project })
        } catch (error) {
          return handleApiError(error, 'Failed to fetch project.')
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
            return Response.json(
              { error: 'Project not found.' },
              { status: 404 },
            )
          }

          return Response.json({ data: project })
        } catch (error) {
          return handleApiError(error, 'Failed to update project.')
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
            return Response.json(
              { error: 'Project not found.' },
              { status: 404 },
            )
          }

          return Response.json({ data: { deleted: true } })
        } catch (error) {
          return handleApiError(error, 'Failed to delete project.')
        }
      },
    },
  },
})
