import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { z } from 'zod'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory,
} from '#/features/technologies/queries'
import { categoryInputSchema } from '#/features/technologies/validation'
import { handleApiError } from '#/lib/api-response'

export const Route = createFileRoute('/api/categories')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url)
          const id = url.searchParams.get('id')
          const db = getDb(env.DB)

          if (id) {
            const item = await getCategoryById(db, id)
            if (!item) {
              return Response.json(
                { error: 'Category not found.' },
                { status: 404 },
              )
            }
            return Response.json({ data: item })
          }

          const items = await listCategories(db)
          return Response.json({ data: items })
        } catch (error) {
          return handleApiError(error, 'Failed to fetch categories.')
        }
      },
      POST: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          const body = await request.json()
          const input = categoryInputSchema.parse(body)

          const db = getDb(env.DB)
          const item = await createCategory(db, input)
          return Response.json({ data: item }, { status: 201 })
        } catch (error) {
          return handleApiError(error, 'Failed to create category.')
        }
      },
      PUT: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          const body = await request.json()
          const input = categoryInputSchema
            .extend({ id: z.string().min(1, 'Category ID is required.') })
            .parse(body)

          const db = getDb(env.DB)
          const item = await updateCategory(db, input.id, input)
          if (!item) {
            return Response.json(
              { error: 'Category not found.' },
              { status: 404 },
            )
          }
          return Response.json({ data: item })
        } catch (error) {
          return handleApiError(error, 'Failed to update category.')
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
          return handleApiError(error, 'Failed to delete category.')
        }
      },
    },
  },
})
