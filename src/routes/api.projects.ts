import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { ZodError } from 'zod'

import { getDb } from '#/db'
import { createProject, listProjects } from '#/features/projects/queries'
import { projectInputSchema } from '#/features/projects/validation'

export const Route = createFileRoute('/api/projects')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const db = getDb(env.DB)
          const projects = await listProjects(db)

          return json({ data: projects })
        } catch (error) {
          return handleApiError(error)
        }
      },
      POST: async ({ request }) => {
        try {
          const payload = await request.json()
          const input = projectInputSchema.parse(payload)
          const db = getDb(env.DB)
          const project = await createProject(db, input)

          return json({ data: project }, { status: 201 })
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
