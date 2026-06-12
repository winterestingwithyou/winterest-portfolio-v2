import { createFileRoute } from '@tanstack/react-router'

import { Container, SectionHeader } from '#/components/marketing/section'
import { principles, siteProfile, timeline } from '#/features/portfolio/data'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <main className="px-4 py-14 sm:py-20">
      <Container>
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow mb-4">About</p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[var(--brand-ink)] sm:text-5xl">
              Building a personal platform, not just another resume page.
            </h1>
          </div>
          <div className="surface-card p-6 sm:p-8">
            <p className="text-lg leading-8 text-[var(--brand-muted)]">
              I am {siteProfile.name}, also building as {siteProfile.handle}.
              Winterest is where my portfolio, project notes, experiments, and
              CMS tooling will meet in one Cloudflare-first web platform.
            </p>
            <p className="mt-5 text-base leading-8 text-[var(--brand-muted)]">
              The current focus is replacing starter content with a credible
              public shell. After that, the project can grow toward D1 content,
              dashboard workflows, Better Auth, RBAC, and optional visual polish
              without losing the foundation.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <SectionHeader
            eyebrow="Roadmap"
            title="A gradual path from portfolio to developer platform."
          />
          <div className="grid gap-4">
            {timeline.map((item) => (
              <article
                key={item.title}
                className="surface-card grid gap-4 p-5 sm:grid-cols-[8rem_1fr]"
              >
                <p className="m-0 text-sm font-bold text-[var(--brand-orange-deep)]">
                  {item.period}
                </p>
                <div>
                  <h2 className="text-xl font-semibold text-[var(--brand-ink)]">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeader
            eyebrow="Principles"
            title="The project should feel technical, personal, and useful."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {principles.map((principle) => (
              <article key={principle.title} className="surface-card p-6">
                <h2 className="text-xl font-semibold text-[var(--brand-ink)]">
                  {principle.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </main>
  )
}
