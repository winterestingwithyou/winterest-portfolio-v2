import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline/promises'

import { config } from 'dotenv'
import BetterSqliteDatabase from 'better-sqlite3'
import { eq } from 'drizzle-orm'
import { drizzle as drizzleBetterSqlite } from 'drizzle-orm/better-sqlite3'
import { drizzle as drizzleSqliteProxy } from 'drizzle-orm/sqlite-proxy'

import { hashPassword } from '../lib/auth/password'
import type { Database } from './index'
import * as schema from './schema'

config({ path: ['.env.local', '.env'] })

const target = process.argv[2] ?? 'local'

if (target !== 'local' && target !== 'remote') {
  console.error('Usage: bun run create-owner:local or bun run create-owner:remote')
  process.exit(1)
}

async function main() {
  console.log(`\n========================================`)
  console.log(`🚀 Winterest Portfolio - Create Owner Account (${target.toUpperCase()})`)
  console.log(`========================================\n`)

  if (target === 'local') {
    await handleLocal()
  } else {
    await handleRemote()
  }
}

async function handleLocal() {
  const localDbPath = process.env.D1_LOCAL_DB_PATH ?? findLocalD1Database()

  if (!localDbPath) {
    throw new Error(
      'Local D1 database was not found. Run local D1 migration first, or set D1_LOCAL_DB_PATH.',
    )
  }

  const sqlite = new BetterSqliteDatabase(localDbPath)
  const db = drizzleBetterSqlite(sqlite, { schema })

  try {
    await checkAndPromptOwner(db as unknown as Database, `Local D1 (${localDbPath})`)
  } finally {
    sqlite.close()
  }
}

async function handleRemote() {
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

  await checkAndPromptOwner(db as unknown as Database, `Remote D1 (${databaseId})`)
}

async function checkAndPromptOwner(db: Database, targetDescription: string) {
  // Check 1 owner rule
  const existingOwners = await db
    .select({
      id: schema.user.id,
      name: schema.user.name,
      email: schema.user.email,
    })
    .from(schema.user)
    .where(eq(schema.user.role, 'owner'))
    .all()

  if (existingOwners.length > 0) {
    console.log(`ℹ️  Target Database: ${targetDescription}`)
    console.error(`\n❌ Error: An owner account already exists in this database:`)
    console.error(`   Name : ${existingOwners[0].name}`)
    console.error(`   Email: ${existingOwners[0].email}`)
    console.error(`\nOnly 1 owner account is permitted in the Winterest portfolio.\n`)
    process.exit(1)
  }

  const rl = createInterface({ input, output })

  try {
    // 1. Name
    const nameInput = await rl.question('Enter Owner Name [default: Winterest]: ')
    const name = nameInput.trim() || 'Winterest'

    // 2. Email
    let email = ''
    while (!email) {
      const emailInput = await rl.question('Enter Owner Email: ')
      const trimmed = emailInput.trim().toLowerCase()
      if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        console.log('⚠️  Please enter a valid email address (e.g. you@example.com).')
        continue
      }

      // Check if email already registered
      const existingUser = await db
        .select({ id: schema.user.id })
        .from(schema.user)
        .where(eq(schema.user.email, trimmed))
        .get()

      if (existingUser) {
        console.log(`⚠️  The email "${trimmed}" is already registered. Please choose another email.`)
        continue
      }

      email = trimmed
    }

    // 3. Password
    let password = ''
    while (!password) {
      const passInput = await rl.question('Enter Owner Password (minimum 8 characters): ')
      if (!passInput || passInput.length < 8) {
        console.log('⚠️  Password must be at least 8 characters long.')
        continue
      }
      password = passInput
    }

    console.log('\n⏳ Creating owner account and hashing password...')

    const userId = crypto.randomUUID()
    const accountId = crypto.randomUUID()
    const now = new Date()
    const hashedPassword = await hashPassword(password)

    // Insert user record
    await db.insert(schema.user).values({
      id: userId,
      name,
      email,
      emailVerified: true,
      role: 'owner',
      createdAt: now,
      updatedAt: now,
    })

    // Insert Better Auth credential account record
    await db.insert(schema.account).values({
      id: accountId,
      accountId: userId,
      providerId: 'credential',
      userId,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    })

    console.log('\n========================================')
    console.log('✨ Owner account created successfully!')
    console.log(`Target   : ${targetDescription}`)
    console.log(`Name     : ${name}`)
    console.log(`Email    : ${email}`)
    console.log(`Role     : owner`)
    console.log('========================================')
    console.log('You can now log in at /login with these credentials.\n')
  } finally {
    rl.close()
  }
}

function readEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is required for remote D1 execution.`)
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

main().catch((err) => {
  console.error('\n❌ Failed to create owner:', err instanceof Error ? err.message : err)
  process.exit(1)
})
