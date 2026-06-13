import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Github } from 'lucide-react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { SignalPreview } from '#/components/visual/SignalPreview'
import {
  getPortfolioContent,
  getPublicCopy,
  siteProfile,
} from '#/features/portfolio/data'

export const Route = createFileRoute('/projects/')({
  component: ProjectsPage,
})

function ProjectsPage() {
  const copy = getPublicCopy()
  const { featuredProjects } = getPortfolioContent()

  return (
    <main className="px-4 py-14 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow={copy.projects.eyebrow}
          title={copy.projects.title}
          description={copy.projects.description}
        />

        <div className="grid gap-5">
          {featuredProjects.map((project) => (
            <article
              key={project.slug}
              className="surface-card grid gap-6 p-6 lg:grid-cols-[1fr_18rem_auto] lg:items-center"
            >
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[var(--brand-orange-soft)] px-3 py-1 text-xs font-bold text-[var(--brand-orange-deep)]">
                    {project.status}
                  </span>
                  <span className="text-sm font-medium text-[var(--brand-muted)]">
                    {project.category}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--brand-ink)]">
                  {project.title}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--brand-muted)]">
                  {project.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold text-[var(--brand-muted)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <SignalPreview
                eyebrow={project.category}
                title={project.phase}
                items={project.stack}
              />
              <Link
                to="/projects/$slug"
                params={{ slug: project.slug }}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[var(--brand-orange)] px-4 text-sm font-bold text-white no-underline transition hover:-translate-y-0.5"
              >
                {copy.projects.open}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-10 command-strip grid gap-4 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="m-0 font-mono text-xs uppercase tracking-wide text-orange-200">
              {copy.projects.remote}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              {copy.projects.sourceTitle}
            </h2>
          </div>
          <a
            href={siteProfile.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-[var(--brand-dark)] no-underline transition hover:-translate-y-0.5"
          >
            <Github aria-hidden="true" className="size-4" />
            {copy.projects.repository}
          </a>
        </section>
      </Container>
    </main>
  )
}
