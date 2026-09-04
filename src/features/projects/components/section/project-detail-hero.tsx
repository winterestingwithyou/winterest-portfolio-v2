import { CheckCircle2, ExternalLink, Github, Globe } from 'lucide-react'

import type { getPublishedProject } from '#/features/projects/public-loaders'

type ProjectDetailHeroProps = {
  project: NonNullable<Awaited<ReturnType<typeof getPublishedProject>>>
}

export function ProjectDetailHero({ project }: ProjectDetailHeroProps) {
  const isPublicRepo =
    project.repoVisibility === 'public' && Boolean(project.repoUrl)

  return (
    <>
      {/* Hero Card */}
      <div className="surface-card overflow-hidden p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-(--brand-orange-soft) px-3.5 py-1 font-mono text-xs font-bold uppercase text-(--brand-orange-deep)">
            {project.category}
          </span>
          {project.status === 'in_progress' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span className="size-1.5 rounded-full bg-sky-500 animate-pulse" />
              In Progress
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-(--brand-line) bg-(--surface-strong) px-3 py-1 text-xs font-semibold text-(--brand-muted)">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              {project.status}
            </span>
          )}
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-(--brand-ink) sm:text-5xl">
          {project.title}
        </h1>

        <p className="mt-4 max-w-4xl text-base leading-relaxed text-(--brand-muted) sm:text-lg">
          {project.summary}
        </p>

        {/* Action buttons */}
        <div className="mt-8 flex flex-wrap gap-3 border-t border-(--brand-line) pt-6">
          {project.productionUrl ? (
            <a
              href={project.productionUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-(--brand-orange) px-5 text-sm font-bold text-white no-underline transition hover:-translate-y-0.5"
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
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-(--brand-line) bg-(--surface-strong) px-5 text-sm font-bold text-(--brand-ink) no-underline transition hover:border-(--brand-orange)"
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
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-(--brand-line) bg-(--surface-strong) px-5 text-sm font-bold text-(--brand-ink) no-underline transition hover:border-(--brand-orange)"
            >
              <Github className="size-4" />
              Repository
            </a>
          ) : null}
        </div>
      </div>

      {/* Cover Image Banner (if available) */}
      {project.coverImage ? (
        <div className="mt-8 aspect-21/9 w-full overflow-hidden rounded-2xl border border-(--brand-line) shadow-md">
          <img
            src={project.coverImage}
            alt={project.title}
            className="size-full object-cover"
          />
        </div>
      ) : null}
    </>
  )
}
