import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import { createProject, listProjects } from '#/features/projects/queries'
import { projectInputSchema } from '#/features/projects/validation'
import { handleApiError } from '#/lib/api-response'

export const Route = createFileRoute('/api/projects/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)

          if (user instanceof Response) {
            return user
          }

          const db = getDb(env.DB)
          const projects = await listProjects(db)

          return Response.json({ data: projects })
        } catch (error) {
          return handleApiError(error, 'Failed to list projects.')
        }
      },
      POST: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)

          if (user instanceof Response) {
            return user
          }

          const payload = await request.json()
          const input = projectInputSchema.parse(payload)
          const db = getDb(env.DB)
          const project = await createProject(db, input)

          return Response.json({ data: project }, { status: 201 })
        } catch (error) {
          return handleApiError(error, 'Failed to create project.')
        }
      },
    },
  },
})

