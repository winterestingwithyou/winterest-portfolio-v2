import { eq } from 'drizzle-orm'

import type { Database } from '#/db'
import { siteSettings } from '#/db/schema'

import type { SiteSettingsInput } from './types'
import { defaultSiteSettings } from './types'

export async function getSiteSettings(
  db: Database,
): Promise<SiteSettingsInput> {
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
      publicEmail: map.get('publicEmail') ?? defaultSiteSettings.publicEmail,
      metaTitleEn:
        map.get('metaTitleEn') ??
        map.get('metaTitle') ??
        defaultSiteSettings.metaTitleEn,
      metaTitleId: map.get('metaTitleId') ?? defaultSiteSettings.metaTitleId,
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
      cvEnUrl: map.get('cvEnUrl') ?? defaultSiteSettings.cvEnUrl,
      cvIdUrl: map.get('cvIdUrl') ?? defaultSiteSettings.cvIdUrl,
      maintenanceMode: map.has('maintenanceMode')
        ? map.get('maintenanceMode') === 'true'
        : defaultSiteSettings.maintenanceMode,
    }
  } catch (error) {
    const isMissingTable =
      error instanceof Error &&
      error.message.toLowerCase().includes('no such table')
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
    { key: 'cvEnUrl', value: input.cvEnUrl.trim() },
    { key: 'cvIdUrl', value: input.cvIdUrl.trim() },
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
