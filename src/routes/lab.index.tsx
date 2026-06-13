import { createFileRoute, Link } from '@tanstack/react-router'
import { FlaskConical } from 'lucide-react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { SignalPreview } from '#/components/visual/SignalPreview'
import { getPublishedLabEntries } from '#/features/content/public-loaders'
import { getPortfolioContent, getPublicCopy } from '#/features/portfolio/data'

export const Route = createFileRoute('/lab/')({
  loader: () => getPublishedLabEntries(),
  component: LabPage,
})

function LabPage() {
  const copy = getPublicCopy()
  const { labEntries } = getPortfolioContent()
  const publishedEntries = Route.useLoaderData()
  const entries = publishedEntries.length > 0 ? publishedEntries : labEntries

  return (
    <main className="px-4 py-14 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow={copy.lab.eyebrow}
          title={copy.lab.title}
          description={copy.lab.description}
        />

        <div className="grid gap-5 md:grid-cols-3">
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              to="/lab/$slug"
              params={{ slug: entry.slug }}
              className="surface-card block p-6 text-[var(--brand-ink)] no-underline transition hover:-translate-y-1 hover:border-[var(--brand-orange)]"
            >
              <div className="mb-5 grid size-11 place-items-center rounded-lg bg-[var(--brand-orange-soft)] text-[var(--brand-orange-deep)]">
                <FlaskConical aria-hidden="true" className="size-5" />
              </div>
              <div className="mb-5">
                <SignalPreview
                  eyebrow={copy.lab.experiment}
                  title={entry.status}
                  items={entry.tags}
                  variant="lab"
                  compact
                />
              </div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--brand-orange-deep)]">
                {entry.status}
              </p>
              <h2 className="text-xl font-semibold">{entry.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
                {entry.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold text-[var(--brand-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  )
}
