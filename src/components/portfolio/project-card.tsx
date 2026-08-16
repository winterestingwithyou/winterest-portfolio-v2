import { Link } from '@tanstack/react-router'
import { ArrowRight, ExternalLink, Github, Globe, Layers, Sparkles } from 'lucide-react'

import { TechIcon } from '#/components/ui/tech-icon'
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
    <article
      className={`group relative flex size-full flex-col justify-between overflow-hidden transition-all duration-300 ${
        project.featured
          ? 'rounded-2xl border border-(--brand-orange)/40 bg-linear-to-br from-(--surface-card) via-(--surface-card) to-(--brand-orange-soft)/30 shadow-lg shadow-(--brand-orange-soft)/20 hover:-translate-y-1 hover:border-(--brand-orange) hover:shadow-xl hover:shadow-(--brand-orange-soft)/35'
          : 'rounded-2xl border border-(--brand-line) bg-(--surface-card) hover:-translate-y-1 hover:border-(--brand-orange) hover:shadow-xl hover:shadow-(--brand-orange-soft)/20'
      }`}
    >
      {/* Background ambient glow effect on hover */}
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-(--brand-orange)/10 blur-2xl transition duration-500 group-hover:scale-150 group-hover:bg-(--brand-orange)/20" />

      <div>
        {/* Cover Image or Fallback Header */}
        <div className="relative aspect-video w-full overflow-hidden border-b border-(--brand-line) bg-(--surface-strong)">
          {project.coverImage ? (
            <img
              src={project.coverImage}
              alt={project.title}
              className="size-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="relative flex size-full flex-col items-center justify-center overflow-hidden bg-linear-to-br from-(--brand-orange-soft)/30 via-(--surface-strong) to-(--surface-card) p-6 text-center">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--brand-orange-soft)_0%,transparent_70%)] opacity-30" />

              <div className="relative z-10 mb-2.5 grid size-12 place-items-center rounded-2xl border border-(--brand-line) bg-(--surface-card) text-(--brand-orange-deep) shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:border-(--brand-orange)">
                <Layers className="size-6 text-(--brand-orange-deep)" />
              </div>
              <span className="relative z-10 font-mono text-xs font-semibold uppercase tracking-wider text-(--brand-muted)">
                {project.category}
              </span>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            {project.featured ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-(--brand-orange-deep)/30 bg-(--brand-orange-soft) px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-(--brand-orange-deep) shadow-xs backdrop-blur-md">
                <Sparkles className="size-3.5 fill-(--brand-orange-deep) text-(--brand-orange-deep)" />
                Featured
              </span>
            ) : project.coverImage ? (
              <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 font-mono text-xs font-semibold text-white backdrop-blur-md">
                {project.category}
              </span>
            ) : (
              <span />
            )}

            <span className="inline-flex items-center gap-1 rounded-full border border-(--brand-line) bg-(--surface-card)/90 px-2.5 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider text-(--brand-muted) shadow-xs backdrop-blur-md">
              {project.status}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {/* Tech Stack Pills */}
          {project.technologies.length > 0 ? (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech.id || tech.name}
                  className="inline-flex items-center gap-1.5 rounded-md border border-(--brand-line) bg-(--surface-strong) px-2.5 py-1 font-mono text-xs font-medium text-(--brand-muted) transition group-hover:border-(--brand-line)/80"
                >
                  <TechIcon
                    src={tech.icon}
                    name={tech.name}
                    color={tech.color}
                    className="size-3.5"
                  />
                  {tech.name}
                </span>
              ))}
              {project.technologies.length > 5 ? (
                <span className="rounded-md border border-(--brand-line) bg-(--surface-strong) px-2 py-1 font-mono text-xs font-medium text-(--brand-muted)">
                  +{project.technologies.length - 5}
                </span>
              ) : null}
            </div>
          ) : null}

          {/* Title */}
          <h3 className="text-xl font-bold text-(--brand-ink) transition group-hover:text-(--brand-orange-deep)">
            <Link
              to="/projects/$slug"
              params={{ slug: project.slug }}
              className="no-underline focus:outline-hidden"
            >
              {project.title}
            </Link>
          </h3>

          {/* Summary */}
          <p className="mt-2.5 text-sm leading-relaxed text-(--brand-muted) line-clamp-3">
            {project.summary}
          </p>
        </div>
      </div>

      {/* Card Footer / Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--brand-line) bg-(--surface-strong)/80 p-4 backdrop-blur-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Production URL */}
          {hasProductionUrl ? (
            <a
              href={project.productionUrl!}
              target="_blank"
              rel="noreferrer"
              title="Visit Live Site"
              className="inline-flex items-center gap-1.5 rounded-full border border-(--brand-line) bg-(--surface-card) px-3 py-1.5 text-xs font-semibold text-(--brand-ink) no-underline transition hover:border-(--brand-orange) hover:text-(--brand-orange-deep) hover:shadow-xs"
            >
              <Globe className="size-3.5 text-(--brand-orange-deep)" />
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
              className="inline-flex items-center gap-1.5 rounded-full border border-(--brand-line) bg-(--surface-card) px-3 py-1.5 text-xs font-semibold text-(--brand-ink) no-underline transition hover:border-(--brand-orange) hover:text-(--brand-orange-deep) hover:shadow-xs"
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
              className="inline-flex items-center gap-1.5 rounded-full border border-(--brand-line) bg-(--surface-card) px-3 py-1.5 text-xs font-semibold text-(--brand-ink) no-underline transition hover:border-(--brand-orange) hover:text-(--brand-orange-deep) hover:shadow-xs"
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
          className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-(--brand-orange-deep) no-underline transition hover:translate-x-1"
        >
          Detail
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  )
}
