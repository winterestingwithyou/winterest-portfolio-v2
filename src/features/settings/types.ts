import { z } from 'zod'

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required.'),
  siteTagline: z.string(),
  siteDescription: z.string(),
  defaultLocale: z.enum(['en', 'id']),
  publicEmail: z.string().email('Invalid email address.').or(z.literal('')),
  metaTitleEn: z.string().min(1, 'Title is required.'),
  metaTitleId: z.string().min(1, 'Judul wajib diisi.'),
  metaDescriptionEn: z.string(),
  metaDescriptionId: z.string(),
  ogDescriptionEn: z.string(),
  ogDescriptionId: z.string(),
  metaTitleTemplate: z.string(),
  faviconUrl: z.string().or(z.literal('')),
  ogImageUrl: z.string().or(z.literal('')),
  heroVisualUrl: z.string().or(z.literal('')),
  cvEnUrl: z.string().or(z.literal('')),
  cvIdUrl: z.string().or(z.literal('')),
  maintenanceMode: z.boolean(),
})

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>

export const defaultSiteSettings: SiteSettingsInput = {
  siteName: 'Winterest',
  siteTagline: 'Personal Portfolio Platform',
  siteDescription:
    'Personal developer platform, portfolio, and CMS dashboard for Winterest.',
  defaultLocale: 'en',
  publicEmail: '',
  metaTitleEn: 'Winterest Portfolio',
  metaTitleId: 'Winterest Portfolio',
  metaDescriptionEn: '',
  metaDescriptionId: '',
  ogDescriptionEn: '',
  ogDescriptionId: '',
  metaTitleTemplate: '%s | Winterest',
  faviconUrl: '',
  ogImageUrl: '',
  heroVisualUrl: '',
  cvEnUrl: '',
  cvIdUrl: '',
  maintenanceMode: false,
}

/**
 * Resolves the appropriate CV URL based on active locale with fallback.
 * If user is on 'id', prefer cvIdUrl -> fallback to cvEnUrl.
 * If user is on 'en', prefer cvEnUrl -> fallback to cvIdUrl.
 */
export function resolveActiveCv(
  locale: string,
  settings?: { cvEnUrl?: string | null; cvIdUrl?: string | null } | null,
): string | null {
  if (!settings) return null
  const en = settings.cvEnUrl?.trim() || null
  const id = settings.cvIdUrl?.trim() || null

  if (locale === 'id') {
    return id || en || null
  }
  return en || id || null
}
