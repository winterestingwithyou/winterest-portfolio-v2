import { asc, eq, inArray } from 'drizzle-orm'

import type { Database } from '#/db'
import { categories, technologies, technologyCategories } from '#/db/schema'

export type CategoryRecord = typeof categories.$inferSelect
export type TechnologyRecord = typeof technologies.$inferSelect

export type CategoryInput = {
  name: string
  slug: string
  sortOrder?: number
}

export type TechnologyInput = {
  name: string
  slug: string
  icon?: string | null
  color?: string | null
  url?: string | null
  isUltimate?: boolean
  categoryIds: string[]
}

export type TechnologyWithCategories = TechnologyRecord & {
  categoryIds: string[]
}

export type PublicStackCategory = {
  id: string
  name: string
  slug: string
  sortOrder: number
  technologies: {
    id: string
    name: string
    slug: string
    icon?: string | null
    color?: string | null
    url?: string | null
    isUltimate?: boolean
  }[]
}

// Categories Queries & Mutations
export async function listCategories(db: Database): Promise<CategoryRecord[]> {
  return db.select().from(categories).orderBy(asc(categories.sortOrder)).all()
}

export async function getCategoryById(
  db: Database,
  id: string,
): Promise<CategoryRecord | null> {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .get()
  return result ?? null
}

export async function createCategory(
  db: Database,
  input: CategoryInput,
): Promise<CategoryRecord> {
  const now = new Date()
  const id = crypto.randomUUID()

  await db
    .insert(categories)
    .values({
      id,
      name: input.name,
      slug: input.slug,
      sortOrder: input.sortOrder ?? 0,
      createdAt: now,
      updatedAt: now,
    })
    .run()

  const category = await getCategoryById(db, id)
  if (!category) {
    throw new Error('Category created but could not be retrieved')
  }
  return category
}

export async function updateCategory(
  db: Database,
  id: string,
  input: CategoryInput,
): Promise<CategoryRecord | null> {
  const existing = await getCategoryById(db, id)
  if (!existing) return null

  const now = new Date()
  await db
    .update(categories)
    .set({
      name: input.name,
      slug: input.slug,
      sortOrder: input.sortOrder ?? existing.sortOrder,
      updatedAt: now,
    })
    .where(eq(categories.id, id))
    .run()

  return getCategoryById(db, id)
}

export async function deleteCategory(
  db: Database,
  id: string,
): Promise<boolean> {
  const existing = await getCategoryById(db, id)
  if (!existing) return false

  await db.delete(categories).where(eq(categories.id, id)).run()
  return true
}

// Technologies Queries & Mutations
export async function listTechnologies(
  db: Database,
): Promise<TechnologyWithCategories[]> {
  const techRecords = await db.select().from(technologies).all()
  if (techRecords.length === 0) return []

  const techIds = techRecords.map((t) => t.id)
  const mappings = await db
    .select({
      technologyId: technologyCategories.technologyId,
      categoryId: technologyCategories.categoryId,
    })
    .from(technologyCategories)
    .where(inArray(technologyCategories.technologyId, techIds))
    .all()

  const categoryMap = new Map<string, string[]>()
  for (const m of mappings) {
    const list = categoryMap.get(m.technologyId) ?? []
    list.push(m.categoryId)
    categoryMap.set(m.technologyId, list)
  }

  return techRecords.map((t) => ({
    ...t,
    categoryIds: categoryMap.get(t.id) ?? [],
  }))
}

export async function getTechnologyById(
  db: Database,
  id: string,
): Promise<TechnologyWithCategories | null> {
  const tech = await db
    .select()
    .from(technologies)
    .where(eq(technologies.id, id))
    .get()
  if (!tech) return null

  const mappings = await db
    .select({ categoryId: technologyCategories.categoryId })
    .from(technologyCategories)
    .where(eq(technologyCategories.technologyId, id))
    .all()

  return {
    ...tech,
    categoryIds: mappings.map((m) => m.categoryId),
  }
}

export async function createTechnology(
  db: Database,
  input: TechnologyInput,
): Promise<TechnologyWithCategories> {
  const now = new Date()
  const id = crypto.randomUUID()

  await db
    .insert(technologies)
    .values({
      id,
      name: input.name,
      slug: input.slug,
      icon: input.icon ?? null,
      color: input.color ?? null,
      url: input.url ?? null,
      isUltimate: input.isUltimate ?? false,
      createdAt: now,
      updatedAt: now,
    })
    .run()

  if (input.categoryIds.length > 0) {
    await db
      .insert(technologyCategories)
      .values(
        input.categoryIds.map((categoryId) => ({
          technologyId: id,
          categoryId,
        })),
      )
      .run()
  }

  const result = await getTechnologyById(db, id)
  if (!result) throw new Error('Technology created but could not be retrieved')
  return result
}

export async function updateTechnology(
  db: Database,
  id: string,
  input: TechnologyInput,
): Promise<TechnologyWithCategories | null> {
  const existing = await getTechnologyById(db, id)
  if (!existing) return null

  const now = new Date()
  await db
    .update(technologies)
    .set({
      name: input.name,
      slug: input.slug,
      icon: input.icon ?? null,
      color: input.color ?? null,
      url: input.url ?? null,
      isUltimate: input.isUltimate ?? false,
      updatedAt: now,
    })
    .where(eq(technologies.id, id))
    .run()

  await db
    .delete(technologyCategories)
    .where(eq(technologyCategories.technologyId, id))
    .run()

  if (input.categoryIds.length > 0) {
    await db
      .insert(technologyCategories)
      .values(
        input.categoryIds.map((categoryId) => ({
          technologyId: id,
          categoryId,
        })),
      )
      .run()
  }

  return getTechnologyById(db, id)
}

export async function deleteTechnology(
  db: Database,
  id: string,
): Promise<boolean> {
  const existing = await getTechnologyById(db, id)
  if (!existing) return false

  await db.delete(technologies).where(eq(technologies.id, id)).run()
  return true
}

export async function listUltimateTechnologies(
  db: Database,
): Promise<TechnologyRecord[]> {
  return db
    .select()
    .from(technologies)
    .where(eq(technologies.isUltimate, true))
    .all()
}

// Public Stack Query: Returns categories sorted with their associated technologies
export async function listPublicStack(
  db: Database,
): Promise<PublicStackCategory[]> {
  const catRecords = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder))
    .all()

  if (catRecords.length === 0) return []

  const catIds = catRecords.map((c) => c.id)

  const rows = await db
    .select({
      categoryId: technologyCategories.categoryId,
      techId: technologies.id,
      techName: technologies.name,
      techSlug: technologies.slug,
      techIcon: technologies.icon,
      techColor: technologies.color,
      techUrl: technologies.url,
      techIsUltimate: technologies.isUltimate,
    })
    .from(technologyCategories)
    .innerJoin(
      technologies,
      eq(technologyCategories.technologyId, technologies.id),
    )
    .where(inArray(technologyCategories.categoryId, catIds))
    .all()

  const techByCatMap = new Map<string, PublicStackCategory['technologies']>()
  for (const row of rows) {
    const existing = techByCatMap.get(row.categoryId) ?? []
    existing.push({
      id: row.techId,
      name: row.techName,
      slug: row.techSlug,
      icon: row.techIcon,
      color: row.techColor,
      url: row.techUrl,
      isUltimate: row.techIsUltimate,
    })
    techByCatMap.set(row.categoryId, existing)
  }

  return catRecords.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    sortOrder: cat.sortOrder,
    technologies: techByCatMap.get(cat.id) ?? [],
  }))
}
