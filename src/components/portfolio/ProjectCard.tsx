import { Link } from '@tanstack/react-router'
import { ArrowRight, ExternalLink, Github, Globe, Layers } from 'lucide-react'

import type { PublicProjectRecord } from '#/features/projects/queries'

type ProjectCardProps = {
  project: PublicProjectRecord
}

export function ProjectCard({ project }: ProjectCardProps) {
  const hasProductionUrl = Boolean(
    project.productionUrl && project.productionUrl.trim() !== '',
  )
  const hasDemoUrl = Boolean(project.demoUrl && project.demoUrl.trim() !== '')
  const isPublicRepo =
    project.repoVisibility === 'public' &&
    Boolean(project.repoUrl && project.repoUrl.trim() !== '')

  return (
    <article className="group surface-card flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--brand-line)] bg-[var(--surface-card)] transition duration-300 hover:-translate-y-1 hover:border-[var(--brand-orange)] hover:shadow-lg hover:shadow-[var(--brand-orange-soft)]">
      <div>
        {/* Cover Image or Fallback Header */}
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[var(--brand-line)] bg-[var(--surface-strong)]">
          {project.coverImage ? (
            <img
              src={project.coverImage}
              alt={project.title}
              className="size-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center bg-gradient-to-br from-[var(--brand-orange-soft)] via-[var(--surface-strong)] to-[var(--surface-card)] p-6 text-center">
              <div className="mb-2 grid size-12 place-items-center rounded-full border border-[var(--brand-line)] bg-[var(--surface-card)] text-[var(--brand-orange-deep)] shadow-sm">
                <Layers className="size-6" />
              </div>
              <span className="font-mono text-xs font-semibold tracking-wider text-[var(--brand-muted)] uppercase">
                {project.category}
              </span>
            </div>
          )}

          {/* Category Badge overlay if image present */}
          {project.coverImage ? (
            <div className="absolute top-3 left-3">
              <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 font-mono text-xs font-semibold text-white backdrop-blur-md">
                {project.category}
              </span>
            </div>
          ) : null}
        </div>

        {/* Card Body */}
        <div className="p-6">
          {/* Tech Stack Pills */}
          {project.technologies.length > 0 ? (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-[var(--brand-line)] bg-[var(--surface-strong)] px-2.5 py-0.5 font-mono text-xs font-medium text-[var(--brand-muted)]"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 5 ? (
                <span className="rounded-md border border-[var(--brand-line)] bg-[var(--surface-strong)] px-2 py-0.5 font-mono text-xs font-medium text-[var(--brand-muted)]">
                  +{project.technologies.length - 5}
                </span>
              ) : null}
            </div>
          ) : null}

          {/* Title */}
          <h3 className="text-xl font-bold text-[var(--brand-ink)] transition group-hover:text-[var(--brand-orange-deep)]">
            <Link
              to="/projects/$slug"
              params={{ slug: project.slug }}
              className="no-underline"
            >
              {project.title}
            </Link>
          </h3>

          {/* Summary */}
          <p className="mt-2 text-sm leading-relaxed text-[var(--brand-muted)] line-clamp-3">
            {project.summary}
          </p>
        </div>
      </div>

      {/* Card Footer / Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--brand-line)] bg-[var(--surface-strong)] p-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Production URL */}
          {hasProductionUrl ? (
            <a
              href={project.productionUrl!}
              target="_blank"
              rel="noreferrer"
              title="Visit Live Site"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-line)] bg-[var(--surface-card)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-ink)] no-underline transition hover:border-[var(--brand-orange)] hover:text-[var(--brand-orange-deep)]"
            >
              <Globe className="size-3.5 text-[var(--brand-orange-deep)]" />
              Live Site
            </a>
          ) : null}

          {/* Demo URL */}
          {hasDemoUrl ? (
            <a
              href={project.demoUrl!}
              target="_blank"
              rel="noreferrer"
              title="View Demo"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-line)] bg-[var(--surface-card)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-ink)] no-underline transition hover:border-[var(--brand-orange)] hover:text-[var(--brand-orange-deep)]"
            >
              <ExternalLink className="size-3.5" />
              Demo
            </a>
          ) : null}

          {/* Repository URL - ONLY IF PUBLIC */}
          {isPublicRepo ? (
            <a
              href={project.repoUrl!}
              target="_blank"
              rel="noreferrer"
              title="View GitHub Repository"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-line)] bg-[var(--surface-card)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-ink)] no-underline transition hover:border-[var(--brand-orange)] hover:text-[var(--brand-orange-deep)]"
            >
              <Github className="size-3.5" />
              Repository
            </a>
          ) : null}
        </div>

        {/* View Details Link */}
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-[var(--brand-orange-deep)] no-underline transition hover:translate-x-1"
        >
          Detail
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  )
}
