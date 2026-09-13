import { z } from 'zod'

import { contactCopy } from '#/features/contact/copy'
import { projectsCopy } from '#/features/projects/copy'
import { technologiesCopy } from '#/features/technologies/copy'

export const publicPageKeys = ['projects', 'stack', 'contact'] as const
export type PublicPageKey = (typeof publicPageKeys)[number]

// 1. Projects Page Schema
export const projectsPageConfigSchema = z.object({
  eyebrowEn: z.string().default(''),
  eyebrowId: z.string().default(''),
  titleEn: z.string().min(1, 'Title EN is required'),
  titleId: z.string().min(1, 'Title ID is required'),
  descriptionEn: z.string().default(''),
  descriptionId: z.string().default(''),
  showDescription: z.boolean().default(true),
})
export type ProjectsPageConfig = z.infer<typeof projectsPageConfigSchema>

// 2. Stack Page Schema
export const stackPageConfigSchema = z.object({
  eyebrowEn: z.string().default(''),
  eyebrowId: z.string().default(''),
  titleEn: z.string().min(1, 'Title EN is required'),
  titleId: z.string().min(1, 'Title ID is required'),
  descriptionEn: z.string().default(''),
  descriptionId: z.string().default(''),
  showDescription: z.boolean().default(true),

  ultimateEyebrowEn: z.string().default(''),
  ultimateEyebrowId: z.string().default(''),
  ultimateTitleEn: z.string().min(1, 'Ultimate Title EN is required'),
  ultimateTitleId: z.string().min(1, 'Ultimate Title ID is required'),
  ultimateDescriptionEn: z.string().default(''),
  ultimateDescriptionId: z.string().default(''),
  showUltimateDescription: z.boolean().default(true),
})
export type StackPageConfig = z.infer<typeof stackPageConfigSchema>

// 3. Contact Page Schema
export const contactPageConfigSchema = z.object({
  eyebrowEn: z.string().default(''),
  eyebrowId: z.string().default(''),
  titleEn: z.string().min(1, 'Title EN is required'),
  titleId: z.string().min(1, 'Title ID is required'),
  descriptionEn: z.string().default(''),
  descriptionId: z.string().default(''),
  showDescription: z.boolean().default(true),

  directTitleEn: z.string().default(''),
  directTitleId: z.string().default(''),
  directSubtitleEn: z.string().default(''),
  directSubtitleId: z.string().default(''),
  directStatusEn: z.string().default(''),
  directStatusId: z.string().default(''),
  directLocationEn: z.string().default(''),
  directLocationId: z.string().default(''),

  formTitleEn: z.string().default(''),
  formTitleId: z.string().default(''),
  formSubtitleEn: z.string().default(''),
  formSubtitleId: z.string().default(''),
})
export type ContactPageConfig = z.infer<typeof contactPageConfigSchema>

export function getDefaultProjectsPageConfig(): ProjectsPageConfig {
  return {
    eyebrowEn: projectsCopy.en.list.eyebrow,
    eyebrowId: projectsCopy.id.list.eyebrow,
    titleEn: projectsCopy.en.list.title,
    titleId: projectsCopy.id.list.title,
    descriptionEn: projectsCopy.en.list.description,
    descriptionId: projectsCopy.id.list.description,
    showDescription: true,
  }
}

export function getDefaultStackPageConfig(): StackPageConfig {
  return {
    eyebrowEn: technologiesCopy.en.page.eyebrow,
    eyebrowId: technologiesCopy.id.page.eyebrow,
    titleEn: technologiesCopy.en.page.title,
    titleId: technologiesCopy.id.page.title,
    descriptionEn: technologiesCopy.en.page.description,
    descriptionId: technologiesCopy.id.page.description,
    showDescription: true,

    ultimateEyebrowEn: technologiesCopy.en.ultimate.ultimateEyebrow,
    ultimateEyebrowId: technologiesCopy.id.ultimate.ultimateEyebrow,
    ultimateTitleEn: technologiesCopy.en.ultimate.ultimateTitle,
    ultimateTitleId: technologiesCopy.id.ultimate.ultimateTitle,
    ultimateDescriptionEn: technologiesCopy.en.ultimate.ultimateDescription,
    ultimateDescriptionId: technologiesCopy.id.ultimate.ultimateDescription,
    showUltimateDescription: true,
  }
}

export function getDefaultContactPageConfig(): ContactPageConfig {
  return {
    eyebrowEn: contactCopy.en.page.eyebrow,
    eyebrowId: contactCopy.id.page.eyebrow,
    titleEn: contactCopy.en.page.title,
    titleId: contactCopy.id.page.title,
    descriptionEn: contactCopy.en.page.description,
    descriptionId: contactCopy.id.page.description,
    showDescription: true,

    directTitleEn: contactCopy.en.direct.title,
    directTitleId: contactCopy.id.direct.title,
    directSubtitleEn: contactCopy.en.direct.subtitle,
    directSubtitleId: contactCopy.id.direct.subtitle,
    directStatusEn: contactCopy.en.direct.status,
    directStatusId: contactCopy.id.direct.status,
    directLocationEn: contactCopy.en.direct.location,
    directLocationId: contactCopy.id.direct.location,

    formTitleEn: contactCopy.en.form.title,
    formTitleId: contactCopy.id.form.title,
    formSubtitleEn: contactCopy.en.form.subtitle,
    formSubtitleId: contactCopy.id.form.subtitle,
  }
}

export type PublicPageConfig =
  | ProjectsPageConfig
  | StackPageConfig
  | ContactPageConfig
