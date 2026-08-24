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
import type { TechnologyInput } from '#/features/technologies/queries'

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
          console.error(error)
          return Response.json(
            { error: 'Failed to fetch technologies.' },
            { status: 500 },
          )
        }
      },
      POST: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          const body: TechnologyInput = await request.json()
          if (!body.name || !body.slug) {
            return Response.json(
              { error: 'Name and slug are required.' },
              { status: 400 },
            )
          }

          const db = getDb(env.DB)
          const item = await createTechnology(db, {
            ...body,
            categoryIds: body.categoryIds,
          })
          return Response.json({ data: item })
        } catch (error) {
          console.error(error)
          return Response.json(
            { error: 'Failed to create technology.' },
            { status: 500 },
          )
        }
      },
      PUT: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          const body: TechnologyInput & { id: string } = await request.json()
          if (!body.id || !body.name || !body.slug) {
            return Response.json(
              { error: 'ID, name, and slug are required.' },
              { status: 400 },
            )
          }

          const db = getDb(env.DB)
          const item = await updateTechnology(db, body.id, {
            ...body,
            categoryIds: body.categoryIds,
          })
          if (!item) {
            return Response.json(
              { error: 'Technology not found.' },
              { status: 404 },
            )
          }
          return Response.json({ data: item })
        } catch (error) {
          console.error(error)
          return Response.json(
            { error: 'Failed to update technology.' },
            { status: 500 },
          )
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
          console.error(error)
          return Response.json(
            { error: 'Failed to delete technology.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
