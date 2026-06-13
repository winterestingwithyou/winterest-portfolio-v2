import { and, desc, eq, inArray, or } from 'drizzle-orm'

import type { Database } from '#/db'
import { projects, projectTechnologies, technologies } from '#/db/schema'
import type { ContentLocale } from '#/db/schema'

import type { ProjectInput } from './validation'

export type ProjectRecord = typeof projects.$inferSelect

export type PublicProjectRecord = {
  id: string
  locale: ContentLocale
  slug: string
  title: string
  summary: string
  description?: string | null
  content?: string | null
  status: string
  category: string
  featured: boolean
  coverImage?: string | null
  repoUrl?: string | null
  demoUrl?: string | null
  caseStudyUrl?: string | null
  startedAt?: Date | null
  completedAt?: Date | null
  publishedAt?: Date | null
  technologies: string[]
}

export function toPublicProjectRecord(
  record: ProjectRecord,
  technologyNames: readonly string[] = [],
): PublicProjectRecord {
  return {
    id: record.id,
    locale: record.locale,
    slug: record.slug,
    title: record.title,
    summary: record.summary,
    description: record.description,
    content: record.content,
    status: record.status,
    category: record.category,
    featured: record.featured,
    coverImage: record.coverImage,
    repoUrl: record.repoUrl,
    demoUrl: record.demoUrl,
    caseStudyUrl: record.caseStudyUrl,
    startedAt: record.startedAt,
    completedAt: record.completedAt,
    publishedAt: record.publishedAt,
    technologies: [...technologyNames],
  }
}

export async function listProjects(db: Database) {
  return db.select().from(projects).orderBy(desc(projects.updatedAt)).all()
}

export async function listPublishedProjects(db: Database) {
  return db
    .select()
    .from(projects)
    .where(
      and(eq(projects.status, 'published'), eq(projects.visibility, 'public')),
    )
    .orderBy(desc(projects.publishedAt), desc(projects.updatedAt))
    .all()
}

export async function listPublishedPublicProjects(
  db: Database,
  locale: ContentLocale,
) {
  const records = await db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.status, 'published'),
        eq(projects.visibility, 'public'),
        inArray(projects.locale, getLocaleFallbacks(locale)),
      ),
    )
    .orderBy(desc(projects.publishedAt), desc(projects.updatedAt))
    .all()
  const localizedRecords = pickLocalizedRecords(records, locale)
  const technologyMap = await listProjectTechnologyNames(
    db,
    localizedRecords.map((project) => project.id),
  )

  return localizedRecords.map((project) =>
    toPublicProjectRecord(project, technologyMap.get(project.id)),
  )
}

export async function getPublishedPublicProjectBySlug(
  db: Database,
  slug: string,
  locale: ContentLocale,
) {
  const project =
    (await getPublishedProjectBySlugAndLocale(db, slug, locale)) ??
    (locale === 'en'
      ? null
      : await getPublishedProjectBySlugAndLocale(db, slug, 'en'))

  if (!project) {
    return null
  }

  const technologyMap = await listProjectTechnologyNames(db, [project.id])
  return toPublicProjectRecord(project, technologyMap.get(project.id))
}

async function getPublishedProjectBySlugAndLocale(
  db: Database,
  slug: string,
  locale: ContentLocale,
) {
  return db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.slug, slug),
        eq(projects.locale, locale),
        eq(projects.status, 'published'),
        eq(projects.visibility, 'public'),
      ),
    )
    .get()
}

async function listProjectTechnologyNames(
  db: Database,
  projectIds: readonly string[],
) {
  if (projectIds.length === 0) {
    return new Map<string, string[]>()
  }

  const rows = await db
    .select({
      projectId: projectTechnologies.projectId,
      technologyName: technologies.name,
    })
    .from(projectTechnologies)
    .innerJoin(
      technologies,
      eq(projectTechnologies.technologyId, technologies.id),
    )
    .where(inArray(projectTechnologies.projectId, [...projectIds]))
    .all()

  return rows.reduce((map, row) => {
    const existing = map.get(row.projectId) ?? []
    existing.push(row.technologyName)
    map.set(row.projectId, existing)
    return map
  }, new Map<string, string[]>())
}

function getLocaleFallbacks(locale: ContentLocale): ContentLocale[] {
  return locale === 'en' ? ['en'] : [locale, 'en']
}

function pickLocalizedRecords(
  records: readonly ProjectRecord[],
  locale: ContentLocale,
) {
  const bySlug = new Map<string, ProjectRecord>()

  for (const record of records) {
    const existing = bySlug.get(record.slug)
    if (!existing || (existing.locale !== locale && record.locale === locale)) {
      bySlug.set(record.slug, record)
    }
  }

  return [...bySlug.values()]
}

export async function getProjectByIdOrSlug(db: Database, idOrSlug: string) {
  return db
    .select()
    .from(projects)
    .where(or(eq(projects.id, idOrSlug), eq(projects.slug, idOrSlug)))
    .get()
}

export async function createProject(db: Database, input: ProjectInput) {
  const now = new Date()
  const id = crypto.randomUUID()
  const publishedAt = input.status === 'published' ? now : null

  await db
    .insert(projects)
    .values({
      ...input,
      id,
      publishedAt,
      createdAt: now,
      updatedAt: now,
    })
    .run()

  const project = await getProjectByIdOrSlug(db, id)
  if (!project) {
    throw new Error('Project was created but could not be loaded.')
  }

  return project
}

export async function updateProject(
  db: Database,
  idOrSlug: string,
  input: ProjectInput,
) {
  const existing = await getProjectByIdOrSlug(db, idOrSlug)
  if (!existing) {
    return null
  }

  const now = new Date()
  const publishedAt =
    input.status === 'published' && !existing.publishedAt
      ? now
      : input.status === 'published'
        ? existing.publishedAt
        : null

  await db
    .update(projects)
    .set({
      ...input,
      publishedAt,
      updatedAt: now,
    })
    .where(eq(projects.id, existing.id))
    .run()

  return getProjectByIdOrSlug(db, existing.id)
}

export async function deleteProject(db: Database, idOrSlug: string) {
  const existing = await getProjectByIdOrSlug(db, idOrSlug)
  if (!existing) {
    return false
  }

  await db.delete(projects).where(eq(projects.id, existing.id)).run()
  return true
}
