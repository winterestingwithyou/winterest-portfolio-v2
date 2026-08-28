import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { ZodError } from 'zod'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import {
  createSocialLink,
  getPublicSocialLinks,
  getSocialLinkByPlatform,
  getSocialLinks,
} from '#/features/social/queries'
import { socialLinkSchema } from '#/features/social/types'

export const Route = createFileRoute('/api/social/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url)
          const publicOnly = url.searchParams.get('publicOnly') === 'true'
          const db = getDb(env.DB)

          if (publicOnly) {
            const publicLinks = await getPublicSocialLinks(db)
            return Response.json({ data: publicLinks })
          }

          const links = await getSocialLinks(db)
          return Response.json({ data: links })
        } catch (error) {
          console.error(error)
          return Response.json(
            { error: 'Failed to fetch social links.' },
            { status: 500 },
          )
        }
      },

      POST: async ({ request }) => {
        try {
          const authUser = await requireDashboardUser(request)
          if (authUser instanceof Response) return authUser

          const payload = await request.json()
          const input = socialLinkSchema.parse(payload)
          const db = getDb(env.DB)

          const existing = await getSocialLinkByPlatform(db, input.platform)
          if (existing) {
            return Response.json(
              {
                error: `Platform "${input.platform}" is already registered. Only 1 account per platform is permitted.`,
              },
              { status: 400 },
            )
          }

          const created = await createSocialLink(db, input)
          return Response.json({ data: created }, { status: 201 })
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
            { error: 'Failed to create social link.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
