import { createFileRoute } from '@tanstack/react-router'

import { Container, SectionHeader } from '#/components/marketing/section'
import { getPublishedProjects } from '#/features/projects/public-loaders'
import {
  getPortfolioContent,
  getPublicCopy,
  siteProfile,
} from '#/features/portfolio/data'

export const Route = createFileRoute('/resume')({
  loader: () => getPublishedProjects(),
  component: ResumePage,
})

function ResumePage() {
  const copy = getPublicCopy()
  const projects = Route.useLoaderData()
  const { stackGroups, timeline } = getPortfolioContent()

  return (
    <main className="px-4 py-14 print:bg-white sm:py-20">
      <Container>
        <SectionHeader
          eyebrow={copy.resume.eyebrow}
          title={siteProfile.name}
          description={copy.resume.description}
        />

        <div className="surface-card p-6 print:border print:bg-white print:shadow-none sm:p-8">
          <section className="grid gap-6 border-b border-[var(--brand-line)] pb-8 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <h1 className="text-3xl font-semibold text-[var(--brand-ink)]">
                {siteProfile.name}
              </h1>
              <p className="mt-2 text-sm font-semibold text-[var(--brand-orange-deep)]">
                {siteProfile.handle} | {siteProfile.domain}
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--brand-muted)]">
                {copy.resume.longIntro}
              </p>
            </div>
            <div className="text-sm leading-7 text-[var(--brand-muted)] md:text-right">
              <p>{siteProfile.location}</p>
              <p>{siteProfile.contactEmail}</p>
              <p>{siteProfile.githubUrl}</p>
            </div>
          </section>

          <section className="grid gap-8 border-b border-[var(--brand-line)] py-8 md:grid-cols-[12rem_1fr]">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--brand-orange-deep)]">
              {copy.resume.selectedWork}
            </h2>
            <div className="grid gap-6">
              {projects.length === 0 ? (
                <p className="text-sm leading-7 text-[var(--brand-muted)]">
                  {copy.projects.emptyDescription}
                </p>
              ) : null}
              {projects.map((project) => (
                <article key={project.slug}>
                  <h3 className="text-xl font-semibold text-[var(--brand-ink)]">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">
                    {project.summary}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--brand-orange-deep)]">
                    {project.technologies.join(' | ')}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-8 border-b border-[var(--brand-line)] py-8 md:grid-cols-[12rem_1fr]">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--brand-orange-deep)]">
              {copy.resume.direction}
            </h2>
            <div className="grid gap-5">
              {timeline.map((item) => (
                <article key={item.title}>
                  <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand-orange-deep)]">
                    {item.period}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-[var(--brand-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-8 pt-8 md:grid-cols-[12rem_1fr]">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--brand-orange-deep)]">
              {copy.resume.stack}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {stackGroups.map((group) => (
                <article key={group.title}>
                  <h3 className="font-semibold text-[var(--brand-ink)]">
                    {group.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">
                    {group.items.join(', ')}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </main>
  )
}
