import { Link } from '@tanstack/react-router'
import { ArrowLeft, Sparkles } from 'lucide-react'

import { Container } from '#/components/marketing/section'
import { getProjectsCopy } from '#/features/projects/copy'
import { ProjectDetailHero } from '#/features/projects/components/section/project-detail-hero'
import { ProjectDetailSidebar } from '#/features/projects/components/section/project-detail-sidebar'
import type { getPublishedProject } from '#/features/projects/public-loaders'

type ProjectDetailPageProps = {
  project: Awaited<ReturnType<typeof getPublishedProject>>
}

export function ProjectDetailPage({ project }: ProjectDetailPageProps) {
  const copy = getProjectsCopy()

  if (!project) {
    return (
      <main className="px-4 py-20">
        <Container>
          <div className="surface-card max-w-2xl p-8">
            <p className="eyebrow mb-3">{copy.detail.notFound}</p>
            <h1 className="text-3xl font-semibold text-(--brand-ink)">
              {copy.detail.notFoundTitle}
            </h1>
            <Link
              to="/projects"
              className="mt-6 inline-flex text-sm font-bold text-(--brand-orange-deep) no-underline"
            >
              {copy.detail.back}
            </Link>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className="px-4 py-12 sm:py-16">
      <Container>
        {/* Navigation back */}
        <Link
          to="/projects"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-(--brand-orange-deep) no-underline transition hover:-translate-x-1"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {copy.detail.projects}
        </Link>

        {/* Hero Section */}
        <ProjectDetailHero project={project} />

        {/* Main Content Layout */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem]">
          {/* Detailed Description */}
          <div className="surface-card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-2 border-b border-(--brand-line) pb-4">
              <Sparkles className="size-5 text-(--brand-orange-deep)" />
              <h2 className="text-xl font-bold text-(--brand-ink)">
                Deskripsi Project
              </h2>
            </div>

            {project.description ? (
              <div className="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed whitespace-pre-wrap text-(--brand-ink)">
                {project.description}
              </div>
            ) : (
              <p className="text-sm italic text-(--brand-muted)">
                Belum ada deskripsi lengkap untuk project ini.
              </p>
            )}
          </div>

          {/* Sidebar Info */}
          <ProjectDetailSidebar project={project} />
        </div>
      </Container>
    </main>
  )
}
