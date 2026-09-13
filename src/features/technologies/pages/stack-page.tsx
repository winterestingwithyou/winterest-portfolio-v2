import { motion } from 'motion/react'

import { Container, SectionHeader } from '#/components/marketing/section'
import type { StackPageConfig } from '#/features/portfolio/page-content-schemas'
import { StackCategoriesSection } from '#/features/technologies/components/section/stack-categories-section'
import { UltimateStackSection } from '#/features/technologies/components/section/ultimate-stack-section'
import { getTechnologiesCopy } from '#/features/technologies/copy'
import type { getPublicStackData } from '#/features/technologies/public-loaders'
import { fadeUp } from '#/lib/motion'
import { getLocale } from '#/paraglide/runtime'

type StackPageProps = {
  categories: Awaited<ReturnType<typeof getPublicStackData>>['categories']
  ultimateTechs: Awaited<ReturnType<typeof getPublicStackData>>['ultimateTechs']
  pageContent?: StackPageConfig
}

export function StackPage({
  categories,
  ultimateTechs,
  pageContent,
}: StackPageProps) {
  const copy = getTechnologiesCopy()
  const locale = getLocale() === 'id' ? 'id' : 'en'

  const resolvedEyebrow =
    (locale === 'en' ? pageContent?.eyebrowEn : pageContent?.eyebrowId) ||
    copy.page.eyebrow
  const resolvedTitle =
    (locale === 'en' ? pageContent?.titleEn : pageContent?.titleId) ||
    copy.page.title
  const resolvedDescription =
    pageContent?.showDescription !== false
      ? (locale === 'en'
          ? pageContent?.descriptionEn
          : pageContent?.descriptionId) || copy.page.description
      : undefined

  const resolvedUltimateEyebrow =
    (locale === 'en'
      ? pageContent?.ultimateEyebrowEn
      : pageContent?.ultimateEyebrowId) || copy.ultimate.ultimateEyebrow
  const resolvedUltimateTitle =
    (locale === 'en'
      ? pageContent?.ultimateTitleEn
      : pageContent?.ultimateTitleId) || copy.ultimate.ultimateTitle
  const resolvedUltimateDescription =
    pageContent?.showUltimateDescription !== false
      ? (locale === 'en'
          ? pageContent?.ultimateDescriptionEn
          : pageContent?.ultimateDescriptionId) ||
        copy.ultimate.ultimateDescription
      : undefined

  return (
    <main className="py-14 sm:py-20">
      <Container>
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <SectionHeader
            eyebrow={resolvedEyebrow}
            title={resolvedTitle}
            description={resolvedDescription}
          />
        </motion.div>
      </Container>

      <UltimateStackSection
        copy={{
          ...copy.ultimate,
          ultimateEyebrow: resolvedUltimateEyebrow,
          ultimateTitle: resolvedUltimateTitle,
          ultimateDescription: resolvedUltimateDescription ?? '',
        }}
        showDescription={pageContent?.showUltimateDescription !== false}
        ultimateTechs={ultimateTechs}
      />

      <StackCategoriesSection
        categories={categories}
        hasUltimateTechs={ultimateTechs.length > 0}
      />
    </main>
  )
}
