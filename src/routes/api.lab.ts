import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import { handleContentApiError, json } from '#/features/content/api'
import {
  createLabEntry,
  listLabEntries,
  toPublicLabRecord,
} from '#/features/content/queries'
import { labEntryInputSchema } from '#/features/content/validation'

export const Route = createFileRoute('/api/lab')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)

          if (user instanceof Response) {
            return user
          }

          const records = await listLabEntries(getDb(env.DB))
          return json({ data: records.map(toPublicLabRecord) })
        } catch (error) {
          return handleContentApiError(error, 'Lab')
        }
      },
      POST: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)

          if (user instanceof Response) {
            return user
          }

          const payload = await request.json()
          const input = labEntryInputSchema.parse(payload)
          const record = await createLabEntry(getDb(env.DB), input)

          return json({ data: toPublicLabRecord(record) }, { status: 201 })
        } catch (error) {
          return handleContentApiError(error, 'Lab')
        }
      },
    },
  },
})
