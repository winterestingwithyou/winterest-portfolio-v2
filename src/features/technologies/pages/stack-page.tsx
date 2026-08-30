import { motion } from 'motion/react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { getTechnologiesCopy } from '#/features/technologies/copy'
import { StackCategoriesSection } from '#/features/technologies/components/section/stack-categories-section'
import { UltimateStackSection } from '#/features/technologies/components/section/ultimate-stack-section'
import type { getPublicStackData } from '#/features/technologies/public-loaders'
import { fadeUp } from '#/lib/motion'

type StackPageProps = {
  categories: Awaited<ReturnType<typeof getPublicStackData>>['categories']
  ultimateTechs: Awaited<ReturnType<typeof getPublicStackData>>['ultimateTechs']
}

export function StackPage({ categories, ultimateTechs }: StackPageProps) {
  const copy = getTechnologiesCopy()

  return (
    <main className="py-14 sm:py-20">
      <Container>
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <SectionHeader
            eyebrow={copy.page.eyebrow}
            title={copy.page.title}
            description={copy.page.description}
          />
        </motion.div>
      </Container>

      <UltimateStackSection
        copy={copy.ultimate}
        ultimateTechs={ultimateTechs}
      />

      <StackCategoriesSection
        categories={categories}
        hasUltimateTechs={ultimateTechs.length > 0}
      />
    </main>
  )
}
