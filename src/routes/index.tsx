import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Code2,
  ExternalLink,
  Github,
  Mail,
  Rocket,
  Sparkles,
  Terminal,
} from 'lucide-react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { Marquee } from '#/components/ui/marquee'
import { TechIcon } from '#/components/ui/tech-icon'
import { HeroVisual } from '#/components/visual/HeroVisual'
import { getPublishedProjects } from '#/features/projects/public-loaders'
import {
  getPortfolioContent,
  getPublicCopy,
  siteProfile,
} from '#/features/portfolio/data'
import { getPublicUltimateStack } from '#/features/technologies/public-loaders'
import { getLocale } from '#/paraglide/runtime'

export const Route = createFileRoute('/')({
  loader: async () => {
    const locale = getLocale()
    const [projects, ultimateTechs] = await Promise.all([
      getPublishedProjects({ data: { locale } }),
      getPublicUltimateStack(),
    ])

    return { projects, ultimateTechs }
  },
  component: HomePage,
})

function HomePage() {
  const copy = getPublicCopy()
  const { projects, ultimateTechs } = Route.useLoaderData()
  const { portfolioStats, principles, stackGroups } = getPortfolioContent()
  const highlightedProjects = projects
    .filter((project) => project.featured)
    .slice(0, 2)

  return (
    <main>
      <section className="px-4 pb-16 pt-14 sm:pb-24 sm:pt-20">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow mb-5">{copy.home.eyebrow}</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-(--brand-ink) sm:text-6xl lg:text-7xl">
              {copy.home.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-(--brand-ink)">
              {copy.home.intro}
            </p>
            <p className="mt-3 max-w-xl text-base leading-7 text-(--brand-muted)">
              {copy.home.introSuffix}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-(--brand-orange) px-5 text-sm font-bold text-white no-underline shadow-[0_18px_48px_var(--brand-glow)] transition hover:-translate-y-0.5"
              >
                {copy.home.viewProjects}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <a
                href={siteProfile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-(--brand-line) bg-(--surface-strong) px-5 text-sm font-bold text-(--brand-ink) no-underline transition hover:-translate-y-0.5 hover:border-(--brand-orange)"
              >
                <Github aria-hidden="true" className="size-4" />
                GitHub
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {portfolioStats.map((stat) => (
                <div key={stat.label} className="surface-card p-4">
                  <p className="m-0 text-xs font-semibold uppercase tracking-wide text-(--brand-muted)">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-(--brand-ink)">
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
            {highlightedProjects.length === 0 ? (
              <div className="surface-card p-6 lg:col-span-2">
                <h3 className="text-2xl font-semibold text-(--brand-ink)">
                  {copy.projects.emptyTitle}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-(--brand-muted)">
                  {copy.projects.emptyDescription}
                </p>
              </div>
            ) : null}
            {highlightedProjects.map((project) => (
              <article key={project.slug} className="surface-card p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-(--brand-orange-soft) px-3 py-1 text-xs font-bold text-(--brand-orange-deep)">
                    {project.status}
                  </span>
                  <span className="text-sm font-medium text-(--brand-muted)">
                    {project.category}
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-(--brand-ink)">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-(--brand-muted)">
                  {project.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.technologies.slice(0, 4).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-(--brand-line) bg-(--surface-strong) px-3 py-1 text-xs font-semibold text-(--brand-muted)"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <Link
                  to="/projects/$slug"
                  params={{ slug: project.slug }}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-(--brand-orange-deep) no-underline"
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
            eyebrow={copy.home.principlesEyebrow}
            title={copy.home.principlesTitle}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {principles.map((principle, index) => {
              const Icon = index === 0 ? Rocket : index === 1 ? Code2 : Sparkles

              return (
                <article key={principle.title} className="surface-card p-6">
                  <div className="mb-5 grid size-11 place-items-center rounded-lg bg-(--brand-orange) text-white">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-(--brand-ink)">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-(--brand-muted)">
                    {principle.description}
                  </p>
                </article>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Ultimate Tech Stack Marquee Section */}
      <section className="py-14">
        <Container>
          <SectionHeader
            eyebrow={copy.stack.ultimateEyebrow}
            title={copy.home.stackTitle}
            description={copy.home.stackDescription}
          />
        </Container>

        {ultimateTechs.length > 0 ? (
          <div className="relative mt-8 w-full overflow-hidden py-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-(--brand-bg) to-transparent sm:w-24" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-(--brand-bg) to-transparent sm:w-24" />

            <Marquee pauseOnHover className="py-4 [--duration:30s]" repeat={4}>
              {ultimateTechs.map((tech) => (
                <div
                  key={tech.id}
                  className="group relative flex w-44 shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-(--brand-line)/60 bg-(--surface-strong)/60 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-(--brand-orange) hover:bg-(--surface-strong) hover:shadow-xl hover:shadow-(--brand-orange-soft) sm:w-52"
                >
                  <div className="flex items-center justify-center p-1 transition-transform duration-300 group-hover:scale-110">
                    <TechIcon
                      src={tech.icon}
                      alt={tech.name}
                      color={tech.color}
                      className="size-12 sm:size-14 object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-(--brand-ink) sm:text-base">
                      {tech.name}
                    </h3>
                    {tech.url ? (
                      <a
                        href={tech.url}
                        target="_blank"
                        rel="noreferrer"
                        title={`Visit ${tech.name}`}
                        className="text-(--brand-muted) opacity-0 transition group-hover:opacity-100 hover:text-(--brand-orange-deep)"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </Marquee>
          </div>
        ) : (
          <Container className="mt-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {stackGroups.map((group) => (
                <article key={group.title} className="surface-card p-5">
                  <h3 className="text-lg font-semibold text-(--brand-ink)">
                    {group.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-(--brand-muted)">
                    {group.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.items.slice(0, 4).map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-(--brand-orange-soft) px-3 py-1 text-xs font-bold text-(--brand-orange-deep)"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </Container>
        )}
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
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-(--brand-dark) no-underline transition hover:-translate-y-0.5"
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
