import { drizzle } from 'drizzle-orm/d1'

import * as schema from './schema.ts'

export type Database = ReturnType<typeof getDb>

export function getDb(database: D1Database) {
  return drizzle(database, { schema })
}

export { schema }
