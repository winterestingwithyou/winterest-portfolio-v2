import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { ZodError } from 'zod'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import { reorderHomeEnthusiasms } from '#/features/home/queries'
import { reorderEnthusiasmsSchema } from '#/features/home/validation'

export const Route = createFileRoute('/api/home/enthusiasms/reorder')({
  server: {
    handlers: {
      PUT: async ({ request }) => {
        try {
          const authUser = await requireDashboardUser(request)
          if (authUser instanceof Response) return authUser

          const payload = await request.json()
          const input = reorderEnthusiasmsSchema.parse(payload)
          const db = getDb(env.DB)

          await reorderHomeEnthusiasms(db, input.items)
          return Response.json({ success: true })
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

          console.error('Failed to reorder enthusiasms:', error)
          return Response.json(
            { error: 'Failed to reorder focus areas.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
