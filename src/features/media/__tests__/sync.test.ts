import BetterSqliteDatabase from 'better-sqlite3'
import { drizzle as drizzleBetterSqlite } from 'drizzle-orm/better-sqlite3'
import { beforeEach, describe, expect, it } from 'vitest'

import type { Database } from '#/db'
import * as schema from '#/db/schema'
import {
  cascadeNullifyMediaReferences,
  extractR2Key,
  getMediaUsage,
} from '../queries'
import type { MediaRecord } from '../queries'
import {
  mediaDeleteQuerySchema,
  mediaReferenceItemSchema,
  mediaReferenceTypeSchema,
  mediaUsageSummarySchema,
} from '../validation'

function createTestDatabase(): Database {
  const sqlite = new BetterSqliteDatabase(':memory:')

  sqlite.exec(`
    CREATE TABLE media (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      url TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL DEFAULT 0,
      width INTEGER,
      height INTEGER,
      alt TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE projects (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      visibility TEXT NOT NULL DEFAULT 'public',
      repo_visibility TEXT NOT NULL DEFAULT 'public',
      featured INTEGER NOT NULL DEFAULT 0,
      category TEXT NOT NULL DEFAULT 'Project',
      cover_image TEXT,
      repo_url TEXT,
      demo_url TEXT,
      production_url TEXT,
      started_at INTEGER,
      completed_at INTEGER,
      published_at INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE project_translations (
      project_id TEXT NOT NULL,
      locale TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL DEFAULT 'Project',
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
      PRIMARY KEY (project_id, locale)
    );

    CREATE TABLE technologies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      icon TEXT,
      color TEXT,
      url TEXT,
      is_ultimate INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `)

  return drizzleBetterSqlite(sqlite, { schema }) as unknown as Database
}

