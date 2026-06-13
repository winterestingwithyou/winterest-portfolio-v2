import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Layers3,
  Rocket,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { Container } from '#/components/marketing/section'
import { getPublishedProject } from '#/features/projects/public-loaders'
import { getPublicCopy } from '#/features/portfolio/data'
import { getLocale } from '#/paraglide/runtime'

export const Route = createFileRoute('/projects/$slug')({
  loader: ({ params }) =>
    getPublishedProject({ data: { slug: params.slug, locale: getLocale() } }),
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const copy = getPublicCopy()
  const project = Route.useLoaderData()

  if (!project) {
    return (
      <main className="px-4 py-20">
        <Container>
          <div className="surface-card max-w-2xl p-8">
            <p className="eyebrow mb-3">{copy.projectDetail.notFound}</p>
            <h1 className="text-3xl font-semibold text-[var(--brand-ink)]">
              {copy.projectDetail.notFoundTitle}
            </h1>
            <Link
              to="/projects"
              className="mt-6 inline-flex text-sm font-bold text-[var(--brand-orange-deep)] no-underline"
            >
              {copy.projectDetail.back}
            </Link>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className="px-4 py-14 sm:py-20">
      <Container>
        <Link
          to="/projects"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-orange-deep)] no-underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {copy.projectDetail.projects}
        </Link>

        <section className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-start">
          <div>
            <p className="eyebrow mb-4">{project.category}</p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-[var(--brand-ink)] sm:text-6xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--brand-muted)]">
              {project.summary}
            </p>
          </div>

          <aside className="surface-card p-5">
            <div className="grid gap-4">
              <MetaItem
                icon={<Rocket aria-hidden="true" className="size-4" />}
                label={copy.projectDetail.status}
                value={project.status}
              />
              <MetaItem
                icon={<Layers3 aria-hidden="true" className="size-4" />}
                label={copy.projectDetail.category}
                value={project.category}
              />
              <MetaItem
                icon={<CalendarDays aria-hidden="true" className="size-4" />}
                label={copy.projectDetail.year}
                value={formatProjectDate(project.publishedAt)}
              />
            </div>
            {project.description ? (
              <div className="mt-5 border-t border-[var(--brand-line)] pt-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand-orange-deep)]">
                  {copy.projectDetail.scope}
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">
                  {project.description}
                </p>
              </div>
            ) : null}
            {project.technologies.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold text-[var(--brand-muted)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
            {project.repoUrl || project.demoUrl || project.caseStudyUrl ? (
              <div className="mt-5 grid gap-2 border-t border-[var(--brand-line)] pt-5">
                <ProjectLink href={project.demoUrl} label="Live demo" />
                <ProjectLink href={project.repoUrl} label="Repository" />
                <ProjectLink href={project.caseStudyUrl} label="Case study" />
              </div>
            ) : null}
          </aside>
        </section>

        {project.content ? (
          <section className="mt-12 surface-card p-6 sm:p-8">
            <p className="eyebrow mb-3">{copy.projectDetail.result}</p>
            <div className="max-w-3xl whitespace-pre-wrap text-sm leading-8 text-[var(--brand-muted)]">
              {project.content}
            </div>
          </section>
        ) : null}
      </Container>
    </main>
  )
}

function ProjectLink({ href, label }: { href?: string | null; label: string }) {
  if (!href) {
    return null
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-10 items-center justify-between gap-3 rounded-lg border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 text-sm font-bold text-[var(--brand-ink)] no-underline transition hover:border-[var(--brand-orange)]"
    >
      {label}
      <ExternalLink aria-hidden="true" className="size-4" />
    </a>
  )
}

function formatProjectDate(date?: Date | string | null) {
  if (!date) {
    return 'Published'
  }

  const value = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(value.getTime())) {
    return 'Published'
  }

  return new Intl.DateTimeFormat('en', { year: 'numeric' }).format(value)
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--brand-orange-soft)] text-[var(--brand-orange-deep)]">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand-orange-deep)]">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold text-[var(--brand-ink)]">
          {value}
        </p>
      </div>
    </div>
  )
}
