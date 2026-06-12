import { ZodError } from 'zod'

export function json(body: unknown, init?: ResponseInit) {
  return Response.json(body, init)
}

export function handleContentApiError(error: unknown, label: string) {
  if (error instanceof ZodError) {
    return json(
      {
        error: `Invalid ${label} payload.`,
        issues: error.issues,
      },
      { status: 422 },
    )
  }

  if (error instanceof Error && error.message.includes('no such table')) {
    return json(
      {
        error: `${label} tables are not available yet. Apply the D1 migration first.`,
      },
      { status: 503 },
    )
  }

  console.error(error)
  return json({ error: `${label} request failed.` }, { status: 500 })
}
