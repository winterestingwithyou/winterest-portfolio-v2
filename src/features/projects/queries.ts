import { and, desc, eq, inArray, or } from 'drizzle-orm'

import type { Database } from '#/db'
import {
  contentLocales,
  projects,
  projectTechnologies,
  projectTranslations,
  technologies,
} from '#/db/schema'
import type { ContentLocale } from '#/db/schema'

import type { ProjectInput } from './validation'

export type ProjectRecord = typeof projects.$inferSelect
export type ProjectTranslationRecord = typeof projectTranslations.$inferSelect

export type ProjectTranslationValue = {
  title: string
  summary: string
  description?: string | null
  content?: string | null
  category: string
}

export type DashboardProjectRecord = ProjectRecord & {
  translations: Record<ContentLocale, ProjectTranslationValue>
  availableLocales: ContentLocale[]
}

export type PublicProjectRecord = {
  id: string
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
  translation: ProjectTranslationRecord,
  technologyNames: readonly string[] = [],
): PublicProjectRecord {
  return {
    id: record.id,
    slug: record.slug,
    title: translation.title,
    summary: translation.summary,
    description: translation.description,
    content: translation.content,
    status: record.status,
    category: translation.category,
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
  const records = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.updatedAt))
    .all()
  const translations = await listProjectTranslations(
    db,
    records.map((record) => record.id),
  )

  return records.map((record) =>
    toDashboardProjectRecord(record, translations.get(record.id)),
  )
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
      and(eq(projects.status, 'published'), eq(projects.visibility, 'public')),
    )
    .orderBy(desc(projects.publishedAt), desc(projects.updatedAt))
    .all()
  const translations = await listProjectTranslations(
    db,
    records.map((record) => record.id),
  )
  const localizedRecords = records
    .map((record) => ({
      record,
      translation: pickTranslation(translations.get(record.id), locale),
    }))
    .filter(
      (
        item,
      ): item is {
        record: ProjectRecord
        translation: ProjectTranslationRecord
      } => Boolean(item.translation),
    )
  const technologyMap = await listProjectTechnologyNames(
    db,
    localizedRecords.map(({ record }) => record.id),
  )

  return localizedRecords.map(({ record, translation }) =>
    toPublicProjectRecord(record, translation, technologyMap.get(record.id)),
  )
}

export async function getPublishedPublicProjectBySlug(
  db: Database,
  slug: string,
  locale: ContentLocale,
) {
  const project = await getPublishedProjectBySlug(db, slug)

  if (!project) {
    return null
  }

  const translations = await listProjectTranslations(db, [project.id])
  const translation = pickTranslation(translations.get(project.id), locale)

  if (!translation) {
    return null
  }

  const technologyMap = await listProjectTechnologyNames(db, [project.id])
  return toPublicProjectRecord(
    project,
    translation,
    technologyMap.get(project.id),
  )
}

async function getPublishedProjectBySlug(db: Database, slug: string) {
  return db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.slug, slug),
        eq(projects.status, 'published'),
        eq(projects.visibility, 'public'),
      ),
    )
    .get()
}

