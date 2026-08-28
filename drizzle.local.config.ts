import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

import { findLocalD1Database } from '#/db/cli-utils'

config({ path: ['.env.local', '.env'] })

const localDbPath = findLocalD1Database()

if (!localDbPath) {
  throw new Error(
    'Local D1 database not found in .wrangler/state/v3/d1/miniflare-D1DatabaseObject. Please run "bun run db:migrate:local" first to initialize the local database.',
  )
}

export default defineConfig({
  out: './drizzle/migrations',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: localDbPath,
  },
})
