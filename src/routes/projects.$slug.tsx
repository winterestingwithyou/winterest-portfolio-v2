import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Github,
  Globe,
  Layers,
  Sparkles,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { Container } from '#/components/marketing/section'
import { getPublicCopy } from '#/features/portfolio/data'
import { getPublishedProject } from '#/features/projects/public-loaders'
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

  const isPublicRepo =
    project.repoVisibility === 'public' && Boolean(project.repoUrl)

  return (
    <main className="px-4 py-12 sm:py-16">
      <Container>
        {/* Navigation back */}
        <Link
          to="/projects"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-orange-deep)] no-underline transition hover:-translate-x-1"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {copy.projectDetail.projects}
        </Link>

        {/* Hero Section */}
        <div className="surface-card overflow-hidden p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[var(--brand-orange-soft)] px-3.5 py-1 font-mono text-xs font-bold text-[var(--brand-orange-deep)] uppercase">
              {project.category}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold text-[var(--brand-muted)]">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              {project.status}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--brand-ink)] sm:text-5xl">
            {project.title}
          </h1>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-[var(--brand-muted)] sm:text-lg">
            {project.summary}
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--brand-line)] pt-6">
            {project.productionUrl ? (
              <a
                href={project.productionUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--brand-orange)] px-5 text-sm font-bold text-white no-underline transition hover:-translate-y-0.5"
              >
                <Globe className="size-4" />
                Live Site
              </a>
            ) : null}

            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-5 text-sm font-bold text-[var(--brand-ink)] no-underline transition hover:border-[var(--brand-orange)]"
              >
                <ExternalLink className="size-4" />
                Demo
              </a>
            ) : null}

            {isPublicRepo ? (
              <a
                href={project.repoUrl!}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-5 text-sm font-bold text-[var(--brand-ink)] no-underline transition hover:border-[var(--brand-orange)]"
              >
                <Github className="size-4" />
                Repository
              </a>
            ) : null}
          </div>
        </div>

        {/* Cover Image Banner (if available) */}
        {project.coverImage ? (
          <div className="mt-8 aspect-[21/9] w-full overflow-hidden rounded-2xl border border-[var(--brand-line)] shadow-md">
            <img
              src={project.coverImage}
              alt={project.title}
              className="size-full object-cover"
            />
          </div>
        ) : null}

        {/* Main Content Layout */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem]">
          {/* Detailed Description */}
          <div className="surface-card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-2 border-b border-[var(--brand-line)] pb-4">
              <Sparkles className="size-5 text-[var(--brand-orange-deep)]" />
              <h2 className="text-xl font-bold text-[var(--brand-ink)]">
                Deskripsi Project
              </h2>
            </div>

            {project.description ? (
              <div className="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed text-[var(--brand-ink)] whitespace-pre-wrap">
                {project.description}
              </div>
            ) : (
              <p className="text-sm italic text-[var(--brand-muted)]">
                Belum ada deskripsi lengkap untuk project ini.
              </p>
            )}
          </div>

          {/* Sidebar Info */}
          <aside className="space-y-6">
            {/* Project Metadata Card */}
            <div className="surface-card p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--brand-orange-deep)]">
                Informasi Project
              </h3>

              <div className="space-y-4">
                <MetaItem
                  icon={<Layers className="size-4" />}
                  label="Kategori"
                  value={project.category}
                />

                {project.startedAt ? (
                  <MetaItem
                    icon={<Clock className="size-4" />}
                    label="Dimulai Pada"
                    value={formatDate(project.startedAt)}
                  />
                ) : null}

                {project.completedAt ? (
                  <MetaItem
                    icon={<CheckCircle2 className="size-4" />}
                    label="Selesai Pada"
                    value={formatDate(project.completedAt)}
                  />
                ) : null}

                {project.publishedAt ? (
                  <MetaItem
                    icon={<Calendar className="size-4" />}
                    label="Dipublish Pada"
                    value={formatDate(project.publishedAt)}
                  />
                ) : null}
              </div>
            </div>

            {/* Technologies Card */}
            {project.technologies.length > 0 ? (
              <div className="surface-card p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--brand-orange-deep)]">
                  Teknologi
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 py-1 font-mono text-xs font-semibold text-[var(--brand-ink)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </Container>
    </main>
  )
}

function formatDate(dateInput?: Date | string | null): string {
  if (!dateInput) return '-'
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput)
  if (isNaN(d.getTime())) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
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
    <div className="flex items-center gap-3">
      <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--brand-orange-soft)] text-[var(--brand-orange-deep)]">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-[var(--brand-muted)]">{label}</p>
        <p className="text-sm font-bold text-[var(--brand-ink)]">{value}</p>
      </div>
    </div>
  )
}
