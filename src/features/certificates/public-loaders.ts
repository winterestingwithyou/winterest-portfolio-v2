import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { isMissingTableError } from '#/lib/db-utils'

export const getPublicCertificates = createServerFn({ method: 'GET' })
  .validator(z.object({ limit: z.literal(5).optional() }))
  .handler(async ({ data }) => {
    try {
      const [{ env }, { getDb }, { listPublishedCertificates }] =
        await Promise.all([
          import('cloudflare:workers'),
          import('#/db'),
          import('./queries'),
        ])
      return await listPublishedCertificates(getDb(env.DB), data.limit)
    } catch (error) {
      if (isMissingTableError(error)) return []
      throw error
    }
  })
