import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import { listPublicStack } from '#/features/technologies/queries'

export const Route = createFileRoute('/api/stack')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const db = getDb(env.DB)
          const items = await listPublicStack(db)
          return Response.json({ data: items })
        } catch (error) {
          console.error(error)
          return Response.json(
            { error: 'Failed to fetch public stack.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
