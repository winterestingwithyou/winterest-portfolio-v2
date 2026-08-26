import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import {
  deleteMediaRecord,
  getMediaRecordById,
} from '#/features/media/queries'

export const Route = createFileRoute('/api/media/$id')({
  server: {
    handlers: {
      DELETE: async ({ params, request }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          const db = getDb(env.DB)
          const media = await getMediaRecordById(db, params.id)

          if (!media) {
            return Response.json(
              { error: 'Media not found.' },
              { status: 404 },
            )
          }

          // If the media was stored in R2, delete the object
          if (media.url.startsWith('/api/media/file/')) {
            const key = media.url.replace('/api/media/file/', '')
            if (key) {
              await env.MEDIA_BUCKET.delete(key)
            }
          }

          await deleteMediaRecord(db, params.id)

          return Response.json({ success: true })
        } catch (error) {
          console.error('[API /api/media/$id DELETE Error]', error)
          return Response.json(
            { error: 'Failed to delete media.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
