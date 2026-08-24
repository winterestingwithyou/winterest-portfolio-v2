import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { ZodError } from 'zod'

import { getDb } from '#/db'
import { requireOwnerUser } from '#/features/auth/session'
import { resetUserPassword } from '#/features/users/queries'
import { resetPasswordSchema } from '#/features/users/validation'

export const Route = createFileRoute('/api/users/reset-password')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authUser = await requireOwnerUser(request)
          if (authUser instanceof Response) return authUser

          const payload = await request.json()
          const input = resetPasswordSchema.parse(payload)
          const db = getDb(env.DB)

          await resetUserPassword(db, input.id, input.password)
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

          if (error instanceof Error && error.message.includes('not found')) {
            return Response.json({ error: error.message }, { status: 404 })
          }

          console.error(error)
          return Response.json(
            { error: 'Failed to reset user password.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
