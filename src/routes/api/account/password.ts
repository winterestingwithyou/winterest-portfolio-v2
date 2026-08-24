import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { ZodError } from 'zod'

import { getDb } from '#/db'
import { changeAccountPassword } from '#/features/account/queries'
import { changePasswordSchema } from '#/features/account/validation'
import { requireDashboardUser } from '#/features/auth/session'

export const Route = createFileRoute('/api/account/password')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authUser = await requireDashboardUser(request)
          if (authUser instanceof Response) return authUser

          const payload = await request.json()
          const input = changePasswordSchema.parse(payload)
          const db = getDb(env.DB)

          await changeAccountPassword(db, authUser.id, input)
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

          if (error instanceof Error) {
            if (
              error.message.includes('Current password') ||
              error.message.includes('No credential') ||
              error.message.includes('not found')
            ) {
              return Response.json({ error: error.message }, { status: 400 })
            }
          }

          console.error(error)
          return Response.json(
            { error: 'Failed to change password.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
