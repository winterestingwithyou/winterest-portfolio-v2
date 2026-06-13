import { and, desc, eq, inArray, or } from 'drizzle-orm'

import type { Database } from '#/db'
import {
  contentLocales,
  labEntries,
  labEntryTranslations,
  writing,
  writingTranslations,
} from '#/db/schema'
import type { ContentLocale } from '#/db/schema'

import type { LabEntryInput, WritingInput } from './validation'

export type WritingRecord = typeof writing.$inferSelect
export type LabEntryRecord = typeof labEntries.$inferSelect
export type WritingTranslationRecord = typeof writingTranslations.$inferSelect
export type LabEntryTranslationRecord = typeof labEntryTranslations.$inferSelect

export type ContentTranslationValue = {
  title: string
  summary: string
  content?: string | null
  tags: string[]
}

export type DashboardContentRecord = {
  id: string
  slug: string
  title: string
  summary: string
  content?: string | null
  status: 'draft' | 'published' | 'archived'
  visibility: 'public' | 'private'
  tags: string[]
  coverImage?: string | null
  demoUrl?: string | null
  repoUrl?: string | null
  translations: Record<ContentLocale, ContentTranslationValue>
  availableLocales: ContentLocale[]
}

export type PublicContentRecord = {
  id: string
  locale: ContentLocale
  slug: string
  title: string
  summary: string
  content?: string | null
  status: string
  visibility: string
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
  translation: WritingTranslationRecord,
): PublicContentRecord {
  return {
    id: record.id,
    locale: translation.locale,
    slug: record.slug,
    title: translation.title,
    summary: translation.summary,
    content: translation.content,
    status: record.status,
    visibility: record.visibility,
    tags: parseTags(translation.tags),
    coverImage: record.coverImage,
  }
}

export function toPublicLabRecord(
  record: LabEntryRecord,
  translation: LabEntryTranslationRecord,
): PublicContentRecord {
  return {
    id: record.id,
    locale: translation.locale,
    slug: record.slug,
    title: translation.title,
    summary: translation.summary,
    content: translation.content,
    status: record.status,
    visibility: record.visibility,
    tags: parseTags(translation.tags),
    coverImage: record.coverImage,
    demoUrl: record.demoUrl,
    repoUrl: record.repoUrl,
  }
}

export async function listWriting(db: Database) {
  const records = await db
    .select()
    .from(writing)
    .orderBy(desc(writing.updatedAt))
    .all()
  const translations = await listWritingTranslations(
    db,
    records.map((record) => record.id),
  )

  return records.map((record) =>
    toDashboardWritingRecord(record, translations.get(record.id)),
  )
}

export async function listPublishedWriting(
  db: Database,
  locale: ContentLocale,
) {
  const records = await db
    .select()
    .from(writing)
    .where(
      and(eq(writing.status, 'published'), eq(writing.visibility, 'public')),
    )
    .orderBy(desc(writing.publishedAt), desc(writing.updatedAt))
    .all()
  const translations = await listWritingTranslations(
    db,
    records.map((record) => record.id),
  )

  return records
    .map((record) => ({
      record,
      translation: pickTranslation(translations.get(record.id), locale),
    }))
    .filter(
      (
        item,
      ): item is {
        record: WritingRecord
        translation: WritingTranslationRecord
      } => Boolean(item.translation),
    )
}

export async function getWritingByIdOrSlug(db: Database, idOrSlug: string) {
  return db
    .select()
    .from(writing)
    .where(or(eq(writing.id, idOrSlug), eq(writing.slug, idOrSlug)))
    .get()
}

export async function getDashboardWritingByIdOrSlug(
  db: Database,
  idOrSlug: string,
) {
  const record = await getWritingByIdOrSlug(db, idOrSlug)
  if (!record) {
    return null
  }

  const translations = await listWritingTranslations(db, [record.id])
  return toDashboardWritingRecord(record, translations.get(record.id))
}

export async function getPublishedWritingBySlug(
  db: Database,
  slug: string,
  locale: ContentLocale,
) {
  const record = await db
    .select()
    .from(writing)
    .where(
      and(
        eq(writing.slug, slug),
        eq(writing.status, 'published'),
        eq(writing.visibility, 'public'),
      ),
    )
    .get()

  if (!record) {
    return null
  }

  const translations = await listWritingTranslations(db, [record.id])
  const translation = pickTranslation(translations.get(record.id), locale)

  return translation ? { record, translation } : null
}

