import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import { requireOwnerUser } from '#/features/auth/session'
import { resetUserPassword } from '#/features/users/queries'
import { resetPasswordSchema } from '#/features/users/validation'
import { handleApiError } from '#/lib/api-response'

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
          return handleApiError(error, 'Failed to reset user password.')
        }
      },
    },
  },
})

