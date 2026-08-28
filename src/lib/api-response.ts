import { ZodError } from 'zod'

export type ApiErrorResponsePayload = {
  error: string
  issues?: unknown[]
}

/**
 * Standard JSON response helper for API routes
 */
export function jsonResponse<T>(data: T, init?: ResponseInit): Response {
  return Response.json(data, init)
}

/**
 * Centralized API Error Handler for server route handlers
 */
export function handleApiError(
  error: unknown,
  fallbackMessage = 'Internal server error.',
): Response {
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
    // Missing table error (e.g. before migrations are run)
    if (error.message.includes('no such table')) {
      return Response.json(
        {
          error:
            'Database tables are not available yet. Apply D1 migrations first.',
        },
        { status: 503 },
      )
    }

    // SQLite Unique constraint violation
    if (error.message.includes('UNIQUE constraint')) {
      if (error.message.includes('slug')) {
        return Response.json(
          { error: 'An item with this slug already exists.' },
          { status: 409 },
        )
      }
      if (error.message.includes('email')) {
        return Response.json(
          { error: 'Email already registered.' },
          { status: 400 },
        )
      }
      return Response.json(
        { error: 'A record with this identifier already exists.' },
        { status: 409 },
      )
    }

    // Resource not found
    if (
      error.message.includes('not found') ||
      error.message.includes('Not found')
    ) {
      return Response.json({ error: error.message }, { status: 404 })
    }

    // Client/input constraint errors (e.g., 'already registered', 'Cannot...', 'Unauthorized')
    if (
      error.message.includes('already registered') ||
      error.message.includes('Cannot') ||
      error.message.includes('Current password') ||
      error.message.includes('No credential')
    ) {
      return Response.json({ error: error.message }, { status: 400 })
    }
  }

  console.error('[API Error]:', error)
  return Response.json({ error: fallbackMessage }, { status: 500 })
}
