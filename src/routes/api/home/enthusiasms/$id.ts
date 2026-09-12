import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { ZodError } from 'zod'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import {
  deleteHomeEnthusiasm,
  updateHomeEnthusiasm,
} from '#/features/home/queries'
import { enthusiasmItemSchema } from '#/features/home/validation'

export const Route = createFileRoute('/api/home/enthusiasms/$id')({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        try {
          const authUser = await requireDashboardUser(request)
          if (authUser instanceof Response) return authUser

          const { id } = params
          const payload = await request.json()
          const input = enthusiasmItemSchema.partial().parse(payload)
          const db = getDb(env.DB)

          const updated = await updateHomeEnthusiasm(db, id, input)
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

          console.error(`Failed to update enthusiasm ${params.id}:`, error)
          return Response.json(
            { error: 'Failed to update focus area.' },
            { status: 500 },
          )
        }
      },

      DELETE: async ({ request, params }) => {
        try {
          const authUser = await requireDashboardUser(request)
          if (authUser instanceof Response) return authUser

          const { id } = params
          const db = getDb(env.DB)

          await deleteHomeEnthusiasm(db, id)
          return Response.json({ success: true })
        } catch (error) {
          console.error(`Failed to delete enthusiasm ${params.id}:`, error)
          return Response.json(
            { error: 'Failed to delete focus area.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
