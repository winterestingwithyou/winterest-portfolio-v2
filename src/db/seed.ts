import { eq } from 'drizzle-orm'

import type { Database } from './index'
import {
  labEntries,
  projectTechnologies,
  projects,
  technologies,
  writing,
} from './schema'
import {
  labSeeds,
  projectSeeds,
  technologySeeds,
  writingSeeds,
} from './seed-data'
import type {
  PortfolioContentSeed,
  PortfolioProjectSeed,
  TechnologySeed,
} from './seed-data'
import { serializeTags } from '#/features/content/queries'

export async function seedPortfolioData(db: Database) {
  const now = new Date()

  for (const technology of technologySeeds) {
    await upsertTechnology(db, technology, now)
  }

  for (const project of projectSeeds) {
    await upsertProject(db, project, now)
  }

  for (const entry of writingSeeds) {
    await upsertWriting(db, entry, now)
  }

  for (const entry of labSeeds) {
    await upsertLabEntry(db, entry, now)
  }
}

async function upsertTechnology(db: Database, seed: TechnologySeed, now: Date) {
  await db
    .insert(technologies)
    .values({
      id: seed.id,
      name: seed.name,
      slug: seed.slug,
      category: seed.category,
      icon: null,
      color: null,
      url: seed.url ?? null,
      description: seed.description ?? null,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: technologies.slug,
      set: {
        name: seed.name,
        category: seed.category,
        url: seed.url ?? null,
        description: seed.description ?? null,
        updatedAt: now,
      },
    })
    .run()
}

async function upsertProject(
  db: Database,
  seed: PortfolioProjectSeed,
  now: Date,
) {
  await db
    .insert(projects)
    .values({
      id: seed.id,
      slug: seed.slug,
      title: seed.title,
      summary: seed.summary,
      description: seed.description,
      content: seed.content,
      status: 'published',
      visibility: 'public',
      featured: seed.featured,
      category: seed.category,
      coverImage: null,
      repoUrl: seed.repoUrl ?? null,
      demoUrl: seed.demoUrl ?? null,
      caseStudyUrl: seed.caseStudyUrl ?? null,
      startedAt: null,
      completedAt: null,
      publishedAt: seed.publishedAt,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: projects.slug,
      set: {
        title: seed.title,
        summary: seed.summary,
        description: seed.description,
        content: seed.content,
        status: 'published',
        visibility: 'public',
        featured: seed.featured,
        category: seed.category,
        repoUrl: seed.repoUrl ?? null,
        demoUrl: seed.demoUrl ?? null,
        caseStudyUrl: seed.caseStudyUrl ?? null,
        publishedAt: seed.publishedAt,
        updatedAt: now,
      },
    })
    .run()

  const project = await db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.slug, seed.slug))
    .get()

  if (!project) {
    throw new Error(`Project seed "${seed.slug}" could not be loaded.`)
  }

  await db
    .delete(projectTechnologies)
    .where(eq(projectTechnologies.projectId, project.id))
    .run()

  const technologyRows = await Promise.all(
    seed.technologies.map((slug) =>
      db
        .select({ id: technologies.id })
        .from(technologies)
        .where(eq(technologies.slug, slug))
        .get(),
    ),
  )
  const relations = technologyRows
    .filter((technology): technology is { id: string } => Boolean(technology))
    .map((technology) => ({
      projectId: project.id,
      technologyId: technology.id,
    }))

  if (relations.length > 0) {
    await db.insert(projectTechnologies).values(relations).run()
  }
}

async function upsertWriting(
  db: Database,
  seed: PortfolioContentSeed,
  now: Date,
) {
  await db
    .insert(writing)
    .values({
      id: seed.id,
      slug: seed.slug,
      title: seed.title,
      summary: seed.summary,
      content: seed.content,
      status: 'published',
      visibility: 'public',
      coverImage: null,
      tags: serializeTags(seed.tags),
      publishedAt: seed.publishedAt,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: writing.slug,
      set: {
        title: seed.title,
        summary: seed.summary,
        content: seed.content,
        status: 'published',
        visibility: 'public',
        tags: serializeTags(seed.tags),
        publishedAt: seed.publishedAt,
        updatedAt: now,
      },
    })
    .run()
}

async function upsertLabEntry(
  db: Database,
  seed: PortfolioContentSeed,
  now: Date,
) {
  await db
    .insert(labEntries)
    .values({
      id: seed.id,
      slug: seed.slug,
      title: seed.title,
      summary: seed.summary,
      content: seed.content,
      status: 'published',
      visibility: 'public',
      demoUrl: null,
      repoUrl: null,
      coverImage: null,
      tags: serializeTags(seed.tags),
      publishedAt: seed.publishedAt,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: labEntries.slug,
      set: {
        title: seed.title,
        summary: seed.summary,
        content: seed.content,
        status: 'published',
        visibility: 'public',
        tags: serializeTags(seed.tags),
        publishedAt: seed.publishedAt,
        updatedAt: now,
      },
    })
    .run()
}
