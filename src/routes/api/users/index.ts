import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import { requireOwnerUser } from '#/features/auth/session'
import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser,
} from '#/features/users/queries'
import {
  createUserSchema,
  updateUserSchema,
} from '#/features/users/validation'
import { handleApiError } from '#/lib/api-response'

export const Route = createFileRoute('/api/users/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const authUser = await requireOwnerUser(request)
          if (authUser instanceof Response) return authUser

          const url = new URL(request.url)
          const id = url.searchParams.get('id')
          const db = getDb(env.DB)

          if (id) {
            const user = await getUserById(db, id)
            if (!user) {
              return Response.json(
                { error: 'User not found.' },
                { status: 404 },
              )
            }
            return Response.json({ data: user })
          }

          const users = await listUsers(db)
          return Response.json({ data: users })
        } catch (error) {
          return handleApiError(error, 'Failed to fetch users.')
        }
      },

      POST: async ({ request }) => {
        try {
          const authUser = await requireOwnerUser(request)
          if (authUser instanceof Response) return authUser

          const payload = await request.json()
          const input = createUserSchema.parse(payload)
          const db = getDb(env.DB)

          const created = await createUser(db, input)
          return Response.json({ data: created }, { status: 201 })
        } catch (error) {
          return handleApiError(error, 'Failed to create user.')
        }
      },

      PUT: async ({ request }) => {
        try {
          const authUser = await requireOwnerUser(request)
          if (authUser instanceof Response) return authUser

          const payload = await request.json()
          const input = updateUserSchema.parse(payload)
          const db = getDb(env.DB)

          const updated = await updateUser(db, authUser.id, input)
          return Response.json({ data: updated })
        } catch (error) {
          return handleApiError(error, 'Failed to update user.')
        }
      },

      DELETE: async ({ request }) => {
        try {
          const authUser = await requireOwnerUser(request)
          if (authUser instanceof Response) return authUser

          const url = new URL(request.url)
          const id = url.searchParams.get('id')
          if (!id) {
            return Response.json(
              { error: 'User ID is required.' },
              { status: 400 },
            )
          }

          const db = getDb(env.DB)
          await deleteUser(db, authUser.id, id)

          return Response.json({ success: true })
        } catch (error) {
          return handleApiError(error, 'Failed to delete user.')
        }
      },
    },
  },
})

