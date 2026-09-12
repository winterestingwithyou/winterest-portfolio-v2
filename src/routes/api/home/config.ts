import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { ZodError } from 'zod'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import { getHomeConfig, updateHomeConfig } from '#/features/home/queries'
import { homeConfigSchema } from '#/features/home/validation'

export const Route = createFileRoute('/api/home/config')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const db = getDb(env.DB)
          const config = await getHomeConfig(db)
          return Response.json({ data: config })
        } catch (error) {
          console.error('Failed to fetch home config:', error)
          return Response.json(
            { error: 'Failed to fetch home configuration.' },
            { status: 500 },
          )
        }
      },

      PUT: async ({ request }) => {
        try {
          const authUser = await requireDashboardUser(request)
          if (authUser instanceof Response) return authUser

          const payload = await request.json()
          const input = homeConfigSchema.parse(payload)
          const db = getDb(env.DB)

          const updated = await updateHomeConfig(db, input)
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

          console.error('Failed to update home config:', error)
          return Response.json(
            { error: 'Failed to save home configuration.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
