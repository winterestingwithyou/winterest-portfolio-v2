import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: ['.env.local', '.env'] })

const databaseId =
  process.env.CLOUDFLARE_D1_DATABASE_ID ??
  process.env.CLOUDFLARE_DATABASE_ID ??
  '7ff292bd-6969-4fce-9644-22a4bba8805e'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? '',
    databaseId,
    token:
      process.env.CLOUDFLARE_D1_API_TOKEN ??
      process.env.CLOUDFLARE_API_TOKEN ??
      '',
  },
})
