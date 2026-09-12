import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { ProjectCard } from '#/components/portfolio/project-card'
import type { getPublishedProjects } from '#/features/projects/public-loaders'
import {
  defaultViewport,
  fadeIn,
  fadeUp,
  staggerContainer,
  staggerItem,
} from '#/lib/motion'

type FeaturedProjectsSectionProps = {
  copy: {
    featured: {
      eyebrow: string
      title: string
      description: string
      emptyTitle: string
      emptyDescription: string
      viewProjects: string
    }
  }
  projects: Awaited<ReturnType<typeof getPublishedProjects>>
  showDescription?: boolean
}

export function FeaturedProjectsSection({
  copy,
  projects,
  showDescription = true,
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
            description={
              showDescription ? copy.featured.description : undefined
            }
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
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-(--brand-line) bg-card px-6 text-sm font-bold text-(--brand-ink) no-underline transition duration-200 hover:-translate-y-0.5 hover:border-(--brand-orange) hover:text-(--brand-orange-deep)"
          >
            {copy.featured.viewProjects}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </motion.div>
      </Container>
    </motion.section>
  )
}
