import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import { createMediaRecord, listMediaRecords } from '#/features/media/queries'
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  mediaQuerySchema,
} from '#/features/media/validation'

export const Route = createFileRoute('/api/media/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          const url = new URL(request.url)
          const query = mediaQuerySchema.parse({
            search: url.searchParams.get('search') ?? undefined,
            limit: url.searchParams.get('limit') ?? undefined,
          })

          const db = getDb(env.DB)
          const records = await listMediaRecords(db, query)

          return Response.json({ data: records })
        } catch (error) {
          console.error('[API /api/media GET Error]', error)
          return Response.json(
            { error: 'Failed to fetch media library.' },
            { status: 500 },
          )
        }
      },
      POST: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          const formData = await request.formData()
          const file = formData.get('file')
          const alt = formData.get('alt')

          if (!file || !(file instanceof File)) {
            return Response.json(
              { error: 'No valid file provided.' },
              { status: 400 },
            )
          }

          if (file.size > MAX_FILE_SIZE_BYTES) {
            return Response.json(
              { error: 'File size exceeds 10MB limit.' },
              { status: 400 },
            )
          }

          const mimeType = file.type
          if (
            !ALLOWED_MIME_TYPES.includes(
              mimeType as (typeof ALLOWED_MIME_TYPES)[number],
            )
          ) {
            return Response.json(
              {
                error: `Invalid file type: ${mimeType}. Allowed formats: JPG, PNG, WebP, GIF, SVG, AVIF, PDF.`,
              },
              { status: 400 },
            )
          }

          const isPdf = mimeType === 'application/pdf'
          const originalName =
            file.name || (isPdf ? 'document.pdf' : 'image.png')
          const ext =
            originalName.split('.').pop()?.toLowerCase() ||
            (isPdf ? 'pdf' : 'png')
          const rawBaseName = originalName.replace(/\.[^/.]+$/, '')
          const cleanBaseName =
            rawBaseName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '') || (isPdf ? 'document' : 'image')

          const uniquePrefix = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`
          const folder = isPdf ? 'documents' : 'projects'
          const key = `${folder}/${uniquePrefix}-${cleanBaseName}.${ext}`

          const arrayBuffer = await file.arrayBuffer()

          // Upload to Cloudflare R2
          await env.MEDIA_BUCKET.put(key, arrayBuffer, {
            httpMetadata: {
              contentType: mimeType,
            },
          })

          const appUrl = (
            env.PUBLIC_APP_URL || new URL(request.url).origin
          ).replace(/\/+$/, '')
          const publicUrl = `${appUrl}/api/media/file/${key}`
          const db = getDb(env.DB)

          const mediaRecord = await createMediaRecord(db, {
            filename: originalName,
            url: publicUrl,
            mimeType,
            size: file.size,
            alt: typeof alt === 'string' && alt.trim() ? alt.trim() : null,
          })

          return Response.json({ data: mediaRecord }, { status: 201 })
        } catch (error) {
          console.error('[API /api/media POST Error]', error)
          return Response.json(
            { error: 'Failed to upload media to storage.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
