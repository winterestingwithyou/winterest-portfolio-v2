import { createFileRoute } from '@tanstack/react-router'
import { Boxes, Cloud, Database, Palette } from 'lucide-react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { SignalPreview } from '#/components/visual/SignalPreview'
import { stackGroups } from '#/features/portfolio/data'

export const Route = createFileRoute('/stack')({
  component: StackPage,
})

function StackPage() {
  return (
    <main className="px-4 py-14 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow="Stack"
          title="The tools behind the portfolio and future CMS."
          description="The stack stays practical: fast local development, Cloudflare-compatible runtime choices, and enough structure for long-term solo iteration."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {stackGroups.map((group, index) => {
            const Icon =
              index === 0
                ? Cloud
                : index === 1
                  ? Boxes
                  : index === 2
                    ? Database
                    : Palette

            return (
              <article
                key={group.title}
                className="surface-card grid gap-5 p-6 lg:grid-cols-[1fr_14rem] lg:items-center"
              >
                <div>
                  <div className="mb-5 grid size-11 place-items-center rounded-lg bg-[var(--brand-orange)] text-white">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <h2 className="text-2xl font-semibold text-[var(--brand-ink)]">
                    {group.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
                    {group.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold text-[var(--brand-muted)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <SignalPreview
                  eyebrow="Stack node"
                  title={group.title}
                  items={group.items}
                  variant="stack"
                  compact
                />
              </article>
            )
          })}
        </div>
      </Container>
    </main>
  )
}