async function listProjectTranslations(
  db: Database,
  projectIds: readonly string[],
) {
  if (projectIds.length === 0) {
    return new Map<string, ProjectTranslationRecord[]>()
  }

  const rows = await db
    .select()
    .from(projectTranslations)
    .where(inArray(projectTranslations.projectId, [...projectIds]))
    .all()

  return rows.reduce((map, row) => {
    const existing = map.get(row.projectId) ?? []
    existing.push(row)
    map.set(row.projectId, existing)
    return map
  }, new Map<string, ProjectTranslationRecord[]>())
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

export async function getProjectByIdOrSlug(db: Database, idOrSlug: string) {
  return db
    .select()
    .from(projects)
    .where(or(eq(projects.id, idOrSlug), eq(projects.slug, idOrSlug)))
    .get()
}

export async function getDashboardProjectByIdOrSlug(
  db: Database,
  idOrSlug: string,
) {
  const project = await getProjectByIdOrSlug(db, idOrSlug)
  if (!project) {
    return null
  }

  const translations = await listProjectTranslations(db, [project.id])
  return toDashboardProjectRecord(project, translations.get(project.id))
}

export async function createProject(db: Database, input: ProjectInput) {
  const now = new Date()
  const id = crypto.randomUUID()
  const publishedAt = input.status === 'published' ? now : null
  const english = input.translations.en

  await db
    .insert(projects)
    .values({
      id,
      slug: input.slug,
      title: english.title,
      summary: english.summary,
      description: english.description,
      content: english.content,
      status: input.status,
      visibility: input.visibility,
      featured: input.featured,
      category: english.category,
      coverImage: input.coverImage,
      repoUrl: input.repoUrl,
      demoUrl: input.demoUrl,
      caseStudyUrl: input.caseStudyUrl,
      publishedAt,
      createdAt: now,
      updatedAt: now,
    })
    .run()

  await upsertProjectTranslations(db, id, input.translations, now)

  const project = await getDashboardProjectByIdOrSlug(db, id)
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
  const english = input.translations.en
  const publishedAt =
    input.status === 'published' && !existing.publishedAt
      ? now
      : input.status === 'published'
        ? existing.publishedAt
        : null

  await db
    .update(projects)
    .set({
      slug: input.slug,
      title: english.title,
      summary: english.summary,
      description: english.description,
      content: english.content,
      status: input.status,
      visibility: input.visibility,
      featured: input.featured,
      category: english.category,
      coverImage: input.coverImage,
      repoUrl: input.repoUrl,
      demoUrl: input.demoUrl,
      caseStudyUrl: input.caseStudyUrl,
      publishedAt,
      updatedAt: now,
    })
    .where(eq(projects.id, existing.id))
    .run()

  await upsertProjectTranslations(db, existing.id, input.translations, now)

  return getDashboardProjectByIdOrSlug(db, existing.id)
}

export async function deleteProject(db: Database, idOrSlug: string) {
  const existing = await getProjectByIdOrSlug(db, idOrSlug)
  if (!existing) {
    return false
  }

  await db.delete(projects).where(eq(projects.id, existing.id)).run()
  return true
}

function pickTranslation(
  translations: readonly ProjectTranslationRecord[] | undefined,
  locale: ContentLocale,
) {
  return (
    translations?.find((translation) => translation.locale === locale) ??
    translations?.find((translation) => translation.locale === 'en') ??
    null
  )
}

function toDashboardProjectRecord(
  record: ProjectRecord,
  translations: readonly ProjectTranslationRecord[] = [],
): DashboardProjectRecord {
  const translationMap = new Map(
    translations.map((translation) => [translation.locale, translation]),
  )

  return {
    ...record,
    translations: Object.fromEntries(
      contentLocales.map((locale) => {
        const translation = translationMap.get(locale)
        return [
          locale,
          {
            title: translation?.title ?? '',
            summary: translation?.summary ?? '',
            description: translation?.description ?? '',
            content: translation?.content ?? '',
            category: translation?.category ?? 'Project',
          },
        ]
      }),
    ) as Record<ContentLocale, ProjectTranslationValue>,
    availableLocales: translations.map((translation) => translation.locale),
  }
}

async function upsertProjectTranslations(
  db: Database,
  projectId: string,
  translations: ProjectInput['translations'],
  now: Date,
) {
  for (const locale of contentLocales) {
    const translation = translations[locale]
    await db
      .insert(projectTranslations)
      .values({
        projectId,
        locale,
        title: translation.title,
        summary: translation.summary,
        description: translation.description,
        content: translation.content,
        category: translation.category,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [projectTranslations.projectId, projectTranslations.locale],
        set: {
          title: translation.title,
          summary: translation.summary,
          description: translation.description,
          content: translation.content,
          category: translation.category,
          updatedAt: now,
        },
      })
      .run()
  }
}
