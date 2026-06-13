import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, CalendarDays, Layers3, Rocket } from 'lucide-react'
import type { ReactNode } from 'react'

import { Container } from '#/components/marketing/section'
import { getProjectBySlug, getPublicCopy } from '#/features/portfolio/data'

export const Route = createFileRoute('/projects/$slug')({
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const copy = getPublicCopy()
  const { slug } = Route.useParams()
  const project = getProjectBySlug(slug)

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
                label={copy.projectDetail.phase}
                value={project.phase}
              />
              <MetaItem
                icon={<CalendarDays aria-hidden="true" className="size-4" />}
                label={copy.projectDetail.year}
                value={project.year}
              />
            </div>
            <div className="mt-5 border-t border-[var(--brand-line)] pt-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand-orange-deep)]">
                {copy.projectDetail.scope}
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">
                {project.scope}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold text-[var(--brand-muted)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {project.metrics.map((metric) => (
            <article key={metric.label} className="surface-card p-5">
              <p className="text-sm font-semibold text-[var(--brand-muted)]">
                {metric.label}
              </p>
              <p className="mt-2 text-3xl font-semibold text-[var(--brand-ink)]">
                {metric.value}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-3">
          <InfoBlock
            title={copy.projectDetail.problem}
            text={project.problem}
          />
          <InfoBlock title={copy.projectDetail.goal} text={project.goal} />
          <InfoBlock title={copy.projectDetail.role} text={project.role} />
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-2">
          <ListBlock
            title={copy.projectDetail.architecture}
            items={project.architecture}
          />
          <ListBlock
            title={copy.projectDetail.highlights}
            items={project.highlights}
          />
          <ListBlock
            title={copy.projectDetail.decisions}
            items={project.decisions}
          />
          <ListBlock
            title={copy.projectDetail.nextSteps}
            items={project.nextSteps}
          />
        </section>

        <section className="mt-12 surface-card p-6 sm:p-8">
          <p className="eyebrow mb-3">{copy.projectDetail.result}</p>
          <p className="m-0 max-w-3xl text-lg leading-8 text-[var(--brand-muted)]">
            {project.result}
          </p>
        </section>
      </Container>
    </main>
  )
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

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <article className="surface-card p-6">
      <h2 className="text-xl font-semibold text-[var(--brand-ink)]">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">{text}</p>
    </article>
  )
}

function ListBlock({
  title,
  items,
}: {
  title: string
  items: readonly string[]
}) {
  return (
    <article className="surface-card p-6">
      <h2 className="text-xl font-semibold text-[var(--brand-ink)]">{title}</h2>
      <ul className="mt-4 space-y-3 pl-5 text-sm leading-7 text-[var(--brand-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}
