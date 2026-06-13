import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { SignalPreview } from '#/components/visual/SignalPreview'
import { getPublishedWritingEntries } from '#/features/content/public-loaders'
import { getPublicCopy } from '#/features/portfolio/data'
import { getLocale } from '#/paraglide/runtime'

export const Route = createFileRoute('/writing/')({
  loader: () => getPublishedWritingEntries({ data: { locale: getLocale() } }),
  component: WritingPage,
})

function WritingPage() {
  const copy = getPublicCopy()
  const entries = Route.useLoaderData()

  return (
    <main className="px-4 py-14 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow={copy.writing.eyebrow}
          title={copy.writing.title}
          description={copy.writing.description}
        />

        <div className="grid gap-5">
          {entries.length === 0 ? (
            <div className="surface-card p-6">
              <h2 className="text-2xl font-semibold text-[var(--brand-ink)]">
                {copy.writing.emptyTitle}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--brand-muted)]">
                {copy.writing.emptyDescription}
              </p>
            </div>
          ) : null}
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              to="/writing/$slug"
              params={{ slug: entry.slug }}
              className="surface-card grid gap-5 p-6 text-[var(--brand-ink)] no-underline transition hover:-translate-y-1 hover:border-[var(--brand-orange)] lg:grid-cols-[3rem_1fr_16rem] lg:items-center"
            >
              <div className="grid size-11 place-items-center rounded-lg bg-[var(--brand-orange-soft)] text-[var(--brand-orange-deep)]">
                <BookOpen aria-hidden="true" className="size-5" />
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--brand-orange-deep)]">
                  {entry.status}
                </p>
                <h2 className="text-2xl font-semibold">{entry.title}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--brand-muted)]">
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
              </div>
              <SignalPreview
                eyebrow={copy.writing.devlog}
                title={entry.status}
                items={entry.tags}
                variant="writing"
                compact
              />
            </Link>
          ))}
        </div>
      </Container>
    </main>
  )
}
