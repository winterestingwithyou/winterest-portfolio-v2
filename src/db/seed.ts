import { eq } from 'drizzle-orm'

import type { Database } from './index'
import {
  categories,
  contentLocales,
  projectTechnologies,
  projects,
  projectTranslations,
  technologies,
  technologyCategories,
} from './schema'
import { categorySeeds, projectSeeds, technologySeeds } from './seed-data'
import type {
  CategorySeed,
  PortfolioProjectSeed,
  TechnologySeed,
} from './seed-data'

export async function seedPortfolioData(db: Database) {
  const now = new Date()

  for (const category of categorySeeds) {
    await upsertCategory(db, category, now)
  }

  for (const technology of technologySeeds) {
    await upsertTechnology(db, technology, now)
  }

  for (const project of projectSeeds) {
    await upsertProject(db, project, now)
  }
}

async function upsertCategory(db: Database, seed: CategorySeed, now: Date) {
  await db
    .insert(categories)
    .values({
      id: seed.id,
      name: seed.name,
      slug: seed.slug,
      description: seed.description ?? null,
      sortOrder: seed.sortOrder,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: categories.slug,
      set: {
        name: seed.name,
        description: seed.description ?? null,
        sortOrder: seed.sortOrder,
        updatedAt: now,
      },
    })
    .run()
}

async function upsertTechnology(db: Database, seed: TechnologySeed, now: Date) {
  await db
    .insert(technologies)
    .values({
      id: seed.id,
      name: seed.name,
      slug: seed.slug,
      icon: seed.icon ?? null,
      color: seed.color ?? null,
      url: seed.url ?? null,
      description: seed.description ?? null,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: technologies.slug,
      set: {
        name: seed.name,
        icon: seed.icon ?? null,
        color: seed.color ?? null,
        url: seed.url ?? null,
        description: seed.description ?? null,
        updatedAt: now,
      },
    })
    .run()

  const techRow = await db
    .select({ id: technologies.id })
    .from(technologies)
    .where(eq(technologies.slug, seed.slug))
    .get()

  if (techRow) {
    await db
      .delete(technologyCategories)
      .where(eq(technologyCategories.technologyId, techRow.id))
      .run()

    for (const catId of seed.categoryIds) {
      await db
        .insert(technologyCategories)
        .values({
          technologyId: techRow.id,
          categoryId: catId,
        })
        .onConflictDoNothing()
        .run()
    }
  }
}

async function upsertProject(
  db: Database,
  seed: PortfolioProjectSeed,
  now: Date,
) {
  const english = seed.translations.en

  await db
    .insert(projects)
    .values({
      id: seed.id,
      slug: seed.slug,
      title: english.title,
      summary: english.summary,
      description: english.description,
      status: 'published',
      visibility: 'public',
      repoVisibility: seed.repoVisibility ?? 'public',
      featured: seed.featured,
      category: english.category,
      coverImage: null,
      repoUrl: seed.repoUrl ?? null,
      demoUrl: seed.demoUrl ?? null,
      productionUrl: seed.productionUrl ?? null,
      startedAt: null,
      completedAt: null,
      publishedAt: seed.publishedAt,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: projects.slug,
      set: {
        title: english.title,
        summary: english.summary,
        description: english.description,
        status: 'published',
        visibility: 'public',
        repoVisibility: seed.repoVisibility ?? 'public',
        featured: seed.featured,
        category: english.category,
        repoUrl: seed.repoUrl ?? null,
        demoUrl: seed.demoUrl ?? null,
        productionUrl: seed.productionUrl ?? null,
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

  for (const locale of contentLocales) {
    const translation = seed.translations[locale]
    await db
      .insert(projectTranslations)
      .values({
        projectId: project.id,
        locale,
        title: translation.title,
        summary: translation.summary,
        description: translation.description,
        category: translation.category,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [projectTranslations.projectId, projectTranslations.locale],
        set: {
          title: translation.title,
          summary: translation.summary,
          description: translation.description,
          category: translation.category,
          updatedAt: now,
        },
      })
      .run()
  }
}
