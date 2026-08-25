import { createFileRoute } from '@tanstack/react-router'

import { Container, SectionHeader } from '#/components/marketing/section'
import {
  getPortfolioContent,
  getPublicCopy,
  siteProfile,
} from '#/features/portfolio/data'
import { getPublishedProjects } from '#/features/projects/public-loaders'
import { getPublicStackData } from '#/features/technologies/public-loaders'
import { getLocale } from '#/paraglide/runtime'

export const Route = createFileRoute('/resume')({
  loader: async () => {
    const [projects, stackData] = await Promise.all([
      getPublishedProjects({ data: { locale: getLocale() } }),
      getPublicStackData(),
    ])
    return { projects, ...stackData }
  },
  component: ResumePage,
})

function ResumePage() {
  const copy = getPublicCopy()
  const { projects, categories } = Route.useLoaderData()
  const { timeline } = getPortfolioContent()

  return (
    <main className="px-4 py-14 print:bg-white sm:py-20">
      <Container>
        <SectionHeader
          eyebrow={copy.resume.eyebrow}
          title={siteProfile.name}
          description={copy.resume.description}
        />

        <div className="surface-card p-6 print:border print:bg-white print:shadow-none sm:p-8">
          <section className="grid gap-6 border-b border-(--brand-line) pb-8 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <h1 className="text-3xl font-semibold text-(--brand-ink)">
                {siteProfile.name}
              </h1>
              <p className="mt-2 text-sm font-semibold text-(--brand-orange-deep)">
                {siteProfile.handle} | {siteProfile.domain}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-(--brand-muted)">
                {copy.resume.longIntro}
              </p>
            </div>
            <div className="rounded-2xl border border-(--brand-line) bg-(--surface-strong) p-4 text-sm leading-7 text-(--brand-ink)">
              <p className="font-semibold">{siteProfile.location}</p>
              <p className="text-(--brand-muted)">{siteProfile.contactEmail}</p>
              <p className="text-(--brand-muted)">{siteProfile.repoUrl}</p>
            </div>
          </section>

          <section className="grid gap-8 border-b border-(--brand-line) py-8 md:grid-cols-[12rem_1fr]">
            <h2 className="text-sm font-bold uppercase tracking-wide text-(--brand-orange-deep)">
              {copy.resume.selectedWork}
            </h2>
            <div className="space-y-6">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="border-b border-(--brand-line) pb-6 last:border-b-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-(--brand-ink)">
                      {project.title}
                    </h3>
                    <span className="text-xs font-semibold uppercase tracking-wide text-(--brand-muted)">
                      {project.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-(--brand-muted)">
                    {project.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((item) => (
                      <span
                        key={item.id}
                        className="rounded-full bg-(--brand-orange-soft) px-3 py-1 text-xs font-bold text-(--brand-orange-deep)"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-8 border-b border-(--brand-line) py-8 md:grid-cols-[12rem_1fr]">
            <h2 className="text-sm font-bold uppercase tracking-wide text-(--brand-orange-deep)">
              {copy.resume.direction}
            </h2>
            <div className="space-y-6">
              {timeline.map((item) => (
                <article key={item.period}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-(--brand-orange-deep)">
                    {item.period}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-(--brand-ink)">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-(--brand-muted)">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {categories.length > 0 && (
            <section className="grid gap-8 pt-8 md:grid-cols-[12rem_1fr]">
              <h2 className="text-sm font-bold uppercase tracking-wide text-(--brand-orange-deep)">
                {copy.resume.stack}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {categories.map((category) => (
                  <article key={category.id}>
                    <h3 className="font-semibold text-(--brand-ink)">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-(--brand-muted)">
                      {category.technologies.map((t) => t.name).join(', ')}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </Container>
    </main>
  )
}
