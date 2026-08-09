import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import { technologies } from '#/db/schema'
import { requireDashboardUser } from '#/features/auth/session'

export const Route = createFileRoute('/api/technologies')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)

          if (user instanceof Response) {
            return user
          }

          const db = getDb(env.DB)
          const items = await db.select().from(technologies).all()

          return Response.json({ data: items })
        } catch (error) {
          console.error(error)
          return Response.json(
            { error: 'Failed to fetch technologies.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
