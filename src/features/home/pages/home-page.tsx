import { useQuery } from '@tanstack/react-query'

import { EnthusiasmsSection } from '#/features/home/components/section/enthusiasms-section'
import { FeaturedProjectsSection } from '#/features/home/components/section/featured-projects-section'
import { HomeCtaSection } from '#/features/home/components/section/home-cta-section'
import { HomeHero } from '#/features/home/components/section/home-hero'
import { TechMarqueeSection } from '#/features/home/components/section/tech-marquee-section'
import { getHomeCopy } from '#/features/home/copy'
import { portfolioStats } from '#/features/portfolio/data'
import type { getPublishedProjects } from '#/features/projects/public-loaders'
import { socialQueryOptions } from '#/features/social/query-options'
import type { getPublicUltimateStack } from '#/features/technologies/public-loaders'

type HomePageProps = {
  projects: Awaited<ReturnType<typeof getPublishedProjects>>
  ultimateTechs: Awaited<ReturnType<typeof getPublicUltimateStack>>
}

export function HomePage({ projects, ultimateTechs }: HomePageProps) {
  const copy = getHomeCopy()
  const { data: socialLinks = [] } = useQuery(socialQueryOptions.publicList())
  const githubLink = socialLinks.find((l) => l.platform === 'github')
  const githubUrl = githubLink?.url || ''

  return (
    <main>
      <HomeHero
        copy={copy}
        githubUrl={githubUrl}
        portfolioStats={portfolioStats}
      />
      <FeaturedProjectsSection copy={copy} projects={projects} />
      <EnthusiasmsSection copy={copy} />
      <TechMarqueeSection copy={copy} ultimateTechs={ultimateTechs} />
      <HomeCtaSection copy={copy} />
    </main>
  )
}
