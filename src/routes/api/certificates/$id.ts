import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

import { getDb } from '#/db'
import { requireDashboardUser } from '#/features/auth/session'
import { getCertificateCopy } from '#/features/certificates/copy'
import {
  deleteCertificate,
  getCertificateById,
  updateCertificate,
} from '#/features/certificates/queries'
import {
  certificateIdSchema,
  getCertificateInputSchema,
} from '#/features/certificates/validation'
import { handleApiError } from '#/lib/api-response'

export const Route = createFileRoute('/api/certificates/$id')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          const id = certificateIdSchema.parse(params.id)
          const certificate = await getCertificateById(getDb(env.DB), id)
          if (!certificate) {
            return Response.json(
              { error: 'Certificate not found.' },
              { status: 404 },
            )
          }
          return Response.json({ data: certificate })
        } catch (error) {
          return handleApiError(error, 'Failed to fetch certificate.')
        }
      },
      PATCH: async ({ request, params }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          const id = certificateIdSchema.parse(params.id)
          const validationCopy = getCertificateCopy().dashboard.form.validation
          const input = getCertificateInputSchema(validationCopy).parse(
            await request.json(),
          )
          const certificate = await updateCertificate(
            getDb(env.DB),
            id,
            input,
            validationCopy,
          )
          if (!certificate) {
            return Response.json(
              { error: 'Certificate not found.' },
              { status: 404 },
            )
          }
          return Response.json({ data: certificate })
        } catch (error) {
          return handleApiError(error, 'Failed to update certificate.')
        }
      },
      DELETE: async ({ request, params }) => {
        try {
          const user = await requireDashboardUser(request)
          if (user instanceof Response) return user

          const id = certificateIdSchema.parse(params.id)
          const deleted = await deleteCertificate(getDb(env.DB), id)
          if (!deleted) {
            return Response.json(
              { error: 'Certificate not found.' },
              { status: 404 },
            )
          }
          return Response.json({ data: { deleted: true } })
        } catch (error) {
          return handleApiError(error, 'Failed to delete certificate.')
        }
      },
    },
  },
})
