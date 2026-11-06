import { asc, desc, eq, inArray } from 'drizzle-orm'
import { ZodError } from 'zod'

import type { Database } from '#/db'
import { certificates, media } from '#/db/schema'
import { getAssetType, MAX_FILE_SIZE_BYTES } from '#/features/media/validation'

import type { CertificateFormValidationCopy } from './copy'
import type { CertificateInput } from './validation'

export type CertificateRecord = typeof certificates.$inferSelect

type CertificateMediaInput = Pick<CertificateInput, 'coverImageUrl' | 'pdfUrl'>

async function validateCertificateMedia(
  db: Database,
  input: CertificateMediaInput,
  messages: CertificateFormValidationCopy,
) {
  const references = [
    { field: 'coverImageUrl', url: input.coverImageUrl, type: 'image' },
    { field: 'pdfUrl', url: input.pdfUrl, type: 'document' },
  ] as const
  const urls = references.flatMap(({ url }) => (url ? [url] : []))
  if (urls.length === 0) return

  const assets = await db
    .select({ url: media.url, mimeType: media.mimeType, size: media.size })
    .from(media)
    .where(inArray(media.url, urls))
    .all()

  for (const reference of references) {
    if (!reference.url) continue
    const asset = assets.find(({ url }) => url === reference.url)
    if (!asset || getAssetType(asset.mimeType) !== reference.type) {
      throw new ZodError([
        {
          code: 'custom',
          path: [reference.field],
          message: messages.unsupportedMedia,
        },
      ])
    }
    if (asset.size > MAX_FILE_SIZE_BYTES) {
      throw new ZodError([
        {
          code: 'custom',
          path: [reference.field],
          message: messages.mediaTooLarge,
        },
      ])
    }
  }
}

export async function listCertificates(db: Database) {
  return db
    .select()
    .from(certificates)
    .orderBy(desc(certificates.updatedAt), asc(certificates.id))
    .all()
}

export async function listPublishedCertificates(db: Database, limit?: number) {
  const query = db
    .select()
    .from(certificates)
    .where(eq(certificates.status, 'published'))
    .orderBy(desc(certificates.issuedAt), asc(certificates.id))

  return limit === undefined ? query.all() : query.limit(limit).all()
}

export async function getCertificateById(db: Database, id: string) {
  return db.select().from(certificates).where(eq(certificates.id, id)).get()
}

export async function createCertificate(
  db: Database,
  input: CertificateInput,
  messages: CertificateFormValidationCopy,
) {
  await validateCertificateMedia(db, input, messages)
  const now = new Date()
  const id = crypto.randomUUID()

  await db
    .insert(certificates)
    .values({
      id,
      title: input.title,
      issuer: input.issuer,
      credentialId: input.credentialId,
      descriptionEn: input.descriptionEn,
      descriptionId: input.descriptionId,
      coverImageUrl: input.coverImageUrl,
      pdfUrl: input.pdfUrl,
      verificationUrl: input.verificationUrl,
      status: input.status,
      issuedAt: input.issuedAt,
      expiresAt: input.expiresAt,
      createdAt: now,
      updatedAt: now,
    })
    .run()

  const created = await getCertificateById(db, id)
  if (!created) {
    throw new Error('Certificate was created but could not be loaded.')
  }
  return created
}

export async function updateCertificate(
  db: Database,
  id: string,
  input: CertificateInput,
  messages: CertificateFormValidationCopy,
) {
  const existing = await getCertificateById(db, id)
  if (!existing) return null

  await validateCertificateMedia(db, input, messages)

  await db
    .update(certificates)
    .set({
      title: input.title,
      issuer: input.issuer,
      credentialId: input.credentialId,
      descriptionEn: input.descriptionEn,
      descriptionId: input.descriptionId,
      coverImageUrl: input.coverImageUrl,
      pdfUrl: input.pdfUrl,
      verificationUrl: input.verificationUrl,
      status: input.status,
      issuedAt: input.issuedAt,
      expiresAt: input.expiresAt,
      updatedAt: new Date(),
    })
    .where(eq(certificates.id, id))
    .run()

  return getCertificateById(db, id)
}

export async function deleteCertificate(db: Database, id: string) {
  const existing = await getCertificateById(db, id)
  if (!existing) return false

  await db.delete(certificates).where(eq(certificates.id, id)).run()
  return true
}
