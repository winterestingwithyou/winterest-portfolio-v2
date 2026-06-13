import { createFileRoute } from '@tanstack/react-router'
import { Image } from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { getDashboardCopy } from '#/features/dashboard/copy'

export const Route = createFileRoute('/dashboard/media')({
  component: DashboardMedia,
})

function DashboardMedia() {
  const copy = getDashboardCopy()

  return (
    <DashboardShell
      title={copy.media.title}
      description={copy.media.description}
    >
      <section className="surface-card p-6">
        <div className="grid size-11 place-items-center rounded-lg bg-[var(--brand-orange-soft)] text-[var(--brand-orange-deep)]">
          <Image aria-hidden="true" className="size-5" />
        </div>
        <h2 className="mt-5 text-xl font-semibold text-[var(--brand-ink)]">
          {copy.media.emptyTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--brand-muted)]">
          {copy.media.emptyDescription}
        </p>
      </section>
    </DashboardShell>
  )
}
