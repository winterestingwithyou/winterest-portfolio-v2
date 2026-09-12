import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { ZodError } from 'zod'

import { getDb } from '#/db'
import {
  getDashboardUserFromRequest,
  requireDashboardUser,
} from '#/features/auth/session'
import {
  createHomeEnthusiasm,
  getHomeEnthusiasms,
} from '#/features/home/queries'
import { enthusiasmItemSchema } from '#/features/home/validation'

export const Route = createFileRoute('/api/home/enthusiasms/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url)
          const all = url.searchParams.get('all') === 'true'
          const user = await getDashboardUserFromRequest(request)

          // Only authenticated editors can see disabled items
          const onlyEnabled = !(all && user)

          const db = getDb(env.DB)
          const items = await getHomeEnthusiasms(db, { onlyEnabled })
          return Response.json({ data: items })
        } catch (error) {
          console.error('Failed to fetch home enthusiasms:', error)
          return Response.json(
            { error: 'Failed to fetch focus areas.' },
            { status: 500 },
          )
        }
      },

      POST: async ({ request }) => {
        try {
          const authUser = await requireDashboardUser(request)
          if (authUser instanceof Response) return authUser

          const payload = await request.json()
          const input = enthusiasmItemSchema.parse(payload)
          const db = getDb(env.DB)

          const created = await createHomeEnthusiasm(db, input)
          return Response.json({ data: created }, { status: 201 })
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

          console.error('Failed to create enthusiasm:', error)
          return Response.json(
            { error: 'Failed to create focus area.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
