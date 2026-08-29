import type { getDashboardCopy } from '#/features/dashboard/copy'
import type { getDashboardSummary } from '#/features/dashboard/loaders'

type ContentMixSectionProps = {
  copy: ReturnType<typeof getDashboardCopy>
  summary: Awaited<ReturnType<typeof getDashboardSummary>>
}

export function ContentMixSection({ copy, summary }: ContentMixSectionProps) {
  const contentMix = summary.contentMix.map((item) => ({
    label: copy.shell.nav[item.key],
    value: item.value,
    width:
      summary.totalItems > 0
        ? `${Math.max((item.value / summary.totalItems) * 100, 8)}%`
        : '0%',
  }))

  return (
    <section className="surface-card p-5">
      <h2 className="text-xl font-semibold text-(--brand-ink)">
        {copy.overview.chartTitle}
      </h2>
      <p className="mt-2 text-sm leading-7 text-(--brand-muted)">
        {copy.overview.chartDescription}
      </p>
      <div className="mt-6 grid gap-4">
        {contentMix.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-(--brand-ink)">
                {item.label}
              </span>
              <span className="text-(--brand-muted)">{item.value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-(--brand-orange-soft)">
              <div
                className="h-full rounded-full bg-(--brand-orange)"
                style={{ width: item.width }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
