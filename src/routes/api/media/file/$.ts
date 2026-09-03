import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

export const Route = createFileRoute('/api/media/file/$')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        try {
          const url = new URL(request.url)
          const prefix = '/api/media/file/'
          const rawKey = url.pathname.startsWith(prefix)
            ? url.pathname.slice(prefix.length)
            : (params._splat ?? '')

          const key = decodeURIComponent(rawKey)

          if (!key || key.trim() === '') {
            return new Response('Media key is required.', { status: 400 })
          }

          const object = await env.MEDIA_BUCKET.get(key)

          if (!object) {
            return new Response('Media not found.', { status: 404 })
          }

          // Handle 304 Not Modified caching
          const ifNoneMatch = request.headers.get('if-none-match')
          if (
            ifNoneMatch &&
            object.httpEtag &&
            (ifNoneMatch === object.httpEtag ||
              ifNoneMatch === `"${object.httpEtag}"`)
          ) {
            return new Response(null, {
              status: 304,
              headers: {
                etag: object.httpEtag,
                'cache-control': 'public, max-age=31536000, immutable',
              },
            })
          }

          const headers = new Headers()
          object.writeHttpMetadata(headers)
          headers.set('etag', object.httpEtag)
          headers.set('cache-control', 'public, max-age=31536000, immutable')
          headers.set('x-content-type-options', 'nosniff')

          const contentType = headers.get('content-type') || ''
          if (
            contentType.includes('svg') ||
            key.toLowerCase().endsWith('.svg')
          ) {
            headers.set(
              'content-security-policy',
              "default-src 'none'; script-src 'none'; frame-ancestors 'none'",
            )
            headers.set('x-frame-options', 'DENY')
          }

          const isPdf =
            contentType.includes('pdf') || key.toLowerCase().endsWith('.pdf')
          if (isPdf) {
            headers.set('content-type', 'application/pdf')
            const rawFilename = key.split('/').pop() || 'document.pdf'
            const cleanDisplayName = rawFilename.replace(/^\d+-[a-f0-9]+-/, '')
            headers.set(
              'content-disposition',
              `inline; filename="${encodeURIComponent(cleanDisplayName)}"`,
            )
          }

          return new Response(object.body, {
            headers,
          })
        } catch (error) {
          console.error('[API /api/media/file/$ GET Error]', error)
          return new Response('Failed to stream media asset.', { status: 500 })
        }
      },
    },
  },
})
