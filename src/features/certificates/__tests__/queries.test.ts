import BetterSqliteDatabase from 'better-sqlite3'

import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { beforeEach, describe, expect, it } from 'vitest'

import type { Database } from '#/db'
import * as schema from '#/db/schema'
import { MAX_FILE_SIZE_BYTES } from '#/features/media/validation'
import { certificatesCopy } from '../copy'
import {
  createCertificate as createCertificateRecord,
  deleteCertificate,
  getCertificateById,
  listPublishedCertificates,
  updateCertificate as updateCertificateRecord,
} from '../queries'
import type { CertificateInput } from '../validation'

function createTestDatabase(): Database {
  const sqlite = new BetterSqliteDatabase(':memory:')

  sqlite.exec(`
    CREATE TABLE certificates (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      issuer TEXT NOT NULL,
      credential_id TEXT,
      description_en TEXT,
      description_id TEXT,
      cover_image_url TEXT,
      pdf_url TEXT,
      verification_url TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      issued_at INTEGER NOT NULL,
      expires_at INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE TABLE media (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      url TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      width INTEGER,
      height INTEGER,
      alt TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE INDEX certificates_status_idx ON certificates (status);
    CREATE INDEX certificates_issued_at_idx ON certificates (issued_at);
  `)

  return drizzle(sqlite, { schema }) as unknown as Database
}

const validationCopy = certificatesCopy.en.dashboard.form.validation

function createCertificate(db: Database, input: CertificateInput) {
  return createCertificateRecord(db, input, validationCopy)
}

function updateCertificate(db: Database, id: string, input: CertificateInput) {
  return updateCertificateRecord(db, id, input, validationCopy)
}

function makeCertificate(
  title: string,
  issuedAt: string,
  status: 'draft' | 'published' = 'published',
): CertificateInput {
  return {
    title,
    issuer: 'Issuer',
    status,
    issuedAt: new Date(issuedAt),
    verificationUrl: `https://issuer.example.test/verify/${encodeURIComponent(title)}`,
  }
}

describe('certificate queries', () => {
  let db: Database

  beforeEach(() => {
    db = createTestDatabase()
  })

  it('lists only published certificates newest first with a stable tie-breaker', async () => {
    const older = await createCertificate(
      db,
      makeCertificate('Older', '2024-01-01T00:00:00.000Z'),
    )
    const sameDateFirst = await createCertificate(
      db,
      makeCertificate('Same date A', '2025-01-01T00:00:00.000Z'),
    )
    const sameDateSecond = await createCertificate(
      db,
      makeCertificate('Same date B', '2025-01-01T00:00:00.000Z'),
    )
    await createCertificate(
      db,
      makeCertificate('Draft', '2026-01-01T00:00:00.000Z', 'draft'),
    )

    const results = await listPublishedCertificates(db)

    expect(results.map(({ id }) => id)).toEqual(
      [sameDateFirst.id, sameDateSecond.id, older.id].sort((a, b) => {
        if (a === older.id) return 1
        if (b === older.id) return -1
        return a.localeCompare(b)
      }),
    )
  })

  it('limits homepage results to the five newest published certificates', async () => {
    for (let day = 1; day <= 7; day += 1) {
      await createCertificate(
        db,
        makeCertificate(
          `Certificate ${day}`,
          `2025-01-${String(day).padStart(2, '0')}T00:00:00.000Z`,
        ),
      )
    }

    const results = await listPublishedCertificates(db, 5)

    expect(results.map(({ title }) => title)).toEqual([
      'Certificate 7',
      'Certificate 6',
      'Certificate 5',
      'Certificate 4',
      'Certificate 3',
    ])
  })

  it('keeps expired published certificates in public results', async () => {
    const expired = await createCertificate(db, {
      ...makeCertificate('Expired', '2020-01-01T00:00:00.000Z'),
      expiresAt: new Date('2021-01-01T00:00:00.000Z'),
    })

    const results = await listPublishedCertificates(db)

    expect(results.map(({ id }) => id)).toContain(expired.id)
  })

  it('accepts certificate PDFs only from the Media Library', async () => {
    const pdfUrl = 'https://media.example.test/certificate.pdf'
    const certificate = {
      ...makeCertificate('PDF certificate', '2025-01-01T00:00:00.000Z'),
      pdfUrl,
      verificationUrl: undefined,
    }

    await expect(createCertificate(db, certificate)).rejects.toMatchObject({
      issues: expect.arrayContaining([
        expect.objectContaining({ path: ['pdfUrl'] }),
      ]),
    })
    const externalCover = {
      ...makeCertificate('Cover certificate', '2025-01-01T00:00:00.000Z'),
      coverImageUrl: 'https://external.example.test/cover.jpg',
    }
    await expect(createCertificate(db, externalCover)).rejects.toMatchObject({
      issues: expect.arrayContaining([
        expect.objectContaining({ path: ['coverImageUrl'] }),
      ]),
    })
    await expect(
      createCertificateRecord(
        db,
        externalCover,
        certificatesCopy.id.dashboard.form.validation,
      ),
    ).rejects.toMatchObject({
      issues: expect.arrayContaining([
        expect.objectContaining({
          path: ['coverImageUrl'],
          message: 'Pilih file yang didukung dari Media Library.',
        }),
      ]),
    })

    await db
      .insert(schema.media)
      .values({
        id: 'media-pdf',
        filename: 'certificate.pdf',
        url: pdfUrl,
        mimeType: 'application/pdf',
        size: 1024,
        width: null,
        height: null,
        alt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .run()

    await db
      .update(schema.media)
      .set({ size: MAX_FILE_SIZE_BYTES + 1 })
      .where(eq(schema.media.id, 'media-pdf'))
      .run()
    await expect(createCertificate(db, certificate)).rejects.toMatchObject({
      issues: expect.arrayContaining([
        expect.objectContaining({ path: ['pdfUrl'] }),
      ]),
    })

    await db
      .update(schema.media)
      .set({ size: 1024 })
      .where(eq(schema.media.id, 'media-pdf'))
      .run()
    await expect(createCertificate(db, certificate)).resolves.toMatchObject({
      pdfUrl,
    })
  })

  it('updates and deletes certificates', async () => {
    const created = await createCertificate(
      db,
      makeCertificate('Original title', '2025-01-01T00:00:00.000Z'),
    )
    const updated = await updateCertificate(
      db,
      created.id,
      makeCertificate('Updated title', '2025-01-01T00:00:00.000Z'),
    )

    expect(updated?.title).toBe('Updated title')
    await expect(deleteCertificate(db, created.id)).resolves.toBe(true)
    await expect(getCertificateById(db, created.id)).resolves.toBeUndefined()
    await expect(deleteCertificate(db, created.id)).resolves.toBe(false)
  })
})
