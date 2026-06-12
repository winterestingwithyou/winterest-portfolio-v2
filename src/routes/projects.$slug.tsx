import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Container } from '#/components/marketing/section'
import { getProjectBySlug } from '#/features/portfolio/data'

export const Route = createFileRoute('/projects/$slug')({
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { slug } = Route.useParams()
  const project = getProjectBySlug(slug)

  if (!project) {
    return (
      <main className="px-4 py-20">
        <Container>
          <div className="surface-card max-w-2xl p-8">
            <p className="eyebrow mb-3">Project not found</p>
            <h1 className="text-3xl font-semibold text-[var(--brand-ink)]">
              This case study does not exist yet.
            </h1>
            <Link
              to="/projects"
              className="mt-6 inline-flex text-sm font-bold text-[var(--brand-orange-deep)] no-underline"
            >
              Back to projects
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
          Projects
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
            <p className="text-sm font-bold text-[var(--brand-orange-deep)]">
              {project.status}
            </p>
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

        <section className="mt-12 grid gap-5 lg:grid-cols-3">
          <InfoBlock title="Problem" text={project.problem} />
          <InfoBlock title="Goal" text={project.goal} />
          <InfoBlock title="Role" text={project.role} />
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-2">
          <ListBlock title="Architecture" items={project.architecture} />
          <ListBlock title="Highlights" items={project.highlights} />
        </section>

        <section className="mt-12 surface-card p-6 sm:p-8">
          <p className="eyebrow mb-3">Result</p>
          <p className="m-0 max-w-3xl text-lg leading-8 text-[var(--brand-muted)]">
            {project.result}
          </p>
        </section>
      </Container>
    </main>
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
