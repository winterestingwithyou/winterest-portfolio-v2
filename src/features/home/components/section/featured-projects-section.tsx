import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { ProjectCard } from '#/components/portfolio/project-card'
import type { getHomeCopy } from '#/features/home/copy'
import type { getPublishedProjects } from '#/features/projects/public-loaders'
import {
  defaultViewport,
  fadeIn,
  fadeUp,
  staggerContainer,
  staggerItem,
} from '#/lib/motion'

type FeaturedProjectsSectionProps = {
  copy: ReturnType<typeof getHomeCopy>
  projects: Awaited<ReturnType<typeof getPublishedProjects>>
}

export function FeaturedProjectsSection({
  copy,
  projects,
}: FeaturedProjectsSectionProps) {
  const featuredOnly = projects.filter((project) => project.featured)
  const highlightedProjects =
    featuredOnly.length > 0 ? featuredOnly.slice(0, 4) : projects.slice(0, 4)

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={fadeIn}
      className="px-4 py-14"
    >
      <Container>
        <motion.div variants={fadeUp}>
          <SectionHeader
            eyebrow={copy.featured.eyebrow}
            title={copy.featured.title}
            description={copy.featured.description}
          />
        </motion.div>
        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          className="grid gap-6 md:grid-cols-2"
        >
          {highlightedProjects.length === 0 ? (
            <div className="surface-card p-6 md:col-span-2">
              <h3 className="text-2xl font-semibold text-(--brand-ink)">
                {copy.featured.emptyTitle}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-(--brand-muted)">
                {copy.featured.emptyDescription}
              </p>
            </div>
          ) : null}
          {highlightedProjects.map((project) => (
            <motion.div key={project.slug} variants={staggerItem}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 flex justify-center">
          <Link
            to="/projects"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-(--brand-line) bg-(--surface-card) px-6 text-sm font-bold text-(--brand-ink) no-underline shadow-xs transition duration-300 hover:-translate-y-0.5 hover:border-(--brand-orange) hover:text-(--brand-orange-deep) hover:shadow-[0_8px_20px_var(--brand-orange-soft)]"
          >
            {copy.featured.viewProjects}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </motion.div>
      </Container>
    </motion.section>
  )
}
