import { z } from 'zod'

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required.'),
  siteTagline: z.string(),
  siteDescription: z.string(),
  defaultLocale: z.enum(['en', 'id']),
  publicEmail: z
    .string()
    .email('Invalid email address.')
    .or(z.literal('')),
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
  maintenanceMode: z.boolean(),
})

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>

export const defaultSiteSettings: SiteSettingsInput = {
  siteName: 'Winterest',
  siteTagline: 'Personal Portfolio Platform',
  siteDescription:
    'Personal platform, CMS dashboard, and developer lab for Winterest.',
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
  maintenanceMode: false,
}
