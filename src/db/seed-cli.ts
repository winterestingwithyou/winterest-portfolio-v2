import { config } from 'dotenv'
import BetterSqliteDatabase from 'better-sqlite3'
import { drizzle as drizzleBetterSqlite } from 'drizzle-orm/better-sqlite3'
import { drizzle as drizzleSqliteProxy } from 'drizzle-orm/sqlite-proxy'
import { ofetch } from 'ofetch'

import { findLocalD1Database, readEnv } from './cli-utils'
import type { D1QueryResponse } from './cli-utils'
import * as schema from './schema'
import { seedPortfolioData } from './seed'
import type { Database } from './index'

config({ path: ['.env.local', '.env'] })

const target = process.argv[2] ?? 'local'

if (target !== 'local' && target !== 'remote') {
  console.error('Usage: bun run db:seed:local or bun run db:seed:remote')
  process.exit(1)
}

if (target === 'local') {
  await seedLocal()
} else {
  await seedRemote()
}

async function seedLocal() {
  const localDbPath = findLocalD1Database()

  if (!localDbPath) {
    throw new Error(
      'Local D1 database was not found. Please run local D1 migrations first (e.g. bun run db:migrate:local).',
    )
  }

  const sqlite = new BetterSqliteDatabase(localDbPath)
  const db = drizzleBetterSqlite(sqlite, { schema })

  await seedPortfolioData(db as unknown as Database)
  sqlite.close()

  console.log(`Seeded local D1 database: ${localDbPath}`)
}

async function seedRemote() {
  const accountId = readEnv('CLOUDFLARE_ACCOUNT_ID', 'seeding')
  const databaseId = readEnv('CLOUDFLARE_D1_DATABASE_ID', 'seeding')
  const apiToken = readEnv('CLOUDFLARE_D1_API_TOKEN', 'seeding')
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`

  const db = drizzleSqliteProxy(
    async (sql, params) => {
      const payload = await ofetch<D1QueryResponse>(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        body: { sql, params },
      })

      if (!payload.success) {
        const message =
          payload.errors?.map((error) => error.message).join('; ') ||
          'Cloudflare D1 request failed.'
        throw new Error(message)
      }

      return {
        rows: payload.result?.flatMap((result) => result.results ?? []) ?? [],
      }
    },
    { schema },
  )

  await seedPortfolioData(db as unknown as Database)

  console.log(`Seeded remote D1 database: ${databaseId}`)
}