export async function createWriting(db: Database, input: WritingInput) {
  const now = new Date()
  const id = crypto.randomUUID()
  const english = input.translations.en

  await db
    .insert(writing)
    .values({
      id,
      slug: input.slug,
      title: english.title,
      summary: english.summary,
      content: english.content,
      status: input.status,
      visibility: input.visibility,
      coverImage: input.coverImage,
      tags: serializeTags(english.tags),
      publishedAt: input.status === 'published' ? now : null,
      createdAt: now,
      updatedAt: now,
    })
    .run()

  await upsertWritingTranslations(db, id, input.translations, now)

  const record = await getDashboardWritingByIdOrSlug(db, id)
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
  const english = input.translations.en
  const publishedAt = resolvePublishedAt(
    input.status,
    existing.publishedAt,
    now,
  )

  await db
    .update(writing)
    .set({
      slug: input.slug,
      title: english.title,
      summary: english.summary,
      content: english.content,
      status: input.status,
      visibility: input.visibility,
      coverImage: input.coverImage,
      tags: serializeTags(english.tags),
      publishedAt,
      updatedAt: now,
    })
    .where(eq(writing.id, existing.id))
    .run()

  await upsertWritingTranslations(db, existing.id, input.translations, now)

  return getDashboardWritingByIdOrSlug(db, existing.id)
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
  const records = await db
    .select()
    .from(labEntries)
    .orderBy(desc(labEntries.updatedAt))
    .all()
  const translations = await listLabTranslations(
    db,
    records.map((record) => record.id),
  )

  return records.map((record) =>
    toDashboardLabRecord(record, translations.get(record.id)),
  )
}

export async function listPublishedLabEntries(
  db: Database,
  locale: ContentLocale,
) {
  const records = await db
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
  const translations = await listLabTranslations(
    db,
    records.map((record) => record.id),
  )

  return records
    .map((record) => ({
      record,
      translation: pickTranslation(translations.get(record.id), locale),
    }))
    .filter(
      (
        item,
      ): item is {
        record: LabEntryRecord
        translation: LabEntryTranslationRecord
      } => Boolean(item.translation),
    )
}

export async function getLabEntryByIdOrSlug(db: Database, idOrSlug: string) {
  return db
    .select()
    .from(labEntries)
    .where(or(eq(labEntries.id, idOrSlug), eq(labEntries.slug, idOrSlug)))
    .get()
}

export async function getDashboardLabEntryByIdOrSlug(
  db: Database,
  idOrSlug: string,
) {
  const record = await getLabEntryByIdOrSlug(db, idOrSlug)
  if (!record) {
    return null
  }

  const translations = await listLabTranslations(db, [record.id])
  return toDashboardLabRecord(record, translations.get(record.id))
}

export async function getPublishedLabEntryBySlug(
  db: Database,
  slug: string,
  locale: ContentLocale,
) {
  const record = await db
    .select()
    .from(labEntries)
    .where(
      and(
        eq(labEntries.slug, slug),
        eq(labEntries.status, 'published'),
        eq(labEntries.visibility, 'public'),
      ),
    )
    .get()

  if (!record) {
    return null
  }

  const translations = await listLabTranslations(db, [record.id])
  const translation = pickTranslation(translations.get(record.id), locale)

  return translation ? { record, translation } : null
}

