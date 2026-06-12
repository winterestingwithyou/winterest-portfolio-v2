import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, FlaskConical } from 'lucide-react'

import { Container } from '#/components/marketing/section'
import { getPublishedLabEntry } from '#/features/content/public-loaders'
import { getLabEntryBySlug } from '#/features/portfolio/data'

export const Route = createFileRoute('/lab/$slug')({
  loader: ({ params }) => getPublishedLabEntry({ data: params.slug }),
  component: LabDetailPage,
})

function LabDetailPage() {
  const { slug } = Route.useParams()
  const publishedEntry = Route.useLoaderData()
  const entry = publishedEntry ?? getLabEntryBySlug(slug)

  if (!entry) {
    return (
      <main className="px-4 py-20">
        <Container>
          <div className="surface-card max-w-2xl p-8">
            <p className="eyebrow mb-3">Lab entry not found</p>
            <h1 className="text-3xl font-semibold text-[var(--brand-ink)]">
              This experiment is not published yet.
            </h1>
            <Link
              to="/lab"
              className="mt-6 inline-flex text-sm font-bold text-[var(--brand-orange-deep)] no-underline"
            >
              Back to lab
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
          to="/lab"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-orange-deep)] no-underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Lab
        </Link>

        <section className="surface-card p-6 sm:p-8">
          <div className="mb-6 grid size-12 place-items-center rounded-lg bg-[var(--brand-orange-soft)] text-[var(--brand-orange-deep)]">
            <FlaskConical aria-hidden="true" className="size-6" />
          </div>
          <p className="eyebrow mb-4">{entry.status}</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[var(--brand-ink)] sm:text-5xl">
            {entry.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--brand-muted)]">
            {entry.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold text-[var(--brand-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
          {'content' in entry && entry.content ? (
            <div className="mt-8 border-t border-[var(--brand-line)] pt-6 text-sm leading-8 text-[var(--brand-muted)] whitespace-pre-wrap">
              {entry.content}
            </div>
          ) : null}
        </section>
      </Container>
    </main>
  )
}
