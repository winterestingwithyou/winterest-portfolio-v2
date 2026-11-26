import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import { getCertificateCopy } from '#/features/certificates/copy'
import {
  createCertificate,
  listCertificates,
} from '#/features/certificates/queries'
import { getCertificateInputSchema } from '#/features/certificates/validation'
import { handleApiError } from '#/lib/api-response'

export const Route = createFileRoute('/api/certificates/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          return Response.json({ data: await listCertificates(getDb(env.DB)) })
        } catch (error) {
          return handleApiError(error, 'Failed to list certificates.')
        }
      },
      POST: async ({ request }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          const validationCopy = getCertificateCopy().dashboard.form.validation
          const input = getCertificateInputSchema(validationCopy).parse(
            await request.json(),
          )
          const certificate = await createCertificate(
            getDb(env.DB),
            input,
            validationCopy,
          )
          return Response.json({ data: certificate }, { status: 201 })
        } catch (error) {
          return handleApiError(error, 'Failed to create certificate.')
        }
      },
    },
  },
})
