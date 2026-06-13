import { createFileRoute } from '@tanstack/react-router'

import { Container, SectionHeader } from '#/components/marketing/section'
import { CharacterSpotlight } from '#/components/visual/CharacterSpotlight'
import { getPortfolioContent, getPublicCopy } from '#/features/portfolio/data'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  const copy = getPublicCopy()
  const { principles, timeline } = getPortfolioContent()

  return (
    <main className="px-4 py-14 sm:py-20">
      <Container>
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow mb-4">{copy.about.eyebrow}</p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[var(--brand-ink)] sm:text-5xl">
              {copy.about.title}
            </h1>
          </div>
          <div className="surface-card p-6 sm:p-8">
            <p className="text-lg leading-8 text-[var(--brand-muted)]">
              {copy.about.intro}
            </p>
            <p className="mt-5 text-base leading-8 text-[var(--brand-muted)]">
              {copy.about.body}
            </p>
          </div>
        </section>

        <div className="mt-16">
          <CharacterSpotlight />
        </div>

        <section className="mt-16">
          <SectionHeader
            eyebrow={copy.about.journeyEyebrow}
            title={copy.about.journeyTitle}
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
            eyebrow={copy.home.principlesEyebrow}
            title={copy.about.principlesTitle}
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
