import { desc, eq, like, or } from 'drizzle-orm'

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

export async function listMediaRecords(
  db: Database,
  options: { search?: string; limit?: number } = {},
): Promise<MediaRecord[]> {
  const { search, limit = 50 } = options

  if (search && search.trim() !== '') {
    const pattern = `%${search.trim()}%`
    return db
      .select()
      .from(media)
      .where(or(like(media.filename, pattern), like(media.alt, pattern)))
      .orderBy(desc(media.createdAt))
      .limit(limit)
      .all()
  }

  return db
    .select()
    .from(media)
    .orderBy(desc(media.createdAt))
    .limit(limit)
    .all()
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
