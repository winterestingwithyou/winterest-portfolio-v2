import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { ZodError } from 'zod'

import { getDb } from '#/db'
import { requireSettingsUser } from '#/features/auth/session'
import {
  getSiteSettings,
  updateSiteSettings,
} from '#/features/settings/queries'
import { siteSettingsSchema } from '#/features/settings/types'

export const Route = createFileRoute('/api/settings')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const db = getDb(env.DB)
          const settings = await getSiteSettings(db)
          return Response.json({ data: settings })
        } catch (error) {
          console.error(error)
          return Response.json(
            { error: 'Failed to fetch site settings.' },
            { status: 500 },
          )
        }
      },

      POST: async ({ request }) => {
        try {
          const authUser = await requireSettingsUser(request)
          if (authUser instanceof Response) return authUser

          const payload = await request.json()
          const input = siteSettingsSchema.parse(payload)
          const db = getDb(env.DB)

          const updated = await updateSiteSettings(db, input)
          return Response.json({ data: updated })
        } catch (error) {
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

          console.error(error)
          return Response.json(
            { error: 'Failed to save site settings.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
