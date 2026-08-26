import { createServerFn } from '@tanstack/react-start'
import { count, eq } from 'drizzle-orm'

export type SystemStatus = {
  hasOwner: boolean
  isMigrated: boolean
  error?: string
}

export const getSystemStatus = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SystemStatus> => {
    try {
      const [{ env }, { getDb }, schema] = await Promise.all([
        import('cloudflare:workers'),
        import('#/db'),
        import('#/db/schema'),
      ])

      const db = getDb(env.DB)

      const result = await db
        .select({ value: count() })
        .from(schema.user)
        .where(eq(schema.user.role, 'owner'))
        .get()

      const ownerCount = result?.value ?? 0

      return {
        hasOwner: ownerCount > 0,
        isMigrated: true,
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error)

      const isMissingTable =
        (error instanceof Error && error.message.includes('no such table')) ||
        (error instanceof Error &&
          error.cause instanceof Error &&
          error.cause.message.includes('no such table'))

      // If database tables are not yet created
      if (isMissingTable) {
        return {
          hasOwner: false,
          isMigrated: false,
          error: 'Database tables are not migrated yet.',
        }
      }

      return {
        hasOwner: false,
        isMigrated: true,
        error: message,
      }
    }
  },
)
