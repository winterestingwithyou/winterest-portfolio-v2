import { eq } from 'drizzle-orm'

import type { Database } from '#/db'
import { pageContent } from '#/db/schema'
import {
  getDefaultContactPageConfig,
  getDefaultProjectsPageConfig,
  getDefaultStackPageConfig,
} from './page-content-schemas'
import type { PublicPageKey } from './page-content-schemas'

export async function getPageContent<T>(
  db: Database,
  page: PublicPageKey,
): Promise<T> {
  const getDefault = (): unknown => {
    switch (page) {
      case 'projects':
        return getDefaultProjectsPageConfig()
      case 'stack':
        return getDefaultStackPageConfig()
      case 'contact':
        return getDefaultContactPageConfig()
    }
  }

  try {
    const record = await db
      .select()
      .from(pageContent)
      .where(eq(pageContent.page, page))
      .get()

    if (!record || !record.dataJson) {
      return getDefault() as T
    }

    try {
      const parsed = JSON.parse(record.dataJson) as Record<string, unknown>
      const defaultData = getDefault() as Record<string, unknown>
      // Merge with default to guarantee no missing fields
      return { ...defaultData, ...parsed } as T
    } catch {
      return getDefault() as T
    }
  } catch (error) {
    const isMissingTable =
      error instanceof Error &&
      error.message.toLowerCase().includes('no such table')
    if (!isMissingTable) {
      console.error(`Failed to read page_content for ${page}:`, error)
    }
    return getDefault() as T
  }
}

export async function updatePageContent(
  db: Database,
  page: PublicPageKey,
  data: Record<string, unknown>,
): Promise<void> {
  const now = new Date()
  const dataJson = JSON.stringify(data)

  const existing = await db
    .select({ page: pageContent.page })
    .from(pageContent)
    .where(eq(pageContent.page, page))
    .get()

  if (existing) {
    await db
      .update(pageContent)
      .set({
        dataJson,
        updatedAt: now,
      })
      .where(eq(pageContent.page, page))
  } else {
    await db.insert(pageContent).values({
      page,
      dataJson,
      createdAt: now,
      updatedAt: now,
    })
  }
}
