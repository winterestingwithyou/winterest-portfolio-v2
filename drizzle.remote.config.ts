import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

import { readEnv } from '#/db/cli-utils'

config({ path: ['.env.local', '.env'] })

export default defineConfig({
  out: './drizzle/migrations',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: readEnv('CLOUDFLARE_ACCOUNT_ID', 'Drizzle Studio Remote'),
    databaseId: readEnv('CLOUDFLARE_D1_DATABASE_ID', 'Drizzle Studio Remote'),
    token: readEnv('CLOUDFLARE_D1_API_TOKEN', 'Drizzle Studio Remote'),
  },
})
