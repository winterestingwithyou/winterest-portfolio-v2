import { ExternalLink, Zap } from 'lucide-react'
import { motion } from 'motion/react'

import { Container } from '#/components/marketing/section'
import { Marquee } from '#/components/ui/marquee'
import { TechIcon } from '#/components/ui/tech-icon'
import type { getTechnologiesCopy } from '#/features/technologies/copy'
import type { getPublicStackData } from '#/features/technologies/public-loaders'
import { defaultViewport, fadeIn, fadeUp, scaleIn } from '#/lib/motion'

type UltimateStackSectionProps = {
  copy: ReturnType<typeof getTechnologiesCopy>['ultimate']
  ultimateTechs: Awaited<ReturnType<typeof getPublicStackData>>['ultimateTechs']
}

export function UltimateStackSection({
  copy,
  ultimateTechs,
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
          <p className="mt-2 max-w-xl text-sm font-medium text-(--brand-muted)">
            {copy.ultimateDescription}
          </p>
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
            <div
              key={tech.id}
              className="group relative flex w-52 shrink-0 flex-col items-center justify-center gap-4 rounded-2xl border border-(--brand-orange)/40 bg-card p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-(--brand-orange) sm:w-60"
            >
              {/* Ultimate Badge */}
              <div className="absolute top-3 right-3 rounded-full bg-(--brand-orange) p-1 text-white opacity-90 transition group-hover:scale-105">
                <Zap className="size-3 fill-white text-white" />
              </div>

              {/* Prominent Centerpiece Icon */}
              <div className="flex items-center justify-center p-2 transition-transform duration-300 group-hover:scale-110">
                <TechIcon
                  src={tech.icon}
                  alt={tech.name}
                  color={tech.color}
                  className="size-16 sm:size-20 object-contain"
                />
              </div>

              {/* Tech Name & Link */}
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold text-(--brand-ink) sm:text-lg">
                  {tech.name}
                </h3>
                {tech.url ? (
                  <a
                    href={tech.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit official website of ${tech.name} (opens in a new tab)`}
                    title={`Visit ${tech.name}`}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center -m-3 p-3 rounded-full text-(--brand-muted) opacity-65 transition hover:opacity-100 hover:text-(--brand-orange-deep) focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-(--brand-orange)"
                  >
                    <ExternalLink className="size-4" aria-hidden="true" />
                    <span className="sr-only">
                      Visit official website of {tech.name} (opens in a new tab)
                    </span>
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </Marquee>
      </motion.div>
    </motion.section>
  )
}
