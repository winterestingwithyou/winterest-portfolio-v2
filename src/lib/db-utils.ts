/**
 * Detect whether a D1/SQLite runtime error is due to a missing table
 * (useful for graceful fallback before migrations are applied)
 */
export function isMissingTableError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('no such table')
}
