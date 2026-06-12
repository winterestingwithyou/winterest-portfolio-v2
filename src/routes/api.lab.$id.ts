import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import { handleContentApiError, json } from '#/features/content/api'
import {
  deleteLabEntry,
  getLabEntryByIdOrSlug,
  toPublicLabRecord,
  updateLabEntry,
} from '#/features/content/queries'
import { labEntryInputSchema } from '#/features/content/validation'

export const Route = createFileRoute('/api/lab/$id')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const user = await requireDashboardUser(request)

          if (user instanceof Response) {
            return user
          }

          const record = await getLabEntryByIdOrSlug(getDb(env.DB), params.id)

          if (!record) {
            return json({ error: 'Lab entry not found.' }, { status: 404 })
          }

          return json({ data: toPublicLabRecord(record) })
        } catch (error) {
          return handleContentApiError(error, 'Lab')
        }
      },
      PATCH: async ({ request, params }) => {
        try {
          const user = await requireDashboardUser(request)

          if (user instanceof Response) {
            return user
          }

          const payload = await request.json()
          const input = labEntryInputSchema.parse(payload)
          const record = await updateLabEntry(getDb(env.DB), params.id, input)

          if (!record) {
            return json({ error: 'Lab entry not found.' }, { status: 404 })
          }

          return json({ data: toPublicLabRecord(record) })
        } catch (error) {
          return handleContentApiError(error, 'Lab')
        }
      },
      DELETE: async ({ request, params }) => {
        try {
          const user = await requireDashboardUser(request)

          if (user instanceof Response) {
            return user
          }

          const deleted = await deleteLabEntry(getDb(env.DB), params.id)

          if (!deleted) {
            return json({ error: 'Lab entry not found.' }, { status: 404 })
          }

          return json({ data: { deleted: true } })
        } catch (error) {
          return handleContentApiError(error, 'Lab')
        }
      },
    },
  },
})
