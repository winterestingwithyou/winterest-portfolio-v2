import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import { handleContentApiError, json } from '#/features/content/api'
import {
  createWriting,
  listWriting,
  toPublicWritingRecord,
} from '#/features/content/queries'
import { writingInputSchema } from '#/features/content/validation'

export const Route = createFileRoute('/api/writing')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)

          if (user instanceof Response) {
            return user
          }

          const records = await listWriting(getDb(env.DB))
          return json({ data: records.map(toPublicWritingRecord) })
        } catch (error) {
          return handleContentApiError(error, 'Writing')
        }
      },
      POST: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)

          if (user instanceof Response) {
            return user
          }

          const payload = await request.json()
          const input = writingInputSchema.parse(payload)
          const record = await createWriting(getDb(env.DB), input)

          return json({ data: toPublicWritingRecord(record) }, { status: 201 })
        } catch (error) {
          return handleContentApiError(error, 'Writing')
        }
      },
    },
  },
})
