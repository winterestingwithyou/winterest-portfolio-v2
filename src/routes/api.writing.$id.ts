import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import { handleContentApiError, json } from '#/features/content/api'
import {
  deleteWriting,
  getDashboardWritingByIdOrSlug,
  updateWriting,
} from '#/features/content/queries'
import { writingInputSchema } from '#/features/content/validation'

export const Route = createFileRoute('/api/writing/$id')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const user = await requireDashboardUser(request)

          if (user instanceof Response) {
            return user
          }

          const record = await getDashboardWritingByIdOrSlug(
            getDb(env.DB),
            params.id,
          )

          if (!record) {
            return json({ error: 'Writing entry not found.' }, { status: 404 })
          }

          return json({ data: record })
        } catch (error) {
          return handleContentApiError(error, 'Writing')
        }
      },
      PATCH: async ({ request, params }) => {
        try {
          const user = await requireDashboardUser(request)

          if (user instanceof Response) {
            return user
          }

          const payload = await request.json()
          const input = writingInputSchema.parse(payload)
          const record = await updateWriting(getDb(env.DB), params.id, input)

          if (!record) {
            return json({ error: 'Writing entry not found.' }, { status: 404 })
          }

          return json({ data: record })
        } catch (error) {
          return handleContentApiError(error, 'Writing')
        }
      },
      DELETE: async ({ request, params }) => {
        try {
          const user = await requireDashboardUser(request)

          if (user instanceof Response) {
            return user
          }

          const deleted = await deleteWriting(getDb(env.DB), params.id)

          if (!deleted) {
            return json({ error: 'Writing entry not found.' }, { status: 404 })
          }

          return json({ data: { deleted: true } })
        } catch (error) {
          return handleContentApiError(error, 'Writing')
        }
      },
    },
  },
})
