import { asc, eq } from 'drizzle-orm'

import type { Database } from '#/db'
import { socialLinks } from '#/db/schema'

import type { SocialLink, SocialLinkInput, SocialPlatform } from './types'

export async function getSocialLinks(db: Database): Promise<SocialLink[]> {
  try {
    const rows = await db
      .select()
      .from(socialLinks)
      .orderBy(asc(socialLinks.sortOrder), asc(socialLinks.createdAt))
      .all()

    return rows.map((row) => ({
      id: row.id,
      platform: row.platform,
      username: row.username ?? '',
      accountName: row.accountName ?? '',
      url: row.url,
      isEnabled: row.isEnabled,
      sortOrder: row.sortOrder,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }))
  } catch (error) {
    const isMissingTable =
      error instanceof Error &&
      error.message.toLowerCase().includes('no such table')
    if (!isMissingTable) {
      console.error('Failed to get social links:', error)
    }
    return []
  }
}

export async function getPublicSocialLinks(
  db: Database,
): Promise<SocialLink[]> {
  try {
    const rows = await db
      .select()
      .from(socialLinks)
      .where(eq(socialLinks.isEnabled, true))
      .orderBy(asc(socialLinks.sortOrder), asc(socialLinks.createdAt))
      .all()

    return rows.map((row) => ({
      id: row.id,
      platform: row.platform,
      username: row.username ?? '',
      accountName: row.accountName ?? '',
      url: row.url,
      isEnabled: row.isEnabled,
      sortOrder: row.sortOrder,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }))
  } catch (error) {
    const isMissingTable =
      error instanceof Error &&
      error.message.toLowerCase().includes('no such table')
    if (!isMissingTable) {
      console.error('Failed to get public social links:', error)
    }
    return []
  }
}

export async function getSocialLinkById(
  db: Database,
  id: string,
): Promise<SocialLink | null> {
  const row = await db
    .select()
    .from(socialLinks)
    .where(eq(socialLinks.id, id))
    .get()

  if (!row) return null

  return {
    id: row.id,
    platform: row.platform,
    username: row.username ?? '',
    accountName: row.accountName ?? '',
    url: row.url,
    isEnabled: row.isEnabled,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

export async function getSocialLinkByPlatform(
  db: Database,
  platform: SocialPlatform,
): Promise<SocialLink | null> {
  const row = await db
    .select()
    .from(socialLinks)
    .where(eq(socialLinks.platform, platform))
    .get()

  if (!row) return null

  return {
    id: row.id,
    platform: row.platform,
    username: row.username ?? '',
    accountName: row.accountName ?? '',
    url: row.url,
    isEnabled: row.isEnabled,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

export async function createSocialLink(
  db: Database,
  input: SocialLinkInput,
): Promise<SocialLink> {
  const id = `social-${input.platform}-${crypto.randomUUID().slice(0, 8)}`
  const now = new Date()

  await db.insert(socialLinks).values({
    id,
    platform: input.platform,
    username: input.username ? input.username.trim() : null,
    accountName: input.accountName ? input.accountName.trim() : null,
    url: input.url.trim(),
    isEnabled: input.isEnabled,
    sortOrder: input.sortOrder,
    createdAt: now,
    updatedAt: now,
  })

  const created = await getSocialLinkById(db, id)
  if (!created) {
    throw new Error('Failed to retrieve newly created social link.')
  }

  return created
}

export async function updateSocialLink(
  db: Database,
  id: string,
  input: Partial<SocialLinkInput>,
): Promise<SocialLink> {
  const now = new Date()

  const updateData: Record<string, unknown> = {
    updatedAt: now,
  }

  if (input.platform !== undefined) {
    updateData.platform = input.platform
  }
  if (input.username !== undefined) {
    updateData.username = input.username ? input.username.trim() : null
  }
  if (input.accountName !== undefined) {
    updateData.accountName = input.accountName ? input.accountName.trim() : null
  }
  if (input.url !== undefined) {
    updateData.url = input.url.trim()
  }
  if (input.isEnabled !== undefined) {
    updateData.isEnabled = input.isEnabled
  }
  if (input.sortOrder !== undefined) {
    updateData.sortOrder = input.sortOrder
  }

  await db
    .update(socialLinks)
    .set(updateData)
    .where(eq(socialLinks.id, id))
    .run()

  const updated = await getSocialLinkById(db, id)
  if (!updated) {
    throw new Error(`Social link with id "${id}" not found after update.`)
  }

  return updated
}

export async function deleteSocialLink(
  db: Database,
  id: string,
): Promise<void> {
  await db.delete(socialLinks).where(eq(socialLinks.id, id)).run()
}
