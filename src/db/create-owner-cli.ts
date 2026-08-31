import { stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline/promises'

import { config } from 'dotenv'
import BetterSqliteDatabase from 'better-sqlite3'
import { eq } from 'drizzle-orm'
import { drizzle as drizzleBetterSqlite } from 'drizzle-orm/better-sqlite3'

import { hashPassword } from '../lib/auth/password'
import {
  createRemoteD1Database,
  findLocalD1Database,
  readEnv,
} from './cli-utils'
import type { Database } from './index'
import * as schema from './schema'

config({ path: ['.env.local', '.env'] })

const target = process.argv[2] ?? 'local'

if (target !== 'local' && target !== 'remote') {
  console.error(
    'Usage: bun run create-owner:local or bun run create-owner:remote',
  )
  process.exit(1)
}

async function main() {
  console.log(`\n========================================`)
  console.log(
    `🚀 Winterest Portfolio - Create Owner Account (${target.toUpperCase()})`,
  )
  console.log(`========================================\n`)

  if (target === 'local') {
    await handleLocal()
  } else {
    await handleRemote()
  }
}

async function handleLocal() {
  const localDbPath = findLocalD1Database()

  if (!localDbPath) {
    throw new Error(
      'Local D1 database was not found. Please run local D1 migrations first (e.g. bun run db:migrate:local).',
    )
  }

  const sqlite = new BetterSqliteDatabase(localDbPath)
  const db = drizzleBetterSqlite(sqlite, { schema })

  try {
    await checkAndPromptOwner(
      db as unknown as Database,
      `Local D1 (${localDbPath})`,
    )
  } finally {
    sqlite.close()
  }
}

async function handleRemote() {
  const databaseId = readEnv('CLOUDFLARE_D1_DATABASE_ID')
  const db = createRemoteD1Database()

  await checkAndPromptOwner(db, `Remote D1 (${databaseId})`)
}

function promptPassword(promptText: string): Promise<string> {
  return new Promise((resolve) => {
    output.write(promptText)

    const isRaw = input.isRaw
    if (input.isTTY) {
      input.setRawMode(true)
    }
    input.resume()

    let password = ''

    const onData = (chunk: Buffer) => {
      const str = chunk.toString('utf-8')

      for (const char of str) {
        switch (char) {
          case '\r':
          case '\n':
            cleanup()
            output.write('\n')
            resolve(password)
            return
          case '\u0003':
            // Ctrl+C
            cleanup()
            output.write('\n')
            process.exit(130)
            return
          case '\u0004':
            // Ctrl+D
            cleanup()
            output.write('\n')
            resolve(password)
            return
          case '\u0008':
          case '\x7f':
            // Backspace / Delete
            if (password.length > 0) {
              password = password.slice(0, -1)
              output.write('\b \b')
            }
            break
          default:
            if (char.charCodeAt(0) >= 32) {
              password += char
              output.write('*')
            }
            break
        }
      }
    }

    const cleanup = () => {
      input.removeListener('data', onData)
      if (input.isTTY) {
        input.setRawMode(Boolean(isRaw))
      }
      input.pause()
    }

    input.on('data', onData)
  })
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
    console.error(
      `\n❌ Error: An owner account already exists in this database:`,
    )
    console.error(`   Name : ${existingOwners[0].name}`)
    console.error(`   Email: ${existingOwners[0].email}`)
    console.error(
      `\nOnly 1 owner account is permitted in the Winterest portfolio.\n`,
    )
    process.exit(1)
  }

  const rl = createInterface({ input, output })

  let name = 'Winterest'
  let email = ''

  try {
    // 1. Name
    const nameInput = await rl.question(
      'Enter Owner Name [default: Winterest]: ',
    )
    name = nameInput.trim() || 'Winterest'

    // 2. Email
    while (!email) {
      const emailInput = await rl.question('Enter Owner Email: ')
      const trimmed = emailInput.trim().toLowerCase()
      if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        console.log(
          '⚠️  Please enter a valid email address (e.g. you@example.com).',
        )
        continue
      }

      // Check if email already registered
      const existingUser = await db
        .select({ id: schema.user.id })
        .from(schema.user)
        .where(eq(schema.user.email, trimmed))
        .get()

      if (existingUser) {
        console.log(
          `⚠️  The email "${trimmed}" is already registered. Please choose another email.`,
        )
        continue
      }

      email = trimmed
    }
  } finally {
    rl.close()
  }

  // 3. Password with masked asterisk input and confirmation
  let password = ''
  while (!password) {
    const passInput = await promptPassword(
      'Enter Owner Password (minimum 8 characters): ',
    )
    if (!passInput || passInput.length < 8) {
      console.log('⚠️  Password must be at least 8 characters long.')
      continue
    }

    const confirmInput = await promptPassword('Confirm Owner Password: ')
    if (passInput !== confirmInput) {
      console.log('⚠️  Passwords do not match. Please try again.\n')
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
}

main().catch((err) => {
  console.error(
    '\n❌ Failed to create owner:',
    err instanceof Error ? err.message : err,
  )
  process.exit(1)
})
