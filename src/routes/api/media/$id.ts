import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import {
  cascadeNullifyMediaReferences,
  deleteMediaRecord,
  extractR2Key,
  getMediaRecordById,
  getMediaUsage,
} from '#/features/media/queries'
import { mediaDeleteQuerySchema } from '#/features/media/validation'

export const Route = createFileRoute('/api/media/$id')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          const db = getDb(env.DB)
          const media = await getMediaRecordById(db, params.id)

          if (!media) {
            return Response.json({ error: 'Media not found.' }, { status: 404 })
          }

          const usage = await getMediaUsage(db, media)

          return Response.json({
            data: {
              ...media,
              usage,
            },
          })
        } catch (error) {
          console.error('[API /api/media/$id GET Error]', error)
          return Response.json(
            { error: 'Failed to fetch media details.' },
            { status: 500 },
          )
        }
      },
      DELETE: async ({ params, request }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          const url = new URL(request.url)
          const queryParse = mediaDeleteQuerySchema.safeParse({
            cascade: url.searchParams.get('cascade') ?? undefined,
          })
          const cascade = queryParse.success ? queryParse.data.cascade : false

          const db = getDb(env.DB)
          const media = await getMediaRecordById(db, params.id)

          if (!media) {
            return Response.json({ error: 'Media not found.' }, { status: 404 })
          }

          const usage = await getMediaUsage(db, media)

          if (usage.inUse && !cascade) {
            return Response.json(
              {
                error:
                  'Media is currently in use. Deleting it without cascade will create broken links.',
                code: 'MEDIA_IN_USE',
                usage,
              },
              { status: 409 },
            )
          }

          let clearedReferences = 0
          if (usage.inUse) {
            clearedReferences = await cascadeNullifyMediaReferences(db, media)
          }

          // If the media was stored in R2, delete the object safely
          const key = extractR2Key(media.url)
          if (key) {
            try {
              await env.MEDIA_BUCKET.delete(key)
            } catch (r2Error) {
              console.error('[API /api/media/$id DELETE R2 Error]', r2Error)
            }
          }

          await deleteMediaRecord(db, params.id)

          return Response.json({ success: true, clearedReferences })
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