export async function createLabEntry(db: Database, input: LabEntryInput) {
  const now = new Date()
  const id = crypto.randomUUID()
  const english = input.translations.en

  await db
    .insert(labEntries)
    .values({
      id,
      slug: input.slug,
      title: english.title,
      summary: english.summary,
      content: english.content,
      status: input.status,
      visibility: input.visibility,
      demoUrl: input.demoUrl,
      repoUrl: input.repoUrl,
      coverImage: input.coverImage,
      tags: serializeTags(english.tags),
      publishedAt: input.status === 'published' ? now : null,
      createdAt: now,
      updatedAt: now,
    })
    .run()

  await upsertLabTranslations(db, id, input.translations, now)

  const record = await getDashboardLabEntryByIdOrSlug(db, id)
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
  const english = input.translations.en
  const publishedAt = resolvePublishedAt(
    input.status,
    existing.publishedAt,
    now,
  )

  await db
    .update(labEntries)
    .set({
      slug: input.slug,
      title: english.title,
      summary: english.summary,
      content: english.content,
      status: input.status,
      visibility: input.visibility,
      demoUrl: input.demoUrl,
      repoUrl: input.repoUrl,
      coverImage: input.coverImage,
      tags: serializeTags(english.tags),
      publishedAt,
      updatedAt: now,
    })
    .where(eq(labEntries.id, existing.id))
    .run()

  await upsertLabTranslations(db, existing.id, input.translations, now)

  return getDashboardLabEntryByIdOrSlug(db, existing.id)
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

async function listWritingTranslations(
  db: Database,
  writingIds: readonly string[],
) {
  if (writingIds.length === 0) {
    return new Map<string, WritingTranslationRecord[]>()
  }

  const rows = await db
    .select()
    .from(writingTranslations)
    .where(inArray(writingTranslations.writingId, [...writingIds]))
    .all()

  return rows.reduce((map, row) => {
    const existing = map.get(row.writingId) ?? []
    existing.push(row)
    map.set(row.writingId, existing)
    return map
  }, new Map<string, WritingTranslationRecord[]>())
}

async function listLabTranslations(
  db: Database,
  labEntryIds: readonly string[],
) {
  if (labEntryIds.length === 0) {
    return new Map<string, LabEntryTranslationRecord[]>()
  }

  const rows = await db
    .select()
    .from(labEntryTranslations)
    .where(inArray(labEntryTranslations.labEntryId, [...labEntryIds]))
    .all()

  return rows.reduce((map, row) => {
    const existing = map.get(row.labEntryId) ?? []
    existing.push(row)
    map.set(row.labEntryId, existing)
    return map
  }, new Map<string, LabEntryTranslationRecord[]>())
}

function pickTranslation<T extends { locale: ContentLocale }>(
  translations: readonly T[] | undefined,
  locale: ContentLocale,
) {
  return (
    translations?.find((translation) => translation.locale === locale) ??
    translations?.find((translation) => translation.locale === 'en') ??
    null
  )
}

function toDashboardWritingRecord(
  record: WritingRecord,
  translations: readonly WritingTranslationRecord[] = [],
): DashboardContentRecord {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    summary: record.summary,
    content: record.content,
    status: record.status,
    visibility: record.visibility,
    tags: parseTags(record.tags),
    coverImage: record.coverImage,
    translations: toContentTranslationMap(translations),
    availableLocales: translations.map((translation) => translation.locale),
  }
}

function toDashboardLabRecord(
  record: LabEntryRecord,
  translations: readonly LabEntryTranslationRecord[] = [],
): DashboardContentRecord {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    summary: record.summary,
    content: record.content,
    status: record.status,
    visibility: record.visibility,
    tags: parseTags(record.tags),
    coverImage: record.coverImage,
    demoUrl: record.demoUrl,
    repoUrl: record.repoUrl,
    translations: toContentTranslationMap(translations),
    availableLocales: translations.map((translation) => translation.locale),
  }
}

function toContentTranslationMap(
  translations: readonly (
    | WritingTranslationRecord
    | LabEntryTranslationRecord
  )[],
) {
  const translationMap = new Map(
    translations.map((translation) => [translation.locale, translation]),
  )

  return Object.fromEntries(
    contentLocales.map((locale) => {
      const translation = translationMap.get(locale)
      return [
        locale,
        {
          title: translation?.title ?? '',
          summary: translation?.summary ?? '',
          content: translation?.content ?? '',
          tags: parseTags(translation?.tags),
        },
      ]
    }),
  ) as Record<ContentLocale, ContentTranslationValue>
}

async function upsertWritingTranslations(
  db: Database,
  writingId: string,
  translations: WritingInput['translations'],
  now: Date,
) {
  for (const locale of contentLocales) {
    const translation = translations[locale]
    await db
      .insert(writingTranslations)
      .values({
        writingId,
        locale,
        title: translation.title,
        summary: translation.summary,
        content: translation.content,
        tags: serializeTags(translation.tags),
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [writingTranslations.writingId, writingTranslations.locale],
        set: {
          title: translation.title,
          summary: translation.summary,
          content: translation.content,
          tags: serializeTags(translation.tags),
          updatedAt: now,
        },
      })
      .run()
  }
}

async function upsertLabTranslations(
  db: Database,
  labEntryId: string,
  translations: LabEntryInput['translations'],
  now: Date,
) {
  for (const locale of contentLocales) {
    const translation = translations[locale]
    await db
      .insert(labEntryTranslations)
      .values({
        labEntryId,
        locale,
        title: translation.title,
        summary: translation.summary,
        content: translation.content,
        tags: serializeTags(translation.tags),
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [labEntryTranslations.labEntryId, labEntryTranslations.locale],
        set: {
          title: translation.title,
          summary: translation.summary,
          content: translation.content,
          tags: serializeTags(translation.tags),
          updatedAt: now,
        },
      })
      .run()
  }
}
