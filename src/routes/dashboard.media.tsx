import { createFileRoute } from '@tanstack/react-router'
import { Image } from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/DashboardShell'

export const Route = createFileRoute('/dashboard/media')({
  component: DashboardMedia,
})

function DashboardMedia() {
  return (
    <DashboardShell
      title="Media"
      description="Media metadata foundation for future R2 uploads and cover image management."
    >
      <section className="surface-card p-6">
        <div className="grid size-11 place-items-center rounded-lg bg-[var(--brand-orange-soft)] text-[var(--brand-orange-deep)]">
          <Image aria-hidden="true" className="size-5" />
        </div>
        <h2 className="mt-5 text-xl font-semibold text-[var(--brand-ink)]">
          Metadata table ready
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--brand-muted)]">
          The D1 schema now has a media table for filename, URL, MIME type,
          dimensions, size, and alt text. Upload and R2 object workflows can be
          added after writing and lab CRUD are stable.
        </p>
      </section>
    </DashboardShell>
  )
}
