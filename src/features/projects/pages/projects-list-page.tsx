import { motion } from 'motion/react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { ProjectCard } from '#/components/portfolio/project-card'
import { getProjectsCopy } from '#/features/projects/copy'
import type { getPublishedProjects } from '#/features/projects/public-loaders'
import { fadeIn, fadeUp, staggerContainer, staggerItem } from '#/lib/motion'

type ProjectsListPageProps = {
  projects: Awaited<ReturnType<typeof getPublishedProjects>>
}

export function ProjectsListPage({ projects }: ProjectsListPageProps) {
  const copy = getProjectsCopy()

  return (
    <main className="px-4 py-14 sm:py-20">
      <Container>
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <motion.div variants={fadeUp}>
            <SectionHeader
              eyebrow={copy.list.eyebrow}
              title={copy.list.title}
              description={copy.list.description}
            />
          </motion.div>

          {projects.length === 0 ? (
            <motion.div variants={fadeUp} className="surface-card p-6">
              <h2 className="text-2xl font-semibold text-(--brand-ink)">
                {copy.list.emptyTitle}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-(--brand-muted)">
                {copy.list.emptyDescription}
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer(0.09, 0.1)}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {projects.map((project) => (
                <motion.div key={project.id} variants={staggerItem}>
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </Container>
    </main>
  )
}
