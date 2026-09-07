import { and, count, desc, eq, like, notLike, or } from 'drizzle-orm'

import type { Database } from '#/db'
import { media } from '#/db/schema'

export type MediaRecord = typeof media.$inferSelect

export type CreateMediaInput = {
  id?: string
  filename: string
  url: string
  mimeType: string
  size: number
  width?: number | null
  height?: number | null
  alt?: string | null
}

export type MediaPaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type PaginatedMediaResult = {
  data: MediaRecord[]
  pagination: MediaPaginationMeta
}

export async function listMediaRecords(
  db: Database,
  options: {
    search?: string
    type?: 'all' | 'image' | 'document'
    page?: number
    limit?: number
  } = {},
): Promise<PaginatedMediaResult> {
  const { search, type = 'all', page = 1, limit = 12 } = options

  const conditions = []

  if (search && search.trim() !== '') {
    const pattern = `%${search.trim()}%`
    conditions.push(or(like(media.filename, pattern), like(media.alt, pattern)))
  }

  if (type === 'image') {
    conditions.push(like(media.mimeType, 'image/%'))
  } else if (type === 'document') {
    conditions.push(notLike(media.mimeType, 'image/%'))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const [countResult] = await db
    .select({ total: count() })
    .from(media)
    .where(whereClause)

  const total = countResult.total
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const offset = Math.max(0, (page - 1) * limit)

  const data = await db
    .select()
    .from(media)
    .where(whereClause)
    .orderBy(desc(media.createdAt))
    .limit(limit)
    .offset(offset)
    .all()

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  }
}

export async function getMediaRecordById(
  db: Database,
  id: string,
): Promise<MediaRecord | null> {
  const result = await db.select().from(media).where(eq(media.id, id)).get()
  return result ?? null
}

export async function createMediaRecord(
  db: Database,
  input: CreateMediaInput,
): Promise<MediaRecord> {
  const id = input.id ?? crypto.randomUUID()
  const now = new Date()

  const [record] = await db
    .insert(media)
    .values({
      id,
      filename: input.filename,
      url: input.url,
      mimeType: input.mimeType,
      size: input.size,
      width: input.width ?? null,
      height: input.height ?? null,
      alt: input.alt ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  return record
}

export async function deleteMediaRecord(
  db: Database,
  id: string,
): Promise<boolean> {
  const existing = await getMediaRecordById(db, id)
  if (!existing) return false

  await db.delete(media).where(eq(media.id, id)).run()
  return true
}
