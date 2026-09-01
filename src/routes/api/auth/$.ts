import { createFileRoute } from '@tanstack/react-router'
import { auth } from '#/lib/auth'
import { verifyTurnstileToken } from '#/lib/turnstile'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          return await auth.handler(request)
        } catch (error) {
          console.error('[api/auth] GET handler error:', error)
          return Response.json(
            {
              error: 'Authentication request failed.',
              message: 'Authentication request failed.',
            },
            { status: 500 },
          )
        }
      },
      POST: async ({ request }) => {
        const url = new URL(request.url)

        if (url.pathname.includes('/sign-in/email')) {
          let token: string | undefined =
            request.headers.get('cf-turnstile-response') || undefined

          if (!token) {
            try {
              const cloned = request.clone()
              const body: unknown = await cloned.json()
              if (body && typeof body === 'object') {
                const map = body as Record<string, unknown>
                if (typeof map.turnstileToken === 'string') {
                  token = map.turnstileToken
                } else if (typeof map['cf-turnstile-response'] === 'string') {
                  token = map['cf-turnstile-response']
                }
              }
            } catch {
              // Body was not JSON or already consumed
            }
          }

          const verification = await verifyTurnstileToken({
            token: token || '',
            action: 'login',
            request,
          })

          if (!verification.success) {
            return Response.json(
              {
                error:
                  verification.error ||
                  'Security challenge verification failed.',
                message:
                  verification.error ||
                  'Security challenge verification failed.',
              },
              { status: 403 },
            )
          }
        }

        try {
          return await auth.handler(request)
        } catch (error) {
          console.error('[api/auth] POST handler error:', error)
          return Response.json(
            {
              error: 'Authentication request failed.',
              message: 'Authentication request failed.',
            },
            { status: 500 },
          )
        }
      },
    },
  },
})
