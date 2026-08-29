import { motion } from 'motion/react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { getPublicCopy } from '#/features/portfolio/data'
import { StackCategoriesSection } from '#/features/technologies/components/section/stack-categories-section'
import { UltimateStackSection } from '#/features/technologies/components/section/ultimate-stack-section'
import type { getPublicStackData } from '#/features/technologies/public-loaders'
import { fadeUp } from '#/lib/motion'

type StackPageProps = {
  categories: Awaited<ReturnType<typeof getPublicStackData>>['categories']
  ultimateTechs: Awaited<ReturnType<typeof getPublicStackData>>['ultimateTechs']
}

export function StackPage({ categories, ultimateTechs }: StackPageProps) {
  const copy = getPublicCopy()

  return (
    <main className="py-14 sm:py-20">
      <Container>
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <SectionHeader
            eyebrow={copy.stack.eyebrow}
            title={copy.stack.title}
            description={copy.stack.description}
          />
        </motion.div>
      </Container>

      <UltimateStackSection
        copy={copy.stack}
        ultimateTechs={ultimateTechs}
      />

      <StackCategoriesSection
        categories={categories}
        hasUltimateTechs={ultimateTechs.length > 0}
      />
    </main>
  )
}
