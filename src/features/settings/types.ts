import { z } from 'zod'

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required.'),
  siteTagline: z.string(),
  siteDescription: z.string(),
  defaultLocale: z.enum(['en', 'id']),
  githubUrl: z
    .string()
    .url('Invalid URL format.')
    .or(z.literal('')),
  githubName: z.string(),
  linkedinUrl: z.string().url('Invalid URL format.').or(z.literal('')),
  linkedinName: z.string(),
  twitterUrl: z.string().url('Invalid URL format.').or(z.literal('')),
  twitterName: z.string(),
  facebookUrl: z.string().url('Invalid URL format.').or(z.literal('')),
  facebookName: z.string(),
  instagramUrl: z.string().url('Invalid URL format.').or(z.literal('')),
  instagramName: z.string(),
  tiktokUrl: z.string().url('Invalid URL format.').or(z.literal('')),
  tiktokName: z.string(),
  publicEmail: z
    .string()
    .email('Invalid email address.')
    .or(z.literal('')),
  metaTitleTemplate: z.string(),
  metaDescription: z.string(),
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
  githubUrl: '',
  githubName: '',
  linkedinUrl: '',
  linkedinName: '',
  twitterUrl: '',
  twitterName: '',
  facebookUrl: '',
  facebookName: '',
  instagramUrl: '',
  instagramName: '',
  tiktokUrl: '',
  tiktokName: '',
  publicEmail: '',
  metaTitleTemplate: '%s | Winterest',
  metaDescription: 'Winterest - Personal portfolio platform.',
  ogImageUrl: '',
  heroVisualUrl: '',
  maintenanceMode: false,
}
