import { Zap } from 'lucide-react'
import { motion } from 'motion/react'

import { Container } from '#/components/marketing/section'
import { Marquee } from '#/components/ui/marquee'
import { TechMarqueeCard } from '#/features/technologies/components/tech-marquee-card'
import type { getPublicStackData } from '#/features/technologies/public-loaders'
import { defaultViewport, fadeIn, fadeUp, scaleIn } from '#/lib/motion'

type UltimateStackSectionProps = {
  copy: {
    ultimateEyebrow: string
    ultimateTitle: string
    ultimateDescription: string
  }
  ultimateTechs: Awaited<ReturnType<typeof getPublicStackData>>['ultimateTechs']
  showDescription?: boolean
}

export function UltimateStackSection({
  copy,
  ultimateTechs,
  showDescription = true,
}: UltimateStackSectionProps) {
  if (ultimateTechs.length === 0) return null

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={fadeIn}
      className="mt-8 mb-16 w-full"
    >
      <Container className="mb-6">
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center justify-center text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-(--brand-orange)/40 bg-(--brand-orange-soft) px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-(--brand-orange-deep)">
            <Zap className="size-3.5 fill-(--brand-orange-deep)" />
            {copy.ultimateEyebrow}
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-(--brand-ink) sm:text-4xl md:text-5xl">
            {copy.ultimateTitle}
          </h2>
          {showDescription && copy.ultimateDescription ? (
            <p className="mt-2 max-w-xl text-sm font-medium text-(--brand-muted)">
              {copy.ultimateDescription}
            </p>
          ) : null}
        </motion.div>
      </Container>

      {/* Edge-to-Edge Marquee for Ultimate Tech Stack */}
      <motion.div
        variants={scaleIn}
        className="relative w-full overflow-hidden py-3"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-(--brand-bg) to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-(--brand-bg) to-transparent sm:w-24" />

        <Marquee pauseOnHover className="py-6 [--duration:30s]" repeat={6}>
          {ultimateTechs.map((tech) => (
            <TechMarqueeCard
              key={tech.id}
              name={tech.name}
              icon={tech.icon}
              color={tech.color}
              url={tech.url}
              variant="ultimate"
            />
          ))}
        </Marquee>
      </motion.div>
    </motion.section>
  )
}
