import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from '#/features/technologies/queries'
import type { CategoryInput } from '#/features/technologies/queries'

export const Route = createFileRoute('/api/categories')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const db = getDb(env.DB)
          const items = await listCategories(db)
          return Response.json({ data: items })
        } catch (error) {
          console.error(error)
          return Response.json(
            { error: 'Failed to fetch categories.' },
            { status: 500 },
          )
        }
      },
      POST: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          const body: CategoryInput = await request.json()
          if (!body.name || !body.slug) {
            return Response.json(
              { error: 'Name and slug are required.' },
              { status: 400 },
            )
          }

          const db = getDb(env.DB)
          const item = await createCategory(db, body)
          return Response.json({ data: item })
        } catch (error) {
          console.error(error)
          return Response.json(
            { error: 'Failed to create category.' },
            { status: 500 },
          )
        }
      },
      PUT: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          const body: CategoryInput & { id: string } = await request.json()
          if (!body.id || !body.name || !body.slug) {
            return Response.json(
              { error: 'ID, name, and slug are required.' },
              { status: 400 },
            )
          }

          const db = getDb(env.DB)
          const item = await updateCategory(db, body.id, body)
          if (!item) {
            return Response.json(
              { error: 'Category not found.' },
              { status: 404 },
            )
          }
          return Response.json({ data: item })
        } catch (error) {
          console.error(error)
          return Response.json(
            { error: 'Failed to update category.' },
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
          const success = await deleteCategory(db, id)
          if (!success) {
            return Response.json(
              { error: 'Category not found.' },
              { status: 404 },
            )
          }
          return Response.json({ success: true })
        } catch (error) {
          console.error(error)
          return Response.json(
            { error: 'Failed to delete category.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
