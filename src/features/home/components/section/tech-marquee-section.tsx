import { ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { Marquee } from '#/components/ui/marquee'
import { TechIcon } from '#/components/ui/tech-icon'
import type { getPublicCopy } from '#/features/portfolio/data'
import type { getPublicUltimateStack } from '#/features/technologies/public-loaders'
import { defaultViewport, fadeIn, fadeUp } from '#/lib/motion'

type TechMarqueeSectionProps = {
  copy: ReturnType<typeof getPublicCopy>
  ultimateTechs: Awaited<ReturnType<typeof getPublicUltimateStack>>
}

export function TechMarqueeSection({
  copy,
  ultimateTechs,
}: TechMarqueeSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={fadeIn}
      className="py-14"
    >
      <Container>
        <motion.div variants={fadeUp}>
          <SectionHeader
            eyebrow={copy.stack.ultimateEyebrow}
            title={copy.home.stackTitle}
            description={copy.home.stackDescription}
          />
        </motion.div>
      </Container>

      {ultimateTechs.length > 0 ? (
        <motion.div
          variants={fadeUp}
          className="relative mt-8 w-full overflow-hidden py-2"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-(--brand-bg) to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-(--brand-bg) to-transparent sm:w-24" />

          <Marquee pauseOnHover className="py-4 [--duration:30s]" repeat={6}>
            {ultimateTechs.map((tech) => (
              <div
                key={tech.id}
                className="group relative flex w-44 shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-(--brand-line)/60 bg-(--surface-strong)/60 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-(--brand-orange) hover:bg-(--surface-strong) hover:shadow-xl sm:w-52"
              >
                <div className="flex items-center justify-center p-1 transition-transform duration-300 group-hover:scale-110">
                  <TechIcon
                    src={tech.icon}
                    alt={tech.name}
                    color={tech.color}
                    className="size-12 sm:size-14 object-contain"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-(--brand-ink) sm:text-base">
                    {tech.name}
                  </h3>
                  {tech.url ? (
                    <a
                      href={tech.url}
                      target="_blank"
                      rel="noreferrer"
                      title={`Visit ${tech.name}`}
                      className="text-(--brand-muted) opacity-0 transition hover:text-(--brand-orange-deep) group-hover:opacity-100"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </Marquee>
        </motion.div>
      ) : (
        <Container className="mt-8">
          <motion.div
            variants={fadeUp}
            className="surface-card mx-auto max-w-xl p-8 text-center"
          >
            <h3 className="text-xl font-bold text-(--brand-ink)">
              {copy.home.emptyUltimateTitle}
            </h3>
            <p className="mt-2 text-sm text-(--brand-muted)">
              {copy.home.emptyUltimateDescription}
            </p>
          </motion.div>
        </Container>
      )}
    </motion.section>
  )
}
