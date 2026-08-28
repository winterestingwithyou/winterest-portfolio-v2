import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

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
