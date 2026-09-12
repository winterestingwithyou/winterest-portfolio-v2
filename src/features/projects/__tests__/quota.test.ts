import BetterSqliteDatabase from 'better-sqlite3'
import { drizzle as drizzleBetterSqlite } from 'drizzle-orm/better-sqlite3'
import { beforeEach, describe, expect, it } from 'vitest'

import type { Database } from '#/db'
import * as schema from '#/db/schema'
import { handleApiError } from '#/lib/api-response'
import {
  countFeaturedProjects,
  createProject,
  FEATURED_PROJECTS_QUOTA_ERROR,
  MAX_FEATURED_PROJECTS,
  updateProject,
} from '../queries'
import type { ProjectInput } from '../validation'

function createTestDatabase(): Database {
  const sqlite = new BetterSqliteDatabase(':memory:')

  sqlite.exec(`
    CREATE TABLE projects (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
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

    CREATE TABLE project_technologies (
      project_id TEXT NOT NULL,
      technology_id TEXT NOT NULL,
      PRIMARY KEY (project_id, technology_id)
    );
  `)

  return drizzleBetterSqlite(sqlite, { schema }) as unknown as Database
}

function makeProjectInput(
  slug: string,
  featured: boolean,
  overrides: Partial<ProjectInput> = {},
): ProjectInput {
  return {
    slug,
    status: 'published',
    visibility: 'public',
    repoVisibility: 'public',
    featured,
    technologyIds: [],
    translations: {
      en: {
        title: `Title ${slug}`,
        summary: `Summary ${slug}`,
        category: 'App',
      },
      id: {
        title: `Judul ${slug}`,
        summary: `Ringkasan ${slug}`,
        category: 'Aplikasi',
      },
    },
    ...overrides,
  }
}

describe('Featured Projects Quota (Max 4)', () => {
  let db: Database

  beforeEach(() => {
    db = createTestDatabase()
  })

  describe('countFeaturedProjects helper', () => {
    it('returns 0 when no projects are featured', async () => {
      expect(await countFeaturedProjects(db)).toBe(0)
    })

    it('returns the accurate count of featured projects', async () => {
      await createProject(db, makeProjectInput('proj-1', true))
      await createProject(db, makeProjectInput('proj-2', true))
      await createProject(db, makeProjectInput('proj-3', false))

      expect(await countFeaturedProjects(db)).toBe(2)
    })

    it('excludes specified project ID when excludeProjectId is provided', async () => {
      const p1 = await createProject(db, makeProjectInput('proj-1', true))
      await createProject(db, makeProjectInput('proj-2', true))

      expect(await countFeaturedProjects(db, p1.id)).toBe(1)
    })
  })

  describe('createProject quota enforcement', () => {
    it('allows creating up to 4 featured projects', async () => {
      for (let i = 1; i <= MAX_FEATURED_PROJECTS; i++) {
        const created = await createProject(
          db,
          makeProjectInput(`featured-${i}`, true),
        )
        expect(created.featured).toBe(true)
      }

      expect(await countFeaturedProjects(db)).toBe(4)
    })

    it('rejects creating a 5th featured project with quota error', async () => {
      for (let i = 1; i <= 4; i++) {
        await createProject(db, makeProjectInput(`featured-${i}`, true))
      }

      await expect(
        createProject(db, makeProjectInput('featured-5', true)),
      ).rejects.toThrow(FEATURED_PROJECTS_QUOTA_ERROR)

      expect(await countFeaturedProjects(db)).toBe(4)
    })

    it('allows creating an unfeatured project when quota 4/4 is reached', async () => {
      for (let i = 1; i <= 4; i++) {
        await createProject(db, makeProjectInput(`featured-${i}`, true))
      }

      const nonFeatured = await createProject(
        db,
        makeProjectInput('standard-5', false),
      )
      expect(nonFeatured.featured).toBe(false)
      expect(await countFeaturedProjects(db)).toBe(4)
    })
  })

  describe('updateProject quota enforcement', () => {
    it('rejects toggling non-featured project to featured when quota is full', async () => {
      for (let i = 1; i <= 4; i++) {
        await createProject(db, makeProjectInput(`featured-${i}`, true))
      }
      const p5 = await createProject(db, makeProjectInput('standard-5', false))

      await expect(
        updateProject(db, p5.id, makeProjectInput('standard-5', true)),
      ).rejects.toThrow(FEATURED_PROJECTS_QUOTA_ERROR)
    })

    it('allows updating other attributes of an existing featured project when quota is full', async () => {
      const projects = []
      for (let i = 1; i <= 4; i++) {
        projects.push(
          await createProject(db, makeProjectInput(`featured-${i}`, true)),
        )
      }

      const p1 = projects[0]
      const updated = await updateProject(
        db,
        p1.id,
        makeProjectInput('featured-1', true, {
          translations: {
            en: {
              title: 'Updated English Title',
              summary: 'Updated Summary',
              category: 'Updated Category',
            },
            id: {
              title: 'Judul Diperbarui',
              summary: 'Ringkasan Diperbarui',
              category: 'Kategori Diperbarui',
            },
          },
        }),
      )

      expect(updated).not.toBeNull()
      expect(updated?.title).toBe('Updated English Title')
      expect(updated?.featured).toBe(true)
    })

    it('allows unfeaturing a project to free up a quota slot', async () => {
      const projects = []
      for (let i = 1; i <= 4; i++) {
        projects.push(
          await createProject(db, makeProjectInput(`featured-${i}`, true)),
        )
      }

      const p1 = projects[0]
      const unfeatured = await updateProject(
        db,
        p1.id,
        makeProjectInput('featured-1', false),
      )
      expect(unfeatured?.featured).toBe(false)
      expect(await countFeaturedProjects(db)).toBe(3)

      // Now a 5th project can be featured since count is 3
      const p5 = await createProject(db, makeProjectInput('featured-5', true))
      expect(p5.featured).toBe(true)
      expect(await countFeaturedProjects(db)).toBe(4)
    })
  })

  describe('API error handling', () => {
    async function getJson<T>(res: Response): Promise<T> {
      return await res.json()
    }

    it('maps FEATURED_PROJECTS_QUOTA_ERROR to HTTP 400 with descriptive JSON error', async () => {
      const error = new Error(FEATURED_PROJECTS_QUOTA_ERROR)
      const res = handleApiError(error)

      expect(res.status).toBe(400)
      const body = await getJson<{ error: string }>(res)
      expect(body.error).toBe(FEATURED_PROJECTS_QUOTA_ERROR)
    })
  })
})
