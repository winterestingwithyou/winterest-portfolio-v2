import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { writingEntries } from '#/features/portfolio/data'

export const Route = createFileRoute('/writing')({
  component: WritingPage,
})

function WritingPage() {
  return (
    <main className="px-4 py-14 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="Writing"
          title="Technical notes, devlogs, and decisions as the platform grows."
          description="Writing starts as structured seed entries. Later, the CMS can own drafts, published posts, tags, and cover metadata."
        />

        <div className="grid gap-5">
          {writingEntries.map((entry) => (
            <Link
              key={entry.slug}
              to="/writing/$slug"
              params={{ slug: entry.slug }}
              className="surface-card grid gap-5 p-6 text-[var(--brand-ink)] no-underline transition hover:-translate-y-1 hover:border-[var(--brand-orange)] md:grid-cols-[3rem_1fr]"
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
            </Link>
          ))}
        </div>
      </Container>
    </main>
  )
}
