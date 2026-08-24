import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { ZodError } from 'zod'

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

function handleApiError(error: unknown, fallbackMessage: string) {
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

  if (error instanceof Error) {
    if (
      error.message.includes('already registered') ||
      error.message.includes('Cannot') ||
      error.message.includes('not found')
    ) {
      return Response.json({ error: error.message }, { status: 400 })
    }
  }

  console.error(error)
  return Response.json({ error: fallbackMessage }, { status: 500 })
}
