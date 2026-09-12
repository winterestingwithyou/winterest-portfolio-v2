import { useQuery } from '@tanstack/react-query'

import { EnthusiasmsSection } from '#/features/home/components/section/enthusiasms-section'
import { FeaturedProjectsSection } from '#/features/home/components/section/featured-projects-section'
import { HomeCtaSection } from '#/features/home/components/section/home-cta-section'
import { HomeHero } from '#/features/home/components/section/home-hero'
import { TechMarqueeSection } from '#/features/home/components/section/tech-marquee-section'
import { getHomeCopy } from '#/features/home/copy'
import type {
  EnthusiasmRecord,
  HomeConfigInput,
} from '#/features/home/validation'
import { portfolioStats as defaultPortfolioStats } from '#/features/portfolio/data'
import type { getPublishedProjects } from '#/features/projects/public-loaders'
import type { SiteSettingsInput } from '#/features/settings/types'
import { socialQueryOptions } from '#/features/social/query-options'
import type { getPublicUltimateStack } from '#/features/technologies/public-loaders'
import { getLocale } from '#/paraglide/runtime'

type HomePageProps = {
  projects: Awaited<ReturnType<typeof getPublishedProjects>>
  ultimateTechs: Awaited<ReturnType<typeof getPublicUltimateStack>>
  settings?: SiteSettingsInput
  homeConfig?: HomeConfigInput
  enthusiasms?: EnthusiasmRecord[]
}

export function HomePage({
  projects,
  ultimateTechs,
  settings,
  homeConfig,
  enthusiasms,
}: HomePageProps) {
  const copy = getHomeCopy()
  const locale = getLocale() === 'id' ? 'id' : 'en'
  const { data: socialLinks = [] } = useQuery(socialQueryOptions.publicList())
  const githubLink = socialLinks.find((l) => l.platform === 'github')
  const githubUrl = githubLink?.url || ''

  // 1. Dynamic Hero copy & stats
  const heroCopy = {
    ...copy.hero,
    eyebrow:
      (locale === 'en'
        ? homeConfig?.heroEyebrowEn
        : homeConfig?.heroEyebrowId) || copy.hero.eyebrow,
    title:
      (locale === 'en' ? homeConfig?.heroTitleEn : homeConfig?.heroTitleId) ||
      copy.hero.title,
    intro:
      (locale === 'en' ? homeConfig?.heroIntroEn : homeConfig?.heroIntroId) ||
      copy.hero.intro,
    introSuffix:
      (locale === 'en'
        ? homeConfig?.heroIntroSuffixEn
        : homeConfig?.heroIntroSuffixId) || copy.hero.introSuffix,
  }

  const resolvedStats =
    homeConfig?.stats && homeConfig.stats.length > 0
      ? homeConfig.stats.map((s) => ({
          label: locale === 'en' ? s.labelEn : s.labelId,
          value: s.value,
        }))
      : defaultPortfolioStats

  // 2. Dynamic Featured Projects section copy
  const featuredCopy = {
    ...copy.featured,
    eyebrow:
      (locale === 'en'
        ? homeConfig?.featuredEyebrowEn
        : homeConfig?.featuredEyebrowId) || copy.featured.eyebrow,
    title:
      (locale === 'en'
        ? homeConfig?.featuredTitleEn
        : homeConfig?.featuredTitleId) || copy.featured.title,
    description:
      (locale === 'en'
        ? homeConfig?.featuredDescriptionEn
        : homeConfig?.featuredDescriptionId) || copy.featured.description,
  }

  // 3. Dynamic Enthusiasms section copy & items
  const enthusiasmsCopy = {
    ...copy.enthusiasms,
    eyebrow:
      (locale === 'en'
        ? homeConfig?.enthusiasmsEyebrowEn
        : homeConfig?.enthusiasmsEyebrowId) || copy.enthusiasms.eyebrow,
    title:
      (locale === 'en'
        ? homeConfig?.enthusiasmsTitleEn
        : homeConfig?.enthusiasmsTitleId) || copy.enthusiasms.title,
    description:
      (locale === 'en'
        ? homeConfig?.enthusiasmsDescriptionEn
        : homeConfig?.enthusiasmsDescriptionId) || copy.enthusiasms.description,
  }

  const mappedEnthusiasms =
    enthusiasms && enthusiasms.length > 0
      ? enthusiasms.map((item) => ({
          iconName: item.icon,
          title: locale === 'en' ? item.titleEn : item.titleId,
          description:
            locale === 'en' ? item.descriptionEn : item.descriptionId,
        }))
      : undefined

  // 4. Dynamic Tech Marquee section copy
  const marqueeCopy = {
    ...copy.marquee,
    eyebrow:
      (locale === 'en'
        ? homeConfig?.marqueeEyebrowEn
        : homeConfig?.marqueeEyebrowId) || copy.marquee.eyebrow,
    title:
      (locale === 'en'
        ? homeConfig?.marqueeTitleEn
        : homeConfig?.marqueeTitleId) || copy.marquee.title,
    description:
      (locale === 'en'
        ? homeConfig?.marqueeDescriptionEn
        : homeConfig?.marqueeDescriptionId) || copy.marquee.description,
  }

  // 5. Dynamic Home CTA section copy
  const ctaCopy = {
    ...copy.cta,
    title:
      (locale === 'en' ? homeConfig?.ctaTitleEn : homeConfig?.ctaTitleId) ||
      copy.cta.title,
  }
  const ctaCommand = homeConfig?.ctaCommand || 'bun run build'
  const ctaButtonText =
    (locale === 'en'
      ? homeConfig?.ctaButtonTextEn
      : homeConfig?.ctaButtonTextId) || copy.cta.contact

  return (
    <main>
      <HomeHero
        copy={{ ...copy, hero: heroCopy }}
        githubUrl={githubUrl}
        portfolioStats={resolvedStats}
        showStats={homeConfig?.showStats !== false}
        settings={settings}
      />
      <FeaturedProjectsSection
        copy={{ ...copy, featured: featuredCopy }}
        projects={projects}
        showDescription={homeConfig?.showFeaturedDescription !== false}
      />
      <EnthusiasmsSection
        copy={{ ...copy, enthusiasms: enthusiasmsCopy }}
        enthusiasms={mappedEnthusiasms}
        showDescription={homeConfig?.showEnthusiasmsDescription !== false}
      />
      <TechMarqueeSection
        copy={{ ...copy, marquee: marqueeCopy }}
        ultimateTechs={ultimateTechs}
        showDescription={homeConfig?.showMarqueeDescription !== false}
      />
      <HomeCtaSection
        copy={{ ...copy, cta: ctaCopy }}
        command={ctaCommand}
        buttonText={ctaButtonText}
      />
    </main>
  )
}
