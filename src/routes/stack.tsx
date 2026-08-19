import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink, Zap } from 'lucide-react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { Marquee } from '#/components/ui/marquee'
import { TechIcon } from '#/components/ui/tech-icon'
import { getPublicCopy } from '#/features/portfolio/data'
import { getPublicStackData } from '#/features/technologies/public-loaders'

export const Route = createFileRoute('/stack')({
  loader: () => getPublicStackData(),
  component: StackPage,
})

function StackPage() {
  const copy = getPublicCopy()
  const { categories, ultimateTechs } = Route.useLoaderData()

  return (
    <main className="py-14 sm:py-20">
      <Container>
        <SectionHeader
          eyebrow={copy.stack.eyebrow}
          title={copy.stack.title}
          description={copy.stack.description}
        />
      </Container>

      {/* Ultimate Tech Stack Highlight Section */}
      {ultimateTechs.length > 0 && (
        <section className="mt-8 mb-16 w-full">
          <Container className="mb-6">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-(--brand-orange)/40 bg-(--brand-orange-soft) px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-(--brand-orange-deep) shadow-[0_0_20px_var(--brand-orange-soft)]">
                <Zap className="size-3.5 fill-(--brand-orange-deep)" />
                {copy.stack.ultimateEyebrow}
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-(--brand-ink) sm:text-4xl md:text-5xl">
                <span className="bg-linear-to-r from-(--brand-orange) via-(--brand-ink) to-(--brand-orange-deep) bg-clip-text text-transparent">
                  {copy.stack.ultimateTitle}
                </span>
              </h2>
              <p className="mt-2 max-w-xl text-sm font-medium text-(--brand-muted)">
                {copy.stack.ultimateDescription}
              </p>
            </div>
          </Container>

          {/* Edge-to-Edge Marquee for Ultimate Tech Stack */}
          <div className="relative w-full overflow-hidden py-3">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-(--brand-bg) to-transparent sm:w-24" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-(--brand-bg) to-transparent sm:w-24" />

            <Marquee pauseOnHover className="py-6 [--duration:30s]" repeat={4}>
              {ultimateTechs.map((tech) => (
                <div
                  key={tech.id}
                  className="group relative flex w-52 shrink-0 flex-col items-center justify-center gap-4 rounded-3xl border border-(--brand-orange)/40 bg-linear-to-b from-(--surface-strong) to-(--brand-orange-soft)/30 p-7 text-center shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-(--brand-orange) hover:bg-(--surface-strong) hover:shadow-[0_20px_35px_var(--brand-orange-soft)] sm:w-60"
                >
                  {/* Subtle Ultimate Glow Badge */}
                  <div className="absolute top-3 right-3 rounded-full bg-(--brand-orange) p-1 text-white opacity-80 shadow-md transition group-hover:scale-110 group-hover:opacity-100">
                    <Zap className="size-3 fill-white" />
                  </div>

                  {/* Prominent Centerpiece Icon */}
                  <div className="flex items-center justify-center p-2 transition-transform duration-300 group-hover:scale-110">
                    <TechIcon
                      src={tech.icon}
                      alt={tech.name}
                      color={tech.color}
                      className="size-16 sm:size-20 object-contain drop-shadow-md"
                    />
                  </div>

                  {/* Tech Name & Link */}
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-base text-(--brand-ink) sm:text-lg">
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
                        <ExternalLink className="size-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </Marquee>
          </div>
        </section>
      )}

      {/* Categories Marquee Showcase - Full Window Width */}
      {categories.length === 0 && ultimateTechs.length === 0 ? (
        <Container>
          <div className="surface-card p-8 text-center">
            <h2 className="text-xl font-semibold text-(--brand-ink)">
              Stack items coming soon!
            </h2>
            <p className="mt-2 text-sm text-(--brand-muted)">
              Tech stack database entries are currently being updated.
            </p>
          </div>
        </Container>
      ) : (
        <div className="flex flex-col gap-14 sm:gap-20">
          {categories.map((category, index) => {
            if (category.technologies.length === 0) return null

            return (
              <section key={category.id} className="w-full">
                {/* Centered Highlighted Category Title */}
                <Container className="mb-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <h2 className="text-2xl font-black tracking-tight text-(--brand-ink) sm:text-3xl md:text-4xl">
                      <span className="bg-linear-to-r from-(--brand-ink) via-(--brand-orange-deep) to-(--brand-ink) bg-clip-text text-transparent">
                        {category.name}
                      </span>
                    </h2>
                    <span className="mt-3 h-1 w-12 rounded-full bg-linear-to-r from-(--brand-orange) to-(--brand-orange-deep) opacity-80" />
                  </div>
                </Container>

                {/* Marquee Row - Edge to Edge across full window width */}
                <div className="relative w-full overflow-hidden py-2">
                  {/* Gradient Fade Overlays */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-(--brand-bg) to-transparent sm:w-24" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-(--brand-bg) to-transparent sm:w-24" />

                  <Marquee
                    pauseOnHover
                    reverse={index % 2 === 1}
                    className="py-4 [--duration:35s]"
                    repeat={4}
                  >
                    {category.technologies.map((tech) => (
                      <div
                        key={tech.id}
                        className="group relative flex w-44 shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-(--brand-line)/60 bg-(--surface-strong)/60 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-(--brand-orange) hover:bg-(--surface-strong) hover:shadow-[0_15px_30px_var(--brand-orange-soft)] sm:w-52"
                      >
                        {/* Prominent Centerpiece Icon */}
                        <div className="flex items-center justify-center p-1 transition-transform duration-300 group-hover:scale-110">
                          <TechIcon
                            src={tech.icon}
                            alt={tech.name}
                            color={tech.color}
                            className="size-14 sm:size-16 object-contain"
                          />
                        </div>

                        {/* Tech Name & Link */}
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
              </section>
            )
          })}
        </div>
      )}
    </main>
  )
}
