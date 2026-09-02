import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import {
  createTechnology,
  deleteTechnology,
  getTechnologyById,
  listTechnologies,
  updateTechnology,
} from '#/features/technologies/queries'
import { technologyInputSchema } from '#/features/technologies/validation'
import { handleApiError } from '#/lib/api-response'

export const Route = createFileRoute('/api/technologies')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url)
          const id = url.searchParams.get('id')
          const db = getDb(env.DB)

          if (id) {
            const item = await getTechnologyById(db, id)
            if (!item) {
              return Response.json(
                { error: 'Technology not found.' },
                { status: 404 },
              )
            }
            return Response.json({ data: item })
          }

          const items = await listTechnologies(db)
          return Response.json({ data: items })
        } catch (error) {
          return handleApiError(error, 'Failed to fetch technologies.')
        }
      },
      POST: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          const body = await request.json()
          const input = technologyInputSchema.parse(body)

          const db = getDb(env.DB)
          const item = await createTechnology(db, {
            ...input,
            categoryIds: input.categoryIds,
          })
          return Response.json({ data: item }, { status: 201 })
        } catch (error) {
          return handleApiError(error, 'Failed to create technology.')
        }
      },
      PUT: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          const url = new URL(request.url)
          const id = url.searchParams.get('id')
          if (!id) {
            return Response.json(
              { error: 'Technology ID is required.' },
              { status: 400 },
            )
          }

          const body = await request.json()
          const input = technologyInputSchema.parse(body)

          const db = getDb(env.DB)
          const item = await updateTechnology(db, id, {
            ...input,
            categoryIds: input.categoryIds,
          })
          if (!item) {
            return Response.json(
              { error: 'Technology not found.' },
              { status: 404 },
            )
          }
          return Response.json({ data: item })
        } catch (error) {
          return handleApiError(error, 'Failed to update technology.')
        }
      },
      DELETE: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          const url = new URL(request.url)
          const id = url.searchParams.get('id')
          if (!id) {
            return Response.json({ error: 'ID is required.' }, { status: 400 })
          }

          const db = getDb(env.DB)
          const success = await deleteTechnology(db, id)
          if (!success) {
            return Response.json(
              { error: 'Technology not found.' },
              { status: 404 },
            )
          }
          return Response.json({ success: true })
        } catch (error) {
          return handleApiError(error, 'Failed to delete technology.')
        }
      },
    },
  },
})
