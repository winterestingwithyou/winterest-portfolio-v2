import {
  cancel,
  confirm,
  intro,
  isCancel,
  log,
  note,
  outro,
  password,
  select,
  spinner,
  text,
} from '@clack/prompts'
import BetterSqliteDatabase from 'better-sqlite3'
import { config } from 'dotenv'
import { eq } from 'drizzle-orm'
import { drizzle as drizzleBetterSqlite } from 'drizzle-orm/better-sqlite3'

import { hashPassword } from '../lib/auth/password'
import {
  createRemoteD1Database,
  findLocalD1Database,
  readEnv,
} from './cli-utils'
import {
  formatOwnerSummary,
  validateOwnerEmail,
  validateOwnerPassword,
  validatePasswordMatch,
} from './create-owner-helpers'
import type { Database } from './index'
import * as schema from './schema'

config({ path: ['.env.local', '.env'] })

type Target = 'local' | 'remote'

async function resolveTarget(): Promise<Target> {
  const argTarget = process.argv[2]?.trim().toLowerCase()

  if (argTarget === 'local' || argTarget === 'remote') {
    return argTarget
  }

  if (argTarget) {
    log.error(`Invalid target "${argTarget}". Expected "local" or "remote".`)
    process.exit(1)
  }

  const selectedTarget = await select({
    message: 'Select target Cloudflare D1 database:',
    options: [
      {
        value: 'local',
        label: 'Local D1',
        hint: 'Miniflare SQLite local state',
      },
      {
        value: 'remote',
        label: 'Remote D1',
        hint: 'Cloudflare Production database',
      },
    ],
    initialValue: 'local',
  })

  if (isCancel(selectedTarget)) {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  return selectedTarget as Target
}

async function runCreation(db: Database, targetDescription: string) {
  const s = spinner()

  // 1. Check existing owner rule (max 1 owner)
  s.start(`Connecting to ${targetDescription} and checking owner status...`)

  const existingOwners = await db
    .select({
      id: schema.user.id,
      name: schema.user.name,
      email: schema.user.email,
    })
    .from(schema.user)
    .where(eq(schema.user.role, 'owner'))
    .all()

  s.stop('Database connection verified')

  if (existingOwners.length > 0) {
    note(
      [
        `Name  : ${existingOwners[0].name}`,
        `Email : ${existingOwners[0].email}`,
        ``,
        `Only 1 owner account is permitted in the Winterest portfolio platform.`,
        `If you need to regain access, use the password reset flow.`,
      ].join('\n'),
      'Existing Owner Account Found',
    )
    cancel('Owner creation aborted.')
    process.exit(1)
  }

  // 2. Prompt Name
  const nameResult = await text({
    message: 'Enter Owner Name:',
    placeholder: 'Winterest',
    defaultValue: 'Winterest',
  })

  if (isCancel(nameResult)) {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  const name = nameResult.trim() || 'Winterest'

  // 3. Prompt Email with validation and DB uniqueness check
  let email = ''
  while (!email) {
    const emailResult = await text({
      message: 'Enter Owner Email:',
      placeholder: 'owner@winterest.dev',
      validate: validateOwnerEmail,
    })

    if (isCancel(emailResult)) {
      cancel('Operation cancelled.')
      process.exit(0)
    }

    const trimmedEmail = emailResult.trim().toLowerCase()

    const existingUser = await db
      .select({ id: schema.user.id })
      .from(schema.user)
      .where(eq(schema.user.email, trimmedEmail))
      .get()

    if (existingUser) {
      log.error(
        `The email "${trimmedEmail}" is already registered. Please use another email.`,
      )
      continue
    }

    email = trimmedEmail
  }

  // 4. Prompt Password
  const passwordResult = await password({
    message: 'Enter Owner Password (minimum 8 characters):',
    mask: '*',
    validate: validateOwnerPassword,
  })

  if (isCancel(passwordResult)) {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  const ownerPassword = passwordResult

  // 5. Prompt Confirm Password
  const confirmResult = await password({
    message: 'Confirm Owner Password:',
    mask: '*',
    validate: (val) => validatePasswordMatch(ownerPassword, val),
  })

  if (isCancel(confirmResult)) {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  // 6. Review & Final Confirmation
  note(
    formatOwnerSummary({
      target: targetDescription,
      name,
      email,
    }),
    'Account Summary',
  )

  const shouldProceed = await confirm({
    message: 'Create owner account with these details?',
    initialValue: true,
  })

  if (isCancel(shouldProceed) || !shouldProceed) {
    cancel('Owner creation cancelled.')
    process.exit(0)
  }

  // 7. Execute Hashing & Insert
  s.start('Hashing password and writing owner record...')

  const userId = crypto.randomUUID()
  const accountId = crypto.randomUUID()
  const now = new Date()
  const hashedPassword = await hashPassword(ownerPassword)

  await db.insert(schema.user).values({
    id: userId,
    name,
    email,
    emailVerified: true,
    role: 'owner',
    createdAt: now,
    updatedAt: now,
  })

  await db.insert(schema.account).values({
    id: accountId,
    accountId: userId,
    providerId: 'credential',
    userId,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  })

  s.stop('Owner credentials saved')

  // 8. Outro & Success Info
  note(
    [
      `Owner   : ${name} <${email}>`,
      `Target  : ${targetDescription}`,
      `Status  : Active (owner)`,
      ``,
      `You can now log in at /login with these credentials.`,
    ].join('\n'),
    'Account Created Successfully',
  )

  outro('Winterest Portfolio owner setup completed.')
}

async function main() {
  intro('Winterest Portfolio — Create Owner Account')

  const target = await resolveTarget()

  if (target === 'local') {
    const localDbPath = findLocalD1Database()

    if (!localDbPath) {
      log.error(
        'Local D1 database was not found. Please run local D1 migrations first (e.g. bun run db:migrate:local).',
      )
      cancel('Owner creation aborted.')
      process.exit(1)
    }

    const sqlite = new BetterSqliteDatabase(localDbPath)
    const db = drizzleBetterSqlite(sqlite, { schema })

    try {
      await runCreation(db as unknown as Database, `Local D1 (${localDbPath})`)
    } finally {
      sqlite.close()
    }
  } else {
    const databaseId = readEnv('CLOUDFLARE_D1_DATABASE_ID', 'owner creation')
    const db = createRemoteD1Database()

    await runCreation(db, `Remote D1 (${databaseId})`)
  }
}

main().catch((err) => {
  log.error(
    `Failed to create owner: ${err instanceof Error ? err.message : String(err)}`,
  )
  process.exit(1)
})
