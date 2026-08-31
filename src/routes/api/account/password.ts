import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import { changeAccountPassword } from '#/features/account/queries'
import { changePasswordSchema } from '#/features/account/validation'
import { requireDashboardUser } from '#/features/auth/session'
import { handleApiError } from '#/lib/api-response'

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
          return handleApiError(error, 'Failed to change password.')
        }
      },
    },
  },
})
