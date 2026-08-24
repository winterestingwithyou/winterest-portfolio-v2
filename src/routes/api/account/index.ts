import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { ZodError } from 'zod'

import { getDb } from '#/db'
import { getAccountProfile, updateAccountProfile } from '#/features/account/queries'
import { updateProfileSchema } from '#/features/account/validation'
import { requireDashboardUser } from '#/features/auth/session'

export const Route = createFileRoute('/api/account/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const authUser = await requireDashboardUser(request)
          if (authUser instanceof Response) return authUser

          const db = getDb(env.DB)
          const profile = await getAccountProfile(db, authUser.id)

          return Response.json({ data: profile })
        } catch (error) {
          return handleApiError(error, 'Failed to fetch account profile.')
        }
      },

      PUT: async ({ request }) => {
        try {
          const authUser = await requireDashboardUser(request)
          if (authUser instanceof Response) return authUser

          const payload = await request.json()
          const input = updateProfileSchema.parse(payload)
          const db = getDb(env.DB)

          const updated = await updateAccountProfile(db, authUser.id, input)
          return Response.json({ data: updated })
        } catch (error) {
          return handleApiError(error, 'Failed to update account profile.')
        }
      },
    },
  },
})

function handleApiError(error: unknown, fallbackMessage: string) {
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
      error.message.includes('already registered') ||
      error.message.includes('not found')
    ) {
      return Response.json({ error: error.message }, { status: 400 })
    }
  }

  console.error(error)
  return Response.json({ error: fallbackMessage }, { status: 500 })
}
