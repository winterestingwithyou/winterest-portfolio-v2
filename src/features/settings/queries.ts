import { eq } from 'drizzle-orm'

import type { Database } from '#/db'
import { siteSettings } from '#/db/schema'

import type { SiteSettingsInput } from './types'
import { defaultSiteSettings } from './types'

export async function getSiteSettings(db: Database): Promise<SiteSettingsInput> {
  try {
    const records = await db.select().from(siteSettings).all()
    const map = new Map<string, string>()
    for (const record of records) {
      map.set(record.key, record.value)
    }

    const rawLocale = map.get('defaultLocale')
    const defaultLocale =
      rawLocale === 'id' || rawLocale === 'en'
        ? rawLocale
        : defaultSiteSettings.defaultLocale

    return {
      siteName: map.get('siteName') ?? defaultSiteSettings.siteName,
      siteTagline: map.get('siteTagline') ?? defaultSiteSettings.siteTagline,
      siteDescription:
        map.get('siteDescription') ?? defaultSiteSettings.siteDescription,
      defaultLocale,
      githubUrl: map.get('githubUrl') ?? defaultSiteSettings.githubUrl,
      githubName: map.get('githubName') ?? defaultSiteSettings.githubName,
      linkedinUrl: map.get('linkedinUrl') ?? defaultSiteSettings.linkedinUrl,
      linkedinName: map.get('linkedinName') ?? defaultSiteSettings.linkedinName,
      twitterUrl: map.get('twitterUrl') ?? defaultSiteSettings.twitterUrl,
      twitterName: map.get('twitterName') ?? defaultSiteSettings.twitterName,
      facebookUrl: map.get('facebookUrl') ?? defaultSiteSettings.facebookUrl,
      facebookName: map.get('facebookName') ?? defaultSiteSettings.facebookName,
      instagramUrl: map.get('instagramUrl') ?? defaultSiteSettings.instagramUrl,
      instagramName: map.get('instagramName') ?? defaultSiteSettings.instagramName,
      tiktokUrl: map.get('tiktokUrl') ?? defaultSiteSettings.tiktokUrl,
      tiktokName: map.get('tiktokName') ?? defaultSiteSettings.tiktokName,
      publicEmail: map.get('publicEmail') ?? defaultSiteSettings.publicEmail,
      metaTitleEn:
        map.get('metaTitleEn') ??
        map.get('metaTitle') ??
        defaultSiteSettings.metaTitleEn,
      metaTitleId:
        map.get('metaTitleId') ?? defaultSiteSettings.metaTitleId,
      metaDescriptionEn:
        map.get('metaDescriptionEn') ??
        map.get('metaDescription') ??
        defaultSiteSettings.metaDescriptionEn,
      metaDescriptionId:
        map.get('metaDescriptionId') ?? defaultSiteSettings.metaDescriptionId,
      ogDescriptionEn:
        map.get('ogDescriptionEn') ?? defaultSiteSettings.ogDescriptionEn,
      ogDescriptionId:
        map.get('ogDescriptionId') ?? defaultSiteSettings.ogDescriptionId,
      metaTitleTemplate:
        map.get('metaTitleTemplate') ?? defaultSiteSettings.metaTitleTemplate,
      faviconUrl: map.get('faviconUrl') ?? defaultSiteSettings.faviconUrl,
      ogImageUrl: map.get('ogImageUrl') ?? defaultSiteSettings.ogImageUrl,
      heroVisualUrl:
        map.get('heroVisualUrl') ?? defaultSiteSettings.heroVisualUrl,
      maintenanceMode: map.has('maintenanceMode')
        ? map.get('maintenanceMode') === 'true'
        : defaultSiteSettings.maintenanceMode,
    }
  } catch (error) {
    const isMissingTable =
      error instanceof Error && error.message.toLowerCase().includes('no such table')
    if (!isMissingTable) {
      console.error('Failed to read site_settings table:', error)
    }
    return defaultSiteSettings
  }
}

export async function updateSiteSettings(
  db: Database,
  input: SiteSettingsInput,
): Promise<SiteSettingsInput> {
  const now = new Date()

  const entries: Array<{ key: string; value: string }> = [
    { key: 'siteName', value: input.siteName.trim() },
    { key: 'siteTagline', value: input.siteTagline.trim() },
    { key: 'siteDescription', value: input.siteDescription.trim() },
    { key: 'defaultLocale', value: input.defaultLocale },
    { key: 'githubUrl', value: input.githubUrl.trim() },
    { key: 'githubName', value: input.githubName.trim() },
    { key: 'linkedinUrl', value: input.linkedinUrl.trim() },
    { key: 'linkedinName', value: input.linkedinName.trim() },
    { key: 'twitterUrl', value: input.twitterUrl.trim() },
    { key: 'twitterName', value: input.twitterName.trim() },
    { key: 'facebookUrl', value: input.facebookUrl.trim() },
    { key: 'facebookName', value: input.facebookName.trim() },
    { key: 'instagramUrl', value: input.instagramUrl.trim() },
    { key: 'instagramName', value: input.instagramName.trim() },
    { key: 'tiktokUrl', value: input.tiktokUrl.trim() },
    { key: 'tiktokName', value: input.tiktokName.trim() },
    { key: 'publicEmail', value: input.publicEmail.trim() },
    { key: 'metaTitleEn', value: input.metaTitleEn.trim() },
    { key: 'metaTitleId', value: input.metaTitleId.trim() },
    { key: 'metaDescriptionEn', value: input.metaDescriptionEn.trim() },
    { key: 'metaDescriptionId', value: input.metaDescriptionId.trim() },
    { key: 'ogDescriptionEn', value: input.ogDescriptionEn.trim() },
    { key: 'ogDescriptionId', value: input.ogDescriptionId.trim() },
    { key: 'metaTitleTemplate', value: input.metaTitleTemplate.trim() },
    { key: 'faviconUrl', value: input.faviconUrl.trim() },
    { key: 'ogImageUrl', value: input.ogImageUrl.trim() },
    { key: 'heroVisualUrl', value: input.heroVisualUrl.trim() },
    { key: 'maintenanceMode', value: String(input.maintenanceMode) },
  ]

  for (const entry of entries) {
    const existing = await db
      .select({ key: siteSettings.key })
      .from(siteSettings)
      .where(eq(siteSettings.key, entry.key))
      .get()

    if (existing) {
      await db
        .update(siteSettings)
        .set({
          value: entry.value,
          updatedAt: now,
        })
        .where(eq(siteSettings.key, entry.key))
    } else {
      await db.insert(siteSettings).values({
        key: entry.key,
        value: entry.value,
        createdAt: now,
        updatedAt: now,
      })
    }
  }

  return getSiteSettings(db)
}
