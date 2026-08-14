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
  category: string
}

export type DashboardProjectRecord = ProjectRecord & {
  translations: Record<ContentLocale, ProjectTranslationValue>
  availableLocales: ContentLocale[]
  technologyIds: string[]
}

export type PublicProjectTechnology = {
  id: string
  name: string
  icon?: string | null
  color?: string | null
}

export type PublicProjectRecord = {
  id: string
  slug: string
  title: string
  summary: string
  description?: string | null
  status: string
  category: string
  featured: boolean
  coverImage?: string | null
  repoUrl?: string | null
  repoVisibility: string
  demoUrl?: string | null
  productionUrl?: string | null
  startedAt?: Date | null
  completedAt?: Date | null
  publishedAt?: Date | null
  technologies: PublicProjectTechnology[]
}

export function toPublicProjectRecord(
  record: ProjectRecord,
  translation: ProjectTranslationRecord,
  projectTechs: readonly PublicProjectTechnology[] = [],
): PublicProjectRecord {
  return {
    id: record.id,
    slug: record.slug,
    title: translation.title,
    summary: translation.summary,
    description: translation.description,
    status: record.status,
    category: translation.category,
    featured: record.featured,
    coverImage: record.coverImage,
    repoUrl: record.repoUrl,
    repoVisibility: record.repoVisibility,
    demoUrl: record.demoUrl,
    productionUrl: record.productionUrl,
    startedAt: record.startedAt,
    completedAt: record.completedAt,
    publishedAt: record.publishedAt,
    technologies: [...projectTechs],
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
  const technologyIdsMap = await listProjectTechnologyIds(
    db,
    records.map((record) => record.id),
  )

  return records.map((record) =>
    toDashboardProjectRecord(
      record,
      translations.get(record.id),
      technologyIdsMap.get(record.id) ?? [],
    ),
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
  const technologyMap = await listProjectTechnologies(
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

  const technologyMap = await listProjectTechnologies(db, [project.id])
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

async function listProjectTechnologyIds(
  db: Database,
  projectIds: readonly string[],
) {
  if (projectIds.length === 0) {
    return new Map<string, string[]>()
  }

  const rows = await db
    .select({
      projectId: projectTechnologies.projectId,
      technologyId: projectTechnologies.technologyId,
    })
    .from(projectTechnologies)
    .where(inArray(projectTechnologies.projectId, [...projectIds]))
    .all()

  return rows.reduce((map, row) => {
    const existing = map.get(row.projectId) ?? []
    existing.push(row.technologyId)
    map.set(row.projectId, existing)
    return map
  }, new Map<string, string[]>())
}

async function listProjectTechnologies(
  db: Database,
  projectIds: readonly string[],
) {
  if (projectIds.length === 0) {
    return new Map<string, PublicProjectTechnology[]>()
  }

  const rows = await db
    .select({
      projectId: projectTechnologies.projectId,
      id: technologies.id,
      name: technologies.name,
      icon: technologies.icon,
      color: technologies.color,
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
    existing.push({
      id: row.id,
      name: row.name,
      icon: row.icon,
      color: row.color,
    })
    map.set(row.projectId, existing)
    return map
  }, new Map<string, PublicProjectTechnology[]>())
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
  const technologyIdsMap = await listProjectTechnologyIds(db, [project.id])

  return toDashboardProjectRecord(
    project,
    translations.get(project.id),
    technologyIdsMap.get(project.id) ?? [],
  )
}

export async function createProject(db: Database, input: ProjectInput) {
  const now = new Date()
  const id = crypto.randomUUID()
  const publishedAt = input.publishedAt
    ? input.publishedAt
    : input.status === 'published'
      ? now
      : null
  const english = input.translations.en

  await db
    .insert(projects)
    .values({
      id,
      slug: input.slug,
      title: english.title,
      summary: english.summary,
      description: english.description,
      status: input.status,
      visibility: input.visibility,
      repoVisibility: input.repoVisibility,
      featured: input.featured,
      category: english.category,
      coverImage: input.coverImage,
      repoUrl: input.repoUrl,
      demoUrl: input.demoUrl,
      productionUrl: input.productionUrl,
      startedAt: input.startedAt ?? null,
      completedAt: input.completedAt ?? null,
      publishedAt,
      createdAt: now,
      updatedAt: now,
    })
    .run()

  await upsertProjectTranslations(db, id, input.translations, now)
  await updateProjectTechnologies(db, id, input.technologyIds)

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
  const publishedAt = input.publishedAt
    ? input.publishedAt
    : input.status === 'published' && !existing.publishedAt
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
      status: input.status,
      visibility: input.visibility,
      repoVisibility: input.repoVisibility,
      featured: input.featured,
      category: english.category,
      coverImage: input.coverImage,
      repoUrl: input.repoUrl,
      demoUrl: input.demoUrl,
      productionUrl: input.productionUrl,
      startedAt: input.startedAt ?? existing.startedAt,
      completedAt: input.completedAt ?? existing.completedAt,
      publishedAt,
      updatedAt: now,
    })
    .where(eq(projects.id, existing.id))
    .run()

  await upsertProjectTranslations(db, existing.id, input.translations, now)
  await updateProjectTechnologies(db, existing.id, input.technologyIds)

  return getDashboardProjectByIdOrSlug(db, existing.id)
}

async function updateProjectTechnologies(
  db: Database,
  projectId: string,
  technologyIds: readonly string[],
) {
  await db
    .delete(projectTechnologies)
    .where(eq(projectTechnologies.projectId, projectId))
    .run()

  if (technologyIds.length > 0) {
    await db
      .insert(projectTechnologies)
      .values(
        technologyIds.map((technologyId) => ({
          projectId,
          technologyId,
        })),
      )
      .run()
  }
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
  technologyIds: readonly string[] = [],
): DashboardProjectRecord {
  const translationMap = new Map(
    translations.map((translation) => [translation.locale, translation]),
  )

  return {
    ...record,
    technologyIds: [...technologyIds],
    translations: Object.fromEntries(
      contentLocales.map((locale) => {
        const translation = translationMap.get(locale)
        return [
          locale,
          {
            title: translation?.title ?? '',
            summary: translation?.summary ?? '',
            description: translation?.description ?? '',
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
          category: translation.category,
          updatedAt: now,
        },
      })
      .run()
  }
}
