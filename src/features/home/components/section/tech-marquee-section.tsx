import { motion } from 'motion/react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { Marquee } from '#/components/ui/marquee'
import { TechMarqueeCard } from '#/features/technologies/components/tech-marquee-card'
import { partitionMarqueeItems } from '#/features/technologies/partition-marquee'
import type { getPublicUltimateStack } from '#/features/technologies/public-loaders'
import { defaultViewport, fadeIn, fadeUp } from '#/lib/motion'

type TechMarqueeSectionProps = {
  copy: {
    marquee: {
      eyebrow: string
      title: string
      description: string
      emptyUltimateTitle: string
      emptyUltimateDescription: string
    }
  }
  ultimateTechs: Awaited<ReturnType<typeof getPublicUltimateStack>>
  showDescription?: boolean
}

export function TechMarqueeSection({
  copy,
  ultimateTechs,
  showDescription = true,
}: TechMarqueeSectionProps) {
  const [row1, row2, row3] = partitionMarqueeItems(ultimateTechs)

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
            eyebrow={copy.marquee.eyebrow}
            title={copy.marquee.title}
            description={showDescription ? copy.marquee.description : undefined}
          />
        </motion.div>
      </Container>

      {ultimateTechs.length > 0 ? (
        <motion.div
          variants={fadeUp}
          className="relative mt-8 w-full overflow-hidden py-2"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-(--brand-bg) to-transparent sm:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-(--brand-bg) to-transparent sm:w-28" />

          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Row 1: Forward (32s) */}
            <Marquee
              pauseOnHover
              duration={32}
              className="py-1 [--duration:32s]"
              repeat={5}
            >
              {row1.map((tech) => (
                <TechMarqueeCard
                  key={`row1-${tech.id}`}
                  name={tech.name}
                  icon={tech.icon}
                  color={tech.color}
                  url={tech.url}
                  variant="default"
                />
              ))}
            </Marquee>

            {/* Row 2: Reverse (42s) */}
            <Marquee
              pauseOnHover
              reverse
              duration={42}
              className="py-1 [--duration:42s]"
              repeat={5}
            >
              {row2.map((tech) => (
                <TechMarqueeCard
                  key={`row2-${tech.id}`}
                  name={tech.name}
                  icon={tech.icon}
                  color={tech.color}
                  url={tech.url}
                  variant="default"
                />
              ))}
            </Marquee>

            {/* Row 3: Forward (36s) */}
            <Marquee
              pauseOnHover
              duration={36}
              className="py-1 [--duration:36s]"
              repeat={5}
            >
              {row3.map((tech) => (
                <TechMarqueeCard
                  key={`row3-${tech.id}`}
                  name={tech.name}
                  icon={tech.icon}
                  color={tech.color}
                  url={tech.url}
                  variant="default"
                />
              ))}
            </Marquee>
          </div>
        </motion.div>
      ) : (
        <Container className="mt-8">
          <motion.div
            variants={fadeUp}
            className="surface-card mx-auto max-w-xl p-8 text-center"
          >
            <h3 className="text-xl font-bold text-(--brand-ink)">
              {copy.marquee.emptyUltimateTitle}
            </h3>
            <p className="mt-2 text-sm text-(--brand-muted)">
              {copy.marquee.emptyUltimateDescription}
            </p>
          </motion.div>
        </Container>
      )}
    </motion.section>
  )
}
