import {
  cancel,
  confirm,
  intro,
  isCancel,
  log,
  multiselect,
  note,
  outro,
  select,
  spinner,
} from '@clack/prompts'
import BetterSqliteDatabase from 'better-sqlite3'
import { config } from 'dotenv'
import { drizzle as drizzleBetterSqlite } from 'drizzle-orm/better-sqlite3'

import {
  createRemoteD1Database,
  findLocalD1Database,
  readEnv,
} from './cli-utils'
import type { Database } from './index'
import * as schema from './schema'
import { seedPortfolioData } from './seed'
import type { SeedCollection, SeedResult } from './seed'
import {
  ALL_SEED_COLLECTIONS,
  formatSeedSummary,
  resolveSeedDependencies,
  SEED_COLLECTION_OPTIONS,
} from './seed-helpers'

config({ path: ['.env.local', '.env'] })

type Target = 'local' | 'remote'

async function resolveTarget(): Promise<Target> {
  const argTarget = process.argv
    .slice(2)
    .find((arg) => !arg.startsWith('--'))
    ?.trim()
    .toLowerCase()

  if (argTarget === 'local' || argTarget === 'remote') {
    return argTarget
  }

  if (argTarget) {
    log.error(`Invalid target "${argTarget}". Expected "local" or "remote".`)
    process.exit(1)
  }

  if (!process.stdin.isTTY) {
    return 'local'
  }

  const selectedTarget = await select({
    message: 'Pilih target Cloudflare D1 database:',
    options: [
      {
        value: 'local',
        label: 'Local D1',
        hint: 'Miniflare SQLite local state',
      },
      {
        value: 'remote',
        label: 'Remote D1',
        hint: 'Cloudflare Workers production D1',
      },
    ],
  })

  if (isCancel(selectedTarget)) {
    cancel('Operasi dibatalkan.')
    process.exit(0)
  }

  return selectedTarget
}

async function resolveCollections(): Promise<{
  resolved: SeedCollection[]
  autoAdded: SeedCollection[]
}> {
  const isAllFlag = process.argv.includes('--all')

  if (!process.stdin.isTTY || isAllFlag) {
    return {
      resolved: ALL_SEED_COLLECTIONS,
      autoAdded: [],
    }
  }

  const selected = await multiselect({
    message:
      'Pilih entitas data yang ingin di-seed (Space untuk uncheck, Enter untuk lanjut):',
    options: SEED_COLLECTION_OPTIONS.map((opt) => ({
      value: opt.value,
      label: opt.label,
      hint: opt.hint,
    })),
    initialValues: ALL_SEED_COLLECTIONS,
    required: true,
  })

  if (isCancel(selected)) {
    cancel('Operasi dibatalkan.')
    process.exit(0)
  }

  return resolveSeedDependencies(selected)
}

async function seedLocal(collections: SeedCollection[]): Promise<SeedResult> {
  const localDbPath = findLocalD1Database()

  if (!localDbPath) {
    throw new Error(
      'Local D1 database was not found. Please run local D1 migrations first (e.g. bun run db:migrate:local).',
    )
  }

  const sqlite = new BetterSqliteDatabase(localDbPath)
  const db = drizzleBetterSqlite(sqlite, { schema })

  const result = await seedPortfolioData(db as unknown as Database, {
    collections,
  })
  sqlite.close()

  return result
}

async function seedRemote(collections: SeedCollection[]): Promise<SeedResult> {
  readEnv('CLOUDFLARE_D1_DATABASE_ID', 'seeding')
  const db = createRemoteD1Database()

  return seedPortfolioData(db, { collections })
}

async function main() {
  intro('Winterest Portfolio — Database Seeding CLI')

  const target = await resolveTarget()
  const { resolved, autoAdded } = await resolveCollections()

  if (autoAdded.length > 0) {
    log.info(`Dependensi relasi otomatis disertakan: ${autoAdded.join(', ')}`)
  }

  if (process.stdin.isTTY) {
    note(formatSeedSummary(target, resolved, autoAdded), 'Ringkasan Seeding')

    const confirmed = await confirm({
      message: `Lanjutkan proses seeding ke database ${target.toUpperCase()}?`,
      initialValue: true,
    })

    if (isCancel(confirmed) || !confirmed) {
      cancel('Proses seeding dibatalkan.')
      process.exit(0)
    }
  }

  const s = spinner()
  s.start(`Sedang meng-upsert data ke ${target.toUpperCase()} D1...`)

  try {
    const result =
      target === 'local'
        ? await seedLocal(resolved)
        : await seedRemote(resolved)

    s.stop('Data berhasil di-upsert ke database!')

    const summaryParts: string[] = []
    if (result.categories > 0)
      summaryParts.push(`${result.categories} kategori`)
    if (result.technologies > 0)
      summaryParts.push(`${result.technologies} teknologi`)
    if (result.projects > 0) summaryParts.push(`${result.projects} proyek`)
    if (result.socialLinks > 0)
      summaryParts.push(`${result.socialLinks} tautan sosial`)
    if (result.homeEnthusiasms > 0)
      summaryParts.push(`${result.homeEnthusiasms} fokus area`)

    log.success(`Berhasil meng-seed: ${summaryParts.join(', ') || '0 item'}`)
    outro(`Seeding database ${target.toUpperCase()} selesai dengan sukses!`)
  } catch (error) {
    s.stop('Terjadi kesalahan saat proses seeding.')
    log.error(error instanceof Error ? error.message : 'Unknown seed error.')
    process.exit(1)
  }
}

await main()
