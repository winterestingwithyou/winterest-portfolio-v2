import { ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'

import { Container } from '#/components/marketing/section'
import { Marquee } from '#/components/ui/marquee'
import { TechIcon } from '#/components/ui/tech-icon'
import type { getPublicStackData } from '#/features/technologies/public-loaders'
import { defaultViewport, fadeIn, fadeUp } from '#/lib/motion'

type StackCategoriesSectionProps = {
  categories: Awaited<ReturnType<typeof getPublicStackData>>['categories']
  hasUltimateTechs: boolean
}

export function StackCategoriesSection({
  categories,
  hasUltimateTechs,
}: StackCategoriesSectionProps) {
  if (categories.length === 0 && !hasUltimateTechs) {
    return (
      <Container>
        <div className="surface-card p-8 text-center">
          <h2 className="text-xl font-semibold text-(--brand-ink)">
            Stack items coming soon!
          </h2>
          <p className="mt-2 text-sm text-(--brand-muted)">
            Tech stack database entries are currently being updated.
          </p>
        </div>
      </Container>
    )
  }

  return (
    <div className="flex flex-col gap-14 sm:gap-20">
      {categories.map((category, index) => {
        if (category.technologies.length === 0) return null

        return (
          <motion.section
            key={category.id}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={fadeIn}
            className="w-full"
          >
            {/* Centered Highlighted Category Title */}
            <Container className="mb-6">
              <motion.div
                variants={fadeUp}
                className="flex flex-col items-center justify-center text-center"
              >
                <h2 className="text-2xl font-black tracking-tight text-(--brand-ink) sm:text-3xl md:text-4xl">
                  <span className="bg-linear-to-r from-(--brand-ink) via-(--brand-orange-deep) to-(--brand-ink) bg-clip-text text-transparent">
                    {category.name}
                  </span>
                </h2>
                <span className="mt-3 h-1 w-12 rounded-full bg-linear-to-r from-(--brand-orange) to-(--brand-orange-deep) opacity-80" />
              </motion.div>
            </Container>

            {/* Marquee Row - Edge to Edge across full window width */}
            <motion.div
              variants={fadeUp}
              className="relative w-full overflow-hidden py-2"
            >
              {/* Gradient Fade Overlays */}
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-(--brand-bg) to-transparent sm:w-24" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-(--brand-bg) to-transparent sm:w-24" />

              <Marquee
                pauseOnHover
                reverse={index % 2 === 1}
                className="py-4 [--duration:35s]"
                repeat={6}
              >
                {category.technologies.map((tech) => (
                  <div
                    key={tech.id}
                    className="group relative flex w-44 shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-(--brand-line) bg-card p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-(--brand-orange) sm:w-52"
                  >
                    {/* Prominent Centerpiece Icon */}
                    <div className="flex items-center justify-center p-1 transition-transform duration-300 group-hover:scale-110">
                      <TechIcon
                        src={tech.icon}
                        alt={tech.name}
                        color={tech.color}
                        className="size-14 sm:size-16 object-contain"
                      />
                    </div>

                    {/* Tech Name & Link */}
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-(--brand-ink) sm:text-base">
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
                          <ExternalLink
                            className="size-3.5"
                            aria-hidden="true"
                          />
                          <span className="sr-only">
                            Visit official website of {tech.name} (opens in a
                            new tab)
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
      })}
    </div>
  )
}