describe('media deletion synchronization', () => {
  let db: Database

  beforeEach(() => {
    db = createTestDatabase()
  })

  describe('extractR2Key helper', () => {
    it('extracts key from relative R2 streaming path', () => {
      expect(extractR2Key('/api/media/file/hero-mascot.webp')).toBe(
        'hero-mascot.webp',
      )
      expect(extractR2Key('/api/media/file/projects/screenshot.png')).toBe(
        'projects/screenshot.png',
      )
    })

    it('extracts and decodes key from full localhost or production domain URLs', () => {
      expect(
        extractR2Key('http://localhost:3000/api/media/file/banner.webp'),
      ).toBe('banner.webp')
      expect(
        extractR2Key(
          'https://winterest.dev/api/media/file/projects%2Fdemo.png',
        ),
      ).toBe('projects/demo.png')
    })

    it('returns null for external URLs or empty string', () => {
      expect(extractR2Key('https://example.com/external.jpg')).toBeNull()
      expect(extractR2Key('/assets/icons/react.svg')).toBeNull()
      expect(extractR2Key('')).toBeNull()
    })
  })

  describe('getMediaUsage', () => {
    const testMedia: MediaRecord = {
      id: 'med_test_1',
      filename: 'hero-banner.webp',
      url: '/api/media/file/hero-banner.webp',
      mimeType: 'image/webp',
      size: 154000,
      width: 1920,
      height: 1080,
      alt: 'Hero Banner',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('returns inUse: false when media is not referenced anywhere', async () => {
      const usage = await getMediaUsage(db, testMedia)
      expect(usage.inUse).toBe(false)
      expect(usage.totalReferences).toBe(0)
      expect(usage.references).toHaveLength(0)
    })

    it('detects usage in site_settings (exact match and portable URL)', async () => {
      await db.insert(schema.siteSettings).values([
        {
          key: 'heroVisualUrl',
          value: 'https://winterest.dev/api/media/file/hero-banner.webp',
        },
        {
          key: 'faviconUrl',
          value: '/api/media/file/hero-banner.webp',
        },
      ])

      const usage = await getMediaUsage(db, testMedia)
      expect(usage.inUse).toBe(true)
      expect(usage.totalReferences).toBe(2)

      const settingRefs = usage.references.filter(
        (r) => r.entityType === 'site_settings',
      )
      expect(settingRefs).toHaveLength(2)
      expect(settingRefs.map((r) => r.field)).toContain('heroVisualUrl')
      expect(settingRefs.map((r) => r.field)).toContain('faviconUrl')
    })

    it('detects usage in projects coverImage', async () => {
      await db.insert(schema.projects).values({
        id: 'proj_alpha',
        slug: 'project-alpha',
        title: 'Project Alpha',
        summary: 'A summary',
        coverImage: 'http://localhost:3000/api/media/file/hero-banner.webp',
      })

      const usage = await getMediaUsage(db, testMedia)
      expect(usage.inUse).toBe(true)
      const projectRef = usage.references.find(
        (r) => r.entityType === 'project_cover',
      )
      expect(projectRef).toBeDefined()
      expect(projectRef?.id).toBe('proj_alpha')
      expect(projectRef?.label).toBe('Project: Project Alpha')
    })

    it('detects usage in technologies icon', async () => {
      await db.insert(schema.technologies).values({
        id: 'tech_bun',
        name: 'Bun Framework',
        slug: 'bun',
        icon: '/api/media/file/hero-banner.webp',
      })

      const usage = await getMediaUsage(db, testMedia)
      expect(usage.inUse).toBe(true)
      const techRef = usage.references.find(
        (r) => r.entityType === 'technology_icon',
      )
      expect(techRef).toBeDefined()
      expect(techRef?.id).toBe('tech_bun')
      expect(techRef?.label).toBe('Technology: Bun Framework')
    })

    it('detects usage in project_translations description markdown', async () => {
      await db.insert(schema.projects).values({
        id: 'proj_beta',
        slug: 'project-beta',
        title: 'Project Beta',
        summary: 'Summary beta',
      })

      await db.insert(schema.projectTranslations).values({
        projectId: 'proj_beta',
        locale: 'en',
        title: 'Project Beta',
        summary: 'Summary beta',
        description:
          '# Overview\n\n![Screenshot](/api/media/file/hero-banner.webp)\n\nDetailed text.',
      })

      const usage = await getMediaUsage(db, testMedia)
      expect(usage.inUse).toBe(true)
      const contentRef = usage.references.find(
        (r) => r.entityType === 'project_content',
      )
      expect(contentRef).toBeDefined()
      expect(contentRef?.id).toBe('proj_beta:en')
      expect(contentRef?.label).toContain('Project Content: Project Beta (EN)')
    })
  })

  describe('cascadeNullifyMediaReferences', () => {
    const testMedia: MediaRecord = {
      id: 'med_test_cascade',
      filename: 'shared-asset.png',
      url: '/api/media/file/shared-asset.png',
      mimeType: 'image/png',
      size: 80000,
      width: 800,
      height: 600,
      alt: 'Shared',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('nullifies references across site_settings, projects, and technologies', async () => {
      // Setup referencing records
      await db.insert(schema.siteSettings).values({
        key: 'heroVisualUrl',
        value: 'https://winterest.dev/api/media/file/shared-asset.png',
      })

      await db.insert(schema.projects).values({
        id: 'proj_gamma',
        slug: 'project-gamma',
        title: 'Project Gamma',
        summary: 'Gamma summary',
        coverImage: '/api/media/file/shared-asset.png',
      })

      await db.insert(schema.technologies).values({
        id: 'tech_custom',
        name: 'Custom Tool',
        slug: 'custom-tool',
        icon: 'http://localhost:3000/api/media/file/shared-asset.png',
      })

      // Verify usage before cascade
      const usageBefore = await getMediaUsage(db, testMedia)
      expect(usageBefore.totalReferences).toBe(3)

      // Execute cascade nullify
      const clearedCount = await cascadeNullifyMediaReferences(db, testMedia)
      expect(clearedCount).toBe(3)

      // Verify records are nullified/cleared
      const updatedSetting = await db.query.siteSettings.findFirst({
        where: (s, { eq }) => eq(s.key, 'heroVisualUrl'),
      })
      expect(updatedSetting?.value).toBe('')

      const updatedProject = await db.query.projects.findFirst({
        where: (p, { eq }) => eq(p.id, 'proj_gamma'),
      })
      expect(updatedProject?.coverImage).toBeNull()

      const updatedTech = await db.query.technologies.findFirst({
        where: (t, { eq }) => eq(t.id, 'tech_custom'),
      })
      expect(updatedTech?.icon).toBeNull()

      // Re-check usage: should now be clean
      const usageAfter = await getMediaUsage(db, testMedia)
      expect(usageAfter.inUse).toBe(false)
      expect(usageAfter.totalReferences).toBe(0)
    })
  })

  describe('Zod Validation Schemas', () => {
    it('mediaDeleteQuerySchema parses cascade query parameter', () => {
      expect(mediaDeleteQuerySchema.parse({ cascade: 'true' })).toEqual({
        cascade: true,
      })
      expect(mediaDeleteQuerySchema.parse({ cascade: 'false' })).toEqual({
        cascade: false,
      })
      expect(mediaDeleteQuerySchema.parse({})).toEqual({
        cascade: false,
      })
    })

    it('mediaReferenceTypeSchema accepts only valid entity types', () => {
      expect(mediaReferenceTypeSchema.safeParse('site_settings').success).toBe(
        true,
      )
      expect(mediaReferenceTypeSchema.safeParse('project_cover').success).toBe(
        true,
      )
      expect(
        mediaReferenceTypeSchema.safeParse('project_content').success,
      ).toBe(true)
      expect(
        mediaReferenceTypeSchema.safeParse('technology_icon').success,
      ).toBe(true)
      expect(mediaReferenceTypeSchema.safeParse('unknown_entity').success).toBe(
        false,
      )
    })

    it('mediaReferenceItemSchema validates reference objects', () => {
      const valid = {
        entityType: 'site_settings',
        field: 'heroVisualUrl',
        id: 'heroVisualUrl',
        label: 'Site Settings (Hero Visual)',
        details: 'Visual utama',
      }
      expect(mediaReferenceItemSchema.safeParse(valid).success).toBe(true)
    })

    it('mediaUsageSummarySchema validates summary payload', () => {
      const summary = {
        inUse: true,
        totalReferences: 1,
        references: [
          {
            entityType: 'project_cover',
            field: 'coverImage',
            id: 'proj_1',
            label: 'Project 1',
          },
        ],
      }
      expect(mediaUsageSummarySchema.safeParse(summary).success).toBe(true)
    })
  })
})
