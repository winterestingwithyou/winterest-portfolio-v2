import BetterSqliteDatabase from 'better-sqlite3'

import { drizzle } from 'drizzle-orm/better-sqlite3'
import { beforeEach, describe, expect, it } from 'vitest'

import type { Database } from '#/db'
import * as schema from '#/db/schema'
import {
  createProject,
  getPublishedPublicProjectBySlug,
  listPublishedPublicProjects,
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
      cover_image_alt TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
      PRIMARY KEY (project_id, locale)
    );

    CREATE TABLE project_gallery_images (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      url TEXT NOT NULL,
      alt_en TEXT NOT NULL DEFAULT '',
      alt_id TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
      UNIQUE (project_id, url)
    );

    CREATE TABLE project_technologies (
      project_id TEXT NOT NULL,
      technology_id TEXT NOT NULL,
      PRIMARY KEY (project_id, technology_id)
    );

    CREATE TABLE technologies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      color TEXT
    );
  `)

  const database = drizzle(sqlite, { schema })
  return Object.assign(database, {
    batch: (queries: readonly { run: () => unknown }[]) =>
      sqlite.transaction(() => queries.map((query) => query.run()))(),
  }) as unknown as Database
}

function makePublishedProject(): ProjectInput {
  return {
    slug: 'image-gallery-project',
    status: 'published',
    visibility: 'public',
    repoVisibility: 'private',
    featured: false,
    coverImage: 'https://images.example.test/cover.jpg',
    technologyIds: [],
    galleryImages: [
      {
        url: 'https://images.example.test/architecture.jpg',
        alt: {
          en: 'System architecture diagram',
          id: 'Diagram arsitektur sistem',
        },
      },
      {
        url: 'https://images.example.test/dashboard.jpg',
        alt: {
          en: 'Project dashboard',
          id: 'Dasbor proyek',
        },
      },
    ],
    translations: {
      en: {
        title: 'Image Gallery Project',
        summary: 'A project summary in English.',
        category: 'Application',
        coverImageAlt: 'Project cover artwork',
      },
      id: {
        title: 'Proyek Galeri Gambar',
        summary: 'Ringkasan proyek dalam bahasa Indonesia.',
        category: 'Aplikasi',
        coverImageAlt: 'Gambar sampul proyek',
      },
    },
  }
}

describe('public project image data', () => {
  let db: Database

  beforeEach(() => {
    db = createTestDatabase()
  })

  it('keeps galleries out of project listings and returns localized ordered images on detail', async () => {
    await createProject(db, makePublishedProject())

    const [listing] = await listPublishedPublicProjects(db, 'id')
    expect(listing.coverImage).toBe('https://images.example.test/cover.jpg')
    expect(listing.coverImageAlt).toBe('Gambar sampul proyek')
    expect(listing).not.toHaveProperty('galleryImages')

    const detail = await getPublishedPublicProjectBySlug(
      db,
      'image-gallery-project',
      'id',
    )

    expect(detail?.galleryImages).toEqual([
      {
        url: 'https://images.example.test/cover.jpg',
        alt: 'Gambar sampul proyek',
      },
      {
        url: 'https://images.example.test/architecture.jpg',
        alt: 'Diagram arsitektur sistem',
      },
      {
        url: 'https://images.example.test/dashboard.jpg',
        alt: 'Dasbor proyek',
      },
    ])
  })

  it('uses the localized project title as the legacy cover alt fallback', async () => {
    const project = makePublishedProject()
    project.translations.en.coverImageAlt = ''
    project.translations.id.coverImageAlt = ''
    await createProject(db, project)

    const [listing] = await listPublishedPublicProjects(db, 'id')
    expect(listing.coverImageAlt).toBe('Proyek Galeri Gambar')

    const detail = await getPublishedPublicProjectBySlug(
      db,
      'image-gallery-project',
      'id',
    )

    expect(detail?.galleryImages[0]).toEqual({
      url: 'https://images.example.test/cover.jpg',
      alt: 'Proyek Galeri Gambar',
    })
  })

  it('shows additional gallery images when there is no Cover Image', async () => {
    const project = makePublishedProject()
    project.slug = 'gallery-without-cover'
    project.coverImage = undefined
    await createProject(db, project)

    const detail = await getPublishedPublicProjectBySlug(
      db,
      'gallery-without-cover',
      'en',
    )

    expect(detail?.galleryImages.map((image) => image.url)).toEqual([
      'https://images.example.test/architecture.jpg',
      'https://images.example.test/dashboard.jpg',
    ])
  })
})
