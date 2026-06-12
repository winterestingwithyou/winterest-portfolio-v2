import { createFileRoute } from '@tanstack/react-router'

import { Container, SectionHeader } from '#/components/marketing/section'
import { CharacterSpotlight } from '#/components/visual/CharacterSpotlight'
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
              A closer look at Winterest, the developer behind this space.
            </h1>
          </div>
          <div className="surface-card p-6 sm:p-8">
            <p className="text-lg leading-8 text-[var(--brand-muted)]">
              I build online as {siteProfile.name}. I enjoy turning ideas into
              practical web systems: interfaces that feel calm, backend flows
              that stay understandable, and tools that make future work easier.
            </p>
            <p className="mt-5 text-base leading-8 text-[var(--brand-muted)]">
              Winterest is my public home for that process. It gathers project
              case studies, technical notes, experiments, and a little visual
              personality so the site can show both the finished work and the
              thinking behind it.
            </p>
          </div>
        </section>

        <div className="mt-16">
          <CharacterSpotlight />
        </div>

        <section className="mt-16">
          <SectionHeader
            eyebrow="Journey"
            title="What this space is becoming."
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
            title="The values I want this work to carry."
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
