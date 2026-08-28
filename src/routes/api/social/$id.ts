import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { ZodError } from 'zod'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import {
  deleteSocialLink,
  getSocialLinkById,
  getSocialLinkByPlatform,
  updateSocialLink,
} from '#/features/social/queries'
import { socialLinkSchema } from '#/features/social/types'

export const Route = createFileRoute('/api/social/$id')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const db = getDb(env.DB)
          const socialLink = await getSocialLinkById(db, params.id)

          if (!socialLink) {
            return Response.json(
              { error: 'Social link not found.' },
              { status: 404 },
            )
          }

          return Response.json({ data: socialLink })
        } catch (error) {
          console.error(error)
          return Response.json(
            { error: 'Failed to fetch social link.' },
            { status: 500 },
          )
        }
      },

      PUT: async ({ params, request }) => {
        try {
          const authUser = await requireDashboardUser(request)
          if (authUser instanceof Response) return authUser

          const payload = await request.json()
          const input = socialLinkSchema.partial().parse(payload)
          const db = getDb(env.DB)

          const existing = await getSocialLinkById(db, params.id)
          if (!existing) {
            return Response.json(
              { error: 'Social link not found.' },
              { status: 404 },
            )
          }

          // If platform is changing, ensure no other link uses the new platform
          if (input.platform && input.platform !== existing.platform) {
            const platformCollision = await getSocialLinkByPlatform(
              db,
              input.platform,
            )
            if (platformCollision && platformCollision.id !== params.id) {
              return Response.json(
                {
                  error: `Platform "${input.platform}" is already registered.`,
                },
                { status: 400 },
              )
            }
          }

          const updated = await updateSocialLink(db, params.id, input)
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
            { error: 'Failed to update social link.' },
            { status: 500 },
          )
        }
      },

      DELETE: async ({ params, request }) => {
        try {
          const authUser = await requireDashboardUser(request)
          if (authUser instanceof Response) return authUser

          const db = getDb(env.DB)
          const existing = await getSocialLinkById(db, params.id)
          if (!existing) {
            return Response.json(
              { error: 'Social link not found.' },
              { status: 404 },
            )
          }

          await deleteSocialLink(db, params.id)
          return Response.json({ success: true })
        } catch (error) {
          console.error(error)
          return Response.json(
            { error: 'Failed to delete social link.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
