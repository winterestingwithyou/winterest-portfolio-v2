import { and, desc, eq, or } from 'drizzle-orm'

import type { Database } from '#/db'
import { projects } from '#/db/schema'

import type { ProjectInput } from './validation'

export type ProjectRecord = typeof projects.$inferSelect

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
