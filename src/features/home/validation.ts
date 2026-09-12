import { z } from 'zod'

import { homeCopy } from '#/features/home/copy'
import { portfolioStats } from '#/features/portfolio/data'

export const statItemSchema = z.object({
  labelEn: z.string().min(1, 'Label EN is required'),
  labelId: z.string().min(1, 'Label ID is required'),
  value: z.string().min(1, 'Value is required'),
})
export type StatItem = z.infer<typeof statItemSchema>

export const homeConfigSchema = z.object({
  heroEyebrowEn: z.string().default(''),
  heroEyebrowId: z.string().default(''),
  heroTitleEn: z.string().default(''),
  heroTitleId: z.string().default(''),
  heroIntroEn: z.string().default(''),
  heroIntroId: z.string().default(''),
  heroIntroSuffixEn: z.string().default(''),
  heroIntroSuffixId: z.string().default(''),

  showStats: z.boolean().default(true),
  stats: z
    .array(statItemSchema)
    .max(4, 'Maximum 4 stats items permitted')
    .default([]),

  featuredEyebrowEn: z.string().default(''),
  featuredEyebrowId: z.string().default(''),
  featuredTitleEn: z.string().default(''),
  featuredTitleId: z.string().default(''),
  featuredDescriptionEn: z.string().default(''),
  featuredDescriptionId: z.string().default(''),
  showFeaturedDescription: z.boolean().default(true),

  enthusiasmsEyebrowEn: z.string().default(''),
  enthusiasmsEyebrowId: z.string().default(''),
  enthusiasmsTitleEn: z.string().default(''),
  enthusiasmsTitleId: z.string().default(''),
  enthusiasmsDescriptionEn: z.string().default(''),
  enthusiasmsDescriptionId: z.string().default(''),
  showEnthusiasmsDescription: z.boolean().default(true),

  marqueeEyebrowEn: z.string().default(''),
  marqueeEyebrowId: z.string().default(''),
  marqueeTitleEn: z.string().default(''),
  marqueeTitleId: z.string().default(''),
  marqueeDescriptionEn: z.string().default(''),
  marqueeDescriptionId: z.string().default(''),
  showMarqueeDescription: z.boolean().default(true),

  ctaCommand: z.string().default('bun run build'),
  ctaTitleEn: z.string().default(''),
  ctaTitleId: z.string().default(''),
  ctaButtonTextEn: z.string().default(''),
  ctaButtonTextId: z.string().default(''),
})
export type HomeConfigInput = z.infer<typeof homeConfigSchema>

export const enthusiasmItemSchema = z.object({
  icon: z.string().min(1, 'Icon name is required').default('Terminal'),
  titleEn: z.string().min(1, 'Title EN is required'),
  titleId: z.string().min(1, 'Title ID is required'),
  descriptionEn: z.string().min(1, 'Description EN is required'),
  descriptionId: z.string().min(1, 'Description ID is required'),
  isEnabled: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
})
export type EnthusiasmItemInput = z.infer<typeof enthusiasmItemSchema>

export const reorderEnthusiasmsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      sortOrder: z.number().int(),
    }),
  ),
})
export type ReorderEnthusiasmsInput = z.infer<typeof reorderEnthusiasmsSchema>

export type EnthusiasmRecord = {
  id: string
  icon: string
  titleEn: string
  titleId: string
  descriptionEn: string
  descriptionId: string
  isEnabled: boolean
  sortOrder: number
  createdAt: Date | string
  updatedAt: Date | string
}

export function getDefaultHomeConfig(): HomeConfigInput {
  return {
    heroEyebrowEn: homeCopy.en.hero.eyebrow,
    heroEyebrowId: homeCopy.id.hero.eyebrow,
    heroTitleEn: homeCopy.en.hero.title,
    heroTitleId: homeCopy.id.hero.title,
    heroIntroEn: homeCopy.en.hero.intro,
    heroIntroId: homeCopy.id.hero.intro,
    heroIntroSuffixEn: homeCopy.en.hero.introSuffix,
    heroIntroSuffixId: homeCopy.id.hero.introSuffix,

    showStats: true,
    stats: portfolioStats.map((s) => ({
      labelEn: s.label,
      labelId: s.label,
      value: s.value,
    })),

    featuredEyebrowEn: homeCopy.en.featured.eyebrow,
    featuredEyebrowId: homeCopy.id.featured.eyebrow,
    featuredTitleEn: homeCopy.en.featured.title,
    featuredTitleId: homeCopy.id.featured.title,
    featuredDescriptionEn: homeCopy.en.featured.description,
    featuredDescriptionId: homeCopy.id.featured.description,
    showFeaturedDescription: true,

    enthusiasmsEyebrowEn: homeCopy.en.enthusiasms.eyebrow,
    enthusiasmsEyebrowId: homeCopy.id.enthusiasms.eyebrow,
    enthusiasmsTitleEn: homeCopy.en.enthusiasms.title,
    enthusiasmsTitleId: homeCopy.id.enthusiasms.title,
    enthusiasmsDescriptionEn: homeCopy.en.enthusiasms.description,
    enthusiasmsDescriptionId: homeCopy.id.enthusiasms.description,
    showEnthusiasmsDescription: true,

    marqueeEyebrowEn: homeCopy.en.marquee.eyebrow,
    marqueeEyebrowId: homeCopy.id.marquee.eyebrow,
    marqueeTitleEn: homeCopy.en.marquee.title,
    marqueeTitleId: homeCopy.id.marquee.title,
    marqueeDescriptionEn: homeCopy.en.marquee.description,
    marqueeDescriptionId: homeCopy.id.marquee.description,
    showMarqueeDescription: true,

    ctaCommand: 'bun run build',
    ctaTitleEn: homeCopy.en.cta.title,
    ctaTitleId: homeCopy.id.cta.title,
    ctaButtonTextEn: homeCopy.en.hero.downloadCv, // or contact me
    ctaButtonTextId: homeCopy.id.hero.downloadCv,
  }
}
