import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { config } from 'dotenv'
import BetterSqliteDatabase from 'better-sqlite3'
import { drizzle as drizzleBetterSqlite } from 'drizzle-orm/better-sqlite3'
import { drizzle as drizzleSqliteProxy } from 'drizzle-orm/sqlite-proxy'

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
  const localDbPath = process.env.D1_LOCAL_DB_PATH ?? findLocalD1Database()

  if (!localDbPath) {
    throw new Error(
      'Local D1 database was not found. Run the local D1 migration first, or set D1_LOCAL_DB_PATH.',
    )
  }

  const sqlite = new BetterSqliteDatabase(localDbPath)
  const db = drizzleBetterSqlite(sqlite, { schema })

  await seedPortfolioData(db as unknown as Database)
  sqlite.close()

  console.log(`Seeded local D1 database: ${localDbPath}`)
}

async function seedRemote() {
  const accountId = readEnv('CLOUDFLARE_ACCOUNT_ID')
  const databaseId = readEnv('CLOUDFLARE_D1_DATABASE_ID')
  const apiToken = readEnv('CLOUDFLARE_D1_API_TOKEN')
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`

  const db = drizzleSqliteProxy(
    async (sql, params) => {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, params }),
      })
      const payload = await response.json<D1QueryResponse>()

      if (!response.ok || !payload.success) {
        const message =
          payload.errors?.map((error) => error.message).join('; ') ||
          `Cloudflare D1 request failed with status ${response.status}.`
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

function readEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is required for remote D1 seeding.`)
  }

  return value
}

function findLocalD1Database() {
  const root = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject'
  if (!existsSync(root)) {
    return null
  }

  return readdirSync(root)
    .filter((file) => file.endsWith('.sqlite') && file !== 'metadata.sqlite')
    .map((file) => join(root, file))
    .filter((file) => statSync(file).isFile())
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0]
}

type D1QueryResponse = {
  success: boolean
  result?: Array<{
    results?: Array<Record<string, unknown>>
  }>
  errors?: Array<{
    message: string
  }>
}
