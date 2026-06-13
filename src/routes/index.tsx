import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Code2,
  Github,
  Mail,
  Rocket,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { HeroVisual } from '#/components/visual/HeroVisual'
import {
  getPortfolioContent,
  getPublicCopy,
  siteProfile,
} from '#/features/portfolio/data'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const copy = getPublicCopy()
  const {
    featuredProjects,
    labEntries,
    portfolioStats,
    principles,
    stackGroups,
  } = getPortfolioContent()
  const highlightedProjects = featuredProjects.filter(
    (project) => project.featured,
  )

  return (
    <main>
      <section className="px-4 pb-16 pt-14 sm:pb-24 sm:pt-20">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow mb-5">{copy.home.eyebrow}</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-[var(--brand-ink)] sm:text-6xl lg:text-7xl">
              {copy.home.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--brand-muted)]">
              {copy.home.intro}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--brand-orange)] px-5 text-sm font-bold text-white no-underline shadow-[0_18px_48px_var(--brand-glow)] transition hover:-translate-y-0.5"
              >
                {copy.home.viewProjects}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <a
                href={siteProfile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-5 text-sm font-bold text-[var(--brand-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[var(--brand-orange)]"
              >
                <Github aria-hidden="true" className="size-4" />
                GitHub
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {portfolioStats.map((stat) => (
                <div key={stat.label} className="surface-card p-4">
                  <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--brand-muted)]">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--brand-ink)]">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <HeroVisual />
        </Container>
      </section>

      <section className="px-4 py-14">
        <Container>
          <SectionHeader
            eyebrow={copy.home.featuredEyebrow}
            title={copy.home.featuredTitle}
            description={copy.home.featuredDescription}
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {highlightedProjects.map((project) => (
              <article key={project.slug} className="surface-card p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[var(--brand-orange-soft)] px-3 py-1 text-xs font-bold text-[var(--brand-orange-deep)]">
                    {project.status}
                  </span>
                  <span className="text-sm font-medium text-[var(--brand-muted)]">
                    {project.category}
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-[var(--brand-ink)]">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
                  {project.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.slice(0, 4).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold text-[var(--brand-muted)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <Link
                  to="/projects/$slug"
                  params={{ slug: project.slug }}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-orange-deep)] no-underline"
                >
                  {copy.home.readCaseStudy}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="px-4 py-14">
        <Container>
          <SectionHeader
            eyebrow={copy.home.labEyebrow}
            title={copy.home.labTitle}
            description={copy.home.labDescription}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {labEntries.map((entry) => (
              <Link
                key={entry.slug}
                to="/lab/$slug"
                params={{ slug: entry.slug }}
                className="surface-card block p-5 text-[var(--brand-ink)] no-underline transition hover:-translate-y-1 hover:border-[var(--brand-orange)]"
              >
                <div className="mb-5 grid size-10 place-items-center rounded-lg bg-[var(--brand-orange-soft)] text-[var(--brand-orange-deep)]">
                  <Zap aria-hidden="true" className="size-5" />
                </div>
                <h3 className="text-lg font-semibold">{entry.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
                  {entry.summary}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="px-4 py-14">
        <Container>
          <SectionHeader
            eyebrow={copy.home.principlesEyebrow}
            title={copy.home.principlesTitle}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {principles.map((principle, index) => {
              const Icon = index === 0 ? Rocket : index === 1 ? Code2 : Sparkles

              return (
                <article key={principle.title} className="surface-card p-6">
                  <div className="mb-5 grid size-11 place-items-center rounded-lg bg-[var(--brand-orange)] text-white">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--brand-ink)]">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
                    {principle.description}
                  </p>
                </article>
              )
            })}
          </div>
        </Container>
      </section>

      <section className="px-4 py-14">
        <Container className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionHeader
            eyebrow="Stack"
            title={copy.home.stackTitle}
            description={copy.home.stackDescription}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {stackGroups.map((group) => (
              <article key={group.title} className="surface-card p-5">
                <h3 className="text-lg font-semibold text-[var(--brand-ink)]">
                  {group.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">
                  {group.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.slice(0, 4).map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-[var(--brand-orange-soft)] px-3 py-1 text-xs font-bold text-[var(--brand-orange-deep)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="px-4 py-14">
        <Container>
          <div className="command-strip grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="m-0 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-orange-200">
                <Terminal aria-hidden="true" className="size-4" />
                bun run build
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                {copy.home.ctaTitle}
              </h2>
            </div>
            <a
              href={`mailto:${siteProfile.contactEmail}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[var(--brand-dark)] no-underline transition hover:-translate-y-0.5"
            >
              <Mail aria-hidden="true" className="size-4" />
              {copy.home.contact}
            </a>
          </div>
        </Container>
      </section>
    </main>
  )
}
