import { and, desc, eq, or } from 'drizzle-orm'

import type { Database } from '#/db'
import { labEntries, writing } from '#/db/schema'

import type { LabEntryInput, WritingInput } from './validation'

export type WritingRecord = typeof writing.$inferSelect
export type LabEntryRecord = typeof labEntries.$inferSelect

export type PublicContentRecord = {
  id: string
  slug: string
  title: string
  summary: string
  content?: string | null
  status: string
  tags: string[]
  coverImage?: string | null
  demoUrl?: string | null
  repoUrl?: string | null
}

export function parseTags(value: string | null | undefined): string[] {
  if (!value) {
    return []
  }

  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.filter((tag): tag is string => typeof tag === 'string')
    }
  } catch {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  return []
}

export function serializeTags(tags: readonly string[]): string {
  return JSON.stringify(
    [...new Set(tags.map((tag) => tag.trim()))].filter(Boolean),
  )
}

export function toPublicWritingRecord(
  record: WritingRecord,
): PublicContentRecord {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    summary: record.summary,
    content: record.content,
    status: record.status,
    tags: parseTags(record.tags),
    coverImage: record.coverImage,
  }
}

export function toPublicLabRecord(record: LabEntryRecord): PublicContentRecord {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    summary: record.summary,
    content: record.content,
    status: record.status,
    tags: parseTags(record.tags),
    coverImage: record.coverImage,
    demoUrl: record.demoUrl,
    repoUrl: record.repoUrl,
  }
}

export async function listWriting(db: Database) {
  return db.select().from(writing).orderBy(desc(writing.updatedAt)).all()
}

export async function listPublishedWriting(db: Database) {
  return db
    .select()
    .from(writing)
    .where(
      and(eq(writing.status, 'published'), eq(writing.visibility, 'public')),
    )
    .orderBy(desc(writing.publishedAt), desc(writing.updatedAt))
    .all()
}

export async function getWritingByIdOrSlug(db: Database, idOrSlug: string) {
  return db
    .select()
    .from(writing)
    .where(or(eq(writing.id, idOrSlug), eq(writing.slug, idOrSlug)))
    .get()
}

export async function createWriting(db: Database, input: WritingInput) {
  const now = new Date()
  const id = crypto.randomUUID()

  await db
    .insert(writing)
    .values({
      ...input,
      id,
      tags: serializeTags(input.tags),
      publishedAt: input.status === 'published' ? now : null,
      createdAt: now,
      updatedAt: now,
    })
    .run()

  const record = await getWritingByIdOrSlug(db, id)
  if (!record) {
    throw new Error('Writing entry was created but could not be loaded.')
  }

  return record
}

export async function updateWriting(
  db: Database,
  idOrSlug: string,
  input: WritingInput,
) {
  const existing = await getWritingByIdOrSlug(db, idOrSlug)
  if (!existing) {
    return null
  }

  const now = new Date()
  const publishedAt = resolvePublishedAt(
    input.status,
    existing.publishedAt,
    now,
  )

  await db
    .update(writing)
    .set({
      ...input,
      tags: serializeTags(input.tags),
      publishedAt,
      updatedAt: now,
    })
    .where(eq(writing.id, existing.id))
    .run()

  return getWritingByIdOrSlug(db, existing.id)
}

export async function deleteWriting(db: Database, idOrSlug: string) {
  const existing = await getWritingByIdOrSlug(db, idOrSlug)
  if (!existing) {
    return false
  }

  await db.delete(writing).where(eq(writing.id, existing.id)).run()
  return true
}

export async function listLabEntries(db: Database) {
  return db.select().from(labEntries).orderBy(desc(labEntries.updatedAt)).all()
}

export async function listPublishedLabEntries(db: Database) {
  return db
    .select()
    .from(labEntries)
    .where(
      and(
        eq(labEntries.status, 'published'),
        eq(labEntries.visibility, 'public'),
      ),
    )
    .orderBy(desc(labEntries.publishedAt), desc(labEntries.updatedAt))
    .all()
}

export async function getLabEntryByIdOrSlug(db: Database, idOrSlug: string) {
  return db
    .select()
    .from(labEntries)
    .where(or(eq(labEntries.id, idOrSlug), eq(labEntries.slug, idOrSlug)))
    .get()
}

export async function createLabEntry(db: Database, input: LabEntryInput) {
  const now = new Date()
  const id = crypto.randomUUID()

  await db
    .insert(labEntries)
    .values({
      ...input,
      id,
      tags: serializeTags(input.tags),
      publishedAt: input.status === 'published' ? now : null,
      createdAt: now,
      updatedAt: now,
    })
    .run()

  const record = await getLabEntryByIdOrSlug(db, id)
  if (!record) {
    throw new Error('Lab entry was created but could not be loaded.')
  }

  return record
}

export async function updateLabEntry(
  db: Database,
  idOrSlug: string,
  input: LabEntryInput,
) {
  const existing = await getLabEntryByIdOrSlug(db, idOrSlug)
  if (!existing) {
    return null
  }

  const now = new Date()
  const publishedAt = resolvePublishedAt(
    input.status,
    existing.publishedAt,
    now,
  )

  await db
    .update(labEntries)
    .set({
      ...input,
      tags: serializeTags(input.tags),
      publishedAt,
      updatedAt: now,
    })
    .where(eq(labEntries.id, existing.id))
    .run()

  return getLabEntryByIdOrSlug(db, existing.id)
}

export async function deleteLabEntry(db: Database, idOrSlug: string) {
  const existing = await getLabEntryByIdOrSlug(db, idOrSlug)
  if (!existing) {
    return false
  }

  await db.delete(labEntries).where(eq(labEntries.id, existing.id)).run()
  return true
}

function resolvePublishedAt(
  status: 'draft' | 'published' | 'archived',
  existingPublishedAt: Date | null,
  now: Date,
) {
  if (status !== 'published') {
    return null
  }

  return existingPublishedAt ?? now
}
