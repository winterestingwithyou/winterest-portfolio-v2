import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { drizzle as drizzleSqliteProxy } from 'drizzle-orm/sqlite-proxy'
import { ofetch } from 'ofetch'

import type { Database } from './index'
import * as schema from './schema'

/**
 * Dynamically locate the latest Miniflare local D1 SQLite database file
 */
export function findLocalD1Database(): string | null {
  const root = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject'
  if (!existsSync(root)) {
    return null
  }

  return (
    readdirSync(root)
      .filter((file) => file.endsWith('.sqlite') && file !== 'metadata.sqlite')
      .map((file) => join(root, file))
      .filter((file) => statSync(file).isFile())
      .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0] ?? null
  )
}

/**
 * Safely read a required environment variable for remote D1 execution
 */
export function readEnv(name: string, purpose = 'execution'): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is required for remote D1 ${purpose}.`)
  }
  return value
}

/**
 * Shape of the Cloudflare D1 HTTP query response
 */
export type D1QueryResponse = {
  success: boolean
  result?: Array<{
    results?: Array<Record<string, unknown>>
  }>
  errors?: Array<{
    message: string
  }>
}

/**
 * Create a remote Cloudflare D1 Drizzle ORM client using HTTP SQLite Proxy
 */
export function createRemoteD1Database(
  accountId = readEnv('CLOUDFLARE_ACCOUNT_ID'),
  databaseId = readEnv('CLOUDFLARE_D1_DATABASE_ID'),
  apiToken = readEnv('CLOUDFLARE_D1_API_TOKEN'),
): Database {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`

  const db = drizzleSqliteProxy(
    async (sql, params, method) => {
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

      const allRows =
        payload.result?.flatMap((result) => result.results ?? []) ?? []

      // When Drizzle executes a .get() query, it expects a single row object or undefined
      if (method === 'get') {
        return {
          rows: allRows[0] as unknown as Record<string, unknown>[],
        }
      }

      // For .all(), .values(), and .run(), return the array of rows
      return {
        rows: allRows,
      }
    },
    { schema },
  )

  return db as unknown as Database
}
